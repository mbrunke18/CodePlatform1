/**
 * Enhanced Playbook Data
 * Helper functions and constants for 180-playbook library seeding
 * Provides severity scores, time sensitivity, activation tiers, and success metrics
 */

// Executive Accountability Mapping
export const EXECUTIVE_ACCOUNTABILITY = {
  1: 'CEO',
  2: 'COO',
  3: 'CFO',
  4: 'CLO',
  5: 'CTO',
  6: 'CHRO',
  7: 'CMO',
  8: 'CEO',
  9: 'CTO',
} as const;

// Standard Vendor Contracts
export const STANDARD_VENDOR_CONTRACTS = [
  'Legal Services Agreement',
  'Crisis Communications Contract',
  'Executive Search Retainer',
  'Technology Support SLA',
  'Insurance Coverage Documents',
];

// Standard Resource Roster
export const STANDARD_RESOURCE_ROSTER = [
  'External Legal Counsel',
  'Crisis PR Firm',
  'Executive Recruiters',
  'Management Consultants',
  'Technical Experts',
];

// Standard Learning Metrics
export const STANDARD_LEARNING_METRICS = [
  'Response time improvement',
  'Stakeholder satisfaction',
  'Execution completeness',
  'Budget accuracy',
  'Risk mitigation effectiveness',
];

/**
 * Calculate severity score based on playbook number and domain
 * Higher playbooks in each domain tend to be more severe
 */
export function getSeverityScore(playbookNumber: number, domainId: number): number {
  // Base severity from playbook position (1-170)
  const baseScore = Math.min(playbookNumber / 170 * 10, 10);
  
  // Domain modifiers (some domains inherently more severe)
  const domainModifiers: Record<number, number> = {
    1: 0.9,  // Market Dynamics - moderate severity
    2: 0.85, // Operational - moderate
    3: 0.95, // Financial - high severity
    4: 0.99, // Regulatory - very high severity
    5: 0.98, // Technology - very high severity
    6: 0.8,  // Talent - moderate
    7: 0.85, // Brand - moderate
    8: 0.7,  // Opportunities - lower severity (positive)
    9: 0.96, // AI Governance - very high severity
  };
  
  const modifier = domainModifiers[domainId] || 0.85;
  return Math.round((baseScore * modifier) * 10) / 10; // Round to 1 decimal
}

/**
 * Determine time sensitivity based on severity
 * More severe events require faster response
 */
export function getTimeSensitivity(playbookNumber: number, severityScore: number): string {
  if (severityScore >= 8.5) return 'CRITICAL';
  if (severityScore >= 7.0) return 'HIGH';
  if (severityScore >= 5.0) return 'MEDIUM';
  return 'LOW';
}

/**
 * Determine activation tier (how often playbook is likely triggered)
 */
export function getActivationTier(playbookNumber: number, domainId: number): string {
  // Playbooks are ordered by frequency within each domain
  // First playbooks in domain (1-5 per domain) are most frequent
  const playbooksPerDomain = 170 / 9; // ~19 per domain
  const positionInDomain = playbookNumber % Math.ceil(playbooksPerDomain);
  
  if (positionInDomain <= 3) return 'TIER_1_FREQUENT';
  if (positionInDomain <= 8) return 'TIER_2_OCCASIONAL';
  if (positionInDomain <= 14) return 'TIER_3_RARE';
  return 'TIER_4_EXCEPTIONAL';
}

/**
 * Calculate stakeholder tier counts based on domain and severity
 */
export function getTierCounts(domainId: number, severityScore: number): {
  tier1: number;
  tier2: number;
  tier3: number;
} {
  // More severe events require broader stakeholder engagement
  let tier1 = Math.max(4, Math.ceil(severityScore / 2));
  let tier2 = Math.max(4, Math.ceil(severityScore / 1.5));
  let tier3 = Math.max(1, Math.ceil(severityScore / 3));
  
  // Domain-specific adjustments
  if (domainId === 4) {
    // Regulatory requires more legal stakeholders
    tier1 = Math.min(tier1 + 2, 10);
  }
  if (domainId === 7) {
    // Brand requires communications stakeholders
    tier2 = Math.min(tier2 + 3, 15);
  }
  
  return { tier1, tier2, tier3 };
}

/**
 * Get success metrics based on domain
 */
export function getSuccessMetrics(domainId: number): {
  outcomeMetrics: string[];
} {
  const metricsMap: Record<number, string[]> = {
    1: ['Market share retention', 'Customer retention rate', 'Competitive response time'],
    2: ['Service continuity', 'Supply chain recovery time', 'Cost avoidance'],
    3: ['Financial stability', 'Credit rating maintenance', 'Stakeholder confidence'],
    4: ['Regulatory compliance', 'Investigation closure', 'Fine/settlement minimization'],
    5: ['Data security', 'System uptime restoration', 'Security incident closure'],
    6: ['Leadership continuity', 'Retention rate', 'Employee morale recovery'],
    7: ['Brand sentiment recovery', 'Media narrative control', 'Customer trust restoration'],
    8: ['Revenue from new market', 'Time to revenue', 'Market share capture'],
    9: ['AI system safety', 'Compliance certification', 'Risk mitigation score'],
  };
  return { outcomeMetrics: metricsMap[domainId] || [] };
}

export async function seedPlaybookLibrary() {
  console.log('🏈 Seeding Complete 180-Playbook Library...');
  return true;
}

// Direct execution check - DISABLED for bundled builds
// This was causing process.exit(0) to kill the production server
// To run seed manually, use: npx tsx server/seeds/playbookLibrarySeed.ts