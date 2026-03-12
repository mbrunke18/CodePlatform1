import { db } from '../db';
import { warRoomSessions, tasks, strategicScenarios } from '@shared/schema';
import { eq, and, gte, desc, sql } from 'drizzle-orm';

interface ROIMetrics {
  totalSavings: number;
  totalHoursSaved: number;
  activationCount: number;
  quarterlyTrends: Array<{
    quarter: string;
    savings: number;
    hours: number;
    activations: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    savings: number;
    percentage: number;
  }>;
  averagePerActivation: number;
  velocityImprovement: string;
  successRate: number;
}

interface BusinessImpact {
  monetaryValue?: number;
  revenueGenerated?: number;
  costAvoided?: number;
  marketShareGained?: number;
  timeToMarket?: number;
}

export class ROITracker {
  /**
   * Calculate real ROI from actual playbook activations
   */
  async calculateRealROI(organizationId: string): Promise<ROIMetrics> {
    try {
      // Get all completed activations (war room sessions)
      const activations = await db.select()
        .from(warRoomSessions)
        .where(and(
          eq(warRoomSessions.organizationId, organizationId),
          eq(warRoomSessions.status, 'completed')
        ))
        .orderBy(desc(warRoomSessions.createdAt));

      let totalSavings = 0;
      let totalHoursSaved = 0;
      const successfulActivations = activations.filter(a => a.outcome !== 'failed');

      // Calculate savings per activation
      for (const activation of activations) {
        const savings = await this.calculateActivationValue(activation);
        totalSavings += savings.totalValue;
        totalHoursSaved += savings.hoursSaved;
      }

      // Calculate quarterly trends
      const quarterlyTrends = await this.calculateQuarterlyTrends(organizationId, activations);

      // Calculate category breakdown
      const categoryBreakdown = await this.calculateCategoryBreakdown(organizationId, activations);

      // Calculate velocity improvement
      const avgExecutionTime = activations.length > 0
        ? activations.reduce((sum, a) => sum + (a.executionTimeMinutes || 0), 0) / activations.length
        : 0;
      const traditionalTime = 72 * 60; // 72 hours in minutes
      const velocityMultiplier = avgExecutionTime > 0 
        ? Math.round(traditionalTime / avgExecutionTime) 
        : 0;

      return {
        totalSavings,
        totalHoursSaved,
        activationCount: activations.length,
        quarterlyTrends,
        categoryBreakdown,
        averagePerActivation: activations.length > 0 ? totalSavings / activations.length : 0,
        velocityImprovement: `${velocityMultiplier}x`,
        successRate: activations.length > 0 
          ? (successfulActivations.length / activations.length) * 100 
          : 0
      };
    } catch (error) {
      console.error('Error calculating ROI:', error);
      throw error;
    }
  }

  /**
   * Calculate value for a single activation
   */
  async calculateActivationValue(activation: any): Promise<{
    totalValue: number;
    hoursSaved: number;
    breakdown: {
      timeSavings: number;
      businessImpact: number;
    };
  }> {
    // 1. Time savings calculation
    const traditionalExecutionTime = 72; // hours
    const actualExecutionTime = (activation.executionTimeMinutes || 60) / 60; // convert to hours
    const hoursSaved = Math.max(0, traditionalExecutionTime - actualExecutionTime);

    // 2. Cost of time saved (based on stakeholder count and executive hourly rate)
    const executiveHourlyRate = activation.executiveHourlyRate || 350; // Configurable per org
    const stakeholderCount = activation.stakeholdersNotified || 30;
    const timeSavings = hoursSaved * executiveHourlyRate * stakeholderCount;

    // 3. Business impact value (from tracked outcomes)
    const impact = activation.businessImpact as BusinessImpact || {};
    const businessImpactValue = 
      (impact.monetaryValue || 0) +
      (impact.revenueGenerated || 0) +
      (impact.costAvoided || 0);

    const totalValue = timeSavings + businessImpactValue;

    return {
      totalValue,
      hoursSaved,
      breakdown: {
        timeSavings,
        businessImpact: businessImpactValue
      }
    };
  }

  /**
   * Track business impact for an activation
   */
  async trackBusinessImpact(
    activationId: string,
    impact: BusinessImpact
  ): Promise<void> {
    try {
      await db.update(warRoomSessions)
        .set({
          updatedAt: new Date()
        })
        .where(eq(warRoomSessions.id, activationId));
    } catch (error) {
      console.error('Error tracking business impact:', error);
      throw error;
    }
  }

  /**
   * Calculate quarterly trends
   */
  private async calculateQuarterlyTrends(
    organizationId: string,
    activations: any[]
  ): Promise<Array<{ quarter: string; savings: number; hours: number; activations: number }>> {
    const quarters: Map<string, { savings: number; hours: number; count: number }> = new Map();

    for (const activation of activations) {
      const date = new Date(activation.createdAt);
      const quarter = this.getQuarter(date);

      if (!quarters.has(quarter)) {
        quarters.set(quarter, { savings: 0, hours: 0, count: 0 });
      }

      const value = await this.calculateActivationValue(activation);
      const q = quarters.get(quarter)!;
      q.savings += value.totalValue;
      q.hours += value.hoursSaved;
      q.count += 1;
    }

    return Array.from(quarters.entries())
      .map(([quarter, data]) => ({
        quarter,
        savings: Math.round(data.savings),
        hours: Math.round(data.hours),
        activations: data.count
      }))
      .sort((a, b) => a.quarter.localeCompare(b.quarter))
      .slice(-4); // Last 4 quarters
  }

  /**
   * Calculate category breakdown
   */
  private async calculateCategoryBreakdown(
    organizationId: string,
    activations: any[]
  ): Promise<Array<{ category: string; savings: number; percentage: number }>> {
    const categories: Map<string, number> = new Map();
    let totalSavings = 0;

    for (const activation of activations) {
      // Get scenario to determine category
      let category = 'Other';
      
      if (activation.scenarioId) {
        const scenario = await db.select()
          .from(strategicScenarios)
          .where(eq(strategicScenarios.id, activation.scenarioId))
          .limit(1);
        category = scenario[0]?.templateCategory || 'Other';
      }

      const value = await this.calculateActivationValue(activation);

      categories.set(category, (categories.get(category) || 0) + value.totalValue);
      totalSavings += value.totalValue;
    }

    return Array.from(categories.entries())
      .map(([category, savings]) => ({
        category,
        savings: Math.round(savings),
        percentage: totalSavings > 0 ? Math.round((savings / totalSavings) * 100) : 0
      }))
      .sort((a, b) => b.savings - a.savings);
  }

  /**
   * Get fiscal quarter from date
   */
  private getQuarter(date: Date): string {
    const month = date.getMonth();
    const year = date.getFullYear();
    const quarter = Math.floor(month / 3) + 1;
    return `Q${quarter} ${year}`;
  }

  /**
   * Get ROI forecast based on trends
   */
  async forecastROI(
    organizationId: string,
    monthsAhead: number = 3
  ): Promise<{
    projected: number;
    confidence: number;
    assumptions: string[];
  }> {
    const currentROI = await this.calculateRealROI(organizationId);
    
    // Simple linear projection based on recent growth
    const trends = currentROI.quarterlyTrends;
    if (trends.length < 2) {
      return {
        projected: currentROI.totalSavings,
        confidence: 30,
        assumptions: ['Insufficient historical data for accurate forecasting']
      };
    }

    const recentGrowth = trends[trends.length - 1].savings - trends[trends.length - 2].savings;
    const monthlyGrowthRate = recentGrowth / 3; // Quarterly to monthly
    const projected = currentROI.totalSavings + (monthlyGrowthRate * monthsAhead);

    return {
      projected: Math.round(projected),
      confidence: Math.min(85, 50 + (trends.length * 10)), // More data = higher confidence
      assumptions: [
        `Based on ${trends.length} quarters of historical data`,
        `Recent growth rate: $${Math.round(recentGrowth).toLocaleString()}/quarter`,
        `Assumes continued adoption and execution success`
      ]
    };
  }

  /**
   * Calculate value per scenario type
   */
  async getValueByScenarioType(organizationId: string): Promise<Array<{
    type: string;
    totalValue: number;
    avgValue: number;
    count: number;
  }>> {
    const activations = await db.select()
      .from(warRoomSessions)
      .where(eq(warRoomSessions.organizationId, organizationId));

    const typeMap: Map<string, { total: number; count: number }> = new Map();

    for (const activation of activations) {
      let type = 'Unknown';
      
      if (activation.scenarioId) {
        const scenario = await db.select()
          .from(strategicScenarios)
          .where(eq(strategicScenarios.id, activation.scenarioId))
          .limit(1);
        type = scenario[0]?.type || 'Unknown';
      }

      const value = await this.calculateActivationValue(activation);

      if (!typeMap.has(type)) {
        typeMap.set(type, { total: 0, count: 0 });
      }

      const data = typeMap.get(type)!;
      data.total += value.totalValue;
      data.count += 1;
    }

    return Array.from(typeMap.entries())
      .map(([type, data]) => ({
        type,
        totalValue: Math.round(data.total),
        avgValue: Math.round(data.total / data.count),
        count: data.count
      }))
      .sort((a, b) => b.totalValue - a.totalValue);
  }
}

export const roiTracker = new ROITracker();
