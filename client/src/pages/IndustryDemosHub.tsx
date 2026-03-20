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
  Play
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
    timeSaved: "48-72 hours → 12 minutes",
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
    timeSaved: "72 hours → 12 minutes",
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

const categoryBadge = (cat: string) => {
  if (cat === 'OFFENSE') return 'bg-[#2B8A6E]/10 text-[#2B8A6E] border-[#2B8A6E]/20';
  if (cat === 'DEFENSE') return 'bg-[#0A0F2E]/10 text-[#C9A84C] border-[#0A0F2E]/20';
  return 'bg-[#0A0F2E]/10 text-[#0A0F2E] border-[#0A0F2E]/20';
};

export default function IndustryDemosHub() {
  const offensiveDemos = industryDemos.filter(d => d.type === "OFFENSE");
  const defensiveDemos = industryDemos.filter(d => d.type === "DEFENSE");

  const renderDemoCard = (demo: IndustryDemo) => {
    const DemoIcon = demo.icon;
    return (
      <Link key={demo.id} href={`/industry-experience/${demo.id}`}>
        <Card className="bg-white border-[#E8E4DC] hover:border-[#0A0F2E] transition-all duration-300 cursor-pointer rounded-none h-full group shadow-none hover:shadow-2xl">
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-none bg-[#F8F7F4] group-hover:bg-[#0A0F2E] transition-colors ${demo.iconColor} group-hover:text-[#C9A84C]`}>
                  <DemoIcon className="w-6 h-6 transition-colors" />
                </div>
                <div>
                  <div className="font-serif text-lg text-[#0A0F2E]">{demo.title}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">{demo.industry}</div>
                </div>
              </div>
              <Badge className={`text-[9px] font-bold tracking-widest uppercase border rounded-none px-3 py-1 ${categoryBadge(demo.type)}`}>
                {demo.type}
              </Badge>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#C9A84C] mb-1">Scenario</div>
                <div className="text-sm font-medium text-[#0A0F2E] leading-relaxed">{demo.scenario}</div>
              </div>
              <div>
                <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#C9A84C] mb-1">Organization</div>
                <div className="text-sm text-[#6B7280] font-light">{demo.organization}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-[#F8F7F4] pt-4 mb-6">
              <div>
                <div className="text-[9px] font-bold uppercase tracking-widest text-[#6B7280] mb-1">Speed</div>
                <div className="text-xs font-bold text-[#0A0F2E]">{demo.timeSaved}</div>
              </div>
              <div>
                <div className="text-[9px] font-bold uppercase tracking-widest text-[#6B7280] mb-1">Value</div>
                <div className="text-xs font-bold text-[#2B8A6E]">{demo.valueSaved}</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-[#0A0F2E]">
              <span className="flex items-center gap-2"><Play className="w-3 h-3 text-[#C9A84C]" />{demo.playbook}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Card>
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
              Offense & defense. Market entry to crisis response. By the time competitors schedule their first call — Execution OS has already started execution.
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
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#2B8A6E" }}>OFFENSE</span>
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
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#C9A84C" }}>DEFENSE</span>
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
          <div className="mb-14" id="offense">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-5 h-5 text-[#0A0F2E]" />
              <h2 className="text-xl font-bold text-[#0A0F2E] uppercase tracking-widest">Strategic Opportunities</h2>
              <Badge className="bg-[#2B8A6E]/10 text-[#2B8A6E] border border-[#2B8A6E]/20 text-[10px] font-bold uppercase tracking-widest rounded-none">OFFENSE</Badge>
            </div>
            <p className="text-sm text-[#6B7280] mb-6 max-w-4xl font-light">
              When opportunities emerge — market shifts, competitive windows, strategic launches — by the time competitors are scheduling their first planning call, Execution OS has already assigned roles, staged tasks, drafted communications, and put your organization into live execution. In 12 minutes.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {offensiveDemos.map(renderDemoCard)}
            </div>
          </div>

          <div className="mb-14" id="defense">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-5 h-5 text-[#0A0F2E]" />
              <h2 className="text-xl font-bold text-[#0A0F2E] uppercase tracking-widest">Crisis Response</h2>
              <Badge className="bg-[#0A0F2E]/10 text-[#C9A84C] border border-[#0A0F2E]/20 text-[10px] font-bold uppercase tracking-widest rounded-none">DEFENSE</Badge>
            </div>
            <p className="text-sm text-[#6B7280] mb-6 max-w-4xl font-light">
              When crises hit — ransomware, recalls, supplier failures — the traditional enterprise spends weeks just getting the right people in the room, aligned on a plan, and ready to act. Execution OS puts your organization into live execution in 12 minutes: roles assigned, tasks staged, containment already underway.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {defensiveDemos.map(renderDemoCard)}
            </div>
          </div>

          <Card className="bg-[#F8F7F4] border-[#E8E4DC] p-12 rounded-none shadow-sm">
            <div className="text-center max-w-3xl mx-auto">
              <h3 className="text-3xl font-serif text-[#0A0F2E] mb-4">The Detection-Execution Gap</h3>
              <p className="text-lg text-[#6B7280] mb-10 font-light leading-relaxed">
                Every industry has invested billions in AI for detection. But when action is needed, the traditional enterprise spends weeks — sometimes months — just mobilizing before execution can begin. Execution OS bridges that gap — delivering live execution in 12 minutes.
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
                  <Button size="lg" className="bg-[#0A0F2E] hover:bg-[#141B45] text-white px-12 py-8 font-bold uppercase tracking-widest text-xs rounded-none shadow-xl">
                    <Zap className="w-4 h-4 mr-3 text-[#C9A84C]" />
                    Try Live Activation
                  </Button>
                </Link>
                <Link href="/playbook-library">
                  <Button size="lg" variant="outline" className="border-[#0A0F2E] text-[#0A0F2E] hover:bg-[#0A0F2E] hover:text-white px-12 py-8 font-bold uppercase tracking-widest text-xs rounded-none transition-colors">
                    Explore 170 Playbooks
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
