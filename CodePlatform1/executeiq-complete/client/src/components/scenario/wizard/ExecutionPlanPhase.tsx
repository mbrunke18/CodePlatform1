import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Clock, Plus, Trash2, Target, Zap, Timer, AlertCircle, CheckCircle2, ArrowRight, Link2 } from 'lucide-react';

interface ExecutionPlanPhaseProps {
  data: any;
  onChange: (updates: any) => void;
}

const EXECUTION_PHASES = [
  {
    id: 'immediate',
    name: 'IMMEDIATE Phase',
    description: 'Critical decisions and approvals (0-2 minutes)',
    startMin: 0,
    endMin: 2,
    color: 'red',
    icon: Zap,
  },
  {
    id: 'secondary',
    name: 'SECONDARY Phase',
    description: 'Resource deployment and activation (2-5 minutes)',
    startMin: 2,
    endMin: 5,
    color: 'orange',
    icon: Target,
  },
  {
    id: 'follow_up',
    name: 'FOLLOW-UP Phase',
    description: 'Stakeholder coordination and communication (5-12 minutes)',
    startMin: 5,
    endMin: 12,
    color: 'blue',
    icon: CheckCircle2,
  },
];

const PRIORITY_LEVELS = [
  { value: 'critical', label: 'Critical', color: 'bg-red-600/20 text-red-300 border-red-500/50' },
  { value: 'high', label: 'High', color: 'bg-orange-600/20 text-orange-300 border-orange-500/50' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-600/20 text-yellow-300 border-yellow-500/50' },
  { value: 'low', label: 'Low', color: 'bg-blue-600/20 text-blue-300 border-blue-500/50' },
];

export default function ExecutionPlanPhase({ data, onChange }: ExecutionPlanPhaseProps) {
  const [selectedPhase, setSelectedPhase] = useState<string>('immediate');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedRole: '',
    estimatedMinutes: 2,
    priority: 'high' as const,
  });

  const executionPlan = data.executionPlan || {
    immediate: [],
    secondary: [],
    follow_up: [],
  };

  const stakeholders = data.stakeholders || [];
  const availableRoles = stakeholders.map((s: any) => s.title);

  const addTask = () => {
    if (newTask.title && newTask.assignedRole) {
      const updatedPlan = {
        ...executionPlan,
        [selectedPhase]: [
          ...(executionPlan[selectedPhase] || []),
          {
            ...newTask,
            id: Date.now(),
            sequence: (executionPlan[selectedPhase]?.length || 0) + 1,
          },
        ],
      };
      onChange({ executionPlan: updatedPlan });
      setNewTask({
        title: '',
        description: '',
        assignedRole: '',
        estimatedMinutes: 2,
        priority: 'high',
      });
    }
  };

  const removeTask = (phaseId: string, taskId: number) => {
    const updatedPlan = {
      ...executionPlan,
      [phaseId]: (executionPlan[phaseId] || []).filter((t: any) => t.id !== taskId),
    };
    onChange({ executionPlan: updatedPlan });
  };

  const getTotalTasks = () => {
    return (
      (executionPlan.immediate?.length || 0) +
      (executionPlan.secondary?.length || 0) +
      (executionPlan.follow_up?.length || 0)
    );
  };

  const getTotalTime = () => {
    let total = 0;
    Object.values(executionPlan).forEach((tasks: any) => {
      tasks?.forEach((task: any) => {
        total += task.estimatedMinutes || 0;
      });
    });
    return total;
  };

  const getPhaseColorClass = (color: string) => {
    const colors: Record<string, string> = {
      red: 'border-red-500/50 bg-red-950/20',
      orange: 'border-orange-500/50 bg-orange-950/20',
      blue: 'border-blue-500/50 bg-blue-950/20',
    };
    return colors[color] || colors.blue;
  };

  const getPriorityClass = (priority: string) => {
    return PRIORITY_LEVELS.find(p => p.value === priority)?.color || PRIORITY_LEVELS[1].color;
  };

  return (
    <div className="space-y-6">
      {/* Execution Plan Overview */}
      <Card className="border-purple-500/30 bg-purple-950/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Timer className="h-5 w-5 text-purple-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-purple-300 font-medium">12-Minute Execution Plan</p>
              <p className="text-xs text-gray-400 mt-1">
                Build your Work Breakdown Structure (WBS): define WHO does WHAT, WHEN, with clear dependencies.
                Tasks unfold in coordinated phases for championship execution.
              </p>
              <div className="flex gap-4 mt-3">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-purple-400" />
                  <span className="text-xs text-gray-300">{getTotalTasks()} Tasks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-400" />
                  <span className="text-xs text-gray-300">{getTotalTime()} min estimated</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phase Selection and Task Builder */}
      <div className="grid lg:grid-cols-3 gap-4">
        {EXECUTION_PHASES.map((phase) => (
          <Card
            key={phase.id}
            className={`cursor-pointer transition-all ${
              selectedPhase === phase.id
                ? getPhaseColorClass(phase.color) + ' ring-2 ring-offset-2 ring-offset-slate-950'
                : 'border-slate-700/50 bg-slate-900/30 opacity-60 hover:opacity-100'
            }`}
            onClick={() => setSelectedPhase(phase.id)}
            data-testid={`phase-card-${phase.id}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <phase.icon className={`h-5 w-5 mt-0.5 ${
                  selectedPhase === phase.id ? `text-${phase.color}-400` : 'text-gray-500'
                }`} />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-white">{phase.name}</h3>
                  <p className="text-xs text-gray-400 mt-1">{phase.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {executionPlan[phase.id]?.length || 0} tasks
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {phase.startMin}-{phase.endMin} min
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Task Builder for Selected Phase */}
      {stakeholders.length === 0 ? (
        <Card className="border-yellow-500/30 bg-yellow-950/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-300 font-medium">Add Stakeholders First</p>
                <p className="text-xs text-gray-400 mt-1">
                  Go back to the Stakeholders phase to define roles before building your execution plan.
                  Each task needs to be assigned to a specific role.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-blue-500/30 bg-slate-900/50">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <Plus className="h-5 w-5 text-blue-400" />
              Add Task to {EXECUTION_PHASES.find(p => p.id === selectedPhase)?.name}
            </h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="task-title" className="text-white">Task Title *</Label>
                <Input
                  id="task-title"
                  data-testid="input-task-title"
                  placeholder="e.g., CFO validates budget impact ($2M approved?)"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="bg-slate-800 border-slate-600 text-white mt-2"
                />
              </div>

              <div>
                <Label htmlFor="task-description" className="text-white">Description</Label>
                <Textarea
                  id="task-description"
                  data-testid="input-task-description"
                  placeholder="Detailed task instructions, expected output, success criteria..."
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="bg-slate-800 border-slate-600 text-white mt-2 min-h-[80px]"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="task-role" className="text-white">Assigned Role *</Label>
                  <Select
                    value={newTask.assignedRole}
                    onValueChange={(value) => setNewTask({ ...newTask, assignedRole: value })}
                  >
                    <SelectTrigger id="task-role" data-testid="select-task-role" className="bg-slate-800 border-slate-600 text-white mt-2">
                      <SelectValue placeholder="Select role..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRoles.map((role: string) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="task-minutes" className="text-white">Est. Minutes</Label>
                  <Input
                    id="task-minutes"
                    data-testid="input-task-minutes"
                    type="number"
                    min="1"
                    max="12"
                    value={newTask.estimatedMinutes}
                    onChange={(e) => setNewTask({ ...newTask, estimatedMinutes: parseInt(e.target.value) || 2 })}
                    className="bg-slate-800 border-slate-600 text-white mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="task-priority" className="text-white">Priority</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value: any) => setNewTask({ ...newTask, priority: value })}
                  >
                    <SelectTrigger id="task-priority" data-testid="select-task-priority" className="bg-slate-800 border-slate-600 text-white mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITY_LEVELS.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          {priority.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={addTask}
                disabled={!newTask.title || !newTask.assignedRole}
                className="w-full bg-blue-600 hover:bg-blue-700"
                data-testid="button-add-task"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Task to {EXECUTION_PHASES.find(p => p.id === selectedPhase)?.name}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Execution Timeline View */}
      <Card className="border-slate-700/50 bg-slate-900/30">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <ArrowRight className="h-5 w-5 text-gray-400" />
            Execution Timeline
          </h3>

          <Accordion type="single" collapsible className="space-y-2" defaultValue="immediate">
            {EXECUTION_PHASES.map((phase) => {
              const phaseTasks = executionPlan[phase.id] || [];
              return (
                <AccordionItem
                  key={phase.id}
                  value={phase.id}
                  className={`border rounded-lg ${getPhaseColorClass(phase.color)}`}
                >
                  <AccordionTrigger
                    className="px-4 hover:no-underline"
                    data-testid={`accordion-phase-${phase.id}`}
                  >
                    <div className="flex items-center gap-3 flex-1 text-left">
                      <phase.icon className={`h-5 w-5 text-${phase.color}-400`} />
                      <div className="flex-1">
                        <div className="font-semibold text-white">{phase.name}</div>
                        <div className="text-xs text-gray-400">{phase.startMin}-{phase.endMin} minutes</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {phaseTasks.length} {phaseTasks.length === 1 ? 'task' : 'tasks'}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    {phaseTasks.length === 0 ? (
                      <p className="text-sm text-gray-500 italic py-2">No tasks added to this phase yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {phaseTasks.map((task: any, index: number) => (
                          <div
                            key={task.id}
                            className="p-3 rounded border border-slate-700/50 bg-slate-900/50 hover:bg-slate-800/50 transition-colors"
                            data-testid={`task-${phase.id}-${index}`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-mono text-gray-500">#{task.sequence}</span>
                                  <h4 className="text-sm font-semibold text-white">{task.title}</h4>
                                  <Badge className={`text-xs ${getPriorityClass(task.priority)}`}>
                                    {task.priority}
                                  </Badge>
                                </div>
                                {task.description && (
                                  <p className="text-xs text-gray-400 mt-1">{task.description}</p>
                                )}
                                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Target className="h-3 w-3" />
                                    {task.assignedRole}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    ~{task.estimatedMinutes} min
                                  </span>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeTask(phase.id, task.id)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-950/30"
                                data-testid={`button-delete-task-${task.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>

      {/* Execution Plan Summary */}
      {getTotalTasks() > 0 && (
        <Card className="border-green-500/30 bg-green-950/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5" />
              <div>
                <p className="text-sm text-green-300 font-medium">Execution Plan Ready</p>
                <p className="text-xs text-gray-400 mt-1">
                  {getTotalTasks()} coordinated tasks across 3 phases · Estimated execution time: {getTotalTime()} minutes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
