import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, X, GitBranch } from 'lucide-react';

interface DecisionTreesStepProps {
  data: any;
  onChange: (data: any) => void;
  playbook: any;
}

export default function DecisionTreesStep({ data, onChange }: DecisionTreesStepProps) {
  const [newCheckpoint, setNewCheckpoint] = useState({ question: '', options: ['', ''] });

  const addCheckpoint = () => {
    if (!newCheckpoint.question) return;
    
    const updatedCheckpoints = [...(data.decisionCheckpoints || []), {
      question: newCheckpoint.question,
      options: newCheckpoint.options.filter(Boolean),
      authorityLevel: 'Executive',
    }];
    
    onChange({ decisionCheckpoints: updatedCheckpoints });
    setNewCheckpoint({ question: '', options: ['', ''] });
  };

  const removeCheckpoint = (index: number) => {
    const updated = [...(data.decisionCheckpoints || [])];
    updated.splice(index, 1);
    onChange({ decisionCheckpoints: updated });
  };

  const addOption = () => {
    setNewCheckpoint({ ...newCheckpoint, options: [...newCheckpoint.options, ''] });
  };

  const updateOption = (index: number, value: string) => {
    const updated = [...newCheckpoint.options];
    updated[index] = value;
    setNewCheckpoint({ ...newCheckpoint, options: updated });
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-sm mb-2">85% Pre-filled Template</h3>
        <p className="text-xs text-muted-foreground">
          Critical decision checkpoints with pre-mapped options and escalation paths
        </p>
      </div>

      {/* Add Decision Checkpoint */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <GitBranch className="h-4 w-4" />
          Add Decision Checkpoint
        </h4>
        
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="checkpoint-question">Decision Point *</Label>
            <Input
              id="checkpoint-question"
              value={newCheckpoint.question}
              onChange={(e) => setNewCheckpoint({ ...newCheckpoint, question: e.target.value })}
              placeholder="e.g., 'Should we halt production immediately?'"
              data-testid="input-checkpoint-question"
            />
          </div>

          <div className="space-y-2">
            <Label>Response Options *</Label>
            {newCheckpoint.options.map((option, index) => (
              <Input
                key={index}
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                data-testid={`input-option-${index}`}
              />
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={addOption}
              className="w-full"
              data-testid="button-add-option"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Option
            </Button>
          </div>

          <Button
            onClick={addCheckpoint}
            className="w-full"
            disabled={!newCheckpoint.question || newCheckpoint.options.filter(Boolean).length < 2}
            data-testid="button-add-checkpoint"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Decision Checkpoint
            </Button>
        </div>
      </Card>

      {/* Existing Checkpoints */}
      <div className="space-y-3">
        <h4 className="font-semibold text-sm">Decision Checkpoints ({(data.decisionCheckpoints || []).length})</h4>
        {(data.decisionCheckpoints || []).map((checkpoint: any, index: number) => (
          <Card key={index} className="p-4" data-testid={`checkpoint-${index}`}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="font-medium text-sm mb-2">{checkpoint.question}</div>
                <div className="space-y-1">
                  {checkpoint.options.map((option: string, optIndex: number) => (
                    <div key={optIndex} className="text-xs bg-muted/50 px-2 py-1 rounded">
                      {optIndex + 1}. {option}
                    </div>
                  ))}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeCheckpoint(index)}
                data-testid={`button-remove-checkpoint-${index}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Escalation Paths */}
      <div className="space-y-2">
        <Label htmlFor="escalation">Escalation Paths</Label>
        <Textarea
          id="escalation"
          value={Array.isArray(data.escalationPaths) ? data.escalationPaths.join('\n') : ''}
          onChange={(e) => onChange({ escalationPaths: e.target.value.split('\n').filter(Boolean) })}
          placeholder="Define when to escalate (one per line)&#10;Examples:&#10;- Board notification if cost exceeds $5M&#10;- Legal counsel if regulatory implications&#10;- External PR firm if media coverage"
          rows={5}
          data-testid="textarea-escalation"
        />
      </div>
    </div>
  );
}
