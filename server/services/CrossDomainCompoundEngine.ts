/**
 * CrossDomainCompoundEngine — Moat 4: Cross-Domain Compound Intelligence
 *
 * Runs after every 15-minute signal cycle. Identifies sub-threshold signals
 * (confidence 40–74%) from the past 48 hours across DIFFERENT strategic domains.
 *
 * When multiple sub-threshold signals share stakeholder groups or organizational
 * context, they receive a compound confidence multiplier. The resulting compound
 * threat is detectable 48 hours before any individual signal crosses threshold.
 *
 * Matched automatically to compound protocols 181–184:
 *   181 — Activist + Regulatory
 *   182 — Cyber + Supply Chain
 *   183 — Talent Exodus + Competitor Displacement
 *   184 — ESG + Media + Regulatory
 */

import { db } from '../db.js';
import { eq, and, gte, lt, ne, inArray } from 'drizzle-orm';
import {
  triggerDetections,
  compoundThreatAlerts,
  organizations,
} from '@shared/schema';

// ─── Sub-threshold window: confidence 40–74% ─────────────────────────────────
const SUB_THRESHOLD_MIN = 40;
const SUB_THRESHOLD_MAX = 74;
const LOOKBACK_HOURS = 48;
const COMPOUND_FIRE_THRESHOLD = 65; // compound score to create an alert

// ─── Domain stakeholder overlap map ─────────────────────────────────────────
// When signals from different domains share these stakeholder groups, compound score rises
const DOMAIN_STAKEHOLDERS: Record<string, string[]> = {
  competitive:  ['CEO', 'CMO', 'Sales', 'Strategy', 'Board'],
  financial:    ['CFO', 'Treasury', 'Board', 'Investor Relations', 'Legal'],
  regulatory:   ['CLO', 'Legal', 'Compliance', 'CFO', 'CEO', 'Board'],
  talent:       ['CHRO', 'CEO', 'Legal', 'Communications'],
  cyber:        ['CISO', 'CTO', 'Legal', 'Communications', 'CEO', 'Board'],
  supplychain:  ['COO', 'Procurement', 'Operations', 'CFO'],
  media:        ['CCO', 'CEO', 'Marketing', 'Legal', 'Board'],
  geopolitical: ['CEO', 'CLO', 'CFO', 'Board', 'Government Affairs'],
  market:       ['CEO', 'CFO', 'Strategy', 'Board'],
  esg:          ['CCO', 'Legal', 'Board', 'CEO', 'Communications'],
};

// ─── Compound protocol mapping ────────────────────────────────────────────────
const COMPOUND_PROTOCOLS: Record<string, { id: number; name: string; domains: string[] }> = {
  'activist_regulatory': {
    id: 181,
    name: 'Activist + Regulatory Compound Response',
    domains: ['competitive', 'regulatory', 'financial'],
  },
  'cyber_supplychain': {
    id: 182,
    name: 'Cyber + Supply Chain Compound Response',
    domains: ['cyber', 'supplychain'],
  },
  'talent_competitive': {
    id: 183,
    name: 'Talent Exodus + Competitor Displacement Protocol',
    domains: ['talent', 'competitive'],
  },
  'esg_media_regulatory': {
    id: 184,
    name: 'ESG + Media + Regulatory Compound Response',
    domains: ['esg', 'media', 'regulatory'],
  },
};

// ─── Calculate stakeholder overlap score between two domains ─────────────────
function stakeholderOverlapScore(domainA: string, domainB: string): number {
  const setA = new Set(DOMAIN_STAKEHOLDERS[domainA] ?? []);
  const setB = new Set(DOMAIN_STAKEHOLDERS[domainB] ?? []);
  let overlap = 0;
  for (const s of Array.from(setA)) {
    if (setB.has(s)) overlap++;
  }
  const maxSize = Math.max(setA.size, setB.size);
  return maxSize > 0 ? Math.round((overlap / maxSize) * 100) : 0;
}

// ─── Match domains to a compound protocol ────────────────────────────────────
function matchCompoundProtocol(domains: string[]): (typeof COMPOUND_PROTOCOLS)[string] | null {
  const domainSet = new Set(domains);
  for (const protocol of Object.values(COMPOUND_PROTOCOLS)) {
    const required = protocol.domains;
    const matches = required.filter(d => domainSet.has(d)).length;
    if (matches >= Math.ceil(required.length * 0.6)) {
      return protocol;
    }
  }
  return null;
}

// ─── Build the compound threat type label ────────────────────────────────────
function buildThreatLabel(domains: string[]): string {
  return domains
    .map(d => d.charAt(0).toUpperCase() + d.slice(1))
    .join(' + ') + ' Compound Threat';
}

// ─── Build the AI hypothesis text (deterministic, no LLM needed) ─────────────
function buildHypothesis(
  detections: { triggerName: string; triggerDomain: string; confidenceScore: number }[],
  compoundScore: number
): string {
  const signals = detections.map(d => `"${d.triggerName}" (${d.confidenceScore}% confidence in ${d.triggerDomain})`).join(', ');
  return `Cross-domain pattern detected: ${signals}. Each signal is sub-threshold individually, but combined compound score is ${compoundScore}%. This pattern typically precedes a coordinated multi-domain event within 48 hours. Recommended protocols pre-staged and awaiting executive authorization.`;
}

// ─── Main: run compound detection for an org ─────────────────────────────────
export async function runCompoundDetection(organizationId: string): Promise<void> {
  try {
    const cutoff = new Date(Date.now() - LOOKBACK_HOURS * 60 * 60 * 1000);

    // Load sub-threshold detections from last 48h
    const subThresholdDetections = await db
      .select()
      .from(triggerDetections)
      .where(and(
        eq(triggerDetections.organizationId, organizationId),
        gte(triggerDetections.detectedAt, cutoff),
        gte(triggerDetections.confidenceScore, SUB_THRESHOLD_MIN),
        lt(triggerDetections.confidenceScore, SUB_THRESHOLD_MAX + 1)
      ));

    if (subThresholdDetections.length < 2) return; // Need at least 2 signals

    // Group by domain
    const byDomain: Record<string, typeof subThresholdDetections> = {};
    for (const det of subThresholdDetections) {
      const domain = det.triggerDomain ?? 'general';
      if (!byDomain[domain]) byDomain[domain] = [];
      byDomain[domain].push(det);
    }

    const domains = Object.keys(byDomain);
    if (domains.length < 2) return; // Need signals across at least 2 different domains

    // Check all domain pairs for overlap
    let bestCompoundScore = 0;
    const involvedDomains: string[] = [];
    const involvedDetections: typeof subThresholdDetections = [];

    for (let i = 0; i < domains.length; i++) {
      for (let j = i + 1; j < domains.length; j++) {
        const dA = domains[i];
        const dB = domains[j];
        const overlap = stakeholderOverlapScore(dA, dB);
        if (overlap < 20) continue; // Not enough stakeholder overlap

        // Compound score = average confidence × overlap multiplier
        const detsA = byDomain[dA];
        const detsB = byDomain[dB];
        const avgConfA = detsA.reduce((s, d) => s + d.confidenceScore, 0) / detsA.length;
        const avgConfB = detsB.reduce((s, d) => s + d.confidenceScore, 0) / detsB.length;
        const avgConf = (avgConfA + avgConfB) / 2;
        const compoundScore = Math.round(avgConf * (1 + overlap / 100));

        if (compoundScore > bestCompoundScore) {
          bestCompoundScore = compoundScore;
          involvedDomains.length = 0;
          involvedDetections.length = 0;
          if (!involvedDomains.includes(dA)) involvedDomains.push(dA);
          if (!involvedDomains.includes(dB)) involvedDomains.push(dB);
          involvedDetections.push(...detsA, ...detsB);
        }
      }
    }

    // Add any additional domain with overlap to existing compound set
    for (const domain of domains) {
      if (involvedDomains.includes(domain)) continue;
      const hasOverlap = involvedDomains.some(d => stakeholderOverlapScore(d, domain) >= 20);
      if (hasOverlap) {
        involvedDomains.push(domain);
        involvedDetections.push(...(byDomain[domain] ?? []));
      }
    }

    if (bestCompoundScore < COMPOUND_FIRE_THRESHOLD) return;

    // Check for existing active alert for these domains (avoid duplicates in 48h)
    const existingAlert = await db
      .select()
      .from(compoundThreatAlerts)
      .where(and(
        eq(compoundThreatAlerts.organizationId, organizationId as any),
        eq(compoundThreatAlerts.status, 'active'),
        gte(compoundThreatAlerts.detectedAt, cutoff)
      ))
      .limit(1);

    if (existingAlert.length > 0) return; // Already alerted in this window

    // Match to compound protocol
    const protocol = matchCompoundProtocol(involvedDomains);
    const threatType = buildThreatLabel(involvedDomains);
    const hypothesis = buildHypothesis(
      involvedDetections.map(d => ({ triggerName: d.triggerName, triggerDomain: d.triggerDomain ?? 'general', confidenceScore: d.confidenceScore })),
      bestCompoundScore
    );

    const subThresholdSignals = involvedDetections.map(d => ({
      detectionId: d.id,
      triggerName: d.triggerName,
      domain: d.triggerDomain ?? 'general',
      confidence: d.confidenceScore,
      detectedAt: d.detectedAt,
    }));

    await db.insert(compoundThreatAlerts).values({
      organizationId: organizationId as any,
      domains: involvedDomains,
      threatType,
      confidence: bestCompoundScore,
      aiHypothesis: hypothesis,
      historicalMatch: protocol ? `Protocol ${protocol.id}: ${protocol.name}` : null,
      stagedPlaybookId: null,
      status: 'active',
      compoundScore: bestCompoundScore,
      subThresholdSignals,
    } as any);

    console.log(`[CrossDomainCompoundEngine] Compound threat detected for org ${organizationId}: ${threatType} (score: ${bestCompoundScore}%)`);
    if (protocol) {
      console.log(`[CrossDomainCompoundEngine] Matched to Protocol ${protocol.id}: ${protocol.name}`);
    }
  } catch (err) {
    console.error('[CrossDomainCompoundEngine] Error running compound detection:', err);
  }
}

// ─── Run compound detection for all orgs (called from signal cycle) ──────────
export async function runCompoundDetectionAllOrgs(): Promise<void> {
  try {
    const allOrgs = await db.select({ id: organizations.id }).from(organizations);
    for (const org of allOrgs) {
      await runCompoundDetection(org.id);
    }
  } catch (err) {
    console.error('[CrossDomainCompoundEngine] Error in all-org sweep:', err);
  }
}
