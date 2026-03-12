import { db } from '../server/db.js';
import {
  roles, permissions, rolePermissions, users, organizations, businessUnits,
  strategicScenarios, tasks, projects, pulseMetrics, fluxAdaptations,
  prismInsights, echoCulturalMetrics, novaInnovations, intelligenceReports,
  warRoomSessions, warRoomUpdates, executiveBriefings, strategicAlerts,
  executiveInsights, activities
} from '../shared/schema.js';
import { nanoid } from 'nanoid';

// Realistic company data
const COMPANY_PROFILES = [
  {
    name: "TechFlow Dynamics",
    industry: "Software & Technology",
    size: 8500,
    type: "enterprise" as const,
    description: "Global enterprise software solutions provider specializing in digital transformation",
    headquarters: "San Francisco, CA",
    domain: "techflow.com"
  },
  {
    name: "Meridian Manufacturing",
    industry: "Manufacturing & Industrial",
    size: 12000,
    type: "enterprise" as const, 
    description: "Advanced manufacturing solutions with operations across North America and Europe",
    headquarters: "Detroit, MI",
    domain: "meridianmfg.com"
  },
  {
    name: "Catalyst Financial Group",
    industry: "Financial Services",
    size: 3200,
    type: "mid-market" as const,
    description: "Regional financial services firm providing banking and investment solutions",
    headquarters: "Charlotte, NC", 
    domain: "catalystfg.com"
  }
];

// Executive profiles
const EXECUTIVE_PROFILES = [
  { firstName: "Sarah", lastName: "Chen", department: "Executive", team: "C-Suite", title: "CEO" },
  { firstName: "Michael", lastName: "Rodriguez", department: "Executive", team: "C-Suite", title: "COO" },
  { firstName: "Jennifer", lastName: "Thompson", department: "Finance", team: "C-Suite", title: "CFO" },
  { firstName: "David", lastName: "Kumar", department: "Technology", team: "C-Suite", title: "CTO" },
  { firstName: "Amanda", lastName: "Williams", department: "Strategy", team: "Leadership", title: "Chief Strategy Officer" }
];

// Strategic scenarios
const STRATEGIC_SCENARIOS = [
  {
    name: "Supply Chain Disruption Recovery",
    title: "Critical Supplier Bankruptcy - Production Impact Assessment",
    description: "Major automotive component supplier filed for bankruptcy, affecting 40% of production capacity. Immediate alternative sourcing and production adjustment required.",
    type: "supply_chain",
    likelihood: "0.85",
    impact: "high" as const,
    status: "active"
  },
  {
    name: "Market Expansion Opportunity",
    title: "European Market Entry - Strategic Assessment",
    description: "Key competitor withdrawn from European market creating $200M opportunity. Rapid market entry strategy required to capture market share.",
    type: "market_opportunity", 
    likelihood: "0.72",
    impact: "high" as const,
    status: "active"
  },
  {
    name: "Digital Transformation Acceleration", 
    title: "Cloud Migration - Infrastructure Modernization",
    description: "Complete migration to cloud infrastructure to reduce costs by 30% and improve scalability for future growth.",
    type: "technology",
    likelihood: "0.95",
    impact: "high" as const,
    status: "draft"
  }
];

async function basicComprehensiveSeed() {
  console.log('🌱 Starting basic comprehensive database seed...');
  
  try {
    // 1. Clear existing data in core tables only
    console.log('🧹 Clearing existing data...');
    await db.delete(activities);
    await db.delete(executiveInsights);
    await db.delete(strategicAlerts);
    await db.delete(executiveBriefings);
    await db.delete(warRoomUpdates);
    await db.delete(warRoomSessions);
    await db.delete(intelligenceReports);
    await db.delete(novaInnovations);
    await db.delete(echoCulturalMetrics);
    await db.delete(prismInsights);
    await db.delete(fluxAdaptations);
    await db.delete(pulseMetrics);
    await db.delete(tasks);
    await db.delete(projects);
    await db.delete(strategicScenarios);
    await db.delete(users);
    await db.delete(businessUnits);
    await db.delete(organizations);
    await db.delete(rolePermissions);
    await db.delete(roles);
    await db.delete(permissions);

    // 2. Create permissions
    console.log('🔐 Creating permissions...');
    const permissionsData = [
      { resource: 'organization', action: 'create', description: 'Create new organizations' },
      { resource: 'user', action: 'manage', description: 'Manage user accounts and permissions' },
      { resource: 'scenario', action: 'create', description: 'Create strategic scenarios' },
      { resource: 'scenario', action: 'manage', description: 'Edit and delete strategic scenarios' },
      { resource: 'analytics', action: 'view', description: 'Access analytics and reporting' },
      { resource: 'warroom', action: 'manage', description: 'Create and manage war room sessions' },
      { resource: 'briefing', action: 'access', description: 'Access executive briefings' },
      { resource: 'insight', action: 'access', description: 'Access AI-generated insights' }
    ];
    const createdPermissions = await db.insert(permissions).values(permissionsData).returning();

    // 3. Create roles
    console.log('👥 Creating roles...');
    const rolesData = [
      { name: 'CEO', category: 'executive', level: 10, description: 'Chief Executive Officer with full access' },
      { name: 'COO', category: 'executive', level: 9, description: 'Chief Operating Officer' },
      { name: 'CFO', category: 'executive', level: 9, description: 'Chief Financial Officer' },
      { name: 'CTO', category: 'executive', level: 9, description: 'Chief Technology Officer' },
      { name: 'Strategy Analyst', category: 'analyst', level: 4, description: 'Strategic analysis and reporting' }
    ];
    const createdRoles = await db.insert(roles).values(rolesData).returning();

    // 4. Assign permissions to roles
    console.log('🔗 Assigning permissions to roles...');
    const ceoRole = createdRoles.find(r => r.name === 'CEO');
    if (ceoRole) {
      const allPermissionAssignments = createdPermissions.map(p => ({ 
        roleId: ceoRole.id, 
        permissionId: p.id 
      }));
      await db.insert(rolePermissions).values(allPermissionAssignments);
    }

    // 5. Create organizations
    console.log('🏢 Creating organizations...');
    const organizationsWithIds = [];
    for (const company of COMPANY_PROFILES) {
      const ownerUserId = nanoid();
      const [org] = await db.insert(organizations).values({
        ...company,
        ownerId: ownerUserId,
        adaptabilityScore: (Math.random() * 4 + 6).toFixed(1),
        onboardingCompleted: true,
        subscriptionTier: company.size > 5000 ? 'enterprise' : 'professional'
      }).returning();
      organizationsWithIds.push({ ...org, ownerUserId });
    }

    // 6. Create business units
    console.log('🏗️ Creating business units...');
    const createdBusinessUnits = [];
    for (const org of organizationsWithIds) {
      const units = [
        { name: "Operations", businessFunction: "Operations", budget: "25000000" },
        { name: "Technology", businessFunction: "Technology", budget: "12000000" },
        { name: "Sales & Marketing", businessFunction: "Revenue", budget: "15000000" },
        { name: "Finance", businessFunction: "Support", budget: "2500000" }
      ];
      
      for (const unit of units) {
        const [businessUnit] = await db.insert(businessUnits).values({
          organizationId: org.id,
          name: unit.name,
          businessFunction: unit.businessFunction,
          budget: unit.budget,
          headcount: Math.floor(Math.random() * 200) + 50,
          isActive: true
        }).returning();
        createdBusinessUnits.push(businessUnit);
      }
    }

    // 7. Create users
    console.log('👤 Creating users...');
    const createdUsers = [];
    for (const org of organizationsWithIds) {
      // Create owner/CEO user
      const ceoRole = createdRoles.find(r => r.name === 'CEO');
      const [ownerUser] = await db.insert(users).values({
        id: org.ownerUserId,
        email: `ceo@${org.domain}`,
        firstName: "Sarah",
        lastName: "Chen", 
        organizationId: org.id,
        roleId: ceoRole?.id,
        department: "Executive",
        team: "C-Suite",
        accessLevel: "executive",
        lastLoginAt: new Date()
      }).returning();
      createdUsers.push(ownerUser);

      // Create other executives
      const orgBusinessUnits = createdBusinessUnits.filter(bu => bu.organizationId === org.id);
      for (let i = 0; i < EXECUTIVE_PROFILES.length - 1; i++) {
        const profile = EXECUTIVE_PROFILES[i + 1];
        const role = createdRoles.find(r => r.name === 'COO') || createdRoles[1];
        const businessUnit = orgBusinessUnits[i % orgBusinessUnits.length];

        const [user] = await db.insert(users).values({
          email: `${profile.firstName.toLowerCase()}.${profile.lastName.toLowerCase()}@${org.domain}`,
          firstName: profile.firstName,
          lastName: profile.lastName,
          organizationId: org.id,
          businessUnitId: businessUnit?.id,
          roleId: role?.id,
          department: profile.department,
          team: profile.team,
          managerId: ownerUser.id,
          accessLevel: 'executive',
          lastLoginAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        }).returning();
        createdUsers.push(user);
      }

      // Create analysts
      for (let i = 0; i < 8; i++) {
        const analystRole = createdRoles.find(r => r.name === 'Strategy Analyst');
        const businessUnit = orgBusinessUnits[Math.floor(Math.random() * orgBusinessUnits.length)];
        
        const [user] = await db.insert(users).values({
          email: `analyst${i + 1}@${org.domain}`,
          firstName: `Analyst${i + 1}`,
          lastName: "User",
          organizationId: org.id,
          businessUnitId: businessUnit?.id,
          roleId: analystRole?.id,
          department: "Strategy",
          team: "Analytics",
          accessLevel: "analyst",
          lastLoginAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        }).returning();
        createdUsers.push(user);
      }
    }

    // 8. Create strategic scenarios
    console.log('📋 Creating strategic scenarios...');
    const createdScenarios = [];
    for (const org of organizationsWithIds) {
      const orgUsers = createdUsers.filter(u => u.organizationId === org.id);
      const creator = orgUsers.find(u => u.accessLevel === 'executive') || orgUsers[0];
      
      for (const scenario of STRATEGIC_SCENARIOS) {
        const [newScenario] = await db.insert(strategicScenarios).values({
          organizationId: org.id,
          name: scenario.name,
          title: scenario.title,
          description: scenario.description,
          type: scenario.type,
          likelihood: scenario.likelihood,
          impact: scenario.impact,
          status: scenario.status,
          createdBy: creator.id,
          triggerConditions: {
            indicators: [`${org.industry} market volatility > 15%`, "Supplier reliability score < 85%"],
            thresholds: { financial_impact: 1000000, timeline: "30_days" }
          },
          responseStrategy: {
            immediate_actions: ["Activate crisis response team", "Assess impact scope"],
            short_term: ["Implement contingency plans", "Communicate with stakeholders"],
            long_term: ["Review and update processes", "Strengthen risk mitigation"]
          }
        }).returning();
        createdScenarios.push(newScenario);
      }
    }

    // 9. Create tasks for scenarios
    console.log('✅ Creating tasks...');
    const taskTemplates = [
      "Assess immediate impact and scope",
      "Activate response team and stakeholders", 
      "Implement primary contingency plan",
      "Communicate status to executive leadership",
      "Monitor key performance indicators"
    ];

    for (const scenario of createdScenarios) {
      const orgUsers = createdUsers.filter(u => u.organizationId === scenario.organizationId);
      for (let i = 0; i < 3; i++) {
        const assignee = orgUsers[Math.floor(Math.random() * orgUsers.length)];
        await db.insert(tasks).values({
          scenarioId: scenario.id,
          description: taskTemplates[i % taskTemplates.length],
          priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
          status: ['draft', 'To Do', 'In Progress', 'Completed'][Math.floor(Math.random() * 4)],
          assignedTo: assignee.id,
          estimatedHours: (Math.random() * 16 + 4).toFixed(1),
          dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000)
        });
      }
    }

    // 10. Create pulse metrics
    console.log('📊 Creating pulse metrics...');
    const metricCategories = [
      "operational_efficiency", "financial_performance", "employee_engagement", 
      "customer_satisfaction", "innovation_index", "risk_exposure"
    ];
    
    for (const org of organizationsWithIds) {
      for (let i = 0; i < 20; i++) {
        const category = metricCategories[Math.floor(Math.random() * metricCategories.length)];
        await db.insert(pulseMetrics).values({
          organizationId: org.id,
          metricName: `${category.replace('_', ' ')} Score`,
          value: (Math.random() * 100).toFixed(2),
          unit: category.includes('performance') || category.includes('satisfaction') ? 'percentage' : 'index',
          category: category,
          timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          metadata: {
            data_source: "enterprise_systems",
            confidence_level: 0.85 + Math.random() * 0.15,
            trend: ["up", "down", "stable"][Math.floor(Math.random() * 3)]
          }
        });
      }
    }

    // 11. Create prism insights
    console.log('🔍 Creating prism insights...');
    for (const org of organizationsWithIds) {
      for (let i = 0; i < 8; i++) {
        await db.insert(prismInsights).values({
          organizationId: org.id,
          insightType: ["market_analysis", "risk_assessment", "opportunity_forecast"][Math.floor(Math.random() * 3)],
          title: `Strategic Insight ${i + 1}: ${org.industry} Sector Analysis`,
          content: `Comprehensive analysis reveals emerging trends in ${org.industry} sector with significant implications for strategic positioning and competitive advantage.`,
          confidence: (Math.random() * 30 + 70).toFixed(2), // 70-100
          sources: {
            data_points: Math.floor(Math.random() * 1000) + 500,
            external_sources: Math.floor(Math.random() * 10) + 5,
            internal_metrics: Math.floor(Math.random() * 20) + 10
          }
        });
      }
    }

    // 12. Create innovation projects
    console.log('💡 Creating innovation data...');
    for (const org of organizationsWithIds) {
      for (let i = 0; i < 6; i++) {
        await db.insert(novaInnovations).values({
          organizationId: org.id,
          title: `Innovation Initiative ${i + 1}: ${org.industry} Advancement`,
          description: `Strategic innovation project focused on next-generation ${org.industry} capabilities and market differentiation.`,
          category: ["technology", "process", "product", "service"][Math.floor(Math.random() * 4)],
          stage: ["ideation", "research", "development", "testing", "pilot"][Math.floor(Math.random() * 5)],
          potential: ["medium", "high", "breakthrough"][Math.floor(Math.random() * 3)],
          resources: {
            budget_allocated: Math.floor(Math.random() * 1000000) + 100000,
            team_size: Math.floor(Math.random() * 10) + 3,
            timeline_months: Math.floor(Math.random() * 18) + 6
          },
          timeline: {
            start_date: "2024-01-01",
            milestone_1: "2024-04-01",
            target_completion: "2024-12-01"
          }
        });
      }
    }

    // 13. Create executive briefings
    console.log('📖 Creating executive briefings...');
    for (const org of organizationsWithIds) {
      const executives = createdUsers.filter(u => 
        u.organizationId === org.id && u.accessLevel === 'executive'
      );
      
      for (const exec of executives.slice(0, 2)) {
        await db.insert(executiveBriefings).values({
          organizationId: org.id,
          executiveId: exec.id,
          briefingType: 'daily',
          title: `Daily Strategic Brief - ${new Date().toLocaleDateString()}`,
          summary: `Key organizational insights and strategic developments affecting ${org.name}. Market conditions show continued growth in ${org.industry} sector.`,
          keyInsights: [
            { type: "market_trend", content: "Industry growth accelerating at 12% YoY", impact: "high" },
            { type: "operational", content: "Supply chain efficiency improved by 8%", impact: "medium" }
          ],
          actionItems: [
            { action: "Review market expansion strategy", owner: exec.id, due_date: "2024-01-15" }
          ],
          riskAlerts: [
            { risk: "Regulatory changes in key markets", severity: "medium", timeline: "Q2 2024" }
          ],
          priority: 'high',
          readingTime: Math.floor(Math.random() * 8) + 5
        });
      }
    }

    // 14. Create activities
    console.log('📈 Creating activities...');
    const activityTypes = [
      "scenario_created", "task_completed", "briefing_reviewed", "analysis_generated", "decision_made"
    ];

    for (const org of organizationsWithIds) {
      const orgUsers = createdUsers.filter(u => u.organizationId === org.id);
      
      for (let i = 0; i < 15; i++) {
        const user = orgUsers[Math.floor(Math.random() * orgUsers.length)];
        const activity = activityTypes[Math.floor(Math.random() * activityTypes.length)];
        
        await db.insert(activities).values({
          userId: user.id,
          action: activity.replace('_', ' '),
          entityType: activity.split('_')[0],
          entityId: nanoid(),
          createdAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000)
        });
      }
    }

    console.log('\n✅ Basic comprehensive seed complete!');
    console.log(`📊 Created realistic test data for ${organizationsWithIds.length} organizations`);
    console.log(`👥 Generated ${createdUsers.length} users with realistic hierarchies`);
    console.log(`📋 Built ${createdScenarios.length} strategic scenarios with real business challenges`);
    console.log(`🤖 Populated AI intelligence modules with meaningful metrics and insights`);
    console.log(`🏢 Established complete organizational structures with business units and roles`);
    console.log('\n🚀 Your platform now has robust real-world test data for compelling demos!');

  } catch (error) {
    console.error('❌ Basic comprehensive seed failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

basicComprehensiveSeed();