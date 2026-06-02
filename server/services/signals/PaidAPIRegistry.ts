export interface PaidAPISource {
  key: string;
  name: string;
  vendor: string;
  vendorUrl: string;
  category: string;
  tier: 'premium' | 'enterprise' | 'enterprise_plus';
  apiKeyEnvVar: string;
  description: string;
  whatYouGet: string[];
  triggersEnabled: string[];
  estimatedMonthlyCost: string;
  activationInstructions: string;
  isConfigured: boolean;
}

const PAID_SOURCES: PaidAPISource[] = [
  {
    key: 'alpha_vantage',
    name: 'Alpha Vantage — Real-Time Market Data',
    vendor: 'Alpha Vantage',
    vendorUrl: 'https://www.alphavantage.co',
    category: 'financial',
    tier: 'premium',
    apiKeyEnvVar: 'ALPHA_VANTAGE_KEY',
    description: 'Real-time and historical stock prices, technical indicators, forex, and cryptocurrency data. Enables live monitoring of specific company equity movements as trigger signals.',
    whatYouGet: [
      'Real-time stock price alerts for monitored companies',
      'Volume spike detection (unusual trading activity before announcements)',
      'Sector ETF movement signals (tech selloff, healthcare rally)',
      'Options unusual activity as activist/M&A leading indicator',
      'Currency pair movements for geopolitical signals',
    ],
    triggersEnabled: [
      'Market Valuation Shift',
      'M&A Activity Detected',
      'Earnings Surprise',
      'Financial Distress Signal',
      'Competitive Market Entry',
    ],
    estimatedMonthlyCost: '$50–$500/month (Premium plan)',
    activationInstructions: 'Sign up at alphavantage.co, get API key, set ALPHA_VANTAGE_KEY environment secret.',
    isConfigured: !!(process.env.ALPHA_VANTAGE_KEY),
  },
  {
    key: 'newsapi',
    name: 'NewsAPI — Structured News Intelligence',
    vendor: 'NewsAPI.org',
    vendorUrl: 'https://newsapi.org',
    category: 'market',
    tier: 'premium',
    apiKeyEnvVar: 'NEWS_API_KEY',
    description: 'Aggregated news from 150,000+ sources worldwide with sentiment scoring, entity extraction, and category classification. Transforms news monitoring from keyword guessing to structured intelligence.',
    whatYouGet: [
      'Company-specific news monitoring (by ticker or name)',
      'Sentiment scoring on every article (-1 to +1)',
      'Entity extraction (names, organizations, locations)',
      'Topic classification with confidence scores',
      '30-day historical archive for trend detection',
    ],
    triggersEnabled: [
      'Reputational Crisis Signal',
      'Executive Leadership Event',
      'Competitive Market Entry',
      'M&A Activity Detected',
      'ESG / Climate Event',
    ],
    estimatedMonthlyCost: '$449/month (Business plan)',
    activationInstructions: 'Sign up at newsapi.org, subscribe to Business plan for production use, set NEWS_API_KEY environment secret.',
    isConfigured: !!(process.env.NEWS_API_KEY),
  },
  {
    key: 'recorded_future',
    name: 'Recorded Future — Threat Intelligence',
    vendor: 'Recorded Future',
    vendorUrl: 'https://www.recordedfuture.com',
    category: 'cybersecurity',
    tier: 'enterprise',
    apiKeyEnvVar: 'RECORDED_FUTURE_KEY',
    description: 'The gold standard for enterprise threat intelligence. Monitors dark web, criminal forums, paste sites, and technical indicators for threats targeting your organization and sector before they become public.',
    whatYouGet: [
      'Dark web monitoring for your company name, domains, and executive names',
      'Vulnerability intelligence with exploitation prediction scores',
      'Ransomware group activity monitoring',
      'Industry-specific threat actor tracking',
      'Breach credential monitoring for your domain',
      'Real-time alerts 24-72 hours before public disclosure',
    ],
    triggersEnabled: [
      'Cybersecurity Breach Signal',
      'Reputational Crisis Signal',
      'Regulatory Enforcement Action',
    ],
    estimatedMonthlyCost: '$20,000–$100,000/year (enterprise contract)',
    activationInstructions: 'Contact Recorded Future sales at recordedfuture.com/contact. Enterprise contract required. Set RECORDED_FUTURE_KEY.',
    isConfigured: !!(process.env.RECORDED_FUTURE_KEY),
  },
  {
    key: 'dun_bradstreet',
    name: 'Dun & Bradstreet — Supplier & Counterparty Risk',
    vendor: 'Dun & Bradstreet',
    vendorUrl: 'https://www.dnb.com',
    category: 'supply_chain',
    tier: 'enterprise',
    apiKeyEnvVar: 'DNB_API_KEY',
    description: 'Continuous monitoring of supplier financial health, payment behavior, legal events, and operational risk. Enables early warning on supplier distress before force majeure or bankruptcy announcement.',
    whatYouGet: [
      'Real-time supplier financial health scores (Paydex, Failure Score)',
      'Legal filing alerts (liens, judgments, bankruptcies)',
      'Management change notifications at key suppliers',
      'Operational disruption signals (facility closures, strikes)',
      'Tier 2/3 supplier visibility for supply chain mapping',
    ],
    triggersEnabled: [
      'Supply Chain Disruption',
      'Financial Distress Signal',
      'Operational Crisis',
    ],
    estimatedMonthlyCost: '$2,000–$20,000/month (API access)',
    activationInstructions: 'Contact D&B at dnb.com/en-us/solutions/risk.html. API access requires enterprise agreement. Set DNB_API_KEY.',
    isConfigured: !!(process.env.DNB_API_KEY),
  },
  {
    key: 'lexisnexis',
    name: 'LexisNexis — Legal & Regulatory Intelligence',
    vendor: 'LexisNexis',
    vendorUrl: 'https://www.lexisnexis.com',
    category: 'regulatory',
    tier: 'enterprise',
    apiKeyEnvVar: 'LEXISNEXIS_KEY',
    description: 'Real-time monitoring of court filings, regulatory dockets, enforcement actions, and legal news. Enables detection of litigation and regulatory signals 5-30 days before mainstream news coverage.',
    whatYouGet: [
      'Real-time court filing alerts (federal, state, and international)',
      'Regulatory docket monitoring (SEC, FTC, DOJ, EPA enforcement)',
      'Class action litigation early warning',
      'Executive legal risk monitoring',
      'Patent filings and IP dispute tracking',
    ],
    triggersEnabled: [
      'Regulatory Enforcement Action',
      'Legislation Change',
      '8-K Material Event Filing',
      'Reputational Crisis Signal',
    ],
    estimatedMonthlyCost: '$5,000–$30,000/month',
    activationInstructions: 'Contact LexisNexis at lexisnexis.com/en-us/products/api.page. Enterprise API agreement required. Set LEXISNEXIS_KEY.',
    isConfigured: !!(process.env.LEXISNEXIS_KEY),
  },
  {
    key: 'bloomberg_enterprise',
    name: 'Bloomberg Enterprise Data — Terminal-Grade Intelligence',
    vendor: 'Bloomberg LP',
    vendorUrl: 'https://www.bloomberg.com/professional/product/enterprise-data/',
    category: 'financial',
    tier: 'enterprise_plus',
    apiKeyEnvVar: 'BLOOMBERG_API_KEY',
    description: 'The same data powering Bloomberg Terminal — real-time market data, company fundamentals, earnings intelligence, and M&A deal flow. The authoritative source for financial trigger signals at institutional quality.',
    whatYouGet: [
      'Real-time equity, fixed income, and derivatives data',
      'M&A deal flow and rumor intelligence',
      'Earnings surprise detection before market open',
      'Credit event monitoring (CDS spreads, rating changes)',
      'Executive departure and board change alerts',
      'Institutional ownership changes in real-time',
    ],
    triggersEnabled: [
      'Market Valuation Shift',
      'M&A Activity Detected',
      'Financial Distress Signal',
      'Earnings Surprise',
      'Executive Leadership Event',
    ],
    estimatedMonthlyCost: '$24,000–$120,000/year (enterprise contract)',
    activationInstructions: 'Contact Bloomberg at bloomberg.com/professional. Enterprise Data License required. Set BLOOMBERG_API_KEY.',
    isConfigured: !!(process.env.BLOOMBERG_API_KEY),
  },
  {
    key: 'refinitiv',
    name: 'Refinitiv (LSEG) — Market & ESG Intelligence',
    vendor: 'LSEG (Refinitiv)',
    vendorUrl: 'https://www.lseg.com/en/data-analytics',
    category: 'market',
    tier: 'enterprise_plus',
    apiKeyEnvVar: 'REFINITIV_KEY',
    description: 'Former Thomson Reuters financial data platform — comprehensive market data, ESG scores, M&A intelligence, and regulatory filing data. Particularly strong for ESG signal monitoring and international markets.',
    whatYouGet: [
      'ESG controversy scores and rating changes (Sustainalytics, MSCI)',
      'Global M&A deal intelligence',
      'Real-time regulatory filing parsing',
      'International market and currency signals',
      'Supply chain exposure mapping by sector',
    ],
    triggersEnabled: [
      'ESG / Climate Event',
      'M&A Activity Detected',
      'Geopolitical Risk Signal',
      'Market Valuation Shift',
    ],
    estimatedMonthlyCost: '$20,000–$100,000/year',
    activationInstructions: 'Contact LSEG at lseg.com/en/data-analytics. Enterprise license required. Set REFINITIV_KEY.',
    isConfigured: !!(process.env.REFINITIV_KEY),
  },
  {
    key: 'social_listening',
    name: 'Brandwatch / Sprinklr — Social Listening',
    vendor: 'Brandwatch or Sprinklr',
    vendorUrl: 'https://www.brandwatch.com',
    category: 'brand',
    tier: 'premium',
    apiKeyEnvVar: 'BRANDWATCH_KEY',
    description: 'Real-time social media monitoring at scale — Twitter/X, LinkedIn, Reddit, Glassdoor, news comments, and review platforms. Volume spikes and sentiment drops are often the first signal of a reputational crisis — hours before media pickup.',
    whatYouGet: [
      'Brand mention volume alerts (spike detection)',
      'Sentiment trend monitoring (week-over-week)',
      'Viral content early warning (velocity scoring)',
      'Executive name monitoring',
      'Competitor crisis monitoring (their crisis = your opportunity)',
      'Glassdoor/employee sentiment as workforce risk signal',
    ],
    triggersEnabled: [
      'Reputational Crisis Signal',
      'Executive Leadership Event',
      'ESG / Climate Event',
      'Competitive Market Entry',
    ],
    estimatedMonthlyCost: '$1,000–$5,000/month',
    activationInstructions: 'Contact Brandwatch at brandwatch.com or Sprinklr at sprinklr.com. API access included in enterprise plans. Set BRANDWATCH_KEY.',
    isConfigured: !!(process.env.BRANDWATCH_KEY),
  },
];

export function getPaidAPISources(): PaidAPISource[] {
  return PAID_SOURCES;
}

export function getActivePaidAPISources(): PaidAPISource[] {
  return PAID_SOURCES.filter(s => s.isConfigured);
}

export function getPaidAPISourceByKey(key: string): PaidAPISource | undefined {
  return PAID_SOURCES.find(s => s.key === key);
}

export function getPaidAPIStatus(): {
  total: number;
  configured: number;
  available: number;
  byTier: Record<string, number>;
} {
  const configured = PAID_SOURCES.filter(s => s.isConfigured).length;
  return {
    total: PAID_SOURCES.length,
    configured,
    available: PAID_SOURCES.length - configured,
    byTier: {
      premium: PAID_SOURCES.filter(s => s.tier === 'premium').length,
      enterprise: PAID_SOURCES.filter(s => s.tier === 'enterprise').length,
      enterprise_plus: PAID_SOURCES.filter(s => s.tier === 'enterprise_plus').length,
    },
  };
}
