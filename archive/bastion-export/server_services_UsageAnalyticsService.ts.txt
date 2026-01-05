import { db } from '../db.js';
import { usageAnalytics, engagementMetrics, users, scenarios, tasks, kpis } from '@shared/schema';
import { eq, and, desc, gte, lte, sql, count } from 'drizzle-orm';
import { databaseNotificationService } from './DatabaseNotificationService.js';

export interface AnalyticsEvent {
  organizationId: string;
  userId: string;
  sessionId?: string;
  eventType: 'page_view' | 'feature_used' | 'decision_made' | 'collaboration' | 'export' | 'search';
  feature: string; // 'crisis_response', 'kpi_dashboard', 'ai_insights', etc.
  action: string; // 'create', 'update', 'view', 'export', 'share'
  entityType?: string; // 'scenario', 'task', 'insight', 'kpi'
  entityId?: string;
  duration?: number; // seconds spent
  value?: number; // business value generated (estimated)
  context?: Record<string, any>; // Additional event data
  deviceType?: string;
  browserInfo?: Record<string, any>;
}

export interface EngagementSummary {
  userId: string;
  period: 'daily' | 'weekly' | 'monthly';
  sessionsCount: number;
  totalDuration: number; // seconds
  featuresUsed: Record<string, number>;
  decisionsInfluenced: number;
  valueGenerated: number;
  engagementScore: number; // 0.0-1.0
  riskEvents: number;
  strategicActions: number;
  collaborationEvents: number;
  trends: {
    direction: 'up' | 'down' | 'stable';
    change: number; // percentage
  };
}

export interface OrganizationAnalytics {
  organizationId: string;
  period: { start: Date; end: Date };
  overallMetrics: {
    totalUsers: number;
    activeUsers: number;
    totalSessions: number;
    averageSessionDuration: number;
    featuresAdopted: number;
    totalValueGenerated: number;
  };
  featureUsage: Array<{
    feature: string;
    users: number;
    sessions: number;
    totalDuration: number;
    valueGenerated: number;
    adoptionRate: number;
  }>;
  userEngagement: Array<{
    userId: string;
    userName: string;
    engagementScore: number;
    lastActive: Date;
    primaryFeatures: string[];
    valueContribution: number;
  }>;
  behavioralInsights: Array<{
    insight: string;
    impact: 'positive' | 'negative' | 'neutral';
    recommendation: string;
    confidence: number;
  }>;
  usagePatterns: {
    peakHours: number[];
    peakDays: string[];
    sessionFlow: Array<{
      from: string;
      to: string;
      frequency: number;
    }>;
  };
}

export class UsageAnalyticsService {

  /**
   * Track usage event
   */
  async trackEvent(event: AnalyticsEvent): Promise<void> {
    try {
      // Store the event
      await db.insert(usageAnalytics).values({
        organizationId: event.organizationId,
        userId: event.userId,
        sessionId: event.sessionId,
        eventType: event.eventType,
        feature: event.feature,
        action: event.action,
        entityType: event.entityType,
        entityId: event.entityId,
        duration: event.duration || 0,
        value: event.value ? event.value.toString() : '0',
        context: event.context || {},
        deviceType: event.deviceType,
        browserInfo: event.browserInfo || {},
        timestamp: new Date()
      });

      // Update real-time engagement metrics if this is a significant event
      if (this.isSignificantEvent(event)) {
        await this.updateRealTimeEngagement(event);
      }

    } catch (error) {
      console.error('❌ Failed to track analytics event:', error);
      // Don't throw error to avoid disrupting user experience
    }
  }

  /**
   * Determine if event is significant for real-time updates
   */
  private isSignificantEvent(event: AnalyticsEvent): boolean {
    const significantEvents = ['decision_made', 'collaboration', 'feature_used'];
    const significantFeatures = ['crisis_response', 'ai_insights', 'strategic_planning'];
    
    return significantEvents.includes(event.eventType) || 
           significantFeatures.includes(event.feature);
  }

  /**
   * Update real-time engagement metrics
   */
  private async updateRealTimeEngagement(event: AnalyticsEvent): Promise<void> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Check if today's engagement record exists
      const [existingMetric] = await db
        .select()
        .from(engagementMetrics)
        .where(
          and(
            eq(engagementMetrics.organizationId, event.organizationId),
            eq(engagementMetrics.userId, event.userId),
            eq(engagementMetrics.period, 'daily'),
            gte(engagementMetrics.periodStart, today),
            lte(engagementMetrics.periodStart, tomorrow)
          )
        );

      if (existingMetric) {
        // Update existing record
        const currentFeatures = existingMetric.featuresUsed as Record<string, number> || {};
        currentFeatures[event.feature] = (currentFeatures[event.feature] || 0) + 1;

        const updates: any = {
          featuresUsed: currentFeatures,
          totalDuration: (existingMetric.totalDuration || 0) + (event.duration || 0),
          valueGenerated: (parseFloat(existingMetric.valueGenerated || '0') + (event.value || 0)).toString()
        };

        // Update specific counters based on event type
        if (event.eventType === 'decision_made') {
          updates.decisionsInfluenced = (existingMetric.decisionsInfluenced || 0) + 1;
          updates.strategicActions = (existingMetric.strategicActions || 0) + 1;
        }

        if (event.eventType === 'collaboration') {
          updates.collaborationEvents = (existingMetric.collaborationEvents || 0) + 1;
        }

        if (event.feature.includes('crisis') || event.feature.includes('risk')) {
          updates.riskEvents = (existingMetric.riskEvents || 0) + 1;
        }

        // Recalculate engagement score
        updates.engagementScore = this.calculateEngagementScore({
          ...existingMetric,
          ...updates
        }).toString();

        await db
          .update(engagementMetrics)
          .set(updates)
          .where(eq(engagementMetrics.id, existingMetric.id));

      } else {
        // Create new daily record
        const featuresUsed: Record<string, number> = {};
        featuresUsed[event.feature] = 1;

        await db.insert(engagementMetrics).values({
          organizationId: event.organizationId,
          userId: event.userId,
          period: 'daily',
          periodStart: today,
          periodEnd: tomorrow,
          sessionsCount: 1,
          totalDuration: event.duration || 0,
          featuresUsed,
          decisionsInfluenced: event.eventType === 'decision_made' ? 1 : 0,
          valueGenerated: (event.value || 0).toString(),
          engagementScore: '0.5', // Initial score
          riskEvents: (event.feature.includes('crisis') || event.feature.includes('risk')) ? 1 : 0,
          strategicActions: event.eventType === 'decision_made' ? 1 : 0,
          collaborationEvents: event.eventType === 'collaboration' ? 1 : 0
        });
      }

    } catch (error) {
      console.error('❌ Failed to update real-time engagement:', error);
    }
  }

  /**
   * Calculate engagement score based on multiple factors
   */
  private calculateEngagementScore(metrics: any): number {
    let score = 0;

    // Feature diversity (0-0.25)
    const featuresCount = Object.keys(metrics.featuresUsed || {}).length;
    score += Math.min(0.25, featuresCount * 0.05);

    // Time investment (0-0.25)
    const hoursSpent = (metrics.totalDuration || 0) / 3600;
    score += Math.min(0.25, hoursSpent * 0.1);

    // Decision impact (0-0.25)
    score += Math.min(0.25, (metrics.decisionsInfluenced || 0) * 0.05);

    // Collaboration (0-0.25)
    score += Math.min(0.25, (metrics.collaborationEvents || 0) * 0.03);

    // Value generation bonus (0-0.1)
    const value = parseFloat(metrics.valueGenerated || '0');
    if (value > 0) {
      score += Math.min(0.1, Math.log10(value) * 0.02);
    }

    return Math.max(0, Math.min(1, score));
  }

  /**
   * Generate engagement summary for user
   */
  async generateEngagementSummary(
    userId: string,
    organizationId: string,
    period: 'daily' | 'weekly' | 'monthly' = 'weekly'
  ): Promise<EngagementSummary> {
    try {
      const { start, end } = this.getPeriodDates(period);

      // Get recent engagement metrics
      const metrics = await db
        .select()
        .from(engagementMetrics)
        .where(
          and(
            eq(engagementMetrics.organizationId, organizationId),
            eq(engagementMetrics.userId, userId),
            eq(engagementMetrics.period, period),
            gte(engagementMetrics.periodStart, start),
            lte(engagementMetrics.periodEnd, end)
          )
        )
        .orderBy(desc(engagementMetrics.periodStart));

      if (metrics.length === 0) {
        return this.getEmptyEngagementSummary(userId, period);
      }

      // Aggregate metrics
      const latestMetric = metrics[0];
      const totalDuration = metrics.reduce((sum, m) => sum + (m.totalDuration || 0), 0);
      const totalValue = metrics.reduce((sum, m) => sum + parseFloat(m.valueGenerated || '0'), 0);
      const avgEngagementScore = metrics.reduce((sum, m) => sum + parseFloat(m.engagementScore || '0'), 0) / metrics.length;

      // Combine features used
      const combinedFeatures: Record<string, number> = {};
      metrics.forEach(m => {
        const features = m.featuresUsed as Record<string, number> || {};
        Object.entries(features).forEach(([feature, count]) => {
          combinedFeatures[feature] = (combinedFeatures[feature] || 0) + count;
        });
      });

      // Calculate trends (compare with previous period)
      const previousPeriodMetrics = await this.getPreviousPeriodMetrics(userId, organizationId, period, start);
      const trends = this.calculateTrends(metrics, previousPeriodMetrics);

      return {
        userId,
        period,
        sessionsCount: latestMetric.sessionsCount || 0,
        totalDuration,
        featuresUsed: combinedFeatures,
        decisionsInfluenced: latestMetric.decisionsInfluenced || 0,
        valueGenerated: totalValue,
        engagementScore: Math.round(avgEngagementScore * 100) / 100,
        riskEvents: latestMetric.riskEvents || 0,
        strategicActions: latestMetric.strategicActions || 0,
        collaborationEvents: latestMetric.collaborationEvents || 0,
        trends
      };

    } catch (error) {
      console.error('❌ Failed to generate engagement summary:', error);
      return this.getEmptyEngagementSummary(userId, period);
    }
  }

  /**
   * Get period start and end dates
   */
  private getPeriodDates(period: 'daily' | 'weekly' | 'monthly'): { start: Date; end: Date } {
    const now = new Date();
    const start = new Date(now);
    const end = new Date(now);

    switch (period) {
      case 'daily':
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'weekly':
        start.setDate(now.getDate() - 7);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'monthly':
        start.setMonth(now.getMonth() - 1);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
    }

    return { start, end };
  }

  /**
   * Get empty engagement summary
   */
  private getEmptyEngagementSummary(userId: string, period: 'daily' | 'weekly' | 'monthly'): EngagementSummary {
    return {
      userId,
      period,
      sessionsCount: 0,
      totalDuration: 0,
      featuresUsed: {},
      decisionsInfluenced: 0,
      valueGenerated: 0,
      engagementScore: 0,
      riskEvents: 0,
      strategicActions: 0,
      collaborationEvents: 0,
      trends: { direction: 'stable', change: 0 }
    };
  }

  /**
   * Get previous period metrics for trend calculation
   */
  private async getPreviousPeriodMetrics(
    userId: string,
    organizationId: string,
    period: 'daily' | 'weekly' | 'monthly',
    currentStart: Date
  ): Promise<any[]> {
    const previousStart = new Date(currentStart);
    const previousEnd = new Date(currentStart);

    switch (period) {
      case 'daily':
        previousStart.setDate(previousStart.getDate() - 1);
        previousEnd.setDate(previousEnd.getDate() - 1);
        break;
      case 'weekly':
        previousStart.setDate(previousStart.getDate() - 7);
        previousEnd.setDate(previousEnd.getDate() - 7);
        break;
      case 'monthly':
        previousStart.setMonth(previousStart.getMonth() - 1);
        previousEnd.setMonth(previousEnd.getMonth() - 1);
        break;
    }

    return await db
      .select()
      .from(engagementMetrics)
      .where(
        and(
          eq(engagementMetrics.organizationId, organizationId),
          eq(engagementMetrics.userId, userId),
          eq(engagementMetrics.period, period),
          gte(engagementMetrics.periodStart, previousStart),
          lte(engagementMetrics.periodEnd, previousEnd)
        )
      );
  }

  /**
   * Calculate engagement trends
   */
  private calculateTrends(currentMetrics: any[], previousMetrics: any[]): {
    direction: 'up' | 'down' | 'stable';
    change: number;
  } {
    if (previousMetrics.length === 0) {
      return { direction: 'stable', change: 0 };
    }

    const currentScore = currentMetrics.reduce((sum, m) => sum + parseFloat(m.engagementScore || '0'), 0) / currentMetrics.length;
    const previousScore = previousMetrics.reduce((sum, m) => sum + parseFloat(m.engagementScore || '0'), 0) / previousMetrics.length;

    const change = ((currentScore - previousScore) / previousScore) * 100;

    let direction: 'up' | 'down' | 'stable' = 'stable';
    if (change > 5) direction = 'up';
    else if (change < -5) direction = 'down';

    return {
      direction,
      change: Math.round(Math.abs(change) * 100) / 100
    };
  }

  /**
   * Generate organization-wide analytics
   */
  async generateOrganizationAnalytics(
    organizationId: string,
    startDate: Date,
    endDate: Date
  ): Promise<OrganizationAnalytics> {
    try {
      // Get all usage events in period
      const events = await db
        .select()
        .from(usageAnalytics)
        .where(
          and(
            eq(usageAnalytics.organizationId, organizationId),
            gte(usageAnalytics.timestamp, startDate),
            lte(usageAnalytics.timestamp, endDate)
          )
        );

      // Get engagement metrics
      const engagements = await db
        .select()
        .from(engagementMetrics)
        .where(
          and(
            eq(engagementMetrics.organizationId, organizationId),
            gte(engagementMetrics.periodStart, startDate),
            lte(engagementMetrics.periodEnd, endDate)
          )
        );

      // Calculate overall metrics
      const uniqueUsers = new Set(events.map(e => e.userId)).size;
      const uniqueSessions = new Set(events.map(e => e.sessionId).filter(Boolean)).size;
      const totalDuration = events.reduce((sum, e) => sum + (e.duration || 0), 0);
      const avgSessionDuration = uniqueSessions > 0 ? totalDuration / uniqueSessions : 0;
      const totalValue = events.reduce((sum, e) => sum + parseFloat(e.value || '0'), 0);
      const featuresUsed = new Set(events.map(e => e.feature)).size;

      // Get total users for adoption rate calculation
      const allUsers = await db
        .select()
        .from(users)
        .where(eq(users.organizationId, organizationId));

      const overallMetrics = {
        totalUsers: allUsers.length,
        activeUsers: uniqueUsers,
        totalSessions: uniqueSessions,
        averageSessionDuration: Math.round(avgSessionDuration),
        featuresAdopted: featuresUsed,
        totalValueGenerated: Math.round(totalValue)
      };

      // Analyze feature usage
      const featureUsage = this.analyzeFeatureUsage(events, uniqueUsers);

      // Analyze user engagement
      const userEngagement = await this.analyzeUserEngagement(organizationId, engagements, allUsers);

      // Generate behavioral insights
      const behavioralInsights = this.generateBehavioralInsights(events, engagements);

      // Analyze usage patterns
      const usagePatterns = this.analyzeUsagePatterns(events);

      return {
        organizationId,
        period: { start: startDate, end: endDate },
        overallMetrics,
        featureUsage,
        userEngagement,
        behavioralInsights,
        usagePatterns
      };

    } catch (error) {
      console.error('❌ Failed to generate organization analytics:', error);
      throw error;
    }
  }

  /**
   * Analyze feature usage patterns
   */
  private analyzeFeatureUsage(events: any[], totalUsers: number): Array<{
    feature: string;
    users: number;
    sessions: number;
    totalDuration: number;
    valueGenerated: number;
    adoptionRate: number;
  }> {
    const featureStats: Record<string, any> = {};

    events.forEach(event => {
      const feature = event.feature;
      if (!featureStats[feature]) {
        featureStats[feature] = {
          users: new Set(),
          sessions: new Set(),
          totalDuration: 0,
          valueGenerated: 0
        };
      }

      featureStats[feature].users.add(event.userId);
      if (event.sessionId) featureStats[feature].sessions.add(event.sessionId);
      featureStats[feature].totalDuration += event.duration || 0;
      featureStats[feature].valueGenerated += parseFloat(event.value || '0');
    });

    return Object.entries(featureStats)
      .map(([feature, stats]) => ({
        feature,
        users: stats.users.size,
        sessions: stats.sessions.size,
        totalDuration: stats.totalDuration,
        valueGenerated: Math.round(stats.valueGenerated),
        adoptionRate: Math.round((stats.users.size / totalUsers) * 100)
      }))
      .sort((a, b) => b.users - a.users);
  }

  /**
   * Analyze user engagement levels
   */
  private async analyzeUserEngagement(organizationId: string, engagements: any[], allUsers: any[]): Promise<Array<{
    userId: string;
    userName: string;
    engagementScore: number;
    lastActive: Date;
    primaryFeatures: string[];
    valueContribution: number;
  }>> {
    const userEngagementMap: Record<string, any> = {};

    // Initialize all users
    allUsers.forEach(user => {
      userEngagementMap[user.id] = {
        userId: user.id,
        userName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Unknown',
        engagementScore: 0,
        lastActive: new Date(0),
        primaryFeatures: [],
        valueContribution: 0,
        featureUsage: {}
      };
    });

    // Aggregate engagement data
    engagements.forEach(engagement => {
      const userId = engagement.userId;
      if (userEngagementMap[userId]) {
        const user = userEngagementMap[userId];
        user.engagementScore = Math.max(user.engagementScore, parseFloat(engagement.engagementScore || '0'));
        user.lastActive = new Date(Math.max(user.lastActive.getTime(), new Date(engagement.calculatedAt || 0).getTime()));
        user.valueContribution += parseFloat(engagement.valueGenerated || '0');

        // Aggregate feature usage
        const features = engagement.featuresUsed as Record<string, number> || {};
        Object.entries(features).forEach(([feature, count]) => {
          user.featureUsage[feature] = (user.featureUsage[feature] || 0) + count;
        });
      }
    });

    // Determine primary features and finalize data
    return Object.values(userEngagementMap)
      .map((user: any) => {
        // Get top 3 most used features
        const primaryFeatures = Object.entries(user.featureUsage)
          .sort(([,a], [,b]) => (b as number) - (a as number))
          .slice(0, 3)
          .map(([feature]) => feature);

        return {
          userId: user.userId,
          userName: user.userName,
          engagementScore: Math.round(user.engagementScore * 100) / 100,
          lastActive: user.lastActive,
          primaryFeatures,
          valueContribution: Math.round(user.valueContribution)
        };
      })
      .sort((a, b) => b.engagementScore - a.engagementScore);
  }

  /**
   * Generate behavioral insights from usage data
   */
  private generateBehavioralInsights(events: any[], engagements: any[]): Array<{
    insight: string;
    impact: 'positive' | 'negative' | 'neutral';
    recommendation: string;
    confidence: number;
  }> {
    const insights = [];

    // Analyze feature adoption patterns
    const featureCounts = events.reduce((acc, e) => {
      acc[e.feature] = (acc[e.feature] || 0) + 1;
      return acc;
    }, {});

    const sortedFeatures = Object.entries(featureCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number));

    // High-usage features
    if (sortedFeatures.length > 0 && (sortedFeatures[0][1] as number) > events.length * 0.3) {
      insights.push({
        insight: `${sortedFeatures[0][0]} is highly adopted with ${sortedFeatures[0][1]} usage events`,
        impact: 'positive',
        recommendation: 'Consider expanding this feature with advanced capabilities',
        confidence: 0.8
      });
    }

    // Low engagement detection
    const lowEngagementUsers = engagements.filter(e => parseFloat(e.engagementScore || '0') < 0.3).length;
    const totalUsers = new Set(engagements.map(e => e.userId)).size;
    
    if (lowEngagementUsers > totalUsers * 0.2) {
      insights.push({
        insight: `${Math.round((lowEngagementUsers / totalUsers) * 100)}% of users have low engagement scores`,
        impact: 'negative',
        recommendation: 'Implement user onboarding and engagement improvement programs',
        confidence: 0.7
      });
    }

    // Usage patterns
    const avgDuration = events.reduce((sum, e) => sum + (e.duration || 0), 0) / events.length;
    if (avgDuration < 300) { // Less than 5 minutes average
      insights.push({
        insight: 'Average session duration is below optimal levels',
        impact: 'neutral',
        recommendation: 'Simplify user workflows and improve feature discoverability',
        confidence: 0.6
      });
    }

    return insights.slice(0, 5); // Limit to top 5 insights
  }

  /**
   * Analyze usage patterns (peak times, user flows)
   */
  private analyzeUsagePatterns(events: any[]): {
    peakHours: number[];
    peakDays: string[];
    sessionFlow: Array<{
      from: string;
      to: string;
      frequency: number;
    }>;
  } {
    // Analyze peak hours
    const hourCounts = new Array(24).fill(0);
    const dayCounts: Record<string, number> = {};

    events.forEach(event => {
      const date = new Date(event.timestamp);
      hourCounts[date.getHours()]++;
      
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      dayCounts[dayName] = (dayCounts[dayName] || 0) + 1;
    });

    // Get top 3 peak hours
    const peakHours = hourCounts
      .map((count, hour) => ({ hour, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map(item => item.hour);

    // Get top 3 peak days
    const peakDays = Object.entries(dayCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([day]) => day);

    // Analyze session flows (simplified)
    const sessionFlow = this.analyzeSessionFlow(events);

    return {
      peakHours,
      peakDays,
      sessionFlow
    };
  }

  /**
   * Analyze how users navigate between features
   */
  private analyzeSessionFlow(events: any[]): Array<{
    from: string;
    to: string;
    frequency: number;
  }> {
    const flowCounts: Record<string, number> = {};
    
    // Group events by session
    const sessionGroups: Record<string, any[]> = {};
    events.forEach(event => {
      if (event.sessionId) {
        if (!sessionGroups[event.sessionId]) {
          sessionGroups[event.sessionId] = [];
        }
        sessionGroups[event.sessionId].push(event);
      }
    });

    // Analyze transitions within sessions
    Object.values(sessionGroups).forEach(sessionEvents => {
      sessionEvents.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      
      for (let i = 0; i < sessionEvents.length - 1; i++) {
        const from = sessionEvents[i].feature;
        const to = sessionEvents[i + 1].feature;
        const key = `${from}->${to}`;
        flowCounts[key] = (flowCounts[key] || 0) + 1;
      }
    });

    // Convert to array and sort by frequency
    return Object.entries(flowCounts)
      .map(([transition, frequency]) => {
        const [from, to] = transition.split('->');
        return { from, to, frequency };
      })
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10); // Top 10 flows
  }

  /**
   * Send engagement alerts for low-performing users
   */
  async checkEngagementAlerts(organizationId: string): Promise<void> {
    try {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      // Get recent engagement metrics
      const recentEngagements = await db
        .select()
        .from(engagementMetrics)
        .where(
          and(
            eq(engagementMetrics.organizationId, organizationId),
            gte(engagementMetrics.periodStart, weekAgo)
          )
        );

      // Find users with declining engagement
      const userEngagement: Record<string, number[]> = {};
      recentEngagements.forEach(engagement => {
        if (!userEngagement[engagement.userId]) {
          userEngagement[engagement.userId] = [];
        }
        userEngagement[engagement.userId].push(parseFloat(engagement.engagementScore || '0'));
      });

      for (const [userId, scores] of Object.entries(userEngagement)) {
        if (scores.length >= 3) { // Need at least 3 data points
          const recent = scores.slice(-3);
          const trend = recent[2] - recent[0]; // Compare latest with 3 days ago
          
          if (trend < -0.2) { // Significant decline
            await databaseNotificationService.createAndSendNotification({
              organizationId,
              userId: 'system', // Would be sent to managers
              type: 'engagement_decline',
              title: 'User Engagement Declining',
              message: `User engagement has declined significantly. Consider reaching out to provide support or training.`,
              priority: 'medium',
              metadata: {
                affectedUserId: userId,
                engagementTrend: trend,
                currentScore: recent[2]
              }
            });
          }
        }
      }

    } catch (error) {
      console.error('❌ Failed to check engagement alerts:', error);
    }
  }

  /**
   * Export analytics data for reporting
   */
  async exportAnalyticsData(
    organizationId: string,
    startDate: Date,
    endDate: Date,
    format: 'csv' | 'json' = 'json'
  ): Promise<string> {
    try {
      const analytics = await this.generateOrganizationAnalytics(organizationId, startDate, endDate);
      
      if (format === 'json') {
        return JSON.stringify(analytics, null, 2);
      } else {
        // Convert to CSV format (simplified)
        return this.convertToCSV(analytics);
      }

    } catch (error) {
      console.error('❌ Failed to export analytics data:', error);
      throw error;
    }
  }

  /**
   * Convert analytics data to CSV format
   */
  private convertToCSV(analytics: OrganizationAnalytics): string {
    // Simplified CSV export - in production, would use proper CSV library
    const lines = [];
    
    // Header
    lines.push('Metric,Value');
    
    // Overall metrics
    lines.push(`Total Users,${analytics.overallMetrics.totalUsers}`);
    lines.push(`Active Users,${analytics.overallMetrics.activeUsers}`);
    lines.push(`Total Sessions,${analytics.overallMetrics.totalSessions}`);
    lines.push(`Avg Session Duration,${analytics.overallMetrics.averageSessionDuration}`);
    lines.push(`Features Adopted,${analytics.overallMetrics.featuresAdopted}`);
    lines.push(`Total Value Generated,${analytics.overallMetrics.totalValueGenerated}`);
    
    return lines.join('\n');
  }
}

// Export singleton instance
export const usageAnalyticsService = new UsageAnalyticsService();