/**
 * CFPB Enforcement Action Service — replaces the CFPB complaint search API.
 *
 * The CFPB complaint search API (/search/api/v1/) streams 95MB+ of complaint
 * records regardless of size=0 parameter, causing consistent 20-35s timeouts.
 * This service instead parses the CFPB's official newsroom RSS feed
 * (https://www.consumerfinance.gov/about-us/newsroom/feed/) to count
 * enforcement actions — a higher-signal indicator than raw complaint volume
 * because enforcement actions represent regulatory escalation, not just volume.
 *
 * Covers triggers: Financial Distress Signal, Reputational Crisis Signal,
 * Regulatory Enforcement Action.
 *
 * Exported function name kept identical so LiveSignalIngestionService.ts
 * requires no changes.
 */

import type { QuantitativeSignal } from './types.js';

const CFPB_NEWSROOM_RSS = 'https://www.consumerfinance.gov/about-us/newsroom/feed/';
const LOOKBACK_DAYS = 30;
const TIMEOUT_MS = 15000;

const ENFORCEMENT_KEYWORDS = [
  'enforcement', 'action', 'fine', 'penalty', 'settlement', 'consent order',
  'violation', 'charged', 'lawsuit', 'complaint', 'investigation', 'order',
];

const HIGH_VOLUME_THRESHOLD = 3;

interface RSSItem {
  title: string;
  pubDate: string;
  link?: string;
  description?: string;
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
    const descMatch = block.match(/<description(?:[^>]*)>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/);

    if (titleMatch) {
      items.push({
        title: titleMatch[1].trim(),
        pubDate: dateMatch?.[1]?.trim() ?? '',
        link: linkMatch?.[1]?.trim(),
        description: descMatch?.[1]?.trim(),
      });
    }
  }
  return items;
}

function isEnforcementItem(item: RSSItem, cutoff: Date): boolean {
  if (item.pubDate) {
    try {
      const d = new Date(item.pubDate);
      if (!isNaN(d.getTime()) && d < cutoff) return false;
    } catch {
      // ignore unparseable dates
    }
  }
  const text = `${item.title} ${item.description || ''}`.toLowerCase();
  return ENFORCEMENT_KEYWORDS.some(kw => text.includes(kw));
}

export async function fetchCFPBComplaintSignals(): Promise<QuantitativeSignal[]> {
  const signals: QuantitativeSignal[] = [];
  const cutoff = new Date(Date.now() - LOOKBACK_DAYS * 86400000);

  try {
    const res = await fetch(CFPB_NEWSROOM_RSS, {
      headers: {
        'User-Agent': 'ReadinessOS/1.0 signal-intelligence',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!res.ok) throw new Error(`CFPB RSS ${res.status}`);

    const xml = await res.text();
    const items = extractItems(xml);
    const enforcementItems = items.filter(item => isEnforcementItem(item, cutoff));
    const totalItems = items.length;
    const enforcementCount = enforcementItems.length;

    if (enforcementCount === 0 && totalItems === 0) {
      console.log(`[CFPB] No newsroom items parsed from RSS`);
      return [];
    }

    console.log(`[CFPB] ${enforcementCount} enforcement-related newsroom item(s) in last ${LOOKBACK_DAYS} days (${totalItems} total items)`);

    if (enforcementCount >= HIGH_VOLUME_THRESHOLD) {
      const topTitles = enforcementItems.slice(0, 3).map(i => i.title).join(' | ');
      const confidence = enforcementCount >= 5 ? 80 : 70;
      const impact: 'critical' | 'high' | 'medium' | 'low' = enforcementCount >= 5 ? 'high' : 'medium';

      signals.push({
        signalType: 'regulatory',
        description: `CFPB Enforcement Velocity: ${enforcementCount} enforcement-related actions announced in last ${LOOKBACK_DAYS} days. Recent actions: ${topTitles.substring(0, 400)}. Elevated enforcement activity signals heightened financial services regulatory risk and reputational exposure.`,
        confidence,
        impact,
        timeline: '30-90 days',
        source: 'CFPB — Consumer Financial Protection Bureau Newsroom',
        sourceUrl: 'https://www.consumerfinance.gov/about-us/newsroom/',
        category: 'regulatory',
        jurisdiction: 'US',
        confidenceTier: 2,
        enforcementActionType: 'enforcement_velocity',
        regulatorAgency: 'Consumer Financial Protection Bureau',
        penaltyAmountRange: null,
        namedSector: 'Financial Services',
        threatSeverity: null,
        exploitStatus: null,
        affectedVendor: null,
        cveId: null,
        affectedSector: 'Financial Services',
        economicIndicatorType: null,
        indicatorDirection: 'increasing',
        indicatorMagnitude: `${enforcementCount} enforcement actions`,
        centralBank: null,
        tradeActionType: null,
        effectiveTimeline: null,
        tradePartner: null,
        affectedHsCodes: null,
        recallClass: null,
        affectedProductType: 'Financial Products',
        recallScope: null,
        signalEventType: 'enforcement_velocity',
        metricName: `CFPB Enforcement Actions (${LOOKBACK_DAYS} days)`,
        metricValue: enforcementCount,
        metricThreshold: HIGH_VOLUME_THRESHOLD,
        metricUnit: 'enforcement actions',
      });
    }
  } catch (err) {
    console.warn(`[CFPB] Fetch failed:`, err instanceof Error ? err.message : err);
  }

  return signals;
}
