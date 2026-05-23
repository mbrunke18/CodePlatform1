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

function GoldRule() {
  return <div style={{ width: 48, height: 2, background: GOLD, margin: "16px 0" }} />;
}

const milestones = [
  {
    day: "Day 30",
    label: "Foundation Built",
    color: GOLD,
    deliverables: [
      "5 Readiness Protocols fully configured to your organization's scenarios",
      "Signal monitoring live across your 3 highest-priority intelligence categories",
      "Microsoft Teams integration active — notifications routing to correct stakeholders",
      "Executive owner mapped to every protocol and task",
      "First tabletop exercise completed — response gaps documented",
      "Readiness Score baseline established (your Day 0 benchmark)",
    ],
  },
  {
    day: "Day 60",
    label: "First Live Activation",
    color: TEAL,
    deliverables: [
      "First live or sanctioned activation completed — full 12-minute cycle documented",
      "Activation report generated — elapsed time, decision log, acknowledgment rate",
      "Retrospect™ record seeded — institutional memory begins compounding",
      "Readiness Score tracked against Day 30 baseline — delta measured",
      "Second tabletop completed with cross-functional stakeholders",
      "Protocol timing and ownership refined based on activation learnings",
    ],
  },
  {
    day: "Day 90",
    label: "Proof Package Complete",
    color: NAVY,
    deliverables: [
      "Board-ready Readiness Report — executive summary with activation metrics",
      "ROI documentation — executive time recovered, mobilization cost avoided",
      "3,600× Head Start demonstrated with your organization's actual data",
      "Third tabletop exercise — compound scenario (two simultaneous situations)",
      "Founding Partner investment (100%) credited toward enterprise contract",
      "Series A proof package — real ARR, real activation data, real readiness score",
    ],
  },
];

const included = [
  { label: "Platform Access", body: "Full Readiness OS for up to 25 users — all 180 Readiness Protocols, signal monitoring, war room, activation console, and debrief engine." },
  { label: "Protocol Configuration", body: "5 Readiness Protocols built and configured to your specific organizational scenarios, stakeholders, and decision authorities." },
  { label: "Signal Intelligence", body: "Live monitoring across 3 intelligence categories — 248+ data points refreshed every 15 minutes against your priority situations." },
  { label: "Microsoft Integration", body: "Teams notifications, M365 document staging, and Azure AI signal enrichment — all within your existing enterprise stack." },
  { label: "Three Tabletop Exercises", body: "Facilitated drills with your actual leadership team — single-domain, multi-domain, and compound scenario. Gaps documented and closed." },
  { label: "Customer Success Manager", body: "Dedicated CSM for the full 90 days — configuration support, stakeholder coordination, and activation readout." },
  { label: "Readiness Score Trendline", body: "Board-ready KPI tracked across all three milestones — your organization's readiness trajectory in a single number." },
  { label: "Proof Documentation", body: "Activation report, ROI summary, and Readiness Score delta — the evidence package for internal champions and Series A conversations." },
];

const positions = [
  { label: "Internal champion", body: "Your Readiness Report is the artifact that gets budget approved. Quantified outcomes. Board-ready format. No interpretation required." },
  { label: "Board KPI", body: "The Readiness Score becomes a standing board metric. Once the board benchmarks it quarterly, the platform becomes infrastructure — not a vendor." },
  { label: "Series A narrative", body: "3–5 Founding Partners with live data and documented ROI is the proof story that closes the category argument for institutional investors." },
  { label: "Expansion path", body: "Core opens the account. Industry Protocol Packs expand it. Enterprise tier seals multi-year. Day 90 is the beginning of the expansion conversation." },
];

export default function FoundingPartnerBrief() {
  useEffect(() => {
    updatePageMetadata({
      title: "Founding Partner Brief — Readiness OS by VaughnMartin",
      description: "What you get in 90 days as a Readiness OS Founding Partner. Specific deliverables, milestones, and proof points — the commercial unlock for executive champions.",
    });
  }, []);

  return (
    <PageLayout>
      <div style={{ background: "#fff", minHeight: "100vh" }}>

        {/* ── HEADER ─────────────────────────────────────────────────────── */}
        <div style={{ background: NAVY, padding: "40px 0 36px" }}>
          <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 40px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
              <VaughnMartinLogo variant="full" height={72} color="light" animated={false} />
              <div style={{ textAlign: "right" }}>
                <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD, marginBottom: 6 }}>
                  Founding Partner Program
                </div>
                <div style={{ ...CG, fontSize: 28, fontWeight: 600, color: "#fff", lineHeight: 1.2 }}>
                  What you get in 90 days.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── GOLD RULE ───────────────────────────────────────────────────── */}
        <div style={{ background: GOLD, height: 3 }} />

        {/* ── OPENING STATEMENT ───────────────────────────────────────────── */}
        <div style={{ background: IVORY, padding: "48px 0" }}>
          <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 40px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
              <div>
                <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD, marginBottom: 16 }}>
                  The Founding Partner Program
                </div>
                <h2 style={{ ...CG, fontSize: 36, fontWeight: 700, color: NAVY, lineHeight: 1.2, margin: "0 0 20px" }}>
                  The response is ready before the situation presents itself.
                </h2>
                <p style={{ ...DM, fontSize: 15, color: "#374151", lineHeight: 1.7, margin: "0 0 20px" }}>
                  The Founding Partner Program is a 90-day validation partnership — not a trial, not a pilot. You are building the infrastructure your organization will use at the moment it matters most.
                </p>
                <p style={{ ...DM, fontSize: 15, color: "#374151", lineHeight: 1.7, margin: 0 }}>
                  At Day 90, you have documented proof, a board-ready report, and 100% of the Founding Partner investment credited toward your enterprise contract.
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { value: "90", label: "Days to documented proof" },
                  { value: "12 min", label: "Trigger to full coordination" },
                  { value: "180", label: "Readiness Protocols available" },
                  { value: "100%", label: "Investment credited to contract" },
                ].map((s, i) => (
                  <div key={i} style={{ background: "#fff", border: `1px solid rgba(10,15,46,0.1)`, padding: "24px 20px" }}>
                    <div style={{ ...CG, fontSize: 36, fontWeight: 700, color: NAVY, lineHeight: 1 }}>{s.value}</div>
                    <div style={{ ...DM, fontSize: 12, color: "#6B7280", marginTop: 8, lineHeight: 1.4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── MILESTONES ──────────────────────────────────────────────────── */}
        <div style={{ padding: "64px 0" }}>
          <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 40px" }}>
            <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD, marginBottom: 12 }}>
              The 90-Day Arc
            </div>
            <h2 style={{ ...CG, fontSize: 32, fontWeight: 700, color: NAVY, marginBottom: 40 }}>
              Exactly what you will have built — milestone by milestone.
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {milestones.map((m, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 0, borderTop: `1px solid rgba(10,15,46,0.10)` }}>
                  <div style={{ padding: "32px 32px 32px 0", borderRight: `3px solid ${m.color}` }}>
                    <div style={{ ...CG, fontSize: 32, fontWeight: 700, color: m.color }}>{m.day}</div>
                    <div style={{ ...BC, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: NAVY, marginTop: 8 }}>{m.label}</div>
                  </div>
                  <div style={{ padding: "32px 0 32px 40px" }}>
                    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                      {m.deliverables.map((d, j) => (
                        <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                          <span style={{ color: m.color, fontWeight: 700, fontSize: 16, lineHeight: 1.4, flexShrink: 0 }}>→</span>
                          <span style={{ ...DM, fontSize: 14, color: "#374151", lineHeight: 1.55 }}>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── WHAT'S INCLUDED ─────────────────────────────────────────────── */}
        <div style={{ background: IVORY, padding: "64px 0" }}>
          <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 40px" }}>
            <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD, marginBottom: 12 }}>
              What's Included
            </div>
            <h2 style={{ ...CG, fontSize: 32, fontWeight: 700, color: NAVY, marginBottom: 40 }}>
              Every component of the Founding Partner engagement.
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              {included.map((item, i) => (
                <div key={i} style={{ background: "#fff", padding: "28px 28px 24px", borderLeft: `3px solid ${GOLD}` }}>
                  <div style={{ ...BC, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: NAVY, marginBottom: 10 }}>
                    {item.label}
                  </div>
                  <p style={{ ...DM, fontSize: 13.5, color: "#374151", lineHeight: 1.6, margin: 0 }}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── WHAT THIS POSITIONS YOU FOR ─────────────────────────────────── */}
        <div style={{ padding: "64px 0" }}>
          <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 40px" }}>
            <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD, marginBottom: 12 }}>
              Day 90 Is Not the End
            </div>
            <h2 style={{ ...CG, fontSize: 32, fontWeight: 700, color: NAVY, marginBottom: 12 }}>
              What Founding Partner status positions you for.
            </h2>
            <p style={{ ...DM, fontSize: 15, color: "#6B7280", marginBottom: 40, lineHeight: 1.6 }}>
              The 90-day program is the foundation. Here is what it unlocks inside your organization and beyond.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              {positions.map((p, i) => (
                <div key={i} style={{ borderTop: `3px solid ${NAVY}`, paddingTop: 24 }}>
                  <div style={{ ...BC, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: NAVY, marginBottom: 12 }}>
                    {p.label}
                  </div>
                  <p style={{ ...DM, fontSize: 14, color: "#374151", lineHeight: 1.65, margin: 0 }}>{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── PRICING ─────────────────────────────────────────────────────── */}
        <div style={{ background: NAVY, padding: "64px 0" }}>
          <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 40px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
              <div>
                <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD, marginBottom: 16 }}>
                  Founding Partner Pricing
                </div>
                <div style={{ ...CG, fontSize: 48, fontWeight: 700, color: "#fff", lineHeight: 1 }}>$75K – $120K</div>
                <div style={{ ...DM, fontSize: 14, color: "rgba(255,255,255,0.6)", marginTop: 12, lineHeight: 1.5 }}>
                  ACV · 90-day validation · 100% credited to enterprise contract
                </div>
                <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    "No per-seat fees during the validation period",
                    "No implementation surcharge",
                    "Full enterprise feature access from Day 1",
                    "Investment credited in full at contract signature",
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <span style={{ color: GOLD, fontWeight: 700, fontSize: 16, flexShrink: 0, lineHeight: 1.4 }}>→</span>
                      <span style={{ ...DM, fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,168,76,0.25)", padding: "40px 36px" }}>
                <div style={{ ...CG, fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 8, lineHeight: 1.3 }}>
                  The Founding Partner Program is accepting 5–7 organizations.
                </div>
                <GoldRule />
                <p style={{ ...DM, fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.65, marginBottom: 32 }}>
                  Selection criteria: strategic complexity, organizational readiness, and executive sponsorship. This is not open enrollment — it is a partnership selection.
                </p>
                <Link href="/contact">
                  <button style={{
                    width: "100%", padding: "16px 24px",
                    background: GOLD, border: "none", cursor: "pointer",
                    ...BC, fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                    color: NAVY,
                  }}>
                    Apply for Founding Partner Access
                  </button>
                </Link>
                <div style={{ ...DM, fontSize: 12, color: "rgba(255,255,255,0.45)", textAlign: "center", marginTop: 16 }}>
                  Or schedule a conversation at{" "}
                  <a href="mailto:partners@vaughnmartin.com" style={{ color: GOLD, textDecoration: "none" }}>
                    partners@vaughnmartin.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── PROOF ACCESSIBLE NOW ────────────────────────────────────────── */}
        <div style={{ padding: "48px 0", borderTop: `4px solid ${GOLD}`, background: IVORY }}>
          <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
            <div>
              <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD, marginBottom: 10 }}>
                Before You Apply
              </div>
              <div style={{ ...CG, fontSize: 24, fontWeight: 700, color: NAVY, lineHeight: 1.3 }}>
                See the full 12-minute execution cycle — right now, no login required.
              </div>
              <p style={{ ...DM, fontSize: 14, color: "#6B7280", marginTop: 12, marginBottom: 0 }}>
                Seven scenarios. Activist investor, ransomware, supply chain collapse, M&A response, and more. Full cycle on your device in 12 minutes.
              </p>
            </div>
            <Link href="/12-minute-experience">
              <button style={{
                padding: "16px 32px", background: NAVY, border: "none", cursor: "pointer",
                ...BC, fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                color: "#fff", whiteSpace: "nowrap",
              }}>
                Run the 12-Minute Test Drive →
              </button>
            </Link>
          </div>
        </div>

      </div>
    </PageLayout>
  );
}
