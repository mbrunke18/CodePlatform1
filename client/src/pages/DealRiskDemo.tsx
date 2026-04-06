import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import PageLayout from '@/components/layout/PageLayout';
import { ExecutionStageGuide } from '@/components/ExecutionStageGuide';
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
  { id: 'identify' as Phase, name: 'IDENTIFY', icon: BookOpen, color: '#C9A84C' },
  { id: 'detect' as Phase, name: 'DETECT', icon: Radar, color: '#C9A84C' },
  { id: 'execute' as Phase, name: 'EXECUTE', icon: Radio, color: '#C9A84C' },
  { id: 'advance' as Phase, name: 'ADVANCE', icon: BarChart3, color: '#C9A84C' },
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
    <PageLayout>
      
      <main className="max-w-7xl mx-auto px-6 py-12 text-white">
        <ExecutionStageGuide variant="compact" />
        <div className="text-center mb-10">
          <Badge className="mb-4 bg-[#C9A84C] text-[#0A0F2E]">
            Interactive Demo
          </Badge>
          <h1 className="text-4xl font-bold mb-4 text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Deal Risk Response Demo
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Experience the full IDEA Framework in action. Watch how Execution OS detects a deal at risk and delivers live execution in 12 minutes — roles assigned, tasks staged, teams already moving.
          </p>
          <Button 
            variant="outline" 
            onClick={() => resetMutation.mutate()}
            className="mt-4 border-white/20 text-white hover:bg-white/10"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Demo
          </Button>
        </div>

        <div className="flex items-center justify-between mb-8 bg-white/5 rounded-xl p-4 border border-white/10">
          {PHASES.map((phase, index) => {
            const isCompleted = completedPhases.includes(phase.id);
            const isCurrent = currentPhase === phase.id;
            const Icon = phase.icon;
            
            return (
              <div key={phase.id} className="flex items-center">
                <button
                  onClick={() => isCompleted && setCurrentPhase(phase.id)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all border ${
                    isCurrent 
                      ? 'bg-[#0A0F2E] border-[#C9A84C]' 
                      : isCompleted 
                        ? 'bg-[#2B8A6E]/10 border-[#2B8A6E]/30 cursor-pointer hover:bg-[#2B8A6E]/20' 
                        : 'opacity-50 border-transparent'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    isCurrent ? `bg-[#C9A84C]` : isCompleted ? 'bg-[#2B8A6E]' : 'bg-white/5'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-[#0A0F2E]" />
                    ) : (
                      <Icon className="h-5 w-5 text-[#0A0F2E]" />
                    )}
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-white/40">Phase {index + 1}</div>
                    <div className={`font-semibold ${isCurrent ? 'text-[#C9A84C]' : 'text-white/60'}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {phase.name}
                    </div>
                  </div>
                </button>
                {index < PHASES.length - 1 && (
                  <ChevronRight className="h-5 w-5 text-white/20 mx-2" />
                )}
              </div>
            );
          })}
        </div>

        <Progress value={getPhaseProgress()} className="mb-8 h-2 bg-white/10 [&>div]:bg-[#C9A84C]" />

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {currentPhase === 'identify' && (
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    <BookOpen className="h-5 w-5 text-[#C9A84C]" />
                    IDENTIFY Phase
                  </CardTitle>
                  <CardDescription className="text-white/60">
                    Connect your systems and select a playbook
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                      <span className="text-white">Salesforce</span>
                      {integrations.salesforce ? (
                        <Badge className="bg-[#2B8A6E]/20 text-[#2B8A6E]">Connected</Badge>
                      ) : (
                        <Button size="sm" onClick={() => connectSalesforceMutation.mutate()} className="bg-[#C9A84C] text-[#0A0F2E] hover:bg-[#DFC178]">
                          Connect
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                      <span className="text-white">Slack</span>
                      {integrations.slack ? (
                        <Badge className="bg-[#2B8A6E]/20 text-[#2B8A6E]">Connected</Badge>
                      ) : (
                        <Button size="sm" onClick={() => connectSlackMutation.mutate()} className="bg-[#C9A84C] text-[#0A0F2E] hover:bg-[#DFC178]">
                          Connect
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                      <span className="text-white">Jira</span>
                      {integrations.jira ? (
                        <Badge className="bg-[#2B8A6E]/20 text-[#2B8A6E]">Connected</Badge>
                      ) : (
                        <Button size="sm" onClick={() => connectJiraMutation.mutate()} className="bg-[#C9A84C] text-[#0A0F2E] hover:bg-[#DFC178]">
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>

                  {allIntegrationsConnected && !typedStatus?.playbook && (
                    <Button 
                      className="w-full bg-[#C9A84C] text-[#0A0F2E] hover:bg-[#DFC178] font-bold"
                      onClick={() => selectPlaybookMutation.mutate()}
                    >
                      Select Deal Risk Response Playbook
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}

                  {typedStatus?.playbook && (
                    <div className="p-4 bg-[#2B8A6E]/10 border border-[#2B8A6E]/30 rounded-lg">
                      <div className="flex items-center gap-2 text-[#2B8A6E] mb-2">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="font-medium">Playbook Configured</span>
                      </div>
                      <p className="text-sm text-white/80">
                        {typedStatus.playbook.name} with {typedStatus.playbook.triggers.length} trigger conditions
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {currentPhase === 'detect' && (
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    <Radar className="h-5 w-5 text-[#DFC178]" />
                    DETECT Phase
                  </CardTitle>
                  <CardDescription className="text-white/60">
                    Monitor deals for risk signals
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!typedStatus?.monitoring && (
                    <Button 
                      className="w-full bg-[#C9A84C] text-[#0A0F2E] hover:bg-[#DFC178] font-bold"
                      onClick={() => startMonitoringMutation.mutate()}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Start Monitoring
                    </Button>
                  )}

                  {typedStatus?.monitoring && typedPipeline?.deals && (
                    <div className="space-y-3">
                      <p className="text-sm text-[#2B8A6E] flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#2B8A6E] rounded-full animate-pulse" />
                        Monitoring {typedPipeline.deals.length} deals...
                      </p>
                      {typedPipeline.deals.filter((d: any) => d.riskScore > 60).map((deal: any) => (
                        <div 
                          key={deal.id}
                          className="p-4 bg-[#0A0F2E] border border-[#C9A84C] rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium">{deal.dealName}</span>
                            <Badge className="bg-[#C9A84C]/20 text-[#C9A84C]">
                              {deal.riskScore}% Risk
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-white/60 mb-3">
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              ${(deal.amount / 1000000).toFixed(1)}M
                            </span>
                            <span>{deal.triggers.length} triggers</span>
                          </div>
                          <Button 
                            className="w-full bg-[#0A0F2E] hover:bg-[#141B45] text-white border border-[#C9A84C] font-bold"
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
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    <Radio className="h-5 w-5 text-[#2B8A6E]" />
                    EXECUTE Phase
                  </CardTitle>
                  <CardDescription className="text-white/60">
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
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      <BarChart3 className="h-5 w-5 text-[#DFC178]" />
                      ADVANCE Phase
                    </CardTitle>
                    <CardDescription className="text-white/60">
                      Capture learnings and strengthen your playbook
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!completedPhases.includes('advance') ? (
                      <div className="space-y-4">
                        <p className="text-white/80">
                          Execution OS captures institutional knowledge from every execution, so your organization gets smarter with each response.
                        </p>
                        <Button 
                          className="w-full bg-[#C9A84C] text-[#0A0F2E] hover:bg-[#DFC178] font-bold"
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
                        <div className="p-4 bg-[#2B8A6E]/10 border border-[#2B8A6E]/30 rounded-lg">
                          <div className="flex items-center gap-2 text-[#2B8A6E] mb-1">
                            <CheckCircle2 className="h-5 w-5" />
                            <span className="font-medium">Execution Complete - Learnings Captured</span>
                          </div>
                          <p className="text-sm text-white/80">
                            {learnings.dealContext?.dealName} - ${((learnings.dealContext?.dealAmount || 0) / 1000000).toFixed(1)}M protected
                          </p>
                        </div>

                        {/* What Worked Well */}
                        <div>
                          <h4 className="text-sm font-medium text-[#2B8A6E] mb-3 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            What Worked Well
                          </h4>
                          <div className="space-y-2">
                            {learnings.successPatterns?.map((pattern: any, i: number) => (
                              <div key={i} className="p-3 bg-white/5 rounded-lg border-l-2 border-[#2B8A6E]">
                                <div className="flex items-center gap-2 mb-1">
                                  {pattern.icon === 'radar' && <Radar className="h-4 w-4 text-[#2B8A6E]" />}
                                  {pattern.icon === 'users' && <Users className="h-4 w-4 text-[#2B8A6E]" />}
                                  {pattern.icon === 'zap' && <Zap className="h-4 w-4 text-[#2B8A6E]" />}
                                  <span className="text-white text-sm font-medium">{pattern.category}</span>
                                </div>
                                <p className="text-sm text-white/80">{pattern.insight}</p>
                                <p className="text-xs text-white/40 mt-1">{pattern.impact}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Playbook Improvements */}
                        <div>
                          <h4 className="text-sm font-medium text-[#DFC178] mb-3 flex items-center gap-2">
                            <Lightbulb className="h-4 w-4" />
                            Recommended Playbook Improvements
                          </h4>
                          <div className="space-y-2">
                            {learnings.playbookImprovements?.map((improvement: any, i: number) => (
                              <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/10">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-white text-sm font-medium">{improvement.title}</span>
                                  <Badge className={improvement.priority === 'high' ? 'bg-[#C9A84C]/20 text-[#C9A84C]' : 'bg-[#DFC178]/20 text-[#DFC178]'}>
                                    {improvement.priority}
                                  </Badge>
                                </div>
                                <p className="text-sm text-white/80">{improvement.description}</p>
                                <p className="text-xs text-[#2B8A6E] mt-2 flex items-center gap-1">
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
                            <h4 className="text-sm font-medium text-[#C9A84C] mb-3 flex items-center gap-2">
                              <Brain className="h-4 w-4" />
                              Institutional Knowledge Captured
                            </h4>
                            {learnings.institutionalKnowledge.map((knowledge: any, i: number) => (
                              <div key={i} className="p-3 bg-white/5 border border-white/10 rounded-lg">
                                <div className="text-white text-sm font-medium mb-2">{knowledge.pattern}</div>
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                  <div>
                                    <span className="text-white/40">Frequency:</span>
                                    <p className="text-white/80">{knowledge.frequency}</p>
                                  </div>
                                  <div>
                                    <span className="text-white/40">Best Response:</span>
                                    <p className="text-[#2B8A6E]">{knowledge.bestResponse}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* ROI Summary */}
                        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                          <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                            <Shield className="h-4 w-4 text-[#DFC178]" />
                            Execution ROI
                          </h4>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="text-center">
                              <div className="text-xl font-bold text-[#2B8A6E]">
                                ${((learnings.metrics?.dealValueProtected || 0) / 1000000).toFixed(1)}M
                              </div>
                              <p className="text-xs text-white/40">Deal Protected</p>
                            </div>
                            <div className="text-center">
                              <div className="text-xl font-bold text-[#DFC178]">
                                {learnings.metrics?.hoursRecovered || 20}h
                              </div>
                              <p className="text-xs text-white/40">Hours Recovered</p>
                            </div>
                            <div className="text-center">
                              <div className="text-xl font-bold text-[#C9A84C]">
                                {learnings.metrics?.responseAcceleration || '85'}%
                              </div>
                              <p className="text-xs text-white/40">Acceleration</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Real-time Intelligence</CardTitle>
                <CardDescription className="text-white/60">Global monitoring of deal health and risk signals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="text-2xl font-bold text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {typedPipeline?.summary?.totalDeals || 42}
                    </div>
                    <p className="text-xs text-white/40">Active Deals</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="text-2xl font-bold text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      ${((typedPipeline?.summary?.totalPipeline || 12000000) / 1000000).toFixed(1)}M
                    </div>
                    <p className="text-xs text-white/40">Total Pipeline</p>
                  </div>
                </div>

                {typedPipeline?.deals && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-white/60 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Deal Heat Map
                    </h4>
                    <div className="space-y-2">
                      {typedPipeline.deals.slice(0, 5).map((deal: any) => (
                        <div key={deal.id} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-white/80">{deal.dealName}</span>
                            <span className={deal.riskScore > 40 ? 'text-red-400' : 'text-[#2B8A6E]'}>
                              {deal.riskScore}%
                            </span>
                          </div>
                          <Progress value={deal.riskScore} className="h-1 bg-white/5" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#0A0F2E] border-[#C9A84C] border-2">
              <CardHeader>
                <CardTitle className="text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>IDEA Framework Implementation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <BookOpen className="h-5 w-5 text-[#C9A84C]" />
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-white">Identify</h5>
                    <p className="text-xs text-white/60">Connect Salesforce and Slack to map your institutional deal knowledge.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <Radar className="h-5 w-5 text-[#DFC178]" />
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-white">Detect</h5>
                    <p className="text-xs text-white/60">AI monitors communication and CRM signals for hidden risk patterns.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <Radio className="h-5 w-5 text-[#2B8A6E]" />
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-white">Execute</h5>
                    <p className="text-xs text-white/60">Orchestrate the CEO, VP Sales, and Legal for a 12-minute risk response.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <BarChart3 className="h-5 w-5 text-[#DFC178]" />
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-white">Advance</h5>
                    <p className="text-xs text-white/60">Capture learnings to strengthen your response for the next deal.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
