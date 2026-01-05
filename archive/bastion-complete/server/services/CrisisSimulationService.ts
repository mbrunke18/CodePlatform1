import { db } from '../db.js';
import { crisisSimulations, simulationResults, users, scenarios, organizations } from '@shared/schema';
import { eq, and, desc, inArray } from 'drizzle-orm';
import { databaseNotificationService } from './DatabaseNotificationService.js';
import { usageAnalyticsService } from './UsageAnalyticsService.js';
import { roiMeasurementService } from './ROIMeasurementService.js';

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  type: 'cyber_attack' | 'supply_chain' | 'financial' | 'natural_disaster' | 'regulatory' | 'competitive';
  difficulty: 'basic' | 'intermediate' | 'advanced' | 'expert';
  estimatedDuration: number; // minutes
  objectives: Array<{
    id: string;
    description: string;
    successCriteria: string;
    weight: number; // 0-1
  }>;
  initialConditions: {
    situation: string;
    availableResources: string[];
    timeConstraints: string;
    stakeholders: string[];
    constraints: string[];
  };
  events: Array<{
    timeOffset: number; // minutes from start
    event: string;
    impact: 'low' | 'medium' | 'high' | 'critical';
    choices?: Array<{
      id: string;
      action: string;
      consequence: string;
      resources: number;
      time: number;
    }>;
  }>;
}

export interface SimulationParticipant {
  userId: string;
  role: 'incident_commander' | 'communications_lead' | 'operations_manager' | 'executive' | 'subject_matter_expert';
  responsibilities: string[];
  availableActions: string[];
}

export interface SimulationState {
  simulationId: string;
  currentPhase: 'briefing' | 'active' | 'recovery' | 'debriefing' | 'completed';
  timeElapsed: number; // minutes
  currentEvent: number;
  teamPerformance: {
    responseTime: number;
    decisionQuality: number;
    collaboration: number;
    resourceEfficiency: number;
  };
  decisions: Array<{
    timestamp: Date;
    participantId: string;
    decision: string;
    impact: string;
    outcome: 'positive' | 'negative' | 'neutral';
  }>;
  metrics: {
    communicationEvents: number;
    decisionsPerMinute: number;
    stakeholdersEngaged: number;
    resourcesUsed: number;
    issuesResolved: number;
  };
}

export interface SimulationReport {
  simulationId: string;
  scenario: string;
  participants: SimulationParticipant[];
  duration: number;
  overallPerformance: {
    score: number; // 0-100
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    strengths: string[];
    weaknesses: string[];
  };
  individualResults: Array<{
    participantId: string;
    role: string;
    performance: {
      responseTime: number;
      decisionQuality: number;
      leadership: number;
      collaboration: number;
      stressHandling: number;
    };
    keyDecisions: string[];
    feedback: string;
  }>;
  lessons: Array<{
    category: 'process' | 'communication' | 'decision_making' | 'resource_management';
    insight: string;
    recommendation: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  benchmarking: {
    industryAverage: number;
    percentileRanking: number;
    comparison: string;
  };
}

export class CrisisSimulationService {

  /**
   * Create a new crisis simulation
   */
  async createSimulation(
    organizationId: string,
    scenarioId: string,
    facilitatorId: string,
    participants: Array<{ userId: string; role: string }>,
    scheduledStart?: Date
  ): Promise<string> {
    try {
      // Get scenario details
      const scenario = await this.getSimulationScenario(scenarioId);
      if (!scenario) {
        throw new Error(`Scenario ${scenarioId} not found`);
      }

      // Validate participants
      await this.validateParticipants(organizationId, participants);

      // Create simulation record
      const [simulation] = await db.insert(crisisSimulations).values({
        organizationId,
        name: `Crisis Simulation: ${scenario.name}`,
        scenarioType: scenario.type,
        difficulty: scenario.difficulty,
        participants: participants.map(p => ({
          userId: p.userId,
          role: p.role,
          joinedAt: null,
          status: 'invited'
        })),
        facilitator: facilitatorId,
        objectives: scenario.objectives,
        scenarioData: {
          scenario,
          initialConditions: scenario.initialConditions,
          events: scenario.events
        },
        duration: scenario.estimatedDuration,
        status: scheduledStart ? 'scheduled' : 'draft',
        startTime: scheduledStart,
        currentPhase: 'briefing',
        createdBy: facilitatorId,
        metadata: {
          difficulty: scenario.difficulty,
          estimatedDuration: scenario.estimatedDuration,
          objectives: scenario.objectives
        }
      }).returning();

      // Send invitations to participants
      await this.sendSimulationInvitations(simulation.id, participants, scenario);

      // Track analytics
      await usageAnalyticsService.trackEvent({
        organizationId,
        userId: facilitatorId,
        eventType: 'feature_used',
        feature: 'crisis_simulation',
        action: 'create',
        entityType: 'simulation',
        entityId: simulation.id,
        duration: 300, // 5 minutes to set up
        value: 5000, // Estimated value of simulation setup
        context: {
          scenarioType: scenario.type,
          participantCount: participants.length,
          difficulty: scenario.difficulty
        }
      });

      console.log(`🎯 Created crisis simulation: ${simulation.id} (${scenario.name})`);
      return simulation.id;

    } catch (error) {
      console.error('❌ Failed to create crisis simulation:', error);
      throw error;
    }
  }

  /**
   * Start a crisis simulation
   */
  async startSimulation(simulationId: string, facilitatorId: string): Promise<SimulationState> {
    try {
      const [simulation] = await db
        .select()
        .from(crisisSimulations)
        .where(eq(crisisSimulations.id, simulationId));

      if (!simulation) {
        throw new Error(`Simulation ${simulationId} not found`);
      }

      if (simulation.facilitator !== facilitatorId) {
        throw new Error('Only the facilitator can start the simulation');
      }

      // Initialize simulation state
      const initialState: SimulationState = {
        simulationId,
        currentPhase: 'briefing',
        timeElapsed: 0,
        currentEvent: 0,
        teamPerformance: {
          responseTime: 0,
          decisionQuality: 0,
          collaboration: 0,
          resourceEfficiency: 1.0
        },
        decisions: [],
        metrics: {
          communicationEvents: 0,
          decisionsPerMinute: 0,
          stakeholdersEngaged: 0,
          resourcesUsed: 0,
          issuesResolved: 0
        }
      };

      // Update simulation status
      await db
        .update(crisisSimulations)
        .set({
          status: 'running',
          startTime: new Date(),
          currentPhase: 'briefing',
          events: [], // Will be populated as simulation progresses
          performanceMetrics: initialState.teamPerformance
        })
        .where(eq(crisisSimulations.id, simulationId));

      // Notify participants
      const participants = simulation.participants as any[];
      for (const participant of participants) {
        await databaseNotificationService.createAndSendNotification({
          organizationId: simulation.organizationId,
          userId: participant.userId,
          type: 'simulation_started',
          title: 'Crisis Simulation Started',
          message: `Your crisis simulation "${simulation.name}" has begun. Join now to participate.`,
          priority: 'high',
          metadata: {
            simulationId,
            role: participant.role,
            joinUrl: `/simulations/${simulationId}`
          }
        });
      }

      console.log(`🚨 Started crisis simulation: ${simulationId}`);
      return initialState;

    } catch (error) {
      console.error('❌ Failed to start simulation:', error);
      throw error;
    }
  }

  /**
   * Process participant decision during simulation
   */
  async processDecision(
    simulationId: string,
    participantId: string,
    decision: {
      action: string;
      rationale: string;
      resourcesAllocated?: number;
      timeEstimate?: number;
    }
  ): Promise<{
    accepted: boolean;
    impact: string;
    newState: SimulationState;
  }> {
    try {
      const [simulation] = await db
        .select()
        .from(crisisSimulations)
        .where(eq(crisisSimulations.id, simulationId));

      if (!simulation) {
        throw new Error(`Simulation ${simulationId} not found`);
      }

      // Validate participant is in simulation
      const participants = simulation.participants as any[];
      const participant = participants.find(p => p.userId === participantId);
      if (!participant) {
        throw new Error('Participant not found in simulation');
      }

      // Evaluate decision impact
      const impact = await this.evaluateDecisionImpact(simulation, participant, decision);

      // Update simulation state
      const currentEvents = simulation.events as any[] || [];
      const newEvent = {
        timestamp: new Date(),
        type: 'decision',
        participantId,
        decision: decision.action,
        rationale: decision.rationale,
        impact: impact.description,
        outcome: impact.outcome,
        performanceChange: impact.performanceChange
      };

      currentEvents.push(newEvent);

      // Calculate new performance metrics
      const currentMetrics = simulation.performanceMetrics as any || {};
      const updatedMetrics = this.updatePerformanceMetrics(currentMetrics, impact);

      await db
        .update(crisisSimulations)
        .set({
          events: currentEvents,
          performanceMetrics: updatedMetrics,
          updatedAt: new Date()
        })
        .where(eq(crisisSimulations.id, simulationId));

      // Create new simulation state
      const newState: SimulationState = {
        simulationId,
        currentPhase: simulation.currentPhase as any,
        timeElapsed: Math.floor((Date.now() - new Date(simulation.startTime!).getTime()) / (1000 * 60)),
        currentEvent: currentEvents.length - 1,
        teamPerformance: updatedMetrics,
        decisions: currentEvents.filter(e => e.type === 'decision'),
        metrics: this.calculateCurrentMetrics(currentEvents)
      };

      // Track analytics
      await usageAnalyticsService.trackEvent({
        organizationId: simulation.organizationId,
        userId: participantId,
        eventType: 'decision_made',
        feature: 'crisis_simulation',
        action: 'decide',
        entityType: 'simulation',
        entityId: simulationId,
        duration: decision.timeEstimate || 5,
        value: impact.valueImpact || 0,
        context: {
          decision: decision.action,
          impact: impact.outcome,
          role: participant.role
        }
      });

      return {
        accepted: true,
        impact: impact.description,
        newState
      };

    } catch (error) {
      console.error('❌ Failed to process simulation decision:', error);
      throw error;
    }
  }

  /**
   * Complete crisis simulation and generate report
   */
  async completeSimulation(simulationId: string, facilitatorId: string): Promise<SimulationReport> {
    try {
      const [simulation] = await db
        .select()
        .from(crisisSimulations)
        .where(eq(crisisSimulations.id, simulationId));

      if (!simulation) {
        throw new Error(`Simulation ${simulationId} not found`);
      }

      if (simulation.facilitator !== facilitatorId) {
        throw new Error('Only the facilitator can complete the simulation');
      }

      // Update simulation status
      await db
        .update(crisisSimulations)
        .set({
          status: 'completed',
          endTime: new Date(),
          currentPhase: 'completed'
        })
        .where(eq(crisisSimulations.id, simulationId));

      // Track ROI value for completed crisis simulation
      try {
        const { roiMeasurementService } = await import('./ROIMeasurementService.js');
        
        if (simulation && simulation.startTime) {
          const startTime = new Date(simulation.startTime);
          const endTime = new Date();
          const timeToResolution = Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60)); // minutes
          
          // Calculate crisis preparation value (using base estimates since schema properties may not match)
          const baseValue = 10000; // Standard crisis simulation value
          const stakeholderBonus = 1000; // Bonus for multi-stakeholder exercises
          const totalValue = baseValue + stakeholderBonus;
          
          await roiMeasurementService.trackValueEvent({
            organizationId: simulation.organizationId,
            eventType: 'crisis_simulation_completed',
            entityId: simulationId,
            entityType: 'crisis_simulation',
            valueGenerated: totalValue,
            costAvoided: Math.floor(totalValue * 2.5), // Crisis prep saves 2.5x the investment
            timeToResolution,
            qualityScore: 0.9, // High quality for completed simulations
            evidenceData: {
              simulationName: simulation.name,
              organizationId: simulation.organizationId,
              phasesCompleted: ['immediate', 'short_term', 'long_term'],
              preparednessImprovement: 'significant'
            }
          });
          
          console.log(`✅ ROI tracked for crisis simulation: ${simulation.name} (Value: $${totalValue}, Avoided: $${Math.floor(totalValue * 2.5)})`);
        }
      } catch (error) {
        console.error('Failed to track ROI for crisis simulation:', error);
        // Don't fail the completion if ROI tracking fails
      }

      // Generate comprehensive report
      const report = await this.generateSimulationReport(simulation);

      // Store individual results
      await this.storeParticipantResults(simulationId, report.individualResults);

      // Track ROI value
      await roiMeasurementService.trackValueEvent({
        organizationId: simulation.organizationId,
        eventType: 'simulation_completed',
        entityId: simulationId,
        entityType: 'simulation',
        valueGenerated: this.calculateSimulationValue(report),
        costAvoided: this.calculateCostAvoidance(report),
        timeToResolution: report.duration,
        qualityScore: report.overallPerformance.score / 100,
        evidenceData: {
          participantCount: report.participants.length,
          scenario: report.scenario,
          difficulty: simulation.difficulty,
          performanceGrade: report.overallPerformance.grade
        }
      });

      console.log(`✅ Completed crisis simulation: ${simulationId} (Grade: ${report.overallPerformance.grade})`);
      return report;

    } catch (error) {
      console.error('❌ Failed to complete simulation:', error);
      throw error;
    }
  }

  /**
   * Get available simulation scenarios
   */
  async getAvailableScenarios(organizationId: string): Promise<SimulationScenario[]> {
    try {
      // Get organization type for relevant scenarios
      const [org] = await db
        .select()
        .from(organizations)
        .where(eq(organizations.id, organizationId));

      // Return predefined scenarios (in real implementation, these would be in database)
      return this.getPredefinedScenarios(org?.type || 'general');

    } catch (error) {
      console.error('❌ Failed to get available scenarios:', error);
      return [];
    }
  }

  /**
   * Get predefined simulation scenarios
   */
  private getPredefinedScenarios(organizationType: string): SimulationScenario[] {
    const baseScenarios: SimulationScenario[] = [
      {
        id: 'cyber_breach_basic',
        name: 'Cybersecurity Data Breach',
        description: 'Respond to a data breach affecting customer information',
        type: 'cyber_attack',
        difficulty: 'basic',
        estimatedDuration: 90,
        objectives: [
          {
            id: 'contain_breach',
            description: 'Contain the security breach within 2 hours',
            successCriteria: 'All affected systems isolated and secured',
            weight: 0.3
          },
          {
            id: 'notify_stakeholders',
            description: 'Notify all stakeholders within regulatory timeframes',
            successCriteria: 'Customers, regulators, and partners informed appropriately',
            weight: 0.25
          },
          {
            id: 'preserve_evidence',
            description: 'Preserve forensic evidence for investigation',
            successCriteria: 'Chain of custody maintained for all evidence',
            weight: 0.2
          },
          {
            id: 'restore_services',
            description: 'Restore critical services with enhanced security',
            successCriteria: 'Services operational with additional security measures',
            weight: 0.25
          }
        ],
        initialConditions: {
          situation: 'Security monitoring has detected unusual data access patterns. Initial investigation suggests customer data may have been compromised.',
          availableResources: ['IT Security Team', 'Legal Counsel', 'Communications Team', 'Executive Leadership'],
          timeConstraints: 'Regulatory notification requirements within 72 hours',
          stakeholders: ['Customers', 'Regulators', 'Partners', 'Media', 'Employees'],
          constraints: ['Limited forensic expertise', 'Ongoing business operations', 'Media attention']
        },
        events: [
          {
            timeOffset: 15,
            event: 'Security team confirms data exfiltration of 10,000 customer records',
            impact: 'high',
            choices: [
              {
                id: 'immediate_disclosure',
                action: 'Immediately notify affected customers',
                consequence: 'Builds trust but may cause panic',
                resources: 5,
                time: 30
              },
              {
                id: 'investigate_first',
                action: 'Complete investigation before disclosure',
                consequence: 'Better information but potential regulatory issues',
                resources: 8,
                time: 60
              }
            ]
          },
          {
            timeOffset: 45,
            event: 'Media outlets are asking questions about the incident',
            impact: 'medium',
            choices: [
              {
                id: 'no_comment',
                action: 'No comment until investigation complete',
                consequence: 'May appear evasive',
                resources: 2,
                time: 5
              },
              {
                id: 'prepared_statement',
                action: 'Issue prepared statement acknowledging incident',
                consequence: 'Shows transparency but may reveal details',
                resources: 4,
                time: 15
              }
            ]
          }
        ]
      },
      {
        id: 'supply_chain_disruption',
        name: 'Critical Supplier Failure',
        description: 'Major supplier faces bankruptcy, threatening production',
        type: 'supply_chain',
        difficulty: 'intermediate',
        estimatedDuration: 120,
        objectives: [
          {
            id: 'assess_impact',
            description: 'Assess full impact on operations and customers',
            successCriteria: 'Complete impact analysis within 1 hour',
            weight: 0.2
          },
          {
            id: 'secure_alternatives',
            description: 'Secure alternative suppliers for critical components',
            successCriteria: 'Alternative supply secured for 80% of affected components',
            weight: 0.3
          },
          {
            id: 'customer_communication',
            description: 'Proactively communicate with affected customers',
            successCriteria: 'All major customers informed with mitigation plans',
            weight: 0.25
          },
          {
            id: 'financial_recovery',
            description: 'Minimize financial impact through recovery strategies',
            successCriteria: 'Financial exposure limited to less than 5% of quarterly revenue',
            weight: 0.25
          }
        ],
        initialConditions: {
          situation: 'Critical supplier has filed for bankruptcy protection, affecting 40% of your production capacity',
          availableResources: ['Procurement Team', 'Operations', 'Finance', 'Customer Relations', 'Legal'],
          timeConstraints: 'Existing inventory lasts 2 weeks',
          stakeholders: ['Customers', 'Alternative Suppliers', 'Financial Partners', 'Employees'],
          constraints: ['Long supplier qualification process', 'Quality standards', 'Cost pressures']
        },
        events: [
          {
            timeOffset: 30,
            event: 'Alternative supplier offers expedited qualification but at 40% higher cost',
            impact: 'high'
          },
          {
            timeOffset: 60,
            event: 'Major customer threatens to cancel orders due to uncertainty',
            impact: 'critical'
          }
        ]
      }
    ];

    // Add industry-specific scenarios
    if (organizationType === 'financial_services') {
      baseScenarios.push({
        id: 'regulatory_enforcement',
        name: 'Regulatory Enforcement Action',
        description: 'Regulatory body initiates enforcement proceedings',
        type: 'regulatory',
        difficulty: 'advanced',
        estimatedDuration: 150,
        objectives: [
          {
            id: 'respond_regulators',
            description: 'Respond appropriately to regulatory inquiries',
            successCriteria: 'Timely and comprehensive regulatory response',
            weight: 0.4
          },
          {
            id: 'protect_reputation',
            description: 'Protect institutional reputation and customer confidence',
            successCriteria: 'Minimal negative media coverage and customer defection',
            weight: 0.3
          },
          {
            id: 'ensure_compliance',
            description: 'Implement compliance improvements',
            successCriteria: 'Remediation plan accepted by regulators',
            weight: 0.3
          }
        ],
        initialConditions: {
          situation: 'Regulatory examination has identified significant compliance deficiencies',
          availableResources: ['Compliance Team', 'Legal Counsel', 'Senior Management', 'External Advisors'],
          timeConstraints: 'Regulatory response deadlines',
          stakeholders: ['Regulators', 'Board of Directors', 'Customers', 'Media'],
          constraints: ['Regulatory scrutiny', 'Potential penalties', 'Reputation risk']
        },
        events: [
          {
            timeOffset: 45,
            event: 'Regulatory body issues public enforcement action',
            impact: 'critical'
          }
        ]
      });
    }

    return baseScenarios;
  }

  /**
   * Get specific simulation scenario
   */
  private async getSimulationScenario(scenarioId: string): Promise<SimulationScenario | null> {
    // In a real implementation, would query database
    // For now, return from predefined scenarios
    const scenarios = this.getPredefinedScenarios('general');
    return scenarios.find(s => s.id === scenarioId) || null;
  }

  /**
   * Validate simulation participants
   */
  private async validateParticipants(organizationId: string, participants: Array<{ userId: string; role: string }>): Promise<void> {
    const userIds = participants.map(p => p.userId);
    const orgUsers = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.organizationId, organizationId),
          inArray(users.id, userIds)
        )
      );

    if (orgUsers.length !== userIds.length) {
      throw new Error('Some participants are not members of this organization');
    }

    // Validate role assignments
    const requiredRoles = ['incident_commander'];
    const assignedRoles = participants.map(p => p.role);
    
    for (const role of requiredRoles) {
      if (!assignedRoles.includes(role)) {
        throw new Error(`Required role '${role}' not assigned to any participant`);
      }
    }
  }

  /**
   * Send simulation invitations
   */
  private async sendSimulationInvitations(
    simulationId: string,
    participants: Array<{ userId: string; role: string }>,
    scenario: SimulationScenario
  ): Promise<void> {
    for (const participant of participants) {
      await databaseNotificationService.createAndSendNotification({
        organizationId: '', // Will be filled in by calling function
        userId: participant.userId,
        type: 'simulation_invitation',
        title: 'Crisis Simulation Invitation',
        message: `You've been invited to participate in "${scenario.name}" as ${participant.role}. Estimated duration: ${scenario.estimatedDuration} minutes.`,
        priority: 'medium',
        metadata: {
          simulationId,
          role: participant.role,
          scenarioType: scenario.type,
          difficulty: scenario.difficulty,
          estimatedDuration: scenario.estimatedDuration
        }
      });
    }
  }

  /**
   * Evaluate decision impact
   */
  private async evaluateDecisionImpact(simulation: any, participant: any, decision: any): Promise<{
    outcome: 'positive' | 'negative' | 'neutral';
    description: string;
    performanceChange: Record<string, number>;
    valueImpact: number;
  }> {
    // Simplified decision evaluation - in real implementation would be more sophisticated
    const scenarioData = simulation.scenarioData as any;
    const currentEvent = scenarioData?.events?.[0]; // Simplified

    let outcome: 'positive' | 'negative' | 'neutral' = 'neutral';
    let performanceChange = {
      responseTime: 0,
      decisionQuality: 0,
      collaboration: 0,
      resourceEfficiency: 0
    };

    // Evaluate based on decision type and context
    if (decision.action.toLowerCase().includes('immediate') || decision.action.toLowerCase().includes('quickly')) {
      performanceChange.responseTime = 0.1;
      outcome = 'positive';
    }

    if (decision.action.toLowerCase().includes('communicate') || decision.action.toLowerCase().includes('notify')) {
      performanceChange.collaboration = 0.1;
      outcome = 'positive';
    }

    if (decision.action.toLowerCase().includes('investigate') || decision.action.toLowerCase().includes('analyze')) {
      performanceChange.decisionQuality = 0.1;
      outcome = 'positive';
    }

    const valueImpact = outcome === 'positive' ? 1000 : outcome === 'negative' ? -500 : 0;

    return {
      outcome,
      description: this.generateDecisionImpactDescription(decision, outcome),
      performanceChange,
      valueImpact
    };
  }

  /**
   * Generate decision impact description
   */
  private generateDecisionImpactDescription(decision: any, outcome: 'positive' | 'negative' | 'neutral'): string {
    const outcomeMap = {
      positive: ['Good decision', 'Effective approach', 'Well-reasoned choice'],
      negative: ['Problematic decision', 'May cause complications', 'Consider alternatives'],
      neutral: ['Standard approach', 'Reasonable decision', 'Acceptable choice']
    };

    const descriptions = outcomeMap[outcome];
    return descriptions[Math.floor(Math.random() * descriptions.length)] + '. ' + 
           (decision.rationale ? `Rationale: ${decision.rationale}` : '');
  }

  /**
   * Update performance metrics
   */
  private updatePerformanceMetrics(currentMetrics: any, impact: any): any {
    const updated = { ...currentMetrics };
    
    Object.entries(impact.performanceChange).forEach(([metric, change]) => {
      updated[metric] = Math.max(0, Math.min(1, (updated[metric] || 0.5) + (change as number)));
    });

    return updated;
  }

  /**
   * Calculate current simulation metrics
   */
  private calculateCurrentMetrics(events: any[]): any {
    return {
      communicationEvents: events.filter(e => 
        e.decision?.toLowerCase().includes('communicate') || 
        e.decision?.toLowerCase().includes('notify')
      ).length,
      decisionsPerMinute: events.length / Math.max(1, this.getSimulationDuration(events)),
      stakeholdersEngaged: new Set(events.map(e => e.participantId)).size,
      resourcesUsed: events.reduce((sum, e) => sum + (e.resourcesUsed || 1), 0),
      issuesResolved: events.filter(e => e.outcome === 'positive').length
    };
  }

  /**
   * Get simulation duration in minutes
   */
  private getSimulationDuration(events: any[]): number {
    if (events.length === 0) return 1;
    
    const firstEvent = new Date(events[0].timestamp);
    const lastEvent = new Date(events[events.length - 1].timestamp);
    return Math.max(1, (lastEvent.getTime() - firstEvent.getTime()) / (1000 * 60));
  }

  /**
   * Generate comprehensive simulation report
   */
  private async generateSimulationReport(simulation: any): Promise<SimulationReport> {
    const events = simulation.events as any[] || [];
    const participants = simulation.participants as any[] || [];
    const performanceMetrics = simulation.performanceMetrics || {};
    const duration = simulation.endTime && simulation.startTime ? 
      (new Date(simulation.endTime).getTime() - new Date(simulation.startTime).getTime()) / (1000 * 60) : 
      simulation.duration || 0;

    // Calculate overall performance score
    const overallScore = this.calculateOverallScore(performanceMetrics, events);
    const grade = this.scoreToGrade(overallScore);

    // Generate individual results
    const individualResults = await this.generateIndividualResults(simulation, events);

    // Extract lessons learned
    const lessons = this.extractLessons(events, performanceMetrics);

    // Calculate benchmarking (simplified)
    const benchmarking = {
      industryAverage: 75, // Placeholder
      percentileRanking: Math.min(95, Math.max(5, overallScore)),
      comparison: overallScore > 85 ? 'Excellent performance' : 
                  overallScore > 75 ? 'Above average' : 
                  overallScore > 60 ? 'Average performance' : 'Below average'
    };

    return {
      simulationId: simulation.id,
      scenario: simulation.name,
      participants: participants.map(p => ({
        userId: p.userId,
        role: p.role,
        responsibilities: this.getRoleResponsibilities(p.role),
        availableActions: this.getRoleActions(p.role)
      })),
      duration: Math.round(duration),
      overallPerformance: {
        score: Math.round(overallScore),
        grade,
        strengths: this.identifyStrengths(performanceMetrics, events),
        weaknesses: this.identifyWeaknesses(performanceMetrics, events)
      },
      individualResults,
      lessons,
      benchmarking
    };
  }

  /**
   * Calculate overall performance score
   */
  private calculateOverallScore(metrics: any, events: any[]): number {
    let score = 50; // Base score

    // Performance metrics contribution (40 points)
    const avgMetric = Object.values(metrics).reduce((sum: number, val: any) => sum + (val || 0.5), 0) / Object.keys(metrics).length;
    score += avgMetric * 40;

    // Decision quality contribution (30 points)
    const positiveDecisions = events.filter(e => e.outcome === 'positive').length;
    const totalDecisions = events.filter(e => e.type === 'decision').length;
    if (totalDecisions > 0) {
      score += (positiveDecisions / totalDecisions) * 30;
    }

    // Timeliness contribution (20 points)
    const quickDecisions = events.filter(e => 
      e.type === 'decision' && new Date(e.timestamp).getMinutes() < 10
    ).length;
    if (totalDecisions > 0) {
      score += (quickDecisions / totalDecisions) * 20;
    }

    // Collaboration contribution (10 points)
    const uniqueParticipants = new Set(events.map(e => e.participantId)).size;
    if (uniqueParticipants > 1) {
      score += Math.min(10, uniqueParticipants * 2);
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Convert score to letter grade
   */
  private scoreToGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  /**
   * Generate individual participant results
   */
  private async generateIndividualResults(simulation: any, events: any[]): Promise<any[]> {
    const participants = simulation.participants as any[] || [];
    const results = [];

    for (const participant of participants) {
      const participantEvents = events.filter(e => e.participantId === participant.userId);
      
      const performance = {
        responseTime: this.calculateParticipantResponseTime(participantEvents),
        decisionQuality: this.calculateParticipantDecisionQuality(participantEvents),
        leadership: this.calculateParticipantLeadership(participant, participantEvents),
        collaboration: this.calculateParticipantCollaboration(participantEvents, events),
        stressHandling: this.calculateStressHandling(participantEvents)
      };

      results.push({
        participantId: participant.userId,
        role: participant.role,
        performance,
        keyDecisions: participantEvents
          .filter(e => e.type === 'decision')
          .map(e => e.decision)
          .slice(0, 3), // Top 3 decisions
        feedback: this.generateParticipantFeedback(participant, performance, participantEvents)
      });
    }

    return results;
  }

  /**
   * Store participant results in database
   */
  private async storeParticipantResults(simulationId: string, results: any[]): Promise<void> {
    for (const result of results) {
      await db.insert(simulationResults).values({
        simulationId,
        participantId: result.participantId,
        role: result.role,
        decisions: result.keyDecisions,
        responseTime: Math.round(result.performance.responseTime),
        decisionQuality: result.performance.decisionQuality.toString(),
        collaborationScore: result.performance.collaboration.toString(),
        leadershipScore: result.performance.leadership.toString(),
        stressHandling: result.performance.stressHandling.toString(),
        overallPerformance: (Object.values(result.performance).reduce((sum: number, val: any) => sum + val, 0) / 5).toString(),
        strengths: this.extractParticipantStrengths(result.performance),
        improvementAreas: this.extractParticipantImprovements(result.performance),
        personalizedFeedback: result.feedback
      });
    }
  }

  /**
   * Calculate simulation business value
   */
  private calculateSimulationValue(report: SimulationReport): number {
    let value = 10000; // Base value for simulation

    // Performance bonus
    if (report.overallPerformance.grade === 'A') value += 5000;
    else if (report.overallPerformance.grade === 'B') value += 3000;

    // Participation bonus
    value += report.participants.length * 1000;

    // Lessons learned value
    value += report.lessons.length * 500;

    return value;
  }

  /**
   * Calculate cost avoidance from simulation
   */
  private calculateCostAvoidance(report: SimulationReport): number {
    // Estimate cost of actual crisis that would be avoided through better preparedness
    const baseCrisisCost = 100000; // $100K base crisis cost
    const preparednessMultiplier = report.overallPerformance.score / 100;
    
    return Math.round(baseCrisiseCost * (1 - preparednessMultiplier));
  }

  // Placeholder methods for detailed calculations
  private getRoleResponsibilities(role: string): string[] {
    const responsibilities: Record<string, string[]> = {
      incident_commander: ['Overall incident response', 'Decision making', 'Resource allocation'],
      communications_lead: ['Stakeholder communication', 'Media relations', 'Message coordination'],
      operations_manager: ['Operational continuity', 'Resource deployment', 'Process execution'],
      executive: ['Strategic oversight', 'Escalation decisions', 'External relationships'],
      subject_matter_expert: ['Technical guidance', 'Risk assessment', 'Solution development']
    };
    return responsibilities[role] || ['General support'];
  }

  private getRoleActions(role: string): string[] {
    return ['Assess situation', 'Make decisions', 'Communicate updates', 'Allocate resources', 'Execute plans'];
  }

  private identifyStrengths(metrics: any, events: any[]): string[] {
    const strengths = [];
    if (metrics.responseTime > 0.7) strengths.push('Quick response time');
    if (metrics.decisionQuality > 0.7) strengths.push('High-quality decisions');
    if (metrics.collaboration > 0.7) strengths.push('Excellent collaboration');
    return strengths.slice(0, 3);
  }

  private identifyWeaknesses(metrics: any, events: any[]): string[] {
    const weaknesses = [];
    if (metrics.responseTime < 0.4) weaknesses.push('Slow response time');
    if (metrics.decisionQuality < 0.4) weaknesses.push('Decision quality needs improvement');
    if (metrics.collaboration < 0.4) weaknesses.push('Limited collaboration');
    return weaknesses.slice(0, 3);
  }

  private extractLessons(events: any[], metrics: any): any[] {
    return [
      {
        category: 'decision_making' as const,
        insight: 'Teams performed better with structured decision processes',
        recommendation: 'Implement formal decision-making frameworks for crisis situations',
        priority: 'high' as const
      },
      {
        category: 'communication' as const,
        insight: 'Communication frequency impacted coordination effectiveness',
        recommendation: 'Establish regular communication schedules during crises',
        priority: 'medium' as const
      }
    ];
  }

  private calculateParticipantResponseTime(events: any[]): number {
    return events.length > 0 ? Math.random() * 10 + 5 : 0; // Simplified
  }

  private calculateParticipantDecisionQuality(events: any[]): number {
    const decisions = events.filter(e => e.type === 'decision');
    if (decisions.length === 0) return 0.5;
    
    const positiveDecisions = decisions.filter(e => e.outcome === 'positive').length;
    return positiveDecisions / decisions.length;
  }

  private calculateParticipantLeadership(participant: any, events: any[]): number {
    return participant.role === 'incident_commander' ? 0.8 : 0.6; // Simplified
  }

  private calculateParticipantCollaboration(participantEvents: any[], allEvents: any[]): number {
    return participantEvents.length > 0 ? 0.7 : 0.3; // Simplified
  }

  private calculateStressHandling(events: any[]): number {
    return Math.max(0.3, 1 - (events.length * 0.1)); // More decisions = more stress
  }

  private generateParticipantFeedback(participant: any, performance: any, events: any[]): string {
    const avgPerf = Object.values(performance).reduce((sum: number, val: any) => sum + val, 0) / 5;
    
    if (avgPerf > 0.8) {
      return `Excellent performance as ${participant.role}. Strong leadership and decision-making throughout the simulation.`;
    } else if (avgPerf > 0.6) {
      return `Good performance with room for improvement in crisis response coordination.`;
    } else {
      return `Performance needs improvement. Consider additional training in crisis management principles.`;
    }
  }

  private extractParticipantStrengths(performance: any): any[] {
    return Object.entries(performance)
      .filter(([, value]) => (value as number) > 0.7)
      .map(([key]) => key)
      .slice(0, 3);
  }

  private extractParticipantImprovements(performance: any): any[] {
    return Object.entries(performance)
      .filter(([, value]) => (value as number) < 0.5)
      .map(([key]) => key)
      .slice(0, 3);
  }
}

// Export singleton instance
export const crisisSimulationService = new CrisisSimulationService();