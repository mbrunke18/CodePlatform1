import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface SituationDefinitionStepProps {
  data: any;
  onChange: (data: any) => void;
  playbook: any;
}

export default function SituationDefinitionStep({ data, onChange, playbook }: SituationDefinitionStepProps) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-sm mb-2">100% Pre-filled Template</h3>
        <p className="text-xs text-muted-foreground">
          These fields are pre-configured based on industry best practices. Review and adjust as needed for your organization.
        </p>
      </div>

      {/* Severity Score */}
      <div className="space-y-3">
        <Label htmlFor="severity-score">Severity Score (0-100)</Label>
        <div className="flex items-center gap-4">
          <Slider
            id="severity-score"
            value={[data.severityScore || 50]}
            onValueChange={(value) => onChange({ severityScore: value[0] })}
            min={0}
            max={100}
            step={1}
            className="flex-1"
            data-testid="slider-severity"
          />
          <Badge variant="outline" className="w-16 justify-center" data-testid="badge-severity-value">
            {data.severityScore || 50}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Threat assessment: Low (0-33), Medium (34-66), High (67-100)
        </p>
      </div>

      {/* Time Sensitivity */}
      <div className="space-y-2">
        <Label htmlFor="time-sensitivity">Time Sensitivity (Critical Response Window in Hours)</Label>
        <Input
          id="time-sensitivity"
          type="number"
          value={data.timeSensitivity || 24}
          onChange={(e) => onChange({ timeSensitivity: parseInt(e.target.value) || 24 })}
          placeholder="24"
          data-testid="input-time-sensitivity"
        />
        <p className="text-xs text-muted-foreground">
          How many hours do you have to respond before significant damage occurs?
        </p>
      </div>

      {/* Activation Frequency */}
      <div className="space-y-2">
        <Label htmlFor="frequency-tier">Activation Frequency Tier</Label>
        <Select
          value={data.activationFrequencyTier || 'MEDIUM'}
          onValueChange={(value) => onChange({ activationFrequencyTier: value })}
        >
          <SelectTrigger id="frequency-tier" data-testid="select-frequency">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="HIGH">HIGH (10+ times/year)</SelectItem>
            <SelectItem value="MEDIUM">MEDIUM (3-9 times/year)</SelectItem>
            <SelectItem value="LOW">LOW (1-2 times/year)</SelectItem>
            <SelectItem value="RARE">RARE (once per 2-5 years)</SelectItem>
            <SelectItem value="VERY_RARE">VERY RARE (once per 5+ years)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Trigger Criteria */}
      <div className="space-y-2">
        <Label htmlFor="trigger-criteria">Trigger Criteria</Label>
        <Textarea
          id="trigger-criteria"
          value={data.triggerCriteria || ''}
          onChange={(e) => onChange({ triggerCriteria: e.target.value })}
          placeholder="Define specific conditions that activate this playbook (e.g., 'Competitor launches product with 25% price advantage AND market share drops 5%')"
          rows={4}
          data-testid="textarea-trigger-criteria"
        />
        <p className="text-xs text-muted-foreground">
          AI will monitor these conditions 24/7 and recommend activation when confidence exceeds 85%
        </p>
      </div>

      {/* Data Sources */}
      <div className="space-y-2">
        <Label htmlFor="data-sources">Data Sources for Monitoring</Label>
        <Textarea
          id="data-sources"
          value={Array.isArray(data.triggerDataSources) ? data.triggerDataSources.join('\n') : ''}
          onChange={(e) => onChange({ triggerDataSources: e.target.value.split('\n').filter(Boolean) })}
          placeholder="Enter data sources (one per line)&#10;Examples:&#10;- Bloomberg Terminal&#10;- Internal CRM (Salesforce)&#10;- Social Media Monitoring&#10;- Google Trends&#10;- Industry Reports"
          rows={5}
          data-testid="textarea-data-sources"
        />
      </div>
    </div>
  );
}
