/**
 * Prospect Enrollment for Live Trigger Alerts
 *
 * Two parallel paths:
 * 1. Stakeholder contact enrollment — existing path, adds prospect to all orgs
 *    so they receive the standard internal trigger alert email.
 * 2. Signal brief enrollment — new path, tracks prospects in signal_brief_prospects
 *    and sends a tailored outreach email when a high-confidence trigger fires.
 */

import { db } from '../db';
import { organizations, stakeholderContacts, signalBriefProspects, prospectBriefsSent } from '@shared/schema';
import { eq, and, gte, sql } from 'drizzle-orm';
import { Resend } from 'resend';

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';
const MIN_CONFIDENCE = 75;
const BRIEF_DEDUP_HOURS = 48;
const MAX_BRIEFS_PER_WEEK = 3;

function getPlatformUrl(): string {
  if (process.env.REPLIT_DEPLOYMENT_URL) return process.env.REPLIT_DEPLOYMENT_URL;
  if (process.env.REPL_SLUG) return `https://${process.env.REPL_SLUG}.replit.app`;
  return 'https://vaughnmartin.replit.app';
}

export interface DetectionBrief {
  triggerName: string;
  triggerDomain: string;
  recommendedPlaybook: string;
  confidenceScore: number;
  signalDescription: string;
}

export async function enrollProspectForAlerts(prospect: {
  email: string;
  name: string;
  role: string;
  company: string;
}): Promise<void> {
  try {
    // Get every organization that exists in the DB, plus the built-in
    // 'system' org — the default monitoring org used when no org-specific
    // config is found. Enrolling in 'system' is the critical one that
    // ensures prospects receive the live trigger alerts.
    const dbOrgs = await db.select({ id: organizations.id }).from(organizations);
    const allOrgIds: string[] = ['system', ...dbOrgs.map(o => o.id)];

    let enrolled = 0;
    for (const orgId of allOrgIds) {
      const org = { id: orgId };
      try {
        // Check if this email is already registered in this org
        const existing = await db
          .select({ id: stakeholderContacts.id, isActive: stakeholderContacts.isActive })
          .from(stakeholderContacts)
          .where(
            and(
              eq(stakeholderContacts.organizationId, org.id as any),
              eq(stakeholderContacts.email, prospect.email)
            )
          )
          .limit(1);

        if (existing.length > 0) {
          // Already exists — reactivate if they had previously unsubscribed
          if (!existing[0].isActive) {
            await db
              .update(stakeholderContacts)
              .set({ isActive: true })
              .where(eq(stakeholderContacts.id, existing[0].id));
            console.log(`[ProspectEnrollment] Reactivated ${prospect.email} in org ${org.id}`);
          } else {
            console.log(`[ProspectEnrollment] ${prospect.email} already enrolled in org ${org.id}`);
          }
          continue;
        }

        // Fresh enrollment — empty triggerDomains = receives ALL domain alerts
        await db.insert(stakeholderContacts).values({
          organizationId: org.id as any,
          role: prospect.role || 'Executive',
          name: prospect.name,
          email: prospect.email,
          isActive: true,
          triggerDomains: [], // receives every trigger regardless of domain
        });

        enrolled++;
        console.log(`✅ [ProspectEnrollment] Enrolled ${prospect.email} (${prospect.role} · ${prospect.company}) in org ${org.id} for live trigger alerts`);
      } catch (orgErr: any) {
        console.error(`[ProspectEnrollment] Failed to enroll in org ${org.id}:`, orgErr.message);
      }
    }

    if (enrolled > 0) {
      console.log(`✅ [ProspectEnrollment] ${prospect.email} will now receive live trigger alert emails across ${enrolled} org(s)`);
    }

    // Also upsert to signal_brief_prospects for the tailored outreach brief path
    try {
      await db
        .insert(signalBriefProspects)
        .values({
          email: prospect.email,
          name: prospect.name,
          role: prospect.role || '',
          company: prospect.company,
          isActive: true,
        })
        .onConflictDoUpdate({
          target: signalBriefProspects.email,
          set: {
            name: prospect.name,
            company: prospect.company,
            role: prospect.role || '',
            isActive: true,
          },
        });
    } catch (briefErr: any) {
      console.warn('[ProspectEnrollment] signal_brief_prospects upsert failed (non-fatal):', briefErr.message);
    }
  } catch (err: any) {
    // Non-fatal — enrollment failure must never break the request access flow
    console.error('[ProspectEnrollment] Enrollment failed (non-fatal):', err.message);
  }
}

/**
 * Called after every signal evaluation run.
 * For each high-confidence detection, find active prospects who haven't
 * received a brief for this trigger recently, and send them a tailored
 * VaughnMartin Signal Brief email.
 */
export async function notifyMatchingProspects(detections: DetectionBrief[]): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  const qualifying = detections.filter(d => (d.confidenceScore ?? 0) >= MIN_CONFIDENCE);
  if (qualifying.length === 0) return;

  let prospects: { id: string; name: string; email: string; company: string; role: string | null; briefCount: number | null }[] = [];
  try {
    prospects = await db
      .select({
        id: signalBriefProspects.id,
        name: signalBriefProspects.name,
        email: signalBriefProspects.email,
        company: signalBriefProspects.company,
        role: signalBriefProspects.role,
        briefCount: signalBriefProspects.briefCount,
      })
      .from(signalBriefProspects)
      .where(eq(signalBriefProspects.isActive, true));
  } catch { return; }

  if (prospects.length === 0) return;

  const resend = new Resend(resendKey);
  const weekAgo = new Date(Date.now() - 7 * 24 * 3600_000);
  const dupWindow = new Date(Date.now() - BRIEF_DEDUP_HOURS * 3600_000);
  const platformUrl = getPlatformUrl();

  for (const detection of qualifying) {
    for (const prospect of prospects) {
      try {
        // Weekly cap check
        const weeklyBriefs = await db
          .select({ id: prospectBriefsSent.id })
          .from(prospectBriefsSent)
          .where(and(
            eq(prospectBriefsSent.prospectId, prospect.id),
            gte(prospectBriefsSent.sentAt, weekAgo)
          ));
        if (weeklyBriefs.length >= MAX_BRIEFS_PER_WEEK) continue;

        // 48-hour same-trigger dedup
        const recentSame = await db
          .select({ id: prospectBriefsSent.id })
          .from(prospectBriefsSent)
          .where(and(
            eq(prospectBriefsSent.prospectId, prospect.id),
            eq(prospectBriefsSent.triggerName, detection.triggerName),
            gte(prospectBriefsSent.sentAt, dupWindow)
          ))
          .limit(1);
        if (recentSame.length > 0) continue;

        const html = buildBriefEmail(prospect, detection, platformUrl);
        await resend.emails.send({
          from: 'Readiness OS Signals <signals@vaughnmartin.com>',
          replyTo: 'hello@vaughnmartin.com',
          to: prospect.email,
          subject: `${detection.triggerName} — a prepared organization is already executing`,
          html,
        });

        await db.insert(prospectBriefsSent).values({
          prospectId: prospect.id,
          triggerName: detection.triggerName,
          triggerDomain: detection.triggerDomain,
          playbookName: detection.recommendedPlaybook,
          confidenceScore: detection.confidenceScore,
        });

        await db
          .update(signalBriefProspects)
          .set({
            briefCount: sql`${signalBriefProspects.briefCount} + 1`,
            lastBriefAt: new Date(),
          })
          .where(eq(signalBriefProspects.id, prospect.id));

        console.log(`[SignalBrief] Sent → ${prospect.email} | ${detection.triggerName} (${detection.confidenceScore}%)`);
      } catch (err: any) {
        console.warn(`[SignalBrief] Send error (${prospect.email}):`, err.message);
      }
    }
  }
}

function getDomainNarrative(domain: string): {
  prepared: Array<{ min: string; action: string }>;
  traditional: Array<{ delay: string; action: string }>;
  brutalLine: string;
} {
  const d = (domain || '').toLowerCase();

  if (d.includes('cyber') || d.includes('ransom') || d.includes('breach') || d.includes('security')) {
    return {
      prepared: [
        { min: 'Min 0', action: 'Threat pattern confirmed across 248 sources' },
        { min: 'Min 2', action: 'Ransomware containment protocol staged — zero setup' },
        { min: 'Min 5', action: 'IT, security, legal, and comms briefed simultaneously' },
        { min: 'Min 9', action: 'Containment decision in executive inbox' },
        { min: 'Min 12', action: 'Executing — scope contained, narrative controlled' },
      ],
      traditional: [
        { delay: 'Hour 1', action: 'IT notices anomaly. Alerts go up the chain.' },
        { delay: 'Hour 4', action: '"Let\'s get the incident response team on a call."' },
        { delay: 'Day 1', action: 'Scope still unknown. Consultants engaged.' },
        { delay: 'Day 3', action: 'Executive still waiting on assessment.' },
        { delay: 'Week 1', action: 'Containment begins. Damage is done.' },
      ],
      brutalLine: 'In a ransomware event, the first 12 minutes determine whether you contain it or spend six months recovering from it.',
    };
  }

  if (d.includes('regulat') || d.includes('compliance') || d.includes('fda') || d.includes('sec') || d.includes('doj')) {
    return {
      prepared: [
        { min: 'Min 0', action: 'Regulatory signal confirmed — exposure pre-mapped' },
        { min: 'Min 2', action: 'Compliance response protocol staged automatically' },
        { min: 'Min 5', action: 'Legal, compliance, ops, and board liaison briefed' },
        { min: 'Min 9', action: 'Response strategy authorized by executive' },
        { min: 'Min 12', action: 'Filing in progress — narrative ahead of the cycle' },
      ],
      traditional: [
        { delay: 'Hour 2', action: 'Alert surfaces in someone\'s inbox.' },
        { delay: 'Hour 6', action: 'Legal team cc\'d on an email chain.' },
        { delay: 'Day 3', action: 'External counsel engaged. "What\'s our exposure?"' },
        { delay: 'Week 2', action: 'Response strategy still being drafted.' },
        { delay: 'Week 4', action: 'Filing submitted — regulators already set the narrative.' },
      ],
      brutalLine: 'Regulators move fast. The organizations that respond in hours instead of weeks are the ones that had the response staged before the signal fired.',
    };
  }

  if (d.includes('supply') || d.includes('geopol') || d.includes('logist') || d.includes('manufactur')) {
    return {
      prepared: [
        { min: 'Min 0', action: 'Disruption signal confirmed — impact pre-modeled' },
        { min: 'Min 2', action: 'Supply continuity protocol staged — alternates identified' },
        { min: 'Min 5', action: 'Ops, procurement, finance, and sales briefed' },
        { min: 'Min 9', action: 'Continuity decision authorized — production protected' },
        { min: 'Min 12', action: 'Alternate sourcing executing — no production loss' },
      ],
      traditional: [
        { delay: 'Day 1', action: 'Supplier sends disruption notification.' },
        { delay: 'Day 2', action: '"Do we have backup suppliers?" Nobody knows.' },
        { delay: 'Day 4', action: 'Procurement meeting called. Options being explored.' },
        { delay: 'Week 2', action: 'Alternate supplier identified. Negotiations begin.' },
        { delay: 'Week 4', action: 'Production already impacted. Customers notified.' },
      ],
      brutalLine: 'Supply chain disruptions don\'t wait for your next procurement meeting. The organization with pre-staged continuity plans never stops moving.',
    };
  }

  if (d.includes('financial') || d.includes('activist') || d.includes('investor') || d.includes('m&a') || d.includes('acqui')) {
    return {
      prepared: [
        { min: 'Min 0', action: 'Activist signal confirmed — stake pre-analyzed' },
        { min: 'Min 2', action: 'Investor response protocol staged — precedents loaded' },
        { min: 'Min 5', action: 'Board, legal, IR, and banking relationships briefed' },
        { min: 'Min 9', action: 'Response strategy authorized by executive' },
        { min: 'Min 12', action: 'Board-ready brief delivered — narrative controlled' },
      ],
      traditional: [
        { delay: 'Hour 4', action: 'SEC filing surfaces. "Get the board on a call."' },
        { delay: 'Day 2', action: 'Banker engaged. Defensive strategy "in development."' },
        { delay: 'Week 1', action: 'Board meeting scheduled. Deck being prepared.' },
        { delay: 'Week 3', action: 'Response strategy finalized.' },
        { delay: 'Week 4', action: 'Activist already set the narrative. Defense is reactive.' },
      ],
      brutalLine: 'Activist investors pick organizations that are unprepared. A pre-staged response brief changes the power dynamic before the first call.',
    };
  }

  return {
    prepared: [
      { min: 'Min 0', action: 'Signal confirmed across 248 continuous monitoring sources' },
      { min: 'Min 2', action: 'Readiness Protocol staged — zero setup, zero coordination' },
      { min: 'Min 5', action: 'All relevant stakeholders briefed with role-specific context' },
      { min: 'Min 9', action: 'Decision package delivered to the authorizing executive' },
      { min: 'Min 12', action: 'Executing — response ahead of the market' },
    ],
    traditional: [
      { delay: 'Hour 2', action: 'Someone notices the signal. Mentions it in a meeting.' },
      { delay: 'Day 1', action: '"We should get a call together on this."' },
      { delay: 'Week 1', action: 'First strategy session held. Deck assigned.' },
      { delay: 'Week 2', action: 'Stakeholder alignment still in progress.' },
      { delay: 'Week 4', action: 'Response begins. Competitors are three weeks ahead.' },
    ],
    brutalLine: 'The 30-day mobilization cycle isn\'t a speed problem. It\'s a preparation problem. Organizations that stage their responses before triggers fire never run that cycle.',
  };
}

function buildBriefEmail(
  prospect: { name: string; company: string; role: string | null },
  detection: DetectionBrief,
  platformUrl: string
): string {
  const firstName = prospect.name.split(' ')[0] || prospect.name;
  const protocol = detection.recommendedPlaybook || 'Readiness Protocol';
  const confidence = detection.confidenceScore;
  const narrative = getDomainNarrative(detection.triggerDomain);

  const preparedRows = narrative.prepared.map((row, i) => `
    <tr style="border-bottom:1px solid rgba(43,138,110,0.15);">
      <td style="padding:9px 14px;vertical-align:top;">
        <span style="font-family:'Courier New',Courier,monospace;font-size:8px;font-weight:700;letter-spacing:0.14em;color:${TEAL};display:block;margin-bottom:2px;">${row.min}</span>
        <span style="font-size:12px;font-weight:600;color:#111827;line-height:1.45;">${i < 4 ? '✓' : '→'}&nbsp; ${row.action}</span>
      </td>
    </tr>`).join('');

  const traditionalRows = narrative.traditional.map((row) => `
    <tr style="border-bottom:1px solid #F3F4F6;">
      <td style="padding:9px 14px;vertical-align:top;">
        <span style="font-family:'Courier New',Courier,monospace;font-size:8px;font-weight:700;letter-spacing:0.14em;color:#9CA3AF;display:block;margin-bottom:2px;">${row.delay}</span>
        <span style="font-size:12px;color:#6B7280;line-height:1.45;">${row.action}</span>
      </td>
    </tr>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Live Signal Brief — VaughnMartin Readiness OS</title>
</head>
<body style="margin:0;padding:0;background:#ECEAE3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
<tr><td align="center" style="padding:28px 16px;">
<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:620px;border-collapse:collapse;box-shadow:0 4px 32px rgba(10,15,46,0.18);">

  <!-- HEADER -->
  <tr><td style="background:${NAVY};padding:26px 36px 20px;">
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
      <tr>
        <td>
          <div style="font-family:'Courier New',Courier,monospace;font-size:8px;font-weight:700;letter-spacing:0.28em;text-transform:uppercase;color:rgba(201,168,76,0.7);margin-bottom:10px;">VaughnMartin · Readiness OS</div>
          <div style="font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:600;color:#ffffff;line-height:1.2;letter-spacing:-0.01em;">Live Signal Brief</div>
        </td>
        <td align="right" valign="middle">
          <div style="display:inline-block;">
            <span style="display:inline-block;width:7px;height:7px;background:#EF4444;border-radius:50%;vertical-align:middle;margin-right:6px;"></span>
            <span style="font-family:'Courier New',Courier,monospace;font-size:8px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:#EF4444;vertical-align:middle;">LIVE</span>
            <div style="margin-top:6px;font-family:'Courier New',Courier,monospace;font-size:8px;letter-spacing:0.14em;color:rgba(255,255,255,0.35);text-transform:uppercase;">${detection.triggerDomain}</div>
          </div>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- SIGNAL BAND -->
  <tr><td style="background:#1a2050;padding:20px 36px 18px;border-bottom:2px solid ${GOLD};">
    <div style="font-family:'Courier New',Courier,monospace;font-size:8px;font-weight:700;letter-spacing:0.26em;text-transform:uppercase;color:${GOLD};margin-bottom:8px;">Signal Confirmed · ${confidence}% Confidence</div>
    <div style="font-size:16px;font-weight:700;color:#ffffff;line-height:1.45;">${detection.signalDescription || detection.triggerName}</div>
  </td></tr>

  <!-- OPENING -->
  <tr><td style="background:#ffffff;padding:32px 36px 0;">
    <p style="margin:0 0 10px;font-size:15px;color:${NAVY};font-weight:700;line-height:1.4;">${firstName} —</p>
    <p style="margin:0 0 28px;font-size:14px;color:#374151;line-height:1.8;">
      By the time you read this, a prepared organization has already responded to this trigger. No meeting was called. No committee convened. Their response was staged before the signal fired.
    </p>
  </td></tr>

  <!-- CONTRAST TABLE HEADER -->
  <tr><td style="background:#ffffff;padding:0 36px 10px;">
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="width:50%;padding-right:5px;">
          <div style="background:${NAVY};padding:10px 14px;">
            <span style="font-family:'Courier New',Courier,monospace;font-size:8px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:${TEAL};">Prepared Organization</span>
          </div>
        </td>
        <td style="width:50%;padding-left:5px;">
          <div style="background:#F3F4F6;padding:10px 14px;">
            <span style="font-family:'Courier New',Courier,monospace;font-size:8px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:#9CA3AF;">Traditional Response</span>
          </div>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- CONTRAST TABLE BODY -->
  <tr><td style="background:#ffffff;padding:0 36px 28px;">
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="width:50%;padding-right:5px;vertical-align:top;">
          <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;border:1px solid rgba(43,138,110,0.3);border-top:3px solid ${TEAL};background:#F6FBF9;">
            ${preparedRows}
            <tr>
              <td style="padding:12px 14px;background:${TEAL};">
                <span style="font-family:'Courier New',Courier,monospace;font-size:8px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#ffffff;">Min 12 — Executing</span>
              </td>
            </tr>
          </table>
        </td>
        <td style="width:50%;padding-left:5px;vertical-align:top;">
          <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;border:1px solid #E5E7EB;border-top:3px solid #D1D5DB;background:#FAFAFA;">
            ${traditionalRows}
            <tr>
              <td style="padding:12px 14px;background:#E5E7EB;">
                <span style="font-family:'Courier New',Courier,monospace;font-size:8px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#6B7280;">Still mobilizing.</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- BRUTAL LINE -->
  <tr><td style="background:#ffffff;padding:0 36px 28px;">
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
      <tr><td style="border-left:3px solid ${GOLD};padding:14px 18px;background:#FDFBF6;">
        <p style="margin:0;font-size:13px;font-weight:600;color:${NAVY};line-height:1.7;font-style:italic;">${narrative.brutalLine}</p>
      </td></tr>
    </table>
  </td></tr>

  <!-- PROTOCOL CALLOUT -->
  <tr><td style="background:#ffffff;padding:0 36px 28px;">
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background:#F0F9F6;border:1px solid rgba(43,138,110,0.25);border-left:4px solid ${TEAL};">
      <tr><td style="padding:18px 22px;">
        <div style="font-family:'Courier New',Courier,monospace;font-size:8px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:${TEAL};margin-bottom:8px;">Protocol Pre-Staged · Ready to Activate</div>
        <div style="font-size:17px;font-weight:700;color:${NAVY};margin-bottom:6px;line-height:1.3;">${protocol}</div>
        <div style="font-size:11px;color:#6B7280;line-height:1.6;">No setup required &nbsp;·&nbsp; No coordination call &nbsp;·&nbsp; Executive authorization preserves the decision</div>
      </td></tr>
    </table>
  </td></tr>

  <!-- META PROOF -->
  <tr><td style="background:#F8F7F4;padding:24px 36px;border-top:1px solid #E8E4DC;">
    <p style="margin:0;font-size:12px;color:#4B5563;line-height:1.85;">
      Notice what didn't happen to send you this brief: no meeting was called, no analyst was tasked, no committee convened. The system detected the signal, staged the protocol, and briefed you — automatically.<br><br>
      <strong style="color:${NAVY};">That is the operating model. The question is whether it's working for your organization, or for your competitors.</strong>
    </p>
  </td></tr>

  <!-- CTAs -->
  <tr><td style="background:#ffffff;padding:28px 36px;">
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
      <tr>
        <td style="width:50%;padding-right:7px;">
          <a href="${platformUrl}/how-it-executes" style="display:block;text-align:center;background:${NAVY};color:#ffffff;text-decoration:none;padding:15px 16px;font-family:'Courier New',Courier,monospace;font-size:9px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">Watch the 12-Minute Execution →</a>
        </td>
        <td style="width:50%;padding-left:7px;">
          <a href="${platformUrl}/request-access" style="display:block;text-align:center;background:${GOLD};color:${NAVY};text-decoration:none;padding:15px 16px;font-family:'Courier New',Courier,monospace;font-size:9px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">Apply for Founding Partner Access →</a>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- FOOTER -->
  <tr><td style="background:${NAVY};padding:22px 36px;">
    <p style="margin:0 0 6px;font-size:10px;color:rgba(255,255,255,0.35);line-height:1.8;">
      Readiness OS monitors 248+ data points across regulatory, financial, geopolitical, and market sources — every 15 minutes, continuously. This brief was staged and sent automatically at the moment the signal crossed the confidence threshold.
    </p>
    <p style="margin:0;font-size:10px;color:rgba(255,255,255,0.25);line-height:1.6;">
      VaughnMartin · Readiness OS &nbsp;·&nbsp; <a href="${platformUrl}" style="color:${GOLD};text-decoration:none;">vaughnmartin.com</a>
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}
