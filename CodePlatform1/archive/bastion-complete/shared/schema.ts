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
  title: varchar('title', { length: 255 }).notNull(),
  crisisType: varchar('crisis_type', { length: 100 }).notNull(), // 'supply-chain', 'cybersecurity', 'financial', 'strategic-opportunity'
  severity: priorityEnum('severity').default('medium'),
  status: varchar('status', { length: 50 }).default('active'), // 'active', 'monitoring', 'resolved', 'escalated'
  commanderId: varchar('commander_id').references(() => users.id).notNull(),
  stakeholderIds: jsonb('stakeholder_ids'), // Array of user IDs
  description: text('description'),
  responseProtocol: text('response_protocol'),
  communicationPlan: text('communication_plan'),
  resourcesAllocated: text('resources_allocated'),
  timeline: text('timeline'),
  keyDecisions: jsonb('key_decisions'), // Array of decision objects
  nextActions: jsonb('next_actions'), // Array of action items
  situationReport: text('situation_report'),
  escalationTriggers: jsonb('escalation_triggers'), // Array of trigger conditions
  createdAt: timestamp('created_at').defaultNow().notNull(),
  activatedAt: timestamp('activated_at'),
  resolvedAt: timestamp('resolved_at'),
  lastUpdated: timestamp('last_updated').defaultNow().notNull()
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
  title: true,
  crisisType: true,
  severity: true,
  commanderId: true,
  stakeholderIds: true,
  description: true,
  responseProtocol: true,
  communicationPlan: true,
  resourcesAllocated: true,
  timeline: true,
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
