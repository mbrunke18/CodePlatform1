import { useState } from "react";
import { useLocation } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import { CheckCircle, Lock, Zap, Brain, Shield, TrendingUp, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";

const SCENARIOS = [
  {
    id: "activist",
    label: "Activist Investor Filing",
    protocol: "#31",
    trigger: "SEC 13D filing detected — 5.2% stake, board seats demanded",
    urgency: "72-hour window before proxy period opens",
    domain: "GROWTH & POSITIONING",
    domainColor: NAVY,
  },
  {
    id: "ransomware",
    label: "Ransomware Detection",
    protocol: "#52",
    trigger: "Lateral movement detected across 3 network segments",
    urgency: "Immediate — every hour of delay = $2M–$5M additional exposure",
    domain: "RISK & RESILIENCE",
    domainColor: TEAL,
  },
  {
    id: "launch",
    label: "Competitor Product Launch",
    protocol: "#89",
    trigger: "Primary competitor launches direct substitute — 40% price undercut",
    urgency: "7-day window before customer re-evaluation cycle begins",
    domain: "GROWTH & POSITIONING",
    domainColor: NAVY,
  },
];

type PhaseKey = "detection" | "warning" | "preparation" | "authorization" | "learning";

const PHASES: { id: PhaseKey; label: string; sublabel: string }[] = [
  { id: "detection", label: "Signal Detection", sublabel: "When does each tier know?" },
  { id: "warning", label: "Advance Warning", sublabel: "How much runway?" },
  { id: "preparation", label: "Preparation Tools", sublabel: "What helps you get ready?" },
  { id: "authorization", label: "Authorization Moment", sublabel: "What the executive sees" },
  { id: "learning", label: "Post-Activation", sublabel: "What the system learns" },
];

type TierKey = "core" | "foresight" | "enterprise";

interface TierCapability {
  headline: string;
  points: string[];
  exclusive?: string[];
  locked?: string[];
}

type ScenarioPhaseData = Record<PhaseKey, Record<TierKey, TierCapability>>;
type ScenariosData = Record<string, ScenarioPhaseData>;

const SCENARIO_DATA: ScenariosData = {
  activist: {
    detection: {
      core: {
        headline: "Detected at trigger threshold",
        points: [
          "SEC EDGAR RSS feed scans every 15 minutes",
          "13D filing matched against Activist Investor trigger pattern",
          "Risk scored HIGH — escalated to dashboard immediately",
          "Protocol #31 surfaced as primary response",
        ],
      },
      foresight: {
        headline: "Detected + 48hr predictive alert",
        points: [
          "Same 15-minute detection as Core",
          "Predictive model flagged activist accumulation 48hrs earlier",
          "Alert fired when stake reached 3.8% — before filing threshold",
          "Protocol #31 pre-staged before the filing was public",
        ],
        exclusive: ["48-hour advance signal based on accumulation pattern"],
      },
      enterprise: {
        headline: "Detected + 72hr foresight + peer intelligence",
        points: [
          "Same 15-minute detection as Core",
          "72-hour foresight from options flow and block trade analysis",
          "Cross-client pattern: this activist filed at 2 similar companies in 18 months",
          "Peer response playbook available from network",
        ],
        exclusive: ["72-hour foresight window", "Cross-client activist pattern intelligence"],
      },
    },
    warning: {
      core: {
        headline: "0 hours advance warning",
        points: [
          "Detection happens at or after filing",
          "12-minute mobilization begins from trigger point",
          "All 24 protocol tasks staged and ready",
        ],
        locked: ["Predictive alert window not available at Core"],
      },
      foresight: {
        headline: "48 hours advance preparation",
        points: [
          "Preparation window: 48 hours before filing goes public",
          "IR team, legal, and board chair pre-notified quietly",
          "Response messaging pre-drafted and awaiting approval",
          "12-minute activation fires when filing is confirmed",
        ],
        exclusive: ["48-hour preparation runway before competitors know"],
      },
      enterprise: {
        headline: "72 hours advance + network context",
        points: [
          "72-hour preparation window from foresight signals",
          "Dedicated account team pre-briefs key executives privately",
          "Network intelligence: similar companies used Protocol #31b — suggest variant",
          "Board chair pre-read delivered 60 hours before event is public",
        ],
        exclusive: ["72-hour preparation window", "Dedicated team pre-briefing", "Network-sourced protocol variant"],
      },
    },
    preparation: {
      core: {
        headline: "Protocol #31 fully staged",
        points: [
          "24 tasks pre-assigned to 8 stakeholders",
          "Budget allocation pre-approved: $850K",
          "IR statement templates ready",
          "Board communication cascade staged",
        ],
      },
      foresight: {
        headline: "Protocol #31 staged + Digital Twin rehearsal",
        points: [
          "All Core preparation included",
          "Digital Twin: ran 3 activation simulations in advance",
          "Optimal stakeholder sequence identified from simulation",
          "Board chair response confidence score: 94%",
        ],
        exclusive: ["Digital Twin simulation — rehearse before the real thing", "Optimal path identified before activation"],
      },
      enterprise: {
        headline: "Protocol #31 staged + Digital Twin + institutional memory",
        points: [
          "All Foresight preparation included",
          "Institutional memory: last activist response logged — 3 improvements applied",
          "Dedicated team joined stakeholder briefing 48hrs in advance",
          "Custom protocol variant built from network intelligence",
        ],
        exclusive: ["Institutional memory from previous activist encounters", "Custom protocol variant from network patterns"],
      },
    },
    authorization: {
      core: {
        headline: "Executive decision in 4 minutes",
        points: [
          "Activation brief delivered to CEO and General Counsel",
          "24 pre-staged tasks shown — 1-click to authorize",
          "Budget release pre-approved by CFO",
          "Full team mobilized in 12 minutes from authorization",
        ],
      },
      foresight: {
        headline: "Executive decision with rehearsal confidence",
        points: [
          "All Core authorization included",
          "Digital Twin result shown: activation rehearsed successfully",
          "Confidence indicator: 3 simulations, 0 critical path failures",
          "CEO authorizes with full outcome preview",
        ],
        exclusive: ["Pre-activation rehearsal summary shown at decision point"],
      },
      enterprise: {
        headline: "Executive decision with peer precedent",
        points: [
          "All Foresight authorization included",
          "Authorization Precedent Panel: how 3 peer companies authorized this exact trigger",
          "Dedicated advisor available on a 15-minute call before authorization",
          "Board chair pre-cleared — authorization cascade ready",
        ],
        exclusive: ["Peer authorization precedents shown at decision", "Dedicated advisor available pre-authorization"],
      },
    },
    learning: {
      core: {
        headline: "Debrief logged and closed",
        points: [
          "Activation close-out form completed",
          "Outcome classified: Optimization / Mixed-Signal / Recovery",
          "Response time logged: 11 minutes 47 seconds",
          "Debrief stored for future reference",
        ],
      },
      foresight: {
        headline: "Debrief + ADVANCE causal learning",
        points: [
          "All Core close-out included",
          "ADVANCE hypothesis generated: 'Adjusted stakeholder sequence should save 2 min'",
          "Next activation of Protocol #31 will test that hypothesis automatically",
          "Learning Velocity Index updated",
        ],
        exclusive: ["Causal hypothesis generated", "Next activation automatically tests improvement"],
      },
      enterprise: {
        headline: "Debrief + ADVANCE + network contribution",
        points: [
          "All Foresight learning included",
          "Proven improvement shared with Enterprise network (opt-in)",
          "Institutional memory updated: 4th activist encounter encoded",
          "Protocol #31 now measurably sharper — no competitor can buy this history",
        ],
        exclusive: ["Proven improvements shared across Enterprise client network", "Institutional memory compounds across every activation"],
      },
    },
  },
  ransomware: {
    detection: {
      core: {
        headline: "Detected at threshold crossing",
        points: [
          "Cybersecurity RSS feeds scanned every 15 minutes",
          "Lateral movement pattern matched against Protocol #52",
          "Risk scored CRITICAL — immediate escalation",
          "CISO and IT team notified within 2 minutes of detection",
        ],
      },
      foresight: {
        headline: "Detected + 48hr threat trajectory alert",
        points: [
          "Same 15-minute detection as Core",
          "Anomalous authentication patterns flagged 48hrs prior",
          "Alert fired before lateral movement began — containment window opened",
          "Protocol #52 pre-staged before attack fully deployed",
        ],
        exclusive: ["48-hour early warning from authentication anomaly pattern"],
      },
      enterprise: {
        headline: "Detected + 72hr + sector threat intelligence",
        points: [
          "Same 15-minute detection as Core",
          "72-hour threat actor attribution from sector feeds",
          "Cross-client: same threat actor active at 2 peer companies this week",
          "Sector-specific Protocol #52b variant pre-staged",
        ],
        exclusive: ["72-hour threat intelligence window", "Active threat actor intelligence across Enterprise network"],
      },
    },
    warning: {
      core: {
        headline: "0 hours advance — immediate activation",
        points: [
          "Detection triggers immediate Protocol #52 activation",
          "12-minute mobilization: CISO, Legal, Comms, and Executive team staged",
          "Ransomware playbook ready — no delay from coordination",
        ],
        locked: ["Predictive threat window not available at Core"],
      },
      foresight: {
        headline: "48-hour containment opportunity",
        points: [
          "Authentication anomaly detected 48hrs before lateral movement",
          "IT security team quietly contained 2 of 3 entry vectors before attack",
          "Protocol #52 fires at a lower severity level — faster resolution",
          "Estimated damage reduction: 60–80%",
        ],
        exclusive: ["48-hour head start on containment — reduces severity at activation"],
      },
      enterprise: {
        headline: "72-hour threat intelligence + sector context",
        points: [
          "72-hour threat actor profile built before first contact",
          "Dedicated team coordinates with IT security before event goes critical",
          "Peer company response playbook: same actor, resolved in 9 hours",
          "Protocol #52b pre-staged with peer-informed containment sequence",
        ],
        exclusive: ["72-hour threat actor intelligence", "Peer resolution playbook from same threat actor"],
      },
    },
    preparation: {
      core: {
        headline: "Protocol #52 fully staged",
        points: [
          "32 tasks pre-assigned: IT isolation, legal hold, IR notification",
          "Ransomware response budget pre-released: $2.1M",
          "External forensics firm on standby — pre-contracted",
          "Regulatory notification templates ready (SEC, FTC, state)",
        ],
      },
      foresight: {
        headline: "Protocol #52 staged + Digital Twin",
        points: [
          "All Core preparation included",
          "Digital Twin: 4 ransomware scenarios simulated — optimal isolation sequence identified",
          "Simulation result: standard sequence misses a lateral path — corrected in pre-staging",
          "Response confidence: 91% — one critical path failure caught in rehearsal",
        ],
        exclusive: ["Digital Twin caught a critical path gap before the real activation"],
      },
      enterprise: {
        headline: "Protocol #52b staged + institutional memory",
        points: [
          "All Foresight preparation included",
          "Institutional memory: 2 prior ransomware events — average resolution 11 hours",
          "Sector-specific variant built from peer network intelligence",
          "Dedicated account team joined IT security pre-briefing",
        ],
        exclusive: ["Sector-specific protocol variant", "Institutional memory from 2 prior events"],
      },
    },
    authorization: {
      core: {
        headline: "CEO + CISO authorization in 4 minutes",
        points: [
          "Executive brief: attack scope, staged response, cost authorization",
          "32 tasks shown — dual authorization (CISO operational + CEO financial)",
          "$2.1M release pre-approved, forensics firm engaged",
          "Full containment mobilization: 12 minutes",
        ],
      },
      foresight: {
        headline: "Authorization with rehearsal confidence",
        points: [
          "All Core authorization included",
          "Digital Twin result: critical path correction confirmed — lower risk",
          "Simulation confidence shown at authorization: 91%",
          "Decision time reduced — executive sees rehearsed outcome",
        ],
        exclusive: ["Rehearsal-informed confidence score at authorization point"],
      },
      enterprise: {
        headline: "Authorization with peer precedent + advisor",
        points: [
          "All Foresight authorization included",
          "Precedent Panel: peer company authorized identical protocol — resolved in 9 hours",
          "Dedicated advisor on call with CISO team during authorization",
          "Board notification pre-drafted and queued for post-authorization send",
        ],
        exclusive: ["Real peer precedent shown at authorization", "Advisor support during authorization"],
      },
    },
    learning: {
      core: {
        headline: "Debrief and close-out",
        points: [
          "Activation close-out: 14 hours total, Optimization classification",
          "Response time logged, regulatory notifications confirmed",
          "Protocol #52 improvements flagged for manual review",
        ],
      },
      foresight: {
        headline: "ADVANCE causal learning loop",
        points: [
          "All Core close-out included",
          "ADVANCE: 'Containment sequence change reduced resolution time by 3.2 hours'",
          "Hypothesis set: next activation will test adjusted isolation order",
          "Digital Twin updated with real activation data",
        ],
        exclusive: ["Causal learning loop: 3.2hr improvement hypothesis set for next activation"],
      },
      enterprise: {
        headline: "Network learning + institutional memory",
        points: [
          "All Foresight learning included",
          "Proven: isolation sequence improvement confirmed — shared with Enterprise network",
          "Institutional memory: 3 ransomware events now encoded, response time improving",
          "Sector benchmark updated: your response is now 31% faster than sector average",
        ],
        exclusive: ["Network improvement sharing", "Institutional memory compounding across events"],
      },
    },
  },
  launch: {
    detection: {
      core: {
        headline: "Detected at launch announcement",
        points: [
          "Competitor news feeds scanned every 15 minutes",
          "Product launch matched against Competitive Displacement trigger",
          "Protocol #89 surfaced — Go-to-Market Acceleration Sprint",
          "VP Sales and CMO notified within 2 minutes",
        ],
      },
      foresight: {
        headline: "Detected + 48hr competitive intelligence alert",
        points: [
          "Same detection as Core",
          "Patent filings and job postings flagged competitor launch 48hrs ahead",
          "Sales team pre-briefed before customers receive competitor outreach",
          "Competitive response messaging drafted before launch is announced",
        ],
        exclusive: ["48-hour competitive intelligence from patent/hiring signals"],
      },
      enterprise: {
        headline: "72hr competitive foresight + market context",
        points: [
          "Same detection as Core",
          "72-hour signal: analyst briefing scheduled, supply chain partner movement",
          "Cross-client: this competitor launched in 2 peer markets — outcome data available",
          "Peer win/loss data from Enterprise network: 73% retention rate with Protocol #89b",
        ],
        exclusive: ["72-hour competitive foresight", "Peer win/loss data from Enterprise network"],
      },
    },
    warning: {
      core: {
        headline: "0 hours — activate at announcement",
        points: [
          "Detection fires Protocol #89 immediately at announcement",
          "12-minute mobilization: Sales, Marketing, Product, and Finance staged",
          "Competitive response ready before first customer call",
        ],
        locked: ["Predictive competitive alert not available at Core"],
      },
      foresight: {
        headline: "48 hours before customers hear it",
        points: [
          "Sales team received competitive brief 48hrs before launch announcement",
          "Key accounts proactively contacted — loyalty conversations opened early",
          "Counter-messaging live on website before competitor's press release",
          "Protocol #89 fires at lower urgency — team already in motion",
        ],
        exclusive: ["48-hour head start — your team is briefed before customers are targeted"],
      },
      enterprise: {
        headline: "72 hours + peer market outcome data",
        points: [
          "Sales team briefed 72 hours before announcement",
          "Peer network data: win rate with proactive outreach vs. reactive = 73% vs. 41%",
          "Dedicated team coordinated analyst relations pre-announcement",
          "Custom Protocol #89b pre-staged with peer-informed counter-positioning",
        ],
        exclusive: ["72-hour preparation", "Peer win/loss data informs counter-strategy"],
      },
    },
    preparation: {
      core: {
        headline: "Protocol #89 fully staged",
        points: [
          "28 tasks pre-assigned: Sales enablement, Marketing, Pricing review, Retention",
          "Counter-messaging templates ready",
          "At-risk account list pre-identified",
          "Emergency pricing authority pre-approved",
        ],
      },
      foresight: {
        headline: "Protocol #89 staged + Digital Twin rehearsal",
        points: [
          "All Core preparation included",
          "Digital Twin: modeled 3 competitive response scenarios — optimal messaging path chosen",
          "Simulation: aggressive pricing response vs. value-reframe — value wins in 2 of 3 scenarios",
          "Sales team rehearsed competitive objection handling before first customer call",
        ],
        exclusive: ["Digital Twin tested 3 counter-strategies — optimal path identified before launch"],
      },
      enterprise: {
        headline: "Protocol #89b staged + institutional memory",
        points: [
          "All Foresight preparation included",
          "Institutional memory: 2 prior competitive launches — 89% retention when Protocol #89 activated",
          "Custom Protocol #89b built from peer network win/loss data",
          "Dedicated team prepared board-level competitive brief",
        ],
        exclusive: ["89% retention rate from prior activations encoded in protocol", "Custom protocol from peer network intelligence"],
      },
    },
    authorization: {
      core: {
        headline: "CEO + CMO authorization in 4 minutes",
        points: [
          "Brief: competitor profile, at-risk accounts, response plan, budget",
          "28 tasks shown — authorization releases $640K response budget",
          "Sales and Marketing fully mobilized in 12 minutes",
        ],
      },
      foresight: {
        headline: "Authorization with strategy rehearsal result",
        points: [
          "All Core authorization included",
          "Digital Twin result shown: value-reframe strategy projected 74% retention",
          "CEO sees optimal path chosen — not reactive, deliberate",
          "Confidence: 3 simulations, strategy validated",
        ],
        exclusive: ["Strategy rehearsal result shown at authorization — decision is informed, not reactive"],
      },
      enterprise: {
        headline: "Authorization with peer precedent + market data",
        points: [
          "All Foresight authorization included",
          "Precedent Panel: similar launch at peer company — Protocol #89b achieved 73% retention",
          "Dedicated advisor recommends activation variant based on network data",
          "Board pre-read already delivered — authorization is confirmation, not discovery",
        ],
        exclusive: ["Peer outcome data at authorization", "Board already pre-read — executive decision is confirmation"],
      },
    },
    learning: {
      core: {
        headline: "Debrief and close-out",
        points: [
          "Activation close-out: 91% account retention at 30 days",
          "Outcome: Optimization — response was faster than previous events",
          "Protocol #89 improvements flagged for next occurrence",
        ],
      },
      foresight: {
        headline: "ADVANCE causal learning",
        points: [
          "All Core close-out included",
          "ADVANCE: 'Value-reframe messaging retained 8% more accounts than price-match'",
          "Hypothesis confirmed — protocol updated for next competitive launch",
          "Confidence in Protocol #89 now evidence-based, not opinion-based",
        ],
        exclusive: ["Value-reframe advantage quantified and locked into protocol — competitor can't copy this data"],
      },
      enterprise: {
        headline: "Network learning + institutional moat",
        points: [
          "All Foresight learning included",
          "Proven improvement shared with Enterprise network (opt-in)",
          "Institutional memory: 3 competitive launches encoded — 91% average retention",
          "No competitor can buy 3 years of competitive response data. They have to live it.",
        ],
        exclusive: ["Institutional competitive response history — 3 years, 3 launches, 91% retention", "Network sharing accelerates your learning"],
      },
    },
  },
};

const TIER_META = {
  core: { label: "Core", price: "$150K / yr", color: NAVY, textColor: "#fff", accent: GOLD },
  foresight: { label: "Foresight", price: "$250K / yr", color: TEAL, textColor: "#fff", accent: GOLD },
  enterprise: { label: "Enterprise", price: "$450K / yr", color: IVORY, textColor: NAVY, accent: GOLD },
};

export default function TierComparisonDemo() {
  const [, setLocation] = useLocation();
  const [selectedScenario, setSelectedScenario] = useState("activist");
  const [activePhase, setActivePhase] = useState<PhaseKey>("detection");
  const [expandedPhase, setExpandedPhase] = useState<PhaseKey | null>(null);

  const scenario = SCENARIOS.find(s => s.id === selectedScenario)!;
  const phaseData = SCENARIO_DATA[selectedScenario][activePhase];

  return (
    <PageLayout>
      {/* Hero */}
      <div style={{ background: NAVY, padding: "4rem 2rem 3rem", textAlign: "center" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD, marginBottom: 12 }}>
            Tier Comparison — Live Demo
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 5vw, 3.25rem)", fontWeight: 600, color: "#fff", margin: "0 0 1rem", lineHeight: 1.15 }}>
            See exactly what each tier does<br />
            <span style={{ color: GOLD }}>when the trigger fires.</span>
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", margin: "0 0 2.5rem", lineHeight: 1.7, maxWidth: 620, marginLeft: "auto", marginRight: "auto" }}>
            Same trigger. Same platform. Three different levels of preparation, warning, and intelligence. Pick a scenario and walk through every phase side by side.
          </p>

          {/* Scenario selector */}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            {SCENARIOS.map(s => (
              <button
                key={s.id}
                onClick={() => { setSelectedScenario(s.id); setActivePhase("detection"); }}
                style={{
                  padding: "10px 20px", border: `1px solid ${selectedScenario === s.id ? GOLD : "rgba(255,255,255,0.2)"}`,
                  background: selectedScenario === s.id ? "rgba(201,168,76,0.12)" : "transparent",
                  color: selectedScenario === s.id ? GOLD : "rgba(255,255,255,0.7)",
                  fontSize: 12, fontWeight: 700, cursor: "pointer", letterSpacing: "0.03em",
                  transition: "all 0.15s ease",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Trigger context bar */}
      <div style={{ background: "#0d1435", borderBottom: "1px solid rgba(201,168,76,0.2)", padding: "1rem 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, flexShrink: 0 }}>
            {scenario.domain}
          </div>
          <div style={{ width: 1, height: 14, background: "rgba(255,255,255,0.15)" }} />
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", flexShrink: 0 }}>
            Protocol {scenario.protocol}
          </div>
          <div style={{ width: 1, height: 14, background: "rgba(255,255,255,0.15)" }} />
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: 500, flex: 1 }}>{scenario.trigger}</div>
          <div style={{ fontSize: 11, color: "#EF4444", fontWeight: 700, flexShrink: 0 }}>⚡ {scenario.urgency}</div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ background: "#F8F7F4", minHeight: "60vh" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 0 }}>

            {/* Phase nav */}
            <div style={{ borderRight: "1px solid #E2DDD5", paddingTop: "2rem", paddingRight: "1.5rem", paddingBottom: "2rem" }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: 12 }}>
                Activation Phases
              </div>
              {PHASES.map((phase, i) => (
                <button
                  key={phase.id}
                  onClick={() => setActivePhase(phase.id)}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: 10, width: "100%",
                    padding: "12px 14px", marginBottom: 4, cursor: "pointer", textAlign: "left",
                    background: activePhase === phase.id ? "#fff" : "transparent",
                    border: `1px solid ${activePhase === phase.id ? "#E2DDD5" : "transparent"}`,
                    borderLeft: activePhase === phase.id ? `3px solid ${GOLD}` : "3px solid transparent",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%", flexShrink: 0, marginTop: 1,
                    background: activePhase === phase.id ? NAVY : "#E8E4DC",
                    color: activePhase === phase.id ? "#fff" : "#9CA3AF",
                    fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{i + 1}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: activePhase === phase.id ? NAVY : "#374151", lineHeight: 1.3 }}>
                      {phase.label}
                    </div>
                    <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>{phase.sublabel}</div>
                  </div>
                </button>
              ))}

              <div style={{ marginTop: 24, padding: "1rem", background: "rgba(10,15,46,0.04)", border: "1px solid #E2DDD5" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: NAVY, marginBottom: 6 }}>
                  Color Key
                </div>
                {[
                  { color: "rgba(43,138,110,0.08)", border: `1px solid ${TEAL}`, label: "Foresight / Enterprise exclusive" },
                  { color: "rgba(10,15,46,0.04)", border: "1px solid #E2DDD5", label: "Available at all tiers" },
                  { color: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.25)", label: "Not available at this tier" },
                ].map(k => (
                  <div key={k.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                    <div style={{ width: 12, height: 12, flexShrink: 0, background: k.color, border: k.border }} />
                    <div style={{ fontSize: 9, color: "#6B7280", lineHeight: 1.4 }}>{k.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Three-column comparison */}
            <div style={{ paddingLeft: "1.5rem", paddingTop: "2rem", paddingBottom: "2rem" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 4 }}>
                {PHASES.find(p => p.id === activePhase)?.label}
              </div>
              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 20 }}>
                {PHASES.find(p => p.id === activePhase)?.sublabel}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {(["core", "foresight", "enterprise"] as TierKey[]).map(tier => {
                  const meta = TIER_META[tier];
                  const data = phaseData[tier];
                  return (
                    <div
                      key={tier}
                      style={{
                        background: "#fff",
                        border: tier === "foresight" ? `2px solid ${TEAL}` : "1px solid #E2DDD5",
                        display: "flex", flexDirection: "column",
                      }}
                    >
                      {/* Tier header */}
                      <div style={{ background: meta.color, padding: "14px 16px 12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div>
                            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: tier === "enterprise" ? "#9CA3AF" : "rgba(255,255,255,0.55)", marginBottom: 3 }}>
                              {tier === "core" ? "Tier 1" : tier === "foresight" ? "Tier 2" : "Tier 3"}
                            </div>
                            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: meta.textColor, lineHeight: 1 }}>{meta.label}</div>
                          </div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: tier === "enterprise" ? "#9CA3AF" : "rgba(255,255,255,0.6)", textAlign: "right" }}>
                            {meta.price}
                          </div>
                        </div>
                      </div>

                      {/* Capability headline */}
                      <div style={{ padding: "14px 16px 0" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: NAVY, lineHeight: 1.4, marginBottom: 12 }}>
                          {data.headline}
                        </div>

                        {/* Standard points */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {data.points.map(pt => (
                            <div key={pt} style={{ display: "flex", gap: 7, alignItems: "flex-start", padding: "6px 8px", background: "rgba(10,15,46,0.02)", border: "1px solid #F0EDE4" }}>
                              <CheckCircle size={10} color={TEAL} style={{ flexShrink: 0, marginTop: 2 }} />
                              <span style={{ fontSize: 11, color: "#374151", lineHeight: 1.5 }}>{pt}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Exclusive capabilities (Foresight/Enterprise only) */}
                      {data.exclusive && data.exclusive.length > 0 && (
                        <div style={{ padding: "10px 16px 0" }}>
                          {data.exclusive.map(ex => (
                            <div key={ex} style={{ display: "flex", gap: 7, alignItems: "flex-start", padding: "7px 8px", background: "rgba(43,138,110,0.06)", border: `1px solid ${TEAL}`, marginBottom: 5 }}>
                              <Zap size={10} color={TEAL} style={{ flexShrink: 0, marginTop: 2 }} />
                              <span style={{ fontSize: 11, color: TEAL, fontWeight: 600, lineHeight: 1.5 }}>{ex}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Locked capabilities */}
                      {data.locked && data.locked.length > 0 && (
                        <div style={{ padding: "10px 16px 0" }}>
                          {data.locked.map(lk => (
                            <div key={lk} style={{ display: "flex", gap: 7, alignItems: "flex-start", padding: "7px 8px", background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.2)", marginBottom: 5 }}>
                              <Lock size={10} color="#D1D5DB" style={{ flexShrink: 0, marginTop: 2 }} />
                              <span style={{ fontSize: 11, color: "#9CA3AF", lineHeight: 1.5 }}>{lk}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div style={{ flex: 1 }} />
                      <div style={{ height: 14 }} />
                    </div>
                  );
                })}
              </div>

              {/* Phase navigation buttons */}
              <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
                {PHASES.findIndex(p => p.id === activePhase) > 0 && (
                  <button
                    onClick={() => setActivePhase(PHASES[PHASES.findIndex(p => p.id === activePhase) - 1].id)}
                    style={{ padding: "8px 18px", border: "1px solid #E2DDD5", background: "#fff", color: NAVY, fontSize: 11, fontWeight: 700, cursor: "pointer" }}
                  >
                    ← Previous phase
                  </button>
                )}
                {PHASES.findIndex(p => p.id === activePhase) < PHASES.length - 1 ? (
                  <button
                    onClick={() => setActivePhase(PHASES[PHASES.findIndex(p => p.id === activePhase) + 1].id)}
                    style={{ padding: "8px 18px", background: NAVY, border: "none", color: GOLD, fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                  >
                    Next phase <ArrowRight size={12} />
                  </button>
                ) : (
                  <button
                    onClick={() => setLocation("/pricing")}
                    style={{ padding: "8px 18px", background: TEAL, border: "none", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                  >
                    See pricing <ArrowRight size={12} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary comparison strip */}
      <div style={{ background: "#fff", borderTop: "1px solid #E2DDD5", padding: "3rem 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, marginBottom: 8 }}>What separates the tiers</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 600, color: NAVY, margin: 0 }}>
              Core responds. Foresight prepares. Enterprise compounds.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              {
                tier: "Core", price: "$150K / yr", color: NAVY, textColor: "#fff",
                icon: <Shield size={16} color={GOLD} />,
                thesis: "The baseline no enterprise should be without.",
                differentiators: [
                  "12-minute response from any trigger",
                  "180 pre-staged Readiness Protocols",
                  "Executive authorization on every activation",
                  "Full debrief and close-out loop",
                ],
                cta: "Fully demonstrable now",
                ctaColor: GOLD,
              },
              {
                tier: "Foresight", price: "$250K / yr", color: TEAL, textColor: "#fff",
                icon: <Brain size={16} color={GOLD} />,
                thesis: "See it coming before it fires. Rehearse before you respond.",
                differentiators: [
                  "48-hour advance warning before trigger peaks",
                  "Digital Twin simulation — rehearse every activation",
                  "ADVANCE causal learning — protocols improve with evidence",
                  "3 custom protocol builds per year",
                ],
                cta: "Demo available by appointment",
                ctaColor: "rgba(255,255,255,0.7)",
              },
              {
                tier: "Enterprise", price: "$450K / yr", color: IVORY, textColor: NAVY,
                icon: <TrendingUp size={16} color={NAVY} />,
                thesis: "Institutional memory that no competitor can buy.",
                differentiators: [
                  "72-hour foresight + cross-client network intelligence",
                  "Unlimited custom protocol development",
                  "Institutional memory compounds across every activation",
                  "Dedicated account team — 4 specialists",
                ],
                cta: "Demo available by appointment",
                ctaColor: "#9CA3AF",
              },
            ].map(t => (
              <div key={t.tier} style={{ background: t.color, padding: "1.75rem", border: t.tier === "Foresight" ? `2px solid ${TEAL}` : "1px solid #E2DDD5" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  {t.icon}
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 600, color: t.textColor }}>{t.tier}</div>
                  <div style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: t.tier === "Enterprise" ? "#9CA3AF" : "rgba(255,255,255,0.55)" }}>{t.price}</div>
                </div>
                <div style={{ fontSize: 12, fontStyle: "italic", color: t.tier === "Enterprise" ? "#6B7280" : "rgba(255,255,255,0.75)", marginBottom: 14, lineHeight: 1.5 }}>
                  "{t.thesis}"
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                  {t.differentiators.map(d => (
                    <div key={d} style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
                      <CheckCircle size={10} color={t.tier === "Enterprise" ? TEAL : GOLD} style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontSize: 11, color: t.tier === "Enterprise" ? "#374151" : "rgba(255,255,255,0.85)", lineHeight: 1.45 }}>{d}</span>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: t.ctaColor }}>{t.cta}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: NAVY, padding: "3rem 2rem", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 600, color: "#fff", marginBottom: 12 }}>
            Ready to start with Core?
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginBottom: 28, lineHeight: 1.7 }}>
            Core is fully operational and demonstrable today. One activation pays for the annual subscription. The Founding Partner Program is open to 12 organizations — yours gets full configuration, protocol customization, and a dedicated go-live path.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => setLocation("/request-access")}
              style={{ padding: "12px 28px", background: GOLD, border: "none", color: NAVY, fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}
            >
              Apply for Founding Partner Access
            </button>
            <button
              onClick={() => setLocation("/12-minute-experience")}
              style={{ padding: "12px 28px", background: "transparent", border: `1px solid rgba(255,255,255,0.3)`, color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
            >
              Try the 12-Minute Test Drive
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
