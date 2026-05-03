import { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'wouter';
import OnboardingTrigger from '@/components/onboarding/OnboardingTrigger';
import { 
  Brain, 
  Rocket, 
  Lightbulb,
  TrendingUp,
  Target,
  DollarSign,
  Users,
  Clock,
  Star,
  Zap,
  Layers,
  BarChart3,
  PlusCircle,
  Eye,
  ArrowLeft,
  Home
} from 'lucide-react';
import { BrandStamp } from "@/components/BrandStamp";

export default function NovaInnovations() {
  const [selectedPipeline, setSelectedPipeline] = useState('discovery');

  const innovationProjects = [
    {
      id: 'ai-automation',
      name: 'Automated Process Optimization',
      stage: 'development',
      priority: 'high',
      potential: 95,
      investment: 2.4,
      timeline: '6-9 months',
      description: 'Revolutionary AI system to automate complex business processes',
      impact: {
        efficiency: 85,
        cost: 78,
        revenue: 92,
        risk: 34
      },
      team: ['AI/ML Team', 'Process Engineering', 'QA'],
      milestones: [
        { name: 'Proof of Concept', status: 'completed', date: '2024-Q4' },
        { name: 'MVP Development', status: 'in-progress', date: '2025-Q1' },
        { name: 'Pilot Testing', status: 'planned', date: '2025-Q2' },
        { name: 'Full Deployment', status: 'planned', date: '2025-Q3' }
      ],
      icon: <Brain className="h-5 w-5" />,
      color: 'navy'
    },
    {
      id: 'quantum-security',
      name: 'Quantum-Resistant Security Protocol',
      stage: 'research',
      priority: 'critical',
      potential: 89,
      investment: 3.8,
      timeline: '12-18 months',
      description: 'Next-generation security framework resistant to quantum computing threats',
      impact: {
        efficiency: 67,
        cost: 45,
        revenue: 73,
        risk: 12
      },
      team: ['Security Research', 'Cryptography', 'Platform'],
      milestones: [
        { name: 'Research Phase', status: 'in-progress', date: '2025-Q1' },
        { name: 'Algorithm Development', status: 'planned', date: '2025-Q2' },
        { name: 'Security Testing', status: 'planned', date: '2025-Q3' },
        { name: 'Implementation', status: 'planned', date: '2025-Q4' }
      ],
      icon: <Zap className="h-5 w-5" />,
      color: 'gold'
    },
    {
      id: 'sustainable-tech',
      name: 'Carbon-Neutral Computing Infrastructure',
      stage: 'ideation',
      priority: 'medium',
      potential: 76,
      investment: 1.9,
      timeline: '9-12 months',
      description: 'Innovative green computing solutions with zero carbon footprint',
      impact: {
        efficiency: 71,
        cost: 82,
        revenue: 65,
        risk: 28
      },
      team: ['Sustainability', 'Infrastructure', 'R&D'],
      milestones: [
        { name: 'Feasibility Study', status: 'in-progress', date: '2025-Q1' },
        { name: 'Prototype Development', status: 'planned', date: '2025-Q2' },
        { name: 'Pilot Implementation', status: 'planned', date: '2025-Q3' },
        { name: 'Scale-up', status: 'planned', date: '2025-Q4' }
      ],
      icon: <Layers className="h-5 w-5" />,
      color: 'teal'
    },
    {
      id: 'market-intelligence',
      name: 'Predictive Market Intelligence Platform',
      stage: 'discovery',
      priority: 'high',
      potential: 93,
      investment: 2.1,
      timeline: '8-10 months',
      description: 'Signal-driven market analysis and prediction system for strategic advantage',
      impact: {
        efficiency: 88,
        cost: 61,
        revenue: 96,
        risk: 22
      },
      team: ['Data Science', 'Business Intelligence', 'Strategy'],
      milestones: [
        { name: 'Market Research', status: 'completed', date: '2024-Q4' },
        { name: 'Data Architecture', status: 'planned', date: '2025-Q1' },
        { name: 'AI Model Training', status: 'planned', date: '2025-Q2' },
        { name: 'Platform Launch', status: 'planned', date: '2025-Q3' }
      ],
      icon: <Target className="h-5 w-5" />,
      color: 'gold'
    }
  ];

  const NAVY = "#0A0F2E";
  const GOLD = "#C9A84C";
  const TEAL = "#2B8A6E";
  const TEAL_LT = "rgba(43,138,110,0.85)";
  const OFF = "#F8F7F4";
  const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

  const getColorClasses = (color: string) => {
    const colors = {
      navy: `text-[${NAVY}] bg-[${NAVY}]/12 border-[${NAVY}]/30`,
      gold: `text-[${GOLD}] bg-[${GOLD}]/12 border-[${GOLD}]/30`,
      teal: `text-[${TEAL}] bg-[${TEAL}]/12 border-[${TEAL}]/30`,
    };
    return colors[color as keyof typeof colors] || colors.navy;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/12 text-red-500 border-red-500/30';
      case 'high': return `bg-[${GOLD}]/12 text-[${GOLD}] border-[${GOLD}]/30`;
      case 'medium': return `bg-[${GOLD}]/12 text-[${GOLD}] border-[${GOLD}]/30`;
      case 'low': return `bg-[${TEAL}]/12 text-[${TEAL}] border-[${TEAL}]/30`;
      default: return 'bg-gray-500/12 text-gray-800 border-gray-500/30';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'development': return `bg-[${NAVY}]/12 text-[${NAVY}] border-[${NAVY}]/30`;
      case 'research': return `bg-[${GOLD}]/12 text-[${GOLD}] border-[${GOLD}]/30`;
      case 'ideation': return `bg-[${GOLD}]/12 text-[${GOLD}] border-[${GOLD}]/30`;
      case 'discovery': return `bg-[${TEAL}]/12 text-[${TEAL}] border-[${TEAL}]/30`;
      default: return 'bg-gray-500/12 text-gray-800 border-gray-500/30';
    }
  };

  const filteredProjects = innovationProjects.filter(project =>
    selectedPipeline === 'all' || project.stage === selectedPipeline
  );

  return (
    <PageLayout>
      <div className="page-background min-h-screen bg-white p-6" data-testid="nova-innovations">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* ROI Value Context */}
          <div style={{ border: "1px solid #E8E4DC", borderLeft: `3px solid ${TEAL}`, padding: "20px 24px", background: "#fff" }} data-testid="nova-roi-context">
            <div className="flex items-center gap-4">
              <div style={{ width:32, height:32, background:NAVY, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: NAVY }}>How Strategic Innovation Pipeline Saves You Money</div>
                <div style={{ fontSize: 14, color: "#6B7280" }}>Identifies breakthrough opportunities 6 months ahead of competitors, capturing $3.2M+ in first-mover advantage</div>
              </div>
            </div>
          </div>

          {/* Header */}
          <div style={{ background: NAVY, padding: "64px 48px", position: "relative", overflow: "hidden", borderRadius: 0 }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)", backgroundSize: "44px 44px" }} />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div style={{ width:64, height:64, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Brain className={`h-10 w-10 text-[${GOLD}]`} />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <div style={{ width: 28, height: 2, background: GOLD }} />
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Innovation Intelligence</span>
                  </div>
                  <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(32px,4vw,48px)", color: "#fff", lineHeight: 1.1 }}>
                    Strategic Innovation <em style={{ fontStyle: "italic", color: GOLD }}>Pipeline</em>
                  </h1>
                  <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 8 }}>Innovation pipeline management, breakthrough identification, and AI opportunity scoring</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Button style={{ background: GOLD, color: NAVY, fontWeight: 700, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", padding: "11px 28px", border: "none" }} data-testid="new-innovation-button">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Innovation
                </Button>
              </div>
            </div>
          </div>

          {/* Innovation Metrics */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", background:"#F8F7F4", border:"1px solid #E8E4DC", borderRadius: 0 }}>
            <div style={{ padding:24, borderRight:"1px solid #E8E4DC" }}>
              <div style={{ ...CG, fontSize:40, fontWeight:600, color:GOLD, lineHeight:1 }}>{innovationProjects.length}</div>
              <div style={{ fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"#6B7280", marginTop:4 }}>Active Projects</div>
            </div>
            <div style={{ padding:24, borderRight:"1px solid #E8E4DC" }}>
              <div style={{ ...CG, fontSize:40, fontWeight:600, color:GOLD, lineHeight:1 }}>$10.2M</div>
              <div style={{ fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"#6B7280", marginTop:4 }}>Total Investment</div>
            </div>
            <div style={{ padding:24, borderRight:"1px solid #E8E4DC" }}>
              <div style={{ ...CG, fontSize:40, fontWeight:600, color:GOLD, lineHeight:1 }}>88.3%</div>
              <div style={{ fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"#6B7280", marginTop:4 }}>Avg Potential</div>
            </div>
            <div style={{ padding:24 }}>
              <div style={{ ...CG, fontSize:40, fontWeight:600, color:GOLD, lineHeight:1 }}>340%</div>
              <div style={{ fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"#6B7280", marginTop:4 }}>Expected ROI</div>
            </div>
          </div>

          <Tabs value={selectedPipeline} onValueChange={setSelectedPipeline} className="w-full">
            <TabsList className="bg-[#F8F7F4] p-1 border border-[#E8E4DC]">
              <TabsTrigger value="discovery" className="data-[state=active]:bg-white data-[state=active]:text-[#0A0F2E]">Discovery</TabsTrigger>
              <TabsTrigger value="ideation" className="data-[state=active]:bg-white data-[state=active]:text-[#0A0F2E]">Ideation</TabsTrigger>
              <TabsTrigger value="research" className="data-[state=active]:bg-white data-[state=active]:text-[#0A0F2E]">Research</TabsTrigger>
              <TabsTrigger value="development" className="data-[state=active]:bg-white data-[state=active]:text-[#0A0F2E]">Development</TabsTrigger>
              <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-[#0A0F2E]">All</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedPipeline} className="space-y-6 mt-8">
              <div className="space-y-6">
                {filteredProjects.map((project) => (
                  <Card key={project.id} className="border border-[#E8E4DC] bg-white p-6 shadow-none rounded-none" data-testid={project.id === 'ai-automation' ? 'innovation-project-ai' : `project-${project.id}`}>
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-6">
                        <div style={{ width:48, height:48, background:NAVY, display:"flex", alignItems:"center", justifyContent:"center" }}>
                          <div className="text-white">
                            {project.icon}
                          </div>
                        </div>
                        <div>
                          <h3 style={{ ...CG, fontSize: 24, fontWeight: 600, color: NAVY }}>{project.name}</h3>
                          <p style={{ color: "#4B5563", fontSize: 14, marginTop: 4 }}>{project.description}</p>
                          <div className="flex items-center gap-4 mt-4">
                            <span style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Timeline: {project.timeline}</span>
                            <div style={{ width: 4, height: 4, background: "#E8E4DC", borderRadius: "full" }} />
                            <span style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Investment: ${project.investment}M</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span style={{ display:"inline-flex", alignItems:"center", gap:5, background: project.priority === 'critical' ? 'rgba(239,68,68,0.12)' : 'rgba(201,168,76,0.12)', color: project.priority === 'critical' ? '#ef4444' : GOLD, fontSize:9, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", padding:"3px 10px" }}>
                          {project.priority}
                        </span>
                        <span style={{ display:"inline-flex", alignItems:"center", gap:5, background: project.stage === 'development' ? 'rgba(43,138,110,0.12)' : 'rgba(0,0,0,0.05)', color: project.stage === 'development' ? TEAL : "#6B7280", fontSize:9, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", padding:"3px 10px" }}>
                          {project.stage}
                        </span>
                        <div className="text-right mt-2">
                          <div style={{ fontSize: 10, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>Potential</div>
                          <div style={{ fontSize: 20, fontWeight: 700, color: NAVY }}>{project.potential}%</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-6 mb-8">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>Efficiency</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: NAVY }}>{project.impact.efficiency}%</span>
                        </div>
                        <Progress value={project.impact.efficiency} className="h-1 bg-[#E8E4DC]" style={{ '--progress-background': NAVY } as any} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>Cost Impact</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: TEAL }}>{project.impact.cost}%</span>
                        </div>
                        <Progress value={project.impact.cost} className="h-1 bg-[#E8E4DC]" style={{ '--progress-background': TEAL } as any} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>Revenue</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: GOLD }}>{project.impact.revenue}%</span>
                        </div>
                        <Progress value={project.impact.revenue} className="h-1 bg-[#E8E4DC]" style={{ '--progress-background': GOLD } as any} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>Risk</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: project.impact.risk > 30 ? "#ef4444" : TEAL }}>{project.impact.risk}%</span>
                        </div>
                        <Progress value={project.impact.risk} className="h-1 bg-[#E8E4DC]" style={{ '--progress-background': project.impact.risk > 30 ? "#ef4444" : TEAL } as any} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8 border-t border-[#E8E4DC]">
                      <div>
                        <h4 style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: NAVY, marginBottom: 16 }}>Project Team</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.team.map((member, index) => (
                            <Badge key={index} variant="outline" className="border-[#E8E4DC] text-[#0A0F2E] bg-white rounded-none">
                              {member}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: NAVY, marginBottom: 16 }}>Key Milestones</h4>
                        <div className="space-y-3">
                          {project.milestones.slice(0, 2).map((milestone, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span style={{ color: "#4B5563" }}>{milestone.name}</span>
                              <div className="flex items-center gap-3">
                                <span style={{ color: "#6B7280", fontSize: 12 }}>{milestone.date}</span>
                                <span style={{ display:"inline-flex", alignItems:"center", background: milestone.status === 'completed' ? 'rgba(43,138,110,0.12)' : 'rgba(201,168,76,0.12)', color: milestone.status === 'completed' ? TEAL : GOLD, fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", padding:"2px 8px" }}>
                                  {milestone.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-8 mt-8 border-t border-[#E8E4DC]">
                      <Button variant="outline" className="flex-1 border-[#E8E4DC] text-[#0A0F2E] hover:bg-[#F8F7F4] rounded-none">
                        <Eye className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                      <Button variant="outline" className="flex-1 border-[#E8E4DC] text-[#0A0F2E] hover:bg-[#F8F7F4] rounded-none">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Analytics
                      </Button>
                      <Button className="flex-1 bg-[#0A0F2E] text-white hover:bg-[#141B45] rounded-none">
                        <Rocket className="h-4 w-4 mr-2" />
                        Accelerate
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {/* AI Recommendations */}
              <div style={{ background: OFF, padding: "64px 48px", border: "1px solid #E8E4DC", marginTop: 48, borderRadius: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 28, height: 2, background: GOLD }} />
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Pipeline Analysis</span>
                </div>
                <h2 style={{ ...CG, fontWeight: 600, fontSize: 32, color: NAVY, marginBottom: 24 }}>AI Innovation <em style={{ fontStyle: "italic", color: GOLD }}>Recommendations</em></h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div style={{ border: "1px solid #E8E4DC", borderLeft: `3px solid ${GOLD}`, padding: 24, background: "#fff" }}>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: GOLD, marginBottom: 8 }}>Priority Alignment</p>
                    <p style={{ fontSize: 14, color: "#4B5563" }}>Focus on Automated Process Optimization and Predictive Market Intelligence for maximum ROI in Q1-Q2.</p>
                  </div>
                  <div style={{ border: "1px solid #E8E4DC", borderLeft: `3px solid ${NAVY}`, padding: 24, background: "#fff" }}>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: NAVY, marginBottom: 8 }}>Resource Optimization</p>
                    <p style={{ fontSize: 14, color: "#4B5563" }}>Cross-project synergies identified: AI/ML expertise can accelerate both automation and market intelligence initiatives.</p>
                  </div>
                  <div style={{ border: "1px solid #E8E4DC", borderLeft: `3px solid ${TEAL}`, padding: 24, background: "#fff" }}>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: TEAL, marginBottom: 8 }}>Breakthrough Opportunity</p>
                    <p style={{ fontSize: 14, color: "#4B5563" }}>Quantum-Resistant Security shows potential for industry disruption - consider fast-track development with additional resources.</p>
                  </div>
                </div>
              </div>

              {/* AI Opportunity Confidence Scores */}
              <div style={{ background: NAVY, padding: "64px 48px", marginTop: 48, borderRadius: 0, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 2px 2px, rgba(201,168,76,0.08) 1px, transparent 0)", backgroundSize: "28px 28px" }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 28, height: 2, background: GOLD }} />
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Signal Confidence Scoring</span>
                  </div>
                  <h2 style={{ ...CG, fontWeight: 600, fontSize: 32, color: "#fff", marginBottom: 8 }}>Innovation Opportunity <em style={{ fontStyle: "italic", color: GOLD }}>Forecast</em></h2>
                  <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", marginBottom: 40, maxWidth: 560 }}>Predictive models trained on 847 enterprise innovation cycles assess each project's probability of achieving target ROI within the stated timeline.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { project: "Automated Process Optimization", confidence: 92, horizon: "6-9 months", roi: "$8.2M", risk: "Low" },
                      { project: "Predictive Market Intelligence", confidence: 87, horizon: "9-12 months", roi: "$6.7M", risk: "Low" },
                      { project: "Blockchain Supply Chain", confidence: 71, horizon: "12-18 months", roi: "$4.1M", risk: "Medium" },
                      { project: "Quantum-Resistant Security", confidence: 63, horizon: "24+ months", roi: "$12.4M", risk: "High" },
                    ].map((p) => (
                      <div key={p.project} style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", padding: 20 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{p.project}</span>
                          <span style={{ fontSize: 28, fontWeight: 700, color: GOLD, fontFamily: "'Cormorant Garamond', serif" }}>{p.confidence}%</span>
                        </div>
                        <div style={{ display: "flex", gap: 24 }}>
                          <div>
                            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.68)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 2 }}>Timeline</div>
                            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>{p.horizon}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.68)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 2 }}>Target ROI</div>
                            <div style={{ fontSize: 13, color: TEAL_LT }}>{p.roi}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.68)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 2 }}>Risk</div>
                            <div style={{ fontSize: 13, color: p.risk === 'Low' ? TEAL_LT : p.risk === 'Medium' ? GOLD : "#f87171" }}>{p.risk}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
}