import { db } from '../db.js';
import { aiConfidenceScores, humanValidationQueue, insights, recommendations, users } from '@shared/schema';
import { eq, and, desc, lt, gte } from 'drizzle-orm';
import { databaseNotificationService } from './DatabaseNotificationService.js';
import OpenAI from 'openai';

// Initialize OpenAI client with proper error handling
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
}) : null;

export interface ConfidenceAssessment {
  entityId: string;
  entityType: 'insight' | 'recommendation' | 'forecast' | 'analysis';
  aiModel: string;
  confidenceScore: number; // 0.0-1.0
  factorsAnalyzed: {
    dataQuality: number;
    sourceReliability: number;
    modelAccuracy: number;
    contextCompleteness: number;
    historicalPerformance: number;
  };
  uncertaintyFactors: Array<{
    factor: string;
    impact: 'low' | 'medium' | 'high';
    description: string;
  }>;
  biasDetection: {
    overall: number; // 0.0-1.0 (0 = no bias detected)
    types: Array<{
      type: string;
      severity: 'low' | 'medium' | 'high';
      description: string;
    }>;
  };
  recommendedActions: Array<{
    action: 'validate_human' | 'gather_more_data' | 'use_with_caution' | 'proceed_confidently';
    priority: 'low' | 'medium' | 'high';
    reason: string;
  }>;
}

export interface ValidationRequest {
  entityType: string;
  entityId: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  validationType: 'accuracy_check' | 'bias_review' | 'impact_assessment' | 'expert_review';
  requiredExpertise: string[];
  deadline: Date;
  context: {
    aiSummary: string;
    validationPrompt: string;
    supportingData: any;
  };
}

export interface ValidationResult {
  validatorId: string;
  result: 'approved' | 'rejected' | 'needs_revision';
  confidence: number; // 0.0-1.0
  feedback: {
    accuracy: number;
    relevance: number;
    completeness: number;
    bias: number;
    recommendations: string[];
  };
  timeSpent: number; // minutes
  comments: string;
}

export class AIConfidenceService {

  /**
   * Assess confidence for AI-generated content
   */
  async assessConfidence(
    organizationId: string,
    entityType: 'insight' | 'recommendation' | 'forecast' | 'analysis',
    entityId: string,
    content: string,
    sourceData?: any
  ): Promise<ConfidenceAssessment> {
    try {
      let confidenceScore = 0.5; // Base confidence
      const factorsAnalyzed = {
        dataQuality: 0.5,
        sourceReliability: 0.5,
        modelAccuracy: 0.5,
        contextCompleteness: 0.5,
        historicalPerformance: 0.5
      };

      // Analyze data quality
      if (sourceData) {
        factorsAnalyzed.dataQuality = this.assessDataQuality(sourceData);
        confidenceScore += (factorsAnalyzed.dataQuality - 0.5) * 0.2;
      }

      // Assess content completeness and structure
      factorsAnalyzed.contextCompleteness = this.assessContentCompleteness(content);
      confidenceScore += (factorsAnalyzed.contextCompleteness - 0.5) * 0.15;

      // Get historical AI accuracy for this organization/type
      factorsAnalyzed.historicalPerformance = await this.getHistoricalAccuracy(organizationId, entityType);
      confidenceScore += (factorsAnalyzed.historicalPerformance - 0.5) * 0.25;

      // Assess model accuracy based on type
      factorsAnalyzed.modelAccuracy = this.getModelAccuracy(entityType);
      confidenceScore += (factorsAnalyzed.modelAccuracy - 0.5) * 0.2;

      // Source reliability (simplified)
      factorsAnalyzed.sourceReliability = 0.8; // Assume high reliability for internal data
      confidenceScore += (factorsAnalyzed.sourceReliability - 0.5) * 0.2;

      // Normalize confidence score
      confidenceScore = Math.max(0, Math.min(1, confidenceScore));

      // Detect potential biases
      const biasDetection = await this.detectBiases(content, sourceData);

      // Identify uncertainty factors
      const uncertaintyFactors = this.identifyUncertaintyFactors(content, sourceData, factorsAnalyzed);

      // Generate recommended actions
      const recommendedActions = this.generateRecommendedActions(confidenceScore, biasDetection, uncertaintyFactors);

      // Store confidence assessment
      const assessment: ConfidenceAssessment = {
        entityId,
        entityType,
        aiModel: 'gpt-5', // Current model
        confidenceScore,
        factorsAnalyzed,
        uncertaintyFactors,
        biasDetection,
        recommendedActions
      };

      await this.storeConfidenceAssessment(organizationId, assessment);

      // Queue for human validation if needed
      if (this.requiresHumanValidation(assessment)) {
        await this.queueForValidation(organizationId, assessment);
      }

      return assessment;

    } catch (error) {
      console.error('❌ Failed to assess AI confidence:', error);
      throw error;
    }
  }

  /**
   * Store confidence assessment in database
   */
  private async storeConfidenceAssessment(organizationId: string, assessment: ConfidenceAssessment): Promise<void> {
    try {
      await db.insert(aiConfidenceScores).values({
        organizationId,
        entityType: assessment.entityType,
        entityId: assessment.entityId,
        aiModel: assessment.aiModel,
        confidenceScore: assessment.confidenceScore.toString(),
        factorsAnalyzed: assessment.factorsAnalyzed,
        dataQualityScore: assessment.factorsAnalyzed.dataQuality.toString(),
        biasDetectionResults: assessment.biasDetection,
        uncertaintyFactors: assessment.uncertaintyFactors,
        validationStatus: 'pending'
      });

    } catch (error) {
      console.error('❌ Failed to store confidence assessment:', error);
    }
  }

  /**
   * Assess data quality
   */
  private assessDataQuality(sourceData: any): number {
    let score = 0.5;

    if (sourceData) {
      // Check completeness
      const keys = Object.keys(sourceData);
      if (keys.length > 5) score += 0.1;
      
      // Check for null/undefined values
      const nullCount = keys.filter(k => sourceData[k] == null).length;
      const nullRatio = nullCount / keys.length;
      score += (1 - nullRatio) * 0.2;

      // Check for recent data
      if (sourceData.timestamp || sourceData.updatedAt) {
        const dataAge = Date.now() - new Date(sourceData.timestamp || sourceData.updatedAt).getTime();
        const daysSinceUpdate = dataAge / (1000 * 60 * 60 * 24);
        if (daysSinceUpdate < 7) score += 0.2;
        else if (daysSinceUpdate < 30) score += 0.1;
      }

      // Check data structure consistency
      if (typeof sourceData === 'object' && !Array.isArray(sourceData)) {
        score += 0.1;
      }
    }

    return Math.max(0, Math.min(1, score));
  }

  /**
   * Assess content completeness and structure
   */
  private assessContentCompleteness(content: string): number {
    let score = 0.5;

    if (content) {
      // Length assessment
      if (content.length > 500) score += 0.2;
      else if (content.length > 100) score += 0.1;

      // Structure assessment
      if (content.includes('\n')) score += 0.1; // Has structure
      if (content.match(/\d+[%.]/)) score += 0.1; // Has quantitative data
      if (content.toLowerCase().includes('recommend') || content.toLowerCase().includes('suggest')) {
        score += 0.1; // Has actionable content
      }

      // Professional language assessment
      const professionalWords = ['strategic', 'analysis', 'recommendation', 'assessment', 'implementation'];
      const wordCount = professionalWords.filter(word => 
        content.toLowerCase().includes(word)
      ).length;
      score += Math.min(0.2, wordCount * 0.05);
    }

    return Math.max(0, Math.min(1, score));
  }

  /**
   * Get historical accuracy for this organization and entity type
   */
  private async getHistoricalAccuracy(organizationId: string, entityType: string): Promise<number> {
    try {
      const historicalScores = await db
        .select()
        .from(aiConfidenceScores)
        .where(
          and(
            eq(aiConfidenceScores.organizationId, organizationId),
            eq(aiConfidenceScores.entityType, entityType)
          )
        )
        .orderBy(desc(aiConfidenceScores.createdAt))
        .limit(20);

      if (historicalScores.length === 0) {
        return 0.7; // Default for new organizations
      }

      // Calculate accuracy based on validation results
      const validatedScores = historicalScores.filter(s => 
        s.validationStatus === 'validated' || s.validationStatus === 'rejected'
      );

      if (validatedScores.length === 0) {
        return 0.7; // No validation data yet
      }

      const successRate = validatedScores.filter(s => 
        s.validationStatus === 'validated'
      ).length / validatedScores.length;

      return Math.max(0.3, Math.min(0.95, successRate));

    } catch (error) {
      console.error('❌ Failed to get historical accuracy:', error);
      return 0.7; // Default fallback
    }
  }

  /**
   * Get model accuracy based on entity type
   */
  private getModelAccuracy(entityType: string): number {
    const accuracyMap = {
      'insight': 0.85,      // High accuracy for insights
      'recommendation': 0.80, // Good accuracy for recommendations  
      'forecast': 0.70,     // Lower accuracy for predictions
      'analysis': 0.90      // High accuracy for analysis
    };

    return accuracyMap[entityType] || 0.75;
  }

  /**
   * Detect potential biases in AI-generated content
   */
  private async detectBiases(content: string, sourceData?: any): Promise<{
    overall: number;
    types: Array<{
      type: string;
      severity: 'low' | 'medium' | 'high';
      description: string;
    }>;
  }> {
    const biasTypes = [];
    let overallBias = 0;

    // Check for confirmation bias indicators
    if (content.includes('confirms') || content.includes('validates our approach')) {
      biasTypes.push({
        type: 'confirmation_bias',
        severity: 'medium' as const,
        description: 'May be reinforcing existing beliefs without considering alternatives'
      });
      overallBias += 0.3;
    }

    // Check for recency bias
    if (content.includes('recent') && !content.includes('historical')) {
      biasTypes.push({
        type: 'recency_bias',
        severity: 'low' as const,
        description: 'Heavy emphasis on recent events without historical context'
      });
      overallBias += 0.1;
    }

    // Check for optimization bias (everything is improvable)
    const optimizationWords = ['improve', 'optimize', 'enhance', 'better'];
    const optimizationCount = optimizationWords.filter(word => 
      content.toLowerCase().includes(word)
    ).length;
    
    if (optimizationCount > 3) {
      biasTypes.push({
        type: 'optimization_bias',
        severity: 'low' as const,
        description: 'May be over-emphasizing need for improvement'
      });
      overallBias += 0.1;
    }

    // Check for data availability bias
    if (sourceData && Object.keys(sourceData).length < 3) {
      biasTypes.push({
        type: 'availability_bias',
        severity: 'medium' as const,
        description: 'Limited data may be leading to oversimplified conclusions'
      });
      overallBias += 0.2;
    }

    return {
      overall: Math.min(1, overallBias),
      types: biasTypes
    };
  }

  /**
   * Identify uncertainty factors
   */
  private identifyUncertaintyFactors(content: string, sourceData: any, factors: any): Array<{
    factor: string;
    impact: 'low' | 'medium' | 'high';
    description: string;
  }> {
    const uncertaintyFactors = [];

    // Data quality uncertainty
    if (factors.dataQuality < 0.7) {
      uncertaintyFactors.push({
        factor: 'data_quality',
        impact: factors.dataQuality < 0.5 ? 'high' as const : 'medium' as const,
        description: 'Low data quality may affect accuracy of conclusions'
      });
    }

    // Model limitations
    if (content.length < 200) {
      uncertaintyFactors.push({
        factor: 'limited_analysis',
        impact: 'medium' as const,
        description: 'Brief analysis may miss important nuances'
      });
    }

    // Temporal uncertainty
    if (!sourceData?.timestamp) {
      uncertaintyFactors.push({
        factor: 'temporal_context',
        impact: 'medium' as const,
        description: 'Lack of temporal context may affect relevance'
      });
    }

    // External factors
    uncertaintyFactors.push({
      factor: 'external_variables',
      impact: 'low' as const,
      description: 'External market or regulatory changes not considered'
    });

    return uncertaintyFactors.slice(0, 5); // Limit to top 5
  }

  /**
   * Generate recommended actions based on assessment
   */
  private generateRecommendedActions(
    confidenceScore: number, 
    biasDetection: any, 
    uncertaintyFactors: any[]
  ): Array<{
    action: 'validate_human' | 'gather_more_data' | 'use_with_caution' | 'proceed_confidently';
    priority: 'low' | 'medium' | 'high';
    reason: string;
  }> {
    const actions = [];

    if (confidenceScore < 0.5) {
      actions.push({
        action: 'gather_more_data' as const,
        priority: 'high' as const,
        reason: 'Low confidence score requires additional data for validation'
      });
    }

    if (biasDetection.overall > 0.5) {
      actions.push({
        action: 'validate_human' as const,
        priority: 'high' as const,
        reason: 'High bias detected - requires human expert review'
      });
    }

    if (uncertaintyFactors.some(f => f.impact === 'high')) {
      actions.push({
        action: 'use_with_caution' as const,
        priority: 'medium' as const,
        reason: 'High uncertainty factors present - use results cautiously'
      });
    }

    if (confidenceScore > 0.8 && biasDetection.overall < 0.3) {
      actions.push({
        action: 'proceed_confidently' as const,
        priority: 'low' as const,
        reason: 'High confidence and low bias - safe to proceed'
      });
    }

    // Default action if none above apply
    if (actions.length === 0) {
      actions.push({
        action: 'use_with_caution' as const,
        priority: 'medium' as const,
        reason: 'Standard review recommended for AI-generated content'
      });
    }

    return actions;
  }

  /**
   * Determine if human validation is required
   */
  private requiresHumanValidation(assessment: ConfidenceAssessment): boolean {
    return assessment.confidenceScore < 0.6 || 
           assessment.biasDetection.overall > 0.5 ||
           assessment.recommendedActions.some(a => a.action === 'validate_human');
  }

  /**
   * Queue item for human validation
   */
  async queueForValidation(organizationId: string, assessment: ConfidenceAssessment): Promise<string> {
    try {
      // Determine validation type and priority
      let validationType = 'accuracy_check';
      let priority: 'low' | 'medium' | 'high' | 'critical' = 'medium';
      
      if (assessment.biasDetection.overall > 0.7) {
        validationType = 'bias_review';
        priority = 'high';
      } else if (assessment.confidenceScore < 0.4) {
        validationType = 'expert_review';
        priority = 'high';
      } else if (assessment.entityType === 'recommendation') {
        validationType = 'impact_assessment';
        priority = 'medium';
      }

      // Find suitable validators
      const requiredExpertise = this.determineRequiredExpertise(assessment);
      
      // Create validation request
      const [validationRequest] = await db.insert(humanValidationQueue).values({
        organizationId,
        entityType: assessment.entityType,
        entityId: assessment.entityId,
        priority: priority,
        validationType,
        requiredExpertise,
        aiSummary: this.generateAISummary(assessment),
        validationPrompt: this.generateValidationPrompt(assessment),
        deadline: new Date(Date.now() + this.calculateDeadline(priority)),
        status: 'pending'
      }).returning();

      // Notify potential validators
      await this.notifyValidators(organizationId, validationRequest.id, requiredExpertise, priority);

      console.log(`🔍 Queued validation request: ${validationRequest.id} (${priority} priority)`);
      return validationRequest.id;

    } catch (error) {
      console.error('❌ Failed to queue for validation:', error);
      throw error;
    }
  }

  /**
   * Determine required expertise for validation
   */
  private determineRequiredExpertise(assessment: ConfidenceAssessment): string[] {
    const expertise = [];

    switch (assessment.entityType) {
      case 'insight':
        expertise.push('data_analysis', 'business_intelligence');
        break;
      case 'recommendation':
        expertise.push('strategic_planning', 'change_management');
        break;
      case 'forecast':
        expertise.push('predictive_modeling', 'market_analysis');
        break;
      case 'analysis':
        expertise.push('business_analysis', 'domain_expertise');
        break;
    }

    // Add bias expertise if bias detected
    if (assessment.biasDetection.overall > 0.5) {
      expertise.push('bias_detection');
    }

    return expertise;
  }

  /**
   * Generate AI summary for validators
   */
  private generateAISummary(assessment: ConfidenceAssessment): string {
    return `AI Confidence Assessment Summary:
- Overall Confidence: ${(assessment.confidenceScore * 100).toFixed(1)}%
- Key Concerns: ${assessment.uncertaintyFactors.map(f => f.factor).join(', ')}
- Bias Level: ${(assessment.biasDetection.overall * 100).toFixed(1)}%
- Recommended Action: ${assessment.recommendedActions[0]?.action || 'review'}

This ${assessment.entityType} requires human validation due to ${
  assessment.confidenceScore < 0.6 ? 'low confidence score' : 
  assessment.biasDetection.overall > 0.5 ? 'potential bias' : 'quality assurance'
}.`;
  }

  /**
   * Generate validation prompt for humans
   */
  private generateValidationPrompt(assessment: ConfidenceAssessment): string {
    const prompts = [
      'Please review the AI-generated content for accuracy and relevance.',
      'Are the conclusions supported by the available data?',
      'Do you identify any biases or logical gaps in the analysis?',
      'How would you rate the overall quality and usefulness of this content?',
      'What improvements or corrections would you suggest?'
    ];

    // Add specific prompts based on assessment
    if (assessment.biasDetection.types.length > 0) {
      prompts.push('The AI detected potential biases - please verify and provide your assessment.');
    }

    if (assessment.uncertaintyFactors.some(f => f.impact === 'high')) {
      prompts.push('High uncertainty factors were identified - please evaluate the reliability of conclusions.');
    }

    return prompts.join('\n\n');
  }

  /**
   * Calculate validation deadline based on priority
   */
  private calculateDeadline(priority: 'low' | 'medium' | 'high' | 'critical'): number {
    const hours = {
      critical: 4,   // 4 hours
      high: 24,      // 1 day
      medium: 72,    // 3 days
      low: 168       // 1 week
    };

    return hours[priority] * 60 * 60 * 1000; // Convert to milliseconds
  }

  /**
   * Notify potential validators
   */
  private async notifyValidators(
    organizationId: string, 
    requestId: string, 
    expertise: string[], 
    priority: 'low' | 'medium' | 'high' | 'critical'
  ): Promise<void> {
    try {
      // Find users with required expertise
      // In a real implementation, would query users with specific skills
      const potentialValidators = await db
        .select()
        .from(users)
        .where(eq(users.organizationId, organizationId));

      // Filter by expertise (simplified - would use proper skill matching)
      const validators = potentialValidators.filter(user => 
        user.skills && Array.isArray(user.skills) && 
        expertise.some(skill => 
          user.skills.some((userSkill: any) => 
            userSkill.name && userSkill.name.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );

      // Send notifications to qualified validators
      for (const validator of validators.slice(0, 3)) { // Limit to 3 validators
        await databaseNotificationService.createAndSendNotification({
          organizationId,
          userId: validator.id,
          type: 'validation_request',
          title: `${priority.toUpperCase()} Priority: AI Content Validation Required`,
          message: `Your expertise is needed to validate AI-generated content. Required skills: ${expertise.join(', ')}`,
          priority: priority === 'critical' ? 'critical' : priority === 'high' ? 'high' : 'medium',
          metadata: {
            validationRequestId: requestId,
            requiredExpertise: expertise,
            estimatedTime: '10-15 minutes'
          }
        });
      }

    } catch (error) {
      console.error('❌ Failed to notify validators:', error);
    }
  }

  /**
   * Process validation result
   */
  async processValidationResult(requestId: string, validatorId: string, result: ValidationResult): Promise<void> {
    try {
      // Update validation request
      await db
        .update(humanValidationQueue)
        .set({
          assignedTo: validatorId,
          status: 'completed',
          completedAt: new Date(),
          result: {
            ...result,
            submittedAt: new Date().toISOString()
          }
        })
        .where(eq(humanValidationQueue.id, requestId));

      // Update confidence score based on validation
      const [request] = await db
        .select()
        .from(humanValidationQueue)
        .where(eq(humanValidationQueue.id, requestId));

      if (request) {
        await db
          .update(aiConfidenceScores)
          .set({
            validationStatus: result.result === 'approved' ? 'validated' : 'rejected',
            humanFeedback: result.feedback,
            validatedBy: validatorId,
            validatedAt: new Date(),
            accuracyTracking: {
              humanConfidence: result.confidence,
              feedback: result.feedback,
              timeSpent: result.timeSpent
            }
          })
          .where(
            and(
              eq(aiConfidenceScores.entityId, request.entityId),
              eq(aiConfidenceScores.entityType, request.entityType)
            )
          );
      }

      console.log(`✅ Validation completed for request ${requestId}: ${result.result}`);

    } catch (error) {
      console.error('❌ Failed to process validation result:', error);
      throw error;
    }
  }

  /**
   * Get validation queue for user
   */
  async getValidationQueue(userId: string, organizationId: string): Promise<any[]> {
    try {
      const userSkills = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));

      if (userSkills.length === 0) return [];

      // Get requests that match user's expertise
      const requests = await db
        .select()
        .from(humanValidationQueue)
        .where(
          and(
            eq(humanValidationQueue.organizationId, organizationId),
            eq(humanValidationQueue.status, 'pending')
          )
        )
        .orderBy(desc(humanValidationQueue.priority), desc(humanValidationQueue.createdAt));

      // Filter by expertise match (simplified)
      return requests.slice(0, 10); // Limit to 10 requests

    } catch (error) {
      console.error('❌ Failed to get validation queue:', error);
      return [];
    }
  }

  /**
   * Get AI confidence statistics for organization
   */
  async getConfidenceStatistics(organizationId: string): Promise<{
    averageConfidence: number;
    totalAssessments: number;
    validationRate: number;
    approvalRate: number;
    biasDetectionRate: number;
    topUncertaintyFactors: Array<{ factor: string; frequency: number }>;
  }> {
    try {
      const assessments = await db
        .select()
        .from(aiConfidenceScores)
        .where(eq(aiConfidenceScores.organizationId, organizationId));

      if (assessments.length === 0) {
        return {
          averageConfidence: 0,
          totalAssessments: 0,
          validationRate: 0,
          approvalRate: 0,
          biasDetectionRate: 0,
          topUncertaintyFactors: []
        };
      }

      const totalAssessments = assessments.length;
      const averageConfidence = assessments.reduce((sum, a) => 
        sum + parseFloat(a.confidenceScore || '0'), 0
      ) / totalAssessments;

      const validated = assessments.filter(a => 
        a.validationStatus === 'validated' || a.validationStatus === 'rejected'
      ).length;
      const validationRate = validated / totalAssessments;

      const approved = assessments.filter(a => 
        a.validationStatus === 'validated'
      ).length;
      const approvalRate = validated > 0 ? approved / validated : 0;

      const withBias = assessments.filter(a => {
        const bias = a.biasDetectionResults as any;
        return bias && bias.overall > 0.3;
      }).length;
      const biasDetectionRate = withBias / totalAssessments;

      // Analyze top uncertainty factors
      const factorCounts: Record<string, number> = {};
      assessments.forEach(a => {
        const factors = a.uncertaintyFactors as any[] || [];
        factors.forEach(f => {
          factorCounts[f.factor] = (factorCounts[f.factor] || 0) + 1;
        });
      });

      const topUncertaintyFactors = Object.entries(factorCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([factor, frequency]) => ({ factor, frequency }));

      return {
        averageConfidence: Math.round(averageConfidence * 100) / 100,
        totalAssessments,
        validationRate: Math.round(validationRate * 100) / 100,
        approvalRate: Math.round(approvalRate * 100) / 100,
        biasDetectionRate: Math.round(biasDetectionRate * 100) / 100,
        topUncertaintyFactors
      };

    } catch (error) {
      console.error('❌ Failed to get confidence statistics:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const aiConfidenceService = new AIConfidenceService();