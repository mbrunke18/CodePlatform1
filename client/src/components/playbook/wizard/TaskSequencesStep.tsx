import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Clock } from 'lucide-react';

interface TaskSequencesStepProps {
  data: any;
  onChange: (data: any) => void;
  playbook: any;
}

export default function TaskSequencesStep({ data, onChange }: TaskSequencesStepProps) {
  const [newTask, setNewTask] = useState({
    timeline: 'first_2_hours',
    taskName: '',
    assignedTo: '',
    duration: 30,
    dependencies: '',
  });

  const tasks = Array.isArray(data?.taskSequences) ? data.taskSequences : [];

  const addTask = () => {
    if (!newTask.taskName || !newTask.assignedTo) return;
    
    const updated = [...tasks, newTask];
    onChange({ ...data, taskSequences: updated });
    setNewTask({
      timeline: 'first_2_hours',
      taskName: '',
      assignedTo: '',
      duration: 30,
      dependencies: '',
    });
  };

  const removeTask = (index: number) => {
    const updated = [...tasks];
    updated.splice(index, 1);
    onChange({ ...data, taskSequences: updated });
  };

  const getTasksByTimeline = (timeline: string) => {
    return tasks.filter((t: any) => t.timeline === timeline);
  };

  const renderTimelineSection = (timeline: string, title: string) => {
    const timelineTasks = getTasksByTimeline(timeline);
    
    return (
      <Card className="p-4">
        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <Clock className="h-4 w-4" />
          {title} ({timelineTasks.length} tasks)
        </h4>
        <div className="space-y-2">
          {timelineTasks.map((task: any, index: number) => {
            const globalIndex = tasks.indexOf(task);
            return (
              <div
                key={globalIndex}
                className="flex items-start justify-between p-2 bg-muted/50 rounded"
                data-testid={`task-${timeline}-${index}`}
              >
                <div className="flex-1">
                  <div className="font-medium text-sm">{task.taskName}</div>
                  <div className="text-xs text-muted-foreground">
                    Assigned to: {task.assignedTo} • Duration: {task.duration} min
                  </div>
                  {task.dependencies && (
                    <div className="text-xs text-muted-foreground">Dependencies: {task.dependencies}</div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTask(globalIndex)}
                  data-testid={`button-remove-task-${globalIndex}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-sm mb-2">75% Pre-filled Template</h3>
        <p className="text-xs text-muted-foreground">
          Minute-by-minute timeline with pre-assigned task owners and dependencies
        </p>
      </div>

      {/* Add Task Form */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <h4 className="font-semibold text-sm mb-3">Add Task to Timeline</h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="task-timeline">Timeline Phase *</Label>
            <Select
              value={newTask.timeline}
              onValueChange={(value) => setNewTask({ ...newTask, timeline: value })}
            >
              <SelectTrigger id="task-timeline" data-testid="select-task-timeline">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="first_2_hours">First 2 Hours (Minute-by-Minute)</SelectItem>
                <SelectItem value="first_24_hours">First 24 Hours (Hour-by-Hour)</SelectItem>
                <SelectItem value="first_week">First Week (Day-by-Day)</SelectItem>
                <SelectItem value="first_month">First Month (Week-by-Week)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-name">Task Name *</Label>
            <Input
              id="task-name"
              value={newTask.taskName}
              onChange={(e) => setNewTask({ ...newTask, taskName: e.target.value })}
              placeholder="e.g., Notify Board Members"
              data-testid="input-task-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-assigned">Assigned To *</Label>
            <Input
              id="task-assigned"
              value={newTask.assignedTo}
              onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
              placeholder="Role or Person"
              data-testid="input-task-assigned"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-duration">Duration (minutes)</Label>
            <Input
              id="task-duration"
              type="number"
              value={newTask.duration}
              onChange={(e) => setNewTask({ ...newTask, duration: parseInt(e.target.value) || 30 })}
              placeholder="30"
              data-testid="input-task-duration"
            />
          </div>

          <div className="col-span-2 space-y-2">
            <Label htmlFor="task-dependencies">Dependencies</Label>
            <Input
              id="task-dependencies"
              value={newTask.dependencies}
              onChange={(e) => setNewTask({ ...newTask, dependencies: e.target.value })}
              placeholder="Tasks that must complete first"
              data-testid="input-task-dependencies"
            />
          </div>
        </div>

        <Button
          onClick={addTask}
          className="w-full mt-3"
          disabled={!newTask.taskName || !newTask.assignedTo}
          data-testid="button-add-task"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </Card>

      {/* Timeline Sections */}
      {renderTimelineSection('first_2_hours', 'First 2 Hours - Minute-by-Minute')}
      {renderTimelineSection('first_24_hours', 'First 24 Hours - Hour-by-Hour')}
      {renderTimelineSection('first_week', 'First Week - Day-by-Day')}
      {renderTimelineSection('first_month', 'First Month - Week-by-Week')}
    </div>
  );
}
