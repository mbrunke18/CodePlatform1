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
import PageLayout from '@/components/layout/PageLayout';
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

const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

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
    { service: "AI Intelligence Modules", status: "Active", uptime: "99.97%", color: "text-[#2B8A6E]" },
    { service: "Crisis Response Systems", status: "Ready", uptime: "99.99%", color: "text-[#2B8A6E]" },
    { service: "Database Performance", status: "Optimal", uptime: "99.95%", color: "text-[#2B8A6E]" },
    { service: "WebSocket Connections", status: "Connected", uptime: "99.92%", color: "text-[#2B8A6E]" }
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
    <PageLayout>
      <div style={{ background: "#0A0F2E", padding: "40px 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ 
          position: "absolute", 
          inset: 0, 
          backgroundImage: "linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)", 
          backgroundSize: "44px 44px" 
        }} />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 28, height: 2, background: "rgba(255,255,255,0.35)", flexShrink: 0 }} />
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.45)" }}>Platform Settings</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(32px,4vw,48px)", lineHeight: 1.1, color: "#fff" }}>
                System <em style={{ fontStyle: "italic", color: "#DFC178" }}>Management</em>
              </h1>
              <p className="text-white/60 mt-1 max-w-2xl">
                Enterprise Platform Administration & Configuration
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Link to="/">
                <Button className="bg-white/10 hover:bg-white/20 text-white border-none">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div style={{ display:"inline-flex", alignItems:"center", gap:5, background:"rgba(43,138,110,0.12)", color:"#3BAF8A", fontSize:9, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase" as const, padding:"3px 10px" }}>
                <CheckCircle className="w-3 h-3 mr-1" />
                All Systems Operational
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 page-background overflow-auto bg-[#F8F7F4]">
        <div className="max-w-7xl mx-auto p-8">

          <Tabs defaultValue="system" className="space-y-6">
            <TabsList className="bg-white border border-[#E8E4DC] rounded-none h-12 p-0 gap-8 px-6 mb-8">
              <TabsTrigger 
                value="system" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#C9A84C] data-[state=active]:bg-transparent data-[state=active]:text-[#0A0F2E] text-[#6B7280] font-bold text-[10px] uppercase tracking-wider px-2" 
                data-testid="tab-system-status"
              >
                <Activity className="w-4 h-4 mr-2" />
                System Status
              </TabsTrigger>
              <TabsTrigger 
                value="users" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#C9A84C] data-[state=active]:bg-transparent data-[state=active]:text-[#0A0F2E] text-[#6B7280] font-bold text-[10px] uppercase tracking-wider px-2" 
                data-testid="tab-user-management"
              >
                <Users className="w-4 h-4 mr-2" />
                User Management
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#C9A84C] data-[state=active]:bg-transparent data-[state=active]:text-[#0A0F2E] text-[#6B7280] font-bold text-[10px] uppercase tracking-wider px-2" 
                data-testid="tab-security-settings"
              >
                <Shield className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger 
                value="enterprise" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#C9A84C] data-[state=active]:bg-transparent data-[state=active]:text-[#0A0F2E] text-[#6B7280] font-bold text-[10px] uppercase tracking-wider px-2" 
                data-testid="tab-enterprise-features"
              >
                <Crown className="w-4 h-4 mr-2" />
                Enterprise Features
              </TabsTrigger>
              <TabsTrigger 
                value="integrations" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#C9A84C] data-[state=active]:bg-transparent data-[state=active]:text-[#0A0F2E] text-[#6B7280] font-bold text-[10px] uppercase tracking-wider px-2" 
                data-testid="tab-integrations"
              >
                <Globe className="w-4 h-4 mr-2" />
                Integrations
              </TabsTrigger>
              <TabsTrigger 
                value="demo" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#C9A84C] data-[state=active]:bg-transparent data-[state=active]:text-[#0A0F2E] text-[#6B7280] font-bold text-[10px] uppercase tracking-wider px-2" 
                data-testid="tab-demo-management"
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                Demo Management
              </TabsTrigger>
            </TabsList>

            {/* System Status Tab */}
            <TabsContent value="system" className="space-y-6">
              <Card className="bg-white/90 backdrop-blur border-[#E8E4DC]">
                <CardHeader>
                  <CardTitle className="flex items-center text-[#0A0F2E]">
                    <Activity className="w-5 h-5 mr-2 text-[#0A0F2E]" />
                    Platform Status Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {systemStatus.map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-[#F8F7F4] rounded-none border border-[#E8E4DC]">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-[#2B8A6E]" />
                          <div>
                            <h4 className="font-semibold text-[#0A0F2E]">{service.service}</h4>
                            <p className="text-sm text-gray-800">Uptime: {service.uptime}</p>
                          </div>
                        </div>
                        <Badge variant="default" className="bg-[#2B8A6E] text-white">
                          {service.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button data-testid="button-system-health-check" className="bg-[#0A0F2E] text-white hover:bg-[#141B45]">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Run Health Check
                    </Button>
                    <Button variant="outline" data-testid="button-restart-services" className="rounded-none border-[#E8E4DC] text-[#0A0F2E] hover:bg-[#F8F7F4]">
                      <Zap className="w-4 h-4 mr-2" />
                      Restart Services
                    </Button>
                    <Button variant="outline" data-testid="button-view-logs" className="rounded-none border-[#E8E4DC] text-[#0A0F2E] hover:bg-[#F8F7F4]">
                      <FileText className="w-4 h-4 mr-2" />
                      View System Logs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* User Management Tab */}
            <TabsContent value="users" className="space-y-6">
              <Card className="bg-white/90 backdrop-blur border-[#E8E4DC]">
                <CardHeader>
                  <CardTitle className="flex items-center text-[#0A0F2E]">
                    <Users className="w-5 h-5 mr-2 text-[#0A0F2E]" />
                    Enterprise User Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-white border border-[#E8E4DC] rounded-none">
                        <div style={{ ...CG, fontSize: 32, fontWeight: 600, color: "#0A0F2E" }}>1,247</div>
                        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6B7280" }}>Active Users</div>
                      </div>
                      <div className="p-4 bg-white border border-[#E8E4DC] rounded-none">
                        <div style={{ ...CG, fontSize: 32, fontWeight: 600, color: "#2B8A6E" }}>94%</div>
                        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6B7280" }}>Platform Adoption</div>
                      </div>
                      <div className="p-4 bg-white border border-[#E8E4DC] rounded-none">
                        <div style={{ ...CG, fontSize: 32, fontWeight: 600, color: "#C9A84C" }}>47</div>
                        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6B7280" }}>Admin Users</div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button className="bg-[#0A0F2E] text-white hover:bg-[#141B45]" data-testid="button-add-user">
                        <Users className="w-4 h-4 mr-2" />
                        Add Enterprise User
                      </Button>
                      <Button variant="outline" className="border-[#E8E4DC] text-[#0A0F2E]" data-testid="button-bulk-import">
                        <Database className="w-4 h-4 mr-2" />
                        Bulk Import
                      </Button>
                      <Button variant="outline" className="border-[#E8E4DC] text-[#0A0F2E]" data-testid="button-export-users">
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
              <Card className="bg-white/90 backdrop-blur border-[#E8E4DC]">
                <CardHeader>
                  <CardTitle className="flex items-center text-[#0A0F2E]">
                    <Crown className="w-5 h-5 mr-2 text-[#C9A84C]" />
                    Fortune 1000 Enterprise Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {enterpriseFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-[#F8F7F4] rounded-none border border-[#E8E4DC]">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold text-[#0A0F2E]">{feature.name}</h4>
                            {feature.critical && (
                            <Badge variant="destructive" className="rounded-none">Critical</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-800">{feature.description}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Switch 
                        checked={feature.enabled}
                        disabled={feature.critical}
                        data-testid={`switch-${feature.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="data-[state=checked]:bg-[#2B8A6E] [&>span]:bg-white"
                      />
                      <Badge variant={feature.enabled ? 'default' : 'secondary'} className={feature.enabled ? 'bg-[#2B8A6E] text-white rounded-none' : 'bg-black/5 text-gray-700 rounded-none'}>
                        {feature.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                      </div>
                    ))}
                  </div>
                  
                  <div style={{ marginTop: 24, padding: 16, background: "rgba(201,168,76,0.08)", border: "1px solid #C9A84C", borderRadius: 0 }}>
                    <div className="flex items-center text-[#C9A84C]">
                      <Crown className="w-4 h-4 mr-2" />
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Enterprise Intelligence Platform Status</span>
                    </div>
                    <p className="text-xs text-[#0A0F2E] mt-2 font-medium">
                      All Fortune 1000 enterprise features are active and optimized for organizational intelligence and crisis response excellence.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Settings Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card className="border-[#E8E4DC] bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center text-[#0A0F2E] font-serif text-2xl">
                    <Shield className="w-6 h-6 mr-2 text-[#C9A84C]" />
                    Enterprise Security Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div style={{ padding: 16, background: "rgba(201,168,76,0.08)", border: "1px solid #C9A84C", borderRadius: 0, marginBottom: 24 }}>
                      <div className="flex items-center text-[#C9A84C] mb-2">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Critical Security Protocol</span>
                      </div>
                      <p className="text-xs text-[#0A0F2E] font-medium">
                        These settings affect platform-wide authentication and data protection. Any changes will be logged in the permanent audit trail.
                      </p>
                    </div>
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

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                          <p className="text-sm text-gray-800">Require 2FA for all admin users</p>
                        </div>
                        <Switch defaultChecked data-testid="switch-2fa-required" className="data-[state=checked]:bg-[#2B8A6E]" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Audit Logging</h4>
                          <p className="text-sm text-gray-800">Log all user actions and system events</p>
                        </div>
                        <Switch defaultChecked data-testid="switch-audit-logging" className="data-[state=checked]:bg-[#2B8A6E]" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Advanced Encryption</h4>
                          <p className="text-sm text-gray-800">AES-256 encryption for sensitive data</p>
                        </div>
                        <Switch defaultChecked disabled className="data-[state=checked]:bg-[#2B8A6E]" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Integrations Tab */}
            <TabsContent value="integrations" className="space-y-6">
              <Card className="bg-white/90 backdrop-blur border-[#E8E4DC]">
                <CardHeader>
                  <CardTitle className="flex items-center text-[#0A0F2E]">
                    <Globe className="w-5 h-5 mr-2 text-[#0A0F2E]" />
                    Enterprise System Integrations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-[#0A0F2E]">Connected Systems</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-[#2B8A6E]/10 border border-[#2B8A6E]/20 rounded-none">
                          <span className="text-sm font-medium text-[#0A0F2E]">Salesforce CRM</span>
                          <Badge className="bg-[#2B8A6E] text-white">Connected</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-[#2B8A6E]/10 border border-[#2B8A6E]/20 rounded-none">
                          <span className="text-sm font-medium text-[#0A0F2E]">Microsoft Teams</span>
                          <Badge className="bg-[#2B8A6E] text-white">Connected</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-[#2B8A6E]/10 border border-[#2B8A6E]/20 rounded-none">
                          <span className="text-sm font-medium text-[#0A0F2E]">SAP ERP</span>
                          <Badge className="bg-[#2B8A6E] text-white">Connected</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Available Integrations</h4>
                      <div className="space-y-3">
                        <Button className="w-full justify-start border-[#E8E4DC] text-[#0A0F2E] hover:bg-[#F8F7F4]" variant="outline" data-testid="button-integrate-slack">
                          <Building2 className="w-4 h-4 mr-2" />
                          Slack Workspace
                        </Button>
                        <Button className="w-full justify-start border-[#E8E4DC] text-[#0A0F2E] hover:bg-[#F8F7F4]" variant="outline" data-testid="button-integrate-jira">
                          <Target className="w-4 h-4 mr-2" />
                          Jira Project Management
                        </Button>
                        <Button className="w-full justify-start border-[#E8E4DC] text-[#0A0F2E] hover:bg-[#F8F7F4]" variant="outline" data-testid="button-integrate-tableau">
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
              <Card className="bg-white/90 backdrop-blur border-[#E8E4DC]">
                <CardHeader>
                  <CardTitle className="flex items-center text-[#0A0F2E]">
                    <PlayCircle className="w-5 h-5 mr-2 text-[#C9A84C]" />
                    Fortune 500 Demo Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <Alert className="border-[#C9A84C]/30 bg-[#C9A84C]/10 rounded-none">
                      <AlertTriangle className="h-4 w-4 text-[#C9A84C]" />
                      <AlertDescription className="text-[#0A0F2E]">
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
                      <div className="bg-[#F8F7F4] p-6 rounded-none border border-[#E8E4DC]">
                        <h3 className="text-lg font-semibold text-[#0A0F2E] mb-4">Selected Scenario Preview</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-800">
                              <Building2 className="w-4 h-4 mr-2 text-[#0A0F2E]" />
                              <span><strong>Scenario:</strong> {scenariosData.scenarios.find((s: any) => s.id === selectedScenario)?.name}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-800">
                              <AlertTriangle className="w-4 h-4 mr-2 text-red-600" />
                              <span><strong>Crisis Type:</strong> Executive-Level Response</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-800">
                              <Target className="w-4 h-4 mr-2 text-[#C9A84C]" />
                              <span><strong>Audience:</strong> Fortune 500 Executives</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-800">
                              <Users className="w-4 h-4 mr-2 text-[#2B8A6E]" />
                              <span><strong>Executive Team:</strong> C-Suite Leadership</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-800">
                              <Clock className="w-4 h-4 mr-2 text-[#C9A84C]" />
                              <span><strong>Timeline:</strong> Active crisis response</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-800">
                              <Activity className="w-4 h-4 mr-2 text-[#0A0F2E]" />
                              <span><strong>AI Modules:</strong> Full intelligence suite</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white p-4 rounded-none border border-[#E8E4DC]">
                          <p className="text-sm text-gray-800 mb-3">
                            <strong>Demo Title:</strong> {scenariosData.scenarios.find((s: any) => s.id === selectedScenario)?.title}
                          </p>
                          <p className="text-xs text-gray-800">
                            Each scenario includes realistic organizational data, executive briefings, strategic action items, AI intelligence modules, and crisis response workflows tailored for Fortune 500 leadership demonstrations.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button 
                        onClick={() => resetDemoMutation.mutate()}
                        disabled={resetDemoMutation.isPending || scenariosLoading}
                        className="flex-1 bg-[#0A0F2E] text-white hover:bg-[#141B45] h-12 rounded-none font-bold"
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

                    <div className="text-xs text-gray-800 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      <strong>Note:</strong> This action will completely replace all organizations, users, scenarios, tasks, and AI intelligence data with the Golden Demo dataset. This is intended for sales presentations and demonstrations only.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Enterprise Administration Actions */}
          <Card className="mt-8 bg-[#0A0F2E] border-[#C9A84C] rounded-none relative overflow-hidden">
            <div style={{ 
              position: "absolute", 
              inset: 0, 
              backgroundImage: "linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)", 
              backgroundSize: "20px 20px",
              opacity: 0.3
            }} />
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center text-white font-serif text-2xl">
                <Crown className="w-6 h-6 mr-2 text-[#C9A84C]" />
                Enterprise Administration Commands
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button className="h-16 bg-white/10 hover:bg-white/20 text-white border border-[#C9A84C]/30 rounded-none" data-testid="button-backup-system">
                  <Database className="w-5 h-5 mr-2 text-[#C9A84C]" />
                  System Backup
                </Button>
                <Button className="h-16 bg-white/10 hover:bg-white/20 text-white border border-[#C9A84C]/30 rounded-none" data-testid="button-performance-optimization">
                  <Zap className="w-5 h-5 mr-2 text-[#C9A84C]" />
                  Optimize Performance
                </Button>
                <Button className="h-16 bg-white/10 hover:bg-white/20 text-white border border-[#C9A84C]/30 rounded-none" data-testid="button-security-scan">
                  <Shield className="w-5 h-5 mr-2 text-[#C9A84C]" />
                  Security Scan
                </Button>
                <Button className="h-16 bg-white/10 hover:bg-white/20 text-white border border-[#C9A84C]/30 rounded-none" data-testid="button-generate-reports">
                  <BarChart3 className="w-5 h-5 mr-2 text-[#C9A84C]" />
                  Generate Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}