import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'wouter';
import VeridiusPageLayout from '@/components/layout/VeridiusPageLayout';
import { 
  Users, 
  Heart, 
  Brain,
  TrendingUp,
  MessageSquare,
  Target,
  Activity,
  Lightbulb,
  Award,
  Clock,
  BarChart3,
  PieChart,
  Globe,
  UserCheck,
  ArrowLeft,
  Home
} from 'lucide-react';

export default function EchoCulturalAnalytics() {
  const [selectedAnalysis, setSelectedAnalysis] = useState('overview');

  const culturalMetrics = [
    {
      id: 'engagement',
      name: 'Employee Engagement',
      value: 84.7,
      change: +5.2,
      status: 'excellent',
      description: 'Overall employee satisfaction and commitment levels',
      details: {
        participation: 92,
        satisfaction: 87,
        retention: 89,
        advocacy: 76
      },
      icon: <Heart className="h-5 w-5" />,
      color: 'emerald'
    },
    {
      id: 'collaboration',
      name: 'Team Collaboration',
      value: 78.9,
      change: +2.8,
      status: 'good',
      description: 'Cross-functional teamwork and knowledge sharing effectiveness',
      details: {
        crossTeam: 82,
        communication: 85,
        knowledge: 74,
        conflict: 23
      },
      icon: <Users className="h-5 w-5" />,
      color: 'blue'
    },
    {
      id: 'innovation',
      name: 'Innovation Culture',
      value: 91.3,
      change: +7.1,
      status: 'excellent',
      description: 'Creativity, risk-taking, and idea generation culture',
      details: {
        ideaGeneration: 94,
        riskTaking: 87,
        experimentation: 92,
        implementation: 89
      },
      icon: <Lightbulb className="h-5 w-5" />,
      color: 'purple'
    },
    {
      id: 'leadership',
      name: 'Leadership Trust',
      value: 73.4,
      change: -1.3,
      status: 'warning',
      description: 'Trust in leadership and organizational direction',
      details: {
        vision: 78,
        transparency: 71,
        decision: 69,
        support: 75
      },
      icon: <Award className="h-5 w-5" />,
      color: 'orange'
    }
  ];

  const teamDynamics = [
    {
      team: 'Engineering',
      engagement: 89,
      collaboration: 92,
      stress: 34,
      productivity: 87,
      retention: 94,
      size: 48
    },
    {
      team: 'Sales',
      engagement: 91,
      collaboration: 85,
      stress: 42,
      productivity: 89,
      retention: 87,
      size: 32
    },
    {
      team: 'Marketing',
      engagement: 86,
      collaboration: 88,
      stress: 28,
      productivity: 85,
      retention: 91,
      size: 24
    },
    {
      team: 'Operations',
      engagement: 78,
      collaboration: 74,
      stress: 51,
      productivity: 82,
      retention: 76,
      size: 19
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      blue: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      purple: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      orange: 'text-orange-400 bg-orange-500/10 border-orange-500/30'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

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
      <div className="min-h-screen bg-transparent p-6" data-testid="echo-cultural-analytics">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-1 h-auto">
                  <Home className="h-4 w-4" />
                </Button>
              </Link>
              <span>/</span>
              <span>AI Intelligence</span>
              <span>/</span>
              <span className="text-white">Echo Cultural Analytics</span>
            </div>
          </div>

          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Users className="h-10 w-10" />
                <div>
                  <h1 className="text-3xl font-bold" data-testid="echo-title">
                    Echo Cultural Analytics
                  </h1>
                  <p className="text-teal-100">Cultural intelligence and team dynamics assessment platform</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link to="/">
                  <Button variant="secondary" className="bg-teal-700 hover:bg-teal-800 text-teal-100 border-teal-600" data-testid="back-to-dashboard">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Badge variant="secondary" className="bg-teal-700 text-teal-100 border-teal-600" data-testid="ai-insights-badge">
                  <Brain className="h-4 w-4 mr-2" />
                  AI INSIGHTS
                </Badge>
                <Button variant="secondary" className="bg-cyan-600 hover:bg-cyan-700 text-white" data-testid="generate-report-button">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Culture Report
                </Button>
              </div>
            </div>
          </div>

          <Tabs value={selectedAnalysis} onValueChange={setSelectedAnalysis} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" data-testid="tab-overview">Cultural Overview</TabsTrigger>
              <TabsTrigger value="teams" data-testid="tab-teams">Team Dynamics</TabsTrigger>
              <TabsTrigger value="insights" data-testid="tab-insights">AI Insights</TabsTrigger>
              <TabsTrigger value="trends" data-testid="tab-trends">Trend Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Cultural Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {culturalMetrics.map((metric) => (
                  <Card key={metric.id} className="border-gray-700/50 bg-gray-900/50 backdrop-blur-sm" data-testid={`metric-${metric.id}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className={`p-2 rounded-lg ${getColorClasses(metric.color)}`}>
                          {metric.icon}
                        </div>
                        <Badge variant="outline" className={getStatusColor(metric.status)}>
                          {metric.status.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-white">{metric.name}</h3>
                          <span className={`text-sm font-medium ${metric.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {metric.change >= 0 ? '+' : ''}{metric.change}%
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-white">{metric.value}%</div>
                        <Progress value={metric.value} className="h-2" />
                        <p className="text-xs text-gray-400">{metric.description}</p>
                        
                        {/* Detailed Breakdown */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {Object.entries(metric.details).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-400 capitalize">{key}:</span>
                              <span className="text-white font-medium">{value}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Key Cultural Insights */}
              <Card className="border-purple-500/30 bg-purple-950/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-300">
                    <Brain className="h-5 w-5" />
                    Cultural Health Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-emerald-950/30 rounded-lg border border-emerald-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-emerald-400" />
                        <span className="font-medium text-emerald-300">Positive Trends</span>
                      </div>
                      <ul className="space-y-1 text-sm text-emerald-200">
                        <li>• Innovation culture surging (+7.1%)</li>
                        <li>• Employee engagement at 3-year high</li>
                        <li>• Cross-team collaboration improving</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-orange-950/30 rounded-lg border border-orange-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-orange-400" />
                        <span className="font-medium text-orange-300">Focus Areas</span>
                      </div>
                      <ul className="space-y-1 text-sm text-orange-200">
                        <li>• Leadership trust needs attention</li>
                        <li>• Operations team stress levels high</li>
                        <li>• Communication transparency gaps</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-blue-950/30 rounded-lg border border-blue-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="h-4 w-4 text-blue-400" />
                        <span className="font-medium text-blue-300">Recommendations</span>
                      </div>
                      <ul className="space-y-1 text-sm text-blue-200">
                        <li>• Leadership visibility sessions</li>
                        <li>• Operations workload review</li>
                        <li>• Transparent decision processes</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="teams" className="space-y-6">
              {/* Team Dynamics Comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {teamDynamics.map((team) => (
                  <Card key={team.team} className="border-gray-700/50 bg-gray-900/50 backdrop-blur-sm" data-testid={`team-${team.team.toLowerCase()}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-blue-500/10">
                            <Users className="h-5 w-5 text-blue-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{team.team} Team</h3>
                            <p className="text-sm text-gray-400">{team.size} members</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          {team.engagement}% ENGAGED
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-400">Collaboration</span>
                            <span className="text-emerald-400 font-medium">{team.collaboration}%</span>
                          </div>
                          <Progress value={team.collaboration} className="h-2" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-400">Productivity</span>
                            <span className="text-blue-400 font-medium">{team.productivity}%</span>
                          </div>
                          <Progress value={team.productivity} className="h-2" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-400">Retention</span>
                            <span className="text-purple-400 font-medium">{team.retention}%</span>
                          </div>
                          <Progress value={team.retention} className="h-2" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-400">Stress Level</span>
                            <span className="text-orange-400 font-medium">{team.stress}%</span>
                          </div>
                          <Progress value={team.stress} className="h-2" />
                        </div>
                      </div>
                      
                      <div className="pt-3 border-t border-gray-700/50">
                        <Button size="sm" variant="outline" className="w-full">
                          <UserCheck className="h-4 w-4 mr-2" />
                          Team Deep Dive
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <Card className="border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">AI-Powered Cultural Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">Advanced cultural pattern analysis and predictive insights</p>
                    <p className="text-sm text-gray-500 mt-2">AI-driven cultural transformation recommendations</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <Card className="border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Cultural Trend Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <PieChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">Historical cultural trends and future projections</p>
                    <p className="text-sm text-gray-500 mt-2">Multi-dimensional cultural evolution tracking</p>
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