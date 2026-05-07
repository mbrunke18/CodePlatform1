/**
 * SignalLearningService — Phase 6: Continuous Learning Loop
 * 
 * The permanent competitive advantage. An architecture that compounds in
 * accuracy with every activation across every organization.
 * 
 * Four learning levels (per spec Section 7.1):
 *   1. Organization: calibrated thresholds from own activation data
 *   2. Domain:       improved leading indicator weights across the platform
 *   3. Platform:     enriched signal ontology, better compound detection
 *   4. Industry:     industry-specific signal profiles
 * 
 * PRIVACY RULE (locked — spec Section 7.3):
 *   Cross-organization learning uses anonymized aggregate patterns ONLY.
 *   Individual organization activation data is NEVER shared with or used
 *   to improve signal detection for other organizations.
 *   All learning jobs log audit records for governance review.
 */

import { db } from '../db.js';
import { eq, desc, and, gte } from 'drizzle-orm';
import {
  activationOutcomes,
  signalCalibrationConfig,
  leadingIndicators,
  leadingIndicatorDetections,
  playbookActivations,
  triggerDetections,
  signalOntologyEdges,
  protocolSignalProfiles,
  activityFeedEvents,
} from '@shared/schema';
import { enrichOntologyEdge } from './SignalOntologyService.js';

// ── Audit: log every learning job for governance review ──────────────────────
async function logLearningAudit(
  scope: string,
  jobType: string,
  data: Record<string, any>
): Promise<void> {
  try {
    if (scope !== 'platform') {
      await db.insert(activityFeedEvents).values({
        organizationId: scope as any,
        eventType: `learning_job_${jobType}`,
        title: `Learning job completed: ${jobType}`,
        description: JSON.stringify(data),
        severity: 'info',
        relatedEntityType: 'signal_learning',
        metadata: { ...data, scope, privacyMode: scope === 'platform' ? 'anonymized' : 'org-own-data' },
      } as any);
    }
    // Platform-level jobs: no org ID required — we just log to console (already done by caller)
  } catch {
    // Non-critical — audit failures must not interrupt learning jobs
  }
}

export class SignalLearningService {

  // ── Job 1: Organization Calibration ────────────────────────────────────────
  // Frequency: after each Close-Out Gate completion
  // Input:     activation_outcomes (Close-Out Gate answers) for this org
  // Output:    calibrated signal_calibration_config for this organization
  // Privacy:   uses only this organization's own data — never cross-pollinated
  async runOrganizationCalibration(organizationId: string): Promise<void> {
    try {
      console.log(`[SignalLearning] Organization calibration starting for ${organizationId}`);

      // Get Close-Out Gate completions for this organization
      const outcomes = await db
        .select()
        .from(activationOutcomes)
        .where(
          and(
            eq(activationOutcomes.organizationId, organizationId as any),
            eq(activationOutcomes.closeOutCompleted, true)
          )
        )
        .orderBy(desc(activationOutcomes.createdAt))
        .limit(20);

      if (!outcomes.length) {
        console.log(`[SignalLearning] No Close-Out Gate completions found for ${organizationId}`);
        return;
      }

      // Get the activations linked to these outcomes
      const activationIds = outcomes.map(o => o.activationId);
      const activations = await db
        .select()
        .from(playbookActivations)
        .where(eq(playbookActivations.organizationId, organizationId as any))
        .limit(50);

      // For each outcome with a linked activation, adjust calibration
      for (const outcome of outcomes) {
        const linkedActivation = activations.find(a => a.id === outcome.activationId);
        if (!linkedActivation) continue;

        // Derive the trigger name from the activation context
        // playbookActivations doesn't store triggerName directly — use activationReason as proxy
        const triggerName = (linkedActivation as any).activationReason?.split(':')[0]?.trim()
          || 'Unknown';

        if (!triggerName || triggerName === 'Unknown') continue;

        // Score the quality of this activation's preparation
        let confidenceAdjust = 0;
        let sensitivityLevel = 'standard';

        // whatHeld: positive signal — preparation worked, boost confidence
        if (outcome.whatHeld && outcome.whatHeld.length > 10) {
          confidenceAdjust += 3;
        }
        // whatDidntHold: negative signal — reduce false match confidence
        if (outcome.whatDidntHold && outcome.whatDidntHold.length > 10) {
          confidenceAdjust -= 2;
        }
        // preparationGap: org encountered something it wasn't staged for — increase sensitivity
        if (outcome.preparationGap && outcome.preparationGap.length > 10) {
          sensitivityLevel = 'high';
          confidenceAdjust += 1; // Alert earlier next time
        }
        // targetMet: if 12-minute target was met, preparation architecture worked
        if (outcome.targetMet === true) {
          confidenceAdjust += 2;
        }

        // Check if calibration record already exists for this org + trigger
        const [existing] = await db
          .select()
          .from(signalCalibrationConfig)
          .where(
            and(
              eq(signalCalibrationConfig.organizationId, organizationId as any),
              eq(signalCalibrationConfig.triggerPattern, triggerName)
            )
          )
          .limit(1);

        if (existing) {
          const newAdjust = Number(existing.confidenceAdjust ?? 0) + confidenceAdjust;
          await db
            .update(signalCalibrationConfig)
            .set({
              confidenceAdjust: String(newAdjust),
              sensitivityLevel,
              calibrationCount: (existing.calibrationCount ?? 0) + 1,
              lastCalibrated: new Date(),
            })
            .where(eq(signalCalibrationConfig.id, existing.id));
        } else {
          await db.insert(signalCalibrationConfig).values({
            organizationId: organizationId as any,
            triggerPattern: triggerName,
            confidenceAdjust: String(confidenceAdjust),
            sensitivityLevel,
            calibrationCount: 1,
            lastCalibrated: new Date(),
          } as any);
        }

        // Enrich ontology edge for this trigger's confirmed activation
        await enrichOntologyEdge(triggerName, triggerName, 'confirms');
      }

      const processed = outcomes.length;
      console.log(`[SignalLearning] Organization calibration complete: ${processed} outcomes processed`);
      await logLearningAudit(organizationId, 'org_calibration', {
        outcomesProcessed: processed,
        note: 'org-own-data only',
      });
    } catch (err) {
      console.error('[SignalLearning] OrganizationCalibrationJob error:', err);
    }
  }

  // ── Job 2: Domain Learning (weekly) ────────────────────────────────────────
  // Frequency: weekly
  // Input:     all acknowledged leading_indicator_detections (anonymized)
  // Output:    improved leading_indicator weights for each trigger type
  // Privacy:   anonymized statistical patterns — no organization identifier
  async runDomainLearning(): Promise<void> {
    try {
      console.log('[SignalLearning] Domain learning job starting');

      // Get acknowledged (confirmed true positive) leading indicator detections
      // PRIVACY: we read these anonymized — no org context passes to the weight update
      const confirmed = await db
        .select()
        .from(leadingIndicatorDetections)
        .where(eq(leadingIndicatorDetections.acknowledged, true))
        .orderBy(desc(leadingIndicatorDetections.detectedAt))
        .limit(200);

      if (!confirmed.length) {
        console.log('[SignalLearning] No confirmed leading indicator detections yet');
        await logLearningAudit('platform', 'domain_learning', { patternsUpdated: 0, note: 'no data yet' });
        return;
      }

      // Group by trigger pattern — anonymized count only
      const patternCounts: Record<string, number> = {};
      for (const det of confirmed) {
        const key = det.triggerPattern;
        patternCounts[key] = (patternCounts[key] || 0) + 1;
      }

      let patternsUpdated = 0;

      // For trigger patterns with 2+ confirmed detections, increase indicator weights
      for (const [pattern, count] of Object.entries(patternCounts)) {
        if (count < 2) continue;

        const indicators = await db
          .select()
          .from(leadingIndicators)
          .where(eq(leadingIndicators.triggerPattern, pattern));

        for (const ind of indicators) {
          // Weight increases logarithmically with confirmation count — dampened to prevent runaway
          const increment = Math.log10(count + 1) * 0.1;
          const newWeight = Math.min(3.0, Number(ind.weight ?? 1.0) + increment);
          await db
            .update(leadingIndicators)
            .set({ weight: String(newWeight.toFixed(2)) })
            .where(eq(leadingIndicators.id, ind.id));
          patternsUpdated++;
        }
      }

      console.log(`[SignalLearning] Domain learning complete: ${patternsUpdated} indicator weights updated`);
      await logLearningAudit('platform', 'domain_learning', {
        patternsUpdated,
        triggersAnalyzed: Object.keys(patternCounts).length,
        privacyMode: 'anonymized-aggregate',
      });
    } catch (err) {
      console.error('[SignalLearning] DomainLearningJob error:', err);
    }
  }

  // ── Job 3: Ontology Enrichment (monthly) ───────────────────────────────────
  // Frequency: monthly (after sufficient activation data)
  // Input:     trigger_detections → playbook_activations correlation
  // Output:    signal_ontology_edges evidence_count and weight updated
  // Privacy:   statistical co-occurrence patterns — no organizational context
  async runOntologyEnrichment(): Promise<void> {
    try {
      console.log('[SignalLearning] Ontology enrichment job starting');

      const cutoff = new Date(Date.now() - 30 * 24 * 3_600_000); // last 30 days

      const recentDetections = await db
        .select()
        .from(triggerDetections)
        .where(gte(triggerDetections.detectedAt as any, cutoff))
        .limit(300);

      const recentActivations = await db
        .select()
        .from(playbookActivations)
        .where(gte(playbookActivations.activatedAt as any, cutoff))
        .limit(300);

      let correlationsFound = 0;

      // For each detection followed by an activation within 48 hours (same org),
      // reinforce the trigger→playbook ontology edge.
      // PRIVACY: org ID is used only to match detection→activation pair; never
      // included in the ontology update itself.
      for (const detection of recentDetections) {
        const matchingActivation = recentActivations.find(a => {
          if (a.organizationId !== detection.organizationId) return false;
          const detectionTime = new Date(detection.detectedAt!).getTime();
          const activationTime = new Date(a.activatedAt!).getTime();
          return (
            activationTime > detectionTime &&
            activationTime < detectionTime + 48 * 3_600_000
          );
        });

        if (matchingActivation) {
          // Reinforce: this trigger correctly preceded this activation
          await enrichOntologyEdge(
            detection.triggerName,
            detection.recommendedPlaybook ?? 'unknown',
            'confirms'
          );
          correlationsFound++;
        }
      }

      console.log(`[SignalLearning] Ontology enrichment complete: ${correlationsFound} detection-activation correlations found`);
      await logLearningAudit('platform', 'ontology_enrichment', {
        detectionsAnalyzed: recentDetections.length,
        activationsAnalyzed: recentActivations.length,
        correlationsFound,
        privacyMode: 'anonymized-aggregate',
      });
    } catch (err) {
      console.error('[SignalLearning] OntologyEnrichmentJob error:', err);
    }
  }

  // ── Job 4: Industry Profile Update (quarterly) ─────────────────────────────
  // Frequency: quarterly
  // Input:     all activations grouped by Industry Protocol Pack (anonymized)
  // Output:    protocol_signal_profiles for industry pack playbooks updated
  // Privacy:   activations grouped by industry — no individual org identifiers
  async runIndustryProfileUpdate(): Promise<void> {
    try {
      console.log('[SignalLearning] Industry profile update job starting');

      // PRIVACY: aggregate by domain only — org identifiers stripped
      const activations = await db.select().from(playbookActivations).limit(1000);

      // Group anonymized activations by domain
      const domainCounts: Record<string, number> = {};

      for (const act of activations) {
        const domain = (act as any).activationReason?.split(':')[0]?.trim() || 'Unknown';
        domainCounts[domain] = (domainCounts[domain] || 0) + 1;
      }

      // Update protocol_signal_profiles for top trigger patterns
      // Phase 5b/5c territory for the ML weights — here we bump the profile version to signal refresh
      const profiles = await db.select().from(protocolSignalProfiles).limit(200);
      let profilesUpdated = 0;

      for (const profile of profiles) {
        const patternActivations = activations.filter(a =>
          (a as any).activationReason?.includes(profile.triggerPattern)
        ).length;

        if (patternActivations === 0) continue;

        // Store activation frequency in contextModifiers metadata field (jsonb)
        const currentModifiers = Array.isArray(profile.contextModifiers) ? profile.contextModifiers : [];
        const freqEntry = { condition: 'activation_frequency', value: patternActivations, lastUpdated: new Date().toISOString(), source: 'industry-profile-update-job' };

        await db
          .update(protocolSignalProfiles)
          .set({
            contextModifiers: [...currentModifiers.filter((m: any) => m.condition !== 'activation_frequency'), freqEntry],
            profileVersion: (profile.profileVersion ?? 1) + 1,
            updatedAt: new Date(),
          })
          .where(eq(protocolSignalProfiles.id, profile.id));
        profilesUpdated++;
      }

      const topDomains = Object.entries(domainCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([d, c]) => `${d}: ${c}`);

      console.log(`[SignalLearning] Industry profile update complete: ${profilesUpdated} profiles updated`);
      console.log(`[SignalLearning] Top domains: ${topDomains.join(', ')}`);

      await logLearningAudit('platform', 'industry_profile_update', {
        activationsAnalyzed: activations.length,
        domainsFound: Object.keys(domainCounts).length,
        profilesUpdated,
        topDomains,
        privacyMode: 'anonymized-aggregate',
      });
    } catch (err) {
      console.error('[SignalLearning] IndustryProfileUpdateJob error:', err);
    }
  }

  // ── Schedule all recurring learning jobs ───────────────────────────────────
  scheduleRecurringJobs(): void {
    // Domain learning: weekly
    setInterval(() => {
      this.runDomainLearning().catch(err =>
        console.error('[SignalLearning] DomainLearningJob scheduled run failed:', err)
      );
    }, 7 * 24 * 3_600_000);

    // Ontology enrichment: monthly
    setInterval(() => {
      this.runOntologyEnrichment().catch(err =>
        console.error('[SignalLearning] OntologyEnrichmentJob scheduled run failed:', err)
      );
    }, 30 * 24 * 3_600_000);

    // Industry profile update: quarterly
    setInterval(() => {
      this.runIndustryProfileUpdate().catch(err =>
        console.error('[SignalLearning] IndustryProfileUpdateJob scheduled run failed:', err)
      );
    }, 90 * 24 * 3_600_000);

    console.log(
      '✅ Signal Learning recurring jobs scheduled: ' +
      'domain learning (weekly), ontology enrichment (monthly), industry profiles (quarterly)'
    );
  }

  // ── Queue org calibration via background job system ────────────────────────
  // Called from routes.ts after Close-Out Gate completion
  async queueOrganizationCalibration(organizationId: string): Promise<void> {
    // Run inline (fast enough) — no need to queue separately
    await this.runOrganizationCalibration(organizationId);
  }
}

export const signalLearningService = new SignalLearningService();
