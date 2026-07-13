import { useState, useEffect, useRef, CSSProperties } from 'react';
import { useLocation } from 'wouter';
import { updatePageMetadata } from '@/lib/seo';
import PageLayout from "@/components/layout/PageLayout";
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
const RED = "#EF4444";
const PROBLEM = "#C0392B";

const CG: CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BC: CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${Math.round(n)}`;
}
function fmtFull(n: number) {
  return '$' + Math.round(n).toLocaleString();
}

const YES = () => <CheckCircle className="w-5 h-5 mx-auto" style={{ color: TEAL }} />;
const NO  = () => <XCircle    className="w-5 h-5 mx-auto" style={{ color: "#D1D5DB" }} />;
const PT  = () => <Minus      className="w-5 h-5 mx-auto" style={{ color: GOLD }} />;

const gaps = [
  { n: "01", icon: Radio,      name: "Detection",            today: "Someone notices something. Maybe. By the time it's escalated, the window is already moving.",                                           os: "231 triggers monitored 24/7 across 39 live sources. The system detects before the humans do." },
  { n: "02", icon: Tag,        name: "Recognition",          today: "What kind of situation is this? The classification debate consumes the first hours.",                                                   os: "180 pre-staged protocols across 9 domains. The situation is named and matched the moment the signal fires." },
  { n: "03", icon: Shield,     name: "Authority",            today: "A meeting called to decide who should be in charge of deciding. The authority chain was never settled in advance.",                    os: "Decision rights pre-defined cold. The authority chain is established before the situation presents itself." },
  { n: "04", icon: Users,      name: "Team Assembly",        today: "A meeting to plan who should be in the meeting. The right people assembled slowly, manually.",                                         os: "Named stakeholders, notification sequences, and team composition pre-built for every protocol." },
  { n: "05", icon: DollarSign, name: "Budget Authorization", today: "Emergency spend requires an emergency committee. Financial response lags by days.",                                                    os: "Emergency budget pre-authorized per protocol. Protocol #0 covers first-in-class unknowns." },
  { n: "06", icon: PhoneCall,  name: "External Resources",   today: "Outside counsel, PR firms, incident responders — called cold, briefed from scratch, at emergency rates.",                             os: "Named retainers on standby, already briefed, already contracted before the situation arrives." },
  { n: "07", icon: List,       name: "Sequencing",           today: "What happens first, second, third? Three teams argue the order while the window closes.",                                              os: "Execution sequence pre-defined for every protocol. 22+ tasks deploy in the right order automatically." },
  { n: "08", icon: Plug,       name: "Systems Coordination", today: "Manual handoffs, chasing access, disconnected platforms, data that can't move without a human in the middle.",                         os: "55+ connectors pre-integrated. Microsoft, Salesforce, ServiceNow, Slack, Jira. Systems coordinate automatically." },
  { n: "09", icon: MessageSquare, name: "Communication",     today: "What do we say to the board, employees, customers, regulators? Drafted from scratch under pressure.",                                 os: "Communication protocols pre-staged per situation. Approved messaging frameworks ready before arrival." },
  { n: "10", icon: FileCheck,  name: "Compliance & Disclosure", today: "What are the legal obligations? Counsel is asked during the crisis, not before it.",                                               os: "Disclosure requirements mapped, compliance obligations defined, response timelines pre-built per situation type." },
  { n: "11", icon: BookMarked, name: "Governance Record",    today: "Decisions made verbally, documentation incomplete, audit trail missing. Creates board liability.",                                    os: "Close-out gate creates the complete governance record automatically — who authorized, when, what rationale." },
  { n: "12", icon: RefreshCw,  name: "Learning & Encoding",  today: "The debrief that never happens. Knowledge walks out the door.",                                                                       os: "ADVANCE loop. After 3 activations each protocol is classified proven or disproven and updated." },
];

type Coverage = 'no' | 'partial' | 'yes';
interface Competitor { label: string; examples: string; gaps: Coverage[]; verdict: string; }
const competitors: Competitor[] = [
  { label: "Strategy Consultants",          examples: "McKinsey · Bain · BCG · Kroll · FTI Consulting",                   gaps: ['no','partial','partial','partial','no','yes','partial','no','partial','partial','partial','no'],       verdict: "Engaged after the situation. Build the response in real time at emergency rates. 0 of 12 gaps closed proactively." },
  { label: "Crisis Communications",         examples: "Edelman · Hill+Knowlton · Teneo · Brunswick",                      gaps: ['no','partial','no','partial','no','yes','partial','no','yes','no','partial','no'],                   verdict: "Reputation management once the situation is already public. Closes gap 9 well. Gaps 1–8, 10–12 remain open." },
  { label: "IBP / Planning Frameworks",     examples: "S&OP · IBP · Governance Frameworks · Scenario Planning",           gaps: ['partial','partial','partial','no','no','no','partial','partial','no','partial','partial','partial'],   verdict: "Coherent on paper. The execution layer — pre-staged protocols, automatic assembly, pre-authorized budget — does not exist." },
  { label: "Workflow & Orchestration",      examples: "ServiceNow · Power Automate · Monday.com · Asana",                 gaps: ['no','no','partial','partial','no','no','yes','yes','partial','no','partial','partial'],              verdict: "Strong sequencing once someone defines the workflow. Assumes coordination already exists when the situation arrives." },
  { label: "AI Agent Platforms",            examples: "Salesforce Agentforce · Microsoft Copilot · Agentic tools",        gaps: ['partial','partial','partial','partial','no','no','partial','partial','partial','no','partial','partial'], verdict: "Automate tasks within defined workflows. Don't govern who responds, with what authority, in what sequence." },
  { label: "GRC / Risk Platforms",          examples: "Archer · OneTrust · Riskonnect · ServiceNow GRC",                 gaps: ['partial','partial','partial','no','partial','no','no','partial','no','yes','yes','partial'],          verdict: "Strong on compliance tracking and governance record. Doesn't activate the coordinated response when risk materializes." },
  { label: "BCP / Incident Response Tools", examples: "Everbridge · Fusion Risk Management · Castellan",                  gaps: ['partial','partial','partial','partial','partial','partial','partial','partial','partial','partial','partial','partial'], verdict: "Designed for continuity and operational incidents. Doesn't cover activist investor, M&A, regulatory inquiry." },
  { label: "Tabletop Exercise Facilitators",examples: "Mandiant · CrowdStrike · Booz Allen Hamilton",                    gaps: ['no','partial','partial','no','no','no','partial','no','partial','no','partial','partial'],            verdict: "Periodic simulations. Test readiness on a schedule — not in real time. The next situation still starts from zero." },
  { label: "Internal PMO / Transformation", examples: "Chief of Staff · Internal PMO · Enterprise Transformation Office", gaps: ['no','no','partial','partial','partial','partial','partial','no','partial','partial','partial','partial'],  verdict: "6–8 of 12 gaps covered reactively by capable people. When those individuals leave, the capability leaves with them." },
];
const gapLabels = gaps.map(g => g.name);

interface SliderProps { label: string; value: number; min: number; max: number; step: number; format: (v: number) => string; onChange: (v: number) => void; }
function Slider({ label, value, min, max, step, format, onChange }: SliderProps) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.8)', ...BC }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 800, color: GOLD, fontFamily: "monospace" }}>{format(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: GOLD, cursor: "pointer" }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
        <span>{format(min)}</span><span>{format(max)}</span>
      </div>
    </div>
  );
}

export default function TheGap() {
  const [, nav] = useLocation();

  const [inputs, setInputs] = useState({ execCount: 6, execHourlyRate: 500, triggersPerYear: 8, mobilizationDays: 21 });
  const [seconds, setSeconds] = useState(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    updatePageMetadata({
      title: "The Gap — 12 Mobilization Failures & What They Cost | VaughnMartin Readiness OS",
      description: "Every enterprise improvises through 12 distinct mobilization failures every time a strategic situation fires. See what that costs in real time — and why nothing else closes all 12.",
      ogTitle: "The Gap — Readiness OS",
      ogDescription: "The live cost of your mobilization gap, and the 12 failures that create it. No alternative closes all 12.",
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setSeconds(Math.round((Date.now() - startTime.current) / 1000)), 1000);
    return () => clearInterval(interval);
  }, []);

  const hoursPerMob = inputs.mobilizationDays * 8;
  const costPerTrigger = inputs.execCount * inputs.execHourlyRate * hoursPerMob;
  const annualTax = costPerTrigger * inputs.triggersPerYear;
  const costPerSecond = annualTax / (365 * 24 * 3600);
  const evaluationCost = costPerSecond * seconds;
  const costPerDay = annualTax / 365;
  const netSavings = annualTax - 150000;
  const roi = Math.round((netSavings / 150000) * 100);
  const breakEven = 150000 / costPerTrigger;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const set = (k: keyof typeof inputs) => (v: number) => setInputs(p => ({ ...p, [k]: v }));

  return (
    <PageLayout>
      {/* ── BACK NAV ── */}
      <div style={{ background: NAVY, borderBottom: '1px solid rgba(201,168,76,0.15)', padding: '10px 48px' }}>
        <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', padding: 0 }}>
          ← Back
        </button>
      </div>
      {/* ── HERO ── */}
      <section style={{ background: NAVY, padding: '56px 0 72px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px' }}>
          <p style={{ ...BC, color: GOLD, fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 16 }}>The Mobilization Gap</p>
          <h1 style={{ ...CG, color: '#fff', fontSize: 'clamp(36px,5vw,60px)', fontWeight: 600, lineHeight: 1.1, marginBottom: 20, maxWidth: 820 }}>
            12 failures. Every situation. <em style={{ color: GOLD }}>Every time.</em><br />And a real-time cost for each one.
          </h1>
          <p style={{ ...BC, color: GOLD, fontSize: 15, fontWeight: 700, lineHeight: 1.6, maxWidth: 680, marginBottom: 18 }}>
            These are not coordination failures. They are mobilization questions your organization answers from scratch every time. Readiness OS answers them before the situation arrives.
          </p>
          <p style={{ color: '#CBD5E1', fontSize: 17, lineHeight: 1.7, maxWidth: 640, marginBottom: 40 }}>
            Not because the people are wrong — because the response was never built before the trigger arrived.
            Below: what your current model costs while you read this, and why no alternative closes all 12 gaps.
          </p>
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            {[['12', 'Mobilization Gaps Closed'], ['180', 'Protocols Pre-Staged'], ['12 min', 'To Full Execution'], ['3,600×', 'Execution Head Start']].map(([n, l]) => (
              <div key={n} style={{ textAlign: 'center' }}>
                <div style={{ ...BC, color: GOLD, fontSize: 32, fontWeight: 700, lineHeight: 1 }}>{n}</div>
                <div style={{ ...BC, color: '#94A3B8', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MOBILIZATION TAX ── */}
      <section style={{ background: '#0F1629', borderBottom: '1px solid rgba(201,168,76,0.2)', padding: '32px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px', display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <p style={{ ...BC, color: GOLD, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase' as const, fontWeight: 700, marginBottom: 8 }}>The Mobilization Tax</p>
            <p style={{ ...CG, color: '#fff', fontSize: 18, fontWeight: 600, lineHeight: 1.6, marginBottom: 12 }}>
              Leadership time. Outside counsel. Revenue at risk during the mobilization window. Operational disruption. External advisors engaged cold at emergency rates. Compliance and governance costs.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.7, marginBottom: 8 }}>
              Every one of these components runs simultaneously during the 30 days before a single coordinated response action is taken. Across 15 to 20 situations annually that is <strong style={{ color: GOLD }}>$25.5M to $34M per year</strong> in organizational drag that has no line item on any budget and appears on no balance sheet.
            </p>
            <p style={{ ...BC, color: TEAL, fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', margin: 0 }}>
              It is invisible because nobody owns it. Nobody has ever named it. Nobody has ever built a platform to close it. Until now.
            </p>
          </div>
          <div style={{ display: 'flex', flexShrink: 0 }}>
            {[
              { n: '$1.7M',        label: 'Mobilization Tax',  sub: 'per strategic situation' },
              { n: '$25.5M–$34M', label: 'Annual Tax',         sub: '15–20 situations/year'  },
              { n: '$0',           label: 'With Readiness OS', sub: 'pre-staged before trigger' },
            ].map((s, i) => (
              <div key={s.n} style={{ padding: '18px 28px', borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.08)' : 'none', textAlign: 'center' }}>
                <div style={{ ...CG, color: i === 2 ? TEAL : GOLD, fontSize: 26, fontWeight: 700, lineHeight: 1, marginBottom: 4 }}>{s.n}</div>
                <div style={{ ...BC, color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', marginBottom: 2 }}>{s.label}</div>
                <div style={{ ...BC, color: 'rgba(255,255,255,0.42)', fontSize: 10, letterSpacing: '0.05em' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRANSITION ── */}
      <section style={{ background: IVORY, borderBottom: `1px solid ${BORDER}`, padding: '28px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <p style={{ ...BC, color: NAVY, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700 }}>
              The 12 Gaps — Today vs. Readiness OS
            </p>
            <p style={{ ...BC, color: MUTED, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              15–20 of these situations per enterprise, per year
            </p>
          </div>
          <p style={{ color: '#4B5563', fontSize: 14, lineHeight: 1.6, maxWidth: 720 }}>
            This isn't a feature list — it's a diagnostic. As you read the 12 below, count how many your organization currently faces. Most enterprises recognize 7 or more.
          </p>
        </div>
      </section>

      {/* ── 12 GAP CARDS ── */}
      <section style={{ background: '#fff', padding: '64px 0' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 24 }}>
          {gaps.map((g) => {
            const Icon = g.icon;
            return (
              <div key={g.n} style={{ border: `1px solid ${BORDER}`, borderRadius: '0.15rem', overflow: 'hidden', background: '#FAFAF9' }}>
                <div style={{ padding: '16px 22px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ ...BC, color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', minWidth: 28 }}>{g.n}</span>
                  <Icon className="w-4 h-4" style={{ color: NAVY, flexShrink: 0 }} />
                  <span style={{ ...BC, color: NAVY, fontSize: 14, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{g.name}</span>
                </div>
                <div style={{ padding: '14px 22px', borderBottom: `1px solid ${BORDER}`, background: '#FEF9F9' }}>
                  <p style={{ ...BC, color: PROBLEM, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 5 }}>Today</p>
                  <p style={{ color: '#374151', fontSize: 13, lineHeight: 1.6 }}>{g.today}</p>
                </div>
                <div style={{ padding: '14px 22px' }}>
                  <p style={{ ...BC, color: TEAL, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 5 }}>Readiness OS</p>
                  <p style={{ color: '#1F2937', fontSize: 13, lineHeight: 1.6 }}>{g.os}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── LIVE COUNTER + CALCULATOR ── */}
      <section style={{ background: '#0F1629', padding: '72px 0 64px', borderBottom: `1px solid rgba(239,68,68,0.2)` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 24, height: 2, background: RED }} />
              <span style={{ ...BC, fontSize: 10, fontWeight: 800, letterSpacing: '0.32em', textTransform: 'uppercase', color: RED }}>The Cost of Waiting</span>
              <div style={{ width: 24, height: 2, background: RED }} />
            </div>
            <h2 style={{ ...CG, color: '#fff', fontSize: 'clamp(26px,3.5vw,42px)', fontWeight: 600, lineHeight: 1.15, marginBottom: 10 }}>
              What is your current mobilization model<br /><em style={{ color: GOLD }}>costing you right now?</em>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, maxWidth: 520, margin: '0 auto' }}>
              Adjust the inputs to your organization. The counter started when you opened this page.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40, alignItems: 'start' }}>
            {/* Sliders */}
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '36px 32px' }}>
              <Slider label="Senior executives involved per trigger" value={inputs.execCount} min={3} max={20} step={1} format={v => `${v} executives`} onChange={set('execCount')} />
              <Slider label="Average executive cost per hour" value={inputs.execHourlyRate} min={250} max={1500} step={50} format={v => `$${v}/hr`} onChange={set('execHourlyRate')} />
              <Slider label="Strategic situations per year" value={inputs.triggersPerYear} min={2} max={24} step={1} format={v => `${v} per year`} onChange={set('triggersPerYear')} />
              <Slider label="Current mobilization days — trigger to coordinated action" value={inputs.mobilizationDays} min={3} max={60} step={1} format={v => `${v} days`} onChange={set('mobilizationDays')} />
              <div style={{ marginTop: 8, padding: '10px 14px', background: 'rgba(43,138,110,0.1)', borderLeft: `3px solid ${TEAL}` }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
                  <strong style={{ color: TEAL }}>Mobilization time</strong> = days between trigger detection and coordinated, authorized response in motion.
                </div>
              </div>
            </div>

            {/* Results */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Annual tax — lead figure */}
              <div style={{ background: 'rgba(239,68,68,0.08)', border: `1.5px solid ${RED}`, padding: '26px 24px' }}>
                <div style={{ ...BC, fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', color: RED, textTransform: 'uppercase', marginBottom: 10 }}>Your Annual Mobilization Tax</div>
                <div style={{ fontSize: 'clamp(36px,5vw,54px)', fontWeight: 700, color: RED, fontFamily: 'monospace', lineHeight: 1, marginBottom: 8 }}>{fmt(annualTax)}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>{inputs.execCount} exec × ${inputs.execHourlyRate}/hr × {hoursPerMob} hrs × {inputs.triggersPerYear} situations/yr</div>
                <div style={{ fontSize: 12, color: 'rgba(239,68,68,0.9)', fontWeight: 700 }}>{fmtFull(Math.round(costPerDay / 24))}/hr, every hour your response model stays this slow</div>
              </div>
              {/* Live counter — secondary, de-emphasized */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '12px 18px' }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Accumulated while you've been on this page ({mins > 0 ? `${mins}m ${secs}s` : `${secs}s`})</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'rgba(239,68,68,0.85)', fontFamily: 'monospace' }}>{fmtFull(evaluationCost)}</span>
              </div>
              {/* vs Readiness OS */}
              <div style={{ background: 'rgba(43,138,110,0.08)', border: `1.5px solid ${TEAL}`, padding: '20px 24px' }}>
                <div style={{ ...BC, fontSize: 10, fontWeight: 800, letterSpacing: '0.15em', color: TEAL, textTransform: 'uppercase', marginBottom: 12 }}>vs. Readiness OS Core — $150K/yr</div>
                {[
                  { label: 'Your annual cost', value: fmt(annualTax), color: RED },
                  { label: 'Net annual saving', value: netSavings > 0 ? fmt(netSavings) : '—', color: netSavings > 0 ? TEAL : MUTED },
                  { label: 'First-year ROI', value: `${roi.toLocaleString()}%`, color: '#fff' },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 2 ? '1px solid rgba(43,138,110,0.2)' : 'none' }}>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{row.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: row.color, fontFamily: 'monospace' }}>{row.value}</span>
                  </div>
                ))}
                <div style={{ marginTop: 12, padding: '8px 12px', background: TEAL, textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: '#fff', fontWeight: 700 }}>
                    Break-even: {breakEven < 1 ? 'first activation' : `${breakEven.toFixed(1)} situations`}
                  </div>
                </div>
              </div>
              <button
                onClick={() => nav('/founding-partner-program')}
                style={{ ...BC, background: GOLD, color: NAVY, border: 'none', padding: '16px', fontSize: 11, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              >
                Apply for Founding Partner Access <ArrowRight style={{ width: 13, height: 13 }} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── DIVIDER STATEMENT ── */}
      <section style={{ background: NAVY, padding: '56px 48px', textAlign: 'center' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <p style={{ ...BC, color: GOLD, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 18 }}>The Unclaimed Position</p>
          <p style={{ ...CG, color: '#fff', fontSize: 'clamp(20px,2.8vw,32px)', fontWeight: 600, lineHeight: 1.5 }}>
            Every alternative is either reactive by design, narrow in scope, or governance-only with no execution layer.
            None of them pre-stage the complete response —{' '}
            <span style={{ color: GOLD }}>authority, coordination, sequencing, systems, communication, compliance, budget, external resources, and governance record</span>
            {' '}— before the situation presents itself.
          </p>
          <div style={{ width: 48, height: 2, background: GOLD, margin: '28px auto 0' }} />
        </div>
      </section>

      {/* ── COMPETITOR MATRIX ── */}
      <section style={{ background: '#fff', padding: '72px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
          <div style={{ marginBottom: 36 }}>
            <p style={{ ...BC, color: GOLD, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>Who Closes Which Gaps</p>
            <h2 style={{ ...CG, color: NAVY, fontSize: 'clamp(24px,3vw,38px)', fontWeight: 600, lineHeight: 1.2, maxWidth: 640 }}>
              Nine categories. Zero alternatives that close all 12.
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 24, marginBottom: 28, flexWrap: 'wrap' }}>
            {[{ el: <YES />, label: 'Closes this gap' }, { el: <PT />, label: 'Partial / narrow' }, { el: <NO />, label: 'Does not close' }].map(({ el, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{el}<span style={{ color: MUTED, fontSize: 13 }}>{label}</span></div>
            ))}
          </div>
          <div style={{ overflowX: 'auto', border: `1px solid ${BORDER}`, borderRadius: '0.15rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
              <thead>
                <tr style={{ background: NAVY }}>
                  <th style={{ ...BC, color: '#94A3B8', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '14px 20px', textAlign: 'left', minWidth: 200, fontWeight: 600 }}>Category</th>
                  {gapLabels.map((label, i) => (
                    <th key={label} style={{ ...BC, color: '#94A3B8', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '10px 8px', textAlign: 'center', fontWeight: 600, minWidth: 68 }}>
                      <span style={{ color: GOLD, display: 'block', fontSize: 9 }}>{String(i + 1).padStart(2, '0')}</span>
                      {label.split(' ')[0]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {competitors.map((c, ci) => (
                  <tr key={c.label} style={{ borderBottom: `1px solid ${BORDER}`, background: ci % 2 === 0 ? '#FAFAF9' : '#fff' }}>
                    <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                      <div style={{ ...BC, color: NAVY, fontSize: 13, fontWeight: 700, letterSpacing: '0.04em', marginBottom: 2 }}>{c.label}</div>
                      <div style={{ color: MUTED, fontSize: 11 }}>{c.examples}</div>
                    </td>
                    {c.gaps.map((v, gi) => (
                      <td key={gi} style={{ padding: '12px 8px', textAlign: 'center', verticalAlign: 'middle' }}>
                        {v === 'yes' ? <YES /> : v === 'partial' ? <PT /> : <NO />}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr style={{ background: NAVY, borderTop: '2px solid ' + GOLD }}>
                  <td style={{ padding: '18px 20px', verticalAlign: 'top' }}>
                    <div style={{ ...BC, color: GOLD, fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', marginBottom: 2 }}>Readiness OS</div>
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

          {/* Verdict cards */}
          <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
            {competitors.map((c) => (
              <div key={c.label} style={{ padding: '20px 24px', border: `1px solid ${BORDER}`, borderRadius: '0.15rem', background: '#FAFAF9' }}>
                <div style={{ ...BC, color: NAVY, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>{c.label}</div>
                <p style={{ color: '#4B5563', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{c.verdict}</p>
              </div>
            ))}
            <div style={{ padding: '20px 24px', border: `2px solid ${GOLD}`, borderRadius: '0.15rem', background: '#FFFDF5' }}>
              <div style={{ ...BC, color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Readiness OS</div>
              <p style={{ color: NAVY, fontSize: 13, lineHeight: 1.6, fontWeight: 500, margin: 0 }}>
                The only platform that closes all 12 gaps before the trigger fires. Pre-staged. Executive-authorized. Continuously improving.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: NAVY, padding: '80px 0', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 32px' }}>
          <p style={{ ...BC, color: GOLD, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 16 }}>Founding Partner Program</p>
          <h3 style={{ ...CG, color: '#fff', fontSize: 'clamp(26px,3vw,40px)', fontWeight: 600, lineHeight: 1.25, marginBottom: 18 }}>
            Close all 12 gaps before your<br /><em style={{ color: GOLD }}>next situation fires.</em>
          </h3>
          <p style={{ color: '#94A3B8', fontSize: 15, lineHeight: 1.7, marginBottom: 36 }}>
            12 total seats. 90-day validated partnership. $75K — 100% credited at close.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => nav('/founding-partner-program')}
              style={{ ...BC, background: GOLD, color: NAVY, border: 'none', padding: '14px 32px', fontSize: 12, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '0.15rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              Apply for Founding Partner Access <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => nav('/executive-brief')}
              style={{ ...BC, background: 'transparent', color: '#CBD5E1', border: '1px solid #334155', padding: '14px 32px', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '0.15rem' }}>
              Download Executive Brief
            </button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
