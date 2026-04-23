import PageLayout from "@/components/layout/PageLayout";
import { Link } from "wouter";
import deskImg from "@/assets/images/executive-desk-minimal.png";

const NAVY  = "#0A0F2E";
const GOLD  = "#C9A84C";
const TEAL  = "#2B8A6E";
const IVORY = "#F0EDE4";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const DM: React.CSSProperties = { fontFamily: "'Barlow Condensed', 'DM Sans', sans-serif" };

export default function Team() {
  return (
    <PageLayout>
      <div style={{ background: "#fff", minHeight: "100vh" }}>

        {/* ── Hero ───────────────────────────────────────────────────────────── */}
        <section style={{ background: NAVY, position: "relative", overflow: "hidden" }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${deskImg})`,
            backgroundSize: "cover", backgroundPosition: "center right",
            opacity: 0.14, pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(201,168,76,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.06) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }} />
          <div style={{ maxWidth: 960, margin: "0 auto", padding: "96px 32px 80px", position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
              <div style={{ height: 1, width: 28, background: GOLD }} />
              <span style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: GOLD }}>
                The Team
              </span>
              <div style={{ height: 1, flex: 1, maxWidth: 120, background: `${GOLD}44` }} />
            </div>
            <h1 style={{ ...CG, fontSize: "clamp(42px,5vw,68px)", fontWeight: 700, color: "#fff", lineHeight: 1.05, margin: "0 0 28px" }}>
              Built by operators.<br />
              <span style={{ color: GOLD }}>Grounded in research.</span>
            </h1>
            <p style={{ ...DM, fontSize: "clamp(15px,1.4vw,18px)", color: "rgba(255,255,255,0.62)", lineHeight: 1.75, maxWidth: 600, margin: 0 }}>
              VaughnMartin was built by someone who understood that execution failure is a system problem, not a talent problem — and that the system could be rebuilt.
            </p>
          </div>
        </section>

        {/* ── Founder ────────────────────────────────────────────────────────── */}
        <section style={{ padding: "96px 32px", maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 72, alignItems: "start" }}>
            <div>
              <div style={{
                width: "100%", aspectRatio: "3/4", background: `${NAVY}08`,
                border: `1px solid ${NAVY}14`, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "flex-end", padding: "24px",
                position: "relative", overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", inset: 0,
                  background: `linear-gradient(160deg, ${NAVY}08 0%, ${TEAL}11 100%)`,
                }} />
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, bottom: "30%",
                  background: `${NAVY}06`,
                  borderBottom: `1px solid ${GOLD}18`,
                }} />
                <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: GOLD, margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ ...CG, fontSize: 24, fontWeight: 700, color: NAVY }}>MB</span>
                  </div>
                  <div style={{ ...CG, fontSize: 15, fontWeight: 700, color: NAVY }}>Martin Brunke</div>
                  <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: TEAL, marginTop: 4 }}>Founder & CEO</div>
                </div>
              </div>

              <div style={{ marginTop: 24, padding: "20px 0", borderTop: `1px solid ${NAVY}12` }}>
                {[
                  { label: "Company", value: "VaughnMartin" },
                  { label: "Category", value: "Enterprise Readiness OS" },
                  { label: "Market", value: "Fortune 1000" },
                  { label: "Founded", value: "2023" },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${NAVY}08` }}>
                    <span style={{ ...DM, fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: `${NAVY}55` }}>{label}</span>
                    <span style={{ ...DM, fontSize: 13, fontWeight: 700, color: NAVY }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
                <div style={{ height: 1, width: 24, background: GOLD }} />
                <span style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: GOLD }}>Founder</span>
              </div>

              <h2 style={{ ...CG, fontSize: "clamp(28px,3vw,40px)", fontWeight: 700, color: NAVY, lineHeight: 1.1, margin: "0 0 28px" }}>
                The company carries a name because the work carries a standard.
              </h2>

              <div style={{ borderLeft: `2px solid ${GOLD}50`, paddingLeft: 24, marginBottom: 32 }}>
                <p style={{ ...CG, fontSize: 19, fontStyle: "italic", color: `${NAVY}90`, lineHeight: 1.7, margin: 0 }}>
                  "My father put me in shoulder pads for the first time in the third grade. On the first day, he looked at me and said four things: prepare, practice, perform fearless — and never give up."
                </p>
              </div>

              <p style={{ fontSize: 16, color: `${NAVY}80`, lineHeight: 1.8, marginBottom: 20, fontWeight: 500 }}>
                Those four words are the origin of this company. Prepare the response before the trigger fires. Practice before the pressure arrives. Perform without hesitation when the moment comes. The company is named VaughnMartin because it's named for the family that handed over that framework — and for the father whose name deserved to be carried forward.
              </p>

              <p style={{ fontSize: 16, color: `${NAVY}80`, lineHeight: 1.8, marginBottom: 20, fontWeight: 500 }}>
                VaughnMartin exists because enterprise organizations were losing billions to a structural problem that had nothing to do with strategy or talent — and everything to do with the absence of pre-staged execution infrastructure. The operating model Fortune 1000s run today was designed before AI existed. The preparation cycle was the missing layer.
              </p>

              <p style={{ fontSize: 16, color: `${NAVY}80`, lineHeight: 1.8, marginBottom: 40, fontWeight: 500 }}>
                Readiness OS is not a software company that built a platform. It's an operating model company that understands what preparation actually produces — and built the infrastructure to make it available before the trigger fires.
              </p>

              <Link href="/founder-story">
                <span style={{
                  ...DM, display: "inline-flex", alignItems: "center", gap: 8,
                  fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                  color: NAVY, textDecoration: "none", borderBottom: `1px solid ${GOLD}`,
                  paddingBottom: 2,
                }}>
                  Read the full founder story →
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Research Anchor ─────────────────────────────────────────────────── */}
        <section style={{ background: IVORY, padding: "80px 32px" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 48 }}>
              <div style={{ height: 1, width: 28, background: GOLD }} />
              <span style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: GOLD }}>Research Foundation</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 64, alignItems: "start" }}>
              <div>
                <div style={{
                  aspectRatio: "1", background: `${NAVY}05`, border: `1px solid ${NAVY}14`,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  padding: 24,
                }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: TEAL, margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ ...CG, fontSize: 22, fontWeight: 700, color: "#fff" }}>KH</span>
                  </div>
                  <div style={{ ...CG, fontSize: 15, fontWeight: 700, color: NAVY, textAlign: "center" }}>Dr. Kerry Huang</div>
                  <div style={{ ...DM, fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: TEAL, marginTop: 6, textAlign: "center" }}>Research Collaborator</div>
                  <div style={{ marginTop: 20, width: "100%" }}>
                    {[
                      "ESI Top 1% Researcher",
                      "Forbes Business Council",
                      "Fortune 50 AVP",
                      "408-Firm Research Study",
                    ].map(cred => (
                      <div key={cred} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: `1px solid ${NAVY}08` }}>
                        <div style={{ width: 4, height: 4, background: GOLD, flexShrink: 0 }} />
                        <span style={{ ...DM, fontSize: 11, fontWeight: 600, color: `${NAVY}70` }}>{cred}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h2 style={{ ...CG, fontSize: "clamp(26px,2.8vw,38px)", fontWeight: 700, color: NAVY, lineHeight: 1.1, margin: "0 0 24px" }}>
                  The research that anchors the platform.
                </h2>

                <div style={{ borderLeft: `2px solid ${TEAL}50`, paddingLeft: 24, marginBottom: 28 }}>
                  <p style={{ ...CG, fontSize: 18, fontStyle: "italic", color: `${NAVY}90`, lineHeight: 1.7, margin: 0 }}>
                    "Technology alone has zero statistical relationship with collaboration improvement. Zero. Not weak. Not marginal. Zero. Technology doesn't build a moat. Capability and governance do."
                  </p>
                  <p style={{ ...DM, fontSize: 11, fontWeight: 700, color: `${NAVY}55`, marginTop: 12, letterSpacing: "0.08em" }}>
                    Dr. Kerry Huang — 408-firm study
                  </p>
                </div>

                <p style={{ fontSize: 16, color: `${NAVY}75`, lineHeight: 1.8, marginBottom: 16, fontWeight: 500 }}>
                  Dr. Huang's research across 408 manufacturing firms establishes the intellectual foundation of Readiness OS: preparation produces ownership, and ownership is an artifact — not a mindset. The platform produces that artifact at every activation through the acknowledgment step.
                </p>

                <p style={{ fontSize: 16, color: `${NAVY}75`, lineHeight: 1.8, fontWeight: 500 }}>
                  His work provides the independent empirical backing for VaughnMartin's core claim: the competitor can buy the platform. They cannot buy the accumulated decision logic embedded in the preparation phase.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Building the team ───────────────────────────────────────────────── */}
        <section style={{ background: NAVY, padding: "80px 32px", position: "relative", overflow: "hidden" }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(201,168,76,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.06) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }} />
          <div style={{ maxWidth: 960, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                  <div style={{ height: 1, width: 24, background: GOLD }} />
                  <span style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: GOLD }}>Building Now</span>
                </div>
                <h2 style={{ ...CG, fontSize: "clamp(28px,3vw,42px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, margin: "0 0 20px" }}>
                  We are building the founding team.
                </h2>
                <p style={{ ...DM, fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.75 }}>
                  VaughnMartin is at the stage where the founding team is being assembled. If you are an enterprise operator who has felt the cost of slow mobilization firsthand, we want to talk.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { role: "VP of Enterprise Sales", focus: "Fortune 1000 direct sales — CISO, COO, Chief Strategy Officer" },
                  { role: "Head of Customer Success", focus: "Pilot activation through to enterprise renewal" },
                  { role: "Enterprise Solutions Engineer", focus: "Microsoft stack integration — Teams, Copilot, Entra" },
                  { role: "Founding Designer", focus: "Product and marketing design — system-level thinking" },
                ].map(({ role, focus }) => (
                  <div key={role} style={{
                    padding: "20px 24px",
                    border: `1px solid rgba(201,168,76,0.18)`,
                    background: "rgba(255,255,255,0.03)",
                    display: "flex", flexDirection: "column", gap: 6,
                  }}>
                    <div style={{ ...DM, fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "0.04em" }}>{role}</div>
                    <div style={{ ...DM, fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>{focus}</div>
                  </div>
                ))}
                <a
                  href="mailto:team@vaughnmartin.com"
                  style={{
                    ...DM, display: "inline-flex", alignItems: "center", justifyContent: "center",
                    gap: 8, marginTop: 8,
                    background: GOLD, color: NAVY, fontWeight: 700, fontSize: 12,
                    letterSpacing: "0.12em", textTransform: "uppercase", padding: "15px 32px",
                    textDecoration: "none",
                  }}
                >
                  Reach Out →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────────────── */}
        <section style={{ padding: "80px 32px", textAlign: "center", borderTop: `1px solid ${NAVY}12` }}>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <div style={{ ...CG, fontSize: "clamp(26px,3vw,38px)", fontWeight: 700, color: NAVY, marginBottom: 16 }}>
              The response is ready before the trigger fires.
            </div>
            <p style={{ ...DM, fontSize: 16, color: `${NAVY}60`, lineHeight: 1.7, marginBottom: 36, fontWeight: 500 }}>
              See what 12 minutes looks like when the preparation is already done.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/12-minute-experience">
                <span style={{
                  ...DM, display: "inline-flex", background: NAVY, color: "#fff",
                  fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                  padding: "15px 36px", textDecoration: "none",
                }}>
                  12-Minute Experience →
                </span>
              </Link>
              <Link href="/investors">
                <span style={{
                  ...DM, display: "inline-flex", background: "transparent", color: NAVY,
                  border: `1px solid ${NAVY}30`,
                  fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                  padding: "15px 32px", textDecoration: "none",
                }}>
                  Investor Overview
                </span>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </PageLayout>
  );
}
