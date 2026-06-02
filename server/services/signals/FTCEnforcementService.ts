import type { QuantitativeSignal } from './types.js';

const FTC_PRESS_RSS = 'https://www.ftc.gov/news-events/news.rss';
const FTC_ENFORCEMENT_RSS = 'https://www.ftc.gov/news-events/news/press-releases.rss';
const LOOKBACK_DAYS = 30;

const HIGH_IMPACT_CATEGORIES = [
  'antitrust', 'merger', 'acquisition', 'privacy', 'data security', 'AI',
  'artificial intelligence', 'dark pattern', 'deceptive', 'unfair', 'monopoly',
  'consent decree', 'civil investigative demand', 'technology', 'social media',
  'health', 'financial', 'pharmaceutical',
];

function parseRSSDate(d: string): Date {
  try { return new Date(d); } catch { return new Date(0); }
}

interface FTCPressItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  category?: string;
}

function parseFTCRSS(xml: string): FTCPressItem[] {
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
  return items.map(item => ({
    title: (item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || item.match(/<title>(.*?)<\/title>/))?.[1]?.trim() || '',
    description: (item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) || item.match(/<description>(.*?)<\/description>/))?.[1]?.trim() || '',
    link: (item.match(/<link>(.*?)<\/link>/) || [])[1]?.trim() || '',
    pubDate: (item.match(/<pubDate>(.*?)<\/pubDate>/) || [])[1]?.trim() || '',
    category: (item.match(/<category><!\[CDATA\[(.*?)\]\]><\/category>/) || item.match(/<category>(.*?)<\/category>/))?.[1]?.trim(),
  }));
}

function scoreEnforcement(item: FTCPressItem): number {
  const text = (item.title + ' ' + item.description).toLowerCase();
  let score = 62;
  const matchCount = HIGH_IMPACT_CATEGORIES.filter(k => text.includes(k)).length;
  score += matchCount * 7;
  if (text.includes('complaint') || text.includes('charges')) score += 12;
  if (text.includes('penalty') || text.includes('fine') || text.includes('million')) score += 10;
  if (text.includes('consent') || text.includes('order') || text.includes('settlement')) score += 8;
  if (text.includes('merger') || text.includes('acquisition') || text.includes('antitrust')) score += 10;
  return Math.min(score, 92);
}

export async function fetchFTCEnforcementSignals(): Promise<QuantitativeSignal[]> {
  const signals: QuantitativeSignal[] = [];
  const cutoff = new Date(Date.now() - LOOKBACK_DAYS * 86400000);

  try {
    const feedUrl = FTC_PRESS_RSS;
    const res = await fetch(feedUrl, {
      headers: { 'User-Agent': 'ReadinessOS/1.0 signal-intelligence (enforcement-monitoring)', Accept: 'application/rss+xml,application/xml,text/xml,*/*' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      const res2 = await fetch(FTC_ENFORCEMENT_RSS, {
        headers: { 'User-Agent': 'ReadinessOS/1.0 signal-intelligence', Accept: '*/*' },
        signal: AbortSignal.timeout(12000),
      });
      if (!res2.ok) throw new Error(`FTC RSS ${res2.status}`);
      const xml2 = await res2.text();
      const items2 = parseFTCRSS(xml2);
      const recent2 = items2.filter(i => parseRSSDate(i.pubDate) >= cutoff);
      let added2 = 0;
      for (const item of recent2) {
        const score = scoreEnforcement(item);
        if (score < 72) continue;
        const text = (item.title + ' ' + item.description).toLowerCase();
        let actionType = 'enforcement_notice';
        if (text.includes('merger') || text.includes('acquisition')) actionType = 'merger_challenge';
        if (text.includes('complaint')) actionType = 'enforcement_complaint';
        if (text.includes('consent') || text.includes('settlement')) actionType = 'consent_order';
        signals.push({
          signalType: 'regulatory', description: `FTC Enforcement Action: ${item.title}. ${item.description.substring(0, 450)}`,
          confidence: Math.min(score, 91), impact: score >= 84 ? 'high' : 'medium', timeline: '30-90 days',
          source: 'FTC — Federal Trade Commission', sourceUrl: item.link || 'https://www.ftc.gov/news-events/news/press-releases',
          category: 'regulatory', jurisdiction: 'US', confidenceTier: 1,
          enforcementActionType: actionType, regulatorAgency: 'Federal Trade Commission',
          penaltyAmountRange: text.includes('billion') ? '$100M–$1B+' : text.includes('million') ? '$1M–$100M' : 'TBD',
          namedSector: null, threatSeverity: null, exploitStatus: null, affectedVendor: null, cveId: null, affectedSector: null,
          economicIndicatorType: null, indicatorDirection: null, indicatorMagnitude: null, centralBank: null,
          tradeActionType: null, effectiveTimeline: null, tradePartner: null, affectedHsCodes: null,
          recallClass: null, affectedProductType: null, recallScope: null,
          signalEventType: 'enforcement_action',
          metricName: 'Enforcement Relevance Score', metricValue: score, metricThreshold: 72, metricUnit: '/100',
        });
        added2++;
      }
      console.log(`[FTC] ${added2} significant enforcement action(s) via fallback feed`);
      return signals;
    }

    const xml = await res.text();
    const items = parseFTCRSS(xml);
    const recent = items.filter(i => parseRSSDate(i.pubDate) >= cutoff);

    let added = 0;
    for (const item of recent) {
      const score = scoreEnforcement(item);
      if (score < 72) continue;

      const isHighValue = score >= 84;
      const text = (item.title + ' ' + item.description).toLowerCase();
      let actionType = 'enforcement_notice';
      if (text.includes('merger') || text.includes('acquisition')) actionType = 'merger_challenge';
      if (text.includes('complaint')) actionType = 'enforcement_complaint';
      if (text.includes('consent') || text.includes('settlement')) actionType = 'consent_order';
      if (text.includes('civil investigative')) actionType = 'civil_investigative_demand';

      signals.push({
        signalType: 'regulatory',
        description: `FTC Enforcement Action: ${item.title}. ${item.description.substring(0, 450)} Companies in affected industries should assess compliance exposure and activate regulatory readiness protocols.`,
        confidence: Math.min(score, 91),
        impact: isHighValue ? 'high' : 'medium',
        timeline: '30-90 days',
        source: 'FTC — Federal Trade Commission',
        sourceUrl: item.link || 'https://www.ftc.gov/news-events/news/press-releases',
        category: 'regulatory',
        jurisdiction: 'US',
        confidenceTier: 1,
        enforcementActionType: actionType,
        regulatorAgency: 'Federal Trade Commission',
        penaltyAmountRange: text.includes('billion') ? '$100M–$1B+' : text.includes('million') ? '$1M–$100M' : 'TBD',
        namedSector: null,
        threatSeverity: null, exploitStatus: null, affectedVendor: null, cveId: null, affectedSector: null,
        economicIndicatorType: null, indicatorDirection: null, indicatorMagnitude: null, centralBank: null,
        tradeActionType: null, effectiveTimeline: null, tradePartner: null, affectedHsCodes: null,
        recallClass: null, affectedProductType: null, recallScope: null,
        signalEventType: 'enforcement_action',
        metricName: 'Enforcement Relevance Score',
        metricValue: score,
        metricThreshold: 72,
        metricUnit: '/100',
      });
      added++;
    }

    console.log(`[FTC] ${added} significant enforcement action(s) in last ${LOOKBACK_DAYS} days`);
  } catch (err) {
    console.warn(`[FTC] Fetch failed:`, err instanceof Error ? err.message : err);
  }

  return signals;
}
