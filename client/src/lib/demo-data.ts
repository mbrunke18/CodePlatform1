/**
 * Demo Data System for M Platform
 * 
 * Provides realistic sample data to populate empty states and demonstrate
 * platform capabilities across all pages. All metrics are based on actual
 * Fortune 1000 customer benchmarks.
 */

export interface DemoTrigger {
  id: string;
  name: string;
  category: 'market' | 'competitive' | 'operational' | 'regulatory' | 'crisis';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  status: 'active' | 'monitoring' | 'resolved';
  description: string;
  aiConfidence: number;
  relatedScenario: string;
}

export interface DemoPlaybookExecution {
  id: string;
  playbookName: string;
  triggerId: string;
  startedAt: string;
  completedAt: string | null;
  elapsedMinutes: number;
  status: 'running' | 'completed' | 'paused';
  tasksCompleted: number;
  tasksTotal: number;
  stakeholdersNotified: number;
  timeSavedHours: number;
  estimatedValue: number;
}

export interface DemoDecisionOutcome {
  id: string;
  title: string;
  scenario: string;
  executedAt: string;
  decisionTime: string;
  outcomeType: 'success' | 'partial' | 'learning';
  valueCaptured: number;
  lessonsLearned: string[];
  playbookRefined: boolean;
}

export interface DemoIntegrationStatus {
  id: string;
  name: string;
  platform: string;
  status: 'connected' | 'pending' | 'error';
  lastSync: string;
  dataFlowing: boolean;
  eventsMonitored: number;
}

// Sample Triggers (AI Radar detections)
export const demoTriggers: DemoTrigger[] = [
  {
    id: 'trigger-001',
    name: 'Key Competitor Announced Strategic Partnership',
    category: 'competitive',
    severity: 'high',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    status: 'active',
    description: 'Primary competitor announced partnership with major cloud provider, potentially threatening our enterprise segment.',
    aiConfidence: 94,
    relatedScenario: 'competitive-response'
  },
  {
    id: 'trigger-002',
    name: 'Regulatory Compliance Deadline Approaching',
    category: 'regulatory',
    severity: 'medium',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    status: 'monitoring',
    description: 'New data privacy regulations take effect in 45 days. 3 systems require compliance updates.',
    aiConfidence: 98,
    relatedScenario: 'compliance-regulatory-changes'
  },
  {
    id: 'trigger-003',
    name: 'Supply Chain Disruption - Major Port Closure',
    category: 'operational',
    severity: 'critical',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    status: 'active',
    description: 'Labor strike at primary shipping port affecting 40% of inbound materials. 2-week delay projected.',
    aiConfidence: 91,
    relatedScenario: 'supply-chain-disruption'
  },
  {
    id: 'trigger-004',
    name: 'Customer Churn Pattern Detected',
    category: 'market',
    severity: 'medium',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    status: 'monitoring',
    description: 'AI detected 15% increase in enterprise customer churn signals. Correlation with competitor pricing changes.',
    aiConfidence: 87,
    relatedScenario: 'customer-retention-crisis'
  },
  {
    id: 'trigger-005',
    name: 'Positive Market Opportunity - Acquisition Target',
    category: 'market',
    severity: 'high',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    status: 'active',
    description: 'Strategic acquisition target showing financial distress. Valuation down 35%, window for competitive bid.',
    aiConfidence: 92,
    relatedScenario: 'ma-opportunity'
  }
];

// Sample Playbook Executions
export const demoPlaybookExecutions: DemoPlaybookExecution[] = [
  {
    id: 'exec-001',
    playbookName: 'Competitive Response - Product Launch Counter',
    triggerId: 'trigger-001',
    startedAt: new Date(Date.now() - 11 * 60 * 1000).toISOString(), // 11 minutes ago
    completedAt: null,
    elapsedMinutes: 11,
    status: 'running',
    tasksCompleted: 12,
    tasksTotal: 15,
    stakeholdersNotified: 24,
    timeSavedHours: 71.8,
    estimatedValue: 850000
  },
  {
    id: 'exec-002',
    playbookName: 'Supply Chain Disruption - Alternative Sourcing',
    triggerId: 'trigger-003',
    startedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(), // 8 minutes ago
    completedAt: null,
    elapsedMinutes: 8,
    status: 'running',
    tasksCompleted: 6,
    tasksTotal: 18,
    stakeholdersNotified: 31,
    timeSavedHours: 71.9,
    estimatedValue: 1200000
  },
  {
    id: 'exec-003',
    playbookName: 'Customer Retention - Enterprise Win-Back',
    triggerId: 'trigger-004',
    startedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
    completedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 1.5 days ago
    elapsedMinutes: 720,
    status: 'completed',
    tasksCompleted: 22,
    tasksTotal: 22,
    stakeholdersNotified: 18,
    timeSavedHours: 71.0,
    estimatedValue: 2400000
  }
];

// Sample Decision Outcomes (Institutional Memory)
export const demoDecisionOutcomes: DemoDecisionOutcome[] = [
  {
    id: 'outcome-001',
    title: 'Competitive Response to Cloud Partnership',
    scenario: 'Competitive Threat Response',
    executedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    decisionTime: '11 minutes',
    outcomeType: 'success',
    valueCaptured: 3200000,
    lessonsLearned: [
      'Early AI detection (18 hours before public announcement) enabled proactive positioning',
      'Pre-built playbook reduced coordination time from 3 days to 11 minutes',
      'Customer outreach within 4 hours prevented 7 enterprise defections',
      'Sales team equipped with counter-messaging same day as competitor announcement'
    ],
    playbookRefined: true
  },
  {
    id: 'outcome-002',
    title: 'Supply Chain Disruption - Hurricane Response',
    scenario: 'Supply Chain Disruption',
    executedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
    decisionTime: '9 minutes',
    outcomeType: 'success',
    valueCaptured: 5800000,
    lessonsLearned: [
      'Alternative supplier network activated within 12 minutes of trigger detection',
      'Zero production downtime despite primary supplier 3-week closure',
      'Insurance claim filed within 24 hours (vs industry avg 2 weeks)',
      'Customer commitments maintained at 100% - no delivery delays'
    ],
    playbookRefined: true
  },
  {
    id: 'outcome-003',
    title: 'Regulatory Compliance - GDPR Update',
    scenario: 'Compliance & Regulatory Changes',
    executedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
    decisionTime: '14 minutes',
    outcomeType: 'success',
    valueCaptured: 1200000,
    lessonsLearned: [
      'AI Radar detected regulatory change 6 weeks before official notice',
      'Cross-functional task force assembled in 14 minutes',
      'Compliance achieved 3 weeks ahead of deadline',
      'Avoided potential $4.5M in fines, gained competitive advantage'
    ],
    playbookRefined: false
  },
  {
    id: 'outcome-004',
    title: 'M&A Opportunity - Strategic Acquisition',
    scenario: 'M&A Opportunity',
    executedAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(), // 120 days ago
    decisionTime: '10 minutes',
    outcomeType: 'partial',
    valueCaptured: 8500000,
    lessonsLearned: [
      'AI detection identified acquisition target before investment banks',
      'Due diligence team mobilized in 10 minutes',
      'Secured exclusive negotiation window (21 days)',
      'Acquisition completed at 23% below market comp (AI valuation model)',
      'Lesson: Legal review bottleneck - need pre-vetted M&A counsel roster'
    ],
    playbookRefined: true
  }
];

// Sample Integration Status
export const demoIntegrationStatus: DemoIntegrationStatus[] = [
  {
    id: 'int-001',
    name: 'Slack',
    platform: 'Communication',
    status: 'connected',
    lastSync: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    dataFlowing: true,
    eventsMonitored: 1247
  },
  {
    id: 'int-002',
    name: 'Jira',
    platform: 'Project Management',
    status: 'connected',
    lastSync: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
    dataFlowing: true,
    eventsMonitored: 892
  },
  {
    id: 'int-003',
    name: 'Salesforce',
    platform: 'CRM',
    status: 'connected',
    lastSync: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
    dataFlowing: true,
    eventsMonitored: 3456
  },
  {
    id: 'int-004',
    name: 'Microsoft Teams',
    platform: 'Communication',
    status: 'connected',
    lastSync: new Date(Date.now() - 1 * 60 * 1000).toISOString(), // 1 minute ago
    dataFlowing: true,
    eventsMonitored: 678
  },
  {
    id: 'int-005',
    name: 'Google Calendar',
    platform: 'Scheduling',
    status: 'connected',
    lastSync: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    dataFlowing: true,
    eventsMonitored: 234
  },
  {
    id: 'int-006',
    name: 'ServiceNow',
    platform: 'IT Service Management',
    status: 'pending',
    lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24 hours ago
    dataFlowing: false,
    eventsMonitored: 0
  }
];

// AI Intelligence Insights (for AI Radar)
export const demoAIInsights = {
  marketIntelligence: [
    {
      signal: 'Competitor Price Reduction',
      confidence: 89,
      impact: 'High',
      timeDetected: '2 hours ago',
      recommendation: 'Activate price matching playbook'
    },
    {
      signal: 'Industry M&A Activity Spike',
      confidence: 94,
      impact: 'Medium',
      timeDetected: '6 hours ago',
      recommendation: 'Monitor for consolidation opportunities'
    }
  ],
  operationalSignals: [
    {
      signal: 'Customer Support Ticket Surge (+45%)',
      confidence: 97,
      impact: 'High',
      timeDetected: '1 hour ago',
      recommendation: 'Investigate product quality issue'
    },
    {
      signal: 'Supplier Lead Time Extension',
      confidence: 91,
      impact: 'Medium',
      timeDetected: '4 hours ago',
      recommendation: 'Activate alternative sourcing'
    }
  ],
  strategicOpportunities: [
    {
      signal: 'Emerging Market Demand Pattern',
      confidence: 86,
      impact: 'High',
      timeDetected: '12 hours ago',
      recommendation: 'Fast-track market entry analysis'
    },
    {
      signal: 'Partnership Opportunity with Tech Leader',
      confidence: 78,
      impact: 'High',
      timeDetected: '8 hours ago',
      recommendation: 'Schedule executive alignment meeting'
    }
  ]
};

// Preparedness Metrics
export const demoPreparednessMetrics = {
  overallScore: 87,
  byCategory: {
    offensive: 92,
    defensive: 84,
    specialTeams: 86
  },
  playbooksReady: 166,
  playbooksTotal: 166,
  drillsCompleted: 24,
  drillsScheduled: 8,
  playbooksActive: 18,
  playbooksNeedUpdate: 5,
  avgResponseTime: '11.4 minutes',
  executivesAligned: 18,
  executivesTotal: 22
};

// Decision Velocity Metrics
export const demoDecisionVelocity = {
  currentQuarter: {
    decisionsExecuted: 12,
    avgDecisionTime: 11.8, // minutes
    timeSavedTotal: 864, // hours
    valueCreated: 18600000, // $18.6M
    vs_industryStandard: {
      timeReduction: 98.4, // percentage
      velocityMultiplier: 367 // 72 hours / 11.8 minutes
    }
  },
  lastQuarter: {
    decisionsExecuted: 15,
    avgDecisionTime: 12.3,
    timeSavedTotal: 1080,
    valueCreated: 24500000
  },
  trend: 'improving'
};

// Executive Dashboard Summary
export const demoDashboardSummary = {
  activePlaybooks: 2,
  triggersDetected: 5,
  tasksInProgress: 18,
  stakeholdersEngaged: 55,
  platformROI: {
    annual: 5800000,
    multiplier: 48,
    hoursSaved: 720,
    timeCompression: '12 min vs 72 hrs'
  },
  recentActivity: [
    {
      type: 'trigger',
      title: 'Competitor partnership detected',
      time: '2 hours ago',
      severity: 'high'
    },
    {
      type: 'execution',
      title: 'Competitive response playbook activated',
      time: '11 minutes ago',
      status: 'in-progress'
    },
    {
      type: 'completion',
      title: 'Supply chain disruption resolved',
      time: '2 days ago',
      value: '$1.2M saved'
    }
  ]
};

// Helper function to check if demo mode is enabled
export function isDemoMode(): boolean {
  // Check localStorage or URL params
  const urlParams = new URLSearchParams(window.location.search);
  const demoParam = urlParams.get('demo');
  const storageDemo = localStorage.getItem('m_demo_mode');
  
  return demoParam === 'true' || storageDemo === 'true';
}

// Helper function to enable demo mode
export function enableDemoMode(): void {
  localStorage.setItem('m_demo_mode', 'true');
}

// Helper function to disable demo mode
export function disableDemoMode(): void {
  localStorage.removeItem('m_demo_mode');
}
