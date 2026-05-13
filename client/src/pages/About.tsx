import { useEffect } from "react";
import { Link } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import martinHeadshot from "@/assets/martin-brunke.jpg";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";
const BORDER = "#E8E4DC";

const GEO: React.CSSProperties = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const DM: React.CSSProperties  = { fontFamily: "'Barlow', Arial, sans-serif" };
const BC: React.CSSProperties  = { fontFamily: "'Barlow Condensed', sans-serif" };

const VALIDATORS = [
  {
    name: "Jim Highsmith",
    credential: "Co-Author, Agile Manifesto",
    note: "Independent validation of the preparedness-first thesis and protocol architecture.",
  },
  {
    name: "Dr. Kerry Huang",
    credential: "Fortune 50 AVP · 408-Firm Governance Study · ESI Top 1% Researcher",
    note: "Credited the Readiness OS framework in a Forbes piece and shared to his Fortune 50 network.",
  },
  {
    name: "Scott DeJarnette, PhD",
    credential: "Cybersecurity Strategist · Triple CCIE",
    note: "Validated the trigger-response architecture against enterprise security infrastructure.",
  },
  {
    name: "Dr. Kulneet Suri",
    credential: "Behavioral Scientist · Harvard / Oxford",
    note: "Validated the human authorization model — AI monitors, executives decide.",
  },
  {
    name: "BCG · 2026 AI-First Org Study",
    credential: "Strelczyk, Kataeva, Hilberath, Beauchene, Kelley",
    note: "Institutional research finding that 95% of enterprise AI investment fails at the operating model layer — the exact gap Readiness OS addresses.",
  },
];

const CAREER = [
  { org: "Ford Motor Company", context: "Supply disruption coordination — watched the mobilization failure repeat across divisions" },
  { org: "Lockheed Martin", context: "Regulatory cycle response — weeks spent figuring out who should be in the room" },
  { org: "Charles Schwab", context: "Market event response — the same coordination failure, regardless of leadership quality" },
];

export default function About() {
  useEffect(() => {
    document.title = "Martin Brunke — Founder | VaughnMartin Readiness OS";
  }, []);

  return (
    <PageLayout>
      {/* Hero */}
      <section style={{ background: NAVY, padding: "96px 0 72px", borderBottom: `1px solid rgba(201,168,76,0.15)` }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 56, alignItems: "flex-start" }}>
            {/* Headshot */}
            <div style={{ flexShrink: 0 }}>
              <img
                src={martinHeadshot}
                alt="Martin Brunke — CEO & Founder, VaughnMartin"
                style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", objectPosition: "center top", display: "block", border: `2px solid rgba(201,168,76,0.3)` }}
              />
            </div>

            {/* Name + bio */}
            <div>
              <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD, marginBottom: 16 }}>
                Founder
              </div>
              <h1 style={{ ...GEO, fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 700, color: "#fff", lineHeight: 1.05, margin: "0 0 8px" }}>
                Martin Brunke
              </h1>
              <div style={{ ...BC, fontSize: 14, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: GOLD, marginBottom: 28 }}>
                CEO & Founder · VaughnMartin Inc.
              </div>
              <p style={{ ...DM, fontSize: "clamp(15px,1.4vw,17px)", color: "rgba(255,255,255,0.72)", lineHeight: 1.75, margin: "0 0 24px" }}>
                Twenty years inside enterprise organizations watching the same failure repeat across seven industries. Five years on the practice field at Stanford watching the exact opposite — a pre-staged response deploy in 40 seconds under full pressure.
              </p>
              <p style={{ ...GEO, fontSize: "clamp(16px,1.3vw,20px)", fontStyle: "italic", color: GOLD, lineHeight: 1.6, margin: 0 }}>
                "The infrastructure existed on the practice field. Nobody had built it for the boardroom."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Origin */}
      <section style={{ background: "#fff", padding: "72px 0", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD, marginBottom: 20 }}>
            The Origin
          </div>
          <h2 style={{ ...GEO, fontSize: "clamp(26px,3vw,38px)", fontWeight: 700, color: NAVY, lineHeight: 1.15, margin: "0 0 28px" }}>
            Twenty years of the same failure.<br />Five years watching it solved.
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
            <div>
              <p style={{ ...DM, fontSize: 15, color: "#444", lineHeight: 1.8, margin: "0 0 20px" }}>
                Across Ford, Lockheed, and Charles Schwab — across supply disruptions, regulatory cycles, and market events — the same coordination failure appeared every time. A strategic trigger fires. The organization spends weeks figuring out who should be in the room before execution begins.
              </p>
              <p style={{ ...DM, fontSize: 15, color: "#444", lineHeight: 1.8, margin: 0 }}>
                Not a strategy failure. A mobilization failure. Every time.
              </p>

              <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 16 }}>
                {CAREER.map(({ org, context }) => (
                  <div key={org} style={{ borderLeft: `3px solid ${GOLD}`, paddingLeft: 16 }}>
                    <div style={{ ...BC, fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: NAVY, marginBottom: 4 }}>{org}</div>
                    <div style={{ ...DM, fontSize: 13, color: "#666", lineHeight: 1.55 }}>{context}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ background: NAVY, padding: "32px 28px" }}>
                <div style={{ ...BC, fontSize: 11, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 16 }}>
                  Stanford · Practice Field
                </div>
                <p style={{ ...DM, fontSize: 15, color: "rgba(255,255,255,0.78)", lineHeight: 1.75, margin: "0 0 20px" }}>
                  Five years coaching football at Stanford — watching championship programs deploy a pre-staged response to a known trigger in 40 seconds across 11 coordinated roles. Same pressure as any Fortune 1000 board room. Completely different architecture.
                </p>
                <p style={{ ...GEO, fontSize: 17, fontStyle: "italic", color: GOLD, lineHeight: 1.6, margin: 0 }}>
                  "The difference wasn't the people. It was the preparation infrastructure."
                </p>
              </div>

              <div style={{ marginTop: 2, background: IVORY, padding: "24px 28px", borderLeft: `3px solid ${TEAL}` }}>
                <div style={{ ...DM, fontSize: 13, color: "#555", lineHeight: 1.65 }}>
                  Readiness OS is that infrastructure — built for the boardroom. The active platform build began in 2023. The platform shipped to production in January 2026. Built alongside full-time employment, over nights and weekends, for three years.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials strip */}
      <section style={{ background: IVORY, padding: "56px 0", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
            {[
              { label: "Fortune 1000 Experience", value: "20 years", sub: "Across 7 industries" },
              { label: "Stanford Coaching Staff", value: "5 years", sub: "Championship football program" },
              { label: "Platform in Production", value: "Jan 2026", sub: "193 pages · Full-stack · Live" },
            ].map(({ label, value, sub }) => (
              <div key={label} style={{ background: "#fff", padding: "28px 24px", borderTop: `2px solid ${GOLD}` }}>
                <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#999", marginBottom: 8 }}>{label}</div>
                <div style={{ ...GEO, fontSize: 36, fontWeight: 700, color: NAVY, lineHeight: 1, marginBottom: 6 }}>{value}</div>
                <div style={{ ...DM, fontSize: 12, color: "#888" }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Independent Validation */}
      <section style={{ background: "#fff", padding: "72px 0", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD, marginBottom: 20 }}>
            Independent Validation
          </div>
          <h2 style={{ ...GEO, fontSize: "clamp(24px,2.8vw,36px)", fontWeight: 700, color: NAVY, lineHeight: 1.15, margin: "0 0 40px", maxWidth: 560 }}>
            The thesis has been reviewed and validated independently.
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {VALIDATORS.map(({ name, credential, note }) => (
              <div key={name} style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 0, borderTop: `1px solid ${BORDER}`, padding: "24px 0" }}>
                <div style={{ paddingRight: 32 }}>
                  <div style={{ ...DM, fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 4 }}>{name}</div>
                  <div style={{ ...DM, fontSize: 11, color: TEAL, lineHeight: 1.45 }}>{credential}</div>
                </div>
                <div style={{ ...DM, fontSize: 13, color: "#555", lineHeight: 1.7, paddingTop: 2 }}>{note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Co-founder search */}
      <section style={{ background: NAVY, padding: "72px 0", borderBottom: `1px solid rgba(255,255,255,0.07)` }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            <div>
              <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD, marginBottom: 20 }}>
                Building the Team
              </div>
              <h2 style={{ ...GEO, fontSize: "clamp(24px,2.8vw,36px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, margin: "0 0 20px" }}>
                Seeking a commercial co-founder.
              </h2>
              <p style={{ ...DM, fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, margin: "0 0 28px" }}>
                The platform is built and live. The category is defined. The gap is the first Fortune 1000 pilot introduction — the moment where thesis becomes signed contract.
              </p>
              <p style={{ ...DM, fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, margin: 0 }}>
                The right co-founder has enterprise sales DNA, has sold into C-suites before, and understands that what we're selling isn't software — it's an operating model replacement. Equity-based. 10–15% co-founder pool reserved.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "What's built", value: "193-page platform, live in production" },
                { label: "What's needed", value: "First Fortune 1000 signed contract" },
                { label: "Target sector", value: "Gaming · Finance · Manufacturing" },
                { label: "First ACV", value: "$75K · 90-day Founding Partner engagement" },
              ].map(({ label, value }) => (
                <div key={label} style={{ padding: "16px 20px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.68)", marginBottom: 4 }}>{label}</div>
                  <div style={{ ...DM, fontSize: 13, color: "#fff", fontWeight: 500 }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: IVORY, padding: "64px 0" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 32px", display: "flex", flexDirection: "column" as const, alignItems: "flex-start", gap: 32 }}>
          <div>
            <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD, marginBottom: 16 }}>
              The Platform
            </div>
            <h2 style={{ ...GEO, fontSize: "clamp(24px,2.8vw,36px)", fontWeight: 700, color: NAVY, lineHeight: 1.15, margin: "0 0 16px" }}>
              The response is ready before the trigger fires.
            </h2>
            <p style={{ ...DM, fontSize: 15, color: "#555", lineHeight: 1.7, maxWidth: 560, margin: 0 }}>
              170 Readiness Protocols. 221 trigger patterns monitored. 12-minute execution. Live in production at vaughnmartin.com — run the simulation before the meeting ends.
            </p>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" as const }}>
            <Link
              href="/12-minute-experience"
              style={{ ...DM, background: GOLD, color: NAVY, fontWeight: 700, fontSize: 13, padding: "14px 32px", textDecoration: "none", letterSpacing: "0.07em", textTransform: "uppercase" as const }}
            >
              Run the 12-Minute Test Drive →
            </Link>
            <Link
              href="/contact"
              style={{ ...DM, background: "transparent", color: NAVY, fontWeight: 600, fontSize: 13, padding: "14px 28px", textDecoration: "none", border: `1px solid ${NAVY}` }}
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
