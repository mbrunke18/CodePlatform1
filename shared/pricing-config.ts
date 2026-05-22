export interface PricingTier {
  id: string;
  name: string;
  price: string;
  priceValue: number;
  priceRange?: string;
  employeeRange: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
}

export interface PricingAddOn {
  name: string;
  price: string;
  description: string;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$250K',
    priceValue: 250000,
    employeeRange: '1,000–5,000 employees',
    description: 'Full strategic readiness platform for growing enterprises',
    features: [
      'Full platform — 170 Readiness Protocols',
      'Continuous signal monitoring (221 triggers)',
      '12-Minute Response Orchestration',
      'Standard Integrations (Slack, Jira, Email)',
      'Dedicated Customer Success Manager',
      'Quarterly Strategy Reviews',
      '99.9% Uptime SLA'
    ],
    cta: 'Contact Sales'
  },
  {
    id: 'enterprise-plus',
    name: 'Enterprise Plus',
    price: '$450K',
    priceValue: 450000,
    employeeRange: '5,000–15,000 employees',
    description: 'Full platform plus dedicated protocol development and advisory support',
    features: [
      'Everything in Enterprise',
      '3 Custom Readiness Protocol Builds per year',
      'Monthly Strategy Sessions',
      'Advanced Integration Suite (Salesforce, ServiceNow, SAP)',
      'Priority Support — 2-hour SLA',
      'Executive Briefing Service',
      'Multi-Division Coordination'
    ],
    highlighted: true,
    cta: 'Contact Sales'
  },
  {
    id: 'global',
    name: 'Global',
    price: '$750K',
    priceValue: 750000,
    priceRange: '$750K – $1.5M+',
    employeeRange: '15,000+ employees',
    description: 'Enterprise-wide strategic command with dedicated account team and advisory access',
    features: [
      'Everything in Enterprise Plus',
      'Unlimited Custom Protocol Development',
      'Dedicated Account Team',
      'On-Site Executive Advisory Visits',
      'Multi-Region Deployment',
      'On-Premise Deployment Option',
      'Executive Advisory Board Access',
      'Custom SLA Agreements'
    ],
    cta: 'Contact Sales'
  }
];

export const PRICING_ADD_ONS: PricingAddOn[] = [
  {
    name: 'Additional Custom Protocol Development',
    price: '+$25K per protocol',
    description: 'Bespoke Readiness Protocols built to your specific triggers and workflows'
  },
  {
    name: 'Custom Integration Development',
    price: '$150K–$300K',
    description: 'Bespoke integrations for proprietary systems'
  }
];

export const PRICING_METRICS = {
  averageACV: '$450K',
  targetMarket: 'startup to Fortune 500',
  deploymentTime: '6–8 weeks',
  typicalROI: '10–40×',
  responseTimeImprovement: '3,600× Execution Head Start'
};

export const VALUE_PROPOSITIONS = {
  riskAvoidance: {
    value: '$10M',
    description: '2 responses/year × $5M avg risk avoidance'
  },
  valueCapture: {
    value: '$20M',
    description: '1 response/year × $20M avg value capture'
  }
};
