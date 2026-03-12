/**
 * @deprecated This file is being phased out in favor of the unified playbook library system.
 * - Old system: 13 scenarios in 3 categories (offensive/defensive/special-teams)
 * - New system: 148 playbooks in 8 strategic domains
 * - Migration status: ScenarioGallery now uses playbook API. ScenarioDemo and ROI pages still use this for rich walkthrough content.
 * - TODO: Remove this file once demo walkthroughs are migrated to playbook data structure.
 */

export type ScenarioCategory = 'offensive' | 'defensive' | 'special-teams';

// McKinsey's 12 Operating Model Elements
export type OperatingModelElement = 
  | 'Purpose' 
  | 'Value Agenda' 
  | 'Structure' 
  | 'Ecosystem' 
  | 'Leadership' 
  | 'Governance' 
  | 'Processes' 
  | 'Technology' 
  | 'Behaviors' 
  | 'Rewards' 
  | 'Footprint' 
  | 'Talent';

export const OPERATING_MODEL_ELEMENTS: { id: OperatingModelElement; description: string }[] = [
  { id: 'Purpose', description: 'Core reason for being' },
  { id: 'Value Agenda', description: 'How you create value' },
  { id: 'Structure', description: 'How accountable units are designed' },
  { id: 'Ecosystem', description: 'How you work with partners' },
  { id: 'Leadership', description: 'How leaders make decisions' },
  { id: 'Governance', description: 'How you allocate resources' },
  { id: 'Processes', description: 'How workflows are designed' },
  { id: 'Technology', description: 'How digital/AI enables value' },
  { id: 'Behaviors', description: 'How culture is nurtured' },
  { id: 'Rewards', description: 'How people are rewarded' },
  { id: 'Footprint', description: 'How you deploy talent' },
  { id: 'Talent', description: 'How you develop capabilities' }
];

export interface ScenarioInput {
  label: string;
  description: string;
  userDefined: boolean; // Whether this is something the user sets up
}

export interface ScenarioOutput {
  label: string;
  description: string;
  metric?: string;
}

export interface ScenarioTrigger {
  condition: string;
  threshold: string;
  userDefined: boolean;
}

export interface ScenarioLearning {
  observation: string;
  recommendation: string;
}

export interface Scenario {
  id: string;
  title: string;
  category: ScenarioCategory;
  purpose: string;
  description: string;
  icon: string; // lucide-react icon name
  color: string; // tailwind color scheme
  
  // McKinsey Framework Integration
  elementsActivated: OperatingModelElement[]; // Which of the 12 elements this scenario activates
  annualValue: string; // e.g., "$12M market share protected"
  speedAdvantage: string; // e.g., "18 days faster (21 days → 3 days)"
  
  // The human preparation phase
  keyInputs: ScenarioInput[];
  
  // AI monitoring capabilities
  aiMonitoring: string[];
  
  // Trigger conditions (user-defined)
  triggers: ScenarioTrigger[];
  
  // Expected outputs
  outputs: ScenarioOutput[];
  
  // AI learning examples
  learning: ScenarioLearning[];
  
  // Demo narrative
  situation: string;
  traditionalApproach: {
    description: string;
    timeline: string;
    cost: string;
  };
  mApproach: {
    description: string;
    timeline: string;
    outcome: string;
  };
}

export const scenarios: Scenario[] = [
  {
    id: 'culture-transformation',
    title: 'Culture Transformation',
    category: 'special-teams',
    purpose: 'Shift organizational culture to align with new values, strategies, or goals',
    description: 'Transform your organization\'s culture through systematic change management and employee engagement',
    icon: 'Users',
    color: 'purple',
    
    // McKinsey Framework
    elementsActivated: ['Purpose', 'Behaviors', 'Leadership', 'Talent', 'Rewards'],
    annualValue: '$2.1M savings vs traditional approach',
    speedAdvantage: '6-18 months faster (24-36 months → 18 months)',
    
    keyInputs: [
      {
        label: 'Current vs. Desired Cultural Attributes',
        description: 'Define collaboration, innovation, accountability levels',
        userDefined: true
      },
      {
        label: 'Employee Engagement Metrics',
        description: 'Baseline satisfaction, retention, participation rates',
        userDefined: true
      },
      {
        label: 'Training Resources & Schedules',
        description: 'Programs, facilitators, timeline for rollout',
        userDefined: true
      },
      {
        label: 'Leadership Alignment Score',
        description: 'Executive team commitment and role modeling',
        userDefined: true
      }
    ],
    
    aiMonitoring: [
      'Employee engagement survey trends',
      'Internal communication sentiment analysis',
      'Training completion and effectiveness metrics',
      'Leadership behavior indicators',
      'Culture-related turnover patterns'
    ],
    
    triggers: [
      {
        condition: 'Engagement score drops below target',
        threshold: 'Below 70% (YOUR benchmark)',
        userDefined: true
      },
      {
        condition: 'Leadership alignment variance detected',
        threshold: 'Score divergence >15 points',
        userDefined: true
      },
      {
        condition: 'Training completion lag',
        threshold: 'Behind schedule by >2 weeks',
        userDefined: true
      }
    ],
    
    outputs: [
      {
        label: 'Cultural Gap Analysis',
        description: 'Distance between current and desired state',
        metric: '23% gap identified across 5 key attributes'
      },
      {
        label: 'Engagement Improvement Forecast',
        description: 'Projected engagement trajectory',
        metric: '68% → 85% over 18 months'
      },
      {
        label: 'Timeline for Cultural Change Adoption',
        description: 'Phase-based transformation roadmap',
        metric: '18-month journey with 4 milestones'
      }
    ],
    
    learning: [
      {
        observation: 'Leadership workshops showed 40% higher impact when conducted off-site',
        recommendation: 'Prioritize immersive leadership experiences in future culture initiatives'
      },
      {
        observation: 'Employee engagement peaked 3 weeks after town halls, then declined',
        recommendation: 'Schedule follow-up touchpoints every 2 weeks to maintain momentum'
      }
    ],
    
    situation: 'Your board has mandated a culture shift from hierarchical to collaborative, affecting 8,000 employees across 12 locations. Traditional approaches take 2-3 years with uncertain outcomes.',
    
    traditionalApproach: {
      description: 'Hire culture consultants, conduct year-long assessment, pilot programs in one division, gradually roll out with inconsistent leadership buy-in',
      timeline: '24-36 months',
      cost: '$4.5M consulting fees, uncertain ROI, risk of fragmented adoption'
    },
    
    mApproach: {
      description: 'Your team builds culture transformation playbook with engagement triggers, leadership alignment protocols, and training sequences. AI monitors sentiment daily, triggers interventions when engagement dips.',
      timeline: '18 months with measurable milestones',
      outcome: '85% engagement achieved, $2.1M saved vs traditional, 40% faster adoption'
    }
  },
  
  {
    id: 'digital-transformation',
    title: 'Digital Transformation',
    category: 'offensive',
    purpose: 'Modernize systems, tools, and workflows using technology',
    description: 'Drive enterprise-wide technology adoption and process digitization',
    icon: 'Smartphone',
    color: 'blue',
    
    // McKinsey Framework
    elementsActivated: ['Technology', 'Talent', 'Processes', 'Behaviors', 'Governance'],
    annualValue: '$44M efficiency gain',
    speedAdvantage: '4 months faster adoption (18 months → 14 months)',
    
    keyInputs: [
      {
        label: 'Current System Maturity Assessment',
        description: 'Legacy technology, integration complexity, technical debt',
        userDefined: true
      },
      {
        label: 'Budget Allocation',
        description: 'Investment across platforms, training, change management',
        userDefined: true
      },
      {
        label: 'Target Adoption Metrics',
        description: 'User training completion, system utilization, satisfaction scores',
        userDefined: true
      },
      {
        label: 'Risk Identification',
        description: 'Technical debt, system downtime, resistance to change',
        userDefined: true
      }
    ],
    
    aiMonitoring: [
      'System adoption and usage patterns',
      'Training completion rates by department',
      'Help desk ticket volume and sentiment',
      'System performance and uptime metrics',
      'Budget utilization tracking'
    ],
    
    triggers: [
      {
        condition: 'Adoption rate below target pace',
        threshold: '<60% at 12-month mark (YOUR target)',
        userDefined: true
      },
      {
        condition: 'Budget variance alert',
        threshold: 'Spending >15% over plan',
        userDefined: true
      },
      {
        condition: 'System downtime threshold',
        threshold: '>4 hours in any week',
        userDefined: true
      }
    ],
    
    outputs: [
      {
        label: 'Projected ROI',
        description: 'Return on technology investment',
        metric: '$12M savings over 3 years'
      },
      {
        label: 'Adoption Timeline',
        description: 'Phased rollout with milestones',
        metric: '22 months to 80% adoption'
      },
      {
        label: 'Risk Mitigation Plan',
        description: 'Strategies for identified risks',
        metric: '3 critical risks with mitigation protocols'
      }
    ],
    
    learning: [
      {
        observation: 'Sales team adoption lagged 3 months behind other departments',
        recommendation: 'Provide role-specific training for sales teams earlier in rollout'
      },
      {
        observation: 'System downtime incidents peaked during quarter-end periods',
        recommendation: 'Schedule major updates outside fiscal close windows'
      }
    ],
    
    situation: 'Your $45M digital transformation affects 12,000 employees, replacing 15-year-old legacy systems with cloud platforms. Failure risks competitive disadvantage and $200M in lost productivity.',
    
    traditionalApproach: {
      description: 'Waterfall implementation with 18-month planning phase, big-bang rollout, reactive issue resolution, scattered training programs',
      timeline: '36 months end-to-end',
      cost: '$58M total cost, 40% adoption rate, 6-month delay average'
    },
    
    mApproach: {
      description: 'Build transformation playbook with phased adoption targets, department-specific training, and risk triggers. AI monitors adoption daily, flags lagging departments, triggers intervention playbooks.',
      timeline: '22 months to full adoption',
      outcome: '82% adoption rate, $12M ROI, interventions prevent 3-month delays'
    }
  },
  
  {
    id: 'workforce-transformation',
    title: 'Workforce Transformation',
    category: 'special-teams',
    purpose: 'Adapt workforce capabilities, structures, or size to meet strategic needs',
    description: 'Optimize workforce through upskilling, restructuring, and strategic talent management',
    icon: 'Briefcase',
    color: 'teal',
    
    // McKinsey Framework
    elementsActivated: ['Talent', 'Structure', 'Footprint', 'Rewards', 'Behaviors'],
    annualValue: '$8.5M annual savings + 18% retention improvement',
    speedAdvantage: '4-10 months faster (18-24 months → 14 months)',
    
    keyInputs: [
      {
        label: 'Current Workforce Skills Inventory',
        description: 'Capabilities, gaps, competency levels by role',
        userDefined: true
      },
      {
        label: 'Training & Upskilling Needs',
        description: 'Required skills, programs, certification paths',
        userDefined: true
      },
      {
        label: 'Retention Targets & Costs',
        description: 'Turnover rates, replacement costs, retention strategies',
        userDefined: true
      },
      {
        label: 'Restructuring Requirements',
        description: 'Org design changes, role eliminations, new positions',
        userDefined: true
      }
    ],
    
    aiMonitoring: [
      'Skills gap analysis across teams',
      'Training completion and certification rates',
      'Employee retention risk indicators',
      'Performance improvement trends',
      'Market salary benchmarking'
    ],
    
    triggers: [
      {
        condition: 'Skills gap widens beyond acceptable range',
        threshold: '>30% capability gap (YOUR threshold)',
        userDefined: true
      },
      {
        condition: 'Retention risk spike detected',
        threshold: 'Flight risk score >75 for critical roles',
        userDefined: true
      },
      {
        condition: 'Training completion lag',
        threshold: 'Behind schedule by 4+ weeks',
        userDefined: true
      }
    ],
    
    outputs: [
      {
        label: 'Workforce Optimization Plan',
        description: 'Right-sizing and capability building roadmap',
        metric: '15% productivity gain, 800 positions optimized'
      },
      {
        label: 'Cost Savings & Retention Impact',
        description: 'Financial and talent preservation outcomes',
        metric: '$8.5M annual savings, 18% retention improvement'
      },
      {
        label: 'Upskilling Progress Forecast',
        description: 'Timeline to capability targets',
        metric: '14 months to full workforce readiness'
      }
    ],
    
    learning: [
      {
        observation: 'Engineers with mentorship completed upskilling 35% faster',
        recommendation: 'Pair mentors with all technical training programs'
      },
      {
        observation: 'Retention risk spiked 2 weeks before restructuring announcements',
        recommendation: 'Implement proactive communication 30 days before major changes'
      }
    ],
    
    situation: 'AI disruption requires reskilling 3,000 employees while reducing workforce by 800 positions. Must balance cost reduction with capability building and morale preservation.',
    
    traditionalApproach: {
      description: 'Announce layoffs, offer generic retraining, hope for the best on retention. Fragmented execution across HR, L&D, and department heads.',
      timeline: '18-24 months with high attrition',
      cost: '$15M in turnover costs, 35% unplanned attrition, skills gaps persist'
    },
    
    mApproach: {
      description: 'Build workforce transformation playbook with skills mapping, targeted upskilling, retention protocols. AI monitors flight risk daily, triggers retention playbooks for critical roles.',
      timeline: '14 months to optimized workforce',
      outcome: '18% retention improvement, $8.5M saved, 15% productivity gain'
    }
  },
  
  {
    id: 'strategic-realignment',
    title: 'Strategic Realignment',
    category: 'offensive',
    purpose: 'Shift focus or resources to align with a new strategic direction',
    description: 'Pivot organizational strategy and resource allocation to capture new opportunities',
    icon: 'Target',
    color: 'indigo',
    
    // McKinsey Framework
    elementsActivated: ['Purpose', 'Value Agenda', 'Structure', 'Governance', 'Footprint', 'Talent'],
    annualValue: '$114M Year 1 ROI (12% market share gain, $85M revenue uplift)',
    speedAdvantage: '3 months faster (12 months → 9 months)',
    
    keyInputs: [
      {
        label: 'Current vs. New Strategic Goals',
        description: 'Existing priorities vs. new direction and rationale',
        userDefined: true
      },
      {
        label: 'Resource Allocation',
        description: 'Budget, personnel, technology across initiatives',
        userDefined: true
      },
      {
        label: 'Key Performance Indicators',
        description: 'Success metrics for new strategy',
        userDefined: true
      },
      {
        label: 'Sunset Plan for Legacy Initiatives',
        description: 'Wind-down timeline and resource recovery',
        userDefined: true
      }
    ],
    
    aiMonitoring: [
      'Resource utilization against new strategy',
      'KPI progress tracking',
      'Legacy initiative wind-down status',
      'Team productivity in new focus areas',
      'Market response to strategic shift'
    ],
    
    triggers: [
      {
        condition: 'KPI progress below target trajectory',
        threshold: '<70% of milestone goals (YOUR target)',
        userDefined: true
      },
      {
        condition: 'Resource allocation misalignment',
        threshold: '>20% resources still in legacy initiatives',
        userDefined: true
      },
      {
        condition: 'Market feedback negative',
        threshold: 'Customer sentiment <60% positive',
        userDefined: true
      }
    ],
    
    outputs: [
      {
        label: 'Resource Reallocation Plan',
        description: 'Optimized distribution across new priorities',
        metric: '$120M redirected, 1,200 FTEs reallocated'
      },
      {
        label: 'Strategic Impact Visualization',
        description: 'Projected market share and revenue growth',
        metric: '12% market share gain, $85M revenue uplift'
      },
      {
        label: 'Realignment Execution Timeline',
        description: 'Phased transition roadmap',
        metric: '9-month realignment with 3 major milestones'
      }
    ],
    
    learning: [
      {
        observation: 'Teams with clear "why" messaging showed 50% faster adoption',
        recommendation: 'Lead all strategic shifts with purpose-driven communication'
      },
      {
        observation: 'Legacy initiative sunset took 2x longer than planned',
        recommendation: 'Add 100% buffer to wind-down timelines for future pivots'
      }
    ],
    
    situation: 'Market disruption forces pivot from B2B to B2C strategy. Must reallocate $120M budget and 1,200 employees while maintaining current revenue during transition.',
    
    traditionalApproach: {
      description: 'Announce strategy shift, departments self-organize transition, fragmented resource moves, inconsistent execution across divisions',
      timeline: '18 months with revenue dip',
      cost: '$25M revenue loss during transition, 6-month market entry delay'
    },
    
    mApproach: {
      description: 'Build strategic realignment playbook with resource reallocation phases, team transition protocols, market entry triggers. AI monitors KPIs daily, flags misalignment.',
      timeline: '9 months to full realignment',
      outcome: '$85M new revenue, 12% market share, minimal disruption to existing business'
    }
  },
  
  {
    id: 'process-improvement',
    title: 'Process Improvement',
    category: 'offensive',
    purpose: 'Optimize business processes for efficiency and effectiveness',
    description: 'Streamline workflows, eliminate waste, and drive operational excellence',
    icon: 'GitBranch',
    color: 'green',
    
    // McKinsey Framework
    elementsActivated: ['Processes', 'Technology', 'Governance', 'Talent'],
    annualValue: '$8M efficiency gains annually',
    speedAdvantage: '2-3 months faster (6 months → 3-4 months)',
    
    keyInputs: [
      {
        label: 'Current Process Inefficiencies',
        description: 'Time waste, cost leakage, quality issues identified',
        userDefined: true
      },
      {
        label: 'Workflow Dependencies',
        description: 'Cross-functional touchpoints and bottlenecks',
        userDefined: true
      },
      {
        label: 'Automation Opportunities',
        description: 'Tasks suitable for automation, ROI analysis',
        userDefined: true
      },
      {
        label: 'Success Metrics',
        description: 'Cycle time, cost per transaction, error rates',
        userDefined: true
      }
    ],
    
    aiMonitoring: [
      'Process cycle time tracking',
      'Bottleneck identification and impact',
      'Automation adoption and effectiveness',
      'Quality metrics and error rates',
      'Cost per transaction trends'
    ],
    
    triggers: [
      {
        condition: 'Cycle time exceeds target',
        threshold: '>15% above baseline (YOUR target)',
        userDefined: true
      },
      {
        condition: 'Bottleneck detected',
        threshold: 'Wait time >4 hours at any stage',
        userDefined: true
      },
      {
        condition: 'Error rate spike',
        threshold: '>5% defect rate (YOUR threshold)',
        userDefined: true
      }
    ],
    
    outputs: [
      {
        label: 'Cost & Time Savings',
        description: 'Efficiency gains from optimization',
        metric: '$6.2M annual savings, 40% cycle time reduction'
      },
      {
        label: 'Improved Process Maps',
        description: 'Optimized workflow documentation',
        metric: '23 processes streamlined, 8 eliminated'
      },
      {
        label: 'Productivity Increase Projections',
        description: 'Output improvements per FTE',
        metric: '28% productivity gain'
      }
    ],
    
    learning: [
      {
        observation: 'Approval processes with >3 steps showed 70% longer cycle times',
        recommendation: 'Limit approval chains to maximum 2 steps for efficiency'
      },
      {
        observation: 'Automated processes had 85% fewer errors than manual ones',
        recommendation: 'Prioritize automation for high-volume, repetitive tasks'
      }
    ],
    
    situation: 'Your order-to-cash process takes 14 days with 12 handoffs, costing $850 per transaction. Competitors process in 3 days at $200 per transaction. Market share at risk.',
    
    traditionalApproach: {
      description: 'Hire process consultants, map current state over 3 months, pilot changes in one region, gradually roll out improvements',
      timeline: '12-18 months to full implementation',
      cost: '$1.8M consulting fees, incremental gains, change fatigue'
    },
    
    mApproach: {
      description: 'Build process improvement playbook with automation roadmap, bottleneck elimination protocols, quality triggers. AI monitors cycle times daily, triggers interventions at bottlenecks.',
      timeline: '7 months to optimized process',
      outcome: '$6.2M annual savings, 40% faster, 85% error reduction'
    }
  },
  
  {
    id: 'project-portfolio',
    title: 'Project Portfolio Management',
    category: 'offensive',
    purpose: 'Optimize and prioritize projects to align with organizational goals',
    description: 'Maximize ROI and strategic value through intelligent portfolio management',
    icon: 'Layers',
    color: 'amber',
    
    // McKinsey Framework
    elementsActivated: ['Governance', 'Structure', 'Processes', 'Technology'],
    annualValue: '$43M capital redeployed + 18% ROI improvement',
    speedAdvantage: 'Quarterly optimization vs annual (4x faster adaptation)',
    
    keyInputs: [
      {
        label: 'Project ROI & Strategic Value',
        description: 'Financial return and strategic alignment scores',
        userDefined: true
      },
      {
        label: 'Available Resources',
        description: 'Budget, personnel capacity, technology constraints',
        userDefined: true
      },
      {
        label: 'Project Risks & Dependencies',
        description: 'Risk levels, interdependencies, critical path',
        userDefined: true
      },
      {
        label: 'Portfolio Governance Rules',
        description: 'Decision criteria, approval thresholds, rebalancing triggers',
        userDefined: true
      }
    ],
    
    aiMonitoring: [
      'Project health scores and burn rates',
      'Resource utilization across portfolio',
      'Risk exposure and mitigation status',
      'Strategic value delivery tracking',
      'Portfolio balance against objectives'
    ],
    
    triggers: [
      {
        condition: 'Project at risk of missing milestones',
        threshold: '>2 weeks behind critical path (YOUR threshold)',
        userDefined: true
      },
      {
        condition: 'Resource over-allocation detected',
        threshold: '>110% capacity utilization',
        userDefined: true
      },
      {
        condition: 'ROI projection drops',
        threshold: 'Below YOUR minimum 15% return threshold',
        userDefined: true
      }
    ],
    
    outputs: [
      {
        label: 'Optimized Portfolio Plan',
        description: 'Prioritized project mix aligned to strategy',
        metric: '47 projects prioritized, 12 paused, 8 accelerated'
      },
      {
        label: 'Resource Utilization Metrics',
        description: 'Capacity optimization across portfolio',
        metric: '92% utilization, zero over-allocation'
      },
      {
        label: 'Risk-Adjusted Prioritization Matrix',
        description: 'Value vs. risk positioning of all projects',
        metric: 'Portfolio risk score: 24 (acceptable range)'
      }
    ],
    
    learning: [
      {
        observation: 'Projects with executive sponsors delivered 60% faster',
        recommendation: 'Require C-level sponsorship for all strategic initiatives'
      },
      {
        observation: 'Mid-year portfolio rebalancing improved ROI by 18%',
        recommendation: 'Conduct quarterly portfolio reviews, not just annual'
      }
    ],
    
    situation: 'Managing 67 projects with $240M budget and 800 team members. No clear prioritization, resource conflicts, strategic alignment uncertain. Board demanding better capital allocation.',
    
    traditionalApproach: {
      description: 'Annual planning cycle, projects approved ad-hoc, minimal rebalancing, resource conflicts resolved locally, limited visibility',
      timeline: 'Annual review cycle, slow adjustments',
      cost: '30% of projects fail, $72M wasted on low-value work, opportunity cost high'
    },
    
    mApproach: {
      description: 'Build portfolio management playbook with value scoring, resource optimization rules, rebalancing triggers. AI monitors all projects daily, flags risks, triggers rebalancing.',
      timeline: 'Quarterly optimization cycles',
      outcome: '18% ROI improvement, $43M capital redeployed, 12 low-value projects stopped'
    }
  },
  
  {
    id: 'compliance-regulatory',
    title: 'Compliance & Regulatory Changes',
    category: 'defensive',
    purpose: 'Address regulatory changes or compliance gaps',
    description: 'Ensure regulatory compliance and mitigate legal/financial risks',
    icon: 'Shield',
    color: 'red',
    
    // McKinsey Framework
    elementsActivated: ['Governance', 'Processes', 'Leadership', 'Technology'],
    annualValue: '$16M fine/penalty avoidance',
    speedAdvantage: '38 days faster (12 weeks → 4 weeks)',
    
    keyInputs: [
      {
        label: 'Compliance Gap Analysis',
        description: 'Current state vs. regulatory requirements identified',
        userDefined: true
      },
      {
        label: 'Regulatory Deadlines',
        description: 'Mandatory compliance dates and penalties',
        userDefined: true
      },
      {
        label: 'Resource Needs',
        description: 'Legal, technology, training requirements',
        userDefined: true
      },
      {
        label: 'Risk Assessment',
        description: 'Financial exposure, reputational impact, enforcement likelihood',
        userDefined: true
      }
    ],
    
    aiMonitoring: [
      'Regulatory filing and update tracking',
      'Compliance status across requirements',
      'Gap closure progress monitoring',
      'Enforcement action alerts',
      'Industry compliance benchmarking'
    ],
    
    triggers: [
      {
        condition: 'New regulation published affecting operations',
        threshold: 'Regulatory database update detected',
        userDefined: true
      },
      {
        condition: 'Compliance deadline approaching',
        threshold: '<90 days to mandatory compliance (YOUR buffer)',
        userDefined: true
      },
      {
        condition: 'Gap closure behind schedule',
        threshold: '>15% of items overdue',
        userDefined: true
      }
    ],
    
    outputs: [
      {
        label: 'Compliance Readiness Score',
        description: 'Percentage of requirements met',
        metric: '94% compliant, 6 gaps with mitigation plans'
      },
      {
        label: 'Penalty Mitigation Plan',
        description: 'Strategies to avoid fines and sanctions',
        metric: '$12M in potential penalties avoided'
      },
      {
        label: 'Compliance Timeline',
        description: 'Roadmap to full regulatory adherence',
        metric: '120 days to 100% compliance'
      }
    ],
    
    learning: [
      {
        observation: 'Legal review took 3x longer than planned for complex regulations',
        recommendation: 'Engage legal counsel 60 days earlier for major regulatory changes'
      },
      {
        observation: 'Training completion accelerated when tied to compliance certification',
        recommendation: 'Make certifications mandatory for roles with compliance exposure'
      }
    ],
    
    situation: 'New data privacy regulation requires compliance in 6 months. Affects 45 systems, 3,000 employees. Non-compliance penalties: $50M fine + criminal liability for executives.',
    
    traditionalApproach: {
      description: 'Assemble task force, interpret regulations, scramble to implement changes, last-minute compliance rush, incomplete documentation',
      timeline: '8 months (2 months past deadline)',
      cost: '$8M implementation cost, $15M in late compliance penalties, reputational damage'
    },
    
    mApproach: {
      description: 'Build compliance playbook with gap analysis, implementation phases, deadline triggers. AI monitors regulatory databases, triggers playbook when new rules published.',
      timeline: '120 days to full compliance',
      outcome: 'Zero penalties, $12M saved, audit-ready documentation, 30 days early'
    }
  },
  
  {
    id: 'global-expansion',
    title: 'Global Expansion',
    category: 'offensive',
    purpose: 'Expand operations to new regions or markets',
    description: 'Enter new geographic markets with minimized risk and maximized speed',
    icon: 'Globe',
    color: 'cyan',
    
    // McKinsey Framework
    elementsActivated: ['Structure', 'Footprint', 'Ecosystem', 'Talent', 'Governance'],
    annualValue: '$31M first-year revenue',
    speedAdvantage: '47 days faster (4 months → 6 weeks)',
    
    keyInputs: [
      {
        label: 'Market Analysis Metrics',
        description: 'Opportunity size, competitive landscape, entry barriers',
        userDefined: true
      },
      {
        label: 'Localization Needs',
        description: 'Language, regulatory, cultural adaptation requirements',
        userDefined: true
      },
      {
        label: 'Resource Requirements',
        description: 'Budget, personnel, technology, partnerships',
        userDefined: true
      },
      {
        label: 'Go-to-Market Strategy',
        description: 'Entry approach, pricing, distribution, marketing',
        userDefined: true
      }
    ],
    
    aiMonitoring: [
      'Market opportunity indicators',
      'Competitive movement tracking',
      'Regulatory environment changes',
      'Localization progress metrics',
      'Market entry performance KPIs'
    ],
    
    triggers: [
      {
        condition: 'Market opportunity threshold met',
        threshold: 'TAM >$500M with <30% saturation (YOUR criteria)',
        userDefined: true
      },
      {
        condition: 'Competitive threat in target market',
        threshold: 'Major competitor enters YOUR priority market',
        userDefined: true
      },
      {
        condition: 'Regulatory window opens',
        threshold: 'Trade barriers reduced to acceptable level',
        userDefined: true
      }
    ],
    
    outputs: [
      {
        label: 'Expansion Readiness Assessment',
        description: 'Go/no-go evaluation across criteria',
        metric: '87% readiness - greenlight for APAC expansion'
      },
      {
        label: 'Timeline & Cost Forecast',
        description: 'Phased market entry plan',
        metric: '14 months to profitability, $28M investment'
      },
      {
        label: 'Risk Mitigation Strategies',
        description: 'Plans for identified expansion risks',
        metric: '8 major risks with containment protocols'
      }
    ],
    
    learning: [
      {
        observation: 'Local partnerships reduced time-to-market by 5 months vs. solo entry',
        recommendation: 'Prioritize strategic partnerships for future market entries'
      },
      {
        observation: 'Regulatory approval took 2x longer in markets without local presence',
        recommendation: 'Establish local entity 6 months before market entry'
      }
    ],
    
    situation: 'Board approved APAC expansion targeting $200M revenue. Must navigate 8 country regulations, cultural differences, established competitors. Timing critical - market window closing in 18 months.',
    
    traditionalApproach: {
      description: 'Hire consultants for market study, sequential country entry, learn by trial and error, reactive problem-solving',
      timeline: '24 months to first profitable market',
      cost: '$45M investment, 18-month delay, 2 market entries failed'
    },
    
    mApproach: {
      description: 'Build expansion playbook with market entry criteria, localization protocols, partnership triggers. AI monitors opportunity signals, triggers entry when conditions optimal.',
      timeline: '14 months to profitability',
      outcome: '$200M revenue target achieved, $17M cost savings, 5-month acceleration'
    }
  },
  
  {
    id: 'sustainability',
    title: 'Sustainability Initiatives',
    category: 'special-teams',
    purpose: 'Implement environmentally sustainable practices',
    description: 'Drive ESG goals through measurable environmental impact reduction',
    icon: 'Leaf',
    color: 'emerald',
    
    // McKinsey Framework
    elementsActivated: ['Purpose', 'Value Agenda', 'Processes', 'Ecosystem', 'Behaviors'],
    annualValue: '$32M cost savings + AA ESG rating',
    speedAdvantage: '3-5 years faster (8-10 years → 5 years to net zero)',
    
    keyInputs: [
      {
        label: 'Carbon Footprint Baseline',
        description: 'Current emissions across Scope 1, 2, 3',
        userDefined: true
      },
      {
        label: 'Sustainability Goals',
        description: 'Net zero targets, renewable energy %, waste reduction',
        userDefined: true
      },
      {
        label: 'Budget Allocation',
        description: 'Green technology, process changes, carbon offsets',
        userDefined: true
      },
      {
        label: 'Stakeholder Commitments',
        description: 'Investor expectations, customer demands, regulatory requirements',
        userDefined: true
      }
    ],
    
    aiMonitoring: [
      'Emissions tracking by source',
      'Renewable energy utilization rates',
      'Waste and water consumption metrics',
      'Sustainability certification progress',
      'ESG rating trajectory'
    ],
    
    triggers: [
      {
        condition: 'Emissions reduction off track',
        threshold: '<80% of annual target (YOUR goal)',
        userDefined: true
      },
      {
        condition: 'Renewable energy adoption lag',
        threshold: 'Behind schedule by >1 quarter',
        userDefined: true
      },
      {
        condition: 'ESG rating risk',
        threshold: 'Score projected to drop below YOUR minimum',
        userDefined: true
      }
    ],
    
    outputs: [
      {
        label: 'Sustainability Impact Forecast',
        description: 'Projected emissions reduction and ESG improvements',
        metric: '45% emissions reduction, AA ESG rating by 2028'
      },
      {
        label: 'Environmental Standards Compliance',
        description: 'Alignment with regulatory and certification requirements',
        metric: 'ISO 14001 certified, SBTi validated targets'
      },
      {
        label: 'Timeline for Goal Achievement',
        description: 'Milestone-based roadmap to sustainability targets',
        metric: '5-year journey to net zero, 12 major milestones'
      }
    ],
    
    learning: [
      {
        observation: 'Facilities with employee green teams reduced energy 22% faster',
        recommendation: 'Establish sustainability champions in every location'
      },
      {
        observation: 'Supplier engagement programs cut Scope 3 emissions 35% more than expected',
        recommendation: 'Expand supplier sustainability requirements to all vendors'
      }
    ],
    
    situation: 'Investors demand net zero by 2030. Current emissions: 850K tons CO2e. Must reduce 45% while maintaining growth. ESG rating affects $2B in investment access.',
    
    traditionalApproach: {
      description: 'Set aspirational goals, pilot green initiatives, report annually, hope for progress, limited accountability',
      timeline: '8-10 years to net zero (miss 2030 target)',
      cost: '$95M in inefficient investments, ESG rating drops, investor pressure'
    },
    
    mApproach: {
      description: 'Build sustainability playbook with emissions tracking, renewable targets, supplier protocols. AI monitors progress daily, triggers accelerators when off track.',
      timeline: '5 years to net zero (beat 2030 target)',
      outcome: '45% emissions cut, AA ESG rating, $32M cost savings from efficiency'
    }
  },
  
  {
    id: 'crisis-management',
    title: 'Crisis Management',
    category: 'defensive',
    purpose: 'Respond effectively to crises such as financial downturns, cyberattacks, or natural disasters',
    description: 'Execute coordinated crisis response to minimize damage and accelerate recovery',
    icon: 'AlertTriangle',
    color: 'orange',
    
    // McKinsey Framework
    elementsActivated: ['Leadership', 'Governance', 'Behaviors', 'Technology', 'Ecosystem'],
    annualValue: '$19M damage prevention',
    speedAdvantage: '71 hours faster (72 hours → 47 minutes)',
    
    keyInputs: [
      {
        label: 'Crisis Scenarios Identified',
        description: 'Potential threats: cyber, financial, operational, reputational',
        userDefined: true
      },
      {
        label: 'Response Team Structure',
        description: 'Roles, escalation paths, decision authority',
        userDefined: true
      },
      {
        label: 'Communication Protocols',
        description: 'Stakeholder messaging, media response, employee updates',
        userDefined: true
      },
      {
        label: 'Resource Availability',
        description: 'Emergency budget, backup systems, crisis vendors',
        userDefined: true
      }
    ],
    
    aiMonitoring: [
      'Threat signal detection across sources',
      'Crisis indicator tracking',
      'Response team readiness status',
      'Communication effectiveness metrics',
      'Recovery progress monitoring'
    ],
    
    triggers: [
      {
        condition: 'Cybersecurity incident detected',
        threshold: 'Breach severity >7/10 (YOUR scale)',
        userDefined: true
      },
      {
        condition: 'Financial crisis threshold',
        threshold: 'Cash position <30 days operating (YOUR buffer)',
        userDefined: true
      },
      {
        condition: 'Reputational threat',
        threshold: 'Negative sentiment >60% in media',
        userDefined: true
      }
    ],
    
    outputs: [
      {
        label: 'Crisis Response Roadmap',
        description: 'Hour-by-hour action plan for first 72 hours',
        metric: '47-step response protocol, 12-minute activation'
      },
      {
        label: 'Impact Mitigation Analysis',
        description: 'Damage containment and loss prevention',
        metric: '$180M in losses prevented vs. unmanaged response'
      },
      {
        label: 'Recovery Timeline',
        description: 'Path back to normal operations',
        metric: '96 hours to operational recovery, 30 days to full recovery'
      }
    ],
    
    learning: [
      {
        observation: 'Crisis drills conducted quarterly reduced response time by 65%',
        recommendation: 'Mandate quarterly crisis simulations for all response teams'
      },
      {
        observation: 'Pre-approved communication templates enabled 90% faster media response',
        recommendation: 'Maintain board-approved messaging for all crisis scenarios'
      }
    ],
    
    situation: 'Ransomware attack encrypts critical systems at 3:42 AM. Production down, customer data at risk, attackers demand $25M. Every hour of downtime costs $4.2M. Board wants answers immediately.',
    
    traditionalApproach: {
      description: 'Emergency calls to assemble team, argue about response, delayed decision-making, fragmented communication, improvised recovery',
      timeline: '18 hours to response decision, 5 days to recovery',
      cost: '$210M in losses (50 hours downtime), reputational damage, customer churn'
    },
    
    mApproach: {
      description: 'Cybersecurity incident playbook pre-built with IT, Legal, PR, Executive roles mapped. AI detects breach, triggers playbook. Response team executing in 12 minutes.',
      timeline: '12 minutes to activation, 96 hours to recovery',
      outcome: '$180M in losses prevented, customer trust maintained, attackers thwarted'
    }
  },
  
  {
    id: 'mergers-acquisitions',
    title: 'Mergers & Acquisitions (M&A)',
    category: 'special-teams',
    purpose: 'Manage integration processes for mergers or acquisitions',
    description: 'Execute seamless M&A integration with value realization and risk mitigation',
    icon: 'GitMerge',
    color: 'violet',
    
    // McKinsey Framework
    elementsActivated: ['Structure', 'Purpose', 'Behaviors', 'Processes', 'Technology'],
    annualValue: '$89M synergy capture',
    speedAdvantage: '60 days faster value realization (18 months → 12 months)',
    
    keyInputs: [
      {
        label: 'Organizational Compatibility Assessment',
        description: 'Cultural fit, technology alignment, process compatibility',
        userDefined: true
      },
      {
        label: 'Integration Priorities',
        description: 'Systems, teams, processes, customer base to merge',
        userDefined: true
      },
      {
        label: 'Synergy Targets',
        description: 'Cost savings, revenue opportunities, capability gains',
        userDefined: true
      },
      {
        label: 'Legal & Compliance Requirements',
        description: 'Regulatory approvals, contractual obligations, risk factors',
        userDefined: true
      }
    ],
    
    aiMonitoring: [
      'Integration milestone progress',
      'Synergy realization tracking',
      'Employee retention and sentiment',
      'Customer churn indicators',
      'System integration status'
    ],
    
    triggers: [
      {
        condition: 'Integration milestone at risk',
        threshold: '>2 weeks behind critical path (YOUR threshold)',
        userDefined: true
      },
      {
        condition: 'Key talent flight risk',
        threshold: '>20% of critical roles showing departure signals',
        userDefined: true
      },
      {
        condition: 'Synergy shortfall',
        threshold: '<80% of targeted savings achieved',
        userDefined: true
      }
    ],
    
    outputs: [
      {
        label: 'Integration Roadmap',
        description: '100-day plan with phased integration milestones',
        metric: '47 integration workstreams, 230 dependencies mapped'
      },
      {
        label: 'Cost-Benefit Analysis',
        description: 'Deal value realization and ROI projection',
        metric: '$420M in synergies, 18-month payback on $2.8B acquisition'
      },
      {
        label: 'Risk Management Plan',
        description: 'Mitigation strategies for integration risks',
        metric: '12 critical risks with containment protocols'
      }
    ],
    
    learning: [
      {
        observation: 'Cultural integration workshops in first 30 days improved retention by 40%',
        recommendation: 'Prioritize culture integration over systems integration'
      },
      {
        observation: 'Customer communication delays caused 15% churn in first quarter',
        recommendation: 'Notify customers within 48 hours of deal close'
      }
    ],
    
    situation: '$2.8B acquisition of competitor closes Friday. Must integrate 4,000 employees, 12 systems, 50,000 customers. Synergy targets: $420M. Board expects 100-day plan Monday morning.',
    
    traditionalApproach: {
      description: 'Hire integration consultants, build plan over 6 weeks, sequential workstream execution, reactive issue management',
      timeline: '18 months to full integration, 40% synergies realized',
      cost: '$8M consulting fees, $180M synergy shortfall, 25% talent loss'
    },
    
    mApproach: {
      description: 'Build M&A integration playbook pre-deal with cultural assessment, system mapping, talent retention protocols. AI monitors integration daily, triggers interventions.',
      timeline: '12 months to full integration, 92% synergies realized',
      outcome: '$386M synergies captured, 12% talent retention improvement, ahead of schedule'
    }
  },
  
  {
    id: 'organizational-restructuring',
    title: 'Organizational Restructuring',
    category: 'special-teams',
    purpose: 'Reorganize structures to improve efficiency or adapt to new strategies',
    description: 'Execute org redesign to align structure with strategy and drive performance',
    icon: 'Network',
    color: 'pink',
    
    // McKinsey Framework
    elementsActivated: ['Structure', 'Leadership', 'Talent', 'Purpose', 'Behaviors'],
    annualValue: '$37M productivity preservation',
    speedAdvantage: '52 days faster stabilization (6 months → 90 days)',
    
    keyInputs: [
      {
        label: 'Current vs. Proposed Org Design',
        description: 'Existing structure, new design, rationale for change',
        userDefined: true
      },
      {
        label: 'Workforce Impact Analysis',
        description: 'Role changes, eliminations, new positions, affected employees',
        userDefined: true
      },
      {
        label: 'Cost-Benefit Projection',
        description: 'Restructuring costs vs. efficiency gains',
        userDefined: true
      },
      {
        label: 'Change Management Plan',
        description: 'Communication, training, transition support',
        userDefined: true
      }
    ],
    
    aiMonitoring: [
      'Organizational health metrics',
      'Employee sentiment and morale',
      'Productivity and efficiency gains',
      'Restructuring execution progress',
      'Unintended consequence detection'
    ],
    
    triggers: [
      {
        condition: 'Employee morale drops',
        threshold: 'Engagement score <65% (YOUR threshold)',
        userDefined: true
      },
      {
        condition: 'Productivity decline detected',
        threshold: '>10% drop in output metrics',
        userDefined: true
      },
      {
        condition: 'Restructuring timeline slip',
        threshold: '>2 weeks behind transition plan',
        userDefined: true
      }
    ],
    
    outputs: [
      {
        label: 'Restructuring Execution Plan',
        description: 'Phased org transition with communication milestones',
        metric: '90-day restructuring, 2,400 employees transitioned'
      },
      {
        label: 'Cost Savings & Productivity Projections',
        description: 'Financial and operational improvements',
        metric: '$18M annual savings, 22% productivity improvement'
      },
      {
        label: 'Timeline & Success Metrics',
        description: 'Milestones and KPIs for restructuring success',
        metric: '90 days to new structure, 6 months to full productivity'
      }
    ],
    
    learning: [
      {
        observation: 'Transparent communication reduced uncertainty-driven attrition by 60%',
        recommendation: 'Over-communicate rationale and individual impacts in all restructuring'
      },
      {
        observation: 'Manager training 2 weeks before announcement improved transition quality',
        recommendation: 'Prepare managers before general employee communication'
      }
    ],
    
    situation: 'Strategic shift requires flattening 7 layers to 4, eliminating 800 positions, creating 200 new roles. Must maintain operations, preserve talent, achieve $18M savings while boosting productivity.',
    
    traditionalApproach: {
      description: 'Announce restructuring, place employees, hope for the best, reactive retention efforts, fragmented execution',
      timeline: '6 months to new structure, 12 months to productivity',
      cost: '$12M in unplanned attrition, 35% productivity dip, 18-month recovery'
    },
    
    mApproach: {
      description: 'Build restructuring playbook with communication protocols, transition support, retention triggers. AI monitors sentiment daily, flags morale issues, triggers support.',
      timeline: '90 days to new structure, 6 months to full productivity',
      outcome: '$18M savings achieved, 22% productivity gain, 18% retention improvement'
    }
  },
  {
    id: 'new-product-launch',
    title: 'New Product Launch & Market Creation',
    category: 'offensive',
    purpose: 'Launch innovative products, capture blue ocean opportunities, and create new markets',
    description: 'Anticipate market opportunities and execute strategic product launches with precision',
    icon: 'Rocket',
    color: 'green',
    
    // McKinsey Framework
    elementsActivated: ['Purpose', 'Value Agenda', 'Structure', 'Processes', 'Technology', 'Ecosystem', 'Leadership', 'Governance', 'Behaviors', 'Rewards', 'Footprint', 'Talent'],
    annualValue: '$23M per launch',
    speedAdvantage: '34 days faster (6 weeks → 12 days)',
    
    keyInputs: [
      {
        label: 'Market Opportunity Assessment',
        description: 'Target market size, unmet needs, competitive gaps',
        userDefined: true
      },
      {
        label: 'Go-to-Market Strategy',
        description: 'Launch channels, pricing, positioning, messaging',
        userDefined: true
      },
      {
        label: 'Product Readiness Metrics',
        description: 'Development milestones, beta results, quality gates',
        userDefined: true
      },
      {
        label: 'Success Benchmarks',
        description: 'Adoption targets, revenue goals, market share objectives',
        userDefined: true
      }
    ],
    
    aiMonitoring: [
      'Market demand signals and customer sentiment',
      'Competitive product announcements and positioning shifts',
      'Technology trends and innovation opportunities',
      'Early customer adoption and feedback patterns',
      'Distribution channel performance and inventory levels'
    ],
    
    triggers: [
      {
        condition: 'Market opportunity window detected',
        threshold: 'Demand surge >40% or competitor gap identified',
        userDefined: true
      },
      {
        condition: 'Product readiness achieved',
        threshold: 'Beta NPS >45, defect rate <YOUR threshold',
        userDefined: true
      },
      {
        condition: 'Launch timing optimization',
        threshold: 'Market conditions favorable, competitive timing ideal',
        userDefined: true
      }
    ],
    
    outputs: [
      {
        label: 'Launch Execution Plan',
        description: 'Coordinated go-to-market playbook with all stakeholders',
        metric: '12-minute activation from opportunity signal'
      },
      {
        label: 'Market Penetration Strategy',
        description: 'Channel activation, pricing execution, messaging deployment',
        metric: 'First customer acquisition within 48 hours'
      },
      {
        label: 'Adoption Dashboard',
        description: 'Real-time tracking of customer acquisition and revenue',
        metric: 'Live metrics on market capture and competitive position'
      },
      {
        label: 'Competitive Advantage Report',
        description: 'Analysis of differentiation and market response',
        metric: 'Weekly insights on positioning effectiveness'
      }
    ],
    
    learning: [
      {
        observation: 'Early beta customer feedback accelerated time-to-market by 3 weeks',
        recommendation: 'Build beta program triggers into product development playbooks'
      },
      {
        observation: 'Competitor launched similar product 2 weeks after - our speed created first-mover advantage',
        recommendation: 'Monitor competitive intel daily during product development phases'
      }
    ],
    
    situation: 'Market research identifies $200M opportunity for AI-powered analytics platform. Competitors developing similar solutions. Window to establish market leadership: 90 days. Must coordinate product, engineering, marketing, sales, and customer success for flawless launch.',
    
    traditionalApproach: {
      description: 'Sequential planning: product finalization → marketing campaign → sales training → launch. Manual coordination across teams, delayed decision-making, reactive adjustments.',
      timeline: '6-month launch preparation, missed market window',
      cost: '$4.5M in delays, competitor launched first, 30% market share lost'
    },
    
    mApproach: {
      description: 'Build launch playbook monitoring market signals, competitive moves, product readiness. AI detects optimal launch window, triggers coordinated execution across all teams in 12 minutes.',
      timeline: '45-day launch, captured market opportunity window',
      outcome: '$12M first-year revenue, 42% market share, first-mover advantage secured'
    }
  }
];

export function getScenarioById(id: string): Scenario | undefined {
  return scenarios.find(s => s.id === id);
}

export function getScenariosByCategory(category: ScenarioCategory): Scenario[] {
  return scenarios.filter(s => s.category === category);
}

export const scenarioCategoryInfo = {
  'offensive': {
    name: 'Offensive Playbooks',
    description: 'Drive growth and capture market opportunities',
    count: 6,
    color: 'green'
  },
  'defensive': {
    name: 'Defensive Playbooks',
    description: 'Protect position and mitigate threats',
    count: 2,
    color: 'blue'
  },
  'special-teams': {
    name: 'Special Teams',
    description: 'Game-changing moments and transformations',
    count: 5,
    color: 'purple'
  }
};
