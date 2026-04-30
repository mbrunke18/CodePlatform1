import { useState } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/layout/PageLayout";
import {
  Building2,
  Pill,
  Factory,
  ShoppingCart,
  Zap,
  Clock,
  DollarSign,
  Users,
  ArrowRight,
  Shield,
  Target,
  TrendingUp,
  Crown,
  Rocket,
  Play,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { BrandStamp } from "@/components/BrandStamp";

interface IndustryDemo {
  id: string;
  title: string;
  industry: string;
  industryKey: string;
  icon: any;
  iconColor: string;
  scenario: string;
  organization: string;
  playbook: string;
  playbookKey: string;
  impact: string;
  timeSaved: string;
  valueSaved: string;
  stakeholders: number;
  type: "OFFENSE" | "DEFENSE" | "SPECIAL TEAMS";
}

const industryDemos: IndustryDemo[] = [
  {
    id: "lvmh-market-entry",
    title: "Strategic Market Entry",
    industry: "Luxury Goods",
    industryKey: "luxury",
    icon: Crown,
    iconColor: "text-[#C9A84C]",
    scenario: "China Luxury Renaissance — 10-Brand Simultaneous Launch",
    organization: "LVMH Moët Hennessy Louis Vuitton",
    playbook: "#145 Strategic Market Entry",
    playbookKey: "ma-day1",
    impact: "10 brands, 15 cities, 47 retail locations",
    timeSaved: "6-9 months → 12 minutes",
    valueSaved: "€1.68B value creation",
    stakeholders: 1267,
    type: "OFFENSE"
  },
  {
    id: "shein-trend",
    title: "Viral Trend Capitalization",
    industry: "Fast Fashion",
    industryKey: "fast-fashion",
    icon: TrendingUp,
    iconColor: "text-[#C9A84C]",
    scenario: "TikTok Cottage Core Trend — 200 SKUs in 7 Days",
    organization: "SHEIN (Global Fashion Marketplace)",
    playbook: "#146 Trend Capitalization",
    playbookKey: "ma-day1",
    impact: "47M TikTok views, $180M opportunity",
    timeSaved: "30 days → 12 minutes",
    valueSaved: "$108M additional revenue",
    stakeholders: 5847,
    type: "OFFENSE"
  },
  {
    id: "spacex-launch",
    title: "Launch Schedule Acceleration",
    industry: "Aerospace",
    industryKey: "aerospace",
    icon: Rocket,
    iconColor: "text-[#C9A84C]",
    scenario: "Orbital Window — 3-Day Launch Advancement",
    organization: "SpaceX (Space Transportation)",
    playbook: "#155 Launch Acceleration",
    playbookKey: "ma-day1",
    impact: "23 satellites, optimal orbital geometry",
    timeSaved: "5-7 days → 12 minutes",
    valueSaved: "$47M revenue + strategic position",
    stakeholders: 1847,
    type: "OFFENSE"
  },
  {
    id: "financial-ransomware",
    title: "Ransomware Attack Response",
    industry: "Financial Services",
    industryKey: "financial",
    icon: Shield,
    iconColor: "text-[#C9A84C]",
    scenario: "Banking Infrastructure Breach",
    organization: "LoanDepot (Major Mortgage Lender)",
    playbook: "#065 Ransomware Attack Response",
    playbookKey: "ransomware",
    impact: "$2.3B market cap, 2M active borrowers",
    timeSaved: "30 days → 12 minutes",
    valueSaved: "$22M cost avoided",
    stakeholders: 150,
    type: "DEFENSE"
  },
  {
    id: "pharma-recall",
    title: "Product Recall",
    industry: "Pharmaceutical",
    industryKey: "pharma",
    icon: Pill,
    iconColor: "text-[#C9A84C]",
    scenario: "Class I Recall — Life-Threatening Defect",
    organization: "Glenmark Pharmaceuticals",
    playbook: "#095 Product Recall (Class I)",
    playbookKey: "ransomware",
    impact: "47M units affected, 50M+ patients",
    timeSaved: "6 weeks → 12 minutes",
    valueSaved: "Lives saved + $50M liability avoided",
    stakeholders: 2052,
    type: "DEFENSE"
  },
  {
    id: "manufacturing-supplier",
    title: "Supplier Crisis",
    industry: "Manufacturing",
    industryKey: "manufacturing",
    icon: Factory,
    iconColor: "text-[#C9A84C]",
    scenario: "Critical Semiconductor Shortage",
    organization: "Toyota Motor Corporation",
    playbook: "#019 Supplier Failure Response",
    playbookKey: "ransomware",
    impact: "$250B market cap, 10M vehicles/year",
    timeSaved: "30 days → 4 hours",
    valueSaved: "$450M production saved",
    stakeholders: 158,
    type: "DEFENSE"
  },
  {
    id: "retail-contamination",
    title: "Food Contamination Response",
    industry: "Retail",
    industryKey: "retail",
    icon: ShoppingCart,
    iconColor: "text-[#C9A84C]",
    scenario: "Salmonella Contamination Crisis",
    organization: "Walmart Inc.",
    playbook: "#095 Food Product Recall",
    playbookKey: "ransomware",
    impact: "847 stores, 23 states, 12,847 customers",
    timeSaved: "7 days → 1 hour",
    valueSaved: "$245M + lives saved",
    stakeholders: 5000,
    type: "DEFENSE"
  },
  {
    id: "energy-grid",
    title: "Grid Infrastructure Emergency",
    industry: "Energy & Utilities",
    industryKey: "energy",
    icon: Zap,
    iconColor: "text-[#C9A84C]",
    scenario: "Cascading Grid Failure Crisis",
    organization: "Pacific Grid & Power",
    playbook: "#082 Grid Emergency Response",
    playbookKey: "ransomware",
    impact: "8.2M customers, 247 substations, 3 states",
    timeSaved: "3-5 days → 3 hours",
    valueSaved: "$2.5B + lives saved",
    stakeholders: 2500,
    type: "DEFENSE"
  }
];

// Maps each demo ID directly to its rich 4-step war room experience
const DEMO_ROUTE: Record<string, string> = {
  'lvmh-market-entry':      '/lvmh-demo',
  'shein-trend':            '/shein-demo',
  'spacex-launch':          '/spacex-demo',
  'financial-ransomware':   '/financial-ransomware-demo',
  'pharma-recall':          '/pharmaceutical-recall-demo',
  'manufacturing-supplier': '/manufacturing-supplier-demo',
  'retail-contamination':   '/retail-food-safety-demo',
  'energy-grid':            '/energy-grid-failure-demo',
};

const categoryBadge = (cat: string) => {
  if (cat === 'OFFENSE') return 'bg-[#2B8A6E]/10 text-[#2B8A6E] border-[#2B8A6E]/20';
  if (cat === 'DEFENSE') return 'bg-[#0A0F2E]/10 text-[#C9A84C] border-[#0A0F2E]/20';
  return 'bg-[#0A0F2E]/10 text-[#0A0F2E] border-[#0A0F2E]/20';
};

// ─── Demo recommendation engine ──────────────────────────────────────────────

type ConcernType = "offense" | "defense" | null;
type RoleType = "ceo" | "cfo" | "cto" | "coo" | "gc" | null;
type IndustryType = "luxury" | "fast-fashion" | "aerospace" | "financial" | "pharma" | "manufacturing" | "retail" | "energy" | "other" | null;

const CONCERN_TO_DEMOS: Record<string, string[]> = {
  offense: ["lvmh-market-entry", "shein-trend", "spacex-launch"],
  defense: ["financial-ransomware", "pharma-recall", "manufacturing-supplier", "retail-contamination", "energy-grid"],
};

const INDUSTRY_PRIMARY: Record<string, string> = {
  "luxury":        "lvmh-market-entry",
  "fast-fashion":  "shein-trend",
  "aerospace":     "spacex-launch",
  "financial":     "financial-ransomware",
  "pharma":        "pharma-recall",
  "manufacturing": "manufacturing-supplier",
  "retail":        "retail-contamination",
  "energy":        "energy-grid",
  "other":         "lvmh-market-entry",
};

const ROLE_FRAMING: Record<string, string> = {
  ceo:  "Showing this through the lens of executive decision authority and response time.",
  cfo:  "Showing this through the lens of financial exposure and value protection.",
  cto:  "Showing this through the lens of technology response and system resilience.",
  coo:  "Showing this through the lens of operational continuity and execution speed.",
  gc:   "Showing this through the lens of regulatory exposure and legal risk management.",
};

function getRecommendedDemo(concern: ConcernType, industry: IndustryType): IndustryDemo | null {
  if (!concern || !industry) return null;
  const id = INDUSTRY_PRIMARY[industry] ?? (concern === "offense" ? "lvmh-market-entry" : "financial-ransomware");
  const pool = CONCERN_TO_DEMOS[concern] ?? [];
  const bestId = pool.includes(id) ? id : pool[0];
  return industryDemos.find(d => d.id === bestId) ?? null;
}

export default function IndustryDemosHub() {
  const [concern, setConcern] = useState<ConcernType>(null);
  const [industry, setIndustry] = useState<IndustryType>(null);
  const [role, setRole] = useState<RoleType>(null);
  const [selectorCollapsed, setSelectorCollapsed] = useState(false);

  const recommended = getRecommendedDemo(concern, industry);
  const roleFraming = role ? ROLE_FRAMING[role] : null;

  const offensiveDemos = industryDemos.filter(d => d.type === "OFFENSE");
  const defensiveDemos = industryDemos.filter(d => d.type === "DEFENSE");

  const renderDemoCard = (demo: IndustryDemo) => {
    const DemoIcon = demo.icon;
    const isOffense = demo.type === "OFFENSE";
    const accent = isOffense ? "#2B8A6E" : "#C9A84C";
    const accentBg = isOffense ? "rgba(43,138,110,0.07)" : "rgba(201,168,76,0.05)";
    const accentBorder = isOffense ? "rgba(43,138,110,0.22)" : "rgba(201,168,76,0.18)";
    return (
      <Link key={demo.id} href={DEMO_ROUTE[demo.id] || `/industry-experience/${demo.id}`}>
        <div
          style={{
            background: "#0A0F2E",
            border: `1px solid rgba(255,255,255,0.08)`,
            borderBottom: `3px solid ${accent}`,
            padding: "22px 22px 18px",
            cursor: "pointer",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            transition: "all 0.2s ease",
            position: "relative",
            overflow: "hidden",
          }}
          className="group hover:border-opacity-50"
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(10,15,46,0.92)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#0A0F2E"; }}
        >
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.03) 1px,transparent 1px)", backgroundSize: "44px 44px", pointerEvents: "none" }} />
          <div className="relative z-10 flex flex-col h-full">
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, background: accentBg, border: `1px solid ${accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <DemoIcon style={{ width: 17, height: 17, color: accent }} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 600, color: "#F0EDE4", lineHeight: 1.1 }}>{demo.title}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(240,237,228,0.4)", marginTop: 2 }}>{demo.industry}</div>
                </div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: accent, border: `1px solid ${accentBorder}`, padding: "2px 7px", flexShrink: 0 }}>{demo.type === 'OFFENSE' ? 'GROWTH & POSITIONING' : demo.type === 'DEFENSE' ? 'RISK & RESILIENCE' : 'TRANSFORMATION'}</span>
            </div>

            <div style={{ marginBottom: 14, flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: accent, marginBottom: 4 }}>Scenario</div>
              <div style={{ fontSize: 12, color: "rgba(240,237,228,0.75)", lineHeight: 1.5, marginBottom: 10 }}>{demo.scenario}</div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(240,237,228,0.35)", marginBottom: 3 }}>Organization</div>
              <div style={{ fontSize: 11, color: "rgba(240,237,228,0.45)" }}>{demo.organization}</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 12, marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(240,237,228,0.35)", marginBottom: 3 }}>Speed</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: accent }}>{demo.timeSaved}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(240,237,228,0.35)", marginBottom: 3 }}>Value Preserved</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#F0EDE4" }}>{demo.valueSaved}</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Play style={{ width: 11, height: 11, color: accent }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(240,237,228,0.4)", letterSpacing: "0.1em" }}>{demo.playbook}</span>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: accent, letterSpacing: "0.1em" }}>ENTER →</span>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-white text-[#0A0F2E]">

        {/* ─── Dark Category Tile Header ─────────────────────────────────── */}
        <div style={{ background: "#0A0F2E", padding: "36px 0 0" }}>
          <style>{`
            @keyframes idh-fadeup { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
            .idh-tile-1{animation:idh-fadeup 0.45s ease 0.05s both}
            .idh-tile-2{animation:idh-fadeup 0.45s ease 0.14s both}
            .idh-stat-1{animation:idh-fadeup 0.45s ease 0.22s both}
            .idh-stat-2{animation:idh-fadeup 0.45s ease 0.28s both}
            .idh-stat-3{animation:idh-fadeup 0.45s ease 0.34s both}
            .idh-stat-4{animation:idh-fadeup 0.45s ease 0.4s both}
          `}</style>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div style={{ width: 28, height: 1.5, background: "#C9A84C" }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#C9A84C" }}>Industry Scenarios</span>
              <div style={{ width: 28, height: 1.5, background: "#C9A84C" }} />
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 700, color: "#F0EDE4", marginBottom: 8 }}>
              Industry <em style={{ color: "#C9A84C" }}>Scenarios</em>
            </div>
            <div style={{ fontSize: 13, color: "rgba(240,237,228,0.5)", maxWidth: 540, marginBottom: 28, lineHeight: 1.5 }}>
              Growth scenarios. Resilience scenarios. Market entry to crisis response. By the time competitors schedule their first call — Readiness OS has already started execution.
            </div>

            {/* Two Category Tiles */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 0 }}>
              <a href="#offense">
                <div
                  className="idh-tile-1"
                  style={{ background: "rgba(43,138,110,0.08)", border: "1px solid rgba(43,138,110,0.25)", borderBottom: "3px solid #2B8A6E", padding: "20px 24px", cursor: "pointer", transition: "all 0.2s" }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Target style={{ width: 18, height: 18, color: "#2B8A6E" }} />
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#2B8A6E" }}>GROWTH & POSITIONING</span>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "#2B8A6E", border: "1px solid rgba(43,138,110,0.35)", padding: "2px 8px" }}>3 SCENARIOS</span>
                  </div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: "#F0EDE4", marginBottom: 6 }}>Strategic Opportunities</div>
                  <div style={{ fontSize: 11, color: "rgba(240,237,228,0.45)", marginBottom: 14, lineHeight: 1.5 }}>Market entry, trend capitalization, launch acceleration. When the window opens — you're already executing.</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 700, color: "#2B8A6E" }}>€1.68B+</div>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(240,237,228,0.4)" }}>VIEW SCENARIOS →</span>
                  </div>
                </div>
              </a>
              <a href="#defense">
                <div
                  className="idh-tile-2"
                  style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderBottom: "3px solid #C9A84C", padding: "20px 24px", cursor: "pointer", transition: "all 0.2s" }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Shield style={{ width: 18, height: 18, color: "#C9A84C" }} />
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#C9A84C" }}>RISK & RESILIENCE</span>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.35)", padding: "2px 8px" }}>5 SCENARIOS</span>
                  </div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: "#F0EDE4", marginBottom: 6 }}>Crisis Response</div>
                  <div style={{ fontSize: 11, color: "rgba(240,237,228,0.45)", marginBottom: 14, lineHeight: 1.5 }}>Ransomware, recalls, supplier failures, grid failures. While competitors are still assembling — containment is already underway.</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 700, color: "#C9A84C" }}>$3.2B+</div>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(240,237,228,0.4)" }}>VIEW SCENARIOS →</span>
                  </div>
                </div>
              </a>
            </div>

            {/* Stats Strip */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 1, background: "rgba(255,255,255,0.03)" }}>
              {[
                { label: "Industries Covered", value: "7", sub: "and growing", anim: "idh-stat-1" },
                { label: "Response Time", value: "12 min", sub: "to live execution", anim: "idh-stat-2" },
                { label: "Scenarios Available", value: "8", sub: "offense & defense", anim: "idh-stat-3" },
                { label: "Execution Head Start", value: "3,600×", sub: "30 days → 12 minutes", anim: "idh-stat-4" },
              ].map(s => (
                <div key={s.label} className={s.anim} style={{ padding: "14px 18px" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: "#C9A84C", lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: "rgba(240,237,228,0.45)", marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Guided Demo Selector ──────────────────────────────────────── */}
        <div style={{ background: "#F8F7F4", borderBottom: "1px solid #E8E4DC" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 24px" }}>

            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: selectorCollapsed ? 0 : 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Sparkles style={{ width: 15, height: 15, color: "#C9A84C" }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#0A0F2E", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>
                  Find Your Scenario
                </span>
                {recommended && (
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#2B8A6E", background: "rgba(43,138,110,0.1)", padding: "2px 8px", borderRadius: 0 }}>
                    Recommendation ready
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectorCollapsed(v => !v)}
                style={{ fontSize: 11, color: "#9CA3AF", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}
              >
                {selectorCollapsed ? "Show selector ↓" : "Hide ↑"}
              </button>
            </div>

            {!selectorCollapsed && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: recommended ? 20 : 0 }}>

                  {/* Q1 — What's your priority? */}
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 10 }}>
                      1 — Your immediate priority
                    </p>
                    <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
                      {[
                        { key: "offense", label: "Capture a strategic opportunity", sub: "Market entry, trends, launches", marker: "→" },
                        { key: "defense", label: "Contain or prevent a crisis",     sub: "Ransomware, recalls, failures", marker: "→" },
                      ].map(opt => (
                        <button
                          key={opt.key}
                          onClick={() => { setConcern(opt.key as ConcernType); setIndustry(null); }}
                          style={{
                            display: "flex", alignItems: "flex-start", gap: 10, textAlign: "left" as const,
                            padding: "12px 14px", borderRadius: 0, cursor: "pointer",
                            border: concern === opt.key ? "2px solid #0A0F2E" : "2px solid #E5E7EB",
                            background: concern === opt.key ? "#0A0F2E" : "white",
                            transition: "all 0.15s",
                          }}
                        >
                          <span style={{ fontSize: 12, fontWeight: 700, flexShrink: 0, color: concern === opt.key ? "#C9A84C" : "#C9A84C", marginTop: 1 }}>{opt.marker}</span>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: concern === opt.key ? "#F0EDE4" : "#0A0F2E", marginBottom: 2 }}>{opt.label}</div>
                            <div style={{ fontSize: 10, color: concern === opt.key ? "rgba(240,237,228,0.5)" : "#9CA3AF" }}>{opt.sub}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Q2 — Your industry */}
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 10 }}>
                      2 — Closest to your industry
                    </p>
                    <div style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
                      {(concern === "offense"
                        ? [
                            { key: "luxury",       label: "Luxury & Retail" },
                            { key: "fast-fashion", label: "Fast Fashion / Consumer" },
                            { key: "aerospace",    label: "Aerospace & Tech" },
                            { key: "other",        label: "Other industry" },
                          ]
                        : [
                            { key: "financial",    label: "Financial Services" },
                            { key: "pharma",       label: "Pharma & Healthcare" },
                            { key: "manufacturing",label: "Manufacturing" },
                            { key: "retail",       label: "Retail & Consumer" },
                            { key: "energy",       label: "Energy & Utilities" },
                            { key: "other",        label: "Other industry" },
                          ]
                      ).map(opt => (
                        <button
                          key={opt.key}
                          onClick={() => setIndustry(opt.key as IndustryType)}
                          disabled={!concern}
                          style={{
                            padding: "8px 12px", borderRadius: 0, cursor: concern ? "pointer" : "not-allowed",
                            border: industry === opt.key ? "2px solid #C9A84C" : "2px solid #E5E7EB",
                            background: industry === opt.key ? "rgba(201,168,76,0.08)" : concern ? "white" : "#F9F8F5",
                            fontSize: 12, fontWeight: industry === opt.key ? 700 : 500,
                            color: industry === opt.key ? "#0A0F2E" : concern ? "#374151" : "#9CA3AF",
                            textAlign: "left" as const, transition: "all 0.15s",
                          }}
                        >
                          {industry === opt.key && <span style={{ marginRight: 6 }}>✓</span>}
                          {opt.label}
                        </button>
                      ))}
                      {!concern && (
                        <p style={{ fontSize: 10, color: "#9CA3AF", fontStyle: "italic", marginTop: 2 }}>Answer question 1 first</p>
                      )}
                    </div>
                  </div>

                  {/* Q3 — Your role */}
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 10 }}>
                      3 — Your role
                    </p>
                    <div style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
                      {[
                        { key: "ceo", label: "CEO / Board Chair" },
                        { key: "cfo", label: "CFO / Finance Leader" },
                        { key: "cto", label: "CTO / CISO" },
                        { key: "coo", label: "COO / Operations" },
                        { key: "gc",  label: "General Counsel" },
                      ].map(opt => (
                        <button
                          key={opt.key}
                          onClick={() => setRole(opt.key as RoleType)}
                          style={{
                            padding: "8px 12px", borderRadius: 0, cursor: "pointer",
                            border: role === opt.key ? "2px solid #2B8A6E" : "2px solid #E5E7EB",
                            background: role === opt.key ? "rgba(43,138,110,0.07)" : "white",
                            fontSize: 12, fontWeight: role === opt.key ? 700 : 500,
                            color: role === opt.key ? "#0A0F2E" : "#374151",
                            textAlign: "left" as const, transition: "all 0.15s",
                          }}
                        >
                          {role === opt.key && <span style={{ marginRight: 6 }}>✓</span>}
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recommendation card */}
                {recommended && (
                  <div style={{
                    background: "#0A0F2E", borderRadius: 0, padding: "20px 24px",
                    border: "1px solid rgba(201,168,76,0.3)", borderLeft: "4px solid #C9A84C",
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" as const,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)", padding: "10px 14px", borderRadius: 0, flexShrink: 0 }}>
                        <Sparkles style={{ width: 18, height: 18, color: "#C9A84C" }} />
                      </div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#C9A84C", letterSpacing: "0.16em", textTransform: "uppercase" as const, marginBottom: 4 }}>
                          Your Recommended Scenario
                        </div>
                        <div style={{ fontSize: 17, fontWeight: 700, color: "#F0EDE4", marginBottom: 4, fontFamily: "'Cormorant Garamond', serif" }}>
                          {recommended.title} — {recommended.industry}
                        </div>
                        <div style={{ fontSize: 12, color: "rgba(240,237,228,0.5)", marginBottom: roleFraming ? 6 : 0 }}>
                          {recommended.scenario} · {recommended.timeSaved}
                        </div>
                        {roleFraming && (
                          <div style={{ fontSize: 11, color: "rgba(201,168,76,0.7)", fontStyle: "italic" }}>{roleFraming}</div>
                        )}
                      </div>
                    </div>
                    <Link href={DEMO_ROUTE[recommended.id] || `/industry-experience/${recommended.id}`}>
                      <button style={{
                        display: "flex", alignItems: "center", gap: 8,
                        background: "#C9A84C", color: "#0A0F2E",
                        border: "none", borderRadius: 0, padding: "12px 22px",
                        fontWeight: 800, fontSize: 12, cursor: "pointer",
                        letterSpacing: "0.08em", textTransform: "uppercase" as const,
                        whiteSpace: "nowrap" as const,
                      }}>
                        Enter This Scenario <ChevronRight style={{ width: 14, height: 14 }} />
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
          <div className="mb-14" id="offense">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-5 h-5 text-[#0A0F2E]" />
              <h2 className="text-xl font-bold text-[#0A0F2E] uppercase tracking-widest">Strategic Opportunities</h2>
              <Badge className="bg-[#2B8A6E]/10 text-[#2B8A6E] border border-[#2B8A6E]/20 text-[10px] font-bold uppercase tracking-widest rounded-none">GROWTH & POSITIONING</Badge>
            </div>
            <p className="text-sm text-[#6B7280] mb-6 max-w-4xl font-light">
              When opportunities emerge — market shifts, competitive windows, strategic launches — by the time competitors are scheduling their first planning call, Readiness OS has already assigned roles, staged tasks, drafted communications, and put your organization into live execution. In 12 minutes.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {offensiveDemos.map(renderDemoCard)}
            </div>
          </div>

          <div className="mb-14" id="defense">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-5 h-5 text-[#0A0F2E]" />
              <h2 className="text-xl font-bold text-[#0A0F2E] uppercase tracking-widest">Crisis Response</h2>
              <Badge className="bg-[#0A0F2E]/10 text-[#C9A84C] border border-[#0A0F2E]/20 text-[10px] font-bold uppercase tracking-widest rounded-none">RISK & RESILIENCE</Badge>
            </div>
            <p className="text-sm text-[#6B7280] mb-6 max-w-4xl font-light">
              When crises hit — ransomware, recalls, supplier failures — the traditional enterprise spends weeks just getting the right people in the room, aligned on a plan, and ready to act. Readiness OS puts your organization into live execution in 12 minutes: roles assigned, tasks staged, containment already underway.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {defensiveDemos.map(renderDemoCard)}
            </div>
          </div>

          <Card className="bg-[#F8F7F4] border-[#E8E4DC] p-12 rounded-none">
            <div className="text-center max-w-3xl mx-auto">
              <h3 className="text-3xl font-serif text-[#0A0F2E] mb-4">The Detection-Execution Gap</h3>
              <p className="text-lg text-[#6B7280] mb-10 font-light leading-relaxed">
                Every industry has invested billions in AI for detection. But when action is needed, the traditional enterprise spends weeks — sometimes months — just mobilizing before execution can begin. Readiness OS bridges that gap — delivering live execution in 12 minutes.
              </p>
              <div className="grid grid-cols-3 gap-8 mb-12">
                <div>
                  <div className="text-3xl font-bold text-[#0A0F2E] mb-2">Weeks–Months</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">Still mobilizing</div>
                </div>
                <div className="flex items-center justify-center">
                  <ArrowRight className="w-8 h-8 text-[#C9A84C]" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#2B8A6E] mb-2">12 min</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">Execution live</div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/onboarding">
                  <Button size="lg" className="bg-[#0A0F2E] hover:bg-[#141B45] text-white px-12 py-8 font-bold uppercase tracking-widest text-xs rounded-none">
                    <Zap className="w-4 h-4 mr-3 text-[#C9A84C]" />
                    Try Live Activation
                  </Button>
                </Link>
                <Link href="/playbook-library">
                  <Button size="lg" variant="outline" className="border-[#0A0F2E] text-[#0A0F2E] hover:bg-[#0A0F2E] hover:text-white px-12 py-8 font-bold uppercase tracking-widest text-xs rounded-none transition-colors">
                    Explore 170 Readiness Protocols
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
