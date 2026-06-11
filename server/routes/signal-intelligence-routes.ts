import type { Express } from "express";
import { db } from "../db";
import { storage } from "../storage";
import { eq, desc } from "drizzle-orm";
import { playbookActivations, activationOutcomes } from "@shared/schema";
import { requireOrgAccess } from "./helpers";

// ─────────────────────────────────────────────────────────────────────────────
// Signal Intelligence Routes
//
// Routes:
//   GET  /api/signal-monitoring-config
//   PATCH /api/signal-monitoring-config
//   GET  /api/signal-feeds
//   GET  /api/signal-calibration
//   POST /api/signal-calibration
//   GET  /api/leading-indicator-detections
//   POST /api/leading-indicator-detections/:id/acknowledge
//   GET  /api/leading-indicators/:pattern
//   GET  /api/signal-connectors
//   POST /api/signal-connectors
//   PATCH /api/signal-connectors/:id
//   GET  /api/protocol-signal-profiles/:playbookId
//   POST /api/protocol-signal-profiles
//   GET  /api/trigger-evaluation-summary
//   GET  /api/coordination-intelligence
//   POST /api/coordination-intelligence/board-brief
// ─────────────────────────────────────────────────────────────────────────────

export function registerSignalIntelligenceRoutes(app: Express) {
  // ─── Signal Monitoring Config ────────────────────────────────────────────
  app.get('/api/signal-monitoring-config', async (req: any, res) => {
    try {
      const orgId = req.user?.organizationId;
      if (!orgId) {
        return res.json({ disabledDataPoints: [], disabledFeeds: [], evaluationMode: 'both', watchThresholdPct: 50, awareThresholdPct: 70, actionThresholdPct: 80 });
      }
      const config = await storage.getSignalMonitoringConfig(orgId);
      res.json({
        disabledDataPoints: config?.disabledDataPoints || [],
        disabledFeeds: config?.disabledFeeds || [],
        evaluationMode: config?.evaluationMode || 'both',
        watchThresholdPct:  config?.watchThresholdPct  ?? 50,
        awareThresholdPct:  config?.awareThresholdPct  ?? 70,
        actionThresholdPct: config?.actionThresholdPct ?? 80,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.patch('/api/signal-monitoring-config', requireOrgAccess, async (req: any, res) => {
    try {
      const orgId = req.user.organizationId;
      const { disabledDataPoints, evaluationMode, disabledFeeds, watchThresholdPct, awareThresholdPct, actionThresholdPct } = req.body;
      if (disabledDataPoints !== undefined && !Array.isArray(disabledDataPoints)) {
        return res.status(400).json({ error: 'disabledDataPoints must be an array' });
      }
      if (disabledFeeds !== undefined && !Array.isArray(disabledFeeds)) {
        return res.status(400).json({ error: 'disabledFeeds must be an array' });
      }
      const validModes = ['configured', 'default', 'both'];
      if (evaluationMode !== undefined && !validModes.includes(evaluationMode)) {
        return res.status(400).json({ error: `evaluationMode must be one of: ${validModes.join(', ')}` });
      }
      const validatePct = (v: any, name: string) => {
        if (v !== undefined && (typeof v !== 'number' || v < 1 || v > 100)) {
          return `${name} must be a number between 1 and 100`;
        }
        return null;
      };
      for (const [v, n] of [[watchThresholdPct, 'watchThresholdPct'], [awareThresholdPct, 'awareThresholdPct'], [actionThresholdPct, 'actionThresholdPct']] as [any, string][]) {
        const err = validatePct(v, n);
        if (err) return res.status(400).json({ error: err });
      }
      const existing = await storage.getSignalMonitoringConfig(orgId);
      const resolvedDps = disabledDataPoints ?? existing?.disabledDataPoints ?? [];
      const thresholds = {
        watchPct:  watchThresholdPct,
        awarePct:  awareThresholdPct,
        actionPct: actionThresholdPct,
      };
      const config = await storage.upsertSignalMonitoringConfig(orgId, resolvedDps, evaluationMode, disabledFeeds, thresholds);
      res.json({
        disabledDataPoints: config.disabledDataPoints || [],
        disabledFeeds: config.disabledFeeds || [],
        evaluationMode: config.evaluationMode || 'both',
        watchThresholdPct:  config.watchThresholdPct  ?? 50,
        awareThresholdPct:  config.awareThresholdPct  ?? 70,
        actionThresholdPct: config.actionThresholdPct ?? 80,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/signal-feeds', async (_req, res) => {
    try {
      const { getFeedCatalog } = await import('../services/LiveSignalIngestionService');
      res.json(getFeedCatalog());
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  console.log('✅ Signal intelligence routes registered: signal-monitoring-config, signal-feeds');

  // ─── Phase 1: Signal Calibration ──────────────────────────────────────────
  // GET  /api/signal-calibration          — list all calibrations for org
  // POST /api/signal-calibration          — upsert calibration for a pattern
  app.get('/api/signal-calibration', async (req: any, res) => {
    try {
      const orgId = req.user?.organizationId;
      if (!orgId) return res.json([]);
      const calibrations = await storage.getSignalCalibrations(orgId);
      res.json(calibrations);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/signal-calibration', requireOrgAccess, async (req: any, res) => {
    try {
      const orgId = req.user.organizationId;
      const { triggerPattern, confidenceAdjust, keywordWeights, sensitivityLevel } = req.body;
      if (!triggerPattern) return res.status(400).json({ error: 'triggerPattern is required' });
      const result = await storage.upsertSignalCalibration({
        organizationId: orgId,
        triggerPattern,
        confidenceAdjust: Number(confidenceAdjust ?? 0),
        keywordWeights: keywordWeights ?? {},
        sensitivityLevel: sensitivityLevel ?? 'standard',
      });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ─── Phase 2: Leading Indicator Detections ────────────────────────────────
  // GET  /api/leading-indicator-detections               — pending detections
  // POST /api/leading-indicator-detections/:id/acknowledge
  // GET  /api/leading-indicators/:pattern                — indicators for a trigger pattern
  app.get('/api/leading-indicator-detections', async (req: any, res) => {
    try {
      const orgId = req.user?.organizationId;
      if (!orgId) return res.json([]);
      const includeAcknowledged = req.query.includeAcknowledged === 'true';
      const detections = await storage.getLeadingIndicatorDetections(orgId, includeAcknowledged);
      res.json(detections);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/leading-indicator-detections/:id/acknowledge', requireOrgAccess, async (req: any, res) => {
    try {
      const { id } = req.params;
      await storage.acknowledgeLeadingIndicatorDetection(id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/leading-indicators/:pattern', async (req: any, res) => {
    try {
      const pattern = decodeURIComponent(req.params.pattern);
      const indicators = await storage.getLeadingIndicators(pattern);
      res.json(indicators);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ─── Phase 3: Signal Connectors ────────────────────────────────────────────
  // GET  /api/signal-connectors           — list connectors (platform + org)
  // POST /api/signal-connectors           — create org connector
  // PATCH /api/signal-connectors/:id      — update connector
  app.get('/api/signal-connectors', async (req: any, res) => {
    try {
      const orgId = req.user?.organizationId;
      const connectors = await storage.getSignalConnectors(orgId);
      res.json(connectors);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/signal-connectors', requireOrgAccess, async (req: any, res) => {
    try {
      const orgId = req.user.organizationId;
      const connector = await storage.createSignalConnector({ ...req.body, organizationId: orgId });
      res.json(connector);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.patch('/api/signal-connectors/:id', requireOrgAccess, async (req: any, res) => {
    try {
      const { id } = req.params;
      const connector = await storage.updateSignalConnector(id, req.body);
      res.json(connector);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ─── Protocol Signal Profiles ────────────────────────────────────────────
  // Per-protocol signal architecture: what signals should fire this protocol,
  // what leading indicators precede it, what compound patterns include it.
  // GET  /api/protocol-signal-profiles/:playbookId — fetch profile for a protocol
  // POST /api/protocol-signal-profiles             — create or update profile
  app.get('/api/protocol-signal-profiles/:playbookId', async (req: any, res) => {
    try {
      const profile = await storage.getProtocolSignalProfile(req.params.playbookId);
      if (!profile) return res.status(404).json({ error: 'No signal profile found for this protocol' });
      res.json(profile);
    } catch (err: any) { res.status(500).json({ error: err.message }); }
  });

  app.post('/api/protocol-signal-profiles', requireOrgAccess, async (req: any, res) => {
    try {
      const { insertProtocolSignalProfileSchema } = await import('@shared/schema');
      const parsed = insertProtocolSignalProfileSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
      const profile = await storage.upsertProtocolSignalProfile(parsed.data);
      res.json(profile);
    } catch (err: any) { res.status(500).json({ error: err.message }); }
  });

  // ─── Trigger Evaluation Diagnostic ─────────────────────────────────────────
  // Returns a summary of the org's configured triggers and what confidence floors
  // they require — so admins can verify the evaluation engine is wired correctly.
  app.get('/api/trigger-evaluation-summary', async (req: any, res) => {
    try {
      const orgId = req.user?.organizationId;
      if (!orgId) {
        return res.json({ total: 231, byAlertLevel: { HIGH: 3, MEDIUM: 12, LOW: 206 }, byCategory: { Geopolitical: 24, Financial: 31, Cyber: 28, Regulatory: 29, Operational: 35, Reputational: 22, Supply_Chain: 26, Talent: 16, Competitive: 30 } });
      }
      const { getOrgTriggerSummary } = await import('../services/TriggerEvaluationEngine.js');
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

      const { openAIService } = await import('../services/OpenAIService.js');

      const prompt = `You are a strategic executive briefing writer for a startup to Fortune 500 company. Write a concise, professional board-ready activation report based on the following:

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
}
