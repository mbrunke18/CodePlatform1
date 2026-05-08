/**
 * StakeholderReadinessService
 *
 * Transforms stakeholder management from a contact list into a performance intelligence layer:
 *  - Per-stakeholder readiness scores based on real authorization speed and engagement history
 *  - Ranked recommendations of specific people (not just roles) for each protocol activation
 *  - Org-level readiness dashboard: who is prepared, who is a bottleneck, who needs a drill
 *
 * The promise: "AI monitors, executives authorize" — this service makes the authorization
 * step as fast and well-informed as possible.
 */

import { db } from '../db.js';
import { eq, desc, and, gte, avg, count, sql } from 'drizzle-orm';
import {
  stakeholderContacts,
  activationStakeholders,
  playbookActivations,
  playbookLibrary,
  practiceDrills,
  organizations,
} from '@shared/schema';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface StakeholderPerformanceProfile {
  contactId: number | null;
  role: string;
  name: string | null;
  email: string | null;

  // Readiness composite (0–100)
  readinessScore: number;
  readinessTrend: 'improving' | 'stable' | 'declining';

  // Speed metrics
  avgAuthorizationSeconds: number | null;
  fastestAuthorizationSeconds: number | null;
  p90AuthorizationSeconds: number | null;

  // Engagement
  totalActivationsParticipated: number;
  totalDrillsParticipated: number;
  lastActiveDate: Date | null;
  daysSinceLastEngagement: number | null;

  // Bottleneck flag
  isBottleneck: boolean;            // avg response > 3x org median
  bottleneckRisk: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';

  // Domain coverage
  domains: string[];                // domains they are designated for

  // Recommendation
  recommendedForActivation: boolean;
  recommendationReason: string;
}

export interface ProtocolRecommendation {
  protocolId: string;
  protocolName: string;
  recommendedParticipants: Array<{
    role: string;
    name: string | null;
    readinessScore: number;
    avgResponseSeconds: number | null;
    tier: number;
    reason: string;
  }>;
  unfilledRoles: string[];          // roles with no mapped contacts
  compositionReadinessScore: number;
}

export interface OrgReadinessDashboard {
  organizationId: string;
  orgReadinessScore: number;        // 0–100
  totalStakeholders: number;
  readyCount: number;               // score >= 70
  atRiskCount: number;              // score 40–69
  criticalCount: number;            // score < 40
  orgMedianResponseSeconds: number | null;
  fastestResponder: { role: string; name: string | null; avgSeconds: number } | null;
  slowestResponder: { role: string; name: string | null; avgSeconds: number } | null;
  bottlenecks: StakeholderPerformanceProfile[];
  profiles: StakeholderPerformanceProfile[];
  assessedAt: Date;
}

// ── Core: build performance profile for one role ──────────────────────────────

async function buildProfile(
  contact: typeof stakeholderContacts.$inferSelect | null,
  role: string,
  allStakeholderRows: typeof activationStakeholders.$inferSelect[],
  allDrillRows: typeof practiceDrills.$inferSelect[],
  orgMedianSeconds: number | null
): Promise<StakeholderPerformanceProfile> {
  const now = new Date();

  // Filter rows for this role
  const roleRows = allStakeholderRows.filter(s => s.roleName === role);
  const responseTimes = roleRows
    .filter(s => s.responseTimeSeconds !== null)
    .map(s => s.responseTimeSeconds as number)
    .sort((a, b) => a - b);

  const avgAuth = responseTimes.length > 0
    ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
    : null;
  const fastestAuth = responseTimes.length > 0 ? responseTimes[0] : null;
  const p90Auth = responseTimes.length > 0
    ? responseTimes[Math.floor(responseTimes.length * 0.9)] ?? responseTimes[responseTimes.length - 1]
    : null;

  // Last active
  const acknowledgedRows = roleRows.filter(s => s.acknowledgedAt);
  const lastActiveDate = acknowledgedRows.length > 0
    ? acknowledgedRows.reduce((latest, s) => {
        const d = new Date(s.acknowledgedAt!);
        return d > latest ? d : latest;
      }, new Date(0))
    : null;
  const daysSinceLastEngagement = lastActiveDate && lastActiveDate.getTime() > 0
    ? Math.round((now.getTime() - lastActiveDate.getTime()) / 86400000)
    : null;

  // Drill participation (by contact name match or role)
  const drillParticipation = allDrillRows.filter(d => {
    const participants = (d.actualParticipants ?? []) as any[];
    return participants.some((p: any) =>
      (typeof p === 'string' && p === contact?.name) ||
      (typeof p === 'object' && (p.role === role || p.name === contact?.name))
    );
  }).length;

  // Bottleneck check
  const isBottleneck = !!(orgMedianSeconds && avgAuth && avgAuth > orgMedianSeconds * 3);
  const bottleneckRisk: StakeholderPerformanceProfile['bottleneckRisk'] =
    !avgAuth ? 'NONE' :
    isBottleneck ? 'HIGH' :
    (orgMedianSeconds && avgAuth > orgMedianSeconds * 1.5) ? 'MEDIUM' :
    'LOW';

  // Trend: compare last 3 vs previous 3 response times
  let trend: StakeholderPerformanceProfile['readinessTrend'] = 'stable';
  if (responseTimes.length >= 6) {
    const recent = responseTimes.slice(-3).reduce((a, b) => a + b, 0) / 3;
    const prior = responseTimes.slice(-6, -3).reduce((a, b) => a + b, 0) / 3;
    if (recent < prior * 0.85) trend = 'improving';
    else if (recent > prior * 1.15) trend = 'declining';
  }

  // Readiness score
  let score = 50;
  // Engagement history
  score += Math.min(25, roleRows.length * 4);
  // Speed
  if (avgAuth !== null && orgMedianSeconds !== null) {
    if (avgAuth <= orgMedianSeconds * 0.5) score += 20;
    else if (avgAuth <= orgMedianSeconds) score += 10;
    else if (avgAuth > orgMedianSeconds * 2) score -= 10;
    else if (avgAuth > orgMedianSeconds * 1.5) score -= 5;
  }
  // Drills
  score += Math.min(15, drillParticipation * 5);
  // Recency
  if (daysSinceLastEngagement === null) score -= 10;
  else if (daysSinceLastEngagement <= 30) score += 10;
  else if (daysSinceLastEngagement > 180) score -= 10;

  const readinessScore = Math.min(100, Math.max(0, Math.round(score)));

  const recommendedForActivation = readinessScore >= 60 && !isBottleneck;
  const recommendationReason = recommendedForActivation
    ? avgAuth !== null
      ? `Avg response: ${avgAuth}s — ${roleRows.length} prior activations.`
      : `${roleRows.length} prior activations on record.`
    : isBottleneck
      ? `Response time (avg ${avgAuth}s) is significantly above org median — consider backup.`
      : daysSinceLastEngagement !== null && daysSinceLastEngagement > 180
        ? `Last engaged ${daysSinceLastEngagement} days ago — readiness uncertain.`
        : 'Limited activation history — recommend drill before next live event.';

  return {
    contactId: contact?.id ?? null,
    role,
    name: contact?.name ?? null,
    email: contact?.email ?? null,
    readinessScore,
    readinessTrend: trend,
    avgAuthorizationSeconds: avgAuth,
    fastestAuthorizationSeconds: fastestAuth,
    p90AuthorizationSeconds: p90Auth,
    totalActivationsParticipated: roleRows.length,
    totalDrillsParticipated: drillParticipation,
    lastActiveDate: lastActiveDate && lastActiveDate.getTime() > 0 ? lastActiveDate : null,
    daysSinceLastEngagement,
    isBottleneck,
    bottleneckRisk,
    domains: contact?.triggerDomains ?? [],
    recommendedForActivation,
    recommendationReason,
  };
}

// ── Org-wide dashboard ────────────────────────────────────────────────────────

export async function getOrgReadinessDashboard(
  organizationId: string
): Promise<OrgReadinessDashboard> {
  const contacts = await db
    .select()
    .from(stakeholderContacts)
    .where(eq(stakeholderContacts.organizationId, organizationId));

  const allStakeholderRows = await db
    .select()
    .from(activationStakeholders)
    .limit(2000);

  const allDrillRows = await db
    .select()
    .from(practiceDrills)
    .where(eq(practiceDrills.organizationId, organizationId));

  // Org median response time
  const allResponseTimes = allStakeholderRows
    .filter(s => s.responseTimeSeconds !== null)
    .map(s => s.responseTimeSeconds as number)
    .sort((a, b) => a - b);

  const orgMedianSeconds = allResponseTimes.length > 0
    ? allResponseTimes[Math.floor(allResponseTimes.length / 2)]
    : null;

  // Build unique roles from contacts + stakeholder history
  const allRoles = Array.from(new Set<string>([
    ...contacts.map(c => c.role),
    ...allStakeholderRows.map(s => s.roleName),
  ]));

  const contactMap: Record<string, typeof contacts[0]> = {};
  for (const c of contacts) contactMap[c.role] = c;

  const profiles: StakeholderPerformanceProfile[] = [];
  for (const role of allRoles) {
    const profile = await buildProfile(
      contactMap[role] ?? null,
      role,
      allStakeholderRows,
      allDrillRows,
      orgMedianSeconds
    );
    profiles.push(profile);
  }

  profiles.sort((a, b) => b.readinessScore - a.readinessScore);

  const readyCount = profiles.filter(p => p.readinessScore >= 70).length;
  const atRiskCount = profiles.filter(p => p.readinessScore >= 40 && p.readinessScore < 70).length;
  const criticalCount = profiles.filter(p => p.readinessScore < 40).length;

  const orgReadinessScore = profiles.length > 0
    ? Math.round(profiles.reduce((s, p) => s + p.readinessScore, 0) / profiles.length)
    : 0;

  const withTimes = profiles.filter(p => p.avgAuthorizationSeconds !== null);
  const fastestResponder = withTimes.length > 0
    ? { role: withTimes[withTimes.length - 1].role, name: withTimes[withTimes.length - 1].name, avgSeconds: withTimes[withTimes.length - 1].avgAuthorizationSeconds! }
    : null;
  // Sorted ascending, so slowest is first
  const slowestResponder = withTimes.length > 0
    ? (() => {
        const slowest = [...withTimes].sort((a, b) => (b.avgAuthorizationSeconds ?? 0) - (a.avgAuthorizationSeconds ?? 0))[0];
        return { role: slowest.role, name: slowest.name, avgSeconds: slowest.avgAuthorizationSeconds! };
      })()
    : null;

  const bottlenecks = profiles.filter(p => p.isBottleneck);

  return {
    organizationId,
    orgReadinessScore,
    totalStakeholders: profiles.length,
    readyCount,
    atRiskCount,
    criticalCount,
    orgMedianResponseSeconds: orgMedianSeconds,
    fastestResponder,
    slowestResponder,
    bottlenecks,
    profiles,
    assessedAt: new Date(),
  };
}

// ── Protocol-specific recommendations ─────────────────────────────────────────

export async function getProtocolRecommendations(
  playbookId: string,
  organizationId: string
): Promise<ProtocolRecommendation> {
  const [protocol] = await db
    .select()
    .from(playbookLibrary)
    .where(eq(playbookLibrary.id, playbookId))
    .limit(1);

  if (!protocol) throw new Error(`Protocol ${playbookId} not found`);

  const dashboard = await getOrgReadinessDashboard(organizationId);

  const tier1Roles: string[] = ((protocol.tier1Stakeholders ?? []) as any[]).map(
    (r: any) => typeof r === 'string' ? r : r.role
  );
  const tier2Roles: string[] = ((protocol.tier2Stakeholders ?? []) as any[]).map(
    (r: any) => typeof r === 'string' ? r : r.role
  );

  const allRequiredRoles = [...tier1Roles, ...tier2Roles];
  const profileMap: Record<string, StakeholderPerformanceProfile> = {};
  for (const p of dashboard.profiles) profileMap[p.role] = p;

  const recommended = allRequiredRoles.map((role, i) => {
    const profile = profileMap[role];
    const tier = i < tier1Roles.length ? 1 : 2;
    if (!profile) {
      return { role, name: null, readinessScore: 0, avgResponseSeconds: null, tier, reason: 'No contact mapped for this role.' };
    }
    return {
      role,
      name: profile.name,
      readinessScore: profile.readinessScore,
      avgResponseSeconds: profile.avgAuthorizationSeconds,
      tier,
      reason: profile.recommendationReason,
    };
  });

  const unfilledRoles = allRequiredRoles.filter(r => !profileMap[r] || !profileMap[r].name);

  const compositionReadinessScore = recommended.length > 0
    ? Math.round(recommended.reduce((s, r) => s + r.readinessScore, 0) / recommended.length)
    : 0;

  return {
    protocolId: playbookId,
    protocolName: protocol.name,
    recommendedParticipants: recommended,
    unfilledRoles,
    compositionReadinessScore,
  };
}
