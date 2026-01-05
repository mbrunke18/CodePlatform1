import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Plus, BookOpen, Users, BarChart3, FileText, Calendar, X, Lightbulb } from 'lucide-react';

interface LearnItem {
  id: string;
  type: 'debrief_meeting' | 'stakeholder_survey' | 'metrics_review' | 'playbook_update' | 'documentation';
  title: string;
  description?: string;
  timing: 'within_24h' | 'within_48h' | 'within_1week' | 'within_2weeks';
  participants: string[];
  required: boolean;
}

interface LearnConfigStepProps {
  data: any;
  onChange: (data: any) => void;
  playbook: any;
}

const LEARN_ITEM_TYPES = [
  { value: 'debrief_meeting', label: 'Debrief Meeting', icon: Users, color: 'text-blue-500' },
  { value: 'stakeholder_survey', label: 'Stakeholder Survey', icon: FileText, color: 'text-purple-500' },
  { value: 'metrics_review', label: 'Metrics Review', icon: BarChart3, color: 'text-emerald-500' },
  { value: 'playbook_update', label: 'Playbook Update', icon: BookOpen, color: 'text-amber-500' },
  { value: 'documentation', label: 'Documentation', icon: FileText, color: 'text-cyan-500' },
];

const TIMING_OPTIONS = [
  { value: 'within_24h', label: 'Within 24 hours' },
  { value: 'within_48h', label: 'Within 48 hours' },
  { value: 'within_1week', label: 'Within 1 week' },
  { value: 'within_2weeks', label: 'Within 2 weeks' },
];

const DEFAULT_LEARN_ITEMS: LearnItem[] = [
  { id: '1', type: 'debrief_meeting', title: 'Incident Post-Mortem', timing: 'within_48h', participants: ['CISO', 'CTO', 'General Counsel'], required: true },
  { id: '2', type: 'stakeholder_survey', title: 'Response Effectiveness Survey', timing: 'within_1week', participants: ['All Responders'], required: true },
  { id: '3', type: 'metrics_review', title: 'Response Time Analysis', timing: 'within_48h', participants: ['CISO', 'COO'], required: true },
  { id: '4', type: 'playbook_update', title: 'Update Playbook with Learnings', timing: 'within_2weeks', participants: ['COO', 'Risk Team'], required: true },
  { id: '5', type: 'documentation', title: 'Incident Report for Board', timing: 'within_1week', participants: ['CCO', 'General Counsel'], required: false },
];

export default function LearnConfigStep({ data, onChange, playbook }: LearnConfigStepProps) {
  const [learnItems, setLearnItems] = useState<LearnItem[]>(
    data.learnItems || DEFAULT_LEARN_ITEMS
  );
  const [autoCreateImprovements, setAutoCreateImprovements] = useState(
    data.autoCreateImprovements ?? true
  );
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState<Partial<LearnItem>>({
    type: 'debrief_meeting',
    title: '',
    timing: 'within_48h',
    participants: [],
    required: true,
  });

  const handleAddItem = () => {
    if (!newItem.title) return;
    const item: LearnItem = {
      id: Date.now().toString(),
      type: newItem.type as LearnItem['type'],
      title: newItem.title,
      description: newItem.description,
      timing: newItem.timing as LearnItem['timing'],
      participants: newItem.participants || [],
      required: newItem.required ?? true,
    };
    const updated = [...learnItems, item];
    setLearnItems(updated);
    onChange({ learnItems: updated, autoCreateImprovements });
    setNewItem({
      type: 'debrief_meeting',
      title: '',
      timing: 'within_48h',
      participants: [],
      required: true,
    });
    setShowAddItem(false);
  };

  const handleRemoveItem = (id: string) => {
    const updated = learnItems.filter(item => item.id !== id);
    setLearnItems(updated);
    onChange({ learnItems: updated, autoCreateImprovements });
  };

  const handleToggleRequired = (id: string) => {
    const updated = learnItems.map(item =>
      item.id === id ? { ...item, required: !item.required } : item
    );
    setLearnItems(updated);
    onChange({ learnItems: updated, autoCreateImprovements });
  };

  const handleAutoCreateChange = (checked: boolean) => {
    setAutoCreateImprovements(checked);
    onChange({ learnItems, autoCreateImprovements: checked });
  };

  const getTypeIcon = (type: string) => {
    const itemType = LEARN_ITEM_TYPES.find(t => t.value === type);
    const Icon = itemType?.icon || FileText;
    const color = itemType?.color || 'text-slate-500';
    return <Icon className={`h-4 w-4 ${color}`} />;
  };

  const getTimingLabel = (timing: string) => {
    return TIMING_OPTIONS.find(t => t.value === timing)?.label || timing;
  };

  const requiredCount = learnItems.filter(item => item.required).length;

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
        <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
          <span className="text-lg">📚</span> ADVANCE Phase — Review the Film
        </h3>
        <p className="text-xs text-muted-foreground">
          Configure post-execution learning activities. M will automatically schedule these after 
          playbook completion to capture insights and improve future responses.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Learning Activities</CardTitle>
            <Badge variant="secondary">
              {requiredCount} Required · {learnItems.length - requiredCount} Optional
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {learnItems.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 p-3 border rounded-lg bg-background"
              data-testid={`learn-item-${item.id}`}
            >
              <div className="flex-shrink-0 pt-0.5">
                {getTypeIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{item.title}</span>
                  {item.required && (
                    <Badge variant="default" className="text-[10px]">Required</Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge variant="outline" className="text-xs gap-1">
                    <Calendar className="h-3 w-3" />
                    {getTimingLabel(item.timing)}
                  </Badge>
                  {item.participants.length > 0 && (
                    <Badge variant="outline" className="text-xs gap-1">
                      <Users className="h-3 w-3" />
                      {item.participants.join(', ')}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={item.required}
                  onCheckedChange={() => handleToggleRequired(item.id)}
                  data-testid={`switch-required-${item.id}`}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => handleRemoveItem(item.id)}
                  data-testid={`button-remove-learn-${item.id}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {showAddItem ? (
            <Card className="border-dashed">
              <CardContent className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Activity Type</Label>
                    <Select
                      value={newItem.type}
                      onValueChange={(value) => setNewItem({ ...newItem, type: value as LearnItem['type'] })}
                    >
                      <SelectTrigger data-testid="select-learn-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LEARN_ITEM_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Timing</Label>
                    <Select
                      value={newItem.timing}
                      onValueChange={(value) => setNewItem({ ...newItem, timing: value as LearnItem['timing'] })}
                    >
                      <SelectTrigger data-testid="select-timing">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TIMING_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Activity Title</Label>
                  <Input
                    value={newItem.title || ''}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    placeholder="e.g., Customer Impact Assessment"
                    data-testid="input-learn-title"
                  />
                </div>
                <div>
                  <Label className="text-xs">Participants (comma-separated)</Label>
                  <Input
                    value={newItem.participants?.join(', ') || ''}
                    onChange={(e) => setNewItem({ ...newItem, participants: e.target.value.split(',').map(p => p.trim()).filter(Boolean) })}
                    placeholder="e.g., CISO, CTO, Customer Success"
                    data-testid="input-participants"
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddItem} data-testid="button-add-learn">
                    Add Activity
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowAddItem(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Button
              variant="outline"
              className="w-full border-dashed"
              onClick={() => setShowAddItem(true)}
              data-testid="button-show-add-learn"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Learning Activity
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            AI Learning Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <div className="text-sm font-medium">Auto-Create Improvement Tasks</div>
              <div className="text-xs text-muted-foreground">
                Automatically generate improvement tasks based on post-mortem insights
              </div>
            </div>
            <Switch
              checked={autoCreateImprovements}
              onCheckedChange={handleAutoCreateChange}
              data-testid="switch-auto-improvements"
            />
          </div>

          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="text-xs text-muted-foreground">
              After each playbook execution, M will analyze response metrics and stakeholder 
              feedback to identify patterns and recommend playbook improvements. This creates 
              a continuous learning loop that improves your organization's response capabilities.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
