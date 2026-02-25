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
    iconColor: "text-purple-400",
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
    iconColor: "text-pink-400",
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
    iconColor: "text-blue-400",
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
    iconColor: "text-blue-400",
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
    iconColor: "text-red-400",
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
    iconColor: "text-orange-400",
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
    iconColor: "text-green-400",
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
    iconColor: "text-yellow-400",
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
  if (cat === 'OFFENSE') return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
  if (cat === 'DEFENSE') return 'bg-red-500/10 text-red-400 border-red-500/20';
  return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
};

export default function IndustryDemosHub() {
  const offensiveDemos = industryDemos.filter(d => d.type === "OFFENSE");
  const defensiveDemos = industryDemos.filter(d => d.type === "DEFENSE");

  const renderDemoCard = (demo: IndustryDemo) => {
    const DemoIcon = demo.icon;
    return (
      <Link key={demo.id} href={`/industry-experience/${demo.id}`}>
        <Card className="bg-white border-gray-200 hover:border-gray-600 transition-all duration-300 cursor-pointer hover:scale-[1.02] h-full group">
          <div className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg bg-gray-50 ${demo.iconColor}`}>
                  <DemoIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">{demo.title}</div>
                  <div className="text-xs text-gray-700">{demo.industry}</div>
                </div>
              </div>
              <BrandStamp variant="dual" size="md" className="mb-8" />
              <Badge className={`text-[10px] border ${categoryBadge(demo.type)}`}>
                {demo.type}
              </Badge>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-gray-800 mb-1">Scenario</div>
                <div className="text-sm font-medium text-gray-900">{demo.scenario}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-gray-800 mb-1">Organization</div>
                <div className="text-sm text-gray-800">{demo.organization}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-3 mb-4">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-gray-800 mb-0.5">Coordination Speed</div>
                <div className="text-sm font-semibold text-gray-900">{demo.timeSaved}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-gray-800 mb-0.5">Value Impact</div>
                <div className="text-sm font-semibold text-emerald-400">{demo.valueSaved}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-gray-800 mb-0.5">Stakeholders</div>
                <div className="text-sm text-gray-900">{demo.stakeholders.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-gray-800 mb-0.5">Impact Scope</div>
                <div className="text-sm text-gray-900">{demo.impact}</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-800">
              <span className="flex items-center gap-1"><Play className="w-3 h-3" />{demo.playbook}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Card>
      </Link>
    );
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-white text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Building2 className="w-8 h-8 text-emerald-400" />
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Industry Scenarios
              </h1>
            </div>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-6">
              See Execution OS coordinate strategic execution across industries — from market entry opportunities to crisis response.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm text-gray-800">
              <span className="flex items-center gap-1.5"><Target className="w-4 h-4 text-blue-400" /> Offense & Defense</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-emerald-400" /> 12-minute coordination</span>
              <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-amber-400" /> Real enterprise impact</span>
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-purple-400" /> Live stakeholder orchestration</span>
            </div>
          </div>

          <div className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-bold">Strategic Opportunities</h2>
              <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs">OFFENSE</Badge>
            </div>
            <p className="text-sm text-gray-700 mb-6 max-w-4xl">
              When opportunities emerge — market shifts, competitive windows, strategic launches — 12-minute coordination enables your organization to execute while competitors are still scheduling meetings.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {offensiveDemos.map(renderDemoCard)}
            </div>
          </div>

          <div className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-5 h-5 text-red-400" />
              <h2 className="text-xl font-bold">Crisis Response</h2>
              <Badge className="bg-red-500/10 text-red-400 border border-red-500/20 text-xs">DEFENSE</Badge>
            </div>
            <p className="text-sm text-gray-700 mb-6 max-w-4xl">
              When crises hit — ransomware, recalls, supplier failures — traditional coordination takes days. Execution OS compresses response to minutes, protecting value before the situation escalates.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {defensiveDemos.map(renderDemoCard)}
            </div>
          </div>

          <Card className="bg-white border-gray-200 p-8">
            <div className="text-center max-w-3xl mx-auto">
              <h3 className="text-xl font-bold mb-3">The Detection-Execution Gap</h3>
              <p className="text-gray-700 mb-6">
                Every industry has invested billions in AI for detection. But when action is needed, coordination still happens at email speed. Execution OS bridges that gap.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div>
                  <div className="text-2xl font-bold text-red-400 mb-1">48-72 hrs</div>
                  <div className="text-xs text-gray-800">Traditional coordination</div>
                </div>
                <div className="flex items-center justify-center">
                  <ArrowRight className="w-6 h-6 text-gray-800" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-400 mb-1">12 min</div>
                  <div className="text-xs text-gray-800">Execution OS coordination</div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/activation">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-gray-900 px-8">
                    <Zap className="w-5 h-5 mr-2" />
                    Try Live Activation
                  </Button>
                </Link>
                <Link href="/playbooks">
                  <Button size="lg" variant="outline" className="border-gray-200 text-gray-800 hover:bg-gray-800 px-8">
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
