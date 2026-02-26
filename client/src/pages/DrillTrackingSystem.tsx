import StandardNav from '@/components/layout/StandardNav';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlayCircle, Trophy, Users, Clock, TrendingUp, Target, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const demoDrills = [
  {
    id: 'drill-001',
    name: 'Enterprise Ransomware Response Drill',
    status: 'completed',
    difficulty: 'advanced',
    scenarioType: 'Cybersecurity',
    participants: [
      { name: 'Sarah Chen', role: 'CISO' },
      { name: 'Michael Torres', role: 'VP Engineering' },
      { name: 'David Park', role: 'General Counsel' },
      { name: 'Lisa Wang', role: 'CFO' },
      { name: 'James Mitchell', role: 'VP Communications' },
      { name: 'Rachel Kim', role: 'CTO' }
    ],
    duration: 120,
    performanceMetrics: {
      overallScore: 91,
      decisionSpeed: 88,
      communicationClarity: 94,
      stakeholderAlignment: 89,
      resourceAllocation: 92
    },
    lessons: [
      'Initial containment protocol executed in 8 minutes — 40% faster than previous drill',
      'External communication template activated within SLA, reducing stakeholder uncertainty',
      'Cross-functional handoff between security and legal teams needs tighter coordination'
    ]
  },
  {
    id: 'drill-002',
    name: 'M&A Integration Tabletop Exercise',
    status: 'completed',
    difficulty: 'intermediate',
    scenarioType: 'Strategic',
    participants: [
      { name: 'Lisa Wang', role: 'CFO' },
      { name: 'David Park', role: 'General Counsel' },
      { name: 'Amanda Brooks', role: 'VP Strategy' },
      { name: 'Robert Chen', role: 'VP HR' },
      { name: 'Karen Patel', role: 'VP Operations' }
    ],
    duration: 90,
    performanceMetrics: {
      overallScore: 86,
      decisionSpeed: 82,
      communicationClarity: 91,
      stakeholderAlignment: 84,
      resourceAllocation: 87
    },
    lessons: [
      'Due diligence checklist completion improved from 72% to 94% with structured playbook',
      'Cultural integration assessment protocol successfully tested with realistic talent scenarios'
    ]
  },
  {
    id: 'drill-003',
    name: 'Supply Chain Disruption Simulation',
    status: 'completed',
    difficulty: 'advanced',
    scenarioType: 'Operational',
    participants: [
      { name: 'Karen Patel', role: 'VP Operations' },
      { name: 'Tom Nakamura', role: 'Head of Procurement' },
      { name: 'Lisa Wang', role: 'CFO' },
      { name: 'Sarah Chen', role: 'CISO' },
      { name: 'James Mitchell', role: 'VP Communications' }
    ],
    duration: 105,
    performanceMetrics: {
      overallScore: 78,
      decisionSpeed: 74,
      communicationClarity: 82,
      stakeholderAlignment: 76,
      resourceAllocation: 80
    },
    lessons: [
      'Alternative supplier activation took 35 minutes — target is under 20 minutes',
      'Financial impact modeling was accurate within 8% of projected disruption cost',
      'Customer communication cadence needs acceleration — first update delayed by 12 minutes'
    ]
  },
  {
    id: 'drill-004',
    name: 'Regulatory Audit Readiness Check',
    status: 'scheduled',
    difficulty: 'intermediate',
    scenarioType: 'Compliance',
    participants: [
      { name: 'David Park', role: 'General Counsel' },
      { name: 'Sarah Chen', role: 'CISO' },
      { name: 'Lisa Wang', role: 'CFO' },
      { name: 'Emily Foster', role: 'Compliance Director' }
    ],
    duration: 75,
    performanceMetrics: null,
    lessons: []
  },
  {
    id: 'drill-005',
    name: 'Competitive Response Exercise — Market Disruption',
    status: 'completed',
    difficulty: 'advanced',
    scenarioType: 'Competitive',
    participants: [
      { name: 'Amanda Brooks', role: 'VP Strategy' },
      { name: 'Michael Torres', role: 'VP Engineering' },
      { name: 'Rachel Kim', role: 'CTO' },
      { name: 'Lisa Wang', role: 'CFO' },
      { name: 'James Mitchell', role: 'VP Communications' },
      { name: 'Karen Patel', role: 'VP Operations' },
      { name: 'Tom Nakamura', role: 'Head of Product' }
    ],
    duration: 135,
    performanceMetrics: {
      overallScore: 88,
      decisionSpeed: 85,
      communicationClarity: 92,
      stakeholderAlignment: 87,
      resourceAllocation: 88
    },
    lessons: [
      'Competitive intelligence synthesis completed in 15 minutes with pre-built analysis templates',
      'Pricing response strategy formulated and war-gamed across 3 scenarios within SLA'
    ]
  }
];

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

export default function DrillTrackingSystem() {
  const { data: simulationsData, isLoading } = useQuery<any[]>({
    queryKey: ['/api/crisis-simulations'],
  });
  const simulations = (simulationsData && simulationsData.length > 0) ? simulationsData : demoDrills;

  const completedDrills = simulations.filter((s: any) => s.status === 'completed');
  const avgPerformance = completedDrills.length > 0
    ? completedDrills.reduce((acc: number, s: any) => acc + (s.performanceMetrics?.overallScore || 75), 0) / completedDrills.length
    : 0;

  const getStatusBadgeStyle = (status: string) => {
    switch(status) {
      case 'completed': return { background: "rgba(43,138,110,0.12)", color: "#3BAF8A" };
      case 'scheduled': return { background: "rgba(201,168,76,0.12)", color: "#C9A84C" };
      case 'running': return { background: "rgba(43,138,110,0.12)", color: "#3BAF8A" };
      default: return { background: "rgba(0,0,0,0.05)", color: "#6B7280" };
    }
  };

  return (
    <div className="flex-1 bg-white overflow-auto">
      {/* Navy Hero Section */}
      <div style={{ background: NAVY, padding: "64px 48px", position: "relative", overflow: "hidden", minHeight: 320 }}>
        <div style={{ 
          position: "absolute", 
          inset: 0, 
          backgroundImage: "linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)", 
          backgroundSize: "44px 44px" 
        }} />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 28, height: 2, background: "rgba(255,255,255,0.35)", flexShrink: 0 }} />
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.45)" }}>Readiness Auditing</span>
              </div>
              <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(40px,5vw,56px)", lineHeight: 1.05, color: "#fff", marginBottom: 16 }}>
                Drill Tracking <em style={{ fontStyle: "italic", color: "#DFC178" }}>System</em>
              </h1>
              <p className="text-white/60 text-lg max-w-2xl">Quarterly scenario practice and performance verification to maintain the Executive Preparedness Score™.</p>
            </div>
            <Button 
              style={{ background: "#C9A84C", color: "#0A0F2E", fontWeight: "bold" }}
              className="hover:bg-[#DFC178]"
              data-testid="button-create-drill"
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              Schedule New Drill
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", background: OFF, borderBottom:"1px solid #E8E4DC" }}>
        <div style={{ padding:24, borderRight:"1px solid #E8E4DC" }}>
          <div style={{ ...CG, fontSize: 40, fontWeight: 600, color: GOLD, lineHeight: 1 }}>{simulations.length}</div>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B7280", marginTop: 4 }}>Total Drills</div>
        </div>
        <div style={{ padding:24, borderRight:"1px solid #E8E4DC" }}>
          <div style={{ ...CG, fontSize: 40, fontWeight: 600, color: GOLD, lineHeight: 1 }}>{Math.round(avgPerformance)}%</div>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B7280", marginTop: 4 }}>Avg Performance</div>
        </div>
        <div style={{ padding:24, borderRight:"1px solid #E8E4DC" }}>
          <div style={{ ...CG, fontSize: 40, fontWeight: 600, color: GOLD, lineHeight: 1 }}>
            {simulations.reduce((acc: number, s: any) => acc + (s.participants?.length || 0), 0)}
          </div>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B7280", marginTop: 4 }}>Active Participants</div>
        </div>
        <div style={{ padding:24 }}>
          <div style={{ ...CG, fontSize: 40, fontWeight: 600, color: GOLD, lineHeight: 1 }}>
            {completedDrills.length >= 4 ? 'Green' : completedDrills.length >= 2 ? 'Yellow' : 'Red'}
          </div>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B7280", marginTop: 4 }}>Readiness Status</div>
        </div>
      </div>

      <div className="p-12 max-w-7xl mx-auto">
        <div style={{ border: "1px solid #E8E4DC", borderLeft: `3px solid ${NAVY}`, padding: "32px", background: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 28, height: 2, background: NAVY, flexShrink: 0 }} />
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: NAVY }}>Simulation Log</span>
          </div>
          <h2 style={{ ...CG, fontSize: 32, fontWeight: 600, color: NAVY, marginBottom: 8 }}>Crisis Simulation Drills</h2>
          <p className="text-[#6B7280] mb-8">Practice playbook execution with team performance tracking and systematic auditing.</p>

          {isLoading ? (
            <div className="text-center py-12 text-[#6B7280]">Loading drills...</div>
          ) : (
            <div className="space-y-6">
              {simulations.map((sim: any) => (
                <div 
                  key={sim.id} 
                  className="border border-[#E8E4DC] p-6 hover:border-[#0A0F2E] transition-colors"
                  data-testid={`drill-${sim.id}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-4">
                        <h3 className="text-xl font-bold text-[#0A0F2E]" data-testid={`text-drill-name-${sim.id}`}>{sim.name}</h3>
                        <span style={{ ...getStatusBadgeStyle(sim.status), fontSize:9, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase" as const, padding:"3px 10px" }}>
                          {sim.status}
                        </span>
                        <span style={{ background: OFF, border: "1px solid #E8E4DC", padding: "4px 8px", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6B7280" }}>
                          {sim.difficulty}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-6 text-xs font-bold tracking-widest uppercase text-[#6B7280]">
                        <div className="flex items-center gap-2">
                          <Users className="h-3.5 w-3.5" />
                          <span>{sim.participants?.length || 0} participants</span>
                        </div>
                        {sim.duration && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{sim.duration} minutes</span>
                          </div>
                        )}
                      </div>

                      {sim.status === 'completed' && sim.performanceMetrics && (
                        <div className="space-y-2 max-w-md">
                          <div className="flex items-center justify-between text-[10px] font-bold tracking-widest uppercase text-[#6B7280]">
                            <span>Overall Performance</span>
                            <span className="text-[#0A0F2E]">{sim.performanceMetrics.overallScore || 75}%</span>
                          </div>
                          <Progress value={sim.performanceMetrics.overallScore || 75} className="h-1 bg-[#E8E4DC]" />
                        </div>
                      )}

                      {sim.lessons && sim.lessons.length > 0 && (
                        <div style={{ border: "1px solid #E8E4DC", borderLeft: `2px solid ${GOLD}`, padding: "16px", background: OFF }}>
                          <p className="text-[10px] font-bold tracking-widest uppercase text-[#6B7280] mb-2">Key Audit Findings:</p>
                          <ul className="space-y-2">
                            {(sim.lessons as any[]).slice(0, 2).map((lesson: string, idx: number) => (
                              <li key={idx} className="text-sm text-[#0A0F2E] flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-[#2B8A6E] flex-shrink-0 mt-0.5" />
                                {lesson}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-3">
                      {sim.status === 'completed' && (
                        <button style={{ border: "1.5px solid #E8E4DC", color: NAVY, background: "transparent", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "10px 20px", cursor: "pointer" }} data-testid={`button-view-results-${sim.id}`}>
                          View Results
                        </button>
                      )}
                      {sim.status === 'scheduled' && (
                        <button style={{ background: NAVY, color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "10px 20px", border: "none", cursor: "pointer" }} data-testid={`button-start-drill-${sim.id}`}>
                          Start Drill
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
