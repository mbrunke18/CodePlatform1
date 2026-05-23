import { db } from '../db';
import { eq, sql, count } from 'drizzle-orm';
import {
  playbookLibrary,
  playbookTaskSequences,
  intelligenceReports,
  decisionOutcomes,
  warRoomSessions,
  playbookActivations,
  organizations,
  users,
  strategicScenarios,
} from '@shared/schema';

const DOMAIN_TASK_TEMPLATES: Record<string, Array<{
  taskName: string;
  taskDescription: string;
  taskOwner: string;
  timelinePhase: string;
}>> = {
  "AI Governance": [
    { taskName: "Assess AI model risk exposure", taskDescription: "Evaluate current AI model portfolio for risk vectors including bias, drift, and compliance gaps", taskOwner: "CTO", timelinePhase: "first_2_hours" },
    { taskName: "Review AI governance policy documentation", taskDescription: "Audit existing AI governance policies against current regulatory requirements and industry standards", taskOwner: "CISO", timelinePhase: "first_2_hours" },
    { taskName: "Activate AI incident response team", taskDescription: "Convene cross-functional AI incident response team including engineering, legal, and compliance leads", taskOwner: "CTO", timelinePhase: "first_2_hours" },
    { taskName: "Conduct AI model audit trail review", taskDescription: "Examine model training data provenance, decision logs, and deployment history for anomalies", taskOwner: "VP Engineering", timelinePhase: "first_24_hours" },
    { taskName: "Notify regulatory bodies if required", taskDescription: "Determine regulatory notification requirements and prepare disclosure documentation for relevant authorities", taskOwner: "Legal Counsel", timelinePhase: "first_24_hours" },
    { taskName: "Implement AI model containment measures", taskDescription: "Deploy guardrails, rate limits, or temporary model suspension to prevent further impact", taskOwner: "VP Engineering", timelinePhase: "first_24_hours" },
    { taskName: "Prepare stakeholder communication on AI incident", taskDescription: "Draft internal and external communications addressing AI governance incident and remediation steps", taskOwner: "CMO", timelinePhase: "first_week" },
    { taskName: "Update AI governance framework", taskDescription: "Revise AI governance policies, testing protocols, and monitoring procedures based on lessons learned", taskOwner: "CTO", timelinePhase: "first_month" },
    { taskName: "Schedule AI ethics review board meeting", taskDescription: "Convene AI ethics advisory board to review incident root cause and recommend preventive measures", taskOwner: "CEO", timelinePhase: "first_week" },
    { taskName: "Deploy enhanced AI monitoring controls", taskDescription: "Implement real-time AI performance monitoring, bias detection, and automated alerting systems", taskOwner: "CISO", timelinePhase: "first_month" },
  ],
  "Brand & Reputation": [
    { taskName: "Activate crisis communications team", taskDescription: "Assemble crisis communications war room with PR, legal, and executive leadership", taskOwner: "CMO", timelinePhase: "first_2_hours" },
    { taskName: "Monitor social media sentiment in real-time", taskDescription: "Deploy social listening tools across all platforms to track narrative evolution and sentiment trends", taskOwner: "VP Communications", timelinePhase: "first_2_hours" },
    { taskName: "Draft holding statement for media", taskDescription: "Prepare initial media holding statement acknowledging situation and outlining response commitment", taskOwner: "VP Communications", timelinePhase: "first_2_hours" },
    { taskName: "Brief executive leadership on reputation impact", taskDescription: "Provide C-suite with real-time reputation risk assessment, media coverage analysis, and response options", taskOwner: "CMO", timelinePhase: "first_24_hours" },
    { taskName: "Engage external PR crisis firm", taskDescription: "Activate retainer with external crisis PR firm for additional media management support", taskOwner: "CMO", timelinePhase: "first_24_hours" },
    { taskName: "Coordinate customer communication strategy", taskDescription: "Develop targeted messaging for key customer segments addressing concerns and reinforcing trust", taskOwner: "VP Customer Success", timelinePhase: "first_24_hours" },
    { taskName: "Prepare board-ready reputation impact report", taskDescription: "Compile comprehensive report on brand impact metrics, media coverage, and remediation timeline", taskOwner: "CMO", timelinePhase: "first_week" },
    { taskName: "Launch reputation recovery campaign", taskDescription: "Execute multi-channel reputation recovery strategy including thought leadership and community engagement", taskOwner: "VP Marketing", timelinePhase: "first_month" },
    { taskName: "Conduct post-crisis brand sentiment analysis", taskDescription: "Measure brand health indicators post-crisis including NPS, brand awareness, and customer trust scores", taskOwner: "VP Marketing", timelinePhase: "first_month" },
    { taskName: "Update crisis communication playbook", taskDescription: "Incorporate lessons learned into crisis communication protocols and train relevant stakeholders", taskOwner: "CMO", timelinePhase: "first_month" },
  ],
  "Financial Strategy": [
    { taskName: "Assess immediate financial exposure", taskDescription: "Quantify direct and indirect financial impact including revenue at risk, cost implications, and cash flow effects", taskOwner: "CFO", timelinePhase: "first_2_hours" },
    { taskName: "Activate financial contingency reserves", taskDescription: "Evaluate and prepare to deploy emergency financial reserves per pre-approved contingency protocols", taskOwner: "CFO", timelinePhase: "first_2_hours" },
    { taskName: "Brief board finance committee", taskDescription: "Provide finance committee with exposure analysis, mitigation options, and resource requirements", taskOwner: "CFO", timelinePhase: "first_2_hours" },
    { taskName: "Model financial scenario outcomes", taskDescription: "Run Monte Carlo simulations on best/worst/likely case financial outcomes with 90-day projections", taskOwner: "VP Finance", timelinePhase: "first_24_hours" },
    { taskName: "Negotiate with key financial stakeholders", taskDescription: "Engage banking partners, investors, and creditors to manage expectations and secure flexibility", taskOwner: "CFO", timelinePhase: "first_24_hours" },
    { taskName: "Implement cost containment measures", taskDescription: "Activate pre-approved cost reduction levers including hiring freezes, discretionary spending caps", taskOwner: "VP Finance", timelinePhase: "first_24_hours" },
    { taskName: "Prepare investor communication package", taskDescription: "Draft investor-ready materials explaining financial impact, recovery strategy, and long-term outlook", taskOwner: "CFO", timelinePhase: "first_week" },
    { taskName: "Revise financial forecasts and guidance", taskDescription: "Update quarterly and annual financial forecasts incorporating scenario impact and recovery trajectory", taskOwner: "VP Finance", timelinePhase: "first_week" },
    { taskName: "Conduct post-event financial review", taskDescription: "Complete comprehensive financial impact assessment with actual vs projected variance analysis", taskOwner: "CFO", timelinePhase: "first_month" },
    { taskName: "Update financial risk management framework", taskDescription: "Enhance financial risk policies, hedging strategies, and contingency planning based on lessons learned", taskOwner: "VP Finance", timelinePhase: "first_month" },
  ],
  "Market Dynamics": [
    { taskName: "Analyze competitive landscape shift", taskDescription: "Assess how market dynamics change affects competitive positioning and strategic advantages", taskOwner: "VP Strategy", timelinePhase: "first_2_hours" },
    { taskName: "Gather market intelligence from field teams", taskDescription: "Deploy rapid intelligence gathering from sales, customer success, and partner teams for ground-truth data", taskOwner: "VP Sales", timelinePhase: "first_2_hours" },
    { taskName: "Assess customer retention risk", taskDescription: "Identify at-risk customer segments and quantify potential churn impact from market disruption", taskOwner: "VP Customer Success", timelinePhase: "first_2_hours" },
    { taskName: "Convene strategic response committee", taskDescription: "Assemble cross-functional strategic response team to evaluate options and recommend action plan", taskOwner: "CEO", timelinePhase: "first_24_hours" },
    { taskName: "Model market share impact scenarios", taskDescription: "Run competitive simulation models projecting market share changes under different response strategies", taskOwner: "VP Strategy", timelinePhase: "first_24_hours" },
    { taskName: "Deploy customer retention countermeasures", taskDescription: "Launch targeted retention programs for at-risk accounts including pricing, feature, and service enhancements", taskOwner: "VP Sales", timelinePhase: "first_24_hours" },
    { taskName: "Develop competitive response strategy", taskDescription: "Formalize strategic response plan with clear objectives, resource requirements, and success metrics", taskOwner: "CEO", timelinePhase: "first_week" },
    { taskName: "Execute market positioning adjustments", taskDescription: "Implement pricing, messaging, and go-to-market changes to address new competitive dynamics", taskOwner: "CMO", timelinePhase: "first_week" },
    { taskName: "Monitor competitive response effectiveness", taskDescription: "Track market share, win rates, and pipeline metrics to measure response strategy effectiveness", taskOwner: "VP Strategy", timelinePhase: "first_month" },
    { taskName: "Present market dynamics report to board", taskDescription: "Deliver comprehensive board presentation on market changes, strategic response, and outcomes", taskOwner: "CEO", timelinePhase: "first_month" },
  ],
  "Market Opportunities": [
    { taskName: "Validate market opportunity size", taskDescription: "Conduct rapid TAM/SAM/SOM analysis to quantify the market opportunity and addressable revenue", taskOwner: "VP Strategy", timelinePhase: "first_2_hours" },
    { taskName: "Assess organizational readiness", taskDescription: "Evaluate current capabilities, resources, and partnerships needed to capture the opportunity", taskOwner: "COO", timelinePhase: "first_2_hours" },
    { taskName: "Identify quick-win entry points", taskDescription: "Map fastest paths to market entry leveraging existing assets, relationships, and capabilities", taskOwner: "VP Strategy", timelinePhase: "first_2_hours" },
    { taskName: "Build business case for investment", taskDescription: "Prepare ROI analysis, resource requirements, and risk assessment for executive approval", taskOwner: "CFO", timelinePhase: "first_24_hours" },
    { taskName: "Engage key customer prospects", taskDescription: "Initiate conversations with target customers to validate demand and refine value proposition", taskOwner: "VP Sales", timelinePhase: "first_24_hours" },
    { taskName: "Assemble cross-functional opportunity team", taskDescription: "Form dedicated team with product, engineering, sales, and marketing resources to pursue opportunity", taskOwner: "CEO", timelinePhase: "first_24_hours" },
    { taskName: "Develop go-to-market strategy", taskDescription: "Create comprehensive GTM plan including positioning, pricing, channels, and launch timeline", taskOwner: "CMO", timelinePhase: "first_week" },
    { taskName: "Secure partnerships and alliances", taskDescription: "Negotiate strategic partnerships to accelerate market entry and expand capabilities", taskOwner: "VP Business Development", timelinePhase: "first_week" },
    { taskName: "Launch minimum viable offering", taskDescription: "Deploy initial market offering to capture early adopters and generate market learning", taskOwner: "VP Product", timelinePhase: "first_month" },
    { taskName: "Measure and optimize market performance", taskDescription: "Track key performance indicators and iterate on strategy based on market feedback", taskOwner: "VP Strategy", timelinePhase: "first_month" },
  ],
  "Operational Excellence": [
    { taskName: "Assess operational impact scope", taskDescription: "Map affected business processes, systems, and teams to determine full scope of operational disruption", taskOwner: "COO", timelinePhase: "first_2_hours" },
    { taskName: "Activate business continuity protocols", taskDescription: "Initiate pre-defined business continuity plans for affected operations and critical functions", taskOwner: "VP Operations", timelinePhase: "first_2_hours" },
    { taskName: "Establish operational command center", taskDescription: "Set up centralized operational command with real-time dashboards, communication channels, and escalation paths", taskOwner: "COO", timelinePhase: "first_2_hours" },
    { taskName: "Deploy operational workarounds", taskDescription: "Implement temporary operational procedures to maintain critical business functions during disruption", taskOwner: "VP Operations", timelinePhase: "first_24_hours" },
    { taskName: "Coordinate with supply chain partners", taskDescription: "Communicate with key suppliers and logistics partners to manage supply chain continuity", taskOwner: "VP Supply Chain", timelinePhase: "first_24_hours" },
    { taskName: "Quantify operational losses", taskDescription: "Calculate throughput reduction, SLA impacts, and financial costs of operational disruption", taskOwner: "VP Operations", timelinePhase: "first_24_hours" },
    { taskName: "Implement recovery action plan", taskDescription: "Execute phased operational recovery plan with clear milestones and resource allocation", taskOwner: "COO", timelinePhase: "first_week" },
    { taskName: "Conduct root cause analysis", taskDescription: "Perform thorough root cause investigation using 5-Why and fishbone analysis methodologies", taskOwner: "VP Quality", timelinePhase: "first_week" },
    { taskName: "Implement preventive controls", taskDescription: "Deploy systemic improvements, automation, and redundancy to prevent recurrence", taskOwner: "VP Operations", timelinePhase: "first_month" },
    { taskName: "Update operational resilience framework", taskDescription: "Revise BCP/DR plans, operational procedures, and training based on lessons learned", taskOwner: "COO", timelinePhase: "first_month" },
  ],
  "Regulatory & Compliance": [
    { taskName: "Assess regulatory exposure and obligations", taskDescription: "Identify all applicable regulatory requirements, notification deadlines, and compliance obligations", taskOwner: "Legal Counsel", timelinePhase: "first_2_hours" },
    { taskName: "Notify compliance and legal teams", taskDescription: "Alert compliance department, general counsel, and outside regulatory counsel of the situation", taskOwner: "Legal Counsel", timelinePhase: "first_2_hours" },
    { taskName: "Preserve relevant documentation", taskDescription: "Initiate document preservation hold and secure all relevant records, communications, and data", taskOwner: "Legal Counsel", timelinePhase: "first_2_hours" },
    { taskName: "Prepare regulatory notification drafts", taskDescription: "Draft required regulatory notifications and disclosures per applicable regulatory frameworks", taskOwner: "VP Compliance", timelinePhase: "first_24_hours" },
    { taskName: "Engage external regulatory counsel", taskDescription: "Retain specialized external legal counsel for regulatory strategy and representation", taskOwner: "Legal Counsel", timelinePhase: "first_24_hours" },
    { taskName: "Conduct compliance gap assessment", taskDescription: "Audit current compliance posture against requirements to identify gaps and remediation needs", taskOwner: "VP Compliance", timelinePhase: "first_24_hours" },
    { taskName: "Submit regulatory filings", taskDescription: "File required regulatory notifications, reports, and disclosures within mandated timelines", taskOwner: "Legal Counsel", timelinePhase: "first_week" },
    { taskName: "Implement compliance remediation plan", taskDescription: "Execute corrective actions to address identified compliance gaps and regulatory requirements", taskOwner: "VP Compliance", timelinePhase: "first_week" },
    { taskName: "Conduct compliance training refresh", taskDescription: "Deliver updated compliance training to affected employees and stakeholders", taskOwner: "HR Director", timelinePhase: "first_month" },
    { taskName: "Update compliance monitoring systems", taskDescription: "Enhance regulatory monitoring, reporting systems, and early warning capabilities", taskOwner: "VP Compliance", timelinePhase: "first_month" },
  ],
  "Talent & Leadership": [
    { taskName: "Assess talent impact and retention risk", taskDescription: "Evaluate impact on key talent, identify flight risks, and quantify potential knowledge loss", taskOwner: "CHRO", timelinePhase: "first_2_hours" },
    { taskName: "Activate leadership succession protocols", taskDescription: "Review and prepare to execute leadership succession plans for affected executive positions", taskOwner: "CHRO", timelinePhase: "first_2_hours" },
    { taskName: "Communicate with affected employees", taskDescription: "Deliver transparent, empathetic communication to impacted employees with clear next steps", taskOwner: "CHRO", timelinePhase: "first_2_hours" },
    { taskName: "Deploy employee support resources", taskDescription: "Activate EAP, counseling services, and support programs for affected team members", taskOwner: "HR Director", timelinePhase: "first_24_hours" },
    { taskName: "Develop interim leadership arrangements", taskDescription: "Establish interim leadership structure to maintain organizational continuity and team stability", taskOwner: "CEO", timelinePhase: "first_24_hours" },
    { taskName: "Brief management on retention strategy", taskDescription: "Provide people managers with retention talking points, authority for stay incentives, and escalation paths", taskOwner: "CHRO", timelinePhase: "first_24_hours" },
    { taskName: "Launch targeted retention programs", taskDescription: "Deploy retention bonuses, career development opportunities, and recognition programs for critical talent", taskOwner: "CHRO", timelinePhase: "first_week" },
    { taskName: "Initiate executive search if needed", taskDescription: "Engage executive search firms for leadership replacement with urgency premium if needed", taskOwner: "CHRO", timelinePhase: "first_week" },
    { taskName: "Rebuild team culture and engagement", taskDescription: "Execute culture recovery initiatives including team building, town halls, and listening sessions", taskOwner: "HR Director", timelinePhase: "first_month" },
    { taskName: "Measure organizational health post-event", taskDescription: "Deploy pulse surveys, exit interview analysis, and engagement metrics to track recovery", taskOwner: "CHRO", timelinePhase: "first_month" },
  ],
  "Technology & Innovation": [
    { taskName: "Assess technology impact and exposure", taskDescription: "Evaluate affected systems, data exposure, service availability, and cascading dependencies", taskOwner: "CTO", timelinePhase: "first_2_hours" },
    { taskName: "Activate incident response procedures", taskDescription: "Initiate technical incident response including NOC escalation, war room, and status page updates", taskOwner: "VP Engineering", timelinePhase: "first_2_hours" },
    { taskName: "Implement immediate containment measures", taskDescription: "Deploy technical containment including network segmentation, access revocation, and system isolation", taskOwner: "CISO", timelinePhase: "first_2_hours" },
    { taskName: "Conduct technical root cause investigation", taskDescription: "Perform deep technical analysis of incident cause including log analysis, forensics, and timeline reconstruction", taskOwner: "VP Engineering", timelinePhase: "first_24_hours" },
    { taskName: "Deploy temporary technical workarounds", taskDescription: "Implement interim technical solutions to restore service while permanent fix is developed", taskOwner: "VP Engineering", timelinePhase: "first_24_hours" },
    { taskName: "Coordinate with technology vendors", taskDescription: "Engage technology vendors and cloud providers for support, patches, and remediation assistance", taskOwner: "CTO", timelinePhase: "first_24_hours" },
    { taskName: "Implement permanent technical fix", taskDescription: "Deploy tested, validated permanent fix with rollback plan and monitoring enhancements", taskOwner: "VP Engineering", timelinePhase: "first_week" },
    { taskName: "Conduct security and architecture review", taskDescription: "Perform comprehensive security assessment and architecture review to identify systemic vulnerabilities", taskOwner: "CISO", timelinePhase: "first_week" },
    { taskName: "Update disaster recovery procedures", taskDescription: "Revise DR/BC plans, runbooks, and recovery procedures based on incident learnings", taskOwner: "VP Engineering", timelinePhase: "first_month" },
    { taskName: "Enhance monitoring and alerting systems", taskDescription: "Deploy improved observability, automated anomaly detection, and proactive alerting capabilities", taskOwner: "CTO", timelinePhase: "first_month" },
  ],
};

const TIMING_SEQUENCE = [
  "T+0:00", "T+0:30", "T+1:00", "T+2:00", "T+4:00", "T+8:00", "T+12:00", "T+24:00"
];

function getTasksForPlaybook(domainName: string, playbookIndex: number): Array<{
  taskName: string;
  taskDescription: string;
  timing: string;
  timelinePhase: string;
  taskOwner: string;
  dependencies: any[];
  sequence: number;
  isRequired: boolean;
}> {
  const templates = DOMAIN_TASK_TEMPLATES[domainName];
  if (!templates) return [];

  const taskCount = 5 + (playbookIndex % 4);
  const startOffset = (playbookIndex * 2) % templates.length;

  const tasks: any[] = [];
  for (let i = 0; i < taskCount; i++) {
    const templateIdx = (startOffset + i) % templates.length;
    const template = templates[templateIdx];
    const timing = TIMING_SEQUENCE[i] || TIMING_SEQUENCE[TIMING_SEQUENCE.length - 1];
    const deps = i > 0 ? [i] : [];

    tasks.push({
      taskName: template.taskName,
      taskDescription: template.taskDescription,
      timing,
      timelinePhase: template.timelinePhase,
      taskOwner: template.taskOwner,
      dependencies: deps,
      sequence: i + 1,
      isRequired: i < 4,
    });
  }

  return tasks;
}

export async function seedPipelineData() {
  console.log("[Seed] Starting pipeline data seeding...");

  const [orgRow] = await db.select().from(organizations).limit(1);
  if (!orgRow) {
    console.log("[Seed] No organizations found. Skipping pipeline seeding.");
    return;
  }
  const orgId = orgRow.id;
  console.log(`[Seed] Using organization: ${orgRow.name} (${orgId})`);

  const userRows = await db.select().from(users).limit(5);
  if (userRows.length === 0) {
    console.log("[Seed] No users found. Skipping pipeline seeding.");
    return;
  }
  const primaryUserId = userRows[0].id;
  console.log(`[Seed] Using primary user: ${userRows[0].firstName} ${userRows[0].lastName} (${primaryUserId})`);

  const scenarioRows = await db.select().from(strategicScenarios).limit(10);
  console.log(`[Seed] Found ${scenarioRows.length} strategic scenarios`);

  // === 1. PLAYBOOK TASK SEQUENCES ===
  const [taskSeqCount] = await db.select({ cnt: count() }).from(playbookTaskSequences);
  if (Number(taskSeqCount.cnt) > 0) {
    console.log(`[Seed] Playbook task sequences already seeded (${taskSeqCount.cnt} rows). Skipping.`);
  } else {
    console.log("[Seed] Seeding playbook task sequences for 180 playbooks...");

    const playbooks = await db.execute(sql`
      SELECT pl.id, pl.playbook_number, pl.name, pl.strategic_category, pd.name as domain_name
      FROM playbook_library pl
      JOIN playbook_domains pd ON pl.domain_id = pd.id
      ORDER BY pd.name, pl.playbook_number
    `);

    const allTaskRows: any[] = [];
    let playbookIdx = 0;

    for (const pb of playbooks.rows) {
      const domainName = pb.domain_name as string;
      const tasks = getTasksForPlaybook(domainName, playbookIdx);

      for (const task of tasks) {
        allTaskRows.push({
          playbookId: pb.id as string,
          taskName: task.taskName,
          taskDescription: task.taskDescription,
          timing: task.timing,
          timelinePhase: task.timelinePhase,
          taskOwner: task.taskOwner,
          dependencies: task.dependencies,
          sequence: task.sequence,
          isRequired: task.isRequired,
        });
      }
      playbookIdx++;
    }

    const BATCH_SIZE = 100;
    for (let i = 0; i < allTaskRows.length; i += BATCH_SIZE) {
      const batch = allTaskRows.slice(i, i + BATCH_SIZE);
      await db.insert(playbookTaskSequences).values(batch);
      console.log(`[Seed]   Inserted task sequences batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(allTaskRows.length / BATCH_SIZE)} (${batch.length} rows)`);
    }

    console.log(`[Seed] ✓ Inserted ${allTaskRows.length} playbook task sequences across ${playbookIdx} playbooks`);
  }

  // === 2. INTELLIGENCE REPORTS ===
  const [irCount] = await db.select({ cnt: count() }).from(intelligenceReports);
  if (Number(irCount.cnt) > 0) {
    console.log(`[Seed] Intelligence reports already seeded (${irCount.cnt} rows). Skipping.`);
  } else {
    console.log("[Seed] Seeding intelligence reports...");

    await db.insert(intelligenceReports).values([
      {
        organizationId: orgId,
        reportType: "market_analysis",
        title: "Q1 2026 Enterprise SaaS Market Dynamics Report",
        executiveSummary: "The enterprise SaaS market is experiencing a significant shift toward AI-native platforms, with 73% of Fortune 500 companies accelerating AI adoption timelines. Key opportunity areas include strategic execution automation and decision intelligence platforms, where market penetration remains below 15%.",
        findings: [
          { finding: "AI-native platform adoption increased 45% YoY in enterprise segment", impact: "high", confidence: 0.92 },
          { finding: "Decision intelligence market projected to reach $28B by 2028", impact: "high", confidence: 0.88 },
          { finding: "Average enterprise decision latency decreased from 14 days to 8 days with automation", impact: "medium", confidence: 0.85 },
          { finding: "78% of CxOs cite execution speed as top strategic priority for 2026", impact: "high", confidence: 0.91 },
        ],
        recommendations: {
          shortTerm: ["Accelerate AI-native feature development", "Target Fortune 500 early adopters"],
          longTerm: ["Build strategic partnership ecosystem", "Develop industry-specific solution modules"],
        },
        confidence: "0.89",
      },
      {
        organizationId: orgId,
        reportType: "competitive_intelligence",
        title: "Competitive Landscape: Strategic Readiness Platform Category",
        executiveSummary: "Three new entrants have emerged in the strategic readiness platform space, but none combine real-time signal detection with pre-built playbook activation. Our 12-minute execution target remains a unique differentiator. Key competitor Palantir is pivoting toward operational execution but lacks the playbook framework.",
        findings: [
          { finding: "Palantir AIP expanding into operational execution workflows", impact: "high", confidence: 0.87 },
          { finding: "McKinsey launching Lilli-powered execution advisory service", impact: "medium", confidence: 0.82 },
          { finding: "No competitor offers pre-built 180-playbook library with domain expertise", impact: "high", confidence: 0.95 },
          { finding: "Average competitor response coordination time exceeds 4 hours", impact: "high", confidence: 0.90 },
        ],
        recommendations: {
          defensive: ["Strengthen patent portfolio around playbook automation", "Deepen enterprise customer relationships"],
          offensive: ["Launch industry-specific playbook bundles", "Pursue strategic partnerships with consulting firms"],
        },
        confidence: "0.88",
      },
      {
        organizationId: orgId,
        reportType: "risk_assessment",
        title: "Enterprise Risk Assessment: AI Regulatory Landscape 2026",
        executiveSummary: "The EU AI Act enforcement timeline accelerates risk exposure for enterprises deploying AI decision-support systems. Organizations using AI for strategic decisions face new transparency and audit requirements effective March 2026. Proactive compliance positioning creates competitive advantage.",
        findings: [
          { finding: "EU AI Act high-risk classification applies to strategic decision-support systems", impact: "high", confidence: 0.93 },
          { finding: "US state-level AI regulations creating patchwork compliance landscape", impact: "medium", confidence: 0.86 },
          { finding: "Board-level AI governance committees mandated by 62% of S&P 500 companies", impact: "medium", confidence: 0.84 },
          { finding: "AI audit trail requirements increase documentation overhead by 35%", impact: "medium", confidence: 0.88 },
        ],
        recommendations: {
          immediate: ["Implement AI decision audit trail system", "Establish AI governance advisory board"],
          strategic: ["Build compliance-by-design into platform architecture", "Develop AI transparency dashboard for customers"],
        },
        confidence: "0.91",
      },
      {
        organizationId: orgId,
        reportType: "regulatory_update",
        title: "Global Regulatory Impact Analysis: Data Sovereignty & AI Governance",
        executiveSummary: "New data sovereignty requirements in APAC and updated GDPR interpretations require architectural adjustments for multi-region enterprise deployments. Organizations processing strategic data across jurisdictions face heightened compliance requirements affecting platform architecture decisions.",
        findings: [
          { finding: "India DPDP Act enforcement begins impacting SaaS data residency requirements", impact: "high", confidence: 0.90 },
          { finding: "GDPR updated guidelines specifically address AI-processed personal data in business decisions", impact: "high", confidence: 0.92 },
          { finding: "China PIPL cross-border data transfer restrictions tightening for strategic intelligence platforms", impact: "medium", confidence: 0.85 },
          { finding: "SOC 2 Type II now requires AI system controls documentation", impact: "medium", confidence: 0.88 },
        ],
        recommendations: {
          architecture: ["Implement regional data processing zones", "Deploy edge AI capabilities for data-sensitive regions"],
          compliance: ["Update privacy impact assessments for AI features", "Establish cross-border data transfer agreements"],
        },
        confidence: "0.87",
      },
      {
        organizationId: orgId,
        reportType: "technology_trends",
        title: "Technology Trends Report: Agentic AI & Autonomous Execution Systems",
        executiveSummary: "Agentic AI capabilities are reaching enterprise-grade maturity, enabling autonomous multi-step workflow execution with human-in-the-loop oversight. This trend directly impacts the strategic readiness platform category, creating opportunities for AI-driven playbook automation while raising governance considerations.",
        findings: [
          { finding: "Agentic AI frameworks achieving 94% task completion rates in controlled enterprise environments", impact: "high", confidence: 0.86 },
          { finding: "Multi-agent orchestration reducing complex workflow execution time by 67%", impact: "high", confidence: 0.83 },
          { finding: "Enterprise AI agent deployment grew 312% in 2025, primarily in operations and finance", impact: "high", confidence: 0.91 },
          { finding: "Human-in-the-loop governance models preferred by 89% of enterprise CISOs", impact: "medium", confidence: 0.89 },
        ],
        recommendations: {
          product: ["Integrate agentic AI for playbook task automation", "Build AI agent marketplace for domain-specific execution"],
          research: ["Develop proprietary multi-agent orchestration for crisis response", "Create AI confidence scoring for autonomous decision thresholds"],
        },
        confidence: "0.85",
      },
    ]);

    console.log("[Seed] ✓ Inserted 5 intelligence reports");
  }

  // === 3. DECISION OUTCOMES ===
  const [doCount] = await db.select({ cnt: count() }).from(decisionOutcomes);
  if (Number(doCount.cnt) > 0) {
    console.log(`[Seed] Decision outcomes already seeded (${doCount.cnt} rows). Skipping.`);
  } else {
    console.log("[Seed] Seeding decision outcomes...");

    const scenarioId = scenarioRows.length > 0 ? scenarioRows[0].id : null;
    const scenarioId2 = scenarioRows.length > 1 ? scenarioRows[1].id : scenarioId;
    const scenarioId3 = scenarioRows.length > 2 ? scenarioRows[2].id : scenarioId;
    const userId2 = userRows.length > 1 ? userRows[1].id : primaryUserId;
    const userId3 = userRows.length > 2 ? userRows[2].id : primaryUserId;

    await db.insert(decisionOutcomes).values([
      {
        organizationId: orgId,
        scenarioId: scenarioId,
        decisionType: "strategic_pivot",
        decisionDescription: "Pivoted product positioning from general-purpose analytics to strategic readiness platform following competitive analysis showing white space in the market.",
        decisionMaker: primaryUserId,
        decisionContext: { market_conditions: "Crowded analytics market", trigger: "Competitive intelligence report", urgency: "high" },
        chosenOption: { option: "Full strategic pivot to execution platform", timeline: "90 days", investment: "$2.4M" },
        alternativeOptions: [
          { option: "Incremental feature additions to analytics", risk: "low", upside: "limited" },
          { option: "Dual-track analytics + execution", risk: "medium", upside: "moderate" },
        ],
        actualOutcome: "successful",
        effectiveness: "excellent",
        successMetrics: { revenue_impact: "+34%", market_position: "category leader", customer_nps: "+18" },
        actualResults: { revenue_growth: "34%", new_enterprise_customers: 12, competitive_wins: 8 },
        lessonsLearned: { key_insight: "Bold category creation outperforms incremental positioning", recommendation: "Invest in thought leadership to own the category narrative" },
        confidence: "very_high",
        timeToImplement: 85,
        costOfImplementation: "2400000.00",
      },
      {
        organizationId: orgId,
        scenarioId: scenarioId,
        decisionType: "resource_allocation",
        decisionDescription: "Allocated 60% of engineering resources to AI-native playbook automation engine, reducing feature development velocity on secondary modules.",
        decisionMaker: userId2,
        decisionContext: { resource_constraint: "Limited engineering bandwidth", strategic_priority: "AI differentiation", board_pressure: "Demonstrate AI capabilities" },
        chosenOption: { option: "Concentrated AI investment", engineering_allocation: "60%", duration: "6 months" },
        alternativeOptions: [
          { option: "Balanced allocation across all modules", risk: "low", upside: "incremental" },
          { option: "Outsource AI development to vendor", risk: "high", upside: "faster delivery" },
        ],
        actualOutcome: "successful",
        effectiveness: "high",
        successMetrics: { ai_accuracy: "94%", automation_rate: "67%", customer_satisfaction: "+22%" },
        actualResults: { playbook_automation_rate: "67%", ai_confidence_score: 0.94, time_saved_per_execution: "8.5 minutes" },
        lessonsLearned: { key_insight: "Concentrated investment in core differentiator yields outsized returns", recommendation: "Maintain focused AI investment but establish minimum viable support for secondary modules" },
        confidence: "high",
        timeToImplement: 180,
        costOfImplementation: "1800000.00",
      },
      {
        organizationId: orgId,
        scenarioId: scenarioId2,
        decisionType: "market_entry",
        decisionDescription: "Expanded into financial services vertical with specialized regulatory compliance playbooks and SOX-aligned execution workflows.",
        decisionMaker: primaryUserId,
        decisionContext: { market_size: "$4.2B TAM", competitive_density: "medium", regulatory_complexity: "high" },
        chosenOption: { option: "Financial services vertical expansion", initial_target: "Top 50 US banks", investment: "$1.2M" },
        alternativeOptions: [
          { option: "Healthcare vertical first", risk: "high", upside: "larger TAM" },
          { option: "Technology sector deepening", risk: "low", upside: "faster sales cycle" },
        ],
        actualOutcome: "successful",
        effectiveness: "high",
        successMetrics: { pipeline_generated: "$8.4M", deals_closed: 6, avg_deal_size: "$420K" },
        actualResults: { financial_services_revenue: "$2.5M", compliance_playbooks_activated: 340, customer_satisfaction: "4.7/5" },
        lessonsLearned: { key_insight: "Regulatory complexity creates high switching costs and customer stickiness", recommendation: "Develop industry-specific onboarding accelerators" },
        confidence: "high",
        timeToImplement: 120,
        costOfImplementation: "1200000.00",
      },
      {
        organizationId: orgId,
        scenarioId: scenarioId2,
        decisionType: "crisis_response",
        decisionDescription: "Executed rapid response to major customer data processing incident using pre-built Crisis Response Playbook #89, coordinating 14 stakeholders in under 12 minutes.",
        decisionMaker: userId3,
        decisionContext: { crisis_type: "Data processing anomaly", affected_customers: 3, severity: "high", time_sensitivity: "2 hours" },
        chosenOption: { option: "Full crisis playbook activation", response_time: "11 minutes", stakeholders_coordinated: 14 },
        alternativeOptions: [
          { option: "Manual ad-hoc coordination", estimated_time: "4+ hours", risk: "high" },
          { option: "Escalate to external crisis firm", estimated_time: "24 hours", cost: "$150K" },
        ],
        actualOutcome: "successful",
        effectiveness: "excellent",
        successMetrics: { response_time: "11 minutes", customer_retention: "100%", regulatory_compliance: "full" },
        actualResults: { resolution_time: "47 minutes", customer_churn: 0, compliance_fines: 0, brand_impact: "minimal" },
        lessonsLearned: { key_insight: "Pre-built playbooks with pre-assigned roles reduce crisis response time by 95%", recommendation: "Conduct quarterly crisis drills for all Tier 1 playbooks" },
        confidence: "very_high",
        timeToImplement: 1,
        costOfImplementation: "25000.00",
      },
      {
        organizationId: orgId,
        scenarioId: scenarioId3,
        decisionType: "technology_adoption",
        decisionDescription: "Adopted agentic AI framework for autonomous playbook task execution with human-in-the-loop governance for high-stakes decisions.",
        decisionMaker: userId2,
        decisionContext: { technology_maturity: "emerging", competitive_pressure: "high", board_interest: "strong" },
        chosenOption: { option: "Phased agentic AI adoption with governance framework", phases: 3, timeline: "12 months" },
        alternativeOptions: [
          { option: "Wait for market maturity", risk: "competitive gap", upside: "lower implementation risk" },
          { option: "Full autonomous deployment", risk: "governance concerns", upside: "maximum speed" },
        ],
        actualOutcome: "partially_successful",
        effectiveness: "moderate",
        successMetrics: { automation_rate: "45%", accuracy: "91%", governance_compliance: "100%" },
        actualResults: { tasks_automated: 1240, accuracy_rate: "91%", governance_incidents: 0, cost_reduction: "23%" },
        lessonsLearned: { key_insight: "Human-in-the-loop governance essential for enterprise trust but slows automation velocity", recommendation: "Develop tiered autonomy based on decision risk level" },
        confidence: "medium",
        timeToImplement: 240,
        costOfImplementation: "3200000.00",
      },
      {
        organizationId: orgId,
        scenarioId: scenarioId,
        decisionType: "resource_allocation",
        decisionDescription: "Redirected $800K from marketing spend to customer success team expansion to reduce churn in enterprise segment from 8% to under 3%.",
        decisionMaker: primaryUserId,
        decisionContext: { churn_rate: "8%", enterprise_arr_at_risk: "$4.8M", competitive_threat: "Palantir offering free migration" },
        chosenOption: { option: "Invest in customer success expansion", headcount_added: 6, budget_redirected: "$800K" },
        alternativeOptions: [
          { option: "Increase marketing spend for new acquisition", risk: "leaky bucket", upside: "pipeline growth" },
          { option: "Price reduction for at-risk accounts", risk: "margin erosion", upside: "immediate retention" },
        ],
        actualOutcome: "successful",
        effectiveness: "excellent",
        successMetrics: { churn_reduction: "62%", nrr: "118%", enterprise_satisfaction: "4.8/5" },
        actualResults: { churn_rate: "2.9%", net_revenue_retention: "118%", enterprise_nps: 72, expansion_revenue: "$1.2M" },
        lessonsLearned: { key_insight: "Customer success investment yields 6x ROI vs new customer acquisition in enterprise segment", recommendation: "Maintain 1:15 CSM to customer ratio for enterprise accounts" },
        confidence: "very_high",
        timeToImplement: 90,
        costOfImplementation: "800000.00",
      },
      {
        organizationId: orgId,
        scenarioId: scenarioId2,
        decisionType: "strategic_pivot",
        decisionDescription: "Transitioned from point-solution positioning to platform strategy, launching unified Strategic Execution Operating System with integrated signal detection, playbook activation, and outcome tracking.",
        decisionMaker: primaryUserId,
        decisionContext: { market_signal: "Customer demand for unified platform", competitive_landscape: "Point solutions fragmenting", board_direction: "Platform consolidation trend" },
        chosenOption: { option: "Unified platform strategy", modules_integrated: 5, timeline: "6 months" },
        alternativeOptions: [
          { option: "Best-of-breed point solution strategy", risk: "integration fatigue", upside: "focused development" },
          { option: "Partnership ecosystem approach", risk: "dependency", upside: "faster coverage" },
        ],
        actualOutcome: "successful",
        effectiveness: "high",
        successMetrics: { platform_adoption: "89%", module_cross_sell: "3.2 avg", deal_size_increase: "+67%" },
        actualResults: { avg_modules_per_customer: 3.2, deal_size_increase: "67%", platform_stickiness: "96%", competitive_win_rate: "72%" },
        lessonsLearned: { key_insight: "Platform strategy dramatically increases switching costs and customer lifetime value", recommendation: "Continue deepening platform integration and data network effects" },
        confidence: "high",
        timeToImplement: 180,
        costOfImplementation: "4500000.00",
      },
      {
        organizationId: orgId,
        scenarioId: scenarioId3,
        decisionType: "crisis_response",
        decisionDescription: "Responded to competitor's aggressive pricing announcement by launching value-based ROI calculator and executive briefing campaign demonstrating 14x cost-of-inaction multiplier.",
        decisionMaker: userId2,
        decisionContext: { competitor_action: "50% price cut by competitor", market_reaction: "Customer inquiries increased 340%", urgency: "critical" },
        chosenOption: { option: "Value-based counter-positioning", approach: "ROI demonstration campaign", investment: "$350K" },
        alternativeOptions: [
          { option: "Match competitor pricing", risk: "margin destruction", upside: "immediate retention" },
          { option: "Ignore and focus on product", risk: "customer defection", upside: "long-term differentiation" },
        ],
        actualOutcome: "successful",
        effectiveness: "excellent",
        successMetrics: { customer_retention: "97%", competitive_win_rate: "+15%", pipeline_quality: "improved" },
        actualResults: { accounts_retained: "97%", new_competitive_wins: 5, avg_deal_premium: "+23%", brand_perception: "value leader" },
        lessonsLearned: { key_insight: "Value-based positioning neutralizes price competition when ROI is demonstrable", recommendation: "Build ROI tracking into every customer engagement as proof points" },
        confidence: "high",
        timeToImplement: 14,
        costOfImplementation: "350000.00",
      },
    ]);

    console.log("[Seed] ✓ Inserted 8 decision outcomes");
  }

  // === 4. WAR ROOM SESSIONS ===
  const [wrCount] = await db.select({ cnt: count() }).from(warRoomSessions);
  if (Number(wrCount.cnt) > 0) {
    console.log(`[Seed] War room sessions already seeded (${wrCount.cnt} rows). Skipping.`);
  } else {
    console.log("[Seed] Seeding war room sessions...");

    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    await db.insert(warRoomSessions).values([
      {
        organizationId: orgId,
        sessionName: "APAC Competitive Threat Response - SynerTech CloudFlow 3.0",
        commanderId: primaryUserId,
        status: "active",
        startTime: threeDaysAgo,
        participants: [
          { userId: primaryUserId, role: "Commander", joinedAt: threeDaysAgo.toISOString() },
          { userId: userRows.length > 1 ? userRows[1].id : primaryUserId, role: "Strategy Lead", joinedAt: threeDaysAgo.toISOString() },
          { userId: userRows.length > 2 ? userRows[2].id : primaryUserId, role: "Technical Lead", joinedAt: threeDaysAgo.toISOString() },
          { userId: userRows.length > 3 ? userRows[3].id : primaryUserId, role: "Operations Lead", joinedAt: threeDaysAgo.toISOString() },
        ],
        objectives: [
          { objective: "Assess competitive threat severity and market impact", status: "completed", priority: "critical" },
          { objective: "Develop counter-positioning strategy within 48 hours", status: "in_progress", priority: "critical" },
          { objective: "Brief board on competitive response plan", status: "pending", priority: "high" },
          { objective: "Launch customer retention countermeasures", status: "in_progress", priority: "high" },
        ],
        actionItems: [
          { item: "Complete competitive feature gap analysis", assignee: "Strategy Lead", dueDate: now.toISOString(), status: "completed" },
          { item: "Prepare customer talking points for sales team", assignee: "CMO", dueDate: now.toISOString(), status: "in_progress" },
          { item: "Develop accelerated product roadmap response", assignee: "CTO", dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), status: "pending" },
        ],
        decisions: [
          { decision: "Accelerate Q2 product launch by 3 weeks", madeBy: "CEO", timestamp: threeDaysAgo.toISOString(), rationale: "Counter competitive momentum" },
          { decision: "Allocate $500K emergency competitive response budget", madeBy: "CFO", timestamp: threeDaysAgo.toISOString(), rationale: "Fund accelerated development and marketing" },
        ],
        scenarioId: scenarioRows.length > 0 ? scenarioRows[0].id : null,
        executionTimeMinutes: 11,
        stakeholdersNotified: 14,
        businessImpact: { revenue_at_risk: "$3.2M", customers_affected: 8, market_share_impact: "-2.3%" },
        outcome: "in_progress",
      },
      {
        organizationId: orgId,
        sessionName: "Data Processing Incident - Enterprise Customer Impact Response",
        commanderId: userRows.length > 2 ? userRows[2].id : primaryUserId,
        status: "completed",
        startTime: oneWeekAgo,
        endTime: new Date(oneWeekAgo.getTime() + 47 * 60 * 1000),
        participants: [
          { userId: userRows.length > 2 ? userRows[2].id : primaryUserId, role: "Incident Commander", joinedAt: oneWeekAgo.toISOString() },
          { userId: primaryUserId, role: "Executive Sponsor", joinedAt: oneWeekAgo.toISOString() },
          { userId: userRows.length > 1 ? userRows[1].id : primaryUserId, role: "Communications Lead", joinedAt: oneWeekAgo.toISOString() },
        ],
        objectives: [
          { objective: "Contain data processing incident within 1 hour", status: "completed", priority: "critical" },
          { objective: "Notify affected customers within regulatory timeline", status: "completed", priority: "critical" },
          { objective: "Complete root cause analysis", status: "completed", priority: "high" },
          { objective: "Implement preventive measures", status: "completed", priority: "high" },
        ],
        actionItems: [
          { item: "Isolate affected data processing pipeline", assignee: "VP Engineering", status: "completed" },
          { item: "Draft customer notification", assignee: "Legal Counsel", status: "completed" },
          { item: "Deploy monitoring enhancements", assignee: "CISO", status: "completed" },
        ],
        decisions: [
          { decision: "Activate Crisis Response Playbook #89", madeBy: "Incident Commander", timestamp: oneWeekAgo.toISOString() },
          { decision: "Engage external forensics firm for root cause", madeBy: "CISO", timestamp: oneWeekAgo.toISOString() },
          { decision: "Offer affected customers 3-month service credits", madeBy: "CEO", timestamp: new Date(oneWeekAgo.getTime() + 30 * 60 * 1000).toISOString() },
        ],
        executionTimeMinutes: 47,
        executiveHourlyRate: 350,
        stakeholdersNotified: 22,
        businessImpact: { revenue_protected: "$1.8M", customer_retention: "100%", regulatory_fines_avoided: "$250K" },
        outcome: "successful",
      },
      {
        organizationId: orgId,
        sessionName: "Strategic Planning: AI Platform Roadmap Alignment",
        commanderId: primaryUserId,
        status: "completed",
        startTime: twoWeeksAgo,
        endTime: new Date(twoWeeksAgo.getTime() + 90 * 60 * 1000),
        participants: [
          { userId: primaryUserId, role: "Session Lead", joinedAt: twoWeeksAgo.toISOString() },
          { userId: userRows.length > 1 ? userRows[1].id : primaryUserId, role: "Strategy Advisor", joinedAt: twoWeeksAgo.toISOString() },
          { userId: userRows.length > 2 ? userRows[2].id : primaryUserId, role: "Technology Lead", joinedAt: twoWeeksAgo.toISOString() },
          { userId: userRows.length > 3 ? userRows[3].id : primaryUserId, role: "Product Lead", joinedAt: twoWeeksAgo.toISOString() },
        ],
        objectives: [
          { objective: "Align AI roadmap with strategic execution vision", status: "completed", priority: "critical" },
          { objective: "Prioritize agentic AI capabilities for Q2 2026", status: "completed", priority: "high" },
          { objective: "Define resource allocation for AI initiatives", status: "completed", priority: "high" },
        ],
        actionItems: [
          { item: "Finalize agentic AI architecture design", assignee: "CTO", status: "completed" },
          { item: "Recruit 3 senior AI engineers", assignee: "CHRO", status: "in_progress" },
          { item: "Launch AI governance framework v2", assignee: "VP Compliance", status: "in_progress" },
        ],
        decisions: [
          { decision: "Invest $3.2M in agentic AI development over 12 months", madeBy: "CEO", timestamp: twoWeeksAgo.toISOString() },
          { decision: "Adopt human-in-the-loop governance for all AI decisions above confidence threshold 0.85", madeBy: "Board", timestamp: twoWeeksAgo.toISOString() },
        ],
        executionTimeMinutes: 90,
        executiveHourlyRate: 350,
        stakeholdersNotified: 35,
        businessImpact: { strategic_alignment_score: "94%", investment_approved: "$3.2M", roadmap_clarity: "high" },
        outcome: "successful",
      },
    ]);

    console.log("[Seed] ✓ Inserted 3 war room sessions");
  }

  // === 5. PLAYBOOK ACTIVATIONS ===
  const [paCount] = await db.select({ cnt: count() }).from(playbookActivations);
  if (Number(paCount.cnt) > 0) {
    console.log(`[Seed] Playbook activations already seeded (${paCount.cnt} rows). Skipping.`);
  } else {
    console.log("[Seed] Seeding playbook activations...");

    const samplePlaybooks = await db.select().from(playbookLibrary).limit(5);
    if (samplePlaybooks.length === 0) {
      console.log("[Seed] No playbooks found for activations. Skipping.");
    } else {
      const activationData = [
        {
          organizationId: orgId,
          playbookId: samplePlaybooks[0].id,
          activatedBy: primaryUserId,
          activationReason: "Competitor launched aggressive pricing campaign threatening 8 enterprise accounts worth $3.2M ARR",
          situationSummary: "SynerTech announced 50% price reduction on CloudFlow 3.0, targeting our top-tier enterprise customers in APAC region. Three customers have requested competitive quotes.",
          successRating: 92,
          actualExecutionTime: 11,
          targetMet: true,
          lessonsLearned: "Pre-built competitive response playbook enabled sub-12-minute coordination across 14 stakeholders. Value-based counter-positioning more effective than price matching.",
          playbookImprovements: [
            { area: "Customer intelligence", suggestion: "Add real-time competitive pricing monitoring to trigger earlier" },
            { area: "Stakeholder coverage", suggestion: "Include customer success managers in Tier 2 notification" },
          ],
          activatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 47 * 60 * 1000),
        },
        {
          organizationId: orgId,
          playbookId: samplePlaybooks[1 % samplePlaybooks.length].id,
          activatedBy: userRows.length > 1 ? userRows[1].id : primaryUserId,
          activationReason: "Critical data processing anomaly detected in production affecting 3 enterprise customers",
          situationSummary: "Automated monitoring detected unusual data processing patterns in the analytics pipeline at 02:14 UTC. Initial assessment shows potential impact on real-time intelligence feeds for 3 financial services customers.",
          successRating: 95,
          actualExecutionTime: 8,
          targetMet: true,
          lessonsLearned: "Automated detection and pre-assigned incident roles reduced response time below target. Night shift coverage gap identified and addressed.",
          playbookImprovements: [
            { area: "Detection speed", suggestion: "Implement ML-based anomaly detection for 60-second detection" },
            { area: "Communication", suggestion: "Add automated customer notification templates" },
          ],
          activatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
          completedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000 + 35 * 60 * 1000),
        },
        {
          organizationId: orgId,
          playbookId: samplePlaybooks[2 % samplePlaybooks.length].id,
          activatedBy: primaryUserId,
          activationReason: "New EU AI Act enforcement guidance published requiring immediate compliance assessment",
          situationSummary: "European Commission published updated enforcement guidance for AI Act Article 6 high-risk classifications. Our strategic decision-support features may require additional documentation and transparency measures.",
          successRating: 88,
          actualExecutionTime: 14,
          targetMet: false,
          lessonsLearned: "Regulatory playbook execution took 2 minutes over target due to external legal counsel availability. Pre-scheduled legal retainer hours would improve response time.",
          playbookImprovements: [
            { area: "Legal coordination", suggestion: "Establish dedicated regulatory response retainer with outside counsel" },
            { area: "Documentation", suggestion: "Pre-build compliance documentation templates for major regulatory frameworks" },
          ],
          activatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
          completedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000),
        },
        {
          organizationId: orgId,
          playbookId: samplePlaybooks[3 % samplePlaybooks.length].id,
          activatedBy: userRows.length > 2 ? userRows[2].id : primaryUserId,
          activationReason: "Key VP of Engineering submitted resignation during critical product launch period",
          situationSummary: "VP of Engineering announced departure effective in 3 weeks, coinciding with Q2 platform launch. 4 direct reports and 23 engineers need leadership continuity plan.",
          successRating: 85,
          actualExecutionTime: 10,
          targetMet: true,
          lessonsLearned: "Leadership succession playbook successfully activated interim leadership within 10 minutes. Knowledge transfer plan should be pre-built for all director+ roles.",
          playbookImprovements: [
            { area: "Succession planning", suggestion: "Maintain warm successor pipeline for all VP+ positions" },
            { area: "Knowledge capture", suggestion: "Implement continuous documentation practice for critical institutional knowledge" },
          ],
          activatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          completedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000 + 21 * 24 * 60 * 60 * 1000),
        },
        {
          organizationId: orgId,
          playbookId: samplePlaybooks[4 % samplePlaybooks.length].id,
          activatedBy: primaryUserId,
          activationReason: "Major customer publicly criticized platform reliability on LinkedIn, post gaining viral traction",
          situationSummary: "Fortune 500 CISO posted critical LinkedIn article about platform reliability during their recent crisis drill. Post received 12,000+ impressions in 2 hours with negative sentiment trending.",
          successRating: 90,
          actualExecutionTime: 9,
          targetMet: true,
          lessonsLearned: "Social media crisis playbook enabled rapid coordinated response. CEO direct outreach to customer within 15 minutes converted critic to advocate.",
          playbookImprovements: [
            { area: "Social monitoring", suggestion: "Add real-time executive social media monitoring for brand mentions" },
            { area: "Response templates", suggestion: "Create pre-approved social media response templates for common criticism themes" },
          ],
          activatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
          completedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000 + 120 * 60 * 1000),
        },
      ];

      await db.insert(playbookActivations).values(activationData);
      console.log("[Seed] ✓ Inserted 5 playbook activations");
    }
  }

  console.log("[Seed] ✓ Pipeline data seeding complete!");
}
