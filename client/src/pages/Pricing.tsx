import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Check,
  X,
  ArrowRight,
  TrendingUp,
  Shield,
  Zap,
  Users,
  Building2,
  Sparkles,
  Play,
  FileText
} from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { updatePageMetadata } from "@/lib/seo";
import StandardNav from "@/components/layout/StandardNav";
import { BrandStamp } from "@/components/BrandStamp";

export default function Pricing() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    updatePageMetadata({
      title: "Enterprise Pricing - Execution OS | Strategic Execution Operating System",
      description: "Premium tiered pricing for Fortune 1000 companies. Enterprise ($250K), Enterprise Plus ($450K), Global ($750K-$1.5M). Founding Partner Pilot Program ($75K, 100% credited to Year 1) available Q1 2026.",
      ogTitle: "Execution OS Enterprise Pricing - Built for Fortune 1000",
      ogDescription: "Category-defining Executive Decision Operations platform with value-aligned premium pricing. Three tiers from $250K-$1.5M annually.",
    });
  }, []);

  return (
    <div className="page-background min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <StandardNav />

      {/* Hero */}
      <section className="py-20 px-6 text-gray-900">
        <div className="max-w-5xl mx-auto text-center">
          <BrandStamp variant="dual" size="md" className="mb-8" />
          <Badge className="mb-6 bg-cyan-500 text-gray-900 border-0 text-lg px-6 py-2" data-testid="badge-pricing">
            Enterprise Pricing
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900" data-testid="heading-pricing">
            Built for Fortune 1000
          </h1>
          <p className="text-2xl text-blue-800 mb-4">
            Transparent, value-based pricing for enterprise decision velocity
          </p>
          <p className="text-lg text-blue-800 max-w-3xl mx-auto">
            Execution OS is purpose-built for large enterprises executing complex strategic decisions. Our pricing reflects the platform's ability to deliver 360x faster execution and preserve millions in revenue.
          </p>
        </div>
      </section>

      {/* Founding Partner Pilot Program */}
      <section className="py-20 px-6 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-emerald-600 text-white text-base px-4 py-2">
              Q1 2026 Founding Partner Program
            </Badge>
            <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              Join Our Founding Partners
            </h2>
            <p className="text-xl text-gray-800 dark:text-slate-300 max-w-3xl mx-auto">
              We're selecting 10 Fortune 1000 companies for our 90-day validation program. Full platform access, dedicated implementation support, 100% pilot fee credited toward Year 1.
            </p>
          </div>

          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-500" data-testid="card-early-access">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-3xl font-bold text-slate-900 dark:text-white">
                  Founding Partner Pilot
                </CardTitle>
                <div className="text-right">
                  <div className="text-4xl font-bold text-emerald-700">$75K</div>
                  <div className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">100% credited to Year 1</div>
                  <div className="text-xs text-gray-800 dark:text-slate-300">90-day pilot</div>
                </div>
              </div>
              <p className="text-slate-700 dark:text-slate-300">
                Strategic validation partnership with full platform access, dedicated implementation support, and executive-level partnership
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-700" />
                    What's Included
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <Check className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                      <span>Full platform access (all features unlocked)</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <Check className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                      <span>Dedicated implementation team</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <Check className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                      <span>Custom playbook development (3 scenarios)</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <Check className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                      <span>Strategic execution coaching</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <Check className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                      <span>Weekly success reviews</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <Check className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                      <span>ROI measurement & documentation</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-700" />
                    Qualification Criteria
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <Check className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                      <span>Fortune 1000 company</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <Check className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                      <span>VP+ decision authority</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <Check className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                      <span>Active strategic execution challenges</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <Check className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                      <span>Commitment to 90-day validation</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <Check className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                      <span>Willingness to provide feedback</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4 mb-6 border border-green-200 dark:border-green-800">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-slate-700 dark:text-slate-300">
                    <span className="font-semibold">Post-Pilot Conversion:</span> Founding Partners receive 100% pilot fee credit toward Year 1, preferred pricing, and ongoing strategic support when converting to annual licenses.
                  </div>
                </div>
              </div>
              <Button 
                size="lg" 
                onClick={() => setLocation("/contact")}
                className="w-full bg-green-600 hover:bg-green-700 text-gray-900 text-lg py-6"
                data-testid="button-apply-early-access"
              >
                Apply for Founding Partner Pilot <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Post-Pilot Pricing */}
      <section className="py-20 px-6 bg-slate-100 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-600 text-white text-base px-4 py-2">
              Post-Pilot Enterprise Pricing
            </Badge>
            <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              Transparent, Value-Based Tiers
            </h2>
            <p className="text-xl text-gray-800 dark:text-slate-300 max-w-3xl mx-auto">
              Premium pricing for enterprise scale. No hidden fees. No per-user charges. Unlimited scenarios and executions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Enterprise Tier */}
            <Card className="border-2 border-blue-200 dark:border-blue-800" data-testid="card-tier-enterprise">
              <CardHeader className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
                <div className="text-center">
                  <Badge className="mb-3 bg-blue-600 text-gray-900">Enterprise</Badge>
                  <div className="text-sm text-gray-800 dark:text-slate-300 mb-2">1,000-5,000 employees</div>
                  <div className="flex items-baseline justify-center gap-2 mb-1">
                    <div className="text-5xl font-bold text-slate-900 dark:text-white">$250K</div>
                  </div>
                  <div className="text-sm text-gray-800 dark:text-slate-300">per year</div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-5 h-5 text-blue-800 flex-shrink-0 mt-0.5" />
                    <span>Full platform access</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-5 h-5 text-blue-800 flex-shrink-0 mt-0.5" />
                    <span>AI Intelligence Suite</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-5 h-5 text-blue-800 flex-shrink-0 mt-0.5" />
                    <span>24/7 monitoring system</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-5 h-5 text-blue-800 flex-shrink-0 mt-0.5" />
                    <span>Customer success manager</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-5 h-5 text-blue-800 flex-shrink-0 mt-0.5" />
                    <span>Quarterly business reviews</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-5 h-5 text-blue-800 flex-shrink-0 mt-0.5" />
                    <span>99.9% uptime SLA</span>
                  </li>
                </ul>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-gray-900"
                  onClick={() => setLocation("/contact")}
                  data-testid="button-enterprise-tier"
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plus Tier */}
            <Card className="border-2 border-purple-500 dark:border-purple-600 shadow-xl relative" data-testid="card-tier-enterprise-plus">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-purple-600 text-gray-900 px-4 py-1 text-sm">Most Popular</Badge>
              </div>
              <CardHeader className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
                <div className="text-center">
                  <Badge className="mb-3 bg-purple-600 text-gray-900">Enterprise Plus</Badge>
                  <div className="text-sm text-gray-800 dark:text-slate-300 mb-2">5,000-15,000 employees</div>
                  <div className="flex items-baseline justify-center gap-2 mb-1">
                    <div className="text-5xl font-bold text-slate-900 dark:text-white">$450K</div>
                  </div>
                  <div className="text-sm text-gray-800 dark:text-slate-300">per year</div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-5 h-5 text-purple-800 flex-shrink-0 mt-0.5" />
                    <span><strong>Everything in Enterprise, plus:</strong></span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-5 h-5 text-purple-800 flex-shrink-0 mt-0.5" />
                    <span>Multi-division coordination</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-5 h-5 text-purple-800 flex-shrink-0 mt-0.5" />
                    <span>Advanced integration hub</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-5 h-5 text-purple-800 flex-shrink-0 mt-0.5" />
                    <span>Priority support (2-hour SLA)</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-5 h-5 text-purple-800 flex-shrink-0 mt-0.5" />
                    <span>Custom playbook development</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-5 h-5 text-purple-800 flex-shrink-0 mt-0.5" />
                    <span>Executive briefing service</span>
                  </li>
                </ul>
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-gray-900"
                  onClick={() => setLocation("/contact")}
                  data-testid="button-enterprise-plus-tier"
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>

            {/* Global Tier */}
            <Card className="border-2 border-slate-300 dark:border-slate-700" data-testid="card-tier-global">
              <CardHeader className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50">
                <div className="text-center">
                  <Badge className="mb-3 bg-gray-50 text-gray-900">Global</Badge>
                  <div className="text-sm text-gray-800 dark:text-slate-300 mb-2">15,000+ employees</div>
                  <div className="flex items-baseline justify-center gap-2 mb-1">
                    <div className="text-4xl font-bold text-slate-900 dark:text-white">Custom</div>
                  </div>
                  <div className="text-sm text-gray-800 dark:text-slate-300">$750K - $1.5M+/year</div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-5 h-5 text-slate-700 flex-shrink-0 mt-0.5" />
                    <span><strong>Everything in Enterprise Plus, plus:</strong></span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-5 h-5 text-slate-700 flex-shrink-0 mt-0.5" />
                    <span>Multi-region orchestration</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-5 h-5 text-slate-700 flex-shrink-0 mt-0.5" />
                    <span>White-glove implementation</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-5 h-5 text-slate-700 flex-shrink-0 mt-0.5" />
                    <span>Dedicated account team</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-5 h-5 text-slate-700 flex-shrink-0 mt-0.5" />
                    <span>Custom SLA agreements</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-5 h-5 text-slate-700 flex-shrink-0 mt-0.5" />
                    <span>On-premise deployment option</span>
                  </li>
                </ul>
                <Button 
                  className="w-full bg-gray-50 hover:bg-slate-800 text-white"
                  onClick={() => setLocation("/contact")}
                  data-testid="button-global-tier"
                >
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Feature Comparison Matrix */}
          <Card className="mb-12 bg-white dark:bg-slate-900 border-2 overflow-hidden">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-slate-900 dark:text-white">Detailed Feature Comparison</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                      <th className="text-left p-4 font-semibold text-slate-900 dark:text-white w-[30%]">Feature</th>
                      <th className="text-center p-4 font-semibold text-blue-800 dark:text-blue-400">Enterprise ($250K)</th>
                      <th className="text-center p-4 font-semibold text-purple-800 dark:text-purple-400">Enterprise Plus ($450K)</th>
                      <th className="text-center p-4 font-semibold text-slate-700 dark:text-slate-300">Global (Custom)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { category: "Core Platform", rows: [
                        { feature: "Full Platform Access", values: ["check", "check", "check"] },
                        { feature: "AI Intelligence Suite", values: ["check", "check", "check"] },
                        { feature: "24/7 Monitoring", values: ["check", "check", "check"] },
                      ]},
                      { category: "Playbooks", rows: [
                        { feature: "Playbook Library", values: ["170", "170", "170+Custom"] },
                        { feature: "Custom Playbooks", values: ["5", "Unlimited", "Unlimited"] },
                        { feature: "Playbook Versioning", values: ["check", "check", "check"] },
                      ]},
                      { category: "Execution", rows: [
                        { feature: "Max Stakeholders", values: ["50", "200", "Unlimited"] },
                        { feature: "Concurrent Executions", values: ["3", "10", "Unlimited"] },
                        { feature: "Practice Drills", values: ["Monthly", "Weekly", "Daily"] },
                      ]},
                      { category: "Intelligence", rows: [
                        { feature: "AI Signal Detection", values: ["check", "check", "check"] },
                        { feature: "Pattern Analysis", values: ["Basic", "Advanced", "Enterprise"] },
                        { feature: "Board Briefings", values: ["Quarterly", "Monthly", "On-demand"] },
                      ]},
                      { category: "Support", rows: [
                        { feature: "SLA", values: ["99.9%", "99.95%", "99.99%"] },
                        { feature: "Support Response", values: ["24h", "2h", "1h"] },
                        { feature: "Dedicated CSM", values: ["check", "check", "✓ + Account Team"] },
                      ]},
                      { category: "Integration", rows: [
                        { feature: "Enterprise Integrations", values: ["5", "Unlimited", "Unlimited"] },
                        { feature: "API Access", values: ["Standard", "Premium", "Custom"] },
                        { feature: "On-Premise Option", values: ["x", "x", "check"] },
                      ]},
                    ].map((group, gi) => (
                      <>{/* Fragment for group */}
                        <tr key={`cat-${gi}`} className="bg-slate-100 dark:bg-slate-800">
                          <td colSpan={4} className="p-3 font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                            {group.category}
                          </td>
                        </tr>
                        {group.rows.map((row, ri) => (
                          <tr
                            key={`row-${gi}-${ri}`}
                            className={ri % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50 dark:bg-slate-900/50"}
                          >
                            <td className="p-4 text-slate-700 dark:text-slate-300">{row.feature}</td>
                            {row.values.map((val, vi) => (
                              <td key={vi} className="p-4 text-center">
                                {val === "check" ? (
                                  <Check className="h-5 w-5 text-emerald-700 mx-auto" />
                                ) : val === "x" ? (
                                  <X className="h-5 w-5 text-red-400 mx-auto" />
                                ) : (
                                  <span className="text-slate-900 dark:text-slate-200 font-medium">{val}</span>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Add-On Modules */}
          <Card className="max-w-5xl mx-auto bg-white dark:bg-slate-900 border-2">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Optional Add-On Modules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">Premium Integration Hub</h3>
                      <p className="text-sm text-gray-800 dark:text-slate-300">Unlimited connectors, bi-directional sync</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-800">+$50K</div>
                      <div className="text-xs text-gray-800 dark:text-slate-200">per year</div>
                    </div>
                  </div>
                </div>
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">White-Glove Implementation</h3>
                      <p className="text-sm text-gray-800 dark:text-slate-300">Custom playbooks, training, change management</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-800">$150K-$300K</div>
                      <div className="text-xs text-gray-800 dark:text-slate-200">one-time</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Value Justification - NEW SECTION */}
      <section className="py-20 px-6 text-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-amber-500 text-gray-900 text-base px-4 py-2">
              Value Justification
            </Badge>
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              One Event Pays for Years of Execution OS
            </h2>
            <p className="text-xl text-blue-800 max-w-3xl mx-auto">
              A single prevented crisis or captured opportunity delivers multiples of your annual investment
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <Shield className="h-10 w-10 text-red-400 mb-4" />
                <div className="text-sm font-semibold text-red-300 mb-2">Single Crisis Prevented</div>
                <div className="text-4xl font-bold text-gray-900 mb-2">$5-50M</div>
                <div className="text-sm text-blue-800">in value protected</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <TrendingUp className="h-10 w-10 text-green-400 mb-4" />
                <div className="text-sm font-semibold text-green-300 mb-2">Market Opportunity Won</div>
                <div className="text-4xl font-bold text-gray-900 mb-2">$10-100M</div>
                <div className="text-sm text-blue-800">in new revenue captured</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <Zap className="h-10 w-10 text-amber-400 mb-4" />
                <div className="text-sm font-semibold text-amber-300 mb-2">Product Launch Acceleration</div>
                <div className="text-4xl font-bold text-gray-900 mb-2">$5-20M</div>
                <div className="text-sm text-blue-800">in time-to-market value</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <Users className="h-10 w-10 text-purple-400 mb-4" />
                <div className="text-sm font-semibold text-purple-300 mb-2">M&A Integration Synergy</div>
                <div className="text-4xl font-bold text-gray-900 mb-2">$50-200M</div>
                <div className="text-sm text-blue-800">in synergy capture</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <Building2 className="h-10 w-10 text-cyan-400 mb-4" />
                <div className="text-sm font-semibold text-cyan-300 mb-2">Decision Velocity Improvement</div>
                <div className="text-4xl font-bold text-gray-900 mb-2">$500K-1M</div>
                <div className="text-sm text-blue-800">per year in better execution</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <FileText className="h-10 w-10 text-blue-400 mb-4" />
                <div className="text-sm font-semibold text-blue-300 mb-2">Compliance Automation</div>
                <div className="text-4xl font-bold text-gray-900 mb-2">$100-300K</div>
                <div className="text-sm text-blue-800">per year in risk reduction</div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-lg text-blue-800 max-w-3xl mx-auto">
              <span className="font-semibold text-gray-900">The math is simple:</span> Your $250K-$1.5M annual investment pays for itself with a single successful response. Everything after that is pure value creation.
            </p>
          </div>
        </div>
      </section>

      {/* Unit Economics Section - NEW */}
      <section className="py-16 px-6 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
              Implementation & Payback
            </h2>
            <p className="text-lg text-gray-800 dark:text-slate-300">
              Fast deployment, rapid time-to-value
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center border-2">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-blue-800 dark:text-blue-400 mb-2">8-12</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Weeks</div>
                <div className="text-xs text-gray-800 dark:text-slate-300">Implementation Timeline</div>
              </CardContent>
            </Card>

            <Card className="text-center border-2">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-emerald-700 dark:text-green-400 mb-2">3-4</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Months</div>
                <div className="text-xs text-gray-800 dark:text-slate-300">Payback Period</div>
              </CardContent>
            </Card>

            <Card className="text-center border-2">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-purple-800 dark:text-purple-400 mb-2">4-6</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Weeks</div>
                <div className="text-xs text-gray-800 dark:text-slate-300">Training & Onboarding</div>
              </CardContent>
            </Card>

            <Card className="text-center border-2">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-[#C9A84C] dark:text-amber-400 mb-2">120%+</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white mb-1">NRR</div>
                <div className="text-xs text-gray-800 dark:text-slate-300">Net Revenue Retention</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ROI Justification */}
      <section className="py-20 px-6 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              Return on Investment
            </h2>
            <p className="text-xl text-gray-800 dark:text-slate-300 max-w-3xl mx-auto">
              Execution OS typically delivers 79x ROI in the first year through faster execution and revenue preservation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-2 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <div className="text-sm font-semibold text-blue-800 dark:text-blue-400 mb-2">Competitive Responses</div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">$9.6M</div>
                <div className="text-sm text-gray-800 dark:text-slate-300 mb-4">
                  4 responses/year × $2.4M avg deal preservation
                </div>
                <div className="text-xs text-gray-800 dark:text-slate-300">
                  Days → minutes coordination enables capturing time-sensitive opportunities
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-2 border-purple-200 dark:border-purple-800">
              <CardContent className="p-6">
                <div className="text-sm font-semibold text-purple-800 dark:text-purple-400 mb-2">Regulatory Compliance</div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">$10M</div>
                <div className="text-sm text-gray-800 dark:text-slate-300 mb-4">
                  2 responses/year × $5M avg risk avoidance
                </div>
                <div className="text-xs text-gray-800 dark:text-slate-300">
                  Trigger-activated playbooks ensure compliance windows aren't missed
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-800">
              <CardContent className="p-6">
                <div className="text-sm font-semibold text-emerald-700 dark:text-green-400 mb-2">M&A Opportunities</div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">$20M</div>
                <div className="text-sm text-gray-800 dark:text-slate-300 mb-4">
                  1 response/year × $20M avg value capture
                </div>
                <div className="text-xs text-gray-800 dark:text-slate-300">
                  Pre-built acquisition playbooks enable decisive action when targets appear
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-cyan-600 text-gray-900">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="text-sm font-semibold text-blue-800 mb-2">Total Annual Value</div>
                  <div className="text-6xl font-bold mb-2">$39.6M</div>
                  <div className="text-blue-800 mb-4">
                    Average customer captures $39.6M in value annually through Execution OS
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                    <div className="text-sm text-blue-800 mb-1">Return on Investment</div>
                    <div className="text-3xl font-bold">79x ROI</div>
                    <div className="text-sm text-blue-800 mt-1">Get $79 for every $1 invested</div>
                  </div>
                </div>
                <div className="space-y-3 text-blue-50">
                  <p className="text-sm">
                    <span className="font-semibold">Conservative estimate:</span> These numbers reflect conservative industry benchmarks and documented strategic execution failures.
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Your actual ROI:</span> Will vary based on your industry, deal sizes, and execution challenges. Founding Partner pilots measure actual value for your organization.
                  </p>
                  <Button 
                    size="lg" 
                    onClick={() => setLocation("/contact")}
                    className="bg-white text-blue-800 hover:bg-blue-50 w-full mt-4"
                    data-testid="button-calculate-roi"
                  >
                    Calculate Your ROI <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-slate-100 dark:bg-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white">
            Ready to Transform Your Strategic Execution?
          </h2>
          <p className="text-xl text-gray-800 dark:text-slate-300 mb-8">
            Join our Q1 2026 Founding Partner Pilot Program or schedule a personalized pricing consultation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg" 
              onClick={() => setLocation("/contact")}
              className="bg-blue-600 hover:bg-blue-700 text-gray-900 text-lg px-10 py-6"
              data-testid="button-apply-now"
            >
              Apply for Founding Partner Pilot <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              onClick={() => setLocation("/industry-demos")}
              variant="outline"
              className="border-2 border-emerald-500 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-lg px-10 py-6"
              data-testid="button-view-demos"
            >
              <Play className="mr-2 h-5 w-5" />
              View 9 Industry Demos
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-6 text-sm text-gray-800 dark:text-slate-300">
            <button 
              onClick={() => setLocation("/playbook-library")}
              className="underline hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
              data-testid="link-playbook-library"
            >
              <FileText className="h-4 w-4" />
              Explore 170 Strategic Playbooks
            </button>
            <span>•</span>
            <button 
              onClick={() => setLocation("/demo")}
              className="underline hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              data-testid="link-watch-demo"
            >
              Watch live demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
