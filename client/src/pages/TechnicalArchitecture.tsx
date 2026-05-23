import { useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { updatePageMetadata } from "@/lib/seo";

const NAVY    = "#0A0F2E";
const NAVY_BG = "#132558";
const GOLD    = "#C9A84C";
const TEAL    = "#2B8A6E";
const IVORY   = "#F0EDE4";
const BORDER  = "#E2DDD5";

const GEO: React.CSSProperties = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const BAR: React.CSSProperties = { fontFamily: "'Barlow', 'Barlow Condensed', sans-serif" };
const BRC: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };

const LAYERS = [
  {
    num: "01",
    label: "Signal Detection",
    title: "Continuous Signal Ingestion",
    color: GOLD,
    desc: "39 pre-configured signal sources active from day one — zero setup required. Each incoming signal is scored against 221 trigger pattern templates using weighted keyword matching and domain classification. The evaluation engine accepts any additional source an enterprise wants to connect.",
    details: [
      { label: "Pre-configured sources", value: "39 live feeds covering market news, corporate announcements (PR Newswire, Business Wire), SEC EDGAR filings, government enforcement (FTC, DOJ, FDA, OSHA, EPA, CFPB, FINRA, EEOC, NLRB, FDIC, OCC, US Treasury), cybersecurity (CISA, SANS ISC), energy (EIA, FERC), economic indicators (Federal Reserve, BLS, ECB), global health (WHO, HHS), geopolitical (State Dept, White House, CBP), international regulatory (UK FCA) — all active immediately, no configuration required." },
      { label: "Custom sources", value: "Additional enterprise feeds, internal systems (ERP alerts, incident logs, Salesforce signals), and industry-specific data sources connect to the same 221-pattern evaluation engine." },
      { label: "Cadence", value: "Every 15 minutes — continuous during market hours, hourly overnight" },
      { label: "Risk classification", value: "Each signal scored and classified as LOW, MEDIUM, or HIGH risk. Classification drives protocol prioritization and executive notification thresholds." },
      { label: "Domain tagging", value: "Each signal classified to GROWTH & POSITIONING, RISK & RESILIENCE, or TRANSFORMATION" },
    ],
  },
  {
    num: "02",
    label: "Protocol Mapping",
    title: "Trigger → Protocol Resolution",
    color: TEAL,
    desc: "When a trigger pattern fires, the system resolves the appropriate Readiness Protocol from a library of 180 single-domain and 30 compound protocols. Compound protocols coordinate simultaneous multi-domain response.",
    details: [
      { label: "Protocol library", value: "170 cross-industry protocols · IDs 1–180. 30 compound protocols · IDs 181–210 (multi-domain, simultaneous activation)" },
      { label: "Trigger patterns", value: "221 named trigger templates. Each template maps to 1–4 primary protocols and includes escalation logic" },
      { label: "Compound logic", value: "Activist + Regulatory compound triggers both GROWTH & POSITIONING and RISK & RESILIENCE protocols simultaneously. Full 10-task dual-track war room." },
      { label: "Resolution speed", value: "Protocol selected in <2 seconds after trigger detection. No human routing required." },
    ],
  },
  {
    num: "03",
    label: "Execution Engine",
    title: "Pre-Staged Task Seeding",
    color: TEAL,
    desc: "At activation, the system seeds a structured task graph from the protocol template — ownership, sequencing, budget authorization, and stakeholder notifications — all pre-staged before the trigger fires.",
    details: [
      { label: "Task structure", value: "Priority, owner role, business value, dependencies, and estimated duration pre-defined per protocol. No coordination meeting required." },
      { label: "Authority chains", value: "Executive authorization gate built into every protocol. Activation requires sign-off before budget unlocks." },
      { label: "Budget authorization", value: "Pre-approved budget allocations by scenario category stored in the protocol template. CFO pre-authorizes ranges, not real-time." },
      { label: "Notification handoff", value: "Teams channel message, Outlook CEO brief, and war room activation fire simultaneously within 90 seconds of trigger." },
    ],
  },
  {
    num: "04",
    label: "Institutional Memory",
    title: "Post-Activation Knowledge Capture",
    color: "#2B8A6E",
    desc: "Every activation is fully recorded — decisions made, time elapsed, financial outcomes, and debrief classification. This builds a compounding organizational intelligence layer that improves every subsequent response.",
    details: [
      { label: "Activation record", value: "Trigger event, protocol activated, stakeholders notified, tasks completed, elapsed time, executive authorization timestamp" },
      { label: "Debrief classification", value: "Automatically classified as Optimization, Mixed-Signal, or Recovery. Recovery activations flag protocol gaps for update." },
      { label: "Financial tracking", value: "Actual costs logged against pre-authorized budget. Variance tracked. ROI calculated per activation." },
      { label: "Compound learning", value: "Debrief insights feed back into protocol templates. Organizations that activate more protocols develop faster, more accurate response over time." },
    ],
  },
];

const SOURCE_TIERS = [
  {
    tier: "LIVE",
    label: "Active now — 39 pre-configured sources",
    desc: "Running continuously. Zero setup required.",
    badgeColor: TEAL,
    badgeBg: "rgba(43,138,110,0.12)",
    badgeBorder: "rgba(43,138,110,0.35)",
    textColor: TEAL,
    sources: [
      { name: "NY Times Business", category: "Market news" },
      { name: "BBC Business", category: "Market news" },
      { name: "Reuters Business", category: "Market news" },
      { name: "AP Business", category: "Market news" },
      { name: "Business Wire", category: "Corporate announcements" },
      { name: "CNBC Business", category: "Financial" },
      { name: "MarketWatch", category: "Financial" },
      { name: "NPR Business", category: "Market news" },
      { name: "Google News Finance", category: "Financial" },
      { name: "Entrepreneur", category: "Market news" },
      { name: "PR Newswire", category: "Corporate announcements" },
      { name: "Federal Register", category: "Regulatory" },
      { name: "SEC EDGAR", category: "Regulatory / filings" },
      { name: "FTC", category: "Regulatory enforcement" },
      { name: "DOJ", category: "Legal enforcement" },
      { name: "FDA", category: "Safety / healthcare" },
      { name: "OSHA", category: "Workplace safety" },
      { name: "EPA", category: "Environmental regulatory" },
      { name: "FINRA", category: "Financial industry regulatory" },
      { name: "CFPB", category: "Consumer financial protection" },
      { name: "NTSB", category: "Transportation safety" },
      { name: "US Treasury", category: "Sanctions / financial enforcement" },
      { name: "FDIC", category: "Banking system / financial stability" },
      { name: "OCC", category: "Federal banking regulatory" },
      { name: "EEOC", category: "Employment / labor enforcement" },
      { name: "NLRB", category: "Labor relations" },
      { name: "FERC", category: "Energy regulatory" },
      { name: "CBP", category: "Trade / customs enforcement" },
      { name: "White House", category: "Executive orders / policy" },
      { name: "CISA", category: "Cybersecurity advisories" },
      { name: "SANS Internet Storm Center", category: "Cyber threat intelligence" },
      { name: "Federal Reserve", category: "Economic indicators" },
      { name: "Bureau of Labor Statistics", category: "Economic / labor data" },
      { name: "EIA", category: "Energy data / pricing" },
      { name: "ECB", category: "European monetary policy" },
      { name: "WHO", category: "Global health" },
      { name: "HHS", category: "Health & human services policy" },
      { name: "State Dept", category: "Geopolitical risk" },
      { name: "UK FCA", category: "UK / international financial regulatory" },
    ],
  },
  {
    tier: "ON REQUEST",
    label: "Industry-specific & custom sources",
    desc: "Trade associations, industry journals, and regional feeds. Scoped at onboarding.",
    badgeColor: GOLD,
    badgeBg: "rgba(201,168,76,0.1)",
    badgeBorder: "rgba(201,168,76,0.35)",
    textColor: NAVY,
    sources: [
      { name: "Industry Trade Associations", category: "Sector-specific publications" },
      { name: "State & Regional Regulators", category: "State-level enforcement" },
      { name: "Healthcare IT / MedTech Publications", category: "Healthcare industry" },
      { name: "Supply Chain Dive / Logistics Media", category: "Supply chain intelligence" },
      { name: "Financial Times", category: "International financial news" },
      { name: "Competitor-specific monitoring", category: "Competitive intelligence" },
      { name: "Academic & Research Journals", category: "Industry research signals" },
      { name: "Customer-specified publications", category: "Organization-defined" },
    ],
  },
  {
    tier: "ENTERPRISE CONNECT",
    label: "Customer's own internal systems",
    desc: "Connects via Microsoft Fabric or direct API. Founding Partner roadmap.",
    badgeColor: "#0078D4",
    badgeBg: "rgba(0,120,212,0.08)",
    badgeBorder: "rgba(0,120,212,0.3)",
    textColor: NAVY,
    sources: [
      { name: "Salesforce", category: "CRM / pipeline signals" },
      { name: "ServiceNow", category: "ITSM / incident triggers" },
      { name: "Workday", category: "HR / attrition signals" },
      { name: "SAP / Oracle ERP", category: "Operational data" },
      { name: "Microsoft Sentinel", category: "SIEM / security events" },
      { name: "CrowdStrike / Splunk", category: "Threat detection" },
      { name: "SAP Ariba / Coupa", category: "Supply chain" },
      { name: "Jira / Azure DevOps", category: "Engineering incident signals" },
    ],
  },
  {
    tier: "PREMIUM",
    label: "Paid API — enterprise tier",
    desc: "Available on request. Licensing costs passed through.",
    badgeColor: "rgba(10,15,46,0.4)",
    badgeBg: "rgba(10,15,46,0.04)",
    badgeBorder: "rgba(10,15,46,0.15)",
    textColor: "rgba(10,15,46,0.45)",
    sources: [
      { name: "Bloomberg Terminal", category: "Real-time financial / market data" },
      { name: "Reuters Refinitiv", category: "Financial intelligence" },
      { name: "LexisNexis / Factiva", category: "News archive / legal" },
      { name: "S&P Capital IQ", category: "Company / credit intelligence" },
      { name: "Moody's Analytics", category: "Credit risk" },
      { name: "Dun & Bradstreet", category: "Supplier / counterparty risk" },
    ],
  },
];

const INTEGRATIONS = [
  { platform: "Microsoft Teams", status: "LIVE", desc: "Stakeholder channel notifications, role-specific briefings, war room coordination links", color: "#6264A7" },
  { platform: "Microsoft Outlook", status: "LIVE", desc: "Executive authorization requests, CEO inbox briefings, board-ready activation reports", color: GOLD },
  { platform: "Microsoft SharePoint", status: "LIVE", desc: "Protocol document storage, full brief archival, institutional memory repository", color: "#0078D4" },
  { platform: "Microsoft Entra", status: "LIVE", desc: "Enterprise SSO / OIDC authentication, role provisioning, org tenant isolation", color: "#0078D4" },
  { platform: "Copilot Studio", status: "ROADMAP", desc: "Conversational protocol query, AI-assisted debrief generation, executive Q&A on active situations", color: "rgba(255,255,255,0.3)" },
  { platform: "Power Automate", status: "ROADMAP", desc: "Automated task routing into existing enterprise workflow systems, approval escalation chains", color: "rgba(255,255,255,0.3)" },
  { platform: "Microsoft Sentinel", status: "ROADMAP", desc: "Direct SIEM signal ingestion for cybersecurity triggers — ransomware, breach detection, anomalous access", color: "rgba(255,255,255,0.3)" },
  { platform: "Microsoft Fabric", status: "ROADMAP", desc: "Enterprise data lake integration — signal enrichment from internal financial and operational data", color: "rgba(255,255,255,0.3)" },
];

const DATA_MODEL = [
  { entity: "Organization", summary: "Multi-tenant root. Every record — signals, protocols, activations, debriefs — is fully scoped to the organization. Cross-tenant reads are prevented at the query layer.", icon: "🏢" },
  { entity: "Trigger Event", summary: "Every detected signal is recorded with its risk classification, domain, signal count, and timestamp. Immutable record — feeds protocol resolution and historical trend analysis.", icon: "⚡" },
  { entity: "Protocol Activation", summary: "Each activation captures the executive authorization event — who authorized, when, and what budget was unlocked. Once authorized, the activation record is immutable.", icon: "🔐" },
  { entity: "Task Record", summary: "Full audit trail per task: owner, priority, business value, and completion timestamp. Used for ROI calculation and debrief classification.", icon: "✅" },
  { entity: "Activation Debrief", summary: "Post-activation classification (Optimization, Mixed-Signal, or Recovery), elapsed time, actual cost, and outcome notes. Feeds the institutional memory layer — organizations improve with every activation.", icon: "📊" },
];

export default function TechnicalArchitecture() {
  useEffect(() => {
    updatePageMetadata({
      title: "Technical Architecture — VaughnMartin Readiness OS",
      description: "How Readiness OS works end to end — signal detection, trigger-to-protocol mapping, execution engine, institutional memory, and Microsoft integration architecture.",
    });
  }, []);

  return (
    <PageLayout>
      {/* Hero */}
      <div style={{ background: NAVY, padding: "80px 32px 64px", textAlign: "center" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 32, height: 1, background: `rgba(201,168,76,0.5)` }} />
            <span style={{ ...BRC, fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(201,168,76,0.8)" }}>Technical Architecture</span>
            <div style={{ width: 32, height: 1, background: `rgba(201,168,76,0.5)` }} />
          </div>
          <h1 style={{ ...GEO, fontSize: "clamp(32px,4.5vw,54px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 20 }}>
            How Readiness OS works,<br /><em style={{ color: GOLD }}>end to end</em>
          </h1>
          <p style={{ ...BAR, fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.75, maxWidth: 600, margin: "0 auto 32px" }}>
            Four architectural layers — signal detection, protocol resolution, execution engine, and institutional memory — operating on a Microsoft-native integration stack.
          </p>
          <div style={{ display: "inline-flex", gap: 2 }}>
            {["221 trigger patterns", "180 Readiness Protocols", "12-minute execution", "Microsoft-native"].map(tag => (
              <span key={tag} style={{ ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(201,168,76,0.75)", padding: "6px 14px", border: "1px solid rgba(201,168,76,0.2)", background: "rgba(201,168,76,0.05)" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Architecture stack overview */}
      <div style={{ background: "#F8F7F4", padding: "12px 32px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", alignItems: "center", gap: 0 }}>
          {[
            { n: "01", l: "Signal", sub: "Detection" },
            { n: "02", l: "Protocol", sub: "Mapping" },
            { n: "03", l: "Execution", sub: "Engine" },
            { n: "04", l: "Institutional", sub: "Memory" },
          ].map((step, i) => (
            <div key={i} style={{ flex: 1, display: "flex", alignItems: "center" }}>
              <div style={{ flex: 1, textAlign: "center", padding: "14px 8px" }}>
                <div style={{ ...BRC, fontSize: 9, fontWeight: 700, color: GOLD, letterSpacing: "0.16em", marginBottom: 2 }}>{step.n}</div>
                <div style={{ ...BAR, fontSize: 11, fontWeight: 700, color: NAVY }}>{step.l}</div>
                <div style={{ ...BAR, fontSize: 10, color: "rgba(10,15,46,0.45)" }}>{step.sub}</div>
              </div>
              {i < 3 && <div style={{ fontSize: 14, color: "rgba(10,15,46,0.25)", padding: "0 4px" }}>→</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Architecture layers */}
      <div style={{ background: "#fff", padding: "0" }}>
        {LAYERS.map((layer, i) => (
          <div key={i} style={{ borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ maxWidth: 900, margin: "0 auto", padding: "56px 32px", display: "grid", gridTemplateColumns: "200px 1fr", gap: 48 }}>
              {/* Left */}
              <div>
                <div style={{ ...BRC, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: layer.color, marginBottom: 6 }}>Layer {layer.num}</div>
                <div style={{ ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(10,15,46,0.4)", marginBottom: 16 }}>{layer.label}</div>
                <div style={{ width: 32, height: 2, background: layer.color }} />
              </div>
              {/* Right */}
              <div>
                <h2 style={{ ...GEO, fontSize: 26, fontWeight: 600, color: NAVY, marginBottom: 12, lineHeight: 1.2 }}>{layer.title}</h2>
                <p style={{ ...BAR, fontSize: 14, color: "rgba(10,15,46,0.6)", lineHeight: 1.75, marginBottom: 28 }}>{layer.desc}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {layer.details.map(d => (
                    <div key={d.label} style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 16, paddingTop: 12, borderTop: `1px solid ${BORDER}` }}>
                      <div style={{ ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(10,15,46,0.4)", paddingTop: 2 }}>{d.label}</div>
                      <div style={{ ...BAR, fontSize: 12, color: "rgba(10,15,46,0.7)", lineHeight: 1.65 }}>{d.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Signal Source Directory */}
      <div style={{ background: "#F8F7F4", padding: "72px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ marginBottom: 48 }}>
            <div style={{ ...BRC, fontSize: 10, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: GOLD, marginBottom: 10 }}>Signal Source Directory</div>
            <h2 style={{ ...GEO, fontSize: "clamp(24px,3vw,38px)", fontWeight: 600, color: NAVY, marginBottom: 10 }}>Every source your organization could need</h2>
            <p style={{ ...BAR, fontSize: 14, color: "rgba(10,15,46,0.55)", lineHeight: 1.7, maxWidth: 640 }}>
              25 sources are pre-configured and running on day one — no setup required. Industry-specific custom feeds are added at onboarding. Internal systems and premium data connect via Enterprise Connect.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {SOURCE_TIERS.map(tier => (
              <div key={tier.tier}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                  <span style={{ ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", padding: "4px 10px", background: tier.badgeBg, color: tier.badgeColor, border: `1px solid ${tier.badgeBorder}` }}>
                    {tier.tier}
                  </span>
                  <div>
                    <span style={{ ...BAR, fontSize: 12, fontWeight: 700, color: NAVY }}>{tier.label}</span>
                    <span style={{ ...BAR, fontSize: 11, color: "rgba(10,15,46,0.45)", marginLeft: 10 }}>{tier.desc}</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {tier.sources.map(src => (
                    <div key={src.name} style={{ background: "#fff", border: `1px solid rgba(10,15,46,0.1)`, borderLeft: `3px solid ${tier.badgeColor}`, padding: "8px 14px" }}>
                      <div style={{ ...BAR, fontSize: 11, fontWeight: 700, color: tier.textColor === NAVY ? NAVY : tier.textColor }}>{src.name}</div>
                      <div style={{ ...BRC, fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(10,15,46,0.4)", marginTop: 2 }}>{src.category}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 32, padding: "16px 22px", background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.2)", display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ ...BAR, fontSize: 12, color: GOLD, fontWeight: 700, flexShrink: 0 }}>Source request:</span>
            <span style={{ ...BAR, fontSize: 12, color: "rgba(10,15,46,0.6)", lineHeight: 1.6 }}>
              Founding Partners can request any ON REQUEST source during onboarding. Enterprise Connect and Premium sources are scoped during the 90-day validation partnership.
            </span>
          </div>
        </div>
      </div>

      {/* Microsoft Integration Map */}
      <div style={{ background: NAVY, padding: "72px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ marginBottom: 40 }}>
            <div style={{ ...BRC, fontSize: 10, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(201,168,76,0.75)", marginBottom: 10 }}>Integration Map</div>
            <h2 style={{ ...GEO, fontSize: "clamp(24px,3vw,38px)", fontWeight: 600, color: "#fff", marginBottom: 10 }}>Microsoft + platform integrations</h2>
            <p style={{ ...BAR, fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: 620 }}>
              Every enterprise already has the Microsoft stack. Readiness OS is the operating model layer above it — not a replacement. Live integrations operate on the existing investment; roadmap items extend it.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2, marginBottom: 32 }}>
            {INTEGRATIONS.map(item => (
              <div key={item.platform} style={{
                background: item.status === "LIVE" ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${item.status === "LIVE" ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.05)"}`,
                padding: "20px 22px",
                borderLeft: `3px solid ${item.status === "LIVE" ? item.color : "rgba(255,255,255,0.12)"}`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ ...BAR, fontSize: 13, fontWeight: 700, color: item.status === "LIVE" ? "#fff" : "rgba(255,255,255,0.4)" }}>{item.platform}</div>
                  <span style={{ ...BRC, fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", padding: "3px 8px",
                    background: item.status === "LIVE" ? "rgba(43,138,110,0.25)" : "rgba(255,255,255,0.06)",
                    color: item.status === "LIVE" ? TEAL : "rgba(255,255,255,0.3)",
                    border: `1px solid ${item.status === "LIVE" ? "rgba(43,138,110,0.4)" : "rgba(255,255,255,0.1)"}`,
                  }}>
                    {item.status}
                  </span>
                </div>
                <div style={{ ...BAR, fontSize: 11, color: item.status === "LIVE" ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.25)", lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ padding: "16px 22px", background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.2)", display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ ...BAR, fontSize: 12, color: "rgba(201,168,76,0.8)", fontWeight: 700, flexShrink: 0 }}>Framing:</span>
            <span style={{ ...BAR, fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>
              "Every enterprise has Microsoft's AI stack. None have the operating model to use it." Readiness OS orchestrates the existing investment — Copilot surfaces insights; Readiness OS acts on them.
            </span>
          </div>
        </div>
      </div>

      {/* Data Model */}
      <div style={{ background: IVORY, padding: "72px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ marginBottom: 40 }}>
            <div style={{ ...BRC, fontSize: 10, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: GOLD, marginBottom: 10 }}>Institutional Memory</div>
            <h2 style={{ ...GEO, fontSize: "clamp(24px,3vw,38px)", fontWeight: 600, color: NAVY, marginBottom: 10 }}>Core data model</h2>
            <p style={{ ...BAR, fontSize: 14, color: "rgba(10,15,46,0.55)", lineHeight: 1.7, maxWidth: 560 }}>
              Every activation is fully recorded. Every debrief is classified and stored. The institutional memory layer compounds — organizations that use Readiness OS for longer respond faster and with greater precision.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {DATA_MODEL.map((entity, i) => (
              <div key={i} style={{ background: "#fff", border: `1px solid ${BORDER}`, padding: "20px 24px", display: "grid", gridTemplateColumns: "180px 1fr", gap: 28, alignItems: "start" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{entity.icon}</span>
                  <div style={{ ...BRC, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: TEAL }}>{entity.entity}</div>
                </div>
                <div style={{ ...BAR, fontSize: 12, color: "rgba(10,15,46,0.65)", lineHeight: 1.7 }}>{entity.summary}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2026 AI Stack Positioning */}
      <div style={{ background: NAVY, padding: "80px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ marginBottom: 48 }}>
            <div style={{ ...BRC, fontSize: 10, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(201,168,76,0.75)", marginBottom: 10 }}>Enterprise AI Stack</div>
            <h2 style={{ ...GEO, fontSize: "clamp(24px,3vw,38px)", fontWeight: 600, color: "#fff", marginBottom: 12 }}>
              Where Readiness OS sits in the 2026 stack
            </h2>
            <p style={{ ...BAR, fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.75, maxWidth: 640 }}>
              Every enterprise is building Layers 1–4. The gap is always the same: who authorized this, what was the pre-staged plan, and what did we learn? Readiness OS is the operating model that connects the Agent Layer to measurable Business Impact.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {[
              {
                num: "5",
                label: "Business Impact Layer",
                desc: "Strategy & Decision Making · Operations",
                role: "Readiness OS primary layer — 170 pre-staged Readiness Protocols across 221 trigger scenarios. 12-minute response replaces 30-day mobilization cycle.",
                highlight: true,
                color: GOLD,
              },
              {
                num: "4",
                label: "Agent Layer",
                desc: "Multi-Agent Systems · Autonomous Workflows",
                role: "Readiness OS orchestration layer — 8-tier signal evaluation pipeline, IDEA Framework agents (IDENTIFY → DETECT → AUTHORIZE → EXECUTE → ADVANCE), parallel tier execution.",
                highlight: false,
                color: TEAL,
              },
              {
                num: "3",
                label: "Intelligence Layer",
                desc: "RAG · Memory · Context Orchestration",
                role: "Readiness OS intelligence layer — 39-feed live signal ingestion, 221-pattern trigger evaluation, semantic embedding scoring, institutional activation memory.",
                highlight: false,
                color: TEAL,
              },
              {
                num: "2",
                label: "Model Layer",
                desc: "Proprietary Models · Fine-Tuned Models",
                role: "Azure OpenAI primary with OpenAI fallback — executive summaries, signal classification, risk narrative generation, protocol recommendations.",
                highlight: false,
                color: "rgba(255,255,255,0.3)",
              },
              {
                num: "1",
                label: "Infrastructure Layer",
                desc: "Cloud · Data Centers · Security",
                role: "Azure cloud infrastructure (aligns with Microsoft enterprise investment), Neon serverless PostgreSQL, TLS 1.2+ transport, OIDC authentication.",
                highlight: false,
                color: "rgba(255,255,255,0.3)",
              },
            ].map((layer, i) => (
              <div key={i} style={{
                display: "grid",
                gridTemplateColumns: "60px 220px 1fr",
                gap: 0,
                background: layer.highlight ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${layer.highlight ? "rgba(201,168,76,0.3)" : "rgba(255,255,255,0.07)"}`,
                borderLeft: `3px solid ${layer.color}`,
                overflow: "hidden",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.15)", padding: "20px 0" }}>
                  <span style={{ ...GEO, fontSize: 22, fontWeight: 700, color: layer.color }}>{layer.num}</span>
                </div>
                <div style={{ padding: "18px 20px", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ ...BAR, fontSize: 12, fontWeight: 700, color: layer.highlight ? GOLD : "#fff", marginBottom: 4 }}>{layer.label}</div>
                  <div style={{ ...BRC, fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", lineHeight: 1.5 }}>{layer.desc}</div>
                </div>
                <div style={{ padding: "18px 24px", display: "flex", alignItems: "center" }}>
                  <span style={{ ...BAR, fontSize: 12, color: layer.highlight ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.45)", lineHeight: 1.65 }}>
                    {layer.highlight && <span style={{ color: GOLD, fontWeight: 700 }}>Readiness OS → </span>}
                    {layer.role}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 28, padding: "16px 24px", background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", display: "flex", gap: 16, alignItems: "flex-start" }}>
            <span style={{ ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: GOLD, flexShrink: 0, paddingTop: 2 }}>The gap</span>
            <span style={{ ...BAR, fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
              Layers 1–4 are commoditizing. Every enterprise will have cloud, models, RAG, and agents. The enduring gap is the operating model between Layer 4 and Layer 5 — pre-staged responses, executive authorization chains, and institutional memory that compounds. That is what Readiness OS provides.
            </span>
          </div>

          <div style={{ marginTop: 12, textAlign: "right" }}>
            <a href="/ai-stack" style={{ ...BRC, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: GOLD, textDecoration: "none" }}>
              Full Stack Positioning Overview →
            </a>
          </div>
        </div>
      </div>

      {/* Security summary */}
      <div style={{ background: "#fff", padding: "56px 32px", borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
          {[
            { label: "Authentication", value: "OIDC / SSO", sub: "Replit OIDC + enterprise SSO-ready. Fail-closed on all role errors." },
            { label: "Data isolation", value: "Org-scoped", sub: "Every query validates org membership. Cross-tenant reads prevented." },
            { label: "Transport", value: "TLS 1.2+", sub: "All API and WebSocket connections encrypted in transit." },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center", padding: "28px 20px", border: `1px solid ${BORDER}` }}>
              <div style={{ ...BRC, fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(10,15,46,0.35)", marginBottom: 8 }}>{s.label}</div>
              <div style={{ ...GEO, fontSize: 22, fontWeight: 700, color: NAVY, marginBottom: 6 }}>{s.value}</div>
              <div style={{ ...BAR, fontSize: 11, color: "rgba(10,15,46,0.5)", lineHeight: 1.6 }}>{s.sub}</div>
            </div>
          ))}
        </div>
        <div style={{ maxWidth: 900, margin: "24px auto 0", display: "flex", gap: 12, justifyContent: "center" }}>
          <a href="/security-compliance" style={{ ...BRC, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: NAVY, padding: "10px 24px", border: `1px solid ${NAVY}`, textDecoration: "none" }}>
            Full Security & Compliance Overview →
          </a>
          <a href="/contact" style={{ ...BRC, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: GOLD, padding: "10px 24px", border: `1px solid rgba(201,168,76,0.4)`, textDecoration: "none" }}>
            Request Architecture Brief →
          </a>
        </div>
      </div>
    </PageLayout>
  );
}
