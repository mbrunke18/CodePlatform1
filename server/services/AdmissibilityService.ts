import { db } from '../db';
import { playbookActivations, playbookLibrary, admissibilityChecks, type AdmissibilityCheck } from '@shared/schema';
import { eq } from 'drizzle-orm';

export type AdmissibilityVerdict = 'admissible' | 'held' | 'reauthorized';

export interface AdmissibilityCondition {
  label: string;
  holds: boolean;
  detail: string;
}

// Maximum time (minutes) a task in a given phase may fire after authorization
// before its authorization conditions must be re-verified against current state.
const PHASE_WINDOW_MINUTES: Record<string, number> = {
  immediate: 60,
  secondary: 240,
  'follow-up': 1440,
};

/**
 * AdmissibilityService — the "Third Clock".
 *
 * The First Clock is initial executive sign-off (authorizedAt/authorizedBy on
 * playbookActivations). The Second Clock is task assignment/notification. The
 * Third Clock re-verifies, at the moment a pre-staged task actually fires,
 * that the conditions under which it was authorized still hold — not just
 * once at initial sign-off.
 */
export class AdmissibilityService {
  static async evaluate(
    activationId: string,
    task: { taskDescription: string; ownerRole?: string; phase?: string }
  ): Promise<{ check: AdmissibilityCheck; conditions: AdmissibilityCondition[] }> {
    const [activation] = await db
      .select()
      .from(playbookActivations)
      .where(eq(playbookActivations.id, activationId))
      .limit(1);
    if (!activation) throw new Error('Activation not found');

    const conditions: AdmissibilityCondition[] = [];

    // Condition 1: The authorization itself has not been revoked or superseded.
    const authActive = activation.status === 'active';
    conditions.push({
      label: 'Authorization still active',
      holds: authActive,
      detail: authActive
        ? 'Executive sign-off has not been revoked or superseded.'
        : `Activation status is "${activation.status}" — the original authorization is no longer active.`,
    });

    // Condition 2: The underlying Readiness Protocol has not materially changed
    // since the executive signed off on it.
    let protocolUnchanged = true;
    let protocolDetail = 'No change detected to the underlying Readiness Protocol since sign-off.';
    if (activation.authorizedAt) {
      const [playbook] = await db
        .select({ updatedAt: playbookLibrary.updatedAt })
        .from(playbookLibrary)
        .where(eq(playbookLibrary.id, activation.playbookId))
        .limit(1);
      if (playbook?.updatedAt && new Date(playbook.updatedAt) > new Date(activation.authorizedAt)) {
        protocolUnchanged = false;
        protocolDetail = `The Readiness Protocol was updated at ${new Date(playbook.updatedAt).toISOString()} — after the ${new Date(activation.authorizedAt).toISOString()} sign-off.`;
      }
    }
    conditions.push({ label: 'Protocol unchanged since authorization', holds: protocolUnchanged, detail: protocolDetail });

    // Condition 3: The task is firing within the window the executive actually
    // authorized for its phase — a stale, held task cannot execute on stale authority.
    const phase = task.phase || 'immediate';
    const windowMinutes = PHASE_WINDOW_MINUTES[phase] ?? PHASE_WINDOW_MINUTES.immediate;
    let withinWindow = true;
    let windowDetail = `Task is firing within the ${windowMinutes}-minute window authorized for "${phase}" phase tasks.`;
    if (activation.authorizedAt) {
      const elapsedMinutes = (Date.now() - new Date(activation.authorizedAt).getTime()) / 60000;
      if (elapsedMinutes > windowMinutes) {
        withinWindow = false;
        windowDetail = `${Math.round(elapsedMinutes)} minutes have elapsed since authorization — beyond the ${windowMinutes}-minute window for "${phase}" phase tasks.`;
      }
    }
    conditions.push({ label: 'Within authorized execution window', holds: withinWindow, detail: windowDetail });

    const verdict: AdmissibilityVerdict = conditions.every(c => c.holds) ? 'admissible' : 'held';

    const [check] = await db
      .insert(admissibilityChecks)
      .values({
        activationId,
        taskDescription: task.taskDescription,
        ownerRole: task.ownerRole || null,
        phase: task.phase || null,
        verdict,
        conditions,
      })
      .returning();

    return { check, conditions };
  }

  static async reauthorize(checkId: string, resolvedBy: string, resolutionNote?: string): Promise<AdmissibilityCheck> {
    const [updated] = await db
      .update(admissibilityChecks)
      .set({
        verdict: 'reauthorized',
        resolvedBy,
        resolvedAt: new Date(),
        resolutionNote: resolutionNote || null,
      })
      .where(eq(admissibilityChecks.id, checkId))
      .returning();
    if (!updated) throw new Error('Admissibility check not found');
    return updated;
  }
}
