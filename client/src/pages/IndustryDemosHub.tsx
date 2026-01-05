import StandardNav from '@/components/layout/StandardNav';
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DemoNavHeader from "@/components/demo/DemoNavHeader";
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
  AlertTriangle,
  TrendingUp,
  Crown,
  Rocket,
  Target,
  ShoppingBag
} from "lucide-react";

interface IndustryDemo {
  id: string;
  title: string;
  industry: string;
  icon: any;
  iconColor: string;
  bgGradient: string;
  borderColor: string;
  crisis: string;
  organization: string;
  playbook: string;
  impact: string;
  timeSaved: string;
  valueSaved: string;
  stakeholders: number;
  route: string;
  status: "live" | "coming-soon";
  type: "offensive" | "defensive"; // Strategic opportunity vs crisis response
}

const industryDemos: IndustryDemo[] = [
  // OFFENSIVE DEMOS (Strategic Opportunities)
  {
    id: "lvmh-market-entry",
    title: "Strategic Market Entry",
    industry: "Luxury Goods",
    icon: Crown,
    iconColor: "text-purple-400",
    bgGradient: "from-purple-950 to-indigo-950",
    borderColor: "border-purple-500",
    crisis: "China Luxury Renaissance - 10-Brand Simultaneous Launch",
    organization: "LVMH Moët Hennessy Louis Vuitton",
    playbook: "#145 Strategic Market Entry (Offensive)",
    impact: "10 brands, 15 cities, 47 retail locations, €580M capex",
    timeSaved: "6-9 months → 12 minutes",
    valueSaved: "€1.68B value creation",
    stakeholders: 1267,
    route: "/lvmh-demo",
    status: "live",
    type: "offensive"
  },
  {
    id: "shein-trend",
    title: "Viral Trend Capitalization",
    industry: "Fast Fashion",
    icon: TrendingUp,
    iconColor: "text-pink-400",
    bgGradient: "from-pink-950 to-rose-950",
    borderColor: "border-pink-500",
    crisis: "TikTok Cottage Core Trend - 200 SKUs in 7 Days",
    organization: "SHEIN (Global Fashion Marketplace)",
    playbook: "#146 Trend Capitalization (Offensive)",
    impact: "47M TikTok views, $180M opportunity, 21-day lifecycle",
    timeSaved: "48-72 hours → 12 minutes",
    valueSaved: "$108M additional revenue",
    stakeholders: 5847,
    route: "/shein-demo",
    status: "live",
    type: "offensive"
  },
  {
    id: "spacex-launch",
    title: "Launch Schedule Acceleration",
    industry: "Aerospace",
    icon: Rocket,
    iconColor: "text-blue-400",
    bgGradient: "from-blue-950 to-cyan-950",
    borderColor: "border-blue-500",
    crisis: "Orbital Window Opportunity - 3-Day Launch Advancement",
    organization: "SpaceX (Space Transportation)",
    playbook: "#155 Launch Acceleration (Offensive)",
    impact: "Starlink Group 7-8, 23 satellites, optimal orbital geometry",
    timeSaved: "5-7 days → 12 minutes",
    valueSaved: "$47M revenue + strategic position",
    stakeholders: 1847,
    route: "/spacex-demo",
    status: "live",
    type: "offensive"
  },
  
  // DEFENSIVE DEMOS (Crisis Response)
  {
    id: "luxury-crisis",
    title: "Luxury Brand Crisis",
    industry: "Luxury Goods",
    icon: Building2,
    iconColor: "text-purple-400",
    bgGradient: "from-purple-950 to-pink-950",
    borderColor: "border-purple-500",
    crisis: "China Luxury Spending Collapse",
    organization: "LVMH Maisons Group",
    playbook: "#044 Revenue Shortfall - Asia Pacific",
    impact: "€400B market cap, 75 brands, 12 regions",
    timeSaved: "72 hours → 12 minutes",
    valueSaved: "€280M preserved",
    stakeholders: 193,
    route: "/luxury-demo",
    status: "live",
    type: "defensive"
  },
  {
    id: "financial",
    title: "Ransomware Attack",
    industry: "Financial Services",
    icon: Shield,
    iconColor: "text-blue-400",
    bgGradient: "from-blue-950 to-slate-950",
    borderColor: "border-blue-500",
    crisis: "Banking Infrastructure Breach",
    organization: "LoanDepot (Major Mortgage Lender)",
    playbook: "#065 Ransomware Attack Response",
    impact: "$2.3B market cap, 2M active borrowers",
    timeSaved: "72 hours → 12 minutes",
    valueSaved: "$22M cost avoided",
    stakeholders: 150,
    route: "/financial-demo",
    status: "live",
    type: "defensive"
  },
  {
    id: "pharma",
    title: "Product Recall",
    industry: "Pharmaceutical",
    icon: Pill,
    iconColor: "text-red-400",
    bgGradient: "from-red-950 to-rose-950",
    borderColor: "border-red-500",
    crisis: "Class I Recall - Life-Threatening Defect",
    organization: "Glenmark Pharmaceuticals",
    playbook: "#095 Product Recall (Class I)",
    impact: "47M units affected, 50M+ patients worldwide",
    timeSaved: "6 weeks → 12 minutes",
    valueSaved: "A life saved + $50M liability avoided",
    stakeholders: 2052,
    route: "/pharma-demo",
    status: "live",
    type: "defensive"
  },
  {
    id: "manufacturing",
    title: "Supplier Crisis",
    industry: "Manufacturing",
    icon: Factory,
    iconColor: "text-orange-400",
    bgGradient: "from-orange-950 to-amber-950",
    borderColor: "border-orange-500",
    crisis: "Critical Semiconductor Shortage",
    organization: "Toyota Motor Corporation",
    playbook: "#019 Supplier Failure Response",
    impact: "$250B market cap, 10M vehicles/year",
    timeSaved: "30 days → 4 hours",
    valueSaved: "$450M production saved",
    stakeholders: 158,
    route: "/manufacturing-demo",
    status: "live",
    type: "defensive"
  },
  {
    id: "retail",
    title: "Food Contamination",
    industry: "Retail",
    icon: ShoppingCart,
    iconColor: "text-green-400",
    bgGradient: "from-green-950 to-emerald-950",
    borderColor: "border-green-500",
    crisis: "Salmonella Contamination Crisis",
    organization: "Walmart Inc. (Global Retailer)",
    playbook: "#095 Food Product Recall (Class I)",
    impact: "847 stores, 23 states, 12,847 customers affected",
    timeSaved: "7 days → 1 hour",
    valueSaved: "$245M + lives saved",
    stakeholders: 5000,
    route: "/retail-demo",
    status: "live",
    type: "defensive"
  },
  {
    id: "energy",
    title: "Grid Infrastructure",
    industry: "Energy & Utilities",
    icon: Zap,
    iconColor: "text-yellow-400",
    bgGradient: "from-yellow-950 to-orange-950",
    borderColor: "border-yellow-500",
    crisis: "Cascading Grid Failure Crisis",
    organization: "Pacific Grid & Power",
    playbook: "#082 Grid Emergency Response (NERC Category 3)",
    impact: "8.2M customers, 247 substations, 3 states",
    timeSaved: "3-5 days → 3 hours",
    valueSaved: "$2.5B + lives saved",
    stakeholders: 2500,
    route: "/energy-demo",
    status: "live",
    type: "defensive"
  }
];

export default function IndustryDemosHub() {
  const offensiveDemos = industryDemos.filter(d => d.type === "offensive" && d.status === "live");
  const defensiveDemos = industryDemos.filter(d => d.type === "defensive" && d.status === "live");
  const comingSoonDemos = industryDemos.filter(d => d.status === "coming-soon");

  return (
    <div className="page-background min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <DemoNavHeader title="Industry Demos Hub" showBackButton={true} />
      
      {/* Header */}
      <div className="border-b border-blue-800/30 bg-slate-950/50 backdrop-blur-sm pt-20">
        <div className="container mx-auto px-6 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Strategic Execution Operating System</h1>
            <p className="text-xl text-blue-200 mb-4">
              Execute any strategic decision in 12 minutes—opportunities and threats
            </p>
            <div className="flex justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-green-300">
                <Target className="w-4 h-4" />
                <span>Strategic Opportunities</span>
              </div>
              <div className="flex items-center gap-2 text-amber-300">
                <AlertTriangle className="w-4 h-4" />
                <span>Crisis Response</span>
              </div>
              <div className="flex items-center gap-2 text-blue-300">
                <Clock className="w-4 h-4" />
                <span>12-Minute Coordination</span>
              </div>
              <div className="flex items-center gap-2 text-purple-300">
                <Users className="w-4 h-4" />
                <span>Live Orchestration</span>
              </div>
            </div>
            <div className="mt-4 max-w-3xl mx-auto">
              <p className="text-sm text-blue-300">
                M isn't just crisis insurance—it's the execution layer for strategic velocity. When you detect an opportunity or threat, 
                coordinate your entire organization in minutes, not days.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Strategic Opportunities (Offensive) */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-green-400" />
            <h2 className="text-2xl font-bold text-white">Strategic Opportunities (Offensive Coordination)</h2>
            <Badge className="bg-green-600">3 Live Demos</Badge>
          </div>
          <p className="text-blue-200 mb-6 max-w-4xl">
            When opportunities emerge—market shifts, competitive windows, strategic launches—12-minute coordination enables your organization 
            to execute while competitors are still scheduling the kickoff meeting.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offensiveDemos.map((demo) => (
              <Card
                key={demo.id}
                className={`p-6 bg-gradient-to-br ${demo.bgGradient} border-2 ${demo.borderColor} hover:scale-[1.02] transition-transform cursor-pointer group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg bg-slate-950/50 ${demo.iconColor}`}>
                      <demo.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{demo.title}</h3>
                      <p className="text-sm text-blue-200">{demo.industry}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-white/30 text-white">
                    {demo.playbook.split(' ')[0]}
                  </Badge>
                </div>

                <div className="space-y-3 mb-6">
                  <div>
                    <div className="text-sm text-blue-300 mb-1">Strategic Move</div>
                    <div className="font-semibold text-white">{demo.crisis}</div>
                  </div>

                  <div>
                    <div className="text-sm text-blue-300 mb-1">Organization</div>
                    <div className="text-white">{demo.organization}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/10">
                    <div>
                      <div className="text-xs text-blue-300 mb-1">Coordination Speed</div>
                      <div className="text-sm font-bold text-white">{demo.timeSaved}</div>
                    </div>
                    <div>
                      <div className="text-xs text-blue-300 mb-1">Value Created</div>
                      <div className="text-sm font-bold text-green-400">{demo.valueSaved}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-xs text-blue-300 mb-1">Stakeholders Coordinated</div>
                      <div className="text-sm font-bold text-white">{demo.stakeholders.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                <Link href={demo.route}>
                  <Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 group-hover:bg-white/30" data-testid={`button-${demo.id}-demo`}>
                    Experience {demo.title} Demo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>

        {/* Crisis Response (Defensive) */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            <h2 className="text-2xl font-bold text-white">Crisis Response (Defensive Coordination)</h2>
            <Badge className="bg-amber-600">6 Live Demos</Badge>
          </div>
          <p className="text-blue-200 mb-6 max-w-4xl">
            When crises hit—ransomware, recalls, supplier failures—traditional coordination takes days. M compresses response to minutes, 
            minimizing damage and protecting value before the situation escalates.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {defensiveDemos.map((demo) => (
              <Card
                key={demo.id}
                className={`p-6 bg-gradient-to-br ${demo.bgGradient} border-2 ${demo.borderColor} hover:scale-[1.02] transition-transform cursor-pointer group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg bg-slate-950/50 ${demo.iconColor}`}>
                      <demo.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{demo.title}</h3>
                      <p className="text-sm text-blue-200">{demo.industry}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-white/30 text-white">
                    {demo.playbook.split(' - ')[0]}
                  </Badge>
                </div>

                <div className="space-y-3 mb-6">
                  <div>
                    <div className="text-sm text-blue-300 mb-1">Crisis Scenario</div>
                    <div className="font-semibold text-white">{demo.crisis}</div>
                  </div>

                  <div>
                    <div className="text-sm text-blue-300 mb-1">Organization</div>
                    <div className="text-white">{demo.organization}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/10">
                    <div>
                      <div className="text-xs text-blue-300 mb-1">Time Saved</div>
                      <div className="font-bold text-green-400 text-sm">{demo.timeSaved}</div>
                    </div>
                    <div>
                      <div className="text-xs text-blue-300 mb-1">Value Impact</div>
                      <div className="font-bold text-yellow-400 text-sm">{demo.valueSaved}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-white">{demo.stakeholders} stakeholders</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-400" />
                      <span className="text-sm text-white">4-Act Demo</span>
                    </div>
                  </div>
                </div>

                <Link href={demo.route}>
                  <Button
                    className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/30 group-hover:bg-white group-hover:text-slate-900 transition-colors"
                    data-testid={`button-demo-${demo.id}`}
                  >
                    Experience {demo.industry} Demo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>

        {/* Coming Soon */}
        {comingSoonDemos.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <h2 className="text-2xl font-bold text-white">Coming Soon</h2>
              <Badge variant="outline" className="border-blue-500 text-blue-400">
                In Development
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comingSoonDemos.map((demo) => (
                <Card
                  key={demo.id}
                  className="p-6 bg-slate-900/30 border-slate-700 opacity-75"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg bg-slate-950/50 ${demo.iconColor}`}>
                      <demo.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{demo.title}</h3>
                      <p className="text-sm text-blue-300">{demo.industry}</p>
                    </div>
                  </div>

                  <div className="text-sm text-blue-200 mb-4">{demo.crisis}</div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="text-blue-300">{demo.organization}</div>
                    <Badge variant="outline" className="border-blue-600 text-blue-400">
                      Coming Soon
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Value Proposition */}
        <Card className="mt-12 p-8 bg-gradient-to-r from-blue-950/50 to-purple-950/50 border-blue-800/30">
          <div className="text-center max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">The Detection-Execution Gap</h3>
            <p className="text-lg text-blue-100 mb-6 leading-relaxed">
              Every industry has invested billions in AI for detection—fraud monitoring, quality control, supply chain visibility, threat intelligence. 
              But when crises hit, coordination still happens at email speed. M bridges that gap.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400 mb-2">48-72 Hours</div>
                <div className="text-sm text-red-300">Traditional coordination delay</div>
              </div>
              <div className="text-center">
                <ArrowRight className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-sm text-blue-300">M orchestration</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">12 Minutes</div>
                <div className="text-sm text-green-300">Full stakeholder coordination</div>
              </div>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link href="/playbook-library">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
              Explore All 166 Playbooks
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
