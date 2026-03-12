// scripts/minimal-golden-demo-seed.ts - Minimal Golden Demo Database Seeding Script
// Creates the "Innovate Dynamics APAC Crisis" demo narrative using only basic fields

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '../shared/schema';
import { nanoid } from 'nanoid';
import { randomUUID } from 'crypto';

// Database connection
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const sql = neon(databaseUrl);
const db = drizzle(sql, { schema });

async function main() {
  console.log('🌱 Starting Minimal Golden Demo seeding...');
  console.log('📖 Narrative: "Innovate Dynamics APAC Crisis Response"');

  // ----------------------------------------------------------------
  // 1. WIPE EXISTING DATA (core tables only)
  // ----------------------------------------------------------------
  console.log('🗑️  Wiping existing data...');
  
  // Use raw SQL for deletion to properly handle foreign key constraints
  try {
    await sql`DELETE FROM module_usage_analytics;`;
    console.log('✓ Cleared module_usage_analytics');
  } catch (e) { console.log('ℹ️  module_usage_analytics not found, skipping...'); }
  
  try {
    await sql`DELETE FROM intelligence_reports;`;
    console.log('✓ Cleared intelligence_reports');
  } catch (e) { console.log('ℹ️  intelligence_reports not found, skipping...'); }
  
  try {
    await sql`DELETE FROM nova_innovations;`;
    console.log('✓ Cleared nova_innovations');
  } catch (e) { console.log('ℹ️  nova_innovations not found, skipping...'); }
  
  try {
    await sql`DELETE FROM echo_cultural_metrics;`;
    console.log('✓ Cleared echo_cultural_metrics');
  } catch (e) { console.log('ℹ️  echo_cultural_metrics not found, skipping...'); }
  
  try {
    await sql`DELETE FROM prism_insights;`;
    console.log('✓ Cleared prism_insights');
  } catch (e) { console.log('ℹ️  prism_insights not found, skipping...'); }
  
  try {
    await sql`DELETE FROM flux_adaptations;`;
    console.log('✓ Cleared flux_adaptations');
  } catch (e) { console.log('ℹ️  flux_adaptations not found, skipping...'); }
  
  try {
    await sql`DELETE FROM pulse_metrics;`;
    console.log('✓ Cleared pulse_metrics');
  } catch (e) { console.log('ℹ️  pulse_metrics not found, skipping...'); }
  
  try {
    await sql`DELETE FROM tasks;`;
    console.log('✓ Cleared tasks');
  } catch (e) { console.log('ℹ️  tasks not found, skipping...'); }
  
  try {
    await sql`DELETE FROM strategic_scenarios;`;
    console.log('✓ Cleared strategic_scenarios');
  } catch (e) { console.log('ℹ️  strategic_scenarios not found, skipping...'); }
  
  try {
    await sql`DELETE FROM projects;`;
    console.log('✓ Cleared projects');
  } catch (e) { console.log('ℹ️  projects not found, skipping...'); }
  
  try {
    await sql`DELETE FROM activities;`;
    console.log('✓ Cleared activities');
  } catch (e) { console.log('ℹ️  activities not found, skipping...'); }
  
  try {
    await sql`DELETE FROM users;`;
    console.log('✓ Cleared users');
  } catch (e) { console.log('ℹ️  users not found, skipping...'); }
  
  try {
    await sql`DELETE FROM organizations;`;
    console.log('✓ Cleared organizations');
  } catch (e) { console.log('ℹ️  organizations not found, skipping...'); }

  console.log('✅ Data wiped successfully.');

  // ----------------------------------------------------------------
  // 2. SEED GOLDEN DEMO DATA
  // ----------------------------------------------------------------
  console.log('✨ Seeding Golden Demo data...');

  // Create Innovate Dynamics Organization - using raw SQL to avoid schema issues
  const orgId = randomUUID();
  await sql`
    INSERT INTO organizations (id, name, description, owner_id, industry, size, type, headquarters, domain, adaptability_score, onboarding_completed, subscription_tier)
    VALUES (${orgId}, 'Innovate Dynamics', 'Leading cloud infrastructure and AI solutions provider facing competitive threat from SynerTech Corp in APAC markets.', 'temp-owner-id', 'Technology', 1250, 'enterprise', 'San Francisco, CA', 'innovatedynamics.com', 'excellent', true, 'enterprise');
  `;
  
  const org = { id: orgId, name: 'Innovate Dynamics' };

  console.log(`✓ Organization created: ${org.name}`);

  // Create Demo Users (Executive Team) - using raw SQL
  const ceoId = randomUUID();
  await sql`
    INSERT INTO users (id, email, first_name, last_name, organization_id)
    VALUES (${ceoId}, 'demo@acuetic.com', 'Alexandra', 'Chen', ${orgId});
  `;

  // Update organization owner
  await sql`UPDATE organizations SET owner_id = ${ceoId} WHERE id = ${orgId};`;

  const csoId = randomUUID();
  await sql`
    INSERT INTO users (id, email, first_name, last_name, organization_id)
    VALUES (${csoId}, 'strategy@innovatedynamics.com', 'Michael', 'Rivera', ${orgId});
  `;

  const ctoId = randomUUID();
  await sql`
    INSERT INTO users (id, email, first_name, last_name, organization_id)
    VALUES (${ctoId}, 'tech@innovatedynamics.com', 'Sarah', 'Kim', ${orgId});
  `;

  const cmoId = randomUUID();
  await sql`
    INSERT INTO users (id, email, first_name, last_name, organization_id)
    VALUES (${cmoId}, 'marketing@innovatedynamics.com', 'David', 'Thompson', ${orgId});
  `;

  console.log('👥 Executive team created (4 users)');

  // ----------------------------------------------------------------
  // 3. THE CRISIS: Strategic Scenario - Competitor Threat
  // ----------------------------------------------------------------
  console.log('🚨 Creating crisis scenario...');

  const [competitiveScenario] = await db.insert(schema.strategicScenarios).values({
    organizationId: orgId,
    name: 'APAC Competitive Response',
    title: 'APAC Competitive Crisis: SynerTech CloudFlow 3.0',
    description: '🚨 URGENT: SynerTech Corp launched CloudFlow 3.0 targeting our APAC market with 85% feature parity and 20-30% pricing advantage. Intelligence indicates 15% market share risk ($2.4M revenue impact in Q1). Executive team activated crisis response protocol. Immediate strategic countermeasures required to protect market position and customer base.',
    createdBy: csoId
  }).returning();

  console.log('🎯 Crisis scenario created');

  // ----------------------------------------------------------------
  // 4. ACTION ITEMS AND TASKS
  // ----------------------------------------------------------------
  console.log('⚡ Creating action items...');

  const tasks = await db.insert(schema.tasks).values([
    {
      scenarioId: competitiveScenario.id,
      description: '🔍 URGENT: Complete competitive feature analysis - InnovateFlow vs SynerTech CloudFlow 3.0. Identify feature gaps and prioritize development roadmap.',
      priority: 'high',
      assignedTo: ctoId,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days
    },
    {
      scenarioId: competitiveScenario.id,
      description: '📢 URGENT: Customer retention strategy - Create communication plan highlighting InnovateFlow advantages and addressing competitive concerns.',
      priority: 'high', 
      assignedTo: cmoId,
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) // 1 day
    },
    {
      scenarioId: competitiveScenario.id,
      description: '📊 CRITICAL: Financial impact modeling - Model revenue scenarios for various market share loss projections (5%, 10%, 15%, 20%).',
      priority: 'high',
      assignedTo: csoId,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days
    },
    {
      scenarioId: competitiveScenario.id,
      description: '✅ COMPLETED: Crisis response activated - Executive war room established, cross-functional team mobilized, emergency budget allocated.',
      priority: 'critical',
      assignedTo: ceoId,
      completed: new Date()
    },
    {
      scenarioId: competitiveScenario.id,
      description: '🌏 OPPORTUNITY: APAC expansion analysis - Research mid-market segment (500-2000 employees) expansion opportunities.',
      priority: 'medium',
      assignedTo: cmoId,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week
    }
  ]).returning();

  console.log(`📋 ${tasks.length} strategic tasks created`);

  // ----------------------------------------------------------------
  // 5. ACTIVITY TRACKING
  // ----------------------------------------------------------------
  console.log('📊 Creating activity records...');

  await db.insert(schema.activities).values([
    {
      userId: ceoId,
      action: 'CRISIS RESPONSE ACTIVATED: SynerTech threat detected, executive team mobilized',
      entityType: 'strategic_scenario',
      entityId: competitiveScenario.id
    },
    {
      userId: csoId,
      action: 'Strategic analysis initiated for APAC competitive response',
      entityType: 'strategic_scenario', 
      entityId: competitiveScenario.id
    },
    {
      userId: ctoId,
      action: 'Technical assessment started: Feature gap analysis',
      entityType: 'task'
    },
    {
      userId: cmoId,
      action: 'Customer communication strategy development started',
      entityType: 'task'
    }
  ]);

  console.log('✅ Minimal Golden Demo seeding completed successfully!');
  console.log('');
  console.log('🎭 DEMO NARRATIVE READY:');
  console.log('   👤 Login: demo@acuetic.com');
  console.log('   🏢 Org: Innovate Dynamics');
  console.log('   🚨 Crisis: SynerTech CloudFlow 3.0 threat');
  console.log('   📊 Impact: 15% market share risk, $2.4M revenue');
  console.log('   👥 Team: 4 executives mobilized');
  console.log('   ⚡ Tasks: 5 action items (1 completed, 4 active)');
  console.log('');
  console.log('🎯 Demo Story Arc:');
  console.log('   1. 🔴 THREAT: Surprise competitor launch in APAC');
  console.log('   2. 🟡 ALERT: AI detects 85% feature parity + pricing advantage');
  console.log('   3. 🟠 RESPONSE: Crisis protocol activated in <3 hours');
  console.log('   4. 🔵 MOBILIZE: Cross-functional executive team assembled');
  console.log('   5. 🟢 ACTION: Strategic countermeasures underway');
  console.log('');
  console.log('💡 Key Value Props Demonstrated:');
  console.log('   • Rapid threat detection & crisis response');
  console.log('   • Executive coordination & task management');  
  console.log('   • Strategic scenario planning under pressure');
  console.log('   • Data-driven competitive intelligence');
  console.log('   • Organizational agility & decision speed');
  console.log('');
  console.log('🚀 Ready for demo presentation!');
}

main().catch((error) => {
  console.error('❌ Minimal Golden Demo seeding failed:', error);
  process.exit(1);
}).finally(() => {
  console.log('🌱 Seeding script completed.');
  process.exit(0);
});