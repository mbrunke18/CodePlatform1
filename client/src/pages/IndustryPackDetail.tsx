import { Link, useParams } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import { BrandStamp } from "@/components/BrandStamp";
import {
  Building2, Cpu, Factory, Zap, ShoppingCart, Heart,
  ArrowRight, Shield, CheckCircle2, AlertTriangle,
  ChevronLeft, Layers,
} from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const IVORY = "#F0EDE4";

interface ProtocolEntry {
  number?: number;
  name: string;
  description: string;
  urgency: "CRITICAL" | "HIGH" | "STANDARD";
  triggers: string[];
  domains: string;
  status?: "live";
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
}

const PACK_DATA: Record<string, IndustryPackData> = {
  financial_services: {
    key: "financial_services",
    name: "Financial Services",
    fullName: "Financial Services Readiness OS",
    headline: "From payment rail failures to sovereign debt crises — every financial trigger pre-staged.",
    tagline: "15 industry-specific protocols. Basel III. DORA. SWIFT. Fed enforcement. AML. Stress tests.",
    description:
      "Financial Services organizations operate in the highest-velocity regulatory and operational environment in the startup to Fortune 500. A SWIFT outage, a liquidity crisis, a rogue trader, or an OFAC sanctions violation requires mobilization across compliance, risk, treasury, legal, and executive leadership — simultaneously — in minutes. The Financial Services Pack pre-stages those response sequences before the trigger fires.",
    icon: Building2,
    iconBg: "#1B4F72",
    regulatoryContext: "Basel III · DORA · SEC Enforcement · FINRA · Fed Supervision · SWIFT · OFAC · CCAR/DFAST",
    keyStats: [
      { label: "Industry Protocols", value: "15" },
      { label: "Core Protocols Included", value: "170" },
      { label: "Total Readiness Coverage", value: "185" },
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
        status: "live",
      },
      {
        number: 115,
        name: "Algorithmic Trading Malfunction",
        description: "Flash crash response, circuit breaker activation, position unwinding, and regulatory disclosure within the 15-minute reporting window.",
        urgency: "CRITICAL",
        triggers: ["Algo velocity anomaly", "Exchange circuit breaker", "Position exposure breach"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 116,
        name: "Liquidity Crisis / Bank Run",
        description: "Digital bank run response — deposit flight containment, Fed window activation, investor communication, and stabilization protocol.",
        urgency: "CRITICAL",
        triggers: ["Deposit withdrawal surge", "Social sentiment crisis signal", "Credit rating watch"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 126,
        name: "Commodity Trading Rogue Trader",
        description: "Unauthorized position discovery — position freeze, internal investigation, regulatory disclosure, and stakeholder containment.",
        urgency: "CRITICAL",
        triggers: ["Position limit breach", "Unauthorized trade flag", "Risk desk escalation"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 117,
        name: "Correspondent Bank Failure",
        description: "Counterparty failure response — exposure mapping, alternative routing, client notification, and regulatory reporting.",
        urgency: "HIGH",
        triggers: ["Counterparty distress signal", "FDIC intervention", "Exposure concentration alert"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 118,
        name: "Crypto / Digital Asset Incident",
        description: "Digital asset custody failure, exchange collapse, or on-chain exploit response for institutions with digital asset exposure.",
        urgency: "HIGH",
        triggers: ["Custody provider event", "Exchange liquidity halt", "On-chain exploit detected"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 58,
        name: "Regulatory Compliance Breach (DORA / Basel III)",
        description: "Compliance failure response — internal escalation, regulator notification, remediation staging, and board disclosure.",
        urgency: "HIGH",
        triggers: ["Regulatory examination signal", "Internal audit breach", "DORA incident classification"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 140,
        name: "Portfolio Rebalancing Cascade",
        description: "Forced rebalancing event response — execution sequencing, client notification, and market impact minimization.",
        urgency: "STANDARD",
        triggers: ["Benchmark recomposition", "Fund mandate breach", "Redemption surge signal"],
        domains: "Growth & Positioning",
        status: "live",
      },
      {
        number: 144,
        name: "Stress Test Failure (DFAST / CCAR)",
        description: "Federal stress test failure response — capital plan remediation, Fed communication, board disclosure, and public relations containment.",
        urgency: "CRITICAL",
        triggers: ["DFAST adverse scenario breach", "Capital ratio stress signal", "Fed supervisory action"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 145,
        name: "AML / Sanctions Violation (OFAC)",
        description: "Anti-money laundering or OFAC sanctions breach — transaction freeze, SAR filing, FinCEN notification, and regulatory remediation program.",
        urgency: "CRITICAL",
        triggers: ["OFAC match detected", "Suspicious transaction flag", "FinCEN alert signal"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 146,
        name: "Market Manipulation Investigation",
        description: "SEC or CFTC market manipulation investigation response — trading halt coordination, legal hold, document preservation, and regulator cooperation.",
        urgency: "CRITICAL",
        triggers: ["SEC subpoena signal", "CFTC inquiry alert", "Trading pattern anomaly flag"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 147,
        name: "Interest Rate Shock / Fed Surprise Response",
        description: "Unexpected Fed rate decision response — portfolio repricing, mortgage pipeline hedging, client communication, and balance sheet repositioning.",
        urgency: "HIGH",
        triggers: ["Fed surprise rate move", "Yield curve inversion signal", "Duration mismatch alert"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 148,
        name: "Earnings Miss & Guidance Withdrawal",
        description: "Public company earnings shortfall — investor relations response, guidance revision, analyst briefing, and short-seller activity containment.",
        urgency: "HIGH",
        triggers: ["Revenue miss signal", "Analyst downgrade alert", "Short interest surge"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 149,
        name: "PCI-DSS Financial Data Breach",
        description: "Payment card data breach response — PCI forensics activation, card network notification, customer remediation, and regulatory disclosure.",
        urgency: "CRITICAL",
        triggers: ["PCI anomaly detected", "Card network alert", "Dark web credential signal"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 150,
        name: "Leveraged Buyout Financing Collapse",
        description: "LBO financing failure at signing — alternative structure activation, seller negotiation, co-investor mobilization, and bridge financing execution.",
        urgency: "HIGH",
        triggers: ["Debt market access signal", "Syndication failure alert", "Covenant breach warning"],
        domains: "Growth & Positioning",
        status: "live",
      },
    ],
    coreExamples: [
      "Ransomware & Cyber Breach Response",
      "Executive Leadership Transition",
      "Activist Investor Response",
      "M&A Day 1 Readiness",
      "Brand & Reputational Crisis",
      "Workforce Restructuring",
    ],
  },

  technology: {
    key: "technology",
    name: "Technology",
    fullName: "Technology Readiness OS",
    headline: "From cloud outages to AI liability events — platform continuity pre-staged at every layer.",
    tagline: "13 industry-specific protocols. Platform risk. Developer trust. Open source. AI governance.",
    description:
      "Technology companies face execution crises that don't exist in other industries — a viral bug that kills product trust overnight, a cloud provider outage that takes down the entire platform, an open source licensing controversy that threatens the distribution model, or a synthetic content liability event with no regulatory precedent. The Technology Pack stages the response sequences that protect platform continuity, developer trust, and competitive positioning.",
    icon: Cpu,
    iconBg: "#1A5276",
    regulatoryContext: "SOC 2 · ISO 27001 · Open Source Licensing (MIT/GPL/AGPL) · GDPR · CCPA · FTC Enforcement · EU AI Act",
    keyStats: [
      { label: "Industry Protocols", value: "13" },
      { label: "Core Protocols Included", value: "170" },
      { label: "Total Readiness Coverage", value: "183" },
      { label: "Execution Head Start", value: "3,600×" },
    ],
    protocols: [
      {
        number: 130,
        name: "Viral Bug / Feature Backfire",
        description: "Product trust crisis — rollback sequencing, user communication, social containment, and trust restoration protocol.",
        urgency: "CRITICAL",
        triggers: ["Social sentiment spike negative", "Support ticket surge", "Media amplification signal"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 129,
        name: "API Deprecation Crisis",
        description: "Partner ecosystem management when a critical API must be deprecated — migration sequencing, developer communication, SLA protection, and partner retention.",
        urgency: "HIGH",
        triggers: ["Partner API dependency alert", "Deprecation deadline approaching", "Developer escalation surge"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 132,
        name: "Developer Exodus",
        description: "Engineering talent crisis — retention intervention, knowledge transfer, competitive counter-offer authorization, and capability gap staging.",
        urgency: "HIGH",
        triggers: ["Voluntary attrition surge", "Competitor hiring signal", "Glassdoor sentiment drop"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 133,
        name: "Open Source Controversy",
        description: "License change, contributor conflict, or OSS security event — community management, legal containment, and distribution continuity.",
        urgency: "HIGH",
        triggers: ["OSS community signal", "License enforcement action", "Core contributor departure"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 141,
        name: "Platform Migration (Strategic)",
        description: "Offensive platform migration — user transition sequencing, legacy deprecation, and competitive positioning during the migration window.",
        urgency: "STANDARD",
        triggers: ["Executive migration authorization", "Competitor platform shift", "Technical debt threshold"],
        domains: "Growth & Positioning",
        status: "live",
      },
      {
        number: 142,
        name: "API Ecosystem Expansion",
        description: "Rapid ecosystem expansion — partner onboarding, developer documentation, and integration certification at scale.",
        urgency: "STANDARD",
        triggers: ["Market window signal", "Competitor API launch", "Partner demand surge"],
        domains: "Growth & Positioning",
        status: "live",
      },
      {
        number: 143,
        name: "Technical Standard Setting",
        description: "Industry standard participation — coalition building, standards body engagement, and IP protection during the standard-setting window.",
        urgency: "STANDARD",
        triggers: ["Standards body vote signal", "Consortium formation alert", "Regulatory framework signal"],
        domains: "Growth & Positioning",
        status: "live",
      },
      {
        number: 151,
        name: "Cloud Provider / Data Center Outage",
        description: "Multi-region cloud provider failure response — workload failover, SLA breach containment, customer communication, and business continuity activation.",
        urgency: "CRITICAL",
        triggers: ["Cloud provider status alert", "Multi-region latency spike", "Customer impact threshold breach"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 152,
        name: "Security Breach & Source Code Leak",
        description: "Insider threat or external breach resulting in source code, customer data, or IP exposure — legal hold, forensics activation, disclosure sequencing.",
        urgency: "CRITICAL",
        triggers: ["Dark web code detection", "Insider threat flag", "Unauthorized repo access"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 153,
        name: "App Store Delisting Threat",
        description: "Apple or Google app store policy violation response — compliance remediation, policy negotiation, user communication, and alternative distribution staging.",
        urgency: "CRITICAL",
        triggers: ["Store policy violation notice", "App review rejection surge", "Platform policy change signal"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 154,
        name: "AI Model Liability Event",
        description: "Model output causing legal harm — model rollback, liability containment, regulator notification (EU AI Act), and public response.",
        urgency: "HIGH",
        triggers: ["AI harm allegation signal", "EU AI Act investigation", "User harm cluster detected"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 155,
        name: "Enterprise Customer Churn Spike",
        description: "Large enterprise account attrition response — executive retention intervention, contract renegotiation, competitive win-back, and revenue containment.",
        urgency: "HIGH",
        triggers: ["Enterprise NPS collapse", "Renewal at-risk signal", "Competitor displacement alert"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 156,
        name: "SLA Breach & Enterprise Penalty",
        description: "Service level agreement failure response — customer remediation, penalty mitigation, root cause communication, and contract amendment.",
        urgency: "HIGH",
        triggers: ["SLA threshold breach", "Enterprise escalation signal", "Uptime SLA miss"],
        domains: "Risk & Resilience",
        status: "live",
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
  },

  manufacturing: {
    key: "manufacturing",
    name: "Manufacturing",
    fullName: "Manufacturing Readiness OS",
    headline: "From supplier cascades to export violations — production continuity pre-staged at every node.",
    tagline: "12 industry-specific protocols. Supply chain. Quality. Labor. Export controls. Environmental.",
    description:
      "Manufacturing organizations face supply chain failures that cascade across Tier 1, 2, and 3 suppliers faster than any committee can coordinate a response. A facility disruption, a product quality recall, a trade tariff, or an ITAR export violation requires simultaneous mobilization across operations, procurement, legal, finance, and executive leadership. The Manufacturing Pack stages that response before the trigger fires — at every point in the supply chain.",
    icon: Factory,
    iconBg: "#1E4D3B",
    regulatoryContext: "OSHA · EPA · NLRB · ISO 9001 · ITAR / EAR Export Controls · CPSC · REACH / RoHS",
    keyStats: [
      { label: "Industry Protocols", value: "12" },
      { label: "Core Protocols Included", value: "170" },
      { label: "Total Readiness Coverage", value: "182" },
      { label: "Execution Head Start", value: "3,600×" },
    ],
    protocols: [
      {
        number: 168,
        name: "Compound: Geopolitical + Supply Chain Disruption",
        description: "Multi-vector disruption when geopolitical escalation simultaneously impacts multiple supply chain nodes — integrated response across all exposure vectors.",
        urgency: "CRITICAL",
        triggers: ["Geopolitical escalation signal", "Port closure alert", "Export control change"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 25,
        name: "Manufacturing Facility Disruption",
        description: "Complete facility shutdown response — production rerouting, customer communication, insurance activation, and regulatory notification.",
        urgency: "CRITICAL",
        triggers: ["Facility production halt", "Safety incident signal", "Environmental event"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 119,
        name: "Tier 2 Supplier Cascade Failure",
        description: "Multi-tier supply chain disruption — alternative sourcing activation, customer impact sequencing, and production recovery staging.",
        urgency: "CRITICAL",
        triggers: ["Supplier bankruptcy signal", "Single-source concentration alert", "Geopolitical supply signal"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 121,
        name: "Labor Strike / Walkout",
        description: "Labor action response — production contingency activation, negotiation support staging, customer communication, and continuity execution.",
        urgency: "HIGH",
        triggers: ["NLRB filing signal", "Strike authorization vote", "Union negotiation breakdown"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 120,
        name: "Critical Tooling Failure",
        description: "Precision tooling or equipment failure — emergency sourcing, production rescheduling, customer SLA protection, and OEM engagement.",
        urgency: "HIGH",
        triggers: ["Equipment failure alert", "Tooling lead time breach", "Production quality signal"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 157,
        name: "Product Quality Recall (Manufacturing)",
        description: "Defective product recall response — unit identification, production halt, CPSC / regulatory notification, customer/channel communication, and root cause investigation.",
        urgency: "CRITICAL",
        triggers: ["Quality defect signal", "Customer injury report", "CPSC investigation notice"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 158,
        name: "Trade Tariff & Import Restriction Response",
        description: "New tariff or import restriction response — cost pass-through analysis, supplier geographic rebalancing, customer communication, and pricing execution.",
        urgency: "HIGH",
        triggers: ["Tariff announcement signal", "Trade policy change alert", "Customs classification change"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 159,
        name: "Export Control / ITAR Violation",
        description: "ITAR or EAR export control breach response — shipment halt, DDTC/BIS notification, internal investigation, and voluntary disclosure program.",
        urgency: "CRITICAL",
        triggers: ["ITAR classification alert", "Denied party screening hit", "Export anomaly flag"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 160,
        name: "Raw Material Price Spike",
        description: "Commodity price escalation response — hedging activation, supplier contract renegotiation, pricing strategy update, and customer communication.",
        urgency: "HIGH",
        triggers: ["Commodity index spike", "Supplier price escalation", "Futures market signal"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 161,
        name: "Environmental Compliance Violation",
        description: "EPA or state environmental violation response — containment activation, agency notification, remediation program, and community communication.",
        urgency: "CRITICAL",
        triggers: ["EPA monitoring breach", "Environmental sensor alert", "Community complaint surge"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 162,
        name: "ERP System Failure (SAP / Oracle)",
        description: "Enterprise ERP failure response — manual process activation, order management continuity, supplier communication, and recovery sequencing.",
        urgency: "HIGH",
        triggers: ["ERP system outage alert", "Order processing failure", "Production schedule disruption"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 163,
        name: "Energy Cost Escalation Crisis",
        description: "Sudden energy cost spike impact on production economics — load shedding, production prioritization, contract hedging, and customer price adjustment.",
        urgency: "HIGH",
        triggers: ["Energy price index spike", "Grid reliability alert", "Production cost threshold breach"],
        domains: "Risk & Resilience",
        status: "live",
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
  },

  energy: {
    key: "energy",
    name: "Energy",
    fullName: "Energy Readiness OS",
    headline: "From pipeline ruptures to SCADA cyberattacks — operational and environmental response pre-staged.",
    tagline: "12 industry-specific protocols. Environmental. Grid. Offshore. Nuclear. Cyber. Climate.",
    description:
      "Energy organizations face operational crises where minutes of delayed response translate directly into environmental damage, regulatory exposure, and irreversible reputational harm. A pipeline rupture, a grid cyberattack, an offshore platform emergency, or a nuclear incident requires simultaneous mobilization across operations, environmental, legal, regulatory, and executive functions — with no tolerance for the 30-day mobilization cycle. The Energy Pack stages that entire response before the event unfolds.",
    icon: Zap,
    iconBg: "#7D4E00",
    regulatoryContext: "EPA · FERC · PHMSA · NRC · NERC CIP · BSEE (Offshore) · DOE · State PUC Frameworks",
    keyStats: [
      { label: "Industry Protocols", value: "12" },
      { label: "Core Protocols Included", value: "170" },
      { label: "Total Readiness Coverage", value: "182" },
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
        status: "live",
      },
      {
        number: 169,
        name: "Compound: Climate + Operations Cascade",
        description: "Multi-vector crisis when extreme weather simultaneously impacts infrastructure, operations, and regulatory exposure — integrated cross-functional response.",
        urgency: "CRITICAL",
        triggers: ["Extreme weather alert", "Multi-site operations impact", "Regulatory escalation signal"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 125,
        name: "Renewable Integration Failure",
        description: "Grid integration crisis — load balancing response, operator coordination, regulatory notification, and customer impact staging.",
        urgency: "HIGH",
        triggers: ["Grid frequency anomaly", "Renewable capacity mismatch", "NERC alert signal"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 128,
        name: "Climate Protest / Facility Occupation",
        description: "Activist occupation response — safety protocol activation, law enforcement coordination, media response, and operations continuity.",
        urgency: "HIGH",
        triggers: ["Activist mobilization signal", "Social coordination detection", "Facility perimeter event"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 164,
        name: "Grid Cyberattack (ICS / SCADA)",
        description: "Industrial control system cyberattack response — SCADA isolation, NERC CIP incident reporting, DOE/CISA notification, and grid stability continuity.",
        urgency: "CRITICAL",
        triggers: ["ICS anomaly detected", "SCADA breach signal", "NERC CIP incident threshold"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 165,
        name: "Offshore Platform Emergency",
        description: "Offshore platform safety or environmental emergency response — personnel evacuation, BSEE notification, spill containment, and media containment.",
        urgency: "CRITICAL",
        triggers: ["Platform safety alert", "BSEE inspection signal", "Offshore environmental sensor"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 166,
        name: "Nuclear Incident Response",
        description: "Nuclear facility incident response — NRC emergency plan activation, community notification, evacuation coordination, and federal agency engagement.",
        urgency: "CRITICAL",
        triggers: ["NRC alert signal", "Plant safety threshold", "Radiation monitoring breach"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 167,
        name: "Oil & Gas Price Collapse",
        description: "Commodity price collapse response — capital program suspension, production curtailment, workforce right-sizing, and investor communication.",
        urgency: "HIGH",
        triggers: ["WTI/Brent price threshold", "OPEC+ decision signal", "Demand destruction signal"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 170,
        name: "Hurricane / Natural Disaster Response",
        description: "Hurricane or natural disaster facility response — pre-landfall shutdown sequencing, personnel safety, asset protection, restoration prioritization.",
        urgency: "CRITICAL",
        triggers: ["NWS hurricane track signal", "Mandatory evacuation order", "Category threshold alert"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 171,
        name: "Regulatory Rate Case Challenge",
        description: "Utility rate case adverse ruling response — interim rate recovery strategy, regulatory negotiation, customer impact communication, and financial reforecast.",
        urgency: "HIGH",
        triggers: ["Rate case adverse signal", "PUC ruling alert", "Intervenor challenge filing"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 172,
        name: "Carbon Market & Net-Zero Compliance",
        description: "Carbon credit shortfall or net-zero compliance failure response — offset procurement, regulatory negotiation, ESG disclosure update, and investor communication.",
        urgency: "HIGH",
        triggers: ["Carbon allowance price spike", "Net-zero milestone miss signal", "ESG rating agency alert"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 173,
        name: "Utility Merger Integration Failure",
        description: "Post-merger integration breakdown response — regulatory approval risk management, operational integration sequencing, and workforce retention.",
        urgency: "HIGH",
        triggers: ["FERC integration condition", "Workforce attrition signal", "System integration failure"],
        domains: "Transformation",
        status: "live",
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
  },

  retail: {
    key: "retail",
    name: "Retail",
    fullName: "Retail Readiness OS",
    headline: "From food safety recalls to e-commerce outages — every retail crisis and opportunity pre-staged.",
    tagline: "12 industry-specific protocols. Safety recalls. Platform outages. Data breach. Labor violations. Brand.",
    description:
      "Retail organizations operate on both sides of the execution equation — they must capture offensive opportunities in a 48-hour window (viral trends, market entries) while managing defensive crises that can destroy decades of brand equity (food contamination, data breaches, supplier labor violations). The Retail Pack stages both. Every scenario your buyers, regulators, and boards will ask about — pre-staged before the trigger fires.",
    icon: ShoppingCart,
    iconBg: "#4A235A",
    regulatoryContext: "FDA (Food Safety) · FTC · CPSC · NLRB · FCPA · California Transparency Act · PCI-DSS",
    keyStats: [
      { label: "Industry Protocols", value: "12" },
      { label: "Core Protocols Included", value: "170" },
      { label: "Total Readiness Coverage", value: "182" },
      { label: "Execution Head Start", value: "3,600×" },
    ],
    protocols: [
      {
        number: 111,
        name: "Strategic Market Entry — Multi-Brand Launch",
        description: "Simultaneous multi-brand, multi-location launch — brand sequencing, location activation, inventory staging, and omnichannel coordination across all markets.",
        urgency: "HIGH",
        triggers: ["Market window signal", "Competitor entry alert", "Regulatory approval received"],
        domains: "Growth & Positioning",
        status: "live",
      },
      {
        number: 112,
        name: "Trend Capitalization — Viral Fashion Response",
        description: "48-72 hour viral trend response — SKU activation, influencer coordination, inventory positioning, and digital amplification before the window closes.",
        urgency: "HIGH",
        triggers: ["Social velocity signal", "Trend index spike", "Platform amplification detected"],
        domains: "Growth & Positioning",
        status: "live",
      },
      {
        number: 174,
        name: "Food Safety Recall (FDA Class I / II)",
        description: "Contaminated product recall — unit traceability activation, FDA notification, store pull sequencing, consumer communication, and media containment.",
        urgency: "CRITICAL",
        triggers: ["FDA safety signal", "Illness cluster report", "Supplier contamination alert"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 175,
        name: "E-Commerce Platform Outage (Peak Season)",
        description: "Peak season platform failure — revenue recovery sequencing, customer communication, carrier SLA protection, and post-outage retention activation.",
        urgency: "CRITICAL",
        triggers: ["Platform uptime breach", "Cart abandonment spike", "Black Friday load threshold"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 176,
        name: "Customer Payment Data Breach (PCI-DSS)",
        description: "Payment card data exposure — PCI forensics, card network notification, customer remediation offers, state AG notification, and trust restoration.",
        urgency: "CRITICAL",
        triggers: ["PCI anomaly detected", "Card fraud cluster signal", "Dark web card data alert"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 177,
        name: "Supplier Labor Violation (Forced Labor Act)",
        description: "Supplier forced labor or child labor exposure — product halt, CBP withhold-release order response, supplier audit activation, and brand communication.",
        urgency: "CRITICAL",
        triggers: ["CBP WRO signal", "NGO exposure report", "Supply chain audit flag"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 178,
        name: "Influencer / Brand Ambassador Scandal",
        description: "Brand ambassador misconduct response — contract termination, campaign pull, social containment, and brand distancing communication.",
        urgency: "HIGH",
        triggers: ["Social sentiment crisis signal", "Media escalation alert", "Brand safety tool flag"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 179,
        name: "Counterfeit Goods Crisis",
        description: "Large-scale counterfeit product infiltration — marketplace takedown coordination, brand protection activation, customer communication, and legal enforcement.",
        urgency: "HIGH",
        triggers: ["Brand protection platform alert", "Marketplace fraud signal", "Customer complaint cluster"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 180,
        name: "Store Network Closure & Restructuring",
        description: "Multi-store closure execution — lease termination sequencing, workforce notification (WARN Act), inventory liquidation, and brand continuation strategy.",
        urgency: "HIGH",
        triggers: ["Portfolio review decision", "Lease expiration cluster", "Profitability threshold breach"],
        domains: "Transformation",
        status: "live",
      },
      {
        number: 181,
        name: "Tariff-Driven Price Increase Response",
        description: "Import tariff cost absorption response — pricing strategy update, supplier negotiation, customer communication, and competitive positioning.",
        urgency: "HIGH",
        triggers: ["Tariff announcement signal", "Import cost threshold", "Competitor pricing signal"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 182,
        name: "Price-Fixing Investigation (FTC / DOJ)",
        description: "Antitrust pricing investigation response — document preservation, counsel engagement, DOJ/FTC cooperation strategy, and employee communication.",
        urgency: "CRITICAL",
        triggers: ["FTC subpoena signal", "DOJ investigation alert", "Competitor parallel pricing flag"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 183,
        name: "Flash Sale Demand Collapse",
        description: "Promotional demand shortfall response — inventory repositioning, markdown optimization, vendor partner communication, and margin recovery.",
        urgency: "STANDARD",
        triggers: ["Promotional sell-through miss", "Inventory overhang signal", "Margin threshold breach"],
        domains: "Growth & Positioning",
        status: "live",
      },
    ],
    coreExamples: [
      "Ransomware & Cyber Breach Response",
      "Executive Leadership Transition",
      "Brand & Reputational Crisis",
      "Supply Chain Disruption",
      "Activist Investor Response",
      "Workforce Restructuring",
    ],
  },

  healthcare: {
    key: "healthcare",
    name: "Healthcare",
    fullName: "Healthcare Readiness OS",
    headline: "From FDA consent decrees to hospital ransomware — patient safety and compliance pre-staged at every level.",
    tagline: "12 industry-specific protocols. FDA. CMS. HIPAA. Clinical trials. Drug shortages. Patient safety.",
    description:
      "Healthcare organizations operate in the highest-consequence, highest-regulatory-scrutiny environment in the startup to Fortune 500. A product recall, an FDA warning letter, a hospital ransomware attack, a drug shortage, or a patient harm disclosure requires simultaneous mobilization across regulatory, legal, clinical, operations, and executive functions — with patient safety as the absolute and non-negotiable priority. The Healthcare Pack stages that entire response before the signal fires.",
    icon: Heart,
    iconBg: "#7B241C",
    regulatoryContext: "FDA · CMS / Medicare · OIG · HIPAA · 21 CFR Part 11 · ICH Q10 · Joint Commission · DEA",
    keyStats: [
      { label: "Industry Protocols", value: "12" },
      { label: "Core Protocols Included", value: "170" },
      { label: "Total Readiness Coverage", value: "182" },
      { label: "Execution Head Start", value: "3,600×" },
    ],
    protocols: [
      {
        number: 95,
        name: "Product Recall (Class I — Safety)",
        description: "FDA Class I recall — unit identification, distribution halt, recall notification to all channels, regulatory submission, consumer communication, and remediation staging.",
        urgency: "CRITICAL",
        triggers: ["FDA safety signal", "Adverse event cluster", "Quality system alert", "Distribution contamination"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 184,
        name: "FDA Warning Letter / Consent Decree",
        description: "FDA enforcement action response — manufacturing halt assessment, FDA response letter preparation, consent decree negotiation, and remediation program activation.",
        urgency: "CRITICAL",
        triggers: ["FDA inspection 483 signal", "Warning letter received", "Consent decree risk flag"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 185,
        name: "Hospital Ransomware Attack",
        description: "Healthcare ransomware response — patient care diversion, EHR downtime procedures, FBI/HHS notification, and clinical operations continuity.",
        urgency: "CRITICAL",
        triggers: ["EHR system outage signal", "Ransomware detection alert", "Network anomaly flag"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 186,
        name: "Drug Shortage Response",
        description: "Critical drug shortage management — FDA notification (mandatory), alternative sourcing activation, clinical rationing protocol, and patient communication.",
        urgency: "CRITICAL",
        triggers: ["FDA drug shortage database signal", "Supplier production halt", "Inventory depletion alert"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 187,
        name: "HIPAA Breach Notification",
        description: "Protected health information breach response — breach assessment, HHS/OCR notification (60-day window), patient notification, and media statement.",
        urgency: "CRITICAL",
        triggers: ["PHI exposure detected", "EHR unauthorized access", "Business associate breach signal"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 188,
        name: "Patient Harm Disclosure",
        description: "Serious patient harm or sentinel event response — immediate safety action, Joint Commission reporting, board notification, family communication, and RCA activation.",
        urgency: "CRITICAL",
        triggers: ["Sentinel event report", "Patient safety officer escalation", "Adverse outcome cluster"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 189,
        name: "CMS Audit / Medicare Fraud Investigation",
        description: "CMS audit or OIG fraud investigation response — document preservation, counsel engagement, billing review, voluntary repayment program, and cooperation strategy.",
        urgency: "CRITICAL",
        triggers: ["CMS audit notification", "OIG subpoena signal", "Billing anomaly flag"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 190,
        name: "Clinical Trial Protocol Deviation",
        description: "Clinical trial serious protocol deviation response — IRB notification, FDA IND safety report, trial hold assessment, and patient safety communication.",
        urgency: "CRITICAL",
        triggers: ["Protocol deviation report", "IRB review trigger", "FDA IND safety threshold"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 191,
        name: "Medical Device Malfunction (MDR)",
        description: "Medical device malfunction or failure response — MDR filing (30-day window), field safety notice, device correction/removal, and clinical communication.",
        urgency: "HIGH",
        triggers: ["Device malfunction report", "FDA MDR threshold", "Adverse event cluster signal"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 192,
        name: "Insurance Reimbursement Rate Cut",
        description: "Major payer reimbursement rate reduction response — financial reforecast, service line prioritization, contract renegotiation, and workforce impact assessment.",
        urgency: "HIGH",
        triggers: ["CMS rate update signal", "Payer contract renegotiation", "Reimbursement threshold breach"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 193,
        name: "Biosimilar / Generic Market Entry",
        description: "Biosimilar or generic competitor launch response — pricing strategy activation, formulary defense, prescriber communication, and market share protection.",
        urgency: "HIGH",
        triggers: ["FDA biosimilar approval signal", "Generic launch alert", "Formulary displacement signal"],
        domains: "Risk & Resilience",
        status: "live",
      },
      {
        number: 194,
        name: "Physician Group Acquisition Integration",
        description: "Post-acquisition physician group integration — Stark Law compliance, compensation alignment, culture integration, and quality metric continuity.",
        urgency: "STANDARD",
        triggers: ["Acquisition close signal", "Stark Law review trigger", "Physician attrition signal"],
        domains: "Transformation",
        status: "live",
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
  },
};

const CORE_PROTOCOL_COUNT = 170;

const URGENCY_COLORS: Record<string, { bg: string; text: string }> = {
  CRITICAL: { bg: "#FEF2F2", text: "#B91C1C" },
  HIGH: { bg: "#FFF7ED", text: "#C2410C" },
  STANDARD: { bg: "#F0FDF4", text: "#15803D" },
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
  const totalCoverage = CORE_PROTOCOL_COUNT + pack.protocols.length;

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
          <p className="text-lg leading-relaxed max-w-2xl mb-4 text-white opacity-90">
            {pack.headline}
          </p>
          <p className="text-sm max-w-2xl mb-8 opacity-60 text-white">
            {pack.regulatoryContext}
          </p>
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

      {/* ── PROTOCOL STACK EQUATION ── */}
      <section style={{ background: NAVY }} className="py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-5 flex-wrap">
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: "#A8B4C8" }}>{CORE_PROTOCOL_COUNT}</div>
                <div className="text-xs" style={{ color: "#5A6A8A" }}>Core Protocols</div>
              </div>
              <span style={{ color: "#3A4A6A", fontSize: "1.4rem" }}>+</span>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: GOLD }}>{pack.protocols.length}</div>
                <div className="text-xs" style={{ color: "#5A6A8A" }}>{pack.name} Protocols</div>
              </div>
              <span style={{ color: "#3A4A6A", fontSize: "1.4rem" }}>=</span>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: IVORY }}>{totalCoverage} total</div>
                <div className="text-xs" style={{ color: "#5A6A8A" }}>Total Readiness Coverage</div>
              </div>
            </div>
            <Link href="/founding-partner-program">
              <button className="px-6 py-2.5 text-sm font-semibold transition-all"
                style={{ background: GOLD, color: NAVY, borderRadius: "0.15rem" }}>
                Apply for Founding Partner Access →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── INDUSTRY PROTOCOLS ── */}
      <section className="py-20" style={{ background: "#fff" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8" style={{ background: GOLD }} />
              <span className="text-xs tracking-[0.2em] font-semibold uppercase" style={{ color: GOLD }}>
                Industry Protocols
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: NAVY, fontFamily: "Cormorant Garamond, serif", fontSize: "1.9rem" }}>
              {pack.protocols.length} {pack.name}-Specific Protocols
            </h2>
            <p className="text-sm max-w-xl" style={{ color: "#4A5568" }}>
              Pre-staged response sequences built for the exact triggers, regulatory context, and stakeholder structures of your industry — deployed on day one.
            </p>
          </div>
          <div className="space-y-4">
            {pack.protocols.map(protocol => {
              const urgency = URGENCY_COLORS[protocol.urgency];
              return (
                <div key={protocol.name} className="border rounded-sm p-6" style={{ borderColor: "#E5E7EB" }}>
                  <div className="flex items-start gap-4 mb-3">
                    {protocol.number && (
                      <div className="text-xs font-bold pt-0.5 flex-shrink-0" style={{ color: "#9CA3AF" }}>
                        #{protocol.number}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <h3 className="text-base font-bold" style={{ color: NAVY }}>{protocol.name}</h3>
                        <span className="text-xs px-2 py-0.5 font-semibold rounded-sm"
                          style={{ background: urgency.bg, color: urgency.text }}>
                          {protocol.urgency}
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
                  <div className="flex flex-wrap gap-2 mt-3 ml-7">
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
      <section className="py-16" style={{ background: "#fff" }}>
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
                Every {pack.name} Readiness OS includes the full Core Platform from day one —
                the scenarios every startup to Fortune 500 faces regardless of vertical.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {pack.coreExamples.map(ex => (
                  <div key={ex} className="flex items-center gap-2">
                    <CheckCircle2 size={13} style={{ color: GOLD, flexShrink: 0 }} />
                    <span className="text-sm font-medium" style={{ color: "#374151" }}>{ex}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2 col-span-2">
                  <span className="text-sm font-medium" style={{ color: "#9CA3AF" }}>
                    + {CORE_PROTOCOL_COUNT - pack.coreExamples.length} more Core Protocols
                  </span>
                </div>
              </div>
            </div>
            <div className="hidden md:block w-52 flex-shrink-0">
              <div className="rounded-sm p-6 text-center" style={{ background: NAVY }}>
                <Layers size={28} style={{ color: GOLD, margin: "0 auto 12px" }} />
                <div className="text-3xl font-bold mb-1" style={{ color: IVORY }}>{totalCoverage}</div>
                <div className="text-xs mb-1" style={{ color: "#7A8FA8" }}>Total Protocols</div>
                <div className="text-xs mb-4" style={{ color: "#5A6A8A" }}>{pack.name} Readiness OS</div>
                <div className="space-y-1.5 text-left">
                  <div className="text-xs flex justify-between">
                    <span style={{ color: "#7A8FA8" }}>Core</span>
                    <span style={{ color: "#A8B4C8" }}>{CORE_PROTOCOL_COUNT}</span>
                  </div>
                  <div className="text-xs flex justify-between">
                    <span style={{ color: GOLD }}>{pack.name}</span>
                    <span style={{ color: GOLD }}>{pack.protocols.length}</span>
                  </div>
                </div>
              </div>
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
          <h2 className="text-3xl font-bold mb-4" style={{ color: IVORY, fontFamily: "Cormorant Garamond, serif", fontSize: "2rem" }}>
            Deploy {pack.fullName}
          </h2>
          <p className="text-base mb-8 leading-relaxed" style={{ color: "#A8B4C8" }}>
            Founding Partners deploy {CORE_PROTOCOL_COUNT} Core Protocols plus {pack.protocols.length} {pack.name}-specific protocols
            from day one — {totalCoverage} total Readiness Protocols, pre-staged before your first trigger fires.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/founding-partner-program">
              <button className="px-8 py-3 text-sm font-semibold tracking-wide transition-all"
                style={{ background: GOLD, color: NAVY, borderRadius: "0.15rem" }}>
                Apply for Founding Partner Access →
              </button>
            </Link>
            <Link href="/industry">
              <button className="px-8 py-3 text-sm font-semibold tracking-wide border transition-all"
                style={{ borderColor: "#3A4A6A", color: IVORY, background: "transparent", borderRadius: "0.15rem" }}>
                ← View All Industry Packs
              </button>
            </Link>
          </div>
        </div>
      </section>

      <div className="flex justify-center py-8" style={{ background: NAVY }}>
        <BrandStamp variant="logo" size="sm" />
      </div>
    </PageLayout>
  );
}
