import { db } from '../server/db.js';
import {
  roles, permissions, rolePermissions, users, organizations, businessUnits,
  strategicScenarios, tasks, projects, pulseMetrics, fluxAdaptations,
  prismInsights, echoCulturalMetrics, novaInnovations, intelligenceReports,
  warRoomSessions, warRoomUpdates, executiveBriefings, strategicAlerts,
  executiveInsights, risks, initiatives, kpis, insights, recommendations,
  evidence, activities, decisionOutcomes
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
  },
  {
    name: "BioVantage Research",
    industry: "Biotechnology",
    size: 950,
    type: "mid-market" as const,
    description: "Cutting-edge biotechnology research and pharmaceutical development",
    headquarters: "Boston, MA",
    domain: "biovantage.com"
  },
  {
    name: "GreenPath Energy",
    industry: "Renewable Energy",
    size: 1800,
    type: "mid-market" as const,
    description: "Sustainable energy solutions and smart grid technology development",
    headquarters: "Austin, TX",
    domain: "greenpathenergy.com"
  }
];

// Executive profiles for realistic user hierarchies
const EXECUTIVE_PROFILES = [
  { firstName: "Sarah", lastName: "Chen", department: "Executive", team: "C-Suite", title: "CEO" },
  { firstName: "Michael", lastName: "Rodriguez", department: "Executive", team: "C-Suite", title: "COO" },
  { firstName: "Jennifer", lastName: "Thompson", department: "Finance", team: "C-Suite", title: "CFO" },
  { firstName: "David", lastName: "Kumar", department: "Technology", team: "C-Suite", title: "CTO" },
  { firstName: "Amanda", lastName: "Williams", department: "Strategy", team: "Leadership", title: "Chief Strategy Officer" },
  { firstName: "Robert", lastName: "Johnson", department: "Operations", team: "Leadership", title: "VP Operations" },
  { firstName: "Lisa", lastName: "Martinez", department: "Human Resources", team: "Leadership", title: "CHRO" },
  { firstName: "James", lastName: "Brown", department: "Sales", team: "Leadership", title: "VP Sales" },
  { firstName: "Maria", lastName: "Garcia", department: "Marketing", team: "Leadership", title: "CMO" },
  { firstName: "Thomas", lastName: "Wilson", department: "Risk Management", team: "Leadership", title: "Chief Risk Officer" }
];

// Strategic scenario templates based on real business challenges
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
    name: "Regulatory Compliance Initiative",
    title: "GDPR Enhancement - Data Privacy Overhaul",
    description: "New data privacy regulations require comprehensive system updates and process changes within 6 months.",
    type: "regulatory",
    likelihood: "1.00",
    impact: "moderate" as const,
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
  },
  {
    name: "Cybersecurity Enhancement",
    title: "Zero Trust Security Implementation",
    description: "Implementation of zero trust security model following industry-wide increase in cyber threats and attacks.",
    type: "security",
    likelihood: "0.88",
    impact: "moderate" as const, 
    status: "active"
  },
  {
    name: "Sustainability Initiative",
    title: "Carbon Neutral Operations - 2025 Target",
    description: "Strategic initiative to achieve carbon neutral operations by 2025 through renewable energy and process optimization.",
    type: "sustainability",
    likelihood: "0.90",
    impact: "moderate" as const,
    status: "draft"
  }
];

// Business unit structures
const BUSINESS_UNITS = [
  { name: "North American Operations", businessFunction: "Regional Operations", budget: "25000000" },
  { name: "European Division", businessFunction: "Regional Operations", budget: "18000000" },
  { name: "Product Development", businessFunction: "Research & Development", budget: "12000000" },
  { name: "Manufacturing", businessFunction: "Operations", budget: "35000000" },
  { name: "Sales & Marketing", businessFunction: "Revenue", budget: "15000000" },
  { name: "Information Technology", businessFunction: "Support", budget: "8000000" },
  { name: "Human Resources", businessFunction: "Support", budget: "3500000" },
  { name: "Finance & Accounting", businessFunction: "Support", budget: "2500000" }
];

async function comprehensiveSeed() {
  console.log('🌱 Starting comprehensive database seed...');
  
  try {
    // 1. Clear existing data in proper order (respecting foreign keys)
    console.log('🧹 Clearing existing data...');
    await db.delete(activities);
    await db.delete(decisionOutcomes);
    await db.delete(recommendations);
    await db.delete(insights);
    await db.delete(evidence);
    await db.delete(kpis);
    await db.delete(initiatives);
    await db.delete(risks);
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

    // 2. Create comprehensive permissions
    console.log('🔐 Creating permissions...');
    const permissionsData = [
      { resource: 'organization', action: 'create', description: 'Create new organizations' },
      { resource: 'user', action: 'manage', description: 'Manage user accounts and permissions' },
      { resource: 'scenario', action: 'create', description: 'Create strategic scenarios' },
      { resource: 'scenario', action: 'manage', description: 'Edit and delete strategic scenarios' },
      { resource: 'analytics', action: 'view', description: 'Access analytics and reporting' },
      { resource: 'warroom', action: 'manage', description: 'Create and manage war room sessions' },
      { resource: 'briefing', action: 'access', description: 'Access executive briefings' },
      { resource: 'alert', action: 'manage', description: 'Create and manage strategic alerts' },
      { resource: 'insight', action: 'access', description: 'Access AI-generated insights' },
      { resource: 'project', action: 'manage', description: 'Create and manage projects' },
      { resource: 'financial', action: 'view', description: 'Access financial metrics and KPIs' },
      { resource: 'compliance', action: 'manage', description: 'Manage compliance and audit data' }
    ];
    const createdPermissions = await db.insert(permissions).values(permissionsData).returning();

    // 3. Create realistic roles
    console.log('👥 Creating roles...');
    const rolesData = [
      { name: 'CEO', category: 'executive', level: 10, description: 'Chief Executive Officer with full access' },
      { name: 'COO', category: 'executive', level: 9, description: 'Chief Operating Officer' },
      { name: 'CFO', category: 'executive', level: 9, description: 'Chief Financial Officer' },
      { name: 'CTO', category: 'executive', level: 9, description: 'Chief Technology Officer' },
      { name: 'VP Operations', category: 'executive', level: 8, description: 'Vice President of Operations' },
      { name: 'VP Sales', category: 'executive', level: 8, description: 'Vice President of Sales' },
      { name: 'Senior Manager', category: 'strategy', level: 6, description: 'Senior management role' },
      { name: 'Strategy Analyst', category: 'analyst', level: 4, description: 'Strategic analysis and reporting' },
      { name: 'Operations Analyst', category: 'analyst', level: 3, description: 'Operational analysis and optimization' },
      { name: 'System Admin', category: 'system', level: 7, description: 'System administration and management' }
    ];
    const createdRoles = await db.insert(roles).values(rolesData).returning();

    // 4. Assign permissions to roles
    console.log('🔗 Assigning permissions to roles...');
    const ceoRole = createdRoles.find(r => r.name === 'CEO');
    const cooRole = createdRoles.find(r => r.name === 'COO');
    const cfoRole = createdRoles.find(r => r.name === 'CFO');

    if (ceoRole) {
      // CEO gets all permissions
      const allPermissionAssignments = createdPermissions.map(p => ({ 
        roleId: ceoRole.id, 
        permissionId: p.id 
      }));
      await db.insert(rolePermissions).values(allPermissionAssignments);
    }

    if (cooRole) {
      // COO gets operational permissions
      const opPermissions = createdPermissions.filter(p => 
        ['manage', 'view', 'access'].includes(p.action) && 
        ['scenario', 'analytics', 'warroom', 'project', 'insight'].includes(p.resource)
      );
      await db.insert(rolePermissions).values(
        opPermissions.map(p => ({ roleId: cooRole.id, permissionId: p.id }))
      );
    }

    if (cfoRole) {
      // CFO gets financial permissions
      const finPermissions = createdPermissions.filter(p => 
        ['view', 'access', 'manage'].includes(p.action) && 
        ['analytics', 'financial', 'briefing', 'compliance'].includes(p.resource)
      );
      await db.insert(rolePermissions).values(
        finPermissions.map(p => ({ roleId: cfoRole.id, permissionId: p.id }))
      );
    }

    // 5. Create organizations
    console.log('🏢 Creating organizations...');
    const organizationsWithIds = [];
    for (const company of COMPANY_PROFILES) {
      const ownerUserId = nanoid();
      const [org] = await db.insert(organizations).values({
        ...company,
        ownerId: ownerUserId,
        adaptabilityScore: (Math.random() * 4 + 6).toFixed(1), // 6.0 - 10.0
        onboardingCompleted: true,
        subscriptionTier: company.size > 5000 ? 'enterprise' : 'professional'
      }).returning();
      organizationsWithIds.push({ ...org, ownerUserId });
    }

    // 6. Create business units for each organization
    console.log('🏗️ Creating business units...');
    const createdBusinessUnits = [];
    for (const org of organizationsWithIds) {
      for (const unit of BUSINESS_UNITS) {
        const [businessUnit] = await db.insert(businessUnits).values({
          organizationId: org.id,
          name: unit.name,
          businessFunction: unit.businessFunction,
          budget: unit.budget,
          headcount: Math.floor(Math.random() * 500) + 50,
          isActive: true
        }).returning();
        createdBusinessUnits.push(businessUnit);
      }
    }

    // 7. Create users with realistic hierarchies
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

      // Create other executives and managers
      const orgBusinessUnits = createdBusinessUnits.filter(bu => bu.organizationId === org.id);
      for (let i = 0; i < EXECUTIVE_PROFILES.length - 1; i++) {
        const profile = EXECUTIVE_PROFILES[i + 1];
        const role = createdRoles.find(r => 
          profile.title.includes('VP') ? r.name.includes('VP') : 
          profile.title.includes('Chief') ? r.name === profile.title.split(' ').pop() :
          r.name === 'Senior Manager'
        ) || createdRoles.find(r => r.name === 'Senior Manager');
        
        const businessUnit = orgBusinessUnits.find(bu => 
          bu.name && bu.name.toLowerCase().includes(profile.department.toLowerCase())
        ) || orgBusinessUnits[0];

        const [user] = await db.insert(users).values({
          email: `${profile.firstName.toLowerCase()}.${profile.lastName.toLowerCase()}@${org.domain}`,
          firstName: profile.firstName,
          lastName: profile.lastName,
          organizationId: org.id,
          businessUnitId: businessUnit?.id,
          roleId: role?.id,
          department: profile.department,
          team: profile.team,
          managerId: i === 0 ? ownerUser.id : undefined,
          accessLevel: profile.title.includes('Chief') || profile.title.includes('VP') ? 'executive' : 'manager',
          lastLoginAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }).returning();
        createdUsers.push(user);
      }

      // Create additional analysts and staff
      for (let i = 0; i < 15; i++) {
        const analystRole = createdRoles.find(r => r.name && r.name.includes('Analyst'));
        const businessUnit = orgBusinessUnits[Math.floor(Math.random() * orgBusinessUnits.length)];
        
        const [user] = await db.insert(users).values({
          email: `analyst${i + 1}@${org.domain}`,
          firstName: `Analyst${i + 1}`,
          lastName: "User",
          organizationId: org.id,
          businessUnitId: businessUnit?.id,
          roleId: analystRole?.id,
          department: businessUnit?.businessFunction || "Analysis",
          team: "Analytics",
          accessLevel: "analyst",
          lastLoginAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Last 30 days
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
      "Monitor key performance indicators",
      "Execute risk mitigation strategies",
      "Document lessons learned and improvements"
    ];

    for (const scenario of createdScenarios) {
      const orgUsers = createdUsers.filter(u => u.organizationId === scenario.organizationId);
      for (let i = 0; i < 5; i++) {
        const assignee = orgUsers[Math.floor(Math.random() * orgUsers.length)];
        await db.insert(tasks).values({
          scenarioId: scenario.id,
          description: taskTemplates[i % taskTemplates.length],
          priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
          status: ['draft', 'To Do', 'In Progress', 'Completed'][Math.floor(Math.random() * 4)],
          assignedTo: assignee.id,
          estimatedHours: (Math.random() * 16 + 4).toFixed(1), // 4-20 hours
          dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000) // Next 30 days
        });
      }
    }

    // 10. Create pulse metrics (AI intelligence data)
    console.log('📊 Creating pulse metrics...');
    const metricCategories = [
      "operational_efficiency", "financial_performance", "employee_engagement", 
      "customer_satisfaction", "innovation_index", "risk_exposure", "market_position"
    ];
    
    for (const org of organizationsWithIds) {
      for (let i = 0; i < 50; i++) {
        const category = metricCategories[Math.floor(Math.random() * metricCategories.length)];
        await db.insert(pulseMetrics).values({
          organizationId: org.id,
          metricName: `${category.replace('_', ' ')} Score`,
          value: (Math.random() * 100).toFixed(2),
          unit: category.includes('performance') || category.includes('satisfaction') ? 'percentage' : 'index',
          category: category,
          timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Last 7 days
          metadata: {
            data_source: "enterprise_systems",
            confidence_level: 0.85 + Math.random() * 0.15,
            trend: ["up", "down", "stable"][Math.floor(Math.random() * 3)]
          }
        });
      }
    }

    // 11. Create executive briefings
    console.log('📖 Creating executive briefings...');
    for (const org of organizationsWithIds) {
      const executives = createdUsers.filter(u => 
        u.organizationId === org.id && u.accessLevel === 'executive'
      );
      
      for (const exec of executives.slice(0, 3)) {
        await db.insert(executiveBriefings).values({
          organizationId: org.id,
          executiveId: exec.id,
          briefingType: 'daily',
          title: `Daily Strategic Brief - ${new Date().toLocaleDateString()}`,
          summary: `Key organizational insights and strategic developments affecting ${org.name}. Market conditions remain dynamic with emerging opportunities in ${org.industry}.`,
          keyInsights: [
            { type: "market_trend", content: "Industry growth accelerating at 12% YoY", impact: "high" },
            { type: "operational", content: "Supply chain efficiency improved by 8%", impact: "medium" },
            { type: "competitive", content: "Key competitor announced major acquisition", impact: "high" }
          ],
          actionItems: [
            { action: "Review market expansion strategy", owner: exec.id, due_date: "2024-01-15" },
            { action: "Assess competitive response options", owner: exec.id, due_date: "2024-01-10" }
          ],
          riskAlerts: [
            { risk: "Regulatory changes in EU market", severity: "medium", timeline: "Q2 2024" }
          ],
          priority: 'high',
          readingTime: Math.floor(Math.random() * 10) + 5 // 5-15 minutes
        });
      }
    }

    // 12. Create strategic alerts
    console.log('🚨 Creating strategic alerts...');
    const alertTypes = ['opportunity', 'threat', 'anomaly', 'milestone', 'regulatory'] as const;
    for (const org of organizationsWithIds) {
      for (let i = 0; i < 8; i++) {
        const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        await db.insert(strategicAlerts).values({
          organizationId: org.id,
          alertType: alertType,
          title: `${alertType.charAt(0).toUpperCase() + alertType.slice(1)} Alert: ${org.industry} Sector`,
          description: `Strategic ${alertType} detected in ${org.industry} sector requiring immediate attention and assessment.`,
          severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
          sourceSystem: "ai_intelligence_engine",
          triggerConditions: {
            threshold_breach: true,
            confidence_score: 0.75 + Math.random() * 0.25
          },
          recommendedActions: [
            { action: "Assess immediate impact", priority: "high", timeline: "24h" },
            { action: "Convene response team", priority: "medium", timeline: "48h" }
          ],
          impactAssessment: {
            financial_impact: Math.floor(Math.random() * 5000000),
            operational_impact: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
            timeline: ["immediate", "short_term", "medium_term"][Math.floor(Math.random() * 3)]
          }
        });
      }
    }

    // 13. Create innovation pipeline data
    console.log('💡 Creating innovation data...');
    const innovationStages = ['ideation', 'research', 'development', 'testing', 'pilot', 'scaling'];
    for (const org of organizationsWithIds) {
      for (let i = 0; i < 12; i++) {
        await db.insert(novaInnovations).values({
          organizationId: org.id,
          title: `Innovation Project ${i + 1}: ${org.industry} Enhancement`,
          description: `Strategic innovation initiative focused on advancing ${org.industry} capabilities through emerging technologies and process optimization.`,
          category: ["technology", "process", "product", "service"][Math.floor(Math.random() * 4)],
          stage: innovationStages[Math.floor(Math.random() * innovationStages.length)],
          potential: ["low", "medium", "high", "breakthrough"][Math.floor(Math.random() * 4)],
          resources: {
            budget_allocated: Math.floor(Math.random() * 2000000) + 100000,
            team_size: Math.floor(Math.random() * 15) + 3,
            timeline_months: Math.floor(Math.random() * 24) + 6
          },
          timeline: {
            start_date: "2024-01-01",
            milestone_1: "2024-03-01",
            milestone_2: "2024-06-01", 
            target_completion: "2024-12-01"
          }
        });
      }
    }

    // 14. Create activities and decision outcomes
    console.log('📈 Creating activities and outcomes...');
    const activityTypes = [
      "scenario_created", "task_completed", "briefing_reviewed", "alert_acknowledged",
      "project_updated", "analysis_generated", "decision_made", "strategy_revised"
    ];

    for (const org of organizationsWithIds) {
      const orgUsers = createdUsers.filter(u => u.organizationId === org.id);
      
      // Create activities
      for (let i = 0; i < 30; i++) {
        const user = orgUsers[Math.floor(Math.random() * orgUsers.length)];
        const activity = activityTypes[Math.floor(Math.random() * activityTypes.length)];
        
        await db.insert(activities).values({
          userId: user.id,
          action: activity.replace('_', ' '),
          entityType: activity.split('_')[0],
          entityId: nanoid(),
          createdAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000) // Last 14 days
        });
      }

      // Create decision outcomes
      await db.insert(decisionOutcomes).values({
        organizationId: org.id,
        decisionTitle: `Strategic Market Expansion - ${org.name}`,
        decisionDescription: `Decision to expand operations into new geographic markets based on strategic analysis and market opportunities.`,
        decisionMaker: orgUsers.find(u => u.accessLevel === 'executive')?.id || orgUsers[0].id,
        outcome: "approved",
        impactAssessment: {
          financial_impact: Math.floor(Math.random() * 10000000) + 1000000,
          timeline: "12_months",
          success_probability: 0.75 + Math.random() * 0.25
        },
        implementationPlan: {
          phases: ["market_research", "team_setup", "pilot_launch", "full_deployment"],
          timeline: "Q1 2024 - Q4 2024",
          budget: Math.floor(Math.random() * 5000000) + 500000
        },
        followUpRequired: true,
        reviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days from now
      });
    }

    console.log('\n✅ Comprehensive seed complete!');
    console.log(`📊 Created realistic test data for ${organizationsWithIds.length} organizations`);
    console.log(`👥 Generated ${createdUsers.length} users with realistic hierarchies`);
    console.log(`📋 Built ${createdScenarios.length} strategic scenarios with real business challenges`);
    console.log(`🤖 Populated AI intelligence modules with meaningful metrics and insights`);
    console.log(`🏢 Established complete organizational structures with business units and roles`);
    console.log('\n🚀 Your platform now has comprehensive real-world test data for powerful demos!');

  } catch (error) {
    console.error('❌ Comprehensive seed failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

comprehensiveSeed();