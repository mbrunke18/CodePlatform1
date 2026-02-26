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

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

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

  const getSeverityBadgeStyle = (severity: string) => {
    switch (severity) {
      case 'critical': return { background: "rgba(239,68,68,0.12)", color: "#EF4444" };
      case 'high': return { background: "rgba(201,168,76,0.12)", color: "#C9A84C" };
      case 'medium': return { background: "rgba(43,138,110,0.12)", color: "#3BAF8A" };
      case 'low': return { background: "rgba(0,0,0,0.05)", color: "#6B7280" };
      default: return { background: "rgba(0,0,0,0.05)", color: "#6B7280" };
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

  const NAVY = "#0A0F2E";
  const GOLD = "#C9A84C";
  const TEAL = "#2B8A6E";
  const OFF = "#F8F7F4";

  return (
    <PageLayout>
      <div className="flex-1 bg-white overflow-y-auto" data-testid="crisis-response-center">
        {/* Navy Hero Section */}
        <div style={{ background: NAVY, padding: "64px 48px", position: "relative", overflow: "hidden", minHeight: 320 }}>
          <div style={{ 
            position: "absolute", 
            inset: 0, 
            backgroundImage: "linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)", 
            backgroundSize: "44px 44px" 
          }} />
          <div className="max-w-7xl mx-auto relative z-10">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 28, height: 2, background: "rgba(255,255,255,0.35)", flexShrink: 0 }} />
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.45)" }}>Emergency Operations Center</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(40px,5vw,56px)", lineHeight: 1.05, color: "#fff", marginBottom: 16 }}>
                  Crisis Response <em style={{ fontStyle: "italic", color: "#DFC178" }}>Command Center</em>
                </h1>
                <p className="text-white/60 text-lg max-w-2xl">Enterprise-grade crisis management with 15+ response protocols and real-time coordination systems.</p>
              </div>
              <div className="flex flex-col gap-3">
                <div style={{ display:"inline-flex", alignItems:"center", gap:5, background:"rgba(43,138,110,0.12)", color:"#3BAF8A", fontSize:9, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase" as const, padding:"3px 10px" }}>
                  <Shield className="w-3 h-3" />
                  All Systems Ready
                </div>
                <Button className="bg-red-600 hover:bg-red-700 text-white font-bold" size="lg">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  EMERGENCY ACTIVATION
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", background: OFF, borderBottom:"1px solid #E8E4DC" }}>
          <div style={{ padding:24, borderRight:"1px solid #E8E4DC" }}>
            <div style={{ ...CG, fontSize: 40, fontWeight: 600, color: GOLD, lineHeight: 1 }}>{systemStatus.readinessLevel}%</div>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B7280", marginTop: 4 }}>Readiness Level</div>
          </div>
          <div style={{ padding:24, borderRight:"1px solid #E8E4DC" }}>
            <div style={{ ...CG, fontSize: 40, fontWeight: 600, color: GOLD, lineHeight: 1 }}>{systemStatus.responseTeamsActive}</div>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B7280", marginTop: 4 }}>Teams Active</div>
          </div>
          <div style={{ padding:24, borderRight:"1px solid #E8E4DC" }}>
            <div style={{ ...CG, fontSize: 40, fontWeight: 600, color: GOLD, lineHeight: 1 }}>{systemStatus.protocolsReady}</div>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B7280", marginTop: 4 }}>Protocols Ready</div>
          </div>
          <div style={{ padding:24 }}>
            <div style={{ ...CG, fontSize: 40, fontWeight: 600, color: GOLD, lineHeight: 1 }}>8d</div>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B7280", marginTop: 4 }}>Since Last Drill</div>
          </div>
        </div>

        <div className="p-12 max-w-7xl mx-auto space-y-12">
          {/* Demo Crisis Simulation - Only visible during demo mode */}
          <DemoStrategicAlert />
          <DemoActiveStrategicCard />

          {/* Crisis Management Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="bg-transparent border-b border-[#E8E4DC] rounded-none h-auto p-0 gap-8">
              {['dashboard', 'templates', 'active', 'protocols', 'analytics'].map((tab) => (
                <TabsTrigger 
                  key={tab}
                  value={tab} 
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#C9A84C] data-[state=active]:text-[#0A0F2E] rounded-none px-0 py-4 text-xs font-bold tracking-widest uppercase text-[#6B7280]"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="dashboard" className="space-y-8 mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Active Situations */}
                <Card className="border border-[#E8E4DC] bg-white p-6 shadow-none rounded-none">
                  <CardHeader className="px-0 pt-0">
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                      <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
                      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: GOLD }}>Live Monitoring</span>
                    </div>
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                      <Activity className="h-5 w-5 text-[#2B8A6E]" />
                      Active Situations <span className="text-[#6B7280] font-normal" data-testid="crisis-active-counter">({activeCrises.length})</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-0 pb-0 space-y-4">
                    {activeCrises.map((crisis) => (
                      <div key={crisis.id} className="p-6 bg-[#F8F7F4] border border-[#E8E4DC]" data-testid={crisis.template === 'Supply Chain Disruption' ? 'crisis-card-supply-chain' : `crisis-card-${crisis.id}`}>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-[#0A0F2E]">{crisis.template}</h4>
                          <span style={{ ...getSeverityBadgeStyle(crisis.severity), fontSize:9, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase" as const, padding:"3px 10px" }}>
                            {getSeverityIcon(crisis.severity)}
                            <span className="ml-1">{crisis.severity}</span>
                          </span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase text-[#6B7280]">
                            <span>Progress</span>
                            <span className="text-[#0A0F2E]">{crisis.progress}%</span>
                          </div>
                          <Progress value={crisis.progress} className="h-1 bg-[#E8E4DC]" />
                          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                            <div className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full" />
                            Current Phase: <span className="text-[#0A0F2E] font-medium">{crisis.currentPhase}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="border border-[#E8E4DC] bg-white p-6 shadow-none rounded-none">
                  <CardHeader className="px-0 pt-0">
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                      <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
                      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: GOLD }}>Rapid Execution</span>
                    </div>
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                      <Zap className="h-5 w-5 text-[#C9A84C]" />
                      Emergency Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-0 pb-0 space-y-3">
                    <Button className="w-full bg-[#0A0F2E] text-white hover:bg-[#141B45] font-bold py-6 rounded-none justify-start">
                      <AlertTriangle className="w-4 h-4 mr-3 text-red-500" />
                      ACTIVATE CRISIS PROTOCOL
                    </Button>
                    <Button variant="outline" className="w-full border-[#E8E4DC] text-[#0A0F2E] hover:bg-[#F8F7F4] font-bold py-6 rounded-none justify-start">
                      <Users className="w-4 h-4 mr-3" />
                      ASSEMBLE RESPONSE TEAM
                    </Button>
                    <Button variant="outline" className="w-full border-[#E8E4DC] text-[#0A0F2E] hover:bg-[#F8F7F4] font-bold py-6 rounded-none justify-start">
                      <Phone className="w-4 h-4 mr-3" />
                      EMERGENCY COMMUNICATIONS
                    </Button>
                    <Button variant="outline" className="w-full border-[#E8E4DC] text-[#0A0F2E] hover:bg-[#F8F7F4] font-bold py-6 rounded-none justify-start">
                      <Bell className="w-4 h-4 mr-3" />
                      STAKEHOLDER ALERTS
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="templates" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {crisisTemplates.map((template) => (
                  <Card key={template.id} className="border border-[#E8E4DC] bg-white p-6 hover:border-[#0A0F2E] transition-colors rounded-none flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <span style={{ background: OFF, border: "1px solid #E8E4DC", padding: "4px 8px", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6B7280" }}>
                        {template.category}
                      </span>
                      <span style={{ ...getSeverityBadgeStyle(template.severity), fontSize:9, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase" as const, padding:"3px 10px" }}>
                        {template.severity}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[#0A0F2E] mb-2">{template.name}</h3>
                    <p className="text-sm text-[#6B7280] flex-grow mb-6 leading-relaxed">{template.description}</p>
                    
                    <div className="space-y-3 mb-8">
                      <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase border-b border-[#E8E4DC] pb-2">
                        <span className="text-[#6B7280]">Activation</span>
                        <span className="text-[#0A0F2E]">{template.activationTime}</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase border-b border-[#E8E4DC] pb-2">
                        <span className="text-[#6B7280]">Stakeholders</span>
                        <span className="text-[#0A0F2E]">{template.stakeholders.length}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1 border-[#E8E4DC] text-[#0A0F2E] font-bold py-5 text-[10px] tracking-widest uppercase rounded-none">
                        DETAILS
                      </Button>
                      <Button className="flex-1 bg-[#0A0F2E] text-white hover:bg-[#141B45] font-bold py-5 text-[10px] tracking-widest uppercase rounded-none">
                        ACTIVATE
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="active" className="mt-0 space-y-6">
              {activeCrises.map((crisis) => (
                <Card key={crisis.id} className="border border-[#E8E4DC] bg-white rounded-none shadow-none overflow-hidden">
                  <div style={{ borderLeft: "4px solid #EF4444", padding: "24px" }}>
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-[#0A0F2E]">{crisis.template}</h3>
                          <span style={{ background: "rgba(239,68,68,0.12)", color: "#EF4444", fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, padding: "3px 10px" }}>
                            ACTIVE INCIDENT
                          </span>
                        </div>
                        <div className="text-sm text-[#6B7280]">Internal ID: {crisis.id} · Started: {crisis.startTime}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button className="bg-[#2B8A6E] text-white hover:bg-[#3BAF8A] font-bold rounded-none">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          UPDATE STATUS
                        </Button>
                        <Button variant="outline" className="border-[#E8E4DC] text-[#0A0F2E] font-bold rounded-none">
                          <FileText className="w-4 h-4 mr-2" />
                          FULL REPORT
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                      <div>
                        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B7280", marginBottom: 12 }}>Execution Progress</div>
                        <div className="text-3xl font-bold text-[#0A0F2E] mb-2">{crisis.progress}%</div>
                        <Progress value={crisis.progress} className="h-1 bg-[#E8E4DC]" />
                        <div className="mt-3 text-sm text-[#6B7280]">Currently in: <span className="text-[#0A0F2E] font-bold">{crisis.currentPhase}</span></div>
                      </div>
                      
                      <div>
                        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B7280", marginBottom: 12 }}>Assigned Command</div>
                        <div className="flex flex-wrap gap-2">
                          {crisis.assignedTeam.map((team, index) => (
                            <span key={index} style={{ border: "1px solid #E8E4DC", padding: "4px 10px", fontSize: 10, fontWeight: 600, color: "#0A0F2E", background: OFF }}>
                              {team}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B7280", marginBottom: 12 }}>Next Protocols</div>
                        <div className="space-y-3">
                          {crisis.nextActions.map((action, index) => (
                            <div key={index} className="flex items-start gap-3 text-sm text-[#0A0F2E]">
                              <div className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full mt-1.5 flex-shrink-0" />
                              {action}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
}

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-800 border-gray-500/30';
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
          <div className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-gray-800 dark:text-gray-200 hover:text-white p-1 h-auto">
                <Home className="h-4 w-4" />
              </Button>
            </Link>
            <span>/</span>
            <span>Crisis Management</span>
            <span>/</span>
            <span className="text-gray-900">Crisis Response Center</span>
          </div>
        </div>

        {/* Crisis Response Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Crisis Response Command Center</h1>
            <p className="text-gray-800">Enterprise-grade crisis management with 15+ response protocols</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="secondary" className="bg-gray-50 hover:bg-slate-600 text-gray-700 border-slate-600">
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
          <Card className="bg-white border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Readiness Level</h3>
                <Shield className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">{systemStatus.readinessLevel}%</div>
              <Progress value={systemStatus.readinessLevel} className="h-2" />
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Response Teams</h3>
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">{systemStatus.responseTeamsActive}</div>
              <div className="text-sm text-gray-800 dark:text-slate-200">Teams Active</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Protocols Ready</h3>
                <FileText className="h-5 w-5 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">{systemStatus.protocolsReady}</div>
              <div className="text-sm text-gray-800 dark:text-slate-200">Response Templates</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Last Drill</h3>
                <Clock className="h-5 w-5 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">8</div>
              <div className="text-sm text-gray-800 dark:text-slate-200">days ago</div>
            </CardContent>
          </Card>
        </div>

        {/* Crisis Management Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gray-50 border border-gray-200">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-gray-50">Dashboard</TabsTrigger>
            <TabsTrigger value="templates" className="data-[state=active]:bg-gray-50">Response Templates</TabsTrigger>
            <TabsTrigger value="active" className="data-[state=active]:bg-gray-50">Active Crises</TabsTrigger>
            <TabsTrigger value="protocols" className="data-[state=active]:bg-gray-50">Protocols</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gray-50">Analytics</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Active Situations */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Active Situations <span data-testid="crisis-active-counter">({activeCrises.length} Active)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activeCrises.map((crisis) => (
                    <div key={crisis.id} className="p-4 bg-gray-50 rounded-lg border border-slate-600/50" data-testid={crisis.template === 'Supply Chain Disruption' ? 'crisis-card-supply-chain' : `crisis-card-${crisis.id}`}>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">{crisis.template}</h4>
                        <Badge className={getSeverityColor(crisis.severity)}>
                          {getSeverityIcon(crisis.severity)}
                          {crisis.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-800 dark:text-slate-200">Progress</span>
                          <span className="text-gray-900">{crisis.progress}%</span>
                        </div>
                        <Progress value={crisis.progress} className="h-2" />
                        <div className="text-xs text-gray-800">Phase: {crisis.currentPhase}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center gap-2">
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
                <Card key={template.id} className="bg-white border-gray-200 hover:bg-slate-800/50 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-gray-900 text-lg">{template.name}</CardTitle>
                      <Badge className={getSeverityColor(template.severity)}>
                        {getSeverityIcon(template.severity)}
                        {template.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-gray-800 dark:text-slate-200 text-sm">{template.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-800 dark:text-slate-200">Category:</span>
                        <span className="text-gray-900">{template.category}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-800 dark:text-slate-200">Activation:</span>
                        <span className="text-gray-900">{template.activationTime}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-800 dark:text-slate-200">Stakeholders:</span>
                        <span className="text-gray-900">{template.stakeholders.length}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                        <FileText className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" className="bg-transparent border-slate-600 text-gray-800 hover:bg-slate-700">
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
                  <Card key={crisis.id} className="bg-white border-gray-200">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-gray-900">{crisis.template}</CardTitle>
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
                          <h4 className="font-semibold text-gray-900 mb-2">Timeline</h4>
                          <div className="text-sm space-y-1">
                            <div className="text-gray-800 dark:text-slate-200">Started: {crisis.startTime}</div>
                            <div className="text-gray-800 dark:text-slate-200">Phase: {crisis.currentPhase}</div>
                            <div className="text-gray-800 dark:text-slate-200">Progress: {crisis.progress}%</div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Assigned Team</h4>
                          <div className="space-y-1">
                            {crisis.assignedTeam.map((team, index) => (
                              <Badge key={index} variant="outline" className="bg-transparent border-slate-600 text-gray-800">
                                {team}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Next Actions</h4>
                          <div className="space-y-1">
                            {crisis.nextActions.map((action, index) => (
                              <div key={index} className="text-sm text-gray-800 flex items-center gap-2">
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
                        <Button variant="outline" className="bg-transparent border-slate-600 text-gray-800 hover:bg-slate-700">
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
              <Card className="bg-white border-gray-200">
                <CardContent className="p-12 text-center">
                  <CheckCircle className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Crises</h3>
                  <p className="text-gray-800 dark:text-slate-200">All systems operational. Crisis response protocols ready.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Protocols Tab */}
          <TabsContent value="protocols" className="space-y-6">
            <Alert className="border-amber-500/30 bg-amber-500/10">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-[#C9A84C]">
                Crisis response protocols are regularly updated based on industry best practices and regulatory requirements.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Communication Protocols</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-900">Emergency Notification Chain</span>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">ACTIVE</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-900">Media Response Guidelines</span>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">ACTIVE</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-900">Stakeholder Updates</span>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">ACTIVE</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Response Procedures</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-900">Incident Assessment</span>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">READY</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-900">Resource Mobilization</span>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">READY</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-900">Recovery Planning</span>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">READY</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Response Time</h3>
                    <Clock className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">12 min</div>
                  <div className="text-sm text-gray-800 dark:text-slate-200">Average activation</div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Recovery Rate</h3>
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">96%</div>
                  <div className="text-sm text-gray-800 dark:text-slate-200">Successful resolution</div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Team Readiness</h3>
                    <Users className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">100%</div>
                  <div className="text-sm text-gray-800 dark:text-slate-200">Teams certified</div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Drills Completed</h3>
                    <BarChart3 className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">24</div>
                  <div className="text-sm text-gray-800 dark:text-slate-200">This quarter</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}