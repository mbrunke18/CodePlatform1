import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { 
  RefreshCw, 
  Check, 
  X, 
  Clock, 
  AlertTriangle,
  Cloud,
  CloudOff,
  Download,
  Settings,
  Play,
  Pause,
  Link2,
  FileSpreadsheet,
  FileJson,
  FileText,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Loader2,
  Plug,
  PlugZap,
} from 'lucide-react';
import { SiJira, SiAsana } from 'react-icons/si';
import { cn } from '@/lib/utils';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { format, formatDistanceToNow } from 'date-fns';

interface SyncManagerPanelProps {
  executionInstanceId?: string;
  scenarioId?: string;
  organizationId?: string;
  onExport?: (format: string, data: any) => void;
}

interface SyncPlatform {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface EnterpriseIntegration {
  id: string;
  organizationId: string;
  vendor: string;
  name: string;
  status: string;
  configuration: Record<string, any>;
  lastSyncAt?: Date;
  createdAt?: Date;
}

interface SyncRecord {
  id: string;
  executionInstanceId: string;
  platform: string;
  externalProjectId?: string;
  status: string;
  tasksMapped: number;
  lastSyncAt?: Date;
  errorMessage?: string;
}

const platformIcons: Record<string, any> = {
  jira: SiJira,
  asana: SiAsana,
  monday: () => <span className="font-bold text-sm">M</span>,
  ms_project: () => <span className="font-bold text-xs">MS</span>,
  servicenow: () => <span className="font-bold text-xs">SN</span>,
};

export function SyncManagerPanel({ 
  executionInstanceId, 
  scenarioId, 
  organizationId,
  onExport 
}: SyncManagerPanelProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('integrations');
  const [showAddIntegration, setShowAddIntegration] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [syncInProgress, setSyncInProgress] = useState<string | null>(null);
  
  const { data: platforms = [] } = useQuery<SyncPlatform[]>({
    queryKey: ['/api/sync/platforms'],
  });
  
  const { data: integrations = [], isLoading: loadingIntegrations } = useQuery<EnterpriseIntegration[]>({
    queryKey: ['/api/enterprise-integrations', organizationId],
    enabled: !!organizationId,
  });
  
  const { data: syncRecords = [] } = useQuery<SyncRecord[]>({
    queryKey: ['/api/sync/records', executionInstanceId],
    enabled: !!executionInstanceId,
  });
  
  const { data: exportFormats = [] } = useQuery<{ id: string; name: string; description: string; icon: string }[]>({
    queryKey: ['/api/export/formats'],
  });
  
  const testConnectionMutation = useMutation({
    mutationFn: async (integrationId: string) => {
      const response = await apiRequest('POST', `/api/enterprise-integrations/${integrationId}/test`);
      return response.json();
    },
    onSuccess: (data: any, integrationId) => {
      if (data.success) {
        toast({
          title: 'Connection Successful',
          description: data.message || 'Integration is connected and working.',
        });
        queryClient.invalidateQueries({ queryKey: ['/api/enterprise-integrations'] });
      } else {
        toast({
          title: 'Connection Failed',
          description: data.error || 'Unable to connect. Check your credentials.',
          variant: 'destructive',
        });
      }
    },
    onError: (error) => {
      toast({
        title: 'Connection Test Failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    },
  });
  
  const startSyncMutation = useMutation({
    mutationFn: async ({ integrationId, platform }: { integrationId: string; platform: string }) => {
      setSyncInProgress(integrationId);
      const response = await apiRequest('POST', '/api/sync/start', {
        integrationId,
        platform,
        executionInstanceId,
        organizationId,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setSyncInProgress(null);
      toast({
        title: 'Sync Started',
        description: `Syncing execution plan to ${data.platform || 'external platform'}...`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/sync/records'] });
    },
    onError: (error) => {
      setSyncInProgress(null);
      toast({
        title: 'Sync Failed',
        description: error instanceof Error ? error.message : 'Failed to start sync',
        variant: 'destructive',
      });
    },
  });
  
  const handleExport = async (format: string) => {
    if (!executionInstanceId) {
      toast({
        title: 'No Execution Selected',
        description: 'Please select an active execution to export.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      window.open(`/api/export/execution/${executionInstanceId}?format=${format}`, '_blank');
      toast({
        title: 'Export Started',
        description: `Downloading execution plan as ${format.toUpperCase()}...`,
      });
      setShowExportDialog(false);
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: error instanceof Error ? error.message : 'Failed to export',
        variant: 'destructive',
      });
    }
  };
  
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: any }> = {
      active: { variant: 'default', icon: CheckCircle2 },
      connected: { variant: 'default', icon: CheckCircle2 },
      synced: { variant: 'default', icon: Check },
      pending: { variant: 'secondary', icon: Clock },
      syncing: { variant: 'secondary', icon: RefreshCw },
      failed: { variant: 'destructive', icon: XCircle },
      error: { variant: 'destructive', icon: AlertTriangle },
      disconnected: { variant: 'outline', icon: CloudOff },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className={cn("h-3 w-3", status === 'syncing' && "animate-spin")} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };
  
  const renderPlatformIcon = (platform: string) => {
    const IconComponent = platformIcons[platform];
    if (IconComponent) {
      return <IconComponent className="h-5 w-5" />;
    }
    return <Cloud className="h-5 w-5" />;
  };
  
  const renderIntegrations = () => {
    if (loadingIntegrations) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      );
    }
    
    if (integrations.length === 0) {
      return (
        <div className="text-center py-8 space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <Plug className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-medium">No Integrations Connected</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Connect your project management tools to enable automatic sync
            </p>
          </div>
          <Button onClick={() => setShowAddIntegration(true)} data-testid="button-add-first-integration">
            <PlugZap className="h-4 w-4 mr-2" />
            Connect Integration
          </Button>
        </div>
      );
    }
    
    return (
      <div className="space-y-3">
        {integrations.map((integration) => (
          <div 
            key={integration.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            data-testid={`integration-item-${integration.id}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                {renderPlatformIcon(integration.vendor)}
              </div>
              <div>
                <h4 className="font-medium">{integration.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {platforms.find(p => p.id === integration.vendor)?.description || integration.vendor}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(integration.status)}
              {integration.lastSyncAt && (
                <span className="text-xs text-muted-foreground">
                  Last sync: {formatDistanceToNow(new Date(integration.lastSyncAt), { addSuffix: true })}
                </span>
              )}
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => testConnectionMutation.mutate(integration.id)}
                  disabled={testConnectionMutation.isPending}
                  data-testid={`button-test-connection-${integration.id}`}
                >
                  {testConnectionMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startSyncMutation.mutate({ 
                    integrationId: integration.id, 
                    platform: integration.vendor 
                  })}
                  disabled={syncInProgress === integration.id || !executionInstanceId}
                  data-testid={`button-sync-${integration.id}`}
                >
                  {syncInProgress === integration.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Sync Now
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        <Button 
          variant="outline" 
          className="w-full mt-4"
          onClick={() => setShowAddIntegration(true)}
          data-testid="button-add-integration"
        >
          <PlugZap className="h-4 w-4 mr-2" />
          Add Integration
        </Button>
      </div>
    );
  };
  
  const renderSyncHistory = () => {
    if (syncRecords.length === 0) {
      return (
        <div className="text-center py-8">
          <Clock className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
          <h3 className="font-medium">No Sync History</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Sync records will appear here after your first sync
          </p>
        </div>
      );
    }
    
    return (
      <ScrollArea className="h-[400px]">
        <div className="space-y-2">
          {syncRecords.map((record) => (
            <div 
              key={record.id}
              className="flex items-center justify-between p-3 border rounded-lg"
              data-testid={`sync-record-${record.id}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                  {renderPlatformIcon(record.platform)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {platforms.find(p => p.id === record.platform)?.name || record.platform}
                    </span>
                    {getStatusBadge(record.status)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {record.tasksMapped} tasks synced
                    {record.externalProjectId && ` • Project: ${record.externalProjectId}`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                {record.lastSyncAt && (
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(record.lastSyncAt), 'MMM d, h:mm a')}
                  </span>
                )}
                {record.errorMessage && (
                  <p className="text-xs text-destructive mt-1">{record.errorMessage}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  };
  
  const renderExportOptions = () => {
    const exportIcons: Record<string, any> = {
      csv: FileSpreadsheet,
      xlsx: FileSpreadsheet,
      json: FileJson,
      ms_project_xml: FileText,
    };
    
    return (
      <div className="grid grid-cols-2 gap-3">
        {exportFormats.map((format) => {
          const Icon = exportIcons[format.id] || FileText;
          return (
            <Button
              key={format.id}
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => handleExport(format.id)}
              data-testid={`button-export-${format.id}`}
            >
              <Icon className="h-6 w-6" />
              <span className="font-medium">{format.name}</span>
              <span className="text-xs text-muted-foreground text-center">
                {format.description}
              </span>
            </Button>
          );
        })}
      </div>
    );
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              Execution Sync Manager
            </CardTitle>
            <CardDescription>
              Sync execution plans to external project management tools
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowExportDialog(true)}
              disabled={!executionInstanceId}
              data-testid="button-open-export"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="integrations" data-testid="tab-integrations">
              <Link2 className="h-4 w-4 mr-2" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="history" data-testid="tab-history">
              <Clock className="h-4 w-4 mr-2" />
              Sync History
            </TabsTrigger>
            <TabsTrigger value="settings" data-testid="tab-settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="integrations" className="mt-4">
            {renderIntegrations()}
          </TabsContent>
          
          <TabsContent value="history" className="mt-4">
            {renderSyncHistory()}
          </TabsContent>
          
          <TabsContent value="settings" className="mt-4 space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">Sync Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-sync">Automatic Sync</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically sync changes when tasks are updated
                    </p>
                  </div>
                  <Switch id="auto-sync" data-testid="switch-auto-sync" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="bi-directional">Bi-directional Sync</Label>
                    <p className="text-sm text-muted-foreground">
                      Pull updates from external platforms back into M
                    </p>
                  </div>
                  <Switch id="bi-directional" data-testid="switch-bi-directional" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sync-comments">Sync Comments</Label>
                    <p className="text-sm text-muted-foreground">
                      Include task comments in sync operations
                    </p>
                  </div>
                  <Switch id="sync-comments" data-testid="switch-sync-comments" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Default Export Format</h3>
              <Select defaultValue="csv">
                <SelectTrigger data-testid="select-default-format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  {exportFormats.map((format) => (
                    <SelectItem key={format.id} value={format.id}>
                      {format.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <Dialog open={showAddIntegration} onOpenChange={setShowAddIntegration}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Integration</DialogTitle>
            <DialogDescription>
              Select a platform to connect for execution plan sync
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => {
                  setSelectedPlatform(platform.id);
                  setShowAddIntegration(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors text-left",
                  selectedPlatform === platform.id && "border-primary bg-primary/5"
                )}
                data-testid={`platform-option-${platform.id}`}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  {renderPlatformIcon(platform.id)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{platform.name}</h4>
                  <p className="text-sm text-muted-foreground">{platform.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Execution Plan</DialogTitle>
            <DialogDescription>
              Choose a format to download your execution plan
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {renderExportOptions()}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
