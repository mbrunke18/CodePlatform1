import { useEffect } from 'react';
import { Link } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';
import { updatePageMetadata } from '@/lib/seo';
import {
  Shield, Zap, Users, TrendingUp, ChevronRight,
  Radio, BookOpen, BarChart3, Target, Brain, CheckCircle2,
  ArrowRight, Lock
} from 'lucide-react';

const NAVY  = '#0A0F2E';
const GOLD  = '#C9A84C';
const TEAL  = '#2B8A6E';
const IVORY = '#F0EDE4';

/* ── Phase data ─────────────────────────────────────────────────────────────── */
const PHASES = [
  {
    id: 'prepare',
    phase: 'IDENTIFY',
    label: 'Decision Preparation',
    sub: 'Before the trigger fires',
    icon: Radio,
    color: TEAL,
    bg: 'rgba(43,138,110,0.06)',
    border: 'rgba(43,138,110,0.2)',
    thesis: 'The organization is not waiting. Every major strategic decision it will ever face has already been made — deliberately, at peak cognitive capacity, before the pressure arrives.',
    capabilities: [
      {
        title: '221 Armed Trigger Rules',
        detail: 'Pre-defined decision rules monitoring the strategic environment continuously — not alerts waiting to be configured, but decision logic already set against your organization\'s specific situation intents. When conditions match, the system knows what it means and what the response is.',
      },
      {
        title: '248+ Data Points Ingested Every 15 Minutes',
        detail: 'Across 9 strategic domains including competitive intelligence, regulatory conditions, financial signals, operational risk, and market opportunity — creating a continuously updated picture of the environment your decisions will land in.',
      },
      {
        title: '170 Pre-Staged Readiness Protocols',
        detail: 'Each Readiness Protocol represents a strategic decision already made by the best minds in the organization under no pressure, with full information and complete clarity. Not a template — a commitment. The organization has already decided what it will do when this trigger fires.',
      },
      {
        title: 'Trigger Configuration Wizard',
        detail: 'Maps your specific strategic situations to the Readiness Protocols that respond to them. The system understands what your organization considers a trigger, not what a generic model suggests. Situation intents, signal thresholds, and monitoring rules are configured to your context.',
      },
      {
        title: '9 Strategic Domains — Full Coverage',
        detail: 'Cybersecurity & Data, Regulatory & Compliance, Competitive Intelligence, Financial Risk, Operational Continuity, Talent & Leadership, M&A Activity, Reputational Risk, and Market Opportunity — covering both offense and defense across every major decision category a Fortune 1000 faces.',
      },
    ],
  },
  {
    id: 'activate',
    phase: 'DETECT → EXECUTE',
    label: 'Decision Confidence',
    sub: 'At the moment of activation',
    icon: Zap,
    color: GOLD,
    bg: 'rgba(201,168,76,0.06)',
    border: 'rgba(201,168,76,0.2)',
    thesis: 'The executive does not face an ambiguous situation requiring rapid judgment under pressure. They face a pre-defined scenario with a pre-built response designed at the moment of highest clarity. The decision is not what to do — it is whether to authorize what was already designed for this exact moment.',
    capabilities: [
      {
        title: '12-Minute Execution Clock',
        detail: 'From trigger detection to full stakeholder notification and task deployment. The 3,600× execution head start compresses what traditionally requires 30 days of committee alignment, stakeholder identification, and coordination calls into 12 minutes — not because people move faster, but because every decision was already made.',
      },
      {
        title: 'Executive Authorization Preserved',
        detail: 'No Readiness Protocol activates without executive sign-off. The platform compresses the mobilization cycle, not the decision authority. The preparation eliminates improvisation under pressure; the human judgment that authorizes action remains exactly where it belongs.',
      },
      {
        title: 'AI Execution Brief at Activation',
        detail: 'A structured pre-read generated at the moment of trigger detection — telling the authorizing executive what fired, why, what the Readiness Protocol deploys, who gets notified, and what they are approving. Decision-ready in under 2 minutes, not 2 hours.',
      },
      {
        title: 'Execution Confidence Score',
        detail: 'Per detection — showing which signals converged, which domains lit, the confidence weight of the trigger, and the recommended Readiness Protocol with alternates. The executive sees the case for action before they authorize it.',
      },
      {
        title: 'Live Signal Detection — IDEA Framework',
        detail: 'The IDENTIFY → DETECT → EXECUTE → ADVANCE chain runs continuously. AI monitors; executives authorize. Pattern detection replaces committee deliberation. The 12-minute clock starts the moment detection is confirmed — not the moment someone calls a meeting.',
      },
    ],
  },
  {
    id: 'execute',
    phase: 'EXECUTE',
    label: 'Decision Coordination',
    sub: 'During execution',
    icon: Users,
    color: '#7C6FAF',
    bg: 'rgba(124,111,175,0.06)',
    border: 'rgba(124,111,175,0.2)',
    thesis: 'Every dimension that typically degrades under pressure has already been resolved. Roles assigned. Decision rights mapped. Communications drafted. Ownership explicit. The organization executes with precision because the ambiguity was eliminated before the signal ever arrived.',
    capabilities: [
      {
        title: 'Stakeholder Notification Cascade',
        detail: 'Pre-drafted communications for each role — CISO, CFO, General Counsel, COO, CEO — dispatched simultaneously at T+0, not sequentially after someone locates a phone list. Tier 1 stakeholders are notified within the first 3 minutes of activation.',
      },
      {
        title: 'Pre-Mapped Roles and Decision Rights',
        detail: 'Authority structures are defined before the trigger fires, eliminating the political friction and competing authority claims that degrade execution quality under pressure. Every stakeholder knows their responsibility before they receive the notification.',
      },
      {
        title: 'Task Deployment at Activation',
        detail: 'Every owner receives their specific responsibilities, due times, and success criteria the moment the Readiness Protocol activates — no waiting for a coordinator to assign work, no ambiguity about who owns what. Pre-staged task sequences deploy automatically.',
      },
      {
        title: 'Live War Room',
        detail: 'Real-time execution status across all active Readiness Protocols, stakeholder acknowledgment tracking, decision gate visibility, and cross-functional coordination from a single screen. Executives see the execution state without calling for a status update.',
      },
      {
        title: 'Microsoft Ecosystem Integration',
        detail: 'Microsoft Teams, Azure OpenAI, Copilot Studio, and Microsoft Entra. Readiness OS sits above the Microsoft investment as the operating model layer — not a replacement, an orchestrator. Every enterprise already has Microsoft\'s AI stack. This is the operating model to use it.',
      },
      {
        title: 'Command Tower — Full-Screen Executive NOC',
        detail: 'Live trigger detections, system pulse, real-time signal activity, and execution log in a full-screen display designed for the operations center. The strategic picture in one view, updated in real time.',
      },
    ],
  },
  {
    id: 'learn',
    phase: 'ADVANCE',
    label: 'Decision Learning',
    sub: 'After every cycle',
    icon: TrendingUp,
    color: '#38BDF8',
    bg: 'rgba(56,189,248,0.05)',
    border: 'rgba(56,189,248,0.18)',
    thesis: 'The most undervalued part of the platform. The next time a similar trigger fires, the organization does not start from the same place. It starts from a better place. Every cycle the decision quality improves. Every cycle the execution precision improves. Every cycle the probability of a successful outcome increases.',
    capabilities: [
      {
        title: 'Execution Quality Score (EQS)',
        detail: 'Calculated after every activation across four dimensions: stakeholder coverage speed, task completion rate, decision gate velocity, and execution precision vs. plan. Scored 0–100, trended across every cycle, visible in Mission Control as a rising line that proves the compounding is real.',
      },
      {
        title: 'Institutional Memory Encoding',
        detail: 'Improvements identified in each post-activation debrief are captured and fed back into the Readiness Protocol architecture. The specific changes — who should have been in Tier 1, which communications needed earlier distribution, which decision gate slowed the clock — become part of the Readiness Protocol the next time it activates.',
      },
      {
        title: 'Compounding Intelligence Loop',
        detail: 'The only platform that gets structurally better the more it is used. Activation 1 establishes the baseline. Activation 3 is faster. Activation 6 is sharper. The institutional knowledge of how this organization actually executes under real conditions — not how it thinks it executes — compounds with every cycle.',
      },
      {
        title: 'Post-Activation Debrief',
        detail: 'A structured performance record scored against what was designed vs. what happened — not a retrospective document but a forward-feeding artifact that drives Readiness Protocol improvement. Performance is not evaluated to assign blame; it is evaluated to eliminate the gap between plan and execution.',
      },
      {
        title: 'Board Readiness Report',
        detail: 'A print-ready executive artifact showing readiness score, live detection summary, and Execution Quality Score trend across activations — designed for audit committee and board presentation. Not an internal dashboard. A governance artifact that demonstrates organizational decision capability as a measurable, improving curve.',
      },
    ],
  },
];

/* ── Supporting capabilities ────────────────────────────────────────────────── */
const PLATFORM_CAPABILITIES = [
  {
    icon: Brain,
    title: 'Executive Scenario Suite',
    detail: 'Authenticated walk-throughs of industry-specific triggers — CISO zero-day breach, CFO activist investor, COO supplier failure, GC FDA enforcement — mapped to the live Readiness Protocol library, showing the exact IDEA chain and 12-minute execution in the buyer\'s own context.',
  },
  {
    icon: BarChart3,
    title: 'Execution ROI Calculator',
    detail: 'Revenue bracket inputs, executive population size, and scenario frequency — producing annual value protected, executive hours recovered, and 3,600× head start quantified in the buyer\'s own numbers. McKinsey\'s $250M Decision Tax benchmark included.',
  },
  {
    icon: Shield,
    title: 'Shadow Strategy Simulator',
    detail: 'Digital twin environment where organizations test Readiness Protocol responses against live signals without activating in production. Run fire drills at any time — validate response quality before the real trigger fires.',
  },
  {
    icon: BookOpen,
    title: 'Readiness Protocol Detail Editor',
    detail: 'Authenticated users can customize phases, tasks, decision gates, and stakeholder assignments within any Readiness Protocol — ensuring the pre-staged response reflects the organization\'s actual structure, not a generic template.',
  },
  {
    icon: Target,
    title: 'Compound Threat Intelligence',
    detail: 'Identifies when multiple signals across different domains converge into a compound threat — a cyber event coinciding with a regulatory inquiry coinciding with a key executive departure — and surfaces the combined risk with a unified Readiness Protocol response.',
  },
  {
    icon: Lock,
    title: 'Role-Based Access & Audit Trail',
    detail: 'Executive, strategist, and admin roles with granular access controls. Every action — detection acknowledgment, Readiness Protocol activation, task completion, decision gate clearance — is logged with timestamp and actor for complete governance and audit compliance.',
  },
];

/* ── Page ────────────────────────────────────────────────────────────────────── */
export default function PlatformCapabilities() {
  useEffect(() => {
    updatePageMetadata({
      title: 'Platform Capabilities — Readiness OS | VaughnMartin',
      description: 'The full decision intelligence lifecycle: preparation, activation, coordination, and compounding learning. Every capability that Readiness OS delivers.',
    });
  }, []);

  return (
    <PageLayout>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div style={{ background: NAVY, padding: '72px 0 56px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 40px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: GOLD, marginBottom: 16, textTransform: 'uppercase' }}>
            Platform Capabilities
          </div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 48, fontWeight: 700, color: IVORY,
            lineHeight: 1.2, marginBottom: 20, maxWidth: 720,
          }}>
            The Entire Decision Lifecycle.<br />Not One Moment of It.
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(240,237,228,0.65)', lineHeight: 1.8, maxWidth: 660, fontWeight: 400, marginBottom: 32 }}>
            Readiness OS does not help organizations respond faster. It helps them prepare better, decide with higher confidence, execute with greater precision, and compound organizational intelligence over time — so every response is faster, sharper, and more likely to succeed than the last one.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { label: '170 Readiness Protocols', sub: 'Pre-staged' },
              { label: '221 Triggers', sub: 'Armed & monitoring' },
              { label: '248+ Data Points', sub: 'Every 15 minutes' },
              { label: '12 Minutes', sub: '30 days → 12 min' },
              { label: '3,600×', sub: 'Execution head start' },
            ].map(({ label, sub }) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 0, padding: '10px 18px', textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: GOLD, lineHeight: 1 }}>{label}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.68)', fontWeight: 600, marginTop: 3 }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Phase sections ────────────────────────────────────────────────── */}
      <div style={{ background: '#FAFAFA', padding: '64px 0' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 40px' }}>

          {PHASES.map((phase, pi) => {
            const PhaseIcon = phase.icon;
            return (
              <div key={phase.id} style={{ marginBottom: pi < PHASES.length - 1 ? 64 : 0 }}>
                {/* Phase header */}
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: 20,
                  background: phase.bg, border: `1px solid ${phase.border}`,
                  borderLeft: `4px solid ${phase.color}`,
                  borderRadius: 0, padding: '24px 28px', marginBottom: 28,
                }}>
                  <div style={{ background: phase.color, borderRadius: 0, padding: 10, flexShrink: 0, marginTop: 2 }}>
                    <PhaseIcon size={18} color="white" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', color: phase.color, textTransform: 'uppercase' }}>{phase.phase}</span>
                      <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600 }}>·</span>
                      <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600 }}>{phase.sub}</span>
                    </div>
                    <h2 style={{ fontSize: 26, fontWeight: 700, color: NAVY, marginBottom: 10, lineHeight: 1.2 }}>{phase.label}</h2>
                    <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.75, margin: 0, fontWeight: 500, fontStyle: 'italic', maxWidth: 680 }}>
                      "{phase.thesis}"
                    </p>
                  </div>
                </div>

                {/* Capabilities */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {phase.capabilities.map(({ title, detail }, i) => (
                    <div
                      key={i}
                      style={{
                        background: 'white',
                        border: '1px solid #E2E8F0',
                        borderTop: `3px solid ${phase.color}`,
                        borderRadius: 0, padding: '20px 22px',
                        gridColumn: phase.capabilities.length % 2 !== 0 && i === phase.capabilities.length - 1 ? 'span 2' : undefined,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                        <CheckCircle2 size={14} color={phase.color} style={{ flexShrink: 0, marginTop: 2 }} />
                        <span style={{ fontSize: 14, fontWeight: 700, color: NAVY, lineHeight: 1.3 }}>{title}</span>
                      </div>
                      <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.75, margin: 0, fontWeight: 400 }}>{detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Platform breadth ──────────────────────────────────────────────── */}
      <div style={{ background: 'white', padding: '64px 0', borderTop: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 40px' }}>
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: TEAL, marginBottom: 10, textTransform: 'uppercase' }}>Platform Breadth</div>
            <h2 style={{ fontSize: 30, fontWeight: 700, color: NAVY, marginBottom: 10 }}>What the Full System Delivers</h2>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, maxWidth: 560, fontWeight: 400 }}>
              Beyond the four phases — the tools, views, and capabilities that make the decision lifecycle complete and auditable.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            {PLATFORM_CAPABILITIES.map(({ icon: Icon, title, detail }) => (
              <div key={title} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 0, padding: '20px 22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
                  <Icon size={15} color={TEAL} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{title}</span>
                </div>
                <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.7, margin: 0, fontWeight: 400 }}>{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Positioning statement ─────────────────────────────────────────── */}
      <div style={{ background: NAVY, padding: '64px 0' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', padding: '0 40px', textAlign: 'center' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: GOLD, marginBottom: 20, textTransform: 'uppercase' }}>The Positioning</div>
          <blockquote style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 28, fontWeight: 400, color: IVORY,
            lineHeight: 1.65, margin: '0 0 28px', fontStyle: 'italic',
          }}>
            "Most tools address one moment. Readiness OS addresses the entire decision lifecycle — from signal detection through decision preparation through activated execution through institutional learning — and every cycle through that lifecycle makes the organization more capable of handling the next one."
          </blockquote>
          <p style={{ fontSize: 13, color: 'rgba(240,237,228,0.5)', fontWeight: 600, marginBottom: 36 }}>
            That is not a coordination tool. That is not an execution tool.<br />
            That is a strategic intelligence system that compounds organizational decision capability over time.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/mission-control" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: GOLD, color: NAVY, borderRadius: 0,
              padding: '13px 28px', fontSize: 13, fontWeight: 800,
              textDecoration: 'none', letterSpacing: '0.03em',
            }}>
              Enter Mission Control <ArrowRight size={13} />
            </Link>
            <Link href="/executive-scenarios" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.08)', color: IVORY,
              border: '1px solid rgba(255,255,255,0.18)', borderRadius: 0,
              padding: '13px 28px', fontSize: 13, fontWeight: 700,
              textDecoration: 'none',
            }}>
              See Your Scenario <ChevronRight size={13} />
            </Link>
            <Link href="/investor-resources" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'transparent', color: 'rgba(240,237,228,0.5)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 0,
              padding: '13px 24px', fontSize: 13, fontWeight: 600,
              textDecoration: 'none',
            }}>
              Investor Materials
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
