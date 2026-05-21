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
  jurisdiction: string;             // US | UK | EU | global
  confidenceTier: number;           // 1 | 2 | 3
  // P2: Regulatory enforcement
  enforcementActionType: string | null;
  regulatorAgency: string | null;
  // P3: Cyber threat intelligence
  threatSeverity: string | null;
  exploitStatus: string | null;
  affectedVendor: string | null;
  // P4: Economic indicator
  economicIndicatorType: string | null;
  indicatorDirection: string | null;
  // P5: Trade & geopolitical
  tradeActionType: string | null;
  effectiveTimeline: string | null;
  // P6: Health & safety recall
  recallClass: string | null;
  affectedProductType: string | null;
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

// ── P2: Regulatory enforcement extraction ──────────────────────────────────────
function extractEnforcementActionType(text: string): string | null {
  const t = text.toLowerCase();
  if (t.includes('criminal') || t.includes('indicted') || t.includes('indictment')) return 'criminal_indictment';
  if (t.includes('consent order') || t.includes('consent decree')) return 'consent_order';
  if (t.includes('settlement') || t.includes('settled')) return 'settlement';
  if (t.includes('injunction')) return 'injunction';
  if (t.includes('investigation') || t.includes('investigated') || t.includes('probe')) return 'investigation';
  if (t.includes('fine') || t.includes('penalty') || t.includes('civil penalty')) return 'fine';
  if (t.includes('advisory') || t.includes('guidance') || t.includes('notice')) return 'advisory';
  return null;
}

function extractRegulatoryAgency(source: string): string | null {
  const map: Record<string, string> = {
    'SEC EDGAR': 'SEC', 'FTC': 'FTC', 'DOJ': 'DOJ', 'FDA': 'FDA',
    'EEOC': 'EEOC', 'NLRB': 'NLRB', 'FDIC': 'FDIC', 'OCC': 'OCC',
    'FERC': 'FERC', 'OSHA': 'OSHA', 'EPA': 'EPA', 'FINRA': 'FINRA',
    'CFPB': 'CFPB', 'NTSB': 'NTSB', 'US Treasury': 'Treasury',
    'UK FCA': 'UK FCA', 'Federal Register': 'Federal Register',
  };
  for (const [k, v] of Object.entries(map)) {
    if (source.includes(k)) return v;
  }
  return null;
}

// ── P3: Cyber threat intelligence extraction ───────────────────────────────────
function extractThreatSeverity(text: string): string | null {
  const t = text.toLowerCase();
  if (t.includes('critical severity') || t.includes('cvss 9') || t.includes('cvss 10') || t.includes('actively exploited') || t.includes('critical vulnerability')) return 'critical';
  if (t.includes('high severity') || t.includes('cvss 7') || t.includes('cvss 8') || t.includes('high vulnerability')) return 'high';
  if (t.includes('medium severity') || t.includes('cvss 4') || t.includes('cvss 5') || t.includes('cvss 6')) return 'medium';
  if (t.includes('low severity') || t.includes('cvss 1') || t.includes('cvss 2') || t.includes('cvss 3')) return 'low';
  return null;
}

function extractExploitStatus(text: string): string | null {
  const t = text.toLowerCase();
  if (t.includes('actively exploited') || t.includes('known exploited') || t.includes('exploited in the wild') || t.includes(' kev ')) return 'known_exploited';
  if (t.includes('proof of concept') || t.includes('poc exploit') || t.includes('exploit code')) return 'proof_of_concept';
  if (t.includes('vulnerability') || t.includes('advisory') || t.includes('patch')) return 'theoretical';
  return null;
}

function extractAffectedVendor(text: string): string | null {
  const vendors = ['Microsoft', 'Cisco', 'Fortinet', 'VMware', 'Palo Alto', 'Juniper', 'F5', 'Citrix', 'SolarWinds', 'Ivanti', 'MOVEit', 'Atlassian', 'Apache', 'OpenSSL'];
  for (const v of vendors) {
    if (text.includes(v)) return v;
  }
  return null;
}

// ── P4: Economic indicator extraction ─────────────────────────────────────────
function extractEconomicIndicatorType(text: string, source: string): string | null {
  const t = text.toLowerCase();
  if (t.includes('interest rate') || t.includes('fed rate') || t.includes('rate decision') || t.includes('basis points') || t.includes('rate hike') || t.includes('rate cut')) return 'interest_rate';
  if (t.includes('jobs') || t.includes('employment') || t.includes('unemployment') || t.includes('payroll') || t.includes('nonfarm')) return 'jobs_report';
  if (t.includes('inflation') || t.includes('consumer price') || t.includes('cpi') || t.includes('price index')) return 'CPI';
  if (t.includes('gdp') || t.includes('gross domestic')) return 'GDP';
  if (t.includes('oil') || t.includes('gas price') || t.includes('energy price') || t.includes('crude') || source.includes('EIA')) return 'energy_price';
  if (t.includes('monetary policy') || t.includes('quantitative') || t.includes('balance sheet') || t.includes('fed chair')) return 'monetary_policy';
  return null;
}

function extractIndicatorDirection(text: string): string | null {
  const t = text.toLowerCase();
  if (t.includes('surprise') || t.includes('unexpected') || t.includes('shock') || t.includes('unexpectedly')) return 'unexpected';
  if (t.includes('rises') || t.includes('rose') || t.includes('increases') || t.includes('increased') || t.includes('higher') || t.includes('hikes') || t.includes('hiking')) return 'rising';
  if (t.includes('falls') || t.includes('fell') || t.includes('decreases') || t.includes('decreased') || t.includes('lower') || t.includes('cuts') || t.includes('cut rate')) return 'falling';
  if (t.includes('holds') || t.includes('unchanged') || t.includes('steady') || t.includes('stable') || t.includes('flat')) return 'stable';
  return null;
}

// ── P5: Trade & geopolitical extraction ───────────────────────────────────────
function extractTradeActionType(text: string): string | null {
  const t = text.toLowerCase();
  if (t.includes('executive order') || t.includes('executive action') || t.includes('presidential order')) return 'executive_order';
  if (t.includes('sanction') || t.includes('sanctioned') || t.includes('blacklist') || t.includes('blacklisted')) return 'sanction';
  if (t.includes('tariff') || t.includes('import duty') || t.includes('import tax')) return 'tariff';
  if (t.includes('export control') || t.includes('export restriction') || t.includes('export license')) return 'export_control';
  if (t.includes('embargo') || t.includes('trade ban') || t.includes('import ban')) return 'embargo';
  return null;
}

function extractEffectiveTimeline(text: string): string | null {
  const t = text.toLowerCase();
  if (t.includes('proposed') || t.includes('proposed rule') || t.includes('comment period')) return 'proposed';
  if (t.includes('immediate') || t.includes('effective today') || t.includes('effective immediately') || t.includes('takes effect today')) return 'immediate';
  if (t.includes('90-day') || t.includes('90 day') || t.includes('90 days') || t.includes('three months')) return '90_days';
  if (t.includes('30-day') || t.includes('30 day') || t.includes('30 days') || t.includes('one month')) return '30_days';
  return null;
}

// ── P6: Health & safety recall extraction ─────────────────────────────────────
function extractRecallClass(text: string): string | null {
  const t = text.toLowerCase();
  if (t.includes('class i ') || t.includes('class 1 ') || t.includes('class i recall') || t.includes('most serious recall')) return 'Class_I';
  if (t.includes('class ii ') || t.includes('class 2 ') || t.includes('class ii recall')) return 'Class_II';
  if (t.includes('class iii ') || t.includes('class 3 ') || t.includes('class iii recall')) return 'Class_III';
  return null;
}

function extractAffectedProductType(text: string, source: string): string | null {
  const t = text.toLowerCase();
  if (t.includes('pharmaceutical') || t.includes('drug') || t.includes('medication') || t.includes('medicine') || t.includes('tablet') || t.includes('capsule')) return 'pharma';
  if (t.includes('medical device') || t.includes('implant') || t.includes('surgical') || t.includes('diagnostic device')) return 'medical_device';
  if (t.includes('food') || t.includes('beverage') || t.includes('contamination') || t.includes('listeria') || t.includes('salmonella') || t.includes('e. coli')) return 'food';
  if (t.includes('vehicle') || t.includes('automobile') || t.includes('car recall') || t.includes('nhtsa') || t.includes('airbag')) return 'vehicle';
  if (t.includes('consumer product') || t.includes('cpsc') || t.includes('household')) return 'consumer';
  return null;
}

function inferJurisdiction(source: string): string {
  if (['UK FCA'].some(s => source.includes(s))) return 'UK';
  if (['ECB'].some(s => source.includes(s))) return 'EU';
  if (['WHO', 'State Dept', 'White House'].some(s => source.includes(s))) return 'global';
  return 'US';
}

function getConfidenceTier(source: string): number {
  if (['SEC EDGAR', 'CISA', 'DOJ', 'FTC', 'FDA', 'US Treasury', 'FDIC', 'OCC', 'EEOC', 'NLRB', 'FERC', 'White House', 'UK FCA', 'SANS Internet Storm Center'].some(s => source.includes(s))) return 1;
  if (['Reuters', 'Federal Register', 'Federal Reserve', 'EIA', 'ECB', 'HHS', 'CBP'].some(s => source.includes(s))) return 2;
  return 3;
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

    return topItems.map(item => {
      const fullText = `${item.title} ${item.description}`;
      return {
        signalType: classifySignalType(fullText),
        description: `${item.title}${item.description ? ` — ${item.description.substring(0, 450)}` : ''}`,
        confidence: calculateConfidence(item),
        impact: classifyImpact(fullText),
        timeline: estimateTimeline(fullText),
        source: item.source,
        sourceUrl: item.link,
        category: item.category,
        jurisdiction: inferJurisdiction(item.source),
        confidenceTier: getConfidenceTier(item.source),
        // P2: Regulatory enforcement
        enforcementActionType: extractEnforcementActionType(fullText),
        regulatorAgency: extractRegulatoryAgency(item.source),
        // P3: Cyber threat intelligence
        threatSeverity: extractThreatSeverity(fullText),
        exploitStatus: extractExploitStatus(fullText),
        affectedVendor: extractAffectedVendor(fullText),
        // P4: Economic indicator
        economicIndicatorType: extractEconomicIndicatorType(fullText, item.source),
        indicatorDirection: extractIndicatorDirection(fullText),
        // P5: Trade & geopolitical
        tradeActionType: extractTradeActionType(fullText),
        effectiveTimeline: extractEffectiveTimeline(fullText),
        // P6: Health & safety recall
        recallClass: extractRecallClass(fullText),
        affectedProductType: extractAffectedProductType(fullText, item.source),
      };
    });
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
