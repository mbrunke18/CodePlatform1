import { db } from '../../db.js';
import type { QuantitativeSignal } from './types.js';

const STALE_DAYS_WARN = 90;
const STALE_DAYS_CRITICAL = 180;
const DRILL_WARN_DAYS = 60;
const DRILL_CRITICAL_DAYS = 120;

export async function fetchInternalReadinessSignals(organizationId: string): Promise<QuantitativeSignal[]> {
  const signals: QuantitativeSignal[] = [];

  // ── Protocol staleness ──────────────────────────────────────────────────────
  try {
    const { playbookLibrary } = await import('@shared/schema');
    const { lt, and, eq, sql } = await import('drizzle-orm');

    const warnCutoff = new Date(Date.now() - STALE_DAYS_WARN * 86400000);
    const critCutoff = new Date(Date.now() - STALE_DAYS_CRITICAL * 86400000);

    const staleProtocols = await db
      .select({
        id: playbookLibrary.id,
        name: playbookLibrary.name,
        updatedAt: playbookLibrary.updatedAt,
        domain: playbookLibrary.domainId,
      })
      .from(playbookLibrary)
      .where(lt(playbookLibrary.updatedAt, warnCutoff))
      .limit(50);

    const criticalStale = staleProtocols.filter(p =>
      p.updatedAt && new Date(p.updatedAt) < critCutoff
    );
    const warnStale = staleProtocols.filter(p =>
      p.updatedAt && new Date(p.updatedAt) >= critCutoff
    );

    if (criticalStale.length > 0) {
      const names = criticalStale.slice(0, 5).map(p => p.name).join(', ');
      signals.push({
        signalType: 'regulatory',
        description: `INTERNAL READINESS GAP: ${criticalStale.length} Readiness Protocol(s) have not been reviewed in over ${STALE_DAYS_CRITICAL} days: ${names}${criticalStale.length > 5 ? ` and ${criticalStale.length - 5} more` : ''}. Stale protocols represent unverified preparation — owners may have changed, procedures may be outdated, and contact lists may be incorrect. These protocols cannot be relied upon in a live situation without immediate review.`,
        confidence: 95,
        impact: 'critical',
        timeline: 'immediate',
        source: 'Readiness OS — Internal Protocol Audit',
        sourceUrl: '/playbook-library',
        category: 'internal',
        jurisdiction: 'US',
        confidenceTier: 1,
        enforcementActionType: 'advisory',
        regulatorAgency: null,
        penaltyAmountRange: null,
        namedSector: null,
        threatSeverity: null,
        exploitStatus: null,
        affectedVendor: null,
        cveId: null,
        affectedSector: null,
        economicIndicatorType: null,
        indicatorDirection: null,
        indicatorMagnitude: null,
        centralBank: null,
        tradeActionType: null,
        effectiveTimeline: null,
        tradePartner: null,
        affectedHsCodes: null,
        recallClass: null,
        affectedProductType: null,
        recallScope: null,
        signalEventType: null,
        metricName: `Protocols stale >${STALE_DAYS_CRITICAL} days`,
        metricValue: criticalStale.length,
        metricThreshold: 0,
        metricUnit: 'protocols',
      });
    } else if (warnStale.length >= 10) {
      signals.push({
        signalType: 'regulatory',
        description: `READINESS DECAY SIGNAL: ${warnStale.length} Readiness Protocol(s) not reviewed in ${STALE_DAYS_WARN}–${STALE_DAYS_CRITICAL} days. Protocol reviews ensure ownership, contacts, and procedures remain accurate. Unreviewed protocols are a liability when a situation fires — the response may be built on outdated assumptions. Recommend scheduling protocol review sprint.`,
        confidence: 83,
        impact: 'high',
        timeline: 'near-term',
        source: 'Readiness OS — Internal Protocol Audit',
        sourceUrl: '/playbook-library',
        category: 'internal',
        jurisdiction: 'US',
        confidenceTier: 1,
        enforcementActionType: 'advisory',
        regulatorAgency: null,
        penaltyAmountRange: null,
        namedSector: null,
        threatSeverity: null,
        exploitStatus: null,
        affectedVendor: null,
        cveId: null,
        affectedSector: null,
        economicIndicatorType: null,
        indicatorDirection: null,
        indicatorMagnitude: null,
        centralBank: null,
        tradeActionType: null,
        effectiveTimeline: null,
        tradePartner: null,
        affectedHsCodes: null,
        recallClass: null,
        affectedProductType: null,
        recallScope: null,
        signalEventType: null,
        metricName: `Protocols stale >${STALE_DAYS_WARN} days`,
        metricValue: warnStale.length,
        metricThreshold: 10,
        metricUnit: 'protocols',
      });
    }
  } catch { /* non-critical */ }

  // ── Stakeholder contact completeness ────────────────────────────────────────
  try {
    const { stakeholderContacts } = await import('@shared/schema');
    const { eq, isNull, or } = await import('drizzle-orm');

    const contacts = await db
      .select({ email: stakeholderContacts.email, name: stakeholderContacts.name, role: stakeholderContacts.role, isActive: stakeholderContacts.isActive })
      .from(stakeholderContacts)
      .where(eq(stakeholderContacts.organizationId, organizationId as any));

    const missingEmail = contacts.filter(c => c.isActive && (!c.email || c.email.trim() === ''));
    const total = contacts.filter(c => c.isActive).length;

    if (total === 0) {
      signals.push({
        signalType: 'regulatory',
        description: `CRITICAL READINESS GAP: No stakeholder contacts are configured. When a trigger fires, the system has no one to notify. Protocols cannot route executive authorization requests, task assignments, or communications without a stakeholder roster. This renders the platform's core notification and authorization chain inactive.`,
        confidence: 97,
        impact: 'critical',
        timeline: 'immediate',
        source: 'Readiness OS — Stakeholder Audit',
        sourceUrl: '/settings',
        category: 'internal',
        jurisdiction: 'US',
        confidenceTier: 1,
        enforcementActionType: 'advisory',
        regulatorAgency: null,
        penaltyAmountRange: null,
        namedSector: null,
        threatSeverity: null,
        exploitStatus: null,
        affectedVendor: null,
        cveId: null,
        affectedSector: null,
        economicIndicatorType: null,
        indicatorDirection: null,
        indicatorMagnitude: null,
        centralBank: null,
        tradeActionType: null,
        effectiveTimeline: null,
        tradePartner: null,
        affectedHsCodes: null,
        recallClass: null,
        affectedProductType: null,
        recallScope: null,
        signalEventType: null,
        metricName: 'Active stakeholder contacts',
        metricValue: 0,
        metricThreshold: 1,
        metricUnit: 'contacts',
      });
    } else if (missingEmail.length > 0) {
      const names = missingEmail.slice(0, 3).map(c => `${c.name} (${c.role})`).join(', ');
      signals.push({
        signalType: 'regulatory',
        description: `STAKEHOLDER GAP: ${missingEmail.length} active stakeholder contact(s) are missing email addresses: ${names}. These contacts will not receive trigger notifications or authorization requests. Notification gaps in the execution chain compromise the 12-minute response window.`,
        confidence: 88,
        impact: 'high',
        timeline: 'immediate',
        source: 'Readiness OS — Stakeholder Audit',
        sourceUrl: '/settings',
        category: 'internal',
        jurisdiction: 'US',
        confidenceTier: 1,
        enforcementActionType: 'advisory',
        regulatorAgency: null,
        penaltyAmountRange: null,
        namedSector: null,
        threatSeverity: null,
        exploitStatus: null,
        affectedVendor: null,
        cveId: null,
        affectedSector: null,
        economicIndicatorType: null,
        indicatorDirection: null,
        indicatorMagnitude: null,
        centralBank: null,
        tradeActionType: null,
        effectiveTimeline: null,
        tradePartner: null,
        affectedHsCodes: null,
        recallClass: null,
        affectedProductType: null,
        recallScope: null,
        signalEventType: null,
        metricName: 'Contacts missing email',
        metricValue: missingEmail.length,
        metricThreshold: 0,
        metricUnit: 'contacts',
      });
    }
  } catch { /* non-critical */ }

  // ── Activation velocity: triggers firing but zero activations ───────────────
  try {
    const { triggerDetections, playbookActivations } = await import('@shared/schema');
    const { count, gte } = await import('drizzle-orm');

    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);
    const [detCount] = await db.select({ c: count() }).from(triggerDetections).where(gte(triggerDetections.detectedAt, thirtyDaysAgo));
    const [actCount] = await db.select({ c: count() }).from(playbookActivations).where(gte(playbookActivations.createdAt, thirtyDaysAgo));

    const detections = Number(detCount?.c || 0);
    const activations = Number(actCount?.c || 0);

    if (detections >= 5 && activations === 0) {
      signals.push({
        signalType: 'market',
        description: `ACTIVATION GAP: ${detections} trigger detection(s) in the last 30 days but 0 protocol activations. Triggers are firing — situations are being detected — but no executive authorizations are occurring. This indicates either: (1) the review + authorization workflow is not fully configured, (2) executives are not receiving notifications, or (3) the trigger sensitivity needs calibration. An unactivated trigger is a missed response window.`,
        confidence: 89,
        impact: 'high',
        timeline: 'immediate',
        source: 'Readiness OS — Activation Velocity Audit',
        sourceUrl: '/live-detection-feed',
        category: 'internal',
        jurisdiction: 'US',
        confidenceTier: 1,
        enforcementActionType: 'advisory',
        regulatorAgency: null,
        penaltyAmountRange: null,
        namedSector: null,
        threatSeverity: null,
        exploitStatus: null,
        affectedVendor: null,
        cveId: null,
        affectedSector: null,
        economicIndicatorType: null,
        indicatorDirection: null,
        indicatorMagnitude: null,
        centralBank: null,
        tradeActionType: null,
        effectiveTimeline: null,
        tradePartner: null,
        affectedHsCodes: null,
        recallClass: null,
        affectedProductType: null,
        recallScope: null,
        signalEventType: null,
        metricName: 'Trigger-to-activation ratio (30 days)',
        metricValue: 0,
        metricThreshold: 1,
        metricUnit: 'activations per trigger cluster',
      });
    }
  } catch { /* non-critical */ }

  if (signals.length > 0) {
    console.log(`[Internal Readiness] ${signals.length} internal readiness gap(s) detected`);
  }

  return signals;
}
