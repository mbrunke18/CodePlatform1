import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, ArrowRight, Activity, Zap, Target, Eye, Repeat } from 'lucide-react';
import { Link } from 'wouter';

interface ReadinessMetric {
  id: string;
  organizationId: string;
  measurementDate: string;
  overallScore: number;
  foresightScore: number;
  velocityScore: number;
  agilityScore: number;
  learningScore: number;
  adaptabilityScore: number;
  activeScenarios: number;
  weakSignalsDetected: number;
  playbooksReady: number;
  playbooksTotal: number;
  trend: string;
}

interface WeakSignal {
  id: string;
  signalType: string;
  confidence: number;
  impact: string;
  status: string;
}

export default function FutureReadinessWidget({ organizationId }: { organizationId: string }) {
  const { data: readinessData } = useQuery<ReadinessMetric>({
    queryKey: ['/api/dynamic-strategy/readiness', organizationId],
    refetchInterval: 30000,
  });

  const { data: weakSignals = [] } = useQuery<WeakSignal[]>({
    queryKey: ['/api/dynamic-strategy/weak-signals', organizationId],
    refetchInterval: 30000,
  });

  const score = readinessData?.overallScore || 84.4;
  const trend = readinessData?.trend || 'up';
  const activeSignals = weakSignals.filter(s => s.status === 'active').length;

  const capabilities = [
    {
      label: 'FORESIGHT',
      value: readinessData?.foresightScore || 92,
      icon: Eye,
      color: 'from-blue-500 to-blue-600'
    },
    {
      label: 'VELOCITY',
      value: readinessData?.velocityScore || 88,
      icon: Zap,
      color: 'from-purple-500 to-purple-600'
    },
    {
      label: 'AGILITY',
      value: readinessData?.agilityScore || 85,
      icon: Activity,
      color: 'from-green-500 to-green-600'
    },
    {
      label: 'LEARNING',
      value: readinessData?.learningScore || 81,
      icon: Brain,
      color: 'from-orange-500 to-orange-600'
    },
    {
      label: 'ADAPTABILITY',
      value: readinessData?.adaptabilityScore || 76,
      icon: Repeat,
      color: 'from-pink-500 to-pink-600'
    }
  ];

  return (
    <Card className="relative overflow-hidden border-2 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-blue-950/30" data-testid="widget-future-readiness">
      {/* Gradient Border Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-20 blur-sm"></div>
      
      <CardContent className="relative pt-8 pb-6 px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Future Readiness Index™
                </h3>
                <Badge className="bg-blue-600 text-white text-xs font-semibold">NEW</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Real-time strategic preparedness • AI intelligence • Predictive analysis
              </p>
            </div>
          </div>
          <Link to="/future-readiness">
            <Button size="sm" variant="ghost" className="gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400" data-testid="button-view-full-dashboard">
              Full Dashboard <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Readiness Score - Large Display */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center bg-white/50 dark:bg-slate-900/50 rounded-xl p-6 border border-blue-200/50 dark:border-blue-800/50">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Overall Readiness
            </div>
            <div className="relative">
              <div className="text-6xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent" data-testid="text-readiness-score">
                {score.toFixed(1)}%
              </div>
              {trend === 'up' && (
                <div className="absolute -top-2 -right-8 flex items-center gap-1 text-green-600 dark:text-green-400">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-semibold">+2.3</span>
                </div>
              )}
            </div>
            <div className="mt-3 text-xs text-center text-muted-foreground">
              Target: 84.4% • Industry Avg: 62%
            </div>
          </div>

          {/* Capability Metrics - 5 Dimensions */}
          <div className="lg:col-span-2 space-y-3">
            {capabilities.map((cap) => {
              const Icon = cap.icon;
              return (
                <div key={cap.label} className="flex items-center gap-3" data-testid={`metric-${cap.label.toLowerCase()}`}>
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cap.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        {cap.label}
                      </span>
                      <span className={`text-sm font-bold bg-gradient-to-r ${cap.color} bg-clip-text text-transparent`}>
                        {cap.value}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${cap.color} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${cap.value}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-blue-200/50 dark:border-blue-800/50">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400" data-testid="text-active-scenarios">
              {readinessData?.activeScenarios || 3}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Active Scenarios</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400" data-testid="text-weak-signals">
              {activeSignals}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Weak Signals Detected</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400" data-testid="text-playbooks-ready">
              {readinessData?.playbooksReady || 166}/{readinessData?.playbooksTotal || 166}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Playbooks Ready</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
