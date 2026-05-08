/**
 * ProtocolHealthService
 *
 * Every one of the 170 Readiness Protocols gets a live health score across four dimensions:
 *  - Freshness:          Days since last drill or activation
 *  - Signal Alignment:   How well the protocol's triggers match live signal detections
 *  - Stakeholder Familiarity: How recently stakeholders have engaged with this protocol
 *  - Execution Velocity: Historical 12-minute target achievement rate
 *
 * Health states: Healthy → Aging → Stale → Critical
 * A protocol classified Critical is a liability before the trigger fires.
 */

import { db } from '../db.js';
import { eq, desc, and, gte, sql, inArray } from 'drizzle-orm';
import {
  playbookLibrary,
  practiceDrills,
  playbookActivations,
  activationStakeholders,
  triggerDetections,
} from '@shared/schema';

// ── Types ─────────────────────────────────────────────────────────────────────

export type HealthState = 'HEALTHY' | 'AGING' | 'STALE' | 'CRITICAL';

export interface ProtocolHealthScore {
  protocolId: string;
  protocolNumber: number;
  protocolName: string;
  domain: string;
  strategicCategory: string;

  // Dimension scores (0–100 each)
  freshnessScore: number;
  signalAlignmentScore: number;
  stakeholderFamiliarityScore: number;
  velocityScore: number;

  // Composite
  overallScore: number;         // weighted average
  healthState: HealthState;

  // Evidence
  daysSinceLastDrill: number | null;
  daysSinceLastActivation: number | null;
  totalDrillCount: number;
  totalActivationCount: number;
  recentTriggerHits: number;    // live signal detections matching this protocol in last 30d
  stakeholderEngagementDays: number | null;  // days since any stakeholder engaged
  targetMetRate: number;        // % of activations hitting 12-min target

  // Decay warnings
  warnings: string[];
  recommendations: string[];
}

export interface ProtocolHealthSummary {
  healthy: number;
  aging: number;
  stale: number;
  critical: number;
  topRisks: Array<{ protocolId: string; name: string; healthState: HealthState; overallScore: number; topWarning: string }>;
  platformReadinessScore: number;  // 0–100 weighted average
  assessedAt: Date;
}

// ── Scoring Logic ─────────────────────────────────────────────────────────────

function scoreFreshness(daysSinceDrill: number | null, daysSinceActivation: number | null): number {
  const best = Math.min(
    daysSinceDrill ?? 999,
    daysSinceActivation ?? 999
  );
  if (best <= 30) return 100;
  if (best <= 60) return 85;
  if (best <= 90) return 70;
  if (best <= 180) return 50;
  if (best <= 365) return 30;
  return 10;
}

function scoreVelocity(targetMetRate: number, activationCount: number): number {
  if (activationCount === 0) return 60;  // no data — neutral, not penalized
  if (targetMetRate >= 90) return 100;
  if (targetMetRate >= 75) return 85;
  if (targetMetRate >= 60) return 70;
  if (targetMetRate >= 40) return 50;
  return 30;
}

function scoreSignalAlignment(recentHits: number): number {
  // Paradox: high signal hits mean the protocol is relevant AND getting exercised by real events
  if (recentHits >= 5) return 95;
  if (recentHits >= 3) return 80;
  if (recentHits >= 1) return 65;
  return 40;  // no recent signals — may be dormant domain
}

function scoreStakeholderFamiliarity(daysSinceEngagement: number | null, drillCount: number): number {
  if (drillCount >= 4) return 100;
  if (drillCount >= 2) return 85;
  if (drillCount >= 1) return 70;
  if (daysSinceEngagement === null) return 30;
  if (daysSinceEngagement <= 60) return 65;
  if (daysSinceEngagement <= 180) return 45;
  return 25;
}

function classifyHealth(score: number): HealthState {
  if (score >= 75) return 'HEALTHY';
  if (score >= 55) return 'AGING';
  if (score >= 35) return 'STALE';
  return 'CRITICAL';
}

function buildWarnings(score: ProtocolHealthScore): string[] {
  const w: string[] = [];
  if (score.daysSinceLastDrill === null && score.daysSinceLastActivation === null) {
    w.push('No drill or activation on record — protocol has never been exercised.');
  } else if (score.freshnessScore < 50) {
    const days = Math.min(score.daysSinceLastDrill ?? 999, score.daysSinceLastActivation ?? 999);
    w.push(`Last exercise was ${days} days ago — preparation decay likely.`);
  }
  if (score.velocityScore < 60 && score.totalActivationCount > 0) {
    w.push(`Only ${score.targetMetRate}% of activations hit the 12-minute target — execution speed needs improvement.`);
  }
  if (score.stakeholderFamiliarityScore < 50) {
    w.push('Stakeholders have limited engagement with this protocol — response coordination risk.');
  }
  if (score.signalAlignmentScore < 50) {
    w.push('No recent signal detections for this domain — confirm monitoring coverage.');
  }
  return w;
}

function buildRecommendations(score: ProtocolHealthScore): string[] {
  const r: string[] = [];
  if (score.freshnessScore < 70) {
    r.push('Schedule a tabletop drill within 30 days to refresh team readiness.');
  }
  if (score.stakeholderFamiliarityScore < 70) {
    r.push('Add this protocol to the next quarterly stakeholder briefing.');
  }
  if (score.velocityScore < 70 && score.totalActivationCount > 0) {
    r.push('Review task sequencing to compress execution time toward the 12-minute benchmark.');
  }
  if (score.signalAlignmentScore < 65) {
    r.push('Verify signal monitoring is configured for this protocol\'s trigger domain.');
  }
  if (score.overallScore < 40) {
    r.push('PRIORITY: This protocol requires immediate attention before the next trigger event.');
  }
  return r;
}

// ── Core: Score a single protocol ────────────────────────────────────────────

export async function scoreProtocol(
  protocol: typeof playbookLibrary.$inferSelect,
  organizationId: string,
  recentDetectionsByPattern: Record<string, number>
): Promise<ProtocolHealthScore> {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Drills
  const drills = await db
    .select()
    .from(practiceDrills)
    .where(
      and(
        eq(practiceDrills.playbookId, protocol.id),
        eq(practiceDrills.organizationId, organizationId)
      )
    )
    .orderBy(desc(practiceDrills.completedAt));

  const completedDrills = drills.filter(d => d.status === 'completed' && d.completedAt);
  const lastDrill = completedDrills[0];
  const daysSinceLastDrill = lastDrill?.completedAt
    ? Math.round((now.getTime() - new Date(lastDrill.completedAt).getTime()) / 86400000)
    : null;

  // Activations
  const activations = await db
    .select()
    .from(playbookActivations)
    .where(
      and(
        eq(playbookActivations.playbookId, protocol.id),
        eq(playbookActivations.organizationId, organizationId)
      )
    )
    .orderBy(desc(playbookActivations.activatedAt));

  const lastActivation = activations[0];
  const daysSinceLastActivation = lastActivation?.activatedAt
    ? Math.round((now.getTime() - new Date(lastActivation.activatedAt).getTime()) / 86400000)
    : null;

  const targetMet = activations.filter(a => a.targetMet);
  const targetMetRate = activations.length > 0
    ? Math.round((targetMet.length / activations.length) * 100)
    : 0;

  // Stakeholder engagement: last time any stakeholder was seen in an activation for this protocol
  const recentActivationIds = activations.slice(0, 10).map(a => a.id);
  let stakeholderEngagementDays: number | null = null;
  if (recentActivationIds.length > 0) {
    const stakeholderRows = await db
      .select()
      .from(activationStakeholders)
      .where(inArray(activationStakeholders.activationId, recentActivationIds))
      .orderBy(desc(activationStakeholders.acknowledgedAt))
      .limit(1);

    if (stakeholderRows[0]?.acknowledgedAt) {
      stakeholderEngagementDays = Math.round(
        (now.getTime() - new Date(stakeholderRows[0].acknowledgedAt).getTime()) / 86400000
      );
    }
  }

  // Signal alignment — match trigger criteria keywords against recent detections
  // triggerDetections uses triggerDomain + signalDescription (no triggerPattern column)
  const triggerCriteria = (protocol.triggerCriteria ?? '').toLowerCase();
  const patternWords = triggerCriteria.split(/\s+/).filter(w => w.length > 4);
  let recentTriggerHits = 0;
  for (const [domainOrDesc, count] of Object.entries(recentDetectionsByPattern)) {
    if (patternWords.some(w => domainOrDesc.toLowerCase().includes(w))) {
      recentTriggerHits += count;
    }
  }

  // Domain name
  const domain = (protocol as any).domainName ?? (protocol.strategicCategory ?? 'Unknown');

  // Scores
  const freshnessScore = scoreFreshness(daysSinceLastDrill, daysSinceLastActivation);
  const signalAlignmentScore = scoreSignalAlignment(recentTriggerHits);
  const stakeholderFamiliarityScore = scoreStakeholderFamiliarity(stakeholderEngagementDays, completedDrills.length);
  const velocityScore = scoreVelocity(targetMetRate, activations.length);

  const overallScore = Math.round(
    freshnessScore * 0.35 +
    stakeholderFamiliarityScore * 0.25 +
    velocityScore * 0.25 +
    signalAlignmentScore * 0.15
  );

  const partial: ProtocolHealthScore = {
    protocolId: protocol.id,
    protocolNumber: protocol.playbookNumber,
    protocolName: protocol.name,
    domain,
    strategicCategory: protocol.strategicCategory ?? 'defense',
    freshnessScore,
    signalAlignmentScore,
    stakeholderFamiliarityScore,
    velocityScore,
    overallScore,
    healthState: classifyHealth(overallScore),
    daysSinceLastDrill,
    daysSinceLastActivation,
    totalDrillCount: completedDrills.length,
    totalActivationCount: activations.length,
    recentTriggerHits,
    stakeholderEngagementDays,
    targetMetRate,
    warnings: [],
    recommendations: [],
  };

  partial.warnings = buildWarnings(partial);
  partial.recommendations = buildRecommendations(partial);

  return partial;
}

// ── Score all protocols ───────────────────────────────────────────────────────

export async function scoreAllProtocols(
  organizationId: string,
  limit = 50
): Promise<ProtocolHealthScore[]> {
  const protocols = await db
    .select()
    .from(playbookLibrary)
    .orderBy(playbookLibrary.playbookNumber)
    .limit(limit);

  // Pre-fetch recent detections for signal alignment
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recentDetections = await db
    .select()
    .from(triggerDetections)
    .where(gte(triggerDetections.detectedAt, thirtyDaysAgo))
    .limit(500);

  const recentDetectionsByPattern: Record<string, number> = {};
  for (const d of recentDetections) {
    // Key by domain+description for keyword matching (no triggerPattern column)
    const key = `${d.triggerDomain ?? ''} ${d.signalDescription ?? ''}`.toLowerCase();
    recentDetectionsByPattern[key] = (recentDetectionsByPattern[key] ?? 0) + 1;
  }

  // Score all protocols (sequential to avoid DB connection exhaustion)
  const scores: ProtocolHealthScore[] = [];
  for (const protocol of protocols) {
    try {
      const score = await scoreProtocol(protocol, organizationId, recentDetectionsByPattern);
      scores.push(score);
    } catch {
      // skip failed protocol silently
    }
  }

  return scores.sort((a, b) => a.overallScore - b.overallScore);  // worst first
}

// ── Summary ───────────────────────────────────────────────────────────────────

export async function getProtocolHealthSummary(
  organizationId: string
): Promise<ProtocolHealthSummary> {
  const scores = await scoreAllProtocols(organizationId, 170);

  const counts = { HEALTHY: 0, AGING: 0, STALE: 0, CRITICAL: 0 };
  for (const s of scores) counts[s.healthState]++;

  const topRisks = scores
    .filter(s => s.healthState === 'CRITICAL' || s.healthState === 'STALE')
    .slice(0, 5)
    .map(s => ({
      protocolId: s.protocolId,
      name: s.protocolName,
      healthState: s.healthState,
      overallScore: s.overallScore,
      topWarning: s.warnings[0] ?? 'Review recommended.',
    }));

  const platformReadinessScore = scores.length > 0
    ? Math.round(scores.reduce((sum, s) => sum + s.overallScore, 0) / scores.length)
    : 0;

  return {
    healthy: counts.HEALTHY,
    aging: counts.AGING,
    stale: counts.STALE,
    critical: counts.CRITICAL,
    topRisks,
    platformReadinessScore,
    assessedAt: new Date(),
  };
}
