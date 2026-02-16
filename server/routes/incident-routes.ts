import { Router } from 'express';
import { z } from 'zod';
import { openAIService } from '../services/OpenAIService';
import { db } from '../db';
import { incidentAnalyses, readinessAssessments, whatIfRuns } from '@shared/schema';
import { eq } from 'drizzle-orm';
import sgMail from '@sendgrid/mail';

const router = Router();

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

// POST /api/incidents/analyze
router.post('/analyze', async (req, res) => {
  try {
    const schema = z.object({
      description: z.string().min(20, 'Please describe the incident in more detail (at least 20 characters)'),
      companyName: z.string().optional(),
      email: z.string().email().optional(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }

    const { description, companyName, email } = parsed.data;

    const prompt = `You are an enterprise crisis and coordination analysis expert. A Fortune 1000 executive has described an incident their company experienced.

Analyze this incident and return a JSON response with EXACTLY this structure (no markdown, no code fences, just raw JSON):
{
  "incident_type": "Category of incident (e.g., Ransomware Attack, Supply Chain Disruption, M&A Integration, Product Recall, Regulatory Change, Data Breach, Competitive Threat, Market Entry Failure, etc.)",
  "what_went_wrong": ["Array of 4-6 specific failures that occurred", "Be very specific to their description"],
  "estimated_impact": "$X-YM estimated financial impact",
  "time_to_coordination": "Time it actually took to coordinate (extract from their description or estimate)",
  "root_cause": "One-sentence root cause linking to execution/coordination gap",
  "your_reality": [
    {"time": "Hour 0", "description": "What happened first"},
    {"time": "Hour 1-4", "description": "Initial chaos"},
    {"time": "Hour 8-12", "description": "Still figuring out ownership"},
    {"time": "Hour 24+", "description": "Damage spreading"},
    {"time": "Hour 48-72", "description": "Finally getting organized"},
    {"time": "Final", "description": "Resolution with total cost"}
  ],
  "with_executeiq": [
    {"time": "0:00", "description": "Trigger detected, playbook activated automatically"},
    {"time": "0:02", "description": "All stakeholders notified with assigned roles"},
    {"time": "0:05", "description": "Stakeholders acknowledged, tasks assigned"},
    {"time": "0:08", "description": "Coordinated response underway"},
    {"time": "0:11", "description": "Situation contained"},
    {"time": "Final", "description": "Resolution with minimal cost"}
  ],
  "cost_without": "$XM - the actual/estimated cost without ExecuteIQ",
  "cost_with": "$XK - estimated cost with ExecuteIQ (typically 95-98% reduction)"
}

IMPORTANT: Make the analysis deeply specific to what they described. Don't be generic. Reference their actual details.

Incident description: "${description}"`;

    let analysis;
    const aiResponse = await openAIService.analyzeText(prompt);
    
    try {
      const cleaned = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysis = JSON.parse(cleaned);
    } catch {
      // Fallback structured response
      analysis = {
        incident_type: "Coordination Failure",
        what_went_wrong: [
          "No clear incident owner identified in first 24 hours",
          "No pre-built response playbook existed",
          "Ad-hoc communication via emails and calls",
          "No pre-authorized decision thresholds",
          "Stakeholder notification was manual and incomplete",
          "No documented escalation path"
        ],
        estimated_impact: "$8-15M",
        time_to_coordination: "48-72 hours",
        root_cause: "Execution gap — strategy existed but coordination infrastructure didn't",
        your_reality: [
          { time: "Hour 0", description: "Incident detected but unclear who owns the response" },
          { time: "Hour 4", description: "Emails and calls trying to identify the right people" },
          { time: "Hour 12", description: "Still no single owner — parallel efforts creating confusion" },
          { time: "Hour 24", description: "News breaks before internal coordination is complete" },
          { time: "Hour 48-72", description: "Finally assembled team, but damage already done" },
          { time: "Final", description: "Contained after significant financial and reputational impact" }
        ],
        with_executeiq: [
          { time: "0:00", description: "Trigger detected, playbook activated automatically" },
          { time: "0:02", description: "6 key stakeholders notified with assigned roles" },
          { time: "0:05", description: "All stakeholders acknowledged, tasks auto-assigned" },
          { time: "0:08", description: "Coordinated response fully underway" },
          { time: "0:11", description: "Situation contained, communications deployed" },
          { time: "Final", description: "Resolved with minimal impact — $150-250K total cost" }
        ],
        cost_without: "$12M",
        cost_with: "$200K"
      };
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
      playbook = JSON.parse(cleaned);
    } catch {
      playbook = {
        name: `${incidentType} Response Protocol`,
        code: "#INC-001",
        domain: "Crisis",
        category: "DEFENSE",
        triggers: [
          { condition: "Similar incident pattern detected", threshold: "Confidence score > 85%" },
          { condition: "Multiple system alerts within 15 minutes", threshold: "> 3 correlated alerts" },
          { condition: "External report or notification received", threshold: "Any credible source" },
          { condition: "Stakeholder escalation request", threshold: "Director level or above" }
        ],
        stakeholders: [
          { role: "Incident Commander", responsibility: "R", name: "[Assignee]", department: "Operations" },
          { role: "Chief Information Security Officer", responsibility: "A", name: "[Assignee]", department: "Security" },
          { role: "Communications Lead", responsibility: "R", name: "[Assignee]", department: "Corporate Communications" },
          { role: "Legal Counsel", responsibility: "C", name: "[Assignee]", department: "Legal" },
          { role: "Business Unit Lead", responsibility: "I", name: "[Assignee]", department: "Business Operations" },
          { role: "External Relations", responsibility: "C", name: "[Assignee]", department: "Public Relations" }
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
        thresholds: [
          { decision: "Authorize emergency spending", limit: "Up to $500K without board approval", approver: "CFO" },
          { decision: "Issue external communications", limit: "Pre-approved templates only", approver: "Communications Lead" },
          { decision: "Engage third-party specialists", limit: "Up to $200K", approver: "CISO" }
        ],
        estimated_coordination_time: "11 minutes"
      };
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
      email: z.string().email().optional(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }

    const { incidentId, playbook, email } = parsed.data;
    const simulationId = `sim_${Date.now()}`;

    const stakeholders = (playbook.stakeholders || []).map((s: any) => ({
      name: s.name || s.role,
      role: s.role,
      acknowledged: false,
      notifiedAt: null,
      acknowledgedAt: null,
    }));

    const tasks = (playbook.tasks || []).map((t: any) => ({
      name: t.name,
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
        if (unacked.length > 0 && Math.random() > 0.3) {
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
        if (inProgress.length > 0 && Math.random() > 0.4) {
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

// POST /api/readiness/assess
router.post('/assess', async (req, res) => {
  try {
    const schema = z.object({
      companyName: z.string().optional(),
      answers: z.object({
        firstNotified: z.string(),
        phoneNumber: z.string(),
        firstActions: z.string(),
        spendingAuthority: z.string(),
        playbookLocation: z.string(),
      }),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }

    const { companyName, answers } = parsed.data;

    let score = 0;
    const gaps: string[] = [];
    const recommendations: string[] = [];

    // Score each answer
    if (answers.firstNotified && answers.firstNotified.length > 3) {
      score += 20;
    } else {
      gaps.push("No clear incident owner identified");
      recommendations.push("Designate a primary incident commander with 24/7 availability");
    }

    if (answers.phoneNumber && /\d{7,}/.test(answers.phoneNumber.replace(/\D/g, ''))) {
      score += 15;
    } else {
      gaps.push("Contact information not readily available");
      recommendations.push("Maintain an always-current emergency contact directory");
    }

    if (answers.firstActions && answers.firstActions.length > 10) {
      const actionCount = answers.firstActions.split(/[,;.\n]/).filter(a => a.trim().length > 2).length;
      score += Math.min(25, actionCount * 8);
      if (actionCount < 3) {
        gaps.push("Insufficient initial response actions defined");
        recommendations.push("Pre-define at least 5 immediate response actions for each scenario type");
      }
    } else {
      gaps.push("No documented initial response actions");
      recommendations.push("Create step-by-step action checklists for your top 5 risk scenarios");
    }

    if (answers.spendingAuthority && answers.spendingAuthority.length > 3) {
      if (/\$|budget|authority|approve/i.test(answers.spendingAuthority)) {
        score += 20;
      } else {
        score += 10;
        gaps.push("Spending authority not clearly defined with dollar thresholds");
        recommendations.push("Set pre-authorized spending limits: $50K (Director), $250K (VP), $1M (C-Suite)");
      }
    } else {
      gaps.push("No pre-authorized spending thresholds");
      recommendations.push("Establish emergency spending authority without requiring a committee meeting");
    }

    if (answers.playbookLocation === "Don't have one") {
      gaps.push("No documented response playbook exists");
      recommendations.push("Create response playbooks for your top risk scenarios using ExecuteIQ's 166 pre-built templates");
    } else if (answers.playbookLocation) {
      score += 20;
      if (['Confluence', 'SharePoint', 'Google Doc'].includes(answers.playbookLocation)) {
        gaps.push("Playbook stored in static documents — not executable");
        recommendations.push("Move from static documents to executable playbooks with automated triggers and stakeholder coordination");
      }
    }

    score = Math.min(100, Math.max(0, score));
    const benchmark = score < 30 ? "less prepared than 87% of enterprises" 
      : score < 50 ? "less prepared than 73% of enterprises"
      : score < 70 ? "on par with 55% of enterprises"
      : score < 85 ? "better prepared than 62% of enterprises"
      : "in the top 15% of enterprise preparedness";

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
      playbook: z.any(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }

    const { incidentId, scenario, playbook } = parsed.data;

    const prompt = `You are an enterprise execution timing analyst. Given a playbook that coordinates in ~12 minutes, analyze how a proposed modification would impact coordination time.

Return ONLY raw JSON (no markdown):
{
  "original_time": "12 minutes",
  "modified_time": "XX minutes",
  "impact": "+XX min delay (or 'No significant impact' or '-X min improvement')",
  "recommendation": "Recommended / Not recommended / Conditionally recommended — with a one-sentence explanation",
  "risk_assessment": "Brief assessment of risk tradeoffs"
}

Current playbook: ${JSON.stringify(playbook?.name || 'Standard Response Playbook')} with ${playbook?.tasks?.length || 8} tasks and ${playbook?.stakeholders?.length || 6} stakeholders.

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
        risk_assessment: "The proposed change introduces additional coordination overhead without proportional risk mitigation."
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
