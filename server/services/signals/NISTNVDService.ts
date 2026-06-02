import type { QuantitativeSignal } from './types.js';

const NVD_BASE = 'https://services.nvd.nist.gov/rest/json/cves/2.0';
const LOOKBACK_DAYS = 7;
const CVSS_CRITICAL_THRESHOLD = 9.0;
const CVSS_HIGH_THRESHOLD = 7.0;

interface NVDCve {
  id: string;
  sourceIdentifier?: string;
  published: string;
  lastModified: string;
  descriptions: { lang: string; value: string }[];
  metrics?: {
    cvssMetricV31?: { cvssData: { baseScore: number; baseSeverity: string; vectorString: string }; exploitabilityScore: number; impactScore: number }[];
    cvssMetricV30?: { cvssData: { baseScore: number; baseSeverity: string } }[];
    cvssMetricV2?: { cvssData: { baseScore: number } }[];
  };
  weaknesses?: { description: { lang: string; value: string }[] }[];
  configurations?: any;
  references?: { url: string; source: string; tags?: string[] }[];
}

interface NVDResponse {
  totalResults: number;
  vulnerabilities: { cve: NVDCve }[];
}

function getCVSSScore(cve: NVDCve): { score: number; severity: string; vector: string } | null {
  const v31 = cve.metrics?.cvssMetricV31?.[0];
  if (v31) return { score: v31.cvssData.baseScore, severity: v31.cvssData.baseSeverity, vector: v31.cvssData.vectorString };
  const v30 = cve.metrics?.cvssMetricV30?.[0];
  if (v30) return { score: v30.cvssData.baseScore, severity: v30.cvssData.baseSeverity, vector: '' };
  const v2 = cve.metrics?.cvssMetricV2?.[0];
  if (v2) return { score: v2.cvssData.baseScore, severity: v2.cvssData.baseScore >= 7 ? 'HIGH' : 'MEDIUM', vector: '' };
  return null;
}

function extractVendorsFromConfig(cve: NVDCve): string[] {
  const vendors: string[] = [];
  try {
    const configs = cve.configurations || [];
    for (const config of configs) {
      for (const node of (config.nodes || [])) {
        for (const cpeMatch of (node.cpeMatch || [])) {
          const parts = (cpeMatch.criteria || '').split(':');
          if (parts[3]) vendors.push(parts[3]);
        }
      }
    }
  } catch { /* ok */ }
  return [...new Set(vendors)].slice(0, 3);
}

function hasPublicExploit(cve: NVDCve): boolean {
  return (cve.references || []).some(r =>
    r.tags?.some(t => ['Exploit', 'Patch', 'Third Party Advisory'].includes(t))
  );
}

export async function fetchNISTNVDSignals(): Promise<QuantitativeSignal[]> {
  const signals: QuantitativeSignal[] = [];
  const cutoff = new Date(Date.now() - LOOKBACK_DAYS * 86400000);
  const pubStartDate = cutoff.toISOString().replace('Z', '.000');
  const pubEndDate = new Date().toISOString().replace('Z', '.000');

  try {
    const apiKey = process.env.NVD_API_KEY;
    const headers: Record<string, string> = { 'User-Agent': 'ReadinessOS/1.0 signal-intelligence' };
    if (apiKey) headers['apiKey'] = apiKey;

    const url = `${NVD_BASE}?pubStartDate=${encodeURIComponent(pubStartDate)}&pubEndDate=${encodeURIComponent(pubEndDate)}&cvssV3Severity=CRITICAL&resultsPerPage=20`;

    const res = await fetch(url, { headers, signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`NVD returned ${res.status}`);

    const data = await res.json() as NVDResponse;
    const cves = data.vulnerabilities || [];

    let added = 0;
    for (const { cve } of cves.slice(0, 15)) {
      const cvss = getCVSSScore(cve);
      if (!cvss) continue;
      if (cvss.score < CVSS_HIGH_THRESHOLD) continue;

      const desc = cve.descriptions.find(d => d.lang === 'en')?.value || 'No description available.';
      const vendors = extractVendorsFromConfig(cve);
      const hasExploit = hasPublicExploit(cve);
      const daysOld = (Date.now() - new Date(cve.published).getTime()) / 86400000;

      let confidence = cvss.score >= CVSS_CRITICAL_THRESHOLD ? 89 : 79;
      if (hasExploit) confidence = Math.min(confidence + 7, 96);
      if (daysOld <= 2) confidence = Math.min(confidence + 5, 97);

      const vendorLabel = vendors.length > 0 ? ` Affects: ${vendors.join(', ')}.` : '';
      const exploitLabel = hasExploit ? ' Public exploit code available.' : '';
      const vectorLabel = cvss.vector ? ` Vector: ${cvss.vector.substring(0, 60)}.` : '';

      signals.push({
        signalType: 'cybersecurity',
        description: `NVD CVE: ${cve.id} — CVSS ${cvss.score}/10 (${cvss.severity}).${vendorLabel}${exploitLabel}${vectorLabel} ${desc.substring(0, 350)}`,
        confidence,
        impact: cvss.score >= CVSS_CRITICAL_THRESHOLD ? 'critical' : 'high',
        timeline: hasExploit ? 'immediate' : '1-7 days',
        source: 'NIST National Vulnerability Database',
        sourceUrl: `https://nvd.nist.gov/vuln/detail/${cve.id}`,
        category: 'cybersecurity',
        jurisdiction: 'Global',
        confidenceTier: 1,
        threatSeverity: cvss.severity.toLowerCase() as any,
        exploitStatus: hasExploit ? 'public_exploit_available' : 'no_known_exploit',
        affectedVendor: vendors[0] || null,
        cveId: cve.id,
        affectedSector: null,
        economicIndicatorType: null, indicatorDirection: null, indicatorMagnitude: null, centralBank: null,
        tradeActionType: null, effectiveTimeline: null, tradePartner: null, affectedHsCodes: null,
        recallClass: null, affectedProductType: null, recallScope: null,
        enforcementActionType: null,
        regulatorAgency: 'NIST',
        penaltyAmountRange: null,
        namedSector: null,
        signalEventType: null,
        metricName: 'CVSS Score',
        metricValue: cvss.score,
        metricThreshold: CVSS_HIGH_THRESHOLD,
        metricUnit: '/10',
      });
      added++;
    }

    console.log(`[NIST NVD] ${added} critical/high CVE(s) published in last ${LOOKBACK_DAYS} days (total: ${data.totalResults})`);
  } catch (err) {
    console.warn(`[NIST NVD] Fetch failed:`, err instanceof Error ? err.message : err);
  }

  return signals;
}
