export interface QuantitativeSignal {
  signalType: string;
  description: string;
  confidence: number;
  impact: 'critical' | 'high' | 'medium' | 'low';
  timeline: string;
  source: string;
  sourceUrl: string;
  category: string;
  jurisdiction: string;
  confidenceTier: number;
  // Cyber
  threatSeverity: string | null;
  exploitStatus: string | null;
  affectedVendor: string | null;
  cveId: string | null;
  affectedSector: string | null;
  // Economic
  economicIndicatorType: string | null;
  indicatorDirection: string | null;
  indicatorMagnitude: string | null;
  centralBank: string | null;
  // Trade/Geo
  tradeActionType: string | null;
  effectiveTimeline: string | null;
  tradePartner: string | null;
  affectedHsCodes: string | null;
  // Recall/Health
  recallClass: string | null;
  affectedProductType: string | null;
  recallScope: string | null;
  // Regulatory
  enforcementActionType: string | null;
  regulatorAgency: string | null;
  penaltyAmountRange: string | null;
  namedSector: string | null;
  // Market
  signalEventType: string | null;
  // Quantitative measurement metadata — what actual number triggered this
  metricName?: string;
  metricValue?: number;
  metricThreshold?: number;
  metricUnit?: string;
}

export interface SignalSourceHealth {
  sourceKey: string;
  sourceName: string;
  sourceType: 'free' | 'free_key_required' | 'paid_available' | 'paid_active' | 'internal';
  category: string;
  tier: number;
  status: 'active' | 'degraded' | 'down' | 'not_configured' | 'paid_available';
  lastFetchAt: Date | null;
  lastSuccessAt: Date | null;
  recordsLastFetch: number;
  triggersEnabled: string[];
  requiresApiKey: boolean;
  apiKeyEnvVar: string | null;
  description: string;
  upgradeNote: string | null;
}
