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
          subject: `Signal Detected: ${detection.triggerName} — Protocol Pre-Staged`,
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

function buildBriefEmail(
  prospect: { name: string; company: string; role: string | null },
  detection: DetectionBrief,
  platformUrl: string
): string {
  const firstName = prospect.name.split(' ')[0] || prospect.name;
  const protocol = detection.recommendedPlaybook || 'Readiness Protocol';
  const confidence = detection.confidenceScore;

  const steps = [
    {
      min: '0–2',
      label: 'Signal confirmed',
      detail: 'System verifies signal across multiple sources. Protocol staged automatically.',
    },
    {
      min: '2–6',
      label: 'Stakeholders notified',
      detail: 'Pre-mapped contacts receive role-specific briefs. No coordination calls needed.',
    },
    {
      min: '6–12',
      label: 'Executive authorization',
      detail: 'Decision package lands in the executive inbox. One approval to execute.',
    },
  ];

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Signal Brief — VaughnMartin Readiness OS</title>
</head>
<body style="margin:0;padding:0;background:#F0EDE4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;border-collapse:collapse;box-shadow:0 2px 24px rgba(10,15,46,0.12);">

  <!-- HEADER -->
  <tr><td style="background:${NAVY};padding:28px 36px 22px;">
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
      <tr>
        <td>
          <div style="font-family:'Courier New',Courier,monospace;font-size:9px;font-weight:700;letter-spacing:0.26em;text-transform:uppercase;color:${GOLD};margin-bottom:8px;">VaughnMartin · Readiness OS</div>
          <div style="font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:600;color:#ffffff;line-height:1.2;">Prospect Signal Brief</div>
        </td>
        <td align="right" valign="top">
          <div style="background:rgba(201,168,76,0.15);border:1px solid ${GOLD};display:inline-block;padding:5px 14px;">
            <span style="font-family:'Courier New',Courier,monospace;font-size:9px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:${GOLD};">${detection.triggerDomain}</span>
          </div>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- SIGNAL ALERT BAND -->
  <tr><td style="background:#FFF8E8;border-left:5px solid ${GOLD};padding:16px 32px;">
    <div style="font-size:9px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:${GOLD};margin-bottom:5px;">Signal Detected — ${confidence}% Confidence</div>
    <div style="font-size:14px;font-weight:600;color:${NAVY};line-height:1.55;">${detection.signalDescription || detection.triggerName}</div>
  </td></tr>

  <!-- BODY -->
  <tr><td style="background:#ffffff;padding:36px 36px 28px;">

    <p style="margin:0 0 18px;font-size:15px;color:${NAVY};font-weight:600;line-height:1.5;">${firstName},</p>
    <p style="margin:0 0 24px;font-size:14px;color:#374151;line-height:1.75;">
      While ${prospect.company} runs normal operations, Readiness OS continuous monitoring detected a signal that historically precedes a coordinated organizational response. The protocol below was pre-staged automatically. No calls were scheduled. No committees convened.
    </p>

    <!-- PROTOCOL CALLOUT -->
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background:#F8F7F4;border:1px solid #E8E4DC;border-left:4px solid ${TEAL};margin-bottom:30px;">
      <tr><td style="padding:18px 22px;">
        <div style="font-size:9px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:${TEAL};margin-bottom:7px;">Protocol Pre-Staged</div>
        <div style="font-size:18px;font-weight:700;color:${NAVY};margin-bottom:6px;">${protocol}</div>
        <div style="font-size:11px;color:#6B7280;line-height:1.5;">Ready to activate · No setup required · Executive authorization preserves the decision</div>
      </td></tr>
    </table>

    <!-- 12-MINUTE PREVIEW HEADER -->
    <div style="font-size:9px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:${GOLD};margin-bottom:16px;">What the First 12 Minutes Look Like</div>

    <!-- STEPS -->
    ${steps.map((s, i) => {
      const bg = i === 0 ? GOLD : i === 1 ? TEAL : NAVY;
      return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:14px;">
      <tr>
        <td style="width:44px;vertical-align:top;padding-top:2px;">
          <div style="width:36px;height:36px;background:${bg};border-radius:50%;text-align:center;line-height:36px;">
            <span style="font-size:14px;font-weight:800;color:#ffffff;">${i + 1}</span>
          </div>
        </td>
        <td style="vertical-align:top;">
          <div style="font-size:9px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#9CA3AF;margin-bottom:3px;">Min ${s.min}</div>
          <div style="font-size:13px;font-weight:700;color:${NAVY};margin-bottom:3px;">${s.label}</div>
          <div style="font-size:12px;color:#6B7280;line-height:1.55;">${s.detail}</div>
        </td>
      </tr>
    </table>`;
    }).join('')}

    <!-- CONTEXT RULE -->
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:24px 0 28px;">
      <tr><td style="border-top:1px solid #E8E4DC;padding-top:22px;">
        <p style="margin:0;font-size:12px;color:#6B7280;line-height:1.7;">
          This is what a 3,600× execution head start looks like in practice. Thirty days of mobilization — figuring out who's in the room, aligning stakeholders, agreeing on a plan — compressed to 12 minutes. The response was ready before the trigger fired.
        </p>
      </td></tr>
    </table>

    <!-- CTAs -->
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
      <tr>
        <td style="width:50%;padding-right:6px;">
          <a href="${platformUrl}/how-it-executes" style="display:block;text-align:center;background:${NAVY};color:#ffffff;text-decoration:none;padding:14px 16px;font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;">See It Execute →</a>
        </td>
        <td style="width:50%;padding-left:6px;">
          <a href="${platformUrl}/founding-partner-program" style="display:block;text-align:center;background:${GOLD};color:${NAVY};text-decoration:none;padding:14px 16px;font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;">Apply for Founding Partner Access →</a>
        </td>
      </tr>
    </table>

  </td></tr>

  <!-- FOOTER -->
  <tr><td style="background:${NAVY};padding:22px 36px;">
    <p style="margin:0;font-size:10px;color:rgba(255,255,255,0.4);line-height:1.7;">
      This brief was generated automatically by Readiness OS continuous monitoring — scanning 248+ data points across regulatory, financial, geopolitical, and market intelligence sources every 15 minutes.<br><br>
      VaughnMartin · Readiness OS · <a href="${platformUrl}" style="color:${GOLD};text-decoration:none;">vaughnmartin.com</a>
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}
