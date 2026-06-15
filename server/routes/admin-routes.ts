import type { Express } from "express";
import { db } from "../db";
import { eq, desc, inArray } from "drizzle-orm";
import { users, organizations, allowedEmails, sessions, pilotApplications, magicLinkTokens, trialSessions } from "@shared/schema";
import { requirePlatformAdmin } from "../replitAuth";
import { z } from "zod";

export function registerAdminRoutes(app: Express) {

  // ── Users ─────────────────────────────────────────────────────────────────

  // GET /api/admin/users — list all users with their org name
  app.get("/api/admin/users", requirePlatformAdmin, async (_req, res) => {
    try {
      const rows = await db
        .select({
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          organizationId: users.organizationId,
          accessLevel: users.accessLevel,
          lastLoginAt: users.lastLoginAt,
          createdAt: users.createdAt,
        })
        .from(users)
        .orderBy(desc(users.createdAt));

      const orgIds = Array.from(new Set(rows.map(u => u.organizationId).filter((id): id is string => !!id)));
      const orgs = orgIds.length
        ? await db.select({ id: organizations.id, name: organizations.name })
            .from(organizations)
            .where(inArray(organizations.id, orgIds))
        : [];

      const orgMap = Object.fromEntries(orgs.map(o => [o.id, o.name]));

      res.json(rows.map(u => ({
        ...u,
        organizationName: u.organizationId ? orgMap[u.organizationId] ?? null : null,
      })));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // DELETE /api/admin/users/:id — delete user + their linked org
  app.delete("/api/admin/users/:id", requirePlatformAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const [userRow] = await db.select().from(users).where(eq(users.id, id)).limit(1);
      if (!userRow) return res.status(404).json({ error: "User not found" });

      const orgId = userRow.organizationId;

      await db.delete(users).where(eq(users.id, id));

      if (orgId) {
        await db.delete(organizations).where(eq(organizations.id, orgId));
      }

      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ── Allowlist ─────────────────────────────────────────────────────────────

  // GET /api/admin/allowlist — list all allowed emails
  app.get("/api/admin/allowlist", requirePlatformAdmin, async (_req, res) => {
    try {
      const rows = await db.select().from(allowedEmails).orderBy(desc(allowedEmails.addedAt));
      res.json(rows);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/admin/allowlist — add an email
  app.post("/api/admin/allowlist", requirePlatformAdmin, async (req, res) => {
    try {
      const schema = z.object({
        email: z.string().email(),
        note: z.string().optional(),
      });
      const { email, note } = schema.parse(req.body);
      const [row] = await db
        .insert(allowedEmails)
        .values({ email: email.toLowerCase().trim(), note: note ?? null })
        .onConflictDoNothing()
        .returning();
      res.json(row ?? { message: "Already on allowlist" });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // DELETE /api/admin/allowlist/:id — remove an email
  app.delete("/api/admin/allowlist/:id", requirePlatformAdmin, async (req, res) => {
    try {
      await db.delete(allowedEmails).where(eq(allowedEmails.id, req.params.id));
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/admin/inbound-leads — unified view of all carousel/form-driven leads
  app.get("/api/admin/inbound-leads", requirePlatformAdmin, async (_req, res) => {
    try {
      const [pilots, magicLinks, trials] = await Promise.all([
        db.select().from(pilotApplications).orderBy(desc(pilotApplications.createdAt)),
        db.select().from(magicLinkTokens).orderBy(desc(magicLinkTokens.createdAt)),
        db.select().from(trialSessions).orderBy(desc(trialSessions.createdAt)),
      ]);

      const leads = [
        ...pilots.map(r => ({
          id: r.id,
          type: 'contact' as const,
          typeLabel: 'Contact Form',
          firstName: r.firstName,
          lastName: r.lastName,
          email: r.email,
          company: r.company,
          title: r.title,
          detail: r.primaryChallenge,
          status: r.status ?? 'pending',
          statusLabel: r.status === 'pending' ? 'Pending' : r.status ?? 'Pending',
          createdAt: r.createdAt?.toISOString() ?? null,
        })),
        ...magicLinks.map(r => ({
          id: r.id,
          type: 'request_access' as const,
          typeLabel: 'Request Access',
          firstName: r.firstName,
          lastName: r.lastName,
          email: r.email,
          company: r.company,
          title: r.title,
          detail: null,
          status: r.usedAt ? 'activated' : (new Date() > r.expiresAt ? 'expired' : 'sent'),
          statusLabel: r.usedAt ? 'Activated' : (new Date() > r.expiresAt ? 'Expired' : 'Link Sent'),
          createdAt: r.createdAt?.toISOString() ?? null,
        })),
        ...trials.map(r => ({
          id: r.id,
          type: 'trial' as const,
          typeLabel: 'Trial Access',
          firstName: r.firstName,
          lastName: r.lastName,
          email: r.email,
          company: r.company,
          title: r.title,
          detail: null,
          status: r.activatedAt ? 'activated' : (new Date() > r.expiresAt ? 'expired' : 'sent'),
          statusLabel: r.activatedAt ? 'Activated' : (new Date() > r.expiresAt ? 'Expired' : 'Link Sent'),
          createdAt: r.createdAt?.toISOString() ?? null,
        })),
      ].sort((a, b) => {
        if (!a.createdAt) return 1;
        if (!b.createdAt) return -1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      res.json(leads);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/admin/test-email — live Resend delivery test, result returned to caller
  app.post("/api/admin/test-email", requirePlatformAdmin, async (_req: any, res) => {
    const apiKey = process.env.RESEND_API_KEY || process.env.Resend_API_Key;
    if (!apiKey) {
      return res.status(503).json({ success: false, error: "RESEND_API_KEY is not set in environment secrets" });
    }
    const to = process.env.PLATFORM_ADMIN_EMAIL;
    if (!to) {
      return res.status(503).json({ success: false, error: "PLATFORM_ADMIN_EMAIL is not set" });
    }
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);
      const fromAddresses = [
        "Readiness OS <pilot@vaughnmartin.com>",
        "Readiness OS <onboarding@resend.dev>",
      ];
      let lastError = "";
      for (const from of fromAddresses) {
        const { data, error } = await resend.emails.send({
          from,
          to: [to],
          subject: "Readiness OS — Email Delivery Test",
          html: `<div style="font-family:sans-serif;padding:32px;background:#f8f7f4;">
            <div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #e8e4dc;border-radius:8px;padding:32px;">
              <div style="color:#C9A84C;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Readiness OS · Delivery Test</div>
              <div style="color:#0A0F2E;font-size:20px;font-weight:700;margin-bottom:16px;">Email delivery confirmed ✓</div>
              <p style="color:#444;font-size:14px;line-height:1.6;">Resend is correctly configured. Trigger alert emails will be delivered to registered users.</p>
              <p style="color:#999;font-size:12px;margin-top:24px;">From: ${from}<br>To: ${to}<br>Time: ${new Date().toISOString()}</p>
            </div>
          </div>`,
        });
        if (error) {
          lastError = `${from} → ${error.message}`;
          console.warn(`[test-email] Sender rejected: ${lastError}`);
          continue;
        }
        console.log(`[test-email] Delivered via ${from} → ${to} (id: ${data?.id})`);
        return res.json({ success: true, from, to, messageId: data?.id });
      }
      return res.status(500).json({ success: false, error: `All senders failed. Last: ${lastError}` });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // ── Prospect Signal Briefs ────────────────────────────────────────────────

  app.get("/api/admin/prospect-alerts", requirePlatformAdmin, async (_req, res) => {
    try {
      const { signalBriefProspects } = await import("@shared/schema");
      const { desc: descOrder } = await import("drizzle-orm");
      const { db: database } = await import("../db");
      const prospects = await database
        .select()
        .from(signalBriefProspects)
        .orderBy(descOrder(signalBriefProspects.enrolledAt));
      res.json(prospects);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/prospect-alerts/briefs", requirePlatformAdmin, async (_req, res) => {
    try {
      const { prospectBriefsSent, signalBriefProspects } = await import("@shared/schema");
      const { desc: descOrder, eq: eqOp } = await import("drizzle-orm");
      const { db: database } = await import("../db");
      const briefs = await database
        .select({
          id: prospectBriefsSent.id,
          prospectId: prospectBriefsSent.prospectId,
          triggerName: prospectBriefsSent.triggerName,
          triggerDomain: prospectBriefsSent.triggerDomain,
          playbookName: prospectBriefsSent.playbookName,
          confidenceScore: prospectBriefsSent.confidenceScore,
          sentAt: prospectBriefsSent.sentAt,
          prospectName: signalBriefProspects.name,
          prospectEmail: signalBriefProspects.email,
          prospectCompany: signalBriefProspects.company,
        })
        .from(prospectBriefsSent)
        .leftJoin(signalBriefProspects, eqOp(prospectBriefsSent.prospectId, signalBriefProspects.id))
        .orderBy(descOrder(prospectBriefsSent.sentAt))
        .limit(200);
      res.json(briefs);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.patch("/api/admin/prospect-alerts/:id/deactivate", requirePlatformAdmin, async (req, res) => {
    try {
      const { signalBriefProspects } = await import("@shared/schema");
      const { eq: eqOp } = await import("drizzle-orm");
      const { db: database } = await import("../db");
      await database
        .update(signalBriefProspects)
        .set({ isActive: false })
        .where(eqOp(signalBriefProspects.id, req.params.id));
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/linkedin-posts", requirePlatformAdmin, async (req, res) => {
    try {
      const { triggerDetections } = await import("@shared/schema");
      const { gte: gteOp, desc: descOp } = await import("drizzle-orm");
      const { db: database } = await import("../db");
      const { generateLinkedInPost } = await import("../services/linkedInPostGenerator.js");

      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const detections = await database
        .select()
        .from(triggerDetections)
        .where(gteOp(triggerDetections.detectedAt, since))
        .orderBy(descOp(triggerDetections.detectedAt))
        .limit(30);

      const posts = detections
        .filter(d => d.confidenceScore >= 80)
        .map(d => ({
          id: d.id,
          triggerName: d.triggerName,
          triggerDomain: d.triggerDomain,
          signalDescription: d.signalDescription,
          confidenceScore: d.confidenceScore,
          recommendedPlaybook: d.recommendedPlaybook,
          detectedAt: d.detectedAt,
          postText: generateLinkedInPost({
            id: d.id,
            triggerName: d.triggerName,
            triggerDomain: d.triggerDomain,
            signalDescription: d.signalDescription,
            confidenceScore: d.confidenceScore,
            recommendedPlaybook: d.recommendedPlaybook,
            detectedAt: d.detectedAt!,
          }),
        }));

      res.json(posts);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}
