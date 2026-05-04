import { Link } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import { BrandStamp } from "@/components/BrandStamp";
import {
  Building2, Cpu, Factory, Zap, ShoppingCart, Heart,
  ArrowRight, Shield, CheckCircle2, Layers, Globe,
  ChevronRight, Lock,
} from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const IVORY = "#F0EDE4";

interface IndustryPack {
  key: string;
  name: string;
  tagline: string;
  industryProtocols: number;
  icon: any;
  iconBg: string;
  scenarios: string[];
  sampleTriggers: string[];
  badge?: string;
}

const INDUSTRY_PACKS: IndustryPack[] = [
  {
    key: "financial_services",
    name: "Financial Services",
    tagline: "SWIFT failures to rogue traders — pre-staged before they fire.",
    industryProtocols: 8,
    icon: Building2,
    iconBg: "#1B4F72",
    scenarios: [
      "SWIFT / Payment System Disruption",
      "Algorithmic Trading Malfunction",
      "Liquidity Crisis & Bank Run",
      "Crypto / Digital Asset Incident",
      "Correspondent Bank Failure",
      "Commodity Trading Rogue Trader",
      "Compliance Breach (DORA / Basel III)",
      "Portfolio Rebalancing Cascade",
    ],
    sampleTriggers: ["Payment rail outage", "Algo flash crash detected", "Regulatory breach signal"],
    badge: "Most Requested",
  },
  {
    key: "technology",
    name: "Technology",
    tagline: "Platform migrations to developer exodus — execution ready in advance.",
    industryProtocols: 7,
    icon: Cpu,
    iconBg: "#1A5276",
    scenarios: [
      "API Deprecation Crisis",
      "Viral Bug / Feature Backfire",
      "Developer Exodus",
      "Open Source Controversy",
      "Platform Migration (Strategic)",
      "API Ecosystem Expansion",
      "Technical Standard Setting",
    ],
    sampleTriggers: ["API deprecation notice", "GitHub incident spike", "Key engineer departure signal"],
  },
  {
    key: "manufacturing",
    name: "Manufacturing",
    tagline: "Supplier cascades to labor strikes — mobilization compressed to minutes.",
    industryProtocols: 5,
    icon: Factory,
    iconBg: "#1E4D3B",
    scenarios: [
      "Manufacturing Facility Disruption",
      "Tier 2 Supplier Cascade Failure",
      "Critical Tooling Failure",
      "Labor Strike / Walkout",
      "Compound: Geopolitical + Supply Chain",
    ],
    sampleTriggers: ["Supplier bankruptcy signal", "Facility production halt", "Labor action detected"],
  },
  {
    key: "energy",
    name: "Energy",
    tagline: "Pipeline ruptures to climate occupations — response staged before impact.",
    industryProtocols: 4,
    icon: Zap,
    iconBg: "#7D4E00",
    scenarios: [
      "Pipeline Rupture / Environmental Release",
      "Renewable Integration Failure",
      "Climate Protest / Facility Occupation",
      "Compound: Climate + Operations Cascade",
    ],
    sampleTriggers: ["Environmental sensor breach", "Renewable grid instability", "Activist mobilization signal"],
  },
  {
    key: "retail",
    name: "Retail",
    tagline: "Viral trends to multi-brand launches — the window opens for 12 minutes.",
    industryProtocols: 2,
    icon: ShoppingCart,
    iconBg: "#4A235A",
    scenarios: [
      "Strategic Market Entry — Multi-Brand Launch",
      "Trend Capitalization — Viral Fashion Response",
    ],
    sampleTriggers: ["Viral social signal detected", "Competitor market entry alert", "Consumer sentiment surge"],
  },
  {
    key: "healthcare",
    name: "Healthcare",
    tagline: "Product recalls to safety crises — response staged, not scrambled.",
    industryProtocols: 1,
    icon: Heart,
    iconBg: "#7B241C",
    scenarios: [
      "Product Recall (Class I — Safety)",
    ],
    sampleTriggers: ["FDA safety signal", "Adverse event cluster detected", "Supply chain contamination alert"],
    badge: "Expanding",
  },
];

const CORE_CAPABILITIES = [
  "Competitive displacement response",
  "M&A Day 1 readiness",
  "Executive leadership transition",
  "Ransomware & cyber breach",
  "Regulatory investigation response",
  "Supply chain disruption",
  "Geopolitical escalation",
  "Activist investor response",
  "Brand & reputational crisis",
  "Workforce restructuring",
  "Market entry acceleration",
  "Digital transformation cascades",
];

export default function IndustryPacksHub() {
  const totalIndustryProtocols = INDUSTRY_PACKS.reduce((s, p) => s + p.industryProtocols, 0);
  const coreProtocols = 170 - totalIndustryProtocols;

  return (
    <PageLayout>
      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden"
        style={{ background: NAVY }}
      >
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle at 70% 40%, #C9A84C 0%, transparent 60%)" }} />
        <div className="max-w-6xl mx-auto px-6 py-24 relative z-10">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px w-8" style={{ background: GOLD }} />
            <span className="text-xs tracking-[0.2em] font-semibold uppercase" style={{ color: GOLD }}>
              Platform Architecture
            </span>
          </div>
          <h1 className="font-bold leading-tight mb-6" style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2.4rem, 5vw, 4rem)", color: IVORY }}>
            One Platform.{" "}
            <span style={{ color: GOLD, fontStyle: "italic" }}>Every Industry.</span>
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mb-4" style={{ color: "#A8B4C8" }}>
            Readiness OS is built in two tiers. A{" "}
            <strong style={{ color: IVORY }}>Core Platform</strong> of {coreProtocols} cross-industry Readiness
            Protocols that every Fortune 1000 needs — plus{" "}
            <strong style={{ color: IVORY }}>Industry Protocol Packs</strong> that go
            deep on the scenarios unique to your vertical.
          </p>
          <p className="text-base max-w-2xl mb-10" style={{ color: "#7A8FA8" }}>
            The response is ready before the trigger fires — whether you're a bank facing a SWIFT outage
            or a manufacturer watching a supplier cascade unfold.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/request-access">
              <button
                className="px-7 py-3 text-sm font-semibold tracking-wide transition-all"
                style={{ background: GOLD, color: NAVY, borderRadius: "0.15rem" }}
              >
                Apply for Founding Partner Access →
              </button>
            </Link>
            <Link href="/playbook-library">
              <button
                className="px-7 py-3 text-sm font-semibold tracking-wide border transition-all"
                style={{ borderColor: "#3A4A6A", color: IVORY, background: "transparent", borderRadius: "0.15rem" }}
              >
                Browse All 170 Protocols
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── TWO-TIER ARCHITECTURE ── */}
      <section style={{ background: "#F7F5EF" }} className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-6" style={{ background: GOLD }} />
              <span className="text-xs tracking-[0.2em] font-semibold uppercase" style={{ color: GOLD }}>
                The Architecture
              </span>
              <div className="h-px w-6" style={{ background: GOLD }} />
            </div>
            <h2 className="text-3xl font-bold mb-4" style={{ color: NAVY, fontFamily: "Cormorant Garamond, serif", fontSize: "2.2rem" }}>
              The Two-Tier Readiness Model
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: "#4A5568" }}>
              Every organization gets the Core Platform. Your industry layer activates
              the scenarios specific to your competitive context.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Tier 1 — Core */}
            <div className="rounded-sm border-2 p-8" style={{ borderColor: GOLD, background: "#fff" }}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-xs tracking-[0.18em] font-semibold uppercase mb-2" style={{ color: GOLD }}>
                    Tier 1 — Foundation
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: NAVY, fontFamily: "Cormorant Garamond, serif", fontSize: "1.6rem" }}>
                    Readiness OS Core
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold" style={{ color: NAVY }}>{coreProtocols}</div>
                  <div className="text-xs font-medium" style={{ color: "#6B7280" }}>Cross-Industry<br />Protocols</div>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "#4A5568" }}>
                The universal operating model layer. Every Fortune 1000 faces these scenarios —
                competitive disruption, cyber events, regulatory pressure, leadership transitions,
                M&A execution. Pre-staged for any organization.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {CORE_CAPABILITIES.map(cap => (
                  <div key={cap} className="flex items-center gap-2">
                    <CheckCircle2 size={13} style={{ color: GOLD, flexShrink: 0 }} />
                    <span className="text-xs font-medium" style={{ color: "#374151" }}>{cap}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-5 border-t" style={{ borderColor: "#E5E7EB" }}>
                <Link href="/playbook-library">
                  <span className="text-sm font-semibold flex items-center gap-1 cursor-pointer" style={{ color: NAVY }}>
                    Browse Core Protocols <ArrowRight size={14} />
                  </span>
                </Link>
              </div>
            </div>

            {/* Tier 2 — Industry Packs */}
            <div className="rounded-sm border p-8" style={{ borderColor: "#D1D5DB", background: "#fff" }}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-xs tracking-[0.18em] font-semibold uppercase mb-2" style={{ color: "#6B7280" }}>
                    Tier 2 — Vertical Depth
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: NAVY, fontFamily: "Cormorant Garamond, serif", fontSize: "1.6rem" }}>
                    Industry Protocol Packs
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold" style={{ color: NAVY }}>{totalIndustryProtocols}</div>
                  <div className="text-xs font-medium" style={{ color: "#6B7280" }}>Industry-Specific<br />Protocols</div>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "#4A5568" }}>
                Add the pack for your vertical and your Readiness OS becomes purpose-built for your industry.
                Protocols designed around the exact triggers, regulatory context, and stakeholder structures
                of your sector.
              </p>
              <div className="space-y-3">
                {INDUSTRY_PACKS.map(pack => {
                  const Icon = pack.icon;
                  return (
                    <Link key={pack.key} href={`/industry/${pack.key}`}>
                      <div className="flex items-center justify-between py-2 px-3 rounded-sm cursor-pointer transition-colors hover:bg-gray-50 group">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-sm flex items-center justify-center" style={{ background: pack.iconBg }}>
                            <Icon size={14} color="#fff" />
                          </div>
                          <span className="text-sm font-semibold" style={{ color: NAVY }}>{pack.name}</span>
                          {pack.badge && (
                            <span className="text-xs px-2 py-0.5 font-semibold rounded-sm" style={{ background: "#FEF3C7", color: "#92400E" }}>
                              {pack.badge}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold" style={{ color: "#6B7280" }}>{pack.industryProtocols} protocols</span>
                          <ChevronRight size={14} style={{ color: "#9CA3AF" }} className="group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Combined total bar */}
          <div className="mt-8 p-5 rounded-sm flex flex-wrap items-center justify-between gap-4"
            style={{ background: NAVY }}>
            <div className="flex items-center gap-4">
              <Layers size={20} style={{ color: GOLD }} />
              <span className="text-sm font-semibold" style={{ color: IVORY }}>
                Your Complete Readiness OS = {coreProtocols} Core Protocols + Your Industry Pack
              </span>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-xl font-bold" style={{ color: GOLD }}>170</div>
                <div className="text-xs" style={{ color: "#7A8FA8" }}>Total Protocols</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold" style={{ color: GOLD }}>6</div>
                <div className="text-xs" style={{ color: "#7A8FA8" }}>Industry Packs</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold" style={{ color: GOLD }}>12 min</div>
                <div className="text-xs" style={{ color: "#7A8FA8" }}>Execution Head Start</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INDUSTRY PACK CARDS ── */}
      <section className="py-20" style={{ background: "#fff" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8" style={{ background: GOLD }} />
              <span className="text-xs tracking-[0.2em] font-semibold uppercase" style={{ color: GOLD }}>
                Industry Protocol Packs
              </span>
            </div>
            <h2 className="text-3xl font-bold" style={{ color: NAVY, fontFamily: "Cormorant Garamond, serif", fontSize: "2.2rem" }}>
              Choose Your Vertical
            </h2>
            <p className="mt-3 text-base max-w-xl" style={{ color: "#4A5568" }}>
              Each pack adds the industry-specific protocols on top of your Core Platform —
              pre-staged for the triggers only your sector faces.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INDUSTRY_PACKS.map(pack => {
              const Icon = pack.icon;
              return (
                <Link key={pack.key} href={`/industry/${pack.key}`}>
                  <div
                    className="border rounded-sm p-6 cursor-pointer group transition-all hover:shadow-md h-full flex flex-col"
                    style={{ borderColor: "#E5E7EB" }}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0" style={{ background: pack.iconBg }}>
                        <Icon size={20} color="#fff" />
                      </div>
                      {pack.badge && (
                        <span className="text-xs px-2 py-0.5 font-semibold rounded-sm" style={{ background: "#FEF3C7", color: "#92400E" }}>
                          {pack.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold mb-1" style={{ color: NAVY }}>
                      {pack.name} Readiness OS
                    </h3>
                    <p className="text-xs font-medium mb-3" style={{ color: "#6B7280" }}>{pack.tagline}</p>

                    {/* Protocol count */}
                    <div className="flex items-center gap-3 mb-4 py-3 px-3 rounded-sm" style={{ background: "#F9FAFB" }}>
                      <div className="text-center">
                        <div className="text-lg font-bold" style={{ color: NAVY }}>{coreProtocols}</div>
                        <div className="text-xs" style={{ color: "#6B7280" }}>Core</div>
                      </div>
                      <div className="text-gray-300 text-lg font-light">+</div>
                      <div className="text-center">
                        <div className="text-lg font-bold" style={{ color: pack.iconBg }}>{pack.industryProtocols}</div>
                        <div className="text-xs" style={{ color: "#6B7280" }}>Industry</div>
                      </div>
                      <div className="text-gray-300 text-lg font-light">=</div>
                      <div className="text-center">
                        <div className="text-lg font-bold" style={{ color: GOLD }}>{coreProtocols + pack.industryProtocols}</div>
                        <div className="text-xs" style={{ color: "#6B7280" }}>Total</div>
                      </div>
                    </div>

                    {/* Scenarios */}
                    <div className="flex-1 mb-5">
                      <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#9CA3AF" }}>
                        Industry Protocols Include
                      </div>
                      <ul className="space-y-1.5">
                        {pack.scenarios.slice(0, 4).map(s => (
                          <li key={s} className="flex items-start gap-2">
                            <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: GOLD }} />
                            <span className="text-xs font-medium" style={{ color: "#374151" }}>{s}</span>
                          </li>
                        ))}
                        {pack.scenarios.length > 4 && (
                          <li className="text-xs font-medium" style={{ color: "#9CA3AF" }}>
                            + {pack.scenarios.length - 4} more
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: "#F3F4F6" }}>
                      <span className="text-xs font-semibold" style={{ color: NAVY }}>
                        View {pack.name} Pack
                      </span>
                      <ArrowRight size={14} style={{ color: GOLD }} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20" style={{ background: IVORY }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: NAVY }}>
                <Layers size={22} style={{ color: GOLD }} />
              </div>
              <h4 className="font-bold text-base mb-2" style={{ color: NAVY }}>Start with the Core</h4>
              <p className="text-sm leading-relaxed" style={{ color: "#4A5568" }}>
                {coreProtocols} cross-industry Readiness Protocols cover every scenario a Fortune 1000
                is likely to face regardless of sector. Your foundation on day one.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: NAVY }}>
                <Globe size={22} style={{ color: GOLD }} />
              </div>
              <h4 className="font-bold text-base mb-2" style={{ color: NAVY }}>Add Your Industry Pack</h4>
              <p className="text-sm leading-relaxed" style={{ color: "#4A5568" }}>
                Select your vertical. Your Readiness OS activates the industry-specific protocols
                built for your sector's exact regulatory environment and risk profile.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: NAVY }}>
                <Shield size={22} style={{ color: GOLD }} />
              </div>
              <h4 className="font-bold text-base mb-2" style={{ color: NAVY }}>Execute in 12 Minutes</h4>
              <p className="text-sm leading-relaxed" style={{ color: "#4A5568" }}>
                When the trigger fires, execution begins immediately. Projects created, tasks assigned,
                stakeholders notified — 3,600× ahead of organizations that mobilize the traditional way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20" style={{ background: NAVY }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8" style={{ background: GOLD }} />
            <span className="text-xs tracking-[0.2em] font-semibold uppercase" style={{ color: GOLD }}>
              Founding Partner Program
            </span>
            <div className="h-px w-8" style={{ background: GOLD }} />
          </div>
          <h2 className="text-3xl font-bold mb-4" style={{ color: IVORY, fontFamily: "Cormorant Garamond, serif", fontSize: "2.2rem" }}>
            Ready to Build Your Industry Stack?
          </h2>
          <p className="text-base mb-8 leading-relaxed" style={{ color: "#A8B4C8" }}>
            Founding Partners receive the Core Platform plus their Industry Protocol Pack — 
            and co-design new industry protocols with our team over 90 days.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/request-access">
              <button
                className="px-8 py-3 text-sm font-semibold tracking-wide transition-all"
                style={{ background: GOLD, color: NAVY, borderRadius: "0.15rem" }}
              >
                Apply for Founding Partner Access →
              </button>
            </Link>
            <Link href="/playbook-library">
              <button
                className="px-8 py-3 text-sm font-semibold tracking-wide border transition-all"
                style={{ borderColor: "#3A4A6A", color: IVORY, background: "transparent", borderRadius: "0.15rem" }}
              >
                Browse All 170 Protocols
              </button>
            </Link>
          </div>
        </div>
      </section>

      <div className="flex justify-center py-8" style={{ background: NAVY }}>
        <BrandStamp variant="light" size="sm" />
      </div>
    </PageLayout>
  );
}
