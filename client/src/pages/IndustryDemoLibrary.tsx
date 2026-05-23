import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updatePageMetadata } from "@/lib/seo";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Clapperboard,
  Cpu,
  Factory,
  Filter,
  GraduationCap,
  Hammer,
  HeartPulse,
  Landmark,
  Leaf,
  Plane,
  Rocket,
  Search,
  Radio,
  Shield,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Zap,
} from "lucide-react";
import {
  industryDemoBlueprints,
  industryDemoDomains,
  type DemoDomain,
  type IndustryDemoBlueprint,
} from "@/data/industryDemoBlueprints";

const iconMap = {
  Landmark,
  Cpu,
  Factory,
  Zap,
  ShoppingBag,
  HeartPulse,
  Truck,
  Radio,
  ShieldCheck,
  Clapperboard,
  Plane,
  Building2,
  Hammer,
  Leaf,
  GraduationCap,
  Shield,
  Rocket,
  BriefcaseBusiness,
} as const;

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F8F7F4";

const domainTone: Record<DemoDomain, { label: string; className: string; accent: string }> = {
  "Growth & Positioning": {
    label: "Growth & Positioning",
    className: "bg-[#2B8A6E]/10 text-[#2B8A6E] border-[#2B8A6E]/20",
    accent: TEAL,
  },
  "Risk & Resilience": {
    label: "Risk & Resilience",
    className: "bg-[#0A0F2E]/10 text-[#C9A84C] border-[#0A0F2E]/20",
    accent: GOLD,
  },
  Transformation: {
    label: "Transformation",
    className: "bg-[#0A0F2E]/10 text-[#0A0F2E] border-[#0A0F2E]/20",
    accent: NAVY,
  },
};

function IndustryCard({ item }: { item: IndustryDemoBlueprint }) {
  const Icon = iconMap[item.icon as keyof typeof iconMap] || Building2;
  const tone = domainTone[item.domain];

  return (
    <div className="border border-[#E7E4DC] bg-white p-6 rounded-none h-full flex flex-col">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 flex items-center justify-center border rounded-none"
            style={{ borderColor: `${tone.accent}33`, background: `${tone.accent}12` }}
          >
            <Icon className="w-5 h-5" style={{ color: tone.accent }} />
          </div>
          <div>
            <div className="text-sm font-semibold text-[#0A0F2E]">{item.industry}</div>
            <div className="text-[11px] uppercase tracking-wider text-[#6B7280]">{item.industryGroup}</div>
          </div>
        </div>
        <Badge className={`border rounded-none text-[10px] uppercase tracking-wider ${tone.className}`}>{tone.label}</Badge>
      </div>

      <h2 className="text-xl font-semibold text-[#0A0F2E] mb-2" style={{ fontFamily: "Cormorant Garamond, serif" }}>
        {item.scenarioTitle}
      </h2>

      <p className="text-sm text-[#4B5563] leading-relaxed mb-4 flex-1">{item.triggerEvent}</p>

      <div className="space-y-2 border-t border-[#F0EEE8] pt-3 mb-4">
        <div className="text-[11px] uppercase tracking-wider text-[#9CA3AF]">Executive Owner</div>
        <div className="text-sm font-medium text-[#111827]">{item.executiveOwner}</div>
        <div className="text-[11px] uppercase tracking-wider text-[#9CA3AF] mt-2">Execution Window</div>
        <div className="text-sm font-medium text-[#2B8A6E]">{item.mobilizationWindow}</div>
      </div>

      <Link href={`/industry-demo/${item.slug}`}>
        <Button
          variant="outline"
          className="w-full rounded-none border-[#0A0F2E] text-[#0A0F2E] hover:bg-[#0A0F2E] hover:text-white text-xs uppercase tracking-wider font-semibold"
        >
          View Full Demo Blueprint <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </div>
  );
}

export default function IndustryDemoLibrary() {
  const [domain, setDomain] = useState<DemoDomain | "All">("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    updatePageMetadata({
      title: "All-Industry Demo Library | VaughnMartin Readiness OS",
      description:
        "Explore convincing product demos across major industries. See trigger detection, executive authorization, 12-minute execution, and measurable outcomes.",
      canonicalPath: "/industry-demo-library",
    });
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return industryDemoBlueprints.filter((item) => {
      const domainMatch = domain === "All" || item.domain === domain;
      if (!domainMatch) return false;
      if (!normalized) return true;

      const target = [
        item.industry,
        item.industryGroup,
        item.scenarioTitle,
        item.triggerEvent,
        item.executiveOwner,
        ...item.starterProtocols,
      ]
        .join(" ")
        .toLowerCase();

      return target.includes(normalized);
    });
  }, [domain, query]);

  return (
    <PageLayout>
      <div className="min-h-screen" style={{ background: IVORY }}>
        <section className="border-b border-[#E5E7EB] bg-[#0A0F2E]">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#C9A84C]" />
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#C9A84C] font-semibold">Industry Demo Library</span>
            </div>
            <h1 className="text-4xl md:text-5xl text-[#F0EDE4] font-semibold mb-4" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              Full-Spectrum Industry Demos
            </h1>
            <p className="text-[#C9CDD8] max-w-3xl text-base md:text-lg leading-relaxed">
              Every demo follows the same proof path: <strong>AI monitors signals, executives authorize decisions, teams execute in 12 minutes.</strong>
              &nbsp;Use these blueprints across sales calls, investor conversations, and website pages to show clear industry value.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="border border-white/10 p-4 bg-white/5">
                <div className="text-2xl font-semibold text-[#C9A84C]">{industryDemoBlueprints.length}</div>
                <div className="text-xs uppercase tracking-widest text-[#AAB2C7]">Industries Covered</div>
              </div>
              <div className="border border-white/10 p-4 bg-white/5">
                <div className="text-2xl font-semibold text-[#C9A84C]">12 min</div>
                <div className="text-xs uppercase tracking-widest text-[#AAB2C7]">Execution Start</div>
              </div>
              <div className="border border-white/10 p-4 bg-white/5">
                <div className="text-2xl font-semibold text-[#C9A84C]">3</div>
                <div className="text-xs uppercase tracking-widest text-[#AAB2C7]">Strategic Domains</div>
              </div>
              <div className="border border-white/10 p-4 bg-white/5">
                <div className="text-2xl font-semibold text-[#C9A84C]">Ready</div>
                <div className="text-xs uppercase tracking-widest text-[#AAB2C7]">Website-Embeddable</div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-10">
          <div className="bg-white border border-[#E7E4DC] p-5 md:p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
              <div className="flex items-center gap-2 text-[#0A0F2E]">
                <Filter className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider font-semibold">Filter by domain</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={() => setDomain("All")}
                  className={`rounded-none text-xs uppercase tracking-wider ${domain === "All" ? "bg-[#0A0F2E] text-white" : "bg-white border border-[#D1D5DB] text-[#374151] hover:bg-[#F9FAFB]"}`}
                >
                  All
                </Button>
                {industryDemoDomains.map((key) => (
                  <Button
                    key={key}
                    size="sm"
                    onClick={() => setDomain(key)}
                    className={`rounded-none text-xs uppercase tracking-wider ${
                      domain === key ? "bg-[#0A0F2E] text-white" : "bg-white border border-[#D1D5DB] text-[#374151] hover:bg-[#F9FAFB]"
                    }`}
                  >
                    {key}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mt-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="pl-9 rounded-none border-[#D1D5DB] focus-visible:ring-[#C9A84C]"
                placeholder="Search industry, scenario, role, or protocol..."
              />
            </div>
          </div>

          <div className="mb-4 text-sm text-[#6B7280]">
            Showing <span className="font-semibold text-[#0A0F2E]">{filtered.length}</span> demo blueprints
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((item) => (
              <IndustryCard key={item.slug} item={item} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="border border-dashed border-[#D1D5DB] bg-white p-8 text-center">
              <p className="text-[#6B7280]">No demos matched your filter. Try another domain or keyword.</p>
            </div>
          )}
        </section>
      </div>
    </PageLayout>
  );
}
