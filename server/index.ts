import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic, log } from "./vite";
import type { setupVite } from "./vite";
import { auditLogger } from "./middleware/audit-logging";
import { setupSwagger } from "./swagger";
// import { proactiveAIRadar } from "./proactive-ai-radar"; // DISABLED - causing startup hang
import { enterpriseJobService } from "./services/EnterpriseJobService";
import { openAIService } from "./services/OpenAIService";
import { seedPlaybookLibrary } from "./seeds/playbookLibrarySeed";
import { seedTriggers, getTriggerStats } from "./seeds/triggersSeed";
import { seedDemoScenarios } from "./seeds/demoScenariosSeed";
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

// CRITICAL: Track server readiness for health checks
// Server is NOT ready until database seeding is complete
let serverReady = false;

// Health check endpoints - MUST be registered FIRST before any other routes
// These ensure the app responds to health checks immediately on startup
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/ready", (_req, res) => {
  if (serverReady) {
    res
      .status(200)
      .json({ status: "ready", timestamp: new Date().toISOString() });
  } else {
    res
      .status(503)
      .json({ status: "initializing", timestamp: new Date().toISOString() });
  }
});

app.get("/_health", (_req, res) => {
  if (serverReady) {
    res
      .status(200)
      .json({ status: "ok", ready: true, timestamp: new Date().toISOString() });
  } else {
    res.status(503).json({
      status: "starting",
      ready: false,
      timestamp: new Date().toISOString(),
    });
  }
});

// HEAD request on root for fast health checks (used by some load balancers)
// Always return 200 - the app is available as soon as Express starts
app.head("/", (_req, res) => {
  res.status(200).end();
});

// CRITICAL: Root "/" health check for Replit Autoscale deployments
// This MUST return 200 immediately - seeding happens in background after server starts
// Registered before other middleware to ensure fastest possible response
let rootHealthCheckRegistered = false;

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

(async () => {
  // Health check endpoints are now registered at the top of the file
  // before any middleware to ensure instant response for Autoscale health checks

  const server = await registerRoutes(app);

  // Set up API documentation
  setupSwagger(app);

  // Mark server ready IMMEDIATELY after routes are registered
  // This ensures health checks pass during Vite/static setup and database seeding
  serverReady = true;
  logger.info("✅ Server marked ready for health checks (routes registered)");

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
      logger.info("📦 Serving static files...");
      
      // CRITICAL: Register root "/" FIRST for Autoscale health checks in production
      // Must return 200 immediately - this is the health check endpoint
      if (!rootHealthCheckRegistered) {
        app.get("/", (_req, res) => {
          // Return index.html for browser requests (Accept header includes text/html)
          const acceptHeader = _req.headers.accept || '';
          if (acceptHeader.includes('text/html')) {
            return res.sendFile("/app/dist/public/index.html");
          }
          // Return fast JSON for health check requests (curl, load balancers, etc.)
          res.status(200).json({ status: "ok", app: "ExecuteIQ", timestamp: new Date().toISOString() });
        });
        rootHealthCheckRegistered = true;
        logger.info("✅ Root health check endpoint registered for production");
      }
      
      // Production: serve static files from build output
      // Use custom middleware to serve index.html for SPA routes while allowing API routes through
      app.use(express.static("/app/dist/public", {
        index: false // Disable automatic index.html serving - we handle "/" explicitly
      }));
      
      serveStatic(app);
      
      // Catch-all route serves SPA for client-side routing (must be last)
      // Excludes "/" which is handled above for health checks
      app.get(/^\/(?!$).*/, (_req, res) => {
        res.sendFile("/app/dist/public/index.html");
      });
    }
  } catch (error) {
    logger.error({ error }, "❌ Vite/static setup failed");
    throw error;
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log("serving on port " + port);
      logger.info(
        { port, env: app.get("env") },
        "ExecuteIQ server started - health checks already passing",
      );

      // Minimal initialization - just seed database, no background jobs
      // Background services will be enabled after core stability is verified
      (async () => {
        try {
          logger.info("🔧 Starting database seeding (background)...");
          const [result] = await db
            .select({ count: count() })
            .from(playbookLibrary);
          const playbookCount = Number(result?.count || 0);
          const REQUIRED_PLAYBOOK_COUNT = 166; // Updated: 148 original + 18 AI Governance playbooks

          if (playbookCount < REQUIRED_PLAYBOOK_COUNT) {
            logger.info(
              `📦 Database has ${playbookCount}/${REQUIRED_PLAYBOOK_COUNT} playbooks - reseeding...`,
            );
            // Clear existing incomplete data and reseed
            if (playbookCount > 0) {
              logger.info(
                "🗑️ Clearing incomplete playbook data for fresh seed...",
              );
              // Clear dependent tables first to avoid foreign key violations
              const {
                playbookCategories,
                playbookDomains,
                practiceDrills,
                playbookTriggerAssociations,
              } = await import("@shared/schema");
              await db.delete(practiceDrills);
              await db.delete(playbookTriggerAssociations);
              await db.delete(playbookLibrary);
              await db.delete(playbookCategories);
              await db.delete(playbookDomains);
            }
            await seedPlaybookLibrary();
            logger.info(
              "✅ Database seeding completed with all 166 playbooks (including AI Governance)!",
            );
          } else {
            logger.info(
              `✅ Database already seeded with ${playbookCount} playbooks`,
            );
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
            logger.info("🔧 Fixing strategic category assignments...");

            // Domain 1 (Market Entry): OFFENSE
            await db.execute(
              sql`UPDATE playbook_library SET strategic_category = 'offense' WHERE domain_id = 1`,
            );
            // Domain 2 (M&A): OFFENSE
            await db.execute(
              sql`UPDATE playbook_library SET strategic_category = 'offense' WHERE domain_id = 2`,
            );
            // Domain 3 (Product Launch): Split - first 18 OFFENSE, next 5 DEFENSE, last 1 SPECIAL TEAMS
            await db.execute(
              sql`UPDATE playbook_library SET strategic_category = 'offense' WHERE domain_id = 3 AND playbook_number <= 18`,
            );
            await db.execute(
              sql`UPDATE playbook_library SET strategic_category = 'defense' WHERE domain_id = 3 AND playbook_number > 18 AND playbook_number <= 23`,
            );
            await db.execute(
              sql`UPDATE playbook_library SET strategic_category = 'special_teams' WHERE domain_id = 3 AND playbook_number > 23`,
            );
            // Domain 4 (Crisis): DEFENSE
            await db.execute(
              sql`UPDATE playbook_library SET strategic_category = 'defense' WHERE domain_id = 4`,
            );
            // Domain 5 (Cyber): DEFENSE
            await db.execute(
              sql`UPDATE playbook_library SET strategic_category = 'defense' WHERE domain_id = 5`,
            );
            // Domain 6 (Regulatory): DEFENSE
            await db.execute(
              sql`UPDATE playbook_library SET strategic_category = 'defense' WHERE domain_id = 6`,
            );
            // Domain 7 (Digital Transform): SPECIAL TEAMS
            await db.execute(
              sql`UPDATE playbook_library SET strategic_category = 'special_teams' WHERE domain_id = 7`,
            );
            // Domain 8 (Competitive): SPECIAL TEAMS
            await db.execute(
              sql`UPDATE playbook_library SET strategic_category = 'special_teams' WHERE domain_id = 8`,
            );
            // Domain 9 (AI Governance): SPECIAL TEAMS
            await db.execute(
              sql`UPDATE playbook_library SET strategic_category = 'special_teams' WHERE domain_id = 9`,
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

          console.log("✅ BACKGROUND SEEDING COMPLETE");
          logger.info("✅ Background initialization complete - all systems ready");
        } catch (error) {
          logger.error({ error }, "❌ Database seeding failed (non-blocking)");
          console.error("🔴 Database seeding error (server still running):", error);
          // Server is already marked ready - seeding failure doesn't block the app
        }
      })();
    },
  );
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
