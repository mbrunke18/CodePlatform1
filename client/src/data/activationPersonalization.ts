type ActivationPhase = 'IMMEDIATE' | 'SECONDARY' | 'FOLLOW_UP';

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500',
  'bg-rose-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-pink-500',
  'bg-teal-500', 'bg-orange-500'
];

export interface RoleOverlay {
  label: string;
  perspective: string;
  highlightedTaskIds: string[];
  yourActions: string[];
  kpis: { label: string; value: string; color: string }[];
  completionMetrics: { label: string; before: string; after: string }[];
}

export interface IndustryStakeholder {
  id: string;
  name: string;
  title: string;
  department: string;
  tier: 1 | 2;
  status: 'pending';
  initials: string;
  color: string;
}

export interface IndustryTask {
  id: string;
  name: string;
  owner: string;
  phase: ActivationPhase;
  status: 'pending';
}

export interface IndustryOverlay {
  label: string;
  perspective: string;
  scenario: string;
  organization: string;
  stakeholders: Record<string, IndustryStakeholder[]>;
  tasks: Record<string, IndustryTask[]>;
  kpis: { label: string; value: string; color: string }[];
  completionMetrics: { label: string; before: string; after: string }[];
}

export const ROLE_OVERLAYS: Record<string, RoleOverlay> = {
  ceo: {
    label: 'CEO',
    perspective: 'Your view: enterprise-wide coordination velocity and strategic alignment across all business units.',
    highlightedTaskIds: ['t1', 't2', 't4', 't12'],
    yourActions: ['Approve activation scope', 'Review stakeholder alignment', 'Sign off on external communications'],
    kpis: [
      { label: 'Strategic Alignment', value: '100%', color: 'text-emerald-400' },
      { label: 'Cross-BU Coordination', value: 'Simultaneous', color: 'text-blue-400' },
      { label: 'Board Readiness', value: 'Brief auto-generated', color: 'text-purple-400' },
    ],
    completionMetrics: [
      { label: 'Execution Gap Closed', before: '$144M annual loss', after: 'Full coordination in 12 min' },
      { label: 'Board Communication', before: '48-72 hours to brief', after: 'Auto-generated in real-time' },
      { label: 'Cross-Functional Sync', before: 'Sequential over weeks', after: 'Simultaneous activation' },
    ],
  },
  cfo: {
    label: 'CFO',
    perspective: 'Your view: financial controls, budget allocation, and fiscal risk mitigation activated automatically.',
    highlightedTaskIds: ['t3', 't8', 't9'],
    yourActions: ['Approve pre-allocated budget release', 'Verify financial system lockdowns', 'Review regulatory filing readiness'],
    kpis: [
      { label: 'Budget Auto-Allocated', value: '$2.1M pre-approved', color: 'text-emerald-400' },
      { label: 'Financial Controls', value: 'Locked in 47 sec', color: 'text-blue-400' },
      { label: 'Year 1 ROI', value: '$114M', color: 'text-amber-400' },
    ],
    completionMetrics: [
      { label: 'Budget Allocation', before: '2-3 weeks approval cycle', after: 'Pre-approved, instant release' },
      { label: 'Financial Risk Window', before: 'Days of exposure', after: 'Locked in under 1 minute' },
      { label: 'Cost of Coordination', before: '$2.1M per event', after: '85% reduction' },
    ],
  },
  coo: {
    label: 'COO',
    perspective: 'Your view: operational continuity, cross-functional handoffs, and integration velocity across every business unit.',
    highlightedTaskIds: ['t1', 't5', 't6', 't11'],
    yourActions: ['Verify operational continuity plans', 'Monitor cross-team sync cadence', 'Approve integration milestones'],
    kpis: [
      { label: 'Ops Continuity', value: 'Zero downtime', color: 'text-emerald-400' },
      { label: 'Handoff Velocity', value: 'Parallel, not sequential', color: 'text-blue-400' },
      { label: 'Mobilization Cycle', value: '30 days → 12 min', color: 'text-amber-400' },
    ],
    completionMetrics: [
      { label: 'Operational Handoffs', before: 'Sequential over days', after: 'Parallel in minutes' },
      { label: 'Business Continuity', before: 'Manual activation', after: 'Automated orchestration' },
      { label: 'Integration Timeline', before: '72 hours minimum', after: '12-minute coordination' },
    ],
  },
  cmo: {
    label: 'CMO',
    perspective: 'Your view: market-facing communications, brand protection, and customer messaging coordinated in real-time.',
    highlightedTaskIds: ['t4', 't7', 't10'],
    yourActions: ['Approve external messaging', 'Coordinate brand alignment', 'Review customer communication sequence'],
    kpis: [
      { label: 'Brand Protection', value: 'Messaging in 3 min', color: 'text-emerald-400' },
      { label: 'Market Response', value: '21 days → 3 days', color: 'text-blue-400' },
      { label: 'Share Preserved', value: '$12M protected', color: 'text-amber-400' },
    ],
    completionMetrics: [
      { label: 'Market Communication', before: '5-7 days to coordinate', after: 'Pre-staged, instant deploy' },
      { label: 'Brand Consistency', before: 'Manual review chain', after: 'Pre-approved templates' },
      { label: 'Competitive Window', before: 'Weeks of vulnerability', after: 'Hours to full response' },
    ],
  },
  cto: {
    label: 'CTO',
    perspective: 'Your view: technology integration, systems access coordination, and engineering team orchestration.',
    highlightedTaskIds: ['t1', 't2', 't4', 't5', 't9'],
    yourActions: ['Deploy governance dashboard', 'Coordinate AI model inventory', 'Approve technology integration plan'],
    kpis: [
      { label: 'Systems Integrated', value: '12 platforms synced', color: 'text-emerald-400' },
      { label: 'Tech Debt Avoided', value: '$8M in rework', color: 'text-blue-400' },
      { label: 'Adoption Rate', value: '82% in 90 days', color: 'text-purple-400' },
    ],
    completionMetrics: [
      { label: 'Technology Integration', before: '36 months average', after: '22 months with Execution OS' },
      { label: 'Cross-System Sync', before: 'Manual API coordination', after: 'Automated orchestration' },
      { label: 'Engineering Alignment', before: 'Weeks of planning', after: 'Instant task assignment' },
    ],
  },
  ciso: {
    label: 'CISO',
    perspective: 'Your view: coordinated incident response — containment, forensics, legal, and recovery executing simultaneously.',
    highlightedTaskIds: ['t1', 't2', 't4', 't5', 't12'],
    yourActions: ['Authorize containment protocol', 'Review forensics scope', 'Approve recovery sequence'],
    kpis: [
      { label: 'Containment', value: '< 4 min', color: 'text-emerald-400' },
      { label: 'Forensics Engaged', value: 'Parallel with legal', color: 'text-blue-400' },
      { label: 'Recovery Started', value: 'Before hour 1', color: 'text-amber-400' },
    ],
    completionMetrics: [
      { label: 'Incident Response', before: '8+ hours to coordinate', after: '47 minutes full containment' },
      { label: 'Forensics Initiation', before: 'After containment', after: 'Simultaneous with response' },
      { label: 'Regulatory Notification', before: 'Days to prepare', after: 'Auto-generated, review-ready' },
    ],
  },
  chro: {
    label: 'CHRO',
    perspective: 'Your view: people-focused coordination — retention strategies, cultural integration, and talent transition plans.',
    highlightedTaskIds: ['t6', 't7', 't10', 't11'],
    yourActions: ['Activate retention program', 'Approve cultural integration plan', 'Review talent transition sequence'],
    kpis: [
      { label: 'Retention Risk', value: 'Flagged in 2 min', color: 'text-emerald-400' },
      { label: 'Employee Engagement', value: '85% maintained', color: 'text-blue-400' },
      { label: 'Transition Savings', value: '$2.1M', color: 'text-amber-400' },
    ],
    completionMetrics: [
      { label: 'Talent Retention', before: '15-25% attrition post-event', after: '< 5% with proactive outreach' },
      { label: 'Cultural Integration', before: '6+ months to align', after: 'Day 1 activation' },
      { label: 'HR Cost Reduction', before: '$2.1M in reactive hiring', after: 'Proactive retention saves 85%' },
    ],
  },
  cdo: {
    label: 'CDO',
    perspective: 'Your view: data governance, compliance verification, and cross-functional AI policy deployment in real-time.',
    highlightedTaskIds: ['t2', 't5', 't6', 't9'],
    yourActions: ['Verify data lineage compliance', 'Approve AI model inventory scope', 'Review bias audit parameters'],
    kpis: [
      { label: 'Models Inventoried', value: '100% in 4 min', color: 'text-emerald-400' },
      { label: 'Data Compliance', value: 'Auto-verified', color: 'text-blue-400' },
      { label: 'Churn Prevention', value: '92% save rate', color: 'text-purple-400' },
    ],
    completionMetrics: [
      { label: 'Data Signal to Action', before: '14 days average', after: '2 hours with Execution OS' },
      { label: 'Model Governance', before: 'Quarterly manual audit', after: 'Continuous automated monitoring' },
      { label: 'Customer Save Rate', before: '60% after manual outreach', after: '92% with instant coordination' },
    ],
  },
  gc: {
    label: 'General Counsel',
    perspective: 'Your view: legal review, regulatory notifications, and compliance workflows executing alongside operational response.',
    highlightedTaskIds: ['t3', 't6', 't8', 't9'],
    yourActions: ['Review regulatory filing', 'Approve compliance documentation', 'Verify legal exposure assessment'],
    kpis: [
      { label: 'Legal Review', value: 'Pre-staged docs', color: 'text-emerald-400' },
      { label: 'Regulatory Filing', value: 'Auto-drafted', color: 'text-blue-400' },
      { label: 'Compliance Speed', value: '5 weeks → 10 days', color: 'text-amber-400' },
    ],
    completionMetrics: [
      { label: 'Regulatory Compliance', before: '5 weeks to file', after: '10 days with pre-staged docs' },
      { label: 'Legal Exposure', before: 'Unknown for days', after: 'Assessed in minutes' },
      { label: 'Document Preparation', before: 'Manual drafting', after: 'Auto-generated, review-ready' },
    ],
  },
  cco: {
    label: 'CCO',
    perspective: 'Your view: compliance frameworks, audit responses, and regulatory coordination deployed across the entire organization.',
    highlightedTaskIds: ['t3', 't6', 't8', 't9', 't10'],
    yourActions: ['Verify compliance framework deployment', 'Approve audit response coordination', 'Review policy distribution status'],
    kpis: [
      { label: 'Compliance Coverage', value: '100% org-wide', color: 'text-emerald-400' },
      { label: 'Audit Readiness', value: '10 days → 2 days', color: 'text-blue-400' },
      { label: 'Policy Distribution', value: 'Auto-tracked', color: 'text-purple-400' },
    ],
    completionMetrics: [
      { label: 'Audit Response', before: '10 business days', after: '2 days with Execution OS' },
      { label: 'Compliance Gaps', before: 'Discovered during audit', after: 'Pre-identified and resolved' },
      { label: 'Policy Acknowledgment', before: 'Manual tracking', after: '100% automated verification' },
    ],
  },
  cso: {
    label: 'CSO',
    perspective: 'Your view: strategic execution velocity — every initiative coordinated with pre-approved resources and aligned stakeholders.',
    highlightedTaskIds: ['t1', 't4', 't10', 't11', 't12'],
    yourActions: ['Verify strategic alignment', 'Review execution velocity metrics', 'Approve resource allocation'],
    kpis: [
      { label: 'Strategy Delivery', value: '70% → 95%', color: 'text-emerald-400' },
      { label: 'Execution Gap', value: '$144M closed', color: 'text-blue-400' },
      { label: 'Initiative Velocity', value: '6x faster', color: 'text-amber-400' },
    ],
    completionMetrics: [
      { label: 'Strategy Execution', before: '70% on-time delivery', after: '95% with Execution OS coordination' },
      { label: 'Execution Gap', before: '$144M in unrealized value', after: 'Closed through automation' },
      { label: 'Initiative Launch', before: 'Weeks to mobilize', after: '12 minutes to full coordination' },
    ],
  },
  cro: {
    label: 'CRO',
    perspective: 'Your view: revenue-impacting coordination — customer notifications, sales enablement, and pipeline protection in real-time.',
    highlightedTaskIds: ['t4', 't7', 't9', 't10'],
    yourActions: ['Approve customer notification sequence', 'Review pipeline impact assessment', 'Coordinate sales enablement update'],
    kpis: [
      { label: 'Pipeline Protected', value: '$44M revenue', color: 'text-emerald-400' },
      { label: 'Proposal Speed', value: '21 days → 5 days', color: 'text-blue-400' },
      { label: 'Win Rate Impact', value: '+5% lift', color: 'text-amber-400' },
    ],
    completionMetrics: [
      { label: 'Revenue Protection', before: 'Pipeline at risk for weeks', after: 'Customers notified in minutes' },
      { label: 'Sales Enablement', before: 'Manual update cycle', after: 'Auto-staged materials' },
      { label: 'Win Rate', before: 'Delayed proposals cost 5%', after: 'Maintained with speed advantage' },
    ],
  },
};

export const INDUSTRY_OVERLAYS: Record<string, IndustryOverlay> = {
  luxury: {
    label: 'Luxury Goods',
    perspective: 'See how a global luxury conglomerate coordinates 10+ brands across 15 cities simultaneously.',
    scenario: 'China Luxury Renaissance — 10-Brand Simultaneous Launch',
    organization: 'LVMH Moët Hennessy Louis Vuitton',
    stakeholders: {
      'ma-day1': [
        { id: 's1', name: 'Bernard Arnault', title: 'Chairman & CEO', department: 'Executive', tier: 1, status: 'pending', initials: 'BA', color: AVATAR_COLORS[0] },
        { id: 's2', name: 'Jean-Jacques Guiony', title: 'CFO', department: 'Finance', tier: 1, status: 'pending', initials: 'JG', color: AVATAR_COLORS[1] },
        { id: 's3', name: 'Chantal Gaemperle', title: 'CHRO', department: 'Human Resources', tier: 1, status: 'pending', initials: 'CG', color: AVATAR_COLORS[2] },
        { id: 's4', name: 'Pietro Beccari', title: 'CEO, Louis Vuitton', department: 'Fashion & Leather', tier: 1, status: 'pending', initials: 'PB', color: AVATAR_COLORS[3] },
        { id: 's5', name: 'Delphine Arnault', title: 'CEO, Dior', department: 'Fashion Division', tier: 1, status: 'pending', initials: 'DA', color: AVATAR_COLORS[4] },
        { id: 's6', name: 'Philippe Schaus', title: 'CEO, Moët Hennessy', department: 'Wines & Spirits', tier: 2, status: 'pending', initials: 'PS', color: AVATAR_COLORS[5] },
        { id: 's7', name: 'Andrew Wu', title: 'President, Greater China', department: 'APAC Region', tier: 2, status: 'pending', initials: 'AW', color: AVATAR_COLORS[6] },
        { id: 's8', name: 'Marc Jacobs', title: 'VP Brand Strategy', department: 'Creative Direction', tier: 2, status: 'pending', initials: 'MJ', color: AVATAR_COLORS[7] },
        { id: 's9', name: 'Sophie Laurent', title: 'VP Retail Operations', department: 'Global Retail', tier: 2, status: 'pending', initials: 'SL', color: AVATAR_COLORS[8] },
        { id: 's10', name: 'Chen Wei', title: 'VP Digital & E-Commerce', department: 'Digital Strategy', tier: 2, status: 'pending', initials: 'CW', color: AVATAR_COLORS[9] },
      ],
    },
    tasks: {
      'ma-day1': [
        { id: 't1', name: 'Activate Multi-Brand Launch War Room', owner: 'PMO Lead', phase: 'IMMEDIATE', status: 'pending' },
        { id: 't2', name: 'Notify 10 Brand CEOs Simultaneously', owner: 'Chairman Office', phase: 'IMMEDIATE', status: 'pending' },
        { id: 't3', name: 'Stage 47 Retail Location Openings', owner: 'VP Retail Operations', phase: 'IMMEDIATE', status: 'pending' },
        { id: 't4', name: 'Deploy China Market Communications', owner: 'President Greater China', phase: 'IMMEDIATE', status: 'pending' },
        { id: 't5', name: 'Coordinate WeChat/Tmall Campaigns', owner: 'VP Digital', phase: 'SECONDARY', status: 'pending' },
        { id: 't6', name: 'Activate Celebrity Ambassador Network', owner: 'VP Brand Strategy', phase: 'SECONDARY', status: 'pending' },
        { id: 't7', name: 'Synchronize Pricing Across Brands', owner: 'CFO', phase: 'SECONDARY', status: 'pending' },
        { id: 't8', name: 'CFDA Regulatory Filing (15 Cities)', owner: 'Legal', phase: 'SECONDARY', status: 'pending' },
        { id: 't9', name: 'Supply Chain — Stock 47 Locations', owner: 'VP Supply Chain', phase: 'FOLLOW_UP', status: 'pending' },
        { id: 't10', name: 'Cross-Brand Customer Experience Sync', owner: 'VP Retail', phase: 'FOLLOW_UP', status: 'pending' },
        { id: 't11', name: 'VIP Client Invitation Sequence', owner: 'CRM Team', phase: 'FOLLOW_UP', status: 'pending' },
        { id: 't12', name: 'Launch Performance Dashboard Go-Live', owner: 'VP Digital', phase: 'FOLLOW_UP', status: 'pending' },
      ],
    },
    kpis: [
      { label: 'Brands Coordinated', value: '10 simultaneously', color: 'text-purple-400' },
      { label: 'Cities Launched', value: '15 markets', color: 'text-blue-400' },
      { label: 'Value Creation', value: '€1.68B projected', color: 'text-emerald-400' },
    ],
    completionMetrics: [
      { label: 'Multi-Brand Launch', before: '6-9 months sequential', after: 'Simultaneous in 12 minutes' },
      { label: 'Market Entry Speed', before: 'Brand-by-brand rollout', after: '10 brands, 15 cities at once' },
      { label: 'Revenue Capture', before: '€400M first-year estimate', after: '€1.68B with speed advantage' },
    ],
  },
  'fast-fashion': {
    label: 'Fast Fashion',
    perspective: 'Watch trend capitalization coordination — from detection to 200-SKU production in minutes, not weeks.',
    scenario: 'TikTok Cottage Core Trend — 200 SKUs in 7 Days',
    organization: 'SHEIN (Global Fashion Marketplace)',
    stakeholders: {
      'ma-day1': [
        { id: 's1', name: 'Chris Xu', title: 'CEO & Founder', department: 'Executive', tier: 1, status: 'pending', initials: 'CX', color: AVATAR_COLORS[0] },
        { id: 's2', name: 'Molly Miao', title: 'CMO', department: 'Marketing', tier: 1, status: 'pending', initials: 'MM', color: AVATAR_COLORS[1] },
        { id: 's3', name: 'Leonard Lin', title: 'VP Supply Chain', department: 'Operations', tier: 1, status: 'pending', initials: 'LL', color: AVATAR_COLORS[2] },
        { id: 's4', name: 'Priya Sharma', title: 'Head of Trend Analytics', department: 'Data Science', tier: 1, status: 'pending', initials: 'PS', color: AVATAR_COLORS[3] },
        { id: 's5', name: 'David Chen', title: 'VP Product Design', department: 'Design', tier: 1, status: 'pending', initials: 'DC', color: AVATAR_COLORS[4] },
        { id: 's6', name: 'Sarah Kim', title: 'Head of TikTok Partnerships', department: 'Social Commerce', tier: 2, status: 'pending', initials: 'SK', color: AVATAR_COLORS[5] },
        { id: 's7', name: 'Wei Zhang', title: 'Factory Coordination Lead', department: 'Manufacturing', tier: 2, status: 'pending', initials: 'WZ', color: AVATAR_COLORS[6] },
        { id: 's8', name: 'Emily Ross', title: 'VP Influencer Relations', department: 'Partnerships', tier: 2, status: 'pending', initials: 'ER', color: AVATAR_COLORS[7] },
        { id: 's9', name: 'James Liu', title: 'Head of Logistics', department: 'Fulfillment', tier: 2, status: 'pending', initials: 'JL', color: AVATAR_COLORS[8] },
        { id: 's10', name: 'Anna Torres', title: 'VP Merchandising', department: 'Commerce', tier: 2, status: 'pending', initials: 'AT', color: AVATAR_COLORS[9] },
      ],
    },
    tasks: {
      'ma-day1': [
        { id: 't1', name: 'Activate Trend Response War Room', owner: 'Head of Trend Analytics', phase: 'IMMEDIATE', status: 'pending' },
        { id: 't2', name: 'Confirm Trend Signal (47M views)', owner: 'Data Science', phase: 'IMMEDIATE', status: 'pending' },
        { id: 't3', name: 'Brief 200-SKU Design Sprint', owner: 'VP Product Design', phase: 'IMMEDIATE', status: 'pending' },
        { id: 't4', name: 'Reserve Factory Capacity (5,847 units)', owner: 'Factory Coordination', phase: 'IMMEDIATE', status: 'pending' },
        { id: 't5', name: 'Launch Influencer Seeding Campaign', owner: 'VP Influencer Relations', phase: 'SECONDARY', status: 'pending' },
        { id: 't6', name: 'Coordinate TikTok Shop Integration', owner: 'Head of TikTok Partnerships', phase: 'SECONDARY', status: 'pending' },
        { id: 't7', name: 'Pricing & Margin Analysis', owner: 'CMO', phase: 'SECONDARY', status: 'pending' },
        { id: 't8', name: 'Logistics Pre-Position for 12 Markets', owner: 'Head of Logistics', phase: 'SECONDARY', status: 'pending' },
        { id: 't9', name: 'Quality Assurance Fast-Track', owner: 'QA Team', phase: 'FOLLOW_UP', status: 'pending' },
        { id: 't10', name: 'Merchandising Page Build', owner: 'VP Merchandising', phase: 'FOLLOW_UP', status: 'pending' },
        { id: 't11', name: 'Social Proof Content Pipeline', owner: 'Marketing', phase: 'FOLLOW_UP', status: 'pending' },
        { id: 't12', name: 'Sales Velocity Dashboard Go-Live', owner: 'Data Science', phase: 'FOLLOW_UP', status: 'pending' },
      ],
    },
    kpis: [
      { label: 'TikTok Signal', value: '47M views detected', color: 'text-pink-400' },
      { label: 'SKUs Activated', value: '200 designs', color: 'text-blue-400' },
      { label: 'Revenue Opportunity', value: '$108M captured', color: 'text-emerald-400' },
    ],
    completionMetrics: [
      { label: 'Trend Response', before: '48-72 hours to mobilize', after: '12 minutes to full coordination' },
      { label: 'SKU Launch', before: '14-21 day pipeline', after: '7 days with pre-staged supply chain' },
      { label: 'Revenue Captured', before: '$72M (late to trend)', after: '$108M (first mover)' },
    ],
  },
  aerospace: {
    label: 'Aerospace',
    perspective: 'See launch schedule acceleration coordination across engineering, safety, and operations teams.',
    scenario: 'Orbital Window — 3-Day Launch Advancement',
    organization: 'SpaceX (Space Transportation)',
    stakeholders: {
      'ma-day1': [
        { id: 's1', name: 'Gwynne Shotwell', title: 'President & COO', department: 'Executive', tier: 1, status: 'pending', initials: 'GS', color: AVATAR_COLORS[0] },
        { id: 's2', name: 'Bill Gerstenmaier', title: 'VP Build & Flight Reliability', department: 'Engineering', tier: 1, status: 'pending', initials: 'BG', color: AVATAR_COLORS[1] },
        { id: 's3', name: 'Mark Juncosa', title: 'VP Vehicle Engineering', department: 'Vehicle Ops', tier: 1, status: 'pending', initials: 'MJ', color: AVATAR_COLORS[2] },
        { id: 's4', name: 'Jon Edwards', title: 'VP Launch Operations', department: 'Launch Ops', tier: 1, status: 'pending', initials: 'JE', color: AVATAR_COLORS[3] },
        { id: 's5', name: 'Sarah Walker', title: 'Director, Mission Mgmt', department: 'Mission Control', tier: 1, status: 'pending', initials: 'SW', color: AVATAR_COLORS[4] },
        { id: 's6', name: 'Brian Bjelde', title: 'VP HR & Facilities', department: 'Operations', tier: 2, status: 'pending', initials: 'BB', color: AVATAR_COLORS[5] },
        { id: 's7', name: 'Lars Blackmore', title: 'Principal Engineer, GN&C', department: 'Guidance Systems', tier: 2, status: 'pending', initials: 'LB', color: AVATAR_COLORS[6] },
        { id: 's8', name: 'Jessica Jensen', title: 'VP Customer Ops', department: 'Customer Relations', tier: 2, status: 'pending', initials: 'JJ', color: AVATAR_COLORS[7] },
        { id: 's9', name: 'Andy Tran', title: 'Range Safety Officer', department: 'Safety', tier: 2, status: 'pending', initials: 'AT', color: AVATAR_COLORS[8] },
        { id: 's10', name: 'Kiko Dontchev', title: 'VP Launch Development', department: 'Starship Program', tier: 2, status: 'pending', initials: 'KD', color: AVATAR_COLORS[9] },
      ],
    },
    tasks: {
      'ma-day1': [
        { id: 't1', name: 'Activate Launch Advancement Protocol', owner: 'VP Launch Ops', phase: 'IMMEDIATE', status: 'pending' },
        { id: 't2', name: 'Confirm Orbital Window Viability', owner: 'Mission Management', phase: 'IMMEDIATE', status: 'pending' },
        { id: 't3', name: 'Notify 23 Satellite Customers', owner: 'VP Customer Ops', phase: 'IMMEDIATE', status: 'pending' },
        { id: 't4', name: 'Range Safety Reauthorization', owner: 'Range Safety Officer', phase: 'IMMEDIATE', status: 'pending' },
        { id: 't5', name: 'Vehicle Readiness Fast-Track Review', owner: 'VP Vehicle Engineering', phase: 'SECONDARY', status: 'pending' },
        { id: 't6', name: 'Propellant Loading Reschedule', owner: 'Launch Ops Team', phase: 'SECONDARY', status: 'pending' },
        { id: 't7', name: 'Ground Systems Reconfiguration', owner: 'Facilities Team', phase: 'SECONDARY', status: 'pending' },
        { id: 't8', name: 'FAA Launch License Amendment', owner: 'Legal & Regulatory', phase: 'SECONDARY', status: 'pending' },
        { id: 't9', name: 'Weather Analysis Update', owner: 'Mission Control', phase: 'FOLLOW_UP', status: 'pending' },
        { id: 't10', name: 'Telemetry & Tracking Sync', owner: 'GN&C Team', phase: 'FOLLOW_UP', status: 'pending' },
        { id: 't11', name: 'Crew Scheduling Adjustment', owner: 'VP HR', phase: 'FOLLOW_UP', status: 'pending' },
        { id: 't12', name: 'Launch Readiness Review (LRR)', owner: 'President & COO', phase: 'FOLLOW_UP', status: 'pending' },
      ],
    },
    kpis: [
      { label: 'Satellites Deployed', value: '23 payloads', color: 'text-blue-400' },
      { label: 'Schedule Compression', value: '3 days advanced', color: 'text-emerald-400' },
      { label: 'Revenue Protected', value: '$47M + positioning', color: 'text-amber-400' },
    ],
    completionMetrics: [
      { label: 'Launch Schedule', before: '5-7 days to reschedule', after: '12 minutes to full coordination' },
      { label: 'Customer Notification', before: 'Individual outreach over days', after: '23 customers notified simultaneously' },
      { label: 'Revenue Impact', before: 'Window missed = $47M lost', after: 'Captured with 3-day advancement' },
    ],
  },
  financial: {
    label: 'Financial Services',
    perspective: 'Watch coordinated breach response across security, legal, regulatory, and customer-facing teams.',
    scenario: 'Banking Infrastructure Breach',
    organization: 'LoanDepot (Major Mortgage Lender)',
    stakeholders: {
      'ransomware': [
        { id: 's1', name: 'Frank Martell', title: 'President & CEO', department: 'Executive', tier: 1, status: 'pending', initials: 'FM', color: AVATAR_COLORS[0] },
        { id: 's2', name: 'David Hayes', title: 'CISO', department: 'Information Security', tier: 1, status: 'pending', initials: 'DH', color: AVATAR_COLORS[1] },
        { id: 's3', name: 'Patrick Flanagan', title: 'CFO', department: 'Finance', tier: 1, status: 'pending', initials: 'PF', color: AVATAR_COLORS[2] },
        { id: 's4', name: 'Nicole Carrillo', title: 'Chief Risk Officer', department: 'Risk Management', tier: 1, status: 'pending', initials: 'NC', color: AVATAR_COLORS[3] },
        { id: 's5', name: 'Jeff Walsh', title: 'General Counsel', department: 'Legal', tier: 1, status: 'pending', initials: 'JW', color: AVATAR_COLORS[4] },
        { id: 's6', name: 'Michael Torres', title: 'VP Incident Response', department: 'Security Ops', tier: 2, status: 'pending', initials: 'MT', color: AVATAR_COLORS[5] },
        { id: 's7', name: 'Karen Liu', title: 'Head of Regulatory Affairs', department: 'Compliance', tier: 2, status: 'pending', initials: 'KL', color: AVATAR_COLORS[6] },
        { id: 's8', name: 'Thomas Reed', title: 'VP Customer Operations', department: 'Customer Service', tier: 2, status: 'pending', initials: 'TR', color: AVATAR_COLORS[7] },
        { id: 's9', name: 'Jennifer Park', title: 'VP Mortgage Servicing', department: 'Loan Operations', tier: 2, status: 'pending', initials: 'JP', color: AVATAR_COLORS[8] },
        { id: 's10', name: 'Robert Chen', title: 'VP Infrastructure', department: 'IT Operations', tier: 2, status: 'pending', initials: 'RC', color: AVATAR_COLORS[9] },
      ],
    },
    tasks: {
      'ransomware': [
        { id: 't1', name: 'Isolate Core Banking Systems', owner: 'CISO', phase: 'IMMEDIATE', status: 'pending' },
        { id: 't2', name: 'Activate Incident Response Team', owner: 'VP Incident Response', phase: 'IMMEDIATE', status: 'pending' },
        { id: 't3', name: 'Freeze Wire Transfer Systems', owner: 'VP Mortgage Servicing', phase: 'IMMEDIATE', status: 'pending' },
        { id: 't4', name: 'Engage Digital Forensics (CrowdStrike)', owner: 'CISO', phase: 'IMMEDIATE', status: 'pending' },
        { id: 't5', name: 'Notify OCC & State Regulators', owner: 'Head of Regulatory Affairs', phase: 'SECONDARY', status: 'pending' },
        { id: 't6', name: 'Assess 2M Borrower Data Exposure', owner: 'Chief Risk Officer', phase: 'SECONDARY', status: 'pending' },
        { id: 't7', name: 'Activate Backup Loan Servicing', owner: 'VP Mortgage Servicing', phase: 'SECONDARY', status: 'pending' },
        { id: 't8', name: 'Draft SEC 8-K Filing', owner: 'General Counsel', phase: 'SECONDARY', status: 'pending' },
        { id: 't9', name: 'Customer Breach Notification Prep', owner: 'VP Customer Operations', phase: 'FOLLOW_UP', status: 'pending' },
        { id: 't10', name: 'Cyber Insurance Claim Initiation', owner: 'CFO', phase: 'FOLLOW_UP', status: 'pending' },
        { id: 't11', name: 'Systems Restoration Sequence', owner: 'VP Infrastructure', phase: 'FOLLOW_UP', status: 'pending' },
        { id: 't12', name: 'Post-Incident Board Brief', owner: 'CEO', phase: 'FOLLOW_UP', status: 'pending' },
      ],
    },
    kpis: [
      { label: 'Banking Systems', value: 'Isolated in 2 min', color: 'text-red-400' },
      { label: 'Borrowers Protected', value: '2M accounts', color: 'text-blue-400' },
      { label: 'Cost Avoided', value: '$22M', color: 'text-emerald-400' },
    ],
    completionMetrics: [
      { label: 'System Isolation', before: '4-8 hours manual', after: '2 minutes automated' },
      { label: 'Regulatory Notification', before: 'Days to prepare filing', after: 'Auto-drafted OCC + SEC notices' },
      { label: 'Customer Impact', before: 'Weeks of uncertainty', after: '2M borrowers notified in hours' },
    ],
  },
  pharma: {
    label: 'Pharmaceutical',
    perspective: 'See Class I recall coordination — regulatory notifications, supply chain halt, and patient safety in parallel.',
    scenario: 'Class I Recall — Life-Threatening Defect',
    organization: 'Glenmark Pharmaceuticals',
    stakeholders: {
      'ransomware': [
        { id: 's1', name: 'Glenn Saldanha', title: 'Chairman & CEO', department: 'Executive', tier: 1, status: 'pending', initials: 'GS', color: AVATAR_COLORS[0] },
        { id: 's2', name: 'Tushar Mistry', title: 'CFO', department: 'Finance', tier: 1, status: 'pending', initials: 'TM', color: AVATAR_COLORS[1] },
        { id: 's3', name: 'Rajesh Desai', title: 'VP Regulatory Affairs', department: 'Regulatory', tier: 1, status: 'pending', initials: 'RD', color: AVATAR_COLORS[2] },
        { id: 's4', name: 'Dr. Priya Mehta', title: 'Chief Medical Officer', department: 'Medical Affairs', tier: 1, status: 'pending', initials: 'PM', color: AVATAR_COLORS[3] },
        { id: 's5', name: 'Anand Kumar', title: 'VP Quality Assurance', department: 'Quality', tier: 1, status: 'pending', initials: 'AK', color: AVATAR_COLORS[4] },
        { id: 's6', name: 'Lisa Fernandez', title: 'VP Supply Chain', department: 'Supply Chain', tier: 2, status: 'pending', initials: 'LF', color: AVATAR_COLORS[5] },
        { id: 's7', name: 'David Park', title: 'General Counsel', department: 'Legal', tier: 2, status: 'pending', initials: 'DP', color: AVATAR_COLORS[6] },
        { id: 's8', name: 'Rachel Torres', title: 'VP Pharmacovigilance', department: 'Drug Safety', tier: 2, status: 'pending', initials: 'RT', color: AVATAR_COLORS[7] },
        { id: 's9', name: 'Mark Johnson', title: 'VP Distribution', department: 'Logistics', tier: 2, status: 'pending', initials: 'MJ', color: AVATAR_COLORS[8] },
        { id: 's10', name: 'Sarah Williams', title: 'VP Patient Relations', department: 'Patient Services', tier: 2, status: 'pending', initials: 'SW', color: AVATAR_COLORS[9] },
      ],
    },
    tasks: {
      'ransomware': [
        { id: 't1', name: 'Halt Production Lines (3 Facilities)', owner: 'VP Quality Assurance', phase: 'IMMEDIATE', status: 'pending' },
        { id: 't2', name: 'File FDA Class I Recall Notice', owner: 'VP Regulatory Affairs', phase: 'IMMEDIATE', status: 'pending' },
        { id: 't3', name: 'Activate Patient Safety Hotline', owner: 'Chief Medical Officer', phase: 'IMMEDIATE', status: 'pending' },
        { id: 't4', name: 'Notify 12,000+ Pharmacies', owner: 'VP Distribution', phase: 'IMMEDIATE', status: 'pending' },
        { id: 't5', name: 'Quarantine 47M Units in Channel', owner: 'VP Supply Chain', phase: 'SECONDARY', status: 'pending' },
        { id: 't6', name: 'Adverse Event Monitoring Activation', owner: 'VP Pharmacovigilance', phase: 'SECONDARY', status: 'pending' },
        { id: 't7', name: 'Healthcare Provider Alert Blast', owner: 'VP Patient Relations', phase: 'SECONDARY', status: 'pending' },
        { id: 't8', name: 'Product Liability Assessment', owner: 'General Counsel', phase: 'SECONDARY', status: 'pending' },
        { id: 't9', name: 'Replacement Product Sourcing', owner: 'VP Supply Chain', phase: 'FOLLOW_UP', status: 'pending' },
        { id: 't10', name: 'Insurance & Liability Reserve', owner: 'CFO', phase: 'FOLLOW_UP', status: 'pending' },
        { id: 't11', name: 'FDA Follow-Up Filing', owner: 'VP Regulatory Affairs', phase: 'FOLLOW_UP', status: 'pending' },
        { id: 't12', name: 'Board Crisis Brief', owner: 'Chairman & CEO', phase: 'FOLLOW_UP', status: 'pending' },
      ],
    },
    kpis: [
      { label: 'Patient Safety', value: 'Hotline in 90 sec', color: 'text-red-400' },
      { label: 'Units Quarantined', value: '47M across channels', color: 'text-amber-400' },
      { label: 'Liability Avoided', value: '$50M+', color: 'text-emerald-400' },
    ],
    completionMetrics: [
      { label: 'FDA Notification', before: '72 hours to prepare', after: 'Auto-filed in minutes' },
      { label: 'Pharmacy Notification', before: 'Days of fax/phone', after: '12,000+ notified simultaneously' },
      { label: 'Patient Safety', before: 'Weeks of exposure', after: 'Hotline active in 90 seconds' },
    ],
  },
  manufacturing: {
    label: 'Manufacturing',
    perspective: 'Watch supplier crisis coordination: alternative sourcing, production rescheduling, and customer management.',
    scenario: 'Critical Semiconductor Shortage',
    organization: 'Toyota Motor Corporation',
    stakeholders: {
      'ransomware': [
        { id: 's1', name: 'Koji Sato', title: 'President & CEO', department: 'Executive', tier: 1, status: 'pending', initials: 'KS', color: AVATAR_COLORS[0] },
        { id: 's2', name: 'Yoichi Miyazaki', title: 'CFO', department: 'Finance', tier: 1, status: 'pending', initials: 'YM', color: AVATAR_COLORS[1] },
        { id: 's3', name: 'Kazuaki Shingo', title: 'Chief Production Officer', department: 'Manufacturing', tier: 1, status: 'pending', initials: 'KZ', color: AVATAR_COLORS[2] },
        { id: 's4', name: 'Hiroki Nakajima', title: 'Chief Technology Officer', department: 'R&D', tier: 1, status: 'pending', initials: 'HN', color: AVATAR_COLORS[3] },
        { id: 's5', name: 'Masahiko Maeda', title: 'VP Procurement', department: 'Supply Chain', tier: 1, status: 'pending', initials: 'MM', color: AVATAR_COLORS[4] },
        { id: 's6', name: 'Simon Humphries', title: 'VP Global Design', department: 'Product Planning', tier: 2, status: 'pending', initials: 'SH', color: AVATAR_COLORS[5] },
        { id: 's7', name: 'Kenji Yamamoto', title: 'VP Quality Control', department: 'Quality', tier: 2, status: 'pending', initials: 'KY', color: AVATAR_COLORS[6] },
        { id: 's8', name: 'Jack Hollis', title: 'VP Sales (North America)', department: 'Sales', tier: 2, status: 'pending', initials: 'JH', color: AVATAR_COLORS[7] },
        { id: 's9', name: 'Takeshi Uchiyamada', title: 'VP Supplier Relations', department: 'Procurement', tier: 2, status: 'pending', initials: 'TU', color: AVATAR_COLORS[8] },
        { id: 's10', name: 'Lisa Park', title: 'VP Communications', department: 'Corporate Comms', tier: 2, status: 'pending', initials: 'LP', color: AVATAR_COLORS[9] },
      ],
    },
    tasks: {
      'ransomware': [
        { id: 't1', name: 'Assess Semiconductor Inventory (72hr)', owner: 'Chief Production Officer', phase: 'IMMEDIATE', status: 'pending' },
        { id: 't2', name: 'Activate Alternative Supplier Network', owner: 'VP Procurement', phase: 'IMMEDIATE', status: 'pending' },
        { id: 't3', name: 'Production Line Priority Triage', owner: 'Chief Production Officer', phase: 'IMMEDIATE', status: 'pending' },
        { id: 't4', name: 'Notify 14 Assembly Plants', owner: 'VP Communications', phase: 'IMMEDIATE', status: 'pending' },
        { id: 't5', name: 'Dealer Network Impact Assessment', owner: 'VP Sales (N. America)', phase: 'SECONDARY', status: 'pending' },
        { id: 't6', name: 'Emergency Sourcing from TSMC/Samsung', owner: 'VP Supplier Relations', phase: 'SECONDARY', status: 'pending' },
        { id: 't7', name: 'Production Reschedule (High-Margin First)', owner: 'Chief Production Officer', phase: 'SECONDARY', status: 'pending' },
        { id: 't8', name: 'Customer Delivery Timeline Update', owner: 'VP Sales', phase: 'SECONDARY', status: 'pending' },
        { id: 't9', name: 'Financial Impact Modeling', owner: 'CFO', phase: 'FOLLOW_UP', status: 'pending' },
        { id: 't10', name: 'Quality Validation (New Suppliers)', owner: 'VP Quality Control', phase: 'FOLLOW_UP', status: 'pending' },
        { id: 't11', name: 'Board & Analyst Communication', owner: 'CEO', phase: 'FOLLOW_UP', status: 'pending' },
        { id: 't12', name: 'Supply Chain Resilience Dashboard', owner: 'CTO', phase: 'FOLLOW_UP', status: 'pending' },
      ],
    },
    kpis: [
      { label: 'Plants Coordinated', value: '14 simultaneously', color: 'text-orange-400' },
      { label: 'Production Saved', value: '$450M value', color: 'text-emerald-400' },
      { label: 'Alternative Sourcing', value: 'Activated in 4 min', color: 'text-blue-400' },
    ],
    completionMetrics: [
      { label: 'Supplier Response', before: '30 days to source alternatives', after: '4 hours with pre-mapped network' },
      { label: 'Production Impact', before: '$450M+ in idle capacity', after: 'High-margin lines prioritized instantly' },
      { label: 'Dealer Communication', before: 'Weeks of uncertainty', after: 'All dealers notified simultaneously' },
    ],
  },
  retail: {
    label: 'Retail',
    perspective: 'See food safety coordination across 800+ stores, 23 states, and regulatory agencies simultaneously.',
    scenario: 'Salmonella Contamination Crisis',
    organization: 'Walmart Inc.',
    stakeholders: {
      'ransomware': [
        { id: 's1', name: 'Doug McMillon', title: 'President & CEO', department: 'Executive', tier: 1, status: 'pending', initials: 'DM', color: AVATAR_COLORS[0] },
        { id: 's2', name: 'John Furner', title: 'CEO, Walmart U.S.', department: 'U.S. Operations', tier: 1, status: 'pending', initials: 'JF', color: AVATAR_COLORS[1] },
        { id: 's3', name: 'John David Rainey', title: 'CFO', department: 'Finance', tier: 1, status: 'pending', initials: 'JR', color: AVATAR_COLORS[2] },
        { id: 's4', name: 'Rachel Brand', title: 'EVP & General Counsel', department: 'Legal', tier: 1, status: 'pending', initials: 'RB', color: AVATAR_COLORS[3] },
        { id: 's5', name: 'Donna Morris', title: 'EVP & Chief People Officer', department: 'HR', tier: 1, status: 'pending', initials: 'DM', color: AVATAR_COLORS[4] },
        { id: 's6', name: 'Charles Redfield', title: 'EVP, Food & Consumables', department: 'Merchandising', tier: 2, status: 'pending', initials: 'CR', color: AVATAR_COLORS[5] },
        { id: 's7', name: 'Sarah Mitchell', title: 'VP Food Safety', department: 'Quality Assurance', tier: 2, status: 'pending', initials: 'SM', color: AVATAR_COLORS[6] },
        { id: 's8', name: 'David Torres', title: 'VP Store Operations', department: 'Operations', tier: 2, status: 'pending', initials: 'DT', color: AVATAR_COLORS[7] },
        { id: 's9', name: 'Amy Chen', title: 'VP Supply Chain', department: 'Logistics', tier: 2, status: 'pending', initials: 'AC', color: AVATAR_COLORS[8] },
        { id: 's10', name: 'Mark Williams', title: 'VP Corporate Communications', department: 'Comms', tier: 2, status: 'pending', initials: 'MW', color: AVATAR_COLORS[9] },
      ],
    },
    tasks: {
      'ransomware': [
        { id: 't1', name: 'Pull Contaminated Products (847 Stores)', owner: 'VP Store Operations', phase: 'IMMEDIATE', status: 'pending' },
        { id: 't2', name: 'Notify FDA & State Health Depts (23)', owner: 'VP Food Safety', phase: 'IMMEDIATE', status: 'pending' },
        { id: 't3', name: 'Activate Customer Safety Hotline', owner: 'VP Corporate Comms', phase: 'IMMEDIATE', status: 'pending' },
        { id: 't4', name: 'Freeze Supplier Shipments', owner: 'VP Supply Chain', phase: 'IMMEDIATE', status: 'pending' },
        { id: 't5', name: 'Store-Level Shelf Audit (847 Locations)', owner: 'EVP Food & Consumables', phase: 'SECONDARY', status: 'pending' },
        { id: 't6', name: 'Customer Purchase History Trace', owner: 'VP E-Commerce', phase: 'SECONDARY', status: 'pending' },
        { id: 't7', name: 'Supplier Root Cause Investigation', owner: 'VP Food Safety', phase: 'SECONDARY', status: 'pending' },
        { id: 't8', name: 'Media Response & Press Statement', owner: 'VP Corporate Comms', phase: 'SECONDARY', status: 'pending' },
        { id: 't9', name: 'Customer Refund Program Launch', owner: 'CFO', phase: 'FOLLOW_UP', status: 'pending' },
        { id: 't10', name: 'Replacement Product Sourcing', owner: 'VP Supply Chain', phase: 'FOLLOW_UP', status: 'pending' },
        { id: 't11', name: 'Product Liability Assessment', owner: 'General Counsel', phase: 'FOLLOW_UP', status: 'pending' },
        { id: 't12', name: 'Safety Compliance Dashboard', owner: 'VP Food Safety', phase: 'FOLLOW_UP', status: 'pending' },
      ],
    },
    kpis: [
      { label: 'Stores Cleared', value: '847 in 3 min', color: 'text-green-400' },
      { label: 'Customers Protected', value: '12,847 traced', color: 'text-blue-400' },
      { label: 'Value Protected', value: '$245M + lives', color: 'text-emerald-400' },
    ],
    completionMetrics: [
      { label: 'Product Pull', before: '7 days across regions', after: '847 stores cleared in minutes' },
      { label: 'FDA Notification', before: '24-48 hours manual', after: 'Auto-filed with contamination data' },
      { label: 'Customer Safety', before: 'Weeks of potential exposure', after: 'Hotline active + purchase tracing' },
    ],
  },
  energy: {
    label: 'Energy & Utilities',
    perspective: 'Watch grid emergency coordination across substations, field crews, regulators, and public communications.',
    scenario: 'Cascading Grid Failure Crisis',
    organization: 'Pacific Grid & Power',
    stakeholders: {
      'ransomware': [
        { id: 's1', name: 'Patricia Poppe', title: 'CEO', department: 'Executive', tier: 1, status: 'pending', initials: 'PP', color: AVATAR_COLORS[0] },
        { id: 's2', name: 'Carolyn Burke', title: 'CFO', department: 'Finance', tier: 1, status: 'pending', initials: 'CB', color: AVATAR_COLORS[1] },
        { id: 's3', name: 'Adam Wright', title: 'EVP Operations', department: 'Grid Operations', tier: 1, status: 'pending', initials: 'AW', color: AVATAR_COLORS[2] },
        { id: 's4', name: 'Sumeet Singh', title: 'Chief Risk Officer', department: 'Enterprise Risk', tier: 1, status: 'pending', initials: 'SS', color: AVATAR_COLORS[3] },
        { id: 's5', name: 'Robert Kenney', title: 'VP Regulatory Relations', department: 'Regulatory', tier: 1, status: 'pending', initials: 'RK', color: AVATAR_COLORS[4] },
        { id: 's6', name: 'Michael Lewis', title: 'VP Field Operations', department: 'Field Crews', tier: 2, status: 'pending', initials: 'ML', color: AVATAR_COLORS[5] },
        { id: 's7', name: 'Jennifer Torres', title: 'VP Grid Engineering', department: 'Engineering', tier: 2, status: 'pending', initials: 'JT', color: AVATAR_COLORS[6] },
        { id: 's8', name: 'David Chen', title: 'VP Customer Services', department: 'Customer Relations', tier: 2, status: 'pending', initials: 'DC', color: AVATAR_COLORS[7] },
        { id: 's9', name: 'Sarah Walsh', title: 'VP Emergency Management', department: 'Emergency Ops', tier: 2, status: 'pending', initials: 'SW', color: AVATAR_COLORS[8] },
        { id: 's10', name: 'Mark Reynolds', title: 'VP Public Affairs', department: 'Communications', tier: 2, status: 'pending', initials: 'MR', color: AVATAR_COLORS[9] },
      ],
    },
    tasks: {
      'ransomware': [
        { id: 't1', name: 'Isolate Cascading Failure (247 Substations)', owner: 'EVP Operations', phase: 'IMMEDIATE', status: 'pending' },
        { id: 't2', name: 'Deploy Emergency Field Crews (3 States)', owner: 'VP Field Operations', phase: 'IMMEDIATE', status: 'pending' },
        { id: 't3', name: 'Notify NERC & State PUCs', owner: 'VP Regulatory Relations', phase: 'IMMEDIATE', status: 'pending' },
        { id: 't4', name: 'Activate Public Safety Alerts', owner: 'VP Emergency Management', phase: 'IMMEDIATE', status: 'pending' },
        { id: 't5', name: 'Grid Load Redistribution Plan', owner: 'VP Grid Engineering', phase: 'SECONDARY', status: 'pending' },
        { id: 't6', name: 'Hospital & Critical Facility Priority', owner: 'VP Customer Services', phase: 'SECONDARY', status: 'pending' },
        { id: 't7', name: 'Governor & FEMA Coordination', owner: 'VP Public Affairs', phase: 'SECONDARY', status: 'pending' },
        { id: 't8', name: 'Mutual Aid Agreement Activation', owner: 'EVP Operations', phase: 'SECONDARY', status: 'pending' },
        { id: 't9', name: 'Customer Restoration Timeline Updates', owner: 'VP Customer Services', phase: 'FOLLOW_UP', status: 'pending' },
        { id: 't10', name: 'Financial Impact & Insurance Filing', owner: 'CFO', phase: 'FOLLOW_UP', status: 'pending' },
        { id: 't11', name: 'Infrastructure Damage Assessment', owner: 'VP Field Operations', phase: 'FOLLOW_UP', status: 'pending' },
        { id: 't12', name: 'Regulatory Incident Report', owner: 'VP Regulatory Relations', phase: 'FOLLOW_UP', status: 'pending' },
      ],
    },
    kpis: [
      { label: 'Customers Affected', value: '8.2M coordinated', color: 'text-yellow-400' },
      { label: 'Field Crews', value: 'Deployed in 3 min', color: 'text-blue-400' },
      { label: 'Value Protected', value: '$2.5B + lives', color: 'text-emerald-400' },
    ],
    completionMetrics: [
      { label: 'Emergency Response', before: '3-5 days full mobilization', after: '3 hours with pre-staged crews' },
      { label: 'Regulatory Compliance', before: 'Days to file NERC report', after: 'Auto-filed with real-time data' },
      { label: 'Customer Communication', before: 'Millions without updates', after: '8.2M updated simultaneously' },
    ],
  },
};
