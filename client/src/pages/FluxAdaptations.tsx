import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link, useLocation } from 'wouter';
import OnboardingTrigger from '@/components/onboarding/OnboardingTrigger';
import { 
  TrendingUp, 
  Zap, 
  Target,
  ArrowRight,
  Clock,
  Users,
  DollarSign,
  BarChart3,
  Brain,
  Lightbulb,
  Settings,
  Play,
  ArrowLeft,
  Home
} from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';

export default function FluxAdaptations() {
  const [, setLocation] = useLocation();
  const [selectedStrategy, setSelectedStrategy] = useState('active');

  const adaptationStrategies = [
    {
      id: 'digital-transformation',
      name: 'Digital Transformation Acceleration',
      category: 'technology',
      priority: 'high',
      impact: 95,
      effort: 78,
      timeline: '6-12 months',
      status: 'active',
      description: 'Comprehensive digital infrastructure overhaul to enhance agility and responsiveness',
      outcomes: ['40% faster decision-making', 'Real-time data analytics', 'Automated processes'],
      icon: <Zap className="h-5 w-5" />
    },
    {
      id: 'market-expansion',
      name: 'Adaptive Market Expansion',
      category: 'business',
      priority: 'medium',
      impact: 88,
      effort: 65,
      timeline: '9-15 months',
      status: 'planning',
      description: 'Dynamic market entry strategies with rapid pivot capabilities',
      outcomes: ['New revenue streams', 'Market diversification', 'Risk mitigation'],
      icon: <Target className="h-5 w-5" />
    },
    {
      id: 'workforce-evolution',
      name: 'Workforce Evolution Strategy',
      category: 'human-capital',
      priority: 'high',
      impact: 92,
      effort: 55,
      timeline: '3-6 months',
      status: 'active',
      description: 'Adaptive talent management and skill development programs',
      outcomes: ['Increased adaptability', 'Skills diversification', 'Higher retention'],
      icon: <Users className="h-5 w-5" />
    },
    {
      id: 'financial-flexibility',
      name: 'Financial Flexibility Framework',
      category: 'finance',
      priority: 'critical',
      impact: 97,
      effort: 45,
      timeline: '2-4 months',
      status: 'active',
      description: 'Dynamic resource allocation and financial risk management',
      outcomes: ['Improved cash flow', 'Crisis resilience', 'Investment agility'],
      icon: <DollarSign className="h-5 w-5" />
    }
  ];

  const NAVY = "#0A0F2E";
  const GOLD = "#C9A84C";
  const TEAL = "#2B8A6E";
  const OFF = "#F8F7F4";
  const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'high': return `bg-[${GOLD}]/12 text-[${GOLD}] border-[${GOLD}]/30`;
      case 'medium': return `bg-[${GOLD}]/12 text-[${GOLD}] border-[${GOLD}]/30`;
      case 'low': return `bg-[${TEAL}]/12 text-[${TEAL}] border-[${TEAL}]/30`;
      default: return 'bg-gray-500/20 text-gray-800 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return `bg-[${TEAL}]/12 text-[${TEAL}] border-[${TEAL}]/30`;
      case 'planning': return `bg-[${GOLD}]/12 text-[${GOLD}] border-[${GOLD}]/30`;
      case 'paused': return 'bg-gray-500/20 text-gray-800 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-800 border-gray-500/30';
    }
  };

  const filteredStrategies = adaptationStrategies.filter(strategy => 
    selectedStrategy === 'all' || strategy.status === selectedStrategy
  );

  return (
    <PageLayout>
      <div className="h-full bg-white" data-testid="flux-adaptations">
        <div className="w-full max-w-7xl mx-auto py-12 px-6 space-y-8">
          
          {/* ROI Value Context */}
          <div style={{ border: "1px solid #E8E4DC", borderLeft: `3px solid ${TEAL}`, padding: "20px 24px", background: "#fff" }} data-testid="flux-roi-context">
            <div className="flex items-center gap-4">
              <div style={{ width:32, height:32, background:NAVY, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: NAVY }}>How Flux Saves You Money</div>
                <div style={{ fontSize: 14, color: "#6B7280" }}>Catches competitive threats 3 weeks earlier than manual tracking, preventing $850K+ in market share losses</div>
              </div>
            </div>
          </div>

          {/* Header */}
          <div style={{ background: NAVY, padding: "64px 48px", position: "relative", overflow: "hidden", borderRadius: 0 }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)", backgroundSize: "44px 44px" }} />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div style={{ width:64, height:64, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <TrendingUp className="h-10 w-10 text-[${GOLD}]" />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <div style={{ width: 28, height: 2, background: "rgba(255,255,255,0.35)" }} />
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>Dynamic Adaptation</span>
                  </div>
                  <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(32px,4vw,48px)", color: "#fff", lineHeight: 1.1 }}>
                    Flux <em style={{ fontStyle: "italic", color: "#DFC178" }}>Adaptations</em>
                  </h1>
                  <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 8 }}>Dynamic adaptation strategies and change management intelligence</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Button style={{ background: GOLD, color: NAVY, fontWeight: 700, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", padding: "11px 28px", border: "none" }} data-testid="generate-strategy-button" onClick={() => setSelectedStrategy('analytics')}>
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Generate Strategy
                </Button>
              </div>
            </div>
          </div>

          <Tabs value={selectedStrategy} onValueChange={setSelectedStrategy} className="w-full">
            <TabsList className="bg-[#F8F7F4] p-1 border border-[#E8E4DC]">
              <TabsTrigger value="active" className="data-[state=active]:bg-white data-[state=active]:text-[#0A0F2E]">Active</TabsTrigger>
              <TabsTrigger value="planning" className="data-[state=active]:bg-white data-[state=active]:text-[#0A0F2E]">Planning</TabsTrigger>
              <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-[#0A0F2E]">All</TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:text-[#0A0F2E]">Analytics</TabsTrigger>
            </TabsList>

            <div className="mt-8">
              {selectedStrategy !== 'analytics' ? (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredStrategies.map((strategy) => (
                      <Card key={strategy.id} className="border border-[#E8E4DC] bg-white p-6 hover:border-[#0A0F2E] transition-colors shadow-none" data-testid={`strategy-${strategy.id}`}>
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <div style={{ width:40, height:40, background:NAVY, display:"flex", alignItems:"center", justifyContent:"center" }}>
                              <div className="text-white">
                                {strategy.icon}
                              </div>
                            </div>
                            <div>
                              <h3 style={{ ...CG, fontSize: 20, fontWeight: 600, color: NAVY }}>{strategy.name}</h3>
                              <p style={{ fontSize: 12, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{strategy.category} • {strategy.timeline}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span style={{ display:"inline-flex", alignItems:"center", gap:5, background: strategy.priority === 'critical' ? 'rgba(239,68,68,0.12)' : 'rgba(201,168,76,0.12)', color: strategy.priority === 'critical' ? '#ef4444' : GOLD, fontSize:10, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", padding:"3px 10px" }}>
                              {strategy.priority}
                            </span>
                            <span style={{ display:"inline-flex", alignItems:"center", gap:5, background: strategy.status === 'active' ? 'rgba(43,138,110,0.12)' : 'rgba(0,0,0,0.05)', color: strategy.status === 'active' ? TEAL : "#6B7280", fontSize:10, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", padding:"3px 10px" }}>
                              {strategy.status}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <p style={{ fontSize: 14, color: "#4B5563", lineHeight: 1.6 }}>{strategy.description}</p>
                          
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Impact</span>
                                <span style={{ fontSize: 11, fontWeight: 700, color: TEAL }}>{strategy.impact}%</span>
                              </div>
                              <Progress value={strategy.impact} className="h-1 bg-[#E8E4DC]" style={{ '--progress-background': TEAL } as any} />
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Effort</span>
                                <span style={{ fontSize: 11, fontWeight: 700, color: GOLD }}>{strategy.effort}%</span>
                              </div>
                              <Progress value={strategy.effort} className="h-1 bg-[#E8E4DC]" style={{ '--progress-background': GOLD } as any} />
                            </div>
                          </div>

                          <div style={{ background: OFF, padding: 20, border: "1px solid #E8E4DC" }}>
                            <h4 style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: NAVY, marginBottom: 12 }}>Expected Outcomes</h4>
                            <ul className="space-y-2">
                              {strategy.outcomes.map((outcome, index) => (
                                <li key={index} className="flex items-start gap-3 text-sm text-[#4B5563]">
                                  <div style={{ width: 12, height: 2, background: GOLD, marginTop: 9, flexShrink: 0 }} />
                                  {outcome}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex gap-3 pt-2">
                            <Button variant="outline" className="flex-1 border-[#E8E4DC] text-[#0A0F2E] hover:bg-[#F8F7F4]">
                              <Settings className="h-4 w-4 mr-2" />
                              Configure
                            </Button>
                            <Button className="flex-1 bg-[#0A0F2E] text-white hover:bg-[#141B45]">
                              <Play className="h-4 w-4 mr-2" />
                              Execute
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <div style={{ background: OFF, padding: "64px 48px", border: "1px solid #E8E4DC", marginTop: 48 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                      <div style={{ width: 28, height: 2, background: GOLD }} />
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Strategic Intelligence</span>
                    </div>
                    <h2 style={{ ...CG, fontWeight: 600, fontSize: 32, color: NAVY, marginBottom: 24 }}>Strategic <em style={{ fontStyle: "italic", color: GOLD }}>Recommendations</em></h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div style={{ border: "1px solid #E8E4DC", borderLeft: `3px solid ${GOLD}`, padding: 24, background: "#fff" }}>
                        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: GOLD, marginBottom: 8 }}>Prioritization</p>
                        <p style={{ fontSize: 14, color: "#4B5563" }}>Focus on Financial Flexibility Framework first - high impact with low effort, providing foundation for other adaptations.</p>
                      </div>
                      <div style={{ border: "1px solid #E8E4DC", borderLeft: `3px solid ${TEAL}`, padding: 24, background: "#fff" }}>
                        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: TEAL, marginBottom: 8 }}>Synergy Opportunity</p>
                        <p style={{ fontSize: 14, color: "#4B5563" }}>Digital Transformation and Workforce Evolution strategies can be executed in parallel for 25% efficiency gain.</p>
                      </div>
                      <div style={{ border: "1px solid #E8E4DC", borderLeft: "3px solid #ef4444", padding: 24, background: "#fff" }}>
                        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#ef4444", marginBottom: 8 }}>Risk Mitigation</p>
                        <p style={{ fontSize: 14, color: "#4B5563" }}>Market Expansion strategy shows high risk - consider phased approach or additional contingency planning.</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ background: "#fff", border: "1px solid #E8E4DC", padding: 64, textAlign: "center" }}>
                  <BarChart3 className="h-16 w-16 text-[#C9A84C] mx-auto mb-6" />
                  <h3 style={{ ...CG, fontSize: 24, color: NAVY }}>Strategy Analytics & Performance</h3>
                  <p style={{ color: "#6B7280", marginTop: 8 }}>Advanced strategy analytics and performance tracking arriving in Q1.</p>
                </div>
              )}
            </div>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
}