import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
  Users,
  FileText,
  DollarSign,
  Building2,
  MessageSquare,
  Package,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Trash2,
} from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface PreparePhaseViewProps {
  playbookId: string;
  organizationId: string;
  isEditable?: boolean;
}

type PrepareItemType = 
  | 'stakeholder_assignment'
  | 'document_template'
  | 'vendor_contract'
  | 'budget_approval'
  | 'communication_template'
  | 'resource_staging';

interface PrepareItem {
  id: string;
  playbookId: string;
  organizationId: string;
  itemType: PrepareItemType;
  title: string;
  description?: string;
  responsibleRole?: string;
  status: 'not_started' | 'in_progress' | 'completed';
  priority: 'critical' | 'high' | 'medium' | 'low';
  isRequired: boolean;
  sequence: number;
  completedAt?: string;
  completedBy?: string;
}

const ITEM_TYPE_CONFIG: Record<PrepareItemType, { icon: any; label: string; color: string }> = {
  stakeholder_assignment: { icon: Users, label: 'Stakeholder Assignment', color: 'text-blue-500' },
  document_template: { icon: FileText, label: 'Document Template', color: 'text-green-500' },
  vendor_contract: { icon: Building2, label: 'Vendor Contract', color: 'text-purple-500' },
  budget_approval: { icon: DollarSign, label: 'Budget Approval', color: 'text-yellow-500' },
  communication_template: { icon: MessageSquare, label: 'Communication Template', color: 'text-indigo-500' },
  resource_staging: { icon: Package, label: 'Resource Staging', color: 'text-orange-500' },
};

const PRIORITY_CONFIG = {
  critical: { label: 'Critical', color: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' },
  high: { label: 'High', color: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300' },
  medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300' },
  low: { label: 'Low', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
};

const STATUS_CONFIG = {
  not_started: { label: 'Not Started', icon: Circle, color: 'text-slate-400' },
  in_progress: { label: 'In Progress', icon: Clock, color: 'text-yellow-500' },
  completed: { label: 'Completed', icon: CheckCircle2, color: 'text-green-500' },
};

export function PreparePhaseView({ playbookId, organizationId, isEditable = true }: PreparePhaseViewProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [newItem, setNewItem] = useState<{
    itemType: PrepareItemType;
    title: string;
    description: string;
    responsibleRole: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    isRequired: boolean;
  }>({
    itemType: 'stakeholder_assignment',
    title: '',
    description: '',
    responsibleRole: '',
    priority: 'high',
    isRequired: true,
  });
  const { toast } = useToast();

  const { data: items = [], isLoading } = useQuery<PrepareItem[]>({
    queryKey: ['/api/playbook-library', playbookId, 'prepare-items', { organizationId }],
    queryFn: async () => {
      const response = await fetch(
        `/api/playbook-library/${playbookId}/prepare-items?organizationId=${organizationId}`
      );
      if (!response.ok) throw new Error('Failed to fetch prepare items');
      return response.json();
    },
    enabled: !!playbookId && !!organizationId,
  });

  const createItemMutation = useMutation({
    mutationFn: async (data: Partial<PrepareItem>) => {
      const response = await apiRequest('POST', `/api/playbook-library/${playbookId}/prepare-items`, {
        ...data,
        organizationId,
        sequence: items.length + 1,
        status: 'not_started',
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/playbook-library', playbookId, 'prepare-items'] });
      setIsAddDialogOpen(false);
      setNewItem({
        itemType: 'stakeholder_assignment',
        title: '',
        description: '',
        responsibleRole: '',
        priority: 'high',
        isRequired: true,
      });
      toast({ title: 'Prepare item added', description: 'The item has been added to your playbook.' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to add prepare item.', variant: 'destructive' });
    },
  });

  const completeItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const response = await apiRequest(
        'PATCH',
        `/api/playbook-library/${playbookId}/prepare-items/${itemId}/complete`,
        { completedBy: 'current-user' }
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/playbook-library', playbookId, 'prepare-items'] });
      queryClient.invalidateQueries({ queryKey: ['/api/playbook-library', playbookId, 'readiness'] });
      toast({ title: 'Item completed', description: 'Readiness score updated.' });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      await apiRequest('DELETE', `/api/playbook-library/${playbookId}/prepare-items/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/playbook-library', playbookId, 'prepare-items'] });
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

  const completedCount = items.filter((i) => i.status === 'completed').length;
  const requiredItems = items.filter((i) => i.isRequired);
  const requiredCompleted = requiredItems.filter((i) => i.status === 'completed').length;
  const progressPercent = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.itemType]) acc[item.itemType] = [];
    acc[item.itemType].push(item);
    return acc;
  }, {} as Record<PrepareItemType, PrepareItem[]>);

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="prepare-phase-view">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                IDENTIFY Phase — Build Your Depth Chart
              </CardTitle>
              <CardDescription>
                Assign stakeholders, stage documents, and configure resources before activation
              </CardDescription>
            </div>
            <Badge
              variant={progressPercent >= 80 ? 'default' : progressPercent >= 50 ? 'secondary' : 'destructive'}
              className="text-lg px-3 py-1"
              data-testid="prepare-progress-badge"
            >
              {progressPercent}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{completedCount} of {items.length} items complete</span>
              <span>•</span>
              <span className="text-amber-500">
                {requiredCompleted}/{requiredItems.length} required
              </span>
            </div>
            <Progress value={progressPercent} className="h-3" data-testid="prepare-progress-bar" />
          </div>
        </CardContent>
      </Card>

      {Object.entries(groupedItems).map(([type, typeItems]) => {
        const config = ITEM_TYPE_CONFIG[type as PrepareItemType];
        const Icon = config.icon;

        return (
          <Card key={type} data-testid={`prepare-section-${type}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Icon className={`h-5 w-5 ${config.color}`} />
                {config.label}
                <Badge variant="outline" className="ml-auto">
                  {typeItems.filter((i) => i.status === 'completed').length}/{typeItems.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {typeItems.map((item) => {
                const statusConfig = STATUS_CONFIG[item.status];
                const StatusIcon = statusConfig.icon;
                const isExpanded = expandedItems.has(item.id);

                return (
                  <div
                    key={item.id}
                    className={`border rounded-lg p-3 transition-all ${
                      item.status === 'completed'
                        ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                        : 'bg-card border-border hover:border-blue-300 dark:hover:border-blue-700'
                    }`}
                    data-testid={`prepare-item-${item.id}`}
                  >
                    <div className="flex items-center gap-3">
                      {isEditable && item.status !== 'completed' && (
                        <Checkbox
                          checked={false}
                          onCheckedChange={() => completeItemMutation.mutate(item.id)}
                          data-testid={`checkbox-${item.id}`}
                        />
                      )}
                      {item.status === 'completed' && (
                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{item.title}</span>
                          {item.isRequired && (
                            <Badge variant="outline" className="text-xs shrink-0">
                              Required
                            </Badge>
                          )}
                          <Badge className={`text-xs shrink-0 ${PRIORITY_CONFIG[item.priority].color}`}>
                            {PRIORITY_CONFIG[item.priority].label}
                          </Badge>
                        </div>
                        {item.responsibleRole && (
                          <span className="text-xs text-muted-foreground">
                            Responsible: {item.responsibleRole}
                          </span>
                        )}
                      </div>
                      <StatusIcon className={`h-4 w-4 ${statusConfig.color} shrink-0`} />
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
                        {item.completedAt && (
                          <p className="mt-2 text-xs">
                            Completed: {new Date(item.completedAt).toLocaleDateString()}
                          </p>
                        )}
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
            </CardContent>
          </Card>
        );
      })}

      {items.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">No Prepare Items Configured</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add stakeholder assignments, document templates, and resource staging to prepare for execution.
            </p>
            {isEditable && (
              <Button onClick={() => setIsAddDialogOpen(true)} data-testid="button-add-first-item">
                <Plus className="h-4 w-4 mr-2" /> Add First Item
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {isEditable && items.length > 0 && (
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full" variant="outline" data-testid="button-add-prepare-item">
              <Plus className="h-4 w-4 mr-2" /> Add Prepare Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Prepare Item</DialogTitle>
              <DialogDescription>
                Configure a new preparation item for this playbook.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Item Type</Label>
                <Select
                  value={newItem.itemType}
                  onValueChange={(v) => setNewItem({ ...newItem, itemType: v as PrepareItemType })}
                >
                  <SelectTrigger data-testid="select-item-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ITEM_TYPE_CONFIG).map(([type, config]) => (
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
                  placeholder="e.g., Assign General Counsel as lead"
                  data-testid="input-title"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Describe what needs to be done..."
                  data-testid="input-description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Responsible Role</Label>
                  <Input
                    value={newItem.responsibleRole}
                    onChange={(e) => setNewItem({ ...newItem, responsibleRole: e.target.value })}
                    placeholder="e.g., Legal, Finance"
                    data-testid="input-role"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={newItem.priority}
                    onValueChange={(v) => setNewItem({ ...newItem, priority: v as 'critical' | 'high' | 'medium' | 'low' })}
                  >
                    <SelectTrigger data-testid="select-priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="isRequired"
                  checked={newItem.isRequired}
                  onCheckedChange={(checked) => setNewItem({ ...newItem, isRequired: !!checked })}
                  data-testid="checkbox-required"
                />
                <Label htmlFor="isRequired">Required for activation</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => createItemMutation.mutate(newItem)}
                disabled={!newItem.title || createItemMutation.isPending}
                data-testid="button-save-item"
              >
                {createItemMutation.isPending ? 'Saving...' : 'Add Item'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default PreparePhaseView;
