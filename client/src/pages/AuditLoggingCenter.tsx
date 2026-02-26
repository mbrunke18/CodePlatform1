import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
import { BrandStamp } from "@/components/BrandStamp";

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

import PageLayout from '@/components/layout/PageLayout';

export default function AuditLoggingCenter({ embedded }: { embedded?: boolean }) {
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
    const fetchData = async () => {
      try {
        const response = await fetch('/api/audit-logs');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            if (data.auditLogs) setAuditLogs(data.auditLogs);
            if (data.securityEvents) setSecurityEvents(data.securityEvents);
            if (data.complianceReports) setComplianceReports(data.complianceReports);
            if (data.metrics) setMetrics(data.metrics);
          }
        }
      } catch (error) {
        console.error('Error fetching audit logs:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'authentication': return 'bg-[#0A0F2E]/20 text-blue-300 border-[#0A0F2E]/30';
      case 'data_access': return 'bg-[#C9A84C]/20 text-[#C9A84C] border-[#C9A84C]/30';
      case 'configuration': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'decision': return 'bg-[#2B8A6E]/20 text-emerald-300 border-[#2B8A6E]/30';
      case 'system': return 'bg-slate-500/20 text-gray-800 border-slate-500/30';
      case 'security': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-slate-500/20 text-gray-800 border-slate-500/30';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-slate-500/20 text-gray-800 border-slate-500/30';
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'success': return 'bg-[#2B8A6E]/20 text-emerald-300 border-[#2B8A6E]/30';
      case 'failure': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'warning': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default: return 'bg-slate-500/20 text-gray-800 border-slate-500/30';
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
    <PageLayout embedded={embedded}>
      <div className="flex-1 page-background overflow-y-auto p-8 space-y-8">
        
        {/* Audit Logging Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Enterprise Audit & Compliance Center</h1>
            <p className="text-gray-800">Comprehensive activity logging, security monitoring, and compliance tracking</p>
          </div>
          <div className="flex items-center gap-4">
            <BrandStamp variant="dual" size="md" className="mb-8" />
            <Badge className="bg-[#2B8A6E]/20 text-emerald-300 border-[#2B8A6E]/30">
              <Shield className="w-4 h-4 mr-2" />
              Compliance: {metrics.complianceScore}%
            </Badge>
            <Button className="bg-[#0A0F2E] hover:bg-[#0A0F2E]">
              <Download className="w-4 h-4 mr-2" />
              Export Logs
            </Button>
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          <Card className="bg-white border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Total Logs</h3>
                <FileText className="h-5 w-5 text-[#0A0F2E]" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{metrics.totalLogs.toLocaleString()}</div>
              <div className="text-sm text-gray-800 dark:text-slate-200">All time</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Security Events</h3>
                <AlertTriangle className="h-5 w-5 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{metrics.securityEvents}</div>
              <div className="text-sm text-gray-800 dark:text-slate-200">This month</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Compliance</h3>
                <CheckCircle className="h-5 w-5 text-[#2B8A6E]" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{metrics.complianceScore}%</div>
              <div className="text-sm text-gray-800 dark:text-slate-200">Overall score</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">System Health</h3>
                <Activity className="h-5 w-5 text-[#2B8A6E]" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{metrics.systemHealth}%</div>
              <div className="text-sm text-gray-800 dark:text-slate-200">Uptime</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Daily Logins</h3>
                <Users className="h-5 w-5 text-[#C9A84C]" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{metrics.dailyLogins}</div>
              <div className="text-sm text-gray-800 dark:text-slate-200">Today</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Failed Attempts</h3>
                <Lock className="h-5 w-5 text-red-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{metrics.failedAttempts}</div>
              <div className="text-sm text-gray-800 dark:text-slate-200">Today</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Audit Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gray-50 border border-gray-200">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-gray-50">Dashboard</TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:bg-gray-50">Audit Logs</TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-gray-50">Security Events</TabsTrigger>
            <TabsTrigger value="compliance" className="data-[state=active]:bg-gray-50">Compliance</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gray-50">Analytics</TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Recent Activity */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                  {auditLogs.slice(0, 8).map((log) => (
                    <div key={log.id} className="p-3 bg-gray-50 rounded-lg border border-slate-600/50">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getCategoryColor(log.category)}>
                            {log.category.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <Badge className={getOutcomeColor(log.outcome)}>
                            {log.outcome.toUpperCase()}
                          </Badge>
                        </div>
                        <span className="text-xs text-gray-800 dark:text-slate-200">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">{log.action}</h4>
                      <p className="text-gray-800 text-sm mb-2">{log.details}</p>
                      <div className="text-xs text-gray-800">
                        User: {log.user} | Resource: {log.resource}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Security Alerts */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {securityEvents.slice(0, 3).map((event) => (
                    <div key={event.id} className="p-3 bg-gray-50 rounded-lg border border-slate-600/50">
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={getSeverityColor(event.severity)}>
                          {event.severity.toUpperCase()}
                        </Badge>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">Risk: {event.riskScore}%</div>
                          <div className="text-xs text-gray-800 dark:text-slate-200">{event.status}</div>
                        </div>
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">{event.type.replace('_', ' ')}</h4>
                      <p className="text-gray-800 text-sm mb-2">{event.description}</p>
                      <div className="text-xs text-gray-800">
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
            <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex-1 page-background relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-800 dark:text-slate-200" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-50 border-slate-600 text-gray-900"
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-48 bg-gray-50 border-slate-600 text-gray-900">
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
                <SelectTrigger className="w-40 bg-gray-50 border-slate-600 text-gray-900">
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
            <Card className="bg-white border-gray-200">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Timestamp</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Action</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Resource</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Outcome</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {filteredLogs.slice(0, 20).map((log) => (
                        <tr key={log.id} className="hover:bg-slate-800/30">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {log.user}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {log.action}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
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
                            <Button size="sm" variant="outline" className="bg-transparent border-slate-600 text-gray-800 hover:bg-slate-700">
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
                <Card key={event.id} className="bg-white border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 page-background">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{event.type.replace('_', ' ').toUpperCase()}</h3>
                          <Badge className={getSeverityColor(event.severity)}>
                            {event.severity.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="bg-transparent border-slate-600 text-gray-800">
                            {event.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-gray-800 mb-4">{event.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-800 dark:text-slate-200">Risk Score</div>
                        <div className="text-2xl font-bold text-gray-900">{event.riskScore}%</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="text-sm font-semibold text-gray-900 mb-2">Affected Resources</div>
                        <div className="space-y-1">
                          {event.affectedResources.map((resource, index) => (
                            <div key={index} className="text-sm text-gray-800 flex items-center gap-2">
                              <Database className="w-4 h-4 text-[#0A0F2E]" />
                              {resource}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-semibold text-gray-900 mb-2">Recommendations</div>
                        <div className="space-y-1">
                          {event.recommendations.map((rec, index) => (
                            <div key={index} className="text-sm text-gray-800 flex items-center gap-2">
                              <Target className="w-4 h-4 text-[#2B8A6E]" />
                              {rec}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                      <div className="text-xs text-gray-800">
                        User: {event.user} | Detected: {new Date(event.timestamp).toLocaleString()}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-[#0A0F2E] hover:bg-[#0A0F2E]">
                          <Eye className="w-4 h-4 mr-2" />
                          Investigate
                        </Button>
                        <Button size="sm" variant="outline" className="bg-transparent border-slate-600 text-gray-800 hover:bg-slate-700">
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
                <Card key={report.id} className="bg-white border-gray-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-gray-900">{report.reportType}</CardTitle>
                      <Badge className={report.status === 'approved' ? 'bg-[#2B8A6E]/20 text-emerald-300 border-[#2B8A6E]/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'}>
                        {report.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <div className="text-sm text-gray-800 dark:text-slate-200">Period</div>
                        <div className="text-gray-900 font-medium">{report.period}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-800 dark:text-slate-200">Generated</div>
                        <div className="text-gray-900 font-medium">{new Date(report.generatedDate).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-800 dark:text-slate-200">Overall Score</div>
                        <div className="text-gray-900 font-medium">{report.compliance[0]?.score}%</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Findings</h4>
                      <div className="space-y-2">
                        {report.findings.map((finding, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-900">{finding.category}</span>
                              <Badge className={getSeverityColor(finding.severity)}>
                                {finding.count} {finding.severity.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-800">
                              {finding.details.join(', ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button className="bg-[#0A0F2E] hover:bg-[#0A0F2E]">
                        <Download className="w-4 h-4 mr-2" />
                        Download Report
                      </Button>
                      <Button variant="outline" className="bg-transparent border-slate-600 text-gray-800 hover:bg-slate-700">
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
              <Card className="bg-white border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Log Volume</h3>
                    <BarChart3 className="h-5 w-5 text-[#0A0F2E]" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">2,847</div>
                  <div className="text-sm text-gray-800 dark:text-slate-200">Logs today</div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Security Score</h3>
                    <Shield className="h-5 w-5 text-[#2B8A6E]" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">94.2%</div>
                  <div className="text-sm text-gray-800 dark:text-slate-200">Overall security</div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Response Time</h3>
                    <Clock className="h-5 w-5 text-[#C9A84C]" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">1.2s</div>
                  <div className="text-sm text-gray-800 dark:text-slate-200">Average response</div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Threat Detection</h3>
                    <TrendingUp className="h-5 w-5 text-[#2B8A6E]" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">99.7%</div>
                  <div className="text-sm text-gray-800 dark:text-slate-200">Detection rate</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}