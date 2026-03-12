import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import PageLayout from '@/components/layout/PageLayout';
import { 
  Brain, 
  Activity, 
  TrendingUp, 
  Layers, 
  Users, 
  Rocket,
  Zap,
  BarChart3,
  Target,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Globe
} from 'lucide-react';

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const GOLD_LT = "#DFC178";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

export default function AIIntelligence() {
  const [activeModule, setActiveModule] = useState('pulse');

  const aiModules = [
    {
      id: 'pulse',
      name: 'Pulse Intelligence',
      icon: <Activity className="w-6 h-6" />,
      description: 'Real-time organizational health monitoring and predictive analytics',
      status: 'active',
      accuracy: 92,
      lastUpdate: '2 minutes ago',
      insights: 847,
      color: '#0A0F2E'
    },
    {
      id: 'flux',
      name: 'Flux Adaptations',
      icon: <TrendingUp className="w-6 h-6" />,
      description: 'Dynamic adaptation strategies and change management intelligence',
      status: 'active',
      accuracy: 89,
      lastUpdate: '5 minutes ago',
      insights: 623,
      color: '#0A0F2E'
    },
    {
      id: 'prism',
      name: 'Prism Insights',
      icon: <Layers className="w-6 h-6" />,
      description: 'Multi-dimensional strategic analysis and decision support',
      status: 'active',
      accuracy: 94,
      lastUpdate: '1 minute ago',
      insights: 1203,
      color: '#0A0F2E'
    },
    {
      id: 'echo',
      name: 'Echo Cultural Analytics',
      icon: <Users className="w-6 h-6" />,
      description: 'Cultural intelligence and team dynamics assessment',
      status: 'active',
      accuracy: 87,
      lastUpdate: '3 minutes ago',
      insights: 456,
      color: '#0A0F2E'
    },
    {
      id: 'nova',
      name: 'Nova Innovations',
      icon: <Rocket className="w-6 h-6" />,
      description: 'Innovation pipeline management and breakthrough opportunity identification',
      status: 'active',
      accuracy: 91,
      lastUpdate: '4 minutes ago',
      insights: 329,
      color: '#0A0F2E'
    }
  ];

  const realtimeInsights = [
    "Organizational adaptability score increased 12% this quarter",
    "Crisis response readiness at 97% - protocols optimized",
    "Cross-functional collaboration efficiency up 23%",
    "Innovation pipeline identified 5 breakthrough opportunities",
    "Cultural alignment metrics show improved team dynamics"
  ];

  return (
    <PageLayout>
      <div className="flex-1 page-background overflow-auto bg-white">
        <div className="p-8">
          {/* AI Intelligence Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div style={{ width: 48, height: 48, background: NAVY, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Predictive Intelligence</span>
                </div>
                <h1 style={{ ...CG, fontWeight: 600, fontSize: "2rem", color: NAVY }}>AI Intelligence Center</h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div style={{ display:"inline-flex", alignItems:"center", gap:5, background:"rgba(43,138,110,0.12)", color:"#3BAF8A", fontSize:9, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", padding:"3px 10px" }}>
                <Activity className="w-3 h-3 mr-1" />
                All Modules Active
              </div>
              <div style={{ display:"inline-flex", alignItems:"center", gap:5, background: "rgba(10, 15, 46, 0.05)", color: NAVY, fontSize:9, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", padding:"3px 10px" }}>
                Enterprise AI
              </div>
            </div>
          </div>

          {/* AI Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {aiModules.map((module) => (
              <Card 
                key={module.id} 
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  activeModule === module.id ? 'ring-2 ring-[#C9A84C] bg-white' : 'bg-white'
                } border border-[#E8E4DC] p-0`}
                onClick={() => setActiveModule(module.id)}
                data-testid={`card-ai-module-${module.id}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div style={{ width: 32, height: 32, background: module.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {module.icon && <div className="text-white">{module.icon}</div>}
                    </div>
                    <div style={{ display:"inline-flex", alignItems:"center", gap:5, background: module.status === 'active' ? "rgba(43,138,110,0.12)" : "rgba(0,0,0,0.05)", color: module.status === 'active' ? "#3BAF8A" : "#6B7280", fontSize:9, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", padding:"3px 10px" }}>
                      {module.status}
                    </div>
                  </div>
                  <CardTitle style={{ ...CG, fontSize: "1.25rem", color: NAVY }}>{module.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{module.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Accuracy</span>
                      <span className="font-semibold text-[#2B8A6E]">{module.accuracy}%</span>
                    </div>
                    <Progress value={module.accuracy} className="h-2" />
                    
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>Last Update: {module.lastUpdate}</span>
                      <span>{module.insights} insights</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Real-time Intelligence Feed */}
            <Card className="border border-[#E8E4DC] bg-white p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle style={{ ...CG, display: "flex", alignItems: "center", color: NAVY }}>
                  <Zap className="w-5 h-5 mr-2 text-[#C9A84C]" />
                  Real-time Intelligence Feed
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <div className="space-y-4">
                  {realtimeInsights.map((insight, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-[#F8F7F4] rounded-lg">
                      <CheckCircle className="w-4 h-4 mt-0.5 text-[#2B8A6E] flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">{insight}</p>
                        <p className="text-xs text-gray-500 mt-1">AI Confidence: 95%</p>
                      </div>
                      <Clock className="w-3 h-3 text-gray-400" />
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline" style={{ border:"1.5px solid #E8E4DC", color:"#0A0F2E", background:"transparent", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }} data-testid="button-view-all-insights">
                  View All Intelligence Reports
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* AI Module Controls */}
            <Card className="border border-[#E8E4DC] bg-white p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle style={{ ...CG, display: "flex", alignItems: "center", color: NAVY }}>
                  <Target className="w-5 h-5 mr-2 text-[#0A0F2E]" />
                  AI Intelligence Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 space-y-4">
                <div className="p-4 bg-[#F8F7F4] rounded-lg border border-[#E8E4DC]">
                  <h4 style={{ ...CG, fontWeight: 600, color: NAVY, marginBottom: 8 }}>Active Intelligence Module</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {aiModules.find(m => m.id === activeModule)?.description}
                  </p>
                  <div className="flex space-x-2">
                    <Button size="sm" style={{ background: NAVY, color: "#fff", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }} data-testid="button-run-analysis">
                      Run Deep Analysis
                    </Button>
                    <Button size="sm" variant="outline" style={{ border:"1.5px solid #E8E4DC", color: NAVY, background:"transparent", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }} data-testid="button-export-insights">
                      Export Insights
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline" style={{ border:"1.5px solid #E8E4DC", color: NAVY, background:"transparent", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }} data-testid="button-predictive-analytics">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Run Predictive Analytics
                  </Button>
                  <Button className="w-full justify-start" variant="outline" style={{ border:"1.5px solid #E8E4DC", color: NAVY, background:"transparent", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }} data-testid="button-scenario-modeling">
                    <Globe className="w-4 h-4 mr-2" />
                    AI Scenario Modeling
                  </Button>
                  <Button className="w-full justify-start" variant="outline" style={{ border:"1.5px solid #E8E4DC", color: NAVY, background:"transparent", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }} data-testid="button-decision-intelligence">
                    <Target className="w-4 h-4 mr-2" />
                    Decision Intelligence
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-[#FFF9E5] border border-[#FBE39A] rounded-lg">
                  <div className="flex items-center text-[#856404]">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">AI Intelligence Recommendation</span>
                  </div>
                  <p className="text-xs text-[#856404] mt-1">
                    Based on current data, recommend immediate focus on crisis response protocol optimization and cross-functional team collaboration enhancement.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}