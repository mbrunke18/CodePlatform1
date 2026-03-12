import OpenAI from 'openai';
import { db } from '../db';
import { 
  executiveBriefings,
  strategicAlerts,
  strategicScenarios,
  kpis,
  warRoomSessions
} from '@shared/schema';
import { eq, and, gte, desc } from 'drizzle-orm';
import { preparednessEngine } from './PreparednessEngine';
import { triggerIntelligence } from './TriggerIntelligenceService';

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY!,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

interface BriefingData {
  alerts: any[];
  scenarios: any[];
  metrics: any[];
  preparedness: any;
  recentActivations: any[];
}

export class ExecutiveBriefingService {
  /**
   * Generate daily executive briefing from real data
   */
  async generateDailyBriefing(organizationId: string): Promise<any> {
    try {
      // Gather all real data sources
      const briefingData = await this.gatherBriefingData(organizationId);

      // Use AI to synthesize intelligent briefing
      const content = await this.synthesizeBriefing(briefingData);

      // Store briefing in database
      const [briefing] = await db.insert(executiveBriefings).values({
        organizationId,
        title: `Executive Intelligence Briefing - ${new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}`,
        content,
        briefingType: 'daily',
        generatedBy: 'ai',
        dataSourcesUsed: {
          alertCount: briefingData.alerts.length,
          scenarioCount: briefingData.scenarios.length,
          metricsTracked: briefingData.metrics.length,
          preparednessScore: briefingData.preparedness.overall,
          recentActivations: briefingData.recentActivations.length
        },
        priority: this.determinePriority(briefingData),
        insights: this.extractKeyInsights(briefingData),
        recommendations: this.extractRecommendations(briefingData)
      }).returning();

      return briefing;
    } catch (error) {
      console.error('Error generating executive briefing:', error);
      throw error;
    }
  }

  /**
   * Generate strategic situation report
   */
  async generateSituationReport(
    organizationId: string,
    focus: 'all' | 'opportunities' | 'risks' | 'competitive'
  ): Promise<any> {
    try {
      const briefingData = await this.gatherBriefingData(organizationId, 72); // 72-hour window

      // Filter data based on focus
      const filteredAlerts = focus === 'all' 
        ? briefingData.alerts 
        : briefingData.alerts.filter(a => {
            if (focus === 'opportunities') return a.alertType === 'opportunity';
            if (focus === 'risks') return a.alertType === 'risk';
            if (focus === 'competitive') return a.alertType === 'competitive_threat';
            return true;
          });

      const prompt = `Generate a strategic situation report focused on ${focus}:

RECENT INTELLIGENCE (72 hours):
- ${filteredAlerts.length} alerts detected
- Alert types: ${this.summarizeAlertTypes(filteredAlerts)}
- Preparedness score: ${briefingData.preparedness.overall}/100

KEY ALERTS:
${filteredAlerts.slice(0, 5).map(a => 
  `- ${a.title} (${a.severity} priority, ${a.confidence}% confidence)`
).join('\n')}

ORGANIZATIONAL CONTEXT:
- Active scenarios: ${briefingData.scenarios.length}
- Recent activations: ${briefingData.recentActivations.length}
- Top performing metrics: ${briefingData.metrics.slice(0, 3).map(m => m.name).join(', ')}

Generate a comprehensive situation report with:
1. EXECUTIVE SUMMARY (3-4 sentences)
2. STRATEGIC IMPLICATIONS (key business impacts)
3. THREAT ASSESSMENT (current and emerging risks)
4. OPPORTUNITY LANDSCAPE (actionable opportunities)
5. RECOMMENDED ACTIONS (specific, prioritized)
6. DECISION POINTS (requires executive attention)

Tone: Strategic, data-driven, actionable. Focus on what matters most.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { 
            role: 'system', 
            content: 'You are a strategic intelligence analyst providing executive-level situation reports to Fortune 1000 leadership.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.4,
      });

      const content = response.choices[0].message.content || '';

      // Store situation report
      const [report] = await db.insert(executiveBriefings).values({
        organizationId,
        title: `Strategic Situation Report - ${focus.toUpperCase()}`,
        content,
        briefingType: 'situation_report',
        generatedBy: 'ai',
        dataSourcesUsed: {
          focus,
          alertsAnalyzed: filteredAlerts.length,
          timeWindow: '72h'
        },
        priority: filteredAlerts.some(a => a.severity === 'critical') ? 'high' : 'medium',
        insights: this.extractKeyInsights({ ...briefingData, alerts: filteredAlerts }),
        recommendations: []
      }).returning();

      return report;
    } catch (error) {
      console.error('Error generating situation report:', error);
      throw error;
    }
  }

  /**
   * Gather all data for briefing
   */
  private async gatherBriefingData(
    organizationId: string, 
    hoursBack: number = 24
  ): Promise<BriefingData> {
    const cutoffTime = new Date(Date.now() - hoursBack * 60 * 60 * 1000);

    const [alerts, scenarios, metrics, preparedness, recentActivations] = await Promise.all([
      // Recent alerts
      db.select().from(strategicAlerts)
        .where(and(
          eq(strategicAlerts.organizationId, organizationId),
          gte(strategicAlerts.createdAt, cutoffTime)
        ))
        .orderBy(desc(strategicAlerts.createdAt)),

      // Active scenarios
      db.select().from(strategicScenarios)
        .where(eq(strategicScenarios.organizationId, organizationId))
        .limit(20),

      // Key metrics
      db.select().from(kpis)
        .where(and(
          eq(kpis.organizationId, organizationId),
          eq(kpis.isActive, true)
        ))
        .limit(10),

      // Preparedness score
      preparednessEngine.calculateScore(organizationId),

      // Recent war room sessions (playbook activations)
      db.select().from(warRoomSessions)
        .where(and(
          eq(warRoomSessions.organizationId, organizationId),
          gte(warRoomSessions.createdAt, cutoffTime)
        ))
        .orderBy(desc(warRoomSessions.createdAt))
        .limit(5)
    ]);

    return {
      alerts,
      scenarios,
      metrics,
      preparedness,
      recentActivations
    };
  }

  /**
   * Synthesize briefing using AI
   */
  private async synthesizeBriefing(data: BriefingData): Promise<string> {
    const prompt = `Generate an executive intelligence briefing based on this data:

INTELLIGENCE SUMMARY (Last 24 Hours):
- Total alerts: ${data.alerts.length}
- Critical alerts: ${data.alerts.filter(a => a.severity === 'critical').length}
- High urgency: ${data.alerts.filter(a => a.severity === 'high').length}

TOP ALERTS:
${data.alerts.slice(0, 5).map((a, i) => 
  `${i + 1}. ${a.title} (${a.alertType}, ${a.confidence}% confidence)`
).join('\n')}

ORGANIZATIONAL READINESS:
- Preparedness Score: ${data.preparedness.overall}/100
- Template Coverage: ${data.preparedness.components.templateCoverage}%
- Execution Success: ${data.preparedness.components.executionSuccess}%

RECENT ACTIVITY:
- Active scenarios: ${data.scenarios.length}
- Playbooks activated: ${data.recentActivations.length}
- Success rate: ${data.recentActivations.filter(a => a.status === 'completed').length}/${data.recentActivations.length}

KEY PERFORMANCE INDICATORS:
${data.metrics.slice(0, 5).map(m => 
  `- ${m.name}: ${m.currentValue}/${m.target} (${m.unit})`
).join('\n')}

Generate a concise executive briefing with these sections:

## Executive Summary
[2-3 sentences on overall strategic situation]

## Strategic Intelligence Highlights
[Top 3-4 key insights from alerts and patterns]

## Operational Status
[Current preparedness and execution readiness]

## Priority Actions Required
[3-4 specific, actionable recommendations with urgency indicators]

## Risk Landscape
[Emerging risks and mitigation status]

## Opportunity Assessment
[Strategic opportunities identified]

Keep it concise, strategic, and actionable. Use bullet points where appropriate.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { 
          role: 'system', 
          content: 'You are an executive intelligence officer providing C-suite briefings for Fortune 1000 companies. Be concise, strategic, and data-driven.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
    });

    return response.choices[0].message.content || 'Briefing generation failed';
  }

  /**
   * Determine briefing priority
   */
  private determinePriority(data: BriefingData): 'low' | 'medium' | 'high' | 'critical' {
    const criticalAlerts = data.alerts.filter(a => a.severity === 'critical').length;
    const highAlerts = data.alerts.filter(a => a.severity === 'high').length;

    if (criticalAlerts > 0) return 'critical';
    if (highAlerts >= 3) return 'high';
    if (data.alerts.length > 5) return 'medium';
    return 'low';
  }

  /**
   * Extract key insights
   */
  private extractKeyInsights(data: BriefingData): string[] {
    const insights: string[] = [];

    // Alert patterns
    if (data.alerts.length > 0) {
      const avgConfidence = data.alerts.reduce((sum, a) => sum + (a.confidence || 0), 0) / data.alerts.length;
      insights.push(`${data.alerts.length} intelligence signals detected with ${Math.round(avgConfidence)}% average confidence`);
    }

    // Preparedness insights
    if (data.preparedness.overall >= 80) {
      insights.push(`Excellent preparedness score (${data.preparedness.overall}/100) - organization ready for execution`);
    } else if (data.preparedness.overall < 60) {
      insights.push(`Preparedness needs attention (${data.preparedness.overall}/100) - gaps identified in ${data.preparedness.readinessState} areas`);
    }

    // Activation insights
    if (data.recentActivations.length > 0) {
      const successRate = (data.recentActivations.filter(a => a.status === 'completed').length / data.recentActivations.length) * 100;
      insights.push(`${data.recentActivations.length} playbooks activated with ${Math.round(successRate)}% success rate`);
    }

    return insights;
  }

  /**
   * Extract recommendations
   */
  private extractRecommendations(data: BriefingData): string[] {
    const recommendations: string[] = [];

    // Based on critical alerts
    const criticalAlerts = data.alerts.filter(a => a.severity === 'critical');
    if (criticalAlerts.length > 0) {
      recommendations.push(`Immediate action required: ${criticalAlerts.length} critical alerts need executive attention`);
    }

    // Based on preparedness gaps
    if (data.preparedness.components.drillRecency < 60) {
      recommendations.push('Schedule drill exercises - last practice was too long ago');
    }

    if (data.preparedness.components.templateCoverage < 70) {
      recommendations.push(`Complete playbook coverage - ${data.preparedness.breakdown.scenariosTotal - data.preparedness.breakdown.scenariosWithPlaybooks} scenarios missing response strategies`);
    }

    return recommendations;
  }

  /**
   * Summarize alert types
   */
  private summarizeAlertTypes(alerts: any[]): string {
    const types: Record<string, number> = {};
    alerts.forEach(a => {
      types[a.alertType] = (types[a.alertType] || 0) + 1;
    });
    return Object.entries(types)
      .map(([type, count]) => `${count} ${type}`)
      .join(', ');
  }
}

export const executiveBriefing = new ExecutiveBriefingService();
