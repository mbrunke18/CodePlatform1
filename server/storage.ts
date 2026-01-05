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
  playbookActivations,
  whatIfScenarios,
  learningPatterns,
  crisisSimulations,
  decisionConfidence,
  stakeholderAlignment,
  executionValidationReports,
  scenarioContext,
  scenarioStakeholders,
  scenarioSuccessMetrics,
  triggerSignals,
  executionInstances,
  executionInstanceTasks,
  notifications,
  scenarioExecutionPlans,
  executionPlanPhases,
  executionPlanTasks,
  type User,
  type UpsertUser,
  type Organization,
  type InsertOrganization,
  type StrategicScenario,
  type InsertStrategicScenario,
  type ScenarioContext,
  type InsertScenarioContext,
  type ScenarioStakeholder,
  type InsertScenarioStakeholder,
  type ScenarioSuccessMetric,
  type InsertScenarioSuccessMetric,
  type TriggerSignal,
  type InsertTriggerSignal,
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
  type PlaybookActivation,
  type InsertPlaybookActivation,
  type WhatIfScenario,
  type InsertWhatIfScenario,
  type LearningPattern,
  type InsertLearningPattern,
  type DecisionConfidence,
  type InsertDecisionConfidence,
  type StakeholderAlignment,
  type InsertStakeholderAlignment,
  type ExecutionValidationReport,
  type InsertExecutionValidationReport,
  demoLeads,
  type DemoLead,
  type InsertDemoLead,
} from "@shared/schema";

// Infer types from table schemas where needed
type CrisisSimulation = typeof crisisSimulations.$inferSelect;
type InsertCrisisSimulation = typeof crisisSimulations.$inferInsert;
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
  
  // Comprehensive Scenario Creation (Wizard-based)
  createScenarioContext(context: InsertScenarioContext): Promise<ScenarioContext>;
  createScenarioStakeholder(stakeholder: InsertScenarioStakeholder): Promise<ScenarioStakeholder>;
  createScenarioStakeholders(stakeholders: InsertScenarioStakeholder[]): Promise<ScenarioStakeholder[]>;
  createScenarioMetric(metric: InsertScenarioSuccessMetric): Promise<ScenarioSuccessMetric>;
  createScenarioMetrics(metrics: InsertScenarioSuccessMetric[]): Promise<ScenarioSuccessMetric[]>;
  createTriggerSignal(signal: InsertTriggerSignal): Promise<TriggerSignal>;
  createTriggerSignals(signals: InsertTriggerSignal[]): Promise<TriggerSignal[]>;
  getScenarioContext(scenarioId: string): Promise<ScenarioContext | undefined>;
  getScenarioStakeholders(scenarioId: string): Promise<ScenarioStakeholder[]>;
  getScenarioMetrics(scenarioId: string): Promise<ScenarioSuccessMetric[]>;
  getScenarioTriggers(scenarioId: string): Promise<ExecutiveTrigger[]>;
  getTriggerSignals(scenarioId: string): Promise<TriggerSignal[]>;
  createPlaybookTriggerAssociation(association: InsertPlaybookTriggerAssociation): Promise<PlaybookTriggerAssociation>;
  createPlaybookTriggerAssociations(associations: InsertPlaybookTriggerAssociation[]): Promise<PlaybookTriggerAssociation[]>;
  
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
  
  // Playbook Telemetry operations
  getPlaybookTelemetry(playbookId: string, organizationId: string): Promise<{
    lastUsedAt: string | null;
    avgOutcomeScore: number | null;
    avgExecutionTime: number | null;
    executionCount: number;
    targetMetRate: number | null;
  }>;
  
  // Bulk telemetry for all playbooks in an organization
  getAllPlaybookTelemetry(organizationId: string): Promise<Record<string, {
    lastUsedAt: string | null;
    avgOutcomeScore: number | null;
    executionCount: number;
  }>>;
  
  // Playbook Activation operations
  createPlaybookActivation(activation: InsertPlaybookActivation): Promise<PlaybookActivation>;
  
  // What-If Scenario Analysis operations
  createWhatIfScenario(scenario: InsertWhatIfScenario): Promise<WhatIfScenario>;
  getWhatIfScenarios(organizationId?: string): Promise<WhatIfScenario[]>;
  getWhatIfScenarioById(scenarioId: string): Promise<WhatIfScenario | undefined>;
  updateWhatIfScenario(scenarioId: string, updates: Partial<InsertWhatIfScenario>): Promise<WhatIfScenario>;
  deleteWhatIfScenario(scenarioId: string): Promise<void>;
  
  // Decision Outcomes operations for UAT
  getDecisionOutcomes(): Promise<DecisionOutcome[]>;
  createDecisionOutcome(outcome: InsertDecisionOutcome): Promise<DecisionOutcome>;
  getDecisionOutcomesByOrganization(organizationId: string, period?: string): Promise<DecisionOutcome[]>;
  
  // ROI Metrics operations - Phase 1 Trust & Proof Engine
  getROIMetrics(organizationId: string, period?: string): Promise<{
    totalCostSaved: number;
    totalTimeRecovered: number;
    totalDecisions: number;
    avgExecutionTime: number;
    avgConfidenceScore: number;
    successRate: number;
  }>;
  
  // Learning Patterns operations - Institutional Memory
  getLearningPatterns(organizationId?: string, patternType?: string, category?: string): Promise<LearningPattern[]>;
  createLearningPattern(pattern: InsertLearningPattern): Promise<LearningPattern>;
  
  // Crisis Simulations operations - Drill Tracking
  getCrisisSimulations(organizationId?: string, status?: string, scenarioType?: string): Promise<CrisisSimulation[]>;
  createCrisisSimulation(simulation: InsertCrisisSimulation): Promise<CrisisSimulation>;
  getCrisisSimulationById(id: string): Promise<CrisisSimulation | undefined>;
  updateCrisisSimulationStatus(id: string, status: string): Promise<CrisisSimulation>;
  
  // Decision Confidence operations
  getDecisionConfidence(scenarioId: string, userId: string): Promise<DecisionConfidence | undefined>;
  createDecisionConfidence(confidence: InsertDecisionConfidence): Promise<DecisionConfidence>;
  
  // Stakeholder Alignment operations
  getStakeholderAlignment(scenarioId: string, executionId?: string): Promise<StakeholderAlignment[]>;
  createStakeholderAlignment(alignment: InsertStakeholderAlignment): Promise<StakeholderAlignment>;
  updateStakeholderAlignment(id: string, data: Partial<InsertStakeholderAlignment>): Promise<StakeholderAlignment | undefined>;
  
  // Execution Validation Report operations
  getExecutionValidationReports(scenarioId: string): Promise<ExecutionValidationReport[]>;
  getExecutionValidationReportByExecutionId(executionId: string): Promise<ExecutionValidationReport | undefined>;
  createExecutionValidationReport(report: InsertExecutionValidationReport): Promise<ExecutionValidationReport>;
  updateExecutionValidationReport(id: string, data: Partial<InsertExecutionValidationReport>): Promise<ExecutionValidationReport | undefined>;
  
  // Demo Lead operations
  createDemoLead(lead: InsertDemoLead): Promise<DemoLead>;
  getDemoLeads(): Promise<DemoLead[]>;
  
  // === ACTIVATION ORCHESTRATION OPERATIONS ===
  
  // Execution Instance operations
  createExecutionInstance(instance: any): Promise<any>;
  getExecutionInstanceById(instanceId: string): Promise<any>;
  updateExecutionInstance(instanceId: string, updates: any): Promise<any>;
  
  // Execution Instance Tasks operations
  createExecutionInstanceTasks(tasks: any[]): Promise<any[]>;
  getExecutionInstanceTasks(instanceId: string): Promise<any[]>;
  updateExecutionInstanceTask(taskId: string, updates: any): Promise<any>;
  
  // Notification operations
  createNotification(notification: any): Promise<any>;
  createNotifications(notifications: any[]): Promise<any[]>;
  getNotifications(userId: string): Promise<any[]>;
  markNotificationAsRead(notificationId: string): Promise<any>;
  
  // Orchestration status tracking
  getExecutionStatus(instanceId: string): Promise<any>;
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

  // Comprehensive Scenario Creation Methods
  async createScenarioContext(context: InsertScenarioContext): Promise<ScenarioContext> {
    const [newContext] = await db.insert(scenarioContext).values(context).returning();
    return newContext;
  }

  async createScenarioStakeholder(stakeholder: InsertScenarioStakeholder): Promise<ScenarioStakeholder> {
    const [newStakeholder] = await db.insert(scenarioStakeholders).values(stakeholder).returning();
    return newStakeholder;
  }

  async createScenarioStakeholders(stakeholders: InsertScenarioStakeholder[]): Promise<ScenarioStakeholder[]> {
    if (stakeholders.length === 0) return [];
    const newStakeholders = await db.insert(scenarioStakeholders).values(stakeholders).returning();
    return newStakeholders;
  }

  async createScenarioMetric(metric: InsertScenarioSuccessMetric): Promise<ScenarioSuccessMetric> {
    const [newMetric] = await db.insert(scenarioSuccessMetrics).values(metric).returning();
    return newMetric;
  }

  async createScenarioMetrics(metrics: InsertScenarioSuccessMetric[]): Promise<ScenarioSuccessMetric[]> {
    if (metrics.length === 0) return [];
    const newMetrics = await db.insert(scenarioSuccessMetrics).values(metrics).returning();
    return newMetrics;
  }

  async createTriggerSignal(signal: InsertTriggerSignal): Promise<TriggerSignal> {
    const [newSignal] = await db.insert(triggerSignals).values(signal).returning();
    return newSignal;
  }

  async createTriggerSignals(signals: InsertTriggerSignal[]): Promise<TriggerSignal[]> {
    if (signals.length === 0) return [];
    const newSignals = await db.insert(triggerSignals).values(signals).returning();
    return newSignals;
  }

  async getScenarioContext(scenarioId: string): Promise<ScenarioContext | undefined> {
    const [context] = await db.select().from(scenarioContext).where(eq(scenarioContext.scenarioId, scenarioId));
    return context;
  }

  async getScenarioStakeholders(scenarioId: string): Promise<ScenarioStakeholder[]> {
    return await db.select().from(scenarioStakeholders).where(eq(scenarioStakeholders.scenarioId, scenarioId));
  }

  async getScenarioMetrics(scenarioId: string): Promise<ScenarioSuccessMetric[]> {
    return await db.select().from(scenarioSuccessMetrics).where(eq(scenarioSuccessMetrics.scenarioId, scenarioId));
  }

  async getScenarioTriggers(scenarioId: string): Promise<ExecutiveTrigger[]> {
    // Get triggers linked to this scenario via playbookTriggerAssociations
    const associations = await db.select().from(playbookTriggerAssociations).where(eq(playbookTriggerAssociations.playbookId, scenarioId));
    if (associations.length === 0) return [];
    
    const triggerIds = associations.map(a => a.triggerId);
    return await db.select().from(executiveTriggers).where(inArray(executiveTriggers.id, triggerIds));
  }

  async getTriggerSignals(scenarioId: string): Promise<TriggerSignal[]> {
    // For now, return organization-level signals (can be enhanced to filter by scenario triggers later)
    const scenarioTriggers = await this.getScenarioTriggers(scenarioId);
    if (scenarioTriggers.length === 0) return [];
    return [];  // TODO: Join with triggerSignals through compositeTriggerLogic when needed
  }
  
  async createPlaybookTriggerAssociation(association: InsertPlaybookTriggerAssociation): Promise<PlaybookTriggerAssociation> {
    const [newAssociation] = await db.insert(playbookTriggerAssociations).values(association).returning();
    return newAssociation;
  }

  async createPlaybookTriggerAssociations(associations: InsertPlaybookTriggerAssociation[]): Promise<PlaybookTriggerAssociation[]> {
    if (associations.length === 0) return [];
    return await db.insert(playbookTriggerAssociations).values(associations).returning();
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

  // Playbook Telemetry operations
  async getPlaybookTelemetry(playbookId: string, organizationId: string): Promise<{
    lastUsedAt: string | null;
    avgOutcomeScore: number | null;
    avgExecutionTime: number | null;
    executionCount: number;
    targetMetRate: number | null;
  }> {
    const [result] = await db
      .select({
        lastUsedAt: sql<string>`MAX(${playbookActivations.activatedAt})`,
        avgOutcomeScore: sql<number>`ROUND(AVG(${playbookActivations.successRating})::numeric, 1)`,
        avgExecutionTime: sql<number>`ROUND(AVG(${playbookActivations.actualExecutionTime})::numeric, 1)`,
        executionCount: sql<number>`COUNT(*)::int`,
        targetMetRate: sql<number>`ROUND((SUM(CASE WHEN ${playbookActivations.targetMet} THEN 1 ELSE 0 END)::numeric / NULLIF(COUNT(*), 0)) * 100, 1)`,
      })
      .from(playbookActivations)
      .where(and(
        eq(playbookActivations.playbookId, playbookId),
        eq(playbookActivations.organizationId, organizationId)
      ));

    return {
      lastUsedAt: result?.lastUsedAt || null,
      avgOutcomeScore: result?.avgOutcomeScore || null,
      avgExecutionTime: result?.avgExecutionTime || null,
      executionCount: result?.executionCount || 0,
      targetMetRate: result?.targetMetRate || null,
    };
  }

  // Bulk telemetry for all playbooks in an organization
  async getAllPlaybookTelemetry(organizationId: string): Promise<Record<string, {
    lastUsedAt: string | null;
    avgOutcomeScore: number | null;
    executionCount: number;
  }>> {
    const results = await db
      .select({
        playbookId: playbookActivations.playbookId,
        lastUsedAt: sql<string>`MAX(${playbookActivations.activatedAt})`,
        avgOutcomeScore: sql<number>`ROUND(AVG(${playbookActivations.successRating})::numeric, 1)`,
        executionCount: sql<number>`COUNT(*)::int`,
      })
      .from(playbookActivations)
      .where(eq(playbookActivations.organizationId, organizationId))
      .groupBy(playbookActivations.playbookId);

    const telemetryMap: Record<string, { lastUsedAt: string | null; avgOutcomeScore: number | null; executionCount: number }> = {};
    for (const row of results) {
      telemetryMap[row.playbookId] = {
        lastUsedAt: row.lastUsedAt || null,
        avgOutcomeScore: row.avgOutcomeScore || null,
        executionCount: row.executionCount || 0,
      };
    }
    return telemetryMap;
  }

  // Playbook Activation operations
  async createPlaybookActivation(activation: InsertPlaybookActivation): Promise<PlaybookActivation> {
    const [newActivation] = await db.insert(playbookActivations).values(activation).returning();
    return newActivation;
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

  async getDecisionOutcomesByOrganization(organizationId: string, period?: string): Promise<DecisionOutcome[]> {
    const conditions = [eq(decisionOutcomes.organizationId, organizationId)];

    // Filter by period if provided (month, quarter, year)
    if (period) {
      const now = new Date();
      let startDate: Date;
      
      switch (period) {
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'quarter':
          const quarter = Math.floor(now.getMonth() / 3);
          startDate = new Date(now.getFullYear(), quarter * 3, 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(now.getFullYear(), 0, 1);
      }
      
      conditions.push(sql`${decisionOutcomes.createdAt} >= ${startDate}`);
    }

    return await db
      .select()
      .from(decisionOutcomes)
      .where(and(...conditions))
      .orderBy(desc(decisionOutcomes.createdAt));
  }

  async getROIMetrics(organizationId: string, period?: string): Promise<{
    totalCostSaved: number;
    totalTimeRecovered: number;
    totalDecisions: number;
    avgExecutionTime: number;
    avgConfidenceScore: number;
    successRate: number;
  }> {
    const outcomes = await this.getDecisionOutcomesByOrganization(organizationId, period);
    
    if (outcomes.length === 0) {
      return {
        totalCostSaved: 0,
        totalTimeRecovered: 0,
        totalDecisions: 0,
        avgExecutionTime: 0,
        avgConfidenceScore: 0,
        successRate: 0,
      };
    }

    const totalCostSaved = outcomes.reduce((sum, o) => {
      const cost = o.costOfImplementation ? parseFloat(o.costOfImplementation.toString()) : 0;
      return sum + cost;
    }, 0);
    
    const totalTimeRecovered = outcomes.reduce((sum, o) => sum + (o.timeToImplement || 0), 0);
    const totalDecisions = outcomes.length;
    const avgExecutionTime = totalTimeRecovered / totalDecisions;
    
    // Convert confidence enum to numeric score (low=25, medium=50, high=75, very_high=100)
    const confidenceMap = { low: 25, medium: 50, high: 75, very_high: 100 };
    const avgConfidenceScore = outcomes.reduce((sum, o) => {
      const score = o.confidence ? confidenceMap[o.confidence] : 0;
      return sum + score;
    }, 0) / totalDecisions;
    
    const successCount = outcomes.filter(o => 
      o.actualOutcome === 'successful' || o.effectiveness === 'high' || o.effectiveness === 'excellent'
    ).length;
    const successRate = (successCount / totalDecisions) * 100;

    return {
      totalCostSaved,
      totalTimeRecovered,
      totalDecisions,
      avgExecutionTime,
      avgConfidenceScore,
      successRate,
    };
  }

  // Learning Patterns operations - Institutional Memory
  async getLearningPatterns(organizationId?: string, patternType?: string, category?: string): Promise<LearningPattern[]> {
    let query = db.select().from(learningPatterns);
    
    const conditions = [];
    if (organizationId) conditions.push(eq(learningPatterns.organizationId, organizationId));
    if (patternType) conditions.push(eq(learningPatterns.patternType, patternType));
    if (category) conditions.push(eq(learningPatterns.category, category));
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    
    return await query.orderBy(desc(learningPatterns.discoveredAt));
  }

  async createLearningPattern(pattern: InsertLearningPattern): Promise<LearningPattern> {
    const [newPattern] = await db.insert(learningPatterns).values(pattern).returning();
    return newPattern;
  }

  // Crisis Simulations operations - Drill Tracking
  async getCrisisSimulations(organizationId?: string, status?: string, scenarioType?: string): Promise<CrisisSimulation[]> {
    let query = db.select().from(crisisSimulations);
    
    const conditions = [];
    if (organizationId) conditions.push(eq(crisisSimulations.organizationId, organizationId));
    if (status) conditions.push(eq(crisisSimulations.status, status as any));
    if (scenarioType) conditions.push(eq(crisisSimulations.scenarioType, scenarioType));
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    
    return await query.orderBy(desc(crisisSimulations.createdAt));
  }

  async createCrisisSimulation(simulation: InsertCrisisSimulation): Promise<CrisisSimulation> {
    const [newSimulation] = await db.insert(crisisSimulations).values(simulation).returning();
    return newSimulation;
  }

  async getCrisisSimulationById(id: string): Promise<CrisisSimulation | undefined> {
    const [simulation] = await db.select().from(crisisSimulations).where(eq(crisisSimulations.id, id));
    return simulation;
  }

  async updateCrisisSimulationStatus(id: string, status: string): Promise<CrisisSimulation> {
    const [updated] = await db
      .update(crisisSimulations)
      .set({ status: status as any, updatedAt: new Date() })
      .where(eq(crisisSimulations.id, id))
      .returning();
    
    if (!updated) {
      throw new Error('Crisis simulation not found');
    }
    
    return updated;
  }

  // Decision Confidence operations
  async getDecisionConfidence(scenarioId: string, userId: string): Promise<DecisionConfidence | undefined> {
    const [confidence] = await db
      .select()
      .from(decisionConfidence)
      .where(and(
        eq(decisionConfidence.scenarioId, scenarioId),
        eq(decisionConfidence.userId, userId)
      ))
      .orderBy(desc(decisionConfidence.calculatedAt))
      .limit(1);
    return confidence;
  }

  async createDecisionConfidence(confidence: InsertDecisionConfidence): Promise<DecisionConfidence> {
    const [newConfidence] = await db.insert(decisionConfidence).values(confidence).returning();
    return newConfidence;
  }

  // Stakeholder Alignment operations
  async getStakeholderAlignment(scenarioId: string, executionId?: string): Promise<StakeholderAlignment[]> {
    const conditions = [eq(stakeholderAlignment.scenarioId, scenarioId)];
    if (executionId) {
      conditions.push(eq(stakeholderAlignment.executionId, executionId));
    }
    
    return await db
      .select()
      .from(stakeholderAlignment)
      .where(and(...conditions))
      .orderBy(desc(stakeholderAlignment.notifiedAt));
  }

  async createStakeholderAlignment(alignment: InsertStakeholderAlignment): Promise<StakeholderAlignment> {
    const [newAlignment] = await db.insert(stakeholderAlignment).values(alignment).returning();
    return newAlignment;
  }

  async updateStakeholderAlignment(id: string, data: Partial<InsertStakeholderAlignment>): Promise<StakeholderAlignment | undefined> {
    const [updated] = await db
      .update(stakeholderAlignment)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(stakeholderAlignment.id, id))
      .returning();
    return updated;
  }

  // Execution Validation Report operations
  async getExecutionValidationReports(scenarioId: string): Promise<ExecutionValidationReport[]> {
    return await db
      .select()
      .from(executionValidationReports)
      .where(eq(executionValidationReports.scenarioId, scenarioId))
      .orderBy(desc(executionValidationReports.validationDate));
  }

  async getExecutionValidationReportByExecutionId(executionId: string): Promise<ExecutionValidationReport | undefined> {
    const [report] = await db
      .select()
      .from(executionValidationReports)
      .where(eq(executionValidationReports.executionId, executionId));
    return report;
  }

  async createExecutionValidationReport(report: InsertExecutionValidationReport): Promise<ExecutionValidationReport> {
    const [newReport] = await db.insert(executionValidationReports).values(report).returning();
    return newReport;
  }

  async updateExecutionValidationReport(id: string, data: Partial<InsertExecutionValidationReport>): Promise<ExecutionValidationReport | undefined> {
    const [updated] = await db
      .update(executionValidationReports)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(executionValidationReports.id, id))
      .returning();
    return updated;
  }

  // Demo Lead operations
  async createDemoLead(lead: InsertDemoLead): Promise<DemoLead> {
    const [newLead] = await db.insert(demoLeads).values(lead).returning();
    return newLead;
  }

  async getDemoLeads(): Promise<DemoLead[]> {
    return await db
      .select()
      .from(demoLeads)
      .orderBy(desc(demoLeads.createdAt));
  }

  // === ACTIVATION ORCHESTRATION OPERATIONS ===
  
  async createExecutionInstance(instance: any): Promise<any> {
    const [newInstance] = await db
      .insert(executionInstances)
      .values(instance)
      .returning();
    return newInstance;
  }

  async getExecutionInstanceById(instanceId: string): Promise<any> {
    const [instance] = await db
      .select()
      .from(executionInstances)
      .where(eq(executionInstances.id, instanceId));
    return instance;
  }

  async updateExecutionInstance(instanceId: string, updates: any): Promise<any> {
    const [updated] = await db
      .update(executionInstances)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(executionInstances.id, instanceId))
      .returning();
    return updated;
  }

  async createExecutionInstanceTasks(tasks: any[]): Promise<any[]> {
    if (tasks.length === 0) return [];
    const newTasks = await db
      .insert(executionInstanceTasks)
      .values(tasks)
      .returning();
    return newTasks;
  }

  async getExecutionInstanceTasks(instanceId: string): Promise<any[]> {
    return await db
      .select()
      .from(executionInstanceTasks)
      .where(eq(executionInstanceTasks.executionInstanceId, instanceId));
  }

  async updateExecutionInstanceTask(taskId: string, updates: any): Promise<any> {
    const [updated] = await db
      .update(executionInstanceTasks)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(executionInstanceTasks.id, taskId))
      .returning();
    return updated;
  }

  async createNotification(notification: any): Promise<any> {
    const [newNotification] = await db
      .insert(notifications)
      .values(notification)
      .returning();
    return newNotification;
  }

  async createNotifications(notificationsList: any[]): Promise<any[]> {
    if (notificationsList.length === 0) return [];
    const newNotifications = await db
      .insert(notifications)
      .values(notificationsList)
      .returning();
    return newNotifications;
  }

  async getNotifications(userId: string): Promise<any[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async markNotificationAsRead(notificationId: string): Promise<any> {
    const [updated] = await db
      .update(notifications)
      .set({ isRead: true, readAt: new Date() })
      .where(eq(notifications.id, notificationId))
      .returning();
    return updated;
  }

  async getExecutionStatus(instanceId: string): Promise<any> {
    const instance = await this.getExecutionInstanceById(instanceId);
    if (!instance) return null;

    const tasks = await this.getExecutionInstanceTasks(instanceId);
    
    const taskUserIds = tasks
      .filter((t: any) => t.assignedUserId)
      .map((t: any) => t.assignedUserId);

    const notifs = taskUserIds.length > 0
      ? await db
          .select()
          .from(notifications)
          .where(
            and(
              eq(notifications.entityId, instanceId),
              inArray(notifications.userId, taskUserIds)
            )
          )
      : [];

    const acknowledgedCount = notifs.filter((n: any) => n.readAt).length;
    const totalStakeholders = new Set(taskUserIds).size;
    const coordinationComplete = totalStakeholders > 0 
      ? (acknowledgedCount / totalStakeholders) >= 0.8 
      : false;

    const elapsedMinutes = instance.startedAt
      ? Math.floor((Date.now() - new Date(instance.startedAt).getTime()) / 60000)
      : 0;

    return {
      executionInstance: instance,
      tasks,
      notifications: notifs,
      coordination: {
        startTime: instance.startedAt,
        elapsedMinutes,
        tasksDistributed: tasks.length,
        notificationsSent: notifs.length,
        acknowledged: acknowledgedCount,
        coordinationComplete,
      },
    };
  }

  // ============================================================================
  // CONFIGURATION TABLES - Departments, Escalation Policies, Communication Channels
  // Custom Triggers, Success Metrics, Organization Setup Progress
  // ============================================================================

  async getDepartments(organizationId?: string): Promise<any[]> {
    if (organizationId) {
      const result = await db.execute(
        sql`SELECT * FROM departments WHERE organization_id = ${organizationId} ORDER BY name`
      );
      return result.rows as any[];
    }
    const result = await db.execute(sql`SELECT * FROM departments ORDER BY name`);
    return result.rows as any[];
  }

  async createDepartment(department: any): Promise<any> {
    const result = await db.execute(
      sql`INSERT INTO departments (id, organization_id, name, description, head_name, head_email, headcount, budget, parent_department_id)
          VALUES (gen_random_uuid(), ${department.organizationId}, ${department.name}, ${department.description}, 
                  ${department.headName}, ${department.headEmail}, ${department.headcount || 0}, 
                  ${department.budget || 0}, ${department.parentDepartmentId})
          RETURNING *`
    );
    return result.rows[0];
  }

  async updateDepartment(id: string, updates: any): Promise<any> {
    const result = await db.execute(
      sql`UPDATE departments SET 
          name = COALESCE(${updates.name}, name),
          description = COALESCE(${updates.description}, description),
          head_name = COALESCE(${updates.headName}, head_name),
          head_email = COALESCE(${updates.headEmail}, head_email),
          headcount = COALESCE(${updates.headcount}, headcount),
          budget = COALESCE(${updates.budget}, budget),
          updated_at = NOW()
          WHERE id = ${id}
          RETURNING *`
    );
    return result.rows[0];
  }

  async deleteDepartment(id: string): Promise<void> {
    await db.execute(sql`DELETE FROM departments WHERE id = ${id}`);
  }

  async getEscalationPolicies(organizationId?: string): Promise<any[]> {
    if (organizationId) {
      const result = await db.execute(
        sql`SELECT * FROM escalation_policies WHERE organization_id = ${organizationId} ORDER BY name`
      );
      return result.rows as any[];
    }
    const result = await db.execute(sql`SELECT * FROM escalation_policies ORDER BY name`);
    return result.rows as any[];
  }

  async createEscalationPolicy(policy: any): Promise<any> {
    const result = await db.execute(
      sql`INSERT INTO escalation_policies (id, organization_id, name, description, trigger_conditions, escalation_levels, notification_channels, sla_minutes)
          VALUES (gen_random_uuid(), ${policy.organizationId}, ${policy.name}, ${policy.description},
                  ${JSON.stringify(policy.triggerConditions || {})}, ${JSON.stringify(policy.escalationLevels || [])},
                  ${JSON.stringify(policy.notificationChannels || [])}, ${policy.slaMinutes || 60})
          RETURNING *`
    );
    return result.rows[0];
  }

  async updateEscalationPolicy(id: string, updates: any): Promise<any> {
    const result = await db.execute(
      sql`UPDATE escalation_policies SET
          name = COALESCE(${updates.name}, name),
          description = COALESCE(${updates.description}, description),
          trigger_conditions = COALESCE(${JSON.stringify(updates.triggerConditions)}, trigger_conditions),
          escalation_levels = COALESCE(${JSON.stringify(updates.escalationLevels)}, escalation_levels),
          notification_channels = COALESCE(${JSON.stringify(updates.notificationChannels)}, notification_channels),
          sla_minutes = COALESCE(${updates.slaMinutes}, sla_minutes),
          updated_at = NOW()
          WHERE id = ${id}
          RETURNING *`
    );
    return result.rows[0];
  }

  async deleteEscalationPolicy(id: string): Promise<void> {
    await db.execute(sql`DELETE FROM escalation_policies WHERE id = ${id}`);
  }

  async getCommunicationChannels(organizationId?: string): Promise<any[]> {
    if (organizationId) {
      const result = await db.execute(
        sql`SELECT * FROM communication_channels WHERE organization_id = ${organizationId} ORDER BY name`
      );
      return result.rows as any[];
    }
    const result = await db.execute(sql`SELECT * FROM communication_channels ORDER BY name`);
    return result.rows as any[];
  }

  async createCommunicationChannel(channel: any): Promise<any> {
    const result = await db.execute(
      sql`INSERT INTO communication_channels (id, organization_id, name, channel_type, configuration, is_active, priority)
          VALUES (gen_random_uuid(), ${channel.organizationId}, ${channel.name}, ${channel.channelType},
                  ${JSON.stringify(channel.configuration || {})}, ${channel.isActive ?? true}, ${channel.priority || 1})
          RETURNING *`
    );
    return result.rows[0];
  }

  async updateCommunicationChannel(id: string, updates: any): Promise<any> {
    const result = await db.execute(
      sql`UPDATE communication_channels SET
          name = COALESCE(${updates.name}, name),
          channel_type = COALESCE(${updates.channelType}, channel_type),
          configuration = COALESCE(${JSON.stringify(updates.configuration)}, configuration),
          is_active = COALESCE(${updates.isActive}, is_active),
          priority = COALESCE(${updates.priority}, priority),
          updated_at = NOW()
          WHERE id = ${id}
          RETURNING *`
    );
    return result.rows[0];
  }

  async deleteCommunicationChannel(id: string): Promise<void> {
    await db.execute(sql`DELETE FROM communication_channels WHERE id = ${id}`);
  }

  async getCustomTriggers(organizationId?: string): Promise<any[]> {
    if (organizationId) {
      const result = await db.execute(
        sql`SELECT * FROM custom_triggers WHERE organization_id = ${organizationId} ORDER BY name`
      );
      return result.rows as any[];
    }
    const result = await db.execute(sql`SELECT * FROM custom_triggers ORDER BY name`);
    return result.rows as any[];
  }

  async createCustomTrigger(trigger: any): Promise<any> {
    const result = await db.execute(
      sql`INSERT INTO custom_triggers (id, organization_id, name, description, category, conditions, threshold_config, notification_settings, playbook_mappings, is_active)
          VALUES (gen_random_uuid(), ${trigger.organizationId}, ${trigger.name}, ${trigger.description},
                  ${trigger.category}, ${JSON.stringify(trigger.conditions || {})}, 
                  ${JSON.stringify(trigger.thresholdConfig || {})}, ${JSON.stringify(trigger.notificationSettings || {})},
                  ${JSON.stringify(trigger.playbookMappings || [])}, ${trigger.isActive ?? true})
          RETURNING *`
    );
    return result.rows[0];
  }

  async updateCustomTrigger(id: string, updates: any): Promise<any> {
    const result = await db.execute(
      sql`UPDATE custom_triggers SET
          name = COALESCE(${updates.name}, name),
          description = COALESCE(${updates.description}, description),
          category = COALESCE(${updates.category}, category),
          conditions = COALESCE(${JSON.stringify(updates.conditions)}, conditions),
          threshold_config = COALESCE(${JSON.stringify(updates.thresholdConfig)}, threshold_config),
          notification_settings = COALESCE(${JSON.stringify(updates.notificationSettings)}, notification_settings),
          playbook_mappings = COALESCE(${JSON.stringify(updates.playbookMappings)}, playbook_mappings),
          is_active = COALESCE(${updates.isActive}, is_active),
          updated_at = NOW()
          WHERE id = ${id}
          RETURNING *`
    );
    return result.rows[0];
  }

  async deleteCustomTrigger(id: string): Promise<void> {
    await db.execute(sql`DELETE FROM custom_triggers WHERE id = ${id}`);
  }

  async getSuccessMetricsConfig(organizationId?: string): Promise<any[]> {
    if (organizationId) {
      const result = await db.execute(
        sql`SELECT * FROM success_metrics_config WHERE organization_id = ${organizationId} ORDER BY metric_name`
      );
      return result.rows as any[];
    }
    const result = await db.execute(sql`SELECT * FROM success_metrics_config ORDER BY metric_name`);
    return result.rows as any[];
  }

  async createSuccessMetric(metric: any): Promise<any> {
    const result = await db.execute(
      sql`INSERT INTO success_metrics_config (id, organization_id, metric_name, description, metric_type, target_value, current_value, baseline_value, target_unit, review_cadence, is_active)
          VALUES (gen_random_uuid(), ${metric.organizationId}, ${metric.name || metric.metricName}, ${metric.description},
                  ${metric.metricType}, ${metric.targetValue || 0}, ${metric.currentValue || 0},
                  ${metric.baselineValue || 0}, ${metric.unit || metric.targetUnit || '%'}, ${metric.reviewCadence || 'weekly'}, ${metric.isActive ?? true})
          RETURNING *`
    );
    return result.rows[0];
  }

  async updateSuccessMetric(id: string, updates: any): Promise<any> {
    const result = await db.execute(
      sql`UPDATE success_metrics_config SET
          metric_name = COALESCE(${updates.name || updates.metricName}, metric_name),
          description = COALESCE(${updates.description}, description),
          metric_type = COALESCE(${updates.metricType}, metric_type),
          target_value = COALESCE(${updates.targetValue}, target_value),
          current_value = COALESCE(${updates.currentValue}, current_value),
          baseline_value = COALESCE(${updates.baselineValue}, baseline_value),
          target_unit = COALESCE(${updates.unit || updates.targetUnit}, target_unit),
          review_cadence = COALESCE(${updates.reviewCadence}, review_cadence),
          is_active = COALESCE(${updates.isActive}, is_active),
          updated_at = NOW()
          WHERE id = ${id}
          RETURNING *`
    );
    return result.rows[0];
  }

  async deleteSuccessMetric(id: string): Promise<void> {
    await db.execute(sql`DELETE FROM success_metrics_config WHERE id = ${id}`);
  }

  async getOrganizationSetupProgress(organizationId: string): Promise<any> {
    const result = await db.execute(
      sql`SELECT * FROM organization_setup_progress WHERE organization_id = ${organizationId}`
    );
    return result.rows[0] || null;
  }

  async upsertOrganizationSetupProgress(progress: any): Promise<any> {
    const result = await db.execute(
      sql`INSERT INTO organization_setup_progress (id, organization_id, departments_configured, executives_configured, approval_chains_configured, escalation_policies_configured, communication_channels_configured, setup_completed_at)
          VALUES (gen_random_uuid(), ${progress.organizationId}, ${progress.departmentsConfigured ?? false},
                  ${progress.executivesConfigured ?? false}, ${progress.approvalChainsConfigured ?? false},
                  ${progress.escalationPoliciesConfigured ?? false}, ${progress.communicationChannelsConfigured ?? false},
                  ${progress.setupCompletedAt})
          ON CONFLICT (organization_id) DO UPDATE SET
          departments_configured = EXCLUDED.departments_configured,
          executives_configured = EXCLUDED.executives_configured,
          approval_chains_configured = EXCLUDED.approval_chains_configured,
          escalation_policies_configured = EXCLUDED.escalation_policies_configured,
          communication_channels_configured = EXCLUDED.communication_channels_configured,
          setup_completed_at = EXCLUDED.setup_completed_at,
          updated_at = NOW()
          RETURNING *`
    );
    return result.rows[0];
  }

  // ============================================================================
  // EXECUTION PLAN SYNC & INTEGRATION OPERATIONS
  // ============================================================================

  // Export Templates CRUD
  async getExportTemplates(organizationId?: string): Promise<any[]> {
    if (organizationId) {
      const result = await db.execute(
        sql`SELECT * FROM execution_plan_export_templates WHERE organization_id = ${organizationId} AND is_active = true ORDER BY name`
      );
      return result.rows as any[];
    }
    const result = await db.execute(sql`SELECT * FROM execution_plan_export_templates WHERE is_active = true ORDER BY name`);
    return result.rows as any[];
  }

  async getExportTemplate(id: string): Promise<any | null> {
    const result = await db.execute(sql`SELECT * FROM execution_plan_export_templates WHERE id = ${id}`);
    return result.rows[0] || null;
  }

  async createExportTemplate(template: any): Promise<any> {
    const result = await db.execute(
      sql`INSERT INTO execution_plan_export_templates 
          (id, organization_id, name, description, platform, project_name_template, project_description_template,
           phase_mapping, field_mappings, custom_fields, automation_rules, default_labels, sync_direction,
           sync_frequency, is_default, is_active, created_by)
          VALUES (gen_random_uuid(), ${template.organizationId}, ${template.name}, ${template.description},
                  ${template.platform}, ${template.projectNameTemplate}, ${template.projectDescriptionTemplate},
                  ${JSON.stringify(template.phaseMapping || {})}, ${JSON.stringify(template.fieldMappings || {})},
                  ${JSON.stringify(template.customFields || {})}, ${JSON.stringify(template.automationRules || {})},
                  ${JSON.stringify(template.defaultLabels || [])}, ${template.syncDirection || 'push'},
                  ${template.syncFrequency || 'realtime'}, ${template.isDefault ?? false}, true, ${template.createdBy})
          RETURNING *`
    );
    return result.rows[0];
  }

  async updateExportTemplate(id: string, updates: any): Promise<any> {
    const result = await db.execute(
      sql`UPDATE execution_plan_export_templates SET
          name = COALESCE(${updates.name}, name),
          description = COALESCE(${updates.description}, description),
          platform = COALESCE(${updates.platform}, platform),
          project_name_template = COALESCE(${updates.projectNameTemplate}, project_name_template),
          project_description_template = COALESCE(${updates.projectDescriptionTemplate}, project_description_template),
          phase_mapping = COALESCE(${JSON.stringify(updates.phaseMapping)}, phase_mapping),
          field_mappings = COALESCE(${JSON.stringify(updates.fieldMappings)}, field_mappings),
          custom_fields = COALESCE(${JSON.stringify(updates.customFields)}, custom_fields),
          automation_rules = COALESCE(${JSON.stringify(updates.automationRules)}, automation_rules),
          default_labels = COALESCE(${JSON.stringify(updates.defaultLabels)}, default_labels),
          sync_direction = COALESCE(${updates.syncDirection}, sync_direction),
          sync_frequency = COALESCE(${updates.syncFrequency}, sync_frequency),
          is_default = COALESCE(${updates.isDefault}, is_default),
          is_active = COALESCE(${updates.isActive}, is_active),
          updated_at = NOW()
          WHERE id = ${id}
          RETURNING *`
    );
    return result.rows[0];
  }

  async deleteExportTemplate(id: string): Promise<void> {
    await db.execute(sql`UPDATE execution_plan_export_templates SET is_active = false WHERE id = ${id}`);
  }

  // Sync Records CRUD
  async getSyncRecords(executionInstanceId?: string): Promise<any[]> {
    if (executionInstanceId) {
      const result = await db.execute(
        sql`SELECT sr.*, et.name as template_name, et.platform 
            FROM execution_plan_sync_records sr
            JOIN execution_plan_export_templates et ON sr.export_template_id = et.id
            WHERE sr.execution_instance_id = ${executionInstanceId}
            ORDER BY sr.created_at DESC`
      );
      return result.rows as any[];
    }
    const result = await db.execute(
      sql`SELECT sr.*, et.name as template_name, et.platform 
          FROM execution_plan_sync_records sr
          JOIN execution_plan_export_templates et ON sr.export_template_id = et.id
          ORDER BY sr.created_at DESC`
    );
    return result.rows as any[];
  }

  async getSyncRecord(id: string): Promise<any | null> {
    const result = await db.execute(
      sql`SELECT sr.*, et.name as template_name, et.platform 
          FROM execution_plan_sync_records sr
          JOIN execution_plan_export_templates et ON sr.export_template_id = et.id
          WHERE sr.id = ${id}`
    );
    return result.rows[0] || null;
  }

  async createSyncRecord(record: any): Promise<any> {
    const result = await db.execute(
      sql`INSERT INTO execution_plan_sync_records 
          (id, execution_instance_id, export_template_id, integration_id, external_project_id,
           external_project_url, external_project_key, sync_status, task_sync_map, sync_settings)
          VALUES (gen_random_uuid(), ${record.executionInstanceId}, ${record.exportTemplateId},
                  ${record.integrationId}, ${record.externalProjectId}, ${record.externalProjectUrl},
                  ${record.externalProjectKey}, ${record.syncStatus || 'pending'},
                  ${JSON.stringify(record.taskSyncMap || {})}, ${JSON.stringify(record.syncSettings || {})})
          RETURNING *`
    );
    return result.rows[0];
  }

  async updateSyncRecord(id: string, updates: any): Promise<any> {
    const result = await db.execute(
      sql`UPDATE execution_plan_sync_records SET
          external_project_id = COALESCE(${updates.externalProjectId}, external_project_id),
          external_project_url = COALESCE(${updates.externalProjectUrl}, external_project_url),
          external_project_key = COALESCE(${updates.externalProjectKey}, external_project_key),
          sync_status = COALESCE(${updates.syncStatus}, sync_status),
          last_synced_at = COALESCE(${updates.lastSyncedAt}, last_synced_at),
          last_sync_direction = COALESCE(${updates.lastSyncDirection}, last_sync_direction),
          sync_errors = COALESCE(${JSON.stringify(updates.syncErrors)}, sync_errors),
          task_sync_map = COALESCE(${JSON.stringify(updates.taskSyncMap)}, task_sync_map),
          tasks_created = COALESCE(${updates.tasksCreated}, tasks_created),
          tasks_synced = COALESCE(${updates.tasksSynced}, tasks_synced),
          last_error = COALESCE(${updates.lastError}, last_error),
          updated_at = NOW()
          WHERE id = ${id}
          RETURNING *`
    );
    return result.rows[0];
  }

  async deleteSyncRecord(id: string): Promise<void> {
    await db.execute(sql`DELETE FROM execution_plan_sync_records WHERE id = ${id}`);
  }

  // Extended Task Properties CRUD
  async getExtendedTaskProperties(taskId: string): Promise<any | null> {
    const result = await db.execute(sql`SELECT * FROM execution_plan_tasks_extended WHERE task_id = ${taskId}`);
    return result.rows[0] || null;
  }

  async upsertExtendedTaskProperties(props: any): Promise<any> {
    const result = await db.execute(
      sql`INSERT INTO execution_plan_tasks_extended 
          (task_id, external_id_prefix, acceptance_criteria, deliverables, subtasks,
           original_estimate_minutes, remaining_estimate_minutes, time_spent_minutes,
           labels, external_links, watcher_user_ids, initial_comments, custom_field_values)
          VALUES (${props.taskId}, ${props.externalIdPrefix}, ${JSON.stringify(props.acceptanceCriteria || [])},
                  ${JSON.stringify(props.deliverables || [])}, ${JSON.stringify(props.subtasks || [])},
                  ${props.originalEstimateMinutes}, ${props.remainingEstimateMinutes}, ${props.timeSpentMinutes || 0},
                  ${JSON.stringify(props.labels || [])}, ${JSON.stringify(props.externalLinks || [])},
                  ${JSON.stringify(props.watcherUserIds || [])}, ${JSON.stringify(props.initialComments || [])},
                  ${JSON.stringify(props.customFieldValues || {})})
          ON CONFLICT (task_id) DO UPDATE SET
          external_id_prefix = EXCLUDED.external_id_prefix,
          acceptance_criteria = EXCLUDED.acceptance_criteria,
          deliverables = EXCLUDED.deliverables,
          subtasks = EXCLUDED.subtasks,
          original_estimate_minutes = EXCLUDED.original_estimate_minutes,
          remaining_estimate_minutes = EXCLUDED.remaining_estimate_minutes,
          time_spent_minutes = EXCLUDED.time_spent_minutes,
          labels = EXCLUDED.labels,
          external_links = EXCLUDED.external_links,
          watcher_user_ids = EXCLUDED.watcher_user_ids,
          initial_comments = EXCLUDED.initial_comments,
          custom_field_values = EXCLUDED.custom_field_values,
          updated_at = NOW()
          RETURNING *`
    );
    return result.rows[0];
  }

  // Document Templates CRUD
  async getDocumentTemplates(organizationId?: string, playbookId?: string): Promise<any[]> {
    if (playbookId) {
      const result = await db.execute(
        sql`SELECT * FROM execution_document_templates 
            WHERE playbook_id = ${playbookId} AND is_active = true AND is_latest = true
            ORDER BY name`
      );
      return result.rows as any[];
    }
    if (organizationId) {
      const result = await db.execute(
        sql`SELECT * FROM execution_document_templates 
            WHERE organization_id = ${organizationId} AND is_active = true AND is_latest = true
            ORDER BY name`
      );
      return result.rows as any[];
    }
    const result = await db.execute(
      sql`SELECT * FROM execution_document_templates WHERE is_active = true AND is_latest = true ORDER BY name`
    );
    return result.rows as any[];
  }

  async getDocumentTemplate(id: string): Promise<any | null> {
    const result = await db.execute(sql`SELECT * FROM execution_document_templates WHERE id = ${id}`);
    return result.rows[0] || null;
  }

  async createDocumentTemplate(template: any): Promise<any> {
    const result = await db.execute(
      sql`INSERT INTO execution_document_templates 
          (id, organization_id, playbook_id, task_id, name, document_type, template_content,
           required_variables, output_formats, storage_integration, storage_path, requires_approval,
           approver_role_id, auto_generate_on_activation, auto_distribute, distribution_list,
           version, is_latest, is_active, created_by)
          VALUES (gen_random_uuid(), ${template.organizationId}, ${template.playbookId}, ${template.taskId},
                  ${template.name}, ${template.documentType}, ${template.templateContent},
                  ${JSON.stringify(template.requiredVariables || [])}, ${JSON.stringify(template.outputFormats || ['docx', 'pdf'])},
                  ${template.storageIntegration}, ${template.storagePath}, ${template.requiresApproval ?? false},
                  ${template.approverRoleId}, ${template.autoGenerateOnActivation ?? true},
                  ${template.autoDistribute ?? false}, ${JSON.stringify(template.distributionList || [])},
                  1, true, true, ${template.createdBy})
          RETURNING *`
    );
    return result.rows[0];
  }

  async updateDocumentTemplate(id: string, updates: any): Promise<any> {
    const result = await db.execute(
      sql`UPDATE execution_document_templates SET
          name = COALESCE(${updates.name}, name),
          template_content = COALESCE(${updates.templateContent}, template_content),
          required_variables = COALESCE(${JSON.stringify(updates.requiredVariables)}, required_variables),
          output_formats = COALESCE(${JSON.stringify(updates.outputFormats)}, output_formats),
          storage_integration = COALESCE(${updates.storageIntegration}, storage_integration),
          storage_path = COALESCE(${updates.storagePath}, storage_path),
          requires_approval = COALESCE(${updates.requiresApproval}, requires_approval),
          approver_role_id = COALESCE(${updates.approverRoleId}, approver_role_id),
          auto_generate_on_activation = COALESCE(${updates.autoGenerateOnActivation}, auto_generate_on_activation),
          auto_distribute = COALESCE(${updates.autoDistribute}, auto_distribute),
          distribution_list = COALESCE(${JSON.stringify(updates.distributionList)}, distribution_list),
          is_active = COALESCE(${updates.isActive}, is_active),
          updated_at = NOW()
          WHERE id = ${id}
          RETURNING *`
    );
    return result.rows[0];
  }

  async deleteDocumentTemplate(id: string): Promise<void> {
    await db.execute(sql`UPDATE execution_document_templates SET is_active = false WHERE id = ${id}`);
  }

  // Pre-Approved Resources CRUD
  async getPreApprovedResources(organizationId?: string, playbookId?: string): Promise<any[]> {
    if (playbookId) {
      const result = await db.execute(
        sql`SELECT * FROM execution_pre_approved_resources 
            WHERE playbook_id = ${playbookId} AND is_active = true
            ORDER BY resource_type, name`
      );
      return result.rows as any[];
    }
    if (organizationId) {
      const result = await db.execute(
        sql`SELECT * FROM execution_pre_approved_resources 
            WHERE organization_id = ${organizationId} AND is_active = true
            ORDER BY resource_type, name`
      );
      return result.rows as any[];
    }
    const result = await db.execute(
      sql`SELECT * FROM execution_pre_approved_resources WHERE is_active = true ORDER BY resource_type, name`
    );
    return result.rows as any[];
  }

  async getPreApprovedResource(id: string): Promise<any | null> {
    const result = await db.execute(sql`SELECT * FROM execution_pre_approved_resources WHERE id = ${id}`);
    return result.rows[0] || null;
  }

  async createPreApprovedResource(resource: any): Promise<any> {
    const result = await db.execute(
      sql`INSERT INTO execution_pre_approved_resources 
          (id, organization_id, playbook_id, task_id, resource_type, name, description,
           budget_amount, budget_currency, budget_account_code, budget_category,
           vendor_id, vendor_name, vendor_contact_info, contract_reference, master_service_agreement,
           personnel_roles, personnel_requirements, asset_inventory,
           approved_by, approved_at, approval_expires_at, approval_conditions, approval_document_url,
           renewal_required, renewal_period, next_renewal_date, is_active)
          VALUES (gen_random_uuid(), ${resource.organizationId}, ${resource.playbookId}, ${resource.taskId},
                  ${resource.resourceType}, ${resource.name}, ${resource.description},
                  ${resource.budgetAmount}, ${resource.budgetCurrency || 'USD'}, ${resource.budgetAccountCode},
                  ${resource.budgetCategory}, ${resource.vendorId}, ${resource.vendorName},
                  ${JSON.stringify(resource.vendorContactInfo || {})}, ${resource.contractReference},
                  ${resource.masterServiceAgreement}, ${JSON.stringify(resource.personnelRoles || [])},
                  ${JSON.stringify(resource.personnelRequirements || {})}, ${JSON.stringify(resource.assetInventory || [])},
                  ${resource.approvedBy}, ${resource.approvedAt}, ${resource.approvalExpiresAt},
                  ${resource.approvalConditions}, ${resource.approvalDocumentUrl},
                  ${resource.renewalRequired ?? false}, ${resource.renewalPeriod}, ${resource.nextRenewalDate}, true)
          RETURNING *`
    );
    return result.rows[0];
  }

  async updatePreApprovedResource(id: string, updates: any): Promise<any> {
    const result = await db.execute(
      sql`UPDATE execution_pre_approved_resources SET
          name = COALESCE(${updates.name}, name),
          description = COALESCE(${updates.description}, description),
          budget_amount = COALESCE(${updates.budgetAmount}, budget_amount),
          budget_currency = COALESCE(${updates.budgetCurrency}, budget_currency),
          budget_account_code = COALESCE(${updates.budgetAccountCode}, budget_account_code),
          budget_category = COALESCE(${updates.budgetCategory}, budget_category),
          vendor_id = COALESCE(${updates.vendorId}, vendor_id),
          vendor_name = COALESCE(${updates.vendorName}, vendor_name),
          vendor_contact_info = COALESCE(${JSON.stringify(updates.vendorContactInfo)}, vendor_contact_info),
          contract_reference = COALESCE(${updates.contractReference}, contract_reference),
          master_service_agreement = COALESCE(${updates.masterServiceAgreement}, master_service_agreement),
          personnel_roles = COALESCE(${JSON.stringify(updates.personnelRoles)}, personnel_roles),
          personnel_requirements = COALESCE(${JSON.stringify(updates.personnelRequirements)}, personnel_requirements),
          asset_inventory = COALESCE(${JSON.stringify(updates.assetInventory)}, asset_inventory),
          approved_by = COALESCE(${updates.approvedBy}, approved_by),
          approved_at = COALESCE(${updates.approvedAt}, approved_at),
          approval_expires_at = COALESCE(${updates.approvalExpiresAt}, approval_expires_at),
          approval_conditions = COALESCE(${updates.approvalConditions}, approval_conditions),
          approval_document_url = COALESCE(${updates.approvalDocumentUrl}, approval_document_url),
          last_activated_at = COALESCE(${updates.lastActivatedAt}, last_activated_at),
          activation_count = COALESCE(${updates.activationCount}, activation_count),
          total_spent = COALESCE(${updates.totalSpent}, total_spent),
          renewal_required = COALESCE(${updates.renewalRequired}, renewal_required),
          renewal_period = COALESCE(${updates.renewalPeriod}, renewal_period),
          next_renewal_date = COALESCE(${updates.nextRenewalDate}, next_renewal_date),
          is_active = COALESCE(${updates.isActive}, is_active),
          updated_at = NOW()
          WHERE id = ${id}
          RETURNING *`
    );
    return result.rows[0];
  }

  async deletePreApprovedResource(id: string): Promise<void> {
    await db.execute(sql`UPDATE execution_pre_approved_resources SET is_active = false WHERE id = ${id}`);
  }

  async activatePreApprovedResource(id: string): Promise<any> {
    const result = await db.execute(
      sql`UPDATE execution_pre_approved_resources SET
          last_activated_at = NOW(),
          activation_count = activation_count + 1,
          updated_at = NOW()
          WHERE id = ${id}
          RETURNING *`
    );
    return result.rows[0];
  }

  // Generated Documents CRUD
  async getGeneratedDocuments(executionInstanceId?: string, templateId?: string): Promise<any[]> {
    if (executionInstanceId) {
      const result = await db.execute(
        sql`SELECT gd.*, dt.name as template_name 
            FROM execution_generated_documents gd
            JOIN execution_document_templates dt ON gd.template_id = dt.id
            WHERE gd.execution_instance_id = ${executionInstanceId}
            ORDER BY gd.created_at DESC`
      );
      return result.rows as any[];
    }
    if (templateId) {
      const result = await db.execute(
        sql`SELECT gd.*, dt.name as template_name 
            FROM execution_generated_documents gd
            JOIN execution_document_templates dt ON gd.template_id = dt.id
            WHERE gd.template_id = ${templateId}
            ORDER BY gd.created_at DESC`
      );
      return result.rows as any[];
    }
    const result = await db.execute(
      sql`SELECT gd.*, dt.name as template_name 
          FROM execution_generated_documents gd
          JOIN execution_document_templates dt ON gd.template_id = dt.id
          ORDER BY gd.created_at DESC
          LIMIT 100`
    );
    return result.rows as any[];
  }

  async getGeneratedDocument(id: string): Promise<any | null> {
    const result = await db.execute(sql`SELECT * FROM execution_generated_documents WHERE id = ${id}`);
    return result.rows[0] || null;
  }

  async createGeneratedDocument(doc: any): Promise<any> {
    const result = await db.execute(
      sql`INSERT INTO execution_generated_documents 
          (id, template_id, execution_instance_id, name, document_type, generated_content,
           variables_used, file_url, file_format, file_size, external_storage_id,
           approval_status, generated_by)
          VALUES (gen_random_uuid(), ${doc.templateId}, ${doc.executionInstanceId}, ${doc.name},
                  ${doc.documentType}, ${doc.generatedContent}, ${JSON.stringify(doc.variablesUsed || {})},
                  ${doc.fileUrl}, ${doc.fileFormat}, ${doc.fileSize}, ${doc.externalStorageId},
                  'pending', ${doc.generatedBy})
          RETURNING *`
    );
    return result.rows[0];
  }

  async updateGeneratedDocument(id: string, updates: any): Promise<any> {
    const result = await db.execute(
      sql`UPDATE execution_generated_documents SET
          generated_content = COALESCE(${updates.generatedContent}, generated_content),
          file_url = COALESCE(${updates.fileUrl}, file_url),
          file_format = COALESCE(${updates.fileFormat}, file_format),
          file_size = COALESCE(${updates.fileSize}, file_size),
          external_storage_id = COALESCE(${updates.externalStorageId}, external_storage_id),
          approval_status = COALESCE(${updates.approvalStatus}, approval_status),
          approved_by = COALESCE(${updates.approvedBy}, approved_by),
          approved_at = COALESCE(${updates.approvedAt}, approved_at),
          rejection_reason = COALESCE(${updates.rejectionReason}, rejection_reason),
          distributed_at = COALESCE(${updates.distributedAt}, distributed_at),
          distribution_recipients = COALESCE(${JSON.stringify(updates.distributionRecipients)}, distribution_recipients)
          WHERE id = ${id}
          RETURNING *`
    );
    return result.rows[0];
  }

  async approveGeneratedDocument(id: string, approvedBy: string): Promise<any> {
    const result = await db.execute(
      sql`UPDATE execution_generated_documents SET
          approval_status = 'approved',
          approved_by = ${approvedBy},
          approved_at = NOW()
          WHERE id = ${id}
          RETURNING *`
    );
    return result.rows[0];
  }

  async rejectGeneratedDocument(id: string, reason: string): Promise<any> {
    const result = await db.execute(
      sql`UPDATE execution_generated_documents SET
          approval_status = 'rejected',
          rejection_reason = ${reason}
          WHERE id = ${id}
          RETURNING *`
    );
    return result.rows[0];
  }

  // Enterprise Integrations CRUD (with credential encryption)
  private normalizeConfig(config: any): Record<string, any> {
    if (!config) return {};
    if (typeof config === 'string') {
      try {
        return JSON.parse(config);
      } catch {
        return {};
      }
    }
    return config;
  }
  
  private encryptIntegrationConfig(config: any): any {
    const { credentialEncryption } = require('./services/CredentialEncryptionService');
    const normalizedConfig = this.normalizeConfig(config);
    return credentialEncryption.encryptIntegrationConfig(normalizedConfig);
  }
  
  private decryptIntegrationConfig(config: any): any {
    const { credentialEncryption } = require('./services/CredentialEncryptionService');
    const normalizedConfig = this.normalizeConfig(config);
    return credentialEncryption.decryptIntegrationConfig(normalizedConfig);
  }
  
  private processIntegrationForRead(integration: any): any {
    if (!integration) return null;
    const result = JSON.parse(JSON.stringify(integration));
    if (result.configuration) {
      try {
        result.configuration = this.decryptIntegrationConfig(result.configuration);
      } catch (e) {
        console.warn('Failed to decrypt integration config:', e);
      }
    }
    return result;
  }

  async getEnterpriseIntegrations(organizationId?: string): Promise<any[]> {
    if (organizationId) {
      const result = await db.execute(
        sql`SELECT * FROM enterprise_integrations WHERE organization_id = ${organizationId} ORDER BY name`
      );
      return (result.rows as any[]).map(row => this.processIntegrationForRead(row));
    }
    const result = await db.execute(sql`SELECT * FROM enterprise_integrations ORDER BY name`);
    return (result.rows as any[]).map(row => this.processIntegrationForRead(row));
  }

  async getEnterpriseIntegration(id: string): Promise<any | null> {
    const result = await db.execute(sql`SELECT * FROM enterprise_integrations WHERE id = ${id}`);
    return this.processIntegrationForRead(result.rows[0]);
  }

  async getEnterpriseIntegrationByVendor(organizationId: string, vendor: string): Promise<any | null> {
    const result = await db.execute(
      sql`SELECT * FROM enterprise_integrations WHERE organization_id = ${organizationId} AND vendor = ${vendor} LIMIT 1`
    );
    return this.processIntegrationForRead(result.rows[0]);
  }

  async createEnterpriseIntegration(integration: any): Promise<any> {
    const encryptedConfig = this.encryptIntegrationConfig(integration.configuration || {});
    const result = await db.execute(
      sql`INSERT INTO enterprise_integrations 
          (id, organization_id, name, integration_type, vendor, status, configuration, data_mapping,
           sync_frequency, api_endpoint, webhook_url, authentication_type, metadata, installed_by)
          VALUES (gen_random_uuid(), ${integration.organizationId}, ${integration.name},
                  ${integration.integrationType}, ${integration.vendor}, ${integration.status || 'pending'},
                  ${JSON.stringify(encryptedConfig)}, ${JSON.stringify(integration.dataMapping || {})},
                  ${integration.syncFrequency || 'realtime'}, ${integration.apiEndpoint}, ${integration.webhookUrl},
                  ${integration.authenticationType}, ${JSON.stringify(integration.metadata || {})}, ${integration.installedBy})
          RETURNING *`
    );
    return this.processIntegrationForRead(result.rows[0]);
  }

  async updateEnterpriseIntegration(id: string, updates: any): Promise<any> {
    let encryptedConfig = null;
    if (updates.configuration) {
      encryptedConfig = JSON.stringify(this.encryptIntegrationConfig(updates.configuration));
    }
    
    const result = await db.execute(
      sql`UPDATE enterprise_integrations SET
          name = COALESCE(${updates.name}, name),
          status = COALESCE(${updates.status}, status),
          configuration = COALESCE(${encryptedConfig}, configuration),
          data_mapping = COALESCE(${JSON.stringify(updates.dataMapping)}, data_mapping),
          sync_frequency = COALESCE(${updates.syncFrequency}, sync_frequency),
          last_sync_at = COALESCE(${updates.lastSyncAt}, last_sync_at),
          next_sync_at = COALESCE(${updates.nextSyncAt}, next_sync_at),
          error_log = COALESCE(${JSON.stringify(updates.errorLog)}, error_log),
          api_endpoint = COALESCE(${updates.apiEndpoint}, api_endpoint),
          webhook_url = COALESCE(${updates.webhookUrl}, webhook_url),
          authentication_type = COALESCE(${updates.authenticationType}, authentication_type),
          metadata = COALESCE(${JSON.stringify(updates.metadata)}, metadata),
          updated_at = NOW()
          WHERE id = ${id}
          RETURNING *`
    );
    return this.processIntegrationForRead(result.rows[0]);
  }

  async deleteEnterpriseIntegration(id: string): Promise<void> {
    await db.execute(sql`DELETE FROM enterprise_integrations WHERE id = ${id}`);
  }
}

export const storage = new DatabaseStorage();
