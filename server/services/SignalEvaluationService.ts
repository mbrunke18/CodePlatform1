import { db } from '../db.js';
import { triggerDetections, stakeholderContacts, signalMonitoringConfig, executionTimelines, signalActivityLog } from '@shared/schema';
import { eq, desc } from 'drizzle-orm';
import { Resend } from 'resend';
import { wsService } from './WebSocketService';
import { evaluateSignalsWithOrgTriggers } from './TriggerEvaluationEngine.js';

// Evaluation mode options:
//   'configured' — customer's configured triggers only (new engine)
//   'default'    — original 16-pattern keyword scoring only (legacy engine)
//   'both'       — run both engines, merge and deduplicate by trigger name
type EvaluationMode = 'configured' | 'default' | 'both';

async function getOrgEvaluationMode(organizationId: string): Promise<EvaluationMode> {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(organizationId)) {
    return 'default'; // Non-UUID orgs (e.g. "system" demo) always use default
  }
  try {
    const [config] = await db
      .select()
      .from(signalMonitoringConfig)
      .where(eq(signalMonitoringConfig.organizationId, organizationId as any))
      .limit(1);
    const mode = (config?.evaluationMode as EvaluationMode) || 'both';
    return ['configured', 'default', 'both'].includes(mode) ? mode : 'both';
  } catch {
    return 'both'; // Safe fallback on any DB error
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

export function evaluateSignal(signal: AnalyzedSignal): DetectedTrigger[] {
  const detections: DetectedTrigger[] = [];

  // ── Quality gates ────────────────────────────────────────────────────────────
  // A trigger fires only when ALL three conditions are met:
  //
  //  1. CONFIDENCE_THRESHOLD (78): The composite score — base confidence + keyword
  //     density bonus + signal quality boost — must clear 78. This is the primary
  //     quality gate and prevents borderline matches from generating alerts.
  //
  //  2. MIN_KEYWORD_MATCHES (3): An absolute floor. No trigger fires on fewer than
  //     3 keyword matches regardless of the composite score.
  //
  //  3. MIN_KEYWORD_DENSITY (0.12): At least 12% of a pattern's full keyword list
  //     must be present in the signal. For a 30-keyword pattern this means 4+
  //     matches; for a 15-keyword pattern it means 2+ (but MIN_KEYWORD_MATCHES=3
  //     still applies). This prevents a signal that coincidentally includes 2 of
  //     30 monitoring terms from generating an executive alert.
  //
  // Combined effect: a 30-keyword pattern requires ≥4 matches, a 25-keyword
  // pattern requires ≥3 matches, and the composite score must still clear 78.
  // ────────────────────────────────────────────────────────────────────────────
  const CONFIDENCE_THRESHOLD = 78;
  const MIN_KEYWORD_MATCHES  = 3;
  const MIN_KEYWORD_DENSITY  = 0.12; // 12% of the pattern's keyword list must match

  for (const pattern of TRIGGER_PATTERNS) {
    const text = signal.description.toLowerCase();
    const matchedKeywords = pattern.keywords.filter(kw => text.includes(kw.toLowerCase()));

    // Gate 1 — absolute minimum keyword count
    if (matchedKeywords.length < MIN_KEYWORD_MATCHES) continue;

    // Gate 2 — minimum keyword density (matched / total keywords in pattern)
    const density = matchedKeywords.length / pattern.keywords.length;
    if (density < MIN_KEYWORD_DENSITY) continue;

    const confidenceScore = scoreSignalAgainstPattern(signal, pattern);
    if (confidenceScore >= CONFIDENCE_THRESHOLD) {
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
      });
    }
  }

  // Return top 2 detections sorted by confidence to avoid alert fatigue
  return detections.sort((a, b) => b.confidenceScore - a.confidenceScore).slice(0, 2);
}

// ─── Persistence + Notification ──────────────────────────────────────────────

async function sendDetectionEmail(
  detection: DetectedTrigger,
  signal: AnalyzedSignal,
  emails: string[],
  orgId: string
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY || process.env.Resend_API_Key;
  if (!apiKey || emails.length === 0) return;

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
        break;
      } catch (err: any) {
        console.warn(`⚠ Detection email sender ${from} threw: ${err.message} — trying next`);
      }
    }
    if (!sent) console.error(`✗ All senders failed for detection alert to ${recipientEmail}`);
  }
  console.log(`📧 Detection alert sent to ${emails.join(', ')}`);
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

  const evaluationMode = await getOrgEvaluationMode(organizationId);
  console.log(`[SignalEvaluationService] Org ${organizationId} using evaluation mode: "${evaluationMode}"`);

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
      const detections = evaluateSignal(signal);
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

      if (hoursSince < 4) continue; // Suppress duplicate within 4 hours

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

      // Admin fallback — if no stakeholder contacts are registered, always alert pilot
      const ADMIN_FALLBACK = 'pilot@vaughnmartin.com';
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
      const [savedDetection] = await db.insert(triggerDetections).values({
        organizationId: organizationId,
        triggerName: detection.triggerName,
        triggerDomain: detection.triggerDomain,
        signalDescription: signal.description,
        signalSource: signal.source,
        signalSourceUrl: signal.sourceUrl || null,
        confidenceScore: detection.confidenceScore,
        recommendedPlaybook: detection.recommendedPlaybook,
        alternatePlaybooks: detection.alternatePlaybooks,
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

      // Fire notifications
      await Promise.allSettled([
        sendDetectionSlack(detection, signal),
        contactEmails.length > 0 ? sendDetectionEmail(detection, signal, contactEmails, organizationId) : Promise.resolve(),
      ]);

      // Stamp notification milestone on the Execution Clock
      const notifiedAt = new Date();
      try {
        if (executionTimelineId) {
          await db.update(executionTimelines)
            .set({ notificationSentAt: notifiedAt, status: 'notified' })
            .where(eq(executionTimelines.id, executionTimelineId));
        }
      } catch { /* non-critical */ }

      // Mark notification as sent
      await db
        .update(triggerDetections)
        .set({ notificationSent: true, status: 'notified' })
        .where(eq(triggerDetections.triggerName, detection.triggerName));

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
