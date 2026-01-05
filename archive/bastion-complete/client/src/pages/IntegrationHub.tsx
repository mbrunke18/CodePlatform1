import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import VeridiusPageLayout from '@/components/layout/VeridiusPageLayout';
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

interface Integration {
  id: string;
  name: string;
  category: 'crm' | 'erp' | 'analytics' | 'communication' | 'security' | 'productivity' | 'financial';
  status: 'active' | 'inactive' | 'error' | 'pending';
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

export default function IntegrationHub() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [apiEndpoints, setApiEndpoints] = useState<APIEndpoint[]>([]);
  const [dataFlows, setDataFlows] = useState<DataFlow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [systemMetrics, setSystemMetrics] = useState({
    totalIntegrations: 24,
    activeConnections: 18,
    dailyApiCalls: 47389,
    systemHealth: 97.8,
    dataFlows: 12,
    errorRate: 0.03
  });

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
        category: 'productivity',
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
        category: 'analytics',
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
        category: 'security',
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
        name: 'QuickBooks Financial',
        category: 'financial',
        status: 'active',
        description: 'Financial data and accounting integration',
        provider: 'Intuit',
        version: '3.0',
        lastSync: new Date(Date.now() - 480000).toISOString(),
        health: 94,
        endpoints: 28,
        dailyRequests: 2789,
        monthlyRequests: 78901,
        errorRate: 0.02,
        responseTime: 234,
        features: ['Invoices', 'Payments', 'Expenses', 'Reports', 'Tax Tracking'],
        configuration: {
          syncFrequency: 'hourly',
          dataMapping: ['transactions', 'customers', 'vendors', 'items']
        }
      }
    ];

    const endpointData: APIEndpoint[] = [
      {
        id: 'ep-001',
        name: 'Get Organization Metrics',
        method: 'GET',
        path: '/api/organizations/{id}/metrics',
        description: 'Retrieve comprehensive organizational performance metrics',
        integration: 'Veridius Core',
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
        source: 'QuickBooks Financial',
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

    // Real-time updates
    const interval = setInterval(() => {
      setSystemMetrics(prev => ({
        ...prev,
        dailyApiCalls: prev.dailyApiCalls + Math.floor(Math.random() * 50),
        systemHealth: +(prev.systemHealth + (Math.random() * 0.5 - 0.25)).toFixed(1),
        errorRate: +(prev.errorRate + (Math.random() * 0.001 - 0.0005)).toFixed(3)
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'inactive': return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
      case 'error': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'pending': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'running': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'stopped': return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
      case 'deprecated': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'maintenance': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'crm': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'erp': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'analytics': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'communication': return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
      case 'security': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'productivity': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'financial': return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
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
    <VeridiusPageLayout>
      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        
        {/* Integration Hub Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Enterprise Integration Hub</h1>
            <p className="text-slate-300">Comprehensive API management, data flows, and system integration platform</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
              <Activity className="w-4 h-4 mr-2" />
              System Health: {systemMetrics.systemHealth}%
            </Badge>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Integration
            </Button>
          </div>
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Integrations</h3>
                <Globe className="h-5 w-5 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">{systemMetrics.totalIntegrations}</div>
              <div className="text-sm text-slate-400">Total connected</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Active</h3>
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white">{systemMetrics.activeConnections}</div>
              <div className="text-sm text-slate-400">Connections live</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">API Calls</h3>
                <Zap className="h-5 w-5 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">{formatNumber(systemMetrics.dailyApiCalls)}</div>
              <div className="text-sm text-slate-400">Today</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Health</h3>
                <Activity className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white">{systemMetrics.systemHealth}%</div>
              <div className="text-sm text-slate-400">Overall status</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Data Flows</h3>
                <Database className="h-5 w-5 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-white">{systemMetrics.dataFlows}</div>
              <div className="text-sm text-slate-400">Active pipelines</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Error Rate</h3>
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="text-2xl font-bold text-white">{(systemMetrics.errorRate * 100).toFixed(2)}%</div>
              <div className="text-sm text-slate-400">Last 24h</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Integration Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700/50">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-slate-700">Dashboard</TabsTrigger>
            <TabsTrigger value="integrations" className="data-[state=active]:bg-slate-700">Integrations</TabsTrigger>
            <TabsTrigger value="apis" className="data-[state=active]:bg-slate-700">API Endpoints</TabsTrigger>
            <TabsTrigger value="dataflows" className="data-[state=active]:bg-slate-700">Data Flows</TabsTrigger>
            <TabsTrigger value="monitoring" className="data-[state=active]:bg-slate-700">Monitoring</TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Top Integrations */}
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Top Performing Integrations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {integrations.slice(0, 5).map((integration) => (
                    <div key={integration.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                          <Globe className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{integration.name}</div>
                          <div className="text-xs text-slate-400">{formatNumber(integration.dailyRequests)} requests today</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-white">{integration.health}%</div>
                        <Badge className={getStatusColor(integration.status)}>
                          {integration.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent API Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {apiEndpoints.slice(0, 5).map((endpoint) => (
                    <div key={endpoint.id} className="p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                          {endpoint.method}
                        </Badge>
                        <span className="text-xs text-slate-400">
                          {new Date(endpoint.lastCalled).toLocaleTimeString()}
                        </span>
                      </div>
                      <h4 className="font-semibold text-white text-sm mb-1">{endpoint.name}</h4>
                      <p className="text-slate-300 text-xs mb-2">{endpoint.path}</p>
                      <div className="flex justify-between text-xs text-slate-500">
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
            <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search integrations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-600 text-white"
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-48 bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="crm">CRM</SelectItem>
                  <SelectItem value="erp">ERP</SelectItem>
                  <SelectItem value="analytics">Analytics</SelectItem>
                  <SelectItem value="communication">Communication</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="productivity">Productivity</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Integrations Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredIntegrations.map((integration) => (
                <Card key={integration.id} className="bg-slate-900/50 border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
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
                    <p className="text-slate-400 text-sm">{integration.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    
                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-slate-400">Health</div>
                        <div className="text-white font-medium">{integration.health}%</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Response Time</div>
                        <div className="text-white font-medium">{integration.responseTime}ms</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Daily Requests</div>
                        <div className="text-white font-medium">{formatNumber(integration.dailyRequests)}</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Error Rate</div>
                        <div className="text-white font-medium">{(integration.errorRate * 100).toFixed(2)}%</div>
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <div className="text-sm font-semibold text-white mb-2">Features</div>
                      <div className="flex flex-wrap gap-2">
                        {integration.features.slice(0, 3).map((feature, index) => (
                          <Badge key={index} variant="outline" className="border-slate-600 text-slate-300 text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {integration.features.length > 3 && (
                          <Badge variant="outline" className="border-slate-600 text-slate-300 text-xs">
                            +{integration.features.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                        <Settings className="w-4 h-4 mr-2" />
                        Configure
                      </Button>
                      <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                        <Monitor className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                        <FileText className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* API Endpoints */}
          <TabsContent value="apis" className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-800/50 border-b border-slate-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Endpoint</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Method</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Integration</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Requests (24h)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Success Rate</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Avg Response</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {apiEndpoints.map((endpoint) => (
                        <tr key={endpoint.id} className="hover:bg-slate-800/30">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-white">{endpoint.name}</div>
                              <div className="text-xs text-slate-400 font-mono">{endpoint.path}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                              {endpoint.method}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                            {endpoint.integration}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                            {formatNumber(endpoint.requests24h)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`${endpoint.successRate >= 99 ? 'text-emerald-400' : endpoint.successRate >= 95 ? 'text-amber-400' : 'text-red-400'}`}>
                              {endpoint.successRate}%
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                            {endpoint.averageResponse}ms
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={getStatusColor(endpoint.status)}>
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
                <Card key={flow.id} className="bg-slate-900/50 border-slate-700/50">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{flow.name}</h3>
                          <Badge className={getStatusColor(flow.status)}>
                            {flow.status.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="border-slate-600 text-slate-300">
                            {flow.type.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-300">
                          <div className="flex items-center gap-2">
                            <Database className="w-4 h-4 text-blue-400" />
                            {flow.source}
                          </div>
                          <div>→</div>
                          <div className="flex items-center gap-2">
                            <Database className="w-4 h-4 text-emerald-400" />
                            {flow.destination}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-400">Records Processed</div>
                        <div className="text-2xl font-bold text-white">{formatNumber(flow.recordsProcessed)}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div>
                        <div className="text-sm text-slate-400">Frequency</div>
                        <div className="text-white font-medium">{flow.frequency}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-400">Last Run</div>
                        <div className="text-white font-medium">{new Date(flow.lastRun).toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-400">Error Count</div>
                        <div className={`font-medium ${flow.errorCount === 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {flow.errorCount}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-400">Transformations</div>
                        <div className="text-white font-medium">{flow.transformations.length}</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-3">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Monitor className="w-4 h-4 mr-2" />
                        Monitor
                      </Button>
                      <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                        <Settings className="w-4 h-4 mr-2" />
                        Configure
                      </Button>
                      <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                        {flow.status === 'running' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Monitoring */}
          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Uptime</h3>
                    <Activity className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">99.9%</div>
                  <div className="text-sm text-slate-400">Last 30 days</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Throughput</h3>
                    <Zap className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">1.2K/s</div>
                  <div className="text-sm text-slate-400">Requests per second</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Latency</h3>
                    <Clock className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">234ms</div>
                  <div className="text-sm text-slate-400">P95 response time</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Data Volume</h3>
                    <Database className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">2.3TB</div>
                  <div className="text-sm text-slate-400">Processed today</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </VeridiusPageLayout>
  );
}