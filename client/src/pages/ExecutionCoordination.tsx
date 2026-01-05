import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StandardNav from "@/components/layout/StandardNav";
import Footer from "@/components/layout/Footer";
import { 
  Play, Clock, CheckCircle, Users, Target, Zap, 
  ArrowRight, Circle, AlertCircle, Pause, RotateCcw
} from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

interface ExecutionTask {
  id: string;
  title: string;
  assignee: string;
  role: string;
  status: 'pending' | 'blocked' | 'ready' | 'in_progress' | 'completed' | 'failed';
  isParallel: boolean;
  parallelGroup?: number;
  estimatedMinutes: number;
  actualMinutes?: number;
  startedAt?: string;
  completedAt?: string;
  dependencies: string[];
}

interface ExecutionPhase {
  id: string;
  name: string;
  startMinute: number;
  endMinute: number;
  tasks: ExecutionTask[];
}

// Sample execution scenarios for each category of the Strategic Triad
const sampleExecutions = {
  offense: {
    id: 'exec-offense-001',
    scenario: 'M&A Target Acquisition',
    category: 'offense',
    categoryLabel: 'OFFENSE',
    categoryColor: 'emerald',
    triggeredAt: new Date(Date.now() - 18 * 60000).toISOString(),
    status: 'running',
    totalTasks: 38,
    completedTasks: 24,
    currentPhase: 'secondary',
    phases: [
      {
        id: 'phase-1',
        name: 'OPPORTUNITY CAPTURE (0-2 min)',
        startMinute: 0,
        endMinute: 2,
        tasks: [
          { id: 't1', title: 'Activate acquisition playbook', assignee: 'CEO', role: 'Executive', status: 'completed', isParallel: true, parallelGroup: 1, estimatedMinutes: 1, actualMinutes: 1, dependencies: [] },
          { id: 't2', title: 'Alert M&A team', assignee: 'CFO', role: 'Finance', status: 'completed', isParallel: true, parallelGroup: 1, estimatedMinutes: 1, actualMinutes: 1, dependencies: [] },
          { id: 't3', title: 'Pull due diligence template', assignee: 'Legal', role: 'Legal', status: 'completed', isParallel: true, parallelGroup: 1, estimatedMinutes: 1, actualMinutes: 1, dependencies: [] },
        ]
      },
      {
        id: 'phase-2',
        name: 'DUE DILIGENCE (2-8 min)',
        startMinute: 2,
        endMinute: 8,
        tasks: [
          { id: 't4', title: 'Financial review checklist', assignee: 'CFO', role: 'Finance', status: 'completed', isParallel: true, parallelGroup: 2, estimatedMinutes: 5, actualMinutes: 4, dependencies: ['t1'] },
          { id: 't5', title: 'Legal risk assessment', assignee: 'General Counsel', role: 'Legal', status: 'in_progress', isParallel: true, parallelGroup: 2, estimatedMinutes: 5, dependencies: ['t3'] },
          { id: 't6', title: 'Technical integration planning', assignee: 'CTO', role: 'Technology', status: 'in_progress', isParallel: true, parallelGroup: 2, estimatedMinutes: 4, dependencies: ['t1'] },
        ]
      }
    ] as ExecutionPhase[]
  },
  defense: {
    id: 'exec-defense-001',
    scenario: 'Data Breach Response',
    category: 'defense',
    categoryLabel: 'DEFENSE',
    categoryColor: 'blue',
    triggeredAt: new Date(Date.now() - 25 * 60000).toISOString(),
    status: 'running',
    totalTasks: 47,
    completedTasks: 32,
    currentPhase: 'secondary',
    phases: [
      {
        id: 'phase-1',
        name: 'CONTAINMENT (0-2 min)',
        startMinute: 0,
        endMinute: 2,
        tasks: [
          { id: 't1', title: 'Contain breach - isolate systems', assignee: 'Mike Chen', role: 'CISO', status: 'completed', isParallel: true, parallelGroup: 1, estimatedMinutes: 2, actualMinutes: 1, dependencies: [] },
          { id: 't2', title: 'Preserve forensic evidence', assignee: 'Sarah Kim', role: 'IT Security', status: 'completed', isParallel: true, parallelGroup: 1, estimatedMinutes: 2, actualMinutes: 2, dependencies: [] },
          { id: 't3', title: 'Pull breach response template', assignee: 'James Wilson', role: 'Legal', status: 'completed', isParallel: true, parallelGroup: 1, estimatedMinutes: 1, actualMinutes: 1, dependencies: [] },
        ]
      },
      {
        id: 'phase-2',
        name: 'COORDINATION (2-5 min)',
        startMinute: 2,
        endMinute: 5,
        tasks: [
          { id: 't4', title: 'Draft public statement', assignee: 'Emily Roberts', role: 'Comms', status: 'completed', isParallel: false, estimatedMinutes: 5, actualMinutes: 4, dependencies: ['t3'] },
          { id: 't5', title: 'Review statement for compliance', assignee: 'James Wilson', role: 'Legal', status: 'in_progress', isParallel: false, estimatedMinutes: 3, dependencies: ['t4'] },
          { id: 't6', title: 'Notify regulatory bodies', assignee: 'Legal', role: 'Legal', status: 'pending', isParallel: false, estimatedMinutes: 5, dependencies: ['t5'] },
        ]
      }
    ] as ExecutionPhase[]
  },
  special_teams: {
    id: 'exec-special-001',
    scenario: 'AI Model Governance Review',
    category: 'special_teams',
    categoryLabel: 'SPECIAL TEAMS',
    categoryColor: 'purple',
    triggeredAt: new Date(Date.now() - 12 * 60000).toISOString(),
    status: 'running',
    totalTasks: 32,
    completedTasks: 18,
    currentPhase: 'primary',
    phases: [
      {
        id: 'phase-1',
        name: 'GOVERNANCE ACTIVATION (0-2 min)',
        startMinute: 0,
        endMinute: 2,
        tasks: [
          { id: 't1', title: 'Activate AI governance playbook', assignee: 'Chief AI Officer', role: 'AI', status: 'completed', isParallel: true, parallelGroup: 1, estimatedMinutes: 1, actualMinutes: 1, dependencies: [] },
          { id: 't2', title: 'Alert ethics review board', assignee: 'Ethics Lead', role: 'Compliance', status: 'completed', isParallel: true, parallelGroup: 1, estimatedMinutes: 1, actualMinutes: 1, dependencies: [] },
          { id: 't3', title: 'Pull AI principles framework', assignee: 'Legal', role: 'Legal', status: 'completed', isParallel: true, parallelGroup: 1, estimatedMinutes: 1, actualMinutes: 1, dependencies: [] },
        ]
      },
      {
        id: 'phase-2',
        name: 'ASSESSMENT (2-8 min)',
        startMinute: 2,
        endMinute: 8,
        tasks: [
          { id: 't4', title: 'Model bias assessment', assignee: 'Data Science Lead', role: 'AI', status: 'completed', isParallel: true, parallelGroup: 2, estimatedMinutes: 4, actualMinutes: 3, dependencies: ['t1'] },
          { id: 't5', title: 'Privacy impact analysis', assignee: 'Privacy Officer', role: 'Legal', status: 'in_progress', isParallel: true, parallelGroup: 2, estimatedMinutes: 4, dependencies: ['t3'] },
          { id: 't6', title: 'Explainability documentation', assignee: 'ML Engineer', role: 'Technology', status: 'in_progress', isParallel: true, parallelGroup: 2, estimatedMinutes: 3, dependencies: ['t1'] },
        ]
      }
    ] as ExecutionPhase[]
  }
};

type CategoryKey = 'offense' | 'defense' | 'special_teams';

const statusConfig = {
  pending: { color: 'bg-slate-200 text-slate-600', icon: Circle, label: 'Pending' },
  blocked: { color: 'bg-red-100 text-red-600', icon: AlertCircle, label: 'Blocked' },
  ready: { color: 'bg-blue-100 text-blue-600', icon: Play, label: 'Ready' },
  in_progress: { color: 'bg-amber-100 text-amber-600', icon: Pause, label: 'In Progress' },
  completed: { color: 'bg-emerald-100 text-emerald-600', icon: CheckCircle, label: 'Completed' },
  failed: { color: 'bg-red-100 text-red-600', icon: AlertCircle, label: 'Failed' },
};

export default function ExecutionCoordination() {
  const [, setLocation] = useLocation();
  const [selectedTask, setSelectedTask] = useState<ExecutionTask | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('offense');
  
  const sampleExecution = sampleExecutions[activeCategory];
  const completionPercent = Math.round((sampleExecution.completedTasks / sampleExecution.totalTasks) * 100);
  const elapsedMinutes = Math.round((Date.now() - new Date(sampleExecution.triggeredAt).getTime()) / 60000);
  
  const categoryStyles = {
    offense: { bg: 'from-emerald-50 to-green-50 dark:from-emerald-950/40 dark:to-green-950/40', border: 'border-emerald-300 dark:border-emerald-700', text: 'text-emerald-600 dark:text-emerald-400', icon: 'bg-emerald-500' },
    defense: { bg: 'from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40', border: 'border-blue-300 dark:border-blue-700', text: 'text-blue-600 dark:text-blue-400', icon: 'bg-blue-500' },
    special_teams: { bg: 'from-purple-50 to-violet-50 dark:from-purple-950/40 dark:to-violet-950/40', border: 'border-purple-300 dark:border-purple-700', text: 'text-purple-600 dark:text-purple-400', icon: 'bg-purple-500' }
  };
  
  const currentStyle = categoryStyles[activeCategory];
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <StandardNav />
      
      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white" data-testid="page-title">
                Execution Coordination
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Real-time coordinated response tracking
              </p>
            </div>
          </div>
        </div>
        
        {/* Strategic Triad Selector */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => setActiveCategory('offense')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
              activeCategory === 'offense' 
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 ring-2 ring-emerald-400/50' 
                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-emerald-300'
            }`}
            data-testid="triad-offense"
          >
            <p className="text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold mb-1">OFFENSE</p>
            <p className={`text-sm ${activeCategory === 'offense' ? 'text-emerald-700 dark:text-emerald-300 font-medium' : 'text-slate-600 dark:text-slate-400'}`}>
              {activeCategory === 'offense' ? 'M&A Target Acquisition' : 'Seize Opportunities'}
            </p>
          </button>
          <button
            onClick={() => setActiveCategory('defense')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
              activeCategory === 'defense' 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 ring-2 ring-blue-400/50' 
                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-blue-300'
            }`}
            data-testid="triad-defense"
          >
            <p className="text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold mb-1">DEFENSE</p>
            <p className={`text-sm ${activeCategory === 'defense' ? 'text-blue-700 dark:text-blue-300 font-medium' : 'text-slate-600 dark:text-slate-400'}`}>
              {activeCategory === 'defense' ? 'Data Breach Response' : 'Protect Value'}
            </p>
          </button>
          <button
            onClick={() => setActiveCategory('special_teams')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
              activeCategory === 'special_teams' 
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30 ring-2 ring-purple-400/50' 
                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-purple-300'
            }`}
            data-testid="triad-special"
          >
            <p className="text-xs uppercase tracking-wider text-purple-600 dark:text-purple-400 font-semibold mb-1">SPECIAL TEAMS</p>
            <p className={`text-sm ${activeCategory === 'special_teams' ? 'text-purple-700 dark:text-purple-300 font-medium' : 'text-slate-600 dark:text-slate-400'}`}>
              {activeCategory === 'special_teams' ? 'AI Model Governance' : 'Drive Innovation'}
            </p>
          </button>
        </div>
        
        {/* Game Day Mindset Banner */}
        <Card className={`mb-8 bg-gradient-to-r ${currentStyle.bg} border-2 ${currentStyle.border}`} data-testid="game-day-banner">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 ${currentStyle.icon} rounded-full flex items-center justify-center`}>
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                    Game Day Execution
                  </p>
                  <p className="text-lg text-slate-600 dark:text-slate-400">
                    You prepared all week. Now just execute—whether seizing an opportunity, defending against a threat, or driving innovation.
                  </p>
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-sm text-slate-500 mb-1">The Mindset:</p>
                <p className={`text-lg font-semibold ${currentStyle.text}`}>
                  "Comfortable. Confident. Prepared."
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Active Execution Banner */}
        <Card className="mb-8 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border-emerald-200 dark:border-emerald-800">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-emerald-500 text-white animate-pulse">LIVE</Badge>
                  <span className="text-2xl font-bold text-slate-900 dark:text-white" data-testid="text-scenario">
                    {sampleExecution.scenario}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  Triggered {elapsedMinutes} minutes ago • {sampleExecution.completedTasks}/{sampleExecution.totalTasks} tasks complete
                </p>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600" data-testid="text-completion">
                    {completionPercent}%
                  </div>
                  <div className="text-sm text-slate-500">Complete</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600" data-testid="text-elapsed">
                    {elapsedMinutes}m
                  </div>
                  <div className="text-sm text-slate-500">Elapsed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600">
                    ~{Math.max(0, 45 - elapsedMinutes)}m
                  </div>
                  <div className="text-sm text-slate-500">Remaining</div>
                </div>
              </div>
            </div>
            
            <Progress value={completionPercent} className="mt-4 h-3" />
          </CardContent>
        </Card>
        
        {/* Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white dark:bg-slate-800">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white" data-testid="metric-completed">
                  {sampleExecution.completedTasks}
                </div>
                <div className="text-sm text-slate-500">Completed</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-slate-800">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                <Play className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {sampleExecution.phases.flatMap(p => p.tasks).filter(t => t.status === 'in_progress').length}
                </div>
                <div className="text-sm text-slate-500">In Progress</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-slate-800">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  12
                </div>
                <div className="text-sm text-slate-500">Stakeholders</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-slate-800">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  45m
                </div>
                <div className="text-sm text-slate-500">Target Time</div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Phase-based Task View */}
        <Tabs defaultValue="timeline" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="timeline" data-testid="tab-timeline">Timeline View</TabsTrigger>
            <TabsTrigger value="roles" data-testid="tab-roles">By Role</TabsTrigger>
            <TabsTrigger value="dependencies" data-testid="tab-dependencies">Dependencies</TabsTrigger>
          </TabsList>
          
          <TabsContent value="timeline">
            <div className="space-y-6">
              {sampleExecution.phases.map((phase, phaseIndex) => {
                const phaseTasks = phase.tasks;
                const completedCount = phaseTasks.filter(t => t.status === 'completed').length;
                const phaseComplete = completedCount === phaseTasks.length;
                
                return (
                  <Card 
                    key={phase.id} 
                    className={`${phaseComplete ? 'border-emerald-200 dark:border-emerald-800' : 'border-slate-200 dark:border-slate-700'}`}
                    data-testid={`card-phase-${phaseIndex}`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${phaseComplete ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
                            {phaseComplete ? (
                              <CheckCircle className="h-5 w-5 text-white" />
                            ) : (
                              <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{phaseIndex + 1}</span>
                            )}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{phase.name}</CardTitle>
                            <CardDescription>
                              {completedCount}/{phaseTasks.length} tasks complete
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant={phaseComplete ? 'default' : 'outline'} className={phaseComplete ? 'bg-emerald-500' : ''}>
                          {phaseComplete ? 'Complete' : 'In Progress'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {phaseTasks.map((task) => {
                          const config = statusConfig[task.status];
                          const StatusIcon = config.icon;
                          
                          return (
                            <div 
                              key={task.id}
                              className={`flex items-center justify-between p-3 rounded-lg border ${
                                task.status === 'in_progress' 
                                  ? 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/10' 
                                  : 'border-slate-100 dark:border-slate-800'
                              }`}
                              data-testid={`task-${task.id}`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${config.color}`}>
                                  <StatusIcon className="h-4 w-4" />
                                </div>
                                <div>
                                  <div className="font-medium text-slate-900 dark:text-white">
                                    {task.title}
                                  </div>
                                  <div className="text-sm text-slate-500">
                                    {task.assignee} • {task.role}
                                    {task.isParallel && (
                                      <Badge variant="outline" className="ml-2 text-xs">Parallel</Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right text-sm">
                                  {task.actualMinutes ? (
                                    <span className="text-emerald-600">{task.actualMinutes}m</span>
                                  ) : (
                                    <span className="text-slate-400">~{task.estimatedMinutes}m</span>
                                  )}
                                </div>
                                {task.status === 'ready' && (
                                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" data-testid={`button-start-${task.id}`}>
                                    Start
                                  </Button>
                                )}
                                {task.status === 'in_progress' && (
                                  <Button size="sm" variant="outline" data-testid={`button-complete-${task.id}`}>
                                    Complete
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="roles">
            <Card>
              <CardContent className="p-6">
                <p className="text-slate-500 text-center py-8">
                  Role-based view coming soon - see tasks grouped by assignee
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="dependencies">
            <Card>
              <CardContent className="p-6">
                <p className="text-slate-500 text-center py-8">
                  Dependency graph coming soon - visualize task dependencies and critical path
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Key Insight Banner */}
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                  Industry Comparison
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Without M Platform, this coordinated response would take <span className="font-bold text-red-600">72 hours to decide + 2 weeks to execute</span>. 
                  With M Platform, you're on track to complete in <span className="font-bold text-emerald-600">~45 minutes total</span>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}
