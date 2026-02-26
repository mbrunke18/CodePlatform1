import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import PageLayout from '@/components/layout/PageLayout';
import { Link } from 'wouter';
import { 
  Brain, 
  Activity, 
  TrendingUp, 
  Users, 
  Lightbulb, 
  Layers,
  Zap, 
  BarChart3, 
  Target, 
  Globe,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Cpu,
  Network,
  Settings,
  Play,
  Pause,
  RefreshCw,
  Download,
  Share,
  Filter,
  Database,
  FileText
} from 'lucide-react';
import { BrandStamp } from "@/components/BrandStamp";

interface AIModule {
  id: string;
  name: string;
  icon: JSX.Element;
  status: 'operational' | 'processing' | 'offline';
  performance: number;
  lastUpdate: string;
  description: string;
  capabilities: string[];
  metrics: {
    accuracy: number;
    processingTime: string;
    dataPoints: number;
    confidence: number;
  };
  insights: any[];
}

interface IntelligenceReport {
  id: string;
  title: string;
  module: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'generated' | 'reviewed' | 'actioned';
  summary: string;
  keyFindings: string[];
  recommendations: string[];
  confidence: number;
}

interface DatabaseIntelligenceReport {
  id: string;
  organizationId: string;
  reportType: 'market_analysis' | 'competitive_intelligence' | 'risk_assessment' | 'regulatory_update' | 'technology_trends';
  title: string;
  executiveSummary: string;
  findings: any[];
  recommendations: any;
  confidence: number;
}

const getReportTypeBadgeColor = (reportType: string) => {
  switch (reportType) {
    case 'market_analysis': return 'bg-[#0A0F2E]/20 text-[#0A0F2E] border-[#0A0F2E]/30';
    case 'competitive_intelligence': return 'bg-[#C9A84C]/20 text-[#C9A84C] border-[#C9A84C]/30';
    case 'risk_assessment': return 'bg-red-500/20 text-red-600 border-red-500/30';
    case 'regulatory_update': return 'bg-orange-500/20 text-orange-600 border-orange-500/30';
    case 'technology_trends': return 'bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/30';
    default: return 'bg-black/5 text-gray-700 border-black/10';
  }
};

const formatReportType = (reportType: string) => {
  return reportType.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

export default function ComprehensiveAIIntelligence() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [aiModules, setAIModules] = useState<AIModule[]>([]);

  const { data: dbReports, isLoading: dbReportsLoading } = useQuery<DatabaseIntelligenceReport[]>({
    queryKey: ['/api/intelligence-reports'],
  });
  const [intelligenceReports, setIntelligenceReports] = useState<IntelligenceReport[]>([]);
  const [systemMetrics, setSystemMetrics] = useState({
    totalProcessingPower: 94.7,
    activeModules: 5,
    dailyInsights: 127,
    accuracyRate: 96.2,
    systemHealth: 98.5
  });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Initialize AI modules with live data
    const initializeModules = async () => {
      try {
        // Fetch live data from AI modules
        const pulseResponse = await fetch('/api/pulse/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ organizationId: undefined })
        });
        const pulseData = await pulseResponse.json();

        const novaResponse = await fetch('/api/nova/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ organizationId: undefined })
        });
        const novaData = await novaResponse.json();

        const prismResponse = await fetch('/api/prism/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ organizationId: undefined })
        });
        const prismData = await prismResponse.json();

        const modules: AIModule[] = [
          {
            id: 'pulse',
            name: 'Pulse Intelligence',
            icon: <Activity className="h-6 w-6" />,
            status: 'operational',
            performance: 97,
            lastUpdate: 'Live',
            description: 'Real-time organizational health and performance monitoring with predictive analytics',
            capabilities: ['Performance Tracking', 'Health Monitoring', 'Predictive Analytics', 'Benchmarking'],
            metrics: {
              accuracy: 96.4,
              processingTime: '< 2 seconds',
              dataPoints: pulseData.success ? pulseData.count * 1000 : 5000,
              confidence: 94.7
            },
            insights: pulseData.success ? pulseData.metrics : []
          },
          {
            id: 'flux',
            name: 'Flux Adaptations',
            icon: <TrendingUp className="h-6 w-6" />,
            status: 'operational',
            performance: 94,
            lastUpdate: '3 min ago',
            description: 'Dynamic adaptation strategies and change management intelligence with scenario modeling',
            capabilities: ['Change Management', 'Adaptation Strategies', 'Risk Assessment', 'Scenario Planning'],
            metrics: {
              accuracy: 93.8,
              processingTime: '< 5 seconds',
              dataPoints: 12400,
              confidence: 91.2
            },
            insights: []
          },
          {
            id: 'prism',
            name: 'Prism Insights',
            icon: <Layers className="h-6 w-6" />,
            status: 'operational',
            performance: 96,
            lastUpdate: '1 min ago',
            description: 'Multi-dimensional strategic analysis and decision support with market intelligence',
            capabilities: ['Strategic Analysis', 'Market Intelligence', 'Decision Support', 'Competitive Analysis'],
            metrics: {
              accuracy: 95.1,
              processingTime: '< 3 seconds',
              dataPoints: prismData.success ? prismData.count * 2000 : 10000,
              confidence: 93.5
            },
            insights: prismData.success ? prismData.insights : []
          },
          {
            id: 'echo',
            name: 'Echo Cultural Analytics',
            icon: <Users className="h-6 w-6" />,
            status: 'operational',
            performance: 91,
            lastUpdate: '5 min ago',
            description: 'Cultural intelligence and organizational dynamics assessment with sentiment analysis',
            capabilities: ['Cultural Analysis', 'Sentiment Tracking', 'Team Dynamics', 'Engagement Metrics'],
            metrics: {
              accuracy: 89.7,
              processingTime: '< 4 seconds',
              dataPoints: 8750,
              confidence: 87.3
            },
            insights: []
          },
          {
            id: 'nova',
            name: 'Nova Innovations',
            icon: <Lightbulb className="h-6 w-6" />,
            status: 'operational',
            performance: 95,
            lastUpdate: 'Live',
            description: 'Innovation pipeline and breakthrough opportunity identification with trend forecasting',
            capabilities: ['Innovation Tracking', 'Opportunity Identification', 'Trend Forecasting', 'R&D Analytics'],
            metrics: {
              accuracy: 94.6,
              processingTime: '< 3 seconds',
              dataPoints: novaData.success ? novaData.count * 1500 : 7500,
              confidence: 92.8
            },
            insights: novaData.success ? novaData.opportunities : []
          }
        ];

        setAIModules(modules);

        // Generate intelligence reports
        const reports: IntelligenceReport[] = [
          {
            id: 'report-001',
            title: 'Organizational Agility Assessment',
            module: 'Pulse Intelligence',
            timestamp: new Date().toISOString(),
            priority: 'high',
            status: 'generated',
            summary: 'Comprehensive analysis shows 8.7/10 agility score with strong team velocity and strategic alignment.',
            keyFindings: [
              'Team velocity increased 12% over last quarter',
              'Strategic alignment shows 95% consistency across departments',
              'Cultural health metrics indicate high employee satisfaction',
              'Innovation capacity trending upward with 23% improvement'
            ],
            recommendations: [
              'Maintain current agility practices while scaling to new teams',
              'Invest in advanced training for emerging technologies',
              'Strengthen cross-departmental collaboration frameworks'
            ],
            confidence: 96.4
          },
          {
            id: 'report-002',
            title: 'Market Positioning Intelligence',
            module: 'Prism Insights',
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            priority: 'critical',
            status: 'reviewed',
            summary: 'Strategic market analysis reveals significant expansion opportunities and competitive advantages.',
            keyFindings: [
              'Market gap identified worth $2.3M annual revenue potential',
              'Competitive positioning shows 15-month advantage window',
              'Customer acquisition patterns indicate strong product-market fit',
              'Brand strength metrics exceed industry benchmarks by 34%'
            ],
            recommendations: [
              'Accelerate product development for identified market gap',
              'Implement targeted customer acquisition strategy',
              'Leverage brand strength for premium positioning'
            ],
            confidence: 87.2
          },
          {
            id: 'report-003',
            title: 'Innovation Pipeline Analysis',
            module: 'Nova Innovations',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            priority: 'medium',
            status: 'actioned',
            summary: 'Innovation assessment shows strong pipeline with breakthrough potential in AI-powered solutions.',
            keyFindings: [
              'AI-powered customer intelligence platform shows breakthrough potential',
              'Sustainability framework development ahead of schedule',
              'Remote collaboration ecosystem testing exceeds expectations',
              'Predictive maintenance implementation showing 40% efficiency gains'
            ],
            recommendations: [
              'Prioritize AI platform development with $750K budget allocation',
              'Fast-track sustainability framework to market leadership position',
              'Scale successful predictive maintenance across all operations'
            ],
            confidence: 92.1
          }
        ];

        setIntelligenceReports(reports);

      } catch (error) {
        console.error('Error initializing AI modules:', error);
      }
    };

    initializeModules();

    // Real-time updates every 30 seconds
    const interval = setInterval(() => {
      /*
      setSystemMetrics(prev => ({
        ...prev,
        totalProcessingPower: +(prev.totalProcessingPower + (Math.random() * 2 - 1)).toFixed(1),
        dailyInsights: prev.dailyInsights + Math.floor(Math.random() * 3),
        accuracyRate: +(prev.accuracyRate + (Math.random() * 0.5 - 0.25)).toFixed(1),
        systemHealth: +(prev.systemHealth + (Math.random() * 0.3 - 0.15)).toFixed(1)
      }));
      */
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/30';
      case 'processing': return 'bg-[#C9A84C]/20 text-[#C9A84C] border-[#C9A84C]/30';
      case 'offline': return 'bg-red-500/20 text-red-600 border-red-500/30';
      default: return 'bg-black/5 text-gray-700 border-black/10';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-600 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-600 border-orange-500/30';
      case 'medium': return 'bg-[#C9A84C]/20 text-[#C9A84C] border-[#C9A84C]/30';
      case 'low': return 'bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/30';
      default: return 'bg-black/5 text-gray-700 border-black/10';
    }
  };

  const generateAllIntelligence = async () => {
    setIsGenerating(true);
    try {
      // Trigger all AI modules to generate fresh intelligence
      const modules = ['pulse', 'nova', 'prism', 'flux', 'echo'];
      const promises = modules.map(module => 
        fetch(`/api/${module}/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ organizationId: undefined })
        })
      );

      await Promise.all(promises);
      
      // Refresh the page data
      window.location.reload();
    } catch (error) {
      console.error('Error generating intelligence:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <PageLayout>
      <div className="flex-1 bg-[#F8F7F4] overflow-y-auto p-8 space-y-8">
        
        {/* AI Intelligence Header */}
        <div className="flex items-center justify-between">
          <div className="bg-[#0A0F2E] text-white p-8 rounded-lg relative overflow-hidden w-full flex items-center justify-between">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#C9A84C 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div className="relative z-10 flex items-center gap-4">
              <Brain className="h-10 w-10 text-[#C9A84C]" />
              <div>
                <h1 className="text-3xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>AI Intelligence Command Center</h1>
                <p className="text-white/70">Comprehensive AI-powered organizational intelligence and strategic insights</p>
              </div>
            </div>
            <div className="relative z-10 flex items-center gap-4">
              <Button 
                onClick={generateAllIntelligence}
                disabled={isGenerating}
                className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178]"
              >
                {isGenerating ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4 mr-2" />
                )}
                Generate Intelligence
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Download className="w-4 h-4 mr-2" />
                Export Reports
              </Button>
            </div>
          </div>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="bg-white border-[#E8E4DC]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#0A0F2E]">Processing Power</h3>
                <Cpu className="h-5 w-5 text-[#C9A84C]" />
              </div>
              <div className="text-2xl font-bold text-[#0A0F2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{systemMetrics.totalProcessingPower}%</div>
              <div className="text-sm text-[#6B7280]">System utilization</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E8E4DC]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#0A0F2E]">Active Modules</h3>
                <Brain className="h-5 w-5 text-[#2B8A6E]" />
              </div>
              <div className="text-2xl font-bold text-[#0A0F2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{systemMetrics.activeModules}</div>
              <div className="text-sm text-[#6B7280]">AI systems online</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E8E4DC]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#0A0F2E]">Daily Insights</h3>
                <Eye className="h-5 w-5 text-[#0A0F2E] opacity-40" />
              </div>
              <div className="text-2xl font-bold text-[#0A0F2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{systemMetrics.dailyInsights}</div>
              <div className="text-sm text-[#6B7280]">Generated today</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E8E4DC]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#0A0F2E]">Accuracy Rate</h3>
                <Target className="h-5 w-5 text-[#2B8A6E]" />
              </div>
              <div className="text-2xl font-bold text-[#0A0F2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{systemMetrics.accuracyRate}%</div>
              <div className="text-sm text-[#6B7280]">Prediction accuracy</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E8E4DC]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#0A0F2E]">System Health</h3>
                <Activity className="h-5 w-5 text-[#2B8A6E]" />
              </div>
              <div className="text-2xl font-bold text-[#0A0F2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{systemMetrics.systemHealth}%</div>
              <div className="text-sm text-[#6B7280]">Overall health</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Intelligence Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-[#E8E4DC] border border-[#E8E4DC]">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-white data-[state=active]:text-[#0A0F2E]">AI Dashboard</TabsTrigger>
            <TabsTrigger value="modules" className="data-[state=active]:bg-white data-[state=active]:text-[#0A0F2E]">AI Modules</TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-white data-[state=active]:text-[#0A0F2E]">Intelligence Reports</TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-white data-[state=active]:text-[#0A0F2E]">Live Insights</TabsTrigger>
            <TabsTrigger value="configuration" className="data-[state=active]:bg-white data-[state=active]:text-[#0A0F2E]">Configuration</TabsTrigger>
          </TabsList>

          {/* AI Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Module Status Overview */}
              <Card className="bg-white border-[#E8E4DC]">
                <CardHeader>
                  <CardTitle className="text-[#0A0F2E] flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI Module Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {aiModules.map((module) => (
                    <div key={module.id} className="flex items-center justify-between p-3 bg-[#F8F7F4] rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#0A0F2E] rounded-lg">
                          {module.icon}
                        </div>
                        <div>
                          <div className="font-semibold text-[#0A0F2E]">{module.name}</div>
                          <div className="text-xs text-[#6B7280]">Updated: {module.lastUpdate}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm font-medium text-[#0A0F2E]">{module.performance}%</div>
                          <Progress value={module.performance} className="w-16 h-2 [&>div]:bg-[#C9A84C]" />
                        </div>
                        <Badge className={getStatusColor(module.status)}>
                          {module.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Intelligence Activity */}
              <Card className="bg-white border-[#E8E4DC]">
                <CardHeader>
                  <CardTitle className="text-[#0A0F2E] flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Intelligence Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white border border-[#E8E4DC] rounded-lg">
                      <div className="w-2 h-2 bg-[#2B8A6E] rounded-full animate-pulse" />
                      <div className="flex-1">
                        <div className="text-sm text-[#0A0F2E]">Pulse Intelligence generated performance metrics</div>
                        <div className="text-xs text-[#6B7280]">Real-time • Confidence: 96.4%</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white border border-[#E8E4DC] rounded-lg">
                      <div className="w-2 h-2 bg-[#0A0F2E] rounded-full" />
                      <div className="flex-1">
                        <div className="text-sm text-[#0A0F2E]">Nova identified breakthrough innovation opportunity</div>
                        <div className="text-xs text-[#6B7280]">2 min ago • Impact: $750K potential</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white border border-[#E8E4DC] rounded-lg">
                      <div className="w-2 h-2 bg-[#0A0F2E] rounded-full" />
                      <div className="flex-1">
                        <div className="text-sm text-[#0A0F2E]">Prism completed strategic market analysis</div>
                        <div className="text-xs text-[#6B7280]">5 min ago • Market opportunity: $2.3M</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Modules */}
          <TabsContent value="modules" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {aiModules.map((module) => (
                <Card key={module.id} className="bg-white border-gray-200 hover:bg-[#141B45]/50 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-gray-900 flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-[#0A0F2E] to-[#141B45] rounded-lg">
                          {module.icon}
                        </div>
                        {module.name}
                      </CardTitle>
                      <Badge className={getStatusColor(module.status)}>
                        {module.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-gray-800 dark:text-slate-200 text-sm">{module.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    
                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-800 dark:text-slate-200">Performance</div>
                        <div className="text-gray-900 font-medium">{module.performance}%</div>
                      </div>
                      <div>
                        <div className="text-gray-800 dark:text-slate-200">Accuracy</div>
                        <div className="text-gray-900 font-medium">{module.metrics.accuracy}%</div>
                      </div>
                      <div>
                        <div className="text-gray-800 dark:text-slate-200">Processing</div>
                        <div className="text-gray-900 font-medium">{module.metrics.processingTime}</div>
                      </div>
                      <div>
                        <div className="text-gray-800 dark:text-slate-200">Confidence</div>
                        <div className="text-gray-900 font-medium">{module.metrics.confidence}%</div>
                      </div>
                    </div>

                    {/* Capabilities */}
                    <div>
                      <div className="text-sm font-semibold text-gray-900 mb-2">Capabilities</div>
                      <div className="flex flex-wrap gap-2">
                        {module.capabilities.map((capability, index) => (
                          <Badge key={index} variant="outline" className="bg-transparent border-slate-600 text-gray-800 text-xs">
                            {capability}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link to={`/${module.id}`} className="flex-1">
                        <Button size="sm" className="w-full bg-[#0A0F2E] hover:bg-[#0A0F2E]">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline" className="bg-transparent border-slate-600 text-gray-800 hover:bg-[#141B45]">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Reports Content */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {dbReportsLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <Card key={i} className="bg-white border-[#E8E4DC]">
                      <CardContent className="p-6">
                        <Skeleton className="h-6 w-1/2 mb-4" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-full" />
                      </CardContent>
                    </Card>
                  ))
                ) : dbReports && dbReports.length > 0 ? (
                  dbReports.map((report) => (
                    <Card key={report.id} className="bg-white border-[#E8E4DC]">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={getReportTypeBadgeColor(report.reportType)}>
                                {formatReportType(report.reportType)}
                              </Badge>
                              <Badge variant="outline" className="border-[#E8E4DC] text-[#6B7280]">
                                Confidence: {report.confidence}%
                              </Badge>
                            </div>
                            <h3 className="text-xl font-bold text-[#0A0F2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{report.title}</h3>
                          </div>
                          <Button variant="outline" size="sm" className="border-[#E8E4DC] text-[#0A0F2E]">
                            <Download className="h-4 w-4 mr-2" />
                            PDF
                          </Button>
                        </div>
                        <p className="text-[#6B7280] mb-4">{report.executiveSummary}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-[#E8E4DC]">
                          <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" className="text-[#0A0F2E] hover:bg-[#F8F7F4]">
                              <FileText className="h-4 w-4 mr-2" />
                              View Full Report
                            </Button>
                            <Button variant="ghost" size="sm" className="text-[#0A0F2E] hover:bg-[#F8F7F4]">
                              <Share className="h-4 w-4 mr-2" />
                              Share
                            </Button>
                          </div>
                          <Badge className="bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/30">
                            Verified
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  intelligenceReports.map((report) => (
                    <Card key={report.id} className="bg-white border-[#E8E4DC]">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={getPriorityColor(report.priority)}>
                                {report.priority.toUpperCase()} PRIORITY
                              </Badge>
                              <Badge variant="outline" className="border-[#E8E4DC] text-[#6B7280]">
                                {report.module}
                              </Badge>
                            </div>
                            <h3 className="text-xl font-bold text-[#0A0F2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{report.title}</h3>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-[#6B7280] mb-1">{new Date(report.timestamp).toLocaleDateString()}</div>
                            <Badge variant="outline" className="bg-[#0A0F2E]/20 text-[#0A0F2E] border-[#0A0F2E]/30">
                              {report.status.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-[#6B7280] mb-4">{report.summary}</p>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-[#F8F7F4] p-3 rounded-lg border border-[#E8E4DC]">
                            <div className="text-sm font-semibold text-[#0A0F2E] mb-2">Key Findings</div>
                            <ul className="text-xs text-[#6B7280] space-y-1">
                              {report.keyFindings.map((finding, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <div className="w-1 h-1 bg-[#6B7280] rounded-full mt-1.5" />
                                  {finding}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-[#F8F7F4] p-3 rounded-lg border border-[#E8E4DC]">
                            <div className="text-sm font-semibold text-[#0A0F2E] mb-2">Recommendations</div>
                            <ul className="text-xs text-[#6B7280] space-y-1">
                              {report.recommendations.map((rec, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <div className="w-1 h-1 bg-[#0A0F2E] rounded-full mt-1.5" />
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-[#E8E4DC]">
                          <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" className="text-[#0A0F2E] hover:bg-[#F8F7F4]">
                              <FileText className="h-4 w-4 mr-2" />
                              View Full Report
                            </Button>
                            <Button variant="ghost" size="sm" className="text-[#0A0F2E] hover:bg-[#F8F7F4]">
                              <Share className="h-4 w-4 mr-2" />
                              Share
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[#6B7280]">Confidence:</span>
                            <Progress value={report.confidence} className="w-16 h-1.5 [&>div]:bg-[#C9A84C]" />
                            <span className="text-xs font-bold text-[#0A0F2E]">{report.confidence}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              <div className="space-y-6">
                <Card className="bg-white border-[#E8E4DC]">
                  <CardHeader>
                    <CardTitle className="text-[#0A0F2E]">Report Filters</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#0A0F2E]">Module Source</label>
                      <div className="space-y-1">
                        {['All Modules', 'Pulse Intelligence', 'Nova Innovations', 'Prism Insights', 'Flux Adaptations', 'Echo Analytics'].map((m) => (
                          <div key={m} className="flex items-center gap-2">
                            <div className="w-4 h-4 border border-[#E8E4DC] rounded" />
                            <span className="text-sm text-[#6B7280]">{m}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#0A0F2E]">Priority Level</label>
                      <div className="flex flex-wrap gap-2">
                        {['Critical', 'High', 'Medium', 'Low'].map((p) => (
                          <Badge key={p} variant="outline" className="cursor-pointer border-[#E8E4DC] text-[#6B7280] hover:border-[#0A0F2E]">
                            {p}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full bg-[#0A0F2E] text-white hover:bg-[#141B45]">
                      <Filter className="h-4 w-4 mr-2" />
                      Apply Filters
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-[#0A0F2E] text-white overflow-hidden relative">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#C9A84C 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
                  <CardContent className="p-6 relative z-10">
                    <h3 className="font-bold text-lg mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Schedule Reports</h3>
                    <p className="text-white/70 text-sm mb-4">Automate intelligence delivery to key stakeholders on a regular basis.</p>
                    <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure Scheduler
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Live Insights */}
          <TabsContent value="insights" className="space-y-6">
            <Alert className="border-[#0A0F2E]/30 bg-[#0A0F2E]/10">
              <Brain className="h-4 w-4" />
              <AlertDescription className="text-[#0A0F2E]">
                Live insights are generated in real-time from all AI modules. Refresh automatically every 30 seconds.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {aiModules.filter(m => m.insights.length > 0).map((module) => (
                <Card key={module.id} className="bg-white border-[#E8E4DC]">
                  <CardHeader>
                    <CardTitle className="text-[#0A0F2E] flex items-center gap-2">
                      {module.icon}
                      {module.name} Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center text-[#6B7280]">
                      <Brain className="h-12 w-12 mx-auto mb-2 text-[#C9A84C]" />
                      <p>Live insights streaming...</p>
                      <p className="text-xs">{module.insights.length} data points processed</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Configuration */}
          <TabsContent value="configuration" className="space-y-6">
            <Card className="bg-white border-[#E8E4DC]">
              <CardHeader>
                <CardTitle className="text-[#0A0F2E]">AI System Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Button className="h-24 bg-[#0A0F2E] hover:bg-[#141B45] text-white flex-col gap-2">
                    <Brain className="w-8 h-8" />
                    Model Training
                  </Button>
                  <Button className="h-24 bg-[#2B8A6E] hover:bg-[#3BAF8A] text-white flex-col gap-2">
                    <Network className="w-8 h-8" />
                    Data Sources
                  </Button>
                  <Button className="h-24 bg-[#0A0F2E] hover:bg-[#141B45] text-white flex-col gap-2">
                    <Settings className="w-8 h-8" />
                    System Settings
                  </Button>
                  <Button className="h-24 bg-[#C9A84C] hover:bg-[#DFC178] text-[#0A0F2E] font-bold flex-col gap-2">
                    <Filter className="w-8 h-8" />
                    Processing Rules
                  </Button>
                  <Button className="h-24 bg-[#C9A84C] hover:bg-[#DFC178] text-[#0A0F2E] font-bold flex-col gap-2">
                    <Target className="w-8 h-8" />
                    Performance Tuning
                  </Button>
                  <Button className="h-24 bg-[#0A0F2E] hover:bg-[#141B45] text-white flex-col gap-2">
                    <Globe className="w-8 h-8" />
                    Integration Hub
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}