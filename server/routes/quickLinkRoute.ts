/**
 * Quick-Issue Demo Link System
 * Generates signed, time-limited personalized demo links for individual prospects.
 * Also generates shareable group links — one URL, multi-use, 72h session per clicker.
 * Admin-only. No database required — HMAC-signed tokens are stateless.
 */

import type { Express } from "express";
import crypto from "crypto";
import { Resend } from "resend";
import { requirePlatformAdmin } from "../replitAuth";

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

// ── Group Link (GK-) — multi-use, no name/email, platform admin only ──────────

export interface GroupLinkPayload {
  type: 'group';
  linkExpiresAt: number; // when this URL itself stops working
  sessionHours: number;  // how long each clicker's session lasts
  nonce: string;
}

export function signGroupLink(payload: GroupLinkPayload): string {
  const data = JSON.stringify(payload);
  const b64 = Buffer.from(data).toString("base64url");
  const hmac = crypto.createHmac("sha256", SECRET).update(b64).digest("base64url");
  // Use "." as separator — base64url never uses ".", so this is always unambiguous
  return `GK-${b64}.${hmac}`;
}

export function parseGroupLinkToken(token: string): { valid: boolean; payload?: GroupLinkPayload; reason?: string } {
  if (!token.startsWith("GK-")) return { valid: false, reason: "not_group_link" };
  const inner = token.slice(3); // strip "GK-"
  const dotIdx = inner.indexOf(".");
  if (dotIdx === -1) return { valid: false, reason: "malformed" };
  const b64 = inner.slice(0, dotIdx);
  const hmacReceived = inner.slice(dotIdx + 1);
  const hmacExpected = crypto.createHmac("sha256", SECRET).update(b64).digest("base64url");
  if (hmacReceived !== hmacExpected) return { valid: false, reason: "invalid_signature" };
  try {
    const payload: GroupLinkPayload = JSON.parse(Buffer.from(b64, "base64url").toString());
    if (payload.type !== 'group') return { valid: false, reason: "wrong_type" };
    if (Date.now() > payload.linkExpiresAt) return { valid: false, reason: "expired" };
    return { valid: true, payload };
  } catch {
    return { valid: false, reason: "parse_error" };
  }
}

export function registerQuickLinkRoute(app: Express) {
  // GET /api/admin/generate-demo-link → redirect to admin panel
  app.get("/api/admin/generate-demo-link", (_req, res) => {
    res.redirect(302, "/admin/users");
  });

  // POST /api/admin/generate-demo-link
  // Admin-only: generate a personalized, time-limited demo access link
  app.post("/api/admin/generate-demo-link", async (req: any, res) => {
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

      const { name, email, hours = 72, sendEmail = false } = req.body;
      if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required" });
      }

      const durationHours = Math.min(Math.max(Number(hours) || 72, 1), 168); // 1h–7d cap
      const expiresAt = Date.now() + durationHours * 60 * 60 * 1000;
      const nonce = crypto.randomBytes(6).toString("hex");

      const payload: QuickLinkPayload = { name, email, expiresAt, nonce };
      const token = sign(payload);

      const domains = (process.env.REPLIT_DOMAINS || "").split(",").map(d => d.trim()).filter(Boolean);
      const customDomain = domains.find(d => !d.includes("replit.app")) || domains[0];
      const baseUrl = customDomain ? `https://${customDomain}` : "https://vaughnmartin.com";
      const url = `${baseUrl}/api/demo-access?token=${token}`;

      console.log(`[QuickLink] Generated link for ${name} <${email}> — expires in ${durationHours}h`);

      let emailSent = false;
      let emailError: string | undefined;
      if (sendEmail) {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
          emailError = "RESEND_API_KEY not configured";
          console.warn("[QuickLink] Email skipped — RESEND_API_KEY not set");
        } else {
          try {
            const resend = new Resend(apiKey);
            const firstName = name.split(" ")[0] || name;
            const NAVY = "#0A0F2E";
            const GOLD = "#C9A84C";
            const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;">
        <tr><td style="background:${NAVY};padding:28px 36px;">
          <div style="color:${GOLD};font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:6px;">VAUGHNMARTIN · READINESS OS</div>
          <div style="color:#ffffff;font-size:20px;font-weight:700;">Your ${durationHours}-Hour Full Access</div>
        </td></tr>
        <tr><td style="height:3px;background:${GOLD};"></td></tr>
        <tr><td style="padding:36px;">
          <p style="margin:0 0 8px;color:#111827;font-size:16px;font-weight:600;">Hi ${firstName},</p>
          <p style="margin:0 0 28px;color:#374151;font-size:15px;line-height:1.7;">
            You have been granted full ${durationHours}-hour access to the Readiness OS platform. 
            Explore live trigger detection, 180 pre-staged Readiness Protocols, Mission Control, 
            and the complete IDEA Framework — with your own session, no restrictions.
          </p>
          <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
            <tr>
              <td style="background:${NAVY};padding:14px 32px;">
                <a href="${url}" style="font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${GOLD};text-decoration:none;">
                  Access Readiness OS →
                </a>
              </td>
            </tr>
          </table>
          <p style="margin:0 0 6px;color:#6B7280;font-size:13px;line-height:1.6;">
            This link is personal to you and expires in <strong>${durationHours} hours</strong>.<br/>
            If you have any questions, reply directly to this email.
          </p>
          <p style="margin:12px 0 0;font-size:11px;color:#9CA3AF;word-break:break-all;">${url}</p>
          <table cellpadding="0" cellspacing="0" style="margin:28px 0 0;border-top:1px solid #E5E7EB;width:100%;">
            <tr><td style="padding-top:24px;">
              <p style="margin:0 0 6px;color:#374151;font-size:13px;font-weight:600;">Explore a Founding Partner Engagement</p>
              <p style="margin:0 0 16px;color:#6B7280;font-size:13px;line-height:1.6;">
                Before your access expires, see what a 90-day Founding Partner engagement looks like — 
                full validation partnership, dedicated onboarding, and direct access to the team.
              </p>
              <a href="https://vaughnmartin.com/founding-partner-brief"
                 style="font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${NAVY};text-decoration:none;border:1.5px solid ${NAVY};padding:10px 22px;display:inline-block;">
                View the 90-Day Validation Brief →
              </a>
              <p style="margin:10px 0 0;font-size:11px;color:#9CA3AF;">vaughnmartin.com/founding-partner-brief</p>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="background:${NAVY};padding:20px 36px;">
          <p style="margin:0;color:rgba(255,255,255,0.4);font-size:11px;">
            VaughnMartin · Readiness OS<br/>pilot@vaughnmartin.com
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

            // Try verified custom domain first; fall back to Resend's shared domain
            const fromAddresses = [
              "Readiness OS <pilot@vaughnmartin.com>",
              "Readiness OS <onboarding@resend.dev>",
            ];
            for (const from of fromAddresses) {
              const { error } = await resend.emails.send({
                from,
                replyTo: "pilot@vaughnmartin.com",
                to: [email.trim()],
                subject: `Your ${durationHours}-Hour Readiness OS Access — ${name}`,
                html,
              });
              if (!error) {
                emailSent = true;
                console.log(`[QuickLink] Email sent via ${from} to ${email}`);
                break;
              } else {
                console.warn(`[QuickLink] Send failed from ${from}: ${error.message}`);
                emailError = error.message;
              }
            }
            if (!emailSent) console.warn(`[QuickLink] All from-addresses failed — copy link manually`);
          } catch (err: any) {
            emailError = err.message;
            console.warn(`[QuickLink] Email threw: ${err.message}`);
          }
        }
      }

      return res.json({
        url,
        token,
        name,
        email,
        expiresAt: new Date(expiresAt).toISOString(),
        durationHours,
        emailSent,
        emailError: emailSent ? undefined : emailError,
      });
    } catch (err) {
      console.error("[QuickLink] Error:", err);
      return res.status(500).json({ error: "Failed to generate link" });
    }
  });

  // POST /api/admin/generate-group-link
  // Platform admin ONLY — creates a multi-use shareable link (GK- token).
  // Anyone who clicks it gets their own 72-hour demo session; no name/email required.
  app.post("/api/admin/generate-group-link", requirePlatformAdmin, async (req: any, res) => {
    try {
      const { linkDays = 7, sessionHours = 72 } = req.body;
      const linkDaysCapped = Math.min(Math.max(Number(linkDays) || 7, 1), 30);
      const sessionHoursCapped = Math.min(Math.max(Number(sessionHours) || 72, 24), 168);

      const linkExpiresAt = Date.now() + linkDaysCapped * 24 * 60 * 60 * 1000;
      const nonce = crypto.randomBytes(8).toString("hex");

      const payload: GroupLinkPayload = { type: 'group', linkExpiresAt, sessionHours: sessionHoursCapped, nonce };
      const token = signGroupLink(payload);

      const domains = (process.env.REPLIT_DOMAINS || "").split(",").map(d => d.trim()).filter(Boolean);
      const customDomain = domains.find(d => !d.includes("replit.app")) || domains[0];
      const baseUrl = customDomain ? `https://${customDomain}` : "https://vaughnmartin.com";
      const url = `${baseUrl}/api/demo-access?token=${token}`;

      console.log(`[GroupLink] Generated by platform admin — ${sessionHoursCapped}h session, link valid ${linkDaysCapped} days`);

      return res.json({
        url,
        token,
        linkExpiresAt: new Date(linkExpiresAt).toISOString(),
        linkDays: linkDaysCapped,
        sessionHours: sessionHoursCapped,
      });
    } catch (err) {
      console.error("[GroupLink] Error:", err);
      return res.status(500).json({ error: "Failed to generate group link" });
    }
  });
}
