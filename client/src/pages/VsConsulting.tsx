import { useEffect, CSSProperties } from 'react';
import { useLocation } from 'wouter';
import { updatePageMetadata } from '@/lib/seo';
import PageLayout from "@/components/layout/PageLayout";
import { Check, X, ArrowRight } from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";
const CG: CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

const COMPARISON_ROWS = [
  { dimension: "Cost", consulting: "$300K–$500K one-time", executionOs: "$250K–$750K+/year · $75K Founding Partner entry" },
  { dimension: "Readiness Protocols", consulting: "5–10 custom PDFs", executionOs: "180 pre-built + unlimited custom" },
  { dimension: "Format", consulting: "Static documents", executionOs: "Live, executable platform" },
  { dimension: "Activation", consulting: "Manual — find the PDF, read it, interpret it, convene", executionOs: "One-click. 12 minutes." },
  { dimension: "Decision rights", consulting: "Described in prose", executionOs: "Mapped and enforced" },
  { dimension: "Role assignment", consulting: "Generic roles in a document", executionOs: "Named people, auto-notified" },
  { dimension: "Task tracking", consulting: "Not included", executionOs: "Real-time dashboard" },
  { dimension: "Signal detection", consulting: "Not included", executionOs: "248+ data points, continuous monitoring" },
  { dimension: "Time to coordinate", consulting: "Still 30 days", executionOs: "12 minutes" },
  { dimension: "Ongoing updates", consulting: "Refresh engagement: $150K+", executionOs: "Continuous — included in subscription" },
  { dimension: "Shelf life", consulting: "6–18 months before stale", executionOs: "Always current — continuously updated" },
];

export default function VsConsulting() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    updatePageMetadata({
      title: "Readiness OS vs. Management Consulting | VaughnMartin",
      description: "McKinsey charges $300K–$500K for Readiness Protocols that sit on a shelf. Readiness OS delivers 180 live, executable Readiness Protocols starting at $250K/year — with 12-minute activation, continuous signal monitoring, and a $75K Founding Partner entry credited 100% to Year 1.",
      ogTitle: "Why Not Consulting? Readiness OS vs. McKinsey, BCG, Bain",
      ogDescription: "Consultants deliver documents. Readiness OS delivers coordination. See the comparison.",
    });
  }, []);

  return (
    <PageLayout>

      {/* ── HERO ── */}
      <section style={{ background: NAVY, padding: "88px 48px 72px", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(201,168,76,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.07) 1px,transparent 1px)",
          backgroundSize: "48px 48px"
        }} />
        <div style={{ position: "absolute", left: -120, top: -160, width: 600, height: 600, borderRadius: 0, background: "radial-gradient(circle, rgba(43,138,110,0.18) 0%, transparent 65%)" }} />
        <div style={{ position: "absolute", right: -80, bottom: -200, width: 500, height: 500, borderRadius: 0, background: "radial-gradient(circle, rgba(201,168,76,0.14) 0%, transparent 65%)" }} />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 28, height: 2, background: GOLD }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>
              The Consulting Comparison
            </span>
            <div style={{ width: 28, height: 2, background: GOLD }} />
          </div>

          <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(36px,5vw,58px)", color: "#F0EDE4", lineHeight: 1.05, marginBottom: 24 }}>
            McKinsey tells you what to do.<br />
            <em style={{ fontStyle: "italic", color: GOLD }}>Readiness OS makes sure it happens.</em>
          </h1>

          <p style={{ fontSize: 18, color: "rgba(240,237,228,0.65)", maxWidth: 640, margin: "0 auto 20px", lineHeight: 1.65 }}>
            A startup to Fortune 500 company hires McKinsey to develop crisis response Readiness Protocols. Six months later, a crisis hits.
            Nobody can find the Readiness Protocols. The organization still takes 30 days to coordinate.
            The $500K investment sits on a shelf while the company scrambles.
          </p>

          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 40, padding: "12px 24px", border: "1px solid rgba(201,168,76,0.3)", background: "rgba(201,168,76,0.06)" }}>
            <div style={{ width: 5, height: 5, background: GOLD, flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: GOLD, letterSpacing: "0.06em" }}>
              McKinsey reacts after the trigger fires. Readiness OS eliminates the mobilization cycle before it begins.
            </span>
          </div>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => setLocation("/growth")}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: GOLD, color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", padding: "16px 32px", borderRadius: 0, border: "none", cursor: "pointer" }}
            >
              See Pricing <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
            <button
              onClick={() => setLocation("/try-demo")}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "rgba(240,237,228,0.8)", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", padding: "16px 32px", borderRadius: 0, border: "1px solid rgba(240,237,228,0.2)", cursor: "pointer" }}
            >
              See the Platform
            </button>
          </div>
        </div>
      </section>

      {/* ── THE SETUP ── */}
      <section style={{ background: "#fff", padding: "80px 48px", borderBottom: `1px solid #E8E4DC` }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>

            {/* What consulting delivers */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{ width: 8, height: 8, borderRadius: 0, background: "#EF4444" }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: "#EF4444" }}>What $500K in Consulting Gets You</span>
              </div>

              <div style={{ border: `1px solid #E8E4DC`, borderRadius: 0, overflow: "hidden" }}>
                {[
                  { phase: "Discovery & Assessment", delivers: "Interviews, current state analysis, gap assessment", cost: "$75K–$125K" },
                  { phase: "Readiness Protocol Development", delivers: "5–10 Readiness Protocols in PDF / PowerPoint format", cost: "$150K–$250K" },
                  { phase: "Implementation Support", delivers: "Training, rollout facilitation, change management", cost: "$75K–$150K" },
                ].map((row, i) => (
                  <div key={i} style={{ padding: "16px 20px", borderBottom: i < 2 ? `1px solid #F3F4F6` : "none", background: i % 2 === 0 ? "#fff" : "#FAFAF9" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: NAVY, marginBottom: 3 }}>{row.phase}</div>
                        <div style={{ fontSize: 12, color: "#6B7280" }}>{row.delivers}</div>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#EF4444", whiteSpace: "nowrap" as const, flexShrink: 0 }}>{row.cost}</div>
                    </div>
                  </div>
                ))}
                <div style={{ background: `rgba(239,68,68,0.06)`, borderTop: `2px solid rgba(239,68,68,0.2)`, padding: "14px 20px", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Total</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: "#DC2626" }}>$300K–$525K</span>
                </div>
              </div>

              <div style={{ marginTop: 16, padding: "16px 20px", background: `rgba(239,68,68,0.04)`, border: `1px solid rgba(239,68,68,0.12)`, borderRadius: 0 }}>
                <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
                  What you receive: PDF Readiness Protocols that live on SharePoint. Nobody reads them. Nobody can find them when it matters.
                </p>
              </div>
            </div>

            {/* What happens when a crisis hits */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{ width: 8, height: 8, borderRadius: 0, background: "#9CA3AF" }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: "#9CA3AF" }}>Six Months Later — A Crisis Hits</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
                {[
                  "Nobody can find the Readiness Protocols.",
                  "The Readiness Protocols are 200 pages — no one has time to read them.",
                  "Key people have changed roles since the Readiness Protocols were written.",
                  "The Readiness Protocols describe processes — they don't assign tasks.",
                  "The organization still takes 30 days to coordinate.",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", background: OFF, borderRadius: 0, border: `1px solid #E8E4DC` }}>
                    <X style={{ width: 14, height: 14, color: "#EF4444", flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 13, color: "#374151" }}>{item}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 16, padding: "16px 20px", background: `rgba(239,68,68,0.04)`, border: `1px solid rgba(239,68,68,0.12)`, borderRadius: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#DC2626", margin: 0 }}>
                  The $500K investment sits on a shelf while the organization scrambles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE COMPARISON TABLE ── */}
      <section style={{ background: OFF, padding: "80px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 24, height: 2, background: NAVY }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: NAVY }}>
                Side by Side
              </span>
              <div style={{ width: 24, height: 2, background: NAVY }} />
            </div>
            <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(28px,4vw,40px)", color: NAVY }}>
              The full comparison.
            </h2>
          </div>

          <div style={{ background: "#fff", border: `1px solid #E8E4DC`, borderRadius: 0, overflow: "hidden" }}>
            {/* Header */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: NAVY }}>
              <div style={{ padding: "16px 24px" }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(240,237,228,0.4)" }}>Dimension</span>
              </div>
              <div style={{ padding: "16px 24px", borderLeft: "1px solid rgba(240,237,228,0.1)" }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(239,68,68,0.7)" }}>McKinsey / BCG / Bain</span>
              </div>
              <div style={{ padding: "16px 24px", borderLeft: "1px solid rgba(240,237,228,0.1)", background: "rgba(201,168,76,0.08)" }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: GOLD }}>Readiness OS</span>
              </div>
            </div>

            {COMPARISON_ROWS.map((row, i) => (
              <div
                key={i}
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: i < COMPARISON_ROWS.length - 1 ? `1px solid #F3F4F6` : "none", background: i % 2 === 0 ? "#fff" : "#FAFAF9" }}
              >
                <div style={{ padding: "16px 24px" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{row.dimension}</span>
                </div>
                <div style={{ padding: "16px 24px", borderLeft: "1px solid #F3F4F6", display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <X style={{ width: 13, height: 13, color: "#EF4444", flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 13, color: "#6B7280" }}>{row.consulting}</span>
                </div>
                <div style={{ padding: "16px 24px", borderLeft: "1px solid #F3F4F6", display: "flex", alignItems: "flex-start", gap: 8, background: `rgba(201,168,76,0.03)` }}>
                  <Check style={{ width: 13, height: 13, color: TEAL, flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{row.executionOs}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ALSO IN THIS SERIES ── */}
      <section style={{ background: "#F8F7F4", padding: "40px 48px", borderTop: `1px solid #E8E4DC` }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 24, height: 1.5, background: GOLD }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: "#6B7280" }}>Also in This Series</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            {[
              { label: "MS Project End of Life", sub: "Don't migrate your lag to a new database — eliminate the mobilization cycle entirely.", path: "/ms-project", tag: "ServiceNow vs. Readiness OS" },
              { label: "Platform Reality", sub: "Every keynote and framework proves the problem. None of them shipped the solution.", path: "/platform-reality", tag: "They Described It. We Built It." },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => setLocation(item.path)}
                style={{ padding: "20px 24px", background: "#fff", border: `1px solid #E8E4DC`, textAlign: "left" as const, cursor: "pointer", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}
              >
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 6 }}>{item.tag}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 5 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>{item.sub}</div>
                </div>
                <span style={{ color: GOLD, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>→</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE OFFSEASON INSIGHT — Williams ── */}
      <section style={{ background: OFF, padding: "72px 48px", borderTop: "1px solid #E8E4DC" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 16 }}>The Structural Gap</div>
              <h2 style={{ ...CG, fontSize: "clamp(24px,3vw,36px)", fontWeight: 600, color: NAVY, lineHeight: 1.2, marginBottom: 20 }}>
                Consulting delivers documents. Neither gives you the offseason.
              </h2>
              <p style={{ fontSize: 15, color: "#4B5563", lineHeight: 1.8, marginBottom: 16 }}>
                Organizations already have the offseason — annual planning cycles, Q4 budget conversations, multi-year roadmaps. Executive time carved out specifically to prepare for what is coming. That calendar already exists.
              </p>
              <p style={{ fontSize: 15, color: "#4B5563", lineHeight: 1.8, marginBottom: 16 }}>
                McKinsey uses that time to deliver a document about what you should do if certain situations arise. Readiness OS uses that same window to pre-stage the actual organizational response — so when those situations arrive, you execute in 12 minutes instead of spending 30 days assembling what the document described.
              </p>
              <p style={{ fontSize: 14, fontWeight: 700, color: NAVY, lineHeight: 1.65 }}>
                Consulting gets you the playbook. Readiness OS gets you the execution.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ background: NAVY, padding: "28px 28px", borderLeft: `4px solid ${GOLD}` }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 12 }}>The Question That Changes the Conversation</div>
                <p style={{ ...CG, fontSize: 18, fontStyle: "italic", color: "#F0EDE4", lineHeight: 1.55, marginBottom: 12 }}>
                  "In your last annual planning cycle, how much time was spent preparing for the situations that were not on your roadmap — the ones that arrived anyway?"
                </p>
                <p style={{ fontSize: 12, color: "rgba(240,237,228,0.5)", marginBottom: 0 }}>The answer is almost always zero. Not negligence — the planning process was never designed for it.</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ background: "#fff", border: "1px solid #E8E4DC", borderTop: `2px solid #EF4444`, padding: "18px 18px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#EF4444", letterSpacing: "0.15em", textTransform: "uppercase" as const, marginBottom: 8 }}>Consulting Result</div>
                  <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>A document that describes what to do. Still 30 days to coordinate when it actually happens.</div>
                </div>
                <div style={{ background: "#fff", border: `1px solid rgba(43,138,110,0.25)`, borderTop: `2px solid ${TEAL}`, padding: "18px 18px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: TEAL, letterSpacing: "0.15em", textTransform: "uppercase" as const, marginBottom: 8 }}>Readiness OS Result</div>
                  <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>Pre-staged infrastructure. 12 minutes from trigger to live execution. No document, no delay.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE BOTTOM LINE ── */}
      <section style={{ background: "#fff", padding: "80px 48px", borderTop: `1px solid #E8E4DC` }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(28px,4vw,40px)", color: NAVY, marginBottom: 12 }}>
              The bottom line.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {/* Consulting card */}
            <div style={{ border: `1px solid rgba(239,68,68,0.2)`, borderRadius: 0, padding: "36px 32px", background: `rgba(239,68,68,0.02)`, textAlign: "center" as const }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: "#EF4444", marginBottom: 16 }}>McKinsey / BCG / Bain</div>
              <div style={{ ...CG, fontSize: 42, fontWeight: 600, color: "#DC2626", marginBottom: 8 }}>$300K–$500K</div>
              <div style={{ fontSize: 14, color: "#6B7280", marginBottom: 20, lineHeight: 1.5 }}>for Readiness Protocols that describe what to do</div>
              <div style={{ padding: "14px 20px", background: `rgba(239,68,68,0.06)`, borderRadius: 0, border: `1px solid rgba(239,68,68,0.12)` }}>
                <p style={{ fontSize: 13, color: "#6B7280", margin: 0, fontStyle: "italic" }}>One-time cost. No activation infrastructure. No signal detection. No ongoing maintenance. Returns when your next crisis hits: nothing.</p>
              </div>
            </div>

            {/* Readiness OS card */}
            <div style={{ border: `2px solid ${GOLD}`, borderRadius: 0, padding: "36px 32px", background: `rgba(201,168,76,0.03)`, textAlign: "center" as const }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 16 }}>Readiness OS</div>
              <div style={{ ...CG, fontSize: 42, fontWeight: 600, color: NAVY, marginBottom: 8 }}>$250K–$750K+/year</div>
              <div style={{ fontSize: 14, color: "#4B5563", marginBottom: 20, lineHeight: 1.5 }}>for infrastructure that actually executes · $75K Founding Partner entry, 100% credited</div>
              <div style={{ padding: "14px 20px", background: `rgba(43,138,110,0.06)`, borderRadius: 0, border: `1px solid rgba(43,138,110,0.15)` }}>
                <p style={{ fontSize: 13, color: "#374151", margin: 0 }}>180 live Readiness Protocols. 12-minute activation. Continuous signal monitoring. Unlimited users. Every situation handled correctly pays for the year.</p>
              </div>
            </div>
          </div>

          {/* Closing statement */}
          <div style={{ marginTop: 48, textAlign: "center" as const, padding: "36px 32px", background: NAVY, borderRadius: 0 }}>
            <p style={{ ...CG, fontSize: "clamp(22px,3vw,30px)", fontWeight: 600, color: "#F0EDE4", lineHeight: 1.3, margin: "0 0 8px" }}>
              McKinsey tells you what to do.
            </p>
            <p style={{ ...CG, fontSize: "clamp(22px,3vw,30px)", fontWeight: 600, color: GOLD, lineHeight: 1.3, margin: "0 0 28px" }}>
              Readiness OS makes sure it happens.
            </p>
            <p style={{ fontSize: 14, color: "rgba(240,237,228,0.5)", maxWidth: 520, margin: "0 auto 16px", lineHeight: 1.6 }}>
              Readiness OS is the coordination infrastructure your consultants assume you already have — but have never built.
            </p>
            <p style={{ fontSize: 14, fontWeight: 700, color: GOLD, maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.6 }}>
              Consultants react after the trigger fires. Readiness OS eliminates the Mobilization Tax before the trigger arrives.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => setLocation("/growth")}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, background: GOLD, color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", padding: "16px 32px", borderRadius: 0, border: "none", cursor: "pointer" }}
              >
                See Pricing <ArrowRight style={{ width: 16, height: 16 }} />
              </button>
              <button
                onClick={() => setLocation("/contact")}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "rgba(240,237,228,0.8)", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", padding: "16px 32px", borderRadius: 0, border: "1px solid rgba(240,237,228,0.2)", cursor: "pointer" }}
              >
                Talk to Our Team
              </button>
            </div>
          </div>
        </div>
      </section>

    </PageLayout>
  );
}
