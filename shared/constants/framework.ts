// ============================================================================
// M PLATFORM - IDEA FRAMEWORK CONSTANTS
// Centralized definitions for the 4-phase IDEA Framework and 9 Strategic Domains
// ============================================================================

// ----- IDEA FRAMEWORK PHASE DEFINITIONS -----

export const IDEA_PHASES = {
  IDENTIFY: {
    id: 'identify',
    name: 'IDENTIFY',
    subtitle: 'Build Your Playbook Library',
    description: 'Map your operating model to execution playbooks. Pre-stage responses across 9 strategic domains. Know who does what before anything happens.',
    icon: 'ClipboardList',
    color: '#3B82F6',
    bgColor: 'bg-blue-500',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-500',
    lightBg: 'bg-blue-50 dark:bg-blue-950/30',
    capabilities: [
      'Operating Model Alignment diagnostic',
      '166 pre-built playbooks ready to deploy',
      'Stakeholder accountability mapping',
      'Readiness scoring and gap analysis'
    ],
    metrics: {
      primary: 'Playbooks Staged',
      secondary: 'Stakeholders Mapped',
      target: '100% coverage across 9 domains'
    }
  },
  DETECT: {
    id: 'detect',
    name: 'DETECT',
    subtitle: 'Monitor Signals',
    description: 'AI-powered monitoring spots signals early. Real-time triggers across market, competitive, and regulatory landscapes. Intelligence reports, not surprises.',
    icon: 'Radar',
    color: '#10B981',
    bgColor: 'bg-emerald-500',
    textColor: 'text-emerald-600',
    borderColor: 'border-emerald-500',
    lightBg: 'bg-emerald-50 dark:bg-emerald-950/30',
    capabilities: [
      'AI pattern recognition across 10,000+ scenarios',
      'Competitive intelligence monitoring',
      'Early warning trigger system',
      'Market signal aggregation'
    ],
    metrics: {
      primary: 'Signals Detected',
      secondary: 'Avg Detection Lead Time',
      target: '< 5 min from signal to alert'
    }
  },
  EXECUTE: {
    id: 'execute',
    name: 'EXECUTE',
    subtitle: 'Coordinate Response',
    description: 'Coordinated action in 12 minutes vs. 72-hour industry average. Everyone aligned, nothing lost in translation.',
    icon: 'Play',
    color: '#F59E0B',
    bgColor: 'bg-amber-500',
    textColor: 'text-amber-600',
    borderColor: 'border-amber-500',
    lightBg: 'bg-amber-50 dark:bg-amber-950/30',
    capabilities: [
      'Automated stakeholder routing',
      'Real-time execution tracking',
      'Rapid Response mode for urgent scenarios',
      'Mid-execution adjustments and pivots'
    ],
    metrics: {
      primary: 'Avg Response Time',
      secondary: 'Stakeholder Alignment Rate',
      target: '12 min coordination start'
    }
  },
  ADVANCE: {
    id: 'advance',
    name: 'ADVANCE',
    subtitle: 'Capture Learning',
    description: 'Every execution makes you stronger. Automated retrospectives capture what worked. Institutional knowledge compounds, not walks out the door.',
    icon: 'TrendingUp',
    color: '#8B5CF6',
    bgColor: 'bg-purple-500',
    textColor: 'text-purple-600',
    borderColor: 'border-purple-500',
    lightBg: 'bg-purple-50 dark:bg-purple-950/30',
    capabilities: [
      'Post-action analysis and debrief',
      'Playbook refinement recommendations',
      'Performance benchmarking',
      'Institutional learning capture'
    ],
    metrics: {
      primary: 'Lessons Captured',
      secondary: 'Playbook Improvements',
      target: 'Continuous improvement loop'
    }
  }
} as const;

export const IDEA_PHASES_ARRAY = Object.values(IDEA_PHASES);
export type IdeaPhaseId = keyof typeof IDEA_PHASES;
export type IdeaPhase = typeof IDEA_PHASES[IdeaPhaseId];

// ----- 9 STRATEGIC DOMAINS -----

export const STRATEGIC_DOMAINS = {
  // OFFENSE DOMAINS (Seize Opportunities)
  MARKET_ENTRY: {
    id: 'market-entry',
    name: 'Market Entry',
    category: 'offense',
    description: 'New market expansion, geographic entry, and segment penetration strategies',
    icon: 'Globe',
    color: '#10B981',
    playbookCount: 18,
    examples: ['Geographic expansion', 'New segment entry', 'Partnership launch', 'Channel expansion']
  },
  MERGERS_ACQUISITIONS: {
    id: 'mergers-acquisitions',
    name: 'M&A Integration',
    category: 'offense',
    description: 'Merger execution, acquisition integration, and deal management',
    icon: 'GitMerge',
    color: '#06B6D4',
    playbookCount: 22,
    examples: ['Due diligence coordination', 'Day 1 integration', 'Synergy capture', 'Culture integration']
  },
  PRODUCT_LAUNCH: {
    id: 'product-launch',
    name: 'Product Launch',
    category: 'offense',
    description: 'New product introduction, feature rollouts, and go-to-market execution',
    icon: 'Rocket',
    color: '#8B5CF6',
    playbookCount: 18,
    examples: ['Product announcement', 'Feature release', 'Beta program', 'Global rollout']
  },

  // DEFENSE DOMAINS (Protect Value)
  CRISIS_RESPONSE: {
    id: 'crisis-response',
    name: 'Crisis Response',
    category: 'defense',
    description: 'Rapid response to unexpected events threatening operations or reputation',
    icon: 'AlertTriangle',
    color: '#EF4444',
    playbookCount: 22,
    examples: ['Executive crisis', 'Operational disruption', 'Natural disaster', 'Reputational threat']
  },
  CYBER_INCIDENTS: {
    id: 'cyber-incidents',
    name: 'Cyber Security',
    category: 'defense',
    description: 'Detection and response to cybersecurity threats and vulnerabilities',
    icon: 'Shield',
    color: '#F59E0B',
    playbookCount: 16,
    examples: ['Ransomware attack', 'Data breach', 'Phishing incident', 'System compromise']
  },
  REGULATORY_COMPLIANCE: {
    id: 'regulatory-compliance',
    name: 'Regulatory & Compliance',
    category: 'defense',
    description: 'Regulatory changes, compliance requirements, and audit responses',
    icon: 'Scale',
    color: '#6366F1',
    playbookCount: 18,
    examples: ['Regulatory change', 'Audit response', 'Policy violation', 'License renewal']
  },

  // SPECIAL TEAMS DOMAINS (Change the Game)
  DIGITAL_TRANSFORMATION: {
    id: 'digital-transformation',
    name: 'Digital Transformation',
    category: 'special_teams',
    description: 'Technology modernization, digital initiatives, and organizational change',
    icon: 'Cpu',
    color: '#EC4899',
    playbookCount: 16,
    examples: ['System migration', 'Process automation', 'Cloud adoption', 'Digital workplace']
  },
  COMPETITIVE_RESPONSE: {
    id: 'competitive-response',
    name: 'Competitive Response',
    category: 'special_teams',
    description: 'Rapid response to competitive moves and market disruption',
    icon: 'Target',
    color: '#14B8A6',
    playbookCount: 18,
    examples: ['Competitor product launch', 'Price war response', 'Talent poaching', 'Market disruption']
  },
  AI_GOVERNANCE: {
    id: 'ai-governance',
    name: 'AI Governance',
    category: 'special_teams',
    description: 'AI deployment, ethics, governance, and responsible innovation',
    icon: 'Brain',
    color: '#A855F7',
    playbookCount: 18,
    examples: ['AI model deployment', 'Bias incident', 'Vendor AI assessment', 'AI ethics review']
  }
} as const;

export const STRATEGIC_DOMAINS_ARRAY = Object.values(STRATEGIC_DOMAINS);
export type StrategicDomainId = keyof typeof STRATEGIC_DOMAINS;
export type StrategicDomain = typeof STRATEGIC_DOMAINS[StrategicDomainId];

// Domains grouped by category
export const OFFENSE_DOMAINS = STRATEGIC_DOMAINS_ARRAY.filter(d => d.category === 'offense');
export const DEFENSE_DOMAINS = STRATEGIC_DOMAINS_ARRAY.filter(d => d.category === 'defense');
export const SPECIAL_TEAMS_DOMAINS = STRATEGIC_DOMAINS_ARRAY.filter(d => d.category === 'special_teams');

// ----- STRATEGIC CATEGORIES -----

export const STRATEGIC_CATEGORIES = {
  OFFENSE: {
    id: 'offense',
    name: 'Offense',
    description: 'Seize opportunities and drive growth',
    icon: 'TrendingUp',
    color: '#10B981',
    playbookCount: 58,
    domains: OFFENSE_DOMAINS
  },
  DEFENSE: {
    id: 'defense',
    name: 'Defense',
    description: 'Protect value and mitigate risks',
    icon: 'Shield',
    color: '#EF4444',
    playbookCount: 56,
    domains: DEFENSE_DOMAINS
  },
  SPECIAL_TEAMS: {
    id: 'special_teams',
    name: 'Special Teams',
    description: 'Transform and change the game',
    icon: 'Zap',
    color: '#8B5CF6',
    playbookCount: 52,
    domains: SPECIAL_TEAMS_DOMAINS
  }
} as const;

export const STRATEGIC_CATEGORIES_ARRAY = Object.values(STRATEGIC_CATEGORIES);

// ----- EXECUTION TIMING BENCHMARKS -----

export const TIMING_BENCHMARKS = {
  M_PLATFORM: {
    decisionTime: 12,
    decisionUnit: 'minutes',
    executionTime: 90,
    executionUnit: 'minutes',
    description: 'M Platform enables 12-minute decision start and 90-minute full execution'
  },
  INDUSTRY_AVERAGE: {
    decisionTime: 72,
    decisionUnit: 'hours',
    executionTime: 17,
    executionUnit: 'days',
    description: 'Industry average is 72 hours to start coordinating, 17 days to fully execute'
  },
  SPEED_MULTIPLIER: 340,
  VALUE_PROPOSITION: 'From 17 days to 90 minutes'
} as const;

// ----- STAKEHOLDER ROLES -----

export const STAKEHOLDER_ROLES = [
  'CEO', 'COO', 'CFO', 'CLO', 'CTO', 'CISO', 'CMO', 'CHRO',
  'General Counsel', 'VP Operations', 'VP Strategy', 'VP Communications',
  'Director of Risk', 'Director of Compliance', 'Project Manager',
  'Legal Counsel', 'HR Director', 'IT Director', 'Security Lead',
  'Board Liaison', 'External Counsel', 'PR Agency Lead', 'Crisis Consultant'
] as const;

export const RACI_ROLES = ['responsible', 'accountable', 'consulted', 'informed'] as const;

// ----- NOTIFICATION CHANNELS -----

export const NOTIFICATION_CHANNELS = [
  { id: 'email', name: 'Email', icon: 'Mail' },
  { id: 'slack', name: 'Slack', icon: 'MessageSquare' },
  { id: 'teams', name: 'Microsoft Teams', icon: 'Users' },
  { id: 'sms', name: 'SMS', icon: 'Phone' },
  { id: 'in_app', name: 'In-App', icon: 'Bell' }
] as const;

// ----- PRIORITY LEVELS -----

export const PRIORITY_LEVELS = [
  { id: 'critical', name: 'Critical', color: '#EF4444', description: 'Immediate executive attention required' },
  { id: 'high', name: 'High', color: '#F59E0B', description: 'Urgent response within hours' },
  { id: 'medium', name: 'Medium', color: '#3B82F6', description: 'Standard response timeline' },
  { id: 'low', name: 'Low', color: '#6B7280', description: 'Monitor and address as capacity allows' }
] as const;

// ----- TRIGGER SOURCES -----

export const TRIGGER_SOURCES = [
  { id: 'manual', name: 'Manual Activation', description: 'Executive-initiated' },
  { id: 'system', name: 'System Detection', description: 'AI pattern match' },
  { id: 'integration', name: 'Integration Alert', description: 'External system webhook' },
  { id: 'market_data', name: 'Market Data Signal', description: 'Financial/market indicator' },
  { id: 'news', name: 'News Monitoring', description: 'Media mention or coverage' },
  { id: 'competitive_intelligence', name: 'Competitive Intel', description: 'Competitor action detected' },
  { id: 'regulatory', name: 'Regulatory Filing', description: 'Regulatory body notification' },
  { id: 'financial', name: 'Financial Threshold', description: 'Budget or revenue trigger' }
] as const;

// ----- AI GOVERNANCE PRINCIPLES -----

export const AI_GOVERNANCE_PRINCIPLES = [
  { id: 'transparency', name: 'Transparency', description: 'Clear communication about AI use and limitations' },
  { id: 'accountability', name: 'Accountability', description: 'Clear ownership and responsibility chains' },
  { id: 'fairness', name: 'Fairness', description: 'Bias detection and mitigation practices' },
  { id: 'privacy', name: 'Privacy', description: 'Data protection and consent management' },
  { id: 'security', name: 'Security', description: 'Robust security controls for AI systems' },
  { id: 'human_oversight', name: 'Human Oversight', description: 'Human-in-the-loop for critical decisions' },
  { id: 'reliability', name: 'Reliability', description: 'Consistent and predictable AI behavior' },
  { id: 'sustainability', name: 'Sustainability', description: 'Environmental and resource considerations' },
  { id: 'compliance', name: 'Compliance', description: 'Adherence to applicable regulations' }
] as const;
