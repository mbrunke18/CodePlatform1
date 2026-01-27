import { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';

interface ReadinessMetrics {
  overall: number;
  foresight: number;
  velocity: number;
  agility: number;
  learning: number;
  adaptability: number;
}

interface WeakSignal {
  id: string;
  title: string;
  source: string;
  confidence: number;
  category: string;
  timestamp: Date;
}

interface OraclePattern {
  id: string;
  name: string;
  accuracy: number;
  signals: number;
  trend: string;
}

interface ActiveScenario {
  id: string;
  name: string;
  progress: number;
  teamsInvolved: number;
  status: 'active' | 'completed' | 'pending';
}

interface ContinuousMode {
  enabled: boolean;
  tasksScheduled: number;
  nextRun: Date | null;
}

interface DynamicStrategyState {
  readiness: ReadinessMetrics;
  weakSignals: WeakSignal[];
  oraclePatterns: OraclePattern[];
  activeScenarios: ActiveScenario[];
  continuousMode: ContinuousMode;
  teamsCoordinating: number;
  percentOnTrack: number;
  isLoading: boolean;
}

const DynamicStrategyContext = createContext<DynamicStrategyState | null>(null);

export function DynamicStrategyProvider({ children }: { children: ReactNode }) {
  const { data: statusData, isLoading: statusLoading } = useQuery({
    queryKey: ['/api/dynamic-strategy/status'],
    refetchInterval: 5000,
  });

  const { data: readinessData, isLoading: readinessLoading } = useQuery({
    queryKey: ['/api/dynamic-strategy/readiness'],
    refetchInterval: 10000,
  });

  const { data: weakSignalsData, isLoading: signalsLoading } = useQuery({
    queryKey: ['/api/dynamic-strategy/weak-signals'],
    refetchInterval: 15000,
  });

  const { data: patternsData, isLoading: patternsLoading } = useQuery({
    queryKey: ['/api/dynamic-strategy/oracle-patterns'],
    refetchInterval: 30000,
  });

  const isLoading = statusLoading || readinessLoading || signalsLoading || patternsLoading;

  const status = statusData?.status || {
    activeScenarios: 0,
    weakSignals: 0,
    oraclePatterns: 0,
    continuousMode: { enabled: false, tasksScheduled: 0 },
    teamsCoordinating: 0,
    percentOnTrack: 0,
  };

  const readiness: ReadinessMetrics = readinessData?.readiness || {
    overall: 0,
    foresight: 0,
    velocity: 0,
    agility: 0,
    learning: 0,
    adaptability: 0,
  };

  const weakSignals: WeakSignal[] = (weakSignalsData?.signals || []).map((s: any) => ({
    id: s.id,
    title: s.title,
    source: s.source,
    confidence: s.confidence,
    category: s.category,
    timestamp: new Date(s.timestamp),
  }));

  const oraclePatterns: OraclePattern[] = (patternsData?.patterns || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    accuracy: p.accuracy,
    signals: p.signals_count,
    trend: p.trend,
  }));

  const activeScenarios: ActiveScenario[] = [
    {
      id: '1',
      name: 'Ransomware Response',
      progress: 65,
      teamsInvolved: 8,
      status: 'active',
    },
    {
      id: '2',
      name: 'M&A Integration',
      progress: 42,
      teamsInvolved: 12,
      status: 'active',
    },
    {
      id: '3',
      name: 'Supply Chain Disruption',
      progress: 88,
      teamsInvolved: 6,
      status: 'active',
    },
  ];

  const continuousMode: ContinuousMode = {
    enabled: status.continuousMode.enabled,
    tasksScheduled: status.continuousMode.tasksScheduled,
    nextRun: status.continuousMode.nextRun ? new Date(status.continuousMode.nextRun) : null,
  };

  const state: DynamicStrategyState = {
    readiness,
    weakSignals,
    oraclePatterns,
    activeScenarios,
    continuousMode,
    teamsCoordinating: status.teamsCoordinating || activeScenarios.reduce((sum, s) => sum + s.teamsInvolved, 0),
    percentOnTrack: status.percentOnTrack || Math.round(activeScenarios.reduce((sum, s) => sum + s.progress, 0) / activeScenarios.length),
    isLoading,
  };

  return (
    <DynamicStrategyContext.Provider value={state}>
      {children}
    </DynamicStrategyContext.Provider>
  );
}

export function useDynamicStrategy() {
  const context = useContext(DynamicStrategyContext);
  if (!context) {
    throw new Error('useDynamicStrategy must be used within DynamicStrategyProvider');
  }
  return context;
}
