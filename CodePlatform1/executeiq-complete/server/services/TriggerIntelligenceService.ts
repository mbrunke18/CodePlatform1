import OpenAI from 'openai';
import { db } from '../db';
import { executiveTriggers, strategicAlerts, triggerMonitoringHistory } from '@shared/schema';
import { eq, and, gte, desc } from 'drizzle-orm';

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY!,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

interface EventAnalysis {
  classification: 'opportunity' | 'risk' | 'competitive_threat' | 'market_shift' | 'regulatory_change';
  confidence: number;
  affectedAreas: string[];
  urgency: 'low' | 'medium' | 'high' | 'critical';
  summary: string;
  keyInsights: string[];
  recommendations: string[];
}

export class TriggerIntelligenceService {
  /**
   * Analyze a business event using AI
   */
  async analyzeEvent(event: {
    source: string;
    title: string;
    content: string;
    timestamp: Date;
  }): Promise<EventAnalysis> {
    try {
      const prompt = `Analyze this business event and provide strategic intelligence:

Event: ${event.title}
Content: ${event.content}
Source: ${event.source}
Timestamp: ${event.timestamp.toISOString()}

Provide analysis in JSON format with:
1. classification: one of [opportunity, risk, competitive_threat, market_shift, regulatory_change]
2. confidence: number 0-100 (how confident you are in this assessment)
3. affectedAreas: array of business areas impacted (e.g., ["sales", "operations", "compliance"])
4. urgency: one of [low, medium, high, critical]
5. summary: 2-3 sentence executive summary
6. keyInsights: array of 2-4 key insights
7. recommendations: array of 2-3 specific actionable recommendations

Be specific and strategic. Focus on business impact.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { 
            role: 'system', 
            content: 'You are a strategic business intelligence analyst providing C-suite level insights.' 
          },
          { role: 'user', content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3, // Lower temperature for more consistent analysis
      });

      const analysis = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        classification: analysis.classification || 'market_shift',
        confidence: Math.min(100, Math.max(0, analysis.confidence || 50)),
        affectedAreas: analysis.affectedAreas || [],
        urgency: analysis.urgency || 'medium',
        summary: analysis.summary || 'Event analysis pending',
        keyInsights: analysis.keyInsights || [],
        recommendations: analysis.recommendations || []
      };
    } catch (error) {
      console.error('Error analyzing event with AI:', error);
      
      // Fallback to basic keyword analysis if AI fails
      return this.fallbackAnalysis(event);
    }
  }

  /**
   * Match analyzed event against active triggers
   */
  async matchTriggers(
    organizationId: string,
    analysis: EventAnalysis,
    eventMetadata: any
  ): Promise<Array<{ triggerId: string; confidence: number; analysis: EventAnalysis }>> {
    try {
      // Get active triggers for organization
      const triggers = await db.select()
        .from(executiveTriggers)
        .where(and(
          eq(executiveTriggers.organizationId, organizationId),
          eq(executiveTriggers.isActive, true)
        ));

      const matches: Array<{ triggerId: string; confidence: number; analysis: EventAnalysis }> = [];

      for (const trigger of triggers) {
        const conditions = trigger.conditions as any || {};
        let matchScore = 0;

        // 1. Alert type matching (40 points)
        if (conditions.alertType && conditions.alertType === analysis.classification) {
          matchScore += 40;
        }

        // 2. Keyword matching (30 points)
        if (conditions.keywords && Array.isArray(conditions.keywords)) {
          const keywordMatches = conditions.keywords.filter((keyword: string) =>
            analysis.summary.toLowerCase().includes(keyword.toLowerCase()) ||
            analysis.keyInsights.some(insight => 
              insight.toLowerCase().includes(keyword.toLowerCase())
            )
          );
          matchScore += Math.min(30, keywordMatches.length * 10);
        }

        // 3. Urgency threshold (20 points)
        const urgencyLevels: Record<string, number> = { low: 1, medium: 2, high: 3, critical: 4 };
        const triggerUrgency = conditions.minimumUrgency || 'medium';
        if (urgencyLevels[analysis.urgency] >= urgencyLevels[triggerUrgency as keyof typeof urgencyLevels]) {
          matchScore += 20;
        }

        // 4. Affected areas matching (10 points)
        if (conditions.affectedAreas && Array.isArray(conditions.affectedAreas)) {
          const areaMatches = analysis.affectedAreas.filter(area =>
            conditions.affectedAreas.includes(area)
          );
          matchScore += Math.min(10, areaMatches.length * 5);
        }

        // Calculate final confidence (combine AI confidence with match score)
        const combinedConfidence = Math.round((analysis.confidence * 0.6) + (matchScore * 0.4));

        // Threshold for triggering (60% combined confidence)
        if (combinedConfidence >= 60) {
          matches.push({
            triggerId: trigger.id,
            confidence: Math.min(100, combinedConfidence),
            analysis
          });

          // Log trigger match in monitoring history
          await db.insert(triggerMonitoringHistory).values({
            trigger_id: trigger.id,
            organization_id: organizationId,
            check_timestamp: new Date(),
            conditions_met: matchScore >= 60,
            ai_confidence: combinedConfidence,
            event_data: eventMetadata,
            alert_generated: true
          });
        }
      }

      return matches;
    } catch (error) {
      console.error('Error matching triggers:', error);
      return [];
    }
  }

  /**
   * Create strategic alert from trigger match
   */
  async createAlert(
    organizationId: string,
    match: { triggerId: string; confidence: number; analysis: EventAnalysis },
    sourceData: any
  ) {
    try {
      const [alert] = await db.insert(strategicAlerts).values({
        organization_id: organizationId,
        trigger_id: match.triggerId,
        alert_type: match.analysis.classification,
        title: match.analysis.summary,
        description: match.analysis.keyInsights.join('\n\n'),
        severity: match.analysis.urgency,
        ai_confidence: match.confidence,
        source_type: 'ai_intelligence',
        source_data: {
          ...sourceData,
          analysis: match.analysis
        },
        status: 'new',
        action_required: match.analysis.urgency === 'critical' || match.analysis.urgency === 'high',
        recommended_actions: match.analysis.recommendations,
        impact_areas: match.analysis.affectedAreas
      }).returning();

      return alert;
    } catch (error) {
      console.error('Error creating alert:', error);
      return null;
    }
  }

  /**
   * Get real-time intelligence metrics
   */
  async getIntelligenceMetrics(organizationId: string, timeWindowHours: number = 24) {
    const cutoffTime = new Date(Date.now() - timeWindowHours * 60 * 60 * 1000);

    const alerts = await db.select()
      .from(strategicAlerts)
      .where(and(
        eq(strategicAlerts.organization_id, organizationId),
        gte(strategicAlerts.created_at, cutoffTime)
      ))
      .orderBy(desc(strategicAlerts.created_at));

    const avgConfidence = alerts.length > 0
      ? Math.round(alerts.reduce((sum, a) => sum + (a.ai_confidence || 0), 0) / alerts.length)
      : 0;

    const byType = alerts.reduce((acc, alert) => {
      acc[alert.alert_type] = (acc[alert.alert_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byUrgency = alerts.reduce((acc, alert) => {
      acc[alert.severity || 'medium'] = (acc[alert.severity || 'medium'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalAlerts: alerts.length,
      averageConfidence: avgConfidence,
      highUrgencyCount: byUrgency['high'] || 0,
      criticalCount: byUrgency['critical'] || 0,
      byType,
      byUrgency,
      recentAlerts: alerts.slice(0, 10),
      timeWindow: `${timeWindowHours}h`
    };
  }

  /**
   * Fallback analysis when AI is unavailable
   */
  private fallbackAnalysis(event: {
    title: string;
    content: string;
    source: string;
  }): EventAnalysis {
    const text = `${event.title} ${event.content}`.toLowerCase();
    
    // Simple keyword-based classification
    let classification: EventAnalysis['classification'] = 'market_shift';
    let urgency: EventAnalysis['urgency'] = 'medium';
    let confidence = 40;

    if (text.includes('competitor') || text.includes('competition')) {
      classification = 'competitive_threat';
      urgency = 'high';
      confidence = 60;
    } else if (text.includes('regulation') || text.includes('compliance') || text.includes('legal')) {
      classification = 'regulatory_change';
      urgency = 'high';
      confidence = 65;
    } else if (text.includes('opportunity') || text.includes('growth') || text.includes('expansion')) {
      classification = 'opportunity';
      urgency = 'medium';
      confidence = 55;
    } else if (text.includes('risk') || text.includes('threat') || text.includes('crisis')) {
      classification = 'risk';
      urgency = 'high';
      confidence = 70;
    }

    return {
      classification,
      confidence,
      affectedAreas: ['operations'],
      urgency,
      summary: `${event.title.substring(0, 150)}...`,
      keyInsights: [event.content.substring(0, 200)],
      recommendations: ['Monitor situation closely', 'Review strategic response options']
    };
  }
}

export const triggerIntelligence = new TriggerIntelligenceService();
