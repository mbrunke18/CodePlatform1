import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useQuery } from '@tanstack/react-query';
import { Link as WouterLink } from 'wouter';
import { 
  Globe, 
  Zap, 
  Settings, 
  Key, 
  Database,
  Cloud,
  Shield,
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  BarChart3,
  Users,
  Link,
  Monitor,
  Code,
  FileText,
  Download,
  Upload,
  Play,
  Pause,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter
} from 'lucide-react';
import { BrandStamp } from "@/components/BrandStamp";

interface Integration {
  id: string;
  name: string;
  category: 'project-tracking' | 'communication' | 'crm' | 'itsm' | 'documentation' | 'source-control' | 'ai' | 'security';
  comingSoon?: boolean;
  status: 'active' | 'inactive' | 'error' | 'pending' | 'available';
  description: string;
  provider: string;
  version: string;
  lastSync: string;
  health: number;
  endpoints: number;
  dailyRequests: number;
  monthlyRequests: number;
  errorRate: number;
  responseTime: number;
  features: string[];
  configuration: {
    apiKey?: string;
    webhook?: string;
    syncFrequency: string;
    dataMapping: string[];
  };
}

interface APIEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  integration: string;
  status: 'active' | 'deprecated' | 'maintenance';
  requests24h: number;
  averageResponse: number;
  successRate: number;
  lastCalled: string;
  authentication: 'api_key' | 'oauth' | 'jwt' | 'basic';
}

interface DataFlow {
  id: string;
  name: string;
  source: string;
  destination: string;
  type: 'real_time' | 'batch' | 'scheduled';
  frequency: string;
  status: 'running' | 'stopped' | 'error';
  lastRun: string;
  recordsProcessed: number;
  errorCount: number;
  transformations: string[];
}

import { queryClient } from "@/lib/queryClient";
import PageLayout from '@/components/layout/PageLayout';
import { useToast } from "@/hooks/use-toast";
import { useCustomer } from '@/contexts/CustomerContext';

export default function IntegrationHub({ embedded }: { embedded?: boolean }) {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [apiEndpoints, setApiEndpoints] = useState<APIEndpoint[]>([]);
  const [dataFlows, setDataFlows] = useState<DataFlow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const { data: connectedIntegrations, isLoading: integrationsLoading } = useQuery<any[]>({
    queryKey: ['/api/enterprise-integrations'],
  });
  
  // Safely access connected integrations with fallback
  const safeIntegrations = connectedIntegrations ?? [];
  
  // Local state for integrations (initialized from API or defaults)
  const { organization } = useCustomer();
  const organizationId = organization?.id;

  const handleConnect = async (vendor: string) => {
    if (!organizationId) {
      toast({
        title: "Configuration Error",
        description: "Organization context not found. Please try again.",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch(`/api/oauth/${vendor}/authorize?organizationId=${organizationId}`);
      const data = await response.json();
      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        throw new Error(data.error || "Failed to get authorization URL");
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    }
  };

  const handleDisconnect = async (integrationId: string) => {
    try {
      const response = await fetch('/api/oauth/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ integrationId }),
      });
      
      if (response.ok) {
        toast({
          title: "Disconnected",
          description: "Integration has been disconnected successfully.",
        });
        queryClient.invalidateQueries({ queryKey: ['/api/enterprise-integrations'] });
        queryClient.invalidateQueries({ queryKey: [`/api/oauth/status?organizationId=${organizationId}`] });
      } else {
        throw new Error("Failed to disconnect");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disconnect integration.",
        variant: "destructive"
      });
    }
  };
  
  // Calculate system metrics from connected integrations
  const systemMetrics = {
    totalIntegrations: safeIntegrations.length > 0 ? safeIntegrations.length : 12,
    activeConnections: safeIntegrations.filter((i: any) => i?.status === 'connected').length || 12,
    dailyApiCalls: 89247,
    systemHealth: 96.4,
    dataFlows: 15,
    errorRate: 0.014
  };

  const NAVY = "#0A0F2E";
  const GOLD = "#C9A84C";
  const TEAL = "#2B8A6E";
  const OFF = "#F8F7F4";
  const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

  useEffect(() => {
    // Initialize integration data
    const integrationData: Integration[] = [
      {
        id: 'int-001',
        name: 'Salesforce CRM',
        category: 'crm',
        status: 'active',
        description: 'Customer relationship management and sales pipeline integration',
        provider: 'Salesforce',
        version: '59.0',
        lastSync: new Date(Date.now() - 300000).toISOString(),
        health: 98,
        endpoints: 47,
        dailyRequests: 8947,
        monthlyRequests: 234567,
        errorRate: 0.02,
        responseTime: 245,
        features: ['Contacts', 'Opportunities', 'Accounts', 'Reports', 'Real-time Sync'],
        configuration: {
          syncFrequency: 'real-time',
          dataMapping: ['contacts', 'opportunities', 'accounts', 'activities']
        }
      },
      {
        id: 'int-002',
        name: 'Microsoft 365',
        category: 'communication',
        status: 'active',
        description: 'Office productivity suite and collaboration platform',
        provider: 'Microsoft',
        version: '2.0',
        lastSync: new Date(Date.now() - 180000).toISOString(),
        health: 95,
        endpoints: 32,
        dailyRequests: 12456,
        monthlyRequests: 345678,
        errorRate: 0.01,
        responseTime: 189,
        features: ['Email', 'Calendar', 'Teams', 'SharePoint', 'OneDrive'],
        configuration: {
          syncFrequency: '15 minutes',
          dataMapping: ['emails', 'calendar_events', 'documents', 'team_messages']
        }
      },
      {
        id: 'int-003',
        name: 'AWS Infrastructure',
        category: 'itsm',
        status: 'active',
        description: 'Cloud infrastructure monitoring and resource management',
        provider: 'Amazon Web Services',
        version: '3.1',
        lastSync: new Date(Date.now() - 120000).toISOString(),
        health: 99,
        endpoints: 78,
        dailyRequests: 15789,
        monthlyRequests: 456789,
        errorRate: 0.005,
        responseTime: 156,
        features: ['EC2', 'S3', 'RDS', 'CloudWatch', 'Lambda'],
        configuration: {
          syncFrequency: '5 minutes',
          dataMapping: ['metrics', 'logs', 'billing', 'resources']
        }
      },
      {
        id: 'int-004',
        name: 'Slack Communications',
        category: 'communication',
        status: 'active',
        description: 'Team communication and workflow automation',
        provider: 'Slack Technologies',
        version: '1.9',
        lastSync: new Date(Date.now() - 600000).toISOString(),
        health: 92,
        endpoints: 23,
        dailyRequests: 5678,
        monthlyRequests: 167890,
        errorRate: 0.04,
        responseTime: 298,
        features: ['Channels', 'Direct Messages', 'Workflows', 'Apps', 'File Sharing'],
        configuration: {
          syncFrequency: 'real-time',
          dataMapping: ['messages', 'channels', 'users', 'files']
        }
      },
      {
        id: 'int-005',
        name: 'Okta Identity',
        category: 'itsm',
        status: 'active',
        description: 'Identity and access management platform',
        provider: 'Okta',
        version: '2.3',
        lastSync: new Date(Date.now() - 240000).toISOString(),
        health: 97,
        endpoints: 34,
        dailyRequests: 3456,
        monthlyRequests: 98765,
        errorRate: 0.01,
        responseTime: 167,
        features: ['SSO', 'MFA', 'User Provisioning', 'Access Policies', 'Audit Logs'],
        configuration: {
          syncFrequency: '10 minutes',
          dataMapping: ['users', 'groups', 'applications', 'events']
        }
      },
      {
        id: 'int-006',
        name: 'ServiceNow',
        category: 'itsm',
        status: 'active',
        description: 'Enterprise IT service management, incident routing, and workflow automation',
        provider: 'ServiceNow',
        version: 'Tokyo',
        lastSync: new Date(Date.now() - 480000).toISOString(),
        health: 97,
        endpoints: 54,
        dailyRequests: 7823,
        monthlyRequests: 234690,
        errorRate: 0.008,
        responseTime: 198,
        features: ['Incident Management', 'Task Routing', 'Bi-directional Sync', 'Resolution Tracking', 'CMDB'],
        configuration: {
          syncFrequency: 'real-time',
          dataMapping: ['incidents', 'tasks', 'approvals', 'users', 'assets']
        }
      },
      {
        id: 'int-007',
        name: 'Jira Project Management',
        category: 'project-tracking',
        status: 'active',
        description: 'Agile project management and execution plan tracking',
        provider: 'Atlassian',
        version: '9.12',
        lastSync: new Date(Date.now() - 240000).toISOString(),
        health: 96,
        endpoints: 42,
        dailyRequests: 6543,
        monthlyRequests: 189234,
        errorRate: 0.015,
        responseTime: 198,
        features: ['Issues', 'Sprints', 'Boards', 'Workflows', 'Automation', 'Reports'],
        configuration: {
          syncFrequency: 'real-time',
          dataMapping: ['issues', 'projects', 'workflows', 'users', 'sprints']
        }
      },
      {
        id: 'int-008',
        name: 'Google Workspace',
        category: 'communication',
        status: 'active',
        description: 'Google Calendar, Drive, Gmail integration for triggers and coordination',
        provider: 'Google',
        version: '3.0',
        lastSync: new Date(Date.now() - 180000).toISOString(),
        health: 97,
        endpoints: 38,
        dailyRequests: 9876,
        monthlyRequests: 287654,
        errorRate: 0.01,
        responseTime: 167,
        features: ['Calendar', 'Gmail', 'Drive', 'Docs', 'Sheets', 'Meet'],
        configuration: {
          syncFrequency: 'real-time',
          dataMapping: ['calendar_events', 'emails', 'documents', 'contacts']
        }
      },
      {
        id: 'int-009',
        name: 'HubSpot CRM',
        category: 'crm',
        status: 'active',
        description: 'Marketing automation and customer relationship management',
        provider: 'HubSpot',
        version: '2.1',
        lastSync: new Date(Date.now() - 360000).toISOString(),
        health: 93,
        endpoints: 35,
        dailyRequests: 5432,
        monthlyRequests: 156789,
        errorRate: 0.025,
        responseTime: 289,
        features: ['Contacts', 'Deals', 'Marketing', 'Sales', 'Automation', 'Analytics'],
        configuration: {
          syncFrequency: '15 minutes',
          dataMapping: ['contacts', 'companies', 'deals', 'tickets', 'campaigns']
        }
      },
      {
        id: 'int-010',
        name: 'ServiceNow ITSM',
        category: 'itsm',
        status: 'active',
        description: 'IT Service Management and workflow orchestration',
        provider: 'ServiceNow',
        version: 'Tokyo',
        lastSync: new Date(Date.now() - 420000).toISOString(),
        health: 95,
        endpoints: 52,
        dailyRequests: 4321,
        monthlyRequests: 123456,
        errorRate: 0.02,
        responseTime: 245,
        features: ['Incidents', 'Change Management', 'Asset Management', 'Workflows', 'CMDB'],
        configuration: {
          syncFrequency: '10 minutes',
          dataMapping: ['incidents', 'changes', 'assets', 'users', 'workflows']
        }
      },
      {
        id: 'int-011',
        name: 'Workday HCM',
        category: 'project-tracking',
        status: 'active',
        description: 'Human capital management and financial planning integration',
        provider: 'Workday',
        version: '2024R1',
        lastSync: new Date(Date.now() - 540000).toISOString(),
        health: 94,
        endpoints: 41,
        dailyRequests: 3210,
        monthlyRequests: 92345,
        errorRate: 0.018,
        responseTime: 312,
        features: ['HR', 'Payroll', 'Planning', 'Analytics', 'Recruiting', 'Time Tracking'],
        configuration: {
          syncFrequency: 'hourly',
          dataMapping: ['employees', 'positions', 'financials', 'time_entries', 'benefits']
        }
      },
      {
        id: 'int-012',
        name: 'Microsoft Active Directory',
        category: 'itsm',
        status: 'active',
        description: 'Enterprise identity and access management',
        provider: 'Microsoft',
        version: '2019',
        lastSync: new Date(Date.now() - 150000).toISOString(),
        health: 99,
        endpoints: 29,
        dailyRequests: 12345,
        monthlyRequests: 356789,
        errorRate: 0.005,
        responseTime: 134,
        features: ['User Authentication', 'Group Policy', 'LDAP', 'SSO', 'Access Control'],
        configuration: {
          syncFrequency: '5 minutes',
          dataMapping: ['users', 'groups', 'organizational_units', 'policies']
        }
      },
      {
        id: 'int-013', name: 'Azure DevOps', category: 'project-tracking', status: 'pending', comingSoon: true,
        description: 'Microsoft project tracking, pipelines, and work item management', provider: 'Microsoft', version: '2024',
        lastSync: '', health: 0, endpoints: 0, dailyRequests: 0, monthlyRequests: 0, errorRate: 0, responseTime: 0,
        features: ['Work Items', 'Boards', 'Pipelines', 'Repos', 'Test Plans'],
        configuration: { syncFrequency: 'real-time', dataMapping: ['work_items', 'pipelines', 'repos'] }
      },
      {
        id: 'int-014', name: 'Asana', category: 'project-tracking', status: 'pending', comingSoon: true,
        description: 'Work management and project tracking platform', provider: 'Asana', version: '2.0',
        lastSync: '', health: 0, endpoints: 0, dailyRequests: 0, monthlyRequests: 0, errorRate: 0, responseTime: 0,
        features: ['Tasks', 'Projects', 'Portfolios', 'Goals', 'Workload'],
        configuration: { syncFrequency: 'real-time', dataMapping: ['tasks', 'projects', 'portfolios'] }
      },
      {
        id: 'int-015', name: 'Monday.com', category: 'project-tracking', status: 'pending', comingSoon: true,
        description: 'Work OS for project and team management', provider: 'Monday.com', version: '2.0',
        lastSync: '', health: 0, endpoints: 0, dailyRequests: 0, monthlyRequests: 0, errorRate: 0, responseTime: 0,
        features: ['Boards', 'Items', 'Automations', 'Dashboards', 'Integrations'],
        configuration: { syncFrequency: 'real-time', dataMapping: ['boards', 'items', 'updates'] }
      },
      {
        id: 'int-016', name: 'Linear', category: 'project-tracking', status: 'pending', comingSoon: true,
        description: 'Modern issue tracking and project management for engineering teams', provider: 'Linear', version: '1.0',
        lastSync: '', health: 0, endpoints: 0, dailyRequests: 0, monthlyRequests: 0, errorRate: 0, responseTime: 0,
        features: ['Issues', 'Cycles', 'Projects', 'Roadmaps', 'Triage'],
        configuration: { syncFrequency: 'real-time', dataMapping: ['issues', 'cycles', 'projects'] }
      },
      {
        id: 'int-017', name: 'Shortcut', category: 'project-tracking', status: 'pending', comingSoon: true,
        description: 'Collaborative project management for software teams', provider: 'Shortcut', version: '1.0',
        lastSync: '', health: 0, endpoints: 0, dailyRequests: 0, monthlyRequests: 0, errorRate: 0, responseTime: 0,
        features: ['Stories', 'Epics', 'Sprints', 'Roadmap', 'Reports'],
        configuration: { syncFrequency: 'real-time', dataMapping: ['stories', 'epics', 'iterations'] }
      },
      {
        id: 'int-018', name: 'Microsoft Teams', category: 'communication', status: 'available',
        description: 'War room notifications delivered directly to Teams channels on playbook activation. Configure your incoming webhook URL to enable.', provider: 'Microsoft', version: '2.0',
        lastSync: '', health: 0, endpoints: 3, dailyRequests: 0, monthlyRequests: 0, errorRate: 0, responseTime: 0,
        features: ['War Room Alerts', 'Playbook Activation Notifications', 'Escalation Pings', 'Delegation Notices', 'Adaptive Cards'],
        configuration: { syncFrequency: 'event-driven', dataMapping: ['playbook_activations', 'escalations', 'war_room_events'] }
      },
      {
        id: 'int-024', name: 'Microsoft Copilot Studio', category: 'ai', status: 'available',
        description: 'Surface Command OS playbook recommendations inside Microsoft 365 Copilot. Executives can query "What playbooks should activate right now?" directly from Teams or Outlook.', provider: 'Microsoft', version: '2025',
        lastSync: '', health: 0, endpoints: 5, dailyRequests: 0, monthlyRequests: 0, errorRate: 0, responseTime: 0,
        features: ['Playbook Query Agent', 'Trigger Alert Surfacing', 'IDEA Framework Connector', 'Teams & Outlook Native', 'Executive Brief Delivery'],
        configuration: { syncFrequency: 'real-time', dataMapping: ['playbook_recommendations', 'trigger_signals', 'execution_briefs'] }
      },
      {
        id: 'int-025', name: 'Azure AI / Azure OpenAI', category: 'ai', status: 'available',
        description: 'Enterprise-grade AI with data residency, SOC 2 compliance, and GDPR guarantees. Set AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_KEY to route all AI analysis through Azure instead of OpenAI direct.', provider: 'Microsoft', version: 'GPT-4o',
        lastSync: '', health: 0, endpoints: 4, dailyRequests: 0, monthlyRequests: 0, errorRate: 0, responseTime: 0,
        features: ['Azure Data Residency', 'SOC 2 Type II', 'GDPR Compliant', 'HIPAA Ready', 'Multi-Agent IDEA Framework', 'Entra Agent ID'],
        configuration: { syncFrequency: 'real-time', dataMapping: ['execution_briefs', 'signal_analysis', 'playbook_recommendations'] }
      },
      {
        id: 'int-026', name: 'Microsoft Entra ID', category: 'security', status: 'available',
        description: 'Enterprise SSO and agent identity management. Every AI action taken by Command OS can be identity-stamped via Entra Agent ID for full audit trail and CISO compliance.', provider: 'Microsoft', version: '2025',
        lastSync: '', health: 0, endpoints: 2, dailyRequests: 0, monthlyRequests: 0, errorRate: 0, responseTime: 0,
        features: ['Enterprise SSO', 'Agent Identity Stamps', 'Audit Trail per AI Action', 'CISO Compliance', 'Zero Trust Ready'],
        configuration: { syncFrequency: 'real-time', dataMapping: ['user_identities', 'agent_actions', 'audit_events'] }
      },
      {
        id: 'int-019', name: 'Google Chat', category: 'communication', status: 'pending', comingSoon: true,
        description: 'Google Workspace messaging and collaboration', provider: 'Google', version: '1.0',
        lastSync: '', health: 0, endpoints: 0, dailyRequests: 0, monthlyRequests: 0, errorRate: 0, responseTime: 0,
        features: ['Spaces', 'Direct Messages', 'Bots', 'Threads', 'File Sharing'],
        configuration: { syncFrequency: 'real-time', dataMapping: ['messages', 'spaces', 'threads'] }
      },
      {
        id: 'int-020', name: 'Microsoft Dynamics 365', category: 'crm', status: 'pending', comingSoon: true,
        description: 'Enterprise CRM and ERP platform for sales, service, and operations', provider: 'Microsoft', version: '2024',
        lastSync: '', health: 0, endpoints: 0, dailyRequests: 0, monthlyRequests: 0, errorRate: 0, responseTime: 0,
        features: ['Sales', 'Customer Service', 'Field Service', 'Marketing', 'Finance'],
        configuration: { syncFrequency: '15 minutes', dataMapping: ['accounts', 'contacts', 'opportunities', 'cases'] }
      },
      {
        id: 'int-021', name: 'Jira Service Management', category: 'itsm', status: 'pending', comingSoon: true,
        description: 'ITSM, incident management, and service desk', provider: 'Atlassian', version: '5.0',
        lastSync: '', health: 0, endpoints: 0, dailyRequests: 0, monthlyRequests: 0, errorRate: 0, responseTime: 0,
        features: ['Incidents', 'Service Requests', 'Change Management', 'SLAs', 'Knowledge Base'],
        configuration: { syncFrequency: 'real-time', dataMapping: ['incidents', 'requests', 'changes', 'problems'] }
      },
      {
        id: 'int-022', name: 'Zendesk', category: 'itsm', status: 'pending', comingSoon: true,
        description: 'Customer service and IT support ticketing platform', provider: 'Zendesk', version: '2.0',
        lastSync: '', health: 0, endpoints: 0, dailyRequests: 0, monthlyRequests: 0, errorRate: 0, responseTime: 0,
        features: ['Tickets', 'Help Center', 'Automation', 'Reporting', 'AI Agents'],
        configuration: { syncFrequency: '10 minutes', dataMapping: ['tickets', 'users', 'organizations'] }
      },
      {
        id: 'int-023', name: 'SharePoint', category: 'documentation', status: 'pending', comingSoon: true,
        description: 'Microsoft enterprise document management and collaboration platform', provider: 'Microsoft', version: '2024',
        lastSync: '', health: 0, endpoints: 0, dailyRequests: 0, monthlyRequests: 0, errorRate: 0, responseTime: 0,
        features: ['Document Libraries', 'Team Sites', 'Intranet', 'Workflows', 'Search'],
        configuration: { syncFrequency: 'hourly', dataMapping: ['sites', 'documents', 'lists', 'pages'] }
      },
      {
        id: 'int-023b', name: 'Confluence', category: 'documentation', status: 'pending', comingSoon: true,
        description: 'Team knowledge base and documentation wiki', provider: 'Atlassian', version: '8.0',
        lastSync: '', health: 0, endpoints: 0, dailyRequests: 0, monthlyRequests: 0, errorRate: 0, responseTime: 0,
        features: ['Pages', 'Spaces', 'Templates', 'Version History', 'Permissions'],
        configuration: { syncFrequency: 'hourly', dataMapping: ['pages', 'spaces', 'attachments'] }
      },
      {
        id: 'int-024', name: 'Notion', category: 'documentation', status: 'pending', comingSoon: true,
        description: 'All-in-one workspace for notes, docs, and project wikis', provider: 'Notion', version: '2.0',
        lastSync: '', health: 0, endpoints: 0, dailyRequests: 0, monthlyRequests: 0, errorRate: 0, responseTime: 0,
        features: ['Pages', 'Databases', 'Templates', 'AI', 'Collaboration'],
        configuration: { syncFrequency: 'hourly', dataMapping: ['pages', 'databases', 'blocks'] }
      },
      {
        id: 'int-025', name: 'GitHub', category: 'source-control', status: 'pending', comingSoon: true,
        description: 'Version control, code collaboration, and DevOps platform', provider: 'GitHub', version: '3.0',
        lastSync: '', health: 0, endpoints: 0, dailyRequests: 0, monthlyRequests: 0, errorRate: 0, responseTime: 0,
        features: ['Repositories', 'Pull Requests', 'Issues', 'Actions', 'Security'],
        configuration: { syncFrequency: 'real-time', dataMapping: ['repos', 'pull_requests', 'issues', 'actions'] }
      },
      {
        id: 'int-026', name: 'GitLab', category: 'source-control', status: 'pending', comingSoon: true,
        description: 'Complete DevSecOps platform with source control and CI/CD', provider: 'GitLab', version: '16.0',
        lastSync: '', health: 0, endpoints: 0, dailyRequests: 0, monthlyRequests: 0, errorRate: 0, responseTime: 0,
        features: ['Repos', 'Merge Requests', 'CI/CD', 'Security', 'Monitoring'],
        configuration: { syncFrequency: 'real-time', dataMapping: ['projects', 'merge_requests', 'pipelines'] }
      },
      {
        id: 'int-027', name: 'Azure Repos', category: 'source-control', status: 'pending', comingSoon: true,
        description: 'Microsoft Git repositories within Azure DevOps', provider: 'Microsoft', version: '2024',
        lastSync: '', health: 0, endpoints: 0, dailyRequests: 0, monthlyRequests: 0, errorRate: 0, responseTime: 0,
        features: ['Git Repos', 'Pull Requests', 'Branch Policies', 'Code Review', 'History'],
        configuration: { syncFrequency: 'real-time', dataMapping: ['repos', 'pull_requests', 'commits'] }
      },
      {
        id: 'int-028', name: 'Bitbucket', category: 'source-control', status: 'pending', comingSoon: true,
        description: 'Atlassian Git solution with Jira integration', provider: 'Atlassian', version: '8.0',
        lastSync: '', health: 0, endpoints: 0, dailyRequests: 0, monthlyRequests: 0, errorRate: 0, responseTime: 0,
        features: ['Repos', 'Pull Requests', 'Pipelines', 'Deployments', 'Jira Integration'],
        configuration: { syncFrequency: 'real-time', dataMapping: ['repos', 'pull_requests', 'pipelines'] }
      },
      {
        id: 'int-029', name: 'Smartsheet', category: 'project-tracking', status: 'pending', comingSoon: true,
        description: 'Enterprise work management and portfolio visibility platform', provider: 'Smartsheet', version: '2.0',
        lastSync: '', health: 0, endpoints: 0, dailyRequests: 0, monthlyRequests: 0, errorRate: 0, responseTime: 0,
        features: ['Sheets', 'Portfolio Rollup', 'Resource Management', 'Dashboards', 'Automations'],
        configuration: { syncFrequency: '15 minutes', dataMapping: ['sheets', 'projects', 'resources', 'reports'] }
      },
      {
        id: 'int-030', name: 'Planview Enterprise One', category: 'project-tracking', status: 'pending', comingSoon: true,
        description: 'Enterprise portfolio and program management for strategic alignment', provider: 'Planview', version: '18.0',
        lastSync: '', health: 0, endpoints: 0, dailyRequests: 0, monthlyRequests: 0, errorRate: 0, responseTime: 0,
        features: ['Portfolio Management', 'Resource Capacity', 'Demand Management', 'Financial Planning', 'Roadmaps'],
        configuration: { syncFrequency: '30 minutes', dataMapping: ['portfolios', 'programs', 'projects', 'resources'] }
      },
      {
        id: 'int-031', name: 'Broadcom Clarity PPM', category: 'project-tracking', status: 'pending', comingSoon: true,
        description: 'Enterprise portfolio management with AI-driven project intelligence', provider: 'Broadcom', version: '16.2',
        lastSync: '', health: 0, endpoints: 0, dailyRequests: 0, monthlyRequests: 0, errorRate: 0, responseTime: 0,
        features: ['Portfolio Governance', 'Resource Optimization', 'Financial Tracking', 'Risk Management', 'Time Tracking'],
        configuration: { syncFrequency: '30 minutes', dataMapping: ['portfolios', 'projects', 'timesheets', 'risks'] }
      },
      {
        id: 'int-032', name: 'Microsoft Project', category: 'project-tracking', status: 'pending', comingSoon: true,
        description: 'Microsoft enterprise project and portfolio management', provider: 'Microsoft', version: '2024',
        lastSync: '', health: 0, endpoints: 0, dailyRequests: 0, monthlyRequests: 0, errorRate: 0, responseTime: 0,
        features: ['Project Plans', 'Resource Management', 'Portfolio Views', 'Reporting', 'Roadmaps'],
        configuration: { syncFrequency: '30 minutes', dataMapping: ['projects', 'tasks', 'resources', 'portfolios'] }
      },
      {
        id: 'int-033', name: 'Wrike', category: 'project-tracking', status: 'pending', comingSoon: true,
        description: 'Collaborative work management and project portfolio platform', provider: 'Wrike', version: '4.0',
        lastSync: '', health: 0, endpoints: 0, dailyRequests: 0, monthlyRequests: 0, errorRate: 0, responseTime: 0,
        features: ['Projects', 'Tasks', 'Portfolio Dashboards', 'Resource Management', 'Time Tracking'],
        configuration: { syncFrequency: '15 minutes', dataMapping: ['projects', 'tasks', 'folders', 'reports'] }
      },
      {
        id: 'int-034', name: 'Planisware', category: 'project-tracking', status: 'pending', comingSoon: true,
        description: 'PPM platform for complex R&D and engineering portfolios', provider: 'Planisware', version: '7.0',
        lastSync: '', health: 0, endpoints: 0, dailyRequests: 0, monthlyRequests: 0, errorRate: 0, responseTime: 0,
        features: ['Portfolio Simulation', 'Resource Forecasting', 'Stage-Gate', 'Financial Planning', 'Risk Modeling'],
        configuration: { syncFrequency: 'hourly', dataMapping: ['portfolios', 'projects', 'resources', 'gates'] }
      },
      {
        id: 'int-035', name: 'BMC Helix ITSM', category: 'itsm', status: 'pending', comingSoon: true,
        description: 'AI-powered enterprise ITSM and digital service management platform', provider: 'BMC', version: '23.3',
        lastSync: '', health: 0, endpoints: 0, dailyRequests: 0, monthlyRequests: 0, errorRate: 0, responseTime: 0,
        features: ['Incident Management', 'Change Management', 'Problem Management', 'CMDB', 'AI Operations'],
        configuration: { syncFrequency: 'real-time', dataMapping: ['incidents', 'changes', 'problems', 'assets'] }
      },
      {
        id: 'int-036', name: 'Freshservice', category: 'itsm', status: 'pending', comingSoon: true,
        description: 'Cloud-native ITSM platform with AI-powered service automation', provider: 'Freshworks', version: '2.0',
        lastSync: '', health: 0, endpoints: 0, dailyRequests: 0, monthlyRequests: 0, errorRate: 0, responseTime: 0,
        features: ['Incident Management', 'Service Catalog', 'Asset Management', 'Change Management', 'Analytics'],
        configuration: { syncFrequency: '10 minutes', dataMapping: ['tickets', 'assets', 'changes', 'releases'] }
      },
      {
        id: 'int-037', name: 'Ivanti Neurons', category: 'itsm', status: 'pending', comingSoon: true,
        description: 'Intelligent ITSM and unified endpoint management platform', provider: 'Ivanti', version: '2024.1',
        lastSync: '', health: 0, endpoints: 0, dailyRequests: 0, monthlyRequests: 0, errorRate: 0, responseTime: 0,
        features: ['ITSM', 'Endpoint Management', 'Self-Service', 'Discovery', 'AI Automation'],
        configuration: { syncFrequency: '15 minutes', dataMapping: ['incidents', 'devices', 'requests', 'changes'] }
      },
      {
        id: 'int-038', name: 'Cherwell (Ivanti)', category: 'itsm', status: 'pending', comingSoon: true,
        description: 'Flexible ITSM platform with no-code configuration capabilities', provider: 'Ivanti', version: '10.4',
        lastSync: '', health: 0, endpoints: 0, dailyRequests: 0, monthlyRequests: 0, errorRate: 0, responseTime: 0,
        features: ['Incident', 'Problem', 'Change', 'Service Catalog', 'CMDB'],
        configuration: { syncFrequency: '15 minutes', dataMapping: ['incidents', 'problems', 'changes', 'configuration_items'] }
      },
      {
        id: 'int-039', name: 'ManageEngine ServiceDesk Plus', category: 'itsm', status: 'pending', comingSoon: true,
        description: 'ITSM suite with built-in asset and project management capabilities', provider: 'ManageEngine', version: '14.3',
        lastSync: '', health: 0, endpoints: 0, dailyRequests: 0, monthlyRequests: 0, errorRate: 0, responseTime: 0,
        features: ['Help Desk', 'Asset Management', 'Change Management', 'Project Management', 'Analytics'],
        configuration: { syncFrequency: '15 minutes', dataMapping: ['requests', 'assets', 'changes', 'projects'] }
      }
    ];

    const endpointData: APIEndpoint[] = [
      {
        id: 'ep-001',
        name: 'Get Organization Metrics',
        method: 'GET',
        path: '/api/organizations/{id}/metrics',
        description: 'Retrieve comprehensive organizational performance metrics',
        integration: 'M Core',
        status: 'active',
        requests24h: 1247,
        averageResponse: 234,
        successRate: 99.2,
        lastCalled: new Date(Date.now() - 120000).toISOString(),
        authentication: 'jwt'
      },
      {
        id: 'ep-002',
        name: 'Sync Salesforce Contacts',
        method: 'POST',
        path: '/api/integrations/salesforce/sync',
        description: 'Synchronize contact data from Salesforce CRM',
        integration: 'Salesforce CRM',
        status: 'active',
        requests24h: 456,
        averageResponse: 567,
        successRate: 98.7,
        lastCalled: new Date(Date.now() - 300000).toISOString(),
        authentication: 'oauth'
      },
      {
        id: 'ep-003',
        name: 'AI Intelligence Generation',
        method: 'POST',
        path: '/api/ai/{module}/generate',
        description: 'Generate AI insights from specified intelligence module',
        integration: 'AI Intelligence',
        status: 'active',
        requests24h: 2789,
        averageResponse: 1234,
        successRate: 96.8,
        lastCalled: new Date(Date.now() - 60000).toISOString(),
        authentication: 'api_key'
      },
      {
        id: 'ep-004',
        name: 'Crisis Response Activation',
        method: 'POST',
        path: '/api/crisis/activate',
        description: 'Activate crisis response protocols and notifications',
        integration: 'Crisis Response',
        status: 'active',
        requests24h: 12,
        averageResponse: 345,
        successRate: 100,
        lastCalled: new Date(Date.now() - 3600000).toISOString(),
        authentication: 'jwt'
      }
    ];

    const flowData: DataFlow[] = [
      {
        id: 'flow-001',
        name: 'CRM to Analytics Pipeline',
        source: 'Salesforce CRM',
        destination: 'Executive Analytics',
        type: 'real_time',
        frequency: 'continuous',
        status: 'running',
        lastRun: new Date(Date.now() - 180000).toISOString(),
        recordsProcessed: 15678,
        errorCount: 2,
        transformations: ['data_cleansing', 'field_mapping', 'enrichment']
      },
      {
        id: 'flow-002',
        name: 'Financial Reporting Sync',
        source: 'ServiceNow',
        destination: 'Strategic Planning',
        type: 'scheduled',
        frequency: 'daily at 9:00 AM',
        status: 'running',
        lastRun: new Date(Date.now() - 86400000).toISOString(),
        recordsProcessed: 892,
        errorCount: 0,
        transformations: ['currency_conversion', 'aggregation', 'categorization']
      },
      {
        id: 'flow-003',
        name: 'Security Event Stream',
        source: 'Okta Identity',
        destination: 'Audit Logging',
        type: 'real_time',
        frequency: 'continuous',
        status: 'running',
        lastRun: new Date(Date.now() - 60000).toISOString(),
        recordsProcessed: 3456,
        errorCount: 1,
        transformations: ['log_parsing', 'threat_scoring', 'correlation']
      }
    ];

    setIntegrations(integrationData);
    setApiEndpoints(endpointData);
    setDataFlows(flowData);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/30';
      case 'inactive': return 'bg-[#6B7280]/20 text-[#6B7280] border-[#6B7280]/30';
      case 'error': return 'bg-red-500/20 text-red-600 border-red-500/30';
      case 'pending': return 'bg-[#C9A84C]/20 text-[#C9A84C] border-[#C9A84C]/30';
      case 'running': return 'bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/30';
      case 'stopped': return 'bg-[#6B7280]/20 text-[#6B7280] border-[#6B7280]/30';
      case 'deprecated': return 'bg-[#C9A84C]/20 text-[#C9A84C] border-[#C9A84C]/30';
      case 'maintenance': return 'bg-[#C9A84C]/20 text-[#C9A84C] border-[#C9A84C]/30';
      default: return 'bg-[#6B7280]/20 text-[#6B7280] border-[#6B7280]/30';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'project-tracking': return 'bg-[#0A0F2E]/10 text-[#0A0F2E] border-[#0A0F2E]/20';
      case 'communication': return 'bg-[#DFC178]/10 text-[#C9A84C] border-[#DFC178]/20';
      case 'crm': return 'bg-[#141B45]/10 text-[#141B45] border-[#141B45]/20';
      case 'itsm': return 'bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20';
      case 'documentation': return 'bg-[#2B8A6E]/10 text-[#2B8A6E] border-[#2B8A6E]/20';
      case 'source-control': return 'bg-[#F8F7F4] text-[#6B7280] border-[#E8E4DC]';
      default: return 'bg-[#F8F7F4] text-[#6B7280] border-[#E8E4DC]';
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || integration.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <PageLayout embedded={embedded}>
      <div className="flex-1 bg-[#F8F7F4] overflow-y-auto" data-testid="integration-hub">
        {/* Navy Hero Section */}
        <div style={{ background: NAVY, padding: "80px 48px", position: "relative", overflow: "hidden", minHeight: 360 }}>
          <div style={{ 
            position: "absolute", 
            inset: 0, 
            backgroundImage: "radial-gradient(#C9A84C 0.5px, transparent 0.5px)", 
            backgroundSize: "32px 32px",
            opacity: 0.1
          }} />
          <div className="max-w-7xl mx-auto relative z-10">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.4em", textTransform: "uppercase" as const, color: GOLD }}>Connected Ecosystem</span>
            </div>
            <div className="flex items-end justify-between gap-12">
              <div className="max-w-3xl">
                <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(48px,6vw,72px)", lineHeight: 1, color: "#fff", marginBottom: 24 }}>
                  Integration <em style={{ fontStyle: "italic", color: "#DFC178" }}>Hub</em>
                </h1>
                <p className="text-white/60 text-xl leading-relaxed max-w-2xl">Command OS orchestrates your entire enterprise stack through bi-directional strategic synchronization.</p>
              </div>
              <div className="flex flex-col items-end gap-4 min-w-[280px]">
                <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(43,138,110,0.2)", color:TEAL, fontSize:10, fontWeight:800, letterSpacing:"0.2em", textTransform:"uppercase" as const, padding:"6px 16px", border: `1px solid ${TEAL}` }}>
                  <Activity className="w-4 h-4" />
                  System Health: {systemMetrics.systemHealth}%
                </div>
                <Button className="w-full bg-[#C9A84C] hover:bg-[#DFC178] text-[#0A0F2E] font-bold h-14 rounded-none text-sm tracking-widest" size="lg">
                  <Plus className="w-5 h-5 mr-3" />
                  ADD INTEGRATION
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", background: "white", borderBottom:"1px solid #E8E4DC" }}>
          <div style={{ padding:32, borderRight:"1px solid #E8E4DC" }}>
            <div style={{ ...CG, fontSize: 48, fontWeight: 600, color: GOLD, lineHeight: 1 }}>{systemMetrics.totalIntegrations}</div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "#6B7280", marginTop: 8 }}>Total Modules</div>
          </div>
          <div style={{ padding:32, borderRight:"1px solid #E8E4DC" }}>
            <div style={{ ...CG, fontSize: 48, fontWeight: 600, color: GOLD, lineHeight: 1 }}>{systemMetrics.activeConnections}</div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "#6B7280", marginTop: 8 }}>Active Syncs</div>
          </div>
          <div style={{ padding:32, borderRight:"1px solid #E8E4DC" }}>
            <div style={{ ...CG, fontSize: 48, fontWeight: 600, color: GOLD, lineHeight: 1 }}>{(systemMetrics.dailyApiCalls / 1000).toFixed(1)}k</div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "#6B7280", marginTop: 8 }}>Daily Signals</div>
          </div>
          <div style={{ padding:32 }}>
            <div style={{ ...CG, fontSize: 48, fontWeight: 600, color: GOLD, lineHeight: 1 }}>{systemMetrics.errorRate}%</div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "#6B7280", marginTop: 8 }}>Sync Latency</div>
          </div>
        </div>

        <div className="p-12 max-w-7xl mx-auto space-y-12">
          {/* Main Integration Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-12">
            <TabsList className="bg-transparent border-b border-[#E8E4DC] rounded-none h-auto p-0 gap-12">
              {['dashboard', 'integrations', 'apis', 'dataflows', 'monitoring'].map((tab) => (
                <TabsTrigger 
                  key={tab}
                  value={tab} 
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#C9A84C] data-[state=active]:text-[#0A0F2E] rounded-none px-0 py-5 text-[10px] font-bold tracking-[0.25em] uppercase text-[#6B7280]"
                >
                  {tab === 'apis' ? 'API Endpoints' : tab === 'dataflows' ? 'Data Flows' : tab}
                </TabsTrigger>
              ))}
            </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Top Integrations */}
              <Card className="bg-white border-[#E8E4DC] rounded-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-[#0A0F2E] flex items-center gap-2 font-bold text-xl uppercase tracking-widest" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    <BarChart3 className="h-5 w-5 text-[#C9A84C]" />
                    Top Performing Integrations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {integrations.slice(0, 5).map((integration) => (
                    <div key={integration.id} className="flex items-center justify-between p-4 bg-[#F8F7F4] border border-[#E8E4DC]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0A0F2E] rounded-none flex items-center justify-center">
                          <Globe className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-[#0A0F2E] text-sm uppercase tracking-wider">{integration.name}</div>
                          <div className="text-[10px] text-[#6B7280] font-bold uppercase tracking-widest">{formatNumber(integration.dailyRequests)} requests today</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-[#0A0F2E] mb-1">{integration.health}%</div>
                        <Badge className={getStatusColor(integration.status)}>
                          {integration.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-white border-[#E8E4DC] rounded-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-[#0A0F2E] flex items-center gap-2 font-bold text-xl uppercase tracking-widest" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    <Clock className="h-5 w-5 text-[#C9A84C]" />
                    Recent API Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {apiEndpoints.slice(0, 5).map((endpoint) => (
                    <div key={endpoint.id} className="p-4 bg-[#F8F7F4] border border-[#E8E4DC]">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className="bg-[#0A0F2E]/10 text-[#0A0F2E] border-[#0A0F2E]/20 font-bold tracking-widest text-[9px] uppercase">
                          {endpoint.method}
                        </Badge>
                        <span className="text-[10px] text-[#6B7280] font-bold uppercase tracking-widest">
                          {new Date(endpoint.lastCalled).toLocaleTimeString()}
                        </span>
                      </div>
                      <h4 className="font-bold text-[#0A0F2E] text-sm mb-1 uppercase tracking-wider">{endpoint.name}</h4>
                      <p className="text-[#6B7280] text-[10px] mb-3 font-mono">{endpoint.path}</p>
                      <div className="flex justify-between text-[9px] font-bold text-[#6B7280] uppercase tracking-widest">
                        <span>{formatNumber(endpoint.requests24h)} calls</span>
                        <span>{endpoint.averageResponse}ms avg</span>
                        <span>{endpoint.successRate}% success</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Integrations */}
          <TabsContent value="integrations" className="space-y-6">
            
            {/* Filters */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-none border border-[#E8E4DC]">
              <div className="flex-1 page-background relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
                <Input
                  placeholder="Search integrations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#F8F7F4] border-[#E8E4DC] text-[#0A0F2E] rounded-none focus-visible:ring-[#C9A84C]"
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-48 bg-[#F8F7F4] border-[#E8E4DC] text-[#0A0F2E] rounded-none focus:ring-[#C9A84C]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-[#E8E4DC]">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="project-tracking">Project / Issue Tracking</SelectItem>
                  <SelectItem value="communication">Communication</SelectItem>
                  <SelectItem value="crm">CRM</SelectItem>
                  <SelectItem value="itsm">IT Service Management</SelectItem>
                  <SelectItem value="documentation">Documentation</SelectItem>
                  <SelectItem value="source-control">Source Control</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Integrations Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredIntegrations.map((integration) => {
                    const isConnected = integration.status === 'active';
                    return (
                      <Card key={integration.id} className="bg-white border-[#E8E4DC] rounded-none hover:shadow-md transition-all duration-300">
                        <CardHeader>
                          <div className="flex items-center justify-between mb-4">
                            <CardTitle className="text-[#0A0F2E] flex items-center gap-3 font-bold uppercase tracking-wider text-sm">
                              <div className={`w-10 h-10 rounded-none flex items-center justify-center ${integration.category === 'communication' ? 'bg-[#C9A84C]' : integration.category === 'project-tracking' ? 'bg-[#0A0F2E]' : 'bg-[#2B8A6E]'}`}>
                                <Globe className="w-5 h-5 text-white" />
                              </div>
                              {integration.name}
                            </CardTitle>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(integration.status)}>
                                {integration.status.toUpperCase()}
                              </Badge>
                              <Badge className={getCategoryColor(integration.category)}>
                                {integration.category.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-[#6B7280] text-xs leading-relaxed">{integration.description}</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          
                          {/* Metrics */}
                          <div className="grid grid-cols-2 gap-4 text-[10px] uppercase font-bold tracking-widest">
                            <div>
                              <div className="text-[#6B7280]">Health</div>
                              <div className="text-[#0A0F2E]">{integration.health}%</div>
                            </div>
                            <div>
                              <div className="text-[#6B7280]">Response</div>
                              <div className="text-[#0A0F2E]">{integration.responseTime}ms</div>
                            </div>
                            <div>
                              <div className="text-[#6B7280]">Daily Req</div>
                              <div className="text-[#0A0F2E]">{formatNumber(integration.dailyRequests)}</div>
                            </div>
                            <div>
                              <div className="text-[#6B7280]">Error Rate</div>
                              <div className="text-[#0A0F2E]">{(integration.errorRate * 100).toFixed(2)}%</div>
                            </div>
                          </div>

                          {/* Features */}
                          <div>
                            <div className="text-[10px] font-bold text-[#0A0F2E] mb-2 uppercase tracking-widest">Features</div>
                            <div className="flex flex-wrap gap-2">
                              {integration.features.slice(0, 3).map((feature, index) => (
                                <Badge key={index} variant="outline" className="bg-transparent border-[#E8E4DC] text-[#6B7280] text-[9px] font-bold uppercase tracking-widest">
                                  {feature}
                                </Badge>
                              ))}
                              {integration.features.length > 3 && (
                                <Badge variant="outline" className="bg-transparent border-[#E8E4DC] text-[#6B7280] text-[9px] font-bold uppercase tracking-widest">
                                  +{integration.features.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            {isConnected ? (
                              <>
                                <Button size="sm" className="flex-1 bg-[#0A0F2E] text-white hover:bg-[#141B45] rounded-none font-bold text-[9px] uppercase tracking-widest">
                                  <Settings className="w-4 h-4 mr-2" />
                                  Configure
                                </Button>
                                <Button size="sm" variant="destructive" className="rounded-none font-bold text-[9px] uppercase tracking-widest" onClick={() => handleDisconnect(integration.id)}>
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Disconnect
                                </Button>
                              </>
                            ) : integration.comingSoon ? (
                              <Button size="sm" disabled className="flex-1 bg-[#F8F7F4] text-[#6B7280] border border-[#E8E4DC] rounded-none font-bold text-[9px] uppercase tracking-widest">
                                Coming Soon
                              </Button>
                            ) : (
                              <Button 
                                size="sm" 
                                className="flex-1 bg-[#2B8A6E] text-white hover:bg-[#3BAF8A] rounded-none font-bold text-[9px] uppercase tracking-widest"
                                onClick={() => handleConnect(integration.provider.toLowerCase().includes('slack') ? 'slack' : 'jira')}
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Connect
                              </Button>
                            )}
                            <Button size="sm" variant="outline" className="bg-transparent border-[#E8E4DC] text-[#0A0F2E] hover:bg-[#F8F7F4] rounded-none">
                              <Monitor className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
            </div>
          </TabsContent>

          <TabsContent value="apis" className="space-y-6">
            <Card className="bg-white border-[#E8E4DC] rounded-none shadow-sm">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#F8F7F4] border-b border-[#E8E4DC]">
                      <tr>
                        <th className="px-6 py-3 text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Endpoint</th>
                        <th className="px-6 py-3 text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Method</th>
                        <th className="px-6 py-3 text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Integration</th>
                        <th className="px-6 py-3 text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Requests (24h)</th>
                        <th className="px-6 py-3 text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Success Rate</th>
                        <th className="px-6 py-3 text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Avg Response</th>
                        <th className="px-6 py-3 text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8E4DC]">
                      {apiEndpoints.map((endpoint) => (
                        <tr key={endpoint.id} className="hover:bg-[#F8F7F4] transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-bold text-[#0A0F2E]">{endpoint.name}</div>
                              <div className="text-[10px] text-[#6B7280] font-mono">{endpoint.path}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className="bg-[#0A0F2E]/10 text-[#0A0F2E] border-[#0A0F2E]/20 rounded-none text-[9px] font-bold uppercase tracking-widest">
                              {endpoint.method}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0A0F2E]">
                            {endpoint.integration}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0A0F2E]">
                            {formatNumber(endpoint.requests24h)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                            <span className={`${endpoint.successRate >= 99 ? 'text-[#2B8A6E]' : endpoint.successRate >= 95 ? 'text-[#C9A84C]' : 'text-red-600'}`}>
                              {endpoint.successRate}%
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0A0F2E]">
                            {endpoint.averageResponse}ms
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={`${getStatusColor(endpoint.status)} rounded-none text-[9px] font-bold uppercase tracking-widest`}>
                              {endpoint.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Flows */}
          <TabsContent value="dataflows" className="space-y-6">
            <div className="space-y-4">
              {dataFlows.map((flow) => (
                <Card key={flow.id} className="bg-white border-[#E8E4DC] rounded-none shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-[#0A0F2E]">{flow.name}</h3>
                          <Badge className={`${getStatusColor(flow.status)} rounded-none text-[9px] font-bold uppercase tracking-widest`}>
                            {flow.status.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="bg-transparent border-[#E8E4DC] text-[#6B7280] rounded-none text-[9px] font-bold uppercase tracking-widest">
                            {flow.type.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-bold text-[#6B7280]">
                          <div className="flex items-center gap-2">
                            <Database className="w-4 h-4 text-[#0A0F2E]" />
                            {flow.source}
                          </div>
                          <div>→</div>
                          <div className="flex items-center gap-2">
                            <Database className="w-4 h-4 text-[#2B8A6E]" />
                            {flow.destination}
                          </div>
                        </div>
                      </div>
                          <div className="text-right">
                        <div className="text-sm text-[#6B7280]">Records Processed</div>
                        <div className="text-2xl font-bold text-[#0A0F2E]">{formatNumber(flow.recordsProcessed)}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div>
                        <div className="text-sm text-[#6B7280]">Frequency</div>
                        <div className="text-[#0A0F2E] font-medium">{flow.frequency}</div>
                      </div>
                      <div>
                        <div className="text-sm text-[#6B7280]">Last Run</div>
                        <div className="text-[#0A0F2E] font-medium">{new Date(flow.lastRun).toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-[#6B7280]">Error Count</div>
                        <div className={`font-medium ${flow.errorCount === 0 ? 'text-[#2B8A6E]' : 'text-red-700'}`}>
                          {flow.errorCount}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-[#6B7280]">Transformations</div>
                        <div className="text-[#0A0F2E] font-medium">{flow.transformations.length}</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-3">
                      <Button size="sm" className="bg-[#0A0F2E] hover:bg-[#141B45] text-white rounded-none">
                        <Monitor className="w-4 h-4 mr-2" />
                        Monitor
                      </Button>
                      <Button size="sm" variant="outline" className="bg-transparent border-[#E8E4DC] text-[#0A0F2E] hover:bg-[#F8F7F4] rounded-none">
                        <Settings className="w-4 h-4 mr-2" />
                        Configure
                      </Button>
                      <Button size="sm" variant="outline" className="bg-transparent border-[#E8E4DC] text-[#0A0F2E] hover:bg-[#F8F7F4] rounded-none">
                        {flow.status === 'running' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white border-[#E8E4DC] rounded-none">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-[#0A0F2E] text-[10px] uppercase tracking-widest">Uptime</h3>
                    <Activity className="h-5 w-5 text-[#2B8A6E]" />
                  </div>
                  <div className="text-2xl font-bold text-[#0A0F2E] mb-2">99.9%</div>
                  <div className="text-xs text-[#6B7280]">Last 30 days</div>
                </CardContent>
              </Card>

              <Card className="bg-white border-[#E8E4DC] rounded-none">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-[#0A0F2E] text-[10px] uppercase tracking-widest">Throughput</h3>
                    <Zap className="h-5 w-5 text-[#0A0F2E]" />
                  </div>
                  <div className="text-2xl font-bold text-[#0A0F2E] mb-2">1.2K/s</div>
                  <div className="text-xs text-[#6B7280]">Requests per second</div>
                </CardContent>
              </Card>

              <Card className="bg-white border-[#E8E4DC] rounded-none">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-[#0A0F2E] text-[10px] uppercase tracking-widest">Latency</h3>
                    <Clock className="h-5 w-5 text-[#C9A84C]" />
                  </div>
                  <div className="text-2xl font-bold text-[#0A0F2E] mb-2">234ms</div>
                  <div className="text-xs text-[#6B7280]">P95 response time</div>
                </CardContent>
              </Card>

              <Card className="bg-white border-[#E8E4DC] rounded-none">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-[#0A0F2E] text-[10px] uppercase tracking-widest">Data Volume</h3>
                    <Database className="h-5 w-5 text-[#DFC178]" />
                  </div>
                  <div className="text-2xl font-bold text-[#0A0F2E] mb-2">2.3TB</div>
                  <div className="text-xs text-[#6B7280]">Processed today</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      </div>
    </PageLayout>
  );
}