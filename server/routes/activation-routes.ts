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
      }).catch(() => {});

      notifyPlaybookActivation(playbookName, stakeholderCount, deadline).catch(() => {});

      // Send activation email to all stakeholder contacts for the org
      (async () => {
        try {
          const orgId = (req as any).orgId || 'system';
          const contacts = await db
            .select()
            .from(stakeholderContacts)
            .where(eq(stakeholderContacts.organizationId, orgId as any));
          const emails = contacts.filter((c: any) => c.isActive && c.email).map((c: any) => c.email!).filter(Boolean);
          if (emails.length === 0) return;

          const apiKey = process.env.RESEND_API_KEY || process.env.Resend_API_Key;
          if (!apiKey) return;
          const resend = new Resend(apiKey);

          const html = `
            <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background:#f8f7f4;padding:40px 0;">
              <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e8e4dc;">
                <div style="background:#132558;padding:32px 36px;">
                  <div style="color:#C9A84C;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Readiness OS · Playbook Activated</div>
                  <div style="color:#ffffff;font-size:22px;font-weight:700;line-height:1.3;">Strategic Response Initiated</div>
                </div>
                <div style="padding:32px 36px;">
                  <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
                    <tr>
                      <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#666;font-size:13px;width:40%;">Playbook Activated</td>
                      <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#0A0F2E;font-size:13px;font-weight:600;">${playbookName}</td>
                    </tr>
                    <tr>
                      <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#666;font-size:13px;">Stakeholders Coordinated</td>
                      <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#0A0F2E;font-size:13px;font-weight:600;">${stakeholderCount}</td>
                    </tr>
                    <tr>
                      <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#666;font-size:13px;">Execution Window</td>
                      <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#2B8A6E;font-size:13px;font-weight:700;">12 minutes</td>
                    </tr>
                    <tr>
                      <td style="padding:10px 0;color:#666;font-size:13px;">Status</td>
                      <td style="padding:10px 0;color:#C9A84C;font-size:13px;font-weight:700;">ACTIVE — Pre-staged response underway</td>
                    </tr>
                  </table>
                  <div style="background:#f0ede4;border-left:3px solid #C9A84C;padding:16px 20px;border-radius:4px;margin-bottom:28px;">
                    <div style="color:#0A0F2E;font-size:14px;line-height:1.5;">Your pre-staged playbook is now executing. Tasks are being assigned automatically. The 12-minute execution clock is running.</div>
                  </div>
                  <div style="text-align:center;">
                    <a href="${appUrl}/command-center" style="display:inline-block;background:#132558;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:14px;font-weight:600;letter-spacing:0.5px;">View Live Execution →</a>
                  </div>
                </div>
                <div style="background:#f8f7f4;padding:20px 36px;border-top:1px solid #e8e4dc;">
                  <div style="color:#999;font-size:11px;text-align:center;">This notification was generated automatically by Readiness OS when a playbook was activated. No human reviewed it before it reached you.</div>
                </div>
              </div>
            </div>
          `;

          await resend.emails.send({
            from: 'Readiness OS <pilot@vaughnmartin.com>',
            replyTo: 'pilot@vaughnmartin.com',
            to: emails,
            subject: `🚀 Playbook Activated: ${playbookName} — 12-Minute Execution Clock Running`,
            html,
          });
          console.log(`📧 Activation email sent to ${emails.length} stakeholder(s)`);
        } catch (err) {
          console.error('Activation notification email failed (non-blocking):', err);
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
