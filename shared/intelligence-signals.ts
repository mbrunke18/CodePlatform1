/**
 * M Intelligence Signals Framework
 * 
 * Defines the 16 intelligence signal categories that M monitors for strategic execution.
 * Each signal category contains data points, sources, trigger thresholds, and playbook mappings.
 */

export type SignalUrgency = 'critical' | 'high' | 'medium' | 'low';
export type SignalStatus = 'active' | 'warning' | 'alert' | 'inactive';
export type TriggerOperator = 'gt' | 'lt' | 'gte' | 'lte' | 'eq' | 'neq' | 'contains' | 'spike' | 'drop' | 'trend';

export interface DataPoint {
  id: string;
  name: string;
  description: string;
  metricType: 'percentage' | 'count' | 'currency' | 'score' | 'boolean' | 'text' | 'trend';
  unit?: string;
  sources: string[];
  defaultThreshold?: {
    operator: TriggerOperator;
    value: number | string | boolean;
    urgency: SignalUrgency;
  };
}

export interface SignalCategory {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  color: string;
  phase: 'external' | 'internal';
  dataPoints: DataPoint[];
  recommendedPlaybooks: string[];
  refreshInterval: number; // seconds
}

export const SIGNAL_CATEGORIES: SignalCategory[] = [
  // ===== EXTERNAL SIGNALS (1-12) =====
  {
    id: 'competitive',
    name: 'Competitive Movement',
    shortName: 'Competitive',
    description: 'Monitor competitor actions including product launches, pricing changes, patents, and executive movements',
    icon: 'Swords',
    color: '#ef4444', // red
    phase: 'external',
    refreshInterval: 3600, // 1 hour
    recommendedPlaybooks: ['competitive-response', 'market-defense', 'counter-positioning'],
    dataPoints: [
      {
        id: 'comp_product_launch',
        name: 'Product Launch Announcements',
        description: 'New product or feature launches by competitors',
        metricType: 'count',
        sources: ['news-api', 'press-releases', 'competitor-monitoring'],
        defaultThreshold: { operator: 'gte', value: 1, urgency: 'critical' }
      },
      {
        id: 'comp_pricing_change',
        name: 'Pricing Changes',
        description: 'Competitor pricing adjustments detected',
        metricType: 'percentage',
        unit: '%',
        sources: ['web-scraping', 'competitive-intel'],
        defaultThreshold: { operator: 'drop', value: 15, urgency: 'critical' }
      },
      {
        id: 'comp_patent_filings',
        name: 'Patent Filing Velocity',
        description: 'New patent filings by competitors',
        metricType: 'count',
        sources: ['uspto', 'epo', 'wipo'],
        defaultThreshold: { operator: 'spike', value: 3, urgency: 'high' }
      },
      {
        id: 'comp_job_postings',
        name: 'Competitor Hiring',
        description: 'Job posting volume by function',
        metricType: 'count',
        sources: ['linkedin', 'indeed'],
        defaultThreshold: { operator: 'spike', value: 50, urgency: 'high' }
      },
      {
        id: 'comp_exec_changes',
        name: 'Executive Appointments',
        description: 'C-level and VP changes at competitors',
        metricType: 'boolean',
        sources: ['linkedin', 'news-api', 'sec-filings'],
        defaultThreshold: { operator: 'eq', value: true, urgency: 'medium' }
      },
      {
        id: 'comp_partnerships',
        name: 'Strategic Partnerships',
        description: 'New alliances and partnerships announced',
        metricType: 'count',
        sources: ['news-api', 'press-releases'],
        defaultThreshold: { operator: 'gte', value: 1, urgency: 'high' }
      }
    ]
  },
  {
    id: 'market',
    name: 'Market Dynamics',
    shortName: 'Market',
    description: 'Track market share, win/loss ratios, pipeline velocity, and pricing power indicators',
    icon: 'TrendingUp',
    color: '#3b82f6', // blue
    phase: 'external',
    refreshInterval: 86400, // 24 hours
    recommendedPlaybooks: ['market-expansion', 'pricing-optimization', 'segment-pivot'],
    dataPoints: [
      {
        id: 'mkt_share',
        name: 'Market Share',
        description: 'Your percentage of total market',
        metricType: 'percentage',
        unit: '%',
        sources: ['industry-reports', 'internal-data'],
        defaultThreshold: { operator: 'drop', value: 2, urgency: 'critical' }
      },
      {
        id: 'mkt_win_rate',
        name: 'Win/Loss Ratio',
        description: 'Competitive win rate percentage',
        metricType: 'percentage',
        unit: '%',
        sources: ['crm-salesforce', 'crm-hubspot'],
        defaultThreshold: { operator: 'drop', value: 10, urgency: 'critical' }
      },
      {
        id: 'mkt_pipeline_velocity',
        name: 'Pipeline Velocity',
        description: 'Dollar value moving through pipeline per month',
        metricType: 'currency',
        unit: 'USD',
        sources: ['crm-salesforce', 'crm-hubspot'],
        defaultThreshold: { operator: 'drop', value: 25, urgency: 'critical' }
      },
      {
        id: 'mkt_deal_cycle',
        name: 'Deal Cycle Length',
        description: 'Average days from lead to close',
        metricType: 'count',
        unit: 'days',
        sources: ['crm-salesforce', 'crm-hubspot'],
        defaultThreshold: { operator: 'spike', value: 20, urgency: 'high' }
      },
      {
        id: 'mkt_avg_deal_size',
        name: 'Average Deal Size',
        description: 'Mean contract value',
        metricType: 'currency',
        unit: 'USD',
        sources: ['crm-salesforce', 'crm-hubspot'],
        defaultThreshold: { operator: 'drop', value: 15, urgency: 'high' }
      },
      {
        id: 'mkt_discount_rate',
        name: 'Discount Rate Trend',
        description: 'Average discount given on deals',
        metricType: 'percentage',
        unit: '%',
        sources: ['crm-salesforce', 'billing-systems'],
        defaultThreshold: { operator: 'spike', value: 5, urgency: 'high' }
      }
    ]
  },
  {
    id: 'financial',
    name: 'Financial & Investment',
    shortName: 'Financial',
    description: 'Monitor M&A activity, funding rounds, analyst ratings, and credit indicators',
    icon: 'DollarSign',
    color: '#22c55e', // green
    phase: 'external',
    refreshInterval: 3600, // 1 hour
    recommendedPlaybooks: ['acquisition-response', 'defensive-ma', 'investor-relations'],
    dataPoints: [
      {
        id: 'fin_ma_activity',
        name: 'M&A Announcements',
        description: 'Mergers and acquisitions in sector',
        metricType: 'count',
        sources: ['pitchbook', 'bloomberg', 'news-api'],
        defaultThreshold: { operator: 'gte', value: 1, urgency: 'critical' }
      },
      {
        id: 'fin_funding_rounds',
        name: 'Startup Funding',
        description: 'VC/PE funding in adjacent space',
        metricType: 'currency',
        unit: 'USD',
        sources: ['crunchbase', 'pitchbook'],
        defaultThreshold: { operator: 'gte', value: 50000000, urgency: 'high' }
      },
      {
        id: 'fin_analyst_ratings',
        name: 'Analyst Rating Changes',
        description: 'Buy/sell/hold rating changes',
        metricType: 'text',
        sources: ['bloomberg', 'sp-capital-iq'],
        defaultThreshold: { operator: 'contains', value: 'downgrade', urgency: 'critical' }
      },
      {
        id: 'fin_short_interest',
        name: 'Short Interest',
        description: 'Percentage of shares sold short',
        metricType: 'percentage',
        unit: '%',
        sources: ['market-data'],
        defaultThreshold: { operator: 'spike', value: 50, urgency: 'high' }
      },
      {
        id: 'fin_credit_rating',
        name: 'Credit Rating',
        description: 'Corporate credit rating status',
        metricType: 'text',
        sources: ['moodys', 'sp', 'fitch'],
        defaultThreshold: { operator: 'contains', value: 'downgrade', urgency: 'critical' }
      },
      {
        id: 'fin_pe_activity',
        name: 'PE/VC Sector Activity',
        description: 'Private equity accumulation in sector',
        metricType: 'count',
        sources: ['pitchbook', 'preqin'],
        defaultThreshold: { operator: 'gte', value: 3, urgency: 'high' }
      }
    ]
  },
  {
    id: 'regulatory',
    name: 'Regulatory & Policy',
    shortName: 'Regulatory',
    description: 'Track legislation, regulatory changes, enforcement actions, and compliance deadlines',
    icon: 'Scale',
    color: '#8b5cf6', // violet
    phase: 'external',
    refreshInterval: 86400, // 24 hours
    recommendedPlaybooks: ['compliance-sprint', 'regulatory-response', 'market-exit'],
    dataPoints: [
      {
        id: 'reg_legislation',
        name: 'Legislation Introduced',
        description: 'New bills affecting your industry',
        metricType: 'count',
        sources: ['govtrack', 'congress-api', 'federal-register'],
        defaultThreshold: { operator: 'gte', value: 1, urgency: 'high' }
      },
      {
        id: 'reg_enforcement',
        name: 'Enforcement Actions',
        description: 'Regulatory enforcement in industry',
        metricType: 'currency',
        unit: 'USD',
        sources: ['sec', 'ftc', 'industry-regulators'],
        defaultThreshold: { operator: 'gte', value: 10000000, urgency: 'high' }
      },
      {
        id: 'reg_compliance_deadline',
        name: 'Compliance Deadlines',
        description: 'Upcoming regulatory compliance dates',
        metricType: 'count',
        unit: 'months',
        sources: ['internal-tracking', 'legal-databases'],
        defaultThreshold: { operator: 'lte', value: 12, urgency: 'critical' }
      },
      {
        id: 'reg_international',
        name: 'International Regulations',
        description: 'New regulations in operating markets',
        metricType: 'count',
        sources: ['international-regulatory-feeds'],
        defaultThreshold: { operator: 'gte', value: 1, urgency: 'high' }
      },
      {
        id: 'reg_litigation',
        name: 'Industry Litigation',
        description: 'Class actions and major lawsuits',
        metricType: 'count',
        sources: ['pacer', 'legal-databases'],
        defaultThreshold: { operator: 'gte', value: 1, urgency: 'medium' }
      }
    ]
  },
  {
    id: 'supplychain',
    name: 'Supply Chain & Operational',
    shortName: 'Supply Chain',
    description: 'Monitor supplier health, lead times, inventory levels, and logistics disruptions',
    icon: 'Truck',
    color: '#f59e0b', // amber
    phase: 'external',
    refreshInterval: 3600, // 1 hour
    recommendedPlaybooks: ['supplier-diversification', 'inventory-optimization', 'vertical-integration'],
    dataPoints: [
      {
        id: 'sc_supplier_health',
        name: 'Supplier Financial Health',
        description: 'Credit scores of critical suppliers',
        metricType: 'score',
        sources: ['dun-bradstreet', 'credit-agencies'],
        defaultThreshold: { operator: 'drop', value: 1, urgency: 'critical' }
      },
      {
        id: 'sc_lead_times',
        name: 'Lead Time Changes',
        description: 'Component delivery lead times',
        metricType: 'percentage',
        unit: '%',
        sources: ['supplier-portals', 'procurement-systems'],
        defaultThreshold: { operator: 'spike', value: 30, urgency: 'critical' }
      },
      {
        id: 'sc_material_prices',
        name: 'Raw Material Prices',
        description: 'Key input cost changes',
        metricType: 'percentage',
        unit: '%',
        sources: ['commodity-exchanges'],
        defaultThreshold: { operator: 'spike', value: 20, urgency: 'high' }
      },
      {
        id: 'sc_inventory',
        name: 'Inventory Levels',
        description: 'Days of inventory on hand',
        metricType: 'count',
        unit: 'days',
        sources: ['erp-systems', 'inventory-management'],
        defaultThreshold: { operator: 'lt', value: 14, urgency: 'critical' }
      },
      {
        id: 'sc_freight_costs',
        name: 'Freight Costs',
        description: 'Shipping and logistics costs',
        metricType: 'percentage',
        unit: '%',
        sources: ['freight-indices', 'logistics-providers'],
        defaultThreshold: { operator: 'spike', value: 25, urgency: 'high' }
      },
      {
        id: 'sc_port_congestion',
        name: 'Port Congestion',
        description: 'Wait times at key ports',
        metricType: 'count',
        unit: 'days',
        sources: ['marine-traffic', 'port-authorities'],
        defaultThreshold: { operator: 'gt', value: 7, urgency: 'high' }
      }
    ]
  },
  {
    id: 'customer',
    name: 'Customer Sentiment',
    shortName: 'Customer',
    description: 'Track NPS, CSAT, support ticket trends, and social sentiment indicators',
    icon: 'Heart',
    color: '#ec4899', // pink
    phase: 'external',
    refreshInterval: 3600, // 1 hour
    recommendedPlaybooks: ['retention-campaign', 'service-recovery', 'customer-success'],
    dataPoints: [
      {
        id: 'cust_nps',
        name: 'Net Promoter Score',
        description: 'Customer loyalty score',
        metricType: 'score',
        sources: ['qualtrics', 'survey-platforms'],
        defaultThreshold: { operator: 'drop', value: 10, urgency: 'critical' }
      },
      {
        id: 'cust_csat',
        name: 'Customer Satisfaction',
        description: 'CSAT score percentage',
        metricType: 'percentage',
        unit: '%',
        sources: ['zendesk', 'servicenow'],
        defaultThreshold: { operator: 'drop', value: 15, urgency: 'critical' }
      },
      {
        id: 'cust_ticket_volume',
        name: 'Support Ticket Volume',
        description: 'Number of support tickets',
        metricType: 'count',
        sources: ['zendesk', 'servicenow'],
        defaultThreshold: { operator: 'spike', value: 50, urgency: 'high' }
      },
      {
        id: 'cust_ticket_severity',
        name: 'Critical Tickets',
        description: 'Percentage of critical/high tickets',
        metricType: 'percentage',
        unit: '%',
        sources: ['zendesk', 'servicenow'],
        defaultThreshold: { operator: 'spike', value: 3, urgency: 'critical' }
      },
      {
        id: 'cust_social_sentiment',
        name: 'Social Sentiment',
        description: 'Social media sentiment score',
        metricType: 'score',
        sources: ['brandwatch', 'sprout-social'],
        defaultThreshold: { operator: 'drop', value: 25, urgency: 'critical' }
      },
      {
        id: 'cust_review_ratings',
        name: 'Review Ratings',
        description: 'Average rating on review sites',
        metricType: 'score',
        sources: ['g2', 'capterra', 'trustradius'],
        defaultThreshold: { operator: 'lt', value: 4.0, urgency: 'high' }
      },
      {
        id: 'cust_churn_risk',
        name: 'Churn Risk Score',
        description: 'At-risk account count',
        metricType: 'count',
        sources: ['gainsight', 'churnzero'],
        defaultThreshold: { operator: 'gte', value: 1, urgency: 'critical' }
      }
    ]
  },
  {
    id: 'talent',
    name: 'Talent & Workforce',
    shortName: 'Talent',
    description: 'Monitor attrition, key departures, employee sentiment, and competitor hiring',
    icon: 'Users',
    color: '#6366f1', // indigo
    phase: 'external',
    refreshInterval: 86400, // 24 hours
    recommendedPlaybooks: ['talent-retention', 'counter-offer', 'talent-acquisition'],
    dataPoints: [
      {
        id: 'tal_attrition',
        name: 'Attrition Rate',
        description: 'Employee turnover percentage',
        metricType: 'percentage',
        unit: '%',
        sources: ['workday', 'hris'],
        defaultThreshold: { operator: 'spike', value: 20, urgency: 'critical' }
      },
      {
        id: 'tal_key_departures',
        name: 'Key Person Departures',
        description: 'Senior/critical employee exits',
        metricType: 'boolean',
        sources: ['hris', 'linkedin'],
        defaultThreshold: { operator: 'eq', value: true, urgency: 'critical' }
      },
      {
        id: 'tal_enps',
        name: 'Employee NPS',
        description: 'Employee loyalty score',
        metricType: 'score',
        sources: ['culture-amp', 'survey-platforms'],
        defaultThreshold: { operator: 'drop', value: 15, urgency: 'high' }
      },
      {
        id: 'tal_glassdoor',
        name: 'Glassdoor Rating',
        description: 'Employer rating on Glassdoor',
        metricType: 'score',
        sources: ['glassdoor-api'],
        defaultThreshold: { operator: 'lt', value: 3.5, urgency: 'high' }
      },
      {
        id: 'tal_competitor_hiring',
        name: 'Competitor Hiring Surge',
        description: 'Competitor job postings growth',
        metricType: 'percentage',
        unit: '%',
        sources: ['linkedin', 'indeed'],
        defaultThreshold: { operator: 'spike', value: 100, urgency: 'high' }
      },
      {
        id: 'tal_offer_acceptance',
        name: 'Offer Acceptance Rate',
        description: 'Percentage of offers accepted',
        metricType: 'percentage',
        unit: '%',
        sources: ['ats', 'greenhouse', 'lever'],
        defaultThreshold: { operator: 'drop', value: 20, urgency: 'high' }
      }
    ]
  },
  {
    id: 'technology',
    name: 'Technology Disruption',
    shortName: 'Technology',
    description: 'Track emerging tech adoption, open source threats, and platform dependency risks',
    icon: 'Cpu',
    color: '#14b8a6', // teal
    phase: 'external',
    refreshInterval: 86400, // 24 hours
    recommendedPlaybooks: ['tech-modernization', 'build-buy-partner', 'platform-migration'],
    dataPoints: [
      {
        id: 'tech_adoption',
        name: 'Emerging Tech Adoption',
        description: 'Adoption rate of disruptive technologies',
        metricType: 'percentage',
        unit: '%',
        sources: ['gartner', 'forrester'],
        defaultThreshold: { operator: 'gte', value: 20, urgency: 'critical' }
      },
      {
        id: 'tech_opensource',
        name: 'Open Source Momentum',
        description: 'OSS alternatives gaining traction',
        metricType: 'count',
        unit: 'stars',
        sources: ['github-api'],
        defaultThreshold: { operator: 'gte', value: 10000, urgency: 'high' }
      },
      {
        id: 'tech_deprecation',
        name: 'API Deprecation Notices',
        description: 'Critical platform deprecations',
        metricType: 'boolean',
        sources: ['vendor-announcements'],
        defaultThreshold: { operator: 'eq', value: true, urgency: 'critical' }
      },
      {
        id: 'tech_startup_funding',
        name: 'Disruptive Startup Funding',
        description: 'Funding for threatening startups',
        metricType: 'currency',
        unit: 'USD',
        sources: ['crunchbase', 'pitchbook'],
        defaultThreshold: { operator: 'gte', value: 100000000, urgency: 'high' }
      },
      {
        id: 'tech_cloud_releases',
        name: 'Cloud Platform Features',
        description: 'Competing features from cloud providers',
        metricType: 'count',
        sources: ['aws', 'azure', 'gcp-announcements'],
        defaultThreshold: { operator: 'gte', value: 1, urgency: 'critical' }
      }
    ]
  },
  {
    id: 'media',
    name: 'Media & Reputation',
    shortName: 'Media',
    description: 'Monitor news coverage, sentiment, crisis velocity, and share of voice',
    icon: 'Newspaper',
    color: '#f43f5e', // rose
    phase: 'external',
    refreshInterval: 300, // 5 minutes
    recommendedPlaybooks: ['crisis-communication', 'pr-response', 'stakeholder-outreach'],
    dataPoints: [
      {
        id: 'med_news_volume',
        name: 'News Mention Volume',
        description: 'Number of news mentions',
        metricType: 'count',
        sources: ['meltwater', 'cision'],
        defaultThreshold: { operator: 'spike', value: 5, urgency: 'critical' }
      },
      {
        id: 'med_sentiment',
        name: 'News Sentiment Score',
        description: 'Aggregate news sentiment',
        metricType: 'score',
        sources: ['meltwater', 'cision'],
        defaultThreshold: { operator: 'drop', value: 30, urgency: 'critical' }
      },
      {
        id: 'med_share_of_voice',
        name: 'Share of Voice',
        description: 'Media coverage vs competitors',
        metricType: 'percentage',
        unit: '%',
        sources: ['meltwater', 'cision'],
        defaultThreshold: { operator: 'drop', value: 20, urgency: 'high' }
      },
      {
        id: 'med_viral_negative',
        name: 'Viral Negative Content',
        description: 'Negative posts with high engagement',
        metricType: 'count',
        sources: ['brandwatch', 'sprinklr'],
        defaultThreshold: { operator: 'gte', value: 1, urgency: 'critical' }
      },
      {
        id: 'med_journalist_inquiry',
        name: 'Journalist Inquiries',
        description: 'Investigation or negative inquiries',
        metricType: 'boolean',
        sources: ['pr-team-tracking'],
        defaultThreshold: { operator: 'eq', value: true, urgency: 'critical' }
      },
      {
        id: 'med_crisis_velocity',
        name: 'Crisis Velocity',
        description: 'Stories per hour during crisis',
        metricType: 'count',
        unit: '/hour',
        sources: ['real-time-news-api'],
        defaultThreshold: { operator: 'gte', value: 10, urgency: 'critical' }
      }
    ]
  },
  {
    id: 'geopolitical',
    name: 'Geopolitical & Macro',
    shortName: 'Geopolitical',
    description: 'Track country risk, sanctions, trade policy, and regional stability',
    icon: 'Globe',
    color: '#0ea5e9', // sky
    phase: 'external',
    refreshInterval: 3600, // 1 hour
    recommendedPlaybooks: ['geographic-diversification', 'sanctions-response', 'market-exit'],
    dataPoints: [
      {
        id: 'geo_country_risk',
        name: 'Country Risk Score',
        description: 'Risk rating for operating markets',
        metricType: 'score',
        sources: ['eiu', 'control-risks'],
        defaultThreshold: { operator: 'spike', value: 1, urgency: 'high' }
      },
      {
        id: 'geo_sanctions',
        name: 'Sanctions Updates',
        description: 'New sanctions affecting operations',
        metricType: 'boolean',
        sources: ['ofac', 'eu-sanctions'],
        defaultThreshold: { operator: 'eq', value: true, urgency: 'critical' }
      },
      {
        id: 'geo_tariffs',
        name: 'Tariff Changes',
        description: 'Import/export tariff adjustments',
        metricType: 'percentage',
        unit: '%',
        sources: ['wto', 'government-sources'],
        defaultThreshold: { operator: 'spike', value: 10, urgency: 'critical' }
      },
      {
        id: 'geo_export_controls',
        name: 'Export Control Changes',
        description: 'New technology export restrictions',
        metricType: 'boolean',
        sources: ['bis', 'government-sources'],
        defaultThreshold: { operator: 'eq', value: true, urgency: 'critical' }
      },
      {
        id: 'geo_currency',
        name: 'Currency Volatility',
        description: 'FX volatility in key markets',
        metricType: 'percentage',
        unit: '%',
        sources: ['forex-data'],
        defaultThreshold: { operator: 'spike', value: 15, urgency: 'high' }
      },
      {
        id: 'geo_conflict',
        name: 'Regional Conflict',
        description: 'Military/civil conflict escalation',
        metricType: 'boolean',
        sources: ['news-api', 'intelligence-services'],
        defaultThreshold: { operator: 'eq', value: true, urgency: 'critical' }
      }
    ]
  },
  {
    id: 'economic',
    name: 'Economic Indicators',
    shortName: 'Economic',
    description: 'Monitor GDP, inflation, interest rates, PMI, and leading economic indices',
    icon: 'BarChart3',
    color: '#84cc16', // lime
    phase: 'external',
    refreshInterval: 86400, // 24 hours
    recommendedPlaybooks: ['recession-preparation', 'cost-optimization', 'growth-acceleration'],
    dataPoints: [
      {
        id: 'econ_gdp',
        name: 'GDP Growth',
        description: 'Quarterly GDP growth rate',
        metricType: 'percentage',
        unit: '%',
        sources: ['imf', 'world-bank', 'fred'],
        defaultThreshold: { operator: 'lt', value: 0, urgency: 'critical' }
      },
      {
        id: 'econ_inflation',
        name: 'Inflation Rate',
        description: 'Consumer price inflation',
        metricType: 'percentage',
        unit: '%',
        sources: ['bls', 'government-stats'],
        defaultThreshold: { operator: 'spike', value: 2, urgency: 'high' }
      },
      {
        id: 'econ_interest',
        name: 'Interest Rate Changes',
        description: 'Central bank rate decisions',
        metricType: 'percentage',
        unit: 'bps',
        sources: ['fed', 'ecb', 'central-banks'],
        defaultThreshold: { operator: 'spike', value: 50, urgency: 'high' }
      },
      {
        id: 'econ_pmi',
        name: 'Purchasing Managers Index',
        description: 'Manufacturing/services PMI',
        metricType: 'score',
        sources: ['ihs-markit'],
        defaultThreshold: { operator: 'lt', value: 50, urgency: 'critical' }
      },
      {
        id: 'econ_consumer_confidence',
        name: 'Consumer Confidence',
        description: 'Consumer confidence index',
        metricType: 'score',
        sources: ['conference-board'],
        defaultThreshold: { operator: 'drop', value: 10, urgency: 'high' }
      },
      {
        id: 'econ_yield_curve',
        name: 'Yield Curve',
        description: 'Treasury yield curve status',
        metricType: 'boolean',
        sources: ['treasury-data'],
        defaultThreshold: { operator: 'eq', value: true, urgency: 'critical' }
      },
      {
        id: 'econ_recession_prob',
        name: 'Recession Probability',
        description: 'Model-based recession odds',
        metricType: 'percentage',
        unit: '%',
        sources: ['economic-models'],
        defaultThreshold: { operator: 'gte', value: 50, urgency: 'critical' }
      }
    ]
  },
  {
    id: 'partnership',
    name: 'Partnership & Ecosystem',
    shortName: 'Partnership',
    description: 'Track partner health, ecosystem M&A, API changes, and channel performance',
    icon: 'Handshake',
    color: '#a855f7', // purple
    phase: 'external',
    refreshInterval: 86400, // 24 hours
    recommendedPlaybooks: ['partner-diversification', 'integration-response', 'channel-optimization'],
    dataPoints: [
      {
        id: 'part_revenue',
        name: 'Partner Revenue',
        description: 'Revenue from top partners',
        metricType: 'percentage',
        unit: '%',
        sources: ['partner-portal', 'finance'],
        defaultThreshold: { operator: 'drop', value: 20, urgency: 'critical' }
      },
      {
        id: 'part_health',
        name: 'Partner Financial Health',
        description: 'Credit health of key partners',
        metricType: 'score',
        sources: ['dun-bradstreet', 'public-filings'],
        defaultThreshold: { operator: 'drop', value: 1, urgency: 'critical' }
      },
      {
        id: 'part_acquisition',
        name: 'Partner Acquired',
        description: 'Key partner acquired by competitor',
        metricType: 'boolean',
        sources: ['news-api', 'sec-filings'],
        defaultThreshold: { operator: 'eq', value: true, urgency: 'critical' }
      },
      {
        id: 'part_api_deprecation',
        name: 'API Deprecation',
        description: 'Critical integration API changes',
        metricType: 'boolean',
        sources: ['vendor-communications'],
        defaultThreshold: { operator: 'eq', value: true, urgency: 'critical' }
      },
      {
        id: 'part_program_changes',
        name: 'Partner Program Changes',
        description: 'Tier or margin changes',
        metricType: 'boolean',
        sources: ['partner-communications'],
        defaultThreshold: { operator: 'eq', value: true, urgency: 'high' }
      },
      {
        id: 'part_competitor_deal',
        name: 'Partner + Competitor Deal',
        description: 'Partner announces competitor relationship',
        metricType: 'boolean',
        sources: ['news-api', 'partner-communications'],
        defaultThreshold: { operator: 'eq', value: true, urgency: 'high' }
      }
    ]
  },
  // ===== INTERNAL SIGNALS (13-16) =====
  {
    id: 'execution',
    name: 'Internal Execution',
    shortName: 'Execution',
    description: 'Monitor project health, budget variance, resource utilization, and blockers',
    icon: 'Target',
    color: '#64748b', // slate
    phase: 'internal',
    refreshInterval: 3600, // 1 hour
    recommendedPlaybooks: ['project-rescue', 'resource-reallocation', 'scope-adjustment'],
    dataPoints: [
      {
        id: 'exec_milestone_miss',
        name: 'Milestone Delays',
        description: 'Critical path delays',
        metricType: 'count',
        unit: 'weeks',
        sources: ['jira', 'asana', 'monday'],
        defaultThreshold: { operator: 'gt', value: 2, urgency: 'critical' }
      },
      {
        id: 'exec_budget_variance',
        name: 'Budget Variance',
        description: 'Spend vs budget percentage',
        metricType: 'percentage',
        unit: '%',
        sources: ['finance-systems'],
        defaultThreshold: { operator: 'gt', value: 15, urgency: 'high' }
      },
      {
        id: 'exec_resource_util',
        name: 'Resource Utilization',
        description: 'Team capacity usage',
        metricType: 'percentage',
        unit: '%',
        sources: ['resource-management'],
        defaultThreshold: { operator: 'gt', value: 110, urgency: 'high' }
      },
      {
        id: 'exec_blockers',
        name: 'Recurring Blockers',
        description: 'Same blocker appearing multiple times',
        metricType: 'count',
        sources: ['jira', 'project-systems'],
        defaultThreshold: { operator: 'gte', value: 3, urgency: 'high' }
      },
      {
        id: 'exec_decision_cycle',
        name: 'Decision Cycle Time',
        description: 'Time for strategic decisions',
        metricType: 'percentage',
        unit: '%',
        sources: ['internal-tracking'],
        defaultThreshold: { operator: 'spike', value: 2, urgency: 'high' }
      }
    ]
  },
  {
    id: 'behavior',
    name: 'Customer Behavior',
    shortName: 'Behavior',
    description: 'Track product usage patterns, feature adoption, and renewal risk indicators',
    icon: 'Activity',
    color: '#f97316', // orange
    phase: 'internal',
    refreshInterval: 3600, // 1 hour
    recommendedPlaybooks: ['adoption-acceleration', 'renewal-rescue', 'expansion-opportunity'],
    dataPoints: [
      {
        id: 'beh_usage_decline',
        name: 'Usage Decline',
        description: 'Product usage drop',
        metricType: 'percentage',
        unit: '%',
        sources: ['product-analytics', 'mixpanel', 'amplitude'],
        defaultThreshold: { operator: 'drop', value: 30, urgency: 'critical' }
      },
      {
        id: 'beh_feature_adoption',
        name: 'Feature Adoption',
        description: 'New feature adoption rate',
        metricType: 'percentage',
        unit: '%',
        sources: ['product-analytics'],
        defaultThreshold: { operator: 'lt', value: 10, urgency: 'high' }
      },
      {
        id: 'beh_login_frequency',
        name: 'Login Frequency',
        description: 'User login patterns',
        metricType: 'percentage',
        unit: '%',
        sources: ['product-analytics', 'auth-logs'],
        defaultThreshold: { operator: 'drop', value: 40, urgency: 'high' }
      },
      {
        id: 'beh_renewal_risk',
        name: 'Renewal Risk Score',
        description: 'ML-based renewal prediction',
        metricType: 'percentage',
        unit: '%',
        sources: ['gainsight', 'internal-ml'],
        defaultThreshold: { operator: 'gte', value: 70, urgency: 'critical' }
      },
      {
        id: 'beh_expansion_opp',
        name: 'Expansion Signals',
        description: 'Upsell/cross-sell indicators',
        metricType: 'count',
        sources: ['product-analytics', 'crm'],
        defaultThreshold: { operator: 'gte', value: 5, urgency: 'low' }
      }
    ]
  },
  {
    id: 'innovation',
    name: 'Innovation Pipeline',
    shortName: 'Innovation',
    description: 'Monitor R&D health, time-to-market, competitive feature gaps, and tech debt',
    icon: 'Lightbulb',
    color: '#eab308', // yellow
    phase: 'internal',
    refreshInterval: 86400, // 24 hours
    recommendedPlaybooks: ['rd-acceleration', 'tech-debt-sprint', 'competitive-catch-up'],
    dataPoints: [
      {
        id: 'innov_project_health',
        name: 'R&D Project Health',
        description: 'Percentage of projects at risk',
        metricType: 'percentage',
        unit: '%',
        sources: ['jira', 'rd-systems'],
        defaultThreshold: { operator: 'gt', value: 30, urgency: 'critical' }
      },
      {
        id: 'innov_time_to_market',
        name: 'Time-to-Market',
        description: 'TTM vs plan variance',
        metricType: 'percentage',
        unit: '%',
        sources: ['product-systems'],
        defaultThreshold: { operator: 'gt', value: 25, urgency: 'high' }
      },
      {
        id: 'innov_feature_gap',
        name: 'Competitive Feature Gap',
        description: 'Major features behind competitors',
        metricType: 'count',
        sources: ['competitive-intel', 'product-roadmap'],
        defaultThreshold: { operator: 'gte', value: 3, urgency: 'critical' }
      },
      {
        id: 'innov_tech_debt',
        name: 'Technical Debt',
        description: 'Sprint capacity consumed by debt',
        metricType: 'percentage',
        unit: '%',
        sources: ['jira', 'engineering-metrics'],
        defaultThreshold: { operator: 'gt', value: 20, urgency: 'high' }
      },
      {
        id: 'innov_patent_velocity',
        name: 'Patent Filing Velocity',
        description: 'Your patent filing rate vs target',
        metricType: 'percentage',
        unit: '%',
        sources: ['legal-tracking'],
        defaultThreshold: { operator: 'lt', value: 50, urgency: 'high' }
      }
    ]
  },
  {
    id: 'esg',
    name: 'ESG & Sustainability',
    shortName: 'ESG',
    description: 'Track ESG ratings, carbon regulations, supply chain compliance, and activism',
    icon: 'Leaf',
    color: '#10b981', // emerald
    phase: 'internal',
    refreshInterval: 86400, // 24 hours
    recommendedPlaybooks: ['sustainability-initiative', 'esg-improvement', 'activist-response'],
    dataPoints: [
      {
        id: 'esg_rating',
        name: 'ESG Rating',
        description: 'Third-party ESG rating changes',
        metricType: 'text',
        sources: ['msci', 'sustainalytics'],
        defaultThreshold: { operator: 'contains', value: 'downgrade', urgency: 'high' }
      },
      {
        id: 'esg_carbon_reg',
        name: 'Carbon Regulations',
        description: 'New carbon compliance requirements',
        metricType: 'count',
        unit: 'months',
        sources: ['regulatory-tracking'],
        defaultThreshold: { operator: 'lte', value: 24, urgency: 'high' }
      },
      {
        id: 'esg_supply_violation',
        name: 'Supply Chain ESG Violation',
        description: 'Tier-1 supplier ESG issues',
        metricType: 'boolean',
        sources: ['supplier-monitoring', 'news-api'],
        defaultThreshold: { operator: 'eq', value: true, urgency: 'critical' }
      },
      {
        id: 'esg_activist',
        name: 'Activist Investor Activity',
        description: '13D filings or campaign announcements',
        metricType: 'boolean',
        sources: ['sec-edgar', 'news-api'],
        defaultThreshold: { operator: 'eq', value: true, urgency: 'critical' }
      },
      {
        id: 'esg_target_miss',
        name: 'Sustainability Target Miss',
        description: 'Off trajectory for commitments',
        metricType: 'percentage',
        unit: '%',
        sources: ['internal-tracking'],
        defaultThreshold: { operator: 'gt', value: 10, urgency: 'high' }
      }
    ]
  }
];

// Helper functions for working with signals
export function getSignalCategory(id: string): SignalCategory | undefined {
  return SIGNAL_CATEGORIES.find(cat => cat.id === id);
}

export function getDataPoint(categoryId: string, dataPointId: string): DataPoint | undefined {
  const category = getSignalCategory(categoryId);
  return category?.dataPoints.find(dp => dp.id === dataPointId);
}

export function getExternalSignals(): SignalCategory[] {
  return SIGNAL_CATEGORIES.filter(cat => cat.phase === 'external');
}

export function getInternalSignals(): SignalCategory[] {
  return SIGNAL_CATEGORIES.filter(cat => cat.phase === 'internal');
}

export function getAllDataPoints(): { category: SignalCategory; dataPoint: DataPoint }[] {
  const result: { category: SignalCategory; dataPoint: DataPoint }[] = [];
  for (const category of SIGNAL_CATEGORIES) {
    for (const dataPoint of category.dataPoints) {
      result.push({ category, dataPoint });
    }
  }
  return result;
}

export function getTotalDataPointCount(): number {
  return SIGNAL_CATEGORIES.reduce((sum, cat) => sum + cat.dataPoints.length, 0);
}

// Signal status aggregation
export interface SignalCategoryStatus {
  categoryId: string;
  categoryName: string;
  status: SignalStatus;
  activeAlerts: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  lastUpdated: Date;
  healthScore: number; // 0-100
}

// Trigger template for quick setup
export interface TriggerTemplate {
  id: string;
  name: string;
  description: string;
  signalCategoryId: string;
  dataPointIds: string[];
  logic: 'any' | 'all' | 'threshold';
  thresholdCount?: number;
  recommendedPlaybooks: string[];
}

export const TRIGGER_TEMPLATES: TriggerTemplate[] = [
  {
    id: 'competitive_threat',
    name: 'Competitive Threat Detection',
    description: 'Alert when competitors make significant moves',
    signalCategoryId: 'competitive',
    dataPointIds: ['comp_product_launch', 'comp_pricing_change', 'comp_partnerships'],
    logic: 'any',
    recommendedPlaybooks: ['competitive-response', 'market-defense']
  },
  {
    id: 'market_decline',
    name: 'Market Position Decline',
    description: 'Alert when market metrics show negative trends',
    signalCategoryId: 'market',
    dataPointIds: ['mkt_share', 'mkt_win_rate', 'mkt_pipeline_velocity'],
    logic: 'threshold',
    thresholdCount: 2,
    recommendedPlaybooks: ['market-expansion', 'sales-acceleration']
  },
  {
    id: 'customer_crisis',
    name: 'Customer Crisis Warning',
    description: 'Alert when customer sentiment deteriorates rapidly',
    signalCategoryId: 'customer',
    dataPointIds: ['cust_nps', 'cust_csat', 'cust_social_sentiment', 'cust_churn_risk'],
    logic: 'threshold',
    thresholdCount: 2,
    recommendedPlaybooks: ['retention-campaign', 'service-recovery']
  },
  {
    id: 'supply_chain_disruption',
    name: 'Supply Chain Disruption',
    description: 'Alert when supply chain shows stress signals',
    signalCategoryId: 'supplychain',
    dataPointIds: ['sc_supplier_health', 'sc_lead_times', 'sc_inventory'],
    logic: 'any',
    recommendedPlaybooks: ['supplier-diversification', 'inventory-optimization']
  },
  {
    id: 'reputation_crisis',
    name: 'Reputation Crisis',
    description: 'Alert when media sentiment turns negative rapidly',
    signalCategoryId: 'media',
    dataPointIds: ['med_news_volume', 'med_sentiment', 'med_viral_negative', 'med_crisis_velocity'],
    logic: 'any',
    recommendedPlaybooks: ['crisis-communication', 'stakeholder-outreach']
  },
  {
    id: 'regulatory_change',
    name: 'Regulatory Change Alert',
    description: 'Alert when regulatory environment shifts',
    signalCategoryId: 'regulatory',
    dataPointIds: ['reg_legislation', 'reg_compliance_deadline', 'reg_enforcement'],
    logic: 'any',
    recommendedPlaybooks: ['compliance-sprint', 'regulatory-response']
  },
  {
    id: 'economic_downturn',
    name: 'Economic Downturn Warning',
    description: 'Alert when economic indicators signal recession',
    signalCategoryId: 'economic',
    dataPointIds: ['econ_gdp', 'econ_pmi', 'econ_yield_curve', 'econ_recession_prob'],
    logic: 'threshold',
    thresholdCount: 2,
    recommendedPlaybooks: ['recession-preparation', 'cost-optimization']
  },
  {
    id: 'talent_exodus',
    name: 'Talent Exodus Warning',
    description: 'Alert when workforce shows departure signals',
    signalCategoryId: 'talent',
    dataPointIds: ['tal_attrition', 'tal_key_departures', 'tal_enps'],
    logic: 'any',
    recommendedPlaybooks: ['talent-retention', 'counter-offer']
  }
];
