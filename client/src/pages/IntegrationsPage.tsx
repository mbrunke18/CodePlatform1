import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import PageLayout from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Cloud, 
  CheckCircle2, 
  Circle, 
  AlertCircle,
  Settings,
  Zap,
  MessageSquare,
  Calendar,
  Users,
  FileText,
  Database
} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  vendor: string;
  category: string;
  description: string;
  capabilities: string[];
  logo: string;
  status: 'available' | 'coming_soon';
}

interface ConnectedIntegration {
  id: string;
  name: string;
  integrationType: string;
  vendor: string;
  status: string;
  lastSyncAt: string | null;
  createdAt: string;
}

const categoryIcons = {
  project_management: FileText,
  communication: MessageSquare,
  scheduling: Calendar,
  directory: Users,
  crm: Database,
};

const categoryColors = {
  project_management: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  communication: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  scheduling: "bg-green-500/10 text-green-600 dark:text-green-400",
  directory: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  crm: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
};

export default function IntegrationsPage() {
  const { toast } = useToast();
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionConfig, setConnectionConfig] = useState({
    apiKey: '',
    apiUrl: '',
  });

  // Get organization ID from user context
  const organizationId = "demo-org-1";

  // Fetch available integrations from marketplace
  const { data: marketplaceData } = useQuery<Integration[]>({
    queryKey: ['/api/integrations/marketplace'],
  });
  const marketplace = marketplaceData ?? [];

  // Fetch connected integrations
  const { data: connectedData } = useQuery<ConnectedIntegration[]>({
    queryKey: ['/api/integrations/enterprise', organizationId],
  });
  const connectedIntegrations = connectedData ?? [];

  // Connect integration mutation
  const connectMutation = useMutation({
    mutationFn: async (integration: Integration) => {
      return await apiRequest('POST', '/api/integrations/enterprise/connect', {
        organizationId,
        name: integration.name,
        integrationType: integration.category,
        vendor: integration.vendor,
        credentials: {
          type: 'api_key',
          data: {
            api_key: connectionConfig.apiKey,
            api_url: connectionConfig.apiUrl,
          },
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/integrations/enterprise', organizationId] });
      toast({
        title: "Integration Connected",
        description: `${selectedIntegration?.name} has been successfully connected.`,
      });
      setSelectedIntegration(null);
      setConnectionConfig({ apiKey: '', apiUrl: '' });
    },
    onError: (error: Error) => {
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Disconnect integration mutation
  const disconnectMutation = useMutation({
    mutationFn: async (integrationId: string) => {
      return await apiRequest('POST', `/api/integrations/enterprise/${integrationId}/disconnect`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/integrations/enterprise', organizationId] });
      toast({
        title: "Integration Disconnected",
        description: "The integration has been disconnected successfully.",
      });
    },
  });

  const isConnected = (integrationId: string) => {
    return connectedIntegrations.some(ci => ci.vendor === integrationId);
  };

  const getConnectedIntegration = (integrationId: string) => {
    return connectedIntegrations.find(ci => ci.vendor === integrationId);
  };

  const handleConnect = (integration: Integration) => {
    setSelectedIntegration(integration);
    setIsConnecting(true);
  };

  const handleDisconnect = (integrationId: string) => {
    const connected = connectedIntegrations.find(ci => ci.id === integrationId);
    if (connected) {
      disconnectMutation.mutate(connected.id);
    }
  };

  const handleSubmitConnection = () => {
    if (selectedIntegration) {
      connectMutation.mutate(selectedIntegration);
    }
  };

  return (
    <PageLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <Badge className="mb-4 bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30">
            Enterprise Integrations
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            M Orchestrates Your Stack
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            M doesn't replace your workflow tools — it coordinates them. When a playbook 
            activates, M tells each system exactly what to do.
          </p>
        </div>

        {/* Integration Philosophy */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">M Orchestrates</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Strategic playbooks trigger coordinated actions across your entire stack</p>
          </Card>
          <Card className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Tools Execute</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">ServiceNow, Jira, Slack, and Teams carry out the operational work</p>
          </Card>
          <Card className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Everything Syncs</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Bi-directional updates keep M and your tools in perfect alignment</p>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Connected</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {connectedIntegrations.filter(i => i.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Available</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {marketplace.filter(i => i.status === 'available').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Cloud className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Coming Soon</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {marketplace.filter(i => i.status === 'coming_soon').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-500/10 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Integration Categories */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <TabsTrigger value="all" data-testid="tab-all">All Integrations</TabsTrigger>
            <TabsTrigger value="connected" data-testid="tab-connected">Connected</TabsTrigger>
            <TabsTrigger value="available" data-testid="tab-available">Available</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketplace.map((integration) => {
                const connected = isConnected(integration.id);
                const connectedData = getConnectedIntegration(integration.id);
                const Icon = categoryIcons[integration.category as keyof typeof categoryIcons];
                const colorClass = categoryColors[integration.category as keyof typeof categoryColors];

                return (
                  <Card key={integration.id} className="p-6 hover:shadow-lg transition-shadow" data-testid={`card-integration-${integration.id}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClass}`}>
                        {Icon && <Icon className="w-6 h-6" />}
                      </div>
                      {connected ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Connected
                        </Badge>
                      ) : integration.status === 'coming_soon' ? (
                        <Badge variant="outline" className="bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20">
                          Coming Soon
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
                          <Circle className="w-3 h-3 mr-1" />
                          Available
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {integration.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {integration.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {integration.capabilities.slice(0, 3).map((capability) => (
                        <Badge key={capability} variant="secondary" className="text-xs">
                          {capability.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>

                    {connected ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                          <span>Status:</span>
                          <span className="font-medium">{connectedData?.status}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            data-testid={`button-settings-${integration.id}`}
                          >
                            <Settings className="w-4 h-4 mr-1" />
                            Settings
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => connectedData && handleDisconnect(connectedData.id)}
                            data-testid={`button-disconnect-${integration.id}`}
                          >
                            Disconnect
                          </Button>
                        </div>
                      </div>
                    ) : integration.status === 'available' ? (
                      <Button
                        className="w-full"
                        onClick={() => handleConnect(integration)}
                        data-testid={`button-connect-${integration.id}`}
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Connect
                      </Button>
                    ) : (
                      <Button className="w-full" disabled data-testid={`button-coming-soon-${integration.id}`}>
                        Coming Soon
                      </Button>
                    )}
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="connected" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketplace.filter(i => isConnected(i.id)).map((integration) => {
                const Icon = categoryIcons[integration.category as keyof typeof categoryIcons];
                const colorClass = categoryColors[integration.category as keyof typeof categoryColors];
                const connectedData = getConnectedIntegration(integration.id);

                return (
                  <Card key={integration.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClass}`}>
                        {Icon && <Icon className="w-6 h-6" />}
                      </div>
                      <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {integration.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {integration.description}
                    </p>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Settings className="w-4 h-4 mr-1" />
                        Settings
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => connectedData && handleDisconnect(connectedData.id)}
                      >
                        Disconnect
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="available" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketplace.filter(i => !isConnected(i.id) && i.status === 'available').map((integration) => {
                const Icon = categoryIcons[integration.category as keyof typeof categoryIcons];
                const colorClass = categoryColors[integration.category as keyof typeof categoryColors];

                return (
                  <Card key={integration.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClass}`}>
                        {Icon && <Icon className="w-6 h-6" />}
                      </div>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
                        Available
                      </Badge>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {integration.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {integration.description}
                    </p>

                    <Button className="w-full" onClick={() => handleConnect(integration)}>
                      <Zap className="w-4 h-4 mr-2" />
                      Connect
                    </Button>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Connection Dialog */}
        <Dialog open={isConnecting} onOpenChange={setIsConnecting}>
          <DialogContent data-testid="dialog-connection">
            <DialogHeader>
              <DialogTitle>Connect {selectedIntegration?.name}</DialogTitle>
              <DialogDescription>
                Enter your credentials to connect {selectedIntegration?.name} to M.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  placeholder="Enter your API key"
                  value={connectionConfig.apiKey}
                  onChange={(e) => setConnectionConfig({ ...connectionConfig, apiKey: e.target.value })}
                  data-testid="input-api-key"
                />
              </div>

              <div>
                <Label htmlFor="apiUrl">API URL (optional)</Label>
                <Input
                  id="apiUrl"
                  placeholder="https://api.example.com"
                  value={connectionConfig.apiUrl}
                  onChange={(e) => setConnectionConfig({ ...connectionConfig, apiUrl: e.target.value })}
                  data-testid="input-api-url"
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="text-sm text-blue-800 dark:text-blue-300">
                    <p className="font-medium mb-1">Secure Connection</p>
                    <p>Your credentials are encrypted and stored securely. They are only used to authenticate with {selectedIntegration?.name}.</p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsConnecting(false)} data-testid="button-cancel">
                Cancel
              </Button>
              <Button
                onClick={handleSubmitConnection}
                disabled={!connectionConfig.apiKey || connectMutation.isPending}
                data-testid="button-connect-submit"
              >
                {connectMutation.isPending ? 'Connecting...' : 'Connect'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  );
}
