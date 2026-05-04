import { Link, useParams } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import { BrandStamp } from "@/components/BrandStamp";
import {
  Building2, Cpu, Factory, Zap, ShoppingCart, Heart,
  ArrowRight, Shield, CheckCircle2, AlertTriangle, Lock,
  ChevronLeft, Globe, Layers, ArrowUpRight,
} from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const IVORY = "#F0EDE4";

interface ProtocolEntry {
  number: number;
  name: string;
  description: string;
  urgency: "CRITICAL" | "HIGH" | "STANDARD";
  triggers: string[];
  domains: string;
}

interface IndustryPackData {
  key: string;
  name: string;
  fullName: string;
  headline: string;
  tagline: string;
  description: string;
  icon: any;
  iconBg: string;
  regulatoryContext: string;
  keyStats: { label: string; value: string }[];
  protocols: ProtocolEntry[];
  coreExamples: string[];
  foundingPartnerNote: string;
}

const PACK_DATA: Record<string, IndustryPackData> = {
  financial_services: {
    key: "financial_services",
    name: "Financial Services",
    fullName: "Financial Services Readiness OS",
    headline: "From payment rail failures to rogue traders — execution pre-staged before impact.",
    tagline: "8 industry-specific protocols. Basel III. DORA. SWIFT. Fed enforcement. All pre-staged.",
    description:
      "Financial Services organizations operate in the highest-velocity regulatory and operational environment in the Fortune 1000. A SWIFT outage, a liquidity crisis, or a rogue trader event requires mobilization across compliance, risk, treasury, and executive leadership — simultaneously — in minutes. The Financial Services Pack pre-stages those response sequences in advance.",
    icon: Building2,
    iconBg: "#1B4F72",
    regulatoryContext: "Basel III · DORA · SEC Enforcement · FINRA · Fed Supervision · SWIFT Network",
    keyStats: [
      { label: "Industry Protocols", value: "8" },
      { label: "Regulatory Frameworks", value: "6" },
      { label: "Avg Stakeholder Count", value: "47" },
      { label: "Execution Head Start", value: "3,600×" },
    ],
    protocols: [
      {
        number: 114,
        name: "SWIFT / Payment System Disruption",
        description: "Complete payment rail failure response — correspondent coordination, Fed notification, client communication, and liquidity bridge execution.",
        urgency: "CRITICAL",
        triggers: ["SWIFT outage signal", "Payment settlement failure", "Fed system alert"],
        domains: "Risk & Resilience",
      },
      {
        number: 115,
        name: "Algorithmic Trading Malfunction",
        description: "Flash crash response, circuit breaker activation, position unwinding, and regulatory disclosure within the 15-minute reporting window.",
        urgency: "CRITICAL",
        triggers: ["Algo velocity anomaly", "Exchange circuit breaker", "Position exposure breach"],
        domains: "Risk & Resilience",
      },
      {
        number: 116,
        name: "Liquidity Crisis / Bank Run",
        description: "Digital bank run response — deposit flight containment, Fed window activation, investor communication, and stabilization protocol.",
        urgency: "CRITICAL",
        triggers: ["Deposit withdrawal surge", "Social sentiment crisis signal", "Credit rating watch"],
        domains: "Risk & Resilience",
      },
      {
        number: 117,
        name: "Correspondent Bank Failure",
        description: "Counterparty failure response — exposure mapping, alternative routing, client notification, and regulatory reporting.",
        urgency: "HIGH",
        triggers: ["Counterparty distress signal", "FDIC intervention", "Exposure concentration alert"],
        domains: "Risk & Resilience",
      },
      {
        number: 118,
        name: "Crypto / Digital Asset Incident",
        description: "Digital asset custody failure, exchange collapse, or on-chain exploit response for institutions with digital asset exposure.",
        urgency: "HIGH",
        triggers: ["Custody provider event", "Exchange liquidity halt", "On-chain exploit detected"],
        domains: "Risk & Resilience",
      },
      {
        number: 58,
        name: "Compliance Breach (DORA / Basel III)",
        description: "Regulatory compliance failure response — internal escalation, regulator notification, remediation staging, and board disclosure.",
        urgency: "HIGH",
        triggers: ["Regulatory examination signal", "Internal audit breach", "DORA incident classification"],
        domains: "Risk & Resilience",
      },
      {
        number: 126,
        name: "Commodity Trading Rogue Trader",
        description: "Unauthorized position discovery — position freeze, internal investigation, regulatory disclosure, and stakeholder containment.",
        urgency: "CRITICAL",
        triggers: ["Position limit breach", "Unauthorized trade flag", "Risk desk escalation"],
        domains: "Risk & Resilience",
      },
      {
        number: 140,
        name: "Portfolio Rebalancing Cascade",
        description: "Forced rebalancing event response for asset managers — execution sequencing, client notification, and market impact minimization.",
        urgency: "STANDARD",
        triggers: ["Benchmark recomposition", "Fund mandate breach", "Redemption surge signal"],
        domains: "Growth & Positioning",
      },
    ],
    coreExamples: [
      "Ransomware & Cyber Breach Response",
      "Executive Leadership Transition",
      "Activist Investor Response",
      "Regulatory Investigation (General)",
      "Brand & Reputational Crisis",
      "M&A Day 1 Readiness",
    ],
    foundingPartnerNote:
      "Financial Services Founding Partners are co-designing protocols for CECL model failures, stress test response, and AML regulatory enforcement — added to the pack Q3 2025.",
  },

  technology: {
    key: "technology",
    name: "Technology",
    fullName: "Technology Readiness OS",
    headline: "From API deprecations to developer exodus — platform continuity pre-staged.",
    tagline: "7 industry-specific protocols. Developer platforms. Open source. Platform migrations.",
    description:
      "Technology companies face execution crises that don't exist in other industries — a viral bug that kills product trust overnight, an open source licensing controversy that threatens the entire distribution model, or a developer exodus that erodes the engineering advantage. The Technology Pack stages the response sequences that protect platform continuity and competitive positioning.",
    icon: Cpu,
    iconBg: "#1A5276",
    regulatoryContext: "SOC 2 · ISO 27001 · Open Source Licensing · GDPR · FTC Enforcement",
    keyStats: [
      { label: "Industry Protocols", value: "7" },
      { label: "Platform Risk Scenarios", value: "7" },
      { label: "Avg Stakeholder Count", value: "34" },
      { label: "Execution Head Start", value: "3,600×" },
    ],
    protocols: [
      {
        number: 129,
        name: "API Deprecation Crisis",
        description: "Partner ecosystem management when a critical API must be deprecated — migration sequencing, developer communication, SLA protection, and partner retention.",
        urgency: "HIGH",
        triggers: ["Partner API dependency alert", "Deprecation deadline approaching", "Developer escalation surge"],
        domains: "Risk & Resilience",
      },
      {
        number: 130,
        name: "Viral Bug / Feature Backfire",
        description: "Product trust crisis response when a shipped feature creates widespread user harm — rollback sequencing, communication, and trust restoration.",
        urgency: "CRITICAL",
        triggers: ["Social sentiment spike negative", "Support ticket surge", "Media amplification signal"],
        domains: "Risk & Resilience",
      },
      {
        number: 132,
        name: "Developer Exodus",
        description: "Engineering talent crisis response — retention intervention, knowledge transfer, competitive counter-offer authorization, and capability gap staging.",
        urgency: "HIGH",
        triggers: ["Voluntary attrition surge", "Competitor hiring signal", "Glassdoor sentiment drop"],
        domains: "Risk & Resilience",
      },
      {
        number: 133,
        name: "Open Source Controversy",
        description: "License change, contributor conflict, or OSS security event response — community management, legal containment, and distribution continuity.",
        urgency: "HIGH",
        triggers: ["OSS community signal", "License enforcement action", "Core contributor departure"],
        domains: "Risk & Resilience",
      },
      {
        number: 141,
        name: "Platform Migration (Strategic)",
        description: "Offensive platform migration execution — user transition sequencing, legacy deprecation, and competitive positioning during the migration window.",
        urgency: "STANDARD",
        triggers: ["Executive migration authorization", "Competitor platform shift", "Technical debt threshold"],
        domains: "Growth & Positioning",
      },
      {
        number: 142,
        name: "API Ecosystem Expansion",
        description: "Rapid ecosystem expansion response to a market window — partner onboarding, developer documentation, and integration certification at scale.",
        urgency: "STANDARD",
        triggers: ["Market window signal", "Competitor API launch", "Partner demand surge"],
        domains: "Growth & Positioning",
      },
      {
        number: 143,
        name: "Technical Standard Setting",
        description: "Industry standard participation — coalition building, standards body engagement, and IP protection during the standard-setting window.",
        urgency: "STANDARD",
        triggers: ["Standards body vote signal", "Consortium formation alert", "Regulatory framework signal"],
        domains: "Growth & Positioning",
      },
    ],
    coreExamples: [
      "Ransomware & Cyber Breach Response",
      "Competitive Displacement Response",
      "M&A Day 1 Readiness",
      "Regulatory Investigation (FTC/DOJ)",
      "Executive Leadership Transition",
      "Activist Investor Response",
    ],
    foundingPartnerNote:
      "Technology Founding Partners are co-designing protocols for LLM/AI infrastructure failures, model recall events, and platform antitrust responses — added to the pack Q4 2025.",
  },

  manufacturing: {
    key: "manufacturing",
    name: "Manufacturing",
    fullName: "Manufacturing Readiness OS",
    headline: "From supplier cascades to facility disruptions — production continuity pre-staged.",
    tagline: "5 industry-specific protocols. Tier 2 suppliers. Critical tooling. Labor relations.",
    description:
      "Manufacturing organizations face supply chain failures that cascade across Tier 1, 2, and 3 suppliers faster than any committee can coordinate a response. A facility disruption, a tooling failure, or a labor walkout requires simultaneous mobilization across operations, procurement, finance, and executive leadership. The Manufacturing Pack stages that response before the trigger fires.",
    icon: Factory,
    iconBg: "#1E4D3B",
    regulatoryContext: "OSHA · EPA · NLRB · ISO 9001 · ITAR / EAR Export Controls",
    keyStats: [
      { label: "Industry Protocols", value: "5" },
      { label: "Supply Chain Scenarios", value: "4" },
      { label: "Avg Stakeholder Count", value: "52" },
      { label: "Execution Head Start", value: "3,600×" },
    ],
    protocols: [
      {
        number: 25,
        name: "Manufacturing Facility Disruption",
        description: "Complete facility shutdown response — production rerouting, customer communication, insurance activation, and regulatory notification.",
        urgency: "CRITICAL",
        triggers: ["Facility production halt", "Safety incident signal", "Environmental event"],
        domains: "Risk & Resilience",
      },
      {
        number: 119,
        name: "Tier 2 Supplier Cascade Failure",
        description: "Multi-tier supply chain disruption response — alternative sourcing activation, customer impact sequencing, and production recovery staging.",
        urgency: "CRITICAL",
        triggers: ["Supplier bankruptcy signal", "Single-source concentration alert", "Geopolitical supply signal"],
        domains: "Risk & Resilience",
      },
      {
        number: 120,
        name: "Critical Tooling Failure",
        description: "Precision tooling or equipment failure response — emergency sourcing, production rescheduling, customer SLA protection, and OEM engagement.",
        urgency: "HIGH",
        triggers: ["Equipment failure alert", "Tooling lead time breach", "Production quality signal"],
        domains: "Risk & Resilience",
      },
      {
        number: 121,
        name: "Labor Strike / Walkout",
        description: "Labor action response — production contingency activation, negotiation support staging, customer communication, and continuity execution.",
        urgency: "HIGH",
        triggers: ["NLRB filing signal", "Strike authorization vote", "Union negotiation breakdown"],
        domains: "Risk & Resilience",
      },
      {
        number: 168,
        name: "Compound: Geopolitical + Supply Chain",
        description: "Multi-vector disruption when geopolitical escalation simultaneously impacts multiple supply chain nodes — integrated response across all exposure vectors.",
        urgency: "CRITICAL",
        triggers: ["Geopolitical escalation signal", "Port closure alert", "Export control change"],
        domains: "Risk & Resilience",
      },
    ],
    coreExamples: [
      "Ransomware & OT/ICS Cyber Breach",
      "Executive Leadership Transition",
      "M&A Day 1 Readiness",
      "Regulatory Investigation (OSHA/EPA)",
      "Brand & Reputational Crisis",
      "Workforce Restructuring",
    ],
    foundingPartnerNote:
      "Manufacturing Founding Partners are co-designing protocols for rare earth supply disruption, ITAR compliance failure, and EV transition execution — added to the pack Q3 2025.",
  },

  energy: {
    key: "energy",
    name: "Energy",
    fullName: "Energy Readiness OS",
    headline: "From pipeline ruptures to climate occupations — operational continuity pre-staged.",
    tagline: "4 industry-specific protocols. Environmental events. Renewable integration. Activist response.",
    description:
      "Energy organizations face operational crises where minutes of delayed response translate directly into environmental damage, regulatory exposure, and irreversible reputational harm. A pipeline rupture, a renewable grid integration failure, or a coordinated climate protest requires simultaneous mobilization across operations, environmental, legal, regulatory, and executive functions. The Energy Pack stages that response before the event unfolds.",
    icon: Zap,
    iconBg: "#7D4E00",
    regulatoryContext: "EPA · FERC · PHMSA · NRC · NERC CIP · State PUC Frameworks",
    keyStats: [
      { label: "Industry Protocols", value: "4" },
      { label: "Environmental Scenarios", value: "3" },
      { label: "Avg Stakeholder Count", value: "61" },
      { label: "Execution Head Start", value: "3,600×" },
    ],
    protocols: [
      {
        number: 124,
        name: "Pipeline Rupture / Environmental Release",
        description: "Environmental incident response — containment activation, PHMSA notification, community communication, EPA coordination, and executive authorization.",
        urgency: "CRITICAL",
        triggers: ["SCADA anomaly signal", "Pressure loss detection", "Environmental sensor breach"],
        domains: "Risk & Resilience",
      },
      {
        number: 125,
        name: "Renewable Integration Failure",
        description: "Grid integration crisis when renewable capacity creates instability — load balancing response, operator coordination, regulatory notification, and customer impact staging.",
        urgency: "HIGH",
        triggers: ["Grid frequency anomaly", "Renewable capacity mismatch", "NERC alert signal"],
        domains: "Risk & Resilience",
      },
      {
        number: 128,
        name: "Climate Protest / Facility Occupation",
        description: "Activist occupation response — safety protocol activation, law enforcement coordination, media response, and operations continuity.",
        urgency: "HIGH",
        triggers: ["Activist mobilization signal", "Social coordination detection", "Facility perimeter event"],
        domains: "Risk & Resilience",
      },
      {
        number: 169,
        name: "Compound: Climate + Operations Cascade",
        description: "Multi-vector crisis when extreme weather simultaneously impacts infrastructure, operations, and regulatory exposure — integrated cross-functional response.",
        urgency: "CRITICAL",
        triggers: ["Extreme weather alert", "Multi-site operations impact", "Regulatory escalation signal"],
        domains: "Risk & Resilience",
      },
    ],
    coreExamples: [
      "Ransomware & OT/ICS Cyber Breach",
      "Executive Leadership Transition",
      "Regulatory Investigation (FERC/EPA)",
      "Activist Investor Response",
      "M&A Day 1 Readiness",
      "Geopolitical Supply Disruption",
    ],
    foundingPartnerNote:
      "Energy Founding Partners are co-designing protocols for LNG export disruption, offshore platform events, and carbon credit market failure — added to the pack Q4 2025.",
  },

  retail: {
    key: "retail",
    name: "Retail",
    fullName: "Retail Readiness OS",
    headline: "From viral trends to multi-brand launches — the market window opens for 12 minutes.",
    tagline: "2 industry-specific protocols. Multi-brand execution. Viral capitalization. Both sides of the trigger.",
    description:
      "Retail organizations face a unique duality — they must be ready to execute offensively when opportunity windows open and defensively when crises hit. A viral social trend creates a 48-72 hour window to capture share. A multi-brand market entry requires simultaneous execution across dozens of channels and locations. The Retail Pack stages both sides of that equation.",
    icon: ShoppingCart,
    iconBg: "#4A235A",
    regulatoryContext: "FTC · FDA (food retail) · CPSC · State Consumer Protection Laws",
    keyStats: [
      { label: "Industry Protocols", value: "2" },
      { label: "Opportunity Scenarios", value: "2" },
      { label: "Avg Stakeholder Count", value: "89" },
      { label: "Execution Head Start", value: "3,600×" },
    ],
    protocols: [
      {
        number: 111,
        name: "Strategic Market Entry — Multi-Brand Launch",
        description: "Simultaneous multi-brand, multi-location launch execution — brand sequencing, location activation, inventory staging, and omnichannel coordination across all markets.",
        urgency: "HIGH",
        triggers: ["Market window signal", "Competitor entry alert", "Regulatory approval received"],
        domains: "Growth & Positioning",
      },
      {
        number: 112,
        name: "Trend Capitalization — Viral Fashion Response",
        description: "48-72 hour viral trend response — SKU activation, influencer coordination, inventory positioning, and digital amplification before the window closes.",
        urgency: "HIGH",
        triggers: ["Social velocity signal", "Trend index spike", "Platform amplification detected"],
        domains: "Growth & Positioning",
      },
    ],
    coreExamples: [
      "Supply Chain Disruption Response",
      "Product Recall & Safety Response",
      "Brand & Reputational Crisis",
      "Ransomware & Cyber Breach",
      "Executive Leadership Transition",
      "Workforce Restructuring",
    ],
    foundingPartnerNote:
      "Retail Founding Partners are co-designing protocols for omnichannel inventory collapse, social commerce platform failure, and same-day delivery network disruption — added to the pack Q3 2025.",
  },

  healthcare: {
    key: "healthcare",
    name: "Healthcare",
    fullName: "Healthcare Readiness OS",
    headline: "From Class I recalls to safety crises — patient protection pre-staged.",
    tagline: "1 industry-specific protocol now. Expanding rapidly. FDA. Patient safety. Recall execution.",
    description:
      "Healthcare organizations operate in the highest-consequence environment in the Fortune 1000. A product recall, a safety signal, or an FDA enforcement action requires simultaneous mobilization across regulatory, legal, clinical, manufacturing, and executive functions — with patient safety as the absolute priority. The Healthcare Pack stages that response before the signal fires.",
    icon: Heart,
    iconBg: "#7B241C",
    regulatoryContext: "FDA · CMS · OIG · HIPAA · 21 CFR Part 11 · ICH Q10",
    keyStats: [
      { label: "Industry Protocols", value: "1" },
      { label: "Expanding Q3 2025", value: "6+" },
      { label: "Avg Stakeholder Count", value: "74" },
      { label: "Execution Head Start", value: "3,600×" },
    ],
    protocols: [
      {
        number: 95,
        name: "Product Recall (Class I — Safety)",
        description: "FDA Class I recall execution — unit identification, distribution halt, recall notification to all channels, regulatory submission, consumer communication, and remediation staging.",
        urgency: "CRITICAL",
        triggers: ["FDA safety signal", "Adverse event cluster", "Quality system alert", "Distribution contamination"],
        domains: "Risk & Resilience",
      },
    ],
    coreExamples: [
      "Ransomware & Healthcare Data Breach",
      "Executive Leadership Transition",
      "Regulatory Investigation (FDA/OIG)",
      "Supply Chain Disruption",
      "Brand & Reputational Crisis",
      "Workforce Restructuring",
    ],
    foundingPartnerNote:
      "Healthcare Founding Partners are co-designing protocols for clinical trial protocol deviation, CMS enforcement actions, drug shortage response, and HIPAA breach notification — added Q3 2025.",
  },
};

const CORE_PROTOCOL_COUNT = 143;

const URGENCY_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  CRITICAL: { bg: "#FEF2F2", text: "#B91C1C", label: "CRITICAL" },
  HIGH: { bg: "#FFF7ED", text: "#C2410C", label: "HIGH" },
  STANDARD: { bg: "#F0FDF4", text: "#15803D", label: "STANDARD" },
};

export default function IndustryPackDetail() {
  const { verticalKey } = useParams<{ verticalKey: string }>();
  const pack = PACK_DATA[verticalKey || ""];

  if (!pack) {
    return (
      <PageLayout>
        <div className="min-h-96 flex flex-col items-center justify-center gap-4 py-24">
          <h2 className="text-2xl font-bold" style={{ color: NAVY }}>Industry Pack Not Found</h2>
          <p className="text-base" style={{ color: "#6B7280" }}>That industry vertical doesn't exist yet.</p>
          <Link href="/industry">
            <button className="px-6 py-2.5 text-sm font-semibold" style={{ background: GOLD, color: NAVY, borderRadius: "0.15rem" }}>
              ← View All Industry Packs
            </button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  const Icon = pack.icon;
  const totalProtocols = CORE_PROTOCOL_COUNT + pack.protocols.length;

  return (
    <PageLayout>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{ background: pack.iconBg }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `radial-gradient(circle at 80% 50%, ${GOLD} 0%, transparent 60%)` }} />
        <div className="max-w-6xl mx-auto px-6 py-20 relative z-10">
          <Link href="/industry">
            <div className="flex items-center gap-2 mb-6 cursor-pointer opacity-70 hover:opacity-100 transition-opacity w-fit">
              <ChevronLeft size={14} color="#fff" />
              <span className="text-xs font-medium text-white">All Industry Packs</span>
            </div>
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-sm flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.15)" }}>
              <Icon size={28} color="#fff" />
            </div>
            <div>
              <div className="text-xs tracking-[0.2em] font-semibold uppercase mb-1 opacity-70 text-white">
                Industry Protocol Pack
              </div>
              <h1 className="text-3xl font-bold text-white"
                style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}>
                {pack.fullName}
              </h1>
            </div>
          </div>
          <p className="text-lg leading-relaxed max-w-2xl mb-6 text-white opacity-90">
            {pack.headline}
          </p>
          <p className="text-sm max-w-xl mb-8 opacity-70 text-white">
            {pack.regulatoryContext}
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-8">
            {pack.keyStats.map(stat => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs opacity-60 text-white">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROTOCOL STACK SUMMARY ── */}
      <section style={{ background: NAVY }} className="py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: "#A8B4C8" }}>{CORE_PROTOCOL_COUNT}</div>
                <div className="text-xs" style={{ color: "#5A6A8A" }}>Core Protocols</div>
              </div>
              <div style={{ color: "#3A4A6A", fontSize: "1.5rem", fontWeight: 300 }}>+</div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: GOLD }}>{pack.protocols.length}</div>
                <div className="text-xs" style={{ color: "#5A6A8A" }}>{pack.name} Protocols</div>
              </div>
              <div style={{ color: "#3A4A6A", fontSize: "1.5rem", fontWeight: 300 }}>=</div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: IVORY }}>{totalProtocols}</div>
                <div className="text-xs" style={{ color: "#5A6A8A" }}>Your Complete Readiness OS</div>
              </div>
            </div>
            <Link href="/request-access">
              <button
                className="px-6 py-2.5 text-sm font-semibold transition-all"
                style={{ background: GOLD, color: NAVY, borderRadius: "0.15rem" }}
              >
                Apply for Founding Partner Access →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── INDUSTRY PROTOCOLS ── */}
      <section className="py-20" style={{ background: "#fff" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8" style={{ background: GOLD }} />
              <span className="text-xs tracking-[0.2em] font-semibold uppercase" style={{ color: GOLD }}>
                {pack.name} Protocol Pack
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: NAVY, fontFamily: "Cormorant Garamond, serif", fontSize: "1.9rem" }}>
              {pack.protocols.length} Industry-Specific Protocols
            </h2>
            <p className="text-base max-w-xl" style={{ color: "#4A5568" }}>
              {pack.tagline}
            </p>
          </div>

          <div className="space-y-4">
            {pack.protocols.map(protocol => {
              const urgency = URGENCY_COLORS[protocol.urgency];
              return (
                <div key={protocol.number}
                  className="border rounded-sm p-6"
                  style={{ borderColor: "#E5E7EB" }}>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-start gap-4">
                      <div className="text-xs font-bold pt-0.5 flex-shrink-0" style={{ color: "#9CA3AF" }}>
                        #{protocol.number}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <h3 className="text-base font-bold" style={{ color: NAVY }}>{protocol.name}</h3>
                          <span className="text-xs px-2 py-0.5 font-semibold rounded-sm"
                            style={{ background: urgency.bg, color: urgency.text }}>
                            {urgency.label}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-sm font-medium"
                            style={{ background: "#F3F4F6", color: "#6B7280" }}>
                            {protocol.domains}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: "#4A5568" }}>
                          {protocol.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {protocol.triggers.map(t => (
                      <span key={t} className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-sm"
                        style={{ background: "#F9FAFB", color: "#374151", border: "1px solid #E5E7EB" }}>
                        <AlertTriangle size={10} style={{ color: GOLD }} />
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CORE PLATFORM ── */}
      <section className="py-16" style={{ background: "#F7F5EF" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-start gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px w-8" style={{ background: GOLD }} />
                <span className="text-xs tracking-[0.2em] font-semibold uppercase" style={{ color: GOLD }}>
                  Included — Readiness OS Core
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-3" style={{ color: NAVY, fontFamily: "Cormorant Garamond, serif" }}>
                + {CORE_PROTOCOL_COUNT} Cross-Industry Protocols
              </h2>
              <p className="text-sm leading-relaxed mb-6 max-w-xl" style={{ color: "#4A5568" }}>
                Every {pack.name} Readiness OS deployment includes the full Core Platform.
                These are the scenarios every Fortune 1000 faces regardless of vertical — and they're
                all pre-staged from day one.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {pack.coreExamples.map(ex => (
                  <div key={ex} className="flex items-center gap-2">
                    <CheckCircle2 size={13} style={{ color: GOLD, flexShrink: 0 }} />
                    <span className="text-sm font-medium" style={{ color: "#374151" }}>{ex}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium" style={{ color: "#9CA3AF" }}>
                    + {CORE_PROTOCOL_COUNT - pack.coreExamples.length} more Core Protocols
                  </span>
                </div>
              </div>
            </div>
            <div className="hidden md:block w-48 flex-shrink-0">
              <div className="rounded-sm p-6 text-center" style={{ background: NAVY }}>
                <Layers size={28} style={{ color: GOLD, margin: "0 auto 12px" }} />
                <div className="text-3xl font-bold mb-1" style={{ color: IVORY }}>{totalProtocols}</div>
                <div className="text-xs mb-3" style={{ color: "#7A8FA8" }}>Total Protocols in<br />Your {pack.name} OS</div>
                <div className="text-xs px-2 py-1 rounded-sm" style={{ background: "#1A2A4A", color: GOLD }}>
                  {CORE_PROTOCOL_COUNT} Core + {pack.protocols.length} {pack.name}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOUNDING PARTNER NOTE ── */}
      <section className="py-12" style={{ background: "#fff" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="border-l-4 pl-6 py-2" style={{ borderColor: GOLD }}>
            <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: GOLD }}>
              Founding Partner Co-Design
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
              {pack.foundingPartnerNote}
            </p>
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
          <h2 className="text-3xl font-bold mb-4" style={{ color: IVORY, fontFamily: "Cormorant Garamond, serif", fontSize: "2rem" }}>
            Deploy {pack.fullName}
          </h2>
          <p className="text-base mb-8 leading-relaxed" style={{ color: "#A8B4C8" }}>
            Founding Partners receive the Core Platform plus the {pack.name} Protocol Pack —
            {totalProtocols} Readiness Protocols pre-staged for your organization from day one.
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
            <Link href="/industry">
              <button
                className="px-8 py-3 text-sm font-semibold tracking-wide border transition-all"
                style={{ borderColor: "#3A4A6A", color: IVORY, background: "transparent", borderRadius: "0.15rem" }}
              >
                ← View All Industry Packs
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
