import React, { useEffect, CSSProperties } from 'react';
import { useLocation } from 'wouter';
import { updatePageMetadata } from '@/lib/seo';
import PageLayout from "@/components/layout/PageLayout";
import { Check, X, ArrowRight } from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";
const RED = "#DC2626";
const CG: CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

const CLAIMS: { claim: string; source: string; reality: string }[] = [
  {
    claim: "Build an agile response capability.",
    source: "Every enterprise transformation keynote, 2019–2026",
    reality: "170 Readiness Readiness Protocols pre-staged across 9 domains. Activated in 12 minutes. No meeting required."
  },
  {
    claim: "Align stakeholders before executing.",
    source: "Standard consulting engagement deliverable",
    reality: "Alignment is pre-staged. Named stakeholders, decision rights, and role assignments automated at trigger point. No alignment meeting — you're already executing."
  },
  {
    claim: "Leverage AI for strategic advantage.",
    source: "Nearly every AI strategy deck in circulation today",
    reality: "AI monitors 248+ data points across 221 triggers. Pattern detected. Readiness Protocol queued. Executive notified. 12 minutes to live coordination — not a dashboard."
  },
  {
    claim: "Create a learning organization that adapts in real time.",
    source: "Organizational resilience frameworks, broadly",
    reality: "Every activation generates a post-debrief. Every trigger adds pattern intelligence. Readiness compounds — the system gets faster as the threat landscape evolves."
  },
  {
    claim: "Bridge the strategy–execution gap.",
    source: "Harvard Business Review, McKinsey, Gartner — cited by nearly everyone",
    reality: "In Readiness OS, the gap doesn't exist. Strategy IS the Readiness Protocol. The Readiness Protocol IS the execution. No translation layer. No alignment cycle."
  },
  {
    claim: "Move at the speed of the market.",
    source: "Every digital transformation initiative, broadly",
    reality: "12 minutes from trigger detection to live execution. While the market is still in its first alignment meeting, you're already coordinated."
  },
  {
    claim: "Develop scenario-based planning capabilities.",
    source: "War room methodology, BCG, strategic planning consultants",
    reality: "221 triggers pre-mapped across 9 domains. 170 Readiness Protocols pre-built. The scenario is already planned. The response is already ready."
  },
  {
    claim: "Build organizational resilience.",
    source: "Post-COVID enterprise resilience movement",
    reality: "The response is ready before the trigger fires. That's not resilience as a concept — it's resilience as infrastructure."
  },
];

export default function PlatformReality() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    updatePageMetadata({
      title: "Platform Reality: They Described It. We Shipped It. | VaughnMartin Readiness OS",
      description: "Every conference keynote, McKinsey deck, and LinkedIn post proves the mobilization problem is real. None of them built the solution. Readiness OS did — 12-minute execution, 170 pre-staged Readiness Protocols, 3,600× Execution Head Start.",
      ogTitle: "They Described the Problem. We Shipped the Solution.",
      ogDescription: "The 3,600× Execution Head Start is not a framework. It's a timestamp on a deployed Readiness Protocol. See how Readiness OS ends the thought leadership theater.",
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
        <div style={{ position: "absolute", left: -120, top: -160, width: 700, height: 700, background: "radial-gradient(circle, rgba(43,138,110,0.16) 0%, transparent 65%)" }} />
        <div style={{ position: "absolute", right: -80, bottom: -200, width: 600, height: 600, background: "radial-gradient(circle, rgba(201,168,76,0.13) 0%, transparent 65%)" }} />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 28, padding: "6px 16px", border: "1px solid rgba(201,168,76,0.3)", background: "rgba(201,168,76,0.07)" }}>
            <div style={{ width: 6, height: 6, background: GOLD }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "rgba(240,237,228,0.7)" }}>
              Platform Reality
            </span>
          </div>

          <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(36px,5vw,60px)", color: "#F0EDE4", lineHeight: 1.05, marginBottom: 24 }}>
            They described the problem perfectly.<br />
            <em style={{ fontStyle: "italic", color: GOLD }}>Nobody built the solution.</em>
          </h1>

          <p style={{ fontSize: 18, color: "rgba(240,237,228,0.65)", maxWidth: 680, margin: "0 auto 16px", lineHeight: 1.65 }}>
            Every conference keynote, McKinsey deck, LinkedIn post, and framework whitepaper proves the mobilization problem is real. The audience nods. The room agrees. The organization goes home — and still takes 30 days to respond when a trigger fires.
          </p>

          <p style={{ fontSize: 15, color: GOLD, fontWeight: 600, maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.5, fontStyle: "italic" }}>
            The thought leaders were right about the problem. We're the only ones who built the solution.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => setLocation("/12-minute-experience")}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: GOLD, color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, padding: "16px 32px", border: "none", cursor: "pointer" }}
            >
              See It Execute <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
            <button
              onClick={() => setLocation("/research")}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "rgba(240,237,228,0.8)", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, padding: "16px 32px", border: "1px solid rgba(240,237,228,0.2)", cursor: "pointer" }}
            >
              See the Research
            </button>
          </div>
        </div>
      </section>

      {/* ── THE THEATER ── */}
      <section style={{ background: "#fff", padding: "80px 48px", borderBottom: `1px solid #E8E4DC` }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>

            {/* Left: the theater */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{ width: 8, height: 8, background: RED }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: RED }}>The Thought Leadership Pattern</span>
              </div>
              <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(24px,3vw,36px)", color: NAVY, lineHeight: 1.2, marginBottom: 20 }}>
                The room agrees. Then goes home.
              </h2>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 1 }}>
                {[
                  { step: "01", label: "The Problem is Named", body: "Speaker articulates the mobilization gap. Slide deck shows the 30-day response cycle. Room nods vigorously. Article gets 40,000 LinkedIn impressions." },
                  { step: "02", label: "The Framework is Sold", body: "A new model is proposed. Agile. Adaptive. Resilient. Five phases. Four pillars. A two-by-two matrix. The book is $28. The keynote is $75,000." },
                  { step: "03", label: "The Implementation Begins", body: "Workshops are scheduled. Champions are named. A steering committee convenes. Three months later, a validation program is approved." },
                  { step: "04", label: "The Trigger Fires Anyway", body: "A competitor launches. A crisis hits. A key executive departs. The organization still takes 30 days to mobilize. The framework is on a shelf next to the McKinsey PDF." },
                ].map((item) => (
                  <div key={item.step} style={{ display: "flex", alignItems: "flex-start", gap: 0, borderBottom: `1px solid #F3F4F6` }}>
                    <div style={{ ...CG, fontSize: 32, fontWeight: 700, color: "rgba(220,38,38,0.15)", lineHeight: 1, padding: "20px 16px 20px 0", flexShrink: 0, width: 56 }}>{item.step}</div>
                    <div style={{ padding: "20px 0 20px 16px", borderLeft: `1px solid #F3F4F6` }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 5 }}>{item.label}</div>
                      <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6 }}>{item.body}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 20, padding: "16px 20px", background: "rgba(220,38,38,0.04)", border: "1px solid rgba(220,38,38,0.12)" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: RED, margin: 0 }}>
                  The theory was correct. The solution never shipped.
                </p>
              </div>
            </div>

            {/* Right: the reality */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{ width: 8, height: 8, background: TEAL }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: TEAL }}>The Readiness OS Reality</span>
              </div>
              <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(24px,3vw,36px)", color: NAVY, lineHeight: 1.2, marginBottom: 20 }}>
                The response is ready before the trigger fires.
              </h2>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 1 }}>
                {[
                  { step: "01", label: "The Problem is Pre-Staged", body: "170 Readiness Readiness Protocols built for every situation the organization is likely to face. Not described — deployed. Not in a deck — in the platform." },
                  { step: "02", label: "The Intelligence is Live", body: "248+ data points monitored continuously across 221 triggers. AI detects the pattern before the leadership team reads the news." },
                  { step: "03", label: "No Committee Required", body: "When a trigger fires, the platform surfaces the matched Readiness Protocol, assigns roles, and notifies stakeholders. Zero coordination overhead. No steering committee. No workshop." },
                  { step: "04", label: "12 Minutes to Live Execution", body: "While the thought leader's framework is still in Week 3 of stakeholder alignment, Readiness OS users are already 12 minutes into coordinated, executive-authorized execution." },
                ].map((item) => (
                  <div key={item.step} style={{ display: "flex", alignItems: "flex-start", gap: 0, borderBottom: `1px solid #F3F4F6` }}>
                    <div style={{ ...CG, fontSize: 32, fontWeight: 700, color: GOLD, lineHeight: 1, padding: "20px 16px 20px 0", flexShrink: 0, width: 56 }}>{item.step}</div>
                    <div style={{ padding: "20px 0 20px 16px", borderLeft: `1px solid #F3F4F6` }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 5 }}>{item.label}</div>
                      <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{item.body}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 20, padding: "16px 20px", background: "rgba(43,138,110,0.05)", border: "1px solid rgba(43,138,110,0.2)" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: TEAL, margin: 0 }}>
                  We didn't describe the solution. We shipped it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CLAIM vs REALITY TABLE ── */}
      <section style={{ background: OFF, padding: "80px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 24, height: 2, background: NAVY }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: NAVY }}>Claim vs. Reality</span>
              <div style={{ width: 24, height: 2, background: NAVY }} />
            </div>
            <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(28px,4vw,40px)", color: NAVY, marginBottom: 12 }}>
              What they say. What we do.
            </h2>
            <p style={{ fontSize: 15, color: "#6B7280", maxWidth: 560, margin: "0 auto" }}>
              These are not invented claims. These are the exact phrases on the slides, in the books, and in the engagement proposals — matched against what Readiness OS actually does today.
            </p>
          </div>

          <div style={{ background: "#fff", border: `1px solid #E8E4DC`, overflow: "hidden" }}>
            {/* Header */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: NAVY }}>
              <div style={{ padding: "16px 24px" }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(240,237,228,0.4)" }}>The Claim</span>
              </div>
              <div style={{ padding: "16px 24px", borderLeft: "1px solid rgba(240,237,228,0.1)" }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(220,38,38,0.8)" }}>Heard At</span>
              </div>
              <div style={{ padding: "16px 24px", borderLeft: "1px solid rgba(240,237,228,0.1)", background: "rgba(201,168,76,0.08)" }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: GOLD }}>Readiness OS Reality</span>
              </div>
            </div>

            {CLAIMS.map((row, i) => (
              <div
                key={i}
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: i < CLAIMS.length - 1 ? `1px solid #F3F4F6` : "none", background: i % 2 === 0 ? "#fff" : "#FAFAF9" }}
              >
                <div style={{ padding: "18px 24px" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: NAVY, fontStyle: "italic" }}>"{row.claim}"</span>
                </div>
                <div style={{ padding: "18px 24px", borderLeft: "1px solid #F3F4F6" }}>
                  <span style={{ fontSize: 11, color: "#9CA3AF", lineHeight: 1.5 }}>{row.source}</span>
                </div>
                <div style={{ padding: "18px 24px", borderLeft: "1px solid #F3F4F6", display: "flex", alignItems: "flex-start", gap: 8, background: "rgba(201,168,76,0.03)" }}>
                  <Check style={{ width: 13, height: 13, color: TEAL, flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 13, color: "#374151", fontWeight: 500, lineHeight: 1.5 }}>{row.reality}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE MATH ── */}
      <section style={{ background: "#fff", padding: "80px 48px", borderTop: `1px solid #E8E4DC`, borderBottom: `1px solid #E8E4DC` }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <div style={{ width: 32, height: 2, background: GOLD }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "#6B7280" }}>The Mathematical Kill-Shot</span>
              </div>
              <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(28px,3.5vw,42px)", color: NAVY, lineHeight: 1.15, marginBottom: 20 }}>
                Show us your timestamp.
              </h2>
              <p style={{ fontSize: 15, color: "#4B5563", lineHeight: 1.7, marginBottom: 20 }}>
                Any framework, approach, or methodology that still produces a 30-day mobilization cycle loses the conversation in three numbers: <span style={{ fontWeight: 700, color: NAVY }}>30 days vs. 12 minutes</span>. That's 3,600× slower.
              </p>
              <p style={{ fontSize: 15, color: "#4B5563", lineHeight: 1.7, marginBottom: 20 }}>
                The 3,600× Execution Head Start is not a speed claim. It's a challenge. If a framework cannot produce a timestamp on a deployed Readiness Protocol — if it requires even one alignment meeting before execution begins — the math ends the conversation.
              </p>
              <p style={{ fontSize: 15, color: "#374151", fontWeight: 600, lineHeight: 1.6 }}>
                We're not competing on who has the better theory. We're competing on who can show the timestamp.
              </p>
            </div>

            {/* Stats column */}
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 2 }}>
              <div style={{ padding: "32px", background: NAVY, textAlign: "center" as const }}>
                <div style={{ ...CG, fontSize: 56, fontWeight: 700, color: GOLD, lineHeight: 1, marginBottom: 8 }}>30</div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "rgba(240,237,228,0.4)", marginBottom: 8 }}>Days to mobilize</div>
                <div style={{ fontSize: 13, color: "rgba(240,237,228,0.5)", fontStyle: "italic" }}>Framework, workshop, alignment meeting, steering committee. The standard model, unchanged.</div>
              </div>
              <div style={{ padding: "20px", background: "#F3F4F6", textAlign: "center" as const }}>
                <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: "#9CA3AF", lineHeight: 1 }}>÷ 3,600</div>
              </div>
              <div style={{ padding: "32px", background: `rgba(201,168,76,0.08)`, border: `2px solid ${GOLD}`, textAlign: "center" as const }}>
                <div style={{ ...CG, fontSize: 56, fontWeight: 700, color: NAVY, lineHeight: 1, marginBottom: 8 }}>12</div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: NAVY, marginBottom: 8 }}>Minutes to execute</div>
                <div style={{ fontSize: 13, color: "#4B5563" }}>Pre-staged Readiness Protocol. Role assignments automated. Executive-authorized. Live.</div>
              </div>
              <div style={{ padding: "16px 20px", background: TEAL, textAlign: "center" as const }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>3,600× Execution Head Start</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE THREE CATEGORIES ── */}
      <section style={{ background: OFF, padding: "80px 48px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 24, height: 2, background: NAVY }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: NAVY }}>The Full Landscape</span>
              <div style={{ width: 24, height: 2, background: NAVY }} />
            </div>
            <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(28px,4vw,38px)", color: NAVY, marginBottom: 12 }}>
              Every alternative category. One answer.
            </h2>
            <p style={{ fontSize: 15, color: "#6B7280", maxWidth: 520, margin: "0 auto" }}>
              Three distinct competitor categories. Three distinct failures. One platform that solves all three.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
            {[
              {
                category: "Thought Leaders & Frameworks",
                verdict: "Described It",
                cost: "Conferences + books",
                what: "They name the mobilization problem with precision. They sell frameworks, models, and approaches. They build audiences. They do not build the coordination infrastructure.",
                gap: "30 days unchanged",
                cta: "This page",
                ctaPath: "/platform-reality",
                accent: RED,
              },
              {
                category: "Management Consulting",
                verdict: "Documented It",
                cost: "$300K–$500K for PDFs",
                what: "McKinsey, BCG, and Bain deliver custom Readiness Protocols that live on SharePoint. 6 months of engagement. Static documents. No activation infrastructure. No signal detection.",
                gap: "30 days unchanged",
                cta: "See the Consulting Comparison",
                ctaPath: "/vs-consulting",
                accent: "#C9A84C",
              },
              {
                category: "ServiceNow / Tool Migration",
                verdict: "Migrated It",
                cost: "IT operations budget",
                what: "ServiceNow SPM wants to become the new MS Project — a better place to store the same static project plans. The 30-day mobilization cycle migrates with the data.",
                gap: "30 days unchanged",
                cta: "See the Migration Comparison",
                ctaPath: "/ms-project",
                accent: "#6B7280",
              },
            ].map((item) => (
              <div key={item.category} style={{ background: "#fff", border: `1px solid #E8E4DC`, padding: "32px 28px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: item.accent, marginBottom: 12 }}>{item.category}</div>
                <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: NAVY, marginBottom: 16, lineHeight: 1.1 }}>{item.verdict}</div>
                <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 16, fontWeight: 600 }}>{item.cost}</div>
                <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.65, marginBottom: 20 }}>{item.what}</p>
                <div style={{ padding: "10px 16px", background: "rgba(220,38,38,0.05)", border: "1px solid rgba(220,38,38,0.12)", marginBottom: 20 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: RED }}>Result: {item.gap}</span>
                </div>
                <button
                  onClick={() => setLocation(item.ctaPath)}
                  style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: NAVY, background: "transparent", border: `1px solid ${NAVY}`, padding: "10px 16px", cursor: "pointer", width: "100%" }}
                >
                  {item.cta}
                </button>
              </div>
            ))}
          </div>

          {/* Readiness OS answer */}
          <div style={{ marginTop: 2, padding: "36px 40px", background: NAVY, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, flexWrap: "wrap" as const }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 8 }}>Readiness OS</div>
              <div style={{ ...CG, fontSize: 28, fontWeight: 600, color: "#F0EDE4", lineHeight: 1.1 }}>Shipped It.</div>
              <p style={{ fontSize: 14, color: "rgba(240,237,228,0.55)", maxWidth: 540, marginTop: 8, lineHeight: 1.6 }}>
                170 live playbooks. 221 pre-mapped triggers. 248+ data points monitored. Executive-authorized execution in 12 minutes. The response is ready before the trigger fires.
              </p>
            </div>
            <button
              onClick={() => setLocation("/12-minute-experience")}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: GOLD, color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, padding: "16px 32px", border: "none", cursor: "pointer", flexShrink: 0 }}
            >
              See It Execute <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
          </div>
        </div>
      </section>

      {/* ── CLOSING CTA ── */}
      <section style={{ background: "#fff", padding: "80px 48px", borderTop: `1px solid #E8E4DC` }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          {/* Three-column "we vs they" editorial */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr 1px 1fr", gap: 0, marginBottom: 56 }}>
            {[
              { they: "They talked about it.", we: "We built it." },
              { they: "They described the gap.", we: "We closed it." },
              { they: "They sold the framework.", we: "We shipped the infrastructure." },
            ].map((item, i) => (
              <React.Fragment key={i}>
                <div style={{ padding: "0 32px", textAlign: "center" as const }}>
                  <p style={{ ...CG, fontSize: 18, fontWeight: 600, color: "#9CA3AF", marginBottom: 12, lineHeight: 1.3, fontStyle: "italic" }}>{item.they}</p>
                  <div style={{ width: 32, height: 1.5, background: GOLD, margin: "0 auto 12px" }} />
                  <p style={{ ...CG, fontSize: 18, fontWeight: 600, color: NAVY, lineHeight: 1.3 }}>{item.we}</p>
                </div>
                {i < 2 && <div style={{ background: "#E8E4DC" }} />}
              </React.Fragment>
            ))}
          </div>

          <div style={{ textAlign: "center" as const, padding: "48px 40px", background: NAVY }}>
            <div style={{
              position: "relative",
              backgroundImage: "linear-gradient(rgba(201,168,76,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.06) 1px,transparent 1px)",
              backgroundSize: "48px 48px",
              padding: "48px 40px"
            }}>
              <p style={{ ...CG, fontSize: "clamp(22px,3vw,34px)", fontWeight: 600, color: "#F0EDE4", lineHeight: 1.2, margin: "0 0 10px" }}>
                The thought leaders were right about the problem.
              </p>
              <p style={{ ...CG, fontSize: "clamp(22px,3vw,34px)", fontWeight: 600, color: GOLD, lineHeight: 1.2, margin: "0 0 32px", fontStyle: "italic" }}>
                We're the only ones who built the solution.
              </p>
              <p style={{ fontSize: 14, color: "rgba(240,237,228,0.5)", maxWidth: 480, margin: "0 auto 36px", lineHeight: 1.65 }}>
                12 minutes from trigger to live execution. 170 Readiness Protocols pre-staged and ready. The response is ready before the trigger fires.
              </p>
              <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                <button
                  onClick={() => setLocation("/pilot-program")}
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, background: GOLD, color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, padding: "16px 36px", border: "none", cursor: "pointer" }}
                >
                  Apply for Founding Partner Access <ArrowRight style={{ width: 16, height: 16 }} />
                </button>
                <button
                  onClick={() => setLocation("/research")}
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "rgba(240,237,228,0.8)", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, padding: "16px 36px", border: "1px solid rgba(240,237,228,0.2)", cursor: "pointer" }}
                >
                  See the Research Evidence
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </PageLayout>
  );
}
