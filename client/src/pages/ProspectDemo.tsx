import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Zap, CheckCircle2, Clock, Activity, ChevronRight, ArrowRight } from "lucide-react";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const MUTED = "#6B7280";
const BORDER = "#E8E4DC";
const OFF = "#F8F7F4";

const DOMAINS = [
  "Financial Strategy",
  "Market Dynamics",
  "Operational Excellence",
  "Technology & Innovation",
  "AI Governance",
  "Brand & Reputation",
  "Regulatory & Compliance",
  "Talent & Leadership",
];

const INDUSTRY_SCENARIOS: Record<string, {
  trigger: string; source: string; confidence: number; keywords: string[];
  impact: string; playbookHint: string; urgency: string;
}> = {
  "Financial Strategy": {
    trigger: "Federal Reserve Rate Decision — Capital Exposure Detected",
    source: "Federal Reserve + SEC EDGAR",
    confidence: 96,
    keywords: ["interest rate", "capital requirements", "balance sheet impact", "credit exposure", "liquidity risk"],
    impact: "$2.4B capital exposure identified",
    playbookHint: "Regulatory Capital Response",
    urgency: "Board notification window: 4 hours",
  },
  "Market Dynamics": {
    trigger: "Competitor Product Launch — Direct Market Overlap Identified",
    source: "CNBC Business + MarketWatch",
    confidence: 94,
    keywords: ["competitor launch", "market disruption", "pricing pressure", "customer churn risk", "market share"],
    impact: "22% market share segment at risk",
    playbookHint: "Aggressive Pricing Disruption",
    urgency: "Competitive response window: 72 hours",
  },
  "Operational Excellence": {
    trigger: "Tier-1 Supplier Disruption Signal — 14 Facilities Affected",
    source: "Supply Chain Monitor + NPR Business",
    confidence: 91,
    keywords: ["supply disruption", "supplier failure", "production halt", "logistics breakdown", "inventory risk"],
    impact: "$1.4M/day operational exposure",
    playbookHint: "Supply Chain Disruption Response",
    urgency: "Production continuity window: 48 hours",
  },
  "Technology & Innovation": {
    trigger: "AI Competitive Disruption — Core Product Category Under Threat",
    source: "CNBC Business + Google News",
    confidence: 94,
    keywords: ["AI disruption", "technology displacement", "competitive threat", "product obsolescence", "market shift"],
    impact: "Core product category threatened",
    playbookHint: "AI Competitive Disruption",
    urgency: "Strategic response window: 30 days",
  },
  "AI Governance": {
    trigger: "AI Regulatory Framework Change — Compliance Deadline Activated",
    source: "Federal Register + SEC EDGAR",
    confidence: 93,
    keywords: ["AI regulation", "compliance mandate", "governance gap", "regulatory deadline", "audit risk"],
    impact: "Compliance deadline in 60 days",
    playbookHint: "AI Model Risk Governance",
    urgency: "Policy alignment required: 14 days",
  },
  "Brand & Reputation": {
    trigger: "Reputational Crisis Signal — Social Velocity Spike Detected",
    source: "BBC Business + Google News Finance",
    confidence: 89,
    keywords: ["reputational risk", "social media crisis", "brand exposure", "media velocity", "stakeholder concern"],
    impact: "$4.8M brand value at risk",
    playbookHint: "Reputational Crisis Response",
    urgency: "Crisis response window: 4 hours",
  },
  "Regulatory & Compliance": {
    trigger: "SEC Investigation Notice — Industry Pattern Match",
    source: "SEC EDGAR + MarketWatch",
    confidence: 92,
    keywords: ["SEC investigation", "regulatory action", "compliance violation", "enforcement risk", "disclosure required"],
    impact: "$340M regulatory exposure",
    playbookHint: "SEC Investigation Response",
    urgency: "Legal response window: 24 hours",
  },
  "Talent & Leadership": {
    trigger: "C-Suite Departure Signal — Succession Gap Identified",
    source: "Entrepreneur + Google News",
    confidence: 88,
    keywords: ["executive departure", "leadership gap", "succession risk", "board notification", "talent crisis"],
    impact: "Succession gap across 3 divisions",
    playbookHint: "C-Suite Departure Response",
    urgency: "Board briefing required: 48 hours",
  },
};

export default function ProspectDemo() {
  const [, setLocation] = useLocation();
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("Financial Strategy");
  const [stage, setStage] = useState<"setup" | "alert" | "execution">("setup");
  const [confidence, setConfidence] = useState(0);
  const [clockSeconds, setClockSeconds] = useState(0);
  const [activatedSteps, setActivatedSteps] = useState<number[]>([]);

  const scenario = INDUSTRY_SCENARIOS[industry] || INDUSTRY_SCENARIOS["Financial Strategy"];

  const { data: playbooksRaw } = useQuery<any>({
    queryKey: ["/api/playbook-library"],
    enabled: stage !== "setup",
  });
  const allPlaybooks = Array.isArray(playbooksRaw?.playbooks) ? playbooksRaw.playbooks : [];
  const domainPlaybooks = allPlaybooks.filter((p: any) => p.domain === industry).slice(0, 4);

  useEffect(() => {
    if (stage !== "alert") return;
    let val = 0;
    const interval = setInterval(() => {
      val += 3;
      setConfidence(Math.min(val, scenario.confidence));
      if (val >= scenario.confidence) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [stage, scenario.confidence]);

  useEffect(() => {
    if (stage !== "execution") return;
    const timer = setInterval(() => setClockSeconds(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, [stage]);

  useEffect(() => {
    if (stage !== "execution") return;
    const steps = [0, 1, 2, 3, 4, 5];
    steps.forEach((step, i) => {
      setTimeout(() => setActivatedSteps(prev => [...prev, step]), i * 900);
    });
  }, [stage]);

  const clockDisplay = `${String(Math.floor(clockSeconds / 60)).padStart(2, "0")}:${String(clockSeconds % 60).padStart(2, "0")}`;

  const EXEC_STEPS = [
    "Trigger matched to playbook library",
    `${scenario.playbookHint} — activated`,
    "Stakeholder notification dispatched",
    "Task assignments created",
    "Executive briefing generated",
    "War room standing by",
  ];

  if (stage === "setup") {
    return (
      <div style={{ minHeight: "100vh", background: NAVY, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(201,168,76,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.06) 1px,transparent 1px)",
          backgroundSize: "48px 48px"
        }} />
        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 540 }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <VaughnMartinLogo height={80} variant="full" color="light" />
          </div>

          <div style={{ background: "rgba(255,255,255,0.04)", border: `1px solid rgba(201,168,76,0.3)`, padding: "40px 40px 36px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, marginBottom: 12, textAlign: "center" }}>
              Personalized Executive Demo
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "#fff", textAlign: "center", marginBottom: 8, fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.3 }}>
              Experience Command OS for Your Organization
            </h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", textAlign: "center", marginBottom: 36, lineHeight: 1.6 }}>
              Enter your company and strategic domain. We'll show you a live trigger detection and execution response — built around your world.
            </p>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
                Company Name
              </label>
              <input
                type="text"
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="Acme Corporation"
                style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.06)", border: `1px solid rgba(255,255,255,0.15)`, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ marginBottom: 32 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
                Primary Strategic Domain
              </label>
              <select
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                style={{ width: "100%", padding: "12px 16px", background: NAVY, border: `1px solid rgba(255,255,255,0.15)`, color: "#fff", fontSize: 14, outline: "none", cursor: "pointer", boxSizing: "border-box" }}
              >
                {DOMAINS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => { if (company.trim()) setStage("alert"); else setStage("alert"); }}
              style={{ width: "100%", padding: "16px", background: GOLD, color: NAVY, border: "none", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", cursor: "pointer" }}
            >
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Activity size={14} />
                Launch Personalized Demo
              </span>
            </button>
          </div>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
            No login required · 3-minute experience · Tailored to your domain
          </p>
        </div>
      </div>
    );
  }

  if (stage === "alert") {
    const displayName = company.trim() || "Your Organization";
    return (
      <div style={{ minHeight: "100vh", background: NAVY, display: "flex", flexDirection: "column" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)",
          backgroundSize: "48px 48px"
        }} />

        {/* Header bar */}
        <div style={{ position: "relative", zIndex: 1, borderBottom: `1px solid rgba(201,168,76,0.2)`, padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <VaughnMartinLogo height={56} variant="full" color="light" />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF4444", animation: "pulse 1.5s infinite" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {displayName} · Live Detection Feed
            </span>
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
          <div style={{ width: "100%", maxWidth: 680 }}>

            {/* Alert card */}
            <div style={{ border: `1px solid rgba(239,68,68,0.5)`, background: "rgba(239,68,68,0.07)", padding: "8px 20px", marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
              <AlertTriangle size={14} color="#EF4444" />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#EF4444", textTransform: "uppercase", letterSpacing: "0.1em" }}>Live Trigger Detection — {industry}</span>
              <span style={{ marginLeft: "auto", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Just now</span>
            </div>

            <div style={{ border: `1px solid rgba(201,168,76,0.3)`, background: "rgba(255,255,255,0.03)", padding: "36px 40px" }}>
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: GOLD, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12 }}>
                  Trigger Detected — {scenario.source}
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", lineHeight: 1.35, margin: 0, fontFamily: "'Cormorant Garamond', serif" }}>
                  {scenario.trigger}
                </h2>
              </div>

              {/* Confidence meter */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>AI Confidence Score</span>
                  <span style={{ fontSize: 18, fontWeight: 700, color: confidence >= 90 ? TEAL : GOLD, fontFamily: "'Cormorant Garamond', serif" }}>{confidence}%</span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 0 }}>
                  <div style={{ height: "100%", width: `${confidence}%`, background: confidence >= 90 ? TEAL : GOLD, transition: "width 0.1s linear" }} />
                </div>
              </div>

              {/* Keywords */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Matched Signals</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {scenario.keywords.map((kw, i) => (
                    <span key={i} style={{ padding: "4px 12px", background: "rgba(43,138,110,0.15)", border: `1px solid rgba(43,138,110,0.3)`, fontSize: 11, color: "#3BAF8A", fontWeight: 600 }}>
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Impact + urgency */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
                <div style={{ background: "rgba(255,255,255,0.04)", border: `1px solid rgba(255,255,255,0.08)`, padding: "16px 20px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Estimated Impact</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{scenario.impact}</div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.04)", border: `1px solid rgba(255,255,255,0.08)`, padding: "16px 20px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Urgency</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: GOLD }}>{scenario.urgency}</div>
                </div>
              </div>

              {/* Recommended playbook */}
              <div style={{ background: "rgba(201,168,76,0.06)", border: `1px solid rgba(201,168,76,0.2)`, padding: "16px 20px", marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: GOLD, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Recommended Playbook</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{scenario.playbookHint}</div>
                </div>
                <span style={{ padding: "4px 12px", background: "rgba(43,138,110,0.2)", border: `1px solid rgba(43,138,110,0.4)`, fontSize: 10, fontWeight: 700, color: "#3BAF8A", textTransform: "uppercase" }}>PRE-STAGED</span>
              </div>

              <button
                onClick={() => setStage("execution")}
                style={{ width: "100%", padding: "18px", background: GOLD, color: NAVY, border: "none", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              >
                <Zap size={14} />
                Activate Response Protocol — Start 12-Minute Clock
              </button>
            </div>

            <p style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
              This is what {displayName} would see the moment a trigger fires. Everything pre-staged. Decision made in seconds.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Execution stage
  const displayName = company.trim() || "Your Organization";
  return (
    <div style={{ minHeight: "100vh", background: NAVY, display: "flex", flexDirection: "column" }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(201,168,76,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.04) 1px,transparent 1px)",
        backgroundSize: "48px 48px"
      }} />

      {/* Header */}
      <div style={{ position: "relative", zIndex: 1, borderBottom: `1px solid rgba(201,168,76,0.2)`, padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <VaughnMartinLogo height={56} variant="full" color="light" />
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Execution Clock</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: GOLD, fontFamily: "'Cormorant Garamond', serif" }}>{clockDisplay}</div>
          </div>
          <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.1)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: TEAL }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{displayName} · EXECUTING</span>
          </div>
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 1, flex: 1, padding: "40px", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>

          {/* Left: Execution steps */}
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: GOLD, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 8 }}>Live Execution Log</div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: 0, fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.3 }}>
                {scenario.playbookHint}
              </h2>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>{displayName} · {industry}</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {EXEC_STEPS.map((step, i) => {
                const isDone = activatedSteps.includes(i);
                return (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 14, padding: "14px 18px",
                    background: isDone ? "rgba(43,138,110,0.1)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isDone ? "rgba(43,138,110,0.3)" : "rgba(255,255,255,0.06)"}`,
                    transition: "all 0.4s ease"
                  }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: isDone ? "rgba(43,138,110,0.3)" : "rgba(255,255,255,0.06)" }}>
                      {isDone ? <CheckCircle2 size={12} color={TEAL} /> : <Clock size={11} color="rgba(255,255,255,0.2)" />}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: isDone ? 600 : 400, color: isDone ? "#fff" : "rgba(255,255,255,0.3)" }}>{step}</span>
                    {isDone && <span style={{ marginLeft: "auto", fontSize: 10, color: TEAL, fontWeight: 700 }}>DONE</span>}
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 24, padding: "20px", background: "rgba(201,168,76,0.06)", border: `1px solid rgba(201,168,76,0.2)` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: GOLD, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>vs. Traditional Response</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
                Without Command OS, {displayName} would still be scheduling the first alignment call.
                The mobilization cycle alone typically runs <strong style={{ color: "#fff" }}>30 days</strong>. This clock has been running for <strong style={{ color: GOLD }}>{clockDisplay}</strong>.
              </div>
            </div>
          </div>

          {/* Right: Relevant playbooks */}
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>Playbooks Armed — {industry}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Pre-staged across your domain. Ready before the trigger fires.</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {domainPlaybooks.length > 0 ? domainPlaybooks.map((p: any) => (
                <div key={p.id} style={{ padding: "16px 20px", background: "rgba(255,255,255,0.04)", border: `1px solid rgba(255,255,255,0.08)`, display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 32, height: 32, background: "rgba(201,168,76,0.12)", border: `1px solid rgba(201,168,76,0.2)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Zap size={13} color={GOLD} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 2 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: MUTED }}>{p.strategicCategory} · {p.domain}</div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: TEAL, textTransform: "uppercase" }}>Ready</span>
                </div>
              )) : [1,2,3,4].map(i => (
                <div key={i} style={{ padding: "16px 20px", background: "rgba(255,255,255,0.04)", border: `1px solid rgba(255,255,255,0.08)`, display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 32, height: 32, background: "rgba(201,168,76,0.12)", border: `1px solid rgba(201,168,76,0.2)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Zap size={13} color={GOLD} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ height: 13, background: "rgba(255,255,255,0.08)", width: "70%", marginBottom: 6 }} />
                    <div style={{ height: 10, background: "rgba(255,255,255,0.04)", width: "45%" }} />
                  </div>
                </div>
              ))}
            </div>

            {/* CTA strip */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: `1px solid rgba(201,168,76,0.25)`, padding: "24px 24px" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 8, fontFamily: "'Cormorant Garamond', serif" }}>
                See this live in {displayName}'s environment
              </div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 20, lineHeight: 1.6 }}>
                This demo used generic data. A pilot deploys your specific triggers, your stakeholder map, and your org's playbook configurations — in 2 weeks.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button
                  onClick={() => setLocation("/request-access")}
                  style={{ padding: "14px", background: GOLD, color: NAVY, border: "none", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                >
                  <ArrowRight size={14} />
                  Request Pilot for {displayName}
                </button>
                <button
                  onClick={() => setLocation("/prospect-brief")}
                  style={{ padding: "12px", background: "transparent", color: "rgba(255,255,255,0.6)", border: `1px solid rgba(255,255,255,0.15)`, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", cursor: "pointer" }}
                >
                  Generate Executive Brief for This Meeting
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}
