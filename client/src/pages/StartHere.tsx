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

const stats = [
  { value: "12 min", label: "Situation to full coordination" },
  { value: "3,600×", label: "Execution head start vs. traditional" },
  { value: "170", label: "Pre-staged Readiness Protocols" },
  { value: "221", label: "Strategic situations mapped" },
];

const tracks = [
  {
    audience: "Enterprise Executive",
    headline: "You need your organization ready before the situation arrives.",
    body: "Readiness OS is the operating infrastructure that compresses your mobilization cycle from 30 days to 12 minutes — pre-staged before the situation presents itself, not assembled after.",
    cta: "See What You Get in 90 Days",
    ctaPath: "/founding-partner-brief",
    secondary: "Run the 12-Minute Test Drive",
    secondaryPath: "/12-minute-experience",
    accent: GOLD,
    proof: [
      "170 Readiness Protocols — pre-staged and ready",
      "12-minute coordination from signal to war room open",
      "Executive authority preserved at every decision point",
      "100% Founding Partner investment credited to contract",
    ],
  },
  {
    audience: "Investor",
    headline: "First-mover in a new enterprise software category.",
    body: "Every enterprise has Microsoft's AI stack. None have the operating model to use it. Readiness OS is the orchestration layer that makes the $300B Microsoft investment execute in 12 minutes.",
    cta: "View the Investor Overview",
    ctaPath: "/investor",
    secondary: "Read the Executive Brief",
    secondaryPath: "/executive-brief",
    accent: TEAL,
    proof: [
      "$42B TAM — Gartner SPM + GRC + EPMO categories",
      "3,600× execution head start — math, not marketing",
      "No incumbent owns this orchestration layer",
      "$750K raise · 18 months · 3 milestones",
    ],
  },
];

export default function StartHere() {
  useEffect(() => {
    updatePageMetadata({
      title: "Start Here — Readiness OS by VaughnMartin",
      description: "Enterprise executive or investor — find your path into Readiness OS. The operating model layer that compresses 30-day mobilization cycles to 12 minutes.",
    });
  }, []);

  return (
    <PageLayout>
      <div style={{ background: "#fff", minHeight: "100vh" }}>

        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <div style={{
          background: NAVY,
          padding: "56px 0 64px",
          backgroundImage: [
            `radial-gradient(ellipse 900px 600px at -10% 0%, rgba(43,138,110,0.14) 0%, transparent 60%)`,
            `radial-gradient(ellipse 900px 600px at 110% 100%, rgba(201,168,76,0.10) 0%, transparent 60%)`,
          ].join(", "),
        }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px" }}>

            {/* Logo */}
            <div style={{ marginBottom: 48 }}>
              <VaughnMartinLogo variant="full" height={68} color="light" animated={false} />
            </div>

            {/* Headline */}
            <div style={{ maxWidth: 760 }}>
              <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.20em", textTransform: "uppercase", color: GOLD, marginBottom: 20 }}>
                Readiness OS · VaughnMartin
              </div>
              <h1 style={{ ...CG, fontSize: "clamp(38px, 5.5vw, 62px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, margin: "0 0 24px" }}>
                We redesign how work flows<br />in the age of AI.
              </h1>
              <p style={{ ...DM, fontSize: 18, color: "rgba(255,255,255,0.7)", lineHeight: 1.65, margin: "0 0 48px", maxWidth: 580 }}>
                Enterprise operating models were built before AI existed. Readiness OS rebuilds from first principles — pre-staged execution replaces real-time coordination. 30 days compressed to 12 minutes.
              </p>

              {/* Stats row */}
              <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
                {stats.map((s, i) => (
                  <div key={i}>
                    <div style={{ ...CG, fontSize: 32, fontWeight: 700, color: GOLD, lineHeight: 1 }}>{s.value}</div>
                    <div style={{ ...DM, fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 6, lineHeight: 1.4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── LIVE PROOF BANNER ───────────────────────────────────────────── */}
        <div style={{ background: GOLD, padding: "18px 0" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: NAVY, animation: "vm-pulse 2s ease-in-out infinite" }} />
              <span style={{ ...BC, fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: NAVY }}>
                Live proof — no login required
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <span style={{ ...DM, fontSize: 14, color: NAVY, lineHeight: 1.4 }}>
                Run the full 12-Minute Test Drive right now — 7 scenarios, full execution cycle
              </span>
              <Link href="/12-minute-experience">
                <button style={{
                  padding: "10px 24px", background: NAVY, border: "none", cursor: "pointer",
                  ...BC, fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: GOLD,
                  whiteSpace: "nowrap",
                }}>
                  Start Now →
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* ── TRACK SELECTOR ──────────────────────────────────────────────── */}
        <div style={{ padding: "80px 0", background: IVORY }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px" }}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD, marginBottom: 14 }}>
                Find Your Path
              </div>
              <h2 style={{ ...CG, fontSize: 36, fontWeight: 700, color: NAVY, margin: 0 }}>
                Two conversations. One platform.
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
              {tracks.map((track, i) => (
                <div key={i} style={{
                  background: "#fff",
                  borderTop: `4px solid ${track.accent}`,
                  padding: "48px 44px 44px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 0,
                }}>
                  <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.20em", textTransform: "uppercase", color: track.accent, marginBottom: 16 }}>
                    {track.audience}
                  </div>
                  <h3 style={{ ...CG, fontSize: 26, fontWeight: 700, color: NAVY, lineHeight: 1.25, marginBottom: 18 }}>
                    {track.headline}
                  </h3>
                  <p style={{ ...DM, fontSize: 14.5, color: "#374151", lineHeight: 1.7, marginBottom: 32 }}>
                    {track.body}
                  </p>

                  <ul style={{ margin: "0 0 36px", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                    {track.proof.map((p, j) => (
                      <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <span style={{ color: track.accent, fontWeight: 700, fontSize: 14, lineHeight: 1.4, flexShrink: 0 }}>→</span>
                        <span style={{ ...DM, fontSize: 13.5, color: "#374151", lineHeight: 1.45 }}>{p}</span>
                      </li>
                    ))}
                  </ul>

                  <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
                    <Link href={track.ctaPath}>
                      <button style={{
                        width: "100%", padding: "15px 24px",
                        background: track.accent === GOLD ? NAVY : NAVY,
                        border: "none", cursor: "pointer",
                        ...BC, fontSize: 13, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase",
                        color: track.accent,
                      }}>
                        {track.cta} →
                      </button>
                    </Link>
                    <Link href={track.secondaryPath} style={{
                      ...BC, fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                      color: "#6B7280", textDecoration: "none", textAlign: "center",
                      padding: "10px 0",
                      borderBottom: "1px solid rgba(10,15,46,0.10)",
                    }}>
                      {track.secondary}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── THESIS STATEMENT ────────────────────────────────────────────── */}
        <div style={{ background: NAVY, padding: "72px 0" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <div>
              <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD, marginBottom: 20 }}>
                The Thesis
              </div>
              <blockquote style={{ ...CG, fontSize: 28, fontWeight: 600, color: "#fff", lineHeight: 1.4, margin: "0 0 24px", fontStyle: "italic" }}>
                "The response is ready before the situation arrives."
              </blockquote>
              <p style={{ ...DM, fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: "0 0 32px" }}>
                Enterprise work was designed for a world without AI — committees, alignment cycles, and coordination delays exist because humans couldn't process information fast enough to act decisively. AI changed the constraint. Readiness OS rebuilds the operating model to match it.
              </p>
              <Link href="/how-it-executes" style={{
                ...BC, fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase",
                color: GOLD, textDecoration: "none", borderBottom: "1px solid rgba(201,168,76,0.4)", paddingBottom: 2,
              }}>
                See how the execution chain works →
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {[
                { label: "Preparation", body: "170 Readiness Protocols built before the situation arrives. Roles assigned. Tasks sequenced. Budget authorized.", color: GOLD },
                { label: "Readiness", body: "Continuous signal monitoring across 248+ data points. The system classifies the situation before the first call is made.", color: TEAL },
                { label: "Fearless", body: "Every organization that prepares for every situation it will face is no longer afraid of any situation they will face.", color: "#fff" },
              ].map((item, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.05)", borderLeft: `3px solid ${item.color}`, padding: "24px 28px" }}>
                  <div style={{ ...BC, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: item.color, marginBottom: 8 }}>
                    {item.label}
                  </div>
                  <p style={{ ...DM, fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, margin: 0 }}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── FOOTER CTA ──────────────────────────────────────────────────── */}
        <div style={{ padding: "56px 0", borderTop: `3px solid ${GOLD}`, background: IVORY }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px", textAlign: "center" }}>
            <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: NAVY, marginBottom: 12 }}>
              Ready to see the full platform?
            </div>
            <p style={{ ...DM, fontSize: 15, color: "#6B7280", marginBottom: 32 }}>
              The 12-Minute Test Drive is public and requires no login. Full platform access is through the Founding Partner Program.
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
              <Link href="/12-minute-experience">
                <button style={{
                  padding: "15px 36px", background: NAVY, border: "none", cursor: "pointer",
                  ...BC, fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD,
                }}>
                  Run the 12-Minute Test Drive
                </button>
              </Link>
              <Link href="/founding-partner-brief">
                <button style={{
                  padding: "15px 36px", background: "transparent",
                  border: `1px solid ${NAVY}`, cursor: "pointer",
                  ...BC, fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: NAVY,
                }}>
                  View Founding Partner Brief
                </button>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </PageLayout>
  );
}
