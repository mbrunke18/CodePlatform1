import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';

interface PhaseProgressBarProps {
  prepareScore: number;
  monitorScore: number;
  executeScore: number;
  learnScore: number;
  currentPhase?: 'identify' | 'detect' | 'execute' | 'advance';
  compact?: boolean;
}

export function PhaseProgressBar({
  prepareScore,
  monitorScore,
  executeScore,
  learnScore,
  currentPhase,
  compact = false
}: PhaseProgressBarProps) {
  const phases = [
    { id: 'identify', name: 'Identify', tagline: 'Build Your Depth Chart', score: prepareScore, color: 'bg-blue-500', textColor: 'text-blue-500' },
    { id: 'detect', name: 'Detect', tagline: 'Monitor Signals', score: monitorScore, color: 'bg-amber-500', textColor: 'text-amber-500' },
    { id: 'execute', name: 'Execute', tagline: 'Execute Response', score: executeScore, color: 'bg-green-500', textColor: 'text-green-500' },
    { id: 'advance', name: 'Advance', tagline: 'Review the Film', score: learnScore, color: 'bg-purple-500', textColor: 'text-purple-500' },
  ];

  const overallScore = Math.round(
    (prepareScore * 0.4) + 
    (monitorScore * 0.2) + 
    (executeScore * 0.3) + 
    (learnScore * 0.1)
  );

  if (compact) {
    return (
      <div className="flex items-center gap-2" data-testid="phase-progress-compact">
        <Badge 
          variant={overallScore >= 80 ? 'default' : overallScore >= 50 ? 'secondary' : 'destructive'}
          className="text-xs"
          data-testid="readiness-badge"
        >
          {overallScore}% Ready
        </Badge>
        <div className="flex gap-1">
          {phases.map((phase) => (
            <div
              key={phase.id}
              className={`w-2 h-2 rounded-full ${
                phase.score === 100 
                  ? phase.color
                  : phase.score > 0 
                    ? 'bg-yellow-500' 
                    : 'bg-slate-600'
              }`}
              title={`${phase.name}: ${phase.score}%`}
              data-testid={`phase-dot-${phase.id}`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3" data-testid="phase-progress-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">IDEA Framework Progress</span>
      </div>
      
      <div className="space-y-2">
        {phases.map((phase) => (
          <div 
            key={phase.id}
            className={`p-2.5 rounded-lg transition-all ${
              currentPhase === phase.id 
                ? 'bg-slate-100 dark:bg-slate-800 ring-1 ring-slate-300 dark:ring-slate-600' 
                : 'bg-slate-50 dark:bg-slate-900/50'
            }`}
            data-testid={`phase-row-${phase.id}`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${phase.color}`} />
                <span className={`text-sm font-semibold ${phase.textColor}`}>{phase.name}</span>
                <span className="text-xs text-slate-400 italic hidden sm:inline">{phase.tagline}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{phase.score}%</span>
                {phase.score === 100 ? (
                  <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                ) : phase.score > 0 ? (
                  <Circle className="h-3.5 w-3.5 text-amber-500" />
                ) : (
                  <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                )}
              </div>
            </div>
            <Progress value={phase.score} className="h-1.5" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PhaseProgressBar;
