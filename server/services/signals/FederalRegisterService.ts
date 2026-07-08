import type { QuantitativeSignal } from './types.js';

const BASE = 'https://www.federalregister.gov/api/v1/articles.json';
const LOOKBACK_DAYS = 30;

interface FedRegArticle {
  title: string;
  abstract?: string;
  html_url: string;
  publication_date: string;
  effective_on?: string;
  comment_date?: string;
  agencies: { name: string; short_name?: string }[];
  document_number: string;
  type: string;
  action?: string;
  significant?: boolean;
}

interface FedRegResponse {
  results?: FedRegArticle[];
  count?: number;
}

const HIGH_IMPACT_AGENCIES = [
  'securities-and-exchange-commission',
  'federal-trade-commission',
  'department-of-justice',
  'federal-reserve-system',
  'office-of-the-comptroller-of-the-currency',
  'consumer-financial-protection-bureau',
  'environmental-protection-agency',
  'department-of-labor',
  'occupational-safety-and-health-administration',
  'department-of-health-and-human-services',
  'food-and-drug-administration',
  'department-of-homeland-security',
];

const HIGH_IMPACT_TERMS = [
  'cybersecurity', 'data breach', 'artificial intelligence', 'machine learning',
  'climate risk', 'ESG', 'supply chain', 'sanctions', 'export control',
  'antitrust', 'merger', 'acquisition', 'privacy', 'CCPA', 'GDPR',
  'cryptocurrency', 'digital asset', 'banking', 'capital requirement',
];

function scoreArticle(article: FedRegArticle): number {
  let score = 60;
  if (article.significant) score += 15;
  if (article.type === 'RULE') score += 10;
  if (article.type === 'PRORULE') score += 8;
  const text = (article.title + ' ' + (article.abstract || '')).toLowerCase();
  const matchCount = HIGH_IMPACT_TERMS.filter(t => text.includes(t.toLowerCase())).length;
  score += Math.min(matchCount * 5, 20);
  const daysAgo = (Date.now() - new Date(article.publication_date).getTime()) / 86400000;
  if (daysAgo <= 3) score += 8;
  else if (daysAgo <= 7) score += 4;
  return Math.min(score, 94);
}

function articleToImpact(confidence: number): 'critical' | 'high' | 'medium' | 'low' {
  if (confidence >= 85) return 'high';
  if (confidence >= 75) return 'medium';
  return 'low';
}

async function fetchAgencyRules(agencySlug: string): Promise<FedRegArticle[]> {
  const cutoff = new Date(Date.now() - LOOKBACK_DAYS * 86400000);
  const dateStr = cutoff.toISOString().split('T')[0];
  const url = `${BASE}?conditions[agencies][]=${agencySlug}&conditions[type][]=RULE&conditions[type][]=PRORULE&conditions[publication_date][gte]=${dateStr}&per_page=5&order=newest&fields[]=title&fields[]=abstract&fields[]=html_url&fields[]=publication_date&fields[]=effective_on&fields[]=agencies&fields[]=document_number&fields[]=type&fields[]=action&fields[]=significant`;

  const res = await fetch(url, {
    headers: { 'User-Agent': 'ReadinessOS/1.0 signal-intelligence' },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) return [];
  const data = await res.json() as FedRegResponse;
  return data.results || [];
}

export async function fetchFederalRegisterSignals(): Promise<QuantitativeSignal[]> {
  const signals: QuantitativeSignal[] = [];

  try {
    const results = await Promise.allSettled(
      HIGH_IMPACT_AGENCIES.slice(0, 6).map(a => fetchAgencyRules(a))
    );

    const articles: FedRegArticle[] = [];
    for (const r of results) {
      if (r.status === 'fulfilled') articles.push(...r.value);
    }

    const seen = new Set<string>();
    let significant = 0;

    for (const article of articles) {
      if (seen.has(article.document_number)) continue;
      seen.add(article.document_number);

      const confidence = scoreArticle(article);
      if (confidence < 68) continue;

      significant++;
      const agencyNames = article.agencies.map(a => a.short_name || a.name).join(', ');
      const effectiveLabel = article.effective_on ? ` Effective: ${article.effective_on}.` : '';
      const commentLabel = article.comment_date ? ` Comment deadline: ${article.comment_date}.` : '';
      const typeLabel = article.type === 'RULE' ? 'Final Rule' : 'Proposed Rule';

      signals.push({
        signalType: 'regulatory',
        description: `Federal Register ${typeLabel}: "${article.title}" — ${agencyNames}.${effectiveLabel}${commentLabel} ${(article.abstract || '').substring(0, 400)} Regulatory pipeline item requiring compliance readiness assessment.`,
        confidence,
        impact: articleToImpact(confidence),
        timeline: article.effective_on ? `Effective ${article.effective_on}` : '30-90 days',
        source: 'Federal Register — Unified Regulatory Agenda',
        sourceUrl: article.html_url,
        category: 'regulatory',
        jurisdiction: 'US',
        confidenceTier: 1,
        enforcementActionType: article.type === 'RULE' ? 'final_rule' : 'proposed_rule',
        regulatorAgency: agencyNames,
        penaltyAmountRange: null,
        namedSector: null,
        threatSeverity: null, exploitStatus: null, affectedVendor: null, cveId: null, affectedSector: null,
        economicIndicatorType: null, indicatorDirection: null, indicatorMagnitude: null, centralBank: null,
        tradeActionType: null, effectiveTimeline: article.effective_on || null, tradePartner: null, affectedHsCodes: null,
        recallClass: null, affectedProductType: null, recallScope: null,
        signalEventType: 'regulatory_pipeline',
        metricName: 'Days Until Effective',
        metricValue: article.effective_on ? Math.round((new Date(article.effective_on).getTime() - Date.now()) / 86400000) : undefined,
        metricThreshold: 90,
        metricUnit: 'days',
      });
    }

    console.log(`[Federal Register] ${significant} significant rule(s) in last ${LOOKBACK_DAYS} days`);
  } catch (err) {
    console.warn(`[Federal Register] Fetch failed:`, err instanceof Error ? err.message : err);
  }

  return signals;
}
