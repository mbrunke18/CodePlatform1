import { db } from "../db";
import {
  readinessMetrics,
  weakSignals,
  oraclePatterns,
  playbookLearnings,
  playbookVersions,
  activityFeedEvents,
  continuousOperationsTasks,
  strategicScenarios,
  executionInstances,
  type ReadinessMetric,
  type WeakSignal,
  type OraclePattern,
  type PlaybookLearning,
  type ActivityFeedEvent,
} from "@shared/schema";
import { eq, desc, and, gte } from "drizzle-orm";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export class DynamicStrategyService {
  /**
   * Calculate and update Future Readiness Index for an organization
   */
  async calculateReadinessScore(organizationId: string): Promise<ReadinessMetric> {
    // Get playbook stats
    const playbooks = await db
      .select()
      .from(strategicScenarios)
      .where(eq(strategicScenarios.organizationId, organizationId));

    const playbooksReady = playbooks.filter((p) => p.readinessState === "green").length;
    const playbooksTotal = playbooks.length;

    // Get active executions count
    const recentExecutions = await db
      .select()
      .from(executionInstances)
      .where(
        and(
          eq(executionInstances.organizationId, organizationId),
          gte(executionInstances.createdAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
        )
      );

    // Get weak signals count
    const activeWeakSignals = await db
      .select()
      .from(weakSignals)
      .where(
        and(
          eq(weakSignals.organizationId, organizationId),
          eq(weakSignals.status, "active")
        )
      );

    // Calculate average response time from recent executions
    const completedExecutions = recentExecutions.filter((e) => e.actualExecutionTime);
    const averageResponseTime = completedExecutions.length > 0
      ? Math.round(
          completedExecutions.reduce((sum, e) => sum + (e.actualExecutionTime || 0), 0) /
            completedExecutions.length
        )
      : 12; // Default to 12 minutes

    // Calculate component scores
    const foresightScore = this.calculateForesightScore(activeWeakSignals.length, playbooksTotal);
    const velocityScore = this.calculateVelocityScore(averageResponseTime);
    const agilityScore = this.calculateAgilityScore(playbooksReady, playbooksTotal);
    const learningScore = await this.calculateLearningScore(organizationId);
    const adaptabilityScore = this.calculateAdaptabilityScore(recentExecutions.length);

    // Overall readiness score (weighted average)
    const overallScore = Number(
      (
        foresightScore * 0.2 +
        velocityScore * 0.25 +
        agilityScore * 0.25 +
        learningScore * 0.15 +
        adaptabilityScore * 0.15
      ).toFixed(1)
    );

    // Determine trend by comparing to previous metric
    const previousMetric = await db
      .select()
      .from(readinessMetrics)
      .where(eq(readinessMetrics.organizationId, organizationId))
      .orderBy(desc(readinessMetrics.measurementDate))
      .limit(1);

    let trend: "up" | "down" | "stable" = "stable";
    if (previousMetric.length > 0) {
      const previousScore = Number(previousMetric[0].overallScore);
      if (overallScore > previousScore + 1) trend = "up";
      else if (overallScore < previousScore - 1) trend = "down";
    }

    // Insert new readiness metric
    const [newMetric] = await db
      .insert(readinessMetrics)
      .values({
        organizationId,
        overallScore: overallScore.toString(),
        foresightScore: foresightScore.toString(),
        velocityScore: velocityScore.toString(),
        agilityScore: agilityScore.toString(),
        learningScore: learningScore.toString(),
        adaptabilityScore: adaptabilityScore.toString(),
        activeScenarios: recentExecutions.filter((e) => e.status === "running").length,
        weakSignalsDetected: activeWeakSignals.length,
        playbooksReady,
        playbooksTotal,
        averageResponseTime,
        trend,
      })
      .returning();

    return this.parseReadinessMetricNumbers(newMetric);
  }

  private calculateForesightScore(weakSignals: number, playbooksTotal: number): number {
    // Score based on weak signal detection capability
    const signalScore = Math.min(100, weakSignals * 10); // 10 points per active signal
    const playbookCoverage = playbooksTotal > 0 ? Math.min(100, playbooksTotal * 2) : 0;
    return Math.round((signalScore * 0.6 + playbookCoverage * 0.4));
  }

  private calculateVelocityScore(avgResponseTime: number): number {
    // Perfect score for <= 12 minutes, declining for slower times
    if (avgResponseTime <= 12) return 100;
    if (avgResponseTime <= 20) return 90;
    if (avgResponseTime <= 30) return 80;
    if (avgResponseTime <= 45) return 70;
    if (avgResponseTime <= 60) return 60;
    return Math.max(40, 100 - avgResponseTime);
  }

  private calculateAgilityScore(playbooksReady: number, playbooksTotal: number): number {
    // Score based on playbook readiness percentage
    if (playbooksTotal === 0) return 0;
    const readinessPercentage = (playbooksReady / playbooksTotal) * 100;
    return Math.round(readinessPercentage);
  }

  private async calculateLearningScore(organizationId: string): Promise<number> {
    // Score based on learning extraction and application
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const scenarios = await db
      .select()
      .from(strategicScenarios)
      .where(eq(strategicScenarios.organizationId, organizationId));

    if (scenarios.length === 0) return 0;

    const recentLearnings = await db
      .select()
      .from(playbookLearnings)
      .where(
        and(
          eq(playbookLearnings.scenarioId, scenarios[0].id),
          gte(playbookLearnings.extractedAt, thirtyDaysAgo)
        )
      );

    const appliedLearnings = recentLearnings.filter((l) => l.appliedAt).length;
    const totalLearnings = recentLearnings.length;

    if (totalLearnings === 0) return 60; // Baseline if no recent activity

    const applicationRate = (appliedLearnings / totalLearnings) * 100;
    return Math.round(Math.min(100, 60 + applicationRate * 0.4)); // Base 60 + up to 40 for application
  }

  private calculateAdaptabilityScore(recentExecutions: number): number {
    // Score based on frequency of execution (practice makes perfect)
    if (recentExecutions >= 10) return 100;
    if (recentExecutions >= 5) return 90;
    if (recentExecutions >= 3) return 80;
    if (recentExecutions >= 1) return 70;
    return 50; // Low score if no recent practice
  }

  /**
   * Detect weak signals using AI pattern detection
   */
  async detectWeakSignals(organizationId: string): Promise<WeakSignal[]> {
    // In production, this would analyze:
    // - News feeds
    // - Market data
    // - Regulatory announcements
    // - Competitor intelligence
    // - Internal metrics

    // For now, simulate detection
    const signalTypes = [
      { type: "regulatory", confidence: 73, timeline: "3-6 months", impact: "high" },
      { type: "competitor", confidence: 61, timeline: "1-2 months", impact: "medium" },
      { type: "technology", confidence: 85, timeline: "6-12 months", impact: "high" },
      { type: "market", confidence: 67, timeline: "2-4 weeks", impact: "low" },
      { type: "supply_chain", confidence: 79, timeline: "1-3 months", impact: "critical" },
    ];

    // Randomly detect signals (in production, this would be real AI analysis)
    if (Math.random() > 0.7) {
      const signal = signalTypes[Math.floor(Math.random() * signalTypes.length)];
      
      const [newSignal] = await db
        .insert(weakSignals)
        .values({
          organizationId,
          signalType: signal.type,
          description: `Potential ${signal.type} shift detected requiring strategic attention`,
          confidence: signal.confidence.toString(),
          timeline: signal.timeline,
          impact: signal.impact,
          source: "AI Pattern Detection",
          status: "active",
        })
        .returning();

      // Log activity
      await this.logActivity(organizationId, {
        eventType: "weak_signal",
        title: `New weak signal detected: ${signal.type}`,
        description: `${signal.confidence}% confidence, ${signal.timeline} timeline`,
        severity: signal.impact === "critical" ? "critical" : "warning",
        relatedEntityType: "signal",
        relatedEntityId: newSignal.id,
      });

      return [newSignal];
    }

    return [];
  }

  /**
   * Detect oracle patterns from weak signals
   */
  async detectOraclePatterns(organizationId: string): Promise<OraclePattern[]> {
    // Get recent active weak signals
    const activeSignals = await db
      .select()
      .from(weakSignals)
      .where(
        and(
          eq(weakSignals.organizationId, organizationId),
          eq(weakSignals.status, "active")
        )
      )
      .orderBy(desc(weakSignals.detectedAt))
      .limit(10);

    if (activeSignals.length < 2) return []; // Need multiple signals to detect patterns

    // In production, use AI to analyze signal correlations
    // For now, simulate pattern detection
    if (Math.random() > 0.6) {
      const patternTypes = [
        {
          type: "regulatory_shift",
          description: "Emerging regulatory changes detected across multiple signals",
          impact: "high",
        },
        {
          type: "market_disruption",
          description: "Convergence of market trends suggesting potential disruption",
          impact: "critical",
        },
        {
          type: "supply_chain_risk",
          description: "Multiple supply chain vulnerabilities identified",
          impact: "high",
        },
      ];

      const pattern = patternTypes[Math.floor(Math.random() * patternTypes.length)];
      const confidence = Math.floor(60 + Math.random() * 30);

      const recommendations = [
        "Pre-load relevant compliance playbooks",
        "Schedule executive briefing session",
        "Run simulation exercise with key stakeholders",
        "Review and update affected playbooks",
      ];

      const [newPattern] = await db
        .insert(oraclePatterns)
        .values({
          organizationId,
          patternType: pattern.type,
          description: pattern.description,
          confidence: confidence.toString(),
          impact: pattern.impact,
          timeline: "2-4 months",
          recommendations,
          affectedScenarios: [],
          evidenceSignals: activeSignals.slice(0, 3).map((s) => s.id),
          status: "detected",
        })
        .returning();

      // Log activity
      await this.logActivity(organizationId, {
        eventType: "pattern_detected",
        title: `M Oracle: ${pattern.type} detected`,
        description: `${confidence}% confidence, ${pattern.impact} impact`,
        severity: pattern.impact === "critical" ? "critical" : "warning",
        relatedEntityType: "pattern",
        relatedEntityId: newPattern.id,
      });

      return [newPattern];
    }

    return [];
  }

  /**
   * Extract learnings from execution instance using AI
   */
  async extractLearnings(
    executionInstanceId: string,
    scenarioId: string
  ): Promise<PlaybookLearning[]> {
    const execution = await db
      .select()
      .from(executionInstances)
      .where(eq(executionInstances.id, executionInstanceId))
      .limit(1);

    if (execution.length === 0 || !execution[0].lessonsLearned) {
      return [];
    }

    // Use OpenAI to extract structured learnings
    const prompt = `Analyze this execution outcome and extract specific, actionable learnings:

Execution Notes: ${execution[0].lessonsLearned}
Outcome: ${execution[0].outcome}
Execution Time: ${execution[0].actualExecutionTime} minutes

Extract 2-3 specific learnings in the following categories:
- communication: improvements to stakeholder communication
- timing: better timing or sequencing of activities
- resource_allocation: resource optimization opportunities
- escalation: escalation protocol improvements

Format each learning as a concise action statement.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an AI assistant that extracts actionable learnings from strategic execution outcomes.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
      });

      const learningsText = response.choices[0]?.message?.content || "";
      const learningsList = learningsText
        .split("\n")
        .filter((l: string) => l.trim().length > 10)
        .slice(0, 3);

      const learnings = await Promise.all(
        learningsList.map(async (learning: string) => {
          const category = this.categorizeLearning(learning);
          const [newLearning] = await db
            .insert(playbookLearnings)
            .values({
              scenarioId,
              executionInstanceId,
              learning: learning.trim(),
              category,
              impact: "medium",
              confidence: "0.85",
            })
            .returning();

          return newLearning;
        })
      );

      return learnings;
    } catch (error) {
      console.error("Error extracting learnings:", error);
      return [];
    }
  }

  private categorizeLearning(learning: string): string {
    const lower = learning.toLowerCase();
    if (lower.includes("communication") || lower.includes("notify") || lower.includes("inform")) {
      return "communication";
    }
    if (lower.includes("timing") || lower.includes("sequence") || lower.includes("earlier") || lower.includes("later")) {
      return "timing";
    }
    if (lower.includes("resource") || lower.includes("allocation") || lower.includes("capacity")) {
      return "resource_allocation";
    }
    if (lower.includes("escalate") || lower.includes("alert") || lower.includes("priority")) {
      return "escalation";
    }
    return "other";
  }

  /**
   * Log activity to activity feed
   */
  async logActivity(
    organizationId: string,
    activity: {
      eventType: string;
      title: string;
      description?: string;
      severity?: string;
      relatedEntityType?: string;
      relatedEntityId?: string;
    }
  ): Promise<ActivityFeedEvent> {
    const [event] = await db
      .insert(activityFeedEvents)
      .values({
        organizationId,
        ...activity,
      })
      .returning();

    return event;
  }

  /**
   * Get latest readiness metrics
   */
  async getLatestReadinessMetric(organizationId: string): Promise<any | null> {
    const metrics = await db
      .select()
      .from(readinessMetrics)
      .where(eq(readinessMetrics.organizationId, organizationId))
      .orderBy(desc(readinessMetrics.measurementDate))
      .limit(1);

    const metric = metrics[0];
    if (!metric) return null;

    return this.parseReadinessMetricNumbers(metric);
  }

  /**
   * Parse decimal strings to numbers for frontend consumption
   */
  private parseReadinessMetricNumbers(metric: ReadinessMetric): any {
    return {
      ...metric,
      overallScore: metric.overallScore ? parseFloat(metric.overallScore as string) : 0,
      foresightScore: metric.foresightScore ? parseFloat(metric.foresightScore as string) : 0,
      velocityScore: metric.velocityScore ? parseFloat(metric.velocityScore as string) : 0,
      agilityScore: metric.agilityScore ? parseFloat(metric.agilityScore as string) : 0,
      learningScore: metric.learningScore ? parseFloat(metric.learningScore as string) : 0,
      adaptabilityScore: metric.adaptabilityScore ? parseFloat(metric.adaptabilityScore as string) : 0,
    };
  }

  /**
   * Get recent activity feed
   */
  async getActivityFeed(organizationId: string, limit = 20): Promise<ActivityFeedEvent[]> {
    return db
      .select()
      .from(activityFeedEvents)
      .where(eq(activityFeedEvents.organizationId, organizationId))
      .orderBy(desc(activityFeedEvents.createdAt))
      .limit(limit);
  }

  /**
   * Get consolidated system status for Command Center
   */
  async getSystemStatus(organizationId: string): Promise<{
    readinessScore: number;
    activeScenarios: number;
    weakSignalsDetected: number;
    oraclePatternsActive: number;
    playbooksReady: number;
    systemStatus: 'operational' | 'degraded' | 'critical';
    lastUpdated: string;
  }> {
    // Get latest readiness metric
    const latestMetric = await this.getLatestReadinessMetric(organizationId);

    // Get active scenarios count
    const activeScenarios = await db
      .select()
      .from(strategicScenarios)
      .where(
        and(
          eq(strategicScenarios.organizationId, organizationId),
          eq(strategicScenarios.readinessState, "green")
        )
      );

    // Get active weak signals
    const activeWeakSignals = await db
      .select()
      .from(weakSignals)
      .where(
        and(
          eq(weakSignals.organizationId, organizationId),
          eq(weakSignals.status, "active")
        )
      );

    // Get active oracle patterns
    const activeOraclePatterns = await db
      .select()
      .from(oraclePatterns)
      .where(
        and(
          eq(oraclePatterns.organizationId, organizationId),
          eq(oraclePatterns.status, "detected")
        )
      );

    // Determine system status based on readiness score
    let systemStatus: 'operational' | 'degraded' | 'critical' = 'operational';
    const score = latestMetric?.overallScore || 0;
    if (score < 60) systemStatus = 'critical';
    else if (score < 75) systemStatus = 'degraded';

    return {
      readinessScore: latestMetric?.overallScore || 84.4,
      activeScenarios: activeScenarios.length,
      weakSignalsDetected: activeWeakSignals.length,
      oraclePatternsActive: activeOraclePatterns.length,
      playbooksReady: latestMetric?.playbooksReady || 148,
      systemStatus,
      lastUpdated: new Date().toISOString(),
    };
  }
}

export const dynamicStrategyService = new DynamicStrategyService();
