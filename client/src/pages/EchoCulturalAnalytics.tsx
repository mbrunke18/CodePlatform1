import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'wouter';
import OnboardingTrigger from '@/components/onboarding/OnboardingTrigger';
import { 
  Users, 
  Heart, 
  Brain,
  TrendingUp,
  MessageSquare,
  Target,
  Activity,
  Lightbulb,
  Award,
  Clock,
  BarChart3,
  PieChart,
  Globe,
  UserCheck,
  ArrowLeft,
  Home
} from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';

export default function EchoCulturalAnalytics() {
  const [selectedAnalysis, setSelectedAnalysis] = useState('overview');

  const culturalMetrics = [
    {
      id: 'engagement',
      name: 'Employee Engagement',
      value: 84.7,
      change: +5.2,
      status: 'excellent',
      description: 'Overall employee satisfaction and commitment levels',
      details: {
        participation: 92,
        satisfaction: 87,
        retention: 89,
        advocacy: 76
      },
      icon: <Heart className="h-5 w-5" />,
      color: 'emerald'
    },
    {
      id: 'collaboration',
      name: 'Team Collaboration',
      value: 78.9,
      change: +2.8,
      status: 'good',
      description: 'Cross-functional teamwork and knowledge sharing effectiveness',
      details: {
        crossTeam: 82,
        communication: 85,
        knowledge: 74,
        conflict: 23
      },
      icon: <Users className="h-5 w-5" />,
      color: 'blue'
    },
    {
      id: 'innovation',
      name: 'Innovation Culture',
      value: 91.3,
      change: +7.1,
      status: 'excellent',
      description: 'Creativity, risk-taking, and idea generation culture',
      details: {
        ideaGeneration: 94,
        riskTaking: 87,
        experimentation: 92,
        implementation: 89
      },
      icon: <Lightbulb className="h-5 w-5" />,
      color: 'purple'
    },
    {
      id: 'leadership',
      name: 'Leadership Trust',
      value: 73.4,
      change: -1.3,
      status: 'warning',
      description: 'Trust in leadership and organizational direction',
      details: {
        vision: 78,
        transparency: 71,
        decision: 69,
        support: 75
      },
      icon: <Award className="h-5 w-5" />,
      color: 'orange'
    }
  ];

  const teamDynamics = [
    {
      team: 'Engineering',
      engagement: 89,
      collaboration: 92,
      stress: 34,
      productivity: 87,
      retention: 94,
      size: 48
    },
    {
      team: 'Sales',
      engagement: 91,
      collaboration: 85,
      stress: 42,
      productivity: 89,
      retention: 87,
      size: 32
    },
    {
      team: 'Marketing',
      engagement: 86,
      collaboration: 88,
      stress: 28,
      productivity: 85,
      retention: 91,
      size: 24
    },
    {
      team: 'Operations',
      engagement: 78,
      collaboration: 74,
      stress: 51,
      productivity: 82,
      retention: 76,
      size: 19
    }
  ];

  const NAVY = "#0A0F2E";
  const GOLD = "#C9A84C";
  const TEAL = "#2B8A6E";
  const OFF = "#F8F7F4";
  const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

  const getColorClasses = (color: string) => {
    const colors = {
      emerald: `text-[${TEAL}] bg-[${TEAL}]/12 border-[${TEAL}]/30`,
      blue: `text-[${NAVY}] bg-[${NAVY}]/12 border-[${NAVY}]/30`,
      purple: `text-[${GOLD}] bg-[${GOLD}]/12 border-[${GOLD}]/30`,
      orange: `text-[${GOLD}] bg-[${GOLD}]/12 border-[${GOLD}]/30`
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return `bg-[${TEAL}]/12 text-[${TEAL}] border-[${TEAL}]/30`;
      case 'good': return `bg-[${NAVY}]/12 text-[${NAVY}] border-[${NAVY}]/30`;
      case 'warning': return `bg-[${GOLD}]/12 text-[${GOLD}] border-[${GOLD}]/30`;
      case 'critical': return 'bg-red-500/12 text-red-500 border-red-500/30';
      default: return 'bg-gray-500/12 text-gray-800 border-gray-500/30';
    }
  };

  return (
    <PageLayout>
      <div className="page-background min-h-screen bg-white p-6" data-testid="echo-cultural-analytics">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* ROI Value Context */}
          <div style={{ border: "1px solid #E8E4DC", borderLeft: `3px solid ${TEAL}`, padding: "20px 24px", background: "#fff" }} data-testid="echo-roi-context">
            <div className="flex items-center gap-4">
              <div style={{ width:32, height:32, background:NAVY, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: NAVY }}>How Echo Saves You Money</div>
                <div style={{ fontSize: 14, color: "#6B7280" }}>Prevents $2M+ culture crisis escalation costs through early detection and intervention</div>
              </div>
            </div>
          </div>

          {/* Header */}
          <div style={{ background: NAVY, padding: "64px 48px", position: "relative", overflow: "hidden", borderRadius: 0 }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)", backgroundSize: "44px 44px" }} />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div style={{ width:64, height:64, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Users className={`h-10 w-10 text-[${GOLD}]`} />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <div style={{ width: 28, height: 2, background: GOLD }} />
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Cultural Intelligence</span>
                  </div>
                  <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(32px,4vw,48px)", color: "#fff", lineHeight: 1.1 }}>
                    Echo Cultural <em style={{ fontStyle: "italic", color: GOLD }}>Analytics</em>
                  </h1>
                  <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 8 }}>Cultural intelligence and team dynamics assessment platform</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Button style={{ background: GOLD, color: NAVY, fontWeight: 700, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", padding: "11px 28px", border: "none" }} data-testid="generate-report-button">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Culture Report
                </Button>
              </div>
            </div>
          </div>

          <Tabs value={selectedAnalysis} onValueChange={setSelectedAnalysis} className="w-full">
            <TabsList className="bg-[#F8F7F4] p-1 border border-[#E8E4DC]">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-[#0A0F2E]">Overview</TabsTrigger>
              <TabsTrigger value="teams" className="data-[state=active]:bg-white data-[state=active]:text-[#0A0F2E]">Teams</TabsTrigger>
              <TabsTrigger value="insights" className="data-[state=active]:bg-white data-[state=active]:text-[#0A0F2E]">Insights</TabsTrigger>
              <TabsTrigger value="trends" className="data-[state=active]:bg-white data-[state=active]:text-[#0A0F2E]">Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-8">
              {/* Cultural Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {culturalMetrics.map((metric) => (
                  <Card key={metric.id} className="border border-[#E8E4DC] bg-white p-6 shadow-none rounded-none" data-testid={`metric-${metric.id}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div style={{ width:40, height:40, background:NAVY, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <div className="text-white">
                          {metric.icon}
                        </div>
                      </div>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:5, background: metric.status === 'excellent' ? 'rgba(43,138,110,0.12)' : metric.status === 'warning' ? 'rgba(201,168,76,0.12)' : 'rgba(0,0,0,0.05)', color: metric.status === 'excellent' ? TEAL : metric.status === 'warning' ? GOLD : "#6B7280", fontSize:9, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", padding:"3px 10px" }}>
                        {metric.status}
                      </span>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 style={{ ...CG, fontSize: 20, fontWeight: 600, color: NAVY }}>{metric.name}</h3>
                        <span style={{ fontSize: 12, fontWeight: 700, color: metric.change >= 0 ? TEAL : "#ef4444" }}>
                          {metric.change >= 0 ? '+' : ''}{metric.change}%
                        </span>
                      </div>
                      <div style={{ fontSize: 32, fontWeight: 600, color: NAVY, ...CG }}>{metric.value}%</div>
                      <Progress value={metric.value} className="h-1 bg-[#E8E4DC]" style={{ '--progress-background': metric.status === 'excellent' ? TEAL : metric.status === 'warning' ? GOLD : NAVY } as any} />
                      <p style={{ fontSize: 12, color: "#6B7280" }}>{metric.description}</p>
                      
                      {/* Detailed Breakdown */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-4 border-t border-[#E8E4DC]">
                        {Object.entries(metric.details).map(([key, value]) => (
                          <div key={key} className="flex flex-col">
                            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "#6B7280" }}>{key}</span>
                            <span style={{ fontSize: 14, fontWeight: 600, color: NAVY }}>{value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Key Cultural Insights */}
              <div style={{ background: OFF, padding: "64px 48px", border: "1px solid #E8E4DC", marginTop: 48, borderRadius: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 28, height: 2, background: GOLD }} />
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Echo Summary</span>
                </div>
                <h2 style={{ ...CG, fontWeight: 600, fontSize: 32, color: NAVY, marginBottom: 24 }}>Cultural Health <em style={{ fontStyle: "italic", color: GOLD }}>Summary</em></h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div style={{ border: "1px solid #E8E4DC", borderLeft: `3px solid ${TEAL}`, padding: 24, background: "#fff" }}>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className={`h-4 w-4 text-[${TEAL}]`} />
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: TEAL }}>Positive Trends</span>
                    </div>
                    <ul className="space-y-2">
                      <li className="text-sm text-[#4B5563]">Innovation culture surging (+7.1%)</li>
                      <li className="text-sm text-[#4B5563]">Employee engagement at 3-year high</li>
                      <li className="text-sm text-[#4B5563]">Cross-team collaboration improving</li>
                    </ul>
                  </div>
                  <div style={{ border: "1px solid #E8E4DC", borderLeft: `3px solid ${GOLD}`, padding: 24, background: "#fff" }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Target className={`h-4 w-4 text-[${GOLD}]`} />
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: GOLD }}>Focus Areas</span>
                    </div>
                    <ul className="space-y-2">
                      <li className="text-sm text-[#4B5563]">Leadership trust needs attention</li>
                      <li className="text-sm text-[#4B5563]">Operations team stress levels high</li>
                      <li className="text-sm text-[#4B5563]">Communication transparency gaps</li>
                    </ul>
                  </div>
                  <div style={{ border: "1px solid #E8E4DC", borderLeft: `3px solid ${NAVY}`, padding: 24, background: "#fff" }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className={`h-4 w-4 text-[${NAVY}]`} />
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: NAVY }}>Recommendations</span>
                    </div>
                    <ul className="space-y-2">
                      <li className="text-sm text-[#4B5563]">Leadership visibility sessions</li>
                      <li className="text-sm text-[#4B5563]">Operations workload review</li>
                      <li className="text-sm text-[#4B5563]">Transparent decision processes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="teams" className="space-y-6 mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {teamDynamics.map((team) => (
                  <Card key={team.team} className="border border-[#E8E4DC] bg-white p-6 shadow-none rounded-none" data-testid={`team-${team.team.toLowerCase()}`}>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div style={{ width:40, height:40, background:NAVY, display:"flex", alignItems:"center", justifyContent:"center" }}>
                          <Users className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 style={{ ...CG, fontSize: 20, fontWeight: 600, color: NAVY }}>{team.team} Team</h3>
                          <p style={{ fontSize: 12, color: "#6B7280" }}>{team.size} members</p>
                        </div>
                      </div>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:5, background: "rgba(43,138,110,0.12)", color: TEAL, fontSize:9, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", padding:"3px 10px" }}>
                        {team.engagement}% ENGAGED
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>Collaboration</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: TEAL }}>{team.collaboration}%</span>
                        </div>
                        <Progress value={team.collaboration} className="h-1 bg-[#E8E4DC]" style={{ '--progress-background': TEAL } as any} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>Productivity</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: NAVY }}>{team.productivity}%</span>
                        </div>
                        <Progress value={team.productivity} className="h-1 bg-[#E8E4DC]" style={{ '--progress-background': NAVY } as any} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>Retention</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: GOLD }}>{team.retention}%</span>
                        </div>
                        <Progress value={team.retention} className="h-1 bg-[#E8E4DC]" style={{ '--progress-background': GOLD } as any} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>Stress Level</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: team.stress > 40 ? "#ef4444" : TEAL }}>{team.stress}%</span>
                        </div>
                        <Progress value={team.stress} className="h-1 bg-[#E8E4DC]" style={{ '--progress-background': team.stress > 40 ? "#ef4444" : TEAL } as any} />
                      </div>
                    </div>
                    <div className="pt-6 mt-6 border-t border-[#E8E4DC]">
                      <Button variant="outline" className="w-full border-[#E8E4DC] text-[#0A0F2E] hover:bg-[#F8F7F4] rounded-none">
                        <UserCheck className="h-4 w-4 mr-2" />
                        Team Deep Dive
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="insights" className="mt-8">
              <div style={{ background: "#fff", border: "1px solid #E8E4DC", padding: 64, textAlign: "center", borderRadius: 0 }}>
                <Brain className="h-16 w-16 text-[#C9A84C] mx-auto mb-6" />
                <h3 style={{ ...CG, fontSize: 24, color: NAVY }}>AI-Powered Cultural Insights</h3>
                <p style={{ color: "#6B7280", marginTop: 8 }}>Advanced cultural pattern analysis and predictive insights arriving in Q1.</p>
              </div>
            </TabsContent>

            <TabsContent value="trends" className="mt-8">
              <div style={{ background: "#fff", border: "1px solid #E8E4DC", padding: 64, textAlign: "center", borderRadius: 0 }}>
                <PieChart className="h-16 w-16 text-[#C9A84C] mx-auto mb-6" />
                <h3 style={{ ...CG, fontSize: 24, color: NAVY }}>Cultural Trend Analysis</h3>
                <p style={{ color: "#6B7280", marginTop: 8 }}>Historical cultural trends and future projections arriving in Q1.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
}