import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Bell, Users, DollarSign, Shield, Zap, Clock } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import PageLayout from '@/components/layout/PageLayout';

export default function PlaybookSettings() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const { data: playbookData, isLoading } = useQuery<any>({
    queryKey: ['/api/playbook-library', id],
    queryFn: async () => {
      const response = await fetch(`/api/playbook-library/${id}`);
      if (!response.ok) throw new Error('Failed to fetch playbook');
      return response.json();
    },
    enabled: !!id,
  });

  const playbook = playbookData?.playbook;

  const [settings, setSettings] = useState({
    autoActivate: false,
    notifyOnTrigger: true,
    requireApproval: true,
    approvalThreshold: 1,
    syncPlatform: 'none',
    budgetLimit: '',
    executionTimeout: 12,
    escalationEnabled: true,
    escalationDelay: 5,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: typeof settings) => {
      return apiRequest('PATCH', `/api/playbook-library/${id}/settings`, newSettings);
    },
    onSuccess: () => {
      toast({
        title: 'Settings Saved',
        description: 'Playbook settings have been updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/playbook-library', id] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSave = () => {
    updateSettingsMutation.mutate(settings);
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </PageLayout>
    );
  }

  if (!playbook) {
    return (
      <PageLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Playbook not found</p>
          <Button asChild className="mt-4">
            <Link href="/playbook-library">Back to Library</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild data-testid="button-back">
              <Link href={`/playbook-library/${id}`}>
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Playbook Settings</h1>
              <p className="text-muted-foreground">{playbook.name}</p>
            </div>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={updateSettingsMutation.isPending}
            data-testid="button-save-settings"
          >
            <Save className="h-4 w-4 mr-2" />
            {updateSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Activation Settings
            </CardTitle>
            <CardDescription>
              Configure how this playbook is activated and executed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoActivate">Auto-Activate on Trigger</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically activate when trigger conditions are met
                </p>
              </div>
              <Switch
                id="autoActivate"
                checked={settings.autoActivate}
                onCheckedChange={(checked) => setSettings({ ...settings, autoActivate: checked })}
                data-testid="switch-auto-activate"
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="requireApproval">Require Approval</Label>
                <p className="text-sm text-muted-foreground">
                  Require executive approval before activation
                </p>
              </div>
              <Switch
                id="requireApproval"
                checked={settings.requireApproval}
                onCheckedChange={(checked) => setSettings({ ...settings, requireApproval: checked })}
                data-testid="switch-require-approval"
              />
            </div>

            {settings.requireApproval && (
              <div className="space-y-2 pl-6 border-l-2 border-muted">
                <Label htmlFor="approvalThreshold">Required Approvals</Label>
                <Select
                  value={String(settings.approvalThreshold)}
                  onValueChange={(value) => setSettings({ ...settings, approvalThreshold: Number(value) })}
                >
                  <SelectTrigger className="w-48" data-testid="select-approval-threshold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Approval</SelectItem>
                    <SelectItem value="2">2 Approvals</SelectItem>
                    <SelectItem value="3">3 Approvals</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="executionTimeout" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Execution Window (minutes)
              </Label>
              <Input
                id="executionTimeout"
                type="number"
                value={settings.executionTimeout}
                onChange={(e) => setSettings({ ...settings, executionTimeout: Number(e.target.value) })}
                className="w-48"
                min={5}
                max={60}
                data-testid="input-execution-timeout"
              />
              <p className="text-sm text-muted-foreground">
                Target time to complete all execution tasks (default: 12 minutes)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>
              Configure alerts and stakeholder notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifyOnTrigger">Notify on Trigger Detection</Label>
                <p className="text-sm text-muted-foreground">
                  Send alerts when trigger conditions are detected
                </p>
              </div>
              <Switch
                id="notifyOnTrigger"
                checked={settings.notifyOnTrigger}
                onCheckedChange={(checked) => setSettings({ ...settings, notifyOnTrigger: checked })}
                data-testid="switch-notify-trigger"
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="escalationEnabled">Enable Escalation</Label>
                <p className="text-sm text-muted-foreground">
                  Escalate to leadership if tasks are delayed
                </p>
              </div>
              <Switch
                id="escalationEnabled"
                checked={settings.escalationEnabled}
                onCheckedChange={(checked) => setSettings({ ...settings, escalationEnabled: checked })}
                data-testid="switch-escalation"
              />
            </div>

            {settings.escalationEnabled && (
              <div className="space-y-2 pl-6 border-l-2 border-muted">
                <Label htmlFor="escalationDelay">Escalation Delay (minutes)</Label>
                <Input
                  id="escalationDelay"
                  type="number"
                  value={settings.escalationDelay}
                  onChange={(e) => setSettings({ ...settings, escalationDelay: Number(e.target.value) })}
                  className="w-48"
                  min={1}
                  max={30}
                  data-testid="input-escalation-delay"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Integration Settings
            </CardTitle>
            <CardDescription>
              Connect with external project management tools
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="syncPlatform">Sync Platform</Label>
              <Select
                value={settings.syncPlatform}
                onValueChange={(value) => setSettings({ ...settings, syncPlatform: value })}
              >
                <SelectTrigger className="w-64" data-testid="select-sync-platform">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Integration</SelectItem>
                  <SelectItem value="jira">Jira</SelectItem>
                  <SelectItem value="asana">Asana</SelectItem>
                  <SelectItem value="monday">Monday.com</SelectItem>
                  <SelectItem value="ms_project">Microsoft Project</SelectItem>
                  <SelectItem value="servicenow">ServiceNow</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Automatically sync tasks to your project management platform on activation
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Budget Settings
            </CardTitle>
            <CardDescription>
              Configure pre-approved budget limits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="budgetLimit">Pre-Approved Budget Limit (USD)</Label>
              <Input
                id="budgetLimit"
                type="number"
                value={settings.budgetLimit}
                onChange={(e) => setSettings({ ...settings, budgetLimit: e.target.value })}
                placeholder={playbook.preApprovedBudget ? `Current: $${playbook.preApprovedBudget}` : 'Enter amount'}
                className="w-64"
                data-testid="input-budget-limit"
              />
              <p className="text-sm text-muted-foreground">
                Budget automatically unlocked when playbook is activated
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
