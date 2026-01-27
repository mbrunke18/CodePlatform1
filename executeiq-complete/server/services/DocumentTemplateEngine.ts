import { storage } from '../storage';
import { db } from '../db';
import { sql } from 'drizzle-orm';

export type DocumentType = 
  | 'press_release' 
  | 'stakeholder_memo' 
  | 'executive_briefing' 
  | 'project_charter' 
  | 'risk_assessment' 
  | 'action_plan'
  | 'status_report'
  | 'board_presentation'
  | 'customer_communication'
  | 'regulatory_filing'
  | 'budget_request'
  | 'resource_allocation';

export interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'list' | 'object';
  required: boolean;
  defaultValue?: any;
  description?: string;
  source?: 'execution_instance' | 'scenario' | 'organization' | 'user_input' | 'calculated';
}

export interface GeneratedDocument {
  id: string;
  name: string;
  content: string;
  format: 'html' | 'markdown' | 'text';
  metadata: {
    templateId: string;
    generatedAt: Date;
    variablesUsed: Record<string, any>;
    wordCount: number;
  };
}

export interface TemplateSection {
  id: string;
  title: string;
  content: string;
  isConditional?: boolean;
  condition?: string;
  order: number;
}

const DEFAULT_TEMPLATES: Record<DocumentType, { name: string; sections: TemplateSection[]; variables: TemplateVariable[] }> = {
  press_release: {
    name: 'Press Release',
    sections: [
      { id: 'header', title: 'Header', content: '**FOR IMMEDIATE RELEASE**\n\n{{organization_name}}\n{{date}}', order: 1 },
      { id: 'headline', title: 'Headline', content: '# {{headline}}', order: 2 },
      { id: 'lead', title: 'Lead Paragraph', content: '{{location}}, {{date}} — {{lead_paragraph}}', order: 3 },
      { id: 'body', title: 'Body', content: '{{body_content}}', order: 4 },
      { id: 'quote', title: 'Executive Quote', content: '> "{{executive_quote}}"\n> — **{{executive_name}}**, {{executive_title}}', order: 5 },
      { id: 'boilerplate', title: 'About', content: '## About {{organization_name}}\n\n{{organization_description}}', order: 6 },
      { id: 'contact', title: 'Media Contact', content: '**Media Contact:**\n{{contact_name}}\n{{contact_email}}\n{{contact_phone}}', order: 7 },
    ],
    variables: [
      { name: 'organization_name', type: 'string', required: true, source: 'organization' },
      { name: 'headline', type: 'string', required: true, source: 'user_input' },
      { name: 'location', type: 'string', required: true, source: 'organization' },
      { name: 'date', type: 'date', required: true, source: 'calculated', defaultValue: 'today' },
      { name: 'lead_paragraph', type: 'string', required: true, source: 'user_input' },
      { name: 'body_content', type: 'string', required: true, source: 'user_input' },
      { name: 'executive_quote', type: 'string', required: false, source: 'user_input' },
      { name: 'executive_name', type: 'string', required: false, source: 'user_input' },
      { name: 'executive_title', type: 'string', required: false, source: 'user_input' },
      { name: 'organization_description', type: 'string', required: true, source: 'organization' },
      { name: 'contact_name', type: 'string', required: true, source: 'user_input' },
      { name: 'contact_email', type: 'string', required: true, source: 'user_input' },
      { name: 'contact_phone', type: 'string', required: false, source: 'user_input' },
    ],
  },
  stakeholder_memo: {
    name: 'Stakeholder Memo',
    sections: [
      { id: 'header', title: 'Header', content: '**CONFIDENTIAL MEMORANDUM**\n\n**TO:** {{recipients}}\n**FROM:** {{sender_name}}, {{sender_title}}\n**DATE:** {{date}}\n**RE:** {{subject}}', order: 1 },
      { id: 'executive_summary', title: 'Executive Summary', content: '## Executive Summary\n\n{{executive_summary}}', order: 2 },
      { id: 'situation', title: 'Current Situation', content: '## Current Situation\n\n{{situation_overview}}', order: 3 },
      { id: 'recommendations', title: 'Recommendations', content: '## Recommendations\n\n{{recommendations}}', order: 4 },
      { id: 'timeline', title: 'Timeline', content: '## Timeline\n\n{{timeline}}', order: 5 },
      { id: 'resources', title: 'Resources Required', content: '## Resources Required\n\n{{resources_required}}', order: 6 },
      { id: 'next_steps', title: 'Next Steps', content: '## Immediate Next Steps\n\n{{next_steps}}', order: 7 },
    ],
    variables: [
      { name: 'recipients', type: 'string', required: true, source: 'user_input' },
      { name: 'sender_name', type: 'string', required: true, source: 'user_input' },
      { name: 'sender_title', type: 'string', required: true, source: 'user_input' },
      { name: 'date', type: 'date', required: true, source: 'calculated' },
      { name: 'subject', type: 'string', required: true, source: 'scenario' },
      { name: 'executive_summary', type: 'string', required: true, source: 'user_input' },
      { name: 'situation_overview', type: 'string', required: true, source: 'user_input' },
      { name: 'recommendations', type: 'string', required: true, source: 'user_input' },
      { name: 'timeline', type: 'string', required: false, source: 'execution_instance' },
      { name: 'resources_required', type: 'string', required: false, source: 'user_input' },
      { name: 'next_steps', type: 'string', required: true, source: 'user_input' },
    ],
  },
  executive_briefing: {
    name: 'Executive Briefing',
    sections: [
      { id: 'header', title: 'Header', content: '# Executive Briefing: {{title}}\n\n**Prepared for:** {{executive_name}}\n**Date:** {{date}}\n**Classification:** {{classification}}', order: 1 },
      { id: 'situation', title: 'Situation Overview', content: '## Situation Overview\n\n{{situation_overview}}\n\n**Severity Level:** {{severity_level}}', order: 2 },
      { id: 'key_facts', title: 'Key Facts', content: '## Key Facts\n\n{{key_facts}}', order: 3 },
      { id: 'impact', title: 'Business Impact', content: '## Business Impact Assessment\n\n{{business_impact}}', order: 4 },
      { id: 'options', title: 'Response Options', content: '## Response Options\n\n{{response_options}}', order: 5 },
      { id: 'recommendation', title: 'Recommended Action', content: '## Recommended Action\n\n{{recommended_action}}', order: 6 },
      { id: 'decision_required', title: 'Decision Required', content: '## Decision Required\n\n{{decision_required}}\n\n**Decision Deadline:** {{decision_deadline}}', order: 7 },
    ],
    variables: [
      { name: 'title', type: 'string', required: true, source: 'scenario' },
      { name: 'executive_name', type: 'string', required: true, source: 'user_input' },
      { name: 'date', type: 'date', required: true, source: 'calculated' },
      { name: 'classification', type: 'string', required: true, defaultValue: 'Confidential', source: 'user_input' },
      { name: 'situation_overview', type: 'string', required: true, source: 'scenario' },
      { name: 'severity_level', type: 'string', required: true, source: 'scenario' },
      { name: 'key_facts', type: 'string', required: true, source: 'user_input' },
      { name: 'business_impact', type: 'string', required: true, source: 'user_input' },
      { name: 'response_options', type: 'string', required: true, source: 'user_input' },
      { name: 'recommended_action', type: 'string', required: true, source: 'user_input' },
      { name: 'decision_required', type: 'string', required: true, source: 'user_input' },
      { name: 'decision_deadline', type: 'date', required: true, source: 'user_input' },
    ],
  },
  project_charter: {
    name: 'Project Charter',
    sections: [
      { id: 'header', title: 'Header', content: '# Project Charter\n\n**Project Name:** {{project_name}}\n**Version:** {{version}}\n**Date:** {{date}}', order: 1 },
      { id: 'overview', title: 'Project Overview', content: '## Project Overview\n\n{{project_overview}}', order: 2 },
      { id: 'objectives', title: 'Objectives', content: '## Project Objectives\n\n{{objectives}}', order: 3 },
      { id: 'scope', title: 'Scope', content: '## Scope\n\n### In Scope\n{{in_scope}}\n\n### Out of Scope\n{{out_of_scope}}', order: 4 },
      { id: 'stakeholders', title: 'Stakeholders', content: '## Key Stakeholders\n\n{{stakeholders}}', order: 5 },
      { id: 'timeline', title: 'Timeline', content: '## Timeline\n\n**Start Date:** {{start_date}}\n**End Date:** {{end_date}}\n\n{{milestones}}', order: 6 },
      { id: 'budget', title: 'Budget', content: '## Budget\n\n**Total Budget:** {{total_budget}}\n\n{{budget_breakdown}}', order: 7 },
      { id: 'risks', title: 'Risks', content: '## Key Risks\n\n{{key_risks}}', order: 8 },
      { id: 'success_criteria', title: 'Success Criteria', content: '## Success Criteria\n\n{{success_criteria}}', order: 9 },
      { id: 'approvals', title: 'Approvals', content: '## Approvals\n\n| Role | Name | Signature | Date |\n|------|------|-----------|------|\n{{approval_table}}', order: 10 },
    ],
    variables: [
      { name: 'project_name', type: 'string', required: true, source: 'scenario' },
      { name: 'version', type: 'string', required: true, defaultValue: '1.0', source: 'calculated' },
      { name: 'date', type: 'date', required: true, source: 'calculated' },
      { name: 'project_overview', type: 'string', required: true, source: 'scenario' },
      { name: 'objectives', type: 'string', required: true, source: 'user_input' },
      { name: 'in_scope', type: 'string', required: true, source: 'user_input' },
      { name: 'out_of_scope', type: 'string', required: false, source: 'user_input' },
      { name: 'stakeholders', type: 'string', required: true, source: 'execution_instance' },
      { name: 'start_date', type: 'date', required: true, source: 'execution_instance' },
      { name: 'end_date', type: 'date', required: true, source: 'execution_instance' },
      { name: 'milestones', type: 'string', required: false, source: 'execution_instance' },
      { name: 'total_budget', type: 'string', required: false, source: 'user_input' },
      { name: 'budget_breakdown', type: 'string', required: false, source: 'user_input' },
      { name: 'key_risks', type: 'string', required: false, source: 'user_input' },
      { name: 'success_criteria', type: 'string', required: true, source: 'user_input' },
      { name: 'approval_table', type: 'string', required: false, source: 'user_input' },
    ],
  },
  risk_assessment: {
    name: 'Risk Assessment Report',
    sections: [
      { id: 'header', title: 'Header', content: '# Risk Assessment Report\n\n**Assessment Date:** {{date}}\n**Prepared By:** {{prepared_by}}\n**Review Period:** {{review_period}}', order: 1 },
      { id: 'executive_summary', title: 'Executive Summary', content: '## Executive Summary\n\n{{executive_summary}}', order: 2 },
      { id: 'risk_matrix', title: 'Risk Matrix', content: '## Risk Assessment Matrix\n\n{{risk_matrix}}', order: 3 },
      { id: 'critical_risks', title: 'Critical Risks', content: '## Critical Risks\n\n{{critical_risks}}', order: 4 },
      { id: 'mitigation', title: 'Mitigation Strategies', content: '## Mitigation Strategies\n\n{{mitigation_strategies}}', order: 5 },
      { id: 'monitoring', title: 'Monitoring Plan', content: '## Monitoring Plan\n\n{{monitoring_plan}}', order: 6 },
    ],
    variables: [
      { name: 'date', type: 'date', required: true, source: 'calculated' },
      { name: 'prepared_by', type: 'string', required: true, source: 'user_input' },
      { name: 'review_period', type: 'string', required: true, source: 'user_input' },
      { name: 'executive_summary', type: 'string', required: true, source: 'user_input' },
      { name: 'risk_matrix', type: 'string', required: true, source: 'user_input' },
      { name: 'critical_risks', type: 'string', required: true, source: 'user_input' },
      { name: 'mitigation_strategies', type: 'string', required: true, source: 'user_input' },
      { name: 'monitoring_plan', type: 'string', required: false, source: 'user_input' },
    ],
  },
  action_plan: {
    name: 'Action Plan',
    sections: [
      { id: 'header', title: 'Header', content: '# Action Plan: {{title}}\n\n**Plan Owner:** {{plan_owner}}\n**Created:** {{date}}\n**Target Completion:** {{target_date}}', order: 1 },
      { id: 'objective', title: 'Objective', content: '## Objective\n\n{{objective}}', order: 2 },
      { id: 'actions', title: 'Action Items', content: '## Action Items\n\n{{action_items}}', order: 3 },
      { id: 'resources', title: 'Resources', content: '## Resources Required\n\n{{resources}}', order: 4 },
      { id: 'timeline', title: 'Timeline', content: '## Timeline\n\n{{timeline}}', order: 5 },
      { id: 'success_metrics', title: 'Success Metrics', content: '## Success Metrics\n\n{{success_metrics}}', order: 6 },
    ],
    variables: [
      { name: 'title', type: 'string', required: true, source: 'scenario' },
      { name: 'plan_owner', type: 'string', required: true, source: 'user_input' },
      { name: 'date', type: 'date', required: true, source: 'calculated' },
      { name: 'target_date', type: 'date', required: true, source: 'execution_instance' },
      { name: 'objective', type: 'string', required: true, source: 'scenario' },
      { name: 'action_items', type: 'string', required: true, source: 'execution_instance' },
      { name: 'resources', type: 'string', required: false, source: 'user_input' },
      { name: 'timeline', type: 'string', required: false, source: 'execution_instance' },
      { name: 'success_metrics', type: 'string', required: true, source: 'user_input' },
    ],
  },
  status_report: {
    name: 'Status Report',
    sections: [
      { id: 'header', title: 'Header', content: '# Status Report\n\n**Report Date:** {{date}}\n**Reporting Period:** {{period}}\n**Project/Scenario:** {{project_name}}', order: 1 },
      { id: 'summary', title: 'Executive Summary', content: '## Executive Summary\n\n**Overall Status:** {{overall_status}}\n\n{{executive_summary}}', order: 2 },
      { id: 'progress', title: 'Progress Update', content: '## Progress Update\n\n{{progress_update}}', order: 3 },
      { id: 'kpis', title: 'Key Metrics', content: '## Key Metrics\n\n{{key_metrics}}', order: 4 },
      { id: 'issues', title: 'Issues & Blockers', content: '## Issues & Blockers\n\n{{issues}}', order: 5 },
      { id: 'next_steps', title: 'Next Steps', content: '## Next Steps\n\n{{next_steps}}', order: 6 },
    ],
    variables: [
      { name: 'date', type: 'date', required: true, source: 'calculated' },
      { name: 'period', type: 'string', required: true, source: 'user_input' },
      { name: 'project_name', type: 'string', required: true, source: 'scenario' },
      { name: 'overall_status', type: 'string', required: true, source: 'execution_instance' },
      { name: 'executive_summary', type: 'string', required: true, source: 'user_input' },
      { name: 'progress_update', type: 'string', required: true, source: 'execution_instance' },
      { name: 'key_metrics', type: 'string', required: false, source: 'execution_instance' },
      { name: 'issues', type: 'string', required: false, source: 'user_input' },
      { name: 'next_steps', type: 'string', required: true, source: 'user_input' },
    ],
  },
  board_presentation: {
    name: 'Board Presentation',
    sections: [
      { id: 'cover', title: 'Cover', content: '# {{title}}\n\n**Board Meeting:** {{meeting_date}}\n**Presented By:** {{presenter}}', order: 1 },
      { id: 'agenda', title: 'Agenda', content: '## Agenda\n\n{{agenda}}', order: 2 },
      { id: 'executive_summary', title: 'Executive Summary', content: '## Executive Summary\n\n{{executive_summary}}', order: 3 },
      { id: 'key_highlights', title: 'Key Highlights', content: '## Key Highlights\n\n{{key_highlights}}', order: 4 },
      { id: 'financials', title: 'Financial Overview', content: '## Financial Overview\n\n{{financial_overview}}', order: 5 },
      { id: 'strategic_initiatives', title: 'Strategic Initiatives', content: '## Strategic Initiatives\n\n{{strategic_initiatives}}', order: 6 },
      { id: 'risks', title: 'Risk Summary', content: '## Risk Summary\n\n{{risk_summary}}', order: 7 },
      { id: 'decisions', title: 'Decisions Required', content: '## Decisions Required\n\n{{decisions_required}}', order: 8 },
    ],
    variables: [
      { name: 'title', type: 'string', required: true, source: 'user_input' },
      { name: 'meeting_date', type: 'date', required: true, source: 'user_input' },
      { name: 'presenter', type: 'string', required: true, source: 'user_input' },
      { name: 'agenda', type: 'string', required: true, source: 'user_input' },
      { name: 'executive_summary', type: 'string', required: true, source: 'user_input' },
      { name: 'key_highlights', type: 'string', required: true, source: 'user_input' },
      { name: 'financial_overview', type: 'string', required: false, source: 'user_input' },
      { name: 'strategic_initiatives', type: 'string', required: false, source: 'user_input' },
      { name: 'risk_summary', type: 'string', required: false, source: 'user_input' },
      { name: 'decisions_required', type: 'string', required: true, source: 'user_input' },
    ],
  },
  customer_communication: {
    name: 'Customer Communication',
    sections: [
      { id: 'header', title: 'Header', content: '**{{organization_name}}**\n\n{{date}}', order: 1 },
      { id: 'greeting', title: 'Greeting', content: 'Dear {{customer_name}},', order: 2 },
      { id: 'body', title: 'Body', content: '{{message_body}}', order: 3 },
      { id: 'action', title: 'Call to Action', content: '{{call_to_action}}', order: 4 },
      { id: 'closing', title: 'Closing', content: '{{closing_message}}\n\n{{sender_name}}\n{{sender_title}}\n{{organization_name}}', order: 5 },
      { id: 'contact', title: 'Contact Info', content: '---\n**Questions?** Contact us at {{support_email}} or {{support_phone}}', order: 6 },
    ],
    variables: [
      { name: 'organization_name', type: 'string', required: true, source: 'organization' },
      { name: 'date', type: 'date', required: true, source: 'calculated' },
      { name: 'customer_name', type: 'string', required: true, source: 'user_input' },
      { name: 'message_body', type: 'string', required: true, source: 'user_input' },
      { name: 'call_to_action', type: 'string', required: false, source: 'user_input' },
      { name: 'closing_message', type: 'string', required: true, defaultValue: 'Sincerely,', source: 'user_input' },
      { name: 'sender_name', type: 'string', required: true, source: 'user_input' },
      { name: 'sender_title', type: 'string', required: true, source: 'user_input' },
      { name: 'support_email', type: 'string', required: true, source: 'organization' },
      { name: 'support_phone', type: 'string', required: false, source: 'organization' },
    ],
  },
  regulatory_filing: {
    name: 'Regulatory Filing',
    sections: [
      { id: 'header', title: 'Header', content: '# Regulatory Filing\n\n**Filing Type:** {{filing_type}}\n**Filing Date:** {{date}}\n**Organization:** {{organization_name}}\n**Filing Reference:** {{reference_number}}', order: 1 },
      { id: 'summary', title: 'Filing Summary', content: '## Filing Summary\n\n{{filing_summary}}', order: 2 },
      { id: 'background', title: 'Background', content: '## Background\n\n{{background}}', order: 3 },
      { id: 'details', title: 'Filing Details', content: '## Filing Details\n\n{{filing_details}}', order: 4 },
      { id: 'supporting', title: 'Supporting Documentation', content: '## Supporting Documentation\n\n{{supporting_docs}}', order: 5 },
      { id: 'certification', title: 'Certification', content: '## Certification\n\n{{certification_statement}}\n\n**Authorized Signatory:** {{signatory_name}}\n**Title:** {{signatory_title}}\n**Date:** {{date}}', order: 6 },
    ],
    variables: [
      { name: 'filing_type', type: 'string', required: true, source: 'user_input' },
      { name: 'date', type: 'date', required: true, source: 'calculated' },
      { name: 'organization_name', type: 'string', required: true, source: 'organization' },
      { name: 'reference_number', type: 'string', required: true, source: 'calculated' },
      { name: 'filing_summary', type: 'string', required: true, source: 'user_input' },
      { name: 'background', type: 'string', required: true, source: 'user_input' },
      { name: 'filing_details', type: 'string', required: true, source: 'user_input' },
      { name: 'supporting_docs', type: 'string', required: false, source: 'user_input' },
      { name: 'certification_statement', type: 'string', required: true, source: 'user_input' },
      { name: 'signatory_name', type: 'string', required: true, source: 'user_input' },
      { name: 'signatory_title', type: 'string', required: true, source: 'user_input' },
    ],
  },
  budget_request: {
    name: 'Budget Request',
    sections: [
      { id: 'header', title: 'Header', content: '# Budget Request\n\n**Request Date:** {{date}}\n**Requested By:** {{requestor_name}}\n**Department:** {{department}}\n**Request Amount:** {{total_amount}}', order: 1 },
      { id: 'justification', title: 'Business Justification', content: '## Business Justification\n\n{{business_justification}}', order: 2 },
      { id: 'breakdown', title: 'Budget Breakdown', content: '## Budget Breakdown\n\n{{budget_breakdown}}', order: 3 },
      { id: 'timeline', title: 'Spending Timeline', content: '## Spending Timeline\n\n{{spending_timeline}}', order: 4 },
      { id: 'roi', title: 'Expected ROI', content: '## Expected Return on Investment\n\n{{expected_roi}}', order: 5 },
      { id: 'alternatives', title: 'Alternatives Considered', content: '## Alternatives Considered\n\n{{alternatives}}', order: 6 },
      { id: 'approval', title: 'Approval', content: '## Approval\n\n**Approval Authority:** {{approval_authority}}\n**Account Code:** {{account_code}}', order: 7 },
    ],
    variables: [
      { name: 'date', type: 'date', required: true, source: 'calculated' },
      { name: 'requestor_name', type: 'string', required: true, source: 'user_input' },
      { name: 'department', type: 'string', required: true, source: 'user_input' },
      { name: 'total_amount', type: 'string', required: true, source: 'user_input' },
      { name: 'business_justification', type: 'string', required: true, source: 'user_input' },
      { name: 'budget_breakdown', type: 'string', required: true, source: 'user_input' },
      { name: 'spending_timeline', type: 'string', required: false, source: 'user_input' },
      { name: 'expected_roi', type: 'string', required: false, source: 'user_input' },
      { name: 'alternatives', type: 'string', required: false, source: 'user_input' },
      { name: 'approval_authority', type: 'string', required: true, source: 'user_input' },
      { name: 'account_code', type: 'string', required: false, source: 'user_input' },
    ],
  },
  resource_allocation: {
    name: 'Resource Allocation Plan',
    sections: [
      { id: 'header', title: 'Header', content: '# Resource Allocation Plan\n\n**Project/Scenario:** {{project_name}}\n**Effective Date:** {{effective_date}}\n**Duration:** {{duration}}', order: 1 },
      { id: 'overview', title: 'Resource Overview', content: '## Resource Overview\n\n{{resource_overview}}', order: 2 },
      { id: 'personnel', title: 'Personnel Allocation', content: '## Personnel Allocation\n\n{{personnel_allocation}}', order: 3 },
      { id: 'budget', title: 'Budget Allocation', content: '## Budget Allocation\n\n{{budget_allocation}}', order: 4 },
      { id: 'equipment', title: 'Equipment & Tools', content: '## Equipment & Tools\n\n{{equipment_allocation}}', order: 5 },
      { id: 'external', title: 'External Resources', content: '## External Resources (Vendors/Contractors)\n\n{{external_resources}}', order: 6 },
      { id: 'constraints', title: 'Constraints', content: '## Resource Constraints\n\n{{constraints}}', order: 7 },
    ],
    variables: [
      { name: 'project_name', type: 'string', required: true, source: 'scenario' },
      { name: 'effective_date', type: 'date', required: true, source: 'user_input' },
      { name: 'duration', type: 'string', required: true, source: 'user_input' },
      { name: 'resource_overview', type: 'string', required: true, source: 'user_input' },
      { name: 'personnel_allocation', type: 'string', required: true, source: 'execution_instance' },
      { name: 'budget_allocation', type: 'string', required: false, source: 'user_input' },
      { name: 'equipment_allocation', type: 'string', required: false, source: 'user_input' },
      { name: 'external_resources', type: 'string', required: false, source: 'user_input' },
      { name: 'constraints', type: 'string', required: false, source: 'user_input' },
    ],
  },
};

export class DocumentTemplateEngine {
  
  getAvailableTemplates(): { type: DocumentType; name: string; description: string }[] {
    return Object.entries(DEFAULT_TEMPLATES).map(([type, template]) => ({
      type: type as DocumentType,
      name: template.name,
      description: `Pre-built template for ${template.name.toLowerCase()} documents`,
    }));
  }
  
  getTemplateVariables(templateType: DocumentType): TemplateVariable[] {
    const template = DEFAULT_TEMPLATES[templateType];
    return template ? template.variables : [];
  }
  
  getTemplateSections(templateType: DocumentType): TemplateSection[] {
    const template = DEFAULT_TEMPLATES[templateType];
    return template ? template.sections : [];
  }
  
  async generateDocument(
    templateType: DocumentType,
    variables: Record<string, any>,
    options: {
      executionInstanceId?: string;
      scenarioId?: string;
      organizationId?: string;
    } = {}
  ): Promise<GeneratedDocument> {
    const template = DEFAULT_TEMPLATES[templateType];
    if (!template) {
      throw new Error(`Unknown template type: ${templateType}`);
    }
    
    const enrichedVariables = await this.enrichVariables(
      template.variables,
      variables,
      options
    );
    
    let content = '';
    for (const section of template.sections.sort((a, b) => a.order - b.order)) {
      if (section.isConditional && section.condition) {
        const conditionMet = this.evaluateCondition(section.condition, enrichedVariables);
        if (!conditionMet) continue;
      }
      
      const sectionContent = this.interpolate(section.content, enrichedVariables);
      content += sectionContent + '\n\n';
    }
    
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    
    return {
      id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `${template.name} - ${new Date().toISOString().split('T')[0]}`,
      content: content.trim(),
      format: 'markdown',
      metadata: {
        templateId: templateType,
        generatedAt: new Date(),
        variablesUsed: enrichedVariables,
        wordCount,
      },
    };
  }
  
  private async enrichVariables(
    templateVariables: TemplateVariable[],
    providedVariables: Record<string, any>,
    options: { executionInstanceId?: string; scenarioId?: string; organizationId?: string }
  ): Promise<Record<string, any>> {
    const enriched: Record<string, any> = { ...providedVariables };
    
    for (const variable of templateVariables) {
      if (enriched[variable.name] !== undefined) continue;
      
      if (variable.source === 'calculated') {
        if (variable.name === 'date' || variable.defaultValue === 'today') {
          enriched[variable.name] = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
        } else if (variable.name === 'version') {
          enriched[variable.name] = variable.defaultValue || '1.0';
        } else if (variable.name === 'reference_number') {
          enriched[variable.name] = `REF-${Date.now().toString(36).toUpperCase()}`;
        }
      }
      
      if (variable.source === 'scenario' && options.scenarioId) {
        const scenarioData = await this.fetchScenarioData(options.scenarioId);
        if (scenarioData) {
          if (variable.name === 'title' || variable.name === 'subject' || variable.name === 'project_name') {
            enriched[variable.name] = scenarioData.title || '';
          } else if (variable.name === 'situation_overview' || variable.name === 'project_overview' || variable.name === 'objective') {
            enriched[variable.name] = scenarioData.description || '';
          } else if (variable.name === 'severity_level') {
            enriched[variable.name] = scenarioData.priority || 'Medium';
          }
        }
      }
      
      if (variable.source === 'organization' && options.organizationId) {
        const orgData = await this.fetchOrganizationData(options.organizationId);
        if (orgData) {
          if (variable.name === 'organization_name') {
            enriched[variable.name] = orgData.name || '';
          } else if (variable.name === 'organization_description') {
            enriched[variable.name] = orgData.description || '';
          } else if (variable.name === 'location') {
            enriched[variable.name] = orgData.location || '';
          } else if (variable.name === 'support_email') {
            enriched[variable.name] = orgData.contactEmail || '';
          }
        }
      }
      
      if (variable.source === 'execution_instance' && options.executionInstanceId) {
        const instanceData = await this.fetchExecutionInstanceData(options.executionInstanceId);
        if (instanceData) {
          if (variable.name === 'overall_status') {
            enriched[variable.name] = instanceData.status || 'In Progress';
          } else if (variable.name === 'start_date') {
            enriched[variable.name] = instanceData.startDate || '';
          } else if (variable.name === 'end_date' || variable.name === 'target_date') {
            enriched[variable.name] = instanceData.endDate || '';
          }
        }
      }
      
      if (enriched[variable.name] === undefined && variable.defaultValue !== undefined) {
        enriched[variable.name] = variable.defaultValue;
      }
      
      if (enriched[variable.name] === undefined && !variable.required) {
        enriched[variable.name] = '';
      }
    }
    
    return enriched;
  }
  
  private interpolate(content: string, variables: Record<string, any>): string {
    return content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      const value = variables[key];
      if (value === undefined || value === null) return match;
      if (value instanceof Date) {
        return value.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      }
      return String(value);
    });
  }
  
  private evaluateCondition(condition: string, variables: Record<string, any>): boolean {
    try {
      const interpolated = this.interpolate(condition, variables);
      return Boolean(eval(interpolated));
    } catch {
      return true;
    }
  }
  
  private async fetchScenarioData(scenarioId: string): Promise<any | null> {
    try {
      const result = await db.execute(
        sql`SELECT title, description, priority FROM strategic_scenarios WHERE id = ${scenarioId}`
      );
      return result.rows[0] || null;
    } catch {
      return null;
    }
  }
  
  private async fetchOrganizationData(organizationId: string): Promise<any | null> {
    try {
      const result = await db.execute(
        sql`SELECT name, description FROM organizations WHERE id = ${organizationId}`
      );
      return result.rows[0] || null;
    } catch {
      return null;
    }
  }
  
  private async fetchExecutionInstanceData(executionInstanceId: string): Promise<any | null> {
    try {
      const result = await db.execute(
        sql`SELECT status, started_at as "startDate", completed_at as "endDate" 
            FROM execution_instances WHERE id = ${executionInstanceId}`
      );
      return result.rows[0] || null;
    } catch {
      return null;
    }
  }
  
  convertToHtml(markdown: string): string {
    let html = markdown
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
    
    html = `<div class="document">${html}</div>`;
    html = html.replace(/<li>/g, '<ul><li>').replace(/<\/li>(?!<li>)/g, '</li></ul>');
    
    return html;
  }
}

export const documentTemplateEngine = new DocumentTemplateEngine();
