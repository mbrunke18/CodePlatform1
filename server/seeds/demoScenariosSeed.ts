/**
 * Demo Scenarios Seed - 5 comprehensive scenarios for investor/customer demos
 * Each scenario has full 4-phase configuration with realistic data
 * 
 * This seed creates demo data for showcasing M's capabilities:
 * - Strategic scenarios with full execution plans
 * - Playbook 4-phase items (PREPARE, MONITOR, EXECUTE, LEARN)
 */

import { db } from '../db';
import {
  strategicScenarios,
  scenarioExecutionPlans,
  executionPlanPhases,
  executionPlanTasks,
  playbookLibrary,
  playbookPrepareItems,
  playbookMonitorItems,
  playbookLearnItems,
  organizations,
  users,
} from '@shared/schema';
import { eq, and } from 'drizzle-orm';

interface DemoScenario {
  name: string;
  description: string;
  trigger: string;
  type: string;
  playbook: {
    name: string;
    prepareItems: Array<{
      itemType: string;
      title: string;
      description: string;
      status: 'not_started' | 'in_progress' | 'completed';
      priority: 'high' | 'medium' | 'low';
    }>;
    monitorItems: Array<{
      signalType: string;
      signalName: string;
      signalDescription: string;
      dataSource: string;
      triggerType: string;
      triggerConditions: object;
      isActive: boolean;
    }>;
    learnItems: Array<{
      learnType: 'debrief_meeting' | 'after_action_review' | 'stakeholder_survey' | 'performance_metrics' | 'playbook_update' | 'training_update' | 'process_improvement' | 'knowledge_capture';
      title: string;
      description: string;
      timing: string;
    }>;
  };
  executionPhases: Array<{
    phase: 'immediate' | 'secondary' | 'follow_up';
    name: string;
    description: string;
    startMinute: number;
    endMinute: number;
    tasks: Array<{
      title: string;
      description: string;
      roleLabel: string;
      priority: 'critical' | 'high' | 'medium' | 'low';
      estimatedMinutes: number;
    }>;
  }>;
}

const DEMO_SCENARIOS: DemoScenario[] = [
  {
    name: "DEMO: Competitor Breakthrough Innovation Response",
    description: "Major competitor announces AI-powered product that threatens core market position. Requires rapid assessment and coordinated multi-department response.",
    trigger: "TechCrunch reports competitor's AI product launch achieving 10x performance improvement",
    type: "market",
    playbook: {
      name: "Competitor Product Launch (Breakthrough Innovation)",
      prepareItems: [
        { itemType: "document_template", title: "Competitive Analysis Framework", description: "Pre-built template for rapid competitor capability assessment", status: "completed", priority: "high" },
        { itemType: "document_template", title: "Technology Gap Assessment", description: "Framework for evaluating technology differences and timeline to parity", status: "completed", priority: "high" },
        { itemType: "stakeholder_assignment", title: "Crisis Response Team Roster", description: "Pre-identified executives and SMEs for rapid mobilization", status: "completed", priority: "high" },
        { itemType: "communication_template", title: "Customer Reassurance Script", description: "Pre-approved messaging for account teams to address customer concerns", status: "completed", priority: "high" },
        { itemType: "communication_template", title: "Media Statement Template", description: "Pre-approved press response acknowledging competitive landscape", status: "completed", priority: "medium" },
        { itemType: "budget_approval", title: "Emergency R&D Acceleration Fund", description: "$2M pre-approved for rapid development initiatives", status: "completed", priority: "high" },
        { itemType: "budget_approval", title: "Customer Retention Budget", description: "$500K pre-approved for retention incentives", status: "completed", priority: "medium" },
        { itemType: "checklist_item", title: "Response Severity Matrix", description: "Decision framework for selecting appropriate response level", status: "completed", priority: "high" },
        { itemType: "vendor_contract", title: "Analyst Briefing Agreement", description: "Pre-negotiated retainer with industry analyst firm", status: "completed", priority: "medium" },
        { itemType: "vendor_contract", title: "PR Agency Rapid Response", description: "24-hour activation clause in PR contract", status: "completed", priority: "medium" },
      ],
      monitorItems: [
        { signalType: "competitive", signalName: "Product Launch Announcements", signalDescription: "Monitor tech news for competitor product announcements", dataSource: "TechCrunch, VentureBeat, Competitor Press Releases", triggerType: "event", triggerConditions: { threshold: "Any major product launch" }, isActive: true },
        { signalType: "reputation", signalName: "Customer Sentiment Shift", signalDescription: "Track mentions comparing products in social media", dataSource: "Twitter/X, LinkedIn, Reddit", triggerType: "threshold", triggerConditions: { mentions: 500, sentiment: "negative" }, isActive: true },
        { signalType: "market", signalName: "Deal Loss Pattern", signalDescription: "Monitor CRM for competitive displacement", dataSource: "Salesforce CRM", triggerType: "threshold", triggerConditions: { losses: 3, period: "2 weeks" }, isActive: true },
        { signalType: "market", signalName: "Analyst Repositioning", signalDescription: "Track analyst reports for competitive positioning changes", dataSource: "Analyst Portal", triggerType: "event", triggerConditions: { event: "quadrant movement" }, isActive: true },
      ],
      learnItems: [
        { learnType: "after_action_review", title: "Response Effectiveness Assessment", description: "Evaluate time-to-response and quality of execution", timing: "within_24_hours" },
        { learnType: "stakeholder_survey", title: "Stakeholder Feedback Survey", description: "Gather feedback from all involved executives", timing: "within_48_hours" },
        { learnType: "playbook_update", title: "Communication Template Updates", description: "Refine messaging based on customer/analyst feedback", timing: "within_1_week" },
        { learnType: "process_improvement", title: "Competitive Intelligence Enhancement", description: "Identify gaps in monitoring coverage", timing: "within_1_week" },
      ],
    },
    executionPhases: [
      {
        phase: "immediate",
        name: "Immediate Assessment",
        description: "First 2 minutes: Validate threat, assemble core team, initial analysis",
        startMinute: 0,
        endMinute: 2,
        tasks: [
          { title: "AI Threat Validation", roleLabel: "CTO", description: "Analyze competitor's technical claims vs. marketing", priority: "critical", estimatedMinutes: 1 },
          { title: "Customer Impact Assessment", roleLabel: "VP Sales", description: "Review pipeline deals potentially affected", priority: "critical", estimatedMinutes: 1 },
          { title: "War Room Assembly", roleLabel: "Chief of Staff", description: "Notify and assemble core response team", priority: "critical", estimatedMinutes: 1 },
        ],
      },
      {
        phase: "secondary",
        name: "Strategy Formation",
        description: "Minutes 2-5: Define response strategy and approve resources",
        startMinute: 2,
        endMinute: 5,
        tasks: [
          { title: "Response Option Development", roleLabel: "Strategy Lead", description: "Present 3 response options with cost/benefit", priority: "critical", estimatedMinutes: 2 },
          { title: "CEO Decision Point", roleLabel: "CEO", description: "Select response strategy and approve budget", priority: "critical", estimatedMinutes: 1 },
          { title: "Legal Review", roleLabel: "CLO", description: "Review any IP/competitive intelligence considerations", priority: "high", estimatedMinutes: 2 },
        ],
      },
      {
        phase: "follow_up",
        name: "Execution Launch",
        description: "Minutes 5-12: Deploy communications and initiate response actions",
        startMinute: 5,
        endMinute: 12,
        tasks: [
          { title: "Customer Communication Launch", roleLabel: "CMO", description: "Deploy pre-approved messaging to account teams", priority: "critical", estimatedMinutes: 3 },
          { title: "Media Response Activation", roleLabel: "VP Communications", description: "Issue press statement and brief analysts", priority: "high", estimatedMinutes: 3 },
          { title: "R&D Acceleration Kickoff", roleLabel: "CTO", description: "Initiate prioritized development sprint", priority: "high", estimatedMinutes: 4 },
        ],
      },
    ],
  },
  {
    name: "DEMO: Critical Data Breach Response",
    description: "Security operations detects unauthorized access to customer database. Requires coordinated legal, technical, communications, and regulatory response.",
    trigger: "SOC Alert: Suspicious data exfiltration detected from customer database",
    type: "security",
    playbook: {
      name: "Critical Data Breach",
      prepareItems: [
        { itemType: "checklist_item", title: "Breach Response Checklist", description: "Step-by-step technical containment procedures", status: "completed", priority: "high" },
        { itemType: "vendor_contract", title: "Forensics Partner Contact", description: "Pre-contracted digital forensics firm on 4-hour SLA", status: "completed", priority: "high" },
        { itemType: "document_template", title: "State Notification Matrix", description: "50-state breach notification requirements and timelines", status: "completed", priority: "high" },
        { itemType: "document_template", title: "GDPR Notification Template", description: "72-hour DPA notification template for EU customers", status: "completed", priority: "high" },
        { itemType: "communication_template", title: "Customer Notification Template", description: "Pre-approved breach notification letter", status: "completed", priority: "high" },
        { itemType: "communication_template", title: "Employee FAQ Document", description: "Internal talking points for customer-facing staff", status: "completed", priority: "medium" },
        { itemType: "budget_approval", title: "Identity Protection Fund", description: "$1M pre-approved for customer credit monitoring", status: "completed", priority: "high" },
        { itemType: "vendor_contract", title: "PR Crisis Firm Retainer", description: "Specialized breach communications firm on retainer", status: "completed", priority: "high" },
        { itemType: "document_template", title: "Cyber Insurance Policy", description: "Active policy with known claim procedures", status: "completed", priority: "high" },
      ],
      monitorItems: [
        { signalType: "security", signalName: "SOC Anomaly Detection", signalDescription: "Monitor for unusual data access patterns", dataSource: "SIEM Platform", triggerType: "threshold", triggerConditions: { priority: "P1/P2" }, isActive: true },
        { signalType: "security", signalName: "Dark Web Monitoring", signalDescription: "Monitor dark web for company data appearance", dataSource: "Recorded Future", triggerType: "event", triggerConditions: { event: "positive match" }, isActive: true },
        { signalType: "operational", signalName: "Fraud Report Spike", signalDescription: "Track customer fraud reports", dataSource: "Support Tickets", triggerType: "threshold", triggerConditions: { reports: 10, period: "1 hour" }, isActive: true },
      ],
      learnItems: [
        { learnType: "after_action_review", title: "Technical Post-Mortem", description: "Full analysis of attack vector and response", timing: "within_1_week" },
        { learnType: "process_improvement", title: "Security Control Gaps", description: "Identify and remediate control weaknesses", timing: "within_30_days" },
        { learnType: "training_update", title: "Breach Simulation Update", description: "Update tabletop exercise with lessons learned", timing: "within_90_days" },
      ],
    },
    executionPhases: [
      {
        phase: "immediate",
        name: "Containment",
        description: "First 2 minutes: Isolate affected systems, preserve evidence",
        startMinute: 0,
        endMinute: 2,
        tasks: [
          { title: "System Isolation", roleLabel: "CISO", description: "Disconnect affected systems from network", priority: "critical", estimatedMinutes: 1 },
          { title: "Evidence Preservation", roleLabel: "Security Team", description: "Create forensic images of affected systems", priority: "critical", estimatedMinutes: 1 },
          { title: "Incident Commander Assignment", roleLabel: "CIO", description: "Designate incident commander and war room", priority: "critical", estimatedMinutes: 1 },
        ],
      },
      {
        phase: "secondary",
        name: "Assessment",
        description: "Minutes 2-5: Determine scope and impact of breach",
        startMinute: 2,
        endMinute: 5,
        tasks: [
          { title: "Data Scope Analysis", roleLabel: "Security Team", description: "Identify what data was accessed/exfiltrated", priority: "critical", estimatedMinutes: 2 },
          { title: "Customer Impact Count", roleLabel: "Data Team", description: "Determine number of affected customers", priority: "critical", estimatedMinutes: 1 },
          { title: "Legal Notification Timeline", roleLabel: "CLO", description: "Determine regulatory notification requirements", priority: "critical", estimatedMinutes: 2 },
        ],
      },
      {
        phase: "follow_up",
        name: "Notification & Remediation",
        description: "Minutes 5-12: Notify regulators, prepare customer communications, begin remediation",
        startMinute: 5,
        endMinute: 12,
        tasks: [
          { title: "Regulator Notification", roleLabel: "CLO", description: "File required regulatory notifications", priority: "critical", estimatedMinutes: 3 },
          { title: "Customer Communication Prep", roleLabel: "CMO", description: "Finalize customer notification content", priority: "critical", estimatedMinutes: 2 },
          { title: "Board Notification", roleLabel: "CEO", description: "Brief board on incident and response", priority: "high", estimatedMinutes: 2 },
        ],
      },
    ],
  },
  {
    name: "DEMO: CEO Sudden Departure Response",
    description: "CEO announces unexpected resignation effective immediately. Requires rapid succession activation, stakeholder management, and market stabilization.",
    trigger: "CEO informs Board Chair of immediate resignation due to personal reasons",
    type: "talent",
    playbook: {
      name: "CEO Sudden Departure",
      prepareItems: [
        { itemType: "document_template", title: "CEO Succession Playbook", description: "Board-approved interim and permanent succession process", status: "completed", priority: "high" },
        { itemType: "stakeholder_assignment", title: "Interim CEO Candidates", description: "Pre-vetted internal candidates for interim role", status: "completed", priority: "high" },
        { itemType: "document_template", title: "Board Emergency Resolution", description: "Pre-drafted resolution for CEO transition", status: "completed", priority: "high" },
        { itemType: "document_template", title: "8-K Filing Template", description: "SEC disclosure template for CEO departure", status: "completed", priority: "high" },
        { itemType: "communication_template", title: "Employee Town Hall Script", description: "Key messages for workforce communication", status: "completed", priority: "high" },
        { itemType: "communication_template", title: "Investor Talking Points", description: "Q&A guide for investor relations team", status: "completed", priority: "high" },
        { itemType: "stakeholder_assignment", title: "Top 20 Customer CEO List", description: "Personal contacts for major customer reassurance", status: "completed", priority: "medium" },
        { itemType: "stakeholder_assignment", title: "Key Partner Contacts", description: "Strategic partner executives to proactively notify", status: "completed", priority: "medium" },
      ],
      monitorItems: [
        { signalType: "talent", signalName: "Executive Departure Signals", signalDescription: "Monitor for signs of executive dissatisfaction or departure intent", dataSource: "HR Systems, Travel Patterns", triggerType: "pattern", triggerConditions: { pattern: "unusual activity" }, isActive: true },
        { signalType: "market", signalName: "Analyst Sentiment", signalDescription: "Track analyst commentary on leadership stability", dataSource: "Analyst Reports", triggerType: "event", triggerConditions: { sentiment: "negative" }, isActive: true },
        { signalType: "reputation", signalName: "Executive Coverage", signalDescription: "Monitor media mentions of leadership team", dataSource: "News Aggregators", triggerType: "event", triggerConditions: { type: "speculation" }, isActive: true },
      ],
      learnItems: [
        { learnType: "performance_metrics", title: "Transition Effectiveness Review", description: "Assess smoothness of leadership transition", timing: "within_30_days" },
        { learnType: "stakeholder_survey", title: "Investor Perception Survey", description: "Gauge investor confidence post-transition", timing: "within_90_days" },
        { learnType: "playbook_update", title: "Playbook Refinement", description: "Update succession playbook with lessons", timing: "within_1_year" },
      ],
    },
    executionPhases: [
      {
        phase: "immediate",
        name: "Board Activation",
        description: "First 2 minutes: Emergency board session, interim CEO designation",
        startMinute: 0,
        endMinute: 2,
        tasks: [
          { title: "Emergency Board Call", roleLabel: "Board Chair", description: "Convene emergency board session", priority: "critical", estimatedMinutes: 1 },
          { title: "Interim CEO Designation", roleLabel: "Board", description: "Appoint interim CEO from succession list", priority: "critical", estimatedMinutes: 1 },
        ],
      },
      {
        phase: "secondary",
        name: "Disclosure Preparation",
        description: "Minutes 2-5: Prepare regulatory filings and communications",
        startMinute: 2,
        endMinute: 5,
        tasks: [
          { title: "8-K Filing Preparation", roleLabel: "CLO", description: "Finalize SEC disclosure filing", priority: "critical", estimatedMinutes: 2 },
          { title: "Press Release Draft", roleLabel: "VP Communications", description: "Draft joint announcement with departing CEO", priority: "critical", estimatedMinutes: 1 },
        ],
      },
      {
        phase: "follow_up",
        name: "Stakeholder Notification",
        description: "Minutes 5-12: Execute coordinated stakeholder communications",
        startMinute: 5,
        endMinute: 12,
        tasks: [
          { title: "SEC Filing Submission", roleLabel: "General Counsel", description: "File 8-K with SEC before announcement", priority: "critical", estimatedMinutes: 2 },
          { title: "Press Release Distribution", roleLabel: "PR Team", description: "Issue press release via wire service", priority: "critical", estimatedMinutes: 2 },
          { title: "Employee Town Hall", roleLabel: "Interim CEO", description: "Address workforce on transition", priority: "critical", estimatedMinutes: 3 },
        ],
      },
    ],
  },
  {
    name: "DEMO: Critical Supply Chain Disruption",
    description: "Primary supplier facility destroyed by natural disaster. Requires immediate alternate sourcing, customer communication, and production replanning.",
    trigger: "Tier 1 supplier reports complete facility loss due to earthquake",
    type: "supply_chain",
    playbook: {
      name: "Critical Supplier Disruption",
      prepareItems: [
        { itemType: "document_template", title: "Critical Supplier Matrix", description: "Risk assessment of all Tier 1-2 suppliers", status: "completed", priority: "high" },
        { itemType: "document_template", title: "Alternative Supplier Directory", description: "Pre-qualified backup suppliers for critical components", status: "completed", priority: "high" },
        { itemType: "checklist_item", title: "Safety Stock Levels", description: "Defined buffer inventory for critical items", status: "completed", priority: "high" },
        { itemType: "vendor_contract", title: "Emergency Sourcing Agreement", description: "Pre-negotiated expedite terms with alternates", status: "completed", priority: "high" },
        { itemType: "communication_template", title: "Customer Delay Notification", description: "Template for proactive customer communication", status: "completed", priority: "high" },
        { itemType: "budget_approval", title: "Emergency Expedite Fund", description: "$5M pre-approved for expedited shipping/sourcing", status: "completed", priority: "high" },
        { itemType: "document_template", title: "Business Interruption Claim", description: "Pre-documented claim procedures and contacts", status: "completed", priority: "medium" },
      ],
      monitorItems: [
        { signalType: "supply_chain", signalName: "Supplier Risk Monitoring", signalDescription: "Track supplier health and regional risks", dataSource: "Resilinc, Everstream", triggerType: "threshold", triggerConditions: { severity: "high" }, isActive: true },
        { signalType: "operational", signalName: "Geographic Risk Alerts", signalDescription: "Monitor weather and disaster risks at supplier locations", dataSource: "NOAA, USGS, AccuWeather", triggerType: "event", triggerConditions: { event: "severe weather" }, isActive: true },
        { signalType: "supply_chain", signalName: "Port/Shipping Delays", signalDescription: "Track global logistics disruptions", dataSource: "Flexport, Project44", triggerType: "threshold", triggerConditions: { delay: "3 days" }, isActive: true },
      ],
      learnItems: [
        { learnType: "performance_metrics", title: "Backup Activation Review", description: "Assess performance of alternate suppliers", timing: "within_1_week" },
        { learnType: "process_improvement", title: "Geographic Concentration Analysis", description: "Review supplier geographic distribution", timing: "within_1_year" },
        { learnType: "playbook_update", title: "Safety Stock Optimization", description: "Adjust buffer levels based on actual disruption data", timing: "within_90_days" },
      ],
    },
    executionPhases: [
      {
        phase: "immediate",
        name: "Impact Assessment",
        description: "First 2 minutes: Assess supply impact and inventory position",
        startMinute: 0,
        endMinute: 2,
        tasks: [
          { title: "Supplier Status Confirmation", roleLabel: "VP Supply Chain", description: "Confirm extent of supplier disruption", priority: "critical", estimatedMinutes: 1 },
          { title: "Inventory Position Review", roleLabel: "Operations", description: "Determine days of supply on hand", priority: "critical", estimatedMinutes: 1 },
        ],
      },
      {
        phase: "secondary",
        name: "Alternate Sourcing",
        description: "Minutes 2-5: Activate backup suppliers, expedite procurement",
        startMinute: 2,
        endMinute: 5,
        tasks: [
          { title: "Backup Supplier Activation", roleLabel: "Procurement", description: "Initiate orders with pre-qualified alternates", priority: "critical", estimatedMinutes: 2 },
          { title: "Expedite Arrangements", roleLabel: "Logistics", description: "Arrange emergency shipping/air freight", priority: "critical", estimatedMinutes: 1 },
        ],
      },
      {
        phase: "follow_up",
        name: "Customer Management",
        description: "Minutes 5-12: Proactive customer communication and order replanning",
        startMinute: 5,
        endMinute: 12,
        tasks: [
          { title: "Customer Impact Assessment", roleLabel: "Sales", description: "Identify orders affected by disruption", priority: "critical", estimatedMinutes: 2 },
          { title: "Customer Notification", roleLabel: "Account Teams", description: "Proactive outreach to affected customers", priority: "critical", estimatedMinutes: 3 },
          { title: "Order Replanning", roleLabel: "Planning", description: "Develop revised delivery schedules", priority: "high", estimatedMinutes: 2 },
        ],
      },
    ],
  },
  {
    name: "DEMO: Regulatory Investigation Response",
    description: "DOJ notifies company of formal antitrust investigation. Requires coordinated legal, communications, and business continuity response.",
    trigger: "DOJ Civil Investigative Demand received alleging anticompetitive practices",
    type: "regulatory",
    playbook: {
      name: "Government Investigation (DOJ Antitrust)",
      prepareItems: [
        { itemType: "vendor_contract", title: "Outside Counsel Roster", description: "Pre-selected antitrust defense counsel", status: "completed", priority: "high" },
        { itemType: "document_template", title: "Document Preservation Protocol", description: "Litigation hold procedures and templates", status: "completed", priority: "high" },
        { itemType: "training_completion", title: "Executive Briefing Materials", description: "Rights and responsibilities in investigation", status: "completed", priority: "high" },
        { itemType: "document_template", title: "8-K Disclosure Template", description: "SEC disclosure for material investigation", status: "completed", priority: "high" },
        { itemType: "communication_template", title: "Employee Guidance Document", description: "Instructions for handling document requests", status: "completed", priority: "high" },
        { itemType: "communication_template", title: "Customer/Partner FAQ", description: "Talking points for stakeholder inquiries", status: "completed", priority: "medium" },
        { itemType: "budget_approval", title: "Legal Defense Reserve", description: "$10M pre-approved for investigation defense", status: "completed", priority: "high" },
        { itemType: "document_template", title: "D&O Policy Notification", description: "Procedures for D&O claim notification", status: "completed", priority: "high" },
      ],
      monitorItems: [
        { signalType: "regulatory", signalName: "Antitrust Enforcement Trends", signalDescription: "Monitor DOJ/FTC enforcement priorities", dataSource: "Legal Databases, DOJ Press Releases", triggerType: "event", triggerConditions: { event: "industry action" }, isActive: true },
        { signalType: "reputation", signalName: "Investigation Coverage", signalDescription: "Track media reporting on investigation", dataSource: "News Aggregators", triggerType: "event", triggerConditions: { event: "any mention" }, isActive: true },
        { signalType: "competitive", signalName: "Competitor Legal Actions", signalDescription: "Monitor competitor-initiated legal actions", dataSource: "Court Filings", triggerType: "event", triggerConditions: { event: "new filing" }, isActive: true },
      ],
      learnItems: [
        { learnType: "after_action_review", title: "Defense Strategy Review", description: "Periodic assessment of legal strategy effectiveness", timing: "within_90_days" },
        { learnType: "training_update", title: "Antitrust Training Update", description: "Enhance antitrust compliance training", timing: "within_1_year" },
        { learnType: "process_improvement", title: "Business Practice Audit", description: "Review and update competitive practices", timing: "within_1_year" },
      ],
    },
    executionPhases: [
      {
        phase: "immediate",
        name: "Legal Mobilization",
        description: "First 2 minutes: Engage counsel, preserve documents, brief executives",
        startMinute: 0,
        endMinute: 2,
        tasks: [
          { title: "Outside Counsel Engagement", roleLabel: "CLO", description: "Engage pre-selected antitrust defense team", priority: "critical", estimatedMinutes: 1 },
          { title: "Litigation Hold Issuance", roleLabel: "Legal", description: "Issue company-wide document preservation notice", priority: "critical", estimatedMinutes: 1 },
        ],
      },
      {
        phase: "secondary",
        name: "Assessment & Strategy",
        description: "Minutes 2-5: Analyze CID scope, develop response strategy",
        startMinute: 2,
        endMinute: 5,
        tasks: [
          { title: "CID Analysis", roleLabel: "Outside Counsel", description: "Analyze scope of investigative demand", priority: "critical", estimatedMinutes: 2 },
          { title: "Board Notification", roleLabel: "CLO", description: "Formally notify board of investigation", priority: "critical", estimatedMinutes: 1 },
        ],
      },
      {
        phase: "follow_up",
        name: "Disclosure & Communication",
        description: "Minutes 5-12: SEC disclosure, stakeholder communication",
        startMinute: 5,
        endMinute: 12,
        tasks: [
          { title: "8-K Filing", roleLabel: "CLO", description: "File SEC disclosure of material investigation", priority: "critical", estimatedMinutes: 3 },
          { title: "Investor Communication", roleLabel: "IR", description: "Prepare investor Q&A and talking points", priority: "high", estimatedMinutes: 2 },
          { title: "Employee Communication", roleLabel: "HR", description: "Distribute guidance to employees", priority: "high", estimatedMinutes: 2 },
        ],
      },
    ],
  },
];

export async function seedDemoScenarios() {
  console.log('🎭 Seeding 5 Demo Scenarios with Full 4-Phase Configurations...');

  const org = await db.query.organizations.findFirst({
    where: eq(organizations.name, 'Innovate Dynamics'),
  });

  if (!org) {
    console.log('⚠️  Default organization not found, skipping demo scenario seed');
    return;
  }

  const systemUser = await db.query.users.findFirst();
  
  if (!systemUser) {
    console.log('⚠️  No users found, skipping demo scenario seed');
    return;
  }

  const existingDemos = await db.query.strategicScenarios.findFirst({
    where: and(
      eq(strategicScenarios.organizationId, org.id),
      eq(strategicScenarios.name, 'DEMO: Competitor Breakthrough Innovation Response')
    ),
  });

  if (existingDemos) {
    console.log('✅ Demo scenarios already seeded');
    return;
  }

  for (const demo of DEMO_SCENARIOS) {
    console.log(`├─ Creating demo: ${demo.name}`);

    const matchingPlaybook = await db.query.playbookLibrary.findFirst({
      where: eq(playbookLibrary.name, demo.playbook.name),
    });

    const [scenario] = await db
      .insert(strategicScenarios)
      .values({
        organizationId: org.id,
        name: demo.name,
        title: demo.name,
        description: demo.description,
        type: demo.type,
        triggerConditions: { trigger: demo.trigger },
        status: 'active',
        readinessState: 'green',
        automationCoverage: '0.85',
        executionCount: 3,
        createdBy: systemUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    const [plan] = await db
      .insert(scenarioExecutionPlans)
      .values({
        scenarioId: scenario.id,
        organizationId: org.id,
        name: `${demo.name} - Execution Plan`,
        description: `Coordinated 12-minute response plan for ${demo.name}`,
        targetExecutionTime: 12,
        isActive: true,
        version: 1,
        createdBy: systemUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    for (let phaseIndex = 0; phaseIndex < demo.executionPhases.length; phaseIndex++) {
      const phaseData = demo.executionPhases[phaseIndex];
      
      const [phase] = await db
        .insert(executionPlanPhases)
        .values({
          executionPlanId: plan.id,
          phase: phaseData.phase,
          name: phaseData.name,
          description: phaseData.description,
          sequence: phaseIndex + 1,
          startMinute: phaseData.startMinute,
          endMinute: phaseData.endMinute,
          createdAt: new Date(),
        })
        .returning();

      for (let taskIndex = 0; taskIndex < phaseData.tasks.length; taskIndex++) {
        const taskData = phaseData.tasks[taskIndex];
        await db.insert(executionPlanTasks).values({
          phaseId: phase.id,
          executionPlanId: plan.id,
          title: taskData.title,
          description: taskData.description,
          requiredRoleLabel: taskData.roleLabel,
          priority: taskData.priority,
          estimatedMinutes: taskData.estimatedMinutes,
          sequence: taskIndex + 1,
          isRequired: true,
          createdAt: new Date(),
        });
      }
    }

    if (matchingPlaybook) {
      for (const item of demo.playbook.prepareItems) {
        await db.insert(playbookPrepareItems).values({
          playbookId: matchingPlaybook.id,
          itemType: item.itemType,
          title: item.title,
          description: item.description,
          status: item.status,
          priority: item.priority,
          isRequired: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      for (const item of demo.playbook.monitorItems) {
        await db.insert(playbookMonitorItems).values({
          playbookId: matchingPlaybook.id,
          signalType: item.signalType,
          signalName: item.signalName,
          signalDescription: item.signalDescription,
          dataSource: item.dataSource,
          triggerType: item.triggerType,
          triggerConditions: item.triggerConditions,
          isActive: item.isActive,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      for (const item of demo.playbook.learnItems) {
        await db.insert(playbookLearnItems).values({
          playbookId: matchingPlaybook.id,
          learnType: item.learnType,
          title: item.title,
          description: item.description,
          timing: item.timing,
          isRequired: true,
        } as any);
      }
    }
  }

  console.log('✅ Demo scenarios seeded successfully');
}
