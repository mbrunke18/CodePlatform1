import { useState, useEffect, useLayoutEffect } from "react";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";

/* ─── Brand ───────────────────────────────────────────────────────────────── */
const NAVY    = "#0A0F2E";
const NAVY_BG = "#132558";
const GOLD    = "#C9A84C";
const TEAL    = "#2B8A6E";
const TEAL_LT = "#3BAF8A";
const RED     = "#e05252";
const W       = "#ffffff";
const W70     = "rgba(255,255,255,0.70)";
const W50     = "rgba(255,255,255,0.50)";
const W25     = "rgba(255,255,255,0.25)";
const W10     = "rgba(255,255,255,0.10)";
const BD      = "rgba(201,168,76,0.22)";
const GBG     = "rgba(201,168,76,0.06)";
const BC      = { fontFamily: "'Barlow Condensed','Arial Narrow',sans-serif" } as const;
const CG      = { fontFamily: "'Cormorant Garamond',Georgia,serif" } as const;
const BAR     = { fontFamily: "'Barlow',sans-serif" } as const;
const MONO    = { fontFamily: "'Courier New',monospace" } as const;

/* ─── Hooks ───────────────────────────────────────────────────────────────── */
function useSequential(total: number, interval: number, active: boolean): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (count >= total) return;
    const t = setTimeout(() => setCount(c => Math.min(c + 1, total)), interval);
    return () => clearTimeout(t);
  }, [count, total, interval, active]);
  return count;
}

function usePulse(ms: number): boolean {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setOn(v => !v), ms);
    return () => clearInterval(t);
  }, [ms]);
  return on;
}

/* ─── Shared UI ───────────────────────────────────────────────────────────── */
function LiveDot({ color }: { color: string }) {
  const on = usePulse(900);
  return <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, opacity: on ? 1 : 0.25, transition: "opacity 0.3s", flexShrink: 0 }} />;
}

function SLabel({ children, color = GOLD }: { children: React.ReactNode; color?: string }) {
  return <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.35em", color, textTransform: "uppercase", marginBottom: 12 }}>{children}</div>;
}

function NavBar({ phase, total, onNext, onBack, nextLabel, disabled = false }: {
  phase: number; total: number; onNext: () => void; onBack: () => void; nextLabel: string; disabled?: boolean;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 40, paddingTop: 24, borderTop: `1px solid ${BD}` }}>
      <button onClick={onBack} disabled={phase === 0} style={{ ...BC, background: "transparent", border: `1px solid ${phase === 0 ? W10 : W25}`, color: phase === 0 ? W10 : W50, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", padding: "10px 20px", cursor: phase === 0 ? "default" : "pointer", textTransform: "uppercase" }}>
        ← Back
      </button>
      <div style={{ ...MONO, fontSize: 10, color: W25, letterSpacing: "0.2em" }}>Phase {phase + 1} of {total}</div>
      <button onClick={onNext} disabled={disabled} style={{ ...BC, background: disabled ? `${GOLD}30` : GOLD, border: "none", color: disabled ? `${GOLD}60` : NAVY, fontSize: 13, fontWeight: 800, letterSpacing: "0.12em", padding: "12px 28px", cursor: disabled ? "default" : "pointer", textTransform: "uppercase" }}>
        {nextLabel}
      </button>
    </div>
  );
}

/* ─── Progress Bar ────────────────────────────────────────────────────────── */
const PHASE_LABELS = ["Unknown Trigger", "Protocol #0", "Institutional Memory", "Rapid Build", "Outcome"];
function ProgressBar({ phase }: { phase: number }) {
  return (
    <div style={{ background: NAVY_BG, borderBottom: `1px solid ${BD}` }}>
      <div style={{ maxWidth: 960, margin: "0 auto", display: "flex" }}>
        {PHASE_LABELS.map((label, i) => (
          <div key={i} style={{ flex: 1, padding: "11px 6px 9px", textAlign: "center", borderBottom: i === phase ? `2px solid ${GOLD}` : i < phase ? `2px solid ${TEAL}` : "2px solid transparent" }}>
            <div style={{ ...BC, fontSize: 7.5, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: i === phase ? GOLD : i < phase ? TEAL : W25 }}>
              {i < phase ? "✓ " : ""}{label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Phase 0: Unknown Trigger ────────────────────────────────────────────── */
const SCAN_PROTOCOLS = [
  "#23 Ransomware Response", "#47 Activist Investor Defense", "#78 DOJ Investigation",
  "#31 Critical Supplier Failure", "#122 Regulatory Action", "#89 Product Recall",
  "#12 Supply Chain Collapse", "#44 Data Breach Response", "#93 M&A Defense",
  "#67 Food Safety Crisis", "#112 Grid Failure", "#156 Trade Disruption",
  "#58 LOI Response", "#99 IP Litigation", "#104 Executive Departure",
  "#180 Market Entry Defense",
];

function PhaseUnknown({ onNext }: { onNext: () => void }) {
  const [scanIdx, setScanIdx] = useState(0);
  const [scanState, setScanState] = useState<"scanning" | "nomatch" | "routing">("scanning");
  const [vis, setVis] = useState(false);

  useEffect(() => { setTimeout(() => setVis(true), 150); }, []);

  useEffect(() => {
    if (scanState !== "scanning") return;
    let count = 0;
    const t = setInterval(() => {
      setScanIdx(i => (i + 1) % SCAN_PROTOCOLS.length);
      count++;
      if (count >= 32) { clearInterval(t); setScanState("nomatch"); }
    }, 80);
    return () => clearInterval(t);
  }, [scanState]);

  useEffect(() => {
    if (scanState !== "nomatch") return;
    const t = setTimeout(() => setScanState("routing"), 2400);
    return () => clearTimeout(t);
  }, [scanState]);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 28px 48px", opacity: vis ? 1 : 0, transition: "opacity 0.6s" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <LiveDot color={RED} />
        <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.4em", color: RED, textTransform: "uppercase" }}>
          First-In-Class Trigger Detected · No Precedent
        </span>
      </div>

      <div style={{ ...BC, fontSize: 62, fontWeight: 900, color: W, lineHeight: 1.0, letterSpacing: "-0.02em", marginBottom: 10 }}>11:14 AM</div>
      <div style={{ ...CG, fontSize: 32, fontStyle: "italic", color: GOLD, lineHeight: 1.2, marginBottom: 28 }}>
        A trigger just fired that has never been seen before.
      </div>

      <div style={{ background: `${RED}0d`, border: `1px solid ${RED}40`, padding: "22px 24px", marginBottom: 28 }}>
        <div style={{ ...MONO, fontSize: 9, fontWeight: 700, color: RED, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>
          11:14:22 AM EST · FEDERAL REGISTER · EMERGENCY ISSUANCE
        </div>
        <div style={{ ...BC, fontSize: 20, fontWeight: 800, color: W, letterSpacing: "0.02em", lineHeight: 1.3, marginBottom: 8 }}>
          Federal AI Liability Executive Order — Emergency Compliance Attestation Required
        </div>
        <div style={{ ...BAR, fontSize: 13, color: W70, lineHeight: 1.65 }}>
          All US enterprises with ≥500 employees must submit AI liability attestation within 72 hours or face suspension of federal contracts. No regulatory precedent. No prior guidance. First-in-class mandate — effective immediately.
        </div>
      </div>

      <div style={{ background: NAVY_BG, border: `1px solid ${BD}`, padding: "24px", marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <LiveDot color={scanState === "nomatch" ? RED : scanState === "routing" ? TEAL : GOLD} />
          <span style={{ ...MONO, fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", color: scanState === "nomatch" ? RED : scanState === "routing" ? TEAL : GOLD, textTransform: "uppercase" }}>
            {scanState === "scanning" && "SCANNING 180 READINESS PROTOCOLS…"}
            {scanState === "nomatch" && "⚠ NO PROTOCOL MATCH — FIRST-IN-CLASS EVENT"}
            {scanState === "routing" && "◆ PROTOCOL #0 ROUTING — UNIVERSAL RESPONSE ACTIVATING"}
          </span>
        </div>
        <div style={{ ...BC, fontSize: 24, fontWeight: 800, letterSpacing: "0.04em", minHeight: 36, color: scanState === "nomatch" ? RED : scanState === "routing" ? TEAL_LT : W50, transition: "color 0.4s" }}>
          {scanState === "scanning" && SCAN_PROTOCOLS[scanIdx]}
          {scanState === "nomatch" && "No existing protocol covers this situation."}
          {scanState === "routing" && "Protocol #0 — Universal Response Framework"}
        </div>
      </div>

      {scanState === "routing" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, marginBottom: 8 }}>
          <div style={{ padding: "16px 20px", background: `${RED}07`, border: "1px solid rgba(192,57,43,0.25)", borderRight: "none" }}>
            <div style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.3em", color: RED, textTransform: "uppercase", marginBottom: 5 }}>Traditional Model — T+0</div>
            <div style={{ ...BAR, fontSize: 12, color: W50, lineHeight: 1.55 }}>Call outside counsel. Assemble task force. 30 days to mobilize. No one owns this yet.</div>
          </div>
          <div style={{ padding: "16px 20px", background: `${TEAL}08`, border: `1px solid ${TEAL}35` }}>
            <div style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.3em", color: TEAL, textTransform: "uppercase", marginBottom: 5 }}>Readiness OS — T+0</div>
            <div style={{ ...BAR, fontSize: 12, color: W50, lineHeight: 1.55 }}>Protocol #0 activating. Authority chain confirmed. Budget envelope staged. Advisors deploying.</div>
          </div>
        </div>
      )}

      <NavBar phase={0} total={5} onNext={onNext} onBack={() => {}} nextLabel="See Protocol #0 Activate →" disabled={scanState !== "routing"} />
    </div>
  );
}

/* ─── Phase 1: Protocol #0 Components ────────────────────────────────────── */
const P0_COMPONENTS = [
  {
    id: "authority",
    label: "Authority Chain",
    status: "CONFIRMED",
    color: TEAL,
    icon: "◆",
    headline: "Pre-mapped. Pre-confirmed. Activated immediately.",
    detail: "CEO · General Counsel · CISO · CFO — role assignments existed before this trigger. No one is figuring out who owns this. Escalation path is confirmed and live.",
    sub: "Pre-configured · Always active",
  },
  {
    id: "budget",
    label: "Budget Envelope",
    status: "AUTHORIZED",
    color: GOLD,
    icon: "◆",
    headline: "$500K first-response authorization — no approval delay.",
    detail: "Pre-approved spend threshold for first 72 hours. Outside counsel, compliance specialists, technical assessors — all engageable without a procurement cycle.",
    sub: "Board pre-authorized · CFO confirmed",
  },
  {
    id: "resources",
    label: "External Resources",
    status: "DEPLOYING",
    color: TEAL,
    icon: "◆",
    headline: "Counsel, advisors, specialists — one call activates them.",
    detail: "Pre-identified external resources on standby. Regulatory counsel notified. AI compliance specialists engaged. Federal affairs advisory on the line in 8 minutes.",
    sub: "Standby contracts active · Retainers confirmed",
  },
  {
    id: "assessment",
    label: "Situation Assessment Framework",
    status: "STAGED",
    color: GOLD,
    icon: "◆",
    headline: "Six structured questions. Any novel event. Every time.",
    detail: "1. Who is exposed? 2. What is the decision window? 3. What authority is required? 4. What precedent exists in adjacent domains? 5. What is the cost of inaction? 6. What does the first 72 hours look like?",
    sub: "Framework always staged · Protocol-independent",
  },
  {
    id: "rapidbuild",
    label: "Rapid Protocol Build",
    status: "INITIATING",
    color: TEAL,
    icon: "◆",
    headline: "Institutional memory becomes the raw material.",
    detail: "Every prior activation encoded knowledge: regulatory response sequencing, board notification protocols, stakeholder communication frameworks. That infrastructure now accelerates the build of a protocol that has never existed.",
    sub: "Encoding 847 prior decisions · Institutional memory active",
  },
  {
    id: "execframe",
    label: "Executive Decision Frame",
    status: "ACTIVE",
    color: GOLD,
    icon: "◆",
    headline: "The four choices always apply — even without a script.",
    detail: "Authorize as built. Audible the approach. Customize before activating. Stand down and monitor. These choices exist for every trigger — known or unknown. The executive is never left with a blank page.",
    sub: "Four choices · Always available",
  },
];

function PhaseProtocolZero({ phase, onNext, onBack }: { phase: number; onNext: () => void; onBack: () => void }) {
  const revealed = useSequential(P0_COMPONENTS.length, 480, true);
  const allRevealed = revealed >= P0_COMPONENTS.length;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "52px 28px 48px" }}>
      <SLabel color={GOLD}>Protocol #0 — Universal Response Framework</SLabel>
      <h2 style={{ ...CG, fontSize: 46, fontWeight: 600, color: W, lineHeight: 1.05, marginBottom: 8 }}>
        Six components. Always active.<br /><em style={{ color: GOLD }}>None of them require a matching protocol.</em>
      </h2>
      <p style={{ ...BAR, fontSize: 14, color: W70, lineHeight: 1.65, maxWidth: 660, marginBottom: 32 }}>
        Protocol #0 is not a response to a specific situation. It is the infrastructure that exists beneath every specific protocol — and activates automatically when no specific protocol matches. It was staged before this trigger fired.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {P0_COMPONENTS.map((c, i) => {
          const visible = i < revealed;
          return (
            <div key={c.id} style={{ background: visible ? `${c.color}07` : "rgba(255,255,255,0.02)", border: `1px solid ${visible ? c.color + "45" : "rgba(255,255,255,0.07)"}`, padding: "20px 24px", display: "flex", gap: 20, alignItems: "flex-start", opacity: visible ? 1 : 0.08, transition: "opacity 0.5s, border-color 0.5s, background 0.5s" }}>
              <div style={{ flexShrink: 0, width: 40, paddingTop: 2 }}>
                <div style={{ ...BC, fontSize: 9, fontWeight: 800, color: visible ? c.color : W25, letterSpacing: "0.1em", marginBottom: 2 }}>P0.{String(i + 1).padStart(2, "0")}</div>
                <div style={{ ...BC, fontSize: 8, fontWeight: 700, color: visible ? c.color : W25, letterSpacing: "0.15em", background: visible ? `${c.color}18` : "transparent", border: visible ? `1px solid ${c.color}40` : "none", padding: "2px 5px", textTransform: "uppercase" as const }}>{c.status}</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6, gap: 12 }}>
                  <div style={{ ...BC, fontSize: 16, fontWeight: 800, color: W, letterSpacing: "0.04em" }}>{c.label}</div>
                  <div style={{ ...BAR, fontSize: 10, color: c.color, flexShrink: 0 }}>{c.sub}</div>
                </div>
                <div style={{ ...BAR, fontSize: 13, fontWeight: 600, color: c.color, marginBottom: 5 }}>{c.headline}</div>
                <div style={{ ...BAR, fontSize: 12, color: W50, lineHeight: 1.6 }}>{c.detail}</div>
              </div>
            </div>
          );
        })}
      </div>

      {allRevealed && (
        <div style={{ background: GBG, border: `1px solid ${GOLD}50`, padding: "20px 24px", textAlign: "center" }}>
          <div style={{ ...CG, fontSize: 20, fontStyle: "italic", color: W, lineHeight: 1.4 }}>
            "The executive is never left with a blank page. The preparation is always there — even for situations that have never existed."
          </div>
        </div>
      )}

      <NavBar phase={phase} total={5} onNext={onNext} onBack={onBack} nextLabel="See Institutional Memory →" disabled={!allRevealed} />
    </div>
  );
}

/* ─── Phase 2: Institutional Memory ──────────────────────────────────────── */
const MEMORY_SOURCES = [
  { protocol: "#122 — Regulatory Action Response", contribution: "Regulatory response sequencing · Board notification protocol · Federal agency engagement process", decisions: 94, color: TEAL },
  { protocol: "#78 — DOJ Investigation", contribution: "Outside counsel engagement chain · Privilege protection framework · Document hold procedures", decisions: 112, color: GOLD },
  { protocol: "#23 — Ransomware Response", contribution: "War room structure · Cross-functional stakeholder chain · Executive communication cadence", decisions: 87, color: TEAL },
  { protocol: "#44 — Data Breach Response", contribution: "Regulatory notification timeline · Technical assessment sequencing · Customer disclosure framework", decisions: 143, color: GOLD },
  { protocol: "#47 — Activist Investor Defense", contribution: "Board convening procedure · Institutional narrative framework · Advisor activation sequence", decisions: 76, color: TEAL },
  { protocol: "#89 — Product Recall", contribution: "Federal agency coordination · Cross-functional task sequencing · Public statement cadence", decisions: 98, color: GOLD },
];

function PhaseMemory({ phase, onNext, onBack }: { phase: number; onNext: () => void; onBack: () => void }) {
  const revealed = useSequential(MEMORY_SOURCES.length, 600, true);
  const allRevealed = revealed >= MEMORY_SOURCES.length;
  const totalDecisions = MEMORY_SOURCES.slice(0, revealed).reduce((a, s) => a + s.decisions, 0);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "52px 28px 48px" }}>
      <SLabel color={TEAL}>Institutional Memory — Active Encoding</SLabel>
      <h2 style={{ ...CG, fontSize: 44, fontWeight: 600, color: W, lineHeight: 1.05, marginBottom: 8 }}>
        Every prior activation encoded something.<br /><em style={{ color: TEAL_LT }}>That knowledge is the raw material now.</em>
      </h2>
      <p style={{ ...BAR, fontSize: 14, color: W70, lineHeight: 1.65, maxWidth: 660, marginBottom: 32 }}>
        No protocol exists for this trigger. But your organization has run activations that touched regulatory response, legal engagement, cross-functional war rooms, and board communication. That encoded knowledge is being pulled now — not from memory, from record.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 32 }}>
        {[
          { label: "Prior Activations Encoding", value: `${MEMORY_SOURCES.length}`, sub: "Relevant cross-domain protocols contributing", color: TEAL },
          { label: "Decisions Encoded", value: totalDecisions.toLocaleString(), sub: "Structured decisions available as raw material", color: GOLD },
          { label: "Build Time Compressed", value: "30 days → hours", sub: "From blank page to structured starting point", color: GOLD },
        ].map(({ label, value, sub, color }, i) => (
          <div key={i} style={{ background: GBG, border: `1px solid ${BD}`, padding: "20px 18px", borderTop: `3px solid ${color}`, textAlign: "center" }}>
            <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: W50, textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
            <div style={{ ...BC, fontSize: 20, fontWeight: 900, color, lineHeight: 1.1, marginBottom: 6 }}>{value}</div>
            <div style={{ ...BAR, fontSize: 11, color: W50, lineHeight: 1.5 }}>{sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {MEMORY_SOURCES.map((s, i) => {
          const visible = i < revealed;
          return (
            <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "16px 20px", background: "rgba(255,255,255,0.03)", border: `1px solid ${visible ? s.color + "35" : "rgba(255,255,255,0.06)"}`, opacity: visible ? 1 : 0.06, transition: "opacity 0.5s" }}>
              <div style={{ flexShrink: 0, textAlign: "center", width: 44 }}>
                <div style={{ ...BC, fontSize: 20, fontWeight: 900, color: visible ? s.color : W25, lineHeight: 1 }}>{s.decisions}</div>
                <div style={{ ...BC, fontSize: 7, fontWeight: 700, color: W25, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 2 }}>decisions</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ ...BC, fontSize: 12, fontWeight: 800, color: W, letterSpacing: "0.06em", marginBottom: 4 }}>{s.protocol}</div>
                <div style={{ ...BAR, fontSize: 11, color: W50, lineHeight: 1.55 }}>{s.contribution}</div>
              </div>
              {visible && <div style={{ ...BC, fontSize: 8, fontWeight: 700, color: s.color, letterSpacing: "0.2em", textTransform: "uppercase", flexShrink: 0, paddingTop: 2 }}>ENCODING →</div>}
            </div>
          );
        })}
      </div>

      <NavBar phase={phase} total={5} onNext={onNext} onBack={onBack} nextLabel="See the Rapid Build →" disabled={!allRevealed} />
    </div>
  );
}

/* ─── Phase 3: Rapid Protocol Build ──────────────────────────────────────── */
const BUILD_TASKS = [
  { min: "T+08", owner: "General Counsel", task: "Outside AI regulatory counsel engaged and briefed. Privilege protection invoked. Initial compliance scope defined.", done: true },
  { min: "T+14", owner: "CISO", task: "AI systems inventory initiated. Automated disclosure scope assessment underway. Technical attestation framework staged.", done: true },
  { min: "T+22", owner: "CFO", task: "$500K compliance response envelope authorized. Finance partner assigned. Federal contractor revenue exposure quantified.", done: true },
  { min: "T+31", owner: "CEO", task: "Board notification sent. Investor relations briefed. Federal affairs advisor activated. First executive narrative framed.", done: true },
  { min: "T+44", owner: "Compliance Lead", task: "Attestation template sourced from regulatory counsel. Internal review sequencing assigned across 6 business units.", done: true },
  { min: "T+58", owner: "General Counsel", task: "Federal agency pre-notification call scheduled. Outside counsel and federal affairs on same briefing. Submission pathway confirmed.", done: true },
  { min: "T+67", owner: "CEO", task: "Executive authorization given. Submission pathway approved. Communications plan activated. Board briefed same session.", done: false },
  { min: "T+72", owner: "Compliance Lead", task: "Attestation submitted within 72-hour mandate. Regulatory exposure contained. Compliance record established.", done: false },
];

function PhaseBuild({ phase, onNext, onBack }: { phase: number; onNext: () => void; onBack: () => void }) {
  const revealed = useSequential(BUILD_TASKS.length, 700, true);
  const allRevealed = revealed >= BUILD_TASKS.length;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "52px 28px 48px" }}>
      <SLabel color={GOLD}>Rapid Protocol Build · T+0 → T+72 Minutes</SLabel>
      <h2 style={{ ...CG, fontSize: 44, fontWeight: 600, color: W, lineHeight: 1.05, marginBottom: 8 }}>
        From no protocol to structured response.<br /><em style={{ color: GOLD }}>72 minutes. Not 30 days.</em>
      </h2>
      <p style={{ ...BAR, fontSize: 14, color: W70, lineHeight: 1.65, maxWidth: 660, marginBottom: 12 }}>
        This is not a perfect protocol. It is a structured starting point — built from institutional memory, encoded authority, and pre-staged resources. In the traditional model, this same sequence takes 30 days to even begin.
      </p>

      <div style={{ display: "flex", gap: 0, marginBottom: 28 }}>
        <div style={{ flex: 1, padding: "12px 18px", background: "rgba(192,57,43,0.07)", border: "1px solid rgba(192,57,43,0.22)", borderRight: "none" }}>
          <div style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.25em", color: RED, textTransform: "uppercase", marginBottom: 4 }}>Traditional Model — T+72 Minutes</div>
          <div style={{ ...BAR, fontSize: 12, color: "rgba(255,255,255,0.55)" }}>Still assembling task force. Outside counsel not yet engaged. Nobody owns the attestation. 30-day mobilization underway. Federal deadline at risk.</div>
        </div>
        <div style={{ flex: 1, padding: "12px 18px", background: `${TEAL}08`, border: `1px solid ${TEAL}35` }}>
          <div style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.25em", color: TEAL, textTransform: "uppercase", marginBottom: 4 }}>Readiness OS — T+72 Minutes</div>
          <div style={{ ...BAR, fontSize: 12, color: "rgba(255,255,255,0.55)" }}>Attestation submitted. Regulatory exposure contained. Board briefed. Compliance record established. Federal deadline met.</div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {BUILD_TASKS.map((t, i) => {
          const visible = i < revealed;
          const isConfirmed = visible && t.done;
          const isPending = visible && !t.done;
          const borderCol = isConfirmed ? TEAL : isPending ? GOLD : "rgba(255,255,255,0.08)";
          return (
            <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "14px 18px", background: "rgba(255,255,255,0.025)", border: `1px solid ${borderCol}`, opacity: visible ? 1 : 0.06, transition: "opacity 0.5s" }}>
              <div style={{ flexShrink: 0, width: 38 }}>
                <div style={{ ...MONO, fontSize: 10, fontWeight: 700, color: isConfirmed ? TEAL : isPending ? GOLD : W25 }}>{t.min}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", color: isConfirmed ? TEAL : isPending ? GOLD : W25, textTransform: "uppercase", marginBottom: 3 }}>{t.owner}</div>
                <div style={{ ...BAR, fontSize: 12, color: visible ? W70 : W25, lineHeight: 1.55 }}>{t.task}</div>
              </div>
              <div style={{ flexShrink: 0 }}>
                {isConfirmed && <div style={{ ...BC, fontSize: 8, fontWeight: 700, color: TEAL, letterSpacing: "0.2em" }}>✓ COMPLETE</div>}
                {isPending && <div style={{ ...BC, fontSize: 8, fontWeight: 700, color: GOLD, letterSpacing: "0.2em" }}>QUEUED</div>}
              </div>
            </div>
          );
        })}
      </div>

      <NavBar phase={phase} total={5} onNext={onNext} onBack={onBack} nextLabel="See the Outcome →" disabled={!allRevealed} />
    </div>
  );
}

/* ─── Phase 4: Outcome ────────────────────────────────────────────────────── */
function PhaseOutcome({ onRestart }: { onRestart: () => void }) {
  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "52px 28px 60px" }}>
      <SLabel color={TEAL}>Protocol #0 — Activation Complete</SLabel>

      <div style={{ textAlign: "center", marginBottom: 44 }}>
        <div style={{ ...CG, fontSize: 52, fontWeight: 600, color: TEAL_LT, lineHeight: 1, marginBottom: 8 }}>Compliance Secured.</div>
        <div style={{ ...CG, fontSize: 24, fontStyle: "italic", color: GOLD, lineHeight: 1.3 }}>A protocol that didn't exist 72 minutes ago just became your organization's precedent.</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 32 }}>
        {[
          { label: "Response Time", value: "72 min", sub: "vs. 30-day traditional mobilization", color: TEAL },
          { label: "Protocol Status", value: "Created", sub: "Now exists in your library — forever", color: GOLD },
          { label: "Execution Head Start", value: "3,600×", sub: "vs. organizations without Protocol #0", color: GOLD },
          { label: "Federal Deadline", value: "Met", sub: "Attestation submitted within 72-hour window", color: TEAL },
        ].map(({ label, value, sub, color }, i) => (
          <div key={i} style={{ background: GBG, border: `1px solid ${BD}`, padding: "20px 18px", textAlign: "center", borderTop: `3px solid ${color}` }}>
            <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: W50, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
            <div style={{ ...BC, fontSize: 22, fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
            <div style={{ ...BAR, fontSize: 11, color: W50, lineHeight: 1.5, marginTop: 6 }}>{sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
        <div style={{ background: GBG, border: `1px solid ${BD}`, padding: "24px 22px" }}>
          <div style={{ ...BC, fontSize: 9, fontWeight: 800, letterSpacing: "0.25em", color: GOLD, textTransform: "uppercase", marginBottom: 16 }}>What This Activation Produced</div>
          {[
            { label: "Compliance Attestation Filed", sub: "Federal mandate met · Contractor revenue protected" },
            { label: "Protocol #181 Created", sub: "AI Regulatory Response — now permanent in your library" },
            { label: "Legal Engagement Framework", sub: "Counsel structure encoded for all future AI regulatory events" },
            { label: "Board Record Established", sub: "Decision documentation · Precedent set for future mandates" },
          ].map(({ label, sub }, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "flex-start" }}>
              <span style={{ color: TEAL, fontSize: 10, flexShrink: 0, marginTop: 2 }}>◆</span>
              <div>
                <div style={{ ...BC, fontSize: 12, fontWeight: 700, color: W, letterSpacing: "0.03em", marginBottom: 1 }}>{label}</div>
                <div style={{ ...BAR, fontSize: 11, color: W50, lineHeight: 1.4 }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: `${TEAL}06`, border: `1px solid ${TEAL}30`, padding: "24px 22px" }}>
          <div style={{ ...BC, fontSize: 9, fontWeight: 800, letterSpacing: "0.25em", color: TEAL, textTransform: "uppercase", marginBottom: 16 }}>What Protocol #0 Proved</div>
          {[
            "The gap between known and unknown is not a product gap — it is a preparation gap.",
            "Every encoded activation becomes the infrastructure for the next one that doesn't exist yet.",
            "You do not need a perfect protocol. You need a structured starting point and confirmed authority.",
            "The organization that faced this without Protocol #0 is still assembling its task force.",
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 14, alignItems: "flex-start" }}>
              <span style={{ color: TEAL, fontSize: 9, flexShrink: 0, marginTop: 3 }}>→</span>
              <span style={{ ...BAR, fontSize: 12, color: W70, lineHeight: 1.55 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "28px 0", borderTop: `1px solid ${BD}`, borderBottom: `1px solid ${BD}`, marginBottom: 32 }}>
        <div style={{ ...CG, fontSize: 26, fontStyle: "italic", color: W, lineHeight: 1.4, marginBottom: 8 }}>
          "The preparation you built for 180 situations<br />gave you the infrastructure for the 181st."
        </div>
        <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: W50 }}>
          Preparation &nbsp;→&nbsp; Readiness &nbsp;→&nbsp; Fearless
        </div>
      </div>

      <div style={{ background: GBG, border: `1px solid ${GOLD}50`, padding: "36px 32px" }}>
        <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.4em", color: GOLD, textTransform: "uppercase", marginBottom: 14 }}>Founding Partner Program — Now Forming</div>
        <h2 style={{ ...CG, fontSize: 32, fontWeight: 600, color: W, lineHeight: 1.2, marginBottom: 10 }}>
          Protocol #0 is included in every deployment.<br />
          <em style={{ color: GOLD }}>No organization we work with faces a blank page.</em>
        </h2>
        <p style={{ ...BAR, fontSize: 14, color: W70, lineHeight: 1.65, maxWidth: 560, marginBottom: 24 }}>
          The Founding Partner Program deploys your full Readiness Infrastructure — 180 Readiness Protocols calibrated to your organization, Protocol #0 staged as the universal fallback, and institutional memory that compounds with every activation you run.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
          <a href="/founding-partner-program" style={{ ...BC, background: GOLD, border: "none", color: NAVY, fontSize: 15, fontWeight: 800, letterSpacing: "0.12em", padding: "16px 36px", textDecoration: "none", textTransform: "uppercase", display: "inline-block" }}>
            Apply for Founding Partner Access →
          </a>
          <button onClick={onRestart} style={{ ...BC, background: "transparent", border: `1px solid ${W25}`, color: W70, fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", padding: "16px 24px", cursor: "pointer", textTransform: "uppercase" }}>
            ↺ Run Again
          </button>
        </div>
        <a href="/demo-hub" style={{ ...BC, fontSize: 11, fontWeight: 700, color: GOLD, textDecoration: "none", letterSpacing: "0.12em", display: "inline-block" }}>
          ← See All 12 Scenario Demos
        </a>
      </div>
    </div>
  );
}

/* ─── Main ────────────────────────────────────────────────────────────────── */
export default function ProtocolZero() {
  const [phase, setPhase] = useState(0);
  const TOTAL = 5;
  const next = () => { setPhase(p => Math.min(p + 1, TOTAL - 1)); window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }); };
  const back = () => { setPhase(p => Math.max(p - 1, 0)); window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }); };

  useLayoutEffect(() => { window.scrollTo(0, 0); }, []);
  useEffect(() => { window.scrollTo(0, 0); }, [phase]);

  return (
    <div style={{ background: NAVY_BG, minHeight: "100vh", color: W }}>
      <div style={{ background: NAVY_BG, borderBottom: `1px solid ${BD}`, padding: "12px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <VaughnMartinLogo color="light" height={36} variant="full" />
          <div style={{ width: 1, height: 28, background: W10 }} />
          <div>
            <div style={{ ...BC, fontSize: 8, fontWeight: 600, letterSpacing: "0.25em", color: W50, textTransform: "uppercase", lineHeight: 1 }}>Live Simulation</div>
            <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: W, lineHeight: 1, marginTop: 3 }}>Protocol #0 — Universal Response Framework</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <a href="/demo-hub" style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: W50, textDecoration: "none", padding: "6px 14px", border: `1px solid ${W25}` }}>← All Scenarios</a>
          <a href="/founding-partner-program" style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: NAVY, background: GOLD, textDecoration: "none", padding: "6px 14px" }}>Apply for Founding Partner Access</a>
        </div>
      </div>

      <ProgressBar phase={phase} />

      {phase === 0 && <PhaseUnknown onNext={next} />}
      {phase === 1 && <PhaseProtocolZero phase={phase} onNext={next} onBack={back} />}
      {phase === 2 && <PhaseMemory phase={phase} onNext={next} onBack={back} />}
      {phase === 3 && <PhaseBuild phase={phase} onNext={next} onBack={back} />}
      {phase === 4 && <PhaseOutcome onRestart={() => setPhase(0)} />}
    </div>
  );
}
