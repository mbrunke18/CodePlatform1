import { Link, useLocation } from "wouter";
import { Play, ArrowRight, ChevronRight } from "lucide-react";
import { ExecuteIQLogo } from "@/components/ExecuteIQLogo";
import PageLayout from "@/components/layout/PageLayout";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";
const MUTED = "#6B7280";
const RUST = "#1B3A6B";
const VIOLET = "#0A0F2E";
const DM: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };
const SERIF: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

const OPERATING_MODEL = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "How It Executes", href: "/how-it-executes" },
  { label: "IDEA Framework", href: "/idea-framework" },
  { label: "Platform Overview", href: "/platform-overview" },
  { label: "Why Readiness OS", href: "/the-proof" },
  { label: "Enterprise Ecosystems", href: "/ecosystems" },
];

const TECH_ARCH = [
  { label: "Execution Data Fabric", sub: "How signals become staged responses", href: "/execution-data-fabric" },
  { label: "Institutional Memory Engine", sub: "The compounding dataset — improves with every activation", href: "/institutional-memory-engine" },
  { label: "Universal Connector", sub: "Any stack · 55+ pre-built connectors · live in 15 minutes", href: "/universal-connector" },
];

const PHASES = [
  {
    id: "DETECT", color: TEAL, dark: "#1d6b52",
    label: "DETECT", sublabel: "Continuous monitoring",
    tagline: "Every signal. Every trigger. Every 15 minutes.",
    buttons: [
      { label: "Signal Intelligence", href: "/signal-intelligence" },
      { label: "Trigger Monitoring", href: "/triggers-management" },
      { label: "Intelligence Hub", href: "/intelligence-hub" },
      { label: "Predictive Intelligence", href: "/predictive-intelligence" },
      { label: "Command Tower", href: "/command-tower" },
      { label: "Intelligence Control Center", href: "/intelligence-control-center" },
      { label: "9-Domain Coverage Board", href: "/situations-hub" },
    ],
  },
  {
    id: "PREPARE", color: "#8B6914", dark: "#6b4f0e",
    label: "PREPARE", sublabel: "Pre-staged protocols",
    tagline: "180 responses ready before the trigger fires.",
    buttons: [
      { label: "Protocol Library — 180", href: "/playbooks" },
      { label: "Mission Control", href: "/mission-control" },
      { label: "Quarterly Readiness Planning", href: "/quarterly-planning" },
      { label: "Preparation Architect Guide", href: "/pmo-onboarding" },
      { label: "Workspace", href: "/workspace" },
      { label: "Situation Intents", href: "/identify/situation-intents" },
      { label: "Protocol Builder", href: "/protocol-builder" },
      { label: "Practice Drills", href: "/practice-drills" },
      { label: "Readiness Rhythm", href: "/readiness-rhythm" },
    ],
  },
  {
    id: "EXECUTE", color: RUST, dark: "#132558",
    label: "EXECUTE", sublabel: "12-minute activation",
    tagline: "From trigger to full coordination in 12 minutes.",
    buttons: [
      { label: "Live Activation Center", href: "/live-activation-center" },
      { label: "War Room", href: "/war-room" },
      { label: "Coordination Intelligence", href: "/coordination-intelligence" },
      { label: "Crisis Communications", href: "/crisis-communications" },
      { label: "Financial Exposure Estimator", href: "/financial-exposure" },
      { label: "Stakeholder Notifications", href: "/mission-control" },
      { label: "Concurrent Situations", href: "/concurrent-situations" },
    ],
  },
  {
    id: "LEARN", color: VIOLET, dark: "#070B21",
    label: "LEARN", sublabel: "Closed-loop improvement",
    tagline: "Every activation sharpens the next response.",
    buttons: [
      { label: "ADVANCE 2.0", href: "/advance-intelligence" },
      { label: "Sector Intelligence", href: "/sector-intelligence" },
      { label: "Tendency Intelligence", href: "/tendency-intelligence" },
      { label: "Advanced Analytics", href: "/advanced-analytics" },
      { label: "AI Radar Dashboard", href: "/ai-radar" },
      { label: "Proof Story — Outcomes", href: "/proof-story" },
      { label: "Debrief Center", href: "/practice-drills" },
    ],
  },
];

const DOMAINS = [
  {
    label: "GROWTH & POSITIONING", count: "63", color: GOLD, bg: "rgba(201,168,76,0.08)",
    href: "/demo/market-entry",
    examples: ["M&A Response", "Competitor Displacement", "Go-to-Market Sprint", "Workforce Transformation"],
  },
  {
    label: "RISK & RESILIENCE", count: "85", color: TEAL, bg: "rgba(43,138,110,0.08)",
    href: "/demo/ransomware",
    examples: ["Ransomware Response", "Activist Investor", "Supply Chain Collapse", "Data Breach", "DOJ Investigation"],
  },
  {
    label: "TRANSFORMATION", count: "62", color: VIOLET, bg: "rgba(91,79,190,0.08)",
    href: "/demo/workforce",
    examples: ["Digital Transformation", "Workforce Restructuring", "System Migrations", "Culture Shift"],
  },
];

const JOURNEY = [
  { step: "01", label: "Understand the Problem", sub: "Cost of delay", href: "/cost-of-delay", color: NAVY },
  { step: "02", label: "See It Work", sub: "12-minute test drive", href: "/12-minute-experience", color: TEAL },
  { step: "03", label: "Build the Business Case", sub: "ROI calculator", href: "/roi-calculator", color: GOLD },
  { step: "04", label: "Apply for Access", sub: "Founding Partner Program", href: "/request-access", color: RUST },
  { step: "05", label: "Go Live in 30 Days", sub: "Setup + first activation", href: "/getting-started", color: NAVY },
  { step: "06", label: "Run Protocols", sub: "180 pre-staged responses", href: "/playbooks", color: TEAL },
  { step: "07", label: "Improve Continuously", sub: "ADVANCE 2.0 closed loop", href: "/advance-intelligence", color: VIOLET },
];

const PROOF = [
  { label: "ROI Calculator", href: "/roi-calculator", featured: true },
  { label: "Executive Brief", href: "/executive-brief", featured: true },
  { label: "Readiness Benchmark — Free", href: "/readiness-benchmark", featured: true },
  { label: "Cost of Delay", href: "/cost-of-delay" },
  { label: "Proof Story", href: "/proof-story" },
  { label: "The Case", href: "/the-case" },
  { label: "Research Foundation", href: "/research" },
  { label: "Mobilization Tax", href: "/mobilization-tax" },
  { label: "Security & Compliance", href: "/security-compliance" },
];

const EXPERIENCE = [
  { label: "12-Minute Test Drive", href: "/12-minute-experience", featured: true },
  { label: "Demo Hub — 12 Scenarios", href: "/demo-hub", featured: true },
  { label: "Master Demo — Activist Investor", href: "/master-demo" },
  { label: "How It Executes", href: "/how-it-executes" },
  { label: "Industry Demo Library", href: "/industry-demo-library" },
  { label: "Protocol Coverage Browser", href: "/protocol-browser" },
];

const ONBOARDING = [
  { label: "Getting Started Hub", href: "/getting-started", featured: true },
  { label: "Preparation Architect Onboarding", href: "/pmo-onboarding", featured: true },
  { label: "30-Day Preparation Arc", href: "/preparation-arc" },
  { label: "Technical Onboarding", href: "/technical-onboarding" },
  { label: "Integration Setup Plan", href: "/integrations" },
  { label: "Protocol Builder", href: "/protocol-builder" },
];

const EVALUATE = [
  { label: "Readiness Benchmark — Free", href: "/readiness-benchmark" },
  { label: "vs. Consulting Firms", href: "/vs-consulting" },
  { label: "vs. Microsoft Copilot", href: "/ms-project" },
  { label: "Platform Reality Check", href: "/platform-reality" },
  { label: "Pricing", href: "/pricing" },
  { label: "Security & Compliance", href: "/security-compliance" },
  { label: "Investor Overview", href: "/investors" },
];

function PhaseBtn({ label, href, color }: { label: string; href: string; color: string }) {
  return (
    <Link href={href} style={{
      ...DM,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "9px 12px 9px 14px",
      fontSize: 12,
      fontWeight: 600,
      color: "#1a1a2e",
      background: "#fff",
      borderLeft: `3px solid ${color}`,
      borderTop: "1px solid rgba(10,15,46,0.06)",
      borderRight: "1px solid rgba(10,15,46,0.06)",
      borderBottom: "1px solid rgba(10,15,46,0.06)",
      textDecoration: "none",
      transition: "background 0.12s, color 0.12s",
    }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = `${color}10`;
        el.style.color = color;
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "#fff";
        el.style.color = "#1a1a2e";
      }}
    >
      {label}
      <ChevronRight size={11} style={{ opacity: 0.4, flexShrink: 0 }} />
    </Link>
  );
}

function SectionLabel({ children, color = GOLD }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
      <div style={{ width: 24, height: 2, background: color }} />
      <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color }}>{children}</div>
    </div>
  );
}

export default function PlatformHub() {
  const [, navigate] = useLocation();

  return (
    <PageLayout>
    <div style={{ background: IVORY, minHeight: "100vh" }}>
      <style>{`
        @media (max-width: 768px) {
          .ph-header-band { padding: 0 16px !important; }
          .ph-content-pad { padding: 24px 16px 40px !important; }
          .ph-4col-grid   { grid-template-columns: 1fr 1fr !important; }
          .ph-3col-grid   { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .ph-4col-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── PAGE TITLE BAND ── white, clearly separated from the navy nav above */}
      <div className="ph-header-band" style={{
        background: "#fff",
        borderBottom: "1px solid rgba(10,15,46,0.10)",
        padding: "0 40px",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", gap: 20, flexWrap: "wrap" }}>
          {/* Left: page title */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 3, height: 28, background: TEAL, borderRadius: 2, flexShrink: 0 }} />
            <div>
              <div style={{ ...DM, fontSize: 9.5, fontWeight: 700, letterSpacing: "0.2em", color: MUTED, textTransform: "uppercase", marginBottom: 2 }}>Platform Map</div>
              <div style={{ ...SERIF, fontSize: 17, fontWeight: 700, color: NAVY, lineHeight: 1.1 }}>The response is ready before the trigger fires.</div>
            </div>
          </div>
          {/* Right: key metrics + CTAs */}
          <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
            {[{ n: "180", l: "Protocols" }, { n: "231", l: "Triggers" }, { n: "12 min", l: "Execution" }, { n: "3,600×", l: "Head Start" }].map(s => (
              <div key={s.n} style={{ textAlign: "center" }}>
                <div style={{ ...DM, fontSize: 18, fontWeight: 900, color: NAVY, lineHeight: 1 }}>{s.n}</div>
                <div style={{ ...DM, fontSize: 9, fontWeight: 700, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
            <div style={{ width: 1, height: 28, background: "rgba(10,15,46,0.12)", flexShrink: 0 }} />
            <div style={{ display: "flex", gap: 8 }}>
              <Link href="/12-minute-experience" style={{ ...DM, display: "inline-flex", alignItems: "center", gap: 6, background: GOLD, color: NAVY, fontWeight: 900, fontSize: 11, padding: "8px 16px", textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: "0.15rem" }}>
                <Play size={10} fill={NAVY} /> Try It Now
              </Link>
              <Link href="/request-access" style={{ ...DM, display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", color: NAVY, fontWeight: 600, fontSize: 11, padding: "7px 14px", textDecoration: "none", border: "1px solid rgba(10,15,46,0.2)", borderRadius: "0.15rem" }}>
                Apply for Access <ArrowRight size={10} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="ph-content-pad" style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 40px 56px" }}>

        {/* ── OPERATING MODEL STRIP ── */}
        <div style={{ marginBottom: 20 }}>
          <SectionLabel>The Operating Model</SectionLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {OPERATING_MODEL.map(item => (
              <Link key={item.href} href={item.href} style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "#fff", border: `1px solid rgba(10,15,46,0.14)`, borderLeft: `3px solid ${NAVY}`, ...DM, fontSize: 12, fontWeight: 700, color: NAVY, letterSpacing: "0.02em", boxShadow: "0 1px 4px rgba(10,15,46,0.06)", transition: "border-color 0.12s, box-shadow 0.12s" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderLeftColor = GOLD; el.style.boxShadow = "0 2px 10px rgba(10,15,46,0.12)"; el.style.color = GOLD; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderLeftColor = NAVY; el.style.boxShadow = "0 1px 4px rgba(10,15,46,0.06)"; el.style.color = NAVY; }}
              >
                {item.label} <ChevronRight size={10} style={{ opacity: 0.4 }} />
              </Link>
            ))}
          </div>
        </div>

        {/* ── PLATFORM CHAIN ── */}
        <div style={{ marginBottom: 28 }}>
          <SectionLabel>The Platform · Detect → Prepare → Execute → Learn</SectionLabel>
          <div className="ph-4col-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {PHASES.map((phase, i) => (
              <div key={phase.id} style={{ overflow: "hidden", boxShadow: "0 2px 12px rgba(10,15,46,0.08)" }}>
                {/* Solid colored phase header */}
                <div style={{ background: phase.color, padding: "14px 16px 12px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ ...DM, fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: "0.04em" }}>{phase.label}</span>
                    <span style={{ ...DM, fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "0.08em", textTransform: "uppercase" }}>0{i + 1}</span>
                  </div>
                  <div style={{ ...DM, fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.7)", letterSpacing: "0.05em", marginBottom: 2 }}>{phase.sublabel}</div>
                  <div style={{ ...DM, fontSize: 10, color: "rgba(255,255,255,0.5)", fontStyle: "italic", lineHeight: 1.3 }}>{phase.tagline}</div>
                </div>
                {/* Buttons with left-border accent */}
                <div style={{ background: "#fff", display: "flex", flexDirection: "column", gap: 4, padding: 8 }}>
                  {phase.buttons.map(btn => (
                    <PhaseBtn key={btn.label} label={btn.label} href={btn.href} color={phase.color} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── PRODUCT IN ACTION ── */}
        <div style={{ marginBottom: 28 }}>
          <SectionLabel>The Platform in Action</SectionLabel>
          <div className="ph-3col-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {([
              { img: "/screenshots/deck_signals.jpg", label: "DETECT", title: "Signal Intelligence", sub: "231 triggers · live monitoring every 15 min", color: TEAL },
              { img: "/screenshots/protocol_library_v2.jpg", label: "PREPARE", title: "Protocol Library", sub: "180 responses pre-staged before the trigger fires", color: GOLD },
              { img: "/screenshots/deck_activation.jpg", label: "EXECUTE", title: "Activation Console", sub: "12-minute coordination chain from trigger to execution", color: NAVY },
            ] as const).map(item => (
              <div key={item.label} style={{ overflow: "hidden", boxShadow: "0 4px 20px rgba(10,15,46,0.10)", border: "1px solid rgba(10,15,46,0.10)" }}>
                <div style={{ borderLeft: `3px solid ${item.color}`, padding: "9px 14px 8px", background: NAVY }}>
                  <div style={{ ...DM, fontSize: 8, fontWeight: 700, letterSpacing: "0.22em", color: item.color, textTransform: "uppercase" as const, marginBottom: 2 }}>{item.label}</div>
                  <div style={{ ...SERIF, fontSize: 15, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>{item.title}</div>
                  <div style={{ ...DM, fontSize: 9, color: "rgba(255,255,255,0.38)", letterSpacing: "0.06em", marginTop: 2 }}>{item.sub}</div>
                </div>
                <div style={{ aspectRatio: "16/10", overflow: "hidden", background: "#0a0f2e" }}>
                  <img src={item.img} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── STRATEGIC DOMAINS ── */}
        <div style={{ marginBottom: 28 }}>
          <SectionLabel>Strategic Domains · 210 Protocols Across 3 Domains</SectionLabel>
          <div className="ph-3col-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {DOMAINS.map(d => (
              <Link key={d.label} href={d.href} style={{ textDecoration: "none", display: "block", background: d.bg, border: `1px solid ${d.color}30`, borderLeft: `5px solid ${d.color}`, padding: "18px 20px 16px", transition: "box-shadow 0.15s", boxShadow: "0 2px 8px rgba(10,15,46,0.05)" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px ${d.color}30, 0 0 0 1px ${d.color}50`}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(10,15,46,0.05)"}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                  <div>
                    <div style={{ ...DM, fontSize: 14, fontWeight: 900, color: d.color, letterSpacing: "0.05em", marginBottom: 2 }}>{d.label}</div>
                    <div style={{ ...SERIF, fontSize: 28, fontWeight: 700, color: NAVY, lineHeight: 1 }}>{d.count} <span style={{ fontSize: 14, fontWeight: 600, color: MUTED }}>protocols</span></div>
                  </div>
                  <div style={{ ...DM, fontSize: 11, fontWeight: 700, color: d.color, display: "flex", alignItems: "center", gap: 3, marginTop: 4, background: `${d.color}15`, padding: "5px 10px", borderRadius: "0.15rem" }}>
                    See Demo <ArrowRight size={10} />
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {d.examples.map(ex => (
                    <span key={ex} style={{ ...DM, fontSize: 10, fontWeight: 600, color: NAVY, background: "rgba(10,15,46,0.06)", padding: "3px 8px", letterSpacing: "0.02em" }}>{ex}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── EVALUATE & DECIDE — dark strip ── */}
        <div style={{ marginBottom: 28, background: NAVY, padding: "16px 20px", boxShadow: "0 2px 12px rgba(10,15,46,0.15)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, whiteSpace: "nowrap" as const, marginRight: 4 }}>
              Evaluate & Decide
            </div>
            <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.15)" }} />
            {EVALUATE.map(e => (
              <Link key={e.label} href={e.href} style={{ ...DM, fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.8)", textDecoration: "none", padding: "5px 12px", border: "1px solid rgba(255,255,255,0.18)", whiteSpace: "nowrap" as const, transition: "border-color 0.12s, color 0.12s, background 0.12s", borderRadius: "0.15rem" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = GOLD; el.style.color = GOLD; el.style.background = "rgba(201,168,76,0.08)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,0.18)"; el.style.color = "rgba(255,255,255,0.8)"; el.style.background = "transparent"; }}
              >
                {e.label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── BOTTOM 4-COLUMN GRID ── */}
        <div className="ph-4col-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>

          {/* CUSTOMER JOURNEY */}
          <div style={{ overflow: "hidden", boxShadow: "0 2px 8px rgba(10,15,46,0.07)" }}>
            <div style={{ background: NAVY, backgroundImage: "radial-gradient(ellipse at 80% 20%, rgba(201,168,76,0.12) 0%, transparent 60%)", padding: "12px 16px" }}>
              <div style={{ ...DM, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 3 }}>Customer Journey</div>
              <div style={{ ...SERIF, fontSize: 16, fontWeight: 700, color: "#fff" }}>Discovery → Active Use</div>
            </div>
            <div style={{ background: "#fff", padding: "10px" }}>
              {JOURNEY.map(j => (
                <Link key={j.step} href={j.href} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderLeft: `3px solid ${j.color}`, marginBottom: 5, background: "#fff", borderTop: "1px solid rgba(10,15,46,0.05)", borderRight: "1px solid rgba(10,15,46,0.05)", borderBottom: "1px solid rgba(10,15,46,0.05)", transition: "background 0.12s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = `${j.color}08`}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "#fff"}
                >
                  <div style={{ ...DM, fontSize: 11, fontWeight: 900, color: j.color, minWidth: 22, textAlign: "right" }}>{j.step}</div>
                  <div>
                    <div style={{ ...DM, fontSize: 12, fontWeight: 700, color: NAVY, lineHeight: 1.1 }}>{j.label}</div>
                    <div style={{ ...DM, fontSize: 10, fontWeight: 500, color: MUTED, marginTop: 1 }}>{j.sub}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* EXPERIENCE */}
          <div style={{ overflow: "hidden", boxShadow: "0 2px 8px rgba(10,15,46,0.07)" }}>
            <div style={{ background: TEAL, padding: "12px 16px" }}>
              <div style={{ ...DM, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: 3 }}>Experience</div>
              <div style={{ ...SERIF, fontSize: 16, fontWeight: 700, color: "#fff" }}>See It Work</div>
            </div>
            <div style={{ background: "#fff", padding: "10px", display: "flex", flexDirection: "column", gap: 5 }}>
              {EXPERIENCE.map(e => (
                <Link key={e.label} href={e.href} style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px 9px 14px", borderLeft: `3px solid ${e.featured ? TEAL : "rgba(10,15,46,0.12)"}`, background: e.featured ? "rgba(43,138,110,0.05)" : "#fff", borderTop: "1px solid rgba(10,15,46,0.05)", borderRight: "1px solid rgba(10,15,46,0.05)", borderBottom: "1px solid rgba(10,15,46,0.05)", transition: "background 0.12s" }}
                  onMouseEnter={el => { const t = el.currentTarget as HTMLElement; t.style.background = "rgba(43,138,110,0.08)"; t.style.borderLeftColor = TEAL; }}
                  onMouseLeave={el => { const t = el.currentTarget as HTMLElement; t.style.background = e.featured ? "rgba(43,138,110,0.05)" : "#fff"; t.style.borderLeftColor = e.featured ? TEAL : "rgba(10,15,46,0.12)"; }}
                >
                  <span style={{ ...DM, fontSize: 12, fontWeight: e.featured ? 700 : 600, color: e.featured ? TEAL : NAVY }}>{e.label}</span>
                  <ChevronRight size={11} style={{ color: TEAL, opacity: 0.5, flexShrink: 0 }} />
                </Link>
              ))}
            </div>
          </div>

          {/* PROOF & VALIDATION */}
          <div style={{ overflow: "hidden", boxShadow: "0 2px 8px rgba(10,15,46,0.07)" }}>
            <div style={{ background: "#7A5210", padding: "12px 16px" }}>
              <div style={{ ...DM, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: 3 }}>Proof & Validation</div>
              <div style={{ ...SERIF, fontSize: 16, fontWeight: 700, color: "#fff" }}>Build the Case</div>
            </div>
            <div style={{ background: "#fff", padding: "10px", display: "flex", flexDirection: "column", gap: 5 }}>
              {PROOF.map(p => (
                <Link key={p.label} href={p.href} style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px 9px 14px", borderLeft: `3px solid ${p.featured ? GOLD : "rgba(10,15,46,0.12)"}`, background: p.featured ? "rgba(201,168,76,0.06)" : "#fff", borderTop: "1px solid rgba(10,15,46,0.05)", borderRight: "1px solid rgba(10,15,46,0.05)", borderBottom: "1px solid rgba(10,15,46,0.05)", transition: "background 0.12s" }}
                  onMouseEnter={el => { const t = el.currentTarget as HTMLElement; t.style.background = "rgba(201,168,76,0.1)"; t.style.borderLeftColor = GOLD; }}
                  onMouseLeave={el => { const t = el.currentTarget as HTMLElement; t.style.background = p.featured ? "rgba(201,168,76,0.06)" : "#fff"; t.style.borderLeftColor = p.featured ? GOLD : "rgba(10,15,46,0.12)"; }}
                >
                  <span style={{ ...DM, fontSize: 12, fontWeight: p.featured ? 700 : 600, color: p.featured ? "#7A5210" : NAVY }}>{p.label}</span>
                  <ChevronRight size={11} style={{ color: GOLD, opacity: 0.5, flexShrink: 0 }} />
                </Link>
              ))}
            </div>
          </div>

          {/* ONBOARDING */}
          <div style={{ overflow: "hidden", boxShadow: "0 2px 8px rgba(10,15,46,0.07)" }}>
            <div style={{ background: "#1e3a7a", padding: "12px 16px" }}>
              <div style={{ ...DM, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: 3 }}>Onboarding</div>
              <div style={{ ...SERIF, fontSize: 16, fontWeight: 700, color: "#fff" }}>Get Started</div>
            </div>
            <div style={{ background: "#fff", padding: "10px", display: "flex", flexDirection: "column", gap: 5 }}>
              {ONBOARDING.map(o => (
                <Link key={o.label} href={o.href} style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px 9px 14px", borderLeft: `3px solid ${o.featured ? "#1e3a7a" : "rgba(10,15,46,0.12)"}`, background: o.featured ? "rgba(30,58,122,0.05)" : "#fff", borderTop: "1px solid rgba(10,15,46,0.05)", borderRight: "1px solid rgba(10,15,46,0.05)", borderBottom: "1px solid rgba(10,15,46,0.05)", transition: "background 0.12s" }}
                  onMouseEnter={el => { const t = el.currentTarget as HTMLElement; t.style.background = "rgba(30,58,122,0.08)"; t.style.borderLeftColor = "#1e3a7a"; }}
                  onMouseLeave={el => { const t = el.currentTarget as HTMLElement; t.style.background = o.featured ? "rgba(30,58,122,0.05)" : "#fff"; t.style.borderLeftColor = o.featured ? "#1e3a7a" : "rgba(10,15,46,0.12)"; }}
                >
                  <span style={{ ...DM, fontSize: 12, fontWeight: o.featured ? 700 : 600, color: o.featured ? "#1e3a7a" : NAVY }}>{o.label}</span>
                  <ChevronRight size={11} style={{ color: "#1e3a7a", opacity: 0.5, flexShrink: 0 }} />
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* ── TECHNICAL ARCHITECTURE STRIP ── */}
        <div style={{ marginTop: 24, marginBottom: 16 }}>
          <SectionLabel>Technical Architecture</SectionLabel>
          <div className="ph-3col-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {TECH_ARCH.map(item => (
              <Link key={item.href} href={item.href} style={{ textDecoration: "none", display: "block", background: NAVY, borderLeft: `4px solid ${GOLD}`, padding: "16px 20px", boxShadow: "0 2px 8px rgba(10,15,46,0.15)", transition: "box-shadow 0.12s" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px rgba(10,15,46,0.25)`}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(10,15,46,0.15)"}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ ...DM, fontSize: 13, fontWeight: 800, color: GOLD, letterSpacing: "0.02em" }}>{item.label}</span>
                  <ChevronRight size={12} style={{ color: GOLD, opacity: 0.6 }} />
                </div>
                <div style={{ ...DM, fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.4 }}>{item.sub}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── BOTTOM CTA BAR ── */}
        <div style={{ marginTop: 16, background: NAVY, backgroundImage: "radial-gradient(ellipse at 85% 50%, rgba(201,168,76,0.08) 0%, transparent 55%)", padding: "22px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap", borderTop: `3px solid ${GOLD}` }}>
          <div>
            <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, marginBottom: 4 }}>Founding Partner Program · 12 Seats</div>
            <div style={{ ...SERIF, fontSize: 22, fontWeight: 700, color: "#fff", lineHeight: 1 }}>Ready to close the 30-day gap?</div>
            <div style={{ ...DM, fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>90-day validation partnership · First activation in 30 days · Executive authority preserved</div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/request-access" style={{ ...DM, display: "inline-flex", alignItems: "center", gap: 8, background: GOLD, color: NAVY, fontWeight: 900, fontSize: 12, padding: "13px 24px", textDecoration: "none", letterSpacing: "0.06em", textTransform: "uppercase", borderRadius: "0.15rem" }}>
              Apply for Founding Partner Access <ArrowRight size={12} />
            </Link>
            <Link href="/roi-calculator" style={{ ...DM, display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", color: "rgba(255,255,255,0.65)", fontWeight: 600, fontSize: 12, padding: "12px 18px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "0.15rem" }}>
              Calculate ROI
            </Link>
            <Link href="/executive-brief" style={{ ...DM, display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", color: "rgba(255,255,255,0.65)", fontWeight: 600, fontSize: 12, padding: "12px 18px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "0.15rem" }}>
              Executive Brief
            </Link>
          </div>
        </div>

      </div>
    </div>
    </PageLayout>
  );
}
