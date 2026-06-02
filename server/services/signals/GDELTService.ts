/**
 * RSS News Velocity Service — replaces GDELT.
 *
 * GDELT (gdeltproject.org) returns HTTP 429 from Replit's shared cloud IP pool
 * because its per-IP rate limit is triggered by other tenants on the same IP.
 * This service achieves the same goal — measuring global news velocity for
 * reputational, supply-chain, and geopolitical triggers — using a curated set
 * of proven-accessible RSS feeds (same transport as our 36-feed pipeline).
 *
 * Exported function name kept identical so LiveSignalIngestionService.ts
 * requires no changes.
 */

import type { QuantitativeSignal } from './types.js';

const LOOKBACK_HOURS = 72;
const REQUEST_TIMEOUT_MS = 12000;

interface RSSItem {
  title: string;
  pubDate: string;
  link?: string;
}

interface VelocityQuery {
  label: string;
  trigger: string;
  domain: string;
  feeds: string[];
  keywords: string[];
  threshold: number;
}

const VELOCITY_QUERIES: VelocityQuery[] = [
  {
    label: 'Reputational Crisis',
    trigger: 'Reputational Crisis Signal',
    domain: 'reputation',
    // PR Newswire and Courthouse News cover boycotts, scandals, class-actions
    feeds: [
      'https://www.prnewswire.com/rss/news-releases-list.rss',
      'https://www.courthousenews.com/feed/',
      'https://apnews.com/hub/business?format=rss',
    ],
    keywords: ['boycott', 'scandal', 'backlash', 'controversy', 'lawsuit', 'class action', 'investigation', 'protest'],
    threshold: 3,
  },
  {
    label: 'Supply Chain Disruption',
    trigger: 'Supply Chain Disruption',
    domain: 'supply_chain',
    feeds: [
      'https://apnews.com/hub/business?format=rss',
      'https://feeds.marketwatch.com/marketwatch/topstories/',
      'https://www.globenewswire.com/RssFeed/country/United+States',
    ],
    keywords: ['supply chain', 'shipping disruption', 'port closure', 'logistics', 'shortage', 'freight', 'tariff'],
    threshold: 3,
  },
  {
    label: 'Geopolitical Escalation',
    trigger: 'Geopolitical Risk Signal',
    domain: 'geopolitical',
    feeds: [
      'https://www.state.gov/press-releases/feed/',
      'https://www.whitehouse.gov/news/feed/',
      'https://apnews.com/hub/business?format=rss',
    ],
    keywords: ['sanctions', 'trade war', 'export ban', 'embargo', 'geopolitical', 'tariff', 'diplomatic', 'conflict'],
    threshold: 2,
  },
];

function parsePubDate(dateStr: string): Date | null {
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
}

function extractItems(xml: string): RSSItem[] {
  const items: RSSItem[] = [];
  const itemPattern = /<item[^>]*>([\s\S]*?)<\/item>/g;
  let match: RegExpExecArray | null;

  while ((match = itemPattern.exec(xml)) !== null) {
    const block = match[1];

    const titleMatch = block.match(/<title(?:[^>]*)>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/);
    const dateMatch = block.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/);
    const linkMatch = block.match(/<link[^>]*>([\s\S]*?)<\/link>/);

    if (titleMatch && dateMatch) {
      items.push({
        title: titleMatch[1].trim(),
        pubDate: dateMatch[1].trim(),
        link: linkMatch?.[1]?.trim(),
      });
    }
  }
  return items;
}

async function fetchFeedItems(feedUrl: string): Promise<RSSItem[]> {
  try {
    const res = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'ReadinessOS/1.0 signal-intelligence',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return extractItems(xml);
  } catch {
    return [];
  }
}

function countKeywordMatches(items: RSSItem[], keywords: string[], cutoff: Date): number {
  return items.filter(item => {
    const pubDate = parsePubDate(item.pubDate);
    if (!pubDate || pubDate < cutoff) return false;
    const titleLower = item.title.toLowerCase();
    return keywords.some(kw => titleLower.includes(kw.toLowerCase()));
  }).length;
}

function countToConfidence(count: number): number {
  if (count >= 15) return 84;
  if (count >= 8)  return 77;
  if (count >= 4)  return 70;
  return 63;
}

function countToImpact(count: number): 'critical' | 'high' | 'medium' | 'low' {
  if (count >= 15) return 'critical';
  if (count >= 8)  return 'high';
  if (count >= 4)  return 'medium';
  return 'low';
}

async function runVelocityQuery(query: VelocityQuery, cutoff: Date): Promise<QuantitativeSignal | null> {
  const allItems: RSSItem[] = [];
  for (const feedUrl of query.feeds) {
    const items = await fetchFeedItems(feedUrl);
    allItems.push(...items);
  }

  const matchCount = countKeywordMatches(allItems, query.keywords, cutoff);
  if (matchCount < query.threshold) return null;

  const confidence = countToConfidence(matchCount);
  const impact = countToImpact(matchCount);

  return {
    signalType: query.domain,
    description: `News Velocity Spike: ${matchCount} articles in last ${LOOKBACK_HOURS}h across ${query.feeds.length} sources matched "${query.label}" signal pattern (keywords: ${query.keywords.slice(0, 4).join(', ')}). Cross-source keyword velocity indicates active ${query.label.toLowerCase()} pattern requiring executive awareness.`,
    confidence,
    impact,
    timeline: '1–7 days',
    source: 'RSS Velocity Monitor — Multi-Source News Pipeline',
    sourceUrl: query.feeds[0],
    category: query.domain,
    jurisdiction: 'Global',
    confidenceTier: 2,
    enforcementActionType: null,
    regulatorAgency: null,
    penaltyAmountRange: null,
    namedSector: query.label,
    threatSeverity: impact === 'critical' ? 'critical' : impact === 'high' ? 'high' : 'medium',
    exploitStatus: null,
    affectedVendor: null,
    cveId: null,
    affectedSector: query.label,
    economicIndicatorType: null,
    indicatorDirection: 'increasing',
    indicatorMagnitude: `${matchCount} articles`,
    centralBank: null,
    tradeActionType: query.domain === 'geopolitical' ? 'geopolitical_event' : null,
    effectiveTimeline: null,
    tradePartner: null,
    affectedHsCodes: null,
    recallClass: null,
    affectedProductType: null,
    recallScope: null,
    signalEventType: 'news_velocity_spike',
    metricName: `${query.label} Article Count (${LOOKBACK_HOURS}h)`,
    metricValue: matchCount,
    metricThreshold: query.threshold,
    metricUnit: 'articles',
  };
}

export async function fetchGDELTSignals(): Promise<QuantitativeSignal[]> {
  const signals: QuantitativeSignal[] = [];
  const cutoff = new Date(Date.now() - LOOKBACK_HOURS * 3600 * 1000);

  try {
    let detected = 0;
    for (const query of VELOCITY_QUERIES) {
      const result = await runVelocityQuery(query, cutoff);
      if (result) {
        signals.push(result);
        detected++;
      }
    }
    console.log(`[NewsVelocity] ${detected} velocity pattern(s) across ${VELOCITY_QUERIES.length} domains (${LOOKBACK_HOURS}h window, RSS-based)`);
  } catch (err) {
    console.warn(`[NewsVelocity] Error:`, err instanceof Error ? err.message : err);
  }

  return signals;
}
