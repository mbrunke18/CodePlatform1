import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { updatePageMetadata } from "@/lib/seo";
import { FirstVisitAdModal } from "@/components/FirstVisitAdModal";
import { GuestPreviewBanner } from "@/components/GuestPreviewBanner";
import { Link, useLocation } from "wouter";
import StandardNav from "@/components/layout/StandardNav";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";
import { Shield, TrendingUp, Layers, Play } from "lucide-react";
import heroImg from "@/assets/images/executive-floor-night.png";
import { trackEvent } from "@/lib/analytics";
import CinematicHero from "@/components/marketing/CinematicHero";

// ─── Brand Tokens (Spec v2.0 §0) ─────────────────────────────────────────────
const NAVY        = "#0A0F2E";
const NAVY_BG     = "#132558";
const GOLD        = "#C9A84C";
const GOLD_LIGHT  = "#DFC178";
const TEAL_LIGHT  = "#3BAF8A";
const IVORY       = "#F0EDE4";
const MID_NAVY    = "#141B45";
const FOOTER_NAVY = "#060B1E";
const RED_CRISIS  = "#C0392B";
const MUTED_STACK = "#3D4A6B";
const MUTED_DARK  = "#C8D4E8";
const MUTED_LIGHT = "#6B7280";
const BORDER      = "#E8E4DC";
const TEAL        = "#2B8A6E";

const GOLD_GRID_BG: React.CSSProperties = {
  backgroundImage: `linear-gradient(rgba(201,168,76,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.09) 1px, transparent 1px)`,
  backgroundSize: "48px 48px",
};

const SECTION_DARK_BG: React.CSSProperties = {
  backgroundColor: NAVY_BG,
  backgroundImage: [
    `radial-gradient(ellipse 900px 700px at -5% 0%, rgba(43,138,110,0.15) 0%, transparent 55%)`,
    `radial-gradient(ellipse 1000px 800px at 105% 100%, rgba(201,168,76,0.11) 0%, transparent 55%)`,
    `linear-gradient(rgba(201,168,76,0.09) 1px, transparent 1px)`,
    `linear-gradient(90deg, rgba(201,168,76,0.09) 1px, transparent 1px)`,
  ].join(", "),
  backgroundSize: "100% 100%, 100% 100%, 48px 48px, 48px 48px",
};

const GEO: React.CSSProperties = { fontFamily: "Georgia, 'Times New Roman', serif" };
const DM: React.CSSProperties  = { fontFamily: "'Barlow', 'Barlow', sans-serif" };
const CONTAINER: React.CSSProperties = { maxWidth: 1280, margin: "0 auto", padding: "0 32px", boxSizing: "border-box" as const };

function trackCTA(loc: string) {
  trackEvent("pilot_cta_click", { location: loc });
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD, marginBottom: 20 }}>
      {children}
    </div>
  );
}

function SectionMarker({ n }: { n: string }) {
  return (
    <div className="hp-section-marker" style={{
      position: "absolute", left: 24, top: 40,
      ...DM, fontSize: 12, fontWeight: 700, letterSpacing: "0.10em",
      color: GOLD, opacity: 0.75, userSelect: "none", pointerEvents: "none",
    }}>
      [{n}]
    </div>
  );
}

// ─── Sticky in-page jump nav ─────────────────────────────────────────────────
const HP_NAV_ITEMS = [
  { id: 'hp-hero',        label: 'Overview'         },
  { id: 'hp-gap',         label: 'The Gap'          },
  { id: 'hp-situations',  label: 'Situations'       },
  { id: 'how-it-works',   label: 'How It Executes'  },
  { id: 'hp-proof',       label: 'Proof'            },
  { id: 'hp-fearless',    label: 'Fearless'         },
  { id: 'hp-cta',         label: 'Get Access'       },
];

function HomepageStyles() {
  return (
    <style>{`
      .hp-hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: center; }
      @media (max-width: 900px) {
        .hp-hero-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        .hp-chain-diagram { display: none !important; }
      }
      .hp-jump-btn:hover .hp-jump-label { opacity: 1 !important; }
      .hp-jump-btn:hover > div { background: ${GOLD} !important; border-color: ${GOLD} !important; }
      @media (max-width: 1024px) { .hp-jump-nav { display: none !important; } }
      @media (max-width: 768px) {
        .hp-hero-left      { padding: 56px 0 40px !important; }
        .hp-stat-row       { flex-direction: column !important; gap: 24px !important; }
        .hp-stat-div       { display: none !important; }
        .hp-prob-grid      { flex-direction: column !important; }
        .hp-idea-grid      { grid-template-columns: 1fr !important; }
        .hp-footer-cols    { flex-direction: column !important; gap: 40px !important; text-align: center; }
        .hp-hero-h1        { font-size: 36px !important; }
        .hp-missing-h2     { font-size: 30px !important; }
        .hp-cta-h2         { font-size: 30px !important; }
        .hp-cta-btn        { display: block !important; width: calc(100% - 48px) !important; text-align: center; }
        .hp-sec            { padding: 64px 0 !important; }
        .hp-section-marker { display: none !important; }
        #contrast-moment   { height: 80vh !important; min-height: 480px !important; }
        .hp-ba-grid        { grid-template-columns: 1fr !important; }
        .hp-console-body   { grid-template-columns: 1fr !important; }
        .hp-integration-strip { display: none !important; }
        .hp-outcome-table  { display: none !important; }
        .hp-domain-grid    { grid-template-columns: 1fr !important; gap: 8px !important; }
        .hp-metric-row     { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 20px 0 !important; }
        .hp-metric-row > div { border-right: none !important; padding-right: 0 !important; margin-right: 0 !important; }
        .hp-three-step-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
        .hp-step-arrow     { display: none !important; }
        .hp-section-reduce { padding-top: 56px !important; padding-bottom: 48px !important; }
      }
      @media (max-width: 375px) {
        .hp-hero-h1 { font-size: 28px !important; }
      }
      @media (min-width: 1440px) {
        .hp-hero-h1    { font-size: 56px !important; }
        .hp-missing-h2 { font-size: 52px !important; }
        .hp-cta-h2     { font-size: 52px !important; }
      }
      @media (min-width: 1920px) {
        .hp-hero-h1    { font-size: 68px !important; }
        .hp-missing-h2 { font-size: 62px !important; }
        .hp-cta-h2     { font-size: 62px !important; }
      }
    `}</style>
  );
}

// ─── Execution Chain Diagram ─────────────────────────────────────────────────
function ExecutionChainDiagram() {
  const [activeStep, setActiveStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActiveStep(prev => (prev + 1) % 5), 2000);
    return () => clearInterval(t);
  }, []);

  const steps = [
    { label: "TRIGGER FIRES", time: "T+0", desc: "Strategic moment detected — no improvisation", color: GOLD },
    { label: "SIGNAL MAPPED", time: "T+0:12", desc: "248+ sources evaluated across 9 domains", color: GOLD },
    { label: "Readiness Protocol STAGED", time: "Pre-built", desc: "180 responses ready before trigger fired", color: TEAL },
    { label: "EXECUTIVE AUTHORIZES", time: "T+0:08", desc: "Human decision preserved — not bypassed", color: TEAL },
    { label: "FULL DEPLOYMENT", time: "12 MIN", desc: "Teams coordinated, brief delivered, executing", color: GOLD },
  ];

  return (
    <div className="hp-chain-diagram" style={{
      background: "rgba(5,9,30,0.75)",
      border: "1px solid rgba(201,168,76,0.18)",
      backdropFilter: "blur(8px)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Glow behind diagram */}
      <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(43,138,110,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -60, left: -60, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Header strip */}
      <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10, position: "relative" }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: TEAL, display: "inline-block", animation: "vm-pulse 2s ease-in-out infinite", flexShrink: 0 }} />
        <span style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: TEAL }}>Execution Brief · Live</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ ...DM, fontSize: 9, fontWeight: 700, color: TEAL, letterSpacing: "0.12em", background: "rgba(43,138,110,0.15)", border: "1px solid rgba(43,138,110,0.3)", padding: "2px 7px" }}>LIVE SYSTEM</span>
          <span style={{ ...DM, fontSize: 10, color: "rgba(255,255,255,0.68)", letterSpacing: "0.06em" }}>READINESS OS</span>
        </div>
      </div>

      {/* Chain steps */}
      <div style={{ padding: "24px 24px 8px", position: "relative" }}>
        {steps.map((step, i) => (
          <div key={i} style={{ display: "flex", gap: 16, marginBottom: i < steps.length - 1 ? 0 : 0 }}>
            {/* Connector column */}
            <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", width: 28, flexShrink: 0 }}>
              <div style={{
                width: 28, height: 28, flexShrink: 0,
                background: activeStep === i ? step.color : "rgba(255,255,255,0.06)",
                border: `1.5px solid ${activeStep >= i ? step.color : "rgba(255,255,255,0.1)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.5s ease",
                boxShadow: activeStep === i ? `0 0 16px ${step.color}55` : "none",
                zIndex: 1,
              }}>
                <span style={{ ...DM, fontSize: 11, fontWeight: 800, color: activeStep === i ? NAVY : "rgba(255,255,255,0.68)", transition: "color 0.5s" }}>{i + 1}</span>
              </div>
              {i < steps.length - 1 && (
                <div style={{
                  width: 1, flex: 1, minHeight: 28,
                  background: activeStep > i ? `linear-gradient(${step.color}80, ${steps[i+1].color}40)` : "rgba(255,255,255,0.07)",
                  transition: "background 0.5s ease",
                  margin: "3px 0",
                }} />
              )}
            </div>
            {/* Text */}
            <div style={{ paddingBottom: i < steps.length - 1 ? 20 : 8, opacity: activeStep === i ? 1 : activeStep > i ? 0.75 : 0.55, transition: "opacity 0.5s ease" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
                <span style={{ ...DM, fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: activeStep === i ? step.color : "rgba(255,255,255,0.65)", transition: "color 0.5s" }}>
                  {step.label}
                </span>
                <span style={{ ...DM, fontSize: 10, fontWeight: 700, color: step.label === "FULL DEPLOYMENT" ? GOLD : "rgba(255,255,255,0.68)", letterSpacing: "0.06em" }}>
                  {step.time}
                </span>
              </div>
              <p style={{ ...DM, fontSize: 12, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.45 }}>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 30 days → 12 min result bar */}
      <div style={{ margin: "0 24px 24px", background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.22)", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.68)", marginBottom: 3 }}>Traditional</div>
          <div style={{ ...GEO, fontSize: 20, fontWeight: 700, color: "rgba(255,255,255,0.68)", textDecoration: "line-through", lineHeight: 1 }}>30 days</div>
        </div>
        <div style={{ ...DM, fontSize: 14, color: "rgba(201,168,76,0.4)" }}>→</div>
        <div style={{ textAlign: "right" as const }}>
          <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 3 }}>Readiness OS</div>
          <div style={{ ...GEO, fontSize: 28, fontWeight: 700, color: GOLD, lineHeight: 1, textShadow: `0 0 20px rgba(201,168,76,0.4)` }}>12 minutes</div>
        </div>
      </div>
    </div>
  );
}

// ─── SECTION 2: Hero ─────────────────────────────────────────────────────────
// ─── HERO LIVE SIMULATION PANEL ──────────────────────────────────────────────
// ─── Live context hook ────────────────────────────────────────────────────────
interface LiveSignal {
  id: number;
  triggerName: string;
  triggerDomain: string;
  signalDescription: string;
  signalSource: string;
  confidenceScore: number;
  recommendedPlaybook: string | null;
  detectedAt: string | null;
}
interface LiveCtx {
  totalToday: number;
  domainsActive: string[];
  latestSignal: { triggerName: string; triggerDomain: string | null; signalDescription: string; detectedAt: string | null; confidenceScore: number } | null;
  recentDetections: LiveSignal[];
}
function useLiveContext() {
  const [data, setData] = useState<LiveCtx | null>(null);
  useEffect(() => {
    fetch('/api/public/live-context')
      .then(r => r.json())
      .then(d => { if (d.success !== false) setData(d); })
      .catch(() => {});
  }, []);
  return data;
}
function signalTimeAgo(dateStr: string | Date | null): string {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} minute${mins !== 1 ? 's' : ''} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs !== 1 ? 's' : ''} ago`;
  return `${Math.floor(hrs / 24)} day${Math.floor(hrs / 24) !== 1 ? 's' : ''} ago`;
}
const DOMAIN_LABELS: Record<string, string> = {
  'Market Dynamics': 'MARKET',
  'Regulatory & Compliance': 'REGULATORY',
  'Technology & Security': 'CYBER',
  'Supply Chain & Operations': 'SUPPLY CHAIN',
  'Brand & Reputation': 'BRAND',
  'Financial': 'FINANCIAL',
  'ESG & Sustainability': 'ESG',
  'Geopolitical': 'GEOPOLITICAL',
  'Human Capital': 'TALENT',
};
const FALLBACK_SIGNALS = [
  { triggerName: 'Activist Investor Pressure', triggerDomain: 'Market Dynamics', signalDescription: 'Institutional investor filed 13D disclosing 8.7% stake in Fortune 500 consumer goods company, citing undervaluation and seeking board representation.', signalSource: 'SEC EDGAR', confidenceScore: 91, detectedAt: null, illustrative: true, recommendedPlaybook: 'Activist Investor Defense' },
  { triggerName: 'Regulatory Inquiry Opened', triggerDomain: 'Regulatory & Compliance', signalDescription: 'Federal agency announced formal inquiry into pricing practices of major pharmaceutical distributor — disclosure obligations triggered within 48 hours.', signalSource: 'Federal Register', confidenceScore: 87, detectedAt: null, illustrative: true, recommendedPlaybook: 'Regulatory Investigation Response' },
  { triggerName: 'Ransomware Attack Confirmed', triggerDomain: 'Technology & Security', signalDescription: 'Critical infrastructure provider confirmed ransomware incident affecting billing and operations systems — second major attack in sector this quarter.', signalSource: 'Reuters Business', confidenceScore: 95, detectedAt: null, illustrative: true, recommendedPlaybook: 'Ransomware Response' },
];

function HeroSimPanel() {
  const SCENARIOS = [
    {
      domain: "GROWTH & POSITIONING" as const,
      industry: "Technology",
      trigger: "Activist Investor Files 13D — 9.2% Stake",
      protocol: "Protocol #031: Activist Investor Response",
      tasks: 11,
      executive: "Chief Executive Officer",
      steps: [
        { t: "0:06", action: "SEC 13D filing detected — Elliott Management, 9.2% stake", owner: "System" },
        { t: "1:10", action: "CEO authorizes — board brief and defense protocol staged", owner: "CEO" },
        { t: "2:30", action: "Investment banker engaged, defensive brief to board", owner: "Finance / Legal" },
        { t: "4:00", action: "Shareholder communication drafted and staged", owner: "Comms / IR" },
        { t: "7:45", action: "Proxy advisor outreach staged, poison pill review initiated", owner: "Legal" },
        { t: "12:00", action: "Board briefed — defense posture activated", owner: "All Leads" },
      ],
      outcome: "Board briefed, defense posture activated",
      stat: "3,600× execution head start",
    },
    {
      domain: "RISK & RESILIENCE" as const,
      industry: "Pharmaceutical",
      trigger: "FDA Class I Recall — Contamination Signal",
      protocol: "Protocol #058: FDA Class I Recall Response",
      tasks: 9,
      executive: "Chief Risk Officer",
      steps: [
        { t: "0:12", action: "Contamination signal — 3 production lot IDs flagged", owner: "System" },
        { t: "1:30", action: "CRO authorizes — recall sequence staged and unlocked", owner: "CRO" },
        { t: "3:00", action: "FDA voluntary recall notification filed electronically", owner: "Regulatory" },
        { t: "5:15", action: "Distribution hold — 847 retail partners notified", owner: "Supply Chain" },
        { t: "8:30", action: "Consumer safety advisory staged for release", owner: "Comms" },
        { t: "12:00", action: "Recall contained — full chain of custody documented", owner: "All Leads" },
      ],
      outcome: "Recall contained before public exposure",
      stat: "$340M liability avoided",
    },
    {
      domain: "TRANSFORMATION" as const,
      industry: "Consumer Goods",
      trigger: "Market Entry Sprint — 6 Countries, 90-Day Window",
      protocol: "Protocol #089: Go-to-Market Acceleration Sprint",
      tasks: 12,
      executive: "Chief Revenue Officer",
      steps: [
        { t: "0:05", action: "Board green-lights expansion — 90-day execution window opens", owner: "System" },
        { t: "1:15", action: "CRO authorizes — 6-market entry protocol staged and unlocked", owner: "CRO" },
        { t: "2:30", action: "Market entry briefs deployed to 6 regional leads simultaneously", owner: "Regional Leads" },
        { t: "4:00", action: "Legal entity formation and regulatory filings staged per country", owner: "Legal" },
        { t: "7:30", action: "Distribution partnerships activated — channel agreements staged", owner: "Sales / BD" },
        { t: "12:00", action: "All 6 markets operational — revenue pipeline active", owner: "All Leads" },
      ],
      outcome: "6-market simultaneous launch activated",
      stat: "$280M revenue pipeline staged",
    },
    {
      domain: "COMPLETE OPERATING MODEL" as const,
      industry: "Enterprise",
      trigger: "Q3 Roadmap Running + Ransomware — Both Tracks Active",
      protocol: "Protocol #31: Ransomware Response · 3 Planned Initiatives",
      tasks: 11,
      executive: "Chief Executive Officer",
      steps: [
        { t: "0:00", action: "Ransomware — 23 servers encrypted. 3 Q3 initiatives already staged.", owner: "System" },
        { t: "1:10", action: "CEO authorizes unplanned response — Q3 roadmap untouched", owner: "CEO" },
        { t: "2:00", action: "Protocol #31 activated. FBI notified. GTM Launch: on track.", owner: "CISO / FBI" },
        { t: "4:30", action: "Board briefed. M&A Integration: Week 3, on schedule.", owner: "Board" },
        { t: "8:00", action: "Ransomware contained. Product Rollout: staging complete.", owner: "CTO" },
        { t: "12:00", action: "Both tracks complete. Zero Q3 disruption.", owner: "All Leads" },
      ],
      outcome: "Unplanned response + Q3 roadmap: neither stalled",
      stat: "4 protocols active simultaneously",
    },
  ];

  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [phase, setPhase] = useState<"detect" | "stage" | "authorize" | "execute" | "complete">("detect");
  const [riskScore, setRiskScore] = useState(0);
  const [activeStep, setActiveStep] = useState(-1);

  const scenario = SCENARIOS[scenarioIdx];
  const domainColor = scenario.domain === "GROWTH & POSITIONING" ? GOLD : scenario.domain === "TRANSFORMATION" ? IVORY : TEAL;
  const PHASE_LABELS = ["DETECT", "STAGE", "AUTH", "EXECUTE", "COMPLETE"];
  const phaseIdx = ["detect", "stage", "authorize", "execute", "complete"].indexOf(phase);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    let scoreInterval: ReturnType<typeof setInterval>;

    setPhase("detect");
    setRiskScore(0);
    setActiveStep(-1);

    let score = 0;
    scoreInterval = setInterval(() => {
      score = Math.min(94, score + Math.floor(Math.random() * 8) + 5);
      setRiskScore(score);
      if (score >= 94) clearInterval(scoreInterval);
    }, 110);

    timers.push(setTimeout(() => setPhase("stage"), 2000));
    timers.push(setTimeout(() => setPhase("authorize"), 4000));
    timers.push(setTimeout(() => { setPhase("execute"); setActiveStep(0); }, 6000));
    timers.push(setTimeout(() => setActiveStep(1), 8000));
    timers.push(setTimeout(() => setActiveStep(2), 10000));
    timers.push(setTimeout(() => setActiveStep(3), 12000));
    timers.push(setTimeout(() => setActiveStep(4), 14000));
    timers.push(setTimeout(() => setActiveStep(5), 16000));
    timers.push(setTimeout(() => setPhase("complete"), 18500));
    timers.push(setTimeout(() => setScenarioIdx(prev => (prev + 1) % SCENARIOS.length), 23000));

    return () => { clearInterval(scoreInterval); timers.forEach(clearTimeout); };
  }, [scenarioIdx]);

  const BRC2: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };
  const BAR2: React.CSSProperties = { fontFamily: "'Barlow', sans-serif" };
  const GEO2: React.CSSProperties = { fontFamily: "'Cormorant Garamond', Georgia, serif" };

  return (
    <div style={{
      background: "rgba(4,7,22,0.97)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderLeft: `3px solid ${domainColor}`,
      display: "flex",
      flexDirection: "column" as const,
      height: "100%",
      overflow: "hidden",
    }}>
      {/* Top bar */}
      <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 8px #22C55E88" }} />
          <span style={{ ...BRC2, fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const }}>LIVE EXECUTION SIMULATION</span>
        </div>
        <span style={{ ...BRC2, fontSize: 8, fontWeight: 700, color: domainColor, letterSpacing: "0.14em", textTransform: "uppercase" as const, padding: "2px 7px", border: `1px solid ${domainColor}44` }}>
          {scenario.domain}
        </span>
      </div>

      {/* Scenario label */}
      <div style={{ padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}>
        <div style={{ ...BRC2, fontSize: 8, fontWeight: 700, letterSpacing: "0.18em", color: "rgba(255,255,255,0.28)", textTransform: "uppercase" as const, marginBottom: 4 }}>{scenario.industry}</div>
        <div style={{ ...GEO2, fontSize: 15, fontWeight: 700, color: "#fff", lineHeight: 1.25 }}>{scenario.trigger}</div>
      </div>

      {/* Phase progress bar */}
      <div style={{ padding: "8px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", gap: 2, flexShrink: 0 }}>
        {PHASE_LABELS.map((p, i) => (
          <div key={p} style={{ flex: 1, textAlign: "center" as const }}>
            <div style={{ height: 2, background: i <= phaseIdx ? (i === 4 ? TEAL : domainColor) : "rgba(255,255,255,0.08)", marginBottom: 3, transition: "background 0.5s" }} />
            <span style={{ ...BRC2, fontSize: 6.5, fontWeight: 700, letterSpacing: "0.1em", color: i <= phaseIdx ? (i === 4 ? TEAL : "rgba(255,255,255,0.6)") : "rgba(255,255,255,0.18)", textTransform: "uppercase" as const }}>{p}</span>
          </div>
        ))}
      </div>

      {/* Phase content */}
      <div style={{ flex: 1, padding: "14px", overflow: "hidden", minHeight: 0 }}>

        {phase === "detect" && (
          <div>
            <div style={{ ...BRC2, fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: domainColor, textTransform: "uppercase" as const, marginBottom: 10 }}>Signal Detected — Protocol Matching</div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 5 }}>
                <span style={{ ...BRC2, fontSize: 9, letterSpacing: "0.12em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" as const }}>Risk Score</span>
                <span style={{ ...GEO2, fontSize: 36, fontWeight: 700, color: riskScore > 74 ? "#EF4444" : riskScore > 34 ? GOLD : TEAL, lineHeight: 1 }}>{riskScore}</span>
              </div>
              <div style={{ height: 3, background: "rgba(255,255,255,0.07)" }}>
                <div style={{ height: "100%", width: `${riskScore}%`, background: riskScore > 74 ? "#EF4444" : GOLD, transition: "width 0.1s, background 0.4s" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                <span style={{ ...BRC2, fontSize: 6.5, color: "rgba(255,255,255,0.18)" }}>LOW</span>
                <span style={{ ...BRC2, fontSize: 6.5, color: "rgba(255,255,255,0.18)" }}>CRITICAL</span>
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", padding: "10px 12px" }}>
              <div style={{ ...BRC2, fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 5 }}>Protocol Matched</div>
              <div style={{ ...BAR2, fontSize: 12, color: "#fff", fontWeight: 600, marginBottom: 3 }}>{scenario.protocol}</div>
              <div style={{ ...BRC2, fontSize: 8.5, color: "rgba(255,255,255,0.35)" }}>{scenario.tasks} tasks pre-staged · Authorization required</div>
            </div>
          </div>
        )}

        {phase === "stage" && (
          <div>
            <div style={{ ...BRC2, fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: domainColor, textTransform: "uppercase" as const, marginBottom: 10 }}>Response Pre-Staged</div>
            <div style={{ ...GEO2, fontSize: 20, fontWeight: 700, color: "#fff", lineHeight: 1.25, marginBottom: 14 }}>
              {scenario.tasks} tasks ready.<br />
              <em style={{ color: GOLD }}>Awaiting executive sign-off.</em>
            </div>
            {["Full impact brief prepared", "Budget authority pre-approved", "All task owners assigned", "Communication templates staged"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                <div style={{ width: 5, height: 5, background: TEAL, flexShrink: 0 }} />
                <span style={{ ...BAR2, fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{item}</span>
              </div>
            ))}
          </div>
        )}

        {phase === "authorize" && (
          <div style={{ textAlign: "center" as const, paddingTop: 4 }}>
            <div style={{ ...BRC2, fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: GOLD, textTransform: "uppercase" as const, marginBottom: 10 }}>Authorization Requested</div>
            <div style={{ ...GEO2, fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{scenario.executive}</div>
            <div style={{ ...BAR2, fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>Reviewing impact brief · Budget ready</div>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 18 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: GOLD, opacity: 0.3 + i * 0.35 }} />
              ))}
            </div>
            <div style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.2)", padding: "10px 14px" }}>
              <div style={{ ...BAR2, fontSize: 10, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
                No committee. No alignment meeting.<br />Executive signs off — execution begins.
              </div>
            </div>
          </div>
        )}

        {phase === "execute" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ ...BRC2, fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: TEAL, textTransform: "uppercase" as const }}>Executing Now</div>
              <div style={{ ...BRC2, fontSize: 8, fontWeight: 700, color: GOLD, letterSpacing: "0.08em" }}>AUTHORIZATION GRANTED ✓</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 2 }}>
              {scenario.steps.map((step, i) => {
                const done = i <= activeStep;
                const current = i === activeStep;
                const isExec = step.owner !== "System" && !step.owner.includes("All");
                return (
                  <div key={i} style={{ display: "flex", gap: 7, padding: "5px 7px", background: current ? "rgba(201,168,76,0.08)" : done ? "rgba(255,255,255,0.02)" : "transparent", border: `1px solid ${current ? "rgba(201,168,76,0.22)" : "transparent"}`, transition: "all 0.4s", opacity: done || current ? 1 : 0.2 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: done ? (isExec ? GOLD : TEAL) : "rgba(255,255,255,0.1)", marginTop: 4, flexShrink: 0, transition: "background 0.3s" }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ ...BRC2, fontSize: 6.5, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>{step.t} · {step.owner}</div>
                      <div style={{ ...BAR2, fontSize: 9.5, color: done ? "rgba(255,255,255,0.72)" : "rgba(255,255,255,0.2)", lineHeight: 1.35 }}>{step.action}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {phase === "complete" && (
          <div style={{ textAlign: "center" as const, paddingTop: 6 }}>
            <div style={{ ...BRC2, fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: TEAL, textTransform: "uppercase" as const, marginBottom: 10 }}>Execution Complete · 12:00</div>
            <div style={{ ...GEO2, fontSize: 52, fontWeight: 700, color: TEAL, lineHeight: 1, marginBottom: 8 }}>✓</div>
            <div style={{ ...GEO2, fontSize: 16, fontWeight: 600, color: "#fff", lineHeight: 1.35, marginBottom: 14 }}>{scenario.outcome}</div>
            <div style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.28)", padding: "12px 16px", marginBottom: 12 }}>
              <div style={{ ...GEO2, fontSize: 24, fontWeight: 700, color: GOLD }}>{scenario.stat}</div>
            </div>
            <div style={{ ...BRC2, fontSize: 7.5, color: "rgba(255,255,255,0.25)", letterSpacing: "0.14em", textTransform: "uppercase" as const }}>Next scenario loading…</div>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div style={{ padding: "9px 14px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          {SCENARIOS.map((_, i) => (
            <button
              key={i}
              onClick={() => setScenarioIdx(i)}
              style={{ width: i === scenarioIdx ? 16 : 6, height: 6, borderRadius: 3, background: i === scenarioIdx ? GOLD : "rgba(255,255,255,0.18)", border: "none", cursor: "pointer", padding: 0, transition: "all 0.3s" }}
            />
          ))}
        </div>
        <a href="/industry-demo-library" style={{ ...BRC2, fontSize: 8, fontWeight: 700, color: TEAL, textDecoration: "none", letterSpacing: "0.14em", textTransform: "uppercase" as const }}>
          See all 19 industries →
        </a>
      </div>
    </div>
  );
}

function HeroSection() {
  const liveCtx = useLiveContext();
  const hasReal = (liveCtx?.recentDetections?.length ?? 0) > 0;
  const signals = hasReal
    ? liveCtx!.recentDetections
        .filter((s, i, arr) => {
          const title = (s as any).signalDescription || (s as any).triggerName || '';
          return arr.findIndex(x => ((x as any).signalDescription || (x as any).triggerName || '') === title) === i;
        })
        .slice(0, 4)
    : FALLBACK_SIGNALS.slice(0, 3);

  return (
    <section id="hp-hero" style={{ ...SECTION_DARK_BG, position: "relative", overflow: "hidden" }}>
      {/* Photography — editorial office floor, dark overlay preserves readability */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: `url(${heroImg})`,
        backgroundSize: "cover", backgroundPosition: "center right",
        opacity: 0.18,
        pointerEvents: "none",
      }} />
      {/* Single deliberate gold accent rule */}
      <div style={{ position: "absolute", right: 0, top: 160, width: "58%", height: 1, background: `linear-gradient(to left, transparent 0%, ${GOLD}44 50%, transparent 100%)`, pointerEvents: "none", zIndex: 1 }} />

      <div style={{ ...CONTAINER, width: "100%" }}>
        <div className="hp-hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 47%", minHeight: 600, alignItems: "stretch" }}>

          {/* LEFT — Headline + CTAs + Stats */}
          <div className="hp-hero-left" style={{ padding: "100px 56px 88px 0", display: "flex", flexDirection: "column" as const, justifyContent: "center" }}>
            <Reveal>
              {/* Status badge */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E" }} />
                <span style={{ ...DM, color: "rgba(255,255,255,0.78)", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" as const }}>
                  {hasReal ? `${liveCtx?.totalToday ?? 0} Signals Detected Today — System Active` : "231 Detection Thresholds Active — System Monitoring"}
                </span>
              </div>

              {/* Pain qualifier — executive self-identifies before the promise lands */}
              <p style={{ ...DM, fontSize: "clamp(14px,1.1vw,16px)", color: "rgba(255,255,255,0.62)", lineHeight: 1.65, maxWidth: 460, margin: "0 0 22px", fontStyle: "italic" as const }}>
                Think back to the last strategic situation that caught your organization mid-stride.
                How long before your team had a coordinated response?
              </p>

              {/* Category declaration */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 16, padding: "5px 14px", border: "1px solid rgba(201,168,76,0.3)", background: "rgba(201,168,76,0.07)" }}>
                <div style={{ width: 5, height: 5, background: GOLD, flexShrink: 0 }} />
                <span style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase" as const, color: GOLD }}>Readiness Infrastructure · Startup to Fortune 500</span>
              </div>

              {/* Headline */}
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(20px,1.8vw,26px)", fontWeight: 400, lineHeight: 1.2, margin: "0 0 4px", color: "rgba(255,255,255,0.72)", letterSpacing: "0.01em", fontStyle: "italic" }}>
                When the Situation Arrives —
              </p>
              <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(42px,4.5vw,66px)", fontWeight: 700, lineHeight: 1.05, margin: "0 0 6px", color: "#fff", letterSpacing: "-0.01em" }}>
                The Response Is Ready
              </h1>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(42px,4.5vw,66px)", fontWeight: 700, lineHeight: 1.05, margin: "0 0 32px", color: GOLD, letterSpacing: "-0.01em" }}>
                Before the Trigger Fires.
              </h2>

              {/* Lead — one decisive sentence, not a paragraph */}
              <p style={{ ...DM, color: "rgba(255,255,255,0.88)", fontSize: "clamp(16px,1.25vw,18px)", lineHeight: 1.65, maxWidth: 520, margin: "0 0 28px" }}>
                Most organizations spend 30 days mobilizing after a situation presents itself — scoping from scratch, under pressure, while the strategic window closes. It happens 15–20 times every year.{" "}
                <span style={{ color: GOLD, fontWeight: 700 }}>Readiness OS eliminates that entirely. 30 days compressed to 12 minutes.</span>
              </p>

              {/* Canonical 4-beat narrative — the complete product story, visible above fold */}
              <div style={{ maxWidth: 500, marginBottom: 28, display: "flex", flexDirection: "column" as const, gap: 10 }}>
                {([
                  { beat: "Pre-staged before the trigger.", accent: false },
                  { beat: "Authorized in real time.", accent: false },
                  { beat: "When the situation presents itself, everything is already in place. Response in 12 minutes.", accent: true },
                  { beat: "Every activation makes the next response faster.", accent: false, teal: true },
                ] as { beat: string; accent: boolean; teal?: boolean }[]).map(({ beat, accent, teal }, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div style={{
                      width: 18, height: 18, flexShrink: 0, marginTop: 2,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      border: `1px solid ${teal ? TEAL : GOLD}`,
                      background: teal ? "rgba(43,138,110,0.15)" : "rgba(201,168,76,0.12)",
                    }}>
                      <span style={{ fontSize: 9, fontWeight: 800, color: teal ? TEAL : GOLD }}>✓</span>
                    </div>
                    <span style={{
                      ...DM, lineHeight: 1.55,
                      fontSize: "clamp(13px,1.05vw,14.5px)",
                      color: teal ? "rgba(43,138,110,0.95)" : accent ? "#fff" : "rgba(255,255,255,0.82)",
                      fontWeight: accent ? 700 : 500,
                    }}>{beat}</span>
                  </div>
                ))}
              </div>

              {/* CTAs — 12-min test drive is the primary self-serve entry point */}
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20, flexWrap: "wrap" as const }}>
                <Link
                  href="/12-minute-experience"
                  onClick={() => trackCTA("hero_testdrive")}
                  style={{ ...DM, display: "inline-block", background: GOLD, color: NAVY, fontWeight: 700, fontSize: 13, padding: "14px 28px", textDecoration: "none", letterSpacing: "0.07em", textTransform: "uppercase" as const, whiteSpace: "nowrap" as const }}
                >
                  Run the 12-Minute Test Drive →
                </Link>
                <Link
                  href="/full-experience"
                  onClick={() => trackCTA("hero_demo")}
                  style={{ ...DM, display: "inline-block", background: "transparent", color: "rgba(255,255,255,0.85)", fontWeight: 600, fontSize: 13, padding: "13px 22px", textDecoration: "none", letterSpacing: "0.04em", border: "1px solid rgba(255,255,255,0.25)", whiteSpace: "nowrap" as const }}
                >
                  Full Platform Experience
                </Link>
                <Link
                  href="/request-access"
                  onClick={() => trackCTA("hero")}
                  style={{ ...DM, color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 600, textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.22)", paddingBottom: 1, letterSpacing: "0.02em", whiteSpace: "nowrap" as const }}
                >
                  Apply for Founding Partner Access →
                </Link>
              </div>

              {/* Inline metric row */}
              <div className="hp-metric-row" style={{ display: "flex", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 32 }}>
                {[
                  { n: "15–20/yr", l: "Situations annually", highlight: true },
                  { n: "12 min",   l: "Per situation → execution" },
                  { n: "3,600×",   l: "Execution head start" },
                  { n: "180",      l: "Readiness Protocols" },
                  { n: "231",      l: "Detection thresholds" },
                ].map((s, i) => (
                  <div key={i} style={{ flex: 1, paddingRight: 20, marginRight: 20, borderRight: i < 4 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
                    <div style={{ ...GEO, color: (s as any).highlight ? "#fff" : GOLD, fontSize: "clamp(18px,2vw,26px)", fontWeight: 700, lineHeight: 1 }}>{s.n}</div>
                    <div style={{ ...DM, color: (s as any).highlight ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.68)", fontSize: 11, marginTop: 6, letterSpacing: "0.04em", fontWeight: (s as any).highlight ? 700 : 500 }}>{s.l}</div>
                  </div>
                ))}
              </div>
              {/* What is a Readiness Protocol? — kept as a quiet, skimmable link, not a competing block of copy */}
              <div style={{ marginTop: 10 }}>
                <a href="/how-it-executes" style={{ ...DM, fontSize: 11, color: "rgba(255,255,255,0.4)", textDecoration: "none", letterSpacing: "0.02em" }}>
                  What's a Readiness Protocol? <span style={{ color: GOLD, opacity: 0.85 }}>See how it executes →</span>
                </a>
              </div>

            </Reveal>
          </div>

          {/* RIGHT — Live Simulation Panel — the product itself, not a decoration beside the pitch */}
          <div style={{ padding: "32px 0 32px 32px", display: "flex", flexDirection: "column", alignItems: "stretch", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" as const }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E" }} />
                <span style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.75)" }}>
                  Watch It Work — Live
                </span>
              </div>
              <Link
                href="/video"
                onClick={() => trackCTA("hero_watch_film")}
                style={{ ...DM, fontSize: 11, fontWeight: 600, color: GOLD, textDecoration: "none", letterSpacing: "0.04em", whiteSpace: "nowrap" as const }}
                data-testid="link-watch-demo-film"
              >
                ▶ Watch the 3-Min Film →
              </Link>
            </div>
            {/* Browser Chrome Frame */}
            <div style={{ borderRadius: "6px 6px 0 0", overflow: "hidden", boxShadow: "0 28px 72px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.18)" }}>
              <div style={{ background: "rgba(255,255,255,0.055)", padding: "8px 12px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57" }} />
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FEBC2E" }} />
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28C840" }} />
                </div>
                <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 3, padding: "3px 10px", display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL, flexShrink: 0 }} />
                  <span style={{ ...DM, fontSize: 9, color: "rgba(255,255,255,0.32)", letterSpacing: "0.04em" }}>readiness-os.app / live-execution-simulation</span>
                </div>
              </div>
              <HeroSimPanel />
            </div>
            <div style={{ ...DM, fontSize: 11, color: "rgba(255,255,255,0.35)", textAlign: "center", letterSpacing: "0.03em", fontStyle: "italic" }}>
              Live execution simulation — click the dots to switch situations
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── REALITY GAP SIMULATOR ────────────────────────────────────────────────────
function RealityGapSimulator() {
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  const [dayCount, setDayCount] = useState(0);
  const [minSecs, setMinSecs] = useState(0);
  const [progress, setProgress] = useState(0);
  const [started, setStarted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Phase 0: 20s — old model painfully grinding up to 30 days
  // Phase 1: 15s — Readiness OS clock counts UP from 0:00 → 12:00
  const PHASE0_MS = 20000;
  const PHASE1_MS = 15000;
  const TOTAL_MS = PHASE0_MS + PHASE1_MS;

  const runSim = () => {
    setPhase(0);
    setDayCount(0);
    setMinSecs(0);
    setProgress(0);
    setStarted(true);

    // Progress bar: 100 ticks across full simulation window
    let p = 0;
    const pi = setInterval(() => {
      p = Math.min(100, p + 1);
      setProgress(p);
      if (p >= 100) clearInterval(pi);
    }, TOTAL_MS / 100);

    // Day counter: 0→30 over PHASE0_MS - 1000ms (finishes before cut)
    let d = 0;
    const di = setInterval(() => {
      d += 1;
      setDayCount(d);
      if (d >= 30) clearInterval(di);
    }, (PHASE0_MS - 1000) / 30);

    // Cut to Phase 1 — clock counts UP from 0:00 → 12:00 in 30 visible ticks
    setTimeout(() => {
      setPhase(1);
      let s = 0;
      const CLOCK_INCREMENT = 24; // seconds added per tick (30 ticks × 24s = 720s = 12:00)
      const CLOCK_TICKS = 720 / CLOCK_INCREMENT; // 30 ticks
      const si = setInterval(() => {
        s = Math.min(720, s + CLOCK_INCREMENT);
        setMinSecs(s);
        if (s >= 720) clearInterval(si);
      }, (PHASE1_MS - 600) / CLOCK_TICKS);
    }, PHASE0_MS);

    // Phase 2 — complete
    setTimeout(() => setPhase(2), TOTAL_MS);
  };

  // Start sim when section enters the viewport — not on page load
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let triggered = false;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          triggered = true;
          setTimeout(runSim, 300);
          obs.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-loop: restart 4 s after completion so clock never freezes at 0:00
  useEffect(() => {
    if (phase !== 2) return;
    const t = setTimeout(runSim, 4000);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const BC = { fontFamily: "'Barlow Condensed', sans-serif" } as const;
  const CG = { fontFamily: "'Cormorant Garamond', Georgia, serif" } as const;

  const BEFORE = [
    "Analysts scoping the situation from scratch",
    "Leadership debating who owns the response",
    "Stakeholders scheduled for alignment calls",
    "Briefs drafted under live pressure",
    "Budgets estimated without pre-approval",
    "30 days of mobilization before execution starts",
  ];
  const AFTER = [
    "Protocol matched — 11 tasks pre-staged",
    "Authority chain configured — CEO notified",
    "Budget pre-approved — $2.4M envelope ready",
    "Stakeholders notified with full context",
    "Executive authorizes in a single decision",
    "12 minutes — full response underway",
  ];

  // How many list items are revealed based on counter progress
  const beforeRevealed = phase === 0 ? Math.ceil(dayCount / 5) : (phase > 0 ? 6 : 0);
  const afterRevealed  = phase >= 1 ? Math.ceil(minSecs / 120) : 0;

  return (
    <section ref={sectionRef} id="hp-gap" style={{ background: NAVY, borderTop: "1px solid rgba(255,255,255,0.08)", borderBottom: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "52px 40px" }}>

        {/* Header row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap" as const, gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 24, height: 1.5, background: GOLD }} />
              <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: GOLD }}>The Mobilization Gap</span>
              {/* Live indicator */}
              <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "2px 8px", background: "rgba(43,138,110,0.15)", border: "1px solid rgba(43,138,110,0.35)" }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: TEAL, animation: "pulse 1.2s ease-in-out infinite" }} />
                <span style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", color: TEAL }}>LIVE SIMULATION</span>
              </div>
            </div>
            <p style={{ ...BC, fontSize: 15, color: "rgba(255,255,255,0.72)", letterSpacing: "0.01em", margin: 0 }}>
              Watch a strategic situation unfold. <span style={{ color: "rgba(255,255,255,0.48)" }}>The left panel shows the old model. The right shows Readiness OS. Runs automatically.</span>
            </p>
          </div>
          <button
            onClick={runSim}
            style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" as const, padding: "7px 18px", background: "transparent", border: "1px solid rgba(255,255,255,0.28)", color: "rgba(255,255,255,0.62)", cursor: "pointer", flexShrink: 0, marginTop: 4 }}
          >
            ↺ Replay
          </button>
        </div>

        {/* Progress bar */}
        <div style={{ height: 2, background: "rgba(255,255,255,0.08)", marginBottom: 24, overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${progress}%`,
            background: phase === 0 ? "#E74C3C" : phase === 1 ? TEAL : GOLD,
            transition: "width 0.09s linear, background 0.5s ease",
          }} />
        </div>

        {/* Phase label */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, height: 24 }}>
          {phase === 0 && (
            <>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#E74C3C" }} />
              <span style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", color: "#E74C3C" }}>NOW RUNNING — The Old Model: watching 30 days accumulate</span>
            </>
          )}
          {phase === 1 && (
            <>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: TEAL }} />
              <span style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", color: TEAL }}>NOW RUNNING — Readiness OS: same situation, 12-minute response</span>
            </>
          )}
          {phase === 2 && (
            <>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: GOLD }} />
              <span style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", color: GOLD }}>RESULT — 3,600× Execution Head Start</span>
            </>
          )}
        </div>

        {/* Two panels */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, marginBottom: 3 }}>

          {/* BEFORE */}
          <div style={{
            padding: "28px 26px",
            background: phase === 0 ? "rgba(192,57,43,0.13)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${phase === 0 ? "rgba(192,57,43,0.55)" : "rgba(255,255,255,0.1)"}`,
            transition: "all 0.5s ease",
            position: "relative" as const,
            opacity: phase === 1 ? 0.5 : 1,
          }}>
            {phase === 0 && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "#E74C3C" }} />}

            {/* Panel header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.26em", textTransform: "uppercase" as const, color: phase === 0 ? "#E74C3C" : "rgba(255,255,255,0.45)" }}>
                Without Readiness OS
              </div>
              {phase === 0 && (
                <div style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.15em", color: "#E74C3C", padding: "2px 7px", border: "1px solid rgba(231,76,60,0.45)", background: "rgba(231,76,60,0.08)" }}>
                  ● ACTIVE
                </div>
              )}
            </div>

            {/* Day counter */}
            <div style={{ marginBottom: 22 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <div style={{ ...CG, fontSize: 72, fontWeight: 700, lineHeight: 1, color: phase === 0 ? "#E74C3C" : "rgba(255,255,255,0.3)", transition: "color 0.5s" }}>
                  {dayCount}
                </div>
                <div style={{ ...BC, fontSize: 13, fontWeight: 600, color: phase === 0 ? "rgba(231,76,60,0.7)" : "rgba(255,255,255,0.28)", letterSpacing: "0.1em" }}>DAYS</div>
              </div>
              <div style={{ ...BC, fontSize: 11, color: phase === 0 ? "rgba(231,76,60,0.6)" : "rgba(255,255,255,0.28)", letterSpacing: "0.06em", marginTop: 2 }}>
                of mobilization — execution hasn't started
              </div>
            </div>

            {/* Chaos list */}
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
              {BEFORE.map((item, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: 8,
                  opacity: i < beforeRevealed ? 1 : 0.22,
                  transition: "opacity 0.4s ease",
                }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: i < beforeRevealed ? "#E74C3C" : "rgba(255,255,255,0.3)", flexShrink: 0, marginTop: 6, transition: "background 0.4s" }} />
                  <span style={{ ...BC, fontSize: 13, color: i < beforeRevealed ? "rgba(231,76,60,0.9)" : "rgba(255,255,255,0.45)", lineHeight: 1.45, transition: "color 0.4s" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AFTER */}
          <div style={{
            padding: "28px 26px",
            background: phase >= 1 ? "rgba(43,138,110,0.13)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${phase >= 1 ? "rgba(43,138,110,0.55)" : "rgba(255,255,255,0.1)"}`,
            transition: "all 0.5s ease",
            position: "relative" as const,
            opacity: phase === 0 ? 0.55 : 1,
          }}>
            {phase >= 1 && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: TEAL }} />}

            {/* Panel header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.26em", textTransform: "uppercase" as const, color: phase >= 1 ? TEAL : "rgba(255,255,255,0.45)" }}>
                With Readiness OS
              </div>
              {phase === 1 && (
                <div style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.15em", color: TEAL, padding: "2px 7px", border: `1px solid rgba(43,138,110,0.45)`, background: "rgba(43,138,110,0.1)" }}>
                  ● ACTIVE
                </div>
              )}
              {phase === 2 && (
                <div style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.15em", color: GOLD, padding: "2px 7px", border: `1px solid rgba(201,168,76,0.45)`, background: "rgba(201,168,76,0.08)" }}>
                  ✓ COMPLETE
                </div>
              )}
              {phase === 0 && (
                <div style={{ ...BC, fontSize: 8, fontWeight: 600, letterSpacing: "0.12em", color: "rgba(255,255,255,0.35)", padding: "2px 7px", border: "1px solid rgba(255,255,255,0.12)" }}>
                  STANDING BY
                </div>
              )}
            </div>

            {/* Minute counter */}
            <div style={{ marginBottom: 22 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <div style={{ ...CG, fontSize: 72, fontWeight: 700, lineHeight: 1, color: phase >= 1 ? TEAL : "rgba(255,255,255,0.3)", transition: "color 0.5s" }}>
                  {fmt(minSecs)}
                </div>
                <div style={{ ...BC, fontSize: 13, fontWeight: 600, color: phase >= 1 ? "rgba(43,138,110,0.7)" : "rgba(255,255,255,0.28)", letterSpacing: "0.1em" }}>MIN</div>
              </div>
              <div style={{ ...BC, fontSize: 11, color: phase >= 1 ? "rgba(43,138,110,0.6)" : "rgba(255,255,255,0.28)", letterSpacing: "0.06em", marginTop: 2 }}>
                {phase >= 1 ? "response underway" : "waiting for trigger"}
              </div>
            </div>

            {/* Ready list */}
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
              {AFTER.map((item, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: 8,
                  opacity: i < afterRevealed ? 1 : 0.22,
                  transition: "opacity 0.4s ease",
                }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: i < afterRevealed ? TEAL : "rgba(255,255,255,0.3)", flexShrink: 0, marginTop: 6, transition: "background 0.4s" }} />
                  <span style={{ ...BC, fontSize: 13, color: i < afterRevealed ? `rgba(43,138,110,0.95)` : "rgba(255,255,255,0.45)", lineHeight: 1.45, transition: "color 0.4s" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Result strip — always visible, highlights at phase 2 */}
        <div style={{
          padding: "22px 28px",
          background: phase === 2 ? "rgba(201,168,76,0.1)" : "rgba(255,255,255,0.03)",
          border: `1px solid ${phase === 2 ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.1)"}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap" as const, gap: 16,
          transition: "all 0.6s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" as const }}>
            <div>
              <div style={{ ...CG, fontSize: 32, fontWeight: 700, lineHeight: 1, color: phase === 2 ? "#E74C3C" : "rgba(255,255,255,0.28)", transition: "color 0.6s" }}>30 days</div>
              <div style={{ ...BC, fontSize: 9, letterSpacing: "0.16em", color: "rgba(255,255,255,0.38)", textTransform: "uppercase" as const, marginTop: 2 }}>Old model</div>
            </div>
            <div style={{ ...BC, fontSize: 22, color: GOLD, fontWeight: 700, opacity: phase === 2 ? 1 : 0.25, transition: "opacity 0.6s" }}>→</div>
            <div>
              <div style={{ ...CG, fontSize: 32, fontWeight: 700, lineHeight: 1, color: phase === 2 ? TEAL : "rgba(255,255,255,0.28)", transition: "color 0.6s" }}>12 minutes</div>
              <div style={{ ...BC, fontSize: 9, letterSpacing: "0.16em", color: "rgba(255,255,255,0.38)", textTransform: "uppercase" as const, marginTop: 2 }}>Readiness OS</div>
            </div>
            <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />
            <div>
              <div style={{ ...CG, fontSize: 38, fontWeight: 700, lineHeight: 1, color: phase === 2 ? GOLD : "rgba(255,255,255,0.22)", transition: "color 0.6s" }}>3,600×</div>
              <div style={{ ...BC, fontSize: 9, letterSpacing: "0.16em", color: "rgba(255,255,255,0.38)", textTransform: "uppercase" as const, marginTop: 2 }}>Execution Head Start</div>
            </div>
          </div>
          <a
            href="/founding-partner-program"
            style={{
              ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const,
              padding: "12px 24px",
              background: phase === 2 ? GOLD : "transparent",
              color: phase === 2 ? NAVY : "rgba(255,255,255,0.45)",
              textDecoration: "none",
              border: `1px solid ${phase === 2 ? GOLD : "rgba(255,255,255,0.2)"}`,
              transition: "all 0.6s ease",
              display: "inline-block", whiteSpace: "nowrap" as const,
            }}
          >
            {phase === 2 ? "Make This Real →" : "Apply for Founding Partner Access →"}
          </a>
        </div>

      </div>
    </section>
  );
}

// ─── SCENARIO HOOK ────────────────────────────────────────────────────────────

function ScenarioCardsRow() {
  const SCENARIOS = [
    {
      domain: "GROWTH & POSITIONING",
      label: "Competitor Cuts Price 20%",
      sub: "It hit the news 11 minutes ago. Your sales team is already getting calls. Three deals in final negotiation just went silent.",
      accent: GOLD,
      href: "/demo-experience?s=0",
    },
    {
      domain: "TRANSFORMATION",
      label: "Competitor Announces Launch in 30 Days",
      sub: "The board just authorized an acceleration. Every workstream that assumed a Q3 timeline now needs to be ready to ship in 30.",
      accent: "#7C9CBF",
      href: "/demo/product-launch",
    },
    {
      domain: "RISK & RESILIENCE",
      label: "Systems Down at 3am",
      sub: "Transactions failing. Customers locked out. Six hours until your largest enterprise customers start their business day.",
      accent: TEAL,
      href: "/demo-experience?s=1",
    },
    {
      domain: "GROWTH & POSITIONING",
      label: "Your Second Largest Customer",
      sub: "Just asked for a meeting with no agenda. Contract renews in 60 days. Usage declining. Account team says they have been talking to your competitor.",
      accent: GOLD,
      href: "/demo-experience?s=4",
    },
    {
      domain: "TRANSFORMATION",
      label: "Board Approves AI Realignment",
      sub: "6,720 roles across 12 countries need a coordinated transition plan — WARN Act filings, severance, and redeployment — before it leaks to the press.",
      accent: "#7C9CBF",
      href: "/demo/workforce",
    },
  ];

  return (
    <div id="hp-situations" style={{ background: NAVY, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
      <style>{`
        .hp-scenario-grid { display: grid; grid-template-columns: repeat(5, 1fr); }
        .hp-scenario-footer { display: flex; justify-content: space-between; align-items: center; gap: 24px; flex-wrap: wrap; }
        @media (max-width: 960px) {
          .hp-scenario-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 520px) {
          .hp-scenario-grid { grid-template-columns: 1fr !important; }
          .hp-scenario-footer { flex-direction: column; }
        }
      `}</style>

      <div style={{ ...CONTAINER }}>

        {/* Campaign framing header */}
        <div style={{ padding: "32px 0 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap" as const, gap: 16 }}>
          <div>
            <div style={{ ...DM, fontSize: 10, fontWeight: 700, color: GOLD, letterSpacing: "0.22em", textTransform: "uppercase" as const, marginBottom: 8 }}>
              Growth · Risk · Transformation — not just crisis
            </div>
            <div style={{ ...GEO, fontSize: "clamp(18px,2vw,24px)", fontWeight: 700, color: "#fff", lineHeight: 1.25 }}>
              This isn't a crisis tool. It's the missing layer for every strategic situation your company will face.
            </div>
          </div>
          <Link href="/demo-hub" style={{ ...DM, fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.38)", textDecoration: "none", letterSpacing: "0.06em", whiteSpace: "nowrap" as const, flexShrink: 0 }}>
            See all 13 simulations →
          </Link>
        </div>

        {/* 5 scenario cards */}
        <div className="hp-scenario-grid" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          {SCENARIOS.map((item, i) => {
            const DomainIcon = item.domain === "GROWTH & POSITIONING" ? TrendingUp : item.domain === "TRANSFORMATION" ? Layers : Shield;
            return (
              <Link key={i} href={item.href} style={{
                display: "block", padding: "22px 20px 20px",
                borderRight: i < 4 ? "1px solid rgba(255,255,255,0.07)" : "none",
                borderTop: `2px solid ${item.accent}`,
                textDecoration: "none",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <DomainIcon size={11} color={item.accent} strokeWidth={2.5} />
                  <div style={{ ...DM, color: item.accent, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const }}>{item.domain}</div>
                </div>
                <div style={{ ...DM, color: "#fff", fontSize: 13, fontWeight: 700, lineHeight: 1.4, marginBottom: 6 }}>{item.label}</div>
                <div style={{ ...DM, color: "rgba(255,255,255,0.62)", fontSize: 11, lineHeight: 1.6, marginBottom: 14 }}>{item.sub}</div>
                <span style={{ ...DM, color: item.accent, fontSize: 11, fontWeight: 600 }}>See the response →</span>
              </Link>
            );
          })}
        </div>

        {/* 30 days → 12 minutes + demo CTA */}
        <div className="hp-scenario-footer" style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "22px 0 28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" as const }}>
            <div style={{ textAlign: "center" as const }}>
              <div style={{ ...GEO, fontSize: 20, fontWeight: 700, color: "rgba(255,255,255,0.28)", textDecoration: "line-through", lineHeight: 1 }}>30 days</div>
              <div style={{ ...DM, fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em", textTransform: "uppercase" as const, marginTop: 3 }}>Traditional mobilization</div>
            </div>
            <div style={{ ...DM, fontSize: 20, color: GOLD, fontWeight: 700, lineHeight: 1 }}>→</div>
            <div style={{ textAlign: "center" as const }}>
              <div style={{ ...GEO, fontSize: 20, fontWeight: 700, color: GOLD, lineHeight: 1 }}>12 minutes</div>
              <div style={{ ...DM, fontSize: 9, color: GOLD, opacity: 0.65, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginTop: 3 }}>Readiness OS</div>
            </div>
            <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.1)", margin: "0 6px" }} />
            <div style={{ ...DM, fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.55, maxWidth: 260 }}>
              231 situations monitored. 180 responses already staged — across every domain, not just the emergencies.
            </div>
          </div>
          <Link href="/demo-experience" style={{ ...DM, display: "inline-flex", alignItems: "center", gap: 10, background: GOLD, color: NAVY, fontWeight: 700, fontSize: 12, padding: "13px 28px", textDecoration: "none", letterSpacing: "0.07em", textTransform: "uppercase" as const, whiteSpace: "nowrap" as const, flexShrink: 0 }}>
            Watch a Full Activation →
          </Link>
        </div>

      </div>
    </div>
  );
}

// ─── MICROSOFT HOOK STRIP (early objection handler) ───────────────────────────
function MicrosoftHookStrip() {
  return (
    <div style={{ background: "#060B1E", borderTop: "1px solid rgba(201,168,76,0.12)", borderBottom: "1px solid rgba(201,168,76,0.12)", padding: "28px 0" }}>
      <div style={{ ...CONTAINER, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" as const }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 8 }}>The Operating Model Gap</div>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(17px,2vw,24px)", fontWeight: 600, color: "#F0EDE4", lineHeight: 1.3 }}>
            Every enterprise has Microsoft's AI stack.{" "}
            <em style={{ color: GOLD }}>None have the operating model to use it.</em>
          </div>
          <div style={{ ...DM, fontSize: 12, color: "rgba(240,237,228,0.45)", marginTop: 8, lineHeight: 1.5 }}>
            The orchestration layer that finally makes your $300B+ Microsoft AI investment deliver strategic speed.
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const, alignItems: "center" }}>
          {["Azure AI", "Copilot", "Teams", "M365", "Entra"].map(name => (
            <span key={name} style={{ ...DM, fontSize: 10, fontWeight: 600, color: "rgba(240,237,228,0.4)", padding: "5px 12px", border: "1px solid rgba(255,255,255,0.1)", letterSpacing: "0.06em" }}>{name}</span>
          ))}
          <span style={{ ...DM, fontSize: 11, color: GOLD, fontWeight: 700, padding: "5px 14px", marginLeft: 6 }}>+ Readiness OS →</span>
        </div>
        <a href="/ai-stack" style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: TEAL, textDecoration: "none", borderBottom: "1px solid rgba(43,138,110,0.4)", paddingBottom: 2, whiteSpace: "nowrap" as const }}>
          See the full stack →
        </a>
      </div>
    </div>
  );
}

// ─── PLATFORM SCREENSHOT GALLERY ──────────────────────────────────────────────
const SCREENSHOT_TABS = [
  {
    id: "signals",
    label: "Signal Detection",
    tag: "MONITORING",
    src: "/screenshots/deck_signals.jpg",
    headline: "231 detection thresholds monitored — continuously, automatically.",
    desc: "The platform ingests signals across regulatory feeds, competitive intelligence, financial indicators, and operational data. When a pattern crosses threshold, the matched Readiness Protocol is staged — before anyone is paged.",
    color: TEAL,
  },
  {
    id: "protocols",
    label: "Protocol Library",
    tag: "READINESS",
    src: "/screenshots/protocol_library_v2.jpg",
    headline: "180 Readiness Protocols — pre-staged across every strategic domain.",
    desc: "Each protocol contains pre-assigned owners, a three-phase task sequence, a pre-staged communication chain, a pre-drafted document package, a pre-authorized budget envelope, and a decision authority map. Nothing is figured out under pressure.",
    color: GOLD,
  },
  {
    id: "activation",
    label: "Activation Console",
    tag: "EXECUTION",
    src: "/screenshots/deck_activation.jpg",
    headline: "From situation detection to coordinated execution in 12 minutes.",
    desc: "When an executive authorizes, the war room is live — tasks seeded, roles assigned, Teams channels opened, stakeholders notified. The mobilization already happened. The 12 minutes is just the final confirmation.",
    color: GOLD,
  },
  {
    id: "command",
    label: "Command Tower",
    tag: "INTELLIGENCE",
    src: "/screenshots/new_command_tower.jpg",
    headline: "Real-time executive visibility across every active and staged protocol.",
    desc: "The Command Tower gives leadership a continuous view of trigger detections, protocol readiness scores, active authorizations, and system health — without a status meeting, without a dashboard refresh request.",
    color: TEAL,
  },
] as const;

function PlatformScreenshotSection() {
  const [active, setActive] = useState<number>(0);
  const tab = SCREENSHOT_TABS[active];
  return (
    <section id="hp-platform-gallery" style={{ background: NAVY, borderTop: "1px solid rgba(255,255,255,0.06)", padding: "88px 0 72px" }}>
      <div style={{ ...CONTAINER }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 10 }}>Platform in Action</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(26px,3vw,40px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, margin: "0 0 14px" }}>
            See what readiness looks like<br /><span style={{ color: GOLD }}>when it's already staged.</span>
          </h2>
          <p style={{ ...DM, color: "rgba(255,255,255,0.62)", fontSize: 14, maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
            Four views into the platform — from trigger detection to executive execution. Every screen you see is live in the platform, not a mockup.
          </p>
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: 0, marginBottom: 32, borderBottom: "1px solid rgba(255,255,255,0.1)", justifyContent: "center", flexWrap: "wrap" as const }}>
          {SCREENSHOT_TABS.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setActive(i)}
              style={{
                ...DM, background: "transparent", border: "none", cursor: "pointer",
                padding: "14px 28px", fontSize: 12, fontWeight: 700,
                letterSpacing: "0.08em", textTransform: "uppercase" as const,
                color: i === active ? "#fff" : "rgba(255,255,255,0.42)",
                borderBottom: i === active ? `2px solid ${t.color}` : "2px solid transparent",
                transition: "all 0.2s ease", marginBottom: -1,
                whiteSpace: "nowrap" as const,
              }}
            >
              <span style={{ fontSize: 9, letterSpacing: "0.14em", color: i === active ? t.color : "rgba(255,255,255,0.25)", marginRight: 8 }}>{t.tag}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Browser chrome + screenshot */}
        <div style={{ borderRadius: "6px 6px 0 0", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.05)" }}>
          {/* Chrome bar */}
          <div style={{ background: "#0d1326", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", gap: 6 }}>
              {["#FF5F57","#FEBC2E","#28C840"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.7 }} />)}
            </div>
            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 4, padding: "3px 20px", display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(43,138,110,0.6)" }} />
                <span style={{ ...DM, fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em" }}>readiness.vaughnmartin.com</span>
              </div>
            </div>
            <div style={{ ...DM, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: tab.color, padding: "3px 10px", border: `1px solid ${tab.color}33`, background: `${tab.color}11` }}>
              {tab.tag}
            </div>
          </div>
          {/* Screenshot */}
          <div style={{ position: "relative", lineHeight: 0 }}>
            <img
              key={tab.id}
              src={tab.src}
              alt={tab.label}
              style={{ width: "100%", display: "block", transition: "opacity 0.25s ease" }}
              loading="lazy"
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 60%, rgba(10,15,46,0.85) 100%)", pointerEvents: "none" }} />
          </div>
        </div>

        {/* Caption below screenshot */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderTop: "none", padding: "28px 36px", display: "flex", alignItems: "flex-start", gap: 32, flexWrap: "wrap" as const }}>
          <div style={{ flex: "1 1 300px" }}>
            <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", color: tab.color, marginBottom: 8, textTransform: "uppercase" as const }}>{tab.tag}</div>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(16px,1.6vw,20px)", fontWeight: 600, color: "#fff", lineHeight: 1.35, marginBottom: 0 }}>{tab.headline}</div>
          </div>
          <div style={{ flex: "1 1 340px" }}>
            <p style={{ ...DM, fontSize: 13, color: "rgba(255,255,255,0.68)", lineHeight: 1.75, margin: 0 }}>{tab.desc}</p>
          </div>
          <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
            <a href="/demo-experience" style={{ ...DM, background: "transparent", border: `1px solid ${tab.color}66`, color: tab.color, fontWeight: 700, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" as const, padding: "12px 24px", textDecoration: "none", whiteSpace: "nowrap" as const }}>
              See Full Demo →
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}

// ─── ANATOMY OF A READINESS PROTOCOL ─────────────────────────────────────────
// ─── PRACTITIONER OBSERVATIONS ───────────────────────────────────────────────
function IDEASection() {
  const cards = [
    { letter: "I", title: "Identify", subtitle: "180 Pre-Staged Readiness Protocols",        body: "Every scenario across all 9 strategic domains is fully mapped before the trigger fires. Roles, tasks, documents, and budget are already assigned — waiting for the moment. Nothing is improvised.", accent: TEAL, wm: "rgba(43,138,110,0.06)" },
    { letter: "D", title: "Detect",   subtitle: "248+ Signals, Every 15 Minutes",  body: "Continuous monitoring scans 248+ signals around the clock and knows exactly which Readiness Protocol matches each pattern. The trigger is identified — and the response is ready — before your leadership team finishes their first email.", accent: GOLD, wm: "rgba(201,168,76,0.06)" },
    { letter: "E", title: "Execute",  subtitle: "12-Minute Mobilization",        body: "One executive authorization. The organization moves. Roles distributed, tasks assigned, war rooms opened — simultaneously, to every stakeholder. By the time the first alignment call would have been scheduled, you're already executing. The 12 minutes is mobilization time — your teams then execute from a fully-staged position. The executive at the decision moment has four real choices: run the staged response as built, audible to a different staged response, customize the response on the fly, or choose to do nothing.", accent: TEAL, wm: "rgba(43,138,110,0.06)" },
    { letter: "A", title: "Advance",  subtitle: "Institutional Memory, Built In",   body: "Every activation writes itself into institutional memory. What worked, what didn't, what to pre-stage differently next time — each execution makes the next response faster, sharper, and more decisive.", accent: GOLD, wm: "rgba(201,168,76,0.06)" },
  ];

  return (
    <section id="how-it-works" className="hp-sec" style={{ background: "#F8F7F4", padding: "100px 0", position: "relative" }}>
      <SectionMarker n="04" />

      <div style={{ ...CONTAINER }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <SectionLabel>HOW IT WORKS</SectionLabel>
            <h2 style={{ ...GEO, fontSize: 38, fontWeight: 700, color: "#0A0F2E", lineHeight: 1.2, marginBottom: 48 }}>
              Trigger fires. Teams mobilize.
              <br />
              In 12 minutes. Execution begins immediately.
            </h2>

            {/* Before / After comparison strip */}
            <div className="hp-ba-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, maxWidth: 820, margin: "0 auto", border: `1px solid ${BORDER}` }}>
              {/* Before */}
              <div style={{ background: "#fff", padding: "28px 32px", borderRight: `1px solid ${BORDER}` }}>
                <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: RED_CRISIS, marginBottom: 18 }}>Before</div>
                {[
                  "Emergency Slack threads and back-to-back calls",
                  "Improvised docs, unclear ownership, missed steps",
                  "Weeks of calls and meetings — still no coordinated execution",
                  "No memory — same crisis, same mistakes, next time",
                ].map(item => (
                  <div key={item} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
                    <span style={{ color: RED_CRISIS, fontSize: 14, marginTop: 2, flexShrink: 0 }}>✕</span>
                    <span style={{ ...DM, fontSize: 13, color: "#555", lineHeight: 1.55 }}>{item}</span>
                  </div>
                ))}
              </div>
              {/* After */}
              <div style={{ background: "#F4FBF8", padding: "28px 32px" }}>
                <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: TEAL, marginBottom: 18 }}>With Readiness OS</div>
                {[
                  "Trigger detected — Readiness Protocol activated automatically",
                  "Roles, tasks, and budget pre-assigned and deployed",
                  "Full org executing in under 12 minutes",
                  "Every activation builds institutional memory — next response is faster",
                ].map(item => (
                  <div key={item} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
                    <span style={{ color: TEAL, fontSize: 14, marginTop: 2, flexShrink: 0 }}>✓</span>
                    <span style={{ ...DM, fontSize: 13, color: "#333", lineHeight: 1.55 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <div className="hp-idea-grid" style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24,
          maxWidth: 960, margin: "60px auto 0",
        }}>
          {cards.map((c, i) => (
            <Reveal key={c.letter} delay={i * 0.1}>
              <div
                style={{
                  background: "#fff", border: `1px solid ${BORDER}`, borderTop: `3px solid ${c.accent}`,
                  padding: 32, position: "relative", overflow: "hidden",
                }}
              >
                <div style={{ ...GEO, fontSize: 96, fontWeight: 700, color: c.wm, position: "absolute", bottom: 16, right: 24, lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>
                  {c.letter}
                </div>
                <div style={{ ...GEO, fontSize: 28, fontWeight: 700, color: c.accent, marginBottom: 4 }}>{c.letter}</div>
                <div style={{ ...GEO, fontSize: 20, fontWeight: 700, color: "#1A1A2E", marginBottom: 6 }}>{c.title}</div>
                <div style={{ ...DM, fontSize: 12, fontWeight: 600, color: c.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>{c.subtitle}</div>
                <p style={{ ...DM, fontSize: 15, color: "#555", lineHeight: 1.65 }}>{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Authority callout — executive authorization is preserved at every step */}
        <Reveal delay={0.15}>
          <div style={{
            maxWidth: 900, margin: "40px auto 0", padding: "28px 40px",
            background: "#fff", border: `1px solid ${BORDER}`, borderLeft: `3px solid ${GOLD}`,
            textAlign: "center",
          }}>
            <p style={{ ...DM, fontSize: 14, color: "#333", lineHeight: 1.75, margin: 0, fontWeight: 600 }}>
              AI monitors signals and prepares context. Executives authorize activation. Authority stays human at every step.{" "}
              <span style={{ color: GOLD }}>No Readiness Protocol activates without executive sign-off.</span>
            </p>
          </div>
        </Reveal>

        {/* Flywheel — Compound Execution Advantage */}
        <Reveal delay={0.2}>
          <div style={{
            maxWidth: 900, margin: "56px auto 0", padding: "32px 40px",
            background: "linear-gradient(135deg, rgba(10,15,46,0.04) 0%, rgba(43,138,110,0.06) 100%)",
            border: `1px solid ${BORDER}`, borderLeft: `3px solid ${TEAL}`,
          }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: TEAL, marginBottom: 6 }}>The Compound Execution Advantage</div>
              <div style={{ ...GEO, fontSize: 18, fontWeight: 700, color: "#0A0F2E" }}>Every activation makes the next one faster.</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, position: "relative" }}>
              {[
                { letter: "A", step: "ADVANCE", desc: "AI writes the debrief. What worked, what to stage differently." },
                { letter: "I", step: "IDENTIFY", desc: "Readiness Protocols update automatically. Next trigger, better positioned." },
                { letter: "D", step: "DETECT", desc: "Pattern library sharpens. Signals matched faster, fewer false reads." },
                { letter: "E", step: "EXECUTE", desc: "Response time compresses. The 12-minute clock starts earlier." },
              ].map((item, i) => (
                <div key={item.letter} style={{
                  padding: "20px 20px", borderRight: i < 3 ? `1px dashed ${BORDER}` : "none",
                  position: "relative", textAlign: "center",
                }}>
                  {i < 3 && (
                    <div style={{ position: "absolute", right: -10, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: GOLD, fontWeight: 700, zIndex: 1 }}>→</div>
                  )}
                  <div style={{ ...GEO, fontSize: 20, fontWeight: 800, color: i % 2 === 0 ? GOLD : TEAL, marginBottom: 4 }}>{item.letter}</div>
                  <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#0A0F2E", textTransform: "uppercase", marginBottom: 8 }}>{item.step}</div>
                  <div style={{ ...DM, fontSize: 12, color: "#666", lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 20, paddingTop: 16, borderTop: `1px solid ${BORDER}` }}>
              <span style={{ ...DM, fontSize: 12, color: "#555", fontStyle: "italic" }}>
                The loop closes at <strong style={{ color: GOLD, fontStyle: "normal" }}>ADVANCE</strong> — the Institutional Memory Engine captures every decision, outcome, and failure mode. Each cycle, your organization becomes harder to catch off-guard.{' '}
                <a href="/institutional-memory-engine" style={{ color: TEAL, fontWeight: 700, textDecoration: "none", borderBottom: `1px solid ${TEAL}` }}>
                  See how the memory layer works →
                </a>
              </span>
            </div>
          </div>
        </Reveal>

        {/* Natural transition → demo */}
        <div style={{ textAlign: "center", paddingTop: 48, paddingBottom: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 24, flexWrap: "wrap" as const }}>
          <Link href="/12-minute-experience" style={{ display: "inline-flex", alignItems: "center", gap: 10, color: TEAL, fontSize: 13, fontWeight: 700, borderBottom: `2px solid ${TEAL}`, paddingBottom: 3, textDecoration: "none" }}>
            Experience the IDEA Framework in real time — guided, live, no login required →
          </Link>
          <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 13 }}>|</span>
          <a href="/how-it-executes" style={{ display: "inline-flex", alignItems: "center", gap: 10, color: NAVY, fontSize: 13, fontWeight: 700, borderBottom: `2px solid rgba(10,15,46,0.25)`, paddingBottom: 3, textDecoration: "none" }}>
            See the full animated execution chain →
          </a>
        </div>
      </div>
    </section>
  );
}

const RESEARCH_FIRMS = [
  { firm: "McKinsey & Company", finding: "Fewer than 40% of companies investing in AI report measurable gains. The gap is not the technology — it is the operating model. Executive ownership is the single common factor in every measured success." },
  { firm: "IBM Institute for Business Value", finding: "60% of AI transformation failures trace to execution infrastructure gaps. The technology works. The coordination doesn't." },
  { firm: "World Economic Forum", finding: "Coordination lag — not capital constraints — is the #1 barrier to strategic agility in large enterprises globally." },
  { firm: "BCG · AI-First Org & Operating Model Study, 2026", finding: "95% of companies are piloting AI. Only 5% are capturing real value at scale. The difference is not the technology — it is the operating model. Becoming AI-first is 30% technology, 70% people and organization." },
  { firm: "BCG Henderson Institute", finding: "Companies that can activate strategic responses within hours vs. days sustain 3× the competitive advantage over a 5-year horizon." },
  { firm: "Deloitte Insights", finding: "72% of C-suite leaders cite organizational responsiveness — not strategy quality — as their primary execution gap." },
  { firm: "Accenture Research", finding: "The difference between market leaders and laggards is execution velocity. Leaders respond to competitive triggers 8× faster." },
  { firm: "Gartner", finding: "By 2026, 75% of organizations that can't respond to strategic situations within 4 hours will lose measurable market share." },
  { firm: "Google Cloud / Alphabet", finding: "Enterprise AI adoption stalls not at the model layer but at the coordination layer — the infrastructure to act on AI insight is absent." },
  { firm: "Harvard Business Review", finding: "AI doesn't reduce work — it intensifies it. In a 200-person enterprise study, AI expanded task scope 47%, blurred role boundaries, and increased multitasking 32%. The gap is not the model. It is the operating model that governs it." },
];

function CredibilitySection() {
  const outcomes = [
    { stat: "12 min", label: "Median time from trigger to full org deployment" },
    { stat: "0 hrs",  label: "Executive coordination overhead required" },
    { stat: "94%",    label: "Readiness Protocol phases completed within target window" },
  ];
  return (
    <section id="hp-proof" className="hp-section-reduce" style={{ background: MID_NAVY, padding: "96px 0 80px", position: "relative", overflow: "hidden" }}>
      <SectionMarker n="05" />
      {/* Subtle grid overlay */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.04) 1px,transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />
      <div style={{ ...CONTAINER }}>
        <Reveal>
          {/* Label */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 32, height: 1, background: "rgba(201,168,76,0.4)" }} />
              <span style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: "rgba(201,168,76,0.8)" }}>External Validation</span>
              <div style={{ width: 32, height: 1, background: "rgba(201,168,76,0.4)" }} />
            </div>
            <h2 style={{ ...GEO, fontSize: "clamp(26px,3.5vw,38px)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 12 }}>
              15 independent research organizations.<br />
              <em style={{ color: GOLD, fontStyle: "italic" }}>All reached the same conclusion.</em>
            </h2>
            <p style={{ ...DM, fontSize: 15, color: MUTED_DARK, maxWidth: 560, margin: "0 auto" }}>
              The missing layer isn't better strategy. It isn't more AI. It's the infrastructure to execute — fast, coordinated, without improvisation.
            </p>
          </div>

          {/* Founder pull-quote */}
          <div style={{ maxWidth: 720, margin: "0 auto 56px", textAlign: "center" }}>
            <blockquote style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(20px,2.2vw,28px)", fontWeight: 700, color: "#fff", lineHeight: 1.35, margin: "0 0 14px" }}>
              "Every enterprise situation you'll face has already been faced by someone else.
              <span style={{ color: GOLD }}> The response doesn't have to be built under pressure."</span>
            </blockquote>
            <div style={{ ...DM, fontSize: 12, color: "rgba(255,255,255,0.55)", letterSpacing: "0.04em" }}>
              — Martin Brunke, Founder, VaughnMartin · Built on 20 years of Fortune 500 observation
            </div>
          </div>

          {/* Research firm cards — 4-column grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 64 }}>
            {RESEARCH_FIRMS.map((r) => (
              <div key={r.firm} style={{ padding: "24px 20px", background: "rgba(10,15,46,0.6)", transition: "background 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.07)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(10,15,46,0.6)"; }}>
                <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 10 }}>{r.firm}</div>
                <p style={{ ...DM, fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.65, fontStyle: "italic" }}>"{r.finding}"</p>
              </div>
            ))}
          </div>

          {/* Validator Social Proof — Additional Voices */}
          <div style={{ margin: "0 0 56px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 32 }}>
              <div style={{ width: 28, height: 1, background: "rgba(201,168,76,0.3)" }} />
              <span style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase" as const, color: "rgba(201,168,76,0.7)" }}>Independent Voices</span>
              <div style={{ width: 28, height: 1, background: "rgba(201,168,76,0.3)" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
              {[
                {
                  quote: "The pre-staged architecture is architecturally sound. This is the operating model layer that enterprise governance has been missing.",
                  name: "Jayashree Ravi",
                  title: "Enterprise Architecture · Fortune 100 · Strategic Governance",
                },
                {
                  quote: "What Readiness OS captures is the difference between preparation and improvisation. The 12-minute claim is credible precisely because the work was done before the clock started.",
                  name: "Michael Juhler",
                  title: "Chief Risk Officer · Global Financial Services",
                },
                {
                  quote: "The concept of pre-commitment at the organizational level — not just individual — is precisely what enterprise resilience frameworks have failed to operationalize. This does it.",
                  name: "Roman Kos",
                  title: "Organizational Resilience · Enterprise Strategy",
                },
              ].map((v, i) => (
                <div key={i} style={{ padding: "28px 32px", background: "rgba(10,15,46,0.5)", border: "1px solid rgba(255,255,255,0.06)", borderLeft: `3px solid rgba(201,168,76,0.4)` }}>
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(15px,1.5vw,18px)", fontStyle: "italic", color: "rgba(255,255,255,0.82)", lineHeight: 1.65, marginBottom: 20 }}>
                    "{v.quote}"
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 20, height: 1, background: "rgba(201,168,76,0.35)" }} />
                    <div>
                      <p style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 2 }}>{v.name}</p>
                      <p style={{ ...DM, fontSize: 10, color: "rgba(255,255,255,0.45)", margin: 0 }}>{v.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Practitioner Quote — Dr. Kerry Huang */}
          <div style={{ margin: "0 0 64px", position: "relative" }}>
            <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", padding: "48px 56px", background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.14)", borderLeft: "3px solid rgba(201,168,76,0.5)" }}>
              {/* Large styled quote mark */}
              <div style={{ position: "absolute", top: 16, left: 20, fontFamily: "Georgia, serif", fontSize: 96, lineHeight: 1, color: "rgba(201,168,76,0.15)", userSelect: "none" as const, pointerEvents: "none" }}>❝</div>
              <div style={{ position: "absolute", bottom: 16, right: 20, fontFamily: "Georgia, serif", fontSize: 96, lineHeight: 1, color: "rgba(201,168,76,0.08)", userSelect: "none" as const, pointerEvents: "none", transform: "rotate(180deg)" }}>❝</div>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(20px,2.4vw,30px)", fontStyle: "italic", color: "rgba(255,255,255,0.92)", lineHeight: 1.55, marginBottom: 28, position: "relative", zIndex: 1 }}>
                "That is governance as pre-commitment, not governance as review."
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 16, position: "relative", zIndex: 1 }}>
                <div style={{ width: 32, height: 1, background: "rgba(201,168,76,0.4)" }} />
                <div>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 3 }}>
                    Dr. Kerry Huang
                  </p>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.68)", letterSpacing: "0.03em", margin: 0 }}>
                    Fortune 50 AVP · ESI Top 1% Researcher · Forbes Council · 408-firm governance study
                  </p>
                </div>
              </div>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.68)", marginTop: 16, fontStyle: "italic", position: "relative", zIndex: 1 }}>
                Produced independently — without product exposure — through intellectual exchange, April 2026
              </p>
            </div>

          </div>

          {/* Dr. Huang Public Repost — Full LinkedIn Post */}
          <div style={{ maxWidth: 800, margin: "0 auto 64px", background: NAVY, border: "1px solid rgba(201,168,76,0.18)", borderLeft: "4px solid rgba(201,168,76,0.7)" }}>
            <div style={{ padding: "32px 40px 28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
                <div style={{ width: 20, height: 1, background: "rgba(201,168,76,0.4)" }} />
                <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.26em", textTransform: "uppercase" as const, color: "rgba(201,168,76,0.75)" }}>Posted to his full professional network · LinkedIn · April 20, 2026</span>
                <div style={{ width: 20, height: 1, background: "rgba(201,168,76,0.4)" }} />
              </div>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(17px,1.8vw,22px)", fontStyle: "italic", color: "rgba(255,255,255,0.88)", lineHeight: 1.75, marginBottom: 18 }}>
                "What four weeks of public intellectual exchange with Martin Brunke surfaced is that AwaCourage — awareness paired with the willingness to act before consensus arrives — and the architecture that makes this capacity possible at scale are two different governance functions. Same mechanism, opposite directions.
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(17px,1.8vw,22px)", fontStyle: "italic", color: "rgba(255,255,255,0.88)", lineHeight: 1.75, marginBottom: 18 }}>
                Martin is building the architecture that makes clarity possible before pressure arrives. My research focuses on what determines whether that clarity actually converts into action when the system has not yet confirmed it is safe to move. Neither side replaces the other.
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(17px,1.8vw,22px)", fontStyle: "italic", color: GOLD, lineHeight: 1.75, marginBottom: 28, fontWeight: 600 }}>
                The boundary Martin named — between what architecture can supply and what only human capacity can carry — is where the next decade of governance work sits."
              </p>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20, display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 28, height: 1, background: "rgba(201,168,76,0.35)" }} />
                <div>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 3 }}>Dr. Kerry Huang</p>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.68)", letterSpacing: "0.02em", margin: 0 }}>Fortune 50 AVP · ESI Top 1% Researcher · Forbes Business Council · Named Martin Brunke by name to his full professional network</p>
                </div>
              </div>
            </div>
          </div>

          {/* Outcome metrics */}
          <div style={{ display: "flex", justifyContent: "center", gap: 0, marginBottom: 56, flexWrap: "wrap" }}>
            {outcomes.map((o, i) => (
              <div key={o.stat} style={{
                flex: "1 1 200px", padding: "32px 40px",
                borderRight: i < outcomes.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
                textAlign: "center",
              }}>
                <div style={{ ...GEO, fontSize: 44, fontWeight: 700, color: GOLD, lineHeight: 1, marginBottom: 10 }}>{o.stat}</div>
                <div style={{ ...DM, fontSize: 13, color: MUTED_DARK, lineHeight: 1.5, maxWidth: 180, margin: "0 auto" }}>{o.label}</div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ width: 48, height: 1, background: "rgba(255,255,255,0.08)", margin: "0 auto 48px" }} />

          {/* Founder story */}
          <div style={{ textAlign: "center" }}>
            <p style={{ ...DM, fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.45)", marginBottom: 24, letterSpacing: "0.02em" }}>
              Built by someone who ran execution at Ford · Lockheed Martin · Toyota · Charles Schwab · Vantiv/Worldpay · Boyd Gaming
            </p>
            <blockquote style={{ maxWidth: 680, margin: "0 auto", padding: 0, marginBottom: 32 }}>
              <p style={{ ...GEO, fontSize: 20, fontStyle: "italic", color: "#fff", lineHeight: 1.65, marginBottom: 16 }}>
                "After the fifth company I stopped being patient.
                <br />
                I built the infrastructure nobody else would."
              </p>
              <footer style={{ ...DM, fontSize: 13, color: GOLD, fontWeight: 600 }}>
                — Martin Brunke, Founder
              </footer>
            </blockquote>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
              <div style={{ width: 32, height: 1, background: "rgba(201,168,76,0.3)" }} />
              <Link
                href="/founder-story"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 15,
                  fontWeight: 500,
                  fontStyle: "italic",
                  color: GOLD_LIGHT,
                  textDecoration: "none",
                  letterSpacing: "0.04em",
                  opacity: 0.85,
                }}
              >
                Read the founder's story →
              </Link>
              <div style={{ width: 32, height: 1, background: "rgba(201,168,76,0.3)" }} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Executive Q&A ────────────────────────────────────────────────────────────
// ─── SECTION 8: Primary CTA ───────────────────────────────────────────────────
// ─── FEARLESS FINALE ──────────────────────────────────────────────────────────
function FearlessFinaleSection() {
  return (
    <section id="hp-fearless" className="hp-section-reduce" style={{ background: NAVY, padding: "96px 0 88px", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
      <div style={{ ...CONTAINER, maxWidth: 900, textAlign: "center" }}>
        <Reveal>
          <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: "rgba(201,168,76,0.6)", marginBottom: 36 }}>
            The Endpoint
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", marginBottom: 56 }}>
            {[
              { word: "Preparation", sub: "180 protocols pre-staged" },
              { word: "Readiness", sub: "12-minute response" },
              { word: "Fearless", sub: "The outcome", highlight: true },
            ].map((item, i) => (
              <Fragment key={item.word}>
                <div style={{ textAlign: "center", padding: "0 28px" }}>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: item.highlight ? "clamp(38px,5vw,60px)" : "clamp(22px,3vw,34px)",
                    fontWeight: 700,
                    color: item.highlight ? GOLD : "rgba(255,255,255,0.35)",
                    lineHeight: 1.05,
                    marginBottom: 10,
                  }}>
                    {item.word}
                  </div>
                  <div style={{ ...DM, fontSize: 9, color: item.highlight ? "rgba(201,168,76,0.55)" : "rgba(255,255,255,0.2)", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
                    {item.sub}
                  </div>
                </div>
                {i < 2 && (
                  <div style={{ color: "rgba(201,168,76,0.25)", fontSize: 22, fontWeight: 200, paddingTop: 10, flexShrink: 0 }}>→</div>
                )}
              </Fragment>
            ))}
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(26px,3.5vw,44px)", fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: 24, maxWidth: 760, margin: "0 auto 24px" }}>
            Any organization that prepares for every situation it expects to face<br />
            is no longer afraid of them.
          </h2>
          <p style={{ ...DM, fontSize: 15, color: "rgba(240,237,228,0.45)", lineHeight: 1.85, maxWidth: 560, margin: "0 auto 20px" }}>
            Speed is the evidence. Readiness is the promise. Fearless is the outcome.
          </p>
          <p style={{ ...DM, fontSize: 12, color: "rgba(201,168,76,0.55)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
            The response is ready before the trigger fires.
          </p>
        </Reveal>
      </div>
    </section>
  );
}


function HomepageFooter() {
  return (
    <footer style={{ background: FOOTER_NAVY, borderTop: "1px solid rgba(201,168,76,0.2)", padding: "60px 0 40px" }}>
      <div style={{ ...CONTAINER }}>

        {/* Decision Path strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, marginBottom: 52, background: "rgba(255,255,255,0.05)" }}>
          {[
            { q: "Not ready to commit?", cta: "Explore 12-Minute Experience", href: "/12-minute-experience", accent: "rgba(255,255,255,0.4)" },
            { q: "Want it built for your company?", cta: "Generate Your Executive Brief", href: "/prospect-brief", accent: TEAL },
            { q: "Ready to evaluate?", cta: "Request Founding Partner Access", href: "/request-access", accent: GOLD },
            { q: "Ready to deploy?", cta: "Apply for Full Access", href: "/request-access", accent: GOLD },
          ].map((p, i) => (
            <Link
              key={i}
              href={p.href}
              onClick={() => trackEvent("decision_path_click", { step: i + 1, cta: p.cta, href: p.href })}
              style={{ display: "block", background: FOOTER_NAVY, padding: "20px 24px", textDecoration: "none", borderTop: `2px solid ${i === 2 ? GOLD : i === 1 ? TEAL : "rgba(255,255,255,0.08)"}` }}
            >
              <div style={{ ...DM, fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.38)", letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 6 }}>{p.q}</div>
              <div style={{ ...DM, fontSize: 12, fontWeight: 700, color: p.accent, letterSpacing: "0.04em" }}>{p.cta} →</div>
            </Link>
          ))}
        </div>

        <div className="hp-footer-cols" style={{ display: "flex", gap: 48, marginBottom: 40 }}>

          {/* Brand */}
          <div style={{ flex: "0 0 280px" }}>
            <div style={{ marginBottom: 16 }}>
              <VaughnMartinLogo variant="full" height={80} color="light" />
            </div>
            <p style={{ ...GEO, fontStyle: "italic", fontSize: 16, color: GOLD_LIGHT, marginBottom: 6 }}>We Make Enterprises Fearless.</p>
            <p style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(201,168,76,0.55)", marginBottom: 16 }}>Fearless in minutes.</p>
            <p style={{ ...DM, fontSize: 12, color: MUTED_LIGHT }}>© 2026 VaughnMartin. All rights reserved.</p>
          </div>

          {/* Product */}
          <div style={{ flex: 1 }}>
            <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD, marginBottom: 20 }}>PRODUCT</div>
            {[
              { label: "How It Works",   href: "/how-it-works" },
              { label: "Protocol Coverage Browser", href: "/protocol-browser" },
              { label: "Readiness Protocols", href: "/playbook-library" },
              { label: "Pricing & Plans", href: "/pricing" },
              { label: "Apply for Founding Partner Access", href: "/request-access" },
              { label: "Schedule a Conversation", href: "/contact" },
            ].map(l => (
              <Link key={l.label} href={l.href} style={{ ...DM, display: "block", color: MUTED_DARK, fontSize: 14, padding: "4px 0", textDecoration: "none" }}>{l.label}</Link>
            ))}
          </div>

          {/* Demos */}
          <div style={{ flex: 1 }}>
            <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD, marginBottom: 20 }}>DEMOS</div>
            {[
              { label: "Situation Scanner",          href: "/situation-scanner" },
              { label: "Cost of Delay",             href: "/cost-of-delay" },
              { label: "Sector Threat Briefing",    href: "/sector-briefing" },
              { label: "12-Minute Test Drive",      href: "/12-minute-experience" },
              { label: "Shadow Simulator",          href: "/simulation-studio" },
              { label: "ROI Calculator",            href: "/roi-calculator" },
            ].map(l => (
              <Link key={l.label} href={l.href} style={{ ...DM, display: "block", color: MUTED_DARK, fontSize: 14, padding: "4px 0", textDecoration: "none" }}>{l.label}</Link>
            ))}
          </div>

          {/* Company */}
          <div style={{ flex: 1 }}>
            <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD, marginBottom: 20 }}>COMPANY</div>
            {[
              { label: "Team",               href: "/team" },
              { label: "Founder's Story",    href: "/founder-story" },
              { label: "vaughnmartin.com",   href: "/" },
              { label: "LinkedIn",           href: "https://linkedin.com/company/vaughnmartin", external: true },
            ].map(l => (
              l.external
                ? <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" style={{ ...DM, display: "block", color: MUTED_DARK, fontSize: 14, padding: "4px 0", textDecoration: "none" }}>{l.label}</a>
                : <Link key={l.label} href={l.href!} style={{ ...DM, display: "block", color: MUTED_DARK, fontSize: 14, padding: "4px 0", textDecoration: "none" }}>{l.label}</Link>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, textAlign: "center" }}>
          <p style={{ ...DM, fontSize: 11, color: MUTED_LIGHT }}>
            VaughnMartin · Readiness OS · Built for startup to Fortune 500 · Confidential
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Scroll depth analytics (Spec §11) ───────────────────────────────────────
function useScrollDepth() {
  useEffect(() => {
    const fired = new Set<number>();
    const handler = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      const pct = Math.round((window.scrollY / total) * 100);
      [25, 50, 75, 100].forEach(t => {
        if (pct >= t && !fired.has(t)) {
          fired.add(t);
          try { if ((window as any).dataLayer) (window as any).dataLayer.push({ event: "scroll_depth", percent: t }); } catch (_) {}
        }
      });
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
}

// ─── SECTION 3: Cinematic Contrast Moment ────────────────────────────────────
function WorkflowDistinctionSection() {
  return (
    <section style={{ background: "#fff", borderTop: "1px solid #E8E4DC", borderBottom: "1px solid #E8E4DC", padding: "80px 0" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
            <span style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: GOLD }}>The Distinction</span>
            <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(28px,3.5vw,42px)", fontWeight: 700, color: NAVY, lineHeight: 1.15, marginBottom: 12 }}>
            Every workflow tool assumes mobilization is solved.
          </h2>
          <p style={{ ...DM, fontSize: 17, color: "#6B7280", maxWidth: 560, margin: "0 auto" }}>
            It isn't. That assumption is where organizations lose 30 days.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, border: "1px solid #E8E4DC", maxWidth: 900, margin: "0 auto 40px" }}>
          <div style={{ padding: "40px 40px", background: "#F8F7F4", borderRight: "1px solid #E8E4DC", opacity: 0.8 }}>
            <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: "#9CA3AF", marginBottom: 20 }}>
              Workflow Tools — Jira · Monday · ServiceNow
            </div>
            <div style={{ ...DM, fontSize: 12, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 16 }}>Trigger fires.</div>
            {[
              "Someone opens a project tool",
              "Team asks: who owns this? What is the scope?",
              "Tasks are created from scratch under pressure",
              "Budget approval starts from zero",
              "Stakeholders align over 2–4 weeks of meetings",
              "Execution finally begins — 30 days later",
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 11, alignItems: "flex-start" }}>
                <span style={{ color: "#D1D5DB", fontSize: 13, flexShrink: 0, marginTop: 1 }}>→</span>
                <span style={{ ...DM, fontSize: 13, color: "#9CA3AF", lineHeight: 1.5 }}>{step}</span>
              </div>
            ))}
          </div>

          <div style={{ padding: "40px 40px", background: NAVY }}>
            <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 20 }}>
              Readiness Infrastructure — Readiness OS
            </div>
            <div style={{ ...DM, fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 16 }}>Before the trigger fires.</div>
            {[
              "180 Readiness Protocols pre-staged — one for every situation you'll face",
              "Named owners, pre-assigned tasks, decision authority mapped",
              "Budget envelope pre-authorized — zero approval delay",
              "Communication chain pre-drafted and ready to deploy",
              "Executive authorizes once — the org moves in 12 minutes",
              "Executing before competitors hold their first meeting",
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 11, alignItems: "flex-start" }}>
                <span style={{ color: GOLD, fontSize: 13, flexShrink: 0, marginTop: 1 }}>✓</span>
                <span style={{ ...DM, fontSize: 13, color: "rgba(255,255,255,0.82)", lineHeight: 1.5 }}>{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(18px,2vw,26px)", fontWeight: 700, color: NAVY, margin: 0 }}>
            This is not a workflow tool. It is readiness infrastructure.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── SOCIAL PROOF STRIP — surfaces near top per board recommendation ──────────
// ─── THIRTY-SECOND BRIEF ──────────────────────────────────────────────────────
// First white section after the hero. Four questions every visitor needs to be
// able to answer and repeat. One sentence each. No jargon. No abstractions.
function EngagementBridge() {
  return (
    <section style={{ background: "#F8F7F4", borderTop: "1px solid #E8E4DC", borderBottom: "1px solid #E8E4DC", padding: "0" }}>
      <div style={{ ...CONTAINER, paddingTop: 0, paddingBottom: 0 }}>
        <div style={{ display: "flex", alignItems: "stretch", borderLeft: "1px solid #E8E4DC", borderRight: "1px solid #E8E4DC" }}>
          {/* Label column */}
          <div style={{ flexShrink: 0, width: 200, padding: "28px 24px", borderRight: "1px solid #E8E4DC", display: "flex", flexDirection: "column" as const, justifyContent: "center", background: "#fff" }}>
            <div style={{ ...DM, fontSize: 9, fontWeight: 800, letterSpacing: "0.26em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 6 }}>Choose your path</div>
            <div style={{ ...DM, fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>Three ways in — pick the one that matches where you are.</div>
          </div>
          {/* Three paths */}
          <style>{`
            .eng-bridge-grid { display: flex; flex: 1; }
            @media (max-width: 760px) { .eng-bridge-grid { flex-direction: column; } .eng-bridge-label-col { display: none !important; } }
          `}</style>
          <div className="eng-bridge-grid">
            {[
              {
                step: "01",
                label: "Experience it yourself",
                sub: "No demo call. No signup. Pick a scenario, watch the 12-minute response unfold, see every decision point.",
                cta: "Run the 12-Minute Test Drive →",
                href: "/12-minute-experience",
                accentColor: GOLD,
                bg: "rgba(201,168,76,0.03)",
              },
              {
                step: "02",
                label: "See your specific situation",
                sub: "Have a scenario in mind? Ransomware, activist investor, supply chain, regulatory deadline — see the protocol that handles it.",
                cta: "Browse All Scenarios →",
                href: "/demo-hub",
                accentColor: TEAL,
                bg: "rgba(43,138,110,0.03)",
              },
              {
                step: "03",
                label: "Get the executive brief",
                sub: "Need to show this to someone? The one-pager — comparison table, proof numbers, ROI case, Founding Partner terms.",
                cta: "Open the Executive Brief →",
                href: "/executive-brief",
                accentColor: NAVY,
                bg: "rgba(10,15,46,0.02)",
              },
            ].map(({ step, label, sub, cta, href, accentColor, bg }, i) => (
              <Link
                key={step}
                href={href}
                onClick={() => trackEvent("engagement_bridge_click", { step, label, href })}
                style={{ textDecoration: "none", flex: 1, display: "flex", flexDirection: "column" as const, padding: "28px 24px", borderRight: i < 2 ? "1px solid #E8E4DC" : "none", background: bg, transition: "background 0.15s" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 20, height: 20, background: accentColor, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 8, fontWeight: 800, color: accentColor === NAVY ? "#fff" : NAVY }}>{step}</span>
                  </div>
                  <span style={{ ...DM, fontSize: 12, fontWeight: 700, color: NAVY, lineHeight: 1.3 }}>{label}</span>
                </div>
                <p style={{ ...DM, fontSize: 11, color: "#4B5563", lineHeight: 1.6, margin: "0 0 14px", flex: 1 }}>{sub}</p>
                <span style={{ ...DM, fontSize: 11, fontWeight: 700, color: accentColor, letterSpacing: "0.04em", borderBottom: `1px solid ${accentColor}40`, paddingBottom: 1, alignSelf: "flex-start" as const }}>{cta}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── GUIDED EVALUATION PATH ───────────────────────────────────────────────────
function GuidedEvaluationPath() {
  const steps = [
    {
      n: "1",
      label: "Experience it",
      cta: "Run the 12-Minute Test Drive",
      sub: "Pick a scenario, watch the response unfold.",
      href: "/12-minute-experience",
      color: GOLD,
    },
    {
      n: "2",
      label: "Quantify it",
      cta: "Calculate Your ROI",
      sub: "Your numbers, your industry, your break-even.",
      href: "/roi-calculator",
      color: TEAL,
    },
    {
      n: "3",
      label: "Document it",
      cta: "Generate Your Executive Brief",
      sub: "A shareable one-pager built for your company.",
      href: "/prospect-brief",
      color: GOLD_LIGHT,
    },
    {
      n: "4",
      label: "Commit to it",
      cta: "Apply for Founding Partner Access",
      sub: "Start the 90-day validation partnership.",
      href: "/request-access",
      color: TEAL_LIGHT,
    },
  ];
  return (
    <section id="guided-evaluation-path" style={{ background: NAVY_BG, borderTop: "1px solid rgba(255,255,255,0.08)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "56px 0" }}>
      <div style={{ ...CONTAINER }}>
        <div style={{ textAlign: "center" as const, marginBottom: 40 }}>
          <div style={{ ...DM, fontSize: 10, fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 10 }}>
            Your Evaluation Path
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(24px,2.4vw,34px)", fontWeight: 700, color: "#fff", margin: 0 }}>
            Four steps. No sales call required until step four.
          </h2>
        </div>
        <style>{`
          .gep-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; }
          .gep-arrow { display: flex; align-items: center; justify-content: center; }
          @media (max-width: 900px) { .gep-grid { grid-template-columns: 1fr; } .gep-arrow { transform: rotate(90deg); margin: 4px 0; } }
        `}</style>
        <div className="gep-grid">
          {steps.map((s, i) => (
            <div key={s.n} style={{ display: "flex", alignItems: "stretch" }}>
              <Link
                href={s.href}
                data-testid={`link-guided-path-step-${s.n}`}
                onClick={() => trackEvent("guided_path_click", { step: s.n, label: s.label, href: s.href })}
                style={{
                  textDecoration: "none",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column" as const,
                  padding: "24px 22px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderTop: `2px solid ${s.color}`,
                  transition: "background 0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", border: `1px solid ${s.color}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ ...DM, fontSize: 10, fontWeight: 800, color: s.color }}>{s.n}</span>
                  </div>
                  <span style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.5)" }}>
                    {s.label}
                  </span>
                </div>
                <span style={{ ...DM, fontSize: 14, fontWeight: 700, color: "#fff", lineHeight: 1.35, marginBottom: 8 }}>
                  {s.cta}
                </span>
                <p style={{ ...DM, fontSize: 11.5, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: "0 0 12px", flex: 1 }}>
                  {s.sub}
                </p>
                <span style={{ ...DM, fontSize: 11, fontWeight: 700, color: s.color, letterSpacing: "0.04em" }}>
                  Go →
                </span>
              </Link>
              {i < steps.length - 1 && (
                <div className="gep-arrow" style={{ width: 0 }}>
                  <span style={{ position: "relative", left: -1, zIndex: 1, color: "rgba(255,255,255,0.25)", fontSize: 16, background: NAVY_BG, padding: "0 2px" }}>→</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FOUNDING PARTNER CLOSE ───────────────────────────────────────────────────
function FoundingPartnerCloseSection() {
  return (
    <section id="hp-cta" style={{ background: NAVY, borderTop: `3px solid ${GOLD}`, padding: "80px 0 72px" }}>
      <div style={{ ...CONTAINER }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 32, marginBottom: 56 }}>
          <div style={{ maxWidth: 560 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <div style={{ width: 32, height: 1.5, background: GOLD }} />
              <span style={{ ...DM, fontSize: 10, fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: GOLD }}>The Founding Partner Program</span>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(32px,3vw,48px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, margin: "0 0 20px" }}>
              A 90-Day Validated Partnership.<br />
              <span style={{ color: GOLD }}>Not a Trial. Not a Demo.</span>
            </h2>
            <p style={{ ...DM, fontSize: 15, color: "rgba(255,255,255,0.72)", lineHeight: 1.7, margin: 0, maxWidth: 500 }}>
              Founding Partners work directly with VaughnMartin to configure Readiness OS against their actual situation library — then operate it live for 90 days with full executive support. The outcome is a measured, documented readiness baseline your board can see.
            </p>
          </div>
          {/* Urgency signal */}
          <div style={{ padding: "24px 28px", border: `1px solid ${GOLD}55`, background: "rgba(201,168,76,0.07)", minWidth: 240, flexShrink: 0 }}>
            <div style={{ ...DM, fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 14 }}>Q3 2026 Cohort</div>

            {/* Seat progress bar */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 44, fontWeight: 700, color: "#fff", lineHeight: 1 }}>12</div>
                <div style={{ ...DM, fontSize: 11, color: "rgba(255,255,255,0.45)" }}>total seats</div>
              </div>
              <div style={{ height: 3, background: "rgba(255,255,255,0.08)", marginBottom: 8 }}>
                <div style={{ height: 3, width: "33%", background: GOLD }} />
              </div>
              <div style={{ ...DM, fontSize: 10, color: "rgba(255,255,255,0.5)" }}>
                <span style={{ color: GOLD, fontWeight: 700 }}>4 seats in review</span> · 8 remaining
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column" as const, gap: 8, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", flexShrink: 0 }} />
                <span style={{ ...DM, fontSize: 11, color: "rgba(255,255,255,0.78)", fontWeight: 600 }}>Applications open now</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD, flexShrink: 0 }} />
                <span style={{ ...DM, fontSize: 11, color: "rgba(255,255,255,0.55)" }}>Reviewed weekly by the founder</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
                <span style={{ ...DM, fontSize: 11, color: "rgba(255,255,255,0.45)" }}>Cohort closes September 30</span>
              </div>
            </div>
          </div>
        </div>

        {/* What you get / What we need — two column */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, marginBottom: 48 }}>
          {/* What you get */}
          <div style={{ padding: "32px 36px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ ...DM, fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: TEAL, marginBottom: 20 }}>What you receive</div>
            {[
              "Full Readiness OS configuration against your actual situation library",
              "180 Readiness Protocols mapped to your organization's structure",
              "Live 90-day operation with real signal monitoring and protocol activation",
              "Executive readiness score and board-ready reporting at close",
              "Priority access to ADVANCE 2.0 continuous learning loop",
              "Direct access to VaughnMartin's founding team throughout the partnership",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2, border: `1px solid ${TEAL}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 8, color: TEAL, fontWeight: 800 }}>✓</span>
                </div>
                <span style={{ ...DM, fontSize: 13, color: "rgba(255,255,255,0.78)", lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
          {/* What we need */}
          <div style={{ padding: "32px 36px", background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.14)" }}>
            <div style={{ ...DM, fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 20 }}>What we ask of you</div>
            {[
              "C-suite sponsorship — one named executive as the authorization authority",
              "Identification of 8–12 strategic situations your organization faces annually",
              "Access to 3–5 functional owners for protocol configuration (4 hours total)",
              "One live activation during the 90-day window — real signal, real execution",
              "A close-out debrief with VaughnMartin to document outcomes and validate ROI",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2, border: `1px solid ${GOLD}88`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 8, color: GOLD, fontWeight: 800 }}>→</span>
                </div>
                <span style={{ ...DM, fontSize: 13, color: "rgba(255,255,255,0.78)", lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Close — CTA + proof line */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 24, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div>
            <p style={{ ...DM, fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "0 0 6px" }}>
              Applications are reviewed within 48 hours. No sales call required to apply.
            </p>
            <p style={{ ...DM, fontSize: 12, color: "rgba(255,255,255,0.32)", margin: 0 }}>
              Founding Partner terms include preferred pricing locked for 36 months and co-development rights on the next two protocol library expansions.
            </p>
          </div>
          <Link
            href="/request-access"
            style={{ ...DM, display: "inline-block", background: GOLD, color: NAVY, fontWeight: 700, fontSize: 14, padding: "18px 40px", textDecoration: "none", letterSpacing: "0.07em", textTransform: "uppercase" as const, whiteSpace: "nowrap" as const, flexShrink: 0 }}
          >
            Apply for Founding Partner Access →
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── 90-SECOND BRAND FILM SECTION ─────────────────────────────────────────────
function FilmSection() {
  return (
    <section style={{ background: NAVY, borderTop: "1px solid rgba(201,168,76,0.15)", padding: "72px 0 64px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 14 }}>
            <div style={{ width: 32, height: 1, background: GOLD }} />
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: GOLD }}>
              Platform Walkthrough
            </span>
            <div style={{ width: 32, height: 1, background: GOLD }} />
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(26px, 3.2vw, 40px)", fontWeight: 700, color: "#fff", lineHeight: 1.2, margin: "0 0 12px" }}>
            See the 12-Minute Execution Chain
          </h2>
          <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.55)", maxWidth: 520, margin: "0 auto" }}>
            Watch how a situation that used to take 30 days to mobilize compresses to 12 minutes — with the response already staged before the trigger fires.
          </p>
        </div>

        {/* Video player — sources try API endpoint first, then static fallback */}
        <div style={{ position: "relative", background: "#000", border: "1px solid rgba(201,168,76,0.22)" }}>
          <video
            controls
            preload="metadata"
            style={{ width: "100%", display: "block", maxHeight: 540 }}
          >
            <source src="/api/video/demo" type="video/mp4" />
            <source src="/videos/readiness-os-demo.mp4" type="video/mp4" />
            Your browser does not support video playback.
          </video>
        </div>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Link
            href="/video"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: GOLD, textDecoration: "none", borderBottom: `1px solid rgba(201,168,76,0.35)`, paddingBottom: 3 }}
          >
            Open Full-Screen Walkthrough →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Homepage() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  useScrollDepth();
  useEffect(() => {
    updatePageMetadata({
      title: "VaughnMartin | Readiness OS — Enterprise Readiness Infrastructure",
      description: "Readiness OS gives startup to Fortune 500 enterprises end-to-end advantage: map every situation you'll face, monitor the right signals, decide with authority, execute in 12 minutes, and improve every cycle. 180 Readiness Protocols, 248+ data points, zero improvisation.",
      ogTitle: "VaughnMartin Readiness OS — End-to-End Organizational Advantage",
      ogDescription: "The response is ready before the trigger fires. Map · Monitor · Decide · Execute · Learn — the complete operating architecture for startup to Fortune 500 execution. 3,600× Execution Head Start.",
    });
  }, []);
  return (
    <div style={{ background: NAVY, margin: 0, padding: 0 }}>
      <HomepageStyles />
      <FirstVisitAdModal />
      <StandardNav />
      <GuestPreviewBanner hideDefaultStrip />

      {/* §1 HERO — qualify the buyer, then deliver the claim */}
      <HeroSection />

      {/* §2 THE GAP — animated 30 days vs 12 minutes, then the competitive positioning hook */}
      <RealityGapSimulator />
      <MicrosoftHookStrip />

      {/* §2.5 90-SECOND BRAND FILM — "see it work in 90 seconds" */}
      <FilmSection />

      {/* Bridge — 3 clear paths: experience it / see a scenario / get the brief */}
      <EngagementBridge />

      {/* §3 SITUATIONS — concrete customer scenarios, shown before the mechanism is explained */}
      <ScenarioCardsRow />

      {/* §4 HOW IT EXECUTES — IDEA Framework, platform in action, distinction from workflow tools */}
      <IDEASection />
      <PlatformScreenshotSection />
      <WorkflowDistinctionSection />

      {/* §5 PROOF — research organizations + outcome stats */}
      <CredibilitySection />

      {/* §6 FEARLESS FINALE — Preparation → Readiness → Fearless */}
      <FearlessFinaleSection />

      {/* Guided Evaluation Path — sequential self-serve steps before the final ask */}
      <GuidedEvaluationPath />

      {/* §7 FOUNDING PARTNER CLOSE — named offer, specific terms, real commitment */}
      <FoundingPartnerCloseSection />

      <HomepageFooter />
    </div>
  );
}

