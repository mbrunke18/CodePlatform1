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
  persona?: 'ceo' | 'coo' | 'chro' | 'cto' | 'cio' | 'cdo' | 'ciso' | 'cfo';
  industry?: 'healthcare' | 'finance' | 'manufacturing' | 'retail' | 'general';
  isDecisionPoint?: boolean;
  decisionOptions?: Array<{
    id: string;
    label: string;
    description: string;
    nextSceneId: string;
    persona?: 'ceo' | 'coo' | 'chro' | 'cto' | 'cio' | 'cdo' | 'ciso' | 'cfo';
    focus: 'strategy' | 'operations' | 'people' | 'technology' | 'digital' | 'data' | 'security' | 'finance' | 'crisis' | 'innovation';
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
  selectedPersona?: 'ceo' | 'coo' | 'chro' | 'cto' | 'cio' | 'cdo' | 'ciso' | 'cfo';
  selectedIndustry?: 'healthcare' | 'finance' | 'manufacturing' | 'retail' | 'general';
  decisionPath: string[];
  waitingForDecision: boolean;
  currentExecutiveStep: number;
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
  setPersona: (persona: 'ceo' | 'coo' | 'chro' | 'cto' | 'cio' | 'cdo' | 'ciso' | 'cfo') => void;
  setIndustry: (industry: 'healthcare' | 'finance' | 'manufacturing' | 'retail' | 'general') => void;
  setExecutiveStep: (step: number) => void;
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

// Persona-specific narration configurations for adaptive demo experience
const personaNarrations = {
  ceo: {
    intro: 'Welcome to M. Let me show you how CEOs use executive triggers to detect crises days before competitors. You\'ll see a supplier disruption crisis simulation - the same scenario that traditionally takes 72 hours to coordinate. In M, it executes in 12 minutes. First, I\'ll show you the Crisis Response Center where you\'ll see an active crisis alert.',
    detection: 'Look at the red alert banner at the top - this is what appears when one of YOUR executive triggers fires. Notice the supplier name "AcmeParts" and the severity level. This trigger detected financial distress 72 hours before your competitors will hear about it through news. Click the "View Crisis Response" button to see the full crisis dashboard with all the details and recommended playbooks.',
    analysis: 'This is the Crisis Response Center. See the active crisis card showing AcmeParts? Notice the countdown timer - it tracks how quickly you respond. The traditional industry standard is 72 hours. M targets 12 minutes. Below, you see the crisis metrics: severity, affected departments, estimated impact. The recommended playbook "SCM-001" is ready to activate with one click. This is your strategic command center.',
    decision: 'Now you\'ll activate the playbook. One click sends role-specific tasks to every department simultaneously. The CFO gets financial protocols, COO gets operational steps, CHRO gets workforce communications - all coordinated through the platform. Notice the task tracker showing 12 tasks being distributed across teams. This is the power of pre-configured playbooks - no meetings needed to coordinate response.',
    activation: 'Watch the task tracker in real-time. Each department receives their specific playbook steps automatically. Procurement is finding alternative suppliers, Production is adjusting schedules, Finance is activating payment protocols, Communications is preparing customer updates. All 12 tasks are executing in parallel across 5 departments. This coordinated response is what makes the 12-minute execution possible.',
    execution: 'The countdown timer shows 9 minutes elapsed. Tasks are completing in real-time - green checkmarks show finished items. Traditional crisis response takes 72 hours because of sequential coordination delays. M eliminates those delays by giving everyone their playbook simultaneously. Notice how different departments see different tasks - that\'s role-based playbook distribution. Every stakeholder knows exactly what to do.',
    results: 'Crisis resolved in 12 minutes. The ROI Dashboard shows what this means: $12M revenue protected, 71 hours saved compared to traditional response, 5-day competitive advantage. Your Executive Preparedness Score increases because you practiced crisis response. This is how Fortune 1000 executives are transforming decision velocity - from 72 hours to 12 minutes through pre-configured playbooks and executive triggers.'
  },
  coo: {
    intro: 'Let me show you how COOs use M to maintain production continuity during supplier disruptions. You\'ll see how operational triggers detect capacity risks before they impact production. The same supplier crisis that would traditionally shut down production lines for days gets resolved in 12 minutes through coordinated playbook execution. I\'ll walk you through the Crisis Response Center.',
    detection: 'See the alert banner? Your operational trigger detected "Critical Supplier Capacity Risk" for AcmeParts - impacting 3 production facilities. Notice the metrics: 35% of manufacturing capacity at risk, 847 affected employees. Traditional operations teams discover this 48 hours after production stops. This trigger gave you 72 hours advance warning. Click to view the operational dashboard with facility-specific impact analysis.',
    analysis: 'The Crisis Response Center shows real-time production impact. Look at the affected capacity metrics, facility dependencies, and operational KPIs. The playbook "OPS-001 Production Continuity" is ready to activate. This dashboard gives you complete operational intelligence in 60 seconds - information that traditionally takes 12 hours of calls with facility managers to gather. Notice the recommended actions and success probability.',
    decision: 'Activate the Production Continuity playbook. Watch how one click distributes facility-specific tasks: Plant A gets rebalanced schedules, Plant B gets alternative material specs, Quality gets supplier protocols, Logistics gets shipping reroutes. Traditional approach requires 8 hours of conference calls coordinating 3 facilities. M distributes all facility-specific playbooks simultaneously in seconds.',
    activation: 'The task tracker shows operational coordination in action. Procurement is finding alternative suppliers with capacity data, Production is receiving revised schedules, Quality is running supplier qualification protocols, Logistics is rerouting shipments. All tasks executing in parallel across multiple facilities. This is how you maintain zero production stops during supplier disruptions.',
    execution: 'Notice the countdown timer at 9 minutes. Tasks are completing across all 3 facilities simultaneously - green checkmarks show progress. Traditional operations coordination happens sequentially through phone calls and emails, causing production delays. M gives every facility manager their specific playbook at the same time. That\'s why you can maintain 94% on-time delivery even during crises.',
    results: '12-minute operational response complete. The ROI Dashboard shows production maintained with zero unplanned downtime, $2.1M saved in rush orders and expedite fees, 94% on-time delivery preserved. Your Executive Preparedness Score increases for operational excellence. This is how modern COOs are protecting production continuity - coordinated facility response through pre-configured playbooks.'
  },
  chro: {
    intro: 'Let me show you how CHROs use M for people-first crisis management. You\'ll see how workforce triggers detect employee impact before rumors spread. The same supplier crisis that could trigger mass resignations gets handled through proactive communication in 12 minutes. Traditional HR discovers workforce impact 3-5 days after crisis starts. I\'ll show you the workforce stabilization playbook.',
    detection: 'The alert banner shows "Employee Impact Alert" for 847 affected workers. Your workforce trigger detected high facility risk, sentiment score drops, and turnover risk all firing together. Notice the people metrics: departments at risk, retention probability, sentiment trends. Traditional HR finds out about workforce impact through exit interviews days later. This trigger enables proactive protection. Click to see the workforce dashboard.',
    analysis: 'The Crisis Response Center displays complete workforce intelligence. See the 847 affected employees, retention risk analysis, and sentiment data showing a 12-point morale drop. The playbook "HR-001 Workforce Stabilization" is ready. This dashboard gives you workforce intelligence in 45 seconds that traditionally takes 5 days of meetings to gather. Notice the manager readiness assessment and retention strategies.',
    decision: 'Activate the Workforce Stabilization playbook. Watch how simultaneous communication reaches all stakeholders: 847 employees get personalized impact letters, 23 facility managers receive talking points and Q&A guides, HR team gets retention frameworks. Traditional HR takes 3 days drafting memos and scheduling meetings - during which rumors spread. M delivers transparent communication to everyone in 12 minutes.',
    activation: 'The task tracker shows people-focused coordination. Employee communication is sending personalized updates explaining job security, Manager portal is delivering briefing guides, HR is activating retention strategies, Culture team is monitoring sentiment. All workforce tasks executing simultaneously. This proactive transparency prevents the anxiety and turnover that destroys culture during crises.',
    execution: 'Countdown timer shows 9 minutes. Tasks completing across workforce management: employees informed, managers briefed and confident, sentiment being tracked in real-time. Traditional HR response causes preventable turnover through communication delays. M prevents turnover through immediate transparency. See the sentiment score recovering from proactive communication - that\'s culture preservation in action.',
    results: '12-minute workforce response complete. The ROI Dashboard shows 97% retention preserved (vs 63% industry average during crises), $890K saved in replacement costs, 23/23 managers felt prepared and supported. Your Executive Preparedness Score increases for people-first leadership. This is how modern CHROs protect talent and culture - proactive workforce communication through coordinated playbooks.'
  },
  cto: {
    intro: 'Let me show you how CTOs use M for infrastructure resilience. You\'ll see how technical triggers detect dependency risks before system failures. The same infrastructure crisis that would cause 6-hour war rooms gets resolved through automated failover in 12 minutes. Traditional CTOs discover tech problems 6-12 hours after users report issues. I\'ll walk you through infrastructure continuity.',
    detection: 'The alert banner shows "Infrastructure Dependency Risk" - your supplier disruption affected cloud services impacting ERP, PLM, and supply chain systems. Notice the technical metrics: affected systems, dependency chain, failover status. Traditional IT discovers this through user complaints hours after impact begins. This trigger gave you 72 hours advance warning before critical failure. Click to see the infrastructure dashboard.',
    analysis: 'The Crisis Response Center displays complete architecture intelligence. See the affected systems: ERP with 1,200 users, PLM with 340 engineers, supply chain platform. Dependency analysis shows 47 microservices, 23 APIs, 12 databases at risk. The playbook "TECH-001 Infrastructure Continuity" shows automated failover ready. This dashboard gives you architecture intelligence in 90 seconds vs 8-hour war room analysis. Notice the backup region status.',
    decision: 'Activate the Infrastructure Continuity playbook. Watch how automated failover executes: backup region activates, load balancers reroute traffic, API gateways update, engineering teams receive runbooks. Traditional approach requires 6-hour war rooms with architects and DevOps manually coordinating failover. M orchestrates automated failover with zero manual scripts or tribal knowledge required.',
    activation: 'The task tracker shows infrastructure orchestration. Automated failover is routing traffic across 47 microservices, database replication is confirming sync, engineering teams are receiving system-specific runbooks, SRE dashboard is showing migration progress. All technical tasks executing in parallel. This automated response is how you maintain 99.8% uptime during infrastructure crises.',
    execution: 'Countdown timer shows 9 minutes. Tasks completing across infrastructure layers: cloud failing over automatically, API traffic rerouting seamlessly, engineers monitoring dashboards, users experiencing zero service interruption. Traditional manual failover causes service degradation and downtime. M automated execution maintains seamless continuity. See the uptime metric staying at 99.8% - that\'s infrastructure resilience in action.',
    results: '12-minute infrastructure failover complete. The ROI Dashboard shows 99.8% uptime maintained (vs 94% industry average during infrastructure failures), zero user productivity loss, $1.8M saved in downtime costs, 18 engineers freed for innovation work. Your Executive Preparedness Score increases for technical excellence. This is how modern CTOs protect infrastructure - automated failover through orchestrated playbooks.'
  },
  cio: {
    intro: 'Let me show you how CIOs use M for digital operations continuity. You\'ll see how IT triggers detect system risks before help desk overload. The same ERP disruption that would generate 340 tickets per hour gets resolved through automated recovery in 12 minutes. Traditional CIOs discover issues 4-8 hours after users start complaining. I\'ll demonstrate digital operations recovery.',
    detection: 'The alert banner shows "Business Critical System Risk" - supplier disruption affected ERP connectivity for 1,200 users across finance, operations, and HR. Notice the IT metrics: affected users, system criticality, compliance status. Traditional IT learns about this through help desk ticket queues hours after frustration peaks. This trigger enables proactive recovery before ticket avalanche. Click to see the IT operations dashboard.',
    analysis: 'The Crisis Response Center displays complete digital service intelligence. See the 1,200 affected users across 8 departments, ERP criticality for payroll and procurement, SOX compliance risk, projected 340 tickets/hour without response. The playbook "IT-001 Digital Operations Recovery" shows backup systems ready. This dashboard gives you IT intelligence in 60 seconds vs 6-hour incident coordination. Notice the compliance audit trail protection.',
    decision: 'Activate the Digital Operations Recovery playbook. Watch how automated recovery executes: backup ERP activates from hot standby, user communication triggers, service desk receives handling scripts, vendor SLA enforcement begins, compliance documentation auto-generates. Traditional IT requires 8-hour incident commander calls and team huddles. M coordinates recovery with zero phone tag.',
    activation: 'The task tracker shows IT orchestration. Backup systems are activating automatically, user portal is displaying service status, service desk is receiving call scripts and workarounds, vendor management is sending SLA notifications, compliance is getting audit documentation. All IT tasks executing in parallel. This coordinated response prevents help desk chaos and compliance violations.',
    execution: 'Countdown timer shows 9 minutes. Tasks completing across IT operations: systems failing over to backup, users receiving proactive updates, service desk handling calls confidently, compliance automatically documented. Traditional IT response causes user frustration and ticket avalanches. M maintains productivity through seamless failover. See the 99.5% SLA maintained and zero compliance violations - that\'s IT excellence.',
    results: '12-minute digital operations recovery complete. The ROI Dashboard shows 99.6% service availability maintained (vs 92% industry average), 87% user satisfaction from proactive communication, 68% ticket reduction, $760K saved in productivity losses, zero compliance violations. Your Executive Preparedness Score increases for IT leadership. This is how modern CIOs protect digital operations - automated recovery through coordinated playbooks.'
  },
  cdo: {
    intro: 'Let me show you how CDOs use M for data continuity and governance. You\'ll see how data triggers detect pipeline risks before executives notice stale dashboards. The same data disruption that would cause 24-hour analysis gaps gets resolved through automated failover in 12 minutes. Traditional CDOs discover data issues 18 hours after metrics stop updating. I\'ll demonstrate data operations recovery.',
    detection: 'The alert banner shows "Critical Data Pipeline Risk" - supplier disruption affected your data integration platform impacting supply chain analytics, financial reporting, and operational dashboards. Notice the data metrics: affected pipelines, downstream impact, quality degradation. Traditional data teams discover this when executives complain about stale dashboards. This trigger enables proactive data continuity before quality suffers. Click to see the data operations dashboard.',
    analysis: 'The Crisis Response Center displays complete data ecosystem intelligence. See the affected pipelines: 34 supply chain sources, 12 financial sources, 28 operational KPIs. Downstream impact shows 127 dashboards, 43 reports, 18 ML models at risk. The playbook "DATA-001 Data Continuity & Governance" shows alternative sources ready. This dashboard gives you data intelligence in 75 seconds vs 16-hour dependency analysis. Notice the governance certification protection.',
    decision: 'Activate the Data Continuity & Governance playbook. Watch how automated data failover executes: alternative sources activate, quality validation runs, pipeline orchestration reroutes 74 data flows, governance system documents lineage, ML models retrain. Traditional data response requires 12-hour emergency meetings coordinating manual workarounds. M maintains data quality through automated orchestration.',
    activation: 'The task tracker shows data operations orchestration. Alternative data sources are connecting from backup providers, quality validation is running automated checks, pipeline orchestration is rerouting flows, downstream analytics are receiving freshness notifications, governance is documenting certifications. All data tasks executing in parallel. This automated response maintains executive decision-making capability.',
    execution: 'Countdown timer shows 9 minutes. Tasks completing across data operations: alternative sources flowing data, quality scores validating at 98.7%, dashboards updating normally, executives seeing fresh insights, governance maintaining certification. Traditional data response causes executive blind spots and compliance risks. M maintains continuous data flow. See the 98.7% quality maintained and zero governance violations - that\'s data excellence.',
    results: '12-minute data continuity complete. The ROI Dashboard shows 98.7% quality maintained (vs 79% industry average during disruptions), zero executive decision-making delays, $1.2M in preserved analytics value, $640K saved in manual workaround efforts, complete governance audit trail. Your Executive Preparedness Score increases for data leadership. This is how modern CDOs protect data operations - automated failover maintaining certified quality through coordinated playbooks.'
  },
  ciso: {
    intro: 'Let me show you how CISOs use M for security incident response. You\'ll see how threat triggers detect vendor security risks before breach escalation. The same security incident that would take 16 hours to contain gets isolated through zero-trust protocols in 12 minutes. Traditional CISOs discover vendor breaches 12 hours after notification. I\'ll demonstrate vendor security incident response.',
    detection: 'The alert banner shows "Vendor Security Incident Risk" - supplier faced a security incident with 3 admin accounts, 12 API integrations, and access to manufacturing data potentially compromised. Notice the security metrics: affected assets, attack surface, regulatory risk. Traditional security learns about vendor breaches hours after initial compromise. This trigger enables immediate containment before lateral movement. Click to see the security operations dashboard.',
    analysis: 'The Crisis Response Center displays complete threat intelligence. See the affected assets: 12 API integrations, 3 vendor admin accounts with elevated privileges, VPN access to production network. Attack surface shows read access to inventory systems and API keys to supply chain platform. The playbook "SEC-001 Vendor Security Incident" shows zero-trust protocols ready. This dashboard gives you security intelligence in 90 seconds vs 10-hour threat analysis. Notice the 72-hour breach notification countdown.',
    decision: 'Activate the Vendor Security Incident playbook. Watch how zero-trust containment executes: vendor access revoked immediately, systems isolated through network microsegments, security posture assessed, incident response activated, forensics preserved, stakeholder communication triggered. Traditional security requires 8-hour SOC war rooms before containment begins. M isolates threats in 12 minutes preventing lateral movement.',
    activation: 'The task tracker shows security orchestration. Vendor access review is running automated privilege audit, access revocation is executing zero-trust protocols disabling 12 API keys and VPN, security posture assessment is scanning for IoCs, system isolation is creating microsegments, incident response team is receiving runbooks, forensics is preserving evidence. All security tasks executing in parallel. This coordinated response prevents breach escalation.',
    execution: 'Countdown timer shows 9 minutes. Tasks completing across security operations: 100% vendor access revoked, affected systems isolated, forensics collecting evidence, incident response coordinating teams, legal preparing disclosure. Traditional security response allows containment delays and expanded exposure. M achieves immediate isolation and evidence preservation. See 100% access revoked and zero lateral movement - that\'s threat containment.',
    results: '12-minute incident containment complete. The ROI Dashboard shows 100% vendor access revoked in 12 minutes (vs 18-hour industry average), zero lateral movement, no data exfiltration, breach notification requirements met with 71 hours to spare, $4.2M saved in breach remediation costs. Your Executive Preparedness Score increases for security excellence. This is how modern CISOs protect enterprise assets - immediate zero-trust isolation through coordinated incident response playbooks.'
  },
  cfo: {
    intro: 'Let me show you how CFOs use M for financial risk mitigation. You\'ll see how financial triggers detect exposure before quarterly reviews. The same supplier disruption that would cause weeks of impact analysis gets mitigated through coordinated financial response in 12 minutes. Traditional CFOs discover exposure through auditor findings weeks after it begins. I\'ll demonstrate supplier financial risk management.',
    detection: 'The alert banner shows "Supplier Financial Exposure Alert" - supplier disruption created $12M quarterly revenue risk with $7.2M committed orders and $4.8M production capacity exposure. Notice the financial metrics: revenue at risk, cash flow impact, balance sheet exposure. Traditional finance discovers this weeks later during quarterly reviews. This trigger enables immediate mitigation before shareholder value erodes. Click to see the financial dashboard.',
    analysis: 'The Crisis Response Center displays complete financial impact intelligence. See the revenue exposure: $12M quarterly revenue at risk, $7.2M committed purchase orders, $4.8M production capacity risk. Balance sheet shows $5.3M accounts payable to failing supplier. The playbook "FIN-001 Supplier Financial Risk" shows mitigation strategies ready. This dashboard gives you financial intelligence in 60 seconds vs 48-hour scenario modeling. Notice the EPS impact projection and credit facility utilization.',
    decision: 'Financial strategy decision: Execute Supplier Financial Risk Playbook FIN-001. Traditional CFO response: Schedule treasury meetings, brief audit committee, coordinate with operations - 2-3 days before mitigation actions begin. M execution: One-click financial coordination. Alternative payment arrangements activate, cash flow models update, investor communication prepares, hedging strategies trigger, board notifications send. Financial mitigation in 12 minutes vs 72-hour traditional coordination.',
    activation: 'Playbook executing 8:03 AM: Alternative payment arrangement protocols contacting 8 backup suppliers with pricing and terms. Cash flow impact modeling running scenarios across best/expected/worst cases. Investor communication protocols preparing earnings call talking points and analyst FAQ. Hedging strategy activation reviewing commodity price protections and currency exposures. Board notification package generating financial impact summary with mitigation actions. Treasury coordinating with banking partners on credit facility optimization. Financial orchestration - no manual spreadsheets, no coordination delays.',
    execution: 'Financial orchestration: 22 financial tasks across treasury, FP&A, investor relations, audit. Alternative suppliers negotiating payment terms ($7.2M order protection), cash flow models updated (liquidity maintained at 2.8x), investor messaging prepared (proactive transparency), board briefed (full confidence in mitigation), hedging activated (commodity exposure covered). Traditional approach: Scattered analysis, delayed action, market uncertainty. M approach: Coordinated mitigation, maintained confidence, protected value. Status: $12M revenue protected, liquidity secure, shareholder communication ready.',
    results: 'Financial excellence delivered: 12-minute exposure mitigation vs 72-hour traditional financial coordination. Revenue protection: $12M quarterly revenue secured through alternative supplier arrangements. Cash flow: Liquidity maintained at 2.8x (credit facility utilization stable at 73%). Shareholder value: EPS impact limited to $0.02 vs $0.15 unmanaged scenario - $195M market cap protection. Board confidence: Proactive mitigation prevented emergency sessions. Cost avoidance: $2.7M in rush costs and penalty fees. Your Executive Preparedness Score™ +8 points. Top 2% of CFOs for financial risk management. Quarterly value: $7.9M in protected financial performance.'
  }
};

// Stream lined hybrid demo - Single cohesive adaptive narrative
// ALL 8 personas (CEO, COO, CHRO, CTO, CIO, CDO, CISO, CFO) experience the same 7-phase journey
// Narration dynamically injected based on selected persona for personalized experience

export const hybridDemoScenarios: DemoScene[] = [
  // Phase 1: Executive Context & Platform Introduction (ADAPTIVE BY PERSONA)
  {
    id: 'executive-intro',
    title: 'M: Your Strategic Command Center',
    subtitle: '12 Minutes vs 72 Hours - Executive Decision Velocity',
    description: 'Introduction to Strategic Execution Operating System',
    type: 'executive',
    phase: 'detection',
    route: '/hybrid-demo',
    duration: 14000,
    narration: '', // Dynamically filled from personaNarrations[persona].intro
    targetElements: ['preparedness-score-widget', 'nav-item-dashboard']
  },

  // Phase 2: Trigger Detection & Alert (ADAPTIVE BY PERSONA)
  {
    id: 'trigger-alert',
    title: 'Executive Trigger Activated',
    subtitle: 'AI-powered early warning system in action',
    description: 'Real-time trigger detection shows 5-day head start over competitors',
    type: 'navigation',
    phase: 'detection',
    route: '/hybrid-demo',
    duration: 18000,
    narration: '', // Dynamically filled from personaNarrations[persona].detection
    targetElements: ['crisis-response-center', 'crisis-active-counter', 'crisis-card-supply-chain'],
    actions: [
      { type: 'wait', delay: 3000 },
      { type: 'hover', target: 'crisis-card-supply-chain', delay: 6000 }
    ]
  },

  // Phase 3: Situation Analysis & Intelligence (ADAPTIVE BY PERSONA)
  {
    id: 'situation-analysis',
    title: 'Comprehensive Impact Analysis',
    subtitle: 'Real-time intelligence dashboard',
    description: 'Complete situational awareness across all impacted areas',
    type: 'interaction',
    phase: 'planning',
    route: '/hybrid-demo',
    duration: 16000,
    narration: '', // Dynamically filled from personaNarrations[persona].analysis
    targetElements: ['crisis-response-center', 'crisis-active-counter', 'crisis-card-supply-chain'],
    actions: [
      { type: 'wait', delay: 4000 },
      { type: 'hover', target: 'crisis-card-supply-chain', delay: 5000 }
    ]
  },

  // Phase 4: Decision Point - Playbook Activation (ADAPTIVE BY PERSONA)
  {
    id: 'decision-activation',
    title: 'Playbook Activation Decision',
    subtitle: 'One-click coordinated response',
    description: 'Traditional 18-hour coordination compressed to 12 minutes',
    type: 'interaction',
    phase: 'planning',
    route: '/hybrid-demo',
    duration: 16000,
    narration: '', // Dynamically filled from personaNarrations[persona].decision
    targetElements: ['crisis-response-center', 'button-activate-crisis', 'crisis-card-supply-chain'],
    actions: [
      { type: 'wait', delay: 3000 },
      { type: 'hover', target: 'button-activate-crisis', delay: 5000 }
    ]
  },

  // Phase 5: Playbook Execution Launch (ADAPTIVE BY PERSONA)
  {
    id: 'playbook-activation',
    title: 'Coordinated Response Execution',
    subtitle: 'Real-time stakeholder mobilization',
    description: 'Watch NFL-style playbook execution across all departments',
    type: 'interaction',
    phase: 'response',
    route: '/hybrid-demo',
    duration: 18000,
    narration: '', // Dynamically filled from personaNarrations[persona].activation
    targetElements: ['crisis-response-center', 'crisis-active-counter', 'crisis-templates-section'],
    actions: [
      { type: 'wait', delay: 4000 },
      { type: 'scroll', target: 'crisis-templates-section', delay: 6000 }
    ]
  },

  // Phase 6: Real-Time Orchestration (ADAPTIVE BY PERSONA)
  {
    id: 'execution-tracking',
    title: 'Live Execution Monitoring',
    subtitle: 'Real-time task completion and coordination',
    description: 'Complete visibility into parallel execution across organization',
    type: 'interaction',
    phase: 'execution',
    route: '/hybrid-demo',
    duration: 18000,
    narration: '', // Dynamically filled from personaNarrations[persona].execution
    targetElements: ['crisis-response-center', 'crisis-active-counter', 'crisis-card-supply-chain'],
    actions: [
      { type: 'wait', delay: 5000 },
      { type: 'hover', target: 'crisis-card-supply-chain', delay: 6000 }
    ]
  },

  // Phase 7: Results & ROI Measurement (ADAPTIVE BY PERSONA)
  {
    id: 'results-roi',
    title: 'Crisis Resolution & Impact Measurement',
    subtitle: '12 minutes vs 72 hours - Quantified value delivery',
    description: 'Complete ROI analysis and competitive benchmarking',
    type: 'executive',
    phase: 'measurement',
    route: '/hybrid-demo',
    duration: 20000,
    narration: '', // Dynamically filled from personaNarrations[persona].results
    targetElements: ['preparedness-score-widget', 'nav-item-dashboard'],
    actions: [
      { type: 'wait', delay: 5000 },
      { type: 'hover', target: 'preparedness-score-widget', delay: 7000 }
    ]
  }
];

interface DemoControllerProviderProps {
  children: React.ReactNode;
}

// Helper function to inject persona-specific narration into scenes
function getSceneWithPersonaNarration(scene: DemoScene, persona: string): DemoScene {
  const personaKey = persona as keyof typeof personaNarrations;
  
  // If persona doesn't exist in our narrations, default to 'ceo'
  const narrationsForPersona = personaNarrations[personaKey] || personaNarrations.ceo;
  
  // Map scene IDs to narration keys
  const narrationMap: Record<string, keyof typeof narrationsForPersona> = {
    'executive-intro': 'intro',
    'trigger-alert': 'detection',
    'situation-analysis': 'analysis',
    'decision-activation': 'decision',
    'playbook-activation': 'activation',
    'execution-tracking': 'execution',
    'results-roi': 'results'
  };
  
  // Get the appropriate narration key for this scene
  const narrationKey = narrationMap[scene.id];
  
  // If this scene has persona-adaptive narration, inject it
  if (narrationKey && scene.narration === '') {
    return {
      ...scene,
      narration: narrationsForPersona[narrationKey],
      persona: personaKey
    };
  }
  
  return scene;
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
    selectedPersona: 'ceo', // Default to CEO
    selectedIndustry: 'manufacturing',
    decisionPath: [],
    waitingForDecision: false,
    currentExecutiveStep: 0
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get current scene data with dynamically injected persona narration
  const currentSceneData = state.isActive && hybridDemoScenarios[state.currentScene]
    ? getSceneWithPersonaNarration(hybridDemoScenarios[state.currentScene], state.selectedPersona || 'ceo')
    : null;
  
  // Get all scenes with persona narration injected
  const allScenes = hybridDemoScenarios.map(scene => 
    getSceneWithPersonaNarration(scene, state.selectedPersona || 'ceo')
  );

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

    // Don't auto-advance if this is a decision point - wait for user interaction
    if (currentScene.isDecisionPoint) {
      setState(prev => ({ ...prev, waitingForDecision: true }));
      return;
    }

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
    setState(prev => ({
      ...prev,
      isActive: true,
      isPaused: false,
      currentScene: 0,
      totalScenes: hybridDemoScenarios.length,
      progress: 0,
      autoAdvance: true,
      waitingForDecision: false
      // Keep selectedPersona and selectedIndustry from previous state
    }));
    
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
      if (prev.currentScene >= prev.totalScenes - 1) {
        return { ...prev, isActive: false, progress: 100 };
      }
      
      clearAdvanceTimeout();
      const nextSceneIndex = prev.currentScene + 1;
      const nextScene = hybridDemoScenarios[nextSceneIndex];
      
      if (nextScene.route) {
        setLocation(nextScene.route);
      }
      
      return {
        ...prev,
        currentScene: nextSceneIndex,
        progress: ((nextSceneIndex + 1) / prev.totalScenes) * 100,
        isPaused: false
      };
    });
  }, [setLocation, clearAdvanceTimeout]);

  const prevScene = useCallback(() => {
    setState(prev => {
      if (prev.currentScene <= 0) return prev;
      
      clearAdvanceTimeout();
      const prevSceneIndex = prev.currentScene - 1;
      const prevScene = hybridDemoScenarios[prevSceneIndex];
      
      if (prevScene.route) {
        setLocation(prevScene.route);
      }
      
      return {
        ...prev,
        currentScene: prevSceneIndex,
        progress: ((prevSceneIndex + 1) / prev.totalScenes) * 100,
        isPaused: false
      };
    });
  }, [setLocation, clearAdvanceTimeout]);

  const jumpToScene = useCallback((sceneIndex: number) => {
    if (sceneIndex < 0 || sceneIndex >= hybridDemoScenarios.length) return;
    
    clearAdvanceTimeout();
    const targetScene = hybridDemoScenarios[sceneIndex];
    
    if (targetScene.route) {
      setLocation(targetScene.route);
    }
    
    setState(prev => ({
      ...prev,
      currentScene: sceneIndex,
      progress: ((sceneIndex + 1) / prev.totalScenes) * 100,
      isPaused: false
    }));
  }, [setLocation, clearAdvanceTimeout]);

  const togglePresentationMode = useCallback(() => {
    setState(prev => ({
      ...prev,
      presentationMode: !prev.presentationMode
    }));
  }, []);

  const setPersona = useCallback((persona: DemoState['selectedPersona']) => {
    setState(prev => ({ ...prev, selectedPersona: persona }));
  }, []);

  const setIndustry = useCallback((industry: DemoState['selectedIndustry']) => {
    setState(prev => ({ ...prev, selectedIndustry: industry }));
  }, []);

  const setExecutiveStep = useCallback((step: number) => {
    setState(prev => ({ ...prev, currentExecutiveStep: step }));
  }, []);

  const makeDecision = useCallback((optionId: string) => {
    const currentScene = hybridDemoScenarios[state.currentScene];
    if (!currentScene?.isDecisionPoint || !currentScene.decisionOptions) return;

    const selectedOption = currentScene.decisionOptions.find(opt => opt.id === optionId);
    if (!selectedOption) return;

    // If the decision sets a persona, update it
    if (selectedOption.persona) {
      setPersona(selectedOption.persona);
    }

    // Find the next scene by ID
    const nextSceneIndex = hybridDemoScenarios.findIndex(scene => scene.id === selectedOption.nextSceneId);
    
    if (nextSceneIndex !== -1) {
      const nextScene = hybridDemoScenarios[nextSceneIndex];
      if (nextScene.route) {
        setLocation(nextScene.route);
      }
      
      setState(prev => ({
        ...prev,
        currentScene: nextSceneIndex,
        progress: ((nextSceneIndex + 1) / prev.totalScenes) * 100,
        decisionPath: [...prev.decisionPath, optionId],
        waitingForDecision: false
      }));
    }
  }, [state.currentScene, setLocation, setPersona]);

  // Auto-advance effect
  useEffect(() => {
    if (state.isActive && !state.isPaused && !state.waitingForDecision) {
      autoAdvanceScene();
    }
    
    return () => clearAdvanceTimeout();
  }, [state.isActive, state.isPaused, state.currentScene, state.waitingForDecision, autoAdvanceScene, clearAdvanceTimeout]);

  // Navigate to scene route on scene change
  useEffect(() => {
    if (state.isActive && currentSceneData) {
      navigateToScene(currentSceneData);
    }
  }, [state.currentScene, state.isActive, currentSceneData, navigateToScene]);

  // AUTO-CLEANUP: Stop demo when navigating away from demo pages
  useEffect(() => {
    const isDemoRoute = location === '/executive-demo' || location === '/hybrid-demo';
    
    // If we're on a non-demo page and the demo is active, stop it
    if (!isDemoRoute && state.isActive) {
      stopDemo();
    }
  }, [location, state.isActive, stopDemo]);

  const value: DemoControllerContextType = {
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
    setExecutiveStep,
    currentSceneData,
    allScenes
  };

  return (
    <DemoControllerContext.Provider value={value}>
      {children}
    </DemoControllerContext.Provider>
  );
}
