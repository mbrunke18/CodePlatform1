import type { Express } from 'express';
import { liveActivationService } from '../services/LiveActivationService';
import { wsService } from '../services/WebSocketService';
import { liveIntegrationDispatcher } from '../services/LiveIntegrationDispatcher';
import { notifyTeamsPlaybookActivation } from '../services/TeamsNotificationService';
import { notifyPlaybookActivation } from '../services/SlackNotificationService';
import { db } from '../db.js';
import { stakeholderContacts } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { Resend } from 'resend';

export function registerActivationRoutes(app: Express): void {

  app.get('/api/activation/integrations-status', async (req, res) => {
    try {
      const organizationId = req.query.organizationId as string;
      if (!organizationId) {
        return res.json({ jira: { connected: false }, slack: { connected: false } });
      }
      const status = await liveIntegrationDispatcher.getIntegrationStatus(organizationId);
      res.json(status);
    } catch (error) {
      res.json({ jira: { connected: false }, slack: { connected: false } });
    }
  });

  app.post('/api/activation/dispatch-live', async (req, res) => {
    try {
      const { organizationId, playbookName, tasks, stakeholders } = req.body;
      if (!organizationId || !playbookName) {
        return res.status(400).json({ success: false, message: 'organizationId and playbookName required' });
      }

      const result = await liveIntegrationDispatcher.dispatchActivation(
        organizationId,
        playbookName,
        tasks || [],
        stakeholders || []
      );

      res.json({ success: true, ...result });
    } catch (error) {
      console.error('Live dispatch error:', error);
      res.status(500).json({ success: false, message: 'Dispatch failed' });
    }
  });
  // GET /api/activation/playbooks - List available demo playbooks
  app.get('/api/activation/playbooks', async (req, res) => {
    try {
      const playbooks = liveActivationService.getAvailablePlaybooks();
      res.json({ success: true, playbooks });
    } catch (error) {
      console.error('Error fetching available playbooks:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch available playbooks' 
      });
    }
  });

  // POST /api/activation/activate - Activate a playbook
  app.post('/api/activation/activate', async (req, res) => {
    try {
      const { playbookKey } = req.body;

      if (!playbookKey || typeof playbookKey !== 'string') {
        return res.status(400).json({ 
          success: false, 
          message: 'playbookKey is required and must be a string' 
        });
      }

      // Activate the playbook
      const activationState = await liveActivationService.activatePlaybook(playbookKey);
      const activationId = activationState.id;

      // Set up the callback to emit events to the activation-specific room
      const emitCallback = (event: string, data: any) => {
        const io = wsService.getIO();
        if (io) {
          io.to(`activation-${activationId}`).emit(event, data);
        } else {
          console.log(`[${activationId}] ${event}:`, data);
        }
      };

      // Start the simulation (non-blocking)
      liveActivationService.startSimulation(activationId, emitCallback);

      // Fire all notifications non-blocking
      const appUrl = process.env.APP_URL || 'https://vaughnmartin.com';
      const playbookName = activationState.playbookName || playbookKey;
      const stakeholderCount = (activationState as any).metrics?.totalStakeholders || (activationState as any).stakeholders?.length || 12;
      const deadline = new Date(Date.now() + 12 * 60 * 1000); // 12-minute execution window

      notifyTeamsPlaybookActivation({
        playbookName,
        organizationName: 'Readiness OS',
        triggeredBy: 'Readiness OS Platform',
        appUrl,
      }).catch((err) => { console.error('[Activation] Teams notification failed (non-blocking):', err); });

      notifyPlaybookActivation(playbookName, stakeholderCount, deadline).catch((err) => { console.error('[Activation] Stakeholder email notification failed (non-blocking):', err); });

      // Notify all active stakeholder contacts via their preferred channel
      (async () => {
        try {
          const orgId = (req as any).orgId || 'system';
          const contacts = await db
            .select()
            .from(stakeholderContacts)
            .where(eq(stakeholderContacts.organizationId, orgId as any));
          const active = contacts.filter((c: any) => c.isActive);
          if (active.length === 0) return;

          const apiKey = process.env.RESEND_API_KEY || process.env.Resend_API_Key;
          const resend = apiKey ? new Resend(apiKey) : null;

          const emailHtml = `
            <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background:#f8f7f4;padding:40px 0;">
              <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:2px;overflow:hidden;border:1px solid #e8e4dc;">
                <div style="background:#0A0F2E;padding:32px 36px;border-bottom:3px solid #C9A84C;">
                  <div style="color:#C9A84C;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:6px;">Readiness OS · Protocol Activated</div>
                  <div style="color:#ffffff;font-size:20px;font-weight:700;line-height:1.3;">${playbookName}</div>
                  <div style="display:inline-block;margin-top:10px;background:#C9A84C;color:#0A0F2E;font-size:10px;font-weight:800;letter-spacing:2px;padding:4px 10px;border-radius:2px;">ACTIVE</div>
                </div>
                <div style="padding:32px 36px;">
                  <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
                    <tr>
                      <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#666;font-size:12px;width:40%;text-transform:uppercase;letter-spacing:0.5px;">Protocol</td>
                      <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#0A0F2E;font-size:13px;font-weight:600;">${playbookName}</td>
                    </tr>
                    <tr>
                      <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Execution Window</td>
                      <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#2B8A6E;font-size:13px;font-weight:700;">12 minutes</td>
                    </tr>
                    <tr>
                      <td style="padding:10px 0;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Status</td>
                      <td style="padding:10px 0;color:#C9A84C;font-size:13px;font-weight:700;">Pre-staged response underway</td>
                    </tr>
                  </table>
                  <div style="background:#f0ede4;border-left:3px solid #C9A84C;padding:16px 20px;margin-bottom:28px;">
                    <div style="color:#0A0F2E;font-size:14px;line-height:1.5;">Your pre-staged Readiness Protocol is now executing. Tasks are assigned. The 12-minute execution clock is running.</div>
                  </div>
                  <div style="text-align:center;">
                    <a href="${appUrl}/command-center" style="display:inline-block;background:#0A0F2E;color:#ffffff;text-decoration:none;padding:14px 36px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">View Live Execution →</a>
                  </div>
                </div>
                <div style="background:#f8f7f4;padding:18px 36px;border-top:1px solid #e8e4dc;text-align:center;">
                  <div style="color:#999;font-size:11px;">Generated automatically by Readiness OS. AI monitors. Executives authorize.</div>
                </div>
              </div>
            </div>
          `;

          // Collect email recipients (email-preferred, voice-preferred with email, and push fallback)
          const emailContacts = active.filter((c: any) =>
            c.email && (!c.preferredChannel || c.preferredChannel === 'email' || c.preferredChannel === 'voice' || (c.preferredChannel === 'push'))
          );

          // Send batch email for all email-routed contacts
          if (resend && emailContacts.length > 0) {
            const emails = emailContacts.map((c: any) => c.email!).filter(Boolean);
            await resend.emails.send({
              from: 'Readiness OS <pilot@vaughnmartin.com>',
              replyTo: 'pilot@vaughnmartin.com',
              to: emails,
              subject: `Readiness Protocol Activated: ${playbookName} — 12-Minute Execution Clock`,
              html: emailHtml,
            });
            console.log(`📧 Activation email sent to ${emails.length} stakeholder(s)`);
          }

          // SMS via Twilio for SMS-preferred contacts with a phone number
          const smsContacts = active.filter((c: any) => c.preferredChannel === 'sms' && c.phone);
          if (smsContacts.length > 0) {
            const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;
            if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE_NUMBER) {
              const twilio = (await import('twilio')).default;
              const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
              await Promise.all(
                smsContacts.map(async (c: any) => {
                  try {
                    const body = `Readiness OS: ${playbookName} activated. Your role: ${c.role} — 12-minute execution window. View: ${appUrl}/command-center`;
                    await twilioClient.messages.create({ from: TWILIO_PHONE_NUMBER, to: c.phone, body });
                    console.log(`📱 SMS sent to ${c.name || c.role} (${c.phone})`);
                  } catch (smsErr) {
                    console.error(`❌ SMS failed for ${c.name || c.role}, falling back to email`);
                    if (resend && c.email) {
                      await resend.emails.send({
                        from: 'Readiness OS <pilot@vaughnmartin.com>',
                        replyTo: 'pilot@vaughnmartin.com',
                        to: [c.email],
                        subject: `Readiness Protocol Activated: ${playbookName} — 12-Minute Execution Clock`,
                        html: emailHtml,
                      }).catch(() => {});
                    }
                  }
                })
              );
            } else {
              // Twilio not configured — fall back to email for SMS-preferred contacts
              if (resend) {
                const fallbackEmails = smsContacts.filter((c: any) => c.email).map((c: any) => c.email!);
                if (fallbackEmails.length > 0) {
                  await resend.emails.send({
                    from: 'Readiness OS <pilot@vaughnmartin.com>',
                    replyTo: 'pilot@vaughnmartin.com',
                    to: fallbackEmails,
                    subject: `Readiness Protocol Activated: ${playbookName} — 12-Minute Execution Clock`,
                    html: emailHtml,
                  }).catch(() => {});
                  console.log(`📧 SMS fallback email sent to ${fallbackEmails.length} stakeholder(s) (Twilio not configured)`);
                }
              }
            }
          }

          // Push via Socket.IO for push-preferred contacts (already included in email batch above too)
          const pushContacts = active.filter((c: any) => c.preferredChannel === 'push');
          if (pushContacts.length > 0) {
            pushContacts.forEach((c: any) => {
              wsService.sendToUser(String(c.id), 'readiness-alert', {
                type: 'executive-alert',
                severity: 'high',
                title: `${playbookName} Activated`,
                body: 'Your pre-staged Readiness Protocol is executing. 12-minute window is active.',
                role: c.role,
                executionWindow: '12 minutes',
                link: '/command-center',
                timestamp: new Date().toISOString(),
              });
            });
            console.log(`🔔 Push notification emitted to ${pushContacts.length} stakeholder(s)`);
          }

        } catch (err) {
          console.error('Activation notification failed (non-blocking):', err);
        }
      })();

      res.status(201).json({ 
        success: true, 
        activation: activationState 
      });
    } catch (error) {
      console.error('Error activating playbook:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ 
        success: false, 
        message: 'Failed to activate playbook',
        error: errorMessage
      });
    }
  });

  // GET /api/activation/:id - Get current activation state
  app.get('/api/activation/:id', async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ 
          success: false, 
          message: 'Activation ID is required' 
        });
      }

      const activationState = liveActivationService.getActivationState(id);

      if (!activationState) {
        return res.status(404).json({ 
          success: false, 
          message: 'Activation not found' 
        });
      }

      res.json({ 
        success: true, 
        activation: activationState 
      });
    } catch (error) {
      console.error('Error fetching activation state:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch activation state' 
      });
    }
  });

  // POST /api/activation/:id/cancel - Cancel a running activation
  app.post('/api/activation/:id/cancel', async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ 
          success: false, 
          message: 'Activation ID is required' 
        });
      }

      // Cancel the simulation
      liveActivationService.cancelSimulation(id);

      res.json({ 
        success: true, 
        message: `Activation ${id} cancelled` 
      });
    } catch (error) {
      console.error('Error cancelling activation:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to cancel activation' 
      });
    }
  });

}
