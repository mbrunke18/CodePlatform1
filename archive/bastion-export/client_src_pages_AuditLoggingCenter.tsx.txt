import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import VeridiusPageLayout from '@/components/layout/VeridiusPageLayout';
import { 
  FileText, 
  Shield, 
  Clock, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Eye,
  Download,
  Filter,
  Search,
  Activity,
  Database,
  Lock,
  Unlock,
  Settings,
  Target,
  BarChart3,
  Calendar as CalendarIcon,
  TrendingUp,
  Globe,
  Monitor,
  Key
} from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  resourceId?: string;
  category: 'authentication' | 'data_access' | 'configuration' | 'decision' | 'system' | 'security';
  severity: 'low' | 'medium' | 'high' | 'critical';
  outcome: 'success' | 'failure' | 'warning';
  ipAddress: string;
  userAgent?: string;
  details: string;
  metadata?: {
    sessionId?: string;
    requestId?: string;
    geolocation?: string;
    duration?: number;
  };
}

interface SecurityEvent {
  id: string;
  type: 'failed_login' | 'suspicious_activity' | 'privilege_escalation' | 'data_export' | 'unauthorized_access';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  user: string;
  description: string;
  status: 'detected' | 'investigating' | 'resolved' | 'false_positive';
  riskScore: number;
  affectedResources: string[];
  recommendations: string[];
}

interface ComplianceReport {
  id: string;
  reportType: string;
  period: string;
  generatedDate: string;
  status: 'generated' | 'reviewed' | 'approved';
  findings: {
    category: string;
    count: number;
    severity: string;
    details: string[];
  }[];
  compliance: {
    framework: string;
    score: number;
    requirements: {
      requirement: string;
      status: 'compliant' | 'non_compliant' | 'partial';
      evidence: string;
    }[];
  }[];
}

export default function AuditLoggingCenter() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [complianceReports, setComplianceReports] = useState<ComplianceReport[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [metrics, setMetrics] = useState({
    totalLogs: 15847,
    securityEvents: 23,
    complianceScore: 97.8,
    systemHealth: 99.2,
    dailyLogins: 1247,
    failedAttempts: 12
  });

  useEffect(() => {
    // Generate sample audit logs
    const generateAuditLogs = (): AuditLog[] => {
      const actions = [
        'User Login', 'User Logout', 'Document Access', 'Configuration Change',
        'Data Export', 'Permission Grant', 'System Backup', 'Password Reset',
        'Resource Creation', 'Resource Deletion', 'API Access', 'Report Generation'
      ];
      
      const resources = [
        'Strategic Planning Hub', 'Crisis Response Center', 'AI Intelligence',
        'Executive Dashboard', 'User Management', 'System Configuration',
        'Financial Data', 'Customer Database', 'API Gateway', 'Security Settings'
      ];
      
      const users = [
        'Sarah Chen (CEO)', 'Michael Torres (CTO)', 'Jennifer Kim (VP Strategy)',
        'David Rodriguez (CFO)', 'Alex Johnson (COO)', 'System Admin',
        'API Service', 'Background Process'
      ];

      return Array.from({ length: 50 }, (_, i) => ({
        id: `log-${i + 1}`,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        user: users[Math.floor(Math.random() * users.length)],
        action: actions[Math.floor(Math.random() * actions.length)],
        resource: resources[Math.floor(Math.random() * resources.length)],
        resourceId: `res-${Math.floor(Math.random() * 1000)}`,
        category: ['authentication', 'data_access', 'configuration', 'decision', 'system', 'security'][Math.floor(Math.random() * 6)] as any,
        severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
        outcome: ['success', 'failure', 'warning'][Math.floor(Math.random() * 3)] as any,
        ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        userAgent: 'Mozilla/5.0 (compatible; Veridius/1.0)',
        details: `Audit log entry for ${actions[Math.floor(Math.random() * actions.length)]} operation`,
        metadata: {
          sessionId: `sess-${Math.random().toString(36).substr(2, 9)}`,
          requestId: `req-${Math.random().toString(36).substr(2, 9)}`,
          geolocation: ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'London, UK'][Math.floor(Math.random() * 4)],
          duration: Math.floor(Math.random() * 5000)
        }
      }));
    };

    const securityEvents: SecurityEvent[] = [
      {
        id: 'sec-001',
        type: 'failed_login',
        severity: 'medium',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        user: 'Unknown User',
        description: 'Multiple failed login attempts from suspicious IP address',
        status: 'investigating',
        riskScore: 65,
        affectedResources: ['Authentication System'],
        recommendations: ['Monitor IP address', 'Consider temporary IP block', 'Review authentication logs']
      },
      {
        id: 'sec-002',
        type: 'data_export',
        severity: 'high',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        user: 'Jennifer Kim (VP Strategy)',
        description: 'Large data export outside normal business hours',
        status: 'resolved',
        riskScore: 75,
        affectedResources: ['Strategic Planning Data', 'Market Analysis Reports'],
        recommendations: ['Verify export authorization', 'Review data classification', 'Update access policies']
      },
      {
        id: 'sec-003',
        type: 'privilege_escalation',
        severity: 'critical',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        user: 'Unknown Service Account',
        description: 'Unauthorized attempt to escalate system privileges',
        status: 'detected',
        riskScore: 90,
        affectedResources: ['System Configuration', 'User Management'],
        recommendations: ['Immediate investigation required', 'Review service account permissions', 'Audit system access']
      }
    ];

    const complianceReports: ComplianceReport[] = [
      {
        id: 'comp-001',
        reportType: 'SOX Compliance Review',
        period: 'Q1 2024',
        generatedDate: new Date().toISOString(),
        status: 'approved',
        findings: [
          {
            category: 'Access Controls',
            count: 3,
            severity: 'medium',
            details: ['Privileged access review needed', 'Role segregation improvements', 'Access certification overdue']
          },
          {
            category: 'Data Protection',
            count: 1,
            severity: 'low',
            details: ['Encryption key rotation schedule']
          }
        ],
        compliance: [
          {
            framework: 'SOX',
            score: 96.5,
            requirements: [
              { requirement: 'Internal Controls', status: 'compliant', evidence: 'Monthly access reviews documented' },
              { requirement: 'Data Integrity', status: 'compliant', evidence: 'Automated data validation in place' },
              { requirement: 'Audit Trail', status: 'compliant', evidence: 'Comprehensive logging implemented' }
            ]
          }
        ]
      },
      {
        id: 'comp-002',
        reportType: 'GDPR Privacy Assessment',
        period: 'Q1 2024',
        generatedDate: new Date(Date.now() - 86400000).toISOString(),
        status: 'reviewed',
        findings: [
          {
            category: 'Data Processing',
            count: 2,
            severity: 'medium',
            details: ['Update privacy notices', 'Data retention policy review']
          }
        ],
        compliance: [
          {
            framework: 'GDPR',
            score: 94.2,
            requirements: [
              { requirement: 'Lawful Basis', status: 'compliant', evidence: 'Privacy policy updated' },
              { requirement: 'Data Subject Rights', status: 'partial', evidence: 'Automated deletion in progress' },
              { requirement: 'Data Protection Impact Assessment', status: 'compliant', evidence: 'DPIA completed for AI systems' }
            ]
          }
        ]
      }
    ];

    setAuditLogs(generateAuditLogs());
    setSecurityEvents(securityEvents);
    setComplianceReports(complianceReports);

    // Update metrics in real-time
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        totalLogs: prev.totalLogs + Math.floor(Math.random() * 5),
        dailyLogins: prev.dailyLogins + Math.floor(Math.random() * 3),
        failedAttempts: prev.failedAttempts + Math.floor(Math.random() * 2)
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'authentication': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'data_access': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'configuration': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'decision': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'system': return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
      case 'security': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'success': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'failure': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'warning': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.resource.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || log.category === filterCategory;
    const matchesSeverity = filterSeverity === 'all' || log.severity === filterSeverity;
    
    return matchesSearch && matchesCategory && matchesSeverity;
  });

  return (
    <VeridiusPageLayout>
      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        
        {/* Audit Logging Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Enterprise Audit & Compliance Center</h1>
            <p className="text-slate-300">Comprehensive activity logging, security monitoring, and compliance tracking</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
              <Shield className="w-4 h-4 mr-2" />
              Compliance: {metrics.complianceScore}%
            </Badge>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Export Logs
            </Button>
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Total Logs</h3>
                <FileText className="h-5 w-5 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">{metrics.totalLogs.toLocaleString()}</div>
              <div className="text-sm text-slate-400">All time</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Security Events</h3>
                <AlertTriangle className="h-5 w-5 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-white">{metrics.securityEvents}</div>
              <div className="text-sm text-slate-400">This month</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Compliance</h3>
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white">{metrics.complianceScore}%</div>
              <div className="text-sm text-slate-400">Overall score</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">System Health</h3>
                <Activity className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white">{metrics.systemHealth}%</div>
              <div className="text-sm text-slate-400">Uptime</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Daily Logins</h3>
                <Users className="h-5 w-5 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">{metrics.dailyLogins}</div>
              <div className="text-sm text-slate-400">Today</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Failed Attempts</h3>
                <Lock className="h-5 w-5 text-red-400" />
              </div>
              <div className="text-2xl font-bold text-white">{metrics.failedAttempts}</div>
              <div className="text-sm text-slate-400">Today</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Audit Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700/50">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-slate-700">Dashboard</TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:bg-slate-700">Audit Logs</TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-slate-700">Security Events</TabsTrigger>
            <TabsTrigger value="compliance" className="data-[state=active]:bg-slate-700">Compliance</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-700">Analytics</TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Recent Activity */}
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                  {auditLogs.slice(0, 8).map((log) => (
                    <div key={log.id} className="p-3 bg-slate-800/50 rounded-lg border border-slate-600/50">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getCategoryColor(log.category)}>
                            {log.category.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <Badge className={getOutcomeColor(log.outcome)}>
                            {log.outcome.toUpperCase()}
                          </Badge>
                        </div>
                        <span className="text-xs text-slate-400">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <h4 className="font-semibold text-white text-sm mb-1">{log.action}</h4>
                      <p className="text-slate-300 text-sm mb-2">{log.details}</p>
                      <div className="text-xs text-slate-500">
                        User: {log.user} | Resource: {log.resource}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Security Alerts */}
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {securityEvents.slice(0, 3).map((event) => (
                    <div key={event.id} className="p-3 bg-slate-800/50 rounded-lg border border-slate-600/50">
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={getSeverityColor(event.severity)}>
                          {event.severity.toUpperCase()}
                        </Badge>
                        <div className="text-right">
                          <div className="text-sm font-medium text-white">Risk: {event.riskScore}%</div>
                          <div className="text-xs text-slate-400">{event.status}</div>
                        </div>
                      </div>
                      <h4 className="font-semibold text-white text-sm mb-1">{event.type.replace('_', ' ')}</h4>
                      <p className="text-slate-300 text-sm mb-2">{event.description}</p>
                      <div className="text-xs text-slate-500">
                        User: {event.user} | {new Date(event.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Audit Logs */}
          <TabsContent value="logs" className="space-y-6">
            
            {/* Filters */}
            <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search logs..."
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
                  <SelectItem value="authentication">Authentication</SelectItem>
                  <SelectItem value="data_access">Data Access</SelectItem>
                  <SelectItem value="configuration">Configuration</SelectItem>
                  <SelectItem value="decision">Decision</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger className="w-40 bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Logs Table */}
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-800/50 border-b border-slate-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Timestamp</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Action</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Resource</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Outcome</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {filteredLogs.slice(0, 20).map((log) => (
                        <tr key={log.id} className="hover:bg-slate-800/30">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                            {log.user}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                            {log.action}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                            {log.resource}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={getCategoryColor(log.category)}>
                              {log.category.replace('_', ' ')}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={getOutcomeColor(log.outcome)}>
                              {log.outcome}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Events */}
          <TabsContent value="security" className="space-y-6">
            <div className="space-y-4">
              {securityEvents.map((event) => (
                <Card key={event.id} className="bg-slate-900/50 border-slate-700/50">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{event.type.replace('_', ' ').toUpperCase()}</h3>
                          <Badge className={getSeverityColor(event.severity)}>
                            {event.severity.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="border-slate-600 text-slate-300">
                            {event.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-slate-300 mb-4">{event.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-400">Risk Score</div>
                        <div className="text-2xl font-bold text-white">{event.riskScore}%</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="text-sm font-semibold text-white mb-2">Affected Resources</div>
                        <div className="space-y-1">
                          {event.affectedResources.map((resource, index) => (
                            <div key={index} className="text-sm text-slate-300 flex items-center gap-2">
                              <Database className="w-4 h-4 text-blue-400" />
                              {resource}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-semibold text-white mb-2">Recommendations</div>
                        <div className="space-y-1">
                          {event.recommendations.map((rec, index) => (
                            <div key={index} className="text-sm text-slate-300 flex items-center gap-2">
                              <Target className="w-4 h-4 text-emerald-400" />
                              {rec}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between">
                      <div className="text-xs text-slate-500">
                        User: {event.user} | Detected: {new Date(event.timestamp).toLocaleString()}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Eye className="w-4 h-4 mr-2" />
                          Investigate
                        </Button>
                        <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                          Mark Resolved
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Compliance */}
          <TabsContent value="compliance" className="space-y-6">
            <div className="space-y-4">
              {complianceReports.map((report) => (
                <Card key={report.id} className="bg-slate-900/50 border-slate-700/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">{report.reportType}</CardTitle>
                      <Badge className={report.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'}>
                        {report.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <div className="text-sm text-slate-400">Period</div>
                        <div className="text-white font-medium">{report.period}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-400">Generated</div>
                        <div className="text-white font-medium">{new Date(report.generatedDate).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-400">Overall Score</div>
                        <div className="text-white font-medium">{report.compliance[0]?.score}%</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-white mb-3">Findings</h4>
                      <div className="space-y-2">
                        {report.findings.map((finding, index) => (
                          <div key={index} className="p-3 bg-slate-800/50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-white">{finding.category}</span>
                              <Badge className={getSeverityColor(finding.severity)}>
                                {finding.count} {finding.severity.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="text-sm text-slate-300">
                              {finding.details.join(', ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Download className="w-4 h-4 mr-2" />
                        Download Report
                      </Button>
                      <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Log Volume</h3>
                    <BarChart3 className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">2,847</div>
                  <div className="text-sm text-slate-400">Logs today</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Security Score</h3>
                    <Shield className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">94.2%</div>
                  <div className="text-sm text-slate-400">Overall security</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Response Time</h3>
                    <Clock className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">1.2s</div>
                  <div className="text-sm text-slate-400">Average response</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Threat Detection</h3>
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">99.7%</div>
                  <div className="text-sm text-slate-400">Detection rate</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </VeridiusPageLayout>
  );
}