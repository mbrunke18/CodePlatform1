import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Clock, Users, CheckCircle2, ArrowRight, GripVertical, X } from 'lucide-react';

type SubPhase = 'immediate' | 'coordinate' | 'resolve' | 'close';

interface ExecuteTask {
  id: string;
  subPhase: SubPhase;
  title: string;
  description?: string;
  assignedRole: string;
  estimatedDuration: number;
  dependencies: string[];
  isAutomated: boolean;
}

interface ExecuteTasksStepProps {
  data: any;
  onChange: (data: any) => void;
  playbook: any;
}

const SUB_PHASES = [
  { id: 'immediate' as const, label: 'Immediate', color: 'bg-red-500', description: 'First 0-5 minutes' },
  { id: 'coordinate' as const, label: 'Coordinate', color: 'bg-amber-500', description: '5-15 minutes' },
  { id: 'resolve' as const, label: 'Resolve', color: 'bg-blue-500', description: '15-60 minutes' },
  { id: 'close' as const, label: 'Close', color: 'bg-emerald-500', description: '60+ minutes' },
];

const ROLES = [
  'CISO', 'CTO', 'CEO', 'CFO', 'General Counsel', 'CCO', 'CHRO', 'COO',
  'VP Infrastructure', 'VP Engineering', 'Security Team', 'Legal Team',
  'Communications Team', 'HR Team', 'IT Operations', 'Customer Success'
];

const DEFAULT_TASKS: ExecuteTask[] = [
  { id: '1', subPhase: 'immediate', title: 'Isolate affected systems', assignedRole: 'Security Team', estimatedDuration: 5, dependencies: [], isAutomated: true },
  { id: '2', subPhase: 'immediate', title: 'Notify crisis leadership', assignedRole: 'CISO', estimatedDuration: 2, dependencies: [], isAutomated: true },
  { id: '3', subPhase: 'immediate', title: 'Activate incident response retainer', assignedRole: 'General Counsel', estimatedDuration: 5, dependencies: ['1'], isAutomated: false },
  { id: '4', subPhase: 'coordinate', title: 'Convene virtual war room', assignedRole: 'COO', estimatedDuration: 10, dependencies: ['2'], isAutomated: false },
  { id: '5', subPhase: 'coordinate', title: 'Draft initial stakeholder communication', assignedRole: 'CCO', estimatedDuration: 15, dependencies: ['2'], isAutomated: false },
  { id: '6', subPhase: 'coordinate', title: 'Review insurance policy', assignedRole: 'CFO', estimatedDuration: 10, dependencies: ['3'], isAutomated: false },
  { id: '7', subPhase: 'resolve', title: 'Execute containment procedures', assignedRole: 'Security Team', estimatedDuration: 30, dependencies: ['1', '4'], isAutomated: false },
  { id: '8', subPhase: 'resolve', title: 'Coordinate with law enforcement', assignedRole: 'General Counsel', estimatedDuration: 45, dependencies: ['4'], isAutomated: false },
  { id: '9', subPhase: 'close', title: 'Conduct post-incident review', assignedRole: 'CISO', estimatedDuration: 60, dependencies: ['7'], isAutomated: false },
  { id: '10', subPhase: 'close', title: 'Update playbook with learnings', assignedRole: 'COO', estimatedDuration: 30, dependencies: ['9'], isAutomated: false },
];

export default function ExecuteTasksStep({ data, onChange, playbook }: ExecuteTasksStepProps) {
  const [tasks, setTasks] = useState<ExecuteTask[]>(data.executeTasks || DEFAULT_TASKS);
  const [activeSubPhase, setActiveSubPhase] = useState<SubPhase>('immediate');
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState<Partial<ExecuteTask>>({
    subPhase: 'immediate',
    title: '',
    assignedRole: 'CISO',
    estimatedDuration: 15,
    dependencies: [],
    isAutomated: false,
  });

  const getTasksByPhase = (phase: SubPhase) => tasks.filter(t => t.subPhase === phase);

  const handleAddTask = () => {
    if (!newTask.title) return;
    const task: ExecuteTask = {
      id: Date.now().toString(),
      subPhase: activeSubPhase,
      title: newTask.title!,
      description: newTask.description,
      assignedRole: newTask.assignedRole || 'CISO',
      estimatedDuration: newTask.estimatedDuration || 15,
      dependencies: newTask.dependencies || [],
      isAutomated: newTask.isAutomated || false,
    };
    const updated = [...tasks, task];
    setTasks(updated);
    onChange({ executeTasks: updated });
    setNewTask({
      subPhase: activeSubPhase,
      title: '',
      assignedRole: 'CISO',
      estimatedDuration: 15,
      dependencies: [],
      isAutomated: false,
    });
    setShowAddTask(false);
  };

  const handleRemoveTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    onChange({ executeTasks: updated });
  };

  const getPhaseStats = (phase: SubPhase) => {
    const phaseTasks = getTasksByPhase(phase);
    const totalDuration = phaseTasks.reduce((sum, t) => sum + t.estimatedDuration, 0);
    const automatedCount = phaseTasks.filter(t => t.isAutomated).length;
    return { count: phaseTasks.length, duration: totalDuration, automated: automatedCount };
  };

  return (
    <div className="space-y-6">
      <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
        <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
          <span className="text-lg">⚡</span> EXECUTE Phase Configuration
        </h3>
        <p className="text-xs text-muted-foreground">
          Define tasks organized into sub-phases: IMMEDIATE (first 5 min), COORDINATE (5-15 min), 
          RESOLVE (15-60 min), and CLOSE (60+ min). Set dependencies between tasks for proper sequencing.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {SUB_PHASES.map((phase) => {
          const stats = getPhaseStats(phase.id);
          return (
            <Card 
              key={phase.id} 
              className={`cursor-pointer transition-all ${activeSubPhase === phase.id ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setActiveSubPhase(phase.id)}
            >
              <CardContent className="p-3 text-center">
                <div className={`w-2 h-2 rounded-full ${phase.color} mx-auto mb-2`} />
                <div className="text-xs font-medium">{phase.label}</div>
                <div className="text-[10px] text-muted-foreground">{phase.description}</div>
                <div className="text-lg font-bold mt-1">{stats.count}</div>
                <div className="text-[10px] text-muted-foreground">tasks · {stats.duration} min</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs value={activeSubPhase} onValueChange={(v) => setActiveSubPhase(v as SubPhase)}>
        <TabsList className="grid grid-cols-4 w-full">
          {SUB_PHASES.map((phase) => (
            <TabsTrigger key={phase.id} value={phase.id} className="text-xs">
              {phase.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {SUB_PHASES.map((phase) => (
          <TabsContent key={phase.id} value={phase.id} className="space-y-3 mt-4">
            {getTasksByPhase(phase.id).map((task, index) => (
              <div
                key={task.id}
                className="flex items-start gap-3 p-3 border rounded-lg bg-background"
                data-testid={`task-${task.id}`}
              >
                <div className="flex-shrink-0 pt-1 text-muted-foreground cursor-grab">
                  <GripVertical className="h-4 w-4" />
                </div>
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{task.title}</span>
                    {task.isAutomated && (
                      <Badge variant="secondary" className="text-[10px]">Auto</Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant="outline" className="text-xs gap-1">
                      <Users className="h-3 w-3" />
                      {task.assignedRole}
                    </Badge>
                    <Badge variant="outline" className="text-xs gap-1">
                      <Clock className="h-3 w-3" />
                      {task.estimatedDuration} min
                    </Badge>
                    {task.dependencies.length > 0 && (
                      <Badge variant="outline" className="text-xs gap-1">
                        <ArrowRight className="h-3 w-3" />
                        Depends on: {task.dependencies.join(', ')}
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => handleRemoveTask(task.id)}
                  data-testid={`button-remove-task-${task.id}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {showAddTask && activeSubPhase === phase.id ? (
              <Card className="border-dashed">
                <CardContent className="p-4 space-y-3">
                  <div>
                    <Label className="text-xs">Task Title</Label>
                    <Input
                      value={newTask.title || ''}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      placeholder="e.g., Notify board of directors"
                      data-testid="input-task-title"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Assigned Role</Label>
                      <Select
                        value={newTask.assignedRole}
                        onValueChange={(value) => setNewTask({ ...newTask, assignedRole: value })}
                      >
                        <SelectTrigger data-testid="select-assigned-role">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Estimated Duration (min)</Label>
                      <Input
                        type="number"
                        value={newTask.estimatedDuration || 15}
                        onChange={(e) => setNewTask({ ...newTask, estimatedDuration: parseInt(e.target.value) || 15 })}
                        data-testid="input-duration"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleAddTask} data-testid="button-add-task">
                      Add Task
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowAddTask(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Button
                variant="outline"
                className="w-full border-dashed"
                onClick={() => setShowAddTask(true)}
                data-testid="button-show-add-task"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Task to {phase.label}
              </Button>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
