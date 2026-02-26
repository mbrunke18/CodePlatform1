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
  project_management: "bg-[#0A0F2E]/10 text-[#0A0F2E]",
  communication: "bg-[#DFC178]/10 text-[#C9A84C]",
  scheduling: "bg-[#2B8A6E]/10 text-[#2B8A6E]",
  directory: "bg-[#C9A84C]/10 text-[#0A0F2E]",
  crm: "bg-[#141B45]/10 text-[#141B45]",
};

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const GOLD_LT = "#DFC178";

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
          <Badge className="mb-4 bg-[#0A0F2E]/10 text-[#0A0F2E] border-[#0A0F2E]/20">
            Enterprise Integrations
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-[#0A0F2E]">
            Execution OS Orchestrates Your Stack
          </h1>
          <p className="mt-2 text-lg text-[#6B7280]">
            Execution OS doesn't replace your workflow tools — it coordinates them. When a playbook 
            activates, Execution OS tells each system exactly what to do.
          </p>
        </div>

        {/* Integration Philosophy */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 text-center border-[#E8E4DC] bg-white">
            <div className="w-12 h-12 mx-auto mb-4 bg-[#0A0F2E]/10 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-[#0A0F2E]" />
            </div>
            <h3 className="font-semibold text-[#0A0F2E] mb-2">Execution OS Orchestrates</h3>
            <p className="text-sm text-[#6B7280]">Strategic playbooks trigger coordinated actions across your entire stack</p>
          </Card>
          <Card className="p-6 text-center border-[#E8E4DC] bg-white">
            <div className="w-12 h-12 mx-auto mb-4 bg-[#C9A84C]/10 rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6 text-[#C9A84C]" />
            </div>
            <h3 className="font-semibold text-[#0A0F2E] mb-2">Tools Execute</h3>
            <p className="text-sm text-[#6B7280]">ServiceNow, Jira, Slack, and Teams carry out the operational work</p>
          </Card>
          <Card className="p-6 text-center border-[#E8E4DC] bg-white">
            <div className="w-12 h-12 mx-auto mb-4 bg-[#2B8A6E]/10 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-[#2B8A6E]" />
            </div>
            <h3 className="font-semibold text-[#0A0F2E] mb-2">Everything Syncs</h3>
            <p className="text-sm text-[#6B7280]">Bi-directional updates keep Execution OS and your tools in perfect alignment</p>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 border-[#E8E4DC] bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280]">Connected</p>
                <p className="text-2xl font-bold text-[#0A0F2E]">
                  {connectedIntegrations.filter(i => i.status === 'active').length}
                </p>
              </div>
              <div className={`w-12 h-12 bg-[${TEAL}]/10 rounded-lg flex items-center justify-center`}>
                <CheckCircle2 className={`w-6 h-6 text-[${TEAL}]`} />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-[#E8E4DC] bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280]">Available</p>
                <p className="text-2xl font-bold text-[#0A0F2E]">
                  {marketplace.filter(i => i.status === 'available').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-[#C9A84C]/10 rounded-lg flex items-center justify-center">
                <Cloud className="w-6 h-6 text-[#C9A84C]" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-[#E8E4DC] bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280]">Coming Soon</p>
                <p className="text-2xl font-bold text-[#0A0F2E]">
                  {marketplace.filter(i => i.status === 'coming_soon').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-[#0A0F2E]/10 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-[#0A0F2E]" />
              </div>
            </div>
          </Card>
        </div>

        {/* Integration Categories */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-white border border-[#E8E4DC] rounded-none">
            <TabsTrigger value="all" data-testid="tab-all" className="data-[state=active]:bg-[#F8F7F4] data-[state=active]:text-[#0A0F2E] rounded-none">All Integrations</TabsTrigger>
            <TabsTrigger value="connected" data-testid="tab-connected" className="data-[state=active]:bg-[#F8F7F4] data-[state=active]:text-[#0A0F2E] rounded-none">Connected</TabsTrigger>
            <TabsTrigger value="available" data-testid="tab-available" className="data-[state=active]:bg-[#F8F7F4] data-[state=active]:text-[#0A0F2E] rounded-none">Available</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketplace.map((integration) => {
                const connected = isConnected(integration.id);
                const connectedData = getConnectedIntegration(integration.id);
                const Icon = categoryIcons[integration.category as keyof typeof categoryIcons];
                const colorClass = categoryColors[integration.category as keyof typeof categoryColors];

                return (
                  <Card key={integration.id} className="p-6 hover:shadow-lg transition-shadow border-[#E8E4DC] bg-white" data-testid={`card-integration-${integration.id}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClass}`}>
                        {Icon && <Icon className="w-6 h-6" />}
                      </div>
                      {connected ? (
                        <Badge variant="outline" className={`bg-[${TEAL}]/10 text-[${TEAL}] border-[${TEAL}]/20`}>
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Connected
                        </Badge>
                      ) : integration.status === 'coming_soon' ? (
                        <Badge variant="outline" className="bg-[#F8F7F4] text-[#6B7280] border-[#E8E4DC]">
                          Coming Soon
                        </Badge>
                      ) : (
                        <Badge variant="outline" className={`bg-[${GOLD_LT}]/10 text-[${GOLD}] border-[${GOLD_LT}]/20`}>
                          <Circle className="w-3 h-3 mr-1" />
                          Available
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold text-[#0A0F2E] mb-2">
                      {integration.name}
                    </h3>
                    <p className="text-sm text-[#6B7280] mb-4">
                      {integration.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {integration.capabilities.slice(0, 3).map((capability) => (
                        <Badge key={capability} variant="secondary" className="text-xs bg-[#F8F7F4] text-[#0A0F2E]">
                          {capability.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>

                    {connected ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-[#6B7280]">
                          <span>Status:</span>
                          <span className="font-medium">{connectedData?.status}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-[#E8E4DC] text-[#0A0F2E] hover:bg-[#F8F7F4]"
                            data-testid={`button-settings-${integration.id}`}
                          >
                            <Settings className="w-4 h-4 mr-1" />
                            Settings
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#E8E4DC] text-[#0A0F2E] hover:bg-[#F8F7F4]"
                            onClick={() => connectedData && handleDisconnect(connectedData.id)}
                            data-testid={`button-disconnect-${integration.id}`}
                          >
                            Disconnect
                          </Button>
                        </div>
                      </div>
                    ) : integration.status === 'available' ? (
                      <Button
                        className="w-full bg-[#0A0F2E] text-white hover:bg-[#141B45]"
                        onClick={() => handleConnect(integration)}
                        data-testid={`button-connect-${integration.id}`}
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Connect
                      </Button>
                    ) : (
                      <Button className="w-full bg-[#F8F7F4] text-[#6B7280]" disabled data-testid={`button-coming-soon-${integration.id}`}>
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
                  <Card key={integration.id} className="p-6 rounded-none">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-none flex items-center justify-center ${colorClass}`}>
                        {Icon && <Icon className="w-6 h-6" />}
                      </div>
                      <Badge variant="outline" className={`bg-[${TEAL}]/10 text-[${TEAL}] border-[${TEAL}]/20 rounded-none`}>
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {integration.name}
                    </h3>
                    <p className="text-sm text-gray-800 dark:text-gray-200 mb-4">
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
                  <Card key={integration.id} className="p-6 rounded-none">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-none flex items-center justify-center ${colorClass}`}>
                        {Icon && <Icon className="w-6 h-6" />}
                      </div>
                      <Badge variant="outline" className="bg-[#0A0F2E]/10 text-[#0A0F2E] border-[#0A0F2E]/20 rounded-none">
                        Available
                      </Badge>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {integration.name}
                    </h3>
                    <p className="text-sm text-gray-800 dark:text-gray-200 mb-4">
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
                Enter your credentials to connect {selectedIntegration?.name} to Execution OS.
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

              <div className="bg-[#0A0F2E] dark:bg-[#0A0F2E]/20 border border-[#0A0F2E] dark:border-[#0A0F2E] rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#0A0F2E] dark:text-[#0A0F2E] mt-0.5" />
                  <div className="text-sm text-[#0A0F2E] dark:text-blue-300">
                    <p className="font-medium mb-1">Secure Connection</p>
                    <p>Your credentials are encrypted and stored securely. They are only used to authenticate with {selectedIntegration?.name}.</p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" className="rounded-none border-[#E8E4DC] text-[#0A0F2E] hover:bg-[#F8F7F4]" onClick={() => setIsConnecting(false)} data-testid="button-cancel">
                Cancel
              </Button>
              <Button
                onClick={handleSubmitConnection}
                className="rounded-none bg-[#0A0F2E] text-white hover:bg-[#141B45]"
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
