import StandardNav from '@/components/layout/StandardNav';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlayCircle, Trophy, Users, Clock, TrendingUp, Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function DrillTrackingSystem() {
  const { data: simulationsData, isLoading } = useQuery<any[]>({
    queryKey: ['/api/crisis-simulations'],
  });
  const simulations = simulationsData ?? [];

  const completedDrills = simulations.filter((s: any) => s.status === 'completed');
  const avgPerformance = completedDrills.length > 0
    ? completedDrills.reduce((acc: number, s: any) => acc + (s.performanceMetrics?.overallScore || 75), 0) / completedDrills.length
    : 0;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-500',
      scheduled: 'bg-blue-500',
      running: 'bg-green-500',
      completed: 'bg-purple-500',
      cancelled: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getDifficultyBadge = (difficulty: string) => {
    const variants: Record<string, any> = {
      basic: 'secondary',
      intermediate: 'default',
      advanced: 'destructive'
    };
    return variants[difficulty] || 'default';
  };

  return (
    <div className="space-y-6 p-6">
      {/* V2 Feature Banner */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-300 dark:border-blue-700 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold">Coming in V2</Badge>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            This feature launches after you practice with What-If Analyzer. Drill Tracking measures your team's preparedness with quarterly simulations.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2" data-testid="page-title">
            <Target className="h-8 w-8 text-green-500" />
            Drill Tracking System
          </h1>
          <p className="text-muted-foreground mt-1">
            Practice scenarios quarterly to maintain Executive Preparedness Score™
          </p>
        </div>
        <Button data-testid="button-create-drill">
          <PlayCircle className="h-4 w-4 mr-2" />
          Schedule New Drill
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card data-testid="card-total-drills">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Drills</CardTitle>
            <PlayCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{simulations.length}</div>
            <p className="text-xs text-muted-foreground">
              {completedDrills.length} completed
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-avg-performance">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(avgPerformance)}%</div>
            <p className="text-xs text-muted-foreground">
              Across all completed drills
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-participants">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Participants</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {simulations.reduce((acc: number, s: any) => {
                return acc + (s.participants?.length || 0);
              }, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total executive involvement
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-readiness-score">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Readiness Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedDrills.length >= 4 ? 'Green' : completedDrills.length >= 2 ? 'Yellow' : 'Red'}
            </div>
            <p className="text-xs text-muted-foreground">
              Based on drill frequency
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Drills List */}
      <Card>
        <CardHeader>
          <CardTitle>Crisis Simulation Drills</CardTitle>
          <CardDescription>
            Practice playbook execution with team performance tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading drills...</div>
          ) : simulations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>No drills scheduled yet</p>
              <Button className="mt-4" data-testid="button-schedule-first-drill">Schedule First Drill</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {simulations.map((sim: any) => (
                <div 
                  key={sim.id} 
                  className="border rounded-lg p-4 space-y-3"
                  data-testid={`drill-${sim.id}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 page-background space-y-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(sim.status)}`} data-testid={`status-indicator-${sim.id}`} />
                        <h3 className="font-semibold" data-testid={`text-drill-name-${sim.id}`}>{sim.name}</h3>
                        <Badge variant={getDifficultyBadge(sim.difficulty)} data-testid={`badge-difficulty-${sim.id}`}>
                          {sim.difficulty}
                        </Badge>
                        <Badge variant="outline">{sim.scenarioType}</Badge>
                      </div>
                      
                      {sim.participants && sim.participants.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{sim.participants.length} participants</span>
                        </div>
                      )}

                      {sim.duration && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{sim.duration} minutes</span>
                        </div>
                      )}

                      {sim.status === 'completed' && sim.performanceMetrics && (
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Overall Performance</span>
                            <span className="font-medium">{sim.performanceMetrics.overallScore || 75}%</span>
                          </div>
                          <Progress value={sim.performanceMetrics.overallScore || 75} className="h-2" />
                        </div>
                      )}

                      {sim.lessons && sim.lessons.length > 0 && (
                        <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md">
                          <p className="text-sm font-medium mb-1">Key Learnings:</p>
                          <ul className="list-disc list-inside text-sm text-muted-foreground">
                            {(sim.lessons as any[]).slice(0, 2).map((lesson: string, idx: number) => (
                              <li key={idx}>{lesson}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      {sim.status === 'completed' && (
                        <Button size="sm" variant="outline" data-testid={`button-view-results-${sim.id}`}>
                          View Results
                        </Button>
                      )}
                      {sim.status === 'scheduled' && (
                        <Button size="sm" data-testid={`button-start-drill-${sim.id}`}>
                          Start Drill
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
