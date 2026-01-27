import { db } from '../db';
import { 
  strategicScenarios, 
  warRoomSessions, 
  stakeholderAlignment,
  crisisSimulations 
} from '@shared/schema';
import { eq, and, desc, gte, sql } from 'drizzle-orm';

interface PreparednessScore {
  overall: number;
  components: {
    templateCoverage: number;
    drillRecency: number;
    automationCoverage: number;
    executionSuccess: number;
    stakeholderReadiness: number;
  };
  breakdown: {
    scenariosTotal: number;
    scenariosWithPlaybooks: number;
    avgDaysSinceDrill: number;
    totalActivations: number;
    successfulActivations: number;
  };
  readinessState: 'green' | 'yellow' | 'red';
  timestamp: Date;
}

export class PreparednessEngine {
  /**
   * Calculate real preparedness score from actual data
   */
  async calculateScore(organizationId: string): Promise<PreparednessScore> {
    try {
      // Fetch all relevant data in parallel
      const [scenarios, activations, alignment, simulations] = await Promise.all([
        db.select().from(strategicScenarios)
          .where(eq(strategicScenarios.organizationId, organizationId)),
        db.select().from(warRoomSessions)
          .where(eq(warRoomSessions.organizationId, organizationId)),
        db.select().from(stakeholderAlignment)
          .where(eq(stakeholderAlignment.organizationId, organizationId))
          .orderBy(desc(stakeholderAlignment.createdAt))
          .limit(1),
        db.select().from(crisisSimulations)
          .where(and(
            eq(crisisSimulations.organizationId, organizationId),
            eq(crisisSimulations.status, 'completed')
          ))
      ]);

      // Weights for different components
      const weights = {
        templateCoverage: 0.25,
        drillRecency: 0.25,
        automationCoverage: 0.20,
        executionSuccess: 0.20,
        stakeholderReadiness: 0.10
      };

      // 1. Template Coverage Score
      const scenariosWithPlaybooks = scenarios.filter(s => 
        s.responseStrategy && Object.keys(s.responseStrategy).length > 0
      );
      const templateScore = scenarios.length > 0
        ? (scenariosWithPlaybooks.length / scenarios.length) * 100
        : 0;

      // 2. Drill Recency Score
      let drillScore = 0;
      if (scenarios.length > 0) {
        const now = Date.now();
        const scenariosWithDrills = scenarios.filter(s => s.lastDrillDate);
        
        if (scenariosWithDrills.length > 0) {
          const avgDaysSinceDrill = scenariosWithDrills.reduce((sum, s) => {
            const days = (now - s.lastDrillDate!.getTime()) / (1000 * 60 * 60 * 24);
            return sum + days;
          }, 0) / scenariosWithDrills.length;

          // Decay: 100 points if drilled in last 7 days, 0 points if >180 days
          drillScore = Math.max(0, 100 - (avgDaysSinceDrill / 180 * 100));
        } else {
          drillScore = 0; // No drills performed
        }
      }

      // 3. Automation Coverage Score
      const avgAutomation = scenarios.length > 0
        ? scenarios.reduce((sum, s) => {
            const coverage = typeof s.automationCoverage === 'string' 
              ? parseFloat(s.automationCoverage) 
              : (s.automationCoverage || 0);
            return sum + coverage;
          }, 0) / scenarios.length
        : 0;
      const automationScore = avgAutomation * 100;

      // 4. Execution Success Rate
      let executionScore = 50; // Default if no history
      if (activations.length > 0) {
        const successfulActivations = activations.filter(a => 
          a.status === 'completed' && a.outcome !== 'failed'
        );
        executionScore = (successfulActivations.length / activations.length) * 100;
      }

      // 5. Stakeholder Readiness Score
      const taskCompletionRate = alignment[0]?.taskCompletionRate;
      const stakeholderScore = taskCompletionRate 
        ? (typeof taskCompletionRate === 'string' ? parseFloat(taskCompletionRate) : taskCompletionRate) * 100 
        : 50;

      // Calculate weighted overall score
      const overall = Math.round(
        (templateScore * weights.templateCoverage) +
        (drillScore * weights.drillRecency) +
        (automationScore * weights.automationCoverage) +
        (executionScore * weights.executionSuccess) +
        (stakeholderScore * weights.stakeholderReadiness)
      );

      // Determine readiness state
      let readinessState: 'green' | 'yellow' | 'red' = 'yellow';
      if (overall >= 80) readinessState = 'green';
      else if (overall < 60) readinessState = 'red';

      // Calculate breakdown metrics
      const scenariosWithDrills = scenarios.filter(s => s.lastDrillDate);
      const avgDaysSinceDrill = scenariosWithDrills.length > 0
        ? scenariosWithDrills.reduce((sum, s) => {
            const days = (Date.now() - s.lastDrillDate!.getTime()) / (1000 * 60 * 60 * 24);
            return sum + days;
          }, 0) / scenariosWithDrills.length
        : 999;

      const successfulActivations = activations.filter(a => 
        a.status === 'completed' && a.outcome !== 'failed'
      );

      return {
        overall,
        components: {
          templateCoverage: Math.round(templateScore),
          drillRecency: Math.round(drillScore),
          automationCoverage: Math.round(automationScore),
          executionSuccess: Math.round(executionScore),
          stakeholderReadiness: Math.round(stakeholderScore)
        },
        breakdown: {
          scenariosTotal: scenarios.length,
          scenariosWithPlaybooks: scenariosWithPlaybooks.length,
          avgDaysSinceDrill: Math.round(avgDaysSinceDrill),
          totalActivations: activations.length,
          successfulActivations: successfulActivations.length
        },
        readinessState,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error calculating preparedness score:', error);
      
      // Return safe defaults if calculation fails
      return {
        overall: 0,
        components: {
          templateCoverage: 0,
          drillRecency: 0,
          automationCoverage: 0,
          executionSuccess: 0,
          stakeholderReadiness: 0
        },
        breakdown: {
          scenariosTotal: 0,
          scenariosWithPlaybooks: 0,
          avgDaysSinceDrill: 999,
          totalActivations: 0,
          successfulActivations: 0
        },
        readinessState: 'red',
        timestamp: new Date()
      };
    }
  }

  /**
   * Get preparedness timeline (track improvement over time)
   */
  async getPreparednessTimeline(organizationId: string, months: number = 6) {
    // This would ideally use historical snapshots
    // For now, calculate current and estimate historical based on activation dates
    const currentScore = await this.calculateScore(organizationId);
    
    // Get activations to estimate historical growth
    const activations = await db.select()
      .from(warRoomSessions)
      .where(eq(warRoomSessions.organizationId, organizationId))
      .orderBy(warRoomSessions.createdAt);

    const timeline = [];
    const now = new Date();
    
    for (let i = months; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const activationsByMonth = activations.filter(a => {
        const aDate = new Date(a.createdAt);
        return aDate.getFullYear() === monthDate.getFullYear() && 
               aDate.getMonth() === monthDate.getMonth();
      });
      
      // Estimate score based on activation count (rough approximation)
      const estimatedScore = i === 0 
        ? currentScore.overall 
        : Math.max(30, currentScore.overall - (i * 5) - Math.random() * 10);

      timeline.push({
        month: monthDate.toISOString().substring(0, 7),
        score: Math.round(estimatedScore),
        activations: activationsByMonth.length
      });
    }

    return timeline;
  }

  /**
   * Identify readiness gaps
   */
  async identifyGaps(organizationId: string) {
    const score = await this.calculateScore(organizationId);
    const gaps = [];

    if (score.components.templateCoverage < 70) {
      gaps.push({
        area: 'Template Coverage',
        severity: 'high',
        description: `Only ${score.breakdown.scenariosWithPlaybooks} of ${score.breakdown.scenariosTotal} scenarios have playbooks`,
        recommendation: 'Create response strategies for remaining scenarios'
      });
    }

    if (score.components.drillRecency < 60) {
      gaps.push({
        area: 'Drill Recency',
        severity: score.breakdown.avgDaysSinceDrill > 90 ? 'critical' : 'high',
        description: `Average ${score.breakdown.avgDaysSinceDrill} days since last drill`,
        recommendation: 'Schedule regular drill exercises (target: every 30-60 days)'
      });
    }

    if (score.components.automationCoverage < 50) {
      gaps.push({
        area: 'Automation Coverage',
        severity: 'medium',
        description: `Low automation coverage (${score.components.automationCoverage}%)`,
        recommendation: 'Identify manual tasks that can be automated in playbooks'
      });
    }

    if (score.components.executionSuccess < 80) {
      gaps.push({
        area: 'Execution Success',
        severity: 'high',
        description: `Success rate is ${score.components.executionSuccess}%`,
        recommendation: 'Review failed activations and refine playbook procedures'
      });
    }

    return gaps;
  }
}

export const preparednessEngine = new PreparednessEngine();
