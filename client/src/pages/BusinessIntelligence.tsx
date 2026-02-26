import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import PageLayout from '@/components/layout/PageLayout';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Briefcase,
  PieChart,
  ArrowRight,
  FileText,
  CheckCircle
} from 'lucide-react';

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

export default function BusinessIntelligence() {
  const executiveMetrics = [
    { title: "Revenue Growth", value: "$127.5M", change: "+23.5%", trend: "up", color: "text-[#2B8A6E]" },
    { title: "Market Share", value: "34.2%", change: "+5.7%", trend: "up", color: "text-[#0A0F2E]" },
    { title: "Operational Efficiency", value: "94.8%", change: "+12.3%", trend: "up", color: "text-[#2B8A6E]" },
    { title: "Customer Satisfaction", value: "4.8/5", change: "+0.3", trend: "up", color: "text-[#C9A84C]" }
  ];

  const competitiveAnalysis = [
    {
      competitor: "Traditional Consulting Firms",
      strength: "Established relationships",
      weakness: "Slow response times (6+ months)",
      ourAdvantage: "4-minute crisis activation vs 6-month traditional process",
      marketPosition: "Disrupting"
    },
    {
      competitor: "Business Intelligence Platforms", 
      strength: "Data visualization",
      weakness: "No crisis response integration",
      ourAdvantage: "AI intelligence + immediate crisis protocols",
      marketPosition: "Leading"
    },
    {
      competitor: "Crisis Management Software",
      strength: "Crisis protocols",
      weakness: "No predictive AI capabilities", 
      ourAdvantage: "85-92% AI accuracy + comprehensive templates",
      marketPosition: "Superior"
    }
  ];

  const performanceIndicators = [
    { kpi: "Decision Intelligence Speed", current: "4 min", target: "2 min", progress: 80 },
    { kpi: "AI Prediction Accuracy", current: "91%", target: "95%", progress: 92 },
    { kpi: "Crisis Response Readiness", current: "97%", target: "99%", progress: 97 },
    { kpi: "Platform Adoption Rate", current: "87%", target: "95%", progress: 87 }
  ];

  return (
    <PageLayout>
      <div className="flex-1 page-background overflow-auto bg-white">
        <div className="p-8">
          {/* Business Intelligence Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div style={{ width: 48, height: 48, background: NAVY, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Strategic Analytics</span>
                </div>
                <h1 style={{ ...CG, fontWeight: 600, fontSize: "2rem", color: NAVY }}>Business Intelligence Center</h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div style={{ display:"inline-flex", alignItems:"center", gap:5, background:"rgba(43,138,110,0.12)", color:"#3BAF8A", fontSize:9, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", padding:"3px 10px" }}>
                <TrendingUp className="w-3 h-3 mr-1" />
                Market Leading
              </div>
              <div style={{ display:"inline-flex", alignItems:"center", gap:5, background: "rgba(10, 15, 46, 0.05)", color: NAVY, fontSize:9, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", padding:"3px 10px" }}>
                Executive BI
              </div>
            </div>
          </div>

          {/* Executive Performance Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {executiveMetrics.map((metric, index) => (
              <Card key={index} className="border border-[#E8E4DC] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{metric.title}</span>
                  {metric.trend === 'up' ? 
                    <ArrowUpRight className="w-4 h-4 text-[#2B8A6E]" /> : 
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  }
                </div>
                <div style={{ ...CG, fontSize: "1.75rem", fontWeight: 600, color: NAVY }}>{metric.value}</div>
                <div className={`text-[10px] font-bold uppercase tracking-wider ${metric.color} mt-1`}>{metric.change}</div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Competitive Analysis */}
            <Card className="border border-[#E8E4DC] bg-white p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle style={{ ...CG, display: "flex", alignItems: "center", color: NAVY }}>
                  <Target className="w-5 h-5 mr-2 text-[#C9A84C]" />
                  Competitive Intelligence Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <div className="space-y-4">
                  {competitiveAnalysis.map((comp, index) => (
                    <div key={index} className="p-4 bg-[#F8F7F4] border border-[#E8E4DC] rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 style={{ ...CG, fontWeight: 600, color: NAVY }}>{comp.competitor}</h4>
                        <div style={{ display:"inline-flex", alignItems:"center", gap:5, background: "rgba(10, 15, 46, 0.05)", color: NAVY, fontSize:9, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", padding:"3px 10px" }}>
                          {comp.marketPosition}
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-[#2B8A6E] font-medium">
                          <CheckCircle className="w-3.5 h-3.5 mr-2" /> Strength: {comp.strength}
                        </div>
                        <div className="flex items-center text-red-700">
                          <div className="w-3.5 h-3.5 mr-2 flex items-center justify-center font-bold">×</div> Weakness: {comp.weakness}
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#E8E4DC] text-[#0A0F2E] font-bold text-[11px] uppercase tracking-wider">
                          Our Advantage: {comp.ourAdvantage}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Indicators */}
            <Card className="border border-[#E8E4DC] bg-white p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle style={{ ...CG, display: "flex", alignItems: "center", color: NAVY }}>
                  <PieChart className="w-5 h-5 mr-2 text-[#0A0F2E]" />
                  Key Performance Indicators
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <div className="space-y-6">
                  {performanceIndicators.map((kpi, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">{kpi.kpi}</span>
                        <span className="font-semibold text-[#0A0F2E]">{kpi.current} / {kpi.target}</span>
                      </div>
                      <Progress value={kpi.progress} className="h-2" />
                      <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest text-right">{kpi.progress}% OF TARGET ACHIEVED</div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-8" variant="outline" style={{ border:"1.5px solid #E8E4DC", color: NAVY, background:"transparent", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }} data-testid="button-detailed-analytics">
                  View Detailed Analytics Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Executive Actions */}
          <Card className="border border-[#E8E4DC] bg-[#0A0F2E] p-8">
            <CardHeader className="px-0 pt-0">
              <CardTitle style={{ ...CG, display: "flex", alignItems: "center", color: "white" }}>
                <Briefcase className="w-5 h-5 mr-2 text-[#C9A84C]" />
                Executive BI Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button className="h-14 bg-white/5 border border-white/10 hover:bg-white/10 text-white" data-testid="button-market-analysis">
                  <Globe className="w-5 h-5 mr-2 text-[#C9A84C]" />
                  Market Analysis
                </Button>
                <Button className="h-14 bg-white/5 border border-white/10 hover:bg-white/10 text-white" data-testid="button-financial-modeling">
                  <DollarSign className="w-5 h-5 mr-2 text-[#2B8A6E]" />
                  Financial Modeling
                </Button>
                <Button className="h-14 bg-white/5 border border-white/10 hover:bg-white/10 text-white" data-testid="button-competitive-intel">
                  <Target className="w-5 h-5 mr-2 text-[#C9A84C]" />
                  Competitive Intel
                </Button>
                <Button className="h-14 bg-white/5 border border-white/10 hover:bg-white/10 text-white" data-testid="button-executive-report">
                  <FileText className="w-5 h-5 mr-2 text-[#DFC178]" />
                  Executive Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
