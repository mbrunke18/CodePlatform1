import type { Express } from "express";
import { db } from "../db";
import { storage } from "../storage";
import { eq, desc, count } from "drizzle-orm";
import { foundingPartnerApplications, users } from "@shared/schema";
import {
  createAndSendMagicLink,
  verifyMagicLinkToken,
  sendWelcomeTriggerDemo,
} from "../services/magicLinkService";
import { createTrialSession, activateTrialToken } from "../services/trialAccessService";

// ─────────────────────────────────────────────────────────────────────────────
// Magic Link Auth · Founding Partner Program · 24-Hour Trial Access
//
// Routes:
//   GET  /api/unsubscribe
//   POST /api/auth/magic-link/request
//   GET  /api/auth/magic-link/validate
//   POST /api/auth/magic-link/verify
//   POST /api/founding-partner/apply
//   GET  /api/founding-partner/stats
//   GET  /api/founding-partner/applications              (platform admin)
//   PATCH /api/founding-partner/applications/:id/status (platform admin)
//   POST /api/trial/request
//   GET  /api/trial/activate
//   GET  /api/trial/status
// ─────────────────────────────────────────────────────────────────────────────

export function registerMagicLinkRoutes(app: Express) {
  // ─── Public unsubscribe (no auth — must work from email client) ──────────
  app.get('/api/unsubscribe', async (req, res) => {
    const t = req.query.t as string;
    if (!t) {
      return res.status(400).send(`<html><body style="font-family:sans-serif;padding:40px;text-align:center;"><h2>Invalid unsubscribe link</h2><p>The link appears to be missing a required parameter.</p></body></html>`);
    }
    try {
      let email: string;
      try { email = Buffer.from(t, 'base64url').toString('utf8'); }
      catch { return res.status(400).send(`<html><body style="font-family:sans-serif;padding:40px;text-align:center;"><h2>Invalid unsubscribe token</h2></body></html>`); }

      const { stakeholderContacts: scTable } = await import('@shared/schema');
      const result = await db.update(scTable)
        .set({ isActive: false })
        .where(eq(scTable.email, email));

      console.log(`📭 Unsubscribed: ${email}`);
      return res.send(`
        <html>
          <head><title>Unsubscribed — Readiness OS</title></head>
          <body style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background:#f8f7f4;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;">
            <div style="max-width:480px;background:#fff;border-radius:8px;border:1px solid #e8e4dc;padding:48px 40px;text-align:center;">
              <div style="width:48px;height:48px;background:#2B8A6E15;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2B8A6E" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#C9A84C;margin-bottom:12px;">Readiness OS</div>
              <h1 style="font-size:22px;font-weight:700;color:#0A0F2E;margin:0 0 12px;">You've been unsubscribed</h1>
              <p style="font-size:14px;color:#666;line-height:1.6;margin:0 0 24px;">
                <strong>${email}</strong> will no longer receive trigger alerts, compound threat notifications, or weekly digests.
              </p>
              <p style="font-size:13px;color:#999;line-height:1.6;">
                Changed your mind? Contact <a href="mailto:pilot@vaughnmartin.com" style="color:#C9A84C;">pilot@vaughnmartin.com</a> to re-enable alerts, or update your preferences inside the platform under Stakeholder Management.
              </p>
            </div>
          </body>
        </html>
      `);
    } catch (err: any) {
      console.error('Unsubscribe error:', err.message);
      return res.status(500).send(`<html><body style="font-family:sans-serif;padding:40px;text-align:center;"><h2>Something went wrong</h2><p>Please contact pilot@vaughnmartin.com to be removed from alerts.</p></body></html>`);
    }
  });

  // ── Magic Link Authentication ─────────────────────────────────────────────
  app.post('/api/auth/magic-link/request', async (req, res) => {
    const { firstName, lastName, email, company, title } = req.body;
    if (!firstName || !lastName || !email || !company || !title) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address.' });
    }
    const result = await createAndSendMagicLink({ firstName, lastName, email, company, title });
    if (!result.success) {
      return res.status(500).json({ error: 'Failed to process your request. Please try again.' });
    }

    // Enroll in signal brief pipeline — next qualifying trigger will reach this prospect
    // Also fire the immediate welcome email while intent is at its peak
    import('../services/prospectEnrollment.js').then(({ enrollProspectForAlerts, sendRequestAccessWelcome }) => {
      enrollProspectForAlerts({
        email,
        name: `${firstName} ${lastName}`.trim(),
        role: title,
        company,
      }).catch(err => console.warn('[RequestAccess] Prospect enrollment non-fatal:', err?.message));

      sendRequestAccessWelcome({
        firstName,
        lastName,
        email,
        company,
        role: title,
      }).catch(err => console.warn('[RequestAccess] Welcome email non-fatal:', err?.message));
    }).catch(() => {});

    return res.json({ ok: true, emailSent: (result as any).emailSent ?? true });
  });

  // ─── Founding Partner Application ─────────────────────────────────────────
  app.post('/api/founding-partner/apply', async (req, res) => {
    const { firstName, lastName, email, company, title, triggerDomain, message } = req.body;
    if (!firstName || !lastName || !email || !company || !title) {
      return res.status(400).json({ error: 'All required fields must be completed.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid work email.' });
    }
    try {
      const [application] = await db.insert(foundingPartnerApplications).values({
        firstName, lastName, email, company, title,
        triggerDomain: triggerDomain || '',
        message: message || '',
      }).returning();

      // ── Notify platform admin of new Founding Partner application ────────
      const apiKey = process.env.RESEND_API_KEY || process.env.Resend_API_Key;
      if (apiKey) {
        try {
          const { Resend } = await import('resend');
          const resend = new Resend(apiKey);
          const NAVY = '#0A0F2E';
          const GOLD = '#C9A84C';
          const adminHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>New Founding Partner Application — Readiness OS</title></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:${NAVY};padding:28px 40px;">
            <div style="color:${GOLD};font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:6px;">VAUGHNMARTIN · READINESS OS</div>
            <div style="color:#ffffff;font-size:20px;font-weight:700;">New Founding Partner Application</div>
          </td>
        </tr>
        <tr><td style="height:3px;background:${GOLD};"></td></tr>
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 20px;color:#111827;font-size:15px;font-weight:700;">A new Founding Partner application has been submitted:</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:6px;margin-bottom:28px;">
              <tr><td style="padding:14px 20px;border-bottom:1px solid #E5E7EB;">
                <span style="color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Name</span><br/>
                <span style="color:#111827;font-size:15px;font-weight:600;">${firstName} ${lastName}</span>
              </td></tr>
              <tr><td style="padding:14px 20px;border-bottom:1px solid #E5E7EB;">
                <span style="color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Title &amp; Company</span><br/>
                <span style="color:#111827;font-size:15px;font-weight:600;">${title} · ${company}</span>
              </td></tr>
              <tr><td style="padding:14px 20px;border-bottom:1px solid #E5E7EB;">
                <span style="color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Email</span><br/>
                <a href="mailto:${email}" style="color:${GOLD};font-size:15px;font-weight:600;text-decoration:none;">${email}</a>
              </td></tr>
              ${triggerDomain ? `<tr><td style="padding:14px 20px;border-bottom:1px solid #E5E7EB;">
                <span style="color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Primary Trigger Domain</span><br/>
                <span style="color:#111827;font-size:14px;">${triggerDomain}</span>
              </td></tr>` : ''}
              ${message ? `<tr><td style="padding:14px 20px;">
                <span style="color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Message</span><br/>
                <span style="color:#111827;font-size:14px;line-height:1.6;">${message}</span>
              </td></tr>` : ''}
            </table>
            <a href="https://vaughnmartin.com/admin/users" style="display:inline-block;background:${NAVY};color:${GOLD};font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;padding:12px 28px;text-decoration:none;border-radius:4px;">View All Applications →</a>
          </td>
        </tr>
        <tr>
          <td style="background:#F9FAFB;padding:20px 40px;border-top:1px solid #E5E7EB;">
            <p style="margin:0;color:#9CA3AF;font-size:12px;">VaughnMartin · Readiness OS · Founding Partner Program</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
          const { error: adminError } = await resend.emails.send({
            from: 'Readiness OS <pilot@vaughnmartin.com>',
            replyTo: email,
            to: 'pilot@vaughnmartin.com',
            subject: `New Founding Partner Application — ${firstName} ${lastName} · ${company}`,
            html: adminHtml,
          });
          if (adminError) {
            console.warn(`⚠ Founding Partner admin notification failed: ${adminError.message}`);
          } else {
            console.log(`✓ Founding Partner admin notification sent for ${email}`);
          }
        } catch (emailErr: any) {
          console.warn(`⚠ Founding Partner admin notification threw: ${emailErr.message}`);
        }
      } else {
        console.log(`ℹ [FoundingPartner] RESEND_API_KEY not set — no admin notification sent for ${email}`);
      }

      res.json({ ok: true, id: application.id });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to submit application. Please email founding@vaughnmartin.com directly.' });
    }
  });

  // ─── Founding Partner Stats (public) ─────────────────────────────────────
  app.get('/api/founding-partner/stats', async (_req, res) => {
    try {
      const TOTAL_SEATS = 12;
      const [row] = await db
        .select({ filled: count() })
        .from(foundingPartnerApplications)
        .where(eq(foundingPartnerApplications.status, 'accepted'));
      const filled = Number(row?.filled ?? 0);
      res.json({ total: TOTAL_SEATS, filled, remaining: Math.max(0, TOTAL_SEATS - filled) });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/founding-partner/applications — platform admin: view all applications
  app.get('/api/founding-partner/applications', async (req: any, res) => {
    try {
      const adminEmail = process.env.PLATFORM_ADMIN_EMAIL;
      const userEmail = req.user?.claims?.email || req.user?.email;
      if (!adminEmail || userEmail !== adminEmail) return res.status(403).json({ error: 'Forbidden' });
      const apps = await db
        .select()
        .from(foundingPartnerApplications)
        .orderBy(desc(foundingPartnerApplications.createdAt));
      res.json(apps);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // PATCH /api/founding-partner/applications/:id/status — platform admin: accept or reject
  app.patch('/api/founding-partner/applications/:id/status', async (req: any, res) => {
    try {
      const adminEmail = process.env.PLATFORM_ADMIN_EMAIL;
      const userEmail = req.user?.claims?.email || req.user?.email;
      if (!adminEmail || userEmail !== adminEmail) return res.status(403).json({ error: 'Forbidden' });
      const { status } = req.body;
      if (!['pending', 'accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'status must be pending, accepted, or rejected' });
      }
      const [updated] = await db
        .update(foundingPartnerApplications)
        .set({ status })
        .where(eq(foundingPartnerApplications.id, req.params.id))
        .returning();
      if (!updated) return res.status(404).json({ error: 'Application not found' });
      res.json({ ok: true, application: updated });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Safe read-only check — does NOT consume the token, safe for email scanners to prefetch
  app.get('/api/auth/magic-link/validate', async (req, res) => {
    const token = req.query.token as string;
    if (!token) return res.status(400).json({ error: 'Token is required.', reason: 'missing_token' });
    const { validateMagicLinkToken } = await import('../services/magicLinkService.js');
    const result = await validateMagicLinkToken(token);
    if (!result.valid) {
      return res.status(400).json({ error: 'Invalid or expired token.', reason: result.reason });
    }
    return res.json({ ok: true, firstName: result.data!.firstName });
  });

  // POST-only — email scanners cannot trigger this, so the token is safe until the human clicks
  app.post('/api/auth/magic-link/verify', async (req, res) => {
    const token = req.body?.token as string;
    if (!token) {
      return res.status(400).json({ error: 'Token is required.', reason: 'missing_token' });
    }
    const result = await verifyMagicLinkToken(token);
    if (!result.valid) {
      return res.status(400).json({ error: 'Invalid or expired token.', reason: result.reason });
    }
    const { email, firstName, lastName, company, title } = result.data!;

    // Check if a user with this email already exists (e.g. from a prior Replit OIDC login).
    // If so, reuse their ID so we don't collide on the email unique constraint.
    const existingByEmail = await db.select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    const userId = existingByEmail[0]?.id ?? `ml-${Buffer.from(email).toString('base64').slice(0, 16)}`;

    await storage.upsertUser({ id: userId, email, firstName, lastName });
    let userOrgs = await storage.getUserOrganizations(userId);
    if (userOrgs.length === 0) {
      await storage.createOrganization({
        name: company,
        description: `${title} at ${company}`,
        ownerId: userId,
        onboardingCompleted: false,
      });
      userOrgs = await storage.getUserOrganizations(userId);

      // Auto-enroll the requesting user as a stakeholder contact so they
      // receive trigger alerts, compound threat emails, and weekly digests.
      if (userOrgs[0]?.id) {
        try {
          const { stakeholderContacts: scTable } = await import('@shared/schema');
          await db.insert(scTable).values({
            organizationId: userOrgs[0].id,
            role: title || 'Executive',
            name: `${firstName} ${lastName}`.trim(),
            email,
            isActive: true,
            triggerDomains: [], // empty = receives all domain alerts
          });
          console.log(`✅ [Magic Link] Auto-enrolled ${email} as stakeholder contact for org ${userOrgs[0].id}`);

          // Immediately run a signal scan for this new org so the user receives
          // a live trigger alert email — demonstrating the platform in real-time.
          const orgId = userOrgs[0].id;
          import('../services/LiveSignalIngestionService.js').then(({ liveSignalIngestionService }) => {
            liveSignalIngestionService.runIngestionCycle(orgId).then((result: any) => {
              console.log(`📡 [Magic Link] Welcome scan for ${email}: ${result.detections} detection(s) — alert sent`);
            }).catch((err: any) => {
              console.warn(`⚠ [Magic Link] Welcome scan failed for ${email}:`, err.message);
            });
          });
        } catch (scErr: any) {
          console.error('[Magic Link] Stakeholder contact auto-enroll failed:', scErr.message);
        }
      }
    }
    // Fire a guaranteed trigger demo alert email so the user experiences
    // what the platform delivers — regardless of RSS signal thresholds or
    // deduplication windows. Fires once per token (verifyMagicLinkToken
    // already marks tokens as used, so subsequent clicks return 'already_used').
    sendWelcomeTriggerDemo(email, firstName).catch((err: any) =>
      console.warn('[MagicLink] Welcome trigger demo email failed (non-fatal):', err?.message)
    );

    const sessionUser = {
      id: userId, email, firstName, lastName, company, title,
      organizationId: userOrgs[0]?.id,
      claims: { sub: userId, email, first_name: firstName, last_name: lastName },
    };
    req.login(sessionUser, (err) => {
      if (err) {
        console.error('Magic link session error:', err);
        return res.status(500).json({ error: 'Session creation failed.' });
      }
      return res.json({ ok: true, redirect: '/mission-control' });
    });
  });

  // ── 24-Hour Trial Access ───────────────────────────────────────────────────
  app.post('/api/trial/request', async (req, res) => {
    const { firstName, lastName, email, company, title } = req.body;
    if (!firstName || !lastName || !email || !company || !title) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address.' });
    }
    try {
      const result = await createTrialSession({ firstName, lastName, email, company, title });
      return res.json({ ok: true, emailSent: result.emailSent });
    } catch (err: any) {
      console.error('Trial request error:', err);
      return res.status(500).json({ error: 'Failed to process your request. Please try again.' });
    }
  });

  app.get('/api/trial/activate', async (req, res) => {
    const token = req.query.token as string;
    if (!token) return res.redirect('/?trial=invalid');
    const result = await activateTrialToken(token);
    if (!result.valid) return res.redirect(`/?trial=${result.reason}`);
    (req.session as any).trialToken = token;
    (req.session as any).trialFirstName = result.data!.firstName;
    (req.session as any).trialLastName = result.data!.lastName;
    (req.session as any).trialEmail = result.data!.email;
    (req.session as any).trialCompany = result.data!.company;
    (req.session as any).trialExpiresAt = result.data!.expiresAt.toISOString();
    return res.redirect('/mission-control?trial=activated');
  });

  app.get('/api/trial/status', async (req, res) => {
    if (req.isAuthenticated()) return res.json({ active: false, reason: 'authenticated' });
    const token = (req.session as any).trialToken;
    const expiresAt = (req.session as any).trialExpiresAt;
    if (!token || !expiresAt) return res.json({ active: false });
    if (new Date() > new Date(expiresAt)) {
      delete (req.session as any).trialToken;
      return res.json({ active: false, reason: 'expired' });
    }
    return res.json({
      active: true,
      firstName: (req.session as any).trialFirstName,
      company: (req.session as any).trialCompany,
      expiresAt,
    });
  });
}
