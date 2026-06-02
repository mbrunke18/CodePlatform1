import type { SignalSourceHealth } from './signals/types.js';

interface SourceRecord extends SignalSourceHealth {
  fetchCount: number;
  errorCount: number;
}

class SignalSourceRegistryClass {
  private sources = new Map<string, SourceRecord>();

  register(source: Omit<SignalSourceHealth, 'lastFetchAt' | 'lastSuccessAt' | 'recordsLastFetch'>): void {
    if (!this.sources.has(source.sourceKey)) {
      this.sources.set(source.sourceKey, {
        ...source,
        lastFetchAt: null,
        lastSuccessAt: null,
        recordsLastFetch: 0,
        fetchCount: 0,
        errorCount: 0,
      });
    }
  }

  recordFetch(sourceKey: string, recordCount: number, success: boolean): void {
    const s = this.sources.get(sourceKey);
    if (!s) return;
    s.lastFetchAt = new Date();
    s.fetchCount++;
    s.recordsLastFetch = recordCount;
    if (success) {
      s.lastSuccessAt = new Date();
      s.errorCount = 0;
      s.status = recordCount > 0 ? 'active' : 'active';
    } else {
      s.errorCount++;
      s.status = s.errorCount >= 3 ? 'down' : 'degraded';
    }
  }

  getAll(): SignalSourceHealth[] {
    return Array.from(this.sources.values()).map(({ fetchCount, errorCount, ...rest }) => rest);
  }

  getSummary(): {
    totalSources: number;
    activeSources: number;
    degradedSources: number;
    downSources: number;
    notConfiguredSources: number;
    paidAvailableSources: number;
    tier1Sources: number;
    lastScanAt: Date | null;
  } {
    const all = Array.from(this.sources.values());
    const fetchTimes = all.map(s => s.lastFetchAt).filter(Boolean) as Date[];
    return {
      totalSources: all.length,
      activeSources: all.filter(s => s.status === 'active').length,
      degradedSources: all.filter(s => s.status === 'degraded').length,
      downSources: all.filter(s => s.status === 'down').length,
      notConfiguredSources: all.filter(s => s.status === 'not_configured').length,
      paidAvailableSources: all.filter(s => s.status === 'paid_available').length,
      tier1Sources: all.filter(s => s.tier === 1).length,
      lastScanAt: fetchTimes.length > 0 ? new Date(Math.max(...fetchTimes.map(d => d.getTime()))) : null,
    };
  }
}

export const signalSourceRegistry = new SignalSourceRegistryClass();

// ── Register all known sources at module load ──────────────────────────────────
signalSourceRegistry.register({
  sourceKey: 'cisa_kev',
  sourceName: 'CISA Known Exploited Vulnerabilities',
  sourceType: 'free',
  category: 'cybersecurity',
  tier: 1,
  status: 'active',
  triggersEnabled: ['Cybersecurity Breach Signal'],
  requiresApiKey: false,
  apiKeyEnvVar: null,
  description: 'CISA catalog of actively exploited vulnerabilities — updated daily, authoritative source for cyber threat intelligence.',
  upgradeNote: null,
});

signalSourceRegistry.register({
  sourceKey: 'fred_economic',
  sourceName: 'FRED — Federal Reserve Economic Data',
  sourceType: 'free_key_required',
  category: 'economic',
  tier: 1,
  status: process.env.FRED_API_KEY ? 'active' : 'not_configured',
  triggersEnabled: ['Financial Distress Signal', 'Market Valuation Shift', 'Earnings Surprise', 'Supply Chain Disruption'],
  requiresApiKey: true,
  apiKeyEnvVar: 'FRED_API_KEY',
  description: 'Federal Reserve Bank of St. Louis — 800,000+ economic time series including VIX, credit spreads, yield curve, unemployment. Free API key at fred.stlouisfed.org.',
  upgradeNote: 'Free API key required. Register at fred.stlouisfed.org/docs/api/api_key.html and add FRED_API_KEY secret.',
});

signalSourceRegistry.register({
  sourceKey: 'openfda_recalls',
  sourceName: 'OpenFDA — Recall & Enforcement Database',
  sourceType: 'free',
  category: 'regulatory',
  tier: 1,
  status: 'active',
  triggersEnabled: ['Operational Crisis', 'Supply Chain Disruption', 'Regulatory Enforcement Action'],
  requiresApiKey: false,
  apiKeyEnvVar: null,
  description: 'FDA structured enforcement and recall database — real Class I/II/III recall data with scope, quantity, and distribution pattern.',
  upgradeNote: null,
});

signalSourceRegistry.register({
  sourceKey: 'sec_edgar_structured',
  sourceName: 'SEC EDGAR — Structured Filing Intelligence',
  sourceType: 'free',
  category: 'regulatory',
  tier: 1,
  status: 'active',
  triggersEnabled: ['M&A Activity Detected', 'Activist Investor (13D)', '8-K Material Event Filing', 'Market Valuation Shift'],
  requiresApiKey: false,
  apiKeyEnvVar: null,
  description: 'SEC EDGAR full-text search and filing API — 13D activist disclosures, 8-K material events, 13G position changes. Actual structured filing data, not RSS headlines.',
  upgradeNote: null,
});

signalSourceRegistry.register({
  sourceKey: 'internal_readiness',
  sourceName: 'Internal Readiness Audit',
  sourceType: 'internal',
  category: 'internal',
  tier: 1,
  status: 'active',
  triggersEnabled: ['Protocol Staleness', 'Stakeholder Roster Gap', 'Activation Velocity Gap'],
  requiresApiKey: false,
  apiKeyEnvVar: null,
  description: 'Continuous internal audit of protocol freshness, stakeholder completeness, and activation velocity. Fires when readiness decays below operational threshold.',
  upgradeNote: null,
});

signalSourceRegistry.register({
  sourceKey: 'regulatory_calendar',
  sourceName: 'Regulatory & Market Calendar',
  sourceType: 'internal',
  category: 'regulatory',
  tier: 1,
  status: 'active',
  triggersEnabled: ['Financial Distress Signal', 'Regulatory Enforcement Action', 'Legislation Change', 'Market Valuation Shift'],
  requiresApiKey: false,
  apiKeyEnvVar: null,
  description: 'Known FOMC dates, earnings seasons, proxy deadlines, and regulatory filing windows. Fires warning and action alerts as events approach.',
  upgradeNote: null,
});

// RSS feeds (36 total)
signalSourceRegistry.register({
  sourceKey: 'rss_feeds',
  sourceName: 'Live RSS Intelligence Network (36 feeds)',
  sourceType: 'free',
  category: 'market',
  tier: 3,
  status: 'active',
  triggersEnabled: ['All 16 trigger patterns — keyword-based'],
  requiresApiKey: false,
  apiKeyEnvVar: null,
  description: 'Network of 36 public RSS feeds across market news, regulatory agencies, cybersecurity, labor, geopolitical, and health sources. Covers NY Times, CNBC, SEC EDGAR, CISA, DOJ, FDA, Federal Reserve, and more.',
  upgradeNote: null,
});

// Premium stubs
const premiumStubs = [
  { key: 'alpha_vantage', name: 'Alpha Vantage — Real-Time Market Data', env: 'ALPHA_VANTAGE_KEY', cat: 'financial', triggers: ['Market Valuation Shift', 'M&A Activity Detected', 'Earnings Surprise'], desc: 'Real-time stock prices, volume anomalies, sector ETF movements. Enables equity-price-based trigger signals.' },
  { key: 'newsapi', name: 'NewsAPI — Structured News Intelligence', env: 'NEWS_API_KEY', cat: 'market', triggers: ['Reputational Crisis Signal', 'Executive Leadership Event', 'Competitive Market Entry'], desc: '150,000+ sources with sentiment scoring and entity extraction. Transforms news monitoring from keyword matching to structured intelligence.' },
  { key: 'recorded_future', name: 'Recorded Future — Threat Intelligence', env: 'RECORDED_FUTURE_KEY', cat: 'cybersecurity', triggers: ['Cybersecurity Breach Signal'], desc: 'Dark web monitoring, vulnerability exploitation prediction, ransomware group tracking. 24-72 hour advance warning on cyber threats.' },
  { key: 'dun_bradstreet', name: 'Dun & Bradstreet — Supplier Risk', env: 'DNB_API_KEY', cat: 'supply_chain', triggers: ['Supply Chain Disruption', 'Financial Distress Signal'], desc: 'Supplier financial health scores, payment behavior, legal events. Early warning on supplier distress before force majeure.' },
  { key: 'lexisnexis', name: 'LexisNexis — Legal & Regulatory Intelligence', env: 'LEXISNEXIS_KEY', cat: 'regulatory', triggers: ['Regulatory Enforcement Action', 'Reputational Crisis Signal'], desc: 'Court filings, regulatory dockets, class action early warning. Detects legal signals 5-30 days before mainstream coverage.' },
  { key: 'bloomberg_enterprise', name: 'Bloomberg Enterprise Data', env: 'BLOOMBERG_API_KEY', cat: 'financial', triggers: ['Market Valuation Shift', 'M&A Activity Detected', 'Financial Distress Signal'], desc: 'Terminal-grade market data, M&A deal flow, credit events. Institutional-quality financial trigger intelligence.' },
  { key: 'social_listening', name: 'Brandwatch — Social Listening', env: 'BRANDWATCH_KEY', cat: 'brand', triggers: ['Reputational Crisis Signal', 'Executive Leadership Event'], desc: 'Real-time brand mention monitoring, sentiment trending, viral velocity scoring across 100M+ social sources.' },
];

for (const stub of premiumStubs) {
  signalSourceRegistry.register({
    sourceKey: stub.key,
    sourceName: stub.name,
    sourceType: process.env[stub.env] ? 'paid_active' : 'paid_available',
    category: stub.cat,
    tier: 2,
    status: process.env[stub.env] ? 'active' : 'paid_available',
    triggersEnabled: stub.triggers,
    requiresApiKey: true,
    apiKeyEnvVar: stub.env,
    description: stub.desc,
    upgradeNote: `Set ${stub.env} environment secret to activate this data source.`,
  });
}
