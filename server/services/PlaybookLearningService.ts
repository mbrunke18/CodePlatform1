import { db } from '../db';
import { playbookLibrary } from '@shared/schema';
import { eq } from 'drizzle-orm';
import pino from 'pino';

const log = pino({ name: 'learning-service' });

interface ExecutionMetrics {
  organizationId?: string;
  playbookId: string;
  executionType?: 'drill' | 'activation';
  executionId?: string;
  success?: boolean;
  timeToActivate?: number;
  stakeholderResponseRate?: number;
  taskCompletionRate?: number;
  budget?: number;
  budgetUtilized?: number;
}

/**
 * Analyze playbook execution for learning
 */
export async function analyzeExecution(metrics: ExecutionMetrics): Promise<any> {
  try {
    log.info({ metrics }, 'Analyzing execution for learning opportunities');
    
    const playbook = await db.select().from(playbookLibrary)
      .where(eq(playbookLibrary.id, metrics.playbookId))
      .limit(1);
    
    if (!playbook.length) {
      throw new Error('Playbook not found');
    }
    
    const pb = playbook[0];
    
    // Calculate learning insights
    const insights = {
      organizationId: metrics.organizationId,
      playbookId: metrics.playbookId,
      executionType: metrics.executionType,
      executionId: metrics.executionId,
      executionSuccess: metrics.success !== false,
      performanceScore: calculatePerformance(metrics),
      recommendations: generateRecommendations(metrics, pb),
      nextOptimization: selectNextOptimization(metrics),
      readinessForNextExecution: estimateReadiness(metrics)
    };
    
    log.info({ insights }, '✅ Learning analysis complete');
    return insights;
  } catch (error) {
    log.error({ error }, 'Error analyzing execution');
    throw error;
  }
}

/**
 * Calculate performance score (0-100)
 */
function calculatePerformance(metrics: ExecutionMetrics): number {
  const timeToActivate = metrics.timeToActivate ?? 12;
  const stakeholderResponseRate = metrics.stakeholderResponseRate ?? 0;
  const taskCompletionRate = metrics.taskCompletionRate ?? 0;
  const budgetUtilized = metrics.budgetUtilized ?? 0;
  const budget = metrics.budget ?? 1;

  const components = {
    speed: Math.min(100, (12 / timeToActivate) * 100),
    stakeholders: stakeholderResponseRate,
    tasks: taskCompletionRate,
    budget: Math.max(0, 100 - (budgetUtilized / budget) * 50)
  };
  
  return Math.round((components.speed + components.stakeholders + components.tasks + components.budget) / 4);
}

/**
 * Generate AI-powered recommendations
 */
function generateRecommendations(metrics: ExecutionMetrics, playbook: any): string[] {
  const recs: string[] = [];
  const timeToActivate = metrics.timeToActivate ?? 12;
  const stakeholderResponseRate = metrics.stakeholderResponseRate ?? 0;
  const taskCompletionRate = metrics.taskCompletionRate ?? 0;
  const budgetUtilized = metrics.budgetUtilized ?? 0;
  
  if (timeToActivate > 8) {
    recs.push('🚀 Reduce activation time by pre-staging stakeholders');
  }
  
  if (stakeholderResponseRate < 80) {
    recs.push('👥 Improve stakeholder clarity - consider additional briefing materials');
  }
  
  if (taskCompletionRate < 90) {
    recs.push('✓ Review task sequencing - some tasks may be dependent');
  }
  
  if (budgetUtilized > 80) {
    recs.push('💰 Consider budget increase or task prioritization');
  }
  
  if (metrics.success && taskCompletionRate > 95) {
    recs.push('⭐ Playbook is highly optimized - consider using as template');
  }
  
  return recs;
}

/**
 * Recommend next optimization area
 */
function selectNextOptimization(metrics: ExecutionMetrics): string {
  const timeToActivate = metrics.timeToActivate ?? 12;
  const stakeholderResponseRate = metrics.stakeholderResponseRate ?? 0;
  const taskCompletionRate = metrics.taskCompletionRate ?? 0;
  const budgetUtilized = metrics.budgetUtilized ?? 0;

  if (timeToActivate > 8) return 'activation_speed';
  if (stakeholderResponseRate < 80) return 'stakeholder_clarity';
  if (taskCompletionRate < 90) return 'task_sequencing';
  if (budgetUtilized > 80) return 'budget_efficiency';
  return 'scaling';
}

/**
 * Estimate readiness for next execution
 */
function estimateReadiness(metrics: ExecutionMetrics): number {
  if (!metrics.success) return 0;
  
  const stakeholderResponseRate = metrics.stakeholderResponseRate ?? 0;
  const taskCompletionRate = metrics.taskCompletionRate ?? 0;
  const timeToActivate = metrics.timeToActivate ?? 12;

  const readiness = (
    (stakeholderResponseRate / 100) * 40 +
    (taskCompletionRate / 100) * 40 +
    Math.min(1, (12 / timeToActivate)) * 20
  );
  
  return Math.round(Math.min(100, readiness));
}

export const playbookLearningService = { analyzeExecution };
export default { analyzeExecution };
