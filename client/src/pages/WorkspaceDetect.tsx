import { Link } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Radar, 
  Radio,
  Target, 
  Eye,
  Bell,
  ChevronRight, 
  Sparkles,
  AlertTriangle,
  Activity,
  ArrowRight,
  ClipboardList,
  TrendingUp,
  Zap,
  Brain
} from 'lucide-react';

const workspaceTools = [
  {
    title: "Signal Intelligence Hub",
    description: "Centralized view of all incoming signals and intelligence feeds",
    path: "/signal-intelligence",
    icon: Radio,
    color: "text-poise-teal",
    bgColor: "bg-poise-teal/10",
    stats: "Real-time monitoring",
    featured: true
  },
  {
    title: "AI Trigger Monitoring",
    description: "Configure and manage automated trigger detection rules",
    path: "/triggers-management",
    icon: Target,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    stats: "AI-powered"
  },
  {
    title: "AI Radar Dashboard",
    description: "360° view of emerging threats and opportunities",
    path: "/ai-radar",
    icon: Radar,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    stats: "Predictive insights"
  },
  {
    title: "Weak Signal Detection",
    description: "Identify early warning indicators before they escalate",
    path: "/pulse-intelligence",
    icon: Activity,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    stats: "Early warning"
  },
  {
    title: "Foresight Radar",
    description: "Long-range strategic scanning and trend analysis",
    path: "/foresight-radar",
    icon: Eye,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    stats: "Strategic foresight"
  },
  {
    title: "Alert Configuration",
    description: "Set up notifications and escalation workflows",
    path: "/triggers-management",
    icon: Bell,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    stats: "Instant alerts"
  }
];

const signalCategories = [
  { name: "Market Signals", count: 12, status: "healthy", icon: TrendingUp },
  { name: "Competitive Intel", count: 8, status: "warning", icon: Eye },
  { name: "Regulatory Changes", count: 3, status: "healthy", icon: AlertTriangle },
  { name: "Technology Shifts", count: 5, status: "healthy", icon: Zap }
];

export default function WorkspaceDetect() {
  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50/30 dark:from-poise-navy dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link href="/mission-control">
              <span className="text-gray-600 hover:text-poise-teal cursor-pointer">Execution OS One™</span>
            </Link>
            <ChevronRight className="h-4 w-4 text-slate-600 dark:text-slate-200" />
            <span className="text-poise-teal font-medium">DETECT</span>
          </nav>

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-poise-teal to-cyan-500 shadow-lg shadow-poise-teal/30">
                <Radar className="h-8 w-8 text-gray-900" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Signal Ops</h1>
                  <Badge className="bg-poise-teal/20 text-poise-teal border-poise-teal/30">
                    Execution OS Signal™
                  </Badge>
                </div>
                <p className="text-gray-600 dark:text-slate-300 mt-1">
                  Monitor, detect, and analyze strategic signals in real-time
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/signal-intelligence">
                <Button className="bg-poise-teal hover:bg-cyan-600 text-gray-900">
                  <Radio className="h-4 w-4 mr-2" />
                  View Signals
                </Button>
              </Link>
              <Link href="/triggers-management">
                <Button variant="outline" className="border-poise-teal/50 text-poise-teal hover:bg-poise-teal/10">
                  <Target className="h-4 w-4 mr-2" />
                  Configure Triggers
                </Button>
              </Link>
            </div>
          </div>

          {/* IDEA Progress Tracker */}
          <Card className="mb-8 border-poise-teal/30 bg-gradient-to-r from-poise-teal/5 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">IDEA Framework Progress</h3>
                <span className="text-sm text-gray-600">Phase 2 of 4</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 flex items-center gap-2">
                  <Link href="/workspaces/identify">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-poise-gold/10 hover:bg-poise-gold/20 cursor-pointer transition-colors">
                      <ClipboardList className="h-4 w-4 text-poise-gold" />
                      <span className="text-sm text-poise-gold">IDENTIFY</span>
                    </div>
                  </Link>
                  <ArrowRight className="h-4 w-4 text-gray-600" />
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-poise-teal/20 border-2 border-poise-teal">
                    <Radar className="h-4 w-4 text-poise-teal" />
                    <span className="text-sm font-medium text-poise-teal">DETECT</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-600" />
                  <Link href="/workspaces/execute">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-poise-teal/10 cursor-pointer transition-colors">
                      <span className="text-sm text-gray-600">EXECUTE</span>
                    </div>
                  </Link>
                  <ArrowRight className="h-4 w-4 text-gray-600" />
                  <Link href="/workspaces/advance">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-poise-gold/10 cursor-pointer transition-colors">
                      <span className="text-sm text-gray-600">ADVANCE</span>
                    </div>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Signal Status Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {signalCategories.map((category) => (
              <Card key={category.name} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <category.icon className="h-5 w-5 text-poise-teal" />
                    <Badge variant={category.status === 'warning' ? 'destructive' : 'secondary'} className="text-xs">
                      {category.status}
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{category.count}</p>
                  <p className="text-xs text-gray-600">{category.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Live Signal Feed */}
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-poise-teal opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-poise-teal"></span>
            </span>
            Live Signal Feed
          </h2>
          <div className="space-y-3 mb-8">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <span className="flex h-3 w-3 rounded-full bg-amber-500 flex-shrink-0" title="Medium severity" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 dark:text-white">Competitor patent filing detected</h4>
                    <p className="text-sm text-gray-600 dark:text-slate-300 mt-0.5">TechCorp filed 3 new AI patents</p>
                  </div>
                  <Badge variant="outline" className="text-amber-500 border-amber-500/30 flex-shrink-0">Medium</Badge>
                  <span className="text-xs text-gray-600 dark:text-slate-500 whitespace-nowrap">14 min ago</span>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <span className="flex h-3 w-3 rounded-full bg-red-500 flex-shrink-0" title="High severity" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 dark:text-white">Regulatory alert</h4>
                    <p className="text-sm text-gray-600 dark:text-slate-300 mt-0.5">SEC proposed new AI disclosure requirements</p>
                  </div>
                  <Badge variant="outline" className="text-red-500 border-red-500/30 flex-shrink-0">High</Badge>
                  <span className="text-xs text-gray-600 dark:text-slate-500 whitespace-nowrap">2 hours ago</span>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <span className="flex h-3 w-3 rounded-full bg-emerald-500 flex-shrink-0" title="Low severity" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 dark:text-white">Market shift</h4>
                    <p className="text-sm text-gray-600 dark:text-slate-300 mt-0.5">APAC semiconductor demand up 23% QoQ</p>
                  </div>
                  <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 flex-shrink-0">Low</Badge>
                  <span className="text-xs text-gray-600 dark:text-slate-500 whitespace-nowrap">4 hours ago</span>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <span className="flex h-3 w-3 rounded-full bg-amber-500 flex-shrink-0" title="Medium severity" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 dark:text-white">Social sentiment spike</h4>
                    <p className="text-sm text-gray-600 dark:text-slate-300 mt-0.5">Brand mentions up 340% on Twitter/X</p>
                  </div>
                  <Badge variant="outline" className="text-amber-500 border-amber-500/30 flex-shrink-0">Medium</Badge>
                  <span className="text-xs text-gray-600 dark:text-slate-500 whitespace-nowrap">6 hours ago</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Workspace Tools Grid */}
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">DETECT Tools</h2>
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
                          <ChevronRight className="h-4 w-4 text-slate-600 dark:text-slate-200 group-hover:text-poise-teal transition-colors" />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-slate-300 mt-1">
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
          <Card className="bg-gradient-to-r from-poise-teal/10 to-cyan-500/10 border-poise-teal/30">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-poise-teal/20">
                    <Zap className="h-6 w-6 text-poise-teal" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Trigger detected?</h3>
                    <p className="text-sm text-gray-600 dark:text-slate-300">
                      When a trigger fires, move to EXECUTE for coordinated response
                    </p>
                  </div>
                </div>
                <Link href="/workspaces/execute">
                  <Button className="bg-poise-teal hover:bg-cyan-600 text-gray-900">
                    Go to EXECUTE
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
