import StandardNav from '@/components/layout/StandardNav';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlayCircle, Trophy, Users, Clock, TrendingUp, Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const demoDrills = [
  {
    id: 'drill-001',
    name: 'Enterprise Ransomware Response Drill',
    status: 'completed',
    difficulty: 'advanced',
    scenarioType: 'Cybersecurity',
    participants: [
      { name: 'Sarah Chen', role: 'CISO' },
      { name: 'Michael Torres', role: 'VP Engineering' },
      { name: 'David Park', role: 'General Counsel' },
      { name: 'Lisa Wang', role: 'CFO' },
      { name: 'James Mitchell', role: 'VP Communications' },
      { name: 'Rachel Kim', role: 'CTO' }
    ],
    duration: 120,
    performanceMetrics: {
      overallScore: 91,
      decisionSpeed: 88,
      communicationClarity: 94,
      stakeholderAlignment: 89,
      resourceAllocation: 92
    },
    lessons: [
      'Initial containment protocol executed in 8 minutes — 40% faster than previous drill',
      'External communication template activated within SLA, reducing stakeholder uncertainty',
      'Cross-functional handoff between security and legal teams needs tighter coordination'
    ]
  },
  {
    id: 'drill-002',
    name: 'M&A Integration Tabletop Exercise',
    status: 'completed',
    difficulty: 'intermediate',
    scenarioType: 'Strategic',
    participants: [
      { name: 'Lisa Wang', role: 'CFO' },
      { name: 'David Park', role: 'General Counsel' },
      { name: 'Amanda Brooks', role: 'VP Strategy' },
      { name: 'Robert Chen', role: 'VP HR' },
      { name: 'Karen Patel', role: 'VP Operations' }
    ],
    duration: 90,
    performanceMetrics: {
      overallScore: 86,
      decisionSpeed: 82,
      communicationClarity: 91,
      stakeholderAlignment: 84,
      resourceAllocation: 87
    },
    lessons: [
      'Due diligence checklist completion improved from 72% to 94% with structured playbook',
      'Cultural integration assessment protocol successfully tested with realistic talent scenarios'
    ]
  },
  {
    id: 'drill-003',
    name: 'Supply Chain Disruption Simulation',
    status: 'completed',
    difficulty: 'advanced',
    scenarioType: 'Operational',
    participants: [
      { name: 'Karen Patel', role: 'VP Operations' },
      { name: 'Tom Nakamura', role: 'Head of Procurement' },
      { name: 'Lisa Wang', role: 'CFO' },
      { name: 'Sarah Chen', role: 'CISO' },
      { name: 'James Mitchell', role: 'VP Communications' }
    ],
    duration: 105,
    performanceMetrics: {
      overallScore: 78,
      decisionSpeed: 74,
      communicationClarity: 82,
      stakeholderAlignment: 76,
      resourceAllocation: 80
    },
    lessons: [
      'Alternative supplier activation took 35 minutes — target is under 20 minutes',
      'Financial impact modeling was accurate within 8% of projected disruption cost',
      'Customer communication cadence needs acceleration — first update delayed by 12 minutes'
    ]
  },
  {
    id: 'drill-004',
    name: 'Regulatory Audit Readiness Check',
    status: 'scheduled',
    difficulty: 'intermediate',
    scenarioType: 'Compliance',
    participants: [
      { name: 'David Park', role: 'General Counsel' },
      { name: 'Sarah Chen', role: 'CISO' },
      { name: 'Lisa Wang', role: 'CFO' },
      { name: 'Emily Foster', role: 'Compliance Director' }
    ],
    duration: 75,
    performanceMetrics: null,
    lessons: []
  },
  {
    id: 'drill-005',
    name: 'Competitive Response Exercise — Market Disruption',
    status: 'completed',
    difficulty: 'advanced',
    scenarioType: 'Competitive',
    participants: [
      { name: 'Amanda Brooks', role: 'VP Strategy' },
      { name: 'Michael Torres', role: 'VP Engineering' },
      { name: 'Rachel Kim', role: 'CTO' },
      { name: 'Lisa Wang', role: 'CFO' },
      { name: 'James Mitchell', role: 'VP Communications' },
      { name: 'Karen Patel', role: 'VP Operations' },
      { name: 'Tom Nakamura', role: 'Head of Product' }
    ],
    duration: 135,
    performanceMetrics: {
      overallScore: 88,
      decisionSpeed: 85,
      communicationClarity: 92,
      stakeholderAlignment: 87,
      resourceAllocation: 88
    },
    lessons: [
      'Competitive intelligence synthesis completed in 15 minutes with pre-built analysis templates',
      'Pricing response strategy formulated and war-gamed across 3 scenarios within SLA'
    ]
  }
];

export default function DrillTrackingSystem() {
  const { data: simulationsData, isLoading } = useQuery<any[]>({
    queryKey: ['/api/crisis-simulations'],
  });
  const simulations = (simulationsData && simulationsData.length > 0) ? simulationsData : demoDrills;

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
            <PlayCircle className="h-4 w-4 text-blue-800" />
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
            <Users className="h-4 w-4 text-emerald-700" />
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
            <TrendingUp className="h-4 w-4 text-blue-800" />
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
