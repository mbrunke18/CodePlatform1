import { useQuery, useMutation } from "@tanstack/react-query";
import { api, type Task } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function TaskPanel() {
  const { toast } = useToast();
  
  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks/priority"],
    queryFn: () => api.getPriorityTasks(),
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, completed }: { taskId: string; completed: boolean }) =>
      api.updateTaskStatus(taskId, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks/priority"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    },
  });

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDueStatus = (dueDate?: string, completed?: string) => {
    if (completed) return 'Completed';
    if (!dueDate) return '';
    
    const due = new Date(dueDate);
    const now = new Date();
    const diffInDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 0) return 'Overdue';
    if (diffInDays === 0) return 'Due today';
    if (diffInDays === 1) return 'Due tomorrow';
    return `Due in ${diffInDays} days`;
  };

  const handleTaskToggle = (taskId: string, completed: boolean) => {
    updateTaskMutation.mutate({ taskId, completed });
  };

  return (
    <Card>
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Priority Tasks</h3>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-primary hover:text-primary/80"
            data-testid="button-view-all-tasks"
          >
            View All
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center space-x-3 p-3 rounded-lg border border-border">
                <div className="w-4 h-4 bg-muted rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : tasks?.length === 0 ? (
          <div className="text-center py-8">
            <i className="fas fa-tasks text-muted-foreground text-3xl mb-4"></i>
            <p className="text-muted-foreground">No priority tasks</p>
          </div>
        ) : (
          tasks?.map((task, index) => (
            <div 
              key={task.id} 
              className="flex items-center space-x-3 p-3 rounded-lg border border-border"
              data-testid={`task-${index}`}
            >
              <Checkbox
                checked={task.status === 'Completed'}
                onCheckedChange={(checked) => handleTaskToggle(task.id, !!checked)}
                disabled={updateTaskMutation.isPending}
                data-testid={`checkbox-task-${index}`}
              />
              <div className="flex-1 min-w-0">
                <p 
                  className={`text-sm font-medium ${task.status === 'Completed' ? 'text-muted-foreground line-through' : 'text-foreground'}`}
                  data-testid={`text-task-description-${index}`}
                >
                  {task.description}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    task.status === 'Completed' 
                      ? 'bg-green-100 text-green-800' 
                      : getPriorityColor(task.priority)
                  }`}>
                    {task.status === 'Completed' ? 'Completed' : task.priority}
                  </span>
                  <span className="text-xs text-muted-foreground" data-testid={`text-task-due-${index}`}>
                    {getDueStatus(task.dueDate, task.completed)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
        
        <Button 
          variant="secondary" 
          className="w-full mt-4"
          data-testid="button-add-task"
        >
          <i className="fas fa-plus w-4 mr-2"></i>
          Add New Task
        </Button>
      </CardContent>
    </Card>
  );
}
