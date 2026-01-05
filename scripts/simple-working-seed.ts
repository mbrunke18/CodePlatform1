import { db } from '../server/db.js';
import { nanoid } from 'nanoid';

// Simple realistic test data using SQL to avoid schema mismatches
async function simpleWorkingSeed() {
  console.log('🌱 Starting simple working database seed...');
  
  try {
    // 1. Create basic permissions (matching actual table structure)
    console.log('🔐 Creating permissions...');
    await db.execute(`
      INSERT INTO permissions (action, description) VALUES 
      ('create_organization', 'Create new organizations'),
      ('manage_users', 'Manage user accounts'),
      ('create_scenario', 'Create strategic scenarios'),
      ('view_analytics', 'Access analytics and reporting'),
      ('manage_tasks', 'Create and manage tasks')
      ON CONFLICT (action) DO NOTHING;
    `);

    // 2. Create basic roles
    console.log('👥 Creating roles...');
    await db.execute(`
      INSERT INTO roles (name, description, category, level) VALUES 
      ('CEO', 'Chief Executive Officer', 'executive', 10),
      ('COO', 'Chief Operating Officer', 'executive', 9),
      ('CFO', 'Chief Financial Officer', 'executive', 9),
      ('Strategy Analyst', 'Strategic analysis and reporting', 'analyst', 4)
      ON CONFLICT (name) DO NOTHING;
    `);

    // 3. Create organizations with realistic data
    console.log('🏢 Creating organizations...');
    const orgData = [
      {
        id: nanoid(),
        name: 'TechFlow Dynamics',
        description: 'Global enterprise software solutions provider',
        ownerId: nanoid(),
        industry: 'Software & Technology',
        size: 8500,
        type: 'enterprise',
        headquarters: 'San Francisco, CA',
        domain: 'techflow.com'
      },
      {
        id: nanoid(),
        name: 'Meridian Manufacturing',
        description: 'Advanced manufacturing solutions provider',
        ownerId: nanoid(),
        industry: 'Manufacturing',
        size: 12000,
        type: 'enterprise',
        headquarters: 'Detroit, MI',
        domain: 'meridianmfg.com'
      },
      {
        id: nanoid(),
        name: 'Catalyst Financial Group',
        description: 'Regional financial services firm',
        ownerId: nanoid(),
        industry: 'Financial Services',
        size: 3200,
        type: 'mid-market',
        headquarters: 'Charlotte, NC',
        domain: 'catalystfg.com'
      }
    ];

    for (const org of orgData) {
      await db.execute(`
        INSERT INTO organizations (id, name, description, owner_id, industry, size, type, headquarters, domain, adaptability_score, onboarding_completed, subscription_tier)
        VALUES ('${org.id}', '${org.name}', '${org.description}', '${org.ownerId}', '${org.industry}', ${org.size}, '${org.type}', '${org.headquarters}', '${org.domain}', '${(Math.random() * 4 + 6).toFixed(1)}', true, '${org.size > 5000 ? 'enterprise' : 'professional'}')
        ON CONFLICT (name) DO NOTHING;
      `);
    }

    // 4. Create users for each organization
    console.log('👤 Creating users...');
    for (const org of orgData) {
      // Create CEO/Owner
      await db.execute(`
        INSERT INTO users (id, email, first_name, last_name, organization_id, department, team, access_level, last_login_at)
        VALUES ('${org.ownerId}', 'ceo@${org.domain}', 'Sarah', 'Chen', '${org.id}', 'Executive', 'C-Suite', 'executive', NOW())
        ON CONFLICT (email) DO NOTHING;
      `);

      // Create executives
      const executives = [
        { firstName: 'Michael', lastName: 'Rodriguez', dept: 'Operations', title: 'COO' },
        { firstName: 'Jennifer', lastName: 'Thompson', dept: 'Finance', title: 'CFO' },
        { firstName: 'David', lastName: 'Kumar', dept: 'Technology', title: 'CTO' }
      ];

      for (const exec of executives) {
        const userId = nanoid();
        await db.execute(`
          INSERT INTO users (id, email, first_name, last_name, organization_id, department, team, access_level, manager_id, last_login_at)
          VALUES ('${userId}', '${exec.firstName.toLowerCase()}.${exec.lastName.toLowerCase()}@${org.domain}', '${exec.firstName}', '${exec.lastName}', '${org.id}', '${exec.dept}', 'Leadership', 'executive', '${org.ownerId}', NOW() - INTERVAL '${Math.floor(Math.random() * 7)} days')
          ON CONFLICT (email) DO NOTHING;
        `);
      }

      // Create analysts
      for (let i = 1; i <= 8; i++) {
        const userId = nanoid();
        await db.execute(`
          INSERT INTO users (id, email, first_name, last_name, organization_id, department, team, access_level, last_login_at)
          VALUES ('${userId}', 'analyst${i}@${org.domain}', 'Analyst${i}', 'User', '${org.id}', 'Strategy', 'Analytics', 'analyst', NOW() - INTERVAL '${Math.floor(Math.random() * 30)} days')
          ON CONFLICT (email) DO NOTHING;
        `);
      }
    }

    // 5. Create strategic scenarios
    console.log('📋 Creating strategic scenarios...');
    const scenarios = [
      {
        name: 'Supply Chain Disruption Recovery',
        title: 'Critical Supplier Bankruptcy - Production Impact Assessment',
        description: 'Major automotive component supplier filed for bankruptcy, affecting 40% of production capacity.',
        type: 'supply_chain',
        likelihood: '0.85',
        impact: 'high',
        status: 'active'
      },
      {
        name: 'Market Expansion Opportunity',
        title: 'European Market Entry - Strategic Assessment',
        description: 'Key competitor withdrawn from European market creating $200M opportunity.',
        type: 'market_opportunity',
        likelihood: '0.72',
        impact: 'high',
        status: 'active'
      },
      {
        name: 'Digital Transformation Acceleration',
        title: 'Cloud Migration - Infrastructure Modernization',
        description: 'Complete migration to cloud infrastructure to reduce costs by 30%.',
        type: 'technology',
        likelihood: '0.95',
        impact: 'high',
        status: 'draft'
      },
      {
        name: 'Cybersecurity Enhancement',
        title: 'Zero Trust Security Implementation',
        description: 'Implementation of zero trust security model following increased cyber threats.',
        type: 'security',
        likelihood: '0.88',
        impact: 'moderate',
        status: 'active'
      }
    ];

    for (const org of orgData) {
      for (const scenario of scenarios) {
        const scenarioId = nanoid();
        await db.execute(`
          INSERT INTO strategic_scenarios (id, organization_id, name, title, description, type, likelihood, impact, status, created_by, trigger_conditions, response_strategy)
          VALUES ('${scenarioId}', '${org.id}', '${scenario.name}', '${scenario.title}', '${scenario.description.replace(/'/g, "''")}', '${scenario.type}', '${scenario.likelihood}', '${scenario.impact}', '${scenario.status}', '${org.ownerId}',
          '{"indicators": ["${org.industry} market volatility > 15%", "Supplier reliability score < 85%"], "thresholds": {"financial_impact": 1000000, "timeline": "30_days"}}',
          '{"immediate_actions": ["Activate crisis response team", "Assess impact scope"], "short_term": ["Implement contingency plans", "Communicate with stakeholders"], "long_term": ["Review and update processes", "Strengthen risk mitigation"]}')
          ON CONFLICT (organization_id, name) DO NOTHING;
        `);

        // Create tasks for each scenario
        const taskTemplates = [
          'Assess immediate impact and scope',
          'Activate response team and stakeholders',
          'Implement primary contingency plan',
          'Communicate status to executive leadership',
          'Monitor key performance indicators'
        ];

        for (let i = 0; i < 3; i++) {
          const taskId = nanoid();
          const task = taskTemplates[i % taskTemplates.length];
          const priority = ['low', 'medium', 'high'][Math.floor(Math.random() * 3)];
          const status = ['draft', 'To Do', 'In Progress', 'Completed'][Math.floor(Math.random() * 4)];
          
          await db.execute(`
            INSERT INTO tasks (id, scenario_id, description, priority, status, assigned_to, estimated_hours, due_date)
            VALUES ('${taskId}', '${scenarioId}', '${task}', '${priority}', '${status}', '${org.ownerId}', '${(Math.random() * 16 + 4).toFixed(1)}', NOW() + INTERVAL '${Math.floor(Math.random() * 30)} days')
          `);
        }
      }
    }

    // 6. Create pulse metrics
    console.log('📊 Creating pulse metrics...');
    const metricCategories = [
      'operational_efficiency', 'financial_performance', 'employee_engagement',
      'customer_satisfaction', 'innovation_index', 'risk_exposure'
    ];

    for (const org of orgData) {
      for (let i = 0; i < 15; i++) {
        const category = metricCategories[Math.floor(Math.random() * metricCategories.length)];
        const metricId = nanoid();
        await db.execute(`
          INSERT INTO pulse_metrics (id, organization_id, metric_name, value, unit, category, timestamp, metadata)
          VALUES ('${metricId}', '${org.id}', '${category.replace('_', ' ')} Score', '${(Math.random() * 100).toFixed(2)}', '${category.includes('performance') ? 'percentage' : 'index'}', '${category}', NOW() - INTERVAL '${Math.floor(Math.random() * 7)} days',
          '{"data_source": "enterprise_systems", "confidence_level": ${(0.85 + Math.random() * 0.15).toFixed(2)}, "trend": "${['up', 'down', 'stable'][Math.floor(Math.random() * 3)]}"}')
        `);
      }
    }

    // 7. Create activities
    console.log('📈 Creating activities...');
    const activityTypes = [
      'scenario created', 'task completed', 'briefing reviewed', 'analysis generated', 'decision made'
    ];

    for (const org of orgData) {
      for (let i = 0; i < 15; i++) {
        const activityId = nanoid();
        const activity = activityTypes[Math.floor(Math.random() * activityTypes.length)];
        await db.execute(`
          INSERT INTO activities (id, user_id, action, entity_type, entity_id, created_at)
          VALUES ('${activityId}', '${org.ownerId}', '${activity}', '${activity.split(' ')[0]}', '${nanoid()}', NOW() - INTERVAL '${Math.floor(Math.random() * 14)} days')
        `);
      }
    }

    // 8. Create intelligence reports
    console.log('📖 Creating intelligence reports...');
    for (const org of orgData) {
      for (let i = 0; i < 3; i++) {
        const reportId = nanoid();
        await db.execute(`
          INSERT INTO intelligence_reports (id, organization_id, report_type, title, executive_summary, findings, recommendations, confidence)
          VALUES ('${reportId}', '${org.id}', 'strategic_analysis', '${org.industry} Market Intelligence Report ${i + 1}', 
          'Comprehensive analysis of ${org.industry} market trends and strategic opportunities for ${org.name}.',
          '{"market_trends": ["Growth acceleration at 12% YoY", "Digital transformation driving demand"], "competitive_landscape": ["Increased consolidation", "New market entrants"], "risk_factors": ["Regulatory changes", "Supply chain volatility"]}',
          '{"strategic_focus": ["Market expansion", "Technology investment", "Risk mitigation"], "immediate_actions": ["Assess market opportunities", "Review competitive positioning"], "long_term_strategy": ["Digital transformation", "Geographic expansion"]}',
          '${(Math.random() * 25 + 75).toFixed(1)}')
        `);
      }
    }

    console.log('\n✅ Simple working seed complete!');
    console.log('📊 Successfully created realistic test data:');
    console.log(`🏢 ${orgData.length} organizations (TechFlow, Meridian, Catalyst)`);
    console.log(`👥 ${orgData.length * 12} users with executive hierarchies`);
    console.log(`📋 ${orgData.length * scenarios.length} strategic scenarios`);
    console.log(`✅ ${orgData.length * scenarios.length * 3} tasks with varied priorities`);
    console.log(`📊 ${orgData.length * 15} pulse metrics with AI metadata`);
    console.log(`📈 ${orgData.length * 15} activity records`);
    console.log(`📖 ${orgData.length * 3} intelligence reports`);
    
    console.log('\n🚀 Your platform now has robust real-world test data for demos!');
    console.log('\n🎯 Demo Features:');
    console.log('- Multi-industry organizations with realistic profiles');
    console.log('- Complete C-Suite and analyst team structures');
    console.log('- Crisis scenarios: Supply chain, cyber security, market opportunities');
    console.log('- Complex task management with realistic workflows');
    console.log('- AI-powered metrics and intelligence reporting');
    console.log('- Rich activity streams showing organizational engagement');

  } catch (error) {
    console.error('❌ Simple working seed failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

simpleWorkingSeed();