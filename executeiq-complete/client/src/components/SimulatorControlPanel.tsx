import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDynamicStrategySimulator } from '@/hooks/useDynamicStrategySimulator';
import { Play, Pause, Zap, Activity, Brain, TrendingUp, Target } from 'lucide-react';

export function SimulatorControlPanel() {
  const { isRunning, status, start, stop, launchScenario } = useDynamicStrategySimulator();

  const scenarios = [
    { id: 'ransomware', name: 'Ransomware Response', icon: '🔒' },
    { id: 'ma_integration', name: 'M&A Integration', icon: '🤝' },
    { id: 'supply_crisis', name: 'Supply Chain Crisis', icon: '⚠️' },
    { id: 'product_launch', name: 'Product Launch', icon: '🚀' }
  ];

  return (
    <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              Dynamic Strategy Simulator
            </CardTitle>
            <CardDescription>
              Real-time automation: weak signals, patterns, continuous operations
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {isRunning ? (
              <>
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </div>
                <Badge variant="default" className="bg-green-600">ACTIVE</Badge>
                <Button
                  onClick={stop}
                  variant="outline"
                  size="sm"
                  data-testid="btn-stop-simulator"
                >
                  <Pause className="h-4 w-4 mr-1" />
                  Stop
                </Button>
              </>
            ) : (
              <Button
                onClick={start}
                variant="default"
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
                data-testid="btn-start-simulator"
              >
                <Play className="h-4 w-4 mr-1" />
                Start Simulator
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="p-3 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-emerald-600" />
              <div className="text-xs text-muted-foreground">Readiness</div>
            </div>
            <div className="text-xl font-bold text-emerald-600">
              {status.readinessScore.toFixed(1)}%
            </div>
          </div>

          <div className="p-3 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4 text-amber-600" />
              <div className="text-xs text-muted-foreground">Weak Signals</div>
            </div>
            <div className="text-xl font-bold text-amber-600">
              {status.weakSignals}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-1">
              <Brain className="h-4 w-4 text-purple-600" />
              <div className="text-xs text-muted-foreground">Patterns</div>
            </div>
            <div className="text-xl font-bold text-purple-600">
              {status.oraclePatterns}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-blue-600" />
              <div className="text-xs text-muted-foreground">Scenarios</div>
            </div>
            <div className="text-xl font-bold text-blue-600">
              {status.activeScenarios}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <div className="text-xs text-muted-foreground">Continuous</div>
            </div>
            <div className="text-xl font-bold text-green-600">
              {status.continuousMode ? 'ON' : 'OFF'}
            </div>
          </div>
        </div>

        {isRunning && (
          <div>
            <div className="text-sm font-medium mb-3">Quick Launch Scenarios:</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {scenarios.map(scenario => (
                <Button
                  key={scenario.id}
                  onClick={() => launchScenario(scenario.id, scenario.name)}
                  variant="outline"
                  size="sm"
                  className="justify-start"
                  data-testid={`btn-launch-${scenario.id}`}
                >
                  <span className="mr-2">{scenario.icon}</span>
                  {scenario.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {isRunning && (
          <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-2">
              <Activity className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-xs text-blue-900 dark:text-blue-100">
                <strong>Automation Active:</strong> The system is now detecting weak signals every 5 seconds, 
                scanning for Oracle patterns every 30 seconds, and updating readiness metrics in real-time. 
                Activity feed is being populated automatically.
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
