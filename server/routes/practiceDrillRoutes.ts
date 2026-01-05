import { Router } from 'express';
import { db } from '../db';
import {
  practiceDrills,
  drillPerformance,
  playbookLibrary,
  playbookDomains,
  type PracticeDrill,
  type InsertPracticeDrill,
  type DrillPerformance,
  type InsertDrillPerformance,
  insertPracticeDrillSchema,
  insertDrillPerformanceSchema,
} from '@shared/schema';
import { eq, desc, and } from 'drizzle-orm';
import { z } from 'zod';

export const practiceDrillRouter = Router();

/**
 * GET /api/practice-drills/:organizationId
 * Get all practice drills for an organization
 */
practiceDrillRouter.get('/:organizationId', async (req, res) => {
  try {
    const { organizationId } = req.params;
    const { status } = req.query;

    let conditions = [eq(practiceDrills.organizationId, organizationId)];
    
    if (status) {
      conditions.push(eq(practiceDrills.status, status as string));
    }

    const drills = await db
      .select({
        drill: practiceDrills,
        playbook: playbookLibrary,
        domain: playbookDomains,
      })
      .from(practiceDrills)
      .leftJoin(playbookLibrary, eq(practiceDrills.playbookId, playbookLibrary.id))
      .leftJoin(playbookDomains, eq(playbookLibrary.domainId, playbookDomains.id))
      .where(and(...conditions))
      .orderBy(desc(practiceDrills.scheduledDate));

    res.json(drills);
  } catch (error) {
    console.error('Error fetching practice drills:', error);
    res.status(500).json({ error: 'Failed to fetch practice drills' });
  }
});

/**
 * GET /api/practice-drills/drill/:drillId
 * Get a specific drill with its performance data
 */
practiceDrillRouter.get('/drill/:drillId', async (req, res) => {
  try {
    const { drillId } = req.params;

    const [drill] = await db
      .select({
        drill: practiceDrills,
        playbook: playbookLibrary,
        domain: playbookDomains,
      })
      .from(practiceDrills)
      .leftJoin(playbookLibrary, eq(practiceDrills.playbookId, playbookLibrary.id))
      .leftJoin(playbookDomains, eq(playbookLibrary.domainId, playbookDomains.id))
      .where(eq(practiceDrills.id, drillId));

    if (!drill) {
      return res.status(404).json({ error: 'Practice drill not found' });
    }

    // Get performance data if exists
    const [performance] = await db
      .select()
      .from(drillPerformance)
      .where(eq(drillPerformance.drillId, drillId));

    res.json({
      ...drill,
      performance,
    });
  } catch (error) {
    console.error('Error fetching drill details:', error);
    res.status(500).json({ error: 'Failed to fetch drill details' });
  }
});

/**
 * POST /api/practice-drills
 * Schedule a new practice drill
 */
practiceDrillRouter.post('/', async (req, res) => {
  try {
    // Preprocess: Convert ISO string dates to Date objects for Drizzle validation
    const requestData = {
      ...req.body,
      scheduledDate: req.body.scheduledDate ? new Date(req.body.scheduledDate) : undefined,
    };
    
    const validatedData = insertPracticeDrillSchema.parse(requestData);

    const [drill] = await db
      .insert(practiceDrills)
      .values(validatedData as InsertPracticeDrill)
      .returning();

    res.json(drill);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Error creating practice drill:', error);
    res.status(500).json({ error: 'Failed to create practice drill' });
  }
});

/**
 * PATCH /api/practice-drills/:drillId
 * Update a practice drill (status, times, participants, etc.)
 */
practiceDrillRouter.patch('/:drillId', async (req, res) => {
  try {
    const { drillId } = req.params;
    const updates = req.body;

    const [updated] = await db
      .update(practiceDrills)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(practiceDrills.id, drillId))
      .returning();

    res.json(updated);
  } catch (error) {
    console.error('Error updating practice drill:', error);
    res.status(500).json({ error: 'Failed to update practice drill' });
  }
});

/**
 * POST /api/practice-drills/:drillId/start
 * Start a practice drill
 */
practiceDrillRouter.post('/:drillId/start', async (req, res) => {
  try {
    const { drillId } = req.params;

    const [drill] = await db
      .update(practiceDrills)
      .set({
        status: 'in_progress',
        startedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(practiceDrills.id, drillId))
      .returning();

    res.json(drill);
  } catch (error) {
    console.error('Error starting drill:', error);
    res.status(500).json({ error: 'Failed to start drill' });
  }
});

/**
 * POST /api/practice-drills/:drillId/complete
 * Complete a practice drill and record performance
 */
practiceDrillRouter.post('/:drillId/complete', async (req, res) => {
  try {
    const { drillId } = req.params;
    const performanceData = req.body;

    console.log('[COMPLETE DRILL] Received performanceData:', JSON.stringify(performanceData, null, 2));

    // Update drill status
    const [drill] = await db
      .update(practiceDrills)
      .set({
        status: 'completed',
        completedAt: new Date(),
        actualDuration: performanceData.actualExecutionTime || 0,
        actualParticipants: performanceData.actualParticipants || [],
        updatedAt: new Date(),
      })
      .where(eq(practiceDrills.id, drillId))
      .returning();

    // Get drill details for organizationId and playbookId
    const [drillDetails] = await db
      .select()
      .from(practiceDrills)
      .where(eq(practiceDrills.id, drillId));

    console.log('[COMPLETE DRILL] Drill details:', { organizationId: drillDetails.organizationId, playbookId: drillDetails.playbookId });

    // Record performance data with default target execution time
    const performancePayload = {
      drillId,
      organizationId: drillDetails.organizationId,
      playbookId: drillDetails.playbookId,
      targetExecutionTime: 12, // M standard: 12-minute coordinated response
      ...performanceData,
    };

    console.log('[COMPLETE DRILL] Performance payload before validation:', JSON.stringify(performancePayload, null, 2));

    const validatedPerformance = insertDrillPerformanceSchema.parse(performancePayload);

    const [performance] = await db
      .insert(drillPerformance)
      .values(validatedPerformance as InsertDrillPerformance)
      .returning();

    console.log('[COMPLETE DRILL] Success! Performance recorded:', performance.id);

    res.json({
      drill,
      performance,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[COMPLETE DRILL] Validation error:', JSON.stringify(error.errors, null, 2));
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('[COMPLETE DRILL] Error completing drill:', error);
    res.status(500).json({ error: 'Failed to complete drill' });
  }
});

/**
 * GET /api/practice-drills/performance/:organizationId
 * Get performance analytics for all drills in an organization
 */
practiceDrillRouter.get('/performance/:organizationId', async (req, res) => {
  try {
    const { organizationId } = req.params;

    const performances = await db
      .select({
        performance: drillPerformance,
        playbook: playbookLibrary,
        domain: playbookDomains,
        drill: practiceDrills,
      })
      .from(drillPerformance)
      .leftJoin(practiceDrills, eq(drillPerformance.drillId, practiceDrills.id))
      .leftJoin(playbookLibrary, eq(drillPerformance.playbookId, playbookLibrary.id))
      .leftJoin(playbookDomains, eq(playbookLibrary.domainId, playbookDomains.id))
      .where(eq(drillPerformance.organizationId, organizationId))
      .orderBy(desc(drillPerformance.createdAt));

    // Calculate aggregate metrics
    const totalDrills = performances.length;
    const passedDrills = performances.filter((p) => p.performance.passed).length;
    const averageScore = totalDrills > 0
      ? Math.round(
          performances.reduce((sum, p) => sum + (p.performance.overallScore || 0), 0) / totalDrills
        )
      : 0;

    const averageExecutionTime = totalDrills > 0
      ? Math.round(
          performances.reduce((sum, p) => sum + (p.performance.actualExecutionTime || 0), 0) / totalDrills
        )
      : 0;

    res.json({
      performances,
      summary: {
        totalDrills,
        passedDrills,
        passRate: totalDrills > 0 ? Math.round((passedDrills / totalDrills) * 100) : 0,
        averageScore,
        averageExecutionTime,
        targetExecutionTime: 12,
      },
    });
  } catch (error) {
    console.error('Error fetching performance data:', error);
    res.status(500).json({ error: 'Failed to fetch performance data' });
  }
});

/**
 * DELETE /api/practice-drills/:drillId
 * Cancel/delete a practice drill
 */
practiceDrillRouter.delete('/:drillId', async (req, res) => {
  try {
    const { drillId } = req.params;

    await db
      .update(practiceDrills)
      .set({
        status: 'cancelled',
        updatedAt: new Date(),
      })
      .where(eq(practiceDrills.id, drillId));

    res.json({ success: true });
  } catch (error) {
    console.error('Error cancelling drill:', error);
    res.status(500).json({ error: 'Failed to cancel drill' });
  }
});
