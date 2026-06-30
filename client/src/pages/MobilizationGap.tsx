import PageLayout from '@/components/layout/PageLayout';
import { useEffect } from 'react';
import { updatePageMetadata } from '@/lib/seo';
import { useLocation } from 'wouter';
import {
  Radio, Tag, Shield, Users, DollarSign, PhoneCall,
  List, Plug, MessageSquare, FileCheck, BookMarked, RefreshCw,
  CheckCircle, XCircle, Minus, ArrowRight
} from 'lucide-react';

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";
const BORDER = "#E8E4DC";
const MUTED = "#6B7280";
const PROBLEM = "#C0392B";

const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BC: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };

const YES = () => <CheckCircle className="w-5 h-5 mx-auto" style={{ color: TEAL }} />;
const NO  = () => <XCircle    className="w-5 h-5 mx-auto" style={{ color: "#D1D5DB" }} />;
const PT  = () => <Minus      className="w-5 h-5 mx-auto" style={{ color: GOLD }} />;

const gaps = [
  {
    n: "01", icon: Radio, name: "Detection",
    today: "Someone notices something. Maybe. By the time it's escalated, the window is already moving.",
    os: "231 triggers monitored 24/7 across 39 live sources, 248+ data points, 15-min cycles. The system detects before the humans do."
  },
  {
    n: "02", icon: Tag, name: "Recognition",
    today: "What kind of situation is this? Legal? Operational? Reputational? The classification debate consumes the first hours.",
    os: "180 pre-staged protocols across 9 strategic domains. The situation is already named and matched the moment the signal fires."
  },
  {
    n: "03", icon: Shield, name: "Authority",
    today: "Who owns this? A meeting is called to decide who should be in charge of deciding. The authority chain was never settled in advance.",
    os: "Decision rights pre-defined cold. The authority chain is already established before the situation presents itself. No debate under pressure."
  },
  {
    n: "04", icon: Users, name: "Team Assembly",
    today: "A meeting to plan who should be in the meeting. The right people identified reactively, notified manually, assembled slowly.",
    os: "Named stakeholders, notification sequences, and team composition pre-built for every protocol. Assembly is automatic, not improvised."
  },
  {
    n: "05", icon: DollarSign, name: "Budget Authorization",
    today: "Emergency spend requires an emergency committee. Approvals that normally take days are needed in hours. Financial response lags.",
    os: "Emergency budget pre-authorized per protocol. Protocol #0 covers first-in-class unknowns with pre-authorized spend already in place."
  },
  {
    n: "06", icon: PhoneCall, name: "External Resources",
    today: "Outside counsel, PR firms, incident responders — called cold, briefed from scratch, engaged at emergency rates under pressure.",
    os: "Named retainers on standby, already briefed on your protocols, already contracted before the situation arrives."
  },
  {
    n: "07", icon: List, name: "Sequencing",
    today: "What happens first, second, third? Three teams argue the order of operations while the window closes.",
    os: "Execution sequence pre-defined for every protocol. 22+ tasks deploy in the right order automatically."
  },
  {
    n: "08", icon: Plug, name: "Systems Coordination",
    today: "Manual handoffs, chasing access, disconnected platforms, data that can't move without a human in the middle.",
    os: "55+ connectors pre-integrated. Microsoft, Salesforce, ServiceNow, Slack, Jira. Systems coordinate automatically."
  },
  {
    n: "09", icon: MessageSquare, name: "Communication",
    today: "What do we say to the board, employees, customers, regulators? Drafted from scratch under pressure, usually wrong the first time.",
    os: "Communication protocols pre-staged per situation. Approved messaging frameworks ready before the situation arrives."
  },
  {
    n: "10", icon: FileCheck, name: "Compliance & Disclosure",
    today: "What are the legal obligations? What timelines apply? Counsel is asked this question during the crisis, not before it.",
    os: "Disclosure requirements mapped, compliance obligations defined, response timelines pre-built per situation type."
  },
  {
    n: "11", icon: BookMarked, name: "Governance Record",
    today: "Decisions made verbally, documentation incomplete, audit trail missing. Creates board liability and legal exposure.",
    os: "Close-out gate creates the complete governance record automatically — who authorized, when, what rationale. The record exists before anyone asks."
  },
  {
    n: "12", icon: RefreshCw, name: "Learning & Encoding",
    today: "The debrief that never happens. Or happens once, produces a document nobody reads, and knowledge walks out the door.",
    os: "ADVANCE loop. After 3 activations, each protocol is classified proven or disproven and updated. The organization compounds with every situation."
  },
];

type Coverage = 'no' | 'partial' | 'yes';
interface Competitor {
  label: string;
  examples: string;
  gaps: Coverage[];
  verdict: string;
}

const competitors: Competitor[] = [
  {
    label: "Consultants",
    examples: "McKinsey · Bain · BCG · Kroll · FTI",
    gaps: ['no','no','no','no','no','partial','no','no','no','partial','partial','no'],
    verdict: "Engaged after the situation. Build the response in real time at emergency rates. No institutional memory retained by the client."
  },
  {
    label: "Crisis Management",
    examples: "Edelman · Brunswick · Teneo · H+K",
    gaps: ['no','no','no','partial','no','partial','no','no','partial','partial','no','no'],
    verdict: "Communications and reputation only. Reactive by design. Don't cover operational, financial, regulatory, or technology layers."
  },
  {
    label: "IBP / Planning Frameworks",
    examples: "S&OP · Integrated Business Planning",
    gaps: ['no','partial','partial','no','no','no','partial','no','no','no','partial','no'],
    verdict: "Define decision rights on paper. Coherent in design. Don't deploy a coordinated response in minutes when the situation presents itself."
  },
  {
    label: "Workflow Platforms",
    examples: "ServiceNow · Monday.com · Asana",
    gaps: ['no','no','no','partial','no','no','partial','partial','no','no','partial','no'],
    verdict: "Coordinate tasks after a human has assembled the team and defined the response. Assume the organization is already coordinated."
  },
  {
    label: "AI Agent Platforms",
    examples: "Copilot · Agentforce · Agentic tools",
    gaps: ['no','no','no','no','no','no','partial','partial','no','no','no','no'],
    verdict: "Automate tasks within defined workflows. Don't govern who responds, when, in what sequence, with what authority."
  },
  {
    label: "GRC / Risk Platforms",
    examples: "Archer · OneTrust · Riskonnect",
    gaps: ['partial','partial','partial','no','no','no','no','no','no','partial','partial','no'],
    verdict: "Map risk and compliance obligations. Don't activate a coordinated response when the risk materializes."
  },
  {
    label: "BCP / Incident Response",
    examples: "Everbridge · Fusion · Archer IRM",
    gaps: ['partial','no','partial','partial','no','no','partial','no','no','partial','partial','no'],
    verdict: "Narrow scope — IT and operational continuity only. Don't cover the full 12-gap mobilization problem."
  },
];

const gapLabels = gaps.map(g => g.name);

export default function MobilizationGap() {
  const [, nav] = useLocation();

  useEffect(() => {
    updatePageMetadata(
      'The 12-Gap Mobilization Problem | VaughnMartin Readiness OS',
      'Every organization improvises through 12 distinct mobilization failures every time a strategic situation fires. Readiness OS closes all 12 before the trigger arrives.'
    );
  }, []);

  return (
    <PageLayout>
      {/* ── HERO ── */}
      <section style={{ background: NAVY, padding: '96px 0 72px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 48px' }}>
          <p style={{ ...BC, color: GOLD, fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 16 }}>
            The Mobilization Gap
          </p>
          <h1 style={{ ...CG, color: '#FFFFFF', fontSize: 'clamp(38px,5vw,64px)', fontWeight: 600, lineHeight: 1.1, marginBottom: 24, maxWidth: 780 }}>
            Every enterprise improvises through<br />
            <span style={{ color: GOLD }}>12 distinct failures</span> every time<br />a situation fires.
          </h1>
          <p style={{ color: '#CBD5E1', fontSize: 18, lineHeight: 1.7, maxWidth: 640, marginBottom: 40 }}>
            Not because the people are wrong. Because the response was never built before the trigger arrived.
            Every alternative on the market — consultants, platforms, frameworks, AI tools — shares one gap:
            they are reactive by design. Readiness OS closes all 12 before the trigger fires.
          </p>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[['12', 'Mobilization Gaps Closed'], ['180', 'Protocols Pre-Staged'], ['12 min', 'To Full Execution']].map(([n, l]) => (
              <div key={n} style={{ textAlign: 'center' }}>
                <div style={{ ...BC, color: GOLD, fontSize: 36, fontWeight: 700, lineHeight: 1 }}>{n}</div>
                <div style={{ ...BC, color: '#94A3B8', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION LABEL ── */}
      <section style={{ background: IVORY, borderBottom: `1px solid ${BORDER}`, padding: '20px 48px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ ...BC, color: NAVY, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700 }}>
            The 12 Gaps — Today vs. Readiness OS
          </p>
          <p style={{ ...BC, color: MUTED, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            15–20 of these situations per enterprise, per year
          </p>
        </div>
      </section>

      {/* ── 12 GAP CARDS ── */}
      <section style={{ background: '#FFFFFF', padding: '64px 48px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 24 }}>
          {gaps.map((g) => {
            const Icon = g.icon;
            return (
              <div key={g.n} style={{ border: `1px solid ${BORDER}`, borderRadius: '0.15rem', overflow: 'hidden', background: '#FAFAF9' }}>
                {/* card header */}
                <div style={{ padding: '18px 24px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ ...BC, color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', minWidth: 28 }}>{g.n}</span>
                  <Icon className="w-4 h-4" style={{ color: NAVY, flexShrink: 0 }} />
                  <span style={{ ...BC, color: NAVY, fontSize: 15, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{g.name}</span>
                </div>
                {/* today */}
                <div style={{ padding: '14px 24px', borderBottom: `1px solid ${BORDER}`, background: '#FEF9F9' }}>
                  <p style={{ ...BC, color: PROBLEM, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>Today</p>
                  <p style={{ color: '#374151', fontSize: 13.5, lineHeight: 1.6 }}>{g.today}</p>
                </div>
                {/* readiness os */}
                <div style={{ padding: '14px 24px' }}>
                  <p style={{ ...BC, color: TEAL, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>Readiness OS</p>
                  <p style={{ color: '#1F2937', fontSize: 13.5, lineHeight: 1.6 }}>{g.os}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── DIVIDER STATEMENT ── */}
      <section style={{ background: NAVY, padding: '56px 48px', textAlign: 'center' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <p style={{ ...BC, color: GOLD, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 18 }}>The Unclaimed Position</p>
          <p style={{ ...CG, color: '#FFFFFF', fontSize: 'clamp(22px,3vw,34px)', fontWeight: 600, lineHeight: 1.45 }}>
            Every alternative is either reactive by design, narrow in scope, or governance-only with no execution layer.
            None of them pre-stage the complete response —{' '}
            <span style={{ color: GOLD }}>authority, coordination, sequencing, systems, communication, compliance, budget, external resources, and governance record</span>
            {' '}— before the situation presents itself.
          </p>
          <div style={{ width: 48, height: 2, background: GOLD, margin: '28px auto 0' }} />
        </div>
      </section>

      {/* ── COMPETITOR MATRIX ── */}
      <section style={{ background: '#FFFFFF', padding: '72px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 40 }}>
            <p style={{ ...BC, color: GOLD, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>
              Who Closes Which Gaps
            </p>
            <h2 style={{ ...CG, color: NAVY, fontSize: 'clamp(26px,3vw,40px)', fontWeight: 600, lineHeight: 1.2, maxWidth: 640 }}>
              Seven categories. Zero alternatives that close all 12.
            </h2>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 24, marginBottom: 32, flexWrap: 'wrap' }}>
            {[
              { el: <YES />, label: 'Closes this gap' },
              { el: <PT />, label: 'Partial / narrow' },
              { el: <NO />, label: 'Does not close' },
            ].map(({ el, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {el}
                <span style={{ color: MUTED, fontSize: 13 }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Scrollable matrix */}
          <div style={{ overflowX: 'auto', border: `1px solid ${BORDER}`, borderRadius: '0.15rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
              <thead>
                <tr style={{ background: NAVY }}>
                  <th style={{ ...BC, color: '#94A3B8', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '14px 20px', textAlign: 'left', minWidth: 200, fontWeight: 600 }}>
                    Category
                  </th>
                  {gapLabels.map((label, i) => (
                    <th key={label} style={{ ...BC, color: '#94A3B8', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '10px 8px', textAlign: 'center', fontWeight: 600, minWidth: 68 }}>
                      <span style={{ color: GOLD, display: 'block', fontSize: 9 }}>{String(i+1).padStart(2,'0')}</span>
                      {label.split(' ')[0]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {competitors.map((c, ci) => (
                  <tr key={c.label} style={{ borderBottom: `1px solid ${BORDER}`, background: ci % 2 === 0 ? '#FAFAF9' : '#FFFFFF' }}>
                    <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                      <div style={{ ...BC, color: NAVY, fontSize: 14, fontWeight: 700, letterSpacing: '0.04em', marginBottom: 2 }}>{c.label}</div>
                      <div style={{ color: MUTED, fontSize: 11 }}>{c.examples}</div>
                    </td>
                    {c.gaps.map((v, gi) => (
                      <td key={gi} style={{ padding: '12px 8px', textAlign: 'center', verticalAlign: 'middle' }}>
                        {v === 'yes' ? <YES /> : v === 'partial' ? <PT /> : <NO />}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Readiness OS row */}
                <tr style={{ background: NAVY, borderTop: '2px solid ' + GOLD }}>
                  <td style={{ padding: '18px 20px', verticalAlign: 'top' }}>
                    <div style={{ ...BC, color: GOLD, fontSize: 14, fontWeight: 700, letterSpacing: '0.06em', marginBottom: 2 }}>Readiness OS</div>
                    <div style={{ color: '#94A3B8', fontSize: 11 }}>VaughnMartin · Readiness Infrastructure</div>
                  </td>
                  {gaps.map((_, gi) => (
                    <td key={gi} style={{ padding: '12px 8px', textAlign: 'center', verticalAlign: 'middle' }}>
                      <CheckCircle className="w-5 h-5 mx-auto" style={{ color: TEAL }} />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Verdict rows */}
          <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16 }}>
            {competitors.map((c) => (
              <div key={c.label} style={{ padding: '20px 24px', border: `1px solid ${BORDER}`, borderRadius: '0.15rem', background: '#FAFAF9' }}>
                <div style={{ ...BC, color: NAVY, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>{c.label}</div>
                <p style={{ color: '#4B5563', fontSize: 13, lineHeight: 1.6 }}>{c.verdict}</p>
              </div>
            ))}
            <div style={{ padding: '20px 24px', border: `2px solid ${GOLD}`, borderRadius: '0.15rem', background: '#FFFDF5' }}>
              <div style={{ ...BC, color: GOLD, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Readiness OS</div>
              <p style={{ color: NAVY, fontSize: 13, lineHeight: 1.6, fontWeight: 500 }}>
                The only platform that closes all 12 gaps before the trigger fires.
                Pre-staged. Executive-authorized. Continuously improving.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ONE-LINE SUMMARY ── */}
      <section style={{ background: IVORY, padding: '40px 48px', borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <p style={{ color: NAVY, fontSize: 16, lineHeight: 1.7, fontWeight: 500, maxWidth: 860 }}>
            <strong style={{ color: GOLD }}>Every other approach</strong> — IBP frameworks, governance designs, AI workflow tools, coordination platforms —
            assumes the organization will build the response when the situation arrives.
            Readiness OS is the only product built on the assumption that{' '}
            <strong>the response needs to already exist before the situation does.</strong>
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: NAVY, padding: '72px 48px', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <p style={{ ...BC, color: GOLD, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 16 }}>Founding Partner Program</p>
          <h3 style={{ ...CG, color: '#FFFFFF', fontSize: 'clamp(26px,3vw,38px)', fontWeight: 600, lineHeight: 1.3, marginBottom: 20 }}>
            Close all 12 gaps before your next situation fires.
          </h3>
          <p style={{ color: '#94A3B8', fontSize: 16, lineHeight: 1.7, marginBottom: 36 }}>
            12 total seats. 90-day validated partnership with direct founder involvement.
            $75K · 100% credited at close.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => nav('/request-access')}
              style={{ ...BC, background: GOLD, color: NAVY, border: 'none', padding: '14px 32px', fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '0.15rem', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              Apply for Founding Partner Access <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => nav('/executive-brief')}
              style={{ ...BC, background: 'transparent', color: '#CBD5E1', border: '1px solid #334155', padding: '14px 32px', fontSize: 13, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '0.15rem' }}
            >
              Download Executive Brief
            </button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
