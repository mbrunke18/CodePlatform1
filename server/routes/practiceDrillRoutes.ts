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
      targetExecutionTime: 12, // Readiness OS standard: 12-minute coordinated response
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
 * POST /api/practice-drills/:drillId/debrief
 * Submit structured post-drill debrief
 */
practiceDrillRouter.post('/:drillId/debrief', async (req, res) => {
  try {
    const { drillId } = req.params;
    const { whatWorked, whatFailed, protocolChanges, actionItems, successRate, minPassScore } = req.body;
    const passed = typeof successRate === 'number' && typeof minPassScore === 'number'
      ? successRate >= minPassScore
      : null;
    const [drill] = await db
      .update(practiceDrills)
      .set({
        debriefWhatWorked: whatWorked || null,
        debriefWhatFailed: whatFailed || null,
        debriefProtocolChanges: protocolChanges || null,
        debriefActionItems: actionItems || null,
        debriefComplete: true,
        passedDrill: passed ?? undefined,
        updatedAt: new Date(),
      } as any)
      .where(eq(practiceDrills.id, drillId))
      .returning();
    res.json({ drill, passed });
  } catch (error) {
    console.error('Error saving drill debrief:', error);
    res.status(500).json({ error: 'Failed to save debrief' });
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
 * POST /api/practice-drills/:drillId/complication
 * Inject a mid-drill complication — uses OpenAI when available, falls back to curated templates
 */
practiceDrillRouter.post('/:drillId/complication', async (req, res) => {
  try {
    const { minuteElapsed = 0, playbookName = 'Readiness Protocol', domain = 'risk' } = req.body;

    const templates = {
      growth: [
        { title: 'Competitor Announcement Breaking', description: 'A direct competitor has just announced a conflicting initiative. Media is requesting comment and your messaging window is closing fast.', severity: 'HIGH', responseOptions: ['Accelerate primary announcement', 'Coordinate counter-narrative brief', 'Issue media holding statement'] },
        { title: 'Deal Counsel Unreachable', description: 'Lead legal counsel is in an emergency session and cannot be reached. Secondary authorization chain must be activated immediately.', severity: 'HIGH', responseOptions: ['Activate backup legal authority', 'Proceed with delegated authorization', 'Pause execution of legal-gated tasks'] },
        { title: 'Data Room Access Breach', description: 'Unauthorized access attempt detected on the secure data room. CISO and Legal must be notified — a second response track must open now.', severity: 'CRITICAL', responseOptions: ['Suspend data room immediately', 'Notify CISO and General Counsel', 'Activate cyber incident protocol'] },
      ],
      risk: [
        { title: 'Regulatory Emergency Inquiry', description: 'A regulatory agency has issued a simultaneous emergency data request. A second response track must be opened without pausing the primary execution.', severity: 'CRITICAL', responseOptions: ['Assign separate regulatory lead', 'Notify General Counsel immediately', 'Document all actions in real-time'] },
        { title: 'Story Published Ahead of Plan', description: 'A breaking news article has been published before your communications plan executed. Your narrative window has closed — rapid response required.', severity: 'HIGH', responseOptions: ['Activate media rapid response', 'Issue immediate holding statement', 'Brief board communications lead'] },
        { title: 'Primary Vendor Gone Silent', description: 'Your primary recovery vendor has gone unresponsive. Alternative sourcing must be activated within the next 15 minutes to hold the timeline.', severity: 'HIGH', responseOptions: ['Activate backup vendor immediately', 'Escalate to Chief Procurement Officer', 'Document vendor failure for legal review'] },
      ],
      transformation: [
        { title: 'Employee Representative Escalation', description: 'Workforce representatives have escalated concerns and are requesting immediate executive dialogue. Protocol scope must expand to include a parallel HR track.', severity: 'HIGH', responseOptions: ['Arrange executive briefing in 10 minutes', 'Activate HR emergency response line', 'Pause impacted workforce announcements'] },
        { title: 'Board Member Requesting Briefing', description: 'A board member has requested a real-time executive update. Primary execution must continue while a parallel briefing track is opened.', severity: 'MEDIUM', responseOptions: ['Assign dedicated board briefing lead', 'Prepare 5-minute executive summary', 'Continue primary execution uninterrupted'] },
        { title: 'Communication System Degraded', description: 'Primary stakeholder communication infrastructure is showing failures. Backup notification channels must be validated and activated now.', severity: 'HIGH', responseOptions: ['Switch to backup communication channels', 'Notify IT Lead immediately', 'Activate manual notification tree'] },
      ],
    };

    const domainKey = (domain?.toLowerCase() ?? '').includes('growth') ? 'growth' :
                      (domain?.toLowerCase() ?? '').includes('risk') ? 'risk' : 'transformation';
    const pool = templates[domainKey as keyof typeof templates] ?? templates.risk;
    const idx = minuteElapsed <= 4 ? 0 : minuteElapsed <= 7 ? 1 : 2;
    const fallback = pool[idx % pool.length];

    // Try OpenAI for protocol-specific complication
    try {
      const { default: OpenAI } = await import('openai');
      const openai = new OpenAI({
        apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY!,
        baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
      });

      const aiRes = await openai.chat.completions.create({
        model: 'gpt-4o',
        max_tokens: 220,
        messages: [
          {
            role: 'system',
            content: 'You are a crisis drill complication generator for executive readiness simulations. Generate a realistic mid-drill complication that adds executive pressure without derailing the primary response. Respond ONLY with valid JSON matching this shape: { "title": string (max 8 words), "description": string (max 45 words, urgent tone), "severity": "MEDIUM"|"HIGH"|"CRITICAL" }'
          },
          {
            role: 'user',
            content: `Protocol: "${playbookName}". Domain: "${domain}". Minute ${minuteElapsed} of 12. Generate a complication requiring immediate executive decision-making.`
          }
        ],
      });

      const raw = aiRes.choices[0]?.message?.content?.trim() ?? '';
      const cleaned = raw.replace(/```json\n?|```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      return res.json({
        id: `comp-${Date.now()}`,
        title: parsed.title ?? fallback.title,
        description: parsed.description ?? fallback.description,
        severity: parsed.severity ?? fallback.severity,
        responseOptions: fallback.responseOptions,
        injectedAt: new Date().toISOString(),
        minuteElapsed,
      });
    } catch (_aiErr) {
      // Fall through to template
    }

    res.json({
      id: `comp-${Date.now()}`,
      ...fallback,
      injectedAt: new Date().toISOString(),
      minuteElapsed,
    });
  } catch (error) {
    console.error('Error injecting complication:', error);
    res.status(500).json({ error: 'Failed to inject complication' });
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
