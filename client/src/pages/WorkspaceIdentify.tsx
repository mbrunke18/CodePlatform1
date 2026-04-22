import { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  TrendingUp,
  Search,
  Layers,
  ExternalLink,
  Loader2,
  X
} from 'lucide-react';
import { SubBrandLabel } from "@/components/SubBrandLabel";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";

const workspaceTools = [
  {
    title: "Prepared response Library",
    description: "Browse and select from 170 pre-built strategic prepared responses across 9 domains",
    path: "/playbooks",
    icon: BookOpen,
    color: "text-[#C9A84C]",
    bgColor: "bg-[#C9A84C]/10",
    stats: "170 prepared responses",
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
    title: "Prepared response Customization",
    description: "Tailor prepared responses to your organization's specific needs",
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
  { name: "GROWTH & POSITIONING", domains: ["Market Entry", "M&A", "Product Launch"], count: 58, color: "text-[#2B8A6E]", icon: Rocket },
  { name: "RISK & RESILIENCE", domains: ["Crisis", "Cyber", "Regulatory"], count: 58, color: "text-[#0A0F2E]", icon: Shield },
  { name: "TRANSFORMATION", domains: ["Digital Transformation", "Competitive Response", "AI Governance"], count: 54, color: "text-[#C9A84C]", icon: Globe }
];

type PlaybookMeta = {
  id: string;
  name: string;
  domain: string;
  category: string | null;
  description: string | null;
  priority: string | null;
  timesUsed: number | null;
  sourceType: string;
  approvalStatus: string | null;
  status: string | null;
};

type PlaybookDetail = PlaybookMeta & {
  triggerConditions?: any;
  escalationPaths?: any;
  stakeholders?: any;
  executionSteps?: any;
  enrichedPhases?: any;
};

const PRIORITY_COLORS: Record<string, string> = {
  critical: 'bg-red-100 text-red-700 border-red-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  medium: 'bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20',
  low: 'bg-gray-100 text-gray-600 border-gray-200',
};

const CAT_COLORS: Record<string, string> = {
  offense: 'text-[#2B8A6E]',
  defense: 'text-[#0A0F2E]',
  special_teams: 'text-[#C9A84C]',
};

function TwoPhasePlaybookSelector() {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // PHASE 1: Load metadata only — lightweight, fast
  const { data: metaList = [], isLoading: metaLoading } = useQuery<PlaybookMeta[]>({
    queryKey: ['/api/playbooks/metadata', search],
    queryFn: () => {
      const params = new URLSearchParams({ limit: '30' });
      if (search.trim()) params.set('search', search.trim());
      return fetch(`/api/playbooks/metadata?${params}`, { credentials: 'include' }).then(r => r.ok ? r.json() : []);
    },
  });

  // PHASE 2: Load full prepared response detail only when one is selected
  const { data: detail, isLoading: detailLoading } = useQuery<PlaybookDetail>({
    queryKey: ['/api/playbooks', selectedId],
    queryFn: () => fetch(`/api/playbooks/${selectedId}`, { credentials: 'include' }).then(r => r.json()),
    enabled: !!selectedId,
  });

  const filtered = (Array.isArray(metaList) ? metaList : []).filter(p =>
    !search.trim() || p.name.toLowerCase().includes(search.toLowerCase()) || (p.domain || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="mb-8 border-2 border-[#2B8A6E]/20 bg-white dark:bg-white/5 overflow-hidden">
      <CardHeader className="pb-4 bg-[#0A0F2E]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#2B8A6E]/20">
              <Layers className="h-5 w-5 text-[#2B8A6E]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-semibold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Prepared response Quick-Select
                </h3>
                <Badge className="bg-[#2B8A6E] text-white border-none text-xs font-bold uppercase tracking-wider">Two-Phase</Badge>
              </div>
              <p className="text-white/50 text-xs mt-0.5">Metadata loads instantly — full detail loads only on selection</p>
            </div>
          </div>
          <Link href="/playbooks">
            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 bg-transparent text-xs">
              Full Library <ExternalLink className="h-3 w-3 ml-1.5" />
            </Button>
          </Link>
        </div>
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search prepared responses by name or domain..."
            className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#2B8A6E]"
          />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#E8E4DC] dark:divide-white/10">
          {/* Phase 1: Metadata list */}
          <div className="overflow-y-auto max-h-72">
            {metaLoading ? (
              <div className="flex items-center justify-center py-10 gap-2 text-[#6B7280]">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading prepared response index...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2 text-[#6B7280]">
                <Search className="h-5 w-5" />
                <span className="text-sm">No prepared responses match "{search}"</span>
              </div>
            ) : (
              filtered.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedId(prev => prev === p.id ? null : p.id)}
                  className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-[#F8F7F4] dark:hover:bg-white/5 transition-colors border-b border-[#E8E4DC] dark:border-white/5 last:border-b-0 ${selectedId === p.id ? 'bg-[#2B8A6E]/5 dark:bg-[#2B8A6E]/10 border-l-2 border-l-[#2B8A6E]' : ''}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-[#0A0F2E] dark:text-white truncate">{p.name}</span>
                      {p.priority && (
                        <Badge className={`text-xs border ${PRIORITY_COLORS[p.priority] || PRIORITY_COLORS.medium}`}>{p.priority}</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-xs font-medium ${CAT_COLORS[p.category?.toLowerCase() || ''] || 'text-[#6B7280]'}`}>{p.domain}</span>
                      {p.timesUsed && p.timesUsed > 0 && (
                        <span className="text-xs text-[#6B7280] dark:text-[#C9A84C]/40">· Used {p.timesUsed}×</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className={`h-4 w-4 flex-shrink-0 mt-0.5 transition-transform ${selectedId === p.id ? 'rotate-90 text-[#2B8A6E]' : 'text-[#6B7280]'}`} />
                </button>
              ))
            )}
          </div>

          {/* Phase 2: Full detail on selection */}
          <div className="p-5 min-h-[180px]">
            {!selectedId ? (
              <div className="flex flex-col items-center justify-center h-full py-8 gap-3 text-center">
                <div className="p-3 bg-[#2B8A6E]/10">
                  <BookOpen className="h-6 w-6 text-[#2B8A6E]" />
                </div>
                <p className="text-sm font-medium text-[#0A0F2E] dark:text-white">Select a prepared response for full details</p>
                <p className="text-xs text-[#6B7280] dark:text-[#C9A84C]/60">Trigger conditions, escalation paths, and execution steps load on demand</p>
              </div>
            ) : detailLoading ? (
              <div className="flex items-center justify-center h-full gap-2 text-[#6B7280]">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading full playbook...</span>
              </div>
            ) : detail ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-[#0A0F2E] dark:text-white text-base" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{detail.name}</h4>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge className="bg-[#2B8A6E]/10 text-[#2B8A6E] border-[#2B8A6E]/20 text-xs">{detail.domain}</Badge>
                      {detail.category && <Badge variant="outline" className="text-xs">{detail.category}</Badge>}
                      {detail.priority && <Badge className={`text-xs border ${PRIORITY_COLORS[detail.priority] || PRIORITY_COLORS.medium}`}>{detail.priority}</Badge>}
                    </div>
                  </div>
                  <button onClick={() => setSelectedId(null)} className="text-[#6B7280] hover:text-[#0A0F2E] flex-shrink-0">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                {detail.description && (
                  <p className="text-sm text-[#6B7280] dark:text-[#C9A84C]/70 leading-relaxed">{detail.description}</p>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-[#F8F7F4] dark:bg-white/5 text-center">
                    <p className="text-lg font-bold text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {Array.isArray(detail.executionSteps) ? detail.executionSteps.length : Array.isArray(detail.enrichedPhases) ? detail.enrichedPhases.length : '—'}
                    </p>
                    <p className="text-xs text-[#6B7280]">
                      {Array.isArray(detail.executionSteps) ? 'Execution Steps' : 'Phases'}
                    </p>
                  </div>
                  <div className="p-3 bg-[#F8F7F4] dark:bg-white/5 text-center">
                    <p className="text-lg font-bold text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {Array.isArray(detail.stakeholders) ? detail.stakeholders.length : '—'}
                    </p>
                    <p className="text-xs text-[#6B7280]">Stakeholders</p>
                  </div>
                </div>
                <Link href={`/prepared responses/${detail.id}`}>
                  <Button size="sm" className="w-full bg-[#0A0F2E] text-white hover:bg-[#141B45] font-semibold text-xs mt-1">
                    Open Full Prepared response
                    <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function WorkspaceIdentify({ embedded }: { embedded?: boolean } = {}) {
  const inner = (
      <div className="min-h-screen bg-[#F8F7F4] dark:bg-[#0A0F2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link href="/command-center">
              <span className="text-[#0A0F2E] dark:text-[#C9A84C]/60 hover:text-[#C9A84C] cursor-pointer">Readiness OS One™</span>
            </Link>
            <ChevronRight className="h-4 w-4 text-[#0A0F2E] dark:text-[#C9A84C]/40" />
            <span className="text-[#2B8A6E] font-bold uppercase tracking-wider">IDENTIFY</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-[#2B8A6E] shadow-[#2B8A6E]/30">
                <ClipboardList className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Prepared response Factory</h1>
                  <Badge className="bg-[#2B8A6E] text-white border-none px-3 py-1 font-bold uppercase tracking-wider">
                    IDENTIFY
                  </Badge>
                </div>
                <p className="text-[#6B7280] dark:text-[#C9A84C]/60 mt-1">
                  Build, customize, and manage strategic prepared responses for every scenario
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
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2 px-3 py-2 bg-[#2B8A6E]/10 border-2 border-[#2B8A6E] shadow-[#2B8A6E]/20">
                  <ClipboardList className="h-4 w-4 text-[#2B8A6E]" />
                  <span className="text-sm font-bold text-[#2B8A6E] uppercase tracking-wider">IDENTIFY</span>
                </div>
                <ArrowRight className="h-4 w-4 text-[#6B7280] dark:text-[#C9A84C]/40" />
                <Link href="/workspaces/detect">
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#0A0F2E]/10 hover:bg-[#0A0F2E]/20 cursor-pointer transition-colors" style={{ border: "1px solid rgba(10,15,46,0.2)" }}>
                    <Radar className="h-4 w-4 text-[#0A0F2E]" />
                    <span className="text-sm text-[#0A0F2E] font-medium">DETECT</span>
                  </div>
                </Link>
                <ArrowRight className="h-4 w-4 text-[#6B7280] dark:text-[#C9A84C]/40" />
                <Link href="/workspaces/execute">
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#C9A84C]/10 hover:bg-[#C9A84C]/20 cursor-pointer transition-colors" style={{ border: "1px solid rgba(201,168,76,0.2)" }}>
                    <Compass className="h-4 w-4 text-[#C9A84C]" />
                    <span className="text-sm text-[#C9A84C]">EXECUTE</span>
                  </div>
                </Link>
                <ArrowRight className="h-4 w-4 text-[#6B7280] dark:text-[#C9A84C]/40" />
                <Link href="/workspaces/advance">
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#2B8A6E]/10 hover:bg-[#2B8A6E]/20 cursor-pointer transition-colors" style={{ border: "1px solid rgba(43,138,110,0.2)" }}>
                    <TrendingUp className="h-4 w-4 text-[#2B8A6E]" />
                    <span className="text-sm text-[#2B8A6E]">ADVANCE</span>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Strategic Triad Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {domainCategories.map((category) => (
              <Card key={category.name} className="border-[#E8E4DC] dark:border-[#C9A84C]/10 bg-white dark:bg-white/5 ">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <category.icon className={`h-6 w-6 ${category.color}`} />
                      <h3 className="font-bold text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{category.name}</h3>
                    </div>
                    <Badge variant="secondary" className="bg-[#E8E4DC] dark:bg-[#C9A84C]/10 text-[#0A0F2E] dark:text-[#C9A84C]">{category.count} prepared responses</Badge>
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

          {/* TWO-PHASE PREPARED RESPONSE SELECTOR */}
          <TwoPhasePlaybookSelector />

          {/* Recent Prepared response Activity */}
          <h2 className="text-xl font-bold text-[#0A0F2E] dark:text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Recent Prepared response Activity
          </h2>
          <div className="space-y-3 mb-8">
            <Card className="border-[#E8E4DC] dark:border-[#C9A84C]/10 bg-white dark:bg-white/5  border-l-4 border-l-[#2B8A6E]">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-[#2B8A6E]/10">
                    <BookOpen className="h-5 w-5 text-[#2B8A6E]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-[#0A0F2E] dark:text-white">M&A Integration Prepared response #12</h4>
                      <Badge className="bg-[#2B8A6E] text-white border-none">Active</Badge>
                    </div>
                    <p className="text-sm text-[#6B7280] dark:text-[#C9A84C]/60 mt-0.5">Updated 2 hours ago by Sarah Chen</p>
                  </div>
                  <Clock className="h-4 w-4 text-[#6B7280] dark:text-[#C9A84C]/40 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-[#E8E4DC] dark:border-[#C9A84C]/10 bg-white dark:bg-white/5  border-l-4 border-l-[#0A0F2E]">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-red-600/10">
                    <Shield className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-[#0A0F2E] dark:text-white">Crisis Response Prepared response #31</h4>
                      <Badge className="bg-red-600 text-white border-none">Triggered</Badge>
                    </div>
                    <p className="text-sm text-[#6B7280] dark:text-[#C9A84C]/60 mt-0.5">Activated Feb 3 via automated trigger</p>
                  </div>
                  <Clock className="h-4 w-4 text-[#6B7280] dark:text-[#C9A84C]/40 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-[#E8E4DC] dark:border-[#C9A84C]/10 bg-white dark:bg-white/5  border-l-4 border-l-[#C9A84C]">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-[#C9A84C]/10">
                    <Rocket className="h-5 w-5 text-[#C9A84C]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-[#0A0F2E] dark:text-white">Product Launch Prepared response #45</h4>
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
                <Card className={`border-[#E8E4DC] dark:border-[#C9A84C]/10 bg-white dark:bg-white/5 h-full transition-all cursor-pointer group ${tool.featured ? 'border-2 border-[#C9A84C]/50' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 ${tool.bgColor}`}>
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
                  <div className="p-3 bg-white/10">
                    <Target className="h-6 w-6 text-[#C9A84C]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Ready for the next phase?</h3>
                    <p className="text-sm text-white/60">
                      Once your prepared responses are ready, set up signal monitoring in DETECT
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
  );
  return embedded ? inner : <PageLayout>{inner}</PageLayout>;
}
