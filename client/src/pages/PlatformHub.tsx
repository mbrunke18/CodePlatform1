import { Link } from "wouter";
import {
  Zap, Shield, BarChart3, Radio, Brain, Layers, Target,
  FileText, Calculator, ClipboardCheck, DollarSign, Users,
  Rocket, Activity, TrendingUp, Eye, BookOpen, Play,
  ArrowRight, CheckCircle
} from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";
const MUTED = "#6B7280";

const DM: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };
const SERIF: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

function SectionLabel({ text, light = false }: { text: string; light?: boolean }) {
  return (
    <p style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: light ? "rgba(255,255,255,0.55)" : GOLD, marginBottom: 10 }}>
      {text}
    </p>
  );
}

function GoldRule() {
  return <div style={{ width: 40, height: 2, background: GOLD, marginBottom: 20 }} />;
}

const CAPABILITIES = [
  {
    group: "DETECT",
    color: TEAL,
    items: [
      { icon: Zap, label: "Signal Detection", sub: "231 triggers · 248+ data points · 15-min cycle", href: "/triggers-management" },
      { icon: Radio, label: "Command Tower", sub: "Live executive wall display — auto-refreshing feed", href: "/command-tower" },
      { icon: Brain, label: "Signal Intelligence", sub: "Pattern detection replaces standing crisis committees", href: "/signal-intelligence" },
    ],
  },
  {
    group: "PREPARE",
    color: GOLD,
    items: [
      { icon: BookOpen, label: "Protocol Library", sub: "180 Readiness Protocols — pre-staged across 9 domains", href: "/playbooks" },
      { icon: Target, label: "Practice Drills", sub: "Run simulations before the trigger fires", href: "/practice-drills" },
      { icon: Eye, label: "Mission Control", sub: "Your operations center — configure, review, activate", href: "/mission-control" },
    ],
  },
  {
    group: "EXECUTE",
    color: "#E05C3A",
    items: [
      { icon: Zap, label: "Live Activation", sub: "From trigger to full stakeholder coordination in 12 min", href: "/live-activation-center" },
      { icon: Shield, label: "War Room", sub: "Real-time coordination center for active protocols", href: "/war-room" },
      { icon: Activity, label: "Coordination Intelligence", sub: "Your real coordination speed vs. the 12-min benchmark", href: "/coordination-intelligence" },
    ],
  },
  {
    group: "LEARN",
    color: "#7B61FF",
    items: [
      { icon: TrendingUp, label: "ADVANCE 2.0", sub: "Closed-loop causal learning after every activation", href: "/advance-intelligence" },
      { icon: BarChart3, label: "Advanced Analytics", sub: "Execution history, ROI tracking, outcomes dashboard", href: "/advanced-analytics" },
      { icon: Layers, label: "9-Domain Coverage Board", sub: "Exposure & readiness across all strategic domains", href: "/situations-hub" },
    ],
  },
];

const JOURNEY = [
  {
    step: "01",
    label: "Understand the Problem",
    desc: "Quantify what the 30-day mobilization gap actually costs your organization.",
    color: NAVY,
    links: [
      { label: "Cost of Delay Calculator", href: "/cost-of-delay" },
      { label: "The Mobilization Tax", href: "/mobilization-tax" },
      { label: "Research & Validation", href: "/research" },
    ],
  },
  {
    step: "02",
    label: "See It Work",
    desc: "Watch a real trigger fire, a protocol stage, and execution complete in 12 minutes.",
    color: TEAL,
    links: [
      { label: "12-Minute Test Drive", href: "/12-minute-experience" },
      { label: "Demo Hub — 12 Scenarios", href: "/demo-hub" },
      { label: "How It Executes", href: "/how-it-executes" },
    ],
  },
  {
    step: "03",
    label: "Build the Business Case",
    desc: "Generate the numbers your CFO and board need to approve the investment.",
    color: GOLD,
    links: [
      { label: "ROI Calculator", href: "/roi-calculator" },
      { label: "Executive Brief", href: "/executive-brief" },
      { label: "Readiness Benchmark", href: "/readiness-benchmark" },
    ],
  },
  {
    step: "04",
    label: "Get Access",
    desc: "Join the Founding Partner Program — 90-day validation partnership, 12 seats.",
    color: "#C2410C",
    links: [
      { label: "Apply for Founding Partner Access", href: "/request-access" },
      { label: "Founding Partner Brief", href: "/founding-partner-brief" },
      { label: "Schedule a Conversation", href: "/contact" },
    ],
  },
  {
    step: "05",
    label: "Go Live",
    desc: "Complete your 4-phase setup and have your first protocol ready to activate.",
    color: NAVY,
    links: [
      { label: "Getting Started Hub", href: "/getting-started" },
      { label: "PMO Director Onboarding", href: "/pmo-onboarding" },
      { label: "30-Day Preparation Arc", href: "/preparation-arc" },
    ],
  },
  {
    step: "06",
    label: "Run Protocols",
    desc: "AI monitors. Executives authorize. Execution is pre-staged and ready.",
    color: TEAL,
    links: [
      { label: "Protocol Library", href: "/playbooks" },
      { label: "Mission Control", href: "/mission-control" },
      { label: "War Room", href: "/war-room" },
    ],
  },
  {
    step: "07",
    label: "Improve Continuously",
    desc: "Every activation close-out generates a causal hypothesis. Protocols self-improve.",
    color: "#7B61FF",
    links: [
      { label: "ADVANCE 2.0 Intelligence", href: "/advance-intelligence" },
      { label: "Proof Story — Outcomes", href: "/proof-story" },
      { label: "Analytics Dashboard", href: "/advanced-analytics" },
    ],
  },
];

const DOMAINS = [
  {
    label: "GROWTH & POSITIONING",
    color: GOLD,
    count: 63,
    desc: "M&A response, competitor displacement, market entry, product launch, workforce transformation.",
    links: [
      { label: "Competitor Displacement Sprint", href: "/demo/market-entry" },
      { label: "M&A Rapid Response", href: "/demo/acquisition" },
      { label: "Go-to-Market Acceleration", href: "/demo/product-launch" },
    ],
  },
  {
    label: "RISK & RESILIENCE",
    color: TEAL,
    count: 85,
    desc: "Ransomware, regulatory crises, supply chain failure, data breach, activist investor response.",
    links: [
      { label: "Ransomware Response", href: "/demo/ransomware" },
      { label: "Supply Chain Collapse", href: "/demo/supply-chain" },
      { label: "Activist Investor Protocol", href: "/master-demo" },
    ],
  },
  {
    label: "TRANSFORMATION",
    color: "#7B61FF",
    count: 62,
    desc: "Workforce restructuring, digital transformation, regulatory compliance, system migrations.",
    links: [
      { label: "Workforce Transformation", href: "/demo/workforce" },
      { label: "Protocol Builder", href: "/protocol-builder" },
      { label: "Industry Protocol Packs", href: "/industry" },
    ],
  },
];

const PROOF_ASSETS = [
  { icon: FileText, label: "Executive Brief", sub: "Board-ready one-pager — thesis, 3,600× metric, ROI case", href: "/executive-brief", accent: GOLD },
  { icon: BarChart3, label: "Proof Story", sub: "Same trigger — 3 real outcomes. Side-by-side timelines.", href: "/proof-story", accent: TEAL },
  { icon: Calculator, label: "ROI Calculator", sub: "Break-even, 3-year net value, retainer comparison", href: "/roi-calculator", accent: NAVY },
  { icon: ClipboardCheck, label: "Readiness Benchmark", sub: "3-minute score. Typical enterprise: 22. Partners: 87.", href: "/readiness-benchmark", accent: GOLD },
  { icon: BookOpen, label: "Research Foundation", sub: "McKinsey, Gartner, IBM, PwC — the evidence behind the platform", href: "/research", accent: TEAL },
  { icon: DollarSign, label: "The Case", sub: "Problem → proof → moat → ROI → decision on one page", href: "/the-case", accent: NAVY },
];

export default function PlatformHub() {
  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section style={{ background: NAVY, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 70% 40%, rgba(201,168,76,0.06) 0%, transparent 65%), radial-gradient(ellipse at 20% 80%, rgba(43,138,110,0.05) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 48px 72px" }}>
          <SectionLabel text="Readiness OS · Complete Platform" light />
          <h1 style={{ ...SERIF, fontSize: 56, fontWeight: 700, color: "#fff", lineHeight: 1.1, margin: "0 0 8px", maxWidth: 720 }}>
            Everything Readiness OS.
          </h1>
          <h1 style={{ ...SERIF, fontSize: 56, fontWeight: 400, fontStyle: "italic", color: GOLD, lineHeight: 1.1, margin: "0 0 28px", maxWidth: 720 }}>
            One page.
          </h1>
          <p style={{ ...DM, fontSize: 16, color: "rgba(255,255,255,0.65)", maxWidth: 580, lineHeight: 1.65, marginBottom: 40 }}>
            Every capability, every proof point, every step of the customer journey — from first trigger to continuous improvement. This is the complete picture.
          </p>

          {/* Metrics strip */}
          <div style={{ display: "flex", gap: 0, marginBottom: 44, flexWrap: "wrap" }}>
            {[
              { n: "180", label: "Readiness Protocols" },
              { n: "231", label: "Trigger Conditions" },
              { n: "9", label: "Strategic Domains" },
              { n: "12 min", label: "Execution Head Start" },
              { n: "3,600×", label: "vs. 30-Day Cycle" },
            ].map((s, i) => (
              <div key={s.n} style={{ padding: "16px 32px 16px 0", marginRight: 32, borderRight: i < 4 ? "1px solid rgba(255,255,255,0.1)" : "none", paddingRight: i < 4 ? 32 : 0 }}>
                <div style={{ ...DM, fontSize: 28, fontWeight: 800, color: GOLD, lineHeight: 1 }}>{s.n}</div>
                <div style={{ ...DM, fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link href="/12-minute-experience" style={{ ...DM, display: "inline-flex", alignItems: "center", gap: 8, background: GOLD, color: NAVY, fontWeight: 800, fontSize: 13, padding: "14px 28px", textDecoration: "none", letterSpacing: "0.07em", textTransform: "uppercase" }}>
              <Play size={14} /> Try It Now — No Login
            </Link>
            <Link href="/request-access" style={{ ...DM, display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "#fff", fontWeight: 700, fontSize: 13, padding: "13px 24px", textDecoration: "none", letterSpacing: "0.07em", textTransform: "uppercase", border: "1px solid rgba(255,255,255,0.25)" }}>
              Apply for Founding Partner Access <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── PLATFORM CAPABILITIES ─────────────────────────────────── */}
      <section style={{ background: IVORY, padding: "72px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionLabel text="Platform Capabilities" />
          <GoldRule />
          <h2 style={{ ...DM, fontSize: 32, fontWeight: 700, color: NAVY, marginBottom: 8 }}>
            Four phases. One continuous loop.
          </h2>
          <p style={{ ...DM, fontSize: 15, color: MUTED, marginBottom: 48, maxWidth: 560 }}>
            Detect signals. Prepare protocols. Execute with authority. Learn from every outcome.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {CAPABILITIES.map(group => (
              <div key={group.group}>
                <div style={{ ...DM, fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", color: group.color, marginBottom: 14, borderBottom: `2px solid ${group.color}`, paddingBottom: 8 }}>
                  {group.group}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {group.items.map(item => (
                    <Link key={item.label} href={item.href} style={{ textDecoration: "none", display: "block", background: "#fff", border: "1px solid rgba(10,15,46,0.08)", padding: "14px 16px", transition: "border-color 0.15s" }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = group.color}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(10,15,46,0.08)"}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                        <item.icon size={13} color={group.color} />
                        <span style={{ ...DM, fontSize: 13, fontWeight: 700, color: NAVY }}>{item.label}</span>
                      </div>
                      <p style={{ ...DM, fontSize: 11, color: MUTED, lineHeight: 1.4, margin: 0 }}>{item.sub}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CUSTOMER JOURNEY ──────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "72px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionLabel text="The Customer Journey" />
          <GoldRule />
          <h2 style={{ ...DM, fontSize: 32, fontWeight: 700, color: NAVY, marginBottom: 8 }}>
            From first trigger to fearless execution.
          </h2>
          <p style={{ ...DM, fontSize: 15, color: MUTED, marginBottom: 48, maxWidth: 560 }}>
            Every step of the journey — with the exact resources you need at each stage.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {JOURNEY.map((step, i) => (
              <div key={step.step} style={{ position: "relative", background: "#fff", border: "1px solid rgba(10,15,46,0.09)", borderTop: `3px solid ${step.color}`, padding: "22px 20px 20px" }}>
                <div style={{ ...DM, fontSize: 11, fontWeight: 800, color: step.color, letterSpacing: "0.12em", marginBottom: 8 }}>
                  STEP {step.step}
                </div>
                <h3 style={{ ...DM, fontSize: 15, fontWeight: 700, color: NAVY, lineHeight: 1.2, marginBottom: 10 }}>
                  {step.label}
                </h3>
                <p style={{ ...DM, fontSize: 12, color: MUTED, lineHeight: 1.55, marginBottom: 14 }}>
                  {step.desc}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {step.links.map(link => (
                    <Link key={link.label} href={link.href} style={{ ...DM, fontSize: 11, fontWeight: 600, color: step.color, textDecoration: "none", display: "flex", alignItems: "center", gap: 5 }}>
                      <ArrowRight size={10} />{link.label}
                    </Link>
                  ))}
                </div>
                {i < JOURNEY.length - 1 && (
                  <div style={{ position: "absolute", top: "50%", right: -12, width: 22, height: 2, background: "rgba(10,15,46,0.12)", zIndex: 1 }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STRATEGIC DOMAINS ─────────────────────────────────────── */}
      <section style={{ background: NAVY, padding: "72px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionLabel text="Strategic Domains" light />
          <GoldRule />
          <h2 style={{ ...DM, fontSize: 32, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
            210 protocols. 3 strategic domains.
          </h2>
          <p style={{ ...DM, fontSize: 15, color: "rgba(255,255,255,0.55)", marginBottom: 48, maxWidth: 560 }}>
            Every protocol is pre-staged, versioned, and ready before the trigger fires.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {DOMAINS.map(domain => (
              <div key={domain.label} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid rgba(255,255,255,0.08)`, borderTop: `3px solid ${domain.color}`, padding: "28px 24px" }}>
                <div style={{ ...DM, fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: domain.color, marginBottom: 12 }}>
                  {domain.label}
                </div>
                <div style={{ ...DM, fontSize: 36, fontWeight: 900, color: domain.color, lineHeight: 1, marginBottom: 6 }}>
                  {domain.count}
                </div>
                <div style={{ ...DM, fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", marginBottom: 16 }}>
                  READINESS PROTOCOLS
                </div>
                <p style={{ ...DM, fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.55, marginBottom: 20 }}>
                  {domain.desc}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 16 }}>
                  {domain.links.map(link => (
                    <Link key={link.label} href={link.href} style={{ ...DM, fontSize: 11, fontWeight: 600, color: domain.color, textDecoration: "none", display: "flex", alignItems: "center", gap: 5 }}>
                      <ArrowRight size={10} />{link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROOF & VALIDATION ────────────────────────────────────── */}
      <section style={{ background: IVORY, padding: "72px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionLabel text="Proof & Validation" />
          <GoldRule />
          <h2 style={{ ...DM, fontSize: 32, fontWeight: 700, color: NAVY, marginBottom: 8 }}>
            The evidence. The ROI. The case.
          </h2>
          <p style={{ ...DM, fontSize: 15, color: MUTED, marginBottom: 48, maxWidth: 560 }}>
            Everything you need to evaluate, validate, and build the business case.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {PROOF_ASSETS.map(asset => (
              <Link key={asset.label} href={asset.href} style={{ textDecoration: "none", display: "block", background: "#fff", border: "1px solid rgba(10,15,46,0.08)", padding: "22px 22px", transition: "box-shadow 0.15s" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(10,15,46,0.10)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = "none"}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 32, height: 32, background: `${asset.accent}15`, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <asset.icon size={15} color={asset.accent} />
                  </div>
                  <span style={{ ...DM, fontSize: 14, fontWeight: 700, color: NAVY }}>{asset.label}</span>
                </div>
                <p style={{ ...DM, fontSize: 12, color: MUTED, lineHeight: 1.5, margin: 0 }}>{asset.sub}</p>
                <div style={{ ...DM, fontSize: 11, fontWeight: 600, color: asset.accent, marginTop: 12, display: "flex", alignItems: "center", gap: 4 }}>
                  Open <ArrowRight size={10} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUICK ACCESS — ALL PAGES ──────────────────────────────── */}
      <section style={{ background: "#fff", padding: "72px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionLabel text="Complete Platform Index" />
          <GoldRule />
          <h2 style={{ ...DM, fontSize: 32, fontWeight: 700, color: NAVY, marginBottom: 40 }}>
            Every part of Readiness OS.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }}>
            {[
              {
                heading: "Platform",
                links: [
                  { label: "Mission Control", href: "/mission-control" },
                  { label: "Protocol Library", href: "/playbooks" },
                  { label: "Signal Intelligence", href: "/signal-intelligence" },
                  { label: "Trigger Monitoring", href: "/triggers-management" },
                  { label: "Live Activation", href: "/live-activation-center" },
                  { label: "War Room", href: "/war-room" },
                  { label: "Command Tower", href: "/command-tower" },
                  { label: "9-Domain Board", href: "/situations-hub" },
                  { label: "Practice Drills", href: "/practice-drills" },
                  { label: "ADVANCE 2.0", href: "/advance-intelligence" },
                  { label: "Analytics", href: "/advanced-analytics" },
                  { label: "Coordination Intel", href: "/coordination-intelligence" },
                ],
              },
              {
                heading: "Demos & Experience",
                links: [
                  { label: "12-Minute Test Drive", href: "/12-minute-experience" },
                  { label: "Demo Hub", href: "/demo-hub" },
                  { label: "Master Demo", href: "/master-demo" },
                  { label: "How It Executes", href: "/how-it-executes" },
                  { label: "Situation Scanner", href: "/situation-scanner" },
                  { label: "Industry Demos", href: "/industry-demo-library" },
                  { label: "Protocol Builder", href: "/protocol-builder" },
                  { label: "Shadow Simulator", href: "/simulation-studio" },
                  { label: "Sector Briefing", href: "/sector-briefing" },
                  { label: "Industry Packs", href: "/industry" },
                ],
              },
              {
                heading: "Proof & Validation",
                links: [
                  { label: "Executive Brief", href: "/executive-brief" },
                  { label: "ROI Calculator", href: "/roi-calculator" },
                  { label: "Readiness Benchmark", href: "/readiness-benchmark" },
                  { label: "Cost of Delay", href: "/cost-of-delay" },
                  { label: "The Mobilization Tax", href: "/mobilization-tax" },
                  { label: "Proof Story", href: "/proof-story" },
                  { label: "The Case", href: "/the-case" },
                  { label: "Research", href: "/research" },
                  { label: "Why Readiness OS?", href: "/the-proof" },
                  { label: "Security & Compliance", href: "/security-compliance" },
                ],
              },
              {
                heading: "Getting Started",
                links: [
                  { label: "Request Founding Partner Access", href: "/request-access" },
                  { label: "Founding Partner Brief", href: "/founding-partner-brief" },
                  { label: "Pricing & Plans", href: "/pricing" },
                  { label: "Getting Started Hub", href: "/getting-started" },
                  { label: "PMO Onboarding", href: "/pmo-onboarding" },
                  { label: "30-Day Preparation Arc", href: "/preparation-arc" },
                  { label: "Schedule a Conversation", href: "/contact" },
                  { label: "Integrations", href: "/integrations" },
                  { label: "Technical Onboarding", href: "/technical-onboarding" },
                  { label: "User Guide", href: "/user-guide" },
                ],
              },
            ].map(col => (
              <div key={col.heading}>
                <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: GOLD, marginBottom: 14, paddingBottom: 8, borderBottom: "1px solid rgba(10,15,46,0.08)" }}>
                  {col.heading}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {col.links.map(link => (
                    <Link key={link.label} href={link.href} style={{ ...DM, fontSize: 12, fontWeight: 500, color: "#374151", textDecoration: "none", padding: "5px 0", borderBottom: "1px solid transparent", display: "flex", alignItems: "center", gap: 5 }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = NAVY; (e.currentTarget as HTMLElement).style.fontWeight = "700"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#374151"; (e.currentTarget as HTMLElement).style.fontWeight = "500"; }}
                    >
                      <CheckCircle size={9} color="rgba(201,168,76,0.5)" />
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────── */}
      <section style={{ background: NAVY, padding: "72px 48px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <SectionLabel text="The Response Is Ready" light />
          <h2 style={{ ...SERIF, fontSize: 42, fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 8 }}>
            Before the trigger fires.
          </h2>
          <p style={{ ...SERIF, fontSize: 22, fontStyle: "italic", color: GOLD, marginBottom: 28 }}>
            Any organization. Any trigger. 12 minutes.
          </p>
          <p style={{ ...DM, fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, marginBottom: 40 }}>
            12 Founding Partner seats. 90-day validation partnership. Your first protocol activated within 30 days.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/request-access" style={{ ...DM, display: "inline-flex", alignItems: "center", gap: 8, background: GOLD, color: NAVY, fontWeight: 800, fontSize: 13, padding: "16px 32px", textDecoration: "none", letterSpacing: "0.07em", textTransform: "uppercase" }}>
              Apply for Founding Partner Access <ArrowRight size={14} />
            </Link>
            <Link href="/12-minute-experience" style={{ ...DM, display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: 13, padding: "15px 24px", textDecoration: "none", letterSpacing: "0.05em", border: "1px solid rgba(255,255,255,0.2)" }}>
              <Play size={12} /> Try the 12-Minute Test Drive first
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
