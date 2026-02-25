import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { SiJira, SiSlack, SiSalesforce, SiGooglecloud, SiOkta, SiSap, SiConfluence, SiPagerduty, SiDatadog, SiSplunk, SiTableau } from 'react-icons/si';
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
  Search,
  BarChart3,
  Database,
  Lock,
  Mail,
  Calendar,
  FileText,
  Activity,
  Cloud,
  Monitor,
  Key,
  Building2,
  Briefcase,
  HardDrive,
  Eye,
  Megaphone,
  TrendingUp,
  Layers,
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
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  category: 'project_management' | 'communication' | 'crm' | 'security' | 'cloud' | 'analytics' | 'hr_finance' | 'documentation' | 'monitoring';
  connectionType: 'oauth' | 'api_key' | 'webhook' | 'saml';
  capabilities: { icon: any; label: string }[];
  enablesDescription: string;
  featured?: boolean;
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
    category: 'project_management',
    connectionType: 'oauth',
    featured: true,
    capabilities: [
      { icon: ClipboardList, label: 'Create projects & tasks automatically' },
      { icon: Users, label: 'Assign stakeholders to action items' },
      { icon: Zap, label: 'Sync execution status in real-time' },
      { icon: RefreshCw, label: 'Two-way progress tracking' },
    ],
    enablesDescription: 'When you connect Jira, Execution OS will create real projects and tasks during playbook activation. Execution plans become live Jira boards with automated task assignment, status tracking, and sprint coordination.',
  },
  {
    key: 'slack',
    name: 'Slack',
    description: 'Team communication and real-time notification delivery for crisis coordination.',
    icon: SiSlack,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    category: 'communication',
    connectionType: 'oauth',
    featured: true,
    capabilities: [
      { icon: Bell, label: 'Instant stakeholder notifications' },
      { icon: MessageSquare, label: 'Dedicated crisis channels' },
      { icon: Users, label: 'Team coordination & escalation' },
      { icon: Zap, label: 'Automated status updates' },
    ],
    enablesDescription: 'When you connect Slack, Execution OS will send real-time alerts to stakeholders during playbook activation. Crisis channels are created automatically, and team members receive instant notifications with action items and status updates.',
  },
  {
    key: 'salesforce',
    name: 'Salesforce',
    description: 'Enterprise CRM for customer relationship management, pipeline tracking, and account intelligence.',
    icon: SiSalesforce,
    color: 'text-sky-400',
    bgColor: 'bg-sky-500/10',
    borderColor: 'border-sky-500/20',
    category: 'crm',
    connectionType: 'oauth',
    featured: true,
    capabilities: [
      { icon: Database, label: 'Bi-directional contact & account sync' },
      { icon: TrendingUp, label: 'Pipeline intelligence for triggers' },
      { icon: Users, label: 'Stakeholder mapping from accounts' },
      { icon: BarChart3, label: 'Revenue impact tracking' },
    ],
    enablesDescription: 'Salesforce integration enables Execution OS to pull account data for stakeholder mapping, sync execution outcomes to opportunities, and trigger playbooks based on pipeline changes or deal stage transitions.',
  },
  {
    key: 'hubspot',
    name: 'HubSpot',
    description: 'Marketing automation, CRM, and customer engagement platform for growth-stage coordination.',
    icon: Megaphone,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    category: 'crm',
    connectionType: 'api_key',
    capabilities: [
      { icon: Mail, label: 'Automated stakeholder email sequences' },
      { icon: Users, label: 'Contact & company data sync' },
      { icon: TrendingUp, label: 'Deal pipeline trigger monitoring' },
      { icon: BarChart3, label: 'Campaign performance analytics' },
    ],
    enablesDescription: 'HubSpot integration powers marketing-triggered playbooks, syncs contact data for stakeholder identification, and enables automated email sequences during execution phases.',
  },
  {
    key: 'microsoft-teams',
    name: 'Microsoft Teams',
    description: 'Enterprise collaboration platform for video meetings, chat, and file sharing coordination.',
    icon: MessageSquare,
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/20',
    category: 'communication',
    connectionType: 'oauth',
    featured: true,
    capabilities: [
      { icon: MessageSquare, label: 'War room channel creation' },
      { icon: Bell, label: 'Adaptive card notifications' },
      { icon: Calendar, label: 'Meeting scheduling automation' },
      { icon: FileText, label: 'Document sharing & collaboration' },
    ],
    enablesDescription: 'Microsoft Teams integration enables Execution OS to create dedicated war room channels, send adaptive card notifications to stakeholders, auto-schedule crisis meetings, and share execution documents.',
  },
  {
    key: 'servicenow',
    name: 'ServiceNow',
    description: 'IT service management, workflow orchestration, and enterprise operations coordination.',
    icon: Layers,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
    category: 'project_management',
    connectionType: 'api_key',
    featured: true,
    capabilities: [
      { icon: ClipboardList, label: 'Incident & change management sync' },
      { icon: Layers, label: 'CMDB asset correlation' },
      { icon: Zap, label: 'Workflow automation triggers' },
      { icon: RefreshCw, label: 'Bi-directional status updates' },
    ],
    enablesDescription: 'ServiceNow integration enables Execution OS to create incidents, changes, and tasks automatically. Crisis playbooks trigger ServiceNow workflows, and execution status syncs bi-directionally.',
  },
  {
    key: 'google-workspace',
    name: 'Google Workspace',
    description: 'Google Calendar, Gmail, Drive, and Docs integration for scheduling and document automation.',
    icon: SiGooglecloud,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    category: 'communication',
    connectionType: 'oauth',
    capabilities: [
      { icon: Calendar, label: 'Calendar event auto-creation' },
      { icon: Mail, label: 'Gmail notification delivery' },
      { icon: FileText, label: 'Doc & Sheet auto-generation' },
      { icon: HardDrive, label: 'Drive folder organization' },
    ],
    enablesDescription: 'Google Workspace integration auto-creates calendar events for stakeholder coordination, generates execution documents in Docs/Sheets, and delivers Gmail notifications during playbook activation.',
  },
  {
    key: 'outlook-exchange',
    name: 'Outlook / Exchange',
    description: 'Microsoft email and calendar integration for enterprise communication and scheduling.',
    icon: Mail,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    category: 'communication',
    connectionType: 'oauth',
    capabilities: [
      { icon: Mail, label: 'Email notification delivery' },
      { icon: Calendar, label: 'Calendar meeting scheduling' },
      { icon: Users, label: 'Distribution list coordination' },
      { icon: FileText, label: 'Attachment staging & delivery' },
    ],
    enablesDescription: 'Outlook/Exchange integration delivers execution notifications via corporate email, auto-schedules meetings with stakeholders, and stages document attachments for review.',
  },
  {
    key: 'aws-cloudwatch',
    name: 'AWS CloudWatch',
    description: 'Cloud infrastructure monitoring, alerting, and resource management for technical triggers.',
    icon: Cloud,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    category: 'cloud',
    connectionType: 'api_key',
    capabilities: [
      { icon: Activity, label: 'Infrastructure alert triggers' },
      { icon: Monitor, label: 'Real-time metric monitoring' },
      { icon: Bell, label: 'Threshold-based playbook activation' },
      { icon: BarChart3, label: 'Performance analytics' },
    ],
    enablesDescription: 'AWS CloudWatch integration enables infrastructure-triggered playbooks. CPU spikes, latency thresholds, or service outages automatically activate the appropriate crisis or cyber response playbooks.',
  },
  {
    key: 'okta',
    name: 'Okta',
    description: 'Identity and access management for SSO, MFA, and user provisioning across enterprise systems.',
    icon: SiOkta,
    color: 'text-blue-300',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400/20',
    category: 'security',
    connectionType: 'saml',
    capabilities: [
      { icon: Lock, label: 'Single Sign-On (SSO) integration' },
      { icon: Shield, label: 'Multi-factor authentication' },
      { icon: Users, label: 'Automated user provisioning' },
      { icon: Eye, label: 'Access audit logging' },
    ],
    enablesDescription: 'Okta integration provides enterprise-grade SSO for Execution OS access, syncs organizational directory for stakeholder mapping, and triggers security playbooks on suspicious access events.',
  },
  {
    key: 'microsoft-ad',
    name: 'Microsoft Active Directory',
    description: 'Enterprise directory services for identity management, group policies, and access control.',
    icon: Building2,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/20',
    category: 'security',
    connectionType: 'saml',
    capabilities: [
      { icon: Users, label: 'Organizational hierarchy sync' },
      { icon: Lock, label: 'Group-based access policies' },
      { icon: Key, label: 'LDAP authentication' },
      { icon: Shield, label: 'Security group management' },
    ],
    enablesDescription: 'Active Directory integration syncs your organizational hierarchy for automatic stakeholder identification and routing. Security group changes can trigger access-related playbooks.',
  },
  {
    key: 'workday',
    name: 'Workday',
    description: 'Human capital management, financial planning, and workforce analytics integration.',
    icon: Briefcase,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    category: 'hr_finance',
    connectionType: 'api_key',
    capabilities: [
      { icon: Users, label: 'Employee & org chart sync' },
      { icon: Briefcase, label: 'Position & role mapping' },
      { icon: BarChart3, label: 'Workforce analytics integration' },
      { icon: Calendar, label: 'Leave & availability data' },
    ],
    enablesDescription: 'Workday integration maps your workforce to Execution OS stakeholder roles, provides real-time availability data for execution coordination, and syncs financial planning data for budget allocation.',
  },
  {
    key: 'sap',
    name: 'SAP',
    description: 'Enterprise resource planning for supply chain, manufacturing, and financial operations.',
    icon: SiSap,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    category: 'hr_finance',
    connectionType: 'api_key',
    capabilities: [
      { icon: Layers, label: 'Supply chain signal monitoring' },
      { icon: Database, label: 'Material & inventory tracking' },
      { icon: BarChart3, label: 'Financial reporting integration' },
      { icon: Zap, label: 'Procurement automation triggers' },
    ],
    enablesDescription: 'SAP integration enables supply chain and manufacturing playbooks. Inventory thresholds, supplier disruptions, and procurement events automatically trigger the appropriate response playbooks.',
  },
  {
    key: 'confluence',
    name: 'Confluence',
    description: 'Atlassian knowledge management for documentation, playbook storage, and institutional learning.',
    icon: SiConfluence,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    category: 'documentation',
    connectionType: 'oauth',
    capabilities: [
      { icon: FileText, label: 'Auto-generate execution documents' },
      { icon: Database, label: 'Playbook knowledge base sync' },
      { icon: RefreshCw, label: 'Retrospective documentation' },
      { icon: Users, label: 'Collaborative editing & review' },
    ],
    enablesDescription: 'Confluence integration auto-generates execution documentation, stores playbook templates, and captures institutional learning from completed activations into your knowledge base.',
  },
  {
    key: 'docusign',
    name: 'DocuSign',
    description: 'Electronic signature and agreement management for rapid contract execution.',
    icon: FileText,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
    category: 'documentation',
    connectionType: 'api_key',
    capabilities: [
      { icon: FileText, label: 'Automated contract staging' },
      { icon: Key, label: 'E-signature workflow triggers' },
      { icon: Zap, label: 'Rapid approval routing' },
      { icon: CheckCircle, label: 'Completion tracking & audit' },
    ],
    enablesDescription: 'DocuSign integration stages contracts and agreements during M&A, market entry, and regulatory playbooks. Pre-approved documents route automatically for signature during execution.',
  },
  {
    key: 'pagerduty',
    name: 'PagerDuty',
    description: 'Incident management and on-call alerting for technical crisis response coordination.',
    icon: SiPagerduty,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    category: 'monitoring',
    connectionType: 'api_key',
    capabilities: [
      { icon: Bell, label: 'On-call alerting & escalation' },
      { icon: AlertTriangle, label: 'Incident trigger detection' },
      { icon: Users, label: 'Responder coordination' },
      { icon: Activity, label: 'Service health monitoring' },
    ],
    enablesDescription: 'PagerDuty integration triggers cyber and crisis playbooks from critical incidents. On-call teams are automatically coordinated and escalation policies align with Execution OS stakeholder mapping.',
  },
  {
    key: 'datadog',
    name: 'Datadog',
    description: 'Infrastructure and application monitoring for real-time observability and alerting.',
    icon: SiDatadog,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    category: 'monitoring',
    connectionType: 'api_key',
    capabilities: [
      { icon: Monitor, label: 'APM & infrastructure signals' },
      { icon: BarChart3, label: 'Custom metric dashboards' },
      { icon: Bell, label: 'Anomaly detection triggers' },
      { icon: Activity, label: 'Log-based playbook activation' },
    ],
    enablesDescription: 'Datadog integration provides real-time infrastructure signals that can trigger digital transformation and cybersecurity playbooks. Anomaly detection feeds into Execution OS signal processing.',
  },
  {
    key: 'splunk',
    name: 'Splunk',
    description: 'Security information and event management (SIEM) for threat detection and compliance.',
    icon: SiSplunk,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    category: 'security',
    connectionType: 'api_key',
    capabilities: [
      { icon: Shield, label: 'SIEM event correlation' },
      { icon: Eye, label: 'Threat intelligence feeds' },
      { icon: AlertTriangle, label: 'Security incident triggers' },
      { icon: BarChart3, label: 'Compliance reporting' },
    ],
    enablesDescription: 'Splunk SIEM integration enables cybersecurity playbook triggers from correlated security events, suspicious activity detection, and compliance violations across your infrastructure.',
  },
  {
    key: 'tableau',
    name: 'Tableau',
    description: 'Business intelligence and data visualization for executive dashboard embedding.',
    icon: SiTableau,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    category: 'analytics',
    connectionType: 'api_key',
    capabilities: [
      { icon: BarChart3, label: 'Executive dashboard embedding' },
      { icon: TrendingUp, label: 'KPI threshold monitoring' },
      { icon: Database, label: 'Data source integration' },
      { icon: Eye, label: 'Visual analytics reporting' },
    ],
    enablesDescription: 'Tableau integration embeds executive dashboards into Execution OS, monitors KPI thresholds for trigger activation, and provides visual analytics for playbook outcome reporting.',
  },
  {
    key: 'power-bi',
    name: 'Power BI',
    description: 'Microsoft business analytics for reporting, dashboards, and data-driven decision support.',
    icon: BarChart3,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
    category: 'analytics',
    connectionType: 'api_key',
    capabilities: [
      { icon: BarChart3, label: 'Report embedding & sharing' },
      { icon: TrendingUp, label: 'Data-driven trigger alerts' },
      { icon: Database, label: 'DirectQuery data connectivity' },
      { icon: Eye, label: 'Executive scorecards' },
    ],
    enablesDescription: 'Power BI integration provides embedded analytics and scorecards within Execution OS. Metric thresholds in Power BI datasets can trigger strategic playbook activations automatically.',
  },
  {
    key: 'crowdstrike',
    name: 'CrowdStrike Falcon',
    description: 'Endpoint detection and response (EDR) platform for advanced threat protection.',
    icon: Shield,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    category: 'security',
    connectionType: 'api_key',
    capabilities: [
      { icon: Shield, label: 'Endpoint threat detection' },
      { icon: AlertTriangle, label: 'Ransomware alert triggers' },
      { icon: Activity, label: 'Real-time threat hunting' },
      { icon: Eye, label: 'Forensic investigation support' },
    ],
    enablesDescription: 'CrowdStrike integration triggers cybersecurity playbooks from endpoint threats, ransomware detection, and advanced persistent threats. Threat intelligence feeds directly into signal processing.',
  },
  {
    key: 'sendgrid',
    name: 'SendGrid',
    description: 'Email delivery platform for transactional notifications and stakeholder communications.',
    icon: Mail,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    category: 'communication',
    connectionType: 'api_key',
    capabilities: [
      { icon: Mail, label: 'Transactional email delivery' },
      { icon: Bell, label: 'Stakeholder notification emails' },
      { icon: BarChart3, label: 'Delivery analytics & tracking' },
      { icon: Users, label: 'Distribution list management' },
    ],
    enablesDescription: 'SendGrid integration powers email notifications during playbook activation, delivering branded stakeholder communications, execution updates, and escalation alerts at scale.',
  },
  {
    key: 'bloomberg',
    name: 'Bloomberg Terminal',
    description: 'Financial data, market intelligence, and news feeds for strategic trigger monitoring.',
    icon: TrendingUp,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    category: 'analytics',
    connectionType: 'api_key',
    capabilities: [
      { icon: TrendingUp, label: 'Real-time market data feeds' },
      { icon: Globe, label: 'Global news & event detection' },
      { icon: BarChart3, label: 'Financial signal processing' },
      { icon: Bell, label: 'Price & volume alert triggers' },
    ],
    enablesDescription: 'Bloomberg integration provides real-time market intelligence feeds that trigger M&A, competitive response, and market entry playbooks based on price movements, news events, and regulatory filings.',
  },
  {
    key: 'reuters',
    name: 'Reuters / Refinitiv',
    description: 'Global news and financial data for competitive intelligence and regulatory monitoring.',
    icon: Globe,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    category: 'analytics',
    connectionType: 'api_key',
    capabilities: [
      { icon: Globe, label: 'Global news feed monitoring' },
      { icon: AlertTriangle, label: 'Regulatory change detection' },
      { icon: TrendingUp, label: 'Competitor activity tracking' },
      { icon: Bell, label: 'Breaking news triggers' },
    ],
    enablesDescription: 'Reuters integration monitors global news, regulatory changes, and competitor announcements that can trigger strategic playbooks. Breaking news events automatically activate the appropriate response protocols.',
  },
];

const CATEGORY_LABELS: Record<string, { label: string; icon: any; color: string }> = {
  project_management: { label: 'Project Management', icon: ClipboardList, color: 'text-blue-400' },
  communication: { label: 'Communication & Collaboration', icon: MessageSquare, color: 'text-purple-400' },
  crm: { label: 'CRM & Sales', icon: Database, color: 'text-sky-400' },
  security: { label: 'Security & Identity', icon: Shield, color: 'text-red-400' },
  cloud: { label: 'Cloud Infrastructure', icon: Cloud, color: 'text-amber-400' },
  analytics: { label: 'Analytics & Intelligence', icon: BarChart3, color: 'text-green-400' },
  hr_finance: { label: 'HR & Finance', icon: Briefcase, color: 'text-orange-400' },
  documentation: { label: 'Documentation & Agreements', icon: FileText, color: 'text-yellow-400' },
  monitoring: { label: 'Monitoring & Incident Response', icon: Activity, color: 'text-pink-400' },
};

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
      return null;
  }
}

function getConnectionTypeBadge(type: string) {
  const styles: Record<string, { label: string; className: string }> = {
    oauth: { label: 'OAuth 2.0', className: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    api_key: { label: 'API Key', className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    webhook: { label: 'Webhook', className: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    saml: { label: 'SAML/SSO', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  };
  const s = styles[type] || styles.api_key;
  return <Badge variant="outline" className={`text-[10px] ${s.className}`}>{s.label}</Badge>;
}

export default function IntegrationConnections() {
  const { toast } = useToast();
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

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

  const handleConnect = async (integrationKey: string, connectionType: string) => {
    if (connectionType === 'oauth' && integrationKey === 'jira') {
      window.location.href = `/api/integrations/jira/auth?orgId=${organizationId}`;
    } else if (connectionType === 'oauth' && (integrationKey === 'jira_legacy' || integrationKey === 'slack')) {
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
    } else {
      toast({
        title: 'Configuration Required',
        description: `Contact your administrator to configure the ${integrationKey} integration credentials in Settings > Enterprise Integrations.`,
      });
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

  const filteredIntegrations = INTEGRATIONS.filter(i => {
    const matchesSearch = searchTerm === '' ||
      i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || i.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(INTEGRATIONS.map(i => i.category)))];
  const connectedCount = data?.integrations?.filter(i => i.status === 'connected').length ?? 0;
  const featuredIntegrations = INTEGRATIONS.filter(i => i.featured);

  return (
    <PageLayout>
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-10">

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <Globe className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Enterprise Integration Hub</h1>
                <p className="text-gray-800 text-sm mt-0.5">Connect your enterprise stack to power real-time strategic execution across {INTEGRATIONS.length} tools</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white border-gray-200">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-blue-500/10">
                  <Globe className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{INTEGRATIONS.length}</div>
                  <div className="text-xs text-gray-800">Total Integrations</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-gray-200">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-emerald-500/10">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{connectedCount}</div>
                  <div className="text-xs text-gray-800">Connected</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-gray-200">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-purple-500/10">
                  <Layers className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{Object.keys(CATEGORY_LABELS).length}</div>
                  <div className="text-xs text-gray-800">Categories</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-gray-200">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-amber-500/10">
                  <Shield className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">Enterprise</div>
                  <div className="text-xs text-gray-800">Security Grade</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 bg-white border-gray-200 text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Execution OS Orchestrates</h3>
              <p className="text-sm text-gray-800">Strategic playbooks trigger coordinated actions across your entire enterprise stack simultaneously</p>
            </Card>
            <Card className="p-6 bg-white border-gray-200 text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Database className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Your Tools Execute</h3>
              <p className="text-sm text-gray-800">Jira, Slack, Salesforce, ServiceNow, Teams, and 20+ tools carry out the operational work</p>
            </Card>
            <Card className="p-6 bg-white border-gray-200 text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Everything Syncs</h3>
              <p className="text-sm text-gray-800">Bi-directional updates keep Execution OS and all your tools in perfect alignment during execution</p>
            </Card>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-800" />
                <Input
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search integrations..."
                  className="pl-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-500"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map(cat => {
                  const catInfo = cat === 'all' ? { label: 'All', icon: Globe, color: 'text-gray-900' } : CATEGORY_LABELS[cat];
                  if (!catInfo) return null;
                  const isActive = activeCategory === cat;
                  return (
                    <Button
                      key={cat}
                      variant={isActive ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveCategory(cat)}
                      className={`text-xs ${isActive ? 'bg-blue-600 text-gray-900' : 'border-gray-200 text-gray-800 hover:text-white hover:bg-gray-800'}`}
                    >
                      {catInfo.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="text-sm text-gray-800">
              Showing {filteredIntegrations.length} of {INTEGRATIONS.length} integrations
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              <span className="ml-3 text-gray-800">Loading integrations...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredIntegrations.map((config) => {
                const integration = getIntegrationStatus(config.key);
                const status = integration?.status ?? 'not_connected';
                const isConnected = status === 'connected';
                const isOAuthAvailable = (data?.available as any)?.[config.key]?.configured;
                const Icon = config.icon;

                return (
                  <Card key={config.key} className={`bg-white border-gray-200 overflow-hidden transition-all hover:border-gray-700 ${isConnected ? 'ring-1 ring-emerald-500/20' : ''}`}>
                    <CardContent className="p-5 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl ${config.bgColor} border ${config.borderColor}`}>
                            <Icon className={`w-5 h-5 ${config.color}`} />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900">{config.name}</h3>
                            <p className="text-xs text-gray-800 mt-0.5 line-clamp-1">{config.description}</p>
                          </div>
                        </div>
                        {isConnected ? getStatusBadge(status) : getConnectionTypeBadge(config.connectionType)}
                      </div>

                      {integration?.error && (
                        <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-300">
                          <AlertTriangle className="w-3 h-3 inline mr-1" />
                          {integration.error}
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-1.5">
                        {config.capabilities.map((cap, idx) => {
                          const CapIcon = cap.icon;
                          return (
                            <div key={idx} className="flex items-center gap-1.5 text-[11px] text-gray-800 py-1">
                              <CapIcon className="w-3 h-3 text-gray-800 flex-shrink-0" />
                              <span className="line-clamp-1">{cap.label}</span>
                            </div>
                          );
                        })}
                      </div>

                      {isConnected && integration?.connectedAt && (
                        <div className="text-[10px] text-gray-800">
                          Connected {new Date(integration.connectedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          {integration.lastSync && (
                            <> · Last synced {new Date(integration.lastSync).toLocaleTimeString()}</>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-1 border-t border-gray-200">
                        {isConnected ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-gray-200 text-gray-800 hover:bg-gray-800 gap-1 text-xs h-8"
                              onClick={() => handleTest(config.key, integration!.id)}
                              disabled={testingId === config.key}
                            >
                              {testingId === config.key ? <Loader2 className="w-3 h-3 animate-spin" /> : <TestTube className="w-3 h-3" />}
                              Test
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-800/50 text-red-400 hover:bg-red-500/10 gap-1 text-xs h-8"
                              onClick={() => disconnectMutation.mutate(integration!.id)}
                              disabled={disconnectMutation.isPending}
                            >
                              {disconnectMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Unlink className="w-3 h-3" />}
                              Disconnect
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-gray-900 gap-1 text-xs h-8"
                            onClick={() => handleConnect(config.key, config.connectionType)}
                            disabled={connectingId === config.key}
                          >
                            {connectingId === config.key ? <Loader2 className="w-3 h-3 animate-spin" /> : <Link2 className="w-3 h-3" />}
                            Connect
                          </Button>
                        )}
                        <Badge variant="outline" className="text-[9px] text-gray-800 border-gray-200 ml-auto">
                          {CATEGORY_LABELS[config.category]?.label || config.category}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                How Integrations Power Execution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                {featuredIntegrations.map((config) => {
                  const Icon = config.icon;
                  return (
                    <div key={config.key} className="flex gap-4">
                      <div className={`p-2 rounded-lg ${config.bgColor} border ${config.borderColor} h-fit mt-0.5`}>
                        <Icon className={`w-4 h-4 ${config.color}`} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">{config.name}</h4>
                        <p className="text-xs text-gray-800 leading-relaxed">{config.enablesDescription}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-xs text-gray-800">
                  <Shield className="w-3.5 h-3.5" />
                  All connections use industry-standard security protocols (OAuth 2.0, SAML, API Key encryption). No passwords are stored. Enterprise-grade token rotation and audit logging included.
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </PageLayout>
  );
}
