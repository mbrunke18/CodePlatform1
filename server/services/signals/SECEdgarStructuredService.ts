import type { QuantitativeSignal } from './types.js';

const EDGAR_SEARCH = 'https://efts.sec.gov/LATEST/search-index';

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
      dateRange: 'custom',
      startdt: daysAgo(days),
      enddt: daysAgo(0),
      forms: formType,
    });
    if (query) params.set('q', query);
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

function extractEntities(hits: EDGARHit[], max = 5): string {
  return hits.slice(0, max)
    .map(h => h._source?.entity_name || 'Unknown')
    .filter(n => n !== 'Unknown')
    .join(', ') || 'various filers';
}

export async function fetchSECEdgarSignals(): Promise<QuantitativeSignal[]> {
  const signals: QuantitativeSignal[] = [];

  // Run all EDGAR queries in parallel — same API, no rate limit issues at this scale
  const [
    filings13D,
    filings8K,
    filings13G,
    filingsFormD,
    filingsTO,
    filings13F,
    filings8KLeadership,
    filings8KEarnings,
    filings8KCovenantDefault,
  ] = await Promise.allSettled([
    searchFilings('SC 13D', 'activist investor', 7),
    searchFilings('8-K', 'material definitive agreement', 2),
    searchFilings('SC 13G/A', 'schedule 13G amendment', 5),
    searchFilings('D', '', 7),                                                      // Form D: new equity offerings (startup/competitive entry)
    searchFilings('SC TO-T', '', 7),                                                // Schedule TO: tender offers (M&A precursor)
    searchFilings('13F-HR', '', 90),                                                // 13F: institutional holdings (M&A position buildup)
    searchFilings('8-K', '"Item 5.02" departure resign terminated director officer', 3), // Executive leadership departure
    searchFilings('8-K', '"Item 2.02" "results of operations" earnings revenue', 2),    // Earnings disclosure
    searchFilings('8-K', '"Item 2.04" covenant default waiver amendment credit', 7),    // Financial distress / covenant breach
  ]);

  // ── 13D: activist investor taking significant stake (≥5%) ───────────────────
  const hits13D = filings13D.status === 'fulfilled' ? filings13D.value : [];
  if (hits13D.length > 0) {
    signals.push({
      signalType: 'regulatory',
      description: `SEC EDGAR: ${hits13D.length} Schedule 13D filing(s) in last 7 days. Activist disclosures from: ${extractEntities(hits13D)}. A 13D filing means an investor acquired ≥5% of shares with intent to influence management or strategy — the opening move of most activist campaigns.`,
      confidence: 91,
      impact: 'high',
      timeline: 'immediate',
      source: 'SEC EDGAR — Schedule 13D (Activist Stake)',
      sourceUrl: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=SC+13D',
      category: 'regulatory',
      jurisdiction: 'US',
      confidenceTier: 1,
      signalEventType: 'activist_investor',
      enforcementActionType: null, regulatorAgency: 'SEC', penaltyAmountRange: null, namedSector: 'Finance',
      threatSeverity: null, exploitStatus: null, affectedVendor: null, cveId: null, affectedSector: 'Finance',
      economicIndicatorType: null, indicatorDirection: null, indicatorMagnitude: null, centralBank: null,
      tradeActionType: null, effectiveTimeline: 'immediate', tradePartner: null, affectedHsCodes: null,
      recallClass: null, affectedProductType: null, recallScope: null,
      metricName: '13D Filings (7 days)', metricValue: hits13D.length, metricThreshold: 1, metricUnit: 'filings',
    });
  }

  // ── 8-K general material events ─────────────────────────────────────────────
  const hits8K = filings8K.status === 'fulfilled' ? filings8K.value : [];
  if (hits8K.length >= 3) {
    signals.push({
      signalType: 'market',
      description: `SEC EDGAR: ${hits8K.length} material event 8-K filings in last 48 hours. Companies: ${extractEntities(hits8K)}. Elevated 8-K volume signals significant corporate events (M&A, leadership changes, agreements, financial restatements) across the market.`,
      confidence: hits8K.length >= 10 ? 85 : 75,
      impact: hits8K.length >= 10 ? 'high' : 'medium',
      timeline: 'near-term',
      source: 'SEC EDGAR — 8-K Material Events',
      sourceUrl: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=8-K',
      category: 'market',
      jurisdiction: 'US',
      confidenceTier: 1,
      signalEventType: 'material_event',
      enforcementActionType: null, regulatorAgency: 'SEC', penaltyAmountRange: null, namedSector: null,
      threatSeverity: null, exploitStatus: null, affectedVendor: null, cveId: null, affectedSector: null,
      economicIndicatorType: null, indicatorDirection: null, indicatorMagnitude: null, centralBank: null,
      tradeActionType: null, effectiveTimeline: null, tradePartner: null, affectedHsCodes: null,
      recallClass: null, affectedProductType: null, recallScope: null,
      metricName: '8-K Filings (48h)', metricValue: hits8K.length, metricThreshold: 3, metricUnit: 'filings',
    });
  }

  // ── 13G/A: institutional position changes ───────────────────────────────────
  const hits13G = filings13G.status === 'fulfilled' ? filings13G.value : [];
  if (hits13G.length >= 5) {
    signals.push({
      signalType: 'market',
      description: `SEC EDGAR: ${hits13G.length} Schedule 13G amendment(s) in last 5 days — institutional investors adjusting significant equity positions. Elevated amendment volume signals portfolio repositioning by major institutions, often preceding broader market moves.`,
      confidence: 76,
      impact: 'medium',
      timeline: 'near-term',
      source: 'SEC EDGAR — Schedule 13G/A (Institutional Repositioning)',
      sourceUrl: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=SC+13G',
      category: 'market',
      jurisdiction: 'US',
      confidenceTier: 1,
      signalEventType: 'institutional_repositioning',
      enforcementActionType: null, regulatorAgency: 'SEC', penaltyAmountRange: null, namedSector: null,
      threatSeverity: null, exploitStatus: null, affectedVendor: null, cveId: null, affectedSector: null,
      economicIndicatorType: null, indicatorDirection: null, indicatorMagnitude: null, centralBank: null,
      tradeActionType: null, effectiveTimeline: null, tradePartner: null, affectedHsCodes: null,
      recallClass: null, affectedProductType: null, recallScope: null,
      metricName: '13G Amendments (5 days)', metricValue: hits13G.length, metricThreshold: 5, metricUnit: 'filings',
    });
  }

  // ── Form D: NEW — equity offerings = new competitive market entrants ─────────
  const hitsFormD = filingsFormD.status === 'fulfilled' ? filingsFormD.value : [];
  if (hitsFormD.length >= 10) {
    signals.push({
      signalType: 'market',
      description: `SEC EDGAR: ${hitsFormD.length} Form D exempt offering filings in last 7 days. Companies raising private capital: ${extractEntities(hitsFormD, 6)}. Elevated Form D volume indicates accelerating private capital deployment — a leading indicator of new market entrants and competitive launches 6–18 months ahead of public announcement.`,
      confidence: hitsFormD.length >= 30 ? 80 : 70,
      impact: hitsFormD.length >= 40 ? 'high' : 'medium',
      timeline: '6–18 months',
      source: 'SEC EDGAR — Form D (Private Capital & Competitive Entry)',
      sourceUrl: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=D',
      category: 'market',
      jurisdiction: 'US',
      confidenceTier: 1,
      signalEventType: 'competitive_market_entry',
      enforcementActionType: null, regulatorAgency: 'SEC', penaltyAmountRange: null, namedSector: 'Market Entry',
      threatSeverity: null, exploitStatus: null, affectedVendor: null, cveId: null, affectedSector: 'Multi-sector',
      economicIndicatorType: null, indicatorDirection: 'increasing', indicatorMagnitude: `${hitsFormD.length} offerings`,
      centralBank: null,
      tradeActionType: null, effectiveTimeline: '6–18 months', tradePartner: null, affectedHsCodes: null,
      recallClass: null, affectedProductType: null, recallScope: null,
      metricName: 'Form D Filings (7 days)', metricValue: hitsFormD.length, metricThreshold: 10, metricUnit: 'filings',
    });
  }

  // ── Schedule TO: NEW — tender offers = M&A precursor ────────────────────────
  const hitsTO = filingsTO.status === 'fulfilled' ? filingsTO.value : [];
  if (hitsTO.length > 0) {
    signals.push({
      signalType: 'market',
      description: `SEC EDGAR: ${hitsTO.length} Schedule TO tender offer filing(s) in last 7 days. Bidders: ${extractEntities(hitsTO)}. Tender offers are formal acquisition bids made directly to shareholders — concrete M&A execution in progress. Investor communications and board response protocols are directly relevant.`,
      confidence: 92,
      impact: 'high',
      timeline: '30–90 days',
      source: 'SEC EDGAR — Schedule TO (Tender Offer)',
      sourceUrl: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=SC+TO-T',
      category: 'market',
      jurisdiction: 'US',
      confidenceTier: 1,
      signalEventType: 'tender_offer',
      enforcementActionType: null, regulatorAgency: 'SEC', penaltyAmountRange: null, namedSector: 'M&A',
      threatSeverity: null, exploitStatus: null, affectedVendor: null, cveId: null, affectedSector: 'Finance',
      economicIndicatorType: null, indicatorDirection: null, indicatorMagnitude: null, centralBank: null,
      tradeActionType: 'merger_acquisition', effectiveTimeline: '30–90 days', tradePartner: null, affectedHsCodes: null,
      recallClass: null, affectedProductType: null, recallScope: null,
      metricName: 'Tender Offers (7 days)', metricValue: hitsTO.length, metricThreshold: 1, metricUnit: 'filings',
    });
  }

  // ── Form 13F: NEW — institutional position buildup (M&A precursor) ──────────
  const hits13F = filings13F.status === 'fulfilled' ? filings13F.value : [];
  if (hits13F.length >= 20) {
    signals.push({
      signalType: 'market',
      description: `SEC EDGAR: ${hits13F.length} Form 13F institutional holding reports in last 90 days. Major institutions disclosing positions: ${extractEntities(hits13F, 6)}. 13F filings reveal equity positions that must be disclosed once ≥$100M is managed — elevated volume indicates institutional repositioning that can precede 13D activist disclosures by 45–90 days.`,
      confidence: 72,
      impact: 'medium',
      timeline: '45–90 days',
      source: 'SEC EDGAR — Form 13F (Institutional Holdings)',
      sourceUrl: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=13F-HR',
      category: 'market',
      jurisdiction: 'US',
      confidenceTier: 1,
      signalEventType: 'institutional_repositioning',
      enforcementActionType: null, regulatorAgency: 'SEC', penaltyAmountRange: null, namedSector: 'Finance',
      threatSeverity: null, exploitStatus: null, affectedVendor: null, cveId: null, affectedSector: 'Finance',
      economicIndicatorType: null, indicatorDirection: null, indicatorMagnitude: `${hits13F.length} institutions`,
      centralBank: null,
      tradeActionType: null, effectiveTimeline: '45–90 days', tradePartner: null, affectedHsCodes: null,
      recallClass: null, affectedProductType: null, recallScope: null,
      metricName: '13F Reports (90 days)', metricValue: hits13F.length, metricThreshold: 20, metricUnit: 'filings',
    });
  }

  // ── 8-K Item 5.02: NEW — executive leadership departure ─────────────────────
  const hits8KLeadership = filings8KLeadership.status === 'fulfilled' ? filings8KLeadership.value : [];
  if (hits8KLeadership.length >= 2) {
    signals.push({
      signalType: 'market',
      description: `SEC EDGAR: ${hits8KLeadership.length} 8-K Item 5.02 filing(s) in last 3 days disclosing executive departures. Companies: ${extractEntities(hits8KLeadership)}. Item 5.02 requires public companies to disclose departure of principal officers within 4 business days — this is structured, mandatory disclosure of leadership transitions with immediate board and investor communication obligations.`,
      confidence: 89,
      impact: hits8KLeadership.length >= 5 ? 'high' : 'medium',
      timeline: 'immediate',
      source: 'SEC EDGAR — 8-K Item 5.02 (Executive Departure)',
      sourceUrl: 'https://efts.sec.gov/LATEST/search-index?q=%22Item+5.02%22+departure&forms=8-K',
      category: 'market',
      jurisdiction: 'US',
      confidenceTier: 1,
      signalEventType: 'executive_departure',
      enforcementActionType: null, regulatorAgency: 'SEC', penaltyAmountRange: null, namedSector: 'Leadership',
      threatSeverity: null, exploitStatus: null, affectedVendor: null, cveId: null, affectedSector: 'Multi-sector',
      economicIndicatorType: null, indicatorDirection: null, indicatorMagnitude: null, centralBank: null,
      tradeActionType: null, effectiveTimeline: 'immediate', tradePartner: null, affectedHsCodes: null,
      recallClass: null, affectedProductType: null, recallScope: null,
      metricName: '8-K Item 5.02 (3 days)', metricValue: hits8KLeadership.length, metricThreshold: 2, metricUnit: 'filings',
    });
  }

  // ── 8-K Item 2.02: NEW — earnings / results of operations ───────────────────
  const hits8KEarnings = filings8KEarnings.status === 'fulfilled' ? filings8KEarnings.value : [];
  if (hits8KEarnings.length >= 5) {
    signals.push({
      signalType: 'market',
      description: `SEC EDGAR: ${hits8KEarnings.length} 8-K Item 2.02 earnings disclosure filings in last 48 hours. Companies: ${extractEntities(hits8KEarnings)}. Item 2.02 is the mandatory SEC disclosure for "Results of Operations and Financial Condition" — concentrated earnings releases in a short window indicate earnings season volatility risk requiring pre-staged investor communications.`,
      confidence: hits8KEarnings.length >= 20 ? 84 : 74,
      impact: hits8KEarnings.length >= 20 ? 'high' : 'medium',
      timeline: 'near-term',
      source: 'SEC EDGAR — 8-K Item 2.02 (Earnings Disclosure)',
      sourceUrl: 'https://efts.sec.gov/LATEST/search-index?q=%22Item+2.02%22+earnings&forms=8-K',
      category: 'market',
      jurisdiction: 'US',
      confidenceTier: 1,
      signalEventType: 'earnings_disclosure',
      enforcementActionType: null, regulatorAgency: 'SEC', penaltyAmountRange: null, namedSector: 'Finance',
      threatSeverity: null, exploitStatus: null, affectedVendor: null, cveId: null, affectedSector: 'Multi-sector',
      economicIndicatorType: 'earnings_velocity', indicatorDirection: 'spike', indicatorMagnitude: `${hits8KEarnings.length} filings`,
      centralBank: null,
      tradeActionType: null, effectiveTimeline: 'near-term', tradePartner: null, affectedHsCodes: null,
      recallClass: null, affectedProductType: null, recallScope: null,
      metricName: '8-K Item 2.02 (48h)', metricValue: hits8KEarnings.length, metricThreshold: 5, metricUnit: 'filings',
    });
  }

  // ── 8-K Item 2.04: NEW — covenant default / financial distress ───────────────
  const hits8KCovenant = filings8KCovenantDefault.status === 'fulfilled' ? filings8KCovenantDefault.value : [];
  if (hits8KCovenant.length >= 1) {
    signals.push({
      signalType: 'regulatory',
      description: `SEC EDGAR: ${hits8KCovenant.length} 8-K Item 2.04 filing(s) in last 7 days disclosing triggering events under financial agreements (covenant violations, defaults, waivers). Companies: ${extractEntities(hits8KCovenant)}. Item 2.04 is the mandatory disclosure for financial covenant defaults — these filings signal financial distress 60–90 days before it becomes publicly visible through other channels.`,
      confidence: 90,
      impact: hits8KCovenant.length >= 3 ? 'high' : 'medium',
      timeline: '30–90 days',
      source: 'SEC EDGAR — 8-K Item 2.04 (Covenant Default)',
      sourceUrl: 'https://efts.sec.gov/LATEST/search-index?q=%22Item+2.04%22+covenant+default&forms=8-K',
      category: 'regulatory',
      jurisdiction: 'US',
      confidenceTier: 1,
      signalEventType: 'covenant_default',
      enforcementActionType: 'financial_covenant_breach', regulatorAgency: 'SEC', penaltyAmountRange: null, namedSector: 'Finance',
      threatSeverity: null, exploitStatus: null, affectedVendor: null, cveId: null, affectedSector: 'Multi-sector',
      economicIndicatorType: 'covenant_default', indicatorDirection: 'deteriorating', indicatorMagnitude: `${hits8KCovenant.length} defaults`,
      centralBank: null,
      tradeActionType: null, effectiveTimeline: '30–90 days', tradePartner: null, affectedHsCodes: null,
      recallClass: null, affectedProductType: null, recallScope: null,
      metricName: '8-K Item 2.04 (7 days)', metricValue: hits8KCovenant.length, metricThreshold: 1, metricUnit: 'filings',
    });
  }

  if (signals.length > 0) {
    console.log(`[SEC EDGAR] ${signals.length} structured filing signal(s) detected (13D/8K/13G/FormD/TO/13F/5.02/2.02/2.04)`);
  }

  return signals;
}
