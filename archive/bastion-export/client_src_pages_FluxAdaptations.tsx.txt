import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'wouter';
import VeridiusPageLayout from '@/components/layout/VeridiusPageLayout';
import { 
  TrendingUp, 
  Zap, 
  Target,
  ArrowRight,
  Clock,
  Users,
  DollarSign,
  BarChart3,
  Brain,
  Lightbulb,
  Settings,
  Play,
  ArrowLeft,
  Home
} from 'lucide-react';

export default function FluxAdaptations() {
  const [selectedStrategy, setSelectedStrategy] = useState('active');

  const adaptationStrategies = [
    {
      id: 'digital-transformation',
      name: 'Digital Transformation Acceleration',
      category: 'technology',
      priority: 'high',
      impact: 95,
      effort: 78,
      timeline: '6-12 months',
      status: 'active',
      description: 'Comprehensive digital infrastructure overhaul to enhance agility and responsiveness',
      outcomes: ['40% faster decision-making', 'Real-time data analytics', 'Automated processes'],
      icon: <Zap className="h-5 w-5" />
    },
    {
      id: 'market-expansion',
      name: 'Adaptive Market Expansion',
      category: 'business',
      priority: 'medium',
      impact: 88,
      effort: 65,
      timeline: '9-15 months',
      status: 'planning',
      description: 'Dynamic market entry strategies with rapid pivot capabilities',
      outcomes: ['New revenue streams', 'Market diversification', 'Risk mitigation'],
      icon: <Target className="h-5 w-5" />
    },
    {
      id: 'workforce-evolution',
      name: 'Workforce Evolution Strategy',
      category: 'human-capital',
      priority: 'high',
      impact: 92,
      effort: 55,
      timeline: '3-6 months',
      status: 'active',
      description: 'Adaptive talent management and skill development programs',
      outcomes: ['Increased adaptability', 'Skills diversification', 'Higher retention'],
      icon: <Users className="h-5 w-5" />
    },
    {
      id: 'financial-flexibility',
      name: 'Financial Flexibility Framework',
      category: 'finance',
      priority: 'critical',
      impact: 97,
      effort: 45,
      timeline: '2-4 months',
      status: 'active',
      description: 'Dynamic resource allocation and financial risk management',
      outcomes: ['Improved cash flow', 'Crisis resilience', 'Investment agility'],
      icon: <DollarSign className="h-5 w-5" />
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'planning': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'paused': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredStrategies = adaptationStrategies.filter(strategy => 
    selectedStrategy === 'all' || strategy.status === selectedStrategy
  );

  return (
    <VeridiusPageLayout>
      <div className="h-full bg-transparent p-4" data-testid="flux-adaptations">
        <div className="w-full max-w-none mx-auto space-y-4 h-full overflow-hidden flex flex-col">
          
          {/* Breadcrumb Navigation */}
          <div className="mb-2 flex-shrink-0">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-1 h-auto">
                  <Home className="h-4 w-4" />
                </Button>
              </Link>
              <span>/</span>
              <span>AI Intelligence</span>
              <span>/</span>
              <span className="text-white">Flux Adaptations</span>
            </div>
          </div>

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 rounded-lg flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <TrendingUp className="h-10 w-10" />
                <div>
                  <h1 className="text-3xl font-bold" data-testid="flux-title">
                    Flux Adaptations
                  </h1>
                  <p className="text-blue-100">Dynamic adaptation strategies and change management intelligence</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link to="/">
                  <Button variant="secondary" className="bg-blue-700 hover:bg-blue-800 text-blue-100 border-blue-600" data-testid="back-to-dashboard">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Badge variant="secondary" className="bg-blue-700 text-blue-100 border-blue-600" data-testid="ai-powered-badge">
                  <Brain className="h-4 w-4 mr-2" />
                  AI POWERED
                </Badge>
                <Button variant="secondary" className="bg-cyan-600 hover:bg-cyan-700 text-white" data-testid="generate-strategy-button">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Generate New Strategy
                </Button>
              </div>
            </div>
          </div>

          <Tabs value={selectedStrategy} onValueChange={setSelectedStrategy} className="w-full flex-1 flex flex-col min-h-0">
            <TabsList className="grid w-full grid-cols-4 flex-shrink-0">
              <TabsTrigger value="active" data-testid="tab-active">Active Strategies</TabsTrigger>
              <TabsTrigger value="planning" data-testid="tab-planning">In Planning</TabsTrigger>
              <TabsTrigger value="all" data-testid="tab-all">All Strategies</TabsTrigger>
              <TabsTrigger value="analytics" data-testid="tab-analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedStrategy} className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedStrategy !== 'analytics' ? (
                <>
                  {/* Adaptation Strategies Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredStrategies.map((strategy) => (
                      <Card key={strategy.id} className="border-gray-700/50 bg-gray-900/50 backdrop-blur-sm hover:border-blue-500/30 transition-colors" data-testid={`strategy-${strategy.id}`}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-blue-500/10">
                                <div className="text-blue-400">
                                  {strategy.icon}
                                </div>
                              </div>
                              <div>
                                <h3 className="font-semibold text-white">{strategy.name}</h3>
                                <p className="text-sm text-gray-400 capitalize">{strategy.category} • {strategy.timeline}</p>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Badge variant="outline" className={getPriorityColor(strategy.priority)}>
                                {strategy.priority.toUpperCase()}
                              </Badge>
                              <Badge variant="outline" className={getStatusColor(strategy.status)}>
                                {strategy.status.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm text-gray-300">{strategy.description}</p>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-gray-400">Impact</span>
                                <span className="text-emerald-400 font-medium">{strategy.impact}%</span>
                              </div>
                              <Progress value={strategy.impact} className="h-2" />
                            </div>
                            <div>
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-gray-400">Effort</span>
                                <span className="text-orange-400 font-medium">{strategy.effort}%</span>
                              </div>
                              <Progress value={strategy.effort} className="h-2" />
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-white mb-2">Expected Outcomes:</h4>
                            <ul className="space-y-1">
                              {strategy.outcomes.map((outcome, index) => (
                                <li key={index} className="flex items-center gap-2 text-sm text-gray-300">
                                  <ArrowRight className="h-3 w-3 text-blue-400" />
                                  {outcome}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button size="sm" variant="outline" className="flex-1">
                              <Settings className="h-4 w-4 mr-2" />
                              Configure
                            </Button>
                            <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                              <Play className="h-4 w-4 mr-2" />
                              Execute
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Strategy Insights */}
                  <Card className="border-purple-500/30 bg-purple-950/30 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-purple-300">
                        <Brain className="h-5 w-5" />
                        AI Strategy Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-950/30 rounded-lg border border-blue-500/30">
                          <p className="text-blue-300 font-medium mb-2">Prioritization Recommendation</p>
                          <p className="text-blue-200 text-sm">Focus on Financial Flexibility Framework first - high impact with low effort, providing foundation for other adaptations.</p>
                        </div>
                        <div className="p-4 bg-green-950/30 rounded-lg border border-green-500/30">
                          <p className="text-green-300 font-medium mb-2">Synergy Opportunity</p>
                          <p className="text-green-200 text-sm">Digital Transformation and Workforce Evolution strategies can be executed in parallel for 25% efficiency gain.</p>
                        </div>
                        <div className="p-4 bg-orange-950/30 rounded-lg border border-orange-500/30">
                          <p className="text-orange-300 font-medium mb-2">Risk Mitigation</p>
                          <p className="text-orange-200 text-sm">Market Expansion strategy shows high risk - consider phased approach or additional contingency planning.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Strategy Analytics & Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">Advanced strategy analytics and performance tracking</p>
                      <p className="text-sm text-gray-500 mt-2">Real-time adaptation effectiveness measurement</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </VeridiusPageLayout>
  );
}