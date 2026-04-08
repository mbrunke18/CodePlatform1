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
  { dimension: "Cost", consulting: "$300K–$500K one-time", executionOs: "$75K–$250K/year" },
  { dimension: "Playbooks", consulting: "5–10 custom PDFs", executionOs: "170 pre-built + unlimited custom" },
  { dimension: "Format", consulting: "Static documents", executionOs: "Live, executable platform" },
  { dimension: "Activation", consulting: "Manual — find the PDF, read it, interpret it, convene", executionOs: "One-click. 12 minutes." },
  { dimension: "Decision rights", consulting: "Described in prose", executionOs: "Mapped and enforced" },
  { dimension: "Role assignment", consulting: "Generic roles in a document", executionOs: "Named people, auto-notified" },
  { dimension: "Task tracking", consulting: "Not included", executionOs: "Real-time dashboard" },
  { dimension: "Signal detection", consulting: "Not included", executionOs: "248+ data points, continuous monitoring" },
  { dimension: "Time to coordinate", consulting: "Still 30 days", executionOs: "12 minutes" },
  { dimension: "Ongoing updates", consulting: "Refresh engagement: $150K+", executionOs: "Continuous — included in subscription" },
  { dimension: "Shelf life", consulting: "6–18 months before stale", executionOs: "Always current — AI-maintained" },
];

export default function VsConsulting() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    updatePageMetadata({
      title: "Readiness OS vs. Management Consulting | VaughnMartin",
      description: "McKinsey charges $300K–$500K for playbooks that sit on a shelf. Readiness OS delivers 170 live, executable playbooks at $75K–$250K/year — with 12-minute activation and continuous signal monitoring.",
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
        <div style={{ position: "absolute", left: -120, top: -160, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(43,138,110,0.18) 0%, transparent 65%)" }} />
        <div style={{ position: "absolute", right: -80, bottom: -200, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.14) 0%, transparent 65%)" }} />

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

          <p style={{ fontSize: 18, color: "rgba(240,237,228,0.65)", maxWidth: 640, margin: "0 auto 40px", lineHeight: 1.65 }}>
            A Fortune 1000 company hires McKinsey to develop crisis response playbooks. Six months later, a crisis hits.
            Nobody can find the playbooks. The organization still takes 30 days to coordinate.
            The $500K investment sits on a shelf while the company scrambles.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => setLocation("/growth")}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: GOLD, color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", padding: "16px 32px", borderRadius: 6, border: "none", cursor: "pointer" }}
            >
              See Pricing <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
            <button
              onClick={() => setLocation("/try-demo")}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "rgba(240,237,228,0.8)", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", padding: "16px 32px", borderRadius: 6, border: "1px solid rgba(240,237,228,0.2)", cursor: "pointer" }}
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
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF4444" }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: "#EF4444" }}>What $500K in Consulting Gets You</span>
              </div>

              <div style={{ border: `1px solid #E8E4DC`, borderRadius: 10, overflow: "hidden" }}>
                {[
                  { phase: "Discovery & Assessment", delivers: "Interviews, current state analysis, gap assessment", cost: "$75K–$125K" },
                  { phase: "Playbook Development", delivers: "5–10 playbooks in PDF / PowerPoint format", cost: "$150K–$250K" },
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

              <div style={{ marginTop: 16, padding: "16px 20px", background: `rgba(239,68,68,0.04)`, border: `1px solid rgba(239,68,68,0.12)`, borderRadius: 8 }}>
                <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
                  What you receive: PDF playbooks that live on SharePoint. Nobody reads them. Nobody can find them when it matters.
                </p>
              </div>
            </div>

            {/* What happens when a crisis hits */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#9CA3AF" }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: "#9CA3AF" }}>Six Months Later — A Crisis Hits</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
                {[
                  "Nobody can find the playbooks.",
                  "The playbooks are 200 pages — no one has time to read them.",
                  "Key people have changed roles since the playbooks were written.",
                  "The playbooks describe processes — they don't assign tasks.",
                  "The organization still takes 30 days to coordinate.",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", background: OFF, borderRadius: 8, border: `1px solid #E8E4DC` }}>
                    <X style={{ width: 14, height: 14, color: "#EF4444", flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 13, color: "#374151" }}>{item}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 16, padding: "16px 20px", background: `rgba(239,68,68,0.04)`, border: `1px solid rgba(239,68,68,0.12)`, borderRadius: 8 }}>
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

          <div style={{ background: "#fff", border: `1px solid #E8E4DC`, borderRadius: 12, overflow: "hidden" }}>
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
            <div style={{ border: `1px solid rgba(239,68,68,0.2)`, borderRadius: 12, padding: "36px 32px", background: `rgba(239,68,68,0.02)`, textAlign: "center" as const }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: "#EF4444", marginBottom: 16 }}>McKinsey / BCG / Bain</div>
              <div style={{ ...CG, fontSize: 42, fontWeight: 600, color: "#DC2626", marginBottom: 8 }}>$300K–$500K</div>
              <div style={{ fontSize: 14, color: "#6B7280", marginBottom: 20, lineHeight: 1.5 }}>for playbooks that describe what to do</div>
              <div style={{ padding: "14px 20px", background: `rgba(239,68,68,0.06)`, borderRadius: 8, border: `1px solid rgba(239,68,68,0.12)` }}>
                <p style={{ fontSize: 13, color: "#6B7280", margin: 0, fontStyle: "italic" }}>One-time cost. No activation infrastructure. No signal detection. No ongoing maintenance. Returns when your next crisis hits: nothing.</p>
              </div>
            </div>

            {/* Readiness OS card */}
            <div style={{ border: `2px solid ${GOLD}`, borderRadius: 12, padding: "36px 32px", background: `rgba(201,168,76,0.03)`, textAlign: "center" as const }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 16 }}>Readiness OS</div>
              <div style={{ ...CG, fontSize: 42, fontWeight: 600, color: NAVY, marginBottom: 8 }}>$75K–$250K/year</div>
              <div style={{ fontSize: 14, color: "#4B5563", marginBottom: 20, lineHeight: 1.5 }}>for infrastructure that actually executes</div>
              <div style={{ padding: "14px 20px", background: `rgba(43,138,110,0.06)`, borderRadius: 8, border: `1px solid rgba(43,138,110,0.15)` }}>
                <p style={{ fontSize: 13, color: "#374151", margin: 0 }}>170 live playbooks. 12-minute activation. Continuous signal monitoring. Unlimited users. Every situation handled correctly pays for the year.</p>
              </div>
            </div>
          </div>

          {/* Closing statement */}
          <div style={{ marginTop: 48, textAlign: "center" as const, padding: "36px 32px", background: NAVY, borderRadius: 12 }}>
            <p style={{ ...CG, fontSize: "clamp(22px,3vw,30px)", fontWeight: 600, color: "#F0EDE4", lineHeight: 1.3, margin: "0 0 8px" }}>
              McKinsey tells you what to do.
            </p>
            <p style={{ ...CG, fontSize: "clamp(22px,3vw,30px)", fontWeight: 600, color: GOLD, lineHeight: 1.3, margin: "0 0 28px" }}>
              Readiness OS makes sure it happens.
            </p>
            <p style={{ fontSize: 14, color: "rgba(240,237,228,0.5)", maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.6 }}>
              Readiness OS is the coordination infrastructure your consultants assume you already have — but have never built.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => setLocation("/growth")}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, background: GOLD, color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", padding: "16px 32px", borderRadius: 6, border: "none", cursor: "pointer" }}
              >
                See Pricing <ArrowRight style={{ width: 16, height: 16 }} />
              </button>
              <button
                onClick={() => setLocation("/contact")}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "rgba(240,237,228,0.8)", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", padding: "16px 32px", borderRadius: 6, border: "1px solid rgba(240,237,228,0.2)", cursor: "pointer" }}
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
