import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Plus, Trash2, Crown, Target, UserCheck, Eye, Shield } from 'lucide-react';

interface StakeholderMatrixPhaseProps {
  data: any;
  onChange: (updates: any) => void;
}

const STAKEHOLDER_ROLES = [
  { value: 'sponsor', label: 'Executive Sponsor', icon: Crown, description: 'Decision authority & budget owner' },
  { value: 'owner', label: 'Accountable Owner', icon: Target, description: 'Execution lead & primary coordinator' },
  { value: 'contributor', label: 'Key Contributor', icon: UserCheck, description: 'Active participant in execution' },
  { value: 'informed', label: 'Informed', icon: Eye, description: 'Needs updates but not active role' },
  { value: 'approver', label: 'Approver', icon: Shield, description: 'Must approve before execution' },
];

const INFLUENCE_LEVELS = [
  { value: 'critical', label: 'Critical', color: 'text-red-400' },
  { value: 'high', label: 'High', color: 'text-orange-400' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-400' },
  { value: 'low', label: 'Low', color: 'text-gray-400' },
];

export default function StakeholderMatrixPhase({ data, onChange }: StakeholderMatrixPhaseProps) {
  const [newStakeholder, setNewStakeholder] = useState({
    name: '',
    title: '',
    email: '',
    role: 'contributor' as const,
    influenceLevel: 'medium' as const,
    isExecutiveSponsor: false,
    isAccountableOwner: false,
  });

  const addStakeholder = () => {
    if (newStakeholder.name && newStakeholder.title) {
      const stakeholders = [...(data.stakeholders || []), { ...newStakeholder, id: Date.now() }];
      onChange({ stakeholders });
      setNewStakeholder({
        name: '',
        title: '',
        email: '',
        role: 'contributor',
        influenceLevel: 'medium',
        isExecutiveSponsor: false,
        isAccountableOwner: false,
      });
    }
  };

  const removeStakeholder = (id: number) => {
    const stakeholders = (data.stakeholders || []).filter((s: any) => s.id !== id);
    onChange({ stakeholders });
  };

  const hasExecutiveSponsor = (data.stakeholders || []).some((s: any) => s.isExecutiveSponsor);
  const hasAccountableOwner = (data.stakeholders || []).some((s: any) => s.isAccountableOwner);

  return (
    <div className="space-y-6">
      {/* Required Roles Alert */}
      {(!hasExecutiveSponsor || !hasAccountableOwner) && (
        <Card className="border-yellow-500/30 bg-yellow-950/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-yellow-400 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-300 font-medium">Required Roles Missing</p>
                <p className="text-xs text-gray-400 mt-1">
                  Every scenario needs an <strong>Executive Sponsor</strong> (decision authority) and 
                  an <strong>Accountable Owner</strong> (execution lead) for 12-minute activation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Stakeholder Form */}
      <Card className="border-blue-500/30 bg-slate-900/50">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <Plus className="h-5 w-5 text-blue-400" />
            Add Stakeholder
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stakeholder-name" className="text-white">Name *</Label>
              <Input
                id="stakeholder-name"
                data-testid="input-stakeholder-name"
                placeholder="e.g., Sarah Chen"
                value={newStakeholder.name}
                onChange={(e) => setNewStakeholder({ ...newStakeholder, name: e.target.value })}
                className="bg-slate-800 border-slate-600 text-white mt-2"
              />
            </div>

            <div>
              <Label htmlFor="stakeholder-title" className="text-white">Title *</Label>
              <Input
                id="stakeholder-title"
                data-testid="input-stakeholder-title"
                placeholder="e.g., COO"
                value={newStakeholder.title}
                onChange={(e) => setNewStakeholder({ ...newStakeholder, title: e.target.value })}
                className="bg-slate-800 border-slate-600 text-white mt-2"
              />
            </div>

            <div>
              <Label htmlFor="stakeholder-email" className="text-white">Email</Label>
              <Input
                id="stakeholder-email"
                data-testid="input-stakeholder-email"
                type="email"
                placeholder="e.g., sarah.chen@company.com"
                value={newStakeholder.email}
                onChange={(e) => setNewStakeholder({ ...newStakeholder, email: e.target.value })}
                className="bg-slate-800 border-slate-600 text-white mt-2"
              />
            </div>

            <div>
              <Label htmlFor="stakeholder-role" className="text-white">Role *</Label>
              <Select 
                value={newStakeholder.role} 
                onValueChange={(value: any) => setNewStakeholder({ ...newStakeholder, role: value })}
              >
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white mt-2" data-testid="select-stakeholder-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STAKEHOLDER_ROLES.map((role) => {
                    const Icon = role.icon;
                    return (
                      <SelectItem key={role.value} value={role.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{role.label}</div>
                            <div className="text-xs text-gray-500">{role.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="stakeholder-influence" className="text-white">Influence Level</Label>
              <Select 
                value={newStakeholder.influenceLevel} 
                onValueChange={(value: any) => setNewStakeholder({ ...newStakeholder, influenceLevel: value })}
              >
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white mt-2" data-testid="select-influence-level">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INFLUENCE_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      <span className={level.color}>{level.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4 md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newStakeholder.isExecutiveSponsor}
                  onChange={(e) => setNewStakeholder({ ...newStakeholder, isExecutiveSponsor: e.target.checked })}
                  className="rounded border-slate-600"
                  data-testid="checkbox-executive-sponsor"
                />
                <span className="text-sm text-white">Executive Sponsor</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newStakeholder.isAccountableOwner}
                  onChange={(e) => setNewStakeholder({ ...newStakeholder, isAccountableOwner: e.target.checked })}
                  className="rounded border-slate-600"
                  data-testid="checkbox-accountable-owner"
                />
                <span className="text-sm text-white">Accountable Owner</span>
              </label>
            </div>
          </div>

          <Button
            onClick={addStakeholder}
            disabled={!newStakeholder.name || !newStakeholder.title}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
            data-testid="button-add-stakeholder"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Stakeholder
          </Button>
        </CardContent>
      </Card>

      {/* Stakeholder List */}
      {data.stakeholders && data.stakeholders.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-blue-400" />
            Stakeholder Matrix ({data.stakeholders.length})
          </h3>

          <div className="space-y-3">
            {data.stakeholders.map((stakeholder: any) => {
              const roleConfig = STAKEHOLDER_ROLES.find(r => r.value === stakeholder.role);
              const RoleIcon = roleConfig?.icon || Users;
              const influenceConfig = INFLUENCE_LEVELS.find(l => l.value === stakeholder.influenceLevel);

              return (
                <Card key={stakeholder.id} className="border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <RoleIcon className="h-4 w-4 text-blue-400" />
                          <h4 className="font-semibold text-white">{stakeholder.name}</h4>
                          {stakeholder.isExecutiveSponsor && (
                            <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/50 text-xs">
                              <Crown className="h-3 w-3 mr-1" />
                              Sponsor
                            </Badge>
                          )}
                          {stakeholder.isAccountableOwner && (
                            <Badge className="bg-green-600/20 text-green-300 border-green-500/50 text-xs">
                              <Target className="h-3 w-3 mr-1" />
                              Owner
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-400 space-y-1">
                          <p>{stakeholder.title}</p>
                          {stakeholder.email && <p className="text-xs">{stakeholder.email}</p>}
                          <div className="flex items-center gap-3 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {roleConfig?.label || stakeholder.role}
                            </Badge>
                            <span className={`text-xs ${influenceConfig?.color || 'text-gray-400'}`}>
                              {influenceConfig?.label || stakeholder.influenceLevel} Influence
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStakeholder(stakeholder.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-950/20"
                        data-testid={`button-remove-stakeholder-${stakeholder.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
