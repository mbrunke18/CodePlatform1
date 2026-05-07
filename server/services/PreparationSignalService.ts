/**
 * PreparationSignalService — Phase 5 Component 2
 * 
 * Treats declining organizational preparedness as a trigger in its own right.
 * A preparedness score that drops below a threshold for a specific domain
 * triggers a Readiness Recovery protocol — the same activation architecture
 * used for external triggers.
 * 
 * Per spec: runs after every signal evaluation cycle alongside external signal checks.
 * Thresholds are locked per spec Section 6 / Component 2.
 */

import { db } from '../db.js';
import { eq, desc, and, gte } from 'drizzle-orm';
import {
  preparednessScores,
  triggerDetections,
} from '@shared/schema';

// ── Locked preparation thresholds (per spec Section 6, Table 2) ───────────────
export const PREPARATION_THRESHOLDS: Record<string, {
  warning: number;
  critical: number;
  playbook: string;
}> = {
  'Financial':                { warning: 75, critical: 60, playbook: 'Financial Readiness Review' },
  'Technology & Security':    { warning: 80, critical: 65, playbook: 'Cyber Readiness Recovery' },
  'Market Dynamics':          { warning: 70, critical: 55, playbook: 'Market Readiness Review' },
  'Brand & Reputation':       { warning: 75, critical: 60, playbook: 'Leadership Continuity Review' },
  'Regulatory & Compliance':  { warning: 80, critical: 65, playbook: 'Compliance Readiness Review' },
  // Additional domains — not in spec table but defensible defaults
  'Supply Chain & Operations': { warning: 72, critical: 58, playbook: 'Operational Readiness Review' },
  'ESG & Sustainability':      { warning: 70, critical: 55, playbook: 'ESG Readiness Review' },
  'Geopolitical':              { warning: 68, critical: 52, playbook: 'Geopolitical Readiness Review' },
};

// Deduplication: preparation triggers fire at most once per 24 hours per domain
const PREPARATION_TRIGGER_COOLDOWN_HOURS = 24;

export interface PreparationSignalResult {
  domain: string;
  score: number;
  level: 'CRITICAL' | 'WARNING';
  playbook: string;
  threshold: number;
  triggered: boolean; // false if deduplicated
}

/**
 * checkPreparationSignals — Tier 8 of the ingestion pipeline
 * 
 * Reads the most recent preparedness score for the organization.
 * For each monitored domain, compares the score against locked thresholds.
 * Creates preparation triggers that appear in the detection feed alongside
 * external triggers.
 * 
 * Executive-facing message:
 *   "Your Cyber readiness dropped to 58%. Activate preparation protocol?"
 *   Choices: Activate recovery protocol | Schedule review | Dismiss | Delegate
 */
export async function checkPreparationSignals(
  organizationId: string
): Promise<PreparationSignalResult[]> {
  const results: PreparationSignalResult[] = [];

  try {
    // Get most recent preparedness score for this organization
    const recent = await db
      .select()
      .from(preparednessScores)
      .where(eq(preparednessScores.organizationId, organizationId as any))
      .orderBy(desc(preparednessScores.calculatedAt))
      .limit(1);

    if (!recent.length) return [];

    const latestScore = recent[0];
    const overallScore = latestScore.score ?? 100;

    // Extract domain-level scores from readinessMetrics jsonb if available
    // Expected shape: { domains: [{ name: string, score: number }] }
    const metrics = latestScore.readinessMetrics as any;
    const domainScores: Record<string, number> = {};

    if (metrics?.domains && Array.isArray(metrics.domains)) {
      for (const d of metrics.domains) {
        if (d.name && typeof d.score === 'number') {
          domainScores[d.name] = d.score;
        }
      }
    }

    // Check each monitored domain
    for (const [domain, threshold] of Object.entries(PREPARATION_THRESHOLDS)) {
      // Use domain-specific score if available; fall back to overall
      const domainScore = domainScores[domain] ?? overallScore;

      let level: 'CRITICAL' | 'WARNING' | null = null;
      let thresholdValue: number = threshold.warning;

      if (domainScore < threshold.critical) {
        level = 'CRITICAL';
        thresholdValue = threshold.critical;
      } else if (domainScore < threshold.warning) {
        level = 'WARNING';
        thresholdValue = threshold.warning;
      }

      if (!level) continue;

      // ── Deduplication: check if this domain already fired in last 24 hours ──
      const cooloffCutoff = new Date(
        Date.now() - PREPARATION_TRIGGER_COOLDOWN_HOURS * 3_600_000
      );
      const triggerName = `Preparation Gap: ${domain}`;

      const recentTrigger = await db
        .select()
        .from(triggerDetections)
        .where(
          and(
            eq(triggerDetections.triggerName, triggerName),
            eq(triggerDetections.organizationId, organizationId as any),
            gte(triggerDetections.detectedAt as any, cooloffCutoff)
          )
        )
        .limit(1);

      if (recentTrigger.length > 0) {
        results.push({ domain, score: domainScore, level, playbook: threshold.playbook, threshold: thresholdValue, triggered: false });
        continue;
      }

      // ── Create preparation trigger in detection feed ───────────────────────
      await db.insert(triggerDetections).values({
        organizationId: organizationId as any,
        triggerName,
        triggerDomain: domain,
        signalDescription: `${domain} preparedness score is ${domainScore}% — below the ${level === 'CRITICAL' ? 'critical' : 'warning'} threshold of ${thresholdValue}%. The organization's preparation for ${domain} triggers has declined. Activating a Readiness Recovery protocol will restore coverage before the next external trigger fires.`,
        signalSource: 'preparation-monitor',
        signalSourceUrl: null,
        confidenceScore: level === 'CRITICAL' ? 95 : 80,
        recommendedPlaybook: threshold.playbook,
        alternatePlaybooks: [],
        status: 'detected',
        notificationSent: false,
        urgencyLevel: level === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
        orgReadiness: domainScore,
        matchedEvidence: {
          engine: 'preparation-monitor',
          conditionsMet: 1,
          totalConditions: 1,
          dataPoints: [
            `${domain} preparedness score: ${domainScore}%`,
            `${level} threshold: ${thresholdValue}%`,
            `Recommended recovery protocol: ${threshold.playbook}`,
          ],
          matchedKeywords: [],
        },
      } as any);

      console.log(
        `🔴 PREPARATION GAP [${level}]: ${domain} at ${domainScore}% ` +
        `(threshold: ${thresholdValue}%) — queuing "${threshold.playbook}"`
      );

      results.push({
        domain,
        score: domainScore,
        level,
        playbook: threshold.playbook,
        threshold: thresholdValue,
        triggered: true,
      });
    }
  } catch (err) {
    console.error('[PreparationSignalService] checkPreparationSignals error:', err);
  }

  return results;
}

/**
 * getRecentPreparationTriggers — returns recently fired preparation triggers
 * for display in the signal intelligence hub alongside external triggers.
 */
export async function getRecentPreparationTriggers(
  organizationId: string,
  limitHours = 72
): Promise<any[]> {
  try {
    const cutoff = new Date(Date.now() - limitHours * 3_600_000);
    return await db
      .select()
      .from(triggerDetections)
      .where(
        and(
          eq(triggerDetections.organizationId, organizationId as any),
          eq(triggerDetections.signalSource, 'preparation-monitor'),
          gte(triggerDetections.detectedAt as any, cutoff)
        )
      )
      .orderBy(desc(triggerDetections.detectedAt))
      .limit(20);
  } catch (err) {
    console.error('[PreparationSignalService] getRecentPreparationTriggers error:', err);
    return [];
  }
}
