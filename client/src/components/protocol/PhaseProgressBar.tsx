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
    { id: 'identify', name: 'Identify', tagline: 'Build Your Depth Chart', score: prepareScore, color: 'bg-[#0A0F2E]', textColor: 'text-[#0A0F2E]' },
    { id: 'detect', name: 'Detect', tagline: 'Monitor Signals', score: monitorScore, color: 'bg-[#C9A84C]', textColor: 'text-[#C9A84C]' },
    { id: 'execute', name: 'Execute', tagline: 'Execute Response', score: executeScore, color: 'bg-[#C9A84C]', textColor: 'text-[#C9A84C]' },
    { id: 'advance', name: 'Advance', tagline: 'Review the Film', score: learnScore, color: 'bg-[#2B8A6E]', textColor: 'text-[#2B8A6E]' },
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
              className={`w-2 h-2 ${
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
        <span className="text-sm font-medium text-gray-800 dark:text-slate-300">IDEA Framework Progress</span>
      </div>
      
      <div className="space-y-2">
        {phases.map((phase) => (
          <div 
            key={phase.id}
            className={`p-2.5 transition-all ${
              currentPhase === phase.id 
                ? 'bg-slate-100 dark:bg-slate-800 ring-1 ring-slate-300 dark:ring-slate-600' 
                : 'bg-slate-50 dark:bg-slate-900/50'
            }`}
            data-testid={`phase-row-${phase.id}`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 ${phase.color}`} />
                <span className={`text-sm font-semibold ${phase.textColor}`}>{phase.name}</span>
                <span className="text-xs text-gray-800 dark:text-slate-200 italic hidden sm:inline">{phase.tagline}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-800 dark:text-slate-300">{phase.score}%</span>
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
