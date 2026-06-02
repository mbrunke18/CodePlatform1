import type { QuantitativeSignal } from './types.js';

const BASE = 'https://api.fda.gov';
const LOOKBACK_DAYS = 3;

interface FDAEnforcementResult {
  classification?: string;
  status?: string;
  product_description?: string;
  reason_for_recall?: string;
  recalling_firm?: string;
  distribution_pattern?: string;
  product_quantity?: string;
  recall_initiation_date?: string;
  recall_number?: string;
  voluntary_mandated?: string;
  initial_firm_notification?: string;
}

function recallImpact(cls: string | undefined): 'critical' | 'high' | 'medium' | 'low' {
  if (!cls) return 'medium';
  if (cls.includes('Class I') || cls.includes('Class 1')) return 'critical';
  if (cls.includes('Class II') || cls.includes('Class 2')) return 'high';
  return 'medium';
}

function recallConfidence(cls: string | undefined): number {
  if (!cls) return 72;
  if (cls.includes('Class I') || cls.includes('Class 1')) return 93;
  if (cls.includes('Class II') || cls.includes('Class 2')) return 85;
  return 74;
}

function isRecent(dateStr: string | undefined): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));
  return (Date.now() - d.getTime()) < LOOKBACK_DAYS * 86400000;
}

async function fetchEnforcement(type: string, productLabel: string): Promise<QuantitativeSignal[]> {
  const signals: QuantitativeSignal[] = [];
  try {
    const since = new Date(Date.now() - LOOKBACK_DAYS * 86400000)
      .toISOString().split('T')[0].replace(/-/g, '');
    const url = `${BASE}/${type}/enforcement.json?limit=20&sort=report_date:desc&search=recall_initiation_date:[${since}+TO+99991231]`;
    const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
    if (!res.ok) return [];

    const data = await res.json() as { results?: FDAEnforcementResult[] };
    const results = (data.results || []).filter(r => isRecent(r.recall_initiation_date));

    for (const r of results) {
      if (!r.classification?.includes('Class I') && !r.classification?.includes('Class II')) continue;

      const impact = recallImpact(r.classification);
      const confidence = recallConfidence(r.classification);
      const scope = (r.distribution_pattern || '').toLowerCase().includes('nationwide') ||
                    (r.distribution_pattern || '').toLowerCase().includes('national') ? 'national' :
                    (r.distribution_pattern || '').toLowerCase().includes('international') ? 'international' : 'regional';

      signals.push({
        signalType: 'regulatory',
        description: `FDA ${r.classification} Recall: ${r.recalling_firm || 'Unknown firm'} — ${r.product_description?.substring(0, 200) || productLabel}. Reason: ${r.reason_for_recall?.substring(0, 200) || 'See FDA notice'}. Distribution: ${r.distribution_pattern?.substring(0, 100) || 'Not specified'}. Quantity: ${r.product_quantity || 'Not specified'}. Recall #${r.recall_number || 'N/A'}.`,
        confidence,
        impact,
        timeline: 'immediate',
        source: 'FDA Enforcement — OpenFDA',
        sourceUrl: `https://www.fda.gov/safety/recalls-market-withdrawals-safety-alerts`,
        category: 'regulatory',
        jurisdiction: 'US',
        confidenceTier: 1,
        recallClass: r.classification || null,
        affectedProductType: productLabel,
        recallScope: scope,
        enforcementActionType: 'recall',
        regulatorAgency: 'FDA',
        penaltyAmountRange: null,
        namedSector: productLabel === 'pharma' ? 'healthcare' : productLabel === 'food' ? 'retail' : 'manufacturing',
        threatSeverity: null,
        exploitStatus: null,
        affectedVendor: r.recalling_firm || null,
        cveId: null,
        affectedSector: null,
        economicIndicatorType: null,
        indicatorDirection: null,
        indicatorMagnitude: null,
        centralBank: null,
        tradeActionType: null,
        effectiveTimeline: 'immediate',
        tradePartner: null,
        affectedHsCodes: null,
        signalEventType: 'product_recall',
        metricName: 'Recall Classification',
        metricValue: r.classification?.includes('Class I') ? 1 : 2,
        metricThreshold: 2,
        metricUnit: 'class',
      });
    }
  } catch (err) {
    console.warn(`[OpenFDA] ${type} enforcement fetch failed:`, err instanceof Error ? err.message : err);
  }
  return signals;
}

export async function fetchOpenFDASignals(): Promise<QuantitativeSignal[]> {
  const [food, drug, device] = await Promise.allSettled([
    fetchEnforcement('food', 'food'),
    fetchEnforcement('drug', 'pharma'),
    fetchEnforcement('device', 'medical_device'),
  ]);

  const all = [
    ...(food.status === 'fulfilled' ? food.value : []),
    ...(drug.status === 'fulfilled' ? drug.value : []),
    ...(device.status === 'fulfilled' ? device.value : []),
  ];

  if (all.length > 0) {
    console.log(`[OpenFDA] ${all.length} Class I/II recall(s) in last ${LOOKBACK_DAYS} days`);
  }

  return all;
}
