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
  communication: "bg-[#C9A84C]/10 text-[#C9A84C]",
  scheduling: "bg-[#2B8A6E]/10 text-[#2B8A6E]",
  directory: "bg-[#0A0F2E]/10 text-[#0A0F2E]",
  crm: "bg-[#C9A84C]/10 text-[#C9A84C]",
};

const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

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
      <div className="flex-1 bg-[#F8F7F4] overflow-y-auto" data-testid="integrations-page">
        {/* Navy Hero Section */}
        <div style={{ background: "#0A0F2E", padding: "80px 48px", position: "relative", overflow: "hidden", minHeight: 360 }}>
          <div style={{ 
            position: "absolute", 
            inset: 0, 
            backgroundImage: "radial-gradient(#C9A84C 0.5px, transparent 0.5px)", 
            backgroundSize: "32px 32px",
            opacity: 0.1
          }} />
          <div className="max-w-7xl mx-auto relative z-10">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <div style={{ width: 28, height: 2, background: "#C9A84C", flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.4em", textTransform: "uppercase" as const, color: "#C9A84C" }}>Enterprise Infrastructure</span>
            </div>
            <div className="max-w-3xl">
              <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(48px,6vw,72px)", lineHeight: 1, color: "#fff", marginBottom: 24 }}>
                Readiness OS <em style={{ fontStyle: "italic", color: "#DFC178" }}>Orchestration</em>
              </h1>
              <p className="text-white/60 text-xl leading-relaxed max-w-2xl">
                Readiness OS doesn't replace your workflow tools — it coordinates them. When a prepared response 
                activates, Readiness OS tells each system exactly what to do.
              </p>
            </div>
          </div>
        </div>

        <div className="p-12 max-w-7xl mx-auto space-y-12">
          {/* Integration Philosophy */}
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 rounded-none border-[#E8E4DC] bg-white hover:border-[#C9A84C] transition-colors">
              <div style={{ width: 28, height: 1, background: '#C9A84C', marginBottom: 20 }} />
              <h3 style={CG} className="text-2xl font-bold text-[#0A0F2E] mb-3">Readiness OS Orchestrates</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">Strategic prepared responses trigger coordinated actions across your entire enterprise stack.</p>
            </Card>
            <Card className="p-8 rounded-none border-[#E8E4DC] bg-white hover:border-[#C9A84C] transition-colors">
              <div style={{ width: 28, height: 1, background: '#C9A84C', marginBottom: 20 }} />
              <h3 style={CG} className="text-2xl font-bold text-[#0A0F2E] mb-3">Tools Execute</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">ServiceNow, Jira, Slack, and Teams carry out the operational work directed by Readiness OS.</p>
            </Card>
            <Card className="p-8 rounded-none border-[#E8E4DC] bg-white hover:border-[#C9A84C] transition-colors">
              <div style={{ width: 28, height: 1, background: '#2B8A6E', marginBottom: 20 }} />
              <h3 style={CG} className="text-2xl font-bold text-[#0A0F2E] mb-3">Everything Syncs</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">Bi-directional updates keep Readiness OS and your tools in perfect strategic alignment.</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 border-[#E8E4DC] bg-white rounded-none">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280] mb-1">Connected</p>
                  <p style={CG} className="text-4xl font-bold text-[#0A0F2E]">
                    {connectedIntegrations.filter(i => i.status === 'active').length}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-[#E8E4DC] bg-white rounded-none">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280] mb-1">Available</p>
                  <p style={CG} className="text-4xl font-bold text-[#0A0F2E]">
                    {marketplace.filter(i => i.status === 'available').length}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-[#E8E4DC] bg-white rounded-none">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280] mb-1">Coming Soon</p>
                  <p style={CG} className="text-4xl font-bold text-[#0A0F2E]">
                    {marketplace.filter(i => i.status === 'coming_soon').length}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Integration Categories */}
          <Tabs defaultValue="all" className="w-full space-y-12">
            <TabsList className="bg-transparent border-b border-[#E8E4DC] rounded-none h-auto p-0 gap-12">
              <TabsTrigger value="all" data-testid="tab-all" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#C9A84C] data-[state=active]:text-[#0A0F2E] rounded-none px-0 py-5 text-[10px] font-bold tracking-[0.25em] uppercase text-[#6B7280]">All Integrations</TabsTrigger>
              <TabsTrigger value="connected" data-testid="tab-connected" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#C9A84C] data-[state=active]:text-[#0A0F2E] rounded-none px-0 py-5 text-[10px] font-bold tracking-[0.25em] uppercase text-[#6B7280]">Connected</TabsTrigger>
              <TabsTrigger value="available" data-testid="tab-available" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#C9A84C] data-[state=active]:text-[#0A0F2E] rounded-none px-0 py-5 text-[10px] font-bold tracking-[0.25em] uppercase text-[#6B7280]">Available</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {marketplace.map((integration) => {
                  const connected = isConnected(integration.id);
                  const connectedData = getConnectedIntegration(integration.id);
                  const Icon = categoryIcons[integration.category as keyof typeof categoryIcons];
                  const colorClass = categoryColors[integration.category as keyof typeof categoryColors];

                  return (
                    <Card key={integration.id} className="p-8  border-[#E8E4DC] bg-white rounded-none" data-testid={`card-integration-${integration.id}`}>
                      <div className="flex items-start justify-between mb-6">
                        {connected ? (
                          <Badge variant="outline" className="bg-[#2B8A6E]/10 text-[#2B8A6E] border-[#2B8A6E]/20 rounded-none px-3 py-1 text-[9px] font-bold tracking-widest uppercase">
                            CONNECTED
                          </Badge>
                        ) : integration.status === 'coming_soon' ? (
                          <Badge variant="outline" className="bg-[#F8F7F4] text-[#6B7280] border-[#E8E4DC] rounded-none px-3 py-1 text-[9px] font-bold tracking-widest uppercase">
                            COMING SOON
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-[#DFC178]/10 text-[#C9A84C] border-[#DFC178]/20 rounded-none px-3 py-1 text-[9px] font-bold tracking-widest uppercase">
                            AVAILABLE
                          </Badge>
                        )}
                      </div>

                      <h3 style={CG} className="text-2xl font-bold text-[#0A0F2E] mb-3">
                        {integration.name}
                      </h3>
                      <p className="text-sm text-[#6B7280] mb-8 leading-relaxed line-clamp-2">
                        {integration.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-8">
                        {integration.capabilities.slice(0, 3).map((capability) => (
                          <Badge key={capability} variant="secondary" className="text-[9px] font-bold tracking-widest uppercase bg-[#F8F7F4] text-[#0A0F2E] rounded-none px-2 py-0.5 border border-[#E8E4DC]">
                            {capability.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                      </div>

                      {connected ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-[10px] font-bold tracking-widest uppercase text-[#6B7280] border-b border-[#F8F7F4] pb-2">
                            <span>Status</span>
                            <span className="text-[#0A0F2E]">{connectedData?.status}</span>
                          </div>
                          <div className="flex gap-3">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 border-[#E8E4DC] text-[#0A0F2E] hover:bg-[#F8F7F4] rounded-none font-bold text-[10px] tracking-widest uppercase h-10"
                              data-testid={`button-settings-${integration.id}`}
                            >
                              <Settings className="w-3.5 h-3.5 mr-2" />
                              Settings
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-[#E8E4DC] text-[#0A0F2E] hover:bg-[#F8F7F4] rounded-none font-bold text-[10px] tracking-widest uppercase h-10"
                              onClick={() => connectedData && handleDisconnect(connectedData.id)}
                              data-testid={`button-disconnect-${integration.id}`}
                            >
                              Disconnect
                            </Button>
                          </div>
                        </div>
                      ) : integration.status === 'available' ? (
                        <Button
                          className="w-full bg-[#0A0F2E] text-white hover:bg-[#141B45] rounded-none font-bold text-[10px] tracking-widest uppercase h-12"
                          onClick={() => handleConnect(integration)}
                          data-testid={`button-connect-${integration.id}`}
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Connect
                        </Button>
                      ) : (
                        <Button className="w-full bg-[#F8F7F4] text-[#6B7280] rounded-none font-bold text-[10px] tracking-widest uppercase h-12" disabled data-testid={`button-coming-soon-${integration.id}`}>
                          Coming Soon
                        </Button>
                      )}
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="connected" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {marketplace.filter(i => isConnected(i.id)).map((integration) => {
                  const Icon = categoryIcons[integration.category as keyof typeof categoryIcons];
                  const colorClass = categoryColors[integration.category as keyof typeof categoryColors];
                  const connectedData = getConnectedIntegration(integration.id);

                  return (
                    <Card key={integration.id} className="p-8 rounded-none border-[#E8E4DC] bg-white">
                      <div className="flex items-start justify-between mb-6">
                        <Badge variant="outline" className="bg-[#2B8A6E]/10 text-[#2B8A6E] border-[#2B8A6E]/20 rounded-none px-3 py-1 text-[9px] font-bold tracking-widest uppercase">
                          ACTIVE
                        </Badge>
                      </div>

                      <h3 style={CG} className="text-2xl font-bold text-[#0A0F2E] mb-3">
                        {integration.name}
                      </h3>
                      <p className="text-sm text-[#6B7280] mb-8 leading-relaxed">
                        {integration.description}
                      </p>

                      <div className="flex gap-3">
                        <Button size="sm" variant="outline" className="flex-1 border-[#E8E4DC] text-[#0A0F2E] hover:bg-[#F8F7F4] rounded-none font-bold text-[10px] tracking-widest uppercase h-10">
                          <Settings className="w-3.5 h-3.5 mr-2" />
                          Settings
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[#E8E4DC] text-[#0A0F2E] hover:bg-[#F8F7F4] rounded-none font-bold text-[10px] tracking-widest uppercase h-10"
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

            <TabsContent value="available" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {marketplace.filter(i => !isConnected(i.id) && i.status === 'available').map((integration) => {
                  const Icon = categoryIcons[integration.category as keyof typeof categoryIcons];
                  const colorClass = categoryColors[integration.category as keyof typeof categoryColors];

                  return (
                    <Card key={integration.id} className="p-8 rounded-none border-[#E8E4DC] bg-white">
                      <div className="flex items-start justify-between mb-6">
                        <Badge variant="outline" className="bg-[#0A0F2E]/10 text-[#0A0F2E] border-[#0A0F2E]/20 rounded-none px-3 py-1 text-[9px] font-bold tracking-widest uppercase">
                          AVAILABLE
                        </Badge>
                      </div>

                      <h3 style={CG} className="text-2xl font-bold text-[#0A0F2E] mb-3">
                        {integration.name}
                      </h3>
                      <p className="text-sm text-[#6B7280] mb-8 leading-relaxed">
                        {integration.description}
                      </p>

                      <Button className="w-full bg-[#0A0F2E] text-white hover:bg-[#141B45] rounded-none font-bold text-[10px] tracking-widest uppercase h-12" onClick={() => handleConnect(integration)}>
                        <Zap className="w-4 h-4 mr-2" />
                        Connect
                      </Button>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Connection Dialog */}
        <Dialog open={isConnecting} onOpenChange={setIsConnecting}>
          <DialogContent data-testid="dialog-connection">
            <DialogHeader>
              <DialogTitle>Connect {selectedIntegration?.name}</DialogTitle>
              <DialogDescription>
                Enter your credentials to connect {selectedIntegration?.name} to Readiness OS.
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

            <div className="bg-[#0A0F2E] border border-white/10 rounded-none p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#C9A84C] mt-0.5" />
                <div className="text-sm text-white">
                  <p className="font-medium mb-1">Secure Connection</p>
                  <p className="text-white/60">Your credentials are encrypted and stored securely. They are only used to authenticate with {selectedIntegration?.name}.</p>
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
