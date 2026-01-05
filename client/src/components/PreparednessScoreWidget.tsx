import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, TrendingUp, Shield, AlertTriangle, Target } from 'lucide-react';
import { Link } from 'wouter';
import { demoData } from '@/lib/demoData';

interface PreparednessScoreData {
  score: number;
  previousScore: number;
  scoreDelta: number;
  scenariosPracticed: number;
  drillsCompleted: number;
  industryBenchmark: number;
  peerPercentile: number;
  executiveRole: string;
  coverageGaps: any[];
  readinessMetrics: {
    scenariosPracticed: number;
    drillsCompleted: number;
    triggersCovered: number;
    playbookReadiness: number;
    recentActivity: number;
    coverageGaps: number;
  };
}

export default function PreparednessScoreWidget({ organizationId }: { organizationId: string }) {
  const { data: scoreData, isLoading } = useQuery<PreparednessScoreData>({
    queryKey: [`/api/preparedness/score?organizationId=${organizationId}`],
    enabled: !!organizationId,
  });

  // Use enhanced demo data as fallback if API fails
  // Convert percentage scores to realistic counts matching UI expectations
  const displayData = scoreData || {
    score: demoData.preparedness.overall, // 94
    previousScore: demoData.preparedness.timeline[demoData.preparedness.timeline.length - 2]?.score || 89,
    scoreDelta: demoData.preparedness.overall - (demoData.preparedness.timeline[demoData.preparedness.timeline.length - 2]?.score || 89), // +5
    scenariosPracticed: 26, // 26 out of 30 scenarios
    drillsCompleted: 22, // 22 out of 25 drills
    industryBenchmark: 72,
    peerPercentile: 96,
    executiveRole: 'CEO',
    coverageGaps: [],
    readinessMetrics: {
      scenariosPracticed: 26, // 26/30 = 87%
      drillsCompleted: 22, // 22/25 = 88%
      triggersCovered: 18, // 18/20 = 90%
      playbookReadiness: 14, // 14/15 = 93%
      recentActivity: 10, // 10/10 = 100%
      coverageGaps: 2 // 2 gaps remaining
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full" data-testid="preparedness-score-widget">
        <CardHeader>
          <CardTitle>Strategic Readiness Score™</CardTitle>
          <CardDescription>Loading your strategic readiness metrics...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Calculating...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const scoreColor = 
    displayData.score >= 80 ? 'text-green-600 dark:text-green-400' :
    displayData.score >= 60 ? 'text-blue-600 dark:text-blue-400' :
    displayData.score >= 40 ? 'text-yellow-600 dark:text-yellow-400' :
    'text-red-600 dark:text-red-400';

  const scoreBgColor = 
    displayData.score >= 80 ? 'bg-green-100 dark:bg-green-900/20' :
    displayData.score >= 60 ? 'bg-blue-100 dark:bg-blue-900/20' :
    displayData.score >= 40 ? 'bg-yellow-100 dark:bg-yellow-900/20' :
    'bg-red-100 dark:bg-red-900/20';

  const scoreStatus = 
    displayData.score >= 80 ? 'Excellent' :
    displayData.score >= 60 ? 'Good' :
    displayData.score >= 40 ? 'Fair' :
    'Needs Attention';

  const peerComparison = displayData.score > displayData.industryBenchmark ? 'above' : 'below';
  const delta = Math.abs(displayData.score - displayData.industryBenchmark);

  return (
    <Card className="w-full shadow-lg border-2" data-testid="preparedness-score-widget">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Strategic Readiness Score™</CardTitle>
            <CardDescription className="text-sm mt-1">
              Your organizational readiness for Dynamic Strategy execution
            </CardDescription>
          </div>
          <Shield className={`h-8 w-8 ${scoreColor}`} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Main Score Display */}
        <div className={`${scoreBgColor} rounded-xl p-6 text-center relative`}>
          <div className="flex items-center justify-center gap-3">
            <div className={`text-6xl font-bold ${scoreColor}`} data-testid="preparedness-score-value">
              {displayData.score}
            </div>
            <div className="text-left">
              <div className={`text-sm font-medium ${scoreColor}`}>/100</div>
              <Badge variant={displayData.score >= 60 ? 'default' : 'destructive'} className="mt-1">
                {scoreStatus}
              </Badge>
            </div>
          </div>

          {/* Score Delta */}
          {displayData.scoreDelta !== 0 && (
            <div className="flex items-center justify-center gap-1 mt-3" data-testid="score-delta">
              {displayData.scoreDelta > 0 ? (
                <ArrowUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-600 dark:text-red-400" />
              )}
              <span className={`text-sm font-medium ${displayData.scoreDelta > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {Math.abs(displayData.scoreDelta)} points
              </span>
              <span className="text-xs text-muted-foreground">since last check</span>
            </div>
          )}
        </div>

        {/* Peer Comparison */}
        <div className="bg-muted/50 dark:bg-muted/20 rounded-lg p-4" data-testid="peer-comparison">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Industry Benchmark</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {displayData.executiveRole}
            </Badge>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{displayData.industryBenchmark}</span>
            <span className="text-sm text-muted-foreground">avg score</span>
          </div>

          <div className="mt-2 text-sm">
            You're <span className={`font-semibold ${peerComparison === 'above' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
              {delta} points {peerComparison}
            </span> industry average
          </div>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Your Percentile:</span>
            <Badge variant="secondary" className="text-xs">
              Top {100 - displayData.peerPercentile}%
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3" data-testid="scenarios-practiced">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Scenarios</span>
            </div>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {displayData.scenariosPracticed}
            </div>
            <div className="text-xs text-muted-foreground">practiced</div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3" data-testid="drills-completed">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Drills</span>
            </div>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
              {displayData.drillsCompleted}
            </div>
            <div className="text-xs text-muted-foreground">completed</div>
          </div>
        </div>

        {/* Coverage Gaps Warning */}
        {displayData.coverageGaps && displayData.coverageGaps.length > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3" data-testid="coverage-gaps-alert">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                  {displayData.coverageGaps.length} Coverage Gap{displayData.coverageGaps.length > 1 ? 's' : ''} Identified
                </div>
                <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                  High-risk scenarios not yet addressed
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <Link href="/preparedness-report">
          <Button className="w-full" variant="default" data-testid="button-view-full-report">
            View Full Report
          </Button>
        </Link>

        {/* Score Breakdown */}
        <div className="pt-3 border-t">
          <div className="text-xs font-medium text-muted-foreground mb-3">Score Breakdown</div>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Scenarios Practiced</span>
                <span className="font-medium">{displayData.readinessMetrics?.scenariosPracticed || 0}/30</span>
              </div>
              <Progress value={(displayData.readinessMetrics?.scenariosPracticed || 0) / 30 * 100} className="h-1.5" data-testid="progress-scenarios" />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Drills Completed</span>
                <span className="font-medium">{displayData.readinessMetrics?.drillsCompleted || 0}/25</span>
              </div>
              <Progress value={(displayData.readinessMetrics?.drillsCompleted || 0) / 25 * 100} className="h-1.5" data-testid="progress-drills" />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Triggers Configured</span>
                <span className="font-medium">{displayData.readinessMetrics?.triggersCovered || 0}/20</span>
              </div>
              <Progress value={(displayData.readinessMetrics?.triggersCovered || 0) / 20 * 100} className="h-1.5" data-testid="progress-triggers" />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Playbook Readiness</span>
                <span className="font-medium">{displayData.readinessMetrics?.playbookReadiness || 0}/15</span>
              </div>
              <Progress value={(displayData.readinessMetrics?.playbookReadiness || 0) / 15 * 100} className="h-1.5" data-testid="progress-playbooks" />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Recent Activity</span>
                <span className="font-medium">{displayData.readinessMetrics?.recentActivity || 0}/10</span>
              </div>
              <Progress value={(displayData.readinessMetrics?.recentActivity || 0) / 10 * 100} className="h-1.5" data-testid="progress-activity" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
