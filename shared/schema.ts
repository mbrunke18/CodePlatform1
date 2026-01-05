import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  uuid,
  primaryKey,
  integer,
  decimal,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// PostgreSQL Enums for better data integrity
export const organizationTypeEnum = pgEnum('organization_type', ['enterprise', 'mid-market', 'startup', 'government', 'non-profit']);
export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high', 'critical']);
export const statusEnum = pgEnum('status', ['draft', 'active', 'paused', 'completed', 'archived']);
export const riskLevelEnum = pgEnum('risk_level', ['minimal', 'low', 'moderate', 'high', 'severe']);
export const outcomeTypeEnum = pgEnum('outcome_type', ['successful', 'partially_successful', 'failed', 'cancelled', 'ongoing']);
export const effectivenessEnum = pgEnum('effectiveness', ['low', 'moderate', 'high', 'excellent']);
export const confidenceEnum = pgEnum('confidence', ['low', 'medium', 'high', 'very_high']);
export const alertTypeEnum = pgEnum('alert_type', ['opportunity', 'risk', 'competitive_threat', 'market_shift', 'regulatory_change']);
export const insightTypeEnum = pgEnum('insight_type', ['synthetic_scenario', 'trend_analysis', 'risk_prediction', 'opportunity_forecast']);
export const actionStatusEnum = pgEnum('action_status', ['pending', 'in_progress', 'completed', 'failed', 'cancelled']);
export const deploymentStatusEnum = pgEnum('deployment_status', ['planning', 'in_progress', 'completed', 'failed', 'rollback']);
export const integrationStatusEnum = pgEnum('integration_status', ['active', 'inactive', 'error', 'pending']);
export const simulationStatusEnum = pgEnum('simulation_status', ['draft', 'scheduled', 'running', 'completed', 'cancelled']);
export const complianceStatusEnum = pgEnum('compliance_status', ['compliant', 'non_compliant', 'under_review', 'exception_granted']);
export const jobStatusEnum = pgEnum('job_status', ['pending', 'processing', 'completed', 'failed', 'cancelled']);
export const executionPhaseEnum = pgEnum('execution_phase', ['immediate', 'secondary', 'follow_up']);
export const executionInstanceStatusEnum = pgEnum('execution_instance_status', ['pending', 'running', 'completed', 'failed', 'cancelled']);
export const executionTaskStatusEnum = pgEnum('execution_task_status', ['pending', 'blocked', 'ready', 'in_progress', 'completed', 'failed', 'skipped']);

// Strategic Category Enum for OFFENSE/DEFENSE/SPECIAL TEAMS marketing taxonomy
export const strategicCategoryEnum = pgEnum('strategic_category', ['offense', 'defense', 'special_teams']);

// 4-Phase Playbook Lifecycle Enums
export const playbookPhaseEnum = pgEnum('playbook_phase', ['prepare', 'monitor', 'execute', 'learn']);
export const executeSubphaseEnum = pgEnum('execute_subphase', ['respond', 'coordinate', 'stabilize', 'close']);
export const prepareItemStatusEnum = pgEnum('prepare_item_status', ['not_started', 'in_progress', 'completed', 'needs_review', 'blocked']);
export const learnItemTypeEnum = pgEnum('learn_item_type', ['debrief_meeting', 'survey', 'metrics_review', 'documentation', 'playbook_update', 'training_update', 'process_improvement']);

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Enhanced User Management with enterprise features
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  organizationId: uuid("organization_id"),
  businessUnitId: uuid('business_unit_id'),
  roleId: uuid('role_id'),
  department: varchar("department", { length: 100 }),
  team: varchar("team", { length: 100 }),
  managerId: varchar("manager_id"),
  hoursPerWeek: integer("hours_per_week").default(40),
  skills: jsonb("skills"), // Array of skill objects with proficiency levels
  certifications: jsonb("certifications"),
  plannedLeave: jsonb("planned_leave"), // Array of leave periods
  timezone: varchar("timezone", { length: 100 }), // User timezone for predictive execution
  accessLevel: varchar('access_level', { length: 50 }).default('basic'),
  scopes: jsonb('scopes'), // Array of data scopes (org, business unit, team)
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Enhanced Organizations with enterprise intelligence features
export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  ownerId: varchar('owner_id').notNull(),
  domain: varchar("domain", { length: 100 }),
  type: organizationTypeEnum("type").default('enterprise'),
  size: integer("size"), // Employee count
  industry: varchar("industry", { length: 100 }),
  headquarters: varchar("headquarters", { length: 255 }),
  adaptabilityScore: varchar("adaptability_score").default('stable'),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  subscriptionTier: varchar("subscription_tier").default('basic'),
  status: varchar('status', { length: 50 }).default('Active'),
  settings: jsonb('settings'),
  taxonomy: jsonb('taxonomy'), // Standardized tags for filtering
  dataRetentionPolicy: jsonb('data_retention_policy'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Business Units for enhanced RBAC scoping
export const businessUnits = pgTable('business_units', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  parentUnitId: uuid('parent_unit_id'), // Self-referencing for hierarchy
  leaderId: varchar('leader_id'),
  businessFunction: varchar('business_function', { length: 100 }),
  budget: decimal('budget', { precision: 12, scale: 2 }),
  headcount: integer('headcount'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Enhanced Strategic scenarios with adaptive intelligence
export const strategicScenarios = pgTable('strategic_scenarios', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(), // Added for enhanced features
  title: varchar('title', { length: 255 }).notNull(), // Keep for compatibility
  description: text('description'),
  type: varchar("type", { length: 100 }), // Supply chain, market, regulatory, etc.
  industry: varchar("industry", { length: 100 }), // financial_services, manufacturing, healthcare, retail, technology, energy, etc.
  isTemplate: boolean("is_template").default(false), // Industry template vs custom playbook
  templateCategory: varchar("template_category", { length: 100 }), // For organizing industry templates
  likelihood: decimal("likelihood", { precision: 3, scale: 2 }), // 0.00 to 1.00
  impact: riskLevelEnum("impact").default('low'),
  triggerConditions: jsonb("trigger_conditions"), // Complex condition definitions
  responseStrategy: jsonb("response_strategy"), // Adaptive response plans
  status: varchar('status', { length: 50 }).default('draft'), // Keep as varchar for compatibility
  lastTriggered: timestamp("last_triggered"),
  
  // NFL-Style Playbook Readiness Fields
  lastDrillDate: timestamp("last_drill_date"), // When was this playbook last practiced?
  approvalStatus: varchar('approval_status', { length: 50 }).default('pending'), // 'approved', 'pending', 'needs_review'
  approvedBy: varchar('approved_by').references(() => users.id), // Who approved this playbook?
  approvedAt: timestamp('approved_at'), // When was it approved?
  automationCoverage: decimal('automation_coverage', { precision: 3, scale: 2 }), // 0.00 to 1.00 (percentage automated)
  readinessState: varchar('readiness_state', { length: 20 }).default('yellow'), // 'green' (ready now), 'yellow' (needs review), 'red' (requires setup)
  averageExecutionTime: integer('average_execution_time'), // Average time to execute in minutes
  executionCount: integer('execution_count').default(0), // How many times has this been executed?
  
  createdBy: varchar('created_by').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================================================
// EXECUTION PLAN SYSTEM - Work Breakdown Structure for Trigger-Activated Plans
// ============================================================================

// Scenario Execution Plans - Master template for trigger-activated execution
export const scenarioExecutionPlans = pgTable('scenario_execution_plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  scenarioId: uuid('scenario_id').references(() => strategicScenarios.id, { onDelete: 'cascade' }).notNull(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  targetExecutionTime: integer('target_execution_time').default(12), // Target minutes for full execution
  isActive: boolean('is_active').default(true),
  version: integer('version').default(1),
  createdBy: varchar('created_by').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Execution Plan Phases - IMMEDIATE (0-2min), SECONDARY (2-5min), FOLLOW_UP (5-12min)
export const executionPlanPhases = pgTable('execution_plan_phases', {
  id: uuid('id').primaryKey().defaultRandom(),
  executionPlanId: uuid('execution_plan_id').references(() => scenarioExecutionPlans.id, { onDelete: 'cascade' }).notNull(),
  phase: executionPhaseEnum('phase').notNull(), // immediate, secondary, follow_up
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  sequence: integer('sequence').notNull(), // 1, 2, 3
  startMinute: integer('start_minute').default(0), // When this phase starts (0, 2, 5)
  endMinute: integer('end_minute').default(2), // When this phase ends (2, 5, 12)
  createdAt: timestamp('created_at').defaultNow(),
});

// Execution Plan Tasks - WHO (role), WHAT (task), WHEN (sequence), SLA
export const executionPlanTasks = pgTable('execution_plan_tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  phaseId: uuid('phase_id').references(() => executionPlanPhases.id, { onDelete: 'cascade' }).notNull(),
  executionPlanId: uuid('execution_plan_id').references(() => scenarioExecutionPlans.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  sequence: integer('sequence').notNull(), // Order within phase: 1, 2, 3...
  
  // Role-based assignment (template)
  requiredRoleId: uuid('required_role_id').references(() => roles.id), // CFO, Legal, Operations role
  requiredRoleLabel: varchar('required_role_label', { length: 100 }), // Fallback: "CFO", "Legal" if role doesn't exist
  
  // Optional specific user assignment
  assignedUserId: varchar('assigned_user_id').references(() => users.id),
  
  // Task properties
  estimatedMinutes: integer('estimated_minutes').default(2),
  slaMinutes: integer('sla_minutes'), // Must complete within X minutes
  priority: priorityEnum('priority').default('high'),
  isRequired: boolean('is_required').default(true),
  isAutomated: boolean('is_automated').default(false),
  automationConfig: jsonb('automation_config'), // Webhook, API call, etc.
  
  // Parallel execution support
  isParallel: boolean('is_parallel').default(true), // Can run simultaneously with other parallel tasks in same phase
  parallelGroupId: varchar('parallel_group_id', { length: 100 }), // Group ID for tasks that execute together
  
  // Compliance governance
  complianceControlIds: jsonb('compliance_control_ids'), // Array of compliance control IDs for embedded governance
  
  // Readiness checks
  readinessChecks: jsonb('readiness_checks'), // Pre-conditions that must be true
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Execution Task Dependencies - "Task B can't start until Task A completes"
export const executionTaskDependencies = pgTable('execution_task_dependencies', {
  id: uuid('id').primaryKey().defaultRandom(),
  taskId: uuid('task_id').references(() => executionPlanTasks.id, { onDelete: 'cascade' }).notNull(), // The dependent task
  dependsOnTaskId: uuid('depends_on_task_id').references(() => executionPlanTasks.id, { onDelete: 'cascade' }).notNull(), // The prerequisite task
  dependencyType: varchar('dependency_type', { length: 50 }).default('prerequisite'), // prerequisite, blocker, optional
  createdAt: timestamp('created_at').defaultNow(),
});

// Execution Checkpoints - Validation gates that must pass before proceeding
export const executionCheckpoints = pgTable('execution_checkpoints', {
  id: uuid('id').primaryKey().defaultRandom(),
  executionPlanId: uuid('execution_plan_id').references(() => scenarioExecutionPlans.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  phaseId: uuid('phase_id').references(() => executionPlanPhases.id, { onDelete: 'cascade' }),
  sequence: integer('sequence').notNull(), // Order within phase
  requiredTaskIds: jsonb('required_task_ids').notNull().default([]), // Tasks that must complete
  validationRules: jsonb('validation_rules'), // Custom validation logic
  approverRoleId: uuid('approver_role_id').references(() => roles.id),
  isRequired: boolean('is_required').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// Document Templates - Pre-written templates with merge fields for auto-population
export const documentTemplates = pgTable('document_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }), // breach_disclosure, regulatory_filing, stakeholder_comm
  domain: varchar('domain', { length: 100 }), // crisis, compliance, m_and_a
  templateContent: text('template_content').notNull(), // Content with {{variable}} placeholders
  mergeFields: jsonb('merge_fields').notNull().default([]), // List of available merge fields
  format: varchar('format', { length: 50 }).default('markdown'), // markdown, html, plain
  isActive: boolean('is_active').default(true),
  version: integer('version').default(1),
  createdBy: varchar('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Link tasks to document templates for auto-population
export const taskDocumentTemplates = pgTable('task_document_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  planTaskId: uuid('plan_task_id').references(() => executionPlanTasks.id, { onDelete: 'cascade' }).notNull(),
  documentTemplateId: uuid('document_template_id').references(() => documentTemplates.id, { onDelete: 'cascade' }).notNull(),
  isRequired: boolean('is_required').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// Checkpoint Validations - Runtime tracking of checkpoint passage
export const checkpointValidations = pgTable('checkpoint_validations', {
  id: uuid('id').primaryKey().defaultRandom(),
  executionInstanceId: uuid('execution_instance_id').references(() => executionInstances.id, { onDelete: 'cascade' }).notNull(),
  checkpointId: uuid('checkpoint_id').references(() => executionCheckpoints.id).notNull(),
  status: varchar('status', { length: 50 }).default('pending'), // pending, passed, failed, bypassed
  validatedBy: varchar('validated_by').references(() => users.id),
  validatedAt: timestamp('validated_at'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Execution Instances - Runtime tracking when a trigger fires and plan activates
export const executionInstances = pgTable('execution_instances', {
  id: uuid('id').primaryKey().defaultRandom(),
  executionPlanId: uuid('execution_plan_id').references(() => scenarioExecutionPlans.id).notNull(),
  scenarioId: uuid('scenario_id').references(() => strategicScenarios.id).notNull(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  
  // Trigger information
  triggeredBy: varchar('triggered_by').references(() => users.id), // Who/what triggered it
  triggerEventId: uuid('trigger_event_id'), // Reference to the trigger event
  triggerData: jsonb('trigger_data'), // Context data from trigger
  
  // Execution status
  status: executionInstanceStatusEnum('status').default('pending'),
  currentPhase: executionPhaseEnum('current_phase'),
  
  // Timing
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  actualExecutionTime: integer('actual_execution_time'), // Actual minutes taken
  
  // Results
  outcome: varchar('outcome', { length: 50 }), // successful, partially_successful, failed
  outcomeNotes: text('outcome_notes'),
  lessonsLearned: text('lessons_learned'), // For institutional memory
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Execution Instance Tasks - Live task tracking during execution
export const executionInstanceTasks = pgTable('execution_instance_tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  executionInstanceId: uuid('execution_instance_id').references(() => executionInstances.id, { onDelete: 'cascade' }).notNull(),
  planTaskId: uuid('plan_task_id').references(() => executionPlanTasks.id).notNull(), // Reference to template task
  
  // Runtime assignment
  assignedUserId: varchar('assigned_user_id').references(() => users.id),
  assignedRoleId: uuid('assigned_role_id').references(() => roles.id),
  
  // Status tracking
  status: executionTaskStatusEnum('status').default('pending'), // pending, blocked, ready, in_progress, completed, failed, skipped
  blockedReason: text('blocked_reason'),
  
  // Timing
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  actualMinutes: integer('actual_minutes'),
  
  // Results
  outcome: text('outcome'),
  notes: text('notes'),
  attachments: jsonb('attachments'),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Enhanced Tasks with proper enum types
export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  scenarioId: uuid('scenario_id').references(() => strategicScenarios.id).notNull(),
  description: text('description').notNull(),
  priority: varchar('priority', { length: 50 }).default('medium'), // Keep as varchar for compatibility
  status: varchar('status', { length: 50 }).default('draft'), // Keep as varchar for compatibility
  assignedTo: varchar('assigned_to').references(() => users.id),
  estimatedHours: decimal('estimated_hours', { precision: 5, scale: 2 }),
  actualHours: decimal('actual_hours', { precision: 5, scale: 2 }),
  completed: timestamp('completed'),
  dueDate: timestamp('due_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Enhanced RBAC Tables
export const roles = pgTable('roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id),
  name: varchar('name', { length: 50 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 50 }).default('custom'), // system, executive, strategy, analyst
  level: integer('level').default(1), // Hierarchy level for role comparison
  isSystemRole: boolean('is_system_role').default(false),
  capabilities: jsonb('capabilities'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const permissions = pgTable('permissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  resource: varchar('resource', { length: 50 }).notNull(),
  action: varchar('action', { length: 50 }).notNull(),
  scope: varchar('scope', { length: 50 }).default('organization'), // organization, business_unit, team, own
  description: text('description'),
  category: varchar('category', { length: 50 }), // data, workflow, admin, executive
});

export const rolePermissions = pgTable('role_permissions', {
    roleId: uuid('role_id').references(() => roles.id, { onDelete: 'cascade' }).notNull(),
    permissionId: uuid('permission_id').references(() => permissions.id, { onDelete: 'cascade' }).notNull(),
  }, (table) => {
    return {
      pk: primaryKey({ columns: [table.roleId, table.permissionId] }),
    }
  }
);

export const activities = pgTable('activities', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: varchar('user_id').references(() => users.id).notNull(),
  action: varchar('action', { length: 255 }).notNull(),
  entityType: varchar('entity_type', { length: 50 }),
  entityId: varchar('entity_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Enhanced Projects with full lifecycle management
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  objective: text("objective"),
  methodology: varchar("methodology", { length: 50 }), // Agile, Waterfall, Lean, etc.
  priority: varchar("priority", { length: 20 }).default("medium"), // Keep as varchar for compatibility
  status: varchar("status", { length: 50 }).default("draft"), // Keep as varchar for compatibility
  progress: decimal("progress", { precision: 3, scale: 2 }).default('0.00'), // 0.00 to 1.00
  budget: decimal("budget", { precision: 12, scale: 2 }),
  actualCost: decimal("actual_cost", { precision: 12, scale: 2 }).default('0.00'),
  startDate: timestamp("start_date"),
  targetDate: timestamp("target_date"),
  endDate: timestamp("end_date"), // Keep for compatibility
  completedDate: timestamp("completed_date"),
  riskLevel: riskLevelEnum("risk_level").default('low'),
  teamSize: integer("team_size"),
  leadId: varchar("lead_id").references(() => users.id),
  stakeholders: jsonb("stakeholders"), // Array of user IDs and external contacts
  metrics: jsonb("metrics"), // Project-specific KPIs
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Pulse metrics table
export const pulseMetrics = pgTable("pulse_metrics", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id),
  metricName: varchar("metric_name", { length: 255 }).notNull(),
  value: decimal("value", { precision: 15, scale: 4 }),
  unit: varchar("unit", { length: 50 }),
  category: varchar("category", { length: 100 }),
  timestamp: timestamp("timestamp").defaultNow(),
  metadata: jsonb("metadata"),
});

// Flux adaptations table
export const fluxAdaptations = pgTable("flux_adaptations", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id),
  scenarioId: uuid("scenario_id").references(() => strategicScenarios.id),
  adaptationType: varchar("adaptation_type", { length: 100 }).notNull(),
  description: text("description"),
  implementation: jsonb("implementation"),
  effectiveness: decimal("effectiveness", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Prism insights table
export const prismInsights = pgTable("prism_insights", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id),
  insightType: varchar("insight_type", { length: 100 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  confidence: decimal("confidence", { precision: 5, scale: 2 }),
  sources: jsonb("sources"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Echo cultural metrics table
export const echoCulturalMetrics = pgTable("echo_cultural_metrics", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id),
  dimension: varchar("dimension", { length: 100 }).notNull(),
  score: decimal("score", { precision: 5, scale: 2 }),
  trend: varchar("trend", { length: 20 }),
  factors: jsonb("factors"),
  recommendations: jsonb("recommendations"),
  assessmentDate: timestamp("assessment_date").defaultNow(),
});

// Nova innovations table
export const novaInnovations = pgTable("nova_innovations", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  stage: varchar("stage", { length: 50 }),
  potential: varchar("potential", { length: 20 }),
  resources: jsonb("resources"),
  timeline: jsonb("timeline"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Intelligence reports table
export const intelligenceReports = pgTable("intelligence_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id),
  reportType: varchar("report_type", { length: 100 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  executiveSummary: text("executive_summary"),
  findings: jsonb("findings"),
  recommendations: jsonb("recommendations"),
  confidence: decimal("confidence", { precision: 5, scale: 2 }),
  generatedAt: timestamp("generated_at").defaultNow(),
});

// Module usage analytics table
export const moduleUsageAnalytics = pgTable("module_usage_analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id),
  moduleName: varchar("module_name", { length: 100 }).notNull(),
  action: varchar("action", { length: 100 }).notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  metadata: jsonb("metadata"),
  userId: varchar("user_id"),
});

// Canonical Entities for Strategic Intelligence (Must come before relations)

// Risk Management
export const risks = pgTable('risks', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull(),
  scenarioId: uuid('scenario_id'),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  category: varchar('category', { length: 100 }), // operational, financial, strategic, regulatory
  severity: riskLevelEnum('severity').default('low'),
  probability: decimal('probability', { precision: 3, scale: 2 }), // 0.00 to 1.00
  impact: decimal('impact', { precision: 10, scale: 2 }),
  riskOwner: varchar('risk_owner'),
  mitigationStrategy: jsonb('mitigation_strategy'),
  contingencyPlan: jsonb('contingency_plan'),
  status: varchar('status', { length: 50 }).default('identified'),
  reviewDate: timestamp('review_date'),
  tags: jsonb('tags'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Strategic Initiatives  
export const initiatives = pgTable('initiatives', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull(),
  scenarioId: uuid('scenario_id'),
  businessUnitId: uuid('business_unit_id'),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  objective: text('objective'),
  priority: priorityEnum('priority').default('medium'),
  status: varchar('status', { length: 50 }).default('draft'),
  sponsor: varchar('sponsor'),
  owner: varchar('owner').notNull(),
  budget: decimal('budget', { precision: 12, scale: 2 }),
  timeline: jsonb('timeline'),
  milestones: jsonb('milestones'),
  dependencies: jsonb('dependencies'),
  outcomes: jsonb('outcomes'),
  tags: jsonb('tags'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// KPI Framework
export const kpis = pgTable('kpis', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull(),
  businessUnitId: uuid('business_unit_id'),
  initiativeId: uuid('initiative_id'),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 100 }), // financial, operational, customer, learning
  unit: varchar('unit', { length: 50 }),
  target: decimal('target', { precision: 15, scale: 4 }),
  threshold: decimal('threshold', { precision: 15, scale: 4 }),
  currentValue: decimal('current_value', { precision: 15, scale: 4 }),
  owner: varchar('owner'),
  dataSource: varchar('data_source', { length: 255 }),
  frequency: varchar('frequency', { length: 50 }), // daily, weekly, monthly, quarterly
  isActive: boolean('is_active').default(true),
  tags: jsonb('tags'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// AI-Generated Insights
export const insights = pgTable('insights', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull(),
  scenarioId: uuid('scenario_id'),
  initiativeId: uuid('initiative_id'),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  type: insightTypeEnum('type').notNull(),
  confidence: confidenceEnum('confidence').default('medium'),
  module: varchar('module', { length: 50 }), // pulse, flux, prism, echo, nova
  evidenceIds: jsonb('evidence_ids'), // References to supporting evidence
  tags: jsonb('tags'),
  impact: varchar('impact', { length: 50 }), // low, medium, high, critical
  urgency: varchar('urgency', { length: 50 }), // low, medium, high, immediate
  stakeholders: jsonb('stakeholders'),
  isValid: boolean('is_valid').default(true),
  validatedBy: varchar('validated_by'),
  validatedAt: timestamp('validated_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Actionable Recommendations
export const recommendations = pgTable('recommendations', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull(),
  insightId: uuid('insight_id'),
  scenarioId: uuid('scenario_id'),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  rationale: text('rationale'),
  priority: priorityEnum('priority').default('medium'),
  effort: varchar('effort', { length: 50 }), // low, medium, high
  timeframe: varchar('timeframe', { length: 50 }), // immediate, short, medium, long
  expectedImpact: text('expected_impact'),
  riskLevel: riskLevelEnum('risk_level').default('low'),
  prerequisites: jsonb('prerequisites'),
  resources: jsonb('resources'),
  assignedTo: varchar('assigned_to'),
  status: varchar('status', { length: 50 }).default('pending'),
  implementationPlan: jsonb('implementation_plan'),
  tags: jsonb('tags'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Evidence and Data Sources
export const evidence = pgTable('evidence', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  type: varchar('type', { length: 100 }), // document, data, analysis, report, observation
  source: varchar('source', { length: 255 }),
  url: varchar('url', { length: 500 }),
  content: jsonb('content'),
  metadata: jsonb('metadata'),
  quality: varchar('quality', { length: 50 }).default('medium'), // low, medium, high
  reliability: varchar('reliability', { length: 50 }).default('medium'),
  createdBy: varchar('created_by'),
  tags: jsonb('tags'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Action Items with governance
export const actionItems = pgTable('action_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull(),
  recommendationId: uuid('recommendation_id'),
  initiativeId: uuid('initiative_id'),
  scenarioId: uuid('scenario_id'),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  priority: priorityEnum('priority').default('medium'),
  status: actionStatusEnum('status').default('pending'),
  assignedTo: varchar('assigned_to').notNull(),
  assignedBy: varchar('assigned_by'),
  dueDate: timestamp('due_date'),
  completedAt: timestamp('completed_at'),
  estimatedEffort: integer('estimated_effort'), // hours
  actualEffort: integer('actual_effort'), // hours
  dependencies: jsonb('dependencies'),
  approvals: jsonb('approvals'),
  outcome: text('outcome'),
  tags: jsonb('tags'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Decision Workflows and Governance
export const workflowTemplates = pgTable('workflow_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 100 }),
  phases: jsonb('phases'),
  approvalMatrix: jsonb('approval_matrix'), // RACI matrix
  slaRequirements: jsonb('sla_requirements'),
  escalationRules: jsonb('escalation_rules'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Notification System
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull(),
  userId: varchar('user_id').notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  priority: priorityEnum('priority').default('medium'),
  entityType: varchar('entity_type', { length: 50 }),
  entityId: uuid('entity_id'),
  isRead: boolean('is_read').default(false),
  readAt: timestamp('read_at'),
  scheduledFor: timestamp('scheduled_for'),
  sentAt: timestamp('sent_at'),
  channels: jsonb('channels'), // email, slack, teams, sms
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Approval Tokens - Secure magic link approvals for zero-click executive experience
export const approvalTokens = pgTable('approval_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  executionInstanceId: uuid('execution_instance_id').references(() => executionInstances.id, { onDelete: 'cascade' }).notNull(),
  decisionNodeId: uuid('decision_node_id'), // Reference to specific decision point
  userId: varchar('user_id').references(() => users.id).notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(), // Secure random token
  action: varchar('action', { length: 50 }).notNull(), // 'approve', 'reject', 'escalate'
  context: jsonb('context'), // Decision context for display
  expiresAt: timestamp('expires_at').notNull(),
  usedAt: timestamp('used_at'),
  usedBy: varchar('used_by').references(() => users.id),
  ipAddress: varchar('ip_address', { length: 50 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
  businessUnit: one(businessUnits, {
    fields: [users.businessUnitId],
    references: [businessUnits.id],
  }),
  organizations: many(organizations),
  scenarios: many(strategicScenarios),
  activities: many(activities),
  ownedRisks: many(risks),
  ownedKpis: many(kpis),
  assignedActionItems: many(actionItems),
  notifications: many(notifications),
}));

export const organizationsRelations = relations(organizations, ({ one, many }) => ({
  owner: one(users, {
    fields: [organizations.ownerId],
    references: [users.id],
  }),
  businessUnits: many(businessUnits),
  scenarios: many(strategicScenarios),
  projects: many(projects),
  metrics: many(pulseMetrics),
  adaptations: many(fluxAdaptations),
  insights: many(prismInsights),
  culturalMetrics: many(echoCulturalMetrics),
  innovations: many(novaInnovations),
  reports: many(intelligenceReports),
  analytics: many(moduleUsageAnalytics),
  // Advanced Enterprise Intelligence Relations
  decisionOutcomes: many(decisionOutcomes),
  learningPatterns: many(learningPatterns),
  institutionalMemory: many(institutionalMemory),
  // Canonical Entities Relations
  risks: many(risks),
  initiatives: many(initiatives),
  kpis: many(kpis),
  aiInsights: many(insights),
  recommendations: many(recommendations),
  evidence: many(evidence),
  actionItems: many(actionItems),
  notifications: many(notifications),
}));

export const strategicScenariosRelations = relations(strategicScenarios, ({ one, many }) => ({
  creator: one(users, {
    fields: [strategicScenarios.createdBy],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [strategicScenarios.organizationId],
    references: [organizations.id],
  }),
  tasks: many(tasks),
  adaptations: many(fluxAdaptations),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  scenario: one(strategicScenarios, {
    fields: [tasks.scenarioId],
    references: [strategicScenarios.id],
  }),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
  rolePermissions: many(rolePermissions),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, {
    fields: [rolePermissions.roleId],
    references: [roles.id],
  }),
  permission: one(permissions, {
    fields: [rolePermissions.permissionId],
    references: [permissions.id],
  }),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [projects.organizationId],
    references: [organizations.id],
  }),
}));

export const pulseMetricsRelations = relations(pulseMetrics, ({ one }) => ({
  organization: one(organizations, {
    fields: [pulseMetrics.organizationId],
    references: [organizations.id],
  }),
}));

export const fluxAdaptationsRelations = relations(fluxAdaptations, ({ one }) => ({
  organization: one(organizations, {
    fields: [fluxAdaptations.organizationId],
    references: [organizations.id],
  }),
  scenario: one(strategicScenarios, {
    fields: [fluxAdaptations.scenarioId],
    references: [strategicScenarios.id],
  }),
}));

export const prismInsightsRelations = relations(prismInsights, ({ one }) => ({
  organization: one(organizations, {
    fields: [prismInsights.organizationId],
    references: [organizations.id],
  }),
}));

export const echoCulturalMetricsRelations = relations(echoCulturalMetrics, ({ one }) => ({
  organization: one(organizations, {
    fields: [echoCulturalMetrics.organizationId],
    references: [organizations.id],
  }),
}));

export const novaInnovationsRelations = relations(novaInnovations, ({ one }) => ({
  organization: one(organizations, {
    fields: [novaInnovations.organizationId],
    references: [organizations.id],
  }),
}));

export const intelligenceReportsRelations = relations(intelligenceReports, ({ one }) => ({
  organization: one(organizations, {
    fields: [intelligenceReports.organizationId],
    references: [organizations.id],
  }),
}));

export const moduleUsageAnalyticsRelations = relations(moduleUsageAnalytics, ({ one }) => ({
  organization: one(organizations, {
    fields: [moduleUsageAnalytics.organizationId],
    references: [organizations.id],
  }),
}));

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Organization = typeof organizations.$inferSelect;
export type InsertOrganization = typeof organizations.$inferInsert;

export type StrategicScenario = typeof strategicScenarios.$inferSelect;
export type InsertStrategicScenario = typeof strategicScenarios.$inferInsert;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;

export type Role = typeof roles.$inferSelect;
export type Permission = typeof permissions.$inferSelect;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = typeof activities.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

export type PulseMetric = typeof pulseMetrics.$inferSelect;
export type InsertPulseMetric = typeof pulseMetrics.$inferInsert;

export type FluxAdaptation = typeof fluxAdaptations.$inferSelect;
export type InsertFluxAdaptation = typeof fluxAdaptations.$inferInsert;

export type PrismInsight = typeof prismInsights.$inferSelect;
export type InsertPrismInsight = typeof prismInsights.$inferInsert;

export type EchoCulturalMetric = typeof echoCulturalMetrics.$inferSelect;
export type InsertEchoCulturalMetric = typeof echoCulturalMetrics.$inferInsert;

export type NovaInnovation = typeof novaInnovations.$inferSelect;
export type InsertNovaInnovation = typeof novaInnovations.$inferInsert;

export type IntelligenceReport = typeof intelligenceReports.$inferSelect;
export type InsertIntelligenceReport = typeof intelligenceReports.$inferInsert;

export type ModuleUsageAnalytic = typeof moduleUsageAnalytics.$inferSelect;
export type InsertModuleUsageAnalytic = typeof moduleUsageAnalytics.$inferInsert;

// Canonical Entity Types
export type BusinessUnit = typeof businessUnits.$inferSelect;
export type InsertBusinessUnit = z.infer<typeof insertBusinessUnitSchema>;

export type Risk = typeof risks.$inferSelect;
export type InsertRisk = z.infer<typeof insertRiskSchema>;

export type Initiative = typeof initiatives.$inferSelect;
export type InsertInitiative = z.infer<typeof insertInitiativeSchema>;

export type Kpi = typeof kpis.$inferSelect;
export type InsertKpi = z.infer<typeof insertKpiSchema>;

export type Insight = typeof insights.$inferSelect;
export type InsertInsight = z.infer<typeof insertInsightSchema>;

export type Recommendation = typeof recommendations.$inferSelect;
export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;

export type Evidence = typeof evidence.$inferSelect;
export type InsertEvidence = z.infer<typeof insertEvidenceSchema>;

export type ActionItem = typeof actionItems.$inferSelect;
export type InsertActionItem = z.infer<typeof insertActionItemSchema>;

export type WorkflowTemplate = typeof workflowTemplates.$inferSelect;
export type InsertWorkflowTemplate = z.infer<typeof insertWorkflowTemplateSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

// Advanced Enterprise Intelligence Tables for Fortune 1000 Decision Tracking

// Decision Outcomes - Track strategic decisions and learn from results
export const decisionOutcomes = pgTable("decision_outcomes", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id).notNull(),
  scenarioId: uuid("scenario_id").references(() => strategicScenarios.id),
  projectId: uuid("project_id").references(() => projects.id),
  decisionType: varchar("decision_type", { length: 100 }).notNull(),
  decisionDescription: text("decision_description").notNull(),
  decisionMaker: varchar("decision_maker").references(() => users.id),
  decisionContext: jsonb("decision_context"),
  chosenOption: jsonb("chosen_option"),
  alternativeOptions: jsonb("alternative_options"),
  
  // Execution tracking
  implementationStart: timestamp("implementation_start"),
  implementationEnd: timestamp("implementation_end"),
  actualOutcome: outcomeTypeEnum("actual_outcome"),
  effectiveness: effectivenessEnum("effectiveness"),
  
  // Learning data for AI
  successMetrics: jsonb("success_metrics"),
  actualResults: jsonb("actual_results"),
  lessonsLearned: jsonb("lessons_learned"),
  unexpectedConsequences: jsonb("unexpected_consequences"),
  stakeholderFeedback: jsonb("stakeholder_feedback"),
  
  // Pattern data for AI learning
  organizationState: jsonb("organization_state"),
  externalFactors: jsonb("external_factors"),
  resourcesUsed: jsonb("resources_used"),
  timeToImplement: integer("time_to_implement"),
  costOfImplementation: decimal("cost_of_implementation", { precision: 12, scale: 2 }),
  
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: varchar("reviewed_by").references(() => users.id),
  confidence: confidenceEnum("confidence").default('medium'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Learning Patterns - AI pattern recognition for organizational intelligence
export const learningPatterns = pgTable("learning_patterns", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id).notNull(),
  patternType: varchar("pattern_type", { length: 100 }).notNull(),
  category: varchar("category", { length: 100 }),
  
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  conditions: jsonb("conditions"),
  actions: jsonb("actions"),
  outcomes: jsonb("outcomes"),
  
  frequency: integer("frequency"),
  successRate: decimal("success_rate", { precision: 3, scale: 2 }),
  averageImpact: decimal("average_impact", { precision: 5, scale: 2 }),
  confidenceLevel: decimal("confidence_level", { precision: 3, scale: 2 }),
  
  supportingDecisions: jsonb("supporting_decisions"),
  relatedScenarios: jsonb("related_scenarios"),
  keyFactors: jsonb("key_factors"),
  recommendations: jsonb("recommendations"),
  
  discoveredAt: timestamp("discovered_at").defaultNow(),
  lastValidated: timestamp("last_validated"),
  nextReviewDate: timestamp("next_review_date"),
  status: varchar("status", { length: 20 }).default('active'),
});

// Institutional Memory - Preserve organizational knowledge and expertise
export const institutionalMemory = pgTable("institutional_memory", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id).notNull(),
  memoryType: varchar("memory_type", { length: 100 }).notNull(),
  domain: varchar("domain", { length: 100 }),
  
  title: varchar("title", { length: 255 }).notNull(),
  summary: text("summary").notNull(),
  detailedKnowledge: jsonb("detailed_knowledge"),
  triggerConditions: jsonb("trigger_conditions"),
  contraindications: jsonb("contraindications"),
  
  sourceDecisions: jsonb("source_decisions"),
  sourceScenarios: jsonb("source_scenarios"),
  sourceExperts: jsonb("source_experts"),
  
  accessLevel: varchar("access_level", { length: 50 }).default('organization'),
  lastAccessed: timestamp("last_accessed"),
  accessCount: integer("access_count").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Enhanced Relations for Decision Intelligence
export const decisionOutcomesRelations = relations(decisionOutcomes, ({ one }) => ({
  organization: one(organizations, {
    fields: [decisionOutcomes.organizationId],
    references: [organizations.id],
  }),
  scenario: one(strategicScenarios, {
    fields: [decisionOutcomes.scenarioId],
    references: [strategicScenarios.id],
  }),
  project: one(projects, {
    fields: [decisionOutcomes.projectId],
    references: [projects.id],
  }),
  maker: one(users, {
    fields: [decisionOutcomes.decisionMaker],
    references: [users.id],
  }),
}));

export const learningPatternsRelations = relations(learningPatterns, ({ one }) => ({
  organization: one(organizations, {
    fields: [learningPatterns.organizationId],
    references: [organizations.id],
  }),
}));

export const institutionalMemoryRelations = relations(institutionalMemory, ({ one }) => ({
  organization: one(organizations, {
    fields: [institutionalMemory.organizationId],
    references: [organizations.id],
  }),
}));

// Relations for canonical entities
export const businessUnitsRelations = relations(businessUnits, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [businessUnits.organizationId],
    references: [organizations.id],
  }),
  parentUnit: one(businessUnits, {
    fields: [businessUnits.parentUnitId],
    references: [businessUnits.id],
  }),
  childUnits: many(businessUnits),
  users: many(users),
  initiatives: many(initiatives),
  kpis: many(kpis),
}));

export const risksRelations = relations(risks, ({ one }) => ({
  organization: one(organizations, {
    fields: [risks.organizationId],
    references: [organizations.id],
  }),
  scenario: one(strategicScenarios, {
    fields: [risks.scenarioId],
    references: [strategicScenarios.id],
  }),
  owner: one(users, {
    fields: [risks.riskOwner],
    references: [users.id],
  }),
}));

export const initiativesRelations = relations(initiatives, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [initiatives.organizationId],
    references: [organizations.id],
  }),
  scenario: one(strategicScenarios, {
    fields: [initiatives.scenarioId],
    references: [strategicScenarios.id],
  }),
  businessUnit: one(businessUnits, {
    fields: [initiatives.businessUnitId],
    references: [businessUnits.id],
  }),
  kpis: many(kpis),
  insights: many(insights),
  actionItems: many(actionItems),
}));

export const kpisRelations = relations(kpis, ({ one }) => ({
  organization: one(organizations, {
    fields: [kpis.organizationId],
    references: [organizations.id],
  }),
  businessUnit: one(businessUnits, {
    fields: [kpis.businessUnitId],
    references: [businessUnits.id],
  }),
  initiative: one(initiatives, {
    fields: [kpis.initiativeId],
    references: [initiatives.id],
  }),
  owner: one(users, {
    fields: [kpis.owner],
    references: [users.id],
  }),
}));

export const insightsRelations = relations(insights, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [insights.organizationId],
    references: [organizations.id],
  }),
  scenario: one(strategicScenarios, {
    fields: [insights.scenarioId],
    references: [strategicScenarios.id],
  }),
  initiative: one(initiatives, {
    fields: [insights.initiativeId],
    references: [initiatives.id],
  }),
  recommendations: many(recommendations),
}));

export const recommendationsRelations = relations(recommendations, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [recommendations.organizationId],
    references: [organizations.id],
  }),
  insight: one(insights, {
    fields: [recommendations.insightId],
    references: [insights.id],
  }),
  scenario: one(strategicScenarios, {
    fields: [recommendations.scenarioId],
    references: [strategicScenarios.id],
  }),
  assignee: one(users, {
    fields: [recommendations.assignedTo],
    references: [users.id],
  }),
  actionItems: many(actionItems),
}));

export const evidenceRelations = relations(evidence, ({ one }) => ({
  organization: one(organizations, {
    fields: [evidence.organizationId],
    references: [organizations.id],
  }),
  creator: one(users, {
    fields: [evidence.createdBy],
    references: [users.id],
  }),
}));

export const actionItemsRelations = relations(actionItems, ({ one }) => ({
  organization: one(organizations, {
    fields: [actionItems.organizationId],
    references: [organizations.id],
  }),
  recommendation: one(recommendations, {
    fields: [actionItems.recommendationId],
    references: [recommendations.id],
  }),
  initiative: one(initiatives, {
    fields: [actionItems.initiativeId],
    references: [initiatives.id],
  }),
  scenario: one(strategicScenarios, {
    fields: [actionItems.scenarioId],
    references: [strategicScenarios.id],
  }),
  assignee: one(users, {
    fields: [actionItems.assignedTo],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  organization: one(organizations, {
    fields: [notifications.organizationId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

// Enhanced Zod schemas with comprehensive validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertOrganizationSchema = createInsertSchema(organizations);
export const selectOrganizationSchema = createSelectSchema(organizations);

export const insertBusinessUnitSchema = createInsertSchema(businessUnits);
export const insertRiskSchema = createInsertSchema(risks);
export const insertInitiativeSchema = createInsertSchema(initiatives);
export const insertKpiSchema = createInsertSchema(kpis);
export const insertInsightSchema = createInsertSchema(insights);
export const insertRecommendationSchema = createInsertSchema(recommendations);
export const insertEvidenceSchema = createInsertSchema(evidence);
export const insertActionItemSchema = createInsertSchema(actionItems);
export const insertWorkflowTemplateSchema = createInsertSchema(workflowTemplates);
export const insertNotificationSchema = createInsertSchema(notifications);

export const insertProjectSchema = createInsertSchema(projects);
export const selectProjectSchema = createSelectSchema(projects);

export const insertStrategicScenarioSchema = createInsertSchema(strategicScenarios);
export const selectStrategicScenarioSchema = createSelectSchema(strategicScenarios);

export const insertTaskSchema = createInsertSchema(tasks);
export const selectTaskSchema = createSelectSchema(tasks);

// Execution Coordination schemas
export const insertExecutionCheckpointSchema = createInsertSchema(executionCheckpoints).omit({ id: true, createdAt: true });
export const insertDocumentTemplateSchema = createInsertSchema(documentTemplates).omit({ id: true, createdAt: true, updatedAt: true });
export const insertTaskDocumentTemplateSchema = createInsertSchema(taskDocumentTemplates).omit({ id: true, createdAt: true });
export const insertCheckpointValidationSchema = createInsertSchema(checkpointValidations).omit({ id: true, createdAt: true });
export const insertExecutionPlanTaskSchema = createInsertSchema(executionPlanTasks).omit({ id: true, createdAt: true, updatedAt: true });
export const insertExecutionInstanceSchema = createInsertSchema(executionInstances).omit({ id: true, createdAt: true, updatedAt: true });
export const insertExecutionInstanceTaskSchema = createInsertSchema(executionInstanceTasks).omit({ id: true, createdAt: true, updatedAt: true });

// Execution Coordination types
export type ExecutionCheckpoint = typeof executionCheckpoints.$inferSelect;
export type InsertExecutionCheckpoint = z.infer<typeof insertExecutionCheckpointSchema>;
export type DocumentTemplate = typeof documentTemplates.$inferSelect;
export type InsertDocumentTemplate = z.infer<typeof insertDocumentTemplateSchema>;
export type ExecutionPlanTask = typeof executionPlanTasks.$inferSelect;
export type ExecutionInstance = typeof executionInstances.$inferSelect;
export type ExecutionInstanceTask = typeof executionInstanceTasks.$inferSelect;

// Legacy compatibility schemas (for existing forms)
export const legacyInsertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
});

export const legacyInsertOrganizationSchema = createInsertSchema(organizations).pick({
  name: true,
  description: true,
});

export const legacyInsertScenarioSchema = createInsertSchema(strategicScenarios).pick({
  title: true,
  description: true,
  organizationId: true,
});

export const legacyInsertTaskSchema = createInsertSchema(tasks).pick({
  scenarioId: true,
  description: true,
  priority: true,
  dueDate: true,
});

export const legacyInsertProjectSchema = createInsertSchema(projects).pick({
  organizationId: true,
  name: true,
  description: true,
  priority: true,
  startDate: true,
  endDate: true,
  budget: true,
});

export const insertPulseMetricSchema = createInsertSchema(pulseMetrics).pick({
  organizationId: true,
  metricName: true,
  value: true,
  unit: true,
  category: true,
  metadata: true,
});

export const insertFluxAdaptationSchema = createInsertSchema(fluxAdaptations).pick({
  organizationId: true,
  scenarioId: true,
  adaptationType: true,
  description: true,
  implementation: true,
  effectiveness: true,
});

export const insertPrismInsightSchema = createInsertSchema(prismInsights).pick({
  organizationId: true,
  insightType: true,
  title: true,
  content: true,
  confidence: true,
  sources: true,
});

export const insertEchoCulturalMetricSchema = createInsertSchema(echoCulturalMetrics).pick({
  organizationId: true,
  dimension: true,
  score: true,
  trend: true,
  factors: true,
  recommendations: true,
});

export const insertNovaInnovationSchema = createInsertSchema(novaInnovations).pick({
  organizationId: true,
  title: true,
  description: true,
  category: true,
  stage: true,
  potential: true,
  resources: true,
  timeline: true,
});

export const insertIntelligenceReportSchema = createInsertSchema(intelligenceReports).pick({
  organizationId: true,
  reportType: true,
  title: true,
  executiveSummary: true,
  findings: true,
  recommendations: true,
  confidence: true,
});

export const insertModuleUsageAnalyticSchema = createInsertSchema(moduleUsageAnalytics).pick({
  organizationId: true,
  moduleName: true,
  action: true,
  metadata: true,
  userId: true,
});

// Advanced Enterprise Intelligence Types for Fortune 1000 Decision Tracking
export type DecisionOutcome = typeof decisionOutcomes.$inferSelect;
export type InsertDecisionOutcome = typeof decisionOutcomes.$inferInsert;

export type LearningPattern = typeof learningPatterns.$inferSelect;
export type InsertLearningPattern = typeof learningPatterns.$inferInsert;

export type InstitutionalMemory = typeof institutionalMemory.$inferSelect;
export type InsertInstitutionalMemory = typeof institutionalMemory.$inferInsert;

// Advanced Enterprise Intelligence Schemas
export const insertDecisionOutcomeSchema = createInsertSchema(decisionOutcomes).pick({
  organizationId: true,
  scenarioId: true,
  projectId: true,
  decisionType: true,
  decisionDescription: true,
  decisionMaker: true,
  decisionContext: true,
  chosenOption: true,
  alternativeOptions: true,
});

export const insertLearningPatternSchema = createInsertSchema(learningPatterns).pick({
  organizationId: true,
  patternType: true,
  category: true,
  title: true,
  description: true,
  conditions: true,
  actions: true,
  outcomes: true,
});

export const insertInstitutionalMemorySchema = createInsertSchema(institutionalMemory).pick({
  organizationId: true,
  memoryType: true,
  domain: true,
  title: true,
  summary: true,
  detailedKnowledge: true,
});

// === STRATEGIC ENHANCEMENTS FOR PROACTIVE AI RADAR ===

// Strategic Alerts - Proactive AI Radar System
export const strategicAlerts = pgTable('strategic_alerts', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  alertType: alertTypeEnum('alert_type').notNull(),
  severity: priorityEnum('severity').default('medium'),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  aiConfidence: decimal('ai_confidence', { precision: 3, scale: 2 }), // 0.00 to 1.00
  dataSourcesUsed: jsonb('data_sources_used'), // Array of data sources that triggered this alert
  suggestedActions: jsonb('suggested_actions'), // AI-recommended next steps
  recommendedScenario: varchar('recommended_scenario', { length: 255 }), // Suggested scenario to run
  targetAudience: jsonb('target_audience'), // C-suite roles this affects
  status: varchar('status', { length: 50 }).default('active'), // active, acknowledged, dismissed, resolved
  acknowledgedBy: varchar('acknowledged_by').references(() => users.id),
  acknowledgedAt: timestamp('acknowledged_at'),
  resolvedAt: timestamp('resolved_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Executive Insights - AI-Generated Strategic Intelligence
export const executiveInsights = pgTable('executive_insights', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  insightType: insightTypeEnum('insight_type').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  summary: text('summary').notNull(), // Executive summary
  detailedAnalysis: text('detailed_analysis'), // In-depth AI analysis
  keyFindings: jsonb('key_findings'), // Structured bullet points
  confidenceScore: decimal('confidence_score', { precision: 3, scale: 2 }),
  dataPoints: jsonb('data_points'), // Supporting data and metrics
  implications: jsonb('implications'), // Business implications
  recommendedActions: jsonb('recommended_actions'), // Actionable next steps
  timeHorizon: varchar('time_horizon', { length: 50 }), // immediate, short-term, long-term
  relatedScenarios: jsonb('related_scenarios'), // Array of scenario IDs
  boardReady: boolean('board_ready').default(false), // Flagged for board presentation
  viewedBy: jsonb('viewed_by'), // Track C-suite engagement
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Action Hooks - Enterprise Integration System
export const actionHooks = pgTable('action_hooks', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  triggerEvent: varchar('trigger_event', { length: 100 }).notNull(), // decision_made, scenario_activated, etc.
  targetSystem: varchar('target_system', { length: 100 }).notNull(), // jira, slack, asana, netsuite
  actionType: varchar('action_type', { length: 100 }).notNull(), // create_project, send_notification, allocate_budget
  configuration: jsonb('configuration').notNull(), // System-specific settings
  mappingRules: jsonb('mapping_rules'), // Data transformation rules
  status: actionStatusEnum('status').default('pending'),
  lastTriggered: timestamp('last_triggered'),
  successCount: integer('success_count').default(0),
  failureCount: integer('failure_count').default(0),
  isActive: boolean('is_active').default(true),
  createdBy: varchar('created_by').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Intuition Records - Codifying Executive Hunches
export const intuitionRecords = pgTable('intuition_records', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  executiveId: varchar('executive_id').references(() => users.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(), // The original hunch/intuition
  confidenceLevel: confidenceEnum('confidence_level').default('medium'),
  timeframe: varchar('timeframe', { length: 100 }), // When they expect this to materialize
  relatedDomain: varchar('related_domain', { length: 100 }), // market, technology, regulation, etc.
  aiValidationStatus: varchar('ai_validation_status', { length: 50 }).default('pending'),
  aiFindings: text('ai_findings'), // AI's analysis of the intuition
  supportingData: jsonb('supporting_data'), // Data points found by AI
  contradictingData: jsonb('contradicting_data'), // Data that challenges the hunch
  validationScore: decimal('validation_score', { precision: 3, scale: 2 }), // AI confidence in intuition
  outcome: varchar('outcome', { length: 100 }), // Track if the intuition was correct
  followUpActions: jsonb('follow_up_actions'), // Actions taken based on this insight
  isValidated: boolean('is_validated'),
  validatedAt: timestamp('validated_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Synthetic Scenarios - AI-Generated Future Planning
export const syntheticScenarios = pgTable('synthetic_scenarios', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  category: varchar('category', { length: 100 }).notNull(), // black_swan, market_shift, tech_disruption
  likelihood: decimal('likelihood', { precision: 3, scale: 2 }),
  potentialImpact: riskLevelEnum('potential_impact'),
  timeHorizon: varchar('time_horizon', { length: 50 }), // 6m, 12m, 18m, 24m+
  triggerSigns: jsonb('trigger_signs'), // Early warning indicators
  contextData: jsonb('context_data'), // AI reasoning and data sources
  responseFramework: jsonb('response_framework'), // Recommended decision framework
  keyStakeholders: jsonb('key_stakeholders'), // Who should be involved
  strategicImplications: text('strategic_implications'),
  generatedBy: varchar('generated_by').default('ai'), // ai, human, hybrid
  parentQuery: text('parent_query'), // Original executive question that spawned this
  upvotes: integer('upvotes').default(0), // C-suite validation
  status: varchar('status', { length: 50 }).default('draft'),
  implementedAsScenario: uuid('implemented_as_scenario').references(() => strategicScenarios.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Executive War Room - Crisis Command Center Management
export const warRoomSessions = pgTable('war_room_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  crisisId: varchar('crisis_id', { length: 255 }),
  sessionName: varchar('session_name', { length: 255 }),
  commanderId: varchar('commander_id').references(() => users.id),
  status: varchar('status', { length: 50 }).default('active'),
  startTime: timestamp('start_time'),
  endTime: timestamp('end_time'),
  participants: jsonb('participants'),
  objectives: jsonb('objectives'),
  actionItems: jsonb('action_items'),
  decisions: jsonb('decisions'),
  scenarioId: uuid('scenario_id').references(() => strategicScenarios.id),
  executionTimeMinutes: integer('execution_time_minutes'),
  executiveHourlyRate: integer('executive_hourly_rate').default(350),
  stakeholdersNotified: integer('stakeholders_notified'),
  businessImpact: jsonb('business_impact'),
  outcome: varchar('outcome', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// War Room Updates - Real-time situation updates and command logs
export const warRoomUpdates = pgTable('war_room_updates', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').references(() => warRoomSessions.id).notNull(),
  updateType: varchar('update_type', { length: 50 }).notNull(), // 'situation-update', 'decision', 'action-taken', 'escalation', 'communication'
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  priority: priorityEnum('priority').default('medium'),
  authorId: varchar('author_id').references(() => users.id).notNull(),
  impactAssessment: text('impact_assessment'),
  requiredActions: jsonb('required_actions'), // Array of action items
  assignedTo: jsonb('assigned_to'), // Array of user IDs
  deadline: timestamp('deadline'),
  attachments: jsonb('attachments'), // Array of file references
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Executive Briefings - Zero-Click Intelligence summaries
export const executiveBriefings = pgTable('executive_briefings', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  executiveId: varchar('executive_id').references(() => users.id).notNull(),
  briefingType: varchar('briefing_type', { length: 100 }).notNull(), // 'daily-intelligence', 'crisis-alert', 'opportunity-brief', 'decision-support'
  title: varchar('title', { length: 255 }).notNull(),
  executiveSummary: text('executive_summary').notNull(),
  keyInsights: jsonb('key_insights'), // Array of insight objects
  criticalDecisions: jsonb('critical_decisions'), // Array of decision points
  riskAssessment: text('risk_assessment'),
  opportunityHighlights: text('opportunity_highlights'),
  stakeholderImpact: text('stakeholder_impact'),
  recommendedActions: jsonb('recommended_actions'), // Array of action items
  timeToDecision: varchar('time_to_decision', { length: 50 }), // 'immediate', 'within-24h', 'within-week', 'strategic-planning'
  confidenceLevel: integer('confidence_level').default(85), // 0-100
  dataSource: jsonb('data_source'), // Array of data sources
  generatedBy: varchar('generated_by').default('ai-radar'),
  reviewed: boolean('reviewed').default(false),
  executiveNotes: text('executive_notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  scheduledFor: timestamp('scheduled_for'),
  acknowledgedAt: timestamp('acknowledged_at')
});

// Board Reporting - Executive Dashboard Snapshots
export const boardReports = pgTable('board_reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  reportType: varchar('report_type', { length: 100 }).notNull(), // 'quarterly-brief', 'crisis-summary', 'strategic-update', 'performance-dashboard'
  title: varchar('title', { length: 255 }).notNull(),
  reportingPeriod: varchar('reporting_period', { length: 100 }).notNull(),
  executiveSummary: text('executive_summary').notNull(),
  keyMetrics: jsonb('key_metrics'), // Structured metrics data
  strategicInitiatives: jsonb('strategic_initiatives'), // Array of initiative objects
  riskManagement: text('risk_management'),
  opportunityPipeline: text('opportunity_pipeline'),
  organizationalHealth: text('organizational_health'),
  marketPosition: text('market_position'),
  financialHighlights: text('financial_highlights'),
  operationalExcellence: text('operational_excellence'),
  stakeholderValue: text('stakeholder_value'),
  futureOutlook: text('future_outlook'),
  boardRecommendations: jsonb('board_recommendations'), // Array of recommendation objects
  appendices: jsonb('appendices'), // Array of supplementary data
  generatedBy: varchar('generated_by').references(() => users.id).notNull(),
  approvedBy: varchar('approved_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  approvedAt: timestamp('approved_at'),
  presentedAt: timestamp('presented_at')
});

// Strategic Enhancement Types
export type StrategicAlert = typeof strategicAlerts.$inferSelect;
export type InsertStrategicAlert = typeof strategicAlerts.$inferInsert;

export type ExecutiveInsight = typeof executiveInsights.$inferSelect;  
export type InsertExecutiveInsight = typeof executiveInsights.$inferInsert;

export type ActionHook = typeof actionHooks.$inferSelect;
export type InsertActionHook = typeof actionHooks.$inferInsert;

export type IntuitionRecord = typeof intuitionRecords.$inferSelect;
export type InsertIntuitionRecord = typeof intuitionRecords.$inferInsert;

export type SyntheticScenario = typeof syntheticScenarios.$inferSelect;
export type InsertSyntheticScenario = typeof syntheticScenarios.$inferInsert;

export type WarRoomSession = typeof warRoomSessions.$inferSelect;
export type InsertWarRoomSession = typeof warRoomSessions.$inferInsert;

export type WarRoomUpdate = typeof warRoomUpdates.$inferSelect;
export type InsertWarRoomUpdate = typeof warRoomUpdates.$inferInsert;

export type ExecutiveBriefing = typeof executiveBriefings.$inferSelect;
export type InsertExecutiveBriefing = typeof executiveBriefings.$inferInsert;

export type BoardReport = typeof boardReports.$inferSelect;
export type InsertBoardReport = typeof boardReports.$inferInsert;

// Strategic Enhancement Schemas
export const insertStrategicAlertSchema = createInsertSchema(strategicAlerts).pick({
  organizationId: true,
  alertType: true,
  severity: true,
  title: true,
  description: true,
  aiConfidence: true,
  dataSourcesUsed: true,
  suggestedActions: true,
  recommendedScenario: true,
  targetAudience: true,
});

export const insertExecutiveInsightSchema = createInsertSchema(executiveInsights).pick({
  organizationId: true,
  insightType: true,
  title: true,
  summary: true,
  detailedAnalysis: true,
  keyFindings: true,
  confidenceScore: true,
  dataPoints: true,
  implications: true,
  recommendedActions: true,
  timeHorizon: true,
});

export const insertActionHookSchema = createInsertSchema(actionHooks).pick({
  organizationId: true,
  name: true,
  description: true,
  triggerEvent: true,
  targetSystem: true,
  actionType: true,
  configuration: true,
  mappingRules: true,
  createdBy: true,
});

export const insertIntuitionRecordSchema = createInsertSchema(intuitionRecords).pick({
  organizationId: true,
  executiveId: true,
  title: true,
  description: true,
  confidenceLevel: true,
  timeframe: true,
  relatedDomain: true,
});

export const insertSyntheticScenarioSchema = createInsertSchema(syntheticScenarios).pick({
  organizationId: true,
  title: true,
  description: true,
  category: true,
  likelihood: true,
  potentialImpact: true,
  timeHorizon: true,
  triggerSigns: true,
  contextData: true,
  responseFramework: true,
  keyStakeholders: true,
  strategicImplications: true,
  parentQuery: true,
});

export const insertWarRoomSessionSchema = createInsertSchema(warRoomSessions).pick({
  organizationId: true,
  crisisId: true,
  sessionName: true,
  commanderId: true,
  status: true,
  participants: true,
  objectives: true,
  actionItems: true,
  decisions: true,
  scenarioId: true,
});

export const insertWarRoomUpdateSchema = createInsertSchema(warRoomUpdates).pick({
  sessionId: true,
  updateType: true,
  title: true,
  content: true,
  priority: true,
  authorId: true,
  impactAssessment: true,
  requiredActions: true,
  assignedTo: true,
  deadline: true,
});

export const insertExecutiveBriefingSchema = createInsertSchema(executiveBriefings).pick({
  organizationId: true,
  executiveId: true,
  briefingType: true,
  title: true,
  executiveSummary: true,
  keyInsights: true,
  criticalDecisions: true,
  riskAssessment: true,
  opportunityHighlights: true,
  recommendedActions: true,
  timeToDecision: true,
});

export const insertBoardReportSchema = createInsertSchema(boardReports).pick({
  organizationId: true,
  reportType: true,
  title: true,
  reportingPeriod: true,
  executiveSummary: true,
  keyMetrics: true,
  strategicInitiatives: true,
  riskManagement: true,
  opportunityPipeline: true,
  generatedBy: true,
});

// PLATFORM ENHANCEMENT TABLES

// 1. ROI Measurement & Value Tracking
export const roiMetrics = pgTable('roi_metrics', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull(),
  metricName: varchar('metric_name', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }), // 'decision_speed', 'crisis_response', 'strategic_value'
  baseline: decimal('baseline', { precision: 15, scale: 2 }),
  currentValue: decimal('current_value', { precision: 15, scale: 2 }),
  targetValue: decimal('target_value', { precision: 15, scale: 2 }),
  unit: varchar('unit', { length: 50 }), // 'hours', 'dollars', 'percentage', 'days'
  calculationMethod: text('calculation_method'),
  dataPoints: jsonb('data_points'), // Historical values with timestamps
  lastCalculated: timestamp('last_calculated'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const valueTrackingEvents = pgTable('value_tracking_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull(),
  eventType: varchar('event_type', { length: 100 }).notNull(), // 'decision_made', 'crisis_resolved', 'initiative_completed'
  entityId: uuid('entity_id'), // ID of scenario, task, etc.
  entityType: varchar('entity_type', { length: 100 }), // 'scenario', 'task', 'initiative'
  valueGenerated: decimal('value_generated', { precision: 15, scale: 2 }),
  costAvoided: decimal('cost_avoided', { precision: 15, scale: 2 }),
  timeToResolution: integer('time_to_resolution'), // in minutes
  stakeholdersInvolved: integer('stakeholders_involved'),
  qualityScore: decimal('quality_score', { precision: 3, scale: 2 }), // 0.00-1.00
  evidenceData: jsonb('evidence_data'),
  calculatedBy: varchar('calculated_by'), // 'system' or user ID
  validatedBy: varchar('validated_by'), // user ID who validated
  createdAt: timestamp('created_at').defaultNow(),
});

// 2. Quick-Start Templates and Deployment
export const quickStartTemplates = pgTable('quick_start_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }), // 'crisis_response', 'strategic_planning', 'kpi_tracking'
  industry: varchar('industry', { length: 100 }),
  organizationSize: varchar('organization_size', { length: 50 }), // 'small', 'medium', 'large', 'enterprise'
  description: text('description'),
  templateData: jsonb('template_data'), // Contains scenarios, KPIs, workflows, etc.
  requirements: jsonb('requirements'), // Prerequisites for this template
  estimatedSetupTime: integer('estimated_setup_time'), // in minutes
  usageCount: integer('usage_count').default(0),
  successRate: decimal('success_rate', { precision: 3, scale: 2 }), // 0.00-1.00
  version: varchar('version', { length: 20 }).default('1.0'),
  isActive: boolean('is_active').default(true),
  createdBy: varchar('created_by'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const deploymentProgress = pgTable('deployment_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull(),
  templateId: uuid('template_id'),
  currentStep: integer('current_step').default(0),
  totalSteps: integer('total_steps').notNull(),
  status: deploymentStatusEnum('status').default('planning'),
  stepsCompleted: jsonb('steps_completed'), // Array of completed step IDs
  stepData: jsonb('step_data'), // Data collected during deployment
  startedAt: timestamp('started_at').defaultNow(),
  completedAt: timestamp('completed_at'),
  estimatedCompletion: timestamp('estimated_completion'),
  blockers: jsonb('blockers'), // Array of blocking issues
  assignedTo: varchar('assigned_to'),
  metadata: jsonb('metadata'),
});

// 3. Network Effects & Benchmarking
export const industryBenchmarks = pgTable('industry_benchmarks', {
  id: uuid('id').primaryKey().defaultRandom(),
  industry: varchar('industry', { length: 100 }).notNull(),
  organizationSize: varchar('organization_size', { length: 50 }).notNull(),
  metricName: varchar('metric_name', { length: 255 }).notNull(),
  percentile25: decimal('percentile_25', { precision: 15, scale: 2 }),
  percentile50: decimal('percentile_50', { precision: 15, scale: 2 }),
  percentile75: decimal('percentile_75', { precision: 15, scale: 2 }),
  percentile90: decimal('percentile_90', { precision: 15, scale: 2 }),
  sampleSize: integer('sample_size'),
  lastUpdated: timestamp('last_updated').defaultNow(),
  dataSource: varchar('data_source', { length: 255 }),
  metadata: jsonb('metadata'),
});

export const peerComparisons = pgTable('peer_comparisons', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull(),
  metricName: varchar('metric_name', { length: 255 }).notNull(),
  organizationValue: decimal('organization_value', { precision: 15, scale: 2 }),
  industryPercentile: integer('industry_percentile'), // 1-100
  peersAbove: integer('peers_above'),
  peersBelow: integer('peers_below'),
  improvementOpportunity: decimal('improvement_opportunity', { precision: 15, scale: 2 }),
  benchmarkDate: timestamp('benchmark_date').defaultNow(),
  recommendations: jsonb('recommendations'),
});

// 4. Enterprise Integration & API Ecosystem
export const enterpriseIntegrations = pgTable('enterprise_integrations', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  integrationType: varchar('integration_type', { length: 100 }), // 'erp', 'crm', 'bi', 'communication'
  vendor: varchar('vendor', { length: 100 }), // 'salesforce', 'microsoft', 'sap', etc.
  status: integrationStatusEnum('status').default('pending'),
  configuration: jsonb('configuration'), // Connection details, field mappings
  dataMapping: jsonb('data_mapping'), // How data flows between systems
  syncFrequency: varchar('sync_frequency', { length: 50 }), // 'real-time', 'hourly', 'daily'
  lastSyncAt: timestamp('last_sync_at'),
  nextSyncAt: timestamp('next_sync_at'),
  errorLog: jsonb('error_log'), // Recent errors and issues
  apiEndpoint: varchar('api_endpoint', { length: 500 }),
  webhookUrl: varchar('webhook_url', { length: 500 }),
  authenticationType: varchar('authentication_type', { length: 100 }),
  metadata: jsonb('metadata'),
  installedBy: varchar('installed_by'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const integrationData = pgTable('integration_data', {
  id: uuid('id').primaryKey().defaultRandom(),
  integrationId: uuid('integration_id').notNull(),
  dataType: varchar('data_type', { length: 100 }), // 'kpi', 'alert', 'user', 'transaction'
  sourceId: varchar('source_id', { length: 255 }), // ID in source system
  mappedEntityId: uuid('mapped_entity_id'), // ID in our system
  rawData: jsonb('raw_data'),
  transformedData: jsonb('transformed_data'),
  syncedAt: timestamp('synced_at').defaultNow(),
  processingStatus: varchar('processing_status', { length: 50 }).default('pending'),
  processingErrors: jsonb('processing_errors'),
});

// 5. AI Confidence & Human Validation
export const aiConfidenceScores = pgTable('ai_confidence_scores', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull(),
  entityType: varchar('entity_type', { length: 100 }).notNull(), // 'insight', 'recommendation', 'forecast'
  entityId: uuid('entity_id').notNull(),
  aiModel: varchar('ai_model', { length: 100 }), // 'gpt-5', 'custom_model_v1'
  confidenceScore: decimal('confidence_score', { precision: 3, scale: 2 }), // 0.00-1.00
  factorsAnalyzed: jsonb('factors_analyzed'), // What data contributed to this score
  dataQualityScore: decimal('data_quality_score', { precision: 3, scale: 2 }),
  biasDetectionResults: jsonb('bias_detection_results'),
  uncertaintyFactors: jsonb('uncertainty_factors'),
  validationStatus: varchar('validation_status', { length: 50 }).default('pending'), // 'pending', 'validated', 'rejected'
  humanFeedback: jsonb('human_feedback'),
  validatedBy: varchar('validated_by'), // user ID
  validatedAt: timestamp('validated_at'),
  accuracyTracking: jsonb('accuracy_tracking'), // Historical accuracy for this type
  createdAt: timestamp('created_at').defaultNow(),
});

export const humanValidationQueue = pgTable('human_validation_queue', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull(),
  entityType: varchar('entity_type', { length: 100 }).notNull(),
  entityId: uuid('entity_id').notNull(),
  priority: priorityEnum('priority').default('medium'),
  validationType: varchar('validation_type', { length: 100 }), // 'accuracy_check', 'bias_review', 'impact_assessment'
  assignedTo: varchar('assigned_to'), // user ID
  requiredExpertise: jsonb('required_expertise'), // Skills needed for validation
  aiSummary: text('ai_summary'), // AI explanation of what needs validation
  validationPrompt: text('validation_prompt'), // Questions for human validator
  deadline: timestamp('deadline'),
  status: actionStatusEnum('status').default('pending'),
  completedAt: timestamp('completed_at'),
  result: jsonb('result'), // Validation outcome
  createdAt: timestamp('created_at').defaultNow(),
});

// 6. Usage Analytics & Engagement
export const usageAnalytics = pgTable('usage_analytics', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull(),
  userId: varchar('user_id').notNull(),
  sessionId: varchar('session_id'),
  eventType: varchar('event_type', { length: 100 }).notNull(), // 'page_view', 'feature_used', 'decision_made'
  feature: varchar('feature', { length: 100 }), // 'crisis_response', 'kpi_dashboard', 'ai_insights'
  action: varchar('action', { length: 100 }), // 'create', 'update', 'view', 'export'
  entityType: varchar('entity_type', { length: 100 }), // 'scenario', 'task', 'insight'
  entityId: uuid('entity_id'),
  duration: integer('duration'), // seconds spent
  value: decimal('value', { precision: 15, scale: 2 }), // business value generated
  context: jsonb('context'), // Additional event data
  deviceType: varchar('device_type', { length: 50 }),
  browserInfo: jsonb('browser_info'),
  timestamp: timestamp('timestamp').defaultNow(),
});

export const engagementMetrics = pgTable('engagement_metrics', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull(),
  userId: varchar('user_id').notNull(),
  period: varchar('period', { length: 20 }), // 'daily', 'weekly', 'monthly'
  periodStart: timestamp('period_start').notNull(),
  periodEnd: timestamp('period_end').notNull(),
  sessionsCount: integer('sessions_count').default(0),
  totalDuration: integer('total_duration').default(0), // seconds
  featuresUsed: jsonb('features_used'), // Array of features with usage counts
  decisionsInfluenced: integer('decisions_influenced').default(0),
  valueGenerated: decimal('value_generated', { precision: 15, scale: 2 }).default('0'),
  engagementScore: decimal('engagement_score', { precision: 3, scale: 2 }), // 0.00-1.00
  riskEvents: integer('risk_events').default(0), // Number of risks/crises engaged with
  strategicActions: integer('strategic_actions').default(0),
  collaborationEvents: integer('collaboration_events').default(0),
  calculatedAt: timestamp('calculated_at').defaultNow(),
});

// 7. Executive Trigger Management System
// Data Sources - Define where monitoring data comes from
export const dataSources = pgTable('data_sources', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  sourceType: varchar('source_type', { length: 100 }).notNull(), // 'api', 'database', 'webhook', 'manual', 'integration'
  category: varchar('category', { length: 100 }), // 'supply_chain', 'financial', 'operational', 'hr', 'market'
  description: text('description'),
  configuration: jsonb('configuration'), // Connection details, API endpoints, query specs
  refreshRate: integer('refresh_rate'), // Minutes between updates
  lastRefreshedAt: timestamp('last_refreshed_at'),
  dataSchema: jsonb('data_schema'), // Structure of data provided
  isActive: boolean('is_active').default(true),
  createdBy: varchar('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Executive Triggers - Conditions executives define for monitoring
export const executiveTriggers = pgTable('executive_triggers', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 100 }), // 'supply_chain', 'financial', 'operational', 'hr', 'strategic'
  triggerType: varchar('trigger_type', { length: 100 }).notNull(), // 'threshold', 'trend', 'pattern', 'composite', 'event'
  dataSourceId: uuid('data_source_id').references(() => dataSources.id),
  conditions: jsonb('conditions').notNull(), // Trigger logic: {field, operator, value, logic}
  severity: priorityEnum('severity').default('medium'),
  alertThreshold: varchar('alert_threshold', { length: 50 }), // 'green', 'yellow', 'red'
  currentStatus: varchar('current_status', { length: 50 }).default('green'), // 'green', 'yellow', 'red', 'disabled'
  statusMessage: text('status_message'),
  recommendedPlaybooks: jsonb('recommended_playbooks'), // Array of playbook IDs
  notificationSettings: jsonb('notification_settings'), // Who gets alerted, how (email/SMS/Slack)
  isActive: boolean('is_active').default(true),
  lastTriggeredAt: timestamp('last_triggered_at'),
  triggerCount: integer('trigger_count').default(0),
  createdBy: varchar('created_by').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Trigger Monitoring History - Track trigger state changes
export const triggerMonitoringHistory = pgTable('trigger_monitoring_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  triggerId: uuid('trigger_id').references(() => executiveTriggers.id).notNull(),
  previousStatus: varchar('previous_status', { length: 50 }),
  newStatus: varchar('new_status', { length: 50 }).notNull(),
  triggerValue: jsonb('trigger_value'), // Actual data that triggered the alert
  metadata: jsonb('metadata'), // Additional context
  notificationsSent: jsonb('notifications_sent'), // Who was notified
  acknowledgedBy: varchar('acknowledged_by').references(() => users.id),
  acknowledgedAt: timestamp('acknowledged_at'),
  resolvedBy: varchar('resolved_by').references(() => users.id),
  resolvedAt: timestamp('resolved_at'),
  playbookActivated: uuid('playbook_activated'), // Reference to activated playbook/scenario
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

// Playbook-Trigger Associations - Link triggers to playbook execution
export const playbookTriggerAssociations = pgTable('playbook_trigger_associations', {
  id: uuid('id').primaryKey().defaultRandom(),
  triggerId: uuid('trigger_id').references(() => executiveTriggers.id).notNull(),
  playbookId: uuid('playbook_id').references(() => strategicScenarios.id).notNull(), // Link to strategic scenario as playbook
  autoActivate: boolean('auto_activate').default(false), // Auto-execute or require approval
  activationConditions: jsonb('activation_conditions'), // Additional conditions for activation
  executionPriority: integer('execution_priority').default(1), // Order if multiple playbooks match
  stakeholdersToNotify: jsonb('stakeholders_to_notify'), // Array of user IDs
  executionParameters: jsonb('execution_parameters'), // Playbook-specific configuration
  isActive: boolean('is_active').default(true),
  lastActivatedAt: timestamp('last_activated_at'),
  activationCount: integer('activation_count').default(0),
  averageExecutionTime: integer('average_execution_time'), // Seconds
  successRate: decimal('success_rate', { precision: 3, scale: 2 }), // 0.00 to 1.00
  createdBy: varchar('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Enhanced Scenario Data Capture - Comprehensive situation definition
// Scenario Type Enum
export const scenarioTypeEnum = pgEnum('scenario_type', ['growth', 'protection', 'transformation', 'operational', 'strategic']);
export const timeHorizonEnum = pgEnum('time_horizon', ['immediate', 'short_term', 'medium_term', 'long_term']); // 0-30, 30-90, 90-180, 180+ days
export const influenceLevelEnum = pgEnum('influence_level', ['low', 'medium', 'high', 'critical']);
export const stakeholderRoleEnum = pgEnum('stakeholder_role', ['sponsor', 'owner', 'contributor', 'informed', 'approver']);
export const metricCategoryEnum = pgEnum('metric_category', ['leading', 'lagging', 'efficiency', 'quality', 'risk']);

// Scenario Context - Extended strategic context beyond basic scenario data
export const scenarioContext = pgTable('scenario_context', {
  id: uuid('id').primaryKey().defaultRandom(),
  scenarioId: uuid('scenario_id').references(() => strategicScenarios.id, { onDelete: 'cascade' }).notNull().unique(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  
  // Strategic Framing
  mission: text('mission'), // Clear objective statement
  scenarioType: scenarioTypeEnum('scenario_type').notNull().default('operational'),
  timeHorizon: timeHorizonEnum('time_horizon').notNull().default('short_term'),
  businessImpactCategory: varchar('business_impact_category', { length: 100 }), // 'revenue', 'risk', 'efficiency', 'innovation'
  
  // Organizational Context
  primaryBusinessUnit: varchar('primary_business_unit', { length: 255 }),
  impactedProcesses: jsonb('impacted_processes'), // Array of process names
  dependencyMap: jsonb('dependency_map'), // {upstream: [], downstream: [], external: []}
  geographicScope: jsonb('geographic_scope'), // Array of regions/countries
  
  // Regulatory & Compliance
  regulatoryConstraints: jsonb('regulatory_constraints'),
  complianceWindows: jsonb('compliance_windows'), // Deadlines that must be met
  
  // Additional Context
  narrativeContext: text('narrative_context'), // Detailed scenario story
  historicalReferences: jsonb('historical_references'), // Similar past scenarios
  externalVendors: jsonb('external_vendors'), // External parties involved
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Stakeholder Matrix - Detailed stakeholder mapping with roles and influence
export const scenarioStakeholders = pgTable('scenario_stakeholders', {
  id: uuid('id').primaryKey().defaultRandom(),
  scenarioId: uuid('scenario_id').references(() => strategicScenarios.id, { onDelete: 'cascade' }).notNull(),
  
  // Stakeholder Identity
  userId: varchar('user_id').references(() => users.id), // Internal stakeholder
  externalName: varchar('external_name', { length: 255 }), // External stakeholder
  email: varchar('email', { length: 255 }),
  title: varchar('title', { length: 255 }),
  organization: varchar('organization', { length: 255 }), // For external stakeholders
  
  // Role & Influence
  role: stakeholderRoleEnum('role').notNull(),
  influenceLevel: influenceLevelEnum('influence_level').notNull().default('medium'),
  decisionAuthority: boolean('decision_authority').default(false), // Can they approve?
  isExecutiveSponsor: boolean('is_executive_sponsor').default(false),
  isAccountableOwner: boolean('is_accountable_owner').default(false),
  
  // Communication Preferences
  contactMethod: varchar('contact_method', { length: 50 }).default('email'), // 'email', 'sms', 'slack', 'teams'
  escalationPath: jsonb('escalation_path'), // Array of fallback contacts
  notificationPreferences: jsonb('notification_preferences'),
  
  // Approval Workflow
  approvalRequired: boolean('approval_required').default(false),
  approvalOrder: integer('approval_order'), // Sequence in approval chain
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Scenario Dependencies - Track scenario relationships and prerequisites
export const scenarioDependencies = pgTable('scenario_dependencies', {
  id: uuid('id').primaryKey().defaultRandom(),
  scenarioId: uuid('scenario_id').references(() => strategicScenarios.id, { onDelete: 'cascade' }).notNull(),
  dependentScenarioId: uuid('dependent_scenario_id').references(() => strategicScenarios.id, { onDelete: 'cascade' }).notNull(),
  dependencyType: varchar('dependency_type', { length: 50 }).notNull(), // 'prerequisite', 'blocker', 'related', 'alternative'
  description: text('description'),
  isCritical: boolean('is_critical').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Success Metrics - Define how success will be measured
export const scenarioSuccessMetrics = pgTable('scenario_success_metrics', {
  id: uuid('id').primaryKey().defaultRandom(),
  scenarioId: uuid('scenario_id').references(() => strategicScenarios.id, { onDelete: 'cascade' }).notNull(),
  
  // Metric Definition
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  category: metricCategoryEnum('category').notNull(),
  
  // Measurement Details
  dataSource: varchar('data_source', { length: 255 }), // Where this metric comes from
  measurementUnit: varchar('measurement_unit', { length: 50 }), // 'dollars', 'hours', 'percent', 'count'
  baselineValue: decimal('baseline_value', { precision: 15, scale: 2 }),
  targetValue: decimal('target_value', { precision: 15, scale: 2 }),
  currentValue: decimal('current_value', { precision: 15, scale: 2 }),
  
  // Tracking
  measurementFrequency: varchar('measurement_frequency', { length: 50 }), // 'realtime', 'daily', 'weekly', 'monthly'
  thresholdGreen: decimal('threshold_green', { precision: 15, scale: 2 }), // Success threshold
  thresholdYellow: decimal('threshold_yellow', { precision: 15, scale: 2 }), // Warning threshold
  thresholdRed: decimal('threshold_red', { precision: 15, scale: 2 }), // Critical threshold
  
  // Metadata
  isKeyMetric: boolean('is_key_metric').default(false), // Is this a primary success indicator?
  weight: decimal('weight', { precision: 3, scale: 2 }), // Importance weighting (0.00-1.00)
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Outcome Execution Log - Detailed tracking of scenario activations
export const outcomeExecutionLog = pgTable('outcome_execution_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  scenarioId: uuid('scenario_id').references(() => strategicScenarios.id).notNull(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  triggerId: uuid('trigger_id').references(() => executiveTriggers.id), // What triggered this activation?
  
  // Execution Timeline
  activatedAt: timestamp('activated_at').notNull().defaultNow(),
  stakeholdersNotifiedAt: timestamp('stakeholders_notified_at'),
  executionStartedAt: timestamp('execution_started_at'),
  executionCompletedAt: timestamp('execution_completed_at'),
  
  // Decision Tracking
  activatedBy: varchar('activated_by').references(() => users.id).notNull(),
  decisionMakers: jsonb('decision_makers'), // Array of user IDs who participated
  approvalChain: jsonb('approval_chain'), // Timeline of approvals
  executionMode: varchar('execution_mode', { length: 50 }), // 'automatic', 'manual', 'semi_automatic'
  
  // Execution Details
  tasksPlanned: integer('tasks_planned'),
  tasksCompleted: integer('tasks_completed'),
  tasksFailed: integer('tasks_failed'),
  deviationsFromPlan: jsonb('deviations_from_plan'), // Array of {task, planned, actual, reason}
  
  // Velocity Metrics
  timeToStakeholderCoordination: integer('time_to_stakeholder_coordination'), // Seconds to coordinate all stakeholders
  timeToFirstAction: integer('time_to_first_action'), // Seconds from trigger to first action
  totalExecutionTime: integer('total_execution_time'), // Seconds from start to completion
  
  // Outcome Assessment
  outcomeType: outcomeTypeEnum('outcome_type'),
  businessImpact: jsonb('business_impact'), // Quantified impact by category
  valueRealized: decimal('value_realized', { precision: 15, scale: 2 }), // $ value generated/saved
  
  // Learning Capture
  decisionsLog: jsonb('decisions_log'), // Array of {timestamp, decision, rationale, decider}
  lessonsLearned: jsonb('lessons_learned'), // Array of {category, lesson, recommendation}
  stakeholderFeedback: jsonb('stakeholder_feedback'), // Array of {stakeholder, rating, comments}
  improvementOpportunities: jsonb('improvement_opportunities'),
  
  // Post-Mortem
  reviewCompletedAt: timestamp('review_completed_at'),
  reviewedBy: varchar('reviewed_by').references(() => users.id),
  overallEffectiveness: effectivenessEnum('overall_effectiveness'),
  wouldReuse: boolean('would_reuse').default(true),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Trigger Signal Definitions - Individual signals that compose triggers
export const triggerSignals = pgTable('trigger_signals', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  
  // Signal Definition
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 100 }), // 'market', 'operational', 'financial', 'competitive'
  signalType: varchar('signal_type', { length: 100 }).notNull(), // 'metric', 'event', 'pattern', 'anomaly'
  
  // Data Source
  dataSourceId: varchar('data_source_id').references(() => dataSources.id),
  dataField: varchar('data_field', { length: 255 }), // Specific field to monitor
  samplingCadence: integer('sampling_cadence'), // Minutes between checks
  
  // Signal Logic
  operator: varchar('operator', { length: 50 }), // 'gt', 'lt', 'eq', 'contains', 'trend_up', 'trend_down'
  thresholdValue: text('threshold_value'), // Stored as text for flexibility
  guardband: decimal('guardband', { precision: 5, scale: 2 }), // Buffer to avoid false positives (0.00-1.00)
  
  // Weighting & Confidence
  confidenceWeight: decimal('confidence_weight', { precision: 3, scale: 2 }).default('1.00'), // Signal reliability (0.00-1.00)
  priority: priorityEnum('priority').default('medium'),
  
  // Current State
  currentValue: text('current_value'),
  lastEvaluatedAt: timestamp('last_evaluated_at'),
  isActive: boolean('is_active').default(true),
  
  createdBy: varchar('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Composite Trigger Logic - Combine multiple signals into complex triggers
export const compositeTriggerLogic = pgTable('composite_trigger_logic', {
  id: uuid('id').primaryKey().defaultRandom(),
  triggerId: uuid('trigger_id').references(() => executiveTriggers.id, { onDelete: 'cascade' }).notNull(),
  
  // Signal Combination
  signalIds: jsonb('signal_ids').notNull(), // Array of trigger_signal IDs
  logicOperator: varchar('logic_operator', { length: 50 }).notNull(), // 'AND', 'OR', 'WEIGHTED', 'SEQUENCE'
  weightedThreshold: decimal('weighted_threshold', { precision: 3, scale: 2 }), // For WEIGHTED logic
  sequenceWindow: integer('sequence_window'), // Minutes within which sequence must occur
  
  // Configuration
  minimumSignals: integer('minimum_signals').default(1), // Minimum signals that must fire
  evaluationWindow: integer('evaluation_window'), // Time window for evaluation (minutes)
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 8. Crisis Simulation & War Gaming
export const crisisSimulations = pgTable('crisis_simulations', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  scenarioType: varchar('scenario_type', { length: 100 }), // 'cyber_attack', 'supply_chain', 'financial'
  difficulty: varchar('difficulty', { length: 50 }), // 'basic', 'intermediate', 'advanced'
  participants: jsonb('participants'), // Array of user IDs and roles
  facilitator: varchar('facilitator'), // user ID
  objectives: jsonb('objectives'), // Learning objectives and success criteria
  scenarioData: jsonb('scenario_data'), // Initial conditions, events, constraints
  duration: integer('duration'), // planned duration in minutes
  status: simulationStatusEnum('status').default('draft'),
  startTime: timestamp('start_time'),
  endTime: timestamp('end_time'),
  currentPhase: varchar('current_phase', { length: 100 }),
  events: jsonb('events'), // Timeline of simulation events
  decisions: jsonb('decisions'), // Decisions made during simulation
  outcomes: jsonb('outcomes'), // Results and consequences
  performanceMetrics: jsonb('performance_metrics'),
  lessons: jsonb('lessons'), // Key learnings and insights
  feedback: jsonb('feedback'), // Participant feedback
  createdBy: varchar('created_by'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const simulationResults = pgTable('simulation_results', {
  id: uuid('id').primaryKey().defaultRandom(),
  simulationId: uuid('simulation_id').notNull(),
  participantId: varchar('participant_id').notNull(),
  role: varchar('role', { length: 100 }), // Role played in simulation
  decisions: jsonb('decisions'), // Decisions made by this participant
  responseTime: integer('response_time'), // Average response time in seconds
  decisionQuality: decimal('decision_quality', { precision: 3, scale: 2 }), // 0.00-1.00
  collaborationScore: decimal('collaboration_score', { precision: 3, scale: 2 }),
  leadershipScore: decimal('leadership_score', { precision: 3, scale: 2 }),
  stressHandling: decimal('stress_handling', { precision: 3, scale: 2 }),
  overallPerformance: decimal('overall_performance', { precision: 3, scale: 2 }),
  strengths: jsonb('strengths'), // Identified strengths
  improvementAreas: jsonb('improvement_areas'), // Areas for development
  personalizedFeedback: text('personalized_feedback'),
  createdAt: timestamp('created_at').defaultNow(),
});

// What-If Scenario Analysis - Executive decision modeling
export const whatIfScenarios = pgTable('what_if_scenarios', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  testConditions: jsonb('test_conditions').notNull(), // Conditions being tested (e.g., {"oil_price": 120, "market_volatility": 0.35})
  triggeredAlerts: jsonb('triggered_alerts'), // Array of trigger IDs that would fire
  recommendedPlaybooks: jsonb('recommended_playbooks'), // Array of playbook IDs that would activate
  projectedExecutionTime: integer('projected_execution_time'), // Estimated total execution time in minutes
  teamsInvolved: jsonb('teams_involved'), // Array of team/role IDs that would be mobilized
  resourceRequirements: jsonb('resource_requirements'), // Resources needed for execution
  riskAssessment: jsonb('risk_assessment'), // Identified risks and mitigation strategies
  industryComparison: jsonb('industry_comparison'), // How this compares to industry standards
  decisionVelocityMetrics: jsonb('decision_velocity_metrics'), // Speed advantage calculations
  savedForPresentation: boolean('saved_for_presentation').default(false), // Flag for board presentations
  presentationNotes: text('presentation_notes'), // Executive notes for board meetings
  tags: jsonb('tags'), // Categorization tags
  createdBy: varchar('created_by').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Executive Preparedness Score™ - The must-have feature for executive accountability
export const preparednessScores = pgTable('preparedness_scores', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: varchar('user_id').references(() => users.id).notNull(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  score: integer('score').notNull(), // 0-100 preparedness score
  previousScore: integer('previous_score'), // Previous score for trend tracking
  scoreDelta: integer('score_delta'), // Change from previous score
  scenariosPracticed: integer('scenarios_practiced').default(0), // Count of what-if analyses completed
  drillsCompleted: integer('drills_completed').default(0), // Count of playbook drills run
  coverageGaps: jsonb('coverage_gaps'), // Array of high-risk scenarios not yet addressed
  readinessMetrics: jsonb('readiness_metrics'), // Detailed breakdown of score components
  industryBenchmark: integer('industry_benchmark'), // Average score for industry peers
  peerPercentile: integer('peer_percentile'), // Percentile ranking vs peers (0-100)
  executiveRole: varchar('executive_role', { length: 100 }), // CEO, CFO, COO, etc.
  calculatedAt: timestamp('calculated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Preparedness Activities - Track all actions that impact preparedness score
export const preparednessActivities = pgTable('preparedness_activities', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: varchar('user_id').references(() => users.id).notNull(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  activityType: varchar('activity_type', { length: 100 }).notNull(), // 'scenario_practice', 'drill_completed', 'playbook_approved', 'trigger_configured'
  activityName: varchar('activity_name', { length: 255 }).notNull(),
  relatedEntityId: uuid('related_entity_id'), // ID of scenario, playbook, trigger, etc.
  relatedEntityType: varchar('related_entity_type', { length: 100 }), // 'scenario', 'playbook', 'trigger'
  scoreImpact: integer('score_impact'), // How many points this activity added/removed
  metadata: jsonb('metadata'), // Additional activity details
  completedAt: timestamp('completed_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Peer Benchmarks - Industry and role-based comparison data
export const peerBenchmarks = pgTable('peer_benchmarks', {
  id: uuid('id').primaryKey().defaultRandom(),
  industry: varchar('industry', { length: 100 }).notNull(),
  executiveRole: varchar('executive_role', { length: 100 }).notNull(), // CEO, CFO, COO, etc.
  organizationSize: varchar('organization_size', { length: 50 }), // 'small', 'mid-market', 'enterprise', 'fortune-500'
  averageScore: decimal('average_score', { precision: 5, scale: 2 }).notNull(), // Average preparedness score for this cohort
  medianScore: decimal('median_score', { precision: 5, scale: 2 }),
  topQuartileScore: decimal('top_quartile_score', { precision: 5, scale: 2 }), // 75th percentile
  bottomQuartileScore: decimal('bottom_quartile_score', { precision: 5, scale: 2 }), // 25th percentile
  sampleSize: integer('sample_size'), // Number of executives in this benchmark
  averageScenariosCompleted: decimal('average_scenarios_completed', { precision: 5, scale: 2 }),
  averageDrillsCompleted: decimal('average_drills_completed', { precision: 5, scale: 2 }),
  topPerformingActions: jsonb('top_performing_actions'), // Activities most correlated with high scores
  benchmarkPeriod: varchar('benchmark_period', { length: 50 }), // 'Q1-2025', 'annual-2024', etc.
  calculatedAt: timestamp('calculated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// ============================================================================
// NFL METHODOLOGY - 166 PLAYBOOK LIBRARY TAXONOMY
// ============================================================================

// Playbook Domains - 9 Strategic Domains from NFL coaching methodology (including AI Governance)
export const playbookDomains = pgTable('playbook_domains', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(), // "Competitive Threats", "Operational Disruptions", etc.
  code: varchar('code', { length: 50 }).notNull().unique(), // "DOMAIN1", "DOMAIN2", etc.
  description: text('description'),
  icon: varchar('icon', { length: 50 }), // Icon name for UI
  color: varchar('color', { length: 50 }), // Color code for UI (#FF5733)
  sequence: integer('sequence').notNull(), // 1-8 for ordering
  primaryExecutiveRole: varchar('primary_executive_role', { length: 100 }), // CEO, COO, CFO, etc.
  totalPlaybooks: integer('total_playbooks').default(0), // Count of playbooks in this domain
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Playbook Categories - subcategories under the 9 domains
export const playbookCategories = pgTable('playbook_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  domainId: uuid('domain_id').references(() => playbookDomains.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(), // "Market Position Threats", "Supply Chain Crises", etc.
  description: text('description'),
  sequence: integer('sequence').notNull(), // Order within domain
  totalPlaybooks: integer('total_playbooks').default(0), // Count of playbooks in this category
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Playbook Library - The 166 template playbooks (separate from org-specific scenarios)
export const playbookLibrary = pgTable('playbook_library', {
  id: uuid('id').primaryKey().defaultRandom(),
  playbookNumber: integer('playbook_number').notNull().unique(), // 1-180 (166 active playbooks)
  domainId: uuid('domain_id').references(() => playbookDomains.id).notNull(),
  categoryId: uuid('category_id').references(() => playbookCategories.id).notNull(),
  
  // Strategic Category (Marketing taxonomy: OFFENSE/DEFENSE/SPECIAL TEAMS)
  strategicCategory: strategicCategoryEnum('strategic_category').notNull().default('defense'),
  
  // Basic Info
  name: varchar('name', { length: 255 }).notNull(), // "New Market Entrant (Funded Startup)"
  description: text('description'),
  
  // Executive Accountability (80/20 Framework)
  primaryExecutiveRole: varchar('primary_executive_role', { length: 50 }), // CEO, COO, CFO, CLO, CTO, CHRO, CMO, Board
  
  // Trigger Definition (100% Pre-filled - Section 1)
  triggerCriteria: text('trigger_criteria').notNull(), // What activates this playbook
  triggerDataSources: jsonb('trigger_data_sources'), // Which enterprise systems to monitor
  triggerThreshold: jsonb('trigger_threshold'), // Specific thresholds (e.g., confidence ≥85%)
  severityScore: integer('severity_score'), // 0-100 threat assessment score
  timeSensitivity: integer('time_sensitivity'), // Critical response window in hours (e.g., 12 hours)
  historicalFrequency: varchar('historical_frequency', { length: 50 }), // How often this occurs annually
  activationFrequencyTier: varchar('activation_frequency_tier', { length: 20 }), // HIGH, MEDIUM, LOW, RARE, VERY_RARE
  
  // Key Stakeholders (90% Pre-filled - Section 2)
  tier1Stakeholders: jsonb('tier1_stakeholders'), // Decision makers (CEO, CFO, etc.) - roles, not specific people
  tier2Stakeholders: jsonb('tier2_stakeholders'), // Execution team (VPs, Directors)
  tier3Stakeholders: jsonb('tier3_stakeholders'), // Notification groups (all sales, all eng)
  externalPartners: jsonb('external_partners'), // Lawyers, PR firms, consultants
  tier1Count: integer('tier1_count'), // Expected number of Tier 1 participants (8-12)
  tier2Count: integer('tier2_count'), // Expected number of Tier 2 participants (30-50)
  tier3Count: integer('tier3_count'), // Expected number of Tier 3 participants (100-200)
  
  // Primary Response Strategy
  primaryResponseStrategy: text('primary_response_strategy'),
  
  // Budget & Authority (100% Pre-filled - Section 6)
  preApprovedBudget: decimal('pre_approved_budget', { precision: 12, scale: 2 }), // Emergency budget limit
  budgetApprovalRequired: boolean('budget_approval_required').default(false), // Whether board approval needed
  vendorContracts: jsonb('vendor_contracts'), // Pre-negotiated vendor hourly rates
  externalResourceRoster: jsonb('external_resource_roster'), // Lawyers, PR firms, consultants on retainer
  
  // Execution Metrics
  targetExecutionTime: integer('target_execution_time').default(12), // Target minutes (usually 12)
  averageActivationFrequency: varchar('average_activation_frequency', { length: 50 }), // "high", "medium", "low", "rare"
  historicalSuccessRate: decimal('historical_success_rate', { precision: 3, scale: 2 }), // 0.00 to 1.00
  
  // Success Metrics (80% Pre-filled - Section 7)
  targetResponseSpeed: integer('target_response_speed').default(12), // Target minutes to coordination
  targetStakeholderReach: decimal('target_stakeholder_reach', { precision: 3, scale: 2 }).default(sql`1.00`), // Target % Tier 1 participation
  outcomeMetrics: jsonb('outcome_metrics'), // Market share retention, customer churn, etc.
  learningMetrics: jsonb('learning_metrics'), // What to measure for improvement
  
  // Metadata
  isPremium: boolean('is_premium').default(false), // Some playbooks might be premium tier
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ============================================================================
// TEMPLATE SYSTEM - Universal 8-Section 80/20 Framework
// ============================================================================

// Playbook Templates - Canonical template definitions
export const playbookTemplates = pgTable('playbook_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(), // "M Universal Playbook Template v1.0"
  version: varchar('version', { length: 50 }).notNull().default('1.0'),
  description: text('description'),
  isActive: boolean('is_active').default(true),
  domainOverlays: jsonb('domain_overlays'), // Domain-specific customizations
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Template Sections - The 8 sections of the 80/20 framework
export const playbookTemplateSections = pgTable('playbook_template_sections', {
  id: uuid('id').primaryKey().defaultRandom(),
  templateId: uuid('template_id').references(() => playbookTemplates.id, { onDelete: 'cascade' }).notNull(),
  sectionNumber: integer('section_number').notNull(), // 1-8
  sectionName: varchar('section_name', { length: 255 }).notNull(), // "Situation Definition", "Stakeholder Matrix", etc.
  sectionCode: varchar('section_code', { length: 50 }).notNull(), // "situation", "stakeholders", "decision_trees", etc.
  prefilledPercentage: integer('prefilled_percentage').notNull(), // 100, 90, 85, 80, 75, 100, 80, 0
  description: text('description'),
  fieldMappings: jsonb('field_mappings'), // Maps to playbookLibrary columns
  requiredFields: jsonb('required_fields'), // Which fields must be filled
  sequence: integer('sequence').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Playbook Customizations - Track user customizations per playbook
export const playbookCustomizations = pgTable('playbook_customizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  playbookId: uuid('playbook_id').references(() => playbookLibrary.id, { onDelete: 'cascade' }).notNull(),
  organizationId: uuid('organization_id').references(() => organizations.id), // Null = master template
  
  // Section Completion Tracking
  situationCompleted: boolean('situation_completed').default(false),
  stakeholdersCompleted: boolean('stakeholders_completed').default(false),
  decisionTreesCompleted: boolean('decision_trees_completed').default(false),
  communicationCompleted: boolean('communication_completed').default(false),
  taskSequencesCompleted: boolean('task_sequences_completed').default(false),
  budgetCompleted: boolean('budget_completed').default(false),
  successMetricsCompleted: boolean('success_metrics_completed').default(false),
  lessonsLearnedCompleted: boolean('lessons_learned_completed').default(false),
  
  // Overall Metrics
  preparednessScore: decimal('preparedness_score', { precision: 5, scale: 2 }), // 0.00-100.00
  lastCustomizedAt: timestamp('last_customized_at'),
  lastCustomizedBy: varchar('last_customized_by').references(() => users.id),
  
  // Customization Data (JSON overrides)
  customData: jsonb('custom_data'), // Any custom field values that override template
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Communication Templates - 80% pre-filled templates for each playbook
export const playbookCommunicationTemplates = pgTable('playbook_communication_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  playbookId: uuid('playbook_id').references(() => playbookLibrary.id, { onDelete: 'cascade' }).notNull(),
  templateType: varchar('template_type', { length: 100 }).notNull(), // "board_memo", "customer_email", "media_statement", "employee_townhall", "regulator_notification"
  templateName: varchar('template_name', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 500 }), // Email/memo subject line (with variables)
  bodyTemplate: text('body_template').notNull(), // Template with {{variables}} for customization
  variables: jsonb('variables'), // List of variables that need to be filled in (the 20%)
  recipientRoles: jsonb('recipient_roles'), // Who gets this communication
  sendTiming: varchar('send_timing', { length: 100 }), // "T+0", "T+2min", "T+8min", etc.
  isRequired: boolean('is_required').default(true), // Must this be sent?
  createdAt: timestamp('created_at').defaultNow(),
});

// Decision Trees - Pre-mapped decision checkpoints for each playbook
export const playbookDecisionTrees = pgTable('playbook_decision_trees', {
  id: uuid('id').primaryKey().defaultRandom(),
  playbookId: uuid('playbook_id').references(() => playbookLibrary.id, { onDelete: 'cascade' }).notNull(),
  checkpointNumber: integer('checkpoint_number').notNull(), // 1, 2, 3... up to 12
  checkpointName: varchar('checkpoint_name', { length: 255 }).notNull(),
  checkpointTiming: varchar('checkpoint_timing', { length: 50 }), // "T+2min", "T+4min", etc.
  decisionQuestion: text('decision_question').notNull(), // What decision needs to be made?
  decisionOptions: jsonb('decision_options').notNull(), // Array of options (A, B, C)
  decisionCriteria: jsonb('decision_criteria'), // Criteria for each option
  decisionAuthority: varchar('decision_authority', { length: 100 }), // Who makes this decision (CEO, CFO, etc.)
  sequence: integer('sequence').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Task Sequences - Minute-by-minute execution timelines (75% Pre-filled - Section 5)
export const playbookTaskSequences = pgTable('playbook_task_sequences', {
  id: uuid('id').primaryKey().defaultRandom(),
  playbookId: uuid('playbook_id').references(() => playbookLibrary.id, { onDelete: 'cascade' }).notNull(),
  taskName: varchar('task_name', { length: 255 }).notNull(),
  taskDescription: text('task_description'),
  timing: varchar('timing', { length: 50 }).notNull(), // "T+0:00", "T+2:00", "T+4:30", etc.
  timelinePhase: varchar('timeline_phase', { length: 50 }), // "first_2_hours", "first_24_hours", "first_week", "first_month"
  taskOwner: varchar('task_owner', { length: 100 }), // Role responsible (CTO, CFO, etc.)
  dependencies: jsonb('dependencies'), // Array of task IDs this depends on
  sequence: integer('sequence').notNull(),
  isRequired: boolean('is_required').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// Practice Drills - Fire drill scheduling and tracking
export const practiceDrills = pgTable('practice_drills', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  playbookId: uuid('playbook_id').references(() => playbookLibrary.id).notNull(),
  
  // Drill Details
  drillName: varchar('drill_name', { length: 255 }).notNull(),
  drillType: varchar('drill_type', { length: 100 }).default('scheduled'), // "scheduled", "surprise", "simulation"
  scenarioDescription: text('scenario_description'), // The simulated crisis scenario
  
  // Scheduling
  scheduledDate: timestamp('scheduled_date').notNull(),
  scheduledTime: varchar('scheduled_time', { length: 50 }),
  estimatedDuration: integer('estimated_duration').default(30), // minutes
  
  // Participants
  invitedParticipants: jsonb('invited_participants'), // Array of user IDs
  actualParticipants: jsonb('actual_participants'), // Who actually joined
  
  // Status
  status: varchar('status', { length: 50 }).default('scheduled'), // "scheduled", "in_progress", "completed", "cancelled"
  
  // Results
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  actualDuration: integer('actual_duration'), // Actual minutes taken
  
  // AI Complications (for realism)
  complications: jsonb('complications'), // AI-injected complications during drill
  
  // Metadata
  createdBy: varchar('created_by').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Drill Performance - Detailed performance tracking for each drill
export const drillPerformance = pgTable('drill_performance', {
  id: uuid('id').primaryKey().defaultRandom(),
  drillId: uuid('drill_id').references(() => practiceDrills.id, { onDelete: 'cascade' }).notNull(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  playbookId: uuid('playbook_id').references(() => playbookLibrary.id).notNull(),
  
  // Speed Metrics
  targetExecutionTime: integer('target_execution_time').default(12), // Target minutes
  actualExecutionTime: integer('actual_execution_time'), // Actual minutes taken
  executionSpeedScore: integer('execution_speed_score'), // 0-100 score
  
  // Phase Timing (in seconds)
  triggerToAlert: integer('trigger_to_alert'), // How long to send alert (seconds)
  alertToActivation: integer('alert_to_activation'), // How long to activate (seconds)
  activationToWarRoom: integer('activation_to_war_room'), // How long to assemble (seconds)
  warRoomToDecision: integer('war_room_to_decision'), // How long to decide (seconds)
  decisionToExecution: integer('decision_to_execution'), // How long to execute (seconds)
  
  // Participation Metrics
  tier1Participation: decimal('tier1_participation', { precision: 3, scale: 2 }), // % of Tier 1 who joined (0.00-1.00)
  tier2Participation: decimal('tier2_participation', { precision: 3, scale: 2 }), // % of Tier 2 who joined
  tier3Acknowledgment: decimal('tier3_acknowledgment', { precision: 3, scale: 2 }), // % of Tier 3 who acknowledged
  
  // Role Clarity
  roleClarity: decimal('role_clarity', { precision: 3, scale: 2 }), // % who understood their tasks (0.00-1.00)
  
  // Bottlenecks Identified
  bottlenecks: jsonb('bottlenecks'), // Array of identified bottlenecks
  
  // Communication Effectiveness
  communicationsSent: integer('communications_sent'),
  communicationsDelivered: integer('communications_delivered'),
  communicationEffectiveness: decimal('communication_effectiveness', { precision: 3, scale: 2 }),
  
  // Overall Performance
  overallScore: integer('overall_score'), // 0-100
  passed: boolean('passed').default(false), // Did they meet target?
  
  // Lessons & Improvements
  whatWorked: text('what_worked'),
  whatDidntWork: text('what_didnt_work'),
  recommendations: jsonb('recommendations'),
  
  createdAt: timestamp('created_at').defaultNow(),
});

// AI Optimization Suggestions - AI-generated playbook improvements
export const aiOptimizationSuggestions = pgTable('ai_optimization_suggestions', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  playbookId: uuid('playbook_id').references(() => playbookLibrary.id).notNull(),
  
  // Suggestion Details
  suggestionType: varchar('suggestion_type', { length: 100 }).notNull(), // "reorder_decision_tree", "add_stakeholder", "update_template", "adjust_budget", "add_trigger"
  suggestionTitle: varchar('suggestion_title', { length: 255 }).notNull(),
  suggestionDescription: text('suggestion_description').notNull(),
  
  // Current vs Recommended
  currentValue: jsonb('current_value'), // What exists now
  recommendedValue: jsonb('recommended_value'), // What AI recommends
  
  // Rationale
  rationale: text('rationale').notNull(), // Why this change is recommended
  dataSupporting: jsonb('data_supporting'), // Performance data supporting this
  
  // Impact Estimation
  estimatedTimeImprovement: integer('estimated_time_improvement'), // Estimated minutes saved
  estimatedSuccessImprovement: decimal('estimated_success_improvement', { precision: 3, scale: 2 }), // Estimated success rate increase
  confidence: decimal('confidence', { precision: 3, scale: 2 }).notNull(), // AI confidence (0.00-1.00)
  
  // Status
  status: varchar('status', { length: 50 }).default('pending'), // "pending", "accepted", "modified", "rejected"
  reviewedBy: varchar('reviewed_by').references(() => users.id),
  reviewedAt: timestamp('reviewed_at'),
  implementedAt: timestamp('implemented_at'),
  
  // Metadata
  generatedAt: timestamp('generated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Playbook Activations - Track real-world playbook uses (links to executionInstances)
export const playbookActivations = pgTable('playbook_activations', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  playbookId: uuid('playbook_id').references(() => playbookLibrary.id).notNull(),
  executionInstanceId: uuid('execution_instance_id').references(() => executionInstances.id), // Link to existing execution tracking
  
  // Activation Context
  triggerEventId: uuid('trigger_event_id'), // What triggered this
  activatedBy: varchar('activated_by').references(() => users.id).notNull(),
  activationReason: text('activation_reason'),
  situationSummary: text('situation_summary'), // The specific situation (the 20% customization)
  
  // Execution Outcome
  successRating: integer('success_rating'), // 0-100
  actualExecutionTime: integer('actual_execution_time'), // minutes
  targetMet: boolean('target_met'), // Did they hit the 12-minute target?
  
  // Learning
  lessonsLearned: text('lessons_learned'),
  playbookImprovements: jsonb('playbook_improvements'), // Suggested improvements
  
  // Timestamps
  activatedAt: timestamp('activated_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 8. Compliance & Governance Framework
export const complianceFrameworks = pgTable('compliance_frameworks', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(), // 'SOX', 'GDPR', 'ISO27001', etc.
  category: varchar('category', { length: 100 }), // 'financial', 'security', 'operational'
  version: varchar('version', { length: 50 }),
  requirements: jsonb('requirements'), // Detailed compliance requirements
  controls: jsonb('controls'), // Control frameworks and procedures
  assessmentCriteria: jsonb('assessment_criteria'),
  reportingSchedule: varchar('reporting_schedule', { length: 100 }),
  responsibleParty: varchar('responsible_party'), // user ID
  status: complianceStatusEnum('status').default('under_review'),
  lastAssessment: timestamp('last_assessment'),
  nextAssessment: timestamp('next_assessment'),
  riskLevel: riskLevelEnum('risk_level').default('moderate'),
  documentation: jsonb('documentation'), // Supporting documents and evidence
  auditTrail: jsonb('audit_trail'), // History of changes and assessments
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const complianceReports = pgTable('compliance_reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull(),
  frameworkId: uuid('framework_id').notNull(),
  reportType: varchar('report_type', { length: 100 }), // 'quarterly', 'annual', 'exception', 'audit'
  reportingPeriod: varchar('reporting_period', { length: 100 }),
  overallStatus: complianceStatusEnum('overall_status').default('compliant'),
  complianceScore: decimal('compliance_score', { precision: 3, scale: 2 }), // 0.00-1.00
  controlsAssessed: integer('controls_assessed'),
  controlsPassed: integer('controls_passed'),
  controlsFailed: integer('controls_failed'),
  exceptions: jsonb('exceptions'), // Controls with exceptions
  remediation: jsonb('remediation'), // Action plans for non-compliance
  evidence: jsonb('evidence'), // Supporting evidence and documentation
  recommendations: jsonb('recommendations'), // Improvement recommendations
  riskAssessment: jsonb('risk_assessment'),
  executiveSummary: text('executive_summary'),
  detailedFindings: jsonb('detailed_findings'),
  generatedBy: varchar('generated_by'), // user ID or 'system'
  reviewedBy: varchar('reviewed_by'), // user ID
  approvedBy: varchar('approved_by'), // user ID
  submittedAt: timestamp('submitted_at'),
  dueDate: timestamp('due_date'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Background Jobs Table for PostgreSQL-based job queue
export const backgroundJobs = pgTable('background_jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  queueName: varchar('queue_name', { length: 100 }).notNull(), // 'analysis', 'reports', 'alerts'
  jobType: varchar('job_type', { length: 100 }).notNull(), // Specific job type within queue
  data: jsonb('data').notNull(), // Job payload
  priority: integer('priority').default(0), // Higher numbers = higher priority
  status: jobStatusEnum('status').default('pending'),
  maxRetries: integer('max_retries').default(3),
  attempts: integer('attempts').default(0),
  error: text('error'), // Last error message
  result: jsonb('result'), // Job result data
  runAt: timestamp('run_at').defaultNow(), // When job should run
  startedAt: timestamp('started_at'), // When processing started
  completedAt: timestamp('completed_at'), // When job completed
  failedAt: timestamp('failed_at'), // When job failed permanently
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('idx_background_jobs_queue_status').on(table.queueName, table.status),
  index('idx_background_jobs_run_at').on(table.runAt),
  index('idx_background_jobs_priority').on(table.priority)
]);

export type BackgroundJob = typeof backgroundJobs.$inferSelect;

// Decision Confidence Scoring - Real-time confidence metrics for playbook activation decisions
export const decisionConfidence = pgTable('decision_confidence', {
  id: uuid('id').primaryKey().defaultRandom(),
  scenarioId: uuid('scenario_id').references(() => strategicScenarios.id).notNull(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  userId: varchar('user_id').references(() => users.id).notNull(), // Executive making decision
  overallConfidence: integer('overall_confidence').notNull(), // 0-100 overall confidence score
  dataCompleteness: integer('data_completeness').notNull(), // 0-100 percentage of required data available
  stakeholderAlignment: integer('stakeholder_alignment').notNull(), // 0-100 percentage of key stakeholders aligned
  historicalPrecedent: integer('historical_precedent'), // Number of similar successful executions
  riskCoverage: integer('risk_coverage').notNull(), // 0-100 percentage of identified risks mitigated
  confidenceFactors: jsonb('confidence_factors').notNull(), // Detailed breakdown of confidence components
  missingElements: jsonb('missing_elements'), // Array of gaps that reduce confidence
  recommendations: jsonb('recommendations'), // AI suggestions to improve confidence before activation
  calculatedAt: timestamp('calculated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Stakeholder Alignment Tracking - Real-time coordination and acknowledgment tracking
export const stakeholderAlignment = pgTable('stakeholder_alignment', {
  id: uuid('id').primaryKey().defaultRandom(),
  scenarioId: uuid('scenario_id').references(() => strategicScenarios.id).notNull(),
  executionId: uuid('execution_id'), // Link to specific playbook execution instance
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  stakeholderId: varchar('stakeholder_id').references(() => users.id).notNull(),
  stakeholderRole: varchar('stakeholder_role', { length: 100 }).notNull(), // 'Legal', 'Finance', 'Communications', etc.
  department: varchar('department', { length: 100 }),
  hasAcknowledged: boolean('has_acknowledged').default(false),
  acknowledgedAt: timestamp('acknowledged_at'),
  assignedTasks: jsonb('assigned_tasks'), // Array of task IDs assigned to this stakeholder
  completedTasks: jsonb('completed_tasks'), // Array of completed task IDs
  taskCompletionRate: decimal('task_completion_rate', { precision: 3, scale: 2 }), // 0.00-1.00
  responseTime: integer('response_time'), // Minutes from notification to acknowledgment
  blockers: jsonb('blockers'), // Array of issues preventing task completion
  status: varchar('status', { length: 50 }).default('pending'), // 'pending', 'acknowledged', 'in_progress', 'completed'
  notifiedAt: timestamp('notified_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Execution Validation Reports - Post-execution analysis comparing predicted vs actual outcomes
export const executionValidationReports = pgTable('execution_validation_reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  scenarioId: uuid('scenario_id').references(() => strategicScenarios.id).notNull(),
  executionId: uuid('execution_id').notNull(), // Unique identifier for this specific execution
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  executedBy: varchar('executed_by').references(() => users.id).notNull(),
  executionDate: timestamp('execution_date').notNull(),
  validationDate: timestamp('validation_date').defaultNow(), // Date report was generated (48hrs after execution)
  
  // Predicted vs Actual Comparisons
  predictedExecutionTime: integer('predicted_execution_time'), // Minutes
  actualExecutionTime: integer('actual_execution_time'), // Minutes
  timeSavingsRealized: integer('time_savings_realized'), // Minutes saved vs traditional approach
  
  predictedOutcomes: jsonb('predicted_outcomes').notNull(), // Expected results from playbook
  actualOutcomes: jsonb('actual_outcomes').notNull(), // Actual results achieved
  outcomeAccuracy: decimal('outcome_accuracy', { precision: 3, scale: 2 }), // 0.00-1.00 prediction accuracy
  
  predictedCost: decimal('predicted_cost', { precision: 12, scale: 2 }),
  actualCost: decimal('actual_cost', { precision: 12, scale: 2 }),
  
  predictedRisks: jsonb('predicted_risks'), // Risks identified before execution
  actualRisks: jsonb('actual_risks'), // Risks that materialized during execution
  riskPredictionAccuracy: decimal('risk_prediction_accuracy', { precision: 3, scale: 2 }),
  
  // Success Metrics
  overallSuccessRating: integer('overall_success_rating').notNull(), // 1-10 rating
  kpiTargetsHit: integer('kpi_targets_hit'), // Number of KPI targets achieved
  kpiTargetsTotal: integer('kpi_targets_total'), // Total number of KPI targets
  
  // Learnings and Improvements
  whatWorked: jsonb('what_worked'), // Array of successful strategies
  whatFailed: jsonb('what_failed'), // Array of unsuccessful strategies
  unexpectedChallenges: jsonb('unexpected_challenges'), // Surprises encountered
  playbookImprovements: jsonb('playbook_improvements'), // Recommended changes to playbook
  institutionalLearnings: text('institutional_learnings'), // Key takeaways for future executions
  
  // ROI Calculation
  estimatedRoi: decimal('estimated_roi', { precision: 12, scale: 2 }), // Return on investment
  timeSavedHours: decimal('time_saved_hours', { precision: 8, scale: 2 }),
  costSavedUsd: decimal('cost_saved_usd', { precision: 12, scale: 2 }),
  
  // Stakeholder Feedback
  stakeholderFeedback: jsonb('stakeholder_feedback'), // Feedback from involved stakeholders
  executiveSummary: text('executive_summary'), // High-level summary for board
  
  // Confidence for Future Use
  recommendForFutureUse: boolean('recommend_for_future_use').default(true),
  confidenceAdjustment: integer('confidence_adjustment'), // +/- adjustment to future confidence scores
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Insert schemas for new tables
export const insertRoiMetricSchema = createInsertSchema(roiMetrics).pick({
  organizationId: true,
  metricName: true,
  category: true,
  baseline: true,
  currentValue: true,
  targetValue: true,
  unit: true,
  calculationMethod: true,
  metadata: true,
});

export const insertQuickStartTemplateSchema = createInsertSchema(quickStartTemplates).pick({
  name: true,
  category: true,
  industry: true,
  organizationSize: true,
  description: true,
  templateData: true,
  requirements: true,
  estimatedSetupTime: true,
});

export const insertEnterpriseIntegrationSchema = createInsertSchema(enterpriseIntegrations).pick({
  organizationId: true,
  name: true,
  integrationType: true,
  vendor: true,
  configuration: true,
  dataMapping: true,
  syncFrequency: true,
  apiEndpoint: true,
  webhookUrl: true,
  authenticationType: true,
});

export const insertCrisisSimulationSchema = createInsertSchema(crisisSimulations).pick({
  organizationId: true,
  name: true,
  scenarioType: true,
  difficulty: true,
  participants: true,
  facilitator: true,
  objectives: true,
  scenarioData: true,
  duration: true,
  status: true,
  startTime: true,
  createdBy: true,
});

export const insertComplianceFrameworkSchema = createInsertSchema(complianceFrameworks).pick({
  organizationId: true,
  name: true,
  category: true,
  version: true,
  requirements: true,
  controls: true,
  assessmentCriteria: true,
  reportingSchedule: true,
  responsibleParty: true,
});

export const insertBackgroundJobSchema = createInsertSchema(backgroundJobs).pick({
  queueName: true,
  jobType: true,
  data: true,
  priority: true,
  maxRetries: true,
  runAt: true,
});

// Trigger Management Types
export type DataSource = typeof dataSources.$inferSelect;
export type InsertDataSource = typeof dataSources.$inferInsert;

export type ExecutiveTrigger = typeof executiveTriggers.$inferSelect;
export type InsertExecutiveTrigger = typeof executiveTriggers.$inferInsert;

export type TriggerMonitoringHistory = typeof triggerMonitoringHistory.$inferSelect;
export type InsertTriggerMonitoringHistory = typeof triggerMonitoringHistory.$inferInsert;

export type PlaybookTriggerAssociation = typeof playbookTriggerAssociations.$inferSelect;
export type InsertPlaybookTriggerAssociation = typeof playbookTriggerAssociations.$inferInsert;

// Enhanced Scenario Data Capture Types
export type ScenarioContext = typeof scenarioContext.$inferSelect;
export type InsertScenarioContext = typeof scenarioContext.$inferInsert;

export type ScenarioStakeholder = typeof scenarioStakeholders.$inferSelect;
export type InsertScenarioStakeholder = typeof scenarioStakeholders.$inferInsert;

export type ScenarioDependency = typeof scenarioDependencies.$inferSelect;
export type InsertScenarioDependency = typeof scenarioDependencies.$inferInsert;

export type ScenarioSuccessMetric = typeof scenarioSuccessMetrics.$inferSelect;
export type InsertScenarioSuccessMetric = typeof scenarioSuccessMetrics.$inferInsert;

export type OutcomeExecutionLog = typeof outcomeExecutionLog.$inferSelect;
export type InsertOutcomeExecutionLog = typeof outcomeExecutionLog.$inferInsert;

export type TriggerSignal = typeof triggerSignals.$inferSelect;
export type InsertTriggerSignal = typeof triggerSignals.$inferInsert;

export type CompositeTriggerLogic = typeof compositeTriggerLogic.$inferSelect;
export type InsertCompositeTriggerLogic = typeof compositeTriggerLogic.$inferInsert;

// Enhanced Scenario Data Capture Insert Schemas
export const insertScenarioContextSchema = createInsertSchema(scenarioContext).pick({
  scenarioId: true,
  organizationId: true,
  mission: true,
  scenarioType: true,
  timeHorizon: true,
  businessImpactCategory: true,
  primaryBusinessUnit: true,
  impactedProcesses: true,
  dependencyMap: true,
  geographicScope: true,
  regulatoryConstraints: true,
  complianceWindows: true,
  narrativeContext: true,
  historicalReferences: true,
  externalVendors: true,
});

export const insertScenarioStakeholderSchema = createInsertSchema(scenarioStakeholders).pick({
  scenarioId: true,
  userId: true,
  externalName: true,
  email: true,
  title: true,
  organization: true,
  role: true,
  influenceLevel: true,
  decisionAuthority: true,
  isExecutiveSponsor: true,
  isAccountableOwner: true,
  contactMethod: true,
  escalationPath: true,
  notificationPreferences: true,
  approvalRequired: true,
  approvalOrder: true,
});

export const insertScenarioDependencySchema = createInsertSchema(scenarioDependencies).pick({
  scenarioId: true,
  dependentScenarioId: true,
  dependencyType: true,
  description: true,
  isCritical: true,
});

export const insertScenarioSuccessMetricSchema = createInsertSchema(scenarioSuccessMetrics).pick({
  scenarioId: true,
  name: true,
  description: true,
  category: true,
  dataSource: true,
  measurementUnit: true,
  baselineValue: true,
  targetValue: true,
  currentValue: true,
  measurementFrequency: true,
  thresholdGreen: true,
  thresholdYellow: true,
  thresholdRed: true,
  isKeyMetric: true,
  weight: true,
});

export const insertOutcomeExecutionLogSchema = createInsertSchema(outcomeExecutionLog).pick({
  scenarioId: true,
  organizationId: true,
  triggerId: true,
  activatedBy: true,
  decisionMakers: true,
  approvalChain: true,
  executionMode: true,
  tasksPlanned: true,
  tasksCompleted: true,
  tasksFailed: true,
  deviationsFromPlan: true,
  businessImpact: true,
  valueRealized: true,
  decisionsLog: true,
  lessonsLearned: true,
  stakeholderFeedback: true,
  improvementOpportunities: true,
  overallEffectiveness: true,
  wouldReuse: true,
});

export const insertTriggerSignalSchema = createInsertSchema(triggerSignals).pick({
  organizationId: true,
  name: true,
  description: true,
  category: true,
  signalType: true,
  dataSourceId: true,
  dataField: true,
  samplingCadence: true,
  operator: true,
  thresholdValue: true,
  guardband: true,
  confidenceWeight: true,
  priority: true,
  isActive: true,
  createdBy: true,
});

export const insertCompositeTriggerLogicSchema = createInsertSchema(compositeTriggerLogic).pick({
  triggerId: true,
  signalIds: true,
  logicOperator: true,
  weightedThreshold: true,
  sequenceWindow: true,
  minimumSignals: true,
  evaluationWindow: true,
});

// Trigger Management Insert Schemas
export const insertDataSourceSchema = createInsertSchema(dataSources).pick({
  organizationId: true,
  name: true,
  sourceType: true,
  category: true,
  description: true,
  configuration: true,
  refreshRate: true,
  dataSchema: true,
  createdBy: true,
});

export const insertExecutiveTriggerSchema = createInsertSchema(executiveTriggers).pick({
  organizationId: true,
  name: true,
  description: true,
  category: true,
  triggerType: true,
  dataSourceId: true,
  conditions: true,
  severity: true,
  alertThreshold: true,
  recommendedPlaybooks: true,
  notificationSettings: true,
  createdBy: true,
});

export const insertTriggerMonitoringHistorySchema = createInsertSchema(triggerMonitoringHistory).pick({
  triggerId: true,
  previousStatus: true,
  newStatus: true,
  triggerValue: true,
  metadata: true,
  notificationsSent: true,
});

export const insertPlaybookTriggerAssociationSchema = createInsertSchema(playbookTriggerAssociations).pick({
  triggerId: true,
  playbookId: true,
  autoActivate: true,
  activationConditions: true,
  executionPriority: true,
  stakeholdersToNotify: true,
  executionParameters: true,
  createdBy: true,
});

// What-If Scenario Analysis Types
export type WhatIfScenario = typeof whatIfScenarios.$inferSelect;
export type InsertWhatIfScenario = typeof whatIfScenarios.$inferInsert;

export const insertWhatIfScenarioSchema = createInsertSchema(whatIfScenarios).pick({
  organizationId: true,
  name: true,
  description: true,
  testConditions: true,
  triggeredAlerts: true,
  recommendedPlaybooks: true,
  projectedExecutionTime: true,
  teamsInvolved: true,
  resourceRequirements: true,
  riskAssessment: true,
  industryComparison: true,
  decisionVelocityMetrics: true,
  savedForPresentation: true,
  presentationNotes: true,
  tags: true,
  createdBy: true,
});

// Executive Preparedness Score™ Types
export type PreparednessScore = typeof preparednessScores.$inferSelect;
export type InsertPreparednessScore = typeof preparednessScores.$inferInsert;

export type PreparednessActivity = typeof preparednessActivities.$inferSelect;
export type InsertPreparednessActivity = typeof preparednessActivities.$inferInsert;

export type PeerBenchmark = typeof peerBenchmarks.$inferSelect;
export type InsertPeerBenchmark = typeof peerBenchmarks.$inferInsert;

export const insertPreparednessScoreSchema = createInsertSchema(preparednessScores).pick({
  userId: true,
  organizationId: true,
  score: true,
  previousScore: true,
  scoreDelta: true,
  scenariosPracticed: true,
  drillsCompleted: true,
  coverageGaps: true,
  readinessMetrics: true,
  industryBenchmark: true,
  peerPercentile: true,
  executiveRole: true,
});

export const insertPreparednessActivitySchema = createInsertSchema(preparednessActivities).pick({
  userId: true,
  organizationId: true,
  activityType: true,
  activityName: true,
  relatedEntityId: true,
  relatedEntityType: true,
  scoreImpact: true,
  metadata: true,
});

export const insertPeerBenchmarkSchema = createInsertSchema(peerBenchmarks).pick({
  industry: true,
  executiveRole: true,
  organizationSize: true,
  averageScore: true,
  medianScore: true,
  topQuartileScore: true,
  bottomQuartileScore: true,
  sampleSize: true,
  averageScenariosCompleted: true,
  averageDrillsCompleted: true,
  topPerformingActions: true,
  benchmarkPeriod: true,
});

// NFL Methodology - Playbook Library Types
export type PlaybookDomain = typeof playbookDomains.$inferSelect;
export type InsertPlaybookDomain = typeof playbookDomains.$inferInsert;

export type PlaybookCategory = typeof playbookCategories.$inferSelect;
export type InsertPlaybookCategory = typeof playbookCategories.$inferInsert;

export type PlaybookLibrary = typeof playbookLibrary.$inferSelect;
export type InsertPlaybookLibrary = typeof playbookLibrary.$inferInsert;

export type PlaybookTemplate = typeof playbookTemplates.$inferSelect;
export type InsertPlaybookTemplate = typeof playbookTemplates.$inferInsert;

export type PlaybookTemplateSection = typeof playbookTemplateSections.$inferSelect;
export type InsertPlaybookTemplateSection = typeof playbookTemplateSections.$inferInsert;

export type PlaybookCustomization = typeof playbookCustomizations.$inferSelect;
export type InsertPlaybookCustomization = typeof playbookCustomizations.$inferInsert;

export type PlaybookCommunicationTemplate = typeof playbookCommunicationTemplates.$inferSelect;
export type InsertPlaybookCommunicationTemplate = typeof playbookCommunicationTemplates.$inferInsert;

export type PlaybookDecisionTree = typeof playbookDecisionTrees.$inferSelect;
export type InsertPlaybookDecisionTree = typeof playbookDecisionTrees.$inferInsert;

export type PracticeDrill = typeof practiceDrills.$inferSelect;
export type InsertPracticeDrill = typeof practiceDrills.$inferInsert;

export type DrillPerformance = typeof drillPerformance.$inferSelect;
export type InsertDrillPerformance = typeof drillPerformance.$inferInsert;

export type AiOptimizationSuggestion = typeof aiOptimizationSuggestions.$inferSelect;
export type InsertAiOptimizationSuggestion = typeof aiOptimizationSuggestions.$inferInsert;

export type PlaybookActivation = typeof playbookActivations.$inferSelect;
export type InsertPlaybookActivation = typeof playbookActivations.$inferInsert;

// NFL Methodology - Insert Schemas
export const insertPlaybookDomainSchema = createInsertSchema(playbookDomains).pick({
  name: true,
  code: true,
  description: true,
  icon: true,
  color: true,
  sequence: true,
  primaryExecutiveRole: true,
  totalPlaybooks: true,
});

export const insertPlaybookCategorySchema = createInsertSchema(playbookCategories).pick({
  domainId: true,
  name: true,
  description: true,
  sequence: true,
  totalPlaybooks: true,
});

export const insertPlaybookLibrarySchema = createInsertSchema(playbookLibrary).pick({
  playbookNumber: true,
  domainId: true,
  categoryId: true,
  name: true,
  description: true,
  triggerCriteria: true,
  triggerDataSources: true,
  triggerThreshold: true,
  tier1Stakeholders: true,
  tier2Stakeholders: true,
  tier3Stakeholders: true,
  externalPartners: true,
  primaryResponseStrategy: true,
  preApprovedBudget: true,
  budgetApprovalRequired: true,
  targetExecutionTime: true,
  averageActivationFrequency: true,
  historicalSuccessRate: true,
  isPremium: true,
  isActive: true,
});

export const insertPlaybookCommunicationTemplateSchema = createInsertSchema(playbookCommunicationTemplates).pick({
  playbookId: true,
  templateType: true,
  templateName: true,
  subject: true,
  bodyTemplate: true,
  variables: true,
  recipientRoles: true,
  sendTiming: true,
  isRequired: true,
});

export const insertPlaybookDecisionTreeSchema = createInsertSchema(playbookDecisionTrees).pick({
  playbookId: true,
  checkpointNumber: true,
  checkpointName: true,
  checkpointTiming: true,
  decisionQuestion: true,
  decisionOptions: true,
  decisionCriteria: true,
  decisionAuthority: true,
  sequence: true,
});

export const insertPracticeDrillSchema = createInsertSchema(practiceDrills).pick({
  organizationId: true,
  playbookId: true,
  drillName: true,
  drillType: true,
  scenarioDescription: true,
  scheduledDate: true,
  scheduledTime: true,
  estimatedDuration: true,
  invitedParticipants: true,
  actualParticipants: true,
  status: true,
  complications: true,
  createdBy: true,
});

export const insertDrillPerformanceSchema = createInsertSchema(drillPerformance).pick({
  drillId: true,
  organizationId: true,
  playbookId: true,
  targetExecutionTime: true,
  actualExecutionTime: true,
  executionSpeedScore: true,
  triggerToAlert: true,
  alertToActivation: true,
  activationToWarRoom: true,
  warRoomToDecision: true,
  decisionToExecution: true,
  tier1Participation: true,
  tier2Participation: true,
  tier3Acknowledgment: true,
  roleClarity: true,
  bottlenecks: true,
  communicationsSent: true,
  communicationsDelivered: true,
  communicationEffectiveness: true,
  overallScore: true,
  passed: true,
  whatWorked: true,
  whatDidntWork: true,
  recommendations: true,
}).extend({
  // Coerce numeric decimal fields from numbers to strings for PostgreSQL decimal type
  tier1Participation: z.union([z.number(), z.string()]).transform(val => String(val)),
  tier2Participation: z.union([z.number(), z.string()]).transform(val => String(val)),
  tier3Acknowledgment: z.union([z.number(), z.string()]).transform(val => String(val)),
  roleClarity: z.union([z.number(), z.string()]).transform(val => String(val)),
  communicationEffectiveness: z.union([z.number(), z.string()]).transform(val => String(val)),
});

export const insertAiOptimizationSuggestionSchema = createInsertSchema(aiOptimizationSuggestions).pick({
  organizationId: true,
  playbookId: true,
  suggestionType: true,
  suggestionTitle: true,
  suggestionDescription: true,
  currentValue: true,
  recommendedValue: true,
  rationale: true,
  dataSupporting: true,
  estimatedTimeImprovement: true,
  estimatedSuccessImprovement: true,
  confidence: true,
  status: true,
});

export const insertPlaybookActivationSchema = createInsertSchema(playbookActivations).pick({
  organizationId: true,
  playbookId: true,
  executionInstanceId: true,
  triggerEventId: true,
  activatedBy: true,
  activationReason: true,
  situationSummary: true,
  successRating: true,
  actualExecutionTime: true,
  targetMet: true,
  lessonsLearned: true,
  playbookImprovements: true,
});

// Decision Confidence Types
export type DecisionConfidence = typeof decisionConfidence.$inferSelect;
export type InsertDecisionConfidence = typeof decisionConfidence.$inferInsert;

export const insertDecisionConfidenceSchema = createInsertSchema(decisionConfidence).pick({
  scenarioId: true,
  organizationId: true,
  userId: true,
  overallConfidence: true,
  dataCompleteness: true,
  stakeholderAlignment: true,
  historicalPrecedent: true,
  riskCoverage: true,
  confidenceFactors: true,
  missingElements: true,
  recommendations: true,
});

// Stakeholder Alignment Types
export type StakeholderAlignment = typeof stakeholderAlignment.$inferSelect;
export type InsertStakeholderAlignment = typeof stakeholderAlignment.$inferInsert;

export const insertStakeholderAlignmentSchema = createInsertSchema(stakeholderAlignment).pick({
  scenarioId: true,
  executionId: true,
  organizationId: true,
  stakeholderId: true,
  stakeholderRole: true,
  department: true,
  assignedTasks: true,
  status: true,
});

// Execution Validation Report Types
export type ExecutionValidationReport = typeof executionValidationReports.$inferSelect;
export type InsertExecutionValidationReport = typeof executionValidationReports.$inferInsert;

export const insertExecutionValidationReportSchema = createInsertSchema(executionValidationReports).pick({
  scenarioId: true,
  executionId: true,
  organizationId: true,
  executedBy: true,
  executionDate: true,
  predictedExecutionTime: true,
  actualExecutionTime: true,
  timeSavingsRealized: true,
  predictedOutcomes: true,
  actualOutcomes: true,
  outcomeAccuracy: true,
  predictedCost: true,
  actualCost: true,
  predictedRisks: true,
  actualRisks: true,
  riskPredictionAccuracy: true,
  overallSuccessRating: true,
  kpiTargetsHit: true,
  kpiTargetsTotal: true,
  whatWorked: true,
  whatFailed: true,
  unexpectedChallenges: true,
  playbookImprovements: true,
  institutionalLearnings: true,
  estimatedRoi: true,
  timeSavedHours: true,
  costSavedUsd: true,
  stakeholderFeedback: true,
  executiveSummary: true,
  recommendForFutureUse: true,
  confidenceAdjustment: true,
});

// ============================================================================
// MCKINSEY "ORGANIZE TO VALUE" FRAMEWORK - Phase 2
// ============================================================================

// McKinsey-specific enums
export const mckMaturityLevelEnum = pgEnum('mck_maturity_level', ['1', '2', '3', '4', '5']);
export const mckPhaseEnum = pgEnum('mck_phase', ['diagnose', 'design', 'pilot', 'scale']);
export const mckEngagementEnum = pgEnum('mck_engagement', ['champion', 'neutral', 'resister']);
export const mckReadinessRiskEnum = pgEnum('mck_readiness_risk', ['none', 'low', 'medium', 'high']);
export const mckComplianceStatusEnum = pgEnum('mck_compliance_status', ['not_started', 'in_progress', 'compliant', 'non_compliant']);
export const mckTrendEnum = pgEnum('mck_trend', ['declining', 'steady', 'improving']);

// The 12 McKinsey operating model elements
export const MCK_ELEMENTS = [
  'purpose', 'value_agenda', 'structure', 'ecosystem', 'governance',
  'processes', 'technology', 'leadership', 'talent', 'culture',
  'behaviors', 'rewards'
] as const;

// McKinsey's 9 Golden Rules for transformation
export const MCK_GOLDEN_RULES = [
  'start_with_strategy_and_value_agenda',
  'use_data_and_analytics',
  'design_the_full_system',
  'focus_on_connective_tissue',
  'prioritize_governance_first',
  'deploy_best_talent',
  'test_and_learn',
  'drive_rapid_decision_making',
  'change_mindsets_and_culture'
] as const;

// 1. Operating Model Assessments (Header)
export const mckOperatingModelAssessments = pgTable('mck_operating_model_assessments', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull(),
  assessmentName: varchar('assessment_name', { length: 255 }).notNull(),
  assessmentDate: timestamp('assessment_date').defaultNow().notNull(),
  conductedBy: varchar('conducted_by').notNull(), // User ID
  overallMaturity: decimal('overall_maturity', { precision: 3, scale: 1 }), // Average across all elements
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('mck_assessment_org_date_idx').on(table.organizationId, table.assessmentDate)
]);

export type MckOperatingModelAssessment = typeof mckOperatingModelAssessments.$inferSelect;
export type InsertMckOperatingModelAssessment = z.infer<typeof insertMckOperatingModelAssessmentSchema>;

export const insertMckOperatingModelAssessmentSchema = createInsertSchema(mckOperatingModelAssessments).pick({
  organizationId: true,
  assessmentName: true,
  assessmentDate: true,
  conductedBy: true,
  overallMaturity: true,
  notes: true,
});

// 2. Operating Model Scores (Child - 12 element scores per assessment)
export const mckOperatingModelScores = pgTable('mck_operating_model_scores', {
  id: uuid('id').primaryKey().defaultRandom(),
  assessmentId: uuid('assessment_id').notNull().references(() => mckOperatingModelAssessments.id, { onDelete: 'cascade' }),
  elementKey: varchar('element_key', { length: 50 }).notNull(), // One of MCK_ELEMENTS
  maturityLevel: mckMaturityLevelEnum('maturity_level').notNull(),
  maturityScore: integer('maturity_score').notNull(), // 1-5
  qualitativeNotes: text('qualitative_notes'),
  evidence: jsonb('evidence'), // Array of supporting data points
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('mck_score_assessment_element_idx').on(table.assessmentId, table.elementKey)
]);

export type MckOperatingModelScore = typeof mckOperatingModelScores.$inferSelect;
export type InsertMckOperatingModelScore = z.infer<typeof insertMckOperatingModelScoreSchema>;

export const insertMckOperatingModelScoreSchema = createInsertSchema(mckOperatingModelScores).pick({
  assessmentId: true,
  elementKey: true,
  maturityLevel: true,
  maturityScore: true,
  qualitativeNotes: true,
  evidence: true,
});

// 3. Gap Targets (Target maturity levels for Gap Calculator)
export const mckGapTargets = pgTable('mck_gap_targets', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull(),
  elementKey: varchar('element_key', { length: 50 }).notNull(), // One of MCK_ELEMENTS
  targetMaturityLevel: mckMaturityLevelEnum('target_maturity_level').notNull(),
  targetMaturityScore: integer('target_maturity_score').notNull(), // 1-5
  strategicWeight: decimal('strategic_weight', { precision: 3, scale: 2 }), // 0.00-1.00, importance multiplier
  rationale: text('rationale'),
  setBy: varchar('set_by').notNull(), // User ID
  setAt: timestamp('set_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('mck_gap_org_element_idx').on(table.organizationId, table.elementKey)
]);

export type MckGapTarget = typeof mckGapTargets.$inferSelect;
export type InsertMckGapTarget = z.infer<typeof insertMckGapTargetSchema>;

export const insertMckGapTargetSchema = createInsertSchema(mckGapTargets).pick({
  organizationId: true,
  elementKey: true,
  targetMaturityLevel: true,
  targetMaturityScore: true,
  strategicWeight: true,
  rationale: true,
  setBy: true,
});

// 4. Transformation Roadmaps (Initiative Headers)
export const mckTransformationRoadmaps = pgTable('mck_transformation_roadmaps', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull(),
  roadmapName: varchar('roadmap_name', { length: 255 }).notNull(),
  description: text('description'),
  startDate: timestamp('start_date').notNull(),
  targetCompletionDate: timestamp('target_completion_date'),
  currentPhase: mckPhaseEnum('current_phase').notNull().default('diagnose'),
  businessCaseValue: decimal('business_case_value', { precision: 15, scale: 2 }), // Expected savings/value in USD
  owner: varchar('owner').notNull(), // User ID
  status: statusEnum('status').notNull().default('active'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('mck_roadmap_org_idx').on(table.organizationId)
]);

export type MckTransformationRoadmap = typeof mckTransformationRoadmaps.$inferSelect;
export type InsertMckTransformationRoadmap = z.infer<typeof insertMckTransformationRoadmapSchema>;

export const insertMckTransformationRoadmapSchema = createInsertSchema(mckTransformationRoadmaps).pick({
  organizationId: true,
  roadmapName: true,
  description: true,
  startDate: true,
  targetCompletionDate: true,
  currentPhase: true,
  businessCaseValue: true,
  owner: true,
  status: true,
});

// 5. Transformation Workstreams (Child - phases, dependencies, milestones)
export const mckTransformationWorkstreams = pgTable('mck_transformation_workstreams', {
  id: uuid('id').primaryKey().defaultRandom(),
  roadmapId: uuid('roadmap_id').notNull().references(() => mckTransformationRoadmaps.id, { onDelete: 'cascade' }),
  workstreamName: varchar('workstream_name', { length: 255 }).notNull(),
  phase: mckPhaseEnum('phase').notNull(),
  elementKey: varchar('element_key', { length: 50 }), // Which of the 12 elements this addresses
  dependencies: jsonb('dependencies'), // Array of workstream IDs this depends on
  milestones: jsonb('milestones'), // Array of milestone objects {name, date, status}
  goldenRuleCompliance: jsonb('golden_rule_compliance'), // Object mapping rule keys to boolean compliance
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  owner: varchar('owner').notNull(), // User ID
  status: statusEnum('status').notNull().default('draft'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('mck_workstream_roadmap_idx').on(table.roadmapId)
]);

export type MckTransformationWorkstream = typeof mckTransformationWorkstreams.$inferSelect;
export type InsertMckTransformationWorkstream = z.infer<typeof insertMckTransformationWorkstreamSchema>;

export const insertMckTransformationWorkstreamSchema = createInsertSchema(mckTransformationWorkstreams).pick({
  roadmapId: true,
  workstreamName: true,
  phase: true,
  elementKey: true,
  dependencies: true,
  milestones: true,
  goldenRuleCompliance: true,
  startDate: true,
  endDate: true,
  owner: true,
  status: true,
});

// 6. Executive Buy-In Snapshots
export const mckExecutiveBuyinSnapshots = pgTable('mck_executive_buyin_snapshots', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull(),
  roadmapId: uuid('roadmap_id').references(() => mckTransformationRoadmaps.id, { onDelete: 'set null' }),
  snapshotDate: timestamp('snapshot_date').defaultNow().notNull(),
  stakeholderId: varchar('stakeholder_id').notNull(), // User ID
  stakeholderName: varchar('stakeholder_name', { length: 255 }).notNull(),
  stakeholderRole: varchar('stakeholder_role', { length: 255 }), // CEO, CFO, etc.
  engagement: mckEngagementEnum('engagement').notNull(),
  commitmentScore: integer('commitment_score').notNull(), // 0-100
  lastInteraction: timestamp('last_interaction'),
  feedbackNotes: text('feedback_notes'),
  actionItems: jsonb('action_items'), // Array of follow-up actions
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('mck_buyin_org_date_idx').on(table.organizationId, table.snapshotDate),
  index('mck_buyin_roadmap_idx').on(table.roadmapId)
]);

export type MckExecutiveBuyinSnapshot = typeof mckExecutiveBuyinSnapshots.$inferSelect;
export type InsertMckExecutiveBuyinSnapshot = z.infer<typeof insertMckExecutiveBuyinSnapshotSchema>;

export const insertMckExecutiveBuyinSnapshotSchema = createInsertSchema(mckExecutiveBuyinSnapshots).pick({
  organizationId: true,
  roadmapId: true,
  snapshotDate: true,
  stakeholderId: true,
  stakeholderName: true,
  stakeholderRole: true,
  engagement: true,
  commitmentScore: true,
  lastInteraction: true,
  feedbackNotes: true,
  actionItems: true,
});

// 7. Change Readiness Checks
export const mckChangeReadinessChecks = pgTable('mck_change_readiness_checks', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull(),
  roadmapId: uuid('roadmap_id').references(() => mckTransformationRoadmaps.id, { onDelete: 'set null' }),
  checkDate: timestamp('check_date').defaultNow().notNull(),
  conductedBy: varchar('conducted_by').notNull(), // User ID
  overallReadinessScore: integer('overall_readiness_score').notNull(), // 0-100
  capabilityScores: jsonb('capability_scores'), // Object mapping capability areas to scores
  adoptionRate: decimal('adoption_rate', { precision: 5, scale: 2 }), // Percentage
  riskLevel: mckReadinessRiskEnum('risk_level').notNull(),
  riskFlags: jsonb('risk_flags'), // Array of identified risks
  recommendations: text('recommendations'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('mck_readiness_org_date_idx').on(table.organizationId, table.checkDate)
]);

export type MckChangeReadinessCheck = typeof mckChangeReadinessChecks.$inferSelect;
export type InsertMckChangeReadinessCheck = z.infer<typeof insertMckChangeReadinessCheckSchema>;

export const insertMckChangeReadinessCheckSchema = createInsertSchema(mckChangeReadinessChecks).pick({
  organizationId: true,
  roadmapId: true,
  checkDate: true,
  conductedBy: true,
  overallReadinessScore: true,
  capabilityScores: true,
  adoptionRate: true,
  riskLevel: true,
  riskFlags: true,
  recommendations: true,
});

// 8. Value Realization Metrics (ROI, Four Outcomes tracking)
export const mckValueRealizationMetrics = pgTable('mck_value_realization_metrics', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull(),
  roadmapId: uuid('roadmap_id').references(() => mckTransformationRoadmaps.id, { onDelete: 'set null' }),
  executionInstanceId: uuid('execution_instance_id').references(() => executionInstances.id, { onDelete: 'set null' }),
  measurementDate: timestamp('measurement_date').defaultNow().notNull(),
  // Four Outcomes from McKinsey framework
  clarityScore: integer('clarity_score').notNull(), // 0-100
  speedScore: integer('speed_score').notNull(), // 0-100
  skillsScore: integer('skills_score').notNull(), // 0-100
  commitmentScore: integer('commitment_score').notNull(), // 0-100
  overallOutcomeScore: integer('overall_outcome_score').notNull(), // Average of the 4
  // Value metrics
  roiPercentage: decimal('roi_percentage', { precision: 7, scale: 2 }),
  costSavingsUsd: decimal('cost_savings_usd', { precision: 15, scale: 2 }),
  timeSavingsHours: decimal('time_savings_hours', { precision: 10, scale: 2 }),
  coordinationSpeedImprovement: decimal('coordination_speed_improvement', { precision: 5, scale: 2 }), // Percentage improvement
  // Trends
  clarityTrend: mckTrendEnum('clarity_trend'),
  speedTrend: mckTrendEnum('speed_trend'),
  skillsTrend: mckTrendEnum('skills_trend'),
  commitmentTrend: mckTrendEnum('commitment_trend'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('mck_value_org_date_idx').on(table.organizationId, table.measurementDate),
  index('mck_value_execution_idx').on(table.executionInstanceId)
]);

export type MckValueRealizationMetric = typeof mckValueRealizationMetrics.$inferSelect;
export type InsertMckValueRealizationMetric = z.infer<typeof insertMckValueRealizationMetricSchema>;

export const insertMckValueRealizationMetricSchema = createInsertSchema(mckValueRealizationMetrics).pick({
  organizationId: true,
  roadmapId: true,
  executionInstanceId: true,
  measurementDate: true,
  clarityScore: true,
  speedScore: true,
  skillsScore: true,
  commitmentScore: true,
  overallOutcomeScore: true,
  roiPercentage: true,
  costSavingsUsd: true,
  timeSavingsHours: true,
  coordinationSpeedImprovement: true,
  clarityTrend: true,
  speedTrend: true,
  skillsTrend: true,
  commitmentTrend: true,
  notes: true,
});

// 9. Sustainable Practice Audits (Header)
export const mckSustainablePracticeAudits = pgTable('mck_sustainable_practice_audits', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull(),
  roadmapId: uuid('roadmap_id').references(() => mckTransformationRoadmaps.id, { onDelete: 'set null' }),
  auditName: varchar('audit_name', { length: 255 }).notNull(),
  auditDate: timestamp('audit_date').defaultNow().notNull(),
  conductedBy: varchar('conducted_by').notNull(), // User ID
  overallComplianceScore: integer('overall_compliance_score'), // 0-100
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('mck_audit_org_date_idx').on(table.organizationId, table.auditDate)
]);

export type MckSustainablePracticeAudit = typeof mckSustainablePracticeAudits.$inferSelect;
export type InsertMckSustainablePracticeAudit = z.infer<typeof insertMckSustainablePracticeAuditSchema>;

export const insertMckSustainablePracticeAuditSchema = createInsertSchema(mckSustainablePracticeAudits).pick({
  organizationId: true,
  roadmapId: true,
  auditName: true,
  auditDate: true,
  conductedBy: true,
  overallComplianceScore: true,
  notes: true,
});

// 10. Sustainable Practice Items (Child - 9 Golden Rules)
export const mckSustainablePracticeItems = pgTable('mck_sustainable_practice_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  auditId: uuid('audit_id').notNull().references(() => mckSustainablePracticeAudits.id, { onDelete: 'cascade' }),
  ruleKey: varchar('rule_key', { length: 100 }).notNull(), // One of MCK_GOLDEN_RULES
  ruleName: varchar('rule_name', { length: 255 }).notNull(),
  complianceStatus: mckComplianceStatusEnum('compliance_status').notNull(),
  owner: varchar('owner'), // User ID responsible for this practice
  evidenceLinks: jsonb('evidence_links'), // Array of supporting documentation URLs
  reviewCadence: varchar('review_cadence', { length: 50 }), // 'weekly', 'monthly', 'quarterly'
  lastReviewDate: timestamp('last_review_date'),
  nextReviewDate: timestamp('next_review_date'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('mck_practice_audit_rule_idx').on(table.auditId, table.ruleKey)
]);

export type MckSustainablePracticeItem = typeof mckSustainablePracticeItems.$inferSelect;
export type InsertMckSustainablePracticeItem = z.infer<typeof insertMckSustainablePracticeItemSchema>;

export const insertMckSustainablePracticeItemSchema = createInsertSchema(mckSustainablePracticeItems).pick({
  auditId: true,
  ruleKey: true,
  ruleName: true,
  complianceStatus: true,
  owner: true,
  evidenceLinks: true,
  reviewCadence: true,
  lastReviewDate: true,
  nextReviewDate: true,
  notes: true,
});

// ============================================================================
// DYNAMIC STRATEGY - Future Readiness & Self-Learning Playbooks
// ============================================================================

// Playbook Versions - Track self-learning playbook evolution
export const playbookVersions = pgTable('playbook_versions', {
  id: uuid('id').primaryKey().defaultRandom(),
  scenarioId: uuid('scenario_id').references(() => strategicScenarios.id, { onDelete: 'cascade' }).notNull(),
  version: varchar('version', { length: 20 }).notNull(), // e.g., '3.7', '2.4'
  changes: text('changes'), // Summary of what changed in this version
  learningsIntegrated: jsonb('learnings_integrated'), // Array of learning IDs applied
  createdBy: varchar('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('playbook_version_scenario_idx').on(table.scenarioId, table.version)
]);

export type PlaybookVersion = typeof playbookVersions.$inferSelect;
export type InsertPlaybookVersion = z.infer<typeof insertPlaybookVersionSchema>;

export const insertPlaybookVersionSchema = createInsertSchema(playbookVersions).pick({
  scenarioId: true,
  version: true,
  changes: true,
  learningsIntegrated: true,
  createdBy: true,
});

// Playbook Learnings - AI-extracted learnings from executions
export const playbookLearnings = pgTable('playbook_learnings', {
  id: uuid('id').primaryKey().defaultRandom(),
  scenarioId: uuid('scenario_id').references(() => strategicScenarios.id, { onDelete: 'cascade' }).notNull(),
  executionInstanceId: uuid('execution_instance_id').references(() => executionInstances.id, { onDelete: 'set null' }),
  learning: text('learning').notNull(),
  category: varchar('category', { length: 100 }), // communication, timing, resource_allocation, escalation
  impact: varchar('impact', { length: 50 }), // high, medium, low
  appliedToVersion: varchar('applied_to_version', { length: 20 }), // Which version integrated this learning
  confidence: decimal('confidence', { precision: 3, scale: 2 }), // 0.00 to 1.00 AI confidence score
  extractedAt: timestamp('extracted_at').defaultNow().notNull(),
  appliedAt: timestamp('applied_at'),
}, (table) => [
  index('playbook_learning_scenario_idx').on(table.scenarioId),
  index('playbook_learning_execution_idx').on(table.executionInstanceId)
]);

export type PlaybookLearning = typeof playbookLearnings.$inferSelect;
export type InsertPlaybookLearning = z.infer<typeof insertPlaybookLearningSchema>;

export const insertPlaybookLearningSchema = createInsertSchema(playbookLearnings).pick({
  scenarioId: true,
  executionInstanceId: true,
  learning: true,
  category: true,
  impact: true,
  appliedToVersion: true,
  confidence: true,
});

// Organization Readiness Metrics - Future Readiness Index™
export const readinessMetrics = pgTable('readiness_metrics', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  measurementDate: timestamp('measurement_date').defaultNow().notNull(),
  overallScore: decimal('overall_score', { precision: 4, scale: 1 }).notNull(), // 0.0 to 100.0
  foresightScore: decimal('foresight_score', { precision: 3, scale: 0 }), // 0 to 100
  velocityScore: decimal('velocity_score', { precision: 3, scale: 0 }), // 0 to 100
  agilityScore: decimal('agility_score', { precision: 3, scale: 0 }), // 0 to 100
  learningScore: decimal('learning_score', { precision: 3, scale: 0 }), // 0 to 100
  adaptabilityScore: decimal('adaptability_score', { precision: 3, scale: 0 }), // 0 to 100
  activeScenarios: integer('active_scenarios').default(0),
  weakSignalsDetected: integer('weak_signals_detected').default(0),
  playbooksReady: integer('playbooks_ready').default(0),
  playbooksTotal: integer('playbooks_total').default(0),
  averageResponseTime: integer('average_response_time'), // Minutes
  trend: varchar('trend', { length: 10 }), // up, down, stable
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('readiness_org_date_idx').on(table.organizationId, table.measurementDate)
]);

export type ReadinessMetric = typeof readinessMetrics.$inferSelect;
export type InsertReadinessMetric = z.infer<typeof insertReadinessMetricSchema>;

export const insertReadinessMetricSchema = createInsertSchema(readinessMetrics).pick({
  organizationId: true,
  measurementDate: true,
  overallScore: true,
  foresightScore: true,
  velocityScore: true,
  agilityScore: true,
  learningScore: true,
  adaptabilityScore: true,
  activeScenarios: true,
  weakSignalsDetected: true,
  playbooksReady: true,
  playbooksTotal: true,
  averageResponseTime: true,
  trend: true,
});

// Weak Signals - AI-detected early warning indicators
export const weakSignals = pgTable('weak_signals', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  signalType: varchar('signal_type', { length: 100 }).notNull(), // regulatory, competitor, technology, market, supply_chain
  description: text('description').notNull(),
  confidence: decimal('confidence', { precision: 3, scale: 0 }).notNull(), // 0 to 100
  timeline: varchar('timeline', { length: 50 }), // '1-3 months', '3-6 months', '6-12 months'
  impact: varchar('impact', { length: 50 }), // critical, high, medium, low
  source: varchar('source', { length: 255 }), // Data source
  relatedScenarios: jsonb('related_scenarios'), // Array of scenario IDs
  status: varchar('status', { length: 50 }).default('active'), // active, investigating, resolved, false_positive
  detectedAt: timestamp('detected_at').defaultNow().notNull(),
  acknowledgedBy: varchar('acknowledged_by').references(() => users.id),
  acknowledgedAt: timestamp('acknowledged_at'),
}, (table) => [
  index('weak_signal_org_idx').on(table.organizationId),
  index('weak_signal_type_idx').on(table.signalType),
  index('weak_signal_status_idx').on(table.status)
]);

export type WeakSignal = typeof weakSignals.$inferSelect;
export type InsertWeakSignal = z.infer<typeof insertWeakSignalSchema>;

export const insertWeakSignalSchema = createInsertSchema(weakSignals).pick({
  organizationId: true,
  signalType: true,
  description: true,
  confidence: true,
  timeline: true,
  impact: true,
  source: true,
  relatedScenarios: true,
  status: true,
});

// Oracle Patterns - Predictive intelligence patterns
export const oraclePatterns = pgTable('oracle_patterns', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  patternType: varchar('pattern_type', { length: 100 }).notNull(), // regulatory_shift, market_disruption, supply_chain_risk
  description: text('description').notNull(),
  confidence: decimal('confidence', { precision: 3, scale: 0 }).notNull(), // 0 to 100
  impact: varchar('impact', { length: 50 }).notNull(), // critical, high, medium, low
  timeline: varchar('timeline', { length: 50 }), // Projected timeline
  recommendations: jsonb('recommendations'), // Array of recommended actions
  affectedScenarios: jsonb('affected_scenarios'), // Array of scenario IDs
  evidenceSignals: jsonb('evidence_signals'), // Array of weak signal IDs
  status: varchar('status', { length: 50 }).default('detected'), // detected, analyzing, actioned
  detectedAt: timestamp('detected_at').defaultNow().notNull(),
  actionedAt: timestamp('actioned_at'),
  actionedBy: varchar('actioned_by').references(() => users.id),
}, (table) => [
  index('oracle_pattern_org_idx').on(table.organizationId),
  index('oracle_pattern_type_idx').on(table.patternType),
  index('oracle_pattern_status_idx').on(table.status)
]);

export type OraclePattern = typeof oraclePatterns.$inferSelect;
export type InsertOraclePattern = z.infer<typeof insertOraclePatternSchema>;

export const insertOraclePatternSchema = createInsertSchema(oraclePatterns).pick({
  organizationId: true,
  patternType: true,
  description: true,
  confidence: true,
  impact: true,
  timeline: true,
  recommendations: true,
  affectedScenarios: true,
  evidenceSignals: true,
  status: true,
});

// Continuous Operations Tasks - Scheduled readiness activities
export const continuousOperationsTasks = pgTable('continuous_operations_tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  taskName: varchar('task_name', { length: 255 }).notNull(), // 'Weak Signal Scan', 'Scenario Refresh', 'Team Drill'
  taskType: varchar('task_type', { length: 100 }).notNull(), // scan, refresh, drill, review, evolution
  schedule: varchar('schedule', { length: 50 }), // 'weekly', 'daily', 'monthly', or cron expression
  dayOfWeek: varchar('day_of_week', { length: 20 }), // monday, tuesday, etc.
  durationMinutes: integer('duration_minutes').default(15),
  status: varchar('status', { length: 50 }).default('scheduled'), // scheduled, pending, completed, skipped
  lastRunAt: timestamp('last_run_at'),
  nextRunAt: timestamp('next_run_at'),
  autoExecute: boolean('auto_execute').default(false), // Whether to run automatically or just remind
  assignedRoleId: uuid('assigned_role_id').references(() => roles.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('continuous_ops_org_idx').on(table.organizationId),
  index('continuous_ops_next_run_idx').on(table.nextRunAt),
  index('continuous_ops_status_idx').on(table.status)
]);

export type ContinuousOperationsTask = typeof continuousOperationsTasks.$inferSelect;
export type InsertContinuousOperationsTask = z.infer<typeof insertContinuousOperationsTaskSchema>;

export const insertContinuousOperationsTaskSchema = createInsertSchema(continuousOperationsTasks).pick({
  organizationId: true,
  taskName: true,
  taskType: true,
  schedule: true,
  dayOfWeek: true,
  durationMinutes: true,
  status: true,
  lastRunAt: true,
  nextRunAt: true,
  autoExecute: true,
  assignedRoleId: true,
});

// Activity Feed Events - Real-time activity tracking
export const activityFeedEvents = pgTable('activity_feed_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  eventType: varchar('event_type', { length: 100 }).notNull(), // pattern_detected, playbook_updated, drill_completed, weak_signal, scenario_launched
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  severity: varchar('severity', { length: 20 }).default('info'), // info, warning, critical
  relatedEntityType: varchar('related_entity_type', { length: 100 }), // scenario, signal, pattern, drill
  relatedEntityId: uuid('related_entity_id'),
  metadata: jsonb('metadata'), // Additional contextual data
  createdBy: varchar('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('activity_feed_org_idx').on(table.organizationId),
  index('activity_feed_created_idx').on(table.createdAt),
  index('activity_feed_type_idx').on(table.eventType)
]);

export type ActivityFeedEvent = typeof activityFeedEvents.$inferSelect;
export type InsertActivityFeedEvent = z.infer<typeof insertActivityFeedEventSchema>;

export const insertActivityFeedEventSchema = createInsertSchema(activityFeedEvents).pick({
  organizationId: true,
  eventType: true,
  title: true,
  description: true,
  severity: true,
  relatedEntityType: true,
  relatedEntityId: true,
  metadata: true,
  createdBy: true,
});

// ============================================================================
// DEMO LEADS - Trade Show & Marketing Lead Capture
// ============================================================================

export const demoLeads = pgTable('demo_leads', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  company: varchar('company', { length: 255 }).notNull(),
  role: varchar('role', { length: 100 }), // CEO, CFO, COO, etc.
  source: varchar('source', { length: 100 }).default('trade-show-demo'), // Where lead came from
  metadata: jsonb('metadata'), // Additional demo interaction data
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type DemoLead = typeof demoLeads.$inferSelect;
export type InsertDemoLead = z.infer<typeof insertDemoLeadSchema>;

export const insertDemoLeadSchema = createInsertSchema(demoLeads).pick({
  name: true,
  email: true,
  company: true,
  role: true,
  source: true,
  metadata: true,
});

// ============================================================================
// CUSTOMER CONFIGURATION - User-defined settings for M Strategic Execution OS
// ============================================================================

// Departments - Organization structure for stakeholder assignment
export const departments = pgTable('departments', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  parentDepartmentId: uuid('parent_department_id'), // For hierarchy
  leaderId: varchar('leader_id').references(() => users.id),
  budget: decimal('budget', { precision: 15, scale: 2 }),
  headcount: integer('headcount'),
  costCenter: varchar('cost_center', { length: 50 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('departments_org_idx').on(table.organizationId),
  index('departments_parent_idx').on(table.parentDepartmentId)
]);

export type Department = typeof departments.$inferSelect;
export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;

export const insertDepartmentSchema = createInsertSchema(departments).pick({
  organizationId: true,
  name: true,
  description: true,
  parentDepartmentId: true,
  leaderId: true,
  budget: true,
  headcount: true,
  costCenter: true,
  isActive: true,
});

// Escalation Policies - Approval chains and escalation rules
export const escalationPolicies = pgTable('escalation_policies', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  triggerType: varchar('trigger_type', { length: 100 }), // 'budget_exceeded', 'time_elapsed', 'severity_escalation'
  levels: jsonb('levels').notNull(), // Array of escalation levels with approvers and timeouts
  // Example: [{ level: 1, approvers: ['manager_id'], timeoutMinutes: 30, actions: ['email', 'slack'] }]
  defaultTimeoutMinutes: integer('default_timeout_minutes').default(60),
  autoEscalate: boolean('auto_escalate').default(true),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('escalation_policies_org_idx').on(table.organizationId)
]);

export type EscalationPolicy = typeof escalationPolicies.$inferSelect;
export type InsertEscalationPolicy = z.infer<typeof insertEscalationPolicySchema>;

export const insertEscalationPolicySchema = createInsertSchema(escalationPolicies).pick({
  organizationId: true,
  name: true,
  description: true,
  triggerType: true,
  levels: true,
  defaultTimeoutMinutes: true,
  autoEscalate: true,
  isActive: true,
});

// Communication Channels - Organization's notification preferences
export const communicationChannels = pgTable('communication_channels', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  channelType: varchar('channel_type', { length: 50 }).notNull(), // 'email', 'slack', 'teams', 'sms', 'webhook'
  name: varchar('name', { length: 255 }).notNull(),
  configuration: jsonb('configuration').notNull(), // Channel-specific config (webhook URL, Slack channel, etc.)
  isDefault: boolean('is_default').default(false),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('communication_channels_org_idx').on(table.organizationId),
  index('communication_channels_type_idx').on(table.channelType)
]);

export type CommunicationChannel = typeof communicationChannels.$inferSelect;
export type InsertCommunicationChannel = z.infer<typeof insertCommunicationChannelSchema>;

export const insertCommunicationChannelSchema = createInsertSchema(communicationChannels).pick({
  organizationId: true,
  channelType: true,
  name: true,
  configuration: true,
  isDefault: true,
  isActive: true,
});

// Custom Triggers - User-defined monitoring triggers (extends system triggers)
export const customTriggers = pgTable('custom_triggers', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  createdBy: varchar('created_by').references(() => users.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 100 }).notNull(), // One of 16 signal categories
  signalType: varchar('signal_type', { length: 100 }), // Specific signal within category
  
  // Condition configuration
  conditionField: varchar('condition_field', { length: 255 }).notNull(), // The metric/field to monitor
  conditionOperator: varchar('condition_operator', { length: 20 }).notNull(), // 'gt', 'lt', 'eq', 'gte', 'lte', 'change', 'drop', 'spike'
  conditionValue: decimal('condition_value', { precision: 15, scale: 4 }),
  conditionUnit: varchar('condition_unit', { length: 50 }), // '%', '$', 'count', 'days', etc.
  conditionLogic: varchar('condition_logic', { length: 20 }).default('single'), // 'single', 'and', 'or'
  compositeConditions: jsonb('composite_conditions'), // For complex multi-condition triggers
  
  // Severity and thresholds
  severity: varchar('severity', { length: 20 }).default('medium'), // 'low', 'medium', 'high', 'critical'
  alertThreshold: varchar('alert_threshold', { length: 20 }).default('yellow'), // 'green', 'yellow', 'red'
  
  // Response configuration
  notificationChannels: jsonb('notification_channels'), // Array of channel IDs
  escalationPolicyId: uuid('escalation_policy_id').references(() => escalationPolicies.id),
  autoActivatePlaybook: boolean('auto_activate_playbook').default(false),
  recommendedPlaybooks: jsonb('recommended_playbooks'), // Array of playbook IDs
  
  // Monitoring settings
  monitoringFrequency: varchar('monitoring_frequency', { length: 50 }).default('realtime'), // 'realtime', '5min', '15min', 'hourly', 'daily'
  dataSourceId: varchar('data_source_id').references(() => dataSources.id),
  
  // Status
  isActive: boolean('is_active').default(true),
  lastTriggeredAt: timestamp('last_triggered_at'),
  triggerCount: integer('trigger_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('custom_triggers_org_idx').on(table.organizationId),
  index('custom_triggers_category_idx').on(table.category),
  index('custom_triggers_severity_idx').on(table.severity),
  index('custom_triggers_active_idx').on(table.isActive)
]);

export type CustomTrigger = typeof customTriggers.$inferSelect;
export type InsertCustomTrigger = z.infer<typeof insertCustomTriggerSchema>;

export const insertCustomTriggerSchema = createInsertSchema(customTriggers).pick({
  organizationId: true,
  createdBy: true,
  name: true,
  description: true,
  category: true,
  signalType: true,
  conditionField: true,
  conditionOperator: true,
  conditionValue: true,
  conditionUnit: true,
  conditionLogic: true,
  compositeConditions: true,
  severity: true,
  alertThreshold: true,
  notificationChannels: true,
  escalationPolicyId: true,
  autoActivatePlaybook: true,
  recommendedPlaybooks: true,
  monitoringFrequency: true,
  dataSourceId: true,
  isActive: true,
});

// Success Metrics Configuration - Custom KPIs and targets
export const successMetricsConfig = pgTable('success_metrics_config', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  metricName: varchar('metric_name', { length: 255 }).notNull(),
  metricType: varchar('metric_type', { length: 100 }).notNull(), // 'fri', 'velocity', 'coverage', 'roi', 'custom'
  description: text('description'),
  targetValue: decimal('target_value', { precision: 15, scale: 4 }),
  targetUnit: varchar('target_unit', { length: 50 }), // '%', '$', 'minutes', 'count'
  currentValue: decimal('current_value', { precision: 15, scale: 4 }),
  baselineValue: decimal('baseline_value', { precision: 15, scale: 4 }),
  calculationFormula: text('calculation_formula'), // How to calculate the metric
  dataSource: varchar('data_source', { length: 255 }), // Where the data comes from
  reviewCadence: varchar('review_cadence', { length: 50 }).default('weekly'), // 'daily', 'weekly', 'monthly', 'quarterly'
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('success_metrics_org_idx').on(table.organizationId),
  index('success_metrics_type_idx').on(table.metricType)
]);

export type SuccessMetricsConfig = typeof successMetricsConfig.$inferSelect;
export type InsertSuccessMetricsConfig = z.infer<typeof insertSuccessMetricsConfigSchema>;

export const insertSuccessMetricsConfigSchema = createInsertSchema(successMetricsConfig).pick({
  organizationId: true,
  metricName: true,
  metricType: true,
  description: true,
  targetValue: true,
  targetUnit: true,
  currentValue: true,
  baselineValue: true,
  calculationFormula: true,
  dataSource: true,
  reviewCadence: true,
  isActive: true,
});

// Stakeholder Roles - Define roles for playbook assignment
export const stakeholderRoles = pgTable('stakeholder_roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  roleName: varchar('role_name', { length: 255 }).notNull(), // 'Executive Sponsor', 'Decision Maker', 'Executor', 'Informed'
  roleType: varchar('role_type', { length: 50 }).notNull(), // 'raci_responsible', 'raci_accountable', 'raci_consulted', 'raci_informed'
  description: text('description'),
  permissions: jsonb('permissions'), // What this role can do
  defaultApprovalLimit: decimal('default_approval_limit', { precision: 15, scale: 2 }), // Budget authority
  canApproveActivations: boolean('can_approve_activations').default(false),
  canExecuteTasks: boolean('can_execute_tasks').default(true),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('stakeholder_roles_org_idx').on(table.organizationId)
]);

export type StakeholderRole = typeof stakeholderRoles.$inferSelect;
export type InsertStakeholderRole = z.infer<typeof insertStakeholderRoleSchema>;

export const insertStakeholderRoleSchema = createInsertSchema(stakeholderRoles).pick({
  organizationId: true,
  roleName: true,
  roleType: true,
  description: true,
  permissions: true,
  defaultApprovalLimit: true,
  canApproveActivations: true,
  canExecuteTasks: true,
  isActive: true,
});

// Organization Onboarding Progress - Track setup completion
export const organizationOnboarding = pgTable('organization_onboarding', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  
  // Stage completion tracking
  stage0Orientation: boolean('stage0_orientation').default(false),
  stage1Prepare: boolean('stage1_prepare').default(false),
  stage2Monitor: boolean('stage2_monitor').default(false),
  stage3Execute: boolean('stage3_execute').default(false),
  stage4Learn: boolean('stage4_learn').default(false),
  
  // Detailed progress
  orgStructureComplete: boolean('org_structure_complete').default(false),
  stakeholdersConfigured: integer('stakeholders_configured').default(0),
  triggersConfigured: integer('triggers_configured').default(0),
  playbooksCustomized: integer('playbooks_customized').default(0),
  drillsCompleted: integer('drills_completed').default(0),
  
  // Metrics
  friBaseline: decimal('fri_baseline', { precision: 5, scale: 2 }),
  friCurrent: decimal('fri_current', { precision: 5, scale: 2 }),
  friTarget: decimal('fri_target', { precision: 5, scale: 2 }).default('84.4'),
  
  // Timestamps
  onboardingStartedAt: timestamp('onboarding_started_at').defaultNow().notNull(),
  onboardingCompletedAt: timestamp('onboarding_completed_at'),
  lastActivityAt: timestamp('last_activity_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('org_onboarding_org_idx').on(table.organizationId)
]);

export type OrganizationOnboarding = typeof organizationOnboarding.$inferSelect;
export type InsertOrganizationOnboarding = z.infer<typeof insertOrganizationOnboardingSchema>;

export const insertOrganizationOnboardingSchema = createInsertSchema(organizationOnboarding).pick({
  organizationId: true,
  stage0Orientation: true,
  stage1Prepare: true,
  stage2Monitor: true,
  stage3Execute: true,
  stage4Learn: true,
  orgStructureComplete: true,
  stakeholdersConfigured: true,
  triggersConfigured: true,
  playbooksCustomized: true,
  drillsCompleted: true,
  friBaseline: true,
  friCurrent: true,
  friTarget: true,
});

// ============================================================================
// EXECUTION PLAN SYNC & INTEGRATION ARCHITECTURE
// Enables automatic project creation in external tools (Jira, Asana, etc.)
// when playbooks trigger, eliminating the "planning the plan" phase
// ============================================================================

// Enums for sync system
export const syncPlatformEnum = pgEnum('sync_platform', [
  'jira', 'asana', 'monday', 'ms_project', 'smartsheet', 'wrike', 'servicenow', 'trello', 'clickup'
]);

export const syncStatusEnum = pgEnum('sync_status', [
  'pending', 'synced', 'pending_push', 'pending_pull', 'conflict', 'error', 'disabled'
]);

export const resourceTypeEnum = pgEnum('resource_type', [
  'budget', 'vendor', 'contract', 'personnel', 'equipment', 'software', 'facility'
]);

export const documentTypeEnum = pgEnum('document_type', [
  'memo', 'press_release', 'board_update', 'customer_communication', 
  'regulatory_filing', 'checklist', 'report', 'email_template', 'stakeholder_briefing'
]);

// 1. Execution Plan Export Templates
// Defines how M playbooks map to external project management tools
export const executionPlanExportTemplates = pgTable('execution_plan_export_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  
  // Target platform
  platform: syncPlatformEnum('platform').notNull(),
  
  // Template structure
  projectNameTemplate: varchar('project_name_template', { length: 255 }),
  // e.g., "[M-{{playbookId}}] {{playbookName}} - {{triggerDate}}"
  projectDescriptionTemplate: text('project_description_template'),
  
  // Hierarchy mapping (how M phases map to platform concepts)
  phaseMapping: jsonb('phase_mapping'),
  // { "immediate": "epic", "secondary": "epic", "follow_up": "epic" } for Jira
  // { "immediate": "section", "secondary": "section" } for Asana
  
  // Field mappings between M and target platform
  fieldMappings: jsonb('field_mappings'),
  
  // Custom fields for the platform
  customFields: jsonb('custom_fields'),
  
  // Automation rules on sync
  automationRules: jsonb('automation_rules'),
  
  // Default labels/tags to apply
  defaultLabels: jsonb('default_labels'),
  
  // Sync settings
  syncDirection: varchar('sync_direction', { length: 20 }).default('push'), // 'push', 'pull', 'bidirectional'
  syncFrequency: varchar('sync_frequency', { length: 20 }).default('realtime'), // 'realtime', 'hourly', 'daily', 'manual'
  
  isDefault: boolean('is_default').default(false),
  isActive: boolean('is_active').default(true),
  createdBy: varchar('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('export_templates_org_idx').on(table.organizationId),
  index('export_templates_platform_idx').on(table.platform)
]);

export type ExecutionPlanExportTemplate = typeof executionPlanExportTemplates.$inferSelect;
export type InsertExecutionPlanExportTemplate = z.infer<typeof insertExecutionPlanExportTemplateSchema>;

export const insertExecutionPlanExportTemplateSchema = createInsertSchema(executionPlanExportTemplates).pick({
  organizationId: true,
  name: true,
  description: true,
  platform: true,
  projectNameTemplate: true,
  projectDescriptionTemplate: true,
  phaseMapping: true,
  fieldMappings: true,
  customFields: true,
  automationRules: true,
  defaultLabels: true,
  syncDirection: true,
  syncFrequency: true,
  isDefault: true,
  isActive: true,
  createdBy: true,
});

// 2. Execution Plan Sync Records
// Track synced projects for bi-directional updates
export const executionPlanSyncRecords = pgTable('execution_plan_sync_records', {
  id: uuid('id').primaryKey().defaultRandom(),
  executionInstanceId: uuid('execution_instance_id').references(() => executionInstances.id, { onDelete: 'cascade' }).notNull(),
  exportTemplateId: uuid('export_template_id').references(() => executionPlanExportTemplates.id).notNull(),
  integrationId: uuid('integration_id').references(() => enterpriseIntegrations.id).notNull(),
  
  // External system reference
  externalProjectId: varchar('external_project_id', { length: 255 }).notNull(),
  externalProjectUrl: varchar('external_project_url', { length: 500 }),
  externalProjectKey: varchar('external_project_key', { length: 100 }), // e.g., "CRISIS-123" for Jira
  
  // Sync status
  syncStatus: syncStatusEnum('sync_status').default('pending'),
  
  lastSyncedAt: timestamp('last_synced_at'),
  lastSyncDirection: varchar('last_sync_direction', { length: 20 }), // 'push', 'pull'
  syncErrors: jsonb('sync_errors'),
  
  // Task-level sync tracking
  taskSyncMap: jsonb('task_sync_map'),
  // { "m_task_id": { "external_id": "JIRA-123", "last_synced": "...", "status": "synced" } }
  
  // Sync settings specific to this instance
  syncSettings: jsonb('sync_settings'),
  
  // Metrics
  tasksCreated: integer('tasks_created').default(0),
  tasksSynced: integer('tasks_synced').default(0),
  lastError: text('last_error'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('sync_records_instance_idx').on(table.executionInstanceId),
  index('sync_records_status_idx').on(table.syncStatus)
]);

export type ExecutionPlanSyncRecord = typeof executionPlanSyncRecords.$inferSelect;
export type InsertExecutionPlanSyncRecord = z.infer<typeof insertExecutionPlanSyncRecordSchema>;

export const insertExecutionPlanSyncRecordSchema = createInsertSchema(executionPlanSyncRecords).pick({
  executionInstanceId: true,
  exportTemplateId: true,
  integrationId: true,
  externalProjectId: true,
  externalProjectUrl: true,
  externalProjectKey: true,
  syncStatus: true,
  taskSyncMap: true,
  syncSettings: true,
});

// 3. Execution Plan Tasks Extended
// Rich task definition for export capabilities
export const executionPlanTasksExtended = pgTable('execution_plan_tasks_extended', {
  taskId: uuid('task_id').primaryKey().references(() => executionPlanTasks.id, { onDelete: 'cascade' }),
  
  // External ID prefix for this task type
  externalIdPrefix: varchar('external_id_prefix', { length: 50 }),
  
  // Acceptance criteria (maps to Jira description, Asana notes)
  acceptanceCriteria: jsonb('acceptance_criteria'),
  // ["Stakeholders notified within 5 minutes", "Confirmation received from legal"]
  
  // Deliverables
  deliverables: jsonb('deliverables'),
  // [{ "name": "Board Memo", "template_id": "doc-123", "required": true }]
  
  // Subtasks (for platforms that support them)
  subtasks: jsonb('subtasks'),
  // [{ "title": "Draft memo", "estimated_minutes": 10 }]
  
  // Time tracking
  originalEstimateMinutes: integer('original_estimate_minutes'),
  remainingEstimateMinutes: integer('remaining_estimate_minutes'),
  timeSpentMinutes: integer('time_spent_minutes'),
  
  // Labels/tags for external systems
  labels: jsonb('labels'),
  
  // External links/attachments
  externalLinks: jsonb('external_links'),
  
  // Watchers to be added in external system
  watcherUserIds: jsonb('watcher_user_ids'),
  
  // Initial comments to add when synced
  initialComments: jsonb('initial_comments'),
  
  // Custom fields for external systems
  customFieldValues: jsonb('custom_field_values'),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type ExecutionPlanTaskExtended = typeof executionPlanTasksExtended.$inferSelect;
export type InsertExecutionPlanTaskExtended = z.infer<typeof insertExecutionPlanTaskExtendedSchema>;

export const insertExecutionPlanTaskExtendedSchema = createInsertSchema(executionPlanTasksExtended).pick({
  taskId: true,
  externalIdPrefix: true,
  acceptanceCriteria: true,
  deliverables: true,
  subtasks: true,
  originalEstimateMinutes: true,
  remainingEstimateMinutes: true,
  timeSpentMinutes: true,
  labels: true,
  externalLinks: true,
  watcherUserIds: true,
  initialComments: true,
  customFieldValues: true,
});

// 4. Execution Document Templates
// Pre-built document templates that auto-generate on playbook activation
export const executionDocumentTemplates = pgTable('execution_document_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  playbookId: uuid('playbook_id').references(() => strategicScenarios.id),
  taskId: uuid('task_id').references(() => executionPlanTasks.id),
  
  name: varchar('name', { length: 255 }).notNull(),
  documentType: documentTypeEnum('document_type').notNull(),
  
  // Template content with variables
  templateContent: text('template_content'),
  // "Dear {{stakeholder_name}},\n\nWe are writing to inform you..."
  
  // Variables this template expects
  requiredVariables: jsonb('required_variables'),
  // [{ "name": "stakeholder_name", "type": "string", "source": "trigger_data" }]
  
  // Output formats supported
  outputFormats: jsonb('output_formats'),
  // ["docx", "pdf", "gdoc", "html"]
  
  // Storage integration for saving generated docs
  storageIntegration: varchar('storage_integration', { length: 50 }),
  // 'google_drive', 'sharepoint', 'box', 'local'
  storagePath: varchar('storage_path', { length: 500 }),
  
  // Approval workflow
  requiresApproval: boolean('requires_approval').default(false),
  approverRoleId: uuid('approver_role_id').references(() => roles.id),
  
  // Auto-generation settings
  autoGenerateOnActivation: boolean('auto_generate_on_activation').default(true),
  autoDistribute: boolean('auto_distribute').default(false),
  distributionList: jsonb('distribution_list'),
  
  // Version control
  version: integer('version').default(1),
  isLatest: boolean('is_latest').default(true),
  parentTemplateId: uuid('parent_template_id'), // For version history
  
  isActive: boolean('is_active').default(true),
  createdBy: varchar('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('doc_templates_org_idx').on(table.organizationId),
  index('doc_templates_playbook_idx').on(table.playbookId),
  index('doc_templates_type_idx').on(table.documentType)
]);

export type ExecutionDocumentTemplate = typeof executionDocumentTemplates.$inferSelect;
export type InsertExecutionDocumentTemplate = z.infer<typeof insertExecutionDocumentTemplateSchema>;

export const insertExecutionDocumentTemplateSchema = createInsertSchema(executionDocumentTemplates).pick({
  organizationId: true,
  playbookId: true,
  taskId: true,
  name: true,
  documentType: true,
  templateContent: true,
  requiredVariables: true,
  outputFormats: true,
  storageIntegration: true,
  storagePath: true,
  requiresApproval: true,
  approverRoleId: true,
  autoGenerateOnActivation: true,
  autoDistribute: true,
  distributionList: true,
  isActive: true,
  createdBy: true,
});

// 5. Execution Pre-Approved Resources
// Pre-approved budgets, vendors, and resources that unlock on activation
export const executionPreApprovedResources = pgTable('execution_pre_approved_resources', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  playbookId: uuid('playbook_id').references(() => strategicScenarios.id),
  taskId: uuid('task_id').references(() => executionPlanTasks.id),
  
  resourceType: resourceTypeEnum('resource_type').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  
  // Budget-specific fields
  budgetAmount: decimal('budget_amount', { precision: 12, scale: 2 }),
  budgetCurrency: varchar('budget_currency', { length: 10 }).default('USD'),
  budgetAccountCode: varchar('budget_account_code', { length: 50 }),
  budgetCategory: varchar('budget_category', { length: 100 }), // 'contingency', 'crisis_response', 'operations'
  
  // Vendor-specific fields
  vendorId: varchar('vendor_id', { length: 100 }),
  vendorName: varchar('vendor_name', { length: 255 }),
  vendorContactInfo: jsonb('vendor_contact_info'),
  contractReference: varchar('contract_reference', { length: 255 }),
  masterServiceAgreement: varchar('master_service_agreement', { length: 255 }),
  
  // Personnel-specific fields
  personnelRoles: jsonb('personnel_roles'),
  // [{ "role": "Crisis Manager", "count": 2, "source": "internal" }]
  personnelRequirements: jsonb('personnel_requirements'),
  
  // Equipment/Software fields
  assetInventory: jsonb('asset_inventory'),
  
  // Approval details
  approvedBy: varchar('approved_by').references(() => users.id),
  approvedAt: timestamp('approved_at'),
  approvalExpiresAt: timestamp('approval_expires_at'),
  approvalConditions: text('approval_conditions'),
  approvalDocumentUrl: varchar('approval_document_url', { length: 500 }),
  
  // Activation tracking
  lastActivatedAt: timestamp('last_activated_at'),
  activationCount: integer('activation_count').default(0),
  totalSpent: decimal('total_spent', { precision: 12, scale: 2 }).default('0'),
  
  // Renewal settings
  renewalRequired: boolean('renewal_required').default(false),
  renewalPeriod: varchar('renewal_period', { length: 50 }), // 'annually', 'quarterly'
  nextRenewalDate: timestamp('next_renewal_date'),
  
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('pre_approved_resources_org_idx').on(table.organizationId),
  index('pre_approved_resources_playbook_idx').on(table.playbookId),
  index('pre_approved_resources_type_idx').on(table.resourceType)
]);

export type ExecutionPreApprovedResource = typeof executionPreApprovedResources.$inferSelect;
export type InsertExecutionPreApprovedResource = z.infer<typeof insertExecutionPreApprovedResourceSchema>;

export const insertExecutionPreApprovedResourceSchema = createInsertSchema(executionPreApprovedResources).pick({
  organizationId: true,
  playbookId: true,
  taskId: true,
  resourceType: true,
  name: true,
  description: true,
  budgetAmount: true,
  budgetCurrency: true,
  budgetAccountCode: true,
  budgetCategory: true,
  vendorId: true,
  vendorName: true,
  vendorContactInfo: true,
  contractReference: true,
  masterServiceAgreement: true,
  personnelRoles: true,
  personnelRequirements: true,
  assetInventory: true,
  approvedBy: true,
  approvedAt: true,
  approvalExpiresAt: true,
  approvalConditions: true,
  approvalDocumentUrl: true,
  renewalRequired: true,
  renewalPeriod: true,
  nextRenewalDate: true,
  isActive: true,
});

// 6. Generated Documents - Track documents created from templates
export const executionGeneratedDocuments = pgTable('execution_generated_documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  templateId: uuid('template_id').references(() => executionDocumentTemplates.id).notNull(),
  executionInstanceId: uuid('execution_instance_id').references(() => executionInstances.id, { onDelete: 'cascade' }),
  
  name: varchar('name', { length: 255 }).notNull(),
  documentType: documentTypeEnum('document_type').notNull(),
  
  // Generated content
  generatedContent: text('generated_content'),
  variablesUsed: jsonb('variables_used'),
  
  // Storage
  fileUrl: varchar('file_url', { length: 500 }),
  fileFormat: varchar('file_format', { length: 20 }),
  fileSize: integer('file_size'), // bytes
  externalStorageId: varchar('external_storage_id', { length: 255 }),
  
  // Approval
  approvalStatus: varchar('approval_status', { length: 50 }).default('pending'),
  approvedBy: varchar('approved_by').references(() => users.id),
  approvedAt: timestamp('approved_at'),
  rejectionReason: text('rejection_reason'),
  
  // Distribution tracking
  distributedAt: timestamp('distributed_at'),
  distributionRecipients: jsonb('distribution_recipients'),
  
  // Version
  version: integer('version').default(1),
  
  generatedBy: varchar('generated_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('generated_docs_template_idx').on(table.templateId),
  index('generated_docs_instance_idx').on(table.executionInstanceId)
]);

export type ExecutionGeneratedDocument = typeof executionGeneratedDocuments.$inferSelect;
export type InsertExecutionGeneratedDocument = z.infer<typeof insertExecutionGeneratedDocumentSchema>;

export const insertExecutionGeneratedDocumentSchema = createInsertSchema(executionGeneratedDocuments).pick({
  templateId: true,
  executionInstanceId: true,
  name: true,
  documentType: true,
  generatedContent: true,
  variablesUsed: true,
  fileUrl: true,
  fileFormat: true,
  fileSize: true,
  externalStorageId: true,
  generatedBy: true,
});

// ============================================================================
// 4-PHASE PLAYBOOK TEMPLATE SYSTEM (PREPARE → MONITOR → EXECUTE → LEARN)
// ============================================================================

// PREPARE Phase Items - What must be ready before playbook activation
export const playbookPrepareItems = pgTable('playbook_prepare_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  playbookId: uuid('playbook_id').references(() => playbookLibrary.id, { onDelete: 'cascade' }).notNull(),
  organizationId: uuid('organization_id').references(() => organizations.id),
  
  itemType: varchar('item_type', { length: 50 }).notNull(),
  // 'stakeholder_assignment', 'document_template', 'resource_staging', 
  // 'communication_template', 'training_completion', 'system_access',
  // 'vendor_contract', 'budget_approval', 'checklist_item'
  
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  
  responsibleRole: varchar('responsible_role', { length: 100 }),
  responsibleUserId: varchar('responsible_user_id').references(() => users.id),
  
  status: prepareItemStatusEnum('status').default('not_started'),
  
  completedAt: timestamp('completed_at'),
  completedBy: varchar('completed_by').references(() => users.id),
  
  verificationMethod: varchar('verification_method', { length: 100 }),
  lastVerifiedAt: timestamp('last_verified_at'),
  verificationFrequencyDays: integer('verification_frequency_days').default(90),
  
  dependsOn: jsonb('depends_on').default('[]'),
  priority: priorityEnum('priority').default('medium'),
  isRequired: boolean('is_required').default(true),
  
  notes: text('notes'),
  attachments: jsonb('attachments').default('[]'),
  sequence: integer('sequence').default(0),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('prepare_items_playbook_idx').on(table.playbookId),
  index('prepare_items_org_idx').on(table.organizationId),
  index('prepare_items_status_idx').on(table.status)
]);

// PREPARE Phase Verification History - Audit trail for compliance
export const playbookPrepareVerificationHistory = pgTable('playbook_prepare_verification_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  prepareItemId: uuid('prepare_item_id').references(() => playbookPrepareItems.id, { onDelete: 'cascade' }).notNull(),
  
  verifiedBy: varchar('verified_by').references(() => users.id),
  verifiedAt: timestamp('verified_at').defaultNow().notNull(),
  previousStatus: prepareItemStatusEnum('previous_status'),
  newStatus: prepareItemStatusEnum('new_status'),
  notes: text('notes'),
  
  createdAt: timestamp('created_at').defaultNow(),
});

// MONITOR Phase Items - Signals and triggers to watch
export const playbookMonitorItems = pgTable('playbook_monitor_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  playbookId: uuid('playbook_id').references(() => playbookLibrary.id, { onDelete: 'cascade' }).notNull(),
  organizationId: uuid('organization_id').references(() => organizations.id),
  
  signalType: varchar('signal_type', { length: 50 }).notNull(),
  // 'competitive', 'regulatory', 'market', 'operational', 'financial', 
  // 'security', 'reputation', 'talent', 'supply_chain', 'technology'
  
  signalName: varchar('signal_name', { length: 255 }).notNull(),
  signalDescription: text('signal_description'),
  
  // Link to existing intelligence signals system
  linkedSignalId: uuid('linked_signal_id'),
  
  dataSource: varchar('data_source', { length: 100 }),
  dataSourceConfig: jsonb('data_source_config'),
  
  triggerType: varchar('trigger_type', { length: 50 }).notNull(),
  // 'threshold', 'pattern', 'event', 'manual', 'scheduled'
  
  triggerConditions: jsonb('trigger_conditions').notNull(),
  
  severity: varchar('severity', { length: 20 }).default('medium'),
  responseUrgency: varchar('response_urgency', { length: 50 }).default('standard'),
  
  notifyRoles: jsonb('notify_roles').default('[]'),
  requiresConfirmation: boolean('requires_confirmation').default(true),
  confirmationRole: varchar('confirmation_role', { length: 100 }),
  autoActivateAfterMinutes: integer('auto_activate_after_minutes'),
  
  isActive: boolean('is_active').default(true),
  lastCheckedAt: timestamp('last_checked_at'),
  lastTriggeredAt: timestamp('last_triggered_at'),
  triggerCount: integer('trigger_count').default(0),
  checkFrequencyMinutes: integer('check_frequency_minutes').default(60),
  
  sequence: integer('sequence').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('monitor_items_playbook_idx').on(table.playbookId),
  index('monitor_items_org_idx').on(table.organizationId),
  index('monitor_items_signal_type_idx').on(table.signalType)
]);

// LEARN Phase Items - Post-execution learning activities
export const playbookLearnItems = pgTable('playbook_learn_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  playbookId: uuid('playbook_id').references(() => playbookLibrary.id, { onDelete: 'cascade' }).notNull(),
  organizationId: uuid('organization_id').references(() => organizations.id),
  
  learnType: learnItemTypeEnum('learn_type').notNull(),
  
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  
  timing: varchar('timing', { length: 50 }).default('within_24_hours'),
  offsetHours: integer('offset_hours').default(24),
  
  responsibleRole: varchar('responsible_role', { length: 100 }),
  responsibleUserId: varchar('responsible_user_id').references(() => users.id),
  
  requiredParticipants: jsonb('required_participants').default('[]'),
  optionalParticipants: jsonb('optional_participants').default('[]'),
  
  learningPrompts: jsonb('learning_prompts').default('[]'),
  expectedOutputs: jsonb('expected_outputs').default('[]'),
  
  autoCreateImprovementTask: boolean('auto_create_improvement_task').default(true),
  isRequired: boolean('is_required').default(true),
  sequence: integer('sequence').default(0),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('learn_items_playbook_idx').on(table.playbookId),
  index('learn_items_org_idx').on(table.organizationId)
]);

// Captured learnings from actual executions
export const executionLearnings = pgTable('execution_learnings', {
  id: uuid('id').primaryKey().defaultRandom(),
  executionInstanceId: uuid('execution_instance_id').references(() => executionInstances.id, { onDelete: 'cascade' }).notNull(),
  playbookId: uuid('playbook_id').references(() => playbookLibrary.id).notNull(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  learnItemId: uuid('learn_item_id').references(() => playbookLearnItems.id),
  
  responses: jsonb('responses').notNull(), // Answers to learning prompts
  executionMetrics: jsonb('execution_metrics'), // Time, participation, success rates
  improvementActions: jsonb('improvement_actions').default('[]'),
  
  // AI Analysis (leveraging OpenAI integration)
  aiAnalysis: jsonb('ai_analysis'), // AI-generated insights
  suggestedPlaybookUpdates: jsonb('suggested_playbook_updates'), // AI recommendations
  sentimentScore: decimal('sentiment_score', { precision: 3, scale: 2 }), // -1 to 1
  keyThemes: jsonb('key_themes').default('[]'), // Extracted themes
  
  status: varchar('status', { length: 50 }).default('pending'),
  // 'pending', 'in_progress', 'completed', 'reviewed', 'applied'
  
  capturedBy: varchar('captured_by').references(() => users.id),
  capturedAt: timestamp('captured_at').defaultNow(),
  reviewedBy: varchar('reviewed_by').references(() => users.id),
  reviewedAt: timestamp('reviewed_at'),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('exec_learnings_instance_idx').on(table.executionInstanceId),
  index('exec_learnings_playbook_idx').on(table.playbookId),
  index('exec_learnings_org_idx').on(table.organizationId)
]);

// Readiness score tracking per playbook per organization
export const playbookReadinessScores = pgTable('playbook_readiness_scores', {
  id: uuid('id').primaryKey().defaultRandom(),
  playbookId: uuid('playbook_id').references(() => playbookLibrary.id, { onDelete: 'cascade' }).notNull(),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  
  // Overall & Phase Scores (0-100)
  overallScore: integer('overall_score').default(0),
  prepareScore: integer('prepare_score').default(0),
  monitorScore: integer('monitor_score').default(0),
  executeScore: integer('execute_score').default(0),
  learnScore: integer('learn_score').default(0),
  
  // Configurable weights (defaults to 40/20/30/10)
  prepareWeight: integer('prepare_weight').default(40),
  monitorWeight: integer('monitor_weight').default(20),
  executeWeight: integer('execute_weight').default(30),
  learnWeight: integer('learn_weight').default(10),
  
  // PREPARE Phase Breakdown
  stakeholdersAssigned: integer('stakeholders_assigned').default(0),
  stakeholdersTotal: integer('stakeholders_total').default(0),
  documentsReady: integer('documents_ready').default(0),
  documentsTotal: integer('documents_total').default(0),
  resourcesStaged: integer('resources_staged').default(0),
  resourcesTotal: integer('resources_total').default(0),
  
  // MONITOR Phase Breakdown
  triggersConfigured: integer('triggers_configured').default(0),
  triggersActive: integer('triggers_active').default(0),
  
  // EXECUTE Phase Breakdown
  tasksConfigured: integer('tasks_configured').default(0),
  decisionTreesConfigured: integer('decision_trees_configured').default(0),
  
  // LEARN Phase Breakdown
  learnItemsConfigured: integer('learn_items_configured').default(0),
  
  // Execution History
  lastCalculatedAt: timestamp('last_calculated_at').defaultNow(),
  lastDrilledAt: timestamp('last_drilled_at'),
  lastActivatedAt: timestamp('last_activated_at'),
  totalActivations: integer('total_activations').default(0),
  averageExecutionTimeMinutes: integer('average_execution_time_minutes'),
  successRate: decimal('success_rate', { precision: 5, scale: 2 }),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('readiness_playbook_idx').on(table.playbookId),
  index('readiness_org_idx').on(table.organizationId),
  index('readiness_score_idx').on(table.overallScore)
]);

// ============================================
// ENHANCED EXECUTION ORCHESTRATION TABLES
// One-Click Execution Flow Supporting Tables
// ============================================

// Pre-flight check results - stored for audit trail
export const preflightCheckResults = pgTable('preflight_check_results', {
  id: uuid('id').primaryKey().defaultRandom(),
  executionPlanId: uuid('execution_plan_id').references(() => scenarioExecutionPlans.id, { onDelete: 'cascade' }).notNull(),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  
  canProceed: boolean('can_proceed').notNull(),
  readinessScore: integer('readiness_score').notNull(),
  estimatedCompletionTime: integer('estimated_completion_time'),
  criticalIssues: integer('critical_issues').default(0),
  
  warnings: jsonb('warnings').default('[]'),
  metadata: jsonb('metadata'),
  
  checkedBy: varchar('checked_by').references(() => users.id),
  checkedAt: timestamp('checked_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at'),
  
  createdAt: timestamp('created_at').defaultNow(),
});

// Activation events - granular tracking
export const activationEventTypeEnum = pgEnum('activation_event_type', [
  'activation_started',
  'preflight_passed',
  'preflight_failed',
  'project_created',
  'tasks_created',
  'documents_generated',
  'stakeholders_notified',
  'budget_unlocked',
  'activation_completed',
  'activation_failed',
  'phase_started',
  'phase_completed'
]);

export const activationEvents = pgTable('activation_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  executionInstanceId: uuid('execution_instance_id').references(() => executionInstances.id, { onDelete: 'cascade' }).notNull(),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  
  eventType: activationEventTypeEnum('event_type').notNull(),
  eventData: jsonb('event_data'),
  
  success: boolean('success').default(true),
  errorMessage: text('error_message'),
  durationMs: integer('duration_ms'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('activation_events_instance_idx').on(table.executionInstanceId),
  index('activation_events_org_idx').on(table.organizationId)
]);

// Stakeholder acknowledgments
export const stakeholderAcknowledgments = pgTable('stakeholder_acknowledgments', {
  id: uuid('id').primaryKey().defaultRandom(),
  executionInstanceId: uuid('execution_instance_id').references(() => executionInstances.id, { onDelete: 'cascade' }).notNull(),
  stakeholderId: uuid('stakeholder_id').references(() => scenarioStakeholders.id, { onDelete: 'cascade' }).notNull(),
  userId: varchar('user_id').references(() => users.id),
  
  notifiedAt: timestamp('notified_at').defaultNow().notNull(),
  notificationChannel: varchar('notification_channel', { length: 50 }),
  
  acknowledgedAt: timestamp('acknowledged_at'),
  acknowledgmentType: varchar('acknowledgment_type', { length: 50 }),
  delegatedTo: varchar('delegated_to').references(() => users.id),
  responseNotes: text('response_notes'),
  
  reminderCount: integer('reminder_count').default(0),
  lastReminderAt: timestamp('last_reminder_at'),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('stakeholder_acks_instance_idx').on(table.executionInstanceId)
]);

// Pre-approved budget unlocks
export const budgetUnlocks = pgTable('budget_unlocks', {
  id: uuid('id').primaryKey().defaultRandom(),
  executionInstanceId: uuid('execution_instance_id').references(() => executionInstances.id, { onDelete: 'cascade' }).notNull(),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  playbookId: uuid('playbook_id').references(() => playbookLibrary.id),
  
  budgetCategory: varchar('budget_category', { length: 100 }).notNull(),
  preApprovedAmount: decimal('pre_approved_amount', { precision: 15, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('USD'),
  
  approvedBy: varchar('approved_by').references(() => users.id),
  approvalDate: timestamp('approval_date'),
  
  unlockedAt: timestamp('unlocked_at').defaultNow().notNull(),
  unlockedBy: varchar('unlocked_by').references(() => users.id),
  
  spentAmount: decimal('spent_amount', { precision: 15, scale: 2 }).default('0'),
  status: varchar('status', { length: 50 }).default('unlocked'),
  
  costCenter: varchar('cost_center', { length: 100 }),
  purchaseOrderRef: varchar('purchase_order_ref', { length: 100 }),
  notes: text('notes'),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('budget_unlocks_instance_idx').on(table.executionInstanceId),
  index('budget_unlocks_org_idx').on(table.organizationId)
]);

// Generated documents during activation
export const generatedDocuments = pgTable('generated_documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  executionInstanceId: uuid('execution_instance_id').references(() => executionInstances.id, { onDelete: 'cascade' }).notNull(),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  templateId: varchar('template_id', { length: 255 }),
  
  documentName: varchar('document_name', { length: 255 }).notNull(),
  documentType: varchar('document_type', { length: 50 }).notNull(),
  
  content: text('content'),
  format: varchar('format', { length: 20 }).default('markdown'),
  fileUrl: varchar('file_url', { length: 500 }),
  fileSize: integer('file_size'),
  
  variablesUsed: jsonb('variables_used'),
  
  generatedAt: timestamp('generated_at').defaultNow().notNull(),
  generatedBy: varchar('generated_by', { length: 50 }).default('system'),
  
  distributedTo: jsonb('distributed_to').default('[]'),
  distributedAt: timestamp('distributed_at'),
  
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => [
  index('gen_docs_instance_idx').on(table.executionInstanceId),
  index('gen_docs_org_idx').on(table.organizationId)
]);

// External project sync records
export const externalProjectSyncs = pgTable('external_project_syncs', {
  id: uuid('id').primaryKey().defaultRandom(),
  executionInstanceId: uuid('execution_instance_id').references(() => executionInstances.id, { onDelete: 'cascade' }).notNull(),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  
  platform: varchar('platform', { length: 50 }).notNull(),
  externalProjectId: varchar('external_project_id', { length: 255 }),
  externalProjectKey: varchar('external_project_key', { length: 100 }),
  externalProjectUrl: varchar('external_project_url', { length: 500 }),
  
  tasksCreated: integer('tasks_created').default(0),
  taskMappings: jsonb('task_mappings').default('[]'),
  
  syncStatus: varchar('sync_status', { length: 50 }).default('pending'),
  syncDirection: varchar('sync_direction', { length: 20 }).default('push'),
  lastSyncAt: timestamp('last_sync_at'),
  nextSyncAt: timestamp('next_sync_at'),
  
  errorMessage: text('error_message'),
  retryCount: integer('retry_count').default(0),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('ext_proj_sync_instance_idx').on(table.executionInstanceId),
  index('ext_proj_sync_org_idx').on(table.organizationId)
]);

// ============================================================================
// ORGANIZATION-SPECIFIC PLAYBOOKS - Custom/Customized Playbooks per Org
// ============================================================================

// Organization-specific playbooks (custom, customized from templates, or adopted pre-built)
export const playbooks = pgTable('playbooks', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  
  // Track playbook source
  sourceType: varchar('source_type', { length: 50 }).notNull(), // 'pre-built' | 'customized' | 'custom'
  
  // If customized, link to original template
  templateId: uuid('template_id').references(() => playbookLibrary.id),
  
  // Usage tracking
  timesUsed: integer('times_used').default(0),
  avgResponseTimeSeconds: integer('avg_response_time_seconds'),
  
  name: varchar('name', { length: 255 }).notNull(),
  domain: varchar('domain', { length: 100 }).notNull(),
  category: varchar('category', { length: 50 }), // 'offense' | 'defense' | 'special_teams'
  description: text('description'),
  
  // Priority level for the playbook
  priority: varchar('priority', { length: 20 }).default('medium'), // 'critical' | 'high' | 'medium' | 'low'
  
  // Total budget and currency
  totalBudget: decimal('total_budget', { precision: 14, scale: 2 }).default('0'),
  budgetCurrency: varchar('budget_currency', { length: 10 }).default('USD'),
  
  // Detailed playbook structure
  triggerConditions: jsonb('trigger_conditions').$type<Array<{
    id: string;
    description: string;
    source: string; // 'manual' | 'system' | 'integration' | 'market_data' | 'news' | 'competitive_intelligence' | 'regulatory' | 'financial'
    severity: string; // 'informational' | 'warning' | 'urgent' | 'critical'
    autoActivate: boolean;
  }>>(),
  
  // Escalation paths for when issues need to be raised
  escalationPaths: jsonb('escalation_paths').$type<Array<{
    id: string;
    triggerCondition: string; // 'no_response' | 'blocked' | 'scope_change' | 'budget_exceeded' | 'executive_decision' | 'external_dependency'
    escalateTo: string; // Role to escalate to
    backupContact: string; // Backup role if primary unavailable
    timeToEscalate: number; // Minutes before escalation
    notificationChannels: string[]; // ['email', 'phone', 'sms']
  }>>(),
  
  stakeholders: jsonb('stakeholders').$type<Array<{
    role: string;
    userId?: string;
    responsibility: string;
    notificationChannels: string[]; // ['email', 'slack', 'sms', 'teams', 'phone', 'in_app']
    isBackup: boolean; // Is this a backup contact?
    backupFor?: string; // Which role this is backup for
  }>>(),
  
  executionSteps: jsonb('execution_steps').$type<Array<{
    id: string;
    order: number;
    title: string;
    description: string;
    ownerId?: string;
    timeTargetMinutes: number;
    isParallel: boolean;
    dependsOn: string[]; // Array of step IDs this step depends on
    approvalRequired: string; // 'none' | 'manager' | 'director' | 'vp' | 'c_suite' | 'board'
    approvalNotes: string;
    deliverables: string;
  }>>(),
  
  // Pre-approved budget allocations
  budgetAllocations: jsonb('budget_allocations').$type<Array<{
    id: string;
    category: string; // 'personnel' | 'consulting' | 'legal' | 'technology' | 'communications' | 'travel' | 'contingency' | 'other'
    amount: number;
    preApproved: boolean;
    approvalThreshold: number;
    notes: string;
  }>>(),
  
  // Expected business impact metrics
  businessImpacts: jsonb('business_impacts').$type<Array<{
    id: string;
    type: string; // 'revenue_protection' | 'cost_avoidance' | 'time_savings' | 'risk_mitigation' | 'reputation_value' | 'compliance_value' | 'market_share'
    estimatedValue: number;
    valueUnit: string; // 'USD' | 'percent' | 'hours' | 'days' | 'score'
    description: string;
    measurementMethod: string;
  }>>(),
  
  successMetrics: jsonb('success_metrics').$type<{
    responseTimeTarget: number;
    stakeholdersTarget: number;
    customMetrics: Array<{name: string; target: string;}>;
  }>(),
  
  // Compliance & Regulatory
  complianceFrameworks: jsonb('compliance_frameworks').$type<string[]>(),
  complianceRequirements: jsonb('compliance_requirements').$type<Array<{
    id: string;
    framework: string;
    requirement: string;
    notes: string;
  }>>(),
  legalReviewStatus: varchar('legal_review_status', { length: 50 }).default('not_required'),
  legalReviewApprover: varchar('legal_review_approver', { length: 255 }),
  legalReviewDate: varchar('legal_review_date', { length: 50 }),
  auditTrailRequired: boolean('audit_trail_required').default(false),
  
  // Risk Assessment
  riskScore: integer('risk_score').default(5),
  maxFinancialExposure: decimal('max_financial_exposure', { precision: 14, scale: 2 }).default('0'),
  reputationalRiskLevel: varchar('reputational_risk_level', { length: 20 }).default('medium'),
  riskNotes: text('risk_notes'),
  
  // External Communications
  pressResponseRequired: boolean('press_response_required').default(false),
  investorNotificationRequired: boolean('investor_notification_required').default(false),
  investorNotificationThreshold: varchar('investor_notification_threshold', { length: 255 }),
  boardNotificationRequired: boolean('board_notification_required').default(false),
  boardNotificationThreshold: varchar('board_notification_threshold', { length: 255 }),
  preApprovedMessaging: text('pre_approved_messaging'),
  
  // Dependencies & Resources
  dependencies: jsonb('dependencies').$type<Array<{
    id: string;
    type: string;
    name: string;
    contactInfo: string;
    criticality: string;
    notes: string;
  }>>(),
  
  // Governance & Versioning
  playbookOwner: varchar('playbook_owner', { length: 255 }),
  playbookOwnerEmail: varchar('playbook_owner_email', { length: 255 }),
  nextReviewDate: varchar('next_review_date', { length: 50 }),
  reviewFrequency: varchar('review_frequency', { length: 50 }).default('quarterly'),
  versionNotes: text('version_notes'),
  changeApprovalRequired: boolean('change_approval_required').default(false),
  
  // Geographic Scope
  geographicScope: jsonb('geographic_scope').$type<string[]>(),
  primaryTimezone: varchar('primary_timezone', { length: 100 }),
  localRegulations: text('local_regulations'),
  
  // Readiness & Training
  lastDrillDate: varchar('last_drill_date', { length: 50 }),
  nextDrillDate: varchar('next_drill_date', { length: 50 }),
  drillFrequency: varchar('drill_frequency', { length: 50 }).default('quarterly'),
  trainingRequirements: text('training_requirements'),
  certificationRequirements: text('certification_requirements'),
  
  // Playbook status for draft/ready workflow
  status: varchar('status', { length: 20 }).default('draft'), // 'draft' | 'ready' | 'active' | 'archived'
  completionPercentage: integer('completion_percentage').default(0), // Track how complete the playbook is (0-100)
  
  isActive: boolean('is_active').default(true),
  isTemplate: boolean('is_template').default(false), // Mark as global template
  createdBy: varchar('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('playbooks_org_idx').on(table.organizationId),
  index('playbooks_template_idx').on(table.templateId),
  index('playbooks_source_idx').on(table.sourceType),
]);

// Types for Organization Playbooks
export type Playbook = typeof playbooks.$inferSelect;
export type InsertPlaybook = typeof playbooks.$inferInsert;

export const insertPlaybookSchema = createInsertSchema(playbooks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// ============================================================================
// DECISION VELOCITY SYSTEM - Pre-staged decision trees for head coach speed
// ============================================================================

// Decision Trees - Pre-staged decision frameworks for rapid executive decisions
export const decisionTrees = pgTable('decision_trees', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  scenario: varchar('scenario', { length: 255 }).notNull(),
  domain: varchar('domain', { length: 100 }).notNull(),
  category: varchar('category', { length: 50 }), // offense, defense, special_teams
  decisionPoints: jsonb('decision_points').$type<Array<{
    id: string;
    order: number;
    question: string;
    decisionMaker: string;
    mustWeighIn: string[];
    timeWindowMinutes: number;
    options: Array<{
      id: string;
      label: string;
      description: string;
      pros: string[];
      cons: string[];
      triggersPlaybookId?: string;
      criteria: Array<{condition: string; met: boolean | null;}>;
    }>;
    historicalDecisions: Array<{
      timestamp: string;
      optionChosen: string;
      decisionTimeMinutes: number;
      outcome: string;
      lessons: string;
    }>;
  }>>(),
  isActive: boolean('is_active').default(true),
  timesUsed: integer('times_used').default(0),
  avgDecisionTimeMinutes: integer('avg_decision_time_minutes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('decision_trees_org_idx').on(table.organizationId),
  index('decision_trees_domain_idx').on(table.domain),
]);

// Active Responses - Unified trigger→decision→execution→verification flow
export const activeDecisions = pgTable('active_decisions', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull(),
  decisionTreeId: uuid('decision_tree_id').notNull(),
  
  // PHASE 1: TRIGGER
  triggeredAt: timestamp('triggered_at').defaultNow(),
  triggeredBy: varchar('triggered_by', { length: 255 }),
  scenarioName: varchar('scenario_name', { length: 255 }),
  
  // PHASE 2: DECISION
  currentPhase: varchar('current_phase', { length: 50 }).default('decision'), // trigger | decision | execution | verification | complete
  currentDecisionPointId: varchar('current_decision_point_id', { length: 255 }),
  decisionMaker: varchar('decision_maker', { length: 255 }),
  decisionQuestion: text('decision_question'),
  stakeholderInputs: jsonb('stakeholder_inputs').$type<Array<{
    userId: string;
    role: string;
    input: string;
    timestamp: string;
    recommendedOption: string;
  }>>(),
  optionChosen: varchar('option_chosen', { length: 255 }),
  decidedAt: timestamp('decided_at'),
  decisionTimeMinutes: integer('decision_time_minutes'),
  
  // PHASE 3: EXECUTION
  playbookId: uuid('playbook_id'),
  executionInstanceId: uuid('execution_instance_id'),
  executionStartedAt: timestamp('execution_started_at'),
  executionCompletedAt: timestamp('execution_completed_at'),
  executionTimeMinutes: integer('execution_time_minutes'),
  taskStatuses: jsonb('task_statuses').$type<Array<{
    taskId: string;
    status: 'pending' | 'in_progress' | 'completed' | 'blocked';
    assignee: string;
    startedAt?: string;
    completedAt?: string;
    timeSpentMinutes?: number;
    output?: string;
  }>>(),
  
  // PHASE 4: VERIFICATION
  status: varchar('status', { length: 50 }).default('pending'), // pending, in_progress, decided, executing, completed, expired, failed
  totalResponseTimeMinutes: integer('total_response_time_minutes'),
  outcome: text('outcome'),
  lessons: text('lessons'),
  completedAt: timestamp('completed_at'),
}, (table) => [
  index('active_decisions_org_idx').on(table.organizationId),
  index('active_decisions_status_idx').on(table.status),
  index('active_decisions_phase_idx').on(table.currentPhase),
]);

// Decision Log - Historical record of all decisions and executions
export const decisionLog = pgTable('decision_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull(),
  decisionTreeId: uuid('decision_tree_id'),
  activeResponseId: uuid('active_response_id'), // Links to the unified response
  scenario: varchar('scenario', { length: 255 }).notNull(),
  question: text('question').notNull(),
  decisionMaker: varchar('decision_maker', { length: 255 }).notNull(),
  optionChosen: text('option_chosen').notNull(),
  
  // Critical timing metrics for value demonstration
  decisionTimeMinutes: integer('decision_time_minutes').notNull(), // Time to decide
  executionTimeMinutes: integer('execution_time_minutes'), // Time to execute playbook
  totalResponseTimeMinutes: integer('total_response_time_minutes'), // Total trigger-to-complete time
  
  // Task completion metrics
  totalTasks: integer('total_tasks'),
  completedTasks: integer('completed_tasks'),
  
  outcome: text('outcome'),
  lessons: text('lessons'),
  timestamp: timestamp('timestamp').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => [
  index('decision_log_org_idx').on(table.organizationId),
  index('decision_log_timestamp_idx').on(table.timestamp),
]);

// Types for Decision Velocity
export type DecisionTree = typeof decisionTrees.$inferSelect;
export type InsertDecisionTree = typeof decisionTrees.$inferInsert;

export type ActiveDecision = typeof activeDecisions.$inferSelect;
export type InsertActiveDecision = typeof activeDecisions.$inferInsert;

export type DecisionLogEntry = typeof decisionLog.$inferSelect;
export type InsertDecisionLogEntry = typeof decisionLog.$inferInsert;

export const insertDecisionTreeSchema = createInsertSchema(decisionTrees).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertActiveDecisionSchema = createInsertSchema(activeDecisions).omit({
  id: true,
  triggeredAt: true,
});

export const insertDecisionLogSchema = createInsertSchema(decisionLog).omit({
  id: true,
  timestamp: true,
  createdAt: true,
});

// Types for Enhanced Execution
export type PreflightCheckResultRecord = typeof preflightCheckResults.$inferSelect;
export type InsertPreflightCheckResultRecord = typeof preflightCheckResults.$inferInsert;

export type ActivationEvent = typeof activationEvents.$inferSelect;
export type InsertActivationEvent = typeof activationEvents.$inferInsert;

export type StakeholderAcknowledgment = typeof stakeholderAcknowledgments.$inferSelect;
export type InsertStakeholderAcknowledgment = typeof stakeholderAcknowledgments.$inferInsert;

export type BudgetUnlock = typeof budgetUnlocks.$inferSelect;
export type InsertBudgetUnlock = typeof budgetUnlocks.$inferInsert;

export type GeneratedDocument = typeof generatedDocuments.$inferSelect;
export type InsertGeneratedDocument = typeof generatedDocuments.$inferInsert;

export type ExternalProjectSync = typeof externalProjectSyncs.$inferSelect;
export type InsertExternalProjectSync = typeof externalProjectSyncs.$inferInsert;

// Types for 4-Phase System
export type PlaybookPrepareItem = typeof playbookPrepareItems.$inferSelect;
export type InsertPlaybookPrepareItem = typeof playbookPrepareItems.$inferInsert;

export type PlaybookMonitorItem = typeof playbookMonitorItems.$inferSelect;
export type InsertPlaybookMonitorItem = typeof playbookMonitorItems.$inferInsert;

export type PlaybookLearnItem = typeof playbookLearnItems.$inferSelect;
export type InsertPlaybookLearnItem = typeof playbookLearnItems.$inferInsert;

export type ExecutionLearning = typeof executionLearnings.$inferSelect;
export type InsertExecutionLearning = typeof executionLearnings.$inferInsert;

export type PlaybookReadinessScore = typeof playbookReadinessScores.$inferSelect;
export type InsertPlaybookReadinessScore = typeof playbookReadinessScores.$inferInsert;

// Insert Schemas for 4-Phase System
export const insertPlaybookPrepareItemSchema = createInsertSchema(playbookPrepareItems).pick({
  playbookId: true,
  organizationId: true,
  itemType: true,
  title: true,
  description: true,
  responsibleRole: true,
  responsibleUserId: true,
  status: true,
  verificationMethod: true,
  verificationFrequencyDays: true,
  dependsOn: true,
  priority: true,
  isRequired: true,
  notes: true,
  attachments: true,
  sequence: true,
});

export const insertPlaybookMonitorItemSchema = createInsertSchema(playbookMonitorItems).pick({
  playbookId: true,
  organizationId: true,
  signalType: true,
  signalName: true,
  signalDescription: true,
  linkedSignalId: true,
  dataSource: true,
  dataSourceConfig: true,
  triggerType: true,
  triggerConditions: true,
  severity: true,
  responseUrgency: true,
  notifyRoles: true,
  requiresConfirmation: true,
  confirmationRole: true,
  autoActivateAfterMinutes: true,
  isActive: true,
  checkFrequencyMinutes: true,
  sequence: true,
});

export const insertPlaybookLearnItemSchema = createInsertSchema(playbookLearnItems).pick({
  playbookId: true,
  organizationId: true,
  learnType: true,
  title: true,
  description: true,
  timing: true,
  offsetHours: true,
  responsibleRole: true,
  responsibleUserId: true,
  requiredParticipants: true,
  optionalParticipants: true,
  learningPrompts: true,
  expectedOutputs: true,
  autoCreateImprovementTask: true,
  isRequired: true,
  sequence: true,
});

export const insertExecutionLearningSchema = createInsertSchema(executionLearnings).pick({
  executionInstanceId: true,
  playbookId: true,
  organizationId: true,
  learnItemId: true,
  responses: true,
  executionMetrics: true,
  improvementActions: true,
  aiAnalysis: true,
  suggestedPlaybookUpdates: true,
  sentimentScore: true,
  keyThemes: true,
  status: true,
  capturedBy: true,
});

export const insertPlaybookReadinessScoreSchema = createInsertSchema(playbookReadinessScores).pick({
  playbookId: true,
  organizationId: true,
  overallScore: true,
  prepareScore: true,
  monitorScore: true,
  executeScore: true,
  learnScore: true,
  prepareWeight: true,
  monitorWeight: true,
  executeWeight: true,
  learnWeight: true,
});

// ============================================================================
// IDEA FRAMEWORK TYPE DEFINITIONS
// Enhanced interfaces for triggers, tasks, and decision points
// ============================================================================

export interface TriggerCondition {
  id: string;
  type: 'keyword' | 'threshold' | 'pattern' | 'schedule' | 'manual' | 'integration';
  field?: string;
  operator?: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'matches' | 'between';
  value: string | number;
  weight?: number;
  source?: string;
  description?: string;
}

export interface PlaybookTask {
  id: string;
  title: string;
  description?: string;
  order: number;
  phase?: 'immediate' | 'secondary' | 'follow_up';
  assigneeType: 'role' | 'stakeholder' | 'ai' | 'team';
  assigneeId?: string;
  assigneeRole?: string;
  estimatedMinutes: number;
  deadlineMinutes?: number;
  dependsOn?: string[];
  blockedBy?: string[];
  completionCriteria?: string;
  requiresApproval?: boolean;
  approverRole?: string;
  aiAssisted?: boolean;
  aiPrompt?: string;
  templateContent?: string;
  notificationChannels?: string[];
}

export interface ApprovalStep {
  id: string;
  order: number;
  approverRole: string;
  approverId?: string;
  timeoutMinutes?: number;
  autoApproveOnTimeout?: boolean;
  escalationPath?: string;
}

export interface DecisionPoint {
  id: string;
  question: string;
  order: number;
  context?: string;
  options: DecisionOption[];
  aiRecommendationEnabled?: boolean;
  defaultOptionId?: string;
  timeoutMinutes?: number;
}

export interface DecisionOption {
  id: string;
  label: string;
  description?: string;
  nextDecisionPointId?: string;
  triggersPlaybookId?: string;
  automatedAction?: string;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  estimatedImpact?: string;
}

export interface TriggerEvent {
  id: string;
  type: string;
  source: string;
  timestamp: string;
  data: Record<string, unknown>;
  signalId?: string;
  confidence?: number;
  matchedPatterns?: string[];
}

export interface LessonLearned {
  id: string;
  category: 'process' | 'timing' | 'communication' | 'decision' | 'resource' | 'technology';
  observation: string;
  recommendation: string;
  appliedToPlaybook?: boolean;
  impactScore?: number;
  capturedBy?: string;
  capturedAt?: string;
}

export interface NotificationChannel {
  type: 'email' | 'slack' | 'sms' | 'teams' | 'in_app' | 'phone';
  address: string;
  priority: 'all' | 'urgent' | 'critical';
  enabled?: boolean;
}

export interface StakeholderMapping {
  stakeholderId: string;
  role: string;
  raciRole: 'responsible' | 'accountable' | 'consulted' | 'informed';
  domains: string[];
  escalationPriority: number;
  notificationPreferences: NotificationChannel[];
}
