CREATE TYPE "public"."action_status" AS ENUM('pending', 'in_progress', 'completed', 'failed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."alert_type" AS ENUM('opportunity', 'risk', 'competitive_threat', 'market_shift', 'regulatory_change');--> statement-breakpoint
CREATE TYPE "public"."compliance_status" AS ENUM('compliant', 'non_compliant', 'under_review', 'exception_granted');--> statement-breakpoint
CREATE TYPE "public"."confidence" AS ENUM('low', 'medium', 'high', 'very_high');--> statement-breakpoint
CREATE TYPE "public"."deployment_status" AS ENUM('planning', 'in_progress', 'completed', 'failed', 'rollback');--> statement-breakpoint
CREATE TYPE "public"."effectiveness" AS ENUM('low', 'moderate', 'high', 'excellent');--> statement-breakpoint
CREATE TYPE "public"."influence_level" AS ENUM('low', 'medium', 'high', 'critical');--> statement-breakpoint
CREATE TYPE "public"."insight_type" AS ENUM('synthetic_scenario', 'trend_analysis', 'risk_prediction', 'opportunity_forecast');--> statement-breakpoint
CREATE TYPE "public"."integration_status" AS ENUM('active', 'inactive', 'error', 'pending');--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('pending', 'processing', 'completed', 'failed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."metric_category" AS ENUM('leading', 'lagging', 'efficiency', 'quality', 'risk');--> statement-breakpoint
CREATE TYPE "public"."organization_type" AS ENUM('enterprise', 'mid-market', 'startup', 'government', 'non-profit');--> statement-breakpoint
CREATE TYPE "public"."outcome_type" AS ENUM('successful', 'partially_successful', 'failed', 'cancelled', 'ongoing');--> statement-breakpoint
CREATE TYPE "public"."priority" AS ENUM('low', 'medium', 'high', 'critical');--> statement-breakpoint
CREATE TYPE "public"."risk_level" AS ENUM('minimal', 'low', 'moderate', 'high', 'severe');--> statement-breakpoint
CREATE TYPE "public"."scenario_type" AS ENUM('growth', 'protection', 'transformation', 'operational', 'strategic');--> statement-breakpoint
CREATE TYPE "public"."simulation_status" AS ENUM('draft', 'scheduled', 'running', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."stakeholder_role" AS ENUM('sponsor', 'owner', 'contributor', 'informed', 'approver');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('draft', 'active', 'paused', 'completed', 'archived');--> statement-breakpoint
CREATE TYPE "public"."time_horizon" AS ENUM('immediate', 'short_term', 'medium_term', 'long_term');--> statement-breakpoint
CREATE TABLE "action_hooks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"trigger_event" varchar(100) NOT NULL,
	"target_system" varchar(100) NOT NULL,
	"action_type" varchar(100) NOT NULL,
	"configuration" jsonb NOT NULL,
	"mapping_rules" jsonb,
	"status" "action_status" DEFAULT 'pending',
	"last_triggered" timestamp,
	"success_count" integer DEFAULT 0,
	"failure_count" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_by" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "action_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"recommendation_id" uuid,
	"initiative_id" uuid,
	"scenario_id" uuid,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"priority" "priority" DEFAULT 'medium',
	"status" "action_status" DEFAULT 'pending',
	"assigned_to" varchar NOT NULL,
	"assigned_by" varchar,
	"due_date" timestamp,
	"completed_at" timestamp,
	"estimated_effort" integer,
	"actual_effort" integer,
	"dependencies" jsonb,
	"approvals" jsonb,
	"outcome" text,
	"tags" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"action" varchar(255) NOT NULL,
	"entity_type" varchar(50),
	"entity_id" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_confidence_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"entity_type" varchar(100) NOT NULL,
	"entity_id" uuid NOT NULL,
	"ai_model" varchar(100),
	"confidence_score" numeric(3, 2),
	"factors_analyzed" jsonb,
	"data_quality_score" numeric(3, 2),
	"bias_detection_results" jsonb,
	"uncertainty_factors" jsonb,
	"validation_status" varchar(50) DEFAULT 'pending',
	"human_feedback" jsonb,
	"validated_by" varchar,
	"validated_at" timestamp,
	"accuracy_tracking" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "background_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"queue_name" varchar(100) NOT NULL,
	"job_type" varchar(100) NOT NULL,
	"data" jsonb NOT NULL,
	"priority" integer DEFAULT 0,
	"status" "job_status" DEFAULT 'pending',
	"max_retries" integer DEFAULT 3,
	"attempts" integer DEFAULT 0,
	"error" text,
	"result" jsonb,
	"run_at" timestamp DEFAULT now(),
	"started_at" timestamp,
	"completed_at" timestamp,
	"failed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "board_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"report_type" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"reporting_period" varchar(100) NOT NULL,
	"executive_summary" text NOT NULL,
	"key_metrics" jsonb,
	"strategic_initiatives" jsonb,
	"risk_management" text,
	"opportunity_pipeline" text,
	"organizational_health" text,
	"market_position" text,
	"financial_highlights" text,
	"operational_excellence" text,
	"stakeholder_value" text,
	"future_outlook" text,
	"board_recommendations" jsonb,
	"appendices" jsonb,
	"generated_by" varchar NOT NULL,
	"approved_by" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"approved_at" timestamp,
	"presented_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "business_units" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"parent_unit_id" uuid,
	"leader_id" varchar,
	"business_function" varchar(100),
	"budget" numeric(12, 2),
	"headcount" integer,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "compliance_frameworks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"category" varchar(100),
	"version" varchar(50),
	"requirements" jsonb,
	"controls" jsonb,
	"assessment_criteria" jsonb,
	"reporting_schedule" varchar(100),
	"responsible_party" varchar,
	"status" "compliance_status" DEFAULT 'under_review',
	"last_assessment" timestamp,
	"next_assessment" timestamp,
	"risk_level" "risk_level" DEFAULT 'moderate',
	"documentation" jsonb,
	"audit_trail" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "compliance_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"framework_id" uuid NOT NULL,
	"report_type" varchar(100),
	"reporting_period" varchar(100),
	"overall_status" "compliance_status" DEFAULT 'compliant',
	"compliance_score" numeric(3, 2),
	"controls_assessed" integer,
	"controls_passed" integer,
	"controls_failed" integer,
	"exceptions" jsonb,
	"remediation" jsonb,
	"evidence" jsonb,
	"recommendations" jsonb,
	"risk_assessment" jsonb,
	"executive_summary" text,
	"detailed_findings" jsonb,
	"generated_by" varchar,
	"reviewed_by" varchar,
	"approved_by" varchar,
	"submitted_at" timestamp,
	"due_date" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "composite_trigger_logic" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trigger_id" uuid NOT NULL,
	"signal_ids" jsonb NOT NULL,
	"logic_operator" varchar(50) NOT NULL,
	"weighted_threshold" numeric(3, 2),
	"sequence_window" integer,
	"minimum_signals" integer DEFAULT 1,
	"evaluation_window" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "crisis_simulations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"scenario_type" varchar(100),
	"difficulty" varchar(50),
	"participants" jsonb,
	"facilitator" varchar,
	"objectives" jsonb,
	"scenario_data" jsonb,
	"duration" integer,
	"status" "simulation_status" DEFAULT 'draft',
	"start_time" timestamp,
	"end_time" timestamp,
	"current_phase" varchar(100),
	"events" jsonb,
	"decisions" jsonb,
	"outcomes" jsonb,
	"performance_metrics" jsonb,
	"lessons" jsonb,
	"feedback" jsonb,
	"created_by" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "data_sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"source_type" varchar(100) NOT NULL,
	"category" varchar(100),
	"description" text,
	"configuration" jsonb,
	"refresh_rate" integer,
	"last_refreshed_at" timestamp,
	"data_schema" jsonb,
	"is_active" boolean DEFAULT true,
	"created_by" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "decision_confidence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scenario_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"user_id" varchar NOT NULL,
	"overall_confidence" integer NOT NULL,
	"data_completeness" integer NOT NULL,
	"stakeholder_alignment" integer NOT NULL,
	"historical_precedent" integer,
	"risk_coverage" integer NOT NULL,
	"confidence_factors" jsonb NOT NULL,
	"missing_elements" jsonb,
	"recommendations" jsonb,
	"calculated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "decision_outcomes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"scenario_id" uuid,
	"project_id" uuid,
	"decision_type" varchar(100) NOT NULL,
	"decision_description" text NOT NULL,
	"decision_maker" varchar,
	"decision_context" jsonb,
	"chosen_option" jsonb,
	"alternative_options" jsonb,
	"implementation_start" timestamp,
	"implementation_end" timestamp,
	"actual_outcome" "outcome_type",
	"effectiveness" "effectiveness",
	"success_metrics" jsonb,
	"actual_results" jsonb,
	"lessons_learned" jsonb,
	"unexpected_consequences" jsonb,
	"stakeholder_feedback" jsonb,
	"organization_state" jsonb,
	"external_factors" jsonb,
	"resources_used" jsonb,
	"time_to_implement" integer,
	"cost_of_implementation" numeric(12, 2),
	"reviewed_at" timestamp,
	"reviewed_by" varchar,
	"confidence" "confidence" DEFAULT 'medium',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "deployment_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"template_id" uuid,
	"current_step" integer DEFAULT 0,
	"total_steps" integer NOT NULL,
	"status" "deployment_status" DEFAULT 'planning',
	"steps_completed" jsonb,
	"step_data" jsonb,
	"started_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	"estimated_completion" timestamp,
	"blockers" jsonb,
	"assigned_to" varchar,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "echo_cultural_metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid,
	"dimension" varchar(100) NOT NULL,
	"score" numeric(5, 2),
	"trend" varchar(20),
	"factors" jsonb,
	"recommendations" jsonb,
	"assessment_date" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "engagement_metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"user_id" varchar NOT NULL,
	"period" varchar(20),
	"period_start" timestamp NOT NULL,
	"period_end" timestamp NOT NULL,
	"sessions_count" integer DEFAULT 0,
	"total_duration" integer DEFAULT 0,
	"features_used" jsonb,
	"decisions_influenced" integer DEFAULT 0,
	"value_generated" numeric(15, 2) DEFAULT '0',
	"engagement_score" numeric(3, 2),
	"risk_events" integer DEFAULT 0,
	"strategic_actions" integer DEFAULT 0,
	"collaboration_events" integer DEFAULT 0,
	"calculated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "enterprise_integrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"integration_type" varchar(100),
	"vendor" varchar(100),
	"status" "integration_status" DEFAULT 'pending',
	"configuration" jsonb,
	"data_mapping" jsonb,
	"sync_frequency" varchar(50),
	"last_sync_at" timestamp,
	"next_sync_at" timestamp,
	"error_log" jsonb,
	"api_endpoint" varchar(500),
	"webhook_url" varchar(500),
	"authentication_type" varchar(100),
	"metadata" jsonb,
	"installed_by" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "evidence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"type" varchar(100),
	"source" varchar(255),
	"url" varchar(500),
	"content" jsonb,
	"metadata" jsonb,
	"quality" varchar(50) DEFAULT 'medium',
	"reliability" varchar(50) DEFAULT 'medium',
	"created_by" varchar,
	"tags" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "execution_validation_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scenario_id" uuid NOT NULL,
	"execution_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"executed_by" varchar NOT NULL,
	"execution_date" timestamp NOT NULL,
	"validation_date" timestamp DEFAULT now(),
	"predicted_execution_time" integer,
	"actual_execution_time" integer,
	"time_savings_realized" integer,
	"predicted_outcomes" jsonb NOT NULL,
	"actual_outcomes" jsonb NOT NULL,
	"outcome_accuracy" numeric(3, 2),
	"predicted_cost" numeric(12, 2),
	"actual_cost" numeric(12, 2),
	"predicted_risks" jsonb,
	"actual_risks" jsonb,
	"risk_prediction_accuracy" numeric(3, 2),
	"overall_success_rating" integer NOT NULL,
	"kpi_targets_hit" integer,
	"kpi_targets_total" integer,
	"what_worked" jsonb,
	"what_failed" jsonb,
	"unexpected_challenges" jsonb,
	"playbook_improvements" jsonb,
	"institutional_learnings" text,
	"estimated_roi" numeric(12, 2),
	"time_saved_hours" numeric(8, 2),
	"cost_saved_usd" numeric(12, 2),
	"stakeholder_feedback" jsonb,
	"executive_summary" text,
	"recommend_for_future_use" boolean DEFAULT true,
	"confidence_adjustment" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "executive_briefings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"executive_id" varchar NOT NULL,
	"briefing_type" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"executive_summary" text NOT NULL,
	"key_insights" jsonb,
	"critical_decisions" jsonb,
	"risk_assessment" text,
	"opportunity_highlights" text,
	"stakeholder_impact" text,
	"recommended_actions" jsonb,
	"time_to_decision" varchar(50),
	"confidence_level" integer DEFAULT 85,
	"data_source" jsonb,
	"generated_by" varchar DEFAULT 'ai-radar',
	"reviewed" boolean DEFAULT false,
	"executive_notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"scheduled_for" timestamp,
	"acknowledged_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "executive_insights" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"insight_type" "insight_type" NOT NULL,
	"title" varchar(255) NOT NULL,
	"summary" text NOT NULL,
	"detailed_analysis" text,
	"key_findings" jsonb,
	"confidence_score" numeric(3, 2),
	"data_points" jsonb,
	"implications" jsonb,
	"recommended_actions" jsonb,
	"time_horizon" varchar(50),
	"related_scenarios" jsonb,
	"board_ready" boolean DEFAULT false,
	"viewed_by" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "executive_triggers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(100),
	"trigger_type" varchar(100) NOT NULL,
	"data_source_id" uuid,
	"conditions" jsonb NOT NULL,
	"severity" "priority" DEFAULT 'medium',
	"alert_threshold" varchar(50),
	"current_status" varchar(50) DEFAULT 'green',
	"status_message" text,
	"recommended_playbooks" jsonb,
	"notification_settings" jsonb,
	"is_active" boolean DEFAULT true,
	"last_triggered_at" timestamp,
	"trigger_count" integer DEFAULT 0,
	"created_by" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "flux_adaptations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid,
	"scenario_id" uuid,
	"adaptation_type" varchar(100) NOT NULL,
	"description" text,
	"implementation" jsonb,
	"effectiveness" numeric(5, 2),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "human_validation_queue" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"entity_type" varchar(100) NOT NULL,
	"entity_id" uuid NOT NULL,
	"priority" "priority" DEFAULT 'medium',
	"validation_type" varchar(100),
	"assigned_to" varchar,
	"required_expertise" jsonb,
	"ai_summary" text,
	"validation_prompt" text,
	"deadline" timestamp,
	"status" "action_status" DEFAULT 'pending',
	"completed_at" timestamp,
	"result" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "industry_benchmarks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"industry" varchar(100) NOT NULL,
	"organization_size" varchar(50) NOT NULL,
	"metric_name" varchar(255) NOT NULL,
	"percentile_25" numeric(15, 2),
	"percentile_50" numeric(15, 2),
	"percentile_75" numeric(15, 2),
	"percentile_90" numeric(15, 2),
	"sample_size" integer,
	"last_updated" timestamp DEFAULT now(),
	"data_source" varchar(255),
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "initiatives" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"scenario_id" uuid,
	"business_unit_id" uuid,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"objective" text,
	"priority" "priority" DEFAULT 'medium',
	"status" varchar(50) DEFAULT 'draft',
	"sponsor" varchar,
	"owner" varchar NOT NULL,
	"budget" numeric(12, 2),
	"timeline" jsonb,
	"milestones" jsonb,
	"dependencies" jsonb,
	"outcomes" jsonb,
	"tags" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "insights" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"scenario_id" uuid,
	"initiative_id" uuid,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"type" "insight_type" NOT NULL,
	"confidence" "confidence" DEFAULT 'medium',
	"module" varchar(50),
	"evidence_ids" jsonb,
	"tags" jsonb,
	"impact" varchar(50),
	"urgency" varchar(50),
	"stakeholders" jsonb,
	"is_valid" boolean DEFAULT true,
	"validated_by" varchar,
	"validated_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "institutional_memory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"memory_type" varchar(100) NOT NULL,
	"domain" varchar(100),
	"title" varchar(255) NOT NULL,
	"summary" text NOT NULL,
	"detailed_knowledge" jsonb,
	"trigger_conditions" jsonb,
	"contraindications" jsonb,
	"source_decisions" jsonb,
	"source_scenarios" jsonb,
	"source_experts" jsonb,
	"access_level" varchar(50) DEFAULT 'organization',
	"last_accessed" timestamp,
	"access_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "integration_data" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"integration_id" uuid NOT NULL,
	"data_type" varchar(100),
	"source_id" varchar(255),
	"mapped_entity_id" uuid,
	"raw_data" jsonb,
	"transformed_data" jsonb,
	"synced_at" timestamp DEFAULT now(),
	"processing_status" varchar(50) DEFAULT 'pending',
	"processing_errors" jsonb
);
--> statement-breakpoint
CREATE TABLE "intelligence_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid,
	"report_type" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"executive_summary" text,
	"findings" jsonb,
	"recommendations" jsonb,
	"confidence" numeric(5, 2),
	"generated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "intuition_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"executive_id" varchar NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"confidence_level" "confidence" DEFAULT 'medium',
	"timeframe" varchar(100),
	"related_domain" varchar(100),
	"ai_validation_status" varchar(50) DEFAULT 'pending',
	"ai_findings" text,
	"supporting_data" jsonb,
	"contradicting_data" jsonb,
	"validation_score" numeric(3, 2),
	"outcome" varchar(100),
	"follow_up_actions" jsonb,
	"is_validated" boolean,
	"validated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "kpis" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"business_unit_id" uuid,
	"initiative_id" uuid,
	"name" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(100),
	"unit" varchar(50),
	"target" numeric(15, 4),
	"threshold" numeric(15, 4),
	"current_value" numeric(15, 4),
	"owner" varchar,
	"data_source" varchar(255),
	"frequency" varchar(50),
	"is_active" boolean DEFAULT true,
	"tags" jsonb,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "learning_patterns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"pattern_type" varchar(100) NOT NULL,
	"category" varchar(100),
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"conditions" jsonb,
	"actions" jsonb,
	"outcomes" jsonb,
	"frequency" integer,
	"success_rate" numeric(3, 2),
	"average_impact" numeric(5, 2),
	"confidence_level" numeric(3, 2),
	"supporting_decisions" jsonb,
	"related_scenarios" jsonb,
	"key_factors" jsonb,
	"recommendations" jsonb,
	"discovered_at" timestamp DEFAULT now(),
	"last_validated" timestamp,
	"next_review_date" timestamp,
	"status" varchar(20) DEFAULT 'active'
);
--> statement-breakpoint
CREATE TABLE "module_usage_analytics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid,
	"module_name" varchar(100) NOT NULL,
	"action" varchar(100) NOT NULL,
	"timestamp" timestamp DEFAULT now(),
	"metadata" jsonb,
	"user_id" varchar
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"user_id" varchar NOT NULL,
	"type" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"priority" "priority" DEFAULT 'medium',
	"entity_type" varchar(50),
	"entity_id" uuid,
	"is_read" boolean DEFAULT false,
	"read_at" timestamp,
	"scheduled_for" timestamp,
	"sent_at" timestamp,
	"channels" jsonb,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "nova_innovations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid,
	"title" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(100),
	"stage" varchar(50),
	"potential" varchar(20),
	"resources" jsonb,
	"timeline" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"owner_id" varchar NOT NULL,
	"domain" varchar(100),
	"type" "organization_type" DEFAULT 'enterprise',
	"size" integer,
	"industry" varchar(100),
	"headquarters" varchar(255),
	"adaptability_score" varchar DEFAULT 'stable',
	"onboarding_completed" boolean DEFAULT false,
	"subscription_tier" varchar DEFAULT 'basic',
	"status" varchar(50) DEFAULT 'Active',
	"settings" jsonb,
	"taxonomy" jsonb,
	"data_retention_policy" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "outcome_execution_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scenario_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"trigger_id" uuid,
	"activated_at" timestamp DEFAULT now() NOT NULL,
	"stakeholders_notified_at" timestamp,
	"execution_started_at" timestamp,
	"execution_completed_at" timestamp,
	"activated_by" varchar NOT NULL,
	"decision_makers" jsonb,
	"approval_chain" jsonb,
	"execution_mode" varchar(50),
	"tasks_planned" integer,
	"tasks_completed" integer,
	"tasks_failed" integer,
	"deviations_from_plan" jsonb,
	"time_to_stakeholder_coordination" integer,
	"time_to_first_action" integer,
	"total_execution_time" integer,
	"outcome_type" "outcome_type",
	"business_impact" jsonb,
	"value_realized" numeric(15, 2),
	"decisions_log" jsonb,
	"lessons_learned" jsonb,
	"stakeholder_feedback" jsonb,
	"improvement_opportunities" jsonb,
	"review_completed_at" timestamp,
	"reviewed_by" varchar,
	"overall_effectiveness" "effectiveness",
	"would_reuse" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "peer_benchmarks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"industry" varchar(100) NOT NULL,
	"executive_role" varchar(100) NOT NULL,
	"organization_size" varchar(50),
	"average_score" numeric(5, 2) NOT NULL,
	"median_score" numeric(5, 2),
	"top_quartile_score" numeric(5, 2),
	"bottom_quartile_score" numeric(5, 2),
	"sample_size" integer,
	"average_scenarios_completed" numeric(5, 2),
	"average_drills_completed" numeric(5, 2),
	"top_performing_actions" jsonb,
	"benchmark_period" varchar(50),
	"calculated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "peer_comparisons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"metric_name" varchar(255) NOT NULL,
	"organization_value" numeric(15, 2),
	"industry_percentile" integer,
	"peers_above" integer,
	"peers_below" integer,
	"improvement_opportunity" numeric(15, 2),
	"benchmark_date" timestamp DEFAULT now(),
	"recommendations" jsonb
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"resource" varchar(50) NOT NULL,
	"action" varchar(50) NOT NULL,
	"scope" varchar(50) DEFAULT 'organization',
	"description" text,
	"category" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "playbook_trigger_associations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trigger_id" uuid NOT NULL,
	"playbook_id" uuid NOT NULL,
	"auto_activate" boolean DEFAULT false,
	"activation_conditions" jsonb,
	"execution_priority" integer DEFAULT 1,
	"stakeholders_to_notify" jsonb,
	"execution_parameters" jsonb,
	"is_active" boolean DEFAULT true,
	"last_activated_at" timestamp,
	"activation_count" integer DEFAULT 0,
	"average_execution_time" integer,
	"success_rate" numeric(3, 2),
	"created_by" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "preparedness_activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"organization_id" uuid NOT NULL,
	"activity_type" varchar(100) NOT NULL,
	"activity_name" varchar(255) NOT NULL,
	"related_entity_id" uuid,
	"related_entity_type" varchar(100),
	"score_impact" integer,
	"metadata" jsonb,
	"completed_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "preparedness_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"organization_id" uuid NOT NULL,
	"score" integer NOT NULL,
	"previous_score" integer,
	"score_delta" integer,
	"scenarios_practiced" integer DEFAULT 0,
	"drills_completed" integer DEFAULT 0,
	"coverage_gaps" jsonb,
	"readiness_metrics" jsonb,
	"industry_benchmark" integer,
	"peer_percentile" integer,
	"executive_role" varchar(100),
	"calculated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "prism_insights" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid,
	"insight_type" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text,
	"confidence" numeric(5, 2),
	"sources" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"objective" text,
	"methodology" varchar(50),
	"priority" varchar(20) DEFAULT 'medium',
	"status" varchar(50) DEFAULT 'draft',
	"progress" numeric(3, 2) DEFAULT '0.00',
	"budget" numeric(12, 2),
	"actual_cost" numeric(12, 2) DEFAULT '0.00',
	"start_date" timestamp,
	"target_date" timestamp,
	"end_date" timestamp,
	"completed_date" timestamp,
	"risk_level" "risk_level" DEFAULT 'low',
	"team_size" integer,
	"lead_id" varchar,
	"stakeholders" jsonb,
	"metrics" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pulse_metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid,
	"metric_name" varchar(255) NOT NULL,
	"value" numeric(15, 4),
	"unit" varchar(50),
	"category" varchar(100),
	"timestamp" timestamp DEFAULT now(),
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "quick_start_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"category" varchar(100),
	"industry" varchar(100),
	"organization_size" varchar(50),
	"description" text,
	"template_data" jsonb,
	"requirements" jsonb,
	"estimated_setup_time" integer,
	"usage_count" integer DEFAULT 0,
	"success_rate" numeric(3, 2),
	"version" varchar(20) DEFAULT '1.0',
	"is_active" boolean DEFAULT true,
	"created_by" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "recommendations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"insight_id" uuid,
	"scenario_id" uuid,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"rationale" text,
	"priority" "priority" DEFAULT 'medium',
	"effort" varchar(50),
	"timeframe" varchar(50),
	"expected_impact" text,
	"risk_level" "risk_level" DEFAULT 'low',
	"prerequisites" jsonb,
	"resources" jsonb,
	"assigned_to" varchar,
	"status" varchar(50) DEFAULT 'pending',
	"implementation_plan" jsonb,
	"tags" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "risks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"scenario_id" uuid,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"category" varchar(100),
	"severity" "risk_level" DEFAULT 'low',
	"probability" numeric(3, 2),
	"impact" numeric(10, 2),
	"risk_owner" varchar,
	"mitigation_strategy" jsonb,
	"contingency_plan" jsonb,
	"status" varchar(50) DEFAULT 'identified',
	"review_date" timestamp,
	"tags" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "roi_metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"metric_name" varchar(255) NOT NULL,
	"category" varchar(100),
	"baseline" numeric(15, 2),
	"current_value" numeric(15, 2),
	"target_value" numeric(15, 2),
	"unit" varchar(50),
	"calculation_method" text,
	"data_points" jsonb,
	"last_calculated" timestamp,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "role_permissions" (
	"role_id" uuid NOT NULL,
	"permission_id" uuid NOT NULL,
	CONSTRAINT "role_permissions_role_id_permission_id_pk" PRIMARY KEY("role_id","permission_id")
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid,
	"name" varchar(50) NOT NULL,
	"description" text,
	"category" varchar(50) DEFAULT 'custom',
	"level" integer DEFAULT 1,
	"is_system_role" boolean DEFAULT false,
	"capabilities" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "scenario_context" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scenario_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"mission" text,
	"scenario_type" "scenario_type" DEFAULT 'operational' NOT NULL,
	"time_horizon" time_horizon DEFAULT 'short_term' NOT NULL,
	"business_impact_category" varchar(100),
	"primary_business_unit" varchar(255),
	"impacted_processes" jsonb,
	"dependency_map" jsonb,
	"geographic_scope" jsonb,
	"regulatory_constraints" jsonb,
	"compliance_windows" jsonb,
	"narrative_context" text,
	"historical_references" jsonb,
	"external_vendors" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "scenario_context_scenario_id_unique" UNIQUE("scenario_id")
);
--> statement-breakpoint
CREATE TABLE "scenario_dependencies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scenario_id" uuid NOT NULL,
	"dependent_scenario_id" uuid NOT NULL,
	"dependency_type" varchar(50) NOT NULL,
	"description" text,
	"is_critical" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "scenario_stakeholders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scenario_id" uuid NOT NULL,
	"user_id" varchar,
	"external_name" varchar(255),
	"email" varchar(255),
	"title" varchar(255),
	"organization" varchar(255),
	"role" "stakeholder_role" NOT NULL,
	"influence_level" "influence_level" DEFAULT 'medium' NOT NULL,
	"decision_authority" boolean DEFAULT false,
	"is_executive_sponsor" boolean DEFAULT false,
	"is_accountable_owner" boolean DEFAULT false,
	"contact_method" varchar(50) DEFAULT 'email',
	"escalation_path" jsonb,
	"notification_preferences" jsonb,
	"approval_required" boolean DEFAULT false,
	"approval_order" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "scenario_success_metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scenario_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"category" "metric_category" NOT NULL,
	"data_source" varchar(255),
	"measurement_unit" varchar(50),
	"baseline_value" numeric(15, 2),
	"target_value" numeric(15, 2),
	"current_value" numeric(15, 2),
	"measurement_frequency" varchar(50),
	"threshold_green" numeric(15, 2),
	"threshold_yellow" numeric(15, 2),
	"threshold_red" numeric(15, 2),
	"is_key_metric" boolean DEFAULT false,
	"weight" numeric(3, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "simulation_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"simulation_id" uuid NOT NULL,
	"participant_id" varchar NOT NULL,
	"role" varchar(100),
	"decisions" jsonb,
	"response_time" integer,
	"decision_quality" numeric(3, 2),
	"collaboration_score" numeric(3, 2),
	"leadership_score" numeric(3, 2),
	"stress_handling" numeric(3, 2),
	"overall_performance" numeric(3, 2),
	"strengths" jsonb,
	"improvement_areas" jsonb,
	"personalized_feedback" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "stakeholder_alignment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scenario_id" uuid NOT NULL,
	"execution_id" uuid,
	"organization_id" uuid NOT NULL,
	"stakeholder_id" varchar NOT NULL,
	"stakeholder_role" varchar(100) NOT NULL,
	"department" varchar(100),
	"has_acknowledged" boolean DEFAULT false,
	"acknowledged_at" timestamp,
	"assigned_tasks" jsonb,
	"completed_tasks" jsonb,
	"task_completion_rate" numeric(3, 2),
	"response_time" integer,
	"blockers" jsonb,
	"status" varchar(50) DEFAULT 'pending',
	"notified_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "strategic_alerts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"alert_type" "alert_type" NOT NULL,
	"severity" "priority" DEFAULT 'medium',
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"ai_confidence" numeric(3, 2),
	"data_sources_used" jsonb,
	"suggested_actions" jsonb,
	"recommended_scenario" varchar(255),
	"target_audience" jsonb,
	"status" varchar(50) DEFAULT 'active',
	"acknowledged_by" varchar,
	"acknowledged_at" timestamp,
	"resolved_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "strategic_scenarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"type" varchar(100),
	"industry" varchar(100),
	"is_template" boolean DEFAULT false,
	"template_category" varchar(100),
	"likelihood" numeric(3, 2),
	"impact" "risk_level" DEFAULT 'low',
	"trigger_conditions" jsonb,
	"response_strategy" jsonb,
	"status" varchar(50) DEFAULT 'draft',
	"last_triggered" timestamp,
	"last_drill_date" timestamp,
	"approval_status" varchar(50) DEFAULT 'pending',
	"approved_by" varchar,
	"approved_at" timestamp,
	"automation_coverage" numeric(3, 2),
	"readiness_state" varchar(20) DEFAULT 'yellow',
	"average_execution_time" integer,
	"execution_count" integer DEFAULT 0,
	"created_by" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "synthetic_scenarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"category" varchar(100) NOT NULL,
	"likelihood" numeric(3, 2),
	"potential_impact" "risk_level",
	"time_horizon" varchar(50),
	"trigger_signs" jsonb,
	"context_data" jsonb,
	"response_framework" jsonb,
	"key_stakeholders" jsonb,
	"strategic_implications" text,
	"generated_by" varchar DEFAULT 'ai',
	"parent_query" text,
	"upvotes" integer DEFAULT 0,
	"status" varchar(50) DEFAULT 'draft',
	"implemented_as_scenario" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scenario_id" uuid NOT NULL,
	"description" text NOT NULL,
	"priority" varchar(50) DEFAULT 'medium',
	"status" varchar(50) DEFAULT 'draft',
	"assigned_to" varchar,
	"estimated_hours" numeric(5, 2),
	"actual_hours" numeric(5, 2),
	"completed" timestamp,
	"due_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trigger_monitoring_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trigger_id" uuid NOT NULL,
	"previous_status" varchar(50),
	"new_status" varchar(50) NOT NULL,
	"trigger_value" jsonb,
	"metadata" jsonb,
	"notifications_sent" jsonb,
	"acknowledged_by" varchar,
	"acknowledged_at" timestamp,
	"resolved_by" varchar,
	"resolved_at" timestamp,
	"playbook_activated" uuid,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trigger_signals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(100),
	"signal_type" varchar(100) NOT NULL,
	"data_source_id" uuid,
	"data_field" varchar(255),
	"sampling_cadence" integer,
	"operator" varchar(50),
	"threshold_value" text,
	"guardband" numeric(5, 2),
	"confidence_weight" numeric(3, 2) DEFAULT '1.00',
	"priority" "priority" DEFAULT 'medium',
	"current_value" text,
	"last_evaluated_at" timestamp,
	"is_active" boolean DEFAULT true,
	"created_by" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "usage_analytics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"user_id" varchar NOT NULL,
	"session_id" varchar,
	"event_type" varchar(100) NOT NULL,
	"feature" varchar(100),
	"action" varchar(100),
	"entity_type" varchar(100),
	"entity_id" uuid,
	"duration" integer,
	"value" numeric(15, 2),
	"context" jsonb,
	"device_type" varchar(50),
	"browser_info" jsonb,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"organization_id" uuid,
	"business_unit_id" uuid,
	"role_id" uuid,
	"department" varchar(100),
	"team" varchar(100),
	"manager_id" varchar,
	"hours_per_week" integer DEFAULT 40,
	"skills" jsonb,
	"certifications" jsonb,
	"planned_leave" jsonb,
	"access_level" varchar(50) DEFAULT 'basic',
	"scopes" jsonb,
	"last_login_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "value_tracking_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"event_type" varchar(100) NOT NULL,
	"entity_id" uuid,
	"entity_type" varchar(100),
	"value_generated" numeric(15, 2),
	"cost_avoided" numeric(15, 2),
	"time_to_resolution" integer,
	"stakeholders_involved" integer,
	"quality_score" numeric(3, 2),
	"evidence_data" jsonb,
	"calculated_by" varchar,
	"validated_by" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "war_room_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"crisis_id" varchar(255),
	"session_name" varchar(255),
	"commander_id" varchar,
	"status" varchar(50) DEFAULT 'active',
	"start_time" timestamp,
	"end_time" timestamp,
	"participants" jsonb,
	"objectives" jsonb,
	"action_items" jsonb,
	"decisions" jsonb,
	"scenario_id" uuid,
	"execution_time_minutes" integer,
	"executive_hourly_rate" integer DEFAULT 350,
	"stakeholders_notified" integer,
	"business_impact" jsonb,
	"outcome" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "war_room_updates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"update_type" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"priority" "priority" DEFAULT 'medium',
	"author_id" varchar NOT NULL,
	"impact_assessment" text,
	"required_actions" jsonb,
	"assigned_to" jsonb,
	"deadline" timestamp,
	"attachments" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "what_if_scenarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"test_conditions" jsonb NOT NULL,
	"triggered_alerts" jsonb,
	"recommended_playbooks" jsonb,
	"projected_execution_time" integer,
	"teams_involved" jsonb,
	"resource_requirements" jsonb,
	"risk_assessment" jsonb,
	"industry_comparison" jsonb,
	"decision_velocity_metrics" jsonb,
	"saved_for_presentation" boolean DEFAULT false,
	"presentation_notes" text,
	"tags" jsonb,
	"created_by" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "workflow_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(100),
	"phases" jsonb,
	"approval_matrix" jsonb,
	"sla_requirements" jsonb,
	"escalation_rules" jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "action_hooks" ADD CONSTRAINT "action_hooks_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "action_hooks" ADD CONSTRAINT "action_hooks_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "board_reports" ADD CONSTRAINT "board_reports_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "board_reports" ADD CONSTRAINT "board_reports_generated_by_users_id_fk" FOREIGN KEY ("generated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "board_reports" ADD CONSTRAINT "board_reports_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "composite_trigger_logic" ADD CONSTRAINT "composite_trigger_logic_trigger_id_executive_triggers_id_fk" FOREIGN KEY ("trigger_id") REFERENCES "public"."executive_triggers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_sources" ADD CONSTRAINT "data_sources_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_sources" ADD CONSTRAINT "data_sources_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decision_confidence" ADD CONSTRAINT "decision_confidence_scenario_id_strategic_scenarios_id_fk" FOREIGN KEY ("scenario_id") REFERENCES "public"."strategic_scenarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decision_confidence" ADD CONSTRAINT "decision_confidence_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decision_confidence" ADD CONSTRAINT "decision_confidence_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decision_outcomes" ADD CONSTRAINT "decision_outcomes_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decision_outcomes" ADD CONSTRAINT "decision_outcomes_scenario_id_strategic_scenarios_id_fk" FOREIGN KEY ("scenario_id") REFERENCES "public"."strategic_scenarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decision_outcomes" ADD CONSTRAINT "decision_outcomes_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decision_outcomes" ADD CONSTRAINT "decision_outcomes_decision_maker_users_id_fk" FOREIGN KEY ("decision_maker") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decision_outcomes" ADD CONSTRAINT "decision_outcomes_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "echo_cultural_metrics" ADD CONSTRAINT "echo_cultural_metrics_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_validation_reports" ADD CONSTRAINT "execution_validation_reports_scenario_id_strategic_scenarios_id_fk" FOREIGN KEY ("scenario_id") REFERENCES "public"."strategic_scenarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_validation_reports" ADD CONSTRAINT "execution_validation_reports_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_validation_reports" ADD CONSTRAINT "execution_validation_reports_executed_by_users_id_fk" FOREIGN KEY ("executed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "executive_briefings" ADD CONSTRAINT "executive_briefings_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "executive_briefings" ADD CONSTRAINT "executive_briefings_executive_id_users_id_fk" FOREIGN KEY ("executive_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "executive_insights" ADD CONSTRAINT "executive_insights_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "executive_triggers" ADD CONSTRAINT "executive_triggers_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "executive_triggers" ADD CONSTRAINT "executive_triggers_data_source_id_data_sources_id_fk" FOREIGN KEY ("data_source_id") REFERENCES "public"."data_sources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "executive_triggers" ADD CONSTRAINT "executive_triggers_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flux_adaptations" ADD CONSTRAINT "flux_adaptations_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flux_adaptations" ADD CONSTRAINT "flux_adaptations_scenario_id_strategic_scenarios_id_fk" FOREIGN KEY ("scenario_id") REFERENCES "public"."strategic_scenarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "institutional_memory" ADD CONSTRAINT "institutional_memory_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "intelligence_reports" ADD CONSTRAINT "intelligence_reports_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "intuition_records" ADD CONSTRAINT "intuition_records_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "intuition_records" ADD CONSTRAINT "intuition_records_executive_id_users_id_fk" FOREIGN KEY ("executive_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_patterns" ADD CONSTRAINT "learning_patterns_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "module_usage_analytics" ADD CONSTRAINT "module_usage_analytics_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nova_innovations" ADD CONSTRAINT "nova_innovations_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outcome_execution_log" ADD CONSTRAINT "outcome_execution_log_scenario_id_strategic_scenarios_id_fk" FOREIGN KEY ("scenario_id") REFERENCES "public"."strategic_scenarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outcome_execution_log" ADD CONSTRAINT "outcome_execution_log_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outcome_execution_log" ADD CONSTRAINT "outcome_execution_log_trigger_id_executive_triggers_id_fk" FOREIGN KEY ("trigger_id") REFERENCES "public"."executive_triggers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outcome_execution_log" ADD CONSTRAINT "outcome_execution_log_activated_by_users_id_fk" FOREIGN KEY ("activated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outcome_execution_log" ADD CONSTRAINT "outcome_execution_log_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbook_trigger_associations" ADD CONSTRAINT "playbook_trigger_associations_trigger_id_executive_triggers_id_fk" FOREIGN KEY ("trigger_id") REFERENCES "public"."executive_triggers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbook_trigger_associations" ADD CONSTRAINT "playbook_trigger_associations_playbook_id_strategic_scenarios_id_fk" FOREIGN KEY ("playbook_id") REFERENCES "public"."strategic_scenarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbook_trigger_associations" ADD CONSTRAINT "playbook_trigger_associations_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "preparedness_activities" ADD CONSTRAINT "preparedness_activities_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "preparedness_activities" ADD CONSTRAINT "preparedness_activities_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "preparedness_scores" ADD CONSTRAINT "preparedness_scores_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "preparedness_scores" ADD CONSTRAINT "preparedness_scores_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prism_insights" ADD CONSTRAINT "prism_insights_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_lead_id_users_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pulse_metrics" ADD CONSTRAINT "pulse_metrics_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roles" ADD CONSTRAINT "roles_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scenario_context" ADD CONSTRAINT "scenario_context_scenario_id_strategic_scenarios_id_fk" FOREIGN KEY ("scenario_id") REFERENCES "public"."strategic_scenarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scenario_context" ADD CONSTRAINT "scenario_context_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scenario_dependencies" ADD CONSTRAINT "scenario_dependencies_scenario_id_strategic_scenarios_id_fk" FOREIGN KEY ("scenario_id") REFERENCES "public"."strategic_scenarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scenario_dependencies" ADD CONSTRAINT "scenario_dependencies_dependent_scenario_id_strategic_scenarios_id_fk" FOREIGN KEY ("dependent_scenario_id") REFERENCES "public"."strategic_scenarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scenario_stakeholders" ADD CONSTRAINT "scenario_stakeholders_scenario_id_strategic_scenarios_id_fk" FOREIGN KEY ("scenario_id") REFERENCES "public"."strategic_scenarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scenario_stakeholders" ADD CONSTRAINT "scenario_stakeholders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scenario_success_metrics" ADD CONSTRAINT "scenario_success_metrics_scenario_id_strategic_scenarios_id_fk" FOREIGN KEY ("scenario_id") REFERENCES "public"."strategic_scenarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stakeholder_alignment" ADD CONSTRAINT "stakeholder_alignment_scenario_id_strategic_scenarios_id_fk" FOREIGN KEY ("scenario_id") REFERENCES "public"."strategic_scenarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stakeholder_alignment" ADD CONSTRAINT "stakeholder_alignment_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stakeholder_alignment" ADD CONSTRAINT "stakeholder_alignment_stakeholder_id_users_id_fk" FOREIGN KEY ("stakeholder_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "strategic_alerts" ADD CONSTRAINT "strategic_alerts_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "strategic_alerts" ADD CONSTRAINT "strategic_alerts_acknowledged_by_users_id_fk" FOREIGN KEY ("acknowledged_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "strategic_scenarios" ADD CONSTRAINT "strategic_scenarios_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "strategic_scenarios" ADD CONSTRAINT "strategic_scenarios_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "strategic_scenarios" ADD CONSTRAINT "strategic_scenarios_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "synthetic_scenarios" ADD CONSTRAINT "synthetic_scenarios_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "synthetic_scenarios" ADD CONSTRAINT "synthetic_scenarios_implemented_as_scenario_strategic_scenarios_id_fk" FOREIGN KEY ("implemented_as_scenario") REFERENCES "public"."strategic_scenarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_scenario_id_strategic_scenarios_id_fk" FOREIGN KEY ("scenario_id") REFERENCES "public"."strategic_scenarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trigger_monitoring_history" ADD CONSTRAINT "trigger_monitoring_history_trigger_id_executive_triggers_id_fk" FOREIGN KEY ("trigger_id") REFERENCES "public"."executive_triggers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trigger_monitoring_history" ADD CONSTRAINT "trigger_monitoring_history_acknowledged_by_users_id_fk" FOREIGN KEY ("acknowledged_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trigger_monitoring_history" ADD CONSTRAINT "trigger_monitoring_history_resolved_by_users_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trigger_signals" ADD CONSTRAINT "trigger_signals_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trigger_signals" ADD CONSTRAINT "trigger_signals_data_source_id_data_sources_id_fk" FOREIGN KEY ("data_source_id") REFERENCES "public"."data_sources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trigger_signals" ADD CONSTRAINT "trigger_signals_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "war_room_sessions" ADD CONSTRAINT "war_room_sessions_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "war_room_sessions" ADD CONSTRAINT "war_room_sessions_commander_id_users_id_fk" FOREIGN KEY ("commander_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "war_room_sessions" ADD CONSTRAINT "war_room_sessions_scenario_id_strategic_scenarios_id_fk" FOREIGN KEY ("scenario_id") REFERENCES "public"."strategic_scenarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "war_room_updates" ADD CONSTRAINT "war_room_updates_session_id_war_room_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."war_room_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "war_room_updates" ADD CONSTRAINT "war_room_updates_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "what_if_scenarios" ADD CONSTRAINT "what_if_scenarios_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_background_jobs_queue_status" ON "background_jobs" USING btree ("queue_name","status");--> statement-breakpoint
CREATE INDEX "idx_background_jobs_run_at" ON "background_jobs" USING btree ("run_at");--> statement-breakpoint
CREATE INDEX "idx_background_jobs_priority" ON "background_jobs" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");