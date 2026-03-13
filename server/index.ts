import * as Sentry from "@sentry/node";

// Initialize Sentry before any other imports — no-op when SENTRY_DSN is not set
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: 0.1,
    integrations: [Sentry.httpIntegration(), Sentry.expressIntegration()],
  });
}

import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import path from "path";
import { registerRoutes } from "./routes";
import { serveStatic, log } from "./vite";
import type { setupVite } from "./vite";
import { auditLogger } from "./middleware/audit-logging";
// import { proactiveAIRadar } from "./proactive-ai-radar"; // DISABLED - causing startup hang
import { enterpriseJobService } from "./services/EnterpriseJobService";
import { openAIService } from "./services/OpenAIService";
import { seedPlaybookLibrary } from "./seeds/playbookLibrarySeed";
import { seedTriggers, getTriggerStats } from "./seeds/triggersSeed";
import { seedDemoScenarios } from "./seeds/demoScenariosSeed";
import { seedEnrichedPlaybooks } from "./seeds/enrichPlaybooksStartupSeed";
import { db } from "./db";
import { playbookLibrary, executiveTriggers } from "@shared/schema";
import { count, eq, sql } from "drizzle-orm";
import pino from "pino";
import pinoHttp from "pino-http";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Configure production-grade logger with sensitive data redaction
const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  redact: ["password", "email", "apiKey", "token", "authorization"],
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
});

// HTTP request logger middleware
const httpLogger = pinoHttp({
  logger,
  redact: [
    "req.headers.authorization",
    "req.headers.cookie",
    "req.body.password",
    "req.body.email",
    "req.body.apiKey",
    "req.body.token",
  ],
  serializers: {
    req: (req) => ({
      id: req.id,
      method: req.method,
      url: req.url,
      remoteAddress: req.remoteAddress,
      remotePort: req.remotePort,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },
});

const app = express();

// Track background seeding status (informational only, does NOT block health checks)
let seedingComplete = false;

// Health check endpoints - ALL return 200 immediately, NEVER 503
// Registered BEFORE any middleware to ensure instant response for Autoscale health checks
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok", app: "Execution OS", timestamp: new Date().toISOString() });
});

app.get("/api/health-check", (_req, res) => {
  res.status(200).json({ 
    status: "ok", 
    app: "Execution OS", 
    seeded: seedingComplete,
    timestamp: new Date().toISOString() 
  });
});

app.get("/ready", (_req, res) => {
  res.status(200).json({ status: "ready", timestamp: new Date().toISOString() });
});

app.get("/_health", (_req, res) => {
  res.status(200).json({ status: "ok", ready: true, timestamp: new Date().toISOString() });
});

// HEAD and GET on root for fast health checks (used by load balancers and Autoscale)
app.head("/", (_req, res) => {
  res.status(200).end();
});

app.get("/ultimate-demo", (_req, res) => {
  res.sendFile(path.resolve("client/public/ultimate-demo.html"));
});

app.get("/scenario-demo", (_req, res) => {
  res.sendFile(path.resolve("client/public/scenario-demo.html"));
});

// Domain redirect: executeiq.io → vaughnmartin.com (legacy domain forward)
// Placed AFTER health checks so deployment health checks always pass
// Skips root path "/" to ensure Autoscale health checks always get 200
app.use((req, res, next) => {
  if (req.hostname === 'executeiq.io' || req.hostname === 'www.executeiq.io') {
    return res.redirect(301, `https://www.vaughnmartin.com${req.originalUrl}`);
  }
  next();
});

// Import raw body parser for webhook signature verification
import { rawBodyParser } from "./middleware/rawBodyParser";

// CRITICAL: Raw body parser must come BEFORE express.json() for webhook signature verification
app.use(rawBodyParser);

// Production Security: Helmet for secure HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "https://replit.com",
          "https://www.googletagmanager.com",
          "https://www.google-analytics.com",
        ],
        connectSrc: [
          "'self'",
          "https:",
          "wss:",
          "https://www.google-analytics.com",
          "https://analytics.google.com",
        ],
        frameSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// Production Security: API Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per 15 minutes
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === "/health" || req.path === "/_health";
  },
});

// Stricter rate limit for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 auth attempts per 15 minutes
  message: {
    error: "Too many authentication attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiters
app.use("/api/", apiLimiter);
app.use("/api/login", authLimiter);
app.use("/api/callback", authLimiter);

// Security: Add request size limits for enterprise security
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: false }));

// Enterprise: Add production logging and audit middleware
app.use(httpLogger);
app.use(auditLogger as any);

// CORS middleware - configured for production with allowed origins
const allowedOrigins = process.env.REPLIT_DOMAINS
  ? process.env.REPLIT_DOMAINS.split(",").map((d) => `https://${d}`)
  : [
      "http://localhost:5000",
      "http://0.0.0.0:5000",
    ];

// Helper to check if origin is a valid Replit domain
const isReplitDomain = (origin: string): boolean => {
  try {
    const url = new URL(origin);
    return (
      url.hostname.endsWith(".replit.app") ||
      url.hostname.endsWith(".replit.dev") ||
      url.hostname.endsWith(".repl.co")
    );
  } catch {
    return false;
  }
};

app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Allow same-origin requests (no origin header) or exact match from allowed list
  if (!origin) {
    // Same-origin request, allow it
    res.header("Access-Control-Allow-Origin", "*");
  } else if (allowedOrigins.includes(origin) || isReplitDomain(origin)) {
    // Exact match from allowed origins OR valid Replit domain
    res.header("Access-Control-Allow-Origin", origin);
  }
  // If origin doesn't match, don't set CORS headers (request will be blocked)

  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With",
  );
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Enhanced API response logging with security considerations
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logData: any = {
        method: req.method,
        path,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        userAgent: req.get("user-agent"),
        ip: req.ip,
      };

      // Only log response for non-sensitive endpoints and successful requests
      if (
        capturedJsonResponse &&
        res.statusCode < 400 &&
        !path.includes("/auth/")
      ) {
        const responseStr = JSON.stringify(capturedJsonResponse);
        logData.responsePreview =
          responseStr.length > 100
            ? responseStr.slice(0, 100) + "…"
            : responseStr;
      }

      logger.info(logData, `API ${req.method} ${path}`);

      // Keep backwards compatibility with existing audit log
      let legacyLogLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse && legacyLogLine.length < 80) {
        const responseStr = JSON.stringify(capturedJsonResponse);
        legacyLogLine += ` :: ${responseStr.length > 40 ? responseStr.slice(0, 40) + "…" : responseStr}`;
      }
      if (legacyLogLine.length > 80) {
        legacyLogLine = legacyLogLine.slice(0, 79) + "…";
      }
      log(legacyLogLine);
    }
  });

  next();
});

// PRODUCTION: Serve static files BEFORE server.listen() so GET / returns 200
// from the very first healthcheck. API routes registered later take precedence
// for /api/* paths because express.static only matches real files.
if (app.get("env") !== "development") {
  const distPublicPath = path.resolve(process.cwd(), "dist/public");
  app.use(express.static(distPublicPath));
  const indexHtmlPath = path.resolve(distPublicPath, "index.html");
  // Handle GET / immediately — this is what Replit's healthcheck hits
  app.get("/", (_req, res) => res.sendFile(indexHtmlPath));
}

// Create HTTP server and start listening IMMEDIATELY
// This ensures health check endpoints respond before route registration completes
const port = parseInt(process.env.PORT || "5000", 10);
const server = createServer(app);
server.listen(
  { port, host: "0.0.0.0", reusePort: true },
  () => {
    log("serving on port " + port);
    logger.info(
      { port, env: app.get("env") },
      "Execution OS server listening - health checks active from startup",
    );
  }
);

(async () => {
  // Register all routes using the already-listening server
  await registerRoutes(app, server);

  // Set up API documentation (dev only — swagger-ui-express not bundled in production)
  if (app.get("env") === "development") {
    const { setupSwagger } = await import("./swagger");
    setupSwagger(app);
  }

  logger.info("✅ Routes registered - health checks already passing from startup");

  // Sentry error handler — must be registered before other error middleware
  if (process.env.SENTRY_DSN) {
    Sentry.setupExpressErrorHandler(app);
  }

  // Enhanced error handling with structured logging and security
  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Log error with context but redact sensitive information
    const errorContext = {
      error: {
        message: err.message,
        stack: err.stack,
        status,
        code: err.code,
      },
      request: {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get("user-agent"),
      },
      timestamp: new Date().toISOString(),
    };

    if (status >= 500) {
      logger.error(errorContext, "Server error occurred");
    } else {
      logger.warn(errorContext, "Client error occurred");
    }

    // Send structured error response
    const errorResponse: any = {
      error: {
        message: status >= 500 ? "Internal server error" : message,
        status,
        timestamp: new Date().toISOString(),
      },
    };

    // In development, include more details
    if (process.env.NODE_ENV === "development") {
      errorResponse.error.details = message;
      errorResponse.error.stack = err.stack;
    }

    res.status(status).json(errorResponse);
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  try {
    if (app.get("env") === "development") {
      logger.info("🔧 Setting up Vite development server...");
      const { setupVite: setupViteFn } = await import("./vite");
      await setupViteFn(app, server);
      logger.info("✅ Vite setup complete");
    } else {
      logger.info("📦 Serving static files for production...");
      
      // Production: serve static files from build output
      // Use path.resolve for portable paths across environments
      const distPublicPath = path.resolve(process.cwd(), "dist/public");
      logger.info({ distPublicPath }, "Static file path resolved");
      
      app.use(express.static(distPublicPath));
      
      const indexHtmlPath = path.resolve(distPublicPath, "index.html");
      app.use("*", (req, res, next) => {
        if (res.headersSent || req.originalUrl.startsWith('/api')) {
          return next();
        }
        res.sendFile(indexHtmlPath);
      });
      
      logger.info("✅ Production static file serving configured");
    }
  } catch (error) {
    logger.error({ error }, "❌ Vite/static setup failed");
    throw error;
  }

  // Background initialization - runs after routes and static are configured
  // Server is already listening above, so these are truly non-blocking
  (async () => {
    try {
      logger.info("🔧 Starting database seeding (background)...");
          const [result] = await db
            .select({ count: count() })
            .from(playbookLibrary);
          const playbookCount = Number(result?.count || 0);
          const REQUIRED_PLAYBOOK_COUNT = 170; // Updated: 148 original + 18 AI Governance playbooks + 4 additional

          if (playbookCount < REQUIRED_PLAYBOOK_COUNT) {
            logger.info(
              `📦 Database has ${playbookCount}/${REQUIRED_PLAYBOOK_COUNT} playbooks - adding missing entries...`,
            );
            // Additive migration: insert missing Compound playbooks by name lookup
            // This avoids destructive wipe which breaks FK constraints on task sequences
            const { playbookDomains, playbookCategories } = await import("@shared/schema");
            const domains = await db.select().from(playbookDomains);
            const categories = await db.select().from(playbookCategories);

            const domainByName = (name: string) => domains.find(d => d.name === name)?.id;
            const catByName = (name: string) => categories.find(c => c.name === name)?.id;

            const compoundPlaybooks = [
              {
                playbookNumber: 181,
                domainId: domainByName("Technology & Innovation"),
                categoryId: catByName("Cybersecurity Incidents"),
                name: "Compound: Cyber + Regulatory Cascade",
                description: "Multi-domain response for data breaches that trigger simultaneous GDPR penalties, SEC disclosure requirements, and customer notification obligations across multiple jurisdictions. Coordinates cybersecurity containment, legal compliance, regulatory filings, and crisis communications in parallel.",
                triggerCriteria: "Data breach detected with regulatory reporting obligations across multiple jurisdictions (GDPR, SEC, state notification laws)",
                tier1Stakeholders: ["CISO", "General Counsel", "Data Protection Officer"],
                tier2Stakeholders: ["CFO", "VP Communications", "CTO"],
                tier3Stakeholders: ["Board Secretary", "VP Customer Success", "Regional Compliance Officers"],
                primaryResponseStrategy: "Parallel activation of cyber containment, regulatory notification, legal response, and stakeholder communication workstreams with unified command structure",
                preApprovedBudget: "2500000",
                budgetApprovalRequired: false,
                targetExecutionTime: 12,
                isActive: true,
                isPremium: false,
                primaryExecutiveRole: "CISO",
                severityScore: 9,
                timeSensitivity: 4,
                tier1Count: 3,
                tier2Count: 3,
                tier3Count: 3,
                targetResponseSpeed: 12,
                targetStakeholderReach: "1",
                strategicCategory: "special_teams",
              },
              {
                playbookNumber: 182,
                domainId: domainByName("Operational Excellence"),
                categoryId: catByName("Supply Chain Crises"),
                name: "Compound: Geopolitical + Supply Chain Disruption",
                description: "Cross-domain response for tariff escalations, sanctions, or geopolitical events that simultaneously disrupt supply chains, require market repositioning, and trigger financial restructuring. Coordinates procurement, operations, finance, sales, and board communications.",
                triggerCriteria: "Geopolitical event (tariff, sanctions, conflict) impacts critical supplier or trade route affecting multiple business units",
                tier1Stakeholders: ["COO", "Chief Procurement Officer", "CFO"],
                tier2Stakeholders: ["VP Supply Chain", "General Counsel", "VP Sales"],
                tier3Stakeholders: ["Board Secretary", "VP Manufacturing", "Regional Operations Directors"],
                primaryResponseStrategy: "Simultaneous supplier diversification, cost structure realignment, customer communication, and board briefing with cross-functional war room coordination",
                preApprovedBudget: "5000000",
                budgetApprovalRequired: false,
                targetExecutionTime: 12,
                isActive: true,
                isPremium: false,
                primaryExecutiveRole: "COO",
                severityScore: 8,
                timeSensitivity: 8,
                tier1Count: 3,
                tier2Count: 3,
                tier3Count: 3,
                targetResponseSpeed: 12,
                targetStakeholderReach: "1",
                strategicCategory: "defense",
              },
              {
                playbookNumber: 183,
                domainId: domainByName("Operational Excellence"),
                categoryId: catByName("Facility & Infrastructure"),
                name: "Compound: Climate + Operations Cascade",
                description: "Multi-domain response for severe weather or climate events causing facility shutdowns with cascading impact on customer operations, logistics networks, employee safety, and insurance/recovery processes. Coordinates facilities, logistics, HR, customer success, and risk management in parallel.",
                triggerCriteria: "Severe weather event or climate disruption threatens or impacts primary operational facility with customer-facing service dependencies",
                tier1Stakeholders: ["COO", "VP Facilities", "CHRO"],
                tier2Stakeholders: ["VP Customer Success", "Chief Risk Officer", "VP Logistics"],
                tier3Stakeholders: ["Insurance Liaison", "Regional Safety Officers", "VP Communications"],
                primaryResponseStrategy: "Parallel workstreams for employee safety, facility protection, customer service continuity, logistics rerouting, and insurance/recovery planning with 72-hour recovery timeline",
                preApprovedBudget: "3000000",
                budgetApprovalRequired: false,
                targetExecutionTime: 12,
                isActive: true,
                isPremium: false,
                primaryExecutiveRole: "COO",
                severityScore: 8,
                timeSensitivity: 6,
                tier1Count: 3,
                tier2Count: 3,
                tier3Count: 3,
                targetResponseSpeed: 12,
                targetStakeholderReach: "1",
                strategicCategory: "defense",
              },
              {
                playbookNumber: 184,
                domainId: domainByName("AI Governance"),
                categoryId: catByName("AI Risk & Safety"),
                name: "Compound: AI + Workforce Transformation Crisis",
                description: "Cross-domain response for AI automation announcements that trigger union/labor responses, media scrutiny, regulatory inquiry, and employee morale concerns. Coordinates HR, legal, communications, technology leadership, and executive team for unified stakeholder management across internal and external audiences.",
                triggerCriteria: "AI automation initiative leaked or announced prematurely triggering workforce concern, union response, media attention, or regulatory inquiry",
                tier1Stakeholders: ["CHRO", "CTO", "General Counsel"],
                tier2Stakeholders: ["VP Communications", "Chief AI Officer", "CEO"],
                tier3Stakeholders: ["Union Relations Lead", "VP Employee Experience", "Board Secretary"],
                primaryResponseStrategy: "Coordinated stakeholder management across HR, legal, communications, and technology with unified messaging, employee reskilling initiatives, and regulatory compliance for AI workforce transformation",
                preApprovedBudget: "1500000",
                budgetApprovalRequired: false,
                targetExecutionTime: 12,
                isActive: true,
                isPremium: false,
                primaryExecutiveRole: "CHRO",
                severityScore: 8,
                timeSensitivity: 4,
                tier1Count: 3,
                tier2Count: 3,
                tier3Count: 3,
                targetResponseSpeed: 12,
                targetStakeholderReach: "1",
                strategicCategory: "special_teams",
              },
            ];

            let added = 0;
            for (const p of compoundPlaybooks) {
              if (!p.domainId) { logger.warn(`⚠️ Domain not found for compound playbook: ${p.name}`); continue; }
              const existing = await db.select({ id: playbookLibrary.id }).from(playbookLibrary).where(eq(playbookLibrary.name, p.name)).limit(1);
              if (existing.length === 0) {
                await db.insert(playbookLibrary).values(p as any);
                added++;
                logger.info(`✅ Added missing playbook: ${p.name}`);
              }
            }
            logger.info(`✅ Additive migration complete: added ${added} missing compound playbooks (total now ${playbookCount + added})`);
          } else {
            logger.info(
              `✅ Database already seeded with ${playbookCount} playbooks`,
            );
          }

          // Seed enriched playbook content (phases, why it matters, signal sources)
          await seedEnrichedPlaybooks();

          // Ensure playbooks table has all required columns (production migration)
          try {
            await db.execute(sql`ALTER TABLE playbooks ADD COLUMN IF NOT EXISTS strategic_objectives jsonb`);
            await db.execute(sql`ALTER TABLE playbooks ADD COLUMN IF NOT EXISTS execution_progress_toward_goal integer DEFAULT 0`);
            logger.info("✅ Ensured playbooks columns exist (strategic_objectives, execution_progress_toward_goal)");
          } catch (e) {
            logger.warn("Could not add playbooks columns (may already exist)");
          }

          // Ensure investor_leads table exists (production migration — investor gate)
          try {
            await db.execute(sql`CREATE TABLE IF NOT EXISTS investor_leads (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              name TEXT NOT NULL,
              email TEXT NOT NULL,
              company TEXT NOT NULL,
              role TEXT NOT NULL,
              page_accessed TEXT NOT NULL DEFAULT '/investor-resources',
              created_at TIMESTAMP DEFAULT NOW()
            )`);
            logger.info("✅ Ensured investor_leads table exists");
          } catch (e) {
            logger.warn("Could not ensure investor_leads table");
          }

          // Ensure strategic_recordings table exists (production migration — Strategic Recorder WOW feature)
          try {
            await db.execute(sql`CREATE TABLE IF NOT EXISTS strategic_recordings (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              organization_id UUID NOT NULL,
              user_id TEXT NOT NULL,
              title TEXT NOT NULL,
              raw_input TEXT NOT NULL,
              input_type TEXT NOT NULL DEFAULT 'text',
              generated_playbooks JSONB,
              status TEXT NOT NULL DEFAULT 'processing',
              created_at TIMESTAMP DEFAULT NOW()
            )`);
            logger.info("✅ Ensured strategic_recordings table exists");
          } catch (e) {
            logger.warn("Could not ensure strategic_recordings table");
          }

          // Ensure action_items table exists (production migration)
          try {
            await db.execute(sql`CREATE TABLE IF NOT EXISTS action_items (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              organization_id UUID NOT NULL,
              recommendation_id UUID,
              initiative_id UUID,
              scenario_id UUID,
              title VARCHAR(255) NOT NULL,
              description TEXT NOT NULL,
              priority VARCHAR(10) DEFAULT 'medium',
              status VARCHAR(20) DEFAULT 'pending',
              assigned_to VARCHAR NOT NULL,
              assigned_by VARCHAR,
              due_date TIMESTAMP,
              completed_at TIMESTAMP,
              estimated_effort INTEGER,
              actual_effort INTEGER,
              dependencies JSONB,
              approvals JSONB,
              outcome TEXT,
              tags JSONB,
              created_at TIMESTAMP DEFAULT NOW(),
              updated_at TIMESTAMP DEFAULT NOW()
            )`);
            logger.info("✅ Ensured action_items table exists");
          } catch (e) {
            logger.warn("Could not create action_items table (may already exist)");
          }

          // Fix strategic categories for existing playbooks (production migration)
          // This ensures the 58/56/52 split even for records created before category logic was added
          // Version 2: Force fix on deployment
          logger.info("🔧 [v2] Checking strategic category distribution...");
          const categoryCheck = await db.execute(sql`
          SELECT strategic_category, COUNT(*) as cnt 
          FROM playbook_library 
          GROUP BY strategic_category
        `);
          const categoryCounts: Record<string, number> = {};
          for (const row of categoryCheck.rows) {
            categoryCounts[row.strategic_category as string] = Number(row.cnt);
          }
          logger.info({ categoryCounts }, "Current category distribution");

          // If all playbooks are in defense (common migration issue), fix them
          const offenseCount = categoryCounts["offense"] || 0;
          const defenseCount = categoryCounts["defense"] || 0;
          const specialTeamsCount = categoryCounts["special_teams"] || 0;

          if (
            offenseCount !== 58 ||
            defenseCount !== 56 ||
            specialTeamsCount !== 52
          ) {
            logger.info("🔧 Fixing strategic category assignments using domain names (UUID-safe)...");

            // OFFENSE domains: Market Dynamics (seq 1), Market Opportunities (seq 8)
            await db.execute(
              sql`UPDATE playbook_library SET strategic_category = 'offense' WHERE domain_id IN (SELECT id FROM playbook_domains WHERE name IN ('Market Dynamics', 'Market Opportunities'))`,
            );
            // Financial Strategy: 18 OFFENSE, 5 DEFENSE, 1 SPECIAL TEAMS (by playbook name for UUID safety)
            await db.execute(
              sql`UPDATE playbook_library SET strategic_category = 'offense' 
                  WHERE domain_id IN (SELECT id FROM playbook_domains WHERE name = 'Financial Strategy') 
                  AND name IN ('Accounting Irregularity Discovery', 'Activist Investor Campaign', 'Algorithmic Trading Malfunction',
                    'Auditor Disagreement', 'Bank Credit Line Revocation', 'Cash Flow Crisis',
                    'Correspondent Bank Failure', 'Credit Rating Downgrade', 'Currency Crisis (FX Exposure)',
                    'Failed Fundraising Round', 'Financial Control Failure', 'Hostile Takeover Attempt',
                    'Liquidity Crisis / Bank Run', 'Major Customer Payment Default', 'Revenue Shortfall (Miss Guidance)',
                    'SWIFT/Payment System Disruption', 'Stock Price Crash (Public Company)', 'Unexpected Tax Liability')`,
            );
            await db.execute(
              sql`UPDATE playbook_library SET strategic_category = 'defense' 
                  WHERE domain_id IN (SELECT id FROM playbook_domains WHERE name = 'Financial Strategy') 
                  AND name IN ('Commodity Price Spike', 'Commodity Trading Desk Rogue Trader', 'M&A Target Acquisition (Offensive)',
                    'Major Customer Bankruptcy', 'Strategic Fundraising (IPO/Series)')`,
            );
            await db.execute(
              sql`UPDATE playbook_library SET strategic_category = 'special_teams' 
                  WHERE domain_id IN (SELECT id FROM playbook_domains WHERE name = 'Financial Strategy') 
                  AND name = 'Portfolio Rebalancing'`,
            );
            // DEFENSE domains: Operational Excellence (seq 2), Regulatory & Compliance (seq 4), Brand & Reputation (seq 7)
            await db.execute(
              sql`UPDATE playbook_library SET strategic_category = 'defense' WHERE domain_id IN (SELECT id FROM playbook_domains WHERE name IN ('Operational Excellence', 'Regulatory & Compliance', 'Brand & Reputation'))`,
            );
            // SPECIAL TEAMS domains: Technology & Innovation (seq 5), Talent & Leadership (seq 6), AI Governance (seq 9)
            await db.execute(
              sql`UPDATE playbook_library SET strategic_category = 'special_teams' WHERE domain_id IN (SELECT id FROM playbook_domains WHERE name IN ('Technology & Innovation', 'Talent & Leadership', 'AI Governance'))`,
            );

            // Verify the fix
            const verifyCheck = await db.execute(sql`
            SELECT strategic_category, COUNT(*) as cnt 
            FROM playbook_library 
            GROUP BY strategic_category
          `);
            const newCounts: Record<string, number> = {};
            for (const row of verifyCheck.rows) {
              newCounts[row.strategic_category as string] = Number(row.cnt);
            }
            logger.info({ newCounts }, "✅ Strategic categories fixed");
          } else {
            logger.info("✅ Strategic categories already correct (58/56/52)");
          }

          // Seed triggers and signal-to-playbook associations
          // Always run seedTriggers - it internally checks if demo org has triggers and creates them if needed
          logger.info(
            "🎯 Checking/seeding intelligence triggers for demo organization...",
          );
          await seedTriggers();
          const stats = await getTriggerStats();
          logger.info(
            `✅ Trigger seeding check completed: ${stats.triggers} triggers, ${stats.associations} associations, ${stats.signals} signals`,
          );

          // Seed demo scenarios for investor/customer presentations
          logger.info("🎭 Checking demo scenarios...");
          await seedDemoScenarios();

          // Initialize Enterprise Job Service (non-blocking)
          logger.info("🔧 Initializing Enterprise Job Service...");
          await enterpriseJobService.initialize();

          seedingComplete = true;
          console.log("✅ BACKGROUND SEEDING COMPLETE");
          logger.info("✅ Background initialization complete - all systems ready");
        } catch (error) {
          logger.error({ error }, "❌ Database seeding failed (non-blocking)");
          console.error("🔴 Database seeding error (server still running):", error);
          // Server is already marked ready - seeding failure doesn't block the app
        }
  })();
})();

// Prevent process from exiting on unhandled errors - WITH DETAILED LOGGING
process.on("unhandledRejection", (reason, promise) => {
  const errorDetail =
    reason instanceof Error
      ? { message: reason.message, stack: reason.stack }
      : reason;
  logger.error(
    {
      reason: errorDetail,
      promiseState: String(promise),
      type: typeof reason,
    },
    "❌ UNHANDLED REJECTION DETECTED - INVESTIGATING",
  );
  console.error("🔴 UNHANDLED REJECTION:", errorDetail);
});

process.on("uncaughtException", (error) => {
  logger.error(
    {
      message: error.message,
      stack: error.stack,
    },
    "❌ UNCAUGHT EXCEPTION DETECTED",
  );
  console.error("🔴 UNCAUGHT EXCEPTION:", error);
});
