import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import StandardNav from "@/components/layout/StandardNav";
import Footer from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Search, Plus, Eye, Copy, Edit, Target, Shield, Zap, Clock, Users, Star, MoreHorizontal, ArrowLeft, ChevronRight, BookOpen, ChevronDown, AlertTriangle, Brain, Network, ArrowRight } from "lucide-react";
import type { Playbook } from "@shared/schema";
import { useCustomer } from "@/contexts/CustomerContext";
import { BrandStamp } from "@/components/BrandStamp";

const categoryConfig = {
  offense: {
    label: 'OFFENSE',
    tagline: 'Seize Opportunities',
    description: 'Market expansion, M&A integration, and product launches',
    icon: Target,
    color: 'emerald',
    bgGradient: 'from-emerald-500 to-emerald-600',
    lightBg: 'bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/40 dark:to-emerald-900/20',
    iconBg: 'bg-emerald-500',
    textColor: 'text-emerald-700 dark:text-emerald-400',
    borderColor: 'border-emerald-200 dark:border-emerald-800/50',
    hoverBorder: 'hover:border-emerald-400 dark:hover:border-emerald-600',
    count: 58,
    domains: [
      { name: 'Market Entry & Expansion', count: 22 },
      { name: 'M&A Integration', count: 16 },
      { name: 'Product Launch', count: 20 }
    ],
    maturity: 'Battle-Tested',
    validatedBy: 'Fortune 500 execution data',
    avgOutcomeScore: 94
  },
  defense: {
    label: 'DEFENSE',
    tagline: 'Protect Value',
    description: 'Crisis response, cyber incidents, and regulatory compliance',
    icon: Shield,
    color: 'blue',
    bgGradient: 'from-blue-500 to-blue-600',
    lightBg: 'bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/40 dark:to-blue-900/20',
    iconBg: 'bg-blue-500',
    textColor: 'text-blue-800 dark:text-blue-400',
    borderColor: 'border-blue-200 dark:border-blue-800/50',
    hoverBorder: 'hover:border-blue-400 dark:hover:border-blue-600',
    count: 58,
    domains: [
      { name: 'Crisis Response', count: 24 },
      { name: 'Cyber Incidents', count: 18 },
      { name: 'Regulatory Compliance', count: 16 }
    ],
    maturity: 'Mission-Critical',
    validatedBy: 'Enterprise incident response data',
    avgOutcomeScore: 97
  },
  special_teams: {
    label: 'SPECIAL TEAMS',
    tagline: 'Change the Game',
    description: 'Digital transformation, competitive response, and AI governance',
    icon: Zap,
    color: 'purple',
    bgGradient: 'from-purple-500 to-purple-600',
    lightBg: 'bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/40 dark:to-purple-900/20',
    iconBg: 'bg-purple-500',
    textColor: 'text-purple-800 dark:text-purple-400',
    borderColor: 'border-purple-200 dark:border-purple-800/50',
    hoverBorder: 'hover:border-purple-400 dark:hover:border-purple-600',
    count: 54,
    domains: [
      { name: 'Digital Transformation', count: 16 },
      { name: 'Competitive Response', count: 19 },
      { name: 'AI Governance', count: 19 }
    ],
    maturity: 'Innovation-Ready',
    validatedBy: 'Digital transformation benchmarks',
    avgOutcomeScore: 91
  }
};

type Category = keyof typeof categoryConfig;

const compoundScenarios = [
  {
    scenario: 'Cyber + Regulatory',
    playbookNumber: 181,
    icon: Shield,
    iconColor: 'text-red-400',
    bgColor: 'border-red-500/30 bg-red-950/20',
    expandedBg: 'bg-gradient-to-br  ',
    domains: 'Defense + Defense',
    playbookCount: 6,
    description: 'A data breach triggers simultaneous GDPR penalties, SEC disclosure requirements, and customer notification obligations across multiple jurisdictions.',
    triggerExample: 'Unauthorized data access detected in EU customer database',
    playbooks: [
      { name: 'Cyber Incident Response', domain: 'Cyber Incidents', phase: 'EXECUTE' },
      { name: 'Data Breach Notification', domain: 'Regulatory Compliance', phase: 'EXECUTE' },
      { name: 'GDPR Breach Protocol', domain: 'Regulatory Compliance', phase: 'EXECUTE' },
      { name: 'SEC Disclosure Filing', domain: 'Regulatory Compliance', phase: 'DETECT' },
      { name: 'Crisis Communications', domain: 'Crisis Response', phase: 'EXECUTE' },
      { name: 'Customer Impact Assessment', domain: 'Crisis Response', phase: 'IDENTIFY' },
    ],
    stakeholders: ['CISO', 'General Counsel', 'DPO', 'CFO', 'VP Communications', 'CTO'],
    timeline: [
      { time: '0:00', action: 'Breach detected — IDENTIFY triggers pattern match' },
      { time: '0:30', action: 'AI matches to 6 playbooks across Cyber + Regulatory' },
      { time: '1:00', action: 'All 6 stakeholder leads notified simultaneously' },
      { time: '3:00', action: 'Parallel workstreams active: containment, legal, comms' },
      { time: '8:00', action: 'Regulatory filings staged, customer comms drafted' },
      { time: '12:00', action: 'Full coordinated response operational' },
    ],
  },
  {
    scenario: 'Geopolitical + Supply Chain',
    playbookNumber: 182,
    icon: Network,
    iconColor: 'text-amber-400',
    bgColor: 'border-amber-500/30 bg-amber-950/20',
    expandedBg: 'bg-gradient-to-br  ',
    domains: 'Defense + Offense',
    playbookCount: 8,
    description: 'Tariff escalation or sanctions impact a critical supplier in an affected region, requiring simultaneous supply chain restructuring and market repositioning.',
    triggerExample: 'New 25% tariff announced on semiconductor imports from key supplier region',
    playbooks: [
      { name: 'Supply Chain Disruption Response', domain: 'Crisis Response', phase: 'EXECUTE' },
      { name: 'Alternative Supplier Activation', domain: 'Market Entry & Expansion', phase: 'EXECUTE' },
      { name: 'Tariff Impact Assessment', domain: 'Regulatory Compliance', phase: 'IDENTIFY' },
      { name: 'Cost Structure Realignment', domain: 'Crisis Response', phase: 'DETECT' },
      { name: 'Customer Pricing Communication', domain: 'Product Launch', phase: 'EXECUTE' },
      { name: 'Inventory Buffer Strategy', domain: 'Market Entry & Expansion', phase: 'EXECUTE' },
      { name: 'Geopolitical Risk Monitoring', domain: 'Crisis Response', phase: 'DETECT' },
      { name: 'Board Briefing: Supply Chain', domain: 'Crisis Response', phase: 'ADVANCE' },
    ],
    stakeholders: ['COO', 'CPO', 'CFO', 'VP Supply Chain', 'General Counsel', 'VP Sales', 'Board Secretary'],
    timeline: [
      { time: '0:00', action: 'Tariff announcement detected via news signal feed' },
      { time: '0:30', action: 'AI identifies 8 affected playbooks across Defense + Offense' },
      { time: '1:00', action: '7 stakeholder leads notified with role-specific briefs' },
      { time: '3:00', action: 'Supplier alternatives assessed, cost impact modeled' },
      { time: '8:00', action: 'Customer communication drafted, board briefing staged' },
      { time: '12:00', action: 'Coordinated response across procurement, finance, sales' },
    ],
  },
  {
    scenario: 'Climate + Operations',
    playbookNumber: 183,
    icon: AlertTriangle,
    iconColor: 'text-blue-400',
    bgColor: 'border-blue-500/30 bg-blue-950/20',
    expandedBg: 'bg-gradient-to-br  ',
    domains: 'Defense + Special Teams',
    playbookCount: 5,
    description: 'Severe weather event causes facility shutdown with cascading impact on customers, logistics, employee safety, and insurance claims.',
    triggerExample: 'Category 4 hurricane approaching primary manufacturing facility',
    playbooks: [
      { name: 'Facility Emergency Response', domain: 'Crisis Response', phase: 'EXECUTE' },
      { name: 'Business Continuity Activation', domain: 'Crisis Response', phase: 'EXECUTE' },
      { name: 'Customer Service Continuity', domain: 'Digital Transformation', phase: 'EXECUTE' },
      { name: 'Employee Safety Protocol', domain: 'Crisis Response', phase: 'EXECUTE' },
      { name: 'Insurance & Recovery Planning', domain: 'Crisis Response', phase: 'ADVANCE' },
    ],
    stakeholders: ['COO', 'VP Facilities', 'CHRO', 'VP Customer Success', 'Risk Officer'],
    timeline: [
      { time: '0:00', action: 'Weather monitoring signal triggers facility risk alert' },
      { time: '0:30', action: '5 playbooks activated across Crisis + Digital Transformation' },
      { time: '1:00', action: 'Employee evacuation notification, customer rerouting begins' },
      { time: '3:00', action: 'Backup operations online, logistics rerouted' },
      { time: '8:00', action: 'Insurance claims process initiated, recovery timeline set' },
      { time: '12:00', action: 'All stakeholders aligned on 72-hour recovery plan' },
    ],
  },
  {
    scenario: 'AI + Workforce',
    playbookNumber: 184,
    icon: Brain,
    iconColor: 'text-purple-400',
    bgColor: 'border-purple-500/30 bg-purple-950/20',
    expandedBg: 'bg-gradient-to-br  ',
    domains: 'Special Teams + Defense',
    playbookCount: 7,
    description: 'AI automation announcement triggers union response, media scrutiny, regulatory inquiry, and employee morale concerns requiring coordinated stakeholder management.',
    triggerExample: 'Internal AI automation plan leaked to media before employee communication',
    playbooks: [
      { name: 'AI Governance Communication', domain: 'AI Governance', phase: 'EXECUTE' },
      { name: 'Workforce Transition Plan', domain: 'Digital Transformation', phase: 'EXECUTE' },
      { name: 'Media Response Protocol', domain: 'Crisis Response', phase: 'EXECUTE' },
      { name: 'Union/Labor Relations', domain: 'Crisis Response', phase: 'DETECT' },
      { name: 'Employee Reskilling Initiative', domain: 'AI Governance', phase: 'EXECUTE' },
      { name: 'Regulatory Compliance (AI Act)', domain: 'AI Governance', phase: 'IDENTIFY' },
      { name: 'Board AI Strategy Brief', domain: 'AI Governance', phase: 'ADVANCE' },
    ],
    stakeholders: ['CHRO', 'CTO', 'General Counsel', 'VP Communications', 'Chief AI Officer', 'CEO'],
    timeline: [
      { time: '0:00', action: 'Media report detected — crisis signal triggers compound match' },
      { time: '0:30', action: '7 playbooks activated across AI Governance + Crisis' },
      { time: '1:00', action: '6 executive leads notified with coordinated talking points' },
      { time: '3:00', action: 'Employee town hall scheduled, media holding statement issued' },
      { time: '8:00', action: 'Reskilling plan drafted, regulatory filing reviewed' },
      { time: '12:00', action: 'Unified response across HR, legal, comms, and technology' },
    ],
  },
];

function CompoundDisruptionSection() {
  const [expandedScenario, setExpandedScenario] = useState<number | null>(null);
  const [, setLocation] = useLocation();

  const { data: libraryData } = useQuery<{ playbooks: any[] }>({
    queryKey: ['/api/playbook-library'],
  });

  const getPlaybookId = (playbookNumber: number) => {
    return libraryData?.playbooks?.find((p: any) => p.playbookNumber === playbookNumber)?.id;
  };

  return (
    <div className="mt-10 bg-gradient-to-r  rounded-2xl border border-red-500/20 p-8">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0">
          <Zap className="h-6 w-6 text-red-400" />
        </div>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-lg font-bold text-gray-900">Compound Disruption Response</h3>
            <BrandStamp variant="dual" size="md" className="mb-8" />
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-[10px]">COMPOUND RESPONSE</Badge>
          </div>
          <p className="text-gray-800 text-sm">
            When disruptions cascade across domains, Execution OS activates multi-domain playbooks simultaneously. Click any scenario to explore the full response coordination.
          </p>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {compoundScenarios.map((item, i) => {
          const Icon = item.icon;
          const isExpanded = expandedScenario === i;
          return (
            <div
              key={i}
              className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${item.bgColor} ${isExpanded ? 'ring-2 ring-white/20' : 'hover:ring-1 hover:ring-white/10'}`}
              onClick={() => setExpandedScenario(isExpanded ? null : i)}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${item.iconColor}`} />
                  <div className="text-gray-900 text-sm font-semibold">{item.scenario}</div>
                </div>
                <ChevronDown className={`h-3.5 w-3.5 text-gray-800 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
              </div>
              <div className="text-gray-800 text-xs mb-2">{item.domains}</div>
              <div className="text-emerald-400 text-xs font-medium">{item.playbookCount} coordinated playbooks</div>
            </div>
          );
        })}
      </div>

      {expandedScenario !== null && (() => {
        const scenario = compoundScenarios[expandedScenario];
        const Icon = scenario.icon;
        return (
          <div className={`mt-6 rounded-xl border border-gray-200 ${scenario.expandedBg} p-6 animate-in fade-in slide-in-from-top-2 duration-300`}>
            <div className="flex items-start gap-4 mb-6">
              <div className={`w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0`}>
                <Icon className={`h-5 w-5 ${scenario.iconColor}`} />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-900 mb-1">{scenario.scenario}</h4>
                <p className="text-gray-800 text-sm leading-relaxed">{scenario.description}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
              <div className="text-xs text-gray-800 font-semibold uppercase tracking-wider mb-1">Trigger Example</div>
              <p className="text-gray-900 text-sm font-medium">{scenario.triggerExample}</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <div>
                <h5 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-emerald-400" />
                  Activated Playbooks ({scenario.playbookCount})
                </h5>
                <div className="space-y-2">
                  {scenario.playbooks.map((pb, j) => (
                    <div key={j} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                      <div className="flex-1">
                        <div className="text-gray-900 text-sm font-medium">{pb.name}</div>
                        <div className="text-gray-800 text-xs">{pb.domain}</div>
                      </div>
                      <Badge className="bg-gray-50 text-gray-800 border-slate-600 text-[10px] shrink-0">{pb.phase}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-emerald-400" />
                  12-Minute Execution Timeline
                </h5>
                <div className="space-y-0 relative">
                  <div className="absolute left-[7px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-emerald-500 via-emerald-400 to-emerald-300 rounded-full" />
                  {scenario.timeline.map((step, j) => (
                    <div key={j} className="flex items-start gap-3 py-1.5 relative">
                      <div className={`w-4 h-4 rounded-full shrink-0 z-10 ${j === 0 ? 'bg-emerald-500 ring-2 ring-emerald-500/30' : j === scenario.timeline.length - 1 ? 'bg-emerald-300' : 'bg-emerald-400/80'}`} />
                      <div className="flex-1 min-w-0">
                        <span className="text-emerald-400 text-xs font-bold mr-2">{step.time}</span>
                        <span className="text-gray-800 text-xs">{step.action}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <h5 className="text-sm font-bold text-gray-900 mt-6 mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-emerald-400" />
                  Stakeholders Coordinated ({scenario.stakeholders.length})
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {scenario.stakeholders.map((s, j) => (
                    <span key={j} className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-800 border border-gray-200">{s}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-lg p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                <ArrowRight className="h-4 w-4 text-emerald-400 shrink-0" />
                <p className="text-emerald-300 text-sm">
                  All {scenario.playbookCount} playbooks activate simultaneously with pre-mapped decision rights — no sequential handoffs, no coordination meetings, no time lost.
                </p>
              </div>
              {getPlaybookId(scenario.playbookNumber) && (
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-500 text-gray-900 shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLocation(`/playbooks/${getPlaybookId(scenario.playbookNumber)}/preview`);
                  }}
                >
                  View Full Playbook <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </Button>
              )}
            </div>
          </div>
        );
      })()}

      <p className="text-xs text-gray-700 mt-4 italic">
        Cross-domain coordination is automatic — Execution OS detects compound patterns and activates relevant playbooks across categories simultaneously.
      </p>
    </div>
  );
}

export default function PlaybookLibraryV2({ embedded }: { embedded?: boolean }) {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState<string>("all");
  const { organization } = useCustomer();
  
  const { data: templates, isLoading: loadingTemplates } = useQuery<Playbook[]>({
    queryKey: ['/api/playbooks/templates'],
  });
  
  const { data: myPlaybooks } = useQuery<Playbook[]>({
    queryKey: ['/api/playbooks', organization?.id],
    queryFn: async () => {
      const res = await fetch(`/api/playbooks?organizationId=${organization?.id || ''}`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: true
  });
  
  const domains = Array.from(new Set(templates?.map(t => t.domain).filter(Boolean) || []));
  
  const getCategoryPlaybooks = (category: Category) => {
    return templates?.filter(t => {
      const matchesCategory = t.category === category;
      const matchesSearch = !search || 
        t.name?.toLowerCase().includes(search.toLowerCase()) ||
        t.description?.toLowerCase().includes(search.toLowerCase());
      const matchesDomain = domainFilter === "all" || t.domain === domainFilter;
      return matchesCategory && matchesSearch && matchesDomain;
    }) || [];
  };

  const categoryCounts = {
    offense: templates?.filter(t => t.category === 'offense').length || 58,
    defense: templates?.filter(t => t.category === 'defense').length || 56,
    special_teams: templates?.filter(t => t.category === 'special_teams').length || 52
  };
  
  const totalCount = categoryCounts.offense + categoryCounts.defense + categoryCounts.special_teams;
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {!embedded && <StandardNav />}
      
      {!selectedCategory ? (
        <>
          <div className="bg-white dark:bg-slate-950 border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-6 pt-24 pb-16">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-gray-900" />
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
                      Playbook Library
                    </h1>
                  </div>
                  <p className="text-gray-800 dark:text-slate-200 max-w-lg">
                    {totalCount} validated strategic playbooks with outcome scoring across 9 domains. Select a category to explore.
                  </p>
                </div>
                <Button 
                  onClick={() => setLocation('/playbooks/create')} 
                  className="bg-white text-slate-900 hover:bg-slate-100"
                  data-testid="button-create-playbook"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Custom
                </Button>
              </div>
            </div>
          </div>
          
          <div className="max-w-6xl mx-auto px-6 -mt-8">
            <div className="grid md:grid-cols-3 gap-5">
              {(['offense', 'defense', 'special_teams'] as Category[]).map((category) => {
                const config = categoryConfig[category];
                const Icon = config.icon;
                const count = categoryCounts[category];
                
                return (
                  <Card
                    key={category}
                    className={`group cursor-pointer bg-white dark:bg-slate-900 border-2 ${config.borderColor} ${config.hoverBorder} transition-all duration-200 hover:shadow-xl hover:-translate-y-1`}
                    onClick={() => setSelectedCategory(category)}
                    data-testid={`card-category-${category}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl ${config.iconBg} flex items-center justify-center shadow-lg`}>
                          <Icon className="h-6 w-6 text-gray-900" />
                        </div>
                        <span className="text-3xl font-bold text-slate-900 dark:text-white">
                          {count}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 tracking-tight">
                        {config.label}
                      </h3>
                      <p className={`text-sm font-medium ${config.textColor} mb-3`}>
                        {config.tagline}
                      </p>
                      
                      <div className="space-y-1.5 mb-4">
                        {config.domains.map((domain, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span className="text-gray-800 dark:text-slate-300">{domain.name}</span>
                            <span className="font-medium text-slate-900 dark:text-white">{domain.count}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 mb-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-700 dark:text-slate-400">Maturity</span>
                          <span className={`font-semibold ${config.textColor}`}>{config.maturity}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-700 dark:text-slate-400">Outcome Score</span>
                          <span className={`font-semibold ${config.textColor}`}>{config.avgOutcomeScore}%</span>
                        </div>
                        <div className="text-[10px] text-gray-800 dark:text-slate-500 italic">
                          Validated: {config.validatedBy}
                        </div>
                      </div>

                      <div className={`flex items-center gap-1 text-sm font-medium ${config.textColor} group-hover:gap-2 transition-all`}>
                        Browse playbooks
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            <CompoundDisruptionSection />

            {myPlaybooks && myPlaybooks.length > 0 && (
              <div className="mt-12 mb-8">
                <div className="flex items-center gap-3 mb-5">
                  <Star className="h-5 w-5 text-amber-500" />
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    My Playbooks
                  </h2>
                  <Badge variant="secondary">{myPlaybooks.length}</Badge>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myPlaybooks.slice(0, 3).map((playbook) => (
                    <PlaybookCard key={playbook.id} playbook={playbook} isCustom={true} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {(() => {
            const config = categoryConfig[selectedCategory];
            const Icon = config.icon;
            const playbooks = getCategoryPlaybooks(selectedCategory);
            
            return (
              <>
                <div className={`bg-gradient-to-r ${config.bgGradient} border-b border-gray-200`}>
                  <div className="max-w-6xl mx-auto px-6 pt-24 pb-12">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => { setSelectedCategory(null); setSearch(""); setDomainFilter("all"); }}
                      className="text-gray-900/80 hover:text-white hover:bg-white/10 mb-4 -ml-2"
                      data-testid="button-back-categories"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      All Categories
                    </Button>
                    
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                          <Icon className="h-7 w-7 text-gray-900" />
                        </div>
                        <div>
                          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
                            {config.label}
                          </h1>
                          <p className="text-gray-900/80">
                            {config.tagline} • {playbooks.length} playbooks
                          </p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => setLocation('/playbooks/create')} 
                        className="bg-white text-slate-900 hover:bg-slate-100"
                        data-testid="button-create-playbook-detail"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Custom
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="max-w-6xl mx-auto px-6 py-8">
                  <div className="flex items-center gap-4 mb-6 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex-1 relative max-w-sm">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-800 dark:text-slate-200" />
                      <Input 
                        placeholder="Search playbooks..." 
                        className="pl-10 border-slate-200 dark:border-slate-700"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        data-testid="input-search"
                      />
                    </div>
                    <Select value={domainFilter} onValueChange={setDomainFilter}>
                      <SelectTrigger className="w-48 border-slate-200 dark:border-slate-700" data-testid="select-domain-filter">
                        <SelectValue placeholder="All Domains" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Domains</SelectItem>
                        {domains.map(domain => (
                          <SelectItem key={domain} value={domain!}>{domain}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {(search || domainFilter !== "all") && (
                      <Button variant="ghost" size="sm" onClick={() => { setSearch(""); setDomainFilter("all"); }}>
                        Clear filters
                      </Button>
                    )}
                  </div>
                  
                  {loadingTemplates ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {[1,2,3,4,5,6].map(i => (
                        <div key={i} className="h-52 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                      ))}
                    </div>
                  ) : playbooks.length === 0 ? (
                    <div className="text-center py-20">
                      <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                        <Search className="h-8 w-8 text-gray-800 dark:text-slate-200" />
                      </div>
                      <p className="text-gray-800 dark:text-slate-300">No playbooks found matching your criteria.</p>
                      <Button variant="link" onClick={() => { setSearch(""); setDomainFilter("all"); }}>
                        Clear filters
                      </Button>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {playbooks.map((playbook) => (
                        <PlaybookCard key={playbook.id} playbook={playbook} isCustom={false} />
                      ))}
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </>
      )}
      
      {!embedded && <Footer />}
    </div>
  );
}

function PlaybookCard({ 
  playbook, 
  isCustom
}: { 
  playbook: Playbook; 
  isCustom: boolean;
}) {
  const [, setLocation] = useLocation();
  const category = (playbook.category || 'offense') as Category;
  const config = categoryConfig[category] || categoryConfig.offense;
  
  return (
    <Card 
      className="group bg-white dark:bg-slate-900 hover:shadow-lg transition-all duration-200 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
      data-testid={`card-playbook-${playbook.id}`}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <Badge variant="outline" className={`text-xs font-medium ${config.textColor} border-current`}>
            {config.label}
          </Badge>
          <div className="flex items-center gap-1.5">
            {isCustom && playbook.status && (
              <Badge 
                className={`text-xs ${
                  playbook.status === 'draft' 
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' 
                    : playbook.status === 'ready'
                    ? 'bg-green-100 text-emerald-800 dark:bg-green-900/30 dark:text-green-400'
                    : playbook.status === 'active'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300'
                }`}
              >
                {playbook.status === 'draft' ? 'Draft' : 
                 playbook.status === 'ready' ? 'Ready' : 
                 playbook.status === 'active' ? 'Active' : 
                 playbook.status}
              </Badge>
            )}
            {isCustom && (
              <Badge className="bg-amber-100 text-[#C9A84C] dark:bg-amber-900/30 dark:text-amber-400 text-xs">
                Custom
              </Badge>
            )}
          </div>
        </div>
        
        <h3 className="font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2 leading-snug">
          {playbook.name}
        </h3>
        <p className="text-sm text-gray-800 dark:text-slate-300 line-clamp-2 mb-4">
          {playbook.description}
        </p>
        
        <div className="flex items-center gap-4 text-xs text-gray-800 mb-4">
          {!isCustom && (
            <>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {playbook.timesUsed || 0}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                ~{playbook.avgResponseTimeSeconds ? Math.round(playbook.avgResponseTimeSeconds / 60) : 12}m
              </span>
            </>
          )}
          <span className="truncate flex-1 text-right">{playbook.domain}</span>
        </div>
        
        <div className="flex items-center gap-1.5 mb-3">
          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">Validated</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-800">Outcome-Scored</span>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-9"
            onClick={() => setLocation(`/playbooks/${playbook.id}/preview`)}
            data-testid={`button-preview-${playbook.id}`}
          >
            <Eye className="mr-1.5 h-3.5 w-3.5" />
            Preview
          </Button>
          
          {isCustom ? (
            <Button 
              size="sm" 
              className="flex-1 h-9"
              onClick={() => setLocation(`/playbooks/${playbook.id}/edit`)}
              data-testid={`button-edit-${playbook.id}`}
            >
              <Edit className="mr-1.5 h-3.5 w-3.5" />
              Edit
            </Button>
          ) : (
            <>
              <Button 
                size="sm"
                className="flex-1 h-9"
                onClick={() => setLocation(`/playbooks/${playbook.id}/customize`)}
                data-testid={`button-customize-${playbook.id}`}
              >
                <Edit className="mr-1.5 h-3.5 w-3.5" />
                Customize
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setLocation(`/playbooks/${playbook.id}/customize`)}>
                    <Copy className="mr-2 h-4 w-4" />
                    Clone as new
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
