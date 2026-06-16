/**
 * Microsoft Azure AD / Entra SSO
 *
 * Direct OAuth 2.0 authorization code flow — avoids openid-client
 * multi-tenant issuer validation complexity while remaining fully secure.
 * State parameter provides CSRF protection; tokens are validated via
 * Microsoft Graph API (server-to-server — no client-side token handling).
 */

import type { Express } from "express";
import crypto from "crypto";
import { upsertUser, isEmailAllowed } from "./replitAuth";

function getMicrosoftCallbackURL(): string {
  const domains = process.env.REPLIT_DOMAINS;
  if (domains) {
    const primary = domains.split(",")[0].trim();
    return `https://${primary}/api/auth/microsoft/callback`;
  }
  return "http://localhost:5000/api/auth/microsoft/callback";
}

export function setupMicrosoftAuth(app: Express): void {
  // Routes are always registered so the button never 404s.
  // When credentials are absent the handler redirects gracefully.
  const tenantId = process.env.AZURE_TENANT_ID ?? "organizations";
  const AUTH_URL = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`;
  const TOKEN_URL = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const GRAPH_URL = "https://graph.microsoft.com/v1.0/me";

  const isConfigured = (): boolean =>
    !!(process.env.AZURE_CLIENT_ID && process.env.AZURE_CLIENT_SECRET);

  if (!isConfigured()) {
    console.log(
      "[Microsoft SSO] AZURE_CLIENT_ID / AZURE_CLIENT_SECRET not configured — Microsoft login routes registered but will redirect to /request-access"
    );
  }

  // Step 1 — redirect user to Microsoft login
  app.get("/api/auth/microsoft", (req: any, res) => {
    const clientId = process.env.AZURE_CLIENT_ID;
    const clientSecret = process.env.AZURE_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      return res.redirect("/request-access");
    }
    const state = crypto.randomBytes(16).toString("hex");
    req.session.msOAuthState = state;

    if (req.query.returnTo && typeof req.query.returnTo === "string") {
      req.session.returnTo = req.query.returnTo;
    } else if (!req.session.returnTo) {
      req.session.returnTo = "/mission-control";
    }

    const params = new URLSearchParams({
      client_id: clientId,
      response_type: "code",
      redirect_uri: getMicrosoftCallbackURL(),
      response_mode: "query",
      scope: "openid email profile User.Read",
      state,
      prompt: "select_account",
    });

    res.redirect(`${AUTH_URL}?${params.toString()}`);
  });

  // Step 2 — Microsoft redirects back with auth code
  app.get("/api/auth/microsoft/callback", async (req: any, res, next) => {
    const clientId = process.env.AZURE_CLIENT_ID;
    const clientSecret = process.env.AZURE_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      return res.redirect("/request-access");
    }
    try {
      const { code, state, error, error_description } = req.query as Record<string, string>;

      if (error) {
        console.error("[Microsoft SSO] Provider error:", error, error_description);
        return res.redirect("/access-denied");
      }

      if (!code) {
        return res.redirect("/api/auth/microsoft");
      }

      // CSRF state check
      if (!req.session.msOAuthState || state !== req.session.msOAuthState) {
        console.error("[Microsoft SSO] State mismatch — possible CSRF attempt");
        return res.redirect("/api/auth/microsoft");
      }
      delete req.session.msOAuthState;

      // Exchange authorization code for access token
      const tokenRes = await fetch(TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          redirect_uri: getMicrosoftCallbackURL(),
          grant_type: "authorization_code",
        }).toString(),
      });

      if (!tokenRes.ok) {
        const errText = await tokenRes.text();
        console.error("[Microsoft SSO] Token exchange failed:", errText);
        return res.redirect("/access-denied");
      }

      const tokens = (await tokenRes.json()) as Record<string, string>;
      const accessToken = tokens.access_token;

      if (!accessToken) {
        console.error("[Microsoft SSO] No access_token in response");
        return res.redirect("/access-denied");
      }

      // Retrieve user profile from Microsoft Graph
      const graphRes = await fetch(GRAPH_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!graphRes.ok) {
        const errText = await graphRes.text();
        console.error("[Microsoft SSO] Graph API error:", errText);
        return res.redirect("/access-denied");
      }

      const profile = (await graphRes.json()) as {
        id: string;
        displayName?: string;
        givenName?: string;
        surname?: string;
        mail?: string;
        userPrincipalName?: string;
      };

      // Microsoft may return email in `mail` (licensed user) or `userPrincipalName`
      const email = (profile.mail ?? profile.userPrincipalName ?? "").toLowerCase().trim();

      if (!email || !email.includes("@")) {
        console.error("[Microsoft SSO] No valid email in Graph profile for user:", profile.id);
        return res.redirect("/access-denied");
      }

      // Run the same allowlist check as Replit OIDC login
      const allowed = await isEmailAllowed(email);
      if (!allowed) {
        console.warn("[Microsoft SSO] Access denied for:", email);
        return res.redirect("/access-denied");
      }

      // Upsert into users table using same logic as Replit OIDC
      const resolvedUser = await upsertUser({
        sub: `ms_${profile.id}`,
        email,
        name: profile.displayName ?? email,
        first_name: profile.givenName ?? null,
        last_name: profile.surname ?? null,
        profile_image_url: null,
      });

      if (!resolvedUser) {
        console.error("[Microsoft SSO] upsertUser returned null for:", email);
        return res.redirect("/access-denied");
      }

      // Build session user compatible with existing session-sync middleware
      // (middleware checks req.user.claims?.email to sync dbUserId / organizationId)
      const sessionUser: any = {
        claims: {
          sub: `ms_${profile.id}`,
          email,
          name: profile.displayName ?? email,
        },
        access_token: accessToken,
        dbUserId: resolvedUser.id,
        provider: "microsoft",
      };

      req.logIn(sessionUser, (loginErr: any) => {
        if (loginErr) return next(loginErr);
        const returnTo = (req.session as any).returnTo || "/mission-control";
        delete (req.session as any).returnTo;
        console.log(`[Microsoft SSO] Login successful: ${email}`);
        return res.redirect(returnTo);
      });
    } catch (err) {
      console.error("[Microsoft SSO] Unexpected error in callback:", err);
      next(err);
    }
  });

  if (isConfigured()) {
    console.log(`[Microsoft SSO] Enabled (tenant: ${tenantId}) — /api/auth/microsoft`);
  } else {
    console.log(`[Microsoft SSO] Routes registered — activate by setting AZURE_CLIENT_ID + AZURE_CLIENT_SECRET`);
  }
}
