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
      title: "Enterprise Pricing - Readiness OS | Strategic Readiness Platform",
      description: "Value-based pricing for enterprise organizations. Enterprise ($250K), Enterprise Plus ($450K), Global ($750K–$1.5M). Founding Partner Program ($75K, 100% credited to Year 1).",
      ogTitle: "Readiness OS Enterprise Pricing — Built for startup to Fortune 500",
      ogDescription: "Three service tiers from $250K–$1.5M annually. Same platform across every tier — the difference is relationship depth, custom protocol development, and advisory access.",
    });
  }, []);

  return (
    <PageLayout>
      {/* Hero */}
      <section style={{ background: "#fff", borderBottom: "1px solid #E8E4DC", padding: "80px 48px", textAlign: "center" }}>
        <div className="max-w-5xl mx-auto">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Enterprise Pricing</span>
          </div>
          <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(40px,5vw,56px)", lineHeight: 1.05, color: NAVY, marginBottom: 16 }}>
            Built for <em style={{ fontStyle: "italic", color: GOLD }}>startup to Fortune 500</em> Scale
          </h1>
          <p className="text-xl text-[#0A0F2E] mb-4 max-w-2xl mx-auto">
            Transparent, value-based pricing for enterprise strategic readiness
          </p>
          <p className="text-lg text-[#6B7280] max-w-3xl mx-auto">
            Every tier includes the full Readiness OS platform — 180 Readiness Protocols, continuous signal monitoring, and 12-minute response orchestration. The difference between tiers is relationship depth: custom protocol development, advisory sessions, and dedicated team access.
          </p>
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
                <div style={{ ...CG, fontSize: 48, fontWeight: 600, color: TEAL, lineHeight: 1 }}>$75K</div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: TEAL, marginTop: 8 }}>100% credited to Year 1</div>
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

      {/* Annual Subscription Tiers */}
      <section style={{ background: OFF, padding: "80px 48px" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Annual Subscription</span>
            </div>
            <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(28px,4vw,40px)", lineHeight: 1.1, color: NAVY, marginBottom: 16 }}>
              Same Platform. Deeper Partnership.
            </h2>
            <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
              Every tier includes the full Readiness OS platform. You're choosing the level of strategic support your organization needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Enterprise Tier */}
            <div className="border border-[#E8E4DC] bg-white p-8 hover:border-[#0A0F2E] transition-colors" data-testid="card-tier-enterprise">
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B7280", marginBottom: 8 }}>Tier 1</div>
              <h3 style={{ ...CG, fontSize: 32, fontWeight: 600, color: NAVY, marginBottom: 8 }}>Enterprise</h3>
              <p className="text-sm text-[#6B7280] mb-6">1,000–5,000 employees</p>
              <div className="flex items-baseline gap-2 mb-8">
                <span style={{ ...CG, fontSize: 48, fontWeight: 600, color: NAVY }}>$250K</span>
                <span className="text-sm text-[#6B7280]">/ year</span>
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

            {/* Enterprise Plus Tier */}
            <div style={{ background: NAVY, border: `2px solid ${NAVY}`, padding: "40px 32px", position: "relative" }} data-testid="card-tier-enterprise-plus">
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>Tier 2</div>
              <h3 style={{ ...CG, fontSize: 32, fontWeight: 600, color: "#fff", marginBottom: 8 }}>Enterprise Plus</h3>
              <p className="text-sm text-white/60 mb-6">5,000–15,000 employees</p>
              <div className="flex items-baseline gap-2 mb-8">
                <span style={{ ...CG, fontSize: 48, fontWeight: 600, color: GOLD }}>$450K</span>
                <span className="text-sm text-white/60">/ year</span>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Everything in Enterprise",
                  "3 custom Readiness Protocol builds per year",
                  "Monthly strategy sessions",
                  "Advanced integrations (Salesforce, ServiceNow, SAP)",
                  "Priority support — 2-hour SLA",
                  "Executive briefing service",
                  "Multi-division coordination"
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

            {/* Global Tier */}
            <div className="border border-[#E8E4DC] bg-white p-8 hover:border-[#0A0F2E] transition-colors" data-testid="card-tier-global">
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B7280", marginBottom: 8 }}>Tier 3</div>
              <h3 style={{ ...CG, fontSize: 32, fontWeight: 600, color: NAVY, marginBottom: 8 }}>Global</h3>
              <p className="text-sm text-[#6B7280] mb-6">15,000+ employees</p>
              <div className="flex flex-col gap-1 mb-8">
                <span style={{ ...CG, fontSize: 40, fontWeight: 600, color: NAVY }}>Custom</span>
                <span className="text-xs text-[#6B7280]">$750K – $1.5M+ / year</span>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Everything in Enterprise Plus",
                  "Unlimited custom protocol development",
                  "Dedicated account team",
                  "On-site executive advisory visits",
                  "Multi-region deployment",
                  "On-premise deployment option",
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
