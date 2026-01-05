import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import VeridiusPageLayout from '@/components/layout/VeridiusPageLayout';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building2,
  Briefcase,
  PieChart
} from 'lucide-react';

export default function BusinessIntelligence() {
  const executiveMetrics = [
    { title: "Revenue Growth", value: "$127.5M", change: "+23.5%", trend: "up", color: "text-green-600" },
    { title: "Market Share", value: "34.2%", change: "+5.7%", trend: "up", color: "text-blue-600" },
    { title: "Operational Efficiency", value: "94.8%", change: "+12.3%", trend: "up", color: "text-purple-600" },
    { title: "Customer Satisfaction", value: "4.8/5", change: "+0.3", trend: "up", color: "text-orange-600" }
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
    <VeridiusPageLayout>
      <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="p-8">
          {/* Business Intelligence Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Business Intelligence Center</h1>
                <p className="text-gray-600 dark:text-gray-300">Executive Analytics & Competitive Intelligence</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="text-green-600 border-green-500/50">
                <TrendingUp className="w-3 h-3 mr-1" />
                Market Leading
              </Badge>
              <Badge className="bg-green-600 text-white">
                Executive BI
              </Badge>
            </div>
          </div>

          {/* Executive Performance Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {executiveMetrics.map((metric, index) => (
              <Card key={index} className="bg-white/90 dark:bg-slate-800/90 backdrop-blur">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.title}</CardTitle>
                    {metric.trend === 'up' ? 
                      <ArrowUpRight className="w-4 h-4 text-green-500" /> : 
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                    }
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{metric.value}</div>
                  <div className={`text-sm ${metric.color}`}>{metric.change}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Competitive Analysis */}
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <Target className="w-5 h-5 mr-2 text-red-500" />
                  Competitive Intelligence Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {competitiveAnalysis.map((comp, index) => (
                    <div key={index} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{comp.competitor}</h4>
                        <Badge 
                          variant={comp.marketPosition === 'Leading' ? 'default' : 
                                 comp.marketPosition === 'Superior' ? 'destructive' : 'secondary'}
                        >
                          {comp.marketPosition}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="text-green-600">✓ Strength: {comp.strength}</div>
                        <div className="text-red-600">✗ Weakness: {comp.weakness}</div>
                        <div className="text-blue-600 font-medium">Our Advantage: {comp.ourAdvantage}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Indicators */}
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <PieChart className="w-5 h-5 mr-2 text-purple-500" />
                  Key Performance Indicators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {performanceIndicators.map((kpi, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-900 dark:text-white">{kpi.kpi}</span>
                        <span className="text-gray-600 dark:text-gray-400">{kpi.current} / {kpi.target}</span>
                      </div>
                      <Progress value={kpi.progress} className="h-3" />
                      <div className="text-xs text-gray-500 text-right">{kpi.progress}% of target achieved</div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-6" data-testid="button-detailed-analytics">
                  View Detailed Analytics Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Executive Actions */}
          <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900 dark:text-white">
                <Briefcase className="w-5 h-5 mr-2 text-blue-500" />
                Executive Business Intelligence Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button className="h-14 bg-blue-600 hover:bg-blue-700 text-white" data-testid="button-market-analysis">
                  <Globe className="w-5 h-5 mr-2" />
                  Market Analysis
                </Button>
                <Button className="h-14 bg-green-600 hover:bg-green-700 text-white" data-testid="button-financial-modeling">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Financial Modeling
                </Button>
                <Button className="h-14 bg-purple-600 hover:bg-purple-700 text-white" data-testid="button-competitive-intel">
                  <Target className="w-5 h-5 mr-2" />
                  Competitive Intel
                </Button>
                <Button className="h-14 bg-orange-600 hover:bg-orange-700 text-white" data-testid="button-executive-report">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Executive Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </VeridiusPageLayout>
  );
}