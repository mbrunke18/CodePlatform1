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
import { SubBrandLabel } from "@/components/SubBrandLabel";

const workspaceTools = [
  {
    title: "Institutional Memory",
    description: "Capture and preserve organizational learnings from every execution",
    path: "/institutional-memory",
    icon: BookOpen,
    color: "text-[#2B8A6E]",
    bgColor: "bg-[#2B8A6E]/10",
    stats: "Knowledge base",
    featured: true
  },
  {
    title: "Decision Velocity",
    description: "Track and improve organizational decision-making speed",
    path: "/decision-velocity",
    icon: Activity,
    color: "text-[#0A0F2E]",
    bgColor: "bg-[#0A0F2E]/10",
    stats: "Performance metrics"
  },
  {
    title: "Executive Dashboard",
    description: "Strategic overview of organizational readiness and performance",
    path: "/executive-dashboard",
    icon: BarChart3,
    color: "text-[#C9A84C]",
    bgColor: "bg-[#C9A84C]/10",
    stats: "Executive view"
  },
  {
    title: "Executive Analytics",
    description: "Deep-dive analytics on playbook effectiveness and outcomes",
    path: "/analytics",
    icon: TrendingUp,
    color: "text-[#0A0F2E]",
    bgColor: "bg-[#0A0F2E]/10",
    stats: "Advanced insights"
  },
  {
    title: "AI Intelligence Hub",
    description: "AI-powered pattern recognition and improvement suggestions",
    path: "/ai",
    icon: Brain,
    color: "text-[#2B8A6E]",
    bgColor: "bg-[#2B8A6E]/10",
    stats: "AI recommendations"
  },
  {
    title: "Playbook Refinement",
    description: "Update playbooks based on lessons learned",
    path: "/living-playbooks",
    icon: RefreshCw,
    color: "text-[#2B8A6E]",
    bgColor: "bg-[#2B8A6E]/10",
    stats: "Continuous improvement"
  }
];

const learningMetrics = [
  { label: "Lessons Captured", value: "47", icon: Lightbulb, color: "text-[#2B8A6E]" },
  { label: "Playbooks Improved", value: "23", icon: RefreshCw, color: "text-[#0A0F2E]" },
  { label: "Decision Velocity", value: "+34%", icon: Activity, color: "text-[#C9A84C]" },
  { label: "Team Readiness", value: "92%", icon: Award, color: "text-[#0A0F2E]" }
];

export default function WorkspaceAdvance() {
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
            <span className="text-[#C9A84C] font-medium">ADVANCE</span>
          </nav>

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-[#2B8A6E] shadow-lg shadow-[#2B8A6E]/30">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Retrospect Lab</h1>
                  <Badge className="bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/30" style={{ background: "#2B8A6E", color: "white", padding: "4px 12px" }}>
                    <SubBrandLabel name="Retrospect™" />
                  </Badge>
                </div>
                <p className="text-[#6B7280] dark:text-white/60 mt-1">
                  Learn, improve, and strengthen organizational resilience
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/institutional-memory">
                <Button className="bg-[#0A0F2E] text-white hover:bg-[#141B45]">
                  <BookOpen className="h-4 w-4 mr-2" />
                  View Learnings
                </Button>
              </Link>
              <Link href="/executive-dashboard">
                <Button variant="outline" className="border-[#2B8A6E]/50 text-[#2B8A6E] hover:bg-[#2B8A6E]/10">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {/* IDEA Progress Tracker - Complete */}
          <Card className="mb-8 border-[#E8E4DC] dark:border-white/10 bg-white dark:bg-white/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#0A0F2E] dark:text-white">IDEA Framework Progress</h3>
                <span className="text-sm text-[#6B7280]">Phase 4 of 4 - Continuous Loop</span>
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
                  <Link href="/workspaces/execute">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#C9A84C]/10 hover:bg-[#C9A84C]/20 cursor-pointer transition-colors" style={{ border: "1px solid rgba(201, 168, 76, 0.2)" }}>
                      <Compass className="h-4 w-4 text-[#C9A84C]" />
                      <span className="text-sm text-[#C9A84C]">EXECUTE</span>
                    </div>
                  </Link>
                  <ArrowRight className="h-4 w-4 text-[#6B7280]" />
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#2B8A6E]/20 border-2 border-[#2B8A6E] shadow-sm shadow-[#2B8A6E]/20">
                    <TrendingUp className="h-4 w-4 text-[#2B8A6E]" />
                    <span className="text-sm font-bold text-[#2B8A6E]">ADVANCE</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {learningMetrics.map((metric) => (
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

          {/* Continuous Improvement Banner */}
          <Card className="mb-8 bg-white border border-[#E8E4DC] dark:bg-white/5 dark:border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-[#0A0F2E]/10 dark:bg-white/10">
                  <RefreshCw className="h-8 w-8 text-[#C9A84C]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Continuous Learning Loop</h3>
                  <p className="text-[#6B7280] dark:text-white/60">Every execution makes your playbooks smarter and your team faster</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Learnings */}
          <h2 className="text-xl font-bold text-[#0A0F2E] dark:text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Recent Learnings</h2>
          <div className="space-y-3 mb-8">
            <Card className="border-[#E8E4DC] dark:border-white/10 bg-white dark:bg-white/5 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-[#2B8A6E]/10">
                    <Lightbulb className="h-5 w-5 text-[#2B8A6E] dark:text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="font-semibold text-[#0A0F2E] dark:text-white">5-tier stakeholder hierarchy reduced notification fatigue by 41%</h4>
                      <Badge className="bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/30">Pattern</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-[#6B7280] dark:text-white/60">Confidence: 89%</span>
                      <Progress value={89} className="w-24 h-1.5" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-[#E8E4DC] dark:border-white/10 bg-white dark:bg-white/5 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-[#2B8A6E]/10">
                    <Brain className="h-5 w-5 text-[#2B8A6E]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="font-semibold text-[#0A0F2E] dark:text-white">Auto-isolation rules cut cyber incident damage by 78%</h4>
                      <Badge className="bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/30">Automation</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-[#6B7280] dark:text-white/60">Confidence: 96%</span>
                      <Progress value={96} className="w-24 h-1.5" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-[#E8E4DC] dark:border-white/10 bg-white dark:bg-white/5 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-[#C9A84C]/10">
                    <BarChart3 className="h-5 w-5 text-[#C9A84C]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="font-semibold text-[#0A0F2E] dark:text-white">Pre-approved budget thresholds accelerate response by 34%</h4>
                      <Badge className="bg-[#C9A84C]/20 text-[#C9A84C] border-[#C9A84C]/30">Financial</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-[#6B7280] dark:text-white/60">Confidence: 87%</span>
                      <Progress value={87} className="w-24 h-1.5" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Workspace Tools Grid */}
          <h2 className="text-xl font-bold text-[#0A0F2E] dark:text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>ADVANCE Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {workspaceTools.map((tool) => (
              <Link key={tool.path + tool.title} href={tool.path}>
                <Card className={`border-[#E8E4DC] dark:border-white/10 bg-white dark:bg-white/5 h-full hover:shadow-lg transition-all cursor-pointer group ${tool.featured ? 'border-2 border-[#C9A84C]/50' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${tool.bgColor}`}>
                        <tool.icon className={`h-6 w-6 ${tool.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-[#0A0F2E] dark:text-white group-hover:text-[#C9A84C] transition-colors">
                            {tool.title}
                          </h3>
                          <ChevronRight className="h-4 w-4 text-[#6B7280] dark:text-white/40 group-hover:text-[#C9A84C] transition-colors" />
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

          {/* Back to Start CTA */}
          <Card className="bg-[#0A0F2E] border-[#C9A84C]/30">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-white/10">
                    <ClipboardList className="h-6 w-6 text-[#C9A84C]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Ready to apply learnings?</h3>
                    <p className="text-sm text-white/60">
                      Update your playbooks with new insights and start the cycle again
                    </p>
                  </div>
                </div>
                <Link href="/workspaces/identify">
                  <Button className="bg-[#2B8A6E] text-white font-bold hover:bg-[#3BAF8A]">
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
