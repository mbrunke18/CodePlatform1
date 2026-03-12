/**
 * Rich Sample Data Generators for Playbook Templates
 * Provides fully populated test data for all 15 customization sections
 * Uses deterministic generation for consistent demo experiences
 */

// Deterministic ID generator based on seed string
function deterministicId(seed: string, index: number = 0): string {
  let hash = 0;
  const str = `${seed}-${index}`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36).padStart(8, '0').slice(0, 8);
}

// Deterministic selection from array based on seed
function deterministicSelect<T>(arr: T[], seed: string, index: number = 0): T {
  let hash = 0;
  const str = `${seed}-select-${index}`;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return arr[Math.abs(hash) % arr.length];
}

// Domain-specific configurations for generating contextual data
const DOMAIN_CONTEXTS: Record<number, {
  name: string;
  executiveRole: string;
  typicalTriggers: string[];
  typicalStakeholders: string[];
  complianceFrameworks: string[];
  riskFactors: string[];
}> = {
  1: { // Market Dynamics
    name: 'Market Dynamics',
    executiveRole: 'CEO',
    typicalTriggers: ['Competitor press release', 'Market share data alert', 'Pricing intelligence update', 'Channel partner notification'],
    typicalStakeholders: ['CEO', 'CMO', 'CPO', 'VP Strategy', 'Sales Director'],
    complianceFrameworks: ['sec', 'ftc'],
    riskFactors: ['Market share erosion', 'Revenue impact', 'Customer churn']
  },
  2: { // Operational Excellence
    name: 'Operational Excellence',
    executiveRole: 'COO',
    typicalTriggers: ['Supply chain alert', 'Supplier notification', 'Logistics system flag', 'Quality control deviation'],
    typicalStakeholders: ['COO', 'VP Operations', 'Supply Chain Director', 'Quality Manager'],
    complianceFrameworks: ['iso27001', 'soc2'],
    riskFactors: ['Production delays', 'Quality issues', 'Cost overruns']
  },
  3: { // Financial Strategy
    name: 'Financial Strategy',
    executiveRole: 'CFO',
    typicalTriggers: ['Revenue variance threshold', 'Cash flow alert', 'Investor inquiry', 'Audit finding'],
    typicalStakeholders: ['CFO', 'Controller', 'VP Finance', 'Investor Relations', 'Board Liaison'],
    complianceFrameworks: ['sox', 'gaap', 'sec'],
    riskFactors: ['Earnings miss', 'Credit rating impact', 'Investor confidence']
  },
  4: { // Regulatory & Compliance
    name: 'Regulatory & Compliance',
    executiveRole: 'CLO',
    typicalTriggers: ['Regulatory filing', 'Government inquiry', 'Compliance audit', 'Legal notice received'],
    typicalStakeholders: ['CLO', 'Chief Compliance Officer', 'General Counsel', 'VP Legal', 'External Counsel'],
    complianceFrameworks: ['sox', 'gdpr', 'ccpa', 'hipaa'],
    riskFactors: ['Regulatory fines', 'License suspension', 'Criminal liability']
  },
  5: { // Technology & Innovation
    name: 'Technology & Innovation',
    executiveRole: 'CTO',
    typicalTriggers: ['Security alert', 'System monitoring threshold', 'Vendor notification', 'Penetration test finding'],
    typicalStakeholders: ['CTO', 'CISO', 'VP Engineering', 'Security Director', 'IT Operations Lead'],
    complianceFrameworks: ['soc2', 'iso27001', 'pci_dss', 'gdpr'],
    riskFactors: ['Data breach', 'System downtime', 'Reputation damage']
  },
  6: { // Talent & Leadership
    name: 'Talent & Leadership',
    executiveRole: 'CHRO',
    typicalTriggers: ['Executive resignation notice', 'Employee survey alert', 'Union notification', 'Whistleblower report'],
    typicalStakeholders: ['CHRO', 'CEO', 'General Counsel', 'VP HR', 'Communications Director'],
    complianceFrameworks: ['eeoc', 'osha', 'ada'],
    riskFactors: ['Key person loss', 'Talent exodus', 'Culture damage']
  },
  7: { // Brand & Reputation
    name: 'Brand & Reputation',
    executiveRole: 'CMO',
    typicalTriggers: ['Social media spike', 'Media inquiry', 'Customer complaint escalation', 'Influencer mention'],
    typicalStakeholders: ['CMO', 'CEO', 'VP Communications', 'PR Director', 'Social Media Manager'],
    complianceFrameworks: ['ftc', 'fda'],
    riskFactors: ['Brand value erosion', 'Customer trust loss', 'Media crisis']
  },
  8: { // Market Opportunities
    name: 'Market Opportunities',
    executiveRole: 'CEO',
    typicalTriggers: ['M&A target available', 'Market trend data', 'Partnership inquiry', 'Geographic expansion signal'],
    typicalStakeholders: ['CEO', 'CFO', 'Corp Dev', 'VP Strategy', 'General Counsel'],
    complianceFrameworks: ['sec', 'hsr', 'cfius'],
    riskFactors: ['Missed opportunity', 'Integration failure', 'Overpayment']
  },
  9: { // AI Governance
    name: 'AI Governance',
    executiveRole: 'CTO',
    typicalTriggers: ['Model performance degradation', 'Bias detection alert', 'AI vendor incident', 'Regulatory inquiry on AI'],
    typicalStakeholders: ['CTO', 'Chief AI Officer', 'CISO', 'Ethics Committee', 'Data Privacy Officer'],
    complianceFrameworks: ['eu_ai_act', 'nist_ai_rmf', 'gdpr'],
    riskFactors: ['Model failure', 'Algorithmic bias', 'Privacy violation', 'Reputation damage']
  }
};

function getContext(domainId: number) {
  return DOMAIN_CONTEXTS[domainId] || DOMAIN_CONTEXTS[1];
}

export function generateTriggerConditions(domainId: number, playbookName: string): Array<{
  id: string;
  description: string;
  source: string;
  severity: string;
  autoActivate: boolean;
}> {
  const context = getContext(domainId);
  const sources = ['manual', 'system', 'integration', 'market_data', 'news', 'competitive_intelligence', 'regulatory', 'financial'];
  const seed = `trigger-${domainId}-${playbookName}`;
  
  return [
    {
      id: deterministicId(seed, 1),
      description: `${context.typicalTriggers[0]} related to ${playbookName.toLowerCase()}`,
      source: deterministicSelect(sources.slice(0, 4), seed, 1),
      severity: 'critical',
      autoActivate: true
    },
    {
      id: deterministicId(seed, 2),
      description: `${context.typicalTriggers[1]} triggers immediate assessment`,
      source: 'system',
      severity: 'urgent',
      autoActivate: true
    },
    {
      id: deterministicId(seed, 3),
      description: `${context.typicalTriggers[2]} exceeds threshold parameters`,
      source: 'integration',
      severity: 'warning',
      autoActivate: false
    }
  ];
}

export function generateEscalationPaths(domainId: number, playbookName: string = ''): Array<{
  id: string;
  triggerCondition: string;
  escalateTo: string;
  backupContact: string;
  timeToEscalate: number;
  notificationChannels: string[];
}> {
  const context = getContext(domainId);
  const seed = `escalation-${domainId}-${playbookName}`;
  
  return [
    {
      id: deterministicId(seed, 1),
      triggerCondition: 'no_response',
      escalateTo: context.executiveRole,
      backupContact: context.typicalStakeholders[1] || 'COO',
      timeToEscalate: 15,
      notificationChannels: ['email', 'phone', 'sms']
    },
    {
      id: deterministicId(seed, 2),
      triggerCondition: 'blocked',
      escalateTo: 'CEO',
      backupContact: 'Board Liaison',
      timeToEscalate: 30,
      notificationChannels: ['email', 'phone']
    },
    {
      id: deterministicId(seed, 3),
      triggerCondition: 'budget_exceeded',
      escalateTo: 'CFO',
      backupContact: 'Controller',
      timeToEscalate: 60,
      notificationChannels: ['email', 'slack']
    },
    {
      id: deterministicId(seed, 4),
      triggerCondition: 'executive_decision',
      escalateTo: 'CEO',
      backupContact: 'COO',
      timeToEscalate: 10,
      notificationChannels: ['phone', 'sms']
    }
  ];
}

export function generateStakeholders(domainId: number): Array<{
  role: string;
  userId?: string;
  responsibility: string;
  notificationChannels: string[];
  isBackup: boolean;
  backupFor?: string;
}> {
  const context = getContext(domainId);
  
  const primaryStakeholders = context.typicalStakeholders.slice(0, 4).map((role, idx) => ({
    role,
    responsibility: idx === 0 
      ? 'Executive sponsor and final decision authority' 
      : idx === 1 
      ? 'Operational lead for execution coordination'
      : idx === 2
      ? 'Subject matter expert and technical guidance'
      : 'Cross-functional coordination and communication',
    notificationChannels: idx === 0 ? ['phone', 'email', 'sms'] : ['email', 'slack', 'teams'],
    isBackup: false
  }));

  const backupStakeholders = [
    {
      role: 'Deputy ' + context.executiveRole,
      responsibility: 'Backup decision authority when primary unavailable',
      notificationChannels: ['email', 'phone'],
      isBackup: true,
      backupFor: context.executiveRole
    }
  ];

  return [...primaryStakeholders, ...backupStakeholders];
}

export function generateExecutionSteps(domainId: number, playbookName: string): Array<{
  id: string;
  order: number;
  title: string;
  description: string;
  ownerId?: string;
  timeTargetMinutes: number;
  isParallel: boolean;
  dependsOn: string[];
  approvalRequired: string;
  approvalNotes: string;
  deliverables: string;
}> {
  const context = getContext(domainId);
  const seed = `steps-${domainId}-${playbookName}`;
  const step1Id = deterministicId(seed, 1);
  const step2Id = deterministicId(seed, 2);
  const step3Id = deterministicId(seed, 3);
  const step4Id = deterministicId(seed, 4);
  const step5Id = deterministicId(seed, 5);
  
  return [
    {
      id: step1Id,
      order: 1,
      title: 'Initial Assessment & Situation Analysis',
      description: `Gather all available information about the ${playbookName.toLowerCase()} situation. Validate trigger data and confirm situation severity.`,
      timeTargetMinutes: 5,
      isParallel: false,
      dependsOn: [],
      approvalRequired: 'none',
      approvalNotes: '',
      deliverables: 'Situation assessment brief, severity confirmation, initial stakeholder list'
    },
    {
      id: step2Id,
      order: 2,
      title: 'Stakeholder Notification & Assembly',
      description: `Activate notification cascade for Tier 1 stakeholders. Establish secure communication channel. Schedule emergency briefing.`,
      timeTargetMinutes: 3,
      isParallel: true,
      dependsOn: [step1Id],
      approvalRequired: 'none',
      approvalNotes: '',
      deliverables: 'Notification confirmations, war room setup, communication channel established'
    },
    {
      id: step3Id,
      order: 3,
      title: 'Executive Briefing & Decision Framework',
      description: `Present situation analysis to ${context.executiveRole}. Review response options and resource requirements. Confirm response strategy.`,
      timeTargetMinutes: 10,
      isParallel: false,
      dependsOn: [step2Id],
      approvalRequired: 'c_suite',
      approvalNotes: `${context.executiveRole} must approve response strategy before proceeding`,
      deliverables: 'Approved response plan, resource authorization, communication approval'
    },
    {
      id: step4Id,
      order: 4,
      title: 'Response Execution & Coordination',
      description: `Execute approved response actions. Coordinate across functional teams. Monitor progress against timeline.`,
      timeTargetMinutes: 30,
      isParallel: true,
      dependsOn: [step3Id],
      approvalRequired: 'manager',
      approvalNotes: 'Functional leads approve team-specific actions',
      deliverables: 'Execution status updates, issue log, stakeholder communications'
    },
    {
      id: step5Id,
      order: 5,
      title: 'Situation Resolution & Documentation',
      description: `Confirm resolution criteria met. Document lessons learned. Update playbook based on experience.`,
      timeTargetMinutes: 15,
      isParallel: false,
      dependsOn: [step4Id],
      approvalRequired: 'director',
      approvalNotes: 'Resolution must be validated by responsible executive',
      deliverables: 'Resolution confirmation, lessons learned document, playbook updates'
    }
  ];
}

export function generateBudgetAllocations(domainId: number, baseBudget: number = 500000, playbookName: string = ''): Array<{
  id: string;
  category: string;
  amount: number;
  preApproved: boolean;
  approvalThreshold: number;
  notes: string;
}> {
  const seed = `budget-${domainId}-${playbookName}`;
  return [
    {
      id: deterministicId(seed, 1),
      category: 'personnel',
      amount: Math.round(baseBudget * 0.25),
      preApproved: true,
      approvalThreshold: baseBudget * 0.35,
      notes: 'Overtime, temporary staff, and contractor support'
    },
    {
      id: deterministicId(seed, 2),
      category: 'consulting',
      amount: Math.round(baseBudget * 0.30),
      preApproved: true,
      approvalThreshold: baseBudget * 0.40,
      notes: 'External advisors, crisis consultants, subject matter experts'
    },
    {
      id: deterministicId(seed, 3),
      category: 'legal',
      amount: Math.round(baseBudget * 0.20),
      preApproved: true,
      approvalThreshold: baseBudget * 0.30,
      notes: 'Outside counsel, regulatory filings, compliance support'
    },
    {
      id: deterministicId(seed, 4),
      category: 'technology',
      amount: Math.round(baseBudget * 0.10),
      preApproved: true,
      approvalThreshold: baseBudget * 0.15,
      notes: 'Emergency tools, system access, data analysis platforms'
    },
    {
      id: deterministicId(seed, 5),
      category: 'communications',
      amount: Math.round(baseBudget * 0.10),
      preApproved: true,
      approvalThreshold: baseBudget * 0.15,
      notes: 'PR agency retainer, media monitoring, stakeholder communications'
    },
    {
      id: deterministicId(seed, 6),
      category: 'contingency',
      amount: Math.round(baseBudget * 0.05),
      preApproved: false,
      approvalThreshold: baseBudget * 0.10,
      notes: 'Reserve for unforeseen requirements - requires CFO approval'
    }
  ];
}

export function generateBusinessImpacts(domainId: number, playbookName: string = ''): Array<{
  id: string;
  type: string;
  estimatedValue: number;
  valueUnit: string;
  description: string;
  measurementMethod: string;
}> {
  const context = getContext(domainId);
  const seed = `impact-${domainId}-${playbookName}`;
  
  return [
    {
      id: deterministicId(seed, 1),
      type: 'revenue_protection',
      estimatedValue: 2500000,
      valueUnit: 'USD',
      description: 'Revenue protected through rapid response and customer retention',
      measurementMethod: 'Compare actual vs. projected revenue loss without intervention'
    },
    {
      id: deterministicId(seed, 2),
      type: 'cost_avoidance',
      estimatedValue: 750000,
      valueUnit: 'USD',
      description: 'Costs avoided through proactive response vs. reactive crisis management',
      measurementMethod: 'Industry benchmark for similar incidents without playbook'
    },
    {
      id: deterministicId(seed, 3),
      type: 'time_savings',
      estimatedValue: 40,
      valueUnit: 'hours',
      description: 'Executive and team hours saved through pre-defined response protocols',
      measurementMethod: 'Compare actual response time vs. ad-hoc response baseline'
    },
    {
      id: deterministicId(seed, 4),
      type: 'risk_mitigation',
      estimatedValue: 5000000,
      valueUnit: 'USD',
      description: `Reduced exposure to ${context.riskFactors[0]} through structured response`,
      measurementMethod: 'Risk exposure calculation based on probability and impact reduction'
    }
  ];
}

export function generateComplianceRequirements(domainId: number, playbookName: string = ''): Array<{
  id: string;
  framework: string;
  requirement: string;
  notes: string;
}> {
  const context = getContext(domainId);
  const seed = `compliance-${domainId}-${playbookName}`;
  
  return context.complianceFrameworks.slice(0, 3).map((framework, idx) => ({
    id: deterministicId(seed, idx),
    framework,
    requirement: getComplianceRequirement(framework),
    notes: `Ensure all actions documented for ${framework.toUpperCase()} audit trail`
  }));
}

function getComplianceRequirement(framework: string): string {
  const requirements: Record<string, string> = {
    sox: 'Maintain audit trail of all financial decisions and approvals',
    gdpr: 'Document data processing activities and notify authorities within 72 hours if personal data affected',
    hipaa: 'Protect PHI and document breach notification procedures',
    pci_dss: 'Secure cardholder data and document incident response',
    ccpa: 'Honor consumer rights requests and document data handling',
    sec: 'Timely disclosure of material events to investors',
    ftc: 'Ensure consumer protection compliance in communications',
    iso27001: 'Follow information security incident management procedures',
    soc2: 'Document security incident response per SOC 2 controls',
    eu_ai_act: 'Document AI system decisions and human oversight procedures',
    nist_ai_rmf: 'Follow AI risk management framework guidelines',
    gaap: 'Ensure financial reporting accuracy and timeliness',
    hsr: 'Hart-Scott-Rodino filing requirements for transactions',
    cfius: 'Foreign investment review compliance',
    eeoc: 'Equal employment opportunity compliance',
    osha: 'Workplace safety incident reporting',
    ada: 'Accessibility accommodation requirements',
    fda: 'Product safety and labeling compliance'
  };
  return requirements[framework] || 'Follow applicable regulatory requirements';
}

export function generateDependencies(domainId: number, playbookName: string = ''): Array<{
  id: string;
  type: string;
  name: string;
  contactInfo: string;
  criticality: string;
  notes: string;
}> {
  const seed = `deps-${domainId}-${playbookName}`;
  return [
    {
      id: deterministicId(seed, 1),
      type: 'vendor',
      name: 'External Legal Counsel (Tier 1)',
      contactInfo: 'partner@lawfirm.com | 24/7 Hotline',
      criticality: 'critical',
      notes: 'Pre-negotiated retainer with 2-hour response SLA'
    },
    {
      id: deterministicId(seed, 2),
      type: 'vendor',
      name: 'PR & Communications Agency',
      contactInfo: 'crisis-team@pragency.com',
      criticality: 'high',
      notes: 'Activated within 1 hour for media-facing situations'
    },
    {
      id: deterministicId(seed, 3),
      type: 'internal_team',
      name: 'IT Security Operations Center',
      contactInfo: 'soc@company.com | Extension 911',
      criticality: 'critical',
      notes: '24/7 monitoring and immediate escalation capability'
    },
    {
      id: deterministicId(seed, 4),
      type: 'regulatory',
      name: 'Primary Regulatory Contact',
      contactInfo: 'Filed with compliance office',
      criticality: 'high',
      notes: 'Pre-established relationship for expedited communications'
    }
  ];
}

export function generateFullPlaybookData(
  domainId: number,
  playbookName: string,
  baseBudget: number = 500000
) {
  return {
    triggerConditions: generateTriggerConditions(domainId, playbookName),
    escalationPaths: generateEscalationPaths(domainId, playbookName),
    stakeholders: generateStakeholders(domainId),
    executionSteps: generateExecutionSteps(domainId, playbookName),
    budgetAllocations: generateBudgetAllocations(domainId, baseBudget, playbookName),
    businessImpacts: generateBusinessImpacts(domainId, playbookName),
    complianceRequirements: generateComplianceRequirements(domainId, playbookName),
    dependencies: generateDependencies(domainId, playbookName),
    successMetrics: {
      responseTimeTarget: 12,
      stakeholdersTarget: 5,
      customMetrics: [
        { name: 'Situation contained', target: 'Within 4 hours' },
        { name: 'Stakeholder satisfaction', target: '>90%' },
        { name: 'Post-incident review', target: 'Within 48 hours' }
      ]
    },
    complianceFrameworks: DOMAIN_CONTEXTS[domainId]?.complianceFrameworks || ['sox'],
    legalReviewStatus: 'approved',
    legalReviewApprover: 'General Counsel',
    legalReviewDate: new Date().toISOString().split('T')[0],
    auditTrailRequired: true,
    riskScore: 7,
    maxFinancialExposure: baseBudget * 10,
    reputationalRiskLevel: 'high',
    riskNotes: `Key risks include ${DOMAIN_CONTEXTS[domainId]?.riskFactors.join(', ') || 'operational disruption'}`,
    pressResponseRequired: domainId === 7 || domainId === 1,
    investorNotificationRequired: domainId === 3 || domainId === 8,
    investorNotificationThreshold: '$5M impact or material event',
    boardNotificationRequired: true,
    boardNotificationThreshold: '$10M impact or significant reputation risk',
    preApprovedMessaging: 'Use approved holding statement. All external communications require CMO approval.',
    playbookOwner: DOMAIN_CONTEXTS[domainId]?.executiveRole || 'CEO',
    playbookOwnerEmail: `${(DOMAIN_CONTEXTS[domainId]?.executiveRole || 'ceo').toLowerCase()}@company.com`,
    nextReviewDate: getNextQuarterDate(),
    reviewFrequency: 'quarterly',
    versionNotes: 'Initial template with smart defaults based on industry best practices',
    changeApprovalRequired: true,
    geographicScope: ['global', 'north_america', 'europe'],
    primaryTimezone: 'America/New_York',
    localRegulations: 'Ensure compliance with local jurisdiction requirements',
    lastDrillDate: getPastDrillDate(),
    nextDrillDate: getNextDrillDate(),
    drillFrequency: 'quarterly',
    trainingRequirements: 'Annual playbook review and tabletop exercise participation',
    certificationRequirements: 'Crisis management certification for Tier 1 stakeholders'
  };
}

function getNextQuarterDate(): string {
  const now = new Date();
  const quarter = Math.floor(now.getMonth() / 3);
  const nextQuarter = new Date(now.getFullYear(), (quarter + 1) * 3 + 1, 1);
  return nextQuarter.toISOString().split('T')[0];
}

function getPastDrillDate(): string {
  const now = new Date();
  now.setMonth(now.getMonth() - 2);
  return now.toISOString().split('T')[0];
}

function getNextDrillDate(): string {
  const now = new Date();
  now.setMonth(now.getMonth() + 1);
  return now.toISOString().split('T')[0];
}
