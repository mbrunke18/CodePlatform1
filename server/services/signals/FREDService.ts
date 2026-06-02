import type { QuantitativeSignal } from './types.js';

const BASE_URL = 'https://api.stlouisfed.org/fred/series/observations';

interface FREDSeries {
  id: string;
  name: string;
  description: string;
  unit: string;
  watchThreshold: number;
  actionThreshold: number;
  direction: 'above' | 'below' | 'change';
  domain: string;
  indicatorType: string;
  triggerDescription: (value: number, prev: number | null) => string;
}

const SERIES: FREDSeries[] = [
  {
    id: 'VIXCLS',
    name: 'CBOE Volatility Index (VIX)',
    description: 'Market volatility index — measures investor fear and uncertainty',
    unit: 'index points',
    watchThreshold: 25,
    actionThreshold: 35,
    direction: 'above',
    domain: 'Financial',
    indicatorType: 'market_volatility',
    triggerDescription: (v, _p) =>
      `Market volatility (VIX) reached ${v.toFixed(1)}, ${v >= 35 ? 'well above' : 'above'} the stress threshold of ${v >= 35 ? 35 : 25}. Readings above 30 historically correlate with significant market dislocations requiring executive attention. Activist investor and M&A defense protocols should be reviewed.`,
  },
  {
    id: 'BAMLH0A0HYM2',
    name: 'US High Yield Credit Spread (OAS)',
    description: 'Credit risk premium on high-yield bonds — a direct measure of financial distress risk',
    unit: 'percent',
    watchThreshold: 5.0,
    actionThreshold: 8.0,
    direction: 'above',
    domain: 'Financial',
    indicatorType: 'credit_stress',
    triggerDescription: (v, _p) =>
      `US High Yield credit spread reached ${v.toFixed(2)}%, indicating ${v >= 8 ? 'severe' : 'elevated'} financial market stress. Spreads above 5% signal increased corporate default risk and capital market disruption. Financial crisis response and investor communications protocols are relevant.`,
  },
  {
    id: 'T10Y2Y',
    name: '10Y-2Y Treasury Yield Spread',
    description: 'Yield curve spread — negative reading (inversion) is a leading recession indicator',
    unit: 'percent',
    watchThreshold: 0,
    actionThreshold: -0.5,
    direction: 'below',
    domain: 'Financial',
    indicatorType: 'yield_curve',
    triggerDescription: (v, _p) =>
      `Treasury yield curve is ${v < 0 ? 'inverted' : 'flattening'} at ${v.toFixed(2)}%. An inverted yield curve (10Y below 2Y) has preceded every US recession in the last 50 years with a 6-18 month lead time. Executive teams should review recession scenario protocols and financial contingency plans.`,
  },
  {
    id: 'UNRATE',
    name: 'US Unemployment Rate',
    description: 'Civilian unemployment rate — rising rate signals labor market deterioration',
    unit: 'percent',
    watchThreshold: 5.5,
    actionThreshold: 7.0,
    direction: 'above',
    domain: 'Supply Chain & Operations',
    indicatorType: 'labor_market',
    triggerDescription: (v, _p) =>
      `Unemployment rate reached ${v.toFixed(1)}%, ${v >= 7 ? 'significantly above' : 'above'} the stress threshold. Elevated unemployment signals weakened consumer demand and workforce restructuring risk. Workforce transformation and operational continuity protocols apply.`,
  },
  {
    id: 'FEDFUNDS',
    name: 'Federal Funds Rate',
    description: 'Federal Reserve benchmark interest rate — rapid changes signal monetary policy shock',
    unit: 'percent',
    watchThreshold: 0.5,
    actionThreshold: 1.0,
    direction: 'change',
    domain: 'Financial',
    indicatorType: 'interest_rate',
    triggerDescription: (v, prev) =>
      `Federal funds rate is ${v.toFixed(2)}%${prev !== null ? `, changed from ${prev.toFixed(2)}% (${(v - prev) >= 0 ? '+' : ''}${(v - prev).toFixed(2)}%)` : ''}. Rapid rate changes affect debt service costs, capital access, and acquisition financing. Financial modeling and investor communications protocols should be reviewed.`,
  },
];

async function fetchSeries(seriesId: string, apiKey: string): Promise<{ value: number; date: string; prevValue: number | null } | null> {
  try {
    const url = `${BASE_URL}?series_id=${seriesId}&api_key=${apiKey}&file_type=json&limit=5&sort_order=desc`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;
    const data = await res.json() as { observations: { date: string; value: string }[] };
    const obs = (data.observations || []).filter(o => o.value !== '.' && o.value !== 'NA');
    if (obs.length === 0) return null;
    const value = parseFloat(obs[0].value);
    const prevValue = obs.length > 1 ? parseFloat(obs[1].value) : null;
    if (isNaN(value)) return null;
    return { value, date: obs[0].date, prevValue };
  } catch {
    return null;
  }
}

export async function fetchFREDSignals(): Promise<QuantitativeSignal[]> {
  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) {
    console.log('[FRED] FRED_API_KEY not configured — economic indicator monitoring inactive. Free key at https://fred.stlouisfed.org/docs/api/api_key.html');
    return [];
  }

  const signals: QuantitativeSignal[] = [];

  const results = await Promise.allSettled(
    SERIES.map(async (series) => {
      const obs = await fetchSeries(series.id, apiKey);
      if (!obs) return null;

      const { value, prevValue } = obs;
      let shouldFire = false;
      let impact: 'critical' | 'high' | 'medium' | 'low' = 'medium';
      let confidence = 78;

      if (series.direction === 'above') {
        if (value >= series.actionThreshold) { shouldFire = true; impact = 'critical'; confidence = 91; }
        else if (value >= series.watchThreshold) { shouldFire = true; impact = 'high'; confidence = 82; }
      } else if (series.direction === 'below') {
        if (value <= series.actionThreshold) { shouldFire = true; impact = 'critical'; confidence = 90; }
        else if (value <= series.watchThreshold) { shouldFire = true; impact = 'high'; confidence = 81; }
      } else if (series.direction === 'change' && prevValue !== null) {
        const change = Math.abs(value - prevValue);
        if (change >= series.actionThreshold) { shouldFire = true; impact = 'high'; confidence = 85; }
        else if (change >= series.watchThreshold) { shouldFire = true; impact = 'medium'; confidence = 76; }
      }

      if (!shouldFire) return null;

      return {
        signalType: 'economic',
        description: series.triggerDescription(value, prevValue),
        confidence,
        impact,
        timeline: 'near-term',
        source: `FRED — ${series.name}`,
        sourceUrl: `https://fred.stlouisfed.org/series/${series.id}`,
        category: 'economic',
        jurisdiction: 'US',
        confidenceTier: 1,
        economicIndicatorType: series.indicatorType,
        indicatorDirection: series.direction === 'above' ? 'rising' : series.direction === 'below' ? 'falling' : 'change',
        indicatorMagnitude: impact === 'critical' ? 'significant' : 'moderate',
        centralBank: series.id === 'FEDFUNDS' ? 'Federal Reserve' : null,
        threatSeverity: null,
        exploitStatus: null,
        affectedVendor: null,
        cveId: null,
        affectedSector: null,
        tradeActionType: null,
        effectiveTimeline: null,
        tradePartner: null,
        affectedHsCodes: null,
        recallClass: null,
        affectedProductType: null,
        recallScope: null,
        enforcementActionType: null,
        regulatorAgency: series.id === 'FEDFUNDS' ? 'Federal Reserve' : null,
        penaltyAmountRange: null,
        namedSector: null,
        signalEventType: null,
        metricName: series.name,
        metricValue: value,
        metricThreshold: series.watchThreshold,
        metricUnit: series.unit,
      } satisfies QuantitativeSignal;
    })
  );

  for (const r of results) {
    if (r.status === 'fulfilled' && r.value) signals.push(r.value);
  }

  if (signals.length > 0) {
    console.log(`[FRED] ${signals.length} economic threshold breach(es) detected`);
  }

  return signals;
}
