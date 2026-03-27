import { Resend } from 'resend';
import crypto from 'crypto';
import { db } from '../db';
import { magicLinkTokens } from '@shared/schema';
import { eq } from 'drizzle-orm';

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

function buildEmailHtml(firstName: string, magicUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Your Executive Access — Execution OS</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:${NAVY};padding:36px 48px 28px;">
            <div style="color:${GOLD};font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:8px;">VAUGHNMARTIN</div>
            <div style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.3px;">Execution OS</div>
            <div style="color:rgba(255,255,255,0.55);font-size:12px;margin-top:4px;letter-spacing:1px;text-transform:uppercase;">Strategic Execution Platform</div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:48px 48px 36px;">
            <p style="margin:0 0 8px;color:${NAVY};font-size:18px;font-weight:700;">Hello, ${firstName}.</p>
            <p style="margin:0 0 28px;color:#4B5563;font-size:15px;line-height:1.6;">
              Your access to <strong>Execution OS</strong> is ready. This link gives you a full executive view of the platform — playbooks, trigger intelligence, and the 12-minute execution model.
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
                  <div style="color:${GOLD};font-size:20px;font-weight:800;">170</div>
                  <div style="color:#6B7280;font-size:11px;margin-top:4px;letter-spacing:0.5px;">Pre-Staged Playbooks</div>
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
              VaughnMartin · Execution OS · <a href="https://vaughnmartin.com" style="color:#9CA3AF;">vaughnmartin.com</a><br/>
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
}): Promise<{ success: boolean; error?: string }> {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + TOKEN_TTL_HOURS * 60 * 60 * 1000);

  await db.insert(magicLinkTokens).values({
    ...data,
    token,
    expiresAt,
  });

  const baseUrl = getBaseUrl();
  const magicUrl = `${baseUrl}/magic-login?token=${token}`;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`[MAGIC LINK SIMULATED] To: ${data.email} | URL: ${magicUrl}`);
    return { success: true };
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: 'Execution OS <pilot@vaughnmartin.com>',
      to: data.email,
      subject: `Your Executive Access to Execution OS, ${data.firstName}`,
      html: buildEmailHtml(data.firstName, magicUrl),
    });
    console.log(`✓ Magic link sent to ${data.email}`);
    return { success: true };
  } catch (err: any) {
    console.error('Magic link email error:', err);
    return { success: false, error: err.message };
  }
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
