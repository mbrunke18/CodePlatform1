import type { QuantitativeSignal } from './types.js';

const EDGAR_SEARCH = 'https://efts.sec.gov/LATEST/search-index';
const EDGAR_SUBMISSIONS = 'https://data.sec.gov/submissions';

interface EDGARHit {
  _source?: {
    file_date?: string;
    display_date_filed?: string;
    entity_name?: string;
    form_type?: string;
    period_of_report?: string;
    file_num?: string;
  };
}

interface EDGARSearchResult {
  hits?: {
    hits?: EDGARHit[];
    total?: { value: number };
  };
}

function daysAgo(n: number): string {
  const d = new Date(Date.now() - n * 86400000);
  return d.toISOString().split('T')[0];
}

async function searchFilings(formType: string, query: string, days = 3): Promise<EDGARHit[]> {
  try {
    const params = new URLSearchParams({
      q: query,
      dateRange: 'custom',
      startdt: daysAgo(days),
      enddt: daysAgo(0),
      forms: formType,
    });
    const url = `${EDGAR_SEARCH}?${params}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'ReadinessOS/1.0 signal-intelligence@vaughnmartin.com' },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return [];
    const data = await res.json() as EDGARSearchResult;
    return data.hits?.hits || [];
  } catch {
    return [];
  }
}

export async function fetchSECEdgarSignals(): Promise<QuantitativeSignal[]> {
  const signals: QuantitativeSignal[] = [];

  const [filings13D, filings8K, filings13G] = await Promise.allSettled([
    searchFilings('SC 13D', 'activist investor', 7),
    searchFilings('8-K', 'material definitive agreement', 2),
    searchFilings('SC 13G/A', 'schedule 13G amendment', 5),
  ]);

  // ── 13D filings: activist investor taking significant stake ─────────────────
  const hits13D = filings13D.status === 'fulfilled' ? filings13D.value : [];
  if (hits13D.length > 0) {
    const entities = hits13D.slice(0, 5).map(h => h._source?.entity_name || 'Unknown').join(', ');
    signals.push({
      signalType: 'regulatory',
      description: `SEC EDGAR: ${hits13D.length} Schedule 13D filing(s) detected in last 7 days. Activist investor disclosures from: ${entities}. 13D filings indicate an investor has acquired ≥5% of a company's shares with intent to influence management or strategy. This is the opening move in most activist campaigns.`,
      confidence: 91,
      impact: 'high',
      timeline: 'immediate',
      source: 'SEC EDGAR — Schedule 13D',
      sourceUrl: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=SC+13D',
      category: 'regulatory',
      jurisdiction: 'US',
      confidenceTier: 1,
      signalEventType: 'activist_investor',
      enforcementActionType: null,
      regulatorAgency: 'SEC',
      penaltyAmountRange: null,
      namedSector: 'finance',
      threatSeverity: null,
      exploitStatus: null,
      affectedVendor: null,
      cveId: null,
      affectedSector: 'finance',
      economicIndicatorType: null,
      indicatorDirection: null,
      indicatorMagnitude: null,
      centralBank: null,
      tradeActionType: null,
      effectiveTimeline: 'immediate',
      tradePartner: null,
      affectedHsCodes: null,
      recallClass: null,
      affectedProductType: null,
      recallScope: null,
      metricName: '13D Filings (7 days)',
      metricValue: hits13D.length,
      metricThreshold: 1,
      metricUnit: 'filings',
    });
  }

  // ── 8-K material events: significant corporate events ───────────────────────
  const hits8K = filings8K.status === 'fulfilled' ? filings8K.value : [];
  if (hits8K.length >= 3) {
    const entities = hits8K.slice(0, 5).map(h => h._source?.entity_name || 'Unknown').join(', ');
    signals.push({
      signalType: 'market',
      description: `SEC EDGAR: ${hits8K.length} material event 8-K filing(s) in last 48 hours. Companies filing: ${entities}. Elevated 8-K volume indicates significant corporate events (M&A, leadership changes, material agreements, financial restatements) across the market — relevant to competitive positioning and supply chain risk.`,
      confidence: hits8K.length >= 10 ? 85 : 75,
      impact: hits8K.length >= 10 ? 'high' : 'medium',
      timeline: 'near-term',
      source: 'SEC EDGAR — 8-K Material Events',
      sourceUrl: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=8-K',
      category: 'market',
      jurisdiction: 'US',
      confidenceTier: 1,
      signalEventType: 'material_event',
      enforcementActionType: null,
      regulatorAgency: 'SEC',
      penaltyAmountRange: null,
      namedSector: null,
      threatSeverity: null,
      exploitStatus: null,
      affectedVendor: null,
      cveId: null,
      affectedSector: null,
      economicIndicatorType: null,
      indicatorDirection: null,
      indicatorMagnitude: null,
      centralBank: null,
      tradeActionType: null,
      effectiveTimeline: null,
      tradePartner: null,
      affectedHsCodes: null,
      recallClass: null,
      affectedProductType: null,
      recallScope: null,
      metricName: '8-K Filings (48h)',
      metricValue: hits8K.length,
      metricThreshold: 3,
      metricUnit: 'filings',
    });
  }

  // ── 13G/A amendments: institutional position changes ────────────────────────
  const hits13G = filings13G.status === 'fulfilled' ? filings13G.value : [];
  if (hits13G.length >= 5) {
    signals.push({
      signalType: 'market',
      description: `SEC EDGAR: ${hits13G.length} Schedule 13G amendment(s) in last 5 days — institutional investors adjusting significant equity positions. Elevated amendment volume signals portfolio repositioning by major institutions, often preceding broader market moves or industry-specific strategic shifts.`,
      confidence: 76,
      impact: 'medium',
      timeline: 'near-term',
      source: 'SEC EDGAR — Schedule 13G/A',
      sourceUrl: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=SC+13G',
      category: 'market',
      jurisdiction: 'US',
      confidenceTier: 1,
      signalEventType: 'institutional_repositioning',
      enforcementActionType: null,
      regulatorAgency: 'SEC',
      penaltyAmountRange: null,
      namedSector: null,
      threatSeverity: null,
      exploitStatus: null,
      affectedVendor: null,
      cveId: null,
      affectedSector: null,
      economicIndicatorType: null,
      indicatorDirection: null,
      indicatorMagnitude: null,
      centralBank: null,
      tradeActionType: null,
      effectiveTimeline: null,
      tradePartner: null,
      affectedHsCodes: null,
      recallClass: null,
      affectedProductType: null,
      recallScope: null,
      metricName: '13G Amendments (5 days)',
      metricValue: hits13G.length,
      metricThreshold: 5,
      metricUnit: 'filings',
    });
  }

  if (signals.length > 0) {
    console.log(`[SEC EDGAR] ${signals.length} structured filing signal(s) detected`);
  }

  return signals;
}
