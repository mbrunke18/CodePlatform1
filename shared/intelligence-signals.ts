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
      },
      {
        id: 'comp_ad_spend',
        name: 'Advertising Spend',
        description: 'Competitor digital advertising spend changes',
        metricType: 'percentage',
        unit: '%',
        sources: ['semrush', 'similarweb', 'adbeat'],
        defaultThreshold: { operator: 'spike', value: 50, urgency: 'high' }
      },
      {
        id: 'comp_social_growth',
        name: 'Social Media Growth',
        description: 'Competitor social following growth rate',
        metricType: 'percentage',
        unit: '%',
        sources: ['sprout-social', 'brandwatch'],
        defaultThreshold: { operator: 'spike', value: 25, urgency: 'medium' }
      },
      {
        id: 'comp_market_expansion',
        name: 'Geographic Expansion',
        description: 'Competitor entering new markets or regions',
        metricType: 'boolean',
        sources: ['news-api', 'regulatory-filings'],
        defaultThreshold: { operator: 'eq', value: true, urgency: 'critical' }
      },
      {
        id: 'comp_feature_parity',
        name: 'Feature Parity Gap',
        description: 'Features competitors have that you lack',
        metricType: 'count',
        sources: ['g2', 'capterra', 'competitive-intel'],
        defaultThreshold: { operator: 'gte', value: 5, urgency: 'high' }
      },
      {
        id: 'comp_customer_wins',
        name: 'Competitor Customer Wins',
        description: 'Key accounts won by competitors',
        metricType: 'count',
        sources: ['crm-salesforce', 'news-api'],
        defaultThreshold: { operator: 'gte', value: 3, urgency: 'critical' }
      },
      {
        id: 'comp_acquisition_target',
        name: 'Acquisition Rumors',
        description: 'Competitor acquisition or merger rumors',
        metricType: 'boolean',
        sources: ['news-api', 'sec-filings', 'pitchbook'],
        defaultThreshold: { operator: 'eq', value: true, urgency: 'critical' }
      },
      {
        id: 'comp_talent_poaching',
        name: 'Talent Poaching Activity',
        description: 'Competitors recruiting your employees',
        metricType: 'count',
        sources: ['linkedin', 'hr-systems'],
        defaultThreshold: { operator: 'gte', value: 5, urgency: 'high' }
      },
      {
        id: 'comp_brand_sentiment',
        name: 'Competitor Brand Sentiment',
        description: 'Shift in competitor brand perception',
        metricType: 'score',
        sources: ['brandwatch', 'social-listening'],
        defaultThreshold: { operator: 'spike', value: 2, urgency: 'medium' }
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
      },
      {
        id: 'mkt_customer_concentration',
        name: 'Customer Concentration Risk',
        description: 'Revenue from top 10 customers',
        metricType: 'percentage',
        unit: '%',
        sources: ['crm-salesforce', 'finance-systems'],
        defaultThreshold: { operator: 'gte', value: 40, urgency: 'high' }
      },
      {
        id: 'mkt_segment_growth',
        name: 'Segment Growth Rates',
        description: 'Growth by market segment',
        metricType: 'percentage',
        unit: '%',
        sources: ['industry-reports', 'internal-data'],
        defaultThreshold: { operator: 'drop', value: 15, urgency: 'high' }
      },
      {
        id: 'mkt_pricing_power',
        name: 'Pricing Power Index',
        description: 'Ability to raise prices without churn',
        metricType: 'score',
        sources: ['internal-analytics'],
        defaultThreshold: { operator: 'drop', value: 10, urgency: 'high' }
      },
      {
        id: 'mkt_tam_expansion',
        name: 'TAM Expansion',
        description: 'Total addressable market growth',
        metricType: 'percentage',
        unit: '%',
        sources: ['industry-reports', 'gartner'],
        defaultThreshold: { operator: 'spike', value: 20, urgency: 'low' }
      },
      {
        id: 'mkt_competitive_losses',
        name: 'Competitive Loss Rate',
        description: 'Deals lost specifically to competitors',
        metricType: 'percentage',
        unit: '%',
        sources: ['crm-salesforce', 'crm-hubspot'],
        defaultThreshold: { operator: 'spike', value: 10, urgency: 'critical' }
      },
      {
        id: 'mkt_channel_performance',
        name: 'Channel Performance',
        description: 'Revenue by sales channel trend',
        metricType: 'percentage',
        unit: '%',
        sources: ['crm-salesforce', 'partner-portal'],
        defaultThreshold: { operator: 'drop', value: 20, urgency: 'high' }
      },
      {
        id: 'mkt_brand_equity',
        name: 'Brand Equity Score',
        description: 'Brand strength and recognition metrics',
        metricType: 'score',
        sources: ['brand-tracking', 'survey-platforms'],
        defaultThreshold: { operator: 'drop', value: 10, urgency: 'high' }
      },
      {
        id: 'mkt_market_volatility',
        name: 'Market Volatility Index',
        description: 'Industry-specific volatility indicators',
        metricType: 'score',
        sources: ['bloomberg', 'industry-indices'],
        defaultThreshold: { operator: 'spike', value: 30, urgency: 'high' }
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
        sources: ['bloomberg', 'sp-capital-iq', 'refinitiv', 'factset', 'morningstar'],
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
      },
      {
        id: 'fin_activist_stake',
        name: 'Activist Investor Stakes',
        description: 'Activist investor accumulating shares',
        metricType: 'boolean',
        sources: ['sec-edgar', '13f-filings'],
        defaultThreshold: { operator: 'eq', value: true, urgency: 'critical' }
      },
      {
        id: 'fin_earnings_guidance',
        name: 'Earnings Guidance Changes',
        description: 'Competitor earnings guidance revisions',
        metricType: 'text',
        sources: ['sec-filings', 'earnings-transcripts'],
        defaultThreshold: { operator: 'contains', value: 'lowered', urgency: 'high' }
      },
      {
        id: 'fin_debt_ratio',
        name: 'Industry Debt Ratios',
        description: 'Sector leverage trend changes',
        metricType: 'percentage',
        unit: '%',
        sources: ['bloomberg', 'capital-iq'],
        defaultThreshold: { operator: 'spike', value: 20, urgency: 'high' }
      },
      {
        id: 'fin_spac_activity',
        name: 'SPAC/IPO Activity',
        description: 'Public market entry by competitors',
        metricType: 'count',
        sources: ['sec-filings', 'nasdaq', 'nyse'],
        defaultThreshold: { operator: 'gte', value: 1, urgency: 'high' }
      },
      {
        id: 'fin_insider_trading',
        name: 'Insider Trading Signals',
        description: 'Unusual insider buying/selling',
        metricType: 'boolean',
        sources: ['sec-form4', 'insidertrading-api'],
        defaultThreshold: { operator: 'eq', value: true, urgency: 'medium' }
      },
      {
        id: 'fin_working_capital',
        name: 'Working Capital Ratio',
        description: 'Liquidity position changes',
        metricType: 'percentage',
        unit: '%',
        sources: ['finance-systems', 'erp'],
        defaultThreshold: { operator: 'drop', value: 20, urgency: 'high' }
      },
      {
        id: 'fin_currency_exposure',
        name: 'Currency Exposure Risk',
        description: 'FX volatility impact on operations',
        metricType: 'percentage',
        unit: '%',
        sources: ['treasury-systems', 'forex-data'],
        defaultThreshold: { operator: 'spike', value: 15, urgency: 'high' }
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
      },
      {
        id: 'reg_privacy_changes',
        name: 'Privacy Regulation Changes',
        description: 'GDPR, CCPA, or similar privacy law updates',
        metricType: 'boolean',
        sources: ['regulatory-feeds', 'iapp'],
        defaultThreshold: { operator: 'eq', value: true, urgency: 'high' }
      },
      {
        id: 'reg_antitrust',
        name: 'Antitrust Scrutiny',
        description: 'Competition/antitrust investigations in sector',
        metricType: 'boolean',
        sources: ['ftc', 'doj', 'eu-commission'],
        defaultThreshold: { operator: 'eq', value: true, urgency: 'critical' }
      },
      {
        id: 'reg_labor_law',
        name: 'Labor Law Changes',
        description: 'Employment regulation updates',
        metricType: 'count',
        sources: ['dol', 'nlrb', 'state-agencies'],
        defaultThreshold: { operator: 'gte', value: 1, urgency: 'medium' }
      },
      {
        id: 'reg_tax_policy',
        name: 'Tax Policy Changes',
        description: 'Corporate tax law changes',
        metricType: 'boolean',
        sources: ['irs', 'treasury', 'oecd'],
        defaultThreshold: { operator: 'eq', value: true, urgency: 'high' }
      },
      {
        id: 'reg_industry_guidance',
        name: 'Regulatory Guidance Updates',
        description: 'New guidance from industry regulators',
        metricType: 'count',
        sources: ['fda', 'sec', 'fcc', 'industry-regulators'],
        defaultThreshold: { operator: 'gte', value: 1, urgency: 'high' }
      },
      {
        id: 'reg_whistleblower',
        name: 'Whistleblower Reports',
        description: 'Industry whistleblower filings',
        metricType: 'boolean',
        sources: ['sec-whistleblower', 'osha'],
        defaultThreshold: { operator: 'eq', value: true, urgency: 'critical' }
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
      },
      {
        id: 'sc_single_source',
        name: 'Single Source Dependencies',
        description: 'Components with only one supplier',
        metricType: 'count',
        sources: ['procurement-systems', 'bom-analysis'],
        defaultThreshold: { operator: 'gte', value: 5, urgency: 'high' }
      },
      {
        id: 'sc_geopolitical_risk',
        name: 'Supplier Geopolitical Risk',
        description: 'Suppliers in high-risk regions',
        metricType: 'percentage',
        unit: '%',
        sources: ['supplier-database', 'risk-analytics'],
        defaultThreshold: { operator: 'gte', value: 30, urgency: 'high' }
      },
      {
        id: 'sc_quality_issues',
        name: 'Quality Incident Rate',
        description: 'Supplier quality defect rate',
        metricType: 'percentage',
        unit: '%',
        sources: ['quality-management', 'erp-systems'],
        defaultThreshold: { operator: 'spike', value: 50, urgency: 'critical' }
      },
      {
        id: 'sc_capacity_utilization',
        name: 'Manufacturing Capacity',
        description: 'Production capacity utilization',
        metricType: 'percentage',
        unit: '%',
        sources: ['mes-systems', 'erp-systems'],
        defaultThreshold: { operator: 'gte', value: 95, urgency: 'high' }
      },
      {
        id: 'sc_weather_disruption',
        name: 'Weather Event Alerts',
        description: 'Weather affecting supply routes',
        metricType: 'boolean',
        sources: ['weather-api', 'noaa'],
        defaultThreshold: { operator: 'eq', value: true, urgency: 'high' }
      },
      {
        id: 'sc_labor_disruption',
        name: 'Labor Disruption Risk',
        description: 'Strike or labor action threats',
        metricType: 'boolean',
        sources: ['news-api', 'labor-tracking'],
        defaultThreshold: { operator: 'eq', value: true, urgency: 'critical' }
      },
      {
        id: 'sc_raw_material_prices',
        name: 'Raw Material Price Index',
        description: 'Key input material price changes',
        metricType: 'percentage',
        unit: '%',
        sources: ['commodity-exchanges', 'procurement-systems'],
        defaultThreshold: { operator: 'spike', value: 20, urgency: 'high' }
      },
      {
        id: 'sc_fulfillment_rate',
        name: 'Order Fulfillment Rate',
        description: 'On-time, in-full delivery performance',
        metricType: 'percentage',
        unit: '%',
        sources: ['wms-systems', 'erp'],
        defaultThreshold: { operator: 'drop', value: 5, urgency: 'critical' }
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
      },
      {
        id: 'cust_executive_change',
        name: 'Customer Executive Changes',
        description: 'Key contact departures at accounts',
        metricType: 'count',
        sources: ['linkedin', 'crm-salesforce'],
        defaultThreshold: { operator: 'gte', value: 3, urgency: 'high' }
      },
      {
        id: 'cust_contract_renewal',
        name: 'Renewal Pipeline Health',
        description: 'Renewals at risk in next 90 days',
        metricType: 'currency',
        unit: 'USD',
        sources: ['crm-salesforce', 'finance-systems'],
        defaultThreshold: { operator: 'gte', value: 500000, urgency: 'critical' }
      },
      {
        id: 'cust_expansion_revenue',
        name: 'Expansion Revenue Trend',
        description: 'Upsell and cross-sell revenue growth',
        metricType: 'percentage',
        unit: '%',
        sources: ['crm-salesforce', 'billing-systems'],
        defaultThreshold: { operator: 'drop', value: 20, urgency: 'high' }
      },
      {
        id: 'cust_response_time',
        name: 'Support Response Time',
        description: 'Average first response time',
        metricType: 'count',
        unit: 'hours',
        sources: ['zendesk', 'servicenow'],
        defaultThreshold: { operator: 'spike', value: 4, urgency: 'high' }
      },
      {
        id: 'cust_product_feedback',
        name: 'Feature Request Volume',
        description: 'Customer feature requests trend',
        metricType: 'count',
        sources: ['productboard', 'canny', 'uservoice'],
        defaultThreshold: { operator: 'spike', value: 50, urgency: 'medium' }
      },
      {
        id: 'cust_advocacy_score',
        name: 'Customer Advocacy Score',
        description: 'Customers willing to refer or advocate',
        metricType: 'percentage',
        unit: '%',
        sources: ['gainsight', 'survey-platforms'],
        defaultThreshold: { operator: 'drop', value: 15, urgency: 'high' }
      },
      {
        id: 'cust_implementation_health',
        name: 'Implementation Health',
        description: 'Active implementation project status',
        metricType: 'count',
        sources: ['pmo-tools', 'customer-success'],
        defaultThreshold: { operator: 'gte', value: 3, urgency: 'high' }
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
      },
      {
        id: 'tal_time_to_hire',
        name: 'Time to Hire',
        description: 'Average days to fill positions',
        metricType: 'count',
        unit: 'days',
        sources: ['ats', 'greenhouse', 'lever'],
        defaultThreshold: { operator: 'spike', value: 30, urgency: 'high' }
      },
      {
        id: 'tal_salary_competitiveness',
        name: 'Salary Competitiveness',
        description: 'Compensation vs market rate',
        metricType: 'percentage',
        unit: '%',
        sources: ['levels-fyi', 'glassdoor', 'compensation-data'],
        defaultThreshold: { operator: 'lt', value: 90, urgency: 'high' }
      },
      {
        id: 'tal_diversity_metrics',
        name: 'Diversity Metrics',
        description: 'Diversity representation changes',
        metricType: 'percentage',
        unit: '%',
        sources: ['hris', 'workday'],
        defaultThreshold: { operator: 'drop', value: 5, urgency: 'medium' }
      },
      {
        id: 'tal_skill_gaps',
        name: 'Critical Skill Gaps',
        description: 'Unfilled critical skill positions',
        metricType: 'count',
        sources: ['hris', 'skills-matrix'],
        defaultThreshold: { operator: 'gte', value: 5, urgency: 'high' }
      },
      {
        id: 'tal_leadership_bench',
        name: 'Leadership Bench Strength',
        description: 'Succession pipeline coverage',
        metricType: 'percentage',
        unit: '%',
        sources: ['hris', 'succession-planning'],
        defaultThreshold: { operator: 'lt', value: 70, urgency: 'high' }
      },
      {
        id: 'tal_training_completion',
        name: 'Training Completion Rate',
        description: 'Mandatory training compliance',
        metricType: 'percentage',
        unit: '%',
        sources: ['lms', 'hris'],
        defaultThreshold: { operator: 'lt', value: 90, urgency: 'medium' }
      },
      {
        id: 'tal_remote_productivity',
        name: 'Remote Work Productivity',
        description: 'Remote vs office performance metrics',
        metricType: 'percentage',
        unit: '%',
        sources: ['productivity-tools', 'hris'],
        defaultThreshold: { operator: 'drop', value: 15, urgency: 'medium' }
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
      },
      {
        id: 'tech_ai_advancement',
        name: 'AI Capability Advances',
        description: 'Major AI breakthroughs affecting industry',
        metricType: 'boolean',
        sources: ['arxiv', 'tech-news', 'openai-announcements'],
        defaultThreshold: { operator: 'eq', value: true, urgency: 'critical' }
      },
      {
        id: 'tech_quantum_progress',
        name: 'Quantum Computing Progress',
        description: 'Quantum computing milestones',
        metricType: 'boolean',
        sources: ['research-papers', 'ibm-quantum', 'google-quantum'],
        defaultThreshold: { operator: 'eq', value: true, urgency: 'high' }
      },
      {
        id: 'tech_platform_dependency',
        name: 'Platform Dependency Score',
        description: 'Revenue dependent on single platform',
        metricType: 'percentage',
        unit: '%',
        sources: ['internal-analytics'],
        defaultThreshold: { operator: 'gte', value: 50, urgency: 'high' }
      },
      {
        id: 'tech_legacy_systems',
        name: 'Legacy System Risk',
        description: 'Systems past end-of-life',
        metricType: 'count',
        sources: ['it-asset-management'],
        defaultThreshold: { operator: 'gte', value: 5, urgency: 'high' }
      },
      {
        id: 'tech_blockchain_adoption',
        name: 'Blockchain Adoption',
        description: 'Industry blockchain implementations',
        metricType: 'count',
        sources: ['news-api', 'industry-reports'],
        defaultThreshold: { operator: 'gte', value: 3, urgency: 'medium' }
      },
      {
        id: 'tech_automation_rate',
        name: 'Process Automation Rate',
        description: 'Percentage of processes automated',
        metricType: 'percentage',
        unit: '%',
        sources: ['rpa-platforms', 'process-mining'],
        defaultThreshold: { operator: 'lt', value: 30, urgency: 'medium' }
      },
      {
        id: 'tech_data_quality',
        name: 'Data Quality Score',
        description: 'Enterprise data accuracy metrics',
        metricType: 'score',
        sources: ['data-quality-tools', 'master-data-management'],
        defaultThreshold: { operator: 'lt', value: 85, urgency: 'high' }
      },
      {
        id: 'tech_api_health',
        name: 'API Health Score',
        description: 'Critical API uptime and latency',
        metricType: 'percentage',
        unit: '%',
        sources: ['api-monitoring', 'observability-platforms'],
        defaultThreshold: { operator: 'lt', value: 99, urgency: 'critical' }
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
      },
      {
        id: 'med_influencer_mentions',
        name: 'Influencer Mentions',
        description: 'Mentions by key industry influencers',
        metricType: 'count',
        sources: ['brandwatch', 'twitter-api'],
        defaultThreshold: { operator: 'spike', value: 5, urgency: 'high' }
      },
      {
        id: 'med_executive_visibility',
        name: 'Executive Media Visibility',
        description: 'CEO/C-suite media presence',
        metricType: 'count',
        sources: ['meltwater', 'cision'],
        defaultThreshold: { operator: 'drop', value: 50, urgency: 'medium' }
      },
      {
        id: 'med_boycott_signals',
        name: 'Boycott Signals',
        description: 'Social media boycott campaigns',
        metricType: 'boolean',
        sources: ['brandwatch', 'social-listening'],
        defaultThreshold: { operator: 'eq', value: true, urgency: 'critical' }
      },
      {
        id: 'med_misinformation',
        name: 'Misinformation Spread',
        description: 'False information spreading about company',
        metricType: 'boolean',
        sources: ['fact-check-apis', 'social-listening'],
        defaultThreshold: { operator: 'eq', value: true, urgency: 'critical' }
      },
      {
        id: 'med_earned_media_value',
        name: 'Earned Media Value',
        description: 'Value of unpaid media coverage',
        metricType: 'currency',
        unit: 'USD',
        sources: ['meltwater', 'cision'],
        defaultThreshold: { operator: 'drop', value: 30, urgency: 'medium' }
      },
      {
        id: 'med_video_engagement',
        name: 'Video Content Engagement',
        description: 'Video views and engagement metrics',
        metricType: 'percentage',
        unit: '%',
        sources: ['youtube-analytics', 'video-platforms'],
        defaultThreshold: { operator: 'drop', value: 30, urgency: 'medium' }
      },
      {
        id: 'med_podcast_mentions',
        name: 'Podcast Mentions',
        description: 'Brand mentions in industry podcasts',
        metricType: 'count',
        sources: ['podcast-monitoring', 'media-tracking'],
        defaultThreshold: { operator: 'spike', value: 5, urgency: 'low' }
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
      },
      {
        id: 'geo_election_impact',
        name: 'Election Impact',
        description: 'Upcoming elections in key markets',
        metricType: 'count',
        unit: 'months',
        sources: ['election-calendars', 'political-risk'],
        defaultThreshold: { operator: 'lte', value: 6, urgency: 'high' }
      },
      {
        id: 'geo_trade_agreements',
        name: 'Trade Agreement Changes',
        description: 'New or modified trade agreements',
        metricType: 'boolean',
        sources: ['wto', 'ustr', 'government-sources'],
        defaultThreshold: { operator: 'eq', value: true, urgency: 'high' }
      },
      {
        id: 'geo_nationalization_risk',
        name: 'Nationalization Risk',
        description: 'Asset seizure or nationalization threats',
        metricType: 'boolean',
        sources: ['political-risk-services', 'eiu'],
        defaultThreshold: { operator: 'eq', value: true, urgency: 'critical' }
      },
      {
        id: 'geo_supply_route_risk',
        name: 'Supply Route Disruption',
        description: 'Critical shipping lane threats',
        metricType: 'boolean',
        sources: ['maritime-intelligence', 'news-api'],
        defaultThreshold: { operator: 'eq', value: true, urgency: 'critical' }
      },
      {
        id: 'geo_diplomatic_tensions',
        name: 'Diplomatic Tensions',
        description: 'Rising tensions between key trading partners',
        metricType: 'score',
        sources: ['political-risk-services', 'news-api'],
        defaultThreshold: { operator: 'spike', value: 2, urgency: 'high' }
      },
      {
        id: 'geo_climate_policy',
        name: 'Climate Policy Changes',
        description: 'Environmental regulations in key markets',
        metricType: 'count',
        sources: ['government-sources', 'climate-policy-tracking'],
        defaultThreshold: { operator: 'gte', value: 2, urgency: 'medium' }
      },
      {
        id: 'geo_infrastructure_invest',
        name: 'Infrastructure Investment',
        description: 'Major infrastructure spending announcements',
        metricType: 'currency',
        unit: 'USD',
        sources: ['government-sources', 'news-api'],
        defaultThreshold: { operator: 'gte', value: 1000000000, urgency: 'low' }
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
      },
      {
        id: 'econ_unemployment',
        name: 'Unemployment Rate',
        description: 'Key market unemployment changes',
        metricType: 'percentage',
        unit: '%',
        sources: ['bls', 'eurostat'],
        defaultThreshold: { operator: 'spike', value: 1, urgency: 'high' }
      },
      {
        id: 'econ_housing_market',
        name: 'Housing Market Index',
        description: 'Housing market health indicator',
        metricType: 'score',
        sources: ['case-shiller', 'nahb'],
        defaultThreshold: { operator: 'drop', value: 15, urgency: 'high' }
      },
      {
        id: 'econ_commodity_prices',
        name: 'Key Commodity Prices',
        description: 'Oil, copper, and other key commodities',
        metricType: 'percentage',
        unit: '%',
        sources: ['commodity-exchanges', 'bloomberg'],
        defaultThreshold: { operator: 'spike', value: 20, urgency: 'high' }
      },
      {
        id: 'econ_business_sentiment',
        name: 'Business Confidence Index',
        description: 'CEO/CFO confidence surveys',
        metricType: 'score',
        sources: ['conference-board', 'business-roundtable'],
        defaultThreshold: { operator: 'drop', value: 15, urgency: 'high' }
      },
      {
        id: 'econ_credit_conditions',
        name: 'Credit Conditions',
        description: 'Lending standards and credit availability',
        metricType: 'text',
        sources: ['fed-sloos', 'banking-surveys'],
        defaultThreshold: { operator: 'contains', value: 'tightening', urgency: 'high' }
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
      },
      {
        id: 'part_integration_usage',
        name: 'Integration Usage',
        description: 'Partner integration API call volume',
        metricType: 'percentage',
        unit: '%',
        sources: ['api-analytics', 'partner-portal'],
        defaultThreshold: { operator: 'drop', value: 30, urgency: 'high' }
      },
      {
        id: 'part_certification_expiry',
        name: 'Certification Expiry',
        description: 'Partner certifications expiring soon',
        metricType: 'count',
        unit: 'days',
        sources: ['partner-portal', 'internal-tracking'],
        defaultThreshold: { operator: 'lte', value: 90, urgency: 'medium' }
      },
      {
        id: 'part_co_sell_pipeline',
        name: 'Co-Sell Pipeline',
        description: 'Joint opportunities in pipeline',
        metricType: 'currency',
        unit: 'USD',
        sources: ['crm-salesforce', 'partner-portal'],
        defaultThreshold: { operator: 'drop', value: 25, urgency: 'high' }
      },
      {
        id: 'part_marketplace_ranking',
        name: 'Marketplace Ranking',
        description: 'Position on partner marketplaces',
        metricType: 'count',
        sources: ['marketplace-analytics'],
        defaultThreshold: { operator: 'drop', value: 10, urgency: 'medium' }
      },
      {
        id: 'part_strategic_review',
        name: 'Strategic Partner Review',
        description: 'Partner performance review outcomes',
        metricType: 'text',
        sources: ['partner-portal', 'internal-tracking'],
        defaultThreshold: { operator: 'contains', value: 'at-risk', urgency: 'critical' }
      },
      {
        id: 'part_referral_pipeline',
        name: 'Partner Referral Pipeline',
        description: 'Leads generated by partners',
        metricType: 'count',
        sources: ['crm-salesforce', 'partner-portal'],
        defaultThreshold: { operator: 'drop', value: 30, urgency: 'high' }
      },
      {
        id: 'part_training_completion',
        name: 'Partner Training Completion',
        description: 'Partner certification progress',
        metricType: 'percentage',
        unit: '%',
        sources: ['lms', 'partner-portal'],
        defaultThreshold: { operator: 'lt', value: 70, urgency: 'medium' }
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
      },
      {
        id: 'exec_okr_progress',
        name: 'OKR Progress',
        description: 'Quarterly OKR achievement rate',
        metricType: 'percentage',
        unit: '%',
        sources: ['lattice', '15five', 'internal-tracking'],
        defaultThreshold: { operator: 'lt', value: 70, urgency: 'high' }
      },
      {
        id: 'exec_strategic_initiative',
        name: 'Strategic Initiative Health',
        description: 'Major initiatives at risk',
        metricType: 'count',
        sources: ['pmo-tools', 'jira'],
        defaultThreshold: { operator: 'gte', value: 2, urgency: 'critical' }
      },
      {
        id: 'exec_cross_functional',
        name: 'Cross-Functional Delays',
        description: 'Projects blocked by other teams',
        metricType: 'count',
        sources: ['jira', 'asana', 'monday'],
        defaultThreshold: { operator: 'gte', value: 5, urgency: 'high' }
      },
      {
        id: 'exec_scope_creep',
        name: 'Scope Creep Index',
        description: 'Scope changes after project start',
        metricType: 'percentage',
        unit: '%',
        sources: ['project-systems'],
        defaultThreshold: { operator: 'gte', value: 25, urgency: 'high' }
      },
      {
        id: 'exec_stakeholder_alignment',
        name: 'Stakeholder Alignment',
        description: 'Executive alignment score on priorities',
        metricType: 'score',
        sources: ['survey-platforms', 'internal-tracking'],
        defaultThreshold: { operator: 'lt', value: 70, urgency: 'high' }
      },
      {
        id: 'exec_change_velocity',
        name: 'Change Request Velocity',
        description: 'Rate of strategic pivots',
        metricType: 'count',
        sources: ['pmo-tools'],
        defaultThreshold: { operator: 'spike', value: 3, urgency: 'medium' }
      },
      {
        id: 'exec_meeting_efficiency',
        name: 'Meeting Efficiency Score',
        description: 'Outcome-to-meeting-time ratio',
        metricType: 'score',
        sources: ['calendar-analytics', 'productivity-tools'],
        defaultThreshold: { operator: 'lt', value: 60, urgency: 'medium' }
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
      },
      {
        id: 'beh_session_duration',
        name: 'Session Duration',
        description: 'Average time in product',
        metricType: 'percentage',
        unit: '%',
        sources: ['product-analytics', 'mixpanel'],
        defaultThreshold: { operator: 'drop', value: 25, urgency: 'high' }
      },
      {
        id: 'beh_core_action_frequency',
        name: 'Core Action Frequency',
        description: 'Key product action completion rate',
        metricType: 'percentage',
        unit: '%',
        sources: ['product-analytics'],
        defaultThreshold: { operator: 'drop', value: 20, urgency: 'critical' }
      },
      {
        id: 'beh_user_segments',
        name: 'Power User Decline',
        description: 'Power user segment shrinking',
        metricType: 'percentage',
        unit: '%',
        sources: ['product-analytics'],
        defaultThreshold: { operator: 'drop', value: 15, urgency: 'high' }
      },
      {
        id: 'beh_onboarding_completion',
        name: 'Onboarding Completion',
        description: 'New user onboarding completion rate',
        metricType: 'percentage',
        unit: '%',
        sources: ['product-analytics', 'pendo'],
        defaultThreshold: { operator: 'lt', value: 60, urgency: 'high' }
      },
      {
        id: 'beh_feature_stickiness',
        name: 'Feature Stickiness',
        description: 'DAU/MAU ratio for key features',
        metricType: 'percentage',
        unit: '%',
        sources: ['product-analytics'],
        defaultThreshold: { operator: 'drop', value: 10, urgency: 'high' }
      },
      {
        id: 'beh_error_rate',
        name: 'User Error Rate',
        description: 'Errors encountered per session',
        metricType: 'percentage',
        unit: '%',
        sources: ['product-analytics', 'error-tracking'],
        defaultThreshold: { operator: 'spike', value: 50, urgency: 'high' }
      },
      {
        id: 'beh_mobile_engagement',
        name: 'Mobile Engagement',
        description: 'Mobile app usage vs web',
        metricType: 'percentage',
        unit: '%',
        sources: ['mobile-analytics', 'product-analytics'],
        defaultThreshold: { operator: 'drop', value: 20, urgency: 'medium' }
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
      },
      {
        id: 'innov_rd_roi',
        name: 'R&D ROI',
        description: 'Return on R&D investment',
        metricType: 'percentage',
        unit: '%',
        sources: ['finance-systems', 'rd-tracking'],
        defaultThreshold: { operator: 'drop', value: 20, urgency: 'high' }
      },
      {
        id: 'innov_prototype_velocity',
        name: 'Prototype Velocity',
        description: 'Speed of prototype development',
        metricType: 'count',
        unit: 'weeks',
        sources: ['rd-systems', 'jira'],
        defaultThreshold: { operator: 'spike', value: 4, urgency: 'high' }
      },
      {
        id: 'innov_customer_beta',
        name: 'Beta Program Health',
        description: 'Customer beta program engagement',
        metricType: 'percentage',
        unit: '%',
        sources: ['product-systems', 'customer-success'],
        defaultThreshold: { operator: 'drop', value: 25, urgency: 'medium' }
      },
      {
        id: 'innov_acquisition_targets',
        name: 'Acqui-hire Pipeline',
        description: 'Technology acquisition targets',
        metricType: 'count',
        sources: ['corp-dev-tracking', 'pitchbook'],
        defaultThreshold: { operator: 'drop', value: 50, urgency: 'low' }
      },
      {
        id: 'innov_researcher_retention',
        name: 'Key Researcher Retention',
        description: 'Top R&D talent retention rate',
        metricType: 'percentage',
        unit: '%',
        sources: ['hris', 'rd-systems'],
        defaultThreshold: { operator: 'drop', value: 10, urgency: 'critical' }
      },
      {
        id: 'innov_open_source_contrib',
        name: 'Open Source Contributions',
        description: 'Team contributions to open source projects',
        metricType: 'count',
        sources: ['github', 'engineering-metrics'],
        defaultThreshold: { operator: 'drop', value: 50, urgency: 'low' }
      },
      {
        id: 'innov_hackathon_output',
        name: 'Innovation Events Output',
        description: 'Projects from hackathons and innovation days',
        metricType: 'count',
        sources: ['internal-tracking', 'innovation-platform'],
        defaultThreshold: { operator: 'lt', value: 5, urgency: 'medium' }
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
      },
      {
        id: 'esg_dei_progress',
        name: 'DEI Progress',
        description: 'Diversity, equity, inclusion metrics',
        metricType: 'percentage',
        unit: '%',
        sources: ['hris', 'dei-tracking'],
        defaultThreshold: { operator: 'drop', value: 5, urgency: 'medium' }
      },
      {
        id: 'esg_carbon_footprint',
        name: 'Carbon Footprint',
        description: 'Scope 1/2/3 emissions trend',
        metricType: 'percentage',
        unit: '%',
        sources: ['sustainability-platform', 'internal-tracking'],
        defaultThreshold: { operator: 'spike', value: 10, urgency: 'high' }
      },
      {
        id: 'esg_governance_score',
        name: 'Governance Score',
        description: 'Board governance assessment',
        metricType: 'score',
        sources: ['iss', 'glass-lewis'],
        defaultThreshold: { operator: 'drop', value: 1, urgency: 'high' }
      },
      {
        id: 'esg_stakeholder_concerns',
        name: 'Stakeholder ESG Concerns',
        description: 'ESG-related investor inquiries',
        metricType: 'count',
        sources: ['investor-relations', 'shareholder-tracking'],
        defaultThreshold: { operator: 'spike', value: 5, urgency: 'high' }
      },
      {
        id: 'esg_water_usage',
        name: 'Water Usage',
        description: 'Water consumption trends',
        metricType: 'percentage',
        unit: '%',
        sources: ['facility-management', 'sustainability-platform'],
        defaultThreshold: { operator: 'spike', value: 15, urgency: 'medium' }
      },
      {
        id: 'esg_waste_reduction',
        name: 'Waste Reduction',
        description: 'Waste diversion rate',
        metricType: 'percentage',
        unit: '%',
        sources: ['facility-management', 'sustainability-platform'],
        defaultThreshold: { operator: 'drop', value: 10, urgency: 'medium' }
      }
    ]
  },
  {
    id: 'cyber',
    name: 'Cybersecurity & Threats',
    shortName: 'Cyber',
    description: 'Monitor cyber threats, breach indicators, ransomware activity, and security posture',
    icon: 'Shield',
    color: '#dc2626', // red
    phase: 'internal',
    refreshInterval: 300, // 5 minutes - critical category
    recommendedPlaybooks: ['cyber-incident-response', 'ransomware-playbook', 'data-breach-response'],
    dataPoints: [
      {
        id: 'cyber_threat_level',
        name: 'Threat Level Index',
        description: 'Overall cyber threat level from aggregated feeds',
        metricType: 'score',
        sources: ['threat-intel-feeds', 'cisa-alerts', 'isac-reports'],
        defaultThreshold: { operator: 'gte', value: 8, urgency: 'critical' }
      },
      {
        id: 'cyber_ransomware_activity',
        name: 'Ransomware Activity',
        description: 'Industry-targeted ransomware campaigns detected',
        metricType: 'count',
        sources: ['darkweb-monitoring', 'threat-intel', 'fbi-flash'],
        defaultThreshold: { operator: 'gte', value: 1, urgency: 'critical' }
      },
      {
        id: 'cyber_vulnerability_critical',
        name: 'Critical Vulnerabilities',
        description: 'Unpatched critical CVEs in your environment',
        metricType: 'count',
        sources: ['vulnerability-scanner', 'nist-nvd', 'cisa-kev'],
        defaultThreshold: { operator: 'gte', value: 1, urgency: 'critical' }
      },
      {
        id: 'cyber_phishing_volume',
        name: 'Phishing Attempts',
        description: 'Phishing emails targeting organization',
        metricType: 'count',
        sources: ['email-security', 'proofpoint', 'mimecast'],
        defaultThreshold: { operator: 'spike', value: 200, urgency: 'high' }
      },
      {
        id: 'cyber_anomaly_detection',
        name: 'Behavioral Anomalies',
        description: 'Unusual network or user behavior detected',
        metricType: 'count',
        sources: ['siem', 'ueba', 'ndr'],
        defaultThreshold: { operator: 'gte', value: 5, urgency: 'high' }
      },
      {
        id: 'cyber_breach_indicators',
        name: 'Breach Indicators',
        description: 'Indicators of compromise detected in environment',
        metricType: 'count',
        sources: ['edr', 'threat-intel', 'siem'],
        defaultThreshold: { operator: 'gte', value: 1, urgency: 'critical' }
      },
      {
        id: 'cyber_third_party_risk',
        name: 'Third-Party Risk Score',
        description: 'Vendor/supplier cybersecurity risk rating',
        metricType: 'score',
        sources: ['security-scorecard', 'bitsight', 'riskrecon'],
        defaultThreshold: { operator: 'lt', value: 70, urgency: 'high' }
      },
      {
        id: 'cyber_dark_web_mentions',
        name: 'Dark Web Mentions',
        description: 'Company/employee data found on dark web',
        metricType: 'count',
        sources: ['darkweb-monitoring', 'recorded-future', 'flashpoint'],
        defaultThreshold: { operator: 'gte', value: 1, urgency: 'critical' }
      },
      {
        id: 'cyber_ddos_risk',
        name: 'DDoS Attack Risk',
        description: 'Elevated DDoS threat indicators',
        metricType: 'boolean',
        sources: ['cloudflare', 'akamai', 'aws-shield'],
        defaultThreshold: { operator: 'eq', value: true, urgency: 'high' }
      },
      {
        id: 'cyber_compliance_gap',
        name: 'Security Compliance Gaps',
        description: 'Failed security controls or audit findings',
        metricType: 'count',
        sources: ['grc-platform', 'audit-reports'],
        defaultThreshold: { operator: 'gte', value: 3, urgency: 'high' }
      },
      {
        id: 'cyber_insider_threat',
        name: 'Insider Threat Indicators',
        description: 'Unusual employee data access patterns',
        metricType: 'count',
        sources: ['dlp', 'ueba', 'casb'],
        defaultThreshold: { operator: 'gte', value: 3, urgency: 'critical' }
      },
      {
        id: 'cyber_credential_exposure',
        name: 'Credential Exposure',
        description: 'Employee credentials found in breaches',
        metricType: 'count',
        sources: ['haveibeenpwned', 'spycloud', 'recorded-future'],
        defaultThreshold: { operator: 'gte', value: 1, urgency: 'critical' }
      }
    ]
  },

  // ===== OPERATIONAL EXCELLENCE (18) =====
  {
    id: 'operational',
    name: 'Operational Excellence',
    shortName: 'Operations',
    description: 'Monitor process efficiency, delivery velocity, quality metrics, and operational health across the enterprise',
    icon: 'Settings',
    color: '#7C3AED',
    phase: 'internal',
    refreshInterval: 3600,
    recommendedPlaybooks: ['operational-turnaround', 'process-optimization', 'cost-efficiency-sprint', 'quality-recovery'],
    dataPoints: [
      {
        id: 'ops_on_time_delivery',
        name: 'On-Time Delivery Rate',
        description: 'Percentage of projects, orders, or commitments delivered on schedule',
        metricType: 'percentage',
        unit: '%',
        sources: ['erp', 'project-management', 'supply-chain-system'],
        defaultThreshold: { operator: 'lt', value: 85, urgency: 'high' }
      },
      {
        id: 'ops_defect_rate',
        name: 'Defect / Error Rate',
        description: 'Rate of defects, errors, or quality failures per unit output',
        metricType: 'percentage',
        unit: '%',
        sources: ['quality-management-system', 'erp', 'customer-support'],
        defaultThreshold: { operator: 'gt', value: 2, urgency: 'high' }
      },
      {
        id: 'ops_process_cycle_time',
        name: 'Process Cycle Time',
        description: 'Average time to complete key operational processes end-to-end',
        metricType: 'trend',
        sources: ['bpm-system', 'erp', 'workflow-tools'],
        defaultThreshold: { operator: 'spike', value: 20, urgency: 'medium' }
      },
      {
        id: 'ops_capacity_utilization',
        name: 'Capacity Utilization',
        description: 'Percentage of available operational capacity being actively used',
        metricType: 'percentage',
        unit: '%',
        sources: ['erp', 'manufacturing-system', 'crm'],
        defaultThreshold: { operator: 'gt', value: 95, urgency: 'medium' }
      },
      {
        id: 'ops_cost_per_unit',
        name: 'Cost Per Unit / Transaction',
        description: 'Cost efficiency of producing each unit or completing each transaction',
        metricType: 'currency',
        sources: ['erp', 'financial-system', 'cost-accounting'],
        defaultThreshold: { operator: 'spike', value: 10, urgency: 'medium' }
      },
      {
        id: 'ops_sla_compliance',
        name: 'SLA Compliance Rate',
        description: 'Percentage of service level agreements met across all customer commitments',
        metricType: 'percentage',
        unit: '%',
        sources: ['servicenow', 'crm', 'helpdesk'],
        defaultThreshold: { operator: 'lt', value: 95, urgency: 'high' }
      },
      {
        id: 'ops_backlog_growth',
        name: 'Backlog Growth Rate',
        description: 'Rate at which unfulfilled orders, tickets, or tasks are accumulating',
        metricType: 'trend',
        sources: ['erp', 'project-management', 'servicenow'],
        defaultThreshold: { operator: 'spike', value: 25, urgency: 'high' }
      },
      {
        id: 'ops_workforce_productivity',
        name: 'Workforce Productivity Index',
        description: 'Output per employee or team relative to baseline targets',
        metricType: 'score',
        sources: ['hr-system', 'erp', 'project-management'],
        defaultThreshold: { operator: 'drop', value: 15, urgency: 'medium' }
      },
      {
        id: 'ops_system_uptime',
        name: 'System Uptime / Availability',
        description: 'Availability of critical operational systems and infrastructure',
        metricType: 'percentage',
        unit: '%',
        sources: ['aws-cloudwatch', 'datadog', 'pagerduty'],
        defaultThreshold: { operator: 'lt', value: 99, urgency: 'critical' }
      },
      {
        id: 'ops_change_failure_rate',
        name: 'Change Failure Rate',
        description: 'Percentage of operational changes that result in incidents or rollbacks',
        metricType: 'percentage',
        unit: '%',
        sources: ['devops-platform', 'servicenow', 'jira'],
        defaultThreshold: { operator: 'gt', value: 5, urgency: 'high' }
      },
      {
        id: 'ops_incident_volume',
        name: 'Operational Incident Volume',
        description: 'Number of operational incidents, outages, or escalations per period',
        metricType: 'count',
        sources: ['pagerduty', 'servicenow', 'opsgenie'],
        defaultThreshold: { operator: 'spike', value: 30, urgency: 'high' }
      }
    ]
  },

  // ===== AI GOVERNANCE (19) =====
  {
    id: 'ai_governance',
    name: 'AI Governance',
    shortName: 'AI Governance',
    description: 'Monitor AI model performance, bias indicators, regulatory compliance, and enterprise AI adoption risk across all AI systems',
    icon: 'Brain',
    color: '#8B5CF6',
    phase: 'internal',
    refreshInterval: 7200,
    recommendedPlaybooks: ['ai-governance-sprint', 'model-risk-response', 'ai-compliance-remediation', 'ai-disruption-defense'],
    dataPoints: [
      {
        id: 'ai_model_accuracy_drift',
        name: 'Model Accuracy Drift',
        description: 'Degradation in AI model prediction accuracy relative to baseline performance',
        metricType: 'percentage',
        unit: '%',
        sources: ['ml-monitoring', 'model-registry', 'data-platform'],
        defaultThreshold: { operator: 'drop', value: 5, urgency: 'high' }
      },
      {
        id: 'ai_bias_detection',
        name: 'Bias Detection Alerts',
        description: 'Statistically significant bias detected in AI model outputs across protected groups',
        metricType: 'count',
        sources: ['fairness-monitoring', 'model-audit', 'responsible-ai-platform'],
        defaultThreshold: { operator: 'gte', value: 1, urgency: 'critical' }
      },
      {
        id: 'ai_hallucination_rate',
        name: 'LLM Hallucination Rate',
        description: 'Rate at which generative AI systems produce factually incorrect or fabricated outputs',
        metricType: 'percentage',
        unit: '%',
        sources: ['ai-monitoring', 'quality-assurance', 'human-review-pipeline'],
        defaultThreshold: { operator: 'gt', value: 3, urgency: 'high' }
      },
      {
        id: 'ai_regulatory_compliance',
        name: 'AI Regulatory Compliance Score',
        description: 'Compliance posture against EU AI Act, NIST AI RMF, and applicable AI regulations',
        metricType: 'score',
        sources: ['compliance-platform', 'legal-review', 'ai-audit'],
        defaultThreshold: { operator: 'lt', value: 80, urgency: 'high' }
      },
      {
        id: 'ai_data_privacy_exposure',
        name: 'AI Data Privacy Exposure',
        description: 'Risk that AI training or inference processes expose personally identifiable or regulated data',
        metricType: 'score',
        sources: ['dlp', 'data-governance-platform', 'privacy-management'],
        defaultThreshold: { operator: 'gt', value: 40, urgency: 'critical' }
      },
      {
        id: 'ai_adoption_velocity',
        name: 'Shadow AI Adoption Rate',
        description: 'Rate of unsanctioned AI tool adoption across the enterprise outside governance frameworks',
        metricType: 'trend',
        sources: ['network-monitoring', 'endpoint-security', 'saas-management'],
        defaultThreshold: { operator: 'spike', value: 20, urgency: 'high' }
      },
      {
        id: 'ai_model_availability',
        name: 'AI System Availability',
        description: 'Uptime and availability of production AI systems and APIs',
        metricType: 'percentage',
        unit: '%',
        sources: ['aws-cloudwatch', 'ml-ops-platform', 'api-monitoring'],
        defaultThreshold: { operator: 'lt', value: 99, urgency: 'critical' }
      },
      {
        id: 'ai_cost_overrun',
        name: 'AI Infrastructure Cost Variance',
        description: 'Deviation of AI compute and API costs from approved budget baselines',
        metricType: 'percentage',
        unit: '%',
        sources: ['cloud-cost-management', 'finops-platform', 'erp'],
        defaultThreshold: { operator: 'gt', value: 20, urgency: 'medium' }
      },
      {
        id: 'ai_third_party_risk',
        name: 'AI Vendor Risk Signals',
        description: 'Risk indicators from third-party AI providers including outages, policy changes, or security incidents',
        metricType: 'count',
        sources: ['vendor-monitoring', 'threat-intel', 'news-api'],
        defaultThreshold: { operator: 'gte', value: 1, urgency: 'high' }
      },
      {
        id: 'ai_decision_audit_gap',
        name: 'AI Decision Audit Coverage',
        description: 'Percentage of high-stakes AI decisions that lack full audit trail or explainability documentation',
        metricType: 'percentage',
        unit: '%',
        sources: ['model-registry', 'audit-logging', 'governance-platform'],
        defaultThreshold: { operator: 'gt', value: 10, urgency: 'high' }
      }
    ]
  },

  // ===== BRAND & REPUTATION (20) =====
  {
    id: 'brand_reputation',
    name: 'Brand & Reputation',
    shortName: 'Brand',
    description: 'Monitor brand equity, media sentiment, executive reputation, and emerging reputation risk events across all channels',
    icon: 'Star',
    color: '#F59E0B',
    phase: 'external',
    refreshInterval: 1800,
    recommendedPlaybooks: ['crisis-communication', 'brand-recovery', 'reputation-defense', 'executive-comms-sprint'],
    dataPoints: [
      {
        id: 'brand_sentiment_score',
        name: 'Overall Brand Sentiment Score',
        description: 'Aggregated sentiment across news, social media, forums, and review platforms',
        metricType: 'score',
        sources: ['brandwatch', 'sprinklr', 'meltwater', 'mention'],
        defaultThreshold: { operator: 'drop', value: 10, urgency: 'high' }
      },
      {
        id: 'brand_media_volume_spike',
        name: 'Negative Media Volume Spike',
        description: 'Sudden increase in negative news mentions or press coverage',
        metricType: 'count',
        sources: ['meltwater', 'cision', 'google-news-api'],
        defaultThreshold: { operator: 'spike', value: 50, urgency: 'critical' }
      },
      {
        id: 'brand_social_virality',
        name: 'Negative Viral Content Risk',
        description: 'Detection of brand-related content trending negatively on social platforms',
        metricType: 'score',
        sources: ['twitter-api', 'tiktok-monitoring', 'reddit-api', 'brandwatch'],
        defaultThreshold: { operator: 'gt', value: 70, urgency: 'critical' }
      },
      {
        id: 'brand_review_score_drop',
        name: 'Customer Review Score Drop',
        description: 'Decline in average ratings across G2, Glassdoor, Trustpilot, Google, or app stores',
        metricType: 'trend',
        sources: ['review-aggregator', 'g2', 'trustpilot', 'glassdoor'],
        defaultThreshold: { operator: 'drop', value: 0.5, urgency: 'high' }
      },
      {
        id: 'brand_executive_reputation',
        name: 'Executive Reputation Signals',
        description: 'Negative press, social criticism, or regulatory scrutiny directed at named executives',
        metricType: 'count',
        sources: ['news-monitoring', 'social-listening', 'regulatory-filings'],
        defaultThreshold: { operator: 'gte', value: 3, urgency: 'high' }
      },
      {
        id: 'brand_share_of_voice',
        name: 'Share of Voice vs Competitors',
        description: 'Proportion of total industry media mentions captured by this brand relative to competitors',
        metricType: 'percentage',
        unit: '%',
        sources: ['meltwater', 'cision', 'brandwatch'],
        defaultThreshold: { operator: 'drop', value: 5, urgency: 'medium' }
      },
      {
        id: 'brand_employee_sentiment',
        name: 'Employer Brand Sentiment',
        description: 'Employee perception of the company as an employer on public platforms',
        metricType: 'score',
        sources: ['glassdoor', 'indeed', 'linkedin', 'blind-app'],
        defaultThreshold: { operator: 'drop', value: 0.3, urgency: 'medium' }
      },
      {
        id: 'brand_crisis_indicators',
        name: 'Brand Crisis Early Warning',
        description: 'Composite signal aggregating multiple weak signals into an emerging crisis probability score',
        metricType: 'score',
        sources: ['brandwatch', 'meltwater', 'social-listening', 'news-api'],
        defaultThreshold: { operator: 'gte', value: 65, urgency: 'critical' }
      },
      {
        id: 'brand_nps_trend',
        name: 'Net Promoter Score Trend',
        description: 'Direction and velocity of NPS movement across customer segments',
        metricType: 'trend',
        sources: ['qualtrics', 'medallia', 'delighted', 'crm'],
        defaultThreshold: { operator: 'drop', value: 10, urgency: 'high' }
      },
      {
        id: 'brand_partnership_perception',
        name: 'Partner & Investor Perception',
        description: 'Sentiment signals from investor communities, analyst coverage, and strategic partners',
        metricType: 'score',
        sources: ['seeking-alpha', 'analyst-reports', 'investor-forums'],
        defaultThreshold: { operator: 'drop', value: 8, urgency: 'high' }
      },
      {
        id: 'brand_search_sentiment',
        name: 'Search Query Sentiment',
        description: 'Sentiment of top search queries and autocomplete patterns associated with the brand',
        metricType: 'trend',
        sources: ['google-search-console', 'semrush', 'ahrefs'],
        defaultThreshold: { operator: 'drop', value: 15, urgency: 'medium' }
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
  },
  {
    id: 'cyber_incident',
    name: 'Cyber Incident Alert',
    description: 'Alert when cyber threat indicators are detected',
    signalCategoryId: 'cyber',
    dataPointIds: ['cyber_threat_level', 'cyber_ransomware_activity', 'cyber_breach_indicators', 'cyber_dark_web_mentions'],
    logic: 'any',
    recommendedPlaybooks: ['cyber-incident-response', 'ransomware-playbook', 'data-breach-response']
  },
  {
    id: 'cyber_vulnerability',
    name: 'Critical Vulnerability Alert',
    description: 'Alert when critical unpatched vulnerabilities are detected',
    signalCategoryId: 'cyber',
    dataPointIds: ['cyber_vulnerability_critical', 'cyber_compliance_gap'],
    logic: 'any',
    recommendedPlaybooks: ['vulnerability-remediation', 'security-sprint']
  },
  {
    id: 'cyber_attack_imminent',
    name: 'Attack Imminent Warning',
    description: 'Alert when multiple threat indicators suggest active targeting',
    signalCategoryId: 'cyber',
    dataPointIds: ['cyber_threat_level', 'cyber_phishing_volume', 'cyber_anomaly_detection', 'cyber_ddos_risk'],
    logic: 'threshold',
    thresholdCount: 2,
    recommendedPlaybooks: ['cyber-incident-response', 'crisis-communication']
  }
];
