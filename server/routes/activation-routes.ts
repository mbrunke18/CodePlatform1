import type { Express } from 'express';
import { liveActivationService } from '../services/LiveActivationService';
import { wsService } from '../services/WebSocketService';
import { liveIntegrationDispatcher } from '../services/LiveIntegrationDispatcher';
import { notifyTeamsPlaybookActivation } from '../services/TeamsNotificationService';

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

      // Fire Teams notification (non-blocking, best-effort)
      const appUrl = process.env.APP_URL || 'https://vaughnmartin.com';
      notifyTeamsPlaybookActivation({
        playbookName: activationState.playbookName || playbookKey,
        organizationName: 'Execution OS',
        triggeredBy: 'Execution OS Platform',
        appUrl,
      }).catch(() => {}); // never block activation on notification failure

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
