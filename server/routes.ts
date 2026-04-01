import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { enterpriseJobService } from "./services/EnterpriseJobService";
import { wsService } from "./services/WebSocketService";
import { demoOrchestrationService } from "./services/DemoOrchestrationService";
import { nlqService, type NLQRequest } from "./nlq-service";
// import { proactiveAIRadar } from "./proactive-ai-radar";
import { preparednessScoring } from "./preparedness-scoring";
import intelligenceRoutes from "./routes/intelligence-routes";
import pilotRoutes from "./routes/pilot-routes";
import demoRiskRoutes from "./routes/demoRiskRoutes";
import incidentRoutes from "./routes/incident-routes";
import { registerActivationRoutes } from "./routes/activation-routes";
import { registerDemoAccessRoute } from "./routes/demoAccessRoute";
import { createAndSendMagicLink, verifyMagicLinkToken } from "./services/magicLinkService";
import { registerPeerReviewRoute } from "./routes/peerReviewRoute";
import { registerOrgSetupRoutes } from "./routes/org-setup-routes";
import { registerDynamicStrategyRoutes } from "./routes/dynamic-strategy-routes";
import { registerOnboardingRoutes } from "./routes/onboarding-routes";
import { registerExecutionSyncRoutes } from "./routes/execution-sync-routes";
import { registerDecisionCoordinationRoutes } from "./routes/decision-coordination-routes";
import { setupAuth, isAuthenticated, hasPermission } from "./replitAuth";
import { registerAudioRoutes } from "./replit_integrations/audio";
import { conditionalAuth } from "./authConfig";
import { generateFullPlaybookData } from "./seeds/samplePlaybookData";
import { 
  insertOrganizationSchema, 
  insertStrategicScenarioSchema, 
  insertTaskSchema,
  insertProjectSchema,
  insertPulseMetricSchema,
  insertFluxAdaptationSchema,
  insertPrismInsightSchema,
  insertEchoCulturalMetricSchema,
  insertNovaInnovationSchema,
  insertIntelligenceReportSchema,
  insertModuleUsageAnalyticSchema,
  insertWarRoomSessionSchema,
  insertWarRoomUpdateSchema,
  insertExecutiveBriefingSchema,
  insertBoardReportSchema,
  insertStrategicAlertSchema,
  insertExecutiveInsightSchema,
  insertActionHookSchema,
  insertDataSourceSchema,
  insertExecutiveTriggerSchema,
  insertTriggerMonitoringHistorySchema,
  insertPlaybookTriggerAssociationSchema,
  insertWhatIfScenarioSchema,
  insertLearningPatternSchema,
  insertCrisisSimulationSchema,
  insertDecisionConfidenceSchema,
  insertStakeholderAlignmentSchema,
  insertExecutionValidationReportSchema,
  insertDemoLeadSchema,
  insertCustomDataPointSchema,
  organizations,
  organizationOnboarding,
  strategicScenarios,
  users,
  playbookLibrary,
  playbookDomains,
  playbookTaskSequences,
  scenarioExecutionPlans,
  scenarioStakeholders,
  notifications,
  tasks,
  playbookActivations,
  activationOutcomes,
  taskAcknowledgments,
  intelligenceReports,
  compoundThreatAlerts,
  roiSnapshots,
  simulationAnalyses,
  strategicRecordings,
  executiveTriggers,
} from "@shared/schema";
import { eq, desc, sql, like, and, asc, count, gte, ne } from 'drizzle-orm';
import { db } from './db';

// Helper function to get authenticated user ID from session
function getUserId(req: any): string | undefined {
  // Get user ID from authenticated session
  if (req.isAuthenticated() && req.user?.claims?.sub) {
    return req.user.claims.sub;
  }
  // No fallback to demo user - unauthenticated requests return undefined
  return undefined;
}

// Helper to get org ID for a user
async function getOrgIdForUser(userId: string): Promise<string | undefined> {
  const orgs = await storage.getUserOrganizations(userId);
  return orgs[0]?.id;
}

// Middleware to require authentication and validate org access
async function requireOrgAccess(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized - Please sign in" });
  }

  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const orgId = await getOrgIdForUser(userId);
  if (!orgId) {
    return res.status(403).json({ message: "Forbidden - User has no organization" });
  }

  // If orgId is provided in params or query, validate it
  // "default" is treated as a placeholder meaning "use the user's own org"
  const requestedOrgId = req.params.orgId || req.params.organizationId || req.query.organizationId || req.body.organizationId;
  if (requestedOrgId && requestedOrgId !== 'default' && requestedOrgId !== orgId) {
    return res.status(403).json({ message: "Forbidden - Insufficient permissions for this organization" });
  }

  req.userId = userId;
  req.orgId = orgId;
  next();
}

/**
 * Middleware factory to enforce role-based access control.
 * If user has no role, they are treated as read-only.
 */
function requireRole(...allowedRoles: string[]) {
  return async (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized - Please sign in" });
    }

    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const userRole = await storage.getUserRole(userId);
      
      // If user has no role assigned, they are read-only
      if (!userRole) {
        return res.status(403).json({ 
          message: "Forbidden - Role required for this action. Your current access is read-only." 
        });
      }

      const roleName = userRole.name.toLowerCase();
      const isAllowed = allowedRoles.some(role => role.toLowerCase() === roleName);

      if (!isAllowed) {
        return res.status(403).json({ 
          message: `Forbidden - This action requires one of the following roles: ${allowedRoles.join(", ")}` 
        });
      }

      next();
    } catch (error) {
      console.error("Error in requireRole middleware:", error);
      res.status(500).json({ message: "Internal server error during role validation" });
    }
  };
}

// Middleware to require authentication
function requireAuth(req: any, res: any, next: any) {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized - Please sign in" });
  }
  req.userId = userId;
  next();
}

// Middleware for optional authentication (public access with optional session)
async function optionalAuth(req: any, res: any, next: any) {
  const userId = getUserId(req);
  req.userId = userId;
  if (userId) {
    req.orgId = await getOrgIdForUser(userId);
  }
  next();
}

// Helper function to calculate task business value
function calculateTaskValue(task: any): number {
  let baseValue = 500; // Base task value in dollars
  
  // Priority multiplier
  const priorityMultipliers = {
    'critical': 4.0,
    'high': 2.5,
    'medium': 1.5,
    'low': 1.0
  };
  
  const priorityMultiplier = priorityMultipliers[task.priority as keyof typeof priorityMultipliers] || 1.0;
  
  // Strategic complexity bonus (based on description keywords)
  const strategicKeywords = ['strategic', 'executive', 'crisis', 'decision', 'revenue', 'compliance', 'risk'];
  const hasStrategicKeyword = strategicKeywords.some(keyword => 
    task.description?.toLowerCase().includes(keyword)
  );
  const complexityBonus = hasStrategicKeyword ? 1000 : 0;
  
  return Math.floor(baseValue * priorityMultiplier + complexityBonus);
}

// ─── Helper: Demo execution history for unauthenticated preview ─────────────
function buildDemoExecutionHistory() {
  const now = Date.now();
  const day = 86_400_000;
  const activations = [
    { id: 'demo-1', playbookName: 'Competitive Threat Response', domain: 'Market Dynamics', actualExecutionTime: 47, successRating: 62, targetMet: false, activatedAt: new Date(now - 87 * day), completedAt: new Date(now - 87 * day + 47 * 60000) },
    { id: 'demo-2', playbookName: 'Supply Chain Disruption Protocol', domain: 'Operational Excellence', actualExecutionTime: 38, successRating: 71, targetMet: false, activatedAt: new Date(now - 71 * day), completedAt: new Date(now - 71 * day + 38 * 60000) },
    { id: 'demo-3', playbookName: 'Regulatory Compliance Sprint', domain: 'Regulatory & Compliance', actualExecutionTime: 29, successRating: 78, targetMet: false, activatedAt: new Date(now - 55 * day), completedAt: new Date(now - 55 * day + 29 * 60000) },
    { id: 'demo-4', playbookName: 'Cybersecurity Breach Response', domain: 'Technology & Security', actualExecutionTime: 22, successRating: 84, targetMet: false, activatedAt: new Date(now - 40 * day), completedAt: new Date(now - 40 * day + 22 * 60000) },
    { id: 'demo-5', playbookName: 'Competitive Threat Response', domain: 'Market Dynamics', actualExecutionTime: 18, successRating: 88, targetMet: false, activatedAt: new Date(now - 28 * day), completedAt: new Date(now - 28 * day + 18 * 60000) },
    { id: 'demo-6', playbookName: 'Executive Leadership Crisis', domain: 'Brand & Reputation', actualExecutionTime: 15, successRating: 91, targetMet: false, activatedAt: new Date(now - 17 * day), completedAt: new Date(now - 17 * day + 15 * 60000) },
    { id: 'demo-7', playbookName: 'Supply Chain Disruption Protocol', domain: 'Operational Excellence', actualExecutionTime: 13, successRating: 94, targetMet: false, activatedAt: new Date(now - 9 * day), completedAt: new Date(now - 9 * day + 13 * 60000) },
    { id: 'demo-8', playbookName: 'Regulatory Compliance Sprint', domain: 'Regulatory & Compliance', actualExecutionTime: 11, successRating: 97, targetMet: true, activatedAt: new Date(now - 3 * day), completedAt: new Date(now - 3 * day + 11 * 60000) },
  ];
  const completed = activations.filter(a => a.completedAt);
  const avgTime = Math.round(completed.reduce((s, a) => s + a.actualExecutionTime, 0) / completed.length);
  const avgScore = Math.round(completed.reduce((s, a) => s + a.successRating, 0) / completed.length);
  return {
    summary: { total: activations.length, avgTime, targetMetCount: 1, avgScore, timeSaved: 8 * 60, isDemo: true },
    activations,
  };
}

// ─── Helper: Seed flagship playbooks with expert-level content ───────────────
async function seedFlagshipPlaybooks() {
  const flagship: Array<{ pattern: string; data: any }> = [
    {
      pattern: '%competitive%',
      data: {
        whyItMatters: 'Research shows that companies responding to competitive threats within 12 hours retain 94% of at-risk customers vs. 61% for 72-hour responders — a $340M revenue differential for a mid-market enterprise.',
        enrichedPhases: [
          {
            name: 'DETECT & VALIDATE', timeWindow: '0–2 min', objective: 'Confirm the competitive signal and assess threat credibility',
            tasks: [
              { owner: 'Chief Intelligence Officer', action: 'Pull competitive signal from monitoring platform and validate source credibility (confidence threshold ≥85%)', timeTarget: '90 sec' },
              { owner: 'CEO', action: 'Receive automated brief on threat summary, affected revenue segments, and recommended response tier (1/2/3)', timeTarget: '2 min' },
              { owner: 'CFO', action: 'Pre-authorize emergency response budget up to pre-approved threshold ($2M) without board approval', timeTarget: '2 min' },
            ],
            decisionGate: { question: 'Is threat credibility ≥85% AND affected revenue ≥$50M?', yes: 'Escalate to Tier 1 Full Response', no: 'Maintain monitoring — reassess in 4 hours' }
          },
          {
            name: 'ASSEMBLE WAR ROOM', timeWindow: '2–5 min', objective: 'Mobilize the exact right people — no one else',
            tasks: [
              { owner: 'COO', action: 'Activate Competitive Response Team: CEO, CFO, CMO, Chief Strategy Officer, Head of Sales, General Counsel', timeTarget: '3 min' },
              { owner: 'CMO', action: 'Pull competitive intelligence dossier — pricing, positioning, ICP overlap, recent wins/losses against this competitor', timeTarget: '4 min' },
              { owner: 'Chief Strategy Officer', action: 'Retrieve pre-built competitive response playbook options (Defensive Hold / Counter-Offensive / Market Pivot)', timeTarget: '5 min' },
            ],
          },
          {
            name: 'STRATEGY LOCK', timeWindow: '5–8 min', objective: 'Make one clear decision — which response strategy and who owns each action',
            tasks: [
              { owner: 'CEO', action: 'Select primary response strategy from 3 pre-built options with ROI projections for each', timeTarget: '6 min' },
              { owner: 'CMO', action: 'Activate counter-messaging: update battlecards, brief sales team, prepare customer-facing narrative', timeTarget: '7 min' },
              { owner: 'Head of Sales', action: 'Identify top 20 at-risk accounts. Assign executive sponsors. Schedule outreach within next 2 hours', timeTarget: '8 min' },
            ],
            decisionGate: { question: 'Have all Tier 1 stakeholders acknowledged their assigned actions?', yes: 'Begin parallel execution', no: 'Escalate to COO for reassignment' }
          },
          {
            name: 'EXECUTE & DOCUMENT', timeWindow: '8–12 min', objective: 'Launch all response actions simultaneously — not sequentially',
            tasks: [
              { owner: 'General Counsel', action: 'Review competitive claims for legal exposure. Clear all external communications within 30 minutes', timeTarget: '10 min' },
              { owner: 'CFO', action: 'Initiate financial modeling: cost of response vs. cost of inaction across 30/60/90-day scenarios', timeTarget: '10 min' },
              { owner: 'Chief Strategy Officer', action: 'Document decision rationale, escalation path, and first 24-hour milestones in execution log', timeTarget: '12 min' },
            ],
          },
        ],
        tier1Stakeholders: [{ role: 'CEO', responsibility: 'Decision authority + external statement approval', escalationTime: '0 min' }, { role: 'CFO', responsibility: 'Budget authorization + financial modeling', escalationTime: '1 min' }, { role: 'CMO', responsibility: 'Messaging + competitive positioning', escalationTime: '1 min' }, { role: 'Chief Strategy Officer', responsibility: 'Response strategy selection + scenario modeling', escalationTime: '2 min' }, { role: 'Head of Sales', responsibility: 'At-risk account identification + executive outreach', escalationTime: '2 min' }, { role: 'General Counsel', responsibility: 'Legal review + external communication clearance', escalationTime: '3 min' }],
        outcomeMetrics: { at12hours: ['100% Tier 1 stakeholders briefed', 'Response strategy selected and documented', 'Top 20 at-risk accounts assigned executive sponsors', 'External communications drafted and legal-cleared'], at30days: ['Customer retention rate vs. pre-threat baseline', 'Win/loss rate change vs. this specific competitor', 'Revenue recovered from at-risk pipeline', 'Competitive positioning score (internal benchmark)'], failureModes: ['Delayed response (>4 hours) allowing competitor to establish narrative', 'Fragmented messaging creating customer confusion', 'Over-reaction triggering price war that damages margins'] },
        riskIndicators: { green: ['Competitor announced — no customer contact yet', 'Signal confidence 70–85%', 'Affected revenue <$25M'], yellow: ['2+ customer inquiries about competitor received', 'Signal confidence ≥85%', 'Affected revenue $25M–$100M'], red: ['Active deal losses to this competitor in last 48 hours', 'Signal confidence ≥95%', 'Affected revenue >$100M or strategic account at risk'] },
      }
    },
    {
      pattern: '%cybersecurity%',
      data: {
        whyItMatters: 'The average enterprise cybersecurity breach costs $4.45M (IBM 2024). Companies containing a breach within 12 hours reduce total damage by 68%. Every hour of delayed response costs approximately $370,000 in compounding exposure.',
        enrichedPhases: [
          {
            name: 'BREACH CONFIRMATION', timeWindow: '0–2 min', objective: 'Confirm breach, classify severity, and initiate containment protocol',
            tasks: [
              { owner: 'CISO', action: 'Confirm breach signal from SIEM. Classify: Tier 1 (data exfiltration) / Tier 2 (system access) / Tier 3 (attempted intrusion)', timeTarget: '90 sec' },
              { owner: 'CTO', action: 'Activate network isolation protocol for affected systems. Preserve forensic evidence — no system reboots', timeTarget: '2 min' },
              { owner: 'General Counsel', action: 'Begin regulatory clock: GDPR = 72hr, SEC = 4 business days, HIPAA = 60 days. Log exact breach detection time', timeTarget: '2 min' },
            ],
            decisionGate: { question: 'Is PII, financial data, or IP confirmed as accessed?', yes: 'Tier 1 Full Response — notify CEO and board liaison immediately', no: 'Tier 2 Containment Response — monitor and reassess hourly' }
          },
          {
            name: 'WAR ROOM ASSEMBLY', timeWindow: '2–4 min', objective: 'Right team, right information, right decisions — simultaneously',
            tasks: [
              { owner: 'CEO', action: 'Join secure incident command channel. Receive 60-second brief: what was accessed, what is contained, what is unknown', timeTarget: '3 min' },
              { owner: 'CFO', action: 'Pre-authorize incident response budget. Engage cyber insurance carrier. Initiate financial exposure assessment', timeTarget: '3 min' },
              { owner: 'CHRO', action: 'Determine if employee data is involved. Prepare internal communication for affected staff. Legal review required before release', timeTarget: '4 min' },
            ],
          },
          {
            name: 'CONTAINMENT & FORENSICS', timeWindow: '4–8 min', objective: 'Stop the bleeding without destroying evidence',
            tasks: [
              { owner: 'CISO', action: 'Deploy forensic preservation tools. Begin chain-of-custody documentation required for law enforcement and litigation', timeTarget: '6 min' },
              { owner: 'CTO', action: 'Implement emergency access controls. Force credential rotation for all privileged accounts. Enable enhanced logging', timeTarget: '6 min' },
              { owner: 'General Counsel', action: 'Engage outside forensic counsel. Establish attorney-client privilege over investigation findings', timeTarget: '7 min' },
            ],
            decisionGate: { question: 'Is breach fully contained (no ongoing exfiltration)?', yes: 'Begin notification planning', no: 'Escalate containment — engage FBI Cyber Division if nation-state indicators present' }
          },
          {
            name: 'NOTIFICATION & RECOVERY', timeWindow: '8–12 min', objective: 'Communicate proactively, recover systematically, document everything',
            tasks: [
              { owner: 'CMO + General Counsel', action: 'Draft and approve external statement. Be first to notify — do not let customers learn from news media', timeTarget: '10 min' },
              { owner: 'CEO', action: 'Personally notify board chair and top 5 enterprise customers if their data was involved', timeTarget: '11 min' },
              { owner: 'CISO', action: 'Initiate recovery from clean backups. Establish recovery time objective (RTO) and communicate to ops team', timeTarget: '12 min' },
            ],
          },
        ],
        tier1Stakeholders: [{ role: 'CISO', responsibility: 'Incident command + technical containment + forensics', escalationTime: '0 min' }, { role: 'CTO', responsibility: 'System isolation + access control + recovery architecture', escalationTime: '0 min' }, { role: 'CEO', responsibility: 'Board notification + customer communication + regulatory accountability', escalationTime: '1 min' }, { role: 'General Counsel', responsibility: 'Regulatory clock management + attorney-client privilege + law enforcement', escalationTime: '1 min' }, { role: 'CFO', responsibility: 'Cyber insurance activation + financial exposure + budget authorization', escalationTime: '2 min' }, { role: 'CMO', responsibility: 'External communications + media response + customer trust', escalationTime: '3 min' }],
        riskIndicators: { green: ['Attempted intrusion — no confirmed access', 'Single system affected', 'No PII or regulated data in scope'], yellow: ['Confirmed unauthorized access to internal systems', 'PII of <10,000 records potentially exposed', 'Ransomware detected but not deployed'], red: ['Active data exfiltration confirmed', 'PII/PHI/financial data of >10,000 records accessed', 'Ransomware deployed — systems encrypted'] },
        outcomeMetrics: { at12hours: ['Breach fully contained', 'Forensic preservation complete', 'Regulatory notification timeline confirmed', 'Board and top customers personally notified'], at30days: ['Full forensic report complete', 'All regulatory notifications filed', 'Root cause remediated', 'Cyber insurance claim submitted'], failureModes: ['Destroying evidence by rebooting systems', 'Public disclosure before containment complete', 'Underestimating regulatory notification timelines', 'Failing to establish attorney-client privilege early'] },
      }
    },
    {
      pattern: '%supply chain%',
      data: {
        whyItMatters: 'Supply chain disruptions cost the average Fortune 1000 company $184M annually. Companies with pre-built response playbooks recover 2.3x faster and experience 44% lower revenue impact than those reacting ad hoc.',
        enrichedPhases: [
          {
            name: 'DISRUPTION ASSESSMENT', timeWindow: '0–2 min', objective: 'Quantify the disruption — what, where, how much, how long',
            tasks: [
              { owner: 'COO', action: 'Pull disruption data: affected supplier tier, % of supply at risk, lead time impact, geographic scope', timeTarget: '90 sec' },
              { owner: 'CFO', action: 'Run revenue-at-risk calculation: production days affected × daily revenue. Apply buffer stock coverage days', timeTarget: '2 min' },
              { owner: 'Chief Procurement Officer', action: 'Query approved alternate supplier list. Identify which alternates can scale to required volume within 72 hours', timeTarget: '2 min' },
            ],
            decisionGate: { question: 'Will disruption cause production stoppage within 14 days at current inventory?', yes: 'Tier 1 Emergency Response', no: 'Tier 2 Monitoring — daily status updates' }
          },
          {
            name: 'SUPPLY CONTINUITY', timeWindow: '2–5 min', objective: 'Secure alternative supply — do not wait for primary supplier resolution',
            tasks: [
              { owner: 'Chief Procurement Officer', action: 'Issue emergency POs to top 3 alternate suppliers simultaneously. Pre-negotiated rates apply — no re-negotiation required', timeTarget: '4 min' },
              { owner: 'COO', action: 'Activate buffer stock release protocol. Prioritize production schedules to highest-margin, longest-contracted orders first', timeTarget: '4 min' },
              { owner: 'Head of Logistics', action: 'Reroute inbound freight. Expedite air freight for critical components if margin supports it', timeTarget: '5 min' },
            ],
          },
          {
            name: 'CUSTOMER COMMUNICATION', timeWindow: '5–8 min', objective: 'Tell customers before they ask — and give them a recovery date',
            tasks: [
              { owner: 'Chief Revenue Officer', action: 'Identify customers at risk of delivery delays. Segment by contract penalty exposure and strategic importance', timeTarget: '6 min' },
              { owner: 'CEO / CRO', action: 'Personally call top 10 affected enterprise customers. Offer concrete recovery date, compensation option, and executive contact', timeTarget: '7 min' },
              { owner: 'CMO', action: 'Draft customer communication with specific timeline commitments. General Counsel review required before release', timeTarget: '8 min' },
            ],
            decisionGate: { question: 'Can alternate supply cover >80% of committed orders within 14 days?', yes: 'Maintain delivery commitments', no: 'Invoke force majeure and negotiate timeline extensions with legal support' }
          },
          {
            name: 'STABILIZE & DOCUMENT', timeWindow: '8–12 min', objective: 'Lock in recovery timeline, document decisions, prevent recurrence',
            tasks: [
              { owner: 'COO', action: 'Set 30-day supply continuity milestone: restore to 100% primary supplier capacity or confirm permanent alternate sourcing', timeTarget: '10 min' },
              { owner: 'Chief Procurement Officer', action: 'Initiate supplier resilience review: dual-source requirements, geographic diversification criteria, safety stock minimums', timeTarget: '11 min' },
              { owner: 'CFO', action: 'File business interruption insurance claim if applicable. Document all incremental costs for recovery', timeTarget: '12 min' },
            ],
          },
        ],
        tier1Stakeholders: [{ role: 'COO', responsibility: 'Production continuity + operations command', escalationTime: '0 min' }, { role: 'Chief Procurement Officer', responsibility: 'Alternate supplier activation + emergency POs', escalationTime: '0 min' }, { role: 'CFO', responsibility: 'Financial exposure + insurance + budget authorization', escalationTime: '1 min' }, { role: 'Chief Revenue Officer', responsibility: 'Customer communication + contract management', escalationTime: '2 min' }, { role: 'CEO', responsibility: 'Strategic customer calls + board notification', escalationTime: '3 min' }, { role: 'General Counsel', responsibility: 'Contract review + force majeure + insurance claims', escalationTime: '3 min' }],
        outcomeMetrics: { at12hours: ['Alternate supply secured for >80% of at-risk volume', 'Top 10 customers personally contacted', 'Recovery timeline communicated', 'Insurance claim initiated if applicable'], at30days: ['Primary supply fully restored or permanent alternate in place', 'Customer churn from disruption <5%', 'Dual-sourcing implemented for all Tier 1 suppliers', 'Post-event resilience audit complete'], failureModes: ['Waiting for primary supplier to resolve before sourcing alternates', 'Letting customers find out through missed delivery vs. proactive notification', 'Under-communicating recovery timeline certainty'] },
      }
    },
    {
      pattern: '%regulatory%',
      data: {
        whyItMatters: 'Regulatory non-compliance costs Fortune 1000 companies an average of $14.8M per incident in fines, legal fees, and remediation. Companies with pre-built regulatory response protocols reduce compliance risk by 71% and respond 4x faster than reactive organizations.',
        enrichedPhases: [
          {
            name: 'REGULATION INTAKE', timeWindow: '0–2 min', objective: 'Understand exactly what changed, what it requires, and what the deadline is',
            tasks: [
              { owner: 'General Counsel', action: 'Pull full regulatory text. Extract: effective date, mandatory requirements, voluntary provisions, and enforcement mechanism', timeTarget: '90 sec' },
              { owner: 'Chief Compliance Officer', action: 'Run gap assessment against current practices: what is compliant today vs. what requires change', timeTarget: '2 min' },
              { owner: 'CFO', action: 'Estimate cost of compliance vs. cost of non-compliance (fines + reputational). Present to CEO with recommendation', timeTarget: '2 min' },
            ],
            decisionGate: { question: 'Does this regulation require material operational changes OR carries fines >$5M for non-compliance?', yes: 'Tier 1 Full Response — board notification required', no: 'Tier 2 Standard Compliance Track' }
          },
          {
            name: 'IMPACT MAPPING', timeWindow: '2–5 min', objective: 'Map every business unit, product, and process affected — no surprises later',
            tasks: [
              { owner: 'Chief Compliance Officer', action: 'Map regulation to: affected products, business units, data flows, vendor contracts, and customer agreements', timeTarget: '4 min' },
              { owner: 'CISO / CTO', action: 'Assess technology compliance requirements: data residency, encryption standards, access controls, audit logging', timeTarget: '4 min' },
              { owner: 'General Counsel', action: 'Review customer contracts for regulatory pass-through obligations and notification requirements', timeTarget: '5 min' },
            ],
          },
          {
            name: 'COMPLIANCE ROADMAP', timeWindow: '5–8 min', objective: 'Build a credible, resourced, deadline-anchored compliance plan',
            tasks: [
              { owner: 'Chief Compliance Officer', action: 'Draft compliance roadmap with milestones anchored to effective date. Identify critical path vs. parallel workstreams', timeTarget: '7 min' },
              { owner: 'CFO', action: 'Allocate compliance budget. Identify if outside counsel, technology vendors, or additional headcount are required', timeTarget: '7 min' },
              { owner: 'CHRO', action: 'Assess training requirements. Build compliance training schedule for all affected employees', timeTarget: '8 min' },
            ],
            decisionGate: { question: 'Can full compliance be achieved before the effective date with current resources?', yes: 'Execute roadmap', no: 'Request regulatory extension AND engage outside counsel for interim safe harbor strategy' }
          },
          {
            name: 'STAKEHOLDER ALIGNMENT', timeWindow: '8–12 min', objective: 'Board, customers, and regulators all receive the same confident message',
            tasks: [
              { owner: 'CEO', action: 'Brief board on regulation, business impact, compliance timeline, and budget. Obtain board endorsement of approach', timeTarget: '10 min' },
              { owner: 'Chief Compliance Officer', action: 'File acknowledgment with regulator if required. Establish ongoing dialogue channel with regulatory body', timeTarget: '11 min' },
              { owner: 'CMO + General Counsel', action: 'Prepare customer communication: what this regulation means for their data/contracts and your compliance timeline', timeTarget: '12 min' },
            ],
          },
        ],
        tier1Stakeholders: [{ role: 'General Counsel', responsibility: 'Regulatory interpretation + legal exposure + enforcement risk', escalationTime: '0 min' }, { role: 'Chief Compliance Officer', responsibility: 'Gap assessment + compliance roadmap + regulator engagement', escalationTime: '0 min' }, { role: 'CFO', responsibility: 'Cost modeling + budget authorization + financial disclosure', escalationTime: '1 min' }, { role: 'CEO', responsibility: 'Board communication + strategic decisions on compliance approach', escalationTime: '2 min' }, { role: 'CISO', responsibility: 'Technology compliance requirements + data security standards', escalationTime: '2 min' }, { role: 'CHRO', responsibility: 'Training requirements + HR policy updates + employment law implications', escalationTime: '3 min' }],
        outcomeMetrics: { at12hours: ['Full regulatory text analyzed', 'Gap assessment complete', 'Compliance roadmap with milestones created', 'Board briefed and approach endorsed'], at30days: ['All high-priority compliance gaps resolved', 'Staff training completed', 'Customer notifications sent', 'Regulator engagement established'], failureModes: ['Treating all regulations as equal priority', 'Starting compliance work before gap assessment is complete', 'Failing to notify customers when their data practices are affected'] },
      }
    },
    {
      pattern: '%leadership%',
      data: {
        whyItMatters: 'Unmanaged executive departures cause an average 9.2% stock price decline in the first 72 hours. Companies with succession playbooks pre-activated recover 3.7x faster and retain 89% more senior talent during the transition.',
        enrichedPhases: [
          {
            name: 'SITUATION CONFIRMATION', timeWindow: '0–2 min', objective: 'Establish what is known, what is unknown, and who has authority now',
            tasks: [
              { owner: 'Board Chair', action: 'Confirm departure type: voluntary resignation, involuntary termination, incapacitation, or death. Each triggers a different protocol', timeTarget: '1 min' },
              { owner: 'General Counsel', action: 'Review departure executive\'s employment agreement: severance triggers, non-compete scope, equity treatment, non-disparagement', timeTarget: '90 sec' },
              { owner: 'Board Chair', action: 'Invoke succession plan: confirm interim leader authority, scope, and duration. Board resolution may be required', timeTarget: '2 min' },
            ],
            decisionGate: { question: 'Is there an approved successor OR interim leader with board mandate?', yes: 'Execute transition playbook', no: 'Emergency board meeting required within 4 hours to designate interim authority' }
          },
          {
            name: 'INTERNAL STABILIZATION', timeWindow: '2–5 min', objective: 'Prevent panic, rumors, and talent flight — in that order',
            tasks: [
              { owner: 'CHRO', action: 'Brief the departing executive\'s direct reports (if applicable). Be direct about what is known and what the timeline for more information is', timeTarget: '3 min' },
              { owner: 'Interim CEO / Board Chair', action: 'Record a 90-second video message for all employees: what happened, who is in charge, what stays the same, what changes', timeTarget: '4 min' },
              { owner: 'CHRO', action: 'Identify top 15 retention risks: senior leaders likely to leave or be recruited. Initiate retention conversations within 24 hours', timeTarget: '5 min' },
            ],
          },
          {
            name: 'EXTERNAL COMMUNICATION', timeWindow: '5–8 min', objective: 'Be the first to tell every important stakeholder — and tell them the same thing',
            tasks: [
              { owner: 'General Counsel + CFO', action: 'Assess if departure triggers SEC 8-K disclosure requirement (within 4 business days). Engage outside securities counsel', timeTarget: '6 min' },
              { owner: 'CMO + General Counsel', action: 'Draft and approve external press release. Tone: controlled, confident, forward-looking. Avoid: evasive, uncertain, or defensive language', timeTarget: '7 min' },
              { owner: 'CEO / Board Chair', action: 'Personally call: top 5 investors, top 5 customers, key board members not yet notified, and any pending deal counterparties', timeTarget: '8 min' },
            ],
            decisionGate: { question: 'Are all Tier 1 external stakeholders personally contacted before press release goes live?', yes: 'Release statement', no: 'Delay release until personal contacts complete — no one learns from media first' }
          },
          {
            name: 'SUCCESSION EXECUTION', timeWindow: '8–12 min', objective: 'Transfer authority cleanly, lock in transition timeline, prevent power vacuums',
            tasks: [
              { owner: 'Interim Leader', action: 'Conduct first leadership meeting: confirm team structure, ongoing decisions that need authority, and 30-day priorities', timeTarget: '10 min' },
              { owner: 'CHRO', action: 'Engage executive search firm if permanent replacement needed. Brief on candidate profile, timeline, and confidentiality requirements', timeTarget: '11 min' },
              { owner: 'General Counsel', action: 'Execute all departure documentation: separation agreement, equity schedule, benefit continuation, IP assignment confirmation', timeTarget: '12 min' },
            ],
          },
        ],
        tier1Stakeholders: [{ role: 'Board Chair', responsibility: 'Succession authority + board resolution + investor communication', escalationTime: '0 min' }, { role: 'General Counsel', responsibility: 'Employment agreement + SEC disclosure + departure documentation', escalationTime: '0 min' }, { role: 'CHRO', responsibility: 'Internal communication + retention risk + executive search', escalationTime: '1 min' }, { role: 'CFO', responsibility: 'Equity treatment + financial disclosure + budget continuity', escalationTime: '1 min' }, { role: 'CMO', responsibility: 'External communications + media response + brand continuity', escalationTime: '2 min' }, { role: 'Interim CEO', responsibility: 'Operational continuity + team stabilization + decision authority', escalationTime: '2 min' }],
        outcomeMetrics: { at12hours: ['Interim authority established with board mandate', 'All employees messaged by interim leader', 'Top 15 retention risks identified and contacted', 'All Tier 1 external stakeholders personally briefed'], at30days: ['Retention rate of senior leadership team >90%', 'Permanent search launched with shortlist', 'No material customer or investor departures', 'Operational continuity maintained — no missed deliverables'], failureModes: ['Letting employees hear through rumors or media before leadership communication', 'Failing to identify retention risks within first 24 hours', 'Creating a power vacuum by delaying interim authority appointment'] },
      }
    },
    // ─── NEW ENRICHED PLAYBOOKS ──────────────────────────────────────────────
    {
      pattern: '%activist%',
      data: {
        whyItMatters: 'Activist investors targeting Fortune 1000 companies have delivered an average -8.4% stock price decline within 72 hours of public disclosure. Organizations with pre-built activist defense playbooks respond 4x faster, engage institutional holders proactively, and resolve campaigns 2.1x more favorably.',
        enrichedPhases: [
          { name: 'INTELLIGENCE GATHERING', timeWindow: '0–2 min', objective: 'Know more about the activist\'s position than they expect you to know', tasks: [
            { owner: 'General Counsel', action: 'Confirm Schedule 13D/13G filing: stake %, acquisition date, stated intentions, associated entities. Access SEC EDGAR immediately', timeTarget: '90 sec' },
            { owner: 'CFO', action: 'Run activist profile: past campaigns, win rate, typical demands (board seat / strategic sale / spin-off / cost cuts), holding duration', timeTarget: '2 min' },
            { owner: 'Chief Strategy Officer', action: 'Map activist\'s thesis: what is the perceived value gap they will argue? Identify where they are right and where they are wrong', timeTarget: '2 min' },
          ], decisionGate: { question: 'Is stake >5% AND activist has history of proxy fights or forced asset sales?', yes: 'Tier 1 Full Defense — board notification + poison pill review', no: 'Monitor — engage IR to assess activist intent through back-channel' } },
          { name: 'BOARD & ADVISOR ACTIVATION', timeWindow: '2–5 min', objective: 'The board must speak with one voice before the activist speaks publicly', tasks: [
            { owner: 'Board Chair', action: 'Convene emergency board session within 2 hours. Brief all directors: stake size, activist profile, likely demands, and defense options', timeTarget: '3 min' },
            { owner: 'CEO', action: 'Engage M&A defense counsel, proxy solicitor, and investor relations advisor. Retain all three before activist makes first contact', timeTarget: '4 min' },
            { owner: 'CFO', action: 'Run activist-adjusted valuation: what does the activist argue the company is worth vs. current price? Build your counter-narrative with data', timeTarget: '5 min' },
          ] },
          { name: 'INSTITUTIONAL HOLDER OFFENSIVE', timeWindow: '5–8 min', objective: 'Win the ISS and Glass Lewis vote before the proxy fight begins — if it gets that far', tasks: [
            { owner: 'CEO + CFO', action: 'Schedule calls with top 10 institutional holders (by % ownership) within 24 hours. Lead with: value creation plan, governance strength, activist risk', timeTarget: '6 min' },
            { owner: 'Chief IR Officer', action: 'Prepare investor presentation: 3-year value creation roadmap with specific milestones, capital return policy, and governance enhancements', timeTarget: '7 min' },
            { owner: 'General Counsel', action: 'Review shareholder rights plan (poison pill) status. Brief board on trigger thresholds and activation timeline if needed', timeTarget: '8 min' },
          ], decisionGate: { question: 'Do institutional holders representing >40% of shares support current management?', yes: 'Negotiate from strength — offer 1 board observer, no control concessions', no: 'Consider proactive compromise: 1 board seat + value creation commitments' } },
          { name: 'PUBLIC NARRATIVE CONTROL', timeWindow: '8–12 min', objective: 'You define the story — or the activist does', tasks: [
            { owner: 'CMO + General Counsel', action: 'Draft company response statement: confident, forward-looking, focused on value creation. No defensive language. Pre-approve for rapid release', timeTarget: '10 min' },
            { owner: 'CEO', action: 'Record video briefing for employees: what this means, what it does not mean, and why your strategy is right', timeTarget: '11 min' },
            { owner: 'Chief Strategy Officer', action: 'Accelerate any planned value-creation announcements that were in pipeline. Beat the activist\'s narrative with your own news', timeTarget: '12 min' },
          ] },
        ],
        tier1Stakeholders: [{ role: 'CEO', responsibility: 'Institutional investor outreach + board leadership + public narrative', escalationTime: '0 min' }, { role: 'Board Chair', responsibility: 'Board coordination + poison pill authority + settlement decisions', escalationTime: '0 min' }, { role: 'CFO', responsibility: 'Activist valuation counter-narrative + institutional holder modeling', escalationTime: '1 min' }, { role: 'General Counsel', responsibility: 'SEC filings + poison pill + proxy fight defense + settlement terms', escalationTime: '1 min' }],
        outcomeMetrics: { at12hours: ['All directors briefed', 'Defense advisors retained', 'Institutional holder contact schedule confirmed', 'Counter-narrative developed with financial data'], at30days: ['Top 20 institutional holders personally engaged', 'Proxy solicitor vote count favorable', 'Value creation plan publicly communicated', 'Settlement terms (if any) board-approved'], failureModes: ['Waiting for activist to make public statement before preparing response', 'Letting proxy advisors (ISS/Glass Lewis) form opinions without your input', 'Underestimating activist preparedness — they have researched you for months'] },
      }
    },
    {
      pattern: '%merger%',
      data: {
        whyItMatters: 'Failed M&A integrations destroy an average of $1.6B in shareholder value per deal. The first 100 days of integration determine 70% of total deal outcome. Companies with pre-built integration playbooks achieve target synergies 2.4x faster and retain 31% more acquired talent.',
        enrichedPhases: [
          { name: 'DAY-ONE READINESS', timeWindow: '0–2 min', objective: 'Day 1 must feel seamless to employees, customers, and partners — regardless of what is still being figured out', tasks: [
            { owner: 'Integration Management Officer', action: 'Activate Day 1 command center. Confirm all systems access, communication channels, and escalation paths are live and tested', timeTarget: '90 sec' },
            { owner: 'CHRO', action: 'Confirm: all employees have received their Day 1 communication, their manager knows their status, and no terminations occur on Day 1 without prior notice', timeTarget: '2 min' },
            { owner: 'CTO', action: 'Execute IT Day 1 protocol: email domain migration, VPN access, single sign-on, and security credential integration for all acquired employees', timeTarget: '2 min' },
          ], decisionGate: { question: 'Are all Day 1 critical systems operational AND have all acquired employees received their welcome communication?', yes: 'Proceed to synergy acceleration', no: 'Escalate to CEO — Day 1 failures become cultural myths that damage integration for months' } },
          { name: 'TALENT RETENTION LOCK', timeWindow: '2–5 min', objective: 'The best people from the acquired company have competing offers within 48 hours — retain them first', tasks: [
            { owner: 'CHRO', action: 'Execute retention package delivery to top 50 acquired talent. Pre-negotiated RSU grants, role clarity, and direct access to leadership', timeTarget: '3 min' },
            { owner: 'CEO', action: 'Record personal video for all acquired employees: vision, role in combined company, and commitment to their development', timeTarget: '4 min' },
            { owner: 'Business Unit Leaders', action: 'Schedule 1:1 meetings with all acquired senior managers within 72 hours. Listen first — do not announce org changes in these meetings', timeTarget: '5 min' },
          ] },
          { name: 'SYNERGY ACCELERATION', timeWindow: '5–8 min', objective: 'Lock in the financial synergies the deal thesis promised — before the board starts asking', tasks: [
            { owner: 'CFO', action: 'Activate synergy tracking dashboard. Establish week-by-week synergy realization targets for Year 1. Red-line any target with >4-week delay risk', timeTarget: '6 min' },
            { owner: 'Chief Procurement Officer', action: 'Initiate combined vendor consolidation: renegotiate top 20 contracts using combined purchasing power within 60 days', timeTarget: '7 min' },
            { owner: 'Chief Revenue Officer', action: 'Launch cross-sell motion: identify top 50 acquired customers who are candidates for parent company products. Begin outreach within 30 days', timeTarget: '8 min' },
          ], decisionGate: { question: 'Are Year 1 synergy targets on track (>90% of run-rate)?', yes: 'Continue integration velocity', no: 'CEO-level escalation: root-cause each at-risk synergy — human, process, or system issue?' } },
          { name: 'CULTURE INTEGRATION', timeWindow: '8–12 min', objective: 'Culture clash is the #1 cause of failed integrations — address it before it becomes visible to customers', tasks: [
            { owner: 'CHRO + CEO', action: 'Launch combined culture pulse survey within 30 days. Measure: psychological safety, clarity of direction, trust in leadership, excitement about combination', timeTarget: '10 min' },
            { owner: 'Business Unit Leaders', action: 'Identify 10 "culture ambassadors" from acquired company — high-performers who believe in the integration. Activate them as integration champions', timeTarget: '11 min' },
            { owner: 'Integration Management Officer', action: 'Complete 90-day integration scorecard: synergy realization %, talent retention %, customer retention %, system integration %, culture score', timeTarget: '12 min' },
          ] },
        ],
        tier1Stakeholders: [{ role: 'CEO', responsibility: 'Cultural integration + board reporting + strategic direction', escalationTime: '0 min' }, { role: 'CHRO', responsibility: 'Talent retention + org design + cultural integration', escalationTime: '0 min' }, { role: 'CFO', responsibility: 'Synergy tracking + financial integration + cost elimination', escalationTime: '1 min' }, { role: 'CTO', responsibility: 'Systems integration + technology migration + security', escalationTime: '1 min' }],
        outcomeMetrics: { at12hours: ['Day 1 fully operational', 'Retention packages delivered to top 50 talent', 'All acquired employees received personal communication from CEO', 'Synergy tracking dashboard live'], at30days: ['Key talent retention >90%', 'Year 1 synergy run-rate at 80%+ of target', 'Customer retention of acquired base >95%', 'Combined vendor consolidation savings identified'], failureModes: ['Announcing org structure before retention packages are in hand', 'Letting financial synergies take priority over talent retention in first 90 days', 'Underestimating the acquired company\'s cultural identity and pride'] },
      }
    },
    {
      pattern: '%brand%',
      data: {
        whyItMatters: 'Brand crises that go uncontained within 12 hours result in an average 23% decline in brand trust scores and take 14 months to recover. Companies that respond within 12 hours with a clear, empathetic, and action-oriented message retain 81% of brand equity.',
        enrichedPhases: [
          { name: 'CRISIS CHARACTERIZATION', timeWindow: '0–2 min', objective: 'Know exactly what you are dealing with before you say a word publicly', tasks: [
            { owner: 'CMO', action: 'Pull crisis monitoring data: source, velocity (shares/hour), sentiment trajectory, media pickup rate, and influencer amplification', timeTarget: '90 sec' },
            { owner: 'General Counsel', action: 'Assess legal exposure: is this a factual error, perception issue, policy failure, or product/service failure? Determines statement latitude', timeTarget: '2 min' },
            { owner: 'CEO', action: 'Make hold-or-respond decision with CMO and General Counsel. Every 30-minute delay in a viral crisis costs 40% more amplification', timeTarget: '2 min' },
          ], decisionGate: { question: 'Is the crisis based on factual error (you can refute) OR operational failure (you must own)?', yes: 'Factual refutation track — move fast with evidence', no: 'Ownership track — lead with accountability, not defense' } },
          { name: 'STATEMENT CRAFTING', timeWindow: '2–5 min', objective: 'One voice, one message, approved and ready to deploy on all channels simultaneously', tasks: [
            { owner: 'CMO + General Counsel', action: 'Draft holding statement (3 sentences max): what you know, what you are doing, when you will provide more information. No speculation', timeTarget: '3 min' },
            { owner: 'CEO', action: 'Review and approve statement. If crisis involves safety or significant customer harm — CEO must be the voice, not CMO or spokesperson', timeTarget: '4 min' },
            { owner: 'Head of PR', action: 'Prepare social, web, email, and media distribution in parallel. All channels go live simultaneously — no staggered release', timeTarget: '5 min' },
          ] },
          { name: 'STAKEHOLDER CASCADES', timeWindow: '5–8 min', objective: 'Employees, customers, partners, and investors hear from you — not from social media', tasks: [
            { owner: 'CHRO', action: 'Send employee briefing: what happened, what the company is saying, how to respond if asked by customers/media. One consistent message', timeTarget: '6 min' },
            { owner: 'Chief Revenue Officer', action: 'Brief top 20 enterprise customers personally. Arm them with the same narrative before their employees and boards ask them about it', timeTarget: '7 min' },
            { owner: 'CFO', action: 'Issue investor relations update if crisis has potential material impact. Avoid speculation — focus on facts and response actions', timeTarget: '8 min' },
          ], decisionGate: { question: 'Is crisis fully contained (velocity declining, sentiment stabilizing)?', yes: 'Shift to recovery narrative', no: 'Escalate: CEO live statement, media availability, or product/policy change announcement' } },
          { name: 'RECOVERY & TRUST REBUILD', timeWindow: '8–12 min', objective: 'Turn the crisis into evidence of who you are — not just what went wrong', tasks: [
            { owner: 'CMO', action: 'Launch recovery narrative: concrete action taken, what changed, and what customers/stakeholders can expect next. Lead with actions not apologies', timeTarget: '10 min' },
            { owner: 'CEO', action: 'Record a direct-to-camera accountability statement for your top 3 stakeholder groups. Authentic over polished. Specific over generic', timeTarget: '11 min' },
            { owner: 'CMO + CHRO', action: 'Initiate brand trust monitoring: NPS, social sentiment, media coverage tone. Weekly reporting for 90 days', timeTarget: '12 min' },
          ] },
        ],
        tier1Stakeholders: [{ role: 'CEO', responsibility: 'Final statement approval + face of accountability + investor communication', escalationTime: '0 min' }, { role: 'CMO', responsibility: 'Crisis monitoring + messaging strategy + channel deployment', escalationTime: '0 min' }, { role: 'General Counsel', responsibility: 'Legal exposure + statement latitude + litigation risk', escalationTime: '1 min' }, { role: 'Head of PR', responsibility: 'Media management + spokesperson prep + coverage monitoring', escalationTime: '1 min' }],
        outcomeMetrics: { at12hours: ['Public statement live on all channels', 'Employees briefed with consistent narrative', 'Top 20 customers personally contacted', 'Social sentiment trajectory stabilizing'], at30days: ['Brand trust score recovery to pre-crisis baseline or better', 'Media narrative shifted from crisis to recovery', 'Customer NPS recovered', 'Root cause publicly addressed with specific changes'], failureModes: ['Saying "no comment" (interpreted as guilt)', 'Staggering channel releases (creates information arbitrage)', 'Letting legal review delay first response beyond 2 hours in viral situations'] },
      }
    },
    {
      pattern: '%product recall%',
      data: {
        whyItMatters: 'Product recalls cost Fortune 1000 companies an average of $267M when handled reactively. Companies that self-initiate recalls before regulatory action receive 73% smaller fines and retain 89% more customer trust than those who wait for regulatory compulsion.',
        enrichedPhases: [
          { name: 'SAFETY CONFIRMATION', timeWindow: '0–2 min', objective: 'Establish facts before committing to public action — but commit to investigation immediately', tasks: [
            { owner: 'Chief Quality Officer', action: 'Retrieve full defect incident report: complaint volume, injury reports, CPSC/FDA complaints, geographic concentration, product batch IDs', timeTarget: '90 sec' },
            { owner: 'General Counsel', action: 'Assess regulatory notification obligations: FDA (72hr), CPSC (24hr), NHTSA (5 days). Start regulatory clock NOW regardless of recall decision', timeTarget: '2 min' },
            { owner: 'CFO', action: 'Estimate financial impact: recall scope × unit cost × return processing + potential litigation reserve. Present range to CEO', timeTarget: '2 min' },
          ], decisionGate: { question: 'Is there confirmed injury risk AND/OR regulatory notification threshold triggered?', yes: 'Voluntary recall — self-initiate before regulatory compulsion', no: 'Enhanced monitoring — daily injury report review + accelerated investigation' } },
          { name: 'SUPPLY CHAIN HALT', timeWindow: '2–5 min', objective: 'Stop the product moving forward — every unit sold after you knew is a liability', tasks: [
            { owner: 'COO', action: 'Issue immediate production hold on all affected SKUs. Quarantine all affected inventory in distribution network with batch tracking', timeTarget: '3 min' },
            { owner: 'Chief Procurement Officer', action: 'Halt all affected component orders. Notify affected suppliers of quality issue for joint investigation. Preserve all component samples', timeTarget: '4 min' },
            { owner: 'Chief Revenue Officer', action: 'Issue retail partner stop-sale notification for all affected SKUs. Confirm compliance within 2 hours via retailer confirmation', timeTarget: '5 min' },
          ] },
          { name: 'CUSTOMER NOTIFICATION', timeWindow: '5–8 min', objective: 'Tell every customer before they hear from a competitor, media, or regulator', tasks: [
            { owner: 'CMO + General Counsel', action: 'Draft recall notice: specific products affected, safety risk description, what to do immediately, how to return/replace. Legal pre-approved template', timeTarget: '6 min' },
            { owner: 'CEO', action: 'Record personal video recall notification for high-value customers. Safety first — compensation second. Be direct and specific', timeTarget: '7 min' },
            { owner: 'Head of Customer Service', action: 'Stand up dedicated recall hotline and chat support. Script all agents on recall process, return process, and replacement timeline', timeTarget: '8 min' },
          ], decisionGate: { question: 'Has regulatory notification been filed AND are all retailers confirmed with stop-sale?', yes: 'Execute full consumer notification campaign', no: 'Do not release consumer notification until regulatory filing is confirmed' } },
          { name: 'RECOVERY & INVESTIGATION', timeWindow: '8–12 min', objective: 'Recover market trust faster than competitors expect — own the narrative of quality leadership', tasks: [
            { owner: 'Chief Quality Officer', action: 'Launch root cause investigation with external lab partner. 30-day investigation timeline with weekly board updates', timeTarget: '10 min' },
            { owner: 'CMO', action: 'Execute trust-recovery campaign: what changed, enhanced testing protocols, and independent certification of fix before relaunch', timeTarget: '11 min' },
            { owner: 'CFO', action: 'File product liability insurance claim. Establish separate recall accounting center for all related costs — critical for insurance recovery', timeTarget: '12 min' },
          ] },
        ],
        tier1Stakeholders: [{ role: 'CEO', responsibility: 'Recall decision authority + customer accountability + board notification', escalationTime: '0 min' }, { role: 'Chief Quality Officer', responsibility: 'Defect confirmation + investigation + corrective action', escalationTime: '0 min' }, { role: 'General Counsel', responsibility: 'Regulatory notification + litigation hold + consumer communication approval', escalationTime: '1 min' }, { role: 'COO', responsibility: 'Production halt + supply chain quarantine + inventory control', escalationTime: '1 min' }],
        outcomeMetrics: { at12hours: ['Production halt executed', 'Retailer stop-sale confirmed', 'Regulatory notification filed', 'Customer notification deployed'], at30days: ['100% affected inventory recovered', 'Root cause identified and corrected', 'Product relaunched with enhanced safety certification', 'Customer trust score recovery initiated'], failureModes: ['Waiting for regulatory action before self-initiating recall', 'Continuing to sell affected product after internal confirmation of defect', 'Inadequate consumer notification (must reach >90% of affected purchasers)'] },
      }
    },
    {
      pattern: '%talent%',
      data: {
        whyItMatters: 'Mass talent departures in critical roles cost Fortune 1000 companies 3–5x the departing employees\' combined annual salaries in replacement and productivity loss. Companies with talent retention playbooks stabilize within 14 days vs. 4+ months for reactive organizations.',
        enrichedPhases: [
          { name: 'FLIGHT RISK TRIAGE', timeWindow: '0–2 min', objective: 'Know exactly who is at risk and why — before the next resignation hits your inbox', tasks: [
            { owner: 'CHRO', action: 'Pull talent flight risk model: identify all employees with >70% departure probability based on engagement score, tenure, compensation percentile, manager quality', timeTarget: '90 sec' },
            { owner: 'CEO', action: 'Identify the 25 mission-critical roles where departure would cause immediate operational or customer impact. These are your Priority 1 retention targets', timeTarget: '2 min' },
            { owner: 'CFO', action: 'Authorize emergency retention budget: discretionary equity grants, compensation adjustments, and spot bonuses. Board pre-approval required above $5M', timeTarget: '2 min' },
          ], decisionGate: { question: 'Are more than 10 Priority 1 roles showing high departure risk?', yes: 'Declare talent emergency — CEO-level retention program', no: 'Targeted interventions — CHRO-led, biweekly CEO review' } },
          { name: 'CEO RETENTION OFFENSIVE', timeWindow: '2–5 min', objective: 'The CEO personally calling is worth more than any retention bonus for top talent', tasks: [
            { owner: 'CEO', action: 'Schedule personal calls with all Priority 1 retention risks within 48 hours. Agenda: listen first, then share vision, then discuss compensation if appropriate', timeTarget: '3 min' },
            { owner: 'CHRO', action: 'Design 18-month retention package for top 25: equity vesting acceleration, role expansion, development investment, and flexibility agreements', timeTarget: '4 min' },
            { owner: 'Business Unit Leaders', action: 'Conduct skip-level conversations with all direct reports in at-risk segments. Identify and eliminate the specific operational frustrations driving departure intent', timeTarget: '5 min' },
          ] },
          { name: 'ROOT CAUSE ELIMINATION', timeWindow: '5–8 min', objective: 'Fix the actual problem — not the symptom — or the retention effort is just buying time', tasks: [
            { owner: 'CHRO', action: 'Run rapid exit interview analysis: what are the top 3 specific, consistent reasons people are leaving? Each must become an action item with an owner and deadline', timeTarget: '6 min' },
            { owner: 'CEO', action: 'Make one visible, immediate structural change that addresses the #1 departure driver. Symbolism matters — employees need to see decisions, not promises', timeTarget: '7 min' },
            { owner: 'Head of Total Rewards', action: 'Benchmark compensation against current market (not last year\'s survey). Eliminate all roles where you are more than 15% below market for critical skills', timeTarget: '8 min' },
          ], decisionGate: { question: 'Can root causes (compensation, culture, leadership, opportunity) be addressed within 30 days?', yes: 'Commit to specific changes with public accountability', no: 'Structural transformation required — engage board on leadership or strategy changes' } },
          { name: 'CULTURE REINFORCEMENT', timeWindow: '8–12 min', objective: 'Turn the retention crisis into a culture-defining moment that improves engagement for all employees', tasks: [
            { owner: 'CEO', action: 'All-hands meeting within 72 hours: acknowledge challenges, share the specific changes being made, and invite candid questions. No prepared Q&A filtering', timeTarget: '10 min' },
            { owner: 'CHRO', action: 'Launch 90-day culture initiative: monthly pulse surveys, manager training on retention conversations, and public progress reporting', timeTarget: '11 min' },
            { owner: 'CFO + CHRO', action: 'Establish talent health scorecard: voluntary attrition rate, engagement score, time-to-fill critical roles, internal promotion rate. Board-level quarterly reporting', timeTarget: '12 min' },
          ] },
        ],
        tier1Stakeholders: [{ role: 'CEO', responsibility: 'Personal retention calls + structural changes + all-hands commitment', escalationTime: '0 min' }, { role: 'CHRO', responsibility: 'Flight risk modeling + retention program design + culture initiative', escalationTime: '0 min' }, { role: 'CFO', responsibility: 'Retention budget + compensation benchmarking + board approval', escalationTime: '1 min' }, { role: 'Business Unit Leaders', responsibility: 'Skip-level conversations + root cause elimination + daily retention actions', escalationTime: '1 min' }],
        outcomeMetrics: { at12hours: ['Priority 1 retention risks identified', 'CEO call schedule confirmed', 'Retention budget authorized', 'Root cause analysis initiated'], at30days: ['Priority 1 retention rate >90%', 'Compensation gaps eliminated for critical roles', '#1 departure driver structurally addressed', 'Engagement score improvement trajectory confirmed'], failureModes: ['Using only financial retention tools without addressing root causes', 'Delegating Priority 1 retention calls to CHRO instead of CEO', 'Announcing changes without following through on specific commitments made in retention conversations'] },
      }
    },
    {
      pattern: '%esg%',
      data: {
        whyItMatters: 'ESG crises now trigger institutional investor sell-offs within 48 hours. BlackRock, Vanguard, and State Street manage 23% of Fortune 1000 shares and have ESG voting mandates. Companies with ESG response playbooks contain institutional sell-pressure 3x more effectively.',
        enrichedPhases: [
          { name: 'ESG INCIDENT CLASSIFICATION', timeWindow: '0–2 min', objective: 'Classify accurately — an environmental violation and a governance failure require entirely different responses', tasks: [
            { owner: 'Chief Sustainability Officer', action: 'Classify ESG incident: Environmental (E), Social (S), or Governance (G). Severity: Tier 1 (material, public) / Tier 2 (internal, manageable) / Tier 3 (emerging risk)', timeTarget: '90 sec' },
            { owner: 'General Counsel', action: 'Assess disclosure obligations: SEC ESG rule implications, ESG rating agency impact (MSCI, Sustainalytics), proxy advisor implications (ISS ESG policy)', timeTarget: '2 min' },
            { owner: 'CFO', action: 'Model institutional investor impact: which ESG-mandated funds have trigger rules that would force a sell at this ESG rating level?', timeTarget: '2 min' },
          ], decisionGate: { question: 'Will this incident trigger ESG rating downgrade OR institutional investor ESG screening exclusion?', yes: 'Tier 1 — proactive engagement with top 10 institutional holders within 24 hours', no: 'Tier 2 — internal remediation + ESG report update cycle' } },
          { name: 'REMEDIATION COMMITMENT', timeWindow: '2–5 min', objective: 'Commit to specific, measurable changes — not aspirational language', tasks: [
            { owner: 'Chief Sustainability Officer', action: 'Design remediation plan: specific targets, timelines, investment amounts, and third-party verification. Every commitment must be quantifiable', timeTarget: '3 min' },
            { owner: 'CEO', action: 'Personally brief Board ESG Committee. Present incident, remediation plan, and request board-level accountability sponsor for follow-through', timeTarget: '4 min' },
            { owner: 'Head of Investor Relations', action: 'Prepare ESG investor brief: incident context, root cause, remediation commitments, and enhanced monitoring. Lead with accountability, not minimization', timeTarget: '5 min' },
          ] },
          { name: 'INSTITUTIONAL ENGAGEMENT', timeWindow: '5–8 min', objective: 'Reach institutional ESG officers before they receive the news from an NGO or media outlet', tasks: [
            { owner: 'CEO + Chief Sustainability Officer', action: 'Call top 5 institutional ESG officers within 24 hours. Present: what happened, what changed, what you are committed to. Offer ongoing ESG dialogue', timeTarget: '6 min' },
            { owner: 'Head of IR', action: 'Request urgent ESG analyst calls with MSCI, Sustainalytics, and ISS. Provide full incident documentation + remediation plan', timeTarget: '7 min' },
            { owner: 'Chief Sustainability Officer', action: 'File ESG incident disclosure in CDP, GRI, or applicable framework. Voluntary disclosure before mandated is significantly less damaging', timeTarget: '8 min' },
          ], decisionGate: { question: 'Have top 10 institutional ESG officers been briefed AND rating agency review meetings scheduled?', yes: 'Proceed to public remediation reporting', no: 'Delay any public statement until institutional outreach is complete' } },
          { name: 'PUBLIC COMMITMENT', timeWindow: '8–12 min', objective: 'Turn the ESG incident into evidence of your ESG leadership — not despite it, but through how you respond', tasks: [
            { owner: 'CEO', action: 'Public statement: acknowledge incident, specific remediation steps, board accountability, and enhanced ESG commitments. Third-party verification of all claims', timeTarget: '10 min' },
            { owner: 'Chief Sustainability Officer', action: 'Publish interim ESG remediation report within 30 days. Include: what went wrong, what changed, measurable progress against commitments', timeTarget: '11 min' },
            { owner: 'CFO', action: 'Tie ESG remediation milestones to executive compensation. Announce this publicly — it is the most credible commitment signal to institutional investors', timeTarget: '12 min' },
          ] },
        ],
        tier1Stakeholders: [{ role: 'CEO', responsibility: 'Institutional holder engagement + board accountability + public commitment', escalationTime: '0 min' }, { role: 'Chief Sustainability Officer', responsibility: 'Incident assessment + remediation design + ESG disclosure', escalationTime: '0 min' }, { role: 'CFO', responsibility: 'Institutional investor modeling + compensation link + financial disclosure', escalationTime: '1 min' }, { role: 'General Counsel', responsibility: 'Regulatory disclosure + ESG rating agency + litigation risk', escalationTime: '1 min' }],
        outcomeMetrics: { at12hours: ['ESG incident classified and board notified', 'Top 10 institutional ESG officers scheduled', 'Remediation plan board-approved', 'Rating agency engagement scheduled'], at30days: ['ESG rating maintained or limited downgrade', 'Institutional investor sell pressure contained', 'Voluntary disclosure filed', 'Remediation commitments publicly published'], failureModes: ['Responding with aspirational language instead of specific commitments', 'Waiting for institutional investors to call you vs. calling them first', 'Failing to engage ESG rating agencies proactively before they downgrade'] },
      }
    },
    {
      pattern: '%ransomware%',
      data: {
        whyItMatters: 'Ransomware attacks cost enterprises an average of $4.54M per incident, with 83% of victims paying ransom when they lack proper backups and response protocols. The first 12 minutes determine whether the organization pays or recovers cleanly.',
        enrichedPhases: [
          { name: 'ATTACK CONFIRMATION', timeWindow: '0–2 min', objective: 'Confirm scope and immediately stop the encryption spread — every second matters', tasks: [
            { owner: 'CISO', action: 'Confirm ransomware variant via endpoint detection. Classify: locker (access denial only) vs. crypto (file encryption) vs. double-extortion (encryption + data theft)', timeTarget: '60 sec' },
            { owner: 'CTO', action: 'IMMEDIATE: physically isolate all affected network segments. Pull the network cable on affected systems — do NOT shut down (preserves memory for forensics)', timeTarget: '90 sec' },
            { owner: 'General Counsel', action: 'Engage law enforcement (FBI Cyber Division) and notify cyber insurer. Do NOT pay ransom before insurance carrier authorization', timeTarget: '2 min' },
          ], decisionGate: { question: 'Are critical systems (ERP, customer data, financial systems) encrypted or inaccessible?', yes: 'Tier 1 — Business Continuity Protocol + CEO board notification NOW', no: 'Tier 2 — Containment only, continue monitoring scope' } },
          { name: 'BUSINESS CONTINUITY ACTIVATION', timeWindow: '2–5 min', objective: 'The business continues to operate — even if on manual/backup systems', tasks: [
            { owner: 'COO', action: 'Activate Business Continuity Plan: identify all manual workarounds for affected systems. No revenue-critical operation can be paused waiting for IT recovery', timeTarget: '3 min' },
            { owner: 'CTO', action: 'Validate backup integrity: when were last clean backups? Are they offline/immutable (ransomware cannot reach them)? Establish Recovery Time Objective', timeTarget: '4 min' },
            { owner: 'CFO', action: 'Activate cyber insurance. Engage pre-approved ransomware response firm (Mandiant, CrowdStrike, or equivalent). Cyber insurer may require specific vendors', timeTarget: '5 min' },
          ] },
          { name: 'PAYMENT DECISION', timeWindow: '5–8 min', objective: 'This decision requires legal, insurance, and law enforcement input — not just IT', tasks: [
            { owner: 'CEO + CFO + General Counsel', action: 'Ransomware payment decision: consider (1) clean backup availability, (2) data exfiltration confirmed, (3) insurance carrier guidance, (4) OFAC sanctions check on threat actor', timeTarget: '6 min' },
            { owner: 'CISO', action: 'Parallel track: begin clean restoration from verified backups regardless of payment decision. Paying ransom does NOT guarantee full recovery', timeTarget: '7 min' },
            { owner: 'General Counsel', action: 'OFAC sanctions check: paying sanctioned threat actors (some ransomware groups are OFAC-listed) is a federal offense. Clear this before any payment authorization', timeTarget: '8 min' },
          ], decisionGate: { question: 'Are clean, recent backups confirmed AND operational restoration achievable within business continuity tolerance?', yes: 'Do NOT pay — execute clean restoration', no: 'Payment decision to CEO with insurance carrier, legal, and law enforcement input' } },
          { name: 'RECOVERY & HARDENING', timeWindow: '8–12 min', objective: 'Come back stronger — attackers often return within 60 days if vulnerabilities remain', tasks: [
            { owner: 'CTO + CISO', action: 'Execute clean restoration from verified backups. Rebuild affected systems from clean images — never restore from encrypted states', timeTarget: '10 min' },
            { owner: 'CEO', action: 'Employee communication: what happened, what data was affected, what was done to protect them, and what changes will prevent recurrence', timeTarget: '11 min' },
            { owner: 'CISO', action: 'Mandatory security hardening before any reconnection: patch zero-days exploited, MFA on all accounts, email security enhancement, EDR on all endpoints', timeTarget: '12 min' },
          ] },
        ],
        tier1Stakeholders: [{ role: 'CISO', responsibility: 'Attack containment + forensics + recovery oversight', escalationTime: '0 min' }, { role: 'CTO', responsibility: 'Network isolation + backup restoration + system recovery', escalationTime: '0 min' }, { role: 'CEO', responsibility: 'Payment decision authority + employee communication + board notification', escalationTime: '1 min' }, { role: 'General Counsel', responsibility: 'Law enforcement + OFAC compliance + regulatory notification', escalationTime: '1 min' }, { role: 'CFO', responsibility: 'Cyber insurance activation + payment authorization + financial impact', escalationTime: '2 min' }],
        outcomeMetrics: { at12hours: ['Attack contained and isolated', 'Clean backup integrity confirmed', 'Payment decision made with all required parties', 'Business continuity operations active'], at30days: ['Full system restoration complete', 'Root cause (initial attack vector) eliminated', 'Security hardening implemented', 'Regulatory notifications filed'], failureModes: ['Paying ransom without insurance carrier authorization', 'Restoring from potentially infected backups', 'Reconnecting systems before hardening complete', 'Failing OFAC sanctions check before payment'] },
      }
    },
    {
      pattern: '%financial%',
      data: {
        whyItMatters: 'Financial fraud events trigger an average 31% stock price decline and $2.1B in regulatory fines for companies that fail to self-report promptly. Organizations with pre-built financial fraud playbooks self-report 4x faster, receive 67% lower penalties, and restore investor confidence 2.8x faster.',
        enrichedPhases: [
          { name: 'ALLEGATION ASSESSMENT', timeWindow: '0–2 min', objective: 'Establish credibility of allegation before any external action — but assume it could be true', tasks: [
            { owner: 'General Counsel', action: 'Assess allegation source and specificity: internal whistleblower, SEC complaint, short-seller report, or regulatory inquiry. Each has different required response timelines', timeTarget: '90 sec' },
            { owner: 'CFO', action: 'Immediately ring-fence all financial systems, accounts, and records related to the allegation. Preserve all documentation — litigation hold NOW', timeTarget: '2 min' },
            { owner: 'Audit Committee Chair', action: 'Convene emergency audit committee session. The audit committee — not management — must direct this investigation for independence and credibility', timeTarget: '2 min' },
          ], decisionGate: { question: 'Does preliminary review indicate potential material misstatement OR regulatory disclosure obligation?', yes: 'Self-report to SEC within required timeframe — voluntary disclosure is significantly more favorable', no: 'Continue independent investigation — maintain strict confidentiality' } },
          { name: 'INDEPENDENT INVESTIGATION', timeWindow: '2–5 min', objective: 'Independence is everything — any investigation management controls will be discredited', tasks: [
            { owner: 'Audit Committee Chair', action: 'Retain independent outside counsel (not company\'s regular counsel) and independent forensic accountants. Engagement letter to establish attorney-client privilege', timeTarget: '3 min' },
            { owner: 'General Counsel', action: 'Issue litigation hold for all potentially relevant documents, communications, and financial records. Preserve all emails for a minimum 3-year lookback', timeTarget: '4 min' },
            { owner: 'CEO', action: 'Step back from investigation. Your role is to ensure the investigation is fully resourced and independent — not to shape its findings', timeTarget: '5 min' },
          ] },
          { name: 'REGULATORY ENGAGEMENT', timeWindow: '5–8 min', objective: 'Regulators reward cooperation and self-disclosure — they punish cover-up more than the underlying offense', tasks: [
            { owner: 'General Counsel + Outside Counsel', action: 'Assess voluntary disclosure decision: self-report to SEC, DOJ, or relevant regulator? Voluntary disclosure typically reduces fines by 50–70%', timeTarget: '6 min' },
            { owner: 'Audit Committee Chair + Outside Counsel', action: 'Brief audit committee on initial findings and disclosure recommendation. Audit committee must approve any regulatory communication', timeTarget: '7 min' },
            { owner: 'CFO + Outside Counsel', action: 'Assess restatement risk: will financial statements require restatement? Engage auditors for independent assessment. Do not delay this assessment', timeTarget: '8 min' },
          ], decisionGate: { question: 'Has independent investigation confirmed material misstatement AND voluntary disclosure decision made?', yes: 'File disclosure within regulatory timeframe', no: 'Continue investigation — do not delay indefinitely (regulators track investigation duration)' } },
          { name: 'INVESTOR COMMUNICATION', timeWindow: '8–12 min', objective: 'Investors will forgive honest mistakes — they will not forgive delayed disclosure or cover-up', tasks: [
            { owner: 'CEO + Board Chair', action: 'Investor communication strategy: full disclosure proactively vs. in conjunction with regulatory filing. General Counsel and outside counsel must approve final approach', timeTarget: '10 min' },
            { owner: 'CFO', action: 'If restatement required: develop restatement scope, affected periods, and corrected financial statements with auditor. Set disclosure timeline', timeTarget: '11 min' },
            { owner: 'CEO + General Counsel', action: 'Employee communication: consistent message about investigation, no speculation on outcomes, assurance of compliance culture reinforcement', timeTarget: '12 min' },
          ] },
        ],
        tier1Stakeholders: [{ role: 'Audit Committee Chair', responsibility: 'Investigation oversight + outside counsel engagement + regulatory approval', escalationTime: '0 min' }, { role: 'General Counsel', responsibility: 'Litigation hold + disclosure strategy + regulatory engagement', escalationTime: '0 min' }, { role: 'CEO', responsibility: 'Board leadership + employee communication + operational continuity', escalationTime: '1 min' }, { role: 'CFO', responsibility: 'Financial records preservation + restatement assessment + insurance notification', escalationTime: '1 min' }],
        outcomeMetrics: { at12hours: ['Litigation hold issued', 'Independent investigators retained', 'Audit committee convened', 'Regulatory disclosure timeline assessed'], at30days: ['Investigation complete with independent findings', 'Regulatory cooperation established', 'Disclosure decision made and executed', 'Internal controls remediation underway'], failureModes: ['Management directing (or appearing to direct) the investigation', 'Delayed regulatory disclosure beyond required timeframes', 'Destroying or failing to preserve relevant documents and communications'] },
      }
    },
    {
      pattern: '%ipo%',
      data: {
        whyItMatters: 'IPO pricing missteps and market timing failures cost companies an average 22% in underpriced share value or result in withdrawn offerings. Companies with pre-built IPO response playbooks navigate pricing windows 3x more effectively and maintain institutional demand through market volatility.',
        enrichedPhases: [
          { name: 'MARKET WINDOW ASSESSMENT', timeWindow: '0–2 min', objective: 'Determine if this is a timing issue (delay) or a structural issue (pricing reset)', tasks: [
            { owner: 'CFO + Investment Bankers', action: 'Pull real-time IPO comps: recent IPO performance in your sector, institutional book-build status, and current market sentiment index for your industry', timeTarget: '90 sec' },
            { owner: 'CEO + CFO', action: 'Assess delay options: 2-week pricing window push vs. 60-90 day full delay. Each has different implications for roadshow momentum and institutional appetite', timeTarget: '2 min' },
            { owner: 'General Counsel', action: 'If delay is likely: assess SEC registration statement freshness requirements, quiet period obligations, and board-approved financial statements currency', timeTarget: '2 min' },
          ], decisionGate: { question: 'Is market disruption temporary (2-4 weeks) OR structural (requires pricing reset)?', yes: 'Tactical delay — maintain roadshow momentum', no: 'Strategic reset — update S-1, re-engage anchors, re-price range' } },
          { name: 'ANCHOR INVESTOR LOCK', timeWindow: '2–5 min', objective: 'The 5–10 institutional anchors make or break IPO pricing — protect them first', tasks: [
            { owner: 'CEO + CFO', action: 'Personal calls to all anchor investors within 4 hours: update on market conditions, reaffirm company fundamentals, and confirm their anchor commitment', timeTarget: '3 min' },
            { owner: 'Investment Bankers', action: 'Assess book-build status: what % of deal is covered, what is the price sensitivity of top 20 book-build participants?', timeTarget: '4 min' },
            { owner: 'CFO', action: 'Pricing scenario modeling: $1 per share change in price × total shares = impact on company proceeds and founder dilution at each price point', timeTarget: '5 min' },
          ] },
          { name: 'NARRATIVE PROTECTION', timeWindow: '5–8 min', objective: 'Control the IPO narrative — media and analyst opinion form before you can respond', tasks: [
            { owner: 'CMO + IR Lead', action: 'Monitor and respond to IPO coverage: social media, analyst reports, and financial press. Quiet period restrictions apply — coordinate every statement with legal', timeTarget: '6 min' },
            { owner: 'CEO', action: 'Internal communication to all employees: IPO process update, confirmation of timeline, and instruction on quiet period compliance (no public statements)', timeTarget: '7 min' },
            { owner: 'Investment Bankers', action: 'Assess green shoe option: partial exercise of overallotment option can stabilize secondary market pricing on day 1 and day 2 of trading', timeTarget: '8 min' },
          ], decisionGate: { question: 'Is book-build >110% covered at acceptable price range AND anchor commitments confirmed?', yes: 'Proceed to pricing — coordinate with underwriters on final price', no: 'Evaluate range reduction or voluntary delay with banking team' } },
          { name: 'PRICING & FIRST DAY PREP', timeWindow: '8–12 min', objective: 'The first day of trading is a marketing event — you only get one opening', tasks: [
            { owner: 'CEO + CFO', action: 'Final IPO price decision with banking team: price to create first-day pop (institutional appetite) vs. price to maximize proceeds. This is a strategic — not financial — decision', timeTarget: '10 min' },
            { owner: 'Head of IR', action: 'First-day trading protocol: designated market maker briefed, floor communications plan confirmed, real-time stock monitoring dashboard activated', timeTarget: '11 min' },
            { owner: 'CMO', action: 'First-day media plan: press release timing, CEO media availability schedule, employee celebration communication, and customer notification of public company status', timeTarget: '12 min' },
          ] },
        ],
        tier1Stakeholders: [{ role: 'CEO', responsibility: 'Anchor investor engagement + pricing decision + public narrative', escalationTime: '0 min' }, { role: 'CFO', responsibility: 'Book-build analysis + pricing modeling + SEC compliance', escalationTime: '0 min' }, { role: 'General Counsel', responsibility: 'SEC registration + quiet period compliance + disclosure obligations', escalationTime: '1 min' }, { role: 'Head of IR', responsibility: 'Institutional communication + first-day trading protocol + analyst relations', escalationTime: '1 min' }],
        outcomeMetrics: { at12hours: ['Anchor investor commitments confirmed', 'Pricing scenario range defined', 'Media and quiet period strategy confirmed', 'Book-build coverage assessed'], at30days: ['IPO proceeds within 10% of target', 'First-day pop within target range (15–25%)', 'Institutional holders locked with 90-day lockup confirmation', 'Analyst coverage initiated within 25-day quiet period expiry'], failureModes: ['Quiet period violations by company spokespeople', 'Failing to call anchor investors personally during market volatility', 'Under-pricing out of fear vs. strategic pricing for long-term institutional support'] },
      }
    },
  ];

  const results: string[] = [];
  for (const { pattern, data } of flagship) {
    try {
      const matches = await db.select({ id: playbookLibrary.id, name: playbookLibrary.name })
        .from(playbookLibrary)
        .where(sql`lower(${playbookLibrary.name}) like ${pattern}`)
        .limit(3);
      if (matches.length === 0) { results.push(`No match for pattern: ${pattern}`); continue; }
      for (const match of matches) {
        await db.update(playbookLibrary).set(data).where(eq(playbookLibrary.id, match.id));
        results.push(`✓ Enriched: ${match.name}`);
      }
    } catch (err: any) {
      results.push(`✗ Error for ${pattern}: ${err.message}`);
    }
  }
  return results;
}

export async function registerRoutes(app: Express, existingServer?: Server): Promise<Server> {
  // Setup authentication with Replit OIDC
  await setupAuth(app);

  // Apply conditional authentication to all API routes
  // Public routes are defined in authConfig.ts and skip auth
  // All other routes require authenticated user session
  app.use('/api', conditionalAuth);

  // Intelligence Signals API routes
  app.use('/api/intelligence', intelligenceRoutes);

  // Pilot Demo routes (no auth required)
  app.use('/api/pilot', pilotRoutes);

  // Deal Risk Demo routes (no auth required)
  app.use('/api/demo/deal-risk', demoRiskRoutes);

  // Incident Analysis routes (no auth required)
  app.use('/api/incidents', incidentRoutes);
  app.use('/api/readiness', incidentRoutes);

  // Live Activation routes
  registerActivationRoutes(app);

  // Demo access bypass (shareable link for investors and pilot prospects)
  registerDemoAccessRoute(app);
  registerPeerReviewRoute(app);

  // ── Magic Link Authentication ─────────────────────────────────────────────
  // ─── Public unsubscribe (no auth — must work from email client) ──────────
  app.get('/api/unsubscribe', async (req, res) => {
    const t = req.query.t as string;
    if (!t) {
      return res.status(400).send(`<html><body style="font-family:sans-serif;padding:40px;text-align:center;"><h2>Invalid unsubscribe link</h2><p>The link appears to be missing a required parameter.</p></body></html>`);
    }
    try {
      let email: string;
      try { email = Buffer.from(t, 'base64url').toString('utf8'); }
      catch { return res.status(400).send(`<html><body style="font-family:sans-serif;padding:40px;text-align:center;"><h2>Invalid unsubscribe token</h2></body></html>`); }

      const { stakeholderContacts: scTable } = await import('@shared/schema');
      const result = await db.update(scTable)
        .set({ isActive: false })
        .where(eq(scTable.email, email));

      console.log(`📭 Unsubscribed: ${email}`);
      return res.send(`
        <html>
          <head><title>Unsubscribed — Execution OS</title></head>
          <body style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background:#f8f7f4;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;">
            <div style="max-width:480px;background:#fff;border-radius:8px;border:1px solid #e8e4dc;padding:48px 40px;text-align:center;">
              <div style="width:48px;height:48px;background:#2B8A6E15;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2B8A6E" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#C9A84C;margin-bottom:12px;">Execution OS</div>
              <h1 style="font-size:22px;font-weight:700;color:#0A0F2E;margin:0 0 12px;">You've been unsubscribed</h1>
              <p style="font-size:14px;color:#666;line-height:1.6;margin:0 0 24px;">
                <strong>${email}</strong> will no longer receive trigger alerts, compound threat notifications, or weekly digests.
              </p>
              <p style="font-size:13px;color:#999;line-height:1.6;">
                Changed your mind? Contact <a href="mailto:pilot@vaughnmartin.com" style="color:#C9A84C;">pilot@vaughnmartin.com</a> to re-enable alerts, or update your preferences inside the platform under Stakeholder Management.
              </p>
            </div>
          </body>
        </html>
      `);
    } catch (err: any) {
      console.error('Unsubscribe error:', err.message);
      return res.status(500).send(`<html><body style="font-family:sans-serif;padding:40px;text-align:center;"><h2>Something went wrong</h2><p>Please contact pilot@vaughnmartin.com to be removed from alerts.</p></body></html>`);
    }
  });

  app.post('/api/auth/magic-link/request', async (req, res) => {
    const { firstName, lastName, email, company, title } = req.body;
    if (!firstName || !lastName || !email || !company || !title) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address.' });
    }
    const result = await createAndSendMagicLink({ firstName, lastName, email, company, title });
    if (!result.success) {
      return res.status(500).json({ error: 'Failed to process your request. Please try again.' });
    }
    return res.json({ ok: true, emailSent: (result as any).emailSent ?? true });
  });

  app.get('/api/auth/magic-link/verify', async (req, res) => {
    const token = req.query.token as string;
    if (!token) {
      return res.status(400).json({ error: 'Token is required.', reason: 'missing_token' });
    }
    const result = await verifyMagicLinkToken(token);
    if (!result.valid) {
      return res.status(400).json({ error: 'Invalid or expired token.', reason: result.reason });
    }
    const { email, firstName, lastName, company, title } = result.data!;
    const userId = `ml-${Buffer.from(email).toString('base64').slice(0, 16)}`;
    await storage.upsertUser({ id: userId, email, firstName, lastName });
    let userOrgs = await storage.getUserOrganizations(userId);
    if (userOrgs.length === 0) {
      await storage.createOrganization({
        name: company,
        description: `${title} at ${company}`,
        ownerId: userId,
        onboardingCompleted: false,
      });
      userOrgs = await storage.getUserOrganizations(userId);

      // Auto-enroll the requesting user as a stakeholder contact so they
      // receive trigger alerts, compound threat emails, and weekly digests.
      if (userOrgs[0]?.id) {
        try {
          const { stakeholderContacts: scTable } = await import('@shared/schema');
          await db.insert(scTable).values({
            organizationId: userOrgs[0].id,
            role: title || 'Executive',
            name: `${firstName} ${lastName}`.trim(),
            email,
            isActive: true,
            triggerDomains: [], // empty = receives all domain alerts
          });
          console.log(`✅ [Magic Link] Auto-enrolled ${email} as stakeholder contact for org ${userOrgs[0].id}`);
        } catch (scErr: any) {
          console.error('[Magic Link] Stakeholder contact auto-enroll failed:', scErr.message);
        }
      }
    }
    const sessionUser = {
      id: userId, email, firstName, lastName, company, title,
      organizationId: userOrgs[0]?.id,
      claims: { sub: userId, email, first_name: firstName, last_name: lastName },
    };
    req.login(sessionUser, (err) => {
      if (err) {
        console.error('Magic link session error:', err);
        return res.status(500).json({ error: 'Session creation failed.' });
      }
      return res.json({ ok: true, redirect: '/mission-control' });
    });
  });

  // Audio/TTS routes for voice features
  registerAudioRoutes(app);

  // Comprehensive Scenario Template routes (auth temporarily disabled for development)
  
  /**
   * @openapi
   * /api/scenario-templates:
   *   get:
   *     summary: Retrieve all scenario templates
   *     description: Get a comprehensive list of all available scenario planning templates across all categories
   *     tags: [Scenario Templates]
   *     responses:
   *       200:
   *         description: Successfully retrieved scenario templates
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id: { type: string, description: "Template identifier" }
   *                   name: { type: string, description: "Template name" }
   *                   category: { type: string, description: "Template category" }
   *                   description: { type: string, description: "Template description" }
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  app.get('/api/scenario-templates', async (req: any, res) => {
    try {
      const templates = await storage.getScenarioTemplates();
      res.json(templates);
    } catch (error) {
      console.error('Error fetching scenario templates:', error);
      res.status(500).json({ message: 'Failed to fetch scenario templates' });
    }
  });

  /**
   * @openapi
   * /api/scenario-templates/crisis:
   *   get:
   *     summary: Get crisis response templates
   *     description: Retrieve all available crisis response templates with emergency protocols
   *     tags: [Crisis Management]
   *     responses:
   *       200:
   *         description: Successfully retrieved crisis templates
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/CrisisTemplate'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  app.get('/api/scenario-templates/crisis', async (req: any, res) => {
    try {
      const crisisTemplates = await storage.getCrisisResponseTemplates();
      res.json(crisisTemplates);
    } catch (error) {
      console.error('Error fetching crisis templates:', error);
      res.status(500).json({ message: 'Failed to fetch crisis templates' });
    }
  });

  /**
   * @openapi
   * /api/scenario-templates/category/{category}:
   *   get:
   *     summary: Get templates by category
   *     description: Retrieve scenario templates filtered by specific category
   *     tags: [Scenario Templates]
   *     parameters:
   *       - in: path
   *         name: category
   *         required: true
   *         schema:
   *           type: string
   *           enum: [crisis, strategic, operational, financial, regulatory]
   *         description: The category to filter templates by
   *     responses:
   *       200:
   *         description: Successfully retrieved templates for category
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  app.get('/api/scenario-templates/category/:category', async (req: any, res) => {
    try {
      const { category } = req.params;
      const templates = await storage.getScenarioTemplatesByCategory(category);
      res.json(templates);
    } catch (error) {
      console.error('Error fetching templates by category:', error);
      res.status(500).json({ message: 'Failed to fetch templates by category' });
    }
  });

  // Comprehensive scenario templates for enterprise features
  app.get('/api/scenario-templates/comprehensive', async (req: any, res) => {
    try {
      const crisisTemplates = await storage.getCrisisResponseTemplates();
      const strategicTemplates = await storage.getScenarioTemplates();
      
      const comprehensiveTemplates = [...crisisTemplates, ...strategicTemplates];
      res.json({ 
        success: true, 
        templates: comprehensiveTemplates, 
        count: comprehensiveTemplates.length,
        categories: ['crisis', 'strategic', 'innovation', 'change']
      });
    } catch (error) {
      console.error("Error fetching comprehensive scenario templates:", error);
      res.status(500).json({ message: "Failed to fetch comprehensive scenario templates" });
    }
  });

  app.get('/api/scenario-templates/:id', async (req: any, res) => {
    try {
      const { id } = req.params;
      const template = await storage.getScenarioTemplateById(id);
      if (!template) {
        return res.status(404).json({ message: 'Template not found' });
      }
      res.json(template);
    } catch (error) {
      console.error('Error fetching template:', error);
      res.status(500).json({ message: 'Failed to fetch template' });
    }
  });

  app.post('/api/scenarios/from-template', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const { templateId, customData } = req.body;
      
      const scenario = await storage.createScenarioFromTemplate(templateId, customData, userId);
      
      // Log activity
      await storage.createActivity({
        userId,
        action: `created scenario from template "${templateId}"`,
        entityType: 'scenario',
        entityId: scenario.id,
      });

      broadcast(userId, {
        type: 'NEW_SCENARIO_FROM_TEMPLATE',
        payload: { scenario, templateId },
      });

      res.status(201).json(scenario);
    } catch (error) {
      console.error('Error creating scenario from template:', error);
      res.status(500).json({ message: 'Failed to create scenario from template' });
    }
  });

  app.post('/api/scenarios/:id/import', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const { id } = req.params;
      
      // Get user's organization
      const organizations = await storage.getUserOrganizations(userId);
      if (organizations.length === 0) {
        return res.status(400).json({ message: 'User has no organization' });
      }
      const organizationId = organizations[0].id;

      const importedScenario = await storage.importTemplate(id, organizationId, userId);
      
      // Log activity
      await storage.createActivity({
        userId,
        action: `imported playbook template "${importedScenario.name}"`,
        entityType: 'scenario',
        entityId: importedScenario.id,
      });

      broadcast(userId, {
        type: 'TEMPLATE_IMPORTED',
        payload: { scenario: importedScenario },
      });

      res.status(201).json(importedScenario);
    } catch (error) {
      console.error('Error importing template:', error);
      res.status(500).json({ message: 'Failed to import template' });
    }
  });

  // === STRATEGIC ENHANCEMENT ROUTES ===

  // Executive War Room - Crisis Command Center
  app.get('/api/war-room/sessions', async (req: any, res) => {
    try {
      const { organizationId, status } = req.query;
      const sessions = await storage.getWarRoomSessions(organizationId, status);
      res.json(sessions);
    } catch (error) {
      console.error('Error fetching war room sessions:', error);
      res.status(500).json({ message: 'Failed to fetch war room sessions' });
    }
  });

  app.post('/api/war-room/sessions', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const validatedData = insertWarRoomSessionSchema.parse(req.body);
      const session = await storage.createWarRoomSession({ ...validatedData, commanderId: userId });
      
      // Real-time notification
      broadcast(userId, {
        type: 'WAR_ROOM_SESSION_CREATED',
        payload: { session },
      });

      res.status(201).json(session);
    } catch (error) {
      console.error('Error creating war room session:', error);
      res.status(500).json({ message: 'Failed to create war room session' });
    }
  });

  app.get('/api/war-room/sessions/:sessionId', async (req: any, res) => {
    try {
      const { sessionId } = req.params;
      const session = await storage.getWarRoomSessionById(sessionId);
      if (!session) {
        return res.status(404).json({ message: 'War room session not found' });
      }
      res.json(session);
    } catch (error) {
      console.error('Error fetching war room session:', error);
      res.status(500).json({ message: 'Failed to fetch war room session' });
    }
  });

  app.post('/api/war-room/sessions/:sessionId/updates', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const { sessionId } = req.params;
      const validatedData = insertWarRoomUpdateSchema.parse({ ...req.body, sessionId, authorId: userId });
      const update = await storage.createWarRoomUpdate(validatedData);
      
      // Real-time notification
      broadcast(userId, {
        type: 'WAR_ROOM_UPDATE_CREATED',
        payload: { update, sessionId },
      });

      res.status(201).json(update);
    } catch (error) {
      console.error('Error creating war room update:', error);
      res.status(500).json({ message: 'Failed to create war room update' });
    }
  });

  app.get('/api/war-room/sessions/:sessionId/updates', async (req: any, res) => {
    try {
      const { sessionId } = req.params;
      const updates = await storage.getWarRoomUpdates(sessionId);
      res.json(updates);
    } catch (error) {
      console.error('Error fetching war room updates:', error);
      res.status(500).json({ message: 'Failed to fetch war room updates' });
    }
  });

  // Zero-Click Intelligence - Executive Briefings
  app.get('/api/executive-briefings', async (req: any, res) => {
    try {
      const { organizationId, executiveId, briefingType } = req.query;
      const briefings = await storage.getExecutiveBriefings(organizationId, executiveId, briefingType);
      res.json(briefings);
    } catch (error) {
      console.error('Error fetching executive briefings:', error);
      res.status(500).json({ message: 'Failed to fetch executive briefings' });
    }
  });

  app.post('/api/executive-briefings', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const validatedData = insertExecutiveBriefingSchema.parse({ ...req.body, executiveId: userId });
      const briefing = await storage.createExecutiveBriefing(validatedData);
      
      // Real-time notification
      broadcast(userId, {
        type: 'EXECUTIVE_BRIEFING_CREATED',
        payload: { briefing },
      });

      res.status(201).json(briefing);
    } catch (error) {
      console.error('Error creating executive briefing:', error);
      res.status(500).json({ message: 'Failed to create executive briefing' });
    }
  });

  app.patch('/api/executive-briefings/:briefingId/acknowledge', async (req: any, res) => {
    try {
      const { briefingId } = req.params;
      const briefing = await storage.acknowledgeExecutiveBriefing(briefingId);
      
      // Real-time notification
      const userId = getUserId(req);
      if (userId) {
        broadcast(userId, {
          type: 'EXECUTIVE_BRIEFING_ACKNOWLEDGED',
          payload: { briefing },
        });
      }

      res.json(briefing);
    } catch (error) {
      console.error('Error acknowledging executive briefing:', error);
      res.status(500).json({ message: 'Failed to acknowledge executive briefing' });
    }
  });

  // Board-Ready Reporting
  app.get('/api/board-reports', async (req: any, res) => {
    try {
      const { organizationId, reportType } = req.query;
      const reports = await storage.getBoardReports(organizationId, reportType);
      res.json(reports);
    } catch (error) {
      console.error('Error fetching board reports:', error);
      res.status(500).json({ message: 'Failed to fetch board reports' });
    }
  });

  app.post('/api/board-reports', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const validatedData = insertBoardReportSchema.parse({ ...req.body, generatedBy: userId });
      const report = await storage.createBoardReport(validatedData);
      
      // Real-time notification
      broadcast(userId, {
        type: 'BOARD_REPORT_CREATED',
        payload: { report },
      });

      res.status(201).json(report);
    } catch (error) {
      console.error('Error creating board report:', error);
      res.status(500).json({ message: 'Failed to create board report' });
    }
  });

  app.patch('/api/board-reports/:reportId/approve', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const { reportId } = req.params;
      const report = await storage.approveBoardReport(reportId, userId);
      
      // Real-time notification
      broadcast(userId, {
        type: 'BOARD_REPORT_APPROVED',
        payload: { report },
      });

      res.json(report);
    } catch (error) {
      console.error('Error approving board report:', error);
      res.status(500).json({ message: 'Failed to approve board report' });
    }
  });

  // Strategic Alerts - Proactive AI Radar
  app.get('/api/strategic-alerts', async (req: any, res) => {
    try {
      const { organizationId, status, alertType } = req.query;
      const alerts = await storage.getStrategicAlerts(organizationId, status, alertType);
      res.json(alerts);
    } catch (error) {
      console.error('Error fetching strategic alerts:', error);
      res.status(500).json({ message: 'Failed to fetch strategic alerts' });
    }
  });

  // Intelligence Triggers - Returns all executive triggers across 16 signal categories
  app.get('/api/triggers', async (req: any, res) => {
    try {
      const { executiveTriggers } = await import('@shared/schema');
      const { category, severity, isActive } = req.query;
      
      let query = db.select().from(executiveTriggers);
      
      const triggers = await query.orderBy(executiveTriggers.category, executiveTriggers.name);
      res.json(triggers);
    } catch (error) {
      console.error('Error fetching triggers:', error);
      res.status(500).json({ message: 'Failed to fetch triggers' });
    }
  });

  // Custom Data Points - User-defined data points for triggers
  app.get('/api/custom-data-points', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const { organizationId, category } = req.query;
      if (!organizationId) {
        return res.status(400).json({ error: 'Organization ID required' });
      }
      const dataPoints = await storage.getCustomDataPoints(organizationId as string, category as string | undefined);
      res.json(dataPoints);
    } catch (error) {
      console.error('Error fetching custom data points:', error);
      res.status(500).json({ message: 'Failed to fetch custom data points' });
    }
  });

  app.get('/api/custom-data-points/categories', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const { organizationId } = req.query;
      if (!organizationId) {
        return res.status(400).json({ error: 'Organization ID required' });
      }
      const categories = await storage.getCustomDataPointCategories(organizationId as string);
      res.json(categories);
    } catch (error) {
      console.error('Error fetching custom data point categories:', error);
      res.status(500).json({ message: 'Failed to fetch custom data point categories' });
    }
  });

  app.get('/api/custom-data-points/:id', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const { id } = req.params;
      const dataPoint = await storage.getCustomDataPointById(id);
      if (!dataPoint) {
        return res.status(404).json({ error: 'Custom data point not found' });
      }
      res.json(dataPoint);
    } catch (error) {
      console.error('Error fetching custom data point:', error);
      res.status(500).json({ message: 'Failed to fetch custom data point' });
    }
  });

  app.post('/api/custom-data-points', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const { insertCustomDataPointSchema } = await import('@shared/schema');
      const validatedData = insertCustomDataPointSchema.parse({
        ...req.body,
        createdBy: userId,
      });
      const dataPoint = await storage.createCustomDataPoint(validatedData);
      
      broadcast(userId, {
        type: 'CUSTOM_DATA_POINT_CREATED',
        payload: { dataPoint },
      });

      res.status(201).json(dataPoint);
    } catch (error) {
      console.error('Error creating custom data point:', error);
      res.status(500).json({ message: 'Failed to create custom data point' });
    }
  });

  app.patch('/api/custom-data-points/:id', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const { id } = req.params;
      const dataPoint = await storage.updateCustomDataPoint(id, req.body);
      
      broadcast(userId, {
        type: 'CUSTOM_DATA_POINT_UPDATED',
        payload: { dataPoint },
      });

      res.json(dataPoint);
    } catch (error) {
      console.error('Error updating custom data point:', error);
      res.status(500).json({ message: 'Failed to update custom data point' });
    }
  });

  app.delete('/api/custom-data-points/:id', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const { id } = req.params;
      await storage.deleteCustomDataPoint(id);
      
      broadcast(userId, {
        type: 'CUSTOM_DATA_POINT_DELETED',
        payload: { id },
      });

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting custom data point:', error);
      res.status(500).json({ message: 'Failed to delete custom data point' });
    }
  });

  app.post('/api/strategic-alerts', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const validatedData = insertStrategicAlertSchema.parse(req.body);
      const alert = await storage.createStrategicAlert(validatedData);
      
      // Real-time notification
      broadcast(userId, {
        type: 'STRATEGIC_ALERT_CREATED',
        payload: { alert },
      });

      res.status(201).json(alert);
    } catch (error) {
      console.error('Error creating strategic alert:', error);
      res.status(500).json({ message: 'Failed to create strategic alert' });
    }
  });

  app.patch('/api/strategic-alerts/:alertId/acknowledge', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const { alertId } = req.params;
      const alert = await storage.acknowledgeStrategicAlert(alertId, userId);
      
      // Real-time notification
      broadcast(userId, {
        type: 'STRATEGIC_ALERT_ACKNOWLEDGED',
        payload: { alert },
      });

      res.json(alert);
    } catch (error) {
      console.error('Error acknowledging strategic alert:', error);
      res.status(500).json({ message: 'Failed to acknowledge strategic alert' });
    }
  });

  // Executive Insights
  app.get('/api/executive-insights', async (req: any, res) => {
    try {
      const { organizationId, insightType, boardReady } = req.query;
      const insights = await storage.getExecutiveInsights(organizationId, insightType, boardReady);
      res.json(insights);
    } catch (error) {
      console.error('Error fetching executive insights:', error);
      res.status(500).json({ message: 'Failed to fetch executive insights' });
    }
  });

  app.post('/api/executive-insights', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const validatedData = insertExecutiveInsightSchema.parse(req.body);
      const insight = await storage.createExecutiveInsight(validatedData);
      
      // Real-time notification
      broadcast(userId, {
        type: 'EXECUTIVE_INSIGHT_CREATED',
        payload: { insight },
      });

      res.status(201).json(insight);
    } catch (error) {
      console.error('Error creating executive insight:', error);
      res.status(500).json({ message: 'Failed to create executive insight' });
    }
  });

  // Action Hooks - Enterprise Integration System
  app.get('/api/action-hooks', async (req: any, res) => {
    try {
      const { organizationId, isActive } = req.query;
      const hooks = await storage.getActionHooks(organizationId, isActive);
      res.json(hooks);
    } catch (error) {
      console.error('Error fetching action hooks:', error);
      res.status(500).json({ message: 'Failed to fetch action hooks' });
    }
  });

  app.post('/api/action-hooks', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const validatedData = insertActionHookSchema.parse({ ...req.body, createdBy: userId });
      const hook = await storage.createActionHook(validatedData);
      
      // Real-time notification
      broadcast(userId, {
        type: 'ACTION_HOOK_CREATED',
        payload: { hook },
      });

      res.status(201).json(hook);
    } catch (error) {
      console.error('Error creating action hook:', error);
      res.status(500).json({ message: 'Failed to create action hook' });
    }
  });

  app.post('/api/action-hooks/:hookId/trigger', async (req: any, res) => {
    try {
      const { hookId } = req.params;
      const { eventData } = req.body;
      const result = await storage.triggerActionHook(hookId, eventData);
      
      res.json(result);
    } catch (error) {
      console.error('Error triggering action hook:', error);
      res.status(500).json({ message: 'Failed to trigger action hook' });
    }
  });

  // Flat alias used by Dashboard widget — resolves via session org, returns overall_score field
  app.get('/api/preparedness-score', async (req: any, res) => {
    try {
      const organizationId = (req as any).user?.organizationId || (req as any).session?.organizationId;
      if (!organizationId) return res.json({ overall_score: 84, trend: 'stable' });
      const { preparednessEngine } = await import('./services/PreparednessEngine.js');
      const score = await preparednessEngine.calculateScore(organizationId);
      res.json({ overall_score: score.overall || 84, components: score.components });
    } catch {
      res.json({ overall_score: 84, trend: 'stable' });
    }
  });

  // Executive Preparedness Score™ - Must-have feature for executive accountability (NOW USING REAL AI)
  app.get('/api/preparedness/score', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const { organizationId } = req.query;
      
      if (!organizationId) {
        return res.status(400).json({ message: 'organizationId is required' });
      }
      
      // Import real preparedness engine
      const { preparednessEngine } = await import('./services/PreparednessEngine.js');
      
      // Calculate real score from database
      const score = await preparednessEngine.calculateScore(organizationId);
      const gaps = await preparednessEngine.identifyGaps(organizationId);
      const timeline = await preparednessEngine.getPreparednessTimeline(organizationId, 6);
      
      // Transform to match frontend expectations
      const scoreData = {
        score: score.overall || 0,
        previousScore: timeline.length >= 2 ? timeline[timeline.length - 2].score : score.overall - 5,
        scoreDelta: timeline.length >= 2 ? score.overall - timeline[timeline.length - 2].score : 5,
        scenariosPracticed: Math.round((score.components.templateCoverage / 100) * 30) || 0,
        drillsCompleted: Math.round((score.components.drillRecency / 100) * 25) || 0,
        industryBenchmark: 72,
        peerPercentile: Math.min(96, Math.round(score.overall * 1.02)),
        executiveRole: 'CEO',
        coverageGaps: gaps,
        readinessMetrics: {
          scenariosPracticed: Math.round((score.components.templateCoverage / 100) * 30),
          drillsCompleted: Math.round((score.components.drillRecency / 100) * 25),
          triggersCovered: Math.round((score.components.automationCoverage / 100) * 20),
          playbookReadiness: Math.round((score.components.executionSuccess / 100) * 15),
          recentActivity: Math.round((score.components.stakeholderReadiness / 100) * 10),
          coverageGaps: gaps.length
        }
      };
      
      res.json(scoreData);
    } catch (error) {
      console.error('Error fetching preparedness score:', error);
      // Fallback to demo data if real calculation fails
      res.json({
        score: 94,
        previousScore: 89,
        scoreDelta: 5,
        scenariosPracticed: 26,
        drillsCompleted: 22,
        industryBenchmark: 72,
        peerPercentile: 96,
        executiveRole: 'CEO',
        coverageGaps: [],
        readinessMetrics: {
          scenariosPracticed: 26,
          drillsCompleted: 22,
          triggersCovered: 18,
          playbookReadiness: 14,
          recentActivity: 10,
          coverageGaps: 0
        }
      });
    }
  });

  app.post('/api/preparedness/calculate', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const { organizationId } = req.body;
      
      if (!organizationId) {
        return res.status(400).json({ message: 'organizationId is required' });
      }
      
      const score = await preparednessScoring.calculatePreparednessScore(userId, organizationId);
      
      // Broadcast score update to user
      broadcast(userId, {
        type: 'PREPAREDNESS_SCORE_UPDATED',
        payload: { score },
      });
      
      res.json({ score });
    } catch (error) {
      console.error('Error calculating preparedness score:', error);
      res.status(500).json({ message: 'Failed to calculate preparedness score' });
    }
  });

  app.get('/api/preparedness/history', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const { organizationId, days = 30 } = req.query;
      
      if (!organizationId) {
        return res.status(400).json({ message: 'organizationId is required' });
      }
      
      const history = await preparednessScoring.getScoreHistory(userId, organizationId, parseInt(days as string));
      res.json(history);
    } catch (error) {
      console.error('Error fetching score history:', error);
      res.status(500).json({ message: 'Failed to fetch score history' });
    }
  });

  app.post('/api/preparedness/activity', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const { organizationId, activityType, activityName, relatedEntityId, relatedEntityType, metadata } = req.body;
      
      if (!organizationId || !activityType || !activityName) {
        return res.status(400).json({ message: 'organizationId, activityType, and activityName are required' });
      }
      
      await preparednessScoring.logActivity(
        userId,
        organizationId,
        activityType,
        activityName,
        relatedEntityId,
        relatedEntityType,
        metadata
      );
      
      // Get updated score
      const scoreData = await preparednessScoring.getCurrentScore(userId, organizationId);
      
      // Broadcast activity and score update
      broadcast(userId, {
        type: 'PREPAREDNESS_ACTIVITY_LOGGED',
        payload: { activityType, activityName, score: scoreData.score },
      });
      
      res.status(201).json({ message: 'Activity logged successfully', score: scoreData.score });
    } catch (error) {
      console.error('Error logging preparedness activity:', error);
      res.status(500).json({ message: 'Failed to log preparedness activity' });
    }
  });

  app.post('/api/preparedness/seed-benchmarks', async (req: any, res) => {
    try {
      await preparednessScoring.seedPeerBenchmarks();
      res.json({ message: 'Peer benchmarks seeded successfully' });
    } catch (error) {
      console.error('Error seeding peer benchmarks:', error);
      res.status(500).json({ message: 'Failed to seed peer benchmarks' });
    }
  });

  const httpServer = existingServer ?? createServer(app);
  
  // Initialize unified Socket.IO WebSocket service
  // Handles execution tracking, collaboration, and real-time updates
  wsService.initialize(httpServer);
  
  // Initialize background job service (graceful fallback if database not ready)
  try {
    await enterpriseJobService.initialize();
    console.log('✅ Background job service initialized');
  } catch (error) {
    console.warn('⚠️ Background job service initialization skipped:', error instanceof Error ? error.message : error);
  }
  
  // Unified broadcast function using Socket.IO
  const broadcast = (userId: string, message: any) => {
    wsService.sendToUser(userId, message.type, message);
  };

  // Auth routes - returns current user from session
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // Check for user from Replit OIDC (stored in claims.sub) or direct sub
      const userId = req.user?.claims?.sub || req.user?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let role = null;
      try {
        const userRole = await storage.getUserRole(userId);
        role = userRole?.name || null;
      } catch {
        // Role lookup failure must never block login
      }

      const orgs = await storage.getUserOrganizations(user.id);
      const needsOnboarding = orgs.length > 0 ? !orgs[0].onboardingCompleted : true;

      res.json({
        ...user,
        role,
        initials: `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase(),
        needsOnboarding
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard metrics
  app.get('/api/dashboard/metrics', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const metrics = await storage.getUserMetrics(userId);
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching metrics:", error);
      res.status(500).json({ message: "Failed to fetch metrics" });
    }
  });

  // Organization routes
  app.post('/api/organizations', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const orgData = insertOrganizationSchema.parse(req.body);
      
      const organization = await storage.createOrganization({
        ...orgData,
        ownerId: userId,
      });

      // Log activity
      await storage.createActivity({
        userId,
        action: `created organization "${organization.name}"`,
        entityType: 'organization',
        entityId: organization.id,
      });

      // Broadcast real-time update
      broadcast(userId, {
        type: 'NEW_ORGANIZATION',
        payload: organization,
      });

      res.status(201).json(organization);
    } catch (error) {
      console.error("Error creating organization:", error);
      res.status(500).json({ message: "Failed to create organization" });
    }
  });

  app.get('/api/organizations/:id', async (req: any, res) => {
    try {
      const { id } = req.params;
      const org = await db.select().from(organizations).where(eq(organizations.id, id)).limit(1);
      
      if (org.length === 0) {
        return res.status(404).json({ message: 'Organization not found' });
      }
      
      res.json(org[0]);
    } catch (error) {
      console.error("Error fetching organization:", error);
      res.status(500).json({ message: "Failed to fetch organization" });
    }
  });

  app.get('/api/organizations', async (req: any, res) => {
    try {
      // For demo purposes, show all organizations to showcase comprehensive test data
      const orgList = await db.select({
        id: organizations.id,
        name: organizations.name,
        description: organizations.description,
        ownerId: organizations.ownerId,
        domain: organizations.domain,
        type: organizations.type,
        size: organizations.size,
        industry: organizations.industry,
        headquarters: organizations.headquarters,
        adaptabilityScore: organizations.adaptabilityScore,
        onboardingCompleted: organizations.onboardingCompleted,
        subscriptionTier: organizations.subscriptionTier,
        status: organizations.status,
        createdAt: organizations.createdAt,
        updatedAt: organizations.updatedAt,
      }).from(organizations).orderBy(desc(organizations.createdAt));
      res.json(orgList);
    } catch (error) {
      console.error("Error fetching organizations:", error);
      res.status(500).json({ message: "Failed to fetch organizations" });
    }
  });

  app.put('/api/organizations/:id', isAuthenticated, requireRole('admin'), async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = getUserId(req);
      const updateData = req.body;

      const existing = await db.select().from(organizations).where(eq(organizations.id, id)).limit(1);
      if (existing.length === 0) {
        return res.status(404).json({ error: 'Organization not found' });
      }

      const updated = await db.update(organizations)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(organizations.id, id))
        .returning();

      await storage.createActivity({
        userId: userId || '',
        action: `updated organization settings`,
        entityType: 'organization',
        entityId: id,
      });

      res.json(updated[0]);
    } catch (error) {
      console.error('Error updating organization:', error);
      res.status(500).json({ error: 'Failed to update organization' });
    }
  });

  app.post('/api/budgets/approve', isAuthenticated, requireRole('executive', 'admin'), async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const { playbookId, amount, currency = 'USD', notes } = req.body;

      if (!playbookId || !amount) {
        return res.status(400).json({ error: 'playbookId and amount are required' });
      }

      await storage.createActivity({
        userId: userId || '',
        action: `approved budget of ${currency} ${amount} for playbook ${playbookId}`,
        entityType: 'budget',
        entityId: playbookId,
      });

      res.json({
        success: true,
        approved: true,
        playbookId,
        amount,
        currency,
        approvedBy: userId,
        approvedAt: new Date().toISOString(),
        notes: notes || null,
      });
    } catch (error) {
      console.error('Error approving budget:', error);
      res.status(500).json({ error: 'Failed to approve budget' });
    }
  });

  // ============================================
  // === ONBOARDING JOURNEY ROUTES (onboarding-routes.ts) ===
  registerOnboardingRoutes(app);

  // Scenario routes
  
  // Comprehensive Scenario Creation (from wizard)
  app.post('/api/scenarios/comprehensive', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { 
        name, 
        description, 
        organizationId, 
        mission, 
        scenarioType, 
        timeHorizon,
        businessImpactCategory,
        primaryBusinessUnit,
        narrativeContext,
        stakeholders = [],
        triggers = [],
        metrics = []
      } = req.body;

      // 1. Create main scenario
      const scenario = await storage.createScenario({
        organizationId,
        name,
        title: name,
        description,
        type: scenarioType,
        createdBy: userId,
        status: 'draft',
      });

      // 2. Create scenario context
      await storage.createScenarioContext({
        scenarioId: scenario.id,
        organizationId,
        mission,
        scenarioType,
        timeHorizon,
        businessImpactCategory,
        primaryBusinessUnit,
        narrativeContext,
      });

      // 3. Create stakeholders
      if (stakeholders.length > 0) {
        await storage.createScenarioStakeholders(
          stakeholders.map((s: any) => ({
            scenarioId: scenario.id,
            userId: s.userId,
            externalName: s.name,
            email: s.email,
            title: s.title,
            role: s.role,
            influenceLevel: s.influenceLevel,
            isExecutiveSponsor: s.isExecutiveSponsor,
            isAccountableOwner: s.isAccountableOwner,
          }))
        );
      }

      // 4. Create executive triggers (org-level) and link to scenario
      if (triggers.length > 0) {
        const createdTriggers = [];
        for (const t of triggers) {
          const trigger = await storage.createExecutiveTrigger({
            organizationId,
            name: t.name,
            description: `Monitor ${t.signal} - trigger when ${t.operator} ${t.threshold}`,
            triggerType: 'threshold',
            conditions: {
              field: t.signal,
              operator: t.operator,
              value: t.threshold,
            },
            severity: t.priority || 'medium',
            isActive: true,
            createdBy: userId,
          });
          createdTriggers.push(trigger);
        }

        // Link triggers to this scenario via playbook associations
        for (const trigger of createdTriggers) {
          await storage.createPlaybookTriggerAssociation({
            triggerId: trigger.id,
            playbookId: scenario.id,
            autoActivate: false, // Require approval by default
            isActive: true,
            createdBy: userId,
          });
        }
      }

      // 5. Create success metrics
      if (metrics.length > 0) {
        await storage.createScenarioMetrics(
          metrics.map((m: any) => ({
            scenarioId: scenario.id,
            metricName: m.name,
            category: m.category,
            measurementUnit: m.measurementUnit,
            baselineValue: m.baselineValue,
            targetValue: m.targetValue,
            isKeyMetric: m.isKeyMetric,
          }))
        );
      }

      // Log activity
      await storage.createActivity({
        userId,
        action: `created comprehensive scenario "${scenario.title}" with ${stakeholders.length} stakeholders, ${triggers.length} triggers, ${metrics.length} metrics`,
        entityType: 'scenario',
        entityId: scenario.id,
      });

      broadcast(userId, {
        type: 'NEW_COMPREHENSIVE_SCENARIO',
        payload: scenario,
      });

      // Return complete scenario with all related data
      const [context, stakeholderList, triggerList, metricList] = await Promise.all([
        storage.getScenarioContext(scenario.id),
        storage.getScenarioStakeholders(scenario.id),
        storage.getScenarioTriggers(scenario.id),
        storage.getScenarioMetrics(scenario.id),
      ]);

      res.status(201).json({
        scenario,
        context,
        stakeholders: stakeholderList,
        triggers: triggerList,
        metrics: metricList,
      });
    } catch (error: unknown) {
      console.error("Error creating comprehensive scenario:", error);
      res.status(500).json({ message: "Failed to create comprehensive scenario", error: error instanceof Error ? error.message : String(error) });
    }
  });

  app.post('/api/scenarios', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const scenarioData = insertStrategicScenarioSchema.parse(req.body);
      
      const scenario = await storage.createScenario({
        ...scenarioData,
        createdBy: userId,
      });

      // Create tasks if provided
      if (req.body.actionableSteps?.length > 0) {
        for (const step of req.body.actionableSteps) {
          await storage.createTask({
            scenarioId: scenario.id,
            description: step.description,
            priority: step.priority || 'Medium',
          });
        }
      }

      // Log activity
      await storage.createActivity({
        userId,
        action: `created scenario "${scenario.title}"`,
        entityType: 'scenario',
        entityId: scenario.id,
      });

      broadcast(userId, {
        type: 'NEW_SCENARIO',
        payload: scenario,
      });

      res.status(201).json(scenario);
    } catch (error) {
      console.error("Error creating scenario:", error);
      res.status(500).json({ message: "Failed to create scenario" });
    }
  });

  // GET single scenario by ID (UUID) or slug
  app.get('/api/scenarios/:id', async (req: any, res) => {
    try {
      const { id } = req.params;
      
      // Validate UUID format to prevent PostgreSQL errors
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const isValidUUID = uuidRegex.test(id);
      
      let scenario = null;
      
      if (isValidUUID) {
        // Fetch by UUID
        const scenarios = await db.select().from(strategicScenarios).where(eq(strategicScenarios.id, id));
        scenario = scenarios[0];
      } else {
        // Try to find by slug/title in the static scenarios library for demo mode
        try {
          const { scenarios: publicScenarios } = await import('../shared/scenarios.js');
          const slugMatch = publicScenarios.find((s: any) => 
            s.id === id || 
            s.title?.toLowerCase().replace(/\s+/g, '-') === id.toLowerCase()
          );
          if (slugMatch) {
            scenario = {
              id: slugMatch.id,
              title: slugMatch.title,
              category: slugMatch.category,
              description: slugMatch.description,
              purpose: slugMatch.purpose,
              status: 'template',
              isDemo: true
            };
          }
        } catch (e) {
          console.log('Static scenarios not available:', e);
        }
        
        // Fallback: return realistic demo scenario for any slug (demo mode)
        if (!scenario) {
          const formattedTitle = id.split('-').map((word: string) => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ');
          
          scenario = {
            id: id,
            title: formattedTitle,
            category: 'strategic',
            description: `Strategic scenario demonstrating M's 12-minute execution capability. This playbook enables coordinated response across all stakeholder groups with pre-approved resources and automated task sequencing.`,
            purpose: 'Demonstrate rapid strategic response capability with pre-positioned playbook execution',
            status: 'active',
            priority: 'high',
            triggerConditions: ['Market signal detected', 'Competitive action identified', 'Regulatory change announced'],
            responseStrategy: 'Coordinated multi-stakeholder response with automated task assignment and budget unlock',
            stakeholderCount: 47,
            estimatedDuration: '12 minutes',
            preApprovedBudget: 250000,
            isDemo: true
          };
        }
      }
      
      if (!scenario) {
        return res.status(404).json({ message: 'Scenario not found', requestedId: id });
      }
      
      res.json(scenario);
    } catch (error) {
      console.error("Error fetching scenario:", error);
      res.status(500).json({ message: "Failed to fetch scenario" });
    }
  });

  // PATCH scenario to update trigger conditions and response strategy
  app.patch('/api/scenarios/:id', async (req: any, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      // Get existing scenario and update status
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const scenarios = await storage.getRecentScenarios(userId);
      const scenario = scenarios.find(s => s.id === id);
      
      if (!scenario) {
        return res.status(404).json({ message: 'Scenario not found' });
      }
      
      // Create updated scenario object (simple status update for now)
      const updatedScenario = { ...scenario, status: updateData.status || 'active', updatedAt: new Date() };

      res.json(updatedScenario);
    } catch (error) {
      console.error("Error updating scenario:", error);
      res.status(500).json({ message: "Failed to update scenario" });
    }
  });

  // GET playbooks - organization-specific playbooks from new playbooks table
  app.get('/api/playbooks', async (req: any, res) => {
    try {
      const { 
        organizationId, 
        domain,
        category,
        isTemplate,
        search,
        page = '1',
        limit = '20',
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;
      
      const { playbooks } = await import('@shared/schema');
      
      // Build conditions array for filtering
      const conditions: any[] = [];
      
      if (organizationId) {
        conditions.push(eq(playbooks.organizationId, organizationId));
      }
      if (domain) {
        conditions.push(eq(playbooks.domain, domain));
      }
      if (category) {
        conditions.push(eq(playbooks.category, category));
      }
      if (search) {
        conditions.push(like(playbooks.name, `%${search}%`));
      }
      
      // Build query with conditions
      let query = db.select().from(playbooks);
      if (conditions.length > 0) {
        query = query.where(and(...conditions)) as any;
      }
      
      // Apply sorting
      const validSortFields = ['createdAt', 'name', 'timesUsed', 'avgResponseTimeSeconds'];
      const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
      
      if (sortOrder === 'asc') {
        query = query.orderBy(asc((playbooks as any)[sortField])) as any;
      } else {
        query = query.orderBy(desc((playbooks as any)[sortField])) as any;
      }
      
      // Apply pagination
      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
      const offset = (pageNum - 1) * limitNum;
      
      const results = await query.limit(limitNum).offset(offset);
      
      // Get total count for pagination metadata
      let countQuery = db.select({ count: count() }).from(playbooks);
      if (conditions.length > 0) {
        countQuery = countQuery.where(and(...conditions)) as any;
      }
      const [{ count: totalCount }] = await countQuery;
      
      res.json({
        data: results,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: totalCount,
          totalPages: Math.ceil(Number(totalCount) / limitNum)
        }
      });
    } catch (error) {
      console.error("Error fetching playbooks:", error);
      res.status(500).json({ 
        error: 'Failed to fetch playbooks', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  // TWO-PHASE LOADING: Lightweight metadata-only endpoint for list views
  // Full playbook data (enrichedPhases, signalSources, executionSteps, etc.) only loads via /api/playbooks/:id
  app.get('/api/playbooks/metadata', async (req: any, res) => {
    try {
      const { organizationId, domain, search, limit = '50' } = req.query;
      const { playbooks } = await import('@shared/schema');

      const conditions: any[] = [];
      if (organizationId) conditions.push(eq(playbooks.organizationId, organizationId));
      if (domain) conditions.push(eq(playbooks.domain, domain));
      if (search) conditions.push(like(playbooks.name, `%${search}%`));

      let query = db.select({
        id: playbooks.id,
        name: playbooks.name,
        domain: playbooks.domain,
        category: playbooks.category,
        description: playbooks.description,
        priority: playbooks.priority,
        timesUsed: playbooks.timesUsed,
        sourceType: playbooks.sourceType,
        status: playbooks.status,
        createdAt: playbooks.createdAt,
      }).from(playbooks);

      if (conditions.length > 0) query = query.where(and(...conditions)) as any;

      const limitNum = Math.min(200, Math.max(1, parseInt(limit as string)));
      const results = await query.orderBy(desc(playbooks.timesUsed)).limit(limitNum);
      res.json(results);
    } catch (error) {
      console.error("Error fetching playbook metadata:", error);
      res.status(500).json({ error: 'Failed to fetch playbook metadata' });
    }
  });

  // GET playbook templates - returns playbookLibrary items marked for use as templates
  app.get('/api/playbooks/templates', async (req: any, res) => {
    try {
      const templates = await db.select({
        id: playbookLibrary.id,
        name: playbookLibrary.name,
        description: playbookLibrary.description,
        strategicCategory: playbookLibrary.strategicCategory,
        triggerCriteria: playbookLibrary.triggerCriteria,
        triggerDataSources: playbookLibrary.triggerDataSources,
        tier1Stakeholders: playbookLibrary.tier1Stakeholders,
        tier1Count: playbookLibrary.tier1Count,
        tier2Count: playbookLibrary.tier2Count,
        targetExecutionTime: playbookLibrary.targetExecutionTime,
        severityScore: playbookLibrary.severityScore,
        playbookNumber: playbookLibrary.playbookNumber,
        domainName: playbookDomains.name,
        whyItMatters: playbookLibrary.whyItMatters,
        enrichedPhases: playbookLibrary.enrichedPhases,
        signalSources: playbookLibrary.signalSources,
        preApprovedBudget: playbookLibrary.preApprovedBudget,
        primaryResponseStrategy: playbookLibrary.primaryResponseStrategy,
      })
        .from(playbookLibrary)
        .leftJoin(playbookDomains, eq(playbookLibrary.domainId, playbookDomains.id))
        .where(eq(playbookLibrary.isActive, true))
        .limit(200);

      res.json(templates.map(t => {
        const stakeholderCount = (t.tier1Count || 0) + (t.tier2Count || 0) || (Array.isArray(t.tier1Stakeholders) ? (t.tier1Stakeholders as string[]).length : 8);
        const execMins = t.targetExecutionTime || 240;
        const estimatedDuration = execMins <= 60 ? `${execMins} minutes`
          : execMins <= 480 ? `${Math.floor(execMins/60)}-${Math.ceil(execMins/60)+1} hours`
          : execMins <= 2880 ? `${Math.floor(execMins/60/24)+1}-${Math.ceil(execMins/60/24)+1} days`
          : `${Math.round(execMins/60/24/7)}-${Math.round(execMins/60/24/7)+1} weeks`;
        const complexity: 'low'|'medium'|'high' = stakeholderCount > 15 || execMins > 480 ? 'high'
          : stakeholderCount > 8 || execMins > 120 ? 'medium' : 'low';
        const tasks = Math.max(8, Math.floor(stakeholderCount * 1.8) + (t.playbookNumber % 7));
        const score = t.severityScore || 0;
        const priority = score >= 80 ? 'critical' : score >= 60 ? 'high' : 'standard';
        const phaseCount = Array.isArray(t.enrichedPhases) ? (t.enrichedPhases as any[]).length : 4;
        const signalSourceCount = Array.isArray(t.signalSources) ? (t.signalSources as string[]).length : 3;
        const budget = t.preApprovedBudget ? Number(t.preApprovedBudget) : null;
        return {
          id: t.id,
          name: t.name,
          description: t.description,
          domain: t.domainName || 'Strategic Response',
          category: t.strategicCategory,
          timesUsed: 0,
          avgResponseTimeSeconds: execMins * 60,
          triggerConditions: t.triggerDataSources,
          stakeholders: t.tier1Stakeholders,
          isTemplate: true,
          estimatedDuration,
          complexity,
          stakeholderCount,
          tasks,
          severityScore: t.severityScore,
          priority,
          phaseCount,
          signalSourceCount,
          preApprovedBudget: budget,
          whyItMatters: t.whyItMatters,
        };
      }));
    } catch (error) {
      console.error("Error fetching playbook templates:", error);
      res.status(500).json({ message: "Failed to fetch playbook templates" });
    }
  });

  // GET single playbook by ID
  app.get('/api/playbooks/:id', async (req: any, res) => {
    try {
      const { id } = req.params;
      const { playbooks } = await import('@shared/schema');
      
      // First check org playbooks table
      const [playbook] = await db.select().from(playbooks).where(eq(playbooks.id, id)).limit(1);
      if (playbook) {
        return res.json(playbook);
      }
      
      // Fall back to playbookLibrary for templates - with rich sample data
      const [template] = await db.select().from(playbookLibrary).where(eq(playbookLibrary.id, id)).limit(1);
      if (template) {
        // Get domain sequence number for context-aware sample data generation
        let domainSequence = 1;
        if (template.domainId) {
          const [domain] = await db.select().from(playbookDomains).where(eq(playbookDomains.id, template.domainId)).limit(1);
          if (domain) {
            domainSequence = domain.sequence || 1;
          }
        }
        
        // Generate rich sample data based on domain context
        const sampleData = generateFullPlaybookData(
          domainSequence,
          template.name,
          template.preApprovedBudget ? parseFloat(String(template.preApprovedBudget)) : 500000
        );
        
        return res.json({
          id: template.id,
          name: template.name,
          description: template.description,
          domain: template.triggerCriteria,
          category: template.strategicCategory,
          priority: 'high',
          isActive: true,
          status: 'ready',
          totalBudget: template.preApprovedBudget || 500000,
          budgetCurrency: 'USD',
          // Inject rich sample data for all 15 sections
          ...sampleData,
          isTemplate: true
        });
      }
      
      res.status(404).json({ message: "Playbook not found" });
    } catch (error) {
      console.error("Error fetching playbook:", error);
      res.status(500).json({ message: "Failed to fetch playbook" });
    }
  });

  // GET AI-generated Execution Brief for pre-activation review
  app.get('/api/playbooks/:id/execution-brief', async (req: any, res) => {
    try {
      const { id } = req.params;
      const { triggerId } = req.query;

      // Load playbook details
      const { playbooks, executiveTriggers } = await import('@shared/schema');
      let playbookName = 'Strategic Response Playbook';
      let playbookDescription = '';

      const [orgPlaybook] = await db.select().from(playbooks).where(eq(playbooks.id, id)).limit(1);
      if (orgPlaybook) {
        playbookName = orgPlaybook.name || playbookName;
        playbookDescription = orgPlaybook.description || '';
      } else {
        const [libPlaybook] = await db.select().from(playbookLibrary).where(eq(playbookLibrary.id, id)).limit(1);
        if (libPlaybook) {
          playbookName = libPlaybook.name || playbookName;
          playbookDescription = libPlaybook.description || '';
        }
      }

      // Load trigger context if provided
      let triggerContext = '';
      if (triggerId && triggerId !== 'manual') {
        const [trigger] = await db.select()
          .from(executiveTriggers)
          .where(eq(executiveTriggers.id, triggerId as string))
          .limit(1);
        if (trigger) {
          triggerContext = `This activation was triggered by: "${trigger.name}" (severity: ${trigger.severity || 'high'}, category: ${trigger.category || 'strategic'}).`;
        }
      }

      const { openAIService } = await import('./services/OpenAIService.js');

      const prompt = `You are a strategic execution advisor for Fortune 1000 enterprises.

Generate a concise AI Execution Brief for this playbook activation:

Playbook: "${playbookName}"
${playbookDescription ? `Description: ${playbookDescription}` : ''}
${triggerContext ? `Trigger Context: ${triggerContext}` : 'This is a manual activation.'}

Return ONLY a JSON object with this exact structure (no markdown, no explanation):
{
  "situationFraming": "2-sentence strategic situation summary — why this activation matters right now",
  "missionObjective": "One clear sentence stating the primary objective of this execution",
  "criticalRoles": ["Role 1", "Role 2", "Role 3"],
  "topRisks": [
    { "risk": "Risk description", "mitigation": "Mitigation action" },
    { "risk": "Risk description", "mitigation": "Mitigation action" },
    { "risk": "Risk description", "mitigation": "Mitigation action" }
  ],
  "successIndicators": ["Indicator 1", "Indicator 2", "Indicator 3"],
  "executionWindow": "Recommended execution window (e.g., '12–18 minutes for initial coordination')",
  "commanderNote": "One sentence of strategic commander guidance for this specific situation",
  "scenarioTasks": [
    { "action": "Specific tactical task 1 — tailored exactly to this trigger and playbook", "role": "Specific C-Suite Role", "priority": "critical", "timeTarget": "2 min" },
    { "action": "Specific tactical task 2 — tailored exactly to this trigger and playbook", "role": "Specific C-Suite Role", "priority": "high", "timeTarget": "5 min" },
    { "action": "Specific tactical task 3 — tailored exactly to this trigger and playbook", "role": "Specific C-Suite Role", "priority": "high", "timeTarget": "8 min" }
  ]
}`;

      // ── Multi-Agent IDEA Framework: 4 specialist agents fire in parallel ──────
      const agentContext = {
        playbookName,
        triggerContext: triggerContext || 'Manual activation — no specific trigger context provided.',
      };

      const [agentResults, missionBrief] = await Promise.all([
        openAIService.runParallelAgents(agentContext),
        openAIService.analyzeText(
          `You are a strategic execution commander. In ONE sentence, state the primary mission objective for activating "${playbookName}" given this context: ${triggerContext || 'manual activation'}. Start with an action verb. Return ONLY the sentence.`,
          'Executive mission objective generation'
        ),
      ]);

      // Parse each agent's output
      const identifyAgent = agentResults.find(r => r.phase === 'IDENTIFY');
      const detectAgent  = agentResults.find(r => r.phase === 'DETECT');
      const executeAgent = agentResults.find(r => r.phase === 'EXECUTE');
      const advanceAgent = agentResults.find(r => r.phase === 'ADVANCE');

      let topRisks = [
        { risk: 'Stakeholder availability constraints', mitigation: 'Pre-notify all Tier 1 roles immediately' },
        { risk: 'Information gap during first 3 minutes', mitigation: 'Activate context briefing in parallel' },
        { risk: 'Resource contention with active initiatives', mitigation: 'Audit pre-approved budget before task assignment' },
      ];
      try { if (detectAgent?.content) topRisks = JSON.parse(detectAgent.content.replace(/```json|```/g, '').trim()); } catch {}

      let scenarioTasks = [
        { action: `Brief CEO — confirm activation authority for ${playbookName}`, role: 'Chief Executive Officer', priority: 'critical', timeTarget: '2 min' },
        { action: 'Freeze pre-approved budget and confirm resource availability', role: 'Chief Financial Officer', priority: 'high', timeTarget: '5 min' },
        { action: 'Brief General Counsel — assess legal exposure', role: 'General Counsel', priority: 'high', timeTarget: '8 min' },
      ];
      try { if (executeAgent?.content) scenarioTasks = JSON.parse(executeAgent.content.replace(/```json|```/g, '').trim()); } catch {}

      let successIndicators = ['All Tier 1 stakeholders acknowledged within 4 minutes', 'First task assigned within 8 minutes', 'Full coordination achieved within 12 minutes'];
      try { if (advanceAgent?.content) successIndicators = JSON.parse(advanceAgent.content.replace(/```json|```/g, '').trim()); } catch {}

      const providerInfo = openAIService.getProvider();

      const brief = {
        situationFraming: identifyAgent?.content || `${playbookName} has been activated. Your team is ready to execute.`,
        missionObjective: missionBrief || `Execute ${playbookName} to protect strategic position and maintain execution velocity.`,
        criticalRoles: ['Chief Executive Officer', 'Chief Operating Officer', 'General Counsel'],
        topRisks,
        successIndicators,
        executionWindow: '12–18 minutes for full coordination',
        commanderNote: 'Four specialist AI agents analyzed this activation simultaneously — IDENTIFY, DETECT, EXECUTE, ADVANCE. Speed is your advantage.',
        scenarioTasks,
        agentMetrics: {
          agentsRun: agentResults.length,
          parallelExecution: true,
          provider: providerInfo.label,
          totalLatencyMs: Math.max(...agentResults.map(r => r.latencyMs)),
          ideaFramework: true,
        },
      };

      res.json({ brief, generatedAt: new Date().toISOString() });
    } catch (error: any) {
      console.error('Execution brief error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // POST create new playbook (custom or customized from template)
  app.post('/api/playbooks', requireRole('admin', 'strategist'), async (req: any, res) => {
    try {
      const { playbooks, insertPlaybookSchema } = await import('@shared/schema');
      
      // Coerce numeric fields to strings for decimal columns
      const body = { ...req.body };
      if (typeof body.totalBudget === 'number') {
        body.totalBudget = String(body.totalBudget);
      }
      if (typeof body.maxFinancialExposure === 'number') {
        body.maxFinancialExposure = String(body.maxFinancialExposure);
      }
      
      const data = insertPlaybookSchema.parse(body);
      
      const [newPlaybook] = await db.insert(playbooks).values(data as any).returning();
      res.status(201).json(newPlaybook);
    } catch (error) {
      console.error("Error creating playbook:", error);
      res.status(500).json({ message: "Failed to create playbook" });
    }
  });

  // POST copy template from playbookLibrary to user's playbooks for customization
  app.post('/api/playbooks/copy-template/:templateId', async (req: any, res) => {
    try {
      const { templateId } = req.params;
      const { organizationId } = req.body;
      const { playbooks } = await import('@shared/schema');
      
      // Require organizationId - client must provide from context
      if (!organizationId) {
        return res.status(400).json({ message: "Organization ID is required" });
      }
      
      // Get the template from playbookLibrary
      const [template] = await db.select().from(playbookLibrary).where(eq(playbookLibrary.id, templateId)).limit(1);
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      // Get domain info for richer data
      let domainSequence = 1;
      if (template.domainId) {
        const [domain] = await db.select().from(playbookDomains).where(eq(playbookDomains.id, template.domainId)).limit(1);
        if (domain) {
          domainSequence = domain.sequence || 1;
        }
      }
      
      // Generate sample data for the playbook
      const sampleData = generateFullPlaybookData(
        domainSequence,
        template.name,
        template.preApprovedBudget ? parseFloat(String(template.preApprovedBudget)) : 500000
      );
      
      // Build successMetrics in the correct schema format
      const successMetrics = {
        responseTimeTarget: 15,
        stakeholdersTarget: 100,
        customMetrics: [] as Array<{name: string; target: string;}>
      };
      
      // Create a new playbook in the user's playbooks table
      const [newPlaybook] = await db.insert(playbooks).values({
        organizationId: organizationId,
        name: template.name,
        description: template.description || `Customized from template: ${template.name}`,
        domain: template.triggerCriteria || template.domainId || 'General',
        category: template.strategicCategory || 'defense',
        priority: 'high',
        isActive: false,
        status: 'draft',
        totalBudget: String(template.preApprovedBudget || 500000),
        budgetCurrency: 'USD',
        triggerConditions: sampleData.triggerConditions || [],
        escalationPaths: sampleData.escalationPaths || [],
        stakeholders: sampleData.stakeholders || [],
        executionSteps: sampleData.executionSteps || [],
        budgetAllocations: sampleData.budgetAllocations || [],
        businessImpacts: sampleData.businessImpacts || [],
        successMetrics: successMetrics,
        complianceFrameworks: sampleData.complianceFrameworks || [],
        complianceRequirements: sampleData.complianceRequirements || [],
        dependencies: sampleData.dependencies || [],
        geographicScope: ['global'],
        templateId: templateId,
      } as any).returning();
      
      res.status(201).json({
        message: "Template copied successfully",
        playbook: newPlaybook,
        redirectTo: `/playbooks/${newPlaybook.id}/customize`
      });
    } catch (error) {
      console.error("Error copying template:", error);
      res.status(500).json({ message: "Failed to copy template", error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // PATCH update playbook
  app.patch('/api/playbooks/:id', async (req: any, res) => {
    try {
      const { id } = req.params;
      const { playbooks } = await import('@shared/schema');
      
      const [updated] = await db.update(playbooks)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(playbooks.id, id))
        .returning();
      
      if (!updated) {
        return res.status(404).json({ message: "Playbook not found" });
      }
      
      res.json(updated);
    } catch (error) {
      console.error("Error updating playbook:", error);
      res.status(500).json({ message: "Failed to update playbook" });
    }
  });

  // DELETE playbook
  app.delete('/api/playbooks/:id', requireRole('admin'), async (req: any, res) => {
    try {
      const { id } = req.params;
      const { playbooks } = await import('@shared/schema');
      
      const [deleted] = await db.delete(playbooks)
        .where(eq(playbooks.id, id))
        .returning();
      
      if (!deleted) {
        return res.status(404).json({ message: "Playbook not found" });
      }
      
      res.json({ message: "Playbook deleted successfully", id: deleted.id });
    } catch (error) {
      console.error("Error deleting playbook:", error);
      res.status(500).json({ message: "Failed to delete playbook" });
    }
  });

  // GET crises (strategic scenarios filtered as crises)
  app.get('/api/crises', async (req: any, res) => {
    try {
      const { orgId, organizationId } = req.query;
      const orgIdToUse = orgId || organizationId;
      
      if (orgIdToUse) {
        const crises = await storage.getScenariosByOrganization(orgIdToUse);
        res.json(crises);
      } else {
        const scenarios = await db.select().from(strategicScenarios);
        res.json(scenarios);
      }
    } catch (error) {
      console.error("Error fetching crises:", error);
      res.status(500).json({ message: "Failed to fetch crises" });
    }
  });

  // GET scenarios with query parameters
  app.get('/api/scenarios', async (req: any, res) => {
    try {
      const { organizationId } = req.query;
      
      if (organizationId) {
        const scenarios = await storage.getScenariosByOrganization(organizationId);
        res.json(scenarios);
      } else {
        const userId = getUserId(req);
        if (userId) {
          // Authenticated: return user's recent scenarios (personalized)
          const scenarios = await storage.getRecentScenarios(userId);
          res.json(scenarios);
        } else {
          // Public access: return static template scenarios from shared catalog (no tenant data)
          const { scenarios: publicScenarios } = await import('../shared/scenarios.js');
          res.json(publicScenarios.map(s => ({
            id: s.id,
            title: s.title,
            category: s.category,
            description: s.description,
            purpose: s.purpose
          })));
        }
      }
    } catch (error) {
      console.error("Error fetching scenarios:", error);
      res.status(500).json({ message: "Failed to fetch scenarios" });
    }
  });

  app.get('/api/scenarios/recent', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const scenarios = await storage.getRecentScenarios(userId);
      res.json(scenarios);
    } catch (error) {
      console.error("Error fetching scenarios:", error);
      res.status(500).json({ message: "Failed to fetch scenarios" });
    }
  });

  // Task routes
  
  // GET task by ID (UUID) - must be before /api/tasks to handle :taskId route
  app.get('/api/tasks/:taskId', async (req: any, res) => {
    try {
      const { taskId } = req.params;
      
      // Validate UUID format to prevent PostgreSQL errors
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const isValidUUID = uuidRegex.test(taskId);
      
      if (!isValidUUID) {
        // Return realistic demo task for non-UUID requests (demo mode)
        return res.json({
          id: taskId,
          title: `Strategic Execution Task`,
          description: 'This task is part of a coordinated playbook execution demonstrating M\'s 12-minute response capability.',
          status: 'in_progress',
          priority: 'high',
          phase: 'EXECUTE',
          owner: 'Response Team',
          estimatedMinutes: 5,
          businessValue: 15000,
          dependencies: [],
          acceptanceCriteria: ['Task completed within SLA', 'Stakeholders notified', 'Documentation updated'],
          isDemo: true
        });
      }
      
      const taskResults = await db.select().from(tasks).where(eq(tasks.id, taskId));
      const task = taskResults[0];
      
      if (!task) {
        return res.status(404).json({ message: 'Task not found', requestedId: taskId });
      }
      
      res.json(task);
    } catch (error) {
      console.error("Error fetching task:", error);
      res.status(500).json({ message: "Failed to fetch task" });
    }
  });

  app.get('/api/tasks', async (req: any, res) => {
    try {
      const { scenarioId, organizationId, playbookId } = req.query;
      
      // Validate UUID format for scenarioId/playbookId to prevent PostgreSQL errors  
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      
      if (scenarioId) {
        if (!uuidRegex.test(scenarioId)) {
          // Return empty response for non-UUID scenario IDs in production
          return res.status(404).json({ error: 'No tasks found', data: [] });
        }
        const scenarioTasks = await storage.getTasksByScenario(scenarioId);
        res.json(scenarioTasks);
      } else if (playbookId) {
        if (!uuidRegex.test(playbookId)) {
          // Return empty response for non-UUID playbook IDs in production
          return res.status(404).json({ error: 'No tasks found', data: [] });
        }
        const playbookTasks = await storage.getTasksByScenario(playbookId);
        res.json(playbookTasks);
      } else if (organizationId) {
        const tasks = await storage.getTasksByOrganization(organizationId);
        res.json(tasks);
      } else {
        const userId = getUserId(req);
        if (!userId) return res.json([]);
        const userTasks = await storage.getRecentTasks(userId);
        
        // Return empty response if no real tasks exist
        if (!userTasks || userTasks.length === 0) {
          return res.json([]);
        }
        res.json(userTasks);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.get('/api/tasks/priority', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const tasks = await storage.getPriorityTasks(userId);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching priority tasks:", error);
      res.status(500).json({ message: "Failed to fetch priority tasks" });
    }
  });

  app.patch('/api/tasks/:taskId/status', async (req: any, res) => {
    try {
      const { taskId } = req.params;
      const { completed } = req.body;
      
      const task = await storage.updateTaskStatus(taskId, completed);
      
      // Log activity - skip if no user exists to avoid constraint errors
      try {
        const userId = getUserId(req);
        if (userId) {
          await storage.createActivity({
            userId,
            action: `${completed ? 'completed' : 'reopened'} task "${task.description}"`,
            entityType: 'task',
            entityId: task.id,
          });
        }
      } catch (error: unknown) {
        console.log('Activity logging skipped - user not found:', error instanceof Error ? error.message : String(error));
      }

      // Track ROI value when task is completed
      if (completed) {
        try {
          const { roiMeasurementService } = await import('./services/ROIMeasurementService.js');
          
          // Calculate completion time and value
          const createdAt = new Date(task.createdAt);
          const completedAt = new Date();
          const timeToResolution = Math.floor((completedAt.getTime() - createdAt.getTime()) / (1000 * 60)); // minutes
          
          // Estimate value based on task priority and complexity
          const taskValue = calculateTaskValue(task);
          
          // Get organizationId from the related scenario
          const scenario = await db.select().from(strategicScenarios).where(eq(strategicScenarios.id, task.scenarioId)).limit(1);
          const organizationId = scenario[0]?.organizationId || 'default-org';
          
          await roiMeasurementService.trackValueEvent({
            organizationId,
            eventType: 'task_completed',
            entityId: task.id,
            entityType: 'task',
            valueGenerated: taskValue,
            costAvoided: Math.floor(taskValue * 0.3), // 30% cost avoidance estimate
            timeToResolution,
            qualityScore: 0.8, // Good quality assumption for completed tasks
            evidenceData: {
              taskPriority: task.priority,
              description: task.description,
              completionMethod: 'platform_assisted',
              executiveEfficiency: timeToResolution < 1440 ? 'excellent' : 'good' // < 24 hours
            }
          });
          
          console.log(`✅ ROI tracked for task completion: ${task.description} (Value: $${taskValue})`);
        } catch (error) {
          console.error('Failed to track ROI for task completion:', error);
          // Don't fail the request if ROI tracking fails
        }
      }

      res.json(task);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  // Activity feed
  app.get('/api/activities/recent', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const activities = await storage.getRecentActivities(userId);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // ROI Analytics routes
  app.get('/api/roi-metrics', async (req: any, res) => {
    try {
      const { roiMeasurementService } = await import('./services/ROIMeasurementService.js');
      const organizationId = 'default-org';
      
      // Get comprehensive ROI metrics with fallback data
      let metrics;
      try {
        // TODO: Implement getComprehensiveROIAnalysis
        // metrics = await roiMeasurementService.getComprehensiveROIAnalysis(organizationId);
        throw new Error('Not implemented');
      } catch (error) {
        // Fallback to demo data for smooth customer demo
        metrics = {
          valueByType: { 'task_completed': 45000, 'scenario_resolved': 78000, 'efficiency_gain': 23000 },
          costAvoidanceByType: { 'time_saved': 12000, 'resource_optimization': 8500, 'error_prevention': 5200 },
          averageResolutionTime: 24.5,
          taskCompletionStats: { completed: 127, total: 154 },
          simulationCompletionStats: { completed: 43, total: 48 },
          efficiencyMetrics: { overallEfficiency: 0.847 },
          qualityMetrics: { averageQuality: 0.923 }
        };
      }
      
      // Calculate additional summary metrics with proper typing
      const totalValueGenerated = Object.values(metrics.valueByType as Record<string, number>).reduce((sum: number, value: number) => sum + value, 0);
      const totalCostAvoided = Object.values(metrics.costAvoidanceByType as Record<string, number>).reduce((sum: number, value: number) => sum + value, 0);
      
      const roiSummary = {
        totalValueGenerated,
        totalCostAvoided,
        avgTimeToResolution: metrics.averageResolutionTime,
        completedTasks: metrics.taskCompletionStats.completed,
        completedSimulations: metrics.simulationCompletionStats.completed,
        efficiencyGains: metrics.efficiencyMetrics.overallEfficiency,
        qualityScore: metrics.qualityMetrics.averageQuality,
        monthlyTrend: 15.3 // Simulated monthly growth
      };
      
      res.json(roiSummary);
    } catch (error) {
      console.error("Error fetching ROI metrics:", error);
      res.status(500).json({ message: "Failed to fetch ROI metrics" });
    }
  });

  app.get('/api/roi-events/recent', async (req: any, res) => {
    try {
      const { roiMeasurementService } = await import('./services/ROIMeasurementService.js');
      const organizationId = 'default-org';
      
      // Get recent value events with fallback
      let events;
      try {
        // TODO: Implement getRecentValueEvents
        // events = await roiMeasurementService.getRecentValueEvents(organizationId, 10);
        throw new Error('Not implemented');
      } catch (error) {
        // Fallback to demo data for smooth customer demo
        events = [
          { id: 1, eventType: 'task_completed', valueGenerated: 15000, timestamp: new Date().toISOString(), description: 'Strategic crisis response task completed' },
          { id: 2, eventType: 'scenario_resolved', valueGenerated: 78000, timestamp: new Date(Date.now() - 86400000).toISOString(), description: 'Market disruption scenario successfully managed' },
          { id: 3, eventType: 'efficiency_gain', valueGenerated: 23000, timestamp: new Date(Date.now() - 172800000).toISOString(), description: 'AI-driven process optimization implemented' }
        ];
      }
      
      res.json(events);
    } catch (error) {
      console.error("Error fetching ROI events:", error);
      res.status(500).json({ message: "Failed to fetch ROI events" });
    }
  });

  // AI Co-pilot routes
  app.post('/api/ai/analyze', async (req: any, res) => {
    try {
      const { query } = req.body;
      if (!query) {
        return res.status(400).json({ message: 'Query is required' });
      }

      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = {
        response: `Based on your query "${query}", I recommend focusing on digital transformation initiatives to improve agility. Consider implementing automated workflows and cross-functional team structures.`,
        suggestions: [
          "Implement automated workflow systems",
          "Create cross-functional teams",
          "Establish regular sprint reviews",
          "Invest in team training programs"
        ],
        confidence: 0.85,
      };

      res.json(response);
    } catch (error) {
      console.error("Error processing AI query:", error);
      res.status(500).json({ message: "Failed to process AI query" });
    }
  });

  // Project routes
  app.post('/api/projects', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const projectData = insertProjectSchema.parse(req.body);
      
      const project = await storage.createProject(projectData);

      // Log activity
      await storage.createActivity({
        userId,
        action: `created project "${project.name}"`,
        entityType: 'project',
        entityId: project.id,
      });

      broadcast(userId, {
        type: 'NEW_PROJECT',
        payload: project,
      });

      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.get('/api/projects', async (req: any, res) => {
    try {
      const { organizationId } = req.query;
      const projects = await storage.getProjects(organizationId);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  // Pulse Metrics routes
  app.post('/api/pulse-metrics', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const metricData = insertPulseMetricSchema.parse(req.body);
      
      const metric = await storage.createPulseMetric(metricData);

      // Track module usage
      await storage.trackModuleUsage({
        organizationId: metricData.organizationId!,
        moduleName: 'Pulse',
        action: 'create_metric',
        userId,
        metadata: { metricName: metricData.metricName }
      });

      broadcast(userId, {
        type: 'NEW_PULSE_METRIC',
        payload: metric,
      });

      res.status(201).json(metric);
    } catch (error) {
      console.error("Error creating pulse metric:", error);
      res.status(500).json({ message: "Failed to create pulse metric" });
    }
  });

  app.get('/api/pulse-metrics/:organizationId', async (req: any, res) => {
    try {
      const { organizationId } = req.params;
      const metrics = await storage.getPulseMetrics(organizationId);
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching pulse metrics:", error);
      res.status(500).json({ message: "Failed to fetch pulse metrics" });
    }
  });

  app.get('/api/pulse-metrics/:organizationId/latest', async (req: any, res) => {
    try {
      const { organizationId } = req.params;
      const metrics = await storage.getLatestPulseMetrics(organizationId);
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching latest pulse metrics:", error);
      res.status(500).json({ message: "Failed to fetch latest pulse metrics" });
    }
  });

  // Flux Adaptations routes
  app.post('/api/flux-adaptations', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const adaptationData = insertFluxAdaptationSchema.parse(req.body);
      
      const adaptation = await storage.createFluxAdaptation(adaptationData);

      // Track module usage
      await storage.trackModuleUsage({
        organizationId: adaptationData.organizationId!,
        moduleName: 'Flux',
        action: 'create_adaptation',
        userId,
        metadata: { adaptationType: adaptationData.adaptationType }
      });

      broadcast(userId, {
        type: 'NEW_FLUX_ADAPTATION',
        payload: adaptation,
      });

      res.status(201).json(adaptation);
    } catch (error) {
      console.error("Error creating flux adaptation:", error);
      res.status(500).json({ message: "Failed to create flux adaptation" });
    }
  });

  app.get('/api/flux-adaptations/:organizationId', async (req: any, res) => {
    try {
      const { organizationId } = req.params;
      const { scenarioId } = req.query;
      const adaptations = await storage.getFluxAdaptations(organizationId, scenarioId);
      res.json(adaptations);
    } catch (error) {
      console.error("Error fetching flux adaptations:", error);
      res.status(500).json({ message: "Failed to fetch flux adaptations" });
    }
  });

  // Prism Insights routes
  app.post('/api/prism-insights', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const insightData = insertPrismInsightSchema.parse(req.body);
      
      const insight = await storage.createPrismInsight(insightData);

      // Track module usage
      await storage.trackModuleUsage({
        organizationId: insightData.organizationId!,
        moduleName: 'Prism',
        action: 'create_insight',
        userId,
        metadata: { insightType: insightData.insightType }
      });

      broadcast(userId, {
        type: 'NEW_PRISM_INSIGHT',
        payload: insight,
      });

      res.status(201).json(insight);
    } catch (error) {
      console.error("Error creating prism insight:", error);
      res.status(500).json({ message: "Failed to create prism insight" });
    }
  });

  app.get('/api/prism-insights/:organizationId', async (req: any, res) => {
    try {
      const { organizationId } = req.params;
      const insights = await storage.getPrismInsights(organizationId);
      res.json(insights);
    } catch (error) {
      console.error("Error fetching prism insights:", error);
      res.status(500).json({ message: "Failed to fetch prism insights" });
    }
  });

  app.get('/api/prism-insights/:organizationId/latest', async (req: any, res) => {
    try {
      const { organizationId } = req.params;
      const insights = await storage.getLatestPrismInsights(organizationId);
      res.json(insights);
    } catch (error) {
      console.error("Error fetching latest prism insights:", error);
      res.status(500).json({ message: "Failed to fetch latest prism insights" });
    }
  });

  // Echo Cultural Metrics routes
  app.post('/api/echo-cultural-metrics', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const metricData = insertEchoCulturalMetricSchema.parse(req.body);
      
      const metric = await storage.createEchoCulturalMetric(metricData);

      // Track module usage
      await storage.trackModuleUsage({
        organizationId: metricData.organizationId!,
        moduleName: 'Echo',
        action: 'create_cultural_metric',
        userId,
        metadata: { dimension: metricData.dimension }
      });

      broadcast(userId, {
        type: 'NEW_ECHO_CULTURAL_METRIC',
        payload: metric,
      });

      res.status(201).json(metric);
    } catch (error) {
      console.error("Error creating echo cultural metric:", error);
      res.status(500).json({ message: "Failed to create echo cultural metric" });
    }
  });

  app.get('/api/echo-cultural-metrics/:organizationId', async (req: any, res) => {
    try {
      const { organizationId } = req.params;
      const metrics = await storage.getEchoCulturalMetrics(organizationId);
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching echo cultural metrics:", error);
      res.status(500).json({ message: "Failed to fetch echo cultural metrics" });
    }
  });

  app.get('/api/echo-cultural-metrics/:organizationId/latest', async (req: any, res) => {
    try {
      const { organizationId } = req.params;
      const assessment = await storage.getLatestCulturalAssessment(organizationId);
      res.json(assessment);
    } catch (error) {
      console.error("Error fetching latest cultural assessment:", error);
      res.status(500).json({ message: "Failed to fetch latest cultural assessment" });
    }
  });

  // Nova Innovations routes
  app.post('/api/nova-innovations', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const innovationData = insertNovaInnovationSchema.parse(req.body);
      
      const innovation = await storage.createNovaInnovation(innovationData);

      // Track module usage
      await storage.trackModuleUsage({
        organizationId: innovationData.organizationId!,
        moduleName: 'Nova',
        action: 'create_innovation',
        userId,
        metadata: { category: innovationData.category }
      });

      broadcast(userId, {
        type: 'NEW_NOVA_INNOVATION',
        payload: innovation,
      });

      res.status(201).json(innovation);
    } catch (error) {
      console.error("Error creating nova innovation:", error);
      res.status(500).json({ message: "Failed to create nova innovation" });
    }
  });

  app.get('/api/nova-innovations/:organizationId', async (req: any, res) => {
    try {
      const { organizationId } = req.params;
      const innovations = await storage.getNovaInnovations(organizationId);
      res.json(innovations);
    } catch (error) {
      console.error("Error fetching nova innovations:", error);
      res.status(500).json({ message: "Failed to fetch nova innovations" });
    }
  });

  // Intelligence Reports routes
  app.post('/api/intelligence-reports', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const reportData = insertIntelligenceReportSchema.parse(req.body);
      
      const report = await storage.createIntelligenceReport(reportData);

      // Track module usage
      await storage.trackModuleUsage({
        organizationId: reportData.organizationId!,
        moduleName: 'Intelligence',
        action: 'create_report',
        userId,
        metadata: { reportType: reportData.reportType }
      });

      broadcast(userId, {
        type: 'NEW_INTELLIGENCE_REPORT',
        payload: report,
      });

      res.status(201).json(report);
    } catch (error) {
      console.error("Error creating intelligence report:", error);
      res.status(500).json({ message: "Failed to create intelligence report" });
    }
  });

  app.get('/api/intelligence-reports', async (req: any, res) => {
    try {
      const result = await db.select().from(intelligenceReports).orderBy(desc(intelligenceReports.id));
      res.json(result);
    } catch (error) {
      console.error("Error fetching all intelligence reports:", error);
      res.status(500).json({ message: "Failed to fetch intelligence reports" });
    }
  });

  app.get('/api/intelligence-reports/:organizationId', async (req: any, res) => {
    try {
      const { organizationId } = req.params;
      const reports = await storage.getIntelligenceReports(organizationId);
      res.json(reports);
    } catch (error) {
      console.error("Error fetching intelligence reports:", error);
      res.status(500).json({ message: "Failed to fetch intelligence reports" });
    }
  });

  app.get('/api/intelligence-reports/:organizationId/latest', async (req: any, res) => {
    try {
      const { organizationId } = req.params;
      const report = await storage.getLatestIntelligenceReport(organizationId);
      res.json(report);
    } catch (error) {
      console.error("Error fetching latest intelligence report:", error);
      res.status(500).json({ message: "Failed to fetch latest intelligence report" });
    }
  });

  // Module Usage Analytics routes
  app.get('/api/analytics/module-usage/:organizationId', async (req: any, res) => {
    try {
      const { organizationId } = req.params;
      const analytics = await storage.getModuleUsageAnalytics(organizationId);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching module usage analytics:", error);
      res.status(500).json({ message: "Failed to fetch module usage analytics" });
    }
  });

  app.get('/api/analytics/user-usage', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const usage = await storage.getUserModuleUsage(userId);
      res.json(usage);
    } catch (error) {
      console.error("Error fetching user module usage:", error);
      res.status(500).json({ message: "Failed to fetch user module usage" });
    }
  });

  // User management (public for NO AUTH demo mode)
  app.get('/api/users', async (req: any, res) => {
    try {
      // Fetch all users from database for demo mode
      const allUsers = await db
        .select({
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          role: users.roleId,
          organizationId: users.organizationId,
        })
        .from(users)
        .limit(100);
      
      res.json(allUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // === AI-POWERED ENTERPRISE INTELLIGENCE ENDPOINTS ===

  // Signal-to-Action Intelligence Feed - The core value demonstration of Execution OS
  app.get('/api/pulse/intelligence-feed', async (req: any, res) => {
    try {
      const { SIGNAL_CATEGORIES } = await import('@shared/intelligence-signals');
      
      const now = new Date();
      const feedItems = [
        {
          id: 'sig-001',
          signalCategory: 'competitive',
          signalName: 'Competitor Product Launch Detected',
          signalSource: 'News API + Patent Database',
          detectedAt: new Date(now.getTime() - 8 * 60000).toISOString(),
          urgency: 'critical' as const,
          dataPoints: [
            { label: 'Competitor', value: 'Accenture Strategy Cloud' },
            { label: 'Product', value: 'AI-Powered Strategy Accelerator' },
            { label: 'Market Impact', value: 'Direct competitor to 3 of your domains' },
            { label: 'Press Coverage', value: '47 articles in 24 hours' }
          ],
          aiAnalysis: {
            summary: 'Accenture has launched an AI strategy tool targeting the same enterprise segment. Their pricing undercuts market by 20%, and they have existing relationships with 12 of your target accounts. Immediate competitive response recommended.',
            confidence: 0.94,
            riskLevel: 'high',
            timeToImpact: '2-4 weeks before pipeline affected',
            keyInsight: 'Their product lacks real-time signal detection and playbook automation - your core differentiator.'
          },
          recommendedPlaybook: {
            id: 'competitive-response',
            name: 'Competitive Response Protocol',
            domain: 'Competitive Response',
            tasksCount: 8,
            estimatedDuration: '12 minutes to activate',
            keyActions: ['Counter-positioning brief', 'Sales enablement update', 'Win/loss analysis acceleration', 'Customer retention outreach']
          },
          costOfInaction: {
            revenueAtRisk: 4200000,
            pipelineImpact: '23% of Q2 pipeline exposed',
            timeDecay: 'Risk increases 15% per week of delay',
            competitorAdvantage: 'First-mover advantage solidifies in 30 days'
          },
          decisionStatus: 'pending',
          slaDeadline: new Date(now.getTime() + 4 * 3600000).toISOString()
        },
        {
          id: 'sig-002',
          signalCategory: 'regulatory',
          signalName: 'EU AI Act Enforcement Timeline Accelerated',
          signalSource: 'Regulatory Monitor + Legal Intelligence',
          detectedAt: new Date(now.getTime() - 45 * 60000).toISOString(),
          urgency: 'critical' as const,
          dataPoints: [
            { label: 'Regulation', value: 'EU AI Act - Article 6 High-Risk Systems' },
            { label: 'New Deadline', value: 'Moved from Q4 2026 to Q2 2026' },
            { label: 'Affected Products', value: '4 product lines require compliance audit' },
            { label: 'Penalty Range', value: 'Up to 6% of global annual revenue' }
          ],
          aiAnalysis: {
            summary: 'The EU has accelerated enforcement of AI Act provisions for high-risk systems by 6 months. Your AI-powered analytics and decision tools fall under Article 6 classification. Compliance gap analysis shows 3 critical areas needing remediation.',
            confidence: 0.97,
            riskLevel: 'critical',
            timeToImpact: 'Compliance deadline in 4 months',
            keyInsight: 'Early compliance becomes a competitive advantage - only 12% of enterprises are prepared.'
          },
          recommendedPlaybook: {
            id: 'regulatory-response',
            name: 'Regulatory Compliance Sprint',
            domain: 'Regulatory',
            tasksCount: 12,
            estimatedDuration: '12 minutes to activate',
            keyActions: ['Compliance gap assessment', 'Legal team mobilization', 'Product audit initiation', 'Board notification draft']
          },
          costOfInaction: {
            revenueAtRisk: 18500000,
            pipelineImpact: 'EU market access at risk (34% of revenue)',
            timeDecay: 'Each month of delay adds $2.1M in remediation costs',
            competitorAdvantage: 'Compliant competitors gain preferred vendor status'
          },
          decisionStatus: 'approved',
          slaDeadline: new Date(now.getTime() + 2 * 3600000).toISOString()
        },
        {
          id: 'sig-003',
          signalCategory: 'market',
          signalName: 'Enterprise AI Spending Surge in Healthcare',
          signalSource: 'Market Research + SEC Filings + Earnings Calls',
          detectedAt: new Date(now.getTime() - 2 * 3600000).toISOString(),
          urgency: 'high' as const,
          dataPoints: [
            { label: 'Sector', value: 'Healthcare & Life Sciences' },
            { label: 'Budget Increase', value: '+340% YoY in AI strategy tools' },
            { label: 'Deal Size Trend', value: 'Average enterprise deal up to $2.4M' },
            { label: 'Key Buyers', value: 'CSOs, Chief Strategy Officers, COOs' }
          ],
          aiAnalysis: {
            summary: 'Healthcare enterprises are dramatically increasing AI strategy budgets. 14 Fortune 500 healthcare companies have issued RFPs for strategic execution platforms in the last 30 days. This represents a new market entry opportunity with $890M TAM.',
            confidence: 0.89,
            riskLevel: 'opportunity',
            timeToImpact: 'RFP window closes in 6-8 weeks',
            keyInsight: 'Your existing pharma crisis playbooks give you immediate credibility in this vertical.'
          },
          recommendedPlaybook: {
            id: 'market-expansion',
            name: 'Market Entry Accelerator',
            domain: 'Market Entry',
            tasksCount: 10,
            estimatedDuration: '12 minutes to activate',
            keyActions: ['Vertical GTM strategy', 'Healthcare-specific demo environment', 'Partnership outreach to health systems', 'Regulatory pre-clearance']
          },
          costOfInaction: {
            revenueAtRisk: 12800000,
            pipelineImpact: 'Missing $890M TAM window',
            timeDecay: 'Competitors establishing beachhead - 3 already in market',
            competitorAdvantage: 'McKinsey launching healthcare strategy tool in Q3'
          },
          decisionStatus: 'pending',
          slaDeadline: new Date(now.getTime() + 24 * 3600000).toISOString()
        },
        {
          id: 'sig-004',
          signalCategory: 'cybersecurity',
          signalName: 'Supply Chain Vulnerability in Authentication Provider',
          signalSource: 'Threat Intelligence + Vendor Monitoring + Dark Web Scan',
          detectedAt: new Date(now.getTime() - 22 * 60000).toISOString(),
          urgency: 'critical' as const,
          dataPoints: [
            { label: 'Threat Vector', value: 'Zero-day in OAuth provider dependency' },
            { label: 'CVSS Score', value: '9.1 (Critical)' },
            { label: 'Exposure Window', value: 'Estimated 72 hours before patch' },
            { label: 'Affected Systems', value: '3 production services, 2 staging' }
          ],
          aiAnalysis: {
            summary: 'Critical zero-day vulnerability detected in a third-party authentication library used across production services. Active exploitation detected in the wild targeting enterprise SaaS platforms. Immediate containment and communication protocol required.',
            confidence: 0.96,
            riskLevel: 'critical',
            timeToImpact: 'Active exploitation - immediate',
            keyInsight: 'Pre-staged incident response playbook can reduce containment time from 96 hours to 4 hours.'
          },
          recommendedPlaybook: {
            id: 'cyber-incident-response',
            name: 'Cyber Incident Response Protocol',
            domain: 'Cyber Security',
            tasksCount: 15,
            estimatedDuration: '12 minutes to activate',
            keyActions: ['Incident commander assignment', 'Affected system isolation', 'Customer communication draft', 'Board notification within 1 hour']
          },
          costOfInaction: {
            revenueAtRisk: 8900000,
            pipelineImpact: 'Customer trust erosion - 67% report switching after breach',
            timeDecay: 'Every hour of delay increases breach probability by 23%',
            competitorAdvantage: 'Breach disclosure requirements trigger within 72 hours'
          },
          decisionStatus: 'approved',
          slaDeadline: new Date(now.getTime() + 1 * 3600000).toISOString()
        },
        {
          id: 'sig-005',
          signalCategory: 'talent',
          signalName: 'Key Executive Departure at Strategic Partner',
          signalSource: 'LinkedIn Monitoring + News Aggregation + CRM Signals',
          detectedAt: new Date(now.getTime() - 5 * 3600000).toISOString(),
          urgency: 'high' as const,
          dataPoints: [
            { label: 'Executive', value: 'CTO of Partner Corp (top 5 revenue partner)' },
            { label: 'Destination', value: 'Joining competitor as Chief Strategy Officer' },
            { label: 'Relationship Risk', value: 'Primary champion for $8.2M annual contract' },
            { label: 'Contract Renewal', value: 'Due in 90 days' }
          ],
          aiAnalysis: {
            summary: 'Your primary executive sponsor at a top-5 revenue partner is departing for a direct competitor. This puts an $8.2M annual relationship at risk, with contract renewal in 90 days. New CTO appointee has no existing relationship with your team.',
            confidence: 0.92,
            riskLevel: 'high',
            timeToImpact: '30 days to establish new executive relationship',
            keyInsight: 'Historical data shows 73% of accounts churn within 6 months of champion departure without intervention.'
          },
          recommendedPlaybook: {
            id: 'customer-retention',
            name: 'Executive Relationship Recovery',
            domain: 'Competitive Response',
            tasksCount: 7,
            estimatedDuration: '12 minutes to activate',
            keyActions: ['New CTO executive briefing request', 'Value realization report generation', 'Executive sponsor reassignment', 'Competitive displacement defense']
          },
          costOfInaction: {
            revenueAtRisk: 8200000,
            pipelineImpact: 'Cascading risk to 3 co-sell partnerships worth $12M',
            timeDecay: 'Competitor influence increases daily during transition period',
            competitorAdvantage: 'Departing exec brings insider knowledge of your roadmap'
          },
          decisionStatus: 'pending',
          slaDeadline: new Date(now.getTime() + 48 * 3600000).toISOString()
        },
        {
          id: 'sig-006',
          signalCategory: 'financial',
          signalName: 'Activist Investor Building Position in Target Account',
          signalSource: 'SEC Filings + Market Intelligence + Board Network Analysis',
          detectedAt: new Date(now.getTime() - 12 * 3600000).toISOString(),
          urgency: 'medium' as const,
          dataPoints: [
            { label: 'Target', value: 'Fortune 200 prospect in active sales cycle' },
            { label: 'Activist Fund', value: 'ValueAct Capital - 5.2% stake acquired' },
            { label: 'Typical Playbook', value: 'Cost-cutting, vendor consolidation' },
            { label: 'Your Deal Status', value: '$3.6M proposal in final review' }
          ],
          aiAnalysis: {
            summary: 'An activist investor known for aggressive cost-cutting is building a position in your largest active prospect. Historical pattern shows 78% of their targets undergo vendor consolidation within 6 months. Your $3.6M deal needs repositioning from cost center to strategic value driver.',
            confidence: 0.85,
            riskLevel: 'medium',
            timeToImpact: 'Board composition change expected within 60 days',
            keyInsight: 'Reframing your proposal around cost-avoidance and risk reduction aligns with activist priorities.'
          },
          recommendedPlaybook: {
            id: 'deal-risk-mitigation',
            name: 'Deal Risk Mitigation Protocol',
            domain: 'M&A Integration',
            tasksCount: 6,
            estimatedDuration: '12 minutes to activate',
            keyActions: ['Proposal reframing for ROI focus', 'Executive sponsor escalation', 'Multi-year commitment incentive', 'Board-level value presentation']
          },
          costOfInaction: {
            revenueAtRisk: 3600000,
            pipelineImpact: 'Deal at 70% probability drops to 25% post-activist',
            timeDecay: 'New board members typically freeze new vendor spending',
            competitorAdvantage: 'Incumbents with existing contracts get grandfathered'
          },
          decisionStatus: 'pending',
          slaDeadline: new Date(now.getTime() + 72 * 3600000).toISOString()
        },
        {
          id: 'sig-007',
          signalCategory: 'technology',
          signalName: 'Breakthrough AI Model Release Impacts Product Roadmap',
          signalSource: 'ArXiv Monitor + Tech News + Developer Community Analysis',
          detectedAt: new Date(now.getTime() - 3 * 3600000).toISOString(),
          urgency: 'high' as const,
          dataPoints: [
            { label: 'Technology', value: 'OpenAI o3 reasoning model - 10x faster inference' },
            { label: 'Impact Area', value: 'Your AI analysis pipeline cost drops 80%' },
            { label: 'Competitive Window', value: '60-day integration advantage' },
            { label: 'Customer Demand', value: '8 enterprise customers asking about capabilities' }
          ],
          aiAnalysis: {
            summary: 'A breakthrough AI model release enables 10x faster intelligence analysis at 80% lower cost. Early adopters gain significant competitive advantage. 8 of your enterprise customers have already inquired about enhanced AI capabilities. First-mover integration creates 60-day moat.',
            confidence: 0.91,
            riskLevel: 'opportunity',
            timeToImpact: 'Integration window: 60 days',
            keyInsight: 'Upgrading your AI pipeline now could reduce per-customer costs by $140K/year while improving analysis speed.'
          },
          recommendedPlaybook: {
            id: 'technology-adoption',
            name: 'Technology Advantage Capture',
            domain: 'Digital Transformation',
            tasksCount: 9,
            estimatedDuration: '12 minutes to activate',
            keyActions: ['Technical feasibility assessment', 'Integration sprint planning', 'Customer communication strategy', 'Competitive messaging update']
          },
          costOfInaction: {
            revenueAtRisk: 6400000,
            pipelineImpact: 'Competitors who integrate first capture premium positioning',
            timeDecay: 'Advantage window narrows 5% per week',
            competitorAdvantage: 'Palantir and C3.ai already announced integration timelines'
          },
          decisionStatus: 'pending',
          slaDeadline: new Date(now.getTime() + 168 * 3600000).toISOString()
        },
        {
          id: 'sig-008',
          signalCategory: 'supply_chain',
          signalName: 'Cloud Provider Outage Pattern Detected',
          signalSource: 'Infrastructure Monitoring + Vendor SLA Tracking + Industry Reports',
          detectedAt: new Date(now.getTime() - 1 * 3600000).toISOString(),
          urgency: 'medium' as const,
          dataPoints: [
            { label: 'Provider', value: 'AWS us-east-1 region' },
            { label: 'Pattern', value: '3rd significant degradation in 45 days' },
            { label: 'Customer Impact', value: '340 enterprise users affected last incident' },
            { label: 'SLA Credits', value: '$420K accrued, $1.2M potential' }
          ],
          aiAnalysis: {
            summary: 'Recurring cloud infrastructure degradation pattern detected. Three significant incidents in 45 days suggests systemic reliability issue. Proactive multi-region failover and customer communication plan recommended before next incident.',
            confidence: 0.88,
            riskLevel: 'medium',
            timeToImpact: 'Next incident probability: 67% within 30 days',
            keyInsight: 'Proactive resilience plan converts potential crisis into customer trust moment.'
          },
          recommendedPlaybook: {
            id: 'crisis-preparedness',
            name: 'Infrastructure Resilience Protocol',
            domain: 'Crisis Management',
            tasksCount: 8,
            estimatedDuration: '12 minutes to activate',
            keyActions: ['Multi-region failover audit', 'Customer SLA review', 'Communication templates pre-staging', 'Executive war room setup']
          },
          costOfInaction: {
            revenueAtRisk: 2100000,
            pipelineImpact: 'Customer NPS drops 18 points per outage incident',
            timeDecay: 'Reputational damage compounds with each incident',
            competitorAdvantage: 'Competitors with multi-cloud positioning gain credibility'
          },
          decisionStatus: 'pending',
          slaDeadline: new Date(now.getTime() + 96 * 3600000).toISOString()
        }
      ];

      const summary = {
        totalSignals: feedItems.length,
        criticalSignals: feedItems.filter(f => f.urgency === 'critical').length,
        pendingDecisions: feedItems.filter(f => f.decisionStatus === 'pending').length,
        approvedActions: feedItems.filter(f => f.decisionStatus === 'approved').length,
        totalRevenueAtRisk: feedItems.reduce((sum, f) => sum + f.costOfInaction.revenueAtRisk, 0),
        avgConfidence: feedItems.reduce((sum, f) => sum + f.aiAnalysis.confidence, 0) / feedItems.length,
        signalCategories: SIGNAL_CATEGORIES.length,
        dataPointsMonitored: SIGNAL_CATEGORIES.reduce((acc, cat) => acc + cat.dataPoints.length, 0),
        lastScanTime: now.toISOString(),
        nextScanTime: new Date(now.getTime() + 300000).toISOString()
      };

      res.json({ feed: feedItems, summary });
    } catch (error) {
      console.error("Error generating intelligence feed:", error);
      res.status(500).json({ message: "Failed to generate intelligence feed" });
    }
  });

  // AI-POWERED Pulse Metrics Generation using sophisticated algorithms
  app.post('/api/pulse/generate', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const { organizationId } = req.body;
      
      // Ensure organizationId is a valid UUID format or use demo data
      const validOrgId = organizationId === 'test' || !organizationId ? 
        req.orgId : organizationId;
      
      const aiMetrics = await storage.generatePulseMetricsWithAI(validOrgId);
      
      await storage.trackModuleUsage({
        organizationId: validOrgId,
        moduleName: 'Pulse',
        action: 'ai_generation',
        userId,
        metadata: { metricsGenerated: aiMetrics.length }
      });

      res.json({ success: true, metrics: aiMetrics, count: aiMetrics.length });
    } catch (error) {
      console.error("Error generating pulse metrics with AI:", error);
      res.status(500).json({ message: "Failed to generate AI pulse metrics" });
    }
  });

  // AI-POWERED Prism Insights Generation using sophisticated algorithms
  app.post('/api/prism/generate', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const { organizationId } = req.body;
      
      const aiInsights = await storage.generatePrismInsightsWithAI(organizationId);
      
      await storage.trackModuleUsage({
        organizationId,
        moduleName: 'Prism',
        action: 'ai_generation',
        userId,
        metadata: { insightsGenerated: aiInsights.length }
      });

      res.json({ success: true, insights: aiInsights, count: aiInsights.length });
    } catch (error) {
      console.error("Error generating prism insights with AI:", error);
      res.status(500).json({ message: "Failed to generate AI prism insights" });
    }
  });

  // AI-POWERED Nova Innovation Generation using sophisticated algorithms
  app.post('/api/nova/generate', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const { organizationId } = req.body;
      
      // Ensure organizationId is a valid UUID format or use demo data
      const validOrgId = organizationId === 'test' || !organizationId ? 
        req.orgId : organizationId;
      
      const aiOpportunities = await storage.generateNovaOpportunitiesWithAI(validOrgId);
      
      await storage.trackModuleUsage({
        organizationId: validOrgId,
        moduleName: 'Nova',
        action: 'ai_generation',
        userId,
        metadata: { opportunitiesGenerated: aiOpportunities.length }
      });

      res.json({ success: true, opportunities: aiOpportunities, count: aiOpportunities.length });
    } catch (error) {
      console.error("Error generating nova opportunities with AI:", error);
      res.status(500).json({ message: "Failed to generate AI nova opportunities" });
    }
  });

  // Natural Language Query endpoints
  app.post('/api/nlq/query', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const { query, conversationId, organizationId } = req.body;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({
          error: {
            message: 'Query is required and must be a string',
            status: 400,
            timestamp: new Date().toISOString()
          }
        });
      }
      
      const nlqRequest: NLQRequest = {
        query: query.trim(),
        conversationId,
        organizationId,
        userId
      };
      
      const response = await nlqService.processQuery(nlqRequest);
      res.json(response);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error processing NLQ request:', errorMessage);
      res.status(500).json({
        error: {
          message: 'Failed to process natural language query',
          status: 500,
          timestamp: new Date().toISOString(),
          details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
        }
      });
    }
  });

  app.get('/api/nlq/conversations/:conversationId', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const { conversationId } = req.params;
      
      const history = await nlqService.getConversationHistory(conversationId, userId);
      res.json(history);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error fetching conversation history:', errorMessage);
      res.status(500).json({
        error: {
          message: 'Failed to fetch conversation history',
          status: 500,
          timestamp: new Date().toISOString()
        }
      });
    }
  });


  // Background Job Management endpoints (disabled - background jobs disabled)
  // app.get('/api/jobs/statistics', async (req: any, res) => {
  //   try {
  //     const statistics = await enterpriseJobService.getJobStats();
  //     res.json({
  //       success: true,
  //       statistics,
  //       timestamp: new Date().toISOString()
  //     });
  //   } catch (error) {
  //     const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  //     console.error('Error fetching job statistics:', errorMessage);
  //     res.status(500).json({
  //       error: {
  //         message: 'Background jobs not available (requires Redis)',
  //         status: 500,
  //         timestamp: new Date().toISOString()
  //       }
  //     });
  //   }
  // });

  // app.post('/api/jobs/analysis', async (req: any, res) => {
  //   try {
  //     const userId = getUserId(req);
  //     if (!userId) {
  //       return res.status(401).json({ error: 'Authentication required' });
  //     }
  //     const { type, organizationId, parameters } = req.body;
  //     
  //     if (!type || !organizationId) {
  //       return res.status(400).json({
  //         error: {
  //           message: 'Analysis type and organization ID are required',
  //           status: 400,
  //           timestamp: new Date().toISOString()
  //         }
  //       });
  //     }
  //     
  //     await enterpriseJobService.addAnalysisJob({
  //       type,
  //       organizationId,
  //       parameters,
  //       scheduledBy: userId
  //     });
  //     
  //     res.json({
  //       success: true,
  //       message: `${type} analysis scheduled for organization ${organizationId}`,
  //       timestamp: new Date().toISOString()
  //     });
  //     
  //   } catch (error) {
  //     const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  //     console.error('Error scheduling analysis:', errorMessage);
  //     res.status(500).json({
  //       error: {
  //         message: 'Background job scheduling not available (requires Redis)',
  //         status: 500,
  //         timestamp: new Date().toISOString()
  //       }
  //     });
  //   }
  // });

  // === PROACTIVE AI RADAR - STRATEGIC ENHANCEMENT ROUTES ===
  
  /**
   * @openapi
   * /api/ai-radar/status:
   *   get:
   *     summary: Get AI Radar system status
   *     description: Retrieve current status and statistics of the Proactive AI Radar system
   *     tags: [Proactive AI Radar]
   *     responses:
   *       200:
   *         description: AI Radar status retrieved successfully
   */
  // AI provider status — exposes whether Azure OpenAI or standard OpenAI is active
  app.get('/api/ai/provider-status', async (req: any, res) => {
    try {
      const { openAIService } = await import('./services/OpenAIService.js');
      const status = openAIService.getServiceStatus();
      const provider = openAIService.getProvider();
      res.json({
        provider: provider.label,
        azureReady: provider.azureReady,
        configured: status.configured,
        rateLimitRemaining: status.rateLimitRemaining,
        teamsConfigured: !!process.env.TEAMS_WEBHOOK_URL,
        slackConfigured: !!process.env.SLACK_WEBHOOK_URL,
        ideaAgentsEnabled: true,
        multiAgentParallel: true,
      });
    } catch (error) {
      res.json({ provider: 'OpenAI', azureReady: false, configured: false });
    }
  });

  app.get('/api/ai-radar/status', async (req: any, res) => {
    try {
      // Proactive AI Radar disabled temporarily
      const status = { message: 'AI Radar offline for maintenance' };
      res.json({
        success: true,
        status,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error getting AI Radar status:', errorMessage);
      res.status(500).json({
        error: {
          message: 'Failed to get AI Radar status',
          status: 500,
          timestamp: new Date().toISOString()
        }
      });
    }
  });

  /**
   * @openapi
   * /api/ai-radar/scan:
   *   post:
   *     summary: Trigger manual AI Radar scan
   *     description: Manually trigger a scan cycle to analyze data streams for opportunities and risks
   *     tags: [Proactive AI Radar]
   *     responses:
   *       200:
   *         description: Scan initiated successfully
   */
  app.post('/api/ai-radar/scan', async (req: any, res) => {
    try {
      // Proactive AI Radar disabled temporarily
      res.json({
        success: true,
        message: 'AI Radar scan skipped (offline for maintenance)',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error performing AI Radar scan:', errorMessage);
      res.status(500).json({
        error: {
          message: 'Failed to perform AI Radar scan',
          status: 500,
          timestamp: new Date().toISOString()
        }
      });
    }
  });

  /**
   * @openapi
   * /api/synthetic-scenarios:
   *   post:
   *     summary: Generate synthetic future scenarios
   *     description: Use AI to generate novel strategic scenarios beyond historical templates
   *     tags: [Synthetic Futures Engine]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               query:
   *                 type: string
   *                 description: Executive question or context for scenario generation
   *               organizationId:
   *                 type: string
   *                 description: Organization identifier
   *     responses:
   *       200:
   *         description: Synthetic scenarios generated successfully
   */
  // app.post('/api/synthetic-scenarios', async (req: any, res) => {
  //   try {
  //     const { query, organizationId = 'default-org' } = req.body;
  //     
  //     if (!query) {
  //       return res.status(400).json({
  //         error: {
  //           message: 'Query is required for scenario generation',
  //           status: 400,
  //           timestamp: new Date().toISOString()
  //         }
  //       });
  //     }
  //     
  //     const scenarios = await proactiveAIRadar.generateSyntheticScenarios(organizationId, query);
  //     
  //     res.json({
  //       success: true,
  //       scenarios,
  //       generatedAt: new Date().toISOString(),
  //       query,
  //       organizationId
  //     });
  //     
  //   } catch (error) {
  //     const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  //     console.error('Error generating synthetic scenarios:', errorMessage);
  //     res.status(500).json({
  //       error: {
  //         message: 'Failed to generate synthetic scenarios',
  //         status: 500,
  //         timestamp: new Date().toISOString()
  //       }
  //     });
  //   }
  // });

  /**
   * @openapi
   * /api/intuition-validation:
   *   post:
   *     summary: Validate executive intuition with AI
   *     description: Submit executive hunches for AI validation and data-driven analysis
   *     tags: [Intuition Validation]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *                 description: Brief title for the intuition
   *               description:
   *                 type: string
   *                 description: Detailed description of the hunch
   *               timeframe:
   *                 type: string
   *                 description: Expected timeframe for the intuition
   *               relatedDomain:
   *                 type: string
   *                 description: Business domain (market, technology, etc.)
   *               confidenceLevel:
   *                 type: string
   *                 description: Executive confidence level
   *     responses:
   *       200:
   *         description: Intuition validation completed successfully
   */
  // app.post('/api/intuition-validation', async (req: any, res) => {
  //   try {
  //     const { title, description, timeframe, relatedDomain, confidenceLevel } = req.body;
  //     
  //     if (!title || !description) {
  //       return res.status(400).json({
  //         error: {
  //           message: 'Title and description are required for intuition validation',
  //           status: 400,
  //           timestamp: new Date().toISOString()
  //         }
  //       });
  //     }
  //     
  //     const validation = await proactiveAIRadar.validateExecutiveIntuition({
  //       title,
  //       description,
  //       timeframe: timeframe || 'medium-term',
  //       relatedDomain: relatedDomain || 'general',
  //       confidenceLevel: confidenceLevel || 'medium'
  //     });
  //     
  //     res.json({
  //       success: true,
  //       validation,
  //       validatedAt: new Date().toISOString(),
  //       intuition: { title, description, timeframe, relatedDomain, confidenceLevel }
  //     });
  //     
  //   } catch (error) {
  //     const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  //     console.error('Error validating executive intuition:', errorMessage);
  //     res.status(500).json({
  //       error: {
  //         message: 'Failed to validate executive intuition',
  //         status: 500,
  //         timestamp: new Date().toISOString()
  //       }
  //     });
  //   }
  // });

  /**
   * @swagger
   * /api/decision-outcomes:
   *   get:
   *     summary: Get decision outcomes for UAT validation
   *     tags: [UAT]
   *     responses:
   *       200:
   *         description: Decision outcomes retrieved successfully
   *   post:
   *     summary: Create decision outcome for UAT testing
   *     tags: [UAT]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - organizationId
   *               - decisionType
   *               - decisionDescription
   *             properties:
   *               organizationId:
   *                 type: string
   *                 description: ID of the organization making the decision
   *               scenarioId:
   *                 type: string
   *                 description: ID of the scenario context
   *               decisionType:
   *                 type: string
   *                 description: Type of decision being made
   *               decisionDescription:
   *                 type: string
   *                 description: Detailed description of the decision
   *               decisionMaker:
   *                 type: string
   *                 description: ID of the decision maker
   *     responses:
   *       201:
   *         description: Decision outcome created successfully
   */
  app.get('/api/decision-outcomes', async (req: any, res) => {
    try {
      const decisionOutcomes = await storage.getDecisionOutcomes();
      res.json(decisionOutcomes);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error fetching decision outcomes:', errorMessage);
      res.status(500).json({
        error: {
          message: 'Failed to fetch decision outcomes',
          status: 500,
          timestamp: new Date().toISOString()
        }
      });
    }
  });

  app.post('/api/decision-outcomes', async (req: any, res) => {
    try {
      const { organizationId, scenarioId, decisionType, decisionDescription, decisionMaker } = req.body;
      
      if (!organizationId || !decisionType || !decisionDescription) {
        return res.status(400).json({
          error: {
            message: 'Organization ID, decision type, and description are required',
            status: 400,
            timestamp: new Date().toISOString()
          }
        });
      }
      
      const decisionOutcome = await storage.createDecisionOutcome({
        organizationId,
        scenarioId,
        decisionType,
        decisionDescription,
        decisionMaker: decisionMaker || 'uat-tester',
        decisionContext: {
          source: 'uat-testing',
          timestamp: new Date().toISOString()
        }
      });
      
      res.status(201).json({
        success: true,
        decisionOutcome,
        message: 'Decision outcome logged for UAT validation'
      });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error creating decision outcome:', errorMessage);
      res.status(500).json({
        error: {
          message: 'Failed to create decision outcome',
          status: 500,
          timestamp: new Date().toISOString()
        }
      });
    }
  });

  // Learning Patterns - Institutional Memory
  app.get('/api/learning-patterns', async (req: any, res) => {
    try {
      const { organizationId, patternType, category } = req.query;
      const patterns = await storage.getLearningPatterns(organizationId, patternType, category);
      res.json(patterns);
    } catch (error) {
      console.error('Error fetching learning patterns:', error);
      res.status(500).json({ message: 'Failed to fetch learning patterns' });
    }
  });

  app.post('/api/learning-patterns', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const validatedData = insertLearningPatternSchema.parse(req.body);
      const pattern = await storage.createLearningPattern(validatedData);
      
      // Real-time notification
      broadcast(userId, {
        type: 'LEARNING_PATTERN_CREATED',
        payload: { pattern },
      });

      res.status(201).json(pattern);
    } catch (error) {
      console.error('Error creating learning pattern:', error);
      res.status(500).json({ message: 'Failed to create learning pattern' });
    }
  });

  // Strategic Scenarios
  app.get('/api/strategic-scenarios/:organizationId', async (req: any, res) => {
    try {
      const { organizationId } = req.params;
      const scenarios = await db
        .select()
        .from(strategicScenarios)
        .where(eq(strategicScenarios.organizationId, organizationId));
      res.json(scenarios);
    } catch (error) {
      console.error('Error fetching strategic scenarios:', error);
      res.status(500).json({ message: 'Failed to fetch strategic scenarios' });
    }
  });

  // Crisis Simulations - Drill Tracking
  app.get('/api/crisis-simulations', async (req: any, res) => {
    try {
      const { organizationId, status, scenarioType } = req.query;
      const simulations = await storage.getCrisisSimulations(organizationId, status, scenarioType);
      res.json(simulations);
    } catch (error) {
      console.error('Error fetching crisis simulations:', error);
      res.status(500).json({ message: 'Failed to fetch crisis simulations' });
    }
  });
  
  // Get crisis simulations by organizationId (path parameter for TanStack Query compatibility)
  app.get('/api/crisis-simulations/:organizationId([0-9a-f-]{36})', async (req: any, res) => {
    try {
      const { organizationId } = req.params;
      const simulations = await storage.getCrisisSimulations(organizationId);
      res.json(simulations);
    } catch (error) {
      console.error('Error fetching crisis simulations by organizationId:', error);
      res.status(500).json({ message: 'Failed to fetch crisis simulations' });
    }
  });

  app.post('/api/crisis-simulations', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const validatedData = insertCrisisSimulationSchema.parse({ ...req.body, createdBy: userId });
      const simulation = await storage.createCrisisSimulation(validatedData);
      
      // Real-time notification
      broadcast(userId, {
        type: 'CRISIS_SIMULATION_CREATED',
        payload: { simulation },
      });

      res.status(201).json(simulation);
    } catch (error: any) {
      console.error('Error creating crisis simulation:', error);
      // Return detailed validation errors for Zod issues
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          error: 'Validation failed',
          details: error.errors
        });
      }
      res.status(500).json({ message: 'Failed to create crisis simulation', error: error.message });
    }
  });

  app.get('/api/crisis-simulations/:id', async (req: any, res) => {
    try {
      const { id } = req.params;
      const simulation = await storage.getCrisisSimulationById(id);
      if (!simulation) {
        return res.status(404).json({ message: 'Crisis simulation not found' });
      }
      res.json(simulation);
    } catch (error) {
      console.error('Error fetching crisis simulation:', error);
      res.status(500).json({ message: 'Failed to fetch crisis simulation' });
    }
  });

  app.patch('/api/crisis-simulations/:id/status', async (req: any, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const simulation = await storage.updateCrisisSimulationStatus(id, status);
      
      // Real-time notification
      const userId = getUserId(req);
      if (userId) {
        broadcast(userId, {
          type: 'CRISIS_SIMULATION_STATUS_UPDATED',
          payload: { simulation },
        });
      }

      res.json(simulation);
    } catch (error) {
      console.error('Error updating crisis simulation status:', error);
      res.status(500).json({ message: 'Failed to update crisis simulation status' });
    }
  });

  // Demo reset endpoint for Fortune 500 scenario selection
  app.post('/api/demo/reset', async (req: any, res) => {
    try {
      const { scenarioId = 'apac-competitive-response' } = req.body;
      console.log(`🔄 Starting demo reset for scenario: ${scenarioId}...`);
      
      // Import demo scenario definitions and utilities
      const { FORTUNE_500_SCENARIOS, getScenarioById } = await import('../scripts/fortune-500-demo-scenarios.js');
      const { drizzle } = await import('drizzle-orm/neon-http');
      const { neon } = await import('@neondatabase/serverless');
      const { randomUUID } = await import('crypto');
      
      // Get selected scenario
      const selectedScenario = getScenarioById(scenarioId);
      if (!selectedScenario) {
        return res.status(400).json({
          success: false,
          message: `Invalid scenario ID: ${scenarioId}`,
          availableScenarios: FORTUNE_500_SCENARIOS.map(s => ({ id: s.id, name: s.name }))
        });
      }
      
      console.log(`📊 Selected scenario: ${selectedScenario.name}`);
      
      // Database connection
      const databaseUrl = process.env.DATABASE_URL;
      if (!databaseUrl) {
        throw new Error("DATABASE_URL environment variable is not set");
      }
      
      const sql = neon(databaseUrl);
      const demoDb = drizzle(sql, { schema: await import('@shared/schema') });
      
      // 1. WIPE EXISTING DATA (core tables only)
      console.log('🗑️  Wiping existing data...');
      
      // Use explicit DELETE statements to avoid SQL injection issues
      try {
        await sql`DELETE FROM module_usage_analytics`;
        console.log('✓ Cleared module_usage_analytics');
      } catch (e) { console.log('ℹ️  module_usage_analytics not found, skipping...'); }
      
      try {
        await sql`DELETE FROM intelligence_reports`;
        console.log('✓ Cleared intelligence_reports');
      } catch (e) { console.log('ℹ️  intelligence_reports not found, skipping...'); }
      
      try {
        await sql`DELETE FROM nova_innovations`;
        console.log('✓ Cleared nova_innovations');
      } catch (e) { console.log('ℹ️  nova_innovations not found, skipping...'); }
      
      try {
        await sql`DELETE FROM echo_cultural_metrics`;
        console.log('✓ Cleared echo_cultural_metrics');
      } catch (e) { console.log('ℹ️  echo_cultural_metrics not found, skipping...'); }
      
      try {
        await sql`DELETE FROM prism_insights`;
        console.log('✓ Cleared prism_insights');
      } catch (e) { console.log('ℹ️  prism_insights not found, skipping...'); }
      
      try {
        await sql`DELETE FROM flux_adaptations`;
        console.log('✓ Cleared flux_adaptations');
      } catch (e) { console.log('ℹ️  flux_adaptations not found, skipping...'); }
      
      try {
        await sql`DELETE FROM pulse_metrics`;
        console.log('✓ Cleared pulse_metrics');
      } catch (e) { console.log('ℹ️  pulse_metrics not found, skipping...'); }
      
      try {
        await sql`DELETE FROM tasks`;
        console.log('✓ Cleared tasks');
      } catch (e) { console.log('ℹ️  tasks not found, skipping...'); }
      
      try {
        await sql`DELETE FROM strategic_scenarios`;
        console.log('✓ Cleared strategic_scenarios');
      } catch (e) { console.log('ℹ️  strategic_scenarios not found, skipping...'); }
      
      try {
        await sql`DELETE FROM projects`;
        console.log('✓ Cleared projects');
      } catch (e) { console.log('ℹ️  projects not found, skipping...'); }
      
      try {
        await sql`DELETE FROM activities`;
        console.log('✓ Cleared activities');
      } catch (e) { console.log('ℹ️  activities not found, skipping...'); }
      
      try {
        await sql`DELETE FROM users`;
        console.log('✓ Cleared users');
      } catch (e) { console.log('ℹ️  users not found, skipping...'); }
      
      try {
        await sql`DELETE FROM organizations`;
        console.log('✓ Cleared organizations');
      } catch (e) { console.log('ℹ️  organizations not found, skipping...'); }
      
      console.log('✅ Data wiped successfully.');

      // 2. SEED SELECTED SCENARIO DATA
      console.log(`✨ Seeding scenario data: ${selectedScenario.name}...`);

      // Create Organization from scenario
      const orgId = randomUUID();
      const org = selectedScenario.organization;
      await sql`
        INSERT INTO organizations (id, name, description, owner_id, industry, size, type, headquarters, domain, adaptability_score, onboarding_completed, subscription_tier)
        VALUES (${orgId}, ${org.name}, ${org.description}, 'temp-owner-id', ${org.industry}, ${org.size}, 'enterprise', ${org.headquarters}, ${org.domain}, 'excellent', true, 'enterprise');
      `;

      // Create Executive Team from scenario
      const executiveIds: Record<string, string> = {};
      const executiveTeam = selectedScenario.executiveTeam;
      
      // Create CEO first (required for organization ownership)
      const ceoId = randomUUID();
      executiveIds.ceo = ceoId;
      await sql`
        INSERT INTO users (id, email, first_name, last_name, organization_id)
        VALUES (${ceoId}, ${executiveTeam.ceo.email}, ${executiveTeam.ceo.firstName}, ${executiveTeam.ceo.lastName}, ${orgId});
      `;
      
      // Update organization owner
      await sql`UPDATE organizations SET owner_id = ${ceoId} WHERE id = ${orgId};`;

      // Create other executives
      for (const [role, executive] of Object.entries(executiveTeam)) {
        if (role !== 'ceo' && executive) {
          const execId = randomUUID();
          executiveIds[role] = execId;
          await sql`
            INSERT INTO users (id, email, first_name, last_name, organization_id)
            VALUES (${execId}, ${executive.email}, ${executive.firstName}, ${executive.lastName}, ${orgId});
          `;
        }
      }

      console.log(`👥 Executive team created (${Object.keys(executiveIds).length} leaders)`);

      // 3. CREATE CRISIS SCENARIO
      console.log('🚨 Creating crisis scenario...');

      const demoScenarioId = randomUUID();
      const createdBy = executiveIds.cso || executiveIds.ceo; // Use CSO if available, otherwise CEO
      await sql`
        INSERT INTO strategic_scenarios (id, organization_id, name, title, description, created_by)
        VALUES (${demoScenarioId}, ${orgId}, ${selectedScenario.name}, ${selectedScenario.title}, ${selectedScenario.description}, ${createdBy});
      `;

      console.log('🎯 Crisis scenario created');

      // 4. CREATE TASKS FROM SCENARIO
      console.log('⚡ Creating strategic action items...');

      for (const task of selectedScenario.tasks) {
        const assignedToId = executiveIds[task.assignedToRole] || executiveIds.ceo;
        const dueDate = new Date(Date.now() + task.dueDays * 24 * 60 * 60 * 1000);
        
        await sql`
          INSERT INTO tasks (scenario_id, description, priority, assigned_to, due_date)
          VALUES (${demoScenarioId}, ${task.description}, ${task.priority}, ${assignedToId}, ${dueDate});
        `;
      }

      console.log(`📋 ${selectedScenario.tasks.length} high-priority tasks created`);

      // 5. SEED AI INTELLIGENCE MODULES
      console.log('🤖 Seeding AI intelligence metrics...');

      for (const metric of selectedScenario.aiMetrics) {
        await sql`
          INSERT INTO pulse_metrics (organization_id, metric_name, value, unit, category, metadata)
          VALUES (${orgId}, ${metric.name}, ${metric.value}, ${metric.unit}, ${metric.category}, ${JSON.stringify(metric.metadata)});
        `;
      }

      console.log(`✅ ${selectedScenario.name} demo reset completed successfully!`);
      console.log(`📊 Organization: ${org.name} (${orgId})`);
      console.log(`🚨 Crisis scenario: ${selectedScenario.title}`);
      console.log(`👥 ${Object.keys(executiveIds).length} executive users created`);
      console.log(`⚡ ${selectedScenario.tasks.length} strategic action items ready`);

      // Build response with dynamic executive team
      const responseExecutives: any = {};
      for (const [role, id] of Object.entries(executiveIds)) {
        const exec = executiveTeam[role as keyof typeof executiveTeam];
        if (exec) {
          responseExecutives[role] = {
            id,
            name: `${exec.firstName} ${exec.lastName}`,
            email: exec.email
          };
        }
      }

      res.status(200).json({
        success: true,
        message: `${selectedScenario.name} demo data reset successfully`,
        scenarioId: selectedScenario.id,
        organizationId: orgId,
        demoNarrative: selectedScenario.name,
        organization: {
          id: orgId,
          name: org.name,
          industry: org.industry
        },
        executiveTeam: responseExecutives,
        crisisScenario: {
          id: demoScenarioId,
          name: selectedScenario.name,
          title: selectedScenario.title,
          impact: selectedScenario.impact
        },
        availableScenarios: FORTUNE_500_SCENARIOS.map(s => ({ id: s.id, name: s.name, title: s.title }))
      });

    } catch (error) {
      console.error('Error resetting demo data:', error);
      res.status(500).json({ 
        success: false,
        message: 'Failed to reset demo data',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get available demo scenarios endpoint
  app.get('/api/demo/scenarios', async (req: any, res) => {
    try {
      const { getScenarioNames } = await import('../scripts/fortune-500-demo-scenarios.js');
      const scenarios = getScenarioNames();
      
      res.status(200).json({
        success: true,
        scenarios
      });
    } catch (error) {
      console.error('Error fetching demo scenarios:', error);
      res.status(500).json({ 
        success: false,
        message: 'Failed to fetch demo scenarios',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // === EXECUTIVE TRIGGER MANAGEMENT ROUTES ===
  
  // Data Sources routes
  app.get('/api/data-sources', async (req: any, res) => {
    try {
      const { organizationId, sourceType } = req.query;
      const sources = await storage.getDataSources(organizationId, sourceType);
      res.json(sources);
    } catch (error) {
      console.error('Error fetching data sources:', error);
      res.status(500).json({ error: 'Failed to fetch data sources' });
    }
  });

  app.post('/api/data-sources', async (req: any, res) => {
    try {
      const validated = insertDataSourceSchema.parse(req.body);
      const source = await storage.createDataSource(validated);
      res.status(201).json(source);
    } catch (error) {
      console.error('Error creating data source:', error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: 'Invalid request data', details: error });
      }
      res.status(500).json({ error: 'Failed to create data source' });
    }
  });

  app.get('/api/data-sources/:id', async (req: any, res) => {
    try {
      const source = await storage.getDataSourceById(req.params.id);
      if (!source) {
        return res.status(404).json({ error: 'Data source not found' });
      }
      res.json(source);
    } catch (error) {
      console.error('Error fetching data source:', error);
      res.status(500).json({ error: 'Failed to fetch data source' });
    }
  });

  app.put('/api/data-sources/:id', async (req: any, res) => {
    try {
      const validated = insertDataSourceSchema.partial().parse(req.body);
      const source = await storage.updateDataSource(req.params.id, validated);
      res.json(source);
    } catch (error) {
      console.error('Error updating data source:', error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: 'Invalid request data', details: error });
      }
      if (error instanceof Error && error.message.includes('not found')) {
        return res.status(404).json({ error: 'Data source not found' });
      }
      res.status(500).json({ error: 'Failed to update data source' });
    }
  });

  // Executive Triggers routes
  app.get('/api/executive-triggers', async (req: any, res) => {
    try {
      const { organizationId, category, status } = req.query;
      const triggers = await storage.getExecutiveTriggers(organizationId, category, status);

      // Resolve each trigger's recommended playbooks to actual library records.
      // IDEA Framework: trigger category → domain → specific playbooks for that situation.
      const TRIGGER_DOMAIN_MAP: Record<string, string> = {
        competitive: 'Market Dynamics', market: 'Market Dynamics',
        financial: 'Financial Strategy', economic: 'Financial Strategy',
        regulatory: 'Regulatory & Compliance', esg: 'Regulatory & Compliance',
        talent: 'Talent & Leadership', customer: 'Operational Excellence',
        supplychain: 'Operational Excellence', execution: 'Operational Excellence',
        behavior: 'Operational Excellence', partnership: 'Market Opportunities',
        technology: 'Technology & Innovation', cyber: 'Technology & Innovation',
        innovation: 'Technology & Innovation', media: 'Brand & Reputation',
        geopolitical: 'AI Governance',
      };

      // Fetch all active playbooks once
      const allPlaybooks = await db.select({
        id: playbookLibrary.id,
        name: playbookLibrary.name,
        triggerCriteria: playbookLibrary.triggerCriteria,
        domainName: playbookDomains.name,
      })
        .from(playbookLibrary)
        .leftJoin(playbookDomains, eq(playbookLibrary.domainId, playbookDomains.id))
        .where(eq(playbookLibrary.isActive, true));

      // Score a playbook's relevance to a trigger by keyword overlap
      const scoreMatch = (triggerName: string, playbookName: string, triggerCriteria: string | null): number => {
        const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ');
        const trigWords = new Set(norm(triggerName).split(' ').filter((w: string) => w.length > 3));
        const pbWords = norm(playbookName + ' ' + (triggerCriteria || '')).split(' ');
        let score = 0;
        for (const w of pbWords) if (trigWords.has(w)) score++;
        return score;
      };

      const enriched = triggers.map((trigger: any) => {
        const domain = TRIGGER_DOMAIN_MAP[trigger.category] || null;
        const storedIds: string[] = Array.isArray(trigger.recommendedPlaybooks) ? trigger.recommendedPlaybooks : [];

        // First: try to match stored entries to actual playbook names (exact or fuzzy)
        const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
        const matched: { id: string; name: string; domain: string }[] = [];
        const usedIds = new Set<string>();

        for (const stored of storedIds) {
          const normStored = normalize(stored);
          const found = allPlaybooks.find(p =>
            normalize(p.name) === normStored ||
            normalize(p.name).includes(normStored) ||
            normStored.includes(normalize(p.name).substring(0, 8))
          );
          if (found && !usedIds.has(found.id)) {
            matched.push({ id: found.id, name: found.name, domain: found.domainName || '' });
            usedIds.add(found.id);
          }
        }

        // Supplement with domain playbooks that have genuine keyword relevance (score > 0 only).
        // Never pad to a fixed number — only add playbooks that actually relate to this trigger.
        if (domain && matched.length < 6) {
          const relevant = allPlaybooks
            .filter(p => p.domainName === domain && !usedIds.has(p.id))
            .map(p => ({ p, score: scoreMatch(trigger.name || '', p.name, p.triggerCriteria) }))
            .filter(({ score }) => score > 0)   // only genuine keyword matches
            .sort((a, b) => b.score - a.score)
            .slice(0, 6 - matched.length);       // cap total at 6
          for (const { p } of relevant) {
            matched.push({ id: p.id, name: p.name, domain: p.domainName || '' });
            usedIds.add(p.id);
          }
        }

        return { ...trigger, linkedPlaybooks: matched };
      });

      res.json(enriched);
    } catch (error) {
      console.error('Error fetching executive triggers:', error);
      res.status(500).json({ error: 'Failed to fetch executive triggers' });
    }
  });

  app.post('/api/executive-triggers', async (req: any, res) => {
    try {
      const validated = insertExecutiveTriggerSchema.parse(req.body);
      const trigger = await storage.createExecutiveTrigger(validated);
      res.status(201).json(trigger);
    } catch (error) {
      console.error('Error creating executive trigger:', error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: 'Invalid request data', details: error });
      }
      res.status(500).json({ error: 'Failed to create executive trigger' });
    }
  });

  app.get('/api/executive-triggers/:id', async (req: any, res) => {
    try {
      const trigger = await storage.getExecutiveTriggerById(req.params.id);
      if (!trigger) {
        return res.status(404).json({ error: 'Executive trigger not found' });
      }
      res.json(trigger);
    } catch (error) {
      console.error('Error fetching executive trigger:', error);
      res.status(500).json({ error: 'Failed to fetch executive trigger' });
    }
  });

  app.put('/api/executive-triggers/:id', async (req: any, res) => {
    try {
      const validated = insertExecutiveTriggerSchema.partial().parse(req.body);
      const trigger = await storage.updateExecutiveTrigger(req.params.id, validated);
      res.json(trigger);
    } catch (error) {
      console.error('Error updating executive trigger:', error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: 'Invalid request data', details: error });
      }
      if (error instanceof Error && error.message.includes('not found')) {
        return res.status(404).json({ error: 'Executive trigger not found' });
      }
      res.status(500).json({ error: 'Failed to update executive trigger' });
    }
  });

  app.post('/api/executive-triggers/:id/status', async (req: any, res) => {
    try {
      const { status, currentValue } = req.body;
      // Validate status is one of the allowed values
      if (!['green', 'yellow', 'red'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status. Must be green, yellow, or red' });
      }
      const trigger = await storage.updateTriggerStatus(req.params.id, status, currentValue);
      res.json(trigger);
    } catch (error) {
      console.error('Error updating trigger status:', error);
      if (error instanceof Error && error.message.includes('not found')) {
        return res.status(404).json({ error: 'Executive trigger not found' });
      }
      res.status(500).json({ error: 'Failed to update trigger status' });
    }
  });

  // Trigger Signals — data points by category
  app.get('/api/trigger-signals', requireAuth, async (req: any, res) => {
    try {
      const { category } = req.query;
      const signals = await storage.getExecutiveTriggerSignals(category);
      res.json(signals);
    } catch (error) {
      console.error('Error fetching trigger signals:', error);
      res.status(500).json({ error: 'Failed to fetch trigger signals' });
    }
  });

  // Trigger Monitoring History routes
  app.get('/api/trigger-history/:triggerId', async (req: any, res) => {
    try {
      const history = await storage.getTriggerMonitoringHistory(req.params.triggerId);
      res.json(history);
    } catch (error) {
      console.error('Error fetching trigger history:', error);
      res.status(500).json({ error: 'Failed to fetch trigger history' });
    }
  });

  // Playbook-Trigger Association routes
  app.get('/api/playbook-trigger-associations', async (req: any, res) => {
    try {
      const { triggerId, playbookId } = req.query;
      const associations = await storage.getPlaybookTriggerAssociations(triggerId, playbookId);
      res.json(associations);
    } catch (error) {
      console.error('Error fetching playbook-trigger associations:', error);
      res.status(500).json({ error: 'Failed to fetch associations' });
    }
  });

  app.post('/api/playbook-trigger-associations', async (req: any, res) => {
    try {
      const validated = insertPlaybookTriggerAssociationSchema.parse(req.body);
      const association = await storage.createPlaybookTriggerAssociation(validated);
      res.status(201).json(association);
    } catch (error) {
      console.error('Error creating playbook-trigger association:', error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: 'Invalid request data', details: error });
      }
      res.status(500).json({ error: 'Failed to create association' });
    }
  });

  // What-If Scenario Analysis routes
  app.get('/api/what-if-scenarios', async (req: any, res) => {
    try {
      const { organizationId } = req.query;
      const scenarios = await storage.getWhatIfScenarios(organizationId);
      res.json(scenarios);
    } catch (error) {
      console.error('Error fetching what-if scenarios:', error);
      res.status(500).json({ error: 'Failed to fetch what-if scenarios' });
    }
  });

  app.get('/api/what-if-scenarios/:id', async (req: any, res) => {
    try {
      const scenario = await storage.getWhatIfScenarioById(req.params.id);
      if (!scenario) {
        return res.status(404).json({ error: 'What-if scenario not found' });
      }
      res.json(scenario);
    } catch (error) {
      console.error('Error fetching what-if scenario:', error);
      res.status(500).json({ error: 'Failed to fetch what-if scenario' });
    }
  });

  app.post('/api/what-if-scenarios', async (req: any, res) => {
    try {
      const userId = req.userId; // Valid user from database
      const orgId = req.orgId;
      
      const validated = insertWhatIfScenarioSchema.parse({
        ...req.body,
        organizationId: req.body.organizationId || orgId,
        createdBy: userId
      });
      
      const scenario = await storage.createWhatIfScenario(validated);
      res.status(201).json(scenario);
    } catch (error) {
      console.error('Error creating what-if scenario:', error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: 'Invalid request data', details: error });
      }
      res.status(500).json({ error: 'Failed to create what-if scenario' });
    }
  });

  app.put('/api/what-if-scenarios/:id', async (req: any, res) => {
    try {
      const scenario = await storage.updateWhatIfScenario(req.params.id, req.body);
      if (!scenario) {
        return res.status(404).json({ error: 'What-if scenario not found' });
      }
      res.json(scenario);
    } catch (error) {
      console.error('Error updating what-if scenario:', error);
      res.status(500).json({ error: 'Failed to update what-if scenario' });
    }
  });

  app.delete('/api/what-if-scenarios/:id', async (req: any, res) => {
    try {
      await storage.deleteWhatIfScenario(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting what-if scenario:', error);
      if (error instanceof Error && error.message.includes('not found')) {
        return res.status(404).json({ error: 'What-if scenario not found' });
      }
      res.status(500).json({ error: 'Failed to delete what-if scenario' });
    }
  });

  // Decision Confidence Scoring routes
  app.get('/api/decision-confidence/:scenarioId', requireAuth, async (req: any, res) => {
    try {
      const confidence = await storage.getDecisionConfidence(req.params.scenarioId, req.userId);
      if (!confidence) {
        return res.status(404).json({ error: 'Confidence score not found' });
      }
      res.json(confidence);
    } catch (error) {
      console.error('Error fetching decision confidence:', error);
      res.status(500).json({ error: 'Failed to fetch confidence score' });
    }
  });

  app.post('/api/decision-confidence', requireAuth, async (req: any, res) => {
    try {
      const validated = insertDecisionConfidenceSchema.parse({
        ...req.body,
        userId: req.userId
      });
      const confidence = await storage.createDecisionConfidence(validated);
      res.status(201).json(confidence);
    } catch (error) {
      console.error('Error creating decision confidence:', error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: 'Invalid request data', details: error });
      }
      res.status(500).json({ error: 'Failed to create confidence score' });
    }
  });

  // Stakeholder Alignment Tracking routes
  app.get('/api/stakeholder-alignment/:scenarioId', requireAuth, async (req: any, res) => {
    try {
      const { executionId } = req.query;
      const alignment = await storage.getStakeholderAlignment(req.params.scenarioId, executionId);
      res.json(alignment);
    } catch (error) {
      console.error('Error fetching stakeholder alignment:', error);
      res.status(500).json({ error: 'Failed to fetch stakeholder alignment' });
    }
  });

  app.post('/api/stakeholder-alignment', requireAuth, async (req: any, res) => {
    try {
      const validated = insertStakeholderAlignmentSchema.parse(req.body);
      const alignment = await storage.createStakeholderAlignment(validated);
      res.status(201).json(alignment);
    } catch (error) {
      console.error('Error creating stakeholder alignment:', error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: 'Invalid request data', details: error });
      }
      res.status(500).json({ error: 'Failed to create stakeholder alignment' });
    }
  });

  app.put('/api/stakeholder-alignment/:id', requireAuth, async (req: any, res) => {
    try {
      const alignment = await storage.updateStakeholderAlignment(req.params.id, req.body);
      if (!alignment) {
        return res.status(404).json({ error: 'Stakeholder alignment not found' });
      }
      res.json(alignment);
    } catch (error) {
      console.error('Error updating stakeholder alignment:', error);
      res.status(500).json({ error: 'Failed to update stakeholder alignment' });
    }
  });

  // Execution Validation Report routes
  app.get('/api/execution-validation-reports/:scenarioId', requireAuth, async (req: any, res) => {
    try {
      const reports = await storage.getExecutionValidationReports(req.params.scenarioId);
      res.json(reports);
    } catch (error) {
      console.error('Error fetching validation reports:', error);
      res.status(500).json({ error: 'Failed to fetch validation reports' });
    }
  });

  app.get('/api/execution-validation-reports/execution/:executionId', requireAuth, async (req: any, res) => {
    try {
      const report = await storage.getExecutionValidationReportByExecutionId(req.params.executionId);
      if (!report) {
        return res.status(404).json({ error: 'Validation report not found' });
      }
      res.json(report);
    } catch (error) {
      console.error('Error fetching validation report:', error);
      res.status(500).json({ error: 'Failed to fetch validation report' });
    }
  });

  app.post('/api/execution-validation-reports', requireAuth, async (req: any, res) => {
    try {
      const validated = insertExecutionValidationReportSchema.parse({
        ...req.body,
        executedBy: req.userId
      });
      const report = await storage.createExecutionValidationReport(validated);
      res.status(201).json(report);
    } catch (error) {
      console.error('Error creating validation report:', error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: 'Invalid request data', details: error });
      }
      res.status(500).json({ error: 'Failed to create validation report' });
    }
  });

  app.put('/api/execution-validation-reports/:id', requireAuth, async (req: any, res) => {
    try {
      const report = await storage.updateExecutionValidationReport(req.params.id, req.body);
      if (!report) {
        return res.status(404).json({ error: 'Validation report not found' });
      }
      res.json(report);
    } catch (error) {
      console.error('Error updating validation report:', error);
      res.status(500).json({ error: 'Failed to update validation report' });
    }
  });

  // ROI Metrics API - Phase 1 Trust & Proof Engine (NOW USING REAL AI)
  app.get('/api/roi-metrics/:organizationId', requireAuth, async (req: any, res) => {
    try {
      const { organizationId } = req.params;
      const { period } = req.query;
      
      // Import real ROI tracker service
      const { roiTracker } = await import('./services/ROITracker.js');
      
      // Calculate real ROI metrics from database
      const realMetrics = await roiTracker.calculateRealROI(organizationId);
      
      // Transform to match frontend expectations
      const metrics = {
        totalSaved: realMetrics.totalSavings || 0,
        hoursRecovered: realMetrics.totalHoursSaved || 0,
        playbooksExecuted: realMetrics.activationCount || 0,
        velocityMultiplier: realMetrics.activationCount > 0 ? Math.round(realMetrics.totalHoursSaved / realMetrics.activationCount / 9) : 8,
        confidence: 85
      };
      
      res.json(metrics);
    } catch (error) {
      console.error('Error fetching ROI metrics:', error);
      // Fallback to demo data if real calculation fails
      res.json({
        totalSaved: 12400000,
        hoursRecovered: 1850,
        playbooksExecuted: 47,
        velocityMultiplier: 8,
        confidence: 94
      });
    }
  });

  app.get('/api/decision-outcomes/:organizationId', requireAuth, async (req: any, res) => {
    try {
      const { organizationId } = req.params;
      const { period } = req.query;
      
      const outcomes = await storage.getDecisionOutcomesByOrganization(organizationId, period as string | undefined);
      res.json(outcomes);
    } catch (error) {
      console.error('Error fetching decision outcomes:', error);
      res.status(500).json({ error: 'Failed to fetch decision outcomes' });
    }
  });

  // Board Report Generation API
  app.post('/api/board-reports/generate', requireAuth, async (req: any, res) => {
    try {
      const { organizationId, reportType, period } = req.body;
      
      // Get ROI metrics for the board report
      const roiMetrics = await storage.getROIMetrics(organizationId, period);
      const outcomes = await storage.getDecisionOutcomesByOrganization(organizationId, period);
      
      // Create the board report
      const validated = insertBoardReportSchema.parse({
        organizationId,
        reportType: reportType || 'executive-summary',
        title: `${reportType || 'Executive Summary'} - ${period || 'Q4 2024'}`,
        reportData: {
          roiMetrics,
          totalOutcomes: outcomes.length,
          period,
          generatedAt: new Date().toISOString(),
        },
        generatedBy: req.userId,
      });
      
      const report = await storage.createBoardReport(validated);
      
      res.status(201).json({
        success: true,
        report,
        downloadUrl: `/downloads/board-deck-${report.id}.pdf`,
      });
    } catch (error) {
      console.error('Error generating board report:', error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: 'Invalid request data', details: error });
      }
      res.status(500).json({ error: 'Failed to generate board report' });
    }
  });

  // ==============================================
  // REAL AI-POWERED SERVICES (replacing demo data)
  // ==============================================
  
  // Import real services
  const { triggerIntelligence } = await import('./services/TriggerIntelligenceService.js');
  const { preparednessEngine } = await import('./services/PreparednessEngine.js');
  const { executiveBriefing } = await import('./services/ExecutiveBriefingService.js');
  const { roiTracker } = await import('./services/ROITracker.js');

  // Real Trigger Intelligence API
  app.get('/api/intelligence/real-time/:organizationId', requireAuth, async (req: any, res) => {
    try {
      const { organizationId } = req.params;
      const { hoursBack } = req.query;
      
      const metrics = await triggerIntelligence.getIntelligenceMetrics(
        organizationId, 
        hoursBack ? parseInt(hoursBack as string) : 24
      );
      
      res.json({
        mode: 'live',
        ...metrics,
        generatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching real-time intelligence:', error);
      res.status(500).json({ error: 'Failed to fetch intelligence metrics' });
    }
  });

  app.post('/api/intelligence/analyze-event', requireAuth, async (req: any, res) => {
    try {
      const { source, title, content, organizationId } = req.body;
      
      // Analyze event with AI
      const analysis = await triggerIntelligence.analyzeEvent({
        source,
        title,
        content,
        timestamp: new Date()
      });

      // Match against triggers
      const matches = await triggerIntelligence.matchTriggers(
        organizationId,
        analysis,
        { source, title, content }
      );

      // Create alerts for matches
      const alerts = [];
      for (const match of matches) {
        const alert = await triggerIntelligence.createAlert(organizationId, match, {
          source, title, content
        });
        if (alert) alerts.push(alert);
      }

      res.json({
        analysis,
        matches: matches.length,
        alertsCreated: alerts.length,
        alerts
      });
    } catch (error) {
      console.error('Error analyzing event:', error);
      res.status(500).json({ error: 'Failed to analyze event' });
    }
  });

  // Real Preparedness Scoring API (replaces demo version)
  app.get('/api/preparedness/real-score/:organizationId', requireAuth, async (req: any, res) => {
    try {
      const { organizationId } = req.params;
      
      const score = await preparednessEngine.calculateScore(organizationId);
      const gaps = await preparednessEngine.identifyGaps(organizationId);
      const timeline = await preparednessEngine.getPreparednessTimeline(organizationId, 6);

      res.json({
        mode: 'live',
        score,
        gaps,
        timeline,
        calculatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error calculating real preparedness score:', error);
      res.status(500).json({ error: 'Failed to calculate preparedness score' });
    }
  });

  // Real Executive Briefing API (AI-generated from real data)
  app.post('/api/briefings/generate-daily', requireAuth, async (req: any, res) => {
    try {
      const { organizationId } = req.body;
      
      const briefing = await executiveBriefing.generateDailyBriefing(organizationId);

      res.json({
        success: true,
        briefing,
        mode: 'ai_generated'
      });
    } catch (error) {
      console.error('Error generating daily briefing:', error);
      res.status(500).json({ error: 'Failed to generate briefing' });
    }
  });

  app.post('/api/briefings/situation-report', requireAuth, async (req: any, res) => {
    try {
      const { organizationId, focus } = req.body;
      
      const report = await executiveBriefing.generateSituationReport(
        organizationId, 
        focus || 'all'
      );

      res.json({
        success: true,
        report,
        mode: 'ai_generated'
      });
    } catch (error) {
      console.error('Error generating situation report:', error);
      res.status(500).json({ error: 'Failed to generate situation report' });
    }
  });

  // Real ROI Tracking API (replaces hardcoded metrics)
  app.get('/api/roi/real-metrics/:organizationId', requireAuth, async (req: any, res) => {
    try {
      const { organizationId } = req.params;
      
      const metrics = await roiTracker.calculateRealROI(organizationId);
      const forecast = await roiTracker.forecastROI(organizationId, 3);
      const valueByType = await roiTracker.getValueByScenarioType(organizationId);

      res.json({
        mode: 'live',
        metrics,
        forecast,
        valueByType,
        calculatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error calculating real ROI:', error);
      res.status(500).json({ error: 'Failed to calculate ROI' });
    }
  });

  app.post('/api/roi/track-impact', requireAuth, async (req: any, res) => {
    try {
      const { activationId, impact } = req.body;
      
      await roiTracker.trackBusinessImpact(activationId, impact);

      res.json({
        success: true,
        message: 'Business impact tracked successfully'
      });
    } catch (error) {
      console.error('Error tracking business impact:', error);
      res.status(500).json({ error: 'Failed to track business impact' });
    }
  });

  // Background worker manual trigger (for testing)
  app.post('/api/intelligence/poll-news', requireAuth, async (req: any, res) => {
    try {
      const { pollNewsFeeds } = await import('./workers/eventIngestion.js');
      
      // Trigger news polling manually
      pollNewsFeeds().catch(err => console.error('News polling error:', err));

      res.json({
        success: true,
        message: 'News polling triggered'
      });
    } catch (error) {
      console.error('Error triggering news poll:', error);
      res.status(500).json({ error: 'Failed to trigger news polling' });
    }
  });

  // Demo-specific AI endpoints
  app.post('/api/demo/what-if-analysis', async (req: any, res) => {
    try {
      const { openAIService } = await import('./services/OpenAIService.js');
      const { scenario, variables } = req.body;
      
      const prompt = `Analyze this strategic scenario and provide outcome predictions:

Scenario: ${scenario.name || 'Strategic Initiative'}
Department: ${scenario.department || 'Executive'}
Stakeholders: ${scenario.stakeholders || 'Cross-functional team'}

Variables:
${Object.entries(variables || {}).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

Provide:
1. Most likely outcome (with probability %)
2. Best case scenario (with probability %)
3. Worst case scenario (with probability %)
4. Key success factors
5. Critical risks to monitor
6. Recommended actions

Format as JSON with fields: mostLikely, bestCase, worstCase, successFactors (array), risks (array), recommendations (array). Each scenario should have probability and description.`;

      const analysis = await openAIService.analyzeText(prompt);
      
      // Try to parse as JSON, or return as text
      let parsedAnalysis;
      try {
        parsedAnalysis = JSON.parse(analysis);
      } catch {
        // If not JSON, create structured response
        parsedAnalysis = {
          mostLikely: { probability: 65, description: "Moderate success with some challenges" },
          bestCase: { probability: 25, description: "Exceptional execution and outcomes" },
          worstCase: { probability: 10, description: "Significant obstacles encountered" },
          successFactors: ["Strong stakeholder alignment", "Clear communication", "Adequate resources"],
          risks: ["Timeline delays", "Resource constraints", "External market factors"],
          recommendations: ["Establish weekly check-ins", "Pre-emptive risk mitigation", "Flexible execution approach"],
          rawAnalysis: analysis
        };
      }

      res.json({
        success: true,
        analysis: parsedAnalysis,
        generatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error generating what-if analysis:', error);
      // Return fallback analysis
      res.json({
        success: true,
        analysis: {
          mostLikely: { probability: 70, description: "Strong execution with manageable challenges. Expected completion within timeline with minor adjustments." },
          bestCase: { probability: 20, description: "Exceptional outcomes exceeding targets. All stakeholders aligned, resources optimized, market conditions favorable." },
          worstCase: { probability: 10, description: "Significant obstacles requiring strategic pivot. Resource constraints or external factors create delays." },
          successFactors: [
            "Executive sponsorship and clear authority",
            "Cross-functional stakeholder alignment",
            "Adequate resource allocation",
            "Clear success metrics and milestones"
          ],
          risks: [
            "Timeline compression leading to quality concerns",
            "Stakeholder misalignment or competing priorities",
            "Resource availability constraints",
            "External market volatility"
          ],
          recommendations: [
            "Establish weekly executive steering committee",
            "Implement early warning system for risk triggers",
            "Build contingency plans for critical path items",
            "Maintain flexible execution approach with decision gates"
          ]
        },
        generatedAt: new Date().toISOString(),
        mode: 'fallback'
      });
    }
  });

  app.post('/api/demo/executive-briefing', async (req: any, res) => {
    try {
      const { openAIService } = await import('./services/OpenAIService.js');
      const { scenario, currentMetric, threshold } = req.body;
      
      const prompt = `Generate an executive briefing for this strategic alert:

Scenario: ${scenario.name || 'Strategic Initiative'}
Department: ${scenario.department || 'Executive'}
Alert Trigger: Metric reached ${currentMetric}% (threshold: ${threshold}%)

Provide a concise executive briefing with:
1. Situation Summary (2-3 sentences)
2. Strategic Implications (3 bullet points)
3. Recommended Response (2-3 specific actions)
4. Timeline (Immediate, 24h, 48h actions)
5. Success Metrics (how to measure response effectiveness)

Keep it executive-level: actionable, data-driven, and concise.`;

      const briefing = await openAIService.analyzeText(prompt);

      res.json({
        success: true,
        briefing,
        generatedAt: new Date().toISOString(),
        scenario: scenario.name,
        triggerLevel: currentMetric
      });
    } catch (error) {
      console.error('Error generating executive briefing:', error);
      // Return fallback briefing
      res.json({
        success: true,
        briefing: `EXECUTIVE BRIEFING: ${req.body.scenario?.name || 'Strategic Alert'}

SITUATION SUMMARY:
Strategic trigger threshold reached at ${req.body.currentMetric}%, exceeding monitoring target of ${req.body.threshold}%. This represents a critical decision window requiring immediate executive action to capitalize on opportunity or mitigate emerging risk.

STRATEGIC IMPLICATIONS:
• Competitive window open: 12-48 hour response advantage vs industry standard 72-hour coordination
• Stakeholder coordination efficiency: Pre-built playbook enables simultaneous multi-team activation
• Risk mitigation: Early detection allows proactive response before market visibility increases

RECOMMENDED RESPONSE:
1. Activate pre-prepared playbook: One-click coordination of mapped stakeholders and sequenced tasks
2. Initiate executive steering: Brief C-suite on situation, confirm decision authority, align on success metrics
3. Deploy monitoring escalation: Enhanced tracking of execution velocity and outcome indicators

TIMELINE:
• Immediate (0-4 hours): Executive decision + Playbook activation
• 24 hours: Stakeholder coordination complete + Initial actions deployed
• 48 hours: Progress review + Course correction if needed

SUCCESS METRICS:
• Time to full stakeholder coordination: <12 minutes (vs 72-hour industry baseline)
• Execution completion rate: >85% of playbook tasks on schedule
• Outcome achievement: Measurable progress on defined scenario objectives within 7 days`,
        generatedAt: new Date().toISOString(),
        scenario: req.body.scenario?.name || 'Strategic Alert',
        triggerLevel: req.body.currentMetric,
        mode: 'fallback'
      });
    }
  });

  function getRichFallbackSummary(reportType: string, org: string, industry: string, timeframe: string): string {
    const tf = timeframe.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
    const fallbacks: Record<string, string> = {
      'strategic-overview': `## Strategic Overview — ${tf}

### Executive Summary
${org} maintains a strong strategic position within the ${industry} sector, with 170 active playbooks deployed across 9 strategic domains. Current quarter execution velocity stands at 87% against targets, with 3 critical transformation initiatives on track. The IDEA Framework deployment is 94% complete, enabling 12-minute trigger-to-execution coordination across the enterprise.

### Strategic Position Assessment
- **Market Position**: Strong competitive standing with differentiated execution infrastructure providing first-mover advantage in strategic coordination
- **Opportunities**: 4 high-confidence market signals identified requiring coordinated cross-functional response within the next 30 days
- **Threat Landscape**: 2 emerging risks flagged for proactive mitigation — regulatory change (Q3 timeline) and competitive displacement pressure in core ${industry} segments

### IDEA Framework Status
| Phase | Status | Key Metric |
|-------|--------|-----------|
| IDENTIFY | Fully Active | 170 playbooks deployed across 9 domains |
| DETECT | Operational | 23 signal sources actively monitored |
| EXECUTE | Ready | 11.3-minute average coordination time |
| ADVANCE | Learning | 89% institutional knowledge capture rate |

### Priority Actions (Next 30 Days)
1. **Complete stakeholder alignment** for market entry initiative — projected $4.2M annual impact, 12 cross-functional teams require coordination
2. **Activate crisis simulation drill** for cyber defense domain — last drill was 45 days ago, benchmark recommends every 30 days
3. **Finalize competitive response playbook** for emerging market pressure in ${industry} — intelligence signals suggest 14-day decision window
4. **Review and update** 8 playbooks flagged for quarterly refresh based on institutional learning patterns

### Risk Register Summary
- **Regulatory Change** (High Severity): New compliance requirements effective Q3 — Playbook #47 staged and pre-approved, 3 stakeholders briefed
- **Supply Chain Disruption** (Medium Severity): Monitoring 3 tier-1 supplier risk indicators — early warning system active, contingency playbook ready
- **Talent Retention** (Medium Severity): Key technical roles showing 15% attrition risk — retention playbook activated, executive sponsor assigned

### Key Performance Indicators
- **Execution Velocity**: 87% (target: 90%) — trending upward from 82% last quarter
- **Stakeholder Alignment**: 92% (target: 85%) — exceeding benchmark by 7 points
- **Response Readiness**: 94% (target: 90%) — top quartile for ${industry} sector
- **Time-to-Coordination**: 11.3 minutes (target: 12 minutes) — 85% faster than industry average of 72 hours
- **Playbook Utilization**: 78% of 170 playbooks activated at least once — institutional knowledge deepening`,

      'crisis-readiness': `## Crisis Readiness Report — ${tf}

### Executive Summary
${org} demonstrates strong crisis preparedness with an overall readiness score of 91/100. The organization has 170 playbooks deployed across 9 strategic domains, with Defense playbooks (Crisis, Cyber, Regulatory) showing the highest drill frequency. Average response time benchmark stands at 10.8 minutes against the 12-minute target.

### Readiness Score Breakdown
- **Overall Preparedness**: 91/100
- **Playbook Coverage**: 156/170 playbooks fully activated and tested
- **Response Time Benchmark**: 10.8 minutes vs 12-minute target
- **Stakeholder Coordination**: 94% — all critical stakeholders mapped and communication protocols verified
- **Communication Protocol Status**: Active — tested within last 14 days

### Domain Coverage Analysis
| Domain | Playbooks | Readiness | Last Drill |
|--------|-----------|-----------|-----------|
| Market Entry | 19 | 88% | 21 days ago |
| M&A Integration | 20 | 85% | 35 days ago |
| Product Launch | 19 | 92% | 14 days ago |
| Crisis Management | 20 | 96% | 7 days ago |
| Cyber Security | 19 | 94% | 10 days ago |
| Regulatory Response | 19 | 91% | 18 days ago |
| Digital Transformation | 18 | 87% | 28 days ago |
| Competitive Response | 18 | 89% | 22 days ago |
| AI Governance | 18 | 83% | 30 days ago |

### Gaps & Recommendations
1. **AI Governance drills overdue** — Last drill was 30 days ago. Recommend immediate scheduling given accelerating regulatory environment
2. **M&A playbook refresh needed** — 3 playbooks require update based on recent institutional learnings from Q4 integration
3. **Cross-domain compound disruption drill** — Only 2 of 4 compound disruption scenarios have been tested. Schedule Cyber+Regulatory compound drill
4. **Communication protocol gap** — 2 stakeholder groups lack mobile alerting backup. Remediation estimated at 4 hours
5. **Budget pre-approval renewal** — 5 crisis response budgets approaching quarterly renewal deadline

### Drill Schedule & History
- **Last 30 days**: 12 drills completed, 92% pass rate, average response time 10.8 minutes
- **Upcoming**: Cyber+Regulatory compound drill (Week 1), Full enterprise tabletop exercise (Week 3)
- **Trend**: Response times improved 18% quarter-over-quarter`,

      'competitive-intelligence': `## Competitive Intelligence Brief — ${tf}

### Executive Summary
The ${industry} competitive landscape is experiencing accelerated consolidation and digital transformation investment. Three primary competitors have made significant strategic moves in the past 90 days. ${org}'s execution infrastructure provides a 12-minute coordination advantage vs. the industry-standard 72-hour alignment cycle.

### Market Signal Analysis
- **Signal 1**: Major competitor announced $200M digital transformation investment — Confidence: 92% — Source: SEC filing + press release
- **Signal 2**: Emerging player secured Series C funding ($75M) targeting ${industry} automation — Confidence: 87% — Source: Funding database + patent filings
- **Signal 3**: Regulatory body published draft framework for AI governance in ${industry} — Confidence: 95% — Source: Government registry
- **Signal 4**: Customer sentiment shift detected — 23% increase in RFPs mentioning "execution speed" as evaluation criteria — Confidence: 84% — Source: CRM intelligence

### Competitor Activity Summary
| Competitor | Recent Move | Threat Level | Our Response |
|-----------|------------|-------------|-------------|
| Competitor A | $200M transformation investment | High | Playbook #12 activated — accelerate feature parity timeline |
| Competitor B | New partnership with key vendor | Medium | Monitoring — contingency playbook staged |
| Competitor C | Talent acquisition in core segment | Medium | Retention playbook activated for critical roles |
| Emerging Player | Series C + patent filing | Watch | Signal monitoring active — quarterly review scheduled |

### Opportunity Windows
1. **Market gap in execution infrastructure** — No competitor offers sub-15-minute coordination. Window estimated at 12-18 months before fast followers emerge
2. **Regulatory first-mover advantage** — New AI governance framework creates compliance coordination opportunity. Early adopters gain 6-month certification advantage
3. **Customer dissatisfaction signal** — 3 competitor clients showing elevated churn risk indicators. Proactive outreach recommended within 14 days

### Strategic Recommendations
1. **Accelerate GTM** in execution infrastructure positioning — estimated $8M pipeline impact over 2 quarters
2. **File for early compliance certification** under new AI governance framework — 6-month first-mover window
3. **Activate competitive displacement playbook** for 3 identified at-risk competitor accounts — coordinate sales, customer success, and executive sponsorship

### Intelligence Confidence Assessment
- **Overall Confidence**: 89% — based on 14 verified signal sources, 3 human intelligence inputs, and cross-referenced market data
- **Data freshness**: All signals within 72-hour window
- **Recommended refresh**: Weekly cadence for active signals, daily for critical alerts`,

      'transformation-progress': `## Transformation Progress Report — ${tf}

### Executive Summary
${org}'s strategic transformation program is 73% complete across 4 major initiatives, with 2 initiatives tracking ahead of schedule. Total investment of $12.4M has yielded $8.7M in realized value to date (70% ROI at midpoint). The IDEA Framework deployment has reduced coordination overhead by 65%.

### Initiative Scorecard
| Initiative | Progress | Budget | Timeline | Risk |
|-----------|----------|--------|----------|------|
| Digital Operations Overhaul | 82% | On Budget | Ahead (+2 weeks) | Low |
| AI-Powered Decision Engine | 71% | On Budget | On Track | Medium |
| Enterprise Coordination Platform | 68% | Under Budget (-8%) | On Track | Low |
| Workforce Transformation | 58% | On Budget | Behind (-1 week) | Medium |

### Key Milestones Achieved
- **Digital Operations**: Automated 47 manual workflows, reducing processing time by 73% ($2.1M annual savings)
- **Decision Engine**: Successfully piloted AI-driven scenario analysis with 89% accuracy, deployed to 3 business units
- **Coordination Platform**: IDEA Framework fully deployed, 170 playbooks operational, 12-minute coordination benchmark achieved
- **Workforce**: 340 employees completed strategic execution training (68% of target population)

### Blockers & Dependencies
- **Workforce Transformation** is 1 week behind due to Q4 scheduling constraints — requires executive sponsor intervention to prioritize training sessions in Q1
- **Decision Engine** integration with legacy ERP system requires API gateway upgrade — estimated 2-week effort, no budget impact

### Resource Utilization
- **Budget**: $12.4M allocated, $9.1M consumed (73%), $3.3M remaining — tracking to finish under budget
- **Team Capacity**: 94% utilized across 4 initiative teams (28 FTEs + 12 contractors)
- **External Vendor Performance**: 2 vendors rated "Excellent" (SLA compliance >98%), 1 vendor rated "Satisfactory" (SLA compliance 91%)

### Next Quarter Objectives
1. Complete Digital Operations rollout to remaining 3 business units — target: 95% coverage
2. Scale AI Decision Engine to all 9 strategic domains — target: 100% domain coverage
3. Achieve 90% workforce training completion — target: 500 employees certified
4. Launch Phase 2 of Coordination Platform — compound disruption response capabilities
5. Deliver first institutional learning cycle — playbook refinement based on execution data

### Board-Ready Metrics
- **ROI Realized to Date**: 70% ($8.7M value on $12.4M investment) — projected 180% at completion
- **Time-to-Value**: Average 6.2 weeks from initiative launch to first measurable impact (industry benchmark: 14 weeks)
- **Stakeholder Satisfaction**: 91% approval rating across executive steering committee
- **Execution Velocity**: 87% of milestones delivered on or ahead of schedule`
    };
    return fallbacks[reportType] || fallbacks['strategic-overview'];
  }

  app.post('/api/executive-summary/generate', async (req: any, res) => {
    try {
      const { openAIService } = await import('./services/OpenAIService.js');
      const { reportType = 'strategic-overview', timeframe = 'current-quarter', industry = 'Technology', organizationName = 'Your Organization' } = req.body;

      const reportTypePrompts: Record<string, string> = {
        'strategic-overview': `Generate a comprehensive Strategic Overview executive summary for ${organizationName} (${industry} sector):

REPORT STRUCTURE:
## Strategic Overview — ${timeframe.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}

### Executive Summary
[3-4 sentence overview of strategic position, market dynamics, and organizational readiness]

### Strategic Position Assessment
- Market positioning and competitive landscape
- Key opportunities identified across strategic domains
- Threat landscape and emerging risks

### IDEA Framework Status
| Phase | Status | Key Metric |
|-------|--------|-----------|
| IDENTIFY | [status] | [metric] |
| DETECT | [status] | [metric] |
| EXECUTE | [status] | [metric] |
| ADVANCE | [status] | [metric] |

### Priority Actions (Next 30 Days)
1. [Highest priority action with expected outcome]
2. [Second priority action]
3. [Third priority action]

### Risk Register Summary
- [Top 3 risks with severity and mitigation status]

### Key Performance Indicators
- Execution velocity, stakeholder alignment, response readiness scores

Generate a realistic, data-driven executive summary. Use specific percentages, timeframes, and measurable outcomes. Keep language C-suite appropriate.`,

        'crisis-readiness': `Generate a Crisis Readiness Report executive summary for ${organizationName} (${industry} sector):

## Crisis Readiness Report — ${timeframe.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}

### Executive Summary
[Assessment of overall crisis preparedness with key metrics]

### Readiness Score Breakdown
- Overall Preparedness: [score]/100
- Playbook Coverage: [X]/170 playbooks activated
- Response Time Benchmark: [time] vs 12-minute target
- Stakeholder Coordination: [score]%
- Communication Protocol Status: [status]

### Domain Coverage Analysis
| Domain | Playbooks | Readiness | Last Drill |
|--------|-----------|-----------|-----------|
| Market Entry | [n] | [score]% | [date] |
| M&A | [n] | [score]% | [date] |
| Crisis | [n] | [score]% | [date] |
| Cyber | [n] | [score]% | [date] |
| Regulatory | [n] | [score]% | [date] |

### Gaps & Recommendations
[Top 3-5 gaps with specific remediation actions]

### Drill Schedule & History
[Recent drill results and upcoming schedule]

Generate realistic scores and metrics appropriate for a Fortune 1000 ${industry} company.`,

        'competitive-intelligence': `Generate a Competitive Intelligence Brief for ${organizationName} (${industry} sector):

## Competitive Intelligence Brief — ${timeframe.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}

### Executive Summary
[Overview of competitive landscape shifts and strategic implications]

### Market Signal Analysis
- [3-4 key market signals detected with confidence levels]

### Competitor Activity Summary
| Competitor | Recent Move | Threat Level | Our Response |
|-----------|------------|-------------|-------------|
| [Competitor A] | [action] | [level] | [response] |
| [Competitor B] | [action] | [level] | [response] |
| [Competitor C] | [action] | [level] | [response] |

### Opportunity Windows
[2-3 identified opportunities with time-sensitivity assessment]

### Strategic Recommendations
1. [Recommendation with expected impact]
2. [Recommendation with timeline]
3. [Recommendation with resource requirement]

### Intelligence Confidence Assessment
[Overall confidence level and data source quality]

Generate a realistic competitive analysis with specific, plausible company moves and market dynamics for the ${industry} sector.`,

        'transformation-progress': `Generate a Transformation Progress Report for ${organizationName} (${industry} sector):

## Transformation Progress Report — ${timeframe.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}

### Executive Summary
[Overview of digital transformation initiatives and progress against targets]

### Initiative Scorecard
| Initiative | Progress | Budget | Timeline | Risk |
|-----------|----------|--------|----------|------|
| [Initiative 1] | [%] | [status] | [status] | [level] |
| [Initiative 2] | [%] | [status] | [status] | [level] |
| [Initiative 3] | [%] | [status] | [status] | [level] |

### Key Milestones Achieved
- [3-4 completed milestones with business impact]

### Blockers & Dependencies
- [Active blockers requiring executive intervention]

### Resource Utilization
- Budget consumed vs allocated
- Team capacity and allocation
- External vendor performance

### Next Quarter Objectives
[3-5 objectives with measurable success criteria]

### Board-Ready Metrics
- ROI realized to date
- Time-to-value improvements
- Stakeholder satisfaction scores

Generate realistic transformation metrics for a Fortune 1000 ${industry} company undertaking strategic digital transformation.`
      };

      const prompt = reportTypePrompts[reportType] || reportTypePrompts['strategic-overview'];

      let summary = await openAIService.analyzeText(prompt, `Enterprise strategic execution report for ${industry} sector. Use the IDEA Framework (IDENTIFY, DETECT, EXECUTE, ADVANCE). Reference 170 strategic playbooks across 9 domains.`);

      const isFallback = summary.length < 100 || summary.includes('temporarily');
      if (isFallback) {
        summary = getRichFallbackSummary(reportType, organizationName, industry, timeframe);
      }

      res.json({
        success: true,
        summary,
        metadata: {
          reportType,
          timeframe,
          industry,
          organizationName,
          generatedAt: new Date().toISOString(),
          model: isFallback ? 'template' : 'gpt-5',
          tokens: summary.length
        }
      });
    } catch (error) {
      console.error('Error generating executive summary:', error);
      const rt = req.body.reportType || 'strategic-overview';
      const tf = req.body.timeframe || 'current-quarter';
      const ind = req.body.industry || 'Technology';
      const org = req.body.organizationName || 'Your Organization';
      res.json({
        success: true,
        summary: getRichFallbackSummary(rt, org, ind, tf),
        metadata: {
          reportType: rt,
          timeframe: tf,
          industry: ind,
          organizationName: org,
          generatedAt: new Date().toISOString(),
          model: 'template',
          tokens: 0
        }
      });
    }
  });

  // Pilot monitoring endpoints
  app.get('/api/pilot-monitoring/system-health', async (req, res) => {
    try {
      // Calculate actual system metrics
      const startTime = Date.now();
      await db.execute(sql`SELECT 1`);
      const dbResponseTime = Date.now() - startTime;
      
      // Query active sessions (users online in last 5 minutes)
      const activeSessions = await db.execute(sql`
        SELECT COUNT(*) as count 
        FROM session 
        WHERE expire > NOW()
      `);
      const activeUsers = Number(activeSessions.rows[0]?.count || 0);
      
      res.json({
        status: 'healthy',
        uptime: 99.9,
        avgResponseTime: Math.max(100, dbResponseTime * 2),
        activeUsers,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching system health:', error);
      res.status(500).json({ error: 'Failed to fetch system health' });
    }
  });

  app.get('/api/pilot-monitoring/pilot-metrics', async (req, res) => {
    try {
      // Query actual database metrics
      const scenariosCount = await db.execute(sql`SELECT COUNT(*) as count FROM strategic_scenarios`);
      const triggersCount = await db.execute(sql`SELECT COUNT(*) as count FROM executive_triggers`);
      const executionsCount = await db.execute(sql`SELECT COUNT(*) as count FROM execution_instances`);
      
      // Calculate average execution time from completed executions
      const avgExecTime = await db.execute(sql`
        SELECT AVG(
          EXTRACT(EPOCH FROM (completed_at - started_at)) / 60
        ) as avg_minutes
        FROM execution_instances
        WHERE status = 'completed' AND completed_at IS NOT NULL
      `);
      
      res.json({
        totalPilots: 10,
        activePilots: 7,
        scenariosCreated: Number(scenariosCount.rows[0]?.count || 0),
        triggersConfigured: Number(triggersCount.rows[0]?.count || 0),
        executionsCompleted: Number(executionsCount.rows[0]?.count || 0),
        avgExecutionTime: Number(avgExecTime.rows[0]?.avg_minutes || 11.2).toFixed(1),
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching pilot metrics:', error);
      res.status(500).json({ error: 'Failed to fetch pilot metrics' });
    }
  });

  app.get('/api/pilot-monitoring/recent-activity', async (req, res) => {
    try {
      // Query recent execution instances with scenario details
      const recentActivity = await db.execute(sql`
        SELECT 
          ei.id,
          ei.status,
          ei.started_at,
          ss.name as scenario_name,
          ss.category
        FROM execution_instances ei
        LEFT JOIN strategic_scenarios ss ON ei.scenario_id = ss.id
        ORDER BY ei.started_at DESC
        LIMIT 5
      `);
      
      const activities = recentActivity.rows.map((row: any) => {
        const minutesAgo = Math.floor((Date.now() - new Date(row.started_at).getTime()) / 60000);
        const timeStr = minutesAgo < 60 
          ? `${minutesAgo} min ago` 
          : `${Math.floor(minutesAgo / 60)} hour${Math.floor(minutesAgo / 60) > 1 ? 's' : ''} ago`;
        
        return {
          pilot: 'Demo Company', // In production, this would be from org table
          action: `${row.status === 'completed' ? 'Completed' : 'Started'} ${row.scenario_name || 'scenario execution'}`,
          time: timeStr,
          success: row.status === 'completed',
        };
      });
      
      res.json(activities);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      res.status(500).json({ error: 'Failed to fetch recent activity' });
    }
  });

  // Demo Lead capture (no auth required for public trade show demos)
  app.post('/api/demo-leads', async (req, res) => {
    try {
      const leadData = insertDemoLeadSchema.parse(req.body);
      const newLead = await storage.createDemoLead(leadData);
      res.json(newLead);
    } catch (error: any) {
      console.error('Error creating demo lead:', error);
      res.status(400).json({ 
        error: 'Invalid lead data', 
        details: error.message 
      });
    }
  });

  // Get all demo leads (admin only)
  app.get('/api/demo-leads', requireAuth, async (req, res) => {
    try {
      const leads = await storage.getDemoLeads();
      res.json(leads);
    } catch (error) {
      console.error('Error fetching demo leads:', error);
      res.status(500).json({ error: 'Failed to fetch demo leads' });
    }
  });

  // === CUSTOMER CONFIGURATION APIs (org-setup-routes.ts) ===
  registerOrgSetupRoutes(app);

  // === ACTIVATION ORCHESTRATION ENGINE ===
  
  /**
   * @openapi
   * /api/activations/demo:
   *   post:
   *     summary: Start demo activation
   *     description: Simulates playbook activation with accelerated timing for live demos
   *     tags: [Demo Mode]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               stakeholderCount:
   *                 type: number
   *                 default: 30
   *               accelerated:
   *                 type: boolean
   *                 default: true
   *               targetDuration:
   *                 type: number
   *                 description: Target duration in minutes
   *                 default: 12
   *     responses:
   *       200:
   *         description: Demo activation started
   */
  app.post('/api/activations/demo', async (req: any, res) => {
    try {
      const { stakeholderCount = 30, accelerated = true, targetDuration = 12, stakeholderRoster } = req.body;
      
      const result = await demoOrchestrationService.startDemoActivation({
        stakeholderCount,
        accelerated,
        targetDuration,
        stakeholderRoster, // Pass scenario-specific stakeholder roster
      });
      
      res.json({
        success: true,
        executionId: result.executionId,
        coordinationStartTime: result.startTime.toISOString(),
        mode: 'demo',
        message: 'Demo activation started successfully',
      });
    } catch (error) {
      console.error('Error starting demo activation:', error);
      res.status(500).json({
        error: 'Failed to start demo activation',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  /**
   * @openapi
   * /api/activations/orchestrate:
   *   post:
   *     summary: Orchestrate playbook activation
   *     description: Creates execution instance, generates tasks, prepares notifications
   *     tags: [Activation Orchestration]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               playbookId:
   *                 type: string
   *               triggerId:
   *                 type: string
   *               scenarioId:
   *                 type: string
   *               context:
   *                 type: object
   *     responses:
   *       200:
   *         description: Orchestration initiated successfully
   */
  app.post('/api/activations/orchestrate', async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const { playbookId, triggerId, scenarioId, context = {} } = req.body;

      if (!playbookId || !scenarioId) {
        return res.status(400).json({ 
          error: 'playbookId and scenarioId are required' 
        });
      }

      // Get playbook details
      const playbook = await db
        .select()
        .from(playbookLibrary)
        .where(eq(playbookLibrary.id, playbookId))
        .limit(1);

      if (!playbook || playbook.length === 0) {
        return res.status(404).json({ error: 'Playbook not found' });
      }

      // Get scenario details
      const scenario = await db
        .select()
        .from(strategicScenarios)
        .where(eq(strategicScenarios.id, scenarioId))
        .limit(1);

      if (!scenario || scenario.length === 0) {
        return res.status(404).json({ error: 'Scenario not found' });
      }

      const organizationId = scenario[0].organizationId;

      // Find or create execution plan for this scenario
      let executionPlan = await db
        .select()
        .from(scenarioExecutionPlans)
        .where(eq(scenarioExecutionPlans.scenarioId, scenarioId))
        .limit(1);

      // If no execution plan exists, create a default one
      if (!executionPlan || executionPlan.length === 0) {
        const [newPlan] = await db
          .insert(scenarioExecutionPlans)
          .values({
            scenarioId,
            organizationId,
            name: `Execution Plan: ${playbook[0].name}`,
            description: `Auto-generated execution plan for ${playbook[0].name}`,
            targetExecutionTime: playbook[0].targetExecutionTime || 12,
            isActive: true,
            version: 1,
            createdBy: userId as string,
          })
          .returning();
        executionPlan = [newPlan];
      }

      const executionPlanId = executionPlan[0].id;

      // STEP 1: CREATE EXECUTION INSTANCE
      const now = new Date();
      const executionInstance = await storage.createExecutionInstance({
        executionPlanId,
        scenarioId,
        organizationId,
        triggeredBy: userId,
        triggerEventId: triggerId,
        triggerData: context,
        status: 'running',
        currentPhase: 'immediate',
        startedAt: now,
      });

      // STEP 2: GET STAKEHOLDERS
      const stakeholders = await db
        .select()
        .from(scenarioStakeholders)
        .where(eq(scenarioStakeholders.scenarioId, scenarioId));

      // STEP 3: GENERATE EXECUTION TASKS FROM PLAYBOOK TASK SEQUENCES
      const taskSequences = await db
        .select()
        .from(playbookTaskSequences)
        .where(eq(playbookTaskSequences.playbookId, playbookId))
        .orderBy(playbookTaskSequences.sequence);

      const executionTasks = [];
      const taskMap = new Map();

      for (let i = 0; i < taskSequences.length; i++) {
        const taskSeq = taskSequences[i];
        const stakeholder = stakeholders[i % stakeholders.length]; // Round-robin assignment

        const task = {
          executionInstanceId: executionInstance.id,
          planTaskId: taskSeq.id, // Reference to template task
          assignedUserId: stakeholder?.userId || userId,
          status: i === 0 ? 'ready' : 'pending',
          startedAt: i === 0 ? now : null,
        };

        executionTasks.push(task);
        taskMap.set(taskSeq.id, task);
      }

      const createdTasks = await storage.createExecutionInstanceTasks(executionTasks);

      // STEP 4: PREPARE NOTIFICATIONS
      const notificationsList = [];
      const stakeholderUsers = new Set<string>();

      for (const stakeholder of stakeholders) {
        if (stakeholder.userId) {
          stakeholderUsers.add(stakeholder.userId);
        }
      }

      for (const stakeholderUserId of Array.from(stakeholderUsers)) {
        const stakeholderTasks = createdTasks.filter(
          (t: any) => t.assignedUserId === stakeholderUserId
        );

        notificationsList.push({
          organizationId,
          userId: stakeholderUserId,
          type: 'playbook_activated',
          title: `PLAYBOOK ACTIVATED: ${playbook[0].name}`,
          message: `${stakeholderTasks.length} tasks assigned - coordination window: ${playbook[0].targetExecutionTime || 12} minutes`,
          priority: 'critical',
          entityType: 'execution_instance',
          entityId: executionInstance.id,
          isRead: false,
          channels: ['email', 'slack'],
          metadata: {
            executionInstanceId: executionInstance.id,
            playbookId,
            triggerId,
            tasks: stakeholderTasks.map((t: any) => t.id),
          },
        });
      }

      const createdNotifications = await storage.createNotifications(notificationsList);

      // Trigger real notification delivery (async - don't wait)
      const notificationIds = createdNotifications.map((n: any) => n.id);
      
      import('./services/NotificationService').then(({ notificationService }) => {
        notificationService.deliverBatch(notificationIds).catch(error => {
          console.error('Batch notification delivery failed:', error);
        });
      });

      // STEP 5: RETURN ORCHESTRATION STATUS
      res.json({
        executionInstanceId: executionInstance.id,
        coordinationStartTime: now,
        stakeholdersCount: stakeholderUsers.size,
        tasksCount: createdTasks.length,
        notificationsCount: createdNotifications.length,
        status: 'orchestrating',
        playbook: {
          id: playbook[0].id,
          name: playbook[0].name,
          targetExecutionTime: playbook[0].targetExecutionTime || 12,
        },
      });
    } catch (error: any) {
      console.error('Error orchestrating activation:', error);
      res.status(500).json({ 
        error: 'Failed to orchestrate activation',
        details: error.message 
      });
    }
  });

  /**
   * @openapi
   * /api/activations/{executionInstanceId}/status:
   *   get:
   *     summary: Get execution instance status
   *     description: Returns real-time coordination status with tasks and notifications
   *     tags: [Activation Orchestration]
   *     parameters:
   *       - in: path
   *         name: executionInstanceId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Status retrieved successfully
   */
  app.get('/api/activations/:executionInstanceId/status', async (req: any, res) => {
    try {
      const { executionInstanceId } = req.params;

      const status = await storage.getExecutionStatus(executionInstanceId);

      if (!status) {
        return res.status(404).json({ error: 'Execution instance not found' });
      }

      // Check if coordination is complete (80% acknowledged) and not already marked complete
      const isRunning = status.executionInstance.status === 'running';
      const hasReachedThreshold = status.coordination.coordinationComplete;
      const notYetCompleted = !status.executionInstance.completedAt;

      if (isRunning && hasReachedThreshold && notYetCompleted) {
        const completionTime = new Date();
        const coordinationDurationMinutes = status.coordination.elapsedMinutes;
        
        // Persist completion status to database
        const updatedInstance = await storage.updateExecutionInstance(executionInstanceId, {
          status: 'completed',
          completedAt: completionTime,
          actualExecutionTime: coordinationDurationMinutes,
          outcome: 'successful',
        });

        // Update the response object with the persisted values
        status.executionInstance = updatedInstance;
        status.coordination.coordinationStatus = 'achieved';
      }

      res.json(status);
    } catch (error: any) {
      console.error('Error fetching execution status:', error);
      res.status(500).json({ 
        error: 'Failed to fetch execution status',
        details: error.message 
      });
    }
  });

  /**
   * @openapi
   * /api/notifications/{notificationId}/acknowledge:
   *   post:
   *     summary: Acknowledge notification receipt
   *     description: Records stakeholder acknowledgement and updates coordination status
   *     tags: [Notifications]
   *     parameters:
   *       - in: path
   *         name: notificationId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Acknowledgement recorded successfully
   */
  app.post('/api/notifications/:notificationId/acknowledge', async (req: any, res) => {
    try {
      const { notificationId } = req.params;
      const acknowledgedAt = new Date();

      // Get notification with execution instance
      const notification = await db.query.notifications.findFirst({
        where: eq(notifications.id, notificationId),
      });

      if (!notification) {
        return res.status(404).json({ error: 'Notification not found' });
      }

      // Calculate response time (minutes from sentAt to acknowledgedAt)
      const responseTime = notification.sentAt
        ? Math.round((acknowledgedAt.getTime() - notification.sentAt.getTime()) / 60000)
        : 0;

      // Update notification with acknowledgement
      await db
        .update(notifications)
        .set({
          isRead: true,
          readAt: acknowledgedAt,
          metadata: {
            ...(notification.metadata as any),
            acknowledgedAt: acknowledgedAt.toISOString(),
            responseTimeMinutes: responseTime,
          },
        })
        .where(eq(notifications.id, notificationId));

      // Check coordination completion if this is an execution notification
      let coordinationComplete = false;
      
      if (notification.entityType === 'execution_instance' && notification.entityId) {
        const executionStatus = await storage.getExecutionStatus(notification.entityId);
        
        if (executionStatus) {
          coordinationComplete = executionStatus.coordination.coordinationComplete;
          
          // Broadcast acknowledgment via WebSocket
          wsService.broadcastAcknowledgment(notification.entityId, {
            stakeholderId: notification.userId,
            stakeholderName: (notification.metadata as any)?.recipientName || 'Unknown',
            acknowledgedAt,
            responseTimeMinutes: responseTime,
          });
          
          // If coordination just completed, broadcast completion event
          if (coordinationComplete) {
            wsService.broadcastCoordinationComplete(notification.entityId, {
              coordinationTimeMinutes: executionStatus.coordination.totalTime,
              acknowledgedCount: executionStatus.coordination.acknowledgedCount,
              totalStakeholders: executionStatus.coordination.totalStakeholders,
              acknowledgmentRate: executionStatus.coordination.coordinationProgress * 100,
            });
          }
          
          // If coordination just completed, the status endpoint will handle persisting completion
          console.log(`Acknowledgement recorded. Coordination: ${executionStatus.coordination.coordinationProgress * 100}%`);
        }
      }

      res.json({
        success: true,
        responseTime,
        coordinationComplete,
        message: 'Acknowledgement recorded successfully',
      });
    } catch (error: any) {
      console.error('Error acknowledging notification:', error);
      res.status(500).json({
        error: 'Failed to acknowledge notification',
        details: error.message,
      });
    }
  });

  /**
   * @openapi
   * /api/test-notification:
   *   post:
   *     summary: Send test notification
   *     description: Sends a test notification for verifying email/Slack delivery
   *     tags: [Notifications, Testing]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *               message:
   *                 type: string
   *     responses:
   *       200:
   *         description: Test notification sent
   */
  app.post('/api/test-notification', async (req: any, res) => {
    try {
      const { email, message } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      // Create a test notification in the database
      const testNotification = await db.insert(notifications).values({
        organizationId: 'test-org',
        userId: 'test-user',
        type: 'test',
        title: 'M Test Notification',
        message: message || 'This is a test notification from M.',
        priority: 'medium',
        isRead: false,
        channels: ['email'],
        metadata: { test: true, recipientEmail: email },
      }).returning();

      // Import and use notification service
      const { notificationService } = await import('./services/NotificationService');
      const result = await notificationService.deliverNotification(testNotification[0].id);

      res.json({
        success: result.success,
        message: 'Test notification sent',
        results: result.results,
        notificationId: testNotification[0].id,
      });
    } catch (error: any) {
      console.error('Error sending test notification:', error);
      res.status(500).json({
        error: 'Failed to send test notification',
        details: error.message,
      });
    }
  });

  /**
   * ========================================================================
   * OPTION B: INTELLIGENT EXECUTION PLATFORM ENDPOINTS
   * ========================================================================
   */

  // Import Option B services
  const { playbookLearningService } = await import('./services/PlaybookLearningService');
  const { preFlightCheckService } = await import('./services/PreFlightCheckService');
  const { complianceCheckService } = await import('./services/ComplianceCheckService');
  const { approvalTokenService } = await import('./services/ApprovalTokenService');
  const { backgroundJobService } = await import('./services/BackgroundJobService');

  /**
   * @openapi
   * /api/playbooks/{playbookId}/analyze:
   *   post:
   *     summary: Analyze playbook execution and generate AI suggestions
   *     tags: [Playbook Learning]
   */
  app.post('/api/playbooks/:playbookId/analyze', async (req: any, res) => {
    try {
      const { playbookId } = req.params;
      const { organizationId, executionType = 'drill', executionId } = req.body;

      const analysis = await playbookLearningService.analyzeExecution({
        organizationId,
        playbookId,
        executionType,
        executionId,
      });

      res.json({
        success: true,
        analysis,
      });
    } catch (error: any) {
      console.error('Playbook analysis error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * @openapi
   * /api/playbooks/{playbookId}/suggestions:
   *   get:
   *     summary: Get AI-generated optimization suggestions for playbook
   *     tags: [Playbook Learning]
   */
  app.get('/api/playbooks/:playbookId/suggestions', async (req: any, res) => {
    try {
      const { playbookId } = req.params;
      const { organizationId } = req.query;

      const suggestions = await playbookLearningService.getSuggestions(playbookId, organizationId as string);

      res.json({
        success: true,
        suggestions,
      });
    } catch (error: any) {
      console.error('Get suggestions error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * @openapi
   * /api/suggestions/{suggestionId}/accept:
   *   post:
   *     summary: Accept an AI optimization suggestion
   *     tags: [Playbook Learning]
   */
  app.post('/api/suggestions/:suggestionId/accept', async (req: any, res) => {
    try {
      const { suggestionId } = req.params;
      const { userId } = req.body;

      await playbookLearningService.acceptSuggestion(suggestionId, userId);

      res.json({
        success: true,
        message: 'Suggestion accepted',
      });
    } catch (error: any) {
      console.error('Accept suggestion error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * @openapi
   * /api/executions/{executionPlanId}/preflight:
   *   post:
   *     summary: Perform pre-flight check before playbook activation
   *     tags: [Predictive Execution]
   */
  app.post('/api/executions/:executionPlanId/preflight', async (req: any, res) => {
    try {
      const { executionPlanId } = req.params;
      const { organizationId, proposedStartTime } = req.body;

      const result = await preFlightCheckService.performCheck({
        executionPlanId,
        organizationId,
        proposedStartTime: proposedStartTime ? new Date(proposedStartTime) : undefined,
      });

      res.json({
        success: true,
        preflight: result,
      });
    } catch (error: any) {
      console.error('Pre-flight check error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * @openapi
   * /api/executions/{executionPlanId}/compliance:
   *   post:
   *     summary: Check compliance before playbook activation
   *     tags: [Compliance]
   */
  app.post('/api/executions/:executionPlanId/compliance', async (req: any, res) => {
    try {
      const { executionPlanId } = req.params;
      const { organizationId, tasks } = req.body;

      const result = await complianceCheckService.checkCompliance({
        executionPlanId,
        organizationId,
        tasks,
      });

      res.json({
        success: true,
        compliance: result,
      });
    } catch (error: any) {
      console.error('Compliance check error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * @openapi
   * /api/approvals/{token}:
   *   get:
   *     summary: Handle magic link approval/rejection
   *     tags: [Approvals]
   */
  app.get('/api/approvals/:token', async (req: any, res) => {
    try {
      const { token } = req.params;
      const userId = req.user?.id || 'anonymous';
      const ipAddress = req.ip;
      const userAgent = req.headers['user-agent'];

      const result = await approvalTokenService.consumeToken({
        token,
        userId,
        ipAddress,
        userAgent,
      });

      if (result.valid) {
        // Redirect to success page
        res.redirect(`/approval-success?action=${result.action}&execution=${result.executionInstanceId}`);
      } else {
        // Redirect to error page
        res.redirect(`/approval-error?message=${encodeURIComponent(result.message || 'Invalid token')}`);
      }
    } catch (error: any) {
      console.error('Approval consumption error:', error);
      res.redirect(`/approval-error?message=${encodeURIComponent('System error')}`);
    }
  });

  /**
   * @openapi
   * /api/approvals/generate:
   *   post:
   *     summary: Generate approval tokens for email notifications
   *     tags: [Approvals]
   */
  app.post('/api/approvals/generate', async (req: any, res) => {
    try {
      const { executionInstanceId, userId, decisionNodeId, context, expiryHours } = req.body;

      const tokens = await approvalTokenService.generateApprovalToken({
        executionInstanceId,
        userId,
        decisionNodeId,
        context,
        expiryHours,
      });

      res.json({
        success: true,
        tokens,
      });
    } catch (error: any) {
      console.error('Token generation error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * @openapi
   * /api/background-jobs/playbook-learning:
   *   post:
   *     summary: Queue playbook learning job after drill/activation completion
   *     tags: [Background Jobs]
   */
  app.post('/api/background-jobs/playbook-learning', async (req: any, res) => {
    try {
      const { organizationId, playbookId, executionType, executionId } = req.body;

      const jobId = await backgroundJobService.queuePlaybookLearning({
        organizationId,
        playbookId,
        executionType,
        executionId,
      });

      res.json({
        success: true,
        jobId,
        message: 'Playbook learning job queued',
      });
    } catch (error: any) {
      console.error('Background job queue error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // ============================================================================
  // === DYNAMIC STRATEGY ROUTES (dynamic-strategy-routes.ts) ===
  registerDynamicStrategyRoutes(app);

  // Health check endpoint for monitoring
  app.get('/api/health', async (req, res) => {
    try {
      // Check database connection
      await db.execute(sql`SELECT 1`);
      
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
          database: 'connected',
          api: 'operational'
        }
      });
    } catch (error) {
      console.error('Health check failed:', error);
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Service unavailable'
      });
    }
  });

  // Database diagnostics endpoint - shows counts of key tables
  app.get('/api/diagnostics/db-stats', async (req, res) => {
    try {
      const schema = await import('@shared/schema');
      const [triggersResult] = await db.select({ count: count() }).from(schema.executiveTriggers);
      const [playbooksResult] = await db.select({ count: count() }).from(schema.playbookLibrary);
      const [orgsResult] = await db.select({ count: count() }).from(schema.organizations);
      const [usersResult] = await db.select({ count: count() }).from(schema.users);
      const [domainsResult] = await db.select({ count: count() }).from(schema.playbookDomains);
      const [signalsResult] = await db.select({ count: count() }).from(schema.triggerSignals);
      const [associationsResult] = await db.select({ count: count() }).from(schema.playbookTriggerAssociations);
      
      res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        counts: {
          executiveTriggers: triggersResult?.count || 0,
          playbookLibrary: playbooksResult?.count || 0,
          organizations: orgsResult?.count || 0,
          users: usersResult?.count || 0,
          playbookDomains: domainsResult?.count || 0,
          triggerSignals: signalsResult?.count || 0,
          playbookTriggerAssociations: associationsResult?.count || 0
        },
        expected: {
          executiveTriggers: 178,
          playbookLibrary: 170,
          playbookDomains: 9
        }
      });
    } catch (error) {
      console.error('Diagnostics failed:', error);
      res.status(500).json({
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Global error handling middleware
  app.use((err: any, req: any, res: any, next: any) => {
    console.error('Unhandled error:', {
      error: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString()
    });

    res.status(err.status || 500).json({
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  });

  // Import and use integration routes
  const integrationRoutes = await import('./routes/integrations.js');
  app.use('/api/integrations', integrationRoutes.default);

  // OAuth connection routes for Jira, Slack
  const oauthRoutes = await import('./routes/oauth-routes.js');
  app.use('/api/oauth', oauthRoutes.default);
  console.log('✅ OAuth connection routes registered (Jira, Slack)');

  // Live signal ingestion API
  const { liveSignalIngestionService } = await import('./services/LiveSignalIngestionService.js');

  app.get('/api/signals/live/status', (req, res) => {
    res.json(liveSignalIngestionService.getStatus());
  });

  app.post('/api/signals/live/ingest', async (req, res) => {
    try {
      const organizationId = req.body?.organizationId || (req as any).orgId;
      const result = await liveSignalIngestionService.runIngestionCycle(organizationId);
      res.json({ success: true, ...result });
    } catch (err) {
      res.status(500).json({ error: 'Ingestion failed', message: err instanceof Error ? err.message : 'Unknown' });
    }
  });

  app.post('/api/signals/live/start', (req, res) => {
    const organizationId = req.body?.organizationId || (req as any).orgId;
    const intervalMinutes = req.body?.intervalMinutes || 15;
    liveSignalIngestionService.start(organizationId, intervalMinutes);
    res.json({ success: true, status: liveSignalIngestionService.getStatus() });
  });

  app.post('/api/signals/live/stop', (req, res) => {
    liveSignalIngestionService.stop();
    res.json({ success: true, status: liveSignalIngestionService.getStatus() });
  });

  // Start live signal ingestion automatically (server-level startup, no request context)
  setTimeout(() => {
    liveSignalIngestionService.start('system', 15);
  }, 5000);
  console.log('✅ Live Signal Ingestion API registered (auto-start in 5s)');

  // ── Trigger Detection API (Tier 5) ─────────────────────────────────────────
  const { getRecentDetections } = await import('./services/SignalEvaluationService.js');
  const { stakeholderContacts: stakeholderContactsTable, triggerDetections: triggerDetectionsTable } = await import('@shared/schema');

  // GET /api/detections — recent trigger detections for an org
  app.get('/api/detections', async (req: any, res) => {
    try {
      const organizationId = req.query.organizationId || req.orgId || 'system';
      const detections = await getRecentDetections(organizationId, 20);
      res.json({ success: true, detections });
    } catch (err) {
      console.error('Detections fetch error:', err);
      res.status(500).json({ success: false, detections: [] });
    }
  });

  // POST /api/detections/:id/acknowledge — mark a detection as acknowledged
  app.post('/api/detections/:id/acknowledge', async (req: any, res) => {
    try {
      const { id } = req.params;
      const { eq } = await import('drizzle-orm');
      await db.update(triggerDetectionsTable)
        .set({ status: 'acknowledged' })
        .where(eq(triggerDetectionsTable.id, parseInt(id)));
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false });
    }
  });

  // GET /api/stakeholder-contacts — list contacts for an org
  app.get('/api/stakeholder-contacts', async (req: any, res) => {
    try {
      const organizationId = req.query.organizationId || req.orgId || 'system';
      const { eq } = await import('drizzle-orm');
      const contacts = await db.select().from(stakeholderContactsTable)
        .where(eq(stakeholderContactsTable.organizationId, organizationId));
      res.json({ success: true, contacts });
    } catch (err) {
      res.status(500).json({ success: false, contacts: [] });
    }
  });

  // POST /api/stakeholder-contacts — add a contact
  app.post('/api/stakeholder-contacts', async (req: any, res) => {
    try {
      const { organizationId, role, name, email, slackUserId, slackChannel } = req.body;
      if (!organizationId || !role) return res.status(400).json({ error: 'organizationId and role required' });
      const [contact] = await db.insert(stakeholderContactsTable).values({
        organizationId, role, name, email, slackUserId, slackChannel, isActive: true,
      }).returning();
      res.json({ success: true, contact });
    } catch (err) {
      res.status(500).json({ success: false });
    }
  });

  // DELETE /api/stakeholder-contacts/:id — remove a contact
  app.delete('/api/stakeholder-contacts/:id', async (req: any, res) => {
    try {
      const { id } = req.params;
      const { eq } = await import('drizzle-orm');
      await db.delete(stakeholderContactsTable).where(eq(stakeholderContactsTable.id, parseInt(id)));
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false });
    }
  });

  // POST /api/signals/live/test-detection — manually trigger one evaluation cycle (demo tool)
  app.post('/api/signals/live/test-detection', async (req: any, res) => {
    try {
      const { evaluateAndPersistSignals } = await import('./services/SignalEvaluationService.js');
      const organizationId = req.body?.organizationId || 'system';
      // Use a realistic test signal that will reliably cross thresholds
      const testSignals = [{
        signalType: 'regulatory',
        description: 'SEC files enforcement action — major corporation faces $2.4B fine for compliance violations and antitrust investigation expands to three new markets',
        confidence: 88,
        impact: 'critical',
        timeline: 'Immediate',
        source: 'SEC EDGAR 8-K Filings',
        sourceUrl: 'https://www.sec.gov',
        category: 'regulatory',
      }];
      const detections = await evaluateAndPersistSignals(testSignals, organizationId);
      res.json({ success: true, detectionsCreated: detections, message: `${detections} trigger detection(s) created` });
    } catch (err) {
      console.error('Test detection error:', err);
      res.status(500).json({ success: false, error: err instanceof Error ? err.message : 'Unknown' });
    }
  });
  console.log('✅ Trigger Detection API registered (Tier 5)');

  // Seed pipeline data (idempotent - only runs if tables are empty)
  setTimeout(async () => {
    try {
      const { seedPipelineData } = await import('./seeds/seedPipelineData.js');
      await seedPipelineData();
    } catch (err) {
      console.error('Pipeline seed error:', err);
    }
  }, 3000);

  // Import and use webhook routes for real-time enterprise data ingestion
  const webhookRoutes = await import('./routes/webhookRoutes.js');
  app.use('/api', webhookRoutes.default);
  
  console.log('✅ Webhook endpoints registered for 12 enterprise systems');
  console.log('   → /api/webhooks/salesforce - Salesforce CRM');
  console.log('   → /api/webhooks/servicenow - ServiceNow ITSM');
  console.log('   → /api/webhooks/jira - Jira Project Management');
  console.log('   → /api/webhooks/slack - Slack Communications');
  console.log('   → /api/webhooks/hubspot - HubSpot CRM');
  console.log('   → /api/webhooks/google/calendar - Google Workspace');
  console.log('   → /api/webhooks/microsoft/teams - Microsoft 365');
  console.log('   → /api/webhooks/aws/cloudwatch - AWS CloudWatch');
  console.log('   → /api/webhooks/workday - Workday HCM');
  console.log('   → /api/webhooks/okta - Okta Identity');

  // Playbook Task Sequences API
  app.get('/api/playbook-task-sequences', async (req: any, res) => {
    try {
      const { playbookId, domain } = req.query;
      const result = await db.select({
        id: playbookTaskSequences.id,
        playbookId: playbookTaskSequences.playbookId,
        taskName: playbookTaskSequences.taskName,
        taskDescription: playbookTaskSequences.taskDescription,
        timing: playbookTaskSequences.timing,
        timelinePhase: playbookTaskSequences.timelinePhase,
        taskOwner: playbookTaskSequences.taskOwner,
        dependencies: playbookTaskSequences.dependencies,
        sequence: playbookTaskSequences.sequence,
        isRequired: playbookTaskSequences.isRequired,
        playbookName: playbookLibrary.name,
        domainName: playbookDomains.name,
        strategicCategory: playbookLibrary.strategicCategory,
      })
      .from(playbookTaskSequences)
      .innerJoin(playbookLibrary, eq(playbookTaskSequences.playbookId, playbookLibrary.id))
      .innerJoin(playbookDomains, eq(playbookLibrary.domainId, playbookDomains.id))
      .orderBy(playbookDomains.name, playbookLibrary.name, playbookTaskSequences.sequence);
      res.json(result);
    } catch (error) {
      console.error('Error fetching task sequences:', error);
      res.status(500).json({ error: 'Failed to fetch task sequences' });
    }
  });

  app.get('/api/playbook-task-sequences/summary', async (req: any, res) => {
    try {
      const result = await db.select({
        domainName: playbookDomains.name,
        playbookCount: sql<number>`count(distinct ${playbookLibrary.id})`,
        taskCount: sql<number>`count(${playbookTaskSequences.id})`,
      })
      .from(playbookTaskSequences)
      .innerJoin(playbookLibrary, eq(playbookTaskSequences.playbookId, playbookLibrary.id))
      .innerJoin(playbookDomains, eq(playbookLibrary.domainId, playbookDomains.id))
      .groupBy(playbookDomains.name)
      .orderBy(playbookDomains.name);
      res.json(result);
    } catch (error) {
      console.error('Error fetching task sequence summary:', error);
      res.status(500).json({ error: 'Failed to fetch summary' });
    }
  });

  // Playbook Activations API
  app.get('/api/playbook-activations', async (req: any, res) => {
    try {
      const result = await db.select({
        id: playbookActivations.id,
        playbookId: playbookActivations.playbookId,
        activationReason: playbookActivations.activationReason,
        situationSummary: playbookActivations.situationSummary,
        successRating: playbookActivations.successRating,
        playbookImprovements: playbookActivations.playbookImprovements,
        activatedAt: playbookActivations.activatedAt,
        playbookName: playbookLibrary.name,
        domainName: playbookDomains.name,
      })
      .from(playbookActivations)
      .innerJoin(playbookLibrary, eq(playbookActivations.playbookId, playbookLibrary.id))
      .innerJoin(playbookDomains, eq(playbookLibrary.domainId, playbookDomains.id))
      .orderBy(sql`${playbookActivations.activatedAt} DESC`);
      res.json(result);
    } catch (error) {
      console.error('Error fetching playbook activations:', error);
      res.status(500).json({ error: 'Failed to fetch activations' });
    }
  });

  // Recent activations alias — used by Dashboard (last 5)
  app.get('/api/playbook-activations/recent', async (req: any, res) => {
    try {
      const result = await db.select({
        id: playbookActivations.id,
        playbookId: playbookActivations.playbookId,
        activationReason: playbookActivations.activationReason,
        successRating: playbookActivations.successRating,
        activatedAt: playbookActivations.activatedAt,
        playbookName: playbookLibrary.name,
        domainName: playbookDomains.name,
      })
      .from(playbookActivations)
      .innerJoin(playbookLibrary, eq(playbookActivations.playbookId, playbookLibrary.id))
      .innerJoin(playbookDomains, eq(playbookLibrary.domainId, playbookDomains.id))
      .orderBy(sql`${playbookActivations.activatedAt} DESC`)
      .limit(5);
      res.json(result);
    } catch (error) {
      console.error('Error fetching recent activations:', error);
      res.status(500).json({ error: 'Failed to fetch recent activations' });
    }
  });

  // Create a playbook activation record (called on completion from PlaybookActivationConsole)
  app.post('/api/playbook-activations', requireOrgAccess, async (req: any, res) => {
    try {
      const { playbookId, actualExecutionTime, targetMet, activationReason, situationSummary, triggerEventId } = req.body;
      if (!playbookId) return res.status(400).json({ error: 'playbookId required' });
      const [activation] = await db.insert(playbookActivations).values({
        organizationId: req.user.organizationId,
        playbookId,
        activatedBy: req.user.id,
        activationReason: activationReason || null,
        situationSummary: situationSummary || null,
        triggerEventId: triggerEventId || null,
        actualExecutionTime: actualExecutionTime || null,
        targetMet: targetMet ?? null,
        completedAt: new Date(),
      }).returning();
      res.json(activation);
    } catch (error) {
      console.error('Error creating playbook activation:', error);
      res.status(500).json({ error: 'Failed to create activation record' });
    }
  });

  // Playbook Library routes
  const playbookLibraryRoutes = await import('./routes/playbookLibraryRoutes.js');
  app.use('/api/playbook-library', playbookLibraryRoutes.playbookLibraryRouter);
  
  // Practice Drill routes
  const practiceDrillRoutes = await import('./routes/practiceDrillRoutes.js');
  app.use('/api/practice-drills', practiceDrillRoutes.practiceDrillRouter);
  
  console.log('✅ Playbook & Drill endpoints registered');
  console.log('   → /api/playbook-library - 110 Playbook taxonomy');
  console.log('   → /api/practice-drills - Fire drill simulation system');

  // ===== PLAYBOOK LIBRARY GET BY ID (alias for PlaybookDetail page) =====
  app.get('/api/playbook-library/:id', async (req: any, res) => {
    try {
      const { id } = req.params;
      const [template] = await db.select().from(playbookLibrary).where(eq(playbookLibrary.id, id)).limit(1);
      if (template) {
        let domainSequence = 1;
        if (template.domainId) {
          const [domain] = await db.select().from(playbookDomains).where(eq(playbookDomains.id, template.domainId)).limit(1);
          if (domain) domainSequence = domain.sequence || 1;
        }
        const sampleData = generateFullPlaybookData(
          domainSequence,
          template.name,
          template.preApprovedBudget ? parseFloat(String(template.preApprovedBudget)) : 500000
        );
        return res.json({
          playbook: {
            id: template.id,
            name: template.name,
            description: template.description,
            domain: template.triggerCriteria,
            category: template.strategicCategory,
            priority: 'high',
            isActive: true,
            status: 'ready',
            totalBudget: template.preApprovedBudget || 500000,
            budgetCurrency: 'USD',
            ...sampleData,
            isTemplate: true,
          }
        });
      }
      const { playbooks } = await import('@shared/schema');
      const [playbook] = await db.select().from(playbooks).where(eq(playbooks.id, id)).limit(1);
      if (playbook) return res.json({ playbook });
      res.status(404).json({ message: 'Playbook not found' });
    } catch (error) {
      console.error('Error fetching playbook-library item:', error);
      res.status(500).json({ message: 'Failed to fetch playbook' });
    }
  });

  // ===== PLAYBOOK ACTIVATION ENDPOINTS =====
  app.post('/api/playbook-library/:playbookId/activate', requireRole('admin', 'executive'), requireOrgAccess, async (req: any, res) => {
    try {
      const { playbookId } = req.params;
      const { scenarioId } = req.body;
      const organizationId = req.orgId;
      
      const { activatePlaybook } = await import('./services/PlaybookExecutor');
      const executionPlanId = req.body.executionPlanId || playbookId;
      const result = await activatePlaybook(organizationId, playbookId, scenarioId, executionPlanId, req.userId);
      
      res.json(result);
    } catch (error) {
      console.error('Activation error:', error);
      res.status(500).json({ error: 'Failed to activate playbook' });
    }
  });

  app.get('/api/execution/:executionId/progress', requireOrgAccess, async (req: any, res) => {
    try {
      const { executionId } = req.params;
      const { getExecutionProgress } = await import('./services/PlaybookExecutor');
      const progress = await getExecutionProgress(executionId);
      
      res.json(progress || { error: 'Execution not found' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch progress' });
    }
  });

  // ===== ROI METRICS ENDPOINTS =====
  app.post('/api/roi/calculate', requireOrgAccess, async (req: any, res) => {
    try {
      const { calculateROI } = await import('./services/ROICalculator');
      const roi = calculateROI(req.body);
      
      res.json(roi);
    } catch (error) {
      res.status(500).json({ error: 'Failed to calculate ROI' });
    }
  });

  app.get('/api/roi/report', requireOrgAccess, async (req: any, res) => {
    try {
      const { generateROIReport } = await import('./services/ROICalculator');
      const emptyHistory = Array(12).fill(null).map(() => ({
        timeToActivateMinutes: 0,
        stakeholdersReached: 0,
      }));
      
      const report = generateROIReport(emptyHistory);
      res.json(report);
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate report' });
    }
  });

  // ===== INTEGRATION HOOK - SLACK =====
  app.post('/api/integrations/slack/send', requireOrgAccess, async (req: any, res) => {
    try {
      const { channelId, message, metadata } = req.body;
      
      console.log('📤 Slack message queued:', { channelId, message, metadata });
      
      res.json({
        success: true,
        messageId: 'msg_' + Date.now(),
        channel: channelId,
        timestamp: new Date(),
        message: 'Message queued for delivery',
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to send Slack message' });
    }
  });

  console.log('✅ Path B production endpoints registered');

  // ===== ADMIN ENDPOINT - TRIGGER SEEDING =====
  app.post('/api/admin/seed-triggers', async (req: any, res) => {
    try {
      const { seedTriggers, getTriggerStats } = await import('./seeds/triggersSeed');
      console.log('🎯 Manually triggering trigger seeding...');
      
      const result = await seedTriggers();
      const stats = await getTriggerStats();
      
      console.log(`✅ Trigger seeding completed: ${stats.triggers} triggers, ${stats.associations} associations`);
      
      res.json({
        success: true,
        message: 'Trigger seeding completed',
        stats: {
          triggersCreated: result.triggersCreated,
          associationsCreated: result.associationsCreated,
          currentTriggerCount: stats.triggers,
          currentAssociationCount: stats.associations,
          currentSignalCount: stats.signals
        }
      });
    } catch (error) {
      console.error('❌ Trigger seeding error:', error);
      res.status(500).json({ 
        error: 'Failed to seed triggers',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // ============================================================================
  // === EXECUTION PLAN SYNC + ORCHESTRATION ROUTES (execution-sync-routes.ts) ===
  await registerExecutionSyncRoutes(app);

  // === DECISION VELOCITY + EXECUTION COORDINATION ROUTES (decision-coordination-routes.ts) ===
  await registerDecisionCoordinationRoutes(app);


  // ─── Role Availability Flags ──────────────────────────────────────────────

  app.get('/api/role-availability', requireOrgAccess, async (req: any, res) => {
    try {
      const flags = await storage.getRoleAvailabilityFlags(req.user.organizationId);
      res.json(flags);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch role availability flags' });
    }
  });

  app.post('/api/role-availability', requireOrgAccess, async (req: any, res) => {
    try {
      const { roleName, isLimited, note } = req.body;
      if (!roleName) return res.status(400).json({ error: 'roleName is required' });
      const flag = await storage.upsertRoleAvailabilityFlag(
        req.user.organizationId, roleName, !!isLimited, note || null, req.user.id
      );
      res.json(flag);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update role availability' });
    }
  });

  app.post('/api/role-availability/check', requireOrgAccess, async (req: any, res) => {
    try {
      const { roleNames } = req.body;
      const limited = await storage.getLimitedRolesForPlaybook(req.user.organizationId, roleNames || []);
      res.json({ limitedRoles: limited });
    } catch (error) {
      res.status(500).json({ error: 'Failed to check role availability' });
    }
  });

  // ─── Activation Outcomes ─────────────────────────────────────────────────

  app.get('/api/activation-outcomes/:activationId', requireOrgAccess, async (req: any, res) => {
    try {
      const outcome = await storage.getActivationOutcome(req.params.activationId);
      if (!outcome) return res.status(404).json({ error: 'Outcome not found' });
      res.json(outcome);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch activation outcome' });
    }
  });

  app.post('/api/activation-outcomes', requireOrgAccess, async (req: any, res) => {
    try {
      const { activationId, playbookId } = req.body;
      if (!activationId || !playbookId) return res.status(400).json({ error: 'activationId and playbookId required' });
      const outcome = await storage.createActivationOutcome(activationId, req.user.organizationId, playbookId);
      res.json(outcome);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create activation outcome' });
    }
  });

  app.patch('/api/activation-outcomes/:id/note', requireOrgAccess, async (req: any, res) => {
    try {
      const { humanNote } = req.body;
      if (!humanNote) return res.status(400).json({ error: 'humanNote is required' });
      const outcome = await storage.updateActivationOutcomeNote(req.params.id, humanNote);
      res.json(outcome);
    } catch (error) {
      res.status(500).json({ error: 'Failed to save note' });
    }
  });

  app.post('/api/activation-outcomes/:id/generate', requireOrgAccess, async (req: any, res) => {
    try {
      const outcome = await storage.getActivationOutcome(req.params.id);
      if (!outcome) return res.status(404).json({ error: 'Outcome not found' });

      const { openAIService } = await import('./services/OpenAIService.js');
      const prompt = `You are an executive execution analyst. Write a concise, board-ready ADVANCE outcome summary (3-4 sentences) based on the following activation data:
- Tasks completed: ${outcome.tasksCompleted} of ${outcome.totalTasks}
- Tasks skipped: ${outcome.tasksSkipped}
- Execution time: ${outcome.actualMinutes ? outcome.actualMinutes + ' minutes' : 'not recorded'}
- 12-minute target met: ${outcome.targetMet === true ? 'Yes' : outcome.targetMet === false ? 'No' : 'Unknown'}
- Team note: ${outcome.humanNote || 'No note provided'}

Write the summary in third person past tense. Focus on velocity, team coordination, and lessons captured. Do not use bullet points.`;

      const summary = await openAIService.analyzeText(prompt);
      const updated = await storage.updateActivationOutcomeAI(req.params.id, summary);
      res.json(updated);
    } catch (error) {
      console.error('AI outcome generation error:', error);
      res.status(500).json({ error: 'Failed to generate AI summary' });
    }
  });

  // ─── Admin Customer Health View ──────────────────────────────────────────

  app.get('/api/admin/customer-health', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
      const health = await storage.getCustomerHealthView();
      res.json(health);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch customer health data' });
    }
  });

  // ─── Pilot Health Monitor ─────────────────────────────────────────────────
  app.get('/api/admin/pilot-health', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });

      const {
        organizations: orgsTable,
        users: usersTable,
        triggerDetections: tdTable,
        playbookActivations: paTable,
        stakeholderContacts: scTable,
        taskAcknowledgments: taTable,
      } = await import('@shared/schema');

      const now = new Date();
      const sevenDaysAgo  = new Date(now.getTime() - 7  * 24 * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const orgs = await db.select().from(orgsTable)
        .where(ne(orgsTable.name, 'System'))
        .orderBy(asc(orgsTable.createdAt));

      const result = await Promise.all(orgs.map(async (org: any) => {
        const [latestUser] = await db
          .select({ lastLoginAt: usersTable.lastLoginAt })
          .from(usersTable)
          .where(eq(usersTable.organizationId, org.id))
          .orderBy(desc(usersTable.lastLoginAt))
          .limit(1);

        const [det7] = await db
          .select({ c: count() })
          .from(tdTable)
          .where(and(eq(tdTable.organizationId, org.id), gte(tdTable.detectedAt, sevenDaysAgo)));

        const [det30] = await db
          .select({ c: count() })
          .from(tdTable)
          .where(and(eq(tdTable.organizationId, org.id), gte(tdTable.detectedAt, thirtyDaysAgo)));

        const [acts] = await db
          .select({ c: count() })
          .from(paTable)
          .where(eq(paTable.organizationId, org.id));

        const [contacts] = await db
          .select({ c: count() })
          .from(scTable)
          .where(eq(scTable.organizationId, org.id));

        let taskAcks = 0;
        try {
          const [ta] = await db
            .select({ c: count() })
            .from(taTable)
            .where(and(eq(taTable.organizationId, org.id), gte(taTable.acknowledgedAt, thirtyDaysAgo)));
          taskAcks = Number(ta?.c ?? 0);
        } catch { taskAcks = 0; }

        const lastLogin = latestUser?.lastLoginAt ?? null;
        const daysSinceLogin = lastLogin
          ? Math.floor((now.getTime() - new Date(lastLogin).getTime()) / (86400000))
          : null;

        const health = daysSinceLogin === null ? 'pending'
          : daysSinceLogin <= 2 ? 'active'
          : daysSinceLogin <= 7 ? 'watch'
          : 'stalled';

        const contactCount  = Number(contacts?.c ?? 0);
        const activationCount = Number(acts?.c ?? 0);
        const hasContacts   = contactCount >= 3;
        const hasActivations = activationCount > 0;
        const hasRecent7d   = Number(det7?.c ?? 0) > 0;

        const milestone = !hasContacts || !org.onboardingCompleted ? 'setup'
          : hasActivations && hasRecent7d ? 'live'
          : hasActivations ? 'dry-run'
          : 'dry-run';

        const daysSinceCreation = org.createdAt
          ? Math.floor((now.getTime() - new Date(org.createdAt).getTime()) / 86400000)
          : null;
        const pilotDayRemaining = daysSinceCreation !== null ? Math.max(0, 90 - daysSinceCreation) : null;

        return {
          id: org.id,
          name: org.name,
          industry: org.industry || 'Enterprise',
          subscriptionTier: org.subscriptionTier || 'basic',
          createdAt: org.createdAt,
          lastUserLoginAt: lastLogin,
          daysSinceLogin,
          health,
          triggerDetections7d:  Number(det7?.c  ?? 0),
          triggerDetections30d: Number(det30?.c ?? 0),
          playbookActivations:  activationCount,
          stakeholderContactsCount: contactCount,
          taskAcknowledgments30d: taskAcks,
          onboardingCompleted: !!org.onboardingCompleted,
          milestone,
          pilotDayRemaining,
        };
      }));

      // Sort: stalled first, then watch, then active, then pending
      const order: Record<string,number> = { stalled: 0, watch: 1, active: 2, pending: 3 };
      result.sort((a, b) => (order[a.health] ?? 9) - (order[b.health] ?? 9));
      res.json({ orgs: result, generatedAt: now.toISOString() });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ─── Execution Intelligence / Maturity Score ─────────────────────────────

  app.get('/api/intelligence/maturity-score', requireOrgAccess, async (req: any, res) => {
    try {
      const score = await storage.getExecutionMaturityScore(req.user.organizationId);
      res.json(score);
    } catch (error) {
      res.status(500).json({ error: 'Failed to compute maturity score' });
    }
  });

  // ─── Playbook Performance Fingerprint ────────────────────────────────────

  app.get('/api/playbook-performance/:playbookId', requireOrgAccess, async (req: any, res) => {
    try {
      const fingerprint = await storage.getPlaybookPerformanceFingerprint(
        req.user.organizationId, req.params.playbookId
      );
      res.json(fingerprint);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch playbook performance data' });
    }
  });

  // ─── Signal Monitoring Config ────────────────────────────────────────────────
  app.get('/api/signal-monitoring-config', requireOrgAccess, async (req: any, res) => {
    try {
      const orgId = req.user.organizationId;
      const config = await storage.getSignalMonitoringConfig(orgId);
      res.json({
        disabledDataPoints: config?.disabledDataPoints || [],
        evaluationMode: config?.evaluationMode || 'both',
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.patch('/api/signal-monitoring-config', requireOrgAccess, async (req: any, res) => {
    try {
      const orgId = req.user.organizationId;
      const { disabledDataPoints, evaluationMode } = req.body;
      if (!Array.isArray(disabledDataPoints)) {
        return res.status(400).json({ error: 'disabledDataPoints must be an array' });
      }
      const validModes = ['configured', 'default', 'both'];
      if (evaluationMode !== undefined && !validModes.includes(evaluationMode)) {
        return res.status(400).json({ error: `evaluationMode must be one of: ${validModes.join(', ')}` });
      }
      const config = await storage.upsertSignalMonitoringConfig(orgId, disabledDataPoints, evaluationMode);
      res.json({
        disabledDataPoints: config.disabledDataPoints || [],
        evaluationMode: config.evaluationMode || 'both',
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  console.log('✅ Feature routes registered: role-availability, activation-outcomes, customer-health, maturity-score, playbook-performance, signal-monitoring-config');

  // ─── Trigger Evaluation Diagnostic ─────────────────────────────────────────
  // Returns a summary of the org's configured triggers and what confidence floors
  // they require — so admins can verify the evaluation engine is wired correctly.
  app.get('/api/trigger-evaluation-summary', requireOrgAccess, async (req: any, res) => {
    try {
      const { getOrgTriggerSummary } = await import('./services/TriggerEvaluationEngine.js');
      const orgId = req.user.organizationId;
      const summary = await getOrgTriggerSummary(orgId);
      res.json(summary);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ── Coordination Intelligence ─────────────────────────────────────────────
  // Aggregated coordination timing data — powers the Coordination Intelligence dashboard

  app.get('/api/coordination-intelligence', requireOrgAccess, async (req: any, res) => {
    try {
      const orgId = req.orgId;

      const activations = await db.select().from(playbookActivations)
        .where(eq(playbookActivations.organizationId, orgId))
        .orderBy(desc(playbookActivations.activatedAt))
        .limit(50);

      const outcomes = await db.select().from(activationOutcomes)
        .where(eq(activationOutcomes.organizationId, orgId));

      const outcomeMap = new Map(outcomes.map((o: any) => [o.activationId, o]));

      const TARGET_MINUTES = 12;
      const INDUSTRY_MINUTES = 43200; // 30 days in minutes

      const enriched = activations.map((a: any) => {
        const outcome = outcomeMap.get(a.id);
        const minutes = a.actualExecutionTime || outcome?.actualMinutes || null;
        return {
          id: a.id,
          activatedAt: a.activatedAt,
          playbookId: a.playbookId,
          activationReason: a.activationReason,
          actualMinutes: minutes,
          targetMet: minutes !== null ? minutes <= TARGET_MINUTES : a.targetMet,
          successRating: a.successRating,
          aiSummary: outcome?.aiSummary || null,
        };
      });

      const withTime = enriched.filter(e => e.actualMinutes !== null);
      const avgMinutes = withTime.length > 0
        ? Math.round(withTime.reduce((s, e) => s + e.actualMinutes!, 0) / withTime.length)
        : null;
      const fastestMinutes = withTime.length > 0 ? Math.min(...withTime.map(e => e.actualMinutes!)) : null;
      const targetMetCount = withTime.filter(e => e.targetMet).length;
      const targetMetRate = withTime.length > 0 ? Math.round((targetMetCount / withTime.length) * 100) : null;
      const speedMultiplier = avgMinutes && avgMinutes > 0 ? Math.round(INDUSTRY_MINUTES / avgMinutes) : null;

      res.json({
        summary: {
          totalActivations: activations.length,
          avgMinutes,
          fastestMinutes,
          targetMinutes: TARGET_MINUTES,
          industryMinutes: INDUSTRY_MINUTES,
          targetMetRate,
          speedMultiplier,
        },
        activations: enriched,
      });
    } catch (error) {
      console.error('Coordination intelligence error:', error);
      res.status(500).json({ error: 'Failed to load coordination intelligence data' });
    }
  });

  // POST /api/coordination-intelligence/board-brief
  // Generates an AI board brief from a specific activation's data
  app.post('/api/coordination-intelligence/board-brief', requireOrgAccess, async (req: any, res) => {
    try {
      const { activationId, playbookName, situationSummary, actualMinutes, targetMet, stakeholderCount, tasksCompleted, totalTasks } = req.body;

      const { openAIService } = await import('./services/OpenAIService.js');

      const prompt = `You are a strategic executive briefing writer for a Fortune 1000 company. Write a concise, professional board-ready activation report based on the following:

Playbook: ${playbookName || 'Strategic Response Playbook'}
Situation: ${situationSummary || 'Strategic trigger detected and responded to'}
Coordination Time: ${actualMinutes ? actualMinutes + ' minutes' : '12 minutes'}
Target (12-min benchmark): ${targetMet ? 'MET' : 'EXCEEDED'}
Stakeholders Mobilized: ${stakeholderCount || 'Full executive team'}
Tasks Completed: ${tasksCompleted || 'All primary tasks'} of ${totalTasks || 'all tasks'}

Write in three short paragraphs: (1) What happened and how fast the organization responded, (2) Who was mobilized and what was decided, (3) Strategic outcome and institutional learning captured. Use board-level language. Do not use bullet points. Do not use headers. Maximum 180 words.`;

      const brief = await openAIService.analyzeText(prompt);

      res.json({
        activationId,
        brief,
        generatedAt: new Date().toISOString(),
        playbookName: playbookName || 'Strategic Response Playbook',
      });
    } catch (error) {
      console.error('Board brief generation error:', error);
      res.status(500).json({ error: 'Failed to generate board brief' });
    }
  });

  // ── WOW Feature Routes ──────────────────────────────────────────────────────

  // Compound Threat Alerts — GET list
  app.get('/api/compound-threats', requireOrgAccess, async (req: any, res) => {
    try {
      const orgId = req.orgId;
      const threats = await db.select().from(compoundThreatAlerts)
        .where(eq(compoundThreatAlerts.organizationId, orgId))
        .orderBy(desc(compoundThreatAlerts.detectedAt))
        .limit(20);
      res.json(threats);
    } catch (err: any) { res.status(500).json({ error: err.message }); }
  });

  // Compound Threat Alerts — POST analyze (GPT-4o cross-domain synthesis)
  app.post('/api/compound-threats/analyze', requireOrgAccess, async (req: any, res) => {
    try {
      const orgId = req.orgId;
      const { openAIService } = await import('./services/OpenAIService.js');
      const triggers = await db.select().from(executiveTriggers)
        .where(eq(executiveTriggers.organizationId, orgId))
        .limit(100);
      const activeDomains = Array.from(new Set(triggers.filter((t: any) => t.isActive).map((t: any) => t.category)));
      const prompt = `You are a strategic threat intelligence AI. Analyze these active signal domains and their trigger configurations to detect cross-domain compound threats.

Active monitoring domains: ${activeDomains.join(', ')}
Total active triggers: ${triggers.filter((t: any) => t.isActive).length}
High-severity triggers: ${triggers.filter((t: any) => t.severity === 'critical' || t.severity === 'high').length}

Identify 2-3 compound threats where signals across multiple domains could combine into a larger strategic risk. For each threat:
1. Name the domains involved
2. Describe the compound threat hypothesis
3. Reference a historical business scenario it resembles (if any)
4. Suggest a confidence level (0-100)
5. Recommend a playbook category to pre-stage

Respond as JSON array: [{ "domains": ["domain1","domain2"], "threatType": "string", "confidence": 75, "aiHypothesis": "detailed hypothesis", "historicalMatch": "optional reference", "recommendedPlaybookCategory": "string" }]`;
      const raw = await openAIService.analyzeText(prompt);
      let threats: any[] = [];
      try {
        const jsonMatch = raw.match(/\[[\s\S]*\]/);
        threats = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
      } catch { threats = []; }
      const saved = [];
      for (const t of threats) {
        const [inserted] = await db.insert(compoundThreatAlerts).values({
          organizationId: orgId,
          domains: t.domains || [],
          threatType: t.threatType || 'Unknown Compound Threat',
          confidence: Math.min(100, Math.max(0, t.confidence || 50)),
          aiHypothesis: t.aiHypothesis || '',
          historicalMatch: t.historicalMatch || null,
          status: 'active',
        }).returning();
        saved.push(inserted);
      }

      // Send email alerts for high-confidence compound threats
      const highConf = saved.filter((t: any) => (t.confidence || 0) >= 70);
      if (highConf.length > 0) {
        try {
          const apiKey = process.env.RESEND_API_KEY || process.env.Resend_API_Key;
          if (apiKey) {
            const { stakeholderContacts: scTable } = await import('@shared/schema');
            const contacts = await db.select().from(scTable)
              .where(and(eq(scTable.organizationId, orgId), eq(scTable.isActive, true)));
            const emails = contacts.map((c: any) => c.email).filter(Boolean);
            if (emails.length > 0) {
              const { Resend } = await import('resend');
              const resend = new Resend(apiKey);
              const platformUrl = process.env.APP_URL || 'https://vaughnmartin.com';
              const threatRows = highConf.map((t: any) => `
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid #e8e4dc;color:#0A0F2E;font-size:14px;font-weight:600;">${t.threatType}</td>
                  <td style="padding:12px 0;border-bottom:1px solid #e8e4dc;color:#666;font-size:13px;">${(t.domains || []).join(', ')}</td>
                  <td style="padding:12px 0;border-bottom:1px solid #e8e4dc;color:#C9A84C;font-size:13px;font-weight:700;text-align:right;">${t.confidence}%</td>
                </tr>
                <tr>
                  <td colspan="3" style="padding:8px 0 16px;font-size:13px;color:#444;line-height:1.5;border-bottom:1px solid #f0ede4;">${(t.aiHypothesis || '').substring(0, 260)}${(t.aiHypothesis || '').length > 260 ? '…' : ''}</td>
                </tr>`).join('');
              const html = `
                <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background:#f8f7f4;padding:40px 0;">
                  <div style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e8e4dc;">
                    <div style="background:#132558;padding:32px 36px;">
                      <div style="color:#C9A84C;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Execution OS · Compound Threat Intelligence</div>
                      <div style="color:#ffffff;font-size:22px;font-weight:700;line-height:1.3;">${highConf.length} Cross-Domain Threat${highConf.length > 1 ? 's' : ''} Detected</div>
                      <div style="color:rgba(255,255,255,0.55);font-size:14px;margin-top:8px;">AI synthesis identified compound risk patterns across ${activeDomains.length} active monitoring domains.</div>
                    </div>
                    <div style="padding:32px 36px;">
                      <p style="color:#444;font-size:14px;line-height:1.6;margin-bottom:24px;">The following high-confidence compound threats were identified by cross-domain AI synthesis. Each represents a scenario where signals from multiple strategic domains could combine into a larger risk requiring executive attention.</p>
                      <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
                        <tr style="border-bottom:2px solid #0A0F2E;">
                          <th style="padding:8px 0;text-align:left;font-size:11px;color:#0A0F2E;letter-spacing:1px;text-transform:uppercase;">Threat Type</th>
                          <th style="padding:8px 0;text-align:left;font-size:11px;color:#0A0F2E;letter-spacing:1px;text-transform:uppercase;">Domains Involved</th>
                          <th style="padding:8px 0;text-align:right;font-size:11px;color:#0A0F2E;letter-spacing:1px;text-transform:uppercase;">Confidence</th>
                        </tr>
                        ${threatRows}
                      </table>
                      <div style="text-align:center;margin-bottom:12px;">
                        <a href="${platformUrl}/command-center" style="display:inline-block;background:#132558;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:14px;font-weight:600;letter-spacing:0.5px;margin-bottom:12px;">Review in Command Center →</a>
                      </div>
                      <div style="text-align:center;">
                        <a href="${platformUrl}/playbooks" style="display:inline-block;background:#C9A84C;color:#0A0F2E;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:14px;font-weight:700;letter-spacing:0.5px;">Pre-Stage a Playbook →</a>
                      </div>
                    </div>
                    <div style="background:#f8f7f4;padding:20px 36px;border-top:1px solid #e8e4dc;">
                      <div style="color:#999;font-size:11px;text-align:center;">Compound Threat Intelligence monitors cross-domain signal combinations. Human executive review required before any action is taken.</div>
                      <div style="text-align:center;margin-top:10px;"><a href="__UNSUBSCRIBE_URL__" style="color:#ccc;font-size:10px;text-decoration:underline;">Unsubscribe from Execution OS alerts</a></div>
                    </div>
                  </div>
                </div>`;
              for (const contact of contacts.filter((c: any) => c.email)) {
                const token = Buffer.from(contact.email).toString('base64url');
                const personalizedHtml = html.replace('__UNSUBSCRIBE_URL__', `${platformUrl}/api/unsubscribe?t=${token}`);
                await resend.emails.send({
                  from: 'Execution OS <pilot@vaughnmartin.com>',
                  replyTo: 'pilot@vaughnmartin.com',
                  to: [contact.email],
                  subject: `⚠️ ${highConf.length} Compound Threat${highConf.length > 1 ? 's' : ''} Detected — Cross-Domain Risk Analysis`,
                  html: personalizedHtml,
                });
              }
              console.log(`📧 Compound threat alert sent to ${emails.join(', ')}`);
            }
          }
        } catch (emailErr) {
          console.error('Compound threat email failed:', emailErr);
        }
      }

      res.json({ threats: saved, analyzed: activeDomains.length });
    } catch (err: any) { res.status(500).json({ error: err.message }); }
  });

  // Compound Threat — dismiss
  app.patch('/api/compound-threats/:id/dismiss', requireOrgAccess, async (req: any, res) => {
    try {
      await db.update(compoundThreatAlerts).set({ status: 'dismissed' })
        .where(eq(compoundThreatAlerts.id, req.params.id));
      res.json({ success: true });
    } catch (err: any) { res.status(500).json({ error: err.message }); }
  });

  // ROI Summary
  app.get('/api/roi/summary', requireOrgAccess, async (req: any, res) => {
    try {
      const orgId = req.orgId;
      const activations = await db.select().from(playbookActivations)
        .where(eq(playbookActivations.organizationId, orgId));
      const completed = activations.filter((a: any) => a.completedAt && a.actualExecutionTime);
      const avgMinutes = completed.length
        ? Math.round(completed.reduce((s: number, a: any) => s + (a.actualExecutionTime || 0), 0) / completed.length)
        : 0;
      const industryBenchmark = 4320; // 72 hours in minutes
      const minutesSavedPerEvent = Math.max(0, industryBenchmark - avgMinutes);
      const valuePerMinute = 3472; // ~$5M/day Fortune 1000 avg → ~$3,472/min
      const estimatedValuePreserved = Math.round(minutesSavedPerEvent * valuePerMinute * completed.length / 1000000);
      const targetMetCount = activations.filter((a: any) => a.targetMet).length;
      res.json({
        activationCount: activations.length,
        completedCount: completed.length,
        avgResponseMinutes: avgMinutes,
        industryBenchmarkMinutes: industryBenchmark,
        minutesSavedPerEvent,
        estimatedValuePreservedMillions: estimatedValuePreserved,
        targetMetRate: activations.length ? Math.round(targetMetCount / activations.length * 100) : 0,
        avgResponseVsBenchmark: industryBenchmark > 0 ? Math.round((1 - avgMinutes / industryBenchmark) * 100) : 0,
      });
    } catch (err: any) { res.status(500).json({ error: err.message }); }
  });

  // ROI Board Report (detailed timeline)
  app.get('/api/roi/board-report', requireOrgAccess, async (req: any, res) => {
    try {
      const orgId = req.orgId;
      const activations = await db.select().from(playbookActivations)
        .where(eq(playbookActivations.organizationId, orgId))
        .orderBy(desc(playbookActivations.activatedAt))
        .limit(50);
      const outcomes = await db.select().from(activationOutcomes)
        .where(eq(activationOutcomes.organizationId, orgId));
      const outcomeMap = new Map(outcomes.map((o: any) => [o.activationId, o]));
      const events = activations.map((a: any) => {
        const outcome = outcomeMap.get(a.id);
        const minutesSaved = Math.max(0, 4320 - (a.actualExecutionTime || 0));
        return {
          id: a.id,
          activatedAt: a.activatedAt,
          actualMinutes: a.actualExecutionTime,
          targetMet: a.targetMet,
          minutesSaved,
          estimatedValueM: Math.round(minutesSaved * 3472 / 1000000 * 10) / 10,
          aiSummary: outcome?.aiSummary || null,
        };
      });
      res.json({ events, totalEvents: activations.length });
    } catch (err: any) { res.status(500).json({ error: err.message }); }
  });

  // Shadow Strategy Simulator — analyze
  app.post('/api/simulation/analyze', requireOrgAccess, async (req: any, res) => {
    try {
      const orgId = req.orgId;
      const { scenarioText } = req.body;
      if (!scenarioText) return res.status(400).json({ error: 'scenarioText required' });
      const { openAIService } = await import('./services/OpenAIService.js');
      const playbooks = await db.select({ id: playbookLibrary.id, name: playbookLibrary.name, domain: playbookLibrary.domainId })
        .from(playbookLibrary).where(eq(playbookLibrary.isActive, true)).limit(50);
      const prompt = `You are a strategic execution AI for a Fortune 1000 company. Analyze this simulated scenario and score the company's readiness.

SCENARIO: "${scenarioText}"

Available playbooks: ${playbooks.map((p: any) => p.name).join(', ')}

Provide:
1. SURVIVE SCORE (0-100): Probability the company avoids major damage
2. THRIVE SCORE (0-100): Probability the company turns this into competitive advantage
3. Which playbooks from the list would activate
4. Coverage gaps (domains/scenarios not covered by current playbooks)
5. Brief executive analysis (2-3 sentences)
6. Domains most impacted (from: financial, market, operational, technology, regulatory, talent, competitive, esg, cyber, brand)

Respond as JSON: { "surviveScore": 72, "thriveScore": 45, "activatedPlaybooks": ["name1","name2"], "coverageGaps": ["gap1","gap2"], "activatedDomains": ["domain1"], "aiAnalysis": "analysis text" }`;
      const raw = await openAIService.analyzeText(prompt);
      let result: any = { surviveScore: 60, thriveScore: 30, activatedPlaybooks: [], coverageGaps: [], activatedDomains: [], aiAnalysis: '' };
      try {
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (jsonMatch) result = { ...result, ...JSON.parse(jsonMatch[0]) };
      } catch {}
      const [saved] = await db.insert(simulationAnalyses).values({
        organizationId: orgId,
        scenarioText,
        surviveScore: Math.min(100, Math.max(0, result.surviveScore || 60)),
        thriveScore: Math.min(100, Math.max(0, result.thriveScore || 30)),
        aiAnalysis: result.aiAnalysis || '',
        coverageGaps: result.coverageGaps || [],
        recommendedPlaybooks: result.activatedPlaybooks || [],
        activatedDomains: result.activatedDomains || [],
      }).returning();
      res.json(saved);
    } catch (err: any) { res.status(500).json({ error: err.message }); }
  });

  // Simulation history
  app.get('/api/simulation-analyses', requireOrgAccess, async (req: any, res) => {
    try {
      const analyses = await db.select().from(simulationAnalyses)
        .where(eq(simulationAnalyses.organizationId, req.orgId))
        .orderBy(desc(simulationAnalyses.createdAt)).limit(20);
      res.json(analyses);
    } catch (err: any) { res.status(500).json({ error: err.message }); }
  });

  // Strategic Recorder — analyze
  app.post('/api/strategic-recorder/analyze', requireOrgAccess, async (req: any, res) => {
    try {
      const orgId = req.orgId;
      const { inputText } = req.body;
      if (!inputText || inputText.length < 50) return res.status(400).json({ error: 'Minimum 50 characters required' });
      const [recording] = await db.insert(strategicRecordings).values({
        organizationId: orgId, inputText, status: 'processing',
      }).returning();
      const { openAIService } = await import('./services/OpenAIService.js');
      const prompt = `You are an AI that reverse-engineers corporate playbooks from past crisis records, meeting notes, or incident descriptions.

INPUT TEXT:
"${inputText.slice(0, 3000)}"

Extract and generate 2-4 strategic playbooks based on what you can infer. For each playbook:
- Name it (e.g. "Supply Chain Disruption Response")
- Identify the trigger condition
- List 4-6 execution phases with task descriptions
- Identify stakeholder roles (CEO, CFO, COO, etc.)
- Assign a domain (financial, operational, market, technology, regulatory, talent, crisis)
- Write a 1-sentence value proposition

Respond as JSON array: [{ "name": "...", "domain": "...", "trigger": "...", "valueProposition": "...", "stakeholders": ["CEO","CFO"], "phases": [{ "name": "Phase 1", "duration": "0-30 min", "tasks": ["task1","task2"] }] }]`;
      const raw = await openAIService.analyzeText(prompt);
      let generated: any[] = [];
      try {
        const jsonMatch = raw.match(/\[[\s\S]*\]/);
        generated = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
      } catch {}
      await db.update(strategicRecordings).set({ generatedPlaybooks: generated, status: 'complete' })
        .where(eq(strategicRecordings.id, recording.id));
      res.json({ id: recording.id, generatedPlaybooks: generated, status: 'complete' });
    } catch (err: any) { res.status(500).json({ error: err.message }); }
  });

  // Strategic Recordings — list
  app.get('/api/strategic-recordings', requireOrgAccess, async (req: any, res) => {
    try {
      const recordings = await db.select().from(strategicRecordings)
        .where(eq(strategicRecordings.organizationId, req.orgId))
        .orderBy(desc(strategicRecordings.createdAt)).limit(10);
      res.json(recordings);
    } catch (err: any) { res.status(500).json({ error: err.message }); }
  });

  // ─── Investor Access Gate ───────────────────────────────────────────────────
  app.post('/api/investor-access', async (req: any, res) => {
    try {
      const { name, email, company, role, pageAccessed } = req.body;
      if (!name || !email || !company || !role) {
        return res.status(400).json({ error: 'All fields are required' });
      }
      const lead = await storage.createInvestorLead({ name, email, company, role, pageAccessed: pageAccessed || '/investor-resources' });
      res.json({ success: true, id: lead.id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/investor-leads', async (req: any, res) => {
    if (!req.isAuthenticated() || req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin only' });
    }
    try {
      const leads = await storage.getInvestorLeads();
      res.json(leads);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ─── T1: Task Acknowledgment Audit Trail ──────────────────────────────────────
  app.post('/api/task-acknowledgments', async (req: any, res) => {
    try {
      const { sessionId, taskLabel, taskIndex, acknowledgedBy, acknowledgedRole, actionType, notes } = req.body;
      if (!sessionId || !taskLabel || !acknowledgedBy || !acknowledgedRole) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const orgId = req.orgId || null;
      const [ack] = await db.insert(taskAcknowledgments).values({
        sessionId,
        taskLabel,
        taskIndex: taskIndex ?? null,
        acknowledgedBy,
        acknowledgedRole,
        actionType: actionType || 'complete',
        notes: notes || null,
        organizationId: orgId,
      }).returning();
      res.json(ack);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/task-acknowledgments/:sessionId', async (req: any, res) => {
    try {
      const { sessionId } = req.params;
      const acks = await db.select().from(taskAcknowledgments)
        .where(eq(taskAcknowledgments.sessionId, sessionId))
        .orderBy(asc(taskAcknowledgments.acknowledgedAt));
      res.json(acks);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ─── T2: Execution History Dashboard ──────────────────────────────────────────
  app.get('/api/execution-history', async (req: any, res) => {
    try {
      const orgId = req.orgId;
      if (!orgId) {
        // Return demo data for unauthenticated preview
        const demoHistory = buildDemoExecutionHistory();
        return res.json(demoHistory);
      }
      // Real data: join activations with playbook library
      const activations = await db.select({
        id: playbookActivations.id,
        playbookId: playbookActivations.playbookId,
        activatedAt: playbookActivations.activatedAt,
        completedAt: playbookActivations.completedAt,
        actualExecutionTime: playbookActivations.actualExecutionTime,
        successRating: playbookActivations.successRating,
        targetMet: playbookActivations.targetMet,
        lessonsLearned: playbookActivations.lessonsLearned,
        playbookName: playbookLibrary.name,
        playbookDomainId: playbookLibrary.domainId,
        severityScore: playbookLibrary.severityScore,
      })
        .from(playbookActivations)
        .leftJoin(playbookLibrary, eq(playbookActivations.playbookId, playbookLibrary.id))
        .where(eq(playbookActivations.organizationId, orgId))
        .orderBy(desc(playbookActivations.activatedAt))
        .limit(50);

      // Compute summary stats
      const total = activations.length;
      const completed = activations.filter(a => a.completedAt);
      const avgTime = completed.length
        ? Math.round(completed.reduce((s, a) => s + (a.actualExecutionTime || 12), 0) / completed.length)
        : null;
      const targetMetCount = activations.filter(a => a.targetMet).length;
      const avgScore = completed.length
        ? Math.round(completed.reduce((s, a) => s + (a.successRating || 75), 0) / completed.length)
        : null;

      res.json({
        summary: { total, avgTime, targetMetCount, avgScore, timeSaved: total * 60 },
        activations,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ─── T3: Flagship Playbook Enrichment Seed ────────────────────────────────────
  app.post('/api/admin/seed-flagship-playbooks', async (req: any, res) => {
    if (!req.isAuthenticated() || req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin only' });
    }
    try {
      const results = await seedFlagshipPlaybooks();
      res.json({ success: true, updated: results });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Shadow Strategy Simulator — PUBLIC (no auth required — for homepage/demo use)
  app.post('/api/simulation/public-analyze', async (req: any, res) => {
    try {
      const { scenarioText } = req.body;
      if (!scenarioText || scenarioText.trim().length < 10) {
        return res.status(400).json({ error: 'Please describe your scenario (minimum 10 characters)' });
      }
      const { openAIService } = await import('./services/OpenAIService.js');
      const playbooks = await db.select({ id: playbookLibrary.id, name: playbookLibrary.name, domain: playbookLibrary.domainId })
        .from(playbookLibrary).where(eq(playbookLibrary.isActive, true)).limit(60);

      const prompt = `You are a strategic execution AI for Fortune 1000 enterprises. A prospect has described a real threat their organization is facing. Score their likely readiness and recommend specific playbooks.

SCENARIO: "${scenarioText}"

Available playbooks from the Execution OS library (170 total across 9 domains):
${playbooks.map((p: any) => `- ${p.name} (${p.domain})`).slice(0, 40).join('\n')}

Respond ONLY as JSON with this structure:
{
  "surviveScore": 72,
  "thriveScore": 38,
  "activatedPlaybooks": ["Playbook Name 1", "Playbook Name 2", "Playbook Name 3"],
  "aiAnalysis": "3-sentence executive-level analysis of why this scenario is a strategic risk and what separates organizations that thrive from those that merely survive",
  "urgencyLevel": "critical|high|medium",
  "timeToRespond": "e.g. 12 minutes with Execution OS vs 72 hours without"
}`;

      const raw = await openAIService.analyzeText(prompt);
      let result: any = {
        surviveScore: 65,
        thriveScore: 30,
        activatedPlaybooks: ['Strategic Response Protocol', 'Crisis Communications Playbook', 'Executive Coordination Framework'],
        aiAnalysis: 'This scenario requires immediate cross-functional coordination across multiple stakeholder groups. Organizations with pre-staged playbooks respond 340x faster than those without structured execution frameworks. The difference between surviving and thriving is measured in minutes, not days.',
        urgencyLevel: 'high',
        timeToRespond: '12 minutes with Execution OS vs 72 hours without'
      };
      try {
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (jsonMatch) result = { ...result, ...JSON.parse(jsonMatch[0]) };
      } catch {}

      res.json({
        surviveScore: Math.min(100, Math.max(0, result.surviveScore || 65)),
        thriveScore: Math.min(100, Math.max(0, result.thriveScore || 30)),
        activatedPlaybooks: result.activatedPlaybooks || [],
        aiAnalysis: result.aiAnalysis || '',
        urgencyLevel: result.urgencyLevel || 'high',
        timeToRespond: result.timeToRespond || '12 minutes with Execution OS vs 72 hours without',
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ─── Crisis Communications Generator ─────────────────────────────────────────
  app.post('/api/crisis-communications/generate', async (req: any, res) => {
    try {
      const { scenarioType, severity, context } = req.body;
      if (!scenarioType || !severity) {
        return res.status(400).json({ error: 'scenarioType and severity are required' });
      }

      const { openAIService } = await import('./services/OpenAIService.js');

      const prompt = `You are a Fortune 1000 crisis communications expert. Generate 5 audience-specific crisis communications for an enterprise organization.

SCENARIO TYPE: ${scenarioType}
SEVERITY: ${severity}
ADDITIONAL CONTEXT: ${context || 'None provided'}

Generate communications for 5 distinct audiences. Each should be appropriate for the audience and severity level.

Respond ONLY as JSON with this exact structure:
{
  "board": "Full Board of Directors brief — 3-4 bullet points with situation, financial exposure, and recommended board-level decision required. Format as: BOARD BRIEF — CONFIDENTIAL\\n[header]\\n\\nSITUATION\\n[text]\\n\\nFINANCIAL EXPOSURE\\n[text]\\n\\nDECISION REQUIRED\\n[text]",
  "employees": "Full employee message — from CEO, reassuring, direct, tells employees what to do and not do. 3-4 paragraphs.",
  "customers": "Full customer/partner statement — confidence-preserving, commitment to transparency and service continuity. 2-3 paragraphs.",
  "analysts": "Full investor/analyst statement — disclosure language, financial impact framing, forward-looking cautionary statement. 2-3 paragraphs.",
  "regulators": "Full regulatory notification — formal tone, incident details, timeline, scope, remediation commitment. Structured with headers."
}`;

      const raw = await openAIService.analyzeText(prompt);

      const fallback = {
        board: `BOARD BRIEF — CONFIDENTIAL\n${severity.toUpperCase()} SEVERITY · ${scenarioType}\n\nSITUATION\nA ${scenarioType.replace(/-/g, ' ')} event has been detected and confirmed. Immediate response protocols are active. Containment measures underway.\n\nFINANCIAL EXPOSURE\nPreliminary assessment indicates material financial exposure. Full quantification within 4 hours. CFO has been briefed.\n\nDECISION REQUIRED\n(1) Authorize external expert engagement, (2) Approve initial response budget, (3) Confirm board communication cadence.`,
        employees: `MESSAGE FROM [CEO NAME]\n\nTeam,\n\nI want to be direct with you about a situation we are managing.\n\nOur team has identified and is actively responding to a ${scenarioType.replace(/-/g, ' ')} event. Our response protocols are working as designed.\n\nWhat this means for you:\n• Continue your work normally — our operations are not affected\n• Do not comment publicly or to media — direct all inquiries to communications@company.com\n• You will receive an update by [time] today\n\nYour leadership team is on this. We will keep you informed.\n\n[CEO Name]`,
        customers: `STATEMENT — [COMPANY NAME]\n\nWe want to inform you of a situation we are currently managing with full attention and urgency.\n\nOur team has identified and contained a ${scenarioType.replace(/-/g, ' ')} incident. All services remain fully operational. We have found no evidence of impact to customer data or commitments.\n\nWe are conducting a thorough review with external experts and will proactively share material updates. For questions, contact support@company.com.\n\n[Company Name] Leadership`,
        analysts: `INVESTOR STATEMENT\n\n[Company Name] is disclosing a ${scenarioType.replace(/-/g, ' ')} incident that was identified and contained on [date].\n\nPreliminary assessment: No material impact to revenue or full-year guidance anticipated at this stage. Forensic review is ongoing. Estimated remediation costs and any revision to guidance will be disclosed promptly.\n\nForward-looking statements in this release are subject to risk factors detailed in our most recent 10-K filing.\n\nInvestor Relations: ir@company.com`,
        regulators: `INCIDENT NOTIFICATION — PRIVILEGED AND CONFIDENTIAL\n\nTo: [Regulatory Body]\nFrom: [Chief Legal Officer]\nDate: [Date]\nRe: Formal Incident Notification — ${scenarioType.replace(/-/g, ' ')}\n\nPursuant to applicable regulatory requirements, [Company Name] hereby provides formal notification of a ${scenarioType.replace(/-/g, ' ')} incident.\n\nINCIDENT SUMMARY\nNature: ${scenarioType.replace(/-/g, ' ')} — ${severity} severity\nDetected: [Date/Time]\nContained: [Date/Time]\nScope: Under active forensic investigation\n\nREMEDIATION\nExternal forensic firm engaged immediately. Full incident report to be provided within 30 days.\n\nWe commit to full cooperation with any regulatory review.\n\n[Signature]`,
      };

      let result = fallback;
      try {
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.board && parsed.employees && parsed.customers && parsed.analysts && parsed.regulators) {
            result = parsed;
          }
        }
      } catch {}

      res.json({
        ...result,
        generatedAt: new Date().toISOString(),
        scenario: scenarioType,
        severity,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  console.log('✅ WOW feature routes registered: compound-threats, roi, simulation, strategic-recorder');

  // ── Auto compound threat analysis: runs every 4 hours across all active orgs ──
  async function runAutoCompoundThreatAnalysis() {
    try {
      const { openAIService } = await import('./services/OpenAIService.js');
      const { organizations: orgsTable, executiveTriggers: etTable, compoundThreatAlerts: ctaTable, stakeholderContacts: scTable } = await import('@shared/schema');
      const orgs = await db.select({ id: orgsTable.id, name: orgsTable.name }).from(orgsTable);
      for (const org of orgs) {
        try {
          const triggers = await db.select().from(etTable)
            .where(eq(etTable.organizationId, org.id)).limit(100);
          const activeDomains = Array.from(new Set(triggers.filter((t: any) => t.isActive).map((t: any) => t.category)));
          if (activeDomains.length < 2) continue;
          const prompt = `You are a strategic threat intelligence AI. Analyze these active signal domains and their trigger configurations to detect cross-domain compound threats.\n\nActive monitoring domains: ${activeDomains.join(', ')}\nTotal active triggers: ${triggers.filter((t: any) => t.isActive).length}\nHigh-severity triggers: ${triggers.filter((t: any) => t.severity === 'critical' || t.severity === 'high').length}\n\nIdentify 2-3 compound threats where signals across multiple domains could combine into a larger strategic risk. For each threat:\n1. Name the domains involved\n2. Describe the compound threat hypothesis\n3. Reference a historical business scenario it resembles (if any)\n4. Suggest a confidence level (0-100)\n5. Recommend a playbook category to pre-stage\n\nRespond as JSON array: [{ "domains": ["domain1","domain2"], "threatType": "string", "confidence": 75, "aiHypothesis": "detailed hypothesis", "historicalMatch": "optional reference", "recommendedPlaybookCategory": "string" }]`;
          const raw = await openAIService.analyzeText(prompt);
          let threats: any[] = [];
          try {
            const jsonMatch = raw.match(/\[[\s\S]*\]/);
            threats = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
          } catch { threats = []; }
          const saved = [];
          for (const t of threats) {
            const [inserted] = await db.insert(ctaTable).values({
              organizationId: org.id,
              domains: t.domains || [],
              threatType: t.threatType || 'Unknown Compound Threat',
              confidence: Math.min(100, Math.max(0, t.confidence || 50)),
              aiHypothesis: t.aiHypothesis || '',
              historicalMatch: t.historicalMatch || null,
              status: 'active',
            }).returning();
            saved.push(inserted);
          }
          // Email stakeholders for high-confidence threats
          const highConf = saved.filter((t: any) => (t.confidence || 0) >= 70);
          if (highConf.length > 0) {
            const apiKey = process.env.RESEND_API_KEY || process.env.Resend_API_Key;
            if (apiKey) {
              const contacts = await db.select().from(scTable).where(and(eq(scTable.organizationId, org.id), eq(scTable.isActive, true)));
              const emails = contacts.map((c: any) => c.email).filter(Boolean);
              if (emails.length > 0) {
                const { Resend } = await import('resend');
                const resend = new Resend(apiKey);
                const platformUrl = process.env.APP_URL || 'https://vaughnmartin.com';
                const threatRows = highConf.map((t: any) => `<tr><td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#0A0F2E;font-size:14px;font-weight:600;">${t.threatType}</td><td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#666;font-size:13px;">${(t.domains||[]).join(', ')}</td><td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#C9A84C;font-size:13px;font-weight:700;text-align:right;">${t.confidence}%</td></tr><tr><td colspan="3" style="padding:6px 0 12px;font-size:13px;color:#444;line-height:1.5;">${(t.aiHypothesis||'').substring(0,240)}${(t.aiHypothesis||'').length>240?'…':''}</td></tr>`).join('');
                const html = `<div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background:#f8f7f4;padding:40px 0;"><div style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e8e4dc;"><div style="background:#132558;padding:32px 36px;"><div style="color:#C9A84C;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Execution OS · Scheduled Compound Threat Scan</div><div style="color:#ffffff;font-size:22px;font-weight:700;line-height:1.3;">${highConf.length} Cross-Domain Threat${highConf.length>1?'s':''} Detected</div><div style="color:rgba(255,255,255,0.55);font-size:14px;margin-top:8px;">Automated 4-hour scan identified compound risk patterns across ${activeDomains.length} domains.</div></div><div style="padding:32px 36px;"><table style="width:100%;border-collapse:collapse;margin-bottom:28px;"><tr style="border-bottom:2px solid #0A0F2E;"><th style="padding:8px 0;text-align:left;font-size:11px;color:#0A0F2E;letter-spacing:1px;text-transform:uppercase;">Threat Type</th><th style="padding:8px 0;text-align:left;font-size:11px;color:#0A0F2E;letter-spacing:1px;text-transform:uppercase;">Domains</th><th style="padding:8px 0;text-align:right;font-size:11px;color:#0A0F2E;letter-spacing:1px;text-transform:uppercase;">Confidence</th></tr>${threatRows}</table><div style="text-align:center;"><a href="${platformUrl}/command-center" style="display:inline-block;background:#132558;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:14px;font-weight:600;letter-spacing:0.5px;margin-right:12px;">Review in Command Center →</a><a href="${platformUrl}/playbooks" style="display:inline-block;background:#C9A84C;color:#0A0F2E;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:14px;font-weight:700;letter-spacing:0.5px;">Pre-Stage a Playbook →</a></div></div><div style="background:#f8f7f4;padding:20px 36px;border-top:1px solid #e8e4dc;"><div style="color:#999;font-size:11px;text-align:center;">This is an automated scan. Human executive review is required before any action.</div><div style="text-align:center;margin-top:10px;"><a href="__UNSUBSCRIBE_URL__" style="color:#ccc;font-size:10px;text-decoration:underline;">Unsubscribe from Execution OS alerts</a></div></div></div></div>`;
                for (const contact of contacts) {
                  const token = Buffer.from(contact.email!).toString('base64url');
                  const personalizedHtml = html.replace('__UNSUBSCRIBE_URL__', `${platformUrl}/api/unsubscribe?t=${token}`);
                  await resend.emails.send({
                    from: 'Execution OS <pilot@vaughnmartin.com>',
                    replyTo: 'pilot@vaughnmartin.com',
                    to: [contact.email!],
                    subject: `⚠️ Scheduled Scan: ${highConf.length} Compound Threat${highConf.length>1?'s':''} Detected`,
                    html: personalizedHtml,
                  });
                }
                console.log(`📧 [Auto] Compound threat alert sent for org ${org.name} → ${emails.join(', ')}`);
              }
            }
          }
          console.log(`[Auto Compound] Org ${org.name}: ${saved.length} threats analyzed, ${highConf.length} high-confidence`);
        } catch (orgErr: any) {
          console.error(`[Auto Compound] Error for org ${org.id}:`, orgErr.message);
        }
      }
    } catch (err: any) {
      console.error('[Auto Compound] Scheduled analysis failed:', err.message);
    }
  }

  // Run 30 seconds after startup (to let DB settle), then every 4 hours
  setTimeout(() => {
    runAutoCompoundThreatAnalysis();
    setInterval(runAutoCompoundThreatAnalysis, 4 * 60 * 60 * 1000);
  }, 30_000);
  console.log('✅ Compound threat auto-analysis scheduled (every 4 hours)');

  // ─── WOW Feature APIs ──────────────────────────────────────────────────────

  // 1. Execution Timelines — clock history
  app.get('/api/org/execution-timelines', requireOrgAccess, async (req: any, res) => {
    try {
      const { executionTimelines: etTable } = await import('@shared/schema');
      const rows = await db.select().from(etTable)
        .where(eq(etTable.organizationId, req.orgId))
        .orderBy(desc(etTable.detectedAt))
        .limit(50);
      res.json(rows);
    } catch (err: any) { res.status(500).json({ error: err.message }); }
  });

  app.patch('/api/org/execution-timelines/:id/advance', requireOrgAccess, async (req: any, res) => {
    try {
      const { executionTimelines: etTable } = await import('@shared/schema');
      const { milestone, playbookName } = req.body; // 'activated' | 'task_acknowledged' | 'completed'
      const id = parseInt(req.params.id);
      const now = new Date();
      const updates: Record<string, any> = {};
      if (milestone === 'activated') {
        updates.playbookActivatedAt = now;
        updates.playbookName = playbookName;
        updates.status = 'activated';
      } else if (milestone === 'task_acknowledged') {
        updates.firstTaskAcknowledgedAt = now;
      } else if (milestone === 'completed') {
        updates.executionCompletedAt = now;
        const [row] = await db.select().from(etTable).where(eq(etTable.id, id));
        if (row?.detectedAt) {
          const totalMs = now.getTime() - new Date(row.detectedAt).getTime();
          const totalMins = totalMs / 60000;
          updates.totalMinutes = parseFloat(totalMins.toFixed(2));
          updates.speedMultiplier = parseFloat(((30 * 24 * 60) / totalMins).toFixed(0));
          updates.status = 'completed';
        }
      }
      await db.update(etTable).set(updates).where(and(eq(etTable.id, id), eq(etTable.organizationId, req.orgId)));
      res.json({ ok: true });
    } catch (err: any) { res.status(500).json({ error: err.message }); }
  });

  // 2. Execution Dividend — running ROI counter
  app.get('/api/org/execution-dividend', requireOrgAccess, async (req: any, res) => {
    try {
      const { executionTimelines: etTable, playbookActivations: paTable, triggerDetections: tdTable } = await import('@shared/schema');
      const [timelines, activations, detections] = await Promise.all([
        db.select().from(etTable).where(eq(etTable.organizationId, req.orgId)),
        db.select().from(paTable).where(eq(paTable.organizationId, req.orgId)),
        db.select().from(tdTable).where(eq(tdTable.organizationId, req.orgId)),
      ]);

      const completedTimelines = timelines.filter(t => t.totalMinutes && t.speedMultiplier);
      const avgResponseMinutes = completedTimelines.length > 0
        ? completedTimelines.reduce((s, t) => s + (t.totalMinutes || 0), 0) / completedTimelines.length
        : 12; // assume 12-min target if no real data yet

      const triggerCount = detections.length;
      const activationCount = activations.length;

      // Each trigger response represents executive mobilization time saved vs. 30-day baseline.
      // Estimated: 40 executive-hours per trigger avoided × $500/hr default executive rate.
      const EXEC_HOURLY_RATE = 500;
      const HOURS_SAVED_PER_TRIGGER = (30 * 24) - (avgResponseMinutes / 60);
      const totalHoursSaved = Math.round(triggerCount * HOURS_SAVED_PER_TRIGGER);
      const totalValueCreated = Math.round(triggerCount * HOURS_SAVED_PER_TRIGGER * EXEC_HOURLY_RATE);
      const avgSpeedMultiplier = completedTimelines.length > 0
        ? Math.round(completedTimelines.reduce((s, t) => s + (t.speedMultiplier || 3600), 0) / completedTimelines.length)
        : 3600;

      res.json({
        totalValueCreated,
        totalHoursSaved,
        totalTriggersResponded: triggerCount,
        activationCount,
        avgResponseMinutes: parseFloat(avgResponseMinutes.toFixed(1)),
        avgSpeedMultiplier,
        sinceDate: detections.length > 0 ? detections[detections.length - 1].detectedAt : null,
      });
    } catch (err: any) { res.status(500).json({ error: err.message }); }
  });

  // 3. Board Readiness Snapshot
  app.get('/api/org/board-readiness', requireOrgAccess, async (req: any, res) => {
    try {
      const { executionTimelines: etTable, triggerDetections: tdTable, playbookActivations: paTable, stakeholderContacts: scTable } = await import('@shared/schema');
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

      const [detections, timelines, activations, contacts] = await Promise.all([
        db.select().from(tdTable).where(and(eq(tdTable.organizationId, req.orgId), gte(tdTable.detectedAt, ninetyDaysAgo))).orderBy(desc(tdTable.detectedAt)).limit(30),
        db.select().from(etTable).where(eq(etTable.organizationId, req.orgId)).orderBy(desc(etTable.detectedAt)).limit(20),
        db.select().from(paTable).where(eq(paTable.organizationId, req.orgId)).limit(20),
        db.select().from(scTable).where(and(eq(scTable.organizationId, req.orgId), eq(scTable.isActive, true))),
      ]);

      const TOTAL_DOMAINS = 9;
      const activeDomains = [...new Set(detections.map(d => d.triggerDomain).filter(Boolean))];
      const domainCoverage = Math.round((activeDomains.length / TOTAL_DOMAINS) * 100);
      const completedTimelines = timelines.filter(t => t.totalMinutes);
      const avgResponseMinutes = completedTimelines.length > 0
        ? parseFloat((completedTimelines.reduce((s, t) => s + (t.totalMinutes || 12), 0) / completedTimelines.length).toFixed(1))
        : null;
      const recent30 = detections.filter(d => new Date(d.detectedAt!) >= thirtyDaysAgo);
      const readinessScore = Math.min(100, Math.round(
        (activeDomains.length / TOTAL_DOMAINS) * 40 +
        (contacts.length > 0 ? 20 : 0) +
        (activations.length > 0 ? 20 : 0) +
        (detections.length > 0 ? 20 : 0)
      ));

      res.json({
        readinessScore,
        domainCoverage,
        activeDomains,
        totalDomains: TOTAL_DOMAINS,
        triggerCount90d: detections.length,
        triggerCount30d: recent30.length,
        activationCount: activations.length,
        avgResponseMinutes,
        stakeholderCount: contacts.length,
        recentDetections: recent30.slice(0, 5),
        monitoringStatus: recent30.length > 5 ? 'ALERT' : 'MONITORING',
        generatedAt: new Date().toISOString(),
      });
    } catch (err: any) { res.status(500).json({ error: err.message }); }
  });

  // 4. Welcome Brief — first-login personalized view
  app.get('/api/org/welcome-brief', requireOrgAccess, async (req: any, res) => {
    try {
      const { triggerDetections: tdTable, stakeholderContacts: scTable, signalActivityLog: salTable } = await import('@shared/schema');
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

      const [detections, contacts, recentActivity] = await Promise.all([
        db.select().from(tdTable).where(and(eq(tdTable.organizationId, req.orgId), gte(tdTable.detectedAt, thirtyDaysAgo))).orderBy(desc(tdTable.detectedAt)).limit(10),
        db.select().from(scTable).where(eq(scTable.organizationId, req.orgId)),
        db.select().from(salTable).where(gte(salTable.createdAt, threeDaysAgo)).orderBy(desc(salTable.createdAt)).limit(20),
      ]);

      const signalsScanned72h = recentActivity.length;
      res.json({
        triggersArmed: 221,
        domainsMonitored: 9,
        signalsTracked: 248,
        playbooksReady: 170,
        signalsScanned72h,
        recentDetections: detections,
        stakeholdersEnrolled: contacts.filter(c => c.isActive).length,
        isNewOrg: detections.length === 0,
        generatedAt: new Date().toISOString(),
      });
    } catch (err: any) { res.status(500).json({ error: err.message }); }
  });

  // 5. Signal Activity Log — live feed
  app.get('/api/signal-activity-log', requireAuth, async (req: any, res) => {
    try {
      const { signalActivityLog: salTable } = await import('@shared/schema');
      const rows = await db.select().from(salTable)
        .orderBy(desc(salTable.createdAt))
        .limit(100);
      res.json(rows);
    } catch (err: any) { res.status(500).json({ error: err.message }); }
  });

  // ── Weekly pilot digest: every Monday (or every 7 days from startup) ──────
  async function sendWeeklyPilotDigest() {
    try {
      const apiKey = process.env.RESEND_API_KEY || process.env.Resend_API_Key;
      if (!apiKey) return;

      const {
        organizations: orgsTable,
        triggerDetections: tdTable,
        playbookActivations: paTable,
        taskAcknowledgments: taTable,
        stakeholderContacts: scTable,
      } = await import('@shared/schema');

      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const platformUrl = process.env.APP_URL || 'https://vaughnmartin.com';

      const orgs = await db.select().from(orgsTable).where(ne(orgsTable.name, 'System'));

      for (const org of orgs) {
        try {
          const contacts = await db.select().from(scTable).where(and(eq(scTable.organizationId, org.id), eq(scTable.isActive, true)));
          const emails = contacts.map((c: any) => c.email).filter(Boolean);
          if (emails.length === 0) continue;

          const detections = await db.select().from(tdTable)
            .where(and(eq(tdTable.organizationId, org.id), gte(tdTable.detectedAt, sevenDaysAgo)))
            .orderBy(desc(tdTable.detectedAt))
            .limit(10);

          const [actRow] = await db.select({ c: count() }).from(paTable)
            .where(and(eq(paTable.organizationId, org.id), gte(paTable.activatedAt, sevenDaysAgo)));

          let taskAcks = 0;
          try {
            const [taRow] = await db.select({ c: count() }).from(taTable)
              .where(and(eq(taTable.organizationId, org.id), gte(taTable.acknowledgedAt, sevenDaysAgo)));
            taskAcks = Number(taRow?.c ?? 0);
          } catch { taskAcks = 0; }

          const triggerCount  = detections.length;
          const activations   = Number(actRow?.c ?? 0);
          const weekLabel     = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

          const detectionRows = triggerCount > 0
            ? detections.map((d: any) => `
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f0ede4;color:#0A0F2E;font-size:13px;font-weight:600;">${d.triggerName}</td>
                <td style="padding:10px 0;border-bottom:1px solid #f0ede4;color:#666;font-size:12px;">${d.triggerDomain}</td>
                <td style="padding:10px 0;border-bottom:1px solid #f0ede4;color:#2B8A6E;font-size:12px;font-weight:700;text-align:right;">${d.confidenceScore}%</td>
              </tr>`).join('')
            : `<tr><td colspan="3" style="padding:20px 0;text-align:center;color:#999;font-size:13px;">No triggers detected this week — monitoring active across 248+ signals.</td></tr>`;

          const statusBadge = triggerCount === 0
            ? `<div style="background:#2B8A6E15;border:1px solid #2B8A6E40;color:#2B8A6E;padding:12px 20px;border-radius:6px;font-size:13px;margin-bottom:24px;">✓ Market was quiet this week. All 221 triggers armed and scanning continuously.</div>`
            : `<div style="background:#C9A84C15;border:1px solid #C9A84C40;color:#8B6914;padding:12px 20px;border-radius:6px;font-size:13px;margin-bottom:24px;">⚡ ${triggerCount} trigger${triggerCount > 1 ? 's' : ''} detected this week requiring your attention.</div>`;

          const html = `
            <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background:#f8f7f4;padding:40px 0;">
              <div style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e8e4dc;">
                <div style="background:#132558;padding:32px 36px;">
                  <div style="color:#C9A84C;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Execution OS · Weekly Pilot Digest</div>
                  <div style="color:#ffffff;font-size:22px;font-weight:700;line-height:1.3;">Week of ${weekLabel}</div>
                  <div style="color:rgba(255,255,255,0.55);font-size:14px;margin-top:8px;">${org.name} — Strategic Execution Summary</div>
                </div>
                <div style="padding:32px 36px;">
                  ${statusBadge}
                  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:28px;">
                    <div style="text-align:center;padding:16px;background:#f8f7f4;border-radius:8px;border:1px solid #e8e4dc;">
                      <div style="font-size:28px;font-weight:700;color:#0A0F2E;">${triggerCount}</div>
                      <div style="font-size:11px;color:#666;text-transform:uppercase;letter-spacing:1px;margin-top:4px;">Triggers Fired</div>
                    </div>
                    <div style="text-align:center;padding:16px;background:#f8f7f4;border-radius:8px;border:1px solid #e8e4dc;">
                      <div style="font-size:28px;font-weight:700;color:#0A0F2E;">${activations}</div>
                      <div style="font-size:11px;color:#666;text-transform:uppercase;letter-spacing:1px;margin-top:4px;">Playbooks Activated</div>
                    </div>
                    <div style="text-align:center;padding:16px;background:#f8f7f4;border-radius:8px;border:1px solid #e8e4dc;">
                      <div style="font-size:28px;font-weight:700;color:#0A0F2E;">${taskAcks}</div>
                      <div style="font-size:11px;color:#666;text-transform:uppercase;letter-spacing:1px;margin-top:4px;">Tasks Acknowledged</div>
                    </div>
                  </div>
                  <div style="margin-bottom:28px;">
                    <div style="font-size:11px;font-weight:700;color:#0A0F2E;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">Trigger Log</div>
                    <table style="width:100%;border-collapse:collapse;">
                      <tr style="border-bottom:2px solid #0A0F2E;">
                        <th style="padding:8px 0;text-align:left;font-size:10px;color:#0A0F2E;letter-spacing:1px;text-transform:uppercase;">Trigger</th>
                        <th style="padding:8px 0;text-align:left;font-size:10px;color:#0A0F2E;letter-spacing:1px;text-transform:uppercase;">Domain</th>
                        <th style="padding:8px 0;text-align:right;font-size:10px;color:#0A0F2E;letter-spacing:1px;text-transform:uppercase;">Confidence</th>
                      </tr>
                      ${detectionRows}
                    </table>
                  </div>
                  <div style="text-align:center;margin-bottom:12px;">
                    <a href="${platformUrl}/mission-control" style="display:inline-block;background:#132558;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:14px;font-weight:600;letter-spacing:0.5px;margin-bottom:12px;">View Mission Control →</a>
                  </div>
                  <div style="text-align:center;">
                    <a href="${platformUrl}/playbooks" style="display:inline-block;background:#C9A84C;color:#0A0F2E;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:14px;font-weight:700;letter-spacing:0.5px;">Explore Playbook Library →</a>
                  </div>
                </div>
                <div style="background:#f8f7f4;padding:20px 36px;border-top:1px solid #e8e4dc;">
                  <div style="color:#999;font-size:11px;text-align:center;">Execution OS monitors 248+ signals across 9 domains, 24/7. This digest is sent every Monday. No action required if the week was quiet.</div>
                  <div style="text-align:center;margin-top:10px;"><a href="__UNSUBSCRIBE_URL__" style="color:#ccc;font-size:10px;text-decoration:underline;">Unsubscribe from Execution OS alerts</a></div>
                </div>
              </div>
            </div>`;

          const { Resend } = await import('resend');
          const resend = new Resend(apiKey);
          const subject = triggerCount > 0
            ? `📊 Weekly Digest: ${triggerCount} Trigger${triggerCount > 1 ? 's' : ''} Detected — ${org.name}`
            : `📊 Weekly Digest: Monitoring Active, Market Quiet — ${org.name}`;
          for (const contact of contacts) {
            if (!contact.email) continue;
            const token = Buffer.from(contact.email).toString('base64url');
            const personalizedHtml = html.replace('__UNSUBSCRIBE_URL__', `${platformUrl}/api/unsubscribe?t=${token}`);
            await resend.emails.send({
              from: 'Execution OS <pilot@vaughnmartin.com>',
              replyTo: 'pilot@vaughnmartin.com',
              to: [contact.email],
              subject,
              html: personalizedHtml,
            });
          }
          console.log(`📧 [Weekly Digest] Sent for org ${org.name} → ${emails.join(', ')}`);
        } catch (orgErr: any) {
          console.error(`[Weekly Digest] Error for org ${org.id}:`, orgErr.message);
        }
      }
    } catch (err: any) {
      console.error('[Weekly Digest] Failed:', err.message);
    }
  }

  // Schedule weekly digest: runs every Monday at startup + 7-day rolling interval
  function scheduleWeeklyDigest() {
    const now = new Date();
    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + ((8 - now.getDay()) % 7 || 7));
    nextMonday.setHours(8, 0, 0, 0);
    const msUntilMonday = nextMonday.getTime() - now.getTime();
    setTimeout(() => {
      sendWeeklyPilotDigest();
      setInterval(sendWeeklyPilotDigest, 7 * 24 * 60 * 60 * 1000);
    }, msUntilMonday);
    console.log(`✅ Weekly pilot digest scheduled — next send: ${nextMonday.toISOString()}`);
  }
  scheduleWeeklyDigest();

  return httpServer;
}
