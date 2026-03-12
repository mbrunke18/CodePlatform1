import type { Express } from "express";
import { storage } from "../storage";

const DEMO_USER_ID = "vm-demo-exec-2026";
const DEFAULT_TOKEN = "VMdemo2026";

export function registerDemoAccessRoute(app: Express) {
  app.get("/api/demo-access", async (req: any, res) => {
    try {
      const token = req.query.token as string;
      const expectedToken = process.env.DEMO_ACCESS_TOKEN || DEFAULT_TOKEN;

      if (!token || token !== expectedToken) {
        return res.status(401).send(`
          <!DOCTYPE html>
          <html>
          <head><title>Access Denied — VaughnMartin</title></head>
          <body style="font-family:'DM Sans',sans-serif;background:#0A0F2E;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;text-align:center;padding:40px;">
            <div>
              <div style="font-size:11px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;color:#C9A84C;margin-bottom:16px;">VaughnMartin · Execution OS</div>
              <h1 style="font-size:28px;font-weight:600;color:#fff;margin:0 0 12px">Access Denied</h1>
              <p style="color:rgba(255,255,255,0.5);font-size:14px;">Invalid or missing access token. Contact your VaughnMartin representative.</p>
            </div>
          </body>
          </html>
        `);
      }

      // Ensure demo user exists in the database
      await storage.upsertUser({
        id: DEMO_USER_ID,
        email: "demo@vaughnmartin.com",
        firstName: "Demo",
        lastName: "Executive",
        profileImageUrl: null,
      });

      // Ensure demo user has an organization
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

      // Build session user object that matches Replit OIDC structure exactly
      const demoSessionUser = {
        claims: {
          sub: DEMO_USER_ID,
          email: "demo@vaughnmartin.com",
          first_name: "Demo",
          last_name: "Executive",
          profile_image_url: null,
          exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
          iat: Math.floor(Date.now() / 1000),
        },
        access_token: "demo-session",
        refresh_token: "demo-session",
        expires_at: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
      };

      // Establish authenticated session via Passport
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
