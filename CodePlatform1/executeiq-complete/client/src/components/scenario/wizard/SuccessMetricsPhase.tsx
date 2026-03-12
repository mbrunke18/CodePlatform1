import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, Plus, Trash2, TrendingUp, Clock, Target, Shield } from 'lucide-react';

interface SuccessMetricsPhaseProps {
  data: any;
  onChange: (updates: any) => void;
}

const METRIC_CATEGORIES = [
  { value: 'leading', label: 'Leading Indicator', icon: TrendingUp, description: 'Predicts future success' },
  { value: 'lagging', label: 'Lagging Outcome', icon: Target, description: 'Measures final results' },
  { value: 'efficiency', label: 'Efficiency Metric', icon: Clock, description: 'Tracks process optimization' },
  { value: 'quality', label: 'Quality Metric', icon: Shield, description: 'Measures excellence' },
];

const MEASUREMENT_UNITS = [
  { value: 'dollars', label: '$ (Dollars)' },
  { value: 'percent', label: '% (Percentage)' },
  { value: 'hours', label: 'Hours/Minutes' },
  { value: 'count', label: 'Count/Number' },
  { value: 'days', label: 'Days' },
];

const METRIC_TEMPLATES = [
  { name: 'Time to Stakeholder Coordination', category: 'efficiency', unit: 'hours', baseline: '72', target: '0.2' },
  { name: 'Business Value Realized', category: 'lagging', unit: 'dollars', baseline: '0', target: '1000000' },
  { name: 'Task Completion Rate', category: 'efficiency', unit: 'percent', baseline: '50', target: '85' },
  { name: 'Stakeholder Satisfaction', category: 'quality', unit: 'percent', baseline: '60', target: '90' },
];

export default function SuccessMetricsPhase({ data, onChange }: SuccessMetricsPhaseProps) {
  const [newMetric, setNewMetric] = useState({
    name: '',
    category: 'leading' as const,
    measurementUnit: 'percent',
    baselineValue: '',
    targetValue: '',
    isKeyMetric: false,
  });

  const addMetric = () => {
    if (newMetric.name && newMetric.targetValue) {
      const metrics = [...(data.metrics || []), { ...newMetric, id: Date.now() }];
      onChange({ metrics });
      setNewMetric({
        name: '',
        category: 'leading',
        measurementUnit: 'percent',
        baselineValue: '',
        targetValue: '',
        isKeyMetric: false,
      });
    }
  };

  const removeMetric = (id: number) => {
    const metrics = (data.metrics || []).filter((m: any) => m.id !== id);
    onChange({ metrics });
  };

  const applyTemplate = (template: typeof METRIC_TEMPLATES[0]) => {
    setNewMetric({
      ...newMetric,
      name: template.name,
      category: template.category as any,
      measurementUnit: template.unit,
      baselineValue: template.baseline,
      targetValue: template.target,
    });
  };

  return (
    <div className="space-y-6">
      {/* Metric Templates */}
      <Card className="border-purple-500/30 bg-purple-950/20">
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-purple-300 mb-3">Standard Success Metrics</h3>
          <div className="grid md:grid-cols-2 gap-2">
            {METRIC_TEMPLATES.map((template, index) => (
              <button
                key={index}
                onClick={() => applyTemplate(template)}
                className="p-3 rounded border border-purple-500/30 bg-slate-900/50 hover:bg-slate-800/50 transition-colors text-left"
                data-testid={`template-metric-${index}`}
              >
                <p className="text-sm font-medium text-white">{template.name}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Target: {template.target} {template.unit}
                </p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Metric Form */}
      <Card className="border-blue-500/30 bg-slate-900/50">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <Plus className="h-5 w-5 text-blue-400" />
            Define Success Metric
          </h3>

          <div className="space-y-4">
            <div>
              <Label htmlFor="metric-name" className="text-white">Metric Name *</Label>
              <Input
                id="metric-name"
                data-testid="input-metric-name"
                placeholder="e.g., Time to Full Stakeholder Coordination"
                value={newMetric.name}
                onChange={(e) => setNewMetric({ ...newMetric, name: e.target.value })}
                className="bg-slate-800 border-slate-600 text-white mt-2"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="metric-category" className="text-white">Metric Category *</Label>
                <Select 
                  value={newMetric.category} 
                  onValueChange={(value: any) => setNewMetric({ ...newMetric, category: value })}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white mt-2" data-testid="select-metric-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {METRIC_CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <SelectItem key={cat.value} value={cat.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            <div>
                              <div className="font-medium">{cat.label}</div>
                              <div className="text-xs text-gray-500">{cat.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="metric-unit" className="text-white">Measurement Unit *</Label>
                <Select 
                  value={newMetric.measurementUnit} 
                  onValueChange={(value) => setNewMetric({ ...newMetric, measurementUnit: value })}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white mt-2" data-testid="select-measurement-unit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MEASUREMENT_UNITS.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="metric-baseline" className="text-white">Baseline Value</Label>
                <Input
                  id="metric-baseline"
                  data-testid="input-baseline-value"
                  placeholder="Current performance"
                  value={newMetric.baselineValue}
                  onChange={(e) => setNewMetric({ ...newMetric, baselineValue: e.target.value })}
                  className="bg-slate-800 border-slate-600 text-white mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">Where are you today?</p>
              </div>

              <div>
                <Label htmlFor="metric-target" className="text-white">Target Value *</Label>
                <Input
                  id="metric-target"
                  data-testid="input-target-value"
                  placeholder="Goal to achieve"
                  value={newMetric.targetValue}
                  onChange={(e) => setNewMetric({ ...newMetric, targetValue: e.target.value })}
                  className="bg-slate-800 border-slate-600 text-white mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">What defines success?</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is-key-metric"
                checked={newMetric.isKeyMetric}
                onChange={(e) => setNewMetric({ ...newMetric, isKeyMetric: e.target.checked })}
                className="rounded border-slate-600"
                data-testid="checkbox-key-metric"
              />
              <label htmlFor="is-key-metric" className="text-sm text-white cursor-pointer">
                This is a key success metric (primary indicator)
              </label>
            </div>

            <Button
              onClick={addMetric}
              disabled={!newMetric.name || !newMetric.targetValue}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              data-testid="button-add-metric"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Metric
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Metrics List */}
      {data.metrics && data.metrics.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-blue-400" />
            Success Metrics ({data.metrics.length})
          </h3>

          <div className="space-y-3">
            {data.metrics.map((metric: any) => {
              const categoryConfig = METRIC_CATEGORIES.find(c => c.value === metric.category);
              const CategoryIcon = categoryConfig?.icon || BarChart3;
              const unitLabel = MEASUREMENT_UNITS.find(u => u.value === metric.measurementUnit)?.label || metric.measurementUnit;

              return (
                <Card key={metric.id} className="border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CategoryIcon className="h-4 w-4 text-blue-400" />
                          <h4 className="font-semibold text-white">{metric.name}</h4>
                          {metric.isKeyMetric && (
                            <Badge className="bg-yellow-600/20 text-yellow-300 border-yellow-500/50 text-xs">
                              Key Metric
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-400 space-y-1">
                          <p>
                            <span className="text-gray-500">Category:</span> {categoryConfig?.label}
                          </p>
                          <p>
                            <span className="text-gray-500">Baseline:</span> {metric.baselineValue || 'Not set'} {unitLabel} →{' '}
                            <span className="text-green-400 font-semibold">Target: {metric.targetValue} {unitLabel}</span>
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMetric(metric.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-950/20"
                        data-testid={`button-remove-metric-${metric.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
