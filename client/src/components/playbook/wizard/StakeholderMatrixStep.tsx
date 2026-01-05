import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Users } from 'lucide-react';

interface StakeholderMatrixStepProps {
  data: any;
  onChange: (data: any) => void;
  playbook: any;
}

export default function StakeholderMatrixStep({ data, onChange }: StakeholderMatrixStepProps) {
  const [newStakeholder, setNewStakeholder] = useState({ tier: 'tier1', name: '', role: '', email: '' });

  const addStakeholder = () => {
    if (!newStakeholder.name || !newStakeholder.role) return;
    
    const tierKey = `${newStakeholder.tier}Stakeholders`;
    const updatedTier = [...(data[tierKey] || []), {
      name: newStakeholder.name,
      role: newStakeholder.role,
      email: newStakeholder.email,
    }];
    
    onChange({ [tierKey]: updatedTier });
    setNewStakeholder({ tier: 'tier1', name: '', role: '', email: '' });
  };

  const removeStakeholder = (tier: string, index: number) => {
    const tierKey = `${tier}Stakeholders`;
    const updatedTier = [...(data[tierKey] || [])];
    updatedTier.splice(index, 1);
    onChange({ [tierKey]: updatedTier });
  };

  const renderStakeholderList = (tier: string, tierName: string, description: string) => {
    const tierKey = `${tier}Stakeholders`;
    const stakeholders = data[tierKey] || [];

    return (
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              {tierName}
            </h4>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <Badge variant="outline">{stakeholders.length} people</Badge>
        </div>

        <div className="space-y-2">
          {stakeholders.map((stakeholder: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-muted/50 rounded"
              data-testid={`stakeholder-${tier}-${index}`}
            >
              <div className="flex-1">
                <div className="font-medium text-sm">{stakeholder.name}</div>
                <div className="text-xs text-muted-foreground">{stakeholder.role}</div>
                {stakeholder.email && (
                  <div className="text-xs text-muted-foreground">{stakeholder.email}</div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeStakeholder(tier, index)}
                data-testid={`button-remove-${tier}-${index}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-sm mb-2">90% Pre-filled Template</h3>
        <p className="text-xs text-muted-foreground">
          Stakeholder tiers are pre-assigned by role. Add specific people from your organization.
        </p>
      </div>

      {/* Add Stakeholder Form */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <h4 className="font-semibold text-sm mb-3">Add Stakeholder</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="stakeholder-tier">Tier</Label>
            <select
              id="stakeholder-tier"
              value={newStakeholder.tier}
              onChange={(e) => setNewStakeholder({ ...newStakeholder, tier: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              data-testid="select-stakeholder-tier"
            >
              <option value="tier1">Tier 1 - Decision Makers</option>
              <option value="tier2">Tier 2 - Execution Team</option>
              <option value="tier3">Tier 3 - Notification Group</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="stakeholder-name">Name *</Label>
            <Input
              id="stakeholder-name"
              value={newStakeholder.name}
              onChange={(e) => setNewStakeholder({ ...newStakeholder, name: e.target.value })}
              placeholder="John Smith"
              data-testid="input-stakeholder-name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stakeholder-role">Role *</Label>
            <Input
              id="stakeholder-role"
              value={newStakeholder.role}
              onChange={(e) => setNewStakeholder({ ...newStakeholder, role: e.target.value })}
              placeholder="CEO, CFO, VP Operations..."
              data-testid="input-stakeholder-role"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stakeholder-email">Email</Label>
            <Input
              id="stakeholder-email"
              type="email"
              value={newStakeholder.email}
              onChange={(e) => setNewStakeholder({ ...newStakeholder, email: e.target.value })}
              placeholder="john@company.com"
              data-testid="input-stakeholder-email"
            />
          </div>
        </div>
        <Button
          onClick={addStakeholder}
          className="w-full mt-3"
          disabled={!newStakeholder.name || !newStakeholder.role}
          data-testid="button-add-stakeholder"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Stakeholder
        </Button>
      </Card>

      {/* Tier 1: Decision Makers */}
      {renderStakeholderList('tier1', 'Tier 1: Decision Makers', '8-12 people notified within 5 minutes')}

      {/* Tier 2: Execution Team */}
      {renderStakeholderList('tier2', 'Tier 2: Execution Team', '30-50 people notified within 10 minutes')}

      {/* Tier 3: Notification Group */}
      {renderStakeholderList('tier3', 'Tier 3: Notification Group', '100-200 people notified within 15 minutes')}
    </div>
  );
}
