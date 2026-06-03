import { db } from '../db.js';
import { triggerDetections, stakeholderContacts, signalMonitoringConfig, executionTimelines, signalActivityLog } from '@shared/schema';
import { eq, desc, and, gte } from 'drizzle-orm';
import { Resend } from 'resend';
import { wsService } from './WebSocketService';
import { evaluateSignalsWithOrgTriggers } from './TriggerEvaluationEngine.js';

// Evaluation mode options:
//   'configured' — customer's configured triggers only (new engine)
//   'default'    — original 16-pattern keyword scoring only (legacy engine)
//   'both'       — run both engines, merge and deduplicate by trigger name
type EvaluationMode = 'configured' | 'default' | 'both';

interface OrgConfig {
  mode: EvaluationMode;
  watchPct: number;
  awarePct: number;
  actionPct: number;
}

async function getOrgConfig(organizationId: string): Promise<OrgConfig> {
  const defaults: OrgConfig = { mode: 'both', watchPct: 50, awarePct: 70, actionPct: 80 };
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(organizationId)) {
    return { ...defaults, mode: 'default' };
  }
  try {
    const [config] = await db
      .select()
      .from(signalMonitoringConfig)
      .where(eq(signalMonitoringConfig.organizationId, organizationId as any))
      .limit(1);
    const rawMode = (config?.evaluationMode as EvaluationMode) || 'both';
    return {
      mode: ['configured', 'default', 'both'].includes(rawMode) ? rawMode : 'both',
      watchPct:  config?.watchThresholdPct  ?? 50,
      awarePct:  config?.awareThresholdPct  ?? 70,
      actionPct: config?.actionThresholdPct ?? 80,
    };
  } catch {
    return defaults;
  }
}

// ─── Domain trigger keyword maps ─────────────────────────────────────────────
// Each domain has primary keywords + recommended prepared response + severity weight

interface TriggerPattern {
  name: string;
  domain: string;
  keywords: string[];
  playbookName: string;       // primary recommendation
  alternatePlaybooks: string[]; // secondary options presented to approver
  baseConfidence: number;
}

const TRIGGER_PATTERNS: TriggerPattern[] = [
  // Market Dynamics
  {
    name: 'Competitive Market Entry',
    domain: 'Market Dynamics',
    keywords: ['competitor', 'rival', 'market entry', 'new entrant', 'competing', 'launched', 'expansion', 'competitive threat', 'market share', 'disrupt', 'market leader', 'outcompete', 'price war', 'competitive pressure', 'market position', 'competitive', 'outpaced', 'undercutting', 'market leader', 'beat competitors', 'market competition', 'industry rival', 'competitive landscape'],
    playbookName: 'Competitive Threat Response',
    alternatePlaybooks: ['Investor Communications Protocol', 'Reputational Crisis Protocol'],
    baseConfidence: 70,
  },
  {
    name: 'M&A Activity Detected',
    domain: 'Market Dynamics',
    keywords: ['acquisition', 'merger', 'buyout', 'takeover', 'acquires', 'acquired', 'deal signed', 'consolidation', 'private equity', 'strategic acquisition', 'deal closed', 'billion deal', 'purchase agreement', 'M&A', 'joint venture', 'acquirer', 'merger agreement', 'deal valued', 'deal worth', 'stake acquisition', 'hostile takeover', 'friendly takeover', 'acquire', 'acquired by', 'bought by', 'purchase of'],
    playbookName: 'M&A Response Prepared response',
    alternatePlaybooks: ['Investor Communications Protocol', 'Competitive Threat Response'],
    baseConfidence: 75,
  },
  {
    name: 'Market Valuation Shift',
    domain: 'Market Dynamics',
    keywords: ['valuation', 'IPO', 'stock price', 'market cap', 'earnings miss', 'guidance cut', 'revenue decline', 'profit warning', 'downgrade', 'sell-off', 'quarterly results', 'analyst downgrade', 'stock decline', 'market correction', 'investor concern'],
    playbookName: 'Investor Communications Protocol',
    alternatePlaybooks: ['Financial Crisis Response', 'Reputational Crisis Protocol'],
    baseConfidence: 65,
  },

  // Regulatory & Compliance
  {
    name: 'Regulatory Enforcement Action',
    domain: 'Regulatory & Compliance',
    keywords: ['SEC', 'FTC', 'DOJ', 'enforcement', 'investigation', 'fine', 'penalty', 'sanction', 'antitrust', 'subpoena', 'consent decree', 'regulatory action', 'regulator', 'probe', 'lawsuit filed', 'class action', 'compliance failure'],
    playbookName: 'Regulatory Compliance Sprint',
    alternatePlaybooks: ['Regulatory Disclosure Protocol', 'Reputational Crisis Protocol'],
    baseConfidence: 80,
  },
  {
    name: 'Legislation Change',
    domain: 'Regulatory & Compliance',
    keywords: ['new regulation', 'legislation', 'compliance deadline', 'regulatory change', 'rule change', 'policy shift', 'mandate', 'data privacy', 'GDPR', 'CCPA', 'executive order', 'new law', 'compliance requirement', 'regulatory framework', 'federal rule'],
    playbookName: 'Regulatory Compliance Sprint',
    alternatePlaybooks: ['ESG Crisis Response', 'Regulatory Disclosure Protocol'],
    baseConfidence: 70,
  },
  {
    name: '8-K Material Event Filing',
    domain: 'Regulatory & Compliance',
    keywords: ['8-K', 'material event', 'form 8-K', 'SEC filing', 'material change', 'reportable event', 'current report', 'material disclosure', 'securities filing', 'filed with the SEC', 'SEC report', '8K filing', 'material event disclosure', 'regulatory filing', 'securities disclosure', 'public company filing'],
    playbookName: 'Regulatory Disclosure Protocol',
    alternatePlaybooks: ['Investor Communications Protocol', 'Regulatory Compliance Sprint'],
    baseConfidence: 85,
  },

  // Technology & Security
  {
    name: 'Cybersecurity Breach Signal',
    domain: 'Technology & Security',
    keywords: ['data breach', 'cyberattack', 'ransomware', 'hack', 'hacked', 'security incident', 'vulnerability', 'zero-day', 'phishing', 'malware', 'data leak', 'cyber incident', 'systems compromised', 'cyber attack', 'data stolen', 'unauthorized access', 'breach', 'cyber', 'hacker', 'hackers', 'stolen data', 'compromised', 'intrusion', 'network breach', 'security breach', 'attack on', 'attacked', 'cybercriminals', 'data exposed', 'personal data', 'credentials stolen'],
    playbookName: 'Cybersecurity Breach Response',
    alternatePlaybooks: ['Reputational Crisis Protocol', 'Regulatory Disclosure Protocol'],
    baseConfidence: 85,
  },
  {
    name: 'AI Disruption Signal',
    domain: 'Technology & Security',
    keywords: ['artificial intelligence', 'AI model', 'generative AI', 'automation', 'AI disruption', 'large language model', 'GPT', 'AI launch', 'AI competitor', 'machine learning', 'ChatGPT', 'AI investment', 'workforce automation', 'AI regulation', 'tech disruption', 'AI funding'],
    playbookName: 'Technology Disruption Response',
    alternatePlaybooks: ['Competitive Threat Response', 'Investor Communications Protocol'],
    baseConfidence: 62,
  },

  // Supply Chain & Operations
  {
    name: 'Supply Chain Disruption',
    domain: 'Supply Chain & Operations',
    keywords: ['supply chain', 'shortage', 'logistics disruption', 'shipping delay', 'port strike', 'tariff', 'trade war', 'embargo', 'supplier failure', 'procurement crisis', 'supply shortage', 'inventory shortage', 'shipping crisis', 'disrupted supply', 'sourcing issue'],
    playbookName: 'Supply Chain Disruption Protocol',
    alternatePlaybooks: ['Operational Crisis Response', 'Geopolitical Risk Response'],
    baseConfidence: 75,
  },
  {
    name: 'Operational Crisis',
    domain: 'Supply Chain & Operations',
    keywords: ['plant shutdown', 'factory fire', 'operational failure', 'production halt', 'recall', 'product defect', 'quality crisis', 'manufacturing issue', 'facility closure', 'operations disrupted', 'product recall', 'safety recall', 'production stopped'],
    playbookName: 'Operational Crisis Response',
    alternatePlaybooks: ['Supply Chain Disruption Protocol', 'Reputational Crisis Protocol'],
    baseConfidence: 80,
  },

  // Brand & Reputation
  {
    name: 'Reputational Crisis Signal',
    domain: 'Brand & Reputation',
    keywords: ['controversy', 'scandal', 'backlash', 'social media crisis', 'viral', 'boycott', 'protest', 'PR crisis', 'reputational damage', 'public outcry', 'brand damage', 'criticism', 'public backlash', 'brand crisis', 'negative coverage', 'media scrutiny'],
    playbookName: 'Reputational Crisis Protocol',
    alternatePlaybooks: ['Executive Leadership Crisis', 'ESG Crisis Response'],
    baseConfidence: 70,
  },
  {
    name: 'Executive Leadership Event',
    domain: 'Brand & Reputation',
    keywords: ['CEO resigns', 'CFO departure', 'executive fired', 'leadership change', 'board shakeup', 'C-suite', 'management change', 'succession', 'CEO steps down', 'executive departure', 'leadership transition', 'board resignation', 'interim CEO', 'top executive'],
    playbookName: 'Executive Leadership Crisis',
    alternatePlaybooks: ['Investor Communications Protocol', 'Reputational Crisis Protocol'],
    baseConfidence: 75,
  },

  // Financial
  {
    name: 'Financial Distress Signal',
    domain: 'Financial',
    keywords: ['bankruptcy', 'insolvency', 'debt default', 'credit downgrade', 'liquidity crisis', 'cash crunch', 'chapter 11', 'restructuring', 'financial distress', 'debt crisis', 'loan default', 'credit rating cut', 'financial trouble', 'cash flow crisis'],
    playbookName: 'Financial Crisis Response',
    alternatePlaybooks: ['Investor Communications Protocol', 'Regulatory Disclosure Protocol'],
    baseConfidence: 85,
  },
  {
    name: 'Earnings Surprise',
    domain: 'Financial',
    keywords: ['earnings beat', 'earnings miss', 'revenue surprise', 'profit warning', 'earnings guidance', 'quarterly results', 'financial results', 'beat estimates', 'missed estimates', 'revenue growth', 'profit decline', 'Q1 results', 'Q2 results', 'Q3 results', 'Q4 results', 'annual results', 'fiscal year', 'shares fell', 'stock fell', 'stock dropped', 'shares dropped', 'revenue fell', 'beat expectations', 'missed expectations', 'earnings report', 'quarterly earnings', 'profit fell', 'net income', 'revenue declined', 'EPS', 'earnings per share', 'profit rose', 'revenue rose'],
    playbookName: 'Investor Communications Protocol',
    alternatePlaybooks: ['Financial Crisis Response', 'Reputational Crisis Protocol'],
    baseConfidence: 65,
  },

  // ESG
  {
    name: 'ESG / Climate Event',
    domain: 'ESG & Sustainability',
    keywords: ['ESG', 'climate', 'sustainability', 'carbon', 'emissions', 'greenwashing', 'environmental violation', 'climate risk', 'net zero', 'DEI controversy', 'climate change', 'renewable energy', 'carbon neutral', 'environmental impact', 'social responsibility', 'diversity controversy', 'green energy', 'fossil fuels', 'carbon footprint', 'clean energy', 'sustainable', 'climate crisis', 'environmental', 'emission targets', 'Paris Agreement', 'carbon tax', 'DEI', 'diversity'],
    playbookName: 'ESG Crisis Response',
    alternatePlaybooks: ['Reputational Crisis Protocol', 'Regulatory Compliance Sprint'],
    baseConfidence: 65,
  },

  // Geopolitical
  {
    name: 'Geopolitical Risk Signal',
    domain: 'Geopolitical',
    keywords: ['sanctions', 'trade war', 'tariff', 'tariffs', 'geopolitical', 'conflict', 'war', 'political instability', 'export control', 'national security', 'government shutdown', 'tariffs imposed', 'trade policy', 'economic sanctions', 'diplomatic crisis', 'military conflict', 'trade restrictions', 'Iran', 'military', 'diplomatic', 'Middle East', 'NATO', 'nuclear', 'oil prices', 'crude oil', 'peace talks', 'ceasefire', 'embargo', 'military strike', 'weapons', 'armed conflict', 'foreign policy', 'global tensions', 'Trump tariff', 'import duties', 'trade deal', 'export ban'],
    playbookName: 'Geopolitical Risk Response',
    alternatePlaybooks: ['Supply Chain Disruption Protocol', 'Operational Crisis Response'],
    baseConfidence: 70,
  },
];

// ─── Evaluation Engine ─────────────────────────────────────────────────────────

export interface DetectedTrigger {
  triggerName: string;
  triggerDomain: string;
  confidenceScore: number;
  recommendedPlaybook: string;      // primary — AI's top recommendation
  alternatePlaybooks: string[];     // secondary options for approver to choose from
  matchedKeywords: string[];
  // Evidence trail — which specific data points caused this trigger to fire
  conditionsMet?: number;           // how many configured conditions were satisfied
  totalConditions?: number;         // total configured conditions that were evaluated
  dataPoints?: string[];            // human-readable labels of the matched data points
  engine?: 'configured' | 'default';
  alertTier?: 'watch' | 'aware' | 'action';
  // watch  = 50% signals — situation developing, heads up
  // aware  = 70% signals — pattern strengthening, monitor closely
  // action = 80%+ signals OR all mandatory data points hit — trigger confirmed, execute
}

export interface AnalyzedSignal {
  signalType: string;
  description: string;
  confidence: number;
  impact: string;
  timeline: string;
  source: string;
  sourceUrl: string;
  category: string;
}

function scoreSignalAgainstPattern(signal: AnalyzedSignal, pattern: TriggerPattern): number {
  const text = signal.description.toLowerCase();
  const matched = pattern.keywords.filter(kw => text.includes(kw.toLowerCase()));
  if (matched.length === 0) return 0;

  // Base score from keyword density
  const density = matched.length / pattern.keywords.length;
  let score = pattern.baseConfidence + density * 20;

  // Boost from signal confidence (it's already 50-95)
  score += (signal.confidence - 50) * 0.3;

  // Boost for high/critical impact
  if (signal.impact === 'critical') score += 10;
  if (signal.impact === 'high') score += 5;

  // SEC EDGAR signals get a credibility boost on regulatory triggers
  if (signal.source.includes('SEC') && pattern.domain === 'Regulatory & Compliance') score += 10;

  return Math.min(Math.round(score), 97);
}

export function evaluateSignal(
  signal: AnalyzedSignal,
  thresholds?: { watchPct?: number; awarePct?: number; actionPct?: number }
): DetectedTrigger[] {
  const detections: DetectedTrigger[] = [];

  // Three-tier alert system — uses absolute keyword match counts, not density percentages.
  // RSS feed article descriptions are short; requiring 50% of a 35-keyword pattern
  // would need 18 matches in one headline — structurally impossible.
  // Instead: require a minimum number of absolute keyword hits per tier.
  //   WATCH  ≥ 2 keyword matches — "Situation developing"
  //   AWARE  ≥ 4 keyword matches — "Pattern strengthening"
  //   ACTION ≥ 6 keyword matches — "Trigger confirmed, execute now"
  // Score thresholds still apply as a secondary gate.
  const WATCH_SCORE   = 55;  const WATCH_MIN_KW  = 2;
  const AWARE_SCORE   = 70;  const AWARE_MIN_KW  = 4;
  const ACTION_SCORE  = 82;  const ACTION_MIN_KW = 6;

  for (const pattern of TRIGGER_PATTERNS) {
    const text = signal.description.toLowerCase();
    const matchedKeywords = pattern.keywords.filter(kw => text.includes(kw.toLowerCase()));

    // Require at least 2 keyword matches — single-word coincidences are noise
    if (matchedKeywords.length < WATCH_MIN_KW) continue;

    const confidenceScore = scoreSignalAgainstPattern(signal, pattern);
    if (confidenceScore < WATCH_SCORE) continue;

    // Classify into tier by absolute keyword count + confidence score
    let alertTier: 'watch' | 'aware' | 'action';
    if (confidenceScore >= ACTION_SCORE && matchedKeywords.length >= ACTION_MIN_KW) {
      alertTier = 'action';
    } else if (confidenceScore >= AWARE_SCORE && matchedKeywords.length >= AWARE_MIN_KW) {
      alertTier = 'aware';
    } else {
      alertTier = 'watch';
    }

    detections.push({
      triggerName: pattern.name,
      triggerDomain: pattern.domain,
      confidenceScore,
      recommendedPlaybook: pattern.playbookName,
      alternatePlaybooks: pattern.alternatePlaybooks,
      matchedKeywords,
      conditionsMet: matchedKeywords.length,
      totalConditions: pattern.keywords.length,
      dataPoints: matchedKeywords.map(kw => `Keyword signal: "${kw}"`),
      engine: 'default',
      alertTier,
    });
  }

  // Return top 1 detection per signal — highest confidence only.
  return detections.sort((a, b) => b.confidenceScore - a.confidenceScore).slice(0, 1);
}

// ─── Persistence + Notification ──────────────────────────────────────────────

async function sendDetectionEmail(
  detection: DetectedTrigger,
  signal: AnalyzedSignal,
  emails: string[],
  orgId: string
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY || process.env.Resend_API_Key;
  if (!apiKey || emails.length === 0) return false;

  const resend = new Resend(apiKey);
  const platformUrl = process.env.APP_URL || 'https://vaughnmartin.com';
  const sourceLink = signal.sourceUrl ? `<a href="${signal.sourceUrl}" style="color:#C9A84C;">${signal.source}</a>` : signal.source;

  const html = `
    <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background:#f8f7f4;padding:40px 0;">
      <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e8e4dc;">
        <div style="background:#132558;padding:32px 36px;">
          <div style="color:#C9A84C;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Readiness OS · Live Detection Alert</div>
          <div style="color:#ffffff;font-size:22px;font-weight:700;line-height:1.3;">Strategic Trigger Detected</div>
        </div>
        <div style="padding:32px 36px;">
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#666;font-size:13px;width:40%;">Trigger</td>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#0A0F2E;font-size:13px;font-weight:600;">${detection.triggerName}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#666;font-size:13px;">Domain</td>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#0A0F2E;font-size:13px;">${detection.triggerDomain}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#666;font-size:13px;">Confidence</td>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#2B8A6E;font-size:13px;font-weight:700;">${detection.confidenceScore}%</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#666;font-size:13px;">Signal Source</td>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;font-size:13px;">${sourceLink}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#666;font-size:13px;">Primary Recommendation</td>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;font-size:13px;">
                <span style="color:#0A0F2E;font-weight:700;">${detection.recommendedPlaybook}</span>
                <span style="display:inline-block;margin-left:6px;background:#2B8A6E20;color:#2B8A6E;font-size:9px;font-weight:700;padding:2px 6px;letter-spacing:0.1em;text-transform:uppercase;">System-Staged</span>
              </td>
            </tr>
            ${detection.alternatePlaybooks.length > 0 ? `
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#666;font-size:13px;">Also Consider</td>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;font-size:13px;color:#6B7280;">
                ${detection.alternatePlaybooks.join(' &nbsp;·&nbsp; ')}
              </td>
            </tr>` : ''}
          </table>
          ${(detection.dataPoints && detection.dataPoints.length > 0) ? `
          <div style="background:#0A0F2E08;border:1px solid #0A0F2E18;border-radius:6px;padding:16px 20px;margin-bottom:20px;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
              <div style="color:#0A0F2E;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;">
                Why This Trigger Fired
              </div>
              <span style="background:#2B8A6E;color:#fff;font-size:9px;font-weight:700;padding:3px 8px;border-radius:3px;letter-spacing:0.5px;">${detection.conditionsMet ?? detection.matchedKeywords.length} of ${detection.totalConditions ?? detection.matchedKeywords.length} KEYWORDS MATCHED</span>
            </div>
            <div style="margin-bottom:14px;">
              <div style="font-size:10px;color:#666;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Matched terms in source signal</div>
              <div style="display:flex;flex-wrap:wrap;gap:6px;">
                ${detection.matchedKeywords.map(kw => `<span style="display:inline-block;background:#2B8A6E15;border:1px solid #2B8A6E40;color:#1a6b52;font-size:12px;font-weight:600;padding:4px 10px;border-radius:4px;">${kw}</span>`).join('')}
              </div>
            </div>
            <div style="padding:10px 14px;background:#fff;border-radius:4px;border-left:3px solid #0A0F2E30;">
              <div style="font-size:10px;color:#666;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Pattern matched</div>
              <div style="font-size:12px;color:#0A0F2E;font-weight:600;">${detection.triggerName} — ${detection.triggerDomain} domain · ${detection.confidenceScore}% confidence</div>
            </div>
          </div>` : ''}
          <div style="background:#f0ede4;border-left:3px solid #C9A84C;padding:16px 20px;border-radius:4px;margin-bottom:28px;">
            <div style="color:#666;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Source Signal</div>
            <div style="color:#0A0F2E;font-size:14px;line-height:1.5;">${signal.description.substring(0, 300)}${signal.description.length > 300 ? '…' : ''}</div>
          </div>
          <div style="text-align:center;margin-bottom:12px;">
            <a href="${platformUrl}/live-detection-feed?trigger=${encodeURIComponent(detection.triggerName)}&playbook=${encodeURIComponent(detection.recommendedPlaybook)}&domain=${encodeURIComponent(detection.triggerDomain)}" style="display:inline-block;background:#132558;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:14px;font-weight:600;letter-spacing:0.5px;margin-bottom:12px;">Review Live Detection →</a>
          </div>
          <div style="text-align:center;">
            <a href="${platformUrl}/live-activation-center?playbookName=${encodeURIComponent(detection.recommendedPlaybook)}&domain=${encodeURIComponent(detection.triggerDomain)}" style="display:inline-block;background:#C9A84C;color:#0A0F2E;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:14px;font-weight:700;letter-spacing:0.5px;">Activate: ${detection.recommendedPlaybook} →</a>
          </div>
        </div>
        <div style="background:#f8f7f4;padding:20px 36px;border-top:1px solid #e8e4dc;">
          <div style="color:#999;font-size:11px;text-align:center;">Readiness OS continuously monitors 248+ signals across 9 domains. This alert was generated automatically — no human reviewed it before it reached you.</div>
          <div style="text-align:center;margin-top:10px;"><a href="__UNSUBSCRIBE_URL__" style="color:#ccc;font-size:10px;text-decoration:underline;">Unsubscribe from Readiness OS alerts</a></div>
        </div>
      </div>
    </div>
  `;

  // Try reliable sender first (Resend's own verified domain), fall back to branded domain
  const fromAddresses = [
    'Readiness OS <onboarding@resend.dev>',
    'Readiness OS <pilot@vaughnmartin.com>',
  ];

  let anySent = false;
  for (const recipientEmail of emails) {
    const token = Buffer.from(recipientEmail).toString('base64url');
    const personalizedHtml = html.replace('__UNSUBSCRIBE_URL__', `${platformUrl}/api/unsubscribe?t=${token}`);
    let sent = false;
    for (const from of fromAddresses) {
      try {
        const { error } = await resend.emails.send({
          from,
          replyTo: 'pilot@vaughnmartin.com',
          to: [recipientEmail],
          subject: `🔴 Trigger Detected: ${detection.triggerName} (${detection.confidenceScore}% confidence)`,
          html: personalizedHtml,
        });
        if (error) {
          console.warn(`⚠ Detection email sender ${from} rejected (${error.message}) — trying next`);
          continue;
        }
        sent = true;
        anySent = true;
        break;
      } catch (err: any) {
        console.warn(`⚠ Detection email sender ${from} threw: ${err.message} — trying next`);
      }
    }
    if (!sent) console.error(`✗ All senders failed for detection alert to ${recipientEmail}`);
  }
  if (anySent) console.log(`📧 Detection alert sent to ${emails.join(', ')}`);
  return anySent;
}

async function sendWatchEmail(
  detection: DetectedTrigger,
  signal: AnalyzedSignal,
  emails: string[],
  orgId: string
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY || process.env.Resend_API_Key;
  if (!apiKey || emails.length === 0) return false;

  const resend = new Resend(apiKey);
  const platformUrl = process.env.APP_URL || 'https://vaughnmartin.com';
  const sourceLink = signal.sourceUrl ? `<a href="${signal.sourceUrl}" style="color:#C9A84C;">${signal.source}</a>` : signal.source;

  const html = `
    <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background:#f8f7f4;padding:40px 0;">
      <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e8e4dc;">
        <div style="background:#7a5c1a;padding:32px 36px;">
          <div style="color:#f5d98a;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Readiness OS · Signal Watch Alert</div>
          <div style="color:#ffffff;font-size:22px;font-weight:700;line-height:1.3;">Situation Developing — No Action Required Yet</div>
          <div style="color:#f5d98a;font-size:13px;margin-top:8px;">Monitor this signal. If it strengthens, a protocol will be staged automatically.</div>
        </div>
        <div style="padding:32px 36px;">
          <div style="background:#fffbf0;border:1px solid #C9A84C40;border-left:3px solid #C9A84C;border-radius:4px;padding:14px 18px;margin-bottom:24px;">
            <div style="color:#7a5c1a;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">⚠ Watch — Not Yet an Execution Trigger</div>
            <div style="color:#5c4010;font-size:13px;line-height:1.5;">This signal matches a monitored pattern but has not crossed the threshold for confirmed execution. It may escalate — or resolve on its own. No protocol activation is required at this time.</div>
          </div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#666;font-size:13px;width:40%;">Pattern</td>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#0A0F2E;font-size:13px;font-weight:600;">${detection.triggerName}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#666;font-size:13px;">Domain</td>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#0A0F2E;font-size:13px;">${detection.triggerDomain}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#666;font-size:13px;">Signal Strength</td>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#7a5c1a;font-size:13px;font-weight:700;">${detection.confidenceScore}% — below execution threshold</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#666;font-size:13px;">Signals Matched</td>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#0A0F2E;font-size:13px;">${detection.conditionsMet ?? detection.matchedKeywords.length} of ${detection.totalConditions ?? detection.matchedKeywords.length} monitored indicators</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#666;font-size:13px;">Signal Source</td>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;font-size:13px;">${sourceLink}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#666;font-size:13px;">Protocol Staged</td>
              <td style="padding:10px 0;font-size:13px;">
                <span style="color:#0A0F2E;font-weight:600;">${detection.recommendedPlaybook}</span>
                <span style="display:inline-block;margin-left:6px;background:#C9A84C20;color:#7a5c1a;font-size:9px;font-weight:700;padding:2px 6px;letter-spacing:0.1em;text-transform:uppercase;">Ready if needed</span>
              </td>
            </tr>
          </table>
          ${(detection.matchedKeywords && detection.matchedKeywords.length > 0) ? `
          <div style="background:#fffbf0;border:1px solid #C9A84C30;border-radius:6px;padding:16px 20px;margin-bottom:20px;">
            <div style="color:#7a5c1a;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px;">Indicators detected in source signal</div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;">
              ${detection.matchedKeywords.map(kw => `<span style="display:inline-block;background:#C9A84C15;border:1px solid #C9A84C50;color:#7a5c1a;font-size:12px;font-weight:600;padding:4px 10px;border-radius:4px;">${kw}</span>`).join('')}
            </div>
          </div>` : ''}
          <div style="background:#f0ede4;border-left:3px solid #C9A84C;padding:16px 20px;border-radius:4px;margin-bottom:28px;">
            <div style="color:#666;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Source Signal</div>
            <div style="color:#0A0F2E;font-size:14px;line-height:1.5;">${signal.description.substring(0, 300)}${signal.description.length > 300 ? '…' : ''}</div>
          </div>
          <div style="text-align:center;margin-bottom:12px;">
            <a href="${platformUrl}/live-detection-feed" style="display:inline-block;background:#7a5c1a;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:14px;font-weight:600;letter-spacing:0.5px;">View Signal in Platform →</a>
          </div>
          <div style="text-align:center;color:#999;font-size:12px;margin-top:8px;">If this signal strengthens and crosses the execution threshold, you will receive a separate <strong>Trigger Confirmed</strong> alert.</div>
        </div>
        <div style="background:#f8f7f4;padding:20px 36px;border-top:1px solid #e8e4dc;">
          <div style="color:#999;font-size:11px;text-align:center;">Readiness OS continuously monitors 248+ signals across 9 domains. Watch alerts are informational — no protocol activation is required.</div>
          <div style="text-align:center;margin-top:10px;"><a href="__UNSUBSCRIBE_URL__" style="color:#ccc;font-size:10px;text-decoration:underline;">Unsubscribe from Readiness OS alerts</a></div>
        </div>
      </div>
    </div>
  `;

  const fromAddresses = [
    'Readiness OS <onboarding@resend.dev>',
    'Readiness OS <pilot@vaughnmartin.com>',
  ];

  let anySent = false;
  for (const recipientEmail of emails) {
    const token = Buffer.from(recipientEmail).toString('base64url');
    const personalizedHtml = html.replace('__UNSUBSCRIBE_URL__', `${platformUrl}/api/unsubscribe?t=${token}`);
    let sent = false;
    for (const from of fromAddresses) {
      try {
        const { error } = await resend.emails.send({
          from,
          replyTo: 'pilot@vaughnmartin.com',
          to: [recipientEmail],
          subject: `⚠️ Signal Watch: ${detection.triggerName} — Situation Developing`,
          html: personalizedHtml,
        });
        if (error) {
          console.warn(`⚠ Watch email sender ${from} rejected (${error.message}) — trying next`);
          continue;
        }
        sent = true;
        anySent = true;
        break;
      } catch (err: any) {
        console.warn(`⚠ Watch email sender ${from} threw: ${err.message} — trying next`);
      }
    }
    if (!sent) console.error(`✗ All senders failed for watch alert to ${recipientEmail}`);
  }
  if (anySent) console.log(`📧 Watch alert sent to ${emails.join(', ')}`);
  return anySent;
}

async function sendAwareEmail(
  detection: DetectedTrigger,
  signal: AnalyzedSignal,
  emails: string[],
  orgId: string
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY || process.env.Resend_API_Key;
  if (!apiKey || emails.length === 0) return false;

  const resend = new Resend(apiKey);
  const platformUrl = process.env.APP_URL || 'https://vaughnmartin.com';
  const sourceLink = signal.sourceUrl ? `<a href="${signal.sourceUrl}" style="color:#C9A84C;">${signal.source}</a>` : signal.source;

  const html = `
    <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background:#f8f7f4;padding:40px 0;">
      <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e8e4dc;">
        <div style="background:#7a3c0a;padding:32px 36px;">
          <div style="color:#f5c08a;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Readiness OS · Pattern Awareness Alert</div>
          <div style="color:#ffffff;font-size:22px;font-weight:700;line-height:1.3;">Pattern Strengthening — Monitor Closely</div>
          <div style="color:#f5c08a;font-size:13px;margin-top:8px;">This situation is gaining weight. Verify your protocol is staged and your key contacts are briefed.</div>
        </div>
        <div style="padding:32px 36px;">
          <div style="background:#fff7f0;border:1px solid #d4700040;border-left:3px solid #d47000;border-radius:4px;padding:14px 18px;margin-bottom:24px;">
            <div style="color:#7a3c0a;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">🟠 Be Aware — Not Yet a Confirmed Trigger</div>
            <div style="color:#5c2d00;font-size:13px;line-height:1.5;">Signal strength has crossed 70% of monitored indicators. This is not yet a confirmed execution trigger, but the pattern is strengthening. No protocol activation is required — confirm your prepared response is staged and ready.</div>
          </div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#666;font-size:13px;width:40%;">Pattern</td>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#0A0F2E;font-size:13px;font-weight:600;">${detection.triggerName}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#666;font-size:13px;">Domain</td>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#0A0F2E;font-size:13px;">${detection.triggerDomain}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#666;font-size:13px;">Signal Strength</td>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#7a3c0a;font-size:13px;font-weight:700;">${detection.confidenceScore}% — approaching execution threshold</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#666;font-size:13px;">Indicators Matched</td>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#0A0F2E;font-size:13px;">${detection.conditionsMet ?? detection.matchedKeywords.length} of ${detection.totalConditions ?? detection.matchedKeywords.length} monitored indicators</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#666;font-size:13px;">Signal Source</td>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;font-size:13px;">${sourceLink}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#666;font-size:13px;">Protocol Staged</td>
              <td style="padding:10px 0;font-size:13px;">
                <span style="color:#0A0F2E;font-weight:600;">${detection.recommendedPlaybook}</span>
                <span style="display:inline-block;margin-left:6px;background:#d4700020;color:#7a3c0a;font-size:9px;font-weight:700;padding:2px 6px;letter-spacing:0.1em;text-transform:uppercase;">Confirm ready</span>
              </td>
            </tr>
          </table>
          ${(detection.matchedKeywords && detection.matchedKeywords.length > 0) ? `
          <div style="background:#fff7f0;border:1px solid #d4700030;border-radius:6px;padding:16px 20px;margin-bottom:20px;">
            <div style="color:#7a3c0a;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px;">Indicators detected in source signal</div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;">
              ${detection.matchedKeywords.map(kw => `<span style="display:inline-block;background:#d4700015;border:1px solid #d4700050;color:#7a3c0a;font-size:12px;font-weight:600;padding:4px 10px;border-radius:4px;">${kw}</span>`).join('')}
            </div>
          </div>` : ''}
          <div style="background:#f0ede4;border-left:3px solid #d47000;padding:16px 20px;border-radius:4px;margin-bottom:28px;">
            <div style="color:#666;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Source Signal</div>
            <div style="color:#0A0F2E;font-size:14px;line-height:1.5;">${signal.description.substring(0, 300)}${signal.description.length > 300 ? '…' : ''}</div>
          </div>
          <div style="text-align:center;margin-bottom:12px;">
            <a href="${platformUrl}/live-detection-feed" style="display:inline-block;background:#7a3c0a;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:14px;font-weight:600;letter-spacing:0.5px;">Review Signal in Platform →</a>
          </div>
          <div style="text-align:center;color:#999;font-size:12px;margin-top:8px;">If this reaches 80% of monitored indicators, you will receive a <strong>Trigger Confirmed</strong> alert with full execution authority.</div>
        </div>
        <div style="background:#f8f7f4;padding:20px 36px;border-top:1px solid #e8e4dc;">
          <div style="color:#999;font-size:11px;text-align:center;">Readiness OS continuously monitors 248+ signals across 9 domains. Awareness alerts require no action — verify your protocol staging only.</div>
          <div style="text-align:center;margin-top:10px;"><a href="__UNSUBSCRIBE_URL__" style="color:#ccc;font-size:10px;text-decoration:underline;">Unsubscribe from Readiness OS alerts</a></div>
        </div>
      </div>
    </div>
  `;

  const fromAddresses = [
    'Readiness OS <onboarding@resend.dev>',
    'Readiness OS <pilot@vaughnmartin.com>',
  ];

  let anySent = false;
  for (const recipientEmail of emails) {
    const token = Buffer.from(recipientEmail).toString('base64url');
    const personalizedHtml = html.replace('__UNSUBSCRIBE_URL__', `${platformUrl}/api/unsubscribe?t=${token}`);
    let sent = false;
    for (const from of fromAddresses) {
      try {
        const { error } = await resend.emails.send({
          from,
          replyTo: 'pilot@vaughnmartin.com',
          to: [recipientEmail],
          subject: `🟠 Pattern Awareness: ${detection.triggerName} — Monitor Closely`,
          html: personalizedHtml,
        });
        if (error) {
          console.warn(`⚠ Aware email sender ${from} rejected (${error.message}) — trying next`);
          continue;
        }
        sent = true;
        anySent = true;
        break;
      } catch (err: any) {
        console.warn(`⚠ Aware email sender ${from} threw: ${err.message} — trying next`);
      }
    }
    if (!sent) console.error(`✗ All senders failed for awareness alert to ${recipientEmail}`);
  }
  if (anySent) console.log(`📧 Awareness alert sent to ${emails.join(', ')}`);
  return anySent;
}

async function sendDetectionSlack(detection: DetectedTrigger, signal: AnalyzedSignal): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return;

  const payload = {
    text: `🔴 *Strategic Trigger Detected* — ${detection.triggerName}`,
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: '🔴 Readiness OS: Strategic Trigger Detected' },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Trigger:*\n${detection.triggerName}` },
          { type: 'mrkdwn', text: `*Domain:*\n${detection.triggerDomain}` },
          { type: 'mrkdwn', text: `*Confidence:*\n${detection.confidenceScore}%` },
          { type: 'mrkdwn', text: `*Primary Prepared response:*\n${detection.recommendedPlaybook}` },
          ...(detection.alternatePlaybooks.length > 0 ? [{ type: 'mrkdwn', text: `*Also Consider:*\n${detection.alternatePlaybooks.join(', ')}` }] : []),
        ],
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Signal:* ${signal.description.substring(0, 200)}${signal.description.length > 200 ? '…' : ''}\n*Source:* ${signal.source}`,
        },
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: 'Review Live Detection →' },
            url: `${process.env.APP_URL || 'https://vaughnmartin.com'}/live-detection-feed`,
            style: 'primary',
          },
        ],
      },
    ],
  };

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    console.log(`📲 Detection Slack alert sent`);
  } catch (err) {
    console.error('Detection Slack alert failed:', err);
  }
}

// ─── Main evaluation + persistence function ───────────────────────────────────

export async function evaluateAndPersistSignals(
  signals: AnalyzedSignal[],
  organizationId: string
): Promise<number> {
  let detectionsCreated = 0;

  // Get stakeholder contacts for this org — used for domain-specific approver routing
  let allContacts: { email: string | null; triggerDomains: string[] | null; isActive: boolean | null }[] = [];
  try {
    allContacts = await db
      .select()
      .from(stakeholderContacts)
      .where(eq(stakeholderContacts.organizationId, organizationId as any));
  } catch {
    // table may not exist yet on first run
  }

  // If no stakeholder contacts are configured, fall back to registered org members
  // This ensures Founding Partners and any org with users always receive alerts
  if (allContacts.length === 0) {
    try {
      const { users } = await import('@shared/schema');
      const { isNotNull, eq: eqUsers } = await import('drizzle-orm');
      const orgMembers = await db
        .select({ email: users.email })
        .from(users)
        .where(eqUsers(users.organizationId as any, organizationId as any));
      allContacts = orgMembers
        .filter(m => m.email)
        .map(m => ({ email: m.email, triggerDomains: null, isActive: true }));
      if (allContacts.length > 0) {
        console.log(`📋 Using ${allContacts.length} registered org member(s) as alert recipients for org ${organizationId}`);
      }
    } catch { /* non-critical */ }
  }

  // ── EVALUATION PATH ────────────────────────────────────────────────────────
  // Mode is set per-org in signal_monitoring_config.evaluation_mode:
  //
  //   'configured' — only fire triggers the org has configured (new engine)
  //                  Triggers fire when the customer's own thresholds are met.
  //                  The prepared responses surfaced are the ones they staged for that situation.
  //
  //   'default'    — only use the original 16-pattern keyword scoring (legacy engine)
  //                  Same behavior as before the new engine was built.
  //
  //   'both'       — run both engines, merge results, deduplicate by trigger name
  //                  Broadest coverage: customer configs + platform defaults.
  //                  Default for all orgs until they choose otherwise.

  const orgConfig = await getOrgConfig(organizationId);
  const evaluationMode = orgConfig.mode;
  const orgThresholds = { watchPct: orgConfig.watchPct, awarePct: orgConfig.awarePct, actionPct: orgConfig.actionPct };
  console.log(`[SignalEvaluationService] Org ${organizationId} using evaluation mode: "${evaluationMode}" | thresholds: watch=${orgThresholds.watchPct}% aware=${orgThresholds.awarePct}% action=${orgThresholds.actionPct}%`);

  // Log scan activity — proves the system is working even on quiet days
  try {
    const sources = Array.from(new Set(signals.map(s => s.source).filter(Boolean)));
    await db.insert(signalActivityLog).values({
      organizationId,
      eventType: 'scanning',
      source: sources.slice(0, 3).join(', '),
      signalTitle: `Evaluating ${signals.length} signals across ${sources.length} source${sources.length !== 1 ? 's' : ''}`,
      details: `Continuous monitoring cycle — scanning 248+ data points. Sources: ${sources.join(', ')}`,
      confidence: null,
      keywordsMatched: [],
    });
  } catch { /* non-critical */ }

  // Log a few representative "evaluated but below threshold" signals
  try {
    const sampleSignals = signals.slice(0, 2);
    for (const sig of sampleSignals) {
      const text = sig.description.toLowerCase();
      const partialMatches = TRIGGER_PATTERNS
        .flatMap(p => p.keywords.filter(kw => text.includes(kw.toLowerCase())))
        .slice(0, 4);
      if (partialMatches.length > 0 && partialMatches.length < 2) {
        await db.insert(signalActivityLog).values({
          organizationId,
          eventType: 'threshold_not_met',
          source: sig.source,
          signalTitle: sig.description.substring(0, 120),
          details: `Partial match: ${partialMatches.length} keyword${partialMatches.length !== 1 ? 's' : ''} detected — below 3-match threshold. Dismissed.`,
          confidence: sig.confidence,
          keywordsMatched: partialMatches,
        });
      }
    }
  } catch { /* non-critical */ }

  const allDetectionsFlat: Array<{ detection: DetectedTrigger; signal: AnalyzedSignal; engine: 'configured' | 'default' }> = [];
  const seenTriggerNames = new Set<string>(); // Deduplication key for 'both' mode

  // ── Run configured engine (if mode is 'configured' or 'both') ───────────
  if (evaluationMode === 'configured' || evaluationMode === 'both') {
    try {
      const configuredResults = await evaluateSignalsWithOrgTriggers(signals, organizationId);
      if (configuredResults && configuredResults.length > 0) {
        for (const detection of configuredResults) {
          if (seenTriggerNames.has(detection.triggerName)) continue;
          seenTriggerNames.add(detection.triggerName);
          const matchingSignal = signals.find(s =>
            s.description.toLowerCase().includes(detection.matchedKeywords[0]?.toLowerCase() || '')
          ) || signals[0];
          if (matchingSignal) {
            allDetectionsFlat.push({ detection, signal: matchingSignal, engine: 'configured' });
          }
        }
        console.log(`[SignalEvaluationService] Configured engine: ${configuredResults.length} detection(s)`);
      } else if (evaluationMode === 'configured') {
        console.log(`[SignalEvaluationService] Configured engine: no triggers fired (org has no configured triggers or none matched)`);
      }
    } catch (err) {
      console.error('[SignalEvaluationService] Configured engine error:', err);
    }
  }

  // ── Run default engine (if mode is 'default' or 'both') ─────────────────
  if (evaluationMode === 'default' || evaluationMode === 'both') {
    let defaultCount = 0;
    for (const signal of signals) {
      const detections = evaluateSignal(signal, orgThresholds);
      for (const detection of detections) {
        if (seenTriggerNames.has(detection.triggerName)) continue; // Skip if already caught by configured engine
        seenTriggerNames.add(detection.triggerName);
        allDetectionsFlat.push({ detection, signal, engine: 'default' });
        defaultCount++;
      }
    }
    console.log(`[SignalEvaluationService] Default engine: ${defaultCount} detection(s)`);
  }

  console.log(`[SignalEvaluationService] Total detections to process: ${allDetectionsFlat.length} (mode: ${evaluationMode})`);

  // Process all detections (configured or default) through the same persistence + notification path
  for (const { detection, signal, engine } of allDetectionsFlat) {
    try {
      // Check for duplicate detection in last 4 hours to avoid alert fatigue
      const recent = await db
        .select()
        .from(triggerDetections)
        .where(eq(triggerDetections.triggerName, detection.triggerName))
        .orderBy(desc(triggerDetections.detectedAt))
        .limit(1);

      const lastDetected = recent[0]?.detectedAt;
      const hoursSince = lastDetected
        ? (Date.now() - new Date(lastDetected).getTime()) / 3600000
        : 999;

      if (hoursSince < 24) continue; // Suppress duplicate within 24 hours — prevents same trigger spamming on sustained news cycles

      // ── Daily email cap: max 3 alert emails per org per calendar day ───────
      // Counts detections where a notification was already sent today.
      // Protects executives from alert fatigue on high-signal days.
      try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const emailsSentToday = await db
          .select()
          .from(triggerDetections)
          .where(
            and(
              eq(triggerDetections.organizationId, organizationId as any),
              eq(triggerDetections.notificationSent, true),
              gte(triggerDetections.detectedAt, todayStart)
            )
          );
        if (emailsSentToday.length >= 3) {
          console.log(`📵 Daily email cap reached for org ${organizationId} (${emailsSentToday.length} sent today) — suppressing "${detection.triggerName}"`);
          continue;
        }
      } catch { /* non-critical — allow email if cap query fails */ }

      // ── Domain-specific approver routing ──────────────────────────────
      const domainApprovers = allContacts.filter(c =>
        c.isActive &&
        c.email &&
        Array.isArray(c.triggerDomains) &&
        c.triggerDomains.length > 0 &&
        c.triggerDomains.includes(detection.triggerDomain)
      );
      const fallbackContacts = allContacts.filter(c =>
        c.isActive &&
        c.email &&
        (!Array.isArray(c.triggerDomains) || c.triggerDomains.length === 0)
      );
      const recipientContacts = domainApprovers.length > 0 ? domainApprovers : fallbackContacts;
      let contactEmails = Array.from(new Set(recipientContacts.map(c => c.email!).filter(Boolean)));

      // Admin fallback — if no stakeholder contacts are registered, route to platform admin
      const ADMIN_FALLBACK = process.env.PLATFORM_ADMIN_EMAIL || 'pilot@vaughnmartin.com';
      if (contactEmails.length === 0) {
        contactEmails = [ADMIN_FALLBACK];
        console.log(`📬 No stakeholder contacts registered — routing "${detection.triggerName}" to admin fallback (${ADMIN_FALLBACK})`);
      } else if (domainApprovers.length > 0) {
        console.log(`📬 Routing "${detection.triggerName}" to ${domainApprovers.length} domain-assigned approver(s) for "${detection.triggerDomain}"`);
      } else {
        console.log(`📬 No domain approvers for "${detection.triggerDomain}" — sending to ${contactEmails.length} org-wide contact(s)`);
      }

      // ── Phase 1: Compute urgency level based on confidence + calibration ──────
      // CRITICAL = high confidence signal against a pattern the org hasn't prepared for
      // HIGH = confidence ≥ threshold, some readiness gaps known
      // ELEVATED = sub-threshold but notable (40–71%)
      // STANDARD = default for confirmed detections
      // READY = org has high readiness for this pattern
      let urgencyLevel = 'STANDARD';
      let orgReadiness: number | null = null;
      try {
        const { signalCalibrationConfig } = await import('@shared/schema');
        const { eq, and } = await import('drizzle-orm');
        const [cal] = await db.select().from(signalCalibrationConfig).where(
          and(
            eq(signalCalibrationConfig.organizationId, organizationId as any),
            eq(signalCalibrationConfig.triggerPattern, detection.triggerName)
          )
        );
        if (cal) {
          orgReadiness = cal.calibrationCount ?? 0;
          const calibratedScore = detection.confidenceScore + Number(cal.confidenceAdjust ?? 0);
          if (calibratedScore >= 80 && (cal.calibrationCount ?? 0) < 2) {
            urgencyLevel = 'CRITICAL';
          } else if (calibratedScore >= 72 && (cal.calibrationCount ?? 0) < 5) {
            urgencyLevel = 'HIGH';
          } else if ((cal.calibrationCount ?? 0) >= 5) {
            urgencyLevel = 'READY'; // Org has exercised this pattern multiple times
          }
        } else {
          // No calibration history = org has never prepared for this pattern
          if (detection.confidenceScore >= 80) urgencyLevel = 'CRITICAL';
          else if (detection.confidenceScore >= 72) urgencyLevel = 'HIGH';
        }
      } catch { /* non-critical — default urgency stands */ }

      // Persist the detection with full evidence trail
      const sig = signal as any;
      const [savedDetection] = await db.insert(triggerDetections).values({
        organizationId: organizationId,
        triggerName: detection.triggerName,
        triggerDomain: detection.triggerDomain,
        signalDescription: signal.description,
        signalSource: signal.source,
        signalSourceUrl: signal.sourceUrl || null,
        confidenceScore: detection.confidenceScore,
        signalCategory: sig.category || null,
        jurisdiction: sig.jurisdiction || 'US',
        recommendedPlaybook: detection.recommendedPlaybook,
        alternatePlaybooks: detection.alternatePlaybooks,
        // P2: Regulatory enforcement
        enforcementActionType: sig.enforcementActionType || null,
        regulatorAgency: sig.regulatorAgency || null,
        // P3: Cyber threat intelligence
        threatSeverity: sig.threatSeverity || null,
        exploitStatus: sig.exploitStatus || null,
        affectedVendor: sig.affectedVendor || null,
        // P4: Economic indicator
        economicIndicatorType: sig.economicIndicatorType || null,
        indicatorDirection: sig.indicatorDirection || null,
        // P5: Trade & geopolitical
        tradeActionType: sig.tradeActionType || null,
        effectiveTimeline: sig.effectiveTimeline || null,
        // P6: Health & safety recall
        recallClass: sig.recallClass || null,
        affectedProductType: sig.affectedProductType || null,
        recallScope: sig.recallScope || null,
        // Market signal
        signalEventType: sig.signalEventType || null,
        // Sector intelligence
        affectedSector: sig.affectedSector || null,
        namedSector: sig.namedSector || null,
        // Enhanced enforcement
        penaltyAmountRange: sig.penaltyAmountRange || null,
        // Enhanced cyber
        cveId: sig.cveId || null,
        // Enhanced economic
        indicatorMagnitude: sig.indicatorMagnitude || null,
        centralBank: sig.centralBank || null,
        // Enhanced trade
        tradePartner: sig.tradePartner || null,
        affectedHsCodes: sig.affectedHsCodes || null,
        // Trigger graph linkage — populated here, then protocol ID lookup runs post-insert
        triggerIdsMatched: [detection.triggerName],
        status: 'detected',
        notificationSent: false,
        urgencyLevel,
        orgReadiness,
        matchedEvidence: {
          engine: engine,
          conditionsMet: detection.conditionsMet ?? detection.matchedKeywords.length,
          totalConditions: detection.totalConditions ?? detection.matchedKeywords.length,
          dataPoints: detection.dataPoints ?? detection.matchedKeywords.map(kw => `Signal matched: "${kw}"`),
          matchedKeywords: detection.matchedKeywords,
        },
      } as any).returning();

      // ── P1: Protocol Graph Linkage — look up playbook_library ID by name ──────
      // Runs post-insert so it never blocks the main detection path.
      try {
        const { playbookLibrary } = await import('@shared/schema');
        const { ilike } = await import('drizzle-orm');
        const playbookName = detection.recommendedPlaybook?.trim();
        if (playbookName && savedDetection?.id) {
          const [matched] = await db
            .select({ id: playbookLibrary.id, num: playbookLibrary.playbookNumber })
            .from(playbookLibrary)
            .where(ilike(playbookLibrary.name, `%${playbookName}%`))
            .limit(1);
          if (matched) {
            await db.update(triggerDetections)
              .set({ protocolIdMatched: matched.id, protocolNumberMatched: matched.num })
              .where(eq(triggerDetections.id, savedDetection.id));
            console.log(`🔗 Linked detection to Protocol #${matched.num} (${playbookName})`);
          }
        }
      } catch { /* non-critical — detection already saved */ }

      // ── P2: Semantic Intelligence Scoring (Layer 3) ───────────────────────────
      // Non-blocking embedding-based cosine similarity enrichment.
      // Runs after insert so it never gates the main detection path.
      if (savedDetection?.id) {
        const detectionId = savedDetection.id;
        const signalText = `${signal.description} ${signal.signalType ?? ''} ${signal.source ?? ''}`;
        setImmediate(async () => {
          try {
            const { scoreSignalSemantically } = await import('./SemanticScoringService.js');
            const result = await scoreSignalSemantically(signalText);
            if (result) {
              await db.update(triggerDetections)
                .set({ semanticSimilarityScore: result.score })
                .where(eq(triggerDetections.id, detectionId));
            }
          } catch { /* non-critical — semantic enrichment is additive */ }
        });
      }

      console.log(`🎯 TRIGGER DETECTED: "${detection.triggerName}" (${detection.confidenceScore}% confidence) via ${signal.source} [${engine === 'configured' ? 'customer-configured' : 'default-pattern'}]`);

      // ── Start the Execution Clock ──────────────────────────────────────────
      // Creates a timeline entry at T+0. Subsequent milestones are stamped as
      // they occur (prepared response activated, task acknowledged, execution complete).
      const now = new Date();
      let executionTimelineId: number | null = null;
      try {
        const [timeline] = await db.insert(executionTimelines).values({
          organizationId,
          triggerDetectionId: savedDetection?.id ?? null,
          triggerName: detection.triggerName,
          triggerDomain: detection.triggerDomain,
          recommendedPlaybook: detection.recommendedPlaybook,
          detectedAt: now,
          status: 'detected',
        }).returning();
        executionTimelineId = timeline?.id ?? null;
      } catch { /* non-critical — clock starts best-effort */ }

      // ── Log signal activity ────────────────────────────────────────────────
      try {
        await db.insert(signalActivityLog).values({
          organizationId,
          eventType: 'trigger_fired',
          source: signal.source,
          signalTitle: signal.description.substring(0, 200),
          details: `${detection.triggerName} fired with ${detection.confidenceScore}% confidence. Prepared response recommended: ${detection.recommendedPlaybook}`,
          confidence: detection.confidenceScore,
          keywordsMatched: detection.matchedKeywords.slice(0, 5),
          sourceConfidenceTier: (signal as any).confidenceTier || null,
        });
      } catch { /* non-critical */ }

      // Push real-time update via WebSocket
      try {
        const io = wsService.getIO();
        if (io) {
          io.emit('new-detection', {
            triggerName: detection.triggerName,
            triggerDomain: detection.triggerDomain,
            confidenceScore: detection.confidenceScore,
            organizationId,
          });
          io.emit('signal-activity', {
            eventType: 'trigger_fired',
            source: signal.source,
            triggerName: detection.triggerName,
            confidence: detection.confidenceScore,
            timestamp: now.toISOString(),
          });
        }
      } catch { /* non-blocking */ }

      // Route to the correct email function based on alert tier:
      //   watch  (50–69% match)      → amber "Situation Developing" email only
      //   aware  (70–79% match)      → orange "Pattern Strengthening" email only
      //   action (80%+ or mandatory) → red "Trigger Confirmed" email + Slack
      const isActionTier = detection.alertTier === 'action' || detection.alertTier === undefined;
      const isAwareTier  = detection.alertTier === 'aware';

      let emailFn: Promise<boolean> = Promise.resolve(false);
      if (contactEmails.length > 0) {
        if (isActionTier) {
          emailFn = sendDetectionEmail(detection, signal, contactEmails, organizationId);
        } else if (isAwareTier) {
          emailFn = sendAwareEmail(detection, signal, contactEmails, organizationId);
        } else {
          emailFn = sendWatchEmail(detection, signal, contactEmails, organizationId);
        }
      }

      const [, emailResult] = await Promise.allSettled([
        isActionTier ? sendDetectionSlack(detection, signal) : Promise.resolve(),
        emailFn,
      ]);
      const emailDelivered = emailResult.status === 'fulfilled' && emailResult.value === true;

      // Stamp notification milestone on the Execution Clock
      const notifiedAt = new Date();
      const timelineStatus = isActionTier ? 'notified' : isAwareTier ? 'aware' : 'watch';
      try {
        if (executionTimelineId) {
          await db.update(executionTimelines)
            .set({ notificationSentAt: notifiedAt, status: timelineStatus })
            .where(eq(executionTimelines.id, executionTimelineId));
        }
      } catch { /* non-critical */ }

      // Only mark as sent when the email actually delivered — preserves daily cap accuracy
      if (emailDelivered) {
        await db
          .update(triggerDetections)
          .set({ notificationSent: true, status: timelineStatus })
          .where(eq(triggerDetections.triggerName, detection.triggerName));
      } else {
        await db
          .update(triggerDetections)
          .set({ status: timelineStatus })
          .where(eq(triggerDetections.triggerName, detection.triggerName));
      }

      detectionsCreated++;
    } catch (err) {
      console.error('Error persisting detection:', err);
    }
  }

  return detectionsCreated;
}

// ─── Query helpers ────────────────────────────────────────────────────────────

export async function getRecentDetections(organizationId: string, limit = 20) {
  return db
    .select()
    .from(triggerDetections)
    .where(eq(triggerDetections.organizationId, organizationId))
    .orderBy(desc(triggerDetections.detectedAt))
    .limit(limit);
}

// ─── Phase 2: Leading Indicator Scoring ──────────────────────────────────────
// Runs after every ingestion cycle. For each trigger pattern that has seeded
// leading indicators, checks how many match against the current signal batch.
// When 2+ indicators converge for the same pattern → creates a detection.

export async function evaluateLeadingIndicators(
  signals: AnalyzedSignal[],
  organizationId: string
): Promise<number> {
  try {
    const { leadingIndicators, leadingIndicatorDetections } = await import('@shared/schema');

    const allIndicators = await db.select().from(leadingIndicators);
    if (allIndicators.length === 0) return 0;

    // Group by triggerPattern
    const byPattern = new Map<string, typeof allIndicators>();
    for (const ind of allIndicators) {
      const list = byPattern.get(ind.triggerPattern) || [];
      list.push(ind);
      byPattern.set(ind.triggerPattern, list);
    }

    let created = 0;

    for (const [pattern, indicators] of Array.from(byPattern.entries())) {
      const matchedIds: string[] = [];

      for (const indicator of indicators) {
        const keywords: string[] = Array.isArray(indicator.keywords) ? indicator.keywords : [];
        if (keywords.length === 0) continue;
        const hit = signals.some(signal => {
          const text = (signal.description + ' ' + signal.signalType).toLowerCase();
          return keywords.some(kw => text.includes(kw.toLowerCase()));
        });
        if (hit) matchedIds.push(indicator.id);
      }

      if (matchedIds.length < 2) continue; // need at least 2 indicators to fire

      const matchScore = (matchedIds.length / Math.max(indicators.length, 1)) * 100;

      // Deduplicate: skip if there's already an unacknowledged detection for this pattern in last 4 hours
      try {
        const { and, gte } = await import('drizzle-orm');
        const cutoff = new Date(Date.now() - 4 * 3600_000);
        const recent = await db.select().from(leadingIndicatorDetections)
          .where(
            and(
              eq(leadingIndicatorDetections.organizationId, organizationId),
              eq(leadingIndicatorDetections.triggerPattern, pattern),
              eq(leadingIndicatorDetections.acknowledged, false)
            )
          )
          .limit(1);
        if (recent.length > 0) continue;
      } catch { /* non-critical check */ }

      try {
        await db.insert(leadingIndicatorDetections).values({
          organizationId,
          triggerPattern: pattern,
          indicatorsMatched: matchedIds.length,
          totalIndicators: indicators.length,
          matchScore: String(matchScore.toFixed(1)),
          matchedIndicatorIds: matchedIds,
          acknowledged: false,
        });
        created++;
        console.log(`🔮 Leading indicator convergence: "${pattern}" — ${matchedIds.length}/${indicators.length} indicators matched (${matchScore.toFixed(0)}% match score)`);
      } catch { /* skip insert errors */ }
    }

    return created;
  } catch (err) {
    console.error('[evaluateLeadingIndicators] error:', err);
    return 0;
  }
}

// ─── Phase 2: Compound Sub-threshold Detection ────────────────────────────────
// Runs after every ingestion cycle. Scores all signals below the main threshold
// (40–71%). When signals from 2+ distinct domains cluster simultaneously,
// creates a compound_threat_alert with compoundScore and subThresholdSignals.

export async function evaluateCompoundPatterns(
  signals: AnalyzedSignal[],
  organizationId: string
): Promise<void> {
  try {
    const { compoundThreatAlerts } = await import('@shared/schema');

    // Collect sub-threshold hits (scored 40–71%)
    const subHits: Array<{ triggerName: string; domain: string; confidence: number; source: string }> = [];

    for (const signal of signals) {
      for (const pattern of TRIGGER_PATTERNS) {
        const text = signal.description.toLowerCase();
        const matched = pattern.keywords.filter(kw => text.includes(kw.toLowerCase()));
        if (matched.length < 2) continue;
        const score = scoreSignalAgainstPattern(signal, pattern);
        if (score >= 40 && score < 72) {
          subHits.push({ triggerName: pattern.name, domain: pattern.domain, confidence: score, source: signal.source });
        }
      }
    }

    if (subHits.length < 2) return;

    // Group by domain — need 2+ distinct domains
    const domainMap = new Map<string, typeof subHits>();
    for (const h of subHits) {
      const list = domainMap.get(h.domain) || [];
      list.push(h);
      domainMap.set(h.domain, list);
    }

    const activeDomains = Array.from(domainMap.keys());
    if (activeDomains.length < 2) return;

    // Compound score: weighted average of best signal per domain × domain count multiplier
    const domainPeaks = activeDomains.map(d => Math.max(...(domainMap.get(d)!.map(h => h.confidence))));
    const avgPeak = domainPeaks.reduce((a, b) => a + b, 0) / domainPeaks.length;
    const compoundScore = Math.min(95, Math.round(avgPeak * (1 + (activeDomains.length - 1) * 0.08)));

    if (compoundScore < 45) return;

    // Dedup: skip if same domain set fired in last 6 hours
    const sortedDomains = [...activeDomains].sort();
    const recentAlerts = await db.select().from(compoundThreatAlerts)
      .where(eq(compoundThreatAlerts.organizationId, organizationId))
      .orderBy(desc(compoundThreatAlerts.detectedAt))
      .limit(10);

    const alreadyExists = recentAlerts.some(r => {
      const rDomains = [...(Array.isArray(r.domains) ? r.domains : [])].sort();
      return JSON.stringify(rDomains) === JSON.stringify(sortedDomains)
        && (Date.now() - new Date(r.detectedAt!).getTime()) < 6 * 3600_000;
    });
    if (alreadyExists) return;

    const threatType = `${activeDomains.slice(0, 2).join(' + ')} Compound Pattern`;
    const hypothesis = `Sub-threshold signals detected simultaneously across ${activeDomains.length} domains: ${activeDomains.join(', ')}. Individual domain scores: ${domainPeaks.map((s, i) => `${activeDomains[i]} (${s}%)`).join(', ')}. Each domain scored below the 72% individual threshold, but cross-domain convergence indicates a compound situation that warrants preparation review before any single domain crosses into full alert.`;

    await db.insert(compoundThreatAlerts).values({
      organizationId,
      domains: activeDomains,
      threatType,
      confidence: compoundScore,
      aiHypothesis: hypothesis,
      status: 'active',
      compoundScore,
      subThresholdSignals: subHits.map(h => ({
        triggerName: h.triggerName,
        domain: h.domain,
        confidence: h.confidence,
        source: h.source,
      })),
    } as any);

    console.log(`⚠️ Compound sub-threshold pattern: [${activeDomains.join(' + ')}] compound score ${compoundScore}%`);
  } catch (err) {
    console.error('[evaluateCompoundPatterns] error:', err);
  }
}
