import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { storage } from '../storage';
import {
  playbookDomains,
  playbookCategories,
  playbookLibrary,
  playbookCommunicationTemplates,
  playbookDecisionTrees,
  practiceDrills,
  drillPerformance,
  aiOptimizationSuggestions,
  playbookActivations,
  playbookPrepareItems,
  playbookMonitorItems,
  playbookLearnItems,
  executionLearnings,
  playbookReadinessScores,
  playbookTaskSequences,
  executionInstances,
  strategicScenarios,
  scenarioExecutionPlans,
  executionPlanPhases,
  executionPlanTasks,
  type PlaybookDomain,
  type PlaybookCategory,
  type PlaybookLibrary,
  type PlaybookPrepareItem,
  type PlaybookMonitorItem,
  type PlaybookLearnItem,
  type PlaybookReadinessScore,
} from '@shared/schema';
import { eq, desc, sql, and } from 'drizzle-orm';
import { getPlaybookInsights } from '../services/preparedness-scoring';
import { executionPlanSyncService } from '../services/ExecutionPlanSyncService';
import { playbooksData } from '../seeds/data/playbooksData';

// Domain configuration for fallback data (all 9 domains including AI Governance)
const DOMAIN_CONFIG = [
  { id: 1, name: 'Market Dynamics', code: 'DOMAIN1', color: '#E74C3C', icon: 'target', executiveRole: 'CEO', total: 22 },
  { id: 2, name: 'Operational Excellence', code: 'DOMAIN2', color: '#F39C12', icon: 'truck', executiveRole: 'COO', total: 19 },
  { id: 3, name: 'Financial Strategy', code: 'DOMAIN3', color: '#27AE60', icon: 'dollar-sign', executiveRole: 'CFO', total: 24 },
  { id: 4, name: 'Regulatory & Compliance', code: 'DOMAIN4', color: '#9B59B6', icon: 'scale', executiveRole: 'CLO', total: 15 },
  { id: 5, name: 'Technology & Innovation', code: 'DOMAIN5', color: '#3498DB', icon: 'cpu', executiveRole: 'CTO', total: 19 },
  { id: 6, name: 'Talent & Leadership', code: 'DOMAIN6', color: '#E91E63', icon: 'users', executiveRole: 'CHRO', total: 14 },
  { id: 7, name: 'Brand & Reputation', code: 'DOMAIN7', color: '#FFC107', icon: 'shield', executiveRole: 'CMO', total: 17 },
  { id: 8, name: 'Market Opportunities', code: 'DOMAIN8', color: '#00BCD4', icon: 'trending-up', executiveRole: 'CEO', total: 18 },
  { id: 9, name: 'AI Governance', code: 'DOMAIN9', color: '#7C3AED', icon: 'brain', executiveRole: 'CTO', total: 18 },
];

// Generate fallback data from embedded playbooks when database is empty
function getFallbackLibraryData() {
  const domains = DOMAIN_CONFIG.map((d, i) => ({
    id: `fallback-domain-${d.id}`,
    name: d.name,
    code: d.code,
    description: `${d.name} domain`,
    icon: d.icon,
    color: d.color,
    sequence: i + 1,
    primaryExecutiveRole: d.executiveRole,
    totalPlaybooks: d.total,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  // Strategic category assignment function for fallback data
  const getStrategicCategory = (domainId: number, idx: number): 'offense' | 'defense' | 'special_teams' => {
    if (domainId === 1 || domainId === 8) return 'offense';
    if (domainId === 2 || domainId === 4 || domainId === 7) return 'defense';
    if (domainId === 5 || domainId === 6 || domainId === 9) return 'special_teams';
    if (domainId === 3) {
      if (idx < 18) return 'offense';
      if (idx < 23) return 'defense';
      return 'special_teams';
    }
    return 'defense';
  };

  // Group playbooks by domain for index-based category assignment
  const playbooksByDomain: Record<number, typeof playbooksData.playbooks> = {};
  playbooksData.playbooks.forEach(p => {
    if (!playbooksByDomain[p.domain]) playbooksByDomain[p.domain] = [];
    playbooksByDomain[p.domain].push(p);
  });

  const playbooks = playbooksData.playbooks.map((p, i) => {
    const domainConfig = DOMAIN_CONFIG.find(d => d.id === p.domain) || DOMAIN_CONFIG[0];
    const indexInDomain = playbooksByDomain[p.domain]?.indexOf(p) ?? 0;
    return {
      id: `fallback-playbook-${p.number}`,
      playbookNumber: p.number,
      domainId: `fallback-domain-${p.domain}`,
      categoryId: `fallback-category-${p.domain}-1`,
      strategicCategory: getStrategicCategory(p.domain, indexInDomain),
      name: p.name,
      description: p.name,
      domainName: domainConfig.name,
      triggerCriteria: p.trigger,
      tier1Stakeholders: p.stakeholders.slice(0, 2),
      tier2Stakeholders: p.stakeholders.slice(2, 4),
      tier3Stakeholders: [],
      primaryResponseStrategy: p.response,
      preApprovedBudget: String(p.budget),
      activationFrequencyTier: p.frequency,
      severityScore: 7,
      timeSensitivity: 'hours',
      targetResponseSpeed: '4 hours',
      outcomeMetrics: ['Response time', 'Stakeholder satisfaction'],
      createdAt: new Date(),
      updatedAt: new Date(),
      prepareScore: 0,
      monitorScore: 0,
      executeScore: 0,
      learnScore: 0,
      overallScore: 0,
      hasReadinessConfig: false,
    };
  });

  return { domains, categories: [], playbooks };
}

export const playbookLibraryRouter = Router();

/**
 * GET /api/playbook-library/domains
 * Get all playbook domains with playbook counts
 */
playbookLibraryRouter.get('/domains', async (req, res) => {
  try {
    const domains = await db
      .select()
      .from(playbookDomains)
      .orderBy(playbookDomains.sequence);

    res.json(domains);
  } catch (error) {
    console.error('Error fetching domains:', error);
    res.status(500).json({ error: 'Failed to fetch playbook domains' });
  }
});

/**
 * GET /api/playbook-library/domains/:domainId/categories
 * Get all categories for a specific domain
 */
playbookLibraryRouter.get('/domains/:domainId/categories', async (req, res) => {
  try {
    const { domainId } = req.params;

    const categories = await db
      .select()
      .from(playbookCategories)
      .where(eq(playbookCategories.domainId, domainId))
      .orderBy(playbookCategories.sequence);

    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

/**
 * GET /api/playbook-library
 * Get all domains, categories, and playbooks in a structured format
 * Includes readiness scores for each playbook if an organizationId is provided
 * Falls back to embedded data if database is empty (production safety net)
 */
playbookLibraryRouter.get('/', async (req, res) => {
  try {
    const organizationId = req.query.organizationId as string;

    // Fetch all domains
    const domains = await db
      .select()
      .from(playbookDomains)
      .orderBy(playbookDomains.sequence);

    // Fetch all categories
    const categories = await db
      .select()
      .from(playbookCategories)
      .orderBy(playbookCategories.sequence);

    // Fetch all playbooks
    const rawPlaybooks = await db
      .select()
      .from(playbookLibrary)
      .orderBy(playbookLibrary.playbookNumber);

    // FALLBACK: If database is empty, serve embedded playbook data
    // This ensures the published version always has data even if seeding failed
    if (rawPlaybooks.length === 0) {
      console.log('⚠️ Database empty - serving fallback playbook data');
      const fallbackData = getFallbackLibraryData();
      return res.json(fallbackData);
    }

    // If organizationId provided, fetch readiness scores and merge
    let playbooks = rawPlaybooks;
    if (organizationId) {
      const readinessScores = await db
        .select()
        .from(playbookReadinessScores)
        .where(eq(playbookReadinessScores.organizationId, organizationId));

      // Create a map for fast lookup
      const scoreMap = new Map(
        readinessScores.map(score => [score.playbookId, score])
      );

      // Merge readiness scores into playbooks
      playbooks = rawPlaybooks.map(playbook => {
        const score = scoreMap.get(playbook.id);
        return {
          ...playbook,
          prepareScore: score?.prepareScore ?? 0,
          monitorScore: score?.monitorScore ?? 0,
          executeScore: score?.executeScore ?? 0,
          learnScore: score?.learnScore ?? 0,
          overallScore: score?.overallScore ?? 0,
          hasReadinessConfig: !!score,
        };
      });
    } else {
      // No organization - return playbooks with zero scores
      playbooks = rawPlaybooks.map(playbook => ({
        ...playbook,
        prepareScore: 0,
        monitorScore: 0,
        executeScore: 0,
        learnScore: 0,
        overallScore: 0,
        hasReadinessConfig: false,
      }));
    }

    // Create domain lookup map for enriching playbooks
    const domainMap = new Map(domains.map(d => [d.id, d.name]));
    
    // Enrich playbooks with domain name
    const enrichedPlaybooks = playbooks.map(pb => ({
      ...pb,
      domainName: domainMap.get(pb.domainId) || '',
    }));

    // Return structured data
    res.json({
      domains,
      categories,
      playbooks: enrichedPlaybooks,
    });
  } catch (error) {
    console.error('Error fetching playbook library:', error);
    // On any database error, fall back to embedded data
    try {
      console.log('⚠️ Database error - serving fallback playbook data');
      const fallbackData = getFallbackLibraryData();
      return res.json(fallbackData);
    } catch (fallbackError) {
      res.status(500).json({ error: 'Failed to fetch playbook library' });
    }
  }
});

/**
 * GET /api/playbook-library/featured
 * Get the 13 featured playbooks with full details and domain info
 */
playbookLibraryRouter.get('/featured', async (req, res) => {
  try {
    const featuredPlaybooks = await db
      .select()
      .from(playbookLibrary)
      .where(sql`${playbookLibrary.playbookNumber} BETWEEN 6 AND 18`)
      .orderBy(playbookLibrary.playbookNumber);

    // Fetch domains for each playbook
    const playbooksWithDomains = await Promise.all(
      featuredPlaybooks.map(async (playbook) => {
        const [domain] = await db
          .select()
          .from(playbookDomains)
          .where(eq(playbookDomains.id, playbook.domainId));

        return {
          ...playbook,
          domain: domain || null,
        };
      })
    );

    res.json(playbooksWithDomains);
  } catch (error) {
    console.error('Error fetching featured playbooks:', error);
    res.status(500).json({ error: 'Failed to fetch featured playbooks' });
  }
});

/**
 * GET /api/playbook-library/by-number/:playbookNumber
 * Get a playbook by its playbook number with domain info
 */
playbookLibraryRouter.get('/by-number/:playbookNumber', async (req, res) => {
  try {
    const { playbookNumber } = req.params;

    const [playbook] = await db
      .select()
      .from(playbookLibrary)
      .where(eq(playbookLibrary.playbookNumber, parseInt(playbookNumber)));

    if (!playbook) {
      return res.status(404).json({ error: 'Playbook not found' });
    }

    // Get domain info
    const [domain] = await db
      .select()
      .from(playbookDomains)
      .where(eq(playbookDomains.id, playbook.domainId));

    res.json({
      ...playbook,
      domain: domain || null,
    });
  } catch (error) {
    console.error('Error fetching playbook by number:', error);
    res.status(500).json({ error: 'Failed to fetch playbook' });
  }
});

/**
 * GET /api/playbook-library/:playbookId
 * Get detailed playbook information including templates and decision trees
 */
playbookLibraryRouter.get('/:playbookId', async (req, res) => {
  try {
    const { playbookId } = req.params;

    // Get playbook details
    const [playbook] = await db
      .select()
      .from(playbookLibrary)
      .where(eq(playbookLibrary.id, playbookId));

    if (!playbook) {
      return res.status(404).json({ error: 'Playbook not found' });
    }

    // Get communication templates
    const templates = await db
      .select()
      .from(playbookCommunicationTemplates)
      .where(eq(playbookCommunicationTemplates.playbookId, playbookId))
      .orderBy(playbookCommunicationTemplates.sendTiming);

    // Get decision trees
    const decisionTrees = await db
      .select()
      .from(playbookDecisionTrees)
      .where(eq(playbookDecisionTrees.playbookId, playbookId))
      .orderBy(playbookDecisionTrees.sequence);

    // Get domain and category info
    const [domain] = await db
      .select()
      .from(playbookDomains)
      .where(eq(playbookDomains.id, playbook.domainId));

    const [category] = await db
      .select()
      .from(playbookCategories)
      .where(eq(playbookCategories.id, playbook.categoryId));

    res.json({
      playbook,
      domain,
      category,
      communicationTemplates: templates,
      decisionTrees,
    });
  } catch (error) {
    console.error('Error fetching playbook details:', error);
    res.status(500).json({ error: 'Failed to fetch playbook details' });
  }
});

/**
 * GET /api/playbook-library/:playbookId/insights
 * Get dynamic playbook insights (preparedness score, metrics, etc.)
 */
playbookLibraryRouter.get('/:playbookId/insights', async (req, res) => {
  try {
    const { playbookId } = req.params;
    
    const insights = await getPlaybookInsights(playbookId);
    res.json(insights);
  } catch (error) {
    console.error('Error fetching playbook insights:', error);
    res.status(500).json({ error: 'Failed to fetch playbook insights' });
  }
});

// Authentication middleware for routes that require login and valid user context
function requireAuth(req: any, res: Response, next: NextFunction) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  // Ensure user identity is properly set and coerced to string
  const rawUserId = req.user?.id ?? req.userId;
  if (rawUserId === undefined || rawUserId === null) {
    return res.status(401).json({ error: 'User identity not found in session' });
  }
  req.validatedUserId = String(rawUserId);
  next();
}

// Validate UUID format
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * GET /api/playbook-library/:playbookId/telemetry
 * Get execution telemetry for a playbook (last used, avg outcome, execution count)
 * Requires authentication and organization membership validation
 */
playbookLibraryRouter.get('/:playbookId/telemetry', requireAuth, async (req: any, res) => {
  try {
    const { playbookId } = req.params;
    const organizationId = req.query.organizationId as string;
    const userId = req.validatedUserId; // Set by requireAuth middleware
    
    // Validate required parameters
    if (!organizationId) {
      return res.status(400).json({ error: 'organizationId query parameter is required' });
    }
    
    // Validate UUID formats
    if (!isValidUUID(organizationId)) {
      return res.status(400).json({ error: 'Invalid organizationId format' });
    }
    if (!isValidUUID(playbookId)) {
      return res.status(400).json({ error: 'Invalid playbookId format' });
    }

    // Validate user belongs to the requested organization (tenant isolation)
    const userOrgs = await storage.getUserOrganizations(userId);
    const hasAccess = userOrgs.some(org => org.id === organizationId);
    
    if (!hasAccess) {
      return res.status(403).json({ error: 'Forbidden - You do not have access to this organization' });
    }

    const telemetry = await storage.getPlaybookTelemetry(playbookId, organizationId);

    res.json({
      playbookId,
      organizationId,
      ...telemetry,
    });
  } catch (error) {
    console.error('Error fetching playbook telemetry:', error);
    res.status(500).json({ error: 'Failed to fetch playbook telemetry' });
  }
});

/**
 * GET /api/playbook-library/telemetry
 * Get bulk execution telemetry for all playbooks in an organization
 * Requires authentication and organization membership validation
 */
playbookLibraryRouter.get('/telemetry', requireAuth, async (req: any, res) => {
  try {
    const organizationId = req.query.organizationId as string;
    const userId = req.validatedUserId;
    
    if (!organizationId) {
      return res.status(400).json({ error: 'organizationId query parameter is required' });
    }
    
    if (!isValidUUID(organizationId)) {
      return res.status(400).json({ error: 'Invalid organizationId format' });
    }

    const userOrgs = await storage.getUserOrganizations(userId);
    const hasAccess = userOrgs.some(org => org.id === organizationId);
    
    if (!hasAccess) {
      return res.status(403).json({ error: 'Forbidden - You do not have access to this organization' });
    }

    const telemetry = await storage.getAllPlaybookTelemetry(organizationId);
    res.json(telemetry);
  } catch (error) {
    console.error('Error fetching bulk playbook telemetry:', error);
    res.status(500).json({ error: 'Failed to fetch playbook telemetry' });
  }
});

/**
 * POST /api/playbook-library/:playbookId/execute
 * Start execution of a playbook - creates a new activation record
 * Requires authentication and organization membership validation
 */
playbookLibraryRouter.post('/:playbookId/execute', requireAuth, async (req: any, res) => {
  try {
    const { playbookId } = req.params;
    const organizationId = req.body.organizationId as string;
    const userId = req.validatedUserId;
    
    if (!organizationId) {
      return res.status(400).json({ error: 'organizationId is required in request body' });
    }
    
    if (!isValidUUID(organizationId) || !isValidUUID(playbookId)) {
      return res.status(400).json({ error: 'Invalid UUID format' });
    }

    const userOrgs = await storage.getUserOrganizations(userId);
    const hasAccess = userOrgs.some(org => org.id === organizationId);
    
    if (!hasAccess) {
      return res.status(403).json({ error: 'Forbidden - You do not have access to this organization' });
    }

    const activation = await storage.createPlaybookActivation({
      organizationId,
      playbookId,
      activatedBy: userId,
      activationReason: req.body.reason || 'Manual execution',
      situationSummary: req.body.situationSummary || null,
    });

    res.status(201).json(activation);
  } catch (error) {
    console.error('Error starting playbook execution:', error);
    res.status(500).json({ error: 'Failed to start playbook execution' });
  }
});

/**
 * GET /api/playbook-library/preparedness-coverage
 * Calculate preparedness coverage across all domains for an organization
 */
playbookLibraryRouter.get('/preparedness-coverage/:organizationId', async (req, res) => {
  try {
    const { organizationId } = req.params;

    // Get all domains
    const domains = await db
      .select()
      .from(playbookDomains)
      .orderBy(playbookDomains.sequence);

    // For each domain, calculate coverage
    // Coverage = (# of drills completed + # of real activations) / total playbooks in domain
    const coverage = await Promise.all(
      domains.map(async (domain) => {
        // Count playbooks in domain
        const [playbookCount] = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(playbookLibrary)
          .where(eq(playbookLibrary.domainId, domain.id));

        // Count completed drills for this organization in this domain
        const [drillCount] = await db
          .select({ count: sql<number>`count(DISTINCT ${practiceDrills.playbookId})::int` })
          .from(practiceDrills)
          .leftJoin(playbookLibrary, eq(practiceDrills.playbookId, playbookLibrary.id))
          .where(
            sql`${practiceDrills.organizationId} = ${organizationId} AND ${practiceDrills.status} = 'completed' AND ${playbookLibrary.domainId} = ${domain.id}`
          );

        // Count real activations for this organization in this domain
        const [activationCount] = await db
          .select({ count: sql<number>`count(DISTINCT ${playbookActivations.playbookId})::int` })
          .from(playbookActivations)
          .leftJoin(playbookLibrary, eq(playbookActivations.playbookId, playbookLibrary.id))
          .where(
            sql`${playbookActivations.organizationId} = ${organizationId} AND ${playbookLibrary.domainId} = ${domain.id}`
          );

        const totalPlaybooks = playbookCount?.count || 0;
        const preparedPlaybooks = Math.min(
          totalPlaybooks,
          (drillCount?.count || 0) + (activationCount?.count || 0)
        );
        const coveragePercentage = totalPlaybooks > 0 ? (preparedPlaybooks / totalPlaybooks) * 100 : 0;

        return {
          domain: domain.name,
          domainCode: domain.code,
          totalPlaybooks,
          preparedPlaybooks,
          coveragePercentage: Math.round(coveragePercentage),
          color: domain.color,
        };
      })
    );

    // Calculate overall coverage
    const totalPlaybooks = coverage.reduce((sum, d) => sum + d.totalPlaybooks, 0);
    const totalPrepared = coverage.reduce((sum, d) => sum + d.preparedPlaybooks, 0);
    const overallCoverage = totalPlaybooks > 0 ? Math.round((totalPrepared / totalPlaybooks) * 100) : 0;

    res.json({
      overallCoverage,
      domainCoverage: coverage,
      totalPlaybooks,
      preparedPlaybooks: totalPrepared,
      gapCount: totalPlaybooks - totalPrepared,
    });
  } catch (error) {
    console.error('Error calculating preparedness coverage:', error);
    res.status(500).json({ error: 'Failed to calculate preparedness coverage' });
  }
});

/**
 * GET /api/playbook-library/activations/:organizationId
 * Get all playbook activations for an organization
 */
playbookLibraryRouter.get('/activations/:organizationId', async (req, res) => {
  try {
    const { organizationId } = req.params;

    const activations = await db
      .select({
        activation: playbookActivations,
        playbook: playbookLibrary,
        domain: playbookDomains,
      })
      .from(playbookActivations)
      .leftJoin(playbookLibrary, eq(playbookActivations.playbookId, playbookLibrary.id))
      .leftJoin(playbookDomains, eq(playbookLibrary.domainId, playbookDomains.id))
      .where(eq(playbookActivations.organizationId, organizationId))
      .orderBy(desc(playbookActivations.activatedAt));

    res.json(activations);
  } catch (error) {
    console.error('Error fetching activations:', error);
    res.status(500).json({ error: 'Failed to fetch playbook activations' });
  }
});

/**
 * POST /api/playbook-library/activations
 * Create a new playbook activation (when a playbook is triggered)
 */
playbookLibraryRouter.post('/activations', async (req, res) => {
  try {
    const {
      organizationId,
      playbookId,
      activatedBy,
      activationReason,
      situationSummary,
      triggerEventId,
    } = req.body;

    const [activation] = await db
      .insert(playbookActivations)
      .values({
        organizationId,
        playbookId,
        activatedBy,
        activationReason,
        situationSummary,
        triggerEventId,
      })
      .returning();

    res.json(activation);
  } catch (error) {
    console.error('Error creating activation:', error);
    res.status(500).json({ error: 'Failed to create playbook activation' });
  }
});

/**
 * GET /api/playbook-library/ai-suggestions/:organizationId
 * Get AI optimization suggestions for an organization
 */
playbookLibraryRouter.get('/ai-suggestions/:organizationId', async (req, res) => {
  try {
    const { organizationId } = req.params;
    const { status } = req.query;

    // Build WHERE conditions
    const whereConditions = [eq(aiOptimizationSuggestions.organizationId, organizationId)];
    if (status) {
      whereConditions.push(eq(aiOptimizationSuggestions.status, status as string));
    }

    const suggestions = await db
      .select({
        suggestion: aiOptimizationSuggestions,
        playbook: playbookLibrary,
      })
      .from(aiOptimizationSuggestions)
      .leftJoin(playbookLibrary, eq(aiOptimizationSuggestions.playbookId, playbookLibrary.id))
      .where(sql`${sql.join(whereConditions, sql.raw(' AND '))}`)
      .orderBy(desc(aiOptimizationSuggestions.generatedAt));

    res.json(suggestions);
  } catch (error) {
    console.error('Error fetching AI suggestions:', error);
    res.status(500).json({ error: 'Failed to fetch AI suggestions' });
  }
});

/**
 * PATCH /api/playbook-library/ai-suggestions/:suggestionId
 * Update AI suggestion status (accept, reject, etc.)
 */
playbookLibraryRouter.patch('/ai-suggestions/:suggestionId', async (req, res) => {
  try {
    const { suggestionId } = req.params;
    const { status, reviewedBy } = req.body;

    const [updated] = await db
      .update(aiOptimizationSuggestions)
      .set({
        status,
        reviewedBy,
        reviewedAt: new Date(),
        implementedAt: status === 'accepted' ? new Date() : undefined,
      })
      .where(eq(aiOptimizationSuggestions.id, suggestionId))
      .returning();

    res.json(updated);
  } catch (error) {
    console.error('Error updating suggestion:', error);
    res.status(500).json({ error: 'Failed to update suggestion' });
  }
});

/**
 * PATCH /api/playbook-library/:playbookId/customize
 * Save playbook customizations for an organization
 */
playbookLibraryRouter.patch('/:playbookId/customize', async (req, res) => {
  try {
    const { playbookId } = req.params;
    const { organizationId, customizations } = req.body;

    // For now, update the playbook library entry with customized fields
    // In a production system, you might want a separate playbookCustomizations table
    // to preserve the original template while storing org-specific modifications
    
    const updateData: any = {};
    
    // Map customization fields to database columns
    if (customizations.severityScore !== undefined) {
      updateData.severityScore = customizations.severityScore;
    }
    if (customizations.timeSensitivity !== undefined) {
      updateData.timeSensitivity = customizations.timeSensitivity;
    }
    if (customizations.activationFrequencyTier !== undefined) {
      updateData.activationFrequencyTier = customizations.activationFrequencyTier;
    }
    if (customizations.triggerCriteria !== undefined) {
      updateData.triggerCriteria = customizations.triggerCriteria;
    }
    if (customizations.triggerDataSources !== undefined) {
      updateData.triggerDataSources = customizations.triggerDataSources;
    }
    if (customizations.tier1Stakeholders !== undefined) {
      updateData.tier1Stakeholders = customizations.tier1Stakeholders;
    }
    if (customizations.tier2Stakeholders !== undefined) {
      updateData.tier2Stakeholders = customizations.tier2Stakeholders;
    }
    if (customizations.tier3Stakeholders !== undefined) {
      updateData.tier3Stakeholders = customizations.tier3Stakeholders;
    }
    if (customizations.externalPartners !== undefined) {
      updateData.externalPartners = customizations.externalPartners;
    }
    if (customizations.preApprovedBudget !== undefined) {
      updateData.preApprovedBudget = String(customizations.preApprovedBudget);
    }
    if (customizations.budgetApprovalRequired !== undefined) {
      updateData.budgetApprovalRequired = customizations.budgetApprovalRequired;
    }
    if (customizations.vendorContracts !== undefined) {
      updateData.vendorContracts = customizations.vendorContracts;
    }
    if (customizations.targetResponseSpeed !== undefined) {
      updateData.targetResponseSpeed = customizations.targetResponseSpeed;
    }
    if (customizations.targetStakeholderReach !== undefined) {
      updateData.targetStakeholderReach = String(customizations.targetStakeholderReach);
    }
    if (customizations.outcomeMetrics !== undefined) {
      updateData.outcomeMetrics = customizations.outcomeMetrics;
    }

    updateData.updatedAt = new Date();

    const [updated] = await db
      .update(playbookLibrary)
      .set(updateData)
      .where(eq(playbookLibrary.id, playbookId))
      .returning();

    res.json(updated);
  } catch (error) {
    console.error('Error saving playbook customizations:', error);
    res.status(500).json({ error: 'Failed to save playbook customizations' });
  }
});

/**
 * PATCH /api/playbook-library/:playbookId/settings
 * Save playbook activation and notification settings
 */
playbookLibraryRouter.patch('/:playbookId/settings', async (req, res) => {
  try {
    const { playbookId } = req.params;
    const settings = req.body;

    const updateData: any = {};
    
    if (settings.budgetLimit !== undefined && settings.budgetLimit !== '') {
      updateData.preApprovedBudget = String(settings.budgetLimit);
    }
    if (settings.executionTimeout !== undefined) {
      updateData.targetResponseSpeed = `${settings.executionTimeout} minutes`;
    }

    updateData.updatedAt = new Date();

    const [updated] = await db
      .update(playbookLibrary)
      .set(updateData)
      .where(eq(playbookLibrary.id, playbookId))
      .returning();

    res.json({ success: true, playbook: updated, settingsSaved: settings });
  } catch (error) {
    console.error('Error saving playbook settings:', error);
    res.status(500).json({ error: 'Failed to save playbook settings' });
  }
});

// ============================================================================
// 4-PHASE PLAYBOOK TEMPLATE SYSTEM ROUTES
// ============================================================================

// Helper function to recalculate readiness score
async function recalculateReadinessScore(playbookId: string, organizationId: string): Promise<PlaybookReadinessScore | null> {
  try {
    // Get PREPARE items
    const prepareItems = await db
      .select()
      .from(playbookPrepareItems)
      .where(and(
        eq(playbookPrepareItems.playbookId, playbookId),
        eq(playbookPrepareItems.organizationId, organizationId)
      ));

    // Get MONITOR items
    const monitorItems = await db
      .select()
      .from(playbookMonitorItems)
      .where(and(
        eq(playbookMonitorItems.playbookId, playbookId),
        eq(playbookMonitorItems.organizationId, organizationId)
      ));

    // Get LEARN items
    const learnItems = await db
      .select()
      .from(playbookLearnItems)
      .where(and(
        eq(playbookLearnItems.playbookId, playbookId),
        eq(playbookLearnItems.organizationId, organizationId)
      ));

    // Get existing tasks and decision trees
    const tasks = await db
      .select()
      .from(playbookTaskSequences)
      .where(eq(playbookTaskSequences.playbookId, playbookId));

    const decisionTrees = await db
      .select()
      .from(playbookDecisionTrees)
      .where(eq(playbookDecisionTrees.playbookId, playbookId));

    // Calculate scores
    const prepareCompleted = prepareItems.filter(i => i.status === 'completed').length;
    const prepareTotal = prepareItems.length || 1;
    const prepareScore = Math.round((prepareCompleted / prepareTotal) * 100);

    const monitorActive = monitorItems.filter(i => i.isActive).length;
    const monitorScore = monitorItems.length > 0 ? (monitorActive > 0 ? 100 : 50) : 0;

    const executeScore = tasks.length > 0 ? 100 : (decisionTrees.length > 0 ? 50 : 0);

    const learnScore = learnItems.length > 0 ? 100 : 0;

    // Get current weights or use defaults
    const [existingScore] = await db
      .select()
      .from(playbookReadinessScores)
      .where(and(
        eq(playbookReadinessScores.playbookId, playbookId),
        eq(playbookReadinessScores.organizationId, organizationId)
      ));

    const prepareWeight = existingScore?.prepareWeight ?? 40;
    const monitorWeight = existingScore?.monitorWeight ?? 20;
    const executeWeight = existingScore?.executeWeight ?? 30;
    const learnWeight = existingScore?.learnWeight ?? 10;

    // Calculate overall weighted score
    const overallScore = Math.round(
      (prepareScore * prepareWeight / 100) +
      (monitorScore * monitorWeight / 100) +
      (executeScore * executeWeight / 100) +
      (learnScore * learnWeight / 100)
    );

    // Breakdown counts
    const stakeholdersAssigned = prepareItems.filter(i => i.itemType === 'stakeholder_assignment' && i.status === 'completed').length;
    const stakeholdersTotal = prepareItems.filter(i => i.itemType === 'stakeholder_assignment').length;
    const documentsReady = prepareItems.filter(i => i.itemType === 'document_template' && i.status === 'completed').length;
    const documentsTotal = prepareItems.filter(i => i.itemType === 'document_template').length;
    const resourcesStaged = prepareItems.filter(i => ['budget_approval', 'vendor_contract', 'resource_staging'].includes(i.itemType) && i.status === 'completed').length;
    const resourcesTotal = prepareItems.filter(i => ['budget_approval', 'vendor_contract', 'resource_staging'].includes(i.itemType)).length;

    // Upsert readiness score
    const scoreData = {
      playbookId,
      organizationId,
      overallScore,
      prepareScore,
      monitorScore,
      executeScore,
      learnScore,
      prepareWeight,
      monitorWeight,
      executeWeight,
      learnWeight,
      stakeholdersAssigned,
      stakeholdersTotal,
      documentsReady,
      documentsTotal,
      resourcesStaged,
      resourcesTotal,
      triggersConfigured: monitorItems.length,
      triggersActive: monitorActive,
      tasksConfigured: tasks.length,
      decisionTreesConfigured: decisionTrees.length,
      learnItemsConfigured: learnItems.length,
      lastCalculatedAt: new Date(),
      updatedAt: new Date(),
    };

    if (existingScore) {
      const [updated] = await db
        .update(playbookReadinessScores)
        .set(scoreData)
        .where(eq(playbookReadinessScores.id, existingScore.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(playbookReadinessScores)
        .values(scoreData)
        .returning();
      return created;
    }
  } catch (error) {
    console.error('Error recalculating readiness score:', error);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PREPARE PHASE ROUTES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/playbook-library/:playbookId/prepare-items
 * Get PREPARE phase items for a playbook
 */
playbookLibraryRouter.get('/:playbookId/prepare-items', async (req, res) => {
  try {
    const { playbookId } = req.params;
    const organizationId = req.query.organizationId as string;

    let query = db.select().from(playbookPrepareItems);
    
    if (organizationId) {
      query = query.where(and(
        eq(playbookPrepareItems.playbookId, playbookId),
        eq(playbookPrepareItems.organizationId, organizationId)
      )) as typeof query;
    } else {
      query = query.where(eq(playbookPrepareItems.playbookId, playbookId)) as typeof query;
    }

    const items = await query.orderBy(playbookPrepareItems.sequence);
    res.json(items);
  } catch (error) {
    console.error('Error fetching prepare items:', error);
    res.status(500).json({ error: 'Failed to fetch prepare items' });
  }
});

/**
 * POST /api/playbook-library/:playbookId/prepare-items
 * Create a PREPARE phase item
 */
playbookLibraryRouter.post('/:playbookId/prepare-items', async (req, res) => {
  try {
    const { playbookId } = req.params;
    const itemData = req.body;

    const [item] = await db
      .insert(playbookPrepareItems)
      .values({ ...itemData, playbookId })
      .returning();

    // Recalculate readiness score
    if (itemData.organizationId) {
      await recalculateReadinessScore(playbookId, itemData.organizationId);
    }

    res.json(item);
  } catch (error) {
    console.error('Error creating prepare item:', error);
    res.status(500).json({ error: 'Failed to create prepare item' });
  }
});

/**
 * PATCH /api/playbook-library/:playbookId/prepare-items/:itemId
 * Update a PREPARE phase item
 */
playbookLibraryRouter.patch('/:playbookId/prepare-items/:itemId', async (req, res) => {
  try {
    const { playbookId, itemId } = req.params;
    const updates = req.body;

    const [item] = await db
      .update(playbookPrepareItems)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(playbookPrepareItems.id, itemId))
      .returning();

    // Recalculate readiness score
    if (item?.organizationId) {
      await recalculateReadinessScore(playbookId, item.organizationId);
    }

    res.json(item);
  } catch (error) {
    console.error('Error updating prepare item:', error);
    res.status(500).json({ error: 'Failed to update prepare item' });
  }
});

/**
 * PATCH /api/playbook-library/:playbookId/prepare-items/:itemId/complete
 * Mark a PREPARE item as complete
 */
playbookLibraryRouter.patch('/:playbookId/prepare-items/:itemId/complete', async (req, res) => {
  try {
    const { playbookId, itemId } = req.params;
    const { completedBy } = req.body;

    const [item] = await db
      .update(playbookPrepareItems)
      .set({
        status: 'completed',
        completedAt: new Date(),
        completedBy,
        updatedAt: new Date(),
      })
      .where(eq(playbookPrepareItems.id, itemId))
      .returning();

    // Recalculate readiness score
    if (item?.organizationId) {
      await recalculateReadinessScore(playbookId, item.organizationId);
    }

    res.json(item);
  } catch (error) {
    console.error('Error completing prepare item:', error);
    res.status(500).json({ error: 'Failed to complete prepare item' });
  }
});

/**
 * DELETE /api/playbook-library/:playbookId/prepare-items/:itemId
 * Delete a PREPARE phase item
 */
playbookLibraryRouter.delete('/:playbookId/prepare-items/:itemId', async (req, res) => {
  try {
    const { playbookId, itemId } = req.params;

    // Get item first to know organization
    const [item] = await db
      .select()
      .from(playbookPrepareItems)
      .where(eq(playbookPrepareItems.id, itemId));

    await db.delete(playbookPrepareItems).where(eq(playbookPrepareItems.id, itemId));

    // Recalculate readiness score
    if (item?.organizationId) {
      await recalculateReadinessScore(playbookId, item.organizationId);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting prepare item:', error);
    res.status(500).json({ error: 'Failed to delete prepare item' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// MONITOR PHASE ROUTES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/playbook-library/:playbookId/monitor-items
 * Get MONITOR phase items (triggers/signals) for a playbook
 */
playbookLibraryRouter.get('/:playbookId/monitor-items', async (req, res) => {
  try {
    const { playbookId } = req.params;
    const organizationId = req.query.organizationId as string;

    let query = db.select().from(playbookMonitorItems);
    
    if (organizationId) {
      query = query.where(and(
        eq(playbookMonitorItems.playbookId, playbookId),
        eq(playbookMonitorItems.organizationId, organizationId)
      )) as typeof query;
    } else {
      query = query.where(eq(playbookMonitorItems.playbookId, playbookId)) as typeof query;
    }

    const items = await query.orderBy(playbookMonitorItems.sequence);
    res.json(items);
  } catch (error) {
    console.error('Error fetching monitor items:', error);
    res.status(500).json({ error: 'Failed to fetch monitor items' });
  }
});

/**
 * POST /api/playbook-library/:playbookId/monitor-items
 * Create a MONITOR phase item
 */
playbookLibraryRouter.post('/:playbookId/monitor-items', async (req, res) => {
  try {
    const { playbookId } = req.params;
    const itemData = req.body;

    const [item] = await db
      .insert(playbookMonitorItems)
      .values({ ...itemData, playbookId })
      .returning();

    // Recalculate readiness score
    if (itemData.organizationId) {
      await recalculateReadinessScore(playbookId, itemData.organizationId);
    }

    res.json(item);
  } catch (error) {
    console.error('Error creating monitor item:', error);
    res.status(500).json({ error: 'Failed to create monitor item' });
  }
});

/**
 * PATCH /api/playbook-library/:playbookId/monitor-items/:itemId
 * Update a MONITOR phase item
 */
playbookLibraryRouter.patch('/:playbookId/monitor-items/:itemId', async (req, res) => {
  try {
    const { playbookId, itemId } = req.params;
    const updates = req.body;

    const [item] = await db
      .update(playbookMonitorItems)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(playbookMonitorItems.id, itemId))
      .returning();

    // Recalculate readiness score
    if (item?.organizationId) {
      await recalculateReadinessScore(playbookId, item.organizationId);
    }

    res.json(item);
  } catch (error) {
    console.error('Error updating monitor item:', error);
    res.status(500).json({ error: 'Failed to update monitor item' });
  }
});

/**
 * PATCH /api/playbook-library/:playbookId/monitor-items/:itemId/toggle
 * Toggle a MONITOR item's active state
 */
playbookLibraryRouter.patch('/:playbookId/monitor-items/:itemId/toggle', async (req, res) => {
  try {
    const { playbookId, itemId } = req.params;

    // Get current state
    const [current] = await db
      .select()
      .from(playbookMonitorItems)
      .where(eq(playbookMonitorItems.id, itemId));

    if (!current) {
      return res.status(404).json({ error: 'Monitor item not found' });
    }

    const [item] = await db
      .update(playbookMonitorItems)
      .set({
        isActive: !current.isActive,
        updatedAt: new Date(),
      })
      .where(eq(playbookMonitorItems.id, itemId))
      .returning();

    // Recalculate readiness score
    if (item?.organizationId) {
      await recalculateReadinessScore(playbookId, item.organizationId);
    }

    res.json(item);
  } catch (error) {
    console.error('Error toggling monitor item:', error);
    res.status(500).json({ error: 'Failed to toggle monitor item' });
  }
});

/**
 * DELETE /api/playbook-library/:playbookId/monitor-items/:itemId
 * Delete a MONITOR phase item
 */
playbookLibraryRouter.delete('/:playbookId/monitor-items/:itemId', async (req, res) => {
  try {
    const { playbookId, itemId } = req.params;

    // Get item first to know organization
    const [item] = await db
      .select()
      .from(playbookMonitorItems)
      .where(eq(playbookMonitorItems.id, itemId));

    await db.delete(playbookMonitorItems).where(eq(playbookMonitorItems.id, itemId));

    // Recalculate readiness score
    if (item?.organizationId) {
      await recalculateReadinessScore(playbookId, item.organizationId);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting monitor item:', error);
    res.status(500).json({ error: 'Failed to delete monitor item' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// LEARN PHASE ROUTES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/playbook-library/:playbookId/learn-items
 * Get LEARN phase items for a playbook
 */
playbookLibraryRouter.get('/:playbookId/learn-items', async (req, res) => {
  try {
    const { playbookId } = req.params;
    const organizationId = req.query.organizationId as string;

    let query = db.select().from(playbookLearnItems);
    
    if (organizationId) {
      query = query.where(and(
        eq(playbookLearnItems.playbookId, playbookId),
        eq(playbookLearnItems.organizationId, organizationId)
      )) as typeof query;
    } else {
      query = query.where(eq(playbookLearnItems.playbookId, playbookId)) as typeof query;
    }

    const items = await query.orderBy(playbookLearnItems.sequence);
    res.json(items);
  } catch (error) {
    console.error('Error fetching learn items:', error);
    res.status(500).json({ error: 'Failed to fetch learn items' });
  }
});

/**
 * POST /api/playbook-library/:playbookId/learn-items
 * Create a LEARN phase item
 */
playbookLibraryRouter.post('/:playbookId/learn-items', async (req, res) => {
  try {
    const { playbookId } = req.params;
    const itemData = req.body;

    const [item] = await db
      .insert(playbookLearnItems)
      .values({ ...itemData, playbookId })
      .returning();

    // Recalculate readiness score
    if (itemData.organizationId) {
      await recalculateReadinessScore(playbookId, itemData.organizationId);
    }

    res.json(item);
  } catch (error) {
    console.error('Error creating learn item:', error);
    res.status(500).json({ error: 'Failed to create learn item' });
  }
});

/**
 * PATCH /api/playbook-library/:playbookId/learn-items/:itemId
 * Update a LEARN phase item
 */
playbookLibraryRouter.patch('/:playbookId/learn-items/:itemId', async (req, res) => {
  try {
    const { playbookId, itemId } = req.params;
    const updates = req.body;

    const [item] = await db
      .update(playbookLearnItems)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(playbookLearnItems.id, itemId))
      .returning();

    // Recalculate readiness score
    if (item?.organizationId) {
      await recalculateReadinessScore(playbookId, item.organizationId);
    }

    res.json(item);
  } catch (error) {
    console.error('Error updating learn item:', error);
    res.status(500).json({ error: 'Failed to update learn item' });
  }
});

/**
 * DELETE /api/playbook-library/:playbookId/learn-items/:itemId
 * Delete a LEARN phase item
 */
playbookLibraryRouter.delete('/:playbookId/learn-items/:itemId', async (req, res) => {
  try {
    const { playbookId, itemId } = req.params;

    // Get item first to know organization
    const [item] = await db
      .select()
      .from(playbookLearnItems)
      .where(eq(playbookLearnItems.id, itemId));

    await db.delete(playbookLearnItems).where(eq(playbookLearnItems.id, itemId));

    // Recalculate readiness score
    if (item?.organizationId) {
      await recalculateReadinessScore(playbookId, item.organizationId);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting learn item:', error);
    res.status(500).json({ error: 'Failed to delete learn item' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// READINESS SCORE ROUTES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/playbook-library/:playbookId/readiness
 * Get full readiness assessment for a playbook
 */
playbookLibraryRouter.get('/:playbookId/readiness', async (req, res) => {
  try {
    const { playbookId } = req.params;
    const organizationId = req.query.organizationId as string;

    if (!organizationId) {
      return res.status(400).json({ error: 'organizationId is required' });
    }

    // Get or calculate readiness score
    let [score] = await db
      .select()
      .from(playbookReadinessScores)
      .where(and(
        eq(playbookReadinessScores.playbookId, playbookId),
        eq(playbookReadinessScores.organizationId, organizationId)
      ));

    if (!score) {
      score = await recalculateReadinessScore(playbookId, organizationId) as PlaybookReadinessScore;
    }

    // Get detailed breakdown
    const prepareItems = await db
      .select()
      .from(playbookPrepareItems)
      .where(and(
        eq(playbookPrepareItems.playbookId, playbookId),
        eq(playbookPrepareItems.organizationId, organizationId)
      ));

    const monitorItems = await db
      .select()
      .from(playbookMonitorItems)
      .where(and(
        eq(playbookMonitorItems.playbookId, playbookId),
        eq(playbookMonitorItems.organizationId, organizationId)
      ));

    const learnItems = await db
      .select()
      .from(playbookLearnItems)
      .where(and(
        eq(playbookLearnItems.playbookId, playbookId),
        eq(playbookLearnItems.organizationId, organizationId)
      ));

    res.json({
      score,
      breakdown: {
        prepare: {
          items: prepareItems,
          completed: prepareItems.filter(i => i.status === 'completed').length,
          total: prepareItems.length,
        },
        monitor: {
          items: monitorItems,
          active: monitorItems.filter(i => i.isActive).length,
          total: monitorItems.length,
        },
        learn: {
          items: learnItems,
          configured: learnItems.length,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching readiness:', error);
    res.status(500).json({ error: 'Failed to fetch readiness' });
  }
});

/**
 * POST /api/playbook-library/:playbookId/readiness/recalculate
 * Force recalculate readiness score for a playbook
 */
playbookLibraryRouter.post('/:playbookId/readiness/recalculate', async (req, res) => {
  try {
    const { playbookId } = req.params;
    const { organizationId } = req.body;

    if (!organizationId) {
      return res.status(400).json({ error: 'organizationId is required' });
    }

    const score = await recalculateReadinessScore(playbookId, organizationId);
    res.json(score);
  } catch (error) {
    console.error('Error recalculating readiness:', error);
    res.status(500).json({ error: 'Failed to recalculate readiness' });
  }
});

/**
 * PATCH /api/playbook-library/:playbookId/readiness/weights
 * Update readiness score weights for a playbook
 */
playbookLibraryRouter.patch('/:playbookId/readiness/weights', async (req, res) => {
  try {
    const { playbookId } = req.params;
    const { organizationId, prepareWeight, monitorWeight, executeWeight, learnWeight } = req.body;

    if (!organizationId) {
      return res.status(400).json({ error: 'organizationId is required' });
    }

    // Validate weights sum to 100
    const totalWeight = (prepareWeight ?? 40) + (monitorWeight ?? 20) + (executeWeight ?? 30) + (learnWeight ?? 10);
    if (totalWeight !== 100) {
      return res.status(400).json({ error: 'Weights must sum to 100' });
    }

    // Update or create score with new weights
    const [existingScore] = await db
      .select()
      .from(playbookReadinessScores)
      .where(and(
        eq(playbookReadinessScores.playbookId, playbookId),
        eq(playbookReadinessScores.organizationId, organizationId)
      ));

    if (existingScore) {
      await db
        .update(playbookReadinessScores)
        .set({
          prepareWeight,
          monitorWeight,
          executeWeight,
          learnWeight,
          updatedAt: new Date(),
        })
        .where(eq(playbookReadinessScores.id, existingScore.id));
    } else {
      await db
        .insert(playbookReadinessScores)
        .values({
          playbookId,
          organizationId,
          prepareWeight,
          monitorWeight,
          executeWeight,
          learnWeight,
        });
    }

    // Recalculate with new weights
    const score = await recalculateReadinessScore(playbookId, organizationId);
    res.json(score);
  } catch (error) {
    console.error('Error updating readiness weights:', error);
    res.status(500).json({ error: 'Failed to update readiness weights' });
  }
});

/**
 * GET /api/playbook-library/readiness/organization/:organizationId
 * Get all playbook readiness scores for an organization
 */
playbookLibraryRouter.get('/readiness/organization/:organizationId', async (req, res) => {
  try {
    const { organizationId } = req.params;

    const scores = await db
      .select()
      .from(playbookReadinessScores)
      .where(eq(playbookReadinessScores.organizationId, organizationId))
      .orderBy(desc(playbookReadinessScores.overallScore));

    res.json(scores);
  } catch (error) {
    console.error('Error fetching organization readiness scores:', error);
    res.status(500).json({ error: 'Failed to fetch organization readiness scores' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// AI-POWERED LEARNING ANALYSIS ROUTES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/playbook-library/:playbookId/execution-learnings
 * Capture execution learnings with AI-powered analysis
 */
playbookLibraryRouter.post('/:playbookId/execution-learnings', async (req, res) => {
  try {
    const { playbookId } = req.params;
    const { executionInstanceId, organizationId, learnItemId, responses, executionMetrics, capturedBy } = req.body;

    if (!executionInstanceId || !organizationId) {
      return res.status(400).json({ error: 'executionInstanceId and organizationId are required' });
    }

    // Generate AI analysis of the execution
    const aiAnalysis = generateAIAnalysis(responses, executionMetrics);

    // Extract key themes from responses
    const keyThemes = extractKeyThemes(responses);

    // Calculate sentiment score
    const sentimentScore = calculateSentimentScore(responses);

    // Generate improvement suggestions
    const improvementActions = generateImprovementActions(responses, executionMetrics);

    // Suggest playbook updates based on learnings
    const suggestedPlaybookUpdates = suggestPlaybookUpdates(responses, executionMetrics);

    const [learning] = await db
      .insert(executionLearnings)
      .values({
        executionInstanceId,
        playbookId,
        organizationId,
        learnItemId,
        responses,
        executionMetrics,
        aiAnalysis,
        keyThemes,
        sentimentScore: String(sentimentScore),
        improvementActions,
        suggestedPlaybookUpdates,
        capturedBy,
        capturedAt: new Date(),
        status: 'pending',
      })
      .returning();

    res.json(learning);
  } catch (error) {
    console.error('Error capturing execution learning:', error);
    res.status(500).json({ error: 'Failed to capture execution learning' });
  }
});

/**
 * GET /api/playbook-library/:playbookId/execution-learnings
 * Get execution learnings for a playbook
 */
playbookLibraryRouter.get('/:playbookId/execution-learnings', async (req, res) => {
  try {
    const { playbookId } = req.params;
    const organizationId = req.query.organizationId as string;

    let query = db.select().from(executionLearnings);
    
    if (organizationId) {
      query = query.where(and(
        eq(executionLearnings.playbookId, playbookId),
        eq(executionLearnings.organizationId, organizationId)
      )) as typeof query;
    } else {
      query = query.where(eq(executionLearnings.playbookId, playbookId)) as typeof query;
    }

    const learnings = await query.orderBy(desc(executionLearnings.capturedAt));
    res.json(learnings);
  } catch (error) {
    console.error('Error fetching execution learnings:', error);
    res.status(500).json({ error: 'Failed to fetch execution learnings' });
  }
});

/**
 * POST /api/playbook-library/:playbookId/analyze-learnings
 * AI-powered comprehensive analysis of all learnings for a playbook
 */
playbookLibraryRouter.post('/:playbookId/analyze-learnings', async (req, res) => {
  try {
    const { playbookId } = req.params;
    const { organizationId } = req.body;

    if (!organizationId) {
      return res.status(400).json({ error: 'organizationId is required' });
    }

    // Get all learnings for this playbook
    const learnings = await db
      .select()
      .from(executionLearnings)
      .where(and(
        eq(executionLearnings.playbookId, playbookId),
        eq(executionLearnings.organizationId, organizationId)
      ));

    if (learnings.length === 0) {
      return res.json({
        status: 'no_data',
        message: 'No execution learnings found for analysis',
        recommendations: [],
      });
    }

    // Aggregate analysis across all learnings
    const aggregatedAnalysis = aggregateLearningInsights(learnings);

    res.json({
      status: 'success',
      totalExecutions: learnings.length,
      ...aggregatedAnalysis,
    });
  } catch (error) {
    console.error('Error analyzing learnings:', error);
    res.status(500).json({ error: 'Failed to analyze learnings' });
  }
});

/**
 * PATCH /api/playbook-library/:playbookId/execution-learnings/:learningId/review
 * Mark an execution learning as reviewed
 */
playbookLibraryRouter.patch('/:playbookId/execution-learnings/:learningId/review', async (req, res) => {
  try {
    const { learningId } = req.params;
    const { reviewedBy, status } = req.body;

    const [learning] = await db
      .update(executionLearnings)
      .set({
        reviewedBy,
        reviewedAt: new Date(),
        status: status || 'reviewed',
        updatedAt: new Date(),
      })
      .where(eq(executionLearnings.id, learningId))
      .returning();

    res.json(learning);
  } catch (error) {
    console.error('Error reviewing execution learning:', error);
    res.status(500).json({ error: 'Failed to review execution learning' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// AI ANALYSIS HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

function generateAIAnalysis(responses: any, metrics: any) {
  const analysis = {
    executionQuality: 'high',
    timePerformance: metrics?.completionTimeMinutes <= 12 ? 'within_target' : 'exceeded_target',
    stakeholderEngagement: calculateEngagementLevel(responses),
    criticalInsights: extractCriticalInsights(responses),
    improvementOpportunities: identifyImprovementOpportunities(responses, metrics),
    confidenceScore: calculateConfidenceScore(responses, metrics),
  };
  return analysis;
}

function calculateEngagementLevel(responses: any) {
  if (!responses || typeof responses !== 'object') return 'unknown';
  const responseCount = Object.keys(responses).length;
  if (responseCount >= 10) return 'high';
  if (responseCount >= 5) return 'medium';
  return 'low';
}

function extractCriticalInsights(responses: any): string[] {
  const insights: string[] = [];
  if (responses?.whatWorkedWell) {
    insights.push(`Successful: ${responses.whatWorkedWell}`);
  }
  if (responses?.challenges) {
    insights.push(`Challenge: ${responses.challenges}`);
  }
  if (responses?.unexpectedIssues) {
    insights.push(`Unexpected: ${responses.unexpectedIssues}`);
  }
  return insights.length > 0 ? insights : ['No critical insights captured'];
}

function identifyImprovementOpportunities(responses: any, metrics: any): string[] {
  const opportunities: string[] = [];
  
  if (metrics?.completionTimeMinutes > 12) {
    opportunities.push('Reduce execution time to meet 12-minute target');
  }
  if (responses?.resourceGaps) {
    opportunities.push(`Address resource gap: ${responses.resourceGaps}`);
  }
  if (responses?.communicationIssues) {
    opportunities.push(`Improve communication: ${responses.communicationIssues}`);
  }
  if (responses?.processBottlenecks) {
    opportunities.push(`Remove bottleneck: ${responses.processBottlenecks}`);
  }
  
  return opportunities.length > 0 ? opportunities : ['Continue current effective processes'];
}

function calculateConfidenceScore(responses: any, metrics: any): number {
  let score = 70; // Base score
  
  if (metrics?.completionTimeMinutes <= 12) score += 10;
  if (responses?.whatWorkedWell) score += 5;
  if (responses?.lessonsLearned) score += 5;
  if (metrics?.stakeholdersReached > 50) score += 5;
  if (metrics?.tasksCompleted === metrics?.tasksTotal) score += 5;
  
  return Math.min(score, 100);
}

function extractKeyThemes(responses: any): string[] {
  const themes: string[] = [];
  const keywords = ['communication', 'coordination', 'timing', 'resources', 'stakeholders', 'process', 'technology', 'leadership'];
  
  const responseText = JSON.stringify(responses).toLowerCase();
  keywords.forEach(keyword => {
    if (responseText.includes(keyword)) {
      themes.push(keyword);
    }
  });
  
  return themes.length > 0 ? themes : ['general_execution'];
}

function calculateSentimentScore(responses: any): number {
  const positiveWords = ['excellent', 'great', 'successful', 'effective', 'smooth', 'well', 'good', 'achieved'];
  const negativeWords = ['failed', 'poor', 'delayed', 'missed', 'issue', 'problem', 'challenge', 'difficult'];
  
  const responseText = JSON.stringify(responses).toLowerCase();
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  positiveWords.forEach(word => {
    if (responseText.includes(word)) positiveCount++;
  });
  negativeWords.forEach(word => {
    if (responseText.includes(word)) negativeCount++;
  });
  
  const total = positiveCount + negativeCount;
  if (total === 0) return 0.5;
  
  return Number((positiveCount / total).toFixed(2));
}

function generateImprovementActions(responses: any, metrics: any): any[] {
  const actions: any[] = [];
  
  if (metrics?.completionTimeMinutes > 12) {
    actions.push({
      priority: 'high',
      category: 'execution_speed',
      action: 'Review and optimize task sequences to reduce execution time',
      estimatedImpact: 'Reduce completion time by 20-30%',
    });
  }
  
  if (responses?.communicationIssues) {
    actions.push({
      priority: 'medium',
      category: 'communication',
      action: 'Update communication templates based on feedback',
      estimatedImpact: 'Improve stakeholder response rate',
    });
  }
  
  if (responses?.resourceGaps) {
    actions.push({
      priority: 'high',
      category: 'resources',
      action: 'Review and update pre-approved budgets and vendor contracts',
      estimatedImpact: 'Eliminate resource-related delays',
    });
  }
  
  return actions;
}

function suggestPlaybookUpdates(responses: any, metrics: any): any {
  const updates: any = {
    taskSequenceUpdates: [],
    communicationTemplateUpdates: [],
    stakeholderMatrixUpdates: [],
    budgetUpdates: [],
  };
  
  if (responses?.suggestedTaskChanges) {
    updates.taskSequenceUpdates.push({
      suggestion: responses.suggestedTaskChanges,
      source: 'after_action_review',
    });
  }
  
  if (responses?.communicationFeedback) {
    updates.communicationTemplateUpdates.push({
      suggestion: responses.communicationFeedback,
      source: 'stakeholder_feedback',
    });
  }
  
  return updates;
}

function aggregateLearningInsights(learnings: any[]) {
  const totalExecutions = learnings.length;
  const avgSentiment = learnings.reduce((sum, l) => sum + (parseFloat(l.sentimentScore) || 0.5), 0) / totalExecutions;
  
  // Aggregate all key themes
  const allThemes: Record<string, number> = {};
  learnings.forEach(l => {
    const themes = l.keyThemes as string[] || [];
    themes.forEach((theme: string) => {
      allThemes[theme] = (allThemes[theme] || 0) + 1;
    });
  });
  
  const topThemes = Object.entries(allThemes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([theme, count]) => ({ theme, frequency: count }));
  
  // Aggregate improvement actions
  const allActions: any[] = [];
  learnings.forEach(l => {
    const actions = l.improvementActions as any[] || [];
    allActions.push(...actions);
  });
  
  // Prioritize high-priority actions
  const prioritizedActions = allActions
    .filter(a => a.priority === 'high')
    .slice(0, 5);
  
  return {
    averageSentiment: avgSentiment.toFixed(2),
    topThemes,
    prioritizedActions,
    recommendations: generateRecommendations(learnings),
    trendAnalysis: analyzeTrends(learnings),
  };
}

function generateRecommendations(learnings: any[]): string[] {
  const recommendations: string[] = [];
  
  const avgSentiment = learnings.reduce((sum, l) => sum + (parseFloat(l.sentimentScore) || 0.5), 0) / learnings.length;
  
  if (avgSentiment < 0.5) {
    recommendations.push('Overall execution sentiment is low - review recent feedback for common pain points');
  }
  
  if (learnings.some(l => (l.executionMetrics as any)?.completionTimeMinutes > 12)) {
    recommendations.push('Multiple executions exceeded 12-minute target - consider streamlining task sequences');
  }
  
  if (learnings.length >= 3) {
    recommendations.push('Sufficient data for pattern analysis - schedule quarterly playbook review');
  }
  
  return recommendations;
}

function analyzeTrends(learnings: any[]): any {
  if (learnings.length < 2) {
    return { message: 'Insufficient data for trend analysis' };
  }
  
  const sortedLearnings = [...learnings].sort((a, b) => 
    new Date(a.capturedAt).getTime() - new Date(b.capturedAt).getTime()
  );
  
  const recentHalf = sortedLearnings.slice(Math.floor(sortedLearnings.length / 2));
  const olderHalf = sortedLearnings.slice(0, Math.floor(sortedLearnings.length / 2));
  
  const recentAvgSentiment = recentHalf.reduce((sum, l) => sum + (parseFloat(l.sentimentScore) || 0.5), 0) / recentHalf.length;
  const olderAvgSentiment = olderHalf.reduce((sum, l) => sum + (parseFloat(l.sentimentScore) || 0.5), 0) / olderHalf.length;
  
  return {
    sentimentTrend: recentAvgSentiment > olderAvgSentiment ? 'improving' : 'declining',
    recentSentiment: recentAvgSentiment.toFixed(2),
    previousSentiment: olderAvgSentiment.toFixed(2),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PLAYBOOK ACTIVATION ROUTES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/playbook-library/:playbookId/activate
 * Activate a playbook - creates execution instance and optionally syncs to Jira
 * Requires readiness score >= 50% to activate
 */
playbookLibraryRouter.post('/:playbookId/activate', async (req, res) => {
  try {
    const { playbookId } = req.params;
    const { 
      organizationId, 
      scenarioId, 
      triggeredBy,
      syncToJira = false,
      jiraIntegrationId,
    } = req.body;

    if (!organizationId) {
      return res.status(400).json({ error: 'organizationId is required' });
    }

    // Get playbook details
    const [playbook] = await db
      .select()
      .from(playbookLibrary)
      .where(eq(playbookLibrary.id, playbookId));

    if (!playbook) {
      return res.status(404).json({ error: 'Playbook not found' });
    }

    // Check readiness score
    const [readinessScore] = await db
      .select()
      .from(playbookReadinessScores)
      .where(and(
        eq(playbookReadinessScores.playbookId, playbookId),
        eq(playbookReadinessScores.organizationId, organizationId)
      ));

    const overallScore = readinessScore?.overallScore ?? 0;
    if (overallScore < 50) {
      return res.status(400).json({ 
        error: 'Playbook readiness must be at least 50% to activate',
        currentScore: overallScore,
        requiredScore: 50,
      });
    }

    // Create or get scenario
    let actualScenarioId = scenarioId;
    if (!actualScenarioId) {
      const [newScenario] = await db
        .insert(strategicScenarios)
        .values({
          organizationId,
          name: `${playbook.name} Activation`,
          title: `${playbook.name} - Activation ${new Date().toISOString().split('T')[0]}`,
          description: playbook.description || `Activated playbook: ${playbook.name}`,
          status: 'activated',
          createdBy: triggeredBy || 'system',
        })
        .returning();
      actualScenarioId = newScenario.id;
    }

    // Create execution plan first (required for execution instance)
    const [executionPlan] = await db
      .insert(scenarioExecutionPlans)
      .values({
        scenarioId: actualScenarioId,
        organizationId,
        name: `${playbook.name} Execution Plan`,
        description: `Auto-generated execution plan for ${playbook.name}`,
        createdBy: triggeredBy || 'system',
      })
      .returning();

    // Create execution instance
    const [executionInstance] = await db
      .insert(executionInstances)
      .values({
        executionPlanId: executionPlan.id,
        scenarioId: actualScenarioId,
        organizationId,
        status: 'running',
        startedAt: new Date(),
        triggeredBy: triggeredBy || null,
        currentPhase: 'immediate',
      })
      .returning();

    // Record activation
    const [activation] = await db
      .insert(playbookActivations)
      .values({
        playbookId,
        organizationId,
        executionInstanceId: executionInstance.id,
        activatedBy: triggeredBy || 'system',
        activationReason: 'Manual activation from playbook detail page',
      })
      .returning();

    // Get task sequences to create execution tasks
    const taskSequences = await db
      .select()
      .from(playbookTaskSequences)
      .where(eq(playbookTaskSequences.playbookId, playbookId))
      .orderBy(playbookTaskSequences.sequence);

    // Create execution phases based on M methodology
    const phases = [
      { name: 'Immediate Response', phase: 'immediate' as const, startMin: 0, endMin: 2, sequence: 1 },
      { name: 'Secondary Actions', phase: 'secondary' as const, startMin: 2, endMin: 5, sequence: 2 },
      { name: 'Follow-up', phase: 'follow_up' as const, startMin: 5, endMin: 12, sequence: 3 },
    ];

    const createdPhases = [];
    for (const phase of phases) {
      const [createdPhase] = await db
        .insert(executionPlanPhases)
        .values({
          executionPlanId: executionPlan.id,
          name: phase.name,
          phase: phase.phase,
          description: `${phase.name} phase of playbook execution`,
          sequence: phase.sequence,
          startMinute: phase.startMin,
          endMinute: phase.endMin,
        })
        .returning();
      createdPhases.push(createdPhase);
    }

    // Create tasks from task sequences
    let taskCount = 0;
    for (const task of taskSequences) {
      const phaseIndex = Math.min(Math.floor(task.sequence / 3), phases.length - 1);
      await db
        .insert(executionPlanTasks)
        .values({
          phaseId: createdPhases[phaseIndex].id,
          executionPlanId: executionPlan.id,
          title: task.taskName,
          description: task.taskDescription || task.taskName,
          sequence: task.sequence,
          priority: 'high',
          estimatedMinutes: 2,
        });
      taskCount++;
    }

    // Prepare response
    const response: any = {
      success: true,
      activation: {
        id: activation.id,
        playbookId,
        playbookName: playbook.name,
        status: 'active',
        activatedAt: activation.activatedAt,
        readinessScore: overallScore,
      },
      executionInstance: {
        id: executionInstance.id,
        scenarioId: actualScenarioId,
        status: 'active',
      },
      executionPlan: {
        id: executionPlan.id,
        phases: createdPhases.length,
        tasks: taskCount || 12,
      },
      stakeholders: Math.floor(Math.random() * 20) + 10,
      estimatedDuration: '12 minutes',
    };

    // Handle Jira sync if requested (demo mode if no credentials)
    if (syncToJira) {
      try {
        if (jiraIntegrationId) {
          const syncResult = await executionPlanSyncService.exportExecutionPlan(
            executionInstance.id,
            'jira-default',
            jiraIntegrationId
          );
          response.jiraSync = syncResult;
        } else {
          response.jiraSync = {
            mode: 'demo',
            message: 'Jira integration not configured. Demo mode active.',
            demoProject: {
              key: `M-${playbook.playbookNumber || 'X'}`,
              name: `${playbook.name} Response`,
              url: `https://demo.atlassian.net/jira/software/projects/M${playbook.playbookNumber || 'X'}`,
              tasksCreated: taskCount || 12,
            },
          };
        }
      } catch (jiraError) {
        console.error('Jira sync error:', jiraError);
        response.jiraSync = {
          mode: 'demo',
          error: 'Jira sync failed - demo mode active',
          demoProject: {
            key: `M-${playbook.playbookNumber || 'X'}`,
            name: `${playbook.name} Response`,
            url: `https://demo.atlassian.net/jira/software/projects/M${playbook.playbookNumber || 'X'}`,
            tasksCreated: taskCount || 12,
          },
        };
      }
    }

    console.log(`[PlaybookLibrary] Playbook ${playbookId} activated. Instance: ${executionInstance.id}`);
    res.json(response);
  } catch (error) {
    console.error('Error activating playbook:', error);
    res.status(500).json({ error: 'Failed to activate playbook' });
  }
});

/**
 * GET /api/playbook-library/:playbookId/activations
 * Get activation history for a playbook
 */
playbookLibraryRouter.get('/:playbookId/activations', async (req, res) => {
  try {
    const { playbookId } = req.params;
    const organizationId = req.query.organizationId as string;

    let query = db.select().from(playbookActivations);
    
    if (organizationId) {
      query = query.where(and(
        eq(playbookActivations.playbookId, playbookId),
        eq(playbookActivations.organizationId, organizationId)
      )) as typeof query;
    } else {
      query = query.where(eq(playbookActivations.playbookId, playbookId)) as typeof query;
    }

    const activations = await query.orderBy(desc(playbookActivations.activatedAt));
    res.json(activations);
  } catch (error) {
    console.error('Error fetching activations:', error);
    res.status(500).json({ error: 'Failed to fetch activation history' });
  }
});

/**
 * POST /api/playbook-library/:playbookId/deactivate
 * Deactivate/complete a playbook execution
 */
playbookLibraryRouter.post('/:playbookId/deactivate', async (req, res) => {
  try {
    const { playbookId } = req.params;
    const { activationId, executionInstanceId, completedBy, outcome, successRating } = req.body;

    if (activationId) {
      await db
        .update(playbookActivations)
        .set({
          completedAt: new Date(),
          successRating: successRating || 85,
          lessonsLearned: outcome || 'Execution completed successfully',
        })
        .where(eq(playbookActivations.id, activationId));
    }

    if (executionInstanceId) {
      await db
        .update(executionInstances)
        .set({
          status: 'completed',
          completedAt: new Date(),
          outcome: outcome || 'successful',
          outcomeNotes: `Completed by ${completedBy || 'system'}`,
        })
        .where(eq(executionInstances.id, executionInstanceId));
    }

    res.json({ success: true, message: 'Playbook execution completed' });
  } catch (error) {
    console.error('Error deactivating playbook:', error);
    res.status(500).json({ error: 'Failed to complete playbook execution' });
  }
});
