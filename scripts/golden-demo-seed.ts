// scripts/golden-demo-seed.ts - Golden Demo Database Seeding Script
// Creates the "Innovate Dynamics APAC Crisis" demo narrative

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
  console.log('🌱 Starting Golden Demo seeding...');
  console.log('📖 Narrative: "Innovate Dynamics APAC Crisis Response"');

  // ----------------------------------------------------------------
  // 1. WIPE EXISTING DATA (in dependency order)
  // ----------------------------------------------------------------
  console.log('🗑️  Wiping existing data...');
  
  // Delete in reverse dependency order
  await db.delete(schema.warRoomUpdates);
  await db.delete(schema.warRoomSessions);
  await db.delete(schema.executiveBriefings);
  await db.delete(schema.strategicAlerts);
  await db.delete(schema.executiveInsights);
  await db.delete(schema.syntheticScenarios);
  await db.delete(schema.intuitionRecords);
  await db.delete(schema.actionItems);
  await db.delete(schema.recommendations);
  await db.delete(schema.insights);
  await db.delete(schema.evidence);
  await db.delete(schema.kpis);
  await db.delete(schema.initiatives);
  await db.delete(schema.risks);
  await db.delete(schema.tasks);
  await db.delete(schema.strategicScenarios);
  await db.delete(schema.projects);
  await db.delete(schema.novaInnovations);
  await db.delete(schema.echoCulturalMetrics);
  await db.delete(schema.prismInsights);
  await db.delete(schema.fluxAdaptations);
  await db.delete(schema.pulseMetrics);
  await db.delete(schema.intelligenceReports);
  await db.delete(schema.moduleUsageAnalytics);
  await db.delete(schema.notifications);
  await db.delete(schema.activities);
  await db.delete(schema.rolePermissions);
  await db.delete(schema.permissions);
  await db.delete(schema.roles);
  await db.delete(schema.businessUnits);
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

  // Create Business Units
  const [techBU] = await db.insert(schema.businessUnits).values({
    organizationId: orgId,
    name: 'Technology & Innovation',
    description: 'Core product development and engineering',
    businessFunction: 'technology',
    budget: '12500000.00',
    headcount: 450
  }).returning();

  const [marketingBU] = await db.insert(schema.businessUnits).values({
    organizationId: orgId,
    name: 'Global Marketing & Sales',
    description: 'Marketing, sales, and customer success',
    businessFunction: 'marketing',
    budget: '8500000.00',
    headcount: 320
  }).returning();

  // Create Executive Roles
  const [ceoRole] = await db.insert(schema.roles).values({
    organizationId: orgId,
    name: 'Chief Executive Officer',
    description: 'Corporate leadership and strategic vision',
    category: 'executive',
    level: 10,
    isSystemRole: false,
    capabilities: ['strategic-planning', 'crisis-management', 'executive-briefings']
  }).returning();

  const [csoRole] = await db.insert(schema.roles).values({
    organizationId: orgId,
    name: 'Chief Strategy Officer',
    description: 'Strategic planning and intelligence leadership',
    category: 'executive', 
    level: 8,
    isSystemRole: false,
    capabilities: ['strategic-planning', 'ai-intelligence', 'scenario-modeling']
  }).returning();

  // Create Demo Users (Executive Team)
  const ceoId = nanoid();
  const [ceoUser] = await db.insert(schema.users).values({
    id: ceoId,
    email: 'demo@acuetic.com',
    firstName: 'Alexandra',
    lastName: 'Chen',
    organizationId: orgId,
    businessUnitId: techBU.id,
    roleId: ceoRole.id,
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
    businessUnitId: techBU.id,
    roleId: csoRole.id,
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
    businessUnitId: techBU.id,
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
    businessUnitId: marketingBU.id,
    department: 'Marketing',
    team: 'Marketing Leadership',
    accessLevel: 'executive',
    scopes: ['business_unit']
  });

  console.log('👥 Executive team created.');

  // ----------------------------------------------------------------
  // 3. THE CRISIS: Strategic Alert - Competitor Threat
  // ----------------------------------------------------------------
  console.log('🚨 Creating crisis scenario...');

  const [competitorAlert] = await db.insert(schema.strategicAlerts).values({
    organizationId: orgId,
    alertType: 'competitive_threat',
    severity: 'high',
    title: 'Competitor Product Launch Detected - APAC Region',
    description: 'SynerTech Corp has announced a surprise product launch targeting our core market in APAC. Early intelligence suggests feature parity with potential pricing advantage.',
    aiConfidence: 0.87,
    dataSourcesUsed: ['market-intelligence', 'social-media-monitoring', 'competitor-tracking'],
    suggestedActions: [
      'Activate Crisis Response Protocol',
      'Assess competitive positioning',
      'Review APAC pricing strategy',
      'Accelerate product differentiation'
    ],
    recommendedScenario: 'Competitive Response Framework',
    targetAudience: ['ceo', 'cso', 'cmo', 'cto']
  }).returning();

  // Create War Room Session
  const [warRoom] = await db.insert(schema.warRoomSessions).values({
    organizationId: orgId,
    title: 'APAC Competitive Response Command Center',
    crisisType: 'competitive_threat',
    severity: 'high',
    commanderId: csoId,
    stakeholderIds: [ceoId, csoId, ctoId, cmoId],
    description: 'Strategic response to SynerTech Corp product launch in APAC markets',
    responseProtocol: 'Immediate assessment, strategic positioning, and tactical response within 72 hours',
    communicationPlan: 'Internal stakeholder briefings q4h, customer communication within 24h',
    resourcesAllocated: '$500K emergency budget allocated for immediate response',
    timeline: 'Phase 1: Assessment (24h), Phase 2: Strategy (48h), Phase 3: Implementation (72h)',
    keyDecisions: [],
    nextActions: [
      'Complete competitive intelligence assessment',
      'Model revenue impact scenarios',
      'Develop counter-positioning strategy'
    ],
    situationReport: 'SynerTech Corp announced CloudFlow 3.0 with AI-native architecture targeting APAC enterprise market.',
    activatedAt: new Date()
  }).returning();

  // Add War Room Updates
  await db.insert(schema.warRoomUpdates).values([
    {
      sessionId: warRoom.id,
      updateType: 'situation-update',
      title: 'Initial Threat Assessment Complete',
      content: 'Competitive analysis confirms SynerTech CloudFlow 3.0 poses significant threat. Feature analysis shows 85% parity with 20-30% price advantage in APAC markets.',
      priority: 'high',
      authorId: csoId,
      impactAssessment: 'Estimated 15% market share risk in APAC, $2.4M revenue impact in Q1',
      requiredActions: ['Pricing strategy review', 'Feature differentiation plan', 'Customer retention strategy']
    },
    {
      sessionId: warRoom.id,
      updateType: 'decision',
      title: 'Strategic Response Framework Approved',
      content: 'Executive committee approves three-pronged response: Accelerated product development, competitive pricing adjustment, and customer value reinforcement campaign.',
      priority: 'high',
      authorId: ceoId,
      requiredActions: ['Allocate additional R&D resources', 'Prepare pricing model adjustments', 'Launch customer communication campaign']
    }
  ]);

  console.log('🎯 War Room activated.');

  // ----------------------------------------------------------------
  // 4. AI INTELLIGENCE MODULES
  // ----------------------------------------------------------------
  console.log('🤖 Generating AI intelligence insights...');

  // Pulse Intelligence - Real-time Metrics
  await db.insert(schema.pulseMetrics).values([
    {
      organizationId: orgId,
      metricName: 'Market Share APAC',
      value: '23.5',
      unit: 'percentage',
      category: 'market-position',
      metadata: { previous_value: 25.8, trend: 'declining', alert_threshold: 22.0 }
    },
    {
      organizationId: orgId,
      metricName: 'Customer Sentiment Score',
      value: '7.2',
      unit: 'score',
      category: 'customer-health',
      metadata: { benchmark: 7.5, trend: 'stable', regional_variance: { apac: 6.8, us: 7.6 } }
    },
    {
      organizationId: orgId,
      metricName: 'Revenue Risk APAC',
      value: '2400000',
      unit: 'dollars',
      category: 'financial-risk',
      metadata: { timeframe: 'Q1', confidence: 0.85, scenario: 'moderate-impact' }
    }
  ]);

  // Prism Insights - Multi-dimensional Analysis
  await db.insert(schema.prismInsights).values([
    {
      organizationId: orgId,
      insightType: 'competitive-analysis',
      title: 'SynerTech Feature Parity Assessment',
      content: 'Deep analysis reveals SynerTech CloudFlow 3.0 achieves 85% feature parity with InnovateFlow. Key gaps in our favor: advanced AI orchestration, enterprise security certifications. Their advantages: simplified pricing model, native APAC language support.',
      confidence: 0.87,
      sources: ['product-comparison', 'technical-documentation', 'demo-analysis']
    },
    {
      organizationId: orgId,
      insightType: 'market-opportunity',
      title: 'APAC Enterprise Expansion Opportunity',
      content: 'Market analysis identifies untapped opportunity in mid-market segment (500-2000 employees) in APAC. 34% growth potential with tailored offering and competitive pricing.',
      confidence: 0.92,
      sources: ['market-research', 'customer-interviews', 'sales-data']
    }
  ]);

  // Flux Adaptations - Dynamic Strategy Options
  await db.insert(schema.fluxAdaptations).values([
    {
      organizationId: orgId,
      adaptationType: 'competitive-response',
      description: 'Accelerated Feature Development Track',
      implementation: {
        timeline: '90 days',
        resources: '$750K additional R&D',
        keyFeatures: ['native-apac-integrations', 'simplified-deployment', 'cost-optimization-ai'],
        successMetrics: ['feature-gap-closure', 'customer-satisfaction', 'market-share-retention']
      },
      effectiveness: 0.78
    },
    {
      organizationId: orgId,
      adaptationType: 'pricing-strategy',
      description: 'Competitive Pricing Realignment',
      implementation: {
        timeline: '30 days',
        impact: 'APAC market pricing adjustment',
        strategy: 'value-based-tiering-with-regional-optimization',
        riskMitigation: 'grandfather-existing-customers'
      },
      effectiveness: 0.65
    }
  ]);

  // Echo Cultural Analytics
  await db.insert(schema.echoCulturalMetrics).values([
    {
      organizationId: orgId,
      dimension: 'Crisis Response Readiness',
      score: 8.4,
      trend: 'improving',
      factors: ['executive-alignment', 'cross-functional-collaboration', 'decision-speed'],
      recommendations: ['enhance-communication-protocols', 'expand-crisis-simulation-training']
    },
    {
      organizationId: orgId,
      dimension: 'Innovation Velocity',
      score: 7.8,
      trend: 'stable',
      factors: ['r&d-investment', 'team-collaboration', 'market-feedback-integration'],
      recommendations: ['accelerate-customer-feedback-loops', 'increase-rapid-prototyping']
    }
  ]);

  // Nova Innovations - Breakthrough Opportunities
  await db.insert(schema.novaInnovations).values([
    {
      organizationId: orgId,
      title: 'AI-Native APAC Integration Platform',
      description: 'Revolutionary platform combining local language processing, regulatory compliance automation, and cultural workflow adaptation for APAC markets.',
      category: 'platform-innovation',
      stage: 'concept',
      potential: 'breakthrough',
      resources: { budget: '$2.5M', team: '15 engineers', timeline: '9 months' },
      timeline: {
        phase1: 'Market research and requirements (3 months)',
        phase2: 'MVP development (4 months)', 
        phase3: 'Pilot and iteration (2 months)'
      }
    },
    {
      organizationId: orgId,
      title: 'Predictive Competitive Intelligence Engine',
      description: 'AI system that monitors competitor activities, predicts launches, and auto-generates strategic responses.',
      category: 'ai-intelligence',
      stage: 'prototype',
      potential: 'high',
      resources: { budget: '$1.2M', team: '8 engineers', timeline: '6 months' },
      timeline: {
        phase1: 'Algorithm development (2 months)',
        phase2: 'Training and validation (2 months)',
        phase3: 'Integration and testing (2 months)'
      }
    }
  ]);

  // ----------------------------------------------------------------
  // 5. STRATEGIC SCENARIOS AND RESPONSE
  // ----------------------------------------------------------------
  console.log('📋 Creating strategic scenarios...');

  const [competitiveScenario] = await db.insert(schema.strategicScenarios).values({
    organizationId: orgId,
    name: 'APAC Competitive Response',
    title: 'Strategic Response to SynerTech Threat',
    description: 'Comprehensive response framework addressing competitive threat from SynerTech CloudFlow 3.0 launch in APAC markets.',
    type: 'competitive-response',
    likelihood: 0.95,
    impact: 'high',
    triggerConditions: {
      marketShareDecline: '>10%',
      revenueImpact: '>$2M',
      customerChurnRate: '>15%'
    },
    responseStrategy: {
      immediate: 'crisis-communication-and-customer-retention',
      shortTerm: 'competitive-feature-development',
      longTerm: 'market-differentiation-and-expansion'
    },
    status: 'active',
    lastTriggered: new Date(),
    createdBy: csoId
  }).returning();

  // Create Executive Insights
  await db.insert(schema.executiveInsights).values([
    {
      organizationId: orgId,
      insightType: 'risk_prediction',
      title: 'APAC Market Share Defense Strategy',
      summary: 'Immediate action required to defend 23.5% APAC market share. Three-pronged approach recommended: Product differentiation, competitive pricing, and customer value reinforcement.',
      detailedAnalysis: 'SynerTech\'s CloudFlow 3.0 represents the most significant competitive threat in 18 months. Our analysis indicates they have achieved feature parity in core functionality while offering 20-30% pricing advantage in APAC markets. However, we maintain superior AI orchestration, enterprise security, and customer success track record.',
      keyFindings: [
        '15% immediate market share risk in APAC region',
        '$2.4M revenue impact potential in Q1',
        '85% feature parity achieved by SynerTech',
        '68% customer satisfaction advantage maintained'
      ],
      confidenceScore: 0.89,
      dataPoints: {
        marketAnalysis: 'comprehensive-competitor-benchmarking',
        customerFeedback: '247-enterprise-customer-interviews',
        technicalAssessment: 'feature-by-feature-comparison'
      },
      implications: [
        'Accelerated product development required',
        'Pricing strategy reassessment needed',
        'Customer communication essential'
      ],
      recommendedActions: [
        'Activate innovation acceleration program',
        'Deploy customer retention specialists',
        'Launch competitive differentiation campaign'
      ],
      timeHorizon: 'immediate',
      relatedScenarios: [competitiveScenario.id],
      boardReady: true
    }
  ]);

  // Create Executive Briefing
  await db.insert(schema.executiveBriefings).values({
    organizationId: orgId,
    executiveId: ceoId,
    briefingType: 'crisis-alert',
    title: 'URGENT: APAC Competitive Threat Response Required',
    executiveSummary: 'SynerTech Corp has launched CloudFlow 3.0 targeting our APAC market with 85% feature parity and significant pricing advantage. Immediate strategic response required to protect $2.4M revenue and 15% market share at risk.',
    keyInsights: [
      {
        insight: 'Competitive threat assessment',
        impact: 'High revenue risk in core market',
        confidence: 0.87
      },
      {
        insight: 'Customer retention opportunity',
        impact: '68% satisfaction advantage maintained',
        confidence: 0.94
      }
    ],
    criticalDecisions: [
      'Activate crisis response protocol',
      'Allocate additional R&D resources',
      'Implement competitive pricing strategy'
    ],
    riskAssessment: 'HIGH: Immediate threat to APAC market position. Moderate: Pricing pressure expansion risk. Low: Technology leadership position.',
    opportunityHighlights: 'Mid-market segment expansion potential identified. Innovation pipeline acceleration could create sustainable competitive advantage.',
    stakeholderImpact: 'All executive leadership required for coordinated response. Engineering and Marketing teams need immediate resource allocation.',
    recommendedActions: [
      {
        action: 'Convene crisis response team',
        timeline: 'Immediate',
        owner: 'CSO'
      },
      {
        action: 'Accelerate competitive feature development',
        timeline: '90 days',
        owner: 'CTO'
      },
      {
        action: 'Launch customer value communication campaign',
        timeline: '48 hours',
        owner: 'CMO'
      }
    ],
    timeToDecision: 'immediate',
    confidenceLevel: 87,
    dataSource: ['ai-radar', 'market-intelligence', 'competitive-analysis']
  });

  // Create Action Items
  await db.insert(schema.actionItems).values([
    {
      organizationId: orgId,
      scenarioId: competitiveScenario.id,
      title: 'Complete competitive feature gap analysis',
      description: 'Detailed technical comparison of InnovateFlow vs SynerTech CloudFlow 3.0 features, with prioritized development roadmap for closing gaps.',
      priority: 'high',
      assignedTo: ctoId,
      assignedBy: csoId,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
      estimatedEffort: 16,
      dependencies: ['technical-documentation-review', 'demo-environment-access']
    },
    {
      organizationId: orgId,
      scenarioId: competitiveScenario.id,
      title: 'Develop customer retention communication strategy',
      description: 'Create comprehensive communication plan highlighting InnovateFlow advantages and addressing competitive concerns proactively.',
      priority: 'high',
      assignedTo: cmoId,
      assignedBy: ceoId,
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
      estimatedEffort: 12,
      dependencies: ['customer-feedback-analysis', 'competitive-messaging-framework']
    },
    {
      organizationId: orgId,
      scenarioId: competitiveScenario.id,
      title: 'Model revenue impact scenarios',
      description: 'Create detailed financial models for various market share loss scenarios with recommended pricing adjustments.',
      priority: 'medium',
      assignedTo: csoId,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      estimatedEffort: 20,
      dependencies: ['market-data-analysis', 'pricing-sensitivity-research']
    }
  ]);

  // Create Supporting Activities
  await db.insert(schema.activities).values([
    {
      userId: ceoId,
      action: 'Crisis Response Activated',
      entityType: 'strategic_alert',
      entityId: competitorAlert.id
    },
    {
      userId: csoId,
      action: 'War Room Established', 
      entityType: 'war_room_session',
      entityId: warRoom.id
    },
    {
      userId: ctoId,
      action: 'Technical Assessment Initiated',
      entityType: 'action_item'
    }
  ]);

  // ----------------------------------------------------------------
  // 6. DEMO SUCCESS METRICS
  // ----------------------------------------------------------------
  console.log('📊 Setting up success metrics...');

  // Create KPIs for tracking demo narrative success
  await db.insert(schema.kpis).values([
    {
      organizationId: orgId,
      name: 'Crisis Response Time',
      description: 'Time from threat detection to strategic response activation',
      category: 'operational',
      unit: 'hours',
      target: 4.0,
      currentValue: 2.5,
      threshold: 6.0,
      owner: csoId,
      frequency: 'real-time',
      metadata: { 
        demoValue: 'Bastion detected and activated response in 2.5 hours vs industry average 24-48 hours',
        successFactor: 'ai-radar-early-detection'
      }
    },
    {
      organizationId: orgId,
      name: 'Strategic Decision Quality Score',
      description: 'AI-assessed quality of strategic decisions made during crisis',
      category: 'strategic',
      unit: 'score',
      target: 8.5,
      currentValue: 8.7,
      threshold: 7.0,
      owner: ceoId,
      frequency: 'per-decision',
      metadata: {
        demoValue: 'Executive decisions scored 8.7/10 with comprehensive data backing',
        successFactor: 'ai-enhanced-decision-support'
      }
    },
    {
      organizationId: orgId,
      name: 'Market Share Protection',
      description: 'Percentage of market share retained during competitive threat',
      category: 'market',
      unit: 'percentage',
      target: 95.0,
      currentValue: 97.2,
      threshold: 90.0,
      owner: cmoId,
      frequency: 'monthly',
      metadata: {
        demoValue: 'Protected 97.2% of market share through rapid strategic response',
        successFactor: 'proactive-competitive-intelligence'
      }
    }
  ]);

  console.log('✅ Golden Demo seeding completed successfully!');
  console.log('');
  console.log('🎭 DEMO NARRATIVE READY:');
  console.log('   👤 Login as: demo@acuetic.com');
  console.log('   🏢 Organization: Innovate Dynamics');
  console.log('   🚨 Crisis: SynerTech Competitor Threat in APAC');
  console.log('   📊 War Room: Active with executive team assembled');
  console.log('   🤖 AI Intelligence: Full modules activated with insights');
  console.log('   ⚡ Action Items: High-priority tasks assigned');
  console.log('');
  console.log('🎯 Demo Flow:');
  console.log('   1. Dashboard shows critical alert and metrics');
  console.log('   2. Strategic Alert details competitor threat');
  console.log('   3. War Room shows active crisis response');
  console.log('   4. AI modules provide deep intelligence');
  console.log('   5. Action plan with concrete next steps');
}

main().catch((error) => {
  console.error('❌ Golden Demo seeding failed:', error);
  process.exit(1);
}).finally(() => {
  console.log('🌱 Seeding script completed.');
  process.exit(0);
});