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
import { playbookLibrary, executiveTriggers, stakeholderContacts } from "@shared/schema";
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
  res.status(200).json({ status: "ok", app: "Readiness OS", timestamp: new Date().toISOString() });
});

app.get("/api/health-check", (_req, res) => {
  res.status(200).json({ 
    status: "ok", 
    app: "Readiness OS", 
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
  app.use(express.static(distPublicPath, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }
    }
  }));
  const indexHtmlPath = path.resolve(distPublicPath, "index.html");
  // Handle GET / immediately — this is what Replit's healthcheck hits
  app.get("/", (_req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(indexHtmlPath);
  });
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
      "Readiness OS server listening - health checks active from startup",
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
      
      app.use(express.static(distPublicPath, {
        setHeaders: (res, filePath) => {
          if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
          }
        }
      }));
      
      const indexHtmlPath = path.resolve(distPublicPath, "index.html");
      app.use("*", (req, res, next) => {
        if (res.headersSent || req.originalUrl.startsWith('/api')) {
          return next();
        }
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
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
          const REQUIRED_PLAYBOOK_COUNT = 210; // 180 single-domain (#1-180) + 30 compound (#181-210)

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
              // Single-domain protocols 171–180 (AI Governance — added in v2.1 to reach full 180)
              { playbookNumber: 171, domainId: domainByName("AI Governance"), categoryId: catByName("AI Risk & Safety"), name: "AI Intellectual Property Dispute", description: "AI-generated content or training data sourcing triggers copyright, IP infringement, or misappropriation claim requiring immediate legal assessment and use suspension.", triggerCriteria: "AI-generated content or training data sourcing triggers copyright, IP infringement, or misappropriation claim", tier1Stakeholders: ["General Counsel", "CTO", "CPO"], tier2Stakeholders: ["CEO", "External IP Counsel"], tier3Stakeholders: [], primaryResponseStrategy: "Content provenance and training data licensing reviewed immediately, affected AI outputs suspended, and settlement vs. litigation analysis completed within 72 hours", preApprovedBudget: "5000000", budgetApprovalRequired: false, targetExecutionTime: 48, isActive: true, isPremium: false, primaryExecutiveRole: "CLO", severityScore: 8, timeSensitivity: 8, tier1Count: 3, tier2Count: 2, tier3Count: 0, targetResponseSpeed: 48, targetStakeholderReach: "1", strategicCategory: "special_teams" },
              { playbookNumber: 172, domainId: domainByName("AI Governance"), categoryId: catByName("AI Risk & Safety"), name: "AI Model Performance Degradation", description: "Production AI model accuracy drops significantly due to data drift, model decay, or distribution shift requiring emergency retraining.", triggerCriteria: "Production AI model accuracy drops significantly due to data drift, model decay, or distribution shift", tier1Stakeholders: ["CTO", "Data Science Lead", "CPO"], tier2Stakeholders: ["VP Operations", "VP Customer Success"], tier3Stakeholders: [], primaryResponseStrategy: "Root cause diagnosed within 24 hours through drift analysis, emergency retraining pipeline initiated, and customer communication issued for impacted applications", preApprovedBudget: "1000000", budgetApprovalRequired: false, targetExecutionTime: 24, isActive: true, isPremium: false, primaryExecutiveRole: "CTO", severityScore: 7, timeSensitivity: 6, tier1Count: 3, tier2Count: 2, tier3Count: 0, targetResponseSpeed: 24, targetStakeholderReach: "1", strategicCategory: "special_teams" },
              { playbookNumber: 173, domainId: domainByName("AI Governance"), categoryId: catByName("AI Risk & Safety"), name: "AI Cost Overrun Crisis", description: "AI inference or training infrastructure costs exceed approved budget by 50%+ threatening project viability and unit economics.", triggerCriteria: "AI inference or training infrastructure costs exceed approved budget by 50%+ threatening project viability", tier1Stakeholders: ["CFO", "CTO", "COO"], tier2Stakeholders: ["Chief Procurement Officer", "VP Engineering"], tier3Stakeholders: [], primaryResponseStrategy: "Usage audit identifies cost concentration within 24 hours, model optimization deployed to reduce inference costs, and vendor negotiation initiated for volume rate improvements", preApprovedBudget: "500000", budgetApprovalRequired: false, targetExecutionTime: 24, isActive: true, isPremium: false, primaryExecutiveRole: "CFO", severityScore: 6, timeSensitivity: 4, tier1Count: 3, tier2Count: 2, tier3Count: 0, targetResponseSpeed: 24, targetStakeholderReach: "1", strategicCategory: "special_teams" },
              { playbookNumber: 174, domainId: domainByName("AI Governance"), categoryId: catByName("AI Risk & Safety"), name: "AI Deepfake Attack", description: "Deepfake video, audio, or image impersonating executives used for wire fraud, reputation attack, or market manipulation.", triggerCriteria: "Deepfake video, audio, or image impersonating executives detected — wire fraud, reputation attack, or market manipulation risk", tier1Stakeholders: ["CEO", "CISO", "General Counsel"], tier2Stakeholders: ["VP Communications", "External Counsel"], tier3Stakeholders: [], primaryResponseStrategy: "Content takedown requests submitted within 1 hour, FBI financial fraud unit notified, and proactive media statement published with executive verification before mass circulation", preApprovedBudget: "3000000", budgetApprovalRequired: false, targetExecutionTime: 1, isActive: true, isPremium: false, primaryExecutiveRole: "CISO", severityScore: 9, timeSensitivity: 10, tier1Count: 3, tier2Count: 2, tier3Count: 0, targetResponseSpeed: 1, targetStakeholderReach: "1", strategicCategory: "special_teams" },
              { playbookNumber: 175, domainId: domainByName("AI Governance"), categoryId: catByName("AI Risk & Safety"), name: "AI Workforce Transition", description: "AI implementation displaces significant workforce requiring coordinated and legally compliant transition planning across HR, legal, and communications.", triggerCriteria: "AI implementation displaces significant workforce requiring coordinated and legally compliant transition planning", tier1Stakeholders: ["CHRO", "CEO", "CFO"], tier2Stakeholders: ["COO", "VP Communications"], tier3Stakeholders: [], primaryResponseStrategy: "Retraining and reskilling programs deployed before displacement announcements, union engagement initiated, and positioning framed around human-AI collaboration and new role creation", preApprovedBudget: "15000000", budgetApprovalRequired: true, targetExecutionTime: 72, isActive: true, isPremium: false, primaryExecutiveRole: "CHRO", severityScore: 8, timeSensitivity: 6, tier1Count: 3, tier2Count: 2, tier3Count: 0, targetResponseSpeed: 72, targetStakeholderReach: "1", strategicCategory: "special_teams" },
              { playbookNumber: 176, domainId: domainByName("AI Governance"), categoryId: catByName("AI Risk & Safety"), name: "AI Governance Framework Violation", description: "Internal audit reveals AI deployments operating outside established governance policies and risk thresholds requiring enforcement action.", triggerCriteria: "Internal audit reveals AI deployments operating outside established governance policies and risk thresholds", tier1Stakeholders: ["CTO", "General Counsel", "VP Internal Audit"], tier2Stakeholders: ["CEO", "Chief Risk Officer"], tier3Stakeholders: [], primaryResponseStrategy: "Non-compliant systems suspended pending conformity review, root cause analysis identifying bypassed approval processes, and Board-level remediation plan established", preApprovedBudget: "1500000", budgetApprovalRequired: false, targetExecutionTime: 24, isActive: true, isPremium: false, primaryExecutiveRole: "CTO", severityScore: 7, timeSensitivity: 5, tier1Count: 3, tier2Count: 2, tier3Count: 0, targetResponseSpeed: 24, targetStakeholderReach: "1", strategicCategory: "special_teams" },
              { playbookNumber: 177, domainId: domainByName("AI Governance"), categoryId: catByName("AI Risk & Safety"), name: "Agentic AI Runaway Response", description: "Autonomous AI agent takes unexpected consequential actions beyond authorized scope causing operational or financial harm requiring immediate containment.", triggerCriteria: "Autonomous AI agent takes unexpected consequential actions beyond authorized scope causing operational or financial harm", tier1Stakeholders: ["CTO", "COO", "CEO"], tier2Stakeholders: ["General Counsel", "VP Engineering"], tier3Stakeholders: [], primaryResponseStrategy: "All active agent processes terminated within 12 minutes, actions catalogued and reversed where possible, and hard authorization controls deployed before any agentic system restarts", preApprovedBudget: "5000000", budgetApprovalRequired: false, targetExecutionTime: 0, isActive: true, isPremium: false, primaryExecutiveRole: "CTO", severityScore: 10, timeSensitivity: 10, tier1Count: 3, tier2Count: 2, tier3Count: 0, targetResponseSpeed: 0, targetStakeholderReach: "1", strategicCategory: "special_teams" },
              { playbookNumber: 178, domainId: domainByName("AI Governance"), categoryId: catByName("AI Risk & Safety"), name: "AI Explainability Challenge", description: "Regulatory or legal requirement to explain AI decision-making in consequential high-stakes context such as lending, hiring, healthcare, or criminal justice.", triggerCriteria: "Regulatory or legal requirement to explain AI decision-making in a consequential high-stakes context", tier1Stakeholders: ["General Counsel", "CTO", "Data Science Lead"], tier2Stakeholders: ["Chief Compliance Officer", "External Regulatory Counsel"], tier3Stakeholders: [], primaryResponseStrategy: "Model documentation and SHAP/LIME explanation tools deployed against the challenged decision, adverse action notices prepared, and expert testimony preparation initiated", preApprovedBudget: "2000000", budgetApprovalRequired: false, targetExecutionTime: 48, isActive: true, isPremium: false, primaryExecutiveRole: "CLO", severityScore: 8, timeSensitivity: 6, tier1Count: 3, tier2Count: 2, tier3Count: 0, targetResponseSpeed: 48, targetStakeholderReach: "1", strategicCategory: "special_teams" },
              { playbookNumber: 179, domainId: domainByName("AI Governance"), categoryId: catByName("AI Risk & Safety"), name: "AI Sustainability Compliance", description: "ESG requirements or regulations mandate AI environmental impact reporting including energy consumption, carbon footprint, or water usage disclosure.", triggerCriteria: "ESG requirements or regulations mandate AI environmental impact reporting — energy consumption, carbon footprint, or water usage disclosure", tier1Stakeholders: ["CFO", "CTO", "Chief Sustainability Officer"], tier2Stakeholders: ["General Counsel", "VP Operations"], tier3Stakeholders: [], primaryResponseStrategy: "Data center energy consumption and carbon attribution quantified by AI workload within 60 days, efficiency optimization deployed, and regulatory disclosure prepared with third-party verification", preApprovedBudget: "1000000", budgetApprovalRequired: false, targetExecutionTime: 72, isActive: true, isPremium: false, primaryExecutiveRole: "CFO", severityScore: 6, timeSensitivity: 3, tier1Count: 3, tier2Count: 2, tier3Count: 0, targetResponseSpeed: 72, targetStakeholderReach: "1", strategicCategory: "special_teams" },
              { playbookNumber: 180, domainId: domainByName("AI Governance"), categoryId: catByName("AI Risk & Safety"), name: "AI Competitive Disruption", description: "Competitor deploys an AI capability that fundamentally changes market dynamics and customer expectations requiring rapid strategic response.", triggerCriteria: "Competitor deploys an AI capability that fundamentally changes market dynamics and customer expectations", tier1Stakeholders: ["CEO", "CTO", "Chief Strategy Officer"], tier2Stakeholders: ["CPO", "Board"], tier3Stakeholders: [], primaryResponseStrategy: "Capability gap assessment completed within 72 hours, AI acceleration strategy developed with resourcing and timeline, and customer communication deployed to anchor loyalty before competitor narrative reaches installed base", preApprovedBudget: "20000000", budgetApprovalRequired: true, targetExecutionTime: 72, isActive: true, isPremium: false, primaryExecutiveRole: "CEO", severityScore: 9, timeSensitivity: 7, tier1Count: 3, tier2Count: 2, tier3Count: 0, targetResponseSpeed: 72, targetStakeholderReach: "1", strategicCategory: "offense" },
              // Compound protocols (181+)
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
              // Gap fill: core protocols 111–114 (previously unseeded)
              { playbookNumber: 111, domainId: domainByName("Regulatory & Compliance"), categoryId: catByName("Compliance Violations"), name: "EU AI Act Non-Compliance Discovery", description: "Internal audit or regulatory inquiry reveals AI system violating EU AI Act requirements — prohibited practices, unregistered high-risk systems, or transparency obligation failures.", triggerCriteria: "Internal audit or regulatory inquiry reveals AI system violating EU AI Act requirements", tier1Stakeholders: ["General Counsel", "CTO", "Chief AI Officer"], tier2Stakeholders: ["Data Protection Officer", "CEO", "Board"], tier3Stakeholders: [], primaryResponseStrategy: "High-risk AI systems suspended pending conformity assessment, market surveillance authority notified within mandatory window, and EU regulatory counsel retained for remediation roadmap within 48 hours", preApprovedBudget: "5000000", budgetApprovalRequired: false, targetExecutionTime: 48, isActive: true, isPremium: false, primaryExecutiveRole: "CLO", severityScore: 9, timeSensitivity: 8, tier1Count: 3, tier2Count: 3, tier3Count: 0, targetResponseSpeed: 48, targetStakeholderReach: "1", strategicCategory: "special_teams" },
              { playbookNumber: 112, domainId: domainByName("Regulatory & Compliance"), categoryId: catByName("Government Investigations"), name: "CFIUS National Security Review", description: "CFIUS opens national security review of foreign investment in your company or M&A transaction involving a non-US acquirer.", triggerCriteria: "CFIUS opens national security review of foreign investment in your company or M&A transaction involving a non-US acquirer", tier1Stakeholders: ["CEO", "General Counsel", "CFO"], tier2Stakeholders: ["VP Government Affairs", "Board", "M&A Advisors"], tier3Stakeholders: [], primaryResponseStrategy: "National security counsel retained immediately, mitigation agreement framework drafted proactively, and business unit national security risk assessment completed before CFIUS staff analysis defines remediation scope", preApprovedBudget: "5000000", budgetApprovalRequired: false, targetExecutionTime: 24, isActive: true, isPremium: false, primaryExecutiveRole: "CLO", severityScore: 9, timeSensitivity: 9, tier1Count: 3, tier2Count: 3, tier3Count: 0, targetResponseSpeed: 24, targetStakeholderReach: "1", strategicCategory: "special_teams" },
              { playbookNumber: 113, domainId: domainByName("Regulatory & Compliance"), categoryId: catByName("Compliance Violations"), name: "DORA Digital Operational Resilience Audit", description: "EU Digital Operational Resilience Act audit reveals ICT risk management gaps — threat-led penetration testing failures, third-party ICT reporting deficiencies, or incident reporting non-compliance.", triggerCriteria: "EU DORA audit reveals ICT risk management gaps including penetration testing failures or incident reporting non-compliance", tier1Stakeholders: ["General Counsel", "CISO", "CTO"], tier2Stakeholders: ["Chief Compliance Officer", "CFO"], tier3Stakeholders: [], primaryResponseStrategy: "ICT risk register updated, critical third-party ICT providers formally notified and assessed, and incident reporting workflows pre-staged for 4-hour initial notification and 72-hour intermediate report requirements", preApprovedBudget: "3000000", budgetApprovalRequired: false, targetExecutionTime: 72, isActive: true, isPremium: false, primaryExecutiveRole: "CISO", severityScore: 8, timeSensitivity: 7, tier1Count: 3, tier2Count: 2, tier3Count: 0, targetResponseSpeed: 72, targetStakeholderReach: "1", strategicCategory: "special_teams" },
              { playbookNumber: 114, domainId: domainByName("Financial Strategy"), categoryId: catByName("Financial Reporting"), name: "Global Minimum Tax / Pillar Two Exposure", description: "Tax advisory reveals significant exposure under OECD Pillar Two global minimum tax (15%) in low-tax jurisdictions generating material income.", triggerCriteria: "Tax advisory reveals significant exposure under OECD Pillar Two global minimum tax in low-tax jurisdictions", tier1Stakeholders: ["CFO", "VP Tax", "General Counsel"], tier2Stakeholders: ["VP Treasury", "CEO", "Board"], tier3Stakeholders: [], primaryResponseStrategy: "Subsidiary-level effective tax rate analysis completed by jurisdiction, qualified domestic minimum top-up tax positions evaluated, and Board briefed on potential top-up liability before fiscal year-end creates unavoidable disclosure", preApprovedBudget: "5000000", budgetApprovalRequired: false, targetExecutionTime: 72, isActive: true, isPremium: false, primaryExecutiveRole: "CFO", severityScore: 7, timeSensitivity: 5, tier1Count: 3, tier2Count: 3, tier3Count: 0, targetResponseSpeed: 72, targetStakeholderReach: "1", strategicCategory: "defense" },
              // Gap fill: core protocols 120–124
              { playbookNumber: 120, domainId: domainByName("Operational Excellence"), categoryId: catByName("System Failures"), name: "ERP Implementation Failure", description: "SAP, Oracle, or Workday go-live triggers critical system failures — financial reporting disruption, supply chain blocks, payroll failure, or customer order management collapse.", triggerCriteria: "ERP system go-live triggers critical failures disrupting financial reporting, supply chain, payroll, or customer orders", tier1Stakeholders: ["CTO", "COO", "CFO"], tier2Stakeholders: ["Implementation Partner Lead", "CEO", "VP Customer Success"], tier3Stakeholders: [], primaryResponseStrategy: "Rollback-vs-forward decision made within 4 hours before additional transactions corrupt the new system, manual workarounds deployed for critical processes, and implementation partner placed on formal remediation SLA with executive accountability", preApprovedBudget: "8000000", budgetApprovalRequired: false, targetExecutionTime: 4, isActive: true, isPremium: false, primaryExecutiveRole: "CTO", severityScore: 9, timeSensitivity: 9, tier1Count: 3, tier2Count: 3, tier3Count: 0, targetResponseSpeed: 4, targetStakeholderReach: "1", strategicCategory: "defense" },
              { playbookNumber: 121, domainId: domainByName("Operational Excellence"), categoryId: catByName("Third-Party Dependencies"), name: "Critical SaaS Vendor Price Shock", description: "Mission-critical SaaS vendor announces 150–400% price increase at contract renewal requiring immediate decision.", triggerCriteria: "Mission-critical SaaS vendor announces 150–400% price increase at contract renewal", tier1Stakeholders: ["CFO", "CTO", "Chief Procurement Officer"], tier2Stakeholders: ["COO", "General Counsel"], tier3Stakeholders: [], primaryResponseStrategy: "Renewal freeze issued while competitive alternatives evaluated within 48 hours, migration cost model completed to define credible walkaway price, and multi-vendor negotiation playbook deployed using migration threat as leverage", preApprovedBudget: "2000000", budgetApprovalRequired: false, targetExecutionTime: 48, isActive: true, isPremium: false, primaryExecutiveRole: "CFO", severityScore: 6, timeSensitivity: 6, tier1Count: 3, tier2Count: 2, tier3Count: 0, targetResponseSpeed: 48, targetStakeholderReach: "1", strategicCategory: "defense" },
              { playbookNumber: 122, domainId: domainByName("Market Dynamics"), categoryId: catByName("Market Position Threats"), name: "Channel Partner Conflict Escalation", description: "Top distribution partner publicly disputes exclusivity, margin terms, or competitive handling — threatening to defect or publicly damage the partnership.", triggerCriteria: "Top distribution partner publicly disputes exclusivity, margin terms, or competitive handling", tier1Stakeholders: ["CEO", "VP Channel Sales", "General Counsel"], tier2Stakeholders: ["CFO", "Chief Revenue Officer"], tier3Stakeholders: [], primaryResponseStrategy: "Executive-to-executive dialogue opened within 24 hours, contractual positions assessed with legal counsel before any public response, and alternative channel coverage pre-staged in the partner's territory before relationship formally breaks", preApprovedBudget: "1000000", budgetApprovalRequired: false, targetExecutionTime: 24, isActive: true, isPremium: false, primaryExecutiveRole: "CEO", severityScore: 7, timeSensitivity: 7, tier1Count: 3, tier2Count: 2, tier3Count: 0, targetResponseSpeed: 24, targetStakeholderReach: "1", strategicCategory: "offense" },
              { playbookNumber: 123, domainId: domainByName("Regulatory & Compliance"), categoryId: catByName("Government Investigations"), name: "Critical Infrastructure Designation", description: "DHS/CISA designates organization as critical infrastructure, triggering mandatory incident reporting, new security requirements, and federal coordination obligations.", triggerCriteria: "DHS/CISA designates organization as critical infrastructure triggering mandatory reporting and security requirements", tier1Stakeholders: ["CEO", "General Counsel", "CISO"], tier2Stakeholders: ["VP Government Affairs", "COO", "Board"], tier3Stakeholders: [], primaryResponseStrategy: "Mandatory 72-hour incident reporting procedures established, CISA coordination relationship formalized at executive level, and security architecture review initiated to meet sector-specific NIST framework requirements before first mandatory self-assessment", preApprovedBudget: "4000000", budgetApprovalRequired: false, targetExecutionTime: 72, isActive: true, isPremium: false, primaryExecutiveRole: "CISO", severityScore: 8, timeSensitivity: 6, tier1Count: 3, tier2Count: 3, tier3Count: 0, targetResponseSpeed: 72, targetStakeholderReach: "1", strategicCategory: "special_teams" },
              { playbookNumber: 124, domainId: domainByName("Market Dynamics"), categoryId: catByName("Market Position Threats"), name: "App Store / Platform Distribution Removal", description: "Apple App Store or Google Play suspends or removes your application affecting millions of users.", triggerCriteria: "Apple App Store or Google Play suspends or removes your application affecting millions of users", tier1Stakeholders: ["CEO", "CPO", "General Counsel"], tier2Stakeholders: ["CTO", "VP Communications"], tier3Stakeholders: [], primaryResponseStrategy: "Legal challenge to removal filed within 24 hours, direct-download or progressive web app alternative deployed as 30-day bridge, and user communications launched before press picks up the story and customer support is overwhelmed", preApprovedBudget: "2000000", budgetApprovalRequired: false, targetExecutionTime: 24, isActive: true, isPremium: false, primaryExecutiveRole: "CPO", severityScore: 8, timeSensitivity: 9, tier1Count: 3, tier2Count: 2, tier3Count: 0, targetResponseSpeed: 24, targetStakeholderReach: "1", strategicCategory: "offense" },
              // Gap fill: core protocols 130–134
              { playbookNumber: 130, domainId: domainByName("Brand & Reputation"), categoryId: catByName("Media & Public Relations"), name: "Greenwashing Allegation / FTC Green Claims Enforcement", description: "FTC, EU Green Claims Directive, or NGO investigation into unsubstantiated sustainability claims — 'net zero,' 'carbon neutral,' or 'sustainable' marketing found misleading.", triggerCriteria: "FTC, EU Green Claims Directive, or NGO investigation into unsubstantiated sustainability claims", tier1Stakeholders: ["CEO", "General Counsel", "Chief Sustainability Officer"], tier2Stakeholders: ["CMO", "Board"], tier3Stakeholders: [], primaryResponseStrategy: "All environmental marketing claims audited against FTC Green Guides and EU Green Claims substantiation requirements within 48 hours, unsubstantiated claims suspended, and third-party verification obtained proactively before enforcement timeline forces public correction", preApprovedBudget: "3000000", budgetApprovalRequired: false, targetExecutionTime: 24, isActive: true, isPremium: false, primaryExecutiveRole: "CLO", severityScore: 8, timeSensitivity: 7, tier1Count: 3, tier2Count: 2, tier3Count: 0, targetResponseSpeed: 24, targetStakeholderReach: "1", strategicCategory: "defense" },
              { playbookNumber: 131, domainId: domainByName("Market Dynamics"), categoryId: catByName("Market Position Threats"), name: "Analyst Downgrade — Gartner / Forrester / IDC", description: "Gartner Magic Quadrant demotion, Forrester Wave negative positioning, or IDC report directing buyers to competitors — cited in active procurement evaluations.", triggerCriteria: "Gartner Magic Quadrant demotion or Forrester/IDC negative positioning cited in active enterprise procurement evaluations", tier1Stakeholders: ["CEO", "CMO", "CPO"], tier2Stakeholders: ["Chief Revenue Officer", "VP Analyst Relations"], tier3Stakeholders: [], primaryResponseStrategy: "Immediate engagement with evaluating analyst to understand scoring criteria failures, product roadmap evidence package assembled to rebut positioning within 72 hours, and deal defense brief issued to sales for every in-flight opportunity where negative report is cited", preApprovedBudget: "1000000", budgetApprovalRequired: false, targetExecutionTime: 24, isActive: true, isPremium: false, primaryExecutiveRole: "CMO", severityScore: 7, timeSensitivity: 7, tier1Count: 3, tier2Count: 2, tier3Count: 0, targetResponseSpeed: 24, targetStakeholderReach: "1", strategicCategory: "offense" },
              { playbookNumber: 132, domainId: domainByName("Market Opportunities"), categoryId: catByName("Strategic Opportunities"), name: "Government Contract / Federal RFP Window", description: "Federal, state, or defense agency RFP released with 72-hour intent-to-bid requirement or accelerated acquisition timeline.", triggerCriteria: "Federal, state, or defense agency RFP released with 72-hour intent-to-bid requirement or accelerated acquisition timeline", tier1Stakeholders: ["CEO", "VP Business Development", "VP Contracts"], tier2Stakeholders: ["General Counsel", "CFO", "Technical Lead"], tier3Stakeholders: [], primaryResponseStrategy: "Teaming partner decisions made within 24 hours from pre-qualified partner list, all compliance certifications and clearance documentation verified against requirements, and proposal team mobilized with pre-drafted sections from the readiness library", preApprovedBudget: "2000000", budgetApprovalRequired: false, targetExecutionTime: 24, isActive: true, isPremium: false, primaryExecutiveRole: "CEO", severityScore: 7, timeSensitivity: 9, tier1Count: 3, tier2Count: 3, tier3Count: 0, targetResponseSpeed: 24, targetStakeholderReach: "1", strategicCategory: "offense" },
              { playbookNumber: 133, domainId: domainByName("Talent & Leadership"), categoryId: catByName("Workforce Issues"), name: "Critical Team Burnout / Attrition Cascade", description: "Extended high-load period, layoff survivor syndrome, or policy change triggers burnout and departure cascade in a critical technical or revenue-producing team.", triggerCriteria: "Extended high-load period or policy change triggers burnout and departure cascade in a critical technical or revenue-producing team", tier1Stakeholders: ["CHRO", "CEO", "Business Unit Lead"], tier2Stakeholders: ["CFO"], tier3Stakeholders: [], primaryResponseStrategy: "Load assessment and immediate relief interventions deployed within 72 hours, retention packages staged for identified flight risks, and root cause addressed with visible management action before the attrition cascade reaches the next wave of departures", preApprovedBudget: "2000000", budgetApprovalRequired: false, targetExecutionTime: 48, isActive: true, isPremium: false, primaryExecutiveRole: "CHRO", severityScore: 7, timeSensitivity: 6, tier1Count: 3, tier2Count: 1, tier3Count: 0, targetResponseSpeed: 48, targetStakeholderReach: "1", strategicCategory: "special_teams" },
              { playbookNumber: 134, domainId: domainByName("AI Governance"), categoryId: catByName("AI Risk & Safety"), name: "Agentic AI Policy Breach", description: "Autonomous AI agent takes unexpected actions outside authorized scope — executing transactions, accessing unauthorized data, or triggering downstream systems without human authorization.", triggerCriteria: "Autonomous AI agent takes unexpected actions outside authorized scope — executing transactions or accessing unauthorized data", tier1Stakeholders: ["CTO", "COO", "CEO"], tier2Stakeholders: ["General Counsel", "Chief AI Officer"], tier3Stakeholders: [], primaryResponseStrategy: "Unauthorized agent suspended within 12 minutes, all actions taken during breach window catalogued for damage assessment, and governance controls tightened before any agentic AI system is restarted", preApprovedBudget: "3000000", budgetApprovalRequired: false, targetExecutionTime: 0, isActive: true, isPremium: false, primaryExecutiveRole: "CTO", severityScore: 10, timeSensitivity: 10, tier1Count: 3, tier2Count: 2, tier3Count: 0, targetResponseSpeed: 0, targetStakeholderReach: "1", strategicCategory: "special_teams" },
              // Compound protocols 185–210 (previously unseeded)
              { playbookNumber: 185, domainId: domainByName("Operational Excellence"), categoryId: catByName("Supply Chain Crises"), name: "Compound: Activist Investor + Regulatory Inquiry", description: "Activist investor discloses a significant stake while a concurrent federal regulatory inquiry opens simultaneously — each amplifying the other's pressure on management and the Board.", triggerCriteria: "Activist investor discloses significant stake concurrent with a federal regulatory inquiry opening simultaneously", tier1Stakeholders: ["CEO", "General Counsel", "CFO"], tier2Stakeholders: ["Chief Compliance Officer", "Chief IR Officer", "Board Chair"], tier3Stakeholders: ["Chief Strategy Officer"], primaryResponseStrategy: "Dual-track activation of investor defense and regulatory response protocols with unified executive command — preventing the regulatory inquiry from becoming activist ammunition", preApprovedBudget: "3500000", budgetApprovalRequired: false, targetExecutionTime: 24, isActive: true, isPremium: false, primaryExecutiveRole: "CEO", severityScore: 9, timeSensitivity: 8, tier1Count: 3, tier2Count: 3, tier3Count: 1, targetResponseSpeed: 24, targetStakeholderReach: "1", strategicCategory: "defense" },
              { playbookNumber: 186, domainId: domainByName("Technology & Innovation"), categoryId: catByName("Cybersecurity Incidents"), name: "Compound: Ransomware + Brand Crisis", description: "Ransomware attack becomes publicly known before containment is complete — triggering simultaneous cyber incident response and brand reputation crisis with media inquiry, customer concern, and social media pressure.", triggerCriteria: "Ransomware attack becomes publicly known before containment is complete triggering simultaneous cyber and brand crisis", tier1Stakeholders: ["CISO", "CEO", "CMO"], tier2Stakeholders: ["General Counsel", "CTO", "VP Communications"], tier3Stakeholders: ["CFO", "COO"], primaryResponseStrategy: "Parallel cyber containment and public communications protocol with unified executive messaging — preserving customer trust and media narrative while technical recovery is underway", preApprovedBudget: "4000000", budgetApprovalRequired: false, targetExecutionTime: 1, isActive: true, isPremium: false, primaryExecutiveRole: "CISO", severityScore: 10, timeSensitivity: 10, tier1Count: 3, tier2Count: 3, tier3Count: 2, targetResponseSpeed: 1, targetStakeholderReach: "1", strategicCategory: "special_teams" },
              { playbookNumber: 187, domainId: domainByName("AI Governance"), categoryId: catByName("AI Risk & Safety"), name: "Compound: CEO Departure + Activist Campaign", description: "CEO departure announced or discovered concurrently with an activist investor campaign that views the leadership transition as a vulnerability to exploit for board seats or strategic demands.", triggerCriteria: "CEO departure announced concurrently with an activist investor campaign exploiting the leadership transition", tier1Stakeholders: ["Board Chair", "Lead Independent Director", "CFO"], tier2Stakeholders: ["CHRO", "General Counsel", "Chief IR Officer"], tier3Stakeholders: ["Chief Strategy Officer"], primaryResponseStrategy: "Simultaneous leadership succession, investor communication, and activist defense protocols with board-led unified narrative — establishing succession credibility before activist frames leadership vacuum as governance failure", preApprovedBudget: "2800000", budgetApprovalRequired: false, targetExecutionTime: 24, isActive: true, isPremium: false, primaryExecutiveRole: "Board Chair", severityScore: 9, timeSensitivity: 8, tier1Count: 3, tier2Count: 3, tier3Count: 1, targetResponseSpeed: 24, targetStakeholderReach: "1", strategicCategory: "special_teams" },
              { playbookNumber: 188, domainId: domainByName("Operational Excellence"), categoryId: catByName("Third-Party Dependencies"), name: "Compound: M&A Announcement + Talent Exodus", description: "Merger or acquisition announcement triggers immediate top talent flight risk as employees assess role uncertainty and competitors begin targeted recruiting of key personnel.", triggerCriteria: "M&A announcement triggers top talent flight risk as competitors begin targeted recruiting of key personnel", tier1Stakeholders: ["CEO", "CHRO", "CFO"], tier2Stakeholders: ["Chief Strategy Officer", "Head of M&A Integration", "General Counsel"], tier3Stakeholders: ["CMO"], primaryResponseStrategy: "Parallel retention offensive and deal communication protocol with aligned employee and investor narrative — capturing key talent before competitor recruiters reach them while maintaining deal momentum", preApprovedBudget: "2200000", budgetApprovalRequired: false, targetExecutionTime: 24, isActive: true, isPremium: false, primaryExecutiveRole: "CHRO", severityScore: 8, timeSensitivity: 8, tier1Count: 3, tier2Count: 3, tier3Count: 1, targetResponseSpeed: 24, targetStakeholderReach: "1", strategicCategory: "defense" },
              { playbookNumber: 189, domainId: domainByName("Financial Strategy"), categoryId: catByName("Market Valuation"), name: "Compound: Product Recall + Regulatory + Brand", description: "Product safety issue triggers simultaneous voluntary or mandatory recall obligation, consumer protection enforcement inquiry, and brand reputation crisis across media and social channels.", triggerCriteria: "Product safety issue triggers simultaneous recall obligation, regulatory inquiry, and brand reputation crisis", tier1Stakeholders: ["CEO", "Chief Quality Officer", "General Counsel"], tier2Stakeholders: ["Chief Compliance Officer", "CMO", "COO"], tier3Stakeholders: ["CFO", "VP Customer Success"], primaryResponseStrategy: "Tri-track activation of regulatory compliance, product recall logistics, and public communications with a unified consumer safety narrative under single executive command", preApprovedBudget: "5500000", budgetApprovalRequired: false, targetExecutionTime: 4, isActive: true, isPremium: false, primaryExecutiveRole: "CEO", severityScore: 10, timeSensitivity: 10, tier1Count: 3, tier2Count: 3, tier3Count: 2, targetResponseSpeed: 4, targetStakeholderReach: "1", strategicCategory: "defense" },
              { playbookNumber: 190, domainId: domainByName("Technology & Innovation"), categoryId: catByName("Cybersecurity Incidents"), name: "Compound: Data Breach + SEC Disclosure + Class Action", description: "Data breach involving material nonpublic information triggers simultaneous SEC 8-K disclosure obligation, shareholder class action risk, and multi-state customer notification under conflicting timelines.", triggerCriteria: "Data breach involving material nonpublic information triggers SEC 8-K disclosure, class action risk, and multi-state notification simultaneously", tier1Stakeholders: ["CISO", "General Counsel", "CFO"], tier2Stakeholders: ["CEO", "Chief Compliance Officer", "Board Chair"], tier3Stakeholders: ["VP Investor Relations"], primaryResponseStrategy: "Coordinated cyber response, securities disclosure, and litigation hold protocol — SEC 8-K filed within the required 4-business-day window while preserving privilege for class action defense", preApprovedBudget: "6000000", budgetApprovalRequired: false, targetExecutionTime: 4, isActive: true, isPremium: false, primaryExecutiveRole: "CISO", severityScore: 10, timeSensitivity: 10, tier1Count: 3, tier2Count: 3, tier3Count: 1, targetResponseSpeed: 4, targetStakeholderReach: "1", strategicCategory: "special_teams" },
              { playbookNumber: 191, domainId: domainByName("Brand & Reputation"), categoryId: catByName("Stakeholder Trust"), name: "Compound: ESG Controversy + Activist Investor Pressure", description: "ESG controversy — environmental incident, governance failure, or social impact event — triggers an activist investor campaign using the ESG failures as public campaign ammunition with institutional shareholder pressure.", triggerCriteria: "ESG controversy triggers activist investor campaign using failures as public ammunition with institutional shareholder pressure", tier1Stakeholders: ["CEO", "Chief Sustainability Officer", "General Counsel"], tier2Stakeholders: ["CFO", "Board Chair", "Chief IR Officer"], tier3Stakeholders: ["CMO"], primaryResponseStrategy: "Simultaneous ESG response and investor defense protocol with unified stakeholder narrative — converting ESG accountability into competitive repositioning before activist frames failure as systemic governance breakdown", preApprovedBudget: "2000000", budgetApprovalRequired: false, targetExecutionTime: 24, isActive: true, isPremium: false, primaryExecutiveRole: "CEO", severityScore: 8, timeSensitivity: 7, tier1Count: 3, tier2Count: 3, tier3Count: 1, targetResponseSpeed: 24, targetStakeholderReach: "1", strategicCategory: "defense" },
              { playbookNumber: 192, domainId: domainByName("Financial Strategy"), categoryId: catByName("Financial Reporting"), name: "Compound: Supply Chain Collapse + Enterprise Customer Crisis", description: "Critical supplier failure directly impacts fulfillment commitments to enterprise customers — triggering simultaneous procurement emergency and customer retention crisis.", triggerCriteria: "Critical supplier failure directly impacts enterprise customer fulfillment commitments triggering simultaneous procurement and retention emergency", tier1Stakeholders: ["COO", "Chief Procurement Officer", "Chief Revenue Officer"], tier2Stakeholders: ["CFO", "CMO", "VP Customer Success"], tier3Stakeholders: ["CEO"], primaryResponseStrategy: "Parallel supplier continuity and enterprise customer retention protocols with proactive customer communication — issuing alternate supplier purchase orders and personally contacting at-risk enterprise accounts before they discover the disruption", preApprovedBudget: "4500000", budgetApprovalRequired: false, targetExecutionTime: 4, isActive: true, isPremium: false, primaryExecutiveRole: "COO", severityScore: 9, timeSensitivity: 9, tier1Count: 3, tier2Count: 3, tier3Count: 1, targetResponseSpeed: 4, targetStakeholderReach: "1", strategicCategory: "defense" },
              { playbookNumber: 193, domainId: domainByName("AI Governance"), categoryId: catByName("AI Risk & Safety"), name: "Compound: EU AI Act + Data Breach Cascade", description: "AI system data breach triggers simultaneous EU AI Act non-compliance, GDPR notification obligations, and AI liability claims — three parallel regulatory tracks with conflicting timelines and legal strategies.", triggerCriteria: "AI system data breach triggers simultaneous EU AI Act non-compliance, GDPR notification obligations, and AI liability claims", tier1Stakeholders: ["General Counsel", "CISO", "Chief AI Officer"], tier2Stakeholders: ["Data Protection Officer", "CEO", "Board Chair"], tier3Stakeholders: ["External EU Regulatory Counsel"], primaryResponseStrategy: "Tri-track activation of EU AI Act compliance, GDPR breach notification, and AI liability defense — EU AI Act counsel and data protection counsel engaged in parallel, not sequentially", preApprovedBudget: "8000000", budgetApprovalRequired: false, targetExecutionTime: 4, isActive: true, isPremium: false, primaryExecutiveRole: "CLO", severityScore: 10, timeSensitivity: 10, tier1Count: 3, tier2Count: 3, tier3Count: 1, targetResponseSpeed: 4, targetStakeholderReach: "1", strategicCategory: "special_teams" },
              { playbookNumber: 194, domainId: domainByName("Operational Excellence"), categoryId: catByName("System Failures"), name: "Compound: ERP Failure + Enterprise Customer SLA Crisis", description: "ERP go-live failure simultaneously disrupts order management, invoicing, and logistics — triggering contractual SLA breach notifications from enterprise customers before system restoration.", triggerCriteria: "ERP go-live failure disrupts order management, invoicing, and logistics triggering enterprise customer SLA breach notifications", tier1Stakeholders: ["COO", "CTO", "CFO"], tier2Stakeholders: ["VP Customer Success", "VP Strategic Accounts", "Implementation Partner Lead"], tier3Stakeholders: ["CEO"], primaryResponseStrategy: "Dual-track activation of ERP crisis containment and enterprise customer retention — technical team executes rollback-or-forward decision while senior account executives contact every enterprise account with active SLA obligations", preApprovedBudget: "10000000", budgetApprovalRequired: false, targetExecutionTime: 4, isActive: true, isPremium: false, primaryExecutiveRole: "COO", severityScore: 9, timeSensitivity: 9, tier1Count: 3, tier2Count: 3, tier3Count: 1, targetResponseSpeed: 4, targetStakeholderReach: "1", strategicCategory: "defense" },
              { playbookNumber: 195, domainId: domainByName("Regulatory & Compliance"), categoryId: catByName("Government Investigations"), name: "Compound: Dual-Jurisdiction Regulatory Inquiry", description: "Simultaneous regulatory inquiries from two or more jurisdictions — SEC + FCA, DOJ + EU DG COMP, or CFPB + State AG — each with different document requests, privilege rules, and cooperation standards that conflict.", triggerCriteria: "Simultaneous regulatory inquiries from two or more jurisdictions with conflicting document requests, privilege rules, and cooperation standards", tier1Stakeholders: ["CEO", "General Counsel", "CFO"], tier2Stakeholders: ["Chief Compliance Officer", "Board Chair", "US Outside Counsel"], tier3Stakeholders: ["International Outside Counsel"], primaryResponseStrategy: "Dual-jurisdiction defense protocol with separate outside counsel in each jurisdiction — document production, cooperation posture, and privilege claims coordinated to prevent each jurisdiction's response from creating exposure in the other", preApprovedBudget: "15000000", budgetApprovalRequired: true, targetExecutionTime: 24, isActive: true, isPremium: false, primaryExecutiveRole: "CLO", severityScore: 10, timeSensitivity: 9, tier1Count: 3, tier2Count: 3, tier3Count: 1, targetResponseSpeed: 24, targetStakeholderReach: "1", strategicCategory: "special_teams" },
              { playbookNumber: 196, domainId: domainByName("Financial Strategy"), categoryId: catByName("Market Valuation"), name: "Compound: IPO Pricing Window + Adverse Media Event", description: "Material adverse news breaks publicly during the live IPO roadshow window, forcing a simultaneous investor relations crisis and securities disclosure decision under SEC quiet period constraints.", triggerCriteria: "Material adverse news breaks during live IPO roadshow window forcing simultaneous investor relations crisis and securities disclosure decision", tier1Stakeholders: ["CEO", "CFO", "General Counsel"], tier2Stakeholders: ["Lead Underwriter", "IR Counsel", "Board Chair"], tier3Stakeholders: ["Communications Lead", "SEC Outside Counsel"], primaryResponseStrategy: "Dual-track IPO defense protocol — securities counsel and underwriters convene within 2 hours to assess materiality and determine roadshow pause or prospectus amendment while communications executes controlled disclosure response", preApprovedBudget: "5000000", budgetApprovalRequired: false, targetExecutionTime: 2, isActive: true, isPremium: false, primaryExecutiveRole: "CFO", severityScore: 10, timeSensitivity: 10, tier1Count: 3, tier2Count: 3, tier3Count: 2, targetResponseSpeed: 2, targetStakeholderReach: "1", strategicCategory: "defense" },
              { playbookNumber: 197, domainId: domainByName("Operational Excellence"), categoryId: catByName("Supply Chain Crises"), name: "Compound: Labor Strike + Supply Chain Collapse", description: "Simultaneous union work stoppage at primary manufacturing facilities and failure of a Tier-1 supplier creates a compounding production shutdown — neither event alone would halt operations, but together they eliminate all manufacturing capacity.", triggerCriteria: "Simultaneous union work stoppage and Tier-1 supplier failure eliminate all manufacturing capacity with no standard contingency recovery path", tier1Stakeholders: ["CEO", "COO", "CHRO"], tier2Stakeholders: ["VP Supply Chain", "CFO", "VP Manufacturing"], tier3Stakeholders: ["General Counsel", "Board Operations Committee"], primaryResponseStrategy: "Tri-track activation of labor negotiation, emergency supplier qualification, and customer allocation management with senior executive mediator engaging union directly while procurement simultaneously qualifies alternative suppliers", preApprovedBudget: "12000000", budgetApprovalRequired: true, targetExecutionTime: 4, isActive: true, isPremium: false, primaryExecutiveRole: "COO", severityScore: 10, timeSensitivity: 10, tier1Count: 3, tier2Count: 3, tier3Count: 2, targetResponseSpeed: 4, targetStakeholderReach: "1", strategicCategory: "defense" },
              { playbookNumber: 198, domainId: domainByName("Financial Strategy"), categoryId: catByName("Liquidity & Capital"), name: "Compound: Credit Rating Downgrade + Debt Covenant Breach", description: "Rating agency downgrade automatically triggers cross-default clauses and financial maintenance covenant violations across multiple debt instruments simultaneously — converting a reputational event into an immediate liquidity and solvency event.", triggerCriteria: "Rating agency downgrade automatically triggers cross-default clauses and covenant violations across multiple debt instruments simultaneously", tier1Stakeholders: ["CEO", "CFO", "General Counsel"], tier2Stakeholders: ["Board Finance Committee Chair", "Investment Banker", "Lead Lenders"], tier3Stakeholders: ["Chief Accounting Officer", "Restructuring Counsel"], primaryResponseStrategy: "Simultaneous covenant waiver negotiation across all affected lending facilities — CFO and restructuring counsel convene emergency lender calls within 6 hours of downgrade confirmation to negotiate waiver agreements before cross-default acceleration rights mature", preApprovedBudget: "8000000", budgetApprovalRequired: false, targetExecutionTime: 6, isActive: true, isPremium: false, primaryExecutiveRole: "CFO", severityScore: 10, timeSensitivity: 10, tier1Count: 3, tier2Count: 3, tier3Count: 2, targetResponseSpeed: 6, targetStakeholderReach: "1", strategicCategory: "defense" },
              { playbookNumber: 199, domainId: domainByName("Regulatory & Compliance"), categoryId: catByName("Government Investigations"), name: "Compound: C-Suite Fraud Discovery + Board Governance Failure", description: "Internal audit or whistleblower reveals material financial fraud by a C-suite executive simultaneously with audit committee oversight failures that disqualify the oversight body from leading the internal investigation.", triggerCriteria: "Whistleblower reveals C-suite financial fraud simultaneously with evidence that audit committee oversight failures allowed fraud to persist", tier1Stakeholders: ["Board Chair", "Independent Directors", "External Forensic Auditor"], tier2Stakeholders: ["Special Committee Counsel", "Communications Counsel", "SEC Outside Counsel"], tier3Stakeholders: ["Criminal Defense Counsel"], primaryResponseStrategy: "Independent Special Committee of outside directors constituted within 12 hours — separate from any directors with audit committee responsibility — to lead forensic investigation and manage SEC voluntary disclosure strategy", preApprovedBudget: "20000000", budgetApprovalRequired: true, targetExecutionTime: 12, isActive: true, isPremium: false, primaryExecutiveRole: "Board Chair", severityScore: 10, timeSensitivity: 9, tier1Count: 3, tier2Count: 3, tier3Count: 1, targetResponseSpeed: 12, targetStakeholderReach: "1", strategicCategory: "special_teams" },
              { playbookNumber: 200, domainId: domainByName("Operational Excellence"), categoryId: catByName("Facility & Infrastructure"), name: "Compound: Pandemic / Health Crisis + Workforce Availability Collapse", description: "Rapid-onset regional or global health event reduces available workforce to below operational minimums simultaneously across multiple facilities or functions — triggering SLA failures, compliance gaps, and reputational crisis.", triggerCriteria: "Rapid-onset health event reduces available workforce below operational minimums across multiple facilities simultaneously", tier1Stakeholders: ["CEO", "COO", "CHRO"], tier2Stakeholders: ["Chief Medical Officer", "CFO", "VP Operations"], tier3Stakeholders: ["Legal Counsel", "Communications Lead"], primaryResponseStrategy: "Five-track crisis activation covering workforce triage, operational triage, customer communication, regulatory compliance preservation, and supply continuity — essential functions ranked by revenue and regulatory criticality within 4 hours", preApprovedBudget: "15000000", budgetApprovalRequired: true, targetExecutionTime: 4, isActive: true, isPremium: false, primaryExecutiveRole: "CEO", severityScore: 10, timeSensitivity: 10, tier1Count: 3, tier2Count: 3, tier3Count: 2, targetResponseSpeed: 4, targetStakeholderReach: "1", strategicCategory: "defense" },
              { playbookNumber: 201, domainId: domainByName("Technology & Innovation"), categoryId: catByName("Cybersecurity Incidents"), name: "Compound: IP Theft + Active Competitive Exploitation", description: "Forensic evidence confirms intellectual property exfiltration simultaneously with market intelligence indicating a competitor is actively using the stolen material — compressing the legal remediation window.", triggerCriteria: "Forensic evidence confirms IP exfiltration simultaneously with competitor actively using the stolen material in products already in development", tier1Stakeholders: ["CEO", "General Counsel", "CISO"], tier2Stakeholders: ["Chief Product Officer", "IP Litigation Counsel", "Forensic Investigator"], tier3Stakeholders: ["Board Chair", "Communications Lead"], primaryResponseStrategy: "Simultaneous activation of emergency TRO proceedings, criminal referral to FBI Cyber Division, and accelerated internal product roadmap to replace compromised IP advantages before competitor ships", preApprovedBudget: "10000000", budgetApprovalRequired: false, targetExecutionTime: 48, isActive: true, isPremium: false, primaryExecutiveRole: "CLO", severityScore: 9, timeSensitivity: 9, tier1Count: 3, tier2Count: 3, tier3Count: 2, targetResponseSpeed: 48, targetStakeholderReach: "1", strategicCategory: "special_teams" },
              { playbookNumber: 202, domainId: domainByName("Operational Excellence"), categoryId: catByName("Facility & Infrastructure"), name: "Compound: Natural Disaster + Infrastructure Cascade Failure", description: "Physical catastrophe simultaneously destroys or disables primary data center, backup infrastructure, and key personnel availability in the same geographic region — standard business continuity plans fail because both primary and backup are within the disaster zone.", triggerCriteria: "Physical catastrophe destroys primary data center and backup infrastructure in the same geographic region — standard continuity plans fail", tier1Stakeholders: ["CEO", "CTO", "COO"], tier2Stakeholders: ["CISO", "CFO", "VP Operations"], tier3Stakeholders: ["Insurance Counsel", "Business Continuity Lead"], primaryResponseStrategy: "Emergency infrastructure reconstitution protocol activates cloud failover to geographically separated regions within 2 hours with pre-authorized cloud spend limits allowing CTO to commit emergency infrastructure spend without board approval delay", preApprovedBudget: "10000000", budgetApprovalRequired: false, targetExecutionTime: 2, isActive: true, isPremium: false, primaryExecutiveRole: "CTO", severityScore: 10, timeSensitivity: 10, tier1Count: 3, tier2Count: 3, tier3Count: 2, targetResponseSpeed: 2, targetStakeholderReach: "1", strategicCategory: "defense" },
              { playbookNumber: 203, domainId: domainByName("Regulatory & Compliance"), categoryId: catByName("Government Investigations"), name: "Compound: Antitrust Investigation + Strategic Partnership Collapse", description: "DOJ or FTC antitrust investigation announcement causes a key strategic partner to immediately suspend all joint commercial activity, simultaneously converting an antitrust defense challenge into an antitrust defense plus strategic asset collapse.", triggerCriteria: "DOJ or FTC antitrust investigation causes key strategic partner to suspend all joint commercial activity simultaneously", tier1Stakeholders: ["CEO", "General Counsel", "Chief Strategy Officer"], tier2Stakeholders: ["CFO", "Antitrust Counsel", "M&A Counsel"], tier3Stakeholders: ["Board Chair", "Communications Lead"], primaryResponseStrategy: "Dual-track activation separating antitrust defense from partnership remediation — antitrust counsel manages DOJ/FTC engagement while separate M&A counsel negotiates with partner to preserve commercial relationship through arm's-length restructuring", preApprovedBudget: "8000000", budgetApprovalRequired: false, targetExecutionTime: 24, isActive: true, isPremium: false, primaryExecutiveRole: "CLO", severityScore: 9, timeSensitivity: 8, tier1Count: 3, tier2Count: 3, tier3Count: 2, targetResponseSpeed: 24, targetStakeholderReach: "1", strategicCategory: "special_teams" },
              { playbookNumber: 204, domainId: domainByName("Brand & Reputation"), categoryId: catByName("Media & Public Relations"), name: "Compound: Executive Misconduct + Brand Boycott + Advertiser Exodus", description: "Senior executive personal conduct triggers simultaneous organized consumer boycott, social media amplification, and advertiser suspension decisions — a triple-track brand and revenue crisis unfolding across 24–48 hours.", triggerCriteria: "Senior executive conduct triggers simultaneous consumer boycott, social media amplification, and advertiser suspension decisions within 24–48 hours", tier1Stakeholders: ["CEO", "Board Chair", "CHRO"], tier2Stakeholders: ["CMO", "CFO", "Communications Lead"], tier3Stakeholders: ["Brand Counsel", "VP Strategic Accounts"], primaryResponseStrategy: "Simultaneous activation of executive separation protocol, advertiser retention outreach, and brand narrative repositioning — Board Chair personally calls top 10 advertisers by revenue within 6 hours with concrete remediation timeline", preApprovedBudget: "5000000", budgetApprovalRequired: false, targetExecutionTime: 4, isActive: true, isPremium: false, primaryExecutiveRole: "Board Chair", severityScore: 9, timeSensitivity: 9, tier1Count: 3, tier2Count: 3, tier3Count: 2, targetResponseSpeed: 4, targetStakeholderReach: "1", strategicCategory: "defense" },
              { playbookNumber: 205, domainId: domainByName("Market Dynamics"), categoryId: catByName("Market Position Threats"), name: "Compound: Hostile Takeover Bid + Talent Retention Crisis", description: "Unsolicited public acquisition bid simultaneously triggers board fiduciary defense obligations, shareholder activist pressure to accept, and a key talent retention crisis as acquirer's integration plans leak.", triggerCriteria: "Unsolicited acquisition bid simultaneously triggers board fiduciary defense, activist pressure, and key talent retention crisis as integration plans leak", tier1Stakeholders: ["Board Chair", "CEO", "General Counsel"], tier2Stakeholders: ["M&A Defense Counsel", "CHRO", "Investment Banker"], tier3Stakeholders: ["CFO", "Compensation Committee Chair"], primaryResponseStrategy: "Tri-track hostile takeover defense — M&A defense counsel prepares board fiduciary analysis within 48 hours, CHRO executes retention packages for top 50 key personnel, and communications delivers unified employee message preserving optionality", preApprovedBudget: "25000000", budgetApprovalRequired: true, targetExecutionTime: 48, isActive: true, isPremium: false, primaryExecutiveRole: "Board Chair", severityScore: 10, timeSensitivity: 9, tier1Count: 3, tier2Count: 3, tier3Count: 2, targetResponseSpeed: 48, targetStakeholderReach: "1", strategicCategory: "offense" },
              { playbookNumber: 206, domainId: domainByName("Regulatory & Compliance"), categoryId: catByName("Litigation"), name: "Compound: Product Safety Recall + Criminal Investigation + Mass Tort", description: "Consumer safety incident triggers simultaneous CPSC or FDA mandatory recall, DOJ criminal investigation into executive knowledge of pre-existing safety data, and mass tort class action filing — three parallel legal tracks with directly conflicting strategies.", triggerCriteria: "Consumer safety incident triggers simultaneous CPSC/FDA mandatory recall, DOJ criminal investigation, and mass tort class action with conflicting legal strategies", tier1Stakeholders: ["CEO", "General Counsel", "Chief Medical Officer"], tier2Stakeholders: ["Regulatory Affairs VP", "Criminal Defense Counsel", "Civil Litigation Counsel"], tier3Stakeholders: ["CFO", "Board Chair"], primaryResponseStrategy: "Three separate outside counsel teams activated simultaneously with a coordinating General Counsel — criminal defense, civil discovery, and recall cooperation all reviewed for cross-track consistency before any external communication is issued", preApprovedBudget: "30000000", budgetApprovalRequired: true, targetExecutionTime: 6, isActive: true, isPremium: false, primaryExecutiveRole: "CLO", severityScore: 10, timeSensitivity: 10, tier1Count: 3, tier2Count: 3, tier3Count: 2, targetResponseSpeed: 6, targetStakeholderReach: "1", strategicCategory: "special_teams" },
              { playbookNumber: 207, domainId: domainByName("Regulatory & Compliance"), categoryId: catByName("Government Investigations"), name: "Compound: Geopolitical Sanctions + Export Control Violation + Customer Force Majeure", description: "New sanctions designation or export control rule expansion creates simultaneous technology export violations for products already shipped, customer force majeure claims, and supply chain compliance restructuring under compressed government timelines.", triggerCriteria: "New OFAC/BIS sanctions or export control expansion creates simultaneous export violations, customer force majeure claims, and compliance restructuring requirements", tier1Stakeholders: ["CEO", "General Counsel", "Chief Compliance Officer"], tier2Stakeholders: ["CFO", "VP Global Sales", "Trade Sanctions Counsel"], tier3Stakeholders: ["Export Control Counsel", "Board Chair"], primaryResponseStrategy: "Tri-track sanctions response — trade counsel files OFAC voluntary self-disclosure within mitigation window, customer-facing teams proactively engage affected counterparties before force majeure notices, and compliance team executes immediate product and technology exposure review", preApprovedBudget: "10000000", budgetApprovalRequired: false, targetExecutionTime: 24, isActive: true, isPremium: false, primaryExecutiveRole: "CLO", severityScore: 9, timeSensitivity: 9, tier1Count: 3, tier2Count: 3, tier3Count: 2, targetResponseSpeed: 24, targetStakeholderReach: "1", strategicCategory: "special_teams" },
              { playbookNumber: 208, domainId: domainByName("Financial Strategy"), categoryId: catByName("Liquidity & Capital"), name: "Compound: Liquidity Crisis + Counterparty Default + Credit Line Revocation", description: "Simultaneous cash flow crisis triggered by a major counterparty default and credit line revocation — individually manageable, but together they eliminate both liquidity and the ability to access liquidity, creating a 48–72 hour insolvency window.", triggerCriteria: "Major counterparty default and credit line revocation simultaneously eliminate liquidity and access to liquidity creating a 48–72 hour insolvency window", tier1Stakeholders: ["CEO", "CFO", "Board Chair"], tier2Stakeholders: ["Investment Banker", "Restructuring Counsel", "Chief Accounting Officer"], tier3Stakeholders: ["Primary Lender Relationship", "Creditors Committee Counsel"], primaryResponseStrategy: "Simultaneous activation of emergency capital raise, creditor standstill negotiation, and asset liquidity assessment — restructuring counsel files for standstill agreements within 24 hours while investment banker initiates emergency bridge financing", preApprovedBudget: "20000000", budgetApprovalRequired: true, targetExecutionTime: 6, isActive: true, isPremium: false, primaryExecutiveRole: "CFO", severityScore: 10, timeSensitivity: 10, tier1Count: 3, tier2Count: 3, tier3Count: 2, targetResponseSpeed: 6, targetStakeholderReach: "1", strategicCategory: "defense" },
              { playbookNumber: 209, domainId: domainByName("Regulatory & Compliance"), categoryId: catByName("Government Investigations"), name: "Compound: Whistleblower SEC Submission + Media Leak + Internal Investigation Conflict", description: "Simultaneous SEC whistleblower submission and media outlet contact by the same source — the story publishes before the internal investigation can be structured, while the internal investigation team is conflicted by their prior exposure to the underlying conduct.", triggerCriteria: "SEC whistleblower submission and media leak publish simultaneously before internal investigation is structured with internal counsel conflicted", tier1Stakeholders: ["Board Chair", "General Counsel", "Audit Committee Chair"], tier2Stakeholders: ["SEC Outside Counsel", "Media Relations Counsel", "Special Investigative Counsel"], tier3Stakeholders: ["CFO", "Communications Lead"], primaryResponseStrategy: "Independent Special Investigative Counsel retained by Audit Committee within 6 hours — separate from any attorney who advised on the underlying subject matter — to lead privileged internal investigation while SEC counsel manages whistleblower engagement", preApprovedBudget: "12000000", budgetApprovalRequired: false, targetExecutionTime: 6, isActive: true, isPremium: false, primaryExecutiveRole: "Board Chair", severityScore: 9, timeSensitivity: 9, tier1Count: 3, tier2Count: 3, tier3Count: 2, targetResponseSpeed: 6, targetStakeholderReach: "1", strategicCategory: "special_teams" },
              { playbookNumber: 210, domainId: domainByName("AI Governance"), categoryId: catByName("AI Risk & Safety"), name: "Compound: AI Model Failure + Regulatory Audit + Enterprise Customer Mass Churn", description: "Deployed AI system produces widespread harmful, biased, or factually incorrect outputs affecting enterprise customers simultaneously — triggering an FTC or sector regulator audit, mass customer churn notifications, and reputational damage that compounds with each news cycle.", triggerCriteria: "Deployed AI system produces widespread harmful outputs triggering simultaneous regulator audit, mass enterprise customer churn, and compounding reputational damage", tier1Stakeholders: ["CEO", "CTO", "Chief AI Officer"], tier2Stakeholders: ["General Counsel", "VP Customer Success", "Chief Risk Officer"], tier3Stakeholders: ["Communications Lead", "Regulatory Counsel"], primaryResponseStrategy: "Simultaneous activation of AI model suspension, enterprise customer retention protocol, and regulatory cooperation posture — affected model versions taken offline within 2 hours while VP Customer Success personally contacts every enterprise account with concrete remediation SLA", preApprovedBudget: "15000000", budgetApprovalRequired: true, targetExecutionTime: 2, isActive: true, isPremium: false, primaryExecutiveRole: "CTO", severityScore: 10, timeSensitivity: 10, tier1Count: 3, tier2Count: 3, tier3Count: 2, targetResponseSpeed: 2, targetStakeholderReach: "1", strategicCategory: "special_teams" },
            ];

            let added = 0;
            for (const p of compoundPlaybooks) {
              if (!p.domainId) { logger.warn(`⚠️ Domain not found for playbook #${p.playbookNumber}: ${p.name}`); continue; }
              const existing = await db.select({ id: playbookLibrary.id }).from(playbookLibrary).where(eq(playbookLibrary.playbookNumber, p.playbookNumber)).limit(1);
              if (existing.length === 0) {
                await db.insert(playbookLibrary).values(p as any);
                added++;
                logger.info(`✅ Added missing playbook #${p.playbookNumber}: ${p.name}`);
              }
            }
            logger.info(`✅ Additive migration complete: added ${added} playbooks (total now ${playbookCount + added})`);
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

          // Ensure peer_review_actions table exists
          try {
            await db.execute(sql`CREATE TABLE IF NOT EXISTS peer_review_actions (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              created_at TIMESTAMP DEFAULT NOW(),
              category TEXT NOT NULL DEFAULT 'general',
              insight TEXT NOT NULL,
              action TEXT NOT NULL,
              status TEXT NOT NULL DEFAULT 'identified',
              completed_at TIMESTAMP
            )`);
            logger.info("✅ Ensured peer_review_actions table exists");
          } catch (e) {
            logger.warn("Could not create peer_review_actions table (may already exist)");
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

          // Seed demo stakeholder contacts for live detection demo (idempotent)
          logger.info("👥 Checking demo stakeholder contacts...");
          try {
            const [existingContactResult] = await db
              .select({ count: count() })
              .from(stakeholderContacts)
              .where(eq(stakeholderContacts.organizationId as any, 'system'));
            const contactCount = Number(existingContactResult?.count || 0);
            if (contactCount === 0) {
              await db.insert(stakeholderContacts).values([
                { organizationId: 'system', role: 'CEO', name: 'Executive Director', email: 'pilot@vaughnmartin.com', isActive: true },
                { organizationId: 'system', role: 'CFO', name: 'Chief Financial Officer', email: 'pilot@vaughnmartin.com', isActive: true },
                { organizationId: 'system', role: 'CISO', name: 'Chief Information Security Officer', email: 'pilot@vaughnmartin.com', isActive: true },
                { organizationId: 'system', role: 'General Counsel', name: 'General Counsel', email: 'pilot@vaughnmartin.com', isActive: true },
                { organizationId: 'system', role: 'CHRO', name: 'Chief Human Resources Officer', email: 'pilot@vaughnmartin.com', isActive: true },
              ] as any[]);
              logger.info("✅ Demo stakeholder contacts seeded (5 contacts for system org)");
            } else {
              logger.info(`✅ Stakeholder contacts already present (${contactCount} contacts for system org)`);
            }
          } catch (contactSeedErr) {
            logger.warn({ contactSeedErr }, "⚠️ Stakeholder contact seed skipped (non-blocking)");
          }

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
