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
      case 'medium': return { background: "rgba(43,138,110,0.12)", color: "#2B8A6E" };
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

  return (
    <PageLayout>
      <div className="flex-1 bg-[#F8F7F4] overflow-y-auto" data-testid="crisis-response-center">
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
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.4em", textTransform: "uppercase" as const, color: GOLD }}>Emergency Operations Center</span>
            </div>
            <div className="flex items-end justify-between gap-12">
              <div className="max-w-3xl">
                <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(48px,6vw,72px)", lineHeight: 1, color: "#fff", marginBottom: 24 }}>
                  Crisis Response <em style={{ fontStyle: "italic", color: "#DFC178" }}>Command Center</em>
                </h1>
                <p className="text-white/60 text-xl leading-relaxed max-w-2xl">Enterprise-grade crisis management with 15+ response protocols and real-time coordination systems.</p>
              </div>
              <div className="flex flex-col items-end gap-4 min-w-[280px]">
                <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(43,138,110,0.2)", color:TEAL, fontSize:10, fontWeight:800, letterSpacing:"0.2em", textTransform:"uppercase" as const, padding:"6px 16px", border: `1px solid ${TEAL}` }}>
                  <Shield className="w-4 h-4" />
                  All Systems Ready
                </div>
                <Button className="w-full bg-[#0A0F2E] hover:bg-[#141B45] text-white font-bold h-14 rounded-none text-sm tracking-widest" size="lg">
                  <AlertTriangle className="w-5 h-5 mr-3" />
                  EMERGENCY ACTIVATION
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", background: "white", borderBottom:"1px solid #E8E4DC" }}>
          <div style={{ padding:32, borderRight:"1px solid #E8E4DC" }}>
            <div style={{ ...CG, fontSize: 48, fontWeight: 600, color: GOLD, lineHeight: 1 }}>{systemStatus.readinessLevel}%</div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "#6B7280", marginTop: 8 }}>Readiness Level</div>
          </div>
          <div style={{ padding:32, borderRight:"1px solid #E8E4DC" }}>
            <div style={{ ...CG, fontSize: 48, fontWeight: 600, color: GOLD, lineHeight: 1 }}>{systemStatus.responseTeamsActive}</div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "#6B7280", marginTop: 8 }}>Teams Active</div>
          </div>
          <div style={{ padding:32, borderRight:"1px solid #E8E4DC" }}>
            <div style={{ ...CG, fontSize: 48, fontWeight: 600, color: GOLD, lineHeight: 1 }}>{systemStatus.protocolsReady}</div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "#6B7280", marginTop: 8 }}>Protocols Ready</div>
          </div>
          <div style={{ padding:32 }}>
            <div style={{ ...CG, fontSize: 48, fontWeight: 600, color: GOLD, lineHeight: 1 }}>8d</div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "#6B7280", marginTop: 8 }}>Since Last Drill</div>
          </div>
        </div>

        <div className="p-12 max-w-7xl mx-auto space-y-12">
          {/* Demo Crisis Simulation - Only visible during demo mode */}
          <DemoStrategicAlert />
          <DemoActiveStrategicCard />

          {/* Crisis Management Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-12">
            <TabsList className="bg-transparent border-b border-[#E8E4DC] rounded-none h-auto p-0 gap-12">
              {['dashboard', 'templates', 'active', 'protocols', 'analytics'].map((tab) => (
                <TabsTrigger 
                  key={tab}
                  value={tab} 
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#C9A84C] data-[state=active]:text-[#0A0F2E] rounded-none px-0 py-5 text-[10px] font-bold tracking-[0.25em] uppercase text-[#6B7280]"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="dashboard" className="space-y-12 mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Active Situations */}
                <Card className="border border-[#E8E4DC] bg-white p-8 shadow-sm rounded-none">
                  <CardHeader className="px-0 pt-0 mb-8">
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                      <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: GOLD }}>Live Monitoring</span>
                    </div>
                    <CardTitle style={CG} className="text-3xl font-bold flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        Active Situations
                      </div>
                      <span className="text-[#6B7280] font-normal text-xl" data-testid="crisis-active-counter">({activeCrises.length})</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-0 pb-0 space-y-6">
                    {activeCrises.map((crisis) => (
                      <div key={crisis.id} className="p-8 bg-[#F8F7F4] border border-[#E8E4DC]" data-testid={crisis.template === 'Supply Chain Disruption' ? 'crisis-card-supply-chain' : `crisis-card-${crisis.id}`}>
                        <div className="flex items-center justify-between mb-6">
                          <h4 style={CG} className="text-2xl font-bold text-[#0A0F2E]">{crisis.template}</h4>
                          <span style={getSeverityBadgeStyle(crisis.severity)} className="text-[10px] font-extrabold tracking-widest uppercase px-3 py-1">
                            {crisis.severity}
                          </span>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between text-[11px] font-bold tracking-widest uppercase text-[#6B7280]">
                            <span>Progress</span>
                            <span className="text-[#0A0F2E] font-black">{crisis.progress}%</span>
                          </div>
                          <Progress value={crisis.progress} className="h-1 bg-[#E8E4DC] overflow-hidden [&>div]:bg-[#C9A84C]">
                             <div className="h-full bg-[#C9A84C]" style={{ width: `${crisis.progress}%` }} />
                          </Progress>
                          <div className="flex items-center gap-3 text-xs text-[#6B7280] font-medium pt-2">
                            <div className="w-2 h-2 bg-[#C9A84C]" />
                            Current Phase: <span className="text-[#0A0F2E] font-bold uppercase tracking-wider">{crisis.currentPhase}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="border border-[#E8E4DC] bg-white p-8 shadow-sm rounded-none">
                  <CardHeader className="px-0 pt-0 mb-8">
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                      <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: GOLD }}>Rapid Execution</span>
                    </div>
                    <CardTitle style={CG} className="text-3xl font-bold">
                      Emergency Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-0 pb-0 space-y-4">
                    <Button className="w-full bg-[#0A0F2E] text-white hover:bg-[#141B45] font-bold h-16 rounded-none justify-between px-8 text-xs tracking-[0.2em]">
                      ACTIVATE CRISIS PROTOCOL
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    </Button>
                    <Button variant="outline" className="w-full border-[#E8E4DC] text-[#0A0F2E] hover:bg-[#F8F7F4] font-bold h-16 rounded-none justify-between px-8 text-xs tracking-[0.2em]">
                      ASSEMBLE RESPONSE TEAM
                      <Users className="w-5 h-5" />
                    </Button>
                    <Button variant="outline" className="w-full border-[#E8E4DC] text-[#0A0F2E] hover:bg-[#F8F7F4] font-bold h-16 rounded-none justify-between px-8 text-xs tracking-[0.2em]">
                      EMERGENCY COMMUNICATIONS
                      <Phone className="w-5 h-5" />
                    </Button>
                    <Button variant="outline" className="w-full border-[#E8E4DC] text-[#0A0F2E] hover:bg-[#F8F7F4] font-bold h-16 rounded-none justify-between px-8 text-xs tracking-[0.2em]">
                      STAKEHOLDER ALERTS
                      <Bell className="w-5 h-5" />
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
                      <span style={getSeverityBadgeStyle(template.severity)} className="text-[9px] font-bold tracking-widest uppercase px-2.5 py-0.5">
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
                          <span className="bg-[#0A0F2E]/10 text-[#0A0F2E] text-[9px] font-bold tracking-widest uppercase px-2.5 py-1">
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
