import { Resend } from 'resend';
import crypto from 'crypto';
import { db } from '../db';
import { trialSessions } from '@shared/schema';
import { eq } from 'drizzle-orm';

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TRIAL_HOURS = 48;

const resend = new Resend(process.env.RESEND_API_KEY);

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

function buildTrialEmailHtml(data: {
  firstName: string; company: string;
}, activationUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>Your 48-Hour Trial Access — Readiness OS</title></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:${NAVY};padding:28px 40px;">
            <div style="color:${GOLD};font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:6px;">VAUGHNMARTIN · EXECUTION OS</div>
            <div style="color:#ffffff;font-size:20px;font-weight:700;">Your 48-Hour Trial Access Is Ready</div>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 8px;color:#111827;font-size:16px;font-weight:600;">Hi ${data.firstName},</p>
            <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.6;">
              You now have full access to the Readiness OS platform for the next <strong>48 hours</strong>. 
              Explore the complete platform — live trigger detection, 180 pre-staged playbooks, 
              Mission Control, and the full IDEA Framework in action.
            </p>
            <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
              <tr>
                <td style="background:${GOLD};border-radius:6px;">
                  <a href="${activationUrl}" style="display:inline-block;padding:16px 36px;color:${NAVY};font-size:15px;font-weight:700;text-decoration:none;letter-spacing:0.02em;">
                    Activate Your Trial Access →
                  </a>
                </td>
              </tr>
            </table>
            <p style="margin:0 0 8px;color:#6B7280;font-size:13px;">This link activates your 24-hour session. It expires if unused after 48 hours.</p>
            <p style="margin:0;color:#9CA3AF;font-size:11px;word-break:break-all;">${activationUrl}</p>
          </td>
        </tr>
        <tr>
          <td style="background:${NAVY};padding:20px 40px;">
            <p style="margin:0;color:rgba(255,255,255,0.5);font-size:11px;">
              After your trial, apply for the full Pilot Program at vaughnmartin.com/pilot-program<br/>
              Reserved for startup to Fortune 500 organizations meeting deployment requirements.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function createTrialSession(data: {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  title: string;
}): Promise<{ success: boolean; token?: string; emailSent?: boolean }> {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48h to click, 24h after activation

  await db.insert(trialSessions).values({
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    company: data.company,
    title: data.title,
    token,
    expiresAt,
  });

  const baseUrl = getBaseUrl();
  const activationUrl = `${baseUrl}/api/trial/activate?token=${token}`;

  let emailSent = false;
  try {
    const { error } = await resend.emails.send({
      from: 'Readiness OS <pilot@vaughnmartin.com>',
      to: data.email,
      subject: `Your 48-Hour Trial Access to Readiness OS`,
      html: buildTrialEmailHtml({ firstName: data.firstName, company: data.company }, activationUrl),
    });
    if (!error) emailSent = true;
    else console.warn(`⚠ Trial email failed: ${error.message}`);
  } catch (err: any) {
    console.warn(`⚠ Trial email threw: ${err.message}`);
  }

  // ── Notify platform admin ──────────────────────────────────────────────
  const adminEmail = process.env.PLATFORM_ADMIN_EMAIL;
  if (adminEmail) {
    try {
      const adminHtml = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;">
        <tr><td style="background:#0A0F2E;padding:24px 36px;">
          <div style="color:#C9A84C;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:4px;">VAUGHNMARTIN · READINESS OS</div>
          <div style="color:#ffffff;font-size:18px;font-weight:700;">New Trial Access Request</div>
        </td></tr>
        <tr><td style="height:3px;background:#C9A84C;"></td></tr>
        <tr><td style="padding:32px 36px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:13px;color:#6B7280;width:110px;">Name</td><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:14px;color:#111827;font-weight:600;">${data.firstName} ${data.lastName}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:13px;color:#6B7280;">Email</td><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:14px;color:#111827;">${data.email}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:13px;color:#6B7280;">Company</td><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:14px;color:#111827;">${data.company}</td></tr>
            <tr><td style="padding:8px 0;font-size:13px;color:#6B7280;">Title</td><td style="padding:8px 0;font-size:14px;color:#111827;">${data.title}</td></tr>
          </table>
          <p style="font-size:13px;color:#374151;margin:0 0 20px;">Their 48-hour trial link has been sent automatically. To grant full 72-hour access, use the Link Generator in your Admin Panel.</p>
          <a href="${getBaseUrl()}/admin/users" style="display:inline-block;background:#0A0F2E;color:#C9A84C;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;padding:12px 28px;text-decoration:none;">Open Admin Panel →</a>
        </td></tr>
        <tr><td style="background:#0A0F2E;padding:16px 36px;">
          <p style="margin:0;color:rgba(255,255,255,0.35);font-size:11px;">VaughnMartin · Readiness OS — platform admin notification</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
      await resend.emails.send({
        from: 'Readiness OS <pilot@vaughnmartin.com>',
        to: adminEmail,
        subject: `New Trial Request — ${data.firstName} ${data.lastName} (${data.company})`,
        html: adminHtml,
      });
    } catch (err: any) {
      console.warn(`⚠ Admin notification email failed: ${err.message}`);
    }
  }

  console.log(`✓ Trial session created for ${data.email} | Activation: ${activationUrl}`);
  return { success: true, token, emailSent };
}

export async function activateTrialToken(token: string): Promise<{
  valid: boolean;
  data?: { email: string; firstName: string; lastName: string; company: string; title: string; expiresAt: Date };
  reason?: string;
}> {
  const rows = await db.select().from(trialSessions).where(eq(trialSessions.token, token)).limit(1);
  if (!rows.length) return { valid: false, reason: 'not_found' };

  const row = rows[0];
  if (new Date() > row.expiresAt) return { valid: false, reason: 'expired' };

  // Set activatedAt and extend expiry to 24h from NOW
  const trialExpiresAt = new Date(Date.now() + TRIAL_HOURS * 60 * 60 * 1000);
  await db.update(trialSessions)
    .set({ activatedAt: new Date(), expiresAt: trialExpiresAt })
    .where(eq(trialSessions.token, token));

  return {
    valid: true,
    data: {
      email: row.email,
      firstName: row.firstName,
      lastName: row.lastName,
      company: row.company,
      title: row.title,
      expiresAt: trialExpiresAt,
    },
  };
}

export async function getTrialSession(token: string): Promise<TrialSessionStatus | null> {
  const rows = await db.select().from(trialSessions).where(eq(trialSessions.token, token)).limit(1);
  if (!rows.length) return null;
  const row = rows[0];
  if (!row.activatedAt) return null;
  if (new Date() > row.expiresAt) return null;
  return {
    email: row.email,
    firstName: row.firstName,
    lastName: row.lastName,
    company: row.company,
    expiresAt: row.expiresAt,
  };
}

export interface TrialSessionStatus {
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  expiresAt: Date;
}
