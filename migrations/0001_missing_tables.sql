CREATE TYPE "public"."activation_event_type" AS ENUM('activation_started', 'preflight_passed', 'preflight_failed', 'project_created', 'tasks_created', 'documents_generated', 'stakeholders_notified', 'budget_unlocked', 'activation_completed', 'activation_failed', 'phase_started', 'phase_completed');--> statement-breakpoint
CREATE TYPE "public"."document_type" AS ENUM('memo', 'press_release', 'board_update', 'customer_communication', 'regulatory_filing', 'checklist', 'report', 'email_template', 'stakeholder_briefing');--> statement-breakpoint
CREATE TYPE "public"."execute_subphase" AS ENUM('respond', 'coordinate', 'stabilize', 'close');--> statement-breakpoint
CREATE TYPE "public"."execution_instance_status" AS ENUM('pending', 'running', 'completed', 'failed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."execution_phase" AS ENUM('immediate', 'secondary', 'follow_up');--> statement-breakpoint
CREATE TYPE "public"."execution_task_status" AS ENUM('pending', 'blocked', 'ready', 'in_progress', 'completed', 'failed', 'skipped');--> statement-breakpoint
CREATE TYPE "public"."learn_item_type" AS ENUM('debrief_meeting', 'survey', 'metrics_review', 'documentation', 'playbook_update', 'training_update', 'process_improvement');--> statement-breakpoint
CREATE TYPE "public"."mck_compliance_status" AS ENUM('not_started', 'in_progress', 'compliant', 'non_compliant');--> statement-breakpoint
CREATE TYPE "public"."mck_engagement" AS ENUM('champion', 'neutral', 'resister');--> statement-breakpoint
CREATE TYPE "public"."mck_maturity_level" AS ENUM('1', '2', '3', '4', '5');--> statement-breakpoint
CREATE TYPE "public"."mck_phase" AS ENUM('diagnose', 'design', 'pilot', 'scale');--> statement-breakpoint
CREATE TYPE "public"."mck_readiness_risk" AS ENUM('none', 'low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."mck_trend" AS ENUM('declining', 'steady', 'improving');--> statement-breakpoint
CREATE TYPE "public"."playbook_phase" AS ENUM('prepare', 'monitor', 'execute', 'learn');--> statement-breakpoint
CREATE TYPE "public"."prepare_item_status" AS ENUM('not_started', 'in_progress', 'completed', 'needs_review', 'blocked');--> statement-breakpoint
CREATE TYPE "public"."resource_type" AS ENUM('budget', 'vendor', 'contract', 'personnel', 'equipment', 'software', 'facility');--> statement-breakpoint
CREATE TYPE "public"."strategic_category" AS ENUM('offense', 'defense', 'special_teams');--> statement-breakpoint
CREATE TYPE "public"."sync_platform" AS ENUM('jira', 'asana', 'monday', 'ms_project', 'smartsheet', 'wrike', 'servicenow', 'trello', 'clickup');--> statement-breakpoint
CREATE TYPE "public"."sync_status" AS ENUM('pending', 'synced', 'pending_push', 'pending_pull', 'conflict', 'error', 'disabled');--> statement-breakpoint
CREATE TABLE "activation_activity_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"activation_id" uuid NOT NULL,
	"event_type" varchar(100) NOT NULL,
	"actor_name" varchar(255),
	"actor_role" varchar(100),
	"description" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "activation_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"execution_instance_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"event_type" "activation_event_type" NOT NULL,
	"event_data" jsonb,
	"success" boolean DEFAULT true,
	"error_message" text,
	"duration_ms" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activation_outcomes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"activation_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"playbook_id" uuid NOT NULL,
	"ai_summary" text,
	"tasks_completed" integer DEFAULT 0,
	"tasks_skipped" integer DEFAULT 0,
	"total_tasks" integer DEFAULT 0,
	"actual_minutes" integer,
	"target_met" boolean,
	"human_note" text,
	"what_held" text,
	"what_didnt_hold" text,
	"preparation_gap" text,
	"one_thing_to_encode" text,
	"close_out_completed" boolean DEFAULT false,
	"status" varchar(50) DEFAULT 'pending',
	"generated_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "activation_stakeholders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"activation_id" uuid NOT NULL,
	"role_name" varchar(100) NOT NULL,
	"person_name" varchar(255) NOT NULL,
	"title" varchar(255),
	"department" varchar(100),
	"tier" integer DEFAULT 1,
	"raci_type" varchar(20) DEFAULT 'informed',
	"status" varchar(50) DEFAULT 'pending',
	"notified_at" timestamp,
	"acknowledged_at" timestamp,
	"response_time_seconds" integer,
	"notification_channel" varchar(50) DEFAULT 'slack',
	"avatar_color" varchar(20),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "activation_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"activation_id" uuid NOT NULL,
	"task_name" varchar(500) NOT NULL,
	"task_description" text,
	"owner_role" varchar(100),
	"priority" varchar(20) DEFAULT 'high',
	"sequence" integer NOT NULL,
	"phase" varchar(50) DEFAULT 'immediate',
	"status" varchar(50) DEFAULT 'pending',
	"started_at" timestamp,
	"completed_at" timestamp,
	"estimated_minutes" integer DEFAULT 2,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "active_decisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"decision_tree_id" uuid NOT NULL,
	"triggered_at" timestamp DEFAULT now(),
	"triggered_by" varchar(255),
	"scenario_name" varchar(255),
	"current_phase" varchar(50) DEFAULT 'decision',
	"current_decision_point_id" varchar(255),
	"decision_maker" varchar(255),
	"decision_question" text,
	"stakeholder_inputs" jsonb,
	"option_chosen" varchar(255),
	"decided_at" timestamp,
	"decision_time_minutes" integer,
	"playbook_id" uuid,
	"execution_instance_id" uuid,
	"execution_started_at" timestamp,
	"execution_completed_at" timestamp,
	"execution_time_minutes" integer,
	"task_statuses" jsonb,
	"status" varchar(50) DEFAULT 'pending',
	"total_response_time_minutes" integer,
	"outcome" text,
	"lessons" text,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "activity_feed_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"event_type" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"severity" varchar(20) DEFAULT 'info',
	"related_entity_type" varchar(100),
	"related_entity_id" uuid,
	"metadata" jsonb,
	"created_by" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_optimization_suggestions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"playbook_id" uuid NOT NULL,
	"suggestion_type" varchar(100) NOT NULL,
	"suggestion_title" varchar(255) NOT NULL,
	"suggestion_description" text NOT NULL,
	"current_value" jsonb,
	"recommended_value" jsonb,
	"rationale" text NOT NULL,
	"data_supporting" jsonb,
	"estimated_time_improvement" integer,
	"estimated_success_improvement" numeric(3, 2),
	"confidence" numeric(3, 2) NOT NULL,
	"status" varchar(50) DEFAULT 'pending',
	"reviewed_by" varchar,
	"reviewed_at" timestamp,
	"implemented_at" timestamp,
	"generated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "approval_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"execution_instance_id" uuid NOT NULL,
	"decision_node_id" uuid,
	"user_id" varchar NOT NULL,
	"token" varchar(255) NOT NULL,
	"action" varchar(50) NOT NULL,
	"context" jsonb,
	"expires_at" timestamp NOT NULL,
	"used_at" timestamp,
	"used_by" varchar,
	"ip_address" varchar(50),
	"user_agent" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "approval_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "budget_unlocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"execution_instance_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"playbook_id" uuid,
	"budget_category" varchar(100) NOT NULL,
	"pre_approved_amount" numeric(15, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD',
	"approved_by" varchar,
	"approval_date" timestamp,
	"unlocked_at" timestamp DEFAULT now() NOT NULL,
	"unlocked_by" varchar,
	"spent_amount" numeric(15, 2) DEFAULT '0',
	"status" varchar(50) DEFAULT 'unlocked',
	"cost_center" varchar(100),
	"purchase_order_ref" varchar(100),
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "checkpoint_validations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"execution_instance_id" uuid NOT NULL,
	"checkpoint_id" uuid NOT NULL,
	"status" varchar(50) DEFAULT 'pending',
	"validated_by" varchar,
	"validated_at" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "communication_channels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"channel_type" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"configuration" jsonb NOT NULL,
	"is_default" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "compound_threat_alerts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"domains" text[] DEFAULT '{}' NOT NULL,
	"threat_type" text NOT NULL,
	"confidence" integer DEFAULT 0 NOT NULL,
	"ai_hypothesis" text NOT NULL,
	"historical_match" text,
	"staged_playbook_id" uuid,
	"status" text DEFAULT 'active' NOT NULL,
	"detected_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "continuous_operations_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"task_name" varchar(255) NOT NULL,
	"task_type" varchar(100) NOT NULL,
	"schedule" varchar(50),
	"day_of_week" varchar(20),
	"duration_minutes" integer DEFAULT 15,
	"status" varchar(50) DEFAULT 'scheduled',
	"last_run_at" timestamp,
	"next_run_at" timestamp,
	"auto_execute" boolean DEFAULT false,
	"assigned_role_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "custom_data_points" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(100) NOT NULL,
	"metric_type" varchar(50) NOT NULL,
	"unit" varchar(50),
	"sources" jsonb,
	"data_source_id" varchar,
	"default_threshold" jsonb,
	"current_value" text,
	"last_updated_at" timestamp,
	"last_updated_by" varchar,
	"is_active" boolean DEFAULT true,
	"created_by" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "custom_triggers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"created_by" varchar NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(100) NOT NULL,
	"signal_type" varchar(100),
	"condition_field" varchar(255) NOT NULL,
	"condition_operator" varchar(20) NOT NULL,
	"condition_value" numeric(15, 4),
	"condition_unit" varchar(50),
	"condition_logic" varchar(20) DEFAULT 'single',
	"composite_conditions" jsonb,
	"severity" varchar(20) DEFAULT 'medium',
	"alert_threshold" varchar(20) DEFAULT 'yellow',
	"notification_channels" jsonb,
	"escalation_policy_id" uuid,
	"auto_activate_playbook" boolean DEFAULT false,
	"recommended_playbooks" jsonb,
	"monitoring_frequency" varchar(50) DEFAULT 'realtime',
	"data_source_id" varchar,
	"is_active" boolean DEFAULT true,
	"last_triggered_at" timestamp,
	"trigger_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "decision_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"decision_tree_id" uuid,
	"active_response_id" uuid,
	"scenario" varchar(255) NOT NULL,
	"question" text NOT NULL,
	"decision_maker" varchar(255) NOT NULL,
	"option_chosen" text NOT NULL,
	"decision_time_minutes" integer NOT NULL,
	"execution_time_minutes" integer,
	"total_response_time_minutes" integer,
	"total_tasks" integer,
	"completed_tasks" integer,
	"outcome" text,
	"lessons" text,
	"timestamp" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "decision_trees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"scenario" varchar(255) NOT NULL,
	"domain" varchar(100) NOT NULL,
	"category" varchar(50),
	"decision_points" jsonb,
	"is_active" boolean DEFAULT true,
	"times_used" integer DEFAULT 0,
	"avg_decision_time_minutes" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "demo_leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"company" varchar(255) NOT NULL,
	"role" varchar(100),
	"source" varchar(100) DEFAULT 'trade-show-demo',
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "departments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"parent_department_id" uuid,
	"leader_id" varchar,
	"budget" numeric(15, 2),
	"headcount" integer,
	"cost_center" varchar(50),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "document_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"category" varchar(100),
	"domain" varchar(100),
	"template_content" text NOT NULL,
	"merge_fields" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"format" varchar(50) DEFAULT 'markdown',
	"is_active" boolean DEFAULT true,
	"version" integer DEFAULT 1,
	"created_by" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "drill_performance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"drill_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"playbook_id" uuid NOT NULL,
	"target_execution_time" integer DEFAULT 12,
	"actual_execution_time" integer,
	"execution_speed_score" integer,
	"trigger_to_alert" integer,
	"alert_to_activation" integer,
	"activation_to_war_room" integer,
	"war_room_to_decision" integer,
	"decision_to_execution" integer,
	"tier1_participation" numeric(3, 2),
	"tier2_participation" numeric(3, 2),
	"tier3_acknowledgment" numeric(3, 2),
	"role_clarity" numeric(3, 2),
	"bottlenecks" jsonb,
	"communications_sent" integer,
	"communications_delivered" integer,
	"communication_effectiveness" numeric(3, 2),
	"overall_score" integer,
	"passed" boolean DEFAULT false,
	"what_worked" text,
	"what_didnt_work" text,
	"recommendations" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "escalation_policies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"trigger_type" varchar(100),
	"levels" jsonb NOT NULL,
	"default_timeout_minutes" integer DEFAULT 60,
	"auto_escalate" boolean DEFAULT true,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "execution_checkpoints" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"execution_plan_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"phase_id" uuid,
	"sequence" integer NOT NULL,
	"required_task_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"validation_rules" jsonb,
	"approver_role_id" uuid,
	"is_required" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "execution_document_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"playbook_id" uuid,
	"task_id" uuid,
	"name" varchar(255) NOT NULL,
	"document_type" "document_type" NOT NULL,
	"template_content" text,
	"required_variables" jsonb,
	"output_formats" jsonb,
	"storage_integration" varchar(50),
	"storage_path" varchar(500),
	"requires_approval" boolean DEFAULT false,
	"approver_role_id" uuid,
	"auto_generate_on_activation" boolean DEFAULT true,
	"auto_distribute" boolean DEFAULT false,
	"distribution_list" jsonb,
	"version" integer DEFAULT 1,
	"is_latest" boolean DEFAULT true,
	"parent_template_id" uuid,
	"is_active" boolean DEFAULT true,
	"created_by" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "execution_generated_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_id" uuid NOT NULL,
	"execution_instance_id" uuid,
	"name" varchar(255) NOT NULL,
	"document_type" "document_type" NOT NULL,
	"generated_content" text,
	"variables_used" jsonb,
	"file_url" varchar(500),
	"file_format" varchar(20),
	"file_size" integer,
	"external_storage_id" varchar(255),
	"approval_status" varchar(50) DEFAULT 'pending',
	"approved_by" varchar,
	"approved_at" timestamp,
	"rejection_reason" text,
	"distributed_at" timestamp,
	"distribution_recipients" jsonb,
	"version" integer DEFAULT 1,
	"generated_by" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "execution_instance_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"execution_instance_id" uuid NOT NULL,
	"plan_task_id" uuid NOT NULL,
	"assigned_user_id" varchar,
	"assigned_role_id" uuid,
	"status" "execution_task_status" DEFAULT 'pending',
	"blocked_reason" text,
	"started_at" timestamp,
	"completed_at" timestamp,
	"actual_minutes" integer,
	"outcome" text,
	"notes" text,
	"attachments" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "execution_instances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"execution_plan_id" uuid NOT NULL,
	"scenario_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"triggered_by" varchar,
	"trigger_event_id" uuid,
	"trigger_data" jsonb,
	"status" "execution_instance_status" DEFAULT 'pending',
	"current_phase" "execution_phase",
	"started_at" timestamp,
	"completed_at" timestamp,
	"actual_execution_time" integer,
	"outcome" varchar(50),
	"outcome_notes" text,
	"lessons_learned" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "execution_learnings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"execution_instance_id" uuid NOT NULL,
	"playbook_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"learn_item_id" uuid,
	"responses" jsonb NOT NULL,
	"execution_metrics" jsonb,
	"improvement_actions" jsonb DEFAULT '[]',
	"ai_analysis" jsonb,
	"suggested_playbook_updates" jsonb,
	"sentiment_score" numeric(3, 2),
	"key_themes" jsonb DEFAULT '[]',
	"status" varchar(50) DEFAULT 'pending',
	"captured_by" varchar,
	"captured_at" timestamp DEFAULT now(),
	"reviewed_by" varchar,
	"reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "execution_plan_export_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"platform" "sync_platform" NOT NULL,
	"project_name_template" varchar(255),
	"project_description_template" text,
	"phase_mapping" jsonb,
	"field_mappings" jsonb,
	"custom_fields" jsonb,
	"automation_rules" jsonb,
	"default_labels" jsonb,
	"sync_direction" varchar(20) DEFAULT 'push',
	"sync_frequency" varchar(20) DEFAULT 'realtime',
	"is_default" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"created_by" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "execution_plan_phases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"execution_plan_id" uuid NOT NULL,
	"phase" "execution_phase" NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"sequence" integer NOT NULL,
	"start_minute" integer DEFAULT 0,
	"end_minute" integer DEFAULT 2,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "execution_plan_sync_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"execution_instance_id" uuid NOT NULL,
	"export_template_id" uuid NOT NULL,
	"integration_id" uuid NOT NULL,
	"external_project_id" varchar(255) NOT NULL,
	"external_project_url" varchar(500),
	"external_project_key" varchar(100),
	"sync_status" "sync_status" DEFAULT 'pending',
	"last_synced_at" timestamp,
	"last_sync_direction" varchar(20),
	"sync_errors" jsonb,
	"task_sync_map" jsonb,
	"sync_settings" jsonb,
	"tasks_created" integer DEFAULT 0,
	"tasks_synced" integer DEFAULT 0,
	"last_error" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "execution_plan_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phase_id" uuid NOT NULL,
	"execution_plan_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"sequence" integer NOT NULL,
	"required_role_id" uuid,
	"required_role_label" varchar(100),
	"assigned_user_id" varchar,
	"estimated_minutes" integer DEFAULT 2,
	"sla_minutes" integer,
	"priority" "priority" DEFAULT 'high',
	"is_required" boolean DEFAULT true,
	"is_automated" boolean DEFAULT false,
	"automation_config" jsonb,
	"is_parallel" boolean DEFAULT true,
	"parallel_group_id" varchar(100),
	"compliance_control_ids" jsonb,
	"readiness_checks" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "execution_plan_tasks_extended" (
	"task_id" uuid PRIMARY KEY NOT NULL,
	"external_id_prefix" varchar(50),
	"acceptance_criteria" jsonb,
	"deliverables" jsonb,
	"subtasks" jsonb,
	"original_estimate_minutes" integer,
	"remaining_estimate_minutes" integer,
	"time_spent_minutes" integer,
	"labels" jsonb,
	"external_links" jsonb,
	"watcher_user_ids" jsonb,
	"initial_comments" jsonb,
	"custom_field_values" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "execution_pre_approved_resources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"playbook_id" uuid,
	"task_id" uuid,
	"resource_type" "resource_type" NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"budget_amount" numeric(12, 2),
	"budget_currency" varchar(10) DEFAULT 'USD',
	"budget_account_code" varchar(50),
	"budget_category" varchar(100),
	"vendor_id" varchar(100),
	"vendor_name" varchar(255),
	"vendor_contact_info" jsonb,
	"contract_reference" varchar(255),
	"master_service_agreement" varchar(255),
	"personnel_roles" jsonb,
	"personnel_requirements" jsonb,
	"asset_inventory" jsonb,
	"approved_by" varchar,
	"approved_at" timestamp,
	"approval_expires_at" timestamp,
	"approval_conditions" text,
	"approval_document_url" varchar(500),
	"last_activated_at" timestamp,
	"activation_count" integer DEFAULT 0,
	"total_spent" numeric(12, 2) DEFAULT '0',
	"renewal_required" boolean DEFAULT false,
	"renewal_period" varchar(50),
	"next_renewal_date" timestamp,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "execution_task_dependencies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid NOT NULL,
	"depends_on_task_id" uuid NOT NULL,
	"dependency_type" varchar(50) DEFAULT 'prerequisite',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "execution_timelines" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" varchar(255) NOT NULL,
	"trigger_detection_id" integer,
	"trigger_name" varchar(255) NOT NULL,
	"trigger_domain" varchar(100),
	"recommended_playbook" varchar(255),
	"detected_at" timestamp NOT NULL,
	"notification_sent_at" timestamp,
	"playbook_activated_at" timestamp,
	"playbook_name" varchar(255),
	"first_task_acknowledged_at" timestamp,
	"execution_completed_at" timestamp,
	"total_minutes" real,
	"speed_multiplier" real,
	"status" varchar(50) DEFAULT 'detected',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "external_project_syncs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"execution_instance_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"platform" varchar(50) NOT NULL,
	"external_project_id" varchar(255),
	"external_project_key" varchar(100),
	"external_project_url" varchar(500),
	"tasks_created" integer DEFAULT 0,
	"task_mappings" jsonb DEFAULT '[]',
	"sync_status" varchar(50) DEFAULT 'pending',
	"sync_direction" varchar(20) DEFAULT 'push',
	"last_sync_at" timestamp,
	"next_sync_at" timestamp,
	"error_message" text,
	"retry_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "generated_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"execution_instance_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"template_id" varchar(255),
	"document_name" varchar(255) NOT NULL,
	"document_type" varchar(50) NOT NULL,
	"content" text,
	"format" varchar(20) DEFAULT 'markdown',
	"file_url" varchar(500),
	"file_size" integer,
	"variables_used" jsonb,
	"generated_at" timestamp DEFAULT now() NOT NULL,
	"generated_by" varchar(50) DEFAULT 'system',
	"distributed_to" jsonb DEFAULT '[]',
	"distributed_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "incident_analyses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" varchar(100),
	"company_name" varchar(255),
	"incident_description" text NOT NULL,
	"incident_type" varchar(100),
	"what_went_wrong" jsonb,
	"estimated_impact" varchar(100),
	"time_to_coordination" varchar(100),
	"root_cause" text,
	"your_reality" jsonb,
	"with_execute_iq" jsonb,
	"cost_without" varchar(100),
	"cost_with" varchar(100),
	"generated_playbook" jsonb,
	"simulation_results" jsonb,
	"readiness_score" integer,
	"readiness_gaps" jsonb,
	"what_if_results" jsonb,
	"email" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "investor_leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"company" text NOT NULL,
	"role" text NOT NULL,
	"page_accessed" text DEFAULT '/investor-resources' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "magic_link_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"company" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"token" varchar(128) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"used_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "magic_link_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "mck_change_readiness_checks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"roadmap_id" uuid,
	"check_date" timestamp DEFAULT now() NOT NULL,
	"conducted_by" varchar NOT NULL,
	"overall_readiness_score" integer NOT NULL,
	"capability_scores" jsonb,
	"adoption_rate" numeric(5, 2),
	"risk_level" "mck_readiness_risk" NOT NULL,
	"risk_flags" jsonb,
	"recommendations" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mck_executive_buyin_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"roadmap_id" uuid,
	"snapshot_date" timestamp DEFAULT now() NOT NULL,
	"stakeholder_id" varchar NOT NULL,
	"stakeholder_name" varchar(255) NOT NULL,
	"stakeholder_role" varchar(255),
	"engagement" "mck_engagement" NOT NULL,
	"commitment_score" integer NOT NULL,
	"last_interaction" timestamp,
	"feedback_notes" text,
	"action_items" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mck_gap_targets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"element_key" varchar(50) NOT NULL,
	"target_maturity_level" "mck_maturity_level" NOT NULL,
	"target_maturity_score" integer NOT NULL,
	"strategic_weight" numeric(3, 2),
	"rationale" text,
	"set_by" varchar NOT NULL,
	"set_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mck_operating_model_assessments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"assessment_name" varchar(255) NOT NULL,
	"assessment_date" timestamp DEFAULT now() NOT NULL,
	"conducted_by" varchar NOT NULL,
	"overall_maturity" numeric(3, 1),
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mck_operating_model_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"assessment_id" uuid NOT NULL,
	"element_key" varchar(50) NOT NULL,
	"maturity_level" "mck_maturity_level" NOT NULL,
	"maturity_score" integer NOT NULL,
	"qualitative_notes" text,
	"evidence" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mck_sustainable_practice_audits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"roadmap_id" uuid,
	"audit_name" varchar(255) NOT NULL,
	"audit_date" timestamp DEFAULT now() NOT NULL,
	"conducted_by" varchar NOT NULL,
	"overall_compliance_score" integer,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mck_sustainable_practice_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"audit_id" uuid NOT NULL,
	"rule_key" varchar(100) NOT NULL,
	"rule_name" varchar(255) NOT NULL,
	"compliance_status" "mck_compliance_status" NOT NULL,
	"owner" varchar,
	"evidence_links" jsonb,
	"review_cadence" varchar(50),
	"last_review_date" timestamp,
	"next_review_date" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mck_transformation_roadmaps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"roadmap_name" varchar(255) NOT NULL,
	"description" text,
	"start_date" timestamp NOT NULL,
	"target_completion_date" timestamp,
	"current_phase" "mck_phase" DEFAULT 'diagnose' NOT NULL,
	"business_case_value" numeric(15, 2),
	"owner" varchar NOT NULL,
	"status" "status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mck_transformation_workstreams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"roadmap_id" uuid NOT NULL,
	"workstream_name" varchar(255) NOT NULL,
	"phase" "mck_phase" NOT NULL,
	"element_key" varchar(50),
	"dependencies" jsonb,
	"milestones" jsonb,
	"golden_rule_compliance" jsonb,
	"start_date" timestamp,
	"end_date" timestamp,
	"owner" varchar NOT NULL,
	"status" "status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mck_value_realization_metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"roadmap_id" uuid,
	"execution_instance_id" uuid,
	"measurement_date" timestamp DEFAULT now() NOT NULL,
	"clarity_score" integer NOT NULL,
	"speed_score" integer NOT NULL,
	"skills_score" integer NOT NULL,
	"commitment_score" integer NOT NULL,
	"overall_outcome_score" integer NOT NULL,
	"roi_percentage" numeric(7, 2),
	"cost_savings_usd" numeric(15, 2),
	"time_savings_hours" numeric(10, 2),
	"coordination_speed_improvement" numeric(5, 2),
	"clarity_trend" "mck_trend",
	"speed_trend" "mck_trend",
	"skills_trend" "mck_trend",
	"commitment_trend" "mck_trend",
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"conversation_id" integer NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "oracle_patterns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"pattern_type" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"confidence" numeric(3, 0) NOT NULL,
	"impact" varchar(50) NOT NULL,
	"timeline" varchar(50),
	"recommendations" jsonb,
	"affected_scenarios" jsonb,
	"evidence_signals" jsonb,
	"status" varchar(50) DEFAULT 'detected',
	"detected_at" timestamp DEFAULT now() NOT NULL,
	"actioned_at" timestamp,
	"actioned_by" varchar
);
--> statement-breakpoint
CREATE TABLE "organization_onboarding" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"stage0_orientation" boolean DEFAULT false,
	"stage1_prepare" boolean DEFAULT false,
	"stage2_monitor" boolean DEFAULT false,
	"stage3_execute" boolean DEFAULT false,
	"stage4_learn" boolean DEFAULT false,
	"org_structure_complete" boolean DEFAULT false,
	"stakeholders_configured" integer DEFAULT 0,
	"triggers_configured" integer DEFAULT 0,
	"playbooks_customized" integer DEFAULT 0,
	"drills_completed" integer DEFAULT 0,
	"fri_baseline" numeric(5, 2),
	"fri_current" numeric(5, 2),
	"fri_target" numeric(5, 2) DEFAULT '84.4',
	"onboarding_started_at" timestamp DEFAULT now() NOT NULL,
	"onboarding_completed_at" timestamp,
	"last_activity_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "peer_review_actions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"category" text DEFAULT 'general' NOT NULL,
	"insight" text NOT NULL,
	"action" text NOT NULL,
	"status" text DEFAULT 'identified' NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "peer_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"reviewer_type" text DEFAULT 'peer' NOT NULL,
	"source_url" text DEFAULT '',
	"reviewer_name" text NOT NULL,
	"reviewer_role" text NOT NULL,
	"reviewer_org" text NOT NULL,
	"reviewer_industry" text DEFAULT '',
	"years_experience" text DEFAULT '',
	"q1_scale" integer,
	"q1_text" text DEFAULT '',
	"q2_selection" text DEFAULT '',
	"q2_text" text DEFAULT '',
	"q3_scale" integer,
	"q3_text" text DEFAULT '',
	"q4_scale" integer,
	"q4_text" text DEFAULT '',
	"q5_scale" integer,
	"q5_text" text DEFAULT '',
	"q6_text" text DEFAULT '',
	"q7_scale" integer,
	"q7_text" text DEFAULT '',
	"q8_scale" integer,
	"q8_text" text DEFAULT '',
	"q9_selections" text[] DEFAULT '{}',
	"q9_text" text DEFAULT '',
	"q10_scale" integer,
	"q10_text" text DEFAULT '',
	"q11_selection" text DEFAULT '',
	"q11_text" text DEFAULT '',
	"q12_selections" text[] DEFAULT '{}',
	"q12_text" text DEFAULT '',
	"q13_selection" text DEFAULT '',
	"q13_text" text DEFAULT '',
	"q14_rankings" jsonb DEFAULT '[]'::jsonb,
	"q15_text" text DEFAULT '',
	"q16_ratings" jsonb DEFAULT '{}'::jsonb,
	"q17_text" text DEFAULT '',
	"q18_text" text DEFAULT '',
	"q19_text" text DEFAULT '',
	"q20_selection" text DEFAULT '',
	"q20_text" text DEFAULT '',
	"q21_scale" integer,
	"q21_text" text DEFAULT '',
	"q22_text" text DEFAULT '',
	"q23_scale" integer,
	"q24_selection" text DEFAULT '',
	"q24_text" text DEFAULT '',
	"q25_scale" integer,
	"q25_text" text DEFAULT '',
	"q26_selection" text DEFAULT '',
	"q27_text" text DEFAULT '',
	"q28_text" text DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE "pilot_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"company" text NOT NULL,
	"title" text NOT NULL,
	"company_size" text NOT NULL,
	"primary_challenge" text NOT NULL,
	"scenarios_of_interest" text NOT NULL,
	"status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "playbook_activations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"playbook_id" uuid NOT NULL,
	"execution_instance_id" uuid,
	"trigger_event_id" uuid,
	"activated_by" varchar NOT NULL,
	"activation_reason" text,
	"situation_summary" text,
	"success_rating" integer,
	"actual_execution_time" integer,
	"target_met" boolean,
	"lessons_learned" text,
	"playbook_improvements" jsonb,
	"activated_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "playbook_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"domain_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"sequence" integer NOT NULL,
	"total_playbooks" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "playbook_communication_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"playbook_id" uuid NOT NULL,
	"template_type" varchar(100) NOT NULL,
	"template_name" varchar(255) NOT NULL,
	"subject" varchar(500),
	"body_template" text NOT NULL,
	"variables" jsonb,
	"recipient_roles" jsonb,
	"send_timing" varchar(100),
	"is_required" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "playbook_customizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"playbook_id" uuid NOT NULL,
	"organization_id" uuid,
	"situation_completed" boolean DEFAULT false,
	"stakeholders_completed" boolean DEFAULT false,
	"decision_trees_completed" boolean DEFAULT false,
	"communication_completed" boolean DEFAULT false,
	"task_sequences_completed" boolean DEFAULT false,
	"budget_completed" boolean DEFAULT false,
	"success_metrics_completed" boolean DEFAULT false,
	"lessons_learned_completed" boolean DEFAULT false,
	"preparedness_score" numeric(5, 2),
	"last_customized_at" timestamp,
	"last_customized_by" varchar,
	"custom_data" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "playbook_decision_trees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"playbook_id" uuid NOT NULL,
	"checkpoint_number" integer NOT NULL,
	"checkpoint_name" varchar(255) NOT NULL,
	"checkpoint_timing" varchar(50),
	"decision_question" text NOT NULL,
	"decision_options" jsonb NOT NULL,
	"decision_criteria" jsonb,
	"decision_authority" varchar(100),
	"sequence" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "playbook_domains" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"code" varchar(50) NOT NULL,
	"description" text,
	"icon" varchar(50),
	"color" varchar(50),
	"sequence" integer NOT NULL,
	"primary_executive_role" varchar(100),
	"total_playbooks" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "playbook_domains_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "playbook_learn_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"playbook_id" uuid NOT NULL,
	"organization_id" uuid,
	"learn_type" "learn_item_type" NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"timing" varchar(50) DEFAULT 'within_24_hours',
	"offset_hours" integer DEFAULT 24,
	"responsible_role" varchar(100),
	"responsible_user_id" varchar,
	"required_participants" jsonb DEFAULT '[]',
	"optional_participants" jsonb DEFAULT '[]',
	"learning_prompts" jsonb DEFAULT '[]',
	"expected_outputs" jsonb DEFAULT '[]',
	"auto_create_improvement_task" boolean DEFAULT true,
	"is_required" boolean DEFAULT true,
	"sequence" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "playbook_learnings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scenario_id" uuid NOT NULL,
	"execution_instance_id" uuid,
	"learning" text NOT NULL,
	"category" varchar(100),
	"impact" varchar(50),
	"applied_to_version" varchar(20),
	"confidence" numeric(3, 2),
	"extracted_at" timestamp DEFAULT now() NOT NULL,
	"applied_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "playbook_library" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"playbook_number" integer NOT NULL,
	"domain_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"strategic_category" "strategic_category" DEFAULT 'defense' NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"primary_executive_role" varchar(50),
	"trigger_criteria" text NOT NULL,
	"trigger_data_sources" jsonb,
	"trigger_threshold" jsonb,
	"severity_score" integer,
	"time_sensitivity" integer,
	"historical_frequency" varchar(50),
	"activation_frequency_tier" varchar(20),
	"tier1_stakeholders" jsonb,
	"tier2_stakeholders" jsonb,
	"tier3_stakeholders" jsonb,
	"external_partners" jsonb,
	"tier1_count" integer,
	"tier2_count" integer,
	"tier3_count" integer,
	"primary_response_strategy" text,
	"pre_approved_budget" numeric(12, 2),
	"budget_approval_required" boolean DEFAULT false,
	"vendor_contracts" jsonb,
	"external_resource_roster" jsonb,
	"target_execution_time" integer DEFAULT 12,
	"average_activation_frequency" varchar(50),
	"historical_success_rate" numeric(3, 2),
	"target_response_speed" integer DEFAULT 12,
	"target_stakeholder_reach" numeric(3, 2) DEFAULT 1.00,
	"outcome_metrics" jsonb,
	"learning_metrics" jsonb,
	"why_it_matters" text,
	"signal_sources" jsonb,
	"enriched_phases" jsonb,
	"communication_assets" jsonb,
	"risk_indicators" jsonb,
	"outcome_framing" jsonb,
	"is_premium" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "playbook_library_playbook_number_unique" UNIQUE("playbook_number")
);
--> statement-breakpoint
CREATE TABLE "playbook_monitor_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"playbook_id" uuid NOT NULL,
	"organization_id" uuid,
	"signal_type" varchar(50) NOT NULL,
	"signal_name" varchar(255) NOT NULL,
	"signal_description" text,
	"linked_signal_id" uuid,
	"data_source" varchar(100),
	"data_source_config" jsonb,
	"trigger_type" varchar(50) NOT NULL,
	"trigger_conditions" jsonb NOT NULL,
	"severity" varchar(20) DEFAULT 'medium',
	"response_urgency" varchar(50) DEFAULT 'standard',
	"notify_roles" jsonb DEFAULT '[]',
	"requires_confirmation" boolean DEFAULT true,
	"confirmation_role" varchar(100),
	"auto_activate_after_minutes" integer,
	"is_active" boolean DEFAULT true,
	"last_checked_at" timestamp,
	"last_triggered_at" timestamp,
	"trigger_count" integer DEFAULT 0,
	"check_frequency_minutes" integer DEFAULT 60,
	"sequence" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "playbook_prepare_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"playbook_id" uuid NOT NULL,
	"organization_id" uuid,
	"item_type" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"responsible_role" varchar(100),
	"responsible_user_id" varchar,
	"status" "prepare_item_status" DEFAULT 'not_started',
	"completed_at" timestamp,
	"completed_by" varchar,
	"verification_method" varchar(100),
	"last_verified_at" timestamp,
	"verification_frequency_days" integer DEFAULT 90,
	"depends_on" jsonb DEFAULT '[]',
	"priority" "priority" DEFAULT 'medium',
	"is_required" boolean DEFAULT true,
	"notes" text,
	"attachments" jsonb DEFAULT '[]',
	"sequence" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "playbook_prepare_verification_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"prepare_item_id" uuid NOT NULL,
	"verified_by" varchar,
	"verified_at" timestamp DEFAULT now() NOT NULL,
	"previous_status" "prepare_item_status",
	"new_status" "prepare_item_status",
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "playbook_readiness_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"playbook_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"overall_score" integer DEFAULT 0,
	"prepare_score" integer DEFAULT 0,
	"monitor_score" integer DEFAULT 0,
	"execute_score" integer DEFAULT 0,
	"learn_score" integer DEFAULT 0,
	"prepare_weight" integer DEFAULT 40,
	"monitor_weight" integer DEFAULT 20,
	"execute_weight" integer DEFAULT 30,
	"learn_weight" integer DEFAULT 10,
	"stakeholders_assigned" integer DEFAULT 0,
	"stakeholders_total" integer DEFAULT 0,
	"documents_ready" integer DEFAULT 0,
	"documents_total" integer DEFAULT 0,
	"resources_staged" integer DEFAULT 0,
	"resources_total" integer DEFAULT 0,
	"triggers_configured" integer DEFAULT 0,
	"triggers_active" integer DEFAULT 0,
	"tasks_configured" integer DEFAULT 0,
	"decision_trees_configured" integer DEFAULT 0,
	"learn_items_configured" integer DEFAULT 0,
	"last_calculated_at" timestamp DEFAULT now(),
	"last_drilled_at" timestamp,
	"last_activated_at" timestamp,
	"total_activations" integer DEFAULT 0,
	"average_execution_time_minutes" integer,
	"success_rate" numeric(5, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "playbook_task_sequences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"playbook_id" uuid NOT NULL,
	"task_name" varchar(255) NOT NULL,
	"task_description" text,
	"timing" varchar(50) NOT NULL,
	"timeline_phase" varchar(50),
	"task_owner" varchar(100),
	"dependencies" jsonb,
	"sequence" integer NOT NULL,
	"is_required" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "playbook_template_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_id" uuid NOT NULL,
	"section_number" integer NOT NULL,
	"section_name" varchar(255) NOT NULL,
	"section_code" varchar(50) NOT NULL,
	"prefilled_percentage" integer NOT NULL,
	"description" text,
	"field_mappings" jsonb,
	"required_fields" jsonb,
	"sequence" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "playbook_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"version" varchar(50) DEFAULT '1.0' NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true,
	"domain_overlays" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "playbook_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scenario_id" uuid NOT NULL,
	"version" varchar(20) NOT NULL,
	"changes" text,
	"learnings_integrated" jsonb,
	"created_by" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "playbooks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"source_type" varchar(50) NOT NULL,
	"template_id" uuid,
	"times_used" integer DEFAULT 0,
	"avg_response_time_seconds" integer,
	"name" varchar(255) NOT NULL,
	"domain" varchar(100) NOT NULL,
	"category" varchar(50),
	"description" text,
	"priority" varchar(20) DEFAULT 'medium',
	"total_budget" numeric(14, 2) DEFAULT '0',
	"budget_currency" varchar(10) DEFAULT 'USD',
	"trigger_conditions" jsonb,
	"escalation_paths" jsonb,
	"stakeholders" jsonb,
	"execution_steps" jsonb,
	"budget_allocations" jsonb,
	"business_impacts" jsonb,
	"success_metrics" jsonb,
	"compliance_frameworks" jsonb,
	"compliance_requirements" jsonb,
	"legal_review_status" varchar(50) DEFAULT 'not_required',
	"legal_review_approver" varchar(255),
	"legal_review_date" varchar(50),
	"audit_trail_required" boolean DEFAULT false,
	"risk_score" integer DEFAULT 5,
	"max_financial_exposure" numeric(14, 2) DEFAULT '0',
	"reputational_risk_level" varchar(20) DEFAULT 'medium',
	"risk_notes" text,
	"press_response_required" boolean DEFAULT false,
	"investor_notification_required" boolean DEFAULT false,
	"investor_notification_threshold" varchar(255),
	"board_notification_required" boolean DEFAULT false,
	"board_notification_threshold" varchar(255),
	"pre_approved_messaging" text,
	"dependencies" jsonb,
	"playbook_owner" varchar(255),
	"playbook_owner_email" varchar(255),
	"next_review_date" varchar(50),
	"review_frequency" varchar(50) DEFAULT 'quarterly',
	"version_notes" text,
	"change_approval_required" boolean DEFAULT false,
	"geographic_scope" jsonb,
	"primary_timezone" varchar(100),
	"local_regulations" text,
	"last_drill_date" varchar(50),
	"next_drill_date" varchar(50),
	"drill_frequency" varchar(50) DEFAULT 'quarterly',
	"training_requirements" text,
	"certification_requirements" text,
	"status" varchar(20) DEFAULT 'draft',
	"completion_percentage" integer DEFAULT 0,
	"leadership_capability" varchar(50),
	"strategic_objectives" jsonb,
	"execution_progress_toward_goal" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"is_template" boolean DEFAULT false,
	"created_by" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "practice_drills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"playbook_id" uuid NOT NULL,
	"drill_name" varchar(255) NOT NULL,
	"drill_type" varchar(100) DEFAULT 'scheduled',
	"scenario_description" text,
	"scheduled_date" timestamp NOT NULL,
	"scheduled_time" varchar(50),
	"estimated_duration" integer DEFAULT 30,
	"invited_participants" jsonb,
	"actual_participants" jsonb,
	"status" varchar(50) DEFAULT 'scheduled',
	"started_at" timestamp,
	"completed_at" timestamp,
	"actual_duration" integer,
	"complications" jsonb,
	"created_by" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "preflight_check_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"execution_plan_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"can_proceed" boolean NOT NULL,
	"readiness_score" integer NOT NULL,
	"estimated_completion_time" integer,
	"critical_issues" integer DEFAULT 0,
	"warnings" jsonb DEFAULT '[]',
	"metadata" jsonb,
	"checked_by" varchar,
	"checked_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "readiness_assessments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" varchar(100),
	"company_name" varchar(255),
	"answers" jsonb NOT NULL,
	"score" integer NOT NULL,
	"gaps" jsonb,
	"benchmark" varchar(100),
	"recommendations" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "readiness_metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"measurement_date" timestamp DEFAULT now() NOT NULL,
	"overall_score" numeric(4, 1) NOT NULL,
	"foresight_score" numeric(3, 0),
	"velocity_score" numeric(3, 0),
	"agility_score" numeric(3, 0),
	"learning_score" numeric(3, 0),
	"adaptability_score" numeric(3, 0),
	"active_scenarios" integer DEFAULT 0,
	"weak_signals_detected" integer DEFAULT 0,
	"playbooks_ready" integer DEFAULT 0,
	"playbooks_total" integer DEFAULT 0,
	"average_response_time" integer,
	"trend" varchar(10),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roi_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"period" text NOT NULL,
	"activation_count" integer DEFAULT 0 NOT NULL,
	"avg_response_minutes" integer DEFAULT 0 NOT NULL,
	"industry_benchmark_minutes" integer DEFAULT 4320 NOT NULL,
	"estimated_value_preserved" integer DEFAULT 0 NOT NULL,
	"events_analyzed" integer DEFAULT 0 NOT NULL,
	"generated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "role_availability_flags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"role_name" varchar(100) NOT NULL,
	"is_limited" boolean DEFAULT false NOT NULL,
	"note" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"updated_by" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "scenario_execution_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scenario_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"target_execution_time" integer DEFAULT 12,
	"is_active" boolean DEFAULT true,
	"version" integer DEFAULT 1,
	"created_by" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "signal_activity_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" varchar(255),
	"event_type" varchar(50) NOT NULL,
	"source" varchar(100),
	"signal_title" varchar(500),
	"details" text,
	"confidence" integer,
	"keywords_matched" text[] DEFAULT '{}',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "signal_monitoring_config" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"disabled_data_points" text[] DEFAULT '{}',
	"evaluation_mode" varchar(20) DEFAULT 'both',
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "simulation_analyses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"scenario_text" text NOT NULL,
	"survive_score" integer DEFAULT 0 NOT NULL,
	"thrive_score" integer DEFAULT 0 NOT NULL,
	"ai_analysis" text DEFAULT '' NOT NULL,
	"coverage_gaps" text[] DEFAULT '{}',
	"recommended_playbooks" text[] DEFAULT '{}',
	"activated_domains" text[] DEFAULT '{}',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "situation_intents" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" varchar(255) NOT NULL,
	"trigger_id" varchar(255) NOT NULL,
	"trigger_name" varchar(255) NOT NULL,
	"trigger_domain" varchar(100),
	"protected_outcome" text,
	"business_impact" varchar(50),
	"urgency_level" varchar(20) DEFAULT 'high',
	"brief_requirements" text[] DEFAULT '{}',
	"primary_data_points" text[] DEFAULT '{}',
	"primary_data_point_labels" text[] DEFAULT '{}',
	"sensitivity_level" varchar(20) DEFAULT 'standard',
	"situation_stakeholders" jsonb DEFAULT '[]'::jsonb,
	"context_notes" text,
	"is_configured" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "stakeholder_acknowledgments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"execution_instance_id" uuid NOT NULL,
	"stakeholder_id" uuid NOT NULL,
	"user_id" varchar,
	"notified_at" timestamp DEFAULT now() NOT NULL,
	"notification_channel" varchar(50),
	"acknowledged_at" timestamp,
	"acknowledgment_type" varchar(50),
	"delegated_to" varchar,
	"response_notes" text,
	"reminder_count" integer DEFAULT 0,
	"last_reminder_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "stakeholder_contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" varchar(255) NOT NULL,
	"role" varchar(100) NOT NULL,
	"name" varchar(255),
	"email" varchar(255),
	"slack_user_id" varchar(100),
	"slack_channel" varchar(100),
	"is_active" boolean DEFAULT true,
	"trigger_domains" text[] DEFAULT '{}',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "stakeholder_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"role_name" varchar(255) NOT NULL,
	"role_type" varchar(50) NOT NULL,
	"description" text,
	"permissions" jsonb,
	"default_approval_limit" numeric(15, 2),
	"can_approve_activations" boolean DEFAULT false,
	"can_execute_tasks" boolean DEFAULT true,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "strategic_objectives" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"target_date" varchar(50),
	"target_value" numeric(14, 2),
	"current_value" numeric(14, 2) DEFAULT '0',
	"value_unit" varchar(50),
	"leadership_capability" varchar(50),
	"priority" integer DEFAULT 1,
	"status" varchar(50) DEFAULT 'active',
	"progress" integer DEFAULT 0,
	"execution_count" integer DEFAULT 0,
	"created_by" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "strategic_recordings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"input_text" text NOT NULL,
	"generated_playbooks" jsonb DEFAULT '[]'::jsonb,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "success_metrics_config" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"metric_name" varchar(255) NOT NULL,
	"metric_type" varchar(100) NOT NULL,
	"description" text,
	"target_value" numeric(15, 4),
	"target_unit" varchar(50),
	"current_value" numeric(15, 4),
	"baseline_value" numeric(15, 4),
	"calculation_formula" text,
	"data_source" varchar(255),
	"review_cadence" varchar(50) DEFAULT 'weekly',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "task_acknowledgments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"task_label" text NOT NULL,
	"task_index" integer,
	"acknowledged_by" varchar(255) NOT NULL,
	"acknowledged_role" varchar(100) NOT NULL,
	"action_type" varchar(50) DEFAULT 'complete' NOT NULL,
	"notes" text,
	"acknowledged_at" timestamp DEFAULT now() NOT NULL,
	"organization_id" uuid
);
--> statement-breakpoint
CREATE TABLE "task_document_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan_task_id" uuid NOT NULL,
	"document_template_id" uuid NOT NULL,
	"is_required" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trial_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"company" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"token" varchar(128) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"activated_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "trial_sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "trigger_detections" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" varchar(255) NOT NULL,
	"trigger_name" varchar(255) NOT NULL,
	"trigger_domain" varchar(100),
	"signal_description" text NOT NULL,
	"signal_source" varchar(255),
	"signal_source_url" varchar(2000),
	"confidence_score" integer NOT NULL,
	"recommended_playbook" varchar(255),
	"alternate_playbooks" text[] DEFAULT '{}',
	"status" varchar(50) DEFAULT 'detected',
	"notification_sent" boolean DEFAULT false,
	"detected_at" timestamp DEFAULT now(),
	"matched_evidence" jsonb
);
--> statement-breakpoint
CREATE TABLE "weak_signals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"signal_type" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"confidence" numeric(3, 0) NOT NULL,
	"timeline" varchar(50),
	"impact" varchar(50),
	"source" varchar(255),
	"related_scenarios" jsonb,
	"status" varchar(50) DEFAULT 'active',
	"detected_at" timestamp DEFAULT now() NOT NULL,
	"acknowledged_by" varchar,
	"acknowledged_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "what_if_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"incident_analysis_id" uuid,
	"scenario" text NOT NULL,
	"original_time" varchar(50),
	"modified_time" varchar(50),
	"impact" text,
	"recommendation" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "trigger_signals" ALTER COLUMN "data_source_id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "executive_triggers" ADD COLUMN "magnitude_score" integer DEFAULT 5;--> statement-breakpoint
ALTER TABLE "executive_triggers" ADD COLUMN "time_horizon" varchar(50) DEFAULT 'emerging';--> statement-breakpoint
ALTER TABLE "executive_triggers" ADD COLUMN "strategic_relevance_score" integer DEFAULT 5;--> statement-breakpoint
ALTER TABLE "executive_triggers" ADD COLUMN "anticipation_value" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "executive_triggers" ADD COLUMN "anticipation_window_days" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "executive_triggers" ADD COLUMN "could_have_anticipated" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "executive_triggers" ADD COLUMN "leadership_capability" varchar(50);--> statement-breakpoint
ALTER TABLE "strategic_scenarios" ADD COLUMN "why_it_matters" text;--> statement-breakpoint
ALTER TABLE "strategic_scenarios" ADD COLUMN "signal_sources" jsonb;--> statement-breakpoint
ALTER TABLE "strategic_scenarios" ADD COLUMN "enriched_phases" jsonb;--> statement-breakpoint
ALTER TABLE "strategic_scenarios" ADD COLUMN "communication_assets" jsonb;--> statement-breakpoint
ALTER TABLE "strategic_scenarios" ADD COLUMN "risk_indicators" jsonb;--> statement-breakpoint
ALTER TABLE "strategic_scenarios" ADD COLUMN "outcome_framing" jsonb;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "timezone" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "executive_role" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "industry_vertical" varchar(100);--> statement-breakpoint
ALTER TABLE "activation_events" ADD CONSTRAINT "activation_events_execution_instance_id_execution_instances_id_fk" FOREIGN KEY ("execution_instance_id") REFERENCES "public"."execution_instances"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activation_events" ADD CONSTRAINT "activation_events_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_feed_events" ADD CONSTRAINT "activity_feed_events_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_feed_events" ADD CONSTRAINT "activity_feed_events_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_optimization_suggestions" ADD CONSTRAINT "ai_optimization_suggestions_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_optimization_suggestions" ADD CONSTRAINT "ai_optimization_suggestions_playbook_id_playbook_library_id_fk" FOREIGN KEY ("playbook_id") REFERENCES "public"."playbook_library"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_optimization_suggestions" ADD CONSTRAINT "ai_optimization_suggestions_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_tokens" ADD CONSTRAINT "approval_tokens_execution_instance_id_execution_instances_id_fk" FOREIGN KEY ("execution_instance_id") REFERENCES "public"."execution_instances"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_tokens" ADD CONSTRAINT "approval_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_tokens" ADD CONSTRAINT "approval_tokens_used_by_users_id_fk" FOREIGN KEY ("used_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "budget_unlocks" ADD CONSTRAINT "budget_unlocks_execution_instance_id_execution_instances_id_fk" FOREIGN KEY ("execution_instance_id") REFERENCES "public"."execution_instances"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "budget_unlocks" ADD CONSTRAINT "budget_unlocks_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "budget_unlocks" ADD CONSTRAINT "budget_unlocks_playbook_id_playbook_library_id_fk" FOREIGN KEY ("playbook_id") REFERENCES "public"."playbook_library"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "budget_unlocks" ADD CONSTRAINT "budget_unlocks_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "budget_unlocks" ADD CONSTRAINT "budget_unlocks_unlocked_by_users_id_fk" FOREIGN KEY ("unlocked_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checkpoint_validations" ADD CONSTRAINT "checkpoint_validations_execution_instance_id_execution_instances_id_fk" FOREIGN KEY ("execution_instance_id") REFERENCES "public"."execution_instances"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checkpoint_validations" ADD CONSTRAINT "checkpoint_validations_checkpoint_id_execution_checkpoints_id_fk" FOREIGN KEY ("checkpoint_id") REFERENCES "public"."execution_checkpoints"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checkpoint_validations" ADD CONSTRAINT "checkpoint_validations_validated_by_users_id_fk" FOREIGN KEY ("validated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "communication_channels" ADD CONSTRAINT "communication_channels_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compound_threat_alerts" ADD CONSTRAINT "compound_threat_alerts_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "continuous_operations_tasks" ADD CONSTRAINT "continuous_operations_tasks_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "continuous_operations_tasks" ADD CONSTRAINT "continuous_operations_tasks_assigned_role_id_roles_id_fk" FOREIGN KEY ("assigned_role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_data_points" ADD CONSTRAINT "custom_data_points_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_data_points" ADD CONSTRAINT "custom_data_points_data_source_id_data_sources_id_fk" FOREIGN KEY ("data_source_id") REFERENCES "public"."data_sources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_data_points" ADD CONSTRAINT "custom_data_points_last_updated_by_users_id_fk" FOREIGN KEY ("last_updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_data_points" ADD CONSTRAINT "custom_data_points_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_triggers" ADD CONSTRAINT "custom_triggers_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_triggers" ADD CONSTRAINT "custom_triggers_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_triggers" ADD CONSTRAINT "custom_triggers_escalation_policy_id_escalation_policies_id_fk" FOREIGN KEY ("escalation_policy_id") REFERENCES "public"."escalation_policies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_triggers" ADD CONSTRAINT "custom_triggers_data_source_id_data_sources_id_fk" FOREIGN KEY ("data_source_id") REFERENCES "public"."data_sources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "departments" ADD CONSTRAINT "departments_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "departments" ADD CONSTRAINT "departments_leader_id_users_id_fk" FOREIGN KEY ("leader_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_templates" ADD CONSTRAINT "document_templates_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_templates" ADD CONSTRAINT "document_templates_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "drill_performance" ADD CONSTRAINT "drill_performance_drill_id_practice_drills_id_fk" FOREIGN KEY ("drill_id") REFERENCES "public"."practice_drills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "drill_performance" ADD CONSTRAINT "drill_performance_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "drill_performance" ADD CONSTRAINT "drill_performance_playbook_id_playbook_library_id_fk" FOREIGN KEY ("playbook_id") REFERENCES "public"."playbook_library"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escalation_policies" ADD CONSTRAINT "escalation_policies_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_checkpoints" ADD CONSTRAINT "execution_checkpoints_execution_plan_id_scenario_execution_plans_id_fk" FOREIGN KEY ("execution_plan_id") REFERENCES "public"."scenario_execution_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_checkpoints" ADD CONSTRAINT "execution_checkpoints_phase_id_execution_plan_phases_id_fk" FOREIGN KEY ("phase_id") REFERENCES "public"."execution_plan_phases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_checkpoints" ADD CONSTRAINT "execution_checkpoints_approver_role_id_roles_id_fk" FOREIGN KEY ("approver_role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_document_templates" ADD CONSTRAINT "execution_document_templates_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_document_templates" ADD CONSTRAINT "execution_document_templates_playbook_id_strategic_scenarios_id_fk" FOREIGN KEY ("playbook_id") REFERENCES "public"."strategic_scenarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_document_templates" ADD CONSTRAINT "execution_document_templates_task_id_execution_plan_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."execution_plan_tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_document_templates" ADD CONSTRAINT "execution_document_templates_approver_role_id_roles_id_fk" FOREIGN KEY ("approver_role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_document_templates" ADD CONSTRAINT "execution_document_templates_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_generated_documents" ADD CONSTRAINT "execution_generated_documents_template_id_execution_document_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."execution_document_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_generated_documents" ADD CONSTRAINT "execution_generated_documents_execution_instance_id_execution_instances_id_fk" FOREIGN KEY ("execution_instance_id") REFERENCES "public"."execution_instances"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_generated_documents" ADD CONSTRAINT "execution_generated_documents_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_generated_documents" ADD CONSTRAINT "execution_generated_documents_generated_by_users_id_fk" FOREIGN KEY ("generated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_instance_tasks" ADD CONSTRAINT "execution_instance_tasks_execution_instance_id_execution_instances_id_fk" FOREIGN KEY ("execution_instance_id") REFERENCES "public"."execution_instances"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_instance_tasks" ADD CONSTRAINT "execution_instance_tasks_plan_task_id_execution_plan_tasks_id_fk" FOREIGN KEY ("plan_task_id") REFERENCES "public"."execution_plan_tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_instance_tasks" ADD CONSTRAINT "execution_instance_tasks_assigned_user_id_users_id_fk" FOREIGN KEY ("assigned_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_instance_tasks" ADD CONSTRAINT "execution_instance_tasks_assigned_role_id_roles_id_fk" FOREIGN KEY ("assigned_role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_instances" ADD CONSTRAINT "execution_instances_execution_plan_id_scenario_execution_plans_id_fk" FOREIGN KEY ("execution_plan_id") REFERENCES "public"."scenario_execution_plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_instances" ADD CONSTRAINT "execution_instances_scenario_id_strategic_scenarios_id_fk" FOREIGN KEY ("scenario_id") REFERENCES "public"."strategic_scenarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_instances" ADD CONSTRAINT "execution_instances_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_instances" ADD CONSTRAINT "execution_instances_triggered_by_users_id_fk" FOREIGN KEY ("triggered_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_learnings" ADD CONSTRAINT "execution_learnings_execution_instance_id_execution_instances_id_fk" FOREIGN KEY ("execution_instance_id") REFERENCES "public"."execution_instances"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_learnings" ADD CONSTRAINT "execution_learnings_playbook_id_playbook_library_id_fk" FOREIGN KEY ("playbook_id") REFERENCES "public"."playbook_library"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_learnings" ADD CONSTRAINT "execution_learnings_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_learnings" ADD CONSTRAINT "execution_learnings_learn_item_id_playbook_learn_items_id_fk" FOREIGN KEY ("learn_item_id") REFERENCES "public"."playbook_learn_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_learnings" ADD CONSTRAINT "execution_learnings_captured_by_users_id_fk" FOREIGN KEY ("captured_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_learnings" ADD CONSTRAINT "execution_learnings_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_plan_export_templates" ADD CONSTRAINT "execution_plan_export_templates_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_plan_export_templates" ADD CONSTRAINT "execution_plan_export_templates_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_plan_phases" ADD CONSTRAINT "execution_plan_phases_execution_plan_id_scenario_execution_plans_id_fk" FOREIGN KEY ("execution_plan_id") REFERENCES "public"."scenario_execution_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_plan_sync_records" ADD CONSTRAINT "execution_plan_sync_records_execution_instance_id_execution_instances_id_fk" FOREIGN KEY ("execution_instance_id") REFERENCES "public"."execution_instances"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_plan_sync_records" ADD CONSTRAINT "execution_plan_sync_records_export_template_id_execution_plan_export_templates_id_fk" FOREIGN KEY ("export_template_id") REFERENCES "public"."execution_plan_export_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_plan_sync_records" ADD CONSTRAINT "execution_plan_sync_records_integration_id_enterprise_integrations_id_fk" FOREIGN KEY ("integration_id") REFERENCES "public"."enterprise_integrations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_plan_tasks" ADD CONSTRAINT "execution_plan_tasks_phase_id_execution_plan_phases_id_fk" FOREIGN KEY ("phase_id") REFERENCES "public"."execution_plan_phases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_plan_tasks" ADD CONSTRAINT "execution_plan_tasks_execution_plan_id_scenario_execution_plans_id_fk" FOREIGN KEY ("execution_plan_id") REFERENCES "public"."scenario_execution_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_plan_tasks" ADD CONSTRAINT "execution_plan_tasks_required_role_id_roles_id_fk" FOREIGN KEY ("required_role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_plan_tasks" ADD CONSTRAINT "execution_plan_tasks_assigned_user_id_users_id_fk" FOREIGN KEY ("assigned_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_plan_tasks_extended" ADD CONSTRAINT "execution_plan_tasks_extended_task_id_execution_plan_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."execution_plan_tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_pre_approved_resources" ADD CONSTRAINT "execution_pre_approved_resources_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_pre_approved_resources" ADD CONSTRAINT "execution_pre_approved_resources_playbook_id_strategic_scenarios_id_fk" FOREIGN KEY ("playbook_id") REFERENCES "public"."strategic_scenarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_pre_approved_resources" ADD CONSTRAINT "execution_pre_approved_resources_task_id_execution_plan_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."execution_plan_tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_pre_approved_resources" ADD CONSTRAINT "execution_pre_approved_resources_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_task_dependencies" ADD CONSTRAINT "execution_task_dependencies_task_id_execution_plan_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."execution_plan_tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_task_dependencies" ADD CONSTRAINT "execution_task_dependencies_depends_on_task_id_execution_plan_tasks_id_fk" FOREIGN KEY ("depends_on_task_id") REFERENCES "public"."execution_plan_tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "external_project_syncs" ADD CONSTRAINT "external_project_syncs_execution_instance_id_execution_instances_id_fk" FOREIGN KEY ("execution_instance_id") REFERENCES "public"."execution_instances"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "external_project_syncs" ADD CONSTRAINT "external_project_syncs_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generated_documents" ADD CONSTRAINT "generated_documents_execution_instance_id_execution_instances_id_fk" FOREIGN KEY ("execution_instance_id") REFERENCES "public"."execution_instances"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generated_documents" ADD CONSTRAINT "generated_documents_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mck_change_readiness_checks" ADD CONSTRAINT "mck_change_readiness_checks_roadmap_id_mck_transformation_roadmaps_id_fk" FOREIGN KEY ("roadmap_id") REFERENCES "public"."mck_transformation_roadmaps"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mck_executive_buyin_snapshots" ADD CONSTRAINT "mck_executive_buyin_snapshots_roadmap_id_mck_transformation_roadmaps_id_fk" FOREIGN KEY ("roadmap_id") REFERENCES "public"."mck_transformation_roadmaps"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mck_operating_model_scores" ADD CONSTRAINT "mck_operating_model_scores_assessment_id_mck_operating_model_assessments_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."mck_operating_model_assessments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mck_sustainable_practice_audits" ADD CONSTRAINT "mck_sustainable_practice_audits_roadmap_id_mck_transformation_roadmaps_id_fk" FOREIGN KEY ("roadmap_id") REFERENCES "public"."mck_transformation_roadmaps"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mck_sustainable_practice_items" ADD CONSTRAINT "mck_sustainable_practice_items_audit_id_mck_sustainable_practice_audits_id_fk" FOREIGN KEY ("audit_id") REFERENCES "public"."mck_sustainable_practice_audits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mck_transformation_workstreams" ADD CONSTRAINT "mck_transformation_workstreams_roadmap_id_mck_transformation_roadmaps_id_fk" FOREIGN KEY ("roadmap_id") REFERENCES "public"."mck_transformation_roadmaps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mck_value_realization_metrics" ADD CONSTRAINT "mck_value_realization_metrics_roadmap_id_mck_transformation_roadmaps_id_fk" FOREIGN KEY ("roadmap_id") REFERENCES "public"."mck_transformation_roadmaps"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mck_value_realization_metrics" ADD CONSTRAINT "mck_value_realization_metrics_execution_instance_id_execution_instances_id_fk" FOREIGN KEY ("execution_instance_id") REFERENCES "public"."execution_instances"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "oracle_patterns" ADD CONSTRAINT "oracle_patterns_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "oracle_patterns" ADD CONSTRAINT "oracle_patterns_actioned_by_users_id_fk" FOREIGN KEY ("actioned_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_onboarding" ADD CONSTRAINT "organization_onboarding_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbook_activations" ADD CONSTRAINT "playbook_activations_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbook_activations" ADD CONSTRAINT "playbook_activations_playbook_id_playbook_library_id_fk" FOREIGN KEY ("playbook_id") REFERENCES "public"."playbook_library"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbook_activations" ADD CONSTRAINT "playbook_activations_execution_instance_id_execution_instances_id_fk" FOREIGN KEY ("execution_instance_id") REFERENCES "public"."execution_instances"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbook_activations" ADD CONSTRAINT "playbook_activations_activated_by_users_id_fk" FOREIGN KEY ("activated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbook_categories" ADD CONSTRAINT "playbook_categories_domain_id_playbook_domains_id_fk" FOREIGN KEY ("domain_id") REFERENCES "public"."playbook_domains"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbook_communication_templates" ADD CONSTRAINT "playbook_communication_templates_playbook_id_playbook_library_id_fk" FOREIGN KEY ("playbook_id") REFERENCES "public"."playbook_library"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbook_customizations" ADD CONSTRAINT "playbook_customizations_playbook_id_playbook_library_id_fk" FOREIGN KEY ("playbook_id") REFERENCES "public"."playbook_library"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbook_customizations" ADD CONSTRAINT "playbook_customizations_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbook_customizations" ADD CONSTRAINT "playbook_customizations_last_customized_by_users_id_fk" FOREIGN KEY ("last_customized_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbook_decision_trees" ADD CONSTRAINT "playbook_decision_trees_playbook_id_playbook_library_id_fk" FOREIGN KEY ("playbook_id") REFERENCES "public"."playbook_library"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbook_learn_items" ADD CONSTRAINT "playbook_learn_items_playbook_id_playbook_library_id_fk" FOREIGN KEY ("playbook_id") REFERENCES "public"."playbook_library"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbook_learn_items" ADD CONSTRAINT "playbook_learn_items_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbook_learn_items" ADD CONSTRAINT "playbook_learn_items_responsible_user_id_users_id_fk" FOREIGN KEY ("responsible_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbook_learnings" ADD CONSTRAINT "playbook_learnings_scenario_id_strategic_scenarios_id_fk" FOREIGN KEY ("scenario_id") REFERENCES "public"."strategic_scenarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbook_learnings" ADD CONSTRAINT "playbook_learnings_execution_instance_id_execution_instances_id_fk" FOREIGN KEY ("execution_instance_id") REFERENCES "public"."execution_instances"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbook_library" ADD CONSTRAINT "playbook_library_domain_id_playbook_domains_id_fk" FOREIGN KEY ("domain_id") REFERENCES "public"."playbook_domains"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbook_library" ADD CONSTRAINT "playbook_library_category_id_playbook_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."playbook_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbook_monitor_items" ADD CONSTRAINT "playbook_monitor_items_playbook_id_playbook_library_id_fk" FOREIGN KEY ("playbook_id") REFERENCES "public"."playbook_library"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbook_monitor_items" ADD CONSTRAINT "playbook_monitor_items_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbook_prepare_items" ADD CONSTRAINT "playbook_prepare_items_playbook_id_playbook_library_id_fk" FOREIGN KEY ("playbook_id") REFERENCES "public"."playbook_library"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbook_prepare_items" ADD CONSTRAINT "playbook_prepare_items_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbook_prepare_items" ADD CONSTRAINT "playbook_prepare_items_responsible_user_id_users_id_fk" FOREIGN KEY ("responsible_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbook_prepare_items" ADD CONSTRAINT "playbook_prepare_items_completed_by_users_id_fk" FOREIGN KEY ("completed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbook_prepare_verification_history" ADD CONSTRAINT "playbook_prepare_verification_history_prepare_item_id_playbook_prepare_items_id_fk" FOREIGN KEY ("prepare_item_id") REFERENCES "public"."playbook_prepare_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbook_prepare_verification_history" ADD CONSTRAINT "playbook_prepare_verification_history_verified_by_users_id_fk" FOREIGN KEY ("verified_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbook_readiness_scores" ADD CONSTRAINT "playbook_readiness_scores_playbook_id_playbook_library_id_fk" FOREIGN KEY ("playbook_id") REFERENCES "public"."playbook_library"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbook_readiness_scores" ADD CONSTRAINT "playbook_readiness_scores_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbook_task_sequences" ADD CONSTRAINT "playbook_task_sequences_playbook_id_playbook_library_id_fk" FOREIGN KEY ("playbook_id") REFERENCES "public"."playbook_library"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbook_template_sections" ADD CONSTRAINT "playbook_template_sections_template_id_playbook_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."playbook_templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbook_versions" ADD CONSTRAINT "playbook_versions_scenario_id_strategic_scenarios_id_fk" FOREIGN KEY ("scenario_id") REFERENCES "public"."strategic_scenarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbook_versions" ADD CONSTRAINT "playbook_versions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbooks" ADD CONSTRAINT "playbooks_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbooks" ADD CONSTRAINT "playbooks_template_id_playbook_library_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."playbook_library"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbooks" ADD CONSTRAINT "playbooks_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practice_drills" ADD CONSTRAINT "practice_drills_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practice_drills" ADD CONSTRAINT "practice_drills_playbook_id_playbook_library_id_fk" FOREIGN KEY ("playbook_id") REFERENCES "public"."playbook_library"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practice_drills" ADD CONSTRAINT "practice_drills_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "preflight_check_results" ADD CONSTRAINT "preflight_check_results_execution_plan_id_scenario_execution_plans_id_fk" FOREIGN KEY ("execution_plan_id") REFERENCES "public"."scenario_execution_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "preflight_check_results" ADD CONSTRAINT "preflight_check_results_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "preflight_check_results" ADD CONSTRAINT "preflight_check_results_checked_by_users_id_fk" FOREIGN KEY ("checked_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "readiness_metrics" ADD CONSTRAINT "readiness_metrics_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roi_snapshots" ADD CONSTRAINT "roi_snapshots_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scenario_execution_plans" ADD CONSTRAINT "scenario_execution_plans_scenario_id_strategic_scenarios_id_fk" FOREIGN KEY ("scenario_id") REFERENCES "public"."strategic_scenarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scenario_execution_plans" ADD CONSTRAINT "scenario_execution_plans_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scenario_execution_plans" ADD CONSTRAINT "scenario_execution_plans_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "signal_monitoring_config" ADD CONSTRAINT "signal_monitoring_config_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulation_analyses" ADD CONSTRAINT "simulation_analyses_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stakeholder_acknowledgments" ADD CONSTRAINT "stakeholder_acknowledgments_execution_instance_id_execution_instances_id_fk" FOREIGN KEY ("execution_instance_id") REFERENCES "public"."execution_instances"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stakeholder_acknowledgments" ADD CONSTRAINT "stakeholder_acknowledgments_stakeholder_id_scenario_stakeholders_id_fk" FOREIGN KEY ("stakeholder_id") REFERENCES "public"."scenario_stakeholders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stakeholder_acknowledgments" ADD CONSTRAINT "stakeholder_acknowledgments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stakeholder_acknowledgments" ADD CONSTRAINT "stakeholder_acknowledgments_delegated_to_users_id_fk" FOREIGN KEY ("delegated_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stakeholder_roles" ADD CONSTRAINT "stakeholder_roles_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "strategic_objectives" ADD CONSTRAINT "strategic_objectives_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "strategic_objectives" ADD CONSTRAINT "strategic_objectives_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "strategic_recordings" ADD CONSTRAINT "strategic_recordings_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "success_metrics_config" ADD CONSTRAINT "success_metrics_config_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_acknowledgments" ADD CONSTRAINT "task_acknowledgments_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_document_templates" ADD CONSTRAINT "task_document_templates_plan_task_id_execution_plan_tasks_id_fk" FOREIGN KEY ("plan_task_id") REFERENCES "public"."execution_plan_tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_document_templates" ADD CONSTRAINT "task_document_templates_document_template_id_document_templates_id_fk" FOREIGN KEY ("document_template_id") REFERENCES "public"."document_templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weak_signals" ADD CONSTRAINT "weak_signals_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weak_signals" ADD CONSTRAINT "weak_signals_acknowledged_by_users_id_fk" FOREIGN KEY ("acknowledged_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "what_if_runs" ADD CONSTRAINT "what_if_runs_incident_analysis_id_incident_analyses_id_fk" FOREIGN KEY ("incident_analysis_id") REFERENCES "public"."incident_analyses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "activation_events_instance_idx" ON "activation_events" USING btree ("execution_instance_id");--> statement-breakpoint
CREATE INDEX "activation_events_org_idx" ON "activation_events" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "active_decisions_org_idx" ON "active_decisions" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "active_decisions_status_idx" ON "active_decisions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "active_decisions_phase_idx" ON "active_decisions" USING btree ("current_phase");--> statement-breakpoint
CREATE INDEX "activity_feed_org_idx" ON "activity_feed_events" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "activity_feed_created_idx" ON "activity_feed_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "activity_feed_type_idx" ON "activity_feed_events" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "budget_unlocks_instance_idx" ON "budget_unlocks" USING btree ("execution_instance_id");--> statement-breakpoint
CREATE INDEX "budget_unlocks_org_idx" ON "budget_unlocks" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "communication_channels_org_idx" ON "communication_channels" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "communication_channels_type_idx" ON "communication_channels" USING btree ("channel_type");--> statement-breakpoint
CREATE INDEX "continuous_ops_org_idx" ON "continuous_operations_tasks" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "continuous_ops_next_run_idx" ON "continuous_operations_tasks" USING btree ("next_run_at");--> statement-breakpoint
CREATE INDEX "continuous_ops_status_idx" ON "continuous_operations_tasks" USING btree ("status");--> statement-breakpoint
CREATE INDEX "custom_triggers_org_idx" ON "custom_triggers" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "custom_triggers_category_idx" ON "custom_triggers" USING btree ("category");--> statement-breakpoint
CREATE INDEX "custom_triggers_severity_idx" ON "custom_triggers" USING btree ("severity");--> statement-breakpoint
CREATE INDEX "custom_triggers_active_idx" ON "custom_triggers" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "decision_log_org_idx" ON "decision_log" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "decision_log_timestamp_idx" ON "decision_log" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "decision_trees_org_idx" ON "decision_trees" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "decision_trees_domain_idx" ON "decision_trees" USING btree ("domain");--> statement-breakpoint
CREATE INDEX "departments_org_idx" ON "departments" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "departments_parent_idx" ON "departments" USING btree ("parent_department_id");--> statement-breakpoint
CREATE INDEX "escalation_policies_org_idx" ON "escalation_policies" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "doc_templates_org_idx" ON "execution_document_templates" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "doc_templates_playbook_idx" ON "execution_document_templates" USING btree ("playbook_id");--> statement-breakpoint
CREATE INDEX "doc_templates_type_idx" ON "execution_document_templates" USING btree ("document_type");--> statement-breakpoint
CREATE INDEX "generated_docs_template_idx" ON "execution_generated_documents" USING btree ("template_id");--> statement-breakpoint
CREATE INDEX "generated_docs_instance_idx" ON "execution_generated_documents" USING btree ("execution_instance_id");--> statement-breakpoint
CREATE INDEX "exec_learnings_instance_idx" ON "execution_learnings" USING btree ("execution_instance_id");--> statement-breakpoint
CREATE INDEX "exec_learnings_playbook_idx" ON "execution_learnings" USING btree ("playbook_id");--> statement-breakpoint
CREATE INDEX "exec_learnings_org_idx" ON "execution_learnings" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "export_templates_org_idx" ON "execution_plan_export_templates" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "export_templates_platform_idx" ON "execution_plan_export_templates" USING btree ("platform");--> statement-breakpoint
CREATE INDEX "sync_records_instance_idx" ON "execution_plan_sync_records" USING btree ("execution_instance_id");--> statement-breakpoint
CREATE INDEX "sync_records_status_idx" ON "execution_plan_sync_records" USING btree ("sync_status");--> statement-breakpoint
CREATE INDEX "pre_approved_resources_org_idx" ON "execution_pre_approved_resources" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "pre_approved_resources_playbook_idx" ON "execution_pre_approved_resources" USING btree ("playbook_id");--> statement-breakpoint
CREATE INDEX "pre_approved_resources_type_idx" ON "execution_pre_approved_resources" USING btree ("resource_type");--> statement-breakpoint
CREATE INDEX "ext_proj_sync_instance_idx" ON "external_project_syncs" USING btree ("execution_instance_id");--> statement-breakpoint
CREATE INDEX "ext_proj_sync_org_idx" ON "external_project_syncs" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "gen_docs_instance_idx" ON "generated_documents" USING btree ("execution_instance_id");--> statement-breakpoint
CREATE INDEX "gen_docs_org_idx" ON "generated_documents" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "mck_readiness_org_date_idx" ON "mck_change_readiness_checks" USING btree ("organization_id","check_date");--> statement-breakpoint
CREATE INDEX "mck_buyin_org_date_idx" ON "mck_executive_buyin_snapshots" USING btree ("organization_id","snapshot_date");--> statement-breakpoint
CREATE INDEX "mck_buyin_roadmap_idx" ON "mck_executive_buyin_snapshots" USING btree ("roadmap_id");--> statement-breakpoint
CREATE INDEX "mck_gap_org_element_idx" ON "mck_gap_targets" USING btree ("organization_id","element_key");--> statement-breakpoint
CREATE INDEX "mck_assessment_org_date_idx" ON "mck_operating_model_assessments" USING btree ("organization_id","assessment_date");--> statement-breakpoint
CREATE INDEX "mck_score_assessment_element_idx" ON "mck_operating_model_scores" USING btree ("assessment_id","element_key");--> statement-breakpoint
CREATE INDEX "mck_audit_org_date_idx" ON "mck_sustainable_practice_audits" USING btree ("organization_id","audit_date");--> statement-breakpoint
CREATE INDEX "mck_practice_audit_rule_idx" ON "mck_sustainable_practice_items" USING btree ("audit_id","rule_key");--> statement-breakpoint
CREATE INDEX "mck_roadmap_org_idx" ON "mck_transformation_roadmaps" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "mck_workstream_roadmap_idx" ON "mck_transformation_workstreams" USING btree ("roadmap_id");--> statement-breakpoint
CREATE INDEX "mck_value_org_date_idx" ON "mck_value_realization_metrics" USING btree ("organization_id","measurement_date");--> statement-breakpoint
CREATE INDEX "mck_value_execution_idx" ON "mck_value_realization_metrics" USING btree ("execution_instance_id");--> statement-breakpoint
CREATE INDEX "oracle_pattern_org_idx" ON "oracle_patterns" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "oracle_pattern_type_idx" ON "oracle_patterns" USING btree ("pattern_type");--> statement-breakpoint
CREATE INDEX "oracle_pattern_status_idx" ON "oracle_patterns" USING btree ("status");--> statement-breakpoint
CREATE INDEX "org_onboarding_org_idx" ON "organization_onboarding" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "learn_items_playbook_idx" ON "playbook_learn_items" USING btree ("playbook_id");--> statement-breakpoint
CREATE INDEX "learn_items_org_idx" ON "playbook_learn_items" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "playbook_learning_scenario_idx" ON "playbook_learnings" USING btree ("scenario_id");--> statement-breakpoint
CREATE INDEX "playbook_learning_execution_idx" ON "playbook_learnings" USING btree ("execution_instance_id");--> statement-breakpoint
CREATE INDEX "monitor_items_playbook_idx" ON "playbook_monitor_items" USING btree ("playbook_id");--> statement-breakpoint
CREATE INDEX "monitor_items_org_idx" ON "playbook_monitor_items" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "monitor_items_signal_type_idx" ON "playbook_monitor_items" USING btree ("signal_type");--> statement-breakpoint
CREATE INDEX "prepare_items_playbook_idx" ON "playbook_prepare_items" USING btree ("playbook_id");--> statement-breakpoint
CREATE INDEX "prepare_items_org_idx" ON "playbook_prepare_items" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "prepare_items_status_idx" ON "playbook_prepare_items" USING btree ("status");--> statement-breakpoint
CREATE INDEX "readiness_playbook_idx" ON "playbook_readiness_scores" USING btree ("playbook_id");--> statement-breakpoint
CREATE INDEX "readiness_org_idx" ON "playbook_readiness_scores" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "readiness_score_idx" ON "playbook_readiness_scores" USING btree ("overall_score");--> statement-breakpoint
CREATE INDEX "playbook_version_scenario_idx" ON "playbook_versions" USING btree ("scenario_id","version");--> statement-breakpoint
CREATE INDEX "playbooks_org_idx" ON "playbooks" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "playbooks_template_idx" ON "playbooks" USING btree ("template_id");--> statement-breakpoint
CREATE INDEX "playbooks_source_idx" ON "playbooks" USING btree ("source_type");--> statement-breakpoint
CREATE INDEX "playbooks_capability_idx" ON "playbooks" USING btree ("leadership_capability");--> statement-breakpoint
CREATE INDEX "readiness_org_date_idx" ON "readiness_metrics" USING btree ("organization_id","measurement_date");--> statement-breakpoint
CREATE INDEX "stakeholder_acks_instance_idx" ON "stakeholder_acknowledgments" USING btree ("execution_instance_id");--> statement-breakpoint
CREATE INDEX "stakeholder_roles_org_idx" ON "stakeholder_roles" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "strategic_objectives_org_idx" ON "strategic_objectives" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "strategic_objectives_capability_idx" ON "strategic_objectives" USING btree ("leadership_capability");--> statement-breakpoint
CREATE INDEX "success_metrics_org_idx" ON "success_metrics_config" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "success_metrics_type_idx" ON "success_metrics_config" USING btree ("metric_type");--> statement-breakpoint
CREATE INDEX "weak_signal_org_idx" ON "weak_signals" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "weak_signal_type_idx" ON "weak_signals" USING btree ("signal_type");--> statement-breakpoint
CREATE INDEX "weak_signal_status_idx" ON "weak_signals" USING btree ("status");