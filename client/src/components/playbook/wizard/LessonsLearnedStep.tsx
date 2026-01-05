import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface LessonsLearnedStepProps {
  data: any;
  onChange: (data: any) => void;
  playbook: any;
}

export default function LessonsLearnedStep({ data, onChange, playbook }: LessonsLearnedStepProps) {
  return (
    <div className="space-y-6">
      <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
        <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          0% Pre-filled Template - Post-Execution Only
        </h3>
        <p className="text-xs text-muted-foreground">
          This section is populated AFTER playbook execution. Use it to capture institutional knowledge and improve future activations.
        </p>
      </div>

      {/* Historical Success Rate Display */}
      {playbook?.historicalSuccessRate > 0 && (
        <Card className="p-4 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm">Historical Performance</h4>
            <span className="text-2xl font-bold text-green-700 dark:text-green-300">
              {(playbook.historicalSuccessRate * 100).toFixed(0)}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Success rate across {playbook.averageActivationFrequency || 'multiple'} activations
          </p>
        </Card>
      )}

      {/* Lessons Learned Template */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="what-worked">What Worked Well</Label>
          <Textarea
            id="what-worked"
            value={data?.whatWorked || ''}
            onChange={(e) => onChange({ ...data, whatWorked: e.target.value })}
            placeholder="After execution, document what went according to plan:&#10;- Effective communication channels&#10;- Stakeholders who responded quickly&#10;- Decisions that accelerated response&#10;- Tools or processes that helped"
            rows={6}
            data-testid="textarea-what-worked"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="what-didnt">What Could Be Improved</Label>
          <Textarea
            id="what-didnt"
            value={data?.whatDidntWork || ''}
            onChange={(e) => onChange({ ...data, whatDidntWork: e.target.value })}
            placeholder="After execution, identify areas for improvement:&#10;- Bottlenecks in the response&#10;- Communication gaps&#10;- Missing stakeholders&#10;- Outdated contact information&#10;- Better tools or resources needed"
            rows={6}
            data-testid="textarea-what-didnt"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="playbook-mods">Recommended Playbook Modifications</Label>
          <Textarea
            id="playbook-mods"
            value={data?.playbookModifications || ''}
            onChange={(e) => onChange({ ...data, playbookModifications: e.target.value })}
            placeholder="Specific changes to make to this playbook:&#10;- Update trigger criteria based on false positives/negatives&#10;- Add/remove stakeholders&#10;- Adjust time allocations&#10;- Update communication templates&#10;- Revise decision checkpoints"
            rows={6}
            data-testid="textarea-modifications"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="institutional-knowledge">Institutional Knowledge Capture</Label>
          <Textarea
            id="institutional-knowledge"
            value={data?.institutionalKnowledge || ''}
            onChange={(e) => onChange({ ...data, institutionalKnowledge: e.target.value })}
            placeholder="Key learnings for the organization:&#10;- Industry-specific insights gained&#10;- Vendor/partner performance notes&#10;- Regulatory considerations discovered&#10;- Internal capability gaps identified&#10;- Best practices to replicate"
            rows={6}
            data-testid="textarea-institutional"
          />
        </div>
      </div>

      {/* AI Analysis Note */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold text-sm mb-2">AI-Powered Analysis</h4>
        <p className="text-xs text-muted-foreground">
          After you complete lessons learned, M's AI will analyze patterns across all executions to generate:
        </p>
        <ul className="text-xs text-muted-foreground mt-2 space-y-1 list-disc list-inside">
          <li>Automated playbook optimization suggestions</li>
          <li>Cross-playbook pattern detection</li>
          <li>Predictive risk scoring improvements</li>
          <li>Stakeholder engagement optimization</li>
        </ul>
      </Card>
    </div>
  );
}
