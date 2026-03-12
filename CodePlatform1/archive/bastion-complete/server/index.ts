import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { auditLogger } from "./middleware/audit-logging";
import { setupSwagger } from "./swagger";
import { proactiveAIRadar } from "./proactive-ai-radar";
import { enterpriseJobService } from "./services/EnterpriseJobService";
import { openAIService } from "./services/OpenAIService";
import pino from "pino";
import pinoHttp from "pino-http";

// Configure production-grade logger with sensitive data redaction
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: ['password', 'email', 'apiKey', 'token', 'authorization'],
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    }
  }
});

// HTTP request logger middleware
const httpLogger = pinoHttp({
  logger,
  redact: ['req.headers.authorization', 'req.headers.cookie', 'req.body.password', 'req.body.email', 'req.body.apiKey', 'req.body.token'],
  serializers: {
    req: (req) => ({
      id: req.id,
      method: req.method,
      url: req.url,
      remoteAddress: req.remoteAddress,
      remotePort: req.remotePort
    }),
    res: (res) => ({
      statusCode: res.statusCode
    })
  }
});

const app = express();

// Security: Add request size limits for enterprise security
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: false }));

// Enterprise: Add production logging and audit middleware
app.use(httpLogger);
app.use(auditLogger as any);

// CORS middleware for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  if (req.method === 'OPTIONS') {
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
        userAgent: req.get('user-agent'),
        ip: req.ip
      };
      
      // Only log response for non-sensitive endpoints and successful requests
      if (capturedJsonResponse && res.statusCode < 400 && !path.includes('/auth/')) {
        const responseStr = JSON.stringify(capturedJsonResponse);
        logData.responsePreview = responseStr.length > 100 ? responseStr.slice(0, 100) + "…" : responseStr;
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
  const server = await registerRoutes(app);
  
  // Set up API documentation
  setupSwagger(app);

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
        code: err.code
      },
      request: {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('user-agent')
      },
      timestamp: new Date().toISOString()
    };
    
    if (status >= 500) {
      logger.error(errorContext, 'Server error occurred');
    } else {
      logger.warn(errorContext, 'Client error occurred');
    }
    
    // Send structured error response
    const errorResponse: any = {
      error: {
        message: status >= 500 ? 'Internal server error' : message,
        status,
        timestamp: new Date().toISOString()
      }
    };
    
    // In development, include more details
    if (process.env.NODE_ENV === 'development') {
      errorResponse.error.details = message;
      errorResponse.error.stack = err.stack;
    }
    
    res.status(status).json(errorResponse);
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, async () => {
    log(`serving on port ${port}`);
    logger.info({ port, env: app.get('env') }, 'Veridius server started');
    
    // Initialize Enterprise Services
    try {
      // Initialize OpenAI Service
      logger.info(`OpenAI Service status: ${openAIService.isReady() ? 'Ready' : 'Fallback mode'}`);
      
      // Initialize Enterprise Job Service (PostgreSQL-based)
      await enterpriseJobService.initialize();
      logger.info('Enterprise Job Service initialized successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.warn({ error: errorMessage }, 'Enterprise Job Service initialization failed - continuing without background jobs');
    }

    // Initialize Proactive AI Radar for strategic intelligence
    try {
      await proactiveAIRadar.initialize();
      logger.info('Proactive AI Radar initialized - Strategic Co-pilot is now active');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.warn({ error: errorMessage }, 'Proactive AI Radar initialization failed - continuing without radar capabilities');
    }
  });
})();
