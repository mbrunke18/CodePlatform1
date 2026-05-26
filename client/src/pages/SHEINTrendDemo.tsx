import { useState, useEffect, useRef, useCallback } from "react";
import { scrollToTop } from "@/components/ScrollToTop";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";

const NAVY    = "#0A0F2E";
const NAVY_BG = "#132558";
const GOLD    = "#C9A84C";
const TEAL    = "#2B8A6E";
const TEAL_LT = "#3BAF8A";
const BORDER  = "#E8E4DC";
const GEO: React.CSSProperties = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const DM: React.CSSProperties  = { fontFamily: "'Barlow', sans-serif" };

const SCENARIO = {
  title: "Fast Fashion Competitive Disruption",
  subtitle: "SHEIN launches 47 SKUs targeting your core category at 80% lower price — 2.4M social mentions in 48 hours",
  domain: "Competitive Strategy & Brand Defense",
  company: "Legacy Apparel Brand — $8.2B revenue · 18–34 core demographic · 4,800 wholesale doors globally",
  trigger: "SHEIN's algorithm has flagged your top 3 product categories as high-margin trend opportunities. They've launched 47 direct-competing SKUs at one-fifth your price point. Influencer adoption is tracking at 340% above SHEIN's baseline velocity. Your consumer research team is showing a 22% switching intention rate in your core 18–34 demographic. Holiday season is 11 weeks away. Your wholesale partners are already asking questions.",
  stats: [
    { value: "22%", label: "Switching intention in core demographic", sub: "Consumer research data — past 48 hours" },
    { value: "11 wks", label: "To holiday season peak revenue", sub: "$2.1B at risk if position not defended" },
    { value: "47 SKUs", label: "Direct-competing products launched", sub: "Priced at 80% below your hero products" },
  ],
  surviveScore: 45,
  thriveScore: 88,
  analysis: "Fast fashion disruption is the defining competitive threat for legacy apparel brands — and the one most frequently handled reactively. Without pre-staged influencer defense protocols, channel partner reinforcement playbooks, and product acceleration trigger points, brands spend weeks in internal alignment while the trend narrative hardens against them. Readiness OS deploys brand differentiation, influencer retention, and channel defense simultaneously — before the switching window closes.",
  playbooks: ["Competitive Disruption Response", "Influencer Relationship Defense", "Channel Partner Reinforcement", "Product Acceleration Protocol", "Consumer Sentiment Crisis Response"],
  insight: "The brands that survive fast fashion disruption are not the ones with the best product teams — they are the ones who already know what makes them inimitable. Pre-staged differentiation messaging, pre-identified influencer relationships, and pre-authorized product acceleration decisions mean you respond before the narrative firms, not after it has already cost you the season.",
};

const TASKS = [
  { phase: "INTELLIGENCE", role: "Chief Strategy Officer", action: "Pull competitive analysis: SHEIN SKUs vs your hero products — price gap, feature parity, influencer reach, social velocity, projected market share impact by category and demographic segment", time: "1:30", priority: "critical" },
  { phase: "INTELLIGENCE", role: "CMO + Head of Consumer Insights", action: "Run customer sentiment analysis: which core 18–34 segments show highest switching intention, what is the primary driver (price vs. trend vs. sustainability), which SKUs are at most risk", time: "2:00", priority: "critical" },
  { phase: "BRAND DIFFERENTIATION", role: "CMO", action: "Activate differentiation response: identify 3 inimitable brand attributes SHEIN structurally cannot replicate — heritage, craft quality, community. Rapid creative campaign brief issued within the hour.", time: "3:00", priority: "critical" },
  { phase: "PRICING RESPONSE", role: "CFO + CMO", action: "Selective price response decision: which SKUs require competitive response, which segments to defend at premium, which categories to strategically concede — not a blanket discount", time: "4:30", priority: "high" },
  { phase: "INFLUENCER ACTIVATION", role: "Head of Brand + CMO", action: "Activate tier 1 and tier 2 influencer partnerships — exclusive content agreements, early product access, co-creation invitations. Defend creator relationships before SHEIN acquires them with campaign fees.", time: "6:00", priority: "high" },
  { phase: "CHANNEL PROTECTION", role: "Chief Revenue Officer", action: "Brief all wholesale partners — cooperative marketing investment, premium in-store positioning reinforcement, exclusive product allocations for Q4. Lock channel commitments before SHEIN's retail push.", time: "7:30", priority: "high" },
  { phase: "PRODUCT ACCELERATION", role: "Chief Product Officer", action: "Fast-track 6 innovation SKUs that create genuine competitive separation — from 18-month roadmap to 90-day launch. Authorize resources required to compress development timeline.", time: "9:00", priority: "high" },
  { phase: "COMMUNITY RETENTION", role: "CMO + Head of Loyalty", action: "Launch loyalty community initiative: exclusive member benefits, early access programs, community experiences that price-alone competitors structurally cannot replicate at scale", time: "12:00", priority: "high" },
];

function parseTime(t: string): number { const [m, s] = t.split(':').map(Number); return m * 60 + s; }
function fmtSecs(s: number): string { const m = Math.floor(s / 60); const sec = s % 60; return `${m}:${sec.toString().padStart(2, '0')}`; }
function getTaskStatus(idx: number, elapsed: number): 'pending' | 'active' | 'done' {
  const t = TASKS[idx]; if (!t) return 'pending';
  const d = parseTime(t.time);
  if (elapsed >= d + 30) return 'done'; if (elapsed >= d) return 'active'; return 'pending';
}
function StepBadge({ n, active, done }: { n: number; active: boolean; done: boolean }) {
  return <div style={{ width: 32, height: 32, border: `2px solid ${done ? TEAL : active ? GOLD : 'rgba(255,255,255,0.25)'}`, background: done ? TEAL : active ? GOLD : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 700, color: done || active ? NAVY : 'rgba(255,255,255,0.4)', transition: 'all 0.3s ease' }}>{done ? '✓' : n}</div>;
}

function WarRoomTasks({ elapsed }: { elapsed: number }) {
  const phases = Array.from(new Set(TASKS.map(t => t.phase)));
  return (
    <div>
      {phases.map(phase => (
        <div key={phase} style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ height: 1, width: 24, background: NAVY }} />
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '3px 10px', background: NAVY, color: '#fff' }}>{phase}</div>
            <div style={{ height: 1, flex: 1, background: NAVY }} />
          </div>
          {TASKS.filter(t => t.phase === phase).map((t, gi) => {
            const idx = TASKS.indexOf(t); const st = getTaskStatus(idx, elapsed);
            const isDone = st === 'done'; const isActive = st === 'active'; const isPending = st === 'pending';
            return (
              <div key={gi} style={{ display: 'flex', gap: 12, padding: '14px 16px', marginBottom: 8, background: isDone ? NAVY : '#fff', border: `1px solid ${isDone ? TEAL : isActive ? GOLD : BORDER}`, borderLeft: `4px solid ${isDone ? TEAL : isActive ? GOLD : '#D1D5DB'}`, transition: 'all 0.4s ease', opacity: isPending ? 0.65 : 1 }}>
                <div style={{ flexShrink: 0, marginTop: 2 }}>
                  {isDone ? <div style={{ width: 20, height: 20, background: TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#fff', fontWeight: 800 }}>✓</div>
                    : isActive ? <div style={{ width: 20, height: 20, border: `2px solid ${GOLD}`, background: 'rgba(201,168,76,0.15)', animation: 'sheinpulse 1.2s ease-in-out infinite' }} />
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
      <style>{`@keyframes sheinpulse { 0%,100%{opacity:0.3;} 50%{opacity:1;} }`}</style>
    </div>
  );
}

export default function SHEINTrendDemo() {
  const [step, setStep] = useState<1|2|3|4>(1);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [liveEvents, setLiveEvents] = useState<{time:string;text:string;type:'notified'|'acknowledged'|'system'}[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval>|null>(null);
  const loggedN = useRef<Set<number>>(new Set());
  const loggedA = useRef<Set<number>>(new Set());
  const elapsedRef = useRef(0);
  const TOTAL = 12 * 60;
  const completedTasks = elapsed >= TOTAL ? TASKS.length : TASKS.filter((_, i) => getTaskStatus(i, elapsed) === 'done').length;
  const pct = Math.round((elapsed / TOTAL) * 100);

  const tick = useCallback(() => {
    elapsedRef.current += 1; const e = elapsedRef.current; setElapsed(e);
    const evts: typeof liveEvents = [];
    TASKS.forEach((t, i) => {
      const d = parseTime(t.time);
      if (e >= d && !loggedN.current.has(i)) { loggedN.current.add(i); evts.push({ time: fmtSecs(e), text: `[${t.role}] Notified — task alert deployed`, type: 'notified' }); }
      if (e >= d + 30 && !loggedA.current.has(i)) { loggedA.current.add(i); evts.push({ time: fmtSecs(e), text: `[${t.role}] Acknowledged — confirmed in progress`, type: 'acknowledged' }); }
    });
    if (evts.length > 0) setLiveEvents(prev => [...evts, ...prev].slice(0, 24));
    if (e >= TOTAL) { clearInterval(timerRef.current!); setRunning(false); setTimeout(() => { setStep(4); scrollToTop(); }, 1200); }
  }, []);

  const startWarRoom = () => {
    loggedN.current = new Set(); loggedA.current = new Set(); elapsedRef.current = 0; setElapsed(0); setRunning(true);
    setLiveEvents([{ time: '0:00', text: `War room secured — ${TASKS.length} tasks queued`, type: 'system' }, { time: '0:00', text: '12-minute execution clock started', type: 'system' }]);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(tick, 120);
  };
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const Nav = () => (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, background: NAVY }}>
      <VaughnMartinLogo height={32} variant="full" color="light" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        {[{ n:1, label:'Scenario' }, { n:2, label:'Brief' }, { n:3, label:'War Room' }, { n:4, label:'Debrief' }].map((s, i) => (
          <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {i > 0 && <div style={{ width: 24, height: 1, background: 'rgba(255,255,255,0.15)' }} />}
            <StepBadge n={s.n} active={step === s.n} done={step > s.n} />
            <span style={{ fontSize: 11, fontWeight: 600, color: step === s.n ? '#fff' : 'rgba(255,255,255,0.68)', letterSpacing: '0.05em' }}>{s.label}</span>
          </div>
        ))}
      </div>
      <a href="/contact" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '8px 20px', background: GOLD, color: NAVY, border: 'none', cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>Request Founding Partner Access</a>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: NAVY_BG, ...DM }}>
      <Nav />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '64px 24px' }}>

        {step === 1 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 24, height: 1, background: GOLD }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD }}>{SCENARIO.domain}</span>
                <div style={{ width: 24, height: 1, background: GOLD }} />
              </div>
              <h1 style={{ ...GEO, fontSize: 'clamp(28px,4vw,48px)', fontWeight: 700, color: '#fff', lineHeight: 1.15, marginBottom: 16 }}>{SCENARIO.title}</h1>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', maxWidth: 620, margin: '0 auto 8px' }}>{SCENARIO.subtitle}</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.68)', maxWidth: 600, margin: '0 auto' }}>{SCENARIO.company}</p>
            </div>
            <div style={{ padding: '24px 28px', background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.25)', borderLeft: '4px solid #C0392B', marginBottom: 32 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#f87171', marginBottom: 10 }}>● TRIGGER ACTIVE — HIGH</div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.75 }}>{SCENARIO.trigger}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 40 }}>
              {SCENARIO.stats.map(s => (
                <div key={s.label} style={{ padding: '20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                  <div style={{ ...GEO, fontSize: 32, fontWeight: 700, color: GOLD, marginBottom: 6 }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.68)', fontStyle: 'italic' }}>{s.sub}</div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 20, height: 1, background: GOLD }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD }}>Pre-Staged War Room — {TASKS.length} Tasks Ready</span>
              </div>
              {TASKS.map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, padding: '12px 16px', marginBottom: 6, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderLeft: `3px solid ${t.priority === 'critical' ? '#C0392B' : 'rgba(201,168,76,0.4)'}` }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: GOLD, minWidth: 40, flexShrink: 0 }}>{t.time}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: t.priority === 'critical' ? '#f87171' : 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', marginBottom: 3 }}>{t.role}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>{t.action}</div>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.68)', letterSpacing: '0.1em', textTransform: 'uppercase', flexShrink: 0, alignSelf: 'flex-start', paddingTop: 4 }}>{t.phase}</div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center' }}>
              <button onClick={() => { setStep(2); scrollToTop(); }} style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '14px 40px', background: GOLD, color: NAVY, border: 'none', cursor: 'pointer' }}>View Execution Brief →</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD, marginBottom: 16 }}>Signal-Based Execution Brief</div>
              <h2 style={{ ...GEO, fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, color: '#fff', marginBottom: 8 }}>{SCENARIO.title}</h2>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>{SCENARIO.subtitle}</p>
            </div>
            <div style={{ padding: '12px 24px', background: 'rgba(201,168,76,0.06)', borderTop: '1px solid rgba(201,168,76,0.3)', borderBottom: '1px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD }}>Execution Brief</div>
                <div style={{ width: 1, height: 12, background: 'rgba(201,168,76,0.3)' }} />
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.68)' }}>Pre-Staged · System-Analyzed</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 6, height: 6, background: '#C0392B' }} />
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E05A4A' }}>Critical Priority</div>
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.68)', marginBottom: 10 }}>Situation Assessment</div>
              <div style={{ padding: '20px 24px', background: 'rgba(255,255,255,0.03)', borderLeft: `3px solid ${GOLD}`, borderTop: '1px solid rgba(255,255,255,0.08)', borderRight: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.75, margin: 0 }}>{SCENARIO.analysis}</p>
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.68)', marginBottom: 10 }}>Pre-Staged Response — Deploys on Activation</div>
              <div style={{ padding: '20px 24px', background: 'rgba(43,138,110,0.06)', borderLeft: `3px solid ${TEAL}`, borderTop: '1px solid rgba(43,138,110,0.2)', borderRight: '1px solid rgba(43,138,110,0.2)', borderBottom: '1px solid rgba(43,138,110,0.2)' }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 14 }}>The following Readiness Protocols are pre-staged and will activate the moment you authorize execution:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>
                  {SCENARIO.playbooks.map(p => <span key={p} style={{ fontSize: 11, fontWeight: 700, padding: '6px 14px', background: 'rgba(43,138,110,0.15)', color: TEAL_LT, border: '1px solid rgba(43,138,110,0.3)' }}>▸ {p}</span>)}
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 40 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.68)', marginBottom: 10 }}>What This Changes</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}>
                <div style={{ padding: '20px 24px', background: 'rgba(180,30,30,0.07)', borderTop: '1px solid rgba(192,57,43,0.2)', borderBottom: '1px solid rgba(192,57,43,0.2)', borderLeft: '1px solid rgba(192,57,43,0.2)', borderRight: 'none' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E05A4A', marginBottom: 8 }}>Without Readiness OS</div>
                  <div style={{ fontSize: 36, fontWeight: 700, color: '#fff', lineHeight: 1, marginBottom: 4 }}>30 <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.68)' }}>days</span></div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.68)' }}>to mobilize, align stakeholders, agree on a plan, then begin executing</div>
                </div>
                <div style={{ padding: '0 20px', textAlign: 'center' as const, background: 'rgba(255,255,255,0.02)', alignSelf: 'stretch' as const, display: 'flex', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: 18, color: GOLD }}>→</div>
                </div>
                <div style={{ padding: '20px 24px', background: 'rgba(201,168,76,0.06)', borderTop: `1px solid rgba(201,168,76,0.25)`, borderBottom: `1px solid rgba(201,168,76,0.25)`, borderRight: `1px solid rgba(201,168,76,0.25)`, borderLeft: 'none' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 8 }}>With Readiness OS</div>
                  <div style={{ fontSize: 36, fontWeight: 700, color: GOLD, lineHeight: 1, marginBottom: 4 }}>12 <span style={{ fontSize: 16, color: `rgba(201,168,76,0.5)` }}>minutes</span></div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.68)' }}>from trigger detection to full coordinated executive execution — 3,600× head start</div>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <button onClick={() => { setStep(3); scrollToTop(); startWarRoom(); }} style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '14px 40px', background: GOLD, color: NAVY, border: 'none', cursor: 'pointer' }}>Enter the War Room — Start Clock →</button>
            </div>
          </div>
        )}

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
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.68)' }}>/ 12:00 target</div>
                <div style={{ marginTop: 6, fontSize: 8, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)', padding: '2px 8px', display: 'inline-block' }}>COMPRESSED SIMULATION</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: GOLD }}>{completedTasks}/{TASKS.length}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.68)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Tasks Complete</div>
              </div>
            </div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', marginBottom: 32 }}>
              <div style={{ height: '100%', background: GOLD, width: `${Math.min(100,pct)}%`, transition: 'width 120ms linear' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 16, padding: '10px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: 24 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.68)' }}>Status:</span>
              {[['#D1D5DB','transparent','Queued'],[GOLD,'rgba(201,168,76,0.2)','Notified'],[TEAL,TEAL,'Acknowledged ✓']].map(([color,bg,label]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 10, border: `2px solid ${color}`, background: bg }} />
                  <span style={{ fontSize: 11, color: label === 'Acknowledged ✓' ? TEAL_LT : label === 'Notified' ? GOLD : 'rgba(255,255,255,0.68)', fontWeight: 600 }}>{label}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
              <WarRoomTasks elapsed={elapsed} />
              <div style={{ background: NAVY, padding: 20 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: running ? TEAL_LT : 'rgba(255,255,255,0.68)', marginBottom: 16 }}>{running ? '● LIVE FEED' : '○ FEED PAUSED'}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 480, overflowY: 'auto' }}>
                  {liveEvents.map((e, i) => (
                    <div key={i} style={{ fontSize: 11, color: e.type === 'acknowledged' ? '#6EE7B7' : 'rgba(255,255,255,0.8)', borderLeft: `2px solid ${e.type === 'acknowledged' ? TEAL : e.type === 'notified' ? GOLD : 'rgba(255,255,255,0.68)'}`, paddingLeft: 10, lineHeight: 1.5 }}>
                      <span style={{ color: 'rgba(255,255,255,0.68)', fontSize: 10, display: 'block', marginBottom: 2 }}>{e.time}</span>{e.text}
                    </div>
                  ))}
                  {liveEvents.length === 0 && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.68)', fontStyle: 'italic' }}>Awaiting first action…</div>}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ width: 48, height: 2, background: TEAL, margin: '0 auto 24px' }} />
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD, marginBottom: 16 }}>Execution Complete — Post-Activation Debrief</div>
              <h2 style={{ ...GEO, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: '#fff', marginBottom: 12 }}>
                {SCENARIO.title}:<br /><em style={{ fontStyle: 'italic', color: TEAL_LT }}>Brand Position Defended in {fmtSecs(elapsed)}</em>
              </h2>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', maxWidth: 540, margin: '0 auto' }}>Differentiation campaign briefed, influencers retained, channels reinforced, and product acceleration authorized — before the switching window hardened.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 40 }}>
              {[
                { label: 'Response Time', value: fmtSecs(elapsed), sub: 'vs. weeks of alignment cycles', color: TEAL },
                { label: 'Revenue Protected', value: '$2.1B', sub: 'Q4 holiday season defended', color: GOLD },
                { label: 'Tasks Coordinated', value: `${completedTasks}/${TASKS.length}`, sub: 'brand, product, channel, loyalty', color: GOLD },
                { label: 'Execution Head Start', value: '3,600×', sub: 'vs. standard mobilization time', color: TEAL },
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
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', maxWidth: 480 }}>Ready to pre-stage this for your brand — with your real influencer relationships, your real channel partners, and your real product pipeline?</p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
                <a href="/request-access" style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '13px 32px', background: GOLD, color: NAVY, textDecoration: 'none' }}>Request Founding Partner Access →</a>
                <button onClick={() => { setStep(1); scrollToTop(); setElapsed(0); setRunning(false); setLiveEvents([]); }} style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '13px 32px', background: 'transparent', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}>Restart Demo</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
