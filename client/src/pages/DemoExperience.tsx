import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight, ChevronLeft, Shield, Zap, Clock, Users, Database,
  CheckCircle, Lock, Circle, Loader2, TrendingUp, Search,
  BarChart2, Bell, BookOpen, Activity, ChevronRight, Settings,
  RefreshCw, Star, AlertTriangle, Target, PlusCircle,
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

// ─── Step definitions ────────────────────────────────────────────────────────
const PHASES = [
  {
    label: "PREPARATION",
    color: TEAL,
    steps: [0, 1, 2],
    desc: "Normal operations",
  },
  {
    label: "RESPONSE",
    color: GOLD,
    steps: [3, 4, 5, 6],
    desc: "4:23 AM — trigger fires",
  },
  {
    label: "ADVANCE",
    color: "#A78BFA",
    steps: [7, 8],
    desc: "After the activation",
  },
];

const STEP_DEFS = [
  { label: "Command Center", tag: "Monday, 6:47 AM", phase: 0 },
  { label: "Trigger Portfolio", tag: "47 active · 231 available", phase: 0 },
  { label: "Protocol Library", tag: "180 pre-staged responses", phase: 0 },
  { label: "Signal Detected", tag: "4:23 AM — escalating", phase: 1 },
  { label: "Protocol Staged", tag: "Pre-built 8 months ago", phase: 1 },
  { label: "War Room Active", tag: "8:22 elapsed · 22 tasks", phase: 1 },
  { label: "Executive Authorizes", tag: "9:47 elapsed · 1 decision", phase: 1 },
  { label: "Response Complete", tag: "11:43 · OPTIMIZATION", phase: 2 },
  { label: "System Learns", tag: "Protocol #14 updated", phase: 2 },
];

const ELAPSED = ["—", "—", "—", "—", "—", "8:22", "9:47", "11:43", "11:43"];

// ─── Narration ────────────────────────────────────────────────────────────────
const NARRATION = [
  {
    headline: "This is what Monday morning looks like.",
    body: "Your Command Center shows the state of your organization's readiness in real time. Three signals detected today, all low-risk. 180 protocols standing by. No meetings required to know you're prepared.",
    callout: "Preparation is ongoing, not reactive.",
  },
  {
    headline: "You choose what to watch. The system does the watching.",
    body: "From 231 available trigger patterns, your organization has activated 47. Each trigger is mapped to a Readiness Protocol. When a threshold is exceeded, the right response deploys — the connection is already made.",
    callout: "Triggers aren't created during a crisis. They're configured before one.",
  },
  {
    headline: "The response exists before the situation does.",
    body: "180 Readiness Protocols span every strategic domain your organization will face. Each one is complete: tasks written, stakeholders assigned, decision gates mapped. You browse them like a library, not a to-do list.",
    callout: "\"The response is ready before the trigger fires.\"",
  },
  {
    headline: "The system detects it before you do.",
    body: "At 4:23 AM, encryption patterns cascade across three trading nodes. No one was paged. No committee assembled. The monitoring matched the pattern and surfaced Protocol #14 — before a single human knew it happened.",
    callout: "231 trigger patterns monitored continuously.",
  },
  {
    headline: "The response existed before this moment.",
    body: "Protocol #14 was designed 8 months ago. Every task written. Every stakeholder identified. Every decision gate mapped. When the signal fired, nothing had to be built — only activated.",
    callout: "8 months of preparation. 12 minutes of execution.",
  },
  {
    headline: "Execution begins. No meeting required.",
    body: "Four executives notified in under 90 seconds. Twenty-two tasks assigned across five departments. The first immediate actions are already in motion. This is minute 8. In a traditional response, you'd still be assembling the call.",
    callout: "Industry average mobilization time at this point: Day 2.",
  },
  {
    headline: "One executive. One decision.",
    body: "The preparation compresses the mobilization cycle — but the decision remains human. You see how peer executives decided in identical situations. Three pre-flight questions confirm readiness. Then you authorize.",
    callout: "No Readiness Protocol activates without executive sign-off.",
  },
  {
    headline: "11 minutes, 43 seconds.",
    body: "Not 30 days. The exposure window closes. The outcome is classified. The debrief is auto-generated. Every stakeholder receives a close-out summary. One activation, completely documented.",
    callout: "3,600× Execution Head Start vs. traditional mobilization.",
  },
  {
    headline: "Every activation makes the next one faster.",
    body: "The ADVANCE loop closes automatically. Protocol #14 is updated with what was learned: a task reordered, a new standard step added, a faster sequence proven. The platform gets smarter — and that institutional knowledge is yours, not anyone else's.",
    callout: "The moat grows with every activation.",
  },
];

// ─── Scenario data ────────────────────────────────────────────────────────────
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

const TRIGGER_PORTFOLIO = [
  {
    priority: "HIGH" as const,
    color: "#EF4444",
    items: [
      { name: "Financial Infrastructure Compromise", domain: "Risk & Resilience", protocol: "#14", active: true },
      { name: "Activist Investor 13D Filing", domain: "Risk & Resilience", protocol: "#7" },
      { name: "Regulatory Investigation Opened", domain: "Risk & Resilience", protocol: "#29" },
      { name: "Competitor Files Chapter 11", domain: "Growth & Positioning", protocol: "#31" },
    ],
  },
  {
    priority: "MEDIUM" as const,
    color: GOLD,
    items: [
      { name: "Supply Chain Tier-1 Disruption", domain: "Risk & Resilience", protocol: "#52" },
      { name: "Key Executive Departure", domain: "Transformation", protocol: "#88" },
      { name: "Data Breach Notification", domain: "Risk & Resilience", protocol: "#63" },
      { name: "Acquisition Target Surfaces", domain: "Growth & Positioning", protocol: "#58" },
    ],
  },
  {
    priority: "MONITORING" as const,
    color: TEAL,
    items: [
      { name: "Analyst Rating Downgrade", domain: "Growth & Positioning", protocol: "#121" },
      { name: "Media Crisis Signal", domain: "Risk & Resilience", protocol: "#137" },
      { name: "Regulatory Comment Period Opens", domain: "Risk & Resilience", protocol: "#44" },
    ],
  },
];

const PROTOCOL_DOMAINS = [
  {
    name: "GROWTH & POSITIONING",
    color: GOLD,
    count: 58,
    protocols: [
      { id: "#31", name: "Competitor Displacement Sprint", tag: "72-hour window" },
      { id: "#58", name: "M&A Rapid Response", tag: "LOI in 48 hrs" },
      { id: "#89", name: "Go-to-Market Acceleration", tag: "Launch sprint" },
      { id: "#104", name: "IPO Readiness Protocol", tag: "Window defense" },
    ],
  },
  {
    name: "RISK & RESILIENCE",
    color: "#EF4444",
    count: 82,
    protocols: [
      { id: "#7", name: "Activist Investor Response", tag: "Board defense" },
      { id: "#14", name: "Financial Services Ransomware", tag: "← Active in demo", highlight: true },
      { id: "#29", name: "DOJ/Regulatory Investigation", tag: "Day-1 response" },
      { id: "#52", name: "Supply Chain Collapse", tag: "Tier-1 failure" },
    ],
  },
  {
    name: "TRANSFORMATION",
    color: "#A78BFA",
    count: 40,
    protocols: [
      { id: "#112", name: "Workforce Transformation", tag: "6,720 roles" },
      { id: "#127", name: "Digital Infrastructure Migration", tag: "Zero-downtime" },
      { id: "#88", name: "Leadership Transition Protocol", tag: "Succession" },
      { id: "#156", name: "Post-Merger Integration", tag: "Day-100 plan" },
    ],
  },
];

const ADVANCE_UPDATES = [
  { type: "Sequence", change: "SWIFT alternate routing moved to Task 2 (was Task 6)", impact: "−3 min avg" },
  { type: "New Task", change: "Forensic chain-of-custody added as IMMEDIATE standard", impact: "Compliance" },
  { type: "Threshold", change: "Escalation confidence lowered from 94% to 88%", impact: "Earlier detection" },
];

// ─── Shared UI helpers ────────────────────────────────────────────────────────
function StatusDot({ color, pulse }: { color: string; pulse?: boolean }) {
  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 10, height: 10, flexShrink: 0 }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "block" }} />
      {pulse && <span style={{ position: "absolute", width: 16, height: 16, borderRadius: "50%", border: `1px solid ${color}`, opacity: 0.4, animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite" }} />}
    </span>
  );
}
function Pill({ children, color, bg }: { children: React.ReactNode; color: string; bg: string }) {
  return <span style={{ ...BC, display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", background: bg, border: `1px solid ${color}33`, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color, borderRadius: "0.15rem", whiteSpace: "nowrap" as const }}>{children}</span>;
}
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ background: NAVY_CARD, border: `1px solid ${BORDER}`, padding: "18px 22px", borderRadius: "0.15rem", ...style }}>{children}</div>;
}
function Label({ children, color }: { children: React.ReactNode; color?: string }) {
  return <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: color || GOLD, marginBottom: 8 }}>{children}</div>;
}

// ─── Step panels ──────────────────────────────────────────────────────────────

function PanelCommandCenter() {
  const kpis = [
    { val: "87", unit: "%", label: "Readiness Score", color: TEAL, sub: "+2.4% vs last week" },
    { val: "3", unit: "", label: "Signals Today", color: GOLD, sub: "All LOW risk" },
    { val: "180", unit: "", label: "Protocols Ready", color: "#A78BFA", sub: "Pre-staged" },
    { val: "11:47", unit: "", label: "Avg Response", color: "#fff", sub: "Below 12-min target" },
  ];
  const domains = [
    { name: "Growth & Positioning", status: "MONITORING", color: TEAL, signals: 1 },
    { name: "Risk & Resilience", status: "MONITORING", color: TEAL, signals: 2 },
    { name: "Transformation", status: "QUIET", color: MUTED, signals: 0 },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: `${TEAL}10`, border: `1px solid ${TEAL}30`, padding: "10px 18px", borderRadius: "0.15rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <StatusDot color={TEAL} pulse />
          <span style={{ ...BC, fontSize: 11, fontWeight: 700, color: TEAL, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>System Active · Continuous Monitoring</span>
        </div>
        <span style={{ ...BC, fontSize: 11, color: MUTED }}>Monday · 6:47 AM</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        {kpis.map(k => (
          <Card key={k.label} style={{ padding: "14px 16px", textAlign: "center" as const }}>
            <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: k.color, lineHeight: 1 }}>{k.val}<span style={{ fontSize: 16 }}>{k.unit}</span></div>
            <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" as const, margin: "6px 0 4px" }}>{k.label}</div>
            <div style={{ fontSize: 10, color: MUTED }}>{k.sub}</div>
          </Card>
        ))}
      </div>

      <Card>
        <Label>Domain Status</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {domains.map(d => (
            <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "rgba(255,255,255,0.02)", border: `1px solid ${BORDER}`, borderRadius: "0.15rem" }}>
              <StatusDot color={d.color} pulse={d.status === "MONITORING"} />
              <span style={{ fontSize: 12, color: "#fff", flex: 1 }}>{d.name}</span>
              <Pill color={d.color} bg={`${d.color}12`}>{d.status}</Pill>
              <span style={{ ...BC, fontSize: 10, color: MUTED }}>{d.signals} signal{d.signals !== 1 ? "s" : ""}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ padding: "14px 22px" }}>
        <Label>Live Signal Feed</Label>
        {[
          { t: "6:31 AM", msg: "Market Dynamics · ArXiv research velocity — new AI publications surge", risk: "LOW" },
          { t: "4:52 AM", msg: "Regulatory · SEC comment period extended for fintech rule 17a-4", risk: "LOW" },
          { t: "2:14 AM", msg: "Competitive · Salesforce pricing adjustment announced — mid-market", risk: "LOW" },
        ].map((e, i) => (
          <div key={i} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: i < 2 ? `1px solid ${BORDER}` : "none", alignItems: "flex-start" }}>
            <span style={{ ...BC, fontSize: 10, color: MUTED, flexShrink: 0, width: 60, paddingTop: 1 }}>{e.t}</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", flex: 1, lineHeight: 1.5 }}>{e.msg}</span>
            <Pill color={TEAL} bg={`${TEAL}10`}>{e.risk}</Pill>
          </div>
        ))}
      </Card>
    </div>
  );
}

function PanelTriggerPortfolio() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <Label>Your Trigger Portfolio</Label>
            <div style={{ fontSize: 12, color: MUTED }}>47 active monitors · 231 available trigger patterns</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}`, borderRadius: "0.15rem" }}>
              <Search size={11} color={MUTED.toString()} />
              <span style={{ ...BC, fontSize: 10, color: MUTED }}>Search 231 patterns…</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: `${TEAL}18`, border: `1px solid ${TEAL}40`, borderRadius: "0.15rem", cursor: "pointer" }}>
              <PlusCircle size={11} color={TEAL} />
              <span style={{ ...BC, fontSize: 10, fontWeight: 700, color: TEAL }}>Add Trigger</span>
            </div>
          </div>
        </div>

        {TRIGGER_PORTFOLIO.map(group => (
          <div key={group.priority} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <StatusDot color={group.color} />
              <span style={{ ...BC, fontSize: 10, fontWeight: 700, color: group.color, letterSpacing: "0.12em", textTransform: "uppercase" as const }}>{group.priority} PRIORITY</span>
              <span style={{ ...BC, fontSize: 10, color: MUTED }}>· {group.items.length} triggers</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {group.items.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 14px", background: item.active ? `${group.color}08` : "rgba(255,255,255,0.02)", border: `1px solid ${item.active ? group.color + "40" : BORDER}`, borderRadius: "0.15rem" }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: group.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: item.active ? "#fff" : "rgba(255,255,255,0.7)", flex: 1, fontWeight: item.active ? 500 : 400 }}>{item.name}</span>
                  <span style={{ fontSize: 10, color: MUTED, flexShrink: 0 }}>{item.domain}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 8px", background: NAVY_MID, border: `1px solid ${BORDER}`, borderRadius: "0.15rem" }}>
                    <ArrowRight size={10} color={MUTED.toString()} />
                    <span style={{ ...BC, fontSize: 10, fontWeight: 700, color: item.active ? group.color : MUTED }}>Protocol {item.protocol}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Card>

      <div style={{ background: `${GOLD}0d`, border: `1px solid ${GOLD}30`, padding: "12px 18px", borderRadius: "0.15rem", display: "flex", gap: 12, alignItems: "flex-start" }}>
        <Settings size={16} color={GOLD} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ ...BC, fontSize: 10, fontWeight: 700, color: GOLD, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 4 }}>How Triggers Are Configured</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>Each trigger has a <strong style={{ color: "#fff" }}>threshold</strong> (how many signal confirmations before escalating), a <strong style={{ color: "#fff" }}>mapped protocol</strong> (which response deploys), and a <strong style={{ color: "#fff" }}>priority tier</strong> (how urgently the executive is notified). You configure once. The system monitors continuously.</div>
        </div>
      </div>
    </div>
  );
}

function PanelProtocolLibrary() {
  const [activeDomain, setActiveDomain] = useState(0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {PROTOCOL_DOMAINS.map(d => (
          <Card key={d.name} style={{ padding: "14px 16px", cursor: "pointer", border: `1px solid ${PROTOCOL_DOMAINS.indexOf(d) === activeDomain ? d.color + "60" : BORDER}`, background: PROTOCOL_DOMAINS.indexOf(d) === activeDomain ? `${d.color}08` : NAVY_CARD }} onClick={() => setActiveDomain(PROTOCOL_DOMAINS.indexOf(d))}>
            <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: d.color, letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 8 }}>{d.name}</div>
            <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: "#fff" }}>{d.count}</div>
            <div style={{ ...BC, fontSize: 9, color: MUTED, marginTop: 2 }}>Protocols ready</div>
          </Card>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
        <Search size={13} color={MUTED.toString()} />
        <span style={{ fontSize: 12, color: MUTED }}>Search 180 protocols… try "supply chain," "activist," "ransomware," "IPO"</span>
      </div>

      <Card>
        <Label color={PROTOCOL_DOMAINS[activeDomain].color}>{PROTOCOL_DOMAINS[activeDomain].name} — Protocols</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {PROTOCOL_DOMAINS[activeDomain].protocols.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", background: p.highlight ? `${GOLD}0c` : "rgba(255,255,255,0.02)", border: `1px solid ${p.highlight ? GOLD + "50" : BORDER}`, borderRadius: "0.15rem" }}>
              <span style={{ ...BC, fontSize: 11, fontWeight: 700, color: p.highlight ? GOLD : MUTED, flexShrink: 0, width: 36 }}>{p.id}</span>
              <span style={{ fontSize: 12, color: p.highlight ? "#fff" : "rgba(255,255,255,0.75)", flex: 1, fontWeight: p.highlight ? 500 : 400 }}>{p.name}</span>
              <Pill color={p.highlight ? GOLD : TEAL} bg={p.highlight ? `${GOLD}15` : `${TEAL}12`}>{p.tag}</Pill>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: MUTED }}>Showing 4 of {PROTOCOL_DOMAINS[activeDomain].count} protocols in this domain</span>
          <ChevronRight size={12} color={MUTED.toString()} />
          <span style={{ ...BC, fontSize: 10, fontWeight: 600, color: TEAL, cursor: "pointer" }}>View all →</span>
        </div>
      </Card>

      <div style={{ background: `${TEAL}10`, border: `1px solid ${TEAL}30`, padding: "12px 18px", borderRadius: "0.15rem", display: "flex", gap: 10, alignItems: "center" }}>
        <BookOpen size={15} color={TEAL} style={{ flexShrink: 0 }} />
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>Every protocol is <strong style={{ color: "#fff" }}>complete before it's needed</strong> — tasks, owners, decision gates, and stakeholder lists. When a trigger fires, you activate, not build.</span>
      </div>
    </div>
  );
}

function PanelSignal() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.3)", padding: "14px 20px", borderRadius: "0.15rem", display: "flex", alignItems: "center", gap: 12 }}>
        <StatusDot color="#EF4444" pulse />
        <div style={{ flex: 1 }}>
          <div style={{ ...BC, fontSize: 11, fontWeight: 700, color: "#EF4444", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>HIGH RISK — SIGNAL THRESHOLD EXCEEDED</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>3 of 3 confirmation patterns matched · Trigger portfolio match: Financial Infrastructure Compromise</div>
        </div>
        <div style={{ ...BC, fontSize: 22, fontWeight: 700, color: "#EF4444" }}>94</div>
      </div>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <Label>Trigger Pattern Matched</Label>
            <div style={{ ...CG, fontSize: 20, fontWeight: 600, color: "#fff", marginBottom: 4 }}>Financial Infrastructure Compromise</div>
            <div style={{ fontSize: 12, color: MUTED }}>Source: Security Operations Center · Node Cluster 7</div>
          </div>
          <Pill color="#EF4444" bg="rgba(220,38,38,0.1)">High Risk</Pill>
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
        <div style={{ background: `${TEAL}08`, border: `1px solid ${TEAL}33`, padding: "12px 16px", borderRadius: "0.15rem", display: "flex", alignItems: "center", gap: 10 }}>
          <CheckCircle size={14} color={TEAL} />
          <div>
            <span style={{ ...BC, fontSize: 10, fontWeight: 700, color: TEAL, letterSpacing: "0.08em" }}>PROTOCOL MATCH</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginLeft: 10 }}>Protocol #14 — Financial Services Ransomware Response · Pre-staged</span>
          </div>
        </div>
      </Card>

      <Card style={{ padding: "14px 20px" }}>
        <Label>Signal Feed — Escalation Sequence</Label>
        {[
          { t: "4:22:51 AM", msg: "Encryption signature detected — trading node 7A", hi: false },
          { t: "4:23:01 AM", msg: "Pattern confirmed — nodes 7B and 7C affected", hi: false },
          { t: "4:23:07 AM", msg: "Threshold exceeded · Protocol matched · Activating", hi: true },
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
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <Pill color={TEAL} bg={`${TEAL}18`}>Pre-Staged</Pill>
              <Pill color={GOLD} bg={`${GOLD}15`}>Protocol #14</Pill>
            </div>
            <div style={{ ...CG, fontSize: 22, fontWeight: 600, color: "#fff", marginBottom: 4 }}>Financial Services Ransomware Response</div>
            <div style={{ fontSize: 12, color: MUTED }}>Risk & Resilience · Cyber · Regulatory</div>
          </div>
          <Shield size={26} color={TEAL} style={{ opacity: 0.7, flexShrink: 0 }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, paddingTop: 16, borderTop: `1px solid ${BORDER}` }}>
          {[{ label: "Tasks", val: "22" }, { label: "Phases", val: "5" }, { label: "Stakeholders", val: "4" }, { label: "Prior Activations", val: "3" }].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ ...CG, fontSize: 24, fontWeight: 700, color: GOLD }}>{s.val}</div>
              <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ background: `${TEAL}10`, border: `1px solid ${TEAL}40`, padding: "14px 20px", borderRadius: "0.15rem" }}>
        <div style={{ ...BC, fontSize: 10, fontWeight: 700, color: TEAL, letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 6 }}>Built 8 Months Before This Moment</div>
        <div style={{ ...CG, fontSize: 16, color: "#fff", lineHeight: 1.5 }}>This protocol was designed during a preparedness review — not during this crisis. Every task written. Every stakeholder identified. The preparation was the response.</div>
      </div>

      <Card>
        <Label>Execution Phases</Label>
        <div style={{ display: "flex", gap: 0 }}>
          {["IMMEDIATE", "SECONDARY", "CONTAINMENT", "RECOVERY", "CLOSE-OUT"].map((ph, i) => (
            <div key={ph} style={{ flex: 1, textAlign: "center", padding: "10px 4px", background: i === 0 ? `${TEAL}18` : "transparent", border: `1px solid ${i === 0 ? TEAL + "40" : BORDER}`, marginLeft: i > 0 ? -1 : 0 }}>
              <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: i === 0 ? TEAL : MUTED, letterSpacing: "0.08em", textTransform: "uppercase" as const }}>{ph}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 3 }}>{[5, 5, 4, 5, 3][i]} tasks</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
          <span style={{ ...BC, fontSize: 10, color: MUTED }}>Created: Oct 14, 2025</span>
          <span style={{ ...BC, fontSize: 10, color: MUTED }}>Last practiced: May 3, 2026</span>
          <span style={{ ...BC, fontSize: 10, color: TEAL, fontWeight: 600 }}>Avg: 11m 12s</span>
        </div>
      </Card>
    </div>
  );
}

function PanelWarRoom() {
  const statusCfg = { acknowledged: { color: TEAL, label: "Acknowledged" }, notified: { color: GOLD, label: "Notified" }, pending: { color: MUTED, label: "Pending" } };
  const taskCfg = { complete: { color: TEAL, icon: <CheckCircle size={13} /> }, active: { color: GOLD, icon: <Loader2 size={13} /> }, staged: { color: MUTED as unknown as string, icon: <Circle size={13} /> } };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ background: `${TEAL}12`, border: `1px solid ${TEAL}35`, padding: "12px 20px", borderRadius: "0.15rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <StatusDot color={TEAL} pulse />
          <span style={{ ...BC, fontSize: 11, fontWeight: 700, color: TEAL, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>Execution In Progress</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Clock size={13} color={GOLD} />
          <span style={{ ...CG, fontSize: 22, fontWeight: 700, color: GOLD }}>8:22</span>
          <span style={{ ...BC, fontSize: 10, color: MUTED }}>ELAPSED</span>
        </div>
      </div>
      <Card style={{ padding: "14px 18px" }}>
        <Label>Stakeholder Status</Label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {STAKEHOLDERS.map(s => {
            const cfg = statusCfg[s.status];
            return (
              <div key={s.role} style={{ padding: "10px 8px", background: "rgba(255,255,255,0.02)", border: `1px solid ${BORDER}`, borderRadius: "0.15rem", textAlign: "center" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: NAVY_MID, border: `2px solid ${cfg.color}50`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px" }}>
                  <span style={{ ...BC, fontSize: 10, fontWeight: 700, color: "#fff" }}>{s.initials}</span>
                </div>
                <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: "#fff", letterSpacing: "0.04em", marginBottom: 3 }}>{s.role}</div>
                <div style={{ ...BC, fontSize: 9, color: cfg.color, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const }}>{cfg.label}</div>
                <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>{s.time}</div>
              </div>
            );
          })}
        </div>
      </Card>
      <Card style={{ padding: "14px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <Label>Phase 1 — Immediate Actions</Label>
          <span style={{ ...BC, fontSize: 10, color: MUTED }}>1 done · 2 active · 2 staged</span>
        </div>
        {TASKS.map((t, i) => {
          const cfg = taskCfg[t.status];
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < TASKS.length - 1 ? `1px solid ${BORDER}` : "none" }}>
              <span style={{ color: cfg.color, flexShrink: 0, width: 14 }}>{cfg.icon}</span>
              <span style={{ fontSize: 12, color: t.status === "staged" ? MUTED : "#fff", flex: 1, textDecoration: t.status === "complete" ? "line-through" : "none" }}>{t.name}</span>
              <span style={{ ...BC, fontSize: 10, color: MUTED, flexShrink: 0, width: 76, textAlign: "right" as const }}>{t.owner}</span>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

function PanelAuthorize({ onAuthorize, authorizing }: { onAuthorize: () => void; authorizing: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ ...BC, fontSize: 10, fontWeight: 700, color: GOLD, letterSpacing: "0.14em", textTransform: "uppercase" as const, marginBottom: 2 }}>Executive Authorization Required</div>
          <div style={{ fontSize: 12, color: MUTED }}>Elapsed: <strong style={{ color: GOLD }}>9:47</strong> · Protocol #14 — Meridian Financial Group</div>
        </div>
      </div>
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
              <Pill color={TEAL} bg={`${TEAL}15`}>{p.outcome}</Pill>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <Label>Pre-Flight Checks</Label>
        {PREFLIGHT.map((q, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: `${TEAL}08`, border: `1px solid ${TEAL}25`, borderRadius: "0.15rem", marginBottom: i < PREFLIGHT.length - 1 ? 6 : 0 }}>
            <CheckCircle size={15} color={TEAL} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", flex: 1 }}>{q}</span>
            <span style={{ ...BC, fontSize: 10, fontWeight: 700, color: TEAL, marginLeft: "auto", flexShrink: 0 }}>CONFIRMED</span>
          </div>
        ))}
      </Card>
      <button onClick={onAuthorize} disabled={authorizing} style={{ width: "100%", padding: "18px 32px", background: authorizing ? TEAL + "88" : TEAL, border: "none", cursor: authorizing ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, borderRadius: "0.15rem" }}>
        {authorizing ? (
          <><Loader2 size={17} color="#fff" style={{ animation: "spin 1s linear infinite" }} /><span style={{ ...BC, fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "0.12em", textTransform: "uppercase" as const }}>Recording Authorization…</span></>
        ) : (
          <><Lock size={17} color="#fff" /><span style={{ ...BC, fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "0.12em", textTransform: "uppercase" as const }}>Authorize and Deploy</span><ArrowRight size={17} color="#fff" /></>
        )}
      </button>
      <div style={{ fontSize: 11, color: MUTED, textAlign: "center" as const, marginTop: -4 }}>Authorization recorded in the decision audit trail.</div>
    </div>
  );
}

function PanelComplete() {
  const rows = [
    { metric: "Time to Full Response", readiness: "11 min 43 sec", traditional: "4.2 days (avg)" },
    { metric: "Mobilization", readiness: "Pre-staged — no meetings", traditional: "Committee alignment required" },
    { metric: "Stakeholder Notification", readiness: "Automatic — 90 seconds", traditional: "Manual cascade (hours)" },
    { metric: "Executive Decision", readiness: "1 authorization · 9:47 elapsed", traditional: "After 2–3 day alignment cycle" },
    { metric: "Financial Exposure Window", readiness: "11:43", traditional: "4+ days @ $180K/hr" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card style={{ textAlign: "center" as const, padding: "24px 20px" }}>
        <Pill color={TEAL} bg={`${TEAL}15`}>OPTIMIZATION</Pill>
        <div style={{ ...CG, fontSize: 52, fontWeight: 700, color: GOLD, margin: "10px 0 4px", lineHeight: 1 }}>11:43</div>
        <div style={{ ...BC, fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: "0.14em", textTransform: "uppercase" as const }}>Minutes · Seconds · Full Response Complete</div>
        <div style={{ marginTop: 18, display: "flex", justifyContent: "center", gap: 28 }}>
          {[{ val: "22", label: "Tasks Closed" }, { val: "4", label: "Executives" }, { val: "1", label: "Authorization" }].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ ...CG, fontSize: 26, fontWeight: 700, color: "#fff" }}>{s.val}</div>
              <div style={{ ...BC, fontSize: 9, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card style={{ padding: "16px 20px" }}>
        <Label>This Activation vs. Traditional Response</Label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "0 16px" }}>
          <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" as const, padding: "4px 0 8px" }}>Metric</div>
          <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: TEAL, letterSpacing: "0.1em", textTransform: "uppercase" as const, padding: "4px 0 8px", textAlign: "right" as const }}>Readiness OS</div>
          <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" as const, padding: "4px 0 8px", textAlign: "right" as const }}>Traditional</div>
          {rows.map((r, i) => (
            <>
              <div key={`m${i}`} style={{ fontSize: 11, color: MUTED, padding: "7px 0", borderTop: `1px solid ${BORDER}` }}>{r.metric}</div>
              <div key={`r${i}`} style={{ fontSize: 11, color: TEAL, fontWeight: 600, padding: "7px 0", borderTop: `1px solid ${BORDER}`, textAlign: "right" as const, whiteSpace: "nowrap" as const }}>{r.readiness}</div>
              <div key={`t${i}`} style={{ fontSize: 11, color: MUTED, padding: "7px 0", borderTop: `1px solid ${BORDER}`, textAlign: "right" as const, whiteSpace: "nowrap" as const }}>{r.traditional}</div>
            </>
          ))}
        </div>
      </Card>
      <div style={{ background: `${GOLD}10`, border: `1px solid ${GOLD}35`, padding: "14px 18px", borderRadius: "0.15rem", display: "flex", alignItems: "center", gap: 14 }}>
        <TrendingUp size={22} color={GOLD} style={{ flexShrink: 0 }} />
        <div>
          <div style={{ ...BC, fontSize: 10, fontWeight: 700, color: GOLD, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 2 }}>3,600× Execution Head Start</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>30 days of traditional mobilization compressed to 12 minutes.</div>
        </div>
      </div>
    </div>
  );
}

function PanelAdvance() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.3)", padding: "12px 18px", borderRadius: "0.15rem", display: "flex", alignItems: "center", gap: 10 }}>
        <RefreshCw size={14} color="#A78BFA" />
        <span style={{ ...BC, fontSize: 11, fontWeight: 700, color: "#A78BFA", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>ADVANCE Loop — Closing Automatically</span>
        <span style={{ ...BC, fontSize: 11, color: MUTED, marginLeft: "auto" }}>Activation #847 · Protocol #14</span>
      </div>

      <Card>
        <Label color="#A78BFA">3 Updates Generated from This Activation</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {ADVANCE_UPDATES.map((u, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px", background: "rgba(167,139,250,0.05)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: "0.15rem" }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                <span style={{ ...BC, fontSize: 9, fontWeight: 700, color: "#A78BFA" }}>{i + 1}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: "#A78BFA", letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 3 }}>{u.type}</div>
                <div style={{ fontSize: 12, color: "#fff" }}>{u.change}</div>
              </div>
              <Pill color="#A78BFA" bg="rgba(167,139,250,0.1)">{u.impact}</Pill>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Card style={{ padding: "14px 16px" }}>
          <Label color="#A78BFA">Protocol #14 History</Label>
          {[
            { act: "Activation #845", date: "Apr 2026", time: "12:40" },
            { act: "Activation #831", date: "Jan 2026", time: "13:22" },
            { act: "Activation #847", date: "Jun 2026", time: "11:43", current: true },
          ].map((a, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < 2 ? `1px solid ${BORDER}` : "none" }}>
              <span style={{ fontSize: 11, color: a.current ? GOLD : MUTED }}>{a.act}</span>
              <span style={{ fontSize: 11, color: MUTED }}>{a.date}</span>
              <span style={{ ...BC, fontSize: 11, fontWeight: 700, color: a.current ? TEAL : MUTED }}>{a.time}</span>
            </div>
          ))}
          <div style={{ marginTop: 10, fontSize: 11, color: TEAL, fontWeight: 500 }}>↓ 1:37 improvement across 3 activations</div>
        </Card>

        <Card style={{ padding: "14px 16px" }}>
          <Label color="#A78BFA">Institutional Memory</Label>
          <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: "#A78BFA", lineHeight: 1, marginBottom: 4 }}>14</div>
          <div style={{ ...BC, fontSize: 9, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 10 }}>Proven improvements · Protocol #14</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>This knowledge lives in the platform — not in a person. When your CISO leaves, the protocol doesn't.</div>
        </Card>
      </div>

      <div style={{ background: `${TEAL}10`, border: `1px solid ${TEAL}30`, padding: "14px 18px", borderRadius: "0.15rem" }}>
        <div style={{ ...BC, fontSize: 10, fontWeight: 700, color: TEAL, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 4 }}>The Compounding Moat</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>After 6 months, Meridian's Protocol #14 has been refined 14 times from real activations. Rebuilding this depth on any competing platform would take years. <strong style={{ color: "#fff" }}>The platform gets harder to replace with every activation.</strong></div>
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
    setTimeout(() => { setStep(7); setAuthorizing(false); }, 1400);
  };

  const panels = [
    <PanelCommandCenter />,
    <PanelTriggerPortfolio />,
    <PanelProtocolLibrary />,
    <PanelSignal />,
    <PanelProtocol />,
    <PanelWarRoom />,
    <PanelAuthorize onAuthorize={handleAuthorize} authorizing={authorizing} />,
    <PanelComplete />,
    <PanelAdvance />,
  ];

  const phaseColor = PHASES.find(p => p.steps.includes(step))?.color || GOLD;

  return (
    <div style={{ minHeight: "100vh", background: NAVY, display: "flex", flexDirection: "column" }}>
      <style>{`
        @keyframes ping { 0% { transform: scale(1); opacity: 0.4; } 75%, 100% { transform: scale(2); opacity: 0; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {/* Top bar */}
      <div style={{ background: "#06091e", borderBottom: `1px solid ${BORDER}`, padding: "0 28px", height: 50, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <VaughnMartinLogo size={26} variant="icon-only" />
          <div style={{ width: 1, height: 22, background: BORDER }} />
          <div>
            <span style={{ ...BC, fontSize: 10, fontWeight: 700, color: phaseColor, letterSpacing: "0.14em", textTransform: "uppercase" as const }}>Platform Demo</span>
            <span style={{ ...BC, fontSize: 11, color: "rgba(255,255,255,0.4)", marginLeft: 10 }}>Meridian Financial Group · Full Customer Journey</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {ELAPSED[step] !== "—" && (
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Clock size={12} color={GOLD} />
              <span style={{ ...BC, fontSize: 12, fontWeight: 700, color: GOLD }}>{ELAPSED[step]}</span>
              <span style={{ ...BC, fontSize: 9, color: MUTED }}>ELAPSED</span>
            </div>
          )}
          <Link href="/request-access" style={{ ...BC, background: GOLD, color: NAVY, fontSize: 11, fontWeight: 700, padding: "7px 16px", textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase" as const, borderRadius: "0.15rem", whiteSpace: "nowrap" as const }}>
            Apply for Access
          </Link>
        </div>
      </div>

      {/* Main layout */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <div style={{ width: 272, background: "#060b20", borderRight: `1px solid ${BORDER}`, padding: "20px 0", display: "flex", flexDirection: "column", flexShrink: 0, overflowY: "auto" as const }}>
          {PHASES.map((phase) => (
            <div key={phase.label} style={{ marginBottom: 6 }}>
              <div style={{ padding: "6px 20px 6px", display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 4, height: 14, background: phase.color, borderRadius: 2, flexShrink: 0 }} />
                <span style={{ ...BC, fontSize: 9, fontWeight: 700, color: phase.color, letterSpacing: "0.16em", textTransform: "uppercase" as const }}>{phase.label}</span>
                <span style={{ ...BC, fontSize: 9, color: MUTED, marginLeft: 2 }}>· {phase.desc}</span>
              </div>
              {phase.steps.map(i => {
                const s = STEP_DEFS[i];
                const isActive = i === step;
                const isDone = i < step;
                return (
                  <div key={i} onClick={() => isDone && setStep(i)} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 20px", cursor: isDone ? "pointer" : "default", background: isActive ? `${phase.color}0c` : "transparent", borderLeft: `2px solid ${isActive ? phase.color : isDone ? phase.color + "50" : "transparent"}`, marginBottom: 1 }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: isActive ? phase.color : isDone ? phase.color + "30" : "transparent", border: `1px solid ${isActive ? phase.color : isDone ? phase.color + "60" : BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                      {isDone ? <CheckCircle size={10} color={phase.color} /> : <span style={{ ...BC, fontSize: 8, fontWeight: 700, color: isActive ? NAVY : MUTED }}>{i + 1}</span>}
                    </div>
                    <div>
                      <div style={{ ...BC, fontSize: 11, fontWeight: 700, color: isActive ? "#fff" : isDone ? "rgba(255,255,255,0.6)" : MUTED, letterSpacing: "0.03em" }}>{s.label}</div>
                      <div style={{ fontSize: 10, color: MUTED + "80", marginTop: 1 }}>{s.tag}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Narration */}
          <div style={{ margin: "16px 0 0", padding: "16px 20px 0", borderTop: `1px solid ${BORDER}`, flex: 1 }}>
            <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: MUTED, letterSpacing: "0.14em", textTransform: "uppercase" as const, marginBottom: 10 }}>What's Happening</div>
            <div style={{ ...CG, fontSize: 15, fontWeight: 600, color: "#fff", lineHeight: 1.45, marginBottom: 10 }}>{NARRATION[step].headline}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: 12 }}>{NARRATION[step].body}</div>
            <div style={{ background: `${phaseColor}0d`, border: `1px solid ${phaseColor}28`, padding: "9px 12px", borderRadius: "0.15rem" }}>
              <div style={{ fontSize: 10, color: phaseColor, fontStyle: "italic", lineHeight: 1.5 }}>"{NARRATION[step].callout}"</div>
            </div>
          </div>
        </div>

        {/* Content panel */}
        <div style={{ flex: 1, padding: "24px 28px", overflowY: "auto" as const }}>
          {/* Step header */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <Pill color={phaseColor} bg={`${phaseColor}12`}>{PHASES.find(p => p.steps.includes(step))?.label}</Pill>
            <ChevronRight size={13} color={MUTED.toString()} />
            <span style={{ ...BC, fontSize: 13, fontWeight: 700, color: "#fff" }}>{STEP_DEFS[step].label}</span>
            <div style={{ flex: 1 }} />
            <span style={{ ...BC, fontSize: 10, color: MUTED }}>Step {step + 1} of {STEP_DEFS.length}</span>
            <div style={{ width: 100, height: 3, background: BORDER, borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${((step + 1) / STEP_DEFS.length) * 100}%`, background: phaseColor, borderRadius: 2, transition: "width 0.4s ease" }} />
            </div>
          </div>

          {panels[step]}

          {/* Bottom nav */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 24, paddingTop: 18, borderTop: `1px solid ${BORDER}` }}>
            <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} style={{ display: "flex", alignItems: "center", gap: 7, background: "transparent", border: `1px solid ${BORDER}`, padding: "10px 18px", color: step === 0 ? MUTED : "#fff", cursor: step === 0 ? "default" : "pointer", ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, borderRadius: "0.15rem" }}>
              <ChevronLeft size={13} /> Back
            </button>

            {step === STEP_DEFS.length - 1 ? (
              <Link href="/request-access" style={{ display: "flex", alignItems: "center", gap: 10, background: GOLD, color: NAVY, padding: "12px 28px", textDecoration: "none", ...BC, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, borderRadius: "0.15rem" }}>
                Apply for Founding Partner Access <ArrowRight size={15} />
              </Link>
            ) : step === 6 ? (
              <div style={{ fontSize: 12, color: MUTED, fontStyle: "italic" }}>Click "Authorize and Deploy" above to continue</div>
            ) : (
              <button onClick={() => setStep(s => Math.min(STEP_DEFS.length - 1, s + 1))} style={{ display: "flex", alignItems: "center", gap: 9, background: phaseColor, border: "none", padding: "12px 24px", color: step < 3 ? "#fff" : "#fff", cursor: "pointer", ...BC, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, borderRadius: "0.15rem" }}>
                Continue <ArrowRight size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
