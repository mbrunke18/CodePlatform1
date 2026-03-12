import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import PageLayout from '@/components/layout/PageLayout';
import { Link } from 'wouter';
import { useDemoController } from '@/contexts/DemoController';
import { DemoStrategicAlert, DemoActiveStrategicCard } from '@/components/demo/DemoStrategicSimulation';
import { 
  AlertTriangle, 
  Shield, 
  Clock, 
  Users, 
  Phone, 
  Mail, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Activity, 
  Target, 
  Zap,
  Building2,
  Globe,
  TrendingUp,
  BarChart3,
  Settings,
  Bell,
  Play,
  Pause,
  Square,
  ArrowLeft,
  Home
} from 'lucide-react';

interface CrisisTemplate {
  id: string;
  name: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  activationTime: string;
  stakeholders: string[];
  resources: string[];
  phases: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  kpis: string[];
}

interface ActiveCrisis {
  id: string;
  template: string;
  status: 'active' | 'monitoring' | 'resolved';
  severity: string;
  startTime: string;
  currentPhase: string;
  progress: number;
  assignedTeam: string[];
  nextActions: string[];
}

export default function CrisisResponseCenter() {
  const demoController = useDemoController();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [crisisTemplates, setCrisisTemplates] = useState<CrisisTemplate[]>([]);
  const [activeCrises, setActiveCrises] = useState<ActiveCrisis[]>([]);
  const [systemStatus, setSystemStatus] = useState({
    readinessLevel: 95,
    responseTeamsActive: 8,
    protocolsReady: 15,
    lastDrillDate: '2024-02-15'
  });

  useEffect(() => {
    // Load comprehensive crisis response templates
    const templates: CrisisTemplate[] = [
      {
        id: 'supply-chain-disruption',
        name: 'Supply Chain Disruption',
        category: 'Operations',
        severity: 'high',
        description: 'Comprehensive response for major supply chain interruptions affecting production and delivery',
        activationTime: '< 2 hours',
        stakeholders: ['COO', 'Procurement', 'Operations', 'Communications', 'Legal'],
        resources: ['Emergency suppliers', 'Alternative logistics', 'Financial reserves'],
        phases: {
          immediate: ['Assess impact scope', 'Activate emergency suppliers', 'Notify key customers'],
          shortTerm: ['Implement alternative sourcing', 'Adjust production schedules', 'Manage customer expectations'],
          longTerm: ['Review supplier relationships', 'Strengthen resilience', 'Update contingency plans']
        },
        kpis: ['Supply chain recovery time', 'Customer satisfaction', 'Financial impact']
      },
      {
        id: 'cybersecurity-incident',
        name: 'Cybersecurity Incident',
        category: 'Technology',
        severity: 'critical',
        description: 'Immediate response protocols for data breaches, ransomware, or system compromises',
        activationTime: '< 30 minutes',
        stakeholders: ['CISO', 'IT Security', 'Legal', 'Communications', 'CEO'],
        resources: ['Incident response team', 'Forensics experts', 'Legal counsel', 'PR team'],
        phases: {
          immediate: ['Isolate affected systems', 'Assess breach scope', 'Notify authorities'],
          shortTerm: ['Contain threat', 'Begin forensics', 'Prepare communications'],
          longTerm: ['System recovery', 'Security improvements', 'Stakeholder updates']
        },
        kpis: ['Time to containment', 'Data exposure', 'System recovery time']
      },
      {
        id: 'financial-liquidity-crisis',
        name: 'Financial Liquidity Crisis',
        category: 'Finance',
        severity: 'critical',
        description: 'Emergency financial management for cash flow crises and liquidity shortfalls',
        activationTime: '< 4 hours',
        stakeholders: ['CFO', 'Treasury', 'Board', 'Banking Partners', 'Investors'],
        resources: ['Emergency credit lines', 'Asset liquidation', 'Investor relations'],
        phases: {
          immediate: ['Cash position assessment', 'Activate credit facilities', 'Board notification'],
          shortTerm: ['Asset optimization', 'Cost reduction measures', 'Stakeholder communication'],
          longTerm: ['Financial restructuring', 'Strategy adjustment', 'Recovery planning']
        },
        kpis: ['Cash runway', 'Credit utilization', 'Stakeholder confidence']
      },
      {
        id: 'reputation-crisis',
        name: 'Reputation Crisis',
        category: 'Communications',
        severity: 'high',
        description: 'Strategic communication response for negative publicity and reputation threats',
        activationTime: '< 1 hour',
        stakeholders: ['CEO', 'Communications', 'Legal', 'HR', 'Board'],
        resources: ['PR agency', 'Media monitoring', 'Executive spokespeople'],
        phases: {
          immediate: ['Monitor situation', 'Prepare holding statement', 'Executive briefing'],
          shortTerm: ['Public response', 'Stakeholder outreach', 'Media engagement'],
          longTerm: ['Reputation recovery', 'Trust rebuilding', 'Process improvements']
        },
        kpis: ['Media sentiment', 'Stakeholder trust', 'Business impact']
      },
      {
        id: 'pandemic-response',
        name: 'Pandemic Response',
        category: 'Health & Safety',
        severity: 'critical',
        description: 'Comprehensive health crisis management and business continuity protocols',
        activationTime: '< 6 hours',
        stakeholders: ['CEO', 'HR', 'Facilities', 'Operations', 'Legal'],
        resources: ['Health protocols', 'Remote work infrastructure', 'Medical support'],
        phases: {
          immediate: ['Employee safety', 'Workspace protocols', 'Communication plan'],
          shortTerm: ['Remote operations', 'Health monitoring', 'Supply adjustments'],
          longTerm: ['Recovery planning', 'Policy updates', 'Resilience building']
        },
        kpis: ['Employee health', 'Business continuity', 'Recovery timeline']
      },
      {
        id: 'regulatory-compliance',
        name: 'Regulatory Compliance Crisis',
        category: 'Legal',
        severity: 'high',
        description: 'Response to regulatory violations, investigations, or compliance failures',
        activationTime: '< 2 hours',
        stakeholders: ['Chief Legal Officer', 'Compliance', 'CEO', 'Board', 'External Counsel'],
        resources: ['Legal team', 'Compliance experts', 'External counsel', 'Documentation'],
        phases: {
          immediate: ['Violation assessment', 'Legal counsel', 'Authority notification'],
          shortTerm: ['Investigation support', 'Corrective actions', 'Stakeholder updates'],
          longTerm: ['Compliance strengthening', 'Process improvements', 'Monitoring systems']
        },
        kpis: ['Compliance restoration', 'Penalty minimization', 'Relationship recovery']
      }
    ];

    setCrisisTemplates(templates);

    // Mock active crisis for demonstration
    setActiveCrises([
      {
        id: 'cr-001',
        template: 'Supply Chain Disruption',
        status: 'monitoring',
        severity: 'medium',
        startTime: '2024-02-20 14:30',
        currentPhase: 'Short-term Response',
        progress: 65,
        assignedTeam: ['Operations Team', 'Procurement', 'Communications'],
        nextActions: ['Finalize alternative supplier contracts', 'Update delivery schedules', 'Customer communication']
      }
    ]);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      case 'high': return <AlertCircle className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <PageLayout>
      <div className="flex-1 page-background overflow-y-auto p-8 space-y-8" data-testid="crisis-response-center">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-1 h-auto">
                <Home className="h-4 w-4" />
              </Button>
            </Link>
            <span>/</span>
            <span>Crisis Management</span>
            <span>/</span>
            <span className="text-white">Crisis Response Center</span>
          </div>
        </div>

        {/* Crisis Response Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Crisis Response Command Center</h1>
            <p className="text-slate-300">Enterprise-grade crisis management with 15+ response protocols</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="secondary" className="bg-slate-700 hover:bg-slate-600 text-slate-100 border-slate-600">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
              <Shield className="w-4 h-4 mr-2" />
              All Systems Ready
            </Badge>
            <Button className="bg-red-600 hover:bg-red-700">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Emergency Activation
            </Button>
          </div>
        </div>

        {/* Demo Crisis Simulation - Only visible during demo mode */}
        <DemoStrategicAlert />
        <DemoActiveStrategicCard />

        {/* System Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Readiness Level</h3>
                <Shield className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">{systemStatus.readinessLevel}%</div>
              <Progress value={systemStatus.readinessLevel} className="h-2" />
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Response Teams</h3>
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">{systemStatus.responseTeamsActive}</div>
              <div className="text-sm text-slate-400">Teams Active</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Protocols Ready</h3>
                <FileText className="h-5 w-5 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">{systemStatus.protocolsReady}</div>
              <div className="text-sm text-slate-400">Response Templates</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Last Drill</h3>
                <Clock className="h-5 w-5 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">8</div>
              <div className="text-sm text-slate-400">days ago</div>
            </CardContent>
          </Card>
        </div>

        {/* Crisis Management Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700/50">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-slate-700">Dashboard</TabsTrigger>
            <TabsTrigger value="templates" className="data-[state=active]:bg-slate-700">Response Templates</TabsTrigger>
            <TabsTrigger value="active" className="data-[state=active]:bg-slate-700">Active Crises</TabsTrigger>
            <TabsTrigger value="protocols" className="data-[state=active]:bg-slate-700">Protocols</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-700">Analytics</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Active Situations */}
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Active Situations <span data-testid="crisis-active-counter">({activeCrises.length} Active)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activeCrises.map((crisis) => (
                    <div key={crisis.id} className="p-4 bg-slate-800/50 rounded-lg border border-slate-600/50" data-testid={crisis.template === 'Supply Chain Disruption' ? 'crisis-card-supply-chain' : `crisis-card-${crisis.id}`}>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-white">{crisis.template}</h4>
                        <Badge className={getSeverityColor(crisis.severity)}>
                          {getSeverityIcon(crisis.severity)}
                          {crisis.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Progress</span>
                          <span className="text-white">{crisis.progress}%</span>
                        </div>
                        <Progress value={crisis.progress} className="h-2" />
                        <div className="text-xs text-slate-500">Phase: {crisis.currentPhase}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Emergency Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-red-600 hover:bg-red-700 justify-start">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Activate Crisis Protocol
                  </Button>
                  <Button className="w-full bg-amber-600 hover:bg-amber-700 justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Assemble Response Team
                  </Button>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 justify-start">
                    <Phone className="w-4 h-4 mr-2" />
                    Emergency Communications
                  </Button>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 justify-start">
                    <Bell className="w-4 h-4 mr-2" />
                    Stakeholder Alerts
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {crisisTemplates.map((template) => (
                <Card key={template.id} className="bg-slate-900/50 border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-lg">{template.name}</CardTitle>
                      <Badge className={getSeverityColor(template.severity)}>
                        {getSeverityIcon(template.severity)}
                        {template.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-slate-400 text-sm">{template.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Category:</span>
                        <span className="text-white">{template.category}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Activation:</span>
                        <span className="text-white">{template.activationTime}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Stakeholders:</span>
                        <span className="text-white">{template.stakeholders.length}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                        <FileText className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                        <Play className="w-4 h-4 mr-2" />
                        Activate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Active Crises Tab */}
          <TabsContent value="active" className="space-y-6">
            {activeCrises.length > 0 ? (
              <div className="space-y-6">
                {activeCrises.map((crisis) => (
                  <Card key={crisis.id} className="bg-slate-900/50 border-slate-700/50">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white">{crisis.template}</CardTitle>
                        <div className="flex items-center gap-3">
                          <Badge className={getSeverityColor(crisis.severity)}>
                            {getSeverityIcon(crisis.severity)}
                            {crisis.severity.toUpperCase()}
                          </Badge>
                          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                            {crisis.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="font-semibold text-white mb-2">Timeline</h4>
                          <div className="text-sm space-y-1">
                            <div className="text-slate-400">Started: {crisis.startTime}</div>
                            <div className="text-slate-400">Phase: {crisis.currentPhase}</div>
                            <div className="text-slate-400">Progress: {crisis.progress}%</div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-white mb-2">Assigned Team</h4>
                          <div className="space-y-1">
                            {crisis.assignedTeam.map((team, index) => (
                              <Badge key={index} variant="outline" className="border-slate-600 text-slate-300">
                                {team}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-white mb-2">Next Actions</h4>
                          <div className="space-y-1">
                            {crisis.nextActions.map((action, index) => (
                              <div key={index} className="text-sm text-slate-300 flex items-center gap-2">
                                <div className="w-2 h-2 bg-amber-400 rounded-full" />
                                {action}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Update Status
                        </Button>
                        <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                          <FileText className="w-4 h-4 mr-2" />
                          View Full Report
                        </Button>
                        <Button variant="outline" className="border-red-600 text-red-300 hover:bg-red-900/20">
                          <Square className="w-4 h-4 mr-2" />
                          Escalate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardContent className="p-12 text-center">
                  <CheckCircle className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No Active Crises</h3>
                  <p className="text-slate-400">All systems operational. Crisis response protocols ready.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Protocols Tab */}
          <TabsContent value="protocols" className="space-y-6">
            <Alert className="border-amber-500/30 bg-amber-500/10">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-amber-200">
                Crisis response protocols are regularly updated based on industry best practices and regulatory requirements.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Communication Protocols</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-white">Emergency Notification Chain</span>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">ACTIVE</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-white">Media Response Guidelines</span>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">ACTIVE</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-white">Stakeholder Updates</span>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">ACTIVE</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Response Procedures</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-white">Incident Assessment</span>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">READY</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-white">Resource Mobilization</span>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">READY</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-white">Recovery Planning</span>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">READY</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Response Time</h3>
                    <Clock className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">12 min</div>
                  <div className="text-sm text-slate-400">Average activation</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Recovery Rate</h3>
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">96%</div>
                  <div className="text-sm text-slate-400">Successful resolution</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Team Readiness</h3>
                    <Users className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">100%</div>
                  <div className="text-sm text-slate-400">Teams certified</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Drills Completed</h3>
                    <BarChart3 className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">24</div>
                  <div className="text-sm text-slate-400">This quarter</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}