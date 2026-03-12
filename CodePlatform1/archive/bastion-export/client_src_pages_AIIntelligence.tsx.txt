import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import VeridiusPageLayout from '@/components/layout/VeridiusPageLayout';
import { 
  Brain, 
  Activity, 
  TrendingUp, 
  Layers, 
  Users, 
  Rocket,
  Zap,
  BarChart3,
  Target,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Globe
} from 'lucide-react';

export default function AIIntelligence() {
  const [activeModule, setActiveModule] = useState('pulse');

  const aiModules = [
    {
      id: 'pulse',
      name: 'Pulse Intelligence',
      icon: <Activity className="w-6 h-6" />,
      description: 'Real-time organizational health monitoring and predictive analytics',
      status: 'active',
      accuracy: 92,
      lastUpdate: '2 minutes ago',
      insights: 847,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'flux',
      name: 'Flux Adaptations',
      icon: <TrendingUp className="w-6 h-6" />,
      description: 'Dynamic adaptation strategies and change management intelligence',
      status: 'active',
      accuracy: 89,
      lastUpdate: '5 minutes ago',
      insights: 623,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'prism',
      name: 'Prism Insights',
      icon: <Layers className="w-6 h-6" />,
      description: 'Multi-dimensional strategic analysis and decision support',
      status: 'active',
      accuracy: 94,
      lastUpdate: '1 minute ago',
      insights: 1203,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      id: 'echo',
      name: 'Echo Cultural Analytics',
      icon: <Users className="w-6 h-6" />,
      description: 'Cultural intelligence and team dynamics assessment',
      status: 'active',
      accuracy: 87,
      lastUpdate: '3 minutes ago',
      insights: 456,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'nova',
      name: 'Nova Innovations',
      icon: <Rocket className="w-6 h-6" />,
      description: 'Innovation pipeline management and breakthrough opportunity identification',
      status: 'active',
      accuracy: 91,
      lastUpdate: '4 minutes ago',
      insights: 329,
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const realtimeInsights = [
    "Organizational adaptability score increased 12% this quarter",
    "Crisis response readiness at 97% - protocols optimized",
    "Cross-functional collaboration efficiency up 23%",
    "Innovation pipeline identified 5 breakthrough opportunities",
    "Cultural alignment metrics show improved team dynamics"
  ];

  return (
    <VeridiusPageLayout>
      <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="p-8">
          {/* AI Intelligence Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Intelligence Center</h1>
                <p className="text-gray-600 dark:text-gray-300">Advanced Organizational Intelligence & Predictive Analytics</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="text-green-600 border-green-500/50">
                <Activity className="w-3 h-3 mr-1" />
                All Modules Active
              </Badge>
              <Badge className="bg-blue-600 text-white">
                Enterprise AI
              </Badge>
            </div>
          </div>

          {/* AI Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {aiModules.map((module) => (
              <Card 
                key={module.id} 
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  activeModule === module.id ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-slate-800'
                }`}
                onClick={() => setActiveModule(module.id)}
                data-testid={`card-ai-module-${module.id}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${module.color} text-white`}>
                      {module.icon}
                    </div>
                    <Badge variant={module.status === 'active' ? 'default' : 'secondary'}>
                      {module.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{module.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{module.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Accuracy</span>
                      <span className="font-semibold text-green-600">{module.accuracy}%</span>
                    </div>
                    <Progress value={module.accuracy} className="h-2" />
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Last Update: {module.lastUpdate}</span>
                      <span>{module.insights} insights</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Real-time Intelligence Feed */}
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                  Real-time Intelligence Feed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {realtimeInsights.map((insight, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-700 dark:text-gray-300">{insight}</p>
                        <p className="text-xs text-gray-500 mt-1">AI Confidence: {Math.floor(Math.random() * 10) + 85}%</p>
                      </div>
                      <Clock className="w-3 h-3 text-gray-400" />
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline" data-testid="button-view-all-insights">
                  View All Intelligence Reports
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* AI Module Controls */}
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <Target className="w-5 h-5 mr-2 text-blue-500" />
                  AI Intelligence Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Active Intelligence Module</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {aiModules.find(m => m.id === activeModule)?.description}
                  </p>
                  <div className="flex space-x-2">
                    <Button size="sm" data-testid="button-run-analysis">
                      Run Deep Analysis
                    </Button>
                    <Button size="sm" variant="outline" data-testid="button-export-insights">
                      Export Insights
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline" data-testid="button-predictive-analytics">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Run Predictive Analytics
                  </Button>
                  <Button className="w-full justify-start" variant="outline" data-testid="button-scenario-modeling">
                    <Globe className="w-4 h-4 mr-2" />
                    AI Scenario Modeling
                  </Button>
                  <Button className="w-full justify-start" variant="outline" data-testid="button-decision-intelligence">
                    <Target className="w-4 h-4 mr-2" />
                    Decision Intelligence
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="flex items-center text-yellow-800 dark:text-yellow-200">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">AI Intelligence Recommendation</span>
                  </div>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                    Based on current data, recommend immediate focus on crisis response protocol optimization and cross-functional team collaboration enhancement.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </VeridiusPageLayout>
  );
}