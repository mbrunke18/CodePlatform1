/**
 * Add 3 new offensive playbooks (#145, #146, #155) to existing library
 */

import { db } from '../server/db.js';
import {
  playbookLibrary,
  playbookDomains,
  playbookCategories,
} from '../shared/schema.js';
import { eq } from 'drizzle-orm';
import {
  getActivationTier,
  getSeverityScore,
  getTimeSensitivity,
  getTierCounts,
  STANDARD_VENDOR_CONTRACTS,
  STANDARD_RESOURCE_ROSTER,
  getSuccessMetrics,
  STANDARD_LEARNING_METRICS,
  EXECUTIVE_ACCOUNTABILITY,
} from './enhancedPlaybookData.js';

const NEW_PLAYBOOKS = [
  {
    number: 145,
    name: 'Strategic Market Entry - Multi-Brand Launch',
    trigger: 'Major market rebound creates strategic window for simultaneous multi-brand expansion',
    stakeholders: ['CEO', 'CMO', 'CFO', 'Geographic GM', 'Strategy'],
    response: 'Coordinate 10+ brand launches across multiple cities, retail real estate activation, capital deployment, Golden Week timing',
    domain: 8,
    frequency: 'rare',
    budget: 50000000,
  },
  {
    number: 146,
    name: 'Trend Capitalization - Viral Fashion Response',
    trigger: 'Viral social media trend (47M+ views) with 21-day lifecycle and $180M+ revenue potential detected',
    stakeholders: ['CEO', 'CMO', 'CPO', 'Supply Chain', 'Strategy'],
    response: 'Coordinate 5000+ suppliers, design 200 SKUs, launch in 7 days to capture 65% market share before competitors',
    domain: 8,
    frequency: 'medium',
    budget: 15000000,
  },
  {
    number: 155,
    name: 'Launch Schedule Acceleration',
    trigger: 'Favorable orbital window opens 3 days early with vacant slot from competitor delay',
    stakeholders: ['CEO', 'CTO', 'COO', 'Government Relations', 'Mission Control'],
    response: 'Accelerate launch by 72 hours, coordinate FAA/Space Force approvals, payload preparation, ground operations',
    domain: 8,
    frequency: 'rare',
    budget: 5000000,
  },
];

async function addOffensivePlaybooks() {
  console.log('🚀 Adding 3 new offensive playbooks (#145, #146, #155)...');

  try {
    // Get Domain 8
    const domain8 = await db.query.playbookDomains.findFirst({
      where: eq(playbookDomains.code, 'DOMAIN8'),
    });

    if (!domain8) {
      throw new Error('Domain 8 (Market Opportunities) not found');
    }

    // Get or create "Strategic Opportunities" category
    let strategicOppsCategory = await db.query.playbookCategories.findFirst({
      where: eq(playbookCategories.name, 'Strategic Opportunities'),
    });

    if (!strategicOppsCategory) {
      console.log('├─ Creating Strategic Opportunities category...');
      [strategicOppsCategory] = await db
        .insert(playbookCategories)
        .values({
          domainId: domain8.id,
          name: 'Strategic Opportunities',
          description: 'Market entries, trend capitalization, launch acceleration',
          sequence: 1,
          totalPlaybooks: 3,
        })
        .returning();
    }

    console.log('├─ Adding playbooks...');

    // Check if playbooks already exist
    for (const p of NEW_PLAYBOOKS) {
      const existing = await db.query.playbookLibrary.findFirst({
        where: eq(playbookLibrary.playbookNumber, p.number),
      });

      if (existing) {
        console.log(`├─ Playbook #${p.number} already exists, skipping...`);
        continue;
      }

      const severityScore = getSeverityScore(p.number, p.domain);
      const timeSensitivity = getTimeSensitivity(p.number, severityScore);
      const activationTier = getActivationTier(p.number, p.domain);
      const tierCounts = getTierCounts(p.domain, severityScore);
      const successMetrics = getSuccessMetrics(p.domain);

      await db.insert(playbookLibrary).values({
        playbookNumber: p.number,
        domainId: domain8.id,
        categoryId: strategicOppsCategory.id,
        name: p.name,
        description: p.trigger,

        // Executive Accountability
        primaryExecutiveRole: EXECUTIVE_ACCOUNTABILITY[p.domain as keyof typeof EXECUTIVE_ACCOUNTABILITY],

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
        resourceRoster: STANDARD_RESOURCE_ROSTER,

        // Success Metrics (95% Pre-filled - Section 7)
        successMetrics,
        learningMetrics: STANDARD_LEARNING_METRICS,

        // 80/20 Template Structure
        templateCompletion: 80, // 80% pre-filled
        customizationRequired: 20, // 20% situational
      });

      console.log(`├─ ✓ Added Playbook #${p.number}: ${p.name}`);
    }

    // Update Domain 8 total count
    await db
      .update(playbookDomains)
      .set({ totalPlaybooks: 12 })
      .where(eq(playbookDomains.code, 'DOMAIN8'));

    console.log('✅ Successfully added offensive playbooks!');
    console.log('📊 Domain 8 now has 12 playbooks total');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to add playbooks:', error);
    process.exit(1);
  }
}

addOffensivePlaybooks();
