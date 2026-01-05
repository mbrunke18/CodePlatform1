import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'wouter';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useState } from 'react';
import VeridiusPageLayout from '@/components/layout/VeridiusPageLayout';
import { 
  Settings, 
  Users, 
  Shield, 
  Database, 
  Globe,
  Bell,
  Key,
  Activity,
  BarChart3,
  Crown,
  Building2,
  CheckCircle,
  AlertTriangle,
  Clock,
  Zap,
  FileText,
  Target,
  ArrowLeft,
  Home,
  RotateCcw,
  PlayCircle,
  RefreshCw
} from 'lucide-react';

export default function SettingsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedScenario, setSelectedScenario] = useState('apac-competitive-response');
  
  // Fetch available demo scenarios
  const { data: scenariosData, isLoading: scenariosLoading } = useQuery({
    queryKey: ['/api/demo/scenarios'],
    enabled: true
  });
  
  // Demo reset mutation
  const resetDemoMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/demo/reset', { scenarioId: selectedScenario });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Demo Reset Successful',
        description: `${data.demoNarrative} demo data has been reset. Organization: ${data.organization?.name || 'Demo Organization'}`,
        variant: 'default',
      });
      // Invalidate all cache to refresh the UI with new data
      queryClient.invalidateQueries({ queryKey: ['/api/organizations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/scenarios'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
    },
    onError: (error) => {
      toast({
        title: 'Demo Reset Failed',
        description: error instanceof Error ? error.message : 'Failed to reset demo data',
        variant: 'destructive',
      });
    },
  });

  const systemStatus = [
    { service: "AI Intelligence Modules", status: "Active", uptime: "99.97%", color: "text-green-600" },
    { service: "Crisis Response Systems", status: "Ready", uptime: "99.99%", color: "text-green-600" },
    { service: "Database Performance", status: "Optimal", uptime: "99.95%", color: "text-green-600" },
    { service: "WebSocket Connections", status: "Connected", uptime: "99.92%", color: "text-green-600" }
  ];

  const enterpriseFeatures = [
    { 
      name: "Advanced Decision Tracking", 
      description: "Track strategic decisions and learn from outcomes",
      enabled: true,
      critical: true
    },
    { 
      name: "Learning Pattern Recognition", 
      description: "AI-powered organizational pattern analysis",
      enabled: true,
      critical: true
    },
    { 
      name: "Institutional Memory", 
      description: "Preserve and access organizational knowledge",
      enabled: true,
      critical: true
    },
    { 
      name: "Real-time Crisis Alerts", 
      description: "Immediate notifications for crisis scenarios",
      enabled: true,
      critical: false
    },
    { 
      name: "Executive Reporting", 
      description: "Automated board and C-suite reporting",
      enabled: true,
      critical: false
    }
  ];

  return (
    <VeridiusPageLayout>
      <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="p-8">
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-800 dark:hover:text-white p-1 h-auto">
                  <Home className="h-4 w-4" />
                </Button>
              </Link>
              <span>/</span>
              <span>Administration</span>
              <span>/</span>
              <span className="text-gray-800 dark:text-white">Settings</span>
            </div>
          </div>

          {/* Settings Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Settings className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">System Management</h1>
                <p className="text-gray-600 dark:text-gray-300">Enterprise Platform Administration & Configuration</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link to="/">
                <Button variant="secondary" className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Badge variant="outline" className="text-green-600 border-green-500/50">
                <CheckCircle className="w-3 h-3 mr-1" />
                All Systems Operational
              </Badge>
              <Badge className="bg-teal-600 text-white">
                Admin Access
              </Badge>
            </div>
          </div>

          <Tabs defaultValue="system" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="system" data-testid="tab-system-status">
                <Activity className="w-4 h-4 mr-2" />
                System Status
              </TabsTrigger>
              <TabsTrigger value="users" data-testid="tab-user-management">
                <Users className="w-4 h-4 mr-2" />
                User Management
              </TabsTrigger>
              <TabsTrigger value="security" data-testid="tab-security-settings">
                <Shield className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="enterprise" data-testid="tab-enterprise-features">
                <Crown className="w-4 h-4 mr-2" />
                Enterprise Features
              </TabsTrigger>
              <TabsTrigger value="integrations" data-testid="tab-integrations">
                <Globe className="w-4 h-4 mr-2" />
                Integrations
              </TabsTrigger>
              <TabsTrigger value="demo" data-testid="tab-demo-management">
                <PlayCircle className="w-4 h-4 mr-2" />
                Demo Management
              </TabsTrigger>
            </TabsList>

            {/* System Status Tab */}
            <TabsContent value="system" className="space-y-6">
              <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900 dark:text-white">
                    <Activity className="w-5 h-5 mr-2 text-blue-500" />
                    Platform Status Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {systemStatus.map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">{service.service}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Uptime: {service.uptime}</p>
                          </div>
                        </div>
                        <Badge variant="default" className="bg-green-600">
                          {service.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button data-testid="button-system-health-check">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Run Health Check
                    </Button>
                    <Button variant="outline" data-testid="button-restart-services">
                      <Zap className="w-4 h-4 mr-2" />
                      Restart Services
                    </Button>
                    <Button variant="outline" data-testid="button-view-logs">
                      <FileText className="w-4 h-4 mr-2" />
                      View System Logs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* User Management Tab */}
            <TabsContent value="users" className="space-y-6">
              <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900 dark:text-white">
                    <Users className="w-5 h-5 mr-2 text-green-500" />
                    Enterprise User Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">1,247</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
                      </div>
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">94%</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Platform Adoption</div>
                      </div>
                      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">47</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Admin Users</div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button data-testid="button-add-user">
                        <Users className="w-4 h-4 mr-2" />
                        Add Enterprise User
                      </Button>
                      <Button variant="outline" data-testid="button-bulk-import">
                        <Database className="w-4 h-4 mr-2" />
                        Bulk Import
                      </Button>
                      <Button variant="outline" data-testid="button-export-users">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Export User Data
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Enterprise Features Tab */}
            <TabsContent value="enterprise" className="space-y-6">
              <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900 dark:text-white">
                    <Crown className="w-5 h-5 mr-2 text-purple-500" />
                    Fortune 1000 Enterprise Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {enterpriseFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{feature.name}</h4>
                            {feature.critical && (
                              <Badge variant="destructive">Critical</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Switch 
                            checked={feature.enabled}
                            disabled={feature.critical}
                            data-testid={`switch-${feature.name.toLowerCase().replace(/\s+/g, '-')}`}
                          />
                          <Badge variant={feature.enabled ? 'default' : 'secondary'}>
                            {feature.enabled ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                    <div className="flex items-center text-purple-800 dark:text-purple-200">
                      <Crown className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Enterprise Intelligence Platform Status</span>
                    </div>
                    <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                      All Fortune 1000 enterprise features are active and optimized for organizational intelligence and crisis response excellence.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Settings Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900 dark:text-white">
                    <Shield className="w-5 h-5 mr-2 text-red-500" />
                    Enterprise Security Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                        <Input 
                          id="session-timeout" 
                          type="number" 
                          defaultValue="60"
                          data-testid="input-session-timeout"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="max-attempts">Max Login Attempts</Label>
                        <Input 
                          id="max-attempts" 
                          type="number" 
                          defaultValue="5"
                          data-testid="input-max-login-attempts"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Require 2FA for all admin users</p>
                        </div>
                        <Switch defaultChecked data-testid="switch-2fa-required" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Audit Logging</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Log all user actions and system events</p>
                        </div>
                        <Switch defaultChecked data-testid="switch-audit-logging" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Advanced Encryption</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">AES-256 encryption for sensitive data</p>
                        </div>
                        <Switch defaultChecked disabled />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Integrations Tab */}
            <TabsContent value="integrations" className="space-y-6">
              <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900 dark:text-white">
                    <Globe className="w-5 h-5 mr-2 text-blue-500" />
                    Enterprise System Integrations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Connected Systems</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">Salesforce CRM</span>
                          <Badge className="bg-green-600">Connected</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">Microsoft Teams</span>
                          <Badge className="bg-green-600">Connected</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">SAP ERP</span>
                          <Badge className="bg-green-600">Connected</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Available Integrations</h4>
                      <div className="space-y-3">
                        <Button className="w-full justify-start" variant="outline" data-testid="button-integrate-slack">
                          <Building2 className="w-4 h-4 mr-2" />
                          Slack Workspace
                        </Button>
                        <Button className="w-full justify-start" variant="outline" data-testid="button-integrate-jira">
                          <Target className="w-4 h-4 mr-2" />
                          Jira Project Management
                        </Button>
                        <Button className="w-full justify-start" variant="outline" data-testid="button-integrate-tableau">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Tableau Analytics
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Demo Management Tab */}
            <TabsContent value="demo" className="space-y-6">
              <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900 dark:text-white">
                    <PlayCircle className="w-5 h-5 mr-2 text-orange-500" />
                    Fortune 500 Demo Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <AlertDescription className="text-orange-800 dark:text-orange-200">
                        <strong>Demo Reset:</strong> This completely replaces all platform data with a selected Fortune 500 executive crisis scenario for sales presentations. Choose from multiple compelling narratives.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="scenario-select" className="text-sm font-medium text-gray-900 dark:text-white">
                          Select Demo Scenario
                        </Label>
                        <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                          <SelectTrigger className="w-full mt-2" data-testid="select-demo-scenario">
                            <SelectValue placeholder="Choose a Fortune 500 crisis scenario..." />
                          </SelectTrigger>
                          <SelectContent>
                            {!scenariosLoading && scenariosData?.scenarios?.map((scenario: any) => (
                              <SelectItem key={scenario.id} value={scenario.id}>
                                {scenario.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {scenariosData?.scenarios && (
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Selected Scenario Preview</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                              <Building2 className="w-4 h-4 mr-2 text-blue-500" />
                              <span><strong>Scenario:</strong> {scenariosData.scenarios.find((s: any) => s.id === selectedScenario)?.name}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                              <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
                              <span><strong>Crisis Type:</strong> Executive-Level Response</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                              <Target className="w-4 h-4 mr-2 text-orange-500" />
                              <span><strong>Audience:</strong> Fortune 500 Executives</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                              <Users className="w-4 h-4 mr-2 text-green-500" />
                              <span><strong>Executive Team:</strong> C-Suite Leadership</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                              <Clock className="w-4 h-4 mr-2 text-purple-500" />
                              <span><strong>Timeline:</strong> Active crisis response</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                              <Activity className="w-4 h-4 mr-2 text-blue-500" />
                              <span><strong>AI Modules:</strong> Full intelligence suite</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white/60 dark:bg-slate-800/60 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                            <strong>Demo Title:</strong> {scenariosData.scenarios.find((s: any) => s.id === selectedScenario)?.title}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Each scenario includes realistic organizational data, executive briefings, strategic action items, AI intelligence modules, and crisis response workflows tailored for Fortune 500 leadership demonstrations.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button 
                        onClick={() => resetDemoMutation.mutate()}
                        disabled={resetDemoMutation.isPending || scenariosLoading}
                        className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white h-12"
                        data-testid="button-reset-demo-scenario"
                      >
                        {resetDemoMutation.isPending ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Resetting Demo Data...
                          </>
                        ) : (
                          <>
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reset Selected Scenario
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1 h-12"
                        data-testid="button-preview-demo-data"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Preview Demo Data
                      </Button>
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      <strong>Note:</strong> This action will completely replace all organizations, users, scenarios, tasks, and AI intelligence data with the Golden Demo dataset. This is intended for sales presentations and demonstrations only.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Enterprise Administration Actions */}
          <Card className="mt-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900 dark:text-white">
                <Crown className="w-5 h-5 mr-2 text-purple-500" />
                Enterprise Administration Commands
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button className="h-16 bg-blue-600 hover:bg-blue-700 text-white" data-testid="button-backup-system">
                  <Database className="w-5 h-5 mr-2" />
                  System Backup
                </Button>
                <Button className="h-16 bg-green-600 hover:bg-green-700 text-white" data-testid="button-performance-optimization">
                  <Zap className="w-5 h-5 mr-2" />
                  Optimize Performance
                </Button>
                <Button className="h-16 bg-purple-600 hover:bg-purple-700 text-white" data-testid="button-security-scan">
                  <Shield className="w-5 h-5 mr-2" />
                  Security Scan
                </Button>
                <Button className="h-16 bg-orange-600 hover:bg-orange-700 text-white" data-testid="button-generate-reports">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Generate Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </VeridiusPageLayout>
  );
}