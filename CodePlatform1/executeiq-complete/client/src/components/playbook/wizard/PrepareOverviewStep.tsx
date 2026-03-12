import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Users, FileText, DollarSign, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface PrepareItem {
  id: string;
  type: 'stakeholder_assignment' | 'document_staging' | 'budget_preapproval' | 'vendor_contract' | 'communication_template';
  title: string;
  description?: string;
  assignee?: string;
  status: 'pending' | 'in_progress' | 'completed';
  dueDate?: string;
}

interface PrepareOverviewStepProps {
  data: any;
  onChange: (data: any) => void;
  playbook: any;
}

const PREPARE_ITEM_TYPES = [
  { value: 'stakeholder_assignment', label: 'Stakeholder Assignment', icon: Users },
  { value: 'document_staging', label: 'Document Staging', icon: FileText },
  { value: 'budget_preapproval', label: 'Budget Pre-approval', icon: DollarSign },
  { value: 'vendor_contract', label: 'Vendor Contract', icon: FileText },
  { value: 'communication_template', label: 'Communication Template', icon: FileText },
];

const DEFAULT_PREPARE_ITEMS: PrepareItem[] = [
  { id: '1', type: 'stakeholder_assignment', title: 'Assign Crisis Lead', status: 'completed', assignee: 'CISO' },
  { id: '2', type: 'stakeholder_assignment', title: 'Assign Legal Counsel', status: 'completed', assignee: 'General Counsel' },
  { id: '3', type: 'stakeholder_assignment', title: 'Assign Communications Lead', status: 'completed', assignee: 'CCO' },
  { id: '4', type: 'document_staging', title: 'Stage Incident Response Template', status: 'completed' },
  { id: '5', type: 'document_staging', title: 'Stage Stakeholder Notification Template', status: 'completed' },
  { id: '6', type: 'budget_preapproval', title: 'Pre-approve Emergency IR Budget ($250K)', status: 'completed' },
  { id: '7', type: 'vendor_contract', title: 'Activate IR Retainer (CrowdStrike)', status: 'in_progress' },
  { id: '8', type: 'communication_template', title: 'Board Notification Template', status: 'pending' },
];

export default function PrepareOverviewStep({ data, onChange, playbook }: PrepareOverviewStepProps) {
  const [prepareItems, setPrepareItems] = useState<PrepareItem[]>(
    data.prepareItems || DEFAULT_PREPARE_ITEMS
  );
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState<Partial<PrepareItem>>({
    type: 'stakeholder_assignment',
    title: '',
    status: 'pending',
  });

  const completedCount = prepareItems.filter(item => item.status === 'completed').length;
  const completionPercentage = (completedCount / prepareItems.length) * 100;

  const handleAddItem = () => {
    if (!newItem.title) return;
    const item: PrepareItem = {
      id: Date.now().toString(),
      type: newItem.type as PrepareItem['type'],
      title: newItem.title,
      description: newItem.description,
      assignee: newItem.assignee,
      status: 'pending',
    };
    const updated = [...prepareItems, item];
    setPrepareItems(updated);
    onChange({ prepareItems: updated });
    setNewItem({ type: 'stakeholder_assignment', title: '', status: 'pending' });
    setShowAddItem(false);
  };

  const handleToggleStatus = (id: string) => {
    const updated = prepareItems.map(item => {
      if (item.id === id) {
        const nextStatus: PrepareItem['status'] = item.status === 'completed' ? 'pending' : 'completed';
        return { ...item, status: nextStatus };
      }
      return item;
    });
    setPrepareItems(updated);
    onChange({ prepareItems: updated });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-slate-400" />;
    }
  };

  const getTypeIcon = (type: string) => {
    const itemType = PREPARE_ITEM_TYPES.find(t => t.value === type);
    const Icon = itemType?.icon || FileText;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="bg-violet-50 dark:bg-violet-950 p-4 rounded-lg border border-violet-200 dark:border-violet-800">
        <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
          <span className="text-lg">🎯</span> IDENTIFY Phase — Build Your Depth Chart
        </h3>
        <p className="text-xs text-muted-foreground">
          Configure stakeholder assignments, pre-approved budgets, staged documents, and vendor contracts. 
          These items ensure your organization is ready to execute in 12 minutes when a trigger fires.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Readiness Checklist</CardTitle>
            <Badge variant={completionPercentage === 100 ? "default" : "secondary"}>
              {completedCount}/{prepareItems.length} Complete
            </Badge>
          </div>
          <Progress value={completionPercentage} className="h-2 mt-2" />
        </CardHeader>
        <CardContent className="space-y-2">
          {prepareItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => handleToggleStatus(item.id)}
              data-testid={`prepare-item-${item.id}`}
            >
              <Checkbox
                checked={item.status === 'completed'}
                className="pointer-events-none"
              />
              <div className="flex-shrink-0 text-muted-foreground">
                {getTypeIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${item.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                  {item.title}
                </div>
                {item.assignee && (
                  <div className="text-xs text-muted-foreground">Assigned to: {item.assignee}</div>
                )}
              </div>
              {getStatusIcon(item.status)}
            </div>
          ))}

          {showAddItem ? (
            <Card className="border-dashed">
              <CardContent className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Type</Label>
                    <Select
                      value={newItem.type}
                      onValueChange={(value) => setNewItem({ ...newItem, type: value as PrepareItem['type'] })}
                    >
                      <SelectTrigger data-testid="select-item-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PREPARE_ITEM_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Assignee (optional)</Label>
                    <Input
                      value={newItem.assignee || ''}
                      onChange={(e) => setNewItem({ ...newItem, assignee: e.target.value })}
                      placeholder="Role or name"
                      data-testid="input-assignee"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Title</Label>
                  <Input
                    value={newItem.title || ''}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    placeholder="e.g., Assign Backup Crisis Lead"
                    data-testid="input-item-title"
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddItem} data-testid="button-add-item">
                    Add Item
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
              data-testid="button-show-add-item"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Preparation Item
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
