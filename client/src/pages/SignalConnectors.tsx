import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
  Wifi, WifiOff, Settings, Plus, CheckCircle, AlertTriangle, Clock,
  Database, Globe, Server, Zap, RefreshCw, Shield, Lock, Activity,
  ChevronRight, ExternalLink, Info
} from 'lucide-react';

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";

// ── Connector type definitions ───────────────────────────────────────────────

const CONNECTOR_CATALOG = [
  {
    id: 'rss-feeds',
    name: 'RSS Signal Feeds',
    description: '8 pre-configured external signal sources: Reuters, Bloomberg, SEC EDGAR, and 5 additional sources. Runs every 15 minutes.',
    category: 'External',
    status: 'active',
    signalType: 'External',
    icon: Globe,
    color: TEAL,
    signals: '248+ data points monitored',
    frequency: 'Every 15 minutes',
    setupRequired: false,
    phase: 'Phase 1 — Live',
  },
  {
    id: 'microsoft365',
    name: 'Microsoft 365',
    description: 'Teams channel patterns, Azure AD identity alerts, calendar density signals. Metadata only — content never accessed. Requires Azure app registration.',
    category: 'Internal',
    status: 'available',
    signalType: 'Internal Signal',
    icon: Server,
    color: '#0078D4',
    signals: 'Teams, Exchange, SharePoint, Azure AD/Entra',
    frequency: 'Every 15 minutes (alongside RSS cycle)',
    setupRequired: true,
    phase: 'Phase 4 — Founding Partner',
    requiredFields: ['tenantId', 'clientId', 'clientSecret'],
  },
  {
    id: 'salesforce',
    name: 'Salesforce CRM',
    description: 'Customer concentration risk, deal pipeline signals, opportunity stage shifts. Detects revenue exposure before it becomes a financial crisis.',
    category: 'Internal',
    status: 'available',
    signalType: 'Internal Signal',
    icon: Database,
    color: '#00A1E0',
    signals: 'Pipeline velocity, customer concentration, churn signals',
    frequency: 'Every 15 minutes',
    setupRequired: true,
    phase: 'Phase 4 — Founding Partner',
    requiredFields: ['instanceUrl', 'clientId', 'clientSecret'],
  },
  {
    id: 'financial-erp',
    name: 'Financial / ERP Webhook',
    description: 'Generic JSON webhook receiver for ERP systems. Configure your ERP to push financial metrics on schedule. Signals feed directly into Financial Strategy domain monitoring.',
    category: 'Internal',
    status: 'available',
    signalType: 'Internal Signal',
    icon: Zap,
    color: GOLD,
    signals: 'Financial metrics, budget variance, cash flow signals',
    frequency: 'On-push from ERP system',
    setupRequired: true,
    phase: 'Phase 4 — Founding Partner',
    webhookUrl: '/api/signal-connectors/erp/webhook',
  },
  {
    id: 'preparation-monitor',
    name: 'Readiness Monitor',
    description: 'Monitors organizational preparedness scores across all strategic domains. Fires a recovery protocol trigger when any domain drops below its threshold.',
    category: 'Internal',
    status: 'active',
    signalType: 'Readiness Signal',
    icon: Shield,
    color: '#2B8A6E',
    signals: '8 strategic domains monitored',
    frequency: 'After every ingestion cycle',
    setupRequired: false,
    phase: 'Phase 5 — Live',
  },
  {
    id: 'signal-ontology',
    name: 'Signal Ontology Engine',
    description: 'Rule-based relationship map derived from 170 Readiness Protocols. Maps which signals co-occur, which sequences precede activations. Enriches automatically with activation data.',
    category: 'Platform',
    status: 'active',
    signalType: 'Platform Intelligence',
    icon: Activity,
    color: NAVY,
    signals: '16 trigger nodes, 7 domain nodes',
    frequency: 'Continuous enrichment',
    setupRequired: false,
    phase: 'Phase 5a — Live',
  },
  {
    id: 'learning-engine',
    name: 'Continuous Learning Engine',
    description: 'Compounds in accuracy with every activation. Domain learning (weekly), ontology enrichment (monthly), industry profiles (quarterly). Privacy-safe: cross-org learning uses anonymized aggregates only.',
    category: 'Platform',
    status: 'active',
    signalType: 'Platform Intelligence',
    icon: RefreshCw,
    color: TEAL,
    signals: 'All activation data, Close-Out Gate answers',
    frequency: 'Weekly / Monthly / Quarterly',
    setupRequired: false,
    phase: 'Phase 6 — Live',
  },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  active:    { label: 'Active', color: TEAL, bg: 'rgba(43,138,110,0.1)', icon: CheckCircle },
  available: { label: 'Available', color: GOLD, bg: 'rgba(201,168,76,0.1)', icon: Clock },
  error:     { label: 'Error', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: AlertTriangle },
};

// ── Microsoft 365 Configuration Dialog ───────────────────────────────────────

function M365ConfigDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState({ tenantId: '', clientId: '', clientSecret: '' });

  const configureMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/signal-connectors/m365/configure', data),
    onSuccess: () => {
      toast({ title: 'Microsoft 365 connected', description: 'Internal signal monitoring is now active for your Microsoft environment.' });
      queryClient.invalidateQueries({ queryKey: ['/api/signal-connectors/m365/status'] });
      onClose();
    },
    onError: (err: any) => {
      toast({ title: 'Connection failed', description: err.message, variant: 'destructive' });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent style={{ maxWidth: 560, borderRadius: '0.15rem' }}>
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: NAVY }}>
            Connect Microsoft 365
          </DialogTitle>
          <DialogDescription style={{ fontSize: 13, color: '#6B7280' }}>
            Requires an Azure app registration in your tenant with the following Graph API permissions:
            Team.ReadBasic.All, IdentityRiskyUser.Read.All (read-only metadata — no content access).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B7280' }}>
              Tenant ID
            </Label>
            <Input
              value={form.tenantId}
              onChange={e => setForm(f => ({ ...f, tenantId: e.target.value }))}
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              style={{ marginTop: 6, borderRadius: '0.15rem', fontFamily: 'monospace', fontSize: 13 }}
            />
          </div>
          <div>
            <Label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B7280' }}>
              Client ID (Application ID)
            </Label>
            <Input
              value={form.clientId}
              onChange={e => setForm(f => ({ ...f, clientId: e.target.value }))}
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              style={{ marginTop: 6, borderRadius: '0.15rem', fontFamily: 'monospace', fontSize: 13 }}
            />
          </div>
          <div>
            <Label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B7280' }}>
              Client Secret
            </Label>
            <Input
              type="password"
              value={form.clientSecret}
              onChange={e => setForm(f => ({ ...f, clientSecret: e.target.value }))}
              placeholder="Enter client secret"
              style={{ marginTop: 6, borderRadius: '0.15rem', fontSize: 13 }}
            />
          </div>

          <div style={{ background: 'rgba(43,138,110,0.08)', border: '1px solid rgba(43,138,110,0.2)', padding: '12px 16px', borderRadius: '0.15rem' }}>
            <div className="flex items-start gap-2">
              <Lock className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: TEAL }} />
              <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.6 }}>
                <strong>Metadata only.</strong> Readiness OS accesses channel names, calendar event counts,
                and identity risk scores. Email content, message content, and document content are never
                accessed, stored, or processed.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} style={{ borderRadius: '0.15rem' }}>Cancel</Button>
          <Button
            onClick={() => configureMutation.mutate(form)}
            disabled={!form.tenantId || !form.clientId || !form.clientSecret || configureMutation.isPending}
            style={{ background: NAVY, color: '#fff', borderRadius: '0.15rem' }}
          >
            {configureMutation.isPending ? 'Connecting...' : 'Connect Microsoft 365'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── ERP Webhook Info Dialog ───────────────────────────────────────────────────

function ERPWebhookDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const webhookUrl = `${window.location.origin}/api/signal-connectors/erp/webhook`;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent style={{ maxWidth: 560, borderRadius: '0.15rem' }}>
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: NAVY }}>
            Financial / ERP Webhook
          </DialogTitle>
          <DialogDescription style={{ fontSize: 13, color: '#6B7280' }}>
            Configure your ERP system to push financial metrics to this endpoint. Signals feed directly
            into Financial Strategy domain monitoring.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B7280' }}>
              Webhook URL
            </Label>
            <div style={{ marginTop: 6, background: '#F8F7F4', border: '1px solid #E8E4DC', padding: '10px 14px', borderRadius: '0.15rem', fontFamily: 'monospace', fontSize: 12, wordBreak: 'break-all' }}>
              {webhookUrl}
            </div>
          </div>

          <div>
            <Label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B7280' }}>
              Expected Payload Format
            </Label>
            <pre style={{ marginTop: 6, background: '#0A0F2E', color: '#C9A84C', padding: '12px 16px', borderRadius: '0.15rem', fontSize: 11, overflow: 'auto' }}>
{`{
  "metric": "cash_flow_variance",
  "value": 0.62,
  "threshold": 0.75,
  "unit": "ratio",
  "organizationId": "your-org-id",
  "timestamp": "2026-05-07T12:00:00Z"
}`}
            </pre>
          </div>

          <div style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', padding: '12px 16px', borderRadius: '0.15rem' }}>
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: GOLD }} />
              <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.6 }}>
                A signal is generated when any metric deviates more than 15% from its threshold.
                Financial distress patterns are automatically evaluated against the
                Financial Strategy trigger portfolio.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} style={{ background: NAVY, color: '#fff', borderRadius: '0.15rem' }}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Ontology Stats Card ───────────────────────────────────────────────────────

function OntologyStatsPanel() {
  const { data: raw } = useQuery({ queryKey: ['/api/ontology/graph'] });
  const graph = raw as any;

  const { toast } = useToast();
  const seedMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/ontology/seed', {}),
    onSuccess: (data: any) => {
      toast({ title: 'Ontology seeded', description: `${data.nodes} nodes, ${data.edges} edges` });
      queryClient.invalidateQueries({ queryKey: ['/api/ontology/graph'] });
    },
    onError: () => toast({ title: 'Seed failed', variant: 'destructive' }),
  });

  const stats = graph?.stats;

  return (
    <div style={{ border: '1px solid #E8E4DC', padding: 24, background: '#fff' }}>
      <div className="flex items-center justify-between mb-4">
        <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: NAVY }}>
          Signal Ontology — Phase 5a
        </h4>
        {(!stats || stats.totalNodes === 0) && (
          <Button
            size="sm"
            onClick={() => seedMutation.mutate()}
            disabled={seedMutation.isPending}
            style={{ background: NAVY, color: '#fff', borderRadius: '0.15rem', fontSize: 11 }}
          >
            {seedMutation.isPending ? 'Seeding...' : 'Seed Ontology'}
          </Button>
        )}
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Nodes', value: stats?.totalNodes ?? '—' },
          { label: 'Domain Nodes', value: stats?.domains ?? '—' },
          { label: 'Trigger Nodes', value: stats?.triggers ?? '—' },
          { label: 'Relationships', value: stats?.totalEdges ?? '—' },
        ].map(({ label, value }) => (
          <div key={label} style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: NAVY, fontFamily: "'Cormorant Garamond', serif" }}>{value}</div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9CA3AF', marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 8, borderTop: '1px solid #E8E4DC', paddingTop: 12 }}>
        Phase 5a: Rule-based relationship map. Enriches automatically after each activation (Phase 5b).
        ML-based learning activates after 10+ organizations and 100+ activations (Phase 5c).
      </p>
    </div>
  );
}

// ── Main Connector Card ───────────────────────────────────────────────────────

function ConnectorCard({
  connector,
  onSetup,
}: {
  connector: typeof CONNECTOR_CATALOG[0];
  onSetup: () => void;
}) {
  const statusCfg = STATUS_CONFIG[connector.status] || STATUS_CONFIG.available;
  const StatusIcon = statusCfg.icon;
  const ConnectorIcon = connector.icon;

  return (
    <div style={{ border: '1px solid #E8E4DC', padding: 28, background: '#fff', position: 'relative' }}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div style={{ width: 44, height: 44, background: connector.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ConnectorIcon className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: NAVY }}>
                {connector.name}
              </h3>
              <Badge style={{ background: statusCfg.bg, color: statusCfg.color, border: 'none', fontSize: 9, fontWeight: 700 }}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusCfg.label}
              </Badge>
              <Badge style={{ background: '#F3F4F6', color: '#6B7280', border: 'none', fontSize: 9, fontWeight: 700 }}>
                {connector.phase}
              </Badge>
            </div>
            <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.6, marginBottom: 12 }}>
              {connector.description}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <div style={{ fontSize: 11, color: '#6B7280' }}>
                <span style={{ fontWeight: 700 }}>Signals: </span>{connector.signals}
              </div>
              <div style={{ fontSize: 11, color: '#6B7280' }}>
                <span style={{ fontWeight: 700 }}>Frequency: </span>{connector.frequency}
              </div>
              <Badge style={{ background: connector.category === 'Internal' ? 'rgba(10,15,46,0.06)' : connector.category === 'Platform' ? 'rgba(43,138,110,0.08)' : 'rgba(201,168,76,0.08)', color: NAVY, border: 'none', fontSize: 9 }}>
                {connector.category}
              </Badge>
            </div>
          </div>
        </div>

        {connector.setupRequired && connector.status === 'available' && (
          <Button
            onClick={onSetup}
            style={{ background: NAVY, color: '#fff', borderRadius: '0.15rem', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            Configure
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        )}
        {connector.status === 'active' && (
          <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: TEAL }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: TEAL }}>Monitoring</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function SignalConnectors() {
  const { toast } = useToast();
  const [m365DialogOpen, setM365DialogOpen] = useState(false);
  const [erpDialogOpen, setErpDialogOpen] = useState(false);

  const { data: raw } = useQuery({ queryKey: ['/api/signal-connectors'] });
  const connectors = Array.isArray(raw) ? raw : [];

  const { data: m365StatusRaw } = useQuery({ queryKey: ['/api/signal-connectors/m365/status'] });
  const m365Status = m365StatusRaw as any;

  const { data: taxonomyRaw } = useQuery({ queryKey: ['/api/trigger-taxonomy'] });
  const taxonomy = taxonomyRaw as any;

  const calibrateMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/signal-learning/calibrate', {}),
    onSuccess: () => toast({ title: 'Calibration complete', description: 'Organization signal thresholds updated from activation history.' }),
    onError: () => toast({ title: 'Calibration failed', variant: 'destructive' }),
  });

  const domainLearningMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/signal-learning/domain', {}),
    onSuccess: () => toast({ title: 'Domain learning complete', description: 'Leading indicator weights updated from platform data.' }),
    onError: () => toast({ title: 'Domain learning failed', variant: 'destructive' }),
  });

  const externalConnectors = CONNECTOR_CATALOG.filter(c => c.category === 'External');
  const internalConnectors = CONNECTOR_CATALOG.filter(c => c.category === 'Internal');
  const platformConnectors = CONNECTOR_CATALOG.filter(c => c.category === 'Platform');

  function handleSetup(connectorId: string) {
    if (connectorId === 'microsoft365') setM365DialogOpen(true);
    if (connectorId === 'financial-erp') setErpDialogOpen(true);
    if (connectorId === 'salesforce') {
      toast({ title: 'Salesforce connector', description: 'Contact your Founding Partner coordinator to configure your Salesforce integration.' });
    }
  }

  return (
    <PageLayout>
      <div style={{ background: '#F8F7F4', minHeight: '100vh' }}>

        {/* Header */}
        <div style={{ background: NAVY, padding: '56px 64px 48px' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 24, height: 2, background: GOLD }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD }}>
                Signal Architecture
              </span>
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 700, color: '#fff', marginBottom: 12 }}>
              Signal Connectors
            </h1>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', maxWidth: 640, lineHeight: 1.7 }}>
              The complete signal architecture — external market signals, internal Microsoft 365 and CRM signals,
              readiness monitoring, and the continuous learning engine that compounds in accuracy with every activation.
            </p>

            <div className="flex items-center gap-8 mt-8">
              {[
                { label: 'Active Connectors', value: CONNECTOR_CATALOG.filter(c => c.status === 'active').length },
                { label: 'Monitoring Points', value: '248+' },
                { label: 'Signal Domains', value: '9' },
                { label: 'Ingestion Cycle', value: '15 min' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div style={{ fontSize: 26, fontWeight: 700, color: '#fff', fontFamily: "'Cormorant Garamond', serif" }}>{value}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '48px 64px' }}>
          <Tabs defaultValue="connectors" className="w-full">
            <TabsList style={{ background: 'transparent', borderBottom: '1px solid #E8E4DC', width: '100%', justifyContent: 'flex-start', borderRadius: 0, height: 'auto', padding: 0, marginBottom: 40 }}>
              {[
                { key: 'connectors', label: 'Signal Sources' },
                { key: 'taxonomy', label: 'Trigger Taxonomy' },
                { key: 'learning', label: 'Learning Engine' },
              ].map(tab => (
                <TabsTrigger
                  key={tab.key}
                  value={tab.key}
                  style={{ background: 'transparent', border: 'none', borderBottom: '2px solid transparent', borderRadius: 0, padding: '14px 28px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9CA3AF' }}
                  className="data-[state=active]:border-b-[#0A0F2E] data-[state=active]:text-[#0A0F2E]"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* ── Signal Sources Tab ─────────────────────────────────────────── */}
            <TabsContent value="connectors">
              <div className="space-y-10">

                {/* External */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <div style={{ width: 20, height: 2, background: TEAL }} />
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: TEAL }}>External Signal Sources</span>
                  </div>
                  <div className="space-y-4">
                    {externalConnectors.map(c => (
                      <ConnectorCard key={c.id} connector={c} onSetup={() => handleSetup(c.id)} />
                    ))}
                  </div>
                </div>

                {/* Internal */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 20, height: 2, background: GOLD }} />
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: GOLD }}>Internal Signal Sources</span>
                    <span style={{ fontSize: 11, color: '#9CA3AF' }}>— Founding Partner configuration required</span>
                  </div>
                  <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', padding: '12px 20px', borderRadius: '0.15rem', marginBottom: 16 }}>
                    <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6 }}>
                      <strong style={{ color: NAVY }}>Microsoft framing:</strong> Every enterprise has Microsoft's AI stack.
                      None have the operating model to use it. Internal connectors give Readiness OS access to signals
                      no external platform can see — coordination patterns, identity alerts, and financial metrics from
                      inside the organization's own systems.
                    </p>
                  </div>
                  <div className="space-y-4">
                    {internalConnectors.map(c => (
                      <ConnectorCard key={c.id} connector={c} onSetup={() => handleSetup(c.id)} />
                    ))}
                  </div>
                </div>

                {/* Platform */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <div style={{ width: 20, height: 2, background: NAVY }} />
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: NAVY }}>Platform Intelligence</span>
                  </div>
                  <div className="space-y-4">
                    {platformConnectors.map(c => (
                      <ConnectorCard key={c.id} connector={c} onSetup={() => handleSetup(c.id)} />
                    ))}
                  </div>
                  <div className="mt-6">
                    <OntologyStatsPanel />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ── Trigger Taxonomy Tab ───────────────────────────────────────── */}
            <TabsContent value="taxonomy">
              <div className="space-y-6">
                <div style={{ border: '1px solid #E8E4DC', padding: 28, background: '#fff' }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: NAVY, marginBottom: 8 }}>
                    Trigger Portfolio Coverage Analysis
                  </h3>
                  <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 20 }}>
                    Your current trigger configuration measured against the recommended portfolio for Fortune 1000 organizations.
                    Unconfigured domains represent blind spots — situations where a trigger could fire with no staged response ready.
                  </p>

                  {taxonomy && (
                    <div className="flex items-center gap-8 mb-6">
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 48, fontWeight: 700, color: taxonomy.coverageScore >= 75 ? TEAL : taxonomy.coverageScore >= 40 ? GOLD : '#ef4444', fontFamily: "'Cormorant Garamond', serif" }}>
                          {taxonomy.coverageScore}%
                        </div>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9CA3AF' }}>Coverage Score</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 14, color: NAVY, fontWeight: 600 }}>{taxonomy.totalConfigured} of {taxonomy.totalRecommended} recommended triggers configured</div>
                        {taxonomy.criticalGaps?.length > 0 && (
                          <div style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>
                            {taxonomy.criticalGaps.length} domain(s) with zero coverage: {taxonomy.criticalGaps.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {Array.isArray(taxonomy?.recommendations) && taxonomy.recommendations.map((rec: any) => {
                    const gapColors: Record<string, string> = {
                      'not-configured': '#ef4444',
                      'partially-configured': GOLD,
                      'fully-configured': TEAL,
                    };
                    const gapLabels: Record<string, string> = {
                      'not-configured': 'No Coverage',
                      'partially-configured': 'Partial Coverage',
                      'fully-configured': 'Full Coverage',
                    };
                    return (
                      <div key={rec.domain} style={{ border: '1px solid #E8E4DC', padding: '20px 24px', background: '#fff', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                        <div style={{ width: 4, alignSelf: 'stretch', background: gapColors[rec.gapStatus], flexShrink: 0 }} />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 600, color: NAVY }}>{rec.domain}</h4>
                            <Badge style={{ background: `${gapColors[rec.gapStatus]}15`, color: gapColors[rec.gapStatus], border: 'none', fontSize: 9, fontWeight: 700 }}>
                              {gapLabels[rec.gapStatus]}
                            </Badge>
                            <Badge style={{ background: '#F3F4F6', color: '#6B7280', border: 'none', fontSize: 9 }}>
                              Priority {rec.priority}/10
                            </Badge>
                          </div>
                          <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6, marginBottom: 10 }}>{rec.rationale}</p>
                          <div className="flex flex-wrap gap-2">
                            {rec.triggers.map((t: string) => (
                              <span key={t} style={{ fontSize: 11, padding: '2px 10px', background: rec.missingTriggers?.includes(t) ? 'rgba(239,68,68,0.08)' : 'rgba(43,138,110,0.08)', color: rec.missingTriggers?.includes(t) ? '#ef4444' : TEAL, borderRadius: '0.15rem', fontWeight: 600 }}>
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div style={{ fontSize: 12, color: '#9CA3AF', flexShrink: 0, textAlign: 'right' }}>
                          {rec.configuredCount}/{rec.totalCount} triggers
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            {/* ── Learning Engine Tab ────────────────────────────────────────── */}
            <TabsContent value="learning">
              <div className="space-y-6">
                <div style={{ border: '1px solid #E8E4DC', padding: 32, background: '#fff' }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: NAVY, marginBottom: 8 }}>
                    Continuous Learning Architecture
                  </h3>
                  <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.7, marginBottom: 20 }}>
                    The permanent competitive advantage. An architecture that compounds in accuracy with every activation
                    across every organization in the platform. Signal Labs can raise more money — they cannot replicate
                    activation history and encoded organizational learning.
                  </p>
                  <div style={{ background: 'rgba(10,15,46,0.04)', border: '1px solid #E8E4DC', padding: '12px 20px', borderRadius: '0.15rem' }}>
                    <div className="flex items-start gap-2">
                      <Lock className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: NAVY }} />
                      <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.6 }}>
                        <strong>Privacy rule (locked):</strong> Cross-organization learning uses anonymized aggregate patterns only.
                        Individual organization activation data is never shared with or used to improve detection for other organizations.
                        All learning jobs log audit records for governance review.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      job: 'Organization Calibration',
                      level: 'Organization',
                      input: 'Close-Out Gate answers, activation outcomes (own org only)',
                      output: 'Calibrated confidence thresholds specific to this organization\'s actual trigger landscape',
                      frequency: 'After each Close-Out Gate completion',
                      privacy: 'Own data only',
                      action: () => calibrateMutation.mutate(),
                      actionLabel: 'Run Calibration',
                      isPending: calibrateMutation.isPending,
                    },
                    {
                      job: 'Domain Learning',
                      level: 'Domain',
                      input: 'All confirmed leading indicator detections (anonymized)',
                      output: 'Improved leading indicator weights for each trigger type across the platform',
                      frequency: 'Weekly',
                      privacy: 'Anonymized aggregate',
                      action: () => domainLearningMutation.mutate(),
                      actionLabel: 'Run Domain Learning',
                      isPending: domainLearningMutation.isPending,
                    },
                    {
                      job: 'Ontology Enrichment',
                      level: 'Platform',
                      input: 'Trigger detection → activation correlation (anonymized)',
                      output: 'Enriched signal ontology edges with updated evidence count and weight',
                      frequency: 'Monthly',
                      privacy: 'Anonymized aggregate',
                      action: null,
                      actionLabel: 'Scheduled Monthly',
                      isPending: false,
                    },
                    {
                      job: 'Industry Profile Update',
                      level: 'Industry',
                      input: 'All activations grouped by Industry Protocol Pack (anonymized)',
                      output: 'Industry-specific signal profiles — healthcare ransomware looks different from fintech ransomware',
                      frequency: 'Quarterly',
                      privacy: 'Anonymized aggregate',
                      action: null,
                      actionLabel: 'Scheduled Quarterly',
                      isPending: false,
                    },
                  ].map(item => (
                    <div key={item.job} style={{ border: '1px solid #E8E4DC', padding: 24, background: '#fff' }}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 600, color: NAVY }}>{item.job}</h4>
                          <Badge style={{ background: 'rgba(43,138,110,0.1)', color: TEAL, border: 'none', fontSize: 9, marginTop: 4 }}>
                            {item.level} Level
                          </Badge>
                        </div>
                        <div style={{ textAlign: 'right', fontSize: 11, color: '#9CA3AF' }}>
                          <div style={{ fontWeight: 700 }}>{item.frequency}</div>
                          <div style={{ marginTop: 2 }}>{item.privacy}</div>
                        </div>
                      </div>
                      <Separator style={{ marginBottom: 12 }} />
                      <div className="space-y-2 mb-4">
                        <div style={{ fontSize: 11, color: '#6B7280' }}><strong style={{ color: NAVY }}>Input: </strong>{item.input}</div>
                        <div style={{ fontSize: 11, color: '#6B7280' }}><strong style={{ color: NAVY }}>Output: </strong>{item.output}</div>
                      </div>
                      {item.action ? (
                        <Button
                          size="sm"
                          onClick={item.action}
                          disabled={item.isPending}
                          style={{ background: NAVY, color: '#fff', borderRadius: '0.15rem', fontSize: 11, fontWeight: 700 }}
                        >
                          {item.isPending ? 'Running...' : item.actionLabel}
                        </Button>
                      ) : (
                        <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>{item.actionLabel}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <M365ConfigDialog open={m365DialogOpen} onClose={() => setM365DialogOpen(false)} />
      <ERPWebhookDialog open={erpDialogOpen} onClose={() => setErpDialogOpen(false)} />
    </PageLayout>
  );
}
