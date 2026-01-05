/**
 * Authentication Configuration
 * 
 * Defines which API routes require authentication and which are public.
 * This centralized configuration makes it easy to manage auth across the platform.
 */

/**
 * PUBLIC ROUTES - Accessible without authentication
 * These are typically used for marketing, demos, and public information
 */
export const PUBLIC_ROUTES = [
  // Marketing & Demo Routes - allow prospects to view content
  '/api/scenario-templates',
  '/api/scenario-templates/crisis',
  '/api/scenario-templates/category/:category',
  '/api/scenario-templates/comprehensive',
  '/api/scenario-templates/:id',
  
  // NFL Methodology - Playbook Library & Practice Drills (public demo access)
  '/api/playbook-library',
  '/api/playbook-library/domains',
  '/api/playbook-library/domains/:domainId/categories',
  '/api/playbook-library/featured',
  '/api/playbook-library/by-number/:playbookNumber',
  '/api/playbook-library/:playbookId',
  '/api/playbook-library/ai-suggestions/:organizationId',
  '/api/playbook-library/activations/:organizationId',
  '/api/playbook-library/:playbookId/activate', // Demo mode playbook activation
  
  // Execution Orchestration (demo mode access)
  '/api/execution/preflight/:executionPlanId',
  '/api/execution/activate',
  '/api/execution/status/:executionInstanceId',
  '/api/execution/acknowledge/:executionInstanceId',
  
  // 4-Phase Template System (READ-ONLY demo access - writes require auth)
  // Note: Only GET endpoints are public. POST/PATCH/DELETE require authentication.
  '/api/playbook-library/:playbookId/readiness',
  '/api/playbook-library/readiness/organization/:organizationId',
  '/api/practice-drills',
  '/api/practice-drills/:organizationId',
  '/api/practice-drills/drill/:drillId',
  '/api/practice-drills/performance',
  '/api/practice-drills/performance/:organizationId',
  '/api/crisis-simulations',
  '/api/crisis-simulations/:organizationId',
  '/api/crisis-simulations/:id',
  '/api/crisis-simulations/:id/status',
  '/api/preparedness/score',
  '/api/preparedness/score/:organizationId',
  '/api/preparedness/history',
  '/api/preparedness/calculate',
  '/api/preparedness/activity',
  '/api/preparedness-score',
  '/api/preparedness-score/:organizationId',
  '/api/organizations',
  '/api/organizations/:id',
  '/api/users', // Public access for demo mode (NO AUTHENTICATION requirement)
  
  // Demo Routes ONLY - read-only demo data endpoints
  '/api/demo/scenarios',
  '/api/demo/reset',
  '/api/dashboard/metrics',
  '/api/activations/demo', // Live Action Demo activation endpoint
  
  // Signal Intelligence Hub - demo access for triggers and data sources
  '/api/executive-triggers',
  '/api/executive-triggers/:id',
  '/api/executive-triggers/:id/status',
  '/api/data-sources',
  '/api/data-sources/:id',
  
  // Board Briefings & Executive Reports - demo access for showcase
  '/api/executive-briefings',
  '/api/executive-briefings/:briefingId',
  '/api/board-reports',
  '/api/board-reports/:reportId',
  
  // Enterprise Integrations - demo access for integration hub
  '/api/enterprise-integrations',
  '/api/enterprise-integrations/:id',
  
  // Pre-Approved Resources - demo access for execution sync
  '/api/pre-approved-resources',
  '/api/pre-approved-resources/:id',
  '/api/pre-approved-resources/:id/activate',
  
  // Sync operations - demo access
  '/api/sync/start',
  '/api/integrations/marketplace',
  '/api/integrations/enterprise/:organizationId',
  '/api/integrations/enterprise/connect',
  
  // Institutional Memory - demo access for learning dashboard
  '/api/decision-outcomes',
  '/api/decision-outcomes/:organizationId',
  '/api/learning-patterns',
  '/api/learning-patterns/:organizationId',
  '/api/institutional-memory',
  '/api/institutional-memory/:organizationId',
  
  // What-If Scenarios - demo access
  '/api/what-if-scenarios',
  '/api/what-if-scenarios/:id',
  
  // Scenarios/Playbooks - demo access
  '/api/scenarios',
  '/api/scenarios/:id',
  '/api/scenarios/recent',
  '/api/playbooks',
  '/api/playbooks/:id',
  
  // Tasks - demo access for playbook activation console
  '/api/tasks',
  '/api/tasks/:taskId',
  '/api/tasks/priority',
  
  // AI Radar Dashboard - triggers and alerts
  '/api/triggers',
  '/api/triggers/:id',
  '/api/strategic-alerts',
  '/api/strategic-alerts/:id',
  
  // Health & Status - for monitoring/uptime checks
  '/api/health',
  '/api/status',
  '/api/pilot-monitoring/system-health',
  '/api/pilot-monitoring/pilot-metrics',
  '/api/pilot-monitoring/recent-activity',
  
  // Configuration - needed for CustomerContext and landing page
  '/api/config/departments',
  '/api/config/success-metrics',
  
  // Dynamic Strategy Dashboard - public metrics display
  '/api/dynamic-strategy/status',
  '/api/dynamic-strategy/weak-signals',
  '/api/dynamic-strategy/readiness',
  '/api/dynamic-strategy/oracle-patterns',
  
  // Auth Routes - needed for login/logout flow
  '/auth/login',
  '/auth/logout',
  '/auth/callback',
  '/api/auth/status',
  '/api/auth/user',
];

/**
 * PROTECTED ROUTE PATTERNS - Require authentication
 * All routes NOT in PUBLIC_ROUTES should require auth by default
 */
export const PROTECTED_ROUTE_CATEGORIES = {
  // User & Organization Management
  USERS: [
    '/api/users',
    '/api/organizations',
    '/api/roles',
    '/api/permissions',
  ],
  
  // Strategic Scenarios & Execution
  SCENARIOS: [
    '/api/scenarios',
    '/api/scenarios/:id',
    '/api/scenarios/from-template',
    '/api/scenarios/:id/import',
  ],
  
  // Triggers & Monitoring
  TRIGGERS: [
    '/api/triggers',
    '/api/trigger-monitoring-history',
    '/api/playbook-trigger-associations',
    '/api/strategic-alerts',
  ],
  
  // Execution & War Room
  EXECUTION: [
    '/api/war-room',
    '/api/playbook-activation',
    '/api/execution-instances',
    '/api/execution-validation-reports',
  ],
  
  // AI Intelligence Modules
  AI_INTELLIGENCE: [
    '/api/pulse',
    '/api/flux',
    '/api/prism',
    '/api/echo',
    '/api/nova',
    '/api/intelligence',
  ],
  
  // Analytics & Reporting
  ANALYTICS: [
    '/api/preparedness',
    '/api/decision-confidence',
    '/api/stakeholder-alignment',
    '/api/roi-metrics',
    '/api/decision-outcomes',
  ],
  
  // Board & Executive
  EXECUTIVE: [
    '/api/executive-briefings',
    '/api/board-reports',
    '/api/executive-insights',
  ],
  
  // Integrations & Data Sources
  INTEGRATIONS: [
    '/api/data-sources',
    '/api/integrations',
    '/api/action-hooks',
  ],
  
  // Learning & Institutional Memory
  LEARNING: [
    '/api/learning-patterns',
    '/api/what-if-scenarios',
    '/api/crisis-simulations',
    '/api/dynamic-strategy/playbook-learnings',
  ],
};

/**
 * Check if a route should be public (no auth required)
 */
export function isPublicRoute(path: string): boolean {
  // Strip query string for matching (e.g., /api/playbook-library?organizationId=xxx -> /api/playbook-library)
  const pathWithoutQuery = path.split('?')[0];
  
  return PUBLIC_ROUTES.some(publicRoute => {
    // Exact match
    if (publicRoute === pathWithoutQuery) return true;
    
    // Pattern match with :param
    const pattern = publicRoute.replace(/:[^/]+/g, '[^/]+');
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(pathWithoutQuery);
  });
}

/**
 * Get auth status for all routes (for auditing)
 */
export function getAuthAudit(): {
  publicRoutes: string[];
  protectedCategories: typeof PROTECTED_ROUTE_CATEGORIES;
  summary: {
    totalPublic: number;
    totalProtected: number;
  };
} {
  const protectedCount = Object.values(PROTECTED_ROUTE_CATEGORIES)
    .flat()
    .length;
  
  return {
    publicRoutes: PUBLIC_ROUTES,
    protectedCategories: PROTECTED_ROUTE_CATEGORIES,
    summary: {
      totalPublic: PUBLIC_ROUTES.length,
      totalProtected: protectedCount,
    },
  };
}

/**
 * Middleware factory for conditional authentication
 * Returns requireAuth middleware unless route is public
 */
export function conditionalAuth(req: any, res: any, next: any) {
  // Use originalUrl to get the full path including /api prefix
  // When mounted with app.use('/api', middleware), req.path gets stripped
  const path = req.originalUrl || req.url;
  
  // Check if route is public
  if (isPublicRoute(path)) {
    return next(); // Skip auth for public routes
  }
  
  // Require auth for all other routes
  const userId = req.user?.claims?.sub || req.user?.sub || req.user?.id || null;
  if (!userId) {
    return res.status(401).json({ 
      error: 'Authentication required',
      message: 'This endpoint requires authentication. Please log in to continue.',
    });
  }
  
  req.userId = userId;
  next();
}
