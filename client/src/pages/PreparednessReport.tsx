import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Shield, TrendingUp, AlertTriangle, CheckCircle, Target, Users } from 'lucide-react';
import { Link } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';

export default function PreparednessReport() {
  const { data: organizations = [] } = useQuery<any[]>({ queryKey: ['/api/organizations'] });
  const organizationId = organizations[0]?.id || '95b97862-8e9d-4c4c-8609-7d8f37b68d36';

  const { data: scoreData, isLoading } = useQuery<any>({
    queryKey: [`/api/preparedness/score?organizationId=${organizationId}`],
    enabled: !!organizationId,
  });

  const { data: scoreHistory = [] } = useQuery<any[]>({
    queryKey: [`/api/preparedness/history?organizationId=${organizationId}&days=30`],
    enabled: !!organizationId,
  });

  if (isLoading || !scoreData) {
    return (
      <PageLayout>
        <div className="p-6">
          <div className="animate-pulse">Loading preparedness report...</div>
        </div>
      </PageLayout>
    );
  }

  const coverageGaps = scoreData.coverageGaps || [];
  const readinessMetrics = scoreData.readinessMetrics || {};

  return (
    <PageLayout>
      <div className="p-6 space-y-6" data-testid="preparedness-report-page">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" data-testid="link-back-dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold" data-testid="page-title">Executive Preparedness Report</h1>
              <p className="text-muted-foreground mt-1">Comprehensive crisis readiness assessment</p>
            </div>
          </div>
          <Shield className="h-12 w-12 text-blue-600 dark:text-blue-400" />
        </div>

        {/* Score Overview */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Current Preparedness Score</CardTitle>
            <CardDescription>Your overall crisis readiness rating</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-6xl font-bold text-blue-600 dark:text-blue-400" data-testid="score-main">
                  {scoreData.score}
                </div>
                <div className="text-sm text-muted-foreground mt-2">out of 100</div>
              </div>
              
              <div className="flex-1 page-background space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Scenarios Practiced</span>
                    <span>{readinessMetrics.scenariosPracticed || 0}/30 points</span>
                  </div>
                  <Progress value={(readinessMetrics.scenariosPracticed || 0) / 30 * 100} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Drills Completed</span>
                    <span>{readinessMetrics.drillsCompleted || 0}/25 points</span>
                  </div>
                  <Progress value={(readinessMetrics.drillsCompleted || 0) / 25 * 100} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Triggers Configured</span>
                    <span>{readinessMetrics.triggersCovered || 0}/20 points</span>
                  </div>
                  <Progress value={(readinessMetrics.triggersCovered || 0) / 20 * 100} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Playbook Readiness</span>
                    <span>{readinessMetrics.playbookReadiness || 0}/15 points</span>
                  </div>
                  <Progress value={(readinessMetrics.playbookReadiness || 0) / 15 * 100} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Recent Activity</span>
                    <span>{readinessMetrics.recentActivity || 0}/10 points</span>
                  </div>
                  <Progress value={(readinessMetrics.recentActivity || 0) / 10 * 100} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="comparison" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="comparison" data-testid="tab-comparison">Peer Comparison</TabsTrigger>
            <TabsTrigger value="gaps" data-testid="tab-gaps">Coverage Gaps</TabsTrigger>
            <TabsTrigger value="trends" data-testid="tab-trends">Historical Trends</TabsTrigger>
            <TabsTrigger value="recommendations" data-testid="tab-recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="comparison" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Peer Benchmarking
                </CardTitle>
                <CardDescription>How you compare to industry peers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400" data-testid="industry-avg">
                      {scoreData.industryBenchmark}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Industry Average</div>
                    <Badge variant="secondary" className="mt-2">{scoreData.executiveRole}</Badge>
                  </div>

                  <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400" data-testid="percentile">
                      {scoreData.peerPercentile}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Percentile Rank</div>
                    <Badge variant="secondary" className="mt-2">Top {100 - scoreData.peerPercentile}%</Badge>
                  </div>

                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400" data-testid="delta">
                      {Math.abs(scoreData.score - scoreData.industryBenchmark)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Points {scoreData.score > scoreData.industryBenchmark ? 'Above' : 'Below'} Average</div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Competitive Positioning</h4>
                  <div className="space-y-2 text-sm">
                    {scoreData.score >= scoreData.industryBenchmark + 10 && (
                      <div className="flex items-start gap-2 text-green-700 dark:text-green-400">
                        <CheckCircle className="h-4 w-4 mt-0.5" />
                        <span>Significantly above industry standard - You're a market leader in preparedness</span>
                      </div>
                    )}
                    {scoreData.score < scoreData.industryBenchmark && (
                      <div className="flex items-start gap-2 text-yellow-700 dark:text-yellow-400">
                        <AlertTriangle className="h-4 w-4 mt-0.5" />
                        <span>Below industry average - Prioritize preparedness activities to reduce risk</span>
                      </div>
                    )}
                    <div className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 mt-0.5 text-blue-600" />
                      <span>Anonymous benchmarking ensures fair comparison across {scoreData.executiveRole} peers</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gaps" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  Coverage Gaps Analysis
                </CardTitle>
                <CardDescription>High-risk scenarios requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                {coverageGaps.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground" data-testid="no-gaps">
                    <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-600" />
                    <p className="font-medium">No critical coverage gaps identified</p>
                    <p className="text-sm mt-1">You've addressed all high-priority scenarios</p>
                  </div>
                ) : (
                  <div className="space-y-4" data-testid="gaps-list">
                    {coverageGaps.map((gap: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{gap.category}</h4>
                            <Badge variant={gap.severity === 'high' ? 'destructive' : 'secondary'} className="mt-1">
                              {gap.severity} priority
                            </Badge>
                          </div>
                          <Target className="h-5 w-5 text-yellow-600" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{gap.recommendation}</p>
                        {gap.missingPlaybooks && gap.missingPlaybooks.length > 0 && (
                          <div className="text-xs">
                            <div className="font-medium mb-1">Missing Playbooks:</div>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                              {gap.missingPlaybooks.map((playbook: string, i: number) => (
                                <li key={i}>{playbook}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Score History (Last 30 Days)</CardTitle>
                <CardDescription>Track your preparedness improvement over time</CardDescription>
              </CardHeader>
              <CardContent>
                {scoreHistory.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No historical data available yet</p>
                    <p className="text-sm mt-1">Continue practicing to build your trend history</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {scoreHistory.slice(0, 10).map((entry: any, index: number) => (
                      <div key={index} className="flex items-center justify-between border-b pb-2">
                        <div className="text-sm text-muted-foreground">
                          {new Date(entry.calculatedAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-lg font-bold">{entry.score}</div>
                          {entry.scoreDelta !== 0 && (
                            <Badge variant={entry.scoreDelta > 0 ? 'default' : 'secondary'}>
                              {entry.scoreDelta > 0 ? '+' : ''}{entry.scoreDelta}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recommended Actions</CardTitle>
                <CardDescription>Steps to improve your preparedness score</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {readinessMetrics.scenariosPracticed < 30 && (
                  <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg" data-testid="rec-scenarios">
                    <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1 page-background">
                      <div className="font-medium text-blue-700 dark:text-blue-300">Practice More Scenarios</div>
                      <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                        Complete {Math.ceil((30 - (readinessMetrics.scenariosPracticed || 0)) / 3)} more what-if analyses to maximize this category (+{30 - (readinessMetrics.scenariosPracticed || 0)} points)
                      </p>
                      <Link href="/what-if-analyzer">
                        <Button size="sm" className="mt-2" data-testid="button-goto-analyzer">Go to What-If Analyzer</Button>
                      </Link>
                    </div>
                  </div>
                )}

                {readinessMetrics.drillsCompleted < 25 && (
                  <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg" data-testid="rec-drills">
                    <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="flex-1 page-background">
                      <div className="font-medium text-green-700 dark:text-green-300">Run Playbook Drills</div>
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                        Complete {Math.ceil((25 - (readinessMetrics.drillsCompleted || 0)) / 5)} more playbook drills (+{25 - (readinessMetrics.drillsCompleted || 0)} points)
                      </p>
                      <Link href="/playbook-library">
                        <Button size="sm" className="mt-2" data-testid="button-goto-playbooks">View Playbooks</Button>
                      </Link>
                    </div>
                  </div>
                )}

                {readinessMetrics.triggersCovered < 20 && (
                  <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg" data-testid="rec-triggers">
                    <AlertTriangle className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div className="flex-1 page-background">
                      <div className="font-medium text-purple-700 dark:text-purple-300">Configure More Triggers</div>
                      <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                        Set up {Math.ceil((20 - (readinessMetrics.triggersCovered || 0)) / 4)} more executive triggers (+{20 - (readinessMetrics.triggersCovered || 0)} points)
                      </p>
                      <Link href="/trigger-dashboard">
                        <Button size="sm" className="mt-2" data-testid="button-goto-triggers">Manage Triggers</Button>
                      </Link>
                    </div>
                  </div>
                )}

                {readinessMetrics.recentActivity < 10 && (
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg" data-testid="rec-activity">
                    <TrendingUp className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="flex-1 page-background">
                      <div className="font-medium text-yellow-700 dark:text-yellow-300">Increase Recent Activity</div>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                        Stay active with regular practice - aim for 5+ activities in the last 30 days (+{10 - (readinessMetrics.recentActivity || 0)} points)
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
