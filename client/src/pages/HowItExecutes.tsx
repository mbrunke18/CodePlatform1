import { useState, useEffect, useRef, type CSSProperties } from "react";
import { updatePageMetadata } from "@/lib/seo";
import { Link } from "wouter";
import PageLayout from "@/components/layout/PageLayout";

const NAVY    = "#0A0F2E";
const NAVY_BG = "#132558";
const GOLD    = "#C9A84C";
const TEAL    = "#2B8A6E";
const IVORY   = "#F0EDE4";
const MUTED   = "rgba(240,237,228,0.55)";
const GEO: CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const DM: CSSProperties  = { fontFamily: "'Barlow', system-ui, sans-serif" };

const SCENARIOS = [
  {
    id: "ransomware", label: "Ransomware Attack", subtitle: "Critical systems encrypted — 3 AM detection",
    signal: "23 servers encrypted. Ransom note detected across payment processing infrastructure. Data exfiltration indicator flagged.",
    signalSource: "SIEM Alert · Endpoint Detection · Threat Intelligence Feed",
    protocol: "Ransomware Response", protocolNum: "#31",
    tasks: 8, stakeholders: ["CEO", "CISO", "General Counsel", "Board Chair", "CFO", "COO"],
    budget: "$2.4M pre-approved", domain: "Technology & Security", riskScore: 94,
    outcome: "Systems isolated in 8 minutes. FBI Cyber Division notified. Board briefed before market open. Regulatory disclosure filed on time.",
  },
  {
    id: "activist", label: "Activist Investor", subtitle: "9.8% stake disclosed — board seat demanded",
    signal: "SEC Schedule 13D filing detected. Elliott Management — 9.8% stake. Prior campaigns: 4 spin-offs demanded, 3 achieved.",
    signalSource: "SEC EDGAR Monitor · Bloomberg Feed · Activist Tracker",
    protocol: "Activist Defense", protocolNum: "#44",
    tasks: 7, stakeholders: ["CEO", "CFO", "General Counsel", "Board Chair", "Chief IR Officer", "Chief Strategy Officer"],
    budget: "$1.8M pre-approved", domain: "Market Dynamics", riskScore: 88,
    outcome: "Top 10 institutional holders contacted before activist's first press statement. Board defense strategy fully staged before market open.",
  },
  {
    id: "supply", label: "Supply Chain Collapse", subtitle: "Primary supplier declares force majeure",
    signal: "Tier-1 supplier bankruptcy filing detected. 34% of production supply at risk. 14-day buffer stock remaining.",
    signalSource: "Supplier Monitor · Credit Risk Feed · Trade Intelligence",
    protocol: "Supply Continuity", protocolNum: "#67",
    tasks: 7, stakeholders: ["COO", "CFO", "Chief Procurement Officer", "Head of Logistics", "CEO", "CMO"],
    budget: "$3.1M pre-approved", domain: "Supply Chain & Operations", riskScore: 82,
    outcome: "6 alternate suppliers contacted simultaneously. Emergency POs issued. Top 10 customers personally called before production gap emerged.",
  },
  {
    id: "regulatory", label: "Regulatory Inquiry", subtitle: "DOJ investigation opened — disclosure required",
    signal: "DOJ Civil Investigative Demand received. 30-day response window. 3 jurisdictions implicated. Mandatory board disclosure required.",
    signalSource: "Legal Monitor · Regulatory Docket · Compliance Feed",
    protocol: "Regulatory Response", protocolNum: "#112",
    tasks: 6, stakeholders: ["General Counsel", "Chief Compliance Officer", "CEO", "Board Chair", "CFO", "CISO"],
    budget: "$950K pre-approved", domain: "Regulatory & Compliance", riskScore: 79,
    outcome: "Outside counsel engaged. Board briefed. Regulatory acknowledgment filed within window. Disclosure drafted and pre-approved.",
  },
  {
    id: "competitor-launch", label: "Competitor Product Launch", subtitle: "Major competitor announces flagship product — market window narrowing",
    signal: "Primary competitor announces flagship product at annual industry conference. Analyst coverage begins within 20 minutes. Sales team fielding customer calls within the hour.",
    signalSource: "News Monitor · Analyst Intelligence · Competitor Signal Feed",
    protocol: "Competitive Response", protocolNum: "#18",
    tasks: 7, stakeholders: ["CEO", "CMO", "Chief Product Officer", "Chief Revenue Officer", "CFO", "Chief Strategy Officer"],
    budget: "$1.2M pre-approved", domain: "GROWTH & POSITIONING", riskScore: 83,
    outcome: "Sales battle card deployed to all AEs within the hour. Top 20 enterprise customers personally contacted before competitor follow-up calls. Company narrative leads every analyst conversation.",
  },
  {
    id: "market-entry", label: "Market Entry Window", subtitle: "Regulatory change opens new segment — 90-day consolidation window",
    signal: "Federal Register publishes final rule opening previously restricted market segment. Legal analysis: 90-day window before consolidation. First-mover advantage estimated at 3–5 years.",
    signalSource: "Regulatory Monitor · Federal Register · Legal Intelligence Feed",
    protocol: "Market Entry Capture", protocolNum: "#22",
    tasks: 8, stakeholders: ["CEO", "Chief Strategy Officer", "General Counsel", "CFO", "Chief Revenue Officer", "Chief Product Officer", "CMO"],
    budget: "$4.2M pre-approved", domain: "GROWTH & POSITIONING", riskScore: 76,
    outcome: "Investment bank engaged within the hour. Board authorization secured same day. Market entry team assembled and operating within 48 hours — 6 weeks ahead of next closest competitor.",
  },
  {
    id: "compound", label: "Compound Crisis", subtitle: "Activist stake + DOJ inquiry — simultaneous triggers",
    signal: "SEC 13D: activist discloses 9.2% stake — board seat demanded. SIMULTANEOUS: DOJ Civil Investigative Demand received across 3 jurisdictions. Two response clocks running at once.",
    signalSource: "SEC EDGAR Monitor · DOJ Federal Register · Activist Intelligence Feed",
    protocol: "Activist Defense + Regulatory Response", protocolNum: "#185",
    tasks: 12, stakeholders: ["CEO", "General Counsel", "CFO", "Board Chair", "Chief Compliance Officer", "Chief IR Officer", "Chief Strategy Officer"],
    budget: "$3.5M pre-approved", domain: "MULTI-DOMAIN", riskScore: 97,
    compound: true,
    outcome: "Two parallel response tracks activated simultaneously. Activist denied use of regulatory inquiry as leverage. Board briefed on both fronts before market open.",
  },
];

const CHAIN_STEPS = [
  {
    time: "0:00", label: "Signal Detected",
    desc: (s: typeof SCENARIOS[0]) => `System detects ${s.signal.split('.')[0].toLowerCase()}.`,
    detail: (s: typeof SCENARIOS[0]) => `Source: ${s.signalSource}. Risk score: ${s.riskScore}/100 (HIGH).`,
    color: GOLD, icon: "◉",
  },
  {
    time: "0:01", label: "Protocol Matched",
    desc: (s: typeof SCENARIOS[0]) => (s as any).compound
      ? `2 Readiness Protocols activated simultaneously — "${s.protocol}". ${s.tasks} coordinated tasks pre-staged across both tracks.`
      : `Readiness Protocol ${s.protocolNum} — "${s.protocol}" matched. ${s.tasks} tasks pre-staged.`,
    detail: (s: typeof SCENARIOS[0]) => (s as any).compound
      ? `Multi-domain pattern match: 97% confidence on each track. All tasks, stakeholders, and budget authority pre-assigned across both response protocols.`
      : `Pattern match confidence: 97%. All tasks, stakeholders, and budget authority already assigned.`,
    color: TEAL, icon: "⬡",
  },
  {
    time: "0:02", label: "Execution Brief Staged",
    desc: () => `Board-ready execution brief generated. Situation summary, action sequence, and authority chain — complete.`,
    detail: () => `Brief includes: trigger analysis, recommended protocols, stakeholder map, pre-approved communications.`,
    color: GOLD, icon: "▣",
  },
  {
    time: "0:03", label: "Stakeholders Notified",
    desc: (s: typeof SCENARIOS[0]) => `${s.stakeholders.length} executives notified simultaneously — each sees their specific role and first action.`,
    detail: (s: typeof SCENARIOS[0]) => `Notified: ${s.stakeholders.join(', ')}. Each receives role-specific brief, not a generic alert.`,
    color: TEAL, icon: "◈",
  },
  {
    time: "0:05", label: "Executive Authorizes",
    desc: () => `CEO reviews pre-staged brief and authorizes execution. One decision. No committee. No alignment meeting.`,
    detail: () => `Budget pre-authorized: ${SCENARIOS[0].budget}. Authorization logged with full audit trail for board governance.`,
    color: GOLD, icon: "✓",
  },
  {
    time: "0:12", label: "Execution Complete",
    desc: (s: typeof SCENARIOS[0]) => (s as any).compound
      ? `All ${s.tasks} tasks deployed across 2 active protocols. ${s.outcome.split('.')[0]}.`
      : `All ${s.tasks} tasks deployed. Response team coordinated. ${s.outcome.split('.')[0]}.`,
    detail: () => `Full audit log captured. Debrief staged. Outcome written to the Institutional Memory Engine — every decision, authorization, and result encoded for the next activation. The organization is now better prepared than before the trigger fired.`,
    color: TEAL, icon: "★",
  },
];

const OLD_MODEL = [
  { days: "Day 1–3",   action: "Figuring out who needs to be in the room",           cost: "Executive bandwidth consumed" },
  { days: "Day 4–7",   action: "Scheduling alignment meetings across time zones",     cost: "Strategic window narrowing" },
  { days: "Day 8–14",  action: "Getting stakeholders aligned on the plan",           cost: "Competitor already acting" },
  { days: "Day 15–22", action: "Assigning tasks and clarifying ownership",            cost: "Regulator already moved" },
  { days: "Day 23–30", action: "Beginning execution — mobilization cycle complete",  cost: "30 days burned. Window closed." },
];

export default function HowItExecutes() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scenario = SCENARIOS[selectedIdx];

  useEffect(() => {
    updatePageMetadata({
      title: "How Readiness OS Executes in 12 Minutes | VaughnMartin",
      description: "Signal detected → Readiness Protocol matched → tasks staged → stakeholders notified → executive authorizes. The full coordination chain from 30 days to 12 minutes.",
      ogTitle: "How Readiness OS Executes: The 12-Minute Chain | VaughnMartin",
      ogDescription: "Pre-staged Readiness Protocols collapse the mobilization cycle from 30 days to 12 minutes. Watch the full execution chain across 5 live scenarios.",
    });
  }, []);

  function startChain() {
    setVisibleSteps(0);
    setPlaying(true);
    let step = 0;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      step += 1;
      setVisibleSteps(step);
      if (step >= CHAIN_STEPS.length) {
        clearInterval(timerRef.current!);
        setPlaying(false);
      }
    }, 900);
  }

  useEffect(() => {
    const t = setTimeout(() => startChain(), 600);
    return () => {
      clearTimeout(t);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [selectedIdx]);

  function handleScenarioChange(idx: number) {
    if (timerRef.current) clearInterval(timerRef.current);
    setVisibleSteps(0);
    setPlaying(false);
    setSelectedIdx(idx);
  }

  return (
    <PageLayout>
      <div style={{ background: NAVY, minHeight: "100vh", ...DM }}>

        {/* Hero */}
        <div style={{ background: NAVY_BG, borderBottom: `1px solid rgba(201,168,76,0.15)`, padding: "80px 48px 56px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 18 }}>
              <div style={{ width: 28, height: 1, background: GOLD }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>The 12-Minute Execution Chain</span>
              <div style={{ width: 28, height: 1, background: GOLD }} />
            </div>
            <h1 style={{ ...GEO, fontSize: "clamp(36px,5vw,60px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 18 }}>
              The response is ready<br /><em style={{ color: GOLD }}>before the trigger fires.</em>
            </h1>
            <p style={{ fontSize: 16, color: MUTED, maxWidth: 640, margin: "0 auto 16px", lineHeight: 1.7 }}>
              While competitors spend 30 days figuring out who needs to be in the room, every task is pre-staged, every stakeholder is mapped, every budget authority is pre-approved. Watch exactly how 12 minutes replaces 30 days.
            </p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", maxWidth: 560, margin: "0 auto 32px", lineHeight: 1.6 }}>
              This is the animated walkthrough — watch the chain execute. Want to run the scenario yourself?{" "}
              <a href="/12-minute-experience" style={{ color: GOLD, textDecoration: "none", borderBottom: `1px solid ${GOLD}55` }}>
                Try the interactive 12-Minute Test Drive →
              </a>
            </p>
            {/* 4-phase timing breakdown */}
            <div style={{ maxWidth: 780, margin: "0 auto", border: "1px solid rgba(201,168,76,0.18)", background: "rgba(255,255,255,0.03)" }}>
              <div style={{ padding: "12px 20px", borderBottom: "1px solid rgba(201,168,76,0.12)", textAlign: "center" }}>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>How 12 Minutes Actually Breaks Down</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
                {[
                  { window: "< 60 sec", phase: "01", label: "Signal detected & protocol matched", detail: "Continuous monitoring fires. 231 patterns checked. Readiness Protocol identified. Risk score assigned.", color: GOLD },
                  { window: "< 3 min",  phase: "02", label: "All stakeholders notified", detail: "Every executive receives a role-specific brief simultaneously — not a generic alert. No one has to find the contact list.", color: TEAL },
                  { window: "< 5 min",  phase: "03", label: "Executive reviews & authorizes", detail: "Pre-staged brief reviewed. One authorization. Budget unlocked. Authority chain confirmed. No committee.", color: GOLD },
                  { window: "< 12 min", phase: "04", label: "Full team executing", detail: "Tasks deployed. Integrations triggered. Jira updated. Teams notified. Audit trail open. Response underway.", color: TEAL },
                ].map((item, i) => (
                  <div key={item.phase} style={{ padding: "18px 16px", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none", textAlign: "center" }}>
                    <div style={{ ...GEO, fontSize: 20, fontWeight: 700, color: item.color, marginBottom: 4 }}>{item.window}</div>
                    <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>Phase {item.phase}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.75)", marginBottom: 6, lineHeight: 1.4 }}>{item.label}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>{item.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scenario Selector */}
        <div style={{ borderBottom: `1px solid rgba(255,255,255,0.08)`, padding: "20px 48px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: MUTED, flexShrink: 0 }}>Choose Trigger:</span>
            {SCENARIOS.map((s, i) => {
              const isCompound = (s as any).compound;
              const isActive = selectedIdx === i;
              return (
                <button
                  key={s.id}
                  onClick={() => handleScenarioChange(i)}
                  style={{
                    fontSize: 12, fontWeight: 600, padding: "8px 18px", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 6,
                    background: isActive ? (isCompound ? TEAL : GOLD) : "rgba(255,255,255,0.06)",
                    color: isActive ? (isCompound ? "#fff" : NAVY) : "rgba(255,255,255,0.75)",
                    border: `1px solid ${isActive ? (isCompound ? TEAL : GOLD) : "rgba(255,255,255,0.12)"}`,
                    transition: "all 0.18s ease",
                  }}
                >
                  {s.label}
                  {isCompound && (
                    <span style={{
                      fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                      padding: "2px 5px",
                      background: isActive ? "rgba(255,255,255,0.18)" : `${TEAL}30`,
                      color: isActive ? "#fff" : TEAL,
                    }}>
                      MULTI
                    </span>
                  )}
                </button>
              );
            })}
            <button
              onClick={() => startChain()}
              style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "8px 20px", background: playing ? "rgba(255,255,255,0.06)" : GOLD, color: playing ? MUTED : NAVY, border: `1px solid ${playing ? "rgba(255,255,255,0.12)" : GOLD}`, cursor: playing ? "default" : "pointer", transition: "all 0.2s ease" }}
            >
              {playing ? "Playing…" : "↺ Replay"}
            </button>
          </div>
        </div>

        {/* Main Chain */}
        <div className="hie-chain-grid" style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 48px", display: "grid", gridTemplateColumns: "1fr 380px", gap: 48, alignItems: "start" }}>

          {/* Left: Execution Chain */}
          <div>
            {/* Trigger Event Banner */}
            <div style={{ marginBottom: 32, padding: "20px 24px", background: "rgba(201,168,76,0.08)", border: `1px solid rgba(201,168,76,0.3)`, borderLeft: `3px solid ${GOLD}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div style={{ width: 6, height: 6, background: GOLD, borderRadius: "50%", animation: "pulse 1.5s infinite" }} />
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD }}>Trigger Event Detected — {scenario.domain}</span>
              </div>
              <p style={{ fontSize: 14, color: "#fff", fontWeight: 600, marginBottom: 4, lineHeight: 1.5 }}>{scenario.signal}</p>
              <p style={{ fontSize: 11, color: MUTED, margin: 0 }}>Source: {scenario.signalSource}</p>
            </div>

            {/* Chain Steps */}
            <div style={{ position: "relative" }}>
              {CHAIN_STEPS.map((step, i) => {
                const visible = visibleSteps > i;
                const active = visibleSteps === i + 1;
                const s = scenario;
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex", gap: 20, marginBottom: 4,
                      opacity: visible ? 1 : 0.15,
                      transform: visible ? "translateX(0)" : "translateX(-12px)",
                      transition: "all 0.5s ease",
                    }}
                  >
                    {/* Timeline */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                      <div style={{
                        width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
                        background: visible ? (active ? step.color : "rgba(255,255,255,0.05)") : "rgba(255,255,255,0.03)",
                        border: `2px solid ${visible ? step.color : "rgba(255,255,255,0.1)"}`,
                        fontSize: 14, color: visible ? (active ? NAVY : step.color) : "rgba(255,255,255,0.2)",
                        fontWeight: 700, flexShrink: 0,
                        transition: "all 0.4s ease",
                        boxShadow: active ? `0 0 20px ${step.color}44` : "none",
                      }}>
                        {visible ? step.icon : "○"}
                      </div>
                      {i < CHAIN_STEPS.length - 1 && (
                        <div style={{ width: 2, height: 28, background: visible ? `${step.color}40` : "rgba(255,255,255,0.06)", margin: "4px 0", transition: "all 0.4s ease" }} />
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, paddingTop: 8, paddingBottom: 24 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: step.color, opacity: visible ? 1 : 0.3 }}>
                          {step.time}
                        </span>
                        <div style={{ width: 1, height: 12, background: "rgba(255,255,255,0.15)" }} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: visible ? "#fff" : "rgba(255,255,255,0.3)", transition: "all 0.3s ease" }}>
                          {step.label}
                        </span>
                        {active && (
                          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: step.color, background: `${step.color}20`, padding: "2px 8px" }}>
                            LIVE
                          </span>
                        )}
                      </div>
                      {visible && (
                        <div style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease 0.2s" }}>
                          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.82)", margin: "0 0 4px", lineHeight: 1.55, fontWeight: 500 }}>
                            {step.desc(s)}
                          </p>
                          <p style={{ fontSize: 12, color: MUTED, margin: 0, lineHeight: 1.5 }}>
                            {step.detail(s)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Complete Banner */}
            {visibleSteps >= CHAIN_STEPS.length && (
              <div style={{ marginTop: 8, padding: "20px 28px", background: "rgba(43,138,110,0.1)", border: `1px solid ${TEAL}`, borderLeft: `3px solid ${TEAL}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: TEAL, marginBottom: 4 }}>Response Complete — 12:00</div>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.82)", margin: 0, fontWeight: 500 }}>{scenario.outcome}</p>
                </div>
                <Link href="/12-minute-experience">
                  <button style={{ flexShrink: 0, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "10px 20px", background: GOLD, color: NAVY, border: "none", cursor: "pointer" }}>
                    Experience It →
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Right: Old Model vs Readiness OS */}
          <div style={{ position: "sticky", top: 24 }}>

            {/* Readiness OS Stats */}
            <div style={{ padding: "24px", background: "rgba(255,255,255,0.04)", border: `1px solid rgba(201,168,76,0.2)`, marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, marginBottom: 16 }}>Readiness OS — {scenario.label}</div>
              {[
                { l: "Protocol", v: `${scenario.protocolNum} — ${scenario.protocol}` },
                { l: "Tasks Pre-staged", v: `${scenario.tasks} tasks` },
                { l: "Stakeholders", v: `${scenario.stakeholders.length} executives` },
                { l: "Budget Authority", v: scenario.budget },
                { l: "Execution Time", v: "12 minutes" },
              ].map(r => (
                <div key={r.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontSize: 11, color: MUTED, fontWeight: 600 }}>{r.l}</span>
                  <span style={{ fontSize: 12, color: "#fff", fontWeight: 600, textAlign: "right", maxWidth: "55%" }}>{r.v}</span>
                </div>
              ))}
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD, marginBottom: 8 }}>Team Notified</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {scenario.stakeholders.map(s => (
                    <span key={s} style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", background: "rgba(43,138,110,0.15)", border: `1px solid rgba(43,138,110,0.3)`, color: "#9BE0C8" }}>{s}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Old Model */}
            <div style={{ padding: "20px", background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)", borderLeft: "3px solid rgba(239,68,68,0.5)" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#F87171", marginBottom: 12 }}>Without Readiness OS — 30 Days</div>
              {OLD_MODEL.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(239,68,68,0.7)", flexShrink: 0, minWidth: 60, letterSpacing: "0.05em" }}>{step.days}</span>
                  <div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.4 }}>{step.action}</div>
                    {i === 4 && <div style={{ fontSize: 10, color: "rgba(239,68,68,0.7)", fontWeight: 700, marginTop: 2, letterSpacing: "0.08em", textTransform: "uppercase" }}>{step.cost}</div>}
                  </div>
                </div>
              ))}
            </div>

            {/* 3600x metric */}
            <div style={{ marginTop: 16, padding: "16px 20px", background: "rgba(201,168,76,0.08)", border: `1px solid rgba(201,168,76,0.2)`, textAlign: "center" }}>
              <div style={{ ...GEO, fontSize: 36, fontWeight: 700, color: GOLD, lineHeight: 1 }}>3,600×</div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: MUTED, marginTop: 4 }}>Execution Head Start</div>
              <div style={{ fontSize: 11, color: MUTED, marginTop: 6 }}>30 days compressed to 12 minutes</div>
            </div>
          </div>
        </div>

        {/* How Preparation Works Section */}
        <div style={{ borderTop: `1px solid rgba(255,255,255,0.08)`, padding: "64px 48px", background: NAVY_BG }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 28, height: 1, background: GOLD }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>How Preparation Compounds</span>
                <div style={{ width: 28, height: 1, background: GOLD }} />
              </div>
              <h2 style={{ ...GEO, fontSize: "clamp(28px,3.5vw,42px)", fontWeight: 700, color: "#fff", marginBottom: 12 }}>
                The response was built <em style={{ color: GOLD }}>before the trigger fired.</em>
              </h2>
              <p style={{ fontSize: 15, color: MUTED, maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
                12-minute execution is not a feature — it is the result of preparation. Every task assigned before the crisis. Every stakeholder briefed before the call. Every budget authorized before the request.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "rgba(255,255,255,0.06)" }}>
              {[
                { step: "Before the Trigger", icon: "◎", color: GOLD, items: ["180 Readiness Protocols pre-built", "231 trigger patterns continuously monitored", "Every stakeholder role pre-assigned", "Budget authority pre-approved", "Communication templates pre-cleared"] },
                { step: "At the Trigger", icon: "⚡", color: TEAL, items: ["Signal detected and scored in seconds", "Protocol matched automatically", "Execution brief staged instantly", "All stakeholders notified simultaneously", "CEO authorizes with full context"] },
                { step: "12 Minutes Later", icon: "★", color: GOLD, items: ["All tasks deployed and executing", "Board briefed with full documentation", "Regulators notified on schedule", "Customers informed proactively", "Debrief staged for institutional learning"] },
              ].map(col => (
                <div key={col.step} style={{ background: NAVY, padding: "32px 28px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                    <span style={{ fontSize: 18, color: col.color }}>{col.icon}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: col.color }}>{col.step}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {col.items.map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <span style={{ color: col.color, fontSize: 12, flexShrink: 0, marginTop: 1 }}>→</span>
                        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.4 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What Readiness Does Before the Trigger Fires */}
        <div style={{ padding: "64px 48px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 28, height: 1, background: GOLD }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: GOLD }}>The Readiness Posture</span>
                <div style={{ width: 28, height: 1, background: GOLD }} />
              </div>
              <h2 style={{ ...GEO, fontSize: "clamp(26px,3.2vw,40px)", fontWeight: 700, color: "#fff", marginBottom: 16, lineHeight: 1.15 }}>
                Readiness isn't a moment.<br /><em style={{ color: GOLD }}>It's a posture.</em>
              </h2>
              <p style={{ fontSize: 15, color: MUTED, maxWidth: 620, margin: "0 auto", lineHeight: 1.75 }}>
                In football, four-down territory is not a yard line. It is a mindset. The offense that enters four-down territory does not expect to use the fourth down — but having it available changes every decision on the first three. The drive is different. Leadership is calmer. The plays are called without the pressure of converting everything in real time.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2, background: "rgba(255,255,255,0.05)", marginBottom: 2 }}>
              {[
                {
                  label: "Without Readiness OS",
                  color: "#DC2626",
                  items: [
                    "Every trigger requires building the response from scratch",
                    "Every third down must convert — there is no safety net",
                    "Leadership decisions made under full panic pressure",
                    "Budget, stakeholders, and comms figured out mid-crisis",
                    "30-day mobilization cycle, every time",
                  ],
                },
                {
                  label: "With Readiness OS",
                  color: TEAL,
                  items: [
                    "180 protocols pre-staged — the fourth down always exists",
                    "Calmer decisions upstream because the safety net is real",
                    "Leadership operates differently before any trigger fires",
                    "Budget pre-approved, stakeholders pre-assigned, comms pre-cleared",
                    "12 minutes when the trigger fires. Not because of speed — because of preparation.",
                  ],
                },
              ].map(col => (
                <div key={col.label} style={{ background: NAVY, padding: "32px 28px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: col.color, marginBottom: 20 }}>{col.label}</div>
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
                    {col.items.map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <span style={{ color: col.color, fontSize: 12, flexShrink: 0, marginTop: 2 }}>{col.color === TEAL ? "→" : "×"}</span>
                        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.2)", padding: "24px 32px", display: "flex", alignItems: "flex-start", gap: 20 }}>
              <div style={{ flexShrink: 0, width: 3, alignSelf: "stretch", background: GOLD }} />
              <div>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.7, margin: "0 0 8px", fontStyle: "italic" }}>
                  "The objective isn't necessarily to convert on fourth down. The real advantage is that the offense can call plays differently throughout the entire series because a fourth down may be available."
                </p>
                <p style={{ fontSize: 11, color: "rgba(201,168,76,0.7)", fontWeight: 700, letterSpacing: "0.08em", margin: 0 }}>
                  The enterprise equivalent: 180 protocols pre-staged changes how the organization operates every day — not just the day a trigger fires.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Questions — 3 strongest */}
        <div style={{ padding: "64px 48px 0" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 20, height: 1.5, background: GOLD }} />
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD }}>Questions We Hear</span>
            </div>
            <h3 style={{ ...GEO, fontSize: "clamp(22px,2.8vw,32px)", fontWeight: 700, color: "#fff", marginBottom: 36, lineHeight: 1.3 }}>
              Before leaders move forward, they ask these.
            </h3>
            <div style={{ display: "grid", gap: 2 }}>
              {[
                {
                  q: "What does \"30 days compressed to 12 minutes\" actually mean?",
                  a: "It means the mobilization cycle — who owns what, who decides, what gets staged, what sequence activates — is compressed from weeks to minutes. Execution quality improves because the sequence is already built before the trigger fires.",
                },
                {
                  q: "Is AI making decisions for us?",
                  a: "No. AI monitors signals and prepares context. Executives authorize activation. Authority stays human at every step. No Readiness Protocol activates without executive sign-off.",
                },
                {
                  q: "How is this different from Copilot or workflow tools?",
                  a: "Copilot helps with intelligence and drafting. Workflow tools track tasks after people align. Readiness OS orchestrates the cross-functional response the moment a situation presents itself — before the stakeholder chaos starts.",
                },
                {
                  q: "What does 12 minutes look like in a real, messy enterprise environment — not the best case?",
                  a: "Honest answer: in highly prepared environments with pre-assigned authority, executions have run in 8 minutes. In typical large enterprises, the range is 12–18 minutes. In complex multi-geography organizations with multiple approval layers, 18–25 minutes. In every environment with Readiness OS: never 30 days. The 12-minute target is the design benchmark — the preparation cycle is what eliminates the 30-day mobilization lag, regardless of where in that range a specific activation lands.",
                },
              ].map((item, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1.7fr", border: "1px solid rgba(255,255,255,0.08)", borderTopWidth: i === 0 ? 1 : 0 }}>
                  <div style={{ padding: "22px 28px", borderRight: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD, marginBottom: 8 }}>Q{String(i + 1).padStart(2, "0")}</div>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 600, color: "#fff", lineHeight: 1.45, margin: 0 }}>{item.q}</p>
                  </div>
                  <div style={{ padding: "22px 32px", background: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center" }}>
                    <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.75, margin: 0 }}>{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ADVANCE Closed-Loop Section */}
        <div style={{ background: "rgba(43,138,110,0.06)", borderTop: "1px solid rgba(43,138,110,0.2)", borderBottom: "1px solid rgba(43,138,110,0.2)", padding: "64px 48px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL, display: "inline-block" }} />
              <span style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase" as const, color: TEAL }}>ADVANCE Closed-Loop Learning</span>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(26px,3vw,40px)", fontWeight: 700, color: "#fff", marginBottom: 12, lineHeight: 1.1 }}>
              Every activation makes the next one faster.
            </h2>
            <p style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontSize: 13, color: MUTED, maxWidth: 620, lineHeight: 1.7, marginBottom: 48 }}>
              The 12-minute execution is only the beginning. The moment an activation closes, Readiness OS opens a learning loop — updating protocols, generating causal hypotheses, and measuring actual time saved on the next trigger. The platform gets measurably better with every event.
            </p>

            {/* 5-stage loop */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 1, background: "rgba(255,255,255,0.06)" }}>
              {[
                { num: "01", label: "Activation", desc: "Protocol fires. 12-minute execution window opens. All tasks, stakeholders, and budget staged instantly.", color: GOLD },
                { num: "02", label: "Close-Out Gate", desc: "Formal structured debrief captures what happened, what deviated, and what caused it.", color: GOLD },
                { num: "03", label: "Update Generated", desc: "System extracts signal keywords and ownership gaps. Protocol update drafted automatically.", color: TEAL },
                { num: "04", label: "Applied + Delta", desc: "Protocol mutates. An immutable version delta is stored. A causal hypothesis is created: 'Expected −4 min.'", color: TEAL },
                { num: "05", label: "Hypothesis Measured", desc: "Next activation auto-measures actual vs. expected. Hypothesis classified: proven or disproven.", color: TEAL },
              ].map((stage, i) => (
                <div key={i} style={{ background: "rgba(10,15,46,0.7)", padding: "28px 22px" }}>
                  <div style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", color: stage.color, marginBottom: 10 }}>{stage.num}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 10, lineHeight: 1.2 }}>{stage.label}</div>
                  <div style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontSize: 11, color: MUTED, lineHeight: 1.6 }}>{stage.desc}</div>
                </div>
              ))}
            </div>

            {/* Moat metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "rgba(255,255,255,0.06)", marginTop: 1 }}>
              {[
                { stat: "212", label: "Protocols in the learning library", sub: "Every one evidence-eligible after first activation" },
                { stat: "Causal", label: "Hypotheses — not correlation", sub: "Expected vs. actual measured on every re-activation" },
                { stat: "Months", label: "To rebuild this on any competitor", sub: "The moat compounds with every activation" },
              ].map((m, i) => (
                <div key={i} style={{ background: "rgba(43,138,110,0.08)", padding: "24px 28px", borderTop: `2px solid ${TEAL}` }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: TEAL, marginBottom: 4 }}>{m.stat}</div>
                  <div style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontSize: 11, fontWeight: 700, color: "#fff", marginBottom: 4, textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>{m.label}</div>
                  <div style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontSize: 11, color: MUTED }}>{m.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding: "64px 48px 48px", textAlign: "center" }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <h2 style={{ ...GEO, fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 700, color: "#fff", marginBottom: 16 }}>
              Ready to experience it yourself?
            </h2>
            <p style={{ fontSize: 15, color: MUTED, marginBottom: 36, lineHeight: 1.7 }}>
              The 12-Minute Test Drive puts you in the role of an executive responding to a live trigger. Choose your scenario — watch the chain execute.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 }}>
              <Link href="/12-minute-experience">
                <button style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "14px 32px", background: GOLD, color: NAVY, border: "none", cursor: "pointer" }}>
                  Explore 12-Minute Experience →
                </button>
              </Link>
              <Link href="/request-access">
                <button style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "14px 32px", background: "transparent", color: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer" }}>
                  Request Founding Partner Access
                </button>
              </Link>
            </div>

            {/* AI monitors callout */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 24px", border: "1px solid rgba(43,138,110,0.3)", background: "rgba(43,138,110,0.07)" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL, flexShrink: 0, display: "inline-block" }} />
              <span style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "rgba(43,138,110,0.85)" }}>
                AI monitors · Executives authorize · Authority stays human at every step
              </span>
            </div>
          </div>
        </div>

        {/* Decision Path strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "rgba(255,255,255,0.05)", margin: "0 48px 0" }}>
          {[
            { q: "Not ready to commit?", cta: "Explore 12-Minute Experience", href: "/12-minute-experience", highlight: false },
            { q: "Ready to evaluate?", cta: "Request Founding Partner Access", href: "/request-access", highlight: true },
            { q: "Ready to deploy?", cta: "Apply for Full Access", href: "/request-access", highlight: false },
          ].map((p, i) => (
            <Link key={i} href={p.href} style={{ display: "block", background: NAVY, padding: "20px 24px", textDecoration: "none", borderTop: `2px solid ${p.highlight ? GOLD : "rgba(255,255,255,0.08)"}` }}>
              <div style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.38)", letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 6 }}>{p.q}</div>
              <div style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontSize: 12, fontWeight: 700, color: p.highlight ? GOLD : "rgba(255,255,255,0.5)", letterSpacing: "0.04em" }}>{p.cta} →</div>
            </Link>
          ))}
        </div>

      </div>
    </PageLayout>
  );
}
