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

const SAMPLE_PLAYBOOK_IDS = [
  "3dfecf58-e93c-4a3b-b712-f2a9d4a77ed0", // CEO Sudden Departure
  "9d192969-a025-4d66-8aee-f71f237983a2", // Competitor Product Launch (Breakthrough Innovation)
  "f522bf40-c8fa-484a-9d7c-e0be01f10744", // Data Privacy Violation (GDPR/CCPA)
  "3998652e-169e-407f-91f1-cbade5394659", // Activist Investor Campaign
  "2e32847a-0358-4f82-a182-f0e2ed63d447", // Social Media Firestorm
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
      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(10, 15, 46, 0.12)", color: "#0A0F2E", fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, padding: "3px 10px" }}>
        <span className="w-2 h-2 rounded-full bg-[#0A0F2E] animate-pulse" />
        Critical
      </span>
    );
  }
  if (urgency === "high") {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(201,168,76,0.12)", color: "#C9A84C", fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, padding: "3px 10px" }}>
        <span className="w-2 h-2 rounded-full" style={{ background: "#C9A84C" }} />
        High
      </span>
    );
  }
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(43,138,110,0.12)", color: "#2B8A6E", fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, padding: "3px 10px" }}>
      <span className="w-2 h-2 rounded-full" style={{ background: "#2B8A6E" }} />
      Standard
    </span>
  );
}

function CompoundDisruptionSection() {
  const [expandedScenario, setExpandedScenario] = useState<number | null>(null);

  return (
    <div className="mt-12 border rounded-xl overflow-hidden" style={{ borderColor: "#E8E4DC" }}>
      <div className="px-6 py-4 flex items-center gap-3 border-b" style={{ background: "rgba(10, 15, 46, 0.02)", borderColor: "#E8E4DC" }}>
        <Zap className="h-4 w-4" style={{ color: "#C9A84C" }} />
        <span className="text-sm font-bold uppercase tracking-wide" style={{ color: "#0A0F2E" }}>Compound Disruption Response</span>
        <Badge style={{ background: "rgba(43,138,110,0.1)", color: "#2B8A6E" }} className="border-0 text-[10px]">MULTI-DOMAIN</Badge>
      </div>
      <div className="p-6 bg-white">
        <p className="text-sm mb-5" style={{ color: "#6B7280" }}>
          When disruptions cascade across domains, Execution OS activates multi-domain playbooks simultaneously. Click any scenario to explore the full response.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {compoundScenarios.map((item, i) => {
            const Icon = item.icon;
            const isExpanded = expandedScenario === i;
            const isOffense = item.domains.includes("Financial") || item.scenario.includes("AI");
            const isDefense = item.domains.includes("Crisis") || item.scenario.includes("Regulatory") || item.scenario.includes("Cyber") || item.scenario.includes("Climate");
            const indicatorColor = isOffense ? "#2B8A6E" : isDefense ? "#0A0F2E" : "#C9A84C";
            return (
              <div
                key={i}
                style={{ 
                  border: `1px solid ${isExpanded ? "#C9A84C" : "#E8E4DC"}`,
                  background: isExpanded ? "rgba(201,168,76,0.03)" : "rgba(10,15,46,0.02)"
                }}
                className={`rounded-lg p-4 cursor-pointer transition-all duration-200 hover:border-[#DFC178]`}
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
          const isOffense = scenario.domains.includes("Financial") || scenario.scenario.includes("AI");
          const isDefense = scenario.domains.includes("Crisis") || scenario.scenario.includes("Regulatory") || scenario.scenario.includes("Cyber") || scenario.scenario.includes("Climate");
          const indicatorColor = isOffense ? "#2B8A6E" : isDefense ? "#0A0F2E" : "#C9A84C";
          const CG = { fontFamily: "'Cormorant Garamond', serif" };
          return (
            <div className="mt-5 rounded-xl border bg-[#F8F7F4]/50 p-6 animate-in fade-in slide-in-from-top-2 duration-300" style={{ borderColor: "#E8E4DC" }}>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-lg bg-white border flex items-center justify-center shrink-0" style={{ borderColor: "#E8E4DC" }}>
                  <Icon className="h-5 w-5" style={{ color: indicatorColor }} />
                </div>
                <div className="flex-1">
                  <h4 style={{ ...CG, color: "#0A0F2E" }} className="text-base font-bold mb-1">{scenario.scenario}</h4>
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
                    {scenario.playbooks.map((pb, j) => (
                      <div key={j} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border" style={{ borderColor: "#E8E4DC" }}>
                        <div className="flex-1">
                          <div style={{ color: "#0A0F2E" }} className="text-sm font-medium">{pb.name}</div>
                          <div style={{ color: "#6B7280" }} className="text-xs">{pb.domain}</div>
                        </div>
                        <span style={{ background: "rgba(10,15,46,0.05)", color: "#6B7280", borderColor: "#E8E4DC" }} className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold border">{pb.phase}</span>
                      </div>
                    ))}
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
  const [activeDomain, setActiveDomain] = useState("all");
  const [activeUrgency, setActiveUrgency] = useState("all");
  const [search, setSearch] = useState("");
  const { isAuthenticated } = useAuth();

  const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
  const NAVY = "#0A0F2E";
  const GOLD = "#C9A84C";
  const TEAL = "#2B8A6E";
  const OFF = "#F8F7F4";
  const BORDER = "#E8E4DC";
  const MUTED = "#6B7280";

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

  const samplePlaybooks = (templates || []).filter((t) => SAMPLE_PLAYBOOK_IDS.includes(t.id));

  const publicTeasers = samplePlaybooks.filter((p) => {
    if (activeDomain !== "all") {
      const mapped = DOMAIN_DB_MAP[activeDomain] || [];
      if (!mapped.some((d) => (p.domain || "").toLowerCase().includes(d.toLowerCase()))) return false;
    }
    if (search && !p.name?.toLowerCase().includes(search.toLowerCase()) && !p.description?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const activeDomainInfo = DOMAINS.find((d) => d.id === activeDomain)!;

  return (
    <div className="min-h-screen bg-white">
      {!embedded && <StandardNav />}

      {!embedded && (
        <div style={{ background: "#F8F7F4", borderBottom: `1px solid #E8E4DC` }}>
          <div className="max-w-6xl mx-auto px-6 pt-24 pb-10">
            <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-12">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-[2px]" style={{ background: "#C9A84C" }} />
                  <span style={{ color: "#C9A84C", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>170 Playbooks · 9 Domains</span>
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
                        color: isActive ? "#C9A84C" : "#0A0F2E",
                        background: isActive ? "white" : "transparent",
                        transition: "all 0.2s"
                      }}
                      className="hover:border-[#DFC178]"
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
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: MUTED, marginBottom: 12, paddingLeft: 4 }}>Domains</div>
            <nav className="space-y-0.5">
              {DOMAINS.map((domain) => {
                const Icon = domain.icon;
                const isActive = activeDomain === domain.id;
                return (
                  <button
                    key={domain.id}
                    onClick={() => setActiveDomain(domain.id)}
                    style={{ 
                      width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", 
                      background: isActive ? "rgba(0,0,0,0.03)" : "transparent",
                      border: "none",
                      color: isActive ? NAVY : MUTED,
                      fontSize: 13, fontWeight: isActive ? 600 : 400, textAlign: "left"
                    }}
                  >
                    {Icon && <Icon className="h-4 w-4" style={{ color: isActive ? GOLD : MUTED }} />}
                    {!Icon && <BookOpen className="h-4 w-4" style={{ color: isActive ? GOLD : MUTED }} />}
                    <span className="flex-1 truncate">{domain.label}</span>
                    <span style={{ fontSize: 10, color: MUTED, opacity: 0.7 }}>{domain.count}</span>
                  </button>
                );
              })}
            </nav>

            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: MUTED, marginBottom: 12, paddingLeft: 4, marginTop: 24 }}>Urgency</div>
            <nav className="space-y-0.5">
              {URGENCY_FILTERS.map((u) => {
                const isActive = activeUrgency === u.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => setActiveUrgency(u.id)}
                    style={{ 
                      width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", 
                      background: isActive ? "rgba(0,0,0,0.03)" : "transparent",
                      border: "none",
                      color: isActive ? NAVY : MUTED,
                      fontSize: 13, fontWeight: isActive ? 600 : 400, textAlign: "left"
                    }}
                  >
                    <span className="flex items-center gap-1.5">
                      {u.id === "critical" && <span className="w-2 h-2 rounded-full" style={{ background: "#EF4444" }} />}
                      {u.id === "high" && <span className="w-2 h-2 rounded-full" style={{ background: GOLD }} />}
                      {u.id === "standard" && <span className="w-2 h-2 rounded-full" style={{ background: TEAL }} />}
                      {u.label}
                    </span>
                    {"count" in u && <span style={{ fontSize: 10, color: MUTED, opacity: 0.7, marginLeft: "auto" }}>{u.count}</span>}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b" style={{ borderColor: BORDER }}>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: MUTED }} />
              <input
                type="text"
                placeholder="Search 170 playbooks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%", padding: "10px 12px 10px 40px", fontSize: 14,
                  border: `1px solid ${BORDER}`, background: "white", outline: "none"
                }}
              />
            </div>
            <div className="flex items-center gap-3">
              <span style={{ fontSize: 11, fontWeight: 600, color: MUTED }}>URGENCY:</span>
              <div className="flex bg-black/5 p-1 rounded">
                {URGENCY_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setActiveUrgency(f.id)}
                    style={{
                      padding: "4px 10px", fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                      color: activeUrgency === f.id ? NAVY : MUTED,
                      background: activeUrgency === f.id ? "white" : "transparent",
                      boxShadow: activeUrgency === f.id ? "0 1px 2px rgba(0,0,0,0.1)" : "none",
                      borderRadius: 2
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ border: `1px solid ${BORDER}`, background: "#fff" }} className="overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: OFF, borderBottom: `1px solid ${BORDER}` }}>
                  <th className="text-left px-4 py-3 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider w-12">#</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Playbook Title</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider hidden md:table-cell">Business Domain</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider hidden lg:table-cell">Target Execution</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider hidden sm:table-cell">Urgency</th>
                  <th className="px-4 py-3 w-20" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E4DC]">
                {publicTeasers.length === 0 && (templates || []).length === 0 ? (
                  [1,2,3,4,5].map((i) => (
                    <tr key={i} className="bg-white animate-pulse">
                      <td className="px-4 py-4"><div className="h-5 w-8 bg-gray-100 rounded" /></td>
                      <td className="px-4 py-4"><div className="h-4 w-48 bg-gray-100 rounded" /></td>
                      <td className="px-4 py-4 hidden md:table-cell"><div className="h-4 w-24 bg-gray-100 rounded" /></td>
                      <td className="px-4 py-4 hidden lg:table-cell"><div className="h-4 w-16 bg-gray-100 rounded" /></td>
                      <td className="px-4 py-4 hidden sm:table-cell"><div className="h-5 w-16 bg-gray-100 rounded" /></td>
                      <td className="px-4 py-4" />
                    </tr>
                  ))
                ) : publicTeasers.map((pb, idx) => (
                  <tr
                    key={pb.id}
                    className="bg-white hover:bg-[#F8F7F4] transition-colors group cursor-pointer"
                    onClick={() => setLocation(`/playbook-library/${pb.id}`)}
                  >
                    <td className="px-4 py-4">
                      <span style={{ ...CG, fontSize: 20, color: GOLD, fontWeight: 600 }}>{idx + 1}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span style={{ fontWeight: 600, color: NAVY }}>{pb.name}</span>
                        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "2px 7px", background: "rgba(201,168,76,0.12)", color: GOLD, border: `1px solid rgba(201,168,76,0.3)` }}>
                          Free Preview
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{pb.description?.slice(0, 80)}{(pb.description?.length || 0) > 80 ? "…" : ""}</div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span style={{ fontSize: 10, padding: "3px 8px", background: "white", color: NAVY, fontWeight: 700, textTransform: "uppercase", border: `1px solid ${BORDER}` }}>
                        {pb.domain || pb.category || "General"}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span style={{ color: TEAL, fontWeight: 600, fontSize: 12 }}>~{pb.avgResponseTimeSeconds ? Math.round(pb.avgResponseTimeSeconds / 60) : 12}m</span>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <UrgencyBadge urgency="critical" />
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-[#0A0F2E] hover:text-white">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}

                <tr style={{ background: OFF }}>
                  <td colSpan={6} className="px-4 py-6 text-center">
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                      <Lock className="h-4 w-4" style={{ color: "#6B7280" }} />
                      <span style={{ fontSize: 13, color: NAVY }}>
                        <strong>+ {Math.max(0, (activeDomainInfo?.count || 170) - publicTeasers.length)} more playbooks</strong> — sign in to unlock the full library
                      </span>
                      <Button
                        size="sm"
                        onClick={() => window.location.href = "/api/login"}
                        style={{ background: NAVY, color: "#fff", borderRadius: 0, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}
                        className="hover:bg-[#141B45]"
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
                <BookOpen className="h-4 w-4" style={{ color: TEAL }} />
                <span className="text-sm font-bold" style={{ color: NAVY }}>Full Library — {searchFiltered.length} playbooks</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchFiltered.slice(0, 12).map((pb) => (
                  <div
                    key={pb.id}
                    style={{ border: `1px solid ${BORDER}`, background: "white" }}
                    className="p-4 hover:shadow-md hover:border-[#C9A84C] transition-all cursor-pointer"
                    onClick={() => setLocation(`/playbooks/${pb.id}/preview`)}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span style={{ fontSize: 10, padding: "2px 6px", background: "white", color: NAVY, fontWeight: 700, textTransform: "uppercase", border: `1px solid ${BORDER}` }}>
                        {pb.domain || "General"}
                      </span>
                      <span style={{ color: GOLD, fontSize: 12, fontWeight: 600 }} className="whitespace-nowrap">~{pb.avgResponseTimeSeconds ? Math.round(pb.avgResponseTimeSeconds / 60) : 12}m</span>
                    </div>
                    <h3 style={{ color: NAVY }} className="text-sm font-semibold leading-snug mb-1 line-clamp-2">{pb.name}</h3>
                    <p style={{ color: MUTED }} className="text-xs line-clamp-2">{pb.description}</p>
                    <div className="flex items-center gap-1 mt-3">
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", background: "rgba(43,138,110,0.1)", color: TEAL, textTransform: "uppercase", border: `1px solid rgba(43,138,110,0.2)` }}>Validated</span>
                      <ChevronRight className="h-3.5 w-3.5 ml-auto" style={{ color: MUTED }} />
                    </div>
                  </div>
                ))}
              </div>
              {searchFiltered.length > 12 && (
                <div className="text-center mt-4">
                  <Button variant="outline" size="sm" onClick={() => setLocation("/identify/playbook-library")} style={{ borderRadius: 0 }}>
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
        <div style={{ background: NAVY }} className="mt-12">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div style={{ ...CG, color: "white" }} className="text-xl font-semibold mb-1">VaughnMartin</div>
                <div style={{ color: GOLD, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }} className="mb-4">Execution OS</div>
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