import { Link } from "wouter";
import { ArrowRight, Rocket, Users, Settings, CheckCircle, Layers, Target, Calendar, Shield, Zap, ClipboardList, Play } from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";
const MUTED = "#6B7280";
const DM: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };
const SERIF: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

function SectionLabel({ text, light = false }: { text: string; light?: boolean }) {
  return <p style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: light ? "rgba(255,255,255,0.55)" : GOLD, marginBottom: 10 }}>{text}</p>;
}
function GoldRule() { return <div style={{ width: 40, height: 2, background: GOLD, marginBottom: 20 }} />; }

const PHASES = [
  {
    num: "01",
    label: "Install",
    duration: "Days 1–7",
    color: TEAL,
    goal: "Connect your environment. Integrate your tools. Configure your organizational context.",
    tasks: [
      "Connect Microsoft / Google ecosystem",
      "Configure organizational structure",
      "Set up stakeholder directory",
      "Run Integration Setup Plan",
    ],
    links: [
      { label: "Technical Onboarding", href: "/technical-onboarding" },
      { label: "Integration Setup Plan", href: "/integrations" },
      { label: "Getting Started Hub", href: "/getting-started" },
    ],
  },
  {
    num: "02",
    label: "Build",
    duration: "Days 8–14",
    color: GOLD,
    goal: "Configure your first 5 Readiness Protocols. Assign ownership. Set authorization chains.",
    tasks: [
      "Select first 5 protocols from your domain",
      "Assign protocol owners and stakeholders",
      "Configure executive authorization chain",
      "Set trigger thresholds for your context",
    ],
    links: [
      { label: "Protocol Library — 180 Protocols", href: "/playbooks" },
      { label: "Protocol Builder", href: "/protocol-builder" },
      { label: "Preparation Architect Onboarding", href: "/pmo-onboarding" },
    ],
  },
  {
    num: "03",
    label: "Drill",
    duration: "Days 15–21",
    color: "#E05C3A",
    goal: "Run your first practice drill. Test the authorization chain. Debrief and improve.",
    tasks: [
      "Schedule first practice drill with team",
      "Run full authorization chain simulation",
      "Complete structured post-drill debrief",
      "Apply first ADVANCE 2.0 protocol update",
    ],
    links: [
      { label: "Practice Drills", href: "/practice-drills" },
      { label: "ADVANCE 2.0", href: "/advance-intelligence" },
      { label: "How It Executes", href: "/how-it-executes" },
    ],
  },
  {
    num: "04",
    label: "Go-Live",
    duration: "Days 22–30",
    color: NAVY,
    goal: "Signal monitoring active. First live trigger detected. First executive authorization on record.",
    tasks: [
      "Activate signal monitoring",
      "Confirm all stakeholders notified",
      "Brief executive team on authorization protocol",
      "First live activation within 30 days",
    ],
    links: [
      { label: "Mission Control", href: "/mission-control" },
      { label: "Command Tower", href: "/command-tower" },
      { label: "Live Activation Center", href: "/live-activation-center" },
    ],
  },
];

const ROLES = [
  {
    role: "CEO / Executive Sponsor",
    icon: Shield,
    color: GOLD,
    responsibility: "Authorization",
    desc: "You authorize — you don't configure. Your role: set authorization thresholds, review the first debrief, confirm the governance model.",
    start: "/executive-brief",
    startLabel: "Read the Executive Brief",
    resources: [
      { label: "Executive Brief", href: "/executive-brief" },
      { label: "How It Executes", href: "/how-it-executes" },
      { label: "Governance Overview", href: "/pmo-onboarding" },
    ],
  },
  {
    role: "Preparation Architect",
    icon: Layers,
    color: TEAL,
    responsibility: "Preparation Architecture",
    desc: "You own the go-live path. Your role: protocol selection, ownership assignment, drill scheduling, and governance rhythm.",
    start: "/pmo-onboarding",
    startLabel: "Open Preparation Architect Path",
    resources: [
      { label: "Preparation Architect Onboarding", href: "/pmo-onboarding" },
      { label: "30-Day Preparation Arc", href: "/preparation-arc" },
      { label: "Protocol Library", href: "/playbooks" },
    ],
  },
  {
    role: "IT / Technical Lead",
    icon: Settings,
    color: "#7B61FF",
    responsibility: "Integration & Setup",
    desc: "You connect the environment. Your role: ecosystem integration, data connector configuration, signal feed validation.",
    start: "/technical-onboarding",
    startLabel: "Open Technical Onboarding",
    resources: [
      { label: "Technical Onboarding", href: "/technical-onboarding" },
      { label: "Universal Connector", href: "/universal-connector" },
      { label: "Integration Setup Plan", href: "/integrations" },
    ],
  },
  {
    role: "Functional Leads",
    icon: Users,
    color: "#E05C3A",
    responsibility: "Execution",
    desc: "You execute — when authorized. Your role: understand your protocol responsibilities, review your task assignments, participate in drills.",
    start: "/playbooks",
    startLabel: "Review Your Protocols",
    resources: [
      { label: "Protocol Library", href: "/playbooks" },
      { label: "Practice Drills", href: "/practice-drills" },
      { label: "War Room", href: "/war-room" },
    ],
  },
];

const ALL_RESOURCES = [
  {
    heading: "Setup & Configuration",
    color: TEAL,
    links: [
      { label: "Getting Started Hub", href: "/getting-started" },
      { label: "Preparation Architect Onboarding", href: "/pmo-onboarding" },
      { label: "30-Day Preparation Arc", href: "/preparation-arc" },
      { label: "Technical Onboarding", href: "/technical-onboarding" },
      { label: "Integration Setup Plan", href: "/integrations" },
      { label: "Universal Connector", href: "/universal-connector" },
    ],
  },
  {
    heading: "Protocol Configuration",
    color: GOLD,
    links: [
      { label: "Protocol Library — 180 Protocols", href: "/playbooks" },
      { label: "Protocol Builder", href: "/protocol-builder" },
      { label: "9-Domain Situations Board", href: "/situations-hub" },
      { label: "Industry Protocol Packs", href: "/industry" },
      { label: "Sector Briefing", href: "/sector-briefing" },
      { label: "Mission Control", href: "/mission-control" },
    ],
  },
  {
    heading: "Training & Drills",
    color: "#E05C3A",
    links: [
      { label: "Practice Drills", href: "/practice-drills" },
      { label: "12-Minute Test Drive", href: "/12-minute-experience" },
      { label: "How It Executes", href: "/how-it-executes" },
      { label: "Demo Hub", href: "/demo-hub" },
      { label: "Shadow Simulator", href: "/simulation-studio" },
      { label: "Readiness Benchmark", href: "/readiness-benchmark" },
    ],
  },
  {
    heading: "Operations & Intelligence",
    color: "#7B61FF",
    links: [
      { label: "Command Tower", href: "/command-tower" },
      { label: "Live Activation Center", href: "/live-activation-center" },
      { label: "War Room", href: "/war-room" },
      { label: "ADVANCE 2.0", href: "/advance-intelligence" },
      { label: "Advanced Analytics", href: "/advanced-analytics" },
      { label: "Coordination Intelligence", href: "/coordination-intelligence" },
    ],
  },
];

export default function OnboardingHub() {
  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>

      {/* HERO */}
      <section style={{ background: NAVY, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 70% 40%, rgba(43,138,110,0.07) 0%, transparent 55%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 48px 72px" }}>
          <SectionLabel text="Onboarding Hub · Founding Partners" light />
          <h1 style={{ ...SERIF, fontSize: 52, fontWeight: 700, color: "#fff", lineHeight: 1.1, margin: "0 0 8px", maxWidth: 680 }}>
            From access to fearless
          </h1>
          <h1 style={{ ...SERIF, fontSize: 52, fontWeight: 400, fontStyle: "italic", color: GOLD, lineHeight: 1.1, margin: "0 0 24px" }}>
            in 30 days.
          </h1>
          <p style={{ ...DM, fontSize: 16, color: "rgba(255,255,255,0.6)", maxWidth: 560, lineHeight: 1.65, marginBottom: 40 }}>
            Every resource, every role, every phase of your go-live journey — organized so your team knows exactly what to do next.
          </p>
          <div style={{ display: "flex", gap: 0, flexWrap: "wrap", marginBottom: 40 }}>
            {[
              { n: "30", label: "Days to First Live Activation" },
              { n: "4", label: "Setup Phases" },
              { n: "3", label: "Ownership Tiers" },
              { n: "180", label: "Protocols Available Day 1" },
            ].map((s, i) => (
              <div key={s.n} style={{ padding: "16px 32px 16px 0", marginRight: 32, borderRight: i < 3 ? "1px solid rgba(255,255,255,0.1)" : "none", paddingRight: i < 3 ? 32 : 0 }}>
                <div style={{ ...DM, fontSize: 26, fontWeight: 800, color: GOLD, lineHeight: 1 }}>{s.n}</div>
                <div style={{ ...DM, fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link href="/getting-started" style={{ ...DM, display: "inline-flex", alignItems: "center", gap: 8, background: GOLD, color: NAVY, fontWeight: 800, fontSize: 13, padding: "14px 28px", textDecoration: "none", letterSpacing: "0.07em", textTransform: "uppercase" }}>
              <CheckCircle size={13} /> Open Setup Checklist
            </Link>
            <Link href="/pmo-onboarding" style={{ ...DM, display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "rgba(255,255,255,0.65)", fontWeight: 600, fontSize: 13, padding: "13px 20px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)" }}>
              Preparation Architect Path <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4 PHASES */}
      <section style={{ background: IVORY, padding: "72px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionLabel text="The 30-Day Go-Live Path" />
          <GoldRule />
          <h2 style={{ ...DM, fontSize: 30, fontWeight: 700, color: NAVY, marginBottom: 8 }}>Install → Build → Drill → Go-Live.</h2>
          <p style={{ ...DM, fontSize: 14, color: MUTED, marginBottom: 40, maxWidth: 520 }}>
            Four phases. Thirty days. Your first protocol activated, your first executive authorization on record.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {PHASES.map(phase => (
              <div key={phase.num} style={{ background: "#fff", border: "1px solid rgba(10,15,46,0.08)", borderTop: `3px solid ${phase.color}`, padding: "22px 20px" }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ ...DM, fontSize: 11, fontWeight: 800, color: phase.color, letterSpacing: "0.12em" }}>PHASE {phase.num}</span>
                  <span style={{ ...DM, fontSize: 10, color: MUTED }}>{phase.duration}</span>
                </div>
                <h3 style={{ ...DM, fontSize: 18, fontWeight: 800, color: NAVY, marginBottom: 8 }}>{phase.label}</h3>
                <p style={{ ...DM, fontSize: 12, color: MUTED, lineHeight: 1.5, marginBottom: 14 }}>{phase.goal}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16, paddingBottom: 14, borderBottom: "1px solid rgba(10,15,46,0.07)" }}>
                  {phase.tasks.map(t => (
                    <div key={t} style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                      <CheckCircle size={10} color={phase.color} style={{ marginTop: 2, flexShrink: 0 }} />
                      <span style={{ ...DM, fontSize: 11, color: "#374151" }}>{t}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {phase.links.map(l => (
                    <Link key={l.label} href={l.href} style={{ ...DM, fontSize: 11, fontWeight: 600, color: phase.color, textDecoration: "none", display: "flex", alignItems: "center", gap: 5 }}>
                      <ArrowRight size={10} />{l.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROLE PATHS */}
      <section style={{ background: "#fff", padding: "72px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionLabel text="By Role" />
          <GoldRule />
          <h2 style={{ ...DM, fontSize: 30, fontWeight: 700, color: NAVY, marginBottom: 8 }}>Three ownership tiers. One coordinated launch.</h2>
          <p style={{ ...DM, fontSize: 14, color: MUTED, marginBottom: 40, maxWidth: 520 }}>
            C-suite authorizes. Preparation Architect builds readiness. Functional leads execute. Each role has a clear path.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {ROLES.map(role => (
              <div key={role.role} style={{ border: "1px solid rgba(10,15,46,0.08)", borderTop: `3px solid ${role.color}`, padding: "22px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <role.icon size={14} color={role.color} />
                  <span style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: role.color }}>{role.responsibility}</span>
                </div>
                <h3 style={{ ...DM, fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 10, lineHeight: 1.2 }}>{role.role}</h3>
                <p style={{ ...DM, fontSize: 12, color: MUTED, lineHeight: 1.55, marginBottom: 14 }}>{role.desc}</p>
                <Link href={role.start} style={{ ...DM, display: "inline-flex", alignItems: "center", gap: 6, background: role.color, color: role.color === GOLD ? NAVY : "#fff", fontWeight: 700, fontSize: 11, padding: "9px 14px", textDecoration: "none", letterSpacing: "0.05em", marginBottom: 14 }}>
                  {role.startLabel} <ArrowRight size={10} />
                </Link>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, borderTop: "1px solid rgba(10,15,46,0.07)", paddingTop: 12 }}>
                  {role.resources.map(r => (
                    <Link key={r.label} href={r.href} style={{ ...DM, fontSize: 11, fontWeight: 600, color: role.color, textDecoration: "none", display: "flex", alignItems: "center", gap: 5 }}>
                      <ArrowRight size={9} />{r.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ALL RESOURCES */}
      <section style={{ background: NAVY, padding: "72px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionLabel text="Complete Resource Index" light />
          <GoldRule />
          <h2 style={{ ...DM, fontSize: 30, fontWeight: 700, color: "#fff", marginBottom: 40 }}>Every onboarding resource. In one place.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 28 }}>
            {ALL_RESOURCES.map(col => (
              <div key={col.heading}>
                <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: col.color, marginBottom: 14, paddingBottom: 8, borderBottom: `1px solid ${col.color}30` }}>
                  {col.heading}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {col.links.map(link => (
                    <Link key={link.label} href={link.href} style={{ ...DM, fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.55)", textDecoration: "none", padding: "5px 0", display: "flex", alignItems: "center", gap: 6 }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = col.color}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)"}
                    >
                      <CheckCircle size={9} color={`${col.color}60`} />
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: IVORY, padding: "64px 48px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <SectionLabel text="Ready to Begin?" />
          <h2 style={{ ...SERIF, fontSize: 36, fontWeight: 700, color: NAVY, marginBottom: 8 }}>Your first activation in 30 days.</h2>
          <p style={{ ...DM, fontSize: 14, color: MUTED, lineHeight: 1.65, marginBottom: 32, maxWidth: 440, marginLeft: "auto", marginRight: "auto" }}>
            12 Founding Partner seats. 90-day validation partnership. Full team onboarding support included.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/getting-started" style={{ ...DM, display: "inline-flex", alignItems: "center", gap: 8, background: NAVY, color: "#fff", fontWeight: 800, fontSize: 13, padding: "14px 28px", textDecoration: "none", letterSpacing: "0.07em", textTransform: "uppercase" }}>
              <Rocket size={13} /> Open Setup Checklist
            </Link>
            <Link href="/request-access" style={{ ...DM, display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: NAVY, fontWeight: 600, fontSize: 13, padding: "13px 20px", textDecoration: "none", border: "1px solid rgba(10,15,46,0.2)" }}>
              Apply for Founding Partner Access <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
