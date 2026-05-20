import { useEffect } from "react";
import { Link } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";
import { updatePageMetadata } from "@/lib/seo";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BC: React.CSSProperties = { fontFamily: "'Barlow Condensed', 'Barlow', sans-serif" };
const DM: React.CSSProperties = { fontFamily: "'Barlow', sans-serif" };

const cadence = [
  {
    frequency: "Monthly",
    name: "Readiness Drill",
    color: GOLD,
    tagline: "Practice the response before the situation arrives.",
    description:
      "A facilitated, timed execution drill against one of your active Readiness Protocols. Your leadership team runs the full 12-minute cycle — signal detected, protocol deployed, tasks acknowledged, executive authorizes. Every drill is timed, scored, and logged.",
    outputs: [
      "Drill Score — 0–100 based on acknowledgment rate and response speed",
      "Gap Report — tasks that went silent, ownership that didn't confirm",
      "Readiness Score delta — your score before and after each drill",
      "Protocol update recommendations — timing and ownership refinements",
    ],
    why: "Organizations that drill monthly respond 3× faster when a real situation presents itself. The score is evidence. The muscle is real.",
  },
  {
    frequency: "Quarterly",
    name: "Readiness Score Review",
    color: TEAL,
    tagline: "A board-ready readout. Every 90 days.",
    description:
      "A structured executive review of the organization's Readiness Score trendline — where it started, where it is, what moved it, what's next. Formatted for board presentation. No interpretation required.",
    outputs: [
      "Readiness Score trendline — quarter-over-quarter with delta",
      "Activation summary — situations responded to, protocols deployed",
      "Protocol health report — which protocols are strong, which need rebuilding",
      "Board-ready one-page executive summary",
    ],
    why: "Once the board benchmarks the Readiness Score quarterly, it becomes infrastructure — not a vendor relationship. The score is theirs. They don't leave it behind.",
  },
  {
    frequency: "Annual",
    name: "Protocol Audit",
    color: NAVY,
    tagline: "Rebuild for the year ahead — before the situations change.",
    description:
      "A full review and rebuild of all active Readiness Protocols against the organization's current strategic priorities, threat landscape, and stakeholder structure. New situations scoped. Stale protocols retired. Ownership confirmed for every active protocol.",
    outputs: [
      "Full protocol inventory — active, retired, and recommended additions",
      "Stakeholder map update — ownership confirmed against current org chart",
      "New situation scoping — up to 3 new protocols built for the year ahead",
      "Annual Readiness Benchmark Report — full institutional record",
    ],
    why: "Strategic situations change. Leadership changes. Regulatory environments shift. The annual audit ensures the preparation stays ahead of what the organization will actually face.",
  },
];

const moatPoints = [
  {
    label: "The score is theirs",
    body: "Every drill, every activation, every protocol update builds a Readiness Score that belongs to the organization — not to VaughnMartin. No competitor can offer the same score because no competitor has the history.",
  },
  {
    label: "The memory compounds",
    body: "Every activation feeds Retrospect™ — the institutional knowledge layer that improves protocol timing, stakeholder sequencing, and decision logic with every event. The system gets more accurate the longer it runs.",
  },
  {
    label: "The board owns the KPI",
    body: "Once the Readiness Score is a standing board agenda item, the switching cost is structural. The board doesn't replace their readiness infrastructure. They invest in it.",
  },
  {
    label: "The habits are built",
    body: "Organizations that run the Readiness Operating Rhythm for 12 months are not using software — they are operating differently. That behavioral change is the real moat. It cannot be replicated by a competitor in a demo.",
  },
];

export default function ReadinessRhythm() {
  useEffect(() => {
    updatePageMetadata({
      title: "The Readiness Operating Rhythm — Readiness OS by VaughnMartin",
      description: "Monthly drills. Quarterly score reviews. Annual protocol audits. The cadence that turns readiness from a project into an operating model.",
    });
  }, []);

  return (
    <PageLayout>
      <div style={{ background: "#fff", minHeight: "100vh" }}>

        {/* ── HERO ────────────────────────────────────────────────────────── */}
        <div style={{
          background: NAVY,
          padding: "80px 0 72px",
          backgroundImage: [
            `radial-gradient(ellipse 800px 600px at -5% 0%, rgba(43,138,110,0.15) 0%, transparent 55%)`,
            `radial-gradient(ellipse 900px 700px at 105% 100%, rgba(201,168,76,0.10) 0%, transparent 55%)`,
          ].join(", "),
        }}>
          <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 40px" }}>
            <div style={{ marginBottom: 24 }}>
              <VaughnMartinLogo variant="full" height={64} color="light" animated={false} />
            </div>
            <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.20em", textTransform: "uppercase", color: GOLD, marginBottom: 20 }}>
              The Readiness Operating Rhythm
            </div>
            <h1 style={{ ...CG, fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, margin: "0 0 24px", maxWidth: 720 }}>
              Preparation is not a project.<br />It is a cadence.
            </h1>
            <p style={{ ...DM, fontSize: 17, color: "rgba(255,255,255,0.72)", lineHeight: 1.7, maxWidth: 620, margin: "0 0 48px" }}>
              Every organization that prepares for every situation it will face is no longer afraid of any situation they will face. The Readiness Operating Rhythm is how that preparation is built and sustained — month after month, quarter after quarter.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <Link href="/founding-partner-brief">
                <button style={{
                  padding: "15px 32px", background: GOLD, border: "none", cursor: "pointer",
                  ...BC, fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: NAVY,
                }}>
                  View the Founding Partner Brief
                </button>
              </Link>
              <Link href="/12-minute-experience" style={{
                ...BC, fontSize: 13, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.75)", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.3)",
                paddingBottom: 2,
              }}>
                Run the 12-Minute Test Drive →
              </Link>
            </div>
          </div>
        </div>

        {/* ── THREE CADENCE ELEMENTS ──────────────────────────────────────── */}
        <div style={{ padding: "80px 0" }}>
          <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 40px" }}>
            <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD, marginBottom: 12 }}>
              Three Cadence Elements
            </div>
            <h2 style={{ ...CG, fontSize: 36, fontWeight: 700, color: NAVY, marginBottom: 56 }}>
              Monthly · Quarterly · Annual
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {cadence.map((c, i) => (
                <div key={i} style={{
                  display: "grid",
                  gridTemplateColumns: "220px 1fr",
                  borderTop: `1px solid rgba(10,15,46,0.10)`,
                  paddingTop: i === 0 ? 0 : undefined,
                }}>
                  {/* Left label */}
                  <div style={{ padding: "40px 40px 40px 0", borderRight: `4px solid ${c.color}` }}>
                    <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: c.color, marginBottom: 10 }}>
                      {c.frequency}
                    </div>
                    <div style={{ ...CG, fontSize: 26, fontWeight: 700, color: NAVY, lineHeight: 1.2, marginBottom: 12 }}>
                      {c.name}
                    </div>
                    <div style={{ ...DM, fontSize: 13, fontStyle: "italic", color: "#6B7280", lineHeight: 1.5 }}>
                      "{c.tagline}"
                    </div>
                  </div>

                  {/* Right content */}
                  <div style={{ padding: "40px 0 40px 48px" }}>
                    <p style={{ ...DM, fontSize: 15, color: "#374151", lineHeight: 1.7, marginBottom: 28 }}>
                      {c.description}
                    </p>

                    <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: NAVY, marginBottom: 14 }}>
                      Outputs
                    </div>
                    <ul style={{ margin: "0 0 28px", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                      {c.outputs.map((o, j) => (
                        <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                          <span style={{ color: c.color, fontWeight: 700, fontSize: 14, lineHeight: 1.5, flexShrink: 0 }}>→</span>
                          <span style={{ ...DM, fontSize: 14, color: "#374151", lineHeight: 1.5 }}>{o}</span>
                        </li>
                      ))}
                    </ul>

                    <div style={{ background: "rgba(10,15,46,0.04)", borderLeft: `3px solid ${c.color}`, padding: "16px 20px" }}>
                      <span style={{ ...DM, fontSize: 13.5, fontStyle: "italic", color: NAVY, lineHeight: 1.6 }}>{c.why}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── THE MOAT ────────────────────────────────────────────────────── */}
        <div style={{ background: IVORY, padding: "64px 0" }}>
          <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 40px" }}>
            <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD, marginBottom: 12 }}>
              Why It Compounds
            </div>
            <h2 style={{ ...CG, fontSize: 34, fontWeight: 700, color: NAVY, marginBottom: 12 }}>
              The Readiness Operating Rhythm is the moat.
            </h2>
            <p style={{ ...DM, fontSize: 15, color: "#6B7280", marginBottom: 48, lineHeight: 1.6, maxWidth: 620 }}>
              Every competitor can rebuild the platform in 12 months. No competitor can rebuild 12 months of your organization's readiness history.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              {moatPoints.map((m, i) => (
                <div key={i} style={{ background: "#fff", padding: "28px 28px 24px", borderTop: `3px solid ${NAVY}` }}>
                  <div style={{ ...BC, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: NAVY, marginBottom: 12 }}>
                    {m.label}
                  </div>
                  <p style={{ ...DM, fontSize: 14, color: "#374151", lineHeight: 1.65, margin: 0 }}>{m.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RHYTHM VISUAL SUMMARY ───────────────────────────────────────── */}
        <div style={{ background: NAVY, padding: "64px 0" }}>
          <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 40px" }}>
            <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD, marginBottom: 32, textAlign: "center" }}>
              The Annual Cadence at a Glance
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, marginBottom: 48 }}>
              {[
                { period: "Month 1", action: "Drill #1", note: "Baseline score set", color: GOLD },
                { period: "Month 2", action: "Drill #2", note: "Gap report reviewed", color: GOLD },
                { period: "Month 3", action: "Drill #3 + Q1 Review", note: "Board report delivered", color: TEAL },
                { period: "Month 4", action: "Drill #4", note: "Protocols refined", color: GOLD },
                { period: "Month 5", action: "Drill #5", note: "New scenario added", color: GOLD },
                { period: "Month 6", action: "Drill #6 + Q2 Review", note: "Mid-year board readout", color: TEAL },
                { period: "Month 9", action: "Drill #9 + Q3 Review", note: "Expansion protocols scoped", color: TEAL },
                { period: "Month 12", action: "Annual Audit + Q4 Review", note: "Full benchmark report", color: "#fff" },
              ].map((item, i) => (
                <div key={i} style={{
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid rgba(255,255,255,0.08)`,
                  borderTop: `3px solid ${item.color}`,
                  padding: "20px 16px",
                }}>
                  <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: item.color, marginBottom: 8 }}>
                    {item.period}
                  </div>
                  <div style={{ ...DM, fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 6, lineHeight: 1.3 }}>{item.action}</div>
                  <div style={{ ...DM, fontSize: 11.5, color: "rgba(255,255,255,0.5)", lineHeight: 1.4 }}>{item.note}</div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center" }}>
              <Link href="/founding-partner-brief">
                <button style={{
                  padding: "16px 40px", background: GOLD, border: "none", cursor: "pointer",
                  ...BC, fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: NAVY,
                }}>
                  See What Founding Partners Get in 90 Days
                </button>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </PageLayout>
  );
}
