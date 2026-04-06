import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageLayout from '@/components/layout/PageLayout';
import ExecutionStageGuide from '@/components/ExecutionStageGuide';
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
    categoryColor: 'teal',
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
    categoryColor: 'navy',
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
    categoryColor: 'gold',
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
  pending: { color: 'bg-[#F8F7F4] text-[#6B7280]', icon: Circle, label: 'Pending' },
  blocked: { color: 'bg-[#DC2626]/10 text-[#DC2626]', icon: AlertCircle, label: 'Blocked' },
  ready: { color: 'bg-[#0A0F2E] text-white', icon: Play, label: 'Ready' },
  in_progress: { color: 'bg-[#C9A84C]/10 text-[#C9A84C]', icon: Pause, label: 'In Progress' },
  completed: { color: 'bg-[#2B8A6E]/10 text-[#2B8A6E]', icon: CheckCircle, label: 'Completed' },
  failed: { color: 'bg-[#DC2626]/10 text-[#DC2626]', icon: AlertCircle, label: 'Failed' },
};

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

export default function ExecutionCoordination() {
  const [, setLocation] = useLocation();
  const [selectedTask, setSelectedTask] = useState<ExecutionTask | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('offense');
  
  const sampleExecution = sampleExecutions[activeCategory];
  const completionPercent = Math.round((sampleExecution.completedTasks / sampleExecution.totalTasks) * 100);
  const elapsedMinutes = Math.round((Date.now() - new Date(sampleExecution.triggeredAt).getTime()) / 60000);
  
  const categoryStyles = {
    offense: { bg: 'bg-[#2B8A6E]/5', border: 'border-[#2B8A6E]/20', text: 'text-[#2B8A6E]', icon: 'bg-[#2B8A6E]' },
    defense: { bg: 'bg-[#0A0F2E]/5', border: 'border-[#0A0F2E]/20', text: 'text-[#0A0F2E]', icon: 'bg-[#0A0F2E]' },
    special_teams: { bg: 'bg-[#C9A84C]/5', border: 'border-[#C9A84C]/20', text: 'text-[#C9A84C]', icon: 'bg-[#C9A84C]' }
  };

  const currentStyle = categoryStyles[activeCategory];

  return (
    <PageLayout>
      <ExecutionStageGuide variant="compact" />
      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-[#0A0F2E]/10 rounded-lg flex items-center justify-center">
              <Zap className="h-6 w-6 text-[#C9A84C]" />
            </div>
            <div>
              <h1 style={CG} className="text-4xl font-bold text-[#0A0F2E]" data-testid="page-title">
                Execution Coordination
              </h1>
              <p className="text-[#6B7280] font-medium uppercase tracking-widest text-[10px]">
                Real-time coordinated response tracking
              </p>
            </div>
          </div>
        </div>
        
        {/* Strategic Triad Selector */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => setActiveCategory('offense')}
            className={`p-6 rounded-none border transition-all cursor-pointer text-left ${
              activeCategory === 'offense' 
                ? 'border-[#C9A84C] bg-white shadow-lg' 
                : 'border-[#E8E4DC] bg-white hover:border-[#C9A84C]/50'
            }`}
            data-testid="triad-offense"
          >
            <p className="text-[9px] uppercase tracking-[0.3em] text-[#2B8A6E] font-bold mb-2">OFFENSE</p>
            <p style={CG} className={`text-xl ${activeCategory === 'offense' ? 'text-[#0A0F2E] font-bold' : 'text-[#6B7280]'}`}>
              {activeCategory === 'offense' ? 'M&A Target Acquisition' : 'Seize Opportunities'}
            </p>
          </button>
          <button
            onClick={() => setActiveCategory('defense')}
            className={`p-6 rounded-none border transition-all cursor-pointer text-left ${
              activeCategory === 'defense' 
                ? 'border-[#C9A84C] bg-white shadow-lg' 
                : 'border-[#E8E4DC] bg-white hover:border-[#C9A84C]/50'
            }`}
            data-testid="triad-defense"
          >
            <p className="text-[9px] uppercase tracking-[0.3em] text-[#0A0F2E] font-bold mb-2">DEFENSE</p>
            <p style={CG} className={`text-xl ${activeCategory === 'defense' ? 'text-[#0A0F2E] font-bold' : 'text-[#6B7280]'}`}>
              {activeCategory === 'defense' ? 'Data Breach Response' : 'Protect Value'}
            </p>
          </button>
          <button
            onClick={() => setActiveCategory('special_teams')}
            className={`p-6 rounded-none border transition-all cursor-pointer text-left ${
              activeCategory === 'special_teams' 
                ? 'border-[#C9A84C] bg-white shadow-lg' 
                : 'border-[#E8E4DC] bg-white hover:border-[#C9A84C]/50'
            }`}
            data-testid="triad-special"
          >
            <p className="text-[9px] uppercase tracking-[0.3em] text-[#C9A84C] font-bold mb-2">SPECIAL TEAMS</p>
            <p style={CG} className={`text-xl ${activeCategory === 'special_teams' ? 'text-[#0A0F2E] font-bold' : 'text-[#6B7280]'}`}>
              {activeCategory === 'special_teams' ? 'AI Model Governance' : 'Drive Innovation'}
            </p>
          </button>
        </div>
        
        {/* Game Day Mindset Banner */}
        <Card className={`mb-8 bg-white border border-[#E8E4DC] rounded-none`} data-testid="game-day-banner">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className={`w-16 h-16 ${currentStyle.icon} rounded-none flex items-center justify-center flex-shrink-0`}>
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 style={CG} className="text-2xl font-bold text-[#0A0F2E] mb-1">
                    Game Day Execution
                  </h2>
                  <p className="text-[#6B7280] leading-relaxed max-w-xl">
                    You prepared all week. Now just execute—whether seizing an opportunity, defending against a threat, or driving innovation.
                  </p>
                </div>
              </div>
              <div className="text-center md:text-right border-l border-[#E8E4DC] pl-8">
                <p className="text-[9px] uppercase tracking-widest text-[#6B7280] mb-2 font-bold">The Mindset</p>
                <p style={CG} className={`text-2xl italic ${currentStyle.text}`}>
                  "Comfortable. Confident. Prepared."
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Active Execution Banner */}
        <Card className="mb-8 bg-[#0A0F2E] border-none rounded-none overflow-hidden relative">
          <div style={{ 
            position: "absolute", 
            inset: 0, 
            backgroundImage: "linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)", 
            backgroundSize: "32px 32px" 
          }} />
          <CardContent className="p-8 relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Badge className="bg-[#2B8A6E] text-white rounded-none border-none px-3 py-1 text-[10px] font-bold tracking-widest animate-pulse">LIVE</Badge>
                  <span style={CG} className="text-3xl font-bold text-white" data-testid="text-scenario">
                    {sampleExecution.scenario}
                  </span>
                </div>
                <p className="text-white/60 text-sm font-medium uppercase tracking-widest">
                  Triggered {elapsedMinutes} minutes ago • {sampleExecution.completedTasks}/{sampleExecution.totalTasks} tasks complete
                </p>
              </div>
              
              <div className="flex items-center gap-12">
                <div className="text-center">
                  <div style={CG} className="text-4xl font-bold text-[#C9A84C]" data-testid="text-completion">
                    {completionPercent}%
                  </div>
                  <div className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Complete</div>
                </div>
                <div className="text-center">
                  <div style={CG} className="text-4xl font-bold text-white" data-testid="text-elapsed">
                    {elapsedMinutes}m
                  </div>
                  <div className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Elapsed</div>
                </div>
                <div className="text-center">
                  <div style={CG} className="text-4xl font-bold text-[#DFC178]">
                    ~{Math.max(0, 45 - elapsedMinutes)}m
                  </div>
                  <div className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Remaining</div>
                </div>
              </div>
            </div>
            
            <Progress value={completionPercent} className="mt-8 h-1 bg-white/10 [&>div]:bg-[#C9A84C]" />
          </CardContent>
        </Card>
        
        {/* Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Completed', value: sampleExecution.completedTasks, color: '#2B8A6E', icon: CheckCircle, tid: 'metric-completed' },
            { label: 'In Progress', value: sampleExecution.phases.flatMap(p => p.tasks).filter(t => t.status === 'in_progress').length, color: '#C9A84C', icon: Play },
            { label: 'Stakeholders', value: 12, color: '#0A0F2E', icon: Users },
            { label: 'Target Time', value: '45m', color: '#0A0F2E', icon: Target }
          ].map((m, i) => (
            <Card key={i} className="bg-white border-[#E8E4DC] rounded-none shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-10 h-10 bg-[#F8F7F4] rounded-none flex items-center justify-center">
                  <m.icon style={{ color: m.color }} className="h-5 w-5" />
                </div>
                <div>
                  <div style={CG} className="text-2xl font-bold text-[#0A0F2E]" data-testid={m.tid}>
                    {m.value}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-[#6B7280] font-bold">{m.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Phase-based Task View */}
        <Tabs defaultValue="timeline" className="mb-8">
          <TabsList className="bg-transparent border-b border-[#E8E4DC] rounded-none h-auto p-0 gap-8 mb-8">
            {['timeline', 'roles', 'dependencies'].map((tab) => (
              <TabsTrigger 
                key={tab}
                value={tab} 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#C9A84C] data-[state=active]:text-[#0A0F2E] rounded-none px-0 py-4 text-[10px] font-bold tracking-[0.2em] uppercase text-[#6B7280]"
                data-testid={`tab-${tab}`}
              >
                {tab === 'timeline' ? 'Timeline View' : tab === 'roles' ? 'By Role' : 'Dependencies'}
              </TabsTrigger>
            ))}
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
                    className={`rounded-none bg-white shadow-sm transition-all ${phaseComplete ? 'border-[#2B8A6E]/30' : 'border-[#E8E4DC]'}`}
                    data-testid={`card-phase-${phaseIndex}`}
                  >
                    <CardHeader className="pb-4 border-b border-[#F8F7F4]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-none flex items-center justify-center ${phaseComplete ? 'bg-[#2B8A6E]' : 'bg-[#0A0F2E]'}`}>
                            {phaseComplete ? (
                              <CheckCircle className="h-5 w-5 text-white" />
                            ) : (
                              <span className="text-xs font-bold text-white">{phaseIndex + 1}</span>
                            )}
                          </div>
                          <div>
                            <CardTitle style={CG} className="text-xl font-bold text-[#0A0F2E]">{phase.name}</CardTitle>
                            <CardDescription className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">
                              {completedCount}/{phaseTasks.length} tasks complete
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant={phaseComplete ? 'default' : 'outline'} className={`rounded-none px-3 py-1 text-[9px] font-bold tracking-widest uppercase ${phaseComplete ? 'bg-[#2B8A6E] text-white border-none' : 'border-[#E8E4DC] text-[#6B7280]'}`}>
                          {phaseComplete ? 'Complete' : 'In Progress'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        {phaseTasks.map((task) => {
                          const config = statusConfig[task.status];
                          const StatusIcon = config.icon;
                          
                          return (
                            <div 
                              key={task.id}
                              className={`flex items-center justify-between p-4 rounded-none border transition-all ${
                                task.status === 'in_progress' 
                                  ? 'border-[#C9A84C]/30 bg-[#C9A84C]/5' 
                                  : 'border-[#F8F7F4] bg-white hover:border-[#E8E4DC]'
                              }`}
                              data-testid={`task-${task.id}`}
                            >
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-none flex items-center justify-center ${config.color}`}>
                                  <StatusIcon className="h-5 w-5" />
                                </div>
                                <div>
                                  <div className="font-bold text-[#0A0F2E]">
                                    {task.title}
                                  </div>
                                  <div className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280] mt-1">
                                    {task.assignee} • {task.role}
                                    {task.isParallel && (
                                      <span className="ml-3 text-[#C9A84C]">PARALLEL</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-6">
                                <div className="text-right">
                                  {task.actualMinutes ? (
                                    <span style={CG} className="text-xl font-bold text-[#2B8A6E]">{task.actualMinutes}m</span>
                                  ) : (
                                    <span style={CG} className="text-xl font-bold text-[#0A0F2E]">~{task.estimatedMinutes}m</span>
                                  )}
                                </div>
                                {task.status === 'ready' && (
                                  <Button className="bg-[#0A0F2E] text-white hover:bg-[#141B45] rounded-none px-6 font-bold text-[10px] tracking-widest uppercase" data-testid={`button-start-${task.id}`}>
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
            <Card className="rounded-none border-[#E8E4DC]">
              <CardContent className="p-6">
                <p className="text-[#6B7280] text-center py-8 italic font-medium">
                  Select a task owner above to filter the execution board by assignee
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="dependencies">
            <Card className="rounded-none border-[#E8E4DC]">
              <CardContent className="p-6">
                <p className="text-[#6B7280] text-center py-8 italic font-medium">
                  Activate a playbook to generate the dependency graph and visualize the critical execution path
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Industry Comparison Banner */}
        <Card className="bg-white border border-[#E8E4DC] rounded-none shadow-sm">
          <CardContent className="p-8">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-[#0A0F2E]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="h-6 w-6 text-[#C9A84C]" />
              </div>
              <div>
                <h3 style={CG} className="text-xl font-bold text-[#0A0F2E] mb-2">
                  Industry Comparison
                </h3>
                <p className="text-[#6B7280] leading-relaxed">
                  Without Execution OS, this coordinated response would take <span className="font-bold text-[#DC2626]">weeks to mobilize + months to fully execute</span>. 
                  With Execution OS, you're on track to complete in <span className="font-bold text-[#2B8A6E]">~45 minutes total</span>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
    </PageLayout>
  );
}
