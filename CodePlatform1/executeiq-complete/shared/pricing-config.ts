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
    employeeRange: '1,000-5,000 employees',
    description: 'Strategic execution for growing enterprises',
    features: [
      '3 Business Units',
      '50 Active Playbooks',
      '8 Signal Categories',
      '12-Minute Response Orchestration',
      'Standard Integrations (Slack, Jira, Email)',
      'Quarterly Business Reviews',
      'Dedicated Success Manager'
    ],
    cta: 'Contact Sales'
  },
  {
    id: 'enterprise-plus',
    name: 'Enterprise Plus',
    price: '$450K',
    priceValue: 450000,
    employeeRange: '5,000-15,000 employees',
    description: 'Advanced capabilities for complex organizations',
    features: [
      '10 Business Units',
      '100 Active Playbooks',
      'All 16 Signal Categories',
      'AI-Powered Trigger Detection',
      'Full Integration Suite (Salesforce, ServiceNow, SAP)',
      'Custom Playbook Development',
      'Monthly Strategy Sessions',
      'Priority 24/7 Support'
    ],
    highlighted: true,
    cta: 'Contact Sales'
  },
  {
    id: 'global',
    name: 'Global',
    price: '$750K',
    priceValue: 750000,
    priceRange: '$750K - $1.5M+',
    employeeRange: '15,000+ employees',
    description: 'Enterprise-wide strategic command for global leaders',
    features: [
      'Unlimited Business Units',
      'Unlimited Playbooks',
      'All Signal Categories + Custom Signals',
      'Multi-Region Deployment',
      'Enterprise API Access',
      'Custom AI Model Training',
      'Executive Advisory Board Access',
      'Dedicated Technical Account Manager',
      'White-Glove Onboarding'
    ],
    cta: 'Contact Sales'
  }
];

export const PRICING_ADD_ONS: PricingAddOn[] = [
  {
    name: 'Additional Business Units',
    price: '+$50K',
    description: 'Per additional business unit beyond tier allocation'
  },
  {
    name: 'Custom Integration Development',
    price: '$150K-$300K',
    description: 'Bespoke integrations for proprietary systems'
  }
];

export const PRICING_METRICS = {
  averageACV: '$450K',
  targetMarket: 'Fortune 1000',
  deploymentTime: '6-8 weeks',
  typicalROI: '10-40x',
  responseTimeImprovement: '3,180x faster'
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
