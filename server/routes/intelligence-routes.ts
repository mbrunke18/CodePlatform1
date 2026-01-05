/**
 * Intelligence Signals API Routes
 * 
 * Provides REST endpoints for managing the 16 intelligence signal categories,
 * triggers, alerts, and playbook recommendations.
 */

import { Router } from 'express';
import { intelligenceSignalService } from '../services/intelligence-signal-service';
import { z } from 'zod';

const router = Router();

// Schema validation
const createTriggerSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  signalCategoryId: z.string(),
  dataPointIds: z.array(z.string()),
  logic: z.enum(['any', 'all', 'threshold']),
  thresholdCount: z.number().optional(),
  conditions: z.record(z.any()),
  urgency: z.enum(['critical', 'high', 'medium', 'low']),
  playbookIds: z.array(z.string()).optional()
});

const updateTriggerSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  conditions: z.record(z.any()).optional(),
  urgency: z.enum(['critical', 'high', 'medium', 'low']).optional(),
  isActive: z.boolean().optional(),
  playbookIds: z.array(z.string()).optional()
});

const simulateSignalSchema = z.object({
  signalCategoryId: z.string(),
  dataPointId: z.string(),
  value: z.any()
});

const createDataSourceSchema = z.object({
  name: z.string().min(1),
  sourceType: z.string(),
  connectionDetails: z.record(z.any())
});

/**
 * GET /api/intelligence/catalog
 * Get the complete signal catalog (all 16 categories)
 */
router.get('/catalog', async (req, res) => {
  try {
    const catalog = intelligenceSignalService.getSignalCatalog();
    res.json({
      success: true,
      data: catalog,
      meta: intelligenceSignalService.getSignalStatistics()
    });
  } catch (error) {
    console.error('Error fetching signal catalog:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch signal catalog' });
  }
});

/**
 * GET /api/intelligence/templates
 * Get trigger templates for quick setup
 */
router.get('/templates', async (req, res) => {
  try {
    const templates = intelligenceSignalService.getTriggerTemplates();
    res.json({
      success: true,
      data: templates
    });
  } catch (error) {
    console.error('Error fetching trigger templates:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch trigger templates' });
  }
});

/**
 * GET /api/intelligence/dashboard
 * Get aggregated dashboard data
 */
router.get('/dashboard', async (req, res) => {
  try {
    const organizationId = (req as any).user?.organizationId;
    const dashboardData = await intelligenceSignalService.getDashboardData(organizationId);
    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch dashboard data' });
  }
});

/**
 * GET /api/intelligence/statistics
 * Get signal statistics
 */
router.get('/statistics', async (req, res) => {
  try {
    const stats = intelligenceSignalService.getSignalStatistics();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch statistics' });
  }
});

// === TRIGGERS ===

/**
 * GET /api/intelligence/triggers
 * Get all configured triggers
 */
router.get('/triggers', async (req, res) => {
  try {
    const organizationId = (req as any).user?.organizationId;
    const triggers = await intelligenceSignalService.getTriggers(organizationId);
    res.json({
      success: true,
      data: triggers
    });
  } catch (error) {
    console.error('Error fetching triggers:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch triggers' });
  }
});

/**
 * GET /api/intelligence/triggers/:id
 * Get a specific trigger
 */
router.get('/triggers/:id', async (req, res) => {
  try {
    const trigger = await intelligenceSignalService.getTrigger(req.params.id);
    if (!trigger) {
      return res.status(404).json({ success: false, error: 'Trigger not found' });
    }
    res.json({
      success: true,
      data: trigger
    });
  } catch (error) {
    console.error('Error fetching trigger:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch trigger' });
  }
});

/**
 * POST /api/intelligence/triggers
 * Create a new trigger
 */
router.post('/triggers', async (req, res) => {
  try {
    const input = createTriggerSchema.parse(req.body);
    const userId = (req as any).user?.id;
    const organizationId = (req as any).user?.organizationId;

    const trigger = await intelligenceSignalService.createTrigger({
      ...input,
      organizationId,
      createdBy: userId
    });

    res.status(201).json({
      success: true,
      data: trigger
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: error.errors });
    }
    console.error('Error creating trigger:', error);
    res.status(500).json({ success: false, error: 'Failed to create trigger' });
  }
});

/**
 * PATCH /api/intelligence/triggers/:id
 * Update a trigger
 */
router.patch('/triggers/:id', async (req, res) => {
  try {
    const input = updateTriggerSchema.parse(req.body);
    const trigger = await intelligenceSignalService.updateTrigger(req.params.id, input);
    
    if (!trigger) {
      return res.status(404).json({ success: false, error: 'Trigger not found' });
    }

    res.json({
      success: true,
      data: trigger
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: error.errors });
    }
    console.error('Error updating trigger:', error);
    res.status(500).json({ success: false, error: 'Failed to update trigger' });
  }
});

/**
 * DELETE /api/intelligence/triggers/:id
 * Delete a trigger
 */
router.delete('/triggers/:id', async (req, res) => {
  try {
    await intelligenceSignalService.deleteTrigger(req.params.id);
    res.json({
      success: true,
      message: 'Trigger deleted'
    });
  } catch (error) {
    console.error('Error deleting trigger:', error);
    res.status(500).json({ success: false, error: 'Failed to delete trigger' });
  }
});

// === ALERTS ===

/**
 * GET /api/intelligence/alerts
 * Get all alerts (strategic alerts + weak signals)
 */
router.get('/alerts', async (req, res) => {
  try {
    const organizationId = (req as any).user?.organizationId;
    const limit = parseInt(req.query.limit as string) || 50;
    const alerts = await intelligenceSignalService.getAlerts(organizationId, limit);
    res.json({
      success: true,
      data: alerts
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch alerts' });
  }
});

/**
 * POST /api/intelligence/alerts/:id/acknowledge
 * Acknowledge an alert
 */
router.post('/alerts/:id/acknowledge', async (req, res) => {
  try {
    const userId = (req as any).user?.id || 'demo-user';
    const alert = await intelligenceSignalService.acknowledgeAlert(req.params.id, userId);
    
    if (!alert) {
      return res.status(404).json({ success: false, error: 'Alert not found' });
    }

    res.json({
      success: true,
      data: alert
    });
  } catch (error) {
    console.error('Error acknowledging alert:', error);
    res.status(500).json({ success: false, error: 'Failed to acknowledge alert' });
  }
});

/**
 * POST /api/intelligence/alerts/:id/dismiss
 * Dismiss an alert
 */
router.post('/alerts/:id/dismiss', async (req, res) => {
  try {
    const userId = (req as any).user?.id || 'demo-user';
    const alert = await intelligenceSignalService.dismissAlert(req.params.id, userId);
    
    if (!alert) {
      return res.status(404).json({ success: false, error: 'Alert not found' });
    }

    res.json({
      success: true,
      data: alert
    });
  } catch (error) {
    console.error('Error dismissing alert:', error);
    res.status(500).json({ success: false, error: 'Failed to dismiss alert' });
  }
});

// === DATA SOURCES ===

/**
 * GET /api/intelligence/data-sources
 * Get configured data sources
 */
router.get('/data-sources', async (req, res) => {
  try {
    const organizationId = (req as any).user?.organizationId;
    const sources = await intelligenceSignalService.getDataSources(organizationId);
    res.json({
      success: true,
      data: sources
    });
  } catch (error) {
    console.error('Error fetching data sources:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch data sources' });
  }
});

/**
 * POST /api/intelligence/data-sources
 * Create a new data source
 */
router.post('/data-sources', async (req, res) => {
  try {
    const input = createDataSourceSchema.parse(req.body);
    const organizationId = (req as any).user?.organizationId;

    const source = await intelligenceSignalService.createDataSource({
      ...input,
      organizationId
    });

    res.status(201).json({
      success: true,
      data: source
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: error.errors });
    }
    console.error('Error creating data source:', error);
    res.status(500).json({ success: false, error: 'Failed to create data source' });
  }
});

// === PLAYBOOK RECOMMENDATIONS ===

/**
 * GET /api/intelligence/recommendations/:categoryId
 * Get playbook recommendations for a signal category
 */
router.get('/recommendations/:categoryId', async (req, res) => {
  try {
    const playbooks = await intelligenceSignalService.getPlaybookRecommendations(req.params.categoryId);
    res.json({
      success: true,
      data: playbooks
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch recommendations' });
  }
});

// === SIMULATION (Demo/Testing) ===

/**
 * POST /api/intelligence/simulate
 * Simulate a signal detection (for demo purposes)
 */
router.post('/simulate', async (req, res) => {
  try {
    const input = simulateSignalSchema.parse(req.body);
    const organizationId = (req as any).user?.organizationId;

    const alert = await intelligenceSignalService.simulateSignalDetection(
      input.signalCategoryId,
      input.dataPointId,
      input.value,
      organizationId
    );

    if (!alert) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid signal category or data point' 
      });
    }

    res.status(201).json({
      success: true,
      data: alert,
      message: 'Signal detected and alert created'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: error.errors });
    }
    console.error('Error simulating signal:', error);
    res.status(500).json({ success: false, error: 'Failed to simulate signal' });
  }
});

export default router;
