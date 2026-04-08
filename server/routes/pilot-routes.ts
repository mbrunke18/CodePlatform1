import { Router } from 'express';
import sgMail from '@sendgrid/mail';
import { z } from 'zod';
import { db } from '../db';
import { pilotApplications } from '../../shared/schema';
import { Resend } from 'resend';
import { enrollProspectForAlerts } from '../services/prospectEnrollment.js';

const router = Router();

// SendGrid integration via Replit Connectors
async function getSendGridClient() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken || !hostname) {
    console.log('[SendGrid] Missing connector credentials (hostname or token)');
    return null;
  }

  try {
    const response = await fetch(
      'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=sendgrid',
      {
        headers: {
          'Accept': 'application/json',
          'X_REPLIT_TOKEN': xReplitToken
        }
      }
    );
    const data = await response.json();
    const connectionSettings = data.items?.[0];

    if (!connectionSettings || !connectionSettings.settings?.api_key || !connectionSettings.settings?.from_email) {
      console.log('[SendGrid] Connection settings not found or incomplete');
      return null;
    }
    
    console.log('[SendGrid] Credentials retrieved, from email:', connectionSettings.settings.from_email);
    sgMail.setApiKey(connectionSettings.settings.api_key);
    return {
      client: sgMail,
      fromEmail: connectionSettings.settings.from_email
    };
  } catch (error) {
    console.error('[SendGrid] Failed to get client:', error);
    return null;
  }
}

const TRIGGER_SCENARIOS: Record<string, { name: string; signal: string; type: string }> = {
  competitor_launch: {
    name: "Competitor Product Launch",
    signal: "TechCorp announces AI-powered enterprise solution competing directly with your flagship product",
    type: "Competitive Threat"
  },
  regulatory_change: {
    name: "Regulatory Change",
    signal: "SEC announces new AI disclosure requirements for financial services effective Q2 2026",
    type: "Regulatory Alert"
  },
  market_opportunity: {
    name: "Market Expansion Opportunity",
    signal: "European Union announces $2B digital transformation fund for enterprise software adoption",
    type: "Strategic Opportunity"
  },
  crisis_event: {
    name: "Crisis Response",
    signal: "Unusual network activity detected - potential data exfiltration attempt from internal systems",
    type: "Security Incident"
  }
};

const PLAYBOOK_OPTIONS: Record<string, { name: string; tasks: number; stakeholders: number }> = {
  competitive_response: {
    name: "Competitive Response Playbook",
    tasks: 12,
    stakeholders: 6
  },
  regulatory_compliance: {
    name: "Regulatory Compliance Playbook",
    tasks: 18,
    stakeholders: 8
  },
  market_expansion: {
    name: "Market Expansion Playbook",
    tasks: 15,
    stakeholders: 7
  },
  crisis_management: {
    name: "Crisis Management Playbook",
    tasks: 20,
    stakeholders: 10
  }
};

const pilotExecuteSchema = z.object({
  email: z.string().email(),
  triggerId: z.string(),
  playbookId: z.string()
});

function generateEmailHTML(trigger: typeof TRIGGER_SCENARIOS[string], playbook: typeof PLAYBOOK_OPTIONS[string], executionId: string): string {
  const timestamp = new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VaughnMartin Readiness OS - Playbook Activated</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 32px 40px; border-radius: 16px 16px 0 0;">
              <table role="presentation" style="width: 100%;">
                <tr>
                  <td>
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">VaughnMartin</h1>
                    <p style="margin: 8px 0 0; color: #94a3b8; font-size: 14px;">Strategic Readiness Platform</p>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; background-color: #ef4444; color: white; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase;">
                      URGENT
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Alert Banner -->
          <tr>
            <td style="background-color: #fef3c7; padding: 16px 40px; border-left: 4px solid #f59e0b;">
              <table role="presentation" style="width: 100%;">
                <tr>
                  <td>
                    <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 600;">
                      ⚡ PLAYBOOK ACTIVATED
                    </p>
                    <p style="margin: 4px 0 0; color: #a16207; font-size: 13px;">
                      ${timestamp}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="background-color: #ffffff; padding: 40px;">
              
              <!-- Trigger Info -->
              <table role="presentation" style="width: 100%; margin-bottom: 24px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 8px; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
                      TRIGGER DETECTED
                    </p>
                    <h2 style="margin: 0 0 12px; color: #1e293b; font-size: 20px; font-weight: 600;">
                      ${trigger.name}
                    </h2>
                    <div style="background-color: #f1f5f9; padding: 16px; border-radius: 8px; border-left: 3px solid #3b82f6;">
                      <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.6;">
                        "${trigger.signal}"
                      </p>
                    </div>
                  </td>
                </tr>
              </table>
              
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
              
              <!-- Playbook Info -->
              <table role="presentation" style="width: 100%; margin-bottom: 24px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 8px; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
                      PLAYBOOK EXECUTING
                    </p>
                    <h3 style="margin: 0 0 16px; color: #1e293b; font-size: 18px; font-weight: 600;">
                      ${playbook.name}
                    </h3>
                  </td>
                </tr>
              </table>
              
              <!-- Metrics Row -->
              <table role="presentation" style="width: 100%; margin-bottom: 24px;">
                <tr>
                  <td style="width: 33%; text-align: center; padding: 16px; background-color: #f0fdf4; border-radius: 8px;">
                    <p style="margin: 0; color: #166534; font-size: 24px; font-weight: 700;">${playbook.tasks}</p>
                    <p style="margin: 4px 0 0; color: #15803d; font-size: 12px;">Tasks Created</p>
                  </td>
                  <td style="width: 8px;"></td>
                  <td style="width: 33%; text-align: center; padding: 16px; background-color: #eff6ff; border-radius: 8px;">
                    <p style="margin: 0; color: #1e40af; font-size: 24px; font-weight: 700;">${playbook.stakeholders}</p>
                    <p style="margin: 4px 0 0; color: #1d4ed8; font-size: 12px;">Stakeholders Notified</p>
                  </td>
                  <td style="width: 8px;"></td>
                  <td style="width: 33%; text-align: center; padding: 16px; background-color: #fdf4ff; border-radius: 8px;">
                    <p style="margin: 0; color: #7e22ce; font-size: 24px; font-weight: 700;">12</p>
                    <p style="margin: 4px 0 0; color: #9333ea; font-size: 12px;">Min Activation</p>
                  </td>
                </tr>
              </table>
              
              <!-- Your Role -->
              <table role="presentation" style="width: 100%; margin-bottom: 24px;">
                <tr>
                  <td style="background-color: #faf5ff; padding: 20px; border-radius: 8px; border: 1px solid #e9d5ff;">
                    <p style="margin: 0 0 8px; color: #6b21a8; font-size: 14px; font-weight: 600;">
                      Your Assigned Actions:
                    </p>
                    <ul style="margin: 0; padding-left: 20px; color: #581c87;">
                      <li style="margin-bottom: 8px;">Review initial assessment and threat classification</li>
                      <li style="margin-bottom: 8px;">Approve cross-functional team activation</li>
                      <li style="margin-bottom: 8px;">Join Command Center for real-time coordination</li>
                    </ul>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table role="presentation" style="width: 100%;">
                <tr>
                  <td align="center">
                    <a href="#" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: 600;">
                      Open Command Center →
                    </a>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 24px 40px; border-radius: 0 0 16px 16px;">
              <table role="presentation" style="width: 100%;">
                <tr>
                  <td>
                    <p style="margin: 0 0 8px; color: #64748b; font-size: 13px;">
                      Execution ID: <code style="background-color: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${executionId}</code>
                    </p>
                    <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                      This is a pilot demo notification from M - Strategic Execution Operating System.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

const pilotApplicationSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  company: z.string().min(1),
  title: z.string().min(1),
  companySize: z.string().min(1),
  primaryChallenge: z.string().min(10),
  scenariosOfInterest: z.string().min(5),
});

router.post('/apply', async (req, res) => {
  try {
    const validation = pilotApplicationSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid form data', details: validation.error.errors });
    }

    const data = validation.data;

    // Save to database
    const [application] = await db.insert(pilotApplications).values({
      ...data,
      status: 'pending',
    }).returning();

    // Enroll immediately — next trigger alert will reach this prospect
    enrollProspectForAlerts({
      email: data.email,
      name: `${data.firstName} ${data.lastName}`.trim(),
      role: data.title,
      company: data.company,
    }).catch(err => console.warn('[PilotApply] Prospect enrollment non-fatal error:', err?.message));

    // Send notification email to VaughnMartin team
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from: 'Readiness OS <onboarding@resend.dev>',
          replyTo: 'pilot@vaughnmartin.com',
          to: 'pilot@vaughnmartin.com',
          subject: `New Pilot Application — ${data.company} (${data.firstName} ${data.lastName})`,
          html: `
            <h2>New Pilot Program Application</h2>
            <table style="border-collapse:collapse;width:100%">
              <tr><td style="padding:8px;border:1px solid #e2e8f0"><strong>Name</strong></td><td style="padding:8px;border:1px solid #e2e8f0">${data.firstName} ${data.lastName}</td></tr>
              <tr><td style="padding:8px;border:1px solid #e2e8f0"><strong>Email</strong></td><td style="padding:8px;border:1px solid #e2e8f0">${data.email}</td></tr>
              <tr><td style="padding:8px;border:1px solid #e2e8f0"><strong>Company</strong></td><td style="padding:8px;border:1px solid #e2e8f0">${data.company}</td></tr>
              <tr><td style="padding:8px;border:1px solid #e2e8f0"><strong>Title</strong></td><td style="padding:8px;border:1px solid #e2e8f0">${data.title}</td></tr>
              <tr><td style="padding:8px;border:1px solid #e2e8f0"><strong>Company Size</strong></td><td style="padding:8px;border:1px solid #e2e8f0">${data.companySize}</td></tr>
              <tr><td style="padding:8px;border:1px solid #e2e8f0"><strong>Primary Challenge</strong></td><td style="padding:8px;border:1px solid #e2e8f0">${data.primaryChallenge}</td></tr>
              <tr><td style="padding:8px;border:1px solid #e2e8f0"><strong>Scenarios of Interest</strong></td><td style="padding:8px;border:1px solid #e2e8f0">${data.scenariosOfInterest}</td></tr>
            </table>
            <p style="margin-top:16px;color:#64748b">Application ID: ${application.id}<br>Received: ${new Date().toLocaleString()}</p>
          `,
        });
        console.log(`✓ Pilot application notification sent for ${data.company}`);
      } catch (emailErr) {
        console.error('Failed to send pilot application notification email:', emailErr);
      }
    } else {
      console.log('[PILOT APPLICATION] RESEND_API_KEY not set — email notification skipped');
      console.log(`New pilot application from: ${data.firstName} ${data.lastName} <${data.email}> at ${data.company}`);
    }

    res.json({ success: true, applicationId: application.id });
  } catch (err: any) {
    console.error('Pilot application error:', err);
    res.status(500).json({ error: 'Failed to save application' });
  }
});

router.post('/execute', async (req, res) => {
  try {
    const validation = pilotExecuteSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid request data',
        details: validation.error.errors 
      });
    }

    const { email, triggerId, playbookId } = validation.data;
    const trigger = TRIGGER_SCENARIOS[triggerId];
    const playbook = PLAYBOOK_OPTIONS[playbookId];

    if (!trigger || !playbook) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid trigger or playbook selection' 
      });
    }

    const executionId = `PILOT-${Date.now().toString(36).toUpperCase()}`;

    // Try SendGrid first (Replit integration)
    const sendgrid = await getSendGridClient();
    
    if (sendgrid) {
      try {
        await sendgrid.client.send({
          to: email,
          from: sendgrid.fromEmail,
          subject: `⚡ PLAYBOOK ACTIVATED: ${trigger.name}`,
          html: generateEmailHTML(trigger, playbook, executionId),
        });
        console.log(`✓ Pilot email sent via SendGrid to ${email}`);
      } catch (emailError: any) {
        console.error('SendGrid email error:', emailError);
        // Don't fail the whole request if email fails
      }
    } else {
      console.log(`[PILOT DEMO - EMAIL SIMULATED (SendGrid not configured)]`);
      console.log(`To: ${email}`);
      console.log(`Subject: ⚡ PLAYBOOK ACTIVATED: ${trigger.name}`);
      console.log(`Trigger: ${trigger.signal}`);
      console.log(`Playbook: ${playbook.name}`);
      console.log(`Execution ID: ${executionId}`);
    }

    res.json({
      success: true,
      executionId,
      message: 'Pilot execution completed',
      details: {
        email,
        trigger: trigger.name,
        playbook: playbook.name,
        tasksCreated: playbook.tasks,
        stakeholdersNotified: playbook.stakeholders
      }
    });

  } catch (error: any) {
    console.error('Pilot execution error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to execute pilot demo',
      message: error.message 
    });
  }
});

export default router;
