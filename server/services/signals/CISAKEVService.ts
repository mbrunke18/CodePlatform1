import type { QuantitativeSignal } from './types.js';

const CATALOG_URL = 'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json';
const LOOKBACK_DAYS = 7;

interface KEVEntry {
  cveID: string;
  vendorProject: string;
  product: string;
  vulnerabilityName: string;
  dateAdded: string;
  shortDescription: string;
  requiredAction: string;
  dueDate: string;
  notes?: string;
  cvssScore?: number;
}

function cvssToImpact(cvss: number | undefined, name: string, desc: string): 'critical' | 'high' | 'medium' | 'low' {
  if (cvss !== undefined) {
    if (cvss >= 9.0) return 'critical';
    if (cvss >= 7.0) return 'high';
    if (cvss >= 4.0) return 'medium';
    return 'low';
  }
  const text = (name + ' ' + desc).toLowerCase();
  if (text.includes('critical') || text.includes('actively exploited') || text.includes('ransomware')) return 'critical';
  if (text.includes('remote code execution') || text.includes('privilege escalation') || text.includes('authentication bypass')) return 'high';
  return 'high';
}

function cvssToConfidence(cvss: number | undefined, dateAdded: string): number {
  let base = 82;
  if (cvss !== undefined) {
    if (cvss >= 9.0) base = 94;
    else if (cvss >= 7.0) base = 87;
    else if (cvss >= 4.0) base = 78;
  }
  const daysOld = (Date.now() - new Date(dateAdded).getTime()) / 86400000;
  if (daysOld <= 1) base = Math.min(base + 8, 97);
  else if (daysOld <= 3) base = Math.min(base + 4, 97);
  return base;
}

export async function fetchCISAKEVSignals(): Promise<QuantitativeSignal[]> {
  const signals: QuantitativeSignal[] = [];
  const cutoff = new Date(Date.now() - LOOKBACK_DAYS * 86400000);

  try {
    const res = await fetch(CATALOG_URL, {
      headers: { 'User-Agent': 'ReadinessOS/1.0 signal-intelligence' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`CISA KEV returned ${res.status}`);

    const data = await res.json() as { vulnerabilities: KEVEntry[] };
    const recent = (data.vulnerabilities || []).filter(v => new Date(v.dateAdded) >= cutoff);

    for (const vuln of recent) {
      const impact = cvssToImpact(vuln.cvssScore, vuln.vulnerabilityName, vuln.shortDescription);
      const confidence = cvssToConfidence(vuln.cvssScore, vuln.dateAdded);
      const cvssLabel = vuln.cvssScore ? ` CVSS ${vuln.cvssScore}/10.` : '';
      const dueLabel = vuln.dueDate ? ` Remediation required by ${vuln.dueDate}.` : '';

      signals.push({
        signalType: 'cybersecurity',
        description: `CISA KEV: ${vuln.vulnerabilityName} affecting ${vuln.vendorProject} ${vuln.product}.${cvssLabel} ${vuln.shortDescription.substring(0, 300)}${dueLabel} Required action: ${vuln.requiredAction?.substring(0, 150) || 'Apply vendor patch immediately.'}`,
        confidence,
        impact,
        timeline: 'immediate',
        source: 'CISA Known Exploited Vulnerabilities',
        sourceUrl: `https://www.cisa.gov/known-exploited-vulnerabilities-catalog`,
        category: 'cybersecurity',
        jurisdiction: 'US',
        confidenceTier: 1,
        threatSeverity: impact === 'critical' ? 'critical' : 'high',
        exploitStatus: 'known_exploited',
        affectedVendor: vuln.vendorProject,
        cveId: vuln.cveID,
        affectedSector: null,
        economicIndicatorType: null,
        indicatorDirection: null,
        indicatorMagnitude: null,
        centralBank: null,
        tradeActionType: null,
        effectiveTimeline: vuln.dueDate || null,
        tradePartner: null,
        affectedHsCodes: null,
        recallClass: null,
        affectedProductType: null,
        recallScope: null,
        enforcementActionType: null,
        regulatorAgency: 'CISA',
        penaltyAmountRange: null,
        namedSector: null,
        signalEventType: null,
        metricName: 'CVSS Score',
        metricValue: vuln.cvssScore,
        metricThreshold: 7.0,
        metricUnit: '/10',
      });
    }

    console.log(`[CISA KEV] ${signals.length} active exploits in last ${LOOKBACK_DAYS} days`);
  } catch (err) {
    console.warn(`[CISA KEV] Fetch failed:`, err instanceof Error ? err.message : err);
  }

  return signals;
}
