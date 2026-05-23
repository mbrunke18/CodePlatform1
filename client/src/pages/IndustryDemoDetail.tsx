import { useEffect } from "react";
import { Link, useParams } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updatePageMetadata } from "@/lib/seo";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Clapperboard,
  Clock3,
  Cpu,
  Factory,
  GraduationCap,
  Hammer,
  HeartPulse,
  Landmark,
  Leaf,
  Plane,
  Radio,
  Rocket,
  Shield,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Target,
  Truck,
  Zap,
} from "lucide-react";
import { getIndustryDemoBySlug, type DemoDomain } from "@/data/industryDemoBlueprints";

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

const domainStyle: Record<DemoDomain, string> = {
  "Growth & Positioning": "bg-[#2B8A6E]/10 text-[#2B8A6E] border-[#2B8A6E]/20",
  "Risk & Resilience": "bg-[#0A0F2E]/10 text-[#C9A84C] border-[#0A0F2E]/20",
  Transformation: "bg-[#0A0F2E]/10 text-[#0A0F2E] border-[#0A0F2E]/20",
};

export default function IndustryDemoDetail() {
  const { industrySlug } = useParams<{ industrySlug: string }>();
  const demo = getIndustryDemoBySlug(industrySlug);

  useEffect(() => {
    if (!demo) return;
    updatePageMetadata({
      title: `${demo.industry} Demo Blueprint | VaughnMartin Readiness OS`,
      description: `${demo.scenarioTitle}. ${demo.signalAdvantage}`,
      canonicalPath: `/industry-demo/${demo.slug}`,
    });
  }, [demo]);

  if (!demo) {
    return (
      <PageLayout>
        <div className="min-h-[70vh] bg-[#F8F7F4] flex items-center justify-center px-6">
          <div className="max-w-xl bg-white border border-[#E5E7EB] p-8 text-center">
            <h1 className="text-2xl font-semibold text-[#0A0F2E] mb-3" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              Industry Demo Not Found
            </h1>
            <p className="text-[#6B7280] mb-6">
              That demo blueprint does not exist yet. Return to the full library to pick another scenario.
            </p>
            <Link href="/industry-demo-library">
              <Button className="rounded-none bg-[#0A0F2E] hover:bg-[#111b4f] text-white">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Demo Library
              </Button>
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  const Icon = iconMap[demo.icon as keyof typeof iconMap] || Building2;

  return (
    <PageLayout>
      <div className="min-h-screen bg-[#F8F7F4]">
        <section className="bg-[#0A0F2E] border-b border-white/10">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <Link href="/industry-demo-library">
              <button className="inline-flex items-center gap-2 text-[#C9A84C] text-sm mb-6 hover:text-[#E7CD86]">
                <ArrowLeft className="w-4 h-4" /> All Industry Demos
              </button>
            </Link>

            <div className="flex flex-wrap items-center gap-4 mb-5">
              <div className="w-12 h-12 border border-[#C9A84C]/30 bg-[#C9A84C]/10 flex items-center justify-center">
                <Icon className="w-6 h-6 text-[#C9A84C]" />
              </div>
              <div>
                <h1 className="text-4xl text-[#F0EDE4] font-semibold" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                  {demo.industry} Demo Blueprint
                </h1>
                <p className="text-sm uppercase tracking-widest text-[#AAB2C7]">{demo.industryGroup}</p>
              </div>
            </div>

            <Badge className={`border rounded-none text-xs uppercase tracking-wider mb-4 ${domainStyle[demo.domain]}`}>{demo.domain}</Badge>
            <h2 className="text-2xl text-[#F0EDE4] font-semibold mb-3" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              {demo.scenarioTitle}
            </h2>
            <p className="text-[#C7CDDB] max-w-4xl leading-relaxed">{demo.triggerEvent}</p>

            <div className="grid md:grid-cols-3 gap-4 mt-8">
              <div className="border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-widest text-[#AAB2C7] mb-1">Executive Owner</div>
                <div className="text-sm text-[#F0EDE4]">{demo.executiveOwner}</div>
              </div>
              <div className="border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-widest text-[#AAB2C7] mb-1">Mobilization Window</div>
                <div className="text-sm text-[#F0EDE4]">{demo.mobilizationWindow}</div>
              </div>
              <div className="border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-widest text-[#AAB2C7] mb-1">Signal Advantage</div>
                <div className="text-sm text-[#F0EDE4]">{demo.signalAdvantage}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-10 space-y-8">
          <div className="bg-white border border-[#E7E4DC] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-[#C9A84C]" />
              <h3 className="text-lg font-semibold text-[#0A0F2E]">What AI Monitors</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {demo.aiMonitors.map((signal) => (
                <div key={signal} className="flex items-start gap-2 border border-[#F1EEE6] bg-[#FCFBF9] p-3">
                  <AlertTriangle className="w-4 h-4 text-[#C9A84C] mt-0.5" />
                  <p className="text-sm text-[#374151]">{signal}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#E7E4DC] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-[#2B8A6E]" />
              <h3 className="text-lg font-semibold text-[#0A0F2E]">Executive Authorizations</h3>
            </div>
            <div className="space-y-3">
              {demo.executiveAuthorizations.map((item, idx) => (
                <div key={item} className="flex items-start gap-3 border-l-2 border-[#2B8A6E]/30 pl-4">
                  <div className="w-6 h-6 shrink-0 rounded-full border border-[#2B8A6E]/30 bg-[#2B8A6E]/10 text-[#2B8A6E] text-xs font-semibold flex items-center justify-center">
                    {idx + 1}
                  </div>
                  <p className="text-sm text-[#374151]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#E7E4DC] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock3 className="w-4 h-4 text-[#0A0F2E]" />
              <h3 className="text-lg font-semibold text-[#0A0F2E]">12-Minute Execution Cascade</h3>
            </div>
            <div className="space-y-3">
              {demo.executionCascade.map((item, idx) => (
                <div key={item} className="grid grid-cols-[70px_1fr] gap-3 items-start">
                  <div className="text-xs uppercase tracking-wider text-[#9CA3AF]">T+{idx * 3} min</div>
                  <div className="text-sm text-[#374151] border-b border-[#F3F4F6] pb-3">{item}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#E7E4DC] p-6">
            <h3 className="text-lg font-semibold text-[#0A0F2E] mb-4">Measured Outcome Delta</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-[#E5E7EB]">
                    <th className="pb-2 font-semibold text-[#374151]">Metric</th>
                    <th className="pb-2 font-semibold text-[#9CA3AF]">Traditional Response</th>
                    <th className="pb-2 font-semibold text-[#2B8A6E]">With Readiness OS</th>
                  </tr>
                </thead>
                <tbody>
                  {demo.outcomeMetrics.map((row) => (
                    <tr key={row.label} className="border-b border-[#F3F4F6]">
                      <td className="py-3 pr-4 text-[#111827]">{row.label}</td>
                      <td className="py-3 pr-4 text-[#6B7280]">{row.traditional}</td>
                      <td className="py-3 text-[#2B8A6E] font-medium">{row.readinessOs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#E7E4DC] p-6">
              <h3 className="text-lg font-semibold text-[#0A0F2E] mb-3">Business Value for Buyers</h3>
              <div className="space-y-3">
                {demo.businessValue.map((value) => (
                  <div key={value} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2B8A6E] mt-0.5" />
                    <p className="text-sm text-[#374151]">{value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-[#E7E4DC] p-6">
              <h3 className="text-lg font-semibold text-[#0A0F2E] mb-3">Suggested Starter Protocols</h3>
              <div className="space-y-2">
                {demo.starterProtocols.map((protocol) => (
                  <div key={protocol} className="text-sm text-[#111827] border border-[#F1EEE6] bg-[#FCFBF9] px-3 py-2">
                    {protocol}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#0A0F2E] border border-[#0A0F2E] p-8 text-center">
            <h3 className="text-2xl text-[#F0EDE4] font-semibold mb-2" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              Use This Demo on Your Industry Page
            </h3>
            <p className="text-[#C9CDD8] max-w-2xl mx-auto mb-6">
              This blueprint is website-ready. It gives prospects the full trigger-to-value narrative in your “AI monitors, executives authorize” model.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/request-access">
                <Button className="rounded-none bg-[#C9A84C] hover:bg-[#d7bc73] text-[#0A0F2E]">
                  Request Guided Demo Access
                </Button>
              </Link>
              <Link href="/industry-demo-library">
                <Button variant="outline" className="rounded-none border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0A0F2E]">
                  View All Industries <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
