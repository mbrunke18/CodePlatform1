/**
 * Luxury Crisis Demo Data
 * Comprehensive scenario data for "The China Luxury Collapse" interactive demo
 */

export interface DemoOrganization {
  id: string;
  name: string;
  industry: string;
  marketCap: string;
  employees: number;
  regions: number;
  brands: number;
}

export interface DemoStakeholder {
  id: string;
  name: string;
  role: string;
  tier: 1 | 2 | 3;
  department: string;
  notificationTime: number; // seconds from T+0
}

export interface DemoTimelineEvent {
  time: number; // seconds from T+0
  label: string;
  description: string;
  icon: 'alert' | 'user' | 'check' | 'dollar' | 'send' | 'phone';
  stakeholderCount?: number;
}

export interface DemoROIMetric {
  scenario: 'traditional' | 'vexor';
  coordinationTime: string;
  valuePreserved: number;
  valueLost: number;
  competitorAdvantage: number;
  executionSpeed: string;
}

// Demo Organization: LVMH-style luxury conglomerate
export const luxuryOrg: DemoOrganization = {
  id: 'lvmh-demo',
  name: 'LVMH Maisons Group',
  industry: 'Luxury Goods & Fashion',
  marketCap: '€400B',
  employees: 200000,
  regions: 12,
  brands: 75
};

// Crisis Scenario Data
export const crisisScenario = {
  title: 'The China Luxury Collapse',
  subtitle: 'When $280M hangs on 12 minutes of coordination',
  triggerEvent: 'China luxury spending contracts 40% in one quarter',
  impactArea: 'Asia-Pacific Revenue',
  playbookActivated: '#044 - Revenue Shortfall',
  financialImpact: '$280M',
  timeWindow: '12 minutes',
  stakeholdersInvolved: 193,
  
  // The crisis narrative
  narrative: {
    detection: 'AI monitoring detects sudden 40% drop in China luxury spending across all categories. Pattern matches 2022 economic policy shift. Confidence score climbing rapidly.',
    decision: 'CEO receives mobile alert. Playbook #044 (Revenue Shortfall - Asia Pacific) is auto-recommended with pre-filled stakeholders, budgets, and communications.',
    coordination: 'Single tap activates playbook. Within 12 minutes, 193 stakeholders across 12 countries are coordinated, $50M in budgets reallocated, and supply chain pivoted.',
    outcome: '$280M in inventory optimized, hedging positions secured, competitor response delayed by 72 hours. Crisis turned into strategic advantage.'
  }
};

// Demo Stakeholders (Tier-based structure)
export const demoStakeholders: DemoStakeholder[] = [
  // Tier 1: Decision Makers (8 executives)
  { id: 's1', name: 'Bernard Arnault', role: 'Group CEO', tier: 1, department: 'Executive', notificationTime: 1 },
  { id: 's2', name: 'Jean-Jacques Guiony', role: 'Group CFO', tier: 1, department: 'Finance', notificationTime: 1 },
  { id: 's3', name: 'Pietro Beccari', role: 'Group COO', tier: 1, department: 'Operations', notificationTime: 1 },
  { id: 's4', name: 'Michael Burke', role: 'Regional CEO - Asia Pacific', tier: 1, department: 'Regional', notificationTime: 1 },
  { id: 's5', name: 'Delphine Arnault', role: 'CEO - Fashion Group', tier: 1, department: 'Division', notificationTime: 1 },
  { id: 's6', name: 'Catherine Rénier', role: 'CEO - Watches & Jewelry', tier: 1, department: 'Division', notificationTime: 1 },
  { id: 's7', name: 'Chris de Lapuente', role: 'CEO - Selective Retailing', tier: 1, department: 'Division', notificationTime: 1 },
  { id: 's8', name: 'Legal Counsel', role: 'Chief Legal Officer', tier: 1, department: 'Legal', notificationTime: 1 },
  
  // Tier 2: Execution Team (35 people)
  { id: 's9', name: 'Supply Chain VP', role: 'VP Supply Chain', tier: 2, department: 'Operations', notificationTime: 4 },
  { id: 's10', name: 'Category President - Leather Goods', role: 'President', tier: 2, department: 'Product', notificationTime: 4 },
  { id: 's11', name: 'Category President - Watches', role: 'President', tier: 2, department: 'Product', notificationTime: 4 },
  { id: 's12', name: 'Finance Director - APAC', role: 'Finance Director', tier: 2, department: 'Finance', notificationTime: 4 },
  { id: 's13', name: 'Investor Relations Director', role: 'IR Director', tier: 2, department: 'Finance', notificationTime: 4 },
  
  // Tier 3: Notification Group (150 people - represented by count)
  { id: 's14', name: 'Country Managers (12)', role: 'Country Manager', tier: 3, department: 'Regional', notificationTime: 10 },
  { id: 's15', name: 'Store Directors (85)', role: 'Store Director', tier: 3, department: 'Retail', notificationTime: 10 },
  { id: 's16', name: 'Regional Marketing (23)', role: 'Marketing Director', tier: 3, department: 'Marketing', notificationTime: 10 },
  { id: 's17', name: 'Retail Operations (30)', role: 'Operations Manager', tier: 3, department: 'Operations', notificationTime: 10 },
];

// The 12-Minute Timeline
export const twelveMinuteTimeline: DemoTimelineEvent[] = [
  { time: 0, label: 'T+0:00', description: 'AI Trigger #044 fires - China revenue drop detected', icon: 'alert' },
  { time: 1, label: 'T+0:01', description: 'Mobile alerts sent to CEO, CFO, COO', icon: 'send', stakeholderCount: 3 },
  { time: 2, label: 'T+0:02', description: 'Playbook #044 auto-loaded with pre-filled data', icon: 'check' },
  { time: 3, label: 'T+0:03', description: 'CEO approves activation from mobile (single tap)', icon: 'user' },
  { time: 4, label: 'T+0:04', description: 'Tier 1 stakeholders notified (8 executives)', icon: 'send', stakeholderCount: 8 },
  { time: 6, label: 'T+0:06', description: 'Emergency video conference auto-scheduled', icon: 'phone' },
  { time: 8, label: 'T+0:08', description: 'Pre-drafted Board memo sent for review', icon: 'send' },
  { time: 9, label: 'T+0:09', description: '$50M emergency budget authority activated', icon: 'dollar' },
  { time: 10, label: 'T+0:10', description: 'Tier 2 tasks distributed (35 people)', icon: 'send', stakeholderCount: 35 },
  { time: 11, label: 'T+0:11', description: 'Supplier notifications sent (12 factories)', icon: 'send', stakeholderCount: 12 },
  { time: 12, label: 'T+0:12', description: '✓ Coordination Complete - 193 stakeholders aligned', icon: 'check', stakeholderCount: 193 },
];

// ROI Comparison Data
export const roiComparisonData = {
  traditional: {
    title: "Traditional Coordination",
    timeline: "72 Hours",
    outcome: "€280M Market Cap Erosion",
    approach: "Manual email chains, sequential calls across time zones, waiting for approvals while competitors capture market share",
    points: [
      "Day 1: China sales data noticed in morning meeting → analysis requested → report scheduled for next week",
      "Day 2: CFO reviews numbers, requests more data → Marketing preparing response → Supply chain uninformed",
      "Day 3: Emergency Monday morning meeting scheduled → Board memo in draft → Investors calling",
      "Week 2: Finally activate response → Suppliers receive adjustments → But competitors already moved",
      "Lost Time: 72 hours while Hermès, Chanel captured China customer shift worth €280M in annual revenue",
      "Brand Impact: Late response signals operational weakness → investor confidence shaken",
      "Permanent Loss: Market share permanently lost to agile competitors who moved in 24 hours"
    ],
    details: {
      coordination: "72 hours of sequential meetings",
      impact: "€280M market cap erosion",
      cost: "Permanent competitive disadvantage",
      reputation: "Investor concerns about executive responsiveness"
    }
  },
  vexor: {
    title: "M Coordination",
    timeline: "12 Minutes",
    outcome: "€280M Value Preserved",
    approach: "AI-orchestrated parallel coordination across 193 stakeholders in multiple time zones within 12 minutes of detection",
    points: [
      "9:47 AM Paris: AI detects 40% China luxury spending drop at 92% confidence",
      "9:48 AM: CEO Bernard Arnault receives mobile alert → approves playbook activation with single tap",
      "9:51 AM: 8 executives across 3 continents join emergency video conference",
      "9:53 AM: $50M emergency budget pre-approved → inventory adjustments authorized",
      "9:56 AM: 35 execution leaders receive detailed tasks: Production -35%, Marketing shift to US/EU",
      "9:59 AM: 193 stakeholders aligned → All actions executing in parallel",
      "First Mover Advantage: LVMH moves 60 hours before Hermès → captures reallocated €280M China demand in US/EU markets",
      "Strategic Win: Inventory optimized, marketing pivoted, suppliers adjusted - all before market closes"
    ],
    details: {
      coordination: "12 minutes to full alignment",
      impact: "€280M value preserved",
      advantage: "60-hour first-mover advantage",
      stakeholders: "193 people across 12 time zones"
    }
  },
  bottomLine: {
    value: "€280M Value Preserved",
    metric: "360x Faster Coordination (72 hours → 12 minutes)"
  }
};

// AI Data Streams (for radar simulation)
export const aiDataStreams = [
  { id: 'social', name: 'Social Media Sentiment', confidence: 72, status: 'warning' },
  { id: 'retail', name: 'Retail Sales Data', confidence: 91, status: 'critical' },
  { id: 'currency', name: 'Currency Indicators', confidence: 85, status: 'critical' },
  { id: 'search', name: 'Search Volume Trends', confidence: 78, status: 'warning' },
  { id: 'competitor', name: 'Competitor Activity', confidence: 68, status: 'normal' },
];

// Communication Templates (pre-drafted)
export const communicationTemplates = [
  {
    type: 'Board Memo',
    audience: 'Board of Directors',
    subject: 'URGENT: Asia-Pacific Revenue Shortfall - Response Activated',
    preview: 'The Group has detected a 40% contraction in China luxury spending. Playbook #044 has been activated...',
    status: 'Pre-drafted - Ready to send'
  },
  {
    type: 'Supplier Notification',
    audience: '12 Manufacturing Partners',
    subject: 'Production Volume Adjustment - Immediate Action Required',
    preview: 'Due to market conditions in Asia-Pacific, we are adjusting Q3 production volumes by 35%...',
    status: 'Pre-drafted - Ready to send'
  },
  {
    type: 'Investor Relations',
    audience: 'Institutional Investors',
    subject: 'Market Update: Asia-Pacific Strategy Adjustment',
    preview: 'LVMH is proactively reallocating inventory and marketing spend in response to evolving demand...',
    status: 'Pre-drafted - Ready to send'
  },
  {
    type: 'Internal Memo',
    audience: '25,000 Retail Employees',
    subject: 'Regional Strategy Update - Your Questions Answered',
    preview: 'You may have seen news about China market conditions. Here is what it means for our teams...',
    status: 'Pre-drafted - Ready to send'
  }
];

// Playbook Template Preview
export const playbookTemplate = {
  number: '044',
  name: 'Revenue Shortfall - Asia Pacific',
  domain: 'Financial Strategy',
  preparedness: 92,
  sections: [
    { name: 'Situation Definition', prefill: 100, status: 'complete' },
    { name: 'Stakeholder Matrix', prefill: 90, status: 'complete' },
    { name: 'Decision Tree', prefill: 85, status: 'complete' },
    { name: 'Communication Templates', prefill: 80, status: 'complete' },
    { name: 'Task Sequences', prefill: 75, status: 'complete' },
    { name: 'Budget Authority', prefill: 100, status: 'complete' },
    { name: 'Success Metrics', prefill: 80, status: 'complete' },
    { name: 'Lessons Learned', prefill: 0, status: 'pending' }
  ]
};
