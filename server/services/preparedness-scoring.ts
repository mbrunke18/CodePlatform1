import { db } from "../db";
import { playbookLibrary, playbookCustomizations, playbookActivations } from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";

/**
 * Preparedness Scoring Service
 * Computes dynamic playbook readiness metrics for the data-driven sidebar
 */

export interface PlaybookInsights {
  // Overall Readiness
  preparednessScore: number; // 0-100
  readinessStatus: 'not_started' | 'in_progress' | 'ready'; // Based on score
  
  // Section Completion
  sectionCompletion: {
    situation: boolean;
    stakeholders: boolean;
    decisionTrees: boolean;
    communication: boolean;
    taskSequences: boolean;
    budget: boolean;
    successMetrics: boolean;
    lessonsLearned: boolean;
  };
  
  // Severity & Time Sensitivity
  severityScore: number; // 0-100
  timeSensitivity: number; // Hours
  activationFrequencyTier: string;
  
  // Stakeholder Readiness
  stakeholderReadiness: {
    tier1Count: number;
    tier2Count: number;
    tier3Count: number;
    externalPartners: number;
    totalStakeholders: number;
  };
  
  // Budget Readiness
  budgetReadiness: {
    preApprovedBudget: number;
    budgetApprovalRequired: boolean;
    vendorContractsCount: number;
    externalResourcesCount: number;
  };
  
  // Trigger Monitoring
  triggerStatus: {
    monitoringActive: boolean;
    lastMonitoredAt: string | null;
    aiConfidence: number; // 0-100
    triggerCriteria: string;
  };
  
  // Activation History
  activationHistory: {
    totalActivations: number;
    lastActivationDate: string | null;
    averageResponseTime: number | null; // Minutes
    successRate: number; // 0-1
  };
  
  // Learning & Improvement
  learningMetrics: {
    lessonsCount: number;
    lastLessonDate: string | null;
    improvementTrend: 'improving' | 'stable' | 'declining' | 'unknown';
  };
}

/**
 * Calculate preparedness score based on section completion
 */
function calculatePreparednessScore(customization: any, playbook: any): number {
  if (!customization) {
    // No customization record = base template only = 80% (the pre-filled portion)
    return 80;
  }
  
  // Each section worth 12.5% (100 / 8 sections)
  let score = 0;
  
  if (customization.situationCompleted || playbook.triggerCriteria) score += 12.5;
  if (customization.stakeholdersCompleted || (playbook.tier1Stakeholders && playbook.tier1Stakeholders.length > 0)) score += 12.5;
  if (customization.decisionTreesCompleted) score += 12.5;
  if (customization.communicationCompleted) score += 12.5;
  if (customization.taskSequencesCompleted) score += 12.5;
  if (customization.budgetCompleted || playbook.preApprovedBudget) score += 12.5;
  if (customization.successMetricsCompleted || playbook.targetResponseSpeed) score += 12.5;
  if (customization.lessonsLearnedCompleted) score += 12.5;
  
  return Math.round(score);
}

/**
 * Get comprehensive playbook insights for a given playbook
 */
export async function getPlaybookInsights(playbookId: string): Promise<PlaybookInsights> {
  // Fetch playbook
  const [playbook] = await db
    .select()
    .from(playbookLibrary)
    .where(eq(playbookLibrary.id, playbookId))
    .limit(1);
  
  if (!playbook) {
    throw new Error(`Playbook ${playbookId} not found`);
  }
  
  // Fetch customization record (if exists)
  const [customization] = await db
    .select()
    .from(playbookCustomizations)
    .where(eq(playbookCustomizations.playbookId, playbookId))
    .limit(1);
  
  // Fetch activation history
  const activations = await db
    .select()
    .from(playbookActivations)
    .where(eq(playbookActivations.playbookId, playbookId))
    .orderBy(desc(playbookActivations.activatedAt))
    .limit(10);
  
  // Calculate preparedness score
  const preparednessScore = calculatePreparednessScore(customization, playbook);
  
  // Determine readiness status
  let readinessStatus: 'not_started' | 'in_progress' | 'ready' = 'not_started';
  if (preparednessScore >= 95) readinessStatus = 'ready';
  else if (preparednessScore >= 60) readinessStatus = 'in_progress';
  
  // Section completion tracking
  const sectionCompletion = {
    situation: customization?.situationCompleted || !!playbook.triggerCriteria,
    stakeholders: customization?.stakeholdersCompleted || (Array.isArray(playbook.tier1Stakeholders) && playbook.tier1Stakeholders.length > 0),
    decisionTrees: customization?.decisionTreesCompleted || false,
    communication: customization?.communicationCompleted || false,
    taskSequences: customization?.taskSequencesCompleted || false,
    budget: customization?.budgetCompleted || !!playbook.preApprovedBudget,
    successMetrics: customization?.successMetricsCompleted || !!playbook.targetResponseSpeed,
    lessonsLearned: customization?.lessonsLearnedCompleted || false,
  };
  
  // Stakeholder readiness
  const stakeholderReadiness = {
    tier1Count: playbook.tier1Count || 0,
    tier2Count: playbook.tier2Count || 0,
    tier3Count: playbook.tier3Count || 0,
    externalPartners: Array.isArray(playbook.externalPartners) ? playbook.externalPartners.length : 0,
    totalStakeholders: (playbook.tier1Count || 0) + (playbook.tier2Count || 0) + (playbook.tier3Count || 0),
  };
  
  // Budget readiness
  const budgetReadiness = {
    preApprovedBudget: parseFloat(playbook.preApprovedBudget || '0'),
    budgetApprovalRequired: playbook.budgetApprovalRequired || false,
    vendorContractsCount: Array.isArray(playbook.vendorContracts) ? playbook.vendorContracts.length : 0,
    externalResourcesCount: Array.isArray(playbook.externalResourceRoster) ? playbook.externalResourceRoster.length : 0,
  };
  
  // Trigger monitoring (simulated for MVP)
  const triggerStatus = {
    monitoringActive: true, // All playbooks monitored by default
    lastMonitoredAt: new Date().toISOString(), // Current time for MVP
    aiConfidence: Math.floor(Math.random() * 30) + 70, // 70-100 for MVP
    triggerCriteria: playbook.triggerCriteria || 'No trigger criteria defined',
  };
  
  // Activation history
  const totalActivations = activations.length;
  const lastActivation = activations[0];
  const successfulActivations = activations.filter(a => a.targetMet === true).length;
  
  const activationHistory = {
    totalActivations,
    lastActivationDate: lastActivation?.activatedAt?.toISOString() || null,
    averageResponseTime: lastActivation?.actualExecutionTime || playbook.targetExecutionTime || 12,
    successRate: totalActivations > 0 ? successfulActivations / totalActivations : parseFloat(playbook.historicalSuccessRate || '0'),
  };
  
  // Learning metrics (simplified for MVP)
  const learningMetrics = {
    lessonsCount: activations.filter(a => a.lessonsLearned).length,
    lastLessonDate: activations.find(a => a.lessonsLearned)?.completedAt?.toISOString() || null,
    improvementTrend: 'stable' as const, // MVP default
  };
  
  return {
    preparednessScore,
    readinessStatus,
    sectionCompletion,
    severityScore: playbook.severityScore || 0,
    timeSensitivity: playbook.timeSensitivity || 24,
    activationFrequencyTier: playbook.activationFrequencyTier || 'MEDIUM',
    stakeholderReadiness,
    budgetReadiness,
    triggerStatus,
    activationHistory,
    learningMetrics,
  };
}
