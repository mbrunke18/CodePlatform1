import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Link } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';
import ScenarioTemplateLibrary from '@/components/ScenarioTemplateLibrary';
import { useQuery } from '@tanstack/react-query';
import { 
  LayoutDashboard,
  Home,
  ArrowLeft,
  BarChart3, 
  AlertTriangle, 
  Target, 
  Brain, 
  PieChart,
  Users,
  Shield,
  Network,
  Zap,
  Command,
  BookOpen,
  Activity,
  TrendingUp,
  CheckCircle,
  Clock,
  Globe,
  MessageSquare,
  FileText,
  Settings,
  Eye,
  Play,
  Pause,
  Calendar,
  Mail,
  Phone,
  DollarSign
} from 'lucide-react';

export default function UnifiedEnterprisePlatform() {
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch organizations data with demo fallback
  const { data: organizations = [{
    id: '1',
    name: 'Global Manufacturing Corp',
    industry: 'Manufacturing',
    employees: 42000,
    regions: ['North America', 'Europe', 'Asia Pacific']
  }, {
    id: '2', 
    name: 'TechVentures International',
    industry: 'Technology',
    employees: 18500,
    regions: ['North America', 'Europe']
  }] } = useQuery({
    queryKey: ['/api/organizations'],
    enabled: false // Use demo data for presentations
  });

  // Real-time metrics
  const metrics = [
    { name: "Global Agility Score", value: "87.6%", change: "+2.4%", color: "text-[#2B8A6E]" },
    { name: "Playbook Readiness", value: "98.7%", change: "+0.8%", color: "text-[#C9A84C]" },
    { name: "Strategic Intelligence", value: "94.2%", change: "+1.6%", color: "text-[#0A0F2E]" },
    { name: "Innovation Pipeline", value: "91.4%", change: "+3.2%", color: "text-[#C9A84C]" }
  ];

  // AI Intelligence modules
  const aiModules = [
    { name: "Pulse Intelligence", description: "Real-time organizational health monitoring", status: "active", accuracy: 94.2 },
    { name: "Flux Adaptations", description: "Dynamic change management intelligence", status: "active", accuracy: 91.7 },
    { name: "Prism Insights", description: "Multi-dimensional strategic analysis", status: "active", accuracy: 96.1 },
    { name: "Echo Cultural Analytics", description: "Cultural intelligence assessment", status: "active", accuracy: 89.3 },
    { name: "Nova Innovations", description: "Innovation pipeline management", status: "active", accuracy: 92.8 }
  ];

  // Executive Playbooks (formerly Crisis Templates)
  const executivePlaybooks = [
    { name: "Supply Chain Disruption", severity: "high", activationTime: "15 minutes", stakeholders: 12, playbookId: "SCM-001" },
    { name: "Cybersecurity Incident", severity: "critical", activationTime: "5 minutes", stakeholders: 8, playbookId: "SEC-001" },
    { name: "Financial Liquidity Crisis", severity: "critical", activationTime: "10 minutes", stakeholders: 15, playbookId: "FIN-001" },
    { name: "Regulatory Compliance", severity: "medium", activationTime: "30 minutes", stakeholders: 6, playbookId: "REG-001" }
  ];

  // Executive metrics for C-Suite dashboard
  const executiveMetrics = {
    strategicAlignment: 87.6,
    operationalEfficiency: 94.2,
    financialPerformance: 91.4,
    innovationIndex: 89.7,
    riskManagement: 96.3
  };

  // AI Recommendations
  const aiRecommendations = [
    {
      id: 1,
      title: "Market Expansion Opportunity",
      description: "Southeast Asia markets showing 34% growth potential with low competition density",
      priority: "high",
      confidence: 94,
      impact: "$2.4M projected revenue",
      timeframe: "Q2-Q3 2026",
      mlModel: "Market Intelligence v2.1",
      dataPoints: 47392
    },
    {
      id: 2,
      title: "Supply Chain Optimization",
      description: "Alternative supplier network could reduce costs by 18% while improving delivery times",
      priority: "critical",
      confidence: 89,
      impact: "$1.8M cost savings",
      timeframe: "Immediate implementation",
      mlModel: "Supply Chain AI v3.0",
      dataPoints: 23847
    },
    {
      id: 3,
      title: "Talent Retention Strategy",
      description: "Predictive model indicates 23% turnover risk in key positions within 6 months",
      priority: "high",
      confidence: 91,
      impact: "$890K retention savings",
      timeframe: "Next 30 days",
      mlModel: "HR Analytics v1.7",
      dataPoints: 15683
    }
  ];

  // Strategic scenarios
  const strategicScenarios = [
    { name: "Global Market Expansion", status: "active", progress: 78, risk: "medium", roi: "+34%" },
    { name: "Digital Transformation", status: "active", progress: 92, risk: "low", roi: "+28%" },
    { name: "Sustainability Initiative", status: "planning", progress: 15, risk: "high", roi: "+19%" },
    { name: "M&A Integration", status: "active", progress: 65, risk: "medium", roi: "+42%" }
  ];

  // Live collaboration data
  const collaborationData = {
    activeUsers: 247,
    liveSessions: 18,
    globalTeams: {
      northAmerica: { status: "online", users: 89 },
      europe: { status: "online", users: 76 },
      asiaPacific: { status: "online", users: 82 }
    },
    recentActivity: [
      { user: "Chief Strategy Officer", action: "joined strategic planning session", time: "2 minutes ago" },
      { user: "VP Operations", action: "updated playbook execution protocol", time: "5 minutes ago" },
      { user: "Risk Director", action: "completed risk assessment", time: "8 minutes ago" }
    ]
  };

  return (
    <PageLayout>
      <div className="h-full bg-transparent p-3" data-testid="unified-platform">
        <div className="w-full max-w-none space-y-3 h-full flex flex-col">
          
          {/* Breadcrumb Navigation */}
          <div className="mb-2 flex-shrink-0">
            <div className="flex items-center gap-2 text-sm text-gray-800">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-gray-800 hover:text-white p-1 h-auto">
                  <Home className="h-4 w-4" />
                </Button>
              </Link>
              <span>/</span>
              <span>AI Intelligence</span>
              <span>/</span>
              <span className="text-gray-900">Intelligence Command Center</span>
            </div>
          </div>

          {/* Header */}
          <div className="bg-[#0A0F2E] text-white p-3 rounded-lg flex-shrink-0 relative overflow-hidden">
            <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 2px 2px, rgba(201,168,76,0.1) 1px, transparent 0)", backgroundSize: "24px 24px" }} />
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <LayoutDashboard className="h-10 w-10 text-[#C9A84C]" />
                <div>
                  <h1 className="text-2xl font-bold" data-testid="platform-title">
                    Execution OS Executive Command Center
                  </h1>
                  <p className="text-white/80">Where Strategy Meets Velocity™ - 12-Minute Execution Platform</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link to="/hybrid-demo">
                  <Button 
                    className="bg-[#C9A84C] hover:bg-[#DFC178] text-[#0A0F2E] font-bold shadow-lg hover:shadow-xl transition-all" 
                    data-testid="try-live-demo-btn"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Try Live Demo
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="outline" className="bg-white/5 hover:bg-white/10 text-white border-white/20" data-testid="back-to-dashboard">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Badge variant="outline" className="bg-[#C9A84C]/20 text-[#C9A84C] border-[#C9A84C]/30" data-testid="system-status">
                  <div className="w-2 h-2 bg-[#C9A84C] rounded-full mr-2 animate-pulse"></div>
                  ALL SYSTEMS OPERATIONAL
                </Badge>
              </div>
            </div>
          </div>

          {/* 4-Step IDEA Framework - Core Methodology */}
          <div className="grid grid-cols-4 gap-3 flex-shrink-0">
            <Card className="border-[#0A0F2E]/30 bg-white hover:border-[#0A0F2E]/50 transition-all shadow-none">
              <CardHeader className="p-3">
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-[#0A0F2E]" />
                  <CardTitle className="text-sm text-gray-900">1. IDENTIFY</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <p className="text-xs text-gray-800 mb-2">24/7 AI Intelligence</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-800">Pulse Active</span>
                    <Badge variant="outline" className="bg-[#2B8A6E]/10 text-[#2B8A6E] border-[#2B8A6E]/30 text-xs">94%</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-800">12 Signals</span>
                    <span className="text-[#0A0F2E] font-semibold">Monitoring</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#C9A84C]/30 bg-white hover:border-[#C9A84C]/50 transition-all shadow-none">
              <CardHeader className="p-3">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#C9A84C]" />
                  <CardTitle className="text-sm text-gray-900">2. DETECT</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <p className="text-xs text-gray-800 mb-2">Trigger Intelligence</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-800">Preparedness</span>
                    <Badge variant="outline" className="bg-[#2B8A6E]/10 text-[#2B8A6E] border-[#2B8A6E]/30 text-xs">98.7%</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-800">47 Playbooks</span>
                    <span className="text-[#C9A84C] font-semibold">Ready</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#2B8A6E]/30 bg-white hover:border-[#2B8A6E]/50 transition-all shadow-none">
              <CardHeader className="p-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-[#2B8A6E]" />
                  <CardTitle className="text-sm text-gray-900">3. EXECUTE</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <p className="text-xs text-gray-800 mb-2">12-Minute Coordination</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-800">Avg Speed</span>
                    <Badge variant="outline" className="bg-[#2B8A6E]/10 text-[#2B8A6E] border-[#2B8A6E]/30 text-xs">12min</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-800">vs Industry</span>
                    <span className="text-[#2B8A6E] font-semibold">360x Faster</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#C9A84C]/30 bg-white hover:border-[#C9A84C]/50 transition-all shadow-none">
              <CardHeader className="p-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[#C9A84C]" />
                  <CardTitle className="text-sm text-gray-900">4. ADVANCE</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <p className="text-xs text-gray-800 mb-2">Institutional Memory</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-800">Executions</span>
                    <Badge variant="outline" className="bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/30 text-xs">1,247</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-800">ROI Captured</span>
                    <span className="text-[#C9A84C] font-semibold">$144M</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col min-h-0">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 xl:grid-cols-10 gap-1 p-1 bg-[#F8F7F4] border border-[#E8E4DC] rounded-lg flex-shrink-0">
              <TabsTrigger value="overview" className="flex items-center gap-1 whitespace-nowrap px-2 py-1.5 text-xs data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white" data-testid="tab-overview">
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="crisis" className="flex items-center gap-1 whitespace-nowrap px-2 py-1.5 text-xs data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white" data-testid="tab-crisis">
                <AlertTriangle className="h-4 w-4" />
                Executive Playbooks
              </TabsTrigger>
              <TabsTrigger value="strategic" className="flex items-center gap-1 whitespace-nowrap px-2 py-1.5 text-xs data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white" data-testid="tab-strategic">
                <Target className="h-4 w-4" />
                Strategic Planning
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center gap-1 whitespace-nowrap px-2 py-1.5 text-xs data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white" data-testid="tab-templates">
                <BookOpen className="h-4 w-4" />
                Scenario Templates
              </TabsTrigger>
              <TabsTrigger value="ai-intelligence" className="flex items-center gap-1 whitespace-nowrap px-2 py-1.5 text-xs data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white" data-testid="tab-ai">
                <Brain className="h-4 w-4" />
                AI Intelligence
              </TabsTrigger>
              <TabsTrigger value="collaboration" className="flex items-center gap-1 whitespace-nowrap px-2 py-1.5 text-xs data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white" data-testid="tab-collaboration">
                <Users className="h-4 w-4" />
                Collaboration
              </TabsTrigger>
              <TabsTrigger value="audit" className="flex items-center gap-1 whitespace-nowrap px-2 py-1.5 text-xs data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white" data-testid="tab-audit">
                <Shield className="h-4 w-4" />
                Audit & Compliance
                <Badge variant="outline" className="ml-1 text-xs px-1 py-0 h-4 bg-[#C9A84C]/20 text-[#C9A84C] border-[#C9A84C]/30">V3</Badge>
              </TabsTrigger>
              <TabsTrigger value="integrations" className="flex items-center gap-1 whitespace-nowrap px-2 py-1.5 text-xs data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white" data-testid="tab-integrations">
                <Network className="h-4 w-4" />
                Integrations
                <Badge variant="outline" className="ml-1 text-xs px-1 py-0 h-4 bg-[#C9A84C]/20 text-[#C9A84C] border-[#C9A84C]/30">V3</Badge>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-1 whitespace-nowrap px-2 py-1.5 text-xs data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white" data-testid="tab-analytics">
                <PieChart className="h-4 w-4" />
                Advanced Analytics
                <Badge variant="outline" className="ml-1 text-xs px-1 py-0 h-4 bg-[#C9A84C]/20 text-[#C9A84C] border-[#C9A84C]/30">V2</Badge>
              </TabsTrigger>
              <TabsTrigger value="scenario-triggers" className="flex items-center gap-1 whitespace-nowrap px-2 py-1.5 text-xs data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white" data-testid="tab-triggers">
                <Zap className="h-4 w-4" />
                Scenario Triggers
              </TabsTrigger>
              <TabsTrigger value="c-suite-copilot" className="flex items-center gap-1 whitespace-nowrap px-2 py-1.5 text-xs data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white" data-testid="tab-copilot">
                <Command className="h-4 w-4" />
                C-Suite Co-pilot
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="flex-1 overflow-y-auto p-3 space-y-3" data-testid="overview-content">
              
              {/* V1 Core Loop Banner */}
              <div className="bg-[#0A0F2E] text-white rounded-lg border-2 border-[#C9A84C]/30 p-4 mb-4 relative overflow-hidden">
                <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 2px 2px, rgba(201,168,76,0.05) 1px, transparent 0)", backgroundSize: "32px 32px" }} />
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold mb-2">Identify → Detect → Execute → Advance</h2>
                    <p className="text-sm text-white/70">
                      Build playbooks from 80+ templates. AI watches your triggers 24/7. Execute in 12 minutes when conditions hit.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link to="/scenarios">
                      <Button variant="outline" size="sm" className="bg-white/5 border-white/20 text-white hover:bg-white/10" data-testid="button-browse-templates">Browse Templates</Button>
                    </Link>
                    <Link to="/what-if-analyzer">
                      <Button size="sm" className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178]" data-testid="button-practice-scenarios">Practice Scenarios</Button>
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Real-time Metrics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                {metrics.map((metric, index) => (
                  <Card key={index} className="border-gray-200 bg-white backdrop-blur-sm" data-testid={`metric-${metric.name.replace(/\s+/g, '-').toLowerCase()}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="p-2 rounded-lg bg-[#0A0F2E]/10">
                          <BarChart3 className="h-5 w-5 text-[#0A0F2E]" />
                        </div>
                        <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                          EXCELLENT
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-800">{metric.name}</span>
                          <span className={`text-sm font-bold ${metric.color}`}>
                            {metric.change}
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                        <Progress value={75} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Decision Velocity - Execution Infrastructure */}
              <Card className="border-[#2B8A6E]/50 bg-gradient-to-br   backdrop-blur-sm mb-4">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Zap className="h-6 w-6 text-[#2B8A6E]" />
                      Decision Velocity Dashboard
                      <Badge variant="outline" className="bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/50 ml-2">
                        INFRASTRUCTURE MODE
                      </Badge>
                    </CardTitle>
                    <Badge variant="outline" className="bg-[#0A0F2E]/20 text-[#0A0F2E] border-[#0A0F2E]/50">
                      170 PLAYBOOKS READY
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-800 mt-2">
                    Execution infrastructure in action: From detection to coordinated execution in 12 minutes. Pre-defined governance for high-stakes situations.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Average Decision Time */}
                    <div className="p-4 bg-gray-50 rounded-lg border border-[#2B8A6E]/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-5 w-5 text-[#2B8A6E]" />
                        <span className="text-sm font-medium text-gray-800">Avg. Decision Time</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900">12</span>
                        <span className="text-lg text-gray-800">minutes</span>
                      </div>
                      <div className="mt-2 flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-[#2B8A6E]" />
                        <span className="text-xs text-[#2B8A6E]">85% faster than industry avg (72 hrs)</span>
                      </div>
                    </div>

                    {/* Playbooks Executed */}
                    <div className="p-4 bg-gray-50 rounded-lg border border-[#0A0F2E]/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-5 w-5 text-[#0A0F2E]" />
                        <span className="text-sm font-medium text-gray-800">Plays Executed (30d)</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900">47</span>
                        <span className="text-lg text-gray-800">playbooks</span>
                      </div>
                      <div className="mt-2 flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-[#0A0F2E]" />
                        <span className="text-xs text-[#0A0F2E]">94% execution success rate</span>
                      </div>
                    </div>

                    {/* Value Created */}
                    <div className="p-4 bg-gray-50 rounded-lg border border-[#C9A84C]/30">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-5 w-5 text-[#C9A84C]" />
                        <span className="text-sm font-medium text-gray-800">Value Created (30d)</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900">$8.2M</span>
                        <span className="text-lg text-gray-800">saved</span>
                      </div>
                      <div className="mt-2 flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-[#C9A84C]" />
                        <span className="text-xs text-[#C9A84C]">Through rapid decision execution</span>
                      </div>
                    </div>
                  </div>

                  {/* Most Used Playbooks */}
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Activity className="h-4 w-4 text-gray-800" />
                      Top 5 Playbooks (This Month)
                    </h4>
                    <div className="space-y-2">
                      {[
                        { name: "Supply Chain Disruption", uses: 12, avgTime: "14 min", value: "$3.2M" },
                        { name: "Competitive Price War Response", uses: 8, avgTime: "9 min", value: "$2.1M" },
                        { name: "Cybersecurity Incident", uses: 6, avgTime: "7 min", value: "$1.4M" },
                        { name: "Executive Departure", uses: 5, avgTime: "18 min", value: "$890K" },
                        { name: "Market Opportunity", uses: 4, avgTime: "11 min", value: "$780K" }
                      ].map((playbook, idx) => (
                        <div key={idx} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-xs w-6 h-6 flex items-center justify-center p-0">
                              {idx + 1}
                            </Badge>
                            <span className="text-sm text-gray-900 font-medium">{playbook.name}</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs">
                            <span className="text-gray-800">{playbook.uses} uses</span>
                            <span className="text-[#2B8A6E]">{playbook.avgTime}</span>
                            <span className="text-[#C9A84C] font-semibold">{playbook.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Strategic Scenarios Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <Card className="border-gray-200 bg-white backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Target className="h-5 w-5 text-[#0A0F2E]" />
                      Active Strategic Scenarios
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {strategicScenarios.map((scenario, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg border border-slate-600">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900">{scenario.name}</h4>
                          <div className="flex gap-2">
                            <Badge variant={scenario.status === 'active' ? 'default' : 'outline'}>
                              {scenario.status.toUpperCase()}
                            </Badge>
                            <Badge variant={scenario.risk === 'low' ? 'default' : scenario.risk === 'medium' ? 'secondary' : 'destructive'}>
                              {scenario.risk.toUpperCase()} RISK
                            </Badge>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-800">Progress:</span>
                            <span className="text-[#0A0F2E] font-bold">{scenario.progress}%</span>
                          </div>
                          <Progress value={scenario.progress} className="h-2" />
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-800">Projected ROI:</span>
                            <span className="text-[#2B8A6E] font-bold">{scenario.roi}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Brain className="h-5 w-5 text-[#C9A84C]" />
                      AI Strategic Recommendations
                      <Badge variant="outline" className="ml-2">Powered by ML</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {aiRecommendations.slice(0, 2).map((rec) => (
                      <Card key={rec.id} className="border-l-4 border-l-[#0A0F2E] bg-gray-50">
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant={rec.priority === 'critical' ? 'destructive' : rec.priority === 'high' ? 'default' : 'secondary'}>
                              {rec.priority.toUpperCase()}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Brain className="h-4 w-4 text-[#C9A84C]" />
                              <span className="text-xs text-gray-800">{rec.confidence}% confidence</span>
                            </div>
                          </div>
                          <h4 className="font-semibold text-sm mb-2 text-gray-900">{rec.title}</h4>
                          <p className="text-xs text-gray-800 mb-3">{rec.description}</p>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-[#2B8A6E]">{rec.impact}</span>
                            </div>
                            <div className="text-xs text-gray-800 dark:text-slate-200">
                              {rec.timeframe} • {rec.dataPoints.toLocaleString()} data points
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Executive Performance Dashboard */}
              <Card className="bg-gradient-to-r from-[#0A0F2E] to-[#141B45] text-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <TrendingUp className="h-6 w-6" />
                    Executive Performance Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold">{executiveMetrics.strategicAlignment}%</p>
                      <p className="text-sm opacity-90">Strategic Alignment</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold">{executiveMetrics.operationalEfficiency}%</p>
                      <p className="text-sm opacity-90">Operational Efficiency</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold">{executiveMetrics.financialPerformance}%</p>
                      <p className="text-sm opacity-90">Financial Performance</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold">{executiveMetrics.innovationIndex}%</p>
                      <p className="text-sm opacity-90">Innovation Index</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold">{executiveMetrics.riskManagement}%</p>
                      <p className="text-sm opacity-90">Risk Management</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="crisis" className="flex-1 overflow-y-auto p-3 space-y-3" data-testid="crisis-content">
              {/* Executive Playbook Control Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200">
                      <AlertTriangle className="h-5 w-5" />
                      Emergency Response Center
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-gray-900">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Execute Playbook
                    </Button>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-white dark:bg-red-900 rounded">
                        <div className="text-2xl font-bold text-red-700">24/7</div>
                        <div className="text-sm text-red-800 dark:text-red-200">Command Center</div>
                      </div>
                      <div className="text-center p-3 bg-white dark:bg-red-900 rounded">
                        <div className="text-2xl font-bold text-red-700">15+</div>
                        <div className="text-sm text-red-800 dark:text-red-200">Response Templates</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Executive Playbooks Library</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {executivePlaybooks.map((playbook, index) => (
                      <Link key={index} href="/comprehensive-scenarios">
                        <div className="p-3 bg-gray-50 rounded-lg border border-slate-600 hover:border-[#0A0F2E] cursor-pointer transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="text-xs text-gray-800 font-mono">{playbook.playbookId}</span>
                              <h4 className="font-semibold text-gray-900">{playbook.name}</h4>
                            </div>
                            <Badge variant={playbook.severity === 'critical' ? 'destructive' : playbook.severity === 'high' ? 'default' : 'secondary'}>
                              {playbook.severity.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-800 space-y-1">
                            <div>Execution Time: {playbook.activationTime}</div>
                            <div>Team Size: {playbook.stakeholders}</div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="strategic" className="flex-1 overflow-y-auto p-3 space-y-3" data-testid="strategic-content">
              {/* Strategic Planning Command Center */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <Card className="border-gray-200 bg-white backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Target className="h-5 w-5 text-[#0A0F2E]" />
                      Strategic Initiative Portfolio
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {strategicScenarios.map((scenario, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg border border-slate-600">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900 text-sm">{scenario.name}</h4>
                          <div className="flex gap-1">
                            <Badge variant={scenario.status === 'active' ? 'default' : 'outline'} className="text-xs">
                              {scenario.status.toUpperCase()}
                            </Badge>
                            <Badge variant={scenario.risk === 'low' ? 'default' : scenario.risk === 'medium' ? 'secondary' : 'destructive'} className="text-xs">
                              {scenario.risk.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-800">Progress:</span>
                            <span className="text-[#0A0F2E] font-bold">{scenario.progress}%</span>
                          </div>
                          <Progress value={scenario.progress} className="h-1" />
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-800">Expected ROI:</span>
                            <span className="text-[#2B8A6E] font-bold">{scenario.roi}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <TrendingUp className="h-5 w-5 text-[#2B8A6E]" />
                      Enterprise Resource Allocation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="text-xl font-bold text-[#0A0F2E]">$4.2M</div>
                        <div className="text-xs text-gray-800">Active Budget</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="text-xl font-bold text-[#2B8A6E]">189</div>
                        <div className="text-xs text-gray-800">Team Members</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-800">Budget Utilization</span>
                          <span className="text-[#0A0F2E] font-bold">73%</span>
                        </div>
                        <Progress value={73} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-800">Resource Efficiency</span>
                          <span className="text-[#2B8A6E] font-bold">94%</span>
                        </div>
                        <Progress value={94} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-800">Timeline Adherence</span>
                          <span className="text-orange-400 font-bold">82%</span>
                        </div>
                        <Progress value={82} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Strategic Planning Tools */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="border-gray-200 bg-white backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Calendar className="h-5 w-5 text-[#C9A84C]" />
                      Strategic Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="p-2 bg-gray-50 rounded text-sm">
                        <div className="text-gray-900 font-medium">Q1 2026 Strategy Review</div>
                        <div className="text-xs text-gray-800 dark:text-slate-200">Due in 14 days • High Priority</div>
                      </div>
                      <div className="p-2 bg-gray-50 rounded text-sm">
                        <div className="text-gray-900 font-medium">Market Expansion Phase 2</div>
                        <div className="text-xs text-gray-800 dark:text-slate-200">Due in 28 days • Medium Priority</div>
                      </div>
                      <div className="p-2 bg-gray-50 rounded text-sm">
                        <div className="text-gray-900 font-medium">Innovation Lab Launch</div>
                        <div className="text-xs text-gray-800 dark:text-slate-200">Due in 45 days • High Priority</div>
                      </div>
                    </div>
                    <Button className="w-full bg-[#0A0F2E] hover:bg-[#0A0F2E] text-white text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      View Full Timeline
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Users className="h-5 w-5 text-[#0A0F2E]" />
                      Stakeholder Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-800 text-sm">Executive Sponsors</span>
                        <span className="text-[#0A0F2E] font-bold">12</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-800 text-sm">Department Heads</span>
                        <span className="text-[#2B8A6E] font-bold">34</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-800 text-sm">Key Contributors</span>
                        <span className="text-[#C9A84C] font-bold">167</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-800 text-sm">Engagement Score</span>
                        <span className="text-orange-400 font-bold">89%</span>
                      </div>
                    </div>
                    <Button className="w-full bg-[#0A0F2E] hover:bg-[#0A0F2E] text-white text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      Manage Stakeholders
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <BarChart3 className="h-5 w-5 text-[#2B8A6E]" />
                      Success Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-800 dark:text-slate-200">Strategic Alignment</span>
                          <span className="text-[#2B8A6E] font-bold">91%</span>
                        </div>
                        <Progress value={91} className="h-1" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-800 dark:text-slate-200">Execution Quality</span>
                          <span className="text-[#0A0F2E] font-bold">87%</span>
                        </div>
                        <Progress value={87} className="h-1" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-800 dark:text-slate-200">Value Delivery</span>
                          <span className="text-[#C9A84C] font-bold">94%</span>
                        </div>
                        <Progress value={94} className="h-1" />
                      </div>
                    </div>
                    <Button className="w-full bg-[#2B8A6E] hover:bg-[#237A5F] text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="templates" className="flex-1 overflow-y-auto p-3 space-y-3" data-testid="templates-content">
              <ScenarioTemplateLibrary organizationId={organizations && Array.isArray(organizations) && organizations.length > 0 ? organizations[0].id : "default-org"} />
            </TabsContent>

            <TabsContent value="ai-intelligence" className="flex-1 overflow-y-auto p-3 space-y-3" data-testid="ai-content">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {aiModules.map((module, index) => (
                  <Card key={index} className="border-gray-200 bg-white backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-gray-900">
                        <Brain className="h-5 w-5 text-[#C9A84C]" />
                        {module.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-gray-800 dark:text-slate-200 text-sm">{module.description}</p>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/30">
                          {module.status.toUpperCase()}
                        </Badge>
                        <span className="text-gray-900 font-bold">{module.accuracy}%</span>
                      </div>
                      <Progress value={module.accuracy} className="h-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="collaboration" className="flex-1 overflow-y-auto p-3 space-y-3" data-testid="collaboration-content">
              {/* Real-time Collaboration Hub */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                <Card className="border-gray-200 bg-white backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Users className="h-5 w-5 text-[#0A0F2E]" />
                      Real-Time Collaboration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-gray-800 dark:text-slate-200">
                      <div className="flex justify-between mb-2">
                        <span>Active Users:</span>
                        <span className="text-[#2B8A6E] font-bold">{collaborationData.activeUsers}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Live Sessions:</span>
                        <span className="text-[#0A0F2E] font-bold">{collaborationData.liveSessions}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <Button className="bg-[#0A0F2E] hover:bg-[#0A0F2E] text-white text-xs">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          War Room
                        </Button>
                        <Button variant="outline" className="text-xs border-gray-600">
                          <Eye className="h-3 w-3 mr-1" />
                          Monitor
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Globe className="h-5 w-5 text-[#2B8A6E]" />
                      Global Teams
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-gray-800 dark:text-slate-200 text-sm space-y-2">
                      <div className="flex justify-between items-center">
                        <span>North America:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[#2B8A6E]">●</span>
                          <span className="text-gray-900 font-bold">{collaborationData.globalTeams.northAmerica.users}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Europe:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[#2B8A6E]">●</span>
                          <span className="text-gray-900 font-bold">{collaborationData.globalTeams.europe.users}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Asia Pacific:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[#2B8A6E]">●</span>
                          <span className="text-gray-900 font-bold">{collaborationData.globalTeams.asiaPacific.users}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Activity className="h-5 w-5 text-[#C9A84C]" />
                      Live Activity Feed
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {collaborationData.recentActivity.map((activity, index) => (
                      <div key={index} className="text-sm">
                        <div className="text-gray-900 font-medium">{activity.user}</div>
                        <div className="text-gray-800">{activity.action}</div>
                        <div className="text-xs text-gray-800 dark:text-slate-200">{activity.time}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Communication Tools */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="border-gray-200 bg-white backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <MessageSquare className="h-5 w-5 text-[#0A0F2E]" />
                      Executive Communication Center
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Button className="bg-red-600 hover:bg-red-700">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Emergency Broadcast
                      </Button>
                      <Button className="bg-[#0A0F2E] hover:bg-[#0A0F2E] text-white">
                        <Users className="h-4 w-4 mr-2" />
                        Team Assembly
                      </Button>
                      <Button className="bg-[#2B8A6E] hover:bg-[#237A5F]">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Status Update
                      </Button>
                      <Button className="bg-[#0A0F2E] hover:bg-[#0A0F2E] text-white">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Meeting
                      </Button>
                    </div>
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-800">
                        <div className="flex justify-between mb-1">
                          <span>Messages Today:</span>
                          <span className="text-[#0A0F2E] font-bold">147</span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span>Urgent Alerts:</span>
                          <span className="text-red-400 font-bold">3</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Response Rate:</span>
                          <span className="text-[#2B8A6E] font-bold">94%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Network className="h-5 w-5 text-[#C9A84C]" />
                      Cross-Functional Integration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-gray-800">Operations Team</span>
                        <Badge variant="outline" className="bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/30">SYNC</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-gray-800">Finance Department</span>
                        <Badge variant="outline" className="bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/30">SYNC</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-gray-800">Legal & Compliance</span>
                        <Badge variant="outline" className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">PENDING</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-gray-800">Technology Team</span>
                        <Badge variant="outline" className="bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/30">SYNC</Badge>
                      </div>
                    </div>
                    <Button className="w-full bg-[#C9A84C] hover:bg-[#DFC178] text-[#0A0F2E]">
                      <Network className="h-4 w-4 mr-2" />
                      Initiate Cross-Sync
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="audit" className="flex-1 overflow-y-auto p-3 space-y-3" data-testid="audit-content">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="border-gray-200 bg-white backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Shield className="h-5 w-5 text-red-500" />
                      Compliance Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#2B8A6E]">98.7%</div>
                      <div className="text-gray-800">Compliance Score</div>
                      <Progress value={98.7} className="h-2 mt-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <FileText className="h-5 w-5 text-[#0A0F2E]" />
                      Audit Logs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-800 dark:text-slate-200 text-sm space-y-2">
                      <div>Last Audit: 2 days ago</div>
                      <div>Next Review: 28 days</div>
                      <div>Active Findings: 0</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <CheckCircle className="h-5 w-5 text-[#2B8A6E]" />
                      Certifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-800 text-sm space-y-1">
                      <div>SOX Compliance ✓</div>
                      <div>ISO 27001 ✓</div>
                      <div>GDPR Ready ✓</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="integrations" className="flex-1 overflow-y-auto p-3 space-y-3" data-testid="integrations-content">
              {/* Enterprise Integration Hub */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <Card className="border-gray-200 bg-white backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Network className="h-5 w-5 text-[#0A0F2E]" />
                      Enterprise System Integrations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-gray-800">SAP ERP</span>
                        <Badge variant="outline" className="bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/30">ACTIVE</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-gray-800">Salesforce CRM</span>
                        <Badge variant="outline" className="bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/30">ACTIVE</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-gray-800">Microsoft Dynamics</span>
                        <Badge variant="outline" className="bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/30">ACTIVE</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-gray-800">Oracle Database</span>
                        <Badge variant="outline" className="bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/30">ACTIVE</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-gray-800">Tableau Analytics</span>
                        <Badge variant="outline" className="bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/30">ACTIVE</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-gray-800">Slack Workspace</span>
                        <Badge variant="outline" className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">SYNC</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Settings className="h-5 w-5 text-[#C9A84C]" />
                      API & Data Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="text-xl font-bold text-[#0A0F2E]">47</div>
                        <div className="text-xs text-gray-800">Active APIs</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="text-xl font-bold text-[#2B8A6E]">99.97%</div>
                        <div className="text-xs text-gray-800">Uptime SLA</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-800">Data Flow Rate:</span>
                        <span className="text-[#0A0F2E] font-bold">2.4TB/hour</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-800">API Calls/min:</span>
                        <span className="text-[#2B8A6E] font-bold">34,672</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-800">Error Rate:</span>
                        <span className="text-[#0A0F2E] font-bold">0.03%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-800">Data Quality Score:</span>
                        <span className="text-[#C9A84C] font-bold">96.8%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Integration Tools */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="border-gray-200 bg-white backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Zap className="h-5 w-5 text-[#C9A84C]" />
                      Workflow Automation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="p-2 bg-gray-50 rounded text-sm">
                        <div className="text-gray-900 font-medium">Auto-sync Financial Data</div>
                        <div className="text-xs text-gray-800 dark:text-slate-200">Every 15 minutes</div>
                      </div>
                      <div className="p-2 bg-gray-50 rounded text-sm">
                        <div className="text-gray-900 font-medium">Customer Data Pipeline</div>
                        <div className="text-xs text-gray-800 dark:text-slate-200">Real-time</div>
                      </div>
                      <div className="p-2 bg-gray-50 rounded text-sm">
                        <div className="text-gray-900 font-medium">Inventory Updates</div>
                        <div className="text-xs text-gray-800 dark:text-slate-200">Hourly</div>
                      </div>
                    </div>
                    <Button className="w-full bg-[#C9A84C] hover:bg-[#DFC178] text-[#0A0F2E] text-xs">
                      <Zap className="h-3 w-3 mr-1" />
                      Manage Workflows
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Shield className="h-5 w-5 text-red-600" />
                      Security & Compliance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-800 text-sm">OAuth 2.0 Auth</span>
                        <CheckCircle className="h-4 w-4 text-[#2B8A6E]" />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-800 text-sm">End-to-End Encryption</span>
                        <CheckCircle className="h-4 w-4 text-[#2B8A6E]" />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-800 text-sm">Data Masking</span>
                        <CheckCircle className="h-4 w-4 text-[#2B8A6E]" />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-800 text-sm">Audit Logging</span>
                        <CheckCircle className="h-4 w-4 text-[#2B8A6E]" />
                      </div>
                    </div>
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      Security Settings
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Activity className="h-5 w-5 text-[#2B8A6E]" />
                      Real-time Monitoring
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-800">System Load</span>
                          <span className="text-[#0A0F2E] font-bold">67%</span>
                        </div>
                        <Progress value={67} className="h-1" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-800">Network Latency</span>
                          <span className="text-[#2B8A6E] font-bold">12ms</span>
                        </div>
                        <Progress value={88} className="h-1" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-800">Data Sync Status</span>
                          <span className="text-[#C9A84C] font-bold">98%</span>
                        </div>
                        <Progress value={98} className="h-1" />
                      </div>
                    </div>
                    <Button className="w-full bg-[#2B8A6E] hover:bg-[#237A5F] text-xs">
                      <Activity className="h-3 w-3 mr-1" />
                      View Dashboard
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="flex-1 overflow-y-auto p-3 space-y-3" data-testid="analytics-content">
              {/* Advanced Analytics Control Center */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <Card className="border-gray-200 bg-white backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <PieChart className="h-5 w-5 text-[#2B8A6E]" />
                      Predictive Analytics Engine
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="text-xl font-bold text-[#2B8A6E]">94.7%</div>
                        <div className="text-xs text-gray-800">Prediction Accuracy</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="text-xl font-bold text-[#0A0F2E]">2.4M</div>
                        <div className="text-xs text-gray-800">Data Points</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-800">Market Forecasting:</span>
                        <span className="text-[#2B8A6E] font-bold">96.2%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-800">Risk Prediction:</span>
                        <span className="text-[#0A0F2E] font-bold">93.8%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-800">Revenue Projection:</span>
                        <span className="text-[#C9A84C] font-bold">92.1%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-800">Customer Behavior:</span>
                        <span className="text-[#0A0F2E] font-bold">89.6%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <BarChart3 className="h-5 w-5 text-[#0A0F2E]" />
                      Business Intelligence Hub
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="text-xl font-bold text-[#0A0F2E]">67</div>
                        <div className="text-xs text-gray-800">Active Dashboards</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="text-xl font-bold text-[#2B8A6E]">34</div>
                        <div className="text-xs text-gray-800">Data Sources</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-800">Real-time Feeds:</span>
                        <span className="text-[#2B8A6E] font-bold">18 Active</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-800">Data Processing:</span>
                        <span className="text-[#0A0F2E] font-bold">4.7TB/day</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-800">Query Performance:</span>
                        <span className="text-[#C9A84C] font-bold">0.3s avg</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-800">Data Freshness:</span>
                        <span className="text-[#2B8A6E] font-bold">Real-time</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Analytics Modules */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                <Card className="border-gray-200 bg-white backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <TrendingUp className="h-5 w-5 text-[#C9A84C]" />
                      Market Intelligence
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="p-2 bg-gray-50 rounded text-sm">
                        <div className="text-gray-900 font-medium">Competitor Analysis</div>
                        <div className="text-xs text-gray-800 dark:text-slate-200">Updated 2 hours ago</div>
                      </div>
                      <div className="p-2 bg-gray-50 rounded text-sm">
                        <div className="text-gray-900 font-medium">Market Trends</div>
                        <div className="text-xs text-gray-800 dark:text-slate-200">Live monitoring</div>
                      </div>
                      <div className="p-2 bg-gray-50 rounded text-sm">
                        <div className="text-gray-900 font-medium">Industry Benchmarks</div>
                        <div className="text-xs text-gray-800 dark:text-slate-200">Daily updates</div>
                      </div>
                    </div>
                    <Button className="w-full bg-[#0A0F2E] hover:bg-[#0A0F2E] text-white text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      View Analysis
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Users className="h-5 w-5 text-[#0A0F2E]" />
                      Customer Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-800">Customer Satisfaction</span>
                          <span className="text-[#2B8A6E] font-bold">94.8%</span>
                        </div>
                        <Progress value={94.8} className="h-1" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-800">Retention Rate</span>
                          <span className="text-[#0A0F2E] font-bold">87.3%</span>
                        </div>
                        <Progress value={87.3} className="h-1" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-800">Churn Risk</span>
                          <span className="text-orange-400 font-bold">12.7%</span>
                        </div>
                        <Progress value={12.7} className="h-1" />
                      </div>
                    </div>
                    <Button className="w-full bg-[#0A0F2E] hover:bg-[#0A0F2E] text-white text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      Customer Insights
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <DollarSign className="h-5 w-5 text-[#2B8A6E]" />
                      Financial Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-800">Revenue Growth:</span>
                        <span className="text-[#2B8A6E] font-bold">+18.7%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-800">Profit Margin:</span>
                        <span className="text-[#0A0F2E] font-bold">23.4%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-800">Cost Efficiency:</span>
                        <span className="text-[#C9A84C] font-bold">+12.1%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-800">ROI:</span>
                        <span className="text-orange-400 font-bold">267%</span>
                      </div>
                    </div>
                    <Button className="w-full bg-[#2B8A6E] hover:bg-[#237A5F] text-xs">
                      <DollarSign className="h-3 w-3 mr-1" />
                      Financial Reports
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Advanced Analytics Tools */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="border-gray-200 bg-white backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Brain className="h-5 w-5 text-[#C9A84C]" />
                      Machine Learning Models
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-900 font-medium text-sm">Revenue Forecasting Model</span>
                          <Badge variant="outline" className="bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/30 text-xs">ACTIVE</Badge>
                        </div>
                        <div className="text-xs text-gray-800 dark:text-slate-200">Accuracy: 96.2% • Last trained: 2 days ago</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-900 font-medium text-sm">Customer Churn Prediction</span>
                          <Badge variant="outline" className="bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/30 text-xs">ACTIVE</Badge>
                        </div>
                        <div className="text-xs text-gray-800 dark:text-slate-200">Accuracy: 89.7% • Last trained: 1 day ago</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-900 font-medium text-sm">Market Risk Assessment</span>
                          <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">TRAINING</Badge>
                        </div>
                        <div className="text-xs text-gray-800 dark:text-slate-200">Accuracy: 93.4% • Training in progress</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Activity className="h-5 w-5 text-[#0A0F2E]" />
                      Real-time Analytics Feed
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      <div className="text-xs text-gray-800 p-2 bg-gray-50 rounded">
                        <div className="text-gray-900 font-medium">Revenue spike detected</div>
                        <div className="text-gray-800 dark:text-slate-200">+23% above forecast • 2 minutes ago</div>
                      </div>
                      <div className="text-xs text-gray-800 p-2 bg-gray-50 rounded">
                        <div className="text-gray-900 font-medium">Customer engagement surge</div>
                        <div className="text-gray-800 dark:text-slate-200">Mobile app activity +45% • 5 minutes ago</div>
                      </div>
                      <div className="text-xs text-gray-800 p-2 bg-gray-50 rounded">
                        <div className="text-gray-900 font-medium">Market trend shift identified</div>
                        <div className="text-gray-800 dark:text-slate-200">Tech sector momentum +12% • 8 minutes ago</div>
                      </div>
                      <div className="text-xs text-gray-800 p-2 bg-gray-50 rounded">
                        <div className="text-gray-900 font-medium">Cost optimization opportunity</div>
                        <div className="text-gray-800 dark:text-slate-200">Supply chain efficiency +7% • 12 minutes ago</div>
                      </div>
                    </div>
                    <Button className="w-full bg-[#0A0F2E] hover:bg-[#0A0F2E] text-white text-xs">
                      <Activity className="h-3 w-3 mr-1" />
                      View All Alerts
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="scenario-triggers" className="flex-1 overflow-y-auto p-3 space-y-3" data-testid="scenario-triggers-content">
              {/* Enterprise Trigger Management System */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <Card className="border-gray-200 bg-white backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      Intelligent Trigger Engine
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="text-xl font-bold text-yellow-400">47</div>
                        <div className="text-xs text-gray-800">Active Triggers</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="text-xl font-bold text-[#2B8A6E]">12</div>
                        <div className="text-xs text-gray-800">Triggered Today</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-800">Success Rate:</span>
                        <span className="text-[#2B8A6E] font-bold">99.8%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-800">Avg Response Time:</span>
                        <span className="text-[#0A0F2E] font-bold">147ms</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-800">False Positives:</span>
                        <span className="text-orange-400 font-bold">0.2%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Activity className="h-5 w-5 text-[#0A0F2E]" />
                      Real-time Trigger Dashboard
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-900 font-medium text-sm">Market Volatility Alert</span>
                          <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">ACTIVE</Badge>
                        </div>
                        <div className="text-xs text-gray-800 dark:text-slate-200">Threshold: &gt;15% change • Last trigger: 2 hours ago</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-900 font-medium text-sm">Revenue Target Monitor</span>
                          <Badge variant="outline" className="bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/30 text-xs">ACTIVE</Badge>
                        </div>
                        <div className="text-xs text-gray-800 dark:text-slate-200">Threshold: 95% of monthly target • Status: On track</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-900 font-medium text-sm">Customer Churn Risk</span>
                          <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">MONITORING</Badge>
                        </div>
                        <div className="text-xs text-gray-800 dark:text-slate-200">ML Model confidence: 94% • Risk threshold: &gt;20%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Trigger Categories */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                <Card className="border-gray-200 bg-white backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <DollarSign className="h-5 w-5 text-[#2B8A6E]" />
                      Financial Triggers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="p-2 bg-gray-50 rounded text-sm">
                        <div className="text-gray-900 font-medium">Revenue Threshold Alert</div>
                        <div className="text-xs text-gray-800 dark:text-slate-200">Trigger when below 90% of target</div>
                      </div>
                      <div className="p-2 bg-gray-50 rounded text-sm">
                        <div className="text-gray-900 font-medium">Cash Flow Warning</div>
                        <div className="text-xs text-gray-800 dark:text-slate-200">Monitor liquidity ratios</div>
                      </div>
                      <div className="p-2 bg-gray-50 rounded text-sm">
                        <div className="text-gray-900 font-medium">Cost Overrun Detection</div>
                        <div className="text-xs text-gray-800 dark:text-slate-200">Budget variance &gt;15%</div>
                      </div>
                    </div>
                    <Button className="w-full bg-[#2B8A6E] hover:bg-[#237A5F] text-xs">
                      <DollarSign className="h-3 w-3 mr-1" />
                      Manage Financial Triggers
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      Operational Triggers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="p-2 bg-gray-50 rounded text-sm">
                        <div className="text-gray-900 font-medium">System Performance</div>
                        <div className="text-xs text-gray-800 dark:text-slate-200">Response time &gt;2s threshold</div>
                      </div>
                      <div className="p-2 bg-gray-50 rounded text-sm">
                        <div className="text-gray-900 font-medium">Supply Chain Disruption</div>
                        <div className="text-xs text-gray-800 dark:text-slate-200">Vendor delivery delays</div>
                      </div>
                      <div className="p-2 bg-gray-50 rounded text-sm">
                        <div className="text-gray-900 font-medium">Quality Control Alert</div>
                        <div className="text-xs text-gray-800 dark:text-slate-200">Defect rate &gt;3%</div>
                      </div>
                    </div>
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-xs">
                      <Settings className="h-3 w-3 mr-1" />
                      Configure Operations
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Target className="h-5 w-5 text-[#0A0F2E]" />
                      Strategic Triggers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="p-2 bg-gray-50 rounded text-sm">
                        <div className="text-gray-900 font-medium">Market Share Changes</div>
                        <div className="text-xs text-gray-800 dark:text-slate-200">Competitor activity detection</div>
                      </div>
                      <div className="p-2 bg-gray-50 rounded text-sm">
                        <div className="text-gray-900 font-medium">Customer Sentiment</div>
                        <div className="text-xs text-gray-800 dark:text-slate-200">NPS score below 7.0</div>
                      </div>
                      <div className="p-2 bg-gray-50 rounded text-sm">
                        <div className="text-gray-900 font-medium">Innovation Opportunity</div>
                        <div className="text-xs text-gray-800 dark:text-slate-200">Technology trend analysis</div>
                      </div>
                    </div>
                    <Button className="w-full bg-[#0A0F2E] hover:bg-[#0A0F2E] text-white text-xs">
                      <Target className="h-3 w-3 mr-1" />
                      Strategic Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Advanced Trigger Management */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="border-gray-200 bg-white backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Brain className="h-5 w-5 text-[#C9A84C]" />
                      AI-Powered Trigger Learning
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-900 font-medium text-sm">Pattern Recognition Model</span>
                          <Badge variant="outline" className="bg-[#C9A84C]/20 text-[#C9A84C] border-[#C9A84C]/30 text-xs">LEARNING</Badge>
                        </div>
                        <div className="text-xs text-gray-800 dark:text-slate-200">Analyzing 47,892 historical trigger events</div>
                        <Progress value={73} className="h-1 mt-2" />
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-900 font-medium text-sm">Predictive Trigger Engine</span>
                          <Badge variant="outline" className="bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/30 text-xs">ACTIVE</Badge>
                        </div>
                        <div className="text-xs text-gray-800 dark:text-slate-200">Accuracy: 94.7% • Last updated: 2 hours ago</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Clock className="h-5 w-5 text-orange-500" />
                      Recent Trigger Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      <div className="text-xs text-gray-800 p-2 bg-gray-50 rounded">
                        <div className="text-gray-900 font-medium">Market volatility trigger activated</div>
                        <div className="text-gray-800 dark:text-slate-200">Backup supplier activated • 2 hours ago</div>
                      </div>
                      <div className="text-xs text-gray-800 p-2 bg-gray-50 rounded">
                        <div className="text-gray-900 font-medium">Performance threshold reached</div>
                        <div className="text-gray-800 dark:text-slate-200">Revenue target achieved • 5 hours ago</div>
                      </div>
                      <div className="text-xs text-gray-800 p-2 bg-gray-50 rounded">
                        <div className="text-gray-900 font-medium">Customer satisfaction spike</div>
                        <div className="text-gray-800 dark:text-slate-200">NPS increased to 9.2 • 8 hours ago</div>
                      </div>
                    </div>
                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      View Full Activity Log
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="c-suite-copilot" className="flex-1 overflow-y-auto p-3 space-y-3" data-testid="copilot-content">
              {/* Executive Co-pilot Header */}
              <Card className="bg-gradient-to-r from-[#0A0F2E] to-pink-600 text-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Command className="h-6 w-6" />
                    Executive Strategic Co-pilot
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">24/7</div>
                      <div className="text-sm opacity-90">AI Assistant</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">97.3%</div>
                      <div className="text-sm opacity-90">Accuracy Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">156</div>
                      <div className="text-sm opacity-90">Decisions Supported</div>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-white text-[#C9A84C] hover:bg-gray-100">
                    <Brain className="h-4 w-4 mr-2" />
                    Launch Executive Assistant
                  </Button>
                </CardContent>
              </Card>

              {/* Advanced AI Recommendations */}
              <Card className="border-gray-200 bg-white backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Brain className="h-5 w-5 text-[#C9A84C]" />
                    Advanced AI Strategic Recommendations
                    <Badge variant="outline" className="ml-2">ML-Powered</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {aiRecommendations.map((rec) => (
                      <Card key={rec.id} className="border-l-4 border-l-[#0A0F2E] bg-gray-50">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant={rec.priority === 'critical' ? 'destructive' : rec.priority === 'high' ? 'default' : 'secondary'}>
                              {rec.priority.toUpperCase()}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Brain className="h-4 w-4 text-[#C9A84C]" />
                              <span className="text-xs text-gray-800">{rec.confidence}% confidence</span>
                            </div>
                          </div>
                          <h4 className="font-semibold text-sm mb-2 text-gray-900">{rec.title}</h4>
                          <p className="text-xs text-gray-800 mb-3">{rec.description}</p>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-[#2B8A6E]">{rec.impact}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-[#0A0F2E]" />
                              <span className="text-sm text-gray-800">{rec.timeframe}</span>
                            </div>
                            <div className="text-xs text-gray-800 dark:text-slate-200">
                              Model: {rec.mlModel} • {rec.dataPoints.toLocaleString()} data points
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Executive Command Center */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="border-gray-200 bg-white backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Command className="h-5 w-5 text-[#0A0F2E]" />
                      Executive Command Center
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Button className="bg-red-600 hover:bg-red-700">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Crisis Mode
                      </Button>
                      <Button className="bg-[#0A0F2E] hover:bg-[#0A0F2E] text-white">
                        <Target className="h-4 w-4 mr-2" />
                        Strategic Session
                      </Button>
                      <Button className="bg-[#2B8A6E] hover:bg-[#237A5F]">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Operations Review
                      </Button>
                      <Button className="bg-[#0A0F2E] hover:bg-[#0A0F2E] text-white">
                        <Brain className="h-4 w-4 mr-2" />
                        AI Insights
                      </Button>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-800 space-y-1">
                        <div className="flex justify-between">
                          <span>Executive Alerts:</span>
                          <span className="text-red-400 font-bold">2</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pending Decisions:</span>
                          <span className="text-yellow-400 font-bold">7</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Action Items:</span>
                          <span className="text-[#0A0F2E] font-bold">23</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <TrendingUp className="h-5 w-5 text-[#2B8A6E]" />
                      Real-Time Executive KPIs
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-800">Revenue Growth</span>
                          <span className="text-[#2B8A6E] font-bold">+24.7%</span>
                        </div>
                        <Progress value={84.7} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-800">Market Share</span>
                          <span className="text-[#0A0F2E] font-bold">18.3%</span>
                        </div>
                        <Progress value={73.3} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-800">Customer Satisfaction</span>
                          <span className="text-[#C9A84C] font-bold">96.2%</span>
                        </div>
                        <Progress value={96.2} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-800">Operational Efficiency</span>
                          <span className="text-orange-400 font-bold">91.8%</span>
                        </div>
                        <Progress value={91.8} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
          
        </div>
      </div>
    </PageLayout>
  );
}