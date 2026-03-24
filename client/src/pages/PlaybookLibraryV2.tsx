import { useState } from "react";
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

interface LibraryPlaybook {
  id: string;
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
}

const DOMAINS = [
  { id: "all", label: "All Domains", count: 170 },
  { id: "financial", label: "Financial Strategy", count: 24, icon: DollarSign },
  { id: "competitive", label: "Market Dynamics", count: 22, icon: Globe2 },
  { id: "gtm", label: "Operational Excellence", count: 21, icon: TrendingUp },
  { id: "crisis", label: "Technology & Innovation", count: 20, icon: Brain },
  { id: "regulatory", label: "Regulatory & Compliance", count: 15, icon: Target },
  { id: "ma", label: "Market Opportunities", count: 18, icon: Layers },
  { id: "technology", label: "Brand & Reputation", count: 17, icon: Lightbulb },
  { id: "talent", label: "Talent & Leadership", count: 14, icon: HeartHandshake },
  { id: "strategic", label: "AI Governance", count: 19, icon: Shield },
];

const URGENCY_FILTERS = [
  { id: "all", label: "All Urgency" },
  { id: "critical", label: "Critical", count: 48 },
  { id: "high", label: "High", count: 76 },
  { id: "standard", label: "Standard", count: 46 },
];

const SAMPLE_PLAYBOOK_NAMES = new Set([
  "Aggressive Pricing Disruption",
  "Compound: Geopolitical + Supply Chain Disruption",
  "AI Competitive Disruption",
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

// Reverse map: full domain name → DOMAIN_DB_MAP key
// Allows ?domain=Operational Excellence (from trigger routing) to resolve correctly
const DOMAIN_NAME_TO_KEY: Record<string, string> = Object.entries(DOMAIN_DB_MAP)
  .reduce((acc, [key, names]) => {
    names.forEach(n => { acc[n] = key; });
    return acc;
  }, {} as Record<string, string>);

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
      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(10, 15, 46, 0.12)", color: "#0A0F2E", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, padding: "3px 10px", borderRadius: "4px" }}>
        <span className="w-2 h-2 rounded-full bg-[#0A0F2E] animate-pulse" />
        Critical
      </span>
    );
  }
  if (urgency === "high") {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(201,168,76,0.12)", color: "#C9A84C", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, padding: "3px 10px", borderRadius: "4px" }}>
        <span className="w-2 h-2 rounded-full" style={{ background: "#C9A84C" }} />
        High
      </span>
    );
  }
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(43,138,110,0.12)", color: "#2B8A6E", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, padding: "3px 10px", borderRadius: "4px" }}>
      <span className="w-2 h-2 rounded-full" style={{ background: "#2B8A6E" }} />
      Standard
    </span>
  );
}

function CompoundDisruptionSection() {
  const [expandedScenario, setExpandedScenario] = useState<number | null>(null);

  return (
    <div className="mt-12 border rounded-xl overflow-hidden" style={{ borderColor: "#E8E4DC" }}>
      <div className="px-6 py-4 flex items-center gap-3 border-b" style={{ background: "white", borderColor: "#E8E4DC" }}>
        <Zap className="h-4 w-4" style={{ color: "#C9A84C" }} />
        <span className="text-sm font-bold uppercase tracking-wide" style={{ color: "#0A0F2E" }}>Compound Disruption Response</span>
        <Badge style={{ background: "rgba(201, 168, 76, 0.1)", color: "#0A0F2E" }} className="border-0 text-[10px]">MULTI-DOMAIN</Badge>
      </div>
      <div className="p-6 bg-white">
        <p className="text-sm mb-5" style={{ color: "#6B7280" }}>
          When disruptions cascade across domains, Execution OS activates multi-domain playbooks simultaneously. Click any scenario to explore the full response.
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
                className={`rounded-lg p-4 cursor-pointer transition-all duration-200 hover:border-[#C9A84C]`}
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
                <div className="text-xs font-semibold" style={{ color: indicatorColor }}>{item.playbookCount} coordinated playbooks</div>
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
            <div className="mt-5 rounded-xl border bg-[#F8F7F4]/50 p-6 animate-in fade-in slide-in-from-top-2 duration-300" style={{ borderColor: "#E8E4DC" }}>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-lg bg-white border flex items-center justify-center shrink-0" style={{ borderColor: "#E8E4DC" }}>
                  <Icon className="h-5 w-5" style={{ color: indicatorColor }} />
                </div>
                <div className="flex-1">
                  <h4 style={{ ...CG_LOCAL, color: "#0A0F2E" }} className="text-base font-bold mb-1">{scenario.scenario}</h4>
                  <p style={{ color: "#6B7280" }} className="text-sm leading-relaxed">{scenario.description}</p>
                </div>
              </div>

                  <div className="bg-white rounded-lg p-4 mb-5 border" style={{ borderColor: "#E8E4DC" }}>
                    <div style={{ color: "#6B7280" }} className="text-xs font-semibold uppercase tracking-wider mb-1">Trigger Example</div>
                    <p style={{ color: "#0A0F2E" }} className="text-sm font-medium">{scenario.triggerExample}</p>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6 mb-5">
                    <div>
                      <h5 style={{ color: "#0A0F2E" }} className="text-sm font-bold mb-3 flex items-center gap-2">
                        <BookOpen className="h-4 w-4" style={{ color: "#2B8A6E" }} />
                        Activated Playbooks ({scenario.playbookCount})
                      </h5>
                      <div className="space-y-2">
                        {scenario.playbooks.map((pb, j) => {
                          const pbIsOffense = pb.domain.includes("Financial") || pb.domain.includes("Market") || pb.domain.includes("Growth") || pb.domain.includes("M&A");
                          const pbIsDefense = pb.domain.includes("Crisis") || pb.domain.includes("Regulatory") || pb.domain.includes("Cyber") || pb.domain.includes("Compliance") || pb.domain.includes("Technology") || pb.domain.includes("Talent");
                          const pbIndicatorColor = pbIsOffense ? "#2B8A6E" : pbIsDefense ? "#0A0F2E" : "#C9A84C";
                          return (
                            <div key={j} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border" style={{ borderColor: "#E8E4DC" }}>
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
                        <div className="absolute left-[7px] top-3 bottom-3 w-0.5 rounded-full" style={{ background: `linear-gradient(to bottom, #2B8A6E, rgba(43,138,110,0.1))` }} />
                        {scenario.timeline.map((step, j) => (
                          <div key={j} className="flex items-start gap-3 py-1.5 relative">
                            <div className={`w-4 h-4 rounded-full shrink-0 z-10`} style={{ background: j === 0 ? "#2B8A6E" : `rgba(43,138,110, ${0.7 - (j * 0.1)})` }} />
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
                            <span key={j} style={{ background: "white", color: "#0A0F2E", borderColor: "#E8E4DC" }} className="px-2.5 py-1 rounded-full text-xs font-medium border">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ background: "rgba(43,138,110,0.05)", borderColor: "rgba(43,138,110,0.2)" }} className="border rounded-lg p-4 flex items-center gap-3">
                    <ArrowRight className="h-4 w-4 shrink-0" style={{ color: "#2B8A6E" }} />
                    <p style={{ color: "#0A0F2E" }} className="text-sm">
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
  const [activeDomain, setActiveDomain] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('domain') || 'all';
    // Accept either a short key ("gtm") or a full domain name ("Operational Excellence")
    return DOMAIN_NAME_TO_KEY[raw] || raw;
  });
  const [activeUrgency, setActiveUrgency] = useState("all");
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

  const domainFilteredTemplates = (templates || []).filter((t) => {
    if (activeDomain === "all") return true;
    const mapped = DOMAIN_DB_MAP[activeDomain] || [];
    return mapped.some((d) => t.domain === d);
  });

  const urgencyFiltered = domainFilteredTemplates.filter((t) => {
    if (activeUrgency === "all") return true;
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

  return (
    <PageLayout embedded={embedded}>

      {!embedded && (
        <div style={{ background: "white", borderBottom: `1px solid #E8E4DC` }}>
          <div className="max-w-6xl mx-auto px-6 pt-24 pb-10">
            <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-12">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-[2px]" style={{ background: "#C9A84C" }} />
                  <span style={{ color: "#C9A84C", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>170 Playbooks · 9 Domains</span>
                </div>
                <h1 style={{ ...CG, color: "#0A0F2E" }} className="text-4xl md:text-5xl font-semibold mb-3 leading-tight">
                  A Playbook for Every<br />
                  <em className="italic" style={{ color: "#C9A84C" }}>Strategic Scenario</em>
                </h1>
                <p style={{ color: "#6B7280" }} className="text-base max-w-lg">
                  Built from 20+ years of Fortune 500 transformation. Filter by domain, urgency, or trigger type.
                </p>
              </div>
                  <div className="flex flex-wrap gap-2 max-w-sm">
                {["All Domains", "Financial", "Competitive", "Regulatory", "Crisis", "M&A"].map((chip, i) => {
                  const id = ["all","financial","competitive","regulatory","crisis","ma"][i];
                  const isActive = activeDomain === id;
                  return (
                    <button
                      key={chip}
                      onClick={() => setActiveDomain(id)}
                      style={{
                        padding: "6px 14px",
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                          border: `1px solid ${isActive ? "#C9A84C" : "#E8E4DC"}`,
                        color: isActive ? "#FFFFFF" : "#0A0F2E",
                        background: isActive ? "#0A0F2E" : "transparent",
                        transition: "all 0.2s"
                      }}
                      className="hover:border-[#C9A84C]"
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-8 flex gap-8">
        <aside className="hidden lg:block w-52 shrink-0">
          <div className="sticky top-24">
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: MUTED, marginBottom: 12, paddingLeft: 4 }}>Domains</div>
            <nav className="space-y-0.5">
              {DOMAINS.map((domain) => {
                const Icon = domain.icon;
                const isActive = activeDomain === domain.id;
                return (
                  <button
                    key={domain.id}
                    onClick={() => setActiveDomain(domain.id)}
                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all"
                    style={{
                      background: isActive ? "rgba(10, 15, 46, 0.08)" : "transparent",
                      color: isActive ? NAVY : MUTED,
                      fontSize: 11, fontWeight: isActive ? 700 : 500, textAlign: "left",
                      textTransform: "uppercase", letterSpacing: "0.1em"
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {Icon && <Icon className="h-3.5 w-3.5" style={{ color: isActive ? GOLD : MUTED }} />}
                      <span>{domain.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b" style={{ borderColor: BORDER }}>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
              <Input 
                className="pl-10 border-[#E8E4DC] focus:border-[#C9A84C] focus:ring-[#C9A84C]" 
                placeholder="Search templates..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mr-2">Filter:</span>
              {URGENCY_FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveUrgency(f.id)}
                  style={{
                    padding: "4px 10px",
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    background: activeUrgency === f.id ? "#0A0F2E" : "transparent",
                    color: activeUrgency === f.id ? "white" : MUTED,
                    border: `1px solid ${activeUrgency === f.id ? "#0A0F2E" : BORDER}`,
                    borderRadius: 4
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <span style={{ color: MUTED, fontSize: 12, fontWeight: 600 }}>
              Showing <span style={{ color: NAVY, fontWeight: 700 }}>{sortedFiltered.length}</span> of <span style={{ color: NAVY, fontWeight: 700 }}>170</span> playbooks
            </span>
            {!isAuthenticated && (
              <div className="flex items-center gap-2">
                <Lock className="h-3 w-3 text-[#C9A84C]" />
                <span style={{ color: MUTED, fontSize: 11 }}>Sign in to deploy any playbook</span>
              </div>
            )}
          </div>

          {!isAuthenticated && (
            <div className="mb-3 pb-3 border-b" style={{ borderColor: BORDER }}>
              <div className="flex items-center gap-2 mb-1">
                <Eye className="h-3.5 w-3.5 text-[#2B8A6E]" />
                <span style={{ color: "#2B8A6E", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                  3 Full Playbook Previews — No Sign-In Required
                </span>
              </div>
              <p style={{ color: MUTED, fontSize: 11 }}>See the full depth of what a deployed playbook contains — trigger logic, stakeholders, tasks, and budget authority.</p>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-4">
            {sortedFiltered.map((playbook) => {
              const isSample = !isAuthenticated && SAMPLE_PLAYBOOK_NAMES.has(playbook.name);
              return (
              <Card key={playbook.id} className={`group transition-all duration-300 bg-white flex flex-col ${isSample ? 'border-[#2B8A6E] hover:border-[#2B8A6E]' : 'border-[#E8E4DC] hover:border-[#C9A84C]'}`} style={isSample ? { boxShadow: '0 0 0 1px #2B8A6E22, 0 2px 8px 0 #2B8A6E11' } : {}}>
                <div className="p-5 flex flex-col flex-1">
                  {/* Header: tier label + urgency badge */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {isAuthenticated ? (
                        <>
                          <Check className="h-3 w-3 text-[#2B8A6E]" />
                          <span style={{ color: "#2B8A6E", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Enterprise Tier</span>
                        </>
                      ) : SAMPLE_PLAYBOOK_NAMES.has(playbook.name) ? (
                        <>
                          <Eye className="h-3 w-3 text-[#2B8A6E]" />
                          <span style={{ color: "#2B8A6E", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Free Sample</span>
                        </>
                      ) : (
                        <>
                          <Lock className="h-3 w-3 text-[#C9A84C]" />
                          <span style={{ color: "#C9A84C", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Execution Ready</span>
                        </>
                      )}
                    </div>
                    <UrgencyBadge urgency={playbook.priority?.toLowerCase() || "standard"} />
                  </div>

                  {/* Name */}
                  <h3 style={{ ...CG, color: "#0A0F2E" }} className="text-base font-bold mb-1.5 group-hover:text-[#C9A84C] transition-colors leading-snug">{playbook.name}</h3>

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

                  {/* Depth stats row */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span style={{ display: "flex", alignItems: "center", gap: 4, background: "#F8F7F4", border: "1px solid #E8E4DC", padding: "2px 8px", fontSize: 10, fontWeight: 700, color: "#0A0F2E" }}>
                      <Zap className="h-2.5 w-2.5 text-[#C9A84C]" />
                      {playbook.phaseCount || 4} Phases
                    </span>
                    {playbook.signalSourceCount > 0 && (
                      <span style={{ display: "flex", alignItems: "center", gap: 4, background: "#F8F7F4", border: "1px solid #E8E4DC", padding: "2px 8px", fontSize: 10, fontWeight: 700, color: "#0A0F2E" }}>
                        <Radio className="h-2.5 w-2.5 text-[#2B8A6E]" />
                        {playbook.signalSourceCount} Live Sources
                      </span>
                    )}
                    {playbook.stakeholderCount > 0 && (
                      <span style={{ display: "flex", alignItems: "center", gap: 4, background: "#F8F7F4", border: "1px solid #E8E4DC", padding: "2px 8px", fontSize: 10, fontWeight: 700, color: "#0A0F2E" }}>
                        <Users className="h-2.5 w-2.5 text-[#6B7280]" />
                        {playbook.stakeholderCount} Stakeholders
                      </span>
                    )}
                  </div>

                  {/* Pre-approved budget if available */}
                  {playbook.preApprovedBudget && playbook.preApprovedBudget > 0 && (
                    <div className="flex items-center gap-1.5 mb-3">
                      <Wallet className="h-3 w-3 text-[#C9A84C]" />
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#6B7280" }}>Pre-Approved Budget:</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#0A0F2E" }}>
                        ${Number(playbook.preApprovedBudget).toLocaleString()}
                      </span>
                    </div>
                  )}

                  {/* Domain + Actions */}
                  <div className="flex items-center justify-between pt-3 mt-auto border-t" style={{ borderColor: "#F8F7F4" }}>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-[#6B7280] uppercase">Domain</span>
                      <span className="text-[10px] font-semibold text-[#0A0F2E] truncate max-w-[90px]">{playbook.domain}</span>
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
                        style={{
                          background: "#0A0F2E",
                          color: "white", fontSize: 10, padding: "4px 12px", height: "auto"
                        }}
                        className="font-bold uppercase tracking-wider"
                        onClick={() => {
                          if (isAuthenticated) {
                            setLocation(`/playbook-customize/${playbook.id}`);
                          } else if (SAMPLE_PLAYBOOK_NAMES.has(playbook.name)) {
                            setLocation(`/playbook-library/${playbook.id}`);
                          } else {
                            setLocation("/pilot-program");
                          }
                        }}
                      >
                        {isAuthenticated ? (
                          <><span>Deploy</span><ChevronRight className="ml-1 h-3 w-3" /></>
                        ) : SAMPLE_PLAYBOOK_NAMES.has(playbook.name) ? (
                          <><Eye className="mr-1 h-3 w-3" /><span>View Sample</span></>
                        ) : (
                          <span>Get Access</span>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
              );
            })}
          </div>

          <CompoundDisruptionSection />
        </main>
      </div>

    </PageLayout>
  );
}

function Card({ children, className, style }: { children: React.ReactNode, className?: string, style?: React.CSSProperties }) {
  return <div className={`border rounded-xl overflow-hidden ${className}`} style={style}>{children}</div>;
}
