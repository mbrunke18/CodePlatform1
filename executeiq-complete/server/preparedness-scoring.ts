import { db } from './db';
import { 
  preparednessScores, 
  preparednessActivities,
  peerBenchmarks,
  whatIfScenarios,
  strategicScenarios,
  executiveTriggers,
  users,
  organizations
} from '@shared/schema';
import { eq, and, desc, sql, count, avg, gte } from 'drizzle-orm';

interface ScoreComponents {
  scenariosPracticed: number; // 0-30 points
  drillsCompleted: number; // 0-25 points
  triggersCovered: number; // 0-20 points
  playbookReadiness: number; // 0-15 points
  recentActivity: number; // 0-10 points
}

interface CoverageGap {
  category: string;
  severity: 'high' | 'medium' | 'low';
  missingPlaybooks: string[];
  recommendation: string;
}

export class PreparednessScoring {
  
  /**
   * Calculate comprehensive preparedness score for a user
   */
  async calculatePreparednessScore(userId: string, organizationId: string): Promise<number> {
    const components = await this.getScoreComponents(userId, organizationId);
    
    // Calculate total score (0-100)
    const totalScore = 
      components.scenariosPracticed + 
      components.drillsCompleted + 
      components.triggersCovered + 
      components.playbookReadiness + 
      components.recentActivity;
    
    // Get previous score for delta calculation
    const previousScoreData = await db.select()
      .from(preparednessScores)
      .where(and(
        eq(preparednessScores.userId, userId),
        eq(preparednessScores.organizationId, organizationId)
      ))
      .orderBy(desc(preparednessScores.calculatedAt))
      .limit(1);
    
    const previousScore = previousScoreData[0]?.score || 0;
    const scoreDelta = totalScore - previousScore;
    
    // Get user role for benchmarking
    const user = await db.select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    
    const executiveRole = this.extractExecutiveRole(user[0]?.department || 'Executive');
    
    // Get industry benchmark
    const org = await db.select()
      .from(organizations)
      .where(eq(organizations.id, organizationId))
      .limit(1);
    
    const industry = org[0]?.industry || 'general';
    const { industryBenchmark, peerPercentile } = await this.getPeerBenchmark(
      totalScore,
      industry,
      executiveRole
    );
    
    // Get coverage gaps
    const coverageGaps = await this.identifyCoverageGaps(userId, organizationId);
    
    // Get detailed readiness metrics
    const readinessMetrics = {
      scenariosPracticed: components.scenariosPracticed,
      drillsCompleted: components.drillsCompleted,
      triggersCovered: components.triggersCovered,
      playbookReadiness: components.playbookReadiness,
      recentActivity: components.recentActivity,
      coverageGaps: coverageGaps.length,
      lastActivityDate: await this.getLastActivityDate(userId),
    };
    
    // Save score to database
    await db.insert(preparednessScores).values({
      userId,
      organizationId,
      score: Math.round(totalScore),
      previousScore,
      scoreDelta,
      scenariosPracticed: await this.countScenariosCompleted(userId, organizationId),
      drillsCompleted: await this.countDrillsCompleted(userId, organizationId),
      coverageGaps: coverageGaps as any,
      readinessMetrics: readinessMetrics as any,
      industryBenchmark: Math.round(industryBenchmark),
      peerPercentile,
      executiveRole,
      calculatedAt: new Date(),
    });
    
    return Math.round(totalScore);
  }
  
  /**
   * Calculate individual score components
   */
  private async getScoreComponents(userId: string, organizationId: string): Promise<ScoreComponents> {
    const scenariosCount = await this.countScenariosCompleted(userId, organizationId);
    const drillsCount = await this.countDrillsCompleted(userId, organizationId);
    const triggersCount = await this.countTriggersConfigured(userId, organizationId);
    const readyPlaybooks = await this.countReadyPlaybooks(organizationId);
    const recentActivityScore = await this.calculateRecencyScore(userId);
    
    return {
      scenariosPracticed: Math.min(30, scenariosCount * 3), // 3 points per scenario, max 30
      drillsCompleted: Math.min(25, drillsCount * 5), // 5 points per drill, max 25
      triggersCovered: Math.min(20, triggersCount * 4), // 4 points per trigger, max 20
      playbookReadiness: Math.min(15, readyPlaybooks * 2), // 2 points per ready playbook, max 15
      recentActivity: recentActivityScore, // 0-10 points based on recency
    };
  }
  
  /**
   * Count what-if scenarios completed by user
   */
  private async countScenariosCompleted(userId: string, organizationId: string): Promise<number> {
    const result = await db.select({ count: count() })
      .from(whatIfScenarios)
      .where(and(
        eq(whatIfScenarios.createdBy, userId),
        eq(whatIfScenarios.organizationId, organizationId)
      ));
    
    return result[0]?.count || 0;
  }
  
  /**
   * Count playbook drills completed (from activities)
   */
  private async countDrillsCompleted(userId: string, organizationId: string): Promise<number> {
    const result = await db.select({ count: count() })
      .from(preparednessActivities)
      .where(and(
        eq(preparednessActivities.userId, userId),
        eq(preparednessActivities.organizationId, organizationId),
        eq(preparednessActivities.activityType, 'drill_completed')
      ));
    
    return result[0]?.count || 0;
  }
  
  /**
   * Count executive triggers configured
   */
  private async countTriggersConfigured(userId: string, organizationId: string): Promise<number> {
    const result = await db.select({ count: count() })
      .from(executiveTriggers)
      .where(and(
        eq(executiveTriggers.createdBy, userId),
        eq(executiveTriggers.organizationId, organizationId),
        eq(executiveTriggers.isActive, true)
      ));
    
    return result[0]?.count || 0;
  }
  
  /**
   * Count playbooks in ready state (green)
   */
  private async countReadyPlaybooks(organizationId: string): Promise<number> {
    const result = await db.select({ count: count() })
      .from(strategicScenarios)
      .where(and(
        eq(strategicScenarios.organizationId, organizationId),
        eq(strategicScenarios.readinessState, 'green'),
        eq(strategicScenarios.approvalStatus, 'approved')
      ));
    
    return result[0]?.count || 0;
  }
  
  /**
   * Calculate recency score (recent activity = higher score)
   */
  private async calculateRecencyScore(userId: string): Promise<number> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentActivities = await db.select({ count: count() })
      .from(preparednessActivities)
      .where(and(
        eq(preparednessActivities.userId, userId),
        gte(preparednessActivities.completedAt, thirtyDaysAgo)
      ));
    
    const recentCount = recentActivities[0]?.count || 0;
    
    // 10 points if 5+ activities in last 30 days, scaled down from there
    return Math.min(10, recentCount * 2);
  }
  
  /**
   * Get last activity date for user
   */
  private async getLastActivityDate(userId: string): Promise<Date | null> {
    const activity = await db.select()
      .from(preparednessActivities)
      .where(eq(preparednessActivities.userId, userId))
      .orderBy(desc(preparednessActivities.completedAt))
      .limit(1);
    
    return activity[0]?.completedAt || null;
  }
  
  /**
   * Identify coverage gaps - high-risk scenarios not addressed
   */
  private async identifyCoverageGaps(userId: string, organizationId: string): Promise<CoverageGap[]> {
    // Get all high-impact scenarios for the organization
    const highImpactScenarios = await db.select()
      .from(strategicScenarios)
      .where(and(
        eq(strategicScenarios.organizationId, organizationId),
        eq(strategicScenarios.impact, 'high')
      ));
    
    // Check which ones have been practiced or drilled
    const practicedScenarios = await db.select()
      .from(whatIfScenarios)
      .where(and(
        eq(whatIfScenarios.createdBy, userId),
        eq(whatIfScenarios.organizationId, organizationId)
      ));
    
    const gaps: CoverageGap[] = [];
    
    // Identify gaps by category
    const categories = ['security', 'financial', 'operational', 'regulatory'];
    
    for (const category of categories) {
      const categoryScenarios = highImpactScenarios.filter(s => s.type === category);
      const practicedInCategory = practicedScenarios.filter(p => {
        const testConditions = p.testConditions as any;
        return testConditions?.scenarioType === category;
      });
      
      if (categoryScenarios.length > practicedInCategory.length) {
        gaps.push({
          category: category.charAt(0).toUpperCase() + category.slice(1),
          severity: 'high',
          missingPlaybooks: categoryScenarios
            .slice(0, 3)
            .map(s => s.name || s.title),
          recommendation: `Practice ${category} scenarios to improve readiness`
        });
      }
    }
    
    return gaps;
  }
  
  /**
   * Get peer benchmark and percentile ranking
   */
  private async getPeerBenchmark(
    userScore: number,
    industry: string,
    executiveRole: string
  ): Promise<{ industryBenchmark: number; peerPercentile: number }> {
    // Get benchmark data for this industry and role
    const benchmark = await db.select()
      .from(peerBenchmarks)
      .where(and(
        eq(peerBenchmarks.industry, industry),
        eq(peerBenchmarks.executiveRole, executiveRole)
      ))
      .orderBy(desc(peerBenchmarks.calculatedAt))
      .limit(1);
    
    if (!benchmark[0]) {
      // Return defaults if no benchmark exists
      return { industryBenchmark: 68, peerPercentile: 50 };
    }
    
    const avgScore = parseFloat(benchmark[0].averageScore.toString());
    const topQuartile = parseFloat(benchmark[0].topQuartileScore?.toString() || '85');
    const bottomQuartile = parseFloat(benchmark[0].bottomQuartileScore?.toString() || '45');
    
    // Calculate percentile
    let percentile = 50;
    if (userScore >= topQuartile) {
      percentile = 75 + ((userScore - topQuartile) / (100 - topQuartile)) * 25;
    } else if (userScore <= bottomQuartile) {
      percentile = 25 * (userScore / bottomQuartile);
    } else {
      percentile = 25 + ((userScore - bottomQuartile) / (topQuartile - bottomQuartile)) * 50;
    }
    
    return {
      industryBenchmark: Math.round(avgScore),
      peerPercentile: Math.round(Math.min(99, Math.max(1, percentile)))
    };
  }
  
  /**
   * Extract executive role from department/title
   */
  private extractExecutiveRole(department: string): string {
    const dept = department.toLowerCase();
    
    if (dept.includes('ceo') || dept.includes('chief executive')) return 'CEO';
    if (dept.includes('cfo') || dept.includes('finance')) return 'CFO';
    if (dept.includes('coo') || dept.includes('operations')) return 'COO';
    if (dept.includes('cto') || dept.includes('technology')) return 'CTO';
    if (dept.includes('cio') || dept.includes('information')) return 'CIO';
    if (dept.includes('ciso') || dept.includes('security')) return 'CISO';
    if (dept.includes('cdo') || dept.includes('data')) return 'CDO';
    if (dept.includes('chro') || dept.includes('hr') || dept.includes('people')) return 'CHRO';
    
    return 'Executive';
  }
  
  /**
   * Log preparedness activity (called when users complete actions)
   */
  async logActivity(
    userId: string,
    organizationId: string,
    activityType: 'scenario_practice' | 'drill_completed' | 'playbook_approved' | 'trigger_configured',
    activityName: string,
    relatedEntityId?: string,
    relatedEntityType?: string,
    metadata?: any
  ): Promise<void> {
    // Calculate score impact based on activity type
    let scoreImpact = 0;
    switch (activityType) {
      case 'scenario_practice':
        scoreImpact = 3;
        break;
      case 'drill_completed':
        scoreImpact = 5;
        break;
      case 'playbook_approved':
        scoreImpact = 2;
        break;
      case 'trigger_configured':
        scoreImpact = 4;
        break;
    }
    
    await db.insert(preparednessActivities).values({
      userId,
      organizationId,
      activityType,
      activityName,
      relatedEntityId,
      relatedEntityType,
      scoreImpact,
      metadata: metadata as any,
      completedAt: new Date(),
    });
    
    // Recalculate score after activity
    await this.calculatePreparednessScore(userId, organizationId);
  }
  
  /**
   * Get current preparedness score for user
   */
  async getCurrentScore(userId: string, organizationId: string): Promise<any> {
    const scoreData = await db.select()
      .from(preparednessScores)
      .where(and(
        eq(preparednessScores.userId, userId),
        eq(preparednessScores.organizationId, organizationId)
      ))
      .orderBy(desc(preparednessScores.calculatedAt))
      .limit(1);
    
    if (!scoreData[0]) {
      // Calculate initial score if none exists
      await this.calculatePreparednessScore(userId, organizationId);
      return await this.getCurrentScore(userId, organizationId);
    }
    
    return scoreData[0];
  }
  
  /**
   * Get score history for trend analysis
   */
  async getScoreHistory(userId: string, organizationId: string, days: number = 30): Promise<any[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return await db.select()
      .from(preparednessScores)
      .where(and(
        eq(preparednessScores.userId, userId),
        eq(preparednessScores.organizationId, organizationId),
        gte(preparednessScores.calculatedAt, startDate)
      ))
      .orderBy(desc(preparednessScores.calculatedAt));
  }
  
  /**
   * Seed initial peer benchmarks (for demo purposes)
   */
  async seedPeerBenchmarks(): Promise<void> {
    const industries = ['Financial Services', 'Healthcare', 'Manufacturing', 'Technology', 'Retail', 'Energy'];
    const roles = ['CEO', 'CFO', 'COO', 'CTO', 'CISO', 'CHRO'];
    const orgSizes = ['enterprise', 'mid-market'];
    
    for (const industry of industries) {
      for (const role of roles) {
        for (const size of orgSizes) {
          // Generate realistic benchmark data
          const baseScore = 65 + Math.random() * 15; // 65-80 average
          
          await db.insert(peerBenchmarks).values({
            industry,
            executiveRole: role,
            organizationSize: size,
            averageScore: baseScore.toFixed(2),
            medianScore: (baseScore + 2).toFixed(2),
            topQuartileScore: (baseScore + 15).toFixed(2),
            bottomQuartileScore: (baseScore - 20).toFixed(2),
            sampleSize: Math.floor(50 + Math.random() * 150),
            averageScenariosCompleted: (5 + Math.random() * 10).toFixed(2),
            averageDrillsCompleted: (3 + Math.random() * 7).toFixed(2),
            topPerformingActions: [
              { action: 'Regular scenario practice', correlation: 0.85 },
              { action: 'Monthly playbook drills', correlation: 0.78 },
              { action: 'Active trigger monitoring', correlation: 0.72 }
            ] as any,
            benchmarkPeriod: 'Q4-2025',
            calculatedAt: new Date(),
          });
        }
      }
    }
  }
}

export const preparednessScoring = new PreparednessScoring();
