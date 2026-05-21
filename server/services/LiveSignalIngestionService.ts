import { db } from '../db.js';
import { weakSignals, strategicAlerts } from '@shared/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { evaluateAndPersistSignals, evaluateLeadingIndicators, evaluateCompoundPatterns } from './SignalEvaluationService.js';

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
  // Market & business news (baseline)
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml', source: 'NY Times Business', category: 'market' },
  { url: 'https://feeds.bbci.co.uk/news/business/rss.xml', source: 'BBC Business', category: 'market' },
  { url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114', source: 'CNBC Business', category: 'market' },
  { url: 'https://feeds.marketwatch.com/marketwatch/topstories/', source: 'MarketWatch', category: 'market' },
  { url: 'https://feeds.npr.org/1006/rss.xml', source: 'NPR Business', category: 'market' },
  { url: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US%3Aen', source: 'Google News Finance', category: 'market' },
  { url: 'https://feeds.feedburner.com/entrepreneur/latest', source: 'Entrepreneur', category: 'market' },
  { url: 'https://feeds.reuters.com/reuters/businessNews', source: 'Reuters Business', category: 'market' },
  // Regulatory & government enforcement
  { url: 'https://www.federalregister.gov/articles/search.rss?conditions%5Bterm%5D=corporate+regulatory+compliance', source: 'Federal Register', category: 'regulatory' },
  { url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=8-K&dateb=&owner=include&count=40&search_text=&output=atom', source: 'SEC EDGAR', category: 'regulatory' },
  { url: 'https://www.ftc.gov/rss.xml', source: 'FTC', category: 'regulatory' },
  { url: 'https://www.justice.gov/rss/news.xml', source: 'DOJ', category: 'regulatory' },
  { url: 'https://www.fda.gov/about-fda/contact-fda/stay-informed/rss-feeds/food-safety-recalls/rss.xml', source: 'FDA', category: 'regulatory' },
  // Cybersecurity & threat intelligence
  { url: 'https://www.cisa.gov/cybersecurity-advisories/all.xml', source: 'CISA', category: 'cybersecurity' },
  // Corporate announcements
  { url: 'https://www.prnewswire.com/rss/news-releases-list.rss', source: 'PR Newswire', category: 'market' },
  // Labor & economic indicators
  { url: 'https://www.bls.gov/feed/bls_latest.rss', source: 'Bureau of Labor Statistics', category: 'economic' },
  { url: 'https://www.federalreserve.gov/feeds/press_all.xml', source: 'Federal Reserve', category: 'economic' },
  // Workplace & environmental enforcement
  { url: 'https://www.osha.gov/news/newsreleases/feed', source: 'OSHA', category: 'regulatory' },
  { url: 'https://www.epa.gov/newsreleases/search/rss', source: 'EPA', category: 'regulatory' },
  // Financial industry regulatory
  { url: 'https://www.finra.org/newsroom/rss.xml', source: 'FINRA', category: 'regulatory' },
  { url: 'https://www.consumerfinance.gov/about-us/newsroom/feed/', source: 'CFPB', category: 'regulatory' },
  // Global health & safety
  { url: 'https://www.who.int/rss-feeds/news-english.xml', source: 'WHO', category: 'health' },
  // Transportation safety
  { url: 'https://www.ntsb.gov/news/press-releases/Pages/feed.aspx', source: 'NTSB', category: 'regulatory' },
  // Geopolitical
  { url: 'https://www.state.gov/press-releases/feed/', source: 'State Dept', category: 'geopolitical' },
  { url: 'https://www.whitehouse.gov/briefing-room/statements-releases/feed/', source: 'White House', category: 'geopolitical' },
  // Additional business news
  { url: 'https://feeds.apnews.com/apf-business', source: 'AP Business', category: 'market' },
  { url: 'https://www.businesswire.com/rss/home/?rss=G1', source: 'Business Wire', category: 'market' },
  // Financial system & banking regulatory
  { url: 'https://www.fdic.gov/news/press-releases/feed.xml', source: 'FDIC', category: 'regulatory' },
  { url: 'https://www.occ.gov/news-issuances/news-releases/feed.xml', source: 'OCC', category: 'regulatory' },
  { url: 'https://home.treasury.gov/system/files/press-releases.rss', source: 'US Treasury', category: 'regulatory' },
  // Health & safety
  { url: 'https://www.hhs.gov/news/press/press-releases/rss.xml', source: 'HHS', category: 'health' },
  // Energy
  { url: 'https://www.eia.gov/rss/todayinenergy.xml', source: 'EIA', category: 'economic' },
  { url: 'https://www.ferc.gov/news-events/news/press-releases/feed', source: 'FERC', category: 'regulatory' },
  // Employment & labor
  { url: 'https://www.eeoc.gov/newsroom/rss.xml', source: 'EEOC', category: 'regulatory' },
  { url: 'https://www.nlrb.gov/news-publications/news-releases/rss.xml', source: 'NLRB', category: 'regulatory' },
  // Trade & customs
  { url: 'https://www.cbp.gov/newsroom/regional-media-release/feed', source: 'CBP', category: 'geopolitical' },
  // International financial regulatory
  { url: 'https://www.fca.org.uk/news/rss.xml', source: 'UK FCA', category: 'regulatory' },
  { url: 'https://www.ecb.europa.eu/rss/press.html', source: 'ECB', category: 'economic' },
  // Cybersecurity threat intelligence
  { url: 'https://isc.sans.edu/rssfeed_full.xml', source: 'SANS Internet Storm Center', category: 'cybersecurity' },
];

const SIGNAL_TYPE_MAP: Record<string, string[]> = {
  market: ['acquisition', 'merger', 'market share', 'revenue', 'earnings', 'IPO', 'stock', 'valuation', 'growth', 'decline'],
  regulatory: ['regulation', 'compliance', 'SEC', 'FTC', 'antitrust', 'sanctions', 'policy', 'legislation', 'enforcement', 'fine', 'DOJ', 'FDA', 'recall', 'violation', 'investigation', 'settlement'],
  technology: ['AI', 'artificial intelligence', 'cloud', 'digital transformation', 'automation', 'quantum', 'software', 'platform'],
  cybersecurity: ['ransomware', 'breach', 'vulnerability', 'exploit', 'malware', 'phishing', 'incident', 'cyberattack', 'zero-day', 'advisory', 'patch', 'CVE', 'CISA', 'threat actor'],
  competitor: ['competitor', 'rival', 'market leader', 'disruption', 'partnership', 'alliance', 'launch', 'expansion'],
  supply_chain: ['supply chain', 'logistics', 'shipping', 'tariff', 'trade war', 'shortage', 'inventory', 'procurement'],
  geopolitical: ['sanctions', 'trade war', 'tariff', 'geopolitical', 'conflict', 'export control', 'diplomatic', 'embargo'],
  economic: ['inflation', 'unemployment', 'interest rate', 'GDP', 'recession', 'jobs report', 'CPI', 'labor market', 'monetary policy', 'federal reserve', 'Fed rate'],
  health: ['outbreak', 'pandemic', 'recall', 'safety alert', 'public health', 'WHO', 'FDA warning', 'contamination', 'epidemic', 'health emergency'],
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
  // Tier 1: authoritative government / regulatory sources — highest confidence
  if (['SEC EDGAR', 'CISA', 'DOJ', 'FTC', 'FDA', 'US Treasury', 'FDIC', 'OCC', 'EEOC', 'NLRB', 'FERC', 'White House', 'UK FCA', 'SANS Internet Storm Center'].some(s => item.source.includes(s))) conf += 20;
  // Tier 2: major wire services, financial regulators, and economic data
  else if (['Reuters', 'Federal Register', 'Federal Reserve', 'EIA', 'ECB', 'HHS', 'CBP'].some(s => item.source.includes(s))) conf += 15;
  // Tier 3: established news and financial media
  else if (['BBC', 'NY Times', 'CNBC', 'MarketWatch', 'PR Newswire', 'Business Wire', 'AP Business'].some(s => item.source.includes(s))) conf += 10;
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

  async fetchFeed(feed: { url: string; source: string; category: string }, attempt = 1): Promise<RSSItem[]> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);

      const res = await fetch(feed.url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'VaughnMartin-Signal-Monitor/1.0' },
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
      if (attempt < 2) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        return this.fetchFeed(feed, attempt + 1);
      }
      console.log(`⚠ Feed ${feed.source} unavailable — skipping`);
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
      description: `${item.title}${item.description ? ` — ${item.description.substring(0, 450)}` : ''}`,
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

  async runIngestionCycle(organizationId: string): Promise<{ signals: number; alerts: number; detections: number }> {
    console.log('📡 Running live signal ingestion cycle...');
    const signals = await this.ingestAllFeeds();
    console.log(`   Found ${signals.length} strategic signals from ${RSS_FEEDS.length} feeds`);

    if (signals.length === 0) return { signals: 0, alerts: 0, detections: 0 };

    const inserted = await this.persistSignals(signals, organizationId);
    await this.generateAlerts(signals, organizationId);
    const alertCount = signals.filter(s => s.impact === 'critical' || s.impact === 'high').length;

    // ── Tier 5: evaluate signals against trigger patterns ──────────────────
    const detections = await evaluateAndPersistSignals(signals, organizationId);

    // ── Tier 6: leading indicator convergence scoring ──────────────────────
    const leadingHits = await evaluateLeadingIndicators(signals, organizationId);
    if (leadingHits > 0) {
      console.log(`   🔮 ${leadingHits} developing situation(s) detected via leading indicators`);
    }

    // ── Tier 7: compound sub-threshold pattern detection ──────────────────
    await evaluateCompoundPatterns(signals, organizationId);

    // ── Tier 8: preparation signal monitoring ─────────────────────────────
    // Treats declining organizational preparedness as a trigger in its own right.
    // Runs after every external signal evaluation cycle (per spec Section 6).
    try {
      const { checkPreparationSignals } = await import('./PreparationSignalService.js');
      const prepResults = await checkPreparationSignals(organizationId);
      const prepFired = prepResults.filter(r => r.triggered).length;
      if (prepFired > 0) {
        console.log(`   🔴 ${prepFired} preparation gap trigger(s) fired — readiness recovery protocols queued`);
      }
    } catch (err) {
      // Non-critical — preparation monitoring failures must not interrupt the main pipeline
      console.error('   [Tier 8] Preparation signal check failed:', err);
    }

    console.log(`   ✅ Persisted ${inserted} signals, ${Math.min(alertCount, 3)} alerts, ${detections} trigger detections`);
    return { signals: inserted, alerts: Math.min(alertCount, 3), detections };
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

export function getFeedCatalog(): { source: string; category: string; url: string }[] {
  return RSS_FEEDS.map(f => ({ source: f.source, category: f.category, url: f.url }));
}
