import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  MessageSquare,
  ClipboardList,
  FileText,
  RefreshCw,
  BarChart3,
  Users,
  Plus,
  Clock,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface LearnPhaseViewProps {
  playbookId: string;
  organizationId: string;
  isEditable?: boolean;
}

type LearnType = 
  | 'debrief_meeting'
  | 'survey'
  | 'documentation'
  | 'playbook_update'
  | 'metrics_review'
  | 'process_improvement';

type Timing = 
  | 'within_24_hours'
  | 'within_48_hours'
  | 'within_1_week'
  | 'within_1_month'
  | 'quarterly';

interface LearnItem {
  id: string;
  playbookId: string;
  organizationId: string;
  learnType: LearnType;
  title: string;
  description?: string;
  timing: Timing;
  offsetHours: number;
  responsibleRole?: string;
  isRequired: boolean;
  sequence: number;
}

const LEARN_TYPE_CONFIG: Record<LearnType, { icon: any; label: string; color: string }> = {
  debrief_meeting: { icon: MessageSquare, label: 'Debrief Meeting', color: 'text-blue-500' },
  survey: { icon: ClipboardList, label: 'Feedback Survey', color: 'text-green-500' },
  documentation: { icon: FileText, label: 'Documentation', color: 'text-purple-500' },
  playbook_update: { icon: RefreshCw, label: 'Playbook Update', color: 'text-orange-500' },
  metrics_review: { icon: BarChart3, label: 'Metrics Review', color: 'text-cyan-500' },
  process_improvement: { icon: Users, label: 'Process Improvement', color: 'text-pink-500' },
};

const TIMING_CONFIG: Record<Timing, { label: string; description: string }> = {
  within_24_hours: { label: 'Within 24 Hours', description: 'Immediate post-execution' },
  within_48_hours: { label: 'Within 48 Hours', description: 'Short-term follow-up' },
  within_1_week: { label: 'Within 1 Week', description: 'Weekly review cycle' },
  within_1_month: { label: 'Within 1 Month', description: 'Monthly analysis' },
  quarterly: { label: 'Quarterly', description: 'Strategic review cycle' },
};

export function LearnPhaseView({ playbookId, organizationId, isEditable = true }: LearnPhaseViewProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [newItem, setNewItem] = useState({
    learnType: 'debrief_meeting' as LearnType,
    title: '',
    description: '',
    timing: 'within_24_hours' as Timing,
    responsibleRole: '',
    isRequired: true,
  });
  const { toast } = useToast();

  const { data: items = [], isLoading } = useQuery<LearnItem[]>({
    queryKey: ['/api/playbook-library', playbookId, 'learn-items', { organizationId }],
    queryFn: async () => {
      const response = await fetch(
        `/api/playbook-library/${playbookId}/learn-items?organizationId=${organizationId}`
      );
      if (!response.ok) throw new Error('Failed to fetch learn items');
      return response.json();
    },
    enabled: !!playbookId && !!organizationId,
  });

  const createItemMutation = useMutation({
    mutationFn: async (data: Partial<LearnItem>) => {
      const timingToHours: Record<Timing, number> = {
        within_24_hours: 24,
        within_48_hours: 48,
        within_1_week: 168,
        within_1_month: 720,
        quarterly: 2160,
      };
      
      const response = await apiRequest('POST', `/api/playbook-library/${playbookId}/learn-items`, {
        ...data,
        organizationId,
        sequence: items.length + 1,
        offsetHours: timingToHours[data.timing as Timing] || 24,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/playbook-library', playbookId, 'learn-items'] });
      setIsAddDialogOpen(false);
      setNewItem({
        learnType: 'debrief_meeting',
        title: '',
        description: '',
        timing: 'within_24_hours',
        responsibleRole: '',
        isRequired: true,
      });
      toast({ title: 'Learn item added', description: 'Post-execution activity configured.' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to add learn item.', variant: 'destructive' });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      await apiRequest('DELETE', `/api/playbook-library/${playbookId}/learn-items/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/playbook-library', playbookId, 'learn-items'] });
      toast({ title: 'Item deleted' });
    },
  });

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const requiredItems = items.filter((i) => i.isRequired);
  const totalItems = items.length;

  const groupedByTiming = items.reduce((acc, item) => {
    if (!acc[item.timing]) acc[item.timing] = [];
    acc[item.timing].push(item);
    return acc;
  }, {} as Record<Timing, LearnItem[]>);

  const timingOrder: Timing[] = ['within_24_hours', 'within_48_hours', 'within_1_week', 'within_1_month', 'quarterly'];

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="learn-phase-view">
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📚</span>
                ADVANCE Phase — Review the Film
              </CardTitle>
              <CardDescription>
                Post-execution activities to capture learnings and improve playbooks
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400" data-testid="learn-items-count">
                {totalItems}
              </div>
              <div className="text-xs text-muted-foreground">Learning Activities</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(LEARN_TYPE_CONFIG).slice(0, 4).map(([type, config]) => {
              const Icon = config.icon;
              const count = items.filter((i) => i.learnType === type).length;
              return (
                <div key={type} className="p-3 bg-white dark:bg-slate-900 rounded-lg text-center">
                  <Icon className={`h-5 w-5 mx-auto mb-1 ${config.color}`} />
                  <div className="text-lg font-semibold">{count}</div>
                  <div className="text-xs text-muted-foreground truncate">{config.label}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Learning Timeline
          </CardTitle>
          <CardDescription>
            Activities are automatically scheduled based on execution completion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 via-emerald-400 to-green-300 dark:from-green-600 dark:via-emerald-500 dark:to-green-400" />
            
            {timingOrder.map((timing) => {
              const timingItems = groupedByTiming[timing] || [];
              if (timingItems.length === 0) return null;
              
              const timingConfig = TIMING_CONFIG[timing];
              
              return (
                <div key={timing} className="relative pl-10 pb-8" data-testid={`learn-timing-${timing}`}>
                  <div className="absolute left-2 w-5 h-5 rounded-full bg-green-500 border-4 border-white dark:border-slate-900 flex items-center justify-center">
                    <Clock className="h-2.5 w-2.5 text-white" />
                  </div>
                  
                  <div className="mb-3">
                    <h4 className="font-medium">{timingConfig.label}</h4>
                    <p className="text-xs text-muted-foreground">{timingConfig.description}</p>
                  </div>
                  
                  <div className="space-y-2">
                    {timingItems.map((item) => {
                      const typeConfig = LEARN_TYPE_CONFIG[item.learnType];
                      const TypeIcon = typeConfig.icon;
                      const isExpanded = expandedItems.has(item.id);

                      return (
                        <div
                          key={item.id}
                          className="border rounded-lg p-3 bg-card hover:bg-accent/50 transition-all"
                          data-testid={`learn-item-${item.id}`}
                        >
                          <div className="flex items-center gap-3">
                            <TypeIcon className={`h-5 w-5 ${typeConfig.color} shrink-0`} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium truncate">{item.title}</span>
                                {item.isRequired && (
                                  <Badge variant="outline" className="text-xs shrink-0">
                                    Required
                                  </Badge>
                                )}
                              </div>
                              {item.responsibleRole && (
                                <span className="text-xs text-muted-foreground">
                                  Owner: {item.responsibleRole}
                                </span>
                              )}
                            </div>
                            <Badge variant="secondary" className="text-xs shrink-0">
                              {typeConfig.label}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleExpanded(item.id)}
                              data-testid={`expand-${item.id}`}
                            >
                              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>
                          </div>
                          {isExpanded && (
                            <div className="mt-3 pt-3 border-t text-sm text-muted-foreground">
                              <p>{item.description || 'No description provided.'}</p>
                              {isEditable && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="mt-2 text-red-500 hover:text-red-600"
                                  onClick={() => deleteItemMutation.mutate(item.id)}
                                  data-testid={`delete-${item.id}`}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {items.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">No Learning Activities Configured</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add debrief meetings, surveys, and documentation tasks to capture learnings after execution.
            </p>
            {isEditable && (
              <Button onClick={() => setIsAddDialogOpen(true)} data-testid="button-add-first-learn-item">
                <Plus className="h-4 w-4 mr-2" /> Add First Activity
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {isEditable && items.length > 0 && (
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full" variant="outline" data-testid="button-add-learn-item">
              <Plus className="h-4 w-4 mr-2" /> Add Learning Activity
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Learning Activity</DialogTitle>
              <DialogDescription>
                Configure a post-execution activity to capture and apply learnings.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Activity Type</Label>
                <Select
                  value={newItem.learnType}
                  onValueChange={(v) => setNewItem({ ...newItem, learnType: v as LearnType })}
                >
                  <SelectTrigger data-testid="select-learn-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(LEARN_TYPE_CONFIG).map(([type, config]) => (
                      <SelectItem key={type} value={type}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  placeholder="e.g., Team Debrief Session"
                  data-testid="input-learn-title"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Describe the activity objectives..."
                  data-testid="input-learn-description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Timing</Label>
                  <Select
                    value={newItem.timing}
                    onValueChange={(v) => setNewItem({ ...newItem, timing: v as Timing })}
                  >
                    <SelectTrigger data-testid="select-timing">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(TIMING_CONFIG).map(([timing, config]) => (
                        <SelectItem key={timing} value={timing}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Responsible Role</Label>
                  <Input
                    value={newItem.responsibleRole}
                    onChange={(e) => setNewItem({ ...newItem, responsibleRole: e.target.value })}
                    placeholder="e.g., Operations, HR"
                    data-testid="input-learn-role"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="isLearnRequired"
                  checked={newItem.isRequired}
                  onCheckedChange={(checked) => setNewItem({ ...newItem, isRequired: !!checked })}
                  data-testid="checkbox-learn-required"
                />
                <Label htmlFor="isLearnRequired">Required after every execution</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => createItemMutation.mutate(newItem)}
                disabled={!newItem.title || createItemMutation.isPending}
                data-testid="button-save-learn-item"
              >
                {createItemMutation.isPending ? 'Saving...' : 'Add Activity'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default LearnPhaseView;
