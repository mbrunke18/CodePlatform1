import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import StandardNav from "@/components/layout/StandardNav";
import Footer from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  Search, ChevronDown, ChevronRight, Shield, Zap, Brain,
  Network, AlertTriangle, BookOpen, Clock, Users, ArrowRight,
  Lock, TrendingUp, DollarSign, Globe2, Layers, Target,
  HeartHandshake, Lightbulb
} from "lucide-react";
import type { Playbook } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";

const DOMAINS = [
  { id: "all", label: "All Domains", count: 170 },
  { id: "financial", label: "Financial Response", count: 24, icon: DollarSign },
  { id: "competitive", label: "Competitive Intelligence", count: 22, icon: Globe2 },
  { id: "gtm", label: "Go-to-Market", count: 21, icon: TrendingUp },
  { id: "crisis", label: "Crisis Management", count: 20, icon: AlertTriangle },
  { id: "regulatory", label: "Regulatory & Compliance", count: 19, icon: Shield },
  { id: "ma", label: "M&A Integration", count: 18, icon: Layers },
  { id: "technology", label: "Technology & Digital", count: 17, icon: Brain },
  { id: "talent", label: "Talent & Organization", count: 16, icon: HeartHandshake },
  { id: "strategic", label: "Strategic Opportunity", count: 13, icon: Lightbulb },
];

const URGENCY_FILTERS = [
  { id: "all", label: "All Urgency" },
  { id: "critical", label: "Critical", count: 48 },
  { id: "high", label: "High", count: 76 },
  { id: "standard", label: "Standard", count: 46 },
];

const PUBLIC_TEASERS = [
  {
    num: 47,
    title: "Q4 Revenue Miss — Board Response",
    meta: "Earnings · Investor comms · Board deck",
    domain: "Financial Response",
    domainId: "financial",
    time: "11m 03s",
    urgency: "critical",
  },
  {
    num: 112,
    title: "Competitor Product Launch Response",
    meta: "Market intel · Pricing · Sales enablement",
    domain: "Competitive Intelligence",
    domainId: "competitive",
    time: "9m 42s",
    urgency: "critical",
  },
  {
    num: 31,
    title: "Regulatory Change Compliance Response",
    meta: "Legal review · Policy update · Training",
    domain: "Regulatory & Compliance",
    domainId: "regulatory",
    time: "10m 18s",
    urgency: "high",
  },
  {
    num: 88,
    title: "Executive Leadership Transition",
    meta: "Succession · Communications · Stability plan",
    domain: "Talent & Organization",
    domainId: "talent",
    time: "11m 55s",
    urgency: "critical",
  },
];

const DOMAIN_DB_MAP: Record<string, string[]> = {
  financial: ["Financial Response", "Finance", "Financial"],
  competitive: ["Competitive Intelligence", "Competitive Response", "Competitive"],
  gtm: ["Go-to-Market", "Go to Market", "Product Launch", "Market Entry & Expansion"],
  crisis: ["Crisis Management", "Crisis Response", "Crisis"],
  regulatory: ["Regulatory & Compliance", "Regulatory Compliance", "Compliance"],
  ma: ["M&A Integration", "M&A", "Mergers & Acquisitions"],
  technology: ["Technology & Digital", "Digital Transformation", "Technology"],
  talent: ["Talent & Organization", "Talent", "HR"],
  strategic: ["Strategic Opportunity", "Strategic Planning"],
};

const compoundScenarios = [
  {
    scenario: "Cyber + Regulatory",
    icon: Shield,
    iconColor: "text-red-500",
    domains: "Crisis + Regulatory",
    playbookCount: 6,
    description: "A data breach triggers simultaneous GDPR penalties, SEC disclosure requirements, and customer notification obligations across multiple jurisdictions.",
    triggerExample: "Unauthorized data access detected in EU customer database",
    playbooks: [
      { name: "Cyber Incident Response", domain: "Crisis Management", phase: "EXECUTE" },
      { name: "Data Breach Notification", domain: "Regulatory & Compliance", phase: "EXECUTE" },
      { name: "GDPR Breach Protocol", domain: "Regulatory & Compliance", phase: "EXECUTE" },
      { name: "SEC Disclosure Filing", domain: "Regulatory & Compliance", phase: "DETECT" },
      { name: "Crisis Communications", domain: "Crisis Management", phase: "EXECUTE" },
      { name: "Customer Impact Assessment", domain: "Crisis Management", phase: "IDENTIFY" },
    ],
    stakeholders: ["CISO", "General Counsel", "DPO", "CFO", "VP Communications", "CTO"],
    timeline: [
      { time: "0:00", action: "Breach detected — signal triggers pattern match" },
      { time: "0:30", action: "AI matches to 6 playbooks across Crisis + Regulatory" },
      { time: "1:00", action: "All 6 stakeholder leads notified simultaneously" },
      { time: "3:00", action: "Parallel workstreams active: containment, legal, comms" },
      { time: "8:00", action: "Regulatory filings staged, customer comms drafted" },
      { time: "12:00", action: "Full coordinated response operational" },
    ],
  },
  {
    scenario: "Geopolitical + Supply Chain",
    icon: Network,
    iconColor: "text-amber-500",
    domains: "Financial + Crisis",
    playbookCount: 8,
    description: "Tariff escalation or sanctions impact a critical supplier in an affected region, requiring simultaneous supply chain restructuring and market repositioning.",
    triggerExample: "New 25% tariff announced on semiconductor imports from key supplier region",
    playbooks: [
      { name: "Supply Chain Disruption Response", domain: "Crisis Management", phase: "EXECUTE" },
      { name: "Alternative Supplier Activation", domain: "Go-to-Market", phase: "EXECUTE" },
      { name: "Tariff Impact Assessment", domain: "Regulatory & Compliance", phase: "IDENTIFY" },
      { name: "Cost Structure Realignment", domain: "Financial Response", phase: "DETECT" },
      { name: "Customer Pricing Communication", domain: "Go-to-Market", phase: "EXECUTE" },
      { name: "Inventory Buffer Strategy", domain: "Go-to-Market", phase: "EXECUTE" },
      { name: "Geopolitical Risk Monitoring", domain: "Crisis Management", phase: "DETECT" },
      { name: "Board Briefing: Supply Chain", domain: "Financial Response", phase: "ADVANCE" },
    ],
    stakeholders: ["COO", "CPO", "CFO", "VP Supply Chain", "General Counsel", "VP Sales", "Board Secretary"],
    timeline: [
      { time: "0:00", action: "Tariff announcement detected via news signal feed" },
      { time: "0:30", action: "AI identifies 8 affected playbooks across Financial + Crisis" },
      { time: "1:00", action: "7 stakeholder leads notified with role-specific briefs" },
      { time: "3:00", action: "Supplier alternatives assessed, cost impact modeled" },
      { time: "8:00", action: "Customer communication drafted, board briefing staged" },
      { time: "12:00", action: "Coordinated response across procurement, finance, sales" },
    ],
  },
  {
    scenario: "Climate + Operations",
    icon: AlertTriangle,
    iconColor: "text-blue-500",
    domains: "Crisis + Technology",
    playbookCount: 5,
    description: "Severe weather event causes facility shutdown with cascading impact on customers, logistics, employee safety, and insurance claims.",
    triggerExample: "Category 4 hurricane approaching primary manufacturing facility",
    playbooks: [
      { name: "Facility Emergency Response", domain: "Crisis Management", phase: "EXECUTE" },
      { name: "Business Continuity Activation", domain: "Crisis Management", phase: "EXECUTE" },
      { name: "Customer Service Continuity", domain: "Technology & Digital", phase: "EXECUTE" },
      { name: "Employee Safety Protocol", domain: "Crisis Management", phase: "EXECUTE" },
      { name: "Insurance & Recovery Planning", domain: "Financial Response", phase: "ADVANCE" },
    ],
    stakeholders: ["COO", "VP Facilities", "CHRO", "VP Customer Success", "Risk Officer"],
    timeline: [
      { time: "0:00", action: "Weather monitoring signal triggers facility risk alert" },
      { time: "0:30", action: "5 playbooks activated across Crisis + Technology" },
      { time: "1:00", action: "Employee evacuation notification, customer rerouting begins" },
      { time: "3:00", action: "Backup operations online, logistics rerouted" },
      { time: "8:00", action: "Insurance claims process initiated, recovery timeline set" },
      { time: "12:00", action: "All stakeholders aligned on 72-hour recovery plan" },
    ],
  },
  {
    scenario: "AI + Workforce",
    icon: Brain,
    iconColor: "text-purple-500",
    domains: "Technology + Talent",
    playbookCount: 7,
    description: "AI automation announcement triggers union response, media scrutiny, regulatory inquiry, and employee morale concerns requiring coordinated stakeholder management.",
    triggerExample: "Internal AI automation plan leaked to media before employee communication",
    playbooks: [
      { name: "AI Governance Communication", domain: "Technology & Digital", phase: "EXECUTE" },
      { name: "Workforce Transition Plan", domain: "Talent & Organization", phase: "EXECUTE" },
      { name: "Media Response Protocol", domain: "Crisis Management", phase: "EXECUTE" },
      { name: "Union/Labor Relations", domain: "Talent & Organization", phase: "DETECT" },
      { name: "Employee Reskilling Initiative", domain: "Talent & Organization", phase: "EXECUTE" },
      { name: "Regulatory Compliance (AI Act)", domain: "Regulatory & Compliance", phase: "IDENTIFY" },
      { name: "Board AI Strategy Brief", domain: "Technology & Digital", phase: "ADVANCE" },
    ],
    stakeholders: ["CHRO", "CTO", "General Counsel", "VP Communications", "Chief AI Officer", "CEO"],
    timeline: [
      { time: "0:00", action: "Media report detected — crisis signal triggers compound match" },
      { time: "0:30", action: "7 playbooks activated across Technology + Talent" },
      { time: "1:00", action: "6 executive leads notified with coordinated talking points" },
      { time: "3:00", action: "Employee town hall scheduled, media holding statement issued" },
      { time: "8:00", action: "Reskilling plan drafted, regulatory filing reviewed" },
      { time: "12:00", action: "Unified response across HR, legal, comms, and technology" },
    ],
  },
];

function UrgencyBadge({ urgency }: { urgency: string }) {
  if (urgency === "critical") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        Critical
      </span>
    );
  }
  if (urgency === "high") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
        <span className="w-2 h-2 rounded-full bg-amber-500" />
        High
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
      <span className="w-2 h-2 rounded-full bg-emerald-500" />
      Standard
    </span>
  );
}

function CompoundDisruptionSection() {
  const [expandedScenario, setExpandedScenario] = useState<number | null>(null);

  return (
    <div className="mt-12 border border-red-200 dark:border-red-900/40 rounded-xl overflow-hidden">
      <div className="bg-red-50 dark:bg-red-950/30 px-6 py-4 flex items-center gap-3 border-b border-red-200 dark:border-red-900/40">
        <Zap className="h-4 w-4 text-red-500" />
        <span className="text-sm font-bold text-red-700 dark:text-red-400 uppercase tracking-wide">Compound Disruption Response</span>
        <Badge className="bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 border-0 text-[10px]">MULTI-DOMAIN</Badge>
      </div>
      <div className="p-6 bg-white dark:bg-slate-900">
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">
          When disruptions cascade across domains, Execution OS activates multi-domain playbooks simultaneously. Click any scenario to explore the full response.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {compoundScenarios.map((item, i) => {
            const Icon = item.icon;
            const isExpanded = expandedScenario === i;
            return (
              <div
                key={i}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 bg-slate-50 dark:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500 ${isExpanded ? "border-slate-400 dark:border-slate-500 ring-1 ring-slate-300 dark:ring-slate-600" : "border-slate-200 dark:border-slate-700"}`}
                onClick={() => setExpandedScenario(isExpanded ? null : i)}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${item.iconColor}`} />
                    <div className="text-slate-900 dark:text-white text-sm font-semibold">{item.scenario}</div>
                  </div>
                  <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-xs mb-2">{item.domains}</div>
                <div className="text-[#2B8A6E] text-xs font-semibold">{item.playbookCount} coordinated playbooks</div>
              </div>
            );
          })}
        </div>

        {expandedScenario !== null && (() => {
          const scenario = compoundScenarios[expandedScenario];
          const Icon = scenario.icon;
          return (
            <div className="mt-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-6 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                  <Icon className={`h-5 w-5 ${scenario.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">{scenario.scenario}</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{scenario.description}</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-lg p-4 mb-5 border border-slate-200 dark:border-slate-700">
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Trigger Example</div>
                <p className="text-slate-900 dark:text-white text-sm font-medium">{scenario.triggerExample}</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-6 mb-5">
                <div>
                  <h5 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-[#2B8A6E]" />
                    Activated Playbooks ({scenario.playbookCount})
                  </h5>
                  <div className="space-y-2">
                    {scenario.playbooks.map((pb, j) => (
                      <div key={j} className="flex items-center justify-between bg-white dark:bg-slate-900 rounded-lg px-3 py-2 border border-slate-200 dark:border-slate-700">
                        <div className="flex-1">
                          <div className="text-slate-900 dark:text-white text-sm font-medium">{pb.name}</div>
                          <div className="text-slate-500 text-xs">{pb.domain}</div>
                        </div>
                        <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">{pb.phase}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#2B8A6E]" />
                    12-Minute Execution Timeline
                  </h5>
                  <div className="space-y-0 relative">
                    <div className="absolute left-[7px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-[#2B8A6E] to-[#2B8A6E]/30 rounded-full" />
                    {scenario.timeline.map((step, j) => (
                      <div key={j} className="flex items-start gap-3 py-1.5 relative">
                        <div className={`w-4 h-4 rounded-full shrink-0 z-10 ${j === 0 ? "bg-[#2B8A6E] ring-2 ring-[#2B8A6E]/30" : j === scenario.timeline.length - 1 ? "bg-[#2B8A6E]/40" : "bg-[#2B8A6E]/70"}`} />
                        <div className="flex-1 min-w-0">
                          <span className="text-[#2B8A6E] text-xs font-bold mr-2">{step.time}</span>
                          <span className="text-slate-600 dark:text-slate-400 text-xs">{step.action}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4 text-[#2B8A6E]" />
                      Stakeholders ({scenario.stakeholders.length})
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {scenario.stakeholders.map((s, j) => (
                        <span key={j} className="px-2.5 py-1 rounded-full text-xs font-medium bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-[#2B8A6E]/20 bg-[#2B8A6E]/5 rounded-lg p-4 flex items-center gap-3">
                <ArrowRight className="h-4 w-4 text-[#2B8A6E] shrink-0" />
                <p className="text-slate-700 dark:text-slate-300 text-sm">
                  All {scenario.playbookCount} playbooks activate simultaneously with pre-mapped decision rights — no sequential handoffs, no coordination meetings, no time lost.
                </p>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

export default function PlaybookLibraryV2({ embedded }: { embedded?: boolean }) {
  const [, setLocation] = useLocation();
  const [activeDomain, setActiveDomain] = useState("all");
  const [activeUrgency, setActiveUrgency] = useState("all");
  const [search, setSearch] = useState("");
  const { isAuthenticated } = useAuth();

  const { data: templates } = useQuery<Playbook[]>({
    queryKey: ["/api/playbooks/templates"],
  });

  const domainFilteredTemplates = (templates || []).filter((t) => {
    if (activeDomain === "all") return true;
    const mapped = DOMAIN_DB_MAP[activeDomain] || [];
    return mapped.some((d) => t.domain?.toLowerCase().includes(d.toLowerCase()));
  });

  const searchFiltered = domainFilteredTemplates.filter((t) => {
    if (!search) return true;
    return (
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const publicTeasers = PUBLIC_TEASERS.filter((p) => {
    if (activeDomain !== "all" && p.domainId !== activeDomain) return false;
    if (activeUrgency !== "all" && p.urgency !== activeUrgency) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const activeDomainInfo = DOMAINS.find((d) => d.id === activeDomain)!;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {!embedded && <StandardNav />}

      {!embedded && (
        <div className="bg-[#F8F7F4] dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-6 pt-24 pb-10">
            <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-12">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-4 h-0.5 bg-[#C9A84C]" />
                  <span className="text-xs font-bold tracking-widest uppercase text-[#C9A84C]">170 Playbooks · 9 Domains</span>
                </div>
                <h1 className="font-serif text-4xl md:text-5xl font-semibold text-[#0A0F2E] dark:text-white mb-3 leading-tight">
                  A Playbook for Every<br />
                  <em className="italic text-[#C9A84C]">Strategic Scenario</em>
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-base max-w-lg">
                  Built from 20+ years of Fortune 500 transformation. Filter by domain, urgency, or trigger type.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 max-w-sm">
                {["All Domains", "Financial", "Competitive", "Regulatory", "Crisis", "M&A"].map((chip, i) => (
                  <button
                    key={chip}
                    onClick={() => setActiveDomain(i === 0 ? "all" : ["all","financial","competitive","regulatory","crisis","ma"][i])}
                    className={`px-3.5 py-1.5 text-xs font-semibold border transition-colors ${
                      (i === 0 && activeDomain === "all") || (i > 0 && activeDomain === ["all","financial","competitive","regulatory","crisis","ma"][i])
                        ? "border-[#C9A84C] text-[#C9A84C] bg-white dark:bg-slate-900"
                        : "border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 hover:border-slate-400"
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-8 flex gap-8">
        <aside className="hidden lg:block w-52 shrink-0">
          <div className="sticky top-24">
            <div className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-3 pl-1">Domains</div>
            <nav className="space-y-0.5">
              {DOMAINS.map((domain) => {
                const Icon = domain.icon;
                return (
                  <button
                    key={domain.id}
                    onClick={() => setActiveDomain(domain.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                      activeDomain === domain.id
                        ? "bg-[#0A0F2E] text-white font-semibold"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
                      <span className="truncate">{domain.id === "all" ? "All (170)" : domain.label.replace("& ", "&\u00A0").split(" ").slice(0, 2).join(" ")}</span>
                    </span>
                    <span className={`text-xs shrink-0 ${activeDomain === domain.id ? "text-white/70" : "text-slate-400"}`}>
                      {domain.id !== "all" && domain.count}
                    </span>
                  </button>
                );
              })}
            </nav>

            <div className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-3 pl-1 mt-6">Urgency</div>
            <nav className="space-y-0.5">
              {URGENCY_FILTERS.map((u) => (
                <button
                  key={u.id}
                  onClick={() => setActiveUrgency(u.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                    activeUrgency === u.id
                      ? "bg-[#0A0F2E] text-white font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {u.id === "critical" && <span className="w-2 h-2 rounded-full bg-red-500" />}
                    {u.id === "high" && <span className="w-2 h-2 rounded-full bg-amber-500" />}
                    {u.id === "standard" && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                    {u.label}
                  </span>
                  {"count" in u && <span className={`text-xs ${activeUrgency === u.id ? "text-white/70" : "text-slate-400"}`}>{u.count}</span>}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-5">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search playbooks..."
                className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {(search || activeDomain !== "all" || activeUrgency !== "all") && (
              <Button variant="ghost" size="sm" onClick={() => { setSearch(""); setActiveDomain("all"); setActiveUrgency("all"); }}>
                Clear
              </Button>
            )}
            <div className="ml-auto text-sm text-slate-500">
              <span className="font-semibold text-slate-900 dark:text-white">{activeDomainInfo.count}</span> playbooks
            </div>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-12">#</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Playbook Title</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Domain</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Avg. Execution</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Urgency</th>
                  <th className="px-4 py-3 w-20" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {publicTeasers.map((pb) => (
                  <tr key={pb.num} className="bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group">
                    <td className="px-4 py-4">
                      <span className="font-serif text-xl text-[#C9A84C] font-semibold">{pb.num}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-900 dark:text-white leading-snug">{pb.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{pb.meta}</div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="px-2.5 py-1 rounded text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {pb.domain}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-[#2B8A6E] font-semibold text-xs">{pb.time}</span>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <UrgencyBadge urgency={pb.urgency} />
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => {
                          if (isAuthenticated) {
                            const match = searchFiltered.find((t) => t.domain === pb.domain);
                            if (match) setLocation(`/playbooks/${match.id}/preview`);
                            else setLocation("/playbooks");
                          } else {
                            window.location.href = "/api/login";
                          }
                        }}
                        className="text-xs font-semibold text-[#0A0F2E] dark:text-white hover:text-[#C9A84C] transition-colors whitespace-nowrap group-hover:underline"
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                ))}

                {publicTeasers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-slate-500 text-sm">
                      No playbooks match your current filter. <button className="underline" onClick={() => { setSearch(""); setActiveDomain("all"); setActiveUrgency("all"); }}>Clear filters</button>
                    </td>
                  </tr>
                )}

                <tr className="bg-[#F8F7F4] dark:bg-slate-900/50">
                  <td colSpan={6} className="px-4 py-5 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <Lock className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        <span className="font-semibold text-slate-900 dark:text-white">+ {activeDomainInfo.count - publicTeasers.length} more playbooks</span>
                        {" "}— sign in to unlock the full library
                      </span>
                      <Button
                        size="sm"
                        onClick={() => window.location.href = "/api/login"}
                        style={{ background: "#0A0F2E", color: "#fff" }}
                        className="hover:opacity-90"
                      >
                        Sign In to Access
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {isAuthenticated && searchFiltered.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-4 w-4 text-[#2B8A6E]" />
                <span className="text-sm font-bold text-slate-900 dark:text-white">Full Library — {searchFiltered.length} playbooks</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchFiltered.slice(0, 12).map((pb) => (
                  <div
                    key={pb.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
                    onClick={() => setLocation(`/playbooks/${pb.id}/preview`)}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 uppercase tracking-wide">
                        {pb.domain || "General"}
                      </span>
                      <span className="text-[#C9A84C] text-xs font-semibold whitespace-nowrap">~{pb.avgResponseTimeSeconds ? Math.round(pb.avgResponseTimeSeconds / 60) : 12}m</span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug mb-1 line-clamp-2">{pb.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{pb.description}</p>
                    <div className="flex items-center gap-1 mt-3">
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">Validated</span>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-400 ml-auto" />
                    </div>
                  </div>
                ))}
              </div>
              {searchFiltered.length > 12 && (
                <div className="text-center mt-4">
                  <Button variant="outline" size="sm" onClick={() => setLocation("/identify/playbook-library")}>
                    Browse all {searchFiltered.length} matching playbooks
                    <ChevronRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}

          <CompoundDisruptionSection />
        </div>
      </div>

      {!embedded && (
        <div style={{ background: "#0A0F2E" }} className="mt-12">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="font-serif text-xl font-semibold text-white mb-1">VaughnMartin</div>
                <div className="text-[10px] font-bold tracking-widest uppercase text-[#C9A84C] mb-4">Execution OS</div>
                <p className="text-sm text-white/50 leading-relaxed">170 playbooks. 9 domains. Built for Fortune 1000 strategic velocity.</p>
              </div>
              <div>
                <div className="text-[10px] font-bold tracking-widest uppercase text-white/40 mb-4">Browse</div>
                <ul className="space-y-2 text-sm text-white/60">
                  <li><button onClick={() => setActiveDomain("all")} className="hover:text-white transition-colors">All Playbooks</button></li>
                  <li><button onClick={() => setActiveDomain("financial")} className="hover:text-white transition-colors">Financial Response</button></li>
                  <li><button onClick={() => setActiveDomain("crisis")} className="hover:text-white transition-colors">Crisis Management</button></li>
                  <li><button onClick={() => setActiveDomain("competitive")} className="hover:text-white transition-colors">Competitive Intel</button></li>
                  <li><button onClick={() => setActiveDomain("ma")} className="hover:text-white transition-colors">M&A Integration</button></li>
                </ul>
              </div>
              <div>
                <div className="text-[10px] font-bold tracking-widest uppercase text-white/40 mb-4">Platform</div>
                <ul className="space-y-2 text-sm text-white/60">
                  <li><a href="/platform-overview" className="hover:text-white transition-colors">Platform Overview</a></li>
                  <li><a href="/why-executeiq" className="hover:text-white transition-colors">Why Execution OS</a></li>
                  <li><a href="/try-demo" className="hover:text-white transition-colors">Try a Demo</a></li>
                  <li><a href="/contact" className="hover:text-white transition-colors">Request Pilot Access</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-white/30">© 2026 VaughnMartin. All rights reserved.</p>
              <p className="text-xs text-white/30">executeiq.io</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}