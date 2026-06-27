import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Wifi, WifiOff, Activity, ArrowUpRight, ArrowDownLeft,
  Settings, Zap, ChevronDown, ChevronRight, RefreshCw,
  FileText, MessageSquare, GitBranch, Bot, CheckCircle2,
  Clock, AlertCircle, ExternalLink, Play, Shield
} from 'lucide-react';

const NAVY  = '#0A0F2E';
const GOLD  = '#C9A84C';
const TEAL  = '#2B8A6E';
const IVORY = '#F0EDE4';

// ─── Connector definitions ────────────────────────────────────────────────────
const CONNECTOR_DEFS = [
  {
    type: 'teams',
    name: 'Microsoft Teams',
    icon: MessageSquare,
    color: '#6264A7',
    description: 'Stage stakeholder notifications, channel alerts, and executive authorization requests directly into Teams channels at trigger point.',
    capabilities: [
      'Adaptive card notifications at trigger detection',
      'Executive authorization via Teams approval flow',
      'Channel-specific routing by protocol domain',
      'Real-time status updates during execution',
    ],
    configFields: [
      { key: 'defaultChannel', label: 'Default Alert Channel', placeholder: '#incident-response' },
      { key: 'executiveChannel', label: 'Executive Channel', placeholder: '#executive-alerts' },
      { key: 'tenantId', label: 'Azure Tenant ID', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
    ],
    oauthScope: 'ChannelMessage.Send, Chat.ReadWrite, TeamsAppInstallation.ReadWrite',
  },
  {
    type: 'sharepoint',
    name: 'SharePoint',
    icon: FileText,
    color: '#038387',
    description: 'Pre-stage crisis response documents, board briefs, and legal holds into designated SharePoint libraries before the trigger fires.',
    capabilities: [
      'Document pre-staging to pre-approved libraries',
      'Version-controlled response templates',
      'Automatic legal hold on relevant document libraries',
      'Board-ready brief upload on activation',
    ],
    configFields: [
      { key: 'siteUrl', label: 'SharePoint Site URL', placeholder: 'https://company.sharepoint.com/sites/crisis' },
      { key: 'libraryName', label: 'Document Library', placeholder: 'Incident-Response' },
      { key: 'tenantId', label: 'Azure Tenant ID', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
    ],
    oauthScope: 'Sites.ReadWrite.All, Files.ReadWrite.All',
  },
  {
    type: 'power_automate',
    name: 'Power Automate',
    icon: GitBranch,
    color: '#0066FF',
    description: 'Trigger pre-built automation chains the moment a protocol activates — budget routing, legal holds, PR freezes, and regulatory notifications.',
    capabilities: [
      'Multi-step automation chains triggered at activation',
      'Budget approval routing via Power Automate flows',
      'Regulatory notification drafts auto-prepared',
      'Cross-system coordination without manual handoffs',
    ],
    configFields: [
      { key: 'flowId', label: 'Primary Flow ID', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
      { key: 'triggerUrl', label: 'HTTP Trigger URL', placeholder: 'https://prod-xx.westus.logic.azure.com/...' },
      { key: 'envName', label: 'Environment Name', placeholder: 'Production' },
    ],
    oauthScope: 'Flows.Read.All, Flows.Manage.All',
  },
  {
    type: 'copilot_studio',
    name: 'Copilot Studio',
    icon: Bot,
    color: '#7B83EB',
    description: 'Inject live protocol context into Copilot Studio so every executive query during an activation returns protocol-aligned guidance — not generic AI answers.',
    capabilities: [
      'Real-time protocol context injection at trigger point',
      'Executive queries answered with activation-specific data',
      'Behavioral data capture during activation for ADVANCE learning',
      'Post-activation debrief mode for continuous improvement',
    ],
    configFields: [
      { key: 'botId', label: 'Copilot Bot ID', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
      { key: 'environmentId', label: 'Environment ID', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
      { key: 'schemaVersion', label: 'Schema Version', placeholder: 'v3' },
    ],
    oauthScope: 'CopilotStudio.Manage, BotFramework.ReadWrite',
  },
];

const EVENT_TYPE_LABELS: Record<string, string> = {
  teams_notification: 'Notification Sent',
  teams_reply: 'Reply Received',
  sharepoint_document_staged: 'Document Staged',
  sharepoint_document_approved: 'Document Approved',
  flow_triggered: 'Flow Triggered',
  flow_completed: 'Flow Completed',
  copilot_context_injected: 'Context Injected',
  copilot_query: 'Query Received',
};

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    connected: TEAL, disconnected: '#9CA3AF', pending_auth: GOLD, error: '#DC2626'
  };
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: colors[status] ?? '#9CA3AF' }} />
      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: colors[status] ?? '#9CA3AF' }}>
        {status === 'pending_auth' ? 'Pending Auth' : status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </span>
  );
}

function EventRow({ event }: { event: any }) {
  const isInbound = event.direction === 'inbound';
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isInbound ? 'bg-teal-50' : 'bg-blue-50'}`}>
        {isInbound
          ? <ArrowDownLeft className="h-3.5 w-3.5" style={{ color: TEAL }} />
          : <ArrowUpRight className="h-3.5 w-3.5" style={{ color: '#3B82F6' }} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-bold" style={{ color: NAVY }}>
            {EVENT_TYPE_LABELS[event.eventType] ?? event.eventType}
          </span>
          <span className="text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-sm"
            style={{ background: isInbound ? '#ECFDF5' : '#EFF6FF', color: isInbound ? TEAL : '#3B82F6' }}>
            {isInbound ? 'Inbound' : 'Outbound'}
          </span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{event.summary}</p>
        <span className="text-[10px] text-gray-400 mt-0.5 block">
          {new Date(event.processedAt).toLocaleString()}
        </span>
      </div>
    </div>
  );
}

function ConnectorCard({ def, connector, onSimulate, simulating }: {
  def: typeof CONNECTOR_DEFS[0];
  connector?: any;
  onSimulate: () => void;
  simulating: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const status = connector?.status ?? 'disconnected';
  const Icon = def.icon;

  return (
    <div className="bg-white border border-gray-100 rounded-sm overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-5 border-b border-gray-50">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0"
              style={{ background: def.color + '15' }}>
              <Icon className="h-5 w-5" style={{ color: def.color }} />
            </div>
            <div>
              <div className="text-sm font-bold" style={{ color: NAVY }}>{def.name}</div>
              <StatusDot status={status} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {status === 'connected' && (
              <Button
                size="sm"
                className="text-xs h-7 px-3 gap-1.5"
                style={{ background: TEAL, color: 'white' }}
                disabled={simulating}
                onClick={onSimulate}
              >
                {simulating ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
                Simulate Activation
              </Button>
            )}
            {status !== 'connected' && (
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-7 px-3 gap-1.5"
                style={{ borderColor: NAVY + '40', color: NAVY }}
              >
                <ExternalLink className="h-3 w-3" />
                Connect via Azure
              </Button>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3 leading-relaxed">{def.description}</p>
      </div>

      {/* Stats row */}
      {connector && (
        <div className="grid grid-cols-3 divide-x divide-gray-50 border-b border-gray-50">
          {[
            { label: 'Events (24h)', val: connector.eventsInLast24h ?? 0 },
            { label: 'Auth Status', val: connector.authStatus === 'authenticated' ? '✓ Active' : 'Pending' },
            { label: 'Last Activity', val: connector.lastActivityAt ? new Date(connector.lastActivityAt).toLocaleDateString() : '—' },
          ].map(s => (
            <div key={s.label} className="p-3 text-center">
              <div className="text-sm font-bold" style={{ color: NAVY }}>{s.val}</div>
              <div className="text-[10px] uppercase tracking-wider text-gray-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Capabilities toggle */}
      <button
        className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">What This Connects</span>
        {expanded ? <ChevronDown className="h-3.5 w-3.5 text-gray-400" /> : <ChevronRight className="h-3.5 w-3.5 text-gray-400" />}
      </button>

      {expanded && (
        <div className="px-5 pb-4 space-y-2 border-t border-gray-50 pt-3">
          {def.capabilities.map((c, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" style={{ color: TEAL }} />
              <span className="text-xs text-gray-600">{c}</span>
            </div>
          ))}
          <div className="mt-3 pt-3 border-t border-gray-50">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Required OAuth Scope</div>
            <code className="text-[10px] text-gray-500 bg-gray-50 px-2 py-1 rounded-sm block">{def.oauthScope}</code>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MicrosoftConnectors() {
  const { toast } = useToast();
  const [simulatingId, setSimulatingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'connectors' | 'activity'>('connectors');

  const { data: connectorsData, isLoading } = useQuery<any[]>({
    queryKey: ['/api/microsoft/connectors'],
  });
  const connectors: any[] = connectorsData || [];

  const { data: eventsData, isLoading: eventsLoading } = useQuery<any[]>({
    queryKey: ['/api/microsoft/events'],
    refetchInterval: 15000,
  });
  const events: any[] = eventsData || [];

  // Seed all 4 connectors in demo mode
  const seedMutation = useMutation({
    mutationFn: () =>
      apiRequest('POST', '/api/microsoft/connectors', {
        connectorType: 'teams', displayName: 'Microsoft Teams', status: 'connected',
        config: { defaultChannel: '#incident-response', executiveChannel: '#executive-alerts' },
        authStatus: 'authenticated',
      }).then(() => apiRequest('POST', '/api/microsoft/connectors', {
        connectorType: 'sharepoint', displayName: 'SharePoint', status: 'connected',
        config: { siteUrl: 'https://company.sharepoint.com/sites/crisis', libraryName: 'Incident-Response' },
        authStatus: 'authenticated',
      })).then(() => apiRequest('POST', '/api/microsoft/connectors', {
        connectorType: 'power_automate', displayName: 'Power Automate', status: 'connected',
        config: { envName: 'Production' }, authStatus: 'authenticated',
      })).then(() => apiRequest('POST', '/api/microsoft/connectors', {
        connectorType: 'copilot_studio', displayName: 'Copilot Studio', status: 'connected',
        config: { schemaVersion: 'v3' }, authStatus: 'authenticated',
      })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/microsoft/connectors'] });
      toast({ title: 'Microsoft 365 stack connected', description: 'All 4 connectors activated and ready.' });
    },
  });

  const simulateMutation = useMutation({
    mutationFn: ({ connectorId, connectorType }: { connectorId: string; connectorType: string }) =>
      apiRequest('POST', '/api/microsoft/simulate-activation', {
        connectorId, connectorType,
        scenarioName: 'Ransomware Containment Protocol',
      }).then(r => r.json()),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['/api/microsoft/connectors'] });
      queryClient.invalidateQueries({ queryKey: ['/api/microsoft/events'] });
      setSimulatingId(null);
      toast({ title: 'Activation simulated', description: `Live ${vars.connectorType} events logged to activity feed.` });
      setActiveTab('activity');
    },
    onError: () => {
      setSimulatingId(null);
      toast({ title: 'Simulation failed', variant: 'destructive' });
    },
  });

  const connectedCount = connectors.filter((c: any) => c.status === 'connected').length;
  const totalEvents = events.length;

  return (
    <PageLayout>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-8 py-10">
          <div className="flex items-start justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: GOLD }}>
                  — BOARD PRIORITY 1
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: NAVY }}>
                Microsoft 365 Connector Layer
              </h1>
              <p className="text-gray-500 max-w-xl leading-relaxed">
                Every enterprise has Microsoft's AI stack. None have the operating model to use it.
                Readiness OS is the orchestration layer above your Microsoft investment — not a replacement, a coordinator.
                When a situation presents itself, Teams notifies, SharePoint stages, Power Automate executes, Copilot guides.
              </p>
              <div className="mt-4 max-w-xl flex items-start gap-3 p-4 border-l-2" style={{ borderColor: '#2B8A6E', background: 'rgba(43,138,110,0.05)' }}>
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full mt-1" style={{ background: '#2B8A6E' }} />
                </div>
                <p className="text-xs leading-relaxed" style={{ color: '#374151' }}>
                  <strong style={{ color: '#0A0F2E' }}>Independently validated:</strong> Microsoft published its own readiness assessment framework for enterprise AI deployment
                  (<code className="text-[10px] bg-gray-100 px-1 py-0.5 rounded">microsoft/m365-copilot-automated-readiness-assessment</code>).
                  The technology is ready. The operating model to use it isn't. That gap is exactly what Readiness OS closes.
                </p>
              </div>
            </div>

            {/* Stat summary */}
            <div className="hidden lg:grid grid-cols-2 gap-4 flex-shrink-0">
              {[
                { label: 'Connectors Active', val: connectedCount, total: 4, color: TEAL },
                { label: 'Events Logged', val: totalEvents, total: null, color: NAVY },
              ].map(s => (
                <div key={s.label} className="bg-gray-50 rounded-sm p-4 text-center w-32">
                  <div className="text-2xl font-bold" style={{ color: s.color }}>
                    {s.val}{s.total ? <span className="text-base text-gray-400">/{s.total}</span> : ''}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-gray-400 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Framing strip */}
          <div className="mt-6 flex items-center gap-3 p-4 rounded-sm border"
            style={{ borderColor: NAVY + '20', background: NAVY + '06' }}>
            <Shield className="h-4 w-4 flex-shrink-0" style={{ color: NAVY }} />
            <p className="text-xs text-gray-600 leading-relaxed">
              <strong style={{ color: NAVY }}>Gates Directive:</strong>{' '}
              "You're claiming to be the operating model above Microsoft's AI stack — but until Teams notifies, SharePoint stages,
              and Power Automate executes automatically at trigger point, you're adjacent to Microsoft, not above it.
              The connector is the claim."
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">

        {/* ── Action bar ────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-1">
            {(['connectors', 'activity'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all"
                style={activeTab === tab
                  ? { background: NAVY, color: 'white' }
                  : { background: 'transparent', color: '#9CA3AF' }}
              >
                {tab === 'connectors' ? 'Connectors' : `Activity Feed ${totalEvents > 0 ? `(${totalEvents})` : ''}`}
              </button>
            ))}
          </div>

          {connectedCount === 0 && (
            <Button
              onClick={() => seedMutation.mutate()}
              disabled={seedMutation.isPending}
              className="text-xs gap-2"
              style={{ background: NAVY, color: 'white' }}
            >
              {seedMutation.isPending ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Zap className="h-3.5 w-3.5" />}
              Connect Microsoft 365 Stack
            </Button>
          )}
        </div>

        {/* ── Connectors tab ────────────────────────────────────────────────── */}
        {activeTab === 'connectors' && (
          <div className="space-y-4">
            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-sm" />)}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {CONNECTOR_DEFS.map(def => {
                  const connector = connectors.find((c: any) => c.connectorType === def.type);
                  return (
                    <ConnectorCard
                      key={def.type}
                      def={def}
                      connector={connector}
                      simulating={simulatingId === def.type}
                      onSimulate={() => {
                        if (!connector) return;
                        setSimulatingId(def.type);
                        simulateMutation.mutate({ connectorId: connector.id, connectorType: def.type });
                      }}
                    />
                  );
                })}
              </div>
            )}

            {/* Architecture diagram */}
            <div className="mt-6 border border-gray-100 rounded-sm bg-white p-6">
              <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5">
                How It Connects at Trigger Point
              </div>
              <div className="flex items-center gap-0 overflow-x-auto">
                {[
                  { label: 'Signal Detected', sub: 'Continuous monitoring', color: NAVY, icon: Activity },
                  { label: 'Protocol Matched', sub: 'Pre-staged response', color: NAVY, icon: Zap },
                  { label: 'Teams Alerts', sub: 'Stakeholders notified', color: '#6264A7', icon: MessageSquare },
                  { label: 'SharePoint Stages', sub: 'Docs pre-positioned', color: '#038387', icon: FileText },
                  { label: 'Automate Executes', sub: 'Flows triggered', color: '#0066FF', icon: GitBranch },
                  { label: 'Copilot Guides', sub: 'Context injected', color: '#7B83EB', icon: Bot },
                  { label: '12 Minutes', sub: 'Full execution', color: GOLD, icon: CheckCircle2 },
                ].map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div key={i} className="flex items-center flex-shrink-0">
                      <div className="text-center px-2">
                        <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center"
                          style={{ background: step.color + '15' }}>
                          <Icon className="h-4 w-4" style={{ color: step.color }} />
                        </div>
                        <div className="text-[10px] font-bold" style={{ color: step.color }}>{step.label}</div>
                        <div className="text-[10px] text-gray-400">{step.sub}</div>
                      </div>
                      {i < 6 && <div className="w-6 h-px bg-gray-200 flex-shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Activity feed tab ─────────────────────────────────────────────── */}
        {activeTab === 'activity' && (
          <div>
            {eventsLoading ? (
              <div className="space-y-2 animate-pulse">
                {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-sm" />)}
              </div>
            ) : events.length === 0 ? (
              <div className="border border-gray-100 rounded-sm p-12 text-center">
                <Activity className="h-10 w-10 mx-auto mb-3 text-gray-200" />
                <div className="text-sm font-bold text-gray-400 mb-1">No events yet</div>
                <div className="text-xs text-gray-400 max-w-sm mx-auto mb-4">
                  Connect your Microsoft 365 stack and simulate an activation to see live event flow.
                </div>
                <Button
                  size="sm"
                  onClick={() => setActiveTab('connectors')}
                  style={{ background: NAVY, color: 'white' }}
                  className="text-xs"
                >
                  Go to Connectors
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Filter pills */}
                <div className="flex gap-2 flex-wrap">
                  {['All', 'Teams', 'SharePoint', 'Power Automate', 'Copilot Studio'].map(f => {
                    const count = f === 'All' ? events.length
                      : events.filter((e: any) => e.connectorType === f.toLowerCase().replace(' ', '_')).length;
                    return (
                      <span key={f} className="px-3 py-1 text-xs font-bold rounded-sm border cursor-pointer"
                        style={{ borderColor: NAVY + '30', color: NAVY, background: 'white' }}>
                        {f} {count > 0 && <span className="ml-1 text-gray-400">{count}</span>}
                      </span>
                    );
                  })}
                </div>

                {/* Events grouped by connector */}
                {CONNECTOR_DEFS.map(def => {
                  const defEvents = events.filter((e: any) => e.connectorType === def.type);
                  if (defEvents.length === 0) return null;
                  const Icon = def.icon;
                  return (
                    <div key={def.type} className="border border-gray-100 rounded-sm bg-white overflow-hidden">
                      <div className="flex items-center gap-3 p-4 border-b border-gray-50">
                        <div className="w-7 h-7 rounded-sm flex items-center justify-center" style={{ background: def.color + '15' }}>
                          <Icon className="h-4 w-4" style={{ color: def.color }} />
                        </div>
                        <span className="text-sm font-bold" style={{ color: NAVY }}>{def.name}</span>
                        <Badge className="text-xs" style={{ background: def.color + '20', color: def.color, border: 'none' }}>
                          {defEvents.length} events
                        </Badge>
                      </div>
                      <div className="px-4 divide-y divide-gray-50">
                        {defEvents.slice(0, 10).map((e: any) => (
                          <EventRow key={e.id} event={e} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
