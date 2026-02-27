import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { useDynamicStrategy } from '@/contexts/DynamicStrategyContext';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { 
  Radio, 
  AlertTriangle, 
  TrendingUp, 
  Eye, 
  Zap, 
  Settings, 
  Database, 
  Grid3X3, 
  Play, 
  Target, 
  Shield, 
  Lightbulb, 
  ArrowRight, 
  CheckCircle2,
  Activity,
  Globe,
  Cpu,
  Users,
  Scale,
  Brain,
  Timer,
  Radar,
  Building2,
  DollarSign
} from 'lucide-react';
import { SignalControlCenter } from '@/components/intelligence/SignalControlCenter';
import PageLayout from '@/components/layout/PageLayout';

interface EnhancedWeakSignal {
  id: string;
  title: string;
  description: string;
  source: string;
  confidence: number;
  category: string;
  impact: 'critical' | 'high' | 'medium' | 'low';
  timeline: string;
  timestamp: Date;
  suggestedPlaybook?: string;
}

interface EnhancedOraclePattern {
  id: string;
  name: string;
  description: string;
  accuracy: number;
  signals: number;
  trend: string;
  recommendation: string;
}

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

const demoWeakSignals: EnhancedWeakSignal[] = [
  {
    id: 'ws-1',
    title: 'Competitor Price Movement',
    description: 'Major competitor reduced enterprise pricing by 15% across three product lines. Social sentiment indicates positive market reception.',
    source: 'Market Intelligence',
    confidence: 87,
    category: 'Competitive',
    impact: 'high',
    timeline: '2-4 weeks',
    timestamp: new Date(),
    suggestedPlaybook: 'Competitive Response'
  },
  {
    id: 'ws-2',
    title: 'Key Talent Departure Risk',
    description: 'LinkedIn activity suggests increased recruiter engagement with senior engineering team. Glassdoor sentiment trending negative.',
    source: 'HR Analytics',
    confidence: 72,
    category: 'Talent',
    impact: 'critical',
    timeline: '1-2 weeks',
    timestamp: new Date(),
    suggestedPlaybook: 'Talent Retention'
  },
  {
    id: 'ws-3',
    title: 'Supply Chain Disruption',
    description: 'Port congestion in key shipping routes detected. Similar pattern preceded Q3 2024 delays by 3 weeks.',
    source: 'Operations Intelligence',
    confidence: 68,
    category: 'Operations',
    impact: 'medium',
    timeline: '3-6 weeks',
    timestamp: new Date(),
    suggestedPlaybook: 'Supply Chain Resilience'
  },
  {
    id: 'ws-4',
    title: 'Regulatory Shift Indicator',
    description: 'Congressional committee scheduled hearings on data privacy. Industry lobbyist activity increased 40% in past 30 days.',
    source: 'Regulatory Watch',
    confidence: 65,
    category: 'Regulatory',
    impact: 'high',
    timeline: '4-8 weeks',
    timestamp: new Date(),
    suggestedPlaybook: 'Regulatory Compliance'
  }
];

const demoOraclePatterns: EnhancedOraclePattern[] = [
  {
    id: 'op-1',
    name: 'Market Entry Window',
    description: 'Pattern analysis indicates optimal expansion window opening in European markets. Historical accuracy: 89%.',
    accuracy: 89,
    signals: 12,
    trend: 'Opportunity emerging',
    recommendation: 'Consider accelerating EU market entry by 6-8 weeks'
  },
  {
    id: 'op-2',
    name: 'Customer Churn Predictor',
    description: 'Behavioral patterns match pre-churn signals in enterprise segment. 3 accounts showing early warning signs.',
    accuracy: 92,
    signals: 8,
    trend: 'Risk increasing',
    recommendation: 'Initiate proactive retention outreach within 5 days'
  },
  {
    id: 'op-3',
    name: 'Innovation Cycle Timing',
    description: 'Industry innovation cycles suggest competitor product launches in Q2. Patent filing patterns confirm.',
    accuracy: 78,
    signals: 15,
    trend: 'Cycle accelerating',
    recommendation: 'Accelerate roadmap items to maintain leadership position'
  }
];

export default function ForesightRadar({ embedded }: { embedded?: boolean }) {
  const { weakSignals: apiSignals, oraclePatterns: apiPatterns, isLoading } = useDynamicStrategy();
  const { isConnected } = useWebSocket();
  const [, setLocation] = useLocation();
  const [selectedSignal, setSelectedSignal] = useState<EnhancedWeakSignal | null>(null);
  const [selectedPattern, setSelectedPattern] = useState<EnhancedOraclePattern | null>(null);
  const [highlightedSignal, setHighlightedSignal] = useState<string | null>(null);

  const weakSignals: EnhancedWeakSignal[] = apiSignals.length > 0 
    ? apiSignals.map(s => ({
        ...s,
        description: s.title + ' - Detected by AI monitoring',
        impact: 'medium' as const,
        timeline: '1-2 weeks'
      }))
    : demoWeakSignals;

  const oraclePatterns: EnhancedOraclePattern[] = apiPatterns.length > 0
    ? apiPatterns.map(p => ({
        ...p,
        description: `Pattern: ${p.name}`,
        recommendation: 'Review pattern details for recommended actions'
      }))
    : demoOraclePatterns;

  const handleInvestigateSignal = (signal: EnhancedWeakSignal) => {
    setSelectedSignal(signal);
  };

  const handleViewPattern = (pattern: EnhancedOraclePattern) => {
    setSelectedPattern(pattern);
  };

  const handleActivatePlaybook = (signal: EnhancedWeakSignal) => {
    setSelectedSignal(null);
    setLocation('/playbook-library');
  };

  if (isLoading) {
    return (
      <PageLayout embedded={embedded}>
        <div className="bg-white min-h-screen p-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-[#F8F7F4] rounded-none"></div>
              <div className="h-64 bg-[#F8F7F4] rounded-none"></div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout embedded={embedded}>
      <div className="bg-white min-h-screen">
        {/* Navy Hero Section */}
        <div style={{ background: "#0A0F2E", padding: "80px 48px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)", backgroundSize: "44px 44px" }} />
          <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
                <div className="w-6 h-0.5" style={{ background: "#C9A84C" }} />
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#C9A84C" }}>
                  Horizon Intelligence
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6" style={CG}>
                Foresight <em style={{ fontStyle: "italic", color: "#C9A84C" }}>Radar</em>
              </h1>
              <p className="text-xl text-white/70 max-w-2xl leading-relaxed">
                AI-powered continuous monitoring detects early signals of threats and opportunities before they become obvious. 
                See what's coming so you can act first, not react late.
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-8">
                <Link href="/intelligence-demo">
                  <Button style={{ background: "#C9A84C", color: "#0A0F2E" }} className="hover:bg-[#DFC178] rounded-none h-12 px-8 uppercase tracking-widest font-bold text-xs">
                    <Play className="w-4 h-4 mr-2" />
                    Interactive Demo
                  </Button>
                </Link>
                <Badge style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)" }} className="px-4 py-2 rounded-none h-12">
                  <div className={`w-2 h-2 rounded-none mr-2 ${isConnected ? 'bg-[#2B8A6E] animate-pulse' : 'bg-[#C9A84C]'}`}></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">{isConnected ? 'LIVE STREAM ACTIVE' : 'DEMO MODE'}</span>
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* ROI Context Bar */}
          <div style={{ border: "1px solid #E8E4DC", borderLeft: `3px solid ${TEAL}`, padding: "24px 32px", background: "#fff", marginBottom: 64 }}>
            <div className="flex items-center gap-6">
              <div style={{ width:48, height:48, background:NAVY, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: NAVY }}>Foresight Value Advantage</div>
                <div style={{ fontSize: 16, color: "#4B5563" }}>Detect weak signals 2-6 weeks before they impact the market, enabling proactive strategic maneuvering.</div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="radar" className="w-full">
            <TabsList style={{ background: "transparent", borderBottom: "1px solid #E8E4DC", width: "100%", justifyContent: "flex-start", borderRadius: 0, height: "auto", padding: 0, marginBottom: 48 }}>
              {["radar", "signals", "configure"].map((tab) => (
                <TabsTrigger 
                  key={tab}
                  value={tab} 
                  style={{ 
                    background: "transparent", 
                    border: "none", 
                    borderBottom: "2px solid transparent",
                    borderRadius: 0,
                    padding: "16px 32px",
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "#6B7280"
                  }}
                  className="data-[state=active]:border-b-[#0A0F2E] data-[state=active]:text-[#0A0F2E]"
                >
                  {tab === 'radar' && <Eye className="w-4 h-4 mr-2" />}
                  {tab === 'signals' && <Grid3X3 className="w-4 h-4 mr-2" />}
                  {tab === 'configure' && <Settings className="w-4 h-4 mr-2" />}
                  {tab} View
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="radar">
              <div className="grid grid-cols-12 gap-12">
                <div className="col-span-8">
                  <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", maxWidth: "700px", margin: "0 auto", background: "#F8F7F4", borderRadius: 0, border: "1px solid #E8E4DC" }}>
                    {/* Radar Circles */}
                    {[1, 2, 3].map((i) => (
                      <div key={i} style={{ 
                        position: "absolute", 
                        inset: `${i * 15}%`, 
                        border: "1px solid rgba(10,15,46,0.08)", 
                        borderRadius: 0 
                      }} />
                    ))}
                    
                    {/* Center Icon */}
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: 80, height: 80, background: "#141B45", borderRadius: 0, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 24px rgba(10,15,46,0.2)" }}>
                        <Radar className="w-10 h-10 text-white" />
                      </div>
                    </div>

                    {/* Scan Line */}
                    <div style={{ position: "absolute", inset: 0, borderRadius: 0, overflow: "hidden" }}>
                      <div 
                        className="animate-[spin_6s_linear_infinite]"
                        style={{ 
                          position: "absolute", 
                          width: "50%", 
                          height: "1px", 
                          background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.3))",
                          top: "50%",
                          left: "50%",
                          transformOrigin: "left"
                        }}
                      />
                    </div>

                    {/* Radar Blips */}
                    {weakSignals.slice(0, 8).map((signal, index) => {
                      const angle = (index * 45) + (index * 12);
                      const distance = 25 + (index * 8);
                      const x = 50 + distance * Math.cos((angle * Math.PI) / 180);
                      const y = 50 + distance * Math.sin((angle * Math.PI) / 180);
                      const color = signal.impact === 'critical' ? '#dc2626' : signal.impact === 'high' ? GOLD : TEAL;
                      
                      return (
                        <div
                          key={signal.id}
                          className="group"
                          style={{ 
                            position: "absolute", 
                            left: `${x}%`, 
                            top: `${y}%`, 
                            transform: "translate(-50%, -50%)",
                            cursor: "pointer"
                          }}
                          onClick={() => handleInvestigateSignal(signal)}
                        >
                          <div style={{ width: 12, height: 12, background: color, borderRadius: 0, position: "relative", zIndex: 10 }}>
                            <div className="animate-ping" style={{ position: "absolute", inset: 0, background: color, borderRadius: 0, opacity: 0.5 }} />
                          </div>
                          
                          {/* Tooltip */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-6 left-1/2 -translate-x-1/2 w-64 p-4 bg-white border border-[#E8E4DC] shadow-xl z-[100] rounded-none">
                            <h4 style={{ ...CG, fontSize: 16, fontWeight: 600, color: NAVY }}>{signal.title}</h4>
                            <p style={{ fontSize: 12, color: "#4B5563", marginTop: 4 }}>{signal.description}</p>
                            <div className="flex items-center gap-2 mt-3">
                              <Badge style={{ background: OFF, color: NAVY, border: "1px solid #E8E4DC", fontSize: 10 }} className="rounded-none">{signal.confidence}% CONFIDENCE</Badge>
                              <Badge style={{ background: color, color: "#fff", border: "none", fontSize: 10 }} className="rounded-none">{signal.impact.toUpperCase()}</Badge>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="col-span-4 space-y-6">
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <div style={{ width: 28, height: 2, background: GOLD }} />
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Priority Signals</span>
                  </div>
                  
                  <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                    {weakSignals.map((signal) => (
                      <div 
                        key={signal.id}
                        onClick={() => handleInvestigateSignal(signal)}
                        style={{ padding: 24, border: "1px solid #E8E4DC", background: "#fff", cursor: "pointer", transition: "all 0.2s" }}
                        className="hover:border-[#0A0F2E] hover:shadow-sm"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <h4 style={{ ...CG, fontSize: 18, fontWeight: 600, color: NAVY }}>{signal.title}</h4>
                          <span style={{ 
                            fontSize: 8, 
                            fontWeight: 700, 
                            letterSpacing: "0.1em", 
                            textTransform: "uppercase", 
                            padding: "2px 8px",
                            background: signal.impact === 'critical' ? 'rgba(220,38,38,0.1)' : 'rgba(201,168,76,0.1)',
                            color: signal.impact === 'critical' ? '#dc2626' : GOLD
                          }}>
                            {signal.impact}
                          </span>
                        </div>
                        <p style={{ fontSize: 14, color: "#4B5563", lineHeight: 1.5 }}>{signal.description}</p>
                        <div className="flex items-center gap-4 mt-6">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-3 h-3 text-[#6B7280]" />
                            <span style={{ fontSize: 11, color: "#6B7280" }}>{signal.confidence}% confidence</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Timer className="w-3 h-3 text-[#6B7280]" />
                            <span style={{ fontSize: 11, color: "#6B7280" }}>{signal.timeline} window</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Oracle Patterns Section */}
              <div className="mt-24">
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
                  <div style={{ width: 28, height: 2, background: GOLD }} />
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>AI Pattern recognition</span>
                </div>

                <div className="grid grid-cols-3 gap-8">
                  {oraclePatterns.map((pattern) => (
                    <div key={pattern.id} style={{ border: "1px solid #E8E4DC", padding: 32, background: OFF }}>
                      <div className="flex items-center justify-between mb-6">
                        <div style={{ width: 48, height: 48, background: NAVY, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Zap className="w-6 h-6 text-white" />
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, color: GOLD }}>{pattern.accuracy}% ACCURACY</span>
                      </div>
                      <h3 style={{ ...CG, fontSize: 24, fontWeight: 600, color: NAVY, marginBottom: 12 }}>{pattern.name}</h3>
                      <p style={{ fontSize: 15, color: "#4B5563", lineHeight: 1.6, marginBottom: 24 }}>{pattern.description}</p>
                      
                      <div style={{ borderTop: "1px solid #E8E4DC", paddingTop: 24 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: NAVY, marginBottom: 8 }}>Recommendation</div>
                        <p style={{ fontSize: 14, color: TEAL, fontStyle: "italic", lineHeight: 1.5 }}>{pattern.recommendation}</p>
                      </div>

                      <Button 
                        variant="outline" 
                        className="w-full mt-8 border-[#E8E4DC] text-[#0A0F2E] hover:bg-white rounded-none h-12 text-xs font-bold tracking-widest uppercase"
                        onClick={() => handleViewPattern(pattern)}
                      >
                        Analyze Pattern
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="signals">
              <SignalControlCenter />
            </TabsContent>

            <TabsContent value="configure">
              <div className="max-w-3xl mx-auto py-12">
                <div style={{ border: "1px solid #E8E4DC", padding: 48, background: "#fff" }}>
                  <h3 style={{ ...CG, fontSize: 32, fontWeight: 600, color: NAVY, marginBottom: 16 }}>Configuration</h3>
                  <p style={{ fontSize: 16, color: "#6B7280", marginBottom: 32 }}>Configure intelligence parameters, signal categories, and AI confidence thresholds for the Foresight Radar.</p>
                  
                  <div className="space-y-8">
                    {["Category Priority", "Alert Thresholds", "Source Management"].map((item) => (
                      <div key={item} className="flex items-center justify-between py-4 border-b border-[#E8E4DC]">
                        <span style={{ fontSize: 14, fontWeight: 600, color: NAVY }}>{item}</span>
                        <Button variant="ghost" className="text-[#6B7280]">
                          <Settings className="w-4 h-4 mr-2" />
                          Manage
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Dialogs */}
        <Dialog open={!!selectedSignal} onOpenChange={() => setSelectedSignal(null)}>
          <DialogContent className="sm:max-w-[600px] border-none p-0 overflow-hidden">
            <div style={{ background: NAVY, padding: 32 }}>
              <h2 style={{ ...CG, fontSize: 32, fontWeight: 600, color: "#fff" }}>Signal Investigation</h2>
            </div>
            <div className="p-8 bg-white">
              {selectedSignal && (
                <div className="space-y-6">
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: GOLD, marginBottom: 4 }}>Title</div>
                    <h3 style={{ ...CG, fontSize: 24, fontWeight: 600, color: NAVY }}>{selectedSignal.title}</h3>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6B7280", marginBottom: 4 }}>AI Assessment</div>
                    <p style={{ fontSize: 16, color: "#4B5563", lineHeight: 1.6 }}>{selectedSignal.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div style={{ padding: 16, background: OFF, border: "1px solid #E8E4DC" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: "#6B7280", textTransform: "uppercase" }}>Confidence</div>
                      <div style={{ fontSize: 20, fontWeight: 600, color: NAVY }}>{selectedSignal.confidence}%</div>
                    </div>
                    <div style={{ padding: 16, background: OFF, border: "1px solid #E8E4DC" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: "#6B7280", textTransform: "uppercase" }}>Impact</div>
                      <div style={{ fontSize: 20, fontWeight: 600, color: selectedSignal.impact === 'critical' ? '#dc2626' : GOLD }}>{selectedSignal.impact.toUpperCase()}</div>
                    </div>
                  </div>
                  <div className="pt-8 flex gap-4">
                    <Button 
                      className="flex-1 rounded-none h-12 bg-[#0A0F2E] text-white hover:bg-[#141B45] text-xs font-bold uppercase tracking-widest"
                      onClick={() => handleActivatePlaybook(selectedSignal)}
                    >
                      Activate Response Playbook
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 rounded-none h-12 border-[#E8E4DC] text-[#0A0F2E] text-xs font-bold uppercase tracking-widest"
                      onClick={() => setSelectedSignal(null)}
                    >
                      Dismiss Signal
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={!!selectedPattern} onOpenChange={() => setSelectedPattern(null)}>
          <DialogContent className="sm:max-w-[600px] border-none p-0 overflow-hidden">
            <div style={{ background: NAVY, padding: 32 }}>
              <h2 style={{ ...CG, fontSize: 32, fontWeight: 600, color: "#fff" }}>Pattern Detail</h2>
            </div>
            <div className="p-8 bg-white">
              {selectedPattern && (
                <div className="space-y-6">
                  <div>
                    <h3 style={{ ...CG, fontSize: 24, fontWeight: 600, color: NAVY }}>{selectedPattern.name}</h3>
                    <p style={{ fontSize: 16, color: "#4B5563", marginTop: 12, lineHeight: 1.6 }}>{selectedPattern.description}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white border border-[#E8E4DC]">
                      <div style={{ fontSize: 9, color: "#6B7280", textTransform: "uppercase" }}>Accuracy</div>
                      <div style={{ fontSize: 24, fontWeight: 600, color: GOLD }}>{selectedPattern.accuracy}%</div>
                    </div>
                    <div className="text-center p-4 bg-white border border-[#E8E4DC]">
                      <div style={{ fontSize: 9, color: "#6B7280", textTransform: "uppercase" }}>Signals</div>
                      <div style={{ fontSize: 24, fontWeight: 600, color: NAVY }}>{selectedPattern.signals}</div>
                    </div>
                    <div className="text-center p-4 bg-white border border-[#E8E4DC]">
                      <div style={{ fontSize: 9, color: "#6B7280", textTransform: "uppercase" }}>Trend</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: TEAL, marginTop: 8 }}>{selectedPattern.trend.toUpperCase()}</div>
                    </div>
                  </div>
                  <div style={{ padding: 24, background: "rgba(43,138,110,0.05)", borderLeft: `4px solid ${TEAL}` }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: TEAL, textTransform: "uppercase", marginBottom: 8 }}>AI Strategic Recommendation</div>
                    <p style={{ fontSize: 15, color: "#2D3748", fontStyle: "italic" }}>{selectedPattern.recommendation}</p>
                  </div>
                  <div className="pt-8">
                    <Button 
                      className="w-full rounded-none h-12 bg-[#0A0F2E] text-white hover:bg-[#141B45] text-xs font-bold uppercase tracking-widest"
                      onClick={() => setSelectedPattern(null)}
                    >
                      Close Analysis
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  );
}
