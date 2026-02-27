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
import { SubBrandLabel } from "@/components/SubBrandLabel";

const workspaceTools = [
  {
    title: "Signal Intelligence Hub",
    description: "Centralized view of all incoming signals and intelligence feeds",
    path: "/signal-intelligence",
    icon: Radio,
    color: "text-[#0A0F2E]",
    bgColor: "bg-[#0A0F2E]/10",
    stats: "Real-time monitoring",
    featured: true
  },
  {
    title: "AI Trigger Monitoring",
    description: "Configure and manage automated trigger detection rules",
    path: "/triggers-management",
    icon: Target,
    color: "text-[#C9A84C]",
    bgColor: "bg-[#C9A84C]/10",
    stats: "AI-powered"
  },
  {
    title: "AI Radar Dashboard",
    description: "360° view of emerging threats and opportunities",
    path: "/ai-radar",
    icon: Radar,
    color: "text-[#0A0F2E]",
    bgColor: "bg-[#0A0F2E]/10",
    stats: "Predictive insights"
  },
  {
    title: "Weak Signal Detection",
    description: "Identify early warning indicators before they escalate",
    path: "/pulse-intelligence",
    icon: Activity,
    color: "text-[#C9A84C]",
    bgColor: "bg-[#C9A84C]/10",
    stats: "Early warning"
  },
  {
    title: "Foresight Radar",
    description: "Long-range strategic scanning and trend analysis",
    path: "/foresight-radar",
    icon: Eye,
    color: "text-[#0A0F2E]",
    bgColor: "bg-[#0A0F2E]/10",
    stats: "Strategic foresight"
  },
  {
    title: "Alert Configuration",
    description: "Set up notifications and escalation workflows",
    path: "/triggers-management",
    icon: Bell,
    color: "text-[#0A0F2E]",
    bgColor: "bg-[#0A0F2E]/10",
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
      <div className="min-h-screen bg-[#F8F7F4] dark:bg-[#0A0F2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link href="/mission-control">
              <span className="text-[#0A0F2E] dark:text-white/60 hover:text-[#C9A84C] cursor-pointer">Execution OS One™</span>
            </Link>
            <ChevronRight className="h-4 w-4 text-[#0A0F2E] dark:text-white/40" />
            <span className="text-[#0A0F2E] dark:text-[#C9A84C] font-medium">DETECT</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-[#0A0F2E] shadow-lg shadow-[#0A0F2E]/30">
                <Radar className="h-8 w-8 text-[#C9A84C]" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Signal Ops</h1>
                  <Badge className="bg-[#0A0F2E] text-[#C9A84C] border-[#C9A84C]/20 px-3 py-1">
                    DETECT
                  </Badge>
                </div>
                <p className="text-[#6B7280] dark:text-white/60 mt-1">
                  Monitor, detect, and analyze strategic signals in real-time
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/signal-intelligence">
                <Button className="bg-[#0A0F2E] text-white hover:bg-[#141B45]">
                  <Radio className="h-4 w-4 mr-2" />
                  View Signals
                </Button>
              </Link>
              <Link href="/triggers-management">
                <Button variant="outline" className="border-[#0A0F2E]/20 text-[#0A0F2E] hover:bg-[#0A0F2E]/5 dark:text-white dark:border-white/20">
                  <Target className="h-4 w-4 mr-2" />
                  Configure Triggers
                </Button>
              </Link>
            </div>
          </div>

          {/* IDEA Progress Tracker */}
          <Card className="mb-8 border-[#E8E4DC] dark:border-white/10 bg-white dark:bg-white/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#0A0F2E] dark:text-white">IDEA Framework Progress</h3>
                <span className="text-sm text-[#6B7280]">Phase 2 of 4</span>
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
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0A0F2E] border-2 border-[#0A0F2E] shadow-sm shadow-[#0A0F2E]/20">
                    <Radar className="h-4 w-4 text-[#C9A84C]" />
                    <span className="text-sm font-bold text-white uppercase tracking-wider">DETECT</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#6B7280]" />
                  <Link href="/workspaces/execute">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#C9A84C]/10 hover:bg-[#C9A84C]/20 cursor-pointer transition-colors" style={{ border: "1px solid rgba(201, 168, 76, 0.2)" }}>
                      <span className="text-sm text-[#C9A84C] font-medium">EXECUTE</span>
                    </div>
                  </Link>
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

          {/* Signal Status Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {signalCategories.map((category) => (
              <Card key={category.name} className="border-[#E8E4DC] dark:border-white/10 bg-white dark:bg-white/5 hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <category.icon className="h-5 w-5 text-[#0A0F2E] dark:text-[#C9A84C]" />
                    <Badge variant={category.status === 'warning' ? 'destructive' : 'secondary'} className="text-xs">
                      {category.status}
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{category.count}</p>
                  <p className="text-xs text-[#6B7280]">{category.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Live Signal Feed */}
          <h2 className="text-xl font-bold text-[#0A0F2E] dark:text-white mb-4 flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0A0F2E] dark:bg-[#C9A84C] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0A0F2E] dark:bg-[#C9A84C]"></span>
            </span>
            Live Signal Feed
          </h2>
          <div className="space-y-3 mb-8">
            <Card className="border-[#E8E4DC] dark:border-white/10 bg-white dark:bg-white/5 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <span className="flex h-3 w-3 rounded-full bg-[#2B8A6E] flex-shrink-0" title="Medium severity" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[#0A0F2E] dark:text-white">Competitor patent filing detected</h4>
                    <p className="text-sm text-[#6B7280] dark:text-white/60 mt-0.5">TechCorp filed 3 new AI patents</p>
                  </div>
                  <Badge className="bg-[#2B8A6E] text-white border-none flex-shrink-0">Medium</Badge>
                  <span className="text-xs text-[#6B7280] whitespace-nowrap">14 min ago</span>
                </div>
              </CardContent>
            </Card>
            <Card className="border-[#E8E4DC] dark:border-white/10 bg-white dark:bg-white/5 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <span className="flex h-3 w-3 rounded-full bg-red-600 flex-shrink-0" title="High severity" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[#0A0F2E] dark:text-white">Regulatory alert</h4>
                    <p className="text-sm text-[#6B7280] dark:text-white/60 mt-0.5">SEC proposed new AI disclosure requirements</p>
                  </div>
                  <Badge className="bg-red-600 text-white border-none flex-shrink-0">High</Badge>
                  <span className="text-xs text-[#6B7280] whitespace-nowrap">2 hours ago</span>
                </div>
              </CardContent>
            </Card>
            <Card className="border-[#E8E4DC] dark:border-white/10 bg-white dark:bg-white/5 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <span className="flex h-3 w-3 rounded-full bg-[#2B8A6E] flex-shrink-0" title="Low severity" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[#0A0F2E] dark:text-white">Market shift</h4>
                    <p className="text-sm text-[#6B7280] dark:text-white/60 mt-0.5">APAC semiconductor demand up 23% QoQ</p>
                  </div>
                  <Badge className="bg-[#2B8A6E] text-white border-none flex-shrink-0">Low</Badge>
                  <span className="text-xs text-[#6B7280] whitespace-nowrap">4 hours ago</span>
                </div>
              </CardContent>
            </Card>
            <Card className="border-[#E8E4DC] dark:border-white/10 bg-white dark:bg-white/5 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <span className="flex h-3 w-3 rounded-full bg-[#2B8A6E] flex-shrink-0" title="Medium severity" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[#0A0F2E] dark:text-white">Social sentiment spike</h4>
                    <p className="text-sm text-[#6B7280] dark:text-white/60 mt-0.5">Brand mentions up 340% on Twitter/X</p>
                  </div>
                  <Badge className="bg-[#2B8A6E] text-white border-none flex-shrink-0">Medium</Badge>
                  <span className="text-xs text-[#6B7280] whitespace-nowrap">6 hours ago</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Workspace Tools Grid */}
          <h2 className="text-xl font-bold text-[#0A0F2E] dark:text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>DETECT Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {workspaceTools.map((tool) => (
              <Link key={tool.path + tool.title} href={tool.path}>
                <Card className={`border-[#E8E4DC] dark:border-white/10 bg-white dark:bg-white/5 h-full hover:shadow-lg transition-all cursor-pointer group ${tool.featured ? 'border-2 border-[#0A0F2E]/50' : ''}`}>
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
                        <Badge variant="outline" className="mt-3 text-xs border-[#E8E4DC] dark:border-white/10 text-[#6B7280] dark:text-[#C9A84C]">
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
                    <Zap className="h-6 w-6 text-[#C9A84C]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Trigger detected?</h3>
                    <p className="text-sm text-white/60">
                      When a trigger fires, move to EXECUTE for coordinated response
                    </p>
                  </div>
                </div>
                <Link href="/workspaces/execute">
                  <Button className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178]">
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
