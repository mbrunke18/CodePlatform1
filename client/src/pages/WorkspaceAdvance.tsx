import { Link } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  BookOpen,
  BarChart3, 
  Brain,
  Lightbulb,
  ChevronRight, 
  Target,
  Activity,
  ArrowRight,
  ClipboardList,
  Radar,
  Compass,
  RefreshCw,
  Award,
  FileText
} from 'lucide-react';

const workspaceTools = [
  {
    title: "Institutional Memory",
    description: "Capture and preserve organizational learnings from every execution",
    path: "/institutional-memory",
    icon: BookOpen,
    color: "text-poise-gold",
    bgColor: "bg-poise-gold/10",
    stats: "Knowledge base",
    featured: true
  },
  {
    title: "Decision Velocity",
    description: "Track and improve organizational decision-making speed",
    path: "/decision-velocity",
    icon: Activity,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    stats: "Performance metrics"
  },
  {
    title: "Executive Dashboard",
    description: "Strategic overview of organizational readiness and performance",
    path: "/executive-dashboard",
    icon: BarChart3,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    stats: "Executive view"
  },
  {
    title: "Executive Analytics",
    description: "Deep-dive analytics on playbook effectiveness and outcomes",
    path: "/analytics",
    icon: TrendingUp,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    stats: "Advanced insights"
  },
  {
    title: "AI Intelligence Hub",
    description: "AI-powered pattern recognition and improvement suggestions",
    path: "/ai",
    icon: Brain,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    stats: "AI recommendations"
  },
  {
    title: "Playbook Refinement",
    description: "Update playbooks based on lessons learned",
    path: "/living-playbooks",
    icon: RefreshCw,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    stats: "Continuous improvement"
  }
];

const learningMetrics = [
  { label: "Lessons Captured", value: "47", icon: Lightbulb, color: "text-poise-gold" },
  { label: "Playbooks Improved", value: "23", icon: RefreshCw, color: "text-blue-500" },
  { label: "Decision Velocity", value: "+34%", icon: Activity, color: "text-emerald-500" },
  { label: "Team Readiness", value: "92%", icon: Award, color: "text-purple-500" }
];

export default function WorkspaceAdvance() {
  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50/30 dark:from-poise-navy dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link href="/mission-control">
              <span className="text-slate-300 hover:text-poise-gold cursor-pointer">Execution OS One™</span>
            </Link>
            <ChevronRight className="h-4 w-4 text-slate-600 dark:text-slate-200" />
            <span className="text-poise-gold font-medium">ADVANCE</span>
          </nav>

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-poise-gold to-amber-500 shadow-lg shadow-poise-gold/30">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Retrospect Lab</h1>
                  <Badge className="bg-poise-gold/20 text-poise-gold border-poise-gold/30">
                    Execution OS Retrospect™
                  </Badge>
                </div>
                <p className="text-gray-600 dark:text-slate-300 mt-1">
                  Learn, improve, and strengthen organizational resilience
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/institutional-memory">
                <Button className="bg-poise-gold hover:bg-amber-500 text-poise-navy">
                  <BookOpen className="h-4 w-4 mr-2" />
                  View Learnings
                </Button>
              </Link>
              <Link href="/executive-dashboard">
                <Button variant="outline" className="border-poise-gold/50 text-poise-gold hover:bg-poise-gold/10">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {/* IDEA Progress Tracker - Complete */}
          <Card className="mb-8 border-poise-gold/30 bg-gradient-to-r from-poise-gold/5 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">IDEA Framework Progress</h3>
                <span className="text-sm text-slate-300">Phase 4 of 4 - Continuous Loop</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 flex items-center gap-2">
                  <Link href="/workspaces/identify">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-poise-gold/10 hover:bg-poise-gold/20 cursor-pointer transition-colors">
                      <ClipboardList className="h-4 w-4 text-poise-gold" />
                      <span className="text-sm text-poise-gold">IDENTIFY</span>
                    </div>
                  </Link>
                  <ArrowRight className="h-4 w-4 text-slate-300" />
                  <Link href="/workspaces/detect">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-poise-teal/10 hover:bg-poise-teal/20 cursor-pointer transition-colors">
                      <Radar className="h-4 w-4 text-poise-teal" />
                      <span className="text-sm text-poise-teal">DETECT</span>
                    </div>
                  </Link>
                  <ArrowRight className="h-4 w-4 text-slate-300" />
                  <Link href="/workspaces/execute">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-poise-teal/10 hover:bg-poise-teal/20 cursor-pointer transition-colors">
                      <Compass className="h-4 w-4 text-poise-teal" />
                      <span className="text-sm text-poise-teal">EXECUTE</span>
                    </div>
                  </Link>
                  <ArrowRight className="h-4 w-4 text-slate-300" />
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-poise-gold/20 border-2 border-poise-gold">
                    <TrendingUp className="h-4 w-4 text-poise-gold" />
                    <span className="text-sm font-medium text-poise-gold">ADVANCE</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {learningMetrics.map((metric) => (
              <Card key={metric.label} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <metric.icon className={`h-5 w-5 ${metric.color}`} />
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{metric.value}</p>
                  <p className="text-xs text-slate-300">{metric.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Continuous Improvement Banner */}
          <Card className="mb-8 bg-gradient-to-r from-poise-navytext-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-white/10">
                  <RefreshCw className="h-8 w-8 text-poise-gold" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Continuous Learning Loop</h3>
                  <p className="text-slate-300">Every execution makes your playbooks smarter and your team faster</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Learnings */}
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Recent Learnings</h2>
          <div className="space-y-3 mb-8">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Lightbulb className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="font-semibold text-slate-900 dark:text-white">5-tier stakeholder hierarchy reduced notification fatigue by 41%</h4>
                      <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30">Pattern</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 dark:text-slate-300">Confidence: 89%</span>
                      <Progress value={89} className="w-24 h-1.5" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <Brain className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="font-semibold text-slate-900 dark:text-white">Auto-isolation rules cut cyber incident damage by 78%</h4>
                      <Badge className="bg-emerald-500/20 text-emerald-600 border-emerald-500/30">Automation</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 dark:text-slate-300">Confidence: 96%</span>
                      <Progress value={96} className="w-24 h-1.5" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-poise-gold/10">
                    <BarChart3 className="h-5 w-5 text-poise-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="font-semibold text-slate-900 dark:text-white">Pre-approved budget thresholds accelerate response by 34%</h4>
                      <Badge className="bg-poise-gold/20 text-poise-gold border-poise-gold/30">Financial</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 dark:text-slate-300">Confidence: 87%</span>
                      <Progress value={87} className="w-24 h-1.5" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Workspace Tools Grid */}
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">ADVANCE Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {workspaceTools.map((tool) => (
              <Link key={tool.path + tool.title} href={tool.path}>
                <Card className={`h-full hover:shadow-lg transition-all cursor-pointer group ${tool.featured ? 'border-2 border-poise-gold/50' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${tool.bgColor}`}>
                        <tool.icon className={`h-6 w-6 ${tool.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-poise-gold transition-colors">
                            {tool.title}
                          </h3>
                          <ChevronRight className="h-4 w-4 text-slate-600 dark:text-slate-200 group-hover:text-poise-gold transition-colors" />
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

          {/* Back to Start CTA */}
          <Card className="bg-gradient-to-r from-poise-gold/10 to-amber-500/10 border-poise-gold/30">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-poise-gold/20">
                    <ClipboardList className="h-6 w-6 text-poise-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Ready to apply learnings?</h3>
                    <p className="text-sm text-gray-600 dark:text-slate-300">
                      Update your playbooks with new insights and start the cycle again
                    </p>
                  </div>
                </div>
                <Link href="/workspaces/identify">
                  <Button className="bg-poise-gold hover:bg-amber-500 text-poise-navy">
                    Back to IDENTIFY
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
