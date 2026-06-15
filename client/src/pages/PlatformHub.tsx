import { Link } from "wouter";
import { Play, ArrowRight } from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";
const MUTED = "#6B7280";
const DM: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };
const SERIF: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

const PHASES = [
  {
    id: "DETECT",
    color: TEAL,
    bg: "rgba(43,138,110,0.08)",
    border: "rgba(43,138,110,0.25)",
    label: "DETECT",
    sublabel: "Continuous monitoring",
    buttons: [
      { label: "Signal Intelligence", href: "/signal-intelligence" },
      { label: "Trigger Monitoring", href: "/triggers-management" },
      { label: "Command Tower", href: "/command-tower" },
      { label: "Intelligence Control Center", href: "/intelligence-control-center" },
      { label: "Compound Threat Detection", href: "/situations-hub" },
    ],
  },
  {
    id: "PREPARE",
    color: GOLD,
    bg: "rgba(201,168,76,0.08)",
    border: "rgba(201,168,76,0.25)",
    label: "PREPARE",
    sublabel: "Pre-staged protocols",
    buttons: [
      { label: "Protocol Library — 180", href: "/playbooks" },
      { label: "Mission Control", href: "/mission-control" },
      { label: "Protocol Builder", href: "/protocol-builder" },
      { label: "Practice Drills", href: "/practice-drills" },
      { label: "9-Domain Coverage Board", href: "/situations-hub" },
    ],
  },
  {
    id: "EXECUTE",
    color: "#E05C3A",
    bg: "rgba(224,92,58,0.07)",
    border: "rgba(224,92,58,0.2)",
    label: "EXECUTE",
    sublabel: "12-minute activation",
    buttons: [
      { label: "Live Activation Center", href: "/live-activation-center" },
      { label: "War Room", href: "/war-room" },
      { label: "Coordination Intelligence", href: "/coordination-intelligence" },
      { label: "Stakeholder Notifications", href: "/mission-control" },
      { label: "Authorization Chain", href: "/pmo-onboarding" },
    ],
  },
  {
    id: "LEARN",
    color: "#7B61FF",
    bg: "rgba(123,97,255,0.07)",
    border: "rgba(123,97,255,0.2)",
    label: "LEARN",
    sublabel: "Closed-loop improvement",
    buttons: [
      { label: "ADVANCE 2.0", href: "/advance-intelligence" },
      { label: "Advanced Analytics", href: "/advanced-analytics" },
      { label: "Coordination Intelligence", href: "/coordination-intelligence" },
      { label: "Proof Story — Outcomes", href: "/proof-story" },
      { label: "AI Radar Dashboard", href: "/ai-radar" },
    ],
  },
];

const DOMAINS = [
  { label: "GROWTH & POSITIONING", count: "63 Protocols", color: GOLD, href: "/demo/market-entry", examples: "M&A · Competitor Displacement · Go-to-Market · Workforce Transformation" },
  { label: "RISK & RESILIENCE", count: "85 Protocols", color: TEAL, href: "/demo/ransomware", examples: "Ransomware · Activist Investor · Supply Chain · Data Breach · Regulatory" },
  { label: "TRANSFORMATION", count: "62 Protocols", color: "#7B61FF", href: "/demo/workforce", examples: "Digital Transformation · Workforce Restructuring · System Migrations" },
];

const JOURNEY = [
  { step: "01", label: "Understand the Problem", href: "/cost-of-delay", accent: NAVY },
  { step: "02", label: "See It Work", href: "/12-minute-experience", accent: TEAL },
  { step: "03", label: "Build the Business Case", href: "/roi-calculator", accent: GOLD },
  { step: "04", label: "Apply for Access", href: "/request-access", accent: "#E05C3A" },
  { step: "05", label: "Go Live in 30 Days", href: "/getting-started", accent: NAVY },
  { step: "06", label: "Run Protocols", href: "/playbooks", accent: TEAL },
  { step: "07", label: "Improve Continuously", href: "/advance-intelligence", accent: "#7B61FF" },
];

const PROOF = [
  { label: "ROI Calculator", href: "/roi-calculator" },
  { label: "Executive Brief", href: "/executive-brief" },
  { label: "Readiness Benchmark", href: "/readiness-benchmark" },
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
  { label: "Master Demo — Activist Investor", href: "/master-demo", featured: false },
  { label: "How It Executes", href: "/how-it-executes", featured: false },
  { label: "Industry Demo Library", href: "/industry-demo-library", featured: false },
  { label: "Protocol Coverage Browser", href: "/protocol-browser", featured: false },
];

const ONBOARDING = [
  { label: "Getting Started Hub", href: "/getting-started" },
  { label: "PMO Director Onboarding", href: "/pmo-onboarding" },
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

function Btn({ label, href, color = NAVY, size = "sm" }: { label: string; href: string; color?: string; size?: "sm" | "md" | "lg" }) {
  const pad = size === "lg" ? "12px 20px" : size === "md" ? "9px 16px" : "7px 14px";
  const fs = size === "lg" ? 14 : size === "md" ? 13 : 12;
  return (
    <Link href={href} style={{
      ...DM,
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      background: "#fff",
      color,
      border: `1px solid ${color}40`,
      padding: pad,
      fontSize: fs,
      fontWeight: 700,
      textDecoration: "none",
      letterSpacing: "0.03em",
      whiteSpace: "nowrap" as const,
      transition: "background 0.12s, border-color 0.12s",
    }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${color}10`; el.style.borderColor = color; }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "#fff"; el.style.borderColor = `${color}40`; }}
    >
      {label}
    </Link>
  );
}

function PhaseBtn({ label, href, color }: { label: string; href: string; color: string }) {
  return (
    <Link href={href} style={{
      ...DM,
      display: "block",
      padding: "8px 12px",
      fontSize: 12,
      fontWeight: 600,
      color: NAVY,
      background: "#fff",
      border: `1px solid rgba(10,15,46,0.09)`,
      textDecoration: "none",
      transition: "border-color 0.12s, color 0.12s",
    }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = color; el.style.color = color; }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(10,15,46,0.09)"; el.style.color = NAVY; }}
    >
      {label}
    </Link>
  );
}

export default function PlatformHub() {
  return (
    <div style={{ background: IVORY, minHeight: "100vh" }}>

      {/* ── HEADER BAR ────────────────────────────────── */}
      <div style={{ background: NAVY, padding: "18px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 24, flexWrap: "wrap" }}>
          <div>
            <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginBottom: 2 }}>Readiness OS · Platform Map</div>
            <div style={{ ...SERIF, fontSize: 22, fontWeight: 700, color: "#fff", lineHeight: 1 }}>The response is ready before the trigger fires.</div>
          </div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {[{ n: "180", l: "Protocols" }, { n: "231", l: "Triggers" }, { n: "9", l: "Domains" }, { n: "12 min", l: "Execution" }, { n: "3,600×", l: "Head Start" }].map(s => (
              <div key={s.n} style={{ textAlign: "center" }}>
                <div style={{ ...DM, fontSize: 18, fontWeight: 800, color: GOLD, lineHeight: 1 }}>{s.n}</div>
                <div style={{ ...DM, fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/12-minute-experience" style={{ ...DM, display: "inline-flex", alignItems: "center", gap: 7, background: GOLD, color: NAVY, fontWeight: 800, fontSize: 12, padding: "10px 18px", textDecoration: "none", letterSpacing: "0.07em", textTransform: "uppercase" }}>
            <Play size={11} /> Try It Now
          </Link>
          <Link href="/request-access" style={{ ...DM, display: "inline-flex", alignItems: "center", gap: 7, background: "transparent", color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: 12, padding: "9px 16px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)" }}>
            Apply for Access <ArrowRight size={11} />
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 48px 48px" }}>

        {/* ── PLATFORM MAP — 4 PHASES ──────────────────── */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD, marginBottom: 10 }}>
            THE PLATFORM · DETECT → PREPARE → EXECUTE → LEARN
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {PHASES.map(phase => (
              <div key={phase.id} style={{ background: "#fff", border: `2px solid ${phase.border}`, overflow: "hidden" }}>
                {/* Phase header */}
                <div style={{ background: phase.bg, borderBottom: `2px solid ${phase.border}`, padding: "10px 14px", display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ ...DM, fontSize: 16, fontWeight: 900, color: phase.color, letterSpacing: "0.06em" }}>{phase.label}</span>
                  <span style={{ ...DM, fontSize: 10, color: MUTED, fontWeight: 600 }}>{phase.sublabel}</span>
                </div>
                {/* Buttons */}
                <div style={{ padding: "10px", display: "flex", flexDirection: "column", gap: 6 }}>
                  {phase.buttons.map(btn => (
                    <PhaseBtn key={btn.label} label={btn.label} href={btn.href} color={phase.color} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 3 STRATEGIC DOMAINS ───────────────────────── */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD, marginBottom: 10 }}>
            STRATEGIC DOMAINS · 210 PROTOCOLS ACROSS 3 DOMAINS
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {DOMAINS.map(d => (
              <Link key={d.label} href={d.href} style={{ textDecoration: "none", background: "#fff", border: `1px solid ${d.color}30`, borderLeft: `4px solid ${d.color}`, padding: "16px 20px", display: "block", transition: "box-shadow 0.15s" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 1px ${d.color}60, 0 4px 16px rgba(10,15,46,0.08)`}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = "none"}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ ...DM, fontSize: 13, fontWeight: 900, color: d.color, letterSpacing: "0.06em" }}>{d.label}</span>
                  <span style={{ ...DM, fontSize: 12, fontWeight: 800, color: d.color }}>{d.count}</span>
                </div>
                <p style={{ ...DM, fontSize: 11, color: MUTED, margin: 0, lineHeight: 1.5 }}>{d.examples}</p>
                <div style={{ ...DM, fontSize: 10, fontWeight: 700, color: d.color, marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
                  See Demo <ArrowRight size={9} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── EVALUATE & DECIDE — horizontal strip ─────── */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD, marginBottom: 10 }}>
            EVALUATE & DECIDE · BENCHMARK · COMPARE · PRICE · INVEST
          </div>
          <div style={{ background: "#fff", border: "1px solid rgba(10,15,46,0.08)", padding: "14px 16px", display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            {EVALUATE.map(e => (
              <Link key={e.label} href={e.href} style={{ ...DM, fontSize: 12, fontWeight: 700, color: NAVY, background: IVORY, border: "1px solid rgba(10,15,46,0.12)", padding: "7px 14px", textDecoration: "none", whiteSpace: "nowrap" as const, transition: "border-color 0.12s, color 0.12s" }}
                onMouseEnter={el => { (el.currentTarget as HTMLElement).style.borderColor = GOLD; (el.currentTarget as HTMLElement).style.color = "#8B5E0A"; }}
                onMouseLeave={el => { (el.currentTarget as HTMLElement).style.borderColor = "rgba(10,15,46,0.12)"; (el.currentTarget as HTMLElement).style.color = NAVY; }}
              >
                {e.label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── LOWER 4-COLUMN GRID ───────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>

          {/* CUSTOMER JOURNEY */}
          <div style={{ background: "#fff", border: "1px solid rgba(10,15,46,0.08)", overflow: "hidden" }}>
            <div style={{ background: NAVY, padding: "10px 14px" }}>
              <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>Customer Journey</div>
              <div style={{ ...DM, fontSize: 13, fontWeight: 800, color: "#fff" }}>Discovery → Active Use</div>
            </div>
            <div style={{ padding: "12px 12px", display: "flex", flexDirection: "column", gap: 5 }}>
              {JOURNEY.map(j => (
                <Link key={j.step} href={j.href} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", border: "1px solid rgba(10,15,46,0.07)", background: "#fff", transition: "border-color 0.12s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = j.accent}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(10,15,46,0.07)"}
                >
                  <span style={{ ...DM, fontSize: 9, fontWeight: 800, color: j.accent, minWidth: 18 }}>{j.step}</span>
                  <span style={{ ...DM, fontSize: 11, fontWeight: 600, color: NAVY }}>{j.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* SEE IT WORK / EXPERIENCE */}
          <div style={{ background: "#fff", border: "1px solid rgba(10,15,46,0.08)", overflow: "hidden" }}>
            <div style={{ background: TEAL, padding: "10px 14px" }}>
              <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 2 }}>Experience</div>
              <div style={{ ...DM, fontSize: 13, fontWeight: 800, color: "#fff" }}>See It Work</div>
            </div>
            <div style={{ padding: "12px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
              {EXPERIENCE.map(e => (
                <Link key={e.label} href={e.href} style={{ textDecoration: "none", display: "block", padding: "8px 10px", border: e.featured ? `1px solid ${TEAL}50` : "1px solid rgba(10,15,46,0.07)", background: e.featured ? `${TEAL}06` : "#fff", transition: "border-color 0.12s" }}
                  onMouseEnter={el => (el.currentTarget as HTMLElement).style.borderColor = TEAL}
                  onMouseLeave={el => (el.currentTarget as HTMLElement).style.borderColor = e.featured ? `${TEAL}50` : "rgba(10,15,46,0.07)"}
                >
                  <span style={{ ...DM, fontSize: 12, fontWeight: e.featured ? 700 : 600, color: e.featured ? TEAL : NAVY }}>{e.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* PROOF & VALIDATION */}
          <div style={{ background: "#fff", border: "1px solid rgba(10,15,46,0.08)", overflow: "hidden" }}>
            <div style={{ background: "#8B5E0A", padding: "10px 14px" }}>
              <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 2 }}>Proof & Validation</div>
              <div style={{ ...DM, fontSize: 13, fontWeight: 800, color: "#fff" }}>Build the Case</div>
            </div>
            <div style={{ padding: "12px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
              {PROOF.map(p => (
                <Link key={p.label} href={p.href} style={{ textDecoration: "none", display: "block", padding: "8px 10px", border: "1px solid rgba(10,15,46,0.07)", background: "#fff", transition: "border-color 0.12s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = GOLD}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(10,15,46,0.07)"}
                >
                  <span style={{ ...DM, fontSize: 12, fontWeight: 600, color: NAVY }}>{p.label}</span>
                </Link>
              ))}
              <Link href="/proof" style={{ ...DM, marginTop: 4, display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: GOLD, textDecoration: "none" }}>
                Proof Hub — all validation assets <ArrowRight size={9} />
              </Link>
            </div>
          </div>

          {/* ONBOARDING */}
          <div style={{ background: "#fff", border: "1px solid rgba(10,15,46,0.08)", overflow: "hidden" }}>
            <div style={{ background: "#2D4A8A", padding: "10px 14px" }}>
              <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 2 }}>Onboarding</div>
              <div style={{ ...DM, fontSize: 13, fontWeight: 800, color: "#fff" }}>Get Started</div>
            </div>
            <div style={{ padding: "12px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
              {ONBOARDING.map(o => (
                <Link key={o.label} href={o.href} style={{ textDecoration: "none", display: "block", padding: "8px 10px", border: "1px solid rgba(10,15,46,0.07)", background: "#fff", transition: "border-color 0.12s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "#2D4A8A"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(10,15,46,0.07)"}
                >
                  <span style={{ ...DM, fontSize: 12, fontWeight: 600, color: NAVY }}>{o.label}</span>
                </Link>
              ))}
              <Link href="/start" style={{ ...DM, marginTop: 4, display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: "#2D4A8A", textDecoration: "none" }}>
                Full Onboarding Hub <ArrowRight size={9} />
              </Link>
            </div>
          </div>

        </div>

        {/* ── BOTTOM CTA BAR ────────────────────────────── */}
        <div style={{ marginTop: 20, background: NAVY, padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
          <div>
            <div style={{ ...SERIF, fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 2 }}>Ready to close the 30-day gap?</div>
            <div style={{ ...DM, fontSize: 12, color: "rgba(255,255,255,0.45)" }}>12 Founding Partner seats · 90-day validation · First activation in 30 days</div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/request-access" style={{ ...DM, display: "inline-flex", alignItems: "center", gap: 7, background: GOLD, color: NAVY, fontWeight: 800, fontSize: 12, padding: "12px 22px", textDecoration: "none", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Apply for Founding Partner Access <ArrowRight size={12} />
            </Link>
            <Link href="/roi-calculator" style={{ ...DM, display: "inline-flex", alignItems: "center", gap: 7, background: "transparent", color: "rgba(255,255,255,0.65)", fontWeight: 600, fontSize: 12, padding: "11px 18px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)" }}>
              Calculate Your ROI
            </Link>
            <Link href="/executive-brief" style={{ ...DM, display: "inline-flex", alignItems: "center", gap: 7, background: "transparent", color: "rgba(255,255,255,0.65)", fontWeight: 600, fontSize: 12, padding: "11px 18px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)" }}>
              Executive Brief
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
