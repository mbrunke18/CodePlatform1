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
  ArrowRight,
  Brain,
  Globe2,
  FileText,
  Quote,
  AlertTriangle
} from "lucide-react";
import { useLocation } from "wouter";
import StandardNav from "@/components/layout/StandardNav";
import { ExecuteIQLogo } from "@/components/ExecuteIQLogo";
const productArchitectureImg = "/images/product-architecture.png";
const futurePositioningImg = "/images/future-positioning.png";
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
        <section className="py-20 px-6 text-white relative overflow-hidden bg-[#0A0F2E]">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
          
          <div className="max-w-7xl mx-auto relative z-10 text-center">
            <div className="mb-8 flex justify-center">
              <div className="inline-block px-6 py-4 rounded-2xl border border-white/10 backdrop-blur-sm bg-white/5">
                <ExecuteIQLogo width={280} variant="full" color="white" showTagline={true} />
              </div>
            </div>
            <Badge className="mb-6 bg-[#C9A84C] text-[#0A0F2E] border-0 text-sm px-4 py-1.5" data-testid="badge-category">
              Category-Defining Opportunity
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight max-w-5xl mx-auto bg-gradient-to-r from-white via-[#EDD98A] to-[#C9A84C] bg-clip-text text-transparent" data-testid="heading-hero">
              The Salesforce Moment for Strategic Execution
            </h1>
            
            <p className="text-2xl md:text-3xl text-[#EDD98A] font-semibold mb-6" data-testid="text-tagline">
              The Agentic Execution Layer for Fortune 1000
            </p>
            
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-4xl mx-auto" data-testid="text-description">
              Fortune 1000 companies spend $847B annually on strategic initiatives—83% fail due to execution gaps. Execution OS creates a new software category worth $127B TAM, delivering 500x faster execution with complete 7-component ecosystem.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg"
                onClick={() => setLocation("/executive-demo-walkthrough")}
                className="bg-[#C9A84C] text-[#0A0F2E] hover:bg-[#EDD98A] font-bold"
                data-testid="button-see-demo"
              >
                <Rocket className="mr-2 h-5 w-5" />
                See 8-Minute Demo
              </Button>
              <Button 
                size="lg"
                onClick={() => setLocation("/incident-analyzer")}
                className="bg-white/10 text-white border border-white/20 hover:bg-white/20"
                data-testid="button-incident-analyzer"
              >
                <AlertTriangle className="mr-2 h-5 w-5 text-[#C9A84C]" />
                Try the Strategic Analyzer
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => setLocation("/readiness-assessment")}
                className="border-white/20 text-white hover:bg-white/10"
                data-testid="button-readiness-assessment"
              >
                <Shield className="mr-2 h-5 w-5 text-[#C9A84C]" />
                Check Your Readiness
              </Button>
            </div>
          </div>
        </section>

        {/* Three Problems Worth Billions */}
        <section className="py-16 px-6 text-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-6 bg-red-600/20 text-red-400 border border-red-500/30 text-sm px-4 py-1.5">
                <AlertTriangle className="h-4 w-4 mr-2 inline" />
                Market Problem
              </Badge>
              <h2 className="text-4xl font-bold mb-4 text-gray-900">
                Three Enterprise Problems Worth $847B
              </h2>
              <p className="text-xl text-gray-800 max-w-4xl mx-auto">
                Fortune 1000 companies face these three problems every time a strategic moment hits. No infrastructure existed to solve them—until Execution OS.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <Card className="bg-white border border-gray-200 hover:border-red-500/40 transition-all">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-red-500/10">
                        <Zap className="h-5 w-5 text-red-500" />
                      </div>
                      <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">Problem 1</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">The Execution Gap</h3>
                    <p className="text-sm text-gray-800 mb-2">20-72 hours to even begin acting when strategic moments hit</p>
                    <p className="text-xs text-red-400">$136K/hour delayed (IBM). $5-50M M&A synergy erosion.</p>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-[#2B8A6E] flex-shrink-0" />
                      <span className="text-sm text-[#2B8A6E] font-semibold">Solution</span>
                    </div>
                    <p className="text-sm text-gray-800 mb-3">Pre-built infrastructure activates in 12 minutes</p>
                    <div className="bg-[#2B8A6E]/10 rounded-lg px-3 py-2 text-center">
                      <span className="text-[#2B8A6E] font-bold text-lg">72 hrs → 12 min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 hover:border-amber-500/40 transition-all">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-amber-500/10">
                        <Users className="h-5 w-5 text-amber-500" />
                      </div>
                      <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Problem 2</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">The Coordination Chaos</h3>
                    <p className="text-sm text-gray-800 mb-2">50-200+ stakeholders. No system to coordinate them.</p>
                    <p className="text-xs text-amber-400">$4.88M avg breach cost. 35% higher without pre-defined teams.</p>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-[#2B8A6E] flex-shrink-0" />
                      <span className="text-sm text-[#2B8A6E] font-semibold">Solution</span>
                    </div>
                    <p className="text-sm text-gray-800 mb-3">Pre-mapped accountability, instant notification, real-time tracking</p>
                    <div className="bg-[#2B8A6E]/10 rounded-lg px-3 py-2 text-center">
                      <span className="text-[#2B8A6E] font-bold text-lg">35% cost reduction</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 hover:border-[#C9A84C]/40 transition-all">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-[#C9A84C]/10">
                        <Brain className="h-5 w-5 text-[#C9A84C]" />
                      </div>
                      <span className="text-xs font-semibold text-[#C9A84C] uppercase tracking-wider">Problem 3</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">The Institutional Amnesia</h3>
                    <p className="text-sm text-gray-800 mb-2">Knowledge walks out the door. Same scramble every time.</p>
                    <p className="text-xs text-[#C9A84C]">3.5 disruptions per 2 years. Same $4.88M cost repeated.</p>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-[#2B8A6E] flex-shrink-0" />
                      <span className="text-sm text-[#2B8A6E] font-semibold">Solution</span>
                    </div>
                    <p className="text-sm text-gray-800 mb-3">AI-powered learning loop. Playbooks that improve automatically.</p>
                    <div className="bg-[#2B8A6E]/10 rounded-lg px-3 py-2 text-center">
                      <span className="text-[#2B8A6E] font-bold text-lg">Compounding intelligence</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl px-6 py-4 text-center">
              <p className="text-gray-800">
                <span className="text-gray-900 font-semibold">Execution OS at $250K-$750K/year</span> vs. one incident costing <span className="text-red-400 font-semibold">$5-50M</span>. <span className="text-[#2B8A6E] font-semibold">Payback on first use.</span>
              </p>
            </div>
          </div>
        </section>

        {/* Agentic Execution Layer */}
        <section className="py-16 px-6 bg-gradient-to-br  text-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-6 bg-[#C9A84C]/20 text-[#C9A84C] border border-[#C9A84C]/30 text-sm px-4 py-1.5">
                <Brain className="h-4 w-4 mr-2 inline" />
                Architectural Thesis
              </Badge>
              <h2 className="text-4xl font-bold mb-4 text-gray-900">
                The Agentic Execution Layer
              </h2>
              <p className="text-xl text-gray-800 max-w-3xl mx-auto">
                Agents don't just generate answers — they coordinate enterprises. Execution OS is the missing orchestration layer between strategy and operational systems.
              </p>
            </div>

            <div className="grid md:grid-cols-5 gap-2 items-center max-w-4xl mx-auto mb-12">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                <div className="text-xs text-gray-800 mb-1">Strategy Layer</div>
                <div className="text-sm font-semibold text-gray-900">Board & C-Suite</div>
              </div>
              <div className="text-center text-gray-700">→</div>
              <div className="bg-gradient-to-r from-[#0A0F2E]/20 to-[#3BAF8A]/20 border-2 border-[#C9A84C]/50 rounded-xl p-4 text-center">
                <div className="text-xs text-[#C9A84C] font-semibold mb-1">Agentic Execution Layer</div>
                <div className="text-sm font-bold text-gray-900">Execution OS</div>
              </div>
              <div className="text-center text-gray-700">→</div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                <div className="text-xs text-gray-800 mb-1">Workflow Layer</div>
                <div className="text-sm font-semibold text-gray-900">Jira, ServiceNow</div>
              </div>
            </div>

            <div className="grid md:grid-cols-5 gap-4 max-w-5xl mx-auto">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center">
                <div className="w-10 h-10 mx-auto mb-3 bg-[#2B8A6E]/20 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-[#2B8A6E]" />
                </div>
                <div className="text-sm font-semibold text-gray-900 mb-1">Detection Agent</div>
                <div className="text-xs text-gray-800">Monitors signals across domains</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center">
                <div className="w-10 h-10 mx-auto mb-3 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-amber-400" />
                </div>
                <div className="text-sm font-semibold text-gray-900 mb-1">Risk Scoring Agent</div>
                <div className="text-xs text-gray-800">Classifies severity + urgency</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center">
                <div className="w-10 h-10 mx-auto mb-3 bg-[#0A0F2E]/20 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-[#0A0F2E]" />
                </div>
                <div className="text-sm font-semibold text-gray-900 mb-1">Routing Agent</div>
                <div className="text-xs text-gray-800">Assigns stakeholders + roles</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center">
                <div className="w-10 h-10 mx-auto mb-3 bg-[#2B8A6E]/20 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-[#2B8A6E]" />
                </div>
                <div className="text-sm font-semibold text-gray-900 mb-1">Decision Agent</div>
                <div className="text-xs text-gray-800">Pre-authorized within policy</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center">
                <div className="w-10 h-10 mx-auto mb-3 bg-[#C9A84C]/20 rounded-lg flex items-center justify-center">
                  <Brain className="h-5 w-5 text-[#C9A84C]" />
                </div>
                <div className="text-sm font-semibold text-gray-900 mb-1">Learning Agent</div>
                <div className="text-xs text-gray-800">Compounds institutional knowledge</div>
              </div>
            </div>
          </div>
        </section>

        {/* Independent Market Validation - Moved up for visibility */}
        <section className="py-16 px-6 text-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-6 bg-[#0A0F2E] text-gray-900 border-0 text-sm px-4 py-1.5">
                2026 Market Validation
              </Badge>
              <h2 className="text-4xl font-bold mb-4 text-gray-900">
                8 Flagship Reports. One Conclusion.
              </h2>
              <p className="text-xl text-gray-800 max-w-3xl mx-auto mb-6">
                The world's top consulting and technology firms independently confirm the market Execution OS addresses
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {['IBM', 'BCG', 'McKinsey', 'Bain', 'Accenture', 'Deloitte', 'PwC', 'Gartner', 'Forrester', 'IDC', 'Microsoft', 'Google Cloud', 'OpenAI', 'Anthropic', 'World Economic Forum'].map((firm) => (
                  <span key={firm} className="bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs font-medium text-gray-800">{firm}</span>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gray-50 border-gray-200 hover:border-indigo-500/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Brain className="h-5 w-5 text-[#0A0F2E]" />
                    <span className="font-bold text-gray-900 text-lg">BCG</span>
                  </div>
                  <div className="text-sm text-[#0A0F2E] mb-3">AI Radar 2026</div>
                  <div className="flex items-start gap-2 mb-3">
                    <Quote className="h-4 w-4 text-gray-700 flex-shrink-0 mt-1" />
                    <p className="text-gray-800 text-sm">"AI transformation shifting from CIO-led to CEO-led mandate"</p>
                  </div>
                  <p className="text-[#2B8A6E] text-sm italic">→ Execution OS is built for the C-suite</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-50 border-gray-200 hover:border-indigo-500/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Globe2 className="h-5 w-5 text-[#0A0F2E]" />
                    <span className="font-bold text-gray-900 text-lg">IBM</span>
                  </div>
                  <div className="text-sm text-[#0A0F2E] mb-3">The Enterprise in 2030</div>
                  <div className="flex items-start gap-2 mb-3">
                    <Quote className="h-4 w-4 text-gray-700 flex-shrink-0 mt-1" />
                    <p className="text-gray-800 text-sm">"The smarter enterprise requires new operating models"</p>
                  </div>
                  <p className="text-[#2B8A6E] text-sm italic">→ Execution OS IS that operating model</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-50 border-gray-200 hover:border-indigo-500/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <BarChart3 className="h-5 w-5 text-[#2B8A6E]" />
                    <span className="font-bold text-gray-900 text-lg">McKinsey</span>
                  </div>
                  <div className="text-sm text-[#2B8A6E] mb-3">Global Tech Agenda 2026</div>
                  <div className="flex items-start gap-2 mb-3">
                    <Quote className="h-4 w-4 text-gray-700 flex-shrink-0 mt-1" />
                    <p className="text-gray-800 text-sm">"CIOs evolving from cost managers to strategy architects"</p>
                  </div>
                  <p className="text-[#2B8A6E] text-sm italic">→ Our 170 playbooks give them the execution infrastructure</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-50 border-gray-200 hover:border-indigo-500/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Network className="h-5 w-5 text-[#C9A84C]" />
                    <span className="font-bold text-gray-900 text-lg">Deloitte</span>
                  </div>
                  <div className="text-sm text-[#C9A84C] mb-3">State of AI in the Enterprise 2026</div>
                  <div className="flex items-start gap-2 mb-3">
                    <Quote className="h-4 w-4 text-gray-700 flex-shrink-0 mt-1" />
                    <p className="text-gray-800 text-sm">"Rise of sovereign, agentic, and physical AI"</p>
                  </div>
                  <p className="text-[#2B8A6E] text-sm italic">→ Execution OS orchestrates agentic AI with human oversight</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-50 border-gray-200 hover:border-indigo-500/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Globe className="h-5 w-5 text-amber-400" />
                    <span className="font-bold text-gray-900 text-lg">World Economic Forum</span>
                  </div>
                  <div className="text-sm text-amber-400 mb-3">Proof over Promise</div>
                  <div className="flex items-start gap-2 mb-3">
                    <Quote className="h-4 w-4 text-gray-700 flex-shrink-0 mt-1" />
                    <p className="text-gray-800 text-sm">"Organizations scaling AI into outcomes"</p>
                  </div>
                  <p className="text-[#2B8A6E] text-sm italic">→ Execution OS delivers measurable execution outcomes</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-50 border-gray-200 hover:border-indigo-500/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="h-5 w-5 text-sky-400" />
                    <span className="font-bold text-gray-900 text-lg">Microsoft</span>
                  </div>
                  <div className="text-sm text-sky-400 mb-3">Agents Are Here</div>
                  <div className="flex items-start gap-2 mb-3">
                    <Quote className="h-4 w-4 text-gray-700 flex-shrink-0 mt-1" />
                    <p className="text-gray-800 text-sm">"Readiness requires people, process, culture, governance"</p>
                  </div>
                  <p className="text-[#2B8A6E] text-sm italic">→ Execution OS provides all four</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-50 border-gray-200 hover:border-indigo-500/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Target className="h-5 w-5 text-rose-400" />
                    <span className="font-bold text-gray-900 text-lg">Google Cloud</span>
                  </div>
                  <div className="text-sm text-rose-400 mb-3">AI Agent Trends 2026</div>
                  <div className="flex items-start gap-2 mb-3">
                    <Quote className="h-4 w-4 text-gray-700 flex-shrink-0 mt-1" />
                    <p className="text-gray-800 text-sm">"AI agents being used across industries"</p>
                  </div>
                  <p className="text-[#2B8A6E] text-sm italic">→ Our 9 strategic domains cover the enterprise</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-50 border-gray-200 hover:border-indigo-500/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="h-5 w-5 text-teal-400" />
                    <span className="font-bold text-gray-900 text-lg">Accenture</span>
                  </div>
                  <div className="text-sm text-teal-400 mb-3">New Rules of Platform Strategy</div>
                  <div className="flex items-start gap-2 mb-3">
                    <Quote className="h-4 w-4 text-gray-700 flex-shrink-0 mt-1" />
                    <p className="text-gray-800 text-sm">"Reinventing platform strategy for agentic AI"</p>
                  </div>
                  <p className="text-[#2B8A6E] text-sm italic">→ Execution OS is that platform</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Product Architecture Visual */}
        <section className="py-16 px-6 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">
                Complete End-to-End Platform
              </h2>
              <p className="text-xl text-gray-800 dark:text-slate-300 max-w-3xl mx-auto">
                From signal detection to coordinated execution in 12 minutes — the full architecture that replaces 72-hour scrambles
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700">
              <img
                src={productArchitectureImg}
                alt="Execution OS End-to-End Product Architecture — Signal Sources, AI Engine, 170 Playbooks, Execution Outputs, Command Center, and Integration Layer"
                className="w-full h-auto"
                loading="eager"
              />
            </div>
          </div>
        </section>

        {/* Market Opportunity */}
        <section className="py-16 px-6 bg-slate-50 dark:bg-slate-800">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white" data-testid="heading-market">
                Massive Market Opportunity
              </h2>
              <p className="text-xl text-gray-800 dark:text-slate-300 max-w-3xl mx-auto" data-testid="text-market-subtitle">
                Creating a new $127B software category at the intersection of strategic planning, AI intelligence, and execution automation
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="border-2" data-testid="card-tam">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                    <Globe className="h-6 w-6 text-[#0A0F2E]" />
                    TAM (Total Addressable Market)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-[#0A0F2E] mb-2" data-testid="text-tam-value">$127B</div>
                  <p className="text-gray-800 dark:text-slate-300" data-testid="text-tam-description">
                    Fortune 1000 strategic execution software spend (15% of $847B total strategic initiatives budget)
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2" data-testid="card-sam">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                    <Target className="h-6 w-6 text-[#C9A84C]" />
                    SAM (Serviceable Addressable)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-[#C9A84C] mb-2" data-testid="text-sam-value">$38B</div>
                  <p className="text-gray-800 dark:text-slate-300" data-testid="text-sam-description">
                    Fortune 500 + high-growth enterprises with $1B+ revenue requiring executive decision velocity
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2" data-testid="card-som">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                    <Rocket className="h-6 w-6 text-[#2B8A6E]" />
                    SOM (Serviceable Obtainable)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-[#2B8A6E] mb-2" data-testid="text-som-value">$1.9B</div>
                  <p className="text-gray-800 dark:text-slate-300" data-testid="text-som-description">
                    5% market capture in Year 5 (50 Fortune 500 + 200 mid-market at $250K-$1.5M ACV)
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
                <div className="mt-4 text-center text-sm text-gray-800 dark:text-slate-300">
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
                    <CheckCircle2 className="h-6 w-6 text-[#2B8A6E] flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white mb-1">AI Maturity Reached</div>
                      <div className="text-gray-800 dark:text-slate-300">LLMs enable real-time strategic intelligence at scale (GPT-4, Claude, Gemini)</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3" data-testid="reason-2">
                    <CheckCircle2 className="h-6 w-6 text-[#2B8A6E] flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white mb-1">Execution Crisis</div>
                      <div className="text-gray-800 dark:text-slate-300">87% of strategic initiatives fail—executives desperate for execution velocity</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3" data-testid="reason-3">
                    <CheckCircle2 className="h-6 w-6 text-[#2B8A6E] flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white mb-1">Remote Work Complexity</div>
                      <div className="text-gray-800 dark:text-slate-300">Distributed teams make coordination harder—need automated orchestration</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3" data-testid="reason-4">
                    <CheckCircle2 className="h-6 w-6 text-[#2B8A6E] flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white mb-1">Competitive Velocity</div>
                      <div className="text-gray-800 dark:text-slate-300">Market windows shrinking from months to days—speed is survival</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Agentic AI Convergence */}
        <section className="py-16 px-6 bg-white text-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <Badge className="mb-4 bg-[#2B8A6E] text-gray-900 border-0 text-sm px-4 py-1.5">
                Last 6 Months
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                12 Guides. 9 Firms. One Conclusion.
              </h2>
              <p className="text-lg text-gray-800 max-w-3xl mx-auto mb-6">
                The entire agentic AI landscape — from McKinsey to AWS to WEF — published in the last 6-8 months, all pointing at the same gap Execution OS fills.
              </p>
              <div className="flex items-center justify-center gap-8 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#2B8A6E]">12</div>
                  <div className="text-gray-800 text-sm">Guides</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#2B8A6E]">9</div>
                  <div className="text-gray-800 text-sm">Firms</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#2B8A6E]">6 mo</div>
                  <div className="text-gray-800 text-sm">Published</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#2B8A6E]">1</div>
                  <div className="text-gray-800 text-sm">Conclusion</div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 border border-[#0A0F2E]/30 rounded-xl p-5">
                <div className="text-[#0A0F2E] font-bold text-sm mb-3 uppercase tracking-wider">Strategy</div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2B8A6E] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-800"><span className="text-gray-900 font-medium">McKinsey</span> — State of AI reality check</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2B8A6E] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-800"><span className="text-gray-900 font-medium">PwC</span> — Making AI agents accretive to P&L</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2B8A6E] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-800"><span className="text-gray-900 font-medium">McKinsey</span> — The Agentic AI Opportunity</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2B8A6E] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-800"><span className="text-gray-900 font-medium">Accenture</span> — Six Insights for AI ROI</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-[#2B8A6E]/30 rounded-xl p-5">
                <div className="text-[#2B8A6E] font-bold text-sm mb-3 uppercase tracking-wider">Build</div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2B8A6E] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-800"><span className="text-gray-900 font-medium">AWS</span> — Rise of Autonomous Agents</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2B8A6E] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-800"><span className="text-gray-900 font-medium">Bain</span> — Foundations for Agentic AI</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2B8A6E] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-800"><span className="text-gray-900 font-medium">IBM</span> — Agentic AI Operating Model</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2B8A6E] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-800"><span className="text-gray-900 font-medium">Deloitte</span> — Agentic Enterprise 2028</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-amber-500/30 rounded-xl p-5">
                <div className="text-amber-400 font-bold text-sm mb-3 uppercase tracking-wider">Leadership</div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2B8A6E] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-800"><span className="text-gray-900 font-medium">BCG</span> — Machines That Manage Themselves</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2B8A6E] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-800"><span className="text-gray-900 font-medium">McKinsey</span> — The Agentic Organization</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2B8A6E] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-800"><span className="text-gray-900 font-medium">WEF</span> — AI Agents in Action</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2B8A6E] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-800"><span className="text-gray-900 font-medium">McKinsey</span> — Seizing the Agentic AI Advantage</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 bg-[#2B8A6E]/15 border border-[#2B8A6E]/50 rounded-lg text-center">
              <p className="text-emerald-300 font-semibold mb-1">Every firm is consulting on the problem. Execution OS built the product.</p>
              <p className="text-gray-800 text-sm">170 playbooks, 9 strategic domains, pre-defined governance — ready today.</p>
            </div>
          </div>
        </section>

        {/* Competitive Moat */}
        <section className="py-16 px-6 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white" data-testid="heading-moat">
                Defensible Competitive Moat
              </h2>
              <p className="text-xl text-gray-800 dark:text-slate-300 max-w-3xl mx-auto" data-testid="text-moat-subtitle">
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
                  <p className="text-gray-800 dark:text-slate-300 mb-4">
                    Competitors offer point solutions (BI tools, project management, chatbots). Execution OS integrates entire strategic execution workflow—massive switching costs once embedded.
                  </p>
                  <div className="text-sm font-semibold text-primary" data-testid="text-moat-ecosystem-advantage">
                    Advantage: 18-24 month integration lead vs. competitors
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2" data-testid="card-moat-memory">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                    <Lightbulb className="h-6 w-6 text-[#C9A84C]" />
                    Institutional Memory Network Effects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-800 dark:text-slate-300 mb-4">
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
                    <Network className="h-6 w-6 text-[#0A0F2E]" />
                    Template Library Network Effects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-800 dark:text-slate-300 mb-4">
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
                    <Rocket className="h-6 w-6 text-[#2B8A6E]" />
                    Category Leadership
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-800 dark:text-slate-300 mb-4">
                    First mover defining "Strategic Execution Operating System" category (like Salesforce for CRM). Category creators capture 76% of market value (Gartner research).
                  </p>
                  <div className="text-sm font-semibold text-primary" data-testid="text-moat-category-advantage">
                    Advantage: Brand moat—"Execution OS" becomes verb for strategic execution
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Future Positioning Visual */}
        <section className="py-16 px-6 bg-slate-50 dark:bg-slate-800">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">
                Built for Today. Positioned for Tomorrow.
              </h2>
              <p className="text-xl text-gray-800 dark:text-slate-300 max-w-3xl mx-auto">
                Selling pain relief today while building the operating layer for the AI era — infrastructure that evolves with every customer
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700">
              <img
                src={futurePositioningImg}
                alt="Execution OS Future Positioning — Phase 1: Today's execution infrastructure, Phase 2: Tomorrow's AI operating layer"
                className="w-full h-auto"
                loading="lazy"
              />
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
              <p className="text-xl text-gray-800 dark:text-slate-300 max-w-3xl mx-auto" data-testid="text-model-subtitle">
                Enterprise pricing with expansion revenue and sticky product-led growth
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="border-2" data-testid="card-pricing-enterprise">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                    <DollarSign className="h-6 w-6 text-[#2B8A6E]" />
                    Enterprise
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#2B8A6E] mb-2" data-testid="text-price-enterprise">$250K</div>
                  <div className="text-sm text-gray-800 dark:text-slate-300 mb-4">Annual Contract Value</div>
                  <ul className="space-y-2 text-sm text-gray-800 dark:text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#2B8A6E]" />
                      Single domain
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#2B8A6E]" />
                      Standard integrations
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#2B8A6E]" />
                      Dedicated CSM
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2" data-testid="card-pricing-team">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                    <Users className="h-6 w-6 text-[#0A0F2E]" />
                    Enterprise Plus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#0A0F2E] mb-2" data-testid="text-price-team">$450K</div>
                  <div className="text-sm text-gray-800 dark:text-slate-300 mb-4">Annual Contract Value</div>
                  <ul className="space-y-2 text-sm text-gray-800 dark:text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#0A0F2E]" />
                      Multi-domain
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#0A0F2E]" />
                      Full integration suite
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#0A0F2E]" />
                      Priority support
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2" data-testid="card-pricing-executive">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                    <TrendingUp className="h-6 w-6 text-[#C9A84C]" />
                    Global
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#C9A84C] mb-2" data-testid="text-price-executive">$750K-$1.5M</div>
                  <div className="text-sm text-gray-800 dark:text-slate-300 mb-4">Custom Annual Contract</div>
                  <ul className="space-y-2 text-sm text-gray-800 dark:text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#C9A84C]" />
                      Multi-region orchestration
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#C9A84C]" />
                      White-glove implementation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#C9A84C]" />
                      Dedicated account team
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-green-50 to-[#141B45] dark:from-slate-800 dark:to-slate-700 border-2" data-testid="card-expansion">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white" data-testid="heading-expansion">
                  Expansion Revenue Streams
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div data-testid="expansion-1">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-5 w-5 text-[#2B8A6E]" />
                      <div className="font-semibold text-slate-900 dark:text-white">Integration Marketplace</div>
                    </div>
                    <div className="text-gray-800 dark:text-slate-300">20% rev-share on third-party integrations (Salesforce, Jira, Slack)</div>
                  </div>
                  <div data-testid="expansion-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-5 w-5 text-[#0A0F2E]" />
                      <div className="font-semibold text-slate-900 dark:text-white">Premium Templates</div>
                    </div>
                    <div className="text-gray-800 dark:text-slate-300">Industry-specific playbooks ($5K-$50K per template pack)</div>
                  </div>
                  <div data-testid="expansion-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="h-5 w-5 text-[#C9A84C]" />
                      <div className="font-semibold text-slate-900 dark:text-white">Advisory Services</div>
                    </div>
                    <div className="text-gray-800 dark:text-slate-300">Strategic workshops ($50K-$200K per engagement)</div>
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
              <p className="text-xl text-gray-800 dark:text-slate-300 max-w-3xl mx-auto" data-testid="text-economics-subtitle">
                High LTV, low CAC, exceptional retention—SaaS metrics investors love
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <Card className="border-2" data-testid="card-ltv-cac">
                <CardContent className="pt-6">
                  <div className="text-sm text-gray-800 dark:text-slate-300 mb-2">LTV:CAC Ratio</div>
                  <div className="text-4xl font-bold text-[#2B8A6E] mb-1" data-testid="text-ltv-cac">8.4:1</div>
                  <div className="text-xs text-gray-800">Target: &gt;3:1 (Exceptional)</div>
                </CardContent>
              </Card>

              <Card className="border-2" data-testid="card-payback">
                <CardContent className="pt-6">
                  <div className="text-sm text-gray-800 dark:text-slate-300 mb-2">CAC Payback</div>
                  <div className="text-4xl font-bold text-[#0A0F2E] mb-1" data-testid="text-payback">7 months</div>
                  <div className="text-xs text-gray-800">Target: &lt;12mo (Excellent)</div>
                </CardContent>
              </Card>

              <Card className="border-2" data-testid="card-ndr">
                <CardContent className="pt-6">
                  <div className="text-sm text-gray-800 dark:text-slate-300 mb-2">Net Dollar Retention</div>
                  <div className="text-4xl font-bold text-[#C9A84C] mb-1" data-testid="text-ndr">142%</div>
                  <div className="text-xs text-gray-800">Target: &gt;120% (Best-in-class)</div>
                </CardContent>
              </Card>

              <Card className="border-2" data-testid="card-gross-margin">
                <CardContent className="pt-6">
                  <div className="text-sm text-gray-800 dark:text-slate-300 mb-2">Gross Margin</div>
                  <div className="text-4xl font-bold text-[#0A0F2E] mb-1" data-testid="text-gross-margin">87%</div>
                  <div className="text-xs text-gray-800">Target: &gt;80% (Premium SaaS)</div>
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
                <div className="mt-4 text-center text-sm text-gray-800 dark:text-slate-300">
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
                      <div className="text-sm text-gray-800 dark:text-slate-300">
                        Eliminated coordination delays, reduced strategic initiative failures
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3B82F6' }}></div>
                        <div className="font-semibold text-slate-900 dark:text-white">Time Recovery: $3.4M</div>
                      </div>
                      <div className="text-sm text-gray-800 dark:text-slate-300">
                        342 hours saved monthly, valued at executive time rates
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: '#8B5CF6' }}></div>
                        <div className="font-semibold text-slate-900 dark:text-white">Risk Mitigation: $1.8M</div>
                      </div>
                      <div className="text-sm text-gray-800 dark:text-slate-300">
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
        <section className="py-20 px-6 bg-gradient-to-br from-primary  text-gray-900">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" data-testid="heading-cta">
              Join Us in Creating a New Software Category
            </h2>
            <p className="text-xl mb-8 text-[#0A0F2E]" data-testid="text-cta-description">
              Execution OS is defining the Strategic Execution Operating System category—a $127B market opportunity with winner-take-most dynamics. Early investors gain exposure to category creation with defensible moats and exceptional unit economics.
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
                className="border-white text-gray-900 hover:bg-white/10"
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
