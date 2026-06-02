import type { QuantitativeSignal } from './types.js';

// ── Keyless Economic Indicator Monitor ──────────────────────────────────────
// Sources:
//   VIX             → Yahoo Finance  (^VIX, no key)
//   Yield Curve     → US Treasury CSV (no key)
//   Unemployment    → BLS Public API v1 (no key, 25 req/day)
//   Credit Spread   → Yahoo Finance HYG/LQD ETF yields (no key)
//   Fed Funds proxy → US Treasury 1-Month yield (no key)
// Replaces FRED API (requires registration) — same signals, no key needed.

const YF_BASE = 'https://query1.finance.yahoo.com/v8/finance/chart';
const YF_SUMMARY = 'https://query1.finance.yahoo.com/v10/finance/quoteSummary';
const TREASURY_CSV_BASE = 'https://home.treasury.gov/resource-center/data-chart-center/interest-rates/daily-treasury-rates.csv';

async function yahooClose(symbol: string): Promise<{ current: number; prev: number | null } | null> {
  try {
    const url = `${YF_BASE}/${encodeURIComponent(symbol)}?interval=1d&range=10d`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 ReadinessOS/1.0' },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const d = await res.json() as any;
    const closes: (number | null)[] = d?.chart?.result?.[0]?.indicators?.quote?.[0]?.close ?? [];
    const valid = closes.filter((v): v is number => v != null && !isNaN(v));
    if (valid.length === 0) return null;
    return { current: valid[valid.length - 1], prev: valid.length > 1 ? valid[valid.length - 2] : null };
  } catch { return null; }
}

async function yahooYield(symbol: string): Promise<number | null> {
  try {
    const url = `${YF_SUMMARY}/${encodeURIComponent(symbol)}?modules=summaryDetail`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 ReadinessOS/1.0' },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const d = await res.json() as any;
    const y = d?.quoteSummary?.result?.[0]?.summaryDetail?.yield?.raw;
    return typeof y === 'number' ? y * 100 : null;
  } catch { return null; }
}

async function fetchTreasuryYields(): Promise<{ twoYear: number; tenYear: number; oneMonth: number } | null> {
  try {
    const year = new Date().getFullYear();
    const url = `${TREASURY_CSV_BASE}/${year}/all?type=daily_treasury_yield_curve&field_tdr_date_value=${year}&page&_format=csv`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'ReadinessOS/1.0' },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) throw new Error(`Treasury CSV ${res.status}`);
    const text = await res.text();
    const lines = text.trim().split('\n').filter(l => l.trim());
    if (lines.length < 2) return null;
    const last = lines[lines.length - 1].split(',');
    const oneMonth = parseFloat(last[1]);
    const twoYear  = parseFloat(last[8]);
    const tenYear  = parseFloat(last[12]);
    if (isNaN(twoYear) || isNaN(tenYear)) return null;
    return { twoYear, tenYear, oneMonth: isNaN(oneMonth) ? 0 : oneMonth };
  } catch { return null; }
}

async function fetchUnemploymentRate(): Promise<number | null> {
  try {
    const res = await fetch('https://api.bls.gov/publicAPI/v1/timeseries/data/LNS14000000', {
      headers: { 'User-Agent': 'ReadinessOS/1.0', 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return null;
    const d = await res.json() as any;
    const dp = d?.Results?.series?.[0]?.data?.[0];
    if (!dp) return null;
    return parseFloat(dp.value);
  } catch { return null; }
}

export async function fetchFREDSignals(): Promise<QuantitativeSignal[]> {
  const signals: QuantitativeSignal[] = [];

  const [vixData, treasuryYields, unemployment, hygYield, lqdYield] = await Promise.allSettled([
    yahooClose('^VIX'),
    fetchTreasuryYields(),
    fetchUnemploymentRate(),
    yahooYield('HYG'),
    yahooYield('LQD'),
  ]);

  // ── 1. VIX — Market Volatility ──────────────────────────────────────────
  if (vixData.status === 'fulfilled' && vixData.value) {
    const { current: vix } = vixData.value;
    console.log(`[EconMonitor] VIX: ${vix.toFixed(1)}`);
    if (vix >= 25) {
      const action = vix >= 35;
      signals.push({
        signalType: 'economic',
        description: `Market volatility (VIX) reached ${vix.toFixed(1)}, ${action ? 'well above' : 'above'} the stress threshold of ${action ? 35 : 25}. Readings above 30 historically correlate with significant market dislocations requiring executive attention. Activist investor and M&A defense protocols should be reviewed.`,
        confidence: action ? 91 : 82,
        impact: action ? 'critical' : 'high',
        timeline: 'near-term',
        source: 'CBOE Volatility Index (VIX) — Yahoo Finance',
        sourceUrl: 'https://finance.yahoo.com/quote/%5EVIX',
        category: 'economic',
        jurisdiction: 'US',
        confidenceTier: 1,
        economicIndicatorType: 'market_volatility',
        indicatorDirection: 'rising',
        indicatorMagnitude: action ? 'significant' : 'moderate',
        centralBank: null,
        threatSeverity: null, exploitStatus: null, affectedVendor: null, cveId: null, affectedSector: null,
        tradeActionType: null, effectiveTimeline: null, tradePartner: null, affectedHsCodes: null,
        recallClass: null, affectedProductType: null, recallScope: null,
        enforcementActionType: null, regulatorAgency: null, penaltyAmountRange: null, namedSector: null,
        signalEventType: null,
        metricName: 'CBOE VIX Index',
        metricValue: vix,
        metricThreshold: 25,
        metricUnit: 'index points',
      });
    }
  }

  // ── 2. Yield Curve — 10Y-2Y Spread ──────────────────────────────────────
  if (treasuryYields.status === 'fulfilled' && treasuryYields.value) {
    const { twoYear, tenYear, oneMonth } = treasuryYields.value;
    const spread = tenYear - twoYear;
    console.log(`[EconMonitor] Yield curve: 10Y=${tenYear.toFixed(2)}% 2Y=${twoYear.toFixed(2)}% spread=${spread.toFixed(2)}%`);
    if (spread <= 0) {
      const action = spread <= -0.5;
      signals.push({
        signalType: 'economic',
        description: `Treasury yield curve is inverted at ${spread.toFixed(2)}% (10Y ${tenYear.toFixed(2)}% minus 2Y ${twoYear.toFixed(2)}%). An inverted yield curve has preceded every US recession in the last 50 years with a 6-18 month lead time. Executive teams should review recession scenario protocols and financial contingency plans.`,
        confidence: action ? 90 : 81,
        impact: action ? 'critical' : 'high',
        timeline: '6-18 months',
        source: 'US Treasury — Daily Yield Curve (10Y-2Y Spread)',
        sourceUrl: 'https://home.treasury.gov/resource-center/data-chart-center/interest-rates/',
        category: 'economic',
        jurisdiction: 'US',
        confidenceTier: 1,
        economicIndicatorType: 'yield_curve',
        indicatorDirection: 'falling',
        indicatorMagnitude: action ? 'significant' : 'moderate',
        centralBank: 'Federal Reserve',
        threatSeverity: null, exploitStatus: null, affectedVendor: null, cveId: null, affectedSector: null,
        tradeActionType: null, effectiveTimeline: null, tradePartner: null, affectedHsCodes: null,
        recallClass: null, affectedProductType: null, recallScope: null,
        enforcementActionType: null, regulatorAgency: null, penaltyAmountRange: null, namedSector: null,
        signalEventType: null,
        metricName: '10Y-2Y Treasury Yield Spread',
        metricValue: spread,
        metricThreshold: 0,
        metricUnit: 'percent',
      });
    }

    // Fed Funds proxy: 1-month T-bill rate
    console.log(`[EconMonitor] 1M T-bill (Fed Funds proxy): ${oneMonth.toFixed(2)}%`);
  }

  // ── 3. Unemployment Rate ─────────────────────────────────────────────────
  if (unemployment.status === 'fulfilled' && unemployment.value != null) {
    const rate = unemployment.value;
    console.log(`[EconMonitor] Unemployment: ${rate.toFixed(1)}%`);
    if (rate >= 5.5) {
      const action = rate >= 7.0;
      signals.push({
        signalType: 'economic',
        description: `Unemployment rate reached ${rate.toFixed(1)}%, ${action ? 'significantly above' : 'above'} the stress threshold. Elevated unemployment signals weakened consumer demand and workforce restructuring risk. Workforce transformation and operational continuity protocols apply.`,
        confidence: action ? 88 : 78,
        impact: action ? 'critical' : 'high',
        timeline: 'near-term',
        source: 'Bureau of Labor Statistics — US Unemployment Rate (LNS14000000)',
        sourceUrl: 'https://www.bls.gov/cps/cpsaat01.htm',
        category: 'economic',
        jurisdiction: 'US',
        confidenceTier: 1,
        economicIndicatorType: 'labor_market',
        indicatorDirection: 'rising',
        indicatorMagnitude: action ? 'significant' : 'moderate',
        centralBank: null,
        threatSeverity: null, exploitStatus: null, affectedVendor: null, cveId: null, affectedSector: null,
        tradeActionType: null, effectiveTimeline: null, tradePartner: null, affectedHsCodes: null,
        recallClass: null, affectedProductType: null, recallScope: null,
        enforcementActionType: null, regulatorAgency: null, penaltyAmountRange: null, namedSector: null,
        signalEventType: null,
        metricName: 'US Unemployment Rate',
        metricValue: rate,
        metricThreshold: 5.5,
        metricUnit: 'percent',
      });
    }
  }

  // ── 4. Credit Spread Proxy — HYG yield vs LQD yield ─────────────────────
  if (hygYield.status === 'fulfilled' && hygYield.value != null &&
      lqdYield.status === 'fulfilled' && lqdYield.value != null) {
    const hygY = hygYield.value;
    const lqdY = lqdYield.value;
    const spread = hygY - lqdY;
    console.log(`[EconMonitor] Credit spread proxy: HYG ${hygY.toFixed(2)}% - LQD ${lqdY.toFixed(2)}% = ${spread.toFixed(2)}%`);
    if (spread >= 3.5) {
      const action = spread >= 5.5;
      signals.push({
        signalType: 'economic',
        description: `High-yield credit spread reached ${spread.toFixed(2)}% (HYG yield ${hygY.toFixed(2)}% minus LQD investment-grade yield ${lqdY.toFixed(2)}%), indicating ${action ? 'severe' : 'elevated'} credit market stress. Elevated spreads signal increased corporate default risk and capital market disruption. Financial crisis response and investor communications protocols are relevant.`,
        confidence: action ? 85 : 76,
        impact: action ? 'critical' : 'high',
        timeline: 'near-term',
        source: 'High-Yield Credit Spread (HYG-LQD Yield Differential) — Yahoo Finance',
        sourceUrl: 'https://finance.yahoo.com/quote/HYG',
        category: 'economic',
        jurisdiction: 'US',
        confidenceTier: 1,
        economicIndicatorType: 'credit_stress',
        indicatorDirection: 'rising',
        indicatorMagnitude: action ? 'significant' : 'moderate',
        centralBank: null,
        threatSeverity: null, exploitStatus: null, affectedVendor: null, cveId: null, affectedSector: null,
        tradeActionType: null, effectiveTimeline: null, tradePartner: null, affectedHsCodes: null,
        recallClass: null, affectedProductType: null, recallScope: null,
        enforcementActionType: null, regulatorAgency: 'Federal Reserve', penaltyAmountRange: null, namedSector: null,
        signalEventType: null,
        metricName: 'HY Credit Spread (HYG-LQD)',
        metricValue: spread,
        metricThreshold: 3.5,
        metricUnit: 'percent',
      });
    }
  }

  if (signals.length > 0) {
    console.log(`[EconMonitor] ${signals.length} economic threshold breach(es) detected`);
  } else {
    console.log('[EconMonitor] All economic indicators within normal range');
  }

  return signals;
}
