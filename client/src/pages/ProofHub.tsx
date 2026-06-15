import { Link } from "wouter";
import { ArrowRight, BarChart3, FileText, Calculator, ClipboardCheck, BookOpen, DollarSign, TrendingUp, Users, Shield, Play, CheckCircle } from "lucide-react";

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
function GoldRule() {
  return <div style={{ width: 40, height: 2, background: GOLD, marginBottom: 20 }} />;
}

const ASSETS = [
  {
    icon: FileText,
    label: "Executive Brief",
    tag: "Board-Ready",
    tagColor: GOLD,
    desc: "One printable page. Thesis, 3,600× metric, comparison table, ROI case, and Founding Partner CTA.",
    href: "/executive-brief",
    audience: ["CFO", "Board", "CEO"],
  },
  {
    icon: Calculator,
    label: "ROI Calculator",
    tag: "Financial Proof",
    tagColor: TEAL,
    desc: "Break-even, 3-year net value, first-year ROI %, and retainer comparison. Inputs: headcount, incidents/year, platform cost.",
    href: "/roi-calculator",
    audience: ["CFO", "Finance"],
  },
  {
    icon: BarChart3,
    label: "Proof Story",
    tag: "Case Evidence",
    tagColor: NAVY,
    desc: "Same trigger. Three real outcomes. Side-by-side timelines — Ransomware, Activist Investor, Supply Chain Collapse.",
    href: "/proof-story",
    audience: ["Board", "CEO", "Operations"],
  },
  {
    icon: ClipboardCheck,
    label: "Readiness Benchmark",
    tag: "3-Minute Score",
    tagColor: GOLD,
    desc: "Typical enterprise scores 22. Founding Partners score 87. Shows the preparation gap before any conversation.",
    href: "/readiness-benchmark",
    audience: ["CEO", "PMO", "Operations"],
  },
  {
    icon: BookOpen,
    label: "Research Foundation",
    tag: "Third-Party Validation",
    tagColor: TEAL,
    desc: "McKinsey, Gartner, IBM, PwC on the cost of mobilization delay. 30-day average. $7.2M average gap per incident.",
    href: "/research",
    audience: ["CFO", "Board", "Procurement"],
  },
  {
    icon: DollarSign,
    label: "The Case",
    tag: "Decision Page",
    tagColor: NAVY,
    desc: "Problem → proof → moat → ROI → decision. One page that answers every question before the meeting.",
    href: "/the-case",
    audience: ["CEO", "Board", "CFO"],
  },
  {
    icon: TrendingUp,
    label: "Cost of Delay",
    tag: "Quantified Risk",
    tagColor: GOLD,
    desc: "What 30-day mobilization actually costs. Calculate your organization's specific exposure.",
    href: "/cost-of-delay",
    audience: ["CFO", "Operations", "Risk"],
  },
  {
    icon: Shield,
    label: "Security & Compliance",
    tag: "Procurement-Ready",
    tagColor: TEAL,
    desc: "Auth, data governance, compliance readiness, and AI safety controls. Built for procurement review.",
    href: "/security-compliance",
    audience: ["CTO", "Procurement", "Legal"],
  },
  {
    icon: BarChart3,
    label: "Platform Reality",
    tag: "Competitive Proof",
    tagColor: NAVY,
    desc: "Why point solutions fail. Why consulting retainers are the wrong model. What only a pre-staged OS delivers.",
    href: "/platform-reality",
    audience: ["CEO", "Board", "Strategy"],
  },
];

const STAGES = [
  {
    step: "01",
    label: "Establish the Problem",
    color: NAVY,
    desc: "Quantify the mobilization gap before making any claims.",
    links: [
      { label: "Cost of Delay Calculator", href: "/cost-of-delay" },
      { label: "The Mobilization Tax", href: "/mobilization-tax" },
      { label: "Research Foundation", href: "/research" },
    ],
  },
  {
    step: "02",
    label: "Demonstrate the Solution",
    color: TEAL,
    desc: "Show the 12-minute response against a real trigger.",
    links: [
      { label: "12-Minute Test Drive", href: "/12-minute-experience" },
      { label: "Proof Story", href: "/proof-story" },
      { label: "How It Executes", href: "/how-it-executes" },
    ],
  },
  {
    step: "03",
    label: "Quantify the Return",
    color: GOLD,
    desc: "Generate the numbers CFO and finance need to approve.",
    links: [
      { label: "ROI Calculator", href: "/roi-calculator" },
      { label: "Readiness Benchmark", href: "/readiness-benchmark" },
      { label: "Executive Brief", href: "/executive-brief" },
    ],
  },
  {
    step: "04",
    label: "Close the Decision",
    color: "#C2410C",
    desc: "One page that answers every question before the final meeting.",
    links: [
      { label: "The Case", href: "/the-case" },
      { label: "Security & Compliance", href: "/security-compliance" },
      { label: "Apply for Founding Partner Access", href: "/request-access" },
    ],
  },
];

const AUDIENCES = [
  {
    role: "CFO / Finance",
    color: GOLD,
    priority: ["ROI Calculator", "Cost of Delay", "Executive Brief", "Research Foundation"],
    start: "/roi-calculator",
  },
  {
    role: "Board / Audit Committee",
    color: NAVY,
    priority: ["Executive Brief", "Proof Story", "Security & Compliance", "The Case"],
    start: "/executive-brief",
  },
  {
    role: "CEO / COO",
    color: TEAL,
    priority: ["Proof Story", "The Case", "Readiness Benchmark", "How It Executes"],
    start: "/proof-story",
  },
  {
    role: "CTO / Procurement",
    color: "#7B61FF",
    priority: ["Security & Compliance", "Research Foundation", "Platform Reality", "ROI Calculator"],
    start: "/security-compliance",
  },
];

export default function ProofHub() {
  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>

      {/* HERO */}
      <section style={{ background: NAVY, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 65% 35%, rgba(201,168,76,0.07) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 48px 72px" }}>
          <SectionLabel text="Proof & Validation Hub" light />
          <h1 style={{ ...SERIF, fontSize: 52, fontWeight: 700, color: "#fff", lineHeight: 1.1, margin: "0 0 8px", maxWidth: 680 }}>
            Build the case.
          </h1>
          <h1 style={{ ...SERIF, fontSize: 52, fontWeight: 400, fontStyle: "italic", color: GOLD, lineHeight: 1.1, margin: "0 0 24px" }}>
            Win the decision.
          </h1>
          <p style={{ ...DM, fontSize: 16, color: "rgba(255,255,255,0.6)", maxWidth: 560, lineHeight: 1.65, marginBottom: 40 }}>
            Every proof point, every validation asset, and every financial model — organized by the stage of your buying process and the audience in the room.
          </p>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            {[
              { n: "9", label: "Proof Assets" },
              { n: "4", label: "Buyer Audiences" },
              { n: "3,600×", label: "Documented Head Start" },
              { n: "$7.2M", label: "Avg. Mobilization Gap" },
            ].map((s, i) => (
              <div key={s.n} style={{ padding: "16px 32px 16px 0", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.1)" : "none", paddingRight: i < 3 ? 32 : 0 }}>
                <div style={{ ...DM, fontSize: 28, fontWeight: 800, color: GOLD, lineHeight: 1 }}>{s.n}</div>
                <div style={{ ...DM, fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BY STAGE */}
      <section style={{ background: IVORY, padding: "72px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionLabel text="By Buying Stage" />
          <GoldRule />
          <h2 style={{ ...DM, fontSize: 30, fontWeight: 700, color: NAVY, marginBottom: 8 }}>Use the right asset at the right moment.</h2>
          <p style={{ ...DM, fontSize: 14, color: MUTED, marginBottom: 40, maxWidth: 520 }}>
            From first conversation to board approval — the sequence that converts skepticism into authorization.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {STAGES.map(stage => (
              <div key={stage.step} style={{ background: "#fff", border: "1px solid rgba(10,15,46,0.08)", borderTop: `3px solid ${stage.color}`, padding: "22px 20px" }}>
                <div style={{ ...DM, fontSize: 11, fontWeight: 800, color: stage.color, letterSpacing: "0.12em", marginBottom: 8 }}>STAGE {stage.step}</div>
                <h3 style={{ ...DM, fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 8, lineHeight: 1.2 }}>{stage.label}</h3>
                <p style={{ ...DM, fontSize: 12, color: MUTED, lineHeight: 1.5, marginBottom: 16 }}>{stage.desc}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {stage.links.map(l => (
                    <Link key={l.label} href={l.href} style={{ ...DM, fontSize: 11, fontWeight: 600, color: stage.color, textDecoration: "none", display: "flex", alignItems: "center", gap: 5 }}>
                      <ArrowRight size={10} />{l.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BY AUDIENCE */}
      <section style={{ background: "#fff", padding: "72px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionLabel text="By Audience" />
          <GoldRule />
          <h2 style={{ ...DM, fontSize: 30, fontWeight: 700, color: NAVY, marginBottom: 8 }}>Know who's in the room.</h2>
          <p style={{ ...DM, fontSize: 14, color: MUTED, marginBottom: 40, maxWidth: 520 }}>
            Different stakeholders need different proof. Start with the asset most relevant to the decision-maker in front of you.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {AUDIENCES.map(aud => (
              <div key={aud.role} style={{ border: "1px solid rgba(10,15,46,0.08)", borderTop: `3px solid ${aud.color}`, padding: "22px 20px" }}>
                <div style={{ ...DM, fontSize: 13, fontWeight: 800, color: aud.color, marginBottom: 14 }}>{aud.role}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
                  {aud.priority.map((p, i) => (
                    <div key={p} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ ...DM, fontSize: 10, fontWeight: 700, color: aud.color, minWidth: 16 }}>{i + 1}.</div>
                      <span style={{ ...DM, fontSize: 12, color: NAVY, fontWeight: 600 }}>{p}</span>
                    </div>
                  ))}
                </div>
                <Link href={aud.start} style={{ ...DM, fontSize: 11, fontWeight: 700, color: aud.color, textDecoration: "none", display: "flex", alignItems: "center", gap: 5, borderTop: "1px solid rgba(10,15,46,0.07)", paddingTop: 14 }}>
                  Start here <ArrowRight size={10} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ALL ASSETS */}
      <section style={{ background: IVORY, padding: "72px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionLabel text="All Proof Assets" />
          <GoldRule />
          <h2 style={{ ...DM, fontSize: 30, fontWeight: 700, color: NAVY, marginBottom: 40 }}>Every asset. Every format.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {ASSETS.map(asset => (
              <Link key={asset.label} href={asset.href} style={{ textDecoration: "none", display: "block", background: "#fff", border: "1px solid rgba(10,15,46,0.08)", padding: "22px 22px", transition: "box-shadow 0.15s" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(10,15,46,0.10)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = "none"}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 30, height: 30, background: `${asset.tagColor}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <asset.icon size={14} color={asset.tagColor} />
                    </div>
                    <span style={{ ...DM, fontSize: 14, fontWeight: 700, color: NAVY }}>{asset.label}</span>
                  </div>
                  <span style={{ ...DM, fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: asset.tagColor, background: `${asset.tagColor}15`, padding: "3px 7px" }}>{asset.tag}</span>
                </div>
                <p style={{ ...DM, fontSize: 12, color: MUTED, lineHeight: 1.55, marginBottom: 12 }}>{asset.desc}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  {asset.audience.map(a => (
                    <span key={a} style={{ ...DM, fontSize: 9, fontWeight: 600, letterSpacing: "0.08em", color: "#9CA3AF", background: "#F3F4F6", padding: "2px 6px" }}>{a}</span>
                  ))}
                </div>
                <div style={{ ...DM, fontSize: 11, fontWeight: 600, color: asset.tagColor, marginTop: 12, display: "flex", alignItems: "center", gap: 4 }}>
                  Open <ArrowRight size={10} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: NAVY, padding: "64px 48px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <SectionLabel text="Ready to Start?" light />
          <h2 style={{ ...SERIF, fontSize: 38, fontWeight: 700, color: "#fff", marginBottom: 8 }}>The response is ready.</h2>
          <p style={{ ...SERIF, fontSize: 20, fontStyle: "italic", color: GOLD, marginBottom: 32 }}>Before the trigger fires.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/request-access" style={{ ...DM, display: "inline-flex", alignItems: "center", gap: 8, background: GOLD, color: NAVY, fontWeight: 800, fontSize: 13, padding: "14px 28px", textDecoration: "none", letterSpacing: "0.07em", textTransform: "uppercase" }}>
              Apply for Founding Partner Access <ArrowRight size={13} />
            </Link>
            <Link href="/12-minute-experience" style={{ ...DM, display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "rgba(255,255,255,0.65)", fontWeight: 600, fontSize: 13, padding: "13px 20px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)" }}>
              <Play size={12} /> Try the 12-Minute Test Drive
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
