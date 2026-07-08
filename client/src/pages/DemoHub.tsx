import { useState } from "react";
import { Link } from "wouter";
import StandardNav from "@/components/layout/StandardNav";
import { roleConfigs } from "@/data/roleConfigs";
import { Play, Rocket, ArrowRight, Zap, ChevronRight } from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const BC   = { fontFamily: "'Barlow Condensed', sans-serif" } as const;
const CG   = { fontFamily: "'Cormorant Garamond', Georgia, serif" } as const;

// ─── DOMAIN CONFIG ─────────────────────────────────────────────────────────────
const DOMAIN: Record<string, { color: string; bg: string; border: string }> = {
  "GROWTH & POSITIONING": { color: TEAL,      bg: "rgba(43,138,110,0.10)",  border: "rgba(43,138,110,0.30)"  },
  "RISK & RESILIENCE":    { color: "#E74C3C",  bg: "rgba(231,76,60,0.08)",   border: "rgba(231,76,60,0.28)"   },
  "TRANSFORMATION":       { color: GOLD,       bg: "rgba(201,168,76,0.08)",  border: "rgba(201,168,76,0.28)"  },
};

const CAT: Record<string, { label: string; color: string; bg: string; border: string }> = {
  OFFENSE:         { label: "Growth & Positioning", color: TEAL,     bg: "rgba(43,138,110,0.10)",  border: "rgba(43,138,110,0.28)"  },
  DEFENSE:         { label: "Risk & Resilience",    color: "#E74C3C", bg: "rgba(231,76,60,0.08)",   border: "rgba(231,76,60,0.28)"   },
  "SPECIAL TEAMS": { label: "Transformation",       color: GOLD,      bg: "rgba(201,168,76,0.08)",  border: "rgba(201,168,76,0.28)"  },
};

// ─── SCENARIOS ────────────────────────────────────────────────────────────────
interface Scenario {
  id: string;
  name: string;
  tagline: string;
  audience: string;
  domain: string;
  industry: string;
  protocol: string;
  href: string;
}

const SCENARIOS: Scenario[] = [
  // GROWTH & POSITIONING
  {
    id: "activist",
    name: "Activist Investor Response",
    tagline: "Activist files 13D at 2:47 AM — 9.2% stake. Board demands a plan by market open.",
    audience: "CEO · Board · CFO · GC",
    domain: "GROWTH & POSITIONING",
    industry: "Enterprise",
    protocol: "#031",
    href: "/master-demo",
  },
  {
    id: "market-entry",
    name: "Competitor Displacement Sprint",
    tagline: "LegacyPoint files Chapter 11. 1,400 enterprise accounts in-play. 72-hour window.",
    audience: "CEO · CRO · CMO · Sales",
    domain: "GROWTH & POSITIONING",
    industry: "Enterprise Software",
    protocol: "#031",
    href: "/demo/market-entry",
  },
  {
    id: "acquisition",
    name: "M&A Rapid Response",
    tagline: "Waypoint Analytics authorizes a sale. LOI required in 48 hours or Blackstone wins it.",
    audience: "CEO · CFO · M&A · GC",
    domain: "GROWTH & POSITIONING",
    industry: "Financial Services",
    protocol: "#058",
    href: "/demo/acquisition",
  },
  // RISK & RESILIENCE
  {
    id: "ransomware",
    name: "Financial Services Ransomware",
    tagline: "Trading systems encrypted at 4:23 AM. SWIFT offline. Market open in 4 hours.",
    audience: "CISO · CIO · CRO · CEO",
    domain: "RISK & RESILIENCE",
    industry: "Financial Services",
    protocol: "#007",
    href: "/demo/ransomware",
  },
  {
    id: "pharma",
    name: "FDA Class I Recall",
    tagline: "Contaminated batch confirmed. 340,000 units distributed. 72-hour regulatory window.",
    audience: "CEO · GC · CMO · Ops",
    domain: "RISK & RESILIENCE",
    industry: "Pharmaceutical",
    protocol: "#044",
    href: "/demo/pharma",
  },
  {
    id: "supply-chain",
    name: "Supply Chain Collapse",
    tagline: "Primary supplier files Chapter 11. 60% of Q3 production at risk. No contingency staged.",
    audience: "COO · CFO · Procurement",
    domain: "RISK & RESILIENCE",
    industry: "Manufacturing",
    protocol: "#062",
    href: "/demo/supply-chain",
  },
  {
    id: "energy",
    name: "Energy Grid Failure",
    tagline: "Grid substation offline. 280K customers. NERC CIP compliance clock started.",
    audience: "COO · CTO · Regulatory",
    domain: "RISK & RESILIENCE",
    industry: "Energy & Utilities",
    protocol: "#091",
    href: "/demo/energy",
  },
  {
    id: "food-safety",
    name: "Food Safety Crisis",
    tagline: "E.coli outbreak linked to your product. CNN has 45 minutes. No protocol staged.",
    audience: "CEO · CMO · Legal · Ops",
    domain: "RISK & RESILIENCE",
    industry: "Retail & Consumer",
    protocol: "#054",
    href: "/demo/food-safety",
  },
  {
    id: "data-breach",
    name: "Data Breach Response",
    tagline: "2.3M customer records on the dark web. GDPR 72-hour notification clock running.",
    audience: "CISO · GC · CMO · CEO",
    domain: "RISK & RESILIENCE",
    industry: "Technology",
    protocol: "#013",
    href: "/demo/data-breach",
  },
  {
    id: "regulatory",
    name: "DOJ Investigation",
    tagline: "Civil Investigative Demand received. Litigation hold must issue today or spoliation risk.",
    audience: "GC · CEO · CFO · Board",
    domain: "RISK & RESILIENCE",
    industry: "Enterprise",
    protocol: "#078",
    href: "/demo/regulatory",
  },
  // TRANSFORMATION
  {
    id: "product-launch",
    name: "Go-to-Market Sprint",
    tagline: "Competitor announces 30-day launch window. Board authorizes GTM acceleration.",
    audience: "CMO · CRO · CTO · CEO",
    domain: "TRANSFORMATION",
    industry: "Enterprise Software",
    protocol: "#089",
    href: "/demo/product-launch",
  },
  {
    id: "workforce",
    name: "Workforce Transformation",
    tagline: "Board approves AI realignment — 6,720 roles, 12 countries, 48-hour mobilization window.",
    audience: "CHRO · CEO · COO · CFO",
    domain: "TRANSFORMATION",
    industry: "Industrial Manufacturing",
    protocol: "#112",
    href: "/demo/workforce",
  },
];

// ─── INDUSTRIES ────────────────────────────────────────────────────────────────
interface IndustryGroup {
  label: string;
  icon: string;
  description: string;
  scenarioIds: string[];
  dedicatedHref?: string;
}

const INDUSTRIES: IndustryGroup[] = [
  {
    label: "Financial Services",
    icon: "🏦",
    description: "Ransomware, M&A mobilization, trading system recovery, regulatory response",
    scenarioIds: ["ransomware", "acquisition"],
    dedicatedHref: "/financial-demo",
  },
  {
    label: "Pharmaceutical",
    icon: "💊",
    description: "FDA recalls, product contamination, regulatory windows, distribution holds",
    scenarioIds: ["pharma"],
    dedicatedHref: "/pharma-demo",
  },
  {
    label: "Manufacturing",
    icon: "⚙️",
    description: "Supply chain collapse, force majeure, production continuity, supplier failure",
    scenarioIds: ["supply-chain"],
    dedicatedHref: "/manufacturing-demo",
  },
  {
    label: "Energy & Utilities",
    icon: "⚡",
    description: "Grid failure, NERC CIP compliance, outage response, infrastructure events",
    scenarioIds: ["energy"],
    dedicatedHref: "/energy-demo",
  },
  {
    label: "Retail & Consumer",
    icon: "🛒",
    description: "Food safety crisis, brand threat, product recall, media response window",
    scenarioIds: ["food-safety"],
    dedicatedHref: "/retail-demo",
  },
  {
    label: "Technology",
    icon: "💻",
    description: "Data breach, GDPR clock, ransomware, cloud outage, integrity events",
    scenarioIds: ["data-breach"],
  },
  {
    label: "Enterprise Software",
    icon: "🚀",
    description: "Competitor displacement, GTM sprint, market share defense, launch windows",
    scenarioIds: ["market-entry", "product-launch"],
  },
  {
    label: "Luxury & Consumer Brands",
    icon: "💎",
    description: "Brand crisis, market entry, rapid repositioning, reputation events",
    scenarioIds: [],
    dedicatedHref: "/luxury-demo",
  },
];

// ─── CARDS ─────────────────────────────────────────────────────────────────────
function ScenarioCard({ sc }: { sc: Scenario }) {
  const dom = DOMAIN[sc.domain] ?? DOMAIN["RISK & RESILIENCE"];

  return (
    <Link href={sc.href} style={{ textDecoration: "none" }}>
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.09)",
          padding: "22px 22px 20px",
          cursor: "pointer",
          transition: "all 0.18s",
          height: "100%",
          display: "flex",
          flexDirection: "column" as const,
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = "rgba(255,255,255,0.08)";
          el.style.borderColor = dom.border;
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = "rgba(255,255,255,0.04)";
          el.style.borderColor = "rgba(255,255,255,0.09)";
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{
            ...BC, fontSize: 8, fontWeight: 800, letterSpacing: "0.22em",
            textTransform: "uppercase" as const, color: dom.color,
            background: dom.bg, border: `1px solid ${dom.border}`, padding: "2px 8px",
          }}>
            {sc.domain}
          </span>
          <span style={{ ...BC, fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.32)", letterSpacing: "0.1em" }}>
            Protocol {sc.protocol}
          </span>
        </div>

        <div style={{ ...CG, fontSize: 19, fontWeight: 700, color: "#fff", lineHeight: 1.25, marginBottom: 10, flex: 1 }}>
          {sc.name}
        </div>

        <p style={{ ...BC, fontSize: 13, color: "rgba(255,255,255,0.58)", lineHeight: 1.5, margin: "0 0 16px" }}>
          {sc.tagline}
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 12 }}>
          <span style={{ ...BC, fontSize: 10, color: "rgba(255,255,255,0.36)", letterSpacing: "0.06em" }}>
            {sc.audience}
          </span>
          <span style={{ ...BC, fontSize: 10, fontWeight: 700, color: dom.color, letterSpacing: "0.12em", textTransform: "uppercase" as const }}>
            Run Scenario →
          </span>
        </div>
      </div>
    </Link>
  );
}

function RoleCard({ role }: { role: typeof roleConfigs[0] }) {
  const Icon = role.icon;
  const cat = CAT[role.category] ?? CAT.OFFENSE;

  return (
    <Link href={`/experience/${role.id}`} style={{ textDecoration: "none" }}>
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.09)",
          padding: "20px 20px 18px",
          cursor: "pointer",
          transition: "all 0.18s",
          height: "100%",
          display: "flex",
          flexDirection: "column" as const,
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = "rgba(255,255,255,0.08)";
          el.style.borderColor = cat.border;
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = "rgba(255,255,255,0.04)";
          el.style.borderColor = "rgba(255,255,255,0.09)";
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 34, height: 34,
            background: cat.bg, border: `1px solid ${cat.border}`,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Icon size={15} style={{ color: cat.color }} />
          </div>
          <span style={{
            ...BC, fontSize: 8, fontWeight: 800, letterSpacing: "0.18em",
            textTransform: "uppercase" as const, color: cat.color,
          }}>
            {cat.label}
          </span>
        </div>

        <div style={{ ...BC, fontSize: 14, fontWeight: 800, color: "#fff", lineHeight: 1.3, marginBottom: 8, letterSpacing: "0.01em" }}>
          {role.title}
        </div>

        <p style={{ ...BC, fontSize: 12, color: "rgba(255,255,255,0.52)", lineHeight: 1.5, margin: "0 0 12px", flex: 1 }}>
          {role.situationLine}
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 10 }}>
          <span style={{ ...BC, fontSize: 10, color: TEAL, fontWeight: 700 }}>
            {role.metricAfter} ← {role.metricBefore}
          </span>
          <span style={{ ...BC, fontSize: 9, fontWeight: 700, color: GOLD, letterSpacing: "0.12em", textTransform: "uppercase" as const }}>
            Enter →
          </span>
        </div>
      </div>
    </Link>
  );
}

function IndustryCard({ ind }: { ind: IndustryGroup }) {
  const linked = SCENARIOS.filter(s => ind.scenarioIds.includes(s.id));
  const primaryHref = ind.dedicatedHref ?? (linked[0]?.href ?? "/demo-hub");

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.09)",
      padding: "24px",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
        <span style={{ fontSize: 28, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>{ind.icon}</span>
        <div>
          <div style={{ ...BC, fontSize: 15, fontWeight: 800, color: "#fff", letterSpacing: "0.01em", marginBottom: 4 }}>
            {ind.label}
          </div>
          <div style={{ ...BC, fontSize: 11, color: "rgba(255,255,255,0.44)", lineHeight: 1.4 }}>
            {ind.description}
          </div>
        </div>
      </div>

      {linked.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 6, marginBottom: 14 }}>
          {linked.map(sc => {
            const dom = DOMAIN[sc.domain];
            return (
              <Link key={sc.id} href={sc.href} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "8px 10px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    cursor: "pointer",
                    transition: "background 0.14s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
                >
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: dom?.color ?? GOLD, flexShrink: 0 }} />
                  <span style={{ ...BC, fontSize: 12, color: "rgba(255,255,255,0.80)", fontWeight: 700, flex: 1 }}>
                    {sc.name}
                  </span>
                  <ChevronRight size={11} style={{ color: "rgba(255,255,255,0.30)", flexShrink: 0 }} />
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <Link href={primaryHref} style={{ textDecoration: "none" }}>
        <div
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            padding: "9px 0",
            background: "rgba(201,168,76,0.07)",
            border: "1px solid rgba(201,168,76,0.22)",
            cursor: "pointer",
            transition: "all 0.14s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.15)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.07)"; }}
        >
          <span style={{ ...BC, fontSize: 10, fontWeight: 800, color: GOLD, letterSpacing: "0.18em", textTransform: "uppercase" as const }}>
            View {ind.label} Demo →
          </span>
        </div>
      </Link>
    </div>
  );
}

// ─── SECTION DIVIDER ──────────────────────────────────────────────────────────
function DomainGroup({ label, color, scenarios }: { label: string; color: string; scenarios: Scenario[] }) {
  if (scenarios.length === 0) return null;
  return (
    <div style={{ marginBottom: 44 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <div style={{ width: 3, height: 22, background: color, flexShrink: 0 }} />
        <span style={{ ...BC, fontSize: 10, fontWeight: 800, letterSpacing: "0.24em", textTransform: "uppercase" as const, color }}>
          {label} — {scenarios.length} Scenario{scenarios.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
        {scenarios.map(sc => <ScenarioCard key={sc.id} sc={sc} />)}
      </div>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
type Tab = "scenarios" | "industry" | "role";

export default function DemoHub() {
  const [tab, setTab] = useState<Tab>("scenarios");
  const [domainFilter, setDomainFilter] = useState<string>("all");

  const domains = [
    { key: "all",                    label: "All Domains",         color: "rgba(255,255,255,0.55)" },
    { key: "GROWTH & POSITIONING",   label: "Growth & Positioning", color: TEAL     },
    { key: "RISK & RESILIENCE",      label: "Risk & Resilience",   color: "#E74C3C" },
    { key: "TRANSFORMATION",         label: "Transformation",      color: GOLD      },
  ];

  const visible  = domainFilter === "all" ? SCENARIOS : SCENARIOS.filter(s => s.domain === domainFilter);
  const growth   = visible.filter(s => s.domain === "GROWTH & POSITIONING");
  const risk     = visible.filter(s => s.domain === "RISK & RESILIENCE");
  const trans    = visible.filter(s => s.domain === "TRANSFORMATION");

  return (
    <div style={{ background: NAVY, minHeight: "100vh", paddingTop: 70 }}>
      <StandardNav />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section style={{
        borderBottom: `2px solid ${GOLD}`,
        padding: "52px 0 44px",
        background: "linear-gradient(180deg, rgba(201,168,76,0.06) 0%, transparent 100%)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 28, height: 1.5, background: GOLD }} />
            <span style={{ ...BC, fontSize: 9, fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: GOLD }}>
              Demo Center
            </span>
          </div>

          <h1 style={{ ...CG, fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, margin: "0 0 14px" }}>
            Every Demo. One Place.
          </h1>
          <p style={{ ...BC, fontSize: 17, color: "rgba(255,255,255,0.55)", maxWidth: 580, margin: "0 0 32px", lineHeight: 1.6 }}>
            Browse by situation type, your industry, or your C-suite role. Every scenario runs live — no login required.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 14 }}>
            {[
              { value: "12",  label: "Live Scenarios" },
              { value: "14",  label: "Executive Roles" },
              { value: "8",   label: "Industries" },
              { value: "180", label: "Readiness Protocols" },
            ].map(({ value, label }) => (
              <div key={label} style={{
                padding: "10px 20px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.10)",
                display: "flex", alignItems: "baseline", gap: 8,
              }}>
                <span style={{ ...CG, fontSize: 26, fontWeight: 700, color: GOLD, lineHeight: 1 }}>{value}</span>
                <span style={{ ...BC, fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.46)", letterSpacing: "0.14em", textTransform: "uppercase" as const }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED WALKTHROUGHS ─────────────────────────────────────────── */}
      <section style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "40px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ ...BC, fontSize: 9, fontWeight: 800, letterSpacing: "0.28em", color: "rgba(255,255,255,0.38)", textTransform: "uppercase" as const, marginBottom: 16 }}>
            Start Here — Complete Walkthroughs
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            {/* Full Platform Experience */}
            <Link href="/full-experience" style={{ textDecoration: "none" }}>
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(43,138,110,0.14) 0%, rgba(10,15,46,0.50) 100%)",
                  border: "1px solid rgba(43,138,110,0.38)",
                  padding: "26px 26px 22px",
                  cursor: "pointer",
                  transition: "all 0.18s",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column" as const,
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(43,138,110,0.65)";
                  el.style.background  = "linear-gradient(135deg, rgba(43,138,110,0.22) 0%, rgba(10,15,46,0.65) 100%)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(43,138,110,0.38)";
                  el.style.background  = "linear-gradient(135deg, rgba(43,138,110,0.14) 0%, rgba(10,15,46,0.50) 100%)";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 36, height: 36, background: "rgba(43,138,110,0.18)", border: "1px solid rgba(43,138,110,0.38)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Play size={16} style={{ color: TEAL }} />
                  </div>
                  <span style={{ ...BC, fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", color: TEAL, textTransform: "uppercase" as const }}>
                    11 Chapters · No Login
                  </span>
                </div>
                <div style={{ ...CG, fontSize: 21, fontWeight: 700, color: "#fff", marginBottom: 10, lineHeight: 1.25, flex: 1 }}>
                  Full Platform Experience
                </div>
                <p style={{ ...BC, fontSize: 13, color: "rgba(255,255,255,0.56)", lineHeight: 1.55, margin: "0 0 18px" }}>
                  Cold open through signal detection, executive authorization, war room execution, all 14 roles as one organization, and final recap. 30 minutes that show everything.
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ ...BC, fontSize: 11, fontWeight: 800, color: TEAL, letterSpacing: "0.14em", textTransform: "uppercase" as const }}>Begin Walkthrough</span>
                  <ArrowRight size={13} style={{ color: TEAL }} />
                </div>
              </div>
            </Link>

            {/* 12-Minute Test Drive */}
            <Link href="/12-minute-experience" style={{ textDecoration: "none" }}>
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(201,168,76,0.09) 0%, rgba(10,15,46,0.50) 100%)",
                  border: "1px solid rgba(201,168,76,0.32)",
                  padding: "26px 26px 22px",
                  cursor: "pointer",
                  transition: "all 0.18s",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column" as const,
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(201,168,76,0.58)";
                  el.style.background  = "linear-gradient(135deg, rgba(201,168,76,0.17) 0%, rgba(10,15,46,0.65) 100%)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(201,168,76,0.32)";
                  el.style.background  = "linear-gradient(135deg, rgba(201,168,76,0.09) 0%, rgba(10,15,46,0.50) 100%)";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 36, height: 36, background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.32)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Rocket size={16} style={{ color: GOLD }} />
                  </div>
                  <span style={{ ...BC, fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", color: GOLD, textTransform: "uppercase" as const }}>
                    4-Step Simulation · 7 Scenarios
                  </span>
                </div>
                <div style={{ ...CG, fontSize: 21, fontWeight: 700, color: "#fff", marginBottom: 10, lineHeight: 1.25, flex: 1 }}>
                  12-Minute Test Drive
                </div>
                <p style={{ ...BC, fontSize: 13, color: "rgba(255,255,255,0.56)", lineHeight: 1.55, margin: "0 0 18px" }}>
                  A situation fires. Your C-suite mobilizes in 12 minutes — watch every role, every task, live. Includes the compound Activist + Regulatory dual-track scenario.
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ ...BC, fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: "0.14em", textTransform: "uppercase" as const }}>Start Test Drive</span>
                  <ArrowRight size={13} style={{ color: GOLD }} />
                </div>
              </div>
            </Link>

            {/* How It Executes */}
            <Link href="/how-it-executes" style={{ textDecoration: "none" }}>
              <div
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  padding: "26px 26px 22px",
                  cursor: "pointer",
                  transition: "all 0.18s",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column" as const,
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background   = "rgba(255,255,255,0.08)";
                  el.style.borderColor  = "rgba(255,255,255,0.20)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background   = "rgba(255,255,255,0.04)";
                  el.style.borderColor  = "rgba(255,255,255,0.10)";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 36, height: 36, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Zap size={16} style={{ color: "rgba(255,255,255,0.65)" }} />
                  </div>
                  <span style={{ ...BC, fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,255,255,0.48)", textTransform: "uppercase" as const }}>
                    Animated Chain · 5 Scenarios
                  </span>
                </div>
                <div style={{ ...CG, fontSize: 21, fontWeight: 700, color: "#fff", marginBottom: 10, lineHeight: 1.25, flex: 1 }}>
                  How It Executes
                </div>
                <p style={{ ...BC, fontSize: 13, color: "rgba(255,255,255,0.56)", lineHeight: 1.55, margin: "0 0 18px" }}>
                  Animated step-by-step: signal → protocol → tasks staged → stakeholders notified → executive authorizes → 12 minutes. Old Model comparison panel included.
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ ...BC, fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.60)", letterSpacing: "0.14em", textTransform: "uppercase" as const }}>See the Chain</span>
                  <ArrowRight size={13} style={{ color: "rgba(255,255,255,0.60)" }} />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── TABS ──────────────────────────────────────────────────────────── */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px", display: "flex" }}>
          {([
            { id: "scenarios" as Tab, label: "All Scenarios" },
            { id: "industry"  as Tab, label: "By Industry" },
            { id: "role"      as Tab, label: "By Role" },
          ] as { id: Tab; label: string }[]).map(({ id, label }) => (
            <button
              key={id}
              onClick={() => { setTab(id); setDomainFilter("all"); }}
              style={{
                ...BC,
                fontSize: 12, fontWeight: 800, letterSpacing: "0.12em",
                textTransform: "uppercase" as const,
                padding: "16px 26px",
                background: "transparent", border: "none",
                borderBottom: tab === id ? `2px solid ${GOLD}` : "2px solid transparent",
                color: tab === id ? GOLD : "rgba(255,255,255,0.42)",
                cursor: "pointer",
                transition: "all 0.14s",
                marginBottom: -1,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── TAB CONTENT ───────────────────────────────────────────────────── */}
      <section style={{ padding: "44px 0 80px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>

          {/* ALL SCENARIOS */}
          {tab === "scenarios" && (
            <>
              {/* Domain filter pills */}
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8, marginBottom: 36 }}>
                {domains.map(d => {
                  const dom = DOMAIN[d.key];
                  const active = domainFilter === d.key;
                  return (
                    <button
                      key={d.key}
                      onClick={() => setDomainFilter(d.key)}
                      style={{
                        ...BC,
                        fontSize: 9, fontWeight: 800, letterSpacing: "0.2em",
                        textTransform: "uppercase" as const,
                        padding: "5px 14px",
                        background: active ? (dom ? dom.bg : "rgba(255,255,255,0.10)") : "transparent",
                        border: `1px solid ${active ? (dom ? dom.border : "rgba(255,255,255,0.30)") : "rgba(255,255,255,0.14)"}`,
                        color: active ? d.color : "rgba(255,255,255,0.42)",
                        cursor: "pointer",
                        transition: "all 0.13s",
                      }}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>

              <DomainGroup label="Growth & Positioning" color={TEAL}     scenarios={growth} />
              <DomainGroup label="Risk & Resilience"    color="#E74C3C"  scenarios={risk}   />
              <DomainGroup label="Transformation"       color={GOLD}     scenarios={trans}  />
            </>
          )}

          {/* BY INDUSTRY */}
          {tab === "industry" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
              {INDUSTRIES.map(ind => <IndustryCard key={ind.label} ind={ind} />)}
            </div>
          )}

          {/* BY ROLE */}
          {tab === "role" && (
            <>
              <p style={{ ...BC, fontSize: 14, color: "rgba(255,255,255,0.48)", marginBottom: 32, lineHeight: 1.6, maxWidth: 620 }}>
                Pick your seat at the table. Each role enters a live, interactive simulation built specifically for your function — your Readiness Protocol, your stakeholders, your 12-minute outcome.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
                {roleConfigs.map(role => <RoleCard key={role.id} role={role} />)}
              </div>
            </>
          )}

        </div>
      </section>

      {/* ── BOTTOM CTA ────────────────────────────────────────────────────── */}
      <section style={{
        borderTop: "1px solid rgba(201,168,76,0.18)",
        padding: "52px 0 64px",
        background: "rgba(201,168,76,0.03)",
      }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 40px", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: GOLD }} />
            <span style={{ ...BC, fontSize: 9, fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: GOLD }}>
              Founding Partner Program
            </span>
            <div style={{ width: 32, height: 1, background: GOLD }} />
          </div>

          <h2 style={{ ...CG, fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, color: "#fff", margin: "0 0 12px", lineHeight: 1.25 }}>
            Ready to run this in your organization?
          </h2>
          <p style={{ ...BC, fontSize: 15, color: "rgba(255,255,255,0.52)", margin: "0 0 28px", lineHeight: 1.6 }}>
            A 90-day validation partnership. We map your top 15 situations, stage your first 3 Readiness Protocols, and run your first live trigger together.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 12, justifyContent: "center" }}>
            <Link href="/request-access" style={{ textDecoration: "none" }}>
              <div
                style={{
                  ...BC, fontSize: 11, fontWeight: 800, letterSpacing: "0.2em",
                  textTransform: "uppercase" as const,
                  color: NAVY, background: GOLD, border: `1px solid ${GOLD}`,
                  padding: "13px 28px", cursor: "pointer", transition: "opacity 0.14s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.88"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
              >
                Apply for Founding Partner Access
              </div>
            </Link>

            <Link href="/executive-brief" style={{ textDecoration: "none" }}>
              <div
                style={{
                  ...BC, fontSize: 11, fontWeight: 800, letterSpacing: "0.2em",
                  textTransform: "uppercase" as const,
                  color: GOLD, background: "transparent", border: "1px solid rgba(201,168,76,0.40)",
                  padding: "13px 28px", cursor: "pointer", transition: "all 0.14s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.10)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                Download Executive Brief
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
