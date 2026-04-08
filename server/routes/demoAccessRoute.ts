import type { Express } from "express";
import { storage } from "../storage";
import { parseQuickLinkToken } from "./quickLinkRoute";

const DEMO_USER_ID = "vm-demo-exec-2026";
const DEFAULT_TOKEN = "VMdemo2026";

function buildExpiredPage(reason: 'expired' | 'invalid'): string {
  const message = reason === 'expired'
    ? 'This demonstration access window has closed.'
    : 'Invalid or missing access token.';
  const sub = reason === 'expired'
    ? 'Request direct access to the platform below.'
    : 'Contact your VaughnMartin representative for an access link.';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Access — VaughnMartin Execution OS</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'DM Sans', 'Inter', sans-serif;
      background: #0A0F2E;
      color: #fff;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
    }
    .card {
      max-width: 460px;
      width: 100%;
      text-align: center;
    }
    .eyebrow {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: #C9A84C;
      margin-bottom: 20px;
    }
    .seal {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      border: 2px solid #C9A84C;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      background: rgba(201,168,76,0.1);
      font-size: 16px;
      font-weight: 800;
      color: #C9A84C;
    }
    h1 {
      font-size: 26px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 12px;
      line-height: 1.3;
    }
    p {
      font-size: 14px;
      color: rgba(255,255,255,0.45);
      line-height: 1.7;
      margin-bottom: 32px;
    }
    .cta {
      display: inline-block;
      background: #C9A84C;
      color: #0A0F2E;
      font-weight: 800;
      font-size: 13px;
      padding: 13px 32px;
      border-radius: 6px;
      text-decoration: none;
      letter-spacing: 0.03em;
    }
    .cta:hover { opacity: 0.9; }
    .divider {
      margin: 20px 0;
      border: none;
      border-top: 1px solid rgba(255,255,255,0.08);
    }
    .footer {
      font-size: 11px;
      color: rgba(255,255,255,0.2);
      margin-top: 32px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="eyebrow">VaughnMartin · Execution OS</div>
    <div class="seal">VM</div>
    <h1>${reason === 'expired' ? 'Access Window Closed' : 'Access Denied'}</h1>
    <p>${message}<br />${sub}</p>
    <a class="cta" href="/request-access">Request Platform Access</a>
    <hr class="divider" />
    <div class="footer">vaughnmartin.com · Strategic Execution Infrastructure</div>
  </div>
</body>
</html>`;
}

export function registerDemoAccessRoute(app: Express) {
  app.get("/api/demo-access", async (req: any, res) => {
    try {
      const token = req.query.token as string;
      if (!token) return res.status(401).send(buildExpiredPage('invalid'));

      let guestFirstName = "Executive";

      // ── Quick-link token (QK-...) — personalized, signed, self-expiring ──
      if (token.startsWith("QK-")) {
        const result = parseQuickLinkToken(token);
        if (!result.valid) {
          const reason = result.reason === "expired" ? "expired" : "invalid";
          return res.status(reason === "expired" ? 403 : 401).send(buildExpiredPage(reason));
        }
        // Use the prospect's first name for the session greeting
        guestFirstName = result.payload!.name.split(" ")[0] || "Executive";
        console.log(`[DemoAccess] Quick-link access: ${result.payload!.name} <${result.payload!.email}>`);
      } else {
        // ── Static broadcast token (VMdemo2026) — with optional time window ──
        const expectedToken = process.env.DEMO_ACCESS_TOKEN || DEFAULT_TOKEN;
        if (token !== expectedToken) {
          return res.status(401).send(buildExpiredPage('invalid'));
        }
        // Set DEMO_ACCESS_EXPIRES to an ISO timestamp to close the window.
        const expiresEnv = process.env.DEMO_ACCESS_EXPIRES;
        if (expiresEnv) {
          const expiresAt = new Date(expiresEnv);
          if (!isNaN(expiresAt.getTime()) && Date.now() > expiresAt.getTime()) {
            console.log(`[DemoAccess] Broadcast link expired at ${expiresEnv}`);
            return res.status(403).send(buildExpiredPage('expired'));
          }
        }
      }

      // ── Ensure demo user exists ───────────────────────────────────────────
      await storage.upsertUser({
        id: DEMO_USER_ID,
        email: "demo@vaughnmartin.com",
        firstName: "Executive",
        lastName: "",
        profileImageUrl: null,
      });

      const userOrgs = await storage.getUserOrganizations(DEMO_USER_ID);
      if (userOrgs.length === 0) {
        await storage.createOrganization({
          name: "Acme Corporation — Executive Demo",
          description: "Fortune 1000 enterprise pilot demonstration environment",
          ownerId: DEMO_USER_ID,
          industry: "Financial Services",
          onboardingCompleted: true,
        });
      }

      // ── Session: 4-hour window ────────────────────────────────────────────
      const SESSION_SECONDS = 4 * 60 * 60;
      const demoSessionUser = {
        claims: {
          sub: DEMO_USER_ID,
          email: "demo@vaughnmartin.com",
          first_name: guestFirstName,
          last_name: "",
          profile_image_url: null,
          exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS,
          iat: Math.floor(Date.now() / 1000),
        },
        access_token: "demo-session",
        refresh_token: "demo-session",
        expires_at: Math.floor(Date.now() / 1000) + SESSION_SECONDS,
      };

      req.login(demoSessionUser, (err: any) => {
        if (err) {
          console.error("[DemoAccess] Session error:", err);
          return res.status(500).send("Session setup failed. Please try again.");
        }
        const returnTo = (req.query.returnTo as string) || "/mission-control";
        console.log(`[DemoAccess] Demo session established → ${returnTo}`);
        res.redirect(returnTo);
      });

    } catch (error) {
      console.error("[DemoAccess] Error:", error);
      res.status(500).send("Demo access setup failed. Please try again.");
    }
  });
}
