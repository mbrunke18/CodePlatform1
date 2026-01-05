import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Target,
  Shield,
  Zap,
  Users,
  Globe,
  Rocket,
  DollarSign,
  BarChart3,
  Lock,
  Network,
  Lightbulb,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { useLocation } from "wouter";
import StandardNav from "@/components/layout/StandardNav";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

// Market funnel data
const marketFunnelData = [
  { name: 'TAM', value: 127, label: '$127B', color: '#3B82F6' },
  { name: 'SAM', value: 38, label: '$38B', color: '#8B5CF6' },
  { name: 'SOM', value: 1.9, label: '$1.9B', color: '#10B981' }
];

// LTV:CAC trend over 5 years
const ltvCacTrendData = [
  { year: 'Y1', ratio: 3.2, ltv: 160, cac: 50 },
  { year: 'Y2', ratio: 5.1, ltv: 280, cac: 55 },
  { year: 'Y3', ratio: 6.8, ltv: 420, cac: 62 },
  { year: 'Y4', ratio: 7.9, ltv: 580, cac: 73 },
  { year: 'Y5', ratio: 8.4, ltv: 756, cac: 90 }
];

// ROI breakdown data
const roiBreakdownData = [
  { name: 'Cost Savings', value: 7.2, color: '#10B981' },
  { name: 'Time Recovery', value: 3.4, color: '#3B82F6' },
  { name: 'Risk Mitigation', value: 1.8, color: '#8B5CF6' }
];

export default function InvestorLanding() {
  const [, setLocation] = useLocation();

  return (
    <div className="page-background min-h-screen">
      <StandardNav />

        {/* Hero Section */}
        <section className="py-20 px-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <Badge className="mb-6 bg-blue-600 text-white border-0 text-sm px-4 py-1.5" data-testid="badge-category">
              Category-Defining Opportunity
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight max-w-5xl bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent" data-testid="heading-hero">
              The Salesforce Moment for Strategic Execution
            </h1>
            
            <p className="text-2xl md:text-3xl text-cyan-200 font-semibold mb-6" data-testid="text-tagline">
              M: First Strategic Execution Operating System
            </p>
            
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-4xl" data-testid="text-description">
              Fortune 1000 companies spend $847B annually on strategic initiatives—83% fail due to execution gaps. M creates a new software category worth $127B TAM, delivering 500x faster execution with complete 7-component ecosystem.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg"
                onClick={() => setLocation("/executive-demo-walkthrough")}
                className="bg-white text-slate-900 hover:bg-slate-100"
                data-testid="button-see-demo"
              >
                <Rocket className="mr-2 h-5 w-5" />
                See 8-Minute Demo
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => setLocation("/business-scenarios")}
                className="border-white text-white hover:bg-white/10"
                data-testid="button-explore-scenarios"
              >
                Explore Use Cases
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Market Opportunity */}
        <section className="py-16 px-6 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white" data-testid="heading-market">
                Massive Market Opportunity
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto" data-testid="text-market-subtitle">
                Creating a new $127B software category at the intersection of strategic planning, AI intelligence, and execution automation
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="border-2" data-testid="card-tam">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                    <Globe className="h-6 w-6 text-blue-600" />
                    TAM (Total Addressable Market)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-blue-600 mb-2" data-testid="text-tam-value">$127B</div>
                  <p className="text-slate-600 dark:text-slate-400" data-testid="text-tam-description">
                    Fortune 1000 strategic execution software spend (15% of $847B total strategic initiatives budget)
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2" data-testid="card-sam">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                    <Target className="h-6 w-6 text-purple-600" />
                    SAM (Serviceable Addressable)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-purple-600 mb-2" data-testid="text-sam-value">$38B</div>
                  <p className="text-slate-600 dark:text-slate-400" data-testid="text-sam-description">
                    Fortune 500 + high-growth enterprises with $1B+ revenue requiring executive decision velocity
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2" data-testid="card-som">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                    <Rocket className="h-6 w-6 text-green-600" />
                    SOM (Serviceable Obtainable)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-green-600 mb-2" data-testid="text-som-value">$1.9B</div>
                  <p className="text-slate-600 dark:text-slate-400" data-testid="text-som-description">
                    5% market capture in Year 5 (50 Fortune 500 + 200 mid-market at $250K-$2M ACV)
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Market Funnel Visualization */}
            <Card className="border-2 mb-8" data-testid="card-market-funnel">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">Market Opportunity Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={marketFunnelData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip 
                      formatter={(value: number) => `$${value}B`}
                      contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '8px', color: 'white' }}
                    />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                      {marketFunnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
                  Progressive market capture: $127B TAM → $38B SAM → $1.9B SOM (Year 5)
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br .section-background dark:from-slate-800 dark:to-slate-700 border-2" data-testid="card-why-now">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white" data-testid="heading-why-now">
                  Why Now? Perfect Market Timing
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3" data-testid="reason-1">
                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white mb-1">AI Maturity Reached</div>
                      <div className="text-slate-600 dark:text-slate-400">LLMs enable real-time strategic intelligence at scale (GPT-4, Claude, Gemini)</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3" data-testid="reason-2">
                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white mb-1">Execution Crisis</div>
                      <div className="text-slate-600 dark:text-slate-400">87% of strategic initiatives fail—executives desperate for execution velocity</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3" data-testid="reason-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white mb-1">Remote Work Complexity</div>
                      <div className="text-slate-600 dark:text-slate-400">Distributed teams make coordination harder—need automated orchestration</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3" data-testid="reason-4">
                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white mb-1">Competitive Velocity</div>
                      <div className="text-slate-600 dark:text-slate-400">Market windows shrinking from months to days—speed is survival</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Competitive Moat */}
        <section className="py-16 px-6 bg-slate-50 dark:bg-slate-800">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white" data-testid="heading-moat">
                Defensible Competitive Moat
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto" data-testid="text-moat-subtitle">
                Multi-layered advantages that compound over time, creating winner-take-most dynamics
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-2" data-testid="card-moat-ecosystem">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                    <Shield className="h-6 w-6 text-primary" />
                    Complete 7-Component Ecosystem
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Competitors offer point solutions (BI tools, project management, chatbots). M integrates entire strategic execution workflow—massive switching costs once embedded.
                  </p>
                  <div className="text-sm font-semibold text-primary" data-testid="text-moat-ecosystem-advantage">
                    Advantage: 18-24 month integration lead vs. competitors
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2" data-testid="card-moat-memory">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                    <Lightbulb className="h-6 w-6 text-purple-600" />
                    Institutional Memory Network Effects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    AI learns from every decision across all customers (anonymized). More customers = smarter recommendations = higher retention. Data moat compounds quarterly.
                  </p>
                  <div className="text-sm font-semibold text-primary" data-testid="text-moat-memory-advantage">
                    Advantage: Data flywheel creates 10x better AI vs. new entrants
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2" data-testid="card-moat-templates">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                    <Network className="h-6 w-6 text-blue-600" />
                    Template Library Network Effects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Start with 13+ templates, grows to 500+ as customers contribute. More templates = more use cases = more customers. Self-reinforcing growth loop.
                  </p>
                  <div className="text-sm font-semibold text-primary" data-testid="text-moat-templates-advantage">
                    Advantage: Content moat—competitors can't replicate library scale
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2" data-testid="card-moat-category">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                    <Rocket className="h-6 w-6 text-green-600" />
                    Category Leadership
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    First mover defining "Strategic Execution Operating System" category (like Salesforce for CRM). Category creators capture 76% of market value (Gartner research).
                  </p>
                  <div className="text-sm font-semibold text-primary" data-testid="text-moat-category-advantage">
                    Advantage: Brand moat—"M" becomes verb for strategic execution
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Business Model */}
        <section className="py-16 px-6 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white" data-testid="heading-model">
                High-Margin SaaS Business Model
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto" data-testid="text-model-subtitle">
                Enterprise pricing with expansion revenue and sticky product-led growth
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="border-2" data-testid="card-pricing-enterprise">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                    <DollarSign className="h-6 w-6 text-green-600" />
                    Enterprise
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-2" data-testid="text-price-enterprise">$250K-$2M</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">Annual Contract Value</div>
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Unlimited users
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Custom integrations
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Dedicated CSM
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2" data-testid="card-pricing-team">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                    <Users className="h-6 w-6 text-blue-600" />
                    Team
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 mb-2" data-testid="text-price-team">$48K-$120K</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">Annual ($4K-$10K/mo)</div>
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-600" />
                      Up to 50 users
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-600" />
                      Standard integrations
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-600" />
                      Email support
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2" data-testid="card-pricing-executive">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                    Executive
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600 mb-2" data-testid="text-price-executive">$12K-$24K</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">Annual ($1K-$2K/mo)</div>
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-purple-600" />
                      1-5 executives
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-purple-600" />
                      Core features
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-purple-600" />
                      Self-serve
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 border-2" data-testid="card-expansion">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white" data-testid="heading-expansion">
                  Expansion Revenue Streams
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div data-testid="expansion-1">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-5 w-5 text-green-600" />
                      <div className="font-semibold text-slate-900 dark:text-white">Integration Marketplace</div>
                    </div>
                    <div className="text-slate-600 dark:text-slate-400">20% rev-share on third-party integrations (Salesforce, Jira, Slack)</div>
                  </div>
                  <div data-testid="expansion-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-5 w-5 text-blue-600" />
                      <div className="font-semibold text-slate-900 dark:text-white">Premium Templates</div>
                    </div>
                    <div className="text-slate-600 dark:text-slate-400">Industry-specific playbooks ($5K-$50K per template pack)</div>
                  </div>
                  <div data-testid="expansion-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="h-5 w-5 text-purple-600" />
                      <div className="font-semibold text-slate-900 dark:text-white">Advisory Services</div>
                    </div>
                    <div className="text-slate-600 dark:text-slate-400">Strategic workshops ($50K-$200K per engagement)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Unit Economics */}
        <section className="py-16 px-6 bg-slate-50 dark:bg-slate-800">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white" data-testid="heading-economics">
                Best-in-Class Unit Economics
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto" data-testid="text-economics-subtitle">
                High LTV, low CAC, exceptional retention—SaaS metrics investors love
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <Card className="border-2" data-testid="card-ltv-cac">
                <CardContent className="pt-6">
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">LTV:CAC Ratio</div>
                  <div className="text-4xl font-bold text-green-600 mb-1" data-testid="text-ltv-cac">8.4:1</div>
                  <div className="text-xs text-slate-500">Target: &gt;3:1 (Exceptional)</div>
                </CardContent>
              </Card>

              <Card className="border-2" data-testid="card-payback">
                <CardContent className="pt-6">
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">CAC Payback</div>
                  <div className="text-4xl font-bold text-blue-600 mb-1" data-testid="text-payback">7 months</div>
                  <div className="text-xs text-slate-500">Target: &lt;12mo (Excellent)</div>
                </CardContent>
              </Card>

              <Card className="border-2" data-testid="card-ndr">
                <CardContent className="pt-6">
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Net Dollar Retention</div>
                  <div className="text-4xl font-bold text-purple-600 mb-1" data-testid="text-ndr">142%</div>
                  <div className="text-xs text-slate-500">Target: &gt;120% (Best-in-class)</div>
                </CardContent>
              </Card>

              <Card className="border-2" data-testid="card-gross-margin">
                <CardContent className="pt-6">
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Gross Margin</div>
                  <div className="text-4xl font-bold text-indigo-600 mb-1" data-testid="text-gross-margin">87%</div>
                  <div className="text-xs text-slate-500">Target: &gt;80% (Premium SaaS)</div>
                </CardContent>
              </Card>
            </div>

            {/* LTV:CAC Trend Chart */}
            <Card className="border-2 mt-8" data-testid="card-ltv-cac-trend">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">LTV:CAC Ratio Growth Trajectory</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={ltvCacTrendData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                    <XAxis dataKey="year" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '8px', color: 'white' }}
                    />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="ratio" stroke="#10B981" strokeWidth={3} name="LTV:CAC Ratio" dot={{ fill: '#10B981', r: 6 }} />
                    <Line yAxisId="right" type="monotone" dataKey="ltv" stroke="#3B82F6" strokeWidth={2} name="LTV ($K)" />
                    <Line yAxisId="right" type="monotone" dataKey="cac" stroke="#8B5CF6" strokeWidth={2} name="CAC ($K)" />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
                  LTV:CAC improving from 3.2:1 (Y1) to 8.4:1 (Y5) as scale economics kick in
                </div>
              </CardContent>
            </Card>

            {/* ROI Breakdown Chart */}
            <Card className="border-2 mt-8" data-testid="card-roi-breakdown">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">$12.4M Annual ROI Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={roiBreakdownData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: $${value}M`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {roiBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => `$${value}M`}
                          contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '8px', color: 'white' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10B981' }}></div>
                        <div className="font-semibold text-slate-900 dark:text-white">Cost Savings: $7.2M</div>
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Eliminated coordination delays, reduced strategic initiative failures
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3B82F6' }}></div>
                        <div className="font-semibold text-slate-900 dark:text-white">Time Recovery: $3.4M</div>
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        342 hours saved monthly, valued at executive time rates
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: '#8B5CF6' }}></div>
                        <div className="font-semibold text-slate-900 dark:text-white">Risk Mitigation: $1.8M</div>
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Prevented strategic missteps through AI-powered early warnings
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-gradient-to-br from-primary to-blue-900 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" data-testid="heading-cta">
              Join Us in Creating a New Software Category
            </h2>
            <p className="text-xl mb-8 text-blue-100" data-testid="text-cta-description">
              M is defining the Strategic Execution Operating System category—a $127B market opportunity with winner-take-most dynamics. Early investors gain exposure to category creation with defensible moats and exceptional unit economics.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => setLocation("/executive-demo-walkthrough")}
                className="bg-white text-slate-900 hover:bg-slate-100"
                data-testid="button-cta-demo"
              >
                <Rocket className="mr-2 h-5 w-5" />
                Experience the Platform
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setLocation("/dashboard")}
                className="border-white text-white hover:bg-white/10"
                data-testid="button-cta-dashboard"
              >
                Explore Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
    </div>
  );
}
