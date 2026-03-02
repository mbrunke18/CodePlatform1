import { useQuery } from '@tanstack/react-query';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Shield, TrendingUp, AlertTriangle, CheckCircle, Target, Users } from 'lucide-react';
import { Link } from 'wouter';

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

export default function PreparednessReport({ embedded }: { embedded?: boolean }) {
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
      <PageLayout embedded={embedded}>
        <div className="p-6">
          <div className="animate-pulse">Loading preparedness report...</div>
        </div>
      </PageLayout>
    );
  }

  const coverageGaps = scoreData.coverageGaps || [];
  const readinessMetrics = scoreData.readinessMetrics || {};

  return (
    <PageLayout embedded={embedded}>
      <div className="p-8 space-y-8 bg-[#F8F7F4] min-h-screen" data-testid="preparedness-report-page">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" data-testid="link-back-dashboard">
              <Button variant="outline" size="sm" className="border-[#E8E4DC] text-[#0A0F2E] font-bold">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-6 w-[2px] bg-[#C9A84C]"></div>
                <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#C9A84C]">Assessment Report</span>
              </div>
              <h1 className="text-4xl font-bold text-[#0A0F2E]" style={CG} data-testid="page-title">Executive Preparedness Report</h1>
              <p className="text-[#6B7280] mt-1 font-medium">Comprehensive crisis readiness assessment</p>
            </div>
          </div>
          <div className="h-16 w-16 bg-[#0A0F2E] rounded flex items-center justify-center">
            <Shield className="h-8 w-8 text-[#C9A84C]" />
          </div>
        </div>

        {/* Score Overview */}
        <Card className="border border-[#E8E4DC] bg-white shadow-sm overflow-hidden">
          <div className="h-2 bg-[#0A0F2E]"></div>
          <CardHeader>
            <CardTitle style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl">Current Preparedness Score</CardTitle>
            <CardDescription className="font-medium">Your overall crisis readiness rating</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-12">
              <div className="text-center">
                <div className="text-8xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#C9A84C" }} data-testid="score-main">
                  {scoreData.score}
                </div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280] mt-2">out of 100 points</div>
              </div>
              
              <div className="flex-1 space-y-5">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-bold text-[#0A0F2E]">Scenarios Practiced</span>
                    <span className="text-[#6B7280] font-bold">{readinessMetrics.scenariosPracticed || 0}/30 pts</span>
                  </div>
                  <Progress value={(readinessMetrics.scenariosPracticed || 0) / 30 * 100} className="h-2 bg-[#F8F7F4]" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-bold text-[#0A0F2E]">Drills Completed</span>
                    <span className="text-[#6B7280] font-bold">{readinessMetrics.drillsCompleted || 0}/25 pts</span>
                  </div>
                  <Progress value={(readinessMetrics.drillsCompleted || 0) / 25 * 100} className="h-2 bg-[#F8F7F4]" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-bold text-[#0A0F2E]">Triggers Configured</span>
                    <span className="text-[#6B7280] font-bold">{readinessMetrics.triggersCovered || 0}/20 pts</span>
                  </div>
                  <Progress value={(readinessMetrics.triggersCovered || 0) / 20 * 100} className="h-2 bg-[#F8F7F4]" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-bold text-[#0A0F2E]">Playbook Readiness</span>
                    <span className="text-[#6B7280] font-bold">{readinessMetrics.playbookReadiness || 0}/15 pts</span>
                  </div>
                  <Progress value={(readinessMetrics.playbookReadiness || 0) / 15 * 100} className="h-2 bg-[#F8F7F4]" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-bold text-[#0A0F2E]">Recent Activity</span>
                    <span className="text-[#6B7280] font-bold">{readinessMetrics.recentActivity || 0}/10 pts</span>
                  </div>
                  <Progress value={(readinessMetrics.recentActivity || 0) / 10 * 100} className="h-2 bg-[#F8F7F4]" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="comparison" className="w-full">
          <TabsList className="bg-transparent border-b border-[#E8E4DC] rounded-none p-0 h-auto w-full justify-start">
            <TabsTrigger value="comparison" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#C9A84C] data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-8 font-bold text-[#6B7280] data-[state=active]:text-[#0A0F2E]" data-testid="tab-comparison">Peer Comparison</TabsTrigger>
            <TabsTrigger value="gaps" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#C9A84C] data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-8 font-bold text-[#6B7280] data-[state=active]:text-[#0A0F2E]" data-testid="tab-gaps">Coverage Gaps</TabsTrigger>
            <TabsTrigger value="trends" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#C9A84C] data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-8 font-bold text-[#6B7280] data-[state=active]:text-[#0A0F2E]" data-testid="tab-trends">Historical Trends</TabsTrigger>
            <TabsTrigger value="recommendations" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#C9A84C] data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-8 font-bold text-[#6B7280] data-[state=active]:text-[#0A0F2E]" data-testid="tab-recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="comparison" className="space-y-4 mt-8">
            <Card className="border border-[#E8E4DC] bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl" style={CG}>
                  <Users className="h-5 w-5 text-[#0A0F2E]" />
                  Peer Benchmarking
                </CardTitle>
                <CardDescription className="font-medium">How you compare to industry peers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-3 gap-8">
                  <div className="text-center p-6 bg-[#F8F7F4] rounded border border-[#E8E4DC]">
                    <div className="text-4xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#0A0F2E" }} data-testid="industry-avg">
                      {scoreData.industryBenchmark}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280] mt-2">Industry Average</div>
                    <Badge className="mt-4 bg-[#0A0F2E] text-white border-none">{scoreData.executiveRole}</Badge>
                  </div>

                  <div className="text-center p-6 bg-[#2B8A6E]/5 rounded border border-[#2B8A6E]/20">
                    <div className="text-4xl font-bold text-[#2B8A6E]" style={{ fontFamily: "'Cormorant Garamond', serif" }} data-testid="percentile">
                      {scoreData.peerPercentile}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider font-bold text-[#2B8A6E] mt-2">Percentile Rank</div>
                    <Badge className="mt-4 bg-[#2B8A6E] text-white border-none">Top {100 - scoreData.peerPercentile}%</Badge>
                  </div>

                  <div className="text-center p-6 bg-[#C9A84C]/5 rounded border border-[#C9A84C]/20">
                    <div className="text-4xl font-bold text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }} data-testid="delta">
                      {Math.abs(scoreData.score - scoreData.industryBenchmark)}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider font-bold text-[#C9A84C] mt-2">Points {scoreData.score > scoreData.industryBenchmark ? 'Above' : 'Below'} Average</div>
                  </div>
                </div>

                <div className="border-t border-[#E8E4DC] pt-6">
                  <h4 className="font-bold text-[#0A0F2E] mb-4 uppercase tracking-wider text-xs">Competitive Positioning</h4>
                  <div className="space-y-3">
                    {scoreData.score >= scoreData.industryBenchmark + 10 && (
                      <div className="flex items-start gap-3 text-[#2B8A6E] font-medium">
                        <CheckCircle className="h-5 w-5 mt-0.5" />
                        <span>Significantly above industry standard — You are a market leader in organizational preparedness.</span>
                      </div>
                    )}
                    {scoreData.score < scoreData.industryBenchmark && (
                      <div className="flex items-start gap-3 text-[#C9A84C] font-medium">
                        <AlertTriangle className="h-5 w-5 mt-0.5" />
                        <span>Below industry average — Prioritize preparedness activities to reduce executive risk exposure.</span>
                      </div>
                    )}
                    <div className="flex items-start gap-3 text-[#0A0F2E] font-medium">
                      <TrendingUp className="h-5 w-5 mt-0.5 text-[#C9A84C]" />
                      <span>Anonymous benchmarking ensures fair comparison across {scoreData.executiveRole} peers in similar sectors.</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gaps" className="space-y-4 mt-8">
            <Card className="border border-[#E8E4DC] bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl" style={CG}>
                  <AlertTriangle className="h-5 w-5 text-[#C9A84C]" />
                  Coverage Gaps Analysis
                </CardTitle>
                <CardDescription className="font-medium">High-risk scenarios requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                {coverageGaps.length === 0 ? (
                  <div className="text-center py-12" data-testid="no-gaps">
                    <CheckCircle className="h-16 w-16 mx-auto mb-4 text-[#2B8A6E]" />
                    <p className="font-bold text-[#0A0F2E] text-lg">No critical coverage gaps identified</p>
                    <p className="text-[#6B7280] mt-1 font-medium">You have addressed all high-priority executive scenarios.</p>
                  </div>
                ) : (
                  <div className="space-y-4" data-testid="gaps-list">
                    {coverageGaps.map((gap: any, index: number) => (
                      <div key={index} className="border border-[#E8E4DC] rounded p-6 bg-[#F8F7F4] hover:border-[#C9A84C] transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="font-bold text-[#0A0F2E] text-lg" style={CG}>{gap.category}</h4>
                            <Badge className={`mt-2 border-none ${gap.severity === 'high' ? 'bg-[#0A0F2E] text-white' : 'bg-[#C9A84C] text-[#0A0F2E]'} font-bold uppercase tracking-wider text-[10px]`}>
                              {gap.severity} priority gap
                            </Badge>
                          </div>
                          <Target className="h-6 w-6 text-[#C9A84C]" />
                        </div>
                        <p className="text-sm text-[#0A0F2E] font-medium leading-relaxed mb-4">{gap.recommendation}</p>
                        {gap.missingPlaybooks && gap.missingPlaybooks.length > 0 && (
                          <div className="bg-white p-4 rounded border border-[#E8E4DC]">
                            <div className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280] mb-2">Missing Strategic Playbooks:</div>
                            <ul className="grid grid-cols-2 gap-2">
                              {gap.missingPlaybooks.map((playbook: string, i: number) => (
                                <li key={i} className="text-sm font-bold text-[#0A0F2E] flex items-center gap-2">
                                  <div className="h-1.5 w-1.5 rounded-full bg-[#C9A84C]"></div>
                                  {playbook}
                                </li>
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

          <TabsContent value="trends" className="space-y-4 mt-8">
            <Card className="border border-[#E8E4DC] bg-white">
              <CardHeader>
                <CardTitle style={CG} className="text-xl">Score History (Last 30 Days)</CardTitle>
                <CardDescription className="font-medium">Track your preparedness improvement over time</CardDescription>
              </CardHeader>
              <CardContent>
                {scoreHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="font-bold text-[#0A0F2E]">No historical data available yet</p>
                    <p className="text-[#6B7280] text-sm mt-1">Continue practicing to build your readiness trend history.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {scoreHistory.slice(0, 10).map((entry: any, index: number) => (
                      <div key={index} className="flex items-center justify-between border-b border-[#E8E4DC] py-4 last:border-none">
                        <div className="text-sm font-bold text-[#6B7280] uppercase tracking-wider">
                          {new Date(entry.calculatedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-2xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#0A0F2E" }}>{entry.score}</div>
                          {entry.scoreDelta !== 0 && (
                            <Badge className={`border-none font-bold ${entry.scoreDelta > 0 ? 'bg-[#2B8A6E] text-white' : 'bg-[#0A0F2E] text-white'}`}>
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

          <TabsContent value="recommendations" className="space-y-4 mt-8">
            <Card className="border border-[#E8E4DC] bg-white">
              <CardHeader>
                <CardTitle style={CG} className="text-xl">Recommended Strategic Actions</CardTitle>
                <CardDescription className="font-medium">Priority steps to improve your executive preparedness score</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {readinessMetrics.scenariosPracticed < 30 && (
                  <div className="flex items-start gap-4 p-6 bg-[#0A0F2E]/5 border border-[#0A0F2E]/10 rounded" data-testid="rec-scenarios">
                    <Target className="h-6 w-6 text-[#0A0F2E] mt-1" />
                    <div className="flex-1">
                      <div className="font-bold text-[#0A0F2E] text-lg" style={CG}>Practice More Scenarios</div>
                      <p className="text-sm text-[#0A0F2E] font-medium mt-1 leading-relaxed">
                        Complete {Math.ceil((30 - (readinessMetrics.scenariosPracticed || 0)) / 3)} more what-if analyses to maximize this category. This will add up to {30 - (readinessMetrics.scenariosPracticed || 0)} points to your overall score.
                      </p>
                      <Link href="/what-if-analyzer">
                        <Button className="mt-4 bg-[#0A0F2E] text-white hover:bg-[#141B45] font-bold" size="sm" data-testid="button-goto-analyzer">Go to What-If Analyzer</Button>
                      </Link>
                    </div>
                  </div>
                )}

                {readinessMetrics.drillsCompleted < 25 && (
                  <div className="flex items-start gap-4 p-6 bg-[#2B8A6E]/5 border border-[#2B8A6E]/10 rounded" data-testid="rec-drills">
                    <Shield className="h-6 w-6 text-[#2B8A6E] mt-1" />
                    <div className="flex-1">
                      <div className="font-bold text-[#2B8A6E] text-lg" style={CG}>Run Playbook Drills</div>
                      <p className="text-sm text-[#2B8A6E] font-medium mt-1 leading-relaxed">
                        Complete {Math.ceil((25 - (readinessMetrics.drillsCompleted || 0)) / 5)} more playbook drills. This will strengthen team coordination and add up to {25 - (readinessMetrics.drillsCompleted || 0)} points.
                      </p>
                      <Link href="/playbook-library">
                        <Button className="mt-4 bg-[#2B8A6E] text-white hover:bg-[#3BAF8A] font-bold" size="sm" data-testid="button-goto-playbooks">View Playbooks</Button>
                      </Link>
                    </div>
                  </div>
                )}

                {readinessMetrics.triggersCovered < 20 && (
                  <div className="flex items-start gap-4 p-6 bg-[#C9A84C]/5 border border-[#C9A84C]/10 rounded" data-testid="rec-triggers">
                    <AlertTriangle className="h-6 w-6 text-[#C9A84C] mt-1" />
                    <div className="flex-1">
                      <div className="font-bold text-[#C9A84C] text-lg" style={CG}>Configure More Triggers</div>
                      <p className="text-sm text-[#C9A84C] font-medium mt-1 leading-relaxed">
                        Set up {Math.ceil((20 - (readinessMetrics.triggersCovered || 0)) / 4)} more executive triggers to ensure rapid detection of critical events. This adds up to {20 - (readinessMetrics.triggersCovered || 0)} points.
                      </p>
                      <Link href="/trigger-dashboard">
                        <Button className="mt-4 bg-[#C9A84C] text-[#0A0F2E] hover:bg-[#DFC178] font-bold" size="sm" data-testid="button-goto-triggers">Manage Triggers</Button>
                      </Link>
                    </div>
                  </div>
                )}

                {readinessMetrics.recentActivity < 10 && (
                  <div className="flex items-start gap-4 p-6 bg-[#F8F7F4] border border-[#E8E4DC] rounded" data-testid="rec-activity">
                    <TrendingUp className="h-6 w-6 text-[#0A0F2E] mt-1" />
                    <div className="flex-1">
                      <div className="font-bold text-[#0A0F2E] text-lg" style={CG}>Increase Recent Activity</div>
                      <p className="text-sm text-[#0A0F2E] font-medium mt-1 leading-relaxed">
                        Stay active with regular practice — aim for 5+ readiness activities in the last 30 days to maintain peak performance and maximize your score (+{10 - (readinessMetrics.recentActivity || 0)} points).
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
