import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight, ChevronLeft, Shield, Zap, Clock, Users,
  CheckCircle, AlertTriangle, Lock, FileText, Bell, Activity,
  CheckSquare, Circle, Loader2, TrendingUp,
} from "lucide-react";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const NAVY = "#0A0F2E";
const NAVY_CARD = "#0d1435";
const NAVY_MID = "#132558";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const BORDER = "rgba(255,255,255,0.08)";
const MUTED = "rgba(255,255,255,0.45)";
const BC: React.CSSProperties = { fontFamily: "'Barlow Condensed', 'Barlow', sans-serif" };
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', Georgia, serif" };

// ─── Scenario data ────────────────────────────────────────────────────────────
const ELAPSED = ["—", "—", "8:22", "9:47", "11:43"];

const STAKEHOLDERS = [
  { role: "CISO", initials: "AC", name: "A. Chen", status: "acknowledged" as const, time: "4:26 AM" },
  { role: "CTO", initials: "MT", name: "M. Torres", status: "acknowledged" as const, time: "4:27 AM" },
  { role: "General Counsel", initials: "RP", name: "R. Patel", status: "notified" as const, time: "4:28 AM" },
  { role: "CEO", initials: "KW", name: "K. Williams", status: "pending" as const, time: "—" },
];

const TASKS = [
  { name: "Isolate affected trading nodes", owner: "CISO", status: "complete" as const },
  { name: "Authenticate SWIFT alternate routing", owner: "CTO", status: "active" as const },
  { name: "Initiate forensic chain-of-custody", owner: "Legal", status: "active" as const },
  { name: "Prepare SEC regulatory notification", owner: "Legal", status: "staged" as const },
  { name: "Board crisis notification draft", owner: "CEO Office", status: "staged" as const },
];

const PRECEDENTS = [
  { exec: "CRO", date: "Nov 2024", choice: "Authorized — Run as Built", outcome: "Proven" as const },
  { exec: "CLO", date: "Jan 2025", choice: "Authorized — Run as Built", outcome: "Proven" as const },
];

const PREFLIGHT = [
  "Do you have decision authority for this response?",
  "Is executive sponsorship confirmed?",
  "Are you prepared to own outcomes through close-out?",
];

const STEP_DEFS = [
  { label: "Signal Detected", tag: "4:23 AM" },
  { label: "Protocol Staged", tag: "Pre-built 8 mo. ago" },
  { label: "War Room Active", tag: "8:22 elapsed" },
  { label: "Executive Authorizes", tag: "9:47 elapsed" },
  { label: "Response Complete", tag: "11:43 — OPTIMIZATION" },
];

// ─── Narration copy ───────────────────────────────────────────────────────────
const NARRATION = [
  {
    headline: "The system detects it before you do.",
    body: "At 4:23 AM, encryption patterns cascade across three trading nodes. No one was paged. No committee assembled. Continuous signal monitoring matched the pattern and surfaced one Readiness Protocol — before a single human knew it happened.",
    callout: "231 trigger patterns monitored continuously.",
  },
  {
    headline: "The response existed before this moment.",
    body: "Protocol #14 was designed 8 months ago during a preparedness review. Every task written. Every stakeholder identified. Every decision gate mapped. When the signal fired, nothing had to be built — only activated.",
    callout: "\"The response is ready before the trigger fires.\"",
  },
  {
    headline: "Execution begins. No meeting required.",
    body: "Four executives are notified in under 90 seconds. Twenty-two tasks are assigned across five departments. The first immediate actions are already in motion. This is minute 8. In a traditional response, you'd still be assembling the call.",
    callout: "8:22 elapsed. Industry average at this point: Day 2 of mobilization.",
  },
  {
    headline: "One executive. One decision.",
    body: "The preparation compresses the mobilization cycle — but the decision remains human. You see how peer executives decided in identical situations. Three pre-flight questions confirm readiness. Then you authorize. That is the only moment this required your attention.",
    callout: "No Readiness Protocol activates without executive sign-off.",
  },
  {
    headline: "11 minutes, 43 seconds.",
    body: "The response window closes in under 12 minutes. Not 30 days. The system records the outcome, classifies the performance, and updates Protocol #14 with everything learned — so the next response is faster.",
    callout: "3,600× Execution Head Start vs. traditional mobilization.",
  },
];

// ─── Helper components ────────────────────────────────────────────────────────

function StatusDot({ color, pulse }: { color: string; pulse?: boolean }) {
  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 10, height: 10, flexShrink: 0 }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "block" }} />
      {pulse && (
        <span style={{
          position: "absolute", width: 16, height: 16, borderRadius: "50%",
          border: `1px solid ${color}`, opacity: 0.4,
          animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite",
        }} />
      )}
    </span>
  );
}

function Badge({ children, color, bg }: { children: React.ReactNode; color: string; bg: string }) {
  return (
    <span style={{ ...BC, display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", background: bg, border: `1px solid ${color}33`, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color, borderRadius: "0.15rem", whiteSpace: "nowrap" as const }}>
      {children}
    </span>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: NAVY_CARD, border: `1px solid ${BORDER}`, padding: "20px 24px", borderRadius: "0.15rem", ...style }}>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 8 }}>{children}</div>;
}

// ─── Step panels ──────────────────────────────────────────────────────────────

function PanelSignal() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Alert header */}
      <div style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.3)", padding: "14px 20px", borderRadius: "0.15rem", display: "flex", alignItems: "center", gap: 12 }}>
        <StatusDot color="#EF4444" pulse />
        <div style={{ flex: 1 }}>
          <div style={{ ...BC, fontSize: 11, fontWeight: 700, color: "#EF4444", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>HIGH RISK — SIGNAL THRESHOLD EXCEEDED</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>3 of 3 confirmation patterns matched · Auto-escalated</div>
        </div>
        <div style={{ ...BC, fontSize: 22, fontWeight: 700, color: "#EF4444" }}>94</div>
      </div>

      {/* Signal card */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <Label>Trigger Pattern</Label>
            <div style={{ ...CG, fontSize: 20, fontWeight: 600, color: "#fff", marginBottom: 4 }}>Financial Infrastructure Compromise</div>
            <div style={{ fontSize: 12, color: MUTED }}>Source: Security Operations Center · Node Cluster 7</div>
          </div>
          <Badge color="#EF4444" bg="rgba(220,38,38,0.1)">High Risk</Badge>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16, paddingTop: 16, borderTop: `1px solid ${BORDER}` }}>
          {[
            { label: "Detected At", val: "4:23:07 AM" },
            { label: "Signal Confidence", val: "94%" },
            { label: "Patterns Matched", val: "3 / 3" },
          ].map(s => (
            <div key={s.label}>
              <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 4 }}>{s.label}</div>
              <div style={{ ...BC, fontSize: 16, fontWeight: 700, color: "#fff" }}>{s.val}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "rgba(43,138,110,0.08)", border: `1px solid ${TEAL}33`, padding: "12px 16px", borderRadius: "0.15rem", display: "flex", alignItems: "center", gap: 10 }}>
          <CheckCircle size={14} color={TEAL} />
          <div>
            <span style={{ ...BC, fontSize: 10, fontWeight: 700, color: TEAL, letterSpacing: "0.08em" }}>PROTOCOL MATCH FOUND</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginLeft: 10 }}>Protocol #14 — Financial Services Ransomware Response</span>
          </div>
        </div>
      </Card>

      {/* Signal feed */}
      <Card style={{ padding: "14px 20px" }}>
        <Label>Continuous Monitoring Feed</Label>
        {[
          { t: "4:22:51 AM", msg: "Encryption signature detected — trading node 7A", hi: false },
          { t: "4:23:01 AM", msg: "Pattern confirmed — nodes 7B and 7C affected", hi: false },
          { t: "4:23:07 AM", msg: "Threshold exceeded · Readiness Protocol matched · Escalating", hi: true },
        ].map((e, i) => (
          <div key={i} style={{ display: "flex", gap: 12, padding: "7px 0", borderBottom: i < 2 ? `1px solid ${BORDER}` : "none", alignItems: "flex-start" }}>
            <span style={{ ...BC, fontSize: 10, color: MUTED, flexShrink: 0, paddingTop: 2, width: 72 }}>{e.t}</span>
            <span style={{ fontSize: 12, color: e.hi ? GOLD : "rgba(255,255,255,0.6)", fontWeight: e.hi ? 600 : 400 }}>{e.msg}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

function PanelProtocol() {
  const phases = ["IMMEDIATE", "SECONDARY", "CONTAINMENT", "RECOVERY", "CLOSE-OUT"];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Protocol header */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <Badge color={TEAL} bg={`${TEAL}18`}>Pre-Staged</Badge>
              <Badge color={GOLD} bg={`${GOLD}15`}>Protocol #14</Badge>
            </div>
            <div style={{ ...CG, fontSize: 22, fontWeight: 600, color: "#fff", marginBottom: 4 }}>Financial Services Ransomware Response</div>
            <div style={{ fontSize: 12, color: MUTED }}>Risk & Resilience · Cyber · Regulatory</div>
          </div>
          <Shield size={28} color={TEAL} style={{ opacity: 0.7, flexShrink: 0 }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, paddingTop: 16, borderTop: `1px solid ${BORDER}` }}>
          {[
            { label: "Tasks", val: "22" },
            { label: "Phases", val: "5" },
            { label: "Stakeholders", val: "4" },
            { label: "Avg. Completion", val: "11m 12s" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ ...CG, fontSize: 24, fontWeight: 700, color: GOLD }}>{s.val}</div>
              <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* "The key insight" callout */}
      <div style={{ background: `${TEAL}10`, border: `1px solid ${TEAL}40`, padding: "14px 20px", borderRadius: "0.15rem" }}>
        <div style={{ ...BC, fontSize: 10, fontWeight: 700, color: TEAL, letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 6 }}>The Difference</div>
        <div style={{ ...CG, fontSize: 16, color: "#fff", lineHeight: 1.5 }}>This protocol wasn't built when the signal fired. It was designed <strong style={{ color: GOLD }}>8 months ago</strong> — tasks written, stakeholders assigned, decision gates mapped. The preparation was the response.</div>
      </div>

      {/* Phase timeline */}
      <Card>
        <Label>Execution Phases</Label>
        <div style={{ display: "flex", gap: 0 }}>
          {phases.map((ph, i) => (
            <div key={ph} style={{ flex: 1, textAlign: "center", padding: "10px 6px", background: i === 0 ? `${TEAL}18` : "transparent", border: `1px solid ${i === 0 ? TEAL + "40" : BORDER}`, marginLeft: i > 0 ? -1 : 0, position: "relative" }}>
              <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: i === 0 ? TEAL : MUTED, letterSpacing: "0.08em", textTransform: "uppercase" as const }}>{ph}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 3 }}>{[5, 5, 4, 5, 3][i]} tasks</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
          <div style={{ ...BC, fontSize: 10, color: MUTED }}>Created: Oct 14, 2025</div>
          <span style={{ color: BORDER }}>·</span>
          <div style={{ ...BC, fontSize: 10, color: MUTED }}>Last practiced: May 3, 2026</div>
          <span style={{ color: BORDER }}>·</span>
          <div style={{ ...BC, fontSize: 10, color: TEAL, fontWeight: 600 }}>3 activations · Avg 11m 12s</div>
        </div>
      </Card>
    </div>
  );
}

function PanelWarRoom() {
  const statusConfig = {
    acknowledged: { color: TEAL, label: "Acknowledged" },
    notified: { color: GOLD, label: "Notified" },
    pending: { color: "rgba(255,255,255,0.3)", label: "Pending" },
  };
  const taskConfig = {
    complete: { color: TEAL, icon: <CheckCircle size={14} />, label: "Complete" },
    active: { color: GOLD, icon: <Loader2 size={14} />, label: "In Progress" },
    staged: { color: "rgba(255,255,255,0.3)", icon: <Circle size={14} />, label: "Staged" },
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Status bar */}
      <div style={{ background: `${TEAL}12`, border: `1px solid ${TEAL}35`, padding: "12px 20px", borderRadius: "0.15rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <StatusDot color={TEAL} pulse />
          <span style={{ ...BC, fontSize: 11, fontWeight: 700, color: TEAL, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>Execution In Progress</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Clock size={14} color={GOLD} />
          <span style={{ ...CG, fontSize: 22, fontWeight: 700, color: GOLD }}>8:22</span>
          <span style={{ ...BC, fontSize: 10, color: MUTED }}>ELAPSED</span>
        </div>
      </div>

      {/* Stakeholders */}
      <Card style={{ padding: "16px 20px" }}>
        <Label>Stakeholder Status</Label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {STAKEHOLDERS.map(s => {
            const cfg = statusConfig[s.status];
            return (
              <div key={s.role} style={{ padding: "12px 10px", background: "rgba(255,255,255,0.02)", border: `1px solid ${BORDER}`, borderRadius: "0.15rem", textAlign: "center" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: NAVY_MID, border: `2px solid ${cfg.color}50`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                  <span style={{ ...BC, fontSize: 11, fontWeight: 700, color: "#fff" }}>{s.initials}</span>
                </div>
                <div style={{ ...BC, fontSize: 10, fontWeight: 700, color: "#fff", letterSpacing: "0.04em", marginBottom: 4 }}>{s.role}</div>
                <div style={{ ...BC, fontSize: 9, color: cfg.color, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const }}>{cfg.label}</div>
                <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>{s.time}</div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Task list */}
      <Card style={{ padding: "16px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <Label>Phase 1 — Immediate Actions</Label>
          <span style={{ ...BC, fontSize: 10, color: MUTED }}>5 of 22 tasks · 2 complete · 2 active</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {TASKS.map((t, i) => {
            const cfg = taskConfig[t.status];
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < TASKS.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                <span style={{ color: cfg.color, flexShrink: 0, width: 16 }}>{cfg.icon}</span>
                <span style={{ fontSize: 12, color: t.status === "staged" ? MUTED : "#fff", flex: 1, textDecoration: t.status === "complete" ? "line-through" : "none" }}>{t.name}</span>
                <span style={{ ...BC, fontSize: 10, color: MUTED, flexShrink: 0, width: 80, textAlign: "right" as const }}>{t.owner}</span>
                <Badge color={cfg.color} bg={`${cfg.color}12`}>{cfg.label}</Badge>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function PanelAuthorize({ onAuthorize, authorizing }: { onAuthorize: () => void; authorizing: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Elapsed + context */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0" }}>
        <div>
          <div style={{ ...BC, fontSize: 10, fontWeight: 700, color: GOLD, letterSpacing: "0.14em", textTransform: "uppercase" as const, marginBottom: 2 }}>Executive Authorization Required</div>
          <div style={{ fontSize: 12, color: MUTED }}>Elapsed: <strong style={{ color: GOLD }}>9:47</strong> · Protocol #14 — Financial Services Ransomware Response</div>
        </div>
        <div style={{ ...BC, fontSize: 11, fontWeight: 700, color: "#fff" }}>Meridian Financial Group</div>
      </div>

      {/* Precedent panel */}
      <Card>
        <Label>Authorization Precedents — Same Protocol</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {PRECEDENTS.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "rgba(255,255,255,0.02)", border: `1px solid ${BORDER}`, borderRadius: "0.15rem" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: NAVY_MID, border: `1px solid ${TEAL}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ ...BC, fontSize: 10, fontWeight: 700, color: TEAL }}>{p.exec}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: "#fff", fontWeight: 500 }}>{p.choice}</div>
                <div style={{ fontSize: 11, color: MUTED, marginTop: 1 }}>{p.date}</div>
              </div>
              <Badge color={TEAL} bg={`${TEAL}15`}>{p.outcome}</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Pre-flight checks */}
      <Card>
        <Label>Pre-Flight Authorization Checks</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {PREFLIGHT.map((q, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: `${TEAL}08`, border: `1px solid ${TEAL}25`, borderRadius: "0.15rem" }}>
              <CheckCircle size={16} color={TEAL} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>{q}</span>
              <span style={{ ...BC, fontSize: 10, fontWeight: 700, color: TEAL, marginLeft: "auto", flexShrink: 0 }}>CONFIRMED</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Authorize button */}
      <button
        onClick={onAuthorize}
        disabled={authorizing}
        style={{
          width: "100%", padding: "20px 32px",
          background: authorizing ? TEAL + "88" : TEAL,
          border: "none", cursor: authorizing ? "default" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
          transition: "opacity 0.2s", borderRadius: "0.15rem",
        }}
      >
        {authorizing ? (
          <>
            <Loader2 size={18} color="#fff" style={{ animation: "spin 1s linear infinite" }} />
            <span style={{ ...BC, fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: "0.12em", textTransform: "uppercase" as const }}>Recording Authorization…</span>
          </>
        ) : (
          <>
            <Lock size={18} color="#fff" />
            <span style={{ ...BC, fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: "0.12em", textTransform: "uppercase" as const }}>Authorize and Deploy</span>
            <ArrowRight size={18} color="#fff" />
          </>
        )}
      </button>
      <div style={{ fontSize: 11, color: MUTED, textAlign: "center" as const, marginTop: -4 }}>
        This authorization will be recorded in the decision audit trail.
      </div>
    </div>
  );
}

function PanelComplete() {
  const rows = [
    { metric: "Time to Full Response", readiness: "11 min 43 sec", traditional: "4.2 days (avg)" },
    { metric: "Mobilization", readiness: "Pre-staged — no meetings", traditional: "Committee alignment required" },
    { metric: "Stakeholder Notification", readiness: "Automatic — 90 seconds", traditional: "Manual cascade (hours)" },
    { metric: "Executive Decision", readiness: "1 authorization · 9:47 elapsed", traditional: "After 2–3 day alignment cycle" },
    { metric: "Financial Exposure Window", readiness: "11:43", traditional: "4+ days @ $180K/hr = $17.3M" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Result card */}
      <Card style={{ textAlign: "center" as const, padding: "28px 24px" }}>
        <Badge color={TEAL} bg={`${TEAL}15`}>OPTIMIZATION</Badge>
        <div style={{ ...CG, fontSize: 56, fontWeight: 700, color: GOLD, margin: "12px 0 4px", lineHeight: 1 }}>11:43</div>
        <div style={{ ...BC, fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: "0.14em", textTransform: "uppercase" as const }}>Minutes · Seconds · Full Response Complete</div>
        <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 32 }}>
          {[
            { val: "22", label: "Tasks Closed" },
            { val: "4", label: "Executives Involved" },
            { val: "1", label: "Authorization Required" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: "#fff" }}>{s.val}</div>
              <div style={{ ...BC, fontSize: 10, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Comparison table */}
      <Card style={{ padding: "16px 20px" }}>
        <Label>This Activation vs. Traditional Response</Label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "0 16px" }}>
          {/* Header */}
          <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" as const, padding: "4px 0 10px" }}>Metric</div>
          <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: TEAL, letterSpacing: "0.1em", textTransform: "uppercase" as const, padding: "4px 0 10px", textAlign: "right" as const }}>Readiness OS</div>
          <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" as const, padding: "4px 0 10px", textAlign: "right" as const }}>Traditional</div>
          {rows.map((r, i) => (
            <>
              <div key={`m${i}`} style={{ fontSize: 11, color: MUTED, padding: "8px 0", borderTop: `1px solid ${BORDER}` }}>{r.metric}</div>
              <div key={`r${i}`} style={{ fontSize: 11, color: TEAL, fontWeight: 600, padding: "8px 0", borderTop: `1px solid ${BORDER}`, textAlign: "right" as const, whiteSpace: "nowrap" as const }}>{r.readiness}</div>
              <div key={`t${i}`} style={{ fontSize: 11, color: MUTED, padding: "8px 0", borderTop: `1px solid ${BORDER}`, textAlign: "right" as const, whiteSpace: "nowrap" as const }}>{r.traditional}</div>
            </>
          ))}
        </div>
      </Card>

      {/* 3600x callout */}
      <div style={{ background: `${GOLD}10`, border: `1px solid ${GOLD}35`, padding: "16px 20px", borderRadius: "0.15rem", display: "flex", alignItems: "center", gap: 16 }}>
        <TrendingUp size={24} color={GOLD} style={{ flexShrink: 0 }} />
        <div>
          <div style={{ ...BC, fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 2 }}>3,600× Execution Head Start</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>30 days of traditional mobilization compressed to 12 minutes. This is what it looks like in practice.</div>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function DemoExperience() {
  const [step, setStep] = useState(0);
  const [authorizing, setAuthorizing] = useState(false);

  const handleAuthorize = () => {
    setAuthorizing(true);
    setTimeout(() => { setStep(4); setAuthorizing(false); }, 1400);
  };

  const canContinue = step < 4 && !(step === 3);
  const panels = [
    <PanelSignal />,
    <PanelProtocol />,
    <PanelWarRoom />,
    <PanelAuthorize onAuthorize={handleAuthorize} authorizing={authorizing} />,
    <PanelComplete />,
  ];

  return (
    <div style={{ minHeight: "100vh", background: NAVY, display: "flex", flexDirection: "column" }}>
      {/* ─── Inject keyframes ─── */}
      <style>{`
        @keyframes ping { 0% { transform: scale(1); opacity: 0.4; } 75%, 100% { transform: scale(2); opacity: 0; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {/* ─── Top bar ─── */}
      <div style={{ background: "#06091e", borderBottom: `1px solid ${BORDER}`, padding: "0 32px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <VaughnMartinLogo size={28} variant="icon-only" />
          <div style={{ width: 1, height: 24, background: BORDER }} />
          <div>
            <span style={{ ...BC, fontSize: 10, fontWeight: 700, color: TEAL, letterSpacing: "0.14em", textTransform: "uppercase" as const }}>Live Platform Demo</span>
            <span style={{ ...BC, fontSize: 12, color: "rgba(255,255,255,0.5)", marginLeft: 12 }}>Meridian Financial Group · Ransomware Response · Protocol #14</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {ELAPSED[step] !== "—" && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Clock size={13} color={GOLD} />
              <span style={{ ...BC, fontSize: 13, fontWeight: 700, color: GOLD }}>{ELAPSED[step]}</span>
              <span style={{ ...BC, fontSize: 10, color: MUTED }}>ELAPSED</span>
            </div>
          )}
          <Link href="/request-access" style={{ ...BC, background: GOLD, color: NAVY, fontSize: 11, fontWeight: 700, padding: "8px 18px", textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase" as const, borderRadius: "0.15rem", whiteSpace: "nowrap" as const }}>
            Apply for Access
          </Link>
        </div>
      </div>

      {/* ─── Main content ─── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left sidebar */}
        <div style={{ width: 300, background: "#060b20", borderRight: `1px solid ${BORDER}`, padding: "28px 24px", display: "flex", flexDirection: "column", gap: 0, flexShrink: 0, overflowY: "auto" as const }}>
          {/* Step list */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: MUTED, letterSpacing: "0.14em", textTransform: "uppercase" as const, marginBottom: 16 }}>Platform Journey</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {STEP_DEFS.map((s, i) => {
                const isActive = i === step;
                const isDone = i < step;
                return (
                  <div
                    key={i}
                    onClick={() => { if (isDone) setStep(i); }}
                    style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 10px", cursor: isDone ? "pointer" : "default", background: isActive ? `${GOLD}0c` : "transparent", borderLeft: `2px solid ${isActive ? GOLD : isDone ? TEAL + "60" : BORDER}`, marginBottom: 2 }}
                  >
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: isActive ? GOLD : isDone ? TEAL : "transparent", border: `1px solid ${isActive ? GOLD : isDone ? TEAL : BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                      {isDone ? (
                        <CheckCircle size={11} color="#fff" />
                      ) : (
                        <span style={{ ...BC, fontSize: 9, fontWeight: 700, color: isActive ? NAVY : MUTED }}>{i + 1}</span>
                      )}
                    </div>
                    <div>
                      <div style={{ ...BC, fontSize: 12, fontWeight: 700, color: isActive ? GOLD : isDone ? "#fff" : MUTED, letterSpacing: "0.04em" }}>{s.label}</div>
                      <div style={{ fontSize: 10, color: isActive ? "rgba(255,255,255,0.5)" : MUTED + "80", marginTop: 2 }}>{s.tag}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Narration */}
          <div style={{ flex: 1 }}>
            <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: MUTED, letterSpacing: "0.14em", textTransform: "uppercase" as const, marginBottom: 12 }}>What's Happening</div>
            <div style={{ ...CG, fontSize: 17, fontWeight: 600, color: "#fff", lineHeight: 1.4, marginBottom: 12 }}>{NARRATION[step].headline}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 16 }}>{NARRATION[step].body}</div>
            <div style={{ background: `${GOLD}0d`, border: `1px solid ${GOLD}30`, padding: "10px 14px", borderRadius: "0.15rem" }}>
              <div style={{ fontSize: 11, color: GOLD, fontStyle: "italic", lineHeight: 1.5 }}>"{NARRATION[step].callout}"</div>
            </div>
          </div>

          {/* Scenario context */}
          <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${BORDER}` }}>
            <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: MUTED, letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 8 }}>Scenario</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
              Trading systems compromised at 4:23 AM. SWIFT connectivity at risk. Market open in 4 hours.
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto" as const }}>
          {/* Step header */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ ...BC, fontSize: 10, fontWeight: 700, color: GOLD, letterSpacing: "0.14em", textTransform: "uppercase" as const }}>Step {step + 1} of 5</div>
            <div style={{ width: 1, height: 14, background: BORDER }} />
            <div style={{ ...BC, fontSize: 13, fontWeight: 700, color: "#fff" }}>{STEP_DEFS[step].label}</div>
            <div style={{ flex: 1 }} />
            {/* Progress bar */}
            <div style={{ width: 120, height: 4, background: BORDER, borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${((step + 1) / 5) * 100}%`, background: GOLD, borderRadius: 2, transition: "width 0.4s ease" }} />
            </div>
          </div>

          {/* Step content */}
          {panels[step]}

          {/* Bottom nav */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 28, paddingTop: 20, borderTop: `1px solid ${BORDER}` }}>
            <button
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
              style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", border: `1px solid ${BORDER}`, padding: "12px 20px", color: step === 0 ? MUTED : "#fff", cursor: step === 0 ? "default" : "pointer", ...BC, fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, borderRadius: "0.15rem" }}
            >
              <ChevronLeft size={14} /> Back
            </button>

            {step === 4 ? (
              <Link
                href="/request-access"
                style={{ display: "flex", alignItems: "center", gap: 10, background: GOLD, color: NAVY, padding: "14px 32px", textDecoration: "none", ...BC, fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, borderRadius: "0.15rem", whiteSpace: "nowrap" as const }}
              >
                Apply for Founding Partner Access <ArrowRight size={16} />
              </Link>
            ) : step === 3 ? (
              <div style={{ fontSize: 12, color: MUTED, fontStyle: "italic" }}>Click "Authorize and Deploy" above to continue</div>
            ) : (
              <button
                onClick={() => setStep(s => Math.min(4, s + 1))}
                style={{ display: "flex", alignItems: "center", gap: 10, background: TEAL, border: "none", padding: "14px 28px", color: "#fff", cursor: "pointer", ...BC, fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, borderRadius: "0.15rem" }}
              >
                Continue <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
