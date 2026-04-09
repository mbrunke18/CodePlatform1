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
  Telescope,
  Download,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Minus
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
      case 'up': return <ArrowUp className="h-4 w-4 text-[#2B8A6E]" />;
      case 'down': return <ArrowDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-[#6B7280]" />;
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-[#F8F7F4] dark:bg-[#0A0F2E]">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#0A0F2E] dark:text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Strategy Execution Dashboard
              </h1>
              <p className="text-[#6B7280]">
                Track transformation progress, orchestration health, and anticipation insights
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2 border-[#E8E4DC] text-[#0A0F2E] dark:text-[#C9A84C]" onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button className="gap-2 bg-[#0A0F2E] text-white hover:bg-[#141B45]">
                <Download className="h-4 w-4" />
                Download Report
              </Button>
            </div>
          </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-[#E8E4DC]/30">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="capabilities" className="data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white">Leadership Capabilities</TabsTrigger>
            <TabsTrigger value="objectives" className="data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white">Strategic Objectives</TabsTrigger>
            <TabsTrigger value="anticipation" className="data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white">Anticipation Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-l-4 border-l-[#2B8A6E] border-[#E8E4DC] bg-white dark:bg-white/5 dark:border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#6B7280]">Quarterly Executions</p>
                      <p className="text-3xl font-bold text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{mockQuarterlyData.totalPlaybooksExecuted}</p>
                    </div>
                    <div className="p-3 bg-[#2B8A6E]/10">
                      <BarChart3 className="h-6 w-6 text-[#2B8A6E]" />
                    </div>
                  </div>
                  <p className="text-xs text-[#2B8A6E] mt-2">+23% vs last quarter</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-[#C9A84C] border-[#E8E4DC] bg-white dark:bg-white/5 dark:border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#6B7280]">Orchestration Health</p>
                      <p className="text-3xl font-bold text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{mockQuarterlyData.orchestrationHealthScore}%</p>
                    </div>
                    <div className="p-3 bg-[#C9A84C]/10">
                      <Layers className="h-6 w-6 text-[#C9A84C]" />
                    </div>
                  </div>
                  <Progress value={mockQuarterlyData.orchestrationHealthScore} className="mt-2 h-2" />
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-[#2B8A6E] border-[#E8E4DC] bg-white dark:bg-white/5 dark:border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#6B7280]">Anticipation Window</p>
                      <p className="text-3xl font-bold text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{mockQuarterlyData.anticipationWindowDays} days</p>
                    </div>
                    <div className="p-3 bg-[#2B8A6E]/10">
                      <Telescope className="h-6 w-6 text-[#2B8A6E]" />
                    </div>
                  </div>
                  <p className="text-xs text-[#2B8A6E] mt-2">Improved from 14 days</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-[#0A0F2E] dark:border-l-[#C9A84C] border-[#E8E4DC] bg-white dark:bg-white/5 dark:border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#6B7280]">Execution Velocity</p>
                      <p className="text-3xl font-bold text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{mockQuarterlyData.executionVelocityImprovement}X</p>
                    </div>
                    <div className="p-3 bg-[#0A0F2E]/10 dark:bg-[#C9A84C]/10">
                      <Zap className="h-6 w-6 text-[#0A0F2E] dark:text-[#C9A84C]" />
                    </div>
                  </div>
                  <p className="text-xs text-[#6B7280] mt-2">vs. industry average</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-[#E8E4DC] bg-white dark:bg-white/5 dark:border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    <Target className="h-5 w-5 text-[#2B8A6E]" />
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
                          <div className="p-2 bg-[#F8F7F4] dark:bg-white/10">
                            <Icon className="h-4 w-4 text-[#2B8A6E]" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-[#0A0F2E] dark:text-white">{objective.name}</span>
                              <Badge variant="outline" className="border-[#E8E4DC] text-[#6B7280]">{(objective as any).executionCount || 0} executions</Badge>
                            </div>
                            <Progress value={(objective as any).progress || 0} className="h-2" />
                          </div>
                          <span className="text-sm font-semibold text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{(objective as any).progress || 0}%</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#E8E4DC] bg-white dark:bg-white/5 dark:border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    <Layers className="h-5 w-5 text-[#C9A84C]" />
                    Leadership Capability Balance
                  </CardTitle>
                  <CardDescription>Execution distribution across capabilities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockCapabilityMetrics.map((capability) => {
                      const Icon = capabilityIcons[capability.id] || Target;
                      return (
                        <div key={capability.id} className="flex items-center gap-4">
                          <div className="p-2 bg-[#C9A84C]/10">
                            <Icon className="h-4 w-4 text-[#C9A84C]" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-medium text-[#0A0F2E] dark:text-white">{capability.name}</span>
                                <p className="text-xs text-[#6B7280]">{capability.domains.join(', ')}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {getTrendIcon(capability.trend)}
                                <span className="font-semibold text-[#0A0F2E] dark:text-white">{capability.executions}</span>
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
                  <Card key={key} className="bg-white dark:bg-white/5 border-[#E8E4DC] dark:border-white/10 ">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-[#0A0F2E]/5 dark:bg-white/5">
                          <Icon className="h-6 w-6 text-[#C9A84C]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-[#0A0F2E] dark:text-white">{capability.name}</h3>
                          <p className="text-sm text-[#6B7280] dark:text-[#E8E4DC] mb-4">{capability.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs border-[#E8E4DC] text-[#6B7280]">
                              {metrics?.executions || 0} executions this quarter
                            </Badge>
                            {metrics && getTrendIcon(metrics.trend)}
                          </div>
                          <div className="mt-4">
                            <p className="text-xs text-[#6B7280] mb-1">Domains</p>
                            <div className="flex flex-wrap gap-1">
                              {capability.domains.map((domain) => (
                                <Badge key={domain} variant="secondary" className="text-xs bg-[#E8E4DC]/30 text-[#0A0F2E] dark:text-white border-none">
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
            <Card className="bg-white dark:bg-white/5 border-[#E8E4DC] dark:border-white/10">
              <CardHeader>
                <CardTitle className="text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Strategic Objectives</CardTitle>
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
                        <div key={objective.id} className="p-4 border border-[#E8E4DC] dark:border-white/10">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-[#F8F7F4] dark:bg-white/5">
                                <Icon className="h-5 w-5 text-[#2B8A6E]" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-[#0A0F2E] dark:text-white">{objective.name}</h4>
                                <p className="text-sm text-[#6B7280]">Aligned to {capability} capability</p>
                              </div>
                            </div>
                            <Badge className="bg-[#2B8A6E]/10 text-[#2B8A6E] border-[#2B8A6E]/20">
                              {(objective as any).executionCount || 0} playbook executions
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-[#6B7280]">Progress toward goal</span>
                              <span className="font-semibold text-[#0A0F2E] dark:text-white">{(objective as any).progress || 0}%</span>
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
              <Card className="bg-white dark:bg-white/5 border-[#E8E4DC] dark:border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    <Telescope className="h-5 w-5 text-[#2B8A6E]" />
                    Emerging Signals
                  </CardTitle>
                  <CardDescription>Early warnings detected by VaughnMartin Signal™</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAnticipationSignals.map((signal) => (
                      <div key={signal.id} className="p-4 border border-[#E8E4DC] dark:border-white/10 hover:bg-[#F8F7F4] dark:hover:bg-white/5 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-[#0A0F2E] dark:text-white">{signal.name}</h4>
                          <Badge 
                            className={
                              signal.timeHorizon === 'urgent' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                              signal.timeHorizon === 'emerging' ? 'bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20' :
                              'bg-[#0A0F2E]/10 text-[#0A0F2E] dark:text-white border-[#0A0F2E]/20'
                            }
                          >
                            {signal.timeHorizon}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-[#6B7280]">Magnitude</p>
                            <p className="font-semibold text-[#0A0F2E] dark:text-white">{signal.magnitude}/10</p>
                          </div>
                          <div>
                            <p className="text-[#6B7280]">Relevance</p>
                            <p className="font-semibold text-[#0A0F2E] dark:text-white">{signal.relevance}/10</p>
                          </div>
                          <div>
                            <p className="text-[#6B7280]">Window</p>
                            <p className="font-semibold text-[#0A0F2E] dark:text-white">{signal.windowDays} days</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-white/5 border-[#E8E4DC] dark:border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    <TrendingUp className="h-5 w-5 text-[#C9A84C]" />
                    Anticipation Performance
                  </CardTitle>
                  <CardDescription>How well you're seeing things coming</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center p-6 bg-[#2B8A6E]/5 border border-[#2B8A6E]/30">
                      <p className="text-4xl font-bold text-[#2B8A6E] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>6 weeks</p>
                      <p className="text-[#6B7280]">Average anticipation window</p>
                      <p className="text-sm text-[#2B8A6E] mt-2 font-semibold">Improved from 2 weeks last quarter</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-[#F8F7F4] dark:bg-white/5 border border-[#E8E4DC] dark:border-white/10 text-center">
                        <p className="text-2xl font-bold text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>12</p>
                        <p className="text-sm text-[#6B7280]">Signals converted to executions</p>
                      </div>
                      <div className="p-4 bg-[#F8F7F4] dark:bg-white/5 border border-[#E8E4DC] dark:border-white/10 text-center">
                        <p className="text-2xl font-bold text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>3</p>
                        <p className="text-sm text-[#6B7280]">Emerging opportunities</p>
                      </div>
                    </div>

                    <div className="p-4 border border-[#C9A84C]/30 bg-[#C9A84C]/5">
                      <h4 className="font-semibold text-[#0A0F2E] dark:text-white mb-2">Anticipation Insight</h4>
                      <p className="text-sm text-[#6B7280] dark:text-[#E8E4DC]">
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
