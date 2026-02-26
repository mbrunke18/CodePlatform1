import { Link } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Compass, 
  Play,
  Users, 
  MessageSquare,
  Shield,
  ChevronRight, 
  Timer,
  AlertTriangle,
  Activity,
  ArrowRight,
  ClipboardList,
  Radar,
  TrendingUp,
  Zap,
  CheckCircle,
  Calendar
} from 'lucide-react';
import { SubBrandLabel } from "@/components/SubBrandLabel";

const workspaceTools = [
  {
    title: "Command Center",
    description: "Real-time coordination hub for active playbook execution",
    path: "/mission-control",
    icon: Compass,
    color: "text-[#2B8A6E]",
    bgColor: "bg-[#2B8A6E]/10",
    stats: "Live coordination",
    featured: true
  },
  {
    title: "Crisis Response",
    description: "Rapid response protocols for critical situations",
    path: "/crisis",
    icon: AlertTriangle,
    color: "text-[#0A0F2E]",
    bgColor: "bg-[#0A0F2E]/10",
    stats: "Emergency protocols"
  },
  {
    title: "Situation Room",
    description: "War room for strategic decision-making during execution",
    path: "/war-room",
    icon: Shield,
    color: "text-[#0A0F2E]",
    bgColor: "bg-[#0A0F2E]/10",
    stats: "Decision support"
  },
  {
    title: "Team Collaboration",
    description: "Real-time communication and task coordination",
    path: "/collaboration",
    icon: MessageSquare,
    color: "text-[#2B8A6E]",
    bgColor: "bg-[#2B8A6E]/10",
    stats: "Team sync"
  },
  {
    title: "Practice Drills",
    description: "Simulate scenarios and test team readiness",
    path: "/practice-drills",
    icon: Play,
    color: "text-[#2B8A6E]",
    bgColor: "bg-[#2B8A6E]/10",
    stats: "Simulation"
  },
  {
    title: "Stakeholder Tracking",
    description: "Monitor stakeholder engagement and task completion",
    path: "/stakeholder-management",
    icon: Users,
    color: "text-[#C9A84C]",
    bgColor: "bg-[#C9A84C]/10",
    stats: "Engagement"
  }
];

const executionMetrics = [
  { label: "Active Playbooks", value: "2", icon: Play, color: "text-[#2B8A6E]" },
  { label: "Tasks In Progress", value: "14", icon: Activity, color: "text-[#0A0F2E]" },
  { label: "Stakeholders Engaged", value: "28", icon: Users, color: "text-[#2B8A6E]" },
  { label: "Avg Response Time", value: "12m", icon: Timer, color: "text-[#C9A84C]" }
];

export default function WorkspaceExecute() {
  return (
    <PageLayout>
      <div className="min-h-screen bg-[#F8F7F4] dark:bg-[#0A0F2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link href="/mission-control">
              <span className="text-[#0A0F2E] dark:text-white/60 hover:text-[#C9A84C] cursor-pointer">Execution OS One™</span>
            </Link>
            <ChevronRight className="h-4 w-4 text-[#0A0F2E] dark:text-white/40" />
            <span className="text-[#C9A84C] font-medium">EXECUTE</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-[#0A0F2E] shadow-lg shadow-[#0A0F2E]/30">
                <Compass className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Compass Command</h1>
                  <Badge className="bg-[#C9A84C] text-[#0A0F2E] border-none px-3 py-1 font-bold">
                    EXECUTE
                  </Badge>
                </div>
                <p className="text-[#6B7280] dark:text-white/60 mt-1">
                  Coordinate responses and execute playbooks in 12 minutes
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/mission-control">
                <Button className="bg-[#0A0F2E] text-white hover:bg-[#141B45]">
                  <Compass className="h-4 w-4 mr-2" />
                  Open Command Center
                </Button>
              </Link>
              <Link href="/practice-drills">
                <Button variant="outline" className="border-[#C9A84C]/20 text-[#C9A84C] hover:bg-[#C9A84C]/5">
                  <Play className="h-4 w-4 mr-2" />
                  Run Drill
                </Button>
              </Link>
            </div>
          </div>

          {/* IDEA Progress Tracker */}
          <Card className="mb-8 border-[#E8E4DC] dark:border-white/10 bg-white dark:bg-white/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#0A0F2E] dark:text-white">IDEA Framework Progress</h3>
                <span className="text-sm text-[#6B7280]">Phase 3 of 4</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 flex items-center gap-2">
                  <Link href="/workspaces/identify">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#2B8A6E]/10 hover:bg-[#2B8A6E]/20 cursor-pointer transition-colors" style={{ border: "1px solid rgba(43, 138, 110, 0.2)" }}>
                      <ClipboardList className="h-4 w-4 text-[#2B8A6E]" />
                      <span className="text-sm text-[#2B8A6E]">IDENTIFY</span>
                    </div>
                  </Link>
                  <ArrowRight className="h-4 w-4 text-[#6B7280]" />
                  <Link href="/workspaces/detect">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0A0F2E]/10 hover:bg-[#0A0F2E]/20 cursor-pointer transition-colors" style={{ border: "1px solid rgba(10, 15, 46, 0.2)" }}>
                      <Radar className="h-4 w-4 text-[#0A0F2E]" />
                      <span className="text-sm text-[#0A0F2E]">DETECT</span>
                    </div>
                  </Link>
                  <ArrowRight className="h-4 w-4 text-[#6B7280]" />
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#C9A84C]/20 border-2 border-[#C9A84C] shadow-sm shadow-[#C9A84C]/20">
                    <Compass className="h-4 w-4 text-[#0A0F2E]" />
                    <span className="text-sm font-bold text-[#0A0F2E]">EXECUTE</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#6B7280]" />
                  <Link href="/workspaces/advance">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#2B8A6E]/10 hover:bg-[#2B8A6E]/20 cursor-pointer transition-colors" style={{ border: "1px solid rgba(43, 138, 110, 0.2)" }}>
                      <span className="text-sm text-[#2B8A6E]">ADVANCE</span>
                    </div>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Execution Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {executionMetrics.map((metric) => (
              <Card key={metric.label} className="border-[#E8E4DC] dark:border-white/10 bg-white dark:bg-white/5 hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <metric.icon className={`h-5 w-5 ${metric.color}`} />
                  </div>
                  <p className="text-2xl font-bold text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{metric.value}</p>
                  <p className="text-xs text-[#6B7280]">{metric.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 12-Minute Promise Banner */}
          <Card className="mb-8 bg-white border border-[#E8E4DC] dark:bg-white/5 dark:border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-[#0A0F2E]/10 dark:bg-white/10">
                  <Timer className="h-8 w-8 text-[#C9A84C]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>12 Minutes to Coordinated Response</h3>
                  <p className="text-[#6B7280] dark:text-white/60">Execution OS delivers 340x faster execution than traditional approaches (72 hours)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Executions */}
          <h2 className="text-xl font-bold text-[#0A0F2E] dark:text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Active Executions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card className="border-[#E8E4DC] dark:border-white/10 bg-white dark:bg-white/5 border-l-4 border-l-[#C9A84C] hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-[#0A0F2E] dark:text-white">M&A Integration — CloudTech Acquisition</h4>
                  <Badge className="bg-[#C9A84C]/20 text-[#C9A84C] border-[#C9A84C]/30">Active</Badge>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-[#0A0F2E] dark:text-white">78%</span>
                  <Progress value={78} className="flex-1 h-2" />
                </div>
                <div className="flex items-center gap-4 text-sm text-[#6B7280] dark:text-white/60 mb-4">
                  <span className="flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> 28 of 45 tasks</span>
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> 45 stakeholders</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Jan 28</span>
                </div>
                <Link href="/mission-control">
                  <Button size="sm" variant="outline" className="border-[#C9A84C]/20 text-[#C9A84C] hover:bg-[#C9A84C]/5">
                    View Details <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="border-[#E8E4DC] dark:border-white/10 bg-white dark:bg-white/5 border-l-4 border-l-[#C9A84C] hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-[#0A0F2E] dark:text-white">Competitive Response — Market Counter-Strategy</h4>
                  <Badge className="bg-[#C9A84C]/20 text-[#C9A84C] border-[#C9A84C]/30">In Progress</Badge>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-[#0A0F2E] dark:text-white">34%</span>
                  <Progress value={34} className="flex-1 h-2" />
                </div>
                <div className="flex items-center gap-4 text-sm text-[#6B7280] dark:text-white/60 mb-4">
                  <span className="flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> 8 of 24 tasks</span>
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> 18 stakeholders</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Feb 15</span>
                </div>
                <Link href="/mission-control">
                  <Button size="sm" variant="outline" className="border-[#C9A84C]/20 text-[#C9A84C] hover:bg-[#C9A84C]/5">
                    View Details <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Workspace Tools Grid */}
          <h2 className="text-xl font-bold text-[#0A0F2E] dark:text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>EXECUTE Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {workspaceTools.map((tool) => (
              <Link key={tool.path + tool.title} href={tool.path}>
                <Card className={`border-[#E8E4DC] dark:border-white/10 bg-white dark:bg-white/5 h-full hover:shadow-lg transition-all cursor-pointer group ${tool.featured ? 'border-2 border-[#2B8A6E]/50' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${tool.bgColor}`}>
                        <tool.icon className={`h-6 w-6 ${tool.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-[#0A0F2E] dark:text-white group-hover:text-[#2B8A6E] transition-colors">
                            {tool.title}
                          </h3>
                          <ChevronRight className="h-4 w-4 text-[#6B7280] dark:text-white/40 group-hover:text-[#2B8A6E] transition-colors" />
                        </div>
                        <p className="text-sm text-[#6B7280] dark:text-white/60 mt-1">
                          {tool.description}
                        </p>
                        <Badge variant="outline" className="mt-3 text-xs border-[#E8E4DC] dark:border-white/10 text-[#6B7280] dark:text-white/60">
                          {tool.stats}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Next Phase CTA */}
          <Card className="bg-[#0A0F2E] border-[#C9A84C]/30">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-white/10">
                    <TrendingUp className="h-6 w-6 text-[#C9A84C]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Execution complete?</h3>
                    <p className="text-sm text-white/60">
                      Capture lessons learned and improve for next time in ADVANCE
                    </p>
                  </div>
                </div>
                <Link href="/workspaces/advance">
                  <Button className="bg-[#2B8A6E] text-white font-bold hover:bg-[#3BAF8A]">
                    Go to ADVANCE
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}