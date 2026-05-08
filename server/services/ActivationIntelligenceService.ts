/**
 * ActivationIntelligenceService
 *
 * Three capabilities that make the 12-minute execution moment undeniable:
 *  1. Executive Decision Brief — risk, recommended action, expected outcome in <60s
 *  2. Auto War Room Composition — ranked participant list from stakeholder history
 *  3. 12-Minute Milestone Tracker — live scoring against the benchmark
 */

import { db } from '../db.js';
import { eq, desc, and, gte, sql } from 'drizzle-orm';
import {
  playbookLibrary,
  playbookActivations,
  activationOutcomes,
  activationStakeholders,
  activationTasks,
  stakeholderContacts,
  triggerDetections,
  organizations,
} from '@shared/schema';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ExecutiveDecisionBrief {
  protocolName: string;
  triggerSummary: string;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  riskRationale: string;
  recommendedAction: string;
  expectedOutcome: string;
  timeToStabilize: string;
  budgetRequired: string;
  keyDecisions: Array<{ decision: string; owner: string; deadline: string }>;
  successProbability: number;     // 0–100 based on prior activation history
  priorActivationCount: number;
  priorTargetMetRate: number;     // % of prior activations that hit 12-min target
  generatedAt: Date;
}

export interface WarRoomParticipant {
  rank: number;
  role: string;
  name: string | null;
  tier: number;
  raciType: string;
  readinessScore: number;         // 0–100 composite
  avgResponseTimeSeconds: number | null;
  activationCount: number;
  lastSeenAt: Date | null;
  recommendedChannel: string;
  isRequired: boolean;
}

export interface WarRoomComposition {
  protocolId: string;
  protocolName: string;
  tier1: WarRoomParticipant[];
  tier2: WarRoomParticipant[];
  tier3Roles: string[];
  totalRequired: number;
  compositionConfidence: number;  // 0–100
}

export interface MilestoneStatus {
  milestone: string;
  targetMinute: number;
  status: 'pending' | 'hit' | 'missed' | 'at_risk';
  actualMinute: number | null;
  delta: number | null;           // negative = ahead, positive = behind
}

export interface TwelveMinuteScorecard {
  activationId: string;
  elapsedSeconds: number;
  velocityScore: number;          // 0–100
  milestones: MilestoneStatus[];
  stakeholderResponseRate: number; // % acknowledged
  taskCompletionRate: number;
  projectedCompletionMinute: number | null;
  onTrack: boolean;
  summary: string;
}

// ── 1. Executive Decision Brief ───────────────────────────────────────────────

export async function generateExecutiveDecisionBrief(
  playbookId: string,
  organizationId: string,
  situationContext?: string
): Promise<ExecutiveDecisionBrief> {
  // Load protocol
  const [protocol] = await db
    .select()
    .from(playbookLibrary)
    .where(eq(playbookLibrary.id, playbookId))
    .limit(1);

  if (!protocol) throw new Error(`Protocol ${playbookId} not found`);

  // Load prior activations of this protocol for success probability
  const priorActivations = await db
    .select()
    .from(playbookActivations)
    .where(
      and(
        eq(playbookActivations.playbookId, playbookId),
        eq(playbookActivations.organizationId, organizationId)
      )
    )
    .orderBy(desc(playbookActivations.activatedAt))
    .limit(20);

  const priorCount = priorActivations.length;
  const targetMetCount = priorActivations.filter(a => a.targetMet).length;
  const priorTargetMetRate = priorCount > 0 ? Math.round((targetMetCount / priorCount) * 100) : 0;

  // Success probability: base 70 + history boost + severity penalty
  const severity = protocol.severityScore ?? 50;
  const historyBoost = priorCount > 0 ? Math.min(20, priorCount * 3) : 0;
  const severityPenalty = Math.round((severity - 50) * 0.2);
  const successProbability = Math.min(98, Math.max(40, 70 + historyBoost - severityPenalty));

  // Risk level
  const riskLevel: ExecutiveDecisionBrief['riskLevel'] =
    severity >= 85 ? 'CRITICAL' :
    severity >= 70 ? 'HIGH' :
    severity >= 50 ? 'MEDIUM' : 'LOW';

  // Budget
  const budget = protocol.preApprovedBudget
    ? `$${Number(protocol.preApprovedBudget).toLocaleString()} pre-approved`
    : 'Within operational budget';

  // Key decisions from tier 1 stakeholders
  const tier1 = (protocol.tier1Stakeholders as any[]) ?? [];
  const keyDecisions = tier1.slice(0, 3).map((s: any, i: number) => ({
    decision: i === 0 ? 'Authorize protocol activation and budget release'
      : i === 1 ? 'Confirm external communications posture'
      : 'Assign execution ownership and escalation path',
    owner: typeof s === 'string' ? s : (s.role ?? 'Executive Sponsor'),
    deadline: `T+${(i + 1) * 3} minutes`,
  }));

  if (keyDecisions.length === 0) {
    keyDecisions.push({
      decision: 'Authorize protocol activation',
      owner: protocol.primaryExecutiveRole ?? 'CEO',
      deadline: 'T+0 minutes',
    });
  }

  const timeSensitivity = protocol.timeSensitivity ?? 12;
  const timeToStabilize = timeSensitivity <= 12 ? '12 minutes to mobilize, 2–4 hours to stabilize'
    : timeSensitivity <= 48 ? '12 minutes to mobilize, 24–48 hours to stabilize'
    : '12 minutes to mobilize, 3–7 days to stabilize';

  const situationLine = situationContext
    ? situationContext
    : protocol.triggerCriteria ?? 'Strategic trigger detected — protocol pre-staged.';

  const riskRationale = `${protocol.name} carries a ${severity}/100 severity rating. ${
    priorCount > 0
      ? `Your organization has activated this protocol ${priorCount} time(s) — ${priorTargetMetRate}% hit the 12-minute target.`
      : 'This is your first activation of this protocol — all tasks are pre-staged.'
  }`;

  return {
    protocolName: protocol.name,
    triggerSummary: situationLine,
    riskLevel,
    riskRationale,
    recommendedAction: protocol.primaryResponseStrategy ?? 'Activate pre-staged protocol and notify Tier 1 stakeholders immediately.',
    expectedOutcome: `Mobilized response within 12 minutes. ${timeToStabilize}.`,
    timeToStabilize,
    budgetRequired: budget,
    keyDecisions,
    successProbability,
    priorActivationCount: priorCount,
    priorTargetMetRate,
    generatedAt: new Date(),
  };
}

// ── 2. War Room Auto-Composition ──────────────────────────────────────────────

export async function composeWarRoom(
  playbookId: string,
  organizationId: string
): Promise<WarRoomComposition> {
  const [protocol] = await db
    .select()
    .from(playbookLibrary)
    .where(eq(playbookLibrary.id, playbookId))
    .limit(1);

  if (!protocol) throw new Error(`Protocol ${playbookId} not found`);

  // Get stakeholder performance history for this org
  const recentStakeholders = await db
    .select()
    .from(activationStakeholders)
    .limit(500);

  // Build performance map by role
  const rolePerf: Record<string, { responseTimes: number[]; count: number; lastSeen: Date | null }> = {};
  for (const s of recentStakeholders) {
    if (!rolePerf[s.roleName]) rolePerf[s.roleName] = { responseTimes: [], count: 0, lastSeen: null };
    rolePerf[s.roleName].count++;
    if (s.responseTimeSeconds) rolePerf[s.roleName].responseTimes.push(s.responseTimeSeconds);
    if (s.acknowledgedAt) {
      const d = new Date(s.acknowledgedAt);
      if (!rolePerf[s.roleName].lastSeen || d > rolePerf[s.roleName].lastSeen!) {
        rolePerf[s.roleName].lastSeen = d;
      }
    }
  }

  // Org stakeholder contacts
  const contacts = await db
    .select()
    .from(stakeholderContacts)
    .where(eq(stakeholderContacts.organizationId, organizationId));

  const contactMap: Record<string, typeof contacts[0]> = {};
  for (const c of contacts) contactMap[c.role] = c;

  function buildParticipant(
    role: string,
    tier: number,
    raciType: string,
    rank: number,
    isRequired: boolean
  ): WarRoomParticipant {
    const perf = rolePerf[role];
    const contact = contactMap[role];
    const avgResponse = perf && perf.responseTimes.length > 0
      ? Math.round(perf.responseTimes.reduce((a, b) => a + b, 0) / perf.responseTimes.length)
      : null;

    // Readiness score: base 50 + history (up to 30) + fast response (up to 20)
    const historyScore = perf ? Math.min(30, perf.count * 5) : 0;
    const responseScore = avgResponse
      ? avgResponse < 60 ? 20 : avgResponse < 180 ? 10 : avgResponse < 300 ? 5 : 0
      : 0;
    const readinessScore = Math.min(100, 50 + historyScore + responseScore);

    return {
      rank,
      role,
      name: contact?.name ?? null,
      tier,
      raciType,
      readinessScore,
      avgResponseTimeSeconds: avgResponse,
      activationCount: perf?.count ?? 0,
      lastSeenAt: perf?.lastSeen ?? null,
      recommendedChannel: contact?.slackChannel ? 'Slack' : contact?.email ? 'Email' : 'Platform',
      isRequired,
    };
  }

  const tier1Roles = (protocol.tier1Stakeholders as any[]) ?? [];
  const tier2Roles = (protocol.tier2Stakeholders as any[]) ?? [];
  const tier3Roles = (protocol.tier3Stakeholders as any[]) ?? [];

  const t1Participants = tier1Roles.slice(0, 8).map((r: any, i: number) =>
    buildParticipant(typeof r === 'string' ? r : r.role, 1, 'accountable', i + 1, true)
  );
  const t2Participants = tier2Roles.slice(0, 12).map((r: any, i: number) =>
    buildParticipant(typeof r === 'string' ? r : r.role, 2, 'responsible', i + 1, false)
  );

  if (t1Participants.length === 0 && protocol.primaryExecutiveRole) {
    t1Participants.push(buildParticipant(protocol.primaryExecutiveRole, 1, 'accountable', 1, true));
  }

  const t3RoleNames = tier3Roles.map((r: any) => typeof r === 'string' ? r : r.role ?? 'Staff').slice(0, 10);

  // Composition confidence: based on how many contacts are mapped + history depth
  const mappedRoles = [...t1Participants, ...t2Participants].filter(p => p.name !== null).length;
  const totalRoles = t1Participants.length + t2Participants.length || 1;
  const compositionConfidence = Math.round(
    (mappedRoles / totalRoles) * 60 +
    Math.min(40, recentStakeholders.length * 0.5)
  );

  return {
    protocolId: playbookId,
    protocolName: protocol.name,
    tier1: t1Participants,
    tier2: t2Participants,
    tier3Roles: t3RoleNames,
    totalRequired: t1Participants.length + t2Participants.length,
    compositionConfidence: Math.min(100, compositionConfidence),
  };
}

// ── 3. 12-Minute Scorecard ────────────────────────────────────────────────────

const TWELVE_MINUTE_MILESTONES = [
  { milestone: 'Protocol staged & decision brief delivered', targetMinute: 0 },
  { milestone: 'Tier 1 stakeholders notified', targetMinute: 1 },
  { milestone: 'Executive authorization received', targetMinute: 3 },
  { milestone: '50% of Tier 1 stakeholders acknowledged', targetMinute: 4 },
  { milestone: 'Critical tasks assigned and in progress', targetMinute: 5 },
  { milestone: 'All Tier 1 stakeholders acknowledged', targetMinute: 6 },
  { milestone: 'Initial situation assessment complete', targetMinute: 7 },
  { milestone: '75% of critical tasks complete', targetMinute: 9 },
  { milestone: 'External communications sent (if required)', targetMinute: 10 },
  { milestone: 'Full mobilization complete — 12-minute target', targetMinute: 12 },
];

export async function getTwelveMinuteScorecard(
  activationId: string
): Promise<TwelveMinuteScorecard> {
  const [activation] = await db
    .select()
    .from(playbookActivations)
    .where(eq(playbookActivations.id, activationId))
    .limit(1);

  if (!activation) throw new Error(`Activation ${activationId} not found`);

  const startedAt = new Date(activation.activatedAt);
  const now = new Date();
  const elapsedSeconds = Math.round((now.getTime() - startedAt.getTime()) / 1000);
  const elapsedMinutes = elapsedSeconds / 60;

  // Load stakeholders and tasks for this activation
  const stakeholders = await db
    .select()
    .from(activationStakeholders)
    .where(eq(activationStakeholders.activationId, activationId));

  const tasks = await db
    .select()
    .from(activationTasks)
    .where(eq(activationTasks.activationId, activationId));

  const tier1 = stakeholders.filter(s => s.tier === 1);
  const acknowledged = tier1.filter(s => s.acknowledgedAt !== null);
  const stakeholderResponseRate = tier1.length > 0
    ? Math.round((acknowledged.length / tier1.length) * 100)
    : 0;

  const completedTasks = tasks.filter(t => t.status === 'completed');
  const taskCompletionRate = tasks.length > 0
    ? Math.round((completedTasks.length / tasks.length) * 100)
    : 0;

  // Score milestones based on elapsed time and event data
  const milestones: MilestoneStatus[] = TWELVE_MINUTE_MILESTONES.map(m => {
    if (elapsedMinutes < m.targetMinute) {
      return { ...m, status: 'pending', actualMinute: null, delta: null };
    }

    let hit = false;
    if (m.targetMinute === 0) hit = true;
    else if (m.targetMinute === 1) hit = stakeholders.some(s => s.notifiedAt !== null);
    else if (m.targetMinute === 3) hit = acknowledged.length > 0;
    else if (m.targetMinute === 4) hit = stakeholderResponseRate >= 50;
    else if (m.targetMinute === 5) hit = tasks.some(t => t.status === 'in_progress' || t.status === 'completed');
    else if (m.targetMinute === 6) hit = stakeholderResponseRate >= 90;
    else if (m.targetMinute === 7) hit = stakeholderResponseRate >= 90 && taskCompletionRate >= 10;
    else if (m.targetMinute === 9) hit = taskCompletionRate >= 75;
    else if (m.targetMinute === 10) hit = taskCompletionRate >= 80;
    else if (m.targetMinute === 12) hit = !!activation.completedAt;

    const actualMinute = hit ? m.targetMinute : Math.min(elapsedMinutes, m.targetMinute + 2);
    const delta = actualMinute - m.targetMinute;

    // At-risk: past the target but not hit
    const status: MilestoneStatus['status'] = hit ? 'hit'
      : elapsedMinutes > m.targetMinute + 2 ? 'missed'
      : elapsedMinutes > m.targetMinute ? 'at_risk'
      : 'pending';

    return { ...m, status, actualMinute: hit ? m.targetMinute : null, delta: hit ? 0 : delta };
  });

  // Velocity score: weighted average of milestone hits
  const hitCount = milestones.filter(m => m.status === 'hit').length;
  const passedCount = milestones.filter(m => m.status !== 'pending').length;
  const missedCount = milestones.filter(m => m.status === 'missed').length;
  const velocityScore = passedCount > 0
    ? Math.max(0, Math.round(((hitCount / passedCount) * 100) - (missedCount * 5)))
    : 100;

  // Projected completion
  const remainingTasks = tasks.length - completedTasks.length;
  const avgTaskTimeMin = completedTasks.length > 0 ? 1.5 : 2;
  const projectedCompletionMinute = remainingTasks > 0
    ? Math.round(elapsedMinutes + remainingTasks * avgTaskTimeMin)
    : null;

  const onTrack = velocityScore >= 70 && missedCount === 0;

  const summary = onTrack
    ? `On track — ${hitCount}/${milestones.length} milestones met. ${taskCompletionRate}% tasks complete.`
    : missedCount > 0
      ? `${missedCount} milestone(s) missed. ${taskCompletionRate}% tasks complete. Velocity score: ${velocityScore}.`
      : `At risk — velocity score ${velocityScore}. Stakeholder response rate: ${stakeholderResponseRate}%.`;

  return {
    activationId,
    elapsedSeconds,
    velocityScore,
    milestones,
    stakeholderResponseRate,
    taskCompletionRate,
    projectedCompletionMinute,
    onTrack,
    summary,
  };
}

// ── Utility: top protocols by activation frequency ────────────────────────────

export async function getTopActivatedProtocols(
  organizationId: string,
  limit = 10
): Promise<Array<{ playbookId: string; name: string; activationCount: number; avgSuccessRating: number; targetMetRate: number }>> {
  const activations = await db
    .select()
    .from(playbookActivations)
    .where(eq(playbookActivations.organizationId, organizationId))
    .orderBy(desc(playbookActivations.activatedAt))
    .limit(500);

  const grouped: Record<string, typeof activations> = {};
  for (const a of activations) {
    if (!grouped[a.playbookId]) grouped[a.playbookId] = [];
    grouped[a.playbookId].push(a);
  }

  const protocolIds = Object.keys(grouped);
  const protocols = await db
    .select({ id: playbookLibrary.id, name: playbookLibrary.name })
    .from(playbookLibrary)
    .where(sql`${playbookLibrary.id} = ANY(${protocolIds}::uuid[])`);

  const nameMap: Record<string, string> = {};
  for (const p of protocols) nameMap[p.id] = p.name;

  return Object.entries(grouped)
    .map(([playbookId, acts]) => {
      const rated = acts.filter(a => a.successRating !== null);
      const targetMet = acts.filter(a => a.targetMet);
      return {
        playbookId,
        name: nameMap[playbookId] ?? 'Unknown Protocol',
        activationCount: acts.length,
        avgSuccessRating: rated.length > 0
          ? Math.round(rated.reduce((s, a) => s + (a.successRating ?? 0), 0) / rated.length)
          : 0,
        targetMetRate: acts.length > 0 ? Math.round((targetMet.length / acts.length) * 100) : 0,
      };
    })
    .sort((a, b) => b.activationCount - a.activationCount)
    .slice(0, limit);
}
