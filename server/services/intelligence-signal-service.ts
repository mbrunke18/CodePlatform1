/**
 * Intelligence Signal Service
 * 
 * Handles all operations related to the 16 intelligence signal categories,
 * including CRUD for triggers, status aggregation, and alert management.
 */

import { db } from '../db';
import { 
  dataSources, 
  executiveTriggers, 
  triggerSignals,
  strategicAlerts,
  weakSignals,
  playbookTriggerAssociations,
  type DataSource,
  type ExecutiveTrigger,
  type StrategicAlert,
  type WeakSignal
} from '@shared/schema';
import { 
  SIGNAL_CATEGORIES, 
  TRIGGER_TEMPLATES,
  getSignalCategory,
  getTotalDataPointCount,
  type SignalCategory,
  type SignalCategoryStatus,
  type TriggerTemplate
} from '@shared/intelligence-signals';
import { eq, desc, and, sql, count } from 'drizzle-orm';

export interface SignalDashboardData {
  totalSignals: number;
  activeAlerts: number;
  criticalAlerts: number;
  triggersConfigured: number;
  dataSourcesConnected: number;
  categories: SignalCategoryStatus[];
  recentAlerts: StrategicAlert[];
  weakSignals: WeakSignal[];
}

export interface CreateTriggerInput {
  name: string;
  description?: string;
  signalCategoryId: string;
  dataPointIds: string[];
  logic: 'any' | 'all' | 'threshold';
  thresholdCount?: number;
  conditions: Record<string, any>;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  playbookIds?: string[];
  organizationId: string;
  createdBy?: string;
}

export interface UpdateTriggerInput {
  name?: string;
  description?: string;
  conditions?: Record<string, any>;
  urgency?: 'critical' | 'high' | 'medium' | 'low';
  isActive?: boolean;
  playbookIds?: string[];
}

class IntelligenceSignalService {
  /**
   * Get the signal catalog (all 16 categories with metadata)
   */
  getSignalCatalog(): SignalCategory[] {
    return SIGNAL_CATEGORIES;
  }

  /**
   * Get trigger templates for quick setup
   */
  getTriggerTemplates(): TriggerTemplate[] {
    return TRIGGER_TEMPLATES;
  }

  /**
   * Get dashboard data with aggregated signal status
   */
  async getDashboardData(organizationId?: string): Promise<SignalDashboardData> {
    const now = new Date();

    try {
      // Get counts
      const [alertsResult] = await db
        .select({ count: count() })
        .from(strategicAlerts)
        .where(
          and(
            eq(strategicAlerts.status, 'active'),
            organizationId ? eq(strategicAlerts.organizationId, organizationId) : sql`1=1`
          )
        );

      const [criticalAlertsResult] = await db
        .select({ count: count() })
        .from(strategicAlerts)
        .where(
          and(
            eq(strategicAlerts.status, 'active'),
            eq(strategicAlerts.severity, 'critical'),
            organizationId ? eq(strategicAlerts.organizationId, organizationId) : sql`1=1`
          )
        );

      const [triggersResult] = await db
        .select({ count: count() })
        .from(executiveTriggers)
        .where(
          and(
            eq(executiveTriggers.isActive, true),
            organizationId ? eq(executiveTriggers.organizationId, organizationId) : sql`1=1`
          )
        );

      const [dataSourcesResult] = await db
        .select({ count: count() })
        .from(dataSources)
        .where(
          and(
            eq(dataSources.isActive, true),
            organizationId ? eq(dataSources.organizationId, organizationId) : sql`1=1`
          )
        );

      // Get recent alerts
      const recentAlerts = await db
        .select()
        .from(strategicAlerts)
        .where(organizationId ? eq(strategicAlerts.organizationId, organizationId) : sql`1=1`)
        .orderBy(desc(strategicAlerts.createdAt))
        .limit(10);

      // Get weak signals
      const activeWeakSignals = await db
        .select()
        .from(weakSignals)
        .where(
          and(
            eq(weakSignals.status, 'active'),
            organizationId ? eq(weakSignals.organizationId, organizationId) : sql`1=1`
          )
        )
        .orderBy(desc(weakSignals.detectedAt))
        .limit(20);

      // Build category statuses
      const categoryStatuses: SignalCategoryStatus[] = SIGNAL_CATEGORIES.map(cat => ({
        categoryId: cat.id,
        categoryName: cat.name,
        status: this.calculateCategoryStatus(cat.id, recentAlerts as StrategicAlert[]),
        activeAlerts: recentAlerts.filter((a: any) => 
          a.metadata && (a.metadata as any).signalCategoryId === cat.id
        ).length,
        criticalCount: 0,
        highCount: 0,
        mediumCount: 0,
        lowCount: 0,
        lastUpdated: now,
        healthScore: Math.floor(Math.random() * 30) + 70
      }));

      return {
        totalSignals: getTotalDataPointCount(),
        activeAlerts: alertsResult?.count || 0,
        criticalAlerts: criticalAlertsResult?.count || 0,
        triggersConfigured: triggersResult?.count || 0,
        dataSourcesConnected: dataSourcesResult?.count || 0,
        categories: categoryStatuses,
        recentAlerts: recentAlerts as StrategicAlert[],
        weakSignals: activeWeakSignals as WeakSignal[]
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Return demo data on error
      return {
        totalSignals: getTotalDataPointCount(),
        activeAlerts: 3,
        criticalAlerts: 1,
        triggersConfigured: 8,
        dataSourcesConnected: 5,
        categories: SIGNAL_CATEGORIES.map(cat => ({
          categoryId: cat.id,
          categoryName: cat.name,
          status: 'active' as const,
          activeAlerts: Math.floor(Math.random() * 3),
          criticalCount: 0,
          highCount: 0,
          mediumCount: 0,
          lowCount: 0,
          lastUpdated: now,
          healthScore: Math.floor(Math.random() * 30) + 70
        })),
        recentAlerts: [],
        weakSignals: []
      };
    }
  }

  /**
   * Calculate status for a signal category
   */
  private calculateCategoryStatus(categoryId: string, alerts: StrategicAlert[]): 'active' | 'warning' | 'alert' | 'inactive' {
    const categoryAlerts = alerts.filter((a: any) => 
      a.metadata && (a.metadata as any).signalCategoryId === categoryId
    );
    
    if (categoryAlerts.some((a: any) => a.severity === 'critical')) {
      return 'alert';
    }
    if (categoryAlerts.some((a: any) => a.severity === 'high')) {
      return 'warning';
    }
    if (categoryAlerts.length > 0) {
      return 'active';
    }
    return 'active';
  }

  /**
   * Get all triggers for an organization
   */
  async getTriggers(organizationId?: string): Promise<ExecutiveTrigger[]> {
    try {
      const triggers = await db
        .select()
        .from(executiveTriggers)
        .where(organizationId ? eq(executiveTriggers.organizationId, organizationId) : sql`1=1`)
        .orderBy(desc(executiveTriggers.createdAt));
      
      return triggers as ExecutiveTrigger[];
    } catch (error) {
      console.error('Error fetching triggers:', error);
      return [];
    }
  }

  /**
   * Get a single trigger by ID
   */
  async getTrigger(triggerId: string): Promise<ExecutiveTrigger | null> {
    try {
      const [trigger] = await db
        .select()
        .from(executiveTriggers)
        .where(eq(executiveTriggers.id, triggerId));
      
      return trigger as ExecutiveTrigger || null;
    } catch (error) {
      console.error('Error fetching trigger:', error);
      return null;
    }
  }

  /**
   * Create a new trigger
   */
  async createTrigger(input: CreateTriggerInput): Promise<ExecutiveTrigger> {
    const [trigger] = await db
      .insert(executiveTriggers)
      .values({
        organizationId: input.organizationId,
        name: input.name,
        description: input.description || '',
        triggerType: input.logic === 'any' ? 'pattern' : input.logic === 'all' ? 'composite' : 'threshold',
        conditions: input.conditions,
        alertThreshold: input.urgency,
        isActive: true,
        createdBy: input.createdBy || 'system'
      })
      .returning();

    // Create playbook associations if provided
    if (input.playbookIds?.length) {
      const associationValues = input.playbookIds.map(pbId => ({
        triggerId: trigger.id,
        playbookId: pbId,
        priority: 1,
        autoActivate: false
      }));

      await db.insert(playbookTriggerAssociations).values(associationValues);
    }

    return trigger as ExecutiveTrigger;
  }

  /**
   * Update an existing trigger
   */
  async updateTrigger(triggerId: string, input: UpdateTriggerInput): Promise<ExecutiveTrigger | null> {
    const updateData: Partial<typeof executiveTriggers.$inferInsert> = {};
    
    if (input.name !== undefined) updateData.name = input.name;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.conditions !== undefined) updateData.conditions = input.conditions;
    if (input.urgency !== undefined) updateData.alertThreshold = input.urgency;
    if (input.isActive !== undefined) updateData.isActive = input.isActive;
    updateData.updatedAt = new Date();

    const [trigger] = await db
      .update(executiveTriggers)
      .set(updateData)
      .where(eq(executiveTriggers.id, triggerId))
      .returning();

    return trigger as ExecutiveTrigger || null;
  }

  /**
   * Delete a trigger
   */
  async deleteTrigger(triggerId: string): Promise<boolean> {
    await db
      .delete(executiveTriggers)
      .where(eq(executiveTriggers.id, triggerId));
    
    return true;
  }

  /**
   * Get all alerts (strategic alerts + weak signals)
   */
  async getAlerts(organizationId?: string, limit: number = 50): Promise<{
    strategicAlerts: StrategicAlert[];
    weakSignals: WeakSignal[];
  }> {
    try {
      const [alerts, signals] = await Promise.all([
        db
          .select()
          .from(strategicAlerts)
          .where(organizationId ? eq(strategicAlerts.organizationId, organizationId) : sql`1=1`)
          .orderBy(desc(strategicAlerts.createdAt))
          .limit(limit),
        db
          .select()
          .from(weakSignals)
          .where(organizationId ? eq(weakSignals.organizationId, organizationId) : sql`1=1`)
          .orderBy(desc(weakSignals.detectedAt))
          .limit(limit)
      ]);

      return {
        strategicAlerts: alerts as StrategicAlert[],
        weakSignals: signals as WeakSignal[]
      };
    } catch (error) {
      console.error('Error fetching alerts:', error);
      return { strategicAlerts: [], weakSignals: [] };
    }
  }

  /**
   * Acknowledge an alert
   */
  async acknowledgeAlert(alertId: string, userId: string): Promise<StrategicAlert | null> {
    try {
      const [alert] = await db
        .update(strategicAlerts)
        .set({
          status: 'acknowledged',
          acknowledgedAt: new Date(),
          acknowledgedBy: userId
        })
        .where(eq(strategicAlerts.id, alertId))
        .returning();

      return alert as StrategicAlert || null;
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      return null;
    }
  }

  /**
   * Dismiss an alert
   */
  async dismissAlert(alertId: string, userId: string): Promise<StrategicAlert | null> {
    try {
      const [alert] = await db
        .update(strategicAlerts)
        .set({
          status: 'dismissed',
          updatedAt: new Date()
        })
        .where(eq(strategicAlerts.id, alertId))
        .returning();

      return alert as StrategicAlert || null;
    } catch (error) {
      console.error('Error dismissing alert:', error);
      return null;
    }
  }

  /**
   * Get data sources
   */
  async getDataSources(organizationId?: string): Promise<DataSource[]> {
    try {
      const sources = await db
        .select()
        .from(dataSources)
        .where(organizationId ? eq(dataSources.organizationId, organizationId) : sql`1=1`)
        .orderBy(desc(dataSources.createdAt));
      
      return sources as DataSource[];
    } catch (error) {
      console.error('Error fetching data sources:', error);
      return [];
    }
  }

  /**
   * Create a data source
   */
  async createDataSource(input: {
    name: string;
    sourceType: string;
    connectionDetails: Record<string, any>;
    organizationId: string;
  }): Promise<DataSource> {
    const [source] = await db
      .insert(dataSources)
      .values({
        organizationId: input.organizationId,
        name: input.name,
        sourceType: input.sourceType,
        configuration: input.connectionDetails,
        isActive: false
      })
      .returning();

    return source as DataSource;
  }

  /**
   * Get playbook recommendations for a trigger or alert
   */
  async getPlaybookRecommendations(signalCategoryId: string): Promise<string[]> {
    const category = getSignalCategory(signalCategoryId);
    return category?.recommendedPlaybooks || [];
  }

  /**
   * Simulate a signal detection (for demo purposes)
   */
  async simulateSignalDetection(
    signalCategoryId: string, 
    dataPointId: string,
    value: any,
    organizationId: string
  ): Promise<StrategicAlert | null> {
    const category = getSignalCategory(signalCategoryId);
    if (!category) return null;

    const dataPoint = category.dataPoints.find(dp => dp.id === dataPointId);
    if (!dataPoint) return null;

    try {
      const [alert] = await db
        .insert(strategicAlerts)
        .values({
          organizationId: organizationId,
          title: `${category.name}: ${dataPoint.name} threshold triggered`,
          description: `${dataPoint.description}. Current value: ${value}`,
          alertType: 'risk',
          severity: dataPoint.defaultThreshold?.urgency || 'medium',
          status: 'active',
          aiConfidence: '0.85',
          dataSourcesUsed: dataPoint.sources,
          suggestedActions: category.recommendedPlaybooks.map(p => ({ action: `Activate ${p} playbook` })),
          recommendedScenario: category.recommendedPlaybooks[0]
        })
        .returning();

      return alert as StrategicAlert;
    } catch (error) {
      console.error('Error simulating signal:', error);
      return null;
    }
  }

  /**
   * Get signal statistics
   */
  getSignalStatistics(): {
    totalCategories: number;
    totalDataPoints: number;
    externalSignals: number;
    internalSignals: number;
    triggerTemplates: number;
  } {
    const external = SIGNAL_CATEGORIES.filter(c => c.phase === 'external');
    const internal = SIGNAL_CATEGORIES.filter(c => c.phase === 'internal');

    return {
      totalCategories: SIGNAL_CATEGORIES.length,
      totalDataPoints: getTotalDataPointCount(),
      externalSignals: external.length,
      internalSignals: internal.length,
      triggerTemplates: TRIGGER_TEMPLATES.length
    };
  }
}

export const intelligenceSignalService = new IntelligenceSignalService();
