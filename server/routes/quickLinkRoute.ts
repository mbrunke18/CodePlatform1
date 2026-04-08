/**
 * Quick-Issue Demo Link System
 * Generates signed, time-limited personalized demo links for individual prospects.
 * Admin-only. No database required — HMAC-signed tokens are stateless.
 */

import type { Express } from "express";
import crypto from "crypto";

const SECRET = process.env.QUICK_LINK_SECRET || "vm-quick-link-2026";

export interface QuickLinkPayload {
  name: string;
  email: string;
  expiresAt: number; // Unix ms
  nonce: string;
}

function sign(payload: QuickLinkPayload): string {
  const data = JSON.stringify(payload);
  const b64 = Buffer.from(data).toString("base64url");
  const hmac = crypto.createHmac("sha256", SECRET).update(b64).digest("base64url");
  return `QK-${b64}-${hmac}`;
}

export function parseQuickLinkToken(token: string): { valid: boolean; payload?: QuickLinkPayload; reason?: string } {
  if (!token.startsWith("QK-")) return { valid: false, reason: "not_quick_link" };
  const parts = token.split("-");
  if (parts.length < 3) return { valid: false, reason: "malformed" };
  // Format: QK-<b64>-<hmac>
  // Since b64url can contain dashes, reconstruct: first part is QK, last is hmac, middle is b64
  const hmacReceived = parts[parts.length - 1];
  const b64 = parts.slice(1, parts.length - 1).join("-");
  const hmacExpected = crypto.createHmac("sha256", SECRET).update(b64).digest("base64url");
  if (hmacReceived !== hmacExpected) return { valid: false, reason: "invalid_signature" };
  try {
    const payload: QuickLinkPayload = JSON.parse(Buffer.from(b64, "base64url").toString());
    if (Date.now() > payload.expiresAt) return { valid: false, reason: "expired" };
    return { valid: true, payload };
  } catch {
    return { valid: false, reason: "parse_error" };
  }
}

export function registerQuickLinkRoute(app: Express) {
  // POST /api/admin/generate-demo-link
  // Admin-only: generate a personalized, time-limited demo access link
  app.post("/api/admin/generate-demo-link", (req: any, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const user = req.user as any;
      const role = user?.claims ? null : user?.role;
      // Allow demo user (owner) or admin role
      const isDemoUser = user?.claims?.sub === "vm-demo-exec-2026";
      const isAdmin = role === "admin";
      const isOwner = user?.claims?.sub === process.env.REPL_OWNER_ID;
      if (!isDemoUser && !isAdmin && !isOwner) {
        return res.status(403).json({ error: "Admin access required" });
      }

      const { name, email, hours = 48 } = req.body;
      if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required" });
      }

      const durationHours = Math.min(Math.max(Number(hours) || 48, 1), 168); // 1h–7d cap
      const expiresAt = Date.now() + durationHours * 60 * 60 * 1000;
      const nonce = crypto.randomBytes(6).toString("hex");

      const payload: QuickLinkPayload = { name, email, expiresAt, nonce };
      const token = sign(payload);

      const baseUrl = process.env.REPLIT_DOMAINS
        ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}`
        : "https://vaughnmartin.com";
      const url = `${baseUrl}/api/demo-access?token=${token}`;

      console.log(`[QuickLink] Generated link for ${name} <${email}> — expires in ${durationHours}h`);

      return res.json({
        url,
        token,
        name,
        email,
        expiresAt: new Date(expiresAt).toISOString(),
        durationHours,
      });
    } catch (err) {
      console.error("[QuickLink] Error:", err);
      return res.status(500).json({ error: "Failed to generate link" });
    }
  });
}
