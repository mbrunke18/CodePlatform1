/**
 * Production-Ready Trigger Seeding
 * 
 * Seeds all 92+ intelligence signal data points as triggers
 * and links them to appropriate playbooks from the 166 playbook library.
 */

import { db } from '../db';
import {
  executiveTriggers,
  playbookTriggerAssociations,
  triggerSignals,
  playbookLibrary,
  playbookDomains,
  organizations,
  users,
} from '@shared/schema';
import { 
  SIGNAL_CATEGORIES, 
  getAllDataPoints,
  getTotalDataPointCount,
  type SignalCategory,
  type DataPoint 
} from '@shared/intelligence-signals';
import { eq, sql } from 'drizzle-orm';

const DOMAIN_TO_SIGNAL_MAPPING: Record<string, string[]> = {
  'Market Dynamics': ['competitive', 'market', 'partnership'],
  'Operational Excellence': ['supplychain', 'execution'],
  'Financial Strategy': ['financial', 'economic'],
  'Regulatory & Compliance': ['regulatory'],
  'Technology & Innovation': ['technology', 'cyber', 'innovation'],
  'Talent & Leadership': ['talent'],
  'Brand & Reputation': ['media', 'customer', 'geopolitical'],
  'Market Opportunities': ['market', 'competitive', 'partnership', 'economic'],
};

const SIGNAL_TO_DOMAINS: Record<string, string[]> = {
  'competitive': ['Market Dynamics', 'Market Opportunities'],
  'market': ['Market Dynamics', 'Market Opportunities', 'Financial Strategy'],
  'financial': ['Financial Strategy'],
  'regulatory': ['Regulatory & Compliance'],
  'supplychain': ['Operational Excellence'],
  'customer': ['Brand & Reputation', 'Market Dynamics'],
  'talent': ['Talent & Leadership'],
  'technology': ['Technology & Innovation'],
  'cyber': ['Technology & Innovation'],
  'media': ['Brand & Reputation'],
  'geopolitical': ['Operational Excellence', 'Financial Strategy'],
  'economic': ['Financial Strategy', 'Market Opportunities'],
  'partnership': ['Market Dynamics', 'Operational Excellence'],
  'execution': ['Operational Excellence'],
  'behavior': ['Market Dynamics', 'Brand & Reputation'],
  'innovation': ['Technology & Innovation'],
  'esg': ['Brand & Reputation', 'Regulatory & Compliance'],
};

function operatorToSymbol(op: string): string {
  const map: Record<string, string> = {
    'gt': '>',
    'lt': '<',
    'gte': '>=',
    'lte': '<=',
    'eq': '=',
    'neq': '!=',
    'contains': 'contains',
    'spike': '↑ spike',
    'drop': '↓ drop',
    'trend': '→ trend',
  };
  return map[op] || op;
}

function generateTriggerName(category: SignalCategory, dataPoint: DataPoint): string {
  return `${category.shortName}: ${dataPoint.name}`;
}

function generateTriggerDescription(category: SignalCategory, dataPoint: DataPoint): string {
  const threshold = dataPoint.defaultThreshold;
  if (!threshold) {
    return `Monitor ${dataPoint.description.toLowerCase()}`;
  }
  const op = operatorToSymbol(threshold.operator);
  const value = threshold.value;
  return `Trigger when ${dataPoint.name.toLowerCase()} ${op} ${value}${dataPoint.unit ? ` ${dataPoint.unit}` : ''}. ${dataPoint.description}`;
}

function buildConditions(dataPoint: DataPoint): Record<string, any> {
  const threshold = dataPoint.defaultThreshold;
  if (!threshold) {
    return {
      field: dataPoint.id,
      operator: 'change',
      value: 'any',
    };
  }
  return {
    field: dataPoint.id,
    operator: threshold.operator,
    value: threshold.value,
    logic: 'single',
  };
}

export async function seedTriggers() {
  console.log('🎯 Seeding Production Triggers from 16 Signal Categories...');
  
  const allDataPoints = getAllDataPoints();
  const totalDataPoints = getTotalDataPointCount();
  console.log(`   Found ${totalDataPoints} data points across ${SIGNAL_CATEGORIES.length} signal categories`);

  const [org] = await db.select().from(organizations).limit(1);
  if (!org) {
    console.log('   ⚠️ No organization found, skipping trigger seed');
    return { triggersCreated: 0, associationsCreated: 0 };
  }

  const [user] = await db.select().from(users).limit(1);
  if (!user) {
    console.log('   ⚠️ No user found, skipping trigger seed');
    return { triggersCreated: 0, associationsCreated: 0 };
  }

  return seedTriggersForOrg(org.id, user.id, allDataPoints);
}

async function seedTriggersForOrg(
  organizationId: string,
  createdBy: string,
  allDataPoints: { category: SignalCategory; dataPoint: DataPoint }[]
) {
  const existingTriggers = await db.select().from(executiveTriggers).where(eq(executiveTriggers.organizationId, organizationId));
  
  if (existingTriggers.length >= 80) {
    console.log(`   ✅ Already have ${existingTriggers.length} triggers`);
    await seedTriggerSignals(organizationId, createdBy);
    return { triggersCreated: 0, associationsCreated: 0 };
  }

  console.log(`   Clearing ${existingTriggers.length} existing triggers...`);
  if (existingTriggers.length > 0) {
    await db.delete(playbookTriggerAssociations);
    await db.delete(executiveTriggers).where(eq(executiveTriggers.organizationId, organizationId));
  }

  const domains = await db.select().from(playbookDomains);
  const domainMap = new Map(domains.map(d => [d.name, d.id]));

  const playbooks = await db.select().from(playbookLibrary);
  const playbooksByDomain = new Map<string, typeof playbooks>();
  for (const pb of playbooks) {
    const domainId = pb.domainId;
    if (!playbooksByDomain.has(domainId)) {
      playbooksByDomain.set(domainId, []);
    }
    playbooksByDomain.get(domainId)!.push(pb);
  }

  let triggersCreated = 0;
  let associationsCreated = 0;

  for (const { category, dataPoint } of allDataPoints) {
    const triggerName = generateTriggerName(category, dataPoint);
    const triggerDescription = generateTriggerDescription(category, dataPoint);
    const conditions = buildConditions(dataPoint);
    const threshold = dataPoint.defaultThreshold;

    const [trigger] = await db.insert(executiveTriggers).values({
      organizationId,
      createdBy,
      name: triggerName,
      description: triggerDescription,
      category: category.id,
      triggerType: threshold ? 'threshold' : 'event',
      conditions,
      severity: threshold?.urgency || 'medium',
      alertThreshold: threshold?.urgency === 'critical' ? 'red' : 
                      threshold?.urgency === 'high' ? 'yellow' : 'green',
      isActive: true,
      recommendedPlaybooks: category.recommendedPlaybooks,
      notificationSettings: {
        email: true,
        slack: true,
        inApp: true,
        escalation: threshold?.urgency === 'critical' || threshold?.urgency === 'high',
      },
    }).returning();

    triggersCreated++;

    const targetDomains = SIGNAL_TO_DOMAINS[category.id] || [];
    
    const matchingPlaybooks: string[] = [];
    for (const domainName of targetDomains) {
      const domainId = domainMap.get(domainName);
      if (!domainId) continue;

      const domainPlaybooks = playbooksByDomain.get(domainId) || [];
      const topPlaybooks = domainPlaybooks.slice(0, 3);
      
      for (const playbook of topPlaybooks) {
        if (!matchingPlaybooks.includes(playbook.name)) {
          matchingPlaybooks.push(playbook.name);
          associationsCreated++;
        }
      }
    }
    
    if (matchingPlaybooks.length > 0) {
      await db.update(executiveTriggers)
        .set({ 
          recommendedPlaybooks: [...(category.recommendedPlaybooks || []), ...matchingPlaybooks].slice(0, 5)
        })
        .where(eq(executiveTriggers.id, trigger.id));
    }

    if (triggersCreated % 20 === 0) {
      console.log(`   Created ${triggersCreated}/${allDataPoints.length} triggers...`);
    }
  }

  console.log(`   ✅ Created ${triggersCreated} triggers`);
  console.log(`   ✅ Created ${associationsCreated} playbook associations`);

  await seedTriggerSignals(organizationId, createdBy);

  return { triggersCreated, associationsCreated };
}

async function seedTriggerSignals(organizationId: string, createdBy: string) {
  console.log('   📡 Seeding trigger signals...');
  
  const existingSignals = await db.select().from(triggerSignals).where(eq(triggerSignals.organizationId, organizationId));
  
  if (existingSignals.length >= 80) {
    console.log(`   ✅ Already have ${existingSignals.length} trigger signals`);
    return;
  }

  if (existingSignals.length > 0) {
    await db.delete(triggerSignals).where(eq(triggerSignals.organizationId, organizationId));
  }

  const allDataPoints = getAllDataPoints();
  let signalsCreated = 0;

  for (const { category, dataPoint } of allDataPoints) {
    const threshold = dataPoint.defaultThreshold;
    
    await db.insert(triggerSignals).values({
      organizationId,
      createdBy,
      name: dataPoint.name,
      description: dataPoint.description,
      category: category.id,
      signalType: threshold ? 'metric' : 'event',
      dataField: dataPoint.id,
      samplingCadence: category.refreshInterval,
      operator: threshold?.operator || 'change',
      thresholdValue: threshold?.value?.toString() || 'any',
      priority: threshold?.urgency || 'medium',
      isActive: true,
      currentValue: '0',
    }).onConflictDoNothing();
    
    signalsCreated++;
  }

  console.log(`   ✅ Created ${signalsCreated} trigger signals`);
}

export async function getTriggerStats() {
  const triggers = await db.select({ count: sql<number>`count(*)` }).from(executiveTriggers);
  const associations = await db.select({ count: sql<number>`count(*)` }).from(playbookTriggerAssociations);
  const signals = await db.select({ count: sql<number>`count(*)` }).from(triggerSignals);
  
  return {
    triggers: Number(triggers[0]?.count || 0),
    associations: Number(associations[0]?.count || 0),
    signals: Number(signals[0]?.count || 0),
    totalDataPoints: getTotalDataPointCount(),
    signalCategories: SIGNAL_CATEGORIES.length,
  };
}
