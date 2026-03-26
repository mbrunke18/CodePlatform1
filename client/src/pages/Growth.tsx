import { useState, useEffect, CSSProperties } from 'react';
import { useLocation } from 'wouter';
import { updatePageMetadata } from '@/lib/seo';
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Zap, TrendingUp, Shield, ChevronDown, ChevronUp } from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";
const CG: CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

const TIERS = [
  {
    id: "essential",
    name: "Essential",
    tagline: "Start executing. Prove the model.",
    monthly: 1000,
    annual: 850,
    activations: "Up to 10 activations / year",
    activationNote: "2–5 high-stakes situations per year",
    support: "Self-serve onboarding + email support",
    highlight: false,
    color: TEAL,
    includes: [
      "Full platform — all 170 playbooks",
      "Complete IDEA Framework access",
      "Live Activation Center",
      "Signal Intelligence dashboard",
      "AI Execution Briefs",
      "Up to 10 playbook activations / year",
      "Self-serve onboarding guide",
      "Email support (48hr response)",
    ],
    bestFor: "PE-backed startups and growing companies executing 2–5 high-stakes situations per year. One well-executed trigger covers the annual cost.",
  },
  {
    id: "active",
    name: "Active",
    tagline: "For companies in motion.",
    monthly: 2500,
    annual: 2100,
    activations: "Up to 30 activations / year",
    activationNote: "5–15 situations per year",
    support: "Guided onboarding + dedicated success contact",
    highlight: true,
    color: GOLD,
    includes: [
      "Everything in Essential",
      "Up to 30 playbook activations / year",
      "Guided onboarding session (live)",
      "Dedicated customer success contact",
      "Quarterly strategy review",
      "Custom playbook configuration (up to 5)",
      "Priority support (24hr response)",
      "Execution performance reports",
    ],
    bestFor: "Companies growing fast with frequent trigger exposure — competitive shifts, talent events, client risk, operational disruptions. ROI compounds with every activation.",
  },
  {
    id: "scale",
    name: "Scale",
    tagline: "Unlimited execution. Full infrastructure.",
    monthly: 5000,
    annual: 4200,
    activations: "Unlimited activations",
    activationNote: "No cap — execute as often as needed",
    support: "White-glove onboarding + named account team",
    highlight: false,
    color: NAVY,
    includes: [
      "Everything in Active",
      "Unlimited playbook activations",
      "White-glove onboarding & configuration",
      "Named account team",
      "Custom playbook development",
      "Board-ready activation reports",
      "Investor-facing execution documentation",
      "Integration support (Microsoft, Slack, etc.)",
    ],
    bestFor: "PE portfolio companies and fast-scaling businesses that run the platform as core operational infrastructure. Built to show investors you execute with discipline.",
  },
];

const FAQS = [
  {
    q: "What counts as an activation?",
    a: "An activation is when you launch a playbook in response to a real trigger — a crisis, competitive event, talent situation, or strategic shift. Browsing the library, running practice drills, or reviewing playbooks does not count. You only count what you actually execute.",
  },
  {
    q: "Is the platform restricted by tier?",
    a: "No. Every tier gives you the full platform — all 170 playbooks, the complete IDEA Framework, Signal Intelligence, Live Activation Center, and AI Execution Briefs. The only difference is how many activations are included and what support level you receive.",
  },
  {
    q: "Can I pay monthly? Am I locked in?",
    a: "Yes, monthly billing is available on all tiers. Annual billing saves approximately 15%. There's no long-term lock-in — you can cancel or change tiers with 30 days notice.",
  },
  {
    q: "What if I exceed my activation limit?",
    a: "We'll notify you when you're approaching your limit. You can upgrade your tier at any time, or purchase additional activation blocks. We will never cut off an in-progress execution mid-crisis.",
  },
  {
    q: "How is this different from the Enterprise Pilot?",
    a: "The Enterprise Pilot ($75K, credited to Year 1) is for Fortune 1000 companies requiring dedicated implementation, custom Microsoft ecosystem integration, and white-glove onboarding at scale. These Growth tiers are designed for companies that want to start immediately, self-serve or with guided support, and grow into the platform over time.",
  },
  {
    q: "Is this the same product Fortune 1000 companies use?",
    a: "Yes. Same platform, same playbook library, same IDEA Framework, same 12-minute execution infrastructure. The price reflects your support needs — not a reduced version of the product.",
  },
];

export default function Growth() {
  const [, setLocation] = useLocation();
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    updatePageMetadata({
      title: "Execution OS for Growing Companies | VaughnMartin",
      description: "The same execution infrastructure Fortune 1000 companies use — accessible entry point, no feature restrictions, clear path to grow. Monthly billing available.",
      ogTitle: "Execution OS for Growing Companies — Same Platform, Accessible Entry",
      ogDescription: "A situation is a situation. The ROI doesn't care how big your company is. Start at $1,000/month with the full platform.",
    });
  }, []);

  return (
    <PageLayout>

      {/* ── HERO ── */}
      <section style={{ background: "#fff", borderBottom: `1px solid #E8E4DC`, padding: "88px 48px 72px", textAlign: "center" }}>
        <div className="max-w-4xl mx-auto">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>
              Execution OS · Growing Companies
            </span>
            <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
          </div>

          <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(38px,5vw,58px)", lineHeight: 1.05, color: NAVY, marginBottom: 20 }}>
            The same execution infrastructure.<br />
            <em style={{ fontStyle: "italic", color: GOLD }}>An accessible path in.</em>
          </h1>

          <p style={{ fontSize: 18, color: "#4B5563", maxWidth: 680, margin: "0 auto 16px", lineHeight: 1.6 }}>
            Fortune 1000 companies use Execution OS to compress 30-day mobilization cycles to 12 minutes.
            A situation is a situation — the ROI doesn't change based on how many employees you have.
          </p>
          <p style={{ fontSize: 16, color: "#6B7280", maxWidth: 600, margin: "0 auto 36px", lineHeight: 1.6 }}>
            These tiers exist because ability to pay differs. The product doesn't.
          </p>

          {/* PE callout */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 12,
            background: `rgba(43,138,110,0.07)`, border: `1px solid rgba(43,138,110,0.2)`,
            borderRadius: 8, padding: "10px 20px", marginBottom: 8
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: TEAL, fontWeight: 600 }}>
              Built for PE-backed startups and growth-stage companies
            </span>
          </div>
        </div>
      </section>

      {/* ── BILLING TOGGLE ── */}
      <section style={{ background: OFF, borderBottom: `1px solid #E8E4DC`, padding: "28px 48px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 16, background: "#fff", border: `1px solid #E8E4DC`, borderRadius: 40, padding: "6px 6px 6px 20px" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: annual ? "#9CA3AF" : NAVY }}>Monthly</span>
          <button
            onClick={() => setAnnual(!annual)}
            style={{
              width: 48, height: 26, borderRadius: 13,
              background: annual ? NAVY : "#E5E7EB",
              border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s"
            }}
          >
            <div style={{
              width: 20, height: 20, borderRadius: "50%", background: "#fff",
              position: "absolute", top: 3,
              left: annual ? 25 : 3, transition: "left 0.2s"
            }} />
          </button>
          <span style={{ fontSize: 13, fontWeight: 600, color: annual ? NAVY : "#9CA3AF" }}>Annual</span>
          {annual && (
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
              color: TEAL, background: `rgba(43,138,110,0.1)`, borderRadius: 20, padding: "4px 12px"
            }}>
              Save ~15%
            </span>
          )}
        </div>
      </section>

      {/* ── PRICING TIERS ── */}
      <section style={{ background: "#fff", padding: "72px 48px" }}>
        <div className="max-w-6xl mx-auto">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {TIERS.map((tier) => (
              <div
                key={tier.id}
                style={{
                  border: tier.highlight ? `2px solid ${GOLD}` : `1px solid #E8E4DC`,
                  borderRadius: 12,
                  padding: "40px 36px",
                  background: tier.highlight ? `rgba(201,168,76,0.04)` : "#fff",
                  position: "relative",
                  display: "flex", flexDirection: "column"
                }}
              >
                {tier.highlight && (
                  <div style={{
                    position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                    background: GOLD, color: "#fff",
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
                    padding: "4px 16px", borderRadius: 20, whiteSpace: "nowrap"
                  }}>
                    Most Popular
                  </div>
                )}

                {/* Tier header */}
                <div style={{ marginBottom: 28 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: tier.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: tier.color }}>
                      {tier.name}
                    </span>
                  </div>
                  <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 20 }}>{tier.tagline}</p>

                  {/* Price */}
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 }}>
                    <span style={{ ...CG, fontSize: 52, fontWeight: 600, color: NAVY, lineHeight: 1 }}>
                      ${(annual ? tier.annual : tier.monthly).toLocaleString()}
                    </span>
                    <span style={{ fontSize: 14, color: "#9CA3AF" }}>/month</span>
                  </div>
                  {annual && (
                    <p style={{ fontSize: 12, color: TEAL, fontWeight: 600, marginBottom: 4 }}>
                      ${(tier.annual * 12).toLocaleString()} billed annually
                    </p>
                  )}
                  <p style={{ fontSize: 12, color: "#9CA3AF" }}>
                    {annual ? "or $" + tier.monthly.toLocaleString() + "/month billed monthly" : "or save ~15% with annual billing"}
                  </p>
                </div>

                {/* Activation info */}
                <div style={{
                  background: `rgba(${tier.color === GOLD ? "201,168,76" : tier.color === TEAL ? "43,138,110" : "10,15,46"},0.07)`,
                  borderRadius: 8, padding: "14px 16px", marginBottom: 28
                }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: tier.color === NAVY ? "#fff" : tier.color === GOLD ? "#92710A" : TEAL, marginBottom: 2 }}>
                    {tier.activations}
                  </p>
                  <p style={{ fontSize: 12, color: "#6B7280" }}>{tier.activationNote}</p>
                </div>

                {/* Includes */}
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                  {tier.includes.map((item) => (
                    <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <Check style={{ width: 14, height: 14, color: TEAL, flexShrink: 0, marginTop: 3 }} />
                      <span style={{ fontSize: 14, color: "#374151" }}>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Best for */}
                <p style={{ fontSize: 12, color: "#9CA3AF", lineHeight: 1.5, marginBottom: 24, borderTop: `1px solid #F3F4F6`, paddingTop: 20 }}>
                  <strong style={{ color: "#6B7280" }}>Best for: </strong>{tier.bestFor}
                </p>

                <Button
                  onClick={() => window.location.href = "mailto:sales@vaughnmartin.com?subject=Execution OS - " + tier.name + " Tier Inquiry"}
                  style={{
                    background: tier.highlight ? GOLD : tier.id === "scale" ? NAVY : "#fff",
                    color: tier.highlight ? "#fff" : tier.id === "scale" ? "#fff" : NAVY,
                    border: tier.highlight ? "none" : `2px solid ${tier.id === "scale" ? NAVY : "#E8E4DC"}`,
                    fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
                    width: "100%", padding: "16px"
                  }}
                >
                  Get Started — {tier.name} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GROW WITH THE PLATFORM ── */}
      <section style={{ background: OFF, padding: "80px 48px", borderTop: `1px solid #E8E4DC`, borderBottom: `1px solid #E8E4DC` }}>
        <div className="max-w-5xl mx-auto text-center">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 24, height: 2, background: TEAL, flexShrink: 0 }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: TEAL }}>
              Built to Scale With You
            </span>
            <div style={{ width: 24, height: 2, background: TEAL, flexShrink: 0 }} />
          </div>
          <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(30px,4vw,44px)", color: NAVY, marginBottom: 16 }}>
            Start where you can. Grow when you're ready.
          </h2>
          <p style={{ fontSize: 17, color: "#4B5563", maxWidth: 620, margin: "0 auto 56px", lineHeight: 1.6 }}>
            There's no penalty for starting at Essential. You carry everything you build — playbook configurations,
            activation history, performance data — when you move to the next tier.
          </p>

          {/* Path diagram */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, flexWrap: "wrap" }}>
            {[
              { tier: "Essential", price: "$1K/mo", note: "Prove the value", color: TEAL, icon: <Zap style={{ width: 20, height: 20, color: TEAL }} /> },
              { tier: "Active", price: "$2.5K/mo", note: "Expand as you grow", color: GOLD, icon: <TrendingUp style={{ width: 20, height: 20, color: GOLD }} /> },
              { tier: "Scale", price: "$5K/mo", note: "Full infrastructure", color: NAVY, icon: <Shield style={{ width: 20, height: 20, color: "#fff" }} /> },
            ].map((step, i) => (
              <div key={step.tier} style={{ display: "flex", alignItems: "center" }}>
                <div style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  background: "#fff", border: `1px solid #E8E4DC`, borderRadius: 12,
                  padding: "28px 32px", minWidth: 160
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: step.color === NAVY ? NAVY : `rgba(${step.color === GOLD ? "201,168,76" : "43,138,110"},0.1)`,
                    display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14
                  }}>
                    {step.icon}
                  </div>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: step.color === NAVY ? NAVY : step.color, marginBottom: 4 }}>
                    {step.tier}
                  </p>
                  <p style={{ ...CG, fontSize: 22, fontWeight: 600, color: NAVY, marginBottom: 4 }}>{step.price}</p>
                  <p style={{ fontSize: 12, color: "#9CA3AF" }}>{step.note}</p>
                </div>
                {i < 2 && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 16px" }}>
                    <ArrowRight style={{ width: 20, height: 20, color: "#D1D5DB" }} />
                    <span style={{ fontSize: 10, color: "#D1D5DB", marginTop: 4, whiteSpace: "nowrap" }}>Anytime</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <p style={{ fontSize: 14, color: "#9CA3AF", marginTop: 36 }}>
            Change tiers with 30 days notice. No data lost. No re-onboarding required.
          </p>
        </div>
      </section>

      {/* ── PE STARTUP ANGLE ── */}
      <section style={{ background: NAVY, padding: "80px 48px" }}>
        <div className="max-w-4xl mx-auto text-center">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 24, height: 2, background: GOLD, flexShrink: 0 }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>
              PE-Backed Companies
            </span>
            <div style={{ width: 24, height: 2, background: GOLD, flexShrink: 0 }} />
          </div>
          <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(28px,4vw,42px)", color: "#F0EDE4", marginBottom: 20, lineHeight: 1.1 }}>
            Your investors expect operational excellence.<br />
            <em style={{ fontStyle: "italic", color: GOLD }}>Now you have the infrastructure to prove it.</em>
          </h2>
          <p style={{ fontSize: 17, color: "rgba(240,237,228,0.65)", maxWidth: 640, margin: "0 auto 48px", lineHeight: 1.6 }}>
            PE firms invest in operational discipline. A portfolio company that can execute in 12 minutes
            instead of 30 days — with documented playbooks, activation logs, and board-ready reporting —
            is a fundamentally different investment than one that runs on gut and group chats.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 48 }}>
            {[
              { stat: "12 min", label: "From trigger to execution" },
              { stat: "3,600×", label: "Execution head start" },
              { stat: "170", label: "Pre-staged playbooks" },
              { stat: "100%", label: "Documented for your board" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center", padding: "24px 16px", border: "1px solid rgba(240,237,228,0.1)", borderRadius: 8 }}>
                <div style={{ ...CG, fontSize: 36, fontWeight: 600, color: GOLD, marginBottom: 6 }}>{s.stat}</div>
                <div style={{ fontSize: 12, color: "rgba(240,237,228,0.5)", letterSpacing: "0.05em" }}>{s.label}</div>
              </div>
            ))}
          </div>

          <Button
            onClick={() => setLocation("/pilot-program")}
            style={{
              background: GOLD, color: "#fff",
              fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
              padding: "18px 36px"
            }}
          >
            Talk to Our Team <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* ── ROI MATH ── */}
      <section style={{ background: "#fff", padding: "80px 48px", borderBottom: `1px solid #E8E4DC` }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 24, height: 2, background: GOLD, flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>
                The ROI Math
              </span>
            </div>
            <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(28px,4vw,40px)", color: NAVY, marginBottom: 12 }}>
              One situation pays for the year.
            </h2>
            <p style={{ fontSize: 16, color: "#6B7280", maxWidth: 540, margin: "0 auto" }}>
              The math is the same whether you have 50 employees or 50,000.
              A situation is a situation.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {[
              {
                situation: "Key customer churns",
                value: "$50K–$500K retained",
                note: "Executed response in 12 minutes vs. a week of reactive scrambling",
                cost: "$1K/month",
              },
              {
                situation: "Top performer leaves",
                value: "$75K–$150K saved",
                note: "Transition playbook activates immediately — coverage gaps closed before they open",
                cost: "$1K/month",
              },
              {
                situation: "Competitor undercuts pricing",
                value: "Revenue protected",
                note: "Counter-response executed in 12 minutes — before the competitor's press release lands",
                cost: "$2.5K/month",
              },
              {
                situation: "Operational crisis hits",
                value: "Reputation + revenue",
                note: "Crisis playbook fires. Stakeholders coordinated. Response documented. Board briefed.",
                cost: "$2.5K/month",
              },
            ].map((r) => (
              <div key={r.situation} style={{ border: `1px solid #E8E4DC`, borderRadius: 12, padding: "28px 24px" }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: GOLD, marginBottom: 10 }}>
                  Situation
                </p>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: NAVY, marginBottom: 12 }}>{r.situation}</h3>
                <p style={{ fontSize: 20, fontWeight: 700, color: TEAL, marginBottom: 10 }}>{r.value}</p>
                <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.55, marginBottom: 16 }}>{r.note}</p>
                <div style={{ borderTop: `1px solid #F3F4F6`, paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#9CA3AF" }}>Platform cost</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{r.cost}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ background: OFF, padding: "80px 48px" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(28px,4vw,40px)", color: NAVY, marginBottom: 12 }}>
              Common questions
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {FAQS.map((faq, i) => (
              <div
                key={i}
                style={{ background: "#fff", border: `1px solid #E8E4DC`, borderRadius: 8, overflow: "hidden" }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "20px 24px", background: "none", border: "none", cursor: "pointer", textAlign: "left"
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 600, color: NAVY }}>{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp style={{ width: 16, height: 16, color: "#9CA3AF", flexShrink: 0 }} />
                    : <ChevronDown style={{ width: 16, height: 16, color: "#9CA3AF", flexShrink: 0 }} />
                  }
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 24px 20px" }}>
                    <p style={{ fontSize: 14, color: "#4B5563", lineHeight: 1.65 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLOSING CTA ── */}
      <section style={{ background: "#fff", padding: "80px 48px", textAlign: "center", borderTop: `1px solid #E8E4DC` }}>
        <div className="max-w-3xl mx-auto">
          <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(30px,4vw,44px)", color: NAVY, marginBottom: 16 }}>
            Ready to execute in 12 minutes?
          </h2>
          <p style={{ fontSize: 17, color: "#4B5563", maxWidth: 560, margin: "0 auto 36px", lineHeight: 1.6 }}>
            Start with Essential. Expand when you're ready.
            No large upfront commitment. Full platform from day one.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              onClick={() => window.location.href = "mailto:sales@vaughnmartin.com?subject=Execution OS - Growth Tier Inquiry"}
              style={{
                background: NAVY, color: "#fff",
                fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
                padding: "18px 36px"
              }}
            >
              Contact Sales <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setLocation("/try-demo")}
              style={{
                borderColor: "#E8E4DC", color: NAVY,
                fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
                padding: "18px 36px"
              }}
            >
              See the Platform First
            </Button>
          </div>
          <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 20 }}>
            Questions? Email <a href="mailto:sales@vaughnmartin.com" style={{ color: GOLD, textDecoration: "none" }}>sales@vaughnmartin.com</a>
          </p>
        </div>
      </section>

    </PageLayout>
  );
}
