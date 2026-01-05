import { db } from '../db';
import { executionInstances, scenarioStakeholders, notifications } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { notifyPlaybookActivation } from './SlackNotificationService';
import pino from 'pino';

const log = pino({ name: 'playbook-executor' });

/**
 * Activate a playbook - orchestrate 12-minute coordinated response
 */
export async function activatePlaybook(
  organizationId: string, 
  playbookId: string, 
  scenarioId: string,
  executionPlanId: string,
  triggeredBy?: string
) {
  log.info(`🚀 Activating playbook ${playbookId} for scenario ${scenarioId}`);
  
  const activationTime = new Date();
  const executionDeadline = new Date(activationTime.getTime() + 12 * 60 * 1000); // 12 minutes
  
  try {
    // Create execution instance
    const executionData = {
      organizationId,
      scenarioId,
      executionPlanId,
      triggeredBy,
      triggerData: { playbookId, activatedAt: activationTime.toISOString() },
      status: 'in_progress' as const,
      currentPhase: 'immediate' as const,
      startedAt: activationTime,
    };
    
    const [instance] = await db.insert(executionInstances).values(executionData as any).returning();
    log.info({ instanceId: instance.id }, '✅ Execution instance created');
    
    // Notify stakeholders
    const stakeholders = await db.select().from(scenarioStakeholders).where(eq(scenarioStakeholders.scenarioId, scenarioId));
    
    for (const stakeholder of stakeholders) {
      const userId = stakeholder.userId;
      if (userId) {
        await db.insert(notifications).values({
          organizationId,
          userId,
          type: 'playbook_activation',
          title: 'Strategic Playbook Activated',
          message: `Coordinated response initiated. Execute by ${executionDeadline.toLocaleTimeString()}`,
          status: 'unread',
          createdAt: new Date(),
        } as any);
      }
    }
    
    log.info({ count: stakeholders.length }, '✅ Stakeholders notified');
    
    // Send Slack notification (non-blocking)
    notifyPlaybookActivation(playbookId, stakeholders.length, executionDeadline).catch(err => {
      log.warn({ error: err }, 'Slack notification failed');
    });
    
    return {
      success: true,
      executionId: instance.id,
      deadline: executionDeadline,
      stakeholders: stakeholders.length,
      message: `Playbook activated. 12-minute execution window initiated.`,
    };
  } catch (error) {
    log.error({ error }, '❌ Playbook activation failed');
    throw error;
  }
}

/**
 * Track playbook execution progress
 */
export async function getExecutionProgress(executionId: string) {
  try {
    const execution = await db.select().from(executionInstances).where(eq(executionInstances.id, executionId));
    
    if (!execution.length) return null;
    
    const instance = execution[0];
    const startedAt = instance.startedAt || new Date();
    const elapsed = Date.now() - startedAt.getTime();
    const totalWindow = 12 * 60 * 1000; // 12 minutes
    const progressPercent = Math.min(100, Math.round((elapsed / totalWindow) * 100));
    
    return {
      executionId,
      status: instance.status,
      currentPhase: instance.currentPhase,
      startedAt: instance.startedAt,
      deadline: new Date(startedAt.getTime() + totalWindow),
      elapsedMinutes: Math.round(elapsed / 1000 / 60),
      progressPercent,
      outcome: instance.outcome,
    };
  } catch (error) {
    log.error({ error }, 'Error tracking execution');
    return null;
  }
}

/**
 * Complete an execution instance
 */
export async function completeExecution(
  executionId: string, 
  outcome: 'successful' | 'partially_successful' | 'failed',
  notes?: string
) {
  try {
    const [updated] = await db.update(executionInstances)
      .set({
        status: 'completed',
        completedAt: new Date(),
        outcome,
        outcomeNotes: notes,
        actualExecutionTime: await calculateActualTime(executionId),
      })
      .where(eq(executionInstances.id, executionId))
      .returning();
    
    log.info({ executionId, outcome }, '✅ Execution completed');
    return updated;
  } catch (error) {
    log.error({ error }, 'Error completing execution');
    throw error;
  }
}

async function calculateActualTime(executionId: string): Promise<number> {
  const [instance] = await db.select().from(executionInstances).where(eq(executionInstances.id, executionId));
  if (!instance?.startedAt) return 0;
  return Math.round((Date.now() - instance.startedAt.getTime()) / 1000 / 60);
}
