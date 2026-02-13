import { db } from '../db.js';
import { weakSignals, strategicAlerts } from '@shared/schema';
import { eq, desc, sql } from 'drizzle-orm';

interface RSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  category: string;
}

interface AnalyzedSignal {
  signalType: string;
  description: string;
  confidence: number;
  impact: string;
  timeline: string;
  source: string;
  sourceUrl: string;
  category: string;
}

const RSS_FEEDS: { url: string; source: string; category: string }[] = [
  { url: 'https://feeds.reuters.com/reuters/businessNews', source: 'Reuters Business', category: 'market' },
  { url: 'https://feeds.reuters.com/reuters/technologyNews', source: 'Reuters Technology', category: 'technology' },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml', source: 'NY Times Business', category: 'market' },
  { url: 'https://feeds.bbci.co.uk/news/business/rss.xml', source: 'BBC Business', category: 'market' },
  { url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=8-K&dateb=&owner=include&count=20&search_text=&action=getcurrent&output=atom', source: 'SEC EDGAR 8-K Filings', category: 'regulatory' },
];

const SIGNAL_TYPE_MAP: Record<string, string[]> = {
  market: ['acquisition', 'merger', 'market share', 'revenue', 'earnings', 'IPO', 'stock', 'valuation', 'growth', 'decline'],
  regulatory: ['regulation', 'compliance', 'SEC', 'FTC', 'antitrust', 'sanctions', 'policy', 'legislation', 'enforcement', 'fine'],
  technology: ['AI', 'artificial intelligence', 'cybersecurity', 'breach', 'cloud', 'digital transformation', 'automation', 'quantum'],
  competitor: ['competitor', 'rival', 'market leader', 'disruption', 'partnership', 'alliance', 'launch', 'expansion'],
  supply_chain: ['supply chain', 'logistics', 'shipping', 'tariff', 'trade war', 'shortage', 'inventory', 'procurement'],
};

const IMPACT_KEYWORDS: Record<string, string[]> = {
  critical: ['crisis', 'breach', 'collapse', 'bankruptcy', 'shutdown', 'emergency', 'catastrophic'],
  high: ['major', 'significant', 'billion', 'disruption', 'transformation', 'acquisition', 'merger'],
  medium: ['growth', 'expansion', 'partnership', 'update', 'change', 'shift'],
  low: ['minor', 'small', 'incremental', 'gradual', 'expected'],
};

function parseXML(xmlText: string): RSSItem[] {
  const items: RSSItem[] = [];
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>|<entry[^>]*>([\s\S]*?)<\/entry>/gi;
  let match;

  while ((match = itemRegex.exec(xmlText)) !== null) {
    const content = match[1] || match[2] || '';
    const titleMatch = content.match(/<title[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/i);
    const descMatch = content.match(/<description[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/description>|<summary[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/summary>/i);
    const linkMatch = content.match(/<link[^>]*>([^<]*)<\/link>|<link[^>]*href="([^"]*)"[^>]*\/>/i);
    const dateMatch = content.match(/<pubDate[^>]*>(.*?)<\/pubDate>|<updated[^>]*>(.*?)<\/updated>/i);

    if (titleMatch) {
      items.push({
        title: titleMatch[1]?.trim() || '',
        description: (descMatch?.[1] || descMatch?.[2] || '').replace(/<[^>]*>/g, '').trim().substring(0, 500),
        link: (linkMatch?.[1] || linkMatch?.[2] || '').trim(),
        pubDate: (dateMatch?.[1] || dateMatch?.[2] || new Date().toISOString()).trim(),
        source: '',
        category: '',
      });
    }
  }
  return items;
}

function classifySignalType(text: string): string {
  const lower = text.toLowerCase();
  let bestType = 'market';
  let bestScore = 0;

  for (const [type, keywords] of Object.entries(SIGNAL_TYPE_MAP)) {
    const score = keywords.filter(kw => lower.includes(kw.toLowerCase())).length;
    if (score > bestScore) { bestScore = score; bestType = type; }
  }
  return bestType;
}

function classifyImpact(text: string): string {
  const lower = text.toLowerCase();
  for (const level of ['critical', 'high', 'medium', 'low']) {
    if (IMPACT_KEYWORDS[level].some(kw => lower.includes(kw))) return level;
  }
  return 'medium';
}

function calculateConfidence(item: RSSItem): number {
  let conf = 50;
  if (item.description.length > 100) conf += 10;
  if (item.source.includes('Reuters') || item.source.includes('SEC')) conf += 15;
  if (item.source.includes('BBC') || item.source.includes('NY Times')) conf += 10;
  const date = new Date(item.pubDate);
  const hoursAgo = (Date.now() - date.getTime()) / (1000 * 60 * 60);
  if (hoursAgo < 6) conf += 15;
  else if (hoursAgo < 24) conf += 10;
  else if (hoursAgo < 72) conf += 5;
  return Math.min(conf, 95);
}

function estimateTimeline(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('immediate') || lower.includes('today') || lower.includes('breaking')) return 'Immediate';
  if (lower.includes('this week') || lower.includes('next week')) return '1-2 weeks';
  if (lower.includes('this month') || lower.includes('quarter')) return '1-3 months';
  if (lower.includes('this year') || lower.includes('annual')) return '3-6 months';
  return '1-3 months';
}

class LiveSignalIngestionService {
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;
  private lastFetchedUrls = new Set<string>();

  async fetchFeed(feed: { url: string; source: string; category: string }): Promise<RSSItem[]> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(feed.url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'ExecuteIQ-Signal-Monitor/1.0' },
      });
      clearTimeout(timeout);

      if (!res.ok) {
        console.log(`⚠ Feed ${feed.source} returned ${res.status}`);
        return [];
      }

      const text = await res.text();
      const items = parseXML(text);
      return items.map(item => ({ ...item, source: feed.source, category: feed.category }));
    } catch (err) {
      console.log(`⚠ Feed ${feed.source} fetch failed: ${err instanceof Error ? err.message : 'unknown'}`);
      return [];
    }
  }

  async ingestAllFeeds(): Promise<AnalyzedSignal[]> {
    const allItems: RSSItem[] = [];

    const results = await Promise.allSettled(RSS_FEEDS.map(feed => this.fetchFeed(feed)));
    for (const result of results) {
      if (result.status === 'fulfilled') {
        allItems.push(...result.value);
      }
    }

    const newItems = allItems.filter(item => {
      const key = `${item.title}:${item.link}`;
      if (this.lastFetchedUrls.has(key)) return false;
      this.lastFetchedUrls.add(key);
      return true;
    });

    if (this.lastFetchedUrls.size > 1000) {
      const arr = Array.from(this.lastFetchedUrls);
      this.lastFetchedUrls = new Set(arr.slice(arr.length - 500));
    }

    const strategicItems = newItems.filter(item => {
      const text = `${item.title} ${item.description}`.toLowerCase();
      return Object.values(SIGNAL_TYPE_MAP).some(keywords =>
        keywords.some(kw => text.includes(kw.toLowerCase()))
      );
    });

    const topItems = strategicItems.slice(0, 10);

    return topItems.map(item => ({
      signalType: classifySignalType(`${item.title} ${item.description}`),
      description: `${item.title}${item.description ? ` — ${item.description.substring(0, 200)}` : ''}`,
      confidence: calculateConfidence(item),
      impact: classifyImpact(`${item.title} ${item.description}`),
      timeline: estimateTimeline(`${item.title} ${item.description}`),
      source: item.source,
      sourceUrl: item.link,
      category: item.category,
    }));
  }

  async persistSignals(signals: AnalyzedSignal[], organizationId: string): Promise<number> {
    let inserted = 0;
    for (const signal of signals) {
      try {
        await db.insert(weakSignals).values({
          organizationId,
          signalType: signal.signalType,
          description: signal.description,
          confidence: String(signal.confidence),
          impact: signal.impact,
          timeline: signal.timeline,
          source: `${signal.source} | ${signal.sourceUrl}`,
          status: 'active',
          relatedScenarios: [],
        });
        inserted++;
      } catch (err) {
        // skip duplicates
      }
    }
    return inserted;
  }

  async generateAlerts(signals: AnalyzedSignal[], organizationId: string): Promise<void> {
    const alertTypeMap: Record<string, 'opportunity' | 'risk' | 'competitive_threat' | 'market_shift' | 'regulatory_change'> = {
      market: 'market_shift',
      regulatory: 'regulatory_change',
      technology: 'opportunity',
      competitor: 'competitive_threat',
      supply_chain: 'risk',
    };

    const criticalSignals = signals.filter(s => s.impact === 'critical' || s.impact === 'high');
    for (const signal of criticalSignals.slice(0, 3)) {
      try {
        await db.insert(strategicAlerts).values({
          organizationId,
          alertType: alertTypeMap[signal.signalType] || 'market_shift',
          title: `Live Signal: ${signal.description.substring(0, 100)}`,
          description: signal.description,
          severity: signal.impact === 'critical' ? 'critical' : 'high',
          status: 'active',
          dataSourcesUsed: [signal.source],
          suggestedActions: [`Review ${signal.signalType} signal from ${signal.source}`, `Assess impact timeline: ${signal.timeline}`],
        });
      } catch (err) {
        // skip duplicates
      }
    }
  }

  async runIngestionCycle(organizationId: string): Promise<{ signals: number; alerts: number }> {
    console.log('📡 Running live signal ingestion cycle...');
    const signals = await this.ingestAllFeeds();
    console.log(`   Found ${signals.length} strategic signals from ${RSS_FEEDS.length} feeds`);

    if (signals.length === 0) return { signals: 0, alerts: 0 };

    const inserted = await this.persistSignals(signals, organizationId);
    await this.generateAlerts(signals, organizationId);
    const alertCount = signals.filter(s => s.impact === 'critical' || s.impact === 'high').length;

    console.log(`   ✅ Persisted ${inserted} signals, generated ${Math.min(alertCount, 3)} alerts`);
    return { signals: inserted, alerts: Math.min(alertCount, 3) };
  }

  start(organizationId: string, intervalMinutes: number = 15): void {
    if (this.isRunning) return;
    this.isRunning = true;

    console.log(`📡 Live Signal Ingestion started (every ${intervalMinutes} min)`);

    this.runIngestionCycle(organizationId).catch(err =>
      console.error('Initial ingestion cycle failed:', err)
    );

    this.intervalId = setInterval(() => {
      this.runIngestionCycle(organizationId).catch(err =>
        console.error('Ingestion cycle failed:', err)
      );
    }, intervalMinutes * 60 * 1000);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('📡 Live Signal Ingestion stopped');
  }

  getStatus(): { running: boolean; feedCount: number; cachedUrls: number } {
    return {
      running: this.isRunning,
      feedCount: RSS_FEEDS.length,
      cachedUrls: this.lastFetchedUrls.size,
    };
  }
}

export const liveSignalIngestionService = new LiveSignalIngestionService();
