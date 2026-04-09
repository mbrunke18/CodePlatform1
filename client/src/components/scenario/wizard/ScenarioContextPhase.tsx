import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Clock, TrendingUp, Shield, Zap, Lightbulb } from 'lucide-react';

interface ScenarioContextPhaseProps {
  data: any;
  onChange: (updates: any) => void;
}

const SCENARIO_TYPE_OPTIONS = [
  { 
    value: 'growth', 
    label: 'Growth', 
    icon: TrendingUp, 
    description: 'Market expansion, product launch, revenue opportunities',
    color: 'text-green-400'
  },
  { 
    value: 'protection', 
    label: 'Protection', 
    icon: Shield, 
    description: 'Risk mitigation, crisis response, business continuity',
    color: 'text-red-400'
  },
  { 
    value: 'transformation', 
    label: 'Transformation', 
    icon: Zap, 
    description: 'Digital transformation, org change, process reengineering',
    color: 'text-[#C9A84C]'
  },
  { 
    value: 'operational', 
    label: 'Operational', 
    icon: Target, 
    description: 'Day-to-day operations, efficiency improvements',
    color: 'text-[#0A0F2E]'
  },
];

const TIME_HORIZON_OPTIONS = [
  { value: 'immediate', label: 'Immediate (0-30 days)', description: 'Urgent response required' },
  { value: 'short_term', label: 'Short-term (30-90 days)', description: 'Near-term execution window' },
  { value: 'medium_term', label: 'Medium-term (90-180 days)', description: 'Quarterly planning horizon' },
  { value: 'long_term', label: 'Long-term (180+ days)', description: 'Strategic transformation timeline' },
];

const BUSINESS_IMPACT_OPTIONS = [
  { value: 'revenue', label: 'Revenue Impact', description: 'Direct effect on top-line growth' },
  { value: 'risk', label: 'Risk Mitigation', description: 'Prevent losses or compliance issues' },
  { value: 'efficiency', label: 'Efficiency Gains', description: 'Cost reduction or productivity' },
  { value: 'innovation', label: 'Innovation', description: 'Competitive advantage or new capabilities' },
];

export default function ScenarioContextPhase({ data, onChange }: ScenarioContextPhaseProps) {
  const selectedType = SCENARIO_TYPE_OPTIONS.find(t => t.value === data.scenarioType);

  return (
    <div className="space-y-6">
      {/* AI Suggestion Banner */}
      <Card className="border-[#C9A84C]/30 bg-[#C9A84C]/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-[#C9A84C] mt-0.5" />
            <div>
              <p className="text-sm text-[#C9A84C] font-medium">AI Recommendation</p>
              <p className="text-xs text-gray-700 mt-1">
                Start with a template scenario to get industry-standard defaults, then customize for your business.
                Most customers only need to customize 20-30% of fields.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-gray-900 flex items-center gap-2">
            Scenario Name <Badge variant="outline" className="text-xs">Required</Badge>
          </Label>
          <Input
            id="name"
            data-testid="input-scenario-name"
            placeholder="e.g., Supply Chain Disruption - Asia Pacific"
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className="bg-gray-50 border-slate-600 text-gray-900 mt-2"
          />
          <p className="text-xs text-gray-800 mt-1">Use clear, descriptive names that your team will recognize</p>
        </div>

        <div>
          <Label htmlFor="description" className="text-gray-900">Brief Description</Label>
          <Textarea
            id="description"
            data-testid="textarea-scenario-description"
            placeholder="What is this scenario about?"
            value={data.description}
            onChange={(e) => onChange({ description: e.target.value })}
            className="bg-gray-50 border-slate-600 text-gray-900 mt-2 min-h-[80px]"
          />
        </div>
      </div>

      {/* Strategic Framing - Standardized Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Target className="h-5 w-5 text-[#0A0F2E]" />
          Strategic Framing
        </h3>

        {/* Scenario Type - Visual Cards */}
        <div>
          <Label className="text-gray-900 flex items-center gap-2 mb-3">
            Scenario Type <Badge variant="outline" className="text-xs">Required</Badge>
          </Label>
          <div className="grid md:grid-cols-2 gap-3">
            {SCENARIO_TYPE_OPTIONS.map((type) => {
              const Icon = type.icon;
              const isSelected = data.scenarioType === type.value;
              return (
                <button
                  key={type.value}
                  onClick={() => onChange({ scenarioType: type.value })}
                  data-testid={`select-scenario-type-${type.value}`}
                  className={`p-4 border-2 text-left transition-all ${
                    isSelected
                      ? 'border-[#2B8A6E] bg-[#0A0F2E]/30'
                      : 'border-gray-200 bg-white hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`h-5 w-5 ${isSelected ? 'text-[#0A0F2E]' : type.color}`} />
                    <span className={`font-semibold ${isSelected ? 'text-[#DFC178]' : 'text-gray-900'}`}>
                      {type.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700">{type.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mission/Objective */}
        <div>
          <Label htmlFor="mission" className="text-gray-900 flex items-center gap-2">
            Mission/Objective <Badge variant="outline" className="text-xs">Required</Badge>
          </Label>
          <Input
            id="mission"
            data-testid="input-mission"
            placeholder="e.g., Maintain 95% fulfillment rate during supplier disruptions"
            value={data.mission}
            onChange={(e) => onChange({ mission: e.target.value })}
            className="bg-gray-50 border-slate-600 text-gray-900 mt-2"
          />
          <p className="text-xs text-gray-800 mt-1">Clear, measurable objective this scenario should achieve</p>
        </div>

        {/* Time Horizon - Dropdown */}
        <div>
          <Label className="text-gray-900 flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4" />
            Time Horizon <Badge variant="outline" className="text-xs">Required</Badge>
          </Label>
          <Select value={data.timeHorizon} onValueChange={(value) => onChange({ timeHorizon: value })}>
            <SelectTrigger className="bg-gray-50 border-slate-600 text-gray-900" data-testid="select-time-horizon">
              <SelectValue placeholder="Select time horizon" />
            </SelectTrigger>
            <SelectContent>
              {TIME_HORIZON_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs text-gray-800">{option.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Business Impact Category */}
        <div>
          <Label className="text-gray-900 flex items-center gap-2 mb-2">
            Business Impact Category <Badge variant="outline" className="text-xs">Required</Badge>
          </Label>
          <Select 
            value={data.businessImpactCategory} 
            onValueChange={(value) => onChange({ businessImpactCategory: value })}
          >
            <SelectTrigger className="bg-gray-50 border-slate-600 text-gray-900" data-testid="select-business-impact">
              <SelectValue placeholder="Select primary impact" />
            </SelectTrigger>
            <SelectContent>
              {BUSINESS_IMPACT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs text-gray-800">{option.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Optional: Organizational Context */}
      <details className="border border-gray-200 p-4 bg-white">
        <summary className="cursor-pointer text-gray-900 font-medium">
          Advanced: Organizational Context (Optional)
        </summary>
        <div className="mt-4 space-y-4">
          <div>
            <Label htmlFor="businessUnit" className="text-gray-900">Primary Business Unit</Label>
            <Input
              id="businessUnit"
              data-testid="input-business-unit"
              placeholder="e.g., Supply Chain Operations"
              value={data.primaryBusinessUnit}
              onChange={(e) => onChange({ primaryBusinessUnit: e.target.value })}
              className="bg-gray-50 border-slate-600 text-gray-900 mt-2"
            />
          </div>

          <div>
            <Label htmlFor="narrativeContext" className="text-gray-900">Additional Context</Label>
            <Textarea
              id="narrativeContext"
              data-testid="textarea-narrative"
              placeholder="Provide additional background, history, or relevant context..."
              value={data.narrativeContext}
              onChange={(e) => onChange({ narrativeContext: e.target.value })}
              className="bg-gray-50 border-slate-600 text-gray-900 mt-2 min-h-[100px]"
            />
          </div>
        </div>
      </details>
    </div>
  );
}
