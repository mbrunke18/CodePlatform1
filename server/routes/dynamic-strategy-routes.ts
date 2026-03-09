import type { Express } from "express";
import { db } from "../db";
import { users } from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth, getUserId } from "./helpers";

export async function registerDynamicStrategyRoutes(app: Express): Promise<void> {

  // DYNAMIC STRATEGY - Future Readiness & Self-Learning Playbooks
  // ============================================================================

  app.get('/api/dynamic-strategy/readiness', requireAuth, async (req: any, res) => {
    try {
      const { dynamicStrategyService } = await import('../services/dynamicStrategyService.js');
      const userId = getUserId(req);
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!user[0]?.organizationId) {
        return res.status(404).json({ error: 'Organization not found' });
      }
      const metric = await dynamicStrategyService.getLatestReadinessMetric(user[0].organizationId);
      if (!metric) {
        const newMetric = await dynamicStrategyService.calculateReadinessScore(user[0].organizationId);
        return res.json(newMetric);
      }
      res.json(metric);
    } catch (error: any) {
      console.error('Error fetching readiness metric:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/dynamic-strategy/readiness/calculate', requireAuth, async (req: any, res) => {
    try {
      const { dynamicStrategyService } = await import('../services/dynamicStrategyService.js');
      const userId = getUserId(req);
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!user[0]?.organizationId) {
        return res.status(404).json({ error: 'Organization not found' });
      }
      const metric = await dynamicStrategyService.calculateReadinessScore(user[0].organizationId);
      res.json(metric);
    } catch (error: any) {
      console.error('Error calculating readiness:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/dynamic-strategy/weak-signals', requireAuth, async (req: any, res) => {
    try {
      const { weakSignals } = await import('@shared/schema');
      const { and } = await import('drizzle-orm');
      const userId = getUserId(req);
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!user[0]?.organizationId) {
        return res.status(404).json({ error: 'Organization not found' });
      }
      const signals = await db
        .select()
        .from(weakSignals)
        .where(and(eq(weakSignals.organizationId, user[0].organizationId), eq(weakSignals.status, 'active')))
        .orderBy(desc(weakSignals.detectedAt))
        .limit(50);
      res.json(signals);
    } catch (error: any) {
      console.error('Error fetching weak signals:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/dynamic-strategy/oracle-patterns', requireAuth, async (req: any, res) => {
    try {
      const { oraclePatterns } = await import('@shared/schema');
      const userId = getUserId(req);
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!user[0]?.organizationId) {
        return res.status(404).json({ error: 'Organization not found' });
      }
      const patterns = await db
        .select()
        .from(oraclePatterns)
        .where(eq(oraclePatterns.organizationId, user[0].organizationId))
        .orderBy(desc(oraclePatterns.detectedAt))
        .limit(50);
      res.json(patterns);
    } catch (error: any) {
      console.error('Error fetching oracle patterns:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/dynamic-strategy/status', requireAuth, async (req: any, res) => {
    try {
      const { dynamicStrategyService } = await import('../services/dynamicStrategyService.js');
      const userId = getUserId(req);
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!user[0]?.organizationId) {
        return res.status(404).json({ error: 'Organization not found' });
      }
      const status = await dynamicStrategyService.getSystemStatus(user[0].organizationId);
      res.json(status);
    } catch (error: any) {
      console.error('Error fetching dynamic strategy status:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/dynamic-strategy/activity-feed', requireAuth, async (req: any, res) => {
    try {
      const { activityFeedEvents } = await import('@shared/schema');
      const userId = getUserId(req);
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!user[0]?.organizationId) {
        return res.status(404).json({ error: 'Organization not found' });
      }
      const limit = parseInt(req.query.limit as string) || 20;
      const events = await db
        .select()
        .from(activityFeedEvents)
        .where(eq(activityFeedEvents.organizationId, user[0].organizationId))
        .orderBy(desc(activityFeedEvents.createdAt))
        .limit(limit);
      res.json(events);
    } catch (error: any) {
      console.error('Error fetching activity feed:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/dynamic-strategy/playbook-learnings/:id', requireAuth, async (req: any, res) => {
    try {
      const { playbookLearnings } = await import('@shared/schema');
      const scenarioId = req.params.id;
      const learnings = await db
        .select()
        .from(playbookLearnings)
        .where(eq(playbookLearnings.scenarioId, scenarioId))
        .orderBy(desc(playbookLearnings.extractedAt))
        .limit(50);
      res.json(learnings);
    } catch (error: any) {
      console.error('Error fetching playbook learnings:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/dynamic-strategy/generate-demo-data', requireAuth, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!user[0]?.organizationId) {
        return res.status(404).json({ error: 'Organization not found' });
      }
      const organizationId = user[0].organizationId;

      const { readinessMetrics } = await import('@shared/schema');
      await db.insert(readinessMetrics).values({
        organizationId,
        overallScore: '84.4',
        foresightScore: '88',
        velocityScore: '83',
        agilityScore: '79',
        learningScore: '79',
        adaptabilityScore: '87',
        activeScenarios: 3,
        weakSignalsDetected: 5,
        playbooksReady: 12,
        playbooksTotal: 18,
        averageResponseTime: 8,
        trend: 'up',
        measurementDate: new Date(),
      });

      const { weakSignals } = await import('@shared/schema');
      const demoSignals = [
        {
          organizationId,
          signalType: 'regulatory',
          title: 'Emerging Data Privacy Regulation',
          description: 'New data privacy legislation being discussed in key markets',
          confidence: '78',
          urgency: 'medium',
          impact: 'high',
          source: 'Regulatory Monitor',
          status: 'active'
        },
        {
          organizationId,
          signalType: 'competitor',
          title: 'Competitor Product Launch Signals',
          description: 'Competitor hiring surge in product development team',
          confidence: '82',
          urgency: 'high',
          impact: 'medium',
          source: 'Market Intelligence',
          status: 'active'
        },
        {
          organizationId,
          signalType: 'market',
          title: 'Supply Chain Tension Points',
          description: 'Minor disruptions detected in secondary supplier network',
          confidence: '71',
          urgency: 'low',
          impact: 'medium',
          source: 'Supply Chain Monitor',
          status: 'active'
        }
      ];
      for (const signal of demoSignals) {
        await db.insert(weakSignals).values(signal);
      }

      const { oraclePatterns } = await import('@shared/schema');
      const demoPatterns = [
        {
          organizationId,
          patternType: 'market_disruption',
          title: 'AI-Driven Market Consolidation Pattern',
          description: 'Historical pattern suggests 40% likelihood of market consolidation in next 12 months',
          confidence: '85',
          impact: 'high',
          timeline: '6-12 months',
          recommendations: ['Prepare M&A defense playbook', 'Strengthen customer relationships'],
          status: 'detected'
        },
        {
          organizationId,
          patternType: 'regulatory_shift',
          title: 'Regulatory Harmonization Trend',
          description: 'Multiple jurisdictions showing convergence in compliance requirements',
          confidence: '73',
          impact: 'medium',
          timeline: '3-6 months',
          recommendations: ['Update compliance framework', 'Engage regulatory affairs'],
          status: 'analyzing'
        }
      ];
      for (const pattern of demoPatterns) {
        await db.insert(oraclePatterns).values(pattern);
      }

      const { activityFeedEvents } = await import('@shared/schema');
      const demoActivities = [
        {
          organizationId,
          eventType: 'weak_signal',
          title: 'New Weak Signal Detected',
          description: 'AI detected emerging data privacy regulation signals',
          severity: 'warning',
          relatedEntityType: 'signal',
          createdBy: userId
        },
        {
          organizationId,
          eventType: 'pattern_detected',
          title: 'Oracle Pattern Identified',
          description: 'Market consolidation pattern detected with 85% confidence',
          severity: 'info',
          relatedEntityType: 'pattern',
          createdBy: userId
        },
        {
          organizationId,
          eventType: 'readiness_update',
          title: 'Readiness Score Updated',
          description: 'Overall readiness improved to 84.4%',
          severity: 'info',
          createdBy: userId
        }
      ];
      for (const activity of demoActivities) {
        await db.insert(activityFeedEvents).values(activity);
      }

      res.json({
        success: true,
        message: 'Demo data generated successfully',
        data: {
          readinessMetrics: 1,
          weakSignals: demoSignals.length,
          oraclePatterns: demoPatterns.length,
          activityEvents: demoActivities.length
        }
      });
    } catch (error: any) {
      console.error('Error generating demo data:', error);
      res.status(500).json({ error: error.message });
    }
  });
}
