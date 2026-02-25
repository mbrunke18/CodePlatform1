import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import PageLayout from '@/components/layout/PageLayout';
import { useQuery } from '@tanstack/react-query';
import type { StrategicObjective } from '@shared/schema';
import { 
  TrendingUp, 
  Target, 
  Zap, 
  Shield, 
  Heart, 
  Layers,
  BarChart3,
  Clock,
  Telescope,
  Download,
  RefreshCw,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Minus,
  Plus
} from 'lucide-react';
import { LEADERSHIP_CAPABILITIES } from '@shared/constants/framework';

const capabilityIcons: Record<string, any> = {
  foresight: Telescope,
  courage: Shield,
  agility: Zap,
  purpose: Heart,
  orchestration: Layers,
};

const mockQuarterlyData = {
  quarter: 'Q1 2026',
  totalPlaybooksExecuted: 47,
  strategicGoalsAdvanced: 12,
  crossDomainActivations: 8,
  orchestrationHealthScore: 94,
  anticipationWindowDays: 42,
  executionVelocityImprovement: 340,
};

const mockCapabilityMetrics = [
  { id: 'foresight', name: 'Foresight', executions: 12, trend: 'up', domains: ['Market Entry', 'Competitive Response'] },
  { id: 'courage', name: 'Courage', executions: 8, trend: 'up', domains: ['M&A', 'Product Launch'] },
  { id: 'agility', name: 'Agility', executions: 15, trend: 'stable', domains: ['Digital Transformation', 'AI Governance'] },
  { id: 'purpose', name: 'Purpose', executions: 9, trend: 'down', domains: ['Regulatory', 'Crisis Management'] },
  { id: 'orchestration', name: 'Orchestration', executions: 3, trend: 'up', domains: ['Cross-Domain'] },
];

const fallbackStrategicObjectives = [
  { id: '1', name: 'Revenue Growth 2026', progress: 68, executionCount: 14, leadershipCapability: 'foresight' },
  { id: '2', name: 'Market Leadership', progress: 45, executionCount: 8, leadershipCapability: 'courage' },
  { id: '3', name: 'Digital First', progress: 82, executionCount: 15, leadershipCapability: 'agility' },
  { id: '4', name: 'Regulatory Excellence', progress: 91, executionCount: 6, leadershipCapability: 'purpose' },
];

const mockAnticipationSignals = [
  { id: '1', name: 'Competitor Product Launch', magnitude: 8, timeHorizon: 'emerging', relevance: 9, windowDays: 45 },
  { id: '2', name: 'Regulatory Change', magnitude: 6, timeHorizon: 'developing', relevance: 8, windowDays: 60 },
  { id: '3', name: 'Market Opportunity', magnitude: 7, timeHorizon: 'urgent', relevance: 9, windowDays: 14 },
];

export default function StrategyExecutionDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const { data: strategicObjectives, isLoading: objectivesLoading, refetch } = useQuery<StrategicObjective[]>({
    queryKey: ['/api/strategic-objectives'],
  });

  const objectives = strategicObjectives?.length ? strategicObjectives : fallbackStrategicObjectives;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'down': return <ArrowDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-800 dark:text-slate-200" />;
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Strategy Execution Dashboard
              </h1>
              <p className="text-gray-800 dark:text-slate-300">
                Track transformation progress, orchestration health, and anticipation insights
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2" onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button className="gap-2 bg-poise-teal hover:bg-cyan-600">
                <Download className="h-4 w-4" />
                Download Report
              </Button>
            </div>
          </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="capabilities">Leadership Capabilities</TabsTrigger>
            <TabsTrigger value="objectives">Strategic Objectives</TabsTrigger>
            <TabsTrigger value="anticipation">Anticipation Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-l-4 border-l-poise-teal">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-800 dark:text-slate-300">Quarterly Executions</p>
                      <p className="text-3xl font-bold text-slate-900 dark:text-white">{mockQuarterlyData.totalPlaybooksExecuted}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-poise-teal/20">
                      <BarChart3 className="h-6 w-6 text-poise-teal" />
                    </div>
                  </div>
                  <p className="text-xs text-emerald-700 mt-2">+23% vs last quarter</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-poise-gold">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-800 dark:text-slate-300">Orchestration Health</p>
                      <p className="text-3xl font-bold text-slate-900 dark:text-white">{mockQuarterlyData.orchestrationHealthScore}%</p>
                    </div>
                    <div className="p-3 rounded-xl bg-poise-gold/20">
                      <Layers className="h-6 w-6 text-poise-gold" />
                    </div>
                  </div>
                  <Progress value={mockQuarterlyData.orchestrationHealthScore} className="mt-2 h-2" />
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-emerald-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-800 dark:text-slate-300">Anticipation Window</p>
                      <p className="text-3xl font-bold text-slate-900 dark:text-white">{mockQuarterlyData.anticipationWindowDays} days</p>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-500/20">
                      <Telescope className="h-6 w-6 text-emerald-500" />
                    </div>
                  </div>
                  <p className="text-xs text-emerald-700 mt-2">Improved from 14 days</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-violet-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-800 dark:text-slate-300">Execution Velocity</p>
                      <p className="text-3xl font-bold text-slate-900 dark:text-white">{mockQuarterlyData.executionVelocityImprovement}X</p>
                    </div>
                    <div className="p-3 rounded-xl bg-violet-500/20">
                      <Zap className="h-6 w-6 text-violet-500" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-800 dark:text-slate-200 mt-2">vs. industry average</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-poise-teal" />
                    Strategic Goal Progress
                  </CardTitle>
                  <CardDescription>Objectives advanced by playbook executions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {objectives.map((objective) => {
                      const capability = (objective as any).leadershipCapability || 'orchestration';
                      const Icon = capabilityIcons[capability] || Target;
                      return (
                        <div key={objective.id} className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                            <Icon className="h-4 w-4 text-poise-teal" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-slate-900 dark:text-white">{objective.name}</span>
                              <Badge variant="outline">{(objective as any).executionCount || 0} executions</Badge>
                            </div>
                            <Progress value={(objective as any).progress || 0} className="h-2" />
                          </div>
                          <span className="text-sm font-semibold text-gray-800 dark:text-slate-200">{(objective as any).progress || 0}%</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-poise-gold" />
                    Leadership Capability Balance
                  </CardTitle>
                  <CardDescription>Execution distribution across capabilities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockCapabilityMetrics.map((capability) => {
                      const Icon = capabilityIcons[capability.id] || Target;
                      const capabilityData = LEADERSHIP_CAPABILITIES[capability.id.toUpperCase() as keyof typeof LEADERSHIP_CAPABILITIES];
                      return (
                        <div key={capability.id} className="flex items-center gap-4">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: `${capabilityData?.color}20` }}>
                            <Icon className="h-4 w-4" style={{ color: capabilityData?.color }} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-medium text-slate-900 dark:text-white">{capability.name}</span>
                                <p className="text-xs text-gray-800 dark:text-slate-200">{capability.domains.join(', ')}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {getTrendIcon(capability.trend)}
                                <span className="font-semibold">{capability.executions}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="capabilities">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(LEADERSHIP_CAPABILITIES).map(([key, capability]) => {
                const Icon = capabilityIcons[capability.id] || Target;
                const metrics = mockCapabilityMetrics.find(m => m.id === capability.id);
                return (
                  <Card key={key} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl" style={{ backgroundColor: `${capability.color}20` }}>
                          <Icon className="h-6 w-6" style={{ color: capability.color }} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white">{capability.name}</h3>
                          <p className="text-sm text-gray-800 dark:text-slate-300 mb-4">{capability.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {metrics?.executions || 0} executions this quarter
                            </Badge>
                            {metrics && getTrendIcon(metrics.trend)}
                          </div>
                          <div className="mt-4">
                            <p className="text-xs text-gray-800 dark:text-slate-200 mb-1">Domains</p>
                            <div className="flex flex-wrap gap-1">
                              {capability.domains.map((domain) => (
                                <Badge key={domain} variant="secondary" className="text-xs">
                                  {domain.replace(/-/g, ' ')}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="objectives">
            <Card>
              <CardHeader>
                <CardTitle>Strategic Objectives</CardTitle>
                <CardDescription>Track progress toward organization-level strategic goals</CardDescription>
              </CardHeader>
              <CardContent>
                {objectivesLoading ? (
                  <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-28 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {objectives.map((objective) => {
                      const capability = (objective as any).leadershipCapability || 'orchestration';
                      const Icon = capabilityIcons[capability] || Target;
                      return (
                        <div key={objective.id} className="p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                                <Icon className="h-5 w-5 text-poise-teal" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-slate-900 dark:text-white">{objective.name}</h4>
                                <p className="text-sm text-gray-800 dark:text-slate-200">Aligned to {capability} capability</p>
                              </div>
                            </div>
                            <Badge className="bg-poise-teal/20 text-poise-teal">
                              {(objective as any).executionCount || 0} playbook executions
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-800 dark:text-slate-300">Progress toward goal</span>
                              <span className="font-semibold text-slate-900 dark:text-white">{(objective as any).progress || 0}%</span>
                            </div>
                            <Progress value={(objective as any).progress || 0} className="h-3" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="anticipation">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Telescope className="h-5 w-5 text-emerald-500" />
                    Emerging Signals
                  </CardTitle>
                  <CardDescription>Early warnings detected by Execution OS Signal</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAnticipationSignals.map((signal) => (
                      <div key={signal.id} className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-slate-900 dark:text-white">{signal.name}</h4>
                          <Badge 
                            className={
                              signal.timeHorizon === 'urgent' ? 'bg-red-500' :
                              signal.timeHorizon === 'emerging' ? 'bg-amber-500' :
                              'bg-blue-500'
                            }
                          >
                            {signal.timeHorizon}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-800 dark:text-slate-200">Magnitude</p>
                            <p className="font-semibold">{signal.magnitude}/10</p>
                          </div>
                          <div>
                            <p className="text-gray-800 dark:text-slate-200">Relevance</p>
                            <p className="font-semibold">{signal.relevance}/10</p>
                          </div>
                          <div>
                            <p className="text-gray-800 dark:text-slate-200">Window</p>
                            <p className="font-semibold">{signal.windowDays} days</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-poise-gold" />
                    Anticipation Performance
                  </CardTitle>
                  <CardDescription>How well you're seeing things coming</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center p-6 rounded-xl bg-gradient-to-br from-poise-teal/10 to-emerald-500/10 border border-poise-teal/30">
                      <p className="text-4xl font-bold text-poise-teal mb-2">6 weeks</p>
                      <p className="text-gray-800 dark:text-slate-300">Average anticipation window</p>
                      <p className="text-sm text-emerald-700 mt-2">Improved from 2 weeks last quarter</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800 text-center">
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">12</p>
                        <p className="text-sm text-gray-800 dark:text-slate-200">Signals converted to executions</p>
                      </div>
                      <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800 text-center">
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">3</p>
                        <p className="text-sm text-gray-800 dark:text-slate-200">Emerging opportunities</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-poise-gold/30 bg-poise-gold/5">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Anticipation Insight</h4>
                      <p className="text-sm text-gray-800 dark:text-slate-300">
                        Your organization detected 3 signals 4+ weeks before threshold, enabling proactive response. Competitors are likely still reacting to what you anticipated.
                      </p>
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
