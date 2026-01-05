import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import VeridiusPageLayout from '@/components/layout/VeridiusPageLayout';
import { 
  Activity, 
  TrendingUp, 
  Users, 
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Brain,
  BarChart3,
  ArrowLeft,
  Home
} from 'lucide-react';

export default function PulseIntelligence() {
  const [selectedMetric, setSelectedMetric] = useState('overview');

  // Real-time pulse metrics
  const { data: pulseMetrics } = useQuery({
    queryKey: ['/api/dashboard/metrics'],
    refetchInterval: 30000, // Real-time updates every 30s
  });

  const healthMetrics = [
    {
      id: 'organizational-health',
      name: 'Organizational Health',
      value: 87.6,
      change: +2.4,
      status: 'excellent',
      description: 'Overall organizational resilience and performance',
      icon: <Activity className="h-5 w-5" />,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10'
    },
    {
      id: 'agility-score',
      name: 'Enterprise Agility',
      value: 94.2,
      change: +1.6,
      status: 'excellent', 
      description: 'Ability to adapt and respond to market changes',
      icon: <Zap className="h-5 w-5" />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      id: 'risk-exposure',
      name: 'Risk Exposure',
      value: 23.1,
      change: -4.2,
      status: 'good',
      description: 'Current organizational risk level and vulnerabilities',
      icon: <AlertTriangle className="h-5 w-5" />,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    },
    {
      id: 'innovation-index',
      name: 'Innovation Index',
      value: 91.4,
      change: +3.2,
      status: 'excellent',
      description: 'Innovation capability and breakthrough potential',
      icon: <Brain className="h-5 w-5" />,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'good': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'warning': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <VeridiusPageLayout>
      <div className="h-full bg-transparent p-4" data-testid="pulse-intelligence">
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
              <span className="text-white">Pulse Intelligence</span>
            </div>
          </div>

          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 rounded-lg flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Activity className="h-10 w-10" />
                <div>
                  <h1 className="text-3xl font-bold" data-testid="pulse-title">
                    Pulse Intelligence
                  </h1>
                  <p className="text-emerald-100">Real-time organizational health and performance analytics</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link to="/">
                  <Button variant="secondary" className="bg-emerald-700 hover:bg-emerald-800 text-emerald-100 border-emerald-600" data-testid="back-to-dashboard">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Badge variant="secondary" className="bg-emerald-700 text-emerald-100 border-emerald-600" data-testid="live-status">
                  <div className="w-2 h-2 bg-emerald-300 rounded-full mr-2 animate-pulse"></div>
                  LIVE MONITORING
                </Badge>
              </div>
            </div>
          </div>

          <Tabs value={selectedMetric} onValueChange={setSelectedMetric} className="w-full flex-1 flex flex-col min-h-0">
            <TabsList className="grid w-full grid-cols-4 flex-shrink-0">
              <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
              <TabsTrigger value="health" data-testid="tab-health">Health Metrics</TabsTrigger>
              <TabsTrigger value="trends" data-testid="tab-trends">Trend Analysis</TabsTrigger>
              <TabsTrigger value="alerts" data-testid="tab-alerts">AI Alerts</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Real-time Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {healthMetrics.map((metric) => (
                  <Card key={metric.id} className="border-gray-700/50 bg-gray-900/50 backdrop-blur-sm" data-testid={metric.id === 'organizational-health' ? 'organizational-health-metric' : `metric-${metric.id}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                          <div className={metric.color}>
                            {metric.icon}
                          </div>
                        </div>
                        <Badge variant="outline" className={getStatusColor(metric.status)}>
                          {metric.status.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-white">{metric.name}</h3>
                          <span className={`text-sm font-medium ${metric.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {metric.change >= 0 ? '+' : ''}{metric.change}%
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-white">{metric.value}%</div>
                        <Progress value={metric.value} className="h-2" />
                        <p className="text-xs text-gray-400">{metric.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Key Insights */}
              <Card className="border-blue-500/30 bg-blue-950/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-300">
                    <Brain className="h-5 w-5" />
                    AI-Generated Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-emerald-950/30 rounded-lg border border-emerald-500/30">
                      <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5" />
                      <div>
                        <p className="text-emerald-300 font-medium">Strong Performance Trajectory</p>
                        <p className="text-emerald-200 text-sm">Your organization shows excellent adaptability with 94.2% agility score, indicating strong resilience to market changes.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-blue-950/30 rounded-lg border border-blue-500/30">
                      <TrendingUp className="h-5 w-5 text-blue-400 mt-0.5" />
                      <div>
                        <p className="text-blue-300 font-medium">Innovation Pipeline Accelerating</p>
                        <p className="text-blue-200 text-sm">91.4% innovation index with +3.2% growth suggests breakthrough opportunities emerging in Q4.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-orange-950/30 rounded-lg border border-orange-500/30">
                      <AlertTriangle className="h-5 w-5 text-orange-400 mt-0.5" />
                      <div>
                        <p className="text-orange-300 font-medium">Risk Mitigation Success</p>
                        <p className="text-orange-200 text-sm">Risk exposure decreased by 4.2%, indicating effective crisis preparedness and proactive management.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="health" className="space-y-6">
              <Card className="border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Detailed Health Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">Detailed health metrics and predictive analysis coming soon</p>
                    <p className="text-sm text-gray-500 mt-2">AI-powered health forecasting and recommendations</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <Card className="border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Trend Analysis & Predictions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">Historical trends and predictive analytics</p>
                    <p className="text-sm text-gray-500 mt-2">Multi-dimensional trend analysis with AI predictions</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-6">
              <Card className="border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">AI-Powered Alerts & Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">Intelligent alerts and proactive recommendations</p>
                    <p className="text-sm text-gray-500 mt-2">AI-driven insights for executive decision making</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </VeridiusPageLayout>
  );
}