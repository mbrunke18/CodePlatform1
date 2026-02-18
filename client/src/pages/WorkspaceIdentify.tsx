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
  Globe
} from 'lucide-react';

const workspaceTools = [
  {
    title: "Playbook Library",
    description: "Browse and select from 166 pre-built strategic playbooks across 9 domains",
    path: "/playbooks",
    icon: BookOpen,
    color: "text-poise-gold",
    bgColor: "bg-poise-gold/10",
    stats: "166 playbooks",
    featured: true
  },
  {
    title: "Scenario Planning Hub",
    description: "Design strategic scenarios and map potential trigger conditions",
    path: "/strategic",
    icon: Target,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    stats: "Strategic planning"
  },
  {
    title: "What-If Analyzer",
    description: "Model different scenarios and their potential outcomes",
    path: "/what-if-analyzer",
    icon: Lightbulb,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    stats: "Predictive modeling"
  },
  {
    title: "Board Briefings",
    description: "Generate executive-ready presentations and board materials",
    path: "/board-briefings",
    icon: FileText,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    stats: "Executive reports"
  },
  {
    title: "Playbook Customization",
    description: "Tailor playbooks to your organization's specific needs",
    path: "/playbook-customization",
    icon: ClipboardList,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    stats: "Personalization"
  },
  {
    title: "Preparedness Report",
    description: "Assess your organization's strategic readiness score",
    path: "/preparedness-report",
    icon: Shield,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    stats: "Readiness scoring"
  }
];

const domainCategories = [
  { name: "OFFENSE", domains: ["Market Entry", "M&A", "Product Launch"], count: 58, color: "text-emerald-500", icon: Rocket },
  { name: "DEFENSE", domains: ["Crisis", "Cyber", "Regulatory"], count: 56, color: "text-red-500", icon: Shield },
  { name: "SPECIAL TEAMS", domains: ["Digital Transformation", "Competitive Response", "AI Governance"], count: 52, color: "text-blue-500", icon: Globe }
];

export default function WorkspaceIdentify() {
  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50/30 dark:from-poise-navy dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link href="/mission-control">
              <span className="text-slate-300 hover:text-poise-gold cursor-pointer">ExecuteIQ One™</span>
            </Link>
            <ChevronRight className="h-4 w-4 text-slate-600 dark:text-slate-200" />
            <span className="text-poise-gold font-medium">IDENTIFY</span>
          </nav>

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-poise-gold to-amber-500 shadow-lg shadow-poise-gold/30">
                <ClipboardList className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Playbook Factory</h1>
                  <Badge className="bg-poise-gold/20 text-poise-gold border-poise-gold/30">
                    ExecuteIQ Playbook™
                  </Badge>
                </div>
                <p className="text-slate-400 dark:text-slate-300 mt-1">
                  Build, customize, and manage strategic playbooks for every scenario
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/playbooks">
                <Button className="bg-poise-gold hover:bg-amber-500 text-poise-navy">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Library
                </Button>
              </Link>
              <Link href="/playbook-customize/new">
                <Button variant="outline" className="border-poise-gold/50 text-poise-gold hover:bg-poise-gold/10">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Create New
                </Button>
              </Link>
            </div>
          </div>

          {/* IDEA Progress Tracker */}
          <Card className="mb-8 border-poise-gold/30 bg-gradient-to-r from-poise-gold/5 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">IDEA Framework Progress</h3>
                <span className="text-sm text-slate-300">Phase 1 of 4</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-poise-gold/20 border-2 border-poise-gold">
                    <ClipboardList className="h-4 w-4 text-poise-gold" />
                    <span className="text-sm font-medium text-poise-gold">IDENTIFY</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-300" />
                  <Link href="/workspaces/detect">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-poise-teal/10 cursor-pointer transition-colors">
                      <span className="text-sm text-slate-300">DETECT</span>
                    </div>
                  </Link>
                  <ArrowRight className="h-4 w-4 text-slate-300" />
                  <Link href="/workspaces/execute">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-poise-teal/10 cursor-pointer transition-colors">
                      <span className="text-sm text-slate-300">EXECUTE</span>
                    </div>
                  </Link>
                  <ArrowRight className="h-4 w-4 text-slate-300" />
                  <Link href="/workspaces/advance">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-poise-gold/10 cursor-pointer transition-colors">
                      <span className="text-sm text-slate-300">ADVANCE</span>
                    </div>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Strategic Triad Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {domainCategories.map((category) => (
              <Card key={category.name} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <category.icon className={`h-6 w-6 ${category.color}`} />
                      <h3 className="font-bold text-slate-900 dark:text-white">{category.name}</h3>
                    </div>
                    <Badge variant="secondary">{category.count} playbooks</Badge>
                  </div>
                  <div className="space-y-1">
                    {category.domains.map((domain) => (
                      <p key={domain} className="text-sm text-slate-400 dark:text-slate-300">• {domain}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Playbook Activity */}
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Recent Playbook Activity</h2>
          <div className="space-y-3 mb-8">
            <Card className="hover:shadow-md transition-shadow border-l-4 border-l-emerald-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <BookOpen className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-slate-900 dark:text-white">M&A Integration Playbook #12</h4>
                      <Badge className="bg-emerald-500/20 text-emerald-600 border-emerald-500/30">Active</Badge>
                    </div>
                    <p className="text-sm text-slate-400 dark:text-slate-300 mt-0.5">Updated 2 hours ago by Sarah Chen</p>
                  </div>
                  <Clock className="h-4 w-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow border-l-4 border-l-red-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-red-500/10">
                    <Shield className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-slate-900 dark:text-white">Crisis Response Playbook #31</h4>
                      <Badge className="bg-red-500/20 text-red-600 border-red-500/30">Triggered</Badge>
                    </div>
                    <p className="text-sm text-slate-400 dark:text-slate-300 mt-0.5">Activated Feb 3 via automated trigger</p>
                  </div>
                  <Clock className="h-4 w-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow border-l-4 border-l-amber-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <Rocket className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-slate-900 dark:text-white">Product Launch Playbook #45</h4>
                      <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30">In Review</Badge>
                    </div>
                    <p className="text-sm text-slate-400 dark:text-slate-300 mt-0.5">Draft review pending from 3 stakeholders</p>
                  </div>
                  <Users className="h-4 w-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Workspace Tools Grid */}
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">IDENTIFY Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {workspaceTools.map((tool) => (
              <Link key={tool.path} href={tool.path}>
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
                        <p className="text-sm text-slate-400 dark:text-slate-300 mt-1">
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
                    <Target className="h-6 w-6 text-poise-teal" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Ready for the next phase?</h3>
                    <p className="text-sm text-slate-400 dark:text-slate-300">
                      Once your playbooks are ready, set up signal monitoring in DETECT
                    </p>
                  </div>
                </div>
                <Link href="/workspaces/detect">
                  <Button className="bg-poise-teal hover:bg-cyan-600 text-white">
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
