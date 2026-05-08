/**
 * DebriefFeedbackService
 *
 * Closes the loop between post-activation debriefs and protocol improvement.
 *
 * The Close-Out Gate captures four structured fields per activation:
 *   - whatHeld: what worked
 *   - whatDidntHold: what failed under pressure
 *   - preparationGap: what wasn't anticipated
 *   - oneThingToEncode: the single lesson that changes the protocol
 *
 * This service analyzes those fields across all debriefs for a protocol,
 * identifies patterns, flags slow task steps, and generates specific improvement
 * proposals — turning debrief data into a self-improving protocol library.
 */

import { db } from '../db.js';
import { eq, desc, and, isNotNull, sql } from 'drizzle-orm';
import {
  activationOutcomes,
  playbookActivations,
  playbookLibrary,
  activationTasks,
} from '@shared/schema';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface TaskPerformanceInsight {
  taskName: string;
  ownerRole: string;
  avgMinutes: number;
  estimatedMinutes: number;
  varianceMinutes: number;          // actual - estimated (positive = slower than planned)
  completionRate: number;           // % of activations where task was completed
  isBotleneck: boolean;             // avg > 2× estimated
  observation: string;
}

export interface ProtocolImprovementProposal {
  type: 'task_reorder' | 'task_reassign' | 'timing_update' | 'add_step' | 'remove_step' | 'stakeholder_change';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  evidence: string;                 // what debrief data drove this
  before: string;
  after: string;
  estimatedImpactMinutes: number;   // projected time savings per activation
}

export interface ProtocolFeedbackReport {
  protocolId: string;
  protocolName: string;
  debriefCount: number;
  activationCount: number;
  targetMetRate: number;

  // Aggregated qualitative intelligence
  topThingsThatHeld: string[];      // most common "whatHeld" themes
  topThingsThatFailed: string[];    // most common "whatDidntHold" themes
  topGaps: string[];                // most common "preparationGap" themes
  encodedLessons: string[];         // all "oneThingToEncode" entries

  // Quantitative
  taskInsights: TaskPerformanceInsight[];
  avgExecutionMinutes: number | null;
  fastestExecutionMinutes: number | null;
  timeDistribution: { bucket: string; count: number }[];

  // Proposals
  proposals: ProtocolImprovementProposal[];

  // Classification
  debriefClassification: 'OPTIMIZING' | 'MIXED' | 'RECOVERING';
  classificationReason: string;

  generatedAt: Date;
}

// ── Text Analysis: simple frequency extraction ────────────────────────────────

function extractThemes(texts: string[], topN = 5): string[] {
  if (texts.length === 0) return [];

  // Strip common stop words and count meaningful phrases
  const stopWords = new Set(['the', 'and', 'was', 'were', 'had', 'have', 'our', 'we', 'not', 'but', 'that', 'this', 'with', 'for', 'from', 'did', 'not', 'did', 'could', 'would', 'should', 'than', 'more', 'also']);
  const phraseCount: Record<string, number> = {};

  for (const text of texts) {
    if (!text) continue;
    // Split into 2-3 word phrases for meaningful extraction
    const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 3 && !stopWords.has(w));
    for (let i = 0; i < words.length - 1; i++) {
      const phrase = `${words[i]} ${words[i + 1]}`;
      phraseCount[phrase] = (phraseCount[phrase] ?? 0) + 1;
    }
    // Single high-value words
    for (const word of words) {
      if (word.length > 6) phraseCount[word] = (phraseCount[word] ?? 0) + 1;
    }
  }

  return Object.entries(phraseCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, topN)
    .map(([phrase]) => phrase.charAt(0).toUpperCase() + phrase.slice(1));
}

// ── Task bottleneck detection ─────────────────────────────────────────────────

async function analyzeTaskPerformance(
  activationIds: string[]
): Promise<TaskPerformanceInsight[]> {
  if (activationIds.length === 0) return [];

  const tasks = await db
    .select()
    .from(activationTasks)
    .where(sql`${activationTasks.activationId} = ANY(${activationIds}::uuid[])`);

  // Group by task name
  const taskGroups: Record<string, typeof tasks> = {};
  for (const t of tasks) {
    const key = t.taskName.slice(0, 80);  // normalize long names
    if (!taskGroups[key]) taskGroups[key] = [];
    taskGroups[key].push(t);
  }

  const insights: TaskPerformanceInsight[] = [];

  for (const [taskName, rows] of Object.entries(taskGroups)) {
    const completed = rows.filter(r => r.status === 'completed' && r.startedAt && r.completedAt);
    const durations = completed.map(r => {
      const start = new Date(r.startedAt!).getTime();
      const end = new Date(r.completedAt!).getTime();
      return (end - start) / 60000;  // minutes
    });

    const avgMinutes = durations.length > 0
      ? Math.round((durations.reduce((a, b) => a + b, 0) / durations.length) * 10) / 10
      : 0;
    const estimatedMinutes = rows[0]?.estimatedMinutes ?? 2;
    const varianceMinutes = Math.round((avgMinutes - estimatedMinutes) * 10) / 10;
    const completionRate = Math.round((completed.length / rows.length) * 100);
    const isBottleneck = durations.length > 0 && avgMinutes > estimatedMinutes * 2;

    const observation = isBottleneck
      ? `Taking ${avgMinutes} min avg vs ${estimatedMinutes} min estimate — a ${Math.round(varianceMinutes)} min overrun per activation.`
      : completionRate < 70
        ? `Only ${completionRate}% completion rate — frequently skipped or blocked.`
        : avgMinutes > 0 && avgMinutes <= estimatedMinutes
          ? `Performing at or ahead of estimate (${avgMinutes} min avg).`
          : 'Performing within expected range.';

    insights.push({
      taskName: rows[0].taskName,
      ownerRole: rows[0].ownerRole ?? 'Unassigned',
      avgMinutes,
      estimatedMinutes,
      varianceMinutes,
      completionRate,
      isBotleneck: isBottleneck,
      observation,
    });
  }

  return insights.sort((a, b) => b.varianceMinutes - a.varianceMinutes);
}

// ── Generate improvement proposals from analysis ──────────────────────────────

function generateProposals(
  taskInsights: TaskPerformanceInsight[],
  topGaps: string[],
  topFailed: string[],
  encodedLessons: string[],
  targetMetRate: number
): ProtocolImprovementProposal[] {
  const proposals: ProtocolImprovementProposal[] = [];

  // Task-level proposals
  for (const task of taskInsights.filter(t => t.isBotleneck)) {
    proposals.push({
      type: 'timing_update',
      priority: task.varianceMinutes > 5 ? 'HIGH' : 'MEDIUM',
      title: `Update estimated duration for "${task.taskName.slice(0, 60)}"`,
      description: `This task consistently takes ${task.avgMinutes} minutes — ${task.varianceMinutes} minutes over its ${task.estimatedMinutes}-minute estimate. Updating the estimate will give the war room a more accurate 12-minute projection.`,
      evidence: `${task.avgMinutes} min actual vs ${task.estimatedMinutes} min estimated across recent activations.`,
      before: `Estimated: ${task.estimatedMinutes} min`,
      after: `Recommended estimate: ${Math.ceil(task.avgMinutes)} min`,
      estimatedImpactMinutes: Math.round(task.varianceMinutes * -0.5),
    });
  }

  for (const task of taskInsights.filter(t => t.completionRate < 60)) {
    proposals.push({
      type: 'task_reassign',
      priority: 'HIGH',
      title: `Clarify ownership for "${task.taskName.slice(0, 60)}"`,
      description: `Only ${task.completionRate}% completion rate. This task is frequently skipped — usually a sign of ownership ambiguity or unclear success criteria.`,
      evidence: `${100 - task.completionRate}% skip rate across activations.`,
      before: `Owner: ${task.ownerRole} — completion rate: ${task.completionRate}%`,
      after: 'Assign a named backup owner and add a binary completion criterion.',
      estimatedImpactMinutes: 1,
    });
  }

  // Gap-driven proposals
  if (topGaps.length > 0) {
    proposals.push({
      type: 'add_step',
      priority: 'MEDIUM',
      title: 'Add preparation step for recurring gap themes',
      description: `Recurring preparation gaps identified: ${topGaps.slice(0, 3).join(', ')}. These were anticipated in debriefs but not covered in the pre-staged protocol.`,
      evidence: `Appeared in close-out gate "preparationGap" field across multiple debriefs.`,
      before: 'Gap scenario not covered in pre-staged tasks.',
      after: 'Add contingency task block covering identified gap patterns.',
      estimatedImpactMinutes: 2,
    });
  }

  // Encoded lesson proposals
  if (encodedLessons.length >= 2) {
    proposals.push({
      type: 'task_reorder',
      priority: 'MEDIUM',
      title: 'Incorporate encoded institutional lessons into protocol sequence',
      description: `${encodedLessons.length} close-out gate lessons accumulated. Review and encode into task descriptions or sequence.`,
      evidence: `Lessons: ${encodedLessons.slice(0, 2).join(' | ')}`,
      before: 'Lessons exist in debrief records but not in the protocol itself.',
      after: 'Protocol updated with encoded lessons — preparation improves before next activation.',
      estimatedImpactMinutes: 1,
    });
  }

  // Overall velocity proposal
  if (targetMetRate < 70) {
    proposals.push({
      type: 'task_reorder',
      priority: 'CRITICAL',
      title: 'Reorder tasks to hit 12-minute target more consistently',
      description: `Only ${targetMetRate}% of activations hit the 12-minute mobilization target. The highest-impact improvements are: resolving the bottleneck tasks above and parallelizing non-dependent steps.`,
      evidence: `${100 - targetMetRate}% miss rate on the 12-minute benchmark.`,
      before: `Target met: ${targetMetRate}% of activations`,
      after: 'Target: 90%+ after task sequencing improvements.',
      estimatedImpactMinutes: 3,
    });
  }

  return proposals.sort((a, b) => {
    const order = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    return order[a.priority] - order[b.priority];
  });
}

// ── Main: generate full feedback report for a protocol ────────────────────────

export async function generateProtocolFeedbackReport(
  playbookId: string,
  organizationId: string
): Promise<ProtocolFeedbackReport> {
  const [protocol] = await db
    .select()
    .from(playbookLibrary)
    .where(eq(playbookLibrary.id, playbookId))
    .limit(1);

  if (!protocol) throw new Error(`Protocol ${playbookId} not found`);

  // Load activations
  const activations = await db
    .select()
    .from(playbookActivations)
    .where(
      and(
        eq(playbookActivations.playbookId, playbookId),
        eq(playbookActivations.organizationId, organizationId)
      )
    )
    .orderBy(desc(playbookActivations.activatedAt));

  const activationIds = activations.map(a => a.id);

  // Load outcomes (debriefs)
  const outcomes = activationIds.length > 0
    ? await db
        .select()
        .from(activationOutcomes)
        .where(sql`${activationOutcomes.activationId} = ANY(${activationIds}::uuid[])`)
        .orderBy(desc(activationOutcomes.createdAt))
    : [];

  const closedDebriefs = outcomes.filter(o => o.closeOutCompleted);

  // Extract themes
  const whatHeldTexts = closedDebriefs.map(o => o.whatHeld ?? '').filter(Boolean);
  const whatFailedTexts = closedDebriefs.map(o => o.whatDidntHold ?? '').filter(Boolean);
  const gapTexts = closedDebriefs.map(o => o.preparationGap ?? '').filter(Boolean);
  const lessonTexts = closedDebriefs.map(o => o.oneThingToEncode ?? '').filter(Boolean);

  const topThingsThatHeld = extractThemes(whatHeldTexts);
  const topThingsThatFailed = extractThemes(whatFailedTexts);
  const topGaps = extractThemes(gapTexts);
  const encodedLessons = lessonTexts.filter(Boolean);

  // Task analysis
  const taskInsights = await analyzeTaskPerformance(activationIds);

  // Execution time distribution
  const executionTimes = activations
    .map(a => a.actualExecutionTime)
    .filter(t => t !== null) as number[];

  const avgExecutionMinutes = executionTimes.length > 0
    ? Math.round(executionTimes.reduce((a, b) => a + b, 0) / executionTimes.length)
    : null;
  const fastestExecutionMinutes = executionTimes.length > 0
    ? Math.min(...executionTimes)
    : null;

  const timeDistribution = [
    { bucket: '≤12 min', count: executionTimes.filter(t => t <= 12).length },
    { bucket: '13–20 min', count: executionTimes.filter(t => t > 12 && t <= 20).length },
    { bucket: '21–30 min', count: executionTimes.filter(t => t > 20 && t <= 30).length },
    { bucket: '31–60 min', count: executionTimes.filter(t => t > 30 && t <= 60).length },
    { bucket: '>60 min', count: executionTimes.filter(t => t > 60).length },
  ];

  // Target met rate
  const targetMetCount = activations.filter(a => a.targetMet).length;
  const targetMetRate = activations.length > 0
    ? Math.round((targetMetCount / activations.length) * 100)
    : 0;

  // Classification
  let debriefClassification: ProtocolFeedbackReport['debriefClassification'];
  let classificationReason: string;

  if (targetMetRate >= 75 && topThingsThatFailed.length < 2) {
    debriefClassification = 'OPTIMIZING';
    classificationReason = `${targetMetRate}% of activations hit the 12-minute target with minimal reported failures. This protocol is operating in optimization mode.`;
  } else if (targetMetRate >= 50) {
    debriefClassification = 'MIXED';
    classificationReason = `${targetMetRate}% target-met rate with some recurring failures. Protocol is functional but has clear improvement opportunities.`;
  } else {
    debriefClassification = 'RECOVERING';
    classificationReason = `Only ${targetMetRate}% of activations hit the 12-minute target. Protocol requires structural improvement before the next activation.`;
  }

  // Generate proposals
  const proposals = generateProposals(
    taskInsights,
    topGaps,
    topThingsThatFailed,
    encodedLessons,
    targetMetRate
  );

  return {
    protocolId: playbookId,
    protocolName: protocol.name,
    debriefCount: closedDebriefs.length,
    activationCount: activations.length,
    targetMetRate,
    topThingsThatHeld,
    topThingsThatFailed,
    topGaps,
    encodedLessons,
    taskInsights,
    avgExecutionMinutes,
    fastestExecutionMinutes,
    timeDistribution,
    proposals,
    debriefClassification,
    classificationReason,
    generatedAt: new Date(),
  };
}

// ── Platform-wide: top protocols needing improvement ──────────────────────────

export async function getTopProtocolsNeedingFeedback(
  organizationId: string,
  limit = 10
): Promise<Array<{
  protocolId: string;
  protocolName: string;
  activationCount: number;
  closedDebriefs: number;
  targetMetRate: number;
  topLesson: string | null;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}>> {
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

  const results = [];
  for (const [playbookId, acts] of Object.entries(grouped)) {
    const ids = acts.map(a => a.id);
    const outcomes = await db
      .select()
      .from(activationOutcomes)
      .where(sql`${activationOutcomes.activationId} = ANY(${ids}::uuid[])`)
      .limit(20);

    const closed = outcomes.filter(o => o.closeOutCompleted);
    const targetMet = acts.filter(a => a.targetMet).length;
    const targetMetRate = Math.round((targetMet / acts.length) * 100);
    const latestLesson = closed.find(o => o.oneThingToEncode)?.oneThingToEncode ?? null;

    const priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' =
      targetMetRate < 50 ? 'CRITICAL' :
      targetMetRate < 75 ? 'HIGH' : 'MEDIUM';

    results.push({ playbookId, activationCount: acts.length, closedDebriefs: closed.length, targetMetRate, latestLesson, priority });
  }

  const protocolIds = results.map(r => r.playbookId);
  const protocols = protocolIds.length > 0
    ? await db
        .select({ id: playbookLibrary.id, name: playbookLibrary.name })
        .from(playbookLibrary)
        .where(sql`${playbookLibrary.id} = ANY(${protocolIds}::uuid[])`)
    : [];

  const nameMap: Record<string, string> = {};
  for (const p of protocols) nameMap[p.id] = p.name;

  return results
    .filter(r => r.closedDebriefs > 0)
    .sort((a, b) => a.targetMetRate - b.targetMetRate)
    .slice(0, limit)
    .map(r => ({
      protocolId: r.playbookId,
      protocolName: nameMap[r.playbookId] ?? 'Unknown Protocol',
      activationCount: r.activationCount,
      closedDebriefs: r.closedDebriefs,
      targetMetRate: r.targetMetRate,
      topLesson: r.latestLesson,
      priority: r.priority,
    }));
}
