import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { SiJira, SiSlack } from 'react-icons/si';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  Link2,
  Unlink,
  TestTube,
  Zap,
  Shield,
  ArrowRight,
  RefreshCw,
  Globe,
  ClipboardList,
  MessageSquare,
  Users,
  Bell,
} from 'lucide-react';

interface OAuthIntegration {
  id: string;
  type: string;
  status: 'connected' | 'not_connected' | 'error';
  connectedAt?: string;
  lastSync?: string;
  error?: string;
}

interface OAuthStatusResponse {
  integrations: OAuthIntegration[];
  available: {
    jira: { configured: boolean };
    slack: { configured: boolean };
  };
}

interface IntegrationConfig {
  key: string;
  name: string;
  description: string;
  icon: typeof SiJira;
  color: string;
  bgColor: string;
  borderColor: string;
  capabilities: { icon: typeof ClipboardList; label: string }[];
  enablesDescription: string;
}

const INTEGRATIONS: IntegrationConfig[] = [
  {
    key: 'jira',
    name: 'Jira',
    description: 'Atlassian project management and issue tracking for strategic execution coordination.',
    icon: SiJira,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    capabilities: [
      { icon: ClipboardList, label: 'Create projects & tasks automatically' },
      { icon: Users, label: 'Assign stakeholders to action items' },
      { icon: Zap, label: 'Sync execution status in real-time' },
      { icon: RefreshCw, label: 'Two-way progress tracking' },
    ],
    enablesDescription: 'When you connect Jira, ExecuteIQ will create real projects and tasks during playbook activation. Execution plans become live Jira boards with automated task assignment, status tracking, and sprint coordination.',
  },
  {
    key: 'slack',
    name: 'Slack',
    description: 'Team communication and real-time notification delivery for crisis coordination.',
    icon: SiSlack,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    capabilities: [
      { icon: Bell, label: 'Instant stakeholder notifications' },
      { icon: MessageSquare, label: 'Dedicated crisis channels' },
      { icon: Users, label: 'Team coordination & escalation' },
      { icon: Zap, label: 'Automated status updates' },
    ],
    enablesDescription: 'When you connect Slack, ExecuteIQ will send real-time alerts to stakeholders during playbook activation. Crisis channels are created automatically, and team members receive instant notifications with action items and status updates.',
  },
];

function getStatusBadge(status: string) {
  switch (status) {
    case 'connected':
      return (
        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 gap-1.5">
          <CheckCircle className="w-3 h-3" />
          Connected
        </Badge>
      );
    case 'error':
      return (
        <Badge className="bg-red-500/20 text-red-300 border-red-500/30 gap-1.5">
          <AlertTriangle className="w-3 h-3" />
          Error
        </Badge>
      );
    default:
      return (
        <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 gap-1.5">
          <XCircle className="w-3 h-3" />
          Not Connected
        </Badge>
      );
  }
}

export default function IntegrationConnections() {
  const { toast } = useToast();
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);

  const { data: orgData } = useQuery({
    queryKey: ['/api/organizations'],
    retry: false,
    staleTime: 60000,
  });
  const organizationId = (orgData as any)?.[0]?.id || '';

  const { data, isLoading, refetch } = useQuery<OAuthStatusResponse>({
    queryKey: ['/api/oauth/status', organizationId],
    enabled: !!organizationId,
    queryFn: async () => {
      const res = await fetch(`/api/oauth/status?organizationId=${organizationId}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch status');
      return res.json();
    },
  });

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace('#', ''));

    const connected = params.get('connected');
    const error = params.get('error');

    if (connected) {
      toast({
        title: `${connected.charAt(0).toUpperCase() + connected.slice(1)} Connected`,
        description: `Your ${connected} integration is now active and ready to use.`,
      });
      window.history.replaceState(null, '', window.location.pathname);
    }

    if (error) {
      toast({
        title: 'Connection Failed',
        description: decodeURIComponent(error),
        variant: 'destructive',
      });
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [toast]);

  const disconnectMutation = useMutation({
    mutationFn: async (integrationId: string) => {
      const res = await apiRequest('POST', '/api/oauth/disconnect', { integrationId });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/oauth/status', organizationId] });
      toast({ title: 'Disconnected', description: 'Integration has been disconnected.' });
    },
    onError: (err: Error) => {
      toast({ title: 'Disconnect Failed', description: err.message, variant: 'destructive' });
    },
  });

  const handleConnect = async (integrationKey: string) => {
    setConnectingId(integrationKey);
    try {
      const res = await fetch(`/api/oauth/${integrationKey}/authorize?organizationId=${organizationId}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to start authorization');
      const { authUrl } = await res.json();
      window.location.href = authUrl;
    } catch (err: any) {
      toast({ title: 'Connection Error', description: err.message || 'Unable to start OAuth flow.', variant: 'destructive' });
      setConnectingId(null);
    }
  };

  const handleTest = async (integrationKey: string, integrationId: string) => {
    setTestingId(integrationKey);
    try {
      const res = await apiRequest('POST', `/api/oauth/${integrationKey}/test`, { integrationId });
      const result = await res.json();
      toast({
        title: result.success ? 'Connection Healthy' : 'Connection Issue',
        description: result.message || (result.success ? 'Integration is working correctly.' : 'There was a problem with the connection.'),
        variant: result.success ? 'default' : 'destructive',
      });
    } catch (err: any) {
      toast({ title: 'Test Failed', description: err.message, variant: 'destructive' });
    } finally {
      setTestingId(null);
    }
  };

  const getIntegrationStatus = (key: string): OAuthIntegration | undefined => {
    return data?.integrations?.find((i) => i.type === key);
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-10">

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <Globe className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Integration Connection Hub</h1>
                <p className="text-gray-400 text-sm mt-0.5">Connect your tools to activate real execution workflows</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gray-900/60 border-gray-800">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-emerald-500/10">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {data?.integrations?.filter((i) => i.status === 'connected').length ?? 0}
                  </div>
                  <div className="text-xs text-gray-400">Connected</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/60 border-gray-800">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-blue-500/10">
                  <Link2 className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {Object.values(data?.available ?? {}).filter((v: any) => v.configured).length}
                  </div>
                  <div className="text-xs text-gray-400">Available</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/60 border-gray-800">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-amber-500/10">
                  <Shield className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">OAuth 2.0</div>
                  <div className="text-xs text-gray-400">Secure Protocol</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              <span className="ml-3 text-gray-400">Loading integrations...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {INTEGRATIONS.map((config) => {
                const integration = getIntegrationStatus(config.key);
                const status = integration?.status ?? 'not_connected';
                const isConnected = status === 'connected';
                const isAvailable = (data?.available as any)?.[config.key]?.configured;
                const Icon = config.icon;

                return (
                  <Card key={config.key} className={`bg-gray-900/80 border-gray-800 overflow-hidden ${isConnected ? 'ring-1 ring-emerald-500/20' : ''}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-xl ${config.bgColor} border ${config.borderColor}`}>
                            <Icon className={`w-6 h-6 ${config.color}`} />
                          </div>
                          <div>
                            <CardTitle className="text-lg text-white">{config.name}</CardTitle>
                            <p className="text-sm text-gray-400 mt-0.5">{config.description}</p>
                          </div>
                        </div>
                        {getStatusBadge(status)}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-5">
                      {integration?.error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-300">
                          <AlertTriangle className="w-4 h-4 inline mr-1.5" />
                          {integration.error}
                        </div>
                      )}

                      {isConnected && integration?.connectedAt && (
                        <div className="text-xs text-gray-500">
                          Connected {new Date(integration.connectedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          {integration.lastSync && (
                            <> · Last synced {new Date(integration.lastSync).toLocaleTimeString()}</>
                          )}
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        {config.capabilities.map((cap, idx) => {
                          const CapIcon = cap.icon;
                          return (
                            <div key={idx} className="flex items-center gap-2 text-xs text-gray-400 py-1.5">
                              <CapIcon className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                              <span>{cap.label}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        {isConnected ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-gray-700 text-gray-300 hover:bg-gray-800 gap-1.5"
                              onClick={() => handleTest(config.key, integration!.id)}
                              disabled={testingId === config.key}
                            >
                              {testingId === config.key ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <TestTube className="w-3.5 h-3.5" />
                              )}
                              Test Connection
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-800/50 text-red-400 hover:bg-red-500/10 gap-1.5"
                              onClick={() => disconnectMutation.mutate(integration!.id)}
                              disabled={disconnectMutation.isPending}
                            >
                              {disconnectMutation.isPending ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Unlink className="w-3.5 h-3.5" />
                              )}
                              Disconnect
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
                            onClick={() => handleConnect(config.key)}
                            disabled={connectingId === config.key || !isAvailable}
                          >
                            {connectingId === config.key ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Link2 className="w-3.5 h-3.5" />
                            )}
                            {isAvailable ? 'Connect' : 'Not Configured'}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          <Card className="bg-gray-900/60 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                What Integrations Enable
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {INTEGRATIONS.map((config) => {
                const Icon = config.icon;
                return (
                  <div key={config.key} className="flex gap-4">
                    <div className={`p-2 rounded-lg ${config.bgColor} border ${config.borderColor} h-fit mt-0.5`}>
                      <Icon className={`w-4 h-4 ${config.color}`} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-1">{config.name} Integration</h4>
                      <p className="text-sm text-gray-400 leading-relaxed">{config.enablesDescription}</p>
                    </div>
                  </div>
                );
              })}

              <div className="pt-4 border-t border-gray-800">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Shield className="w-3.5 h-3.5" />
                  All connections use industry-standard OAuth 2.0 with encrypted token storage. No passwords are stored.
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </PageLayout>
  );
}
