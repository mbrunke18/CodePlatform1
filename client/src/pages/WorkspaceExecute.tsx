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

const workspaceTools = [
  {
    title: "Command Center",
    description: "Real-time coordination hub for active playbook execution",
    path: "/mission-control",
    icon: Compass,
    color: "text-poise-teal",
    bgColor: "bg-poise-teal/10",
    stats: "Live coordination",
    featured: true
  },
  {
    title: "Crisis Response",
    description: "Rapid response protocols for critical situations",
    path: "/crisis",
    icon: AlertTriangle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    stats: "Emergency protocols"
  },
  {
    title: "Situation Room",
    description: "War room for strategic decision-making during execution",
    path: "/war-room",
    icon: Shield,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    stats: "Decision support"
  },
  {
    title: "Team Collaboration",
    description: "Real-time communication and task coordination",
    path: "/collaboration",
    icon: MessageSquare,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    stats: "Team sync"
  },
  {
    title: "Practice Drills",
    description: "Simulate scenarios and test team readiness",
    path: "/practice-drills",
    icon: Play,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    stats: "Simulation"
  },
  {
    title: "Stakeholder Tracking",
    description: "Monitor stakeholder engagement and task completion",
    path: "/stakeholder-management",
    icon: Users,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    stats: "Engagement"
  }
];

const executionMetrics = [
  { label: "Active Playbooks", value: "2", icon: Play, color: "text-poise-teal" },
  { label: "Tasks In Progress", value: "14", icon: Activity, color: "text-blue-500" },
  { label: "Stakeholders Engaged", value: "28", icon: Users, color: "text-purple-500" },
  { label: "Avg Response Time", value: "12m", icon: Timer, color: "text-poise-gold" }
];

export default function WorkspaceExecute() {
  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50/30 dark:from-poise-navy dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link href="/mission-control">
              <span className="text-gray-800 hover:text-poise-teal cursor-pointer">Execution OS One™</span>
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-800 dark:text-slate-200" />
            <span className="text-poise-teal font-medium">EXECUTE</span>
          </nav>

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-poise-teal to-cyan-500 shadow-lg shadow-poise-teal/30">
                <Compass className="h-8 w-8 text-gray-900" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Compass Command</h1>
                  <Badge className="bg-poise-teal/20 text-poise-teal border-poise-teal/30">
                    Execution OS Compass™
                  </Badge>
                </div>
                <p className="text-gray-800 dark:text-slate-300 mt-1">
                  Coordinate responses and execute playbooks in 12 minutes
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/mission-control">
                <Button className="bg-poise-teal hover:bg-cyan-600 text-gray-900">
                  <Compass className="h-4 w-4 mr-2" />
                  Open Command Center
                </Button>
              </Link>
              <Link href="/practice-drills">
                <Button variant="outline" className="border-poise-teal/50 text-poise-teal hover:bg-poise-teal/10">
                  <Play className="h-4 w-4 mr-2" />
                  Run Drill
                </Button>
              </Link>
            </div>
          </div>

          {/* IDEA Progress Tracker */}
          <Card className="mb-8 border-poise-teal/30 bg-gradient-to-r from-poise-teal/5 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">IDEA Framework Progress</h3>
                <span className="text-sm text-gray-800">Phase 3 of 4</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 flex items-center gap-2">
                  <Link href="/workspaces/identify">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-poise-gold/10 hover:bg-poise-gold/20 cursor-pointer transition-colors">
                      <ClipboardList className="h-4 w-4 text-poise-gold" />
                      <span className="text-sm text-poise-gold">IDENTIFY</span>
                    </div>
                  </Link>
                  <ArrowRight className="h-4 w-4 text-gray-800" />
                  <Link href="/workspaces/detect">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-poise-teal/10 hover:bg-poise-teal/20 cursor-pointer transition-colors">
                      <Radar className="h-4 w-4 text-poise-teal" />
                      <span className="text-sm text-poise-teal">DETECT</span>
                    </div>
                  </Link>
                  <ArrowRight className="h-4 w-4 text-gray-800" />
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-poise-teal/20 border-2 border-poise-teal">
                    <Compass className="h-4 w-4 text-poise-teal" />
                    <span className="text-sm font-medium text-poise-teal">EXECUTE</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-800" />
                  <Link href="/workspaces/advance">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-poise-gold/10 cursor-pointer transition-colors">
                      <span className="text-sm text-gray-800">ADVANCE</span>
                    </div>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Execution Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {executionMetrics.map((metric) => (
              <Card key={metric.label} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <metric.icon className={`h-5 w-5 ${metric.color}`} />
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{metric.value}</p>
                  <p className="text-xs text-gray-800">{metric.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 12-Minute Promise Banner */}
          <Card className="mb-8 bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-white/10">
                  <Timer className="h-8 w-8 text-poise-gold" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">12 Minutes to Coordinated Response</h3>
                  <p className="text-gray-800">Execution OS delivers 340x faster execution than traditional approaches (72 hours)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Executions */}
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Active Executions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card className="border-l-4 border-l-poise-teal hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-slate-900 dark:text-white">M&A Integration — CloudTech Acquisition</h4>
                  <Badge className="bg-poise-teal/20 text-poise-teal border-poise-teal/30">Active</Badge>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">78%</span>
                  <Progress value={78} className="flex-1 h-2" />
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-800 dark:text-slate-300 mb-4">
                  <span className="flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> 28 of 45 tasks</span>
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> 45 stakeholders</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Jan 28</span>
                </div>
                <Link href="/mission-control">
                  <Button size="sm" variant="outline" className="border-poise-teal/50 text-poise-teal hover:bg-poise-teal/10">
                    View Details <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-slate-900 dark:text-white">Competitive Response — Market Counter-Strategy</h4>
                  <Badge className="bg-amber-500/20 text-[#C9A84C] border-amber-500/30">In Progress</Badge>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">34%</span>
                  <Progress value={34} className="flex-1 h-2" />
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-800 dark:text-slate-300 mb-4">
                  <span className="flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> 8 of 24 tasks</span>
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> 18 stakeholders</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Feb 15</span>
                </div>
                <Link href="/mission-control">
                  <Button size="sm" variant="outline" className="border-amber-500/50 text-[#C9A84C] hover:bg-amber-500/10">
                    View Details <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Workspace Tools Grid */}
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">EXECUTE Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {workspaceTools.map((tool) => (
              <Link key={tool.path + tool.title} href={tool.path}>
                <Card className={`h-full hover:shadow-lg transition-all cursor-pointer group ${tool.featured ? 'border-2 border-poise-teal/50' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${tool.bgColor}`}>
                        <tool.icon className={`h-6 w-6 ${tool.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-poise-teal transition-colors">
                            {tool.title}
                          </h3>
                          <ChevronRight className="h-4 w-4 text-gray-800 dark:text-slate-200 group-hover:text-poise-teal transition-colors" />
                        </div>
                        <p className="text-sm text-gray-800 dark:text-slate-300 mt-1">
                          {tool.description}
                        </p>
                        <Badge variant="outline" className="mt-3 text-xs">
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
          <Card className="bg-gradient-to-r from-poise-gold/10 to-amber-500/10 border-poise-gold/30">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-poise-gold/20">
                    <TrendingUp className="h-6 w-6 text-poise-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Execution complete?</h3>
                    <p className="text-sm text-gray-800 dark:text-slate-300">
                      Capture lessons learned and improve for next time in ADVANCE
                    </p>
                  </div>
                </div>
                <Link href="/workspaces/advance">
                  <Button className="bg-poise-gold hover:bg-amber-500 text-poise-navy">
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
