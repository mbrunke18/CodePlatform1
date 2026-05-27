import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { allowedEmails } from "@shared/schema";

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!,
    );
  },
  { maxAge: 3600 * 1000 },
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl,
    },
  });
}

function updateUserSession(user: any, tokens: any) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(claims: any) {
  const user = await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });

  const email = (claims["email"] ?? "").toLowerCase().trim();

  // Check if this email is mapped to a pre-configured organization
  let assignedOrgId: string | null = null;
  try {
    const rows = await db
      .select({ organizationId: allowedEmails.organizationId })
      .from(allowedEmails)
      .where(eq(allowedEmails.email, email))
      .limit(1);
    assignedOrgId = rows[0]?.organizationId ?? null;
  } catch {
    // allowed_emails may not have organizationId column yet — ignore
  }

  if (assignedOrgId) {
    // Add user as a member of the pre-configured org
    await storage.addOrgMembership(user.id, assignedOrgId, 'member');
  }

  // Auto-create personal organization only if user has no orgs at all
  const userOrgs = await storage.getUserOrganizations(user.id);
  if (userOrgs.length === 0) {
    const orgName = claims["name"] || (email ? email.split('@')[0] : 'My Organization');
    await storage.createOrganization({
      name: orgName,
      description: "My Organization",
      ownerId: user.id,
      onboardingCompleted: false,
    });
  }
}

// Returns true if this email is allowed to log in.
// Platform admin (PLATFORM_ADMIN_EMAIL) always passes.
// Everyone else must be in the allowed_emails table.
// If the table doesn't exist yet (pre-migration) we fail open so no one gets locked out.
async function isEmailAllowed(email: string): Promise<boolean> {
  const adminEmail = process.env.PLATFORM_ADMIN_EMAIL;
  if (adminEmail && email === adminEmail) return true;

  try {
    const [countRow] = await db
      .select({ count: allowedEmails.id })
      .from(allowedEmails)
      .limit(1);

    // If the allowlist is empty, allow everyone through (open access mode).
    // Access becomes restricted only once you deliberately add emails to the list.
    if (!countRow) return true;

    const rows = await db
      .select()
      .from(allowedEmails)
      .where(eq(allowedEmails.email, email.toLowerCase().trim()))
      .limit(1);
    return rows.length > 0;
  } catch {
    // Table doesn't exist yet — fail open so existing users aren't locked out
    return true;
  }
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  if (!process.env.REPLIT_DOMAINS) {
    return;
  }

  const config = await getOidcConfig();

  const verify: VerifyFunction = async (tokens: any, verified: any) => {
    const claims = tokens.claims();
    const email: string = claims["email"] ?? "";

    const allowed = await isEmailAllowed(email);
    if (!allowed) {
      return verified(null, false, { message: "access_denied" });
    }

    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(claims);
    verified(null, user);
  };

  const registeredDomains: string[] = [];

  for (const domain of process.env.REPLIT_DOMAINS.split(",")) {
    const trimmed = domain.trim();
    const strategy = new Strategy(
      {
        name: `replitauth:${trimmed}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${trimmed}/api/callback`,
      },
      verify,
    );
    passport.use(strategy);
    registeredDomains.push(trimmed);
  }

  function resolveStrategy(hostname: string): string {
    if (registeredDomains.includes(hostname)) {
      return `replitauth:${hostname}`;
    }
    const replId = hostname.split(".")[0];
    const match = registeredDomains.find(d => d.startsWith(replId));
    return `replitauth:${match || registeredDomains[0]}`;
  }

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", (req, res, next) => {
    if (req.query.returnTo && typeof req.query.returnTo === 'string') {
      (req.session as any).returnTo = req.query.returnTo;
    } else if (!(req.session as any).returnTo) {
      (req.session as any).returnTo = "/mission-control";
    }
    passport.authenticate(resolveStrategy(req.hostname), {
      prompt: "login consent",
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    passport.authenticate(
      resolveStrategy(req.hostname),
      (err: any, user: any, info: any) => {
        if (err) return next(err);
        if (!user) {
          if (info?.message === "access_denied") {
            return res.redirect("/access-denied");
          }
          return res.redirect("/api/login");
        }
        req.logIn(user, (loginErr) => {
          if (loginErr) return next(loginErr);
          const returnTo = (req.session as any).returnTo || "/mission-control";
          delete (req.session as any).returnTo;
          return res.redirect(returnTo);
        });
      }
    )(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href,
      );
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  return next();
};

export const hasPermission = (action: string) => {
  return async (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return next();
  };
};

// Middleware: only the platform admin may pass.
export const requirePlatformAdmin: RequestHandler = async (req: any, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const userEmail: string = req.user?.claims?.email ?? "";
  const adminEmail = process.env.PLATFORM_ADMIN_EMAIL ?? "";
  if (!adminEmail || userEmail !== adminEmail) {
    return res.status(403).json({ message: "Forbidden — platform admin only" });
  }
  return next();
};
