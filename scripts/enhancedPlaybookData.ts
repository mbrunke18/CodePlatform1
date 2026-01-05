/**
 * Enhanced Playbook Data - Rich template information from 80/20 framework
 * Based on user's complete taxonomy document
 */

// Executive Accountability Mapping
export const EXECUTIVE_ACCOUNTABILITY = {
  // Domain-based primary ownership
  1: 'CEO',     // Market Dynamics
  2: 'COO',     // Operational Excellence  
  3: 'CFO',     // Financial Strategy
  4: 'CLO',     // Regulatory & Compliance
  5: 'CTO',     // Technology & Innovation
  6: 'CHRO',    // Talent & Leadership
  7: 'CMO',     // Brand & Reputation
  8: 'CEO',     // Market Opportunities
};

// Activation Frequency Tiers (from document pages 870-905)
export const ACTIVATION_FREQUENCY_TIERS: Record<number, string> = {
  // HIGH FREQUENCY (10+ times/year)
  70: 'HIGH',  // Critical System Outage
  64: 'HIGH',  // Data Breach (Customer Data)
  76: 'HIGH',  // Technology Standards Shift
  81: 'HIGH',  // Key Talent Attrition Spike
  
  // MEDIUM FREQUENCY (3-9 times/year)
  3: 'MEDIUM',   // Competitor Product Launch (Feature Parity)
  19: 'MEDIUM',  // Primary Supplier Failure
  89: 'MEDIUM',  // Negative Investigative Journalism
  44: 'MEDIUM',  // Revenue Shortfall
  31: 'MEDIUM',  // Critical Vendor Service Interruption
  94: 'MEDIUM',  // Viral Customer Complaint
  
  // LOW FREQUENCY (1-2 times/year)
  4: 'LOW',    // Competitor Product Launch (Breakthrough)
  35: 'LOW',   // Cash Flow Crisis
  59: 'LOW',   // Class Action Lawsuit Filed
  95: 'LOW',   // Product Recall
  49: 'LOW',   // SEC Investigation Notice
  60: 'LOW',   // Intellectual Property Litigation
  
  // RARE (Once every 2-5 years)
  77: 'RARE',  // CEO Sudden Departure
  42: 'RARE',  // Hostile Takeover Attempt
  50: 'RARE',  // DOJ/Criminal Investigation
  29: 'RARE',  // Natural Disaster (Facility Impact)
  41: 'RARE',  // Activist Investor Campaign
  78: 'RARE',  // Executive Team Member Departure
  
  // VERY_RARE (Once every 5+ years, but must be prepared)
  65: 'VERY_RARE',  // Ransomware Attack
  88: 'VERY_RARE',  // Diversity & Inclusion Crisis
  23: 'VERY_RARE',  // Quality Defect Discovery (Post-Ship)
  99: 'VERY_RARE',  // Short Seller Report
  50: 'VERY_RARE',  // DOJ/Criminal Investigation
  92: 'VERY_RARE',  // Executive Personal Scandal
};

// Default tier based on severity/domain if not explicitly listed
export function getActivationTier(playbookNumber: number, domainId: number): string {
  if (ACTIVATION_FREQUENCY_TIERS[playbookNumber]) {
    return ACTIVATION_FREQUENCY_TIERS[playbookNumber];
  }
  
  // Defaults based on domain
  if (domainId === 2 || domainId === 5) return 'MEDIUM'; // Operational/Tech issues more common
  if (domainId === 4 || domainId === 8) return 'RARE';   // Legal/Market disruptions less frequent
  return 'LOW'; // Most strategic playbooks are LOW frequency
}

// Severity Scores (0-100) - Higher = More Critical
export function getSeverityScore(playbookNumber: number, domainId: number): number {
  // Critical scenarios (90-100)
  const critical = [42, 50, 64, 65, 77, 88, 99];
  if (critical.includes(playbookNumber)) return 85 + Math.floor(Math.random() * 15);
  
  // High severity (70-89)
  const highSeverity = [4, 29, 35, 40, 41, 49, 59, 70, 95];
  if (highSeverity.includes(playbookNumber)) return 70 + Math.floor(Math.random() * 19);
  
  // Medium severity (50-69)
  const mediumSeverity = [3, 19, 31, 44, 60, 78, 89, 94];
  if (mediumSeverity.includes(playbookNumber)) return 50 + Math.floor(Math.random() * 19);
  
  // Lower severity based on domain (30-49)
  if (domainId === 1) return 45 + Math.floor(Math.random() * 20); // Competitive threats
  if (domainId === 7) return 40 + Math.floor(Math.random() * 20); // Reputation
  return 35 + Math.floor(Math.random() * 30);
}

// Time Sensitivity (response window in hours)
export function getTimeSensitivity(playbookNumber: number, severityScore: number): number {
  // Immediate response needed (<4 hours)
  const immediate = [64, 65, 70, 27, 28];
  if (immediate.includes(playbookNumber)) return 2 + Math.floor(Math.random() * 2);
  
  // Urgent (4-12 hours)
  if (severityScore >= 80) return 8 + Math.floor(Math.random() * 4);
  
  // Standard (12-24 hours)
  if (severityScore >= 60) return 12 + Math.floor(Math.random() * 12);
  
  // Moderate (24-48 hours)
  return 24 + Math.floor(Math.random() * 24);
}

// Stakeholder Tier Counts
export function getTierCounts(domainId: number, severityScore: number) {
  // Tier 1: Decision makers (8-12 people)
  let tier1 = 8;
  if (severityScore >= 80) tier1 = 10 + Math.floor(Math.random() * 3);
  else if (severityScore >= 60) tier1 = 8 + Math.floor(Math.random() * 3);
  
  // Tier 2: Execution team (30-50 people)
  let tier2 = 30;
  if (domainId === 2 || domainId === 5) tier2 = 40 + Math.floor(Math.random() * 11); // Ops/Tech need more
  else tier2 = 30 + Math.floor(Math.random() * 11);
  
  // Tier 3: Notification group (100-200 people)
  let tier3 = 100;
  if (severityScore >= 80) tier3 = 150 + Math.floor(Math.random() * 51);
  else tier3 = 100 + Math.floor(Math.random() * 51);
  
  return { tier1, tier2, tier3 };
}

// Vendor Contracts - Pre-negotiated hourly rates
export const STANDARD_VENDOR_CONTRACTS = [
  { vendor: 'Crisis Management PR Firm', hourlyRate: 500, specialty: 'Media Relations', onRetainer: true },
  { vendor: 'External Legal Counsel', hourlyRate: 800, specialty: 'Crisis Legal', onRetainer: true },
  { vendor: 'Strategy Consulting Firm', hourlyRate: 600, specialty: 'Strategic Response', onRetainer: false },
  { vendor: 'Cybersecurity Forensics', hourlyRate: 450, specialty: 'Incident Response', onRetainer: true },
  { vendor: 'Executive Search Firm', hourlyRate: 350, specialty: 'Leadership Transition', onRetainer: false },
];

// External Resource Roster - Firms on retainer
export const STANDARD_RESOURCE_ROSTER = [
  { name: 'Morrison & Foerster LLP', type: 'Legal', specialty: 'Corporate Crisis', contact: '24/7 Hotline' },
  { name: 'Edelman Communications', type: 'PR', specialty: 'Crisis Communications', contact: '24/7 War Room' },
  { name: 'CrowdStrike Services', type: 'Cybersecurity', specialty: 'Incident Response', contact: 'Dedicated Team' },
  { name: 'McKinsey Crisis Response', type: 'Strategy', specialty: 'Strategic Advisory', contact: 'Partner Direct' },
  { name: 'Korn Ferry', type: 'Executive Search', specialty: 'C-Suite Transition', contact: 'Account Manager' },
];

// Success Metrics Templates
export function getSuccessMetrics(domainId: number) {
  const baseMetrics = {
    responseSpeed: { target: 12, unit: 'minutes', description: 'Time to coordinate Tier 1 stakeholders' },
    stakeholderReach: { target: 1.00, unit: 'percentage', description: 'Tier 1 participation rate' },
  };
  
  // Domain-specific outcome metrics
  const domainMetrics: Record<number, any[]> = {
    1: [
      { metric: 'Market Share Retention', target: '≥95%', timeframe: '90 days post-crisis' },
      { metric: 'Customer Churn Rate', target: '<5%', timeframe: '30 days' },
    ],
    2: [
      { metric: 'Operations Restoration', target: '<24 hours', timeframe: 'To full capacity' },
      { metric: 'Supply Chain Continuity', target: '100%', timeframe: 'No customer impact' },
    ],
    3: [
      { metric: 'Cash Runway Preservation', target: '≥6 months', timeframe: 'Sustained' },
      { metric: 'Investor Confidence', target: 'No rating downgrade', timeframe: 'Post-announcement' },
    ],
    4: [
      { metric: 'Regulatory Compliance', target: '100%', timeframe: 'No penalties' },
      { metric: 'Legal Exposure Mitigation', target: '<$X estimated', timeframe: 'Final settlement' },
    ],
    5: [
      { metric: 'System Uptime', target: '99.9%', timeframe: 'Post-incident' },
      { metric: 'Data Integrity', target: '100%', timeframe: 'No loss' },
    ],
    6: [
      { metric: 'Employee Retention', target: '≥90%', timeframe: '6 months post-crisis' },
      { metric: 'Culture Survey Score', target: '≥75%', timeframe: 'Next survey' },
    ],
    7: [
      { metric: 'Brand Sentiment', target: 'Return to baseline', timeframe: '90 days' },
      { metric: 'Media Coverage Ratio', target: '≥2:1 positive', timeframe: 'Post-response' },
    ],
    8: [
      { metric: 'Strategic Positioning', target: 'Market leadership maintained', timeframe: 'Post-disruption' },
      { metric: 'Competitive Advantage', target: 'Preserved or enhanced', timeframe: '6 months' },
    ],
  };
  
  return {
    ...baseMetrics,
    outcomeMetrics: domainMetrics[domainId] || domainMetrics[1],
  };
}

// Learning Metrics - What to measure for improvement
export const STANDARD_LEARNING_METRICS = [
  { metric: 'Drill Performance Trend', description: 'Track improvement across successive drills', target: '+10% per quarter' },
  { metric: 'Bottleneck Elimination', description: 'Number of identified bottlenecks resolved', target: '100% resolution' },
  { metric: 'Template Completeness', description: 'Percentage of pre-filled sections validated', target: '≥95%' },
  { metric: 'Stakeholder Feedback', description: 'Post-execution survey score', target: '≥4.0/5.0' },
];
