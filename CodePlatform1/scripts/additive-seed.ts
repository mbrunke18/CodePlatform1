import { db } from '../server/db.js';
import {
  roles, permissions, rolePermissions, users, organizations,
  strategicScenarios, tasks, activities
} from '../shared/schema.js';
import { nanoid } from 'nanoid';
import { eq, sql } from 'drizzle-orm';

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
  }
];

// Executive profiles
const EXECUTIVE_PROFILES = [
  { firstName: "Sarah", lastName: "Chen", department: "Executive", title: "CEO" },
  { firstName: "Michael", lastName: "Rodriguez", department: "Operations", title: "COO" },
  { firstName: "Jennifer", lastName: "Thompson", department: "Finance", title: "CFO" },
  { firstName: "David", lastName: "Kumar", department: "Technology", title: "CTO" },
  { firstName: "Amanda", lastName: "Williams", department: "Strategy", title: "Chief Strategy Officer" },
  { firstName: "Robert", lastName: "Johnson", department: "Operations", title: "VP Operations" },
  { firstName: "Lisa", lastName: "Martinez", department: "Human Resources", title: "CHRO" },
  { firstName: "James", lastName: "Brown", department: "Sales", title: "VP Sales" }
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
  },
  {
    name: "Sustainability Initiative",
    title: "Carbon Neutral Operations - 2025 Target",
    description: "Strategic initiative to achieve carbon neutral operations by 2025 through renewable energy and process optimization.",
    type: "sustainability",
    likelihood: "0.90",
    impact: "moderate" as const,
    status: "draft"
  },
  {
    name: "Regulatory Compliance Initiative",
    title: "GDPR Enhancement - Data Privacy Overhaul",
    description: "New data privacy regulations require comprehensive system updates and process changes within 6 months.",
    type: "regulatory",
    likelihood: "1.00",
    impact: "moderate" as const,
    status: "active"
  }
];

async function additiveSeed() {
  console.log('🌱 Starting additive database seed (preserving existing data)...');
  
  try {
    // 1. Check and create permissions if they don't exist
    console.log('🔐 Creating permissions...');
    const existingPermissions = await db.select().from(permissions);
    
    const permissionsToCreate = [
      { resource: 'organization', action: 'create', description: 'Create new organizations' },
      { resource: 'user', action: 'manage', description: 'Manage user accounts and permissions' },
      { resource: 'scenario', action: 'create', description: 'Create strategic scenarios' },
      { resource: 'scenario', action: 'manage', description: 'Edit and delete strategic scenarios' },
      { resource: 'analytics', action: 'view', description: 'Access analytics and reporting' },
      { resource: 'task', action: 'manage', description: 'Create and manage tasks' },
      { resource: 'insight', action: 'access', description: 'Access AI-generated insights' },
      { resource: 'briefing', action: 'access', description: 'Access executive briefings' }
    ];

    const newPermissions = [];
    for (const perm of permissionsToCreate) {
      const exists = existingPermissions.find(p => p.resource === perm.resource && p.action === perm.action);
      if (!exists) {
        const [created] = await db.insert(permissions).values(perm).returning();
        newPermissions.push(created);
      }
    }
    console.log(`Created ${newPermissions.length} new permissions`);

    // 2. Check and create roles if they don't exist
    console.log('👥 Creating roles...');
    const existingRoles = await db.select().from(roles);
    
    const rolesToCreate = [
      { name: 'CEO', category: 'executive', level: 10, description: 'Chief Executive Officer with full access' },
      { name: 'COO', category: 'executive', level: 9, description: 'Chief Operating Officer' },
      { name: 'CFO', category: 'executive', level: 9, description: 'Chief Financial Officer' },
      { name: 'CTO', category: 'executive', level: 9, description: 'Chief Technology Officer' },
      { name: 'VP Operations', category: 'executive', level: 8, description: 'Vice President of Operations' },
      { name: 'VP Sales', category: 'executive', level: 8, description: 'Vice President of Sales' },
      { name: 'Senior Manager', category: 'strategy', level: 6, description: 'Senior management role' },
      { name: 'Strategy Analyst', category: 'analyst', level: 4, description: 'Strategic analysis and reporting' }
    ];

    const newRoles = [];
    for (const role of rolesToCreate) {
      const exists = existingRoles.find(r => r.name === role.name);
      if (!exists) {
        const [created] = await db.insert(roles).values(role).returning();
        newRoles.push(created);
      } else {
        newRoles.push(exists);
      }
    }
    console.log(`Created ${newRoles.filter(r => !existingRoles.find(er => er.id === r.id)).length} new roles`);

    // 3. Create organizations
    console.log('🏢 Creating organizations...');
    const existingOrgs = await db.select().from(organizations);
    const organizationsWithIds = [];
    
    for (const company of COMPANY_PROFILES) {
      const exists = existingOrgs.find(o => o.name === company.name);
      if (!exists) {
        const ownerUserId = nanoid();
        const [org] = await db.insert(organizations).values({
          ...company,
          ownerId: ownerUserId,
          adaptabilityScore: (Math.random() * 4 + 6).toFixed(1),
          onboardingCompleted: true,
          subscriptionTier: company.size > 5000 ? 'enterprise' : 'professional'
        }).returning();
        organizationsWithIds.push({ ...org, ownerUserId, isNew: true });
      } else {
        // Use existing organization, but we'll need to generate scenarios for it
        organizationsWithIds.push({ ...exists, ownerUserId: exists.ownerId, isNew: false });
      }
    }
    console.log(`Created ${organizationsWithIds.filter(o => o.isNew).length} new organizations`);

    // 4. Create users for each organization
    console.log('👤 Creating users...');
    const createdUsers = [];
    
    for (const org of organizationsWithIds) {
      const existingOrgUsers = await db.select().from(users).where(eq(users.organizationId, org.id));
      
      // Create owner/CEO if doesn't exist
      let ownerUser = existingOrgUsers.find(u => u.id === org.ownerId);
      if (!ownerUser) {
        const ceoRole = newRoles.find(r => r.name === 'CEO');
        const [created] = await db.insert(users).values({
          id: org.ownerId,
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
        ownerUser = created;
        createdUsers.push(created);
      }

      // Create executives
      for (let i = 1; i < EXECUTIVE_PROFILES.length; i++) {
        const profile = EXECUTIVE_PROFILES[i];
        const exists = existingOrgUsers.find(u => u.email === `${profile.firstName.toLowerCase()}.${profile.lastName.toLowerCase()}@${org.domain}`);
        
        if (!exists) {
          const role = newRoles.find(r => 
            profile.title.includes('VP') ? r.name.includes('VP') : 
            profile.title.includes('Chief') ? r.name === profile.title.split(' ').pop() : 
            r.name === 'Senior Manager'
          ) || newRoles.find(r => r.name === 'COO');

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
      }

      // Create analysts
      for (let i = 0; i < 12; i++) {
        const email = `analyst${i + 1}@${org.domain}`;
        const exists = existingOrgUsers.find(u => u.email === email);
        
        if (!exists) {
          const analystRole = newRoles.find(r => r.name === 'Strategy Analyst');
          
          const [user] = await db.insert(users).values({
            email: email,
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
    }
    console.log(`Created ${createdUsers.length} new users`);

    // 5. Create strategic scenarios
    console.log('📋 Creating strategic scenarios...');
    const createdScenarios = [];
    
    for (const org of organizationsWithIds) {
      const existingScenarios = await db.select().from(strategicScenarios).where(eq(strategicScenarios.organizationId, org.id));
      const orgUsers = await db.select().from(users).where(eq(users.organizationId, org.id));
      const creator = orgUsers.find(u => u.accessLevel === 'executive') || orgUsers[0];
      
      for (const scenario of STRATEGIC_SCENARIOS) {
        const exists = existingScenarios.find(s => s.name === scenario.name);
        if (!exists && creator) {
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
    }
    console.log(`Created ${createdScenarios.length} new strategic scenarios`);

    // 6. Create tasks for new scenarios
    console.log('✅ Creating tasks...');
    const taskTemplates = [
      "Assess immediate impact and scope of the situation",
      "Activate crisis response team and key stakeholders", 
      "Implement primary contingency plan and backup strategies",
      "Communicate current status to executive leadership team",
      "Monitor key performance indicators and success metrics",
      "Execute comprehensive risk mitigation strategies",
      "Document lessons learned and process improvements",
      "Coordinate with external partners and suppliers",
      "Review and update emergency response procedures",
      "Conduct post-incident analysis and reporting"
    ];

    let taskCount = 0;
    for (const scenario of createdScenarios) {
      const orgUsers = await db.select().from(users).where(eq(users.organizationId, scenario.organizationId));
      
      for (let i = 0; i < 6; i++) {
        const assignee = orgUsers[Math.floor(Math.random() * orgUsers.length)];
        await db.insert(tasks).values({
          scenarioId: scenario.id,
          description: taskTemplates[i % taskTemplates.length],
          priority: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
          status: ['draft', 'To Do', 'In Progress', 'Completed'][Math.floor(Math.random() * 4)],
          assignedTo: assignee.id,
          estimatedHours: (Math.random() * 20 + 2).toFixed(1),
          dueDate: new Date(Date.now() + Math.random() * 45 * 24 * 60 * 60 * 1000)
        });
        taskCount++;
      }
    }
    console.log(`Created ${taskCount} new tasks`);

    // 7. Create activities
    console.log('📈 Creating activities...');
    const activityTypes = [
      "scenario_created", "task_completed", "briefing_reviewed", "analysis_generated", 
      "decision_made", "strategy_revised", "alert_acknowledged", "project_updated",
      "metrics_analyzed", "insight_generated", "risk_assessed", "opportunity_identified"
    ];

    let activityCount = 0;
    for (const org of organizationsWithIds) {
      const orgUsers = await db.select().from(users).where(eq(users.organizationId, org.id));
      
      for (let i = 0; i < 25; i++) {
        const user = orgUsers[Math.floor(Math.random() * orgUsers.length)];
        const activity = activityTypes[Math.floor(Math.random() * activityTypes.length)];
        
        await db.insert(activities).values({
          userId: user.id,
          action: activity.replace('_', ' '),
          entityType: activity.split('_')[0],
          entityId: nanoid(),
          createdAt: new Date(Date.now() - Math.random() * 21 * 24 * 60 * 60 * 1000) // Last 21 days
        });
        activityCount++;
      }
    }
    console.log(`Created ${activityCount} new activities`);

    console.log('\n✅ Additive seed complete!');
    console.log(`📊 Enhanced database with realistic test data for ${organizationsWithIds.length} organizations`);
    console.log(`👥 Added ${createdUsers.length} users with detailed profiles and hierarchies`);
    console.log(`📋 Built ${createdScenarios.length} strategic scenarios with real business challenges`);
    console.log(`✅ Created ${taskCount} comprehensive task assignments`);
    console.log(`📈 Generated ${activityCount} activity records for realistic user engagement`);
    console.log('\n🚀 Your platform now has robust real-world test data for compelling demos!');
    
    console.log('\n🎯 Demo Highlights:');
    console.log('- Multi-industry organizations (Tech, Manufacturing, Finance, Biotech)');
    console.log('- Complete executive hierarchies with realistic roles');
    console.log('- Crisis scenarios: Supply chain, market opportunities, cybersecurity');
    console.log('- Complex task management with varied priorities and statuses');
    console.log('- Rich activity streams showing organizational engagement');

  } catch (error) {
    console.error('❌ Additive seed failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

additiveSeed();