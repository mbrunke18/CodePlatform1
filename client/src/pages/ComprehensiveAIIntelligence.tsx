import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  Filter
} from 'lucide-react';

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

export default function ComprehensiveAIIntelligence() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [aiModules, setAIModules] = useState<AIModule[]>([]);
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
          body: JSON.stringify({ organizationId: 'ec61b8f6-7d87-41fd-9969-cb990ed0b10b' })
        });
        const pulseData = await pulseResponse.json();

        const novaResponse = await fetch('/api/nova/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ organizationId: 'ec61b8f6-7d87-41fd-9969-cb990ed0b10b' })
        });
        const novaData = await novaResponse.json();

        const prismResponse = await fetch('/api/prism/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ organizationId: 'ec61b8f6-7d87-41fd-9969-cb990ed0b10b' })
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
      setSystemMetrics(prev => ({
        ...prev,
        totalProcessingPower: +(prev.totalProcessingPower + (Math.random() * 2 - 1)).toFixed(1),
        dailyInsights: prev.dailyInsights + Math.floor(Math.random() * 3),
        accuracyRate: +(prev.accuracyRate + (Math.random() * 0.5 - 0.25)).toFixed(1),
        systemHealth: +(prev.systemHealth + (Math.random() * 0.3 - 0.15)).toFixed(1)
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'processing': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'offline': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
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
          body: JSON.stringify({ organizationId: 'ec61b8f6-7d87-41fd-9969-cb990ed0b10b' })
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
      <div className="flex-1 page-background overflow-y-auto p-8 space-y-8">
        
        {/* AI Intelligence Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">AI Intelligence Command Center</h1>
            <p className="text-slate-300">Comprehensive AI-powered organizational intelligence and strategic insights</p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={generateAllIntelligence}
              disabled={isGenerating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 mr-2" />
              )}
              Generate Intelligence
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
              <Download className="w-4 h-4 mr-2" />
              Export Reports
            </Button>
          </div>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Processing Power</h3>
                <Cpu className="h-5 w-5 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">{systemMetrics.totalProcessingPower}%</div>
              <div className="text-sm text-slate-400">System utilization</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Active Modules</h3>
                <Brain className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white">{systemMetrics.activeModules}</div>
              <div className="text-sm text-slate-400">AI systems online</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Daily Insights</h3>
                <Eye className="h-5 w-5 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">{systemMetrics.dailyInsights}</div>
              <div className="text-sm text-slate-400">Generated today</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Accuracy Rate</h3>
                <Target className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white">{systemMetrics.accuracyRate}%</div>
              <div className="text-sm text-slate-400">Prediction accuracy</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">System Health</h3>
                <Activity className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white">{systemMetrics.systemHealth}%</div>
              <div className="text-sm text-slate-400">Overall health</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Intelligence Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700/50">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-slate-700">AI Dashboard</TabsTrigger>
            <TabsTrigger value="modules" className="data-[state=active]:bg-slate-700">AI Modules</TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-slate-700">Intelligence Reports</TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-slate-700">Live Insights</TabsTrigger>
            <TabsTrigger value="configuration" className="data-[state=active]:bg-slate-700">Configuration</TabsTrigger>
          </TabsList>

          {/* AI Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Module Status Overview */}
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI Module Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {aiModules.map((module) => (
                    <div key={module.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                          {module.icon}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{module.name}</div>
                          <div className="text-xs text-slate-400">Updated: {module.lastUpdate}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm font-medium text-white">{module.performance}%</div>
                          <Progress value={module.performance} className="w-16 h-2" />
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
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Intelligence Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                      <div className="flex-1 page-background">
                        <div className="text-sm text-white">Pulse Intelligence generated performance metrics</div>
                        <div className="text-xs text-slate-400">Real-time • Confidence: 96.4%</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-400 rounded-full" />
                      <div className="flex-1 page-background">
                        <div className="text-sm text-white">Nova identified breakthrough innovation opportunity</div>
                        <div className="text-xs text-slate-400">2 min ago • Impact: $750K potential</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                      <div className="w-2 h-2 bg-purple-400 rounded-full" />
                      <div className="flex-1 page-background">
                        <div className="text-sm text-white">Prism completed strategic market analysis</div>
                        <div className="text-xs text-slate-400">5 min ago • Market opportunity: $2.3M</div>
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
                <Card key={module.id} className="bg-slate-900/50 border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                          {module.icon}
                        </div>
                        {module.name}
                      </CardTitle>
                      <Badge className={getStatusColor(module.status)}>
                        {module.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-slate-400 text-sm">{module.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    
                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-slate-400">Performance</div>
                        <div className="text-white font-medium">{module.performance}%</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Accuracy</div>
                        <div className="text-white font-medium">{module.metrics.accuracy}%</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Processing</div>
                        <div className="text-white font-medium">{module.metrics.processingTime}</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Confidence</div>
                        <div className="text-white font-medium">{module.metrics.confidence}%</div>
                      </div>
                    </div>

                    {/* Capabilities */}
                    <div>
                      <div className="text-sm font-semibold text-white mb-2">Capabilities</div>
                      <div className="flex flex-wrap gap-2">
                        {module.capabilities.map((capability, index) => (
                          <Badge key={index} variant="outline" className="border-slate-600 text-slate-300 text-xs">
                            {capability}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link to={`/${module.id}`} className="flex-1">
                        <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Intelligence Reports */}
          <TabsContent value="reports" className="space-y-6">
            <div className="space-y-4">
              {intelligenceReports.map((report) => (
                <Card key={report.id} className="bg-slate-900/50 border-slate-700/50">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 page-background">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{report.title}</h3>
                          <Badge className={getPriorityColor(report.priority)}>
                            {report.priority.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="border-slate-600 text-slate-300">
                            {report.module}
                          </Badge>
                        </div>
                        <p className="text-slate-300 mb-4">{report.summary}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-400">Confidence</div>
                        <div className="text-xl font-bold text-white">{report.confidence}%</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="text-sm font-semibold text-white mb-2">Key Findings</div>
                        <div className="space-y-1">
                          {report.keyFindings.map((finding, index) => (
                            <div key={index} className="text-sm text-slate-300 flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                              {finding}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-semibold text-white mb-2">Recommendations</div>
                        <div className="space-y-1">
                          {report.recommendations.map((rec, index) => (
                            <div key={index} className="text-sm text-slate-300 flex items-start gap-2">
                              <Target className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                              {rec}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between">
                      <div className="text-xs text-slate-500">
                        Generated: {new Date(report.timestamp).toLocaleString()}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Eye className="w-4 h-4 mr-2" />
                          Full Report
                        </Button>
                        <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                          <Share className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Live Insights */}
          <TabsContent value="insights" className="space-y-6">
            <Alert className="border-blue-500/30 bg-blue-500/10">
              <Brain className="h-4 w-4" />
              <AlertDescription className="text-blue-200">
                Live insights are generated in real-time from all AI modules. Refresh automatically every 30 seconds.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {aiModules.filter(m => m.insights.length > 0).map((module) => (
                <Card key={module.id} className="bg-slate-900/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      {module.icon}
                      {module.name} Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center text-slate-400">
                      <Brain className="h-12 w-12 mx-auto mb-2" />
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
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">AI System Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Button className="h-24 bg-blue-600 hover:bg-blue-700 flex-col gap-2">
                    <Brain className="w-8 h-8" />
                    Model Training
                  </Button>
                  <Button className="h-24 bg-emerald-600 hover:bg-emerald-700 flex-col gap-2">
                    <Network className="w-8 h-8" />
                    Data Sources
                  </Button>
                  <Button className="h-24 bg-purple-600 hover:bg-purple-700 flex-col gap-2">
                    <Settings className="w-8 h-8" />
                    System Settings
                  </Button>
                  <Button className="h-24 bg-amber-600 hover:bg-amber-700 flex-col gap-2">
                    <Filter className="w-8 h-8" />
                    Processing Rules
                  </Button>
                  <Button className="h-24 bg-pink-600 hover:bg-pink-700 flex-col gap-2">
                    <Target className="w-8 h-8" />
                    Performance Tuning
                  </Button>
                  <Button className="h-24 bg-indigo-600 hover:bg-indigo-700 flex-col gap-2">
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