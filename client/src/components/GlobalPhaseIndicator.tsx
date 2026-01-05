import { Target, Radio, Zap, BookOpen } from 'lucide-react';
import { useLocation } from 'wouter';

interface PhaseIndicatorProps {
  scores?: {
    identify: number;
    detect: number;
    execute: number;
    advance: number;
  };
  compact?: boolean;
}

export default function GlobalPhaseIndicator({ 
  scores = { identify: 0, detect: 0, execute: 0, advance: 0 },
  compact = false 
}: PhaseIndicatorProps) {
  const [, setLocation] = useLocation();
  
  const phases = [
    { 
      id: 'identify', 
      label: 'IDENTIFY', 
      icon: Target, 
      color: 'text-violet-400', 
      bgColor: 'bg-violet-500',
      score: scores.identify,
      path: '/playbook-library'
    },
    { 
      id: 'detect', 
      label: 'DETECT', 
      icon: Radio, 
      color: 'text-blue-400', 
      bgColor: 'bg-blue-500',
      score: scores.detect,
      path: '/foresight-radar'
    },
    { 
      id: 'execute', 
      label: 'EXECUTE', 
      icon: Zap, 
      color: 'text-emerald-400', 
      bgColor: 'bg-emerald-500',
      score: scores.execute,
      path: '/command-center'
    },
    { 
      id: 'advance', 
      label: 'ADVANCE', 
      icon: BookOpen, 
      color: 'text-amber-400', 
      bgColor: 'bg-amber-500',
      score: scores.advance,
      path: '/executive-dashboard'
    },
  ];

  if (compact) {
    return (
      <div className="flex items-center gap-1 text-xs" data-testid="phase-indicator-compact">
        {phases.map((phase, index) => {
          const Icon = phase.icon;
          return (
            <div key={phase.id} className="flex items-center">
              <button
                onClick={() => setLocation(phase.path)}
                className={`flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-800 transition-colors ${phase.color}`}
                title={`${phase.label}: ${phase.score}%`}
                data-testid={`phase-compact-${phase.id}`}
              >
                <Icon className="h-3 w-3" />
                <span className="hidden sm:inline">{phase.score}%</span>
              </button>
              {index < phases.length - 1 && (
                <span className="text-slate-600 mx-1">→</span>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4" data-testid="phase-indicator-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-400">IDEA Framework Readiness</span>
        <span className="text-sm text-slate-500">
          Overall: {Math.round((scores.identify + scores.detect + scores.execute + scores.advance) / 4)}%
        </span>
      </div>
      <div className="flex items-center gap-2">
        {phases.map((phase, index) => {
          const Icon = phase.icon;
          return (
            <div key={phase.id} className="flex items-center flex-1">
              <button
                onClick={() => setLocation(phase.path)}
                className="flex-1 group"
                data-testid={`phase-full-${phase.id}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`h-4 w-4 ${phase.color}`} />
                  <span className={`text-xs font-medium ${phase.color}`}>{phase.label}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${phase.bgColor} transition-all`}
                    style={{ width: `${phase.score}%` }}
                  />
                </div>
                <div className="text-xs text-slate-500 mt-1">{phase.score}%</div>
              </button>
              {index < phases.length - 1 && (
                <div className="text-slate-700 mx-2">→</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
