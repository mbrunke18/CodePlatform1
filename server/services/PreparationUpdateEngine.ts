/**
 * PreparationUpdateEngine — Moat 1: Preparation Compounding Loop
 *
 * Called every time an activation's Close-Out Gate is completed.
 * Reads the four structured answers and generates three categories of updates
 * that feed back into the preparation architecture:
 *
 *   1. Signal Calibration — adjust keyword sensitivity for this trigger type
 *   2. Ownership Assignment — pre-assign roles based on who handled what
 *   3. Protocol Suggestions — what to change based on what didn't hold
 *
 * Also maintains the org-level Preparation Compound Score, which makes the
 * compounding depth visible on the dashboard.
 */

import { db } from '../db.js';
import { eq, and, count } from 'drizzle-orm';
import {
  preparationUpdates,
  preparationCompoundScores,
  activationOutcomes,
  signalCalibrationConfig,
  organizations,
} from '@shared/schema';

// ─── Score calculation weights ─────────────────────────────────────────────────
const SCORE_WEIGHTS = {
  closeOut: 8,           // Each completed Close-Out Gate: +8 points base
  updateApplied: 3,      // Each update that gets applied: +3 points
  signalCalibration: 2,  // Each signal calibration update: +2 points
  protocolSuggestion: 1, // Each protocol suggestion: +1 point
};

const MAX_MONTHS_REBUILD = 24; // Upper bound for switching cost estimate

// ─── Extract signal keywords from close-out text ─────────────────────────────
function extractKeywords(text: string): string[] {
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'was', 'were', 'is', 'are', 'had', 'have', 'did', 'do', 'that', 'this', 'it', 'we', 'our', 'not', 'what', 'how', 'when', 'which']);
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 4 && !stopWords.has(w))
    .slice(0, 8);
}

// ─── Infer owner role from preparation gap text ───────────────────────────────
function inferOwnerRole(text: string): { role: string; dept: string } | null {
  const lower = text.toLowerCase();
  if (lower.includes('legal') || lower.includes('counsel') || lower.includes('compliance')) return { role: 'Chief Legal Officer', dept: 'Legal' };
  if (lower.includes('ciso') || lower.includes('security') || lower.includes('cyber')) return { role: 'Chief Information Security Officer', dept: 'Technology' };
  if (lower.includes('cfo') || lower.includes('finance') || lower.includes('treasury')) return { role: 'Chief Financial Officer', dept: 'Finance' };
  if (lower.includes('coo') || lower.includes('operations') || lower.includes('supply chain')) return { role: 'Chief Operating Officer', dept: 'Operations' };
  if (lower.includes('comms') || lower.includes('communications') || lower.includes('pr') || lower.includes('media')) return { role: 'Chief Communications Officer', dept: 'Communications' };
  if (lower.includes('hr') || lower.includes('people') || lower.includes('talent')) return { role: 'Chief People Officer', dept: 'Human Resources' };
  if (lower.includes('cto') || lower.includes('technology') || lower.includes('engineering')) return { role: 'Chief Technology Officer', dept: 'Technology' };
  return null;
}

// ─── Main: process a completed Close-Out Gate ─────────────────────────────────
export async function processCloseOutGate(outcomeId: string): Promise<void> {
  try {
    const [outcome] = await db
      .select()
      .from(activationOutcomes)
      .where(eq(activationOutcomes.id, outcomeId))
      .limit(1);

    if (!outcome || !outcome.closeOutCompleted) return;

    const orgId = outcome.organizationId;
    const playbookId = outcome.playbookId;
    const updates: typeof preparationUpdates.$inferInsert[] = [];

    // ── Update 1: Signal Calibration ────────────────────────────────────────
    // "What prepared response worked" → strengthen those signal keywords
    // "What preparation gap" → add new keywords to catch it earlier
    if (outcome.whatHeld) {
      const strongKeywords = extractKeywords(outcome.whatHeld);
      if (strongKeywords.length > 0) {
        updates.push({
          organizationId: orgId,
          activationOutcomeId: outcomeId,
          playbookId: playbookId ?? null,
          triggerPattern: outcome.playbookId ?? 'general',
          updateType: 'signal_calibration',
          signalKeywordsToAdd: strongKeywords,
          signalKeywordsToRemove: [],
          confidenceAdjust: 3, // boost: these signals are confirmed real
          suggestionTitle: 'Strengthen confirmed signal keywords',
          suggestionDetail: `These keywords reliably indicated a real trigger event: ${strongKeywords.join(', ')}. Confidence weight increased.`,
        });
      }
    }

    if (outcome.preparationGap) {
      const gapKeywords = extractKeywords(outcome.preparationGap);
      if (gapKeywords.length > 0) {
        updates.push({
          organizationId: orgId,
          activationOutcomeId: outcomeId,
          playbookId: playbookId ?? null,
          triggerPattern: outcome.playbookId ?? 'general',
          updateType: 'signal_calibration',
          signalKeywordsToAdd: gapKeywords,
          signalKeywordsToRemove: [],
          confidenceAdjust: 0,
          suggestionTitle: 'Add early-warning keywords for uncovered gap',
          suggestionDetail: `These themes weren't in the pre-staged signal profile: ${gapKeywords.join(', ')}. Adding to catch this earlier next time.`,
        });
      }
    }

    // ── Update 2: Ownership Assignment ──────────────────────────────────────
    // "What didn't hold" → the gap usually reveals who SHOULD have been pre-assigned
    if (outcome.whatDidntHold) {
      const ownerSuggestion = inferOwnerRole(outcome.whatDidntHold);
      if (ownerSuggestion) {
        updates.push({
          organizationId: orgId,
          activationOutcomeId: outcomeId,
          playbookId: playbookId ?? null,
          triggerPattern: null,
          updateType: 'ownership_assignment',
          suggestedOwnerRole: ownerSuggestion.role,
          suggestedOwnerDept: ownerSuggestion.dept,
          ownershipRationale: `Gap identified during live activation: "${outcome.whatDidntHold.slice(0, 200)}". Pre-staging this owner will close the coordination delay.`,
          suggestionTitle: `Pre-assign ${ownerSuggestion.role} to this protocol`,
          suggestionDetail: `During execution, coordination with ${ownerSuggestion.dept} caused delay. Pre-assigning the ${ownerSuggestion.role} before the trigger fires eliminates this gap.`,
        });
      }
    }

    // ── Update 3: Protocol Architecture Suggestion ───────────────────────────
    // "One thing to encode" → direct protocol update suggestion
    if (outcome.oneThingToEncode) {
      updates.push({
        organizationId: orgId,
        activationOutcomeId: outcomeId,
        playbookId: playbookId ?? null,
        triggerPattern: null,
        updateType: 'protocol_suggestion',
        suggestionTitle: 'Encode live-activation learning into protocol',
        suggestionDetail: outcome.oneThingToEncode,
        suggestionPriority: 'high', // These are always high priority — direct executive input
        generatedBy: 'system',
      });
    }

    // Persist all updates
    if (updates.length > 0) {
      await db.insert(preparationUpdates).values(updates as any[]);
    }

    // Apply signal calibration updates to signalCalibrationConfig
    for (const update of updates) {
      if (update.updateType === 'signal_calibration' && update.triggerPattern && (update.signalKeywordsToAdd?.length ?? 0) > 0) {
        try {
          const existing = await db
            .select()
            .from(signalCalibrationConfig)
            .where(and(
              eq(signalCalibrationConfig.organizationId, orgId),
              eq(signalCalibrationConfig.triggerPattern, update.triggerPattern)
            ))
            .limit(1);

          if (existing.length > 0) {
            const currentWeights = (existing[0].keywordWeights as Record<string, number>) ?? {};
            const newKeywords = update.signalKeywordsToAdd ?? [];
            for (const kw of newKeywords) {
              currentWeights[kw] = (currentWeights[kw] ?? 1.0) + 0.15;
            }
            await db
              .update(signalCalibrationConfig)
              .set({
                keywordWeights: currentWeights,
                calibrationCount: (existing[0].calibrationCount ?? 0) + 1,
                lastCalibrated: new Date(),
                updatedAt: new Date(),
              })
              .where(eq(signalCalibrationConfig.id, existing[0].id));
          } else {
            const initialWeights: Record<string, number> = {};
            for (const kw of (update.signalKeywordsToAdd ?? [])) {
              initialWeights[kw] = 1.15;
            }
            await db.insert(signalCalibrationConfig).values({
              organizationId: orgId,
              triggerPattern: update.triggerPattern,
              keywordWeights: initialWeights,
              calibrationCount: 1,
              lastCalibrated: new Date(),
            } as any);
          }
        } catch { /* non-critical */ }
      }
    }

    // ── Recalculate Preparation Compound Score ──────────────────────────────
    await recalculateCompoundScore(orgId);

  } catch (err) {
    console.error('[PreparationUpdateEngine] Error processing close-out gate:', err);
  }
}

// ─── Recalculate the org's Preparation Compound Score ────────────────────────
export async function recalculateCompoundScore(organizationId: string): Promise<void> {
  try {
    // Count completed close-outs
    const [closeOutCount] = await db
      .select({ c: count() })
      .from(activationOutcomes)
      .where(and(
        eq(activationOutcomes.organizationId, organizationId),
        eq(activationOutcomes.closeOutCompleted, true)
      ));
    const totalCloseOuts = Number(closeOutCount?.c ?? 0);

    // Count updates generated and applied
    const [updatesCount] = await db
      .select({ c: count() })
      .from(preparationUpdates)
      .where(eq(preparationUpdates.organizationId, organizationId as any));
    const totalUpdates = Number(updatesCount?.c ?? 0);

    const [appliedCount] = await db
      .select({ c: count() })
      .from(preparationUpdates)
      .where(and(
        eq(preparationUpdates.organizationId, organizationId as any),
        eq(preparationUpdates.status, 'applied')
      ));
    const totalApplied = Number(appliedCount?.c ?? 0);

    const [calCount] = await db
      .select({ c: count() })
      .from(preparationUpdates)
      .where(and(
        eq(preparationUpdates.organizationId, organizationId as any),
        eq(preparationUpdates.updateType, 'signal_calibration')
      ));
    const signalCals = Number(calCount?.c ?? 0);

    const [protCount] = await db
      .select({ c: count() })
      .from(preparationUpdates)
      .where(and(
        eq(preparationUpdates.organizationId, organizationId as any),
        eq(preparationUpdates.updateType, 'protocol_suggestion')
      ));
    const protSuggestions = Number(protCount?.c ?? 0);

    // Compound score formula (0–100 cap)
    const rawScore =
      totalCloseOuts * SCORE_WEIGHTS.closeOut +
      totalApplied * SCORE_WEIGHTS.updateApplied +
      signalCals * SCORE_WEIGHTS.signalCalibration +
      protSuggestions * SCORE_WEIGHTS.protocolSuggestion;

    const score = Math.min(100, rawScore);

    // Switching cost: each close-out encodes ~1 week of institutional knowledge
    const monthsToRebuild = Math.min(MAX_MONTHS_REBUILD, Math.round(totalCloseOuts * 0.75 + signalCals * 0.25));

    // Encoding timeline entry
    const encodingEvent = {
      date: new Date().toISOString(),
      event: `Close-Out Gate #${totalCloseOuts} completed`,
      scoreDelta: SCORE_WEIGHTS.closeOut,
    };

    // Upsert the compound score record
    const existing = await db
      .select()
      .from(preparationCompoundScores)
      .where(eq(preparationCompoundScores.organizationId, organizationId as any))
      .limit(1);

    if (existing.length > 0) {
      const currentTimeline = (existing[0].encodingTimeline as any[]) ?? [];
      currentTimeline.push(encodingEvent);
      await db
        .update(preparationCompoundScores)
        .set({
          score,
          totalCloseOuts,
          totalUpdatesGenerated: totalUpdates,
          totalUpdatesApplied: totalApplied,
          signalCalibrationsApplied: signalCals,
          protocolSuggestionsGenerated: protSuggestions,
          monthsToRebuildOnCompetitor: monthsToRebuild,
          encodingTimeline: currentTimeline,
          calculatedAt: new Date(),
        })
        .where(eq(preparationCompoundScores.organizationId, organizationId as any));
    } else {
      await db.insert(preparationCompoundScores).values({
        organizationId: organizationId as any,
        score,
        totalCloseOuts,
        totalUpdatesGenerated: totalUpdates,
        totalUpdatesApplied: totalApplied,
        signalCalibrationsApplied: signalCals,
        ownershipAssignmentsApplied: 0,
        protocolSuggestionsGenerated: protSuggestions,
        monthsToRebuildOnCompetitor: monthsToRebuild,
        encodingTimeline: [encodingEvent],
      } as any);
    }

    console.log(`[PreparationUpdateEngine] Compound Score for org ${organizationId}: ${score} (${totalCloseOuts} close-outs, ${monthsToRebuild} months to rebuild)`);
  } catch (err) {
    console.error('[PreparationUpdateEngine] Error recalculating compound score:', err);
  }
}
