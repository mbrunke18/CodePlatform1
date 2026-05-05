import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import { scrollToTop } from "@/components/ScrollToTop";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";
import { Radio } from "lucide-react";
import { ValueGainCallout, type ValueGainMode } from "@/components/ValueGainCallout";

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

// ─── Live context ─────────────────────────────────────────────────────────────
const SCENARIO_DOMAIN_MAP: Record<string, string> = {
  activist:   'Market Dynamics',
  cyber:      'Technology & Security',
  supply:     'Supply Chain & Operations',
  brand:      'Brand & Reputation',
  regulatory: 'Regulatory & Compliance',
  talent:     'Human Capital',
  compound:   'MULTI-DOMAIN',
};
interface LiveCtxTD {
  totalToday: number;
  domainsActive: string[];
  recentDetections: Array<{ triggerDomain: string; detectedAt: string | null }>;
}
function useLiveCtxTD() {
  const [data, setData] = useState<LiveCtxTD | null>(null);
  useEffect(() => {
    fetch('/api/public/live-context')
      .then(r => r.json())
      .then(d => { if (d.success !== false) setData(d); })
      .catch(() => {});
  }, []);
  return data;
}

// ─── Preset scenarios ─────────────────────────────────────────────────────────
const SCENARIOS = [
  { id: 'activist', title: 'Activist Investor', subtitle: '9.8% stake acquired — board seat demanded', domain: 'Competitive', urgency: 'critical' },
  { id: 'cyber', title: 'Ransomware Attack', subtitle: 'Critical systems encrypted — systems locked', domain: 'Cybersecurity', urgency: 'critical' },
  { id: 'supply', title: 'Supply Chain Collapse', subtitle: 'Primary supplier bankrupt — 14-day production risk', domain: 'Supply Chain', urgency: 'high' },
  { id: 'brand', title: 'Brand Crisis', subtitle: 'Viral social media incident — sentiment collapsing', domain: 'Brand', urgency: 'high' },
  { id: 'regulatory', title: 'Regulatory Inquiry', subtitle: 'DOJ investigation opened — disclosure required', domain: 'Regulatory', urgency: 'high' },
  { id: 'talent', title: 'Talent Exodus', subtitle: 'CTO + 3 VPs resigned — competitors recruiting', domain: 'Talent', urgency: 'high' },
  { id: 'compound', title: 'Compound Crisis', subtitle: 'Activist stake + DOJ inquiry — simultaneous triggers', domain: 'MULTI-DOMAIN', urgency: 'critical', compound: true },
];

function scenarioMode(id: string | null): ValueGainMode {
  if (id === 'activist') return 'offense';
  if (id === 'talent') return 'special-teams';
  return 'defense';
}

const SCENARIO_BRIEF_CALLOUT: Record<ValueGainMode, { insight: string; gain: { label: string; value: string } }> = {
  offense: {
    insight: "This brief means your board already knows what to do. Every competitor receiving the same activist notice schedules their first call — you are activating a response built months before this stake was disclosed. That is position, not reaction.",
    gain: { label: "Execution head start", value: "30 days" },
  },
  defense: {
    insight: "This brief eliminates the mobilization cycle. Every stakeholder already knows their role, every decision is pre-authorized, every communication is pre-staged. You don't convene a war room — the war room was already convened.",
    gain: { label: "Crisis lead time captured", value: "Pre-staged" },
  },
  "special-teams": {
    insight: "This brief is the coordination artifact. The acknowledgment step that follows is not authorization — it confirms the preparation transferred. Silence at acknowledgment is the earliest failure signal; you just eliminated that risk.",
    gain: { label: "Coordination ownership", value: "Pre-built" },
  },
};

const SCENARIO_DEBRIEF_CALLOUT: Record<ValueGainMode, { insight: string; gain: { label: string; value: string } }> = {
  offense: {
    insight: "You just demonstrated that when the trigger fires, your response moves faster than the opposition's first press release. That is not speed. That is position — and it was built before this moment existed.",
    gain: { label: "Competitive position", value: "30 days ahead" },
  },
  defense: {
    insight: "You just demonstrated that crisis does not end your strategy — it tests whether your preparation held. It held. Every task completed was a decision that was made before the pressure arrived. That is resilience infrastructure.",
    gain: { label: "Mobilization cycle", value: "Eliminated" },
  },
  "special-teams": {
    insight: "You just demonstrated that the coordination infrastructure was real. Ownership was confirmed — roles acknowledged, tasks deployed, sequence intact. This is what preparation compounding looks like: it transfers under pressure.",
    gain: { label: "Ownership record", value: "Locked" },
  },
};

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
  compound: [
    { phase: 'DUAL-TRACK INTAKE', role: 'General Counsel', action: 'Confirm DOJ Civil Investigative Demand — scope, jurisdiction count, 30-day timeline. Cross-reference activist 13D intent: assess whether regulatory inquiry becomes activist ammunition', time: '1:30', priority: 'critical' },
    { phase: 'DUAL-TRACK INTAKE', role: 'CEO + CFO', action: 'Confirm activist 13D: stake %, stated demands, prior campaign history. Engage M&A defense counsel and securities regulatory counsel in single joint briefing — both tracks, one command structure', time: '2:00', priority: 'critical' },
    { phase: 'BOARD COMMAND', role: 'Board Chair', action: 'Emergency board session: brief all directors on both simultaneous triggers. Establish dual-track response leads — one for activist defense, one for regulatory response — reporting to single board command', time: '3:00', priority: 'critical' },
    { phase: 'BOARD COMMAND', role: 'CEO', action: 'Retain M&A defense counsel, proxy solicitor, and outside regulatory counsel — all three retained before activist makes first public statement or regulatory counsel is locked', time: '4:00', priority: 'critical' },
    { phase: 'REGULATORY TRACK', role: 'Chief Compliance Officer', action: 'File regulatory acknowledgment. Establish privileged communications channel with DOJ. Confirm disclosure obligations: regulatory matter does NOT require activist-facing disclosure at this stage', time: '5:00', priority: 'high' },
    { phase: 'REGULATORY TRACK', role: 'General Counsel', action: 'Issue litigation hold across both tracks. Ensure regulatory response never cross-contaminates the activist defense — separate outside counsel leads each track with firewall between them', time: '6:00', priority: 'high' },
    { phase: 'INVESTOR TRACK', role: 'Chief IR Officer', action: 'Contact top 10 institutional holders before activist makes first call. Lead with value creation narrative — regulatory inquiry framed as being managed proactively, not a governance failure', time: '7:00', priority: 'high' },
    { phase: 'INVESTOR TRACK', role: 'CEO + CFO', action: 'Prepare coordinated investor narrative: board engaged on regulatory matter, strategic direction unchanged, activist demands addressed through board-level value creation plan already in progress', time: '9:00', priority: 'high' },
    { phase: 'NARRATIVE CONTROL', role: 'CMO + Legal', action: 'Draft coordinated holding statement for both triggers: acknowledges regulatory cooperation, demonstrates board confidence, rebuffs activist framing. Activated only if activist forces public disclosure', time: '10:00', priority: 'high' },
    { phase: 'NARRATIVE CONTROL', role: 'Chief Strategy Officer', action: 'Accelerate pre-staged value-creation announcements to reframe narrative. Beat the activist timeline with company-controlled strategic news before activist holds first investor call', time: '12:00', priority: 'high' },
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
      width: 32, height: 32, borderRadius: 0, border: `2px solid ${done ? TEAL : active ? GOLD : 'rgba(255,255,255,0.25)'}`,
      background: done ? TEAL : active ? GOLD : 'transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      fontSize: 12, fontWeight: 700, color: done || active ? NAVY : 'rgba(255,255,255,0.68)',
      transition: 'all 0.3s ease',
    }}>
      {done ? '✓' : n}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
// Pure function — task status derived solely from elapsed seconds, no state needed
function getTaskStatus(taskIdx: number, elapsed: number, tasks: Array<{ time: string }>): 'pending' | 'active' | 'done' {
  const t = tasks[taskIdx];
  if (!t) return 'pending';
  const dispatchAt = parseTime(t.time);
  const confirmAt  = dispatchAt + 30;
  if (elapsed >= confirmAt) return 'done';
  if (elapsed >= dispatchAt) return 'active';
  return 'pending';
}

export default function TwelveMinuteTestDrive() {
  const [step, setStep]           = useState<1 | 2 | 3 | 4>(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const liveCtx = useLiveCtxTD();
  const [brief, setBrief]         = useState<any>(null);
  const [loadingBrief, setLoadingBrief] = useState(false);
  const [elapsed, setElapsed]     = useState(0);
  const [running, setRunning]     = useState(false);
  const [liveEvents, setLiveEvents] = useState<{ time: string; text: string; type: 'notified' | 'acknowledged' | 'system' }[]>([]);
  const [companyName, setCompanyName] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');
  const timerRef       = useRef<ReturnType<typeof setInterval> | null>(null);
  const loggedNotify   = useRef<Set<number>>(new Set());
  const loggedAcknow   = useRef<Set<number>>(new Set());
  const elapsedRef     = useRef(0);
  const firedHalfRef   = useRef(false);

  const scenario       = SCENARIOS.find(s => s.id === selectedId);
  const tasks          = selectedId ? (SCENARIO_TASKS[selectedId] || []) : [];
  const TOTAL          = 12 * 60;
  const TICK_MS        = 120; // time-lapse: 12 min of simulation runs in ~90 real seconds
  const completedTasks = tasks.filter((_, i) => getTaskStatus(i, elapsed, tasks) === 'done').length;
  const pct            = Math.round((elapsed / TOTAL) * 100);
  const phases         = Array.from(new Set(tasks.map(t => t.phase)));

  // Timer tick — update elapsed and fire live feed entries exactly once per event
  const tick = useCallback((taskList: typeof tasks) => {
    elapsedRef.current += 1;
    const e = elapsedRef.current;
    setElapsed(e);

    const newEvents: { time: string; text: string; type: 'notified' | 'acknowledged' | 'system' }[] = [];
    taskList.forEach((t, i) => {
      const dispatchAt = parseTime(t.time);
      const confirmAt  = dispatchAt + 30;
      if (e >= dispatchAt && !loggedNotify.current.has(i)) {
        loggedNotify.current.add(i);
        newEvents.push({ time: fmtSecs(e), text: `[${t.role}] Notified — task alert sent to role`, type: 'notified' });
      }
      if (e >= confirmAt && !loggedAcknow.current.has(i)) {
        loggedAcknow.current.add(i);
        newEvents.push({ time: fmtSecs(e), text: `[${t.role}] Acknowledged — role confirmed receipt, task in progress`, type: 'acknowledged' });
      }
    });
    if (newEvents.length > 0) {
      setLiveEvents(prev => [...newEvents, ...prev].slice(0, 24));
    }
    if (e >= TOTAL) {
      clearInterval(timerRef.current!);
      setRunning(false);
      setTimeout(() => { setStep(4); scrollToTop(); }, 1200);
    }
  }, []);

  const startWarRoom = (taskList: typeof tasks) => {
    loggedNotify.current  = new Set();
    loggedAcknow.current  = new Set();
    elapsedRef.current    = 0;
    firedHalfRef.current  = false;
    setElapsed(0);
    setRunning(true);
    setLiveEvents([
      { time: '0:00', text: `War room secured — ${taskList.length} tasks queued`, type: 'system' },
      { time: '0:00', text: '12-minute execution clock started', type: 'system' },
    ]);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => tick(taskList), TICK_MS);
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

  return (
    <div style={{ minHeight: '100vh', background: NAVY_BG, ...DM }}>
      {/* Nav */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <VaughnMartinLogo height={32} variant="full" color="light" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {[
            { n: 1, label: 'Choose Scenario' },
            { n: 2, label: 'Execution Brief' },
            { n: 3, label: 'War Room' },
            { n: 4, label: 'Debrief' },
          ].map((s, i) => (
            <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {i > 0 && <div style={{ width: 32, height: 1, background: 'rgba(255,255,255,0.15)' }} />}
              <StepBadge n={s.n} active={step === s.n} done={step > s.n} />
              <span style={{ fontSize: 11, fontWeight: 600, color: step === s.n ? '#fff' : 'rgba(255,255,255,0.68)', letterSpacing: '0.05em' }}>{s.label}</span>
            </div>
          ))}
        </div>
        <Link href="/request-access">
          <button style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '8px 20px', background: GOLD, color: NAVY, border: 'none', cursor: 'pointer' }}>Request Founding Partner Access</button>
        </Link>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '64px 24px' }}>

        {/* ── STEP 1: Scenario Selection ─────────────────────────────────── */}
        {step === 1 && (
          <div>
            {/* Challenge question — the emotional hook */}
            <div style={{ marginBottom: 40, padding: '32px 40px', background: 'rgba(255,255,255,0.03)', borderLeft: `4px solid ${GOLD}`, borderTop: '1px solid rgba(201,168,76,0.2)', borderRight: '1px solid rgba(201,168,76,0.2)', borderBottom: '1px solid rgba(201,168,76,0.2)', maxWidth: 720, margin: '0 auto 40px' }}>
              <p style={{ ...GEO, fontSize: 'clamp(20px,2.8vw,30px)', fontWeight: 700, color: '#fff', lineHeight: 1.4, marginBottom: 16 }}>
                If any of these scenarios hit your organization today — what would you do?
              </p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.82)', lineHeight: 1.75, margin: 0 }}>
                Who calls who? Where's the brief? Who owns it? Who authorizes? Most Fortune 1000s spend 30 days figuring that out — while the window closes, the regulator moves, the competitor acts. Below is what 12 minutes looks like instead.
              </p>
            </div>

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
                Pick a real-world scenario your organization could face. We'll show you exactly how Readiness OS mobilizes your entire leadership team in under 12 minutes.
              </p>
            </div>

            {/* Live context banner — shown when system has active detections */}
            {liveCtx && liveCtx.totalToday > 0 && (
              <div style={{
                marginBottom: 24,
                padding: '12px 18px',
                background: 'rgba(43,138,110,0.08)',
                border: '1px solid rgba(43,138,110,0.25)',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <Radio size={14} color={TEAL} style={{ flexShrink: 0 }} />
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.5 }}>
                  <strong style={{ color: TEAL_LT, fontWeight: 700 }}>The system detected {liveCtx.totalToday} signal{liveCtx.totalToday !== 1 ? 's' : ''} today</strong>
                  {liveCtx.domainsActive.length > 0 && <> across {liveCtx.domainsActive.length} domain{liveCtx.domainsActive.length !== 1 ? 's' : ''}</>}
                  . Scenarios below marked with a live signal have real intelligence in the system right now.
                </p>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 40 }}>
              {SCENARIOS.map(s => {
                const domain = SCENARIO_DOMAIN_MAP[s.id];
                const hasLiveSignal = liveCtx && liveCtx.domainsActive.includes(domain);
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedId(s.id)}
                    style={{
                      textAlign: 'left', padding: '20px 24px', cursor: 'pointer',
                      background: selectedId === s.id ? 'rgba(201,168,76,0.07)' : 'rgba(255,255,255,0.03)',
                      borderTop: `1px solid ${selectedId === s.id ? GOLD : hasLiveSignal ? 'rgba(43,138,110,0.35)' : 'rgba(255,255,255,0.08)'}`,
                      borderRight: `1px solid ${selectedId === s.id ? GOLD : hasLiveSignal ? 'rgba(43,138,110,0.35)' : 'rgba(255,255,255,0.08)'}`,
                      borderBottom: `1px solid ${selectedId === s.id ? GOLD : hasLiveSignal ? 'rgba(43,138,110,0.35)' : 'rgba(255,255,255,0.08)'}`,
                      borderLeft: `3px solid ${(s as any).compound ? TEAL : s.urgency === 'critical' ? '#C0392B' : 'rgba(201,168,76,0.5)'}`,
                    gridColumn: (s as any).compound ? 'span 2' : undefined,
                      transition: 'all 0.2s ease',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: s.urgency === 'critical' ? '#f87171' : 'rgba(201,168,76,0.7)', fontFamily: "'Barlow Condensed', sans-serif" }}>{s.urgency}</span>
                        <span style={{ width: 1, height: 10, background: 'rgba(255,255,255,0.15)', display: 'inline-block' }} />
                        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.68)', fontFamily: "'Barlow Condensed', sans-serif" }}>{s.domain}</span>
                      </div>
                      {(s as any).compound && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                          <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: TEAL_LT }} />
                          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: TEAL_LT, fontFamily: "'Barlow Condensed', sans-serif" }}>2 Protocols · Simultaneous</span>
                        </div>
                      )}
                      {!(s as any).compound && hasLiveSignal && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                          <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: TEAL_LT, animation: 'vm-pulse 2s ease-in-out infinite' }} />
                          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: TEAL_LT, fontFamily: "'Barlow Condensed', sans-serif" }}>Live signal</span>
                        </div>
                      )}
                    </div>
                    <div style={{ ...GEO, fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 4, lineHeight: 1.2 }}>{s.title}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.72)', lineHeight: 1.5 }}>{s.subtitle}</div>
                  </button>
                );
              })}
            </div>

            <div style={{ textAlign: 'center' }}>
              {/* Optional company name personalization */}
              <div style={{ marginBottom: 16 }}>
                <input
                  type="text"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="Enter your company name to personalize this simulation (optional)"
                  style={{
                    width: '100%', maxWidth: 420, padding: '11px 16px',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' as const,
                    fontFamily: 'inherit',
                  }}
                />
              </div>
              <button
                disabled={!selectedId}
                onClick={async () => { setStep(2); scrollToTop(); fetchBrief(); }}
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
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD, marginBottom: 16 }}>Signal-Based Execution Brief · System Analysis</div>
              <h2 style={{ ...GEO, fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, color: '#fff', marginBottom: 8 }}>
                {scenario.title}
              </h2>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{scenario.subtitle}</p>
              {companyName && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 12, padding: '6px 14px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD }}>Activating for</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{companyName}</span>
                </div>
              )}
            </div>

            {loadingBrief ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div style={{ display: 'inline-block', width: 40, height: 40, border: `3px solid ${GOLD}`, borderTopColor: 'transparent', borderRadius: 0, animation: 'spin 0.8s linear infinite' }} />
                <p style={{ color: 'rgba(255,255,255,0.72)', marginTop: 16, fontSize: 13 }}>Analyzing signals and generating your execution brief…</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : (
              <>
                {/* ── Brief document header ── */}
                <div style={{ padding: '16px 24px', background: 'rgba(201,168,76,0.06)', borderTop: `1px solid rgba(201,168,76,0.3)`, borderBottom: `1px solid rgba(201,168,76,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: 12, marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD }}>Execution Brief</div>
                    <div style={{ width: 1, height: 12, background: 'rgba(201,168,76,0.3)' }} />
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.68)' }}>Pre-Staged · System-Analyzed</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: brief?.urgencyLevel === 'critical' ? '#C0392B' : brief?.urgencyLevel === 'high' ? GOLD : TEAL }} />
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: brief?.urgencyLevel === 'critical' ? '#E05A4A' : brief?.urgencyLevel === 'high' ? GOLD : TEAL }}>
                      {brief?.urgencyLevel === 'critical' ? 'Critical Priority' : brief?.urgencyLevel === 'high' ? 'High Priority' : 'Elevated Priority'}
                    </div>
                  </div>
                </div>

                {/* ── Situation Assessment ── */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.68)', marginBottom: 10 }}>Situation Assessment</div>
                  <div style={{ padding: '20px 24px', background: 'rgba(255,255,255,0.03)', borderLeft: `3px solid ${GOLD}`, borderTop: '1px solid rgba(255,255,255,0.08)', borderRight: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.75, margin: 0 }}>
                      {brief?.aiAnalysis || `A ${scenario.title.toLowerCase()} requires immediate cross-functional coordination across your entire C-Suite. Without a pre-staged response, the organization enters a mobilization cycle — identifying stakeholders, aligning on a plan, and assigning roles — before a single action can be taken. That cycle takes weeks. Readiness OS collapses it to 12 minutes because the response was built before this trigger ever fired.`}
                    </p>
                  </div>
                </div>

                {/* ── Pre-Staged Response ── */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.68)', marginBottom: 10 }}>Pre-Staged Response — Deploys on Activation</div>
                  <div style={{ padding: '20px 24px', background: 'rgba(43,138,110,0.06)', borderLeft: `3px solid ${TEAL}`, borderTop: '1px solid rgba(43,138,110,0.2)', borderRight: '1px solid rgba(43,138,110,0.2)', borderBottom: '1px solid rgba(43,138,110,0.2)' }}>
                    {brief?.activatedPlaybooks?.length > 0 ? (
                      <>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.72)', marginBottom: 14 }}>
                          The following Readiness Protocols are pre-staged and will activate the moment you authorize execution:
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>
                          {brief.activatedPlaybooks.map((p: string, i: number) => (
                            <span key={i} style={{ fontSize: 11, fontWeight: 700, padding: '6px 14px', background: 'rgba(43,138,110,0.15)', color: TEAL_LT, border: '1px solid rgba(43,138,110,0.3)' }}>
                              ▸ {p}
                            </span>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>
                        {['Crisis Response Protocol', 'Executive Stakeholder Coordination', 'Communications Lockdown Readiness Protocol', 'Legal & Regulatory Notification'].map((p, i) => (
                          <span key={i} style={{ fontSize: 11, fontWeight: 700, padding: '6px 14px', background: 'rgba(43,138,110,0.15)', color: TEAL_LT, border: '1px solid rgba(43,138,110,0.3)' }}>
                            ▸ {p}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Execution Timeline ── */}
                <div style={{ marginBottom: 32 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.68)', marginBottom: 10 }}>What This Changes</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 0 }}>
                    <div style={{ padding: '20px 24px', background: 'rgba(180,30,30,0.07)', borderTop: '1px solid rgba(192,57,43,0.2)', borderBottom: '1px solid rgba(192,57,43,0.2)', borderLeft: '1px solid rgba(192,57,43,0.2)', borderRight: 'none' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E05A4A', marginBottom: 8 }}>Without Readiness OS</div>
                      <div style={{ fontSize: 36, fontWeight: 700, color: '#fff', lineHeight: 1, marginBottom: 4 }}>30 <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.68)' }}>days</span></div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.72)' }}>to mobilize, align stakeholders, agree on a plan, then begin executing</div>
                    </div>
                    <div style={{ padding: '0 20px', textAlign: 'center' as const, background: 'rgba(255,255,255,0.02)', alignSelf: 'stretch' as const, display: 'flex', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ fontSize: 18, color: GOLD }}>→</div>
                    </div>
                    <div style={{ padding: '20px 24px', background: 'rgba(201,168,76,0.06)', borderTop: `1px solid rgba(201,168,76,0.25)`, borderBottom: `1px solid rgba(201,168,76,0.25)`, borderRight: `1px solid rgba(201,168,76,0.25)`, borderLeft: 'none' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 8 }}>With Readiness OS</div>
                      <div style={{ fontSize: 36, fontWeight: 700, color: GOLD, lineHeight: 1, marginBottom: 4 }}>12 <span style={{ fontSize: 16, color: `rgba(201,168,76,0.5)` }}>minutes</span></div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.72)' }}>from trigger detection to full coordinated executive execution — 3,600× head start</div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {!loadingBrief && (() => {
              const mode = scenarioMode(scenario.id);
              const callout = SCENARIO_BRIEF_CALLOUT[mode];
              return (
                <>
                  <ValueGainCallout
                    mode={mode}
                    position=""
                    insight={callout.insight}
                    gain={callout.gain}
                    dark
                    style={{ marginBottom: 24 }}
                  />
                  <div style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => { setStep(3); scrollToTop(); startWarRoom(tasks); }}
                      style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '14px 40px', background: GOLD, color: NAVY, border: 'none', cursor: 'pointer' }}
                    >
                      Enter the War Room — Start Clock →
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* ── STEP 3: War Room ──────────────────────────────────────────── */}
        {step === 3 && scenario && (
          <div>
            {/* Header with countdown */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, padding: '20px 28px', background: NAVY, border: `1px solid rgba(201,168,76,0.3)` }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD, marginBottom: 4 }}>
                  {companyName ? `${companyName} · War Room Active` : 'War Room Active'}
                </div>
                <div style={{ ...GEO, fontSize: 20, fontWeight: 700, color: '#fff' }}>{scenario.title}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: running ? TEAL_LT : GOLD, marginBottom: 4 }}>{running ? '● LIVE' : '— COMPLETE'}</div>
                <div style={{ fontSize: 48, fontWeight: 700, color: '#fff', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{fmtSecs(elapsed)}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.68)' }}>/ 12:00 target</div>
                <div style={{ marginTop: 6, fontSize: 8, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)', padding: '2px 8px', display: 'inline-block' }}>COMPRESSED SIMULATION</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: GOLD }}>{completedTasks}/{tasks.length}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.68)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Tasks Complete</div>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', marginBottom: 32 }}>
              <div style={{ height: '100%', background: GOLD, width: `${Math.min(100, pct)}%`, transition: `width ${TICK_MS}ms linear` }} />
            </div>

            {/* Status legend */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 16, padding: '10px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.68)' }}>Notification Status:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 0, border: '2px solid #D1D5DB' }} />
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.68)', fontWeight: 600 }}>Queued — not yet sent</span>
                </div>
                <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 0, border: `2px solid ${GOLD}`, background: 'rgba(201,168,76,0.2)' }} />
                  <span style={{ fontSize: 11, color: GOLD, fontWeight: 600 }}>Notified — alert sent to role</span>
                </div>
                <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 0, background: TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, color: '#fff', fontWeight: 700 }}>✓</div>
                  <span style={{ fontSize: 11, color: TEAL_LT, fontWeight: 600 }}>Acknowledged — role confirmed receipt</span>
                </div>
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.68)', fontStyle: 'italic', paddingLeft: 4 }}>
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
                      const st        = getTaskStatus(globalIdx, elapsed, tasks);
                      const isDone    = st === 'done';
                      const isActive  = st === 'active';
                      const isPending = st === 'pending';
                      return (
                        <div key={gi} style={{
                          display: 'flex', gap: 12, padding: '14px 16px', marginBottom: 8,
                          background: isDone ? NAVY : isActive ? '#fff' : '#fff',
                          border: `1px solid ${isDone ? TEAL : isActive ? GOLD : BORDER}`,
                          borderLeft: `4px solid ${isDone ? TEAL : isActive ? GOLD : '#D1D5DB'}`,
                          transition: 'all 0.4s ease',
                          opacity: isPending ? 0.65 : 1,
                        }}>
                          {/* Status icon */}
                          <div style={{ flexShrink: 0, marginTop: 2 }}>
                            {isDone ? (
                              <div style={{ width: 20, height: 20, borderRadius: 0, background: TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#fff', fontWeight: 800 }}>✓</div>
                            ) : isActive ? (
                              <div style={{ width: 20, height: 20, borderRadius: 0, border: `2px solid ${GOLD}`, background: 'rgba(201,168,76,0.15)', animation: 'pulse 1.2s ease-in-out infinite' }} />
                            ) : (
                              <div style={{ width: 20, height: 20, borderRadius: 0, border: '2px solid #D1D5DB' }} />
                            )}
                          </div>
                          {/* Content */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                              <span style={{ fontSize: 11, fontWeight: 700, color: isDone ? TEAL_LT : GOLD, letterSpacing: '0.05em' }}>{t.role}</span>
                              {isDone && (
                                <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '2px 8px', background: TEAL, color: '#fff' }}>ACK ✓</span>
                              )}
                              {isActive && (
                                <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '2px 8px', background: 'rgba(201,168,76,0.12)', color: GOLD, border: `1px solid ${GOLD}` }}>NOTIFIED</span>
                              )}
                              {isPending && (
                                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '2px 8px', background: '#F3F4F6', color: '#9CA3AF' }}>QUEUED</span>
                              )}
                            </div>
                            <div style={{ fontSize: 13, color: isDone ? 'rgba(255,255,255,0.9)' : NAVY, fontWeight: 600, lineHeight: 1.4 }}>{t.action}</div>
                          </div>
                          {/* Time target */}
                          <div style={{ fontSize: 10, color: isDone ? 'rgba(255,255,255,0.45)' : MUTED, flexShrink: 0, marginTop: 2 }}>{t.time}</div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Live Feed */}
              <div style={{ background: NAVY, padding: 20 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: running ? TEAL_LT : 'rgba(255,255,255,0.68)', marginBottom: 16 }}>
                  {running ? '● LIVE FEED' : '○ FEED PAUSED'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 480, overflowY: 'auto' }}>
                  {liveEvents.map((e, i) => {
                    const isConfirmed  = e.type === 'acknowledged';
                    const isDispatched = e.type === 'notified';
                    const borderColor = isConfirmed ? TEAL : isDispatched ? GOLD : 'rgba(255,255,255,0.2)';
                    const textColor   = isConfirmed ? '#6EE7B7' : 'rgba(255,255,255,0.8)';
                    return (
                      <div key={i} style={{ fontSize: 11, color: textColor, borderLeft: `2px solid ${borderColor}`, paddingLeft: 10, lineHeight: 1.5 }}>
                        <span style={{ color: 'rgba(255,255,255,0.68)', fontSize: 10, display: 'block', marginBottom: 2 }}>{e.time}</span>
                        {e.text}
                      </div>
                    );
                  })}
                  {liveEvents.length === 0 && (
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.68)', fontStyle: 'italic' }}>Awaiting first action…</div>
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
              <div style={{ width: 48, height: 2, background: TEAL, margin: '0 auto 24px' }} />
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
                <div key={m.label} style={{ padding: '20px', background: 'rgba(255,255,255,0.04)', borderTop: `3px solid ${m.color}`, borderRight: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)', borderLeft: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: m.color, marginBottom: 8 }}>{m.label}</div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: '#fff', lineHeight: 1, marginBottom: 4 }}>{m.value}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{m.sub}</div>
                </div>
              ))}
            </div>

            {/* Debrief value callout — what this activation produced */}
            {(() => {
              const mode = scenarioMode(scenario.id);
              const callout = SCENARIO_DEBRIEF_CALLOUT[mode];
              return (
                <ValueGainCallout
                  mode={mode}
                  position=""
                  insight={callout.insight}
                  gain={callout.gain}
                  dark
                  style={{ marginBottom: 24 }}
                />
              );
            })()}

            {/* What this means */}
            <div style={{ padding: '28px 32px', background: 'rgba(201,168,76,0.08)', borderLeft: `4px solid ${GOLD}`, borderTop: `1px solid ${GOLD}`, borderRight: `1px solid ${GOLD}`, borderBottom: `1px solid ${GOLD}`, marginBottom: 24 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 12 }}>What You Just Experienced</div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>
                In this test drive, Readiness OS coordinated {tasks.length} cross-functional tasks across {Array.from(new Set(tasks.map(t => t.role))).length} leadership roles — in sequence, with context, and with zero navigation. In a real activation, this same sequence deploys across your actual organization, notifying real stakeholders, assigning real tasks, and generating real documentation. The result: your organization moves from detection to coordinated response in under 12 minutes.
              </p>
            </div>

            {/* Fearless resolution */}
            <div style={{ padding: '24px 32px', background: 'rgba(43,138,110,0.08)', borderLeft: `4px solid ${TEAL}`, borderTop: '1px solid rgba(43,138,110,0.3)', borderRight: '1px solid rgba(43,138,110,0.3)', borderBottom: '1px solid rgba(43,138,110,0.3)', marginBottom: 24, textAlign: 'center' }}>
              <p style={{ ...GEO, fontSize: 'clamp(18px,2.5vw,26px)', fontStyle: 'italic', color: '#fff', lineHeight: 1.4, marginBottom: 8 }}>
                "The response was ready before the trigger fired."
              </p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.72)', letterSpacing: '0.06em' }}>
                That's preparation. That's readiness. That's how enterprises become fearless.
              </p>
            </div>

            {/* Canonical clarity quote */}
            <div style={{ padding: '20px 32px', background: 'rgba(201,168,76,0.06)', borderLeft: `3px solid ${GOLD}`, marginBottom: 40, textAlign: 'center' }}>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(16px,2vw,22px)', fontStyle: 'italic', color: GOLD, lineHeight: 1.5, margin: 0 }}>
                "The twelve minutes is not about speed. It is about clarity built ahead of time."
              </p>
            </div>

            {/* STARR Reflection — what this activation built */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2, marginBottom: 40 }}>
              {[
                { label: 'Institutional Memory', body: 'The decisions made in this activation now exist as organizational record — not reconstructed from email next time, already documented.' },
                { label: 'Preparation Compounds', body: 'Every activation makes the next response faster. The ownership, sequencing, and context built here carry forward to every future trigger in this domain.' },
                { label: 'The Ownership Was Built', body: 'The roles acknowledged their tasks before the pressure arrived. That is not a behavioral outcome — it is a confirmed record the preparation phase produced.' },
              ].map(r => (
                <div key={r.label} style={{ padding: '20px 24px', background: 'rgba(255,255,255,0.03)', borderTop: `2px solid ${TEAL}`, borderRight: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: TEAL, marginBottom: 10 }}>{r.label}</div>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, margin: 0 }}>{r.body}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>

              {/* Email capture — send me this summary */}
              <div style={{ padding: '24px 28px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.12)', maxWidth: 520, width: '100%' }}>
                {emailStatus === 'sent' ? (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: TEAL, marginBottom: 8 }}>✓ Summary Sent</div>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: 0 }}>
                      Check your inbox for the 12-minute execution summary. We will be in touch about the Founding Partner Program.
                    </p>
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#fff', marginBottom: 8 }}>Send Me This Execution Summary</div>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: '0 0 16px' }}>
                      Get this scenario summary, the 3,600× data, and Founding Partner details in your inbox.
                    </p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
                      <input
                        type="email"
                        value={emailInput}
                        onChange={e => setEmailInput(e.target.value)}
                        placeholder="Your work email"
                        style={{
                          flex: 1, minWidth: 180, padding: '10px 14px',
                          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)',
                          color: '#fff', fontSize: 13, outline: 'none', fontFamily: 'inherit',
                        }}
                      />
                      <button
                        disabled={emailStatus === 'loading' || !emailInput.includes('@')}
                        onClick={async () => {
                          if (!emailInput.includes('@') || !scenario) return;
                          setEmailStatus('loading');
                          try {
                            const r = await fetch('/api/test-drive/email-summary', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                email: emailInput,
                                companyName: companyName || null,
                                scenarioId: scenario.id,
                                scenarioTitle: scenario.title,
                                completedTasks,
                                totalTasks: tasks.length,
                              }),
                            });
                            const d = await r.json();
                            setEmailStatus(d.success ? 'sent' : 'error');
                          } catch { setEmailStatus('error'); }
                        }}
                        style={{
                          padding: '10px 20px', background: emailInput.includes('@') ? GOLD : 'rgba(201,168,76,0.3)',
                          color: NAVY, border: 'none', fontSize: 12, fontWeight: 700,
                          letterSpacing: '0.08em', textTransform: 'uppercase' as const,
                          cursor: emailInput.includes('@') ? 'pointer' : 'not-allowed',
                          whiteSpace: 'nowrap' as const,
                        }}
                      >
                        {emailStatus === 'loading' ? 'Sending…' : 'Send Summary →'}
                      </button>
                    </div>
                    {emailStatus === 'error' && (
                      <p style={{ fontSize: 12, color: '#E05A4A', marginTop: 8, marginBottom: 0 }}>Something went wrong — please try again or email mbrunke@vaughnmartin.com</p>
                    )}
                  </>
                )}
              </div>

              {/* Investor path */}
              <div style={{ padding: '20px 28px', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', maxWidth: 520, width: '100%' }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 8 }}>Evaluating for Investment?</div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: '0 0 12px' }}>
                  Talk directly with the founder — no intermediary, no deck-first process.
                </p>
                <a href="mailto:mbrunke@vaughnmartin.com" style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', color: GOLD, textDecoration: 'none' }}>
                  mbrunke@vaughnmartin.com →
                </a>
              </div>

              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', maxWidth: 480 }}>
                Ready to pre-stage this for your organization — with your real team, your real scenarios, and your real Readiness Protocols?
              </p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
                <a href="/request-access" style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '13px 32px', background: GOLD, color: NAVY, textDecoration: 'none' }}>
                  Request Founding Partner Access →
                </a>
                <a href="/growth" style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '13px 32px', background: 'transparent', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.3)', textDecoration: 'none' }}>
                  See Pricing →
                </a>
                <a href="/investor-landing" style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '13px 32px', background: 'transparent', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.3)', textDecoration: 'none' }}>
                  Investor View →
                </a>
                <button
                  onClick={() => { setStep(1); scrollToTop(); setSelectedId(null); setBrief(null); setElapsed(0); setRunning(false); setLiveEvents([]); setEmailInput(''); setEmailStatus('idle'); }}
                  style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '13px 32px', background: 'transparent', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}
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
