import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import IDEALayout from '@/components/layout/IDEALayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { updatePageMetadata } from '@/lib/seo';
import { IDEA_PHASES, STRATEGIC_DOMAINS } from '@shared/constants/framework';
import { SIGNAL_CATEGORIES } from '@shared/intelligence-signals';
import TriggerProbabilityForecast from '@/components/predictive/TriggerProbabilityForecast';
import {
  ClipboardList,
  Radar,
  Play,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Target,
  Shield,
  Users,
  Activity,
  ChevronRight,
  Sparkles,
  Bell,
  Rocket,
  Globe,
  Scale,
  GitMerge,
  Brain,
  Swords,
  Eye,
  Radio,
  BarChart3,
  ArrowRight,
  Timer,
  PlayCircle,
  BookOpen,
  Lightbulb,
  RefreshCw,
  Settings,
  ExternalLink,
  Layers,
  X,
  Briefcase,
  Calculator,
  FileText
} from 'lucide-react';
import ExecuteIQLogo from '@/components/ExecuteIQLogo';
import JourneyNavigator from '@/components/JourneyNavigator';

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";
const BORDER = "#E8E4DC";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

interface PendingTrigger {
  id: string;
  name: string;
  category: string;
  severity: 'critical' | 'high' | 'medium';
  detectedAt: string;
  source: string;
  suggestedPlaybook: string;
  suggestedPlaybookId: string;
  confidence: number;
}

interface ActiveExecution {
  id: string;
  name: string;
  playbook: string;
  startedAt: string;
  progress: number;
  status: 'active' | 'paused' | 'completed';
  stakeholdersEngaged: number;
  tasksCompleted: number;
  totalTasks: number;
}

export default function MissionControl() {
  const [, setLocation] = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    updatePageMetadata({
      title: 'Mission Control | ExecuteIQ',
      description: 'Single-pane executive overview of strategic readiness and execution status.'
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { data: playbooks = [] } = useQuery<any[]>({
    queryKey: ['/api/playbooks'],
  });

  const { data: triggers = [] } = useQuery<any[]>({
    queryKey: ['/api/triggers'],
  });

  const [pendingTriggers, setPendingTriggers] = useState<PendingTrigger[]>([
    {
      id: 'pt-1',
      name: 'Competitor Product Launch Detected',
      category: 'competitive',
      severity: 'critical',
      detectedAt: new Date(Date.now() - 12 * 60000).toISOString(),
      source: 'Market Intelligence',
      suggestedPlaybook: 'Competitive Counter-Positioning',
      suggestedPlaybookId: 'playbook-1',
      confidence: 94
    },
    {
      id: 'pt-2',
      name: 'Regulatory Filing Deadline Approaching',
      category: 'regulatory',
      severity: 'high',
      detectedAt: new Date(Date.now() - 45 * 60000).toISOString(),
      source: 'Compliance Monitoring',
      suggestedPlaybook: 'Regulatory Response Protocol',
      suggestedPlaybookId: 'playbook-2',
      confidence: 87
    }
  ]);

  const [activeExecutions, setActiveExecutions] = useState<ActiveExecution[]>([]);

  const handleActivatePlaybook = (trigger: PendingTrigger) => {
    setPendingTriggers(prev => prev.filter(t => t.id !== trigger.id));
    const newExecution: ActiveExecution = {
      id: `exec-${Date.now()}`,
      name: trigger.name,
      playbook: trigger.suggestedPlaybook,
      startedAt: new Date().toISOString(),
      progress: 0,
      status: 'active',
      stakeholdersEngaged: 0,
      tasksCompleted: 0,
      totalTasks: 12
    };
    setActiveExecutions(prev => [...prev, newExecution]);
  };

  return (
    <IDEALayout showBackButton={false}>
      <div style={{ background: OFF, minHeight: "100vh" }}>
        {/* Navy Hero Header */}
        <div style={{ background: NAVY, padding: "48px 48px 32px", position: "relative", overflow: "hidden" }}>
          <div style={{ 
            position: "absolute", 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundImage: "linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)", 
            backgroundSize: "44px 44px" 
          }} />
          
          <div className="relative z-10 max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 28, height: 2, background: "rgba(255,255,255,0.35)" }} />
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>
                  Operational Center
                </span>
              </div>
              <h1 style={{ ...CG, color: "#fff", fontSize: "40px", fontWeight: 600, lineHeight: 1.1 }}>
                Mission <em style={{ fontStyle: "italic", color: "#C9A84C" }}>Control</em> One™
              </h1>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="text-right">
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">System Time</div>
                <div style={{ ...CG, color: "#fff", fontSize: "24px", fontWeight: 500 }}>{currentTime.toLocaleTimeString()}</div>
              </div>
              <div className="bg-white/5 border border-white/10 p-3 rounded-none flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#2B8A6E] animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#2B8A6E]">Live Telemetry</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto px-6 py-12 space-y-8">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Live Status */}
            <div className="lg:col-span-8 space-y-8">
              <TriggerProbabilityForecast triggers={triggers} compact={false} />

              <Card className="border-[#E8E4DC] bg-white overflow-hidden">
                <CardHeader className="border-b border-[#E8E4DC] p-6 bg-[#F8F7F4]/50">
                  <div className="flex items-center justify-between">
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 28, height: 2, background: GOLD }} />
                      <CardTitle style={{ ...CG, fontSize: "24px", color: NAVY }}>Active Telemetry Hub</CardTitle>
                    </div>
                    {pendingTriggers.length > 0 && (
                      <Badge style={{ background: "rgba(201,168,76,0.1)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.2)" }} className="px-3 py-1 font-bold rounded-none">
                        {pendingTriggers.length} CRITICAL EVENTS
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {pendingTriggers.length > 0 ? (
                    <div className="divide-y divide-[#E8E4DC]">
                      {pendingTriggers.map((trigger) => (
                        <div key={trigger.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-[#F8F7F4]/30 transition-colors">
                          <div className="flex items-start gap-4">
                            <div style={{ width: 40, height: 40, background: NAVY, borderRadius: 0, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <AlertTriangle className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <div className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280] mb-1">{trigger.category} signal detected</div>
                              <div style={{ ...CG, fontSize: "20px", fontWeight: 600, color: NAVY }}>{trigger.name}</div>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-[#6B7280]">Confidence: {trigger.confidence}%</span>
                                <span className="w-1 h-1 rounded-full bg-[#E8E4DC]" />
                                <span className="text-xs text-[#6B7280]">Source: {trigger.source}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Button 
                              onClick={() => handleActivatePlaybook(trigger)}
                              style={{ background: NAVY, color: "#fff" }}
                              className="font-bold uppercase tracking-widest text-[10px] px-6 rounded-none"
                            >
                              Activate Response
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-24 text-center">
                      <div className="text-gray-400 italic">No active triggers requiring immediate executive intervention.</div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {activeExecutions.length > 0 && (
                <Card className="border-[#C9A84C] bg-white overflow-hidden border-t-4">
                  <CardHeader className="border-b border-[#E8E4DC] p-6">
                    <CardTitle style={{ ...CG, fontSize: "20px", color: NAVY }}>Live Execution Status</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {activeExecutions.map(exec => (
                      <div key={exec.id} className="space-y-4">
                        <div className="flex justify-between items-end">
                          <div>
                            <div style={{ ...CG, fontSize: "24px", fontWeight: 600, color: NAVY }}>{exec.playbook}</div>
                            <div className="text-xs text-[#6B7280]">Execution active for 2m 14s</div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-[#2B8A6E]">{exec.progress}%</div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">Complete</div>
                          </div>
                        </div>
                        <Progress value={exec.progress} className="h-2 bg-[#F8F7F4] [&>div]:bg-[#C9A84C]" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - System Stats */}
            <div className="lg:col-span-4 space-y-8">
              <Card className="border-[#E8E4DC] bg-white rounded-none shadow-sm">
                <CardHeader className="border-b border-[#E8E4DC]">
                  <CardTitle style={{ ...CG, fontSize: "20px", color: NAVY }}>Readiness Matrix</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div style={{ background: "#F8F7F4", padding: 20, border: "1px solid #E8E4DC" }} className="rounded-none">
                      <div style={{ ...CG, fontSize: "32px", fontWeight: 600, color: NAVY }}>170</div>
                      <div className="text-[9px] font-bold uppercase tracking-widest text-[#6B7280] mt-1">Playbooks</div>
                    </div>
                    <div style={{ background: "#F8F7F4", padding: 20, border: "1px solid #E8E4DC" }} className="rounded-none">
                      <div style={{ ...CG, fontSize: "32px", fontWeight: 600, color: TEAL }}>94%</div>
                      <div className="text-[9px] font-bold uppercase tracking-widest text-[#6B7280] mt-1">Reliability</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#6B7280] font-bold uppercase tracking-widest">Signal Precision</span>
                      <span className="font-bold text-[#0A0F2E]">89.4%</span>
                    </div>
                    <Progress value={89.4} className="h-1 bg-[#F8F7F4] rounded-none [&>div]:bg-[#C9A84C]" />
                    
                    <div className="flex justify-between items-center text-xs pt-2">
                      <span className="text-[#6B7280] font-bold uppercase tracking-widest">Cohesion Index</span>
                      <span className="font-bold text-[#0A0F2E]">92.1%</span>
                    </div>
                    <Progress value={92.1} className="h-1 bg-[#F8F7F4] rounded-none [&>div]:bg-[#C9A84C]" />
                  </div>
                </CardContent>
              </Card>

              <Card style={{ background: NAVY }} className="border-none text-white rounded-none shadow-sm">
                <CardContent className="pt-6">
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 20, height: 2, background: GOLD }} />
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD }}>Infrastructure Status</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/60">Oracle AI Core</span>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#2B8A6E]" />
                        <span className="text-[10px] font-bold text-[#2B8A6E] uppercase">Operational</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/60">Telemetry Mesh</span>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#2B8A6E]" />
                        <span className="text-[10px] font-bold text-[#2B8A6E] uppercase">Synchronized</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="pt-4">
                <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B7280]">
                  Confidential Operational View • VaughnMartin
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </IDEALayout>
  );
}
