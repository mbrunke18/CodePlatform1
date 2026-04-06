import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const NAVY    = "#0A0F2E";
const NAVY_BG = "#132558";
const GOLD    = "#C9A84C";
const TEAL    = "#2B8A6E";
const TEAL_LT = "#3BAF8A";
const IVORY   = "#F8F7F4";
const MUTED   = "#6B7280";
const BORDER  = "#E8E4DC";
const GEO: React.CSSProperties = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const DM: React.CSSProperties  = { fontFamily: "'Inter', sans-serif" };

// ─── Preset scenarios ─────────────────────────────────────────────────────────
const SCENARIOS = [
  { id: 'activist', icon: '⚔️', title: 'Activist Investor', subtitle: '9.8% stake acquired — board seat demanded', domain: 'competitive', urgency: 'critical' },
  { id: 'cyber', icon: '🛡️', title: 'Ransomware Attack', subtitle: 'Critical systems encrypted — 72-hr ultimatum', domain: 'cybersecurity', urgency: 'critical' },
  { id: 'supply', icon: '📦', title: 'Supply Chain Collapse', subtitle: 'Primary supplier bankrupt — 14-day production risk', domain: 'supply chain', urgency: 'high' },
  { id: 'brand', icon: '📰', title: 'Brand Crisis', subtitle: 'Viral social media incident — sentiment collapsing', domain: 'brand', urgency: 'high' },
  { id: 'regulatory', icon: '⚖️', title: 'Regulatory Inquiry', subtitle: 'DOJ investigation opened — disclosure required', domain: 'regulatory', urgency: 'high' },
  { id: 'talent', icon: '👥', title: 'Talent Exodus', subtitle: 'CTO + 3 VPs resigned — competitors recruiting', domain: 'talent', urgency: 'high' },
];

// ─── Scenario-specific war room tasks ────────────────────────────────────────
const SCENARIO_TASKS: Record<string, Array<{ phase: string; role: string; action: string; time: string; priority: string }>> = {
  activist: [
    { phase: 'INTELLIGENCE', role: 'General Counsel', action: 'Pull Schedule 13D filing from SEC EDGAR — confirm stake %, stated intent, and associated entities', time: '0:90', priority: 'critical' },
    { phase: 'INTELLIGENCE', role: 'CFO', action: 'Run activist profile — past campaigns, win rate, typical demands (board seat, spin-off, cost cuts)', time: '2:00', priority: 'critical' },
    { phase: 'BOARD ACTIVATION', role: 'Board Chair', action: 'Convene emergency board session — brief all directors before activist makes public statement', time: '3:00', priority: 'critical' },
    { phase: 'BOARD ACTIVATION', role: 'CEO', action: 'Retain M&A defense counsel, proxy solicitor, and IR advisor — all three before activist first contact', time: '4:00', priority: 'high' },
    { phase: 'INSTITUTIONAL OFFENSIVE', role: 'CEO + CFO', action: 'Schedule calls with top 10 institutional holders within 24 hours — lead with value creation plan', time: '6:00', priority: 'high' },
    { phase: 'INSTITUTIONAL OFFENSIVE', role: 'Chief IR Officer', action: 'Prepare investor presentation: 3-year value creation roadmap with board governance enhancements', time: '7:00', priority: 'high' },
    { phase: 'NARRATIVE CONTROL', role: 'CMO + Legal', action: 'Draft company response: confident, forward-looking, data-driven. Pre-approved for rapid release', time: '10:00', priority: 'high' },
    { phase: 'NARRATIVE CONTROL', role: 'Chief Strategy Officer', action: 'Accelerate pipeline value-creation announcements — beat activist narrative with your own news', time: '12:00', priority: 'high' },
  ],
  cyber: [
    { phase: 'CONFIRMATION', role: 'CISO', action: 'Confirm ransomware variant — classify: locker / crypto / double-extortion. Determine data exfiltration status', time: '1:00', priority: 'critical' },
    { phase: 'CONFIRMATION', role: 'CTO', action: 'IMMEDIATE: Physically isolate affected network segments. Do NOT reboot — preserves memory for forensics', time: '1:30', priority: 'critical' },
    { phase: 'CONFIRMATION', role: 'General Counsel', action: 'Engage FBI Cyber Division and notify cyber insurer. Do NOT authorize payment without insurer sign-off', time: '2:00', priority: 'critical' },
    { phase: 'CONTAINMENT', role: 'COO', action: 'Activate Business Continuity Plan — manual workarounds for all revenue-critical systems', time: '3:00', priority: 'high' },
    { phase: 'CONTAINMENT', role: 'CTO', action: 'Validate backup integrity — confirm offline/immutable backups exist and establish Recovery Time Objective', time: '4:00', priority: 'critical' },
    { phase: 'PAYMENT DECISION', role: 'CEO + CFO + Legal', action: 'Payment decision with all required parties: backup status, OFAC sanctions check, insurance guidance', time: '6:00', priority: 'critical' },
    { phase: 'RECOVERY', role: 'CTO + CISO', action: 'Begin clean restoration from verified backups — rebuild from clean images, never restore from encrypted states', time: '10:00', priority: 'high' },
    { phase: 'RECOVERY', role: 'CISO', action: 'Mandatory security hardening before reconnection: patch exploited vulnerabilities, MFA all accounts, EDR all endpoints', time: '12:00', priority: 'high' },
  ],
  supply: [
    { phase: 'ASSESSMENT', role: 'COO', action: 'Pull disruption data: affected supplier tier, % supply at risk, lead time impact, geographic scope of disruption', time: '1:30', priority: 'critical' },
    { phase: 'ASSESSMENT', role: 'CFO', action: 'Run revenue-at-risk: production days affected × daily revenue. Apply buffer stock coverage days remaining', time: '2:00', priority: 'critical' },
    { phase: 'SUPPLY CONTINUITY', role: 'Chief Procurement Officer', action: 'Issue emergency POs to top 3 alternate suppliers simultaneously — pre-negotiated rates apply', time: '4:00', priority: 'critical' },
    { phase: 'SUPPLY CONTINUITY', role: 'Head of Logistics', action: 'Reroute inbound freight. Expedite air freight for critical components where margin supports', time: '5:00', priority: 'high' },
    { phase: 'CUSTOMER COMMS', role: 'CEO / CRO', action: 'Personally call top 10 affected enterprise customers — offer concrete recovery date and executive contact', time: '7:00', priority: 'high' },
    { phase: 'CUSTOMER COMMS', role: 'CMO', action: 'Draft customer communication with specific timeline commitments. Legal review before release', time: '8:00', priority: 'high' },
    { phase: 'STABILIZE', role: 'CFO', action: 'File business interruption insurance claim. Document all incremental costs for recovery and potential litigation', time: '12:00', priority: 'high' },
  ],
  brand: [
    { phase: 'CHARACTERIZATION', role: 'CMO', action: 'Pull crisis monitoring data: source, velocity (shares/hour), sentiment trajectory, media pickup rate', time: '1:30', priority: 'critical' },
    { phase: 'CHARACTERIZATION', role: 'CEO', action: 'Hold-or-respond decision with CMO and Legal. Every 30-min delay in viral crisis costs 40% more amplification', time: '2:00', priority: 'critical' },
    { phase: 'STATEMENT', role: 'CMO + Legal', action: 'Draft 3-sentence holding statement: what you know, what you are doing, when you will say more. No speculation', time: '3:00', priority: 'critical' },
    { phase: 'STATEMENT', role: 'Head of PR', action: 'Prepare social, web, email, and media distribution simultaneously — all channels live at the same moment', time: '5:00', priority: 'high' },
    { phase: 'STAKEHOLDER CASCADE', role: 'CHRO', action: 'Send employee briefing: what happened, what the company is saying, how to respond if asked by customers', time: '6:00', priority: 'high' },
    { phase: 'STAKEHOLDER CASCADE', role: 'Chief Revenue Officer', action: 'Brief top 20 enterprise customers before their boards ask them about it', time: '7:00', priority: 'high' },
    { phase: 'RECOVERY', role: 'CEO', action: 'Record direct-to-camera accountability statement — authentic over polished, specific over generic', time: '11:00', priority: 'high' },
  ],
  regulatory: [
    { phase: 'INTAKE', role: 'General Counsel', action: 'Pull full regulatory/inquiry text. Extract: effective date, requirements, enforcement mechanism, disclosure obligations', time: '1:30', priority: 'critical' },
    { phase: 'INTAKE', role: 'Chief Compliance Officer', action: 'Run gap assessment: what is compliant today vs. what requires change. Prioritize by penalty exposure', time: '2:00', priority: 'critical' },
    { phase: 'IMPACT MAPPING', role: 'CISO / CTO', action: 'Assess technology compliance: data residency, encryption standards, access controls, audit logging requirements', time: '4:00', priority: 'high' },
    { phase: 'ROADMAP', role: 'Chief Compliance Officer', action: 'Draft compliance roadmap anchored to deadline. Critical path vs. parallel workstreams — resource-confirmed', time: '7:00', priority: 'high' },
    { phase: 'ALIGNMENT', role: 'CEO', action: 'Brief board on regulation impact, compliance timeline, and budget. Obtain board endorsement of approach', time: '10:00', priority: 'high' },
    { phase: 'ALIGNMENT', role: 'Chief Compliance Officer', action: 'File acknowledgment with regulator if required. Establish ongoing dialogue channel with regulatory body', time: '11:00', priority: 'high' },
  ],
  talent: [
    { phase: 'TRIAGE', role: 'CHRO', action: 'Pull flight risk model: all employees >70% departure probability — engagement score, comp percentile, manager quality', time: '1:30', priority: 'critical' },
    { phase: 'TRIAGE', role: 'CEO', action: 'Identify 25 mission-critical roles where departure causes immediate operational or customer impact', time: '2:00', priority: 'critical' },
    { phase: 'RETENTION OFFENSIVE', role: 'CEO', action: 'Schedule personal calls with all Priority 1 retention risks within 48 hours — listen first, then vision, then comp', time: '3:00', priority: 'critical' },
    { phase: 'RETENTION OFFENSIVE', role: 'CHRO', action: 'Design 18-month retention package for top 25: equity acceleration, role expansion, flexibility agreements', time: '4:00', priority: 'high' },
    { phase: 'ROOT CAUSE', role: 'CEO', action: 'Make one visible, immediate structural change addressing #1 departure driver. Symbolism matters — employees need decisions not promises', time: '7:00', priority: 'high' },
    { phase: 'CULTURE', role: 'CEO', action: 'All-hands within 72 hours: acknowledge challenges, share specific changes, invite candid questions — no filtered Q&A', time: '10:00', priority: 'high' },
    { phase: 'CULTURE', role: 'CFO + CHRO', action: 'Establish talent health scorecard with board-level quarterly reporting — make retention a governance issue', time: '12:00', priority: 'high' },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function parseTime(t: string): number {
  const [m, s] = t.split(':').map(Number);
  return m * 60 + s;
}

function fmtSecs(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

// ─── Step components ──────────────────────────────────────────────────────────
function StepBadge({ n, active, done }: { n: number; active: boolean; done: boolean }) {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: '50%', border: `2px solid ${done ? TEAL : active ? GOLD : 'rgba(255,255,255,0.25)'}`,
      background: done ? TEAL : active ? GOLD : 'transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      fontSize: 12, fontWeight: 700, color: done || active ? NAVY : 'rgba(255,255,255,0.4)',
      transition: 'all 0.3s ease',
    }}>
      {done ? '✓' : n}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function TwelveMinuteTestDrive() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [brief, setBrief] = useState<any>(null);
  const [loadingBrief, setLoadingBrief] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [taskStatuses, setTaskStatuses] = useState<Record<number, 'pending' | 'active' | 'done'>>({});
  const [liveEvents, setLiveEvents] = useState<{ time: string; text: string }[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const loggedDispatchRef = useRef<Set<number>>(new Set());
  const loggedConfirmRef = useRef<Set<number>>(new Set());
  const scenario = SCENARIOS.find(s => s.id === selectedId);
  const tasks = selectedId ? (SCENARIO_TASKS[selectedId] || []) : [];
  const TOTAL = 12 * 60;

  // Advance tasks based on elapsed time — each task logs exactly once for dispatch, once for confirm
  useEffect(() => {
    if (!running || step !== 3) return;
    tasks.forEach((t, i) => {
      const dispatchAt = parseTime(t.time);
      const confirmAt  = dispatchAt + 28; // 28s after dispatch = confirmed receipt

      // Step 1: notified — alert sent to role, fires once only
      if (elapsed >= dispatchAt && !loggedDispatchRef.current.has(i)) {
        loggedDispatchRef.current.add(i);
        setTaskStatuses(prev => ({ ...prev, [i]: 'active' }));
        setLiveEvents(prev => [
          { time: fmtSecs(elapsed), text: `📤 [${t.role}] Notified — task alert sent to role` },
          ...prev,
        ].slice(0, 20));
      }

      // Step 2: acknowledged — role confirmed receipt, fires once only (not task completion)
      if (elapsed >= confirmAt && !loggedConfirmRef.current.has(i)) {
        loggedConfirmRef.current.add(i);
        setTaskStatuses(prev => ({ ...prev, [i]: 'done' }));
        setLiveEvents(prev => [
          { time: fmtSecs(elapsed), text: `✅ [${t.role}] Acknowledged receipt — task in progress` },
          ...prev,
        ].slice(0, 20));
      }
    });
    if (elapsed >= TOTAL) {
      setRunning(false);
      clearInterval(timerRef.current!);
      setTimeout(() => setStep(4), 1200);
    }
  }, [elapsed, running]);

  const startWarRoom = () => {
    loggedDispatchRef.current = new Set();
    loggedConfirmRef.current  = new Set();
    setTaskStatuses({});
    setRunning(true);
    setElapsed(0);
    timerRef.current = setInterval(() => setElapsed(prev => prev + 1), 1000);
    setLiveEvents([
      { time: '0:00', text: `🔒 War room secured — ${tasks.length} tasks queued for execution` },
      { time: '0:00', text: '⚡ Execution protocol activated — 12-minute response clock started' },
    ]);
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  async function fetchBrief() {
    if (!scenario) return;
    setLoadingBrief(true);
    try {
      const r = await fetch('/api/simulation/public-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioText: `${scenario.title}: ${scenario.subtitle}` }),
      });
      const d = await r.json();
      setBrief(d);
    } catch { setBrief(null); } finally { setLoadingBrief(false); }
  }

  const completedTasks = Object.values(taskStatuses).filter(s => s === 'done').length;
  const pct = Math.round((elapsed / TOTAL) * 100);
  const phases = Array.from(new Set(tasks.map(t => t.phase)));

  return (
    <div style={{ minHeight: '100vh', background: NAVY_BG, ...DM }}>
      {/* Nav */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/">
          <div style={{ cursor: 'pointer' }}><VaughnMartinLogo height={32} variant="full" color="light" /></div>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {[
            { n: 1, label: 'Choose Scenario' },
            { n: 2, label: 'AI Brief' },
            { n: 3, label: 'War Room' },
            { n: 4, label: 'Debrief' },
          ].map((s, i) => (
            <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {i > 0 && <div style={{ width: 32, height: 1, background: 'rgba(255,255,255,0.15)' }} />}
              <StepBadge n={s.n} active={step === s.n} done={step > s.n} />
              <span style={{ fontSize: 11, fontWeight: 600, color: step === s.n ? '#fff' : 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>{s.label}</span>
            </div>
          ))}
        </div>
        <Link href="/request-access">
          <button style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '8px 20px', background: GOLD, color: NAVY, border: 'none', cursor: 'pointer' }}>Request Pilot</button>
        </Link>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '64px 24px' }}>

        {/* ── STEP 1: Scenario Selection ─────────────────────────────────── */}
        {step === 1 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 24, height: 1, background: GOLD }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD }}>12-Minute Test Drive</span>
                <div style={{ width: 24, height: 1, background: GOLD }} />
              </div>
              <h1 style={{ ...GEO, fontSize: 'clamp(28px,4vw,48px)', fontWeight: 700, color: '#fff', lineHeight: 1.15, marginBottom: 16 }}>
                Choose Your Strategic Scenario.<br />
                <em style={{ fontStyle: 'italic', color: GOLD }}>Experience 12-Minute Execution.</em>
              </h1>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', maxWidth: 560, margin: '0 auto' }}>
                Pick a real-world scenario your organization could face. We'll show you exactly how Execution OS mobilizes your entire leadership team in under 12 minutes.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 40 }}>
              {SCENARIOS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedId(s.id)}
                  style={{
                    textAlign: 'left', padding: '20px 24px', cursor: 'pointer',
                    background: selectedId === s.id ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.04)',
                    border: `2px solid ${selectedId === s.id ? GOLD : 'rgba(255,255,255,0.1)'}`,
                    borderLeft: `4px solid ${s.urgency === 'critical' ? '#C0392B' : GOLD}`,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <span style={{ fontSize: 24 }}>{s.icon}</span>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: s.urgency === 'critical' ? '#f87171' : GOLD }}>{s.urgency}</div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{s.subtitle}</div>
                </button>
              ))}
            </div>

            <div style={{ textAlign: 'center' }}>
              <button
                disabled={!selectedId}
                onClick={async () => { setStep(2); fetchBrief(); }}
                style={{
                  fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                  padding: '14px 40px', background: selectedId ? GOLD : 'rgba(201,168,76,0.3)',
                  color: NAVY, border: 'none', cursor: selectedId ? 'pointer' : 'not-allowed',
                  transition: 'background 0.2s ease',
                }}
              >
                Begin Test Drive →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: AI Brief ──────────────────────────────────────────── */}
        {step === 2 && scenario && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD, marginBottom: 16 }}>AI Execution Brief · GPT-4o</div>
              <h2 style={{ ...GEO, fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, color: '#fff', marginBottom: 8 }}>
                {scenario.icon} {scenario.title}
              </h2>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{scenario.subtitle}</p>
            </div>

            {loadingBrief ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div style={{ display: 'inline-block', width: 40, height: 40, border: `3px solid ${GOLD}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 16, fontSize: 13 }}>GPT-4o generating your execution brief…</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 40 }}>
                {/* Survive/Thrive Scores */}
                <div style={{ padding: '20px 24px', background: 'rgba(43,138,110,0.08)', border: '1px solid rgba(43,138,110,0.25)', borderTop: `3px solid ${TEAL}` }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: TEAL, marginBottom: 8 }}>Survive Score (Without Execution OS)</div>
                  <div style={{ fontSize: 52, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{brief?.surviveScore ?? 61}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>/ 100 — current readiness estimate</div>
                </div>
                <div style={{ padding: '20px 24px', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.25)', borderTop: `3px solid ${GOLD}` }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 8 }}>Thrive Score (With Execution OS)</div>
                  <div style={{ fontSize: 52, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{brief?.thriveScore ?? 34}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>/ 100 — with 12-minute execution</div>
                </div>
                <div style={{ gridColumn: '1 / -1', padding: '20px 24px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderLeft: `3px solid ${GOLD}` }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 10 }}>Executive Assessment</div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>
                    {brief?.aiAnalysis || `This ${scenario.title.toLowerCase()} scenario demands immediate cross-functional coordination across your entire C-Suite. Organizations with pre-staged response infrastructure gain a 3,600× Execution Head Start — while rivals spend weeks mobilizing, you're already executing. The difference between a controlled response and a cascading crisis is measured in the first 12 minutes.`}
                  </p>
                </div>
                {brief?.activatedPlaybooks?.length > 0 && (
                  <div style={{ gridColumn: '1 / -1', padding: '16px 20px', background: 'rgba(43,138,110,0.06)', border: '1px solid rgba(43,138,110,0.2)' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: TEAL, marginBottom: 10 }}>Playbooks That Will Activate</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {brief.activatedPlaybooks.map((p: string, i: number) => (
                        <span key={i} style={{ fontSize: 11, fontWeight: 600, padding: '4px 12px', background: 'rgba(43,138,110,0.12)', color: TEAL_LT, border: '1px solid rgba(43,138,110,0.25)' }}>{p}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!loadingBrief && (
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={() => { setStep(3); startWarRoom(); }}
                  style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '14px 40px', background: GOLD, color: NAVY, border: 'none', cursor: 'pointer' }}
                >
                  Enter the War Room — Start Clock →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 3: War Room ──────────────────────────────────────────── */}
        {step === 3 && scenario && (
          <div>
            {/* Header with countdown */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, padding: '20px 28px', background: NAVY, border: `1px solid rgba(201,168,76,0.3)` }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD, marginBottom: 4 }}>War Room Active</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>{scenario.icon} {scenario.title}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: running ? TEAL_LT : GOLD, marginBottom: 4 }}>{running ? '🟢 LIVE' : '⏱ COMPLETE'}</div>
                <div style={{ fontSize: 48, fontWeight: 700, color: '#fff', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{fmtSecs(elapsed)}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>/ 12:00 target</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: GOLD }}>{completedTasks}/{tasks.length}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Tasks Complete</div>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', marginBottom: 32 }}>
              <div style={{ height: '100%', background: GOLD, width: `${Math.min(100, pct)}%`, transition: 'width 1s linear' }} />
            </div>

            {/* Status legend */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 16, padding: '10px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>Notification Status:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid #D1D5DB' }} />
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Queued — not yet sent</span>
                </div>
                <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', border: `2px solid ${GOLD}`, background: 'rgba(201,168,76,0.2)' }} />
                  <span style={{ fontSize: 11, color: GOLD, fontWeight: 600 }}>Notified — alert sent to role</span>
                </div>
                <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, color: '#fff', fontWeight: 700 }}>✓</div>
                  <span style={{ fontSize: 11, color: TEAL_LT, fontWeight: 600 }}>Acknowledged — role confirmed receipt</span>
                </div>
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic', paddingLeft: 4 }}>
                These badges track notification and acknowledgment only — not whether the task work itself has been completed. Work completion is tracked in the full platform.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
              {/* Tasks */}
              <div>
                {phases.map(phase => (
                  <div key={phase} style={{ marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <div style={{ height: 1, width: 24, background: NAVY }} />
                      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '3px 10px', background: NAVY, color: '#fff' }}>{phase}</div>
                      <div style={{ height: 1, flex: 1, background: NAVY }} />
                    </div>
                    {tasks.filter(t => t.phase === phase).map((t, gi) => {
                      const globalIdx = tasks.indexOf(t);
                      const st = taskStatuses[globalIdx] || 'pending';
                      const isDone    = st === 'done';
                      const isActive  = st === 'active';
                      const isPending = st === 'pending';
                      return (
                        <div key={gi} style={{
                          display: 'flex', gap: 12, padding: '14px 16px', marginBottom: 8,
                          background: isDone ? TEAL : isActive ? 'rgba(201,168,76,0.08)' : '#fff',
                          border: `1px solid ${isDone ? TEAL : isActive ? GOLD : BORDER}`,
                          borderLeft: `4px solid ${isDone ? '#1a6b52' : isActive ? GOLD : '#D1D5DB'}`,
                          transition: 'all 0.4s ease',
                          opacity: isPending ? 0.7 : 1,
                        }}>
                          {/* Status icon */}
                          <div style={{ flexShrink: 0, marginTop: 2 }}>
                            {isDone ? (
                              <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: TEAL, fontWeight: 800 }}>✓</div>
                            ) : isActive ? (
                              <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${GOLD}`, background: 'rgba(201,168,76,0.15)', animation: 'pulse 1.2s ease-in-out infinite' }} />
                            ) : (
                              <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid #D1D5DB' }} />
                            )}
                          </div>
                          {/* Content */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                              <span style={{ fontSize: 11, fontWeight: 700, color: isDone ? '#fff' : GOLD, letterSpacing: '0.05em' }}>{t.role}</span>
                              {/* Status badge */}
                              {isDone && (
                                <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '2px 8px', background: 'rgba(255,255,255,0.22)', color: '#fff', borderRadius: 2 }}>ACKNOWLEDGED ✓</span>
                              )}
                              {isActive && (
                                <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '2px 8px', background: 'rgba(201,168,76,0.15)', color: GOLD, border: `1px solid ${GOLD}`, borderRadius: 2 }}>NOTIFIED</span>
                              )}
                              {isPending && (
                                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '2px 8px', background: '#F3F4F6', color: '#9CA3AF', borderRadius: 2 }}>QUEUED</span>
                              )}
                            </div>
                            <div style={{ fontSize: 13, color: isDone ? '#fff' : NAVY, fontWeight: isDone ? 600 : 500, lineHeight: 1.4 }}>{t.action}</div>
                          </div>
                          {/* Time target */}
                          <div style={{ fontSize: 10, color: isDone ? 'rgba(255,255,255,0.6)' : MUTED, flexShrink: 0, marginTop: 2 }}>{t.time}</div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Live Feed */}
              <div style={{ background: NAVY, padding: 20 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: running ? TEAL_LT : 'rgba(255,255,255,0.4)', marginBottom: 16 }}>
                  {running ? '● LIVE FEED' : '○ FEED PAUSED'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 480, overflowY: 'auto' }}>
                  {liveEvents.map((e, i) => {
                    const isConfirmed = e.text.startsWith('✅');
                    const isDispatched = e.text.startsWith('📤');
                    const borderColor = isConfirmed ? TEAL : isDispatched ? GOLD : 'rgba(255,255,255,0.2)';
                    const textColor   = isConfirmed ? '#6EE7B7' : 'rgba(255,255,255,0.8)';
                    return (
                      <div key={i} style={{ fontSize: 11, color: textColor, borderLeft: `2px solid ${borderColor}`, paddingLeft: 10, lineHeight: 1.5 }}>
                        <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, display: 'block', marginBottom: 2 }}>{e.time}</span>
                        {e.text}
                      </div>
                    );
                  })}
                  {liveEvents.length === 0 && (
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>Awaiting first action…</div>
                  )}
                </div>
              </div>
            </div>
            <style>{`@keyframes pulse { 0%,100%{opacity:0.3;} 50%{opacity:1;} }`}</style>
          </div>
        )}

        {/* ── STEP 4: Debrief ───────────────────────────────────────────── */}
        {step === 4 && scenario && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD, marginBottom: 16 }}>Execution Complete — Post-Activation Debrief</div>
              <h2 style={{ ...GEO, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: '#fff', marginBottom: 12 }}>
                {scenario.title} Response:<br />
                <em style={{ fontStyle: 'italic', color: TEAL_LT }}>Contained in {fmtSecs(elapsed)}</em>
              </h2>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', maxWidth: 540, margin: '0 auto' }}>
                Your organization executed a structured, coordinated response in under 12 minutes. Here is what that means in real terms.
              </p>
            </div>

            {/* Performance metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40 }}>
              {[
                { label: 'Response Time', value: fmtSecs(elapsed), sub: 'vs. weeks of mobilization', color: TEAL },
                { label: 'Tasks Completed', value: `${completedTasks}/${tasks.length}`, sub: `${Math.round((completedTasks / tasks.length) * 100)}% completion rate`, color: GOLD },
                { label: 'Execution Head Start', value: '3,600×', sub: 'while rivals are still mobilizing', color: GOLD },
                { label: 'Damage Contained', value: '68%', sub: 'avg reduction in impact', color: TEAL },
              ].map(m => (
                <div key={m.label} style={{ padding: '20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderTop: `3px solid ${m.color}`, textAlign: 'center' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: m.color, marginBottom: 8 }}>{m.label}</div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: '#fff', lineHeight: 1, marginBottom: 4 }}>{m.value}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{m.sub}</div>
                </div>
              ))}
            </div>

            {/* What this means */}
            <div style={{ padding: '28px 32px', background: 'rgba(201,168,76,0.08)', border: `1px solid ${GOLD}`, borderLeft: `4px solid ${GOLD}`, marginBottom: 40 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 12 }}>What You Just Experienced</div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>
                In this test drive, Execution OS coordinated {tasks.length} cross-functional tasks across {Array.from(new Set(tasks.map(t => t.role))).length} leadership roles — in sequence, with context, and with zero navigation. In a real activation, this same sequence deploys across your actual organization, notifying real stakeholders, assigning real tasks, and generating real documentation. The result: your organization moves from detection to coordinated response in under 12 minutes.
              </p>
            </div>

            {/* CTA */}
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', maxWidth: 480 }}>
                Ready to deploy this in your organization — with your real team, your real scenarios, and your real response infrastructure?
              </p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
                <a href="/request-access" style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '13px 32px', background: GOLD, color: NAVY, textDecoration: 'none' }}>
                  Request a Pilot →
                </a>
                <button
                  onClick={() => { setStep(1); setSelectedId(null); setBrief(null); setElapsed(0); setRunning(false); setTaskStatuses({}); setLiveEvents([]); }}
                  style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '13px 32px', background: 'transparent', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}
                >
                  Try Another Scenario
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
