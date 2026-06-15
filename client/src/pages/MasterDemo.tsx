import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "wouter";
import { SCENARIOS, type DemoScenario } from "./demos/scenarioData";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";
import ConsequencePreview from "@/components/ConsequencePreview";
import type { ConsequenceChoice } from "@/components/ConsequencePreview";

/* ─── Brand ───────────────────────────────────────────────────────────────── */
const NAVY    = "#0A0F2E";
const NAVY_BG = "#132558";
const GOLD    = "#C9A84C";
const TEAL    = "#2B8A6E";
const TEAL_LT = "#3BAF8A";
const RED   = "#e05252";
const AMB   = "#e09040";
const W     = "#ffffff";
const W90   = "rgba(255,255,255,0.90)";
const W70   = "rgba(255,255,255,0.70)";
const W50   = "rgba(255,255,255,0.50)";
const W25   = "rgba(255,255,255,0.25)";
const W10   = "rgba(255,255,255,0.10)";
const BD    = "rgba(201,168,76,0.22)";
const GBG   = "rgba(201,168,76,0.06)";
const BC    = { fontFamily: "'Barlow Condensed','Arial Narrow',sans-serif" } as const;
const CG    = { fontFamily: "'Cormorant Garamond',Georgia,serif" } as const;
const BAR   = { fontFamily: "'Barlow',sans-serif" } as const;
const MONO  = { fontFamily: "'Courier New',monospace" } as const;

/* ─── Animation hooks ─────────────────────────────────────────────────────── */
function useCountUp(target: number, durationMs: number, active: boolean): number {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = Date.now();
    const t = setInterval(() => {
      const p = Math.min((Date.now() - start) / durationMs, 1);
      setVal(Math.round(target * p));
      if (p >= 1) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [active, target, durationMs]);
  return val;
}

function useSimClock(totalSim: number, realMs: number, active: boolean) {
  const [simSec, setSimSec] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!active) return;
    const start = Date.now();
    const t = setInterval(() => {
      const sim = Math.min(Math.round(((Date.now() - start) / realMs) * totalSim), totalSim);
      setSimSec(sim);
      if (sim >= totalSim) { setDone(true); clearInterval(t); }
    }, 50);
    return () => clearInterval(t);
  }, [active, totalSim, realMs]);
  return { simSec, done };
}

function useSequential(count: number, intervalMs: number, active: boolean): number {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setN(v => v < count ? v + 1 : v), intervalMs);
    return () => clearInterval(t);
  }, [active, count, intervalMs]);
  return n;
}

/* ─── Reusable components ─────────────────────────────────────────────────── */
function SLabel({ children, color = GOLD }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
      <span style={{ display: "inline-block", width: 28, height: 1.5, background: color, flexShrink: 0 }}/>
      <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase", color }}>{children}</span>
    </div>
  );
}

function SeverityColor(s: DemoScenario["signals"][0]["severity"]) {
  return s === "critical" ? RED : s === "high" ? AMB : GOLD;
}

function CatColor(cat: string) {
  const m: Record<string,string> = {
    "AUTHORITY": GOLD, "LEGAL": AMB, "GOVERNANCE": GOLD,
    "FINANCE": TEAL_LT, "COMMS": AMB, "SECURITY": RED,
    "OPERATIONS": TEAL_LT, "REGULATORY": AMB, "MEDICAL": TEAL,
    "SUPPLY CHAIN": TEAL_LT, "INVESTOR REL.": GOLD,
  };
  return m[cat] || TEAL;
}

function LiveDot({ color = RED }: { color?: string }) {
  const [on, setOn] = useState(true);
  useEffect(() => { const t = setInterval(() => setOn(v => !v), 600); return () => clearInterval(t); }, []);
  return <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: color, opacity: on ? 1 : 0.2, transition: "opacity 0.3s", flexShrink: 0 }}/>;
}

function NavBar({ phase, total, onNext, onBack, nextLabel = "Continue →", disabled = false }:
  { phase: number; total: number; onNext: () => void; onBack: () => void; nextLabel?: string; disabled?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 36, paddingTop: 24, borderTop: `1px solid ${BD}` }}>
      {phase > 0
        ? <button onClick={onBack} style={{ ...BC, background: "transparent", border: `1px solid ${W25}`, color: W50, fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", padding: "10px 20px", cursor: "pointer" }}>← Back</button>
        : <div/>}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ ...BC, fontSize: 9, fontWeight: 600, letterSpacing: "0.2em", color: W25 }}>STEP {phase + 1} OF {total}</span>
        {phase < total - 1 && (
          <button onClick={onNext} disabled={disabled} style={{
            ...BC, background: disabled ? W10 : GOLD, border: "none",
            color: disabled ? W25 : NAVY, fontSize: 14, fontWeight: 800,
            letterSpacing: "0.1em", padding: "12px 28px", cursor: disabled ? "not-allowed" : "pointer", textTransform: "uppercase",
          }}>{nextLabel}</button>
        )}
      </div>
    </div>
  );
}

/* ─── Phase 0: The Trigger ────────────────────────────────────────────────── */
function PhaseTrigger({ sc, onNext }: { sc: DemoScenario; onNext: () => void }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 150); }, []);
  const sevColor = sc.riskScore >= 90 ? RED : sc.riskScore >= 75 ? AMB : GOLD;
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "60px 28px 40px", opacity: vis ? 1 : 0, transition: "opacity 0.6s" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
        <LiveDot color={sevColor}/>
        <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.45em", color: sevColor, textTransform: "uppercase" }}>Live Simulation — Real Scenario · Real Product Delivery</span>
      </div>

      <div style={{ ...BC, fontSize: 62, fontWeight: 900, color: W, lineHeight: 1.0, letterSpacing: "-0.02em", marginBottom: 10 }}>
        {sc.triggerTime.split(" ")[0]}
      </div>
      <div style={{ ...CG, fontSize: 34, fontStyle: "italic", color: GOLD, lineHeight: 1.2, marginBottom: 28 }}>
        A strategic trigger just fired.
      </div>

      {/* Trigger alert */}
      <div style={{ background: `${sevColor}10`, border: `1px solid ${sevColor}50`, padding: "20px 24px", marginBottom: 24, display: "flex", gap: 16, alignItems: "flex-start" }}>
        <div style={{ flexShrink: 0, marginTop: 2 }}>
          <LiveDot color={sevColor}/>
        </div>
        <div>
          <div style={{ ...MONO, fontSize: 9, fontWeight: 700, color: sevColor, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>
            {sc.triggerTime} · {sc.company} ({sc.ticker})
          </div>
          <div style={{ ...BC, fontSize: 18, fontWeight: 800, color: W, letterSpacing: "0.02em", lineHeight: 1.3, marginBottom: 6 }}>
            {sc.triggerHeadline}
          </div>
          <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.25em", color: `${sevColor}`, background: `${sevColor}18`, border: `1px solid ${sevColor}40`, display: "inline-block", padding: "3px 10px", marginBottom: 8 }}>
            RISK {sc.riskScore}/100 — {sc.riskScore >= 90 ? "CRITICAL" : sc.riskScore >= 75 ? "HIGH" : "ELEVATED"}
          </div>
        </div>
      </div>

      <p style={{ ...BAR, fontSize: 15, color: W70, lineHeight: 1.7, marginBottom: 32 }}>{sc.triggerContext}</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32 }}>
        {[
          { label: "Company",             value: sc.company,          sub: `${sc.ticker} · ${sc.industry}` },
          { label: "Threat Classification", value: sc.category,       sub: `Readiness Protocol #${sc.protocolNumber}` },
          { label: "Primary Audience",    value: sc.audience,         sub: "Roles activated in this protocol" },
          { label: "Without Readiness OS", value: "30-Day Mobilization", sub: sc.oldModelCost },
        ].map(({ label, value, sub }, i) => (
          <div key={i} style={{ background: GBG, border: `1px solid ${BD}`, padding: "20px 22px" }}>
            <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.25em", color: GOLD, textTransform: "uppercase", marginBottom: 5 }}>{label}</div>
            <div style={{ ...BC, fontSize: 16, fontWeight: 800, color: W, lineHeight: 1.2, marginBottom: 3 }}>{value}</div>
            <div style={{ ...BAR, fontSize: 11, color: W50, lineHeight: 1.4 }}>{sub}</div>
          </div>
        ))}
      </div>

      <div style={{ background: `${TEAL}0a`, border: `1px solid ${TEAL}35`, padding: "20px 24px", marginBottom: 36 }}>
        <div style={{ ...CG, fontSize: 20, fontStyle: "italic", color: TEAL, lineHeight: 1.4, marginBottom: 6 }}>
          "The response is ready before the trigger fires."
        </div>
        <div style={{ ...BAR, fontSize: 13, color: W50 }}>
          Protocol #{sc.protocolNumber} was pre-staged. The advisors are pre-authorized. The tasks are assigned. Your job: authorize.
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <button onClick={onNext} style={{ ...BC, background: GOLD, border: "none", color: NAVY, fontSize: 16, fontWeight: 800, letterSpacing: "0.14em", padding: "18px 52px", cursor: "pointer", textTransform: "uppercase" }}>
          Watch the Response Activate →
        </button>
        <div style={{ ...BC, fontSize: 9, color: W25, letterSpacing: "0.2em", marginTop: 12, textTransform: "uppercase" }}>
          7-step guided simulation · Approx. 10 minutes to complete
        </div>
      </div>
    </div>
  );
}

/* ─── Phase 1: Signals Detected ───────────────────────────────────────────── */
function PhaseSignals({ sc, phase, total, onNext, onBack }: { sc: DemoScenario; phase: number; total: number; onNext: () => void; onBack: () => void }) {
  const revealed = useSequential(sc.signals.length, 1400, true);
  const allRevealed = revealed >= sc.signals.length;
  const riskVal = useCountUp(sc.riskScore, 2200, allRevealed);

  return (
    <div style={{ maxWidth: 840, margin: "0 auto", padding: "52px 28px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <LiveDot color={RED}/>
        <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.4em", color: RED, textTransform: "uppercase" }}>Live Signal Detection · T+0:00 → T+0:{sc.signals.length > 3 ? "22" : "15"}</span>
      </div>
      <h1 style={{ ...CG, fontSize: 46, fontWeight: 600, color: W, lineHeight: 1.05, letterSpacing: "-0.01em", marginBottom: 6 }}>
        {sc.signals.length} signals detected.<br/><em style={{ color: GOLD }}>Risk scored in seconds.</em>
      </h1>
      <p style={{ ...BAR, fontSize: 14, color: W70, lineHeight: 1.65, maxWidth: 620, marginBottom: 32 }}>
        Readiness OS continuously monitors 231 strategic trigger patterns across regulatory feeds, newswires, financial intelligence, and social signals. The moment the trigger filed, {sc.signals.length} corroborating signals were detected and scored simultaneously.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
        {sc.signals.map((s, i) => {
          const col = SeverityColor(s.severity);
          const visible = i < revealed;
          return (
            <div key={i} style={{ background: GBG, border: `1px solid ${visible ? col + "50" : BD}`, padding: "18px 20px", display: "flex", gap: 16, alignItems: "flex-start", opacity: visible ? 1 : 0.06, transition: "opacity 0.5s, border-color 0.5s" }}>
              <div style={{ flexShrink: 0, width: 36 }}>
                <div style={{ ...BC, fontSize: 10, fontWeight: 800, color: col, letterSpacing: "0.1em" }}>S.{String(i+1).padStart(2,"0")}</div>
                <div style={{ ...MONO, fontSize: 7, color: W25, marginTop: 3 }}>{s.time}</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 5 }}>
                  <div>
                    <div style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.25em", color: col, textTransform: "uppercase", marginBottom: 3 }}>{s.source}</div>
                    <div style={{ ...BC, fontSize: 15, fontWeight: 800, color: W, letterSpacing: "0.02em" }}>{s.headline}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: col, letterSpacing: "0.15em", background: `${col}15`, border: `1px solid ${col}40`, padding: "3px 10px", marginBottom: 4 }}>
                      {s.severity.toUpperCase()} · {s.score}
                    </div>
                    {/* Score bar */}
                    <div style={{ width: 80, height: 3, background: W10, borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ width: visible ? `${s.score}%` : "0%", height: "100%", background: col, transition: "width 1s 0.3s" }}/>
                    </div>
                  </div>
                </div>
                <div style={{ ...BAR, fontSize: 12, color: W70, lineHeight: 1.55 }}>{s.detail}</div>
              </div>
            </div>
          );
        })}
      </div>

      {allRevealed && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 8 }}>
          <div style={{ background: `${RED}0d`, border: `1px solid ${RED}40`, padding: "20px 18px" }}>
            <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: RED, textTransform: "uppercase", marginBottom: 6 }}>Composite Risk Score</div>
            <div style={{ ...BC, fontSize: 34, fontWeight: 900, color: RED, lineHeight: 1, marginBottom: 5 }}>{riskVal}<span style={{ fontSize: 16 }}>/100</span></div>
            <div style={{ width: "100%", height: 4, background: W10, borderRadius: 2, overflow: "hidden", marginBottom: 6 }}>
              <div style={{ width: `${riskVal}%`, height: "100%", background: RED, transition: "width 0.1s" }}/>
            </div>
            <div style={{ ...BAR, fontSize: 11, color: W50 }}>{riskVal >= 90 ? "CRITICAL" : riskVal >= 75 ? "HIGH" : "ELEVATED"} — threshold exceeded</div>
          </div>
          <div style={{ background: `${GOLD}0d`, border: `1px solid ${GOLD}40`, padding: "20px 18px" }}>
            <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: GOLD, textTransform: "uppercase", marginBottom: 6 }}>Detection Speed</div>
            <div style={{ ...BC, fontSize: 34, fontWeight: 900, color: GOLD, lineHeight: 1, marginBottom: 5 }}>22<span style={{ fontSize: 16 }}> sec</span></div>
            <div style={{ ...BAR, fontSize: 11, color: W50, marginTop: 11 }}>All {sc.signals.length} signals correlated & scored</div>
          </div>
          <div style={{ background: `${TEAL}0d`, border: `1px solid ${TEAL}40`, padding: "20px 18px" }}>
            <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: TEAL, textTransform: "uppercase", marginBottom: 6 }}>Protocol Match</div>
            <div style={{ ...BC, fontSize: 22, fontWeight: 900, color: TEAL, lineHeight: 1, marginBottom: 5 }}>#{sc.protocolNumber}<br/><span style={{ fontSize: 13 }}>CONFIRMED</span></div>
            <div style={{ ...BAR, fontSize: 11, color: W50 }}>{sc.protocolName}</div>
          </div>
        </div>
      )}

      <NavBar phase={phase} total={total} onNext={onNext} onBack={onBack} nextLabel="See the Protocol →" disabled={!allRevealed}/>
    </div>
  );
}

/* ─── Phase 2: Protocol Matched ──────────────────────────────────────────── */
function PhaseProtocol({ sc, phase, total, onNext, onBack }: { sc: DemoScenario; phase: number; total: number; onNext: () => void; onBack: () => void }) {
  const SCAN = ["#12 Supply Chain Collapse","#31 Critical Supplier Failure","#67 Food Safety Crisis","#23 Ransomware Response","#44 Data Breach Response","#93 M&A Defense","#122 Regulatory Action","#78 DOJ Investigation","#89 Product Recall","#112 Grid Failure","#47 Activist Investor Defense","#156 Trade Disruption"];
  const [scanIdx, setScanIdx] = useState(0);
  const [phase2, setPhase2] = useState<"scanning"|"locked">("scanning");
  useEffect(() => {
    let count = 0;
    const t = setInterval(() => {
      setScanIdx(i => (i + 1) % SCAN.length);
      count++;
      if (count >= 26) { clearInterval(t); setPhase2("locked"); }
    }, 90);
    return () => clearInterval(t);
  }, []);
  const locked = phase2 === "locked";

  return (
    <div style={{ maxWidth: 840, margin: "0 auto", padding: "52px 28px 40px" }}>
      <SLabel color={GOLD}>Step 2 — Protocol Match · T+0:45</SLabel>
      <h2 style={{ ...CG, fontSize: 46, fontWeight: 600, color: W, lineHeight: 1.05, letterSpacing: "-0.01em", marginBottom: 6 }}>
        {locked ? <>Protocol #{sc.protocolNumber} confirmed.<br/><em style={{ color: GOLD }}>Already staged. Already ready.</em></> : <>Scanning 180 Readiness Protocols…</>}
      </h2>
      <p style={{ ...BAR, fontSize: 14, color: W70, lineHeight: 1.65, maxWidth: 620, marginBottom: 28 }}>
        {locked ? `Readiness OS matched the signal composite to Protocol #${sc.protocolNumber}. This protocol was not written in response to the trigger — it was written months ago, tested in Q3 drills, and waiting for this exact moment.` : "Readiness OS is correlating the signal composite against all 180 Readiness Protocols to find the strongest match."}
      </p>

      {/* Scan animation */}
      <div style={{ background: NAVY_BG, border: `1px solid ${locked ? GOLD + "60" : BD}`, padding: "28px 24px", marginBottom: 24, transition: "border-color 0.5s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <LiveDot color={locked ? TEAL : GOLD}/>
          <span style={{ ...MONO, fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", color: locked ? TEAL : GOLD, textTransform: "uppercase" }}>
            {locked ? `MATCH CONFIRMED — Protocol #${sc.protocolNumber}` : "SCANNING READINESS LIBRARY · 180 PROTOCOLS"}
          </span>
        </div>

        {!locked ? (
          <div style={{ ...BC, fontSize: 22, fontWeight: 800, color: W50, letterSpacing: "0.04em", minHeight: 34 }}>
            {SCAN[scanIdx]}
          </div>
        ) : (
          <div>
            <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: sc.riskScore >= 90 ? RED : AMB, textTransform: "uppercase", marginBottom: 8 }}>
              {sc.category} · Risk {sc.riskScore}/100 — {sc.riskScore >= 90 ? "CRITICAL" : "HIGH"}
            </div>
            <div style={{ ...BC, fontSize: 30, fontWeight: 900, color: GOLD, lineHeight: 1.1, marginBottom: 8 }}>
              #{sc.protocolNumber} — {sc.protocolName}
            </div>
            <div style={{ ...BAR, fontSize: 14, color: W70, lineHeight: 1.6, maxWidth: 560, marginBottom: 20 }}>
              {sc.protocolName} — Pre-staged response covering all {sc.tasks.length} critical execution tasks across {sc.stakeholders.length} role-specific stakeholders. All pre-authorized resources on standby.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0, borderTop: `1px solid ${BD}`, paddingTop: 20 }}>
              {[
                { val: String(sc.tasks.length), label: "Tasks Staged" },
                { val: String(sc.stakeholders.length), label: "Stakeholders" },
                { val: "12 min", label: "Est. Activation" },
                { val: "Q3 Drill", label: "Last Tested" },
              ].map(({ val, label }, i) => (
                <div key={i} style={{ borderRight: i < 3 ? `1px solid ${BD}` : "none", paddingRight: 16, paddingLeft: i > 0 ? 16 : 0 }}>
                  <div style={{ ...BC, fontSize: 26, fontWeight: 900, color: GOLD, lineHeight: 1, marginBottom: 4 }}>{val}</div>
                  <div style={{ ...BC, fontSize: 9, fontWeight: 600, color: W50, letterSpacing: "0.18em", textTransform: "uppercase" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {locked && (
        <div style={{ background: GBG, border: `1px solid ${BD}`, padding: "22px 24px", marginBottom: 8 }}>
          <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.25em", color: GOLD, textTransform: "uppercase", marginBottom: 14 }}>Pre-Authorized Resources — Activated on Trigger</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {sc.preAuthorized.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: TEAL, fontSize: 9, flexShrink: 0, marginTop: 3 }}>◆</span>
                <span style={{ ...BAR, fontSize: 12, color: W70, lineHeight: 1.45 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <NavBar phase={phase} total={total} onNext={onNext} onBack={onBack} nextLabel="Open the War Room →" disabled={!locked}/>
    </div>
  );
}

/* ─── Phase 3: War Room ───────────────────────────────────────────────────── */
const STAKEHOLDER_STATUSES = ["STANDBY", "NOTIFYING", "SENT", "DELIVERED", "ACKNOWLEDGED"] as const;

function PhaseWarRoom({ sc, phase, total, onNext, onBack }: { sc: DemoScenario; phase: number; total: number; onNext: () => void; onBack: () => void }) {
  const [tab, setTab] = useState<"tasks"|"stakeholders">("tasks");
  const taskCount = useSequential(sc.tasks.length, 380, true);
  const [stStatuses, setStStatuses] = useState<number[]>(sc.stakeholders.map(() => 0));

  useEffect(() => {
    sc.stakeholders.forEach((_, i) => {
      const baseDelay = i * 400;
      STAKEHOLDER_STATUSES.forEach((_, si) => {
        if (si === 0) return;
        setTimeout(() => setStStatuses(prev => { const n = [...prev]; n[i] = si; return n; }), baseDelay + si * 650);
      });
    });
  }, []);

  const allDone = taskCount >= sc.tasks.length && stStatuses.every(s => s >= 4);

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "52px 28px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <LiveDot color={TEAL}/>
        <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.4em", color: TEAL, textTransform: "uppercase" }}>War Room Active · T+0:45 → T+1:30</span>
      </div>
      <h2 style={{ ...CG, fontSize: 44, fontWeight: 600, color: W, lineHeight: 1.05, letterSpacing: "-0.01em", marginBottom: 6 }}>
        {sc.tasks.length} tasks staging. {sc.stakeholders.length} stakeholders activating.<br/>
        <em style={{ color: TEAL_LT }}>45 seconds from trigger detection.</em>
      </h2>
      <p style={{ ...BAR, fontSize: 14, color: W70, lineHeight: 1.65, maxWidth: 640, marginBottom: 28 }}>
        The war room doesn't assemble — it activates. Every task has a pre-assigned owner. Every stakeholder receives a precise brief. No one wonders what they should be doing.
      </p>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: `1px solid ${BD}` }}>
        {(["tasks","stakeholders"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ ...BC, background: "transparent", border: "none", borderBottom: tab === t ? `2px solid ${GOLD}` : "2px solid transparent", color: tab === t ? GOLD : W50, fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", padding: "12px 20px", cursor: "pointer", marginBottom: -1 }}>
            {t === "tasks" ? `${taskCount} / ${sc.tasks.length} Tasks` : `${stStatuses.filter(s => s >= 4).length} / ${sc.stakeholders.length} Acknowledged`}
          </button>
        ))}
      </div>

      {tab === "tasks" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 24 }}>
          {sc.tasks.map((t, i) => {
            const visible = i < taskCount;
            const color = CatColor(t.category);
            return (
              <div key={t.id} style={{ background: GBG, border: `1px solid rgba(255,255,255,0.07)`, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", opacity: visible ? 1 : 0.08, transition: "opacity 0.4s" }}>
                <span style={{ ...BC, fontSize: 10, fontWeight: 800, color: W25, width: 24, flexShrink: 0 }}>#{t.id}</span>
                <span style={{ ...BC, fontSize: 9, fontWeight: 700, color: W25, width: 60, flexShrink: 0, letterSpacing: "0.1em" }}>{t.timing}</span>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <div style={{ ...BC, fontSize: 13, fontWeight: 700, color: W, letterSpacing: "0.02em", marginBottom: 1 }}>{t.task}</div>
                  <div style={{ ...BAR, fontSize: 11, color: W50 }}>{t.owner} — {t.name}</div>
                </div>
                <span style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.18em", color, opacity: 0.85 }}>{t.category}</span>
                {visible && <span style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", color: TEAL, background: `${TEAL}12`, border: `1px solid ${TEAL}30`, padding: "2px 8px" }}>STAGED</span>}
              </div>
            );
          })}
        </div>
      )}

      {tab === "stakeholders" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
          {sc.stakeholders.map((s, i) => {
            const status = STAKEHOLDER_STATUSES[stStatuses[i]];
            const isDone = stStatuses[i] >= 4;
            const statusColor = isDone ? TEAL : stStatuses[i] >= 2 ? GOLD : W50;
            return (
              <div key={i} style={{ background: GBG, border: `1px solid ${isDone ? TEAL + "40" : BD}`, padding: "18px 20px", display: "flex", alignItems: "flex-start", gap: 14, transition: "border-color 0.5s" }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", border: `1.5px solid ${isDone ? TEAL : GOLD}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "border-color 0.5s" }}>
                  <span style={{ ...BC, fontSize: 12, fontWeight: 800, color: isDone ? TEAL : GOLD }}>{s.initials}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ ...BC, fontSize: 15, fontWeight: 800, color: W, marginBottom: 1 }}>{s.name}</div>
                  <div style={{ ...BAR, fontSize: 11, color: W50, marginBottom: 10, lineHeight: 1.4 }}>{s.title}</div>
                  <div style={{ display: "flex", gap: 0, alignItems: "center" }}>
                    {STAKEHOLDER_STATUSES.map((st, si) => (
                      <div key={si} style={{ display: "flex", alignItems: "center", gap: 0 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: stStatuses[i] >= si ? (si >= 4 ? TEAL : GOLD) : W10, transition: "background 0.3s" }}/>
                        {si < 4 && <div style={{ width: 14, height: 1, background: stStatuses[i] > si ? GOLD + "60" : W10, transition: "background 0.3s" }}/>}
                      </div>
                    ))}
                    <span style={{ ...BC, fontSize: 9, fontWeight: 700, color: statusColor, letterSpacing: "0.15em", marginLeft: 10 }}>{status}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ background: `rgba(255,255,255,0.02)`, border: `1px solid ${BD}`, padding: "16px 22px", marginBottom: 8 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {[
            { label: "Tasks Staged",          value: `${taskCount} / ${sc.tasks.length}`, color: TEAL },
            { label: "Stakeholders Acknowledged", value: `${stStatuses.filter(s => s >= 4).length} / ${sc.stakeholders.length}`, color: TEAL },
            { label: "Time Elapsed",          value: "1m 30s", color: GOLD },
          ].map(({ label, value, color }, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ ...BC, fontSize: 24, fontWeight: 900, color, lineHeight: 1, marginBottom: 4 }}>{value}</div>
              <div style={{ ...BC, fontSize: 9, fontWeight: 600, letterSpacing: "0.18em", color: W50, textTransform: "uppercase" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <NavBar phase={phase} total={total} onNext={onNext} onBack={onBack} nextLabel="CEO Authorizes →" disabled={!allDone}/>
    </div>
  );
}

/* ─── Phase 4: Executive Authorization ───────────────────────────────────── */
function PhaseAuthorize({ sc, phase, total, onAuthorize, onBack }: { sc: DemoScenario; phase: number; total: number; onAuthorize: () => void; onBack: () => void }) {
  const [authorized, setAuthorized] = useState(false);
  const [choiceMade, setChoiceMade] = useState<ConsequenceChoice | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ceo = sc.stakeholders[0];

  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed(t => t + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const handleAuth = (choice: ConsequenceChoice) => {
    setChoiceMade(choice);
    setAuthorized(true);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeout(onAuthorize, 2400);
  };

  const mm = Math.floor(elapsed / 60);
  const ss = String(elapsed % 60).padStart(2, "0");
  const sevColor = sc.riskScore >= 90 ? RED : AMB;

  return (
    <div style={{ maxWidth: 840, margin: "0 auto", padding: "52px 28px 40px" }}>
      <SLabel color={GOLD}>Step 4 — Executive Authorization · T+3:22</SLabel>
      <h2 style={{ ...CG, fontSize: 44, fontWeight: 600, color: W, lineHeight: 1.05, letterSpacing: "-0.01em", marginBottom: 6 }}>
        {ceo.name} receives the brief.<br/><em style={{ color: GOLD }}>One decision. Full authority.</em>
      </h2>
      <p style={{ ...BAR, fontSize: 14, color: W70, lineHeight: 1.65, maxWidth: 620, marginBottom: 24 }}>
        No committee. No alignment cycle. The executive brief summarizes every element already staged. Every resource pre-authorized. Every question already answered. The only decision remaining: authorize or hold.
      </p>

      {/* Live clock */}
      <div style={{ background: `${sevColor}0d`, border: `1px solid ${sevColor}40`, padding: "12px 20px", display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
        <LiveDot color={authorized ? TEAL : sevColor}/>
        <div style={{ ...MONO, fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", color: authorized ? TEAL : sevColor, textTransform: "uppercase" }}>
          {authorized ? "AUTHORIZED · ACTIVATING ALL TASKS" : "MISSION CLOCK"}
        </div>
        {!authorized && <div style={{ ...BC, fontSize: 24, fontWeight: 900, color: sevColor }}>{mm}:{ss}</div>}
        {!authorized && <div style={{ ...BAR, fontSize: 12, color: W50 }}>{ceo.name} brief received · awaiting authorization</div>}
        {authorized && <div style={{ ...BC, fontSize: 14, fontWeight: 800, color: TEAL, letterSpacing: "0.1em" }}>✓ AUTHORIZED BY {ceo.name.toUpperCase()} · {ceo.title.toUpperCase()}</div>}
      </div>

      {/* Executive Brief */}
      <div style={{ background: GBG, border: `1px solid ${GOLD}60`, padding: "28px 28px", marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 22, paddingBottom: 18, borderBottom: `1px solid ${BD}` }}>
          <div>
            <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.35em", color: GOLD, textTransform: "uppercase", marginBottom: 4 }}>Executive Authorization Brief · CONFIDENTIAL</div>
            <div style={{ ...BC, fontSize: 20, fontWeight: 900, color: W }}>{sc.name}</div>
            <div style={{ ...BC, fontSize: 9, fontWeight: 600, color: W50, letterSpacing: "0.12em", marginTop: 3 }}>For: {ceo.name}, {ceo.title} · {sc.company} · {sc.triggerTime}</div>
          </div>
          <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: sevColor, background: `${sevColor}15`, border: `1px solid ${sevColor}50`, padding: "5px 12px" }}>
            RISK {sc.riskScore}/100 — {sc.riskScore >= 90 ? "CRITICAL" : "HIGH"}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 22 }}>
          {[
            { heading: "Situation", body: sc.triggerHeadline + ". " + sc.triggerContext.split(".")[0] + "." },
            { heading: "Protocol Activated", body: `Protocol #${sc.protocolNumber} — ${sc.protocolName}. ${sc.tasks.length} tasks pre-staged. ${sc.stakeholders.length} stakeholders notified and acknowledged.` },
            { heading: "Resources — Pre-Authorized", body: sc.preAuthorized.slice(0,3).join("; ") + "." },
            { heading: "Time to Full Activation", body: `Protocol completes in 12 minutes from trigger detection. All tasks activate simultaneously upon your authorization.` },
          ].map(({ heading, body }, i) => (
            <div key={i} style={{ borderLeft: `2px solid ${GOLD}40`, paddingLeft: 16 }}>
              <div style={{ ...BC, fontSize: 10, fontWeight: 800, color: GOLD, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 5 }}>{heading}</div>
              <div style={{ ...BAR, fontSize: 12, color: W70, lineHeight: 1.6 }}>{body}</div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: `1px solid ${BD}`, paddingTop: 20 }}>
          <div style={{ ...BC, fontSize: 10, fontWeight: 800, color: W, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>CEO Decision Required — Choose Your Response</div>
          {authorized ? (
            <div style={{ padding: "16px 20px", background: `${TEAL}18`, border: `1px solid ${TEAL}50`, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: TEAL, flexShrink: 0 }} />
              <div style={{ ...BC, fontSize: 13, fontWeight: 800, color: TEAL, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                ✓ {choiceMade === "run_as_built" ? "Running as Built" : choiceMade === "audible" ? "Audible Called — Adjusted Protocol Activating" : choiceMade === "customize" ? "Customized — Activating Modified Protocol" : "Response Held — Stand-Down Logged"} · All Tasks Activating
              </div>
            </div>
          ) : (
            <ConsequencePreview
              triggerName={sc.triggerHeadline}
              playbookName={`Protocol #${sc.protocolNumber} — ${sc.protocolName}`}
              taskCount={sc.tasks.length}
              onConfirm={(choice: ConsequenceChoice) => handleAuth(choice)}
            />
          )}
          <div style={{ ...BAR, fontSize: 11, color: W25, marginTop: 12, lineHeight: 1.5 }}>
            Authorization is logged, timestamped, and attributed to your executive profile. No decision rights transfer without your sign-off. AI monitors — executives authorize.
          </div>
        </div>
      </div>

      <div style={{ paddingTop: 24, borderTop: `1px solid ${BD}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={onBack} style={{ ...BC, background: "transparent", border: `1px solid ${W25}`, color: W50, fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", padding: "10px 20px", cursor: "pointer" }}>← Back</button>
        <span style={{ ...BC, fontSize: 9, fontWeight: 600, letterSpacing: "0.2em", color: W25 }}>STEP {phase + 1} OF {total}</span>
      </div>
    </div>
  );
}

/* ─── Phase 5: 12-Minute Timeline ────────────────────────────────────────── */
function PhaseTimeline({ sc, phase, total, onNext, onBack }: { sc: DemoScenario; phase: number; total: number; onNext: () => void; onBack: () => void }) {
  const { simSec, done } = useSimClock(720, 18000, true);
  const mm = Math.floor(simSec / 60);
  const ss = String(simSec % 60).padStart(2, "0");
  const activeEvents = sc.timeline.filter(e => e.simSeconds <= simSec);

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "52px 28px 40px" }}>
      <SLabel color={TEAL}>Step 5 — 12-Minute Activation · Live</SLabel>

      {/* Big clock */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ ...BC, fontSize: 88, fontWeight: 900, color: done ? TEAL : GOLD, lineHeight: 1, letterSpacing: "-0.04em", transition: "color 0.5s" }}>
          {mm}:{ss}
        </div>
        <div style={{ ...BC, fontSize: 13, fontWeight: 700, letterSpacing: "0.3em", color: done ? TEAL : GOLD, textTransform: "uppercase", marginTop: 4 }}>
          {done ? "ACTIVATION COMPLETE" : "ACTIVATING — READINESS OS"}
        </div>
        <div style={{ width: "100%", maxWidth: 480, height: 4, background: W10, borderRadius: 2, overflow: "hidden", margin: "16px auto 0" }}>
          <div style={{ width: `${(simSec / 720) * 100}%`, height: "100%", background: done ? TEAL : GOLD, transition: "width 0.1s, background 0.5s" }}/>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
        {/* Readiness OS timeline */}
        <div style={{ background: `${TEAL}06`, border: `1px solid ${TEAL}35`, padding: "24px 22px" }}>
          <div style={{ ...BC, fontSize: 9, fontWeight: 800, color: TEAL, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 18 }}>◆ With Readiness OS</div>
          {sc.timeline.map((ev, i) => {
            const active = ev.simSeconds <= simSec;
            return (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 11, alignItems: "flex-start", opacity: active ? 1 : 0.15, transition: "opacity 0.4s" }}>
                <span style={{ color: active ? TEAL : W25, fontSize: 12, flexShrink: 0, marginTop: 1 }}>{active ? "✓" : "○"}</span>
                <span style={{ ...BAR, fontSize: 12, color: active ? W70 : W25, lineHeight: 1.45 }}>{ev.label}</span>
              </div>
            );
          })}
        </div>

        {/* Old model */}
        <div style={{ background: `${RED}05`, border: `1px solid ${RED}25`, padding: "24px 22px" }}>
          <div style={{ ...BC, fontSize: 9, fontWeight: 800, color: RED, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 18 }}>✕ Old Model — No Readiness OS</div>
          {sc.oldModel.map(({ day, event }, i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: 13, alignItems: "flex-start" }}>
              <span style={{ ...BC, fontSize: 10, fontWeight: 700, color: RED, width: 62, flexShrink: 0 }}>{day}</span>
              <span style={{ ...BAR, fontSize: 12, color: W50, lineHeight: 1.45 }}>{event}</span>
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${RED}30`, marginTop: 12, paddingTop: 12 }}>
            <div style={{ ...BC, fontSize: 13, fontWeight: 800, color: RED }}>{sc.oldModelCost}</div>
          </div>
        </div>
      </div>

      {done && (
        <div style={{ background: GBG, border: `1px solid ${GOLD}60`, padding: "28px 28px", textAlign: "center", marginBottom: 8 }}>
          <div style={{ ...BC, fontSize: 68, fontWeight: 900, color: GOLD, lineHeight: 1, letterSpacing: "-0.03em", marginBottom: 8 }}>3,600×</div>
          <div style={{ ...BC, fontSize: 14, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: W, marginBottom: 8 }}>Execution Head Start</div>
          <div style={{ ...BAR, fontSize: 14, color: W70, lineHeight: 1.65, maxWidth: 520, margin: "0 auto" }}>
            30 days compressed to 12 minutes. Not faster execution — earlier positioning. When your competitors are still assembling their teams, you have already set the narrative, engaged advisors, and scheduled your board.
          </div>
        </div>
      )}

      <NavBar phase={phase} total={total} onNext={onNext} onBack={onBack} nextLabel="See the Outcome →" disabled={!done}/>
    </div>
  );
}

/* ─── Phase 6: Outcome ────────────────────────────────────────────────────── */
function PhaseOutcome({ sc, onRestart }: { sc: DemoScenario; onRestart: () => void }) {
  const delivCount = useSequential(sc.outcome.deliverables.length, 500, true);
  const intelCount = useSequential(sc.outcome.intelligence.length, 700, true);
  const classColor = sc.outcome.classification === "OPTIMIZATION" ? TEAL : sc.outcome.classification === "MIXED-SIGNAL" ? GOLD : RED;

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "52px 28px 60px" }}>
      <SLabel color={TEAL}>Step 6 — Activation Debrief & Outcome</SLabel>

      <div style={{ textAlign: "center", marginBottom: 44 }}>
        <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.4em", color: TEAL, textTransform: "uppercase", marginBottom: 14 }}>Activation Status · {sc.company}</div>
        <div style={{ ...CG, fontSize: 52, fontWeight: 600, color: TEAL_LT, lineHeight: 1, letterSpacing: "-0.01em", marginBottom: 8 }}>Containment Complete</div>
        <div style={{ ...CG, fontSize: 24, fontStyle: "italic", color: GOLD, lineHeight: 1.3 }}>{sc.outcome.headline}</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 28 }}>
        {[
          { label: "Tasks Activated",          value: `${sc.tasks.length} / ${sc.tasks.length}`, color: TEAL },
          { label: "Activation Time",          value: "12:00",                                    color: GOLD },
          { label: "Debrief Classification",   value: sc.outcome.classification,                  color: classColor },
        ].map(({ label, value, color }, i) => (
          <div key={i} style={{ background: GBG, border: `1px solid ${BD}`, padding: "20px 18px", textAlign: "center" }}>
            <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: W50, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
            <div style={{ ...BC, fontSize: 20, fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Deliverables */}
        <div style={{ background: GBG, border: `1px solid ${BD}`, padding: "24px 22px" }}>
          <div style={{ ...BC, fontSize: 9, fontWeight: 800, letterSpacing: "0.25em", color: GOLD, textTransform: "uppercase", marginBottom: 16 }}>Deliverables Generated</div>
          {sc.outcome.deliverables.map(({ label, sub }, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 13, alignItems: "flex-start", opacity: i < delivCount ? 1 : 0.08, transition: "opacity 0.4s" }}>
              <span style={{ color: TEAL, fontSize: 10, flexShrink: 0, marginTop: 2 }}>◆</span>
              <div>
                <div style={{ ...BC, fontSize: 12, fontWeight: 700, color: W, letterSpacing: "0.03em", marginBottom: 1 }}>{label}</div>
                <div style={{ ...BAR, fontSize: 11, color: W50, lineHeight: 1.4 }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Intelligence */}
        <div style={{ background: `${TEAL}06`, border: `1px solid ${TEAL}30`, padding: "24px 22px" }}>
          <div style={{ ...BC, fontSize: 9, fontWeight: 800, letterSpacing: "0.25em", color: TEAL, textTransform: "uppercase", marginBottom: 16 }}>Post-Activation Intelligence</div>
          {sc.outcome.intelligence.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 13, alignItems: "flex-start", opacity: i < intelCount ? 1 : 0.08, transition: "opacity 0.4s" }}>
              <span style={{ color: TEAL, fontSize: 9, flexShrink: 0, marginTop: 3 }}>→</span>
              <span style={{ ...BAR, fontSize: 13, color: W70, lineHeight: 1.55 }}>{item}</span>
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${TEAL}25`, marginTop: 12, paddingTop: 12 }}>
            <div style={{ ...BC, fontSize: 10, fontWeight: 700, color: TEAL, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 4 }}>Impact</div>
            <div style={{ ...BAR, fontSize: 13, color: W70, lineHeight: 1.55 }}>{sc.outcome.impact}</div>
          </div>
        </div>
      </div>

      {/* Canonical tagline */}
      <div style={{ textAlign: "center", padding: "28px 0", borderTop: `1px solid ${BD}`, borderBottom: `1px solid ${BD}`, marginBottom: 32 }}>
        <div style={{ ...CG, fontSize: 24, fontStyle: "italic", color: W, lineHeight: 1.4, marginBottom: 8 }}>"The response is ready before the trigger fires."</div>
        <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: W50 }}>Preparation &nbsp;→&nbsp; Readiness &nbsp;→&nbsp; Fearless</div>
      </div>

      {/* CTA */}
      <div style={{ background: GBG, border: `1px solid ${GOLD}50`, padding: "36px 32px" }}>
        <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.4em", color: GOLD, textTransform: "uppercase", marginBottom: 14 }}>Founding Partner Program — Now Forming</div>
        <h2 style={{ ...CG, fontSize: 34, fontWeight: 600, color: W, lineHeight: 1.2, marginBottom: 10 }}>
          Every organization prepared for every situation it'll face<br/>is no longer afraid of strategic triggers.<br/><em style={{ color: GOLD }}>It's fearless.</em>
        </h2>
        <p style={{ ...BAR, fontSize: 14, color: W70, lineHeight: 1.65, maxWidth: 540, marginBottom: 24 }}>
          The Founding Partner Program is a 90-day validation partnership with large enterprises. The first cohort is forming now. The only difference between this simulation and a live deployment: the protocols carry your organization's name, your stakeholders, and your pre-approved advisors.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
          <a href="/request-access" style={{ ...BC, background: GOLD, border: "none", color: NAVY, fontSize: 15, fontWeight: 800, letterSpacing: "0.12em", padding: "16px 36px", textDecoration: "none", textTransform: "uppercase", display: "inline-block" }}>
            Apply for Founding Partner Access →
          </a>
          <button onClick={onRestart} style={{ ...BC, background: "transparent", border: `1px solid ${W25}`, color: W70, fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", padding: "16px 24px", cursor: "pointer", textTransform: "uppercase" }}>
            ↺ Run Again
          </button>
        </div>
        <a href="/demo-hub" style={{ ...BC, fontSize: 11, fontWeight: 700, color: GOLD, textDecoration: "none", letterSpacing: "0.12em", display: "inline-block" }}>
          ← Try a Different Scenario
        </a>
      </div>
    </div>
  );
}

/* ─── Progress bar ────────────────────────────────────────────────────────── */
function ProgressBar({ phase, total }: { phase: number; total: number }) {
  const labels = ["Trigger","Signals","Protocol","War Room","Authorize","12 Minutes","Outcome"];
  return (
    <div style={{ background: NAVY_BG, borderBottom: `1px solid ${BD}` }}>
      <div style={{ maxWidth: 960, margin: "0 auto", display: "flex" }}>
        {labels.map((label, i) => (
          <div key={i} style={{ flex: 1, padding: "11px 6px 9px", textAlign: "center", borderBottom: i === phase ? `2px solid ${GOLD}` : i < phase ? `2px solid ${TEAL}` : "2px solid transparent" }}>
            <div style={{ ...BC, fontSize: 7.5, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: i === phase ? GOLD : i < phase ? TEAL : W25, lineHeight: 1.4 }}>
              {i < phase ? "✓ " : ""}{label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main ────────────────────────────────────────────────────────────────── */
export default function MasterDemo() {
  const params = useParams<{ scenarioId?: string }>();
  const scenarioId = params.scenarioId ?? "activist";
  const sc = SCENARIOS[scenarioId] ?? SCENARIOS["activist"];

  const [phase, setPhase] = useState(0);
  const TOTAL = 7;
  const next = () => setPhase(p => Math.min(p + 1, TOTAL - 1));
  const back = () => setPhase(p => Math.max(p - 1, 0));

  useEffect(() => { window.scrollTo(0, 0); }, [phase]);
  // Reset phase when scenario changes
  useEffect(() => { setPhase(0); }, [scenarioId]);

  return (
    <div style={{ background: NAVY_BG, minHeight: "100vh", color: W }}>
      {/* Header */}
      <div style={{ background: NAVY_BG, borderBottom: `1px solid ${BD}`, padding: "12px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <VaughnMartinLogo color="light" height={36} variant="full" />
          <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.12)" }}/>
          <div>
            <div style={{ ...BC, fontSize: 8, fontWeight: 600, letterSpacing: "0.25em", color: W50, textTransform: "uppercase", lineHeight: 1 }}>Live Simulation</div>
            <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: W, lineHeight: 1, marginTop: 3 }}>{sc.name} · {sc.company}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <a href="/demo-hub" style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: W50, textDecoration: "none", padding: "6px 14px", border: `1px solid ${W25}` }}>← All Scenarios</a>
          <a href="/request-access" style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: NAVY, background: GOLD, textDecoration: "none", padding: "6px 14px" }}>Request Access</a>
        </div>
      </div>

      <ProgressBar phase={phase} total={TOTAL}/>

      {phase === 0 && <PhaseTrigger sc={sc} onNext={next}/>}
      {phase === 1 && <PhaseSignals sc={sc} phase={phase} total={TOTAL} onNext={next} onBack={back}/>}
      {phase === 2 && <PhaseProtocol sc={sc} phase={phase} total={TOTAL} onNext={next} onBack={back}/>}
      {phase === 3 && <PhaseWarRoom sc={sc} phase={phase} total={TOTAL} onNext={next} onBack={back}/>}
      {phase === 4 && <PhaseAuthorize sc={sc} phase={phase} total={TOTAL} onAuthorize={next} onBack={back}/>}
      {phase === 5 && <PhaseTimeline sc={sc} phase={phase} total={TOTAL} onNext={next} onBack={back}/>}
      {phase === 6 && <PhaseOutcome sc={sc} onRestart={() => setPhase(0)}/>}
    </div>
  );
}
