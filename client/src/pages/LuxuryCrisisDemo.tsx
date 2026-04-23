import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import { scrollToTop } from "@/components/ScrollToTop";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";
import { Radio } from "lucide-react";

const NAVY    = "#0A0F2E";
const NAVY_BG = "#132558";
const GOLD    = "#C9A84C";
const TEAL    = "#2B8A6E";
const TEAL_LT = "#3BAF8A";
const BORDER  = "#E8E4DC";
const GEO: React.CSSProperties = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const DM: React.CSSProperties  = { fontFamily: "'Inter', sans-serif" };

const SCENARIO = {
  title: "Luxury Brand Reputational Crisis",
  subtitle: "Viral exposé on Maison labor practices — 10M impressions in 47 minutes",
  domain: "Brand & Reputation",
  urgency: "critical" as const,
  company: "Global Luxury Conglomerate — 28 Maisons · $85B market cap · 4,200 retail locations",
  trigger: "An investigative journalist publishes a documentary alleging labor practice violations in a flagship Maison's supply chain. The story goes viral across 12 markets simultaneously. Share velocity: 180,000/hour. Three institutional shareholders call within the first hour. VIP clients — who generate 40% of revenue — are seeing it before they hear from you.",
  stats: [
    { value: "47 min", label: "Time to 10M social impressions", sub: "vs. 8 hours in 2018" },
    { value: "3–7%", label: "Share price impact within 24 hours", sub: "Luxury sector historical avg" },
    { value: "40%", label: "Revenue from top 2% VIP clients", sub: "First to require personal outreach" },
  ],
  surviveScore: 44,
  thriveScore: 91,
  analysis: "Luxury brand equity is the balance sheet. A single viral incident without coordinated response destroys decades of positioning in hours. Without Readiness OS, your VIP clients hear from journalists before they hear from you — a relationship-ending sequence. With pre-staged Readiness Protocols, your CCO, regional Maison directors, and VIP client teams deploy simultaneously before narrative control is lost.",
  debrief: { value1: "$280M", label1: "Brand Value Protected", value2: "193", label2: "Stakeholders Coordinated", value3: "12 min", label3: "Narrative Controlled" },
  insight: "Luxury brands are spending billions on AI social monitoring. But without Readiness OS, they still lose the critical first 12 minutes to coordination chaos — unclear accountability, delayed VIP outreach, staggered messaging that lets the narrative escape. The operating model is the missing layer.",
};

const TASKS = [
  { phase: "CHARACTERIZATION", role: "Chief Communications Officer", action: "Pull real-time monitoring data: share velocity per hour, sentiment trajectory, journalist pickup rate, geographic spread across 12 markets", time: "1:30", priority: "critical" },
  { phase: "CHARACTERIZATION", role: "CEO", action: "Hold-or-respond decision with CCO and Legal. Every 30-min delay in a viral luxury crisis costs 40% more amplification. Decision made now — not in committee.", time: "2:00", priority: "critical" },
  { phase: "VIP CLIENT PROTECTION", role: "Chief Client Officer", action: "Issue personal outreach to all 847 Tier 1 clients before they see it on social media — a client who learns from press before hearing from us is a lost relationship", time: "3:00", priority: "critical" },
  { phase: "VIP CLIENT PROTECTION", role: "Regional Maison Directors", action: "Brief all 28 Maison brand directors with approved talking points — 75 locations need identical, consistent messaging before staff face customer questions", time: "4:00", priority: "high" },
  { phase: "STATEMENT", role: "CCO + General Counsel", action: "Draft 3-sentence holding statement: what we know, what we are doing, when we will say more. No speculation. Pre-approved for immediate deployment.", time: "5:00", priority: "critical" },
  { phase: "STATEMENT", role: "Head of Communications", action: "Deploy simultaneously across social, press wire, owned web properties, and wholesale partner network — narrative coordinated, never staggered across channels", time: "6:30", priority: "high" },
  { phase: "COMMERCIAL DEFENSE", role: "Chief Revenue Officer", action: "Brief top wholesale partners and all 4,200 retail points of sale — equip floor staff with customer response protocol before doors open", time: "8:00", priority: "high" },
  { phase: "GOVERNANCE", role: "General Counsel + Chief ESG Officer", action: "File board update, prepare investor relations brief, document complete response timeline with timestamps for governance and litigation record", time: "10:00", priority: "high" },
  { phase: "RESOLUTION", role: "CEO", action: "Record direct-to-camera accountability statement — authentic over polished, specific over generic. Announce one concrete structural change with a committed timeline.", time: "12:00", priority: "high" },
];

function parseTime(t: string): number { const [m, s] = t.split(':').map(Number); return m * 60 + s; }
function fmtSecs(s: number): string { const m = Math.floor(s / 60); const sec = s % 60; return `${m}:${sec.toString().padStart(2, '0')}`; }
function getTaskStatus(idx: number, elapsed: number, tasks: typeof TASKS): 'pending' | 'active' | 'done' {
  const t = tasks[idx]; if (!t) return 'pending';
  const d = parseTime(t.time); const c = d + 30;
  if (elapsed >= c) return 'done'; if (elapsed >= d) return 'active'; return 'pending';
}

function StepBadge({ n, active, done }: { n: number; active: boolean; done: boolean }) {
  return (
    <div style={{ width: 32, height: 32, borderRadius: 0, border: `2px solid ${done ? TEAL : active ? GOLD : 'rgba(255,255,255,0.25)'}`, background: done ? TEAL : active ? GOLD : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 700, color: done || active ? NAVY : 'rgba(255,255,255,0.4)', transition: 'all 0.3s ease' }}>
      {done ? '✓' : n}
    </div>
  );
}

export default function LuxuryCrisisDemo() {
  const [step, setStep] = useState<1|2|3|4>(1);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [liveEvents, setLiveEvents] = useState<{time:string;text:string;type:'notified'|'acknowledged'|'system'}[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval>|null>(null);
  const loggedN = useRef<Set<number>>(new Set());
  const loggedA = useRef<Set<number>>(new Set());
  const elapsedRef = useRef(0);
  const TOTAL = 12 * 60;
  const phases = Array.from(new Set(TASKS.map(t => t.phase)));
  const completedTasks = TASKS.filter((_, i) => getTaskStatus(i, elapsed, TASKS) === 'done').length;
  const pct = Math.round((elapsed / TOTAL) * 100);

  const tick = useCallback(() => {
    elapsedRef.current += 1;
    const e = elapsedRef.current;
    setElapsed(e);
    const newEvents: typeof liveEvents = [];
    TASKS.forEach((t, i) => {
      const d = parseTime(t.time); const c = d + 30;
      if (e >= d && !loggedN.current.has(i)) { loggedN.current.add(i); newEvents.push({ time: fmtSecs(e), text: `[${t.role}] Notified — task alert deployed`, type: 'notified' }); }
      if (e >= c && !loggedA.current.has(i)) { loggedA.current.add(i); newEvents.push({ time: fmtSecs(e), text: `[${t.role}] Acknowledged — confirmed in progress`, type: 'acknowledged' }); }
    });
    if (newEvents.length > 0) setLiveEvents(prev => [...newEvents, ...prev].slice(0, 24));
    if (e >= TOTAL) { clearInterval(timerRef.current!); setRunning(false); setTimeout(() => { setStep(4); scrollToTop(); }, 1200); }
  }, []);

  const startWarRoom = () => {
    loggedN.current = new Set(); loggedA.current = new Set(); elapsedRef.current = 0;
    setElapsed(0); setRunning(true);
    setLiveEvents([{ time: '0:00', text: `War room secured — ${TASKS.length} tasks queued across ${phases.length} phases`, type: 'system' }, { time: '0:00', text: '12-minute execution clock started', type: 'system' }]);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(tick, 1000);
  };
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const nav = (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, background: NAVY }}>
      <Link href="/"><div style={{ cursor: 'pointer' }}><VaughnMartinLogo height={32} variant="full" color="light" /></div></Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        {[{ n: 1, label: 'Scenario' }, { n: 2, label: 'Brief' }, { n: 3, label: 'War Room' }, { n: 4, label: 'Debrief' }].map((s, i) => (
          <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {i > 0 && <div style={{ width: 24, height: 1, background: 'rgba(255,255,255,0.15)' }} />}
            <StepBadge n={s.n} active={step === s.n} done={step > s.n} />
            <span style={{ fontSize: 11, fontWeight: 600, color: step === s.n ? '#fff' : 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>{s.label}</span>
          </div>
        ))}
      </div>
      <Link href="/request-access"><button style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '8px 20px', background: GOLD, color: NAVY, border: 'none', cursor: 'pointer' }}>Request Pilot</button></Link>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: NAVY_BG, ...DM }}>
      {nav}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '64px 24px' }}>

        {/* STEP 1 — Scenario */}
        {step === 1 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 24, height: 1, background: GOLD }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD }}>Brand & Reputation · {SCENARIO.domain}</span>
                <div style={{ width: 24, height: 1, background: GOLD }} />
              </div>
              <h1 style={{ ...GEO, fontSize: 'clamp(28px,4vw,48px)', fontWeight: 700, color: '#fff', lineHeight: 1.15, marginBottom: 16 }}>
                {SCENARIO.title}
              </h1>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', maxWidth: 600, margin: '0 auto 8px' }}>{SCENARIO.subtitle}</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', maxWidth: 560, margin: '0 auto' }}>{SCENARIO.company}</p>
            </div>

            <div style={{ padding: '24px 28px', background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.25)', borderLeft: '4px solid #C0392B', marginBottom: 32 }}>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#f87171', marginBottom: 10 }}>● TRIGGER ACTIVE — {SCENARIO.urgency.toUpperCase()}</div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.75 }}>{SCENARIO.trigger}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 40 }}>
              {SCENARIO.stats.map(s => (
                <div key={s.label} style={{ padding: '20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                  <div style={{ ...GEO, fontSize: 32, fontWeight: 700, color: GOLD, marginBottom: 6 }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>{s.sub}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 20, height: 1, background: GOLD }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD }}>Pre-Staged War Room — {TASKS.length} Tasks Across {phases.length} Phases</span>
              </div>
              {TASKS.map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, padding: '12px 16px', marginBottom: 6, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderLeft: `3px solid ${t.priority === 'critical' ? '#C0392B' : 'rgba(201,168,76,0.4)'}` }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: GOLD, minWidth: 40, flexShrink: 0 }}>{t.time}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: t.priority === 'critical' ? '#f87171' : 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', marginBottom: 3 }}>{t.role}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>{t.action}</div>
                  </div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', textTransform: 'uppercase', flexShrink: 0, alignSelf: 'flex-start', paddingTop: 4 }}>{t.phase}</div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center' }}>
              <button onClick={() => { setStep(2); scrollToTop(); }} style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '14px 40px', background: GOLD, color: NAVY, border: 'none', cursor: 'pointer' }}>
                View Execution Brief →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 — Brief */}
        {step === 2 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD, marginBottom: 16 }}>Signal-Based Execution Brief</div>
              <h2 style={{ ...GEO, fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, color: '#fff', marginBottom: 8 }}>{SCENARIO.title}</h2>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>{SCENARIO.subtitle}</p>
            </div>
            <div style={{ padding: '12px 24px', background: 'rgba(201,168,76,0.06)', borderTop: '1px solid rgba(201,168,76,0.3)', borderBottom: '1px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD }}>Execution Brief</div>
                <div style={{ width: 1, height: 12, background: 'rgba(201,168,76,0.3)' }} />
                <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>Pre-Staged · System-Analyzed</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 6, height: 6, background: '#C0392B' }} />
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E05A4A' }}>Critical Priority</div>
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 10 }}>Situation Assessment</div>
              <div style={{ padding: '20px 24px', background: 'rgba(255,255,255,0.03)', borderLeft: `3px solid ${GOLD}`, borderTop: '1px solid rgba(255,255,255,0.08)', borderRight: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.75, margin: 0 }}>{SCENARIO.analysis}</p>
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 10 }}>Pre-Staged Response — Deploys on Activation</div>
              <div style={{ padding: '20px 24px', background: 'rgba(43,138,110,0.06)', borderLeft: `3px solid ${TEAL}`, borderTop: '1px solid rgba(43,138,110,0.2)', borderRight: '1px solid rgba(43,138,110,0.2)', borderBottom: '1px solid rgba(43,138,110,0.2)' }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 14 }}>The following prepared responses are pre-staged and will activate the moment you authorize execution:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>
                  {['Reputational Crisis Response', 'VIP Client Communication Protocol', 'Media & Social Containment', 'Board Crisis Governance', 'Stakeholder Cascade Management'].map(p => (
                    <span key={p} style={{ fontSize: 11, fontWeight: 700, padding: '6px 14px', background: 'rgba(43,138,110,0.15)', color: TEAL_LT, border: '1px solid rgba(43,138,110,0.3)' }}>▸ {p}</span>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 40 }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 10 }}>What This Changes</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}>
                <div style={{ padding: '20px 24px', background: 'rgba(180,30,30,0.07)', borderTop: '1px solid rgba(192,57,43,0.2)', borderBottom: '1px solid rgba(192,57,43,0.2)', borderLeft: '1px solid rgba(192,57,43,0.2)', borderRight: 'none' }}>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E05A4A', marginBottom: 8 }}>Without Readiness OS</div>
                  <div style={{ fontSize: 36, fontWeight: 700, color: '#fff', lineHeight: 1, marginBottom: 4 }}>30 <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)' }}>days</span></div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>to mobilize, align stakeholders, agree on a plan, then begin executing</div>
                </div>
                <div style={{ padding: '0 20px', textAlign: 'center' as const, background: 'rgba(255,255,255,0.02)', alignSelf: 'stretch' as const, display: 'flex', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: 18, color: GOLD }}>→</div>
                </div>
                <div style={{ padding: '20px 24px', background: 'rgba(201,168,76,0.06)', borderTop: `1px solid rgba(201,168,76,0.25)`, borderBottom: `1px solid rgba(201,168,76,0.25)`, borderRight: `1px solid rgba(201,168,76,0.25)`, borderLeft: 'none' }}>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 8 }}>With Readiness OS</div>
                  <div style={{ fontSize: 36, fontWeight: 700, color: GOLD, lineHeight: 1, marginBottom: 4 }}>12 <span style={{ fontSize: 16, color: `rgba(201,168,76,0.5)` }}>minutes</span></div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>from trigger detection to full coordinated executive execution — 3,600× head start</div>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <button onClick={() => { setStep(3); scrollToTop(); startWarRoom(); }} style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '14px 40px', background: GOLD, color: NAVY, border: 'none', cursor: 'pointer' }}>
                Enter the War Room — Start Clock →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — War Room */}
        {step === 3 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, padding: '20px 28px', background: NAVY, border: `1px solid rgba(201,168,76,0.3)` }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD, marginBottom: 4 }}>War Room Active</div>
                <div style={{ ...GEO, fontSize: 20, fontWeight: 700, color: '#fff' }}>{SCENARIO.title}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: running ? TEAL_LT : GOLD, marginBottom: 4 }}>{running ? '● LIVE' : '— COMPLETE'}</div>
                <div style={{ fontSize: 48, fontWeight: 700, color: '#fff', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{fmtSecs(elapsed)}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>/ 12:00 target</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: GOLD }}>{completedTasks}/{TASKS.length}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Tasks Complete</div>
              </div>
            </div>

            <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', marginBottom: 32 }}>
              <div style={{ height: '100%', background: GOLD, width: `${Math.min(100,pct)}%`, transition: 'width 1s linear' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 16, padding: '10px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: 24 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>Status:</span>
              {[{ color: '#D1D5DB', bg: 'transparent', label: 'Queued' }, { color: GOLD, bg: 'rgba(201,168,76,0.2)', label: 'Notified' }, { color: TEAL, bg: TEAL, label: 'Acknowledged ✓' }].map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 0, border: `2px solid ${s.color}`, background: s.bg }} />
                  <span style={{ fontSize: 11, color: s.label === 'Acknowledged ✓' ? TEAL_LT : s.label === 'Notified' ? GOLD : 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{s.label}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
              <div>
                {phases.map(phase => (
                  <div key={phase} style={{ marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <div style={{ height: 1, width: 24, background: NAVY }} />
                      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '3px 10px', background: NAVY, color: '#fff' }}>{phase}</div>
                      <div style={{ height: 1, flex: 1, background: NAVY }} />
                    </div>
                    {TASKS.filter(t => t.phase === phase).map((t, gi) => {
                      const globalIdx = TASKS.indexOf(t);
                      const st = getTaskStatus(globalIdx, elapsed, TASKS);
                      const isDone = st === 'done'; const isActive = st === 'active'; const isPending = st === 'pending';
                      return (
                        <div key={gi} style={{ display: 'flex', gap: 12, padding: '14px 16px', marginBottom: 8, background: isDone ? NAVY : '#fff', border: `1px solid ${isDone ? TEAL : isActive ? GOLD : BORDER}`, borderLeft: `4px solid ${isDone ? TEAL : isActive ? GOLD : '#D1D5DB'}`, transition: 'all 0.4s ease', opacity: isPending ? 0.65 : 1 }}>
                          <div style={{ flexShrink: 0, marginTop: 2 }}>
                            {isDone ? <div style={{ width: 20, height: 20, background: TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#fff', fontWeight: 800 }}>✓</div>
                              : isActive ? <div style={{ width: 20, height: 20, border: `2px solid ${GOLD}`, background: 'rgba(201,168,76,0.15)', animation: 'pulse 1.2s ease-in-out infinite' }} />
                              : <div style={{ width: 20, height: 20, border: '2px solid #D1D5DB' }} />}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                              <span style={{ fontSize: 11, fontWeight: 700, color: isDone ? TEAL_LT : GOLD }}>{t.role}</span>
                              {isDone && <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '2px 8px', background: TEAL, color: '#fff' }}>ACK ✓</span>}
                              {isActive && <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '2px 8px', background: 'rgba(201,168,76,0.12)', color: GOLD, border: `1px solid ${GOLD}` }}>NOTIFIED</span>}
                              {isPending && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '2px 8px', background: '#F3F4F6', color: '#9CA3AF' }}>QUEUED</span>}
                            </div>
                            <div style={{ fontSize: 13, color: isDone ? 'rgba(255,255,255,0.9)' : NAVY, fontWeight: 600, lineHeight: 1.4 }}>{t.action}</div>
                          </div>
                          <div style={{ fontSize: 10, color: isDone ? 'rgba(255,255,255,0.45)' : '#6B7280', flexShrink: 0, marginTop: 2 }}>{t.time}</div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div style={{ background: NAVY, padding: 20 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: running ? TEAL_LT : 'rgba(255,255,255,0.4)', marginBottom: 16 }}>{running ? '● LIVE FEED' : '○ FEED PAUSED'}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 480, overflowY: 'auto' }}>
                  {liveEvents.map((e, i) => (
                    <div key={i} style={{ fontSize: 11, color: e.type === 'acknowledged' ? '#6EE7B7' : 'rgba(255,255,255,0.8)', borderLeft: `2px solid ${e.type === 'acknowledged' ? TEAL : e.type === 'notified' ? GOLD : 'rgba(255,255,255,0.2)'}`, paddingLeft: 10, lineHeight: 1.5 }}>
                      <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, display: 'block', marginBottom: 2 }}>{e.time}</span>
                      {e.text}
                    </div>
                  ))}
                  {liveEvents.length === 0 && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>Awaiting first action…</div>}
                </div>
              </div>
            </div>
            <style>{`@keyframes pulse { 0%,100%{opacity:0.3;} 50%{opacity:1;} }`}</style>
          </div>
        )}

        {/* STEP 4 — Debrief */}
        {step === 4 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ width: 48, height: 2, background: TEAL, margin: '0 auto 24px' }} />
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD, marginBottom: 16 }}>Execution Complete — Post-Activation Debrief</div>
              <h2 style={{ ...GEO, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: '#fff', marginBottom: 12 }}>
                {SCENARIO.title}:<br />
                <em style={{ fontStyle: 'italic', color: TEAL_LT }}>Narrative Controlled in {fmtSecs(elapsed)}</em>
              </h2>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', maxWidth: 540, margin: '0 auto' }}>Your organization executed a coordinated brand protection response — VIP clients notified, Maisons briefed, statement deployed — in under 12 minutes.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 40 }}>
              {[
                { label: 'Response Time', value: fmtSecs(elapsed), sub: 'vs. weeks of mobilization', color: TEAL },
                { label: SCENARIO.debrief.label1, value: SCENARIO.debrief.value1, sub: 'brand equity preserved', color: GOLD },
                { label: SCENARIO.debrief.label2, value: SCENARIO.debrief.value2, sub: 'stakeholders aligned', color: GOLD },
                { label: 'Execution Head Start', value: '3,600×', sub: 'while rivals still mobilizing', color: TEAL },
              ].map(m => (
                <div key={m.label} style={{ padding: '20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderTop: `3px solid ${m.color}`, textAlign: 'center' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: m.color, marginBottom: 8 }}>{m.label}</div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: '#fff', lineHeight: 1, marginBottom: 4 }}>{m.value}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{m.sub}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: '28px 32px', background: 'rgba(201,168,76,0.08)', border: `1px solid ${GOLD}`, borderLeft: `4px solid ${GOLD}`, marginBottom: 24 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 12 }}>The Strategic Insight</div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>{SCENARIO.insight}</p>
            </div>
            <div style={{ padding: '24px 32px', background: 'rgba(43,138,110,0.08)', border: `1px solid rgba(43,138,110,0.3)`, borderLeft: `4px solid ${TEAL}`, marginBottom: 40, textAlign: 'center' }}>
              <p style={{ ...GEO, fontSize: 'clamp(18px,2.5vw,26px)', fontStyle: 'italic', color: '#fff', lineHeight: 1.4, marginBottom: 8 }}>"The response was ready before the trigger fired."</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em' }}>That's preparation. That's readiness. That's how enterprises become fearless.</p>
            </div>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', maxWidth: 480 }}>Ready to pre-stage this for your organization — with your real Maisons, your real VIP client list, and your real prepared responses?</p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
                <a href="/request-access" style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '13px 32px', background: GOLD, color: NAVY, textDecoration: 'none' }}>Request a Pilot →</a>
                <button onClick={() => { setStep(1); scrollToTop(); setElapsed(0); setRunning(false); setLiveEvents([]); }} style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '13px 32px', background: 'transparent', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}>Restart Demo</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
