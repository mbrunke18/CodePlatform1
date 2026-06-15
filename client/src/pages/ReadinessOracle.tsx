import { Link } from 'wouter';
import { ArrowRight, Brain, Globe, Timer, Layers, Zap, Shield, TrendingUp, Eye } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BC: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };
const BW: React.CSSProperties = { fontFamily: "'Barlow', sans-serif" };

const FOUNDATION = [
  {
    icon: <Eye className="w-5 h-5" />,
    label: "Continuous Signal Detection",
    desc: "248+ sources monitored every 15 minutes. 231 trigger patterns across 9 strategic domains.",
    live: true,
  },
  {
    icon: <Layers className="w-5 h-5" />,
    label: "180 Pre-staged Readiness Protocols",
    desc: "Complete mobilization packages — tasks, briefs, budgets, stakeholders — ready before any trigger fires.",
    live: true,
  },
  {
    icon: <Zap className="w-5 h-5" />,
    label: "12-Minute Execution Loop",
    desc: "Trigger detected → executive authorizes → full organization executing. 30 days compressed to 12 minutes.",
    live: true,
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    label: "ADVANCE 2.0 — Closed-Loop Learning",
    desc: "Every activation generates a causal hypothesis. Proven improvements are applied back to Readiness Protocols automatically.",
    live: true,
  },
];

const ORACLE_CAPABILITIES = [
  {
    icon: <Brain className="w-6 h-6" />,
    title: "Living Organizational Digital Twin",
    phase: "Phase 1 — Founding Partner Co-Development",
    color: TEAL,
    desc: "A real-time, continuously maintained mirror of your organization — roles, decision rights, interdependencies, workloads, and cross-domain relationships. When a trigger fires, the system already knows exactly who owns what, who is available, and where the mobilization gaps are.",
    distinction: "No existing BCM, GRC, or agentic platform operates at this level of human + structural fidelity.",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Autonomous Strategic War Gaming",
    phase: "Phase 1 — Founding Partner Co-Development",
    color: GOLD,
    desc: "Thousands of forward simulations run continuously using your organizational data and external signals. The system identifies converging risk patterns before they hit your 231 trigger signatures — and drafts new protocols before the trigger fully materializes.",
    example: "\"Three converging signals suggest a 72% probability of a tariff-related disruption in 60 days. A pre-staged Readiness Protocol has been drafted with owners, comms, and budget reallocations. Approve or modify?\"",
    distinction: "Shifts the value proposition from 'we respond in 12 minutes' to 'the response was ready before the trigger was even a pattern.'",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Collective Readiness Intelligence",
    phase: "Phase 2 — Network Effect Module",
    color: TEAL,
    desc: "Anonymized learning across the entire Readiness OS customer base. Protocols improve not just from your activations, but from lessons across industries, trigger types, and execution outcomes. Strict privacy controls — no organizational data is shared, only anonymized pattern intelligence.",
    distinction: "Network effect moat: the readiness intelligence compounds with every new organization. No competitor can replicate this without the same customer base.",
  },
  {
    icon: <Timer className="w-6 h-6" />,
    title: "Executive Time Machine",
    phase: "Phase 2 — Network Effect Module",
    color: GOLD,
    desc: "One executive dashboard where leaders step into simulated futures. Activate any protocol in simulation and see projected financial, reputational, and operational outcomes in real time — before committing. Stress-test your organization's readiness against any scenario in the 231-trigger library.",
    distinction: "Turns pre-staging from a preparation activity into a continuous strategic advantage. Executives don't just respond — they rehearse domination.",
  },
];

export default function ReadinessOracle() {
  return (
    <PageLayout
      title="Readiness Oracle — Strategic Foresight Engine | VaughnMartin"
      description="The next layer of organizational readiness infrastructure — being co-developed with Founding Partners. From 12-minute response to pre-trigger preparedness."
    >
      <div style={{ background: "#fff" }}>

        {/* ── HERO ───────────────────────────────────────────────────────────── */}
        <section style={{ background: NAVY, padding: "80px 48px 72px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -120, right: -120, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(43,138,110,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -80, left: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

          <div style={{ maxWidth: 860, margin: "0 auto", position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
              <div style={{ width: 32, height: 1, background: GOLD }} />
              <span style={{ ...BC, fontSize: 10, fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: GOLD }}>Readiness Oracle · Strategic Foresight Engine</span>
              <div style={{ width: 32, height: 1, background: GOLD }} />
            </div>

            <h1 style={{ ...CG, fontSize: "clamp(36px,5vw,62px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 24 }}>
              The response was ready<br />
              <em style={{ color: GOLD }}>before the trigger was even a pattern.</em>
            </h1>

            <p style={{ ...BW, fontSize: 16, color: "rgba(240,237,228,0.72)", lineHeight: 1.8, maxWidth: 640, marginBottom: 40 }}>
              Readiness OS already compresses 30-day mobilization cycles to 12 minutes. The next layer goes further — anticipating, war-gaming, and pre-staging responses to risks that haven't yet triggered. Being co-developed exclusively with Founding Partners.
            </p>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" as const }}>
              <Link href="/request-access">
                <span style={{ ...BC, display: "inline-flex", alignItems: "center", gap: 8, background: GOLD, color: NAVY, fontWeight: 800, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" as const, padding: "14px 28px", cursor: "pointer", textDecoration: "none" }}>
                  Apply for Founding Partner Access <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
              <Link href="/foresight-radar">
                <span style={{ ...BC, display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "rgba(240,237,228,0.8)", fontWeight: 700, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" as const, padding: "14px 28px", border: "1px solid rgba(201,168,76,0.3)", cursor: "pointer", textDecoration: "none" }}>
                  See Foresight Radar Live
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── THE SHIFT ─────────────────────────────────────────────────────── */}
        <section style={{ background: "#F8F7F4", padding: "48px 48px 40px", borderBottom: "2px solid #E8E4DC" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0" style={{ border: "1px solid #E8E4DC" }}>
              {[
                { label: "Traditional Enterprise", value: "30 days", sub: "to mobilize after a trigger fires", strike: true, color: "#9CA3AF" },
                { label: "Readiness OS Today", value: "12 minutes", sub: "trigger to full team executing", strike: false, color: TEAL },
                { label: "Readiness Oracle", value: "Pre-trigger", sub: "response staged before the pattern emerges", strike: false, color: GOLD },
              ].map((s, i) => (
                <div key={i} style={{ padding: "28px 24px", borderRight: i < 2 ? "1px solid #E8E4DC" : "none", borderTop: `3px solid ${s.color}`, background: i === 2 ? NAVY : "#fff", textAlign: "center" as const }}>
                  <div style={{ ...BC, fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: i === 2 ? "rgba(201,168,76,0.7)" : "#9CA3AF", marginBottom: 10 }}>{s.label}</div>
                  <div style={{ ...CG, fontSize: 32, fontWeight: 700, color: s.strike ? "#9CA3AF" : s.color, textDecoration: s.strike ? "line-through" : "none", lineHeight: 1, marginBottom: 6 }}>{s.value}</div>
                  <div style={{ ...BW, fontSize: 12, color: i === 2 ? "rgba(240,237,228,0.6)" : "#6B7280", lineHeight: 1.5 }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOUNDATION: WHAT EXISTS TODAY ─────────────────────────────────── */}
        <section style={{ background: "#fff", padding: "64px 48px", borderBottom: "1px solid #E8E4DC" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <div style={{ marginBottom: 40 }}>
              <p style={{ ...BC, fontSize: 10, fontWeight: 800, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: TEAL, marginBottom: 12 }}>The Foundation — Live Today</p>
              <h2 style={{ ...CG, fontSize: "clamp(24px,3vw,36px)", fontWeight: 700, color: NAVY, lineHeight: 1.2, marginBottom: 12 }}>
                The Oracle builds on infrastructure already running.
              </h2>
              <p style={{ ...BW, fontSize: 14, color: "#6B7280", lineHeight: 1.75, maxWidth: 580 }}>
                The four live capabilities below are not prerequisites — they are the data foundation and execution backbone the Oracle operates on top of.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FOUNDATION.map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 16, padding: "20px 22px", border: "1px solid #E8E4DC", background: "#F8F7F4", alignItems: "flex-start" }}>
                  <div style={{ width: 36, height: 36, background: "rgba(43,138,110,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: TEAL }}>
                    {f.icon}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <div style={{ ...BC, fontSize: 12, fontWeight: 700, color: NAVY, letterSpacing: "0.03em" }}>{f.label}</div>
                      <span style={{ ...BC, fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: TEAL, background: "rgba(43,138,110,0.10)", padding: "2px 7px" }}>LIVE</span>
                    </div>
                    <p style={{ ...BW, fontSize: 12, color: "#6B7280", margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ORACLE CAPABILITIES ───────────────────────────────────────────── */}
        <section style={{ background: "#F8F7F4", padding: "72px 48px" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <div style={{ marginBottom: 48 }}>
              <p style={{ ...BC, fontSize: 10, fontWeight: 800, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 12 }}>Being Co-Developed with Founding Partners</p>
              <h2 style={{ ...CG, fontSize: "clamp(28px,3.5vw,42px)", fontWeight: 700, color: NAVY, lineHeight: 1.15, marginBottom: 16 }}>
                The four capabilities that don't exist anywhere in the enterprise market today.
              </h2>
              <p style={{ ...BW, fontSize: 14, color: "#6B7280", lineHeight: 1.75, maxWidth: 600 }}>
                Each Founding Partner co-shapes these capabilities through their activations, feedback, and real-world readiness patterns. First cohort gains permanent early-access status.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column" as const, gap: 24 }}>
              {ORACLE_CAPABILITIES.map((cap, i) => (
                <div key={i} style={{ background: "#fff", border: "1px solid #E8E4DC", borderLeft: `4px solid ${cap.color}`, padding: "32px 36px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
                    <div style={{ width: 44, height: 44, background: cap.color === GOLD ? "rgba(201,168,76,0.10)" : "rgba(43,138,110,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: cap.color }}>
                      {cap.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6, flexWrap: "wrap" as const }}>
                        <h3 style={{ ...CG, fontSize: 22, fontWeight: 700, color: NAVY, margin: 0 }}>{cap.title}</h3>
                        <span style={{ ...BC, fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: cap.color, background: cap.color === GOLD ? "rgba(201,168,76,0.10)" : "rgba(43,138,110,0.10)", padding: "3px 9px" }}>{cap.phase}</span>
                      </div>
                      <p style={{ ...BW, fontSize: 14, color: "#4B5563", lineHeight: 1.75, marginBottom: cap.example ? 14 : 16 }}>{cap.desc}</p>
                      {cap.example && (
                        <div style={{ background: "#F8F7F4", border: "1px solid #E8E4DC", padding: "12px 16px", marginBottom: 16 }}>
                          <p style={{ ...CG, fontSize: 13, fontStyle: "italic", color: NAVY, margin: 0, lineHeight: 1.6 }}>{cap.example}</p>
                        </div>
                      )}
                      <p style={{ ...BW, fontSize: 12, color: TEAL, fontWeight: 600, margin: 0, lineHeight: 1.5 }}>{cap.distinction}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── THE IMMUNE SYSTEM FRAMING ─────────────────────────────────────── */}
        <section style={{ background: NAVY, padding: "72px 48px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.10) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center", position: "relative" }}>
            <p style={{ ...BC, fontSize: 10, fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 20 }}>What it becomes</p>
            <blockquote style={{ ...CG, fontSize: "clamp(22px,3vw,34px)", fontWeight: 700, color: "#fff", lineHeight: 1.3, fontStyle: "italic", marginBottom: 28 }}>
              "Your organization's immune system and chief strategist — always watching, always preparing, always ready to execute. With human oversight at every decision point."
            </blockquote>
            <p style={{ ...BW, fontSize: 14, color: "rgba(240,237,228,0.6)", lineHeight: 1.8, maxWidth: 560, margin: "0 auto 16px" }}>
              The 12-minute claim starts to feel conservative — because by the time the trigger fires, the heavy lifting is already done. The question shifts from <em style={{ color: "rgba(240,237,228,0.85)" }}>"how do we respond?"</em> to <em style={{ color: GOLD }}>"which version of the pre-staged response do we authorize?"</em>
            </p>
          </div>
        </section>

        {/* ── WHY FOUNDING PARTNERS ─────────────────────────────────────────── */}
        <section style={{ background: "#fff", padding: "72px 48px", borderTop: "2px solid #E8E4DC" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <div style={{ marginBottom: 40, textAlign: "center" as const }}>
              <p style={{ ...BC, fontSize: 10, fontWeight: 800, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 12 }}>Why this requires Founding Partners</p>
              <h2 style={{ ...CG, fontSize: "clamp(26px,3.5vw,40px)", fontWeight: 700, color: NAVY, lineHeight: 1.2, marginBottom: 0 }}>
                You don't just get early access. You shape the intelligence.
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  n: "01",
                  title: "Your Activations Feed the Model",
                  body: "Every Readiness Protocol activation you complete contributes to the pattern library the Oracle learns from. First cohort organizations build the deepest signal history and receive the most accurate forward projections.",
                },
                {
                  n: "02",
                  title: "Your Feedback Shapes the Protocols",
                  body: "The Autonomous War Gaming module is only as accurate as the organizational patterns it learns from. Founding Partners define what good looks like — and their inputs become the calibration baseline for all future customers.",
                },
                {
                  n: "03",
                  title: "Permanent Early-Access Status",
                  body: "The Oracle is not a separate product — it is a deepening of the infrastructure you've already built. Founding Partners receive all Oracle capabilities as part of their original engagement, not as an upsell.",
                },
              ].map((item, i) => (
                <div key={i} style={{ padding: "28px 24px", border: "1px solid #E8E4DC", borderTop: `3px solid ${GOLD}` }}>
                  <div style={{ ...BC, fontSize: 28, fontWeight: 800, color: "rgba(201,168,76,0.25)", lineHeight: 1, marginBottom: 12 }}>{item.n}</div>
                  <h3 style={{ ...CG, fontSize: 18, fontWeight: 700, color: NAVY, marginBottom: 10, lineHeight: 1.3 }}>{item.title}</h3>
                  <p style={{ ...BW, fontSize: 13, color: "#6B7280", margin: 0, lineHeight: 1.7 }}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <section style={{ background: "#F8F7F4", padding: "64px 48px", borderTop: "2px solid #E8E4DC" }}>
          <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" as const }}>
            <p style={{ ...BC, fontSize: 10, fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 16 }}>Founding Partner Program — 90-Day Engagement</p>
            <h2 style={{ ...CG, fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, color: NAVY, lineHeight: 1.15, marginBottom: 20 }}>
              The first cohort builds the infrastructure no one else can replicate.
            </h2>
            <p style={{ ...BW, fontSize: 14, color: "#6B7280", lineHeight: 1.8, marginBottom: 36 }}>
              Priority given to enterprise organizations with a C-level sponsor, active Microsoft or enterprise stack, and at least one strategic trigger in the last 18 months they weren't fully ready for. $75,000 fully credited toward your enterprise agreement.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" as const }}>
              <Link href="/request-access">
                <span style={{ ...BC, display: "inline-flex", alignItems: "center", gap: 8, background: NAVY, color: "#fff", fontWeight: 800, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" as const, padding: "16px 32px", cursor: "pointer", textDecoration: "none" }}>
                  Apply for Founding Partner Access <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
              <Link href="/the-proof">
                <span style={{ ...BC, display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: NAVY, fontWeight: 700, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" as const, padding: "16px 32px", border: "1px solid #E8E4DC", cursor: "pointer", textDecoration: "none" }}>
                  See Why No Tool Does This
                </span>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </PageLayout>
  );
}
