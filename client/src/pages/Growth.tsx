import { useState, useEffect, CSSProperties } from 'react';
import { useLocation } from 'wouter';
import aerialCityImg from "@/assets/images/aerial-city-grid.png";
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
    annual: 75000,
    monthly: 7500,
    color: TEAL,
    highlight: false,
    badge: null,
    guarantee: true,
    cta: "Get Started",
    ctaAction: "/contact",
    capabilities: [
      { label: "Readiness Protocols", value: "25 essential scenarios" },
      { label: "Strategic domains", value: "2 (choose from 9)" },
      { label: "Users", value: "Unlimited" },
      { label: "Activation", value: "One-click" },
      { label: "Decision rights mapping", value: true },
      { label: "Role assignment", value: true },
      { label: "Real-time dashboard", value: true },
      { label: "Signal detection", value: "5 signal categories" },
      { label: "System recommendations", value: false },
      { label: "Custom Readiness Protocols", value: false },
      { label: "Integrations", value: false },
      { label: "Support", value: "Email + docs" },
    ],
    bestFor: "Companies who need coordination infrastructure for their 3–5 most critical scenarios. One handled situation pays for multiple years.",
    roiNote: "A vendor dispute mishandled costs $500K–$2M in lost margin and executive time. Handled with a pre-staged Readiness Protocol in 12 minutes, you protect that. One activation at this level returns the annual investment many times over.",
  },
  {
    id: "responsive",
    name: "Responsive",
    headline: "See it coming. Act before it hits.",
    annual: 150000,
    monthly: 15000,
    color: GOLD,
    highlight: true,
    badge: "Most Popular",
    guarantee: false,
    cta: "Get Started",
    ctaAction: "/contact",
    capabilities: [
      { label: "Readiness Protocols", value: "75 scenarios" },
      { label: "Strategic domains", value: "5 (choose from 9)" },
      { label: "Users", value: "Unlimited" },
      { label: "Activation", value: "One-click" },
      { label: "Decision rights mapping", value: true },
      { label: "Role assignment", value: true },
      { label: "Real-time dashboard", value: true },
      { label: "Signal detection", value: "Full 9 strategic domains" },
      { label: "System recommendations", value: "Basic IDEA agents" },
      { label: "Custom Readiness Protocols", value: "Up to 5" },
      { label: "Integrations", value: "Slack + Email" },
      { label: "Support", value: "Email + chat + onboarding call" },
    ],
    bestFor: "Companies that want proactive detection — seeing threats before they become crises. Signal detection across 9 strategic domains changes the operating model.",
    roiNote: "One supply chain disruption caught 48 hours early vs. reactively protects $2M–$10M in revenue. A single caught signal at this level returns the full annual investment.",
  },
  {
    id: "orchestrated",
    name: "Orchestrated",
    headline: "Coordination made invisible.",
    annual: 250000,
    monthly: 25000,
    color: NAVY,
    highlight: false,
    badge: null,
    guarantee: false,
    cta: "Get Started",
    ctaAction: "/contact",
    capabilities: [
      { label: "Readiness Protocols", value: "Full library — all 170" },
      { label: "Strategic domains", value: "All 9" },
      { label: "Users", value: "Unlimited" },
      { label: "Activation", value: "One-click + auto-trigger" },
      { label: "Decision rights mapping", value: true },
      { label: "Role assignment", value: true },
      { label: "Real-time dashboard", value: true },
      { label: "Signal detection", value: "248+ data points, full monitoring" },
      { label: "System recommendations", value: "Advanced IDEA agents" },
      { label: "Custom Readiness Protocols", value: "Unlimited" },
      { label: "Integrations", value: "Slack, Teams, Jira, ServiceNow, Salesforce" },
      { label: "Support", value: "Dedicated success manager + white-glove onboarding" },
    ],
    bestFor: "Companies managing multi-front risk across every domain. M&A disruptions, regulatory shifts, talent crises, competitive entries — happening simultaneously.",
    roiNote: "Organizations managing multi-front threats protect $10M+ per coordinated response. At $250K/year, you are running the full operating model — 170 Readiness Protocols, 248+ data points, and full AI coordination. One activation at this level pays for the year.",
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
    ctaAction: "/contact",
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
    q: "Why is pricing based on deployment scope instead of users?",
    a: "Because headcount doesn't drive execution value — coordination depth does. A 200-person company executing a crisis in 12 minutes gets the same outcome as a 20,000-person company executing the same Readiness Protocol. Charging per seat penalizes adoption and rewards the wrong behavior. Every tier includes unlimited users so you never have to decide who gets access.",
  },
  {
    q: "What exactly changes between tiers?",
    a: "Breadth of deployment and depth of intelligence — not the product itself. Ready activates 25 Readiness Protocols across your 2 most critical domains with foundational signal awareness. Responsive expands to 75 Readiness Protocols across 5 domains with proactive detection across all 9 strategic domains. Orchestrated is the full operating model — 170 Readiness Protocols, all 9 domains, 248+ data points in continuous monitoring, advanced AI, and full integrations. Enterprise adds multi-org deployment, API access, SSO, and dedicated implementation. The platform is the same at every tier.",
  },
  {
    q: "How does the ROI math work at these price points?",
    a: "The math is consistent across all tiers: the value of a single situation handled correctly in 12 minutes — versus weeks of alignment, delay, and reactive cost — far exceeds the annual investment. A vendor dispute mishandled costs $500K–$2M. A supply chain disruption caught late costs $2M–$10M. A regulatory response delayed by 30 days costs multiples of that. The Ready tier at $75K pays for itself on the first activation. Every tier above that protects proportionally more.",
  },
  {
    q: "What's the 30-day guarantee on Ready?",
    a: "For companies starting at the Ready tier, if you activate a Readiness Protocol in a real situation within 30 days and don't see measurable value, we refund the first month. No paperwork. No negotiation. You either see the difference in 12 minutes or you don't pay for it.",
  },
  {
    q: "How does this relate to the Fortune 1000 Enterprise Pilot ($75K)?",
    a: "The Enterprise Pilot is a 90-day structured validation with dedicated implementation, custom Microsoft ecosystem integration, and white-glove onboarding — designed for Fortune 1000 companies at enterprise scale. The $75K pilot fee is 100% credited toward Year 1. The Growth tiers (Ready, Responsive, Orchestrated) are for growth-stage and mid-market companies that want to start immediately with a self-directed or guided deployment. Same platform — different motion, different buyer profile.",
  },
  {
    q: "Can I move up tiers as we grow?",
    a: "Yes. Everything carries forward — configurations, activation history, custom Readiness Protocols, decision rights mappings. There is no re-onboarding and no data loss. You pay the difference at the next billing cycle and immediately gain access to the expanded capability.",
  },
  {
    q: "Is this genuinely the same platform Fortune 1000 companies use?",
    a: "Yes. Same IDEA Framework. Same execution engine. Same 170-Readiness Protocol library. Same 12-minute activation infrastructure. The tier determines how much of the platform you deploy across your organization — not a reduced or restricted version of the product.",
  },
];

export default function Growth() {
  const [, setLocation] = useLocation();
  const [annual, setAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    updatePageMetadata({
      title: "Pricing & Plans — Readiness OS | VaughnMartin",
      description: "Capability-based pricing for Readiness OS. Ready ($75K/yr), Responsive ($150K/yr), Orchestrated ($250K/yr), Enterprise (custom). Unlimited users at every tier. One activation pays for the year.",
      ogTitle: "Readiness OS Pricing — Built on Deployment Scope, Not Headcount",
      ogDescription: "Four tiers of coordination infrastructure. Unlimited users at every tier. The same platform Fortune 1000 companies use — with a structured entry path. One situation handled pays for the year.",
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
      <section style={{ background: NAVY, padding: "96px 48px 80px", textAlign: "center", position: "relative", overflow: "hidden", backgroundImage: `url(${aerialCityImg})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(10,15,46,0.88)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(201,168,76,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.07) 1px,transparent 1px)`, backgroundSize: "48px 48px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: -120, right: -80, width: 800, height: 800, background: "radial-gradient(ellipse,rgba(43,138,110,0.13) 0%,transparent 60%)", pointerEvents: "none" }} />

        <div className="max-w-4xl mx-auto" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 28, height: 2, background: GOLD }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>
              Pricing & Plans
            </span>
            <div style={{ width: 28, height: 2, background: GOLD }} />
          </div>

          <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(38px,5vw,58px)", lineHeight: 1.05, color: "#fff", marginBottom: 20 }}>
            Price reflects how much of the<br />
            <em style={{ fontStyle: "italic", color: GOLD }}>operating model you activate.</em>
          </h1>

          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.65)", maxWidth: 680, margin: "0 auto 12px", lineHeight: 1.6 }}>
            Every tier runs the same platform — the same IDEA Framework, the same execution engine,
            the same 12-minute activation infrastructure. What scales is the breadth of deployment:
            how many domains, how many signals, how deep the intelligence runs.
          </p>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", maxWidth: 600, margin: "0 auto 40px", lineHeight: 1.55 }}>
            One situation handled correctly returns the annual investment many times over.
            Unlimited users at every tier. The same platform Fortune 1000 companies use.
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
                <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>{s.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BILLING TOGGLE ── */}
      <section style={{ background: OFF, borderBottom: `1px solid #E8E4DC`, padding: "24px 48px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 16, background: "#fff", border: `1px solid #E8E4DC`, borderRadius: 0, padding: "6px 6px 6px 20px" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: annual ? "#9CA3AF" : NAVY }}>Monthly</span>
          <button
            onClick={() => setAnnual(!annual)}
            style={{
              width: 48, height: 26, borderRadius: 0,
              background: annual ? NAVY : "#E5E7EB",
              border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s"
            }}
          >
            <div style={{
              width: 20, height: 20, borderRadius: 0, background: "#fff",
              position: "absolute", top: 3, left: annual ? 25 : 3, transition: "left 0.2s"
            }} />
          </button>
          <span style={{ fontSize: 13, fontWeight: 600, color: annual ? NAVY : "#9CA3AF" }}>Annual</span>
          {annual && (
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: TEAL, background: `rgba(43,138,110,0.1)`, borderRadius: 0, padding: "4px 12px" }}>
              Best Value
            </span>
          )}
        </div>
      </section>

      {/* ── UNLIMITED USERS BANNER ── */}
      <div style={{ background: NAVY, padding: "14px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", margin: 0 }}>
          <span style={{ color: GOLD, fontWeight: 700 }}>Every tier includes unlimited users.</span>
          {" "}Unlike per-seat software that charges more as you grow — you pay for execution depth, not headcount. Add everyone who needs to coordinate. The price stays the same.
        </p>
      </div>

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
                    borderRadius: 0,
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
                      color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
                      padding: "4px 14px", borderRadius: 0, whiteSpace: "nowrap"
                    }}>
                      {tier.badge}
                    </div>
                  )}

                  {/* Tier name & headline */}
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 0, background: tier.color, flexShrink: 0 }} />
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
                        <p style={{ fontSize: 12, color: "#6B7280" }}>
                          ≈ ${Math.round(tier.annual! / 12).toLocaleString()}/month &middot;{" "}
                          <span style={{ color: TEAL, fontWeight: 600 }}>
                            Save ${(tier.monthly! * 12 - tier.annual!).toLocaleString()}/yr vs. monthly
                          </span>
                        </p>
                      ) : (
                        <p style={{ fontSize: 12, color: TEAL, fontWeight: 600 }}>
                          Annual saves you ${(tier.monthly! * 12 - tier.annual!).toLocaleString()}/yr — 2 months free
                        </p>
                      )}
                      {tier.guarantee && (
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 8, background: `rgba(43,138,110,0.08)`, border: `1px solid rgba(43,138,110,0.2)`, borderRadius: 0, padding: "3px 10px" }}>
                          <div style={{ width: 5, height: 5, borderRadius: 0, background: TEAL }} />
                          <span style={{ fontSize: 10, color: TEAL, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>30-day guarantee</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ROI note — right below price where eyes land */}
                  <div style={{ background: tier.highlight ? `rgba(201,168,76,0.07)` : `rgba(10,15,46,0.04)`, borderLeft: `3px solid ${tier.color}`, padding: "10px 14px", marginBottom: 20, borderRadius: "0 4px 4px 0" }}>
                    <p style={{ fontSize: 11, color: "#374151", lineHeight: 1.6, margin: 0 }}>
                      <strong style={{ color: tier.color, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" as const }}>ROI — </strong>
                      {tier.roiNote}
                    </p>
                  </div>

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
                      width: "100%", padding: "14px", borderRadius: 0,
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

      {/* ── VALUE GATE STRIP ── */}
      <section style={{ background: OFF, borderTop: `1px solid #E8E4DC`, padding: "48px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "#9CA3AF", marginBottom: 8 }}>What You Gain When You Upgrade</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "clamp(22px,2.5vw,30px)", color: NAVY }}>
              Every tier jump is a capability unlock — not a feature gate.
            </h3>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {[
              {
                from: "Ready", to: "Responsive", arrow: "→", color: GOLD,
                gain: "Early warning replaces reactive response",
                detail: "You move from handling situations to detecting them before they become crises. Full 9-strategic-domain monitoring activates. System recommendations start shaping your response before you've called a meeting. The difference between ready and responsive is the difference between response and prevention.",
                jump: "$75K → $150K/yr",
              },
              {
                from: "Responsive", to: "Orchestrated", arrow: "→", color: NAVY,
                gain: "Coordination becomes invisible infrastructure",
                detail: "Every domain. All 170 Readiness Protocols. 248+ data points in continuous monitoring. The shift from Responsive to Orchestrated is the shift from managed risk to invisible coordination — threats are neutralized before stakeholders even convene. This is where execution velocity becomes a durable competitive advantage.",
                jump: "$150K → $250K/yr",
              },
              {
                from: "Orchestrated", to: "Enterprise", arrow: "→", color: "#6B7280",
                gain: "The operating model scales enterprise-wide",
                detail: "Multi-BU and multi-org deployment. API access for custom integrations. SSO, dedicated implementation, and a named success team. The platform stops being a department tool and becomes the execution infrastructure the entire enterprise runs on.",
                jump: "$250K → Custom",
              },
            ].map((gate) => (
              <div key={gate.from} style={{ background: "#fff", border: `1px solid #E8E4DC`, borderRadius: 0, padding: "28px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>{gate.from}</span>
                  <span style={{ color: gate.color, fontWeight: 700 }}>{gate.arrow}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: gate.color, textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>{gate.to}</span>
                  <span style={{ marginLeft: "auto", fontSize: 10, color: "#9CA3AF", fontWeight: 600 }}>{gate.jump}</span>
                </div>
                <p style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 10, lineHeight: 1.3 }}>{gate.gain}</p>
                <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.65, margin: 0 }}>{gate.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GROWTH PILOT CALLOUT ── */}
      <section style={{ background: `linear-gradient(135deg, rgba(43,138,110,0.06) 0%, rgba(201,168,76,0.06) 100%)`, borderTop: `1px solid #E8E4DC`, borderBottom: `1px solid #E8E4DC`, padding: "48px 48px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", gap: 48, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 400px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 8, height: 8, borderRadius: 0, background: TEAL, flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: TEAL }}>Built-In Pilot</span>
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "clamp(24px,3vw,34px)", color: NAVY, marginBottom: 12, lineHeight: 1.15 }}>
              Want to validate before committing?<br />
              <em style={{ fontStyle: "italic", color: GOLD }}>The Ready tier is your proof point.</em>
            </h3>
            <p style={{ fontSize: 15, color: "#4B5563", lineHeight: 1.65, marginBottom: 0 }}>
              Start with Ready at $7,500/month (or $75,000/year — 2 months free on annual). You get the full platform —
              real signal detection, live activations, unlimited users — deployed across your two most critical domains.
              Run it for 30 days in your actual environment. If it doesn't deliver, we refund the first month.
              No 90-day structured pilot. No custom implementation timeline. Start immediately and see results in your first activation.
            </p>
          </div>
          <div style={{ flex: "0 1 280px", display: "flex", flexDirection: "column" as const, gap: 14 }}>
            {[
              { label: "Full platform access", sub: "All signal detection included" },
              { label: "Unlimited users", sub: "Bring your whole team" },
              { label: "30-day money-back", sub: "If it doesn't deliver, walk away" },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ width: 20, height: 20, borderRadius: 0, background: TEAL, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF" }}>{item.sub}</div>
                </div>
              </div>
            ))}
            <button
              onClick={() => setLocation("/contact")}
              style={{ marginTop: 8, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, background: TEAL, color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, padding: "14px 24px", borderRadius: 0, border: "none", cursor: "pointer" }}
            >
              Start My Pilot <ArrowRight style={{ width: 14, height: 14 }} />
            </button>
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
            <div style={{ background: "#fff", border: `1px solid #E8E4DC`, borderRadius: 0, padding: "28px 24px" }}>
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
            <div style={{ background: "#fff", border: `2px solid ${TEAL}`, borderRadius: 0, padding: "28px 24px" }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: TEAL, marginBottom: 16 }}>Readiness OS</p>
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
              <div key={tier.id} style={{ border: `1px solid ${tier.highlight ? GOLD : "#E8E4DC"}`, borderRadius: 0, padding: "28px 24px", background: tier.highlight ? `rgba(201,168,76,0.03)` : "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 0, background: tier.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: tier.color }}>{tier.name}</span>
                  {tier.annual && <span style={{ fontSize: 12, color: "#9CA3AF", marginLeft: "auto" }}>${(tier.annual / 1000).toFixed(0)}K/yr</span>}
                </div>
                <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{tier.roiNote}</p>
              </div>
            ))}
            <div style={{ border: `1px solid #E8E4DC`, borderRadius: 0, padding: "28px 24px", background: `rgba(10,15,46,0.02)` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: 0, background: NAVY, flexShrink: 0 }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: NAVY }}>Enterprise</span>
                <span style={{ fontSize: 12, color: "#9CA3AF", marginLeft: "auto" }}>$250K+/yr</span>
              </div>
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>
                At Fortune 1000 scale, a single mishandled strategic trigger can cost $10M–$100M in lost value, market position, or regulatory exposure. The platform pays for itself within the first coordinated response.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT YOU'RE REPLACING ── */}
      <section style={{ background: OFF, padding: "80px 48px", borderTop: `1px solid #E8E4DC` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 24, height: 2, background: NAVY }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: NAVY }}>
                The Comparison
              </span>
              <div style={{ width: 24, height: 2, background: NAVY }} />
            </div>
            <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(28px,4vw,40px)", color: NAVY, marginBottom: 12 }}>
              What the status quo actually costs you.
            </h2>
            <p style={{ fontSize: 16, color: "#4B5563", maxWidth: 620, margin: "0 auto", lineHeight: 1.6 }}>
              Before comparing tier prices, compare them against what you're already spending on coordination that doesn't execute.
            </p>
          </div>

          <div style={{ background: "#fff", border: `1px solid #E8E4DC`, borderRadius: 0, overflow: "hidden" }}>
            {/* Table header */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 180px 1fr", background: NAVY, padding: "14px 28px", gap: 16 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(240,237,228,0.5)" }}>What Companies Buy Today</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(240,237,228,0.5)", textAlign: "center" as const }}>Cost</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(240,237,228,0.5)" }}>The Problem</span>
            </div>

            {[
              { item: "McKinsey crisis Readiness Protocol engagement", cost: "$150K–$500K", problem: "One-time. Not executable. Sits on a shelf." },
              { item: "Enterprise OKR / strategy tool", cost: "$50K–$150K/yr", problem: "Tracks goals. Doesn't execute them." },
              { item: "War-room consulting (per incident)", cost: "$50K–$200K", problem: "Reactive. Expensive. Not repeatable." },
              { item: "Internal strategy ops team", cost: "$500K–$2M/yr", problem: "3–5 FTEs. Still takes 30 days to coordinate." },
              { item: "The coordination tax (hidden)", cost: "Incalculable", problem: "30% of strategy value lost in execution gaps." },
            ].map((row, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 180px 1fr", padding: "18px 28px", gap: 16, borderBottom: i < 4 ? `1px solid #F3F4F6` : "none", background: i % 2 === 0 ? "#fff" : "#FAFAF9" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{row.item}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#EF4444", textAlign: "center" as const }}>{row.cost}</span>
                <span style={{ fontSize: 13, color: "#6B7280" }}>{row.problem}</span>
              </div>
            ))}

            {/* Summary bar */}
            <div style={{ background: `rgba(239,68,68,0.06)`, borderTop: `2px solid rgba(239,68,68,0.2)`, padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Total cost of status quo: </span>
                <span style={{ fontSize: 16, fontWeight: 800, color: "#DC2626" }}>$750K–$2.5M/year</span>
              </div>
              <span style={{ fontSize: 13, color: "#6B7280", fontStyle: "italic" }}>And it still takes 30 days to coordinate.</span>
            </div>
          </div>

          {/* Bridge to Readiness OS */}
          <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {[
              { tier: "Ready", price: "$75K/yr", replace: "One consulting engagement", roi: "7–70×" },
              { tier: "Responsive", price: "$150K/yr", replace: "Intelligence subscription + Readiness Protocol development", roi: "10–100×" },
              { tier: "Orchestrated", price: "$250K/yr", replace: "Fractional strategy ops team", roi: "2–8× (cost replacement alone)" },
              { tier: "Enterprise", price: "$250K+/yr", replace: "Full strategy ops function", roi: "40–400×" },
            ].map((row) => (
              <div key={row.tier} style={{ background: "#fff", border: `1px solid #E8E4DC`, borderRadius: 0, padding: "20px 20px", display: "flex", flexDirection: "column" as const, gap: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: NAVY }}>{row.tier}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: TEAL }}>{row.roi} ROI</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: GOLD }}>{row.price}</div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>Replaces: {row.replace}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ONE TRIGGER HANDLED WELL ── */}
      <section style={{ background: "#fff", padding: "80px 48px", borderTop: `1px solid #E8E4DC` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 24, height: 2, background: GOLD }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: GOLD }}>
                The Math
              </span>
              <div style={{ width: 24, height: 2, background: GOLD }} />
            </div>
            <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(28px,4vw,40px)", color: NAVY, marginBottom: 12 }}>
              One trigger handled well.
            </h2>
            <p style={{ fontSize: 16, color: "#4B5563", maxWidth: 580, margin: "0 auto", lineHeight: 1.6 }}>
              Every scenario below represents a situation your organization will face. The question isn't whether — it's whether you're ready when it fires.
            </p>
          </div>

          <div style={{ background: "#fff", border: `1px solid #E8E4DC`, borderRadius: 0, overflow: "hidden" }}>
            {/* Header */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 180px", background: NAVY, padding: "14px 28px", gap: 16 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(240,237,228,0.5)" }}>Scenario</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(240,237,228,0.5)" }}>Without Readiness OS</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(240,237,228,0.5)", textAlign: "right" as const }}>Value Protected</span>
            </div>

            {[
              { scenario: "Key customer at risk", without: "30 days to align. Customer churns.", value: "$500K–$5M" },
              { scenario: "Competitor launches aggressively", without: "Weeks to respond. Market share lost.", value: "$1M–$10M" },
              { scenario: "Regulatory change announced", without: "Months of scrambling. Potential fines.", value: "$500K–$50M" },
              { scenario: "Key executive departs suddenly", without: "Chaos. Talent flight. Vacuum at the top.", value: "$2M–$10M" },
              { scenario: "M&A integration begins", without: "18-month drag. Significant value leakage.", value: "20–30% of deal value" },
            ].map((row, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 180px", padding: "18px 28px", gap: 16, borderBottom: i < 4 ? `1px solid #F3F4F6` : "none", background: i % 2 === 0 ? "#fff" : "#FAFAF9" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{row.scenario}</span>
                <span style={{ fontSize: 13, color: "#6B7280", fontStyle: "italic" }}>{row.without}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: TEAL, textAlign: "right" as const }}>{row.value}</span>
              </div>
            ))}

            {/* Conclusion bar */}
            <div style={{ background: `rgba(43,138,110,0.06)`, borderTop: `2px solid rgba(43,138,110,0.2)`, padding: "20px 28px" }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#374151", margin: 0, textAlign: "center" as const }}>
                If Readiness OS helps you handle <em style={{ fontStyle: "italic", color: TEAL }}>one</em> of these situations well,
                it pays for itself <strong style={{ color: NAVY }}>10–100×.</strong>
              </p>
            </div>
          </div>

          {/* Link to McKinsey comparison */}
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <button
              onClick={() => setLocation("/vs-consulting")}
              style={{ background: "none", border: `1px solid #E8E4DC`, borderRadius: 0, padding: "10px 20px", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#6B7280", display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              See how this compares to a McKinsey engagement <ArrowRight style={{ width: 13, height: 13 }} />
            </button>
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
            A portfolio company that executes in 12 minutes instead of 30 days — with documented Readiness Protocols,
            activation logs, and board-ready reporting — is a fundamentally different investment.
            Start at Ready. Scale to Orchestrated as the business grows.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16, marginBottom: 40, maxWidth: 640, margin: "0 auto 40px" }}>
            {[
              { stat: "12 min", label: "Trigger to execution" },
              { stat: "3,600×", label: "Execution head start" },
              { stat: "170", label: "Pre-staged Readiness Protocols" },
              { stat: "∞", label: "Users at every tier" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center", padding: "20px 12px", border: "1px solid rgba(240,237,228,0.1)", borderRadius: 0 }}>
                <div style={{ ...CG, fontSize: 32, fontWeight: 600, color: GOLD, marginBottom: 4 }}>{s.stat}</div>
                <div style={{ fontSize: 11, color: "rgba(240,237,228,0.45)", letterSpacing: "0.05em" }}>{s.label}</div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setLocation("/contact")}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: GOLD, color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", padding: "16px 32px", borderRadius: 0, border: "none", cursor: "pointer" }}
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
            10 founding partner slots available. Includes custom Readiness Protocol development, white-glove onboarding, and full ROI documentation.
          </p>
          <Button
            onClick={() => setLocation("/request-access")}
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
              <div key={i} style={{ background: OFF, border: `1px solid #E8E4DC`, borderRadius: 0, overflow: "hidden" }}>
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
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: NAVY, color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", padding: "16px 32px", borderRadius: 0, border: "none", cursor: "pointer" }}
            >
              Contact Sales <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
            <Button
              variant="outline"
              onClick={() => setLocation("/request-access")}
              style={{ borderColor: "#E8E4DC", color: NAVY, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", padding: "16px 32px" }}
            >
              Request Executive Access
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
