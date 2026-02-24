import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Quote, 
  Lightbulb, 
  Target, 
  Clock, 
  CheckCircle2,
  XCircle,
  Zap,
  BookOpen,
  Radio,
  Shield,
  Users,
  Brain,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Globe2,
  Play,
  Building2,
  Timer,
  DollarSign
} from "lucide-react";
import { Link } from "wouter";
import StandardNav from "@/components/layout/StandardNav";
import Footer from "@/components/layout/Footer";
import { useEffect } from "react";
import { updatePageMetadata } from "@/lib/seo";

export default function WhyExecution OS() {
  useEffect(() => {
    updatePageMetadata({
      title: "Why Execution OS - The Infrastructure 15 Firms Say Is Missing",
      description: "McKinsey, IBM, BCG, Deloitte, Accenture, Microsoft, Google Cloud, and the World Economic Forum all concluded: organizations fail at AI because they lack execution infrastructure. Execution OS provides it.",
      ogTitle: "The Infrastructure 15 Firms Say Is Missing | Execution OS",
      ogDescription: "Fifteen major firms independently concluded that execution infrastructure—governance, decision rights, and coordination systems—is the missing layer for AI adoption.",
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StandardNav />

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <Badge className="mb-6 bg-amber-500 text-white border-0">
            <BarChart3 className="w-4 h-4 mr-2" />
            2026 Research Consensus
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" data-testid="heading-why-executeiq">
            The Infrastructure 15 Firms Say Is Missing
          </h1>

          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-10">
            McKinsey. IBM. BCG. Deloitte. Accenture. Microsoft. Google Cloud. World Economic Forum. Bain. Anthropic. OpenAI. PwC. Gartner. Forrester. IDC. Fifteen firms, one conclusion: enterprises need execution infrastructure.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/demo-selector">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </Link>
            <Link href="/research">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                View Research
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats Bar */}
      <section className="py-8 px-6 bg-slate-100 dark:bg-slate-800 border-b border-border">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">15</div>
              <p className="text-sm text-muted-foreground">Major Firms Agree</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">170</div>
              <p className="text-sm text-muted-foreground">Pre-Built Playbooks</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">12 min</div>
              <p className="text-sm text-muted-foreground">Trigger to Execution</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: The Consensus */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-600 text-white border-0">
              <Globe2 className="w-4 h-4 mr-2" />
              The Consensus
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              What 15 Major Firms All Concluded
            </h2>
          </div>

          <Card className="border-2 border-primary/30 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-900">
            <CardContent className="p-8 md:p-12">
              <p className="text-lg md:text-xl text-foreground leading-relaxed mb-8">
                From 2025 into 2026, fifteen major consulting and technology firms independently published research on AI adoption. They all arrived at the same conclusion: Organizations aren't failing at AI because of technology. They're failing because they lack execution infrastructure—governance, decision rights, and coordination systems. This isn't speculation. It's consensus.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
                {["McKinsey", "IBM", "BCG", "Deloitte", "Accenture", "Microsoft", "Google Cloud", "WEF", "Bain", "Anthropic", "OpenAI", "PwC", "Gartner", "Forrester", "IDC"].map((firm) => (
                  <div key={firm} className="flex items-center justify-center p-3 bg-white dark:bg-slate-700 rounded-lg border border-border shadow-sm">
                    <span className="text-sm font-semibold text-foreground">{firm}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section 2: The Gap */}
      <section className="py-16 px-6 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-amber-500 text-white border-0">
              <AlertTriangle className="w-4 h-4 mr-2" />
              The Gap
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What's Missing
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="border-2 border-green-500/30 hover:border-green-500/50 transition-colors">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-foreground">What Enterprises Have</h3>
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">Already invested</p>
                  </div>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-foreground">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-lg">AI tools</span>
                  </li>
                  <li className="flex items-start gap-3 text-foreground">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-lg">Talented people</span>
                  </li>
                  <li className="flex items-start gap-3 text-foreground">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-lg">Strategic ambition</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-500/30 hover:border-red-500/50 transition-colors">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                    <XCircle className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-foreground">What They Lack</h3>
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">The missing layer</p>
                  </div>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-foreground">
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    <span className="text-lg">Pre-defined governance</span>
                  </li>
                  <li className="flex items-start gap-3 text-foreground">
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    <span className="text-lg">Clear decision rights</span>
                  </li>
                  <li className="flex items-start gap-3 text-foreground">
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    <span className="text-lg">Coordination systems</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/30">
            <CardContent className="p-8 text-center">
              <Clock className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Result: 72 hours to coordinate what should take minutes.
              </p>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Without execution infrastructure, every strategic moment is handled ad-hoc—no matter how talented the team.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section 3: The Solution */}
      <section className="py-16 px-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-emerald-500 text-white border-0">
              <Zap className="w-4 h-4 mr-2" />
              The Solution
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Execution OS Provides the Infrastructure
            </h2>
          </div>

          <Card className="bg-white/10 border-white/20 backdrop-blur mb-12">
            <CardContent className="p-8 md:p-12">
              <p className="text-lg md:text-xl text-blue-50 leading-relaxed mb-8">
                Execution OS is the execution infrastructure layer: 170 playbooks with governance, decision rights, and workflows pre-defined. Customizable to your organization. Build your own for unique situations. 12 minutes from trigger to execution. The infrastructure that makes AI actually work.
              </p>

              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                  <div className="w-14 h-14 mx-auto mb-4 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                    <BookOpen className="h-7 w-7 text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">170</div>
                  <p className="text-sm text-blue-200">Pre-built playbooks</p>
                </div>
                <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                  <div className="w-14 h-14 mx-auto mb-4 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                    <Shield className="h-7 w-7 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">Built-in</div>
                  <p className="text-sm text-blue-200">Governance & decision rights</p>
                </div>
                <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                  <div className="w-14 h-14 mx-auto mb-4 bg-amber-500/20 rounded-2xl flex items-center justify-center">
                    <Target className="h-7 w-7 text-amber-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">Custom</div>
                  <p className="text-sm text-blue-200">Build your own playbooks</p>
                </div>
                <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                  <div className="w-14 h-14 mx-auto mb-4 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                    <Timer className="h-7 w-7 text-purple-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">12 min</div>
                  <p className="text-sm text-blue-200">Trigger to execution</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Link href="/demo-selector">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                <Play className="mr-2 h-5 w-5" />
                See Execution OS in Action
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section: The Agentic Execution Layer */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-purple-600 text-white border-0">
              <Brain className="w-4 h-4 mr-2" />
              The Agentic Layer
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Not Workflow Automation. Agentic Execution.
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Execution OS isn't another tool in the stack. It's the agentic execution layer — the system where AI agents coordinate enterprise-wide response in real time, with human executives making the final call.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="border-2 border-purple-500/30 hover:border-purple-500/50 transition-colors">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                    <XCircle className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-foreground">Workflow Tools</h3>
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">Scripted, reactive, siloed</p>
                  </div>
                </div>
                <ul className="space-y-3 text-foreground">
                  <li className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    <span>Route tickets based on static rules</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    <span>Require manual escalation at every step</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    <span>No cross-functional coordination</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    <span>Can't learn from previous executions</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-emerald-500/30 hover:border-emerald-500/50 transition-colors">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-foreground">Agentic Execution (Execution OS)</h3>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Autonomous, proactive, coordinated</p>
                  </div>
                </div>
                <ul className="space-y-3 text-foreground">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span>Agents detect signals and activate playbooks</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span>Pre-authorized decisions within policy thresholds</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span>Cross-enterprise coordination in 12 minutes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span>Every execution makes the system smarter</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-500/20">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-foreground mb-4 text-center">Agent Decision Authority Spectrum</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-xl border border-border">
                  <div className="text-2xl mb-2">🔍</div>
                  <div className="font-semibold text-foreground mb-1">Assist</div>
                  <p className="text-xs text-muted-foreground">Recommend actions to executives</p>
                </div>
                <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-xl border border-border">
                  <div className="text-2xl mb-2">🔀</div>
                  <div className="font-semibold text-foreground mb-1">Coordinate</div>
                  <p className="text-xs text-muted-foreground">Route tasks + assign stakeholders</p>
                </div>
                <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-xl border border-border">
                  <div className="text-2xl mb-2">⚡</div>
                  <div className="font-semibold text-foreground mb-1">Execute</div>
                  <p className="text-xs text-muted-foreground">Trigger pre-approved workflows</p>
                </div>
                <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-xl border border-border">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="font-semibold text-foreground mb-1">Decide</div>
                  <p className="text-xs text-muted-foreground">Within policy thresholds only</p>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-4">
                Human executives retain ultimate authority. Agents operate within pre-defined governance guardrails.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary text-white border-0">
              <Lightbulb className="w-4 h-4 mr-2" />
              The Founder
            </Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Built by Someone Who Lived the Problem
            </h2>
          </div>

          <Card className="border-2 border-primary/30 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-900">
            <CardContent className="p-8 md:p-12">
              <div className="flex items-start gap-6 mb-8">
                <Quote className="h-12 w-12 text-primary shrink-0 opacity-60" />
                <blockquote className="text-lg md:text-xl text-foreground leading-relaxed italic">
                  "I coached college football for 5 years. Every game, 60-80 plays. Every 40 seconds—read the situation, call the play, execute. The speed comes from preparation. Then I spent 20 years inside Fortune 500 companies—Ford, Toyota, Lockheed Martin, Boyd Gaming, Churchill Downs, Charles Schwab. Same caliber of people. No playbooks. Every strategic moment handled ad-hoc. 15 major firms just said execution infrastructure is the bottleneck. I built the infrastructure I wish I'd had."
                </blockquote>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-4 pt-6 border-t border-border">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    MB
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-lg">Martin Brunke</p>
                    <p className="text-muted-foreground">Founder & CEO, Execution OS</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Ford</Badge>
                  <Badge variant="outline">Toyota</Badge>
                  <Badge variant="outline">Lockheed Martin</Badge>
                  <Badge variant="outline">Charles Schwab</Badge>
                  <Badge variant="outline">Boyd Gaming</Badge>
                  <Badge variant="outline">Churchill Downs</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-primary/5 to-purple-500/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to See the Infrastructure?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            See how Execution OS closes the gap between AI investment and AI results.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/demo-selector">
              <Button size="lg" className="bg-primary text-white hover:bg-primary/90">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </Link>
            <Link href="/research">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                Explore Research
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
