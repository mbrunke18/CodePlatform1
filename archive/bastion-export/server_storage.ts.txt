import {
  users,
  organizations,
  strategicScenarios,
  tasks,
  roles,
  permissions,
  rolePermissions,
  activities,
  projects,
  pulseMetrics,
  fluxAdaptations,
  prismInsights,
  echoCulturalMetrics,
  novaInnovations,
  intelligenceReports,
  moduleUsageAnalytics,
  warRoomSessions,
  warRoomUpdates,
  executiveBriefings,
  boardReports,
  strategicAlerts,
  executiveInsights,
  actionHooks,
  dataSources,
  executiveTriggers,
  triggerMonitoringHistory,
  playbookTriggerAssociations,
  whatIfScenarios,
  type User,
  type UpsertUser,
  type Organization,
  type InsertOrganization,
  type StrategicScenario,
  type InsertStrategicScenario,
  type Task,
  type InsertTask,
  type Role,
  type Permission,
  type Activity,
  type InsertActivity,
  type Project,
  type InsertProject,
  type PulseMetric,
  type InsertPulseMetric,
  type FluxAdaptation,
  type InsertFluxAdaptation,
  type PrismInsight,
  type InsertPrismInsight,
  type EchoCulturalMetric,
  type InsertEchoCulturalMetric,
  type NovaInnovation,
  type InsertNovaInnovation,
  type IntelligenceReport,
  type InsertIntelligenceReport,
  type ModuleUsageAnalytic,
  type InsertModuleUsageAnalytic,
  type WarRoomSession,
  type InsertWarRoomSession,
  type WarRoomUpdate,
  type InsertWarRoomUpdate,
  type ExecutiveBriefing,
  type InsertExecutiveBriefing,
  type BoardReport,
  type InsertBoardReport,
  type StrategicAlert,
  type InsertStrategicAlert,
  type ExecutiveInsight,
  type InsertExecutiveInsight,
  type ActionHook,
  type InsertActionHook,
  type DecisionOutcome,
  type InsertDecisionOutcome,
  type DataSource,
  type InsertDataSource,
  type ExecutiveTrigger,
  type InsertExecutiveTrigger,
  type TriggerMonitoringHistory,
  type InsertTriggerMonitoringHistory,
  type PlaybookTriggerAssociation,
  type InsertPlaybookTriggerAssociation,
  type WhatIfScenario,
  type InsertWhatIfScenario,
} from "@shared/schema";
import { PulseAI } from "./ai/pulseAI";
import { FluxAI } from "./ai/fluxAI"; 
import { PrismAI } from "./ai/prismAI";
import { EchoAI } from "./ai/echoAI";
import { NovaAI } from "./ai/novaAI";
import { 
  COMPREHENSIVE_SCENARIO_TEMPLATES, 
  getTemplateById, 
  getTemplatesByCategory, 
  getCrisisTemplates,
  type ComprehensiveScenarioTemplate 
} from "@shared/comprehensive-scenario-templates";
import { db } from "./db";
import { eq, desc, and, sql, inArray } from "drizzle-orm";
import { decisionOutcomes } from "@shared/schema";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Organization operations
  createOrganization(org: InsertOrganization): Promise<Organization>;
  getUserOrganizations(userId: string): Promise<Organization[]>;
  
  // Scenario operations
  createScenario(scenario: InsertStrategicScenario): Promise<StrategicScenario>;
  getScenariosByOrganization(orgId: string): Promise<StrategicScenario[]>;
  getRecentScenarios(userId: string): Promise<(StrategicScenario & { creatorName: string; taskCount: number })[]>;
  
  // Task operations
  createTask(task: InsertTask): Promise<Task>;
  getTasksByScenario(scenarioId: string): Promise<Task[]>;
  getTasksByOrganization(organizationId: string): Promise<Task[]>;
  getRecentTasks(userId: string): Promise<Task[]>;
  getPriorityTasks(userId: string): Promise<Task[]>;
  updateTaskStatus(taskId: string, completed: boolean): Promise<Task>;
  
  // Role and permission operations
  getUserRole(userId: string): Promise<Role | undefined>;
  getUserPermissions(userId: string): Promise<Permission[]>;
  hasPermission(userId: string, action: string): Promise<boolean>;
  
  // Activity operations
  createActivity(activity: InsertActivity): Promise<Activity>;
  getRecentActivities(userId: string): Promise<(Activity & { userName: string })[]>;
  
  // Analytics
  getUserMetrics(userId: string): Promise<{
    activeScenarios: number;
    pendingTasks: number;
    teamMembers: number;
    agilityScore: number;
  }>;
  
  // Project operations
  createProject(project: InsertProject): Promise<Project>;
  getProjects(organizationId?: string): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  updateProject(id: string, updates: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: string): Promise<void>;
  
  // Pulse Metrics operations
  createPulseMetric(metric: InsertPulseMetric): Promise<PulseMetric>;
  getPulseMetrics(organizationId: string): Promise<PulseMetric[]>;
  getLatestPulseMetrics(organizationId: string): Promise<PulseMetric[]>;
  
  // Flux Adaptations operations
  createFluxAdaptation(adaptation: InsertFluxAdaptation): Promise<FluxAdaptation>;
  getFluxAdaptations(organizationId: string, scenarioId?: string): Promise<FluxAdaptation[]>;
  
  // Prism Insights operations
  createPrismInsight(insight: InsertPrismInsight): Promise<PrismInsight>;
  getPrismInsights(organizationId: string): Promise<PrismInsight[]>;
  getLatestPrismInsights(organizationId: string): Promise<PrismInsight[]>;
  
  // Echo Cultural Metrics operations
  createEchoCulturalMetric(metric: InsertEchoCulturalMetric): Promise<EchoCulturalMetric>;
  getEchoCulturalMetrics(organizationId: string): Promise<EchoCulturalMetric[]>;
  getLatestCulturalAssessment(organizationId: string): Promise<EchoCulturalMetric[]>;
  
  // Nova Innovations operations
  createNovaInnovation(innovation: InsertNovaInnovation): Promise<NovaInnovation>;
  getNovaInnovations(organizationId: string): Promise<NovaInnovation[]>;
  
  // Intelligence Reports operations
  createIntelligenceReport(report: InsertIntelligenceReport): Promise<IntelligenceReport>;
  getIntelligenceReports(organizationId: string): Promise<IntelligenceReport[]>;
  getLatestIntelligenceReport(organizationId: string): Promise<IntelligenceReport | undefined>;
  
  // Module Usage Analytics operations
  trackModuleUsage(analytics: InsertModuleUsageAnalytic): Promise<ModuleUsageAnalytic>;
  getModuleUsageAnalytics(organizationId: string): Promise<ModuleUsageAnalytic[]>;
  getUserModuleUsage(userId: string): Promise<ModuleUsageAnalytic[]>;
  
  // Comprehensive Scenario Template operations
  getScenarioTemplates(): Promise<any[]>;
  getScenarioTemplateById(id: string): Promise<any>;
  getScenarioTemplatesByCategory(category: string): Promise<any[]>;
  getCrisisResponseTemplates(): Promise<any[]>;
  createScenarioFromTemplate(templateId: string, customData: any, userId: string): Promise<StrategicScenario>;
  
  // === STRATEGIC ENHANCEMENT OPERATIONS ===
  
  // Executive War Room operations
  createWarRoomSession(session: InsertWarRoomSession): Promise<WarRoomSession>;
  getWarRoomSessions(organizationId?: string, status?: string): Promise<WarRoomSession[]>;
  getWarRoomSessionById(sessionId: string): Promise<WarRoomSession | undefined>;
  createWarRoomUpdate(update: InsertWarRoomUpdate): Promise<WarRoomUpdate>;
  getWarRoomUpdates(sessionId: string): Promise<WarRoomUpdate[]>;
  
  // Zero-Click Intelligence operations
  createExecutiveBriefing(briefing: InsertExecutiveBriefing): Promise<ExecutiveBriefing>;
  getExecutiveBriefings(organizationId?: string, executiveId?: string, briefingType?: string): Promise<ExecutiveBriefing[]>;
  acknowledgeExecutiveBriefing(briefingId: string): Promise<ExecutiveBriefing>;
  
  // Board-Ready Reporting operations
  createBoardReport(report: InsertBoardReport): Promise<BoardReport>;
  getBoardReports(organizationId?: string, reportType?: string): Promise<BoardReport[]>;
  approveBoardReport(reportId: string, approvedBy: string): Promise<BoardReport>;
  
  // Strategic Alerts operations
  createStrategicAlert(alert: InsertStrategicAlert): Promise<StrategicAlert>;
  getStrategicAlerts(organizationId?: string, status?: string, alertType?: string): Promise<StrategicAlert[]>;
  acknowledgeStrategicAlert(alertId: string, acknowledgedBy: string): Promise<StrategicAlert>;
  
  // Executive Insights operations
  createExecutiveInsight(insight: InsertExecutiveInsight): Promise<ExecutiveInsight>;
  getExecutiveInsights(organizationId?: string, insightType?: string, boardReady?: string): Promise<ExecutiveInsight[]>;
  
  // Action Hooks operations
  createActionHook(hook: InsertActionHook): Promise<ActionHook>;
  getActionHooks(organizationId?: string, isActive?: string): Promise<ActionHook[]>;
  triggerActionHook(hookId: string, eventData: any): Promise<any>;
  
  // === EXECUTIVE TRIGGER MANAGEMENT OPERATIONS ===
  
  // Data Sources operations
  createDataSource(source: InsertDataSource): Promise<DataSource>;
  getDataSources(organizationId?: string, sourceType?: string): Promise<DataSource[]>;
  getDataSourceById(sourceId: string): Promise<DataSource | undefined>;
  updateDataSource(sourceId: string, updates: Partial<InsertDataSource>): Promise<DataSource>;
  
  // Executive Triggers operations
  createExecutiveTrigger(trigger: InsertExecutiveTrigger): Promise<ExecutiveTrigger>;
  getExecutiveTriggers(organizationId?: string, category?: string, status?: string): Promise<ExecutiveTrigger[]>;
  getExecutiveTriggerById(triggerId: string): Promise<ExecutiveTrigger | undefined>;
  updateExecutiveTrigger(triggerId: string, updates: Partial<InsertExecutiveTrigger>): Promise<ExecutiveTrigger>;
  updateTriggerStatus(triggerId: string, status: 'green' | 'yellow' | 'red', currentValue?: string): Promise<ExecutiveTrigger>;
  
  // Trigger Monitoring History operations
  createTriggerMonitoringHistory(history: InsertTriggerMonitoringHistory): Promise<TriggerMonitoringHistory>;
  getTriggerMonitoringHistory(triggerId: string): Promise<TriggerMonitoringHistory[]>;
  
  // Playbook-Trigger Association operations
  createPlaybookTriggerAssociation(association: InsertPlaybookTriggerAssociation): Promise<PlaybookTriggerAssociation>;
  getPlaybookTriggerAssociations(triggerId?: string, playbookId?: string): Promise<PlaybookTriggerAssociation[]>;
  
  // What-If Scenario Analysis operations
  createWhatIfScenario(scenario: InsertWhatIfScenario): Promise<WhatIfScenario>;
  getWhatIfScenarios(organizationId?: string): Promise<WhatIfScenario[]>;
  getWhatIfScenarioById(scenarioId: string): Promise<WhatIfScenario | undefined>;
  updateWhatIfScenario(scenarioId: string, updates: Partial<InsertWhatIfScenario>): Promise<WhatIfScenario>;
  deleteWhatIfScenario(scenarioId: string): Promise<void>;
  
  // Decision Outcomes operations for UAT
  getDecisionOutcomes(): Promise<DecisionOutcome[]>;
  createDecisionOutcome(outcome: InsertDecisionOutcome): Promise<DecisionOutcome>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async createOrganization(org: InsertOrganization): Promise<Organization> {
    const [organization] = await db.insert(organizations).values(org).returning();
    return organization;
  }

  async getUserOrganizations(userId: string): Promise<Organization[]> {
    return await db.select({
      id: organizations.id,
      name: organizations.name,
      description: organizations.description,
      ownerId: organizations.ownerId,
      domain: organizations.domain,
      type: organizations.type,
      size: organizations.size,
      industry: organizations.industry,
      headquarters: organizations.headquarters,
      adaptabilityScore: organizations.adaptabilityScore,
      onboardingCompleted: organizations.onboardingCompleted,
      subscriptionTier: organizations.subscriptionTier,
      status: organizations.status,
      settings: organizations.settings,
      taxonomy: organizations.taxonomy,
      dataRetentionPolicy: organizations.dataRetentionPolicy,
      createdAt: organizations.createdAt,
      updatedAt: organizations.updatedAt,
    }).from(organizations).where(eq(organizations.ownerId, userId));
  }

  async createScenario(scenario: InsertStrategicScenario): Promise<StrategicScenario> {
    const [newScenario] = await db.insert(strategicScenarios).values(scenario).returning();
    return newScenario;
  }

  async getScenariosByOrganization(orgId: string): Promise<StrategicScenario[]> {
    return await db.select().from(strategicScenarios).where(eq(strategicScenarios.organizationId, orgId));
  }

  async importTemplate(templateId: string, organizationId: string, userId: string): Promise<StrategicScenario> {
    // Get the template
    const [template] = await db.select().from(strategicScenarios).where(eq(strategicScenarios.id, templateId));
    
    if (!template || !template.isTemplate) {
      throw new Error('Template not found or not a valid template');
    }

    // Create a copy for the organization
    const [importedScenario] = await db.insert(strategicScenarios).values({
      name: template.name,
      title: template.title,
      description: template.description,
      type: template.type,
      industry: template.industry,
      likelihood: template.likelihood,
      impact: template.impact,
      triggerConditions: template.triggerConditions,
      responseStrategy: template.responseStrategy,
      automationCoverage: template.automationCoverage,
      readinessState: 'yellow', // Imported templates need review
      organizationId: organizationId,
      createdBy: userId,
      status: 'draft', // Start as draft
      isTemplate: false, // Imported copy is not a template
      templateCategory: null,
      approvalStatus: 'pending_review',
      executionCount: 0,
      averageExecutionTime: null,
      lastDrillDate: null,
      approvedBy: null,
      approvedAt: null,
      lastTriggered: null,
      updatedAt: null,
    }).returning();

    return importedScenario;
  }

  async getRecentScenarios(userId: string): Promise<(StrategicScenario & { creatorName: string; taskCount: number })[]> {
    const scenarios = await db
      .select({
        id: strategicScenarios.id,
        name: strategicScenarios.name,
        title: strategicScenarios.title,
        description: strategicScenarios.description,
        type: strategicScenarios.type,
        industry: strategicScenarios.industry,
        isTemplate: strategicScenarios.isTemplate,
        templateCategory: strategicScenarios.templateCategory,
        likelihood: strategicScenarios.likelihood,
        impact: strategicScenarios.impact,
        triggerConditions: strategicScenarios.triggerConditions,
        responseStrategy: strategicScenarios.responseStrategy,
        status: strategicScenarios.status,
        lastTriggered: strategicScenarios.lastTriggered,
        lastDrillDate: strategicScenarios.lastDrillDate,
        approvalStatus: strategicScenarios.approvalStatus,
        approvedBy: strategicScenarios.approvedBy,
        approvedAt: strategicScenarios.approvedAt,
        automationCoverage: strategicScenarios.automationCoverage,
        readinessState: strategicScenarios.readinessState,
        averageExecutionTime: strategicScenarios.averageExecutionTime,
        executionCount: strategicScenarios.executionCount,
        createdBy: strategicScenarios.createdBy,
        organizationId: strategicScenarios.organizationId,
        createdAt: strategicScenarios.createdAt,
        updatedAt: strategicScenarios.updatedAt,
        creatorName: users.firstName,
      })
      .from(strategicScenarios)
      .leftJoin(users, eq(strategicScenarios.createdBy, users.id))
      .orderBy(desc(strategicScenarios.createdAt))
      .limit(10);

    const scenariosWithTaskCount = await Promise.all(
      scenarios.map(async (scenario) => {
        const [{ count }] = await db
          .select({ count: sql`count(*)` })
          .from(tasks)
          .where(eq(tasks.scenarioId, scenario.id));
        
        return {
          ...scenario,
          creatorName: scenario.creatorName || 'Unknown',
          taskCount: Number(count),
        };
      })
    );

    return scenariosWithTaskCount;
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [newTask] = await db.insert(tasks).values(task).returning();
    return newTask;
  }

  async getTasksByScenario(scenarioId: string): Promise<Task[]> {
    return await db.select().from(tasks).where(eq(tasks.scenarioId, scenarioId));
  }

  async getPriorityTasks(userId: string): Promise<Task[]> {
    const tasksWithScenarios = await db
      .select({
        id: tasks.id,
        scenarioId: tasks.scenarioId,
        description: tasks.description,
        priority: tasks.priority,
        status: tasks.status,
        assignedTo: tasks.assignedTo,
        estimatedHours: tasks.estimatedHours,
        actualHours: tasks.actualHours,
        completed: tasks.completed,
        dueDate: tasks.dueDate,
        createdAt: tasks.createdAt,
        updatedAt: tasks.updatedAt,
      })
      .from(tasks)
      .leftJoin(strategicScenarios, eq(tasks.scenarioId, strategicScenarios.id))
      .where(eq(strategicScenarios.createdBy, userId))
      .orderBy(desc(tasks.createdAt))
      .limit(10);

    return tasksWithScenarios;
  }

  async updateTaskStatus(taskId: string, completed: boolean): Promise<Task> {
    const [updatedTask] = await db
      .update(tasks)
      .set({ 
        status: completed ? 'Completed' : 'To Do',
        completed: completed ? new Date() : null,
      })
      .where(eq(tasks.id, taskId))
      .returning();
    return updatedTask;
  }

  async getTasksByOrganization(organizationId: string): Promise<Task[]> {
    return await db
      .select({
        id: tasks.id,
        scenarioId: tasks.scenarioId,
        description: tasks.description,
        priority: tasks.priority,
        status: tasks.status,
        assignedTo: tasks.assignedTo,
        estimatedHours: tasks.estimatedHours,
        actualHours: tasks.actualHours,
        completed: tasks.completed,
        dueDate: tasks.dueDate,
        createdAt: tasks.createdAt,
        updatedAt: tasks.updatedAt,
      })
      .from(tasks)
      .leftJoin(strategicScenarios, eq(tasks.scenarioId, strategicScenarios.id))
      .where(eq(strategicScenarios.organizationId, organizationId))
      .orderBy(desc(tasks.createdAt));
  }

  async getRecentTasks(userId: string): Promise<Task[]> {
    return await db
      .select({
        id: tasks.id,
        scenarioId: tasks.scenarioId,
        description: tasks.description,
        priority: tasks.priority,
        status: tasks.status,
        assignedTo: tasks.assignedTo,
        estimatedHours: tasks.estimatedHours,
        actualHours: tasks.actualHours,
        completed: tasks.completed,
        dueDate: tasks.dueDate,
        createdAt: tasks.createdAt,
        updatedAt: tasks.updatedAt,
      })
      .from(tasks)
      .leftJoin(strategicScenarios, eq(tasks.scenarioId, strategicScenarios.id))
      .where(eq(strategicScenarios.createdBy, userId))
      .orderBy(desc(tasks.createdAt))
      .limit(20);
  }

  async getUserRole(userId: string): Promise<Role | undefined> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      with: { role: true },
    });
    return user?.role || undefined;
  }

  async getUserPermissions(userId: string): Promise<Permission[]> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      with: {
        role: {
          with: {
            rolePermissions: {
              with: {
                permission: true,
              },
            },
          },
        },
      },
    });

    return user?.role?.rolePermissions.map(rp => rp.permission) || [];
  }

  async hasPermission(userId: string, action: string): Promise<boolean> {
    const userPermissions = await this.getUserPermissions(userId);
    return userPermissions.some(p => p.action === action);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db.insert(activities).values(activity).returning();
    return newActivity;
  }

  async getRecentActivities(userId: string): Promise<(Activity & { userName: string })[]> {
    const recentActivities = await db
      .select({
        id: activities.id,
        userId: activities.userId,
        action: activities.action,
        entityType: activities.entityType,
        entityId: activities.entityId,
        createdAt: activities.createdAt,
        userName: users.firstName,
      })
      .from(activities)
      .leftJoin(users, eq(activities.userId, users.id))
      .orderBy(desc(activities.createdAt))
      .limit(20);

    return recentActivities.map(activity => ({
      ...activity,
      userName: activity.userName || 'Unknown User',
    }));
  }

  async getUserMetrics(userId: string): Promise<{
    activeScenarios: number;
    pendingTasks: number;
    teamMembers: number;
    agilityScore: number;
  }> {
    // Get user's organizations
    const userOrgs = await this.getUserOrganizations(userId);
    const orgIds = userOrgs.map(org => org.id);

    // Count active scenarios
    const [{ activeScenarios }] = await db
      .select({ activeScenarios: sql`count(*)` })
      .from(strategicScenarios)
      .where(and(
        eq(strategicScenarios.status, 'active'),
        inArray(strategicScenarios.organizationId, orgIds)
      ));

    // Count pending tasks
    const [{ pendingTasks }] = await db
      .select({ pendingTasks: sql`count(*)` })
      .from(tasks)
      .where(eq(tasks.status, 'To Do'));

    // Count team members (simplified)
    const [{ teamMembers }] = await db
      .select({ teamMembers: sql`count(*)` })
      .from(users);

    // Calculate agility score (simplified algorithm)
    const agilityScore = Math.min(10, Math.max(1, 
      (Number(activeScenarios) * 0.3 + 
       (50 - Number(pendingTasks)) * 0.1 + 
       Number(teamMembers) * 0.2 + 5)
    ));

    return {
      activeScenarios: Number(activeScenarios),
      pendingTasks: Number(pendingTasks),
      teamMembers: Number(teamMembers),
      agilityScore: Number(agilityScore.toFixed(1)),
    };
  }

  // Project operations
  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async getProjects(organizationId?: string): Promise<Project[]> {
    if (organizationId) {
      return await db.select().from(projects).where(eq(projects.organizationId, organizationId));
    }
    return await db.select().from(projects);
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async updateProject(id: string, updates: Partial<InsertProject>): Promise<Project> {
    const [updatedProject] = await db
      .update(projects)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updatedProject;
  }

  async deleteProject(id: string): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // Pulse Metrics operations - NOW WITH AI INTELLIGENCE
  async createPulseMetric(metric: InsertPulseMetric): Promise<PulseMetric> {
    const [newMetric] = await db.insert(pulseMetrics).values(metric).returning();
    return newMetric;
  }

  async generatePulseMetricsWithAI(organizationId: string): Promise<PulseMetric[]> {
    // USE THE ACTUAL PULSE AI ALGORITHMS
    const aiGeneratedMetrics = await PulseAI.generateOrganizationalMetrics(organizationId);
    const createdMetrics = [];
    
    for (const metric of aiGeneratedMetrics) {
      const [newMetric] = await db.insert(pulseMetrics).values(metric).returning();
      createdMetrics.push(newMetric);
    }
    
    return createdMetrics;
  }

  async getPulseAnalysisWithAI(organizationId: string): Promise<any> {
    const metrics = await this.getLatestPulseMetrics(organizationId);
    // USE THE ACTUAL PULSE AI ANALYSIS
    return PulseAI.analyzePulseMetrics(metrics);
  }

  async getPulseMetrics(organizationId: string): Promise<PulseMetric[]> {
    return await db
      .select()
      .from(pulseMetrics)
      .where(eq(pulseMetrics.organizationId, organizationId))
      .orderBy(desc(pulseMetrics.timestamp));
  }

  async getLatestPulseMetrics(organizationId: string): Promise<PulseMetric[]> {
    return await db
      .select()
      .from(pulseMetrics)
      .where(eq(pulseMetrics.organizationId, organizationId))
      .orderBy(desc(pulseMetrics.timestamp))
      .limit(10);
  }

  // Flux Adaptations operations - NOW WITH AI INTELLIGENCE
  async createFluxAdaptation(adaptation: InsertFluxAdaptation): Promise<FluxAdaptation> {
    const [newAdaptation] = await db.insert(fluxAdaptations).values(adaptation).returning();
    return newAdaptation;
  }

  async generateFluxStrategiesWithAI(scenarioId: string): Promise<FluxAdaptation[]> {
    // GET THE SCENARIO
    const [scenario] = await db.select().from(strategicScenarios).where(eq(strategicScenarios.id, scenarioId));
    if (!scenario) throw new Error('Scenario not found');
    
    // USE THE ACTUAL FLUX AI ALGORITHMS
    const aiStrategies = FluxAI.generateAdaptationStrategies(scenario);
    const createdAdaptations = [];
    
    for (const strategy of aiStrategies) {
      const adaptationData = await FluxAI.createFluxAdaptation(scenario.organizationId, scenarioId, strategy);
      const [newAdaptation] = await db.insert(fluxAdaptations).values(adaptationData).returning();
      createdAdaptations.push(newAdaptation);
    }
    
    return createdAdaptations;
  }

  async getFluxAdaptations(organizationId: string, scenarioId?: string): Promise<FluxAdaptation[]> {
    if (scenarioId) {
      return await db
        .select()
        .from(fluxAdaptations)
        .where(and(eq(fluxAdaptations.organizationId, organizationId), eq(fluxAdaptations.scenarioId, scenarioId)))
        .orderBy(desc(fluxAdaptations.createdAt));
    }
    
    return await db
      .select()
      .from(fluxAdaptations)
      .where(eq(fluxAdaptations.organizationId, organizationId))
      .orderBy(desc(fluxAdaptations.createdAt));
  }

  // Prism Insights operations - NOW WITH AI INTELLIGENCE
  async createPrismInsight(insight: InsertPrismInsight): Promise<PrismInsight> {
    const [newInsight] = await db.insert(prismInsights).values(insight).returning();
    return newInsight;
  }

  async generatePrismInsightsWithAI(organizationId: string): Promise<PrismInsight[]> {
    // USE THE ACTUAL PRISM AI ALGORITHMS
    const aiInsights = await PrismAI.generateStrategicInsights(organizationId);
    const createdInsights = [];
    
    for (const insight of aiInsights) {
      const [newInsight] = await db.insert(prismInsights).values(insight).returning();
      createdInsights.push(newInsight);
    }
    
    return createdInsights;
  }

  async getPredictiveAnalysisWithAI(): Promise<any> {
    // USE THE ACTUAL PRISM AI PREDICTIVE ANALYSIS
    return PrismAI.generatePredictiveAnalysis();
  }

  async getPrismInsights(organizationId: string): Promise<PrismInsight[]> {
    return await db
      .select()
      .from(prismInsights)
      .where(eq(prismInsights.organizationId, organizationId))
      .orderBy(desc(prismInsights.createdAt));
  }

  async getLatestPrismInsights(organizationId: string): Promise<PrismInsight[]> {
    return await db
      .select()
      .from(prismInsights)
      .where(eq(prismInsights.organizationId, organizationId))
      .orderBy(desc(prismInsights.createdAt))
      .limit(5);
  }

  // Echo Cultural Metrics operations - NOW WITH AI INTELLIGENCE
  async createEchoCulturalMetric(metric: InsertEchoCulturalMetric): Promise<EchoCulturalMetric> {
    const [newMetric] = await db.insert(echoCulturalMetrics).values(metric).returning();
    return newMetric;
  }

  async generateEchoMetricsWithAI(organizationId: string): Promise<EchoCulturalMetric[]> {
    // USE THE ACTUAL ECHO AI ALGORITHMS
    const aiMetrics = await EchoAI.generateCulturalMetrics(organizationId);
    const createdMetrics = [];
    
    for (const metric of aiMetrics) {
      const [newMetric] = await db.insert(echoCulturalMetrics).values(metric).returning();
      createdMetrics.push(newMetric);
    }
    
    return createdMetrics;
  }

  async getCulturalAnalysisWithAI(organizationId: string): Promise<any> {
    const metrics = await this.getLatestCulturalAssessment(organizationId);
    // USE THE ACTUAL ECHO AI CULTURAL ANALYSIS
    return EchoAI.analyzeCulturalHealth(metrics);
  }

  async getEchoCulturalMetrics(organizationId: string): Promise<EchoCulturalMetric[]> {
    return await db
      .select()
      .from(echoCulturalMetrics)
      .where(eq(echoCulturalMetrics.organizationId, organizationId))
      .orderBy(desc(echoCulturalMetrics.assessmentDate));
  }

  async getLatestCulturalAssessment(organizationId: string): Promise<EchoCulturalMetric[]> {
    return await db
      .select()
      .from(echoCulturalMetrics)
      .where(eq(echoCulturalMetrics.organizationId, organizationId))
      .orderBy(desc(echoCulturalMetrics.assessmentDate))
      .limit(6); // Common cultural dimensions
  }

  // Nova Innovations operations - NOW WITH AI INTELLIGENCE
  async createNovaInnovation(innovation: InsertNovaInnovation): Promise<NovaInnovation> {
    const [newInnovation] = await db.insert(novaInnovations).values(innovation).returning();
    return newInnovation;
  }

  async generateNovaOpportunitiesWithAI(organizationId: string): Promise<NovaInnovation[]> {
    // USE THE ACTUAL NOVA AI ALGORITHMS
    const aiOpportunities = await NovaAI.generateInnovationOpportunities(organizationId);
    const createdInnovations = [];
    
    for (const opportunity of aiOpportunities) {
      const [newInnovation] = await db.insert(novaInnovations).values(opportunity).returning();
      createdInnovations.push(newInnovation);
    }
    
    return createdInnovations;
  }

  async getInnovationAnalysisWithAI(organizationId: string): Promise<any> {
    const innovations = await this.getNovaInnovations(organizationId);
    // USE THE ACTUAL NOVA AI ANALYSIS
    return NovaAI.analyzeInnovationPortfolio(innovations);
  }

  async getNovaInnovations(organizationId: string): Promise<NovaInnovation[]> {
    return await db
      .select()
      .from(novaInnovations)
      .where(eq(novaInnovations.organizationId, organizationId))
      .orderBy(desc(novaInnovations.createdAt));
  }

  // Intelligence Reports operations
  async createIntelligenceReport(report: InsertIntelligenceReport): Promise<IntelligenceReport> {
    const [newReport] = await db.insert(intelligenceReports).values(report).returning();
    return newReport;
  }

  async getIntelligenceReports(organizationId: string): Promise<IntelligenceReport[]> {
    return await db
      .select()
      .from(intelligenceReports)
      .where(eq(intelligenceReports.organizationId, organizationId))
      .orderBy(desc(intelligenceReports.generatedAt));
  }

  async getLatestIntelligenceReport(organizationId: string): Promise<IntelligenceReport | undefined> {
    const [report] = await db
      .select()
      .from(intelligenceReports)
      .where(eq(intelligenceReports.organizationId, organizationId))
      .orderBy(desc(intelligenceReports.generatedAt))
      .limit(1);
    return report;
  }

  // Module Usage Analytics operations
  async trackModuleUsage(analytics: InsertModuleUsageAnalytic): Promise<ModuleUsageAnalytic> {
    const [newAnalytic] = await db.insert(moduleUsageAnalytics).values(analytics).returning();
    return newAnalytic;
  }

  async getModuleUsageAnalytics(organizationId: string): Promise<ModuleUsageAnalytic[]> {
    return await db
      .select()
      .from(moduleUsageAnalytics)
      .where(eq(moduleUsageAnalytics.organizationId, organizationId))
      .orderBy(desc(moduleUsageAnalytics.timestamp));
  }

  async getUserModuleUsage(userId: string): Promise<ModuleUsageAnalytic[]> {
    return await db
      .select()
      .from(moduleUsageAnalytics)
      .where(eq(moduleUsageAnalytics.userId, userId))
      .orderBy(desc(moduleUsageAnalytics.timestamp));
  }

  // Comprehensive Scenario Template operations
  async getScenarioTemplates(): Promise<ComprehensiveScenarioTemplate[]> {
    return COMPREHENSIVE_SCENARIO_TEMPLATES;
  }

  async getScenarioTemplateById(id: string): Promise<ComprehensiveScenarioTemplate | undefined> {
    return getTemplateById(id);
  }

  async getScenarioTemplatesByCategory(category: string): Promise<ComprehensiveScenarioTemplate[]> {
    return getTemplatesByCategory(category as any);
  }

  async getCrisisResponseTemplates(): Promise<ComprehensiveScenarioTemplate[]> {
    return getCrisisTemplates();
  }

  async createScenarioFromTemplate(templateId: string, customData: any, userId: string): Promise<StrategicScenario> {
    const template = getTemplateById(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    // Create scenario based on template with custom data
    const scenarioData: InsertStrategicScenario = {
      organizationId: customData.organizationId,
      name: customData.name || template.name,
      title: customData.name || template.name,
      description: template.description,
      type: template.category,
      responseStrategy: JSON.stringify({
        templateId: template.id,
        templateData: customData,
        responsePhases: template.responsePhases,
        stakeholderMapping: template.stakeholderMapping,
        communicationPlan: template.communicationPlan,
        resourceRequirements: template.resourceRequirements,
        escalationTriggers: template.escalationTriggers
      }) as string,
      likelihood: customData.likelihood || 0.5,
      impact: 'moderate',
      status: 'draft',
      createdBy: userId
    };

    const [scenario] = await db.insert(strategicScenarios).values(scenarioData).returning();
    return scenario;
  }

  // === STRATEGIC ENHANCEMENT IMPLEMENTATIONS ===

  // Executive War Room operations
  async createWarRoomSession(session: InsertWarRoomSession): Promise<WarRoomSession> {
    const [newSession] = await db.insert(warRoomSessions).values(session).returning();
    return newSession;
  }

  async getWarRoomSessions(organizationId?: string, status?: string): Promise<WarRoomSession[]> {
    const conditions = [];
    
    if (organizationId) {
      conditions.push(eq(warRoomSessions.organizationId, organizationId));
    }
    if (status) {
      conditions.push(eq(warRoomSessions.status, status));
    }
    
    if (conditions.length > 0) {
      return await db
        .select()
        .from(warRoomSessions)
        .where(and(...conditions))
        .orderBy(desc(warRoomSessions.createdAt));
    }
    
    return await db
      .select()
      .from(warRoomSessions)
      .orderBy(desc(warRoomSessions.createdAt));
  }

  async getWarRoomSessionById(sessionId: string): Promise<WarRoomSession | undefined> {
    const [session] = await db.select().from(warRoomSessions).where(eq(warRoomSessions.id, sessionId));
    return session;
  }

  async createWarRoomUpdate(update: InsertWarRoomUpdate): Promise<WarRoomUpdate> {
    const [newUpdate] = await db.insert(warRoomUpdates).values(update).returning();
    return newUpdate;
  }

  async getWarRoomUpdates(sessionId: string): Promise<WarRoomUpdate[]> {
    return await db
      .select()
      .from(warRoomUpdates)
      .where(eq(warRoomUpdates.sessionId, sessionId))
      .orderBy(desc(warRoomUpdates.createdAt));
  }

  // Zero-Click Intelligence operations
  async createExecutiveBriefing(briefing: InsertExecutiveBriefing): Promise<ExecutiveBriefing> {
    const [newBriefing] = await db.insert(executiveBriefings).values(briefing).returning();
    return newBriefing;
  }

  async getExecutiveBriefings(organizationId?: string, executiveId?: string, briefingType?: string): Promise<ExecutiveBriefing[]> {
    const conditions = [];
    
    if (organizationId) {
      conditions.push(eq(executiveBriefings.organizationId, organizationId));
    }
    if (executiveId) {
      conditions.push(eq(executiveBriefings.executiveId, executiveId));
    }
    if (briefingType) {
      conditions.push(eq(executiveBriefings.briefingType, briefingType));
    }
    
    if (conditions.length > 0) {
      return await db
        .select()
        .from(executiveBriefings)
        .where(and(...conditions))
        .orderBy(desc(executiveBriefings.createdAt));
    }
    
    return await db
      .select()
      .from(executiveBriefings)
      .orderBy(desc(executiveBriefings.createdAt));
  }

  async acknowledgeExecutiveBriefing(briefingId: string): Promise<ExecutiveBriefing> {
    const [briefing] = await db
      .update(executiveBriefings)
      .set({ acknowledgedAt: new Date() })
      .where(eq(executiveBriefings.id, briefingId))
      .returning();
    return briefing;
  }

  // Board-Ready Reporting operations
  async createBoardReport(report: InsertBoardReport): Promise<BoardReport> {
    const [newReport] = await db.insert(boardReports).values(report).returning();
    return newReport;
  }

  async getBoardReports(organizationId?: string, reportType?: string): Promise<BoardReport[]> {
    const conditions = [];
    
    if (organizationId) {
      conditions.push(eq(boardReports.organizationId, organizationId));
    }
    if (reportType) {
      conditions.push(eq(boardReports.reportType, reportType));
    }
    
    if (conditions.length > 0) {
      return await db
        .select()
        .from(boardReports)
        .where(and(...conditions))
        .orderBy(desc(boardReports.createdAt));
    }
    
    return await db
      .select()
      .from(boardReports)
      .orderBy(desc(boardReports.createdAt));
  }

  async approveBoardReport(reportId: string, approvedBy: string): Promise<BoardReport> {
    const [report] = await db
      .update(boardReports)
      .set({ 
        approvedBy,
        approvedAt: new Date()
      })
      .where(eq(boardReports.id, reportId))
      .returning();
    return report;
  }

  // Strategic Alerts operations
  async createStrategicAlert(alert: InsertStrategicAlert): Promise<StrategicAlert> {
    const [newAlert] = await db.insert(strategicAlerts).values(alert).returning();
    return newAlert;
  }

  async getStrategicAlerts(organizationId?: string, status?: string, alertType?: string): Promise<StrategicAlert[]> {
    const conditions = [];
    
    if (organizationId) {
      conditions.push(eq(strategicAlerts.organizationId, organizationId));
    }
    if (status) {
      conditions.push(eq(strategicAlerts.status, status));
    }
    if (alertType) {
      conditions.push(eq(strategicAlerts.alertType, alertType as any));
    }
    
    if (conditions.length > 0) {
      return await db
        .select()
        .from(strategicAlerts)
        .where(and(...conditions))
        .orderBy(desc(strategicAlerts.createdAt));
    }
    
    return await db
      .select()
      .from(strategicAlerts)
      .orderBy(desc(strategicAlerts.createdAt));
  }

  async acknowledgeStrategicAlert(alertId: string, acknowledgedBy: string): Promise<StrategicAlert> {
    const [alert] = await db
      .update(strategicAlerts)
      .set({ 
        acknowledgedBy,
        acknowledgedAt: new Date(),
        status: 'acknowledged'
      })
      .where(eq(strategicAlerts.id, alertId))
      .returning();
    return alert;
  }

  // Executive Insights operations
  async createExecutiveInsight(insight: InsertExecutiveInsight): Promise<ExecutiveInsight> {
    const [newInsight] = await db.insert(executiveInsights).values(insight).returning();
    return newInsight;
  }

  async getExecutiveInsights(organizationId?: string, insightType?: string, boardReady?: string): Promise<ExecutiveInsight[]> {
    const conditions = [];
    
    if (organizationId) {
      conditions.push(eq(executiveInsights.organizationId, organizationId));
    }
    if (insightType) {
      conditions.push(eq(executiveInsights.insightType, insightType as any));
    }
    if (boardReady === 'true') {
      conditions.push(eq(executiveInsights.boardReady, true));
    }
    
    if (conditions.length > 0) {
      return await db
        .select()
        .from(executiveInsights)
        .where(and(...conditions))
        .orderBy(desc(executiveInsights.createdAt));
    }
    
    return await db
      .select()
      .from(executiveInsights)
      .orderBy(desc(executiveInsights.createdAt));
  }

  // Action Hooks operations
  async createActionHook(hook: InsertActionHook): Promise<ActionHook> {
    const [newHook] = await db.insert(actionHooks).values(hook).returning();
    return newHook;
  }

  async getActionHooks(organizationId?: string, isActive?: string): Promise<ActionHook[]> {
    const conditions = [];
    
    if (organizationId) {
      conditions.push(eq(actionHooks.organizationId, organizationId));
    }
    if (isActive === 'true') {
      conditions.push(eq(actionHooks.isActive, true));
    }
    
    if (conditions.length > 0) {
      return await db
        .select()
        .from(actionHooks)
        .where(and(...conditions))
        .orderBy(desc(actionHooks.createdAt));
    }
    
    return await db
      .select()
      .from(actionHooks)
      .orderBy(desc(actionHooks.createdAt));
  }

  async triggerActionHook(hookId: string, eventData: any): Promise<any> {
    // Get the action hook
    const [hook] = await db.select().from(actionHooks).where(eq(actionHooks.id, hookId));
    
    if (!hook || !hook.isActive) {
      throw new Error('Action hook not found or not active');
    }

    try {
      // Update execution count and last triggered
      await db
        .update(actionHooks)
        .set({
          lastTriggered: new Date(),
          successCount: sql`${actionHooks.successCount} + 1`
        })
        .where(eq(actionHooks.id, hookId));

      // Return success result
      return {
        success: true,
        hookId,
        executedAt: new Date(),
        message: `Action hook ${hook.name} executed successfully`
      };
    } catch (error) {
      // Update failure count
      await db
        .update(actionHooks)
        .set({
          failureCount: sql`${actionHooks.failureCount} + 1`
        })
        .where(eq(actionHooks.id, hookId));

      throw error;
    }
  }

  // === EXECUTIVE TRIGGER MANAGEMENT IMPLEMENTATIONS ===
  
  // Data Sources operations
  async createDataSource(source: InsertDataSource): Promise<DataSource> {
    const [newSource] = await db.insert(dataSources).values(source).returning();
    return newSource;
  }

  async getDataSources(organizationId?: string, sourceType?: string): Promise<DataSource[]> {
    const conditions = [];
    
    if (organizationId) {
      conditions.push(eq(dataSources.organizationId, organizationId));
    }
    if (sourceType) {
      conditions.push(eq(dataSources.sourceType, sourceType));
    }
    
    if (conditions.length > 0) {
      return await db
        .select()
        .from(dataSources)
        .where(and(...conditions))
        .orderBy(desc(dataSources.createdAt));
    }
    
    return await db
      .select()
      .from(dataSources)
      .orderBy(desc(dataSources.createdAt));
  }

  async getDataSourceById(sourceId: string): Promise<DataSource | undefined> {
    const [source] = await db.select().from(dataSources).where(eq(dataSources.id, sourceId));
    return source;
  }

  async updateDataSource(sourceId: string, updates: Partial<InsertDataSource>): Promise<DataSource> {
    const [updated] = await db
      .update(dataSources)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(dataSources.id, sourceId))
      .returning();
    if (!updated) {
      throw new Error(`Data source with id ${sourceId} not found`);
    }
    return updated;
  }

  // Executive Triggers operations
  async createExecutiveTrigger(trigger: InsertExecutiveTrigger): Promise<ExecutiveTrigger> {
    const [newTrigger] = await db.insert(executiveTriggers).values(trigger).returning();
    return newTrigger;
  }

  async getExecutiveTriggers(organizationId?: string, category?: string, status?: string): Promise<ExecutiveTrigger[]> {
    const conditions = [];
    
    if (organizationId) {
      conditions.push(eq(executiveTriggers.organizationId, organizationId));
    }
    if (category) {
      conditions.push(eq(executiveTriggers.category, category));
    }
    if (status) {
      conditions.push(eq(executiveTriggers.currentStatus, status));
    }
    
    if (conditions.length > 0) {
      return await db
        .select()
        .from(executiveTriggers)
        .where(and(...conditions))
        .orderBy(desc(executiveTriggers.createdAt));
    }
    
    return await db
      .select()
      .from(executiveTriggers)
      .orderBy(desc(executiveTriggers.createdAt));
  }

  async getExecutiveTriggerById(triggerId: string): Promise<ExecutiveTrigger | undefined> {
    const [trigger] = await db.select().from(executiveTriggers).where(eq(executiveTriggers.id, triggerId));
    return trigger;
  }

  async updateExecutiveTrigger(triggerId: string, updates: Partial<InsertExecutiveTrigger>): Promise<ExecutiveTrigger> {
    const [updated] = await db
      .update(executiveTriggers)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(executiveTriggers.id, triggerId))
      .returning();
    if (!updated) {
      throw new Error(`Executive trigger with id ${triggerId} not found`);
    }
    return updated;
  }

  async updateTriggerStatus(triggerId: string, status: 'green' | 'yellow' | 'red', currentValue?: string): Promise<ExecutiveTrigger> {
    // Get current trigger to track previous status
    const current = await this.getExecutiveTriggerById(triggerId);
    if (!current) {
      throw new Error(`Executive trigger with id ${triggerId} not found`);
    }
    
    const updates: any = { currentStatus: status };
    
    const [updated] = await db
      .update(executiveTriggers)
      .set(updates)
      .where(eq(executiveTriggers.id, triggerId))
      .returning();
    
    if (!updated) {
      throw new Error(`Executive trigger with id ${triggerId} not found`);
    }
    
    // Create monitoring history entry
    await this.createTriggerMonitoringHistory({
      triggerId,
      previousStatus: current.currentStatus || null,
      newStatus: status,
      triggerValue: currentValue ? JSON.parse(JSON.stringify({ value: currentValue })) : null,
    });
    
    return updated;
  }

  // Trigger Monitoring History operations
  async createTriggerMonitoringHistory(history: InsertTriggerMonitoringHistory): Promise<TriggerMonitoringHistory> {
    const [newHistory] = await db.insert(triggerMonitoringHistory).values(history).returning();
    return newHistory;
  }

  async getTriggerMonitoringHistory(triggerId: string): Promise<TriggerMonitoringHistory[]> {
    return await db
      .select()
      .from(triggerMonitoringHistory)
      .where(eq(triggerMonitoringHistory.triggerId, triggerId))
      .orderBy(desc(triggerMonitoringHistory.timestamp));
  }

  // Playbook-Trigger Association operations
  async createPlaybookTriggerAssociation(association: InsertPlaybookTriggerAssociation): Promise<PlaybookTriggerAssociation> {
    const [newAssociation] = await db.insert(playbookTriggerAssociations).values(association).returning();
    return newAssociation;
  }

  async getPlaybookTriggerAssociations(triggerId?: string, playbookId?: string): Promise<PlaybookTriggerAssociation[]> {
    const conditions = [];
    
    if (triggerId) {
      conditions.push(eq(playbookTriggerAssociations.triggerId, triggerId));
    }
    if (playbookId) {
      conditions.push(eq(playbookTriggerAssociations.playbookId, playbookId));
    }
    
    if (conditions.length > 0) {
      return await db
        .select()
        .from(playbookTriggerAssociations)
        .where(and(...conditions))
        .orderBy(desc(playbookTriggerAssociations.createdAt));
    }
    
    return await db
      .select()
      .from(playbookTriggerAssociations)
      .orderBy(desc(playbookTriggerAssociations.createdAt));
  }

  // What-If Scenario Analysis operations
  async createWhatIfScenario(scenario: InsertWhatIfScenario): Promise<WhatIfScenario> {
    const [newScenario] = await db.insert(whatIfScenarios).values(scenario).returning();
    return newScenario;
  }

  async getWhatIfScenarios(organizationId?: string): Promise<WhatIfScenario[]> {
    if (organizationId) {
      return await db
        .select()
        .from(whatIfScenarios)
        .where(eq(whatIfScenarios.organizationId, organizationId))
        .orderBy(desc(whatIfScenarios.createdAt));
    }
    
    return await db
      .select()
      .from(whatIfScenarios)
      .orderBy(desc(whatIfScenarios.createdAt));
  }

  async getWhatIfScenarioById(scenarioId: string): Promise<WhatIfScenario | undefined> {
    const [scenario] = await db
      .select()
      .from(whatIfScenarios)
      .where(eq(whatIfScenarios.id, scenarioId));
    return scenario;
  }

  async updateWhatIfScenario(scenarioId: string, updates: Partial<InsertWhatIfScenario>): Promise<WhatIfScenario> {
    const [updated] = await db
      .update(whatIfScenarios)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(whatIfScenarios.id, scenarioId))
      .returning();
    
    if (!updated) {
      throw new Error('What-if scenario not found');
    }
    
    return updated;
  }

  async deleteWhatIfScenario(scenarioId: string): Promise<void> {
    const result = await db
      .delete(whatIfScenarios)
      .where(eq(whatIfScenarios.id, scenarioId))
      .returning();
    
    if (result.length === 0) {
      throw new Error('What-if scenario not found');
    }
  }

  // Decision Outcomes operations for UAT
  async getDecisionOutcomes(): Promise<DecisionOutcome[]> {
    return await db
      .select()
      .from(decisionOutcomes)
      .orderBy(desc(decisionOutcomes.createdAt));
  }

  async createDecisionOutcome(outcome: InsertDecisionOutcome): Promise<DecisionOutcome> {
    const [newOutcome] = await db.insert(decisionOutcomes).values(outcome).returning();
    return newOutcome;
  }
}

export const storage = new DatabaseStorage();
