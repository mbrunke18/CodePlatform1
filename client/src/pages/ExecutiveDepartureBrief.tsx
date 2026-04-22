import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import {
  AlertTriangle, CheckCircle2, ArrowRight, Zap,
  Phone, MessageSquare, FileText, Clock
} from 'lucide-react';

/* ── Brand Constants ──────────────────────────────── */
const NAVY_BG   = "#132558";
const NAVY_DEEP = "#0E1A42";
const GOLD      = "#C9A84C";
const TEAL      = "#2B8A6E";
const WHITE     = "#F0EDE4";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const DM: React.CSSProperties = { fontFamily: "'DM Sans', sans-serif" };
const GOLD_GRAD = "linear-gradient(135deg, #C9A84C 0%, #E8C96D 50%, #C9A84C 100%)";

/* Readable text shades on dark navy */
const T1 = WHITE;                        /* headings — full ivory */
const T2 = "rgba(240,237,228,0.90)";    /* body copy */
const T3 = "rgba(240,237,228,0.70)";    /* secondary labels */
const T4 = "rgba(240,237,228,0.50)";    /* timestamps, minor metadata */

/* ── Stakeholder cascade data ─────────────────────── */
const STAKEHOLDERS = [
  { role: "Board Chair",           action: "Priority brief transmitted",              delay: 400,  color: GOLD  },
  { role: "Audit Committee Chair", action: "Emergency session calendar hold",         delay: 900,  color: GOLD  },
  { role: "CEO",                   action: "Acknowledged — interim plan reviewed",    delay: 1400, color: TEAL  },
  { role: "CHRO",                  action: "Acknowledged — search protocol activated",delay: 1900, color: TEAL  },
  { role: "General Counsel",       action: "Non-compete review initiated",            delay: 2400, color: TEAL  },
  { role: "VP Investor Relations", action: "Talking points pre-loaded",               delay: 2900, color: GOLD },
  { role: "VP Controller",         action: "Interim CFO designation sent",            delay: 3400, color: GOLD },
];

/* ── Task deployment data ─────────────────────────── */
const TASKS = [
  { role: "CEO",             task: "Board notification call",                        due: "2 hours"  },
  { role: "CHRO",            task: "Interim CFO designation — VP Controller",        due: "Same day" },
  { role: "General Counsel", task: "Departure terms legal review",                   due: "4 hours"  },
  { role: "Communications",  task: "Press release — template pre-loaded",            due: "4 hours"  },
  { role: "VP IR",           task: "Analyst talking points — pre-drafted",           due: "2 hours"  },
  { role: "Interim CFO",     task: "Direct report communication — script ready",     due: "Today"    },
  { role: "CHRO",            task: "Executive search kickoff — firms pre-approved",  due: "Today"    },
];

/* ── Chaos cards (before state) ───────────────────── */
const CHAOS_ITEMS = [
  { icon: MessageSquare, text: "Emergency Slack threads firing in every direction",              who: "HR · Legal · Comms · Finance" },
  { icon: FileText,      text: "CHRO searching for succession docs that may not exist",          who: "SharePoint · Confluence · Email" },
  { icon: Phone,         text: "Board chair texting. Analyst at Morgan Stanley already calling.", who: "IR unprepared. No talking points." },
  { icon: Clock,         text: "Board alignment call scheduled for tomorrow. 24 hours lost.",    who: "Market speculation begins tonight." },
];

/* ── Outcome comparison ───────────────────────────── */
const OUTCOMES = [
  { metric: "Time to board notification",    before: "24–48 hours",   after: "2 hours"  },
  { metric: "Interim leadership designated", before: "3–5 days",      after: "Same day" },
  { metric: "Market communication ready",    before: "48–72 hours",   after: "4 hours"  },
  { metric: "Executive search initiated",    before: "1–2 weeks",     after: "Same day" },
  { metric: "Coordination meetings required",before: "6–10 meetings", after: "0"        },
];

/* ─────────────────────────────────────────────────── */
export default function ExecutiveDepartureBrief() {
  const [, navigate] = useLocation();
  const [phase, setPhase] = useState<'situation' | 'activated' | 'complete'>('situation');
  const [activating, setActivating] = useState(false);
  const [visibleStakeholders, setVisibleStakeholders] = useState<number[]>([]);
  const [visibleTasks, setVisibleTasks] = useState<number[]>([]);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activationRef = useRef<HTMLDivElement>(null);
  const outcomeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (timerRunning) {
      // 40ms per tick → 443 ticks ≈ 17.7 real seconds to reach 7:23
      timerRef.current = setInterval(() => {
        setTimerSeconds(s => {
          if (s >= 443) {
            clearInterval(timerRef.current!);
            setTimerRunning(false);
            setPhase('complete');
            setTimeout(() => outcomeRef.current?.scrollIntoView({ behavior: 'smooth' }), 600);
            return 443;
          }
          return s + 1;
        });
      }, 40);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerRunning]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  function handleActivate() {
    if (activating || phase !== 'situation') return;
    setActivating(true);

    // 1. Render activated content immediately
    setPhase('activated');

    // 2. Scroll once content has rendered (400ms grace)
    setTimeout(() => activationRef.current?.scrollIntoView({ behavior: 'smooth' }), 400);

    // 3. Timer starts 1 second after click — gives user a moment to orient
    setTimeout(() => setTimerRunning(true), 1000);

    // 4. Stakeholder cascade: 1 every 1.5s, starting at 2s
    //    All 7 appear by ~11s
    STAKEHOLDERS.forEach((_, i) => {
      setTimeout(() => setVisibleStakeholders(prev => [...prev, i]), 2000 + i * 1500);
    });

    // 5. Tasks deploy starting at 12s, 1 every 800ms
    //    All 7 tasks visible by ~17s — right as timer finishes
    TASKS.forEach((_, i) => {
      setTimeout(() => setVisibleTasks(prev => [...prev, i]), 12000 + i * 800);
    });
  }

  return (
    <div style={{ background: NAVY_BG, minHeight: '100vh', ...DM }}>

      {/* ── Sticky Header ─────────────────────────────── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(19,37,88,0.96)', backdropFilter: 'blur(12px)',
        borderBottom: `1px solid rgba(201,168,76,0.2)`,
        padding: '0 40px', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 28, height: 28, borderRadius: 0, border: `1.5px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ ...CG, fontSize: 11, fontWeight: 700, color: GOLD }}>VM</span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: T3, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            VaughnMartin · Readiness OS
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: T4, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          <span style={{ width: 5, height: 5, background: '#3BAF8A', borderRadius: 0, display: 'inline-block', boxShadow: '0 0 6px #3BAF8A' }} />
          Executive Brief · Confidential
        </div>
      </header>

      {/* ── Section 1: THE SITUATION ─────────────────── */}
      <section style={{ paddingTop: 110, paddingBottom: 80, paddingLeft: 48, paddingRight: 48, position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        <div style={{ position: 'absolute', top: -200, right: -200, width: 800, height: 800, background: 'radial-gradient(circle, rgba(201,168,76,0.09) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 1 }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36 }}>
            <div style={{ width: 32, height: 1, background: GOLD }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD }}>
              Executive Scenario · Leadership Continuity
            </span>
          </div>

          <div style={{ fontSize: 13, color: T4, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 20 }}>
            MONDAY · 6:47 AM
          </div>

          <h1 style={{ ...CG, fontSize: 'clamp(40px, 6vw, 70px)', fontWeight: 600, color: T1, lineHeight: 1.1, marginBottom: 28, letterSpacing: '-0.01em' }}>
            Your CFO just resigned.<br />
            <em style={{ color: GOLD }}>Effective in two weeks.</em>
          </h1>

          <p style={{ fontSize: 17, color: T2, lineHeight: 1.8, maxWidth: 620, marginBottom: 48, fontWeight: 500 }}>
            She has an offer from your largest competitor. The board chair is already texting.
            Your investor relations team is asking what to say if the Street calls.
            And your Q3 earnings call is in eleven days.
          </p>

          {/* Incoming messages */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, marginBottom: 56 }}>
            {[
              { channel: "Board Chair",   msg: "Just saw the news. We need to talk. Today.",                          type: "SMS",    urgent: true  },
              { channel: "IR Director",   msg: "Analyst at Morgan Stanley asking if we can confirm departure",        type: "Email",  urgent: true  },
              { channel: "CHRO",          msg: "Do we have a succession plan documented anywhere?",                   type: "Slack",  urgent: false },
              { channel: "CFO's Directs", msg: "Starting to ask questions about their own futures",                   type: "Signal", urgent: false },
            ].map(({ channel, msg, type, urgent }, i) => (
              <div key={i} style={{
                background: urgent ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${urgent ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.14)'}`,
                borderLeft: `3px solid ${urgent ? '#EF4444' : 'rgba(255,255,255,0.2)'}`,
                borderRadius: 0, padding: '14px 16px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: urgent ? '#FF8080' : T3, letterSpacing: '0.06em' }}>{channel}</span>
                  <span style={{ fontSize: 9, color: T4, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{type}</span>
                </div>
                <p style={{ fontSize: 13, color: T2, lineHeight: 1.55, margin: 0, fontWeight: 500 }}>{msg}</p>
              </div>
            ))}
          </div>

          {/* Section divider */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 44, marginBottom: 44 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: T4, marginBottom: 0 }}>
              What happens in most organizations
            </div>
          </div>

          {/* Chaos cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 64 }} className="exec-dep-chaos-grid">
            {CHAOS_ITEMS.map(({ icon: Icon, text, who }, i) => (
              <div key={i} style={{
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)',
                borderRadius: 0, padding: '20px',
              }}>
                <Icon size={16} color="#FF6B6B" style={{ marginBottom: 10 }} />
                <p style={{ fontSize: 14, color: T2, lineHeight: 1.6, marginBottom: 8, fontWeight: 500 }}>{text}</p>
                <span style={{ fontSize: 11, color: '#FF8888', fontWeight: 600 }}>{who}</span>
              </div>
            ))}
          </div>

          {/* Structural problem callout */}
          <div style={{
            background: 'rgba(201,168,76,0.09)', border: '1px solid rgba(201,168,76,0.25)',
            borderLeft: `4px solid ${GOLD}`, borderRadius: 0, padding: '28px 32px', marginBottom: 56,
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: 14 }}>
              The Structural Problem
            </div>
            <p style={{ fontSize: 16, color: T2, lineHeight: 1.75, margin: 0, fontWeight: 500 }}>
              The problem isn't that executive departures are unpredictable. The problem is that
              every decision about how to respond — who communicates what, who steps into interim coverage,
              what the board hears first — is being made for the first time, under pressure,
              with no pre-staged framework to execute against.
            </p>
          </div>

        </div>
      </section>

      {/* ── Section 2: SIGNAL DETECTED ───────────────── */}
      <section style={{ background: NAVY_DEEP, borderTop: '1px solid rgba(255,255,255,0.10)', borderBottom: '1px solid rgba(255,255,255,0.10)', padding: '72px 48px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36 }}>
            <div style={{ width: 32, height: 1, background: TEAL }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: TEAL }}>
              Readiness OS · Signal Detection
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="exec-dep-detect-grid">

            {/* Pulse Map */}
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 0, padding: 28 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: T4, marginBottom: 20 }}>War Room Pulse Map</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {[
                  { label: "Market", active: false }, { label: "Regulatory", active: false },
                  { label: "Finance", active: false }, { label: "Operations", active: false },
                  { label: "Leadership", active: true }, { label: "Technology", active: false },
                  { label: "Customers", active: false }, { label: "ESG", active: false },
                  { label: "Supply Chain", active: false },
                ].map(({ label, active }) => (
                  <div key={label} style={{
                    padding: '6px 13px', borderRadius: 0,
                    background: active ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${active ? 'rgba(239,68,68,0.55)' : 'rgba(255,255,255,0.12)'}`,
                    fontSize: 11, fontWeight: active ? 700 : 500,
                    color: active ? '#FF6B6B' : T3,
                    display: 'flex', alignItems: 'center', gap: 6,
                    animation: active ? 'pulse-node 1.5s infinite' : 'none',
                  }}>
                    {active && <span style={{ width: 6, height: 6, background: '#EF4444', borderRadius: 0, display: 'inline-block', boxShadow: '0 0 8px #EF4444' }} />}
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Detection card */}
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 0, padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                <AlertTriangle size={16} color="#EF4444" />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#FF6B6B' }}>Trigger Detected</span>
              </div>
              <div style={{ ...CG, fontSize: 24, fontWeight: 600, color: T1, marginBottom: 6, lineHeight: 1.2 }}>
                C-Suite Executive Departure
              </div>
              <div style={{ fontSize: 13, color: T3, marginBottom: 24, fontWeight: 500 }}>CFO Level · Tier 1 Leadership Event</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[
                  { label: "Detection Confidence", value: "94%" },
                  { label: "Affected Domains",      value: "Finance · Board · IR · Ops" },
                  { label: "Prepared responses Matched",      value: "1 primary" },
                  { label: "Time to Activation",     value: "Immediate" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: T4, marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T1 }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Prepared response match */}
          <div style={{ marginTop: 20, background: 'rgba(43,138,110,0.10)', border: '1px solid rgba(43,138,110,0.30)', borderRadius: 0, padding: '22px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: TEAL, marginBottom: 7, fontWeight: 700 }}>Prepared response Recommended</div>
              <div style={{ ...CG, fontSize: 22, fontWeight: 600, color: T1 }}>C-Suite Continuity Response — CFO Departure</div>
              <div style={{ fontSize: 12, color: T3, marginTop: 5, fontWeight: 500 }}>170 prepared responses evaluated · 1 matched at 94% confidence · 12 leadership continuity variants available</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(43,138,110,0.15)', border: '1px solid rgba(43,138,110,0.35)', padding: '7px 14px', borderRadius: 0 }}>
              <span style={{ width: 6, height: 6, background: TEAL, borderRadius: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: TEAL, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Pre-Staged · Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: ACTIVATION ────────────────────── */}
      <section style={{ padding: '72px 48px' }} ref={activationRef}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>

          {phase === 'situation' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: T4, marginBottom: 22 }}>
                One executive authorization
              </div>
              <h2 style={{ ...CG, fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 600, color: T1, marginBottom: 14, lineHeight: 1.2 }}>
                The organization is already staged.<br />
                <em style={{ color: GOLD }}>Waiting for your signal.</em>
              </h2>
              <p style={{ fontSize: 15, color: T2, maxWidth: 500, margin: '0 auto 44px', lineHeight: 1.75, fontWeight: 500 }}>
                Roles, tasks, communications, and succession protocol were pre-staged before today.
                Every decision that can be pre-made already was.
                The only decision left is yours.
              </p>
              <button
                onClick={handleActivate}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 14,
                  background: GOLD_GRAD, color: '#0A0F2E', border: 'none', borderRadius: 0,
                  padding: '20px 56px', fontSize: 16, fontWeight: 800, cursor: 'pointer',
                  letterSpacing: 0.5,
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={e => { (e.currentTarget as HTMLElement).style.opacity = '0.9'; }}
                onMouseOut={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
              >
                <Zap size={18} />
                ACTIVATE PREPARED RESPONSE
              </button>
              <div style={{ fontSize: 12, color: T4, marginTop: 14 }}>C-Suite Continuity Response — CFO Departure</div>
            </div>
          )}

          {phase !== 'situation' && (
            <>
              {/* Timer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: 6 }}>Execution Clock</div>
                  <div style={{ ...CG, fontSize: 56, fontWeight: 700, color: timerSeconds >= 443 ? TEAL : GOLD, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                    {formatTime(timerSeconds)}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(43,138,110,0.12)', border: '1px solid rgba(43,138,110,0.35)', padding: '10px 20px', borderRadius: 0 }}>
                  <span style={{ width: 7, height: 7, background: TEAL, borderRadius: 0, display: 'inline-block', boxShadow: `0 0 8px ${TEAL}`, animation: timerRunning ? 'pulse-node 1s infinite' : 'none' }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: TEAL, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    {phase === 'complete' ? 'Execution Complete' : 'Deploying...'}
                  </span>
                </div>
              </div>

              {/* Stakeholder cascade */}
              <div style={{ marginBottom: 36 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: T4, marginBottom: 14 }}>
                  Stakeholder Notification Cascade
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {STAKEHOLDERS.map(({ role, action, color }, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                      background: visibleStakeholders.includes(i) ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
                      borderTop: `1px solid ${visibleStakeholders.includes(i) ? `${color}40` : 'rgba(255,255,255,0.07)'}`,
                      borderRight: `1px solid ${visibleStakeholders.includes(i) ? `${color}40` : 'rgba(255,255,255,0.07)'}`,
                      borderBottom: `1px solid ${visibleStakeholders.includes(i) ? `${color}40` : 'rgba(255,255,255,0.07)'}`,
                      borderLeft: `3px solid ${visibleStakeholders.includes(i) ? color : 'rgba(255,255,255,0.08)'}`,
                      borderRadius: 0, padding: '13px 16px',
                      opacity: visibleStakeholders.includes(i) ? 1 : 0.3,
                      transition: 'all 0.4s ease',
                      transform: visibleStakeholders.includes(i) ? 'translateX(0)' : 'translateX(-10px)',
                    }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: visibleStakeholders.includes(i) ? T1 : T4, minWidth: 190 }}>{role}</span>
                      <span style={{ fontSize: 13, color: T2, flex: 1, fontWeight: 500 }}>{action}</span>
                      {visibleStakeholders.includes(i) && <CheckCircle2 size={14} color={color} style={{ flexShrink: 0 }} />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Task deployment */}
              {visibleTasks.length > 0 && (
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: T4, marginBottom: 14 }}>
                    Task Deployment — Simultaneous
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>
                    {TASKS.map(({ role, task, due }, i) => (
                      <div key={i} style={{
                        background: 'rgba(43,138,110,0.08)',
                        border: `1px solid ${visibleTasks.includes(i) ? 'rgba(43,138,110,0.30)' : 'rgba(255,255,255,0.05)'}`,
                        borderRadius: 0, padding: '14px 16px',
                        opacity: visibleTasks.includes(i) ? 1 : 0,
                        transition: 'all 0.35s ease',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: TEAL, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{role}</span>
                          <span style={{ fontSize: 10, color: T4, fontWeight: 600 }}>Due: {due}</span>
                        </div>
                        <div style={{ fontSize: 13, color: T2, lineHeight: 1.45, fontWeight: 500 }}>{task}</div>
                        <div style={{ fontSize: 10, color: TEAL, marginTop: 6, fontStyle: 'italic', fontWeight: 600 }}>Pre-staged — no drafting required</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── Section 4: OUTCOME ───────────────────────── */}
      <section
        ref={outcomeRef}
        style={{
          background: NAVY_DEEP, borderTop: '1px solid rgba(255,255,255,0.10)',
          padding: '72px 48px',
          opacity: phase === 'complete' ? 1 : 0.12,
          transition: 'opacity 0.8s ease',
        }}
      >
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36 }}>
            <div style={{ width: 32, height: 1, background: GOLD }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD }}>
              7 Minutes 23 Seconds Later
            </span>
          </div>

          <h2 style={{ ...CG, fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 600, color: T1, marginBottom: 36, lineHeight: 1.2 }}>
            Board briefed. Interim CFO designated.<br />
            <em style={{ color: TEAL }}>IR talking points ready.</em>
          </h2>

          {/* Before / After table */}
          <div style={{ borderRadius: 0, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.12)', marginBottom: 44 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', background: 'rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
              {['Outcome', 'Without Readiness OS', 'With Readiness OS'].map((h, i) => (
                <div key={h} style={{ padding: '12px 20px', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: i === 2 ? TEAL : T3 }}>
                  {h}
                </div>
              ))}
            </div>
            {OUTCOMES.map(({ metric, before, after }, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', borderBottom: i < OUTCOMES.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none', background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                <div style={{ padding: '14px 20px', fontSize: 13, color: T2, fontWeight: 500 }}>{metric}</div>
                <div style={{ padding: '14px 20px', fontSize: 13, color: '#FF8080', fontWeight: 700 }}>{before}</div>
                <div style={{ padding: '14px 20px', fontSize: 13, color: TEAL, fontWeight: 700 }}>{after}</div>
              </div>
            ))}
          </div>

          {/* ROI strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 0 }}>
            {[
              { label: "Average C-suite departure cost",       value: "$23M",    sub: "Industry average — McKinsey" },
              { label: "Value protected — coordinated response", value: "$9–14M", sub: "40–60% cost reduction" },
              { label: "Annual Readiness OS investment",       value: "$250K",   sub: "Pays for itself on first activation" },
            ].map(({ label, value, sub }) => (
              <div key={label} style={{ background: 'rgba(201,168,76,0.09)', border: '1px solid rgba(201,168,76,0.22)', borderRadius: 0, padding: '20px' }}>
                <div style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: T4, marginBottom: 8, fontWeight: 700 }}>{label}</div>
                <div style={{ ...CG, fontSize: 32, fontWeight: 700, color: GOLD, marginBottom: 4 }}>{value}</div>
                <div style={{ fontSize: 11, color: T3, fontWeight: 500 }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5: THE CLOSE ─────────────────────── */}
      <section style={{ padding: '80px 48px 120px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: -300, left: -300, width: 800, height: 800, background: 'radial-gradient(circle, rgba(43,138,110,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>

          <h2 style={{ ...CG, fontSize: 'clamp(30px, 4vw, 50px)', fontWeight: 600, color: T1, lineHeight: 1.2, marginBottom: 28 }}>
            You know someone on your executive<br />team will leave.
          </h2>
          <p style={{ fontSize: 16, color: T2, lineHeight: 1.8, marginBottom: 16, maxWidth: 580, margin: '0 auto 16px', fontWeight: 500 }}>
            You don't know when. You don't know who. You don't know if it will be voluntary
            or involuntary, planned or sudden.
          </p>
          <p style={{ fontSize: 16, color: T2, lineHeight: 1.8, marginBottom: 44, maxWidth: 580, margin: '0 auto 44px', fontWeight: 500 }}>
            The question is whether that morning is a scramble — board chairs texting,
            IR improvising, CHRO searching for documents that don't exist — or whether
            every decision is already made.
          </p>

          <div style={{ background: 'rgba(201,168,76,0.10)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 0, padding: '28px 40px', marginBottom: 48, maxWidth: 560, margin: '0 auto 48px' }}>
            <p style={{ ...CG, fontSize: 22, color: T1, lineHeight: 1.55, margin: 0, fontStyle: 'italic' }}>
              "What's a coordinated leadership<br />transition worth to your board?"
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <button
              onClick={() => navigate('/request-access')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 12,
                background: GOLD_GRAD, color: '#0A0F2E', border: 'none', borderRadius: 0,
                padding: '18px 48px', fontSize: 15, fontWeight: 800, cursor: 'pointer',
                letterSpacing: 0.4,
                transition: 'all 0.2s ease',
              }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.opacity = '0.9'; }}
              onMouseOut={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
            >
              Request Executive Pilot
              <ArrowRight size={16} />
            </button>
            <span style={{ fontSize: 12, color: T4, fontWeight: 600 }}>
              Fortune 1000 · Board-authorized pilots · 30-day activation arc
            </span>
          </div>

          {/* Footer */}
          <div style={{ marginTop: 72, paddingTop: 36, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 22, height: 22, borderRadius: 0, border: `1px solid rgba(201,168,76,0.4)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ ...CG, fontSize: 9, fontWeight: 700, color: 'rgba(201,168,76,0.6)' }}>VM</span>
              </div>
              <span style={{ fontSize: 11, color: T4, letterSpacing: '0.1em', fontWeight: 600 }}>VaughnMartin Readiness OS</span>
            </div>
            <p style={{ fontSize: 11, color: T4, margin: 0, fontWeight: 500 }}>
              170 prepared responses · 221 triggers · 248+ data points · 9 strategic domains · 12-minute execution
            </p>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes pulse-node {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @media (max-width: 640px) {
          .exec-dep-chaos-grid { grid-template-columns: 1fr !important; }
          .exec-dep-detect-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
