import type { QuantitativeSignal } from './types.js';

const CFPB_API = 'https://www.consumerfinance.gov/data-research/consumer-complaints/search/api/v1/';
const LOOKBACK_DAYS = 30;

interface CFPBResponse {
  hits?: {
    total?: { value: number };
    hits?: { _source: CFPBComplaint }[];
  };
  aggregations?: {
    product?: { buckets: { key: string; doc_count: number }[] };
    issue?: { buckets: { key: string; doc_count: number }[] };
    company?: { buckets: { key: string; doc_count: number }[] };
  };
}

interface CFPBComplaint {
  product: string;
  issue: string;
  company: string;
  date_received: string;
  state?: string;
  consumer_consent_provided?: string;
}

const HIGH_VOLUME_THRESHOLD = 500;
const SPIKE_THRESHOLD = 200;

const PRODUCT_TO_TRIGGER: Record<string, string> = {
  'Mortgage': 'Financial Distress Signal',
  'Credit card': 'Financial Distress Signal',
  'Debt collection': 'Financial Distress Signal',
  'Student loan': 'Regulatory Enforcement Action',
  'Payday loan': 'Regulatory Enforcement Action',
  'Bank account': 'Cybersecurity Breach Signal',
  'Credit reporting': 'Reputational Crisis Signal',
  'Money transfer': 'Cybersecurity Breach Signal',
  'Virtual currency': 'Regulatory Enforcement Action',
};

export async function fetchCFPBComplaintSignals(): Promise<QuantitativeSignal[]> {
  const signals: QuantitativeSignal[] = [];
  const cutoff = new Date(Date.now() - LOOKBACK_DAYS * 86400000);
  const dateStr = cutoff.toISOString().split('T')[0];

  try {
    const url = new URL(CFPB_API);
    url.searchParams.set('date_received_min', dateStr);
    url.searchParams.set('size', '0');
    url.searchParams.set('field', 'all');
    url.searchParams.set('format', 'json');
    url.searchParams.set('no_aggs', 'false');
    url.searchParams.set('frm', '0');
    url.searchParams.set('sort', 'created_date_desc');

    const res = await fetch(url.toString(), {
      headers: { 'User-Agent': 'ReadinessOS/1.0 signal-intelligence' },
      signal: AbortSignal.timeout(25000),
    });
    if (!res.ok) throw new Error(`CFPB API ${res.status}`);

    const data = await res.json() as CFPBResponse;
    const totalComplaints = data.hits?.total?.value || 0;
    const productBuckets = data.aggregations?.product?.buckets || [];
    const issueBuckets = data.aggregations?.issue?.buckets || [];
    const companyBuckets = data.aggregations?.company?.buckets || [];

    if (totalComplaints === 0) {
      console.log(`[CFPB] No complaints returned from API`);
      return [];
    }

    const dailyRate = totalComplaints / LOOKBACK_DAYS;
    const topProducts = productBuckets.slice(0, 5).map(b => `${b.key} (${b.doc_count})`).join(', ');
    const topIssues = issueBuckets.slice(0, 3).map(b => b.key).join(', ');
    const topCompanies = companyBuckets.slice(0, 3).map(b => b.key).join(', ');

    const isHighVolume = totalComplaints >= HIGH_VOLUME_THRESHOLD;
    const confidence = isHighVolume ? 78 : 66;
    const impact = dailyRate >= 50 ? 'high' : dailyRate >= 20 ? 'medium' : 'low';

    if (confidence >= 66) {
      signals.push({
        signalType: 'regulatory',
        description: `CFPB Complaint Velocity: ${totalComplaints.toLocaleString()} consumer complaints filed in last ${LOOKBACK_DAYS} days (${Math.round(dailyRate)}/day). Top products: ${topProducts}. Top issues: ${topIssues}. Top companies: ${topCompanies}. Elevated complaint volume indicates regulatory scrutiny risk and potential reputational exposure for financial services sector.`,
        confidence,
        impact,
        timeline: '30-90 days',
        source: 'CFPB — Consumer Financial Protection Bureau',
        sourceUrl: 'https://www.consumerfinance.gov/data-research/consumer-complaints/',
        category: 'regulatory',
        jurisdiction: 'US',
        confidenceTier: 2,
        enforcementActionType: 'complaint_volume_spike',
        regulatorAgency: 'Consumer Financial Protection Bureau',
        penaltyAmountRange: null,
        namedSector: 'Financial Services',
        threatSeverity: null, exploitStatus: null, affectedVendor: null, cveId: null, affectedSector: 'Financial Services',
        economicIndicatorType: null, indicatorDirection: 'increasing', indicatorMagnitude: `${totalComplaints} complaints`,
        centralBank: null,
        tradeActionType: null, effectiveTimeline: null, tradePartner: null, affectedHsCodes: null,
        recallClass: null, affectedProductType: 'Financial Products', recallScope: null,
        signalEventType: 'complaint_velocity',
        metricName: 'Consumer Complaints (30 days)',
        metricValue: totalComplaints,
        metricThreshold: HIGH_VOLUME_THRESHOLD,
        metricUnit: 'complaints',
      });
    }

    console.log(`[CFPB] ${totalComplaints.toLocaleString()} consumer complaint(s) in last ${LOOKBACK_DAYS} days (${Math.round(dailyRate)}/day)`);
  } catch (err) {
    console.warn(`[CFPB] Fetch failed:`, err instanceof Error ? err.message : err);
  }

  return signals;
}
