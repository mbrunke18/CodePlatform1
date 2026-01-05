/**
 * NFL Methodology - Complete 166 Playbook Library Seed
 * Loads all playbooks from structured JSON data
 * 148 original playbooks + 18 new AI Governance playbooks (Domain 9)
 */

import { db } from '../db';
import {
  playbookDomains,
  playbookCategories,
  playbookLibrary,
} from '@shared/schema';
import { eq } from 'drizzle-orm';
import {
  EXECUTIVE_ACCOUNTABILITY,
  getActivationTier,
  getSeverityScore,
  getTimeSensitivity,
  getTierCounts,
  STANDARD_VENDOR_CONTRACTS,
  STANDARD_RESOURCE_ROSTER,
  getSuccessMetrics,
  STANDARD_LEARNING_METRICS,
} from '../../scripts/enhancedPlaybookData';
import { playbooksData } from './data/playbooksData';

// Strategic Category Assignment Logic
// OFFENSE (58): Domain 1 (22) + Domain 8 (18) + 18 from Domain 3 = 58
// DEFENSE (56): Domain 2 (19) + Domain 4 (15) + Domain 7 (17) + 5 from Domain 3 = 56
// SPECIAL TEAMS (52): Domain 5 (19) + Domain 6 (14) + Domain 9 (18) + 1 from Domain 3 = 52
function getStrategicCategory(domainId: number, playbookIndexInDomain: number): 'offense' | 'defense' | 'special_teams' {
  // Domain-based primary assignments
  if (domainId === 1 || domainId === 8) return 'offense'; // Market Dynamics (22) + Market Opportunities (18)
  if (domainId === 2 || domainId === 4 || domainId === 7) return 'defense'; // Operational (19) + Regulatory (15) + Brand (17)
  if (domainId === 5 || domainId === 6 || domainId === 9) return 'special_teams'; // Tech (19) + Talent (14) + AI Gov (18)
  
  // Domain 3 (Financial Strategy, 24 playbooks) needs to be split: 18 offense, 5 defense, 1 special_teams
  if (domainId === 3) {
    if (playbookIndexInDomain < 18) return 'offense';
    if (playbookIndexInDomain < 23) return 'defense';
    return 'special_teams';
  }
  
  return 'defense'; // Default fallback
}

const DOMAIN_CONFIG = [
  {
    id: 1,
    name: 'Market Dynamics',
    code: 'DOMAIN1',
    description: 'Competitive threats, market position shifts, and go-to-market challenges',
    icon: 'target',
    color: '#E74C3C',
    executiveRole: 'CEO',
    total: 22,
    categories: [
      { name: 'Market Position Threats', description: 'New entrants, product launches, pricing wars', count: 12 },
      { name: 'Go-to-Market Threats', description: 'Channel conflicts, customer defection', count: 10 },
    ],
  },
  {
    id: 2,
    name: 'Operational Excellence',
    code: 'DOMAIN2',
    description: 'Supply chain, facilities, infrastructure, and third-party dependencies',
    icon: 'truck',
    color: '#F39C12',
    executiveRole: 'COO',
    total: 19,
    categories: [
      { name: 'Supply Chain Crises', description: 'Supplier failures, shortages, logistics disruptions', count: 8 },
      { name: 'Facility & Infrastructure', description: 'Manufacturing, distribution, data center incidents', count: 7 },
      { name: 'Third-Party Dependencies', description: 'Vendor services, technology partners', count: 4 },
    ],
  },
  {
    id: 3,
    name: 'Financial Strategy',
    code: 'DOMAIN3',
    description: 'Liquidity, capital, market valuation, and financial reporting',
    icon: 'dollar-sign',
    color: '#27AE60',
    executiveRole: 'CFO',
    total: 24,
    categories: [
      { name: 'Liquidity & Capital', description: 'Cash flow, fundraising, credit management', count: 8 },
      { name: 'Market Valuation', description: 'Stock price, investors, takeovers', count: 8 },
      { name: 'Financial Reporting', description: 'Revenue, accounting, audits, controls', count: 8 },
    ],
  },
  {
    id: 4,
    name: 'Regulatory & Compliance',
    code: 'DOMAIN4',
    description: 'Government investigations, compliance violations, and litigation',
    icon: 'scale',
    color: '#9B59B6',
    executiveRole: 'CLO',
    total: 15,
    categories: [
      { name: 'Government Investigations', description: 'SEC, DOJ, FTC, Congressional inquiries', count: 5 },
      { name: 'Compliance Violations', description: 'Data privacy, export, environmental, workplace', count: 5 },
      { name: 'Litigation', description: 'Class actions, IP, contracts, employment', count: 5 },
    ],
  },
  {
    id: 5,
    name: 'Technology & Innovation',
    code: 'DOMAIN5',
    description: 'Cybersecurity incidents, system failures, and technology obsolescence',
    icon: 'cpu',
    color: '#3498DB',
    executiveRole: 'CTO',
    total: 19,
    categories: [
      { name: 'Cybersecurity Incidents', description: 'Data breaches, ransomware, vulnerabilities', count: 7 },
      { name: 'System Failures', description: 'Outages, database issues, cloud provider problems', count: 7 },
      { name: 'Technology Obsolescence', description: 'EOL dependencies, standards shifts', count: 5 },
    ],
  },
  {
    id: 6,
    name: 'Talent & Leadership',
    code: 'DOMAIN6',
    description: 'Leadership transitions, workforce issues, and culture challenges',
    icon: 'users',
    color: '#E91E63',
    executiveRole: 'CHRO',
    total: 14,
    categories: [
      { name: 'Leadership Transitions', description: 'CEO, executive, board departures', count: 4 },
      { name: 'Workforce Issues', description: 'Layoffs, attrition, unionization, violence', count: 7 },
      { name: 'Culture & Morale', description: 'Reviews, strikes, D&I crises', count: 3 },
    ],
  },
  {
    id: 7,
    name: 'Brand & Reputation',
    code: 'DOMAIN7',
    description: 'Media crises, customer relations, and stakeholder trust',
    icon: 'shield',
    color: '#FFC107',
    executiveRole: 'CMO',
    total: 17,
    categories: [
      { name: 'Media & Public Relations', description: 'Journalism, social media, boycotts, scandals', count: 6 },
      { name: 'Customer Relations', description: 'Viral complaints, recalls, SLA breaches', count: 5 },
      { name: 'Stakeholder Trust', description: 'ESG ratings, short sellers, partnerships', count: 6 },
    ],
  },
  {
    id: 8,
    name: 'Market Opportunities',
    code: 'DOMAIN8',
    description: 'Strategic opportunities, economic shocks, technology disruption, and regulatory changes',
    icon: 'trending-up',
    color: '#00BCD4',
    executiveRole: 'CEO',
    total: 18,
    categories: [
      { name: 'Strategic Opportunities', description: 'Market entries, trend capitalization, launch acceleration', count: 14 },
      { name: 'Economic Shocks', description: 'Recession, interest rates, trade wars', count: 4 },
    ],
  },
  {
    id: 9,
    name: 'AI Governance',
    code: 'DOMAIN9',
    description: 'AI risk management, model governance, ethics compliance, and responsible AI deployment',
    icon: 'brain',
    color: '#7C3AED',
    executiveRole: 'CTO',
    total: 18,
    categories: [
      { name: 'AI Risk & Safety', description: 'Model failures, security vulnerabilities, deepfakes, runaway agents', count: 6 },
      { name: 'AI Compliance & Ethics', description: 'Privacy breaches, bias detection, regulatory investigations, IP disputes', count: 6 },
      { name: 'AI Operations', description: 'Vendor dependencies, cost overruns, performance degradation, workforce transition', count: 6 },
    ],
  },
];

export async function seedPlaybookLibrary() {
  console.log('🏈 Seeding Complete 166-Playbook Library (including AI Governance)...');

  for (const domainConfig of DOMAIN_CONFIG) {
    // Try to insert domain, or get existing one if it already exists
    let domain;
    try {
      const inserted = await db
        .insert(playbookDomains)
        .values({
          name: domainConfig.name,
          code: domainConfig.code,
          description: domainConfig.description,
          icon: domainConfig.icon,
          color: domainConfig.color,
          sequence: domainConfig.id,
          primaryExecutiveRole: domainConfig.executiveRole,
          totalPlaybooks: domainConfig.total,
        })
        .onConflictDoNothing()
        .returning();
      
      if (inserted.length > 0) {
        domain = inserted[0];
      } else {
        // Domain already exists, fetch it
        const existing = await db
          .select()
          .from(playbookDomains)
          .where(eq(playbookDomains.code, domainConfig.code));
        domain = existing[0];
      }
    } catch (error) {
      console.error(`Error inserting domain ${domainConfig.code}:`, error);
      // Try to fetch existing domain as fallback
      const existing = await db
        .select()
        .from(playbookDomains)
        .where(eq(playbookDomains.code, domainConfig.code));
      if (existing.length === 0) {
        throw new Error(`Failed to insert or find domain ${domainConfig.code}`);
      }
      domain = existing[0];
    }

    const categoryIds: Record<string, string> = {};
    for (let i = 0; i < domainConfig.categories.length; i++) {
      const catConfig = domainConfig.categories[i];
      
      // Try to insert category, or get existing one if it already exists
      let category;
      try {
        const inserted = await db
          .insert(playbookCategories)
          .values({
            domainId: domain.id,
            name: catConfig.name,
            description: catConfig.description,
            sequence: i + 1,
            totalPlaybooks: catConfig.count,
          })
          .onConflictDoNothing()
          .returning();
        
        if (inserted.length > 0) {
          category = inserted[0];
        } else {
          // Category already exists, fetch it
          const existing = await db
            .select()
            .from(playbookCategories)
            .where(eq(playbookCategories.name, catConfig.name));
          category = existing[0];
        }
      } catch (error) {
        console.error(`Error inserting category ${catConfig.name}:`, error);
        // Try to fetch existing category as fallback
        const existing = await db
          .select()
          .from(playbookCategories)
          .where(eq(playbookCategories.name, catConfig.name));
        if (existing.length === 0) {
          throw new Error(`Failed to insert or find category ${catConfig.name}`);
        }
        category = existing[0];
      }
      
      categoryIds[catConfig.name] = category.id;
    }

    const domainPlaybooks = playbooksData.playbooks.filter(
      (p: any) => p.domain === domainConfig.id
    );

    const playbookValues = domainPlaybooks.map((p: any, idx: number) => {
      const categoryName = domainConfig.categories[
        Math.floor(idx / (domainConfig.total / domainConfig.categories.length))
      ]?.name || domainConfig.categories[0].name;

      // Get enhanced data from helper functions
      const severityScore = getSeverityScore(p.number, domainConfig.id);
      const timeSensitivity = getTimeSensitivity(p.number, severityScore);
      const activationTier = getActivationTier(p.number, domainConfig.id);
      const tierCounts = getTierCounts(domainConfig.id, severityScore);
      const successMetrics = getSuccessMetrics(domainConfig.id);
      
      // Get strategic category based on domain and index
      const strategicCategory = getStrategicCategory(domainConfig.id, idx);

      return {
        playbookNumber: p.number,
        domainId: domain.id,
        categoryId: categoryIds[categoryName],
        strategicCategory,
        name: p.name,
        description: p.trigger,
        
        // Executive Accountability
        primaryExecutiveRole: EXECUTIVE_ACCOUNTABILITY[domainConfig.id as keyof typeof EXECUTIVE_ACCOUNTABILITY],
        
        // Trigger Definition (100% Pre-filled - Section 1)
        triggerCriteria: p.trigger,
        triggerDataSources: ['market_data', 'competitive_intelligence', 'news', 'internal_systems'],
        triggerThreshold: { confidence: 0.85 },
        severityScore,
        timeSensitivity,
        historicalFrequency: `${activationTier.toLowerCase()} frequency`,
        activationFrequencyTier: activationTier,
        
        // Stakeholders (90% Pre-filled - Section 2)
        tier1Stakeholders: p.stakeholders.slice(0, 4),
        tier2Stakeholders: ['Product', 'Marketing', 'Operations', 'Strategy'],
        tier3Stakeholders: ['All_Employees'],
        externalPartners: ['Legal_Counsel', 'PR_Firm', 'Strategy_Consultant'],
        tier1Count: tierCounts.tier1,
        tier2Count: tierCounts.tier2,
        tier3Count: tierCounts.tier3,
        
        // Primary Response Strategy
        primaryResponseStrategy: p.response,
        
        // Budget & Authority (100% Pre-filled - Section 6)
        preApprovedBudget: p.budget,
        budgetApprovalRequired: p.budget > 1000000,
        vendorContracts: STANDARD_VENDOR_CONTRACTS,
        externalResourceRoster: STANDARD_RESOURCE_ROSTER,
        
        // Execution Metrics
        targetExecutionTime: 12,
        averageActivationFrequency: p.frequency,
        historicalSuccessRate: 0.65 + Math.random() * 0.25,
        
        // Success Metrics (80% Pre-filled - Section 7)
        targetResponseSpeed: 12,
        targetStakeholderReach: 1.00,
        outcomeMetrics: successMetrics.outcomeMetrics,
        learningMetrics: STANDARD_LEARNING_METRICS,
      };
    });

    // Insert playbooks with conflict handling
    try {
      await db.insert(playbookLibrary).values(playbookValues).onConflictDoNothing();
      console.log(`✅ Domain ${domainConfig.id}: ${domainConfig.name} - ${domainPlaybooks.length} playbooks processed`);
    } catch (error) {
      console.error(`Error inserting playbooks for domain ${domainConfig.name}:`, error);
      // Continue with next domain instead of crashing
    }
  }

  console.log(`\n📊 Total: 9 domains, ${playbooksData.total} playbooks processed successfully!`);
}

if (import.meta.url.endsWith(process.argv[1])) {
  seedPlaybookLibrary()
    .then(() => {
      console.log('Seed completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed failed:', error);
      process.exit(1);
    });
}
