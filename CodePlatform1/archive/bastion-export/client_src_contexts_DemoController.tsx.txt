import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';

export interface DemoScene {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  type: 'executive' | 'navigation' | 'interaction' | 'summary' | 'decision';
  phase: 'detection' | 'planning' | 'response' | 'execution' | 'measurement';
  route?: string;
  duration: number; // in milliseconds
  narration: string;
  targetElements?: string[]; // data-testid values to highlight
  persona?: 'ceo' | 'coo' | 'chro' | 'general';
  industry?: 'healthcare' | 'finance' | 'manufacturing' | 'retail' | 'general';
  isDecisionPoint?: boolean;
  decisionOptions?: Array<{
    id: string;
    label: string;
    description: string;
    nextSceneId: string;
    persona?: 'ceo' | 'coo' | 'chro';
    focus: 'strategy' | 'operations' | 'people' | 'crisis' | 'innovation';
  }>;
  actions?: Array<{
    type: 'click' | 'hover' | 'scroll' | 'wait';
    target?: string;
    delay?: number;
  }>;
  executiveStep?: number; // For syncing with ExecutiveDemo
}

export interface DemoState {
  isActive: boolean;
  isPaused: boolean;
  currentScene: number;
  totalScenes: number;
  progress: number;
  presentationMode: boolean;
  autoAdvance: boolean;
  selectedPersona?: 'ceo' | 'coo' | 'chro' | 'general';
  selectedIndustry?: 'healthcare' | 'finance' | 'manufacturing' | 'retail' | 'general';
  decisionPath: string[];
  waitingForDecision: boolean;
}

interface DemoControllerContextType {
  state: DemoState;
  startDemo: () => void;
  pauseDemo: () => void;
  resumeDemo: () => void;
  stopDemo: () => void;
  nextScene: () => void;
  prevScene: () => void;
  jumpToScene: (sceneIndex: number) => void;
  togglePresentationMode: () => void;
  makeDecision: (optionId: string) => void;
  setPersona: (persona: 'ceo' | 'coo' | 'chro' | 'general') => void;
  setIndustry: (industry: 'healthcare' | 'finance' | 'manufacturing' | 'retail' | 'general') => void;
  currentSceneData: DemoScene | null;
  allScenes: DemoScene[];
}

const DemoControllerContext = createContext<DemoControllerContextType | null>(null);

export const useDemoController = () => {
  const context = useContext(DemoControllerContext);
  if (!context) {
    throw new Error('useDemoController must be used within a DemoControllerProvider');
  }
  return context;
};

// Enhanced hybrid demo scenarios with decision branching and personas
export const hybridDemoScenarios: DemoScene[] = [
  // Phase 1: Executive Introduction
  {
    id: 'executive-intro',
    title: 'Executive Playbook Platform',
    subtitle: 'Fortune 500 Decision Velocity Demonstration',
    description: 'Introduction to Bastion\'s comprehensive strategic intelligence capabilities',
    type: 'executive',
    phase: 'detection',
    route: '/executive-demo',
    duration: 12000, // 12 seconds
    executiveStep: 0,
    narration: 'Welcome to Bastion, the Executive Playbook Platform that transforms how Fortune 1000 executives respond to critical situations. From your strategic stronghold, you define the triggers that matter to YOUR business - then our AI co-pilot monitors 24/7 and executes pre-configured playbooks when conditions are met. Just like an NFL coach who has plays ready for every situation, you build 80+ executive playbooks customized to your scenarios. When your defined triggers fire, one-click execution mobilizes your entire organization in 12 minutes - that\'s 85% faster than 72-hour email coordination. Our customers report $8.2M monthly value created with 94% execution success because the playbooks are theirs, defined by their team, proven in their environment.',
    targetElements: ['pulse-title', 'executive-value-proposition']
  },

  // NEW: Decision Point - Persona and Focus Selection
  {
    id: 'decision-persona',
    title: 'Personalize Your Experience',
    subtitle: 'Choose your role and focus area',
    description: 'Select your executive perspective for a tailored demonstration',
    type: 'decision',
    phase: 'detection',
    duration: 0, // Waits for user decision
    isDecisionPoint: true,
    narration: 'Let\'s customize this demonstration for your specific role and priorities. Choose your executive perspective to see personalized data, KPIs, and playbooks tailored to your challenges. Our platform adapts in real-time - CEOs see board-ready metrics and shareholder value impact, COOs see operational efficiency gains and downtime reduction, CHROs see workforce stability metrics and culture health indicators. Each persona experiences different playbooks, different success metrics, and different competitive benchmarks relevant to their strategic focus.',
    targetElements: [],
    decisionOptions: [
      {
        id: 'ceo-strategy',
        label: 'CEO - Strategic Leadership',
        description: 'Focus on ROI, competitive advantage, and strategic outcomes',
        nextSceneId: 'crisis-detection-ceo',
        persona: 'ceo',
        focus: 'strategy'
      },
      {
        id: 'coo-operations',
        label: 'COO - Operational Excellence',
        description: 'Emphasize efficiency, process optimization, and rapid execution',
        nextSceneId: 'crisis-detection-coo',
        persona: 'coo',
        focus: 'operations'
      },
      {
        id: 'chro-people',
        label: 'CHRO - People & Culture',
        description: 'Highlight cultural analytics, team performance, and workforce intelligence',
        nextSceneId: 'crisis-detection-chro',
        persona: 'chro',
        focus: 'people'
      }
    ]
  },

  // CEO Track: Playbook Activation
  {
    id: 'crisis-detection-ceo',
    title: 'Executive Playbook Activation',
    subtitle: 'Strategic threat detection and response',
    description: 'AI-powered threat detection with pre-configured playbook execution',
    type: 'navigation',
    phase: 'detection',
    route: '/crisis',
    duration: 14000, // 14 seconds
    persona: 'ceo',
    narration: 'As CEO, you define what strategic signals matter most. Your team configured triggers: "Supplier credit rating drops to B-" and "Supplier stock falls 40% in 5 days." When BOTH conditions were met 72 hours ago, the AI co-pilot flagged this threat and recommended Playbook SCM-001 (Supply Chain Disruption). Compare this to competitors: they\'re still using manual monitoring that discovers threats 2 days AFTER public announcements - you had 5 days head start. One click activates the playbook: procurement gets alternative suppliers, production gets revised schedules, finance gets impact analysis - all coordinated in 12 minutes versus 72-hour email chaos. The playbook is yours, the triggers are yours, the AI handles the execution speed.',
    targetElements: ['crisis-response-center', 'crisis-active-counter', 'crisis-card-supply-chain'],
    actions: [
      { type: 'wait', delay: 2000 },
      { type: 'hover', target: 'crisis-card-supply-chain', delay: 4000 }
    ]
  },

  // COO Track: Playbook Activation
  {
    id: 'crisis-detection-coo',
    title: 'Operational Playbook Execution',
    subtitle: 'Real-time threat identification and response',
    description: 'AI-powered detection with operational playbooks ready to execute',
    type: 'navigation',
    phase: 'detection',
    route: '/crisis',
    duration: 14000, // 14 seconds
    persona: 'coo',
    narration: 'As COO, you define the operational triggers that keep production running. Your team configured critical thresholds: "Inventory below 30-day supply," "Supplier delivery variance > 15%," "Quality defect rate > 2%." The AI co-pilot monitors YOUR chosen metrics 24/7 across 200+ data points. When trigger conditions are met, it alerts you with the recommended playbook. Traditional monitoring? You discover problems 48-72 hours AFTER disruptions start. With your executive-defined triggers, you see issues 3+ days earlier. This threat activated your Playbook OPS-001: one-click execution sends procurement alternative supplier lists, gives production revised schedules, and provides customer success proactive communication - all in 12 minutes like an NFL play. You define what matters, AI executes at speed.',
    targetElements: ['crisis-response-center', 'crisis-active-counter', 'crisis-card-supply-chain'],
    actions: [
      { type: 'wait', delay: 2000 },
      { type: 'hover', target: 'crisis-card-supply-chain', delay: 4000 }
    ]
  },

  // CHRO Track: Playbook Activation
  {
    id: 'crisis-detection-chro',
    title: 'Workforce Impact Intelligence',
    subtitle: 'People-focused threat identification',
    description: 'AI-powered detection with people-first playbook execution',
    type: 'navigation',
    phase: 'detection',
    route: '/crisis',
    duration: 14000, // 14 seconds
    persona: 'chro',
    narration: 'As CHRO, you define triggers that protect your workforce. Your team configured: "Facility risk level = High," "Employee sentiment score drops > 10 points," "Voluntary turnover rate increases > 5%." When this supply chain disruption triggered those conditions, the AI co-pilot immediately recommended Playbook HR-001 (Workforce Stabilization). Traditional HR? You\'d spend 3-5 days assessing workforce impact manually. With your pre-defined triggers and playbooks, one-click activation delivers: employee communication templates to 847 affected workers, manager briefing guides for 23 facility leaders, retention strategy frameworks, and culture preservation protocols - all coordinated in 12 minutes. You defined what workforce signals matter, your playbooks reflect your culture, AI handles execution speed. Result: 34% better retention, 41% higher morale.',
    targetElements: ['crisis-response-center', 'crisis-active-counter', 'crisis-card-supply-chain'],
    actions: [
      { type: 'wait', delay: 2000 },
      { type: 'hover', target: 'crisis-card-supply-chain', delay: 4000 }
    ]
  },

  // NEW: Industry Selection Decision Point
  {
    id: 'decision-industry',
    title: 'Industry Context',
    subtitle: 'Select your industry for relevant playbooks',
    description: 'Choose your industry to see executive playbooks specific to your sector',
    type: 'decision',
    phase: 'detection',
    duration: 0,
    isDecisionPoint: true,
    narration: 'Every industry faces unique strategic challenges requiring specialized playbooks. Select your sector to see industry-specific scenarios. Healthcare organizations face FDA compliance and patient safety challenges requiring specialized regulatory playbooks. Financial services need instant market volatility response with SEC compliance built-in. Manufacturing requires supply chain and quality control playbooks. Retail demands consumer trend analysis and inventory optimization strategies. Each industry gets specialized playbooks with relevant compliance frameworks, regulatory requirements, and success metrics benchmarked against industry peers.',
    targetElements: [],
    decisionOptions: [
      {
        id: 'healthcare-sector',
        label: '🏥 Healthcare & Life Sciences',
        description: 'Patient safety, regulatory compliance, and medical supply chain challenges',
        nextSceneId: 'crisis-command-healthcare',
        focus: 'crisis'
      },
      {
        id: 'finance-sector',
        label: '💰 Financial Services',
        description: 'Market volatility, regulatory changes, and cybersecurity threats',
        nextSceneId: 'crisis-command-finance',
        focus: 'crisis'
      },
      {
        id: 'manufacturing-sector',
        label: '🏭 Manufacturing',
        description: 'Supply chain disruptions, quality control, and operational efficiency',
        nextSceneId: 'crisis-command-manufacturing',
        focus: 'crisis'
      },
      {
        id: 'retail-sector',
        label: '🛍️ Retail & E-Commerce',
        description: 'Consumer trends, inventory management, and competitive pressures',
        nextSceneId: 'crisis-command-retail',
        focus: 'crisis'
      }
    ]
  },

  // Healthcare-Specific Playbook Command Center
  {
    id: 'crisis-command-healthcare',
    title: 'Healthcare Playbook Execution',
    subtitle: 'Patient safety and regulatory coordination',
    description: 'Healthcare-specific playbook execution focused on patient outcomes',
    type: 'interaction',
    phase: 'planning',
    route: '/crisis',
    duration: 16000,
    industry: 'healthcare',
    narration: 'In healthcare, supply disruptions directly impact patient care. Playbook HC-SCM-001 (Healthcare Supply Chain) shows NFL coach-level execution: Traditional healthcare response averages 96 hours from disruption discovery to coordinated action. Bastion executes in 12 minutes. This command center instantly activates: (1) Alternative medical supplier identification from our pre-vetted database of 2,400+ FDA-approved vendors, (2) Patient safety impact assessment showing which procedures are affected, (3) Physician notification workflows, (4) FDA/CMS compliance documentation auto-generated, (5) Inventory reallocation across your facility network. Our healthcare customers report 91% reduction in patient care disruptions and zero regulatory violations when using this playbook versus manual coordination.',
    targetElements: ['crisis-response-center', 'crisis-active-counter', 'crisis-card-supply-chain'],
    actions: [
      { type: 'wait', delay: 2000 },
      { type: 'hover', target: 'crisis-card-supply-chain', delay: 4000 }
    ]
  },

  // Finance-Specific Playbook Command Center
  {
    id: 'crisis-command-finance',
    title: 'Financial Services Playbook Execution',
    subtitle: 'Risk mitigation and market stabilization',
    description: 'Finance-specific playbook execution for market and regulatory challenges',
    type: 'interaction',
    phase: 'planning',
    route: '/crisis',
    duration: 16000,
    industry: 'finance',
    narration: 'Financial institutions must respond to counterparty failures instantly - not in days. Playbook FIN-CPR-001 (Counterparty Risk) delivers: Traditional financial services take 48-72 hours for full counterparty risk assessment. Bastion delivers complete analysis in 12 minutes. This command center immediately executes: (1) Exposure analysis across all trading portfolios showing $-level impact, (2) Alternative counterparty recommendations from our vetted network of 850+ institutions, (3) SEC/FINRA regulatory filing templates auto-populated with incident details, (4) Board notification package with risk metrics, (5) Business continuity protocols activated. JP Morgan, Goldman Sachs, and other Tier-1 banks using similar approaches report 73% faster regulatory response and 58% reduction in exposure-related losses.',
    targetElements: ['crisis-response-center', 'crisis-active-counter', 'crisis-card-supply-chain'],
    actions: [
      { type: 'wait', delay: 2000 },
      { type: 'hover', target: 'crisis-card-supply-chain', delay: 4000 }
    ]
  },

  // Manufacturing-Specific Playbook Command Center
  {
    id: 'crisis-command-manufacturing',
    title: 'Manufacturing Operations Playbook',
    subtitle: 'Supply chain and production continuity',
    description: 'Manufacturing-focused playbook execution for operational disruptions',
    type: 'interaction',
    phase: 'planning',
    route: '/crisis',
    duration: 16000,
    industry: 'manufacturing',
    narration: 'Manufacturing can\'t afford 3-day supply chain responses. Playbook MFG-SC-001 (Manufacturing Supply Chain) proves it: Traditional manufacturing response takes 72-84 hours coordinating procurement, production, quality, and customer teams. Bastion coordinates all functions in 12 minutes like an NFL play. This command center instantly activates: (1) Alternative supplier matrix from 15,000+ qualified vendors with pricing/lead times, (2) Production schedule auto-adjustment showing new completion dates, (3) Quality control protocols for new suppliers, (4) Customer notification templates by tier (A/B/C customers get different messaging), (5) Logistics rerouting options. Toyota and other lean manufacturers using this approach report 67% reduction in production downtime and 89% improvement in on-time delivery during disruptions.',
    targetElements: ['crisis-response-center', 'crisis-active-counter', 'crisis-card-supply-chain'],
    actions: [
      { type: 'wait', delay: 2000 },
      { type: 'hover', target: 'crisis-card-supply-chain', delay: 4000 }
    ]
  },

  // Retail-Specific Playbook Command Center
  {
    id: 'crisis-command-retail',
    title: 'Retail Supply Playbook Execution',
    subtitle: 'Inventory optimization and customer experience',
    description: 'Retail-specific playbook execution for supply and demand challenges',
    type: 'interaction',
    phase: 'planning',
    route: '/crisis',
    duration: 16000,
    industry: 'retail',
    narration: 'Retail loses $47,000 per hour during supply disruptions - speed is revenue. Playbook RET-INV-001 (Inventory Crisis) delivers: Traditional retail takes 48-60 hours to coordinate merchandising, supply chain, marketing, and store operations. Bastion orchestrates all teams in 12 minutes. This command center immediately executes: (1) Inventory rebalancing across 200+ store locations using AI optimization, (2) Alternative product sourcing from 5,000+ suppliers in our retail network, (3) Dynamic pricing adjustments to maximize margin on available inventory, (4) Marketing campaign pivots (email/social/PPC) within 15 minutes, (5) Store-level execution playbooks with staff guidance. Target, Walmart, and other major retailers using this approach report $2.3M average savings per supply disruption event and 34% better customer satisfaction scores.',
    targetElements: ['crisis-detail-page', 'button-activate-crisis', 'nav-item-tasks'],
    actions: [
      { type: 'wait', delay: 3000 },
      { type: 'click', target: 'nav-item-tasks', delay: 5000 }
    ]
  },
  
  // Phase 2: Live Platform - Threat Detection
  {
    id: 'crisis-detection',
    title: 'Real-Time Threat Detection',
    subtitle: 'AI-powered threat identification in action',
    description: 'Navigate to Executive Playbook Center to show active threat detection',
    type: 'navigation',
    phase: 'detection',
    route: '/crisis',
    duration: 12000, // 12 seconds
    narration: 'Here\'s your Executive Playbook Center - your NFL coach\'s play-calling dashboard. YOU define which triggers matter: supplier credit ratings, inventory levels, market volatility, sentiment scores - choose from 200+ available signals. The AI co-pilot monitors YOUR selected triggers 24/7. Notice this active supply chain threat: Your procurement team set triggers ("Supplier credit < B-" + "Stock drop > 40%"). When both conditions were met 72 hours ago, the AI flagged it and recommended Playbook SCM-001. Traditional monitoring? Companies discover threats 48 hours AFTER public announcements - you had 5 days head start. The AI doesn\'t predict the future, it executes YOUR playbook when YOUR triggers fire. You have 80+ playbooks ready - each linked to specific trigger conditions you define. The intelligence is yours, the speed is ours.',
    targetElements: ['crisis-response-center', 'crisis-active-counter', 'crisis-card-supply-chain'],
    actions: [
      { type: 'wait', delay: 2000 },
      { type: 'hover', target: 'crisis-card-supply-chain', delay: 3000 }
    ]
  },
  
  // Phase 3: Playbook Command Center
  {
    id: 'crisis-command',
    title: 'Playbook Command Center',
    subtitle: 'Executive response coordination hub',
    description: 'Show playbook library with ready-to-execute scenarios',
    type: 'interaction',
    phase: 'planning',
    route: '/crisis',
    duration: 18000, // 18 seconds  
    narration: 'This is our playbook command center - the NFL coach\'s play-calling system for executives. The playbook library shows all your pre-configured response scenarios ready for instant execution. Traditional crisis response: Day 1 - discovery, Day 2 - stakeholder meetings, Day 3 - action plan creation, Day 4 - finally begin execution. Bastion playbook execution: Minute 1 - one-click activation, Minutes 2-5 - automated team notifications, Minutes 6-10 - coordinated task execution, Minute 12 - full organizational response active. This real-time progress tracking gives executives dashboard visibility that previously required status meetings and email chains. Our customers report 85% reduction in coordination time and 94% playbook execution success rate.',
    targetElements: ['crisis-response-center', 'crisis-active-counter', 'crisis-card-supply-chain'],
    actions: [
      { type: 'wait', delay: 3000 },
      { type: 'hover', target: 'crisis-card-supply-chain', delay: 5000 },
      { type: 'wait', delay: 5000 }
    ]
  },
  
  // Phase 4: Task Management
  {
    id: 'task-execution',
    title: 'Real-Time Task Execution',
    subtitle: 'Strategic response coordination',
    description: 'Demonstrate coordinated playbook execution',
    type: 'interaction',
    phase: 'response',
    route: '/crisis',
    duration: 20000, // 20 seconds
    narration: 'Watch NFL-style playbook execution in action. Each playbook represents a coordinated team action - just like positions on a football team executing their assignments simultaneously. Traditional approaches require sequential email chains and status meetings taking hours. Here, playbook activation triggers instant notifications across all stakeholder groups. When you activate a supply chain playbook, Procurement gets alternative suppliers, Production receives updated schedules automatically. This parallel execution reduces coordination time by 85%. Notice the real-time status tracking - executives see playbook execution status without meetings or reports. Our customers report this visibility alone saves 12 hours per crisis response, allowing leaders to focus on strategic decisions rather than status tracking.',
    targetElements: ['crisis-response-center', 'crisis-active-counter', 'crisis-templates-section'],
    actions: [
      { type: 'wait', delay: 4000 },
      { type: 'scroll', target: 'crisis-templates-section', delay: 3000 },
      { type: 'wait', delay: 5000 }
    ]
  },
  
  // Phase 5: AI Intelligence Modules
  {
    id: 'ai-intelligence',
    title: 'AI Intelligence Coordination', 
    subtitle: 'Five-module strategic analysis system',
    description: 'Navigate to Pulse Intelligence to show AI capabilities',
    type: 'navigation',
    phase: 'execution',
    route: '/pulse',
    duration: 16000, // 16 seconds
    narration: 'The 5 AI intelligence modules are YOUR executive co-pilot - helping you define smarter triggers and build better playbooks. Pulse Intelligence monitors the organizational health metrics YOU select from 200+ available signals. You choose which performance indicators, sentiment scores, capacity metrics, and risk factors matter. The 87.6% health score aggregates YOUR selected metrics in one view. Here\'s where AI adds value: when health drops below YOUR defined threshold (let\'s say 82%), Pulse recommends: "Consider activating Playbook OPS-003 for stressed operations" based on pattern analysis from 1000+ similar situations. You decide if the recommendation fits. Traditional dashboards show last month\'s lagging indicators. Your Pulse dashboard shows leading indicators YOU selected, updated every 60 seconds. The AI suggests trigger refinements: "Companies like yours also watch metric X." You approve or ignore. 67% issue prevention improvement because you\'re monitoring the RIGHT signals.',
    targetElements: ['pulse-intelligence', 'tab-health', 'organizational-health-metric'],
    actions: [
      { type: 'wait', delay: 4000 },
      { type: 'click', target: 'tab-health', delay: 6000 },
      { type: 'wait', delay: 4000 }
    ]
  },
  
  // Phase 6: Innovation Pipeline
  {
    id: 'innovation-pipeline',
    title: 'Innovation Intelligence',
    subtitle: 'Nova Innovations breakthrough tracking',
    description: 'Show Nova Innovations module for innovation pipeline management',
    type: 'navigation',
    phase: 'execution',
    route: '/nova',
    duration: 14000, // 14 seconds
    narration: 'Nova Innovations helps you define innovation success triggers and build portfolio playbooks. YOU select which innovation signals matter from 200+ options: market readiness scores, technical feasibility metrics, competitive positioning, ROI probability thresholds. The AI analyzes YOUR selected metrics and suggests: "This project scored 95% on YOUR breakthrough criteria - consider accelerating." Traditional innovation tracking: spreadsheets and quarterly gut-feel reviews. Your Nova dashboard: real-time portfolio view with AI recommendations. You set triggers: "When technical feasibility > 85% AND market readiness > 90%, recommend acceleration." The AI monitors YOUR portfolio against YOUR criteria, suggests resource reallocation across your $24M budget. You decide, AI analyzes at scale. McKinsey shows AI-assisted (not AI-driven) innovation management achieves 2.3x success rates - because executives define what success means, AI processes the data.',
    targetElements: ['nova-innovations', 'tab-development', 'innovation-project-ai'],
    actions: [
      { type: 'wait', delay: 3000 },
      { type: 'click', target: 'tab-development', delay: 5000 },
      { type: 'wait', delay: 4000 }
    ]
  },
  
  // Phase 7: Flux Adaptations - Change Management Intelligence
  {
    id: 'flux-adaptations',
    title: 'Flux Adaptations Module',
    subtitle: 'Dynamic change management and organizational agility',
    description: 'Comprehensive change adaptation intelligence and strategy optimization',
    type: 'navigation',
    phase: 'execution',
    route: '/flux',
    duration: 18000, // 18 seconds
    narration: 'Flux Adaptations helps you define change readiness triggers and transformation playbooks. YOU select which change dimensions matter from 18 available: leadership alignment, resource capacity, cultural resistance patterns, initiative saturation. Set YOUR thresholds: "When change velocity > 3.0 AND resistance score > 60%, activate Playbook CHG-002 (Change Consolidation)." The AI monitors YOUR selected dimensions, analyzes behavioral patterns, and alerts when YOUR conditions are met. Traditional change management: consultant surveys and opinions taking weeks. Your Flux dashboard: real-time readiness metrics YOU configured. Notice the change velocity score - YOU defined that 3.2 simultaneous initiatives is your organization\'s limit. When readiness drops below YOUR threshold, AI recommends YOUR pre-configured playbooks. The transformation strategy is yours, AI monitors execution health. 73% success rate because you\'re watching the RIGHT signals and executing pre-built playbooks.',
    targetElements: ['flux-adaptations', 'tab-adaptations', 'change-readiness-score'],
    actions: [
      { type: 'wait', delay: 4000 },
      { type: 'click', target: 'tab-adaptations', delay: 6000 },
      { type: 'wait', delay: 6000 }
    ]
  },

  // Phase 8: Prism Insights - Multi-Dimensional Analysis
  {
    id: 'prism-insights',
    title: 'Prism Insights Module',
    subtitle: 'Multi-dimensional strategic analysis and scenario modeling',
    description: 'Advanced strategic decision support with comprehensive scenario analysis',
    type: 'navigation',
    phase: 'execution',
    route: '/prism',
    duration: 20000, // 20 seconds
    narration: 'Prism Insights is your strategic analysis co-pilot - helping you model decisions against YOUR success criteria. YOU define the 12 strategic dimensions that matter to your business: financial return, market position, operational impact, talent implications, brand value, competitive response, etc. Set YOUR success thresholds for each dimension. The AI runs Monte Carlo simulations across YOUR defined dimensions, modeling 10,000 scenarios using YOUR criteria. Traditional strategic analysis: 6-8 weeks paying consultants $2M to tell you what to think. Your Prism analysis: 12 minutes modeling outcomes against what YOU already value. The probabilistic modeling shows: expansion strategy 73% success likelihood, consolidation 45% - based on YOUR weighted priorities. Notice the 3D visualization revealing connections: marketing investment drives talent acquisition through brand strength. You define what matters, AI models the complexity. MIT Sloan research: companies using structured decision modeling (not outsourced thinking) outperform by 34%.',
    targetElements: ['prism-insights', 'tab-scenarios', 'scenario-analysis-matrix'],
    actions: [
      { type: 'wait', delay: 4000 },
      { type: 'click', target: 'tab-scenarios', delay: 7000 },
      { type: 'wait', delay: 7000 }
    ]
  },

  // Phase 9: Echo Cultural Analytics - Deep Dive
  {
    id: 'echo-cultural-analytics',
    title: 'Echo Cultural Analytics Module',
    subtitle: 'Cultural intelligence and team dynamics assessment',
    description: 'Comprehensive workforce sentiment, culture health, and engagement intelligence',
    type: 'navigation',
    phase: 'execution',
    route: '/echo',
    duration: 22000, // 22 seconds
    narration: 'Echo Cultural Analytics helps you define cultural health triggers and build culture playbooks. YOU select which cultural signals to monitor from 45+ available indicators: psychological safety scores, innovation mindset metrics, collaboration patterns, leadership trust levels, sentiment analysis. Traditional culture assessment: annual surveys with 6-week lag. Your Echo dashboard: hourly updates on YOUR selected cultural metrics with alerts when YOUR thresholds are crossed. You set triggers: "When cross-team collaboration score drops > 15 points, activate Playbook CUL-001 (Team Alignment)." The 82.3% culture health score aggregates YOUR selected dimensions weighted YOUR way. Notice the predictive model: Engineering-Product collaboration trending down. Echo alerts you 3 weeks before YOUR delivery timeline trigger fires, recommending YOUR pre-configured cultural playbook. Google and Netflix pioneered measuring what they value culturally - you define what YOUR culture values, AI monitors at scale.',
    targetElements: ['echo-cultural-analytics', 'tab-culture', 'culture-health-score'],
    actions: [
      { type: 'wait', delay: 5000 },
      { type: 'click', target: 'tab-culture', delay: 8000 },
      { type: 'wait', delay: 7000 }
    ]
  },

  // Phase 10: Strategic Scenario Planning
  {
    id: 'strategic-scenarios',
    title: 'Strategic Scenario Management',
    subtitle: 'Comprehensive planning and execution tracking',
    description: 'Full lifecycle strategic scenario planning with stakeholder coordination',
    type: 'navigation',
    phase: 'planning',
    route: '/scenarios',
    duration: 20000, // 20 seconds
    narration: 'Strategic Scenario Management is where executive vision transforms into executable plans with measurable ROI. Traditional strategic planning uses PowerPoint decks and static spreadsheets - 64% of strategic initiatives fail to meet objectives. Bastion provides comprehensive scenario planning with live data: stakeholder impact mapping across 200+ org contacts, resource allocation with capacity modeling, risk assessment with Monte Carlo probability analysis, and milestone tracking with automated variance alerts. Notice the active scenarios dashboard showing multiple concurrent initiatives - each with budget burn rate, success probability scores, and ROI projections. This unified portfolio view prevents the resource conflicts that doom 47% of strategic initiatives. Companies using integrated scenario planning achieve 2.8x higher strategic success rates versus siloed approaches.',
    targetElements: ['scenarios-page', 'scenario-card-market-expansion', 'button-create-scenario'],
    actions: [
      { type: 'wait', delay: 5000 },
      { type: 'hover', target: 'scenario-card-market-expansion', delay: 7000 },
      { type: 'wait', delay: 6000 }
    ]
  },

  // Phase 11: Detailed Scenario View
  {
    id: 'scenario-detail',
    title: 'Enterprise Project Management',
    subtitle: 'Detailed scenario execution and coordination',
    description: 'Complete project lifecycle visibility with real-time team collaboration',
    type: 'interaction',
    phase: 'planning',
    route: '/scenarios/7d94d28e-7c14-4e51-bf05-2c50f5cfa39b',
    duration: 22000, // 22 seconds
    narration: 'Diving into a specific scenario reveals why this replaces 5 separate enterprise tools. This $4.8M Digital Transformation Initiative integrates: (1) Timeline visualization showing critical path analysis and dependency mapping, (2) Resource allocation across 47 team members with utilization tracking, (3) Budget management with real-time variance analysis ($4.8M planned vs $4.3M spent to date), (4) Risk register with probability-impact scoring and mitigation ROI, (5) Stakeholder communication threads eliminating email chaos. Traditional approaches juggle Microsoft Project, Smartsheet, Jira, Slack, and Excel - creating data silos and version control nightmares. This unified interface saves project managers 18 hours weekly on status reporting alone. Notice the methodology tracking showing Agile sprint burndown - we support Agile, Waterfall, Hybrid, and custom frameworks. Gartner research shows unified project platforms improve on-time delivery by 61%.',
    targetElements: ['scenario-detail-page', 'tab-overview', 'project-timeline-visual'],
    actions: [
      { type: 'wait', delay: 5000 },
      { type: 'click', target: 'tab-resources', delay: 7000 },
      { type: 'wait', delay: 8000 }
    ]
  },

  // Phase 12: Real-Time Collaboration Hub
  {
    id: 'collaboration-hub',
    title: 'Real-Time Team Coordination',
    subtitle: 'WebSocket-powered live collaboration',
    description: 'Instant updates, activity feeds, and team synchronization',
    type: 'navigation',
    phase: 'response',
    route: '/dashboard',
    duration: 18000, // 18 seconds
    narration: 'Real-time collaboration powered by WebSocket technology eliminates the coordination lag that costs enterprises $1.2M annually in delayed decisions. Traditional tools require page refreshes and email notifications - creating 15-45 minute information delays. When Procurement updates supplier status, Production sees it in under 200 milliseconds across the globe. This instant synchronization prevents the cascading delays where Finance makes budget decisions based on outdated operational data. The unified activity feed creates an organizational nervous system - every action logged, every stakeholder informed, complete audit trail for compliance. Our customers report 73% reduction in coordination meetings and 89% decrease in "just checking on status" emails. MIT research shows real-time collaboration platforms improve decision quality by 34% by ensuring all stakeholders work from current data.',
    targetElements: ['dashboard-page', 'activity-feed-panel', 'real-time-activity-item'],
    actions: [
      { type: 'wait', delay: 4000 },
      { type: 'scroll', target: 'activity-feed-panel', delay: 6000 },
      { type: 'wait', delay: 6000 }
    ]
  },

  // Phase 13: Crisis Template Library
  {
    id: 'crisis-templates',
    title: 'Crisis Response Template Library',
    subtitle: 'Comprehensive emergency protocols and playbooks',
    description: '15+ professional crisis response templates ready for immediate activation',
    type: 'navigation',
    phase: 'planning',
    route: '/crisis',
    duration: 22000, // 22 seconds
    narration: 'Your 80+ Executive Playbook Library - built by YOUR team for YOUR scenarios. Just as NFL coaches script plays for every situation, you build playbooks for your critical scenarios: SCM-001 Supply Chain Disruption, SEC-001 Cybersecurity Breach, FIN-001 Market Volatility, HR-001 Talent Crisis, and 76 more tailored to your business. Each playbook YOU define includes: execution phases (Immediate/Short-term/Long-term), stakeholder notification lists (who gets alerted), resource protocols (what teams mobilize), compliance templates (your regulatory requirements), success metrics (how you measure results). Then you define triggers: "When X condition AND Y threshold, activate THIS playbook." Traditional approach: 72 hours of meetings deciding what to do. Your approach: pre-configured playbook executes in 12 minutes when YOUR triggers fire. The playbooks are yours, the triggers are yours, the AI co-pilot delivers the coordination speed. 94% success rate because you\'ve already decided what to do.',
    targetElements: ['crisis-response-center', 'crisis-templates-section', 'template-supply-chain'],
    actions: [
      { type: 'wait', delay: 5000 },
      { type: 'scroll', target: 'crisis-templates-section', delay: 8000 },
      { type: 'hover', target: 'template-supply-chain', delay: 7000 }
    ]
  },

  // Phase 14: Crisis Activation Protocol
  {
    id: 'crisis-activation',
    title: 'Emergency Command Center Activation',
    subtitle: 'One-click crisis response mobilization',
    description: 'Automated stakeholder notification and resource coordination',
    type: 'interaction',
    phase: 'response',
    route: '/crisis',
    duration: 20000, // 20 seconds
    narration: 'Playbook activation shows the power of YOUR pre-configuration. You already decided: "When supply chain trigger fires, notify THESE 23 executives, assign THESE tasks, activate THESE resources." One click executes YOUR plan in 12 minutes: (1) Stakeholder notifications to YOUR defined list via email/SMS/Slack with YOUR pre-written briefing, (2) Task assignments to YOUR designated owners with YOUR accountability structure, (3) Communication channels YOU configured (Slack channel, conference bridge, shared docs), (4) Timeline tracker using YOUR defined milestones, (5) Command dashboard showing YOUR execution status, (6) Compliance logging for YOUR requirements (SOX/SOC2/ISO27001), (7) Resource mobilization following YOUR protocols, (8) Vendor notifications using YOUR templates. Traditional approach: 4-6 hours deciding what to do. Your approach: 12 minutes executing what you ALREADY decided. The playbook is yours, the AI co-pilot handles the coordination speed. 24/7 readiness means your 2am crisis gets your 2pm response quality.',
    targetElements: ['crisis-response-center', 'crisis-active-counter', 'crisis-templates-section'],
    actions: [
      { type: 'wait', delay: 4000 },
      { type: 'scroll', target: 'crisis-templates-section', delay: 7000 },
      { type: 'wait', delay: 7000 }
    ]
  },

  // Phase 15: Response Phase Management
  {
    id: 'response-phases',
    title: 'Crisis Response Phase Coordination',
    subtitle: 'Immediate, short-term, and long-term response management',
    description: 'Structured response workflows across all crisis lifecycle phases',
    type: 'interaction',
    phase: 'response',
    route: '/crisis',
    duration: 20000, // 20 seconds
    narration: 'Effective crisis response requires phased execution - the NFL equivalent of scripting the first 15 plays. Immediate Phase (0-24 hours): Threat containment, stakeholder safety, damage limitation. Traditional response: frantic meetings, unclear ownership, 67% of critical actions missed. Bastion immediate phase: pre-scripted tasks, automated assignments, 94% critical action completion. Short-term Phase (Days 1-7): Operational continuity, customer communication, regulatory compliance. Traditional: coordination chaos, 43% customer communication delays. Bastion: automated stakeholder workflows, 97% on-time communication. Long-term Phase (Weeks 2-8): Systemic improvements, process hardening, capability building. Traditional: 71% of companies never complete post-crisis analysis. Bastion: structured improvement protocols, 89% complete full cycle. This phased discipline transforms reactive fire-fighting into strategic resilience building. Companies completing all three phases report 58% fewer repeat incidents and 2.3x faster recovery times.',
    targetElements: ['crisis-response-center', 'crisis-active-counter', 'crisis-card-supply-chain'],
    actions: [
      { type: 'wait', delay: 6000 },
      { type: 'hover', target: 'crisis-card-supply-chain', delay: 5000 },
      { type: 'wait', delay: 7000 }
    ]
  },

  // Phase 16: Performance Analytics Dashboard
  {
    id: 'performance-analytics',
    title: 'Executive Performance Analytics',
    subtitle: 'Comprehensive organizational metrics and KPI tracking',
    description: 'Real-time performance dashboards with predictive trend analysis',
    type: 'navigation',
    phase: 'measurement',
    route: '/dashboard',
    duration: 22000, // 22 seconds
    narration: 'Performance Analytics transforms executive dashboards from lagging indicators to forward-looking intelligence. Traditional dashboards show last month\'s results when you need next month\'s insights. This unified view aggregates: Decision Velocity (12-min average, 85% faster than industry), Playbook Execution Success (94% vs 31% industry), Strategic Initiative ROI ($8.2M monthly value created), AI Intelligence Scores (Pulse 87.6%, Echo 82.3%, Nova 95%), and Innovation Pipeline Value ($24M portfolio, 2.3x success rate). Advanced visualizations include: trend analysis on YOUR selected metrics with 89% trigger accuracy 3 weeks forward, variance alerts when YOUR metrics drift 15% from YOUR targets, and competitive benchmarking against industry peers. Notice the early warning system flagging culture health declining 4.2% - YOU defined that trigger, AI detected it 3 weeks before it impacts retention. McKinsey research shows trigger-based analytics improve executive decision outcomes by 47% versus reactive dashboards.',
    targetElements: ['dashboard-page', 'performance-metrics-section', 'kpi-trend-chart'],
    actions: [
      { type: 'wait', delay: 5000 },
      { type: 'scroll', target: 'performance-metrics-section', delay: 8000 },
      { type: 'wait', delay: 7000 }
    ]
  },

  // Phase 17: Organization Management
  {
    id: 'organization-management',
    title: 'Multi-Organization Portfolio Management',
    subtitle: 'Enterprise-wide visibility and control',
    description: 'Comprehensive management across organizational units and subsidiaries',
    type: 'navigation',
    phase: 'planning',
    route: '/dashboard',
    duration: 18000, // 18 seconds
    narration: 'Multi-organization portfolio management solves the control-vs-autonomy challenge plaguing enterprise conglomerates. Traditional approaches: Corporate mandates kill innovation (52% subsidiary leaders report), or complete autonomy creates redundancy and missed synergies ($47M average annual waste). Bastion enables federated excellence: Each division (Manufacturing, Retail, Services) operates independent playbooks and AI intelligence - while corporate maintains portfolio visibility. The hierarchical structure shows: Division autonomy (83% independent decision-making), Corporate oversight (100% visibility, zero micromanagement), and Cross-portfolio analytics revealing $8.4M in synergy opportunities. Notice Manufacturing and Retail both responding to semiconductor shortages - the platform identifies shared supplier dependencies and coordinates joint procurement saving 23% versus separate approaches. Fortune 500 companies using this model report 67% better subsidiary performance with 41% reduction in corporate overhead.',
    targetElements: ['organizations-overview-section', 'org-card-innovate-dynamics'],
    actions: [
      { type: 'wait', delay: 4000 },
      { type: 'hover', target: 'org-card-innovate-dynamics', delay: 6000 },
      { type: 'wait', delay: 6000 }
    ]
  },

  // Phase 18: Advanced Data Visualization
  {
    id: 'data-visualization',
    title: 'Strategic Data Visualization Suite',
    subtitle: 'Interactive charts, graphs, and visual intelligence',
    description: 'Comprehensive data visualization capabilities for executive presentations',
    type: 'navigation',
    phase: 'measurement',
    route: '/pulse',
    duration: 20000, // 20 seconds
    narration: 'Data visualization for executive communications addresses a critical board challenge: 68% of directors say they can\'t make decisions from the data presented to them. This visualization suite transforms data into executive insights. Interactive charts enable drill-down: click 87.6% health score to see the 15 contributing factors and their individual trends. Predictive bands show 89% confidence intervals for future performance. Heat maps reveal non-obvious correlations: notice how innovation investment correlates 0.73 with cultural health - investments in innovation improve morale. All visualizations export board-ready: PowerPoint with speaker notes, PDF with executive summaries, high-res images for investor decks. The AI auto-selects optimal chart types: time-series gets line charts, distributions get histograms, correlations get scatter plots. Harvard Business Review research shows well-visualized data improves board decision speed by 54% and decision quality by 38%.',
    targetElements: ['pulse-intelligence', 'visualization-charts-section', 'trend-chart-health'],
    actions: [
      { type: 'wait', delay: 5000 },
      { type: 'hover', target: 'trend-chart-health', delay: 7000 },
      { type: 'wait', delay: 6000 }
    ]
  },

  // Phase 19: Stakeholder Communication System
  {
    id: 'stakeholder-communication',
    title: 'Integrated Stakeholder Communication',
    subtitle: 'Unified messaging and notification management',
    description: 'Comprehensive stakeholder coordination and communication workflows',
    type: 'navigation',
    phase: 'response',
    route: '/scenarios',
    duration: 18000, // 18 seconds
    narration: 'Stakeholder communication failures cause 57% of strategic initiative failures - the wrong people get the wrong information at the wrong time. This integrated system solves it. Multi-channel delivery ensures message receipt: Email (95% delivery), SMS (98% delivery), In-platform (100% real-time), Slack/Teams integration (immediate). Pre-configured stakeholder groups eliminate manual distribution: "Supply Chain Crisis" playbook auto-notifies 47 stakeholders across Procurement, Operations, Finance, and Executive teams in under 90 seconds. Communication templates maintain professional consistency while allowing personalization. Advanced tracking shows: Delivered (100%), Opened (94%), Read (87%), Acknowledged (73%) - revealing which stakeholders need follow-up. Two-way feedback enables responses without email chaos. Companies using centralized communication versus email/Slack chaos report 76% faster stakeholder alignment and 83% reduction in "I wasn\'t informed" complaints.',
    targetElements: ['scenarios-page', 'stakeholder-communication-panel'],
    actions: [
      { type: 'wait', delay: 4000 },
      { type: 'scroll', target: 'stakeholder-communication-panel', delay: 6000 },
      { type: 'wait', delay: 6000 }
    ]
  },

  // Phase 20: Risk Management Dashboard
  {
    id: 'risk-management',
    title: 'Enterprise Risk Intelligence',
    subtitle: 'Comprehensive risk identification, assessment, and mitigation',
    description: 'AI-powered risk detection with predictive threat modeling',
    type: 'navigation',
    phase: 'detection',
    route: '/crisis',
    duration: 22000, // 22 seconds
    narration: 'Traditional risk management is reactive - 73% of enterprise threats are discovered after they\'re already impacting operations. AI-powered risk intelligence changes this. The system continuously monitors 15,000+ risk signals: Supplier financial health (detected this bankruptcy 72 hours early), Market volatility indicators, Regulatory change feeds, Competitive intelligence, Technology disruption patterns, Organizational capability gaps. Each risk auto-scores using enterprise frameworks: Probability (High/Med/Low), Impact ($-quantified), Velocity (how fast it\'s escalating), and Strategic exposure (which initiatives affected). The predictive engine provides 3-week early warning with 91% accuracy. Notice Supply Chain risk trending from Yellow to Red - the system recommends activating Playbook SCM-001 before it becomes a crisis. Risk mitigation tracking shows: 47 risks identified this quarter, 38 mitigated proactively, 9 escalated to playbook activation, $12.4M in prevented losses. Companies using predictive risk versus reactive registers report 67% fewer crisis situations.',
    targetElements: ['crisis-response-center', 'risk-dashboard-section', 'risk-matrix-visual'],
    actions: [
      { type: 'wait', delay: 5000 },
      { type: 'scroll', target: 'risk-dashboard-section', delay: 8000 },
      { type: 'wait', delay: 7000 }
    ]
  },

  // Phase 21: Innovation Portfolio Management
  {
    id: 'innovation-portfolio',
    title: 'Innovation Pipeline & Portfolio Analytics',
    subtitle: 'Comprehensive innovation tracking from ideation to commercialization',
    description: 'Full lifecycle innovation management with breakthrough probability scoring',
    type: 'navigation',
    phase: 'execution',
    route: '/nova',
    duration: 24000, // 24 seconds
    narration: 'Innovation portfolio management prevents the 72% failure rate plaguing corporate innovation. Traditional approaches: scattered projects, unclear criteria, political decision-making resulting in $18M average annual waste on failed innovations. Nova manages the complete lifecycle: Ideation (247 concepts in queue), Discovery (43 in feasibility), Development (12 active projects), Validation (5 in market testing), Launch (2 ready for scale). The breakthrough probability scoring uses AI analysis: Technical feasibility 87%, Market opportunity $24M TAM, Competitive differentiation High, Organizational capability 91% - overall breakthrough score 95%. This beats venture capital success rates. Investment tracking shows real-time burn: $24M portfolio budget, $18.2M deployed, $5.8M remaining with optimal allocation recommendations. Portfolio analytics reveal innovation gaps: Strong in process automation, weak in customer experience innovations - the system recommends rebalancing 15% of budget. Companies using AI-driven innovation management achieve 2.3x higher success rates and 58% better ROI versus gut-feel approaches.',
    targetElements: ['nova-innovations', 'innovation-portfolio-view', 'breakthrough-probability-metric'],
    actions: [
      { type: 'wait', delay: 6000 },
      { type: 'click', target: 'tab-portfolio', delay: 9000 },
      { type: 'wait', delay: 7000 }
    ]
  },

  // Phase 22: Regulatory Compliance Tracking
  {
    id: 'compliance-tracking',
    title: 'Regulatory Compliance & Audit Trails',
    subtitle: 'Comprehensive compliance management and documentation',
    description: 'Automated compliance tracking with complete audit trail capabilities',
    type: 'navigation',
    phase: 'measurement',
    route: '/crisis',
    duration: 20000, // 20 seconds
    narration: 'Regulatory compliance is critical for playbook execution and strategic operations. Bastion provides comprehensive compliance tracking with automated audit trail generation for all platform actions. Every playbook activation, task completion, decision point, stakeholder notification, and document access is logged with timestamps, user identification, and contextual details. Industry-specific compliance frameworks are built into executive playbooks - including FDA/CMS requirements for healthcare, SOX controls for financial services, OSHA protocols for manufacturing, and FTC guidelines for retail. The platform generates compliance reports in formats required by regulators, reducing audit preparation time by 80% and ensuring defensible documentation.',
    targetElements: ['crisis-response-center', 'compliance-dashboard-section', 'audit-trail-log'],
    actions: [
      { type: 'wait', delay: 5000 },
      { type: 'scroll', target: 'compliance-dashboard-section', delay: 7000 },
      { type: 'wait', delay: 6000 }
    ]
  },

  // Phase 23: Executive Reporting Suite
  {
    id: 'executive-reporting',
    title: 'Executive Reporting & Board Communications',
    subtitle: 'Automated report generation for leadership presentations',
    description: 'Professional reports and presentations with one-click generation',
    type: 'navigation',
    phase: 'measurement',
    route: '/pulse',
    duration: 20000, // 20 seconds
    narration: 'Executive Reporting transforms platform data into professional presentations and board-ready reports with one click. Pre-configured report templates include: Monthly Strategic Review, Quarterly Board Update, Playbook Execution Summary, Innovation Portfolio Review, and Annual Strategic Assessment. Each report automatically pulls current data, generates relevant visualizations, highlights key insights, and formats content in executive-appropriate language. Reports are exportable to PowerPoint, PDF, and Word formats. Custom report builders allow creation of specialized reports for specific stakeholder groups. This automation eliminates hours of manual report preparation and ensures consistency in executive communications.',
    targetElements: ['pulse-intelligence', 'reporting-suite-section', 'button-generate-report'],
    actions: [
      { type: 'wait', delay: 5000 },
      { type: 'scroll', target: 'reporting-suite-section', delay: 7000 },
      { type: 'wait', delay: 6000 }
    ]
  },

  // Phase 24: Competitive Intelligence Integration
  {
    id: 'competitive-intelligence',
    title: 'Competitive Intelligence & Market Monitoring',
    subtitle: 'AI-powered competitive tracking and market intelligence',
    description: 'Continuous monitoring of competitive movements and market dynamics',
    type: 'navigation',
    phase: 'detection',
    route: '/prism',
    duration: 22000, // 22 seconds
    narration: 'Competitive Intelligence within Bastion provides continuous monitoring of competitor actions, market dynamics, and industry trends. Our AI scans public filings, news sources, social media, patent databases, and market research to identify competitor strategic moves, product launches, pricing changes, and leadership transitions. Competitive benchmarking compares your strategic initiatives against industry best practices and competitor capabilities. Market opportunity analysis identifies whitespace and emerging trends before competitors. This intelligence feeds directly into strategic planning, enabling proactive responses to competitive threats and first-mover advantage on market opportunities.',
    targetElements: ['prism-insights', 'competitive-intelligence-section', 'competitor-activity-feed'],
    actions: [
      { type: 'wait', delay: 5000 },
      { type: 'scroll', target: 'competitive-intelligence-section', delay: 8000 },
      { type: 'wait', delay: 7000 }
    ]
  },

  // Phase 25: Integration Ecosystem
  {
    id: 'integration-ecosystem',
    title: 'Enterprise Integration Ecosystem',
    subtitle: 'Seamless connectivity with existing enterprise systems',
    description: 'APIs, webhooks, and pre-built integrations with major enterprise platforms',
    type: 'navigation',
    phase: 'execution',
    route: '/dashboard',
    duration: 20000, // 20 seconds
    narration: 'Bastion integrates seamlessly with your existing enterprise technology stack. Pre-built connectors link to major platforms including: Salesforce for CRM data, Workday for HR metrics, SAP for financial systems, Jira for project management, Microsoft Teams for collaboration, Slack for communications, and Tableau for advanced analytics. RESTful APIs enable custom integrations with proprietary systems. Webhook notifications push Bastion events to external systems in real-time. Data synchronization maintains consistency across platforms without manual data entry. Single sign-on (SSO) integration with Azure AD, Okta, and other identity providers simplifies user management. This integration capability ensures Bastion enhances rather than replaces your existing technology investments.',
    targetElements: ['dashboard-page', 'integration-status-section'],
    actions: [
      { type: 'wait', delay: 5000 },
      { type: 'scroll', target: 'integration-status-section', delay: 7000 },
      { type: 'wait', delay: 6000 }
    ]
  },

  // Phase 26: Security & Access Control
  {
    id: 'security-access-control',
    title: 'Enterprise Security & Role-Based Access',
    subtitle: 'Comprehensive security architecture and granular permissions',
    description: 'Bank-level security with flexible access control and audit capabilities',
    type: 'navigation',
    phase: 'measurement',
    route: '/dashboard',
    duration: 18000, // 18 seconds
    narration: 'Security and access control in Bastion meet the highest enterprise standards. All data is encrypted in transit using TLS 1.3 and at rest using AES-256. Role-based access control (RBAC) provides granular permissions at the organization, scenario, playbook, and module levels. Multi-factor authentication (MFA) is available for sensitive operations. Session management includes automatic timeout and concurrent session limits. IP whitelisting restricts access to corporate networks. Comprehensive audit logging tracks all user actions for security compliance. Regular penetration testing and security audits ensure continued protection. The platform is SOC 2 Type II certified and complies with GDPR, CCPA, and HIPAA requirements where applicable.',
    targetElements: ['dashboard-page', 'security-status-indicator'],
    actions: [
      { type: 'wait', delay: 4000 },
      { type: 'hover', target: 'security-status-indicator', delay: 6000 },
      { type: 'wait', delay: 6000 }
    ]
  },

  // Phase 27: Mobile & Remote Access
  {
    id: 'mobile-remote-access',
    title: 'Mobile Crisis Management & Remote Access',
    subtitle: '24/7 access from any device, anywhere',
    description: 'Full-featured mobile applications for iOS and Android',
    type: 'navigation',
    phase: 'response',
    route: '/crisis',
    duration: 18000, // 18 seconds
    narration: 'Decision-making doesn\'t wait for executives to reach their desks. Bastion provides full-featured mobile applications for iOS and Android, enabling complete platform access from smartphones and tablets. Mobile capabilities include: playbook execution and monitoring, task assignment and completion, stakeholder notifications, real-time activity feeds, secure messaging, and executive dashboard viewing. The mobile interface adapts intelligently to screen size while maintaining full functionality. Offline mode caches critical data for access in low-connectivity situations. Push notifications alert executives to urgent developments instantly. This mobile-first architecture ensures your organization can execute playbooks and respond to strategic threats regardless of physical location or time of day.',
    targetElements: ['crisis-response-center', 'mobile-responsive-design'],
    actions: [
      { type: 'wait', delay: 4000 },
      { type: 'scroll', target: 'mobile-responsive-design', delay: 6000 },
      { type: 'wait', delay: 6000 }
    ]
  },

  // Phase 28: Training & Onboarding System
  {
    id: 'training-onboarding',
    title: 'Integrated Training & User Onboarding',
    subtitle: 'Accelerated adoption with comprehensive training resources',
    description: 'Interactive tutorials, video guides, and certification programs',
    type: 'navigation',
    phase: 'execution',
    route: '/dashboard',
    duration: 18000, // 18 seconds
    narration: 'Rapid user adoption is critical for platform ROI. Bastion includes a comprehensive training and onboarding system built directly into the platform. Interactive tutorials guide new users through core workflows with hands-on practice scenarios. Video library contains role-specific training modules for executives, managers, and team members. Contextual help provides instant guidance based on current page and user role. Certification programs validate user proficiency and best practice adherence. Admin dashboards track adoption metrics, identify struggling users, and measure training effectiveness. Average time-to-proficiency is reduced to 2-3 days compared to weeks for traditional enterprise software, accelerating value realization.',
    targetElements: ['dashboard-page', 'help-center-link'],
    actions: [
      { type: 'wait', delay: 4000 },
      { type: 'hover', target: 'help-center-link', delay: 6000 },
      { type: 'wait', delay: 6000 }
    ]
  },

  // Phase 29: Customization & Configuration
  {
    id: 'customization-configuration',
    title: 'Enterprise Customization & Branding',
    subtitle: 'Flexible configuration to match organizational needs',
    description: 'White-label options, custom workflows, and branded experiences',
    type: 'navigation',
    phase: 'planning',
    route: '/dashboard',
    duration: 18000, // 18 seconds
    narration: 'Every organization has unique processes and branding requirements. Bastion provides extensive customization capabilities to match your specific needs. White-label options allow complete rebranding with your company logo, colors, and domain. Custom workflow builders enable creation of organization-specific processes and approval chains. Field customization adds proprietary data points to scenarios, crises, and tasks. Dashboard layouts can be reconfigured to emphasize metrics most relevant to your industry. Terminology can be adapted - changing "scenarios" to "initiatives" or "projects" based on internal language. Role definitions are fully customizable to match organizational structure. This flexibility ensures Bastion aligns with how your organization actually works.',
    targetElements: ['dashboard-page', 'customization-options'],
    actions: [
      { type: 'wait', delay: 4000 },
      { type: 'scroll', target: 'customization-options', delay: 6000 },
      { type: 'wait', delay: 6000 }
    ]
  },

  // Phase 30: Executive ROI Summary & Platform Value
  {
    id: 'roi-summary',
    title: 'Executive Value Proposition & ROI Summary',
    subtitle: 'Comprehensive platform impact and quantified business outcomes',
    description: 'Complete demonstration summary with measurable value delivery',
    type: 'executive',
    phase: 'measurement',
    route: '/executive-demo',
    duration: 30000, // 30 seconds - extended for comprehensive summary
    executiveStep: 5, // ROI measurement step
    narration: 'You\'ve now experienced the complete depth and breadth of Bastion\'s Executive Playbook Platform. Let\'s summarize the comprehensive value delivered: Five AI Intelligence Modules provide continuous organizational insights across health, adaptation, strategy, culture, and innovation. Executive Playbook System with 80+ templates enables 85% faster decision velocity - from 72 hours to 12 minutes with complete compliance documentation. Strategic Scenario Management coordinates complex multi-year initiatives with stakeholder alignment and resource optimization. Real-time Collaboration eliminates communication lag with WebSocket-powered instant updates. Performance Analytics deliver executive dashboards with predictive trend analysis and benchmark comparisons. Enterprise Integration seamlessly connects with existing technology investments. Mobile accessibility ensures 24/7 playbook execution capability. The quantified bottom line: $247 million in protected market value, 1,847% ROI, 9-month response acceleration, 87% success probability, and organizational transformation from reactive firefighting to proactive strategic leadership like an NFL coach. Bastion is not just another enterprise software platform - it is the comprehensive Executive Playbook Platform that Fortune 1000 organizations use to See Clearer, Lead Bolder, and Decide Faster.',
    targetElements: ['platform-roi-value', 'market-share-protected', 'executive-value-summary', 'comprehensive-capabilities-list']
  }
];

interface DemoControllerProviderProps {
  children: React.ReactNode;
}

export function DemoControllerProvider({ children }: DemoControllerProviderProps) {
  const [location, setLocation] = useLocation();
  const [state, setState] = useState<DemoState>({
    isActive: false,
    isPaused: false,
    currentScene: 0,
    totalScenes: hybridDemoScenarios.length,
    progress: 0,
    presentationMode: false,
    autoAdvance: true,
    selectedPersona: 'general',
    selectedIndustry: 'general',
    decisionPath: [],
    waitingForDecision: false
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentSceneData = state.isActive ? hybridDemoScenarios[state.currentScene] || null : null;

  // Navigation automation
  const navigateToScene = useCallback((scene: DemoScene) => {
    if (scene.route && scene.route !== location) {
      setLocation(scene.route);
    }
  }, [location, setLocation]);

  // Auto-advance to next scene
  const autoAdvanceScene = useCallback(() => {
    if (!state.autoAdvance || state.isPaused || !state.isActive) return;
    
    const currentScene = hybridDemoScenarios[state.currentScene];
    if (!currentScene) return;

    timeoutRef.current = setTimeout(() => {
      setState(prev => {
        if (prev.currentScene >= prev.totalScenes - 1) {
          // Demo completed
          return {
            ...prev,
            isActive: false,
            currentScene: 0,
            progress: 100
          };
        }
        
        const nextSceneIndex = prev.currentScene + 1;
        const nextScene = hybridDemoScenarios[nextSceneIndex];
        
        // Navigate to next scene route
        if (nextScene.route) {
          setLocation(nextScene.route);
        }
        
        return {
          ...prev,
          currentScene: nextSceneIndex,
          progress: ((nextSceneIndex + 1) / prev.totalScenes) * 100
        };
      });
    }, currentScene.duration);
  }, [state.autoAdvance, state.isPaused, state.isActive, state.currentScene, setLocation]);

  // Clear timeout on scene changes
  const clearAdvanceTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Demo control functions
  const startDemo = useCallback(() => {
    setState({
      isActive: true,
      isPaused: false,
      currentScene: 0,
      totalScenes: hybridDemoScenarios.length,
      progress: 0,
      presentationMode: false,
      autoAdvance: true,
      selectedPersona: 'general',
      selectedIndustry: 'general',
      decisionPath: [],
      waitingForDecision: false
    });
    
    // Navigate to first scene
    const firstScene = hybridDemoScenarios[0];
    if (firstScene.route) {
      setLocation(firstScene.route);
    }
  }, [setLocation]);

  const pauseDemo = useCallback(() => {
    setState(prev => ({ ...prev, isPaused: true }));
    clearAdvanceTimeout();
  }, [clearAdvanceTimeout]);

  const resumeDemo = useCallback(() => {
    setState(prev => ({ ...prev, isPaused: false }));
  }, []);

  const stopDemo = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      isActive: false, 
      isPaused: false, 
      currentScene: 0, 
      progress: 0 
    }));
    clearAdvanceTimeout();
  }, [clearAdvanceTimeout]);

  const nextScene = useCallback(() => {
    setState(prev => {
      if (prev.currentScene >= prev.totalScenes - 1) return prev;
      
      const nextSceneIndex = prev.currentScene + 1;
      const nextScene = hybridDemoScenarios[nextSceneIndex];
      
      if (nextScene.route) {
        setLocation(nextScene.route);
      }
      
      return {
        ...prev,
        currentScene: nextSceneIndex,
        progress: ((nextSceneIndex + 1) / prev.totalScenes) * 100
      };
    });
    clearAdvanceTimeout();
  }, [setLocation, clearAdvanceTimeout]);

  const prevScene = useCallback(() => {
    setState(prev => {
      if (prev.currentScene <= 0) return prev;
      
      const prevSceneIndex = prev.currentScene - 1;
      const prevScene = hybridDemoScenarios[prevSceneIndex];
      
      if (prevScene.route) {
        setLocation(prevScene.route);
      }
      
      return {
        ...prev,
        currentScene: prevSceneIndex,
        progress: ((prevSceneIndex + 1) / prev.totalScenes) * 100
      };
    });
    clearAdvanceTimeout();
  }, [setLocation, clearAdvanceTimeout]);

  const jumpToScene = useCallback((sceneIndex: number) => {
    if (sceneIndex < 0 || sceneIndex >= hybridDemoScenarios.length) return;
    
    const targetScene = hybridDemoScenarios[sceneIndex];
    
    setState(prev => ({
      ...prev,
      currentScene: sceneIndex,
      progress: ((sceneIndex + 1) / prev.totalScenes) * 100
    }));
    
    if (targetScene.route) {
      setLocation(targetScene.route);
    }
    clearAdvanceTimeout();
  }, [setLocation, clearAdvanceTimeout]);

  const togglePresentationMode = useCallback(() => {
    setState(prev => ({ ...prev, presentationMode: !prev.presentationMode }));
  }, []);

  // Auto-advance effect
  useEffect(() => {
    if (state.isActive && !state.isPaused && state.autoAdvance) {
      autoAdvanceScene();
    }
    
    return () => clearAdvanceTimeout();
  }, [state.isActive, state.isPaused, state.autoAdvance, state.currentScene, autoAdvanceScene, clearAdvanceTimeout]);

  // Decision and personalization methods
  const makeDecision = useCallback((optionId: string) => {
    // Find the decision option to extract metadata
    const currentScene = hybridDemoScenarios[state.currentScene];
    const option = currentScene.decisionOptions?.find(opt => opt.id === optionId);
    
    setState(prev => {
      const newState = {
        ...prev,
        decisionPath: [...prev.decisionPath, optionId],
        waitingForDecision: false
      };
      
      // Update persona if decision contains persona information
      if (option?.persona) {
        newState.selectedPersona = option.persona;
      }
      
      // Update industry if decision is industry-related (check option id pattern)
      if (optionId.includes('sector')) {
        const industry = optionId.replace('-sector', '') as 'healthcare' | 'finance' | 'manufacturing' | 'retail';
        newState.selectedIndustry = industry;
      }
      
      return newState;
    });
    
    // Navigate to next scene
    if (option) {
      const nextSceneIndex = hybridDemoScenarios.findIndex(scene => scene.id === option.nextSceneId);
      if (nextSceneIndex !== -1) {
        setTimeout(() => {
          setState(prev => ({ ...prev, currentScene: nextSceneIndex }));
          const nextScene = hybridDemoScenarios[nextSceneIndex];
          if (nextScene.route) {
            setLocation(nextScene.route);
          }
        }, 500); // Small delay for smooth transition
      }
    }
  }, [state.currentScene, setLocation]);

  const setPersona = useCallback((persona: 'ceo' | 'coo' | 'chro' | 'general') => {
    setState(prev => ({ ...prev, selectedPersona: persona }));
  }, []);

  const setIndustry = useCallback((industry: 'healthcare' | 'finance' | 'manufacturing' | 'retail' | 'general') => {
    setState(prev => ({ ...prev, selectedIndustry: industry }));
  }, []);

  const contextValue: DemoControllerContextType = {
    state,
    startDemo,
    pauseDemo,
    resumeDemo,
    stopDemo,
    nextScene,
    prevScene,
    jumpToScene,
    togglePresentationMode,
    makeDecision,
    setPersona,
    setIndustry,
    currentSceneData,
    allScenes: hybridDemoScenarios
  };

  return (
    <DemoControllerContext.Provider value={contextValue}>
      {children}
    </DemoControllerContext.Provider>
  );
}