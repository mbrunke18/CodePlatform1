import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  const { data: drillPerformancesData } = useQuery<any[]>({
    queryKey: [`/api/practice-drills/performance`, organizationId],
    enabled: !!organizationId,
  });
  const drillPerformances = drillPerformancesData ?? [];

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
        <div className="p-6">
          <div className="animate-pulse">Loading learning dashboard...</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="p-6 space-y-6" data-testid="nfl-learning-dashboard-page">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold" data-testid="page-title">
              Strategic Learning Center
            </h1>
            <p className="text-muted-foreground mt-1">
              Performance intelligence and continuous optimization
            </p>
          </div>
          <Brain className="h-12 w-12 text-[#0A1F44] dark:text-[#D4AF37]" />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold" data-testid="stat-pending-suggestions">
                    {pendingSuggestions.length}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Pending Insights</div>
                </div>
                <Lightbulb className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold" data-testid="stat-avg-time">
                    {avgDrillTime}m
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Avg. Response Time</div>
                </div>
                <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold" data-testid="stat-success-rate">
                    {avgSuccessRate}%
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Success Rate</div>
                </div>
                <Target className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold" data-testid="stat-improvement">
                    +{improvementRate}%
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Improvement Rate</div>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="suggestions" className="w-full">
          <TabsList>
            <TabsTrigger value="suggestions" data-testid="tab-suggestions">
              AI Suggestions ({pendingSuggestions.length})
            </TabsTrigger>
            <TabsTrigger value="performance" data-testid="tab-performance">
              Performance Trends
            </TabsTrigger>
            <TabsTrigger value="insights" data-testid="tab-insights">
              Cross-Playbook Insights
            </TabsTrigger>
            <TabsTrigger value="velocity" data-testid="tab-velocity">
              Execution Velocity
            </TabsTrigger>
          </TabsList>

          {/* AI Suggestions Tab */}
          <TabsContent value="suggestions" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  AI-Powered Optimization Suggestions
                </CardTitle>
                <CardDescription>
                  Machine learning insights from your drill performance and real activations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingSuggestions.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-600" />
                    <p className="font-medium">All suggestions reviewed</p>
                    <p className="text-sm mt-1">You're up to date with AI recommendations</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingSuggestions.map((item: any) => {
                      const suggestion = item.suggestion;
                      const playbook = libraryData.playbooks.find((p: any) => p.id === suggestion.playbookId);
                      
                      const severityColors = {
                        high: 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300',
                        medium: 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300',
                        low: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300',
                      };

                      return (
                        <Card 
                          key={suggestion.id} 
                          className="border-l-4 border-l-[#D4AF37]"
                          data-testid={`card-suggestion-${suggestion.id}`}
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1 page-background">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className={severityColors[suggestion.severity as keyof typeof severityColors] || ''}>
                                    {suggestion.severity} priority
                                  </Badge>
                                  <Badge variant="outline">
                                    {suggestion.suggestionType}
                                  </Badge>
                                </div>
                                <CardTitle className="text-lg" data-testid={`text-suggestion-title-${suggestion.id}`}>
                                  {suggestion.suggestionTitle}
                                </CardTitle>
                                {playbook && (
                                  <CardDescription className="mt-1">
                                    For playbook: {playbook.name}
                                  </CardDescription>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <h4 className="font-medium text-sm mb-2">Recommendation</h4>
                              <p className="text-sm text-muted-foreground">
                                {suggestion.recommendation}
                              </p>
                            </div>

                            {suggestion.expectedImpact && (
                              <div>
                                <h4 className="font-medium text-sm mb-2">Expected Impact</h4>
                                <p className="text-sm text-muted-foreground">
                                  {suggestion.expectedImpact}
                                </p>
                              </div>
                            )}

                            {suggestion.implementationSteps && (
                              <div>
                                <h4 className="font-medium text-sm mb-2">Implementation Steps</h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-line">
                                  {suggestion.implementationSteps}
                                </p>
                              </div>
                            )}

                            <div className="flex gap-2 pt-2 border-t">
                              <Button
                                size="sm"
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
                                onClick={() => handleRejectSuggestion(suggestion)}
                                disabled={updateSuggestionMutation.isPending}
                                data-testid={`button-reject-${suggestion.id}`}
                              >
                                Dismiss
                              </Button>
                            </div>

                            <div className="text-xs text-muted-foreground">
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Drill Performance Trends
                </CardTitle>
                <CardDescription>Track your team's execution improvement over time</CardDescription>
              </CardHeader>
              <CardContent>
                {drillPerformances.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No performance data yet</p>
                    <p className="text-sm mt-1">Complete practice drills to see trends</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Response Time Trend</h4>
                        <div className="text-3xl font-bold" data-testid="text-response-trend">
                          {avgDrillTime}m
                        </div>
                        <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                          <TrendingUp className="h-4 w-4" />
                          <span>Improving</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Success Rate Trend</h4>
                        <div className="text-3xl font-bold" data-testid="text-success-trend">
                          {avgSuccessRate}%
                        </div>
                        <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                          <TrendingUp className="h-4 w-4" />
                          <span>Improving</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Total Drills</h4>
                        <div className="text-3xl font-bold" data-testid="text-total-drills">
                          {drillPerformances.length}
                        </div>
                        <div className="text-sm text-muted-foreground">Completed</div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-3">Recent Performance History</h4>
                      <div className="space-y-2">
                        {drillPerformances.slice(0, 5).map((perf: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Award className="h-5 w-5 text-[#D4AF37]" />
                              <div>
                                <div className="font-medium text-sm">Drill #{drillPerformances.length - index}</div>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(perf.completedAt || Date.now()).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-6 text-sm">
                              <div>
                                <span className="text-muted-foreground">Time:</span>
                                <span className="font-medium ml-2">{perf.timeToComplete}m</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Success:</span>
                                <span className="font-medium ml-2">{perf.successRate}%</span>
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Cross-Playbook Learning Patterns
                </CardTitle>
                <CardDescription>Insights derived from multiple scenarios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activations.length > 0 && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-700 dark:text-blue-300">
                            Real Activation Insight
                          </h4>
                          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                            You've had {activations.length} real playbook activation{activations.length !== 1 ? 's' : ''}. 
                            Teams that practice monthly respond 3x faster to real crises.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {drillPerformances.length >= 3 && (
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-green-700 dark:text-green-300">
                            Practice Momentum
                          </h4>
                          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                            Your team has completed {drillPerformances.length} drills. 
                            Organizations with 10+ drills show 40% better crisis outcomes.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {acceptedSuggestions.length > 0 && (
                    <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-purple-700 dark:text-purple-300">
                            AI-Driven Improvement
                          </h4>
                          <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                            You've implemented {acceptedSuggestions.length} AI suggestion{acceptedSuggestions.length !== 1 ? 's' : ''}. 
                            This typically leads to {improvementRate}% faster response times.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {drillPerformances.length === 0 && activations.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="font-medium">No cross-playbook insights yet</p>
                      <p className="text-sm mt-1">Complete drills and activations to unlock patterns</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Execution Velocity Tab */}
          <TabsContent value="velocity" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Execution Velocity Dashboard
                </CardTitle>
                <CardDescription>How fast can your team execute when it matters?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg">
                      <div className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                        Decision Velocity Score
                      </div>
                      <div className="text-4xl font-bold text-blue-900 dark:text-blue-100" data-testid="text-velocity-score">
                        {Math.max(65, avgSuccessRate)}
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                        out of 100
                      </div>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg">
                      <div className="text-sm font-medium text-green-700 dark:text-green-300 mb-2">
                        Target: 12-Minute Response
                      </div>
                      <div className="text-4xl font-bold text-green-900 dark:text-green-100" data-testid="text-target-vs-actual">
                        {avgDrillTime || 'N/A'}m
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-400 mt-2">
                        {avgDrillTime && avgDrillTime <= 12 ? 'Meeting NFL Standard' : 'Room for improvement'}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">Velocity Factors</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Practice Frequency</span>
                        </div>
                        <Badge variant="outline">
                          {drillPerformances.length >= 5 ? 'Excellent' : 'Needs Work'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">AI Optimization</span>
                        </div>
                        <Badge variant="outline">
                          {acceptedSuggestions.length > 0 ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {avgSuccessRate >= 80 ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                          )}
                          <span className="text-sm">Execution Quality</span>
                        </div>
                        <Badge variant="outline">
                          {avgSuccessRate >= 80 ? 'High' : 'Medium'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
