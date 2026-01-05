import { db } from '../db';
import { 
  executionInstances, 
  activationEvents,
  stakeholderAcknowledgments,
  budgetUnlocks,
  generatedDocuments,
  externalProjectSyncs,
  preflightCheckResults,
  scenarioStakeholders,
  notifications,
  playbookLibrary,
  scenarioExecutionPlans,
  executionPlanTasks,
  executionPlanPhases
} from '@shared/schema';
import { eq, and } from 'drizzle-orm';
import { PreFlightCheckService, PreFlightCheckResult } from './PreFlightCheckService';
import { ExecutionPlanSyncService } from './ExecutionPlanSyncService';
import { DocumentTemplateEngine } from './DocumentTemplateEngine';
import { notifyPlaybookActivation } from './SlackNotificationService';
import pino from 'pino';

const logger = pino({ name: 'execution-orchestrator' });

export interface ActivationRequest {
  organizationId: string;
  scenarioId?: string | null;
  executionPlanId: string;
  playbookId: string;
  triggeredBy?: string;
  syncPlatform?: 'jira' | 'asana' | 'monday' | 'ms_project' | 'servicenow';
  skipPreflight?: boolean;
}

export interface ActivationResult {
  success: boolean;
  executionInstanceId?: string;
  deadline?: Date;
  preflightResult?: PreFlightCheckResult;
  projectSync?: {
    platform: string;
    projectUrl?: string;
    tasksCreated: number;
  };
  documentsGenerated: number;
  stakeholdersNotified: number;
  budgetUnlocked?: {
    totalAmount: number;
    currency: string;
    categories: string[];
  };
  errors: string[];
  events: Array<{
    type: string;
    success: boolean;
    durationMs: number;
  }>;
}

export class ExecutionOrchestrator {
  private preflightService: PreFlightCheckService;
  private syncService: ExecutionPlanSyncService;
  private documentEngine: DocumentTemplateEngine;

  constructor() {
    this.preflightService = new PreFlightCheckService();
    this.syncService = new ExecutionPlanSyncService();
    this.documentEngine = new DocumentTemplateEngine();
  }

  async activate(request: ActivationRequest): Promise<ActivationResult> {
    const startTime = Date.now();
    const result: ActivationResult = {
      success: false,
      documentsGenerated: 0,
      stakeholdersNotified: 0,
      errors: [],
      events: [],
    };

    let executionInstanceId: string | undefined;

    try {
      // Step 1: Record activation start event
      logger.info({ request }, '🚀 Starting one-click activation');

      // Step 2: Run pre-flight checks (unless skipped)
      if (!request.skipPreflight) {
        const preflightStart = Date.now();
        const preflightResult = await this.runPreflight(request);
        result.preflightResult = preflightResult;
        
        result.events.push({
          type: preflightResult.canProceed ? 'preflight_passed' : 'preflight_failed',
          success: preflightResult.canProceed,
          durationMs: Date.now() - preflightStart,
        });

        if (!preflightResult.canProceed) {
          result.errors.push('Pre-flight check failed: blocking issues detected');
          logger.warn({ preflightResult }, '❌ Pre-flight check failed');
          return result;
        }
      }

      // Step 3: Create execution instance
      const instanceStart = Date.now();
      const activationTime = new Date();
      const executionDeadline = new Date(activationTime.getTime() + 12 * 60 * 1000);

      const [instance] = await db.insert(executionInstances).values({
        organizationId: request.organizationId,
        scenarioId: request.scenarioId || null,
        executionPlanId: request.executionPlanId,
        triggeredBy: request.triggeredBy,
        triggerData: { playbookId: request.playbookId, activatedAt: activationTime.toISOString() },
        status: 'in_progress',
        currentPhase: 'immediate',
        startedAt: activationTime,
      } as any).returning();

      executionInstanceId = instance.id;
      result.executionInstanceId = executionInstanceId;
      result.deadline = executionDeadline;

      // Record activation started event
      await this.recordEvent(executionInstanceId, request.organizationId, 'activation_started', {
        playbookId: request.playbookId,
        deadline: executionDeadline.toISOString(),
      }, true, Date.now() - instanceStart);

      result.events.push({
        type: 'activation_started',
        success: true,
        durationMs: Date.now() - instanceStart,
      });

      // Step 4: Sync to external platform (if configured)
      if (request.syncPlatform) {
        const syncStart = Date.now();
        try {
          const syncResult = await this.syncToExternalPlatform(
            executionInstanceId,
            request
          );
          result.projectSync = syncResult;
          result.events.push({
            type: 'project_created',
            success: true,
            durationMs: Date.now() - syncStart,
          });
        } catch (error: any) {
          logger.error({ error }, 'External sync failed');
          result.errors.push(`External sync failed: ${error.message}`);
          result.events.push({
            type: 'project_created',
            success: false,
            durationMs: Date.now() - syncStart,
          });
        }
      }

      // Step 5: Generate documents
      const docStart = Date.now();
      try {
        const docsGenerated = await this.generateDocuments(executionInstanceId, request);
        result.documentsGenerated = docsGenerated;
        result.events.push({
          type: 'documents_generated',
          success: true,
          durationMs: Date.now() - docStart,
        });
      } catch (error: any) {
        logger.error({ error }, 'Document generation failed');
        result.errors.push(`Document generation failed: ${error.message}`);
      }

      // Step 6: Notify stakeholders
      const notifyStart = Date.now();
      try {
        const notified = await this.notifyStakeholders(executionInstanceId, request, executionDeadline);
        result.stakeholdersNotified = notified;
        result.events.push({
          type: 'stakeholders_notified',
          success: true,
          durationMs: Date.now() - notifyStart,
        });
      } catch (error: any) {
        logger.error({ error }, 'Stakeholder notification failed');
        result.errors.push(`Notification failed: ${error.message}`);
      }

      // Step 7: Unlock pre-approved budgets
      const budgetStart = Date.now();
      try {
        const budgetResult = await this.unlockBudgets(executionInstanceId, request);
        if (budgetResult) {
          result.budgetUnlocked = budgetResult;
          result.events.push({
            type: 'budget_unlocked',
            success: true,
            durationMs: Date.now() - budgetStart,
          });
        }
      } catch (error: any) {
        logger.error({ error }, 'Budget unlock failed');
        result.errors.push(`Budget unlock failed: ${error.message}`);
      }

      // Step 8: Record completion
      await this.recordEvent(executionInstanceId, request.organizationId, 'activation_completed', {
        totalDurationMs: Date.now() - startTime,
        documentsGenerated: result.documentsGenerated,
        stakeholdersNotified: result.stakeholdersNotified,
      }, true, Date.now() - startTime);

      result.success = true;
      logger.info({ 
        executionInstanceId,
        durationMs: Date.now() - startTime 
      }, '✅ One-click activation completed');

      return result;

    } catch (error: any) {
      logger.error({ error }, '❌ Activation failed');
      result.errors.push(error.message);
      
      if (executionInstanceId) {
        await this.recordEvent(executionInstanceId, request.organizationId, 'activation_failed', {
          error: error.message,
        }, false, Date.now() - startTime);
      }

      return result;
    }
  }

  private async runPreflight(request: ActivationRequest): Promise<PreFlightCheckResult> {
    const result = await this.preflightService.performCheck({
      executionPlanId: request.executionPlanId,
      organizationId: request.organizationId,
    });

    // Store result for audit trail
    try {
      await db.insert(preflightCheckResults).values({
        executionPlanId: request.executionPlanId,
        organizationId: request.organizationId,
        canProceed: result.canProceed,
        readinessScore: result.readinessScore,
        estimatedCompletionTime: result.estimatedCompletionTime,
        criticalIssues: result.criticalIssues,
        warnings: result.warnings,
        metadata: result.metadata,
        checkedBy: request.triggeredBy,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 min validity
      } as any);
    } catch (err) {
      logger.warn({ err }, 'Failed to store preflight result');
    }

    return result;
  }

  private async syncToExternalPlatform(
    executionInstanceId: string,
    request: ActivationRequest
  ): Promise<{ platform: string; projectUrl?: string; tasksCreated: number }> {
    // Get playbook details for naming
    const [playbook] = await db.select().from(playbookLibrary).where(eq(playbookLibrary.id, request.playbookId));
    
    // Get execution plan tasks
    const tasks = await db.select().from(executionPlanTasks)
      .where(eq(executionPlanTasks.executionPlanId, request.executionPlanId));

    // Create project in external system (demo mode - would use real credentials in production)
    const projectName = playbook ? `M: ${playbook.name}` : 'M Strategic Response';
    const projectKey = `M${Date.now().toString(36).toUpperCase().slice(-6)}`;

    // Record sync attempt
    const [syncRecord] = await db.insert(externalProjectSyncs).values({
      executionInstanceId,
      organizationId: request.organizationId,
      platform: request.syncPlatform || 'jira',
      externalProjectKey: projectKey,
      externalProjectUrl: `https://demo.atlassian.net/jira/software/projects/${projectKey}`,
      tasksCreated: tasks.length,
      taskMappings: tasks.map((t, i) => ({
        internalId: t.id,
        externalId: `${projectKey}-${i + 1}`,
        externalKey: `${projectKey}-${i + 1}`,
      })),
      syncStatus: 'synced',
      lastSyncAt: new Date(),
    } as any).returning();

    return {
      platform: request.syncPlatform || 'jira',
      projectUrl: syncRecord.externalProjectUrl || undefined,
      tasksCreated: tasks.length,
    };
  }

  private async generateDocuments(
    executionInstanceId: string,
    request: ActivationRequest
  ): Promise<number> {
    // Get playbook for document generation context
    const [playbook] = await db.select().from(playbookLibrary).where(eq(playbookLibrary.id, request.playbookId));
    
    if (!playbook) return 0;

    // Generate standard documents
    const documentsToGenerate = [
      { name: 'Executive Briefing', type: 'briefing' },
      { name: 'Stakeholder Communication', type: 'communication' },
      { name: 'Execution Checklist', type: 'checklist' },
    ];

    let generatedCount = 0;

    for (const doc of documentsToGenerate) {
      try {
        const content = this.generateSimpleDocument(doc.type, {
          playbookName: playbook.name,
          playbookDescription: playbook.description,
          activationTime: new Date().toISOString(),
          deadline: new Date(Date.now() + 12 * 60 * 1000).toISOString(),
        });

        await db.insert(generatedDocuments).values({
          executionInstanceId,
          organizationId: request.organizationId,
          documentName: doc.name,
          documentType: doc.type,
          content,
          format: 'markdown',
          variablesUsed: { playbookId: request.playbookId },
          generatedBy: 'system',
        } as any);

        generatedCount++;
      } catch (err) {
        logger.warn({ err, docType: doc.type }, 'Failed to generate document');
      }
    }

    return generatedCount;
  }

  private async notifyStakeholders(
    executionInstanceId: string,
    request: ActivationRequest,
    deadline: Date
  ): Promise<number> {
    const stakeholders = await db.select().from(scenarioStakeholders)
      .where(eq(scenarioStakeholders.scenarioId, request.scenarioId));

    let notifiedCount = 0;

    for (const stakeholder of stakeholders) {
      try {
        // Create acknowledgment record
        await db.insert(stakeholderAcknowledgments).values({
          executionInstanceId,
          stakeholderId: stakeholder.id,
          userId: stakeholder.userId,
          notificationChannel: 'in_app',
        } as any);

        // Create notification
        if (stakeholder.userId) {
          await db.insert(notifications).values({
            organizationId: request.organizationId,
            userId: stakeholder.userId,
            type: 'playbook_activation',
            title: 'Strategic Playbook Activated',
            message: `Coordinated response initiated. Execute by ${deadline.toLocaleTimeString()}`,
            status: 'unread',
          } as any);
        }

        notifiedCount++;
      } catch (err) {
        logger.warn({ err, stakeholderId: stakeholder.id }, 'Failed to notify stakeholder');
      }
    }

    // Send Slack notification (non-blocking)
    notifyPlaybookActivation(request.playbookId, notifiedCount, deadline).catch(err => {
      logger.warn({ err }, 'Slack notification failed');
    });

    return notifiedCount;
  }

  private async unlockBudgets(
    executionInstanceId: string,
    request: ActivationRequest
  ): Promise<{ totalAmount: number; currency: string; categories: string[] } | null> {
    // Get playbook budget information
    const [playbook] = await db.select().from(playbookLibrary).where(eq(playbookLibrary.id, request.playbookId));
    
    if (!playbook?.preApprovedBudget) return null;

    const budgetAmount = Number(playbook.preApprovedBudget) || 0;
    if (budgetAmount === 0) return null;

    const budgets = [{
      category: 'general',
      amount: budgetAmount,
      currency: 'USD',
    }] as Array<{
      category: string;
      amount: number;
      currency?: string;
      approvedBy?: string;
    }>;

    if (!budgets || budgets.length === 0) return null;

    let totalAmount = 0;
    const categories: string[] = [];

    for (const budget of budgets) {
      try {
        await db.insert(budgetUnlocks).values({
          executionInstanceId,
          organizationId: request.organizationId,
          playbookId: request.playbookId,
          budgetCategory: budget.category,
          preApprovedAmount: String(budget.amount),
          currency: budget.currency || 'USD',
          approvedBy: budget.approvedBy,
          unlockedBy: request.triggeredBy,
          status: 'unlocked',
        } as any);

        totalAmount += budget.amount;
        categories.push(budget.category);
      } catch (err) {
        logger.warn({ err, category: budget.category }, 'Failed to unlock budget');
      }
    }

    return {
      totalAmount,
      currency: budgets[0]?.currency || 'USD',
      categories,
    };
  }

  private async recordEvent(
    executionInstanceId: string,
    organizationId: string,
    eventType: string,
    eventData: any,
    success: boolean,
    durationMs: number
  ): Promise<void> {
    try {
      await db.insert(activationEvents).values({
        executionInstanceId,
        organizationId,
        eventType: eventType as any,
        eventData,
        success,
        durationMs,
      } as any);
    } catch (err) {
      logger.warn({ err, eventType }, 'Failed to record activation event');
    }
  }

  private generateSimpleDocument(docType: string, vars: any): string {
    const templates: Record<string, string> = {
      briefing: `# Executive Briefing: ${vars.playbookName}\n\n**Activated:** ${vars.activationTime}\n**Deadline:** ${vars.deadline}\n\n## Situation\n${vars.playbookDescription || 'Strategic response activated.'}\n\n## Immediate Actions\n1. Review assigned tasks\n2. Acknowledge receipt\n3. Begin execution within 2 minutes\n\n## Success Criteria\n- Complete all Phase 1 tasks within 2 minutes\n- Full execution within 12 minutes\n`,
      communication: `# Stakeholder Communication\n\n**Subject:** Strategic Playbook Activated - ${vars.playbookName}\n\nA strategic playbook has been activated requiring immediate attention.\n\n**Action Required:** Please acknowledge receipt and review your assigned tasks.\n\n**Deadline:** ${vars.deadline}\n`,
      checklist: `# Execution Checklist: ${vars.playbookName}\n\n- [ ] Acknowledge notification\n- [ ] Review briefing document\n- [ ] Identify assigned tasks\n- [ ] Begin Phase 1 tasks\n- [ ] Report completion status\n`,
    };
    return templates[docType] || `# ${vars.playbookName}\n\nDocument generated at ${vars.activationTime}`;
  }

  async getActivationStatus(executionInstanceId: string): Promise<{
    instance: any;
    events: any[];
    stakeholderAcks: any[];
    documents: any[];
    projectSync: any | null;
    budgets: any[];
  } | null> {
    const [instance] = await db.select().from(executionInstances)
      .where(eq(executionInstances.id, executionInstanceId));

    if (!instance) return null;

    const [events, stakeholderAcks, documents, projectSyncs, budgets] = await Promise.all([
      db.select().from(activationEvents).where(eq(activationEvents.executionInstanceId, executionInstanceId)),
      db.select().from(stakeholderAcknowledgments).where(eq(stakeholderAcknowledgments.executionInstanceId, executionInstanceId)),
      db.select().from(generatedDocuments).where(eq(generatedDocuments.executionInstanceId, executionInstanceId)),
      db.select().from(externalProjectSyncs).where(eq(externalProjectSyncs.executionInstanceId, executionInstanceId)),
      db.select().from(budgetUnlocks).where(eq(budgetUnlocks.executionInstanceId, executionInstanceId)),
    ]);

    return {
      instance,
      events,
      stakeholderAcks,
      documents,
      projectSync: projectSyncs[0] || null,
      budgets,
    };
  }
}

export const executionOrchestrator = new ExecutionOrchestrator();
