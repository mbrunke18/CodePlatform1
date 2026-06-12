import { Resend } from 'resend';
import crypto from 'crypto';
import { db } from '../db';
import { magicLinkTokens } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { enrollProspectForAlerts } from './prospectEnrollment.js';

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TOKEN_TTL_HOURS = 24;

function generateToken(): string {
  return crypto.randomBytes(48).toString('hex');
}

function getBaseUrl(): string {
  if (process.env.REPLIT_DOMAINS) {
    const domains = process.env.REPLIT_DOMAINS.split(',');
    const prod = domains.find(d => d.includes('vaughnmartin')) || domains[0];
    return `https://${prod.trim()}`;
  }
  return 'http://localhost:5000';
}

const ADMIN_EMAIL = 'pilot@vaughnmartin.com';

function buildAdminNotificationHtml(data: {
  firstName: string; lastName: string; email: string; company: string; title: string;
}, magicUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>New Access Request — Readiness OS</title></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:${NAVY};padding:28px 40px;">
            <div style="color:${GOLD};font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:6px;">VAUGHNMARTIN · EXECUTION OS</div>
            <div style="color:#ffffff;font-size:18px;font-weight:700;">New Access Request</div>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 20px;color:#111827;font-size:16px;font-weight:700;">Someone just requested Founding Partner Access:</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:6px;margin-bottom:28px;">
              <tr><td style="padding:16px 20px;border-bottom:1px solid #E5E7EB;">
                <span style="color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Name</span><br/>
                <span style="color:#111827;font-size:15px;font-weight:600;">${data.firstName} ${data.lastName}</span>
              </td></tr>
              <tr><td style="padding:16px 20px;border-bottom:1px solid #E5E7EB;">
                <span style="color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Company &amp; Title</span><br/>
                <span style="color:#111827;font-size:15px;font-weight:600;">${data.title} · ${data.company}</span>
              </td></tr>
              <tr><td style="padding:16px 20px;">
                <span style="color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Email</span><br/>
                <a href="mailto:${data.email}" style="color:${GOLD};font-size:15px;font-weight:600;text-decoration:none;">${data.email}</a>
              </td></tr>
            </table>
            <p style="margin:0 0 16px;color:#374151;font-size:14px;">Their magic link (expires 24h):</p>
            <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
              <tr>
                <td style="background:${GOLD};border-radius:6px;">
                  <a href="${magicUrl}" style="display:inline-block;padding:14px 32px;color:${NAVY};font-size:14px;font-weight:700;text-decoration:none;">
                    Send This Link to ${data.firstName} →
                  </a>
                </td>
              </tr>
            </table>
            <p style="margin:0;color:#6B7280;font-size:12px;word-break:break-all;">${magicUrl}</p>
          </td>
        </tr>
        <tr>
          <td style="background:#F9FAFB;padding:20px 40px;border-top:1px solid #E5E7EB;">
            <p style="margin:0;color:#9CA3AF;font-size:12px;">VaughnMartin · Readiness OS · <a href="https://vaughnmartin.com" style="color:#9CA3AF;">vaughnmartin.com</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildEmailHtml(firstName: string, magicUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Your Executive Access — Readiness OS</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:${NAVY};padding:36px 48px 28px;">
            <div style="color:${GOLD};font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:8px;">VAUGHNMARTIN</div>
            <div style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.3px;">Readiness OS</div>
            <div style="color:rgba(255,255,255,0.55);font-size:12px;margin-top:4px;letter-spacing:1px;text-transform:uppercase;">Strategic Readiness Platform</div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:48px 48px 36px;">
            <p style="margin:0 0 8px;color:${NAVY};font-size:18px;font-weight:700;">Hello, ${firstName}.</p>
            <p style="margin:0 0 28px;color:#4B5563;font-size:15px;line-height:1.6;">
              Your access to <strong>Readiness OS</strong> is ready. This link gives you a full executive view of the platform — prepared responses, trigger intelligence, and the 12-minute execution model.
            </p>

            <!-- CTA Button -->
            <table cellpadding="0" cellspacing="0" style="margin:0 0 36px;">
              <tr>
                <td style="background:${GOLD};border-radius:6px;">
                  <a href="${magicUrl}"
                     style="display:inline-block;padding:16px 40px;color:${NAVY};font-size:15px;font-weight:700;text-decoration:none;letter-spacing:0.3px;">
                    Access the Platform →
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 6px;color:#6B7280;font-size:13px;">This link expires in <strong>24 hours</strong> and can only be used once.</p>
            <p style="margin:0 0 28px;color:#6B7280;font-size:13px;">If you didn't request this, you can safely ignore this email.</p>

            <hr style="border:none;border-top:1px solid #E5E7EB;margin:0 0 28px;" />

            <!-- Value reminder -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="33%" style="text-align:center;padding:0 12px;">
                  <div style="color:${GOLD};font-size:20px;font-weight:800;">12 min</div>
                  <div style="color:#6B7280;font-size:11px;margin-top:4px;letter-spacing:0.5px;">Trigger to Execution</div>
                </td>
                <td width="33%" style="text-align:center;padding:0 12px;border-left:1px solid #E5E7EB;border-right:1px solid #E5E7EB;">
                  <div style="color:${GOLD};font-size:20px;font-weight:800;">180</div>
                  <div style="color:#6B7280;font-size:11px;margin-top:4px;letter-spacing:0.5px;">Pre-Staged Readiness Protocols</div>
                </td>
                <td width="33%" style="text-align:center;padding:0 12px;">
                  <div style="color:${GOLD};font-size:20px;font-weight:800;">3,600×</div>
                  <div style="color:#6B7280;font-size:11px;margin-top:4px;letter-spacing:0.5px;">Execution Head Start</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#F9FAFB;padding:24px 48px;border-top:1px solid #E5E7EB;">
            <p style="margin:0;color:#9CA3AF;font-size:12px;line-height:1.6;">
              VaughnMartin · Readiness OS · <a href="https://vaughnmartin.com" style="color:#9CA3AF;">vaughnmartin.com</a><br/>
              Questions? Reply to this email or contact <a href="mailto:pilot@vaughnmartin.com" style="color:#9CA3AF;">pilot@vaughnmartin.com</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function createAndSendMagicLink(data: {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  title: string;
}): Promise<{ success: boolean; error?: string; emailSent?: boolean }> {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + TOKEN_TTL_HOURS * 60 * 60 * 1000);

  await db.insert(magicLinkTokens).values({
    ...data,
    token,
    expiresAt,
  });

  // Enroll prospect immediately so the next trigger alert reaches them.
  // This fires and forgets — request access flow is never blocked by it.
  enrollProspectForAlerts({
    email: data.email,
    name: `${data.firstName} ${data.lastName}`.trim(),
    role: data.title,
    company: data.company,
  }).catch(err => console.warn('[magicLink] Prospect enrollment non-fatal error:', err?.message));

  const baseUrl = getBaseUrl();
  const magicUrl = `${baseUrl}/magic-login?token=${token}`;

  // Always log the URL so admins can manually send if email fails
  console.log(`\n${'─'.repeat(70)}`);
  console.log(`📬 MAGIC LINK REQUEST — ${data.firstName} ${data.lastName} <${data.email}>`);
  console.log(`   Company: ${data.company} | Title: ${data.title}`);
  console.log(`   Access URL: ${magicUrl}`);
  console.log(`${'─'.repeat(70)}\n`);

  const apiKey = process.env.RESEND_API_KEY || process.env.Resend_API_Key;
  if (!apiKey) {
    console.log(`ℹ RESEND_API_KEY not set — email delivery skipped. Use the URL above.`);
    return { success: true, emailSent: false };
  }

  const resend = new Resend(apiKey);

  // ── Send magic link to the prospect ──────────────────────────────────────
  // vaughnmartin.com is verified in Resend — use pilot@ as primary sender.
  const fromAddresses = [
    'Readiness OS <pilot@vaughnmartin.com>',
    'Readiness OS <onboarding@resend.dev>',
  ];

  let emailSent = false;
  for (const from of fromAddresses) {
    try {
      const { data: emailData, error: emailError } = await resend.emails.send({
        from,
        replyTo: ADMIN_EMAIL,
        to: data.email,
        subject: `Your Executive Access to Readiness OS, ${data.firstName}`,
        html: buildEmailHtml(data.firstName, magicUrl),
      });

      if (emailError) {
        console.warn(`⚠ Sender ${from} rejected (${emailError.message}) — trying next`);
        continue;
      }

      console.log(`✓ Magic link sent to ${data.email} via ${from} | Resend ID: ${emailData?.id}`);
      emailSent = true;
      break;
    } catch (err: any) {
      console.warn(`⚠ Sender ${from} threw: ${err.message} — trying next`);
    }
  }

  if (!emailSent) {
    console.log(`⚠ All senders failed. Token saved — use admin URL above to send manually.`);
  }

  // ── Send admin notification to pilot ─────────────────────────────────────
  try {
    const { data: adminData, error: adminError } = await resend.emails.send({
      from: 'Readiness OS <pilot@vaughnmartin.com>',
      replyTo: data.email,
      to: ADMIN_EMAIL,
      subject: `New Access Request — ${data.firstName} ${data.lastName} · ${data.company}`,
      html: buildAdminNotificationHtml(data, magicUrl),
    });

    if (adminError) {
      console.warn(`⚠ Admin notification failed: ${adminError.message}`);
    } else {
      console.log(`✓ Admin notification sent to ${ADMIN_EMAIL} | Resend ID: ${adminData?.id}`);
    }
  } catch (err: any) {
    console.warn(`⚠ Admin notification threw: ${err.message}`);
  }

  return { success: true, emailSent };
}

export async function sendWelcomeTriggerDemo(email: string, firstName: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY || process.env.Resend_API_Key;
  if (!apiKey) return;

  const platformUrl = 'https://vaughnmartin.com';
  const unsubToken = Buffer.from(email).toString('base64url');
  const unsubUrl = `${platformUrl}/api/unsubscribe?t=${unsubToken}`;

  const html = `
    <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background:#f8f7f4;padding:40px 0;">
      <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e8e4dc;">
        <div style="background:#132558;padding:32px 36px;">
          <div style="color:#C9A84C;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Readiness OS · Live Detection Alert</div>
          <div style="color:#ffffff;font-size:22px;font-weight:700;line-height:1.3;">Strategic Trigger Detected</div>
        </div>
        <div style="padding:32px 36px;">
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#666;font-size:13px;width:40%;">Trigger</td>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#0A0F2E;font-size:13px;font-weight:600;">AI Competitive Disruption</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#666;font-size:13px;">Domain</td>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#0A0F2E;font-size:13px;">Technology &amp; Innovation</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#666;font-size:13px;">Confidence</td>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#2B8A6E;font-size:13px;font-weight:700;">94%</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#666;font-size:13px;">Signal Source</td>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;font-size:13px;"><a href="https://www.cnbc.com/technology/" style="color:#C9A84C;">CNBC Technology</a></td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#666;font-size:13px;">Primary Recommendation</td>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;font-size:13px;">
                <span style="color:#0A0F2E;font-weight:700;">AI Competitive Disruption Response</span>
                <span style="display:inline-block;margin-left:6px;background:#2B8A6E20;color:#2B8A6E;font-size:9px;font-weight:700;padding:2px 6px;letter-spacing:0.1em;text-transform:uppercase;">AI Recommended</span>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#666;font-size:13px;">Also Consider</td>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;font-size:13px;color:#6B7280;">
                Aggressive Pricing Disruption &nbsp;·&nbsp; Digital Transformation Acceleration
              </td>
            </tr>
          </table>
          <div style="background:#0A0F2E08;border:1px solid #0A0F2E18;border-radius:6px;padding:16px 20px;margin-bottom:20px;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
              <div style="color:#0A0F2E;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;">Why This Trigger Fired</div>
              <span style="background:#2B8A6E;color:#fff;font-size:9px;font-weight:700;padding:3px 8px;border-radius:3px;letter-spacing:0.5px;">5 of 6 KEYWORDS MATCHED</span>
            </div>
            <div style="margin-bottom:14px;">
              <div style="font-size:10px;color:#666;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Matched terms in source signal</div>
              <div style="display:flex;flex-wrap:wrap;gap:6px;">
                ${['AI disruption', 'market share', 'competitive threat', 'automation', 'enterprise'].map(kw => `<span style="display:inline-block;background:#2B8A6E15;border:1px solid #2B8A6E40;color:#1a6b52;font-size:12px;font-weight:600;padding:4px 10px;border-radius:4px;">${kw}</span>`).join('')}
              </div>
            </div>
            <div style="padding:10px 14px;background:#fff;border-radius:4px;border-left:3px solid #0A0F2E30;">
              <div style="font-size:10px;color:#666;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Pattern matched</div>
              <div style="font-size:12px;color:#0A0F2E;font-weight:600;">AI Competitive Disruption — Technology &amp; Innovation domain · 94% confidence</div>
            </div>
          </div>
          <div style="background:#f0ede4;border-left:3px solid #C9A84C;padding:16px 20px;border-radius:4px;margin-bottom:28px;">
            <div style="color:#666;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Source Signal</div>
            <div style="color:#0A0F2E;font-size:14px;line-height:1.5;">Major enterprises are accelerating AI adoption across core operations — pricing automation, customer intelligence, and supply chain — creating structural competitive gaps between early movers and laggards that widen each quarter.</div>
          </div>
          <div style="text-align:center;margin-bottom:12px;">
            <a href="${platformUrl}/live-detection-feed?trigger=AI%20Competitive%20Disruption" style="display:inline-block;background:#132558;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:14px;font-weight:600;letter-spacing:0.5px;margin-bottom:12px;">Review Live Detection →</a>
          </div>
          <div style="text-align:center;">
            <a href="${platformUrl}/live-activation-center?playbookName=AI%20Competitive%20Disruption%20Response&domain=Technology%20%26%20Security" style="display:inline-block;background:#C9A84C;color:#0A0F2E;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:14px;font-weight:700;letter-spacing:0.5px;">Activate: AI Competitive Disruption Response →</a>
          </div>
        </div>
        <div style="background:#f8f7f4;padding:20px 36px;border-top:1px solid #e8e4dc;">
          <div style="color:#999;font-size:11px;text-align:center;">Readiness OS continuously monitors 248+ signals across 9 domains. This alert was generated automatically — no human reviewed it before it reached you.</div>
          <div style="text-align:center;margin-top:10px;"><a href="${unsubUrl}" style="color:#ccc;font-size:10px;text-decoration:underline;">Unsubscribe from Readiness OS alerts</a></div>
        </div>
      </div>
    </div>
  `;

  const resend = new Resend(apiKey);
  // Try pilot@vaughnmartin.com first — verified domain, reliable for external recipients
  const fromAddresses = [
    'Readiness OS <pilot@vaughnmartin.com>',
    'Readiness OS <onboarding@resend.dev>',
  ];

  for (const from of fromAddresses) {
    try {
      const { error } = await resend.emails.send({
        from,
        replyTo: ADMIN_EMAIL,
        to: email,
        subject: `🔴 Trigger Detected: AI Competitive Disruption (94% confidence)`,
        html,
      });
      if (error) {
        console.warn(`[WelcomeTrigger] Sender ${from} rejected: ${error.message}`);
        continue;
      }
      console.log(`✅ [WelcomeTrigger] Trigger demo alert sent to ${email} via ${from}`);
      return;
    } catch (err: any) {
      console.warn(`[WelcomeTrigger] Sender ${from} threw: ${err.message}`);
    }
  }
  console.warn(`[WelcomeTrigger] All senders failed for ${email}`);
}

export async function validateMagicLinkToken(token: string): Promise<{
  valid: boolean;
  data?: { email: string; firstName: string; lastName: string; company: string; title: string };
  reason?: string;
}> {
  const rows = await db.select().from(magicLinkTokens).where(eq(magicLinkTokens.token, token)).limit(1);
  if (!rows.length) return { valid: false, reason: 'not_found' };
  const row = rows[0];
  if (row.usedAt) return { valid: false, reason: 'already_used' };
  if (new Date() > row.expiresAt) return { valid: false, reason: 'expired' };
  return {
    valid: true,
    data: {
      email: row.email,
      firstName: row.firstName,
      lastName: row.lastName,
      company: row.company,
      title: row.title,
    },
  };
}

export async function verifyMagicLinkToken(token: string): Promise<{
  valid: boolean;
  data?: { email: string; firstName: string; lastName: string; company: string; title: string };
  reason?: string;
}> {
  const rows = await db.select().from(magicLinkTokens).where(eq(magicLinkTokens.token, token)).limit(1);
  if (!rows.length) return { valid: false, reason: 'not_found' };

  const row = rows[0];
  if (row.usedAt) return { valid: false, reason: 'already_used' };
  if (new Date() > row.expiresAt) return { valid: false, reason: 'expired' };

  await db.update(magicLinkTokens)
    .set({ usedAt: new Date() })
    .where(eq(magicLinkTokens.token, token));

  return {
    valid: true,
    data: {
      email: row.email,
      firstName: row.firstName,
      lastName: row.lastName,
      company: row.company,
      title: row.title,
    },
  };
}
