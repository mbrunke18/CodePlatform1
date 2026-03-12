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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-16">
          <div className="text-center mb-12">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 28, height: 1.5, background: "#C9A84C" }} />
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C9A84C" }}>Industry Demos</span>
              <div style={{ width: 28, height: 1.5, background: "#C9A84C" }} />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#0A0F2E] font-serif">
              Industry <em className="italic text-[#C9A84C]">Scenarios</em>
            </h1>
            <p className="text-lg md:text-xl text-[#6B7280] max-w-3xl mx-auto mt-6 font-light">
              See Execution OS coordinate strategic execution across industries — from market entry opportunities to crisis response.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-[10px] font-bold uppercase tracking-widest text-[#6B7280] mt-8">
              <span className="flex items-center gap-1.5"><Target className="w-4 h-4 text-[#0A0F2E]" /> Offense & Defense</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#2B8A6E]" /> 12-minute coordination</span>
              <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-[#C9A84C]" /> Real enterprise impact</span>
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-[#0A0F2E]" /> Live stakeholder orchestration</span>
            </div>
          </div>

          <div className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-5 h-5 text-[#0A0F2E]" />
              <h2 className="text-xl font-bold text-[#0A0F2E] uppercase tracking-widest">Strategic Opportunities</h2>
              <Badge className="bg-[#2B8A6E]/10 text-[#2B8A6E] border border-[#2B8A6E]/20 text-[10px] font-bold uppercase tracking-widest rounded-none">OFFENSE</Badge>
            </div>
            <p className="text-sm text-[#6B7280] mb-6 max-w-4xl font-light">
              When opportunities emerge — market shifts, competitive windows, strategic launches — 12-minute coordination enables your organization to execute while competitors are still scheduling meetings.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {offensiveDemos.map(renderDemoCard)}
            </div>
          </div>

          <div className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-5 h-5 text-[#0A0F2E]" />
              <h2 className="text-xl font-bold text-[#0A0F2E] uppercase tracking-widest">Crisis Response</h2>
              <Badge className="bg-[#0A0F2E]/10 text-[#C9A84C] border border-[#0A0F2E]/20 text-[10px] font-bold uppercase tracking-widest rounded-none">DEFENSE</Badge>
            </div>
            <p className="text-sm text-[#6B7280] mb-6 max-w-4xl font-light">
              When crises hit — ransomware, recalls, supplier failures — traditional coordination takes days. Execution OS compresses response to minutes, protecting value before the situation escalates.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {defensiveDemos.map(renderDemoCard)}
            </div>
          </div>

          <Card className="bg-[#F8F7F4] border-[#E8E4DC] p-12 rounded-none shadow-sm">
            <div className="text-center max-w-3xl mx-auto">
              <h3 className="text-3xl font-serif text-[#0A0F2E] mb-4">The Detection-Execution Gap</h3>
              <p className="text-lg text-[#6B7280] mb-10 font-light leading-relaxed">
                Every industry has invested billions in AI for detection. But when action is needed, coordination still happens at email speed. Execution OS bridges that gap.
              </p>
              <div className="grid grid-cols-3 gap-8 mb-12">
                <div>
                  <div className="text-3xl font-bold text-[#0A0F2E] mb-2">48-72 hrs</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">Traditional coordination</div>
                </div>
                <div className="flex items-center justify-center">
                  <ArrowRight className="w-8 h-8 text-[#C9A84C]" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#2B8A6E] mb-2">12 min</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">ExOS coordination</div>
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
