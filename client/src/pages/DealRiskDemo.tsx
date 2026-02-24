import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import StandardNav from '@/components/layout/StandardNav';
import Footer from '@/components/layout/Footer';
import { DealRiskCommandCenter } from '@/components/DealRiskCommandCenter';
import { apiRequest, queryClient } from '@/lib/queryClient';
import {
  BookOpen,
  Radar,
  Radio,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  DollarSign,
  Users,
  Zap,
  RefreshCw,
  Play,
  ChevronRight,
  Lightbulb,
  Target,
  TrendingUp,
  Brain,
  Shield,
  Clock,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

type Phase = 'identify' | 'detect' | 'execute' | 'advance';

const PHASES = [
  { id: 'identify' as Phase, name: 'IDENTIFY', icon: BookOpen, color: 'violet' },
  { id: 'detect' as Phase, name: 'DETECT', icon: Radar, color: 'blue' },
  { id: 'execute' as Phase, name: 'EXECUTE', icon: Radio, color: 'emerald' },
  { id: 'advance' as Phase, name: 'ADVANCE', icon: BarChart3, color: 'amber' },
];

export default function DealRiskDemo() {
  const [currentPhase, setCurrentPhase] = useState<Phase>('identify');
  const [completedPhases, setCompletedPhases] = useState<Phase[]>([]);
  const [execution, setExecution] = useState<any>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [learnings, setLearnings] = useState<any>(null);

  const { data: status, refetch: refetchStatus } = useQuery({
    queryKey: ['/api/demo/deal-risk/status'],
  });

  const { data: pipeline } = useQuery({
    queryKey: ['/api/demo/deal-risk/identify/pipeline'],
    enabled: currentPhase === 'identify' || currentPhase === 'detect',
  });

  const resetMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/demo/deal-risk/reset'),
    onSuccess: () => {
      setCurrentPhase('identify');
      setCompletedPhases([]);
      setExecution(null);
      setLearnings(null);
      queryClient.invalidateQueries({ queryKey: ['/api/demo/deal-risk'] });
    },
  });

  const connectSalesforceMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/demo/deal-risk/identify/connect-salesforce'),
    onSuccess: () => refetchStatus(),
  });

  const connectSlackMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/demo/deal-risk/identify/connect-slack'),
    onSuccess: () => refetchStatus(),
  });

  const connectJiraMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/demo/deal-risk/identify/connect-jira'),
    onSuccess: () => refetchStatus(),
  });

  const selectPlaybookMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/demo/deal-risk/identify/select-playbook'),
    onSuccess: () => {
      refetchStatus();
      setCompletedPhases(prev => [...prev, 'identify']);
      setCurrentPhase('detect');
    },
  });

  const startMonitoringMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/demo/deal-risk/detect/start-monitoring'),
    onSuccess: () => refetchStatus(),
  });

  const executeTriggerMutation = useMutation({
    mutationFn: async (dealId: string) => {
      const res = await apiRequest('POST', '/api/demo/deal-risk/execute/trigger', { dealId });
      return res.json();
    },
    onSuccess: (data: any) => {
      setCompletedPhases(prev => [...prev, 'detect']);
      setCurrentPhase('execute');
      setExecution(data.execution);
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
        setCompletedPhases(prev => [...prev, 'execute']);
        setCurrentPhase('advance');
      }, 10000);
    },
  });

  const advanceCompleteMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/demo/deal-risk/advance/complete');
      return res.json();
    },
    onSuccess: (data) => {
      setLearnings(data.learnings);
      setCompletedPhases(prev => [...prev, 'advance']);
    },
  });

  interface DemoStatus {
    phase: string;
    integrations: { salesforce: boolean; slack: boolean; jira: boolean; calendar: boolean };
    playbook: { id: string; name: string; triggers: string[] } | null;
    monitoring: boolean;
    currentExecution: any;
  }

  interface PipelineData {
    deals: any[];
    summary: { totalDeals: number; totalPipeline: number; dealsAtRisk: number; atRiskValue: number };
  }

  const typedStatus = status as DemoStatus | undefined;
  const typedPipeline = pipeline as PipelineData | undefined;
  const integrations = typedStatus?.integrations || { salesforce: false, slack: false, jira: false, calendar: false };
  const allIntegrationsConnected = Boolean(integrations.salesforce && integrations.slack && integrations.jira);

  const getPhaseProgress = () => {
    const phaseIndex = PHASES.findIndex(p => p.id === currentPhase);
    return ((phaseIndex + 1) / PHASES.length) * 100;
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <StandardNav />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <Badge className="mb-4 bg-amber-500/20 text-amber-400 border-amber-500/30">
            Interactive Demo
          </Badge>
          <h1 className="text-4xl font-bold text-white mb-4">
            Deal Risk Response Demo
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-200 max-w-2xl mx-auto">
            Experience the full IDEA Framework in action. Watch how Execution OS detects a deal at risk and orchestrates a coordinated response in 12 minutes.
          </p>
          <Button 
            variant="outline" 
            onClick={() => resetMutation.mutate()}
            className="mt-4 border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Demo
          </Button>
        </div>

        <div className="flex items-center justify-between mb-8 bg-slate-900/50 rounded-xl p-4 border border-slate-800">
          {PHASES.map((phase, index) => {
            const isCompleted = completedPhases.includes(phase.id);
            const isCurrent = currentPhase === phase.id;
            const Icon = phase.icon;
            
            return (
              <div key={phase.id} className="flex items-center">
                <button
                  onClick={() => isCompleted && setCurrentPhase(phase.id)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                    isCurrent 
                      ? 'bg-white/10 border border-white/20' 
                      : isCompleted 
                        ? 'bg-emerald-500/10 border border-emerald-500/30 cursor-pointer hover:bg-emerald-500/20' 
                        : 'opacity-50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    isCurrent ? `bg-${phase.color}-500` : isCompleted ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    ) : (
                      <Icon className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-slate-600 dark:text-slate-200">Phase {index + 1}</div>
                    <div className={`font-semibold ${isCurrent ? 'text-white' : 'text-slate-600 dark:text-slate-200'}`}>
                      {phase.name}
                    </div>
                  </div>
                </button>
                {index < PHASES.length - 1 && (
                  <ChevronRight className="h-5 w-5 text-slate-400 mx-2" />
                )}
              </div>
            );
          })}
        </div>

        <Progress value={getPhaseProgress()} className="mb-8 h-2" />

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {currentPhase === 'identify' && (
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-violet-400" />
                    IDENTIFY Phase
                  </CardTitle>
                  <CardDescription>
                    Connect your systems and select a playbook
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <span className="text-white">Salesforce</span>
                      {integrations.salesforce ? (
                        <Badge className="bg-emerald-500/20 text-emerald-400">Connected</Badge>
                      ) : (
                        <Button size="sm" onClick={() => connectSalesforceMutation.mutate()}>
                          Connect
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <span className="text-white">Slack</span>
                      {integrations.slack ? (
                        <Badge className="bg-emerald-500/20 text-emerald-400">Connected</Badge>
                      ) : (
                        <Button size="sm" onClick={() => connectSlackMutation.mutate()}>
                          Connect
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <span className="text-white">Jira</span>
                      {integrations.jira ? (
                        <Badge className="bg-emerald-500/20 text-emerald-400">Connected</Badge>
                      ) : (
                        <Button size="sm" onClick={() => connectJiraMutation.mutate()}>
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>

                  {allIntegrationsConnected && !typedStatus?.playbook && (
                    <Button 
                      className="w-full bg-violet-600 hover:bg-violet-700"
                      onClick={() => selectPlaybookMutation.mutate()}
                    >
                      Select Deal Risk Response Playbook
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}

                  {typedStatus?.playbook && (
                    <div className="p-4 bg-violet-500/10 border border-violet-500/30 rounded-lg">
                      <div className="flex items-center gap-2 text-violet-400 mb-2">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="font-medium">Playbook Configured</span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-200">
                        {typedStatus.playbook.name} with {typedStatus.playbook.triggers.length} trigger conditions
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {currentPhase === 'detect' && (
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Radar className="h-5 w-5 text-blue-400" />
                    DETECT Phase
                  </CardTitle>
                  <CardDescription>
                    Monitor deals for risk signals
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!typedStatus?.monitoring && (
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => startMonitoringMutation.mutate()}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Start Monitoring
                    </Button>
                  )}

                  {typedStatus?.monitoring && typedPipeline?.deals && (
                    <div className="space-y-3">
                      <p className="text-sm text-emerald-400 flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        Monitoring {typedPipeline.deals.length} deals...
                      </p>
                      {typedPipeline.deals.filter((d: any) => d.riskScore > 60).map((deal: any) => (
                        <div 
                          key={deal.id}
                          className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium">{deal.dealName}</span>
                            <Badge className="bg-red-500/20 text-red-400">
                              {deal.riskScore}% Risk
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-200 mb-3">
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              ${(deal.amount / 1000000).toFixed(1)}M
                            </span>
                            <span>{deal.triggers.length} triggers</span>
                          </div>
                          <Button 
                            className="w-full bg-red-600 hover:bg-red-700"
                            onClick={() => executeTriggerMutation.mutate(deal.id)}
                          >
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Execute Risk Response
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {currentPhase === 'execute' && (
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Radio className="h-5 w-5 text-emerald-400" />
                    EXECUTE Phase
                  </CardTitle>
                  <CardDescription>
                    Coordinated response in progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DealRiskCommandCenter 
                    execution={execution} 
                    isAnimating={isAnimating}
                  />
                </CardContent>
              </Card>
            )}

            {currentPhase === 'advance' && (
              <div className="space-y-6">
                <Card className="bg-slate-900 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-amber-400" />
                      ADVANCE Phase
                    </CardTitle>
                    <CardDescription>
                      Capture learnings and strengthen your playbook
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!completedPhases.includes('advance') ? (
                      <div className="space-y-4">
                        <p className="text-slate-600 dark:text-slate-200">
                          Execution OS captures institutional knowledge from every execution, so your organization gets smarter with each response.
                        </p>
                        <Button 
                          className="w-full bg-amber-600 hover:bg-amber-700"
                          onClick={() => advanceCompleteMutation.mutate()}
                          disabled={advanceCompleteMutation.isPending}
                        >
                          {advanceCompleteMutation.isPending ? (
                            <>
                              <Brain className="mr-2 h-4 w-4 animate-pulse" />
                              Analyzing Execution...
                            </>
                          ) : (
                            <>
                              <Sparkles className="mr-2 h-4 w-4" />
                              Generate Insights & Recommendations
                            </>
                          )}
                        </Button>
                      </div>
                    ) : learnings ? (
                      <div className="space-y-6">
                        {/* Success Banner */}
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                          <div className="flex items-center gap-2 text-emerald-400 mb-1">
                            <CheckCircle2 className="h-5 w-5" />
                            <span className="font-medium">Execution Complete - Learnings Captured</span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-200">
                            {learnings.dealContext?.dealName} - ${((learnings.dealContext?.dealAmount || 0) / 1000000).toFixed(1)}M protected
                          </p>
                        </div>

                        {/* What Worked Well */}
                        <div>
                          <h4 className="text-sm font-medium text-emerald-400 mb-3 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            What Worked Well
                          </h4>
                          <div className="space-y-2">
                            {learnings.successPatterns?.map((pattern: any, i: number) => (
                              <div key={i} className="p-3 bg-slate-800/50 rounded-lg border-l-2 border-emerald-500">
                                <div className="flex items-center gap-2 mb-1">
                                  {pattern.icon === 'radar' && <Radar className="h-4 w-4 text-emerald-400" />}
                                  {pattern.icon === 'users' && <Users className="h-4 w-4 text-emerald-400" />}
                                  {pattern.icon === 'zap' && <Zap className="h-4 w-4 text-emerald-400" />}
                                  <span className="text-white text-sm font-medium">{pattern.category}</span>
                                </div>
                                <p className="text-sm text-slate-300">{pattern.insight}</p>
                                <p className="text-xs text-slate-300 mt-1">{pattern.impact}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Playbook Improvements */}
                        <div>
                          <h4 className="text-sm font-medium text-amber-400 mb-3 flex items-center gap-2">
                            <Lightbulb className="h-4 w-4" />
                            Recommended Playbook Improvements
                          </h4>
                          <div className="space-y-2">
                            {learnings.playbookImprovements?.map((improvement: any, i: number) => (
                              <div key={i} className="p-3 bg-slate-800/50 rounded-lg">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-white text-sm font-medium">{improvement.title}</span>
                                  <Badge className={improvement.priority === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}>
                                    {improvement.priority}
                                  </Badge>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-200">{improvement.description}</p>
                                <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                                  <ArrowUpRight className="h-3 w-3" />
                                  {improvement.estimatedImpact}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Institutional Knowledge */}
                        {learnings.institutionalKnowledge?.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-purple-400 mb-3 flex items-center gap-2">
                              <Brain className="h-4 w-4" />
                              Institutional Knowledge Captured
                            </h4>
                            {learnings.institutionalKnowledge.map((knowledge: any, i: number) => (
                              <div key={i} className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                                <div className="text-white text-sm font-medium mb-2">{knowledge.pattern}</div>
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                  <div>
                                    <span className="text-slate-300">Frequency:</span>
                                    <p className="text-slate-300">{knowledge.frequency}</p>
                                  </div>
                                  <div>
                                    <span className="text-slate-300">Best Response:</span>
                                    <p className="text-emerald-400">{knowledge.bestResponse}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* ROI Summary */}
                        <div className="p-4 bg-gradient-to-r from-amber-500/10 to-emerald-500/10 rounded-lg border border-amber-500/30">
                          <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                            <Shield className="h-4 w-4 text-amber-400" />
                            Execution ROI
                          </h4>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="text-center">
                              <div className="text-xl font-bold text-emerald-400">
                                ${((learnings.metrics?.dealValueProtected || 0) / 1000000).toFixed(1)}M
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-200">Deal Protected</p>
                            </div>
                            <div className="text-center">
                              <div className="text-xl font-bold text-amber-400">
                                {learnings.metrics?.hoursRecovered || 20}h
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-200">Hours Recovered</p>
                            </div>
                            <div className="text-center">
                              <div className="text-xl font-bold text-blue-400">
                                ${((learnings.metrics?.costOfDelay || 0) / 1000).toFixed(0)}K
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-200">Erosion Avoided</p>
                            </div>
                          </div>
                        </div>

                        {/* Next Steps */}
                        <div>
                          <h4 className="text-sm font-medium text-blue-400 mb-3 flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Next Steps
                          </h4>
                          <div className="space-y-2">
                            {learnings.nextExecutionRecommendations?.map((rec: string, i: number) => (
                              <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                                <ChevronRight className="h-4 w-4 text-blue-400" />
                                {rec}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-slate-600 dark:text-slate-200 py-8">
                        Loading learnings...
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {typedPipeline && (
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Pipeline Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-800/50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-white">
                        {typedPipeline.summary?.totalDeals || 5}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-200">Total Deals</p>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-emerald-400">
                        ${((typedPipeline.summary?.totalPipeline || 23900000) / 1000000).toFixed(1)}M
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-200">Pipeline Value</p>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-red-400">
                        {typedPipeline.deals?.filter((d: any) => d.riskScore > 60).length || 1}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-200">At Risk</p>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-amber-400">
                        ${((typedPipeline.summary?.atRiskValue || 5000000) / 1000000).toFixed(1)}M
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-200">At Risk Value</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {execution && (
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">ROI Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-emerald-500/10 rounded-lg">
                      <span className="text-slate-600 dark:text-slate-200">Time Saved</span>
                      <span className="text-emerald-400 font-bold">168 minutes</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg">
                      <span className="text-slate-600 dark:text-slate-200">Tasks Automated</span>
                      <span className="text-blue-400 font-bold">4 tasks</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg">
                      <span className="text-slate-600 dark:text-slate-200">Stakeholders Notified</span>
                      <span className="text-purple-400 font-bold">6 people</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-amber-500/10 rounded-lg">
                      <span className="text-slate-600 dark:text-slate-200">Deal Value Protected</span>
                      <span className="text-amber-400 font-bold">
                        ${(execution.amount / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
