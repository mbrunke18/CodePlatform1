import { Router } from 'express';
import { z } from 'zod';
import { openAIService } from '../services/OpenAIService';
import { db } from '../db';
import { incidentAnalyses, readinessAssessments, whatIfRuns } from '@shared/schema';
import { eq } from 'drizzle-orm';
import sgMail from '@sendgrid/mail';

const router = Router();

function detectDomain(description: string): string {
  const lower = description.toLowerCase();
  const offenseKeywords = ['market entry', 'opportunity', 'expansion', 'launch', 'acquisition', 'm&a', 'merger', 'partnership', 'ipo', 'competitive position', 'new market', 'go-to-market', 'revenue', 'growth', 'customer acquisition'];
  const defenseKeywords = ['ransomware', 'breach', 'crisis', 'attack', 'incident', 'outage', 'failure', 'recall', 'regulatory', 'compliance', 'threat', 'hack', 'security', 'fraud', 'litigation', 'whistleblower', 'safety'];
  const specialKeywords = ['transformation', 'digital', 'migration', 'restructuring', 'ai governance', 'change management', 'automation', 'modernize', 'cloud', 'agile', 'innovation', 'esg', 'sustainability', 'culture'];
  
  const offenseScore = offenseKeywords.filter(k => lower.includes(k)).length;
  const defenseScore = defenseKeywords.filter(k => lower.includes(k)).length;
  const specialScore = specialKeywords.filter(k => lower.includes(k)).length;
  
  if (defenseScore >= offenseScore && defenseScore >= specialScore) return 'defense';
  if (offenseScore >= specialScore) return 'offense';
  return 'special_teams';
}

function getDomainFallback(domain: string, description: string) {
  const fallbacks: Record<string, any> = {
    offense: {
      domain: 'offense',
      domain_confidence: 0.85,
      incident_type: 'Market Opportunity Delay',
      matched_playbook: { code: '#MKT-001', name: 'Market Entry — Rapid Deployment Protocol', exists_in_library: true },
      severity: 'high',
      situation_summary: 'A significant market opportunity was identified but execution took too long due to coordination gaps, allowing competitors to move first.',
      what_went_wrong: [
        'No pre-built go-to-market playbook existed',
        'Stakeholder alignment took months instead of minutes',
        'Sequential approval process created bottlenecks',
        'No pre-authorized decision thresholds for market investment',
        'Competitive intelligence was not integrated into decision flow',
        'No single owner for the opportunity capture'
      ],
      root_causes: [
        { cause: 'Coordination Delay', description: 'Stakeholder alignment took months instead of minutes' },
        { cause: 'Missing Playbook', description: 'No pre-built execution plan for market entry existed' },
        { cause: 'Sequential Approvals', description: 'Each decision required a new meeting and approval cycle' },
        { cause: 'No Pre-Authorization', description: 'Every investment decision required escalation' }
      ],
      estimated_impact: '$20-50M opportunity lost',
      time_to_coordination: '6-9 months',
      root_cause: 'Execution gap — the opportunity was clear but no coordination infrastructure existed to capture it quickly',
      your_reality: [
        { time: 'Week 1', description: 'Opportunity identified, initial discussions begin' },
        { time: 'Month 1', description: 'Still building business case and seeking alignment' },
        { time: 'Month 3', description: 'Stakeholder meetings ongoing, no clear decision' },
        { time: 'Month 6', description: 'Approvals finally in progress, competitor already moving' },
        { time: 'Month 9', description: 'Ready to execute but market window has closed' },
        { time: 'Final', description: 'Competitor captured the opportunity — $20-50M lost' }
      ],
      with_executeiq: [
        { time: '0:00', description: 'Market signal detected, entry playbook activated' },
        { time: '0:02', description: '12 stakeholders notified across all functions' },
        { time: '0:05', description: 'All critical roles acknowledged, go/no-go thresholds pre-cleared' },
        { time: '0:08', description: 'Pre-authorized investment deployed, teams mobilized' },
        { time: '0:12', description: 'Coordinated execution launched — first mover advantage captured' },
        { time: 'Final', description: 'Market captured in 90 days with full coordination' }
      ],
      cost_without: '$30M opportunity lost',
      cost_with: '$2M investment, $30M+ captured',
      comparison_metrics: {
        time_to_coordination: { reality: '6-9 months', executeiq: '12 minutes' },
        stakeholder_alignment: { reality: 'Sequential over months', executeiq: 'Parallel in minutes' },
        outcome: { reality: 'Missed opportunity', executeiq: 'First mover advantage' }
      }
    },
    defense: {
      domain: 'defense',
      domain_confidence: 0.90,
      incident_type: 'Coordination Failure',
      matched_playbook: { code: '#SEC-001', name: 'Crisis Response — Multi-Stakeholder Protocol', exists_in_library: true },
      severity: 'critical',
      situation_summary: 'A critical threat materialized but response was delayed due to unclear ownership, missing playbooks, and ad-hoc coordination.',
      what_went_wrong: [
        'No clear incident owner identified in first 24 hours',
        'No pre-built response playbook existed',
        'Ad-hoc communication via emails and calls',
        'No pre-authorized decision thresholds',
        'Stakeholder notification was manual and incomplete',
        'No documented escalation path'
      ],
      root_causes: [
        { cause: 'No Clear Ownership', description: 'Nobody knew who was responsible for coordinating the response' },
        { cause: 'Missing Playbook', description: 'No pre-built response plan existed for this scenario' },
        { cause: 'Ad-hoc Communication', description: 'Used random calls and emails instead of structured notification' },
        { cause: 'No Pre-Authorization', description: 'Every spending decision required a new approval meeting' }
      ],
      estimated_impact: '$8-15M',
      time_to_coordination: '48-72 hours',
      root_cause: 'Execution gap — strategy existed but coordination infrastructure did not',
      your_reality: [
        { time: 'Hour 0', description: 'Incident detected but unclear who owns the response' },
        { time: 'Hour 4', description: 'Emails and calls trying to identify the right people' },
        { time: 'Hour 12', description: 'Still no single owner — parallel efforts creating confusion' },
        { time: 'Hour 24', description: 'News breaks before internal coordination is complete' },
        { time: 'Hour 48-72', description: 'Finally assembled team, but damage already done' },
        { time: 'Final', description: 'Contained after significant financial and reputational impact' }
      ],
      with_executeiq: [
        { time: '0:00', description: 'Threat detected, response playbook activated automatically' },
        { time: '0:02', description: '6 key stakeholders notified via Slack, SMS, and phone' },
        { time: '0:05', description: 'All stakeholders acknowledged, tasks auto-assigned' },
        { time: '0:08', description: 'Coordinated response fully underway, containment active' },
        { time: '0:11', description: 'Situation contained, board briefing auto-generated' },
        { time: 'Final', description: 'Resolved with minimal impact — $150-250K total cost' }
      ],
      cost_without: '$12M',
      cost_with: '$200K',
      comparison_metrics: {
        time_to_coordination: { reality: '48-72 hours', executeiq: '12 minutes' },
        stakeholder_alignment: { reality: 'Manual over days', executeiq: 'Automated in minutes' },
        outcome: { reality: 'Significant damage', executeiq: 'Contained quickly' }
      }
    },
    special_teams: {
      domain: 'special_teams',
      domain_confidence: 0.85,
      incident_type: 'Transformation Stall',
      matched_playbook: { code: '#TRN-001', name: 'Digital Transformation — Coordinated Execution Protocol', exists_in_library: true },
      severity: 'high',
      situation_summary: 'A major transformation initiative lost momentum due to conflicting priorities, unclear ownership, and stakeholder fatigue over an extended timeline.',
      what_went_wrong: [
        'No single owner for cross-functional coordination',
        'Business units had conflicting priorities and timelines',
        'Vendor selection and procurement took months',
        'Lost executive sponsor without succession plan',
        'No pre-defined RACI for transformation workstreams',
        'Change management was reactive, not proactive'
      ],
      root_causes: [
        { cause: 'Coordination Complexity', description: 'Multiple workstreams with no unified coordination mechanism' },
        { cause: 'Stakeholder Fatigue', description: 'Extended timeline eroded buy-in and momentum' },
        { cause: 'Missing Playbook', description: 'No pre-built transformation execution plan existed' },
        { cause: 'No Pre-Authorization', description: 'Every resource decision required steering committee approval' }
      ],
      estimated_impact: '$40M spent, 30% delivered',
      time_to_coordination: '18 months',
      root_cause: 'Execution gap — transformation vision was clear but coordinated execution infrastructure was missing',
      your_reality: [
        { time: 'Month 1', description: 'Initiative approved, initial planning begins' },
        { time: 'Month 3', description: 'Still selecting vendors and defining scope' },
        { time: 'Month 6', description: 'First workstream launched but others stalled' },
        { time: 'Month 12', description: 'Executive sponsor departs, momentum lost' },
        { time: 'Month 18', description: 'Only 30% complete, budget exhausted' },
        { time: 'Final', description: '$40M spent with minimal transformation achieved' }
      ],
      with_executeiq: [
        { time: '0:00', description: 'Initiative triggered, transformation playbook activated' },
        { time: '0:02', description: 'All workstream leads and sponsors notified' },
        { time: '0:05', description: 'Dependencies mapped, blockers pre-cleared' },
        { time: '0:10', description: 'Pre-authorized resources deployed, all teams aligned' },
        { time: '0:12', description: 'Coordinated execution begins across all workstreams' },
        { time: 'Final', description: 'Full transformation delivered on schedule, on budget' }
      ],
      cost_without: '$40M (30% delivered)',
      cost_with: '$35M (100% delivered on schedule)',
      comparison_metrics: {
        time_to_coordination: { reality: '6+ months', executeiq: '12 minutes' },
        stakeholder_alignment: { reality: 'Sequential over months', executeiq: 'Day 1 alignment' },
        outcome: { reality: '30% delivered', executeiq: '100% on schedule' }
      }
    }
  };
  return fallbacks[domain] || fallbacks.defense;
}

function getPlaybookFallback(incidentType: string, description: string) {
  const lower = description.toLowerCase();
  const offenseKeywords = ['market', 'opportunity', 'expansion', 'launch', 'acquisition', 'm&a', 'merger', 'partnership', 'ipo', 'revenue', 'growth'];
  const specialKeywords = ['transformation', 'digital', 'migration', 'restructuring', 'ai governance', 'automation', 'modernize', 'cloud'];
  const isOffense = offenseKeywords.some(k => lower.includes(k));
  const isSpecial = specialKeywords.some(k => lower.includes(k));

  if (isOffense) {
    return {
      name: `${incidentType || 'Market Opportunity'} — Rapid Capture Protocol`,
      code: "#MKT-001",
      domain: "offense",
      category: "OFFENSE",
      triggerConditions: [
        { condition: "Market opportunity signal detected", threshold: "Revenue potential > $10M" },
        { condition: "Competitive window narrowing", threshold: "< 90 days to first-mover advantage" },
        { condition: "Executive sponsor greenlight", threshold: "VP+ approval" },
        { condition: "Resource availability confirmed", threshold: "Core team available within 48hrs" }
      ],
      raciMatrix: [
        { role: "Market Entry Lead", responsibility: "R", name: "[Assignee]", department: "Strategy" },
        { role: "Chief Strategy Officer", responsibility: "A", name: "[Assignee]", department: "Executive" },
        { role: "Product Lead", responsibility: "R", name: "[Assignee]", department: "Product" },
        { role: "Finance Controller", responsibility: "C", name: "[Assignee]", department: "Finance" },
        { role: "Sales Director", responsibility: "R", name: "[Assignee]", department: "Sales" },
        { role: "Legal Counsel", responsibility: "C", name: "[Assignee]", department: "Legal" }
      ],
      stakeholders: [
        { role: "Market Entry Lead", responsibility: "R", name: "[Assignee]", department: "Strategy" },
        { role: "Chief Strategy Officer", responsibility: "A", name: "[Assignee]", department: "Executive" },
        { role: "Product Lead", responsibility: "R", name: "[Assignee]", department: "Product" },
        { role: "Finance Controller", responsibility: "C", name: "[Assignee]", department: "Finance" },
        { role: "Sales Director", responsibility: "R", name: "[Assignee]", department: "Sales" },
        { role: "Legal Counsel", responsibility: "C", name: "[Assignee]", department: "Legal" }
      ],
      taskSequence: [
        { id: 1, name: "Validate market opportunity and size TAM", owner: "Market Entry Lead", priority: "Critical", duration: "2 minutes", phase: "Immediate" },
        { id: 2, name: "Notify cross-functional capture team", owner: "System", priority: "Critical", duration: "1 minute", phase: "Immediate" },
        { id: 3, name: "Assess competitive landscape and window", owner: "Strategy Analyst", priority: "Critical", duration: "3 minutes", phase: "Immediate" },
        { id: 4, name: "Activate go-to-market playbook", owner: "Market Entry Lead", priority: "High", duration: "2 minutes", phase: "Immediate" },
        { id: 5, name: "Allocate pre-authorized investment budget", owner: "Finance Controller", priority: "High", duration: "3 minutes", phase: "Secondary" },
        { id: 6, name: "Brief sales and channel partners", owner: "Sales Director", priority: "High", duration: "5 minutes", phase: "Secondary" },
        { id: 7, name: "Prepare regulatory and legal review", owner: "Legal Counsel", priority: "Medium", duration: "5 minutes", phase: "Secondary" },
        { id: 8, name: "Launch coordinated market entry execution", owner: "Market Entry Lead", priority: "Critical", duration: "2 minutes", phase: "Follow-up" }
      ],
      tasks: [
        { id: 1, name: "Validate market opportunity and size TAM", owner: "Market Entry Lead", priority: "Critical", duration: "2 minutes", phase: "Immediate" },
        { id: 2, name: "Notify cross-functional capture team", owner: "System", priority: "Critical", duration: "1 minute", phase: "Immediate" },
        { id: 3, name: "Assess competitive landscape and window", owner: "Strategy Analyst", priority: "Critical", duration: "3 minutes", phase: "Immediate" },
        { id: 4, name: "Activate go-to-market playbook", owner: "Market Entry Lead", priority: "High", duration: "2 minutes", phase: "Immediate" },
        { id: 5, name: "Allocate pre-authorized investment budget", owner: "Finance Controller", priority: "High", duration: "3 minutes", phase: "Secondary" },
        { id: 6, name: "Brief sales and channel partners", owner: "Sales Director", priority: "High", duration: "5 minutes", phase: "Secondary" },
        { id: 7, name: "Prepare regulatory and legal review", owner: "Legal Counsel", priority: "Medium", duration: "5 minutes", phase: "Secondary" },
        { id: 8, name: "Launch coordinated market entry execution", owner: "Market Entry Lead", priority: "Critical", duration: "2 minutes", phase: "Follow-up" }
      ],
      preAuthorizedThresholds: [
        { decision: "Market entry investment", limit: "Up to $2M without board approval", approver: "CSO" },
        { decision: "Channel partner agreements", limit: "Standard terms pre-approved", approver: "Sales Director" },
        { decision: "Product localization budget", limit: "Up to $500K", approver: "Product Lead" }
      ],
      estimated_coordination_time: "11 minutes"
    };
  }

  if (isSpecial) {
    return {
      name: `${incidentType || 'Digital Transformation'} — Coordinated Execution Protocol`,
      code: "#TRN-001",
      domain: "special_teams",
      category: "SPECIAL TEAMS",
      triggerConditions: [
        { condition: "Transformation initiative approved by steering committee", threshold: "Board or C-suite approval" },
        { condition: "Technology readiness assessment complete", threshold: "Readiness score > 70%" },
        { condition: "Change management plan finalized", threshold: "All workstream leads aligned" },
        { condition: "Budget allocation confirmed", threshold: "Funding secured for Phase 1" }
      ],
      raciMatrix: [
        { role: "Transformation Lead", responsibility: "R", name: "[Assignee]", department: "Digital" },
        { role: "Chief Digital Officer", responsibility: "A", name: "[Assignee]", department: "Executive" },
        { role: "Change Management Lead", responsibility: "R", name: "[Assignee]", department: "HR / Change" },
        { role: "IT Architecture Lead", responsibility: "R", name: "[Assignee]", department: "IT" },
        { role: "Business Unit Sponsors", responsibility: "C", name: "[Assignee]", department: "Business Operations" },
        { role: "Finance Partner", responsibility: "I", name: "[Assignee]", department: "Finance" }
      ],
      stakeholders: [
        { role: "Transformation Lead", responsibility: "R", name: "[Assignee]", department: "Digital" },
        { role: "Chief Digital Officer", responsibility: "A", name: "[Assignee]", department: "Executive" },
        { role: "Change Management Lead", responsibility: "R", name: "[Assignee]", department: "HR / Change" },
        { role: "IT Architecture Lead", responsibility: "R", name: "[Assignee]", department: "IT" },
        { role: "Business Unit Sponsors", responsibility: "C", name: "[Assignee]", department: "Business Operations" },
        { role: "Finance Partner", responsibility: "I", name: "[Assignee]", department: "Finance" }
      ],
      taskSequence: [
        { id: 1, name: "Activate transformation playbook and notify all workstream leads", owner: "Transformation Lead", priority: "Critical", duration: "2 minutes", phase: "Immediate" },
        { id: 2, name: "Map cross-functional dependencies and blockers", owner: "IT Architecture Lead", priority: "Critical", duration: "3 minutes", phase: "Immediate" },
        { id: 3, name: "Deploy pre-authorized resources to Phase 1 workstreams", owner: "Finance Partner", priority: "High", duration: "2 minutes", phase: "Immediate" },
        { id: 4, name: "Launch change management communications", owner: "Change Management Lead", priority: "High", duration: "3 minutes", phase: "Immediate" },
        { id: 5, name: "Establish real-time progress tracking dashboard", owner: "Transformation Lead", priority: "High", duration: "2 minutes", phase: "Secondary" },
        { id: 6, name: "Align business unit sponsors on milestones", owner: "Business Unit Sponsors", priority: "Medium", duration: "5 minutes", phase: "Secondary" },
        { id: 7, name: "Schedule weekly coordination cadence", owner: "Transformation Lead", priority: "Medium", duration: "2 minutes", phase: "Secondary" },
        { id: 8, name: "Begin coordinated execution across all workstreams", owner: "All Leads", priority: "Critical", duration: "2 minutes", phase: "Follow-up" }
      ],
      tasks: [
        { id: 1, name: "Activate transformation playbook and notify all workstream leads", owner: "Transformation Lead", priority: "Critical", duration: "2 minutes", phase: "Immediate" },
        { id: 2, name: "Map cross-functional dependencies and blockers", owner: "IT Architecture Lead", priority: "Critical", duration: "3 minutes", phase: "Immediate" },
        { id: 3, name: "Deploy pre-authorized resources to Phase 1 workstreams", owner: "Finance Partner", priority: "High", duration: "2 minutes", phase: "Immediate" },
        { id: 4, name: "Launch change management communications", owner: "Change Management Lead", priority: "High", duration: "3 minutes", phase: "Immediate" },
        { id: 5, name: "Establish real-time progress tracking dashboard", owner: "Transformation Lead", priority: "High", duration: "2 minutes", phase: "Secondary" },
        { id: 6, name: "Align business unit sponsors on milestones", owner: "Business Unit Sponsors", priority: "Medium", duration: "5 minutes", phase: "Secondary" },
        { id: 7, name: "Schedule weekly coordination cadence", owner: "Transformation Lead", priority: "Medium", duration: "2 minutes", phase: "Secondary" },
        { id: 8, name: "Begin coordinated execution across all workstreams", owner: "All Leads", priority: "Critical", duration: "2 minutes", phase: "Follow-up" }
      ],
      preAuthorizedThresholds: [
        { decision: "Workstream resource allocation", limit: "Up to $1M per workstream without steering committee", approver: "CDO" },
        { decision: "Vendor and tool procurement", limit: "Pre-approved vendor list, up to $300K", approver: "IT Architecture Lead" },
        { decision: "Timeline adjustments", limit: "Up to 2-week shift without re-approval", approver: "Transformation Lead" }
      ],
      estimated_coordination_time: "12 minutes"
    };
  }

  return {
    name: `${incidentType || 'Crisis Response'} — Multi-Stakeholder Protocol`,
    code: "#SEC-001",
    domain: "defense",
    category: "DEFENSE",
    triggerConditions: [
      { condition: "Critical threat or incident detected", threshold: "Severity score > 85%" },
      { condition: "Multiple system alerts within 15 minutes", threshold: "> 3 correlated alerts" },
      { condition: "External report or notification received", threshold: "Any credible source" },
      { condition: "Stakeholder escalation request", threshold: "Director level or above" }
    ],
    raciMatrix: [
      { role: "Incident Commander", responsibility: "R", name: "[Assignee]", department: "Operations" },
      { role: "Chief Information Security Officer", responsibility: "A", name: "[Assignee]", department: "Security" },
      { role: "Communications Lead", responsibility: "R", name: "[Assignee]", department: "Corporate Communications" },
      { role: "Legal Counsel", responsibility: "C", name: "[Assignee]", department: "Legal" },
      { role: "Business Unit Lead", responsibility: "I", name: "[Assignee]", department: "Business Operations" },
      { role: "External Relations", responsibility: "C", name: "[Assignee]", department: "Public Relations" }
    ],
    stakeholders: [
      { role: "Incident Commander", responsibility: "R", name: "[Assignee]", department: "Operations" },
      { role: "Chief Information Security Officer", responsibility: "A", name: "[Assignee]", department: "Security" },
      { role: "Communications Lead", responsibility: "R", name: "[Assignee]", department: "Corporate Communications" },
      { role: "Legal Counsel", responsibility: "C", name: "[Assignee]", department: "Legal" },
      { role: "Business Unit Lead", responsibility: "I", name: "[Assignee]", department: "Business Operations" },
      { role: "External Relations", responsibility: "C", name: "[Assignee]", department: "Public Relations" }
    ],
    taskSequence: [
      { id: 1, name: "Activate incident response team", owner: "Incident Commander", priority: "Critical", duration: "2 minutes", phase: "Immediate" },
      { id: 2, name: "Notify all stakeholders via automated channels", owner: "System", priority: "Critical", duration: "1 minute", phase: "Immediate" },
      { id: 3, name: "Assess scope and severity", owner: "CISO", priority: "Critical", duration: "3 minutes", phase: "Immediate" },
      { id: 4, name: "Activate containment procedures", owner: "Incident Commander", priority: "High", duration: "5 minutes", phase: "Immediate" },
      { id: 5, name: "Prepare stakeholder communications", owner: "Communications Lead", priority: "High", duration: "5 minutes", phase: "Secondary" },
      { id: 6, name: "Engage external counsel if needed", owner: "Legal Counsel", priority: "Medium", duration: "10 minutes", phase: "Secondary" },
      { id: 7, name: "Document all actions and decisions", owner: "Incident Commander", priority: "Medium", duration: "Ongoing", phase: "Secondary" },
      { id: 8, name: "Schedule post-incident review", owner: "Incident Commander", priority: "Medium", duration: "5 minutes", phase: "Follow-up" }
    ],
    tasks: [
      { id: 1, name: "Activate incident response team", owner: "Incident Commander", priority: "Critical", duration: "2 minutes", phase: "Immediate" },
      { id: 2, name: "Notify all stakeholders via automated channels", owner: "System", priority: "Critical", duration: "1 minute", phase: "Immediate" },
      { id: 3, name: "Assess scope and severity", owner: "CISO", priority: "Critical", duration: "3 minutes", phase: "Immediate" },
      { id: 4, name: "Activate containment procedures", owner: "Incident Commander", priority: "High", duration: "5 minutes", phase: "Immediate" },
      { id: 5, name: "Prepare stakeholder communications", owner: "Communications Lead", priority: "High", duration: "5 minutes", phase: "Secondary" },
      { id: 6, name: "Engage external counsel if needed", owner: "Legal Counsel", priority: "Medium", duration: "10 minutes", phase: "Secondary" },
      { id: 7, name: "Document all actions and decisions", owner: "Incident Commander", priority: "Medium", duration: "Ongoing", phase: "Secondary" },
      { id: 8, name: "Schedule post-incident review", owner: "Incident Commander", priority: "Medium", duration: "5 minutes", phase: "Follow-up" }
    ],
    preAuthorizedThresholds: [
      { decision: "Authorize emergency spending", limit: "Up to $500K without board approval", approver: "CFO" },
      { decision: "Issue external communications", limit: "Pre-approved templates only", approver: "Communications Lead" },
      { decision: "Engage third-party specialists", limit: "Up to $200K", approver: "CISO" }
    ],
    estimated_coordination_time: "11 minutes"
  };
}

// Helper to get SendGrid client (reuse from pilot-routes pattern)
async function getSendGridClient() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken || !hostname) return null;

  try {
    const response = await fetch(
      'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=sendgrid',
      { headers: { 'Accept': 'application/json', 'X_REPLIT_TOKEN': xReplitToken } }
    );
    const data = await response.json();
    const connectionSettings = data.items?.[0];
    if (!connectionSettings?.settings?.api_key || !connectionSettings?.settings?.from_email) return null;
    sgMail.setApiKey(connectionSettings.settings.api_key);
    return { client: sgMail, fromEmail: connectionSettings.settings.from_email };
  } catch { return null; }
}

// Active simulations stored in memory for real-time updates
const activeSimulations = new Map<string, {
  status: string;
  stakeholders: Array<{ name: string; role: string; acknowledged: boolean; notifiedAt?: string; acknowledgedAt?: string }>;
  tasks: Array<{ name: string; owner: string; status: string; assignedAt?: string; completedAt?: string }>;
  elapsedSeconds: number;
  startedAt: string;
  intervalId?: NodeJS.Timeout;
}>();

// POST /api/incidents/analyze - Strategic Situation Analyzer (all 3 domains)
router.post('/analyze', async (req, res) => {
  try {
    const schema = z.object({
      description: z.string().min(20, 'Please describe the situation in more detail (at least 20 characters)'),
      domain: z.enum(['offense', 'defense', 'special_teams', 'auto']).default('auto'),
      companyName: z.string().optional(),
      email: z.union([z.string().email(), z.literal('')]).optional(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }

    const { description, domain, companyName, email } = parsed.data;

    const prompt = `You are an expert in enterprise strategic execution across three domains:
- OFFENSE (capturing opportunities): Market Entry, M&A, Product Launch, Geographic Expansion, Partnership Activation, IPO Readiness, Competitive Positioning
- DEFENSE (containing threats): Crisis Response, Ransomware, Data Breach, Product Recall, Supplier Failure, Regulatory Investigation, Executive Departure
- SPECIAL TEAMS (transformation initiatives): Digital Transformation, Competitive Response, AI Governance, Workforce Restructuring, Technology Migration, Cost Optimization

A Fortune 1000 executive has described a strategic situation. Analyze it and classify into the right domain.

${domain !== 'auto' ? `DOMAIN HINT: ${domain}` : 'AUTO-DETECT the domain from the description.'}

Return ONLY raw JSON (no markdown, no code fences):
{
  "domain": "offense or defense or special_teams",
  "domain_confidence": 0.95,
  "incident_type": "Specific type label like Market Entry Delay, Ransomware Attack, Digital Transformation Stall",
  "matched_playbook": {"code": "#MKT-001 or #SEC-001 or #TRN-001", "name": "Matched playbook name from 170 library", "exists_in_library": true},
  "severity": "critical or high or medium",
  "situation_summary": "2-3 sentence summary of what happened",
  "what_went_wrong": ["Array of 4-6 specific execution failures", "Be specific to their description"],
  "root_causes": [
    {"cause": "Root Cause Name", "description": "One sentence explanation"},
    {"cause": "Second Root Cause", "description": "Explanation"}
  ],
  "estimated_impact": "$X-YM estimated financial impact or opportunity cost",
  "time_to_coordination": "Time it actually took (extract from description or estimate)",
  "root_cause": "One-sentence root cause linking to execution gap",
  "your_reality": [
    {"time": "appropriate time unit", "description": "What happened at this point"}
  ],
  "with_executeiq": [
    {"time": "0:00", "description": "Trigger/signal detected, playbook activated"},
    {"time": "0:02", "description": "Stakeholders notified"},
    {"time": "0:05", "description": "Acknowledged and tasks assigned"},
    {"time": "0:08", "description": "Coordinated execution underway"},
    {"time": "0:11", "description": "Aligned and executing"},
    {"time": "Final", "description": "Outcome with ExecuteIQ"}
  ],
  "cost_without": "$XM - actual cost/loss/opportunity missed",
  "cost_with": "$XK - estimated cost with ExecuteIQ",
  "comparison_metrics": {
    "time_to_coordination": {"reality": "extracted timeline", "executeiq": "12 minutes"},
    "stakeholder_alignment": {"reality": "description", "executeiq": "Parallel in minutes"},
    "outcome": {"reality": "negative outcome", "executeiq": "positive outcome"}
  }
}

TIMELINE GUIDANCE by domain:
- OFFENSE: Use Week/Month units (Week 1, Month 3, Month 9) for your_reality
- DEFENSE: Use Hour units (Hour 1, Hour 8, Hour 24, Hour 72) for your_reality  
- SPECIAL TEAMS: Use Month units (Month 1, Month 6, Month 12, Month 18) for your_reality
- with_executeiq always uses minute units (0:00, 0:02, 0:05, etc.)

IMPORTANT: Make the analysis deeply specific to what they described. Reference their actual details.

Situation description: "${description}"`;

    let analysis;
    const aiResponse = await openAIService.analyzeText(prompt);
    
    try {
      const cleaned = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysis = JSON.parse(cleaned);
    } catch {
      const detectedDomain = domain !== 'auto' ? domain : detectDomain(description);
      analysis = getDomainFallback(detectedDomain, description);
    }

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store in database
    const [saved] = await db.insert(incidentAnalyses).values({
      sessionId,
      companyName: companyName || 'Your Company',
      incidentDescription: description,
      incidentType: analysis.incident_type,
      whatWentWrong: analysis.what_went_wrong,
      estimatedImpact: analysis.estimated_impact,
      timeToCoordination: analysis.time_to_coordination,
      rootCause: analysis.root_cause,
      yourReality: analysis.your_reality,
      withExecuteIQ: analysis.with_executeiq,
      costWithout: analysis.cost_without,
      costWith: analysis.cost_with,
      email: email || null,
    }).returning();

    res.json({ 
      id: saved.id,
      sessionId,
      analysis 
    });

  } catch (error: any) {
    console.error('[Incident Analysis] Error:', error.message);
    res.status(500).json({ error: 'Analysis failed. Please try again.' });
  }
});

// POST /api/incidents/generate-playbook
router.post('/generate-playbook', async (req, res) => {
  try {
    const schema = z.object({
      incidentId: z.string().uuid(),
      incidentType: z.string(),
      description: z.string(),
      whatWentWrong: z.array(z.string()),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }

    const { incidentId, incidentType, description, whatWentWrong } = parsed.data;

    const prompt = `You are an enterprise playbook architect for Fortune 1000 companies. Based on a real incident, generate a complete response playbook.

Return ONLY raw JSON (no markdown, no code fences) with this structure:
{
  "name": "Playbook name specific to this incident type (e.g., 'Ransomware Response — Multi-Site Protocol')",
  "code": "Domain code like #SEC-001, #CYB-003, #MNA-002, etc.",
  "domain": "Strategic domain (Crisis, Cyber, Regulatory, M&A, Market Entry, Product Launch, Digital Transformation, Competitive Response, AI Governance)",
  "category": "OFFENSE or DEFENSE or SPECIAL TEAMS",
  "triggers": [
    {"condition": "Specific trigger condition 1", "threshold": "When this metric/event exceeds this threshold"},
    {"condition": "Specific trigger condition 2", "threshold": "Measurement criteria"},
    {"condition": "Specific trigger condition 3", "threshold": "Detection criteria"},
    {"condition": "Specific trigger condition 4", "threshold": "Escalation criteria"}
  ],
  "stakeholders": [
    {"role": "Role title", "responsibility": "RACI designation (R/A/C/I)", "name": "[Assignee]", "department": "Department"},
    {"role": "Role title", "responsibility": "RACI designation", "name": "[Assignee]", "department": "Department"},
    {"role": "Role title", "responsibility": "RACI designation", "name": "[Assignee]", "department": "Department"},
    {"role": "Role title", "responsibility": "RACI designation", "name": "[Assignee]", "department": "Department"},
    {"role": "Role title", "responsibility": "RACI designation", "name": "[Assignee]", "department": "Department"},
    {"role": "Role title", "responsibility": "RACI designation", "name": "[Assignee]", "department": "Department"}
  ],
  "tasks": [
    {"id": 1, "name": "Task name", "owner": "Role title", "priority": "Critical/High/Medium", "duration": "X minutes", "phase": "Immediate/Secondary/Follow-up"},
    {"id": 2, "name": "Task name", "owner": "Role title", "priority": "Priority", "duration": "X minutes", "phase": "Phase"},
    {"id": 3, "name": "Task name", "owner": "Role title", "priority": "Priority", "duration": "X minutes", "phase": "Phase"},
    {"id": 4, "name": "Task name", "owner": "Role title", "priority": "Priority", "duration": "X minutes", "phase": "Phase"},
    {"id": 5, "name": "Task name", "owner": "Role title", "priority": "Priority", "duration": "X minutes", "phase": "Phase"},
    {"id": 6, "name": "Task name", "owner": "Role title", "priority": "Priority", "duration": "X minutes", "phase": "Phase"},
    {"id": 7, "name": "Task name", "owner": "Role title", "priority": "Priority", "duration": "X minutes", "phase": "Phase"},
    {"id": 8, "name": "Task name", "owner": "Role title", "priority": "Priority", "duration": "X minutes", "phase": "Phase"}
  ],
  "thresholds": [
    {"decision": "Pre-authorized decision 1", "limit": "$X or specific authority", "approver": "Role"},
    {"decision": "Pre-authorized decision 2", "limit": "$X or specific authority", "approver": "Role"},
    {"decision": "Pre-authorized decision 3", "limit": "$X or specific authority", "approver": "Role"}
  ],
  "estimated_coordination_time": "11-12 minutes"
}

Make this HIGHLY SPECIFIC to their incident. Reference their actual details.

Incident type: ${incidentType}
Description: ${description}
What went wrong: ${whatWentWrong.join('; ')}`;

    let playbook;
    const aiResponse = await openAIService.analyzeText(prompt);
    
    try {
      const cleaned = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleaned);
      playbook = {
        ...parsed,
        raciMatrix: parsed.raciMatrix || parsed.stakeholders,
        taskSequence: parsed.taskSequence || parsed.tasks,
        triggerConditions: parsed.triggerConditions || parsed.triggers,
        preAuthorizedThresholds: parsed.preAuthorizedThresholds || parsed.thresholds,
        stakeholders: parsed.stakeholders || parsed.raciMatrix,
        tasks: parsed.tasks || parsed.taskSequence,
      };
    } catch {
      playbook = getPlaybookFallback(incidentType, description);
    }

    // Update the incident analysis with the playbook
    await db.update(incidentAnalyses)
      .set({ generatedPlaybook: playbook })
      .where(eq(incidentAnalyses.id, incidentId));

    res.json({ playbook });

  } catch (error: any) {
    console.error('[Playbook Generation] Error:', error.message);
    res.status(500).json({ error: 'Playbook generation failed. Please try again.' });
  }
});

// POST /api/incidents/simulate
router.post('/simulate', async (req, res) => {
  try {
    const schema = z.object({
      incidentId: z.string().uuid(),
      playbook: z.any(),
      email: z.union([z.string().email(), z.literal('')]).optional(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }

    const { incidentId, playbook, email } = parsed.data;
    const simulationId = `sim_${Date.now()}`;

    const rawStakeholders = playbook.stakeholders || playbook.raciMatrix || [];
    const rawTasks = playbook.tasks || playbook.taskSequence || [];

    const stakeholders = rawStakeholders.map((s: any) => ({
      name: s.name || s.role,
      role: s.role,
      acknowledged: false,
      notifiedAt: null,
      acknowledgedAt: null,
    }));

    const tasks = rawTasks.map((t: any) => ({
      name: t.name || t.task || t.title,
      owner: t.owner,
      status: 'pending',
      assignedAt: null,
      completedAt: null,
    }));

    activeSimulations.set(simulationId, {
      status: 'running',
      stakeholders,
      tasks,
      elapsedSeconds: 0,
      startedAt: new Date().toISOString(),
    });

    // Send real email if provided
    if (email) {
      try {
        const sendgrid = await getSendGridClient();
        if (sendgrid) {
          const ackUrl = `${req.protocol}://${req.get('host')}/api/incidents/simulate/acknowledge?sim=${simulationId}&email=${encodeURIComponent(email)}`;
          await sendgrid.client.send({
            to: email,
            from: sendgrid.fromEmail,
            subject: `[ExecuteIQ] URGENT: ${playbook.name || 'Incident Response'} — Action Required`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 32px; border-radius: 12px;">
                <div style="text-align: center; margin-bottom: 24px;">
                  <h1 style="color: #14b8a6; margin: 0;">ExecuteIQ Alert</h1>
                  <p style="color: #94a3b8; margin-top: 8px;">Strategic Execution OS</p>
                </div>
                <div style="background: #1e293b; padding: 24px; border-radius: 8px; border-left: 4px solid #ef4444; margin-bottom: 24px;">
                  <h2 style="color: #f87171; margin-top: 0;">Playbook Activated: ${playbook.name || 'Incident Response'}</h2>
                  <p style="color: #cbd5e1;">You have been assigned as a key stakeholder. Your immediate acknowledgment is required.</p>
                  <p style="color: #94a3b8; font-size: 14px;">Simulation ID: ${simulationId}</p>
                </div>
                <div style="text-align: center; margin: 24px 0;">
                  <a href="${ackUrl}" style="background: #14b8a6; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">Acknowledge & Accept Assignment</a>
                </div>
                <p style="color: #64748b; font-size: 12px; text-align: center; margin-top: 24px;">This is a live simulation from ExecuteIQ. Your response updates the dashboard in real-time.</p>
              </div>
            `,
          });
        }
      } catch (emailErr) {
        console.error('[Simulation] Email send failed:', emailErr);
      }
    }

    // Auto-progress simulation over time
    let elapsed = 0;
    const interval = setInterval(() => {
      elapsed++;
      const sim = activeSimulations.get(simulationId);
      if (!sim) { clearInterval(interval); return; }
      
      sim.elapsedSeconds = elapsed;

      // Auto-notify stakeholders at 2s intervals
      const unnotified = sim.stakeholders.filter(s => !s.notifiedAt);
      if (elapsed >= 2 && unnotified.length > 0) {
        const toNotify = unnotified.slice(0, Math.ceil(elapsed / 2));
        toNotify.forEach(s => { s.notifiedAt = new Date().toISOString(); });
      }

      // Auto-acknowledge stakeholders (simulate unless real email)
      if (!email && elapsed >= 5) {
        const unacked = sim.stakeholders.filter(s => s.notifiedAt && !s.acknowledged);
        if (unacked.length > 0) {
          unacked[0].acknowledged = true;
          unacked[0].acknowledgedAt = new Date().toISOString();
        }
      }

      // Auto-progress tasks
      if (elapsed >= 3) {
        const pending = sim.tasks.filter(t => t.status === 'pending');
        if (pending.length > 0 && elapsed % 2 === 0) {
          pending[0].status = 'in_progress';
          pending[0].assignedAt = new Date().toISOString();
        }
      }
      if (elapsed >= 6) {
        const inProgress = sim.tasks.filter(t => t.status === 'in_progress');
        if (inProgress.length > 0) {
          inProgress[0].status = 'completed';
          inProgress[0].completedAt = new Date().toISOString();
        }
      }

      // Complete after ~45 seconds
      if (elapsed >= 45) {
        sim.stakeholders.forEach(s => { 
          if (!s.acknowledged) { s.acknowledged = true; s.acknowledgedAt = new Date().toISOString(); }
        });
        sim.tasks.forEach(t => { 
          if (t.status !== 'completed') { t.status = 'completed'; t.completedAt = new Date().toISOString(); }
        });
        sim.status = 'completed';
        clearInterval(interval);
      }

      activeSimulations.set(simulationId, sim);
    }, 1000);

    const simData = activeSimulations.get(simulationId);
    if (simData) simData.intervalId = interval;

    // Save simulation results reference
    await db.update(incidentAnalyses)
      .set({ simulationResults: { simulationId, startedAt: new Date().toISOString() } })
      .where(eq(incidentAnalyses.id, incidentId));

    res.json({ simulationId, status: 'running' });

  } catch (error: any) {
    console.error('[Simulation] Error:', error.message);
    res.status(500).json({ error: 'Simulation failed to start.' });
  }
});

// GET /api/incidents/simulate/status/:simulationId
router.get('/simulate/status/:simulationId', (req, res) => {
  const sim = activeSimulations.get(req.params.simulationId);
  if (!sim) {
    return res.status(404).json({ error: 'Simulation not found' });
  }
  res.json({
    status: sim.status,
    elapsedSeconds: sim.elapsedSeconds,
    stakeholders: sim.stakeholders,
    tasks: sim.tasks,
    startedAt: sim.startedAt,
  });
});

// GET /api/incidents/simulate/acknowledge
router.get('/simulate/acknowledge', (req, res) => {
  const { sim: simulationId, email } = req.query;
  if (!simulationId || typeof simulationId !== 'string') {
    return res.status(400).send('Invalid simulation');
  }

  const simulation = activeSimulations.get(simulationId);
  if (simulation) {
    const stakeholder = simulation.stakeholders.find(s => !s.acknowledged);
    if (stakeholder) {
      stakeholder.acknowledged = true;
      stakeholder.acknowledgedAt = new Date().toISOString();
    }
  }

  res.send(`
    <html>
    <head><title>ExecuteIQ - Acknowledged</title></head>
    <body style="background: #0f172a; color: white; font-family: Arial, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0;">
      <div style="text-align: center; max-width: 500px; padding: 40px;">
        <div style="font-size: 64px; margin-bottom: 16px;">✓</div>
        <h1 style="color: #14b8a6;">Assignment Acknowledged</h1>
        <p style="color: #94a3b8;">Your acknowledgment has been recorded. The ExecuteIQ dashboard has been updated in real-time.</p>
        <p style="color: #64748b; font-size: 14px; margin-top: 24px;">You can close this window and return to the simulation.</p>
      </div>
    </body>
    </html>
  `);
});

// POST /api/readiness/assess - Domain-aware readiness assessment
router.post('/assess', async (req, res) => {
  try {
    const schema = z.object({
      companyName: z.string().optional(),
      domain: z.enum(['offense', 'defense', 'special_teams']).default('defense'),
      answers: z.record(z.string()),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }

    const { companyName, domain, answers } = parsed.data;

    let score = 0;
    const gaps: string[] = [];
    const recommendations: string[] = [];

    if (domain === 'offense') {
      if (answers.coordinator && answers.coordinator.length > 3) { score += 20; }
      else { gaps.push("No designated coordinator for market opportunities"); recommendations.push("Designate a strategic opportunity coordinator with cross-functional authority"); }

      if (answers.speed === 'Under 1 week') score += 25;
      else if (answers.speed === '1-4 weeks') score += 20;
      else if (answers.speed === '1-3 months') score += 10;
      else if (answers.speed === '3-6 months') score += 5;
      else { gaps.push("Slow opportunity-to-decision cycle"); recommendations.push("Pre-authorize go/no-go thresholds to reduce decision latency"); }

      if (answers.spendingAuthority && answers.spendingAuthority.length > 3 && answers.spendingAuthority.toLowerCase() !== 'no one') {
        score += 20;
      } else { gaps.push("No pre-authorized market entry spending authority"); recommendations.push("Establish pre-authorized spending thresholds: $1M (VP Strategy), $5M (CFO), $10M+ (CEO)"); }

      if (answers.partners === 'Yes fully mapped') score += 20;
      else if (answers.partners === 'Partially') { score += 10; gaps.push("Partner/vendor network only partially pre-qualified"); }
      else { gaps.push("No pre-qualified partners or channels ready to activate"); recommendations.push("Build a pre-qualified partner network for rapid market entry deployment"); }

      if (answers.playbookLocation === "We don't have one") {
        gaps.push("No documented market entry playbook"); recommendations.push("Use ExecuteIQ's 58 Offense playbooks to build your market entry protocols");
      } else if (answers.playbookLocation) {
        score += 15;
        if (['Confluence/SharePoint', 'Spreadsheets'].includes(answers.playbookLocation)) {
          gaps.push("Playbook in static documents — not executable"); recommendations.push("Move to executable playbooks with automated triggers");
        }
      }
    } else if (domain === 'defense') {
      if (answers.firstNotified && answers.firstNotified.length > 3) { score += 20; }
      else { gaps.push("No clear incident owner identified"); recommendations.push("Designate a primary incident commander with 24/7 availability"); }

      if (answers.phoneNumber && /\d{7,}/.test(answers.phoneNumber.replace(/\D/g, ''))) { score += 15; }
      else { gaps.push("Direct contact information not readily available"); recommendations.push("Maintain an always-current emergency contact directory"); }

      if (answers.firstActions && answers.firstActions.length > 10) {
        const actionCount = answers.firstActions.split(/[,;.\n]/).filter((a: string) => a.trim().length > 2).length;
        score += Math.min(25, actionCount * 8);
        if (actionCount < 3) { gaps.push("Insufficient initial response actions defined"); recommendations.push("Pre-define at least 5 immediate response actions for each scenario type"); }
      } else { gaps.push("No documented initial response actions"); recommendations.push("Create step-by-step action checklists for your top 5 risk scenarios"); }

      if (answers.spendingAuthority && answers.spendingAuthority.length > 3) {
        if (/\$|budget|authority|approve/i.test(answers.spendingAuthority)) { score += 20; }
        else { score += 10; gaps.push("Spending authority not clearly defined with dollar thresholds"); recommendations.push("Set pre-authorized spending limits: $50K (Director), $250K (VP), $1M (C-Suite)"); }
      } else { gaps.push("No pre-authorized spending thresholds"); recommendations.push("Establish emergency spending authority without requiring a committee meeting"); }

      if (answers.playbookLocation === "We don't have one" || answers.playbookLocation === "Don't have one") {
        gaps.push("No documented response playbook exists"); recommendations.push("Use ExecuteIQ's 56 Defense playbooks to build your crisis response protocols");
      } else if (answers.playbookLocation) {
        score += 20;
        if (['Confluence/SharePoint', 'Spreadsheets', 'Confluence', 'SharePoint', 'Google Doc'].includes(answers.playbookLocation)) {
          gaps.push("Playbook stored in static documents — not executable"); recommendations.push("Move from static documents to executable playbooks");
        }
      }
    } else {
      if (answers.coordinator && answers.coordinator.length > 3) { score += 20; }
      else { gaps.push("No cross-functional coordination owner"); recommendations.push("Designate a Transformation Lead with authority to coordinate across business units"); }

      if (answers.alignmentSpeed === 'Under 1 week') score += 25;
      else if (answers.alignmentSpeed === '1-4 weeks') score += 20;
      else if (answers.alignmentSpeed === '1-3 months') score += 10;
      else if (answers.alignmentSpeed === '3-6 months') score += 5;
      else { gaps.push("Stakeholder alignment takes too long"); recommendations.push("Implement parallel coordination to reduce alignment time from months to minutes"); }

      if (answers.raciMatrices === 'Yes for all scenarios') score += 20;
      else if (answers.raciMatrices === 'Some scenarios') { score += 10; gaps.push("RACI matrices exist for some but not all scenarios"); }
      else { gaps.push("No pre-defined RACI matrices for transformation scenarios"); recommendations.push("Build RACI matrices for your top transformation scenarios using ExecuteIQ templates"); }

      if (answers.resourceAuthority && answers.resourceAuthority.length > 3 && !answers.resourceAuthority.toLowerCase().includes('steering committee')) {
        score += 20;
      } else { gaps.push("Resource reallocation requires steering committee approval"); recommendations.push("Pre-authorize resource reallocation up to 20% at the program lead level"); }

      if (answers.playbookLocation === "We don't have one") {
        gaps.push("No documented transformation playbook"); recommendations.push("Use ExecuteIQ's 52 Special Teams playbooks for transformation initiatives");
      } else if (answers.playbookLocation) {
        score += 15;
        if (['Confluence/SharePoint', 'Spreadsheets'].includes(answers.playbookLocation)) {
          gaps.push("Playbook in static documents — not executable"); recommendations.push("Move to executable playbooks with automated coordination");
        }
      }
    }

    score = Math.min(100, Math.max(0, score));
    const domainLabel = domain === 'offense' ? 'OFFENSE' : domain === 'defense' ? 'DEFENSE' : 'SPECIAL TEAMS';
    const benchmark = score < 30 ? `less prepared than 87% of enterprises in ${domainLabel}`
      : score < 50 ? `less prepared than 73% of enterprises in ${domainLabel}`
      : score < 70 ? `on par with 55% of enterprises in ${domainLabel}`
      : score < 85 ? `better prepared than 62% of enterprises in ${domainLabel}`
      : `in the top 15% of enterprise ${domainLabel} preparedness`;

    const sessionId = `readiness_${Date.now()}`;
    const [saved] = await db.insert(readinessAssessments).values({
      sessionId,
      companyName: companyName || 'Your Company',
      answers,
      score,
      gaps,
      benchmark,
      recommendations,
    }).returning();

    res.json({
      id: saved.id,
      domain,
      score,
      gaps,
      benchmark,
      recommendations,
    });

  } catch (error: any) {
    console.error('[Readiness Assessment] Error:', error.message);
    res.status(500).json({ error: 'Assessment failed.' });
  }
});

// POST /api/incidents/what-if
router.post('/what-if', async (req, res) => {
  try {
    const schema = z.object({
      incidentId: z.string().uuid().optional(),
      scenario: z.string().min(10),
      domain: z.enum(['offense', 'defense', 'special_teams']).optional(),
      playbook: z.any(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }

    const { incidentId, scenario, playbook, domain } = parsed.data;

    const domainContext = domain === 'offense'
      ? 'This is an OFFENSE scenario (market entry, M&A, product launch). Focus on speed-to-market, competitive advantage, and revenue impact.'
      : domain === 'defense'
      ? 'This is a DEFENSE scenario (crisis, cybersecurity, regulatory). Focus on containment speed, compliance deadlines, and damage mitigation.'
      : domain === 'special_teams'
      ? 'This is a SPECIAL TEAMS scenario (digital transformation, AI governance, competitive response). Focus on cross-functional coordination, change management, and organizational readiness.'
      : 'This is a strategic execution scenario. Determine the domain (offense, defense, or special teams) and analyze accordingly.';

    const prompt = `You are an enterprise strategic execution timing analyst for Fortune 1000 companies. ${domainContext}

Given a playbook that coordinates in ~12 minutes, analyze how a proposed modification would impact coordination time and strategic outcomes.

Return ONLY raw JSON (no markdown):
{
  "original_time": "12 minutes",
  "modified_time": "XX minutes",
  "impact": "+XX min delay (or 'No significant impact' or '-X min improvement')",
  "recommendation": "Recommended / Not recommended / Conditionally recommended — with a one-sentence explanation",
  "risk_assessment": "Brief assessment of risk tradeoffs",
  "domain": "${domain || 'auto-detect'}"
}

Current playbook: ${JSON.stringify(playbook?.name || 'Strategic Response Playbook')} with ${playbook?.tasks?.length || 8} tasks and ${playbook?.stakeholders?.length || 6} stakeholders.

Proposed modification: "${scenario}"`;

    let result;
    const aiResponse = await openAIService.analyzeText(prompt);
    
    try {
      const cleaned = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      result = JSON.parse(cleaned);
    } catch {
      result = {
        original_time: "12 minutes",
        modified_time: "35 minutes",
        impact: "+23 min delay",
        recommendation: "Not recommended. Adds significant delay with minimal risk reduction.",
        risk_assessment: "The proposed change introduces additional coordination overhead without proportional risk mitigation.",
        domain: domain || "strategic"
      };
    }

    if (incidentId) {
      await db.insert(whatIfRuns).values({
        incidentAnalysisId: incidentId,
        scenario,
        originalTime: result.original_time,
        modifiedTime: result.modified_time,
        impact: result.impact,
        recommendation: result.recommendation,
      });
    }

    res.json(result);

  } catch (error: any) {
    console.error('[What-If Analysis] Error:', error.message);
    res.status(500).json({ error: 'What-if analysis failed.' });
  }
});

// GET /api/incidents/:id
router.get('/:id', async (req, res) => {
  try {
    const [incident] = await db.select().from(incidentAnalyses).where(eq(incidentAnalyses.id, req.params.id));
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }
    res.json(incident);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch incident' });
  }
});

export default router;
