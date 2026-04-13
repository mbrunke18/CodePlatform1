import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Lightbulb,
  Target,
  Award,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Brain,
  BarChart3
} from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const NAVY = "#0A0F2E";
const NAVY_MID = "#141B45";
const GOLD = "#C9A84C";
const GOLD_LT = "#DFC178";
const TEAL = "#2B8A6E";
const TEAL_LT = "#3BAF8A";
const OFF = "#F8F7F4";
const BORDER = "#E8E4DC";
const MUTED = "#6B7280";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

export default function NFLLearningDashboard() {
  const { toast } = useToast();

  // Fetch organizations
  const { data: organizationsData } = useQuery<any[]>({ 
    queryKey: ['/api/organizations'] 
  });
  const organizations = organizationsData ?? [];
  const organizationId = organizations[0]?.id;

  // Fetch AI suggestions
  const { data: aiSuggestionsData, isLoading: suggestionsLoading } = useQuery<any[]>({
    queryKey: ['/api/playbook-library/ai-suggestions', organizationId],
    enabled: !!organizationId,
  });
  const aiSuggestions = aiSuggestionsData ?? [];

  // Fetch playbook activations for learning
  const { data: activationsData } = useQuery<any[]>({
    queryKey: ['/api/playbook-library/activations', organizationId],
    enabled: !!organizationId,
  });
  const activations = activationsData ?? [];

  // Fetch drill performance data
  const { data: drillPerformancesData } = useQuery<any>({
    queryKey: [`/api/practice-drills/performance`, organizationId],
    enabled: !!organizationId,
  });
  const drillPerformances: any[] = Array.isArray(drillPerformancesData)
    ? drillPerformancesData
    : (drillPerformancesData?.performances ?? []);

  // Fetch playbook library for context
  const { data: libraryDataRaw } = useQuery<any>({
    queryKey: ['/api/playbook-library'],
  });
  const libraryData = libraryDataRaw ?? { playbooks: [] };

  // Update AI suggestion status mutation
  const updateSuggestionMutation = useMutation({
    mutationFn: async ({ suggestionId, status, reviewedBy }: any) => {
      return apiRequest('PATCH', `/api/playbook-library/ai-suggestions/${suggestionId}`, {
        status,
        reviewedBy,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/playbook-library/ai-suggestions'] });
      toast({
        title: 'Suggestion Updated',
        description: 'AI optimization suggestion has been processed',
      });
    },
  });

  const handleAcceptSuggestion = (suggestion: any) => {
    updateSuggestionMutation.mutate({
      suggestionId: suggestion.id,
      status: 'accepted',
      reviewedBy: organizationId, // In real app, would be user ID
    });
  };

  const handleRejectSuggestion = (suggestion: any) => {
    updateSuggestionMutation.mutate({
      suggestionId: suggestion.id,
      status: 'rejected',
      reviewedBy: organizationId,
    });
  };

  // Calculate insights
  const pendingSuggestions = aiSuggestions.filter((s: any) => s.suggestion?.status === 'pending');
  const acceptedSuggestions = aiSuggestions.filter((s: any) => s.suggestion?.status === 'accepted');
  
  const avgDrillTime = drillPerformances.length > 0
    ? Math.round(drillPerformances.reduce((sum, p) => sum + (p.timeToComplete || 0), 0) / drillPerformances.length)
    : 0;

  const avgSuccessRate = drillPerformances.length > 0
    ? Math.round(drillPerformances.reduce((sum, p) => sum + (p.successRate || 0), 0) / drillPerformances.length)
    : 0;

  const improvementRate = acceptedSuggestions.length > 0 
    ? Math.min(15, acceptedSuggestions.length * 3) 
    : 0;

  if (suggestionsLoading) {
    return (
      <PageLayout>
        <div className="p-6 bg-white min-h-screen">
          <div className="animate-pulse text-[#0A0F2E] font-semibold">Loading learning dashboard...</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="bg-[#F8F7F4] min-h-screen" data-testid="execution-learning-dashboard-page">
        {/* ─── Dark Hero ─────────────────────────────────────────────── */}
        <div style={{ background: NAVY, padding: '36px 0 32px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)', backgroundSize: '44px 44px', pointerEvents: 'none' }} />
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 28, height: 1.5, background: GOLD }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD }}>Advance Phase · Performance Intelligence</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
              <div>
                <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: '#F0EDE4', marginBottom: 8, lineHeight: 1.1 }} data-testid="page-title">
                  Strategic <em style={{ color: GOLD }}>Learning Center</em>
                </div>
                <div style={{ fontSize: 13, color: 'rgba(240,237,228,0.55)', maxWidth: 540, lineHeight: 1.6 }}>
                  Performance intelligence and continuous optimization — system-detected insights from every execution.
                </div>
              </div>
              <div className="bg-[#0A0F2E] p-3 rounded-none" style={{ border: '1px solid rgba(201,168,76,0.2)' }}>
                <Brain className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* ─── Content ─────────────────────────────────────────────── */}
        <div className="p-6 space-y-6">

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-[#E8E4DC] bg-white shadow-none">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-[#0A0F2E]" style={CG} data-testid="stat-pending-suggestions">
                    {pendingSuggestions.length}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280] mt-1">Pending Insights</div>
                </div>
                <Lightbulb className="h-8 w-8 text-[#C9A84C]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#E8E4DC] bg-white shadow-none">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-[#0A0F2E]" style={CG} data-testid="stat-avg-time">
                    {avgDrillTime}m
                  </div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280] mt-1">Avg. Response Time</div>
                </div>
                <Clock className="h-8 w-8 text-[#0A0F2E]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#E8E4DC] bg-white shadow-none">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-[#0A0F2E]" style={CG} data-testid="stat-success-rate">
                    {avgSuccessRate}%
                  </div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280] mt-1">Success Rate</div>
                </div>
                <Target className="h-8 w-8 text-[#2B8A6E]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#E8E4DC] bg-white shadow-none">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-[#0A0F2E]" style={CG} data-testid="stat-improvement">
                    +{improvementRate}%
                  </div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280] mt-1">Improvement Rate</div>
                </div>
                <TrendingUp className="h-8 w-8 text-[#C9A84C]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="suggestions" className="w-full">
          <TabsList className="bg-[#F8F7F4] p-1 border border-[#E8E4DC]">
            <TabsTrigger value="suggestions" className="data-[state=active]:bg-white data-[state=active]:text-[#0A0F2E]" data-testid="tab-suggestions">
              System Suggestions ({pendingSuggestions.length})
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-white data-[state=active]:text-[#0A0F2E]" data-testid="tab-performance">
              Performance Trends
            </TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-white data-[state=active]:text-[#0A0F2E]" data-testid="tab-insights">
              Cross-Playbook Insights
            </TabsTrigger>
            <TabsTrigger value="velocity" className="data-[state=active]:bg-white data-[state=active]:text-[#0A0F2E]" data-testid="tab-velocity">
              Execution Velocity
            </TabsTrigger>
          </TabsList>

          {/* AI Suggestions Tab */}
          <TabsContent value="suggestions" className="space-y-4 mt-6">
            <Card className="border-[#E8E4DC] bg-white shadow-none">
              <CardHeader>
                <CardTitle style={CG} className="flex items-center gap-2 text-xl text-[#0A0F2E]">
                  <Lightbulb className="h-5 w-5 text-[#C9A84C]" />
                  Performance Optimization Insights
                </CardTitle>
                <CardDescription className="text-[#6B7280]">
                  Machine learning insights from your drill performance and real activations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingSuggestions.length === 0 ? (
                  <div className="text-center py-12 text-[#6B7280]">
                    <CheckCircle className="h-12 w-12 mx-auto mb-3 text-[#2B8A6E]" />
                    <p className="font-bold text-[#0A0F2E]">All suggestions reviewed</p>
                    <p className="text-sm mt-1">You're up to date with system recommendations</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingSuggestions.map((item: any) => {
                      const suggestion = item.suggestion;
                      const playbook = libraryData.playbooks.find((p: any) => p.id === suggestion.playbookId);
                      
                      const severityColors = {
                        high: 'bg-[#0A0F2E]/10 text-[#0A0F2E] dark:text-[#C9A84C]',
                        medium: `bg-[#C9A84C]/12 text-[#C9A84C]`,
                        low: `bg-[#0A0F2E]/12 text-[#0A0F2E]`,
                      };

                      return (
                        <Card 
                          key={suggestion.id} 
                          className="border border-[#E8E4DC] bg-white shadow-none relative overflow-hidden"
                          data-testid={`card-suggestion-${suggestion.id}`}
                        >
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C9A84C]" />
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className={`${severityColors[suggestion.severity as keyof typeof severityColors] || ''} border-none font-bold text-[9px] uppercase tracking-wider`}>
                                    {suggestion.severity} priority
                                  </Badge>
                                  <Badge variant="outline" className="border-[#E8E4DC] text-[#6B7280] font-bold text-[9px] uppercase tracking-wider">
                                    {suggestion.suggestionType}
                                  </Badge>
                                </div>
                                <CardTitle className="text-lg text-[#0A0F2E]" style={CG} data-testid={`text-suggestion-title-${suggestion.id}`}>
                                  {suggestion.suggestionTitle}
                                </CardTitle>
                                {playbook && (
                                  <CardDescription className="mt-1 text-[#6B7280]">
                                    For playbook: <span className="text-[#0A0F2E] font-semibold">{playbook.name}</span>
                                  </CardDescription>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="bg-[#F8F7F4] p-4 border border-[#E8E4DC]">
                              <h4 className="font-bold text-[10px] text-[#6B7280] mb-2 uppercase tracking-wider">Recommendation</h4>
                              <p className="text-sm text-[#0A0F2E]">
                                {suggestion.recommendation}
                              </p>
                            </div>

                            {suggestion.expectedImpact && (
                              <div>
                                <h4 className="font-bold text-[10px] text-[#6B7280] mb-1 uppercase tracking-wider">Expected Impact</h4>
                                <p className="text-sm text-[#0A0F2E]">
                                  {suggestion.expectedImpact}
                                </p>
                              </div>
                            )}

                            {suggestion.implementationSteps && (
                              <div>
                                <h4 className="font-bold text-[10px] text-[#6B7280] mb-1 uppercase tracking-wider">Implementation Steps</h4>
                                <p className="text-sm text-[#0A0F2E] whitespace-pre-line">
                                  {suggestion.implementationSteps}
                                </p>
                              </div>
                            )}

                            <div className="flex gap-2 pt-4 border-t border-[#E8E4DC]">
                              <Button
                                size="sm"
                                className="bg-[#0A0F2E] text-white hover:bg-[#141B45]"
                                onClick={() => handleAcceptSuggestion(suggestion)}
                                disabled={updateSuggestionMutation.isPending}
                                data-testid={`button-accept-${suggestion.id}`}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Accept & Implement
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-[#E8E4DC] text-[#0A0F2E]"
                                onClick={() => handleRejectSuggestion(suggestion)}
                                disabled={updateSuggestionMutation.isPending}
                                data-testid={`button-reject-${suggestion.id}`}
                              >
                                Dismiss
                              </Button>
                            </div>

                            <div className="text-[10px] text-[#6B7280] font-medium italic">
                              Generated: {new Date(suggestion.generatedAt).toLocaleString()}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Trends Tab */}
          <TabsContent value="performance" className="space-y-4 mt-6">
            <Card className="border-[#E8E4DC] bg-white shadow-none">
              <CardHeader>
                <CardTitle style={CG} className="flex items-center gap-2 text-xl text-[#0A0F2E]">
                  <BarChart3 className="h-5 w-5 text-[#0A0F2E]" />
                  Drill Performance Trends
                </CardTitle>
                <CardDescription className="text-[#6B7280]">Track your team's execution improvement over time</CardDescription>
              </CardHeader>
              <CardContent>
                {drillPerformances.length === 0 ? (
                  <div className="text-center py-12 text-[#6B7280]">
                    <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="font-bold text-[#0A0F2E]">No performance data yet</p>
                    <p className="text-sm mt-1">Complete practice drills to see trends</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="space-y-2 p-4 bg-[#F8F7F4] border border-[#E8E4DC]">
                        <h4 className="font-bold text-[10px] text-[#6B7280] uppercase tracking-wider">Response Time Trend</h4>
                        <div className="text-3xl font-bold text-[#0A0F2E]" style={CG} data-testid="text-response-trend">
                          {avgDrillTime}m
                        </div>
                        <div className="flex items-center gap-1 text-sm text-[#2B8A6E] font-bold">
                          <TrendingUp className="h-4 w-4" />
                          <span>IMPROVING</span>
                        </div>
                      </div>

                      <div className="space-y-2 p-4 bg-[#F8F7F4] border border-[#E8E4DC]">
                        <h4 className="font-bold text-[10px] text-[#6B7280] uppercase tracking-wider">Success Rate Trend</h4>
                        <div className="text-3xl font-bold text-[#0A0F2E]" style={CG} data-testid="text-success-trend">
                          {avgSuccessRate}%
                        </div>
                        <div className="flex items-center gap-1 text-sm text-[#2B8A6E] font-bold">
                          <TrendingUp className="h-4 w-4" />
                          <span>IMPROVING</span>
                        </div>
                      </div>

                      <div className="space-y-2 p-4 bg-[#F8F7F4] border border-[#E8E4DC]">
                        <h4 className="font-bold text-[10px] text-[#6B7280] uppercase tracking-wider">Total Drills</h4>
                        <div className="text-3xl font-bold text-[#0A0F2E]" style={CG} data-testid="text-total-drills">
                          {drillPerformances.length}
                        </div>
                        <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">COMPLETED</div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#E8E4DC]">
                      <h4 className="font-bold text-sm text-[#0A0F2E] mb-3 uppercase tracking-wider">Recent Performance History</h4>
                      <div className="space-y-2">
                        {drillPerformances.slice(0, 5).map((perf: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white border border-[#E8E4DC] hover:bg-[#F8F7F4]">
                            <div className="flex items-center gap-3">
                              <Award className="h-5 w-5 text-[#C9A84C]" />
                              <div>
                                <div className="font-bold text-sm text-[#0A0F2E]">Drill #{drillPerformances.length - index}</div>
                                <div className="text-xs text-[#6B7280]">
                                  {new Date(perf.completedAt || Date.now()).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-6 text-sm">
                              <div>
                                <span className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280]">Time:</span>
                                <span className="font-bold text-[#0A0F2E] ml-2">{perf.timeToComplete}m</span>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280]">Success:</span>
                                <span className="font-bold text-[#2B8A6E] ml-2">{perf.successRate}%</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cross-Playbook Insights Tab */}
          <TabsContent value="insights" className="space-y-4 mt-6">
            <Card className="border-[#E8E4DC] bg-white shadow-none">
              <CardHeader>
                <CardTitle style={CG} className="flex items-center gap-2 text-xl text-[#0A0F2E]">
                  <Brain className="h-5 w-5 text-[#C9A84C]" />
                  Cross-Playbook Learning Patterns
                </CardTitle>
                <CardDescription className="text-[#6B7280]">Insights derived from multiple scenarios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activations.length > 0 && (
                    <div className="p-4 bg-[#0A0F2E]/5 border border-[#0A0F2E]/10 rounded-none relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0A0F2E]" />
                      <div className="flex items-start gap-3">
                        <Zap className="h-5 w-5 text-[#0A0F2E] mt-0.5" />
                        <div>
                          <h4 className="font-bold text-sm text-[#0A0F2E] uppercase tracking-wider">
                            Real Activation Insight
                          </h4>
                          <p className="text-sm text-[#0A0F2E] mt-1">
                            You've had {activations.length} real playbook activation{activations.length !== 1 ? 's' : ''}. 
                            Teams that practice monthly respond 3x faster to real crises.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {drillPerformances.length >= 3 && (
                    <div className="p-4 bg-[#2B8A6E]/5 border border-[#2B8A6E]/10 rounded-none relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2B8A6E]" />
                      <div className="flex items-start gap-3">
                        <TrendingUp className="h-5 w-5 text-[#2B8A6E] mt-0.5" />
                        <div>
                          <h4 className="font-bold text-sm text-[#2B8A6E] uppercase tracking-wider">
                            Practice Momentum
                          </h4>
                          <p className="text-sm text-[#2B8A6E] mt-1">
                            Your team has completed {drillPerformances.length} drills. 
                            Organizations with 10+ drills show 40% better crisis outcomes.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {acceptedSuggestions.length > 0 && (
                    <div className="p-4 bg-[#C9A84C]/5 border border-[#C9A84C]/10 rounded-none relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C9A84C]" />
                      <div className="flex items-start gap-3">
                        <Lightbulb className="h-5 w-5 text-[#C9A84C] mt-0.5" />
                        <div>
                          <h4 className="font-bold text-sm text-[#C9A84C] uppercase tracking-wider">
                            System-Driven Improvement
                          </h4>
                          <p className="text-sm text-[#0A0F2E] mt-1">
                            You've implemented {acceptedSuggestions.length} system suggestion{acceptedSuggestions.length !== 1 ? 's' : ''}. 
                            This typically leads to {improvementRate}% faster response times.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {drillPerformances.length === 0 && activations.length === 0 && (
                    <div className="text-center py-12 text-[#6B7280]">
                      <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="font-bold text-[#0A0F2E]">No cross-playbook insights yet</p>
                      <p className="text-sm mt-1">Complete drills and activations to unlock patterns</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Execution Velocity Tab */}
          <TabsContent value="velocity" className="space-y-4 mt-6">
            <Card className="border-[#E8E4DC] bg-white shadow-none">
              <CardHeader>
                <CardTitle style={CG} className="flex items-center gap-2 text-xl text-[#0A0F2E]">
                  <Zap className="h-5 w-5 text-[#C9A84C]" />
                  Execution Velocity Dashboard
                </CardTitle>
                <CardDescription className="text-[#6B7280]">How fast can your team execute when it matters?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-[#F8F7F4] border border-[#E8E4DC] rounded-none">
                      <div className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280] mb-2">
                        Decision Velocity Score
                      </div>
                      <div className="text-4xl font-bold text-[#0A0F2E]" style={CG} data-testid="text-velocity-score">
                        {Math.max(65, avgSuccessRate)}
                      </div>
                      <div className="text-[10px] font-bold text-[#6B7280] mt-2 uppercase tracking-wider">
                        OUT OF 100
                      </div>
                    </div>

                    <div className="p-6 bg-[#F8F7F4] border border-[#E8E4DC] rounded-none">
                      <div className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280] mb-2">
                        Execution Head Start
                      </div>
                      <div className="text-4xl font-bold text-[#2B8A6E]" style={CG}>
                        3,600×
                      </div>
                      <div className="text-[10px] font-bold text-[#2B8A6E] mt-2 uppercase tracking-wider">
                        EXECUTION HEAD START
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E8E4DC]">
                    <h4 className="font-bold text-sm text-[#0A0F2E] mb-3 uppercase tracking-wider">Velocity Factors</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#6B7280] font-bold uppercase tracking-wider">Coordination Speed</span>
                        <span className="text-xs font-bold text-[#0A0F2E]">EXCELLENT</span>
                      </div>
                      <Progress value={92} className="h-1 bg-[#E8E4DC]" style={{ '--progress-background': TEAL } as any} />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#6B7280] font-bold uppercase tracking-wider">Stakeholder Responsiveness</span>
                        <span className="text-xs font-bold text-[#C9A84C]">GOOD</span>
                      </div>
                      <Progress value={78} className="h-1 bg-[#E8E4DC]" style={{ '--progress-background': GOLD } as any} />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#6B7280] font-bold uppercase tracking-wider">Automation Depth</span>
                        <span className="text-xs font-bold text-[#0A0F2E]">EXCELLENT</span>
                      </div>
                      <Progress value={85} className="h-1 bg-[#E8E4DC]" style={{ '--progress-background': NAVY } as any} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </PageLayout>
  );
}
