import { Link } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ClipboardList, 
  BookOpen, 
  Target, 
  FileText, 
  ChevronRight, 
  Sparkles,
  CheckCircle,
  Clock,
  Users,
  ArrowRight,
  Lightbulb,
  Shield,
  Rocket,
  Globe,
  Radar,
  Compass,
  TrendingUp
} from 'lucide-react';
import { SubBrandLabel } from "@/components/SubBrandLabel";

const workspaceTools = [
  {
    title: "Playbook Library",
    description: "Browse and select from 170 pre-built strategic playbooks across 9 domains",
    path: "/playbooks",
    icon: BookOpen,
    color: "text-[#C9A84C]",
    bgColor: "bg-[#C9A84C]/10",
    stats: "170 playbooks",
    featured: true
  },
  {
    title: "Scenario Planning Hub",
    description: "Design strategic scenarios and map potential trigger conditions",
    path: "/strategic",
    icon: Target,
    color: "text-[#2B8A6E]",
    bgColor: "bg-[#2B8A6E]/10",
    stats: "Strategic planning"
  },
  {
    title: "What-If Analyzer",
    description: "Model different scenarios and their potential outcomes",
    path: "/what-if-analyzer",
    icon: Lightbulb,
    color: "text-[#C9A84C]",
    bgColor: "bg-[#C9A84C]/10",
    stats: "Predictive modeling"
  },
  {
    title: "Board Briefings",
    description: "Generate executive-ready presentations and board materials",
    path: "/board-briefings",
    icon: FileText,
    color: "text-[#0A0F2E]",
    bgColor: "bg-[#0A0F2E]/10",
    stats: "Executive reports"
  },
  {
    title: "Playbook Customization",
    description: "Tailor playbooks to your organization's specific needs",
    path: "/playbook-customization",
    icon: ClipboardList,
    color: "text-[#2B8A6E]",
    bgColor: "bg-[#2B8A6E]/10",
    stats: "Personalization"
  },
  {
    title: "Preparedness Report",
    description: "Assess your organization's strategic readiness score",
    path: "/preparedness-report",
    icon: Shield,
    color: "text-[#0A0F2E]",
    bgColor: "bg-[#0A0F2E]/10",
    stats: "Readiness scoring"
  }
];

const domainCategories = [
  { name: "OFFENSE", domains: ["Market Entry", "M&A", "Product Launch"], count: 58, color: "text-[#2B8A6E]", icon: Rocket },
  { name: "DEFENSE", domains: ["Crisis", "Cyber", "Regulatory"], count: 58, color: "text-[#0A0F2E]", icon: Shield },
  { name: "SPECIAL TEAMS", domains: ["Digital Transformation", "Competitive Response", "AI Governance"], count: 54, color: "text-[#C9A84C]", icon: Globe }
];

export default function WorkspaceIdentify() {
  return (
    <PageLayout>
      <div className="min-h-screen bg-[#F8F7F4] dark:bg-[#0A0F2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link href="/mission-control">
              <span className="text-[#0A0F2E] dark:text-[#C9A84C]/60 hover:text-[#C9A84C] cursor-pointer">Execution OS One™</span>
            </Link>
            <ChevronRight className="h-4 w-4 text-[#0A0F2E] dark:text-[#C9A84C]/40" />
            <span className="text-[#2B8A6E] font-bold uppercase tracking-wider">IDENTIFY</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-[#2B8A6E] shadow-lg shadow-[#2B8A6E]/30">
                <ClipboardList className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Playbook Factory</h1>
                  <Badge className="bg-[#2B8A6E] text-white border-none px-3 py-1 font-bold uppercase tracking-wider">
                    IDENTIFY
                  </Badge>
                </div>
                <p className="text-[#6B7280] dark:text-[#C9A84C]/60 mt-1">
                  Build, customize, and manage strategic playbooks for every scenario
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/playbooks">
                <Button className="bg-[#0A0F2E] text-white hover:bg-[#141B45]">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Library
                </Button>
              </Link>
              <Link href="/playbook-customize/new">
                <Button variant="outline" className="border-[#0A0F2E]/20 text-[#0A0F2E] hover:bg-[#0A0F2E]/5 dark:text-white dark:border-[#C9A84C]/20">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Create New
                </Button>
              </Link>
            </div>
          </div>

          {/* IDEA Progress Tracker */}
          <Card className="mb-8 border-[#E8E4DC] dark:border-[#C9A84C]/10 bg-white dark:bg-white/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#0A0F2E] dark:text-white">IDEA Framework Progress</h3>
                <span className="text-sm text-[#6B7280] dark:text-[#C9A84C]/60">Phase 1 of 4</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#2B8A6E]/10 border-2 border-[#2B8A6E] shadow-sm shadow-[#2B8A6E]/20">
                    <ClipboardList className="h-4 w-4 text-[#2B8A6E]" />
                    <span className="text-sm font-bold text-[#2B8A6E] uppercase tracking-wider">IDENTIFY</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#6B7280] dark:text-[#C9A84C]/40" />
                  <Link href="/workspaces/detect">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0A0F2E]/10 hover:bg-[#0A0F2E]/20 cursor-pointer transition-colors" style={{ border: "1px solid rgba(10, 15, 46, 0.2)" }}>
                      <Radar className="h-4 w-4 text-[#0A0F2E]" />
                      <span className="text-sm text-[#0A0F2E] font-medium">DETECT</span>
                    </div>
                  </Link>
                  <ArrowRight className="h-4 w-4 text-[#6B7280] dark:text-[#C9A84C]/40" />
                  <Link href="/workspaces/execute">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#C9A84C]/10 hover:bg-[#C9A84C]/20 cursor-pointer transition-colors" style={{ border: "1px solid rgba(201, 168, 76, 0.2)" }}>
                      <Compass className="h-4 w-4 text-[#C9A84C]" />
                      <span className="text-sm text-[#0A0F2E]">EXECUTE</span>
                    </div>
                  </Link>
                  <ArrowRight className="h-4 w-4 text-[#6B7280] dark:text-[#C9A84C]/40" />
                  <Link href="/workspaces/advance">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#2B8A6E]/10 hover:bg-[#2B8A6E]/20 cursor-pointer transition-colors" style={{ border: "1px solid rgba(43, 138, 110, 0.2)" }}>
                      <TrendingUp className="h-4 w-4 text-[#2B8A6E]" />
                      <span className="text-sm text-[#2B8A6E]">ADVANCE</span>
                    </div>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Strategic Triad Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {domainCategories.map((category) => (
              <Card key={category.name} className="border-[#E8E4DC] dark:border-[#C9A84C]/10 bg-white dark:bg-white/5 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <category.icon className={`h-6 w-6 ${category.color}`} />
                      <h3 className="font-bold text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{category.name}</h3>
                    </div>
                    <Badge variant="secondary" className="bg-[#E8E4DC] dark:bg-[#C9A84C]/10 text-[#0A0F2E] dark:text-[#C9A84C]">{category.count} playbooks</Badge>
                  </div>
                  <div className="space-y-1">
                    {category.domains.map((domain) => (
                      <p key={domain} className="text-sm text-[#6B7280] dark:text-[#C9A84C]/60">• {domain}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

            <CardHeader>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Recent Playbook Activity</h2>
                <Badge className="bg-[#2B8A6E]/10 text-[#2B8A6E] border-none text-xs">IDENTIFY</Badge>
              </div>
            </CardHeader>
          <div className="space-y-3 mb-8">
            <Card className="border-[#E8E4DC] dark:border-[#C9A84C]/10 bg-white dark:bg-white/5 hover:shadow-md transition-shadow border-l-4 border-l-[#2B8A6E]">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-[#2B8A6E]/10">
                    <BookOpen className="h-5 w-5 text-[#2B8A6E]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-[#0A0F2E] dark:text-white">M&A Integration Playbook #12</h4>
                      <Badge className="bg-[#2B8A6E] text-white border-none">Active</Badge>
                    </div>
                    <p className="text-sm text-[#6B7280] dark:text-[#C9A84C]/60 mt-0.5">Updated 2 hours ago by Sarah Chen</p>
                  </div>
                  <Clock className="h-4 w-4 text-[#6B7280] dark:text-[#C9A84C]/40 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-[#E8E4DC] dark:border-[#C9A84C]/10 bg-white dark:bg-white/5 hover:shadow-md transition-shadow border-l-4 border-l-[#0A0F2E]">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-red-600/10">
                    <Shield className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-[#0A0F2E] dark:text-white">Crisis Response Playbook #31</h4>
                      <Badge className="bg-red-600 text-white border-none">Triggered</Badge>
                    </div>
                    <p className="text-sm text-[#6B7280] dark:text-[#C9A84C]/60 mt-0.5">Activated Feb 3 via automated trigger</p>
                  </div>
                  <Clock className="h-4 w-4 text-[#6B7280] dark:text-[#C9A84C]/40 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-[#E8E4DC] dark:border-[#C9A84C]/10 bg-white dark:bg-white/5 hover:shadow-md transition-shadow border-l-4 border-l-[#C9A84C]">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-[#C9A84C]/10">
                    <Rocket className="h-5 w-5 text-[#C9A84C]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-[#0A0F2E] dark:text-white">Product Launch Playbook #45</h4>
                      <Badge className="bg-[#C9A84C] text-[#0A0F2E] border-none font-bold">In Review</Badge>
                    </div>
                    <p className="text-sm text-[#6B7280] dark:text-[#C9A84C]/60 mt-0.5">Draft review pending from 3 stakeholders</p>
                  </div>
                  <Users className="h-4 w-4 text-[#6B7280] dark:text-[#C9A84C]/40 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Workspace Tools Grid */}
          <h2 className="text-xl font-bold text-[#0A0F2E] dark:text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>IDENTIFY Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {workspaceTools.map((tool) => (
              <Link key={tool.path} href={tool.path}>
                <Card className={`border-[#E8E4DC] dark:border-[#C9A84C]/10 bg-white dark:bg-white/5 h-full hover:shadow-lg transition-all cursor-pointer group ${tool.featured ? 'border-2 border-[#C9A84C]/50' : ''}`}>
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
                          <ChevronRight className="h-4 w-4 text-[#6B7280] dark:text-[#C9A84C]/40 group-hover:text-[#C9A84C] transition-colors" />
                        </div>
                        <p className="text-sm text-[#6B7280] dark:text-[#C9A84C]/60 mt-1">
                          {tool.description}
                        </p>
                        <Badge variant="outline" className="mt-3 text-xs border-[#E8E4DC] dark:border-[#C9A84C]/10 text-[#6B7280] dark:text-[#C9A84C]">
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
                    <Target className="h-6 w-6 text-[#C9A84C]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Ready for the next phase?</h3>
                    <p className="text-sm text-white/60">
                      Once your playbooks are ready, set up signal monitoring in DETECT
                    </p>
                  </div>
                </div>
                <Link href="/workspaces/detect">
                  <Button className="bg-[#0A0F2E] text-white font-bold hover:bg-[#141B45] border border-white/20">
                    Go to DETECT
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
