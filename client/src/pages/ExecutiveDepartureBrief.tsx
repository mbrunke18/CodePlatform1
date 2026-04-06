import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import {
  AlertTriangle, Shield, Clock, Users, TrendingUp,
  CheckCircle2, ArrowRight, Zap, Activity, Eye,
  Phone, Mail, MessageSquare, FileText, Search, Building2
} from 'lucide-react';

/* ── Brand Constants ──────────────────────────────── */
const NAVY      = "#0A0F2E";
const NAVY_BG   = "#132558";
const GOLD      = "#C9A84C";
const TEAL      = "#2B8A6E";
const IVORY     = "#F0EDE4";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const DM: React.CSSProperties = { fontFamily: "'DM Sans', sans-serif" };
const GOLD_GRAD = "linear-gradient(135deg, #C9A84C 0%, #E8C96D 50%, #C9A84C 100%)";

/* ── Stakeholder cascade data ─────────────────────── */
const STAKEHOLDERS = [
  { role: "Board Chair",         action: "Priority brief transmitted",        delay: 400,  color: GOLD  },
  { role: "Audit Committee Chair", action: "Emergency session calendar hold", delay: 900,  color: GOLD  },
  { role: "CEO",                 action: "Acknowledged — interim plan reviewed", delay: 1400, color: TEAL },
  { role: "CHRO",                action: "Acknowledged — search protocol activated", delay: 1900, color: TEAL },
  { role: "General Counsel",     action: "Non-compete review initiated",       delay: 2400, color: TEAL },
  { role: "VP Investor Relations", action: "Talking points pre-loaded",        delay: 2900, color: "#8B5CF6" },
  { role: "VP Controller",       action: "Interim CFO designation sent",       delay: 3400, color: "#8B5CF6" },
];

/* ── Task deployment data ─────────────────────────── */
const TASKS = [
  { role: "CEO",          task: "Board notification call",               due: "2 hours",   pre: true  },
  { role: "CHRO",         task: "Interim CFO designation — VP Controller", due: "Same day",  pre: true  },
  { role: "General Counsel", task: "Departure terms legal review",      due: "4 hours",   pre: true  },
  { role: "Communications", task: "Press release — template pre-loaded", due: "4 hours",   pre: true  },
  { role: "VP IR",        task: "Analyst talking points — pre-drafted",  due: "2 hours",   pre: true  },
  { role: "Interim CFO",  task: "Direct report communication — script ready", due: "Today", pre: true  },
  { role: "CHRO",         task: "Executive search kickoff — firms pre-approved", due: "Today", pre: true },
];

/* ── Chaos cards (before state) ───────────────────── */
const CHAOS_ITEMS = [
  { icon: MessageSquare, text: "Emergency Slack threads firing in every direction", who: "HR · Legal · Comms · Finance" },
  { icon: FileText,      text: "CHRO searching for succession docs that may not exist", who: "SharePoint · Confluence · Email" },
  { icon: Phone,         text: "Board chair texting. Analyst at Morgan Stanley already calling.", who: "IR unprepared. No talking points." },
  { icon: Clock,         text: "Board alignment call scheduled for tomorrow. 24 hours lost.", who: "Market speculation begins tonight." },
];

/* ── Outcome comparison ───────────────────────────── */
const OUTCOMES = [
  { metric: "Time to board notification",   before: "24–48 hours",   after: "2 hours" },
  { metric: "Interim leadership designated", before: "3–5 days",      after: "Same day" },
  { metric: "Market communication ready",   before: "48–72 hours",   after: "4 hours" },
  { metric: "Executive search initiated",   before: "1–2 weeks",     after: "Same day" },
  { metric: "Coordination meetings required", before: "6–10 meetings", after: "0" },
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

  /* Start timer after activation */
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(s => {
          if (s >= 443) { // 7:23
            clearInterval(timerRef.current!);
            setTimerRunning(false);
            setPhase('complete');
            setTimeout(() => outcomeRef.current?.scrollIntoView({ behavior: 'smooth' }), 400);
            return 443;
          }
          return s + 1;
        });
      }, 16); // fast-forward: ~7 real seconds to reach 7:23
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerRunning]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  function handleActivate() {
    if (activating || phase !== 'situation') return;
    setActivating(true);

    // Scroll to activation section
    setTimeout(() => activationRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

    // Start timer
    setTimeout(() => setTimerRunning(true), 600);

    // Cascade stakeholders
    STAKEHOLDERS.forEach((s, i) => {
      setTimeout(() => setVisibleStakeholders(prev => [...prev, i]), s.delay + 600);
    });

    // Tasks appear after stakeholders
    TASKS.forEach((_, i) => {
      setTimeout(() => setVisibleTasks(prev => [...prev, i]), 3800 + i * 350);
    });

    setTimeout(() => setPhase('activated'), 500);
  }

  return (
    <div style={{ background: NAVY, minHeight: '100vh', ...DM }}>

      {/* ── Minimal Header ───────────────────────────── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(10,15,46,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(201,168,76,0.12)',
        padding: '0 40px', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            border: `1.5px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ ...CG, fontSize: 11, fontWeight: 700, color: GOLD }}>VM</span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(240,237,228,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            VaughnMartin · Execution OS
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'rgba(240,237,228,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          <span style={{ width: 5, height: 5, background: '#3BAF8A', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 6px #3BAF8A' }} />
          Executive Brief · Confidential
        </div>
      </header>

      {/* ── Section 1: THE SITUATION ─────────────────── */}
      <section style={{ paddingTop: 130, paddingBottom: 100, paddingLeft: 48, paddingRight: 48, position: 'relative', overflow: 'hidden' }}>
        {/* Background grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(201,168,76,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.04) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        {/* Orb */}
        <div style={{ position: 'absolute', top: -200, right: -200, width: 800, height: 800, background: 'radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 1 }}>

          {/* Label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
            <div style={{ width: 32, height: 1, background: GOLD }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD }}>
              Executive Scenario · Leadership Continuity
            </span>
          </div>

          {/* Time stamp */}
          <div style={{ fontSize: 14, color: 'rgba(240,237,228,0.35)', fontWeight: 600, letterSpacing: '0.08em', marginBottom: 24 }}>
            MONDAY · 6:47 AM
          </div>

          {/* Headline */}
          <h1 style={{ ...CG, fontSize: 'clamp(42px, 6vw, 72px)', fontWeight: 600, color: '#F0EDE4', lineHeight: 1.1, marginBottom: 32, letterSpacing: '-0.01em' }}>
            Your CFO just resigned.<br />
            <em style={{ color: GOLD }}>Effective in two weeks.</em>
          </h1>

          <p style={{ fontSize: 17, color: 'rgba(240,237,228,0.6)', lineHeight: 1.75, maxWidth: 620, marginBottom: 48 }}>
            She has an offer from your largest competitor. The board chair is already texting. 
            Your investor relations team is asking what to say if the Street calls. 
            And your Q3 earnings call is in eleven days.
          </p>

          {/* Chaos signal — incoming messages */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, marginBottom: 64 }}>
            {[
              { channel: "Board Chair", msg: "Just saw the news. We need to talk. Today.", type: "SMS", urgent: true },
              { channel: "IR Director", msg: "Analyst at Morgan Stanley asking if we can confirm departure", type: "Email", urgent: true },
              { channel: "CHRO",        msg: "Do we have a succession plan documented anywhere?", type: "Slack", urgent: false },
              { channel: "CFO's Directs", msg: "Starting to ask questions about their own futures", type: "Signal", urgent: false },
            ].map(({ channel, msg, type, urgent }, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.04)', border: `1px solid ${urgent ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.08)'}`,
                borderLeft: `3px solid ${urgent ? '#EF4444' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 4, padding: '14px 16px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: urgent ? '#EF8888' : 'rgba(240,237,228,0.5)', letterSpacing: '0.06em' }}>{channel}</span>
                  <span style={{ fontSize: 9, color: 'rgba(240,237,228,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{type}</span>
                </div>
                <p style={{ fontSize: 12, color: 'rgba(240,237,228,0.55)', lineHeight: 1.5, margin: 0 }}>{msg}</p>
              </div>
            ))}
          </div>

          {/* Divider question */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 48, marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(240,237,228,0.3)', marginBottom: 20 }}>
              What happens in most organizations
            </div>
          </div>

          {/* CHAOS cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 72 }} className="exec-dep-chaos-grid">
            {CHAOS_ITEMS.map(({ icon: Icon, text, who }, i) => (
              <div key={i} style={{
                background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)',
                borderRadius: 4, padding: '20px 20px',
              }}>
                <Icon size={16} color="rgba(239,68,68,0.7)" style={{ marginBottom: 10 }} />
                <p style={{ fontSize: 13, color: 'rgba(240,237,228,0.7)', lineHeight: 1.6, marginBottom: 8 }}>{text}</p>
                <span style={{ fontSize: 10, color: 'rgba(239,68,68,0.5)', fontStyle: 'italic' }}>{who}</span>
              </div>
            ))}
          </div>

          {/* Insight */}
          <div style={{
            background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)',
            borderLeft: `3px solid ${GOLD}`, borderRadius: 4, padding: '28px 32px', marginBottom: 64,
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: 14 }}>
              The Structural Problem
            </div>
            <p style={{ fontSize: 16, color: 'rgba(240,237,228,0.75)', lineHeight: 1.7, margin: 0 }}>
              The problem isn't that executive departures are unpredictable. The problem is that 
              every decision about how to respond — who communicates what, who steps into interim coverage, 
              what the board hears first — is being made for the first time, under pressure, 
              with no pre-staged framework to execute against.
            </p>
          </div>

        </div>
      </section>

      {/* ── Section 2: SIGNAL DETECTED ───────────────── */}
      <section style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '80px 48px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
            <div style={{ width: 32, height: 1, background: TEAL }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: TEAL }}>
              Execution OS · Signal Detection
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="exec-dep-detect-grid">
            {/* Pulse Map mock */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: 28, position: 'relative', overflow: 'hidden' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,237,228,0.3)', marginBottom: 20 }}>War Room Pulse Map</div>
              {/* Domain nodes */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {[
                  { label: "Market", active: false }, { label: "Regulatory", active: false },
                  { label: "Finance", active: false }, { label: "Operations", active: false },
                  { label: "Leadership", active: true }, { label: "Technology", active: false },
                  { label: "Customers", active: false }, { label: "ESG", active: false },
                  { label: "Supply Chain", active: false },
                ].map(({ label, active }) => (
                  <div key={label} style={{
                    padding: '7px 14px', borderRadius: 20,
                    background: active ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${active ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'}`,
                    fontSize: 11, fontWeight: active ? 700 : 500,
                    color: active ? '#FF6B6B' : 'rgba(240,237,228,0.4)',
                    display: 'flex', alignItems: 'center', gap: 6,
                    animation: active ? 'pulse-node 1.5s infinite' : 'none',
                  }}>
                    {active && <span style={{ width: 6, height: 6, background: '#EF4444', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 8px #EF4444' }} />}
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Detection card */}
            <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 6, padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <AlertTriangle size={16} color="#EF4444" />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#EF4444' }}>Trigger Detected</span>
              </div>
              <div style={{ ...CG, fontSize: 24, fontWeight: 600, color: '#F0EDE4', marginBottom: 8, lineHeight: 1.2 }}>
                C-Suite Executive Departure
              </div>
              <div style={{ fontSize: 13, color: 'rgba(240,237,228,0.5)', marginBottom: 24 }}>CFO Level · Tier 1 Leadership Event</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { label: "Detection Confidence", value: "94%" },
                  { label: "Affected Domains", value: "Finance · Board · IR · Ops" },
                  { label: "Playbooks Matched", value: "1 primary" },
                  { label: "Time to Activation", value: "Immediate" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(240,237,228,0.3)', marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#F0EDE4' }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Playbook recommendation */}
          <div style={{ marginTop: 24, background: 'rgba(43,138,110,0.07)', border: '1px solid rgba(43,138,110,0.25)', borderRadius: 6, padding: '22px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: TEAL, marginBottom: 6, fontWeight: 700 }}>Playbook Recommended</div>
              <div style={{ ...CG, fontSize: 22, fontWeight: 600, color: '#F0EDE4' }}>C-Suite Continuity Response — CFO Departure</div>
              <div style={{ fontSize: 12, color: 'rgba(240,237,228,0.4)', marginTop: 4 }}>170 playbooks evaluated · 1 matched at 94% confidence · 12 leadership continuity variants available</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(43,138,110,0.12)', border: '1px solid rgba(43,138,110,0.3)', padding: '6px 14px', borderRadius: 3 }}>
              <span style={{ width: 6, height: 6, background: TEAL, borderRadius: '50%' }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: TEAL, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Pre-Staged · Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: ACTIVATION ────────────────────── */}
      <section style={{ padding: '80px 48px' }} ref={activationRef}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>

          {phase === 'situation' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(240,237,228,0.3)', marginBottom: 24 }}>
                One executive authorization
              </div>
              <h2 style={{ ...CG, fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 600, color: '#F0EDE4', marginBottom: 16, lineHeight: 1.2 }}>
                The organization is already staged.<br />
                <em style={{ color: GOLD }}>Waiting for your signal.</em>
              </h2>
              <p style={{ fontSize: 14, color: 'rgba(240,237,228,0.45)', maxWidth: 500, margin: '0 auto 48px', lineHeight: 1.7 }}>
                Roles, tasks, communications, and succession protocol were pre-staged before today. 
                Every decision that can be pre-made already was. 
                The only decision left is yours.
              </p>
              <button
                onClick={handleActivate}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 14,
                  background: GOLD_GRAD, color: NAVY, border: 'none', borderRadius: 4,
                  padding: '20px 56px', fontSize: 16, fontWeight: 800, cursor: 'pointer',
                  letterSpacing: 0.5, boxShadow: `0 0 60px rgba(201,168,76,0.3)`,
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={e => { const el = e.currentTarget; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = `0 8px 60px rgba(201,168,76,0.45)`; }}
                onMouseOut={e => { const el = e.currentTarget; el.style.transform = 'translateY(0)'; el.style.boxShadow = `0 0 60px rgba(201,168,76,0.3)`; }}
              >
                <Zap size={18} />
                ACTIVATE PLAYBOOK
              </button>
              <div style={{ fontSize: 11, color: 'rgba(240,237,228,0.2)', marginTop: 16 }}>
                C-Suite Continuity Response — CFO Departure
              </div>
            </div>
          )}

          {phase !== 'situation' && (
            <>
              {/* Timer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: 6 }}>Execution Clock</div>
                  <div style={{ ...CG, fontSize: 56, fontWeight: 700, color: timerSeconds >= 443 ? TEAL : GOLD, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                    {formatTime(timerSeconds)}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(43,138,110,0.1)', border: '1px solid rgba(43,138,110,0.3)', padding: '10px 20px', borderRadius: 3 }}>
                  <span style={{ width: 7, height: 7, background: TEAL, borderRadius: '50%', display: 'inline-block', boxShadow: `0 0 8px ${TEAL}`, animation: timerRunning ? 'pulse-node 1s infinite' : 'none' }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: TEAL, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    {phase === 'complete' ? 'Execution Complete' : 'Deploying...'}
                  </span>
                </div>
              </div>

              {/* Stakeholder cascade */}
              <div style={{ marginBottom: 40 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,237,228,0.3)', marginBottom: 16 }}>
                  Stakeholder Notification Cascade
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {STAKEHOLDERS.map(({ role, action, color }, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        gap: 16, background: 'rgba(255,255,255,0.03)',
                        border: `1px solid ${visibleStakeholders.includes(i) ? `${color}30` : 'rgba(255,255,255,0.05)'}`,
                        borderLeft: `3px solid ${visibleStakeholders.includes(i) ? color : 'rgba(255,255,255,0.05)'}`,
                        borderRadius: 3, padding: '12px 16px',
                        opacity: visibleStakeholders.includes(i) ? 1 : 0.2,
                        transition: 'all 0.4s ease',
                        transform: visibleStakeholders.includes(i) ? 'translateX(0)' : 'translateX(-8px)',
                      }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 700, color: visibleStakeholders.includes(i) ? '#F0EDE4' : 'rgba(240,237,228,0.3)', minWidth: 180 }}>{role}</span>
                      <span style={{ fontSize: 12, color: 'rgba(240,237,228,0.5)', flex: 1 }}>{action}</span>
                      {visibleStakeholders.includes(i) && (
                        <CheckCircle2 size={14} color={color} style={{ flexShrink: 0 }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Task deployment */}
              {visibleTasks.length > 0 && (
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,237,228,0.3)', marginBottom: 16 }}>
                    Task Deployment — Simultaneous
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>
                    {TASKS.map(({ role, task, due, pre }, i) => (
                      <div
                        key={i}
                        style={{
                          background: 'rgba(43,138,110,0.05)',
                          border: `1px solid ${visibleTasks.includes(i) ? 'rgba(43,138,110,0.25)' : 'rgba(255,255,255,0.04)'}`,
                          borderRadius: 4, padding: '14px 16px',
                          opacity: visibleTasks.includes(i) ? 1 : 0,
                          transition: 'all 0.35s ease',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: TEAL, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{role}</span>
                          <span style={{ fontSize: 9, color: 'rgba(240,237,228,0.3)' }}>Due: {due}</span>
                        </div>
                        <div style={{ fontSize: 13, color: '#F0EDE4', lineHeight: 1.4 }}>{task}</div>
                        {pre && <div style={{ fontSize: 9, color: 'rgba(43,138,110,0.7)', marginTop: 6, fontStyle: 'italic' }}>Pre-staged — no drafting required</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── Section 4: OUTCOME (visible after complete) ─ */}
      <section
        ref={outcomeRef}
        style={{
          background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.07)',
          padding: '80px 48px',
          opacity: phase === 'complete' ? 1 : 0.08,
          transition: 'opacity 0.8s ease',
        }}
      >
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
            <div style={{ width: 32, height: 1, background: GOLD }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD }}>
              7 Minutes 23 Seconds Later
            </span>
          </div>

          <h2 style={{ ...CG, fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 600, color: '#F0EDE4', marginBottom: 40, lineHeight: 1.2 }}>
            Board briefed. Interim CFO designated.<br />
            <em style={{ color: TEAL }}>IR talking points ready.</em>
          </h2>

          {/* Before / After table */}
          <div style={{ borderRadius: 6, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', marginBottom: 48 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {['Outcome', 'Without Execution OS', 'With Execution OS'].map((h, i) => (
                <div key={h} style={{ padding: '12px 20px', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: i === 2 ? TEAL : 'rgba(240,237,228,0.4)' }}>
                  {h}
                </div>
              ))}
            </div>
            {OUTCOMES.map(({ metric, before, after }, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', borderBottom: i < OUTCOMES.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <div style={{ padding: '14px 20px', fontSize: 13, color: 'rgba(240,237,228,0.7)' }}>{metric}</div>
                <div style={{ padding: '14px 20px', fontSize: 13, color: 'rgba(239,68,68,0.7)', fontWeight: 600 }}>{before}</div>
                <div style={{ padding: '14px 20px', fontSize: 13, color: TEAL, fontWeight: 700 }}>{after}</div>
              </div>
            ))}
          </div>

          {/* ROI strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 64 }}>
            {[
              { label: "Average C-suite departure cost", value: "$23M", sub: "Industry average — McKinsey" },
              { label: "Value protected — coordinated response", value: "$9–14M", sub: "40–60% cost reduction" },
              { label: "Annual Execution OS investment", value: "$250K", sub: "Pays for itself on first activation" },
            ].map(({ label, value, sub }) => (
              <div key={label} style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 4, padding: '20px 20px' }}>
                <div style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(240,237,228,0.3)', marginBottom: 8 }}>{label}</div>
                <div style={{ ...CG, fontSize: 32, fontWeight: 700, color: GOLD, marginBottom: 4 }}>{value}</div>
                <div style={{ fontSize: 11, color: 'rgba(240,237,228,0.35)' }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5: THE CLOSE ─────────────────────── */}
      <section style={{ padding: '80px 48px 120px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: -300, left: -300, width: 800, height: 800, background: 'radial-gradient(circle, rgba(43,138,110,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>

          <h2 style={{ ...CG, fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 600, color: '#F0EDE4', lineHeight: 1.2, marginBottom: 32 }}>
            You know someone on your executive<br />team will leave.
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(240,237,228,0.55)', lineHeight: 1.8, marginBottom: 16, maxWidth: 580, margin: '0 auto 16px' }}>
            You don't know when. You don't know who. You don't know if it will be voluntary 
            or involuntary, planned or sudden.
          </p>
          <p style={{ fontSize: 16, color: 'rgba(240,237,228,0.55)', lineHeight: 1.8, marginBottom: 48, maxWidth: 580, margin: '0 auto 48px' }}>
            The question is whether that morning is a scramble — board chairs texting, 
            IR improvising, CHRO searching for documents that don't exist — or whether 
            every decision is already made.
          </p>

          <div style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 6, padding: '32px 40px', marginBottom: 56, maxWidth: 560, margin: '0 auto 56px' }}>
            <p style={{ ...CG, fontSize: 22, color: '#F0EDE4', lineHeight: 1.5, margin: 0, fontStyle: 'italic' }}>
              "What's a coordinated leadership transition<br />worth to your board?"
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => navigate('/request-access')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 12,
                background: GOLD_GRAD, color: NAVY, border: 'none', borderRadius: 4,
                padding: '18px 48px', fontSize: 15, fontWeight: 800, cursor: 'pointer',
                letterSpacing: 0.4, boxShadow: `0 0 40px rgba(201,168,76,0.25)`,
                transition: 'all 0.2s ease',
              }}
              onMouseOver={e => { const el = e.currentTarget; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = `0 8px 40px rgba(201,168,76,0.4)`; }}
              onMouseOut={e => { const el = e.currentTarget; el.style.transform = 'translateY(0)'; el.style.boxShadow = `0 0 40px rgba(201,168,76,0.25)`; }}
            >
              Request Executive Pilot
              <ArrowRight size={16} />
            </button>
            <span style={{ fontSize: 11, color: 'rgba(240,237,228,0.25)' }}>
              Fortune 1000 · Board-authorized pilots · 30-day activation arc
            </span>
          </div>

          {/* Footer attribution */}
          <div style={{ marginTop: 80, paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', border: `1px solid rgba(201,168,76,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ ...CG, fontSize: 9, fontWeight: 700, color: 'rgba(201,168,76,0.5)' }}>VM</span>
              </div>
              <span style={{ fontSize: 11, color: 'rgba(240,237,228,0.2)', letterSpacing: '0.1em' }}>VaughnMartin Execution OS</span>
            </div>
            <p style={{ fontSize: 11, color: 'rgba(240,237,228,0.15)', margin: 0 }}>
              170 playbooks · 221 triggers · 248+ data points · 9 strategic domains · 12-minute execution
            </p>
          </div>
        </div>
      </section>

      {/* ── Pulse animation keyframes ─────────────────── */}
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
