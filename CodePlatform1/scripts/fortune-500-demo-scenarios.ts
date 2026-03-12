// scripts/fortune-500-demo-scenarios.ts - Fortune 500 Executive Demo Scenarios
// Comprehensive collection of high-impact crisis scenarios that resonate with Fortune 500 leadership

import { randomUUID } from 'crypto';

export interface DemoScenario {
  id: string;
  name: string;
  title: string;
  description: string;
  organization: {
    name: string;
    description: string;
    industry: string;
    size: number;
    headquarters: string;
    domain: string;
  };
  executiveTeam: {
    ceo: { firstName: string; lastName: string; email: string; };
    cfo?: { firstName: string; lastName: string; email: string; };
    coo?: { firstName: string; lastName: string; email: string; };
    cto?: { firstName: string; lastName: string; email: string; };
    ciso?: { firstName: string; lastName: string; email: string; };
    chro?: { firstName: string; lastName: string; email: string; };
    cso?: { firstName: string; lastName: string; email: string; };
    general_counsel?: { firstName: string; lastName: string; email: string; };
  };
  tasks: Array<{
    description: string;
    priority: 'high' | 'medium' | 'low';
    assignedToRole: string;
    dueDays: number;
  }>;
  aiMetrics: Array<{
    name: string;
    value: string;
    unit: string;
    category: string;
    metadata: any;
  }>;
  impact: {
    financial: string;
    timeline: string;
    stakeholders: string;
  };
}

export const FORTUNE_500_SCENARIOS: DemoScenario[] = [
  {
    id: 'apac-competitive-response',
    name: 'APAC Competitive Response',
    title: 'APAC Competitive Crisis: SynerTech CloudFlow 3.0',
    description: '🚨 URGENT: SynerTech Corp launched CloudFlow 3.0 targeting our APAC market with 85% feature parity and 20-30% pricing advantage. Intelligence indicates 15% market share risk ($2.4M revenue impact in Q1). Executive team activated crisis response protocol. Immediate strategic countermeasures required to protect market position and customer base.',
    organization: {
      name: 'Innovate Dynamics',
      description: 'Leading cloud infrastructure and AI solutions provider facing competitive threat from SynerTech Corp in APAC markets.',
      industry: 'Technology',
      size: 1250,
      headquarters: 'San Francisco, CA',
      domain: 'innovatedynamics.com'
    },
    executiveTeam: {
      ceo: { firstName: 'Alexandra', lastName: 'Chen', email: 'demo@acuetic.com' },
      cso: { firstName: 'Michael', lastName: 'Rivera', email: 'strategy@innovatedynamics.com' },
      cto: { firstName: 'Sarah', lastName: 'Kim', email: 'tech@innovatedynamics.com' },
      coo: { firstName: 'David', lastName: 'Thompson', email: 'operations@innovatedynamics.com' }
    },
    tasks: [
      {
        description: '🔍 URGENT: Complete competitive feature analysis - InnovateFlow vs SynerTech CloudFlow 3.0. Identify feature gaps and prioritize development roadmap.',
        priority: 'high',
        assignedToRole: 'cto',
        dueDays: 2
      },
      {
        description: '📢 URGENT: Customer retention strategy - Create communication plan highlighting InnovateFlow advantages and addressing competitive concerns.',
        priority: 'high',
        assignedToRole: 'coo',
        dueDays: 1
      },
      {
        description: '📊 CRITICAL: Financial impact modeling - Model revenue scenarios for various market share loss projections (5%, 10%, 15%, 20%).',
        priority: 'high',
        assignedToRole: 'cso',
        dueDays: 3
      }
    ],
    aiMetrics: [
      {
        name: 'Market Share APAC',
        value: '23.5',
        unit: 'percentage',
        category: 'market-position',
        metadata: { previous_value: 25.8, trend: 'declining', alert_threshold: 22.0 }
      },
      {
        name: 'Customer Sentiment Score',
        value: '7.2',
        unit: 'score',
        category: 'customer-health',
        metadata: { benchmark: 7.5, trend: 'stable', regional_variance: { apac: 6.8, us: 7.6 } }
      },
      {
        name: 'Revenue Risk APAC',
        value: '2400000',
        unit: 'dollars',
        category: 'financial-risk',
        metadata: { timeframe: 'Q1', confidence: 0.85, scenario: 'moderate-impact' }
      }
    ],
    impact: {
      financial: '$2.4M revenue risk in Q1',
      timeline: 'Active crisis response - immediate action required',
      stakeholders: '4 key executive leaders'
    }
  },

  {
    id: 'cybersecurity-breach-response',
    name: 'Cybersecurity Breach Response',
    title: 'Global Ransomware Attack: Manufacturing Systems Compromised',
    description: '🔥 CRITICAL INCIDENT: Advanced persistent threat actor "ShadowStorm" infiltrated manufacturing control systems across 12 facilities. Production halted at 67% of global capacity. Ransomware demands $15M Bitcoin payment. Federal agencies notified. Board emergency session convened. Estimated daily revenue loss: $3.2M. Customer deliveries suspended. Stock price down 8% in after-hours trading.',
    organization: {
      name: 'TitanSteel Industries',
      description: 'Global steel and automotive components manufacturer with operations across North America, Europe, and Asia Pacific.',
      industry: 'Manufacturing',
      size: 8400,
      headquarters: 'Pittsburgh, PA',
      domain: 'titansteel.com'
    },
    executiveTeam: {
      ceo: { firstName: 'Robert', lastName: 'Jameson', email: 'ceo@titansteel.com' },
      ciso: { firstName: 'Amanda', lastName: 'Rodriguez', email: 'security@titansteel.com' },
      coo: { firstName: 'Kevin', lastName: 'Mueller', email: 'operations@titansteel.com' },
      cfo: { firstName: 'Jennifer', lastName: 'Park', email: 'finance@titansteel.com' },
      general_counsel: { firstName: 'Thomas', lastName: 'Wright', email: 'legal@titansteel.com' }
    },
    tasks: [
      {
        description: '🚨 IMMEDIATE: Activate incident response team - Isolate infected systems, preserve evidence, coordinate with FBI and DHS.',
        priority: 'high',
        assignedToRole: 'ciso',
        dueDays: 0
      },
      {
        description: '📞 URGENT: Customer communication plan - Notify major OEM clients of production delays, establish alternative sourcing where possible.',
        priority: 'high',
        assignedToRole: 'coo',
        dueDays: 1
      },
      {
        description: '⚖️ CRITICAL: Legal and regulatory response - SEC filing, insurance claims, law enforcement cooperation, regulatory notifications.',
        priority: 'high',
        assignedToRole: 'general_counsel',
        dueDays: 1
      },
      {
        description: '💰 URGENT: Financial impact assessment - Calculate production losses, evaluate cyber insurance coverage, model recovery scenarios.',
        priority: 'high',
        assignedToRole: 'cfo',
        dueDays: 2
      }
    ],
    aiMetrics: [
      {
        name: 'Production Capacity Online',
        value: '33',
        unit: 'percentage',
        category: 'operational-status',
        metadata: { normal_capacity: 100, facilities_affected: 12, critical_threshold: 25 }
      },
      {
        name: 'Daily Revenue Impact',
        value: '3200000',
        unit: 'dollars',
        category: 'financial-impact',
        metadata: { timeframe: 'daily', accumulated_loss: 9600000, days_affected: 3 }
      },
      {
        name: 'Incident Severity Score',
        value: '9.2',
        unit: 'score',
        category: 'risk-assessment',
        metadata: { scale: '1-10', threat_actor: 'ShadowStorm', attack_vector: 'ransomware' }
      }
    ],
    impact: {
      financial: '$3.2M daily revenue loss, $15M ransom demand',
      timeline: 'Critical incident - 72 hours since breach',
      stakeholders: '5 executive leaders, federal agencies, major customers'
    }
  },

  {
    id: 'supply-chain-crisis',
    name: 'Supply Chain Crisis',
    title: 'Critical Supplier Bankruptcy: Q4 Delivery Pipeline at Risk',
    description: '⚠️ SUPPLY CHAIN EMERGENCY: Apex Components Ltd, our primary semiconductor supplier (43% of chip volume), filed Chapter 11 bankruptcy. $127M in outstanding orders frozen. Q4 product launches for three major product lines jeopardized. Alternative suppliers quote 16-week lead times. Customer pre-orders at risk: $89M. Holiday season revenue targets in peril. Emergency board meeting scheduled.',
    organization: {
      name: 'Quantum Electronics',
      description: 'Consumer electronics giant specializing in smart home devices, wearables, and IoT solutions with global retail presence.',
      industry: 'Consumer Electronics',
      size: 5200,
      headquarters: 'Austin, TX',
      domain: 'quantumelectronics.com'
    },
    executiveTeam: {
      ceo: { firstName: 'Lisa', lastName: 'Washington', email: 'ceo@quantumelectronics.com' },
      coo: { firstName: 'Marcus', lastName: 'Chen', email: 'operations@quantumelectronics.com' },
      cso: { firstName: 'Rachel', lastName: 'Foster', email: 'strategy@quantumelectronics.com' },
      cfo: { firstName: 'David', lastName: 'Kumar', email: 'finance@quantumelectronics.com' },
      chro: { firstName: 'Patricia', lastName: 'Moore', email: 'hr@quantumelectronics.com' }
    },
    tasks: [
      {
        description: '🏭 IMMEDIATE: Emergency supplier diversification - Activate relationships with secondary chip suppliers, negotiate expedited delivery terms.',
        priority: 'high',
        assignedToRole: 'coo',
        dueDays: 1
      },
      {
        description: '📦 URGENT: Product portfolio triage - Prioritize highest-margin products, assess component substitution possibilities, delay non-critical launches.',
        priority: 'high',
        assignedToRole: 'cso',
        dueDays: 2
      },
      {
        description: '💸 CRITICAL: Financial contingency planning - Model Q4 revenue scenarios, assess bankruptcy recovery options, evaluate bridge financing needs.',
        priority: 'high',
        assignedToRole: 'cfo',
        dueDays: 3
      },
      {
        description: '👥 URGENT: Workforce impact assessment - Evaluate production slowdown effects on manufacturing staff, plan temporary layoff protocols.',
        priority: 'high',
        assignedToRole: 'chro',
        dueDays: 2
      }
    ],
    aiMetrics: [
      {
        name: 'Q4 Revenue at Risk',
        value: '89000000',
        unit: 'dollars',
        category: 'financial-risk',
        metadata: { total_q4_target: 340000000, percentage_at_risk: 26.2, affected_products: 3 }
      },
      {
        name: 'Supply Chain Disruption Score',
        value: '8.4',
        unit: 'score',
        category: 'operational-risk',
        metadata: { scale: '1-10', critical_suppliers_affected: 1, backup_capacity: 23 }
      },
      {
        name: 'Component Inventory Days',
        value: '18',
        unit: 'days',
        category: 'inventory-status',
        metadata: { normal_inventory: 45, critical_threshold: 14, burn_rate_current: 'high' }
      }
    ],
    impact: {
      financial: '$89M in Q4 pre-orders at risk, $127M frozen orders',
      timeline: 'Critical - 18 days current inventory remaining',
      stakeholders: '5 executive leaders, major retail partners, 5,200 employees'
    }
  },

  {
    id: 'regulatory-compliance-crisis',
    name: 'Regulatory Compliance Crisis',
    title: 'FDA Regulations Threaten $340M Product Pipeline',
    description: '📋 REGULATORY CRISIS: FDA announced sweeping new biocompatibility standards for medical devices, effective immediately. Three flagship products totaling $340M in development costs now require additional 18-month clinical trials. Product launches delayed 2+ years. Competitor advantage window closing. European EMA considering similar standards. Investor confidence shaken. Emergency regulatory strategy required.',
    organization: {
      name: 'BioMed Innovations',
      description: 'Leading medical device manufacturer specializing in cardiac implants, surgical robotics, and diagnostic equipment for hospitals worldwide.',
      industry: 'Medical Technology',
      size: 3100,
      headquarters: 'Boston, MA',
      domain: 'biomedinnovations.com'
    },
    executiveTeam: {
      ceo: { firstName: 'Dr. Sarah', lastName: 'Mitchell', email: 'ceo@biomedinnovations.com' },
      cso: { firstName: 'James', lastName: 'Rodriguez', email: 'strategy@biomedinnovations.com' },
      cfo: { firstName: 'Emily', lastName: 'Zhang', email: 'finance@biomedinnovations.com' },
      general_counsel: { firstName: 'Michael', lastName: 'O\'Brien', email: 'legal@biomedinnovations.com' },
      cto: { firstName: 'Dr. Rajesh', lastName: 'Patel', email: 'technology@biomedinnovations.com' }
    },
    tasks: [
      {
        description: '⚖️ IMMEDIATE: Regulatory compliance assessment - Analyze new FDA requirements, identify compliance gaps, develop submission timeline.',
        priority: 'high',
        assignedToRole: 'general_counsel',
        dueDays: 1
      },
      {
        description: '🔬 URGENT: Clinical trial strategy - Design accelerated biocompatibility studies, identify CRO partners, estimate costs and timelines.',
        priority: 'high',
        assignedToRole: 'cto',
        dueDays: 3
      },
      {
        description: '💰 CRITICAL: Financial impact modeling - Reassess R&D investments, evaluate bridge financing needs, revise revenue projections.',
        priority: 'high',
        assignedToRole: 'cfo',
        dueDays: 2
      },
      {
        description: '🎯 URGENT: Portfolio prioritization - Rank products by market potential post-delay, consider strategic partnerships or licensing deals.',
        priority: 'high',
        assignedToRole: 'cso',
        dueDays: 4
      }
    ],
    aiMetrics: [
      {
        name: 'R&D Investment at Risk',
        value: '340000000',
        unit: 'dollars',
        category: 'financial-risk',
        metadata: { products_affected: 3, development_stage: 'late-stage', sunk_costs: 340000000 }
      },
      {
        name: 'Regulatory Compliance Score',
        value: '4.2',
        unit: 'score',
        category: 'compliance-status',
        metadata: { scale: '1-10', previous_score: 8.7, gap_analysis_pending: true }
      },
      {
        name: 'Time to Market Delay',
        value: '24',
        unit: 'months',
        category: 'development-timeline',
        metadata: { original_timeline: 8, additional_trials: 18, competitive_window: 'closing' }
      }
    ],
    impact: {
      financial: '$340M product pipeline at risk, 2+ year delays',
      timeline: 'Urgent - new regulations effective immediately',
      stakeholders: '5 executive leaders, investors, regulatory bodies'
    }
  },

  {
    id: 'market-disruption-ai',
    name: 'Market Disruption Crisis',
    title: 'AI Startup Threatens 40% of Core Business Model',
    description: '🤖 DISRUPTION ALERT: Stealth-mode AI startup "Nexus Intelligence" emerged with $2.8B funding, targeting our legal research and document analysis market. Their AI platform processes legal briefs 95% faster at 60% lower cost. Major law firms (including 3 of our top 10 clients) signed pilot agreements. Traditional billable hour model under existential threat. Urgent digital transformation required.',
    organization: {
      name: 'Premier Legal Services',
      description: 'Elite legal services firm providing corporate litigation support, document review, and legal research to Fortune 500 companies and top-tier law firms.',
      industry: 'Legal Services',
      size: 1800,
      headquarters: 'New York, NY',
      domain: 'premierlegal.com'
    },
    executiveTeam: {
      ceo: { firstName: 'Victoria', lastName: 'Sterling', email: 'ceo@premierlegal.com' },
      cto: { firstName: 'Alex', lastName: 'Thompson', email: 'technology@premierlegal.com' },
      cso: { firstName: 'Catherine', lastName: 'Wu', email: 'strategy@premierlegal.com' },
      cfo: { firstName: 'Jonathan', lastName: 'Miller', email: 'finance@premierlegal.com' },
      chro: { firstName: 'Daniel', lastName: 'Brooks', email: 'hr@premierlegal.com' }
    },
    tasks: [
      {
        description: '🚀 IMMEDIATE: AI capability assessment - Evaluate Nexus Intelligence threat, benchmark our technology stack, identify AI integration opportunities.',
        priority: 'high',
        assignedToRole: 'cto',
        dueDays: 2
      },
      {
        description: '💼 URGENT: Client retention strategy - Develop competitive AI-enhanced service offerings, renegotiate contracts with value-based pricing models.',
        priority: 'high',
        assignedToRole: 'cso',
        dueDays: 3
      },
      {
        description: '💰 CRITICAL: Business model transformation - Model AI-augmented services pricing, assess investment needs for technology upgrade.',
        priority: 'high',
        assignedToRole: 'cfo',
        dueDays: 4
      },
      {
        description: '👥 STRATEGIC: Workforce evolution planning - Assess AI impact on roles, design retraining programs, plan strategic hiring for AI expertise.',
        priority: 'high',
        assignedToRole: 'chro',
        dueDays: 5
      }
    ],
    aiMetrics: [
      {
        name: 'Market Share Threat Level',
        value: '40',
        unit: 'percentage',
        category: 'competitive-risk',
        metadata: { current_market_share: 23, threat_timeline: '12-18_months', disruption_vector: 'AI_automation' }
      },
      {
        name: 'Client Retention Risk',
        value: '7.8',
        unit: 'score',
        category: 'client-risk',
        metadata: { scale: '1-10', top_10_clients_at_risk: 3, contract_renewal_cycle: 'Q2_2024' }
      },
      {
        name: 'Digital Transformation Score',
        value: '3.4',
        unit: 'score',
        category: 'technology-readiness',
        metadata: { scale: '1-10', ai_capability_current: 'limited', investment_required: 'substantial' }
      }
    ],
    impact: {
      financial: '40% of revenue model threatened, $2.8B competitor funding',
      timeline: 'Critical - competitor pilots active with key clients',
      stakeholders: '5 executive leaders, 1,800 employees, major law firm clients'
    }
  },

  {
    id: 'esg-environmental-crisis',
    name: 'ESG Environmental Crisis',
    title: 'Environmental Incident Triggers Board-Level ESG Response',
    description: '🌍 ESG CRISIS: Chemical leak at Texas refinery released 840,000 gallons of contaminated water into Trinity River. EPA investigation launched. Local communities demand compensation. ESG rating downgraded from A- to C+. Institutional investors questioning sustainability commitments. $2.1B in ESG-linked bonds at risk. Emergency board meeting with sustainability officers required.',
    organization: {
      name: 'Atlas Energy Corporation',
      description: 'Integrated energy company with refining, petrochemicals, and renewable energy divisions, committed to sustainable energy transition and environmental stewardship.',
      industry: 'Energy',
      size: 12600,
      headquarters: 'Houston, TX',
      domain: 'atlasenergy.com'
    },
    executiveTeam: {
      ceo: { firstName: 'Richard', lastName: 'Harrison', email: 'ceo@atlasenergy.com' },
      coo: { firstName: 'Maria', lastName: 'Gonzalez', email: 'operations@atlasenergy.com' },
      cfo: { firstName: 'Steven', lastName: 'Kim', email: 'finance@atlasenergy.com' },
      general_counsel: { firstName: 'Rebecca', lastName: 'Taylor', email: 'legal@atlasenergy.com' },
      chro: { firstName: 'Gregory', lastName: 'Adams', email: 'hr@atlasenergy.com' }
    },
    tasks: [
      {
        description: '🌊 IMMEDIATE: Environmental response coordination - Lead cleanup efforts, coordinate with EPA, implement community safety measures.',
        priority: 'high',
        assignedToRole: 'coo',
        dueDays: 0
      },
      {
        description: '⚖️ URGENT: Legal and regulatory response - Manage EPA investigation, prepare disclosure filings, coordinate community settlement discussions.',
        priority: 'high',
        assignedToRole: 'general_counsel',
        dueDays: 1
      },
      {
        description: '💰 CRITICAL: Financial impact assessment - Evaluate cleanup costs, assess ESG bond covenant compliance, model rating impact.',
        priority: 'high',
        assignedToRole: 'cfo',
        dueDays: 2
      },
      {
        description: '👥 STRATEGIC: Stakeholder communication plan - Address employee concerns, coordinate investor relations, manage media narrative.',
        priority: 'high',
        assignedToRole: 'chro',
        dueDays: 1
      }
    ],
    aiMetrics: [
      {
        name: 'Environmental Impact Score',
        value: '8.6',
        unit: 'score',
        category: 'environmental-risk',
        metadata: { scale: '1-10', contamination_volume: 840000, water_bodies_affected: 1, communities_impacted: 4 }
      },
      {
        name: 'ESG Rating Impact',
        value: '2.5',
        unit: 'grade_points',
        category: 'esg-performance',
        metadata: { previous_rating: 'A-', current_rating: 'C+', bonds_at_risk: 2100000000 }
      },
      {
        name: 'Cleanup Cost Estimate',
        value: '125000000',
        unit: 'dollars',
        category: 'financial-impact',
        metadata: { range_low: 85000000, range_high: 175000000, timeline_months: 18 }
      }
    ],
    impact: {
      financial: '$125M estimated cleanup costs, $2.1B ESG bonds at risk',
      timeline: 'Immediate environmental response required',
      stakeholders: '5 executive leaders, EPA, local communities, ESG investors'
    }
  },

  {
    id: 'talent-exodus-crisis',
    name: 'Talent Exodus Crisis',
    title: 'Key Engineering Team Poached by Competitor',
    description: '👥 TALENT CRISIS: Tech rival "Quantum Dynamics" systematically recruited 47 senior engineers from our AI/ML division including VP of Engineering and 3 principal architects. Core product development at 60% capacity. Intellectual property concerns raised. Remaining team demoralized. Recruitment costs skyrocketing. Product roadmap in jeopardy. Emergency retention and recruitment strategy required.',
    organization: {
      name: 'NeuralTech Solutions',
      description: 'Advanced AI and machine learning company developing enterprise automation solutions and predictive analytics platforms for Fortune 500 clients.',
      industry: 'Artificial Intelligence',
      size: 850,
      headquarters: 'Seattle, WA',
      domain: 'neuraltech.com'
    },
    executiveTeam: {
      ceo: { firstName: 'Andrew', lastName: 'Chen', email: 'ceo@neuraltech.com' },
      chro: { firstName: 'Jessica', lastName: 'Martinez', email: 'hr@neuraltech.com' },
      cto: { firstName: 'Dr. Samantha', lastName: 'Lee', email: 'technology@neuraltech.com' },
      cfo: { firstName: 'Robert', lastName: 'Johnson', email: 'finance@neuraltech.com' },
      cso: { firstName: 'Michelle', lastName: 'Davis', email: 'strategy@neuraltech.com' }
    },
    tasks: [
      {
        description: '💼 IMMEDIATE: Emergency retention program - Implement competitive counter-offers, accelerate equity vesting, enhance benefits packages.',
        priority: 'high',
        assignedToRole: 'chro',
        dueDays: 1
      },
      {
        description: '🔒 URGENT: Intellectual property protection - Review non-compete agreements, assess IP exposure, coordinate with legal on enforcement.',
        priority: 'high',
        assignedToRole: 'cto',
        dueDays: 2
      },
      {
        description: '🎯 CRITICAL: Rapid talent acquisition - Launch executive search for VP Engineering, accelerate hiring pipeline, explore acqui-hire opportunities.',
        priority: 'high',
        assignedToRole: 'cso',
        dueDays: 3
      },
      {
        description: '💰 STRATEGIC: Compensation restructuring - Evaluate market rates, design retention bonuses, assess long-term compensation competitiveness.',
        priority: 'high',
        assignedToRole: 'cfo',
        dueDays: 4
      }
    ],
    aiMetrics: [
      {
        name: 'Engineering Capacity',
        value: '60',
        unit: 'percentage',
        category: 'operational-capacity',
        metadata: { previous_capacity: 100, engineers_lost: 47, critical_roles_vacant: 4 }
      },
      {
        name: 'Talent Flight Risk',
        value: '8.9',
        unit: 'score',
        category: 'hr-risk',
        metadata: { scale: '1-10', additional_resignations_pending: 12, competitor_recruiting: 'active' }
      },
      {
        name: 'Recruitment Cost Increase',
        value: '340',
        unit: 'percentage',
        category: 'financial-impact',
        metadata: { previous_avg_cost: 15000, current_avg_cost: 66000, time_to_fill_increase: 65 }
      }
    ],
    impact: {
      financial: '340% increase in recruitment costs, product development delays',
      timeline: 'Critical - additional resignations expected',
      stakeholders: '5 executive leaders, remaining 803 employees, key clients'
    }
  }
];

export function getScenarioById(id: string): DemoScenario | undefined {
  return FORTUNE_500_SCENARIOS.find(scenario => scenario.id === id);
}

export function getScenarioNames(): Array<{ id: string; name: string; title: string }> {
  return FORTUNE_500_SCENARIOS.map(scenario => ({
    id: scenario.id,
    name: scenario.name,
    title: scenario.title
  }));
}