import { db } from '../db.js';
import { weakSignals, strategicAlerts } from '@shared/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { evaluateAndPersistSignals, evaluateLeadingIndicators, evaluateCompoundPatterns } from './SignalEvaluationService.js';
import { fetchCISAKEVSignals } from './signals/CISAKEVService.js';
import { fetchFREDSignals } from './signals/FREDService.js';
import { fetchOpenFDASignals } from './signals/OpenFDAService.js';
import { fetchSECEdgarSignals } from './signals/SECEdgarStructuredService.js';
import { fetchInternalReadinessSignals } from './signals/InternalReadinessSignalService.js';
import { fetchRegulatoryCalendarSignals } from './signals/RegulatoryCalendarService.js';
import { fetchOFACSDNSignals } from './signals/OFACSDNService.js';
import { fetchGDELTSignals } from './signals/GDELTService.js';
import { fetchFederalRegisterSignals } from './signals/FederalRegisterService.js';
import { fetchNISTNVDSignals } from './signals/NISTNVDService.js';
import { fetchNOAAFEMASignals } from './signals/NOAAFEMAService.js';
import { fetchCongressSignals } from './signals/CongressService.js';
import { fetchFTCEnforcementSignals } from './signals/FTCEnforcementService.js';
import { fetchCFPBComplaintSignals } from './signals/CFPBComplaintService.js';
import { fetchArXivVelocitySignals } from './signals/ArXivVelocityService.js';
import { signalSourceRegistry } from './SignalSourceRegistry.js';

interface RSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  category: string;
}

interface AnalyzedSignal {
  signalType: string;
  description: string;
  confidence: number;
  impact: string;
  timeline: string;
  source: string;
  sourceUrl: string;
  category: string;
  jurisdiction: string;
  confidenceTier: number;
  // P2: Regulatory enforcement
  enforcementActionType: string | null;
  regulatorAgency: string | null;
  penaltyAmountRange: string | null;
  namedSector: string | null;
  // P3: Cyber threat intelligence
  threatSeverity: string | null;
  exploitStatus: string | null;
  affectedVendor: string | null;
  cveId: string | null;
  affectedSector: string | null;
  // P4: Economic indicator
  economicIndicatorType: string | null;
  indicatorDirection: string | null;
  indicatorMagnitude: string | null;
  centralBank: string | null;
  // P5: Trade & geopolitical
  tradeActionType: string | null;
  effectiveTimeline: string | null;
  tradePartner: string | null;
  affectedHsCodes: string | null;
  // P6: Health & safety recall
  recallClass: string | null;
  affectedProductType: string | null;
  recallScope: string | null;
  // Market signal
  signalEventType: string | null;
}

const RSS_FEEDS: { url: string; source: string; category: string }[] = [
  // Market & business news (baseline)
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml', source: 'NY Times Business', category: 'market' },
  { url: 'https://feeds.bbci.co.uk/news/business/rss.xml', source: 'BBC Business', category: 'market' },
  { url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114', source: 'CNBC Business', category: 'market' },
  { url: 'https://feeds.marketwatch.com/marketwatch/topstories/', source: 'MarketWatch', category: 'market' },
  { url: 'https://feeds.npr.org/1006/rss.xml', source: 'NPR Business', category: 'market' },
  { url: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US%3Aen', source: 'Google News Finance', category: 'market' },
  { url: 'https://feeds.feedburner.com/entrepreneur/latest', source: 'Entrepreneur', category: 'market' },
  // Reuters RSS shut down — replaced with Yahoo Finance (verified working)
  { url: 'https://finance.yahoo.com/news/rssindex', source: 'Yahoo Finance', category: 'market' },
  // AP Business — updated URL (old feeds.apnews.com path is dead)
  { url: 'https://apnews.com/hub/business?format=rss', source: 'AP Business', category: 'market' },
  // Corporate announcements — Business Wire blocked; replaced with GlobeNewsWire
  { url: 'https://www.globenewswire.com/RssFeed/country/United+States', source: 'GlobeNewsWire', category: 'market' },
  // Financial markets & investment intelligence
  { url: 'https://www.forbes.com/business/feed/', source: 'Forbes Business', category: 'market' },
  { url: 'https://seekingalpha.com/market_currents.xml', source: 'Seeking Alpha', category: 'market' },
  // Regulatory & government enforcement
  { url: 'https://www.federalregister.gov/articles/search.rss?conditions%5Bterm%5D=corporate+regulatory+compliance', source: 'Federal Register', category: 'regulatory' },
  { url: 'https://www.federalregister.gov/articles/search.rss?conditions%5Bterm%5D=financial+regulatory+enforcement', source: 'Federal Register Enforcement', category: 'regulatory' },
  { url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=8-K&dateb=&owner=include&count=40&search_text=&output=atom', source: 'SEC EDGAR', category: 'regulatory' },
  // FTC — updated URL (old /rss.xml path returns 403)
  { url: 'https://www.ftc.gov/news-events/news/press-releases/rss', source: 'FTC', category: 'regulatory' },
  { url: 'https://www.justice.gov/rss/news.xml', source: 'DOJ', category: 'regulatory' },
  { url: 'https://www.fda.gov/about-fda/contact-fda/stay-informed/rss-feeds/food-safety-recalls/rss.xml', source: 'FDA', category: 'regulatory' },
  // Cybersecurity & threat intelligence
  { url: 'https://www.cisa.gov/cybersecurity-advisories/all.xml', source: 'CISA', category: 'cybersecurity' },
  { url: 'https://isc.sans.edu/rssfeed_full.xml', source: 'SANS Internet Storm Center', category: 'cybersecurity' },
  // Legal enforcement coverage — Bloomberg Law and Courthouse News replace OSHA/EEOC/NLRB (all dead)
  { url: 'https://news.bloomberglaw.com/feeds/news', source: 'Bloomberg Law', category: 'regulatory' },
  { url: 'https://www.courthousenews.com/feed/', source: 'Courthouse News', category: 'regulatory' },
  // PR Newswire
  { url: 'https://www.prnewswire.com/rss/news-releases-list.rss', source: 'PR Newswire', category: 'market' },
  // Labor & economic indicators
  { url: 'https://www.bls.gov/feed/bls_latest.rss', source: 'Bureau of Labor Statistics', category: 'economic' },
  { url: 'https://www.federalreserve.gov/feeds/press_all.xml', source: 'Federal Reserve', category: 'economic' },
  // Environmental enforcement
  { url: 'https://www.epa.gov/newsreleases/search/rss', source: 'EPA', category: 'regulatory' },
  // Financial system regulatory
  { url: 'https://www.consumerfinance.gov/about-us/newsroom/feed/', source: 'CFPB', category: 'regulatory' },
  { url: 'https://www.occ.gov/news-issuances/news-releases/feed.xml', source: 'OCC', category: 'regulatory' },
  // Global health & safety — HHS blocked; CDC verified working
  { url: 'https://tools.cdc.gov/api/v2/resources/media/132608.rss', source: 'CDC', category: 'health' },
  { url: 'https://www.who.int/rss-feeds/news-english.xml', source: 'WHO', category: 'health' },
  // Transportation safety
  { url: 'https://www.ntsb.gov/news/press-releases/Pages/feed.aspx', source: 'NTSB', category: 'regulatory' },
  // Geopolitical — White House URL updated (old path 404)
  { url: 'https://www.state.gov/press-releases/feed/', source: 'State Dept', category: 'geopolitical' },
  { url: 'https://www.whitehouse.gov/news/feed/', source: 'White House', category: 'geopolitical' },
  // Energy — FERC blocked (403); EIA still covers energy data
  { url: 'https://www.eia.gov/rss/todayinenergy.xml', source: 'EIA', category: 'economic' },
  // International financial regulatory
  { url: 'https://www.fca.org.uk/news/rss.xml', source: 'UK FCA', category: 'regulatory' },
  { url: 'https://www.ecb.europa.eu/rss/press.html', source: 'ECB', category: 'economic' },
];

const SIGNAL_TYPE_MAP: Record<string, string[]> = {
  market: ['acquisition', 'merger', 'market share', 'revenue', 'earnings', 'IPO', 'stock', 'valuation', 'growth', 'decline'],
  regulatory: ['regulation', 'compliance', 'SEC', 'FTC', 'antitrust', 'sanctions', 'policy', 'legislation', 'enforcement', 'fine', 'DOJ', 'FDA', 'recall', 'violation', 'investigation', 'settlement'],
  technology: ['AI', 'artificial intelligence', 'cloud', 'digital transformation', 'automation', 'quantum', 'software', 'platform'],
  cybersecurity: ['ransomware', 'breach', 'vulnerability', 'exploit', 'malware', 'phishing', 'incident', 'cyberattack', 'zero-day', 'advisory', 'patch', 'CVE', 'CISA', 'threat actor'],
  competitor: ['competitor', 'rival', 'market leader', 'disruption', 'partnership', 'alliance', 'launch', 'expansion'],
  supply_chain: ['supply chain', 'logistics', 'shipping', 'tariff', 'trade war', 'shortage', 'inventory', 'procurement'],
  geopolitical: ['sanctions', 'trade war', 'tariff', 'geopolitical', 'conflict', 'export control', 'diplomatic', 'embargo'],
  economic: ['inflation', 'unemployment', 'interest rate', 'GDP', 'recession', 'jobs report', 'CPI', 'labor market', 'monetary policy', 'federal reserve', 'Fed rate'],
  health: ['outbreak', 'pandemic', 'recall', 'safety alert', 'public health', 'WHO', 'FDA warning', 'contamination', 'epidemic', 'health emergency'],
};

const IMPACT_KEYWORDS: Record<string, string[]> = {
  critical: ['crisis', 'breach', 'collapse', 'bankruptcy', 'shutdown', 'emergency', 'catastrophic'],
  high: ['major', 'significant', 'billion', 'disruption', 'transformation', 'acquisition', 'merger'],
  medium: ['growth', 'expansion', 'partnership', 'update', 'change', 'shift'],
  low: ['minor', 'small', 'incremental', 'gradual', 'expected'],
};

function parseXML(xmlText: string): RSSItem[] {
  const items: RSSItem[] = [];
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>|<entry[^>]*>([\s\S]*?)<\/entry>/gi;
  let match;

  while ((match = itemRegex.exec(xmlText)) !== null) {
    const content = match[1] || match[2] || '';
    const titleMatch = content.match(/<title[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/i);
    const descMatch = content.match(/<description[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/description>|<summary[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/summary>/i);
    const linkMatch = content.match(/<link[^>]*>([^<]*)<\/link>|<link[^>]*href="([^"]*)"[^>]*\/>/i);
    const dateMatch = content.match(/<pubDate[^>]*>(.*?)<\/pubDate>|<updated[^>]*>(.*?)<\/updated>/i);

    if (titleMatch) {
      items.push({
        title: titleMatch[1]?.trim() || '',
        description: (descMatch?.[1] || descMatch?.[2] || '').replace(/<[^>]*>/g, '').trim().substring(0, 500),
        link: (linkMatch?.[1] || linkMatch?.[2] || '').trim(),
        pubDate: (dateMatch?.[1] || dateMatch?.[2] || new Date().toISOString()).trim(),
        source: '',
        category: '',
      });
    }
  }
  return items;
}

function classifySignalType(text: string): string {
  const lower = text.toLowerCase();
  let bestType = 'market';
  let bestScore = 0;

  for (const [type, keywords] of Object.entries(SIGNAL_TYPE_MAP)) {
    const score = keywords.filter(kw => lower.includes(kw.toLowerCase())).length;
    if (score > bestScore) { bestScore = score; bestType = type; }
  }
  return bestType;
}

function classifyImpact(text: string): string {
  const lower = text.toLowerCase();
  for (const level of ['critical', 'high', 'medium', 'low']) {
    if (IMPACT_KEYWORDS[level].some(kw => lower.includes(kw))) return level;
  }
  return 'medium';
}

function calculateConfidence(item: RSSItem): number {
  let conf = 50;
  if (item.description.length > 100) conf += 10;
  // Tier 1: authoritative government / regulatory sources — highest confidence
  if (['SEC EDGAR', 'CISA', 'DOJ', 'FTC', 'FDA', 'OCC', 'White House', 'UK FCA', 'SANS Internet Storm Center', 'Bloomberg Law', 'Federal Register'].some(s => item.source.includes(s))) conf += 20;
  // Tier 2: major wire services, financial regulators, and economic data
  else if (['Federal Reserve', 'EIA', 'ECB', 'CDC', 'WHO', 'State Dept', 'Bureau of Labor Statistics', 'CFPB', 'Courthouse News'].some(s => item.source.includes(s))) conf += 15;
  // Tier 3: established news and financial media
  else if (['BBC', 'NY Times', 'CNBC', 'MarketWatch', 'PR Newswire', 'GlobeNewsWire', 'AP Business', 'Yahoo Finance', 'Forbes Business', 'Seeking Alpha'].some(s => item.source.includes(s))) conf += 10;
  const date = new Date(item.pubDate);
  const hoursAgo = (Date.now() - date.getTime()) / (1000 * 60 * 60);
  if (hoursAgo < 6) conf += 15;
  else if (hoursAgo < 24) conf += 10;
  else if (hoursAgo < 72) conf += 5;
  return Math.min(conf, 95);
}

// ── P2: Regulatory enforcement extraction ──────────────────────────────────────
function extractEnforcementActionType(text: string): string | null {
  const t = text.toLowerCase();
  if (t.includes('criminal') || t.includes('indicted') || t.includes('indictment')) return 'criminal_indictment';
  if (t.includes('consent order') || t.includes('consent decree')) return 'consent_order';
  if (t.includes('settlement') || t.includes('settled')) return 'settlement';
  if (t.includes('injunction')) return 'injunction';
  if (t.includes('investigation') || t.includes('investigated') || t.includes('probe')) return 'investigation';
  if (t.includes('fine') || t.includes('penalty') || t.includes('civil penalty')) return 'fine';
  if (t.includes('advisory') || t.includes('guidance') || t.includes('notice')) return 'advisory';
  return null;
}

function extractRegulatoryAgency(source: string): string | null {
  const map: Record<string, string> = {
    'SEC EDGAR': 'SEC', 'FTC': 'FTC', 'DOJ': 'DOJ', 'FDA': 'FDA',
    'EEOC': 'EEOC', 'NLRB': 'NLRB', 'FDIC': 'FDIC', 'OCC': 'OCC',
    'FERC': 'FERC', 'OSHA': 'OSHA', 'EPA': 'EPA', 'FINRA': 'FINRA',
    'CFPB': 'CFPB', 'NTSB': 'NTSB', 'US Treasury': 'Treasury',
    'UK FCA': 'UK FCA', 'Federal Register': 'Federal Register',
  };
  for (const [k, v] of Object.entries(map)) {
    if (source.includes(k)) return v;
  }
  return null;
}

// ── P3: Cyber threat intelligence extraction ───────────────────────────────────
function extractThreatSeverity(text: string): string | null {
  const t = text.toLowerCase();
  if (t.includes('critical severity') || t.includes('cvss 9') || t.includes('cvss 10') || t.includes('actively exploited') || t.includes('critical vulnerability')) return 'critical';
  if (t.includes('high severity') || t.includes('cvss 7') || t.includes('cvss 8') || t.includes('high vulnerability')) return 'high';
  if (t.includes('medium severity') || t.includes('cvss 4') || t.includes('cvss 5') || t.includes('cvss 6')) return 'medium';
  if (t.includes('low severity') || t.includes('cvss 1') || t.includes('cvss 2') || t.includes('cvss 3')) return 'low';
  return null;
}

function extractExploitStatus(text: string): string | null {
  const t = text.toLowerCase();
  if (t.includes('actively exploited') || t.includes('known exploited') || t.includes('exploited in the wild') || t.includes(' kev ')) return 'known_exploited';
  if (t.includes('proof of concept') || t.includes('poc exploit') || t.includes('exploit code')) return 'proof_of_concept';
  if (t.includes('vulnerability') || t.includes('advisory') || t.includes('patch')) return 'theoretical';
  return null;
}

function extractAffectedVendor(text: string): string | null {
  const vendors = ['Microsoft', 'Cisco', 'Fortinet', 'VMware', 'Palo Alto', 'Juniper', 'F5', 'Citrix', 'SolarWinds', 'Ivanti', 'MOVEit', 'Atlassian', 'Apache', 'OpenSSL'];
  for (const v of vendors) {
    if (text.includes(v)) return v;
  }
  return null;
}

// ── P4: Economic indicator extraction ─────────────────────────────────────────
function extractEconomicIndicatorType(text: string, source: string): string | null {
  const t = text.toLowerCase();
  if (t.includes('interest rate') || t.includes('fed rate') || t.includes('rate decision') || t.includes('basis points') || t.includes('rate hike') || t.includes('rate cut')) return 'interest_rate';
  if (t.includes('jobs') || t.includes('employment') || t.includes('unemployment') || t.includes('payroll') || t.includes('nonfarm')) return 'jobs_report';
  if (t.includes('inflation') || t.includes('consumer price') || t.includes('cpi') || t.includes('price index')) return 'CPI';
  if (t.includes('gdp') || t.includes('gross domestic')) return 'GDP';
  if (t.includes('oil') || t.includes('gas price') || t.includes('energy price') || t.includes('crude') || source.includes('EIA')) return 'energy_price';
  if (t.includes('monetary policy') || t.includes('quantitative') || t.includes('balance sheet') || t.includes('fed chair')) return 'monetary_policy';
  return null;
}

function extractIndicatorDirection(text: string): string | null {
  const t = text.toLowerCase();
  if (t.includes('surprise') || t.includes('unexpected') || t.includes('shock') || t.includes('unexpectedly')) return 'unexpected';
  if (t.includes('rises') || t.includes('rose') || t.includes('increases') || t.includes('increased') || t.includes('higher') || t.includes('hikes') || t.includes('hiking')) return 'rising';
  if (t.includes('falls') || t.includes('fell') || t.includes('decreases') || t.includes('decreased') || t.includes('lower') || t.includes('cuts') || t.includes('cut rate')) return 'falling';
  if (t.includes('holds') || t.includes('unchanged') || t.includes('steady') || t.includes('stable') || t.includes('flat')) return 'stable';
  return null;
}

// ── P5: Trade & geopolitical extraction ───────────────────────────────────────
function extractTradeActionType(text: string): string | null {
  const t = text.toLowerCase();
  if (t.includes('executive order') || t.includes('executive action') || t.includes('presidential order')) return 'executive_order';
  if (t.includes('sanction') || t.includes('sanctioned') || t.includes('blacklist') || t.includes('blacklisted')) return 'sanction';
  if (t.includes('tariff') || t.includes('import duty') || t.includes('import tax')) return 'tariff';
  if (t.includes('export control') || t.includes('export restriction') || t.includes('export license')) return 'export_control';
  if (t.includes('embargo') || t.includes('trade ban') || t.includes('import ban')) return 'embargo';
  return null;
}

function extractEffectiveTimeline(text: string): string | null {
  const t = text.toLowerCase();
  if (t.includes('proposed') || t.includes('proposed rule') || t.includes('comment period')) return 'proposed';
  if (t.includes('immediate') || t.includes('effective today') || t.includes('effective immediately') || t.includes('takes effect today')) return 'immediate';
  if (t.includes('90-day') || t.includes('90 day') || t.includes('90 days') || t.includes('three months')) return '90_days';
  if (t.includes('30-day') || t.includes('30 day') || t.includes('30 days') || t.includes('one month')) return '30_days';
  return null;
}

// ── P6: Health & safety recall extraction ─────────────────────────────────────
function extractRecallClass(text: string): string | null {
  const t = text.toLowerCase();
  if (t.includes('class i ') || t.includes('class 1 ') || t.includes('class i recall') || t.includes('most serious recall')) return 'Class_I';
  if (t.includes('class ii ') || t.includes('class 2 ') || t.includes('class ii recall')) return 'Class_II';
  if (t.includes('class iii ') || t.includes('class 3 ') || t.includes('class iii recall')) return 'Class_III';
  return null;
}

function extractAffectedProductType(text: string, source: string): string | null {
  const t = text.toLowerCase();
  if (t.includes('pharmaceutical') || t.includes('drug') || t.includes('medication') || t.includes('medicine') || t.includes('tablet') || t.includes('capsule')) return 'pharma';
  if (t.includes('medical device') || t.includes('implant') || t.includes('surgical') || t.includes('diagnostic device')) return 'medical_device';
  if (t.includes('food') || t.includes('beverage') || t.includes('contamination') || t.includes('listeria') || t.includes('salmonella') || t.includes('e. coli')) return 'food';
  if (t.includes('vehicle') || t.includes('automobile') || t.includes('car recall') || t.includes('nhtsa') || t.includes('airbag')) return 'vehicle';
  if (t.includes('consumer product') || t.includes('cpsc') || t.includes('household')) return 'consumer';
  return null;
}

// ── Enhanced P2: Penalty amount & named sector ────────────────────────────────
function extractPenaltyAmountRange(text: string): string | null {
  const billions = text.match(/\$[\d,.]+\s*billion/i);
  const millions = text.match(/\$[\d,.]+\s*million/i);
  if (billions) return '100M+';
  if (millions) {
    const val = parseFloat(millions[0].replace(/[$,million\s]/gi, ''));
    if (val >= 100) return '100M+';
    if (val >= 10) return '10M-100M';
    if (val >= 1) return '1M-10M';
    return '<1M';
  }
  return null;
}

function extractNamedSector(text: string): string | null {
  const t = text.toLowerCase();
  if (t.includes('banking') || t.includes('bank ') || t.includes('financial institution') || t.includes('credit union')) return 'banking';
  if (t.includes('healthcare') || t.includes('health care') || t.includes('hospital') || t.includes('medical') || t.includes('pharma')) return 'healthcare';
  if (t.includes('energy') || t.includes('oil') || t.includes('gas ') || t.includes('electric utility') || t.includes('power company')) return 'energy';
  if (t.includes('labor') || t.includes('workers') || t.includes('employees') || t.includes('workforce') || t.includes('union')) return 'labor';
  if (t.includes('technology') || t.includes('tech company') || t.includes('software') || t.includes('internet company')) return 'tech';
  if (t.includes('retail') || t.includes('consumer goods') || t.includes('ecommerce')) return 'retail';
  return null;
}

// ── Enhanced P3: CVE ID & affected sector ─────────────────────────────────────
function extractCveId(text: string): string | null {
  const match = text.match(/CVE-\d{4}-\d{4,7}/i);
  return match ? match[0].toUpperCase() : null;
}

function extractAffectedSector(text: string, source: string): string | null {
  if (['FDIC', 'OCC', 'FINRA', 'CFPB'].some(s => source.includes(s))) return 'finance';
  if (source.includes('FERC') || source.includes('EIA')) return 'energy';
  if (['FDA', 'HHS', 'WHO'].some(s => source.includes(s))) return 'healthcare';
  if (source.includes('EEOC') || source.includes('NLRB') || source.includes('Bureau of Labor')) return 'labor';
  const t = text.toLowerCase();
  if (t.includes('hospital') || t.includes('healthcare') || t.includes('pharmaceutical') || t.includes('medical')) return 'healthcare';
  if (t.includes('bank') || t.includes('financial institution') || t.includes('securities') || t.includes('investment firm')) return 'finance';
  if (t.includes('energy') || t.includes('oil') || t.includes('gas ') || t.includes('power grid') || t.includes('utility')) return 'energy';
  if (t.includes('defense') || t.includes('military') || t.includes('government contractor')) return 'government';
  if (t.includes('semiconductor') || t.includes('software') || t.includes('data center') || t.includes('tech ')) return 'tech';
  if (t.includes('manufacturing') || t.includes('factory') || t.includes('industrial')) return 'manufacturing';
  return null;
}

// ── Enhanced P4: Magnitude & central bank ─────────────────────────────────────
function extractIndicatorMagnitude(text: string): string | null {
  const t = text.toLowerCase();
  if (t.includes('shock') || t.includes('crisis') || t.includes('collapse') || t.includes('historic') || t.includes('unprecedented') || t.includes('crash')) return 'shock';
  if (t.includes('significant') || t.includes('major') || t.includes('substantial') || t.includes('surge') || t.includes('plunge') || t.includes('dramatic')) return 'significant';
  if (t.includes('moderate') || t.includes('notable') || t.includes('considerable') || t.includes('marked')) return 'moderate';
  if (t.includes('slight') || t.includes('minor') || t.includes('small') || t.includes('incremental') || t.includes('marginal') || t.includes('modest')) return 'minor';
  return null;
}

function extractCentralBank(source: string): string | null {
  if (source.includes('Federal Reserve')) return 'Federal Reserve';
  if (source.includes('ECB')) return 'ECB';
  return null;
}

// ── Enhanced P5: Trade partner & HS codes ─────────────────────────────────────
function extractTradePartner(text: string): string | null {
  const partners = ['China', 'Russia', 'Iran', 'North Korea', 'Venezuela', 'Cuba', 'Mexico', 'Canada', 'India', 'Saudi Arabia', 'European Union'];
  for (const p of partners) {
    if (text.includes(p)) return p;
  }
  return null;
}

function extractAffectedHsCodes(text: string): string | null {
  const t = text.toLowerCase();
  if (t.includes('semiconductor') || t.includes('chip ') || t.includes('microchip') || t.includes('integrated circuit')) return 'semiconductors';
  if (t.includes('agriculture') || t.includes('grain') || t.includes('soy') || t.includes('wheat') || t.includes('corn') || t.includes('food export')) return 'agriculture';
  if (t.includes('defense') || t.includes('weapons') || t.includes('military equipment') || t.includes('arms export')) return 'defense';
  if (t.includes('steel') || t.includes('aluminum') || t.includes('metals') || t.includes('iron')) return 'metals';
  if (t.includes('vehicle') || t.includes('automobile') || t.includes('auto part') || t.includes('car import')) return 'automotive';
  if (t.includes('pharmaceutical import') || t.includes('drug import') || t.includes('medicine import')) return 'pharma';
  return null;
}

// ── Enhanced P6: Recall scope ─────────────────────────────────────────────────
function extractRecallScope(text: string): string | null {
  const t = text.toLowerCase();
  if (t.includes('worldwide') || t.includes('global recall') || t.includes('international recall') || t.includes('multi-country')) return 'international';
  if (t.includes('nationwide') || t.includes('national recall') || t.includes('across the united states') || t.includes('across the us')) return 'national';
  if (t.includes('regional') || t.includes('local recall') || t.includes('state-wide') || t.includes('multi-state')) return 'regional';
  return null;
}

// ── Market signal event type ───────────────────────────────────────────────────
function extractSignalEventType(text: string): string | null {
  const t = text.toLowerCase();
  if (t.includes('material weakness') || t.includes('internal control')) return 'material_weakness';
  if (t.includes('restatement') || t.includes('restated earnings') || t.includes('financial restatement')) return 'restatement';
  if (t.includes('bankruptcy') || t.includes('chapter 11') || t.includes('chapter 7') || t.includes('insolvency')) return 'bankruptcy';
  if (t.includes('acqui') || t.includes('buyout') || t.includes('takeover') || t.includes('purchased by')) return 'acquisition';
  if (t.includes('merger') || t.includes('merges with') || t.includes('combined with') || t.includes('consolidation')) return 'merger';
  if (t.includes('earnings miss') || t.includes('missed estimates') || t.includes('below expectations') || t.includes('fell short')) return 'earnings_miss';
  if ((t.includes('ceo') || t.includes('cfo') || t.includes('cto') || t.includes('chief executive')) && (t.includes('resign') || t.includes('depart') || t.includes('step') || t.includes('named') || t.includes('appoint'))) return 'leadership_change';
  return null;
}

function inferJurisdiction(source: string): string {
  if (['UK FCA'].some(s => source.includes(s))) return 'UK';
  if (['ECB'].some(s => source.includes(s))) return 'EU';
  if (['WHO', 'State Dept', 'White House'].some(s => source.includes(s))) return 'global';
  return 'US';
}

function getConfidenceTier(source: string): number {
  if (['SEC EDGAR', 'CISA', 'DOJ', 'FTC', 'FDA', 'US Treasury', 'FDIC', 'OCC', 'EEOC', 'NLRB', 'FERC', 'White House', 'UK FCA', 'SANS Internet Storm Center'].some(s => source.includes(s))) return 1;
  if (['Reuters', 'Federal Register', 'Federal Reserve', 'EIA', 'ECB', 'HHS', 'CBP'].some(s => source.includes(s))) return 2;
  return 3;
}

function estimateTimeline(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('immediate') || lower.includes('today') || lower.includes('breaking')) return 'Immediate';
  if (lower.includes('this week') || lower.includes('next week')) return '1-2 weeks';
  if (lower.includes('this month') || lower.includes('quarter')) return '1-3 months';
  if (lower.includes('this year') || lower.includes('annual')) return '3-6 months';
  return '1-3 months';
}

class LiveSignalIngestionService {
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;
  private lastFetchedUrls = new Set<string>();

  async fetchFeed(feed: { url: string; source: string; category: string }, attempt = 1): Promise<RSSItem[]> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);

      const res = await fetch(feed.url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'VaughnMartin-Signal-Monitor/1.0' },
      });
      clearTimeout(timeout);

      if (!res.ok) {
        console.log(`⚠ Feed ${feed.source} returned ${res.status}`);
        return [];
      }

      const text = await res.text();
      const items = parseXML(text);
      return items.map(item => ({ ...item, source: feed.source, category: feed.category }));
    } catch (err) {
      if (attempt < 2) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        return this.fetchFeed(feed, attempt + 1);
      }
      console.log(`⚠ Feed ${feed.source} unavailable — skipping`);
      return [];
    }
  }

  async ingestAllFeeds(): Promise<AnalyzedSignal[]> {
    const allItems: RSSItem[] = [];

    const results = await Promise.allSettled(RSS_FEEDS.map(feed => this.fetchFeed(feed)));
    for (const result of results) {
      if (result.status === 'fulfilled') {
        allItems.push(...result.value);
      }
    }

    const newItems = allItems.filter(item => {
      const key = `${item.title}:${item.link}`;
      if (this.lastFetchedUrls.has(key)) return false;
      this.lastFetchedUrls.add(key);
      return true;
    });

    if (this.lastFetchedUrls.size > 1000) {
      const arr = Array.from(this.lastFetchedUrls);
      this.lastFetchedUrls = new Set(arr.slice(arr.length - 500));
    }

    const strategicItems = newItems.filter(item => {
      const text = `${item.title} ${item.description}`.toLowerCase();
      return Object.values(SIGNAL_TYPE_MAP).some(keywords =>
        keywords.some(kw => text.includes(kw.toLowerCase()))
      );
    });

    const topItems = strategicItems.slice(0, 10);

    return topItems.map(item => {
      const fullText = `${item.title} ${item.description}`;
      return {
        signalType: classifySignalType(fullText),
        description: `${item.title}${item.description ? ` — ${item.description.substring(0, 450)}` : ''}`,
        confidence: calculateConfidence(item),
        impact: classifyImpact(fullText),
        timeline: estimateTimeline(fullText),
        source: item.source,
        sourceUrl: item.link,
        category: item.category,
        jurisdiction: inferJurisdiction(item.source),
        confidenceTier: getConfidenceTier(item.source),
        // P2: Regulatory enforcement
        enforcementActionType: extractEnforcementActionType(fullText),
        regulatorAgency: extractRegulatoryAgency(item.source),
        penaltyAmountRange: extractPenaltyAmountRange(fullText),
        namedSector: extractNamedSector(fullText),
        // P3: Cyber threat intelligence
        threatSeverity: extractThreatSeverity(fullText),
        exploitStatus: extractExploitStatus(fullText),
        affectedVendor: extractAffectedVendor(fullText),
        cveId: extractCveId(fullText),
        affectedSector: extractAffectedSector(fullText, item.source),
        // P4: Economic indicator
        economicIndicatorType: extractEconomicIndicatorType(fullText, item.source),
        indicatorDirection: extractIndicatorDirection(fullText),
        indicatorMagnitude: extractIndicatorMagnitude(fullText),
        centralBank: extractCentralBank(item.source),
        // P5: Trade & geopolitical
        tradeActionType: extractTradeActionType(fullText),
        effectiveTimeline: extractEffectiveTimeline(fullText),
        tradePartner: extractTradePartner(fullText),
        affectedHsCodes: extractAffectedHsCodes(fullText),
        // P6: Health & safety recall
        recallClass: extractRecallClass(fullText),
        affectedProductType: extractAffectedProductType(fullText, item.source),
        recallScope: extractRecallScope(fullText),
        // Market signal
        signalEventType: extractSignalEventType(fullText),
      };
    });
  }

  async persistSignals(signals: AnalyzedSignal[], organizationId: string): Promise<number> {
    let inserted = 0;
    for (const signal of signals) {
      try {
        await db.insert(weakSignals).values({
          organizationId,
          signalType: signal.signalType,
          description: signal.description,
          confidence: String(signal.confidence),
          impact: signal.impact,
          timeline: signal.timeline,
          source: `${signal.source} | ${signal.sourceUrl}`,
          status: 'active',
          relatedScenarios: [],
        });
        inserted++;
      } catch (err) {
        // skip duplicates
      }
    }
    return inserted;
  }

  async generateAlerts(signals: AnalyzedSignal[], organizationId: string): Promise<void> {
    const alertTypeMap: Record<string, 'opportunity' | 'risk' | 'competitive_threat' | 'market_shift' | 'regulatory_change'> = {
      market: 'market_shift',
      regulatory: 'regulatory_change',
      technology: 'opportunity',
      competitor: 'competitive_threat',
      supply_chain: 'risk',
    };

    const criticalSignals = signals.filter(s => s.impact === 'critical' || s.impact === 'high');
    for (const signal of criticalSignals.slice(0, 3)) {
      try {
        await db.insert(strategicAlerts).values({
          organizationId,
          alertType: alertTypeMap[signal.signalType] || 'market_shift',
          title: `Live Signal: ${signal.description.substring(0, 100)}`,
          description: signal.description,
          severity: signal.impact === 'critical' ? 'critical' : 'high',
          status: 'active',
          dataSourcesUsed: [signal.source],
          suggestedActions: [`Review ${signal.signalType} signal from ${signal.source}`, `Assess impact timeline: ${signal.timeline}`],
        });
      } catch (err) {
        // skip duplicates
      }
    }
  }

  async runIngestionCycle(organizationId: string): Promise<{ signals: number; alerts: number; detections: number }> {
    console.log('📡 Running live signal ingestion cycle...');

    // ── Fetch RSS + all quantitative sources in parallel ───────────────────────
    const [
      rssSignals,
      cisaSignals,
      fredSignals,
      fdaSignals,
      edgarSignals,
      internalSignals,
      calendarSignals,
      ofacSignals,
      gdeltSignals,
      fedRegSignals,
      nvdSignals,
      noaaFemaSignals,
      congressSignals,
      ftcSignals,
      cfpbSignals,
      arXivSignals,
    ] = await Promise.allSettled([
      this.ingestAllFeeds(),
      fetchCISAKEVSignals().then(s => {
        signalSourceRegistry.recordFetch('cisa_kev', s.length, true);
        return s;
      }).catch(() => { signalSourceRegistry.recordFetch('cisa_kev', 0, false); return []; }),
      fetchFREDSignals().then(s => {
        signalSourceRegistry.recordFetch('fred_economic', s.length, true);
        return s;
      }).catch(() => { signalSourceRegistry.recordFetch('fred_economic', 0, false); return []; }),
      fetchOpenFDASignals().then(s => {
        signalSourceRegistry.recordFetch('openfda_recalls', s.length, true);
        return s;
      }).catch(() => { signalSourceRegistry.recordFetch('openfda_recalls', 0, false); return []; }),
      fetchSECEdgarSignals().then(s => {
        signalSourceRegistry.recordFetch('sec_edgar_structured', s.length, true);
        return s;
      }).catch(() => { signalSourceRegistry.recordFetch('sec_edgar_structured', 0, false); return []; }),
      fetchInternalReadinessSignals(organizationId).then(s => {
        signalSourceRegistry.recordFetch('internal_readiness', s.length, true);
        return s;
      }).catch(() => { signalSourceRegistry.recordFetch('internal_readiness', 0, false); return []; }),
      fetchRegulatoryCalendarSignals().then(s => {
        signalSourceRegistry.recordFetch('regulatory_calendar', s.length, true);
        return s;
      }).catch(() => { signalSourceRegistry.recordFetch('regulatory_calendar', 0, false); return []; }),
      fetchOFACSDNSignals().then(s => {
        signalSourceRegistry.recordFetch('ofac_bis', s.length, true);
        return s;
      }).catch(() => { signalSourceRegistry.recordFetch('ofac_bis', 0, false); return []; }),
      fetchGDELTSignals().then(s => {
        signalSourceRegistry.recordFetch('gdelt_events', s.length, true);
        return s;
      }).catch(() => { signalSourceRegistry.recordFetch('gdelt_events', 0, false); return []; }),
      fetchFederalRegisterSignals().then(s => {
        signalSourceRegistry.recordFetch('federal_register', s.length, true);
        return s;
      }).catch(() => { signalSourceRegistry.recordFetch('federal_register', 0, false); return []; }),
      fetchNISTNVDSignals().then(s => {
        signalSourceRegistry.recordFetch('nist_nvd', s.length, true);
        return s;
      }).catch(() => { signalSourceRegistry.recordFetch('nist_nvd', 0, false); return []; }),
      fetchNOAAFEMASignals().then(s => {
        signalSourceRegistry.recordFetch('noaa_fema', s.length, true);
        return s;
      }).catch(() => { signalSourceRegistry.recordFetch('noaa_fema', 0, false); return []; }),
      fetchCongressSignals().then(s => {
        signalSourceRegistry.recordFetch('congress_gov', s.length, true);
        return s;
      }).catch(() => { signalSourceRegistry.recordFetch('congress_gov', 0, false); return []; }),
      fetchFTCEnforcementSignals().then(s => {
        signalSourceRegistry.recordFetch('ftc_enforcement', s.length, true);
        return s;
      }).catch(() => { signalSourceRegistry.recordFetch('ftc_enforcement', 0, false); return []; }),
      fetchCFPBComplaintSignals().then(s => {
        signalSourceRegistry.recordFetch('cfpb_complaints', s.length, true);
        return s;
      }).catch(() => { signalSourceRegistry.recordFetch('cfpb_complaints', 0, false); return []; }),
      fetchArXivVelocitySignals().then(s => {
        signalSourceRegistry.recordFetch('arxiv_velocity', s.length, true);
        return s;
      }).catch(() => { signalSourceRegistry.recordFetch('arxiv_velocity', 0, false); return []; }),
    ]);

    const rss = rssSignals.status === 'fulfilled' ? rssSignals.value : [];
    signalSourceRegistry.recordFetch('rss_feeds', rss.length, rssSignals.status === 'fulfilled');

    // Merge all signal sources — quantitative signals are already AnalyzedSignal-compatible
    const quantitative = [
      ...(cisaSignals.status === 'fulfilled' ? cisaSignals.value : []),
      ...(fredSignals.status === 'fulfilled' ? fredSignals.value : []),
      ...(fdaSignals.status === 'fulfilled' ? fdaSignals.value : []),
      ...(edgarSignals.status === 'fulfilled' ? edgarSignals.value : []),
      ...(internalSignals.status === 'fulfilled' ? internalSignals.value : []),
      ...(calendarSignals.status === 'fulfilled' ? calendarSignals.value : []),
      ...(ofacSignals.status === 'fulfilled' ? ofacSignals.value : []),
      ...(gdeltSignals.status === 'fulfilled' ? gdeltSignals.value : []),
      ...(fedRegSignals.status === 'fulfilled' ? fedRegSignals.value : []),
      ...(nvdSignals.status === 'fulfilled' ? nvdSignals.value : []),
      ...(noaaFemaSignals.status === 'fulfilled' ? noaaFemaSignals.value : []),
      ...(congressSignals.status === 'fulfilled' ? congressSignals.value : []),
      ...(ftcSignals.status === 'fulfilled' ? ftcSignals.value : []),
      ...(cfpbSignals.status === 'fulfilled' ? cfpbSignals.value : []),
      ...(arXivSignals.status === 'fulfilled' ? arXivSignals.value : []),
    ] as AnalyzedSignal[];

    const signals = [...rss, ...quantitative];

    const qSummary = [
      cisaSignals.status === 'fulfilled' && cisaSignals.value.length ? `CISA:${cisaSignals.value.length}` : null,
      fredSignals.status === 'fulfilled' && fredSignals.value.length ? `FRED:${fredSignals.value.length}` : null,
      fdaSignals.status === 'fulfilled' && fdaSignals.value.length ? `FDA:${fdaSignals.value.length}` : null,
      edgarSignals.status === 'fulfilled' && edgarSignals.value.length ? `EDGAR:${edgarSignals.value.length}` : null,
      nvdSignals.status === 'fulfilled' && nvdSignals.value.length ? `NVD:${nvdSignals.value.length}` : null,
      ofacSignals.status === 'fulfilled' && ofacSignals.value.length ? `OFAC:${ofacSignals.value.length}` : null,
      gdeltSignals.status === 'fulfilled' && gdeltSignals.value.length ? `NewsVelocity:${gdeltSignals.value.length}` : null,
      fedRegSignals.status === 'fulfilled' && fedRegSignals.value.length ? `FedReg:${fedRegSignals.value.length}` : null,
      noaaFemaSignals.status === 'fulfilled' && noaaFemaSignals.value.length ? `NOAA/FEMA:${noaaFemaSignals.value.length}` : null,
      ftcSignals.status === 'fulfilled' && ftcSignals.value.length ? `FTC:${ftcSignals.value.length}` : null,
      cfpbSignals.status === 'fulfilled' && cfpbSignals.value.length ? `CFPB:${cfpbSignals.value.length}` : null,
      congressSignals.status === 'fulfilled' && congressSignals.value.length ? `Congress:${congressSignals.value.length}` : null,
      internalSignals.status === 'fulfilled' && internalSignals.value.length ? `Internal:${internalSignals.value.length}` : null,
      calendarSignals.status === 'fulfilled' && calendarSignals.value.length ? `Calendar:${calendarSignals.value.length}` : null,
      arXivSignals.status === 'fulfilled' && arXivSignals.value.length ? `arXiv:${arXivSignals.value.length}` : null,
    ].filter(Boolean).join(' ');

    console.log(`   RSS: ${rss.length} signals from ${RSS_FEEDS.length} feeds | Quantitative: ${quantitative.length}${qSummary ? ` (${qSummary})` : ''} | Total: ${signals.length}`);

    if (signals.length === 0) return { signals: 0, alerts: 0, detections: 0 };

    const inserted = await this.persistSignals(signals, organizationId);
    await this.generateAlerts(signals, organizationId);
    const alertCount = signals.filter(s => s.impact === 'critical' || s.impact === 'high').length;

    // ── Tier 5: evaluate signals against trigger patterns ──────────────────
    // Must complete first — Tiers 6/7/8 are independent of its return value.
    const detections = await evaluateAndPersistSignals(signals, organizationId);

    // ── Tiers 6 / 7 / 8: run in parallel — none depends on the others ─────
    const [t6Result, , t8Result] = await Promise.allSettled([

      // Tier 6: leading indicator convergence scoring
      evaluateLeadingIndicators(signals, organizationId),

      // Tier 7: compound sub-threshold pattern detection
      evaluateCompoundPatterns(signals, organizationId),

      // Tier 8: preparation signal monitoring
      // Treats declining organizational preparedness as a trigger in its own right.
      (async () => {
        const { checkPreparationSignals } = await import('./PreparationSignalService.js');
        return checkPreparationSignals(organizationId);
      })(),
    ]);

    if (t6Result.status === 'fulfilled' && t6Result.value > 0) {
      console.log(`   🔮 ${t6Result.value} developing situation(s) detected via leading indicators`);
    }
    if (t8Result.status === 'fulfilled') {
      const prepFired = (t8Result.value as any[]).filter((r: any) => r.triggered).length;
      if (prepFired > 0) {
        console.log(`   🔴 ${prepFired} preparation gap trigger(s) fired — readiness recovery protocols queued`);
      }
    } else if (t8Result.status === 'rejected') {
      console.error('   [Tier 8] Preparation signal check failed:', t8Result.reason);
    }

    console.log(`   ✅ Persisted ${inserted} signals, ${Math.min(alertCount, 3)} alerts, ${detections} trigger detections`);

    // ── Multi-org evaluation: run trigger detection for every org that has
    //    a signal_monitoring_config entry OR has at least one registered user.
    //    Signal fetch is shared — only evaluation runs per-org.
    try {
      const { signalMonitoringConfig, users } = await import('@shared/schema');
      const { ne, isNotNull } = await import('drizzle-orm');

      // Orgs with explicit monitoring config
      const configuredOrgs = await db
        .select({ orgId: signalMonitoringConfig.organizationId })
        .from(signalMonitoringConfig)
        .where(ne(signalMonitoringConfig.organizationId, organizationId));

      // Orgs that have at least one registered user (Founding Partners, real customers)
      const userOrgs = await db
        .selectDistinct({ orgId: users.organizationId })
        .from(users)
        .where(isNotNull(users.organizationId));

      // Merge, deduplicate, exclude the primary org (already evaluated above)
      const allOrgIds = new Set([
        ...configuredOrgs.map(r => r.orgId),
        ...userOrgs.map(r => r.orgId).filter(Boolean) as string[],
      ]);
      allOrgIds.delete(organizationId);

      for (const orgId of allOrgIds) {
        try {
          const extraDetections = await evaluateAndPersistSignals(signals, orgId!);
          if (extraDetections > 0) {
            console.log(`   🎯 ${extraDetections} trigger detection(s) for org ${orgId}`);
          }
        } catch {
          // Never let one org's evaluation block others
        }
      }
    } catch {
      // Schema import failure is non-fatal
    }

    return { signals: inserted, alerts: Math.min(alertCount, 3), detections };
  }

  start(organizationId: string, intervalMinutes: number = 15): void {
    if (this.isRunning) return;
    this.isRunning = true;

    console.log(`📡 Live Signal Ingestion started (every ${intervalMinutes} min)`);

    this.runIngestionCycle(organizationId).catch(err =>
      console.error('Initial ingestion cycle failed:', err)
    );

    this.intervalId = setInterval(() => {
      this.runIngestionCycle(organizationId).catch(err =>
        console.error('Ingestion cycle failed:', err)
      );
    }, intervalMinutes * 60 * 1000);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('📡 Live Signal Ingestion stopped');
  }

  getStatus(): { running: boolean; feedCount: number; cachedUrls: number; sourceSummary: ReturnType<typeof signalSourceRegistry.getSummary> } {
    return {
      running: this.isRunning,
      feedCount: RSS_FEEDS.length,
      cachedUrls: this.lastFetchedUrls.size,
      sourceSummary: signalSourceRegistry.getSummary(),
    };
  }
}

export const liveSignalIngestionService = new LiveSignalIngestionService();

export function getFeedCatalog(): { source: string; category: string; url: string }[] {
  return RSS_FEEDS.map(f => ({ source: f.source, category: f.category, url: f.url }));
}
