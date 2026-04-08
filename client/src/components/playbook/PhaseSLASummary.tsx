import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Target, Zap, TrendingUp } from 'lucide-react';

interface PhaseSLA {
  name: string;
  description: string;
  targetMinutes?: number;
  unit: 'minutes' | 'hours' | 'days';
  enabled: boolean;
}

interface PhaseSLASummaryProps {
  phaseSLAs?: Record<string, PhaseSLA>;
  compact?: boolean;
}

const PHASE_CONFIG = {
  identify: {
    icon: Target,
    label: 'IDENTIFY',
    color: 'text-[#0A0F2E]',
    bgColor: 'bg-[#0A0F2E] dark:bg-[#0A0F2E]',
  },
  detect: {
    icon: Clock,
    label: 'DETECT',
    color: 'text-amber-500',
    bgColor: 'bg-amber-50 dark:bg-amber-950',
  },
  execute: {
    icon: Zap,
    label: 'EXECUTE',
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-950',
  },
  advance: {
    icon: TrendingUp,
    label: 'ADVANCE',
    color: 'text-[#C9A84C]',
    bgColor: 'bg-[#0A0F2E] dark:bg-[#0A0F2E]',
  },
};

const DEFAULT_SLAS: Record<string, PhaseSLA> = {
  identify: {
    name: 'Stakeholder Notification SLA',
    description: 'Time from decision to notify all tier-1 stakeholders',
    unit: 'minutes',
    targetMinutes: 15,
    enabled: true,
  },
  detect: {
    name: 'Signal Detection SLA',
    description: 'Time from trigger event to AI signal detection',
    unit: 'hours',
    targetMinutes: 240,
    enabled: true,
  },
  execute: {
    name: 'Execution SLA',
    description: 'Time from trigger fire to first task execution',
    unit: 'minutes',
    targetMinutes: 5,
    enabled: true,
  },
  advance: {
    name: 'Outcome SLA',
    description: 'Time to achieve primary objectives',
    unit: 'hours',
    targetMinutes: 1440,
    enabled: true,
  },
};

const convertFromMinutes = (minutes: number, unit: string) => {
  switch (unit) {
    case 'hours':
      return Math.round(minutes / 60 * 10) / 10;
    case 'days':
      return Math.round(minutes / 1440 * 10) / 10;
    default:
      return minutes;
  }
};

export function PhaseSLASummary({ phaseSLAs, compact = false }: PhaseSLASummaryProps) {
  const slas = phaseSLAs || DEFAULT_SLAS;
  const isCustomized = !!phaseSLAs;
  const enabledCount = Object.values(slas).filter(s => s.enabled).length;

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {(Object.keys(PHASE_CONFIG) as Array<keyof typeof PHASE_CONFIG>).map((phase) => {
          const sla = slas[phase];
          const config = PHASE_CONFIG[phase];
          const Icon = config.icon;
          
          if (!sla?.enabled) return null;
          
          const displayValue = sla.targetMinutes 
            ? convertFromMinutes(sla.targetMinutes, sla.unit)
            : 0;

          return (
            <Badge key={phase} variant="outline" className="flex items-center gap-1.5 py-1">
              <Icon className={`h-3 w-3 ${config.color}`} />
              <span className="text-xs font-medium">{config.label}</span>
              <span className="text-xs text-muted-foreground">{displayValue}{sla.unit[0]}</span>
            </Badge>
          );
        })}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-poise-teal" />
            Phase SLAs (IDEA Framework)
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={isCustomized ? "default" : "secondary"} className="text-xs">
              {isCustomized ? 'Customized' : 'Default Targets'}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {enabledCount}/4 Active
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(Object.keys(PHASE_CONFIG) as Array<keyof typeof PHASE_CONFIG>).map((phase) => {
            const sla = slas[phase];
            const config = PHASE_CONFIG[phase];
            const Icon = config.icon;
            
            const displayValue = sla?.targetMinutes 
              ? convertFromMinutes(sla.targetMinutes, sla.unit)
              : 0;

            return (
              <div 
                key={phase} 
                className={`p-3 rounded-lg ${config.bgColor} border border-slate-200 dark:border-slate-700`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`h-4 w-4 ${config.color}`} />
                  <span className={`text-xs font-bold ${config.color}`}>{config.label}</span>
                </div>
                {sla?.enabled ? (
                  <>
                    <div className="text-lg font-semibold text-slate-900 dark:text-white">
                      {displayValue} <span className="text-sm font-normal">{sla.unit}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {sla.name}
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Not configured
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-slate-900 dark:text-white">SLA Compliance Tracking:</span>{' '}
            When this playbook is activated, Readiness OS will measure actual performance against these targets 
            and report compliance metrics for continuous improvement.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default PhaseSLASummary;
