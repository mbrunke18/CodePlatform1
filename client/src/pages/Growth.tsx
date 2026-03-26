import { useState, useEffect, CSSProperties } from 'react';
import { useLocation } from 'wouter';
import { updatePageMetadata } from '@/lib/seo';
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Check, X, ArrowRight, ChevronDown, ChevronUp, Shield, Radar, Zap, Globe } from "lucide-react";


const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";
const CG: CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

const TIERS = [
  {
    id: "ready",
    name: "Ready",
    headline: "Be prepared for the moments that matter.",
    annual: 12000,
    monthly: 1000,
    color: TEAL,
    highlight: false,
    badge: null,
    guarantee: true,
    cta: "Get Started",
    ctaAction: "/contact",
    capabilities: [
      { label: "Playbooks", value: "25 essential scenarios" },
      { label: "Strategic domains", value: "2 (choose from 9)" },
      { label: "Users", value: "Unlimited" },
      { label: "Activation", value: "One-click" },
      { label: "Decision rights mapping", value: true },
      { label: "Role assignment", value: true },
      { label: "Real-time dashboard", value: true },
      { label: "Signal detection", value: "5 signal categories" },
      { label: "AI recommendations", value: false },
      { label: "Custom playbooks", value: false },
      { label: "Integrations", value: false },
      { label: "Support", value: "Email + docs" },
    ],
    bestFor: "Companies who need coordination infrastructure for their 3–5 most critical scenarios. One crisis handled well pays for multiple years.",
    roiNote: "One key employee retained or one customer saved = $50K–$500K. You're paying $12K for the infrastructure that makes that outcome reliable — every time.",
  },
  {
    id: "responsive",
    name: "Responsive",
    headline: "See it coming. Act before it hits.",
    annual: 36000,
    monthly: 3000,
    color: GOLD,
    highlight: true,
    badge: "Most Popular",
    guarantee: false,
    cta: "Get Started",
    ctaAction: "/contact",
    capabilities: [
      { label: "Playbooks", value: "75 scenarios" },
      { label: "Strategic domains", value: "5 (choose from 9)" },
      { label: "Users", value: "Unlimited" },
      { label: "Activation", value: "One-click" },
      { label: "Decision rights mapping", value: true },
      { label: "Role assignment", value: true },
      { label: "Real-time dashboard", value: true },
      { label: "Signal detection", value: "Full 16 signal categories" },
      { label: "AI recommendations", value: "Basic IDEA agents" },
      { label: "Custom playbooks", value: "Up to 5" },
      { label: "Integrations", value: "Slack + Email" },
      { label: "Support", value: "Email + chat + onboarding call" },
    ],
    bestFor: "Companies that want proactive detection — seeing threats before they become crises. Signal detection alone changes the operating model.",
    roiNote: "Same ROI as Ready, plus you see it coming. One threat caught early and acted on in 12 minutes is worth 10x the subscription cost.",
  },
  {
    id: "orchestrated",
    name: "Orchestrated",
    headline: "Coordination made invisible.",
    annual: 96000,
    monthly: 8000,
    color: NAVY,
    highlight: false,
    badge: null,
    guarantee: false,
    cta: "Get Started",
    ctaAction: "/pilot-program",
    capabilities: [
      { label: "Playbooks", value: "Full library — all 170" },
      { label: "Strategic domains", value: "All 9" },
      { label: "Users", value: "Unlimited" },
      { label: "Activation", value: "One-click + auto-trigger" },
      { label: "Decision rights mapping", value: true },
      { label: "Role assignment", value: true },
      { label: "Real-time dashboard", value: true },
      { label: "Signal detection", value: "248+ data points, full monitoring" },
      { label: "AI recommendations", value: "Advanced IDEA agents" },
      { label: "Custom playbooks", value: "Unlimited" },
      { label: "Integrations", value: "Slack, Teams, Jira, ServiceNow, Salesforce" },
      { label: "Support", value: "Dedicated success manager + white-glove onboarding" },
    ],
    bestFor: "Companies that want the full coordination operating model. Every domain, every scenario, AI-powered. The organization stops coordinating and starts executing.",
    roiNote: "This is a different operating model — not a tool. When coordination becomes invisible, the compounding effect across every domain changes what the organization can achieve.",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    headline: "Coordination infrastructure at scale.",
    annual: null,
    monthly: null,
    color: NAVY,
    highlight: false,
    badge: "Custom Pricing",
    guarantee: false,
    cta: "Contact Us",
    ctaAction: "/pilot-program",
    capabilities: [
      { label: "Everything in Orchestrated", value: true },
      { label: "Multi-org / Multi-BU", value: true },
      { label: "Custom integrations", value: true },
      { label: "API access", value: true },
      { label: "SSO (Okta, Azure AD)", value: true },
      { label: "Audit logging", value: true },
      { label: "Custom SLA", value: true },
      { label: "Executive briefings", value: "Quarterly" },
      { label: "On-site implementation", value: "Optional" },
      { label: "Pricing", value: "$150K–$500K+/year" },
    ],
    bestFor: "Fortune 1000, PE portfolios, and multi-subsidiary organizations that require full security, multi-org support, and executive-level implementation.",
    roiNote: "At this scale, every day of coordination delay has a measurable dollar cost. The platform pays for itself across a single strategic initiative.",
  },
];

const FAQS = [
  {
    q: "Why is pricing based on capability tiers instead of users?",
    a: "Because users don't drive value — access to coordination capability does. A 50-person company executing a crisis in 12 minutes gets the same outcome as a 50,000-person company. Charging per seat would penalize adoption and reward the wrong behavior. Every tier includes unlimited users.",
  },
  {
    q: "What's the difference between the tiers, really?",
    a: "Depth of coverage and level of intelligence. Ready gives you 25 playbooks across 2 domains with basic signal awareness. Responsive adds proactive detection across 16 signal categories and broader coverage. Orchestrated is the full 170-playbook library with 248+ data point monitoring, advanced AI, and full integrations. Enterprise adds multi-org support, API access, SSO, and custom implementation.",
  },
  {
    q: "Why is signal detection in all tiers?",
    a: "Because seeing it coming is part of the core value. Ready includes awareness across 5 signal categories — enough to surface critical threats. Responsive unlocks the full 16-category detection. Orchestrated adds 248+ data point monitoring. The depth scales; the access doesn't disappear.",
  },
  {
    q: "What's the 30-day guarantee on Ready?",
    a: "For companies starting at the Ready tier, if you activate a playbook in a real situation within 30 days and don't see value, we'll refund the first month. No paperwork. No negotiation. You either see the difference in 12 minutes or you don't pay for it.",
  },
  {
    q: "How does this relate to the Enterprise Pilot ($75K)?",
    a: "The Pilot is for Fortune 1000 companies that want a structured 90-day validation with dedicated implementation — and the $75K is 100% credited toward Year 1. The Ready/Responsive/Orchestrated tiers are designed for growth-stage companies that want to start immediately without a pilot structure. Two different motions, two different buyers.",
  },
  {
    q: "Can I change tiers later?",
    a: "Yes. You carry everything — configurations, activation history, playbook customizations — when you move up. There's no re-onboarding and no data loss. Tier changes take effect at the next billing cycle.",
  },
  {
    q: "Is this the same platform Fortune 1000 companies use?",
    a: "Yes. Same platform, same IDEA Framework, same playbook library, same execution infrastructure. The tier determines the depth of coverage and level of support — not a restricted version of the product.",
  },
];

export default function Growth() {
  const [, setLocation] = useLocation();
  const [annual, setAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    updatePageMetadata({
      title: "Pricing & Plans — Execution OS | VaughnMartin",
      description: "Capability-based pricing for Execution OS. Ready ($12K/yr), Responsive ($36K/yr), Orchestrated ($96K/yr), Enterprise (custom). Unlimited users at every tier.",
      ogTitle: "Execution OS Pricing — Capability-Based, Unlimited Users",
      ogDescription: "Four tiers of coordination infrastructure. No user limits. The same platform Fortune 1000 companies use — with an accessible path in.",
    });
  }, []);

  const getPrice = (tier: typeof TIERS[0]) => {
    if (!tier.annual) return null;
    return annual ? tier.annual : tier.monthly;
  };

  const getPriceLabel = (tier: typeof TIERS[0]) => {
    if (!tier.annual) return null;
    const price = getPrice(tier)!;
    return annual
      ? `$${price.toLocaleString()}/year`
      : `$${price.toLocaleString()}/month`;
  };

  return (
    <PageLayout>

      {/* ── HERO ── */}
      <section style={{ background: "#fff", borderBottom: `1px solid #E8E4DC`, padding: "88px 48px 72px", textAlign: "center" }}>
        <div className="max-w-4xl mx-auto">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 28, height: 2, background: GOLD }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>
              Pricing & Plans
            </span>
            <div style={{ width: 28, height: 2, background: GOLD }} />
          </div>

          <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(38px,5vw,58px)", lineHeight: 1.05, color: NAVY, marginBottom: 20 }}>
            Price reflects the level of<br />
            <em style={{ fontStyle: "italic", color: GOLD }}>coordination capability.</em>
          </h1>

          <p style={{ fontSize: 18, color: "#4B5563", maxWidth: 680, margin: "0 auto 12px", lineHeight: 1.6 }}>
            Not the number of users. Not the size of the company. The depth of coordination
            infrastructure you need — and how much intelligence you want working for you.
          </p>
          <p style={{ fontSize: 15, color: "#9CA3AF", maxWidth: 560, margin: "0 auto 40px" }}>
            Unlimited users at every tier. Same platform Fortune 1000 companies use.
          </p>

          {/* Key signals */}
          <div style={{ display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap" }}>
            {[
              { icon: <Shield style={{ width: 16, height: 16, color: TEAL }} />, text: "Unlimited users" },
              { icon: <Radar style={{ width: 16, height: 16, color: TEAL }} />, text: "Signal detection in all tiers" },
              { icon: <Zap style={{ width: 16, height: 16, color: TEAL }} />, text: "30-day guarantee on Ready" },
              { icon: <Globe style={{ width: 16, height: 16, color: TEAL }} />, text: "Full platform — no locked features" },
            ].map((s) => (
              <div key={s.text} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {s.icon}
                <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{s.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BILLING TOGGLE ── */}
      <section style={{ background: OFF, borderBottom: `1px solid #E8E4DC`, padding: "24px 48px", textAlign: "center" }}>
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
              position: "absolute", top: 3, left: annual ? 25 : 3, transition: "left 0.2s"
            }} />
          </button>
          <span style={{ fontSize: 13, fontWeight: 600, color: annual ? NAVY : "#9CA3AF" }}>Annual</span>
          {annual && (
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: TEAL, background: `rgba(43,138,110,0.1)`, borderRadius: 20, padding: "4px 12px" }}>
              Best Value
            </span>
          )}
        </div>
      </section>

      {/* ── TIER CARDS ── */}
      <section style={{ background: "#fff", padding: "72px 48px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {TIERS.map((tier) => {
              const isEnterprise = tier.id === "enterprise";
              const isOrchestrated = tier.id === "orchestrated";
              return (
                <div
                  key={tier.id}
                  style={{
                    border: tier.highlight ? `2px solid ${GOLD}` : `1px solid #E8E4DC`,
                    borderRadius: 12,
                    padding: "36px 28px",
                    background: tier.highlight ? `rgba(201,168,76,0.03)` : isOrchestrated ? `rgba(10,15,46,0.02)` : "#fff",
                    position: "relative",
                    display: "flex", flexDirection: "column",
                  }}
                >
                  {tier.badge && (
                    <div style={{
                      position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)",
                      background: tier.highlight ? GOLD : NAVY,
                      color: "#fff", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
                      padding: "4px 14px", borderRadius: 20, whiteSpace: "nowrap"
                    }}>
                      {tier.badge}
                    </div>
                  )}

                  {/* Tier name & headline */}
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: tier.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: tier.color }}>
                        {tier.name}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.4 }}>{tier.headline}</p>
                  </div>

                  {/* Price */}
                  {isEnterprise ? (
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ ...CG, fontSize: 32, fontWeight: 600, color: NAVY, marginBottom: 4 }}>Custom</div>
                      <p style={{ fontSize: 12, color: "#9CA3AF" }}>$150K – $500K+/year</p>
                    </div>
                  ) : (
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 2 }}>
                        <span style={{ ...CG, fontSize: 44, fontWeight: 600, color: NAVY, lineHeight: 1 }}>
                          ${(annual ? tier.annual! : tier.monthly!).toLocaleString()}
                        </span>
                        <span style={{ fontSize: 13, color: "#9CA3AF" }}>/{annual ? "year" : "month"}</span>
                      </div>
                      {annual ? (
                        <p style={{ fontSize: 12, color: "#6B7280" }}>≈ ${tier.monthly!.toLocaleString()}/month</p>
                      ) : (
                        <p style={{ fontSize: 12, color: TEAL, fontWeight: 600 }}>Save with annual billing</p>
                      )}
                      {tier.guarantee && (
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 8, background: `rgba(43,138,110,0.08)`, border: `1px solid rgba(43,138,110,0.2)`, borderRadius: 20, padding: "3px 10px" }}>
                          <div style={{ width: 5, height: 5, borderRadius: "50%", background: TEAL }} />
                          <span style={{ fontSize: 10, color: TEAL, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>30-day guarantee</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Capabilities */}
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                    {tier.capabilities.map((cap) => (
                      <li key={cap.label} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, paddingBottom: 8, borderBottom: "1px solid #F9FAFB" }}>
                        <span style={{ fontSize: 12, color: "#6B7280", flexShrink: 0 }}>{cap.label}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: cap.value === false ? "#D1D5DB" : NAVY, textAlign: "right" }}>
                          {cap.value === true ? (
                            <Check style={{ width: 14, height: 14, color: TEAL, display: "inline" }} />
                          ) : cap.value === false ? (
                            <X style={{ width: 13, height: 13, color: "#D1D5DB", display: "inline" }} />
                          ) : (
                            cap.value
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Best for */}
                  <p style={{ fontSize: 12, color: "#9CA3AF", lineHeight: 1.55, marginBottom: 20, paddingTop: 12, borderTop: `1px solid #F3F4F6` }}>
                    <strong style={{ color: "#6B7280" }}>Best for: </strong>{tier.bestFor}
                  </p>

                  {/* CTA */}
                  <button
                    onClick={() => setLocation(tier.ctaAction)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      background: tier.highlight ? GOLD : isOrchestrated || isEnterprise ? NAVY : "#fff",
                      color: tier.highlight || isOrchestrated || isEnterprise ? "#fff" : NAVY,
                      border: tier.highlight || isOrchestrated || isEnterprise ? "none" : `1px solid #E8E4DC`,
                      fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
                      width: "100%", padding: "14px", borderRadius: 6,
                      cursor: "pointer", boxSizing: "border-box"
                    }}
                  >
                    {tier.cta} — {tier.name} <ArrowRight style={{ width: 14, height: 14 }} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WHAT DRIVES VALUE ── */}
      <section style={{ background: OFF, padding: "80px 48px", borderTop: `1px solid #E8E4DC`, borderBottom: `1px solid #E8E4DC` }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 24, height: 2, background: TEAL }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: TEAL }}>
                The Pricing Logic
              </span>
              <div style={{ width: 24, height: 2, background: TEAL }} />
            </div>
            <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(28px,4vw,40px)", color: NAVY, marginBottom: 12 }}>
              Value isn't in users. Value is in outcomes.
            </h2>
            <p style={{ fontSize: 16, color: "#4B5563", maxWidth: 580, margin: "0 auto", lineHeight: 1.6 }}>
              Traditional SaaS charges per seat. That penalizes adoption and rewards the wrong behavior.
              We price on the depth of coordination capability — and every tier has unlimited users.
            </p>
          </div>

          {/* Comparison table */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 700, margin: "0 auto" }}>
            <div style={{ background: "#fff", border: `1px solid #E8E4DC`, borderRadius: 12, padding: "28px 24px" }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: 16 }}>Traditional SaaS</p>
              {[
                "Price per seat",
                "More users = more cost",
                "Penalizes adoption",
                "Company size determines price",
                "Value = access to software",
                "Expansion = more seats",
              ].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
                  <X style={{ width: 13, height: 13, color: "#EF4444", flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 13, color: "#6B7280" }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "#fff", border: `2px solid ${TEAL}`, borderRadius: 12, padding: "28px 24px" }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: TEAL, marginBottom: 16 }}>Execution OS</p>
              {[
                "Price per capability tier",
                "Unlimited users — always",
                "Encourages full adoption",
                "Outcome determines price",
                "Value = coordination capability",
                "Expansion = deeper coverage",
              ].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
                  <Check style={{ width: 13, height: 13, color: TEAL, flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ROI BY TIER ── */}
      <section style={{ background: "#fff", padding: "80px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 24, height: 2, background: GOLD }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>
                The ROI Conversation
              </span>
            </div>
            <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(28px,4vw,40px)", color: NAVY, marginBottom: 12 }}>
              One situation pays for the year.
            </h2>
            <p style={{ fontSize: 16, color: "#4B5563", maxWidth: 540, margin: "0 auto" }}>
              The math holds at every tier. A situation is a situation — the dollar outcome doesn't care about the subscription price.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {TIERS.filter(t => t.id !== "enterprise").map((tier) => (
              <div key={tier.id} style={{ border: `1px solid ${tier.highlight ? GOLD : "#E8E4DC"}`, borderRadius: 12, padding: "28px 24px", background: tier.highlight ? `rgba(201,168,76,0.03)` : "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: tier.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: tier.color }}>{tier.name}</span>
                  {tier.annual && <span style={{ fontSize: 12, color: "#9CA3AF", marginLeft: "auto" }}>${(tier.annual / 1000).toFixed(0)}K/yr</span>}
                </div>
                <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{tier.roiNote}</p>
              </div>
            ))}
            <div style={{ border: `1px solid #E8E4DC`, borderRadius: 12, padding: "28px 24px", background: `rgba(10,15,46,0.02)` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: NAVY, flexShrink: 0 }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: NAVY }}>Enterprise</span>
                <span style={{ fontSize: 12, color: "#9CA3AF", marginLeft: "auto" }}>$150K+/yr</span>
              </div>
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>
                At this scale, every day of coordination delay has a measurable dollar cost. The platform pays for itself across a single strategic initiative.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PE STARTUP DARK SECTION ── */}
      <section style={{ background: NAVY, padding: "80px 48px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 24, height: 2, background: GOLD }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>
              PE-Backed Companies
            </span>
            <div style={{ width: 24, height: 2, background: GOLD }} />
          </div>
          <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(28px,4vw,42px)", color: "#F0EDE4", marginBottom: 20, lineHeight: 1.1 }}>
            Your investors expect operational excellence.<br />
            <em style={{ fontStyle: "italic", color: GOLD }}>Now you have the infrastructure to prove it.</em>
          </h2>
          <p style={{ fontSize: 17, color: "rgba(240,237,228,0.6)", maxWidth: 640, margin: "0 auto 40px", lineHeight: 1.6 }}>
            A portfolio company that executes in 12 minutes instead of 30 days — with documented playbooks,
            activation logs, and board-ready reporting — is a fundamentally different investment.
            Start at Ready. Scale to Orchestrated as the business grows.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16, marginBottom: 40, maxWidth: 640, margin: "0 auto 40px" }}>
            {[
              { stat: "12 min", label: "Trigger to execution" },
              { stat: "3,600×", label: "Execution head start" },
              { stat: "170", label: "Pre-staged playbooks" },
              { stat: "∞", label: "Users at every tier" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center", padding: "20px 12px", border: "1px solid rgba(240,237,228,0.1)", borderRadius: 8 }}>
                <div style={{ ...CG, fontSize: 32, fontWeight: 600, color: GOLD, marginBottom: 4 }}>{s.stat}</div>
                <div style={{ fontSize: 11, color: "rgba(240,237,228,0.45)", letterSpacing: "0.05em" }}>{s.label}</div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setLocation("/contact")}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: GOLD, color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", padding: "16px 32px", borderRadius: 6, border: "none", cursor: "pointer" }}
          >
            Talk to Our Team <ArrowRight style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </section>

      {/* ── ENTERPRISE PILOT CALLOUT ── */}
      <section style={{ background: OFF, padding: "64px 48px", borderBottom: `1px solid #E8E4DC` }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 24, height: 2, background: NAVY }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: NAVY }}>
              Fortune 1000 Entry Path
            </span>
            <div style={{ width: 24, height: 2, background: NAVY }} />
          </div>
          <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(26px,3.5vw,36px)", color: NAVY, marginBottom: 12 }}>
            Founding Partner Pilot — $75K
          </h2>
          <p style={{ fontSize: 16, color: "#4B5563", maxWidth: 600, margin: "0 auto 12px", lineHeight: 1.6 }}>
            For Fortune 1000 companies that want a structured 90-day validation with dedicated implementation.
            The $75K pilot fee is <strong>100% credited toward Year 1</strong> — so you're not paying for a pilot,
            you're prepaying for the deployment.
          </p>
          <p style={{ fontSize: 14, color: "#9CA3AF", marginBottom: 28 }}>
            10 founding partner slots available. Includes custom playbook development, white-glove onboarding, and full ROI documentation.
          </p>
          <Button
            onClick={() => setLocation("/pilot-program")}
            style={{ background: NAVY, color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", padding: "16px 32px" }}
          >
            Apply for Founding Partner Pilot <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ background: "#fff", padding: "80px 48px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(26px,3.5vw,38px)", color: NAVY }}>Common questions</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ background: OFF, border: `1px solid #E8E4DC`, borderRadius: 8, overflow: "hidden" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                >
                  <span style={{ fontSize: 14, fontWeight: 600, color: NAVY, paddingRight: 16 }}>{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp style={{ width: 15, height: 15, color: "#9CA3AF", flexShrink: 0 }} />
                    : <ChevronDown style={{ width: 15, height: 15, color: "#9CA3AF", flexShrink: 0 }} />}
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 24px 20px", background: "#fff" }}>
                    <p style={{ fontSize: 14, color: "#4B5563", lineHeight: 1.7 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLOSING CTA ── */}
      <section style={{ background: "#fff", padding: "80px 48px", textAlign: "center", borderTop: `1px solid #E8E4DC` }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(28px,4vw,42px)", color: NAVY, marginBottom: 16 }}>
            Ready to start executing in 12 minutes?
          </h2>
          <p style={{ fontSize: 16, color: "#4B5563", margin: "0 auto 32px", lineHeight: 1.6 }}>
            Start at Ready with a 30-day guarantee. Scale when you're ready.
            No user limits. No locked features. Full platform from day one.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => setLocation("/contact")}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: NAVY, color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", padding: "16px 32px", borderRadius: 6, border: "none", cursor: "pointer" }}
            >
              Contact Sales <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
            <Button
              variant="outline"
              onClick={() => setLocation("/try-demo")}
              style={{ borderColor: "#E8E4DC", color: NAVY, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", padding: "16px 32px" }}
            >
              See the Platform First
            </Button>
          </div>
          <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 20 }}>
            Questions?{" "}
            <button
              onClick={() => setLocation("/contact")}
              style={{ background: "none", border: "none", color: GOLD, fontSize: 13, cursor: "pointer", padding: 0, textDecoration: "underline" }}
            >
              Contact our team
            </button>
          </p>
        </div>
      </section>

    </PageLayout>
  );
}
