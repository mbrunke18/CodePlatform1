import type { QuantitativeSignal } from './types.js';

const ARXIV_API = 'http://export.arxiv.org/api/query';
const LOOKBACK_DAYS = 14;

interface ArXivDomain {
  category: string;
  label: string;
  trigger: string;
  domain: string;
  threshold: number;
  maxResults: number;
}

const ARXIV_DOMAINS: ArXivDomain[] = [
  {
    category: 'cs.AI',
    label: 'Artificial Intelligence',
    trigger: 'AI Disruption Signal',
    domain: 'technology',
    threshold: 80,
    maxResults: 500,
  },
  {
    category: 'cs.LG',
    label: 'Machine Learning',
    trigger: 'AI Disruption Signal',
    domain: 'technology',
    threshold: 150,
    maxResults: 500,
  },
  {
    category: 'cs.CR',
    label: 'Cryptography & Security',
    trigger: 'Cybersecurity Breach Signal',
    domain: 'cybersecurity',
    threshold: 40,
    maxResults: 300,
  },
];

function countRecentPapers(xmlText: string, cutoff: Date): { count: number; titles: string[] } {
  const entries = [...xmlText.matchAll(/<entry>([\s\S]*?)<\/entry>/g)];
  const titles: string[] = [];
  let count = 0;

  for (const entry of entries) {
    const content = entry[1];
    const dateMatch = content.match(/<published>([^<]+)<\/published>/);
    const titleMatch = content.match(/<title>([^<]+)<\/title>/);
    if (!dateMatch) continue;
    const published = new Date(dateMatch[1]);
    if (published >= cutoff) {
      count++;
      if (titles.length < 3 && titleMatch) {
        titles.push(titleMatch[1].trim().replace(/\s+/g, ' '));
      }
    }
  }

  return { count, titles };
}

async function fetchCategoryVelocity(domain: ArXivDomain): Promise<QuantitativeSignal | null> {
  try {
    const cutoff = new Date(Date.now() - LOOKBACK_DAYS * 86400000);
    const params = new URLSearchParams({
      search_query: `cat:${domain.category}`,
      start: '0',
      max_results: String(domain.maxResults),
      sortBy: 'submittedDate',
      sortOrder: 'descending',
    });

    const res = await fetch(`${ARXIV_API}?${params}`, {
      headers: { 'User-Agent': 'ReadinessOS/1.0 signal-intelligence' },
      signal: AbortSignal.timeout(20000),
    });

    if (!res.ok) return null;
    const xml = await res.text();
    const { count, titles } = countRecentPapers(xml, cutoff);
    const dailyRate = Math.round(count / LOOKBACK_DAYS);

    if (count < domain.threshold) return null;

    const confidence = count >= domain.threshold * 3 ? 82 : count >= domain.threshold * 2 ? 74 : 66;
    const impact: 'high' | 'medium' | 'low' = count >= domain.threshold * 3 ? 'high' : 'medium';
    const sampleTitles = titles.join(' | ');

    return {
      signalType: domain.domain,
      description: `arXiv Research Velocity: ${count} new papers published in ${domain.label} (${domain.category}) in last ${LOOKBACK_DAYS} days — ${dailyRate}/day average (threshold: ${domain.threshold}). Academic research velocity precedes commercial deployment by 12–18 months and is a leading indicator of competitive disruption. Sample: ${sampleTitles.substring(0, 350)}`,
      confidence,
      impact,
      timeline: '12–18 months',
      source: `arXiv — ${domain.label} Research Velocity`,
      sourceUrl: `https://arxiv.org/list/${domain.category}/recent`,
      category: domain.domain,
      jurisdiction: 'Global',
      confidenceTier: 2,
      enforcementActionType: null,
      regulatorAgency: null,
      penaltyAmountRange: null,
      namedSector: domain.label,
      threatSeverity: null,
      exploitStatus: null,
      affectedVendor: null,
      cveId: null,
      affectedSector: 'Technology',
      economicIndicatorType: null,
      indicatorDirection: 'increasing',
      indicatorMagnitude: `${count} papers / ${LOOKBACK_DAYS} days`,
      centralBank: null,
      tradeActionType: null,
      effectiveTimeline: null,
      tradePartner: null,
      affectedHsCodes: null,
      recallClass: null,
      affectedProductType: null,
      recallScope: null,
      signalEventType: 'research_velocity_spike',
      metricName: `arXiv Papers (${LOOKBACK_DAYS}d)`,
      metricValue: count,
      metricThreshold: domain.threshold,
      metricUnit: 'papers',
    };
  } catch {
    return null;
  }
}

export async function fetchArXivVelocitySignals(): Promise<QuantitativeSignal[]> {
  const signals: QuantitativeSignal[] = [];
  try {
    // Sequential to avoid hammering arXiv (they're rate-sensitive)
    for (const domain of ARXIV_DOMAINS) {
      const result = await fetchCategoryVelocity(domain);
      if (result) signals.push(result);
      await new Promise(r => setTimeout(r, 600));
    }
    console.log(`[arXiv] ${signals.length} research velocity signal(s) across ${ARXIV_DOMAINS.length} categories`);
  } catch (err) {
    console.warn(`[arXiv] Fetch failed:`, err instanceof Error ? err.message : err);
  }
  return signals;
}
