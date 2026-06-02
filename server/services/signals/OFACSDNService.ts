import type { QuantitativeSignal } from './types.js';

const OFAC_RSS = 'https://home.treasury.gov/rss-feeds/ofac-notices';
const BIS_FEDERAL_REGISTER_URL = 'https://www.federalregister.gov/api/v1/articles.json?conditions[agencies][]=industry-and-security-bureau&conditions[type][]=RULE&conditions[type][]=NOTICE&per_page=10&order=newest';
const LOOKBACK_DAYS = 14;

interface FedRegArticle {
  title: string;
  abstract?: string;
  html_url: string;
  publication_date: string;
  agencies: { name: string }[];
  action?: string;
}

function parseRSSDate(dateStr: string): Date {
  try { return new Date(dateStr); } catch { return new Date(0); }
}

async function fetchOFACRSSNotices(): Promise<QuantitativeSignal[]> {
  const signals: QuantitativeSignal[] = [];
  const cutoff = new Date(Date.now() - LOOKBACK_DAYS * 86400000);

  try {
    const res = await fetch(OFAC_RSS, {
      headers: { 'User-Agent': 'ReadinessOS/1.0 signal-intelligence', Accept: 'application/rss+xml,application/xml,text/xml' },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) throw new Error(`OFAC RSS ${res.status}`);

    const xml = await res.text();
    const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
    let count = 0;

    for (const item of items) {
      const title = (item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || item.match(/<title>(.*?)<\/title>/))?.[1]?.trim() || '';
      const link = (item.match(/<link>(.*?)<\/link>/) || [])[1]?.trim() || '';
      const pubDateStr = (item.match(/<pubDate>(.*?)<\/pubDate>/) || [])[1]?.trim() || '';
      const desc = (item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) || item.match(/<description>(.*?)<\/description>/))?.[1]?.trim() || '';
      const pubDate = pubDateStr ? parseRSSDate(pubDateStr) : new Date();

      if (pubDate < cutoff) continue;
      count++;

      const isSanctionsUpdate = /sanction|designation|SDN|blocked|delisted|added|entity list/i.test(title + ' ' + desc);
      const confidence = isSanctionsUpdate ? 88 : 72;
      const isHighValue = /russia|china|iran|north korea|venezuela|myanmar|cuba|belarus/i.test(title + ' ' + desc);

      signals.push({
        signalType: 'regulatory',
        description: `OFAC Sanctions Notice: ${title}. ${desc.substring(0, 400)} Supply chain counterparty risk requires immediate verification against SDN list.`,
        confidence: isHighValue ? Math.min(confidence + 8, 96) : confidence,
        impact: isHighValue ? 'critical' : 'high',
        timeline: 'immediate',
        source: 'OFAC — Office of Foreign Assets Control',
        sourceUrl: link || 'https://home.treasury.gov/policy-issues/financial-sanctions/recent-actions',
        category: 'regulatory',
        jurisdiction: 'US',
        confidenceTier: 1,
        enforcementActionType: 'sanctions_designation',
        regulatorAgency: 'OFAC / US Treasury',
        penaltyAmountRange: 'Civil penalties up to $1M+ per violation',
        namedSector: null,
        threatSeverity: null,
        exploitStatus: null,
        affectedVendor: null,
        cveId: null,
        affectedSector: null,
        economicIndicatorType: null,
        indicatorDirection: null,
        indicatorMagnitude: null,
        centralBank: null,
        tradeActionType: 'sanctions_action',
        effectiveTimeline: pubDateStr,
        tradePartner: null,
        affectedHsCodes: null,
        recallClass: null,
        affectedProductType: null,
        recallScope: null,
        signalEventType: 'sanctions_update',
        metricName: 'Days Since Sanctions Update',
        metricValue: Math.round((Date.now() - pubDate.getTime()) / 86400000),
        metricThreshold: 7,
        metricUnit: 'days',
      });
    }

    console.log(`[OFAC] ${count} sanctions notice(s) in last ${LOOKBACK_DAYS} days`);
  } catch (err) {
    console.warn(`[OFAC] Fetch failed:`, err instanceof Error ? err.message : err);
  }

  return signals;
}

async function fetchBISEntityListUpdates(): Promise<QuantitativeSignal[]> {
  const signals: QuantitativeSignal[] = [];
  const cutoff = new Date(Date.now() - LOOKBACK_DAYS * 86400000);

  try {
    const res = await fetch(BIS_FEDERAL_REGISTER_URL, {
      headers: { 'User-Agent': 'ReadinessOS/1.0 signal-intelligence' },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) throw new Error(`BIS Fed Register ${res.status}`);

    const data = await res.json() as { results?: FedRegArticle[] };
    const results = (data.results || []).filter(r => new Date(r.publication_date) >= cutoff);

    for (const article of results.slice(0, 3)) {
      signals.push({
        signalType: 'regulatory',
        description: `BIS Export Control Update: ${article.title}. ${(article.abstract || '').substring(0, 350)} New entity list designations may restrict supply chain partnerships and technology exports.`,
        confidence: 81,
        impact: 'high',
        timeline: '1-7 days',
        source: 'BIS — Bureau of Industry and Security',
        sourceUrl: article.html_url,
        category: 'regulatory',
        jurisdiction: 'US',
        confidenceTier: 1,
        enforcementActionType: 'export_control',
        regulatorAgency: 'BIS / Commerce Dept',
        penaltyAmountRange: 'Criminal penalties up to $1M; civil up to $300K per violation',
        namedSector: null,
        threatSeverity: null, exploitStatus: null, affectedVendor: null, cveId: null, affectedSector: null,
        economicIndicatorType: null, indicatorDirection: null, indicatorMagnitude: null, centralBank: null,
        tradeActionType: 'export_control',
        effectiveTimeline: article.publication_date,
        tradePartner: null, affectedHsCodes: null,
        recallClass: null, affectedProductType: null, recallScope: null,
        signalEventType: 'entity_list_update',
        metricName: 'Days Since BIS Update',
        metricValue: Math.round((Date.now() - new Date(article.publication_date).getTime()) / 86400000),
        metricThreshold: 7,
        metricUnit: 'days',
      });
    }

    if (results.length > 0) console.log(`[BIS Entity List] ${results.length} export control update(s) in last ${LOOKBACK_DAYS} days`);
  } catch (err) {
    console.warn(`[BIS] Fetch failed:`, err instanceof Error ? err.message : err);
  }

  return signals;
}

export async function fetchOFACSDNSignals(): Promise<QuantitativeSignal[]> {
  const [ofac, bis] = await Promise.allSettled([fetchOFACRSSNotices(), fetchBISEntityListUpdates()]);
  return [
    ...(ofac.status === 'fulfilled' ? ofac.value : []),
    ...(bis.status === 'fulfilled' ? bis.value : []),
  ];
}
