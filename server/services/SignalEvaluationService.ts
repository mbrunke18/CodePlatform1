import { db } from '../db.js';
import { triggerDetections, stakeholderContacts } from '@shared/schema';
import { eq, desc } from 'drizzle-orm';
import { Resend } from 'resend';
import { wsService } from './WebSocketService';

// ─── Domain trigger keyword maps ─────────────────────────────────────────────
// Each domain has primary keywords + recommended playbook + severity weight

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
    keywords: ['competitor', 'rival', 'market entry', 'new entrant', 'competing', 'launched', 'expansion', 'competitive threat', 'market share', 'disrupt', 'market leader', 'outcompete', 'price war', 'competitive pressure', 'market position'],
    playbookName: 'Competitive Threat Response',
    alternatePlaybooks: ['Investor Communications Protocol', 'Reputational Crisis Protocol'],
    baseConfidence: 70,
  },
  {
    name: 'M&A Activity Detected',
    domain: 'Market Dynamics',
    keywords: ['acquisition', 'merger', 'buyout', 'takeover', 'acquires', 'acquired', 'deal signed', 'consolidation', 'private equity', 'strategic acquisition', 'deal closed', 'billion deal', 'purchase agreement', 'M&A', 'joint venture'],
    playbookName: 'M&A Response Playbook',
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
    keywords: ['8-K', 'material event', 'form 8-K', 'SEC filing', 'material change', 'reportable event', 'current report', 'material disclosure', 'securities filing'],
    playbookName: 'Regulatory Disclosure Protocol',
    alternatePlaybooks: ['Investor Communications Protocol', 'Regulatory Compliance Sprint'],
    baseConfidence: 85,
  },

  // Technology & Security
  {
    name: 'Cybersecurity Breach Signal',
    domain: 'Technology & Security',
    keywords: ['data breach', 'cyberattack', 'ransomware', 'hack', 'hacked', 'security incident', 'vulnerability', 'zero-day', 'phishing', 'malware', 'data leak', 'cyber incident', 'systems compromised', 'cyber attack', 'data stolen', 'unauthorized access'],
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
    keywords: ['earnings beat', 'earnings miss', 'revenue surprise', 'profit warning', 'earnings guidance', 'quarterly results', 'financial results', 'beat estimates', 'missed estimates', 'revenue growth', 'profit decline', 'Q1 results', 'Q2 results', 'Q3 results', 'Q4 results', 'annual results', 'fiscal year'],
    playbookName: 'Investor Communications Protocol',
    alternatePlaybooks: ['Financial Crisis Response', 'Reputational Crisis Protocol'],
    baseConfidence: 65,
  },

  // ESG
  {
    name: 'ESG / Climate Event',
    domain: 'ESG & Sustainability',
    keywords: ['ESG', 'climate', 'sustainability', 'carbon', 'emissions', 'greenwashing', 'environmental violation', 'climate risk', 'net zero', 'DEI controversy', 'climate change', 'renewable energy', 'carbon neutral', 'environmental impact', 'social responsibility', 'diversity controversy'],
    playbookName: 'ESG Crisis Response',
    alternatePlaybooks: ['Reputational Crisis Protocol', 'Regulatory Compliance Sprint'],
    baseConfidence: 65,
  },

  // Geopolitical
  {
    name: 'Geopolitical Risk Signal',
    domain: 'Geopolitical',
    keywords: ['sanctions', 'trade war', 'tariff', 'geopolitical', 'conflict', 'war', 'political instability', 'export control', 'national security', 'government shutdown', 'tariffs imposed', 'trade policy', 'economic sanctions', 'diplomatic crisis', 'military conflict', 'trade restrictions'],
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
  const CONFIDENCE_THRESHOLD = 72; // Must clear this to count as a real detection

  for (const pattern of TRIGGER_PATTERNS) {
    const text = signal.description.toLowerCase();
    const matchedKeywords = pattern.keywords.filter(kw => text.includes(kw.toLowerCase()));

    if (matchedKeywords.length === 0) continue;

    const confidenceScore = scoreSignalAgainstPattern(signal, pattern);
    if (confidenceScore >= CONFIDENCE_THRESHOLD) {
      detections.push({
        triggerName: pattern.name,
        triggerDomain: pattern.domain,
        confidenceScore,
        recommendedPlaybook: pattern.playbookName,
        alternatePlaybooks: pattern.alternatePlaybooks,
        matchedKeywords,
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
          <div style="color:#C9A84C;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Execution OS · Live Detection Alert</div>
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
                <span style="display:inline-block;margin-left:6px;background:#2B8A6E20;color:#2B8A6E;font-size:9px;font-weight:700;padding:2px 6px;letter-spacing:0.1em;text-transform:uppercase;">AI Recommended</span>
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
          <div style="background:#f0ede4;border-left:3px solid #C9A84C;padding:16px 20px;border-radius:4px;margin-bottom:28px;">
            <div style="color:#666;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Signal Detected</div>
            <div style="color:#0A0F2E;font-size:14px;line-height:1.5;">${signal.description.substring(0, 300)}${signal.description.length > 300 ? '…' : ''}</div>
          </div>
          <div style="text-align:center;margin-bottom:12px;">
            <a href="${platformUrl}/live-detection-feed" style="display:inline-block;background:#132558;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:14px;font-weight:600;letter-spacing:0.5px;margin-bottom:12px;">Review Live Detection →</a>
          </div>
          <div style="text-align:center;">
            <a href="${platformUrl}/live-activation-center" style="display:inline-block;background:#C9A84C;color:#0A0F2E;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:14px;font-weight:700;letter-spacing:0.5px;">Activate: ${detection.recommendedPlaybook} →</a>
          </div>
        </div>
        <div style="background:#f8f7f4;padding:20px 36px;border-top:1px solid #e8e4dc;">
          <div style="color:#999;font-size:11px;text-align:center;">Execution OS continuously monitors 248+ signals across 9 domains. This alert was generated automatically — no human reviewed it before it reached you.</div>
        </div>
      </div>
    </div>
  `;

  try {
    await resend.emails.send({
      from: 'Execution OS <pilot@vaughnmartin.com>',
      replyTo: 'pilot@vaughnmartin.com',
      to: emails,
      subject: `🔴 Trigger Detected: ${detection.triggerName} (${detection.confidenceScore}% confidence)`,
      html,
    });
    console.log(`📧 Detection alert sent to ${emails.join(', ')}`);
  } catch (err) {
    console.error('Detection email failed:', err);
  }
}

async function sendDetectionSlack(detection: DetectedTrigger, signal: AnalyzedSignal): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return;

  const payload = {
    text: `🔴 *Strategic Trigger Detected* — ${detection.triggerName}`,
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: '🔴 Execution OS: Strategic Trigger Detected' },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Trigger:*\n${detection.triggerName}` },
          { type: 'mrkdwn', text: `*Domain:*\n${detection.triggerDomain}` },
          { type: 'mrkdwn', text: `*Confidence:*\n${detection.confidenceScore}%` },
          { type: 'mrkdwn', text: `*Primary Playbook:*\n${detection.recommendedPlaybook}` },
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

  for (const signal of signals) {
    const detections = evaluateSignal(signal);
    if (detections.length === 0) continue;

    for (const detection of detections) {
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
        // 1. Find contacts explicitly assigned to this trigger's domain
        // 2. If none assigned, fall back to all active contacts (org-wide)
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
        const contactEmails = recipientContacts.map(c => c.email!).filter(Boolean);

        if (domainApprovers.length > 0) {
          console.log(`📬 Routing "${detection.triggerName}" to ${domainApprovers.length} domain-assigned approver(s) for "${detection.triggerDomain}"`);
        } else {
          console.log(`📬 No domain approvers for "${detection.triggerDomain}" — sending to ${contactEmails.length} org-wide contact(s)`);
        }

        // Persist the detection
        await db.insert(triggerDetections).values({
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
        });

        console.log(`🎯 TRIGGER DETECTED: "${detection.triggerName}" (${detection.confidenceScore}% confidence) via ${signal.source}`);

        // Push real-time update via WebSocket so all connected clients refresh instantly
        try {
          const io = wsService.getIO();
          if (io) {
            io.emit('new-detection', {
              triggerName: detection.triggerName,
              triggerDomain: detection.triggerDomain,
              confidenceScore: detection.confidenceScore,
              organizationId,
            });
          }
        } catch { /* non-blocking */ }

        // Fire notifications
        await Promise.allSettled([
          sendDetectionSlack(detection, signal),
          contactEmails.length > 0 ? sendDetectionEmail(detection, signal, contactEmails, organizationId) : Promise.resolve(),
        ]);

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
