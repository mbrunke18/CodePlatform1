/**
 * Enterprise Task Library for Strategic Execution
 * 
 * 40+ common tasks organized by IDEA Framework phases and cross-functional categories
 * These tasks represent the most common work needed for executing strategic plans
 */

export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';
export type TaskCategory = 
  | 'program_management' 
  | 'communications' 
  | 'risk_compliance' 
  | 'finance' 
  | 'technology' 
  | 'hr_change' 
  | 'legal' 
  | 'operations'
  | 'strategy';

export type IdeaPhase = 'identify' | 'detect' | 'execute' | 'advance';

export interface TaskTemplate {
  id: string;
  title: string;
  description: string;
  suggestedOwner: string;
  estimatedMinutes: number;
  priority: TaskPriority;
  category: TaskCategory;
  phase: IdeaPhase;
  approvalRequired: 'none' | 'manager' | 'director' | 'vp' | 'c_suite' | 'board';
  deliverables: string;
  integrations?: string[];
  slaMinutes?: number;
}

export const TASK_CATEGORIES: Record<TaskCategory, { label: string; description: string; color: string }> = {
  program_management: { 
    label: 'Program Management', 
    description: 'PMO, project coordination, and milestone tracking',
    color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
  },
  communications: { 
    label: 'Communications', 
    description: 'Internal and external messaging',
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
  },
  risk_compliance: { 
    label: 'Risk & Compliance', 
    description: 'Risk management and regulatory compliance',
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  },
  finance: { 
    label: 'Finance', 
    description: 'Budget, forecasting, and financial controls',
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
  },
  technology: { 
    label: 'Technology', 
    description: 'IT infrastructure and system changes',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
  },
  hr_change: { 
    label: 'HR & Change Management', 
    description: 'People, training, and organizational change',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
  },
  legal: { 
    label: 'Legal', 
    description: 'Legal review, contracts, and regulatory filings',
    color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
  },
  operations: { 
    label: 'Operations', 
    description: 'Operational execution and process changes',
    color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400'
  },
  strategy: { 
    label: 'Strategy', 
    description: 'Strategic planning and executive decisions',
    color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
  },
};

export const IDEA_PHASES: Record<IdeaPhase, { label: string; description: string; color: string }> = {
  identify: {
    label: 'IDENTIFY',
    description: 'Build and customize playbooks',
    color: 'text-blue-600 dark:text-blue-400'
  },
  detect: {
    label: 'DETECT',
    description: 'Monitor triggers and signals',
    color: 'text-amber-600 dark:text-amber-400'
  },
  execute: {
    label: 'EXECUTE',
    description: 'Coordinate response actions',
    color: 'text-green-600 dark:text-green-400'
  },
  advance: {
    label: 'ADVANCE',
    description: 'Learn and improve',
    color: 'text-purple-600 dark:text-purple-400'
  },
};

/**
 * Comprehensive Enterprise Task Library
 * 42 tasks organized by phase and category
 */
export const ENTERPRISE_TASK_LIBRARY: TaskTemplate[] = [
  // ============ IDENTIFY PHASE - Preparation & Planning ============
  {
    id: 'prep-001',
    title: 'Stand Up Strategic PMO War Room',
    description: 'Establish dedicated command center with communication infrastructure, dashboards, and decision support tools',
    suggestedOwner: 'VP Operations',
    estimatedMinutes: 60,
    priority: 'high',
    category: 'program_management',
    phase: 'identify',
    approvalRequired: 'vp',
    deliverables: 'War room checklist, communication protocols, access credentials',
    integrations: ['Slack', 'Microsoft Teams'],
    slaMinutes: 120,
  },
  {
    id: 'prep-002',
    title: 'Define RACI Matrix for Response Team',
    description: 'Document clear roles and responsibilities for all stakeholders involved in strategic response',
    suggestedOwner: 'Project Manager',
    estimatedMinutes: 45,
    priority: 'high',
    category: 'program_management',
    phase: 'identify',
    approvalRequired: 'director',
    deliverables: 'RACI matrix document, stakeholder map',
    integrations: ['Jira', 'Confluence'],
  },
  {
    id: 'prep-003',
    title: 'Pre-approve Emergency Budget Allocation',
    description: 'Secure pre-approved funding for rapid response activities across departments',
    suggestedOwner: 'CFO',
    estimatedMinutes: 30,
    priority: 'critical',
    category: 'finance',
    phase: 'identify',
    approvalRequired: 'c_suite',
    deliverables: 'Budget authorization memo, spending limits by category',
    slaMinutes: 60,
  },
  {
    id: 'prep-004',
    title: 'Configure Integration Webhooks',
    description: 'Set up automated data feeds from enterprise systems (Salesforce, ServiceNow, etc.)',
    suggestedOwner: 'IT Director',
    estimatedMinutes: 90,
    priority: 'medium',
    category: 'technology',
    phase: 'identify',
    approvalRequired: 'director',
    deliverables: 'Integration documentation, test results, monitoring dashboard',
    integrations: ['Salesforce', 'ServiceNow', 'AWS CloudWatch'],
  },
  {
    id: 'prep-005',
    title: 'Draft Stakeholder Communication Templates',
    description: 'Create pre-approved messaging templates for various scenarios (employees, customers, media, regulators)',
    suggestedOwner: 'VP Communications',
    estimatedMinutes: 120,
    priority: 'high',
    category: 'communications',
    phase: 'identify',
    approvalRequired: 'c_suite',
    deliverables: 'Template library with approval matrix, distribution lists',
  },
  {
    id: 'prep-006',
    title: 'Conduct Legal Risk Pre-Assessment',
    description: 'Review potential legal exposures and prepare standard legal holds and response procedures',
    suggestedOwner: 'General Counsel',
    estimatedMinutes: 60,
    priority: 'high',
    category: 'legal',
    phase: 'identify',
    approvalRequired: 'none',
    deliverables: 'Legal risk matrix, hold templates, outside counsel contact list',
  },
  {
    id: 'prep-007',
    title: 'Map Critical Dependencies',
    description: 'Document all critical system, vendor, and process dependencies that could impact response',
    suggestedOwner: 'VP Operations',
    estimatedMinutes: 90,
    priority: 'high',
    category: 'operations',
    phase: 'identify',
    approvalRequired: 'none',
    deliverables: 'Dependency map, impact assessment, escalation contacts',
  },

  // ============ DETECT PHASE - Monitoring & Triggering ============
  {
    id: 'detect-001',
    title: 'Initial Situation Assessment',
    description: 'Gather and analyze initial information about the incident or opportunity',
    suggestedOwner: 'COO',
    estimatedMinutes: 15,
    priority: 'critical',
    category: 'strategy',
    phase: 'detect',
    approvalRequired: 'none',
    deliverables: 'Situation brief document, severity classification',
    slaMinutes: 15,
  },
  {
    id: 'detect-002',
    title: 'Validate Trigger Accuracy',
    description: 'Confirm signal authenticity and assess false positive probability before full activation',
    suggestedOwner: 'Director of Risk',
    estimatedMinutes: 10,
    priority: 'critical',
    category: 'risk_compliance',
    phase: 'detect',
    approvalRequired: 'none',
    deliverables: 'Validation report, confidence score',
    slaMinutes: 10,
  },
  {
    id: 'detect-003',
    title: 'Activate Cross-Functional Tiger Team',
    description: 'Mobilize rapid response team with representatives from all critical functions',
    suggestedOwner: 'CEO',
    estimatedMinutes: 10,
    priority: 'critical',
    category: 'program_management',
    phase: 'detect',
    approvalRequired: 'c_suite',
    deliverables: 'Team roster, contact confirmation, first meeting scheduled',
    integrations: ['Slack', 'Microsoft Teams', 'Zoom'],
    slaMinutes: 12,
  },
  {
    id: 'detect-004',
    title: 'Issue Executive Notification',
    description: 'Brief C-suite and board members as appropriate for severity level',
    suggestedOwner: 'Chief of Staff',
    estimatedMinutes: 5,
    priority: 'critical',
    category: 'communications',
    phase: 'detect',
    approvalRequired: 'none',
    deliverables: 'Notification log with acknowledgments',
    slaMinutes: 10,
  },
  {
    id: 'detect-005',
    title: 'Competitive Intelligence Briefing',
    description: 'Compile competitive landscape analysis relevant to the detected trigger',
    suggestedOwner: 'VP Strategy',
    estimatedMinutes: 30,
    priority: 'high',
    category: 'strategy',
    phase: 'detect',
    approvalRequired: 'none',
    deliverables: 'Competitive brief, market impact assessment',
  },
  {
    id: 'detect-006',
    title: 'Preliminary Financial Impact Analysis',
    description: 'Quick assessment of potential financial exposure or opportunity value',
    suggestedOwner: 'CFO',
    estimatedMinutes: 20,
    priority: 'high',
    category: 'finance',
    phase: 'detect',
    approvalRequired: 'none',
    deliverables: 'Financial impact estimate, scenario ranges',
  },

  // ============ EXECUTE PHASE - Response & Coordination ============
  {
    id: 'exec-001',
    title: 'Deploy Response Strategy',
    description: 'Execute approved response strategy with coordinated workstreams',
    suggestedOwner: 'COO',
    estimatedMinutes: 30,
    priority: 'critical',
    category: 'strategy',
    phase: 'execute',
    approvalRequired: 'c_suite',
    deliverables: 'Execution plan with milestones, assignments confirmed',
    slaMinutes: 30,
  },
  {
    id: 'exec-002',
    title: 'Issue Internal Communications',
    description: 'Distribute approved messaging to employees and internal stakeholders',
    suggestedOwner: 'CHRO',
    estimatedMinutes: 15,
    priority: 'high',
    category: 'communications',
    phase: 'execute',
    approvalRequired: 'director',
    deliverables: 'Distribution confirmation, acknowledgment tracking',
    integrations: ['Slack', 'Email'],
  },
  {
    id: 'exec-003',
    title: 'Issue External Communications',
    description: 'Release approved messaging to customers, media, and external stakeholders',
    suggestedOwner: 'CMO',
    estimatedMinutes: 30,
    priority: 'critical',
    category: 'communications',
    phase: 'execute',
    approvalRequired: 'c_suite',
    deliverables: 'Press release, FAQ, social media posts, media log',
  },
  {
    id: 'exec-004',
    title: 'Implement Technical Remediation',
    description: 'Execute necessary system changes, patches, or infrastructure modifications',
    suggestedOwner: 'CTO',
    estimatedMinutes: 120,
    priority: 'critical',
    category: 'technology',
    phase: 'execute',
    approvalRequired: 'vp',
    deliverables: 'Change log, test results, rollback plan',
    integrations: ['Jira', 'ServiceNow'],
  },
  {
    id: 'exec-005',
    title: 'Activate Vendor Support Agreements',
    description: 'Engage critical vendors and partners under existing support agreements',
    suggestedOwner: 'VP Operations',
    estimatedMinutes: 20,
    priority: 'high',
    category: 'operations',
    phase: 'execute',
    approvalRequired: 'none',
    deliverables: 'Vendor engagement log, SLA confirmations',
  },
  {
    id: 'exec-006',
    title: 'Execute Customer Outreach',
    description: 'Direct outreach to affected or at-risk customers through account teams',
    suggestedOwner: 'VP Sales',
    estimatedMinutes: 60,
    priority: 'high',
    category: 'operations',
    phase: 'execute',
    approvalRequired: 'director',
    deliverables: 'Customer contact log, issue tracking',
    integrations: ['Salesforce', 'HubSpot'],
  },
  {
    id: 'exec-007',
    title: 'Implement Process Workarounds',
    description: 'Deploy temporary operational processes to maintain business continuity',
    suggestedOwner: 'VP Operations',
    estimatedMinutes: 45,
    priority: 'high',
    category: 'operations',
    phase: 'execute',
    approvalRequired: 'director',
    deliverables: 'Workaround documentation, training materials, timeline for permanent fix',
  },
  {
    id: 'exec-008',
    title: 'File Regulatory Notifications',
    description: 'Submit required notifications to regulatory bodies within compliance windows',
    suggestedOwner: 'Director of Compliance',
    estimatedMinutes: 60,
    priority: 'critical',
    category: 'risk_compliance',
    phase: 'execute',
    approvalRequired: 'c_suite',
    deliverables: 'Filing confirmations, regulator correspondence log',
    slaMinutes: 72 * 60,
  },
  {
    id: 'exec-009',
    title: 'Implement Legal Holds',
    description: 'Issue legal hold notices and preserve relevant documents and communications',
    suggestedOwner: 'General Counsel',
    estimatedMinutes: 30,
    priority: 'high',
    category: 'legal',
    phase: 'execute',
    approvalRequired: 'none',
    deliverables: 'Hold notices sent, acknowledgment tracking',
  },
  {
    id: 'exec-010',
    title: 'Mobilize Change Management',
    description: 'Deploy change management resources for affected workforce transitions',
    suggestedOwner: 'CHRO',
    estimatedMinutes: 60,
    priority: 'medium',
    category: 'hr_change',
    phase: 'execute',
    approvalRequired: 'vp',
    deliverables: 'Change management plan, training schedule, support resources',
    integrations: ['Workday'],
  },
  {
    id: 'exec-011',
    title: 'Conduct Status Briefing',
    description: 'Regular cadence briefings to leadership on execution progress and issues',
    suggestedOwner: 'Project Manager',
    estimatedMinutes: 20,
    priority: 'high',
    category: 'program_management',
    phase: 'execute',
    approvalRequired: 'none',
    deliverables: 'Status report, issue log, decision requests',
  },
  {
    id: 'exec-012',
    title: 'Track Budget Burn Rate',
    description: 'Monitor actual spend against pre-approved budget and forecast to completion',
    suggestedOwner: 'Finance Director',
    estimatedMinutes: 30,
    priority: 'medium',
    category: 'finance',
    phase: 'execute',
    approvalRequired: 'none',
    deliverables: 'Budget tracker, variance report, forecast update',
  },
  {
    id: 'exec-013',
    title: 'Create Jira Project and Tasks',
    description: 'Set up project structure in Jira with epics, stories, and task assignments',
    suggestedOwner: 'Project Manager',
    estimatedMinutes: 45,
    priority: 'high',
    category: 'program_management',
    phase: 'execute',
    approvalRequired: 'none',
    deliverables: 'Jira project, sprint backlog, team assignments',
    integrations: ['Jira'],
  },
  {
    id: 'exec-014',
    title: 'Spin Up ServiceNow Incident',
    description: 'Create and configure incident record with proper categorization and assignment',
    suggestedOwner: 'IT Director',
    estimatedMinutes: 15,
    priority: 'high',
    category: 'technology',
    phase: 'execute',
    approvalRequired: 'none',
    deliverables: 'ServiceNow incident record, assignment groups notified',
    integrations: ['ServiceNow'],
  },
  {
    id: 'exec-015',
    title: 'Run Risk Burndown Assessment',
    description: 'Track mitigation progress across identified risks with ServiceNow integration',
    suggestedOwner: 'Director of Risk',
    estimatedMinutes: 30,
    priority: 'high',
    category: 'risk_compliance',
    phase: 'execute',
    approvalRequired: 'none',
    deliverables: 'Risk burndown chart, mitigation status report',
    integrations: ['ServiceNow'],
  },
  {
    id: 'exec-016',
    title: 'Coordinate Third-Party Auditors',
    description: 'Engage and coordinate with external auditors or forensic investigators',
    suggestedOwner: 'General Counsel',
    estimatedMinutes: 60,
    priority: 'high',
    category: 'risk_compliance',
    phase: 'execute',
    approvalRequired: 'c_suite',
    deliverables: 'Engagement letter, scope document, information request log',
  },
  {
    id: 'exec-017',
    title: 'Deploy Emergency Training',
    description: 'Rapid training deployment for new processes or compliance requirements',
    suggestedOwner: 'HR Director',
    estimatedMinutes: 90,
    priority: 'medium',
    category: 'hr_change',
    phase: 'execute',
    approvalRequired: 'director',
    deliverables: 'Training materials, completion tracking, competency verification',
    integrations: ['Workday'],
  },
  {
    id: 'exec-018',
    title: 'Manage Media Inquiries',
    description: 'Handle incoming media requests with approved messaging and spokesperson coordination',
    suggestedOwner: 'CMO',
    estimatedMinutes: 60,
    priority: 'high',
    category: 'communications',
    phase: 'execute',
    approvalRequired: 'c_suite',
    deliverables: 'Media inquiry log, response tracking, coverage monitoring',
  },

  // ============ ADVANCE PHASE - Learning & Improvement ============
  {
    id: 'adv-001',
    title: 'Conduct After-Action Review',
    description: 'Structured debrief with all stakeholders to capture lessons learned',
    suggestedOwner: 'COO',
    estimatedMinutes: 120,
    priority: 'high',
    category: 'program_management',
    phase: 'advance',
    approvalRequired: 'none',
    deliverables: 'AAR document with findings and recommendations',
  },
  {
    id: 'adv-002',
    title: 'Update Playbook with Lessons Learned',
    description: 'Incorporate improvements into playbook based on execution experience',
    suggestedOwner: 'VP Strategy',
    estimatedMinutes: 60,
    priority: 'high',
    category: 'strategy',
    phase: 'advance',
    approvalRequired: 'director',
    deliverables: 'Updated playbook version, change log',
  },
  {
    id: 'adv-003',
    title: 'Calculate Final ROI Impact',
    description: 'Determine actual financial impact and calculate response effectiveness',
    suggestedOwner: 'CFO',
    estimatedMinutes: 60,
    priority: 'medium',
    category: 'finance',
    phase: 'advance',
    approvalRequired: 'none',
    deliverables: 'ROI analysis, cost avoidance/capture documentation',
  },
  {
    id: 'adv-004',
    title: 'Publish Retrospective Report',
    description: 'Formal documentation of event, response, and outcomes for institutional memory',
    suggestedOwner: 'Project Manager',
    estimatedMinutes: 90,
    priority: 'medium',
    category: 'program_management',
    phase: 'advance',
    approvalRequired: 'vp',
    deliverables: 'Final retrospective report, executive summary',
  },
  {
    id: 'adv-005',
    title: 'Update Risk Register',
    description: 'Revise enterprise risk register based on new insights and exposures identified',
    suggestedOwner: 'Director of Risk',
    estimatedMinutes: 45,
    priority: 'medium',
    category: 'risk_compliance',
    phase: 'advance',
    approvalRequired: 'director',
    deliverables: 'Updated risk register, new control recommendations',
  },
  {
    id: 'adv-006',
    title: 'Conduct Stakeholder Feedback Survey',
    description: 'Gather feedback from all participants on response effectiveness',
    suggestedOwner: 'Project Manager',
    estimatedMinutes: 30,
    priority: 'low',
    category: 'program_management',
    phase: 'advance',
    approvalRequired: 'none',
    deliverables: 'Survey results, satisfaction scores, improvement suggestions',
  },
  {
    id: 'adv-007',
    title: 'Archive Response Documentation',
    description: 'Organize and archive all response documents for future reference and compliance',
    suggestedOwner: 'Director of Compliance',
    estimatedMinutes: 60,
    priority: 'medium',
    category: 'risk_compliance',
    phase: 'advance',
    approvalRequired: 'none',
    deliverables: 'Archived document repository, retention schedule compliance',
  },
  {
    id: 'adv-008',
    title: 'Schedule Follow-Up Training',
    description: 'Plan and schedule training based on gaps identified during response',
    suggestedOwner: 'HR Director',
    estimatedMinutes: 30,
    priority: 'low',
    category: 'hr_change',
    phase: 'advance',
    approvalRequired: 'manager',
    deliverables: 'Training plan, schedule, curriculum updates',
    integrations: ['Workday'],
  },
  {
    id: 'adv-009',
    title: 'Brief Board on Outcomes',
    description: 'Prepare and deliver executive summary to board of directors',
    suggestedOwner: 'CEO',
    estimatedMinutes: 60,
    priority: 'high',
    category: 'strategy',
    phase: 'advance',
    approvalRequired: 'c_suite',
    deliverables: 'Board presentation, Q&A preparation, follow-up commitments',
  },
  {
    id: 'adv-010',
    title: 'Update Business Continuity Plans',
    description: 'Revise BCP documentation based on response experience and findings',
    suggestedOwner: 'VP Operations',
    estimatedMinutes: 90,
    priority: 'medium',
    category: 'operations',
    phase: 'advance',
    approvalRequired: 'vp',
    deliverables: 'Updated BCP, testing schedule, gap remediation plan',
  },
];

/**
 * Helper function to get tasks by phase
 */
export function getTasksByPhase(phase: IdeaPhase): TaskTemplate[] {
  return ENTERPRISE_TASK_LIBRARY.filter(task => task.phase === phase);
}

/**
 * Helper function to get tasks by category
 */
export function getTasksByCategory(category: TaskCategory): TaskTemplate[] {
  return ENTERPRISE_TASK_LIBRARY.filter(task => task.category === category);
}

/**
 * Helper function to get critical and high priority tasks
 */
export function getCriticalTasks(): TaskTemplate[] {
  return ENTERPRISE_TASK_LIBRARY.filter(task => task.priority === 'critical' || task.priority === 'high');
}

/**
 * Get task statistics
 */
export function getTaskLibraryStats() {
  const phases = {
    identify: ENTERPRISE_TASK_LIBRARY.filter(t => t.phase === 'identify').length,
    detect: ENTERPRISE_TASK_LIBRARY.filter(t => t.phase === 'detect').length,
    execute: ENTERPRISE_TASK_LIBRARY.filter(t => t.phase === 'execute').length,
    advance: ENTERPRISE_TASK_LIBRARY.filter(t => t.phase === 'advance').length,
  };

  const categories: Record<string, number> = {};
  ENTERPRISE_TASK_LIBRARY.forEach(task => {
    categories[task.category] = (categories[task.category] || 0) + 1;
  });

  return {
    total: ENTERPRISE_TASK_LIBRARY.length,
    phases,
    categories,
    critical: ENTERPRISE_TASK_LIBRARY.filter(t => t.priority === 'critical').length,
    high: ENTERPRISE_TASK_LIBRARY.filter(t => t.priority === 'high').length,
  };
}
