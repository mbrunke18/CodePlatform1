import { db } from '../server/db.js';
import {
  roles, permissions, rolePermissions, users, organizations,
  strategicScenarios, tasks, activities
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
  { firstName: "Sarah", lastName: "Chen", department: "Executive", title: "CEO" },
  { firstName: "Michael", lastName: "Rodriguez", department: "Operations", title: "COO" },
  { firstName: "Jennifer", lastName: "Thompson", department: "Finance", title: "CFO" },
  { firstName: "David", lastName: "Kumar", department: "Technology", title: "CTO" },
  { firstName: "Amanda", lastName: "Williams", department: "Strategy", title: "Chief Strategy Officer" }
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
  },
  {
    name: "Cybersecurity Enhancement",
    title: "Zero Trust Security Implementation",
    description: "Implementation of zero trust security model following industry-wide increase in cyber threats and attacks.",
    type: "security",
    likelihood: "0.88",
    impact: "moderate" as const, 
    status: "active"
  }
];

async function minimalSeed() {
  console.log('🌱 Starting minimal comprehensive database seed...');
  
  try {
    // 1. Clear existing data in core tables only
    console.log('🧹 Clearing existing data...');
    await db.delete(activities);
    await db.delete(tasks);
    await db.delete(strategicScenarios);
    await db.delete(users);
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
      { resource: 'task', action: 'manage', description: 'Create and manage tasks' }
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

    // 6. Create users
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
      for (let i = 1; i < EXECUTIVE_PROFILES.length; i++) {
        const profile = EXECUTIVE_PROFILES[i];
        const role = createdRoles.find(r => r.name === 'COO') || createdRoles[1];

        const [user] = await db.insert(users).values({
          email: `${profile.firstName.toLowerCase()}.${profile.lastName.toLowerCase()}@${org.domain}`,
          firstName: profile.firstName,
          lastName: profile.lastName,
          organizationId: org.id,
          roleId: role?.id,
          department: profile.department,
          team: "Leadership",
          managerId: ownerUser.id,
          accessLevel: 'executive',
          lastLoginAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        }).returning();
        createdUsers.push(user);
      }

      // Create analysts
      for (let i = 0; i < 8; i++) {
        const analystRole = createdRoles.find(r => r.name === 'Strategy Analyst');
        
        const [user] = await db.insert(users).values({
          email: `analyst${i + 1}@${org.domain}`,
          firstName: `Analyst${i + 1}`,
          lastName: "User",
          organizationId: org.id,
          roleId: analystRole?.id,
          department: "Strategy",
          team: "Analytics",
          accessLevel: "analyst",
          lastLoginAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        }).returning();
        createdUsers.push(user);
      }
    }

    // 7. Create strategic scenarios
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

    // 8. Create tasks for scenarios
    console.log('✅ Creating tasks...');
    const taskTemplates = [
      "Assess immediate impact and scope of the situation",
      "Activate crisis response team and key stakeholders", 
      "Implement primary contingency plan and backup strategies",
      "Communicate current status to executive leadership team",
      "Monitor key performance indicators and success metrics",
      "Execute comprehensive risk mitigation strategies",
      "Document lessons learned and process improvements"
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
          estimatedHours: (Math.random() * 16 + 4).toFixed(1),
          dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000)
        });
      }
    }

    // 9. Create activities
    console.log('📈 Creating activities...');
    const activityTypes = [
      "scenario_created", "task_completed", "briefing_reviewed", "analysis_generated", "decision_made"
    ];

    for (const org of organizationsWithIds) {
      const orgUsers = createdUsers.filter(u => u.organizationId === org.id);
      
      for (let i = 0; i < 20; i++) {
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

    console.log('\n✅ Minimal comprehensive seed complete!');
    console.log(`📊 Created realistic test data for ${organizationsWithIds.length} organizations`);
    console.log(`👥 Generated ${createdUsers.length} users with realistic hierarchies`);
    console.log(`📋 Built ${createdScenarios.length} strategic scenarios with real business challenges`);
    console.log(`✅ Created comprehensive task assignments and activity tracking`);
    console.log(`🏢 Established organizational structures with roles and permissions`);
    console.log('\n🚀 Your platform now has solid real-world test data for demos!');
    
    console.log('\n📋 Next steps to add more depth:');
    console.log('- Run additional seeds for AI intelligence modules');
    console.log('- Add executive briefings and strategic alerts');
    console.log('- Populate performance metrics and analytics data');

  } catch (error) {
    console.error('❌ Minimal comprehensive seed failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

minimalSeed();