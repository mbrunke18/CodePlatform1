import { useQuery } from '@tanstack/react-query';
import { Activity, AlertTriangle, Target, Zap } from 'lucide-react';

interface SystemStatus {
  readinessScore: number;
  activeScenarios: number;
  weakSignalsDetected: number;
  oraclePatternsActive: number;
  playbooksReady: number;
  systemStatus: 'operational' | 'degraded' | 'critical';
  lastUpdated: string;
}

export function CommandCenterStatusBar() {
  const { data: status, isLoading } = useQuery<SystemStatus>({
    queryKey: ['/api/dynamic-strategy/status'],
    refetchInterval: 30000,
  });

  if (isLoading || !status) {
    return null; // Hide status bar while loading to reduce clutter
  }

  const getStatusColor = () => {
    switch (status.systemStatus) {
      case 'operational':
        return 'text-emerald-400';
      case 'degraded':
        return 'text-yellow-400';
      case 'critical':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusText = () => {
    switch (status.systemStatus) {
      case 'operational':
        return 'All Systems Operational';
      case 'degraded':
        return 'Performance Degraded';
      case 'critical':
        return 'Critical Status';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="border-b border-slate-200 bg-slate-50">
      <div className="container mx-auto px-4 py-2.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className={`relative flex h-2 w-2 ${getStatusColor()}`}>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
              </div>
              <span className={`font-medium ${getStatusColor()}`}>
                {getStatusText()}
              </span>
            </div>

            <div className="h-4 w-px bg-border/40" />

            <div className="flex items-center gap-1.5 text-slate-700 transition-colors" data-testid="status-readiness-score">
              <Zap className="h-3.5 w-3.5 text-emerald-600" />
              <span className="font-medium text-emerald-600">{status.readinessScore}%</span>
              <span className="text-xs">Readiness</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-700 transition-colors" data-testid="status-active-scenarios">
              <Target className="h-3.5 w-3.5 text-blue-600" />
              <span className="font-medium text-blue-600">{status.activeScenarios}</span>
              <span className="text-xs">Active Scenarios</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-700 transition-colors" data-testid="status-weak-signals">
              <Activity className="h-3.5 w-3.5 text-amber-600" />
              <span className="font-medium text-amber-600">{status.weakSignalsDetected}</span>
              <span className="text-xs">Weak Signals</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-700 transition-colors" data-testid="status-oracle-patterns">
              <AlertTriangle className="h-3.5 w-3.5 text-purple-600" />
              <span className="font-medium text-purple-600">{status.oraclePatternsActive}</span>
              <span className="text-xs">Oracle Patterns</span>
            </div>
          </div>

          <div className="text-slate-500 text-xs">
            Last updated: {new Date(status.lastUpdated).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
}
