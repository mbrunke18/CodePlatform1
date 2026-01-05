import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, X, Target } from 'lucide-react';

interface SuccessMetricsStepProps {
  data: any;
  onChange: (data: any) => void;
  playbook: any;
}

export default function SuccessMetricsStep({ data, onChange }: SuccessMetricsStepProps) {
  const [newMetric, setNewMetric] = useState({ metric: '', target: '', timeframe: '' });

  const metrics = Array.isArray(data?.outcomeMetrics) ? data.outcomeMetrics : [];

  const addMetric = () => {
    if (!newMetric.metric || !newMetric.target || !newMetric.timeframe) return;
    
    const updated = [...metrics, newMetric];
    onChange({ ...data, outcomeMetrics: updated });
    setNewMetric({ metric: '', target: '', timeframe: '' });
  };

  const removeMetric = (index: number) => {
    const updated = [...metrics];
    updated.splice(index, 1);
    onChange({ ...data, outcomeMetrics: updated });
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-sm mb-2">80% Pre-filled Template</h3>
        <p className="text-xs text-muted-foreground">
          Response speed targets and domain-specific outcome metrics
        </p>
      </div>

      {/* Response Speed Metrics */}
      <Card className="p-4">
        <h4 className="font-semibold text-sm mb-4">Response Speed Targets</h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="response-speed">Target Coordinated Response (minutes)</Label>
            <Input
              id="response-speed"
              type="number"
              value={data?.targetResponseSpeed || 12}
              onChange={(e) => onChange({ ...data, targetResponseSpeed: parseInt(e.target.value) || 12 })}
              placeholder="12"
              data-testid="input-response-speed"
            />
            <p className="text-xs text-muted-foreground">
              M standard: 12 minutes to coordinated response
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stakeholder-reach">Target Stakeholder Reach (%)</Label>
            <Input
              id="stakeholder-reach"
              type="number"
              min="0"
              max="100"
              value={Math.round((data?.targetStakeholderReach || 1.0) * 100)}
              onChange={(e) => onChange({ ...data, targetStakeholderReach: (parseInt(e.target.value) || 100) / 100 })}
              placeholder="100"
              data-testid="input-stakeholder-reach"
            />
            <p className="text-xs text-muted-foreground">
              % of Tier 1 stakeholders reached within target time
            </p>
          </div>
        </div>
      </Card>

      {/* Domain-Specific Outcome Metrics */}
      <div className="space-y-3">
        <h4 className="font-semibold text-sm">Domain-Specific Outcome Metrics</h4>
        
        <Card className="p-4 bg-primary/5 border-primary/20">
          <h5 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Add Outcome Metric
          </h5>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="metric-name">Metric *</Label>
              <Input
                id="metric-name"
                value={newMetric.metric}
                onChange={(e) => setNewMetric({ ...newMetric, metric: e.target.value })}
                placeholder="Market Share Retention"
                data-testid="input-metric-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metric-target">Target *</Label>
              <Input
                id="metric-target"
                value={newMetric.target}
                onChange={(e) => setNewMetric({ ...newMetric, target: e.target.value })}
                placeholder="≥95%"
                data-testid="input-metric-target"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metric-timeframe">Timeframe *</Label>
              <Input
                id="metric-timeframe"
                value={newMetric.timeframe}
                onChange={(e) => setNewMetric({ ...newMetric, timeframe: e.target.value })}
                placeholder="90 days post-crisis"
                data-testid="input-metric-timeframe"
              />
            </div>
          </div>

          <Button
            onClick={addMetric}
            className="w-full mt-3"
            disabled={!newMetric.metric || !newMetric.target || !newMetric.timeframe}
            data-testid="button-add-metric"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Metric
          </Button>
        </Card>

        {/* Metrics List */}
        <div className="space-y-2">
          {metrics.map((metric: any, index: number) => (
            <Card key={index} className="p-3" data-testid={`metric-${index}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-sm">{metric.metric}</div>
                  <div className="text-xs text-muted-foreground">
                    Target: {metric.target} • Timeframe: {metric.timeframe}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMetric(index)}
                  data-testid={`button-remove-metric-${index}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Learning Metrics */}
      <div className="bg-muted/30 p-4 rounded-lg">
        <h4 className="font-semibold text-sm mb-2">Continuous Learning Metrics</h4>
        <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
          <li>Post-execution performance review completion rate</li>
          <li>Playbook modification adoption rate</li>
          <li>Average time from execution to lessons learned capture</li>
          <li>Knowledge transfer effectiveness (measured via subsequent activations)</li>
        </ul>
      </div>
    </div>
  );
}
