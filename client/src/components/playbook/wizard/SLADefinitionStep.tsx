import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Lightbulb, Clock, AlertTriangle, TrendingUp } from 'lucide-react';

interface PhaseSLA {
  name: string;
  description: string;
  targetMinutes?: number;
  unit: 'minutes' | 'hours' | 'days';
  enabled: boolean;
}

interface SLADefinitionStepProps {
  data: any;
  onChange: (data: any) => void;
  playbook: any;
}

const PHASE_DEFAULTS: Record<string, PhaseSLA> = {
  identify: {
    name: 'Stakeholder Notification SLA',
    description: 'Time from decision to notify all tier-1 stakeholders',
    unit: 'minutes' as const,
    targetMinutes: 15,
    enabled: true,
  },
  detect: {
    name: 'Signal Detection SLA',
    description: 'Time from trigger event to AI signal detection',
    unit: 'hours' as const,
    targetMinutes: 240,
    enabled: true,
  },
  execute: {
    name: 'Execution SLA',
    description: 'Time from trigger fire to first task execution',
    unit: 'minutes' as const,
    targetMinutes: 5,
    enabled: true,
  },
  advance: {
    name: 'Outcome SLA',
    description: 'Time to achieve primary objectives and stabilize situation',
    unit: 'hours' as const,
    targetMinutes: 1440,
    enabled: true,
  },
};

const PHASE_INFO = {
  identify: {
    icon: '🎯',
    title: 'IDENTIFY Phase',
    description: 'How quickly must you notify and activate your stakeholders?',
  },
  detect: {
    icon: '👁️',
    title: 'DETECT Phase',
    description: 'How quickly must AI detect signals and alert you?',
  },
  execute: {
    icon: '⚡',
    title: 'EXECUTE Phase',
    description: 'How quickly must tasks begin after trigger activation?',
  },
  advance: {
    icon: '📊',
    title: 'ADVANCE Phase',
    description: 'How long to stabilize and achieve key outcomes?',
  },
};

export default function SLADefinitionStep({ data, onChange, playbook }: SLADefinitionStepProps) {
  const [selectedPhase, setSelectedPhase] = useState<'identify' | 'detect' | 'execute' | 'advance'>('identify');

  const phaseSLAs = data?.phaseSLAs || PHASE_DEFAULTS;
  const currentPhase = selectedPhase;
  const sla = phaseSLAs[currentPhase] || PHASE_DEFAULTS[currentPhase];

  const updateSLA = (phase: keyof typeof PHASE_DEFAULTS, updates: Partial<PhaseSLA>) => {
    const updated = {
      ...phaseSLAs,
      [phase]: {
        ...phaseSLAs[phase],
        ...updates,
      },
    };
    onChange({ ...data, phaseSLAs: updated });
  };

  const convertToMinutes = (value: number, unit: string) => {
    switch (unit) {
      case 'hours':
        return value * 60;
      case 'days':
        return value * 1440;
      default:
        return value;
    }
  };

  const convertFromMinutes = (minutes: number, unit: string) => {
    switch (unit) {
      case 'hours':
        return Math.round(minutes / 60 * 100) / 100;
      case 'days':
        return Math.round(minutes / 1440 * 100) / 100;
      default:
        return minutes;
    }
  };

  const displayValue = sla.targetMinutes 
    ? convertFromMinutes(sla.targetMinutes, sla.unit)
    : '';

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border-0">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl">⏱️</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Define Phase Timeframes
              </h3>
              <p className="text-sm text-gray-800 dark:text-slate-300">
                Executive-defined SLAs set clear expectations for each phase and create accountability. 
                These timeframes become your organizational standard for measuring execution velocity.
              </p>
              <div className="flex flex-wrap gap-4 mt-4 text-xs">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-700" />
                  <span>Enables SLA tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#C9A84C]" />
                  <span>Validates playbook feasibility</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-800" />
                  <span>Measures execution velocity</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(Object.keys(PHASE_DEFAULTS) as Array<keyof typeof PHASE_DEFAULTS>).map((phase) => (
          <button
            key={phase}
            onClick={() => setSelectedPhase(phase as any)}
            className={`p-3 rounded-lg border-2 transition-all text-left ${
              selectedPhase === phase
                ? 'border-primary bg-primary/10'
                : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
            }`}
          >
            <div className="text-2xl mb-1">{PHASE_INFO[phase as keyof typeof PHASE_INFO].icon}</div>
            <div className="text-xs font-semibold text-slate-900 dark:text-white">
              {phase.toUpperCase()}
            </div>
            {phaseSLAs[phase]?.enabled && (
              <div className="text-xs text-emerald-700 mt-1">✓ Configured</div>
            )}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">{PHASE_INFO[currentPhase].title}</CardTitle>
              <CardDescription className="mt-1">
                {PHASE_INFO[currentPhase].description}
              </CardDescription>
            </div>
            <Checkbox
              checked={sla.enabled}
              onCheckedChange={(checked) => updateSLA(currentPhase, { enabled: !!checked })}
              id={`sla-${currentPhase}`}
            />
          </div>
        </CardHeader>

        {sla.enabled && (
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor={`name-${currentPhase}`} className="text-sm font-medium">
                SLA Name
              </Label>
              <Input
                id={`name-${currentPhase}`}
                value={sla.name}
                onChange={(e) => updateSLA(currentPhase, { name: e.target.value })}
                placeholder="e.g., Stakeholder Notification SLA"
                className="text-sm"
              />
              <p className="text-xs text-gray-800">Give this SLA a clear, actionable name</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`desc-${currentPhase}`} className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id={`desc-${currentPhase}`}
                value={sla.description}
                onChange={(e) => updateSLA(currentPhase, { description: e.target.value })}
                placeholder="Explain what this SLA measures and why it matters"
                rows={2}
                className="text-sm"
              />
              <p className="text-xs text-gray-800">This helps teams understand the "why" behind the timeframe</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`target-${currentPhase}`} className="text-sm font-medium">
                  Target Timeframe
                </Label>
                <Input
                  id={`target-${currentPhase}`}
                  type="number"
                  value={displayValue}
                  onChange={(e) => {
                    const numValue = parseFloat(e.target.value) || 0;
                    const minutes = convertToMinutes(numValue, sla.unit);
                    updateSLA(currentPhase, { targetMinutes: minutes });
                  }}
                  placeholder="Enter timeframe"
                  min="0"
                  step="0.5"
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`unit-${currentPhase}`} className="text-sm font-medium">
                  Unit
                </Label>
                <Select
                  value={sla.unit}
                  onValueChange={(unit) =>
                    updateSLA(currentPhase, { unit: unit as 'minutes' | 'hours' | 'days' })
                  }
                >
                  <SelectTrigger id={`unit-${currentPhase}`} className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-4">
                <div className="flex gap-2 text-sm">
                  <Lightbulb className="w-4 h-4 text-blue-800 flex-shrink-0 mt-0.5" />
                  <div className="text-blue-900 dark:text-blue-100">
                    <p className="font-semibold mb-1">How This SLA Works:</p>
                    <div className="space-y-1 text-xs">
                      {currentPhase === 'identify' && (
                        <>
                          <p>• You set: All tier-1 stakeholders must be notified within {displayValue} {sla.unit}</p>
                          <p>• Platform tracks: Actual time from decision to notification</p>
                          <p>• Result: SLA compliance metrics show % of activations that met this target</p>
                        </>
                      )}
                      {currentPhase === 'detect' && (
                        <>
                          <p>• You set: AI must detect signals within {displayValue} {sla.unit}</p>
                          <p>• Platform tracks: Actual time from event occurrence to alert generation</p>
                          <p>• Result: Validates your monitoring system's responsiveness</p>
                        </>
                      )}
                      {currentPhase === 'execute' && (
                        <>
                          <p>• You set: Tasks must begin within {displayValue} {sla.unit} of trigger fire</p>
                          <p>• Platform tracks: Actual time from activation to first task execution</p>
                          <p>• Result: Measures your playbook's coordination effectiveness</p>
                        </>
                      )}
                      {currentPhase === 'advance' && (
                        <>
                          <p>• You set: Situation must stabilize within {displayValue} {sla.unit}</p>
                          <p>• Platform tracks: Actual time to achieve primary objectives</p>
                          <p>• Result: Demonstrates predictable, reliable crisis resolution speed</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        )}

        {!sla.enabled && (
          <CardContent className="pt-4">
            <div className="text-center py-4 text-gray-800 dark:text-slate-300">
              <p className="text-sm">SLA not configured for this phase</p>
              <p className="text-xs mt-1">Enable the toggle above to set a timeframe</p>
            </div>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">SLA Summary Across All Phases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {(Object.keys(PHASE_DEFAULTS) as Array<keyof typeof PHASE_DEFAULTS>).map((phase) => {
              const s = phaseSLAs[phase];
              const displayVal = s?.targetMinutes 
                ? convertFromMinutes(s.targetMinutes, s.unit)
                : 0;
              return (
                <div key={phase} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-900 rounded">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{PHASE_INFO[phase as keyof typeof PHASE_INFO].icon}</span>
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">{phase.toUpperCase()}</div>
                      <div className="text-xs text-gray-800">{s?.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    {s?.enabled ? (
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {displayVal} {s.unit}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-800 dark:text-slate-200">Not configured</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-0">
        <CardContent className="pt-6">
          <div className="text-sm space-y-2">
            <p className="font-semibold text-slate-900 dark:text-white">
              🎯 This Creates Your Competitive Edge
            </p>
            <p className="text-slate-700 dark:text-slate-200">
              Most companies claim "fast execution." Your team will prove it with auditable SLA compliance metrics.
            </p>
            <div className="text-xs text-gray-800 dark:text-slate-300 mt-3">
              Marketing example: <em>"We guarantee crisis response initiation within 5 minutes—and we track it."</em>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
