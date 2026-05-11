import { useState, useEffect, useRef } from "react";

/* ─── Brand constants ─────────────────────────────────────────────────────── */
const NAVY  = "#080d24";
const DARK  = "#030612";
const DARK2 = "#040a18";
const GOLD  = "#C9A84C";
const GOLD2 = "#e2c068";
const TEAL  = "#4dc4a0";
const RED   = "#e05252";
const AMB   = "#e09040";
const W     = "#ffffff";
const W90   = "rgba(255,255,255,0.90)";
const W70   = "rgba(255,255,255,0.70)";
const W50   = "rgba(255,255,255,0.50)";
const W25   = "rgba(255,255,255,0.25)";
const BD    = "rgba(201,168,76,0.22)";
const GBG   = "rgba(201,168,76,0.06)";
const BC    = { fontFamily: "'Barlow Condensed','Arial Narrow',sans-serif" } as const;
const CG    = { fontFamily: "'Cormorant Garamond',Georgia,serif" } as const;
const BAR   = { fontFamily: "'Barlow',sans-serif" } as const;

/* ─── Scenario data ───────────────────────────────────────────────────────── */
const COMPANY = "Meridian Consumer Group";
const TICKER  = "NYSE: MCG";
const THREAT  = "Activist Investor Escalation";

const SIGNALS = [
  {
    time: "2:47:03 AM EST",
    source: "SEC EDGAR",
    headline: "13D FILING — Elliott Management LP",
    detail: "8.2% stake in Meridian Consumer Group declared. Stated demands: 3 independent board seats + full strategic review. Engagement deadline: 14 days.",
    score: 94, color: RED, icon: "⚠",
  },
  {
    time: "2:47:09 AM EST",
    source: "Reuters Newswire",
    headline: "Elliott calls Meridian strategy 'value-destructive'",
    detail: "Public statement released. Demands CEO accountability meeting. Notes underperformance vs. peer index over 3-year period. Signals intention to go public with campaign.",
    score: 78, color: RED, icon: "📡",
  },
  {
    time: "2:47:14 AM EST",
    source: "Social Signal Monitor",
    headline: "#MeridianConsumer — 1,240 mentions in 6 minutes",
    detail: "Sentiment index: −78 (deeply hostile). Institutional investor accounts amplifying. Financial media pickup imminent. Proxy firm analysts commenting.",
    score: 61, color: AMB, icon: "📶",
  },
  {
    time: "2:47:22 AM EST",
    source: "ISS ProxyPulse",
    headline: "Proxy Fight Probability: HIGH — 87%",
    detail: "ISS historical activation model: without coordinated institutional outreach in 72h, Elliott likely secures ≥2 board seats. Glass Lewis watching.",
    score: 87, color: RED, icon: "🎯",
  },
];

const TASKS = [
  { id:  1, owner: "CEO",             name: "Marcus Chen",    task: "Review executive brief and authorize full activation",                       timing: "T+0:45",  cat: "AUTHORITY"      },
  { id:  2, owner: "CFO",             name: "Sarah Park",     task: "Prepare financial narrative counter-brief — 3-year TSR, margin trajectory",  timing: "T+2:00",  cat: "FINANCE"        },
  { id:  3, owner: "General Counsel", name: "David Torres",   task: "Initiate poison pill review with Sullivan & Cromwell (pre-authorized)",      timing: "T+2:30",  cat: "LEGAL"          },
  { id:  4, owner: "IR Head",         name: "Robert Kim",     task: "Map top-20 institutional holders — priority outreach list, vote analysis",   timing: "T+3:00",  cat: "INVESTOR REL."  },
  { id:  5, owner: "CCO",             name: "Jennifer Walsh", task: "Draft holding statement for all inbound media inquiries",                    timing: "T+3:30",  cat: "COMMUNICATIONS" },
  { id:  6, owner: "CEO",             name: "Marcus Chen",    task: "Approve and send emergency board notification",                              timing: "T+4:00",  cat: "AUTHORITY"      },
  { id:  7, owner: "Board Chair",     name: "Linda Harrison", task: "Convene emergency board call — 6:00 AM EST virtual session",                timing: "T+5:00",  cat: "GOVERNANCE"     },
  { id:  8, owner: "CFO",             name: "Sarah Park",     task: "Engage Lazard as financial advisor (NDA pre-signed, retainer pre-approved)", timing: "T+6:00",  cat: "FINANCE"        },
  { id:  9, owner: "IR Head",         name: "Robert Kim",     task: "Begin 1:1 outreach with top 10 institutional shareholders",                  timing: "T+7:00",  cat: "INVESTOR REL."  },
  { id: 10, owner: "General Counsel", name: "David Torres",   task: "File preliminary proxy response materials with SEC",                         timing: "T+7:30",  cat: "LEGAL"          },
  { id: 11, owner: "CCO",             name: "Jennifer Walsh", task: "Issue controlled public statement — CEO-approved messaging only",            timing: "T+8:00",  cat: "COMMUNICATIONS" },
  { id: 12, owner: "CEO",             name: "Marcus Chen",    task: "Deliver internal leadership brief — executives, VPs, and people managers",   timing: "T+9:00",  cat: "AUTHORITY"      },
  { id: 13, owner: "IR Head",         name: "Robert Kim",     task: "ISS relationship briefing — pre-scheduled analyst slot activated",           timing: "T+10:00", cat: "INVESTOR REL."  },
  { id: 14, owner: "Board",           name: "Full Board",     task: "Vote on official response posture — authorize defense strategy",             timing: "T+11:30", cat: "GOVERNANCE"     },
];

const STAKEHOLDERS = [
  { name: "Marcus Chen",    title: "Chief Executive Officer",          initials: "MC", notified: "T+1:28", status: "ACKNOWLEDGED" },
  { name: "Sarah Park",     title: "Chief Financial Officer",          initials: "SP", notified: "T+1:28", status: "ACKNOWLEDGED" },
  { name: "David Torres",   title: "General Counsel & CLO",            initials: "DT", notified: "T+1:29", status: "ACKNOWLEDGED" },
  { name: "Jennifer Walsh", title: "Chief Communications Officer",     initials: "JW", notified: "T+1:29", status: "ACKNOWLEDGED" },
  { name: "Robert Kim",     title: "Head of Investor Relations",       initials: "RK", notified: "T+1:30", status: "ACKNOWLEDGED" },
  { name: "Linda Harrison", title: "Board Chair",                      initials: "LH", notified: "T+1:30", status: "ACKNOWLEDGED" },
];

const OLD_MODEL = [
  { day: "Day 1",    event: "Board Chair learns at 7 AM via CFO phone call. Emergency email chain begins. 47 calls needed." },
  { day: "Week 1",   event: "Investment bankers engaged. Goldman, Lazard, Morgan Stanley briefed. Pitch decks requested." },
  { day: "Week 2",   event: "Proxy advisors briefed. ISS, Glass Lewis engaged. Legal strategy formally initiated." },
  { day: "Week 3",   event: "Institutional investor mapping completed. Messaging aligned across legal, comms, finance, and board." },
  { day: "Week 4",   event: "1:1 outreach to institutional holders begins. Elliott has 6 institutional allies by this point." },
  { day: "Day 30+",  event: "Response posture finalized. Counter-narrative issued. Strategic window partially closed." },
];

/* ─── Reusable micro-components ─────────────────────────────────────────────── */
function SectionLabel({ children, color = GOLD }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
      <span style={{ display: "inline-block", width: 28, height: 1.5, background: color, flexShrink: 0 }}/>
      <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase", color }}>{children}</span>
    </div>
  );
}

function NavButtons({ phase, total, onContinue, onBack, continueLabel = "Continue →", disabled = false }:
  { phase: number; total: number; onContinue: () => void; onBack?: () => void; continueLabel?: string; disabled?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 36, paddingTop: 24, borderTop: `1px solid ${BD}` }}>
      {phase > 0 && onBack ? (
        <button onClick={onBack} style={{ ...BC, background: "transparent", border: `1px solid ${W25}`, color: W50, fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", padding: "10px 20px", cursor: "pointer" }}>
          ← Back
        </button>
      ) : <div/>}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ ...BC, fontSize: 9, fontWeight: 600, letterSpacing: "0.2em", color: W50 }}>
          STEP {phase + 1} OF {total}
        </span>
        {phase < total - 1 && (
          <button
            onClick={onContinue}
            disabled={disabled}
            style={{
              ...BC, background: disabled ? "rgba(201,168,76,0.2)" : GOLD, border: "none",
              color: disabled ? W50 : DARK, fontSize: 14, fontWeight: 800,
              letterSpacing: "0.1em", padding: "12px 28px", cursor: disabled ? "not-allowed" : "pointer",
              textTransform: "uppercase",
            }}
          >
            {continueLabel}
          </button>
        )}
      </div>
    </div>
  );
}

function RiskBadge({ score, color }: { score: number; color: string }) {
  const label = score >= 75 ? "HIGH" : score >= 35 ? "MEDIUM" : "LOW";
  return (
    <span style={{ ...BC, background: `${color}18`, border: `1px solid ${color}60`, color, fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", padding: "3px 10px" }}>
      {label} · {score}
    </span>
  );
}

function CatBadge({ cat }: { cat: string }) {
  const color = cat === "AUTHORITY" ? GOLD : cat === "LEGAL" ? AMB : cat === "GOVERNANCE" ? "#a070f0" : cat === "FINANCE" ? "#60a0f0" : cat === "COMMUNICATIONS" ? "#e06090" : TEAL;
  return (
    <span style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.18em", color, opacity: 0.85, whiteSpace: "nowrap" }}>{cat}</span>
  );
}

/* ─── Phase 0: The Trigger Fires ────────────────────────────────────────────── */
function PhaseTrigger({ onContinue }: { onContinue: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 200); return () => clearTimeout(t); }, []);
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 28px 40px" }}>
      <div style={{ textAlign: "center", marginBottom: 48, opacity: visible ? 1 : 0, transition: "opacity 0.8s" }}>
        <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.45em", color: RED, textTransform: "uppercase", marginBottom: 20 }}>
          ◆ Live Simulation — Real Scenario · Real Product Delivery
        </div>
        <div style={{ ...BC, fontSize: 56, fontWeight: 900, color: W, lineHeight: 1.0, marginBottom: 12, letterSpacing: "-0.02em" }}>
          IT'S 2:47 AM.
        </div>
        <div style={{ ...CG, fontSize: 32, fontStyle: "italic", color: GOLD, lineHeight: 1.2, marginBottom: 32 }}>
          A strategic trigger just fired.
        </div>
        <div style={{ ...BAR, fontSize: 16, color: W70, lineHeight: 1.7, maxWidth: 540, margin: "0 auto 40px" }}>
          Elliott Management LP has filed a 13D with the SEC. They've taken an 8.2% stake in your company and are demanding three board seats and a full strategic review.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 40 }}>
        {[
          { label: "Company", value: COMPANY, sub: TICKER },
          { label: "Threat Type", value: THREAT, sub: "Risk & Resilience — Protocol #47" },
          { label: "Time of Trigger", value: "2:47:03 AM EST", sub: "Wednesday — Board asleep" },
          { label: "Without Readiness OS", value: "30-Day Mobilization", sub: "Before execution even begins" },
        ].map(({ label, value, sub }, i) => (
          <div key={i} style={{ background: GBG, border: `1px solid ${BD}`, padding: "20px 22px" }}>
            <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.25em", color: GOLD, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
            <div style={{ ...BC, fontSize: 18, fontWeight: 800, color: W, lineHeight: 1.2, marginBottom: 3 }}>{value}</div>
            <div style={{ ...BAR, fontSize: 11, color: W50, lineHeight: 1.4 }}>{sub}</div>
          </div>
        ))}
      </div>

      <div style={{ background: `${RED}10`, border: `1px solid ${RED}40`, padding: "24px 28px", marginBottom: 32, display: "flex", gap: 20, alignItems: "flex-start" }}>
        <div style={{ fontSize: 28, flexShrink: 0, marginTop: 2 }}>⚡</div>
        <div>
          <div style={{ ...BC, fontSize: 14, fontWeight: 800, color: W, letterSpacing: "0.06em", marginBottom: 8, textTransform: "uppercase" }}>
            The old model: 30 days before you can move.
          </div>
          <div style={{ ...BAR, fontSize: 14, color: W70, lineHeight: 1.65 }}>
            In a Fortune 1000 without Readiness OS, the next 30 days are consumed by figuring out who needs to be in the room, agreeing on a plan, engaging advisors, and aligning stakeholders — before execution even begins. Elliott already has a 30-day head start. The strategic window closes before you're ready.
          </div>
        </div>
      </div>

      <div style={{ background: `${TEAL}10`, border: `1px solid ${TEAL}40`, padding: "24px 28px", marginBottom: 40 }}>
        <div style={{ ...CG, fontSize: 22, fontStyle: "italic", color: TEAL, lineHeight: 1.4, marginBottom: 6 }}>
          "The response is ready before the trigger fires."
        </div>
        <div style={{ ...BAR, fontSize: 13, color: W50, lineHeight: 1.5 }}>
          Readiness OS compresses your entire mobilization cycle to 12 minutes. The protocol was pre-staged. The advisors are pre-authorized. The tasks are already assigned. Your only job is to authorize.
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <button
          onClick={onContinue}
          style={{ ...BC, background: GOLD, border: "none", color: DARK, fontSize: 16, fontWeight: 900, letterSpacing: "0.14em", padding: "18px 48px", cursor: "pointer", textTransform: "uppercase" }}
        >
          Watch the Response Activate →
        </button>
        <div style={{ ...BC, fontSize: 9, color: W50, letterSpacing: "0.2em", marginTop: 12, textTransform: "uppercase" }}>
          7-step guided simulation · Approx. 8 minutes to complete
        </div>
      </div>
    </div>
  );
}

/* ─── Phase 1: Signals Detected ─────────────────────────────────────────────── */
function PhaseSignals({ onContinue, onBack, phase, total }: { onContinue: () => void; onBack: () => void; phase: number; total: number }) {
  const [revealed, setRevealed] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setRevealed(r => r < SIGNALS.length ? r + 1 : r), 1200);
    return () => clearInterval(interval);
  }, []);
  const allRevealed = revealed >= SIGNALS.length;
  const riskScore = 82;
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "52px 28px 40px" }}>
      <SectionLabel color={RED}>Step 1 — Signal Detection · T+0:00 → T+0:22</SectionLabel>
      <div style={{ marginBottom: 8 }}>
        <h1 style={{ ...BC, fontSize: 40, fontWeight: 900, color: W, lineHeight: 1.05, letterSpacing: "-0.01em", marginBottom: 6 }}>
          4 signals detected.<br/>Risk scored in 22 seconds.
        </h1>
        <p style={{ ...BAR, fontSize: 14, color: W70, lineHeight: 1.65, maxWidth: 600, marginBottom: 32 }}>
          Readiness OS continuously monitors 221 strategic trigger patterns across SEC filings, newswires, social signals, and proxy intelligence. The moment the 13D filed, four corroborating signals were detected and scored simultaneously.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
        {SIGNALS.map((s, i) => (
          <div
            key={i}
            style={{
              background: GBG, border: `1px solid ${BD}`,
              padding: "18px 20px", display: "flex", gap: 16, alignItems: "flex-start",
              opacity: i < revealed ? 1 : 0.1, transition: "opacity 0.5s",
            }}
          >
            <div style={{ flexShrink: 0, width: 36, textAlign: "center" }}>
              <div style={{ ...BC, fontSize: 18, lineHeight: 1 }}>{s.icon}</div>
              <div style={{ ...BC, fontSize: 8, color: s.color, fontWeight: 700, letterSpacing: "0.1em", marginTop: 4 }}>S.{String(i+1).padStart(2,"0")}</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 4 }}>
                <div>
                  <div style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.25em", color: s.color, textTransform: "uppercase", marginBottom: 3 }}>{s.source} · {s.time}</div>
                  <div style={{ ...BC, fontSize: 15, fontWeight: 800, color: W, letterSpacing: "0.02em" }}>{s.headline}</div>
                </div>
                <RiskBadge score={s.score} color={s.color}/>
              </div>
              <div style={{ ...BAR, fontSize: 13, color: W70, lineHeight: 1.55 }}>{s.detail}</div>
            </div>
          </div>
        ))}
      </div>

      {allRevealed && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 8 }}>
          {[
            { label: "Composite Risk Score", value: `${riskScore}/100`, sub: "HIGH — activation threshold exceeded", color: RED },
            { label: "Detection Speed", value: "22 sec", sub: "All 4 signals correlated & scored", color: GOLD },
            { label: "Protocol Match", value: "#47 — Confirmed", sub: "Activist Investor Defense · activated", color: TEAL },
          ].map(({ label, value, sub, color }, i) => (
            <div key={i} style={{ background: `${color}0d`, border: `1px solid ${color}35`, padding: "18px 16px" }}>
              <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
              <div style={{ ...BC, fontSize: 22, fontWeight: 900, color, lineHeight: 1, marginBottom: 5 }}>{value}</div>
              <div style={{ ...BAR, fontSize: 11, color: W50, lineHeight: 1.4 }}>{sub}</div>
            </div>
          ))}
        </div>
      )}

      <NavButtons phase={phase} total={total} onContinue={onContinue} onBack={onBack} continueLabel="See the Protocol →" disabled={!allRevealed}/>
    </div>
  );
}

/* ─── Phase 2: Protocol Matched ─────────────────────────────────────────────── */
function PhaseProtocol({ onContinue, onBack, phase, total }: { onContinue: () => void; onBack: () => void; phase: number; total: number }) {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "52px 28px 40px" }}>
      <SectionLabel color={GOLD}>Step 2 — Protocol Match · T+0:45</SectionLabel>
      <h1 style={{ ...BC, fontSize: 40, fontWeight: 900, color: W, lineHeight: 1.05, letterSpacing: "-0.01em", marginBottom: 6 }}>
        Protocol #47 pulled from the library.<br/>
        <span style={{ color: GOLD }}>Already written. Already ready.</span>
      </h1>
      <p style={{ ...BAR, fontSize: 14, color: W70, lineHeight: 1.65, maxWidth: 620, marginBottom: 36 }}>
        Readiness OS matched the signal composite to one of its 170 pre-staged Readiness Protocols. This protocol was not assembled in response to the trigger — it was written months ago, tested, and waiting. The response was ready before this moment arrived.
      </p>

      {/* Protocol Card */}
      <div style={{ background: GBG, border: `1px solid ${GOLD}50`, padding: "32px 28px", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
          <div>
            <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", color: GOLD, textTransform: "uppercase", marginBottom: 6 }}>Readiness Protocol · Risk & Resilience</div>
            <div style={{ ...BC, fontSize: 28, fontWeight: 900, color: W, letterSpacing: "-0.01em", lineHeight: 1.1, marginBottom: 4 }}>
              #47 — Activist Investor Defense
            </div>
            <div style={{ ...BAR, fontSize: 14, color: W70, lineHeight: 1.55, maxWidth: 520 }}>
              Coordinated response to activist shareholder campaign — investor relations, legal, board mobilization, financial advisory, and communications activation in a single pre-staged execution sequence.
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: TEAL, textTransform: "uppercase", marginBottom: 6 }}>STATUS</div>
            <div style={{ ...BC, background: `${TEAL}18`, border: `1px solid ${TEAL}50`, color: TEAL, fontSize: 13, fontWeight: 800, letterSpacing: "0.2em", padding: "6px 16px" }}>
              STAGED — READY
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, borderTop: `1px solid ${BD}`, paddingTop: 20, marginBottom: 24 }}>
          {[
            { label: "Tasks Pre-Staged",   value: "14" },
            { label: "Stakeholders",        value: "6"  },
            { label: "Est. Activation",     value: "12 min" },
            { label: "Protocol Last Tested",value: "Q3 Drill" },
          ].map(({ label, value }, i) => (
            <div key={i} style={{ borderRight: i < 3 ? `1px solid ${BD}` : "none", padding: "0 20px 0 (i === 0 ? 0 : 20px)" }}>
              <div style={{ ...BC, fontSize: 28, fontWeight: 900, color: GOLD, lineHeight: 1, marginBottom: 4 }}>{value}</div>
              <div style={{ ...BC, fontSize: 9, fontWeight: 600, letterSpacing: "0.18em", color: W50, textTransform: "uppercase" }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: `1px solid ${BD}`, paddingTop: 20 }}>
          <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.25em", color: GOLD, textTransform: "uppercase", marginBottom: 14 }}>Pre-Authorized Resources</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              "Sullivan & Cromwell — outside legal counsel (NDA signed, conflict-cleared)",
              "Lazard — financial advisor (retainer pre-approved by board resolution)",
              "Joele Frank — crisis communications firm (on-call retainer active)",
              "ISS & Glass Lewis — proxy advisor relationship contacts pre-loaded",
              "D&O insurance carrier — notified automatically on activation",
              "Board emergency protocol — quorum rules and call logistics pre-set",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <span style={{ color: TEAL, fontSize: 10, flexShrink: 0, marginTop: 2 }}>◆</span>
                <span style={{ ...BAR, fontSize: 12, color: W70, lineHeight: 1.45 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: `${TEAL}08`, border: `1px solid ${TEAL}30`, padding: "18px 22px", marginBottom: 8 }}>
        <div style={{ ...BAR, fontSize: 13, color: W70, lineHeight: 1.6 }}>
          <strong style={{ color: TEAL }}>This is the key distinction.</strong> Every organization has eventually developed a response to an activist campaign. Readiness OS ensured that response was documented, tested, and pre-staged months before Elliott filed. The protocol wasn't written in reaction — it was written in preparation.
        </div>
      </div>

      <NavButtons phase={phase} total={total} onContinue={onContinue} onBack={onBack} continueLabel="Open the War Room →"/>
    </div>
  );
}

/* ─── Phase 3: War Room Staged ───────────────────────────────────────────────── */
function PhaseWarRoom({ onContinue, onBack, phase, total }: { onContinue: () => void; onBack: () => void; phase: number; total: number }) {
  const [activeTab, setActiveTab] = useState<"tasks"|"stakeholders">("tasks");
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "52px 28px 40px" }}>
      <SectionLabel color={TEAL}>Step 3 — War Room Activation · T+0:45 → T+1:30</SectionLabel>
      <h1 style={{ ...BC, fontSize: 38, fontWeight: 900, color: W, lineHeight: 1.05, letterSpacing: "-0.01em", marginBottom: 6 }}>
        14 tasks staged. 6 stakeholders notified.<br/>
        <span style={{ color: TEAL }}>45 seconds after trigger detection.</span>
      </h1>
      <p style={{ ...BAR, fontSize: 14, color: W70, lineHeight: 1.65, maxWidth: 640, marginBottom: 32 }}>
        The war room does not assemble — it activates. Every task has a pre-assigned owner. Every stakeholder receives a precise brief tailored to their role and decision rights. No one wakes up wondering what they should be doing.
      </p>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: `1px solid ${BD}` }}>
        {(["tasks", "stakeholders"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...BC, background: "transparent", border: "none",
              borderBottom: activeTab === tab ? `2px solid ${GOLD}` : "2px solid transparent",
              color: activeTab === tab ? GOLD : W50, fontSize: 12, fontWeight: 700,
              letterSpacing: "0.2em", textTransform: "uppercase", padding: "12px 20px",
              cursor: "pointer", marginBottom: -1,
            }}
          >
            {tab === "tasks" ? "14 Tasks" : "6 Stakeholders"}
          </button>
        ))}
      </div>

      {activeTab === "tasks" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 24 }}>
          {TASKS.map((t) => (
            <div key={t.id} style={{ background: GBG, border: `1px solid rgba(255,255,255,0.08)`, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <div style={{ ...BC, fontSize: 10, fontWeight: 800, color: W25, width: 24, flexShrink: 0 }}>#{t.id}</div>
              <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", color: W25, width: 68, flexShrink: 0 }}>{t.timing}</div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ ...BC, fontSize: 13, fontWeight: 700, color: W, letterSpacing: "0.02em", marginBottom: 2 }}>{t.task}</div>
                <div style={{ ...BAR, fontSize: 11, color: W50 }}>{t.owner} — {t.name}</div>
              </div>
              <CatBadge cat={t.cat}/>
              <div style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", color: TEAL, background: `${TEAL}12`, border: `1px solid ${TEAL}30`, padding: "2px 8px" }}>STAGED</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "stakeholders" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
          {STAKEHOLDERS.map((s, i) => (
            <div key={i} style={{ background: GBG, border: `1px solid ${BD}`, padding: "20px 22px", display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", border: `1.5px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ ...BC, fontSize: 13, fontWeight: 800, color: GOLD }}>{s.initials}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ ...BC, fontSize: 15, fontWeight: 800, color: W, marginBottom: 2 }}>{s.name}</div>
                <div style={{ ...BAR, fontSize: 12, color: W50, marginBottom: 8, lineHeight: 1.4 }}>{s.title}</div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ ...BC, fontSize: 8, color: W25, letterSpacing: "0.15em" }}>NOTIFIED {s.notified}</span>
                  <span style={{ ...BC, fontSize: 8, fontWeight: 700, color: TEAL, letterSpacing: "0.2em", background: `${TEAL}12`, border: `1px solid ${TEAL}30`, padding: "2px 8px" }}>{s.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ background: `rgba(255,255,255,0.03)`, border: `1px solid ${BD}`, padding: "18px 22px", marginBottom: 8 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {[
            { label: "Tasks Staged",       value: "14 / 14",   color: TEAL },
            { label: "Stakeholders Ready",  value: "6 / 6",     color: TEAL },
            { label: "Time Elapsed",        value: "1m 30s",    color: GOLD },
          ].map(({ label, value, color }, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ ...BC, fontSize: 24, fontWeight: 900, color, lineHeight: 1, marginBottom: 4 }}>{value}</div>
              <div style={{ ...BC, fontSize: 9, fontWeight: 600, letterSpacing: "0.2em", color: W50, textTransform: "uppercase" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <NavButtons phase={phase} total={total} onContinue={onContinue} onBack={onBack} continueLabel="CEO Authorizes →"/>
    </div>
  );
}

/* ─── Phase 4: Executive Authorization ──────────────────────────────────────── */
function PhaseAuthorize({ onAuthorize, onBack, phase, total }: { onAuthorize: () => void; onBack: () => void; phase: number; total: number }) {
  const [authorized, setAuthorized] = useState(false);
  const [time, setTime] = useState(0);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    interval.current = setInterval(() => setTime(t => t + 1), 1000);
    return () => { if (interval.current) clearInterval(interval.current); };
  }, []);

  const handleAuth = () => {
    setAuthorized(true);
    if (interval.current) clearInterval(interval.current);
    setTimeout(onAuthorize, 2200);
  };

  const mins = Math.floor(time / 60);
  const secs = String(time % 60).padStart(2, "0");

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "52px 28px 40px" }}>
      <SectionLabel color={GOLD}>Step 4 — Executive Authorization · T+3:22</SectionLabel>
      <h1 style={{ ...BC, fontSize: 38, fontWeight: 900, color: W, lineHeight: 1.05, letterSpacing: "-0.01em", marginBottom: 6 }}>
        CEO Marcus Chen receives the brief.<br/>
        <span style={{ color: GOLD }}>One decision. Full authority.</span>
      </h1>
      <p style={{ ...BAR, fontSize: 14, color: W70, lineHeight: 1.65, maxWidth: 600, marginBottom: 32 }}>
        No committee. No alignment cycle. The executive brief summarizes the situation, the protocol, and every resource already staged. The CEO's only job: Authorize or hold. The preparation compressed every other question out of this moment.
      </p>

      {/* Live timer */}
      <div style={{ background: `${RED}0d`, border: `1px solid ${RED}30`, padding: "12px 20px", display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
        <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", color: RED, textTransform: "uppercase" }}>Live · Time on Scene</div>
        <div style={{ ...BC, fontSize: 22, fontWeight: 900, color: RED }}>{mins}:{secs}</div>
        <div style={{ ...BAR, fontSize: 12, color: W50 }}>CEO brief received — awaiting authorization</div>
      </div>

      {/* Executive Brief */}
      <div style={{ background: GBG, border: `1px solid ${GOLD}50`, padding: "28px 28px", marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.35em", color: GOLD, textTransform: "uppercase", marginBottom: 4 }}>Executive Authorization Brief · CONFIDENTIAL</div>
            <div style={{ ...BC, fontSize: 22, fontWeight: 900, color: W }}>Activist Investor — Elliott Management LP</div>
            <div style={{ ...BC, fontSize: 9, fontWeight: 600, color: W50, letterSpacing: "0.15em", marginTop: 3 }}>Prepared for: Marcus Chen, CEO · {COMPANY} · 2:47 AM EST</div>
          </div>
          <RiskBadge score={82} color={RED}/>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          {[
            { heading: "Situation", body: "Elliott Management LP has filed a Schedule 13D declaring an 8.2% ownership stake and issuing demands for 3 independent board seats and a full strategic review. A formal media statement was released at 2:47 AM. ISS proxy fight probability: 87%." },
            { heading: "Protocol Activated", body: "Readiness Protocol #47 — Activist Investor Defense. 14 tasks pre-staged. 6 stakeholders notified and acknowledged. Outside legal counsel (Sullivan & Cromwell) and financial advisor (Lazard) are pre-authorized and on standby." },
            { heading: "Immediate Actions (Minutes 1–6)", body: "Financial counter-brief in progress (Sarah Park). Poison pill review initiated (David Torres). Top-20 institutional shareholder list being mapped (Robert Kim). Board notification ready for your approval." },
            { heading: "Time to Full Activation", body: "Protocol activates fully in 12 minutes from trigger detection. Board call scheduled: 6:00 AM EST (3h 13min from now). Public statement will issue at T+8 min pending your authorization." },
          ].map(({ heading, body }, i) => (
            <div key={i} style={{ borderLeft: `2px solid ${GOLD}40`, paddingLeft: 16 }}>
              <div style={{ ...BC, fontSize: 10, fontWeight: 800, color: GOLD, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 6 }}>{heading}</div>
              <div style={{ ...BAR, fontSize: 12, color: W70, lineHeight: 1.6 }}>{body}</div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: `1px solid ${BD}`, paddingTop: 20 }}>
          <div style={{ ...BC, fontSize: 10, fontWeight: 800, color: W, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>CEO Decision Required</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              onClick={handleAuth}
              disabled={authorized}
              style={{
                ...BC, border: "none",
                background: authorized ? TEAL : GOLD,
                color: DARK, fontSize: 16, fontWeight: 900, letterSpacing: "0.14em",
                padding: "16px 36px", cursor: authorized ? "default" : "pointer",
                textTransform: "uppercase", transition: "background 0.4s",
                flex: "1 1 auto",
              }}
            >
              {authorized ? "✓ AUTHORIZED — ACTIVATING" : "AUTHORIZE ACTIVATION →"}
            </button>
            <button
              disabled={authorized}
              style={{
                ...BC, background: "transparent", border: `1px solid ${W25}`,
                color: W50, fontSize: 13, fontWeight: 600, letterSpacing: "0.1em",
                padding: "16px 24px", cursor: "default", flex: "0 0 auto",
              }}
            >
              Request Modification
            </button>
          </div>
          <div style={{ ...BAR, fontSize: 11, color: W50, marginTop: 10, lineHeight: 1.5 }}>
            Authorization is logged, timestamped, and attributed to your executive profile. All 14 tasks activate simultaneously upon confirmation. No decision rights transfer without your sign-off.
          </div>
        </div>
      </div>

      <div style={{ ...BC, fontSize: 9, color: W25, letterSpacing: "0.15em", textAlign: "center" }}>
        AI monitors · executives authorize · no protocol activates without sign-off
      </div>

      <div style={{ paddingTop: 24, borderTop: `1px solid ${BD}`, marginTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={onBack} style={{ ...BC, background: "transparent", border: `1px solid ${W25}`, color: W50, fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", padding: "10px 20px", cursor: "pointer" }}>
          ← Back
        </button>
        <span style={{ ...BC, fontSize: 9, fontWeight: 600, letterSpacing: "0.2em", color: W25 }}>STEP {phase + 1} OF {total}</span>
      </div>
    </div>
  );
}

/* ─── Phase 5: 12 Minutes Complete ──────────────────────────────────────────── */
function PhaseTimer({ onContinue, onBack, phase, total }: { onContinue: () => void; onBack: () => void; phase: number; total: number }) {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "52px 28px 40px" }}>
      <SectionLabel color={TEAL}>Step 5 — Activation Complete · T+12:00</SectionLabel>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ ...BC, fontSize: 80, fontWeight: 900, color: TEAL, lineHeight: 1, letterSpacing: "-0.04em", marginBottom: 8 }}>12:00</div>
        <div style={{ ...CG, fontSize: 28, fontStyle: "italic", color: GOLD, lineHeight: 1.3 }}>
          Meridian Consumer Group is fully activated.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 40 }}>
        {/* Readiness OS Column */}
        <div style={{ background: `${TEAL}08`, border: `1px solid ${TEAL}40`, padding: "28px 24px" }}>
          <div style={{ ...BC, fontSize: 10, fontWeight: 800, color: TEAL, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 20 }}>
            ◆ With Readiness OS
          </div>
          {[
            { time: "T+0:00",  event: "Elliott 13D detected — 4 signals scored in 22 seconds" },
            { time: "T+0:45",  event: "Protocol #47 staged — 14 tasks assigned, advisors on standby" },
            { time: "T+1:30",  event: "All 6 stakeholders notified and acknowledged" },
            { time: "T+3:22",  event: "CEO Marcus Chen authorizes — full activation begins" },
            { time: "T+5:00",  event: "Emergency board call scheduled: 6:00 AM EST" },
            { time: "T+6:00",  event: "Lazard engaged as financial advisor" },
            { time: "T+8:00",  event: "Controlled public statement issued" },
            { time: "T+10:00", event: "ISS briefing activated — proxy fight narrative underway" },
            { time: "T+11:30", event: "Board votes on official response posture" },
            { time: "T+12:00", event: "Full activation complete — strategic position defended" },
          ].map(({ time, event }, i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10, alignItems: "flex-start" }}>
              <span style={{ ...BC, fontSize: 10, fontWeight: 700, color: TEAL, width: 52, flexShrink: 0 }}>{time}</span>
              <span style={{ ...BAR, fontSize: 12, color: W70, lineHeight: 1.45 }}>{event}</span>
            </div>
          ))}
        </div>

        {/* Old Model Column */}
        <div style={{ background: `${RED}06`, border: `1px solid ${RED}30`, padding: "28px 24px" }}>
          <div style={{ ...BC, fontSize: 10, fontWeight: 800, color: RED, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 20 }}>
            ✕ Old Model — Fortune 1000 without Readiness OS
          </div>
          {OLD_MODEL.map(({ day, event }, i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-start" }}>
              <span style={{ ...BC, fontSize: 10, fontWeight: 700, color: RED, width: 64, flexShrink: 0 }}>{day}</span>
              <span style={{ ...BAR, fontSize: 12, color: W50, lineHeight: 1.45 }}>{event}</span>
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${RED}30`, marginTop: 12, paddingTop: 12 }}>
            <div style={{ ...BC, fontSize: 13, fontWeight: 800, color: RED }}>Elliott already has 6 institutional allies by the time you mobilize.</div>
          </div>
        </div>
      </div>

      {/* 3600x stat */}
      <div style={{ background: GBG, border: `1px solid ${GOLD}50`, padding: "32px 28px", textAlign: "center", marginBottom: 8 }}>
        <div style={{ ...BC, fontSize: 64, fontWeight: 900, color: GOLD, lineHeight: 1, letterSpacing: "-0.03em", marginBottom: 8 }}>3,600×</div>
        <div style={{ ...BC, fontSize: 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: W, marginBottom: 8 }}>
          Execution Head Start
        </div>
        <div style={{ ...BAR, fontSize: 14, color: W70, lineHeight: 1.6, maxWidth: 540, margin: "0 auto" }}>
          30 days compressed to 12 minutes. Not faster execution — earlier positioning. When your competitors are still assembling their war rooms, you've already set the institutional narrative, engaged advisors, and scheduled your board response.
        </div>
      </div>

      <NavButtons phase={phase} total={total} onContinue={onContinue} onBack={onBack} continueLabel="See the Outcome →"/>
    </div>
  );
}

/* ─── Phase 6: The Outcome ───────────────────────────────────────────────────── */
function PhaseOutcome({ onRestart }: { onRestart: () => void }) {
  return (
    <div style={{ maxWidth: 840, margin: "0 auto", padding: "52px 28px 60px" }}>
      <SectionLabel color={TEAL}>Step 6 — Activation Debrief & Outcome</SectionLabel>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ ...BC, fontSize: 13, fontWeight: 700, letterSpacing: "0.4em", color: TEAL, textTransform: "uppercase", marginBottom: 16 }}>Activation Status</div>
        <div style={{ ...BC, fontSize: 52, fontWeight: 900, color: TEAL, lineHeight: 1, letterSpacing: "-0.02em", marginBottom: 10 }}>CONTAINMENT COMPLETE</div>
        <div style={{ ...CG, fontSize: 26, fontStyle: "italic", color: GOLD, lineHeight: 1.3 }}>
          Meridian Consumer Group responded in 12 minutes.<br/>Elliott expected 30 days.
        </div>
      </div>

      {/* Outcome cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 32 }}>
        {[
          { label: "Tasks Completed",       value: "14 / 14", color: TEAL },
          { label: "Activation Time",       value: "12:00",   color: GOLD },
          { label: "Debrief Classification",value: "OPTIMIZATION", color: TEAL },
        ].map(({ label, value, color }, i) => (
          <div key={i} style={{ background: GBG, border: `1px solid ${BD}`, padding: "20px 18px", textAlign: "center" }}>
            <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: W50, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
            <div style={{ ...BC, fontSize: 22, fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Generated deliverables */}
      <div style={{ background: GBG, border: `1px solid ${BD}`, padding: "28px 28px", marginBottom: 24 }}>
        <div style={{ ...BC, fontSize: 10, fontWeight: 800, letterSpacing: "0.25em", color: GOLD, textTransform: "uppercase", marginBottom: 18 }}>
          Deliverables Generated at Activation
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[
            { label: "Board-Ready Activation Report",     sub: "Full timeline, task log, decision trail — board-formatted PDF" },
            { label: "CEO Authorization Record",          sub: "Timestamped, attributed, immutable audit entry" },
            { label: "Institutional Investor Map",        sub: "Top-20 holders, voting history, outreach priority ranking" },
            { label: "Public Statement — Approved Draft", sub: "CEO-reviewed, counsel-cleared, ready to issue at T+8min" },
            { label: "Board Call Agenda",                 sub: "6:00 AM EST — quorum confirmed, materials pre-distributed" },
            { label: "Post-Activation Debrief",           sub: "Classification: OPTIMIZATION — no gaps, no missed signals" },
          ].map(({ label, sub }, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ color: TEAL, fontSize: 10, flexShrink: 0, marginTop: 3 }}>◆</span>
              <div>
                <div style={{ ...BC, fontSize: 13, fontWeight: 700, color: W, letterSpacing: "0.03em", marginBottom: 2 }}>{label}</div>
                <div style={{ ...BAR, fontSize: 11, color: W50, lineHeight: 1.4 }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What the debrief shows */}
      <div style={{ background: `${TEAL}08`, border: `1px solid ${TEAL}35`, padding: "24px 28px", marginBottom: 32 }}>
        <div style={{ ...BC, fontSize: 10, fontWeight: 800, letterSpacing: "0.25em", color: TEAL, textTransform: "uppercase", marginBottom: 14 }}>
          Post-Activation Intelligence — What the Platform Learned
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            "Signal detection to authorization: 3 minutes 22 seconds — 14% faster than protocol benchmark.",
            "All 6 stakeholder acknowledgments received within 2 minutes of notification.",
            "ISS briefing slot availability confirmed: pre-scheduled relationship activation worked as designed.",
            "Protocol #47 performed with zero deviations. No ad-hoc decisions required.",
            "Recommendation: Expand Protocol #47 to include sovereign wealth fund monitoring — add trigger pattern #222.",
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ color: TEAL, fontSize: 9, flexShrink: 0, marginTop: 3 }}>→</span>
              <span style={{ ...BAR, fontSize: 13, color: W70, lineHeight: 1.55 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* The IDEA arc */}
      <div style={{ textAlign: "center", marginBottom: 40, padding: "36px 28px", borderTop: `1px solid ${BD}`, borderBottom: `1px solid ${BD}` }}>
        <div style={{ ...CG, fontSize: 26, fontStyle: "italic", color: W, lineHeight: 1.4, marginBottom: 10 }}>
          "The response is ready before the trigger fires."
        </div>
        <div style={{ ...BC, fontSize: 12, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: W50 }}>
          Preparation &nbsp;→&nbsp; Readiness &nbsp;→&nbsp; Fearless
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: GBG, border: `1px solid ${GOLD}50`, padding: "36px 32px" }}>
        <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.4em", color: GOLD, textTransform: "uppercase", marginBottom: 16 }}>
          Founding Partner Program — Now Forming
        </div>
        <h2 style={{ ...BC, fontSize: 30, fontWeight: 900, color: W, lineHeight: 1.1, marginBottom: 12, letterSpacing: "-0.01em" }}>
          Every organization that prepares for every situation it'll face is no longer afraid of strategic triggers.<br/>
          <span style={{ color: GOLD }}>It's fearless.</span>
        </h2>
        <p style={{ ...BAR, fontSize: 14, color: W70, lineHeight: 1.65, maxWidth: 560, marginBottom: 28 }}>
          The Founding Partner Program is a 90-day validation partnership with Fortune 1000 enterprises. Selective by design. The first cohort is forming now. This simulation is the product — the only difference in a live deployment is that the protocols carry your organization's name, your stakeholders, and your pre-approved advisors.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a
            href="/contact"
            style={{ ...BC, background: GOLD, border: "none", color: DARK, fontSize: 15, fontWeight: 900, letterSpacing: "0.12em", padding: "16px 36px", textDecoration: "none", textTransform: "uppercase", display: "inline-block" }}
          >
            Apply for Founding Partner Access →
          </a>
          <button
            onClick={onRestart}
            style={{ ...BC, background: "transparent", border: `1px solid ${W25}`, color: W70, fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", padding: "16px 24px", cursor: "pointer", textTransform: "uppercase" }}
          >
            ↺ Run Again
          </button>
        </div>
        <div style={{ ...BAR, fontSize: 11, color: W50, marginTop: 14, lineHeight: 1.5 }}>
          VaughnMartin · Readiness OS™ · The readiness infrastructure for the Fortune 1000.
        </div>
      </div>
    </div>
  );
}

/* ─── Progress bar ───────────────────────────────────────────────────────────── */
function ProgressBar({ phase, total }: { phase: number; total: number }) {
  const labels = ["Trigger", "Signals", "Protocol", "War Room", "Authorize", "12 Minutes", "Outcome"];
  return (
    <div style={{ background: DARK2, borderBottom: `1px solid ${BD}`, padding: "0 16px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "stretch", gap: 0 }}>
        {labels.map((label, i) => {
          const active   = i === phase;
          const complete = i < phase;
          return (
            <div key={i} style={{ flex: 1, padding: "12px 6px 10px", textAlign: "center", position: "relative", borderBottom: active ? `2px solid ${GOLD}` : complete ? `2px solid ${TEAL}` : "2px solid transparent" }}>
              <div style={{ ...BC, fontSize: 7.5, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: active ? GOLD : complete ? TEAL : W25, lineHeight: 1.4 }}>
                {complete ? "✓ " : ""}{label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Main export ────────────────────────────────────────────────────────────── */
export default function MasterDemo() {
  const [phase, setPhase] = useState(0);
  const TOTAL = 7;
  const advance = () => setPhase(p => Math.min(p + 1, TOTAL - 1));
  const back    = () => setPhase(p => Math.max(p - 1, 0));

  useEffect(() => { window.scrollTo(0, 0); }, [phase]);

  return (
    <div style={{ background: DARK, minHeight: "100vh", color: W }}>
      {/* Header */}
      <div style={{ background: NAVY, borderBottom: `1px solid ${BD}`, padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", border: `1.5px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ ...BC, fontSize: 10, fontWeight: 800, color: GOLD }}>VM</span>
          </div>
          <div>
            <div style={{ ...BC, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: W }}>VaughnMartin</div>
            <div style={{ ...BC, fontSize: 8, fontWeight: 600, letterSpacing: "0.3em", color: GOLD, textTransform: "uppercase" }}>Readiness OS™</div>
          </div>
        </div>
        <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.28em", color: W50, textTransform: "uppercase" }}>
          Full Platform Walkthrough · Activist Investor Scenario
        </div>
        <a href="/" style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: GOLD, textDecoration: "none", border: `1px solid ${GOLD}40`, padding: "6px 14px" }}>
          Back to Platform
        </a>
      </div>

      <ProgressBar phase={phase} total={TOTAL}/>

      {/* Phase router */}
      {phase === 0 && <PhaseTrigger onContinue={advance}/>}
      {phase === 1 && <PhaseSignals onContinue={advance} onBack={back} phase={phase} total={TOTAL}/>}
      {phase === 2 && <PhaseProtocol onContinue={advance} onBack={back} phase={phase} total={TOTAL}/>}
      {phase === 3 && <PhaseWarRoom onContinue={advance} onBack={back} phase={phase} total={TOTAL}/>}
      {phase === 4 && <PhaseAuthorize onAuthorize={advance} onBack={back} phase={phase} total={TOTAL}/>}
      {phase === 5 && <PhaseTimer onContinue={advance} onBack={back} phase={phase} total={TOTAL}/>}
      {phase === 6 && <PhaseOutcome onRestart={() => setPhase(0)}/>}
    </div>
  );
}
