import type { Express } from "express";
import { db } from "../db";
import { storage } from "../storage";
import {
  organizations,
  users,
  playbookLibrary,
  playbookActivations,
  tasks,
} from "@shared/schema";
import { eq, desc, and, sql, count, asc } from "drizzle-orm";
import { requireAuth, requireOrgAccess, getUserId, getOrgIdForUser } from "./helpers";

export async function registerDecisionCoordinationRoutes(app: Express): Promise<void> {
// DECISION VELOCITY API - Pre-staged decision trees for head coach speed
// ============================================================================

const { decisionTrees, activeDecisions, decisionLog, insertDecisionTreeSchema, insertDecisionLogSchema } = await import('@shared/schema');

// Get all decision trees for an organization
app.get('/api/decision-trees', requireOrgAccess, async (req: any, res) => {
  try {
    const organizationId = req.orgId;
    
    const trees = await db.select()
      .from(decisionTrees)
      .where(eq(decisionTrees.organizationId, organizationId))
      .orderBy(desc(decisionTrees.createdAt));
    
    res.json(trees);
  } catch (error) {
    console.error('Failed to fetch decision trees:', error);
    res.status(500).json({ error: 'Failed to fetch decision trees' });
  }
});

// Get a single decision tree
app.get('/api/decision-trees/:id', requireOrgAccess, async (req: any, res) => {
  try {
    const { id } = req.params;
    
    const [tree] = await db.select()
      .from(decisionTrees)
      .where(eq(decisionTrees.id, id));
    
    if (!tree) {
      return res.status(404).json({ error: 'Decision tree not found' });
    }
    
    res.json(tree);
  } catch (error) {
    console.error('Failed to fetch decision tree:', error);
    res.status(500).json({ error: 'Failed to fetch decision tree' });
  }
});

// Create a new decision tree
app.post('/api/decision-trees', requireOrgAccess, async (req: any, res) => {
  try {
    const data = req.body;
    
    const [newTree] = await db.insert(decisionTrees)
      .values({
        organizationId: req.orgId,
        name: data.name,
        scenario: data.scenario,
        domain: data.domain,
        category: data.category,
        decisionPoints: data.decisionPoints || [],
        isActive: true,
      })
      .returning();
    
    res.status(201).json(newTree);
  } catch (error) {
    console.error('Failed to create decision tree:', error);
    res.status(500).json({ error: 'Failed to create decision tree' });
  }
});

// Update a decision tree
app.patch('/api/decision-trees/:id', requireOrgAccess, async (req: any, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    const [updated] = await db.update(decisionTrees)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(decisionTrees.id, id))
      .returning();
    
    res.json(updated);
  } catch (error) {
    console.error('Failed to update decision tree:', error);
    res.status(500).json({ error: 'Failed to update decision tree' });
  }
});

// Get decision log for an organization
app.get('/api/decision-log', requireOrgAccess, async (req: any, res) => {
  try {
    const organizationId = req.orgId;
    
    const logs = await db.select()
      .from(decisionLog)
      .where(eq(decisionLog.organizationId, organizationId))
      .orderBy(desc(decisionLog.timestamp))
      .limit(50);
    
    res.json(logs);
  } catch (error) {
    console.error('Failed to fetch decision log:', error);
    res.status(500).json({ error: 'Failed to fetch decision log' });
  }
});

// Log a decision
app.post('/api/decision-log', requireOrgAccess, async (req: any, res) => {
  try {
    const data = req.body;
    
    const [newLog] = await db.insert(decisionLog)
      .values({
        organizationId: req.orgId,
        decisionTreeId: data.decisionTreeId,
        scenario: data.scenario,
        question: data.question,
        decisionMaker: data.decisionMaker,
        optionChosen: data.optionChosen,
        decisionTimeMinutes: data.decisionTimeMinutes,
        outcome: data.outcome,
        lessons: data.lessons,
      })
      .returning();
    
    res.status(201).json(newLog);
  } catch (error) {
    console.error('Failed to log decision:', error);
    res.status(500).json({ error: 'Failed to log decision' });
  }
});

// Get decision velocity metrics (aggregate stats)
app.get('/api/decision-velocity/metrics', requireOrgAccess, async (req: any, res) => {
  try {
    const organizationId = req.orgId;
    
    const logs = await db.select()
      .from(decisionLog)
      .where(eq(decisionLog.organizationId, organizationId));
    
    const totalDecisions = logs.length;
    const avgDecisionTime = totalDecisions > 0 
      ? logs.reduce((sum, d) => sum + (d.decisionTimeMinutes || 0), 0) / totalDecisions 
      : 0;
    
    // Count on-time decisions (under 20 minutes)
    const onTimeDecisions = logs.filter(d => (d.decisionTimeMinutes || 0) <= 20).length;
    const onTimeRate = totalDecisions > 0 ? (onTimeDecisions / totalDecisions) * 100 : 0;
    
    // Baseline comparison (72 hours = 4320 minutes)
    const baselineMinutes = 4320;
    const speedMultiplier = avgDecisionTime > 0 ? Math.round(baselineMinutes / avgDecisionTime) : 0;
    
    res.json({
      totalDecisions,
      avgDecisionTimeMinutes: Math.round(avgDecisionTime * 10) / 10,
      onTimeRate: Math.round(onTimeRate),
      speedMultiplier,
      baselineMinutes,
    });
  } catch (error) {
    console.error('Failed to get decision velocity metrics:', error);
    res.status(500).json({ error: 'Failed to get decision velocity metrics' });
  }
});

console.log('✅ Decision Velocity API endpoints registered');

// ============================================================================
// EXECUTION COORDINATION API - Coordinated response from decision to completion
// ============================================================================

const { 
  executionInstances, 
  executionInstanceTasks, 
  executionPlanTasks,
  executionPlanPhases,
  scenarioExecutionPlans,
  executionCheckpoints,
  checkpointValidations,
  documentTemplates,
  executionTaskDependencies
} = await import('@shared/schema');

// Get all execution instances for an organization
app.get('/api/execution-runs', requireOrgAccess, async (req: any, res) => {
  try {
    const organizationId = req.orgId;
    
    const runs = await db.select()
      .from(executionInstances)
      .where(eq(executionInstances.organizationId, organizationId))
      .orderBy(desc(executionInstances.createdAt))
      .limit(20);
    
    res.json(runs);
  } catch (error) {
    console.error('Failed to fetch execution runs:', error);
    res.status(500).json({ error: 'Failed to fetch execution runs' });
  }
});

// Get a single execution run with all tasks
app.get('/api/execution-runs/:id', requireOrgAccess, async (req: any, res) => {
  try {
    const { id } = req.params;
    
    const [run] = await db.select()
      .from(executionInstances)
      .where(eq(executionInstances.id, id));
    
    if (!run) {
      return res.status(404).json({ error: 'Execution run not found' });
    }
    
    // Get all tasks for this run
    const tasks = await db.select()
      .from(executionInstanceTasks)
      .where(eq(executionInstanceTasks.executionInstanceId, id));
    
    // Get checkpoint validations
    const checkpoints = await db.select()
      .from(checkpointValidations)
      .where(eq(checkpointValidations.executionInstanceId, id));
    
    res.json({
      ...run,
      tasks,
      checkpoints,
    });
  } catch (error) {
    console.error('Failed to fetch execution run:', error);
    res.status(500).json({ error: 'Failed to fetch execution run' });
  }
});

// Launch a new execution run from a plan
app.post('/api/execution-runs', requireOrgAccess, async (req: any, res) => {
  try {
    const { executionPlanId, scenarioId, organizationId, triggeredBy, triggerData } = req.body;
    
    // Create the execution instance
    const [newRun] = await db.insert(executionInstances)
      .values({
        executionPlanId,
        scenarioId,
        organizationId: req.orgId,
        triggeredBy: triggeredBy || req.userId,
        triggerData,
        status: 'running',
        startedAt: new Date(),
      })
      .returning();
    
    // Get all plan tasks
    const planTasks = await db.select()
      .from(executionPlanTasks)
      .where(eq(executionPlanTasks.executionPlanId, executionPlanId));
    
    // Create instance tasks for each plan task
    const instanceTasks = await Promise.all(planTasks.map(async (planTask) => {
      const [task] = await db.insert(executionInstanceTasks)
        .values({
          executionInstanceId: newRun.id,
          planTaskId: planTask.id,
          status: planTask.isParallel ? 'ready' : 'pending',
        })
        .returning();
      return task;
    }));
    
    res.status(201).json({
      ...newRun,
      tasks: instanceTasks,
    });
  } catch (error) {
    console.error('Failed to launch execution run:', error);
    res.status(500).json({ error: 'Failed to launch execution run' });
  }
});

// Update a task's status within an execution run
app.patch('/api/execution-runs/:runId/tasks/:taskId', requireOrgAccess, async (req: any, res) => {
  try {
    const { runId, taskId } = req.params;
    const { status, notes, outcome } = req.body;
    
    // Get the current task and its plan task
    const [currentTask] = await db.select()
      .from(executionInstanceTasks)
      .where(eq(executionInstanceTasks.id, taskId));
    
    if (!currentTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // If trying to start a task, check if dependencies are met
    if (status === 'in_progress' && currentTask.planTaskId) {
      const dependencies = await db.select()
        .from(executionTaskDependencies)
        .where(eq(executionTaskDependencies.taskId, currentTask.planTaskId));
      
      if (dependencies.length > 0) {
        // Get all instance tasks for this run
        const allInstanceTasks = await db.select()
          .from(executionInstanceTasks)
          .where(eq(executionInstanceTasks.executionInstanceId, runId));
        
        // Check if all dependency tasks are completed
        const dependencyPlanTaskIds = dependencies.map(d => d.dependsOnTaskId);
        const dependencyInstanceTasks = allInstanceTasks.filter(t => 
          dependencyPlanTaskIds.includes(t.planTaskId!)
        );
        
        const allDepsComplete = dependencyInstanceTasks.every(t => 
          t.status === 'completed' || t.status === 'skipped'
        );
        
        if (!allDepsComplete) {
          return res.status(400).json({ 
            error: 'Cannot start task - dependencies not complete',
            blockedBy: dependencyInstanceTasks.filter(t => t.status !== 'completed' && t.status !== 'skipped')
          });
        }
      }
    }
    
    const updateData: any = {
      status,
      updatedAt: new Date(),
    };
    
    if (status === 'in_progress') {
      updateData.startedAt = new Date();
    }
    if (status === 'completed') {
      updateData.completedAt = new Date();
      if (currentTask.startedAt) {
        updateData.actualMinutes = Math.round((new Date().getTime() - new Date(currentTask.startedAt).getTime()) / 60000);
      }
    }
    if (notes) updateData.notes = notes;
    if (outcome) updateData.outcome = outcome;
    
    const [updated] = await db.update(executionInstanceTasks)
      .set(updateData)
      .where(eq(executionInstanceTasks.id, taskId))
      .returning();
    
    // If task completed, auto-promote dependent tasks from 'pending' to 'ready'
    if (status === 'completed' && currentTask.planTaskId) {
      // Find tasks that depend on this one
      const dependentRelations = await db.select()
        .from(executionTaskDependencies)
        .where(eq(executionTaskDependencies.dependsOnTaskId, currentTask.planTaskId));
      
      if (dependentRelations.length > 0) {
        const allInstanceTasks = await db.select()
          .from(executionInstanceTasks)
          .where(eq(executionInstanceTasks.executionInstanceId, runId));
        
        for (const dep of dependentRelations) {
          const dependentInstanceTask = allInstanceTasks.find(t => t.planTaskId === dep.taskId);
          if (dependentInstanceTask && dependentInstanceTask.status === 'pending') {
            // Check if ALL dependencies of this task are now complete
            const allDepsForTask = await db.select()
              .from(executionTaskDependencies)
              .where(eq(executionTaskDependencies.taskId, dep.taskId));
            
            const allDepsComplete = allDepsForTask.every(d => {
              const depTask = allInstanceTasks.find(t => t.planTaskId === d.dependsOnTaskId);
              return depTask && (depTask.status === 'completed' || depTask.status === 'skipped');
            });
            
            if (allDepsComplete) {
              await db.update(executionInstanceTasks)
                .set({ status: 'ready', updatedAt: new Date() })
                .where(eq(executionInstanceTasks.id, dependentInstanceTask.id));
            }
          }
        }
      }
    }
    
    // Check if all tasks are complete to update run status
    const allTasks = await db.select()
      .from(executionInstanceTasks)
      .where(eq(executionInstanceTasks.executionInstanceId, runId));
    
    const allComplete = allTasks.every(t => t.status === 'completed' || t.status === 'skipped');
    if (allComplete) {
      const startTime = await db.select()
        .from(executionInstances)
        .where(eq(executionInstances.id, runId));
      
      const actualTime = startTime[0]?.startedAt 
        ? Math.round((new Date().getTime() - new Date(startTime[0].startedAt).getTime()) / 60000)
        : null;
      
      await db.update(executionInstances)
        .set({ 
          status: 'completed', 
          completedAt: new Date(),
          actualExecutionTime: actualTime,
          outcome: 'successful',
          updatedAt: new Date(),
        })
        .where(eq(executionInstances.id, runId));
    }
    
    res.json(updated);
  } catch (error) {
    console.error('Failed to update task status:', error);
    res.status(500).json({ error: 'Failed to update task status' });
  }
});

// DOOM-LOOP DETECTOR: Tasks stuck in pending/in_progress past threshold
// Inspired by: repeated-tool-call fingerprinting from AI agent research
app.get('/api/stuck-tasks', requireOrgAccess, async (req: any, res) => {
  try {
    const organizationId = req.session?.organizationId;
    const thresholdHours = parseInt(req.query.hours as string) || 4;
    const thresholdMs = thresholdHours * 60 * 60 * 1000;
    const cutoff = new Date(Date.now() - thresholdMs);

    // Find all active instances for this org
    const activeInstances = await db.select()
      .from(executionInstances)
      .where(and(
        eq(executionInstances.organizationId, organizationId),
        sql`${executionInstances.status} IN ('pending', 'running')`
      ));

    if (!activeInstances.length) return res.json([]);

    const instanceIds = activeInstances.map(i => i.id);

    // Find tasks stuck in pending or in_progress past the cutoff
    const stuckTasks = await db.select({
      id: executionInstanceTasks.id,
      executionInstanceId: executionInstanceTasks.executionInstanceId,
      planTaskId: executionInstanceTasks.planTaskId,
      status: executionInstanceTasks.status,
      blockedReason: executionInstanceTasks.blockedReason,
      assignedUserId: executionInstanceTasks.assignedUserId,
      createdAt: executionInstanceTasks.createdAt,
      updatedAt: executionInstanceTasks.updatedAt,
      taskTitle: executionPlanTasks.title,
      taskRole: executionPlanTasks.requiredRoleLabel,
      taskPriority: executionPlanTasks.priority,
      taskEstimatedMinutes: executionPlanTasks.estimatedMinutes,
    })
    .from(executionInstanceTasks)
    .leftJoin(executionPlanTasks, eq(executionInstanceTasks.planTaskId, executionPlanTasks.id))
    .where(and(
      sql`${executionInstanceTasks.executionInstanceId} = ANY(${sql`ARRAY[${sql.join(instanceIds.map(id => sql`${id}::uuid`), sql`, `)}]`})`,
      sql`${executionInstanceTasks.status} IN ('pending', 'in_progress')`,
      sql`${executionInstanceTasks.updatedAt} < ${cutoff}`
    ));

    // Annotate with hours stuck and severity
    const now = Date.now();
    const annotated = stuckTasks.map(t => {
      const hoursStuck = Math.floor((now - new Date(t.updatedAt!).getTime()) / 3600000);
      const severity = hoursStuck >= thresholdHours * 3 ? 'critical' : hoursStuck >= thresholdHours ? 'warning' : 'watch';
      return { ...t, hoursStuck, severity };
    }).sort((a, b) => b.hoursStuck - a.hoursStuck);

    res.json(annotated);
  } catch (error) {
    console.error('Failed to fetch stuck tasks:', error);
    res.status(500).json({ error: 'Failed to fetch stuck tasks' });
  }
});

// DOOM-LOOP RESOLVER: Mark a stuck task as escalated or re-assigned
app.patch('/api/stuck-tasks/:taskId/escalate', requireOrgAccess, async (req: any, res) => {
  try {
    const { taskId } = req.params;
    const { notes } = req.body;
    const [updated] = await db.update(executionInstanceTasks)
      .set({ 
        status: 'in_progress',
        notes: notes || 'Escalated via Stuck Task Detector',
        updatedAt: new Date()
      })
      .where(eq(executionInstanceTasks.id, taskId))
      .returning();
    res.json(updated);
  } catch (error) {
    console.error('Failed to escalate stuck task:', error);
    res.status(500).json({ error: 'Failed to escalate task' });
  }
});

// ROLE-SCOPED ACTION SURFACE: Tasks from a run filtered to the requesting user's role
app.get('/api/execution-runs/:runId/my-tasks', requireOrgAccess, async (req: any, res) => {
  try {
    const { runId } = req.params;
    const userRole: string = (req.user as any)?.role || (req.user as any)?.claims?.role || '';

    const allTasks = await db.select({
      id: executionInstanceTasks.id,
      executionInstanceId: executionInstanceTasks.executionInstanceId,
      status: executionInstanceTasks.status,
      blockedReason: executionInstanceTasks.blockedReason,
      notes: executionInstanceTasks.notes,
      outcome: executionInstanceTasks.outcome,
      startedAt: executionInstanceTasks.startedAt,
      completedAt: executionInstanceTasks.completedAt,
      updatedAt: executionInstanceTasks.updatedAt,
      taskTitle: executionPlanTasks.title,
      taskDescription: executionPlanTasks.description,
      taskRole: executionPlanTasks.requiredRoleLabel,
      taskPriority: executionPlanTasks.priority,
      taskEstimatedMinutes: executionPlanTasks.estimatedMinutes,
      isParallel: executionPlanTasks.isParallel,
      phaseId: executionPlanTasks.phaseId,
    })
    .from(executionInstanceTasks)
    .leftJoin(executionPlanTasks, eq(executionInstanceTasks.planTaskId, executionPlanTasks.id))
    .where(eq(executionInstanceTasks.executionInstanceId, runId));

    // Schema-gate: return only tasks whose ownerRole matches the user's role
    // If user has no role (admin/executive), return all tasks
    const isScopedRole = userRole && !['admin', 'executive'].includes(userRole.toLowerCase());
    const scopedTasks = isScopedRole
      ? allTasks.filter(t => t.taskRole && t.taskRole.toLowerCase().includes(userRole.toLowerCase()))
      : allTasks;

    // Annotate with ownership context
    const annotated = scopedTasks.map(t => ({
      ...t,
      isMyTask: !isScopedRole || (t.taskRole?.toLowerCase().includes(userRole.toLowerCase()) ?? false),
      isScopedView: isScopedRole,
      userRole,
    }));

    res.json(annotated);
  } catch (error) {
    console.error('Failed to fetch role-scoped tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks for role' });
  }
});

// JIT CONTEXT: Playbook objective + current phase context for re-injection at execution checkpoints
app.get('/api/execution-runs/:runId/context', requireOrgAccess, async (req: any, res) => {
  try {
    const { runId } = req.params;

    const [instance] = await db.select().from(executionInstances).where(eq(executionInstances.id, runId));
    if (!instance) return res.status(404).json({ error: 'Execution not found' });

    // Get all tasks to derive current phase and completion state
    const allTasks = await db.select({
      id: executionInstanceTasks.id,
      status: executionInstanceTasks.status,
      taskTitle: executionPlanTasks.title,
      taskRole: executionPlanTasks.requiredRoleLabel,
      taskPriority: executionPlanTasks.priority,
      taskEstimatedMinutes: executionPlanTasks.estimatedMinutes,
      phaseId: executionPlanTasks.phaseId,
    })
    .from(executionInstanceTasks)
    .leftJoin(executionPlanTasks, eq(executionInstanceTasks.planTaskId, executionPlanTasks.id))
    .where(eq(executionInstanceTasks.executionInstanceId, runId));

    const total = allTasks.length;
    const completed = allTasks.filter(t => t.status === 'completed' || t.status === 'skipped').length;
    const inProgress = allTasks.filter(t => t.status === 'in_progress').length;
    const blocked = allTasks.filter(t => t.status === 'blocked').length;
    const completionPct = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Derive current phase label from completion
    const phaseLabel = completionPct < 30 ? 'IMMEDIATE — Activate & Align'
      : completionPct < 65 ? 'SECONDARY — Execute & Coordinate'
      : completionPct < 90 ? 'FOLLOW-UP — Verify & Close'
      : 'COMPLETION — Outcome & Capture';

    const phaseGuidance = completionPct < 30
      ? 'Focus: get all key roles notified and initial tasks started. Speed is the priority — do not wait for perfect information.'
      : completionPct < 65
      ? 'Focus: coordinate parallel workstreams, remove blockers, keep stakeholders aligned. Watch for tasks that stop moving.'
      : completionPct < 90
      ? 'Focus: close open tasks, verify deliverables, confirm outcomes with task owners before marking complete.'
      : 'Focus: capture lessons, confirm target met status, seed institutional memory for future activations.';

    // Get plan details for strategic objective
    const [plan] = await db.select().from(scenarioExecutionPlans)
      .where(eq(scenarioExecutionPlans.id, instance.executionPlanId));

    const startedMs = instance.startedAt ? new Date(instance.startedAt).getTime() : Date.now();
    const elapsedMinutes = Math.floor((Date.now() - startedMs) / 60000);
    const targetMinutes = plan?.targetExecutionTime || 12;
    const minutesRemaining = Math.max(0, targetMinutes - elapsedMinutes);

    res.json({
      instanceId: instance.id,
      status: instance.status,
      objective: plan?.name || 'Strategic Execution',
      description: plan?.description,
      currentPhase: instance.currentPhase,
      phaseLabel,
      phaseGuidance,
      completionPct,
      total,
      completed,
      inProgress,
      blocked,
      elapsedMinutes,
      minutesRemaining,
      targetMinutes,
      startedAt: instance.startedAt,
      criticalConstraint: blocked > 0
        ? `${blocked} task${blocked > 1 ? 's' : ''} currently blocked — resolve before proceeding`
        : null,
    });
  } catch (error) {
    console.error('Failed to fetch execution context:', error);
    res.status(500).json({ error: 'Failed to fetch execution context' });
  }
});

// Get execution coordination metrics
app.get('/api/execution-coordination/metrics', requireOrgAccess, async (req: any, res) => {
  try {
    const organizationId = req.orgId;
    
    const runs = await db.select()
      .from(executionInstances)
      .where(eq(executionInstances.organizationId, organizationId));
    
    const completedRuns = runs.filter(r => r.status === 'completed');
    const avgExecutionTime = completedRuns.length > 0
      ? completedRuns.reduce((sum, r) => sum + (r.actualExecutionTime || 0), 0) / completedRuns.length
      : 0;
    
    // Get active runs
    const activeRuns = runs.filter(r => r.status === 'running');
    
    res.json({
      totalRuns: runs.length,
      activeRuns: activeRuns.length,
      completedRuns: completedRuns.length,
      avgExecutionTimeMinutes: Math.round(avgExecutionTime),
      successRate: completedRuns.length > 0 
        ? Math.round((completedRuns.filter(r => r.outcome === 'successful').length / completedRuns.length) * 100)
        : 0,
    });
  } catch (error) {
    console.error('Failed to get coordination metrics:', error);
    res.status(500).json({ error: 'Failed to get coordination metrics' });
  }
});

// Document Templates CRUD
app.get('/api/document-templates', requireOrgAccess, async (req: any, res) => {
  try {
    const organizationId = req.orgId;
    
    const templates = await db.select()
      .from(documentTemplates)
      .where(eq(documentTemplates.organizationId, organizationId));
    
    res.json(templates);
  } catch (error) {
    console.error('Failed to fetch templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

app.post('/api/document-templates', requireOrgAccess, async (req: any, res) => {
  try {
    const [template] = await db.insert(documentTemplates)
      .values({
        organizationId: req.orgId,
        name: req.body.name,
        category: req.body.category,
        domain: req.body.domain,
        templateContent: req.body.templateContent,
        mergeFields: req.body.mergeFields || [],
        createdBy: req.userId,
      })
      .returning();
    
    res.status(201).json(template);
  } catch (error) {
    console.error('Failed to create template:', error);
    res.status(500).json({ error: 'Failed to create template' });
  }
});

// Populate a template with scenario context
app.post('/api/document-templates/:id/populate', requireOrgAccess, async (req: any, res) => {
  try {
    const { id } = req.params;
    const { context } = req.body; // Key-value pairs for merge fields
    
    const [template] = await db.select()
      .from(documentTemplates)
      .where(eq(documentTemplates.id, id));
    
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    // Replace merge fields with context values
    let populatedContent = template.templateContent;
    for (const [key, value] of Object.entries(context || {})) {
      populatedContent = populatedContent.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), String(value));
    }
    
    res.json({
      templateId: id,
      templateName: template.name,
      populatedContent,
      populatedAt: new Date(),
    });
  } catch (error) {
    console.error('Failed to populate template:', error);
    res.status(500).json({ error: 'Failed to populate template' });
  }
});

console.log('✅ Execution Coordination API endpoints registered');

// ============================================================================
// STRATEGIC OBJECTIVES API - Organization-level strategic goals (Fisk Leadership Model)
// ============================================================================

const { strategicObjectives } = await import('@shared/schema');

// Get all strategic objectives for an organization
app.get('/api/strategic-objectives', requireOrgAccess, async (req: any, res) => {
  try {
    const organizationId = req.orgId;
    
    const objectives = await db.select()
      .from(strategicObjectives)
      .where(eq(strategicObjectives.organizationId, organizationId))
      .orderBy(asc(strategicObjectives.priority));
    
    res.json(objectives);
  } catch (error) {
    console.error('Failed to fetch strategic objectives:', error);
    res.status(500).json({ error: 'Failed to fetch strategic objectives' });
  }
});

// Get a single strategic objective
app.get('/api/strategic-objectives/:id', requireOrgAccess, async (req: any, res) => {
  try {
    const { id } = req.params;
    
    const [objective] = await db.select()
      .from(strategicObjectives)
      .where(eq(strategicObjectives.id, id));
    
    if (!objective) {
      return res.status(404).json({ error: 'Strategic objective not found' });
    }
    
    res.json(objective);
  } catch (error) {
    console.error('Failed to fetch strategic objective:', error);
    res.status(500).json({ error: 'Failed to fetch strategic objective' });
  }
});

// Create a new strategic objective
app.post('/api/strategic-objectives', requireOrgAccess, async (req: any, res) => {
  try {
    const [objective] = await db.insert(strategicObjectives)
      .values({
        organizationId: req.orgId,
        name: req.body.name,
        description: req.body.description,
        targetDate: req.body.targetDate,
        targetValue: req.body.targetValue,
        currentValue: req.body.currentValue || '0',
        valueUnit: req.body.valueUnit,
        leadershipCapability: req.body.leadershipCapability,
        priority: req.body.priority || 1,
        status: req.body.status || 'active',
        progress: req.body.progress || 0,
        createdBy: req.userId,
      })
      .returning();
    
    res.status(201).json(objective);
  } catch (error) {
    console.error('Failed to create strategic objective:', error);
    res.status(500).json({ error: 'Failed to create strategic objective' });
  }
});

// Update a strategic objective
app.patch('/api/strategic-objectives/:id', requireOrgAccess, async (req: any, res) => {
  try {
    const { id } = req.params;
    
    const [updated] = await db.update(strategicObjectives)
      .set({
        ...req.body,
        updatedAt: new Date(),
      })
      .where(eq(strategicObjectives.id, id))
      .returning();
    
    if (!updated) {
      return res.status(404).json({ error: 'Strategic objective not found' });
    }
    
    res.json(updated);
  } catch (error) {
    console.error('Failed to update strategic objective:', error);
    res.status(500).json({ error: 'Failed to update strategic objective' });
  }
});

// Delete a strategic objective
app.delete('/api/strategic-objectives/:id', requireOrgAccess, async (req: any, res) => {
  try {
    const { id } = req.params;
    
    const [deleted] = await db.delete(strategicObjectives)
      .where(eq(strategicObjectives.id, id))
      .returning();
    
    if (!deleted) {
      return res.status(404).json({ error: 'Strategic objective not found' });
    }
    
    res.json({ message: 'Strategic objective deleted', id });
  } catch (error) {
    console.error('Failed to delete strategic objective:', error);
    res.status(500).json({ error: 'Failed to delete strategic objective' });
  }
});

console.log('✅ Strategic Objectives API endpoints registered');
}
