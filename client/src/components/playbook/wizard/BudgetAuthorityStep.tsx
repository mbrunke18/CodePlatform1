import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Plus, X, DollarSign } from 'lucide-react';

interface BudgetAuthorityStepProps {
  data: any;
  onChange: (data: any) => void;
  playbook: any;
}

export default function BudgetAuthorityStep({ data, onChange }: BudgetAuthorityStepProps) {
  const [newVendor, setNewVendor] = useState({ name: '', service: '', hourlyRate: '' });

  const vendors = Array.isArray(data?.vendorContracts) ? data.vendorContracts : [];

  const addVendor = () => {
    if (!newVendor.name || !newVendor.service || !newVendor.hourlyRate) return;
    
    const updated = [...vendors, {
      ...newVendor,
      hourlyRate: parseFloat(newVendor.hourlyRate),
    }];
    
    onChange({ ...data, vendorContracts: updated });
    setNewVendor({ name: '', service: '', hourlyRate: '' });
  };

  const removeVendor = (index: number) => {
    const updated = [...vendors];
    updated.splice(index, 1);
    onChange({ ...data, vendorContracts: updated });
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-sm mb-2">100% Pre-filled Template</h3>
        <p className="text-xs text-muted-foreground">
          Pre-approved emergency budget limits and vendor contracts with negotiated rates
        </p>
      </div>

      {/* Pre-Approved Budget */}
      <div className="space-y-3">
        <Label htmlFor="budget-limit">Pre-Approved Emergency Budget Limit</Label>
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <Input
            id="budget-limit"
            type="number"
            value={data?.preApprovedBudget || 0}
            onChange={(e) => onChange({ ...data, preApprovedBudget: parseFloat(e.target.value) || 0 })}
            placeholder="500000"
            className="flex-1"
            data-testid="input-budget-limit"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Maximum spending authority without additional approval
        </p>
      </div>

      {/* Board Approval Required */}
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
        <div className="flex-1">
          <Label htmlFor="board-approval" className="font-medium">Board Approval Required Above Limit</Label>
          <p className="text-xs text-muted-foreground mt-1">
            Spending above this amount requires Board consent
          </p>
        </div>
        <Switch
          id="board-approval"
          checked={data?.budgetApprovalRequired !== false}
          onCheckedChange={(checked) => onChange({ ...data, budgetApprovalRequired: checked })}
          data-testid="switch-board-approval"
        />
      </div>

      {/* Vendor Contracts */}
      <div className="space-y-3">
        <h4 className="font-semibold text-sm">Vendor Contracts & Negotiated Rates</h4>
        
        <Card className="p-4 bg-primary/5 border-primary/20">
          <h5 className="text-sm font-medium mb-3">Add Vendor Contract</h5>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="vendor-name">Vendor/Firm *</Label>
              <Input
                id="vendor-name"
                value={newVendor.name}
                onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                placeholder="Law Firm, PR Agency..."
                data-testid="input-vendor-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vendor-service">Service Type *</Label>
              <Input
                id="vendor-service"
                value={newVendor.service}
                onChange={(e) => setNewVendor({ ...newVendor, service: e.target.value })}
                placeholder="Legal, PR, Consulting..."
                data-testid="input-vendor-service"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vendor-rate">Hourly Rate ($) *</Label>
              <Input
                id="vendor-rate"
                type="number"
                value={newVendor.hourlyRate}
                onChange={(e) => setNewVendor({ ...newVendor, hourlyRate: e.target.value })}
                placeholder="500"
                data-testid="input-vendor-rate"
              />
            </div>
          </div>

          <Button
            onClick={addVendor}
            className="w-full mt-3"
            disabled={!newVendor.name || !newVendor.service || !newVendor.hourlyRate}
            data-testid="button-add-vendor"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Vendor Contract
          </Button>
        </Card>

        {/* Vendor List */}
        <div className="space-y-2">
          {vendors.map((vendor: any, index: number) => (
            <Card key={index} className="p-3" data-testid={`vendor-${index}`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-sm">{vendor.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {vendor.service} • ${vendor.hourlyRate}/hour
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeVendor(index)}
                  data-testid={`button-remove-vendor-${index}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* External Resource Roster */}
      <div className="space-y-2">
        <Label htmlFor="external-resources">External Resource Roster (On Retainer)</Label>
        <Input
          id="external-resources"
          value={Array.isArray(data?.externalResourceRoster) ? data.externalResourceRoster.join(', ') : ''}
          onChange={(e) => onChange({ ...data, externalResourceRoster: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })}
          placeholder="Crisis PR Firm, Forensic Accounting, Cybersecurity Response Team..."
          data-testid="input-external-resources"
        />
        <p className="text-xs text-muted-foreground">
          Pre-contracted firms available for immediate engagement
        </p>
      </div>
    </div>
  );
}
