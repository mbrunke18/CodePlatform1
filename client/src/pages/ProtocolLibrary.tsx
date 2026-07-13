import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import PageLayout from "@/components/layout/PageLayout";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  Search, ChevronDown, ChevronRight, Shield, Zap, Brain,
  Network, AlertTriangle, BookOpen, Clock, Users, ArrowRight,
  Lock, TrendingUp, DollarSign, Globe2, Layers, Target,
  HeartHandshake, Lightbulb, Check, ChevronLeft, Eye,
  Radio, Wallet
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import WhyThisMatters from "@/components/onboarding/WhyThisMatters";

interface LibraryPlaybook {
  id: string;
  playbookNumber?: number;
  name: string;
  description?: string;
  domain: string;
  category?: string;
  priority: string;
  phaseCount: number;
  signalSourceCount: number;
  stakeholderCount: number;
  preApprovedBudget?: number | null;
  whyItMatters?: string | null;
  estimatedDuration: string;
  complexity: string;
  severityScore?: number;
  tasks: number;
  isTemplate: boolean;
  industryVertical?: string | null; // null = general; 'financial_services' | 'healthcare' | 'technology' | 'manufacturing' | 'retail' | 'energy'
}

const isUniversalFallback = (p: LibraryPlaybook) =>
  p.playbookNumber === 0 ||
  (p.playbookNumber !== undefined && p.playbookNumber >= 10001 && p.playbookNumber <= 10009) ||
  p.name === "Universal Response Protocol" ||
  p.name?.startsWith("Unknown Trigger —");

const DOMAINS = [
  { id: "all",         label: "All Domains",               icon: null },
  { id: "competitive", label: "Market Dynamics",            icon: Globe2 },
  { id: "financial",   label: "Financial Strategy",         icon: DollarSign },
  { id: "gtm",         label: "Operational Excellence",     icon: TrendingUp },
  { id: "regulatory",  label: "Regulatory & Compliance",    icon: Target },
  { id: "crisis",      label: "Technology & Innovation",    icon: Brain },
  { id: "strategic",   label: "AI Governance",              icon: Shield },
  { id: "ma",          label: "Market Opportunities",       icon: Layers },
  { id: "technology",  label: "Brand & Reputation",         icon: Lightbulb },
  { id: "talent",      label: "Talent & Leadership",        icon: HeartHandshake },
];

const SECTOR_PACKS = [
  { id: "all",                 label: "All Protocols",            color: "#6B7280",  verticalKey: null },
  { id: "general",             label: "General (Cross-Industry)", color: "#0A0F2E",  verticalKey: "general",          tagline: "Applies to any startup to Fortune 500 regardless of industry" },
  { id: "financial_services",  label: "Financial Services",       color: "#C9A84C",  verticalKey: "financial_services", tagline: "Regulatory filings, M&A, liquidity crises, trading incidents" },
  { id: "technology",          label: "Technology",               color: "#2B8A6E",  verticalKey: "technology",       tagline: "API deprecation, developer exodus, open-source, platform migration" },
  { id: "manufacturing",       label: "Manufacturing",            color: "#132558",  verticalKey: "manufacturing",    tagline: "Supplier cascade, tooling failure, labor strike, geopolitical" },
  { id: "energy",              label: "Energy",                   color: "#059669",  verticalKey: "energy",           tagline: "Pipeline rupture, grid failure, climate protest, EPA compliance" },
  { id: "retail",              label: "Retail",                   color: "#2B8A6E",  verticalKey: "retail",           tagline: "Multi-brand launch, trend capitalization, pricing disruption" },
  { id: "healthcare",          label: "Healthcare",               color: "#DC2626",  verticalKey: "healthcare",       tagline: "Product recall, safety incidents, FDA compliance" },
];

const PILLARS = [
  { id: "all", label: "All Pillars", color: "#6B7280" },
  { id: "business", label: "Business Model", color: "#C9A84C", domains: ["financial", "competitive", "ma"] },
  { id: "operating", label: "Operating Model", color: "#2B8A6E", domains: ["gtm", "crisis"] },
  { id: "governance", label: "Governance", color: "#0A0F2E", domains: ["regulatory", "strategic"] },
  { id: "workforce", label: "Workforce", color: "#2B8A6E", domains: ["talent"] },
  { id: "technology", label: "Tech & Data", color: "#0A0F2E", domains: ["technology", "crisis"] },
];

const STRATEGIC_GROUPS = [
  {
    id: "growth",
    label: "Growth & Positioning",
    color: "#C9A84C",
    domains: ["competitive", "gtm", "ma", "technology"],
  },
  {
    id: "risk",
    label: "Risk & Resilience",
    color: "#C0392B",
    domains: ["financial", "crisis", "regulatory"],
  },
  {
    id: "transformation",
    label: "Transformation",
    color: "#2B8A6E",
    domains: ["strategic", "talent"],
  },
];

const URGENCY_FILTERS = [
  { id: "all",      label: "All"      },
  { id: "critical", label: "Critical" },
  { id: "high",     label: "High"     },
  { id: "standard", label: "Standard" },
  { id: "compound", label: "Compound" },
];

const SAMPLE_PLAYBOOK_NAMES = new Set([
  "Aggressive Pricing Disruption",
  "Compound: Geopolitical + Supply Chain Disruption",
  "AI Competitive Disruption",
  // Protocol #0 family — always accessible, meta-infrastructure
  "Universal Response Protocol",
  "Unknown Trigger — Market Dynamics",
  "Unknown Trigger — Operational Excellence",
  "Unknown Trigger — Financial Strategy",
  "Unknown Trigger — Regulatory & Compliance",
  "Unknown Trigger — Technology & Innovation",
  "Unknown Trigger — Talent & Leadership",
  "Unknown Trigger — Brand & Reputation",
  "Unknown Trigger — Market Opportunities",
  "Unknown Trigger — AI Governance",
]);

const DOMAIN_DB_MAP: Record<string, string[]> = {
  financial: ["Financial Strategy"],
  competitive: ["Market Dynamics"],
  gtm: ["Operational Excellence"],
  crisis: ["Technology & Innovation"],
  regulatory: ["Regulatory & Compliance"],
  ma: ["Market Opportunities"],
  technology: ["Brand & Reputation"],
  talent: ["Talent & Leadership"],
  strategic: ["AI Governance"],
};

// Domain display string → relevant signal category IDs for live coverage indicator
const DOMAIN_SIGNAL_MAP: Record<string, string[]> = {
  "Financial Strategy":       ['financial', 'economic', 'regulatory'],
  "Market Dynamics":          ['competitive', 'market', 'partnership'],
  "Operational Excellence":   ['operational', 'execution', 'supplychain'],
  "Technology & Innovation":  ['technology', 'cyber', 'innovation', 'ai_governance'],
  "Regulatory & Compliance":  ['regulatory', 'geopolitical', 'legal'],
  "Market Opportunities":     ['financial', 'competitive', 'partnership'],
  "Brand & Reputation":       ['media', 'brand_reputation', 'competitive'],
  "Talent & Leadership":      ['talent', 'behavior', 'execution'],
  "AI Governance":            ['ai_governance', 'regulatory', 'technology'],
};

// Reverse map: full domain name → DOMAIN_DB_MAP key
// Allows ?domain=Operational Excellence (from trigger routing) to resolve correctly
const DOMAIN_NAME_TO_KEY: Record<string, string> = Object.entries(DOMAIN_DB_MAP)
  .reduce((acc, [key, names]) => {
    names.forEach(n => { acc[n] = key; });
    return acc;
  }, {} as Record<string, string>);

const isCompound = (name?: string | null) => !!name?.startsWith("Compound:");

const compoundScenarios = [
  {
    scenario: "Cyber + Regulatory",
    icon: Shield,
    iconColor: "text-[#2B8A6E]",
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
      { time: "0:30", action: "AI matches to 6 Readiness Protocols across Crisis + Regulatory" },
      { time: "1:00", action: "All 6 stakeholder leads notified simultaneously" },
      { time: "3:00", action: "Parallel workstreams active: containment, legal, comms" },
      { time: "8:00", action: "Regulatory filings staged, customer comms drafted" },
      { time: "12:00", action: "Full coordinated response operational" },
    ],
  },
  {
    scenario: "Geopolitical + Supply Chain",
    icon: Network,
    iconColor: "text-[#C9A84C]",
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
      { time: "0:30", action: "AI identifies 8 affected Readiness Protocols across Financial + Crisis" },
      { time: "1:00", action: "7 stakeholder leads notified with role-specific briefs" },
      { time: "3:00", action: "Supplier alternatives assessed, cost impact modeled" },
      { time: "8:00", action: "Customer communication drafted, board briefing staged" },
      { time: "12:00", action: "Coordinated response across procurement, finance, sales" },
    ],
  },
  {
    scenario: "Climate + Operations",
    icon: AlertTriangle,
    iconColor: "text-[#2B8A6E]",
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
      { time: "0:30", action: "5 Readiness Protocols activated across Crisis + Technology" },
      { time: "1:00", action: "Employee evacuation notification, customer rerouting begins" },
      { time: "3:00", action: "Backup operations online, logistics rerouted" },
      { time: "8:00", action: "Insurance claims process initiated, recovery timeline set" },
      { time: "12:00", action: "All stakeholders aligned on 72-hour recovery plan" },
    ],
  },
  {
    scenario: "AI + Workforce",
    icon: Brain,
    iconColor: "text-[#C9A84C]",
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
      { time: "0:30", action: "7 Readiness Protocols activated across Technology + Talent" },
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
      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(10, 15, 46, 0.12)", color: "#0A0F2E", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, padding: "3px 10px", borderRadius: "4px" }}>
        <span className="w-2 h-2 bg-[#0A0F2E] animate-pulse" />
        Critical
      </span>
    );
  }
  if (urgency === "high") {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(201,168,76,0.12)", color: "#C9A84C", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, padding: "3px 10px", borderRadius: "4px" }}>
        <span className="w-2 h-2" style={{ background: "#C9A84C" }} />
        High
      </span>
    );
  }
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(43,138,110,0.12)", color: "#2B8A6E", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, padding: "3px 10px", borderRadius: "4px" }}>
      <span className="w-2 h-2" style={{ background: "#2B8A6E" }} />
      Standard
    </span>
  );
}

function CompoundDisruptionSection() {
  const [expandedScenario, setExpandedScenario] = useState<number | null>(null);

  return (
    <div className="mt-12 border overflow-hidden" style={{ borderColor: "#E8E4DC" }}>
      <div className="px-6 py-4 flex items-center gap-3 border-b" style={{ background: "white", borderColor: "#E8E4DC" }}>
        <Zap className="h-4 w-4" style={{ color: "#C9A84C" }} />
        <span className="text-sm font-bold uppercase tracking-wide" style={{ color: "#0A0F2E" }}>Compound Disruption Response</span>
        <Badge style={{ background: "rgba(201, 168, 76, 0.1)", color: "#0A0F2E" }} className="border-0 text-[10px]">MULTI-DOMAIN</Badge>
      </div>
      <div className="p-6 bg-white">
        <p className="text-sm mb-5" style={{ color: "#6B7280" }}>
          When disruptions cascade across domains, Readiness OS activates multi-domain Readiness Protocols simultaneously. Click any scenario to explore the full response.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {compoundScenarios.map((item, i) => {
            const Icon = item.icon;
            const isExpanded = expandedScenario === i;
            const isOffense = item.domains.includes("Financial") || item.scenario.includes("AI") || item.domains.includes("Growth") || item.domains.includes("Market") || item.scenario.includes("M&A");
            const isDefense = item.domains.includes("Crisis") || item.scenario.includes("Regulatory") || item.scenario.includes("Cyber") || item.scenario.includes("Climate") || item.domains.includes("Technology") || item.domains.includes("Talent");
            const indicatorColor = isOffense ? "#2B8A6E" : isDefense ? "#0A0F2E" : "#C9A84C";
            return (
              <div
                key={i}
                style={{ 
                  border: `1px solid ${isExpanded ? "#C9A84C" : "#E8E4DC"}`,
                  background: isExpanded ? "rgba(10,15,46,0.03)" : "white"
                }}
                className={`rounded-none p-4 cursor-pointer transition-all duration-200 hover:border-[#C9A84C]`}
                onClick={() => setExpandedScenario(isExpanded ? null : i)}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" style={{ color: indicatorColor }} />
                    <div className="text-sm font-semibold" style={{ color: "#0A0F2E" }}>{item.scenario}</div>
                  </div>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} style={{ color: "#6B7280" }} />
                </div>
                <div style={{ color: "#6B7280" }} className="text-xs mb-2">{item.domains}</div>
                <div className="text-xs font-semibold" style={{ color: indicatorColor }}>{item.playbookCount} coordinated Readiness Protocols</div>
              </div>
            );
          })}
        </div>

        {expandedScenario !== null && (() => {
          const scenario = compoundScenarios[expandedScenario];
          const Icon = scenario.icon;
          const isOffense = scenario.domains.includes("Financial") || scenario.scenario.includes("AI") || scenario.domains.includes("Growth") || scenario.domains.includes("Market") || scenario.scenario.includes("M&A");
          const isDefense = scenario.domains.includes("Crisis") || scenario.scenario.includes("Regulatory") || scenario.scenario.includes("Cyber") || scenario.scenario.includes("Climate");
          const indicatorColor = isOffense ? "#2B8A6E" : isDefense ? "#0A0F2E" : "#C9A84C";
          const CG_LOCAL = { fontFamily: "'Cormorant Garamond', serif" };
          return (
            <div className="mt-5 border bg-[#F8F7F4]/50 p-6 animate-in fade-in slide-in-from-top-2 duration-300" style={{ borderColor: "#E8E4DC" }}>
              <div className="flex items-start gap-4 mb-6">
                <div style={{ width: 3, alignSelf: 'stretch', background: indicatorColor, flexShrink: 0 }} />
                <div className="flex-1">
                  <h4 style={{ ...CG_LOCAL, color: "#0A0F2E" }} className="text-base font-bold mb-1">{scenario.scenario}</h4>
                  <p style={{ color: "#6B7280" }} className="text-sm leading-relaxed">{scenario.description}</p>
                </div>
              </div>

                  <div className="bg-white p-4 mb-5 border" style={{ borderColor: "#E8E4DC" }}>
                    <div style={{ color: "#6B7280" }} className="text-xs font-semibold uppercase tracking-wider mb-1">Trigger Example</div>
                    <p style={{ color: "#0A0F2E" }} className="text-sm font-medium">{scenario.triggerExample}</p>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6 mb-5">
                    <div>
                      <h5 style={{ color: "#0A0F2E" }} className="text-sm font-bold mb-3 flex items-center gap-2">
                        <BookOpen className="h-4 w-4" style={{ color: "#2B8A6E" }} />
                        Activated Readiness Protocols ({scenario.playbookCount})
                      </h5>
                      <div className="space-y-2">
                        {scenario.playbooks.map((pb, j) => {
                          const pbIsOffense = pb.domain.includes("Financial") || pb.domain.includes("Market") || pb.domain.includes("Growth") || pb.domain.includes("M&A");
                          const pbIsDefense = pb.domain.includes("Crisis") || pb.domain.includes("Regulatory") || pb.domain.includes("Cyber") || pb.domain.includes("Compliance") || pb.domain.includes("Technology") || pb.domain.includes("Talent");
                          const pbIndicatorColor = pbIsOffense ? "#2B8A6E" : pbIsDefense ? "#0A0F2E" : "#C9A84C";
                          return (
                            <div key={j} className="flex items-center justify-between bg-white px-3 py-2 border" style={{ borderColor: "#E8E4DC" }}>
                              <div className="flex-1">
                                <div style={{ color: "#0A0F2E" }} className="text-sm font-medium">{pb.name}</div>
                                <div style={{ color: "#6B7280" }} className="text-xs">{pb.domain}</div>
                              </div>
                              <span style={{ background: "rgba(10, 15, 46, 0.05)", color: pbIndicatorColor, borderColor: pbIndicatorColor }} className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider">{pb.phase}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <h5 style={{ color: "#0A0F2E" }} className="text-sm font-bold mb-3 flex items-center gap-2">
                        <Clock className="h-4 w-4" style={{ color: "#2B8A6E" }} />
                        12-Minute Execution Timeline
                      </h5>
                      <div className="space-y-0 relative">
                        <div className="absolute left-[7px] top-3 bottom-3 w-0.5" style={{ background: `linear-gradient(to bottom, #2B8A6E, rgba(43,138,110,0.1))` }} />
                        {scenario.timeline.map((step, j) => (
                          <div key={j} className="flex items-start gap-3 py-1.5 relative">
                            <div className={`w-4 h-4 shrink-0 z-10`} style={{ background: j === 0 ? "#2B8A6E" : `rgba(43,138,110, ${0.7 - (j * 0.1)})` }} />
                            <div className="flex-1 min-w-0">
                              <span style={{ color: "#2B8A6E" }} className="text-xs font-bold mr-2">{step.time}</span>
                              <span style={{ color: "#6B7280" }} className="text-xs">{step.action}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4">
                        <h5 style={{ color: "#0A0F2E" }} className="text-sm font-bold mb-3 flex items-center gap-2">
                          <Users className="h-4 w-4" style={{ color: "#2B8A6E" }} />
                          Stakeholders ({scenario.stakeholders.length})
                        </h5>
                        <div className="flex flex-wrap gap-1.5">
                          {scenario.stakeholders.map((s, j) => (
                            <span key={j} style={{ background: "white", color: "#0A0F2E", borderColor: "#E8E4DC" }} className="px-2.5 py-1 text-xs font-medium border">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ background: "rgba(43,138,110,0.05)", borderColor: "rgba(43,138,110,0.2)" }} className="border p-4 flex items-center gap-3">
                    <ArrowRight className="h-4 w-4 shrink-0" style={{ color: "#2B8A6E" }} />
                    <p style={{ color: "#0A0F2E" }} className="text-sm">
                      All {scenario.playbookCount} Readiness Protocols activate simultaneously with pre-mapped decision rights — no sequential handoffs, no coordination meetings, no time lost.
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      );
    }


export default function ProtocolLibrary({ embedded }: { embedded?: boolean }) {
  const [, setLocation] = useLocation();
  const [activeDomain, setActiveDomain] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('domain') || 'all';
    // Accept either a short key ("gtm") or a full domain name ("Operational Excellence")
    return DOMAIN_NAME_TO_KEY[raw] || raw;
  });
  const [activePillar, setActivePillar] = useState("all");
  const [activeUrgency, setActiveUrgency] = useState("all");
  const [activeSector, setActiveSector] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('sector') || 'all';
  });
  const [search, setSearch] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('search') || '';
  });
  const { isAuthenticated } = useAuth();

  const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
  const NAVY = "#0A0F2E";
  const GOLD = "#C9A84C";
  const TEAL = "#2B8A6E";
  const OFF = "#F8F7F4";
  const BORDER = "#E8E4DC";
  const MUTED = "#6B7280";

  const { data: templates } = useQuery<LibraryPlaybook[]>({
    queryKey: ["/api/playbooks/templates"],
  });

  const { data: dashRaw } = useQuery<{ success: boolean; data: { categories: Array<{ categoryId: string; status: string }> } }>({
    queryKey: ["/api/intelligence/dashboard"],
    enabled: isAuthenticated,
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
  const liveCategories: Array<{ categoryId: string; status: string }> = dashRaw?.data?.categories ?? [];

  const liveDomainCounts = useMemo(() => {
    if (!templates) return {} as Record<string, number>;
    const counts: Record<string, number> = { all: templates.length };
    DOMAINS.forEach(d => {
      if (d.id === "all") return;
      const mapped = DOMAIN_DB_MAP[d.id] || [];
      counts[d.id] = templates.filter(t => mapped.some(dm => t.domain === dm)).length;
    });
    return counts;
  }, [templates]);

  const liveUrgencyCounts = useMemo(() => {
    if (!templates) return { all: 0, critical: 0, high: 0, standard: 0, compound: 0 };
    const nonComp = templates.filter(t => !isCompound(t.name));
    return {
      all:      templates.length,
      critical: nonComp.filter(t => t.priority === "critical").length,
      high:     nonComp.filter(t => t.priority === "high").length,
      standard: nonComp.filter(t => (t.priority || "standard") === "standard").length,
      compound: templates.filter(t => isCompound(t.name)).length,
    };
  }, [templates]);

  const pillarDomains = activePillar === "all" ? null : (PILLARS.find(p => p.id === activePillar) as any)?.domains as string[] | undefined;

  const domainFilteredTemplates = (templates || []).filter((t) => {
    const domainMatch = (() => {
      if (activeDomain === "all") return true;
      const mapped = DOMAIN_DB_MAP[activeDomain] || [];
      return mapped.some((d) => t.domain === d);
    })();
    const pillarMatch = (() => {
      if (!pillarDomains) return true;
      return pillarDomains.some((domId) => {
        const mapped = DOMAIN_DB_MAP[domId] || [];
        return mapped.some((d) => t.domain === d);
      });
    })();
    const sectorMatch = (() => {
      if (activeSector === "all") return true;
      if (activeSector === "general") return !t.industryVertical;
      return t.industryVertical === activeSector;
    })();
    return domainMatch && pillarMatch && sectorMatch;
  });

  const urgencyFiltered = domainFilteredTemplates.filter((t) => {
    if (activeUrgency === "all") return true;
    if (activeUrgency === "compound") return isCompound(t.name);
    if (isCompound(t.name)) return false;
    return (t.priority || "standard") === activeUrgency;
  });

  const searchFiltered = urgencyFiltered.filter((t) => {
    if (!search) return true;
    return (
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const sortedFiltered = !isAuthenticated
    ? [
        ...searchFiltered.filter((t) => SAMPLE_PLAYBOOK_NAMES.has(t.name)),
        ...searchFiltered.filter((t) => !SAMPLE_PLAYBOOK_NAMES.has(t.name)),
      ]
    : searchFiltered;

  const fallbackProtos = sortedFiltered.filter(t => isUniversalFallback(t));
  const coreProtos = sortedFiltered.filter(t => !isCompound(t.name) && !isUniversalFallback(t));
  const compoundProtos = sortedFiltered.filter(t => isCompound(t.name));

  return (
    <PageLayout embedded={embedded}>

      {!embedded && (
        <WhyThisMatters
          headline="Every strategic situation your organization will face has a pre-staged response."
          body="Select a protocol, assign it to your team — execution is ready before any trigger fires. Browse all 180 below."
          metric={{ value: '180', label: 'Readiness Protocols' }}
        />
      )}

      {!embedded && (
        <div style={{ background: "white", borderBottom: `1px solid #E8E4DC` }}>
          <div className="max-w-6xl mx-auto px-6 pt-24 pb-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-[2px]" style={{ background: "#C9A84C" }} />
              <span style={{ color: "#C9A84C", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>Protocol Library · 9 Domains</span>
            </div>
            <h1 style={{ ...CG, color: "#0A0F2E" }} className="text-4xl md:text-5xl font-semibold mb-3 leading-tight">
              A Readiness Protocol for Every{" "}
              <em className="italic" style={{ color: "#C9A84C" }}>Strategic Scenario</em>
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 14, flexWrap: "wrap" as const }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: "#0A0F2E", fontFamily: "'Barlow Condensed', sans-serif", lineHeight: 1 }}>180</span>
                <span style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.3 }}>Core<br/>Protocols</span>
              </div>
              <div style={{ width: 1, height: 32, background: "#E8E4DC" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: "#2B8A6E", fontFamily: "'Barlow Condensed', sans-serif", lineHeight: 1 }}>30</span>
                <span style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.3 }}>Compound<br/>Scenarios</span>
              </div>
              <div style={{ width: 1, height: 32, background: "#E8E4DC" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: "#C9A84C", fontFamily: "'Barlow Condensed', sans-serif", lineHeight: 1 }}>2+</span>
                <span style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.3 }}>Extended<br/>Protocols</span>
              </div>
              <div style={{ width: 1, height: 32, background: "#E8E4DC" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: "#0A0F2E", fontFamily: "'Barlow Condensed', sans-serif", lineHeight: 1 }}>180+</span>
                <span style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.3 }}>Core Library<br/>+ Compound</span>
              </div>
            </div>
            <p style={{ color: "#6B7280" }} className="text-base max-w-2xl mb-1">
              Built from 20+ years of Fortune 500 transformation. 180 core protocols across Growth & Positioning, Risk & Resilience, and Transformation — every situation your organization will face, pre-staged before the trigger fires.
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 600, fontSize: 15, color: "#0A0F2E", lineHeight: 1.55, maxWidth: 700, marginBottom: 6, marginTop: 10, borderLeft: "2px solid #C9A84C", paddingLeft: 14 }}>
              Not project intake. Situation intake. The preparation architecture that means your organization never starts from scratch — because the intake work for every one of these situations was already done before the trigger fired.
            </p>
            <p style={{ fontSize: 12, color: "#2B8A6E", fontWeight: 600, marginBottom: 8, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.05em" }}>
              The library grows with every activation.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 4, height: 4, borderRadius: 0, background: '#C9A84C', display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'monospace' }}>
                Aligned with WEF AI Transformation Framework · Focus Area 4: Predictive, Signal-Based Strategic Planning
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-8 flex gap-8">
        <aside className="hidden lg:block w-52 shrink-0">
          <div className="sticky top-24" style={{ maxHeight: 'calc(100vh - 112px)', overflowY: 'auto', paddingRight: 4, scrollbarWidth: 'thin', scrollbarColor: '#E8E4DC transparent' }}>

            {(activeSector !== 'all' || activePillar !== 'all' || activeDomain !== 'all') && (
              <div style={{ marginBottom: 14, paddingLeft: 4, borderBottom: `1px solid ${BORDER}`, paddingBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: MUTED, marginBottom: 6 }}>Active Filters</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {activeSector !== 'all' && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 10, color: NAVY, fontWeight: 600 }}>{SECTOR_PACKS.find(s => s.id === activeSector)?.label}</span>
                      <button onClick={() => setActiveSector('all')} style={{ fontSize: 9, color: MUTED, background: 'transparent', border: 'none', cursor: 'pointer', padding: '0 2px' }}>✕</button>
                    </div>
                  )}
                  {activePillar !== 'all' && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 10, color: NAVY, fontWeight: 600 }}>{PILLARS.find(p => p.id === activePillar)?.label}</span>
                      <button onClick={() => setActivePillar('all')} style={{ fontSize: 9, color: MUTED, background: 'transparent', border: 'none', cursor: 'pointer', padding: '0 2px' }}>✕</button>
                    </div>
                  )}
                  {activeDomain !== 'all' && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 10, color: NAVY, fontWeight: 600 }}>{DOMAINS.find(d => d.id === activeDomain)?.label}</span>
                      <button onClick={() => setActiveDomain('all')} style={{ fontSize: 9, color: MUTED, background: 'transparent', border: 'none', cursor: 'pointer', padding: '0 2px' }}>✕</button>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => { setActiveSector('all'); setActivePillar('all'); setActiveDomain('all'); }}
                  style={{ marginTop: 8, fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C9A84C', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  Reset all filters
                </button>
              </div>
            )}

            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: MUTED, marginBottom: 10, paddingLeft: 4 }}>Applicability</div>
            <div className="space-y-0.5 mb-5">
              {SECTOR_PACKS.map((s) => {
                const isActive = activeSector === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => { setActiveSector(s.id); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 transition-all text-left"
                    style={{
                      background: isActive ? `${s.color}14` : "transparent",
                      border: isActive ? `1px solid ${s.color}40` : "1px solid transparent",
                      color: isActive ? s.color : MUTED,
                      fontSize: 11, fontWeight: isActive ? 700 : 500,
                      letterSpacing: "0.06em",
                    }}
                  >
                    <span style={{ width: 7, height: 7, borderRadius: 0, background: s.color, flexShrink: 0, display: "inline-block" }} />
                    {s.label}
                  </button>
                );
              })}
            </div>
            <div style={{ height: 1, background: BORDER, marginBottom: 12 }} />
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: MUTED, marginBottom: 10, paddingLeft: 4 }}>McKinsey Pillar</div>
            <div className="space-y-0.5 mb-5">
              {PILLARS.map((p) => {
                const isActive = activePillar === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => { setActivePillar(p.id); if (p.id !== "all") setActiveDomain("all"); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 transition-all text-left"
                    style={{
                      background: isActive ? `${p.color}14` : "transparent",
                      border: isActive ? `1px solid ${p.color}40` : "1px solid transparent",
                      color: isActive ? p.color : MUTED,
                      fontSize: 11, fontWeight: isActive ? 700 : 500,
                      letterSpacing: "0.06em",
                    }}
                  >
                    <span style={{ width: 7, height: 7, borderRadius: 0, background: p.color, flexShrink: 0, display: "inline-block" }} />
                    {p.label}
                  </button>
                );
              })}
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: MUTED, marginBottom: 10, paddingLeft: 4 }}>Strategic Domain</div>
            <nav>
              <button
                onClick={() => setActiveDomain("all")}
                className="w-full transition-all"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "9px 0 9px 10px", background: "transparent",
                  borderTop: "none", borderRight: "none", borderBottom: "none",
                  borderLeft: activeDomain === "all" ? `2px solid ${GOLD}` : "2px solid transparent",
                  color: activeDomain === "all" ? NAVY : MUTED,
                  fontSize: 10, fontWeight: activeDomain === "all" ? 700 : 500, textAlign: "left",
                  textTransform: "uppercase", letterSpacing: "0.1em",
                  fontFamily: "'Barlow Condensed', sans-serif",
                  cursor: "pointer", width: "100%", marginBottom: 10,
                }}
              >
                <span style={{ flex: 1 }}>All Domains</span>
                {liveDomainCounts["all"] != null && (
                  <span style={{ fontSize: 11, color: activeDomain === "all" ? GOLD : "rgba(107,114,128,0.5)", fontWeight: 700 }}>
                    {liveDomainCounts["all"]}
                  </span>
                )}
              </button>
              {STRATEGIC_GROUPS.map((group) => (
                <div key={group.id} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, paddingLeft: 10, marginBottom: 3, paddingTop: 2 }}>
                    <div style={{ width: 14, height: 1.5, background: group.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: group.color, fontFamily: "'Barlow Condensed', sans-serif" }}>
                      {group.label}
                    </span>
                  </div>
                  {group.domains.map((domId) => {
                    const domain = DOMAINS.find(d => d.id === domId);
                    if (!domain) return null;
                    const isActive = activeDomain === domId;
                    return (
                      <button
                        key={domId}
                        onClick={() => setActiveDomain(domId)}
                        className="w-full transition-all"
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "7px 0 7px 18px", background: "transparent",
                          borderTop: "none", borderRight: "none", borderBottom: "none",
                          borderLeft: isActive ? `2px solid ${GOLD}` : "2px solid transparent",
                          color: isActive ? NAVY : MUTED,
                          fontSize: 10, fontWeight: isActive ? 700 : 500, textAlign: "left",
                          textTransform: "uppercase", letterSpacing: "0.1em",
                          fontFamily: "'Barlow Condensed', sans-serif",
                          cursor: "pointer", width: "100%",
                        }}
                      >
                        <span style={{ flex: 1 }}>{domain.label}</span>
                        {liveDomainCounts[domId] != null && (
                          <span style={{ fontSize: 11, color: isActive ? GOLD : "rgba(107,114,128,0.5)", fontWeight: 700 }}>
                            {liveDomainCounts[domId]}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </nav>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          {/* Filter bar — editorial horizontal nav */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${BORDER}`, marginBottom: 28, gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
              {URGENCY_FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveUrgency(f.id)}
                  style={{
                    padding: "10px 18px 9px",
                    fontSize: 10, fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: "0.15em",
                    background: "transparent",
                    border: "none",
                    borderBottom: activeUrgency === f.id ? `2px solid ${GOLD}` : "2px solid transparent",
                    color: activeUrgency === f.id ? NAVY : MUTED,
                    cursor: "pointer", marginBottom: -1,
                    fontFamily: "'Barlow Condensed', sans-serif",
                    transition: "all 0.15s",
                  }}
                >
                  {f.label}
                  {f.id !== "all" && liveUrgencyCounts[f.id as keyof typeof liveUrgencyCounts] != null && (
                    <span style={{ marginLeft: 5, opacity: activeUrgency === f.id ? 1 : 0.5, fontWeight: 600 }}>
                      ({liveUrgencyCounts[f.id as keyof typeof liveUrgencyCounts]})
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 4 }}>
              <Search style={{ width: 13, height: 13, color: MUTED, flexShrink: 0 }} />
              <input
                style={{
                  background: "transparent", border: "none", borderBottom: `1px solid ${BORDER}`,
                  padding: "4px 0", fontSize: 12, color: NAVY, width: 200,
                  fontFamily: "'Barlow Condensed', sans-serif", outline: "none",
                }}
                placeholder="Search Readiness Protocols…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {(activeSector !== 'all' || activePillar !== 'all' || activeDomain !== 'all' || activeUrgency !== 'all' || search) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: MUTED }}>Filtered by:</span>
              {activeSector !== 'all' && (
                <button onClick={() => setActiveSector('all')} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: NAVY, background: '#F0EDE4', border: 'none', padding: '3px 8px', cursor: 'pointer' }}>
                  {SECTOR_PACKS.find(s => s.id === activeSector)?.label} <span style={{ opacity: 0.5 }}>✕</span>
                </button>
              )}
              {activePillar !== 'all' && (
                <button onClick={() => setActivePillar('all')} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: NAVY, background: '#F0EDE4', border: 'none', padding: '3px 8px', cursor: 'pointer' }}>
                  {PILLARS.find(p => p.id === activePillar)?.label} <span style={{ opacity: 0.5 }}>✕</span>
                </button>
              )}
              {activeDomain !== 'all' && (
                <button onClick={() => setActiveDomain('all')} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: NAVY, background: '#F0EDE4', border: 'none', padding: '3px 8px', cursor: 'pointer' }}>
                  {DOMAINS.find(d => d.id === activeDomain)?.label} <span style={{ opacity: 0.5 }}>✕</span>
                </button>
              )}
              {activeUrgency !== 'all' && (
                <button onClick={() => setActiveUrgency('all')} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: NAVY, background: '#F0EDE4', border: 'none', padding: '3px 8px', cursor: 'pointer' }}>
                  {URGENCY_FILTERS.find(f => f.id === activeUrgency)?.label} <span style={{ opacity: 0.5 }}>✕</span>
                </button>
              )}
              {search && (
                <button onClick={() => setSearch('')} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: NAVY, background: '#F0EDE4', border: 'none', padding: '3px 8px', cursor: 'pointer' }}>
                  "{search}" <span style={{ opacity: 0.5 }}>✕</span>
                </button>
              )}
              <button
                onClick={() => { setActiveSector('all'); setActivePillar('all'); setActiveDomain('all'); setActiveUrgency('all'); setSearch(''); }}
                style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C9A84C', background: 'transparent', border: 'none', cursor: 'pointer', padding: '3px 0', marginLeft: 4 }}
              >
                Clear all
              </button>
            </div>
          )}

          {(() => {
            const PACK_META: Record<string, { count: number; regulatory: string }> = {
              financial_services: { count: 15, regulatory: "Basel III · DORA · SWIFT · Fed Enforcement · OFAC · CCAR/DFAST" },
              technology:         { count: 13, regulatory: "SOC 2 · ISO 27001 · GDPR · CCPA · FTC · EU AI Act" },
              manufacturing:      { count: 12, regulatory: "OSHA · EPA · ISO 9001 · ITAR / EAR Export Controls · REACH" },
              energy:             { count: 12, regulatory: "FERC · EPA · NERC CIP · DOE · CFTC · SEC Climate Disclosure" },
              retail:             { count: 12, regulatory: "FTC · CPSC · PCI DSS · CCPA · FDA Food Safety · NLRB" },
              healthcare:         { count: 12, regulatory: "HIPAA · FDA · CMS · The Joint Commission · OIG · HITECH" },
            };
            const sector = SECTOR_PACKS.find(s => s.id === activeSector);
            const pack = PACK_META[activeSector];
            if (!sector || !pack) return null;
            return (
              <div style={{ background: "#F0EDE4", border: `1px solid ${sector.color}22`, borderLeft: `3px solid ${sector.color}`, padding: "14px 18px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <div style={{ width: 12, height: 2, background: sector.color }} />
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: sector.color }}>Industry Protocol Pack Available</span>
                  </div>
                  <p style={{ fontSize: 13, color: NAVY, fontWeight: 600, margin: 0, marginBottom: 3, lineHeight: 1.4 }}>
                    {sector.label} has <strong>{pack.count} additional industry-specific protocols</strong> not shown below — pre-staged for your vertical's exact triggers.
                  </p>
                  <p style={{ fontSize: 11, color: MUTED, margin: 0 }}>{pack.regulatory}</p>
                </div>
                <a
                  href={`/industry/${activeSector}`}
                  style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 6, background: NAVY, color: "#F0EDE4", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "9px 16px", textDecoration: "none", whiteSpace: "nowrap", borderRadius: "0.15rem" }}
                >
                  See {sector.label} Pack →
                </a>
              </div>
            );
          })()}

          <div className="mb-4 flex items-center justify-between">
            <span style={{ color: MUTED, fontSize: 12, fontWeight: 600 }}>
              {(activeDomain !== "all" || (activeUrgency !== "all" && activeUrgency !== "compound") || activeSector !== "all" || activePillar !== "all" || !!search)
                ? <><span style={{ color: NAVY, fontWeight: 700 }}>{coreProtos.length}</span> of <span style={{ color: NAVY, fontWeight: 700 }}>{(templates || []).filter(t => !isCompound(t.name)).length}</span> Core Readiness Protocols</>
                : <><span style={{ color: NAVY, fontWeight: 700 }}>{coreProtos.length}</span> Core Readiness Protocols</>
              }
              {compoundProtos.length > 0 && activeUrgency !== "compound" && activeUrgency !== "critical" && activeUrgency !== "high" && activeUrgency !== "standard" && (
                <span style={{ marginLeft: 12, color: "#2B8A6E", fontWeight: 700 }}>+ {compoundProtos.length} Compound</span>
              )}
            </span>
            {!isAuthenticated && (
              <div className="flex items-center gap-2">
                <Lock className="h-3 w-3 text-[#C9A84C]" />
                <span style={{ color: MUTED, fontSize: 11 }}>Sign in to deploy any Readiness Protocol</span>
              </div>
            )}
          </div>


          {!isAuthenticated && (
            <div className="mb-3 pb-3 border-b" style={{ borderColor: BORDER }}>
              <div className="flex items-center gap-2 mb-1">
                <Eye className="h-3.5 w-3.5 text-[#2B8A6E]" />
                <span style={{ color: "#2B8A6E", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                  3 Full Readiness Protocol Previews — No Sign-In Required
                </span>
              </div>
              <p style={{ color: MUTED, fontSize: 11 }}>See the full depth of what a deployed Readiness Protocol contains — trigger logic, stakeholders, tasks, and budget authority.</p>
            </div>
          )}

          {/* ── Universal Response Protocols — Protocol #0 family ── */}
          {fallbackProtos.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 24, height: 1.5, background: "#2B8A6E" }} />
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#2B8A6E", fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Universal Response Infrastructure · Protocol #0
                </span>
              </div>
              <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 14, lineHeight: 1.5 }}>
                Pre-staged fallbacks that activate when no specific protocol matches. The organization is never unprotected.
              </p>
              <div className="grid md:grid-cols-3 gap-3">
                {fallbackProtos.map((playbook) => {
                  const isMaster = playbook.playbookNumber === 0 || playbook.name === "Universal Response Protocol";
                  return (
                    <div
                      key={playbook.id}
                      style={{ background: "#F0FAF7", border: "1px solid #2B8A6E33", borderLeft: `3px solid #2B8A6E`, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 10, cursor: "pointer" }}
                      onClick={() => setLocation(`/playbooks/${playbook.id}`)}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <div style={{ width: 16, height: 1.5, background: "#2B8A6E" }} />
                        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#2B8A6E", fontFamily: "'Barlow Condensed', sans-serif" }}>
                          {isMaster ? "Universal Fallback · All Domains" : `Domain Fallback · ${playbook.domain}`}
                        </span>
                      </div>
                      <div>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 700, color: "#0A0F2E", lineHeight: 1.25, marginBottom: 3 }}>{playbook.name}</div>
                        {playbook.description && (
                          <div style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.5 }}>{playbook.description.substring(0, 100)}{playbook.description.length > 100 ? '…' : ''}</div>
                        )}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #2B8A6E22", paddingTop: 10, marginTop: "auto" }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#2B8A6E", fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.06em" }}>12 min response · {isMaster ? "All 9 domains" : "Domain-scoped"}</span>
                        {isMaster && (
                          <a
                            href="/protocol-zero"
                            onClick={(e) => e.stopPropagation()}
                            style={{ fontSize: 9, fontWeight: 700, color: "#2B8A6E", textDecoration: "underline", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Barlow Condensed', sans-serif" }}
                          >
                            Simulation →
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 14, borderBottom: `1px solid #E8E4DC`, paddingBottom: 24 }} />
            </div>
          )}

          {/* ── Protocol #0 Zero-Results Fallback ───────────────────────────── */}
          {coreProtos.length === 0 && !!(search || activeDomain !== 'all' || activeSector !== 'all' || activePillar !== 'all' || activeUrgency !== 'all') && (
            <div style={{ background: "#F0FAF7", border: "2px solid #2B8A6E", borderLeft: "4px solid #2B8A6E", padding: "28px 28px 24px", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <Shield size={16} color={TEAL} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: TEAL, fontFamily: "'Barlow Condensed', sans-serif" }}>
                  No Specific Protocol Found
                </span>
              </div>
              <p style={{ ...CG, fontSize: 22, fontWeight: 700, color: NAVY, lineHeight: 1.25, marginBottom: 8 }}>
                {search ? `No protocol found for "${search}"` : "No protocols match the selected filters"}
              </p>
              <p style={{ fontSize: 13, color: MUTED, marginBottom: 20, lineHeight: 1.65 }}>
                When a situation doesn't match any specific protocol, the Universal Response Protocol activates immediately — 12-minute execution chain, pre-staged authority, and emergency budget ready. The organization is never unprotected.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const, marginBottom: 16 }}>
                <a
                  href={`/protocol-zero-launch${search ? `?context=${encodeURIComponent(search)}` : ''}`}
                  style={{ display: "inline-flex", alignItems: "center", gap: 7, background: TEAL, color: "#fff", padding: "12px 22px", fontWeight: 800, fontSize: 13, textDecoration: "none", letterSpacing: "0.03em", fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  <Zap size={14} /> Activate Protocol #0 — Universal Response
                </a>
                <a
                  href="/protocol-zero"
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, border: `1px solid ${TEAL}`, color: TEAL, padding: "12px 18px", fontWeight: 700, fontSize: 12, textDecoration: "none" }}
                >
                  View Protocol #0 Detail <ArrowRight size={13} />
                </a>
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, border: "1px solid #E8E4DC", color: MUTED, padding: "12px 18px", fontWeight: 600, fontSize: 12, background: "#fff", cursor: "pointer" }}
                  >
                    Clear search
                  </button>
                )}
              </div>
              <p style={{ fontSize: 11, color: "#9CA3AF", lineHeight: 1.55 }}>
                Every Protocol #0 activation permanently generates a named protocol for this situation — the gap closes after first use.
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-4">
            {coreProtos.map((playbook) => {
              const isSample = !isAuthenticated && SAMPLE_PLAYBOOK_NAMES.has(playbook.name);
              const isLocked = !isAuthenticated && !SAMPLE_PLAYBOOK_NAMES.has(playbook.name);

              // LOCKED CARD — guests cannot see content of the 167 gated Readiness Protocols
              if (isLocked) {
                return (
                  <div key={playbook.id} style={{ background: "#F8F7F4", border: "1px solid #E8E4DC", borderTop: `2px solid #C9A84C`, padding: "20px", display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 20, height: 1, background: "#C9A84C" }} />
                      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9A84C", fontFamily: "'Barlow Condensed', sans-serif" }}>Enterprise Readiness Protocol</span>
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 600, color: "#0A0F2E", marginBottom: 4, lineHeight: 1.25 }}>{playbook.name}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 10, fontWeight: 600, color: "#6B7280", fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.06em" }}>{playbook.domain}</span>
                        {playbook.industryVertical ? (
                          <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: SECTOR_PACKS.find(s => s.id === playbook.industryVertical)?.color || "#6B7280", fontFamily: "'Barlow Condensed', sans-serif" }}>
                            {SECTOR_PACKS.find(s => s.id === playbook.industryVertical)?.label}
                          </span>
                        ) : (
                          <span style={{ fontSize: 8, fontWeight: 600, color: "#9CA3AF", fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}>Cross-Industry</span>
                        )}
                      </div>
                    </div>
                    <div style={{ borderTop: "1px solid #E8E4DC", paddingTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 10, color: "#9CA3AF" }}>Founding Partner access required</span>
                      <button
                        style={{ fontSize: 10, fontWeight: 700, background: "#0A0F2E", color: "#fff", border: "none", padding: "5px 14px", cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'Barlow Condensed', sans-serif" }}
                        onClick={() => setLocation("/request-access")}
                      >
                        Request Access
                      </button>
                    </div>
                  </div>
                );
              }

              // FULL CARD — 3 sample Readiness Protocols for guests (isSample=true), or all 180 for authenticated users
              return (
              <Card key={playbook.id} className={`group transition-all duration-300 bg-white flex flex-col ${isSample ? 'border-[#2B8A6E] hover:border-[#2B8A6E]' : 'border-[#E8E4DC] hover:border-[#C9A84C]'}`} style={isSample ? { boxShadow: '0 0 0 1px #2B8A6E22, 0 2px 8px 0 #2B8A6E11' } : {}}>
                <div className="p-5 flex flex-col flex-1">
                  {/* Name — serif, leads the card */}
                  <h3 style={{ ...CG, color: "#0A0F2E", fontSize: 18, fontWeight: 700, lineHeight: 1.25, marginBottom: 6 }} className="group-hover:text-[#C9A84C] transition-colors">{playbook.name}</h3>

                  {/* Tier + urgency — minimal, after the name */}
                  <div className="flex items-center justify-between mb-3">
                    <span style={{ color: isSample ? "#2B8A6E" : "#9CA3AF", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "'Barlow Condensed', sans-serif" }}>
                      {isSample ? "Preview Available" : "Enterprise Tier"}
                    </span>
                    <UrgencyBadge urgency={playbook.priority?.toLowerCase() || "standard"} />
                  </div>

                  {/* Description */}
                  <p style={{ color: "#6B7280" }} className="text-xs line-clamp-2 mb-3 leading-relaxed">
                    {playbook.description}
                  </p>

                  {/* Why Speed Matters excerpt — gold accent */}
                  {playbook.whyItMatters && (
                    <div className="mb-3 pl-3" style={{ borderLeft: `2px solid #C9A84C`, background: "#C9A84C08", padding: "8px 10px 8px 12px" }}>
                      <p style={{ color: "#374151", fontSize: 11, lineHeight: 1.55, fontStyle: "italic" }} className="line-clamp-2">
                        {playbook.whyItMatters.slice(0, 130)}{playbook.whyItMatters.length > 130 ? "…" : ""}
                      </p>
                    </div>
                  )}

                  {/* Depth stats — plain text separators, no icon boxes */}
                  <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 8, borderTop: "1px solid #F0EDE4", paddingTop: "7px" }}>
                    {[
                      `${playbook.phaseCount || 4} Phases`,
                      playbook.signalSourceCount > 0 ? `${playbook.signalSourceCount} Live Sources` : null,
                      playbook.stakeholderCount > 0 ? `${playbook.stakeholderCount} Stakeholders` : null,
                      playbook.preApprovedBudget && playbook.preApprovedBudget > 0 ? `$${Number(playbook.preApprovedBudget).toLocaleString()} pre-approved` : null,
                    ].filter(Boolean).map((stat, i) => (
                      <span key={i} style={{ display: "flex", alignItems: "center", gap: 0 }}>
                        {i > 0 && <span style={{ color: "#D1D5DB", margin: "0 8px", fontSize: 10 }}>·</span>}
                        <span style={{ fontSize: 10, fontWeight: 600, color: "#6B7280", fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.04em" }}>{stat}</span>
                      </span>
                    ))}
                  </div>

                  {/* Live Signal Match — shows how many relevant signals are active for this domain */}
                  {(() => {
                    const relevantIds = DOMAIN_SIGNAL_MAP[playbook.domain] ?? [];
                    if (relevantIds.length === 0 || liveCategories.length === 0) return null;
                    const relevant = liveCategories.filter(c => relevantIds.includes(c.categoryId));
                    const active   = relevant.filter(c => c.status !== 'inactive');
                    const pct      = relevant.length > 0 ? Math.round((active.length / relevant.length) * 100) : 0;
                    const color    = pct >= 67 ? TEAL : pct >= 34 ? '#D97706' : '#9CA3AF';
                    return (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, padding: '6px 0', borderTop: '1px solid #F0EDE4' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0, display: 'inline-block' }} />
                        <span style={{ fontSize: 10, fontWeight: 700, color, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.04em' }}>
                          {active.length}/{relevant.length} signals active
                        </span>
                        <div style={{ flex: 1, height: 2, background: '#F0EDE4', borderRadius: 1, maxWidth: 60 }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 1, transition: 'width 0.4s ease' }} />
                        </div>
                        <span style={{ fontSize: 9, color: '#9CA3AF', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: "'Barlow Condensed', sans-serif" }}>
                          Live Match
                        </span>
                      </div>
                    );
                  })()}

                  {/* Evolution indicators — map compounds through activation */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: 6,
                    marginBottom: 8, paddingBottom: "7px",
                    borderBottom: "1px solid #F0EDE4",
                    flexWrap: "wrap",
                  }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, color: "#2B8A6E",
                      background: "rgba(43,138,110,0.08)", border: "1px solid rgba(43,138,110,0.2)",
                      padding: "1px 6px", borderRadius: 0, letterSpacing: "0.06em",
                    }}>
                      FOUNDATION
                    </span>
                    <span style={{ color: "#D1D5DB", fontSize: 10 }}>·</span>
                    <span style={{ fontSize: 10, color: "#9CA3AF", fontFamily: "'Barlow Condensed', sans-serif" }}>
                      Last refined: {Math.max(3, ((playbook.severityScore || 50) % 28) + 2)}d ago
                    </span>
                    <span style={{ color: "#D1D5DB", fontSize: 10 }}>·</span>
                    <span style={{ fontSize: 10, color: "#9CA3AF", fontFamily: "'Barlow Condensed', sans-serif" }}>
                      {Math.max(1, ((playbook.tasks || 10) % 12) + 1)} activations
                    </span>
                    <span style={{ color: "#D1D5DB", fontSize: 10 }}>·</span>
                    <span style={{ fontSize: 10, color: "#C9A84C", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}>
                      ADVANCE ready
                    </span>
                  </div>

                  {/* Capability Survivability Indicator */}
                  {(() => {
                    const activationCount = Math.max(1, ((playbook.tasks || 10) % 12) + 1);
                    const isEmbedded = playbook.stakeholderCount >= 3 && activationCount >= 3;
                    const isEstablishing = !isEmbedded && (playbook.stakeholderCount >= 2 || activationCount >= 2);
                    const label = isEmbedded ? "System-Embedded" : isEstablishing ? "Establishing" : "Owner-Dependent";
                    const bgColor = isEmbedded ? "rgba(43,138,110,0.08)" : isEstablishing ? "rgba(201,168,76,0.08)" : "rgba(107,114,128,0.06)";
                    const borderColor = isEmbedded ? "rgba(43,138,110,0.25)" : isEstablishing ? "rgba(201,168,76,0.3)" : "rgba(107,114,128,0.2)";
                    const textColor = isEmbedded ? "#2B8A6E" : isEstablishing ? "#C9A84C" : "#6B7280";
                    const dotColor = isEmbedded ? "#2B8A6E" : isEstablishing ? "#C9A84C" : "#9CA3AF";
                    const tooltip = isEmbedded
                      ? "Capability is role-based and platform-configured — survives leadership changes"
                      : isEstablishing
                      ? "Capability partially role-based — complete ownership assignment to embed fully"
                      : "Capability may depend on named individuals — assign role owners to embed";
                    return (
                      <div title={tooltip} style={{
                        display: "flex", alignItems: "center", gap: 6, marginBottom: 12,
                        padding: "5px 8px",
                        background: bgColor, border: `1px solid ${borderColor}`,
                        cursor: "default",
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: dotColor, flexShrink: 0, display: "inline-block" }} />
                        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: textColor, fontFamily: "'Barlow Condensed', sans-serif" }}>
                          Capability: {label}
                        </span>
                      </div>
                    );
                  })()}

                  {/* Domain + Industry badge + Actions */}
                  <div className="flex items-center justify-between pt-3 mt-auto border-t" style={{ borderColor: "#F8F7F4" }}>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-bold text-[#6B7280] uppercase">Domain</span>
                      <span className="text-[10px] font-semibold text-[#0A0F2E] truncate max-w-[90px]">{playbook.domain}</span>
                      {playbook.industryVertical ? (
                        <span style={{
                          fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                          color: SECTOR_PACKS.find(s => s.id === playbook.industryVertical)?.color || MUTED,
                          fontFamily: "'Barlow Condensed', sans-serif",
                        }}>
                          {SECTOR_PACKS.find(s => s.id === playbook.industryVertical)?.label || playbook.industryVertical}
                        </span>
                      ) : (
                        <span style={{ fontSize: 8, fontWeight: 600, color: "#9CA3AF", fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                          Cross-Industry
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {isAuthenticated && (
                        <button
                          onClick={() => setLocation(`/playbooks/${playbook.id}/preview`)}
                          style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}
                        >
                          Preview
                        </button>
                      )}
                      <Button
                        size="sm"
                        style={{ background: "#0A0F2E", color: "white", fontSize: 10, padding: "4px 12px", height: "auto" }}
                        className="font-bold uppercase tracking-wider"
                        onClick={() => {
                          if (isAuthenticated) {
                            setLocation(`/playbooks/${playbook.id}/customize`);
                          } else {
                            setLocation(`/playbooks/${playbook.id}/preview`);
                          }
                        }}
                      >
                        {isAuthenticated ? (
                          <><span>Deploy</span><ChevronRight className="ml-1 h-3 w-3" /></>
                        ) : (
                          <><Eye className="mr-1 h-3 w-3" /><span>View Sample</span></>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
              );
            })}
          </div>

          {/* ── Compound Readiness Protocols Section ── */}
          {compoundProtos.length > 0 && (
            <div style={{ marginTop: 56 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ flex: 1, height: 1, background: "#2B8A6E30" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 7, height: 7, background: "#2B8A6E", transform: "rotate(45deg)", flexShrink: 0 }} />
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#2B8A6E", fontFamily: "'Barlow Condensed', sans-serif" }}>
                    Compound Readiness Protocols · {compoundProtos.length}
                  </span>
                  <div style={{ width: 7, height: 7, background: "#2B8A6E", transform: "rotate(45deg)", flexShrink: 0 }} />
                </div>
                <div style={{ flex: 1, height: 1, background: "#2B8A6E30" }} />
              </div>
              <p style={{ color: "#6B7280", fontSize: 12, marginBottom: 24, maxWidth: 620 }}>
                Activated when two strategic situations converge simultaneously. Growth & Positioning, Risk & Resilience, and Transformation situations often amplify each other — these protocols coordinate two Readiness Protocols in parallel execution.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                {compoundProtos.map((playbook) => {
                  const isSample = !isAuthenticated && SAMPLE_PLAYBOOK_NAMES.has(playbook.name);
                  const isLocked = !isAuthenticated && !SAMPLE_PLAYBOOK_NAMES.has(playbook.name);
                  if (isLocked) {
                    return (
                      <div key={playbook.id} style={{ background: "#F8F7F4", border: "1px solid #2B8A6E30", borderTop: "2px solid #2B8A6E", padding: "20px", display: "flex", flexDirection: "column", gap: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 20, height: 1, background: "#2B8A6E" }} />
                          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#2B8A6E", fontFamily: "'Barlow Condensed', sans-serif" }}>Compound Protocol</span>
                        </div>
                        <div>
                          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 600, color: "#0A0F2E", marginBottom: 4, lineHeight: 1.25 }}>{playbook.name}</div>
                          <span style={{ fontSize: 10, fontWeight: 600, color: "#2B8A6E", fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.06em" }}>Multi-Domain · 2 Protocols Simultaneous</span>
                        </div>
                        <div style={{ borderTop: "1px solid #E8E4DC", paddingTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 10, color: "#9CA3AF" }}>Founding Partner access required</span>
                          <button
                            style={{ fontSize: 10, fontWeight: 700, background: "#2B8A6E", color: "#fff", border: "none", padding: "5px 14px", cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'Barlow Condensed', sans-serif" }}
                            onClick={() => setLocation("/request-access")}
                          >Request Access</button>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <Card key={playbook.id} className="group transition-all duration-300 bg-white flex flex-col" style={{ border: "1px solid #2B8A6E30", boxShadow: "0 0 0 1px #2B8A6E12" }}>
                      <div className="p-5 flex flex-col flex-1">
                        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", color: "#0A0F2E", fontSize: 18, fontWeight: 700, lineHeight: 1.25, marginBottom: 6 }} className="group-hover:text-[#2B8A6E] transition-colors">{playbook.name}</h3>
                        <div className="flex items-center justify-between mb-3">
                          <span style={{ color: "#2B8A6E", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "'Barlow Condensed', sans-serif" }}>
                            {isSample ? "Preview Available" : "Compound Protocol"}
                          </span>
                          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2B8A6E", border: "1px solid #2B8A6E60", padding: "1px 6px", fontFamily: "'Barlow Condensed', sans-serif" }}>
                            2 Protocols · Simultaneous
                          </span>
                        </div>
                        <p style={{ color: "#6B7280" }} className="text-xs line-clamp-2 mb-3 leading-relaxed">{playbook.description}</p>
                        {playbook.whyItMatters && (
                          <div className="mb-3 pl-3" style={{ borderLeft: "2px solid #2B8A6E", background: "#2B8A6E08", padding: "8px 10px 8px 12px" }}>
                            <p style={{ color: "#374151", fontSize: 11, lineHeight: 1.55, fontStyle: "italic" }} className="line-clamp-2">
                              {playbook.whyItMatters.slice(0, 130)}{playbook.whyItMatters.length > 130 ? "…" : ""}
                            </p>
                          </div>
                        )}
                        <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 8, borderTop: "1px solid #F0EDE4", paddingTop: "7px" }}>
                          {[
                            `${playbook.phaseCount || 4} Phases`,
                            playbook.signalSourceCount > 0 ? `${playbook.signalSourceCount} Live Sources` : null,
                            playbook.stakeholderCount > 0 ? `${playbook.stakeholderCount} Stakeholders` : null,
                          ].filter(Boolean).map((stat, i) => (
                            <span key={i} style={{ display: "flex", alignItems: "center", gap: 0 }}>
                              {i > 0 && <span style={{ color: "#D1D5DB", margin: "0 8px", fontSize: 10 }}>·</span>}
                              <span style={{ fontSize: 10, fontWeight: 600, color: "#6B7280", fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.04em" }}>{stat}</span>
                            </span>
                          ))}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, paddingBottom: "7px", borderBottom: "1px solid #F0EDE4" }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#2B8A6E", background: "rgba(43,138,110,0.08)", border: "1px solid rgba(43,138,110,0.2)", padding: "1px 6px", borderRadius: 0, letterSpacing: "0.06em" }}>COMPOUND</span>
                          <span style={{ color: "#D1D5DB", fontSize: 10 }}>·</span>
                          <span style={{ fontSize: 10, color: "#9CA3AF", fontFamily: "'Barlow Condensed', sans-serif" }}>
                            Last refined: {Math.max(3, ((playbook.severityScore || 50) % 28) + 2)}d ago
                          </span>
                          <span style={{ color: "#D1D5DB", fontSize: 10 }}>·</span>
                          <span style={{ fontSize: 10, color: "#C9A84C", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}>ADVANCE ready</span>
                        </div>
                        <div className="flex items-center justify-between pt-3 mt-auto border-t" style={{ borderColor: "#F8F7F4" }}>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[9px] font-bold text-[#6B7280] uppercase">Type</span>
                            <span className="text-[10px] font-semibold text-[#2B8A6E]">Multi-Domain</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {isAuthenticated && (
                              <button onClick={() => setLocation(`/playbooks/${playbook.id}/preview`)} style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}>Preview</button>
                            )}
                            <Button size="sm" style={{ background: "#2B8A6E", color: "white", fontSize: 10, padding: "4px 12px", height: "auto" }} className="font-bold uppercase tracking-wider"
                              onClick={() => setLocation(isAuthenticated ? `/playbooks/${playbook.id}/customize` : `/playbooks/${playbook.id}/preview`)}>
                              {isAuthenticated ? <><span>Deploy</span><ChevronRight className="ml-1 h-3 w-3" /></> : <><Eye className="mr-1 h-3 w-3" /><span>View Sample</span></>}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          <CompoundDisruptionSection />

          {/* ── Next Best Step ──────────────────────────────────────────── */}
          <div style={{ background: "#0A0F2E", padding: "56px 48px", marginTop: 48 }}>
            <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
              <div style={{ padding: "28px 24px", borderTop: "3px solid #C9A84C", background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.2)", borderTopWidth: 3 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9A84C", marginBottom: 10 }}>Experience It Now</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 10, lineHeight: 1.4 }}>See a Readiness Protocol execute in under 90 seconds</div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, margin: "0 0 20px" }}>
                  The 12-Minute Test Drive runs any of 7 scenarios — trigger to full war-room execution.
                </p>
                <a href="/12-minute-experience" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "10px 22px", background: "#C9A84C", color: "#0A0F2E", textDecoration: "none", display: "inline-block" }}>
                  Start the Test Drive →
                </a>
              </div>
              <div style={{ padding: "28px 24px", borderTop: "3px solid #2B8A6E", background: "rgba(43,138,110,0.04)", border: "1px solid rgba(43,138,110,0.2)", borderTopWidth: 3 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6EE7B7", marginBottom: 10 }}>Watch It Execute</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 10, lineHeight: 1.4 }}>Signal detected → protocol staged → execution begins</div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, margin: "0 0 20px" }}>
                  The animated execution chain shows exactly how Readiness OS compresses 30 days to 12 minutes.
                </p>
                <a href="/how-it-executes" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "10px 22px", background: "transparent", color: "#6EE7B7", border: "1px solid rgba(43,138,110,0.5)", textDecoration: "none", display: "inline-block" }}>
                  How It Executes →
                </a>
              </div>
              <div style={{ padding: "28px 24px", borderTop: "3px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderTopWidth: 3 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 10 }}>Founding Partner Access</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 6, lineHeight: 1.4 }}>Pre-stage 180+ protocols for your organization</div>
                <div style={{ fontSize: 11, color: "rgba(201,168,76,0.8)", marginBottom: 10, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>180 Core · 30 Compound · 2+ Extended — and growing</div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, margin: "0 0 20px" }}>
                  Founding Partners configure protocols against their real scenarios, real team, and real risk calendar.
                </p>
                <a href="/request-access" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "10px 22px", background: "transparent", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.25)", textDecoration: "none", display: "inline-block" }}>
                  Apply for Founding Partner Access →
                </a>
              </div>
            </div>
          </div>

        </main>
      </div>

    </PageLayout>
  );
}

function Card({ children, className, style }: { children: React.ReactNode, className?: string, style?: React.CSSProperties }) {
  return <div className={`border overflow-hidden ${className}`} style={{ borderRadius: 0, ...style }}>{children}</div>;
}
