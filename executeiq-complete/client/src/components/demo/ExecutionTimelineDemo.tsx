import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Users, 
  Timer,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { DEMO_EXECUTION_PLANS } from '@/lib/demoData';

interface ExecutionTimelineDemoProps {
  planType?: 'competitive_response' | 'compliance_deadline';
  showHeader?: boolean;
}

export default function ExecutionTimelineDemo({ 
  planType = 'competitive_response',
  showHeader = true 
}: ExecutionTimelineDemoProps) {
  const plan = DEMO_EXECUTION_PLANS[planType];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    }
  };

  const getPhaseColor = (phaseName: string) => {
    if (phaseName.includes('IMMEDIATE')) return 'from-red-600 to-orange-600';
    if (phaseName.includes('SECONDARY')) return 'from-orange-600 to-yellow-600';
    if (phaseName.includes('FOLLOW')) return 'from-yellow-600 to-green-600';
    return 'from-blue-600 to-teal-600';
  };

  return (
    <div className="space-y-6" data-testid="execution-timeline-demo">
      
      {showHeader && (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">{plan.name}</h2>
              <p className="text-gray-400">{plan.description}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-green-400 mb-1">
                <Timer className="h-5 w-5" />
                <span className="text-3xl font-bold">{plan.targetExecutionTime} min</span>
              </div>
              <p className="text-sm text-gray-400">Target Execution Time</p>
            </div>
          </div>

          {/* Scenario & Trigger */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Scenario
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white text-sm">{plan.scenario}</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Trigger Condition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <code className="text-green-400 text-sm font-mono">{plan.trigger}</code>
              </CardContent>
            </Card>
          </div>

          {/* Stakeholders */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                <Users className="h-4 w-4" />
                {plan.stakeholders.length} Stakeholders Coordinated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {plan.stakeholders.map((stakeholder, idx) => (
                  <Badge 
                    key={idx} 
                    variant="outline" 
                    className="bg-blue-500/10 border-blue-500/30 text-blue-400"
                  >
                    {stakeholder.role}: {stakeholder.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          {plan.historicalPerformance && (
            <div className="bg-gradient-to-r from-green-950/50 to-emerald-950/50 rounded-lg p-4 border border-green-500/30">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-400">{plan.historicalPerformance.actualTime} min</div>
                  <div className="text-xs text-gray-400">Last Execution Time</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">{plan.historicalPerformance.successRate}%</div>
                  <div className="text-xs text-gray-400">Success Rate</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">{plan.historicalPerformance.totalExecutions}</div>
                  <div className="text-xs text-gray-400">Total Executions</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-green-400 flex items-center justify-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    {plan.historicalPerformance.outcome}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Execution Timeline - 3 Phases */}
      <div className="space-y-6">
        {Object.entries(plan.phases).map(([phaseKey, phase], phaseIdx) => (
          <Card key={phaseKey} className="bg-gray-800/50 border-gray-700 overflow-hidden">
            <div className={`bg-gradient-to-r ${getPhaseColor(phase.name)} p-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-bold">
                    {phaseIdx + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{phase.name}</h3>
                    <p className="text-white/80 text-sm">{phase.timeWindow}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">{phase.tasks.length} Tasks</div>
                  {'dependsOn' in phase && phase.dependsOn && (
                    <div className="text-white/70 text-xs flex items-center gap-1">
                      <ArrowRight className="h-3 w-3" />
                      Depends on {phase.dependsOn}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <CardContent className="p-6 space-y-4">
              {phase.tasks.map((task, taskIdx) => (
                <div 
                  key={taskIdx}
                  className="border-l-4 border-blue-500/50 pl-4 py-3 bg-gray-900/30 rounded-r-lg"
                  data-testid={`task-${phaseKey}-${taskIdx}`}
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-blue-400 text-sm font-bold">{task.sequence}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold mb-1 leading-tight">{task.title}</h4>
                        <p className="text-gray-400 text-sm mb-2">{task.description}</p>
                        
                        {/* Expected Outcome */}
                        <div className="flex items-start gap-2 text-green-400 text-sm">
                          <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span className="italic">{task.expectedOutcome}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="bg-purple-500/10 border-purple-500/30 text-purple-400">
                        {task.role}
                      </Badge>
                      <div className="flex items-center gap-1 text-gray-400">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs">{task.estimatedMinutes} min</span>
                      </div>
                    </div>
                  </div>

                  {/* Dependency Indicator */}
                  {'dependsOn' in task && task.dependsOn && (
                    <div className="flex items-center gap-2 text-orange-400 text-xs mt-2 pt-2 border-t border-gray-700">
                      <ArrowRight className="h-3 w-3" />
                      <span className="italic">Depends on: {task.dependsOn}</span>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Execution Summary */}
      <Card className="bg-gradient-to-r from-blue-950/50 to-teal-950/50 border-blue-500/30">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Timer className="h-5 w-5 text-blue-400" />
                Execution Summary
              </h3>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-400">{plan.targetExecutionTime} minutes</div>
                <div className="text-sm text-gray-400">Total Coordinated Response</div>
              </div>
            </div>
            
            <Progress value={100} className="h-2" />
            
            <div className="grid grid-cols-3 gap-4 text-center pt-2">
              <div>
                <div className="text-2xl font-bold text-white">
                  {Object.values(plan.phases).reduce((sum, phase) => sum + phase.tasks.length, 0)}
                </div>
                <div className="text-xs text-gray-400">Total Tasks</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{plan.stakeholders.length}</div>
                <div className="text-xs text-gray-400">Stakeholders</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">360x</div>
                <div className="text-xs text-gray-400">Faster than 72 hours</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}

function Zap({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
