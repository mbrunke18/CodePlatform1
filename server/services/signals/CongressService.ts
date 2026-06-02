import type { QuantitativeSignal } from './types.js';

const CONGRESS_API_BASE = 'https://api.congress.gov/v3';
const LOOKBACK_DAYS = 30;

interface CongressBill {
  congress: number;
  number: string;
  originChamber: string;
  originChamberCode: string;
  title: string;
  type: string;
  updateDate: string;
  updateDateIncludingText?: string;
  url: string;
  latestAction?: { actionDate: string; text: string };
}

interface CongressResponse {
  bills?: CongressBill[];
  pagination?: { count: number };
}

const HIGH_IMPACT_KEYWORDS = [
  'artificial intelligence', 'cybersecurity', 'data privacy', 'antitrust',
  'supply chain', 'climate', 'ESG', 'labor', 'healthcare', 'drug pricing',
  'financial regulation', 'trade', 'tariff', 'sanctions', 'infrastructure',
  'cryptocurrency', 'digital asset', 'banking', 'merger', 'acquisition',
];

const CHAMBER_LABELS: Record<string, string> = {
  H: 'House', S: 'Senate', HR: 'House Resolution', SRES: 'Senate Resolution',
};

function billRelevanceScore(bill: CongressBill): number {
  const text = (bill.title + ' ' + (bill.latestAction?.text || '')).toLowerCase();
  let score = 50;
  const matchCount = HIGH_IMPACT_KEYWORDS.filter(k => text.includes(k)).length;
  score += matchCount * 8;
  if (bill.type === 'HR' || bill.type === 'S') score += 15;
  const action = (bill.latestAction?.text || '').toLowerCase();
  if (action.includes('passed') || action.includes('signed')) score += 20;
  if (action.includes('committee')) score += 10;
  if (action.includes('floor')) score += 15;
  return Math.min(score, 92);
}

export async function fetchCongressSignals(): Promise<QuantitativeSignal[]> {
  const signals: QuantitativeSignal[] = [];
  // Uses DEMO_KEY (30 req/hr public rate) with fallback to user-supplied key.
  // No registration required for DEMO_KEY.
  const apiKey = process.env.CONGRESS_API_KEY || 'DEMO_KEY';

  const cutoff = new Date(Date.now() - LOOKBACK_DAYS * 86400000);
  const fromDate = cutoff.toISOString().split('T')[0];

  try {
    const url = `${CONGRESS_API_BASE}/bill?format=json&limit=50&sort=updateDate+desc&fromDateTime=${fromDate}T00:00:00Z&api_key=${apiKey}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'ReadinessOS/1.0 signal-intelligence' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`Congress.gov returned ${res.status}`);

    const data = await res.json() as CongressResponse;
    const bills = data.bills || [];

    let added = 0;
    for (const bill of bills) {
      const score = billRelevanceScore(bill);
      if (score < 68) continue;

      const chamberLabel = CHAMBER_LABELS[bill.originChamberCode] || bill.originChamber;
      const actionText = bill.latestAction ? `Latest action (${bill.latestAction.actionDate}): ${bill.latestAction.text}` : '';
      const confidence = Math.min(score, 88);

      signals.push({
        signalType: 'regulatory',
        description: `Legislation Signal: ${chamberLabel} ${bill.type}${bill.number} — "${bill.title}". ${actionText}. Advance monitoring of regulatory pipeline — policy change readiness protocols recommended.`,
        confidence,
        impact: score >= 82 ? 'high' : 'medium',
        timeline: '30-180 days',
        source: 'Congress.gov — Legislative Intelligence',
        sourceUrl: bill.url.replace('api.congress.gov/v3', 'congress.gov').replace('/bill/', '/bill/').replace('.json', ''),
        category: 'regulatory',
        jurisdiction: 'US',
        confidenceTier: 2,
        enforcementActionType: 'pending_legislation',
        regulatorAgency: `US Congress — ${chamberLabel}`,
        penaltyAmountRange: null,
        namedSector: null,
        threatSeverity: null, exploitStatus: null, affectedVendor: null, cveId: null, affectedSector: null,
        economicIndicatorType: null, indicatorDirection: null, indicatorMagnitude: null, centralBank: null,
        tradeActionType: null, effectiveTimeline: null, tradePartner: null, affectedHsCodes: null,
        recallClass: null, affectedProductType: null, recallScope: null,
        signalEventType: 'legislative_activity',
        metricName: 'Relevance Score',
        metricValue: score,
        metricThreshold: 68,
        metricUnit: '/100',
      });
      added++;
    }

    console.log(`[Congress.gov] ${added} relevant bill(s) with activity in last ${LOOKBACK_DAYS} days`);
  } catch (err) {
    console.warn(`[Congress.gov] Fetch failed:`, err instanceof Error ? err.message : err);
  }

  return signals;
}
