import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Check,
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

export default function Pricing() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    updatePageMetadata({
      title: "Enterprise Pricing - M | Strategic Execution Operating System",
      description: "Premium tiered pricing for Fortune 1000 companies. Enterprise ($250K), Enterprise Plus ($450K), Global ($750K-$1.5M). Founding Partner Pilot Program ($75K, 100% credited to Year 1) available Q1 2025.",
      ogTitle: "M Enterprise Pricing - Built for Fortune 1000",
      ogDescription: "Category-defining Executive Decision Operations platform with value-aligned premium pricing. Three tiers from $250K-$1.5M annually.",
    });
  }, []);

  return (
    <div className="page-background min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <StandardNav />

      {/* Hero */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <Badge className="mb-6 bg-cyan-500 text-white border-0 text-lg px-6 py-2" data-testid="badge-pricing">
            Enterprise Pricing
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white" data-testid="heading-pricing">
            Built for Fortune 1000
          </h1>
          <p className="text-2xl text-blue-100 mb-4">
            Transparent, value-based pricing for enterprise decision velocity
          </p>
          <p className="text-lg text-blue-200 max-w-3xl mx-auto">
            M is purpose-built for large enterprises executing complex strategic decisions. Our pricing reflects the platform's ability to deliver 360x faster execution and preserve millions in revenue.
          </p>
        </div>
      </section>

      {/* Founding Partner Pilot Program */}
      <section className="py-20 px-6 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-emerald-600 text-white text-base px-4 py-2">
              Q1 2025 Founding Partner Program
            </Badge>
            <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              Join Our Founding Partners
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
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
                  <div className="text-4xl font-bold text-emerald-600">$75K</div>
                  <div className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">100% credited to Year 1</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">90-day pilot</div>
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
                    <Sparkles className="w-5 h-5 text-green-600" />
                    What's Included
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Full platform access (all features unlocked)</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Dedicated implementation team</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Custom playbook development (3 scenarios)</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Strategic execution coaching</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Weekly success reviews</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>ROI measurement & documentation</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    Qualification Criteria
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Fortune 1000 company</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>VP+ decision authority</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Active strategic execution challenges</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Commitment to 90-day validation</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Willingness to provide feedback</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4 mb-6 border border-green-200 dark:border-green-800">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-slate-700 dark:text-slate-300">
                    <span className="font-semibold">Post-Pilot Conversion:</span> Founding Partners receive 100% pilot fee credit toward Year 1, preferred pricing, and ongoing strategic support when converting to annual licenses.
                  </div>
                </div>
              </div>
              <Button 
                size="lg" 
                onClick={() => setLocation("/contact")}
                className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6"
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
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Premium pricing for enterprise scale. No hidden fees. No per-user charges. Unlimited scenarios and executions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Enterprise Tier */}
            <Card className="border-2 border-blue-200 dark:border-blue-800" data-testid="card-tier-enterprise">
              <CardHeader className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
                <div className="text-center">
                  <Badge className="mb-3 bg-blue-600 text-white">Enterprise</Badge>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">1,000-5,000 employees</div>
                  <div className="flex items-baseline justify-center gap-2 mb-1">
                    <div className="text-5xl font-bold text-slate-900 dark:text-white">$250K</div>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">per year</div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Full platform access</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>AI Intelligence Suite</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>24/7 monitoring system</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Customer success manager</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Quarterly business reviews</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>99.9% uptime SLA</span>
                  </li>
                </ul>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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
                <Badge className="bg-purple-600 text-white px-4 py-1 text-sm">Most Popular</Badge>
              </div>
              <CardHeader className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
                <div className="text-center">
                  <Badge className="mb-3 bg-purple-600 text-white">Enterprise Plus</Badge>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">5,000-15,000 employees</div>
                  <div className="flex items-baseline justify-center gap-2 mb-1">
                    <div className="text-5xl font-bold text-slate-900 dark:text-white">$450K</div>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">per year</div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Everything in Enterprise, plus:</strong></span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>Multi-division coordination</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>Advanced integration hub</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>Priority support (2-hour SLA)</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>Custom playbook development</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>Executive briefing service</span>
                  </li>
                </ul>
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
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
                  <Badge className="mb-3 bg-slate-700 text-white">Global</Badge>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">15,000+ employees</div>
                  <div className="flex items-baseline justify-center gap-2 mb-1">
                    <div className="text-4xl font-bold text-slate-900 dark:text-white">Custom</div>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">$750K - $1.5M+/year</div>
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
                  className="w-full bg-slate-700 hover:bg-slate-800 text-white"
                  onClick={() => setLocation("/contact")}
                  data-testid="button-global-tier"
                >
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>

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
                      <p className="text-sm text-slate-600 dark:text-slate-400">Unlimited connectors, bi-directional sync</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-600">+$50K</div>
                      <div className="text-xs text-slate-500">per year</div>
                    </div>
                  </div>
                </div>
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">White-Glove Implementation</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Custom playbooks, training, change management</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-600">$150K-$300K</div>
                      <div className="text-xs text-slate-500">one-time</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ROI Justification */}
      <section className="py-20 px-6 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              Return on Investment
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              M typically delivers 79x ROI in the first year through faster execution and revenue preservation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-2 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">Competitive Responses</div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">$9.6M</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  4 responses/year × $2.4M avg deal preservation
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-500">
                  Days → minutes coordination enables capturing time-sensitive opportunities
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-2 border-purple-200 dark:border-purple-800">
              <CardContent className="p-6">
                <div className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-2">Regulatory Compliance</div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">$10M</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  2 responses/year × $5M avg risk avoidance
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-500">
                  Trigger-activated playbooks ensure compliance windows aren't missed
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-800">
              <CardContent className="p-6">
                <div className="text-sm font-semibold text-green-600 dark:text-green-400 mb-2">M&A Opportunities</div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">$20M</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  1 response/year × $20M avg value capture
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-500">
                  Pre-built acquisition playbooks enable decisive action when targets appear
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="text-sm font-semibold text-blue-100 mb-2">Total Annual Value</div>
                  <div className="text-6xl font-bold mb-2">$39.6M</div>
                  <div className="text-blue-100 mb-4">
                    Average customer captures $39.6M in value annually through M
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                    <div className="text-sm text-blue-100 mb-1">Return on Investment</div>
                    <div className="text-3xl font-bold">79x ROI</div>
                    <div className="text-sm text-blue-100 mt-1">Get $79 for every $1 invested</div>
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
                    className="bg-white text-blue-600 hover:bg-blue-50 w-full mt-4"
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
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
            Join our Q1 2025 Founding Partner Pilot Program or schedule a personalized pricing consultation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg" 
              onClick={() => setLocation("/contact")}
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-10 py-6"
              data-testid="button-apply-now"
            >
              Apply for Founding Partner Pilot <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              onClick={() => setLocation("/industry-demos")}
              variant="outline"
              className="border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-lg px-10 py-6"
              data-testid="button-view-demos"
            >
              <Play className="mr-2 h-5 w-5" />
              View 9 Industry Demos
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-6 text-sm text-slate-600 dark:text-slate-400">
            <button 
              onClick={() => setLocation("/playbook-library")}
              className="underline hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
              data-testid="link-playbook-library"
            >
              <FileText className="h-4 w-4" />
              Explore 166 Strategic Playbooks
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
