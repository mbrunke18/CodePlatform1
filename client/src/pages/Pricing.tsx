import { useEffect, CSSProperties } from 'react';
import { useLocation } from 'wouter';
import { updatePageMetadata } from '@/lib/seo';
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";
const CG: CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

export default function Pricing() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    updatePageMetadata({
      title: "Platform Tiers — Readiness OS | Strategic Readiness Platform",
      description: "Three tiers of enterprise strategic readiness: Core, Foresight, and Enterprise. Full platform access — 180 Readiness Protocols, continuous signal monitoring, 12-minute response orchestration. Contact us for pricing.",
      ogTitle: "Readiness OS — Core · Foresight · Enterprise",
      ogDescription: "Three product tiers built for startup to Fortune 500. Full 180-Protocol platform, Digital Twin simulation, and autonomous protocol evolution. Contact us for value-based pricing.",
    });
  }, []);

  return (
    <PageLayout>
      {/* Hero */}
      <section style={{ background: "#fff", borderBottom: "1px solid #E8E4DC", padding: "80px 48px", textAlign: "center" }}>
        <div className="max-w-5xl mx-auto">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Platform Tiers</span>
          </div>
          <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(40px,5vw,56px)", lineHeight: 1.05, color: NAVY, marginBottom: 16 }}>
            Built for <em style={{ fontStyle: "italic", color: GOLD }}>startup to Fortune 500</em> Scale
          </h1>
          <p className="text-xl text-[#0A0F2E] mb-4 max-w-2xl mx-auto">
            Value-based pricing for enterprise strategic readiness
          </p>
          <p className="text-lg text-[#6B7280] max-w-3xl mx-auto">
            Every tier includes the full Readiness OS platform — 180 Readiness Protocols, continuous signal monitoring, and 12-minute response orchestration. Core delivers the complete operating model. Foresight adds Digital Twin simulation and predictive foresight. Enterprise activates the autonomous evolution network: protocols that improve across every client activation.
          </p>
          <div style={{ marginTop: 32 }}>
            <Button
              onClick={() => setLocation("/contact")}
              style={{ background: NAVY, color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", padding: "16px 32px" }}
            >
              Contact Us for Pricing <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Founding Partner Program */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 28, height: 2, background: TEAL, flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: TEAL }}>Founding Partner Program</span>
            </div>
            <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(28px,4vw,40px)", lineHeight: 1.1, color: NAVY, marginBottom: 16 }}>
              Join Our Founding Partners
            </h2>
            <p className="text-xl text-[#6B7280] max-w-3xl mx-auto">
              We're selecting 10 organizations for our 90-day validation partnership. Full platform access, dedicated implementation support, and 100% of the program fee credited to your Year 1 annual subscription — sized to your organization.
            </p>
          </div>

          <div className="border border-[#E8E4DC] bg-white p-8 max-w-4xl mx-auto" data-testid="card-early-access">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h3 style={{ ...CG, fontSize: 32, fontWeight: 600, color: NAVY }}>
                  Founding Partner Program
                </h3>
                <p className="text-[#6B7280] mt-2">
                  90-day strategic validation partnership with full platform access
                </p>
              </div>
              <div className="text-left md:text-right">
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: TEAL, marginBottom: 6 }}>Program Fee</div>
                <div style={{ ...CG, fontSize: 22, fontWeight: 600, color: TEAL, lineHeight: 1.3 }}>100% credited to Year 1 subscription</div>
                <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>Contact us to discuss program sizing</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h4 style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: NAVY, marginBottom: 16 }}>What's Included</h4>
                <ul className="space-y-3">
                  {[
                    "Full platform access — 180 Readiness Protocols",
                    "Dedicated implementation team",
                    "3 custom Readiness Protocol builds",
                    "Weekly strategy sessions",
                    "ROI measurement & board-ready documentation",
                    "Day 60 success review with go / no-go optionality"
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[#6B7280]">
                      <Check className="w-4 h-4 text-[#2B8A6E] shrink-0 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: NAVY, marginBottom: 16 }}>Who Qualifies</h4>
                <ul className="space-y-3">
                  {[
                    "Any organization facing strategic triggers",
                    "VP+ decision authority with budget access",
                    "Active strategic execution challenges",
                    "Commitment to 90-day validation",
                    "Willingness to co-develop and provide feedback"
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[#6B7280]">
                      <Check className="w-4 h-4 text-[#2B8A6E] shrink-0 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Button
              size="lg"
              onClick={() => setLocation("/contact")}
              style={{ background: NAVY, color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", width: "100%", padding: "20px" }}
              data-testid="button-apply-early-access"
            >
              Apply for Founding Partner Access <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Tier Comparison Table */}
      <section style={{ background: OFF, padding: "64px 48px 0", borderTop: "1px solid #E8E4DC" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: GOLD }}>What Changes Across Tiers</span>
            </div>
            <p style={{ fontSize: 15, color: "#6B7280", maxWidth: 600, margin: "0 auto" }}>Core delivers the full readiness platform. Foresight adds the Digital Twin and predictive foresight layer. Enterprise adds full network learning and unlimited protocol evolution.</p>
          </div>
          <div style={{ border: "1px solid #E8E4DC", background: "#fff", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr" }}>
              {/* Header row */}
              <div style={{ padding: "14px 20px", background: NAVY, borderRight: "1px solid rgba(255,255,255,0.08)" }} />
              {[
                { tier: "Core" },
                { tier: "Foresight" },
                { tier: "Enterprise" },
              ].map((t, i) => (
                <div key={t.tier} style={{ padding: "18px 16px", background: i === 1 ? NAVY : "#132558", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none", textAlign: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: i === 1 ? GOLD : "rgba(255,255,255,0.85)", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>{t.tier}</div>
                </div>
              ))}
              {/* Rows */}
              {[
                { feature: "Full 180-Protocol Library", e: "✓", ep: "✓", g: "✓" },
                { feature: "221 trigger patterns monitored", e: "✓", ep: "✓", g: "✓" },
                { feature: "12-minute response orchestration", e: "✓", ep: "✓", g: "✓" },
                { feature: "Standard integrations (Slack, Jira, Email)", e: "✓", ep: "✓", g: "✓" },
                { feature: "Advanced integrations (Salesforce, ServiceNow, SAP)", e: "—", ep: "✓", g: "✓" },
                { feature: "Digital Twin activation simulation", e: "—", ep: "✓", g: "✓" },
                { feature: "Predictive foresight alerts (advance warning)", e: "—", ep: "✓", g: "✓" },
                { feature: "Custom protocol builds per year", e: "—", ep: "3", g: "Unlimited" },
                { feature: "Strategy sessions", e: "Quarterly", ep: "Monthly", g: "Dedicated team" },
                { feature: "Support SLA", e: "24-hour", ep: "2-hour", g: "Custom" },
                { feature: "Autonomous protocol evolution network", e: "—", ep: "—", g: "✓" },
                { feature: "Multi-region / on-premise deployment", e: "—", ep: "—", g: "✓" },
                { feature: "Founding Partner credit eligible", e: "✓", ep: "✓", g: "✓" },
              ].map((row, i) => (
                <div key={row.feature} style={{ display: "contents" }}>
                  <div style={{ padding: "12px 20px", background: i % 2 === 0 ? "#fff" : "#F8F7F4", borderBottom: "1px solid #F3F4F6", borderRight: "1px solid #E8E4DC", fontSize: 13, color: NAVY, fontWeight: 500 }}>{row.feature}</div>
                  {[row.e, row.ep, row.g].map((val, j) => (
                    <div key={j} style={{ padding: "12px 16px", background: i % 2 === 0 ? (j === 1 ? `${NAVY}06` : "#fff") : (j === 1 ? `${NAVY}09` : "#F8F7F4"), borderBottom: "1px solid #F3F4F6", borderRight: j < 2 ? "1px solid #E8E4DC" : "none", textAlign: "center", fontSize: 12, fontWeight: val === "✓" ? 700 : 500, color: val === "✓" ? TEAL : val === "—" ? "#D1D5DB" : NAVY }}>
                      {val}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Industry Protocol Packs */}
      <section style={{ background: OFF, padding: "64px 48px" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 28, height: 2, background: TEAL, flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: TEAL }}>Industry Protocol Packs</span>
            </div>
            <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(24px,3vw,34px)", color: NAVY, marginBottom: 10 }}>Platform Core + Industry Depth</h2>
            <p style={{ fontSize: 15, color: "#6B7280", maxWidth: 580, margin: "0 auto" }}>
              The 180-Protocol Core Library covers every strategic domain. Industry Packs add 30 pre-built protocols specific to your sector's triggers, regulators, and stakeholders.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {[
              { sector: "Financial Services", protocols: "30 protocols", triggers: "SEC enforcement, liquidity events, regulatory examinations, activist investors, M&A windows" },
              { sector: "Healthcare & Life Sciences", protocols: "30 protocols", triggers: "FDA recalls, CMS audits, clinical trial events, formulary changes, patient safety triggers" },
              { sector: "Energy & Utilities", protocols: "30 protocols", triggers: "Grid disruptions, FERC filings, environmental incidents, pipeline events, rate cases" },
              { sector: "Manufacturing & Supply Chain", protocols: "30 protocols", triggers: "Supplier failures, production disruptions, product recalls, tariff shifts, labor actions" },
              { sector: "Consumer & Retail", protocols: "30 protocols", triggers: "Product safety events, social media crises, competitor launches, seasonal demand surges" },
              { sector: "Technology & SaaS", protocols: "30 protocols", triggers: "Data breaches, outages, competitive threats, M&A defense, regulatory inquiry" },
            ].map((pack) => (
              <div key={pack.sector} style={{ background: "#fff", border: "1px solid #E8E4DC", padding: "24px 22px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: TEAL, marginBottom: 8 }}>{pack.protocols}</div>
                <h3 style={{ ...CG, fontSize: 20, fontWeight: 600, color: NAVY, marginBottom: 8 }}>{pack.sector}</h3>
                <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.6, marginBottom: 14 }}>{pack.triggers}</p>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>Add-on to any tier — contact for pricing</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24, padding: "16px 24px", background: NAVY, textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", margin: 0 }}>
              <span style={{ color: GOLD, fontWeight: 700 }}>Founding Partners receive one Industry Pack included</span> — selected during onboarding based on your primary sector.
            </p>
          </div>
        </div>
      </section>

      {/* Annual Subscription Tiers */}
      <section style={{ background: OFF, padding: "80px 48px" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Annual Subscription</span>
            </div>
            <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(28px,4vw,40px)", lineHeight: 1.1, color: NAVY, marginBottom: 16 }}>
              Three Layers of Readiness.
            </h2>
            <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
              Core delivers the full readiness platform. Foresight adds predictive foresight and Digital Twin simulation. Enterprise adds network-wide autonomous evolution and the full Microsoft ecosystem depth.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Core Tier */}
            <div className="border border-[#E8E4DC] bg-white p-8 hover:border-[#0A0F2E] transition-colors" data-testid="card-tier-core">
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B7280", marginBottom: 8 }}>Tier 1</div>
              <h3 style={{ ...CG, fontSize: 32, fontWeight: 600, color: NAVY, marginBottom: 8 }}>Core</h3>
              <div className="mb-8">
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6B7280", marginBottom: 4 }}>Annual Subscription</div>
                <div style={{ fontSize: 13, color: "#9CA3AF" }}>Contact us for value-based pricing</div>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Full platform — 180 Readiness Protocols",
                  "Continuous signal monitoring (221 triggers)",
                  "12-minute response orchestration",
                  "Standard integrations (Slack, Jira, Email)",
                  "Dedicated Customer Success Manager",
                  "Quarterly strategy reviews",
                  "99.9% uptime SLA"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-[#6B7280]">
                    <Check className="w-4 h-4 text-[#2B8A6E]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                className="w-full"
                style={{ border: "1.5px solid #E8E4DC", color: NAVY, background: "transparent", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}
                onClick={() => setLocation("/contact")}
              >
                Contact Sales
              </Button>
            </div>

            {/* Foresight Tier */}
            <div style={{ background: NAVY, border: `2px solid ${NAVY}`, padding: "40px 32px", position: "relative" }} data-testid="card-tier-foresight">
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>Tier 2</div>
              <h3 style={{ ...CG, fontSize: 32, fontWeight: 600, color: "#fff", marginBottom: 8 }}>Foresight</h3>
              <div className="mb-8">
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 4 }}>Annual Subscription</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Contact us for value-based pricing</div>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Everything in Core",
                  "Digital Twin activation simulation",
                  "Predictive foresight alerts — advance warning",
                  "3 custom Readiness Protocol builds per year",
                  "Monthly strategy sessions",
                  "Advanced integrations (Salesforce, ServiceNow, SAP)",
                  "Priority support — 2-hour SLA"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-white/80">
                    <Check className="w-4 h-4 text-[#C9A84C]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178]"
                style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", border: "none" }}
                onClick={() => setLocation("/contact")}
              >
                Contact Sales
              </Button>
            </div>

            {/* Enterprise Tier */}
            <div className="border border-[#E8E4DC] bg-white p-8 hover:border-[#0A0F2E] transition-colors" data-testid="card-tier-enterprise">
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B7280", marginBottom: 8 }}>Tier 3</div>
              <h3 style={{ ...CG, fontSize: 32, fontWeight: 600, color: NAVY, marginBottom: 8 }}>Enterprise</h3>
              <div className="mb-8">
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6B7280", marginBottom: 4 }}>Custom Engagement</div>
                <div style={{ fontSize: 13, color: "#9CA3AF" }}>Contact us to scope your program</div>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Everything in Foresight",
                  "Autonomous protocol evolution network",
                  "Unlimited custom protocol development",
                  "Dedicated account team",
                  "On-site executive advisory visits",
                  "Multi-region / on-premise deployment",
                  "Executive Advisory Board access",
                  "Custom SLA agreements"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-[#6B7280]">
                    <Check className="w-4 h-4 text-[#2B8A6E]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                className="w-full"
                style={{ border: "1.5px solid #E8E4DC", color: NAVY, background: "transparent", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}
                onClick={() => setLocation("/contact")}
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
