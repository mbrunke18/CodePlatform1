import type { Express } from "express";
import { db } from "../db";
import { eq, desc, inArray } from "drizzle-orm";
import { users, organizations, allowedEmails, sessions } from "@shared/schema";
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
}
