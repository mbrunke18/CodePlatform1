// scripts/simple-golden-demo-seed.ts - Simplified Golden Demo Database Seeding Script
// Creates the "Innovate Dynamics APAC Crisis" demo narrative using core tables only

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '../shared/schema';
import { nanoid } from 'nanoid';

// Database connection
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const sql = neon(databaseUrl);
const db = drizzle(sql, { schema });

async function main() {
  console.log('🌱 Starting Simple Golden Demo seeding...');
  console.log('📖 Narrative: "Innovate Dynamics APAC Crisis Response"');

  // ----------------------------------------------------------------
  // 1. WIPE EXISTING DATA (core tables only)
  // ----------------------------------------------------------------
  console.log('🗑️  Wiping existing data...');
  
  // Delete in reverse dependency order - handle foreign key constraints
  try {
    await db.delete(schema.moduleUsageAnalytics);
  } catch (e) { 
    console.log('ℹ️  moduleUsageAnalytics table not found or empty, skipping...'); 
  }
  
  try {
    await db.delete(schema.intelligenceReports);
  } catch (e) { 
    console.log('ℹ️  intelligenceReports table not found or empty, skipping...'); 
  }
  
  try {
    await db.delete(schema.novaInnovations);
  } catch (e) { 
    console.log('ℹ️  novaInnovations table not found or empty, skipping...'); 
  }
  
  try {
    await db.delete(schema.echoCulturalMetrics);
  } catch (e) { 
    console.log('ℹ️  echoCulturalMetrics table not found or empty, skipping...'); 
  }
  
  try {
    await db.delete(schema.prismInsights);
  } catch (e) { 
    console.log('ℹ️  prismInsights table not found or empty, skipping...'); 
  }
  
  try {
    await db.delete(schema.fluxAdaptations);
  } catch (e) { 
    console.log('ℹ️  fluxAdaptations table not found or empty, skipping...'); 
  }
  
  try {
    await db.delete(schema.pulseMetrics);
  } catch (e) { 
    console.log('ℹ️  pulseMetrics table not found or empty, skipping...'); 
  }
  
  await db.delete(schema.tasks);
  await db.delete(schema.strategicScenarios);  
  await db.delete(schema.projects);
  await db.delete(schema.activities);
  await db.delete(schema.users);
  await db.delete(schema.organizations);

  console.log('✅ Data wiped successfully.');

  // ----------------------------------------------------------------
  // 2. SEED GOLDEN DEMO DATA
  // ----------------------------------------------------------------
  console.log('✨ Seeding Golden Demo data...');

  // Create Innovate Dynamics Organization
  const orgId = nanoid();
  const [org] = await db.insert(schema.organizations).values({
    id: orgId,
    name: 'Innovate Dynamics',
    description: 'Leading cloud infrastructure and AI solutions provider',
    ownerId: 'temp-owner-id', // Will update after creating users
    domain: 'innovatedynamics.com',
    type: 'enterprise',
    size: 1250,
    industry: 'Technology',
    headquarters: 'San Francisco, CA',
    adaptabilityScore: 'excellent',
    onboardingCompleted: true,
    subscriptionTier: 'enterprise',
    settings: {
      aiRadarEnabled: true,
      crisisManagement: true,
      executiveBriefings: true
    },
    taxonomy: ['enterprise', 'saas', 'ai', 'cloud-infrastructure']
  }).returning();

  // Create Demo Users (Executive Team)
  const ceoId = nanoid();
  const [ceoUser] = await db.insert(schema.users).values({
    id: ceoId,
    email: 'demo@acuetic.com',
    firstName: 'Alexandra',
    lastName: 'Chen',
    organizationId: orgId,
    department: 'Executive',
    team: 'C-Suite',
    accessLevel: 'executive',
    scopes: ['organization'],
    lastLoginAt: new Date()
  }).returning();

  // Update organization owner
  await db.update(schema.organizations)
    .set({ ownerId: ceoId })
    .where(schema.organizations.id.eq(orgId));

  const csoId = nanoid();
  const [csoUser] = await db.insert(schema.users).values({
    id: csoId,
    email: 'strategy@innovatedynamics.com',
    firstName: 'Michael',
    lastName: 'Rivera',
    organizationId: orgId,
    department: 'Strategy',
    team: 'Strategic Planning',
    accessLevel: 'executive',
    scopes: ['organization']
  }).returning();

  const ctoId = nanoid();
  await db.insert(schema.users).values({
    id: ctoId,
    email: 'tech@innovatedynamics.com',
    firstName: 'Sarah',
    lastName: 'Kim',
    organizationId: orgId,
    department: 'Technology',
    team: 'Engineering Leadership',
    accessLevel: 'executive',
    scopes: ['business_unit']
  });

  const cmoId = nanoid();
  await db.insert(schema.users).values({
    id: cmoId,
    email: 'marketing@innovatedynamics.com',
    firstName: 'David',
    lastName: 'Thompson',
    organizationId: orgId,
    department: 'Marketing',
    team: 'Marketing Leadership',
    accessLevel: 'executive',
    scopes: ['business_unit']
  });

  console.log('👥 Executive team created.');

  // ----------------------------------------------------------------
  // 3. THE CRISIS: Strategic Scenario - Competitor Threat
  // ----------------------------------------------------------------
  console.log('🚨 Creating crisis scenario...');

  const [competitiveScenario] = await db.insert(schema.strategicScenarios).values({
    organizationId: orgId,
    name: 'APAC Competitive Response',
    title: 'Strategic Response to SynerTech Threat',
    description: 'SynerTech Corp has launched CloudFlow 3.0 targeting our APAC market with 85% feature parity and significant pricing advantage. Comprehensive response framework needed to protect 23.5% market share and $2.4M revenue at risk.',
    type: 'competitive-response',
    likelihood: 0.95,
    impact: 'high',
    triggerConditions: {
      marketShareDecline: '>10%',
      revenueImpact: '>$2.4M',
      customerChurnRate: '>15%',
      competitorThreat: 'SynerTech CloudFlow 3.0'
    },
    responseStrategy: {
      immediate: 'Crisis communication and customer retention',
      shortTerm: 'Competitive feature development and pricing adjustment',
      longTerm: 'Market differentiation and APAC expansion'
    },
    status: 'active',
    lastTriggered: new Date(),
    createdBy: csoId
  }).returning();

  console.log('🎯 Crisis scenario created.');

  // ----------------------------------------------------------------
  // 4. ACTION ITEMS AND TASKS
  // ----------------------------------------------------------------
  console.log('⚡ Creating action items...');

  await db.insert(schema.tasks).values([
    {
      scenarioId: competitiveScenario.id,
      description: 'Complete competitive feature gap analysis between InnovateFlow and SynerTech CloudFlow 3.0',
      priority: 'high',
      status: 'active',
      assignedTo: ctoId,
      estimatedHours: 16.0,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days
    },
    {
      scenarioId: competitiveScenario.id,
      description: 'Develop customer retention communication strategy highlighting InnovateFlow advantages',
      priority: 'high',
      status: 'active',
      assignedTo: cmoId,
      estimatedHours: 12.0,
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) // 1 day
    },
    {
      scenarioId: competitiveScenario.id,
      description: 'Model revenue impact scenarios for various market share loss projections',
      priority: 'medium',
      status: 'draft',
      assignedTo: csoId,
      estimatedHours: 20.0,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days
    },
    {
      scenarioId: competitiveScenario.id,
      description: 'Activate crisis response protocol and assemble cross-functional response team',
      priority: 'critical',
      status: 'completed',
      assignedTo: ceoId,
      estimatedHours: 4.0,
      actualHours: 2.5,
      completed: new Date()
    },
    {
      scenarioId: competitiveScenario.id,
      description: 'Analyze APAC market expansion opportunities in mid-market segment',
      priority: 'medium',
      status: 'draft',
      assignedTo: cmoId,
      estimatedHours: 24.0,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week
    }
  ]);

  console.log('📋 Strategic tasks created.');

  // ----------------------------------------------------------------
  // 5. STRATEGIC PROJECTS 
  // ----------------------------------------------------------------
  console.log('🚀 Creating strategic projects...');

  await db.insert(schema.projects).values([
    {
      organizationId: orgId,
      name: 'APAC Market Defense Initiative',
      description: 'Comprehensive strategic response to competitive threat from SynerTech CloudFlow 3.0',
      objective: 'Protect 97%+ of current APAC market share while accelerating innovation pipeline',
      methodology: 'Agile',
      priority: 'high',
      status: 'active',
      progress: 0.25,
      budget: 2500000.00,
      actualCost: 125000.00,
      startDate: new Date(),
      targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      riskLevel: 'high',
      teamSize: 24,
      leadId: csoId,
      stakeholders: [ceoId, csoId, ctoId, cmoId],
      metrics: {
        marketShareRetention: { target: 97.0, current: 96.2 },
        customerSatisfaction: { target: 8.5, current: 7.9 },
        competitiveFeatureGap: { target: 5.0, current: 15.2 },
        revenueImpactMitigation: { target: 90.0, current: 65.0 }
      }
    },
    {
      organizationId: orgId,
      name: 'AI-Native APAC Platform Development',
      description: 'Revolutionary platform combining local language processing, regulatory compliance, and cultural workflow adaptation',
      objective: 'Create sustainable competitive advantage in APAC markets through localized innovation',
      methodology: 'Lean',
      priority: 'high',
      status: 'active',
      progress: 0.15,
      budget: 3200000.00,
      actualCost: 85000.00,
      startDate: new Date(),
      targetDate: new Date(Date.now() + 270 * 24 * 60 * 60 * 1000), // 9 months
      riskLevel: 'moderate',
      teamSize: 15,
      leadId: ctoId,
      stakeholders: [ceoId, ctoId, csoId],
      metrics: {
        developmentProgress: { target: 100.0, current: 15.0 },
        marketValidation: { target: 85.0, current: 32.0 },
        technicalDebtRatio: { target: 10.0, current: 8.5 }
      }
    }
  ]);

  console.log('💼 Strategic projects created.');

  // ----------------------------------------------------------------
  // 6. ACTIVITY TRACKING
  // ----------------------------------------------------------------
  console.log('📊 Creating activity records...');

  await db.insert(schema.activities).values([
    {
      userId: ceoId,
      action: 'Crisis Response Activated',
      entityType: 'strategic_scenario',
      entityId: competitiveScenario.id
    },
    {
      userId: csoId,
      action: 'Strategic Analysis Initiated',
      entityType: 'strategic_scenario',
      entityId: competitiveScenario.id
    },
    {
      userId: ctoId,
      action: 'Technical Assessment Started',
      entityType: 'task'
    },
    {
      userId: cmoId,
      action: 'Customer Communication Plan Started',
      entityType: 'task'
    }
  ]);

  console.log('✅ Simple Golden Demo seeding completed successfully!');
  console.log('');
  console.log('🎭 DEMO NARRATIVE READY:');
  console.log('   👤 Login as: demo@acuetic.com');
  console.log('   🏢 Organization: Innovate Dynamics'); 
  console.log('   🚨 Crisis: SynerTech Competitor Threat in APAC');
  console.log('   📋 Strategic Scenario: Active competitive response');
  console.log('   ⚡ Action Items: 5 tasks with realistic deadlines');
  console.log('   💼 Projects: 2 strategic initiatives underway');
  console.log('');
  console.log('🎯 Demo Story:');
  console.log('   1. SynerTech launches CloudFlow 3.0 targeting APAC');
  console.log('   2. Threatens 15% market share ($2.4M revenue risk)');
  console.log('   3. Crisis response activated immediately');
  console.log('   4. Cross-functional team mobilized');  
  console.log('   5. Strategic projects launched to counter threat');
  console.log('');
  console.log('💡 Key Demo Points:');
  console.log('   • Rapid crisis detection and response');
  console.log('   • Executive team coordination');
  console.log('   • Data-driven decision making');
  console.log('   • Strategic project management');
  console.log('   • Competitive intelligence capabilities');
}

main().catch((error) => {
  console.error('❌ Simple Golden Demo seeding failed:', error);
  process.exit(1);
}).finally(() => {
  console.log('🌱 Seeding script completed.');
  process.exit(0);
});