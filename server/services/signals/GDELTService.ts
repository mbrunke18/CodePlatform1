import type { QuantitativeSignal } from './types.js';

const GDELT_DOC_API = 'https://api.gdeltproject.org/api/v2/doc/doc';
const LOOKBACK_HOURS = 24;

interface GDELTResponse {
  articles?: GDELTArticle[];
}

interface GDELTArticle {
  url: string;
  url_mobile?: string;
  title: string;
  seendate: string;
  socialimage?: string;
  domain: string;
  language: string;
  sourcecountry: string;
}

const GEOPOLITICAL_QUERIES = [
  { query: 'sanctions OR "supply chain disruption" OR "trade war" OR embargo', trigger: 'Geopolitical Risk Signal', domain: 'geopolitical', label: 'Trade & Sanctions' },
  { query: 'cyberattack OR "data breach" OR ransomware OR "critical infrastructure"', trigger: 'Cybersecurity Breach Signal', domain: 'cybersecurity', label: 'Cyber Threat' },
  { query: '"class action" OR "SEC investigation" OR "DOJ investigation" OR "regulatory fine"', trigger: 'Regulatory Enforcement Action', domain: 'regulatory', label: 'Legal/Regulatory' },
  { query: '"activist investor" OR "hostile takeover" OR "shareholder pressure" OR "proxy fight"', trigger: 'M&A Activity Detected', domain: 'market', label: 'Activist Activity' },
  { query: '"executive departure" OR "CEO resign" OR "CFO resign" OR "board resignation"', trigger: 'Executive Leadership Event', domain: 'reputation', label: 'Leadership Change' },
];

function toneToConfidence(articleCount: number, query: string): number {
  if (articleCount >= 20) return 86;
  if (articleCount >= 10) return 78;
  if (articleCount >= 5) return 70;
  return 62;
}

function articleCountToImpact(count: number): 'critical' | 'high' | 'medium' | 'low' {
  if (count >= 20) return 'critical';
  if (count >= 10) return 'high';
  if (count >= 5) return 'medium';
  return 'low';
}

async function queryGDELT(queryDef: typeof GEOPOLITICAL_QUERIES[0]): Promise<QuantitativeSignal | null> {
  try {
    const timespan = `${LOOKBACK_HOURS}h`;
    const url = new URL(GDELT_DOC_API);
    url.searchParams.set('query', queryDef.query);
    url.searchParams.set('mode', 'artlist');
    url.searchParams.set('maxrecords', '50');
    url.searchParams.set('timespan', timespan);
    url.searchParams.set('format', 'json');
    url.searchParams.set('sort', 'DateDesc');

    const res = await fetch(url.toString(), {
      headers: { 'User-Agent': 'ReadinessOS/1.0 signal-intelligence' },
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) return null;

    const data = await res.json() as GDELTResponse;
    const articles = data.articles || [];
    if (articles.length === 0) return null;

    const domains = [...new Set(articles.map(a => a.domain))].slice(0, 5);
    const countries = [...new Set(articles.map(a => a.sourcecountry).filter(Boolean))].slice(0, 4);
    const topTitles = articles.slice(0, 3).map(a => a.title).join(' | ');
    const confidence = toneToConfidence(articles.length, queryDef.query);
    const impact = articleCountToImpact(articles.length);

    return {
      signalType: queryDef.domain,
      description: `GDELT Event Velocity: ${articles.length} global coverage events in last ${LOOKBACK_HOURS}h for "${queryDef.label}" pattern. Leading sources: ${domains.join(', ')}. Countries: ${countries.join(', ')}. Top headlines: ${topTitles.substring(0, 400)}`,
      confidence,
      impact,
      timeline: '1-7 days',
      source: 'GDELT Project — Global Event Database',
      sourceUrl: url.toString(),
      category: queryDef.domain,
      jurisdiction: 'Global',
      confidenceTier: 2,
      enforcementActionType: null,
      regulatorAgency: null,
      penaltyAmountRange: null,
      namedSector: queryDef.label,
      threatSeverity: impact === 'critical' ? 'critical' : impact === 'high' ? 'high' : 'medium',
      exploitStatus: null,
      affectedVendor: null,
      cveId: null,
      affectedSector: queryDef.label,
      economicIndicatorType: null,
      indicatorDirection: 'increasing',
      indicatorMagnitude: `${articles.length} articles`,
      centralBank: null,
      tradeActionType: queryDef.domain === 'geopolitical' ? 'geopolitical_event' : null,
      effectiveTimeline: null,
      tradePartner: countries[0] || null,
      affectedHsCodes: null,
      recallClass: null,
      affectedProductType: null,
      recallScope: null,
      signalEventType: 'news_velocity_spike',
      metricName: 'Global Article Count (24h)',
      metricValue: articles.length,
      metricThreshold: 5,
      metricUnit: 'articles',
    };
  } catch {
    return null;
  }
}

export async function fetchGDELTSignals(): Promise<QuantitativeSignal[]> {
  const signals: QuantitativeSignal[] = [];

  try {
    const results = await Promise.allSettled(
      GEOPOLITICAL_QUERIES.map(q => queryGDELT(q))
    );

    let detected = 0;
    for (const r of results) {
      if (r.status === 'fulfilled' && r.value) {
        signals.push(r.value);
        detected++;
      }
    }

    console.log(`[GDELT] ${detected} event velocity pattern(s) detected across ${GEOPOLITICAL_QUERIES.length} query domains`);
  } catch (err) {
    console.warn(`[GDELT] Fetch failed:`, err instanceof Error ? err.message : err);
  }

  return signals;
}
