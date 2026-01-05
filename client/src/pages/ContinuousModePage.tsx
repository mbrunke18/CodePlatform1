import StandardNav from '@/components/layout/StandardNav';
import { useDynamicStrategy } from '@/contexts/DynamicStrategyContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, Clock, Calendar, CheckCircle, AlertCircle, PlayCircle, Pause } from 'lucide-react';

const scheduledTasks = [
  {
    id: 1,
    name: 'Weak Signal Sweep',
    schedule: 'Every 15 minutes',
    lastRun: '3 minutes ago',
    nextRun: '12 minutes',
    status: 'active',
    executions: 1247,
  },
  {
    id: 2,
    name: 'Oracle Pattern Analysis',
    schedule: 'Every 30 minutes',
    lastRun: '8 minutes ago',
    nextRun: '22 minutes',
    status: 'active',
    executions: 623,
  },
  {
    id: 3,
    name: 'Readiness Index Calculation',
    schedule: 'Daily at 6:00 AM',
    lastRun: '18 hours ago',
    nextRun: 'Tomorrow at 6:00 AM',
    status: 'active',
    executions: 342,
  },
  {
    id: 4,
    name: 'Playbook Learning Extraction',
    schedule: 'After each activation',
    lastRun: '2 days ago',
    nextRun: 'On demand',
    status: 'active',
    executions: 89,
  },
  {
    id: 5,
    name: 'Compliance Check',
    schedule: 'Weekly on Monday',
    lastRun: '3 days ago',
    nextRun: 'Monday at 9:00 AM',
    status: 'active',
    executions: 52,
  },
];

const recentExecutions = [
  { task: 'Weak Signal Sweep', time: '3 min ago', status: 'success', findings: '2 new signals' },
  { task: 'Oracle Pattern Analysis', time: '8 min ago', status: 'success', findings: '1 pattern detected' },
  { task: 'Weak Signal Sweep', time: '18 min ago', status: 'success', findings: '0 new signals' },
  { task: 'Weak Signal Sweep', time: '33 min ago', status: 'success', findings: '1 new signal' },
  { task: 'Readiness Index Calculation', time: '18 hrs ago', status: 'success', findings: 'Score: 84.4%' },
];

export default function ContinuousModePage() {
  const { continuousMode } = useDynamicStrategy();

  return (
    <div className="page-background min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
              <Activity className="w-10 h-10 text-blue-600" />
              Continuous Operations Mode
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Always-on strategic monitoring, learning, and automated coordination
            </p>
          </div>
          <Button 
            size="lg"
            variant={continuousMode.enabled ? "destructive" : "default"}
            data-testid="button-toggle-continuous"
          >
            {continuousMode.enabled ? (
              <>
                <Pause className="w-5 h-5 mr-2" />
                Pause Operations
              </>
            ) : (
              <>
                <PlayCircle className="w-5 h-5 mr-2" />
                Activate Continuous Mode
              </>
            )}
          </Button>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className={continuousMode.enabled ? 
            "border-2 border-green-500 dark:border-green-700" : 
            "border-2 border-slate-300 dark:border-slate-700"
          }>
            <CardHeader>
              <CardDescription>System Status</CardDescription>
              <CardTitle className={`text-3xl ${continuousMode.enabled ? "text-green-600" : "text-slate-400"}`}>
                {continuousMode.enabled ? "ACTIVE" : "PAUSED"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {continuousMode.enabled && (
                <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Monitoring in progress</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Tasks Scheduled</CardDescription>
              <CardTitle className="text-3xl text-blue-600">{continuousMode.tasksScheduled}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Automated operations running
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Next Scheduled Run</CardDescription>
              <CardTitle className="text-3xl text-violet-600">
                {continuousMode.nextRun ? new Date(continuousMode.nextRun).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {continuousMode.nextRun ? 'Weak Signal Sweep' : 'No tasks scheduled'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Scheduled Tasks */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Scheduled Automation Tasks</h2>
          <div className="space-y-3">
            {scheduledTasks.map((task) => (
              <Card key={task.id} data-testid={`card-task-${task.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                        <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 page-background">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                          {task.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{task.schedule}</span>
                          </div>
                          <span>•</span>
                          <span>{task.executions} executions</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-xs text-slate-500 dark:text-slate-500 mb-1">Last run</div>
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {task.lastRun}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-500 dark:text-slate-500 mb-1">Next run</div>
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {task.nextRun}
                        </div>
                      </div>
                      <Badge variant={task.status === 'active' ? 'default' : 'secondary'}>
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Execution Log */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Recent Executions</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-3">
                {recentExecutions.map((execution, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                    data-testid={`execution-log-${index}`}
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">
                          {execution.task}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {execution.findings}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-500">
                      {execution.time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Capabilities Overview */}
        <Card className="bg-gradient-to-r from-blue-600 to-violet-600 text-white border-0">
          <CardHeader>
            <CardTitle className="text-2xl">Continuous Mode Capabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Always-On Monitoring
                </h4>
                <p className="text-sm text-blue-100">
                  24/7 scanning of intelligence signals for threats and opportunities
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Automated Learning
                </h4>
                <p className="text-sm text-blue-100">
                  Self-improving playbooks after every execution
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Scheduled Operations
                </h4>
                <p className="text-sm text-blue-100">
                  Automated tasks run on smart schedules optimized for your org
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
