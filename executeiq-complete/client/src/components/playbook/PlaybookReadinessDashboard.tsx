import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Shield, Target, Radar, Zap, BookOpen, 
  TrendingUp, AlertTriangle, CheckCircle2, Clock,
  Users, FileText, DollarSign, Bell, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlaybookReadinessDashboardProps {
  playbookId: string;
  organizationId: string;
  compact?: boolean;
}

const PHASE_CONFIG = {
  identify: { name: 'IDENTIFY', icon: Target, color: 'violet', description: 'Pre-execution readiness' },
  detect: { name: 'DETECT', icon: Radar, color: 'blue', description: 'Trigger monitoring' },
  execute: { name: 'EXECUTE', icon: Zap, color: 'emerald', description: 'Execution capability' },
  advance: { name: 'ADVANCE', icon: BookOpen, color: 'amber', description: 'Learning infrastructure' },
};

function PhaseScoreCard({ 
  phase, 
  score, 
  items 
}: { 
  phase: keyof typeof PHASE_CONFIG; 
  score: number; 
  items?: { completed?: number; total?: number; active?: number; configured?: number } 
}) {
  const config = PHASE_CONFIG[phase];
  const Icon = config.icon;
  
  const getStatusBadge = () => {
    if (score >= 80) return <Badge variant="default" className="bg-green-600 text-xs">Ready</Badge>;
    if (score >= 50) return <Badge variant="secondary" className="text-xs">Partial</Badge>;
    return <Badge variant="outline" className="text-xs text-amber-600 border-amber-600">Setup Needed</Badge>;
  };

  const getItemStatus = () => {
    if (phase === 'identify' && items) {
      return `${items.completed ?? 0}/${items.total ?? 0} items`;
    }
    if (phase === 'detect' && items) {
      return `${items.active ?? 0}/${items.total ?? 0} active`;
    }
    if (phase === 'advance' && items) {
      return `${items.configured ?? 0} configured`;
    }
    return null;
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg bg-${config.color}-100 dark:bg-${config.color}-900/30`}>
              <Icon className={`w-4 h-4 text-${config.color}-600 dark:text-${config.color}-400`} />
            </div>
            <div>
              <div className="font-semibold text-sm">{config.name}</div>
              <div className="text-xs text-muted-foreground">{config.description}</div>
            </div>
          </div>
          {getStatusBadge()}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold">{score}%</span>
            {getItemStatus() && (
              <span className="text-xs text-muted-foreground">{getItemStatus()}</span>
            )}
          </div>
          <Progress value={score} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}

function ReadinessMetricCard({ icon: Icon, label, value, subtext }: { icon: any; label: string; value: string | number; subtext?: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
      <Icon className="w-5 h-5 text-muted-foreground" />
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-semibold">{value}</div>
        {subtext && <div className="text-xs text-muted-foreground">{subtext}</div>}
      </div>
    </div>
  );
}

export default function PlaybookReadinessDashboard({
  playbookId,
  organizationId,
  compact = false,
}: PlaybookReadinessDashboardProps) {
  const { data: readinessData, isLoading, refetch } = useQuery({
    queryKey: ['/api/playbook-library', playbookId, 'readiness', { organizationId }],
    queryFn: async () => {
      const res = await fetch(`/api/playbook-library/${playbookId}/readiness?organizationId=${organizationId}`);
      if (!res.ok) throw new Error('Failed to fetch readiness');
      return res.json();
    },
    enabled: !!playbookId && !!organizationId,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const score = readinessData?.score;
  const breakdown = readinessData?.breakdown;
  const overallScore = score?.overallScore ?? 0;

  const getOverallStatus = () => {
    if (overallScore >= 80) return { label: 'Fully Ready', color: 'green', icon: CheckCircle2 };
    if (overallScore >= 60) return { label: 'Mostly Ready', color: 'blue', icon: TrendingUp };
    if (overallScore >= 40) return { label: 'Needs Attention', color: 'amber', icon: AlertTriangle };
    return { label: 'Setup Required', color: 'red', icon: Clock };
  };

  const status = getOverallStatus();
  const StatusIcon = status.icon;

  if (compact) {
    return (
      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-lg">
        <div className="text-center">
          <div className={`text-3xl font-bold text-${status.color}-400`}>{overallScore}%</div>
          <div className="text-xs text-slate-400">Readiness</div>
        </div>
        <div className="flex-1 grid grid-cols-4 gap-2 text-xs">
          <div className="text-center">
            <div className="text-violet-400">{score?.prepareScore ?? 0}%</div>
            <div className="text-slate-500">IDENTIFY</div>
          </div>
          <div className="text-center">
            <div className="text-blue-400">{score?.monitorScore ?? 0}%</div>
            <div className="text-slate-500">DETECT</div>
          </div>
          <div className="text-center">
            <div className="text-emerald-400">{score?.executeScore ?? 0}%</div>
            <div className="text-slate-500">EXECUTE</div>
          </div>
          <div className="text-center">
            <div className="text-amber-400">{score?.learnScore ?? 0}%</div>
            <div className="text-slate-500">ADVANCE</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="w-5 h-5" />
              Playbook Readiness Score
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => refetch()}
              className="text-white hover:bg-white/10"
              data-testid="button-refresh-readiness"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className={`text-6xl font-bold text-${status.color}-400`}>{overallScore}%</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <StatusIcon className={`w-4 h-4 text-${status.color}-400`} />
                <span className={`text-sm text-${status.color}-400`}>{status.label}</span>
              </div>
            </div>
            <div className="flex-1 h-24 flex items-end gap-2">
              {[
                { phase: 'identify', score: score?.prepareScore ?? 0 },
                { phase: 'detect', score: score?.monitorScore ?? 0 },
                { phase: 'execute', score: score?.executeScore ?? 0 },
                { phase: 'advance', score: score?.learnScore ?? 0 },
              ].map(({ phase, score: phaseScore }) => {
                const config = PHASE_CONFIG[phase as keyof typeof PHASE_CONFIG];
                return (
                  <div key={phase} className="flex-1 flex flex-col items-center">
                    <div 
                      className={`w-full bg-${config.color}-600 rounded-t-sm transition-all duration-500`}
                      style={{ height: `${Math.max(phaseScore * 0.8, 4)}px` }}
                    />
                    <div className="text-[10px] text-slate-400 mt-1">{config.name}</div>
                    <div className="text-xs font-semibold">{phaseScore}%</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-700">
            <ReadinessMetricCard 
              icon={Users} 
              label="Stakeholders" 
              value={`${score?.stakeholdersAssigned ?? 0}/${score?.stakeholdersTotal ?? 0}`}
            />
            <ReadinessMetricCard 
              icon={FileText} 
              label="Documents" 
              value={`${score?.documentsReady ?? 0}/${score?.documentsTotal ?? 0}`}
            />
            <ReadinessMetricCard 
              icon={Bell} 
              label="Triggers" 
              value={`${score?.triggersActive ?? 0}/${score?.triggersConfigured ?? 0}`}
            />
            <ReadinessMetricCard 
              icon={DollarSign} 
              label="Resources" 
              value={`${score?.resourcesStaged ?? 0}/${score?.resourcesTotal ?? 0}`}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <PhaseScoreCard 
          phase="identify" 
          score={score?.prepareScore ?? 0} 
          items={{ completed: breakdown?.prepare?.completed, total: breakdown?.prepare?.total }}
        />
        <PhaseScoreCard 
          phase="detect" 
          score={score?.monitorScore ?? 0}
          items={{ active: breakdown?.monitor?.active, total: breakdown?.monitor?.total }}
        />
        <PhaseScoreCard 
          phase="execute" 
          score={score?.executeScore ?? 0}
        />
        <PhaseScoreCard 
          phase="advance" 
          score={score?.learnScore ?? 0}
          items={{ configured: breakdown?.learn?.configured }}
        />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Weight Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-1 h-4 rounded-full overflow-hidden">
            <div 
              className="bg-violet-500 flex items-center justify-center text-[10px] text-white font-medium"
              style={{ width: `${score?.prepareWeight ?? 40}%` }}
            >
              {score?.prepareWeight ?? 40}%
            </div>
            <div 
              className="bg-blue-500 flex items-center justify-center text-[10px] text-white font-medium"
              style={{ width: `${score?.monitorWeight ?? 20}%` }}
            >
              {score?.monitorWeight ?? 20}%
            </div>
            <div 
              className="bg-emerald-500 flex items-center justify-center text-[10px] text-white font-medium"
              style={{ width: `${score?.executeWeight ?? 30}%` }}
            >
              {score?.executeWeight ?? 30}%
            </div>
            <div 
              className="bg-amber-500 flex items-center justify-center text-[10px] text-white font-medium"
              style={{ width: `${score?.learnWeight ?? 10}%` }}
            >
              {score?.learnWeight ?? 10}%
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>IDENTIFY</span>
            <span>DETECT</span>
            <span>EXECUTE</span>
            <span>ADVANCE</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
