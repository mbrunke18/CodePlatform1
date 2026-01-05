import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Clock, 
  Users, 
  DollarSign, 
  Zap, 
  Target, 
  BookOpen, 
  Radio,
  ArrowRight,
  Download,
  CheckCircle2,
  BarChart3,
  Shield,
  Lightbulb
} from "lucide-react";
import { Link } from "wouter";
import StandardNav from "@/components/layout/StandardNav";
import { useEffect } from "react";
import { updatePageMetadata } from "@/lib/seo";

export default function InvestorResources() {
  useEffect(() => {
    updatePageMetadata({
      title: "Investor Resources | M Strategic Execution Operating System",
      description: "Investment overview for M, the first Strategic Execution Operating System. Creating a new $5B+ software category for Fortune 1000 strategic execution.",
      ogTitle: "Invest in M - Category-Defining Opportunity",
      ogDescription: "Transform 72-hour strategic coordination into 12-minute execution. First-mover in Strategic Execution Operating System (SEOS) category.",
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StandardNav />

      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <Badge className="mb-6 bg-blue-500 text-white border-0">
            Investor Overview
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" data-testid="heading-investor">
            We're Creating a New Category
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-4 max-w-3xl mx-auto">
            <span className="font-bold">Strategic Execution Operating System (SEOS)</span>
          </p>
          
          <p className="text-lg text-blue-200 mb-8 max-w-2xl mx-auto">
            What Salesforce did for customer relationships, M does for strategic execution.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/investor-presentation">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                View Presentation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo-selector">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Key Investment Thesis */}
      <section className="py-16 px-6 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">The Investment Thesis</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* The Problem */}
            <Card className="border-2 border-red-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-500">
                  <Clock className="h-6 w-6" />
                  The Problem: 72-Hour Gap
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  When significant strategic events occur, most organizations experience:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-medium">0-4 hrs:</span>
                    <span>Discovery and initial confusion</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-medium">4-12 hrs:</span>
                    <span>Ad-hoc calls to identify who should be involved</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-medium">12-24 hrs:</span>
                    <span>Scramble to find relevant documents and data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-medium">24-48 hrs:</span>
                    <span>Debate about authority, budget, and approach</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-medium">48-72 hrs:</span>
                    <span>Finally begin coordinated response</span>
                  </li>
                </ul>
                <p className="text-foreground font-semibold pt-2">
                  This is how every Fortune 500 operates today.
                </p>
              </CardContent>
            </Card>

            {/* The Solution */}
            <Card className="border-2 border-green-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-500">
                  <Zap className="h-6 w-6" />
                  M's Solution: 12-Minute Activation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  M fundamentally changes the operating model:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-foreground">Signal detected → Pre-configured monitoring triggers alert</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-foreground">Playbook activates → Pre-staged, pre-assigned, pre-approved</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-foreground">Tasks deploy → Auto-created in Jira/ServiceNow/Asana</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-foreground">Teams execute → Clear ownership, no ambiguity</span>
                  </li>
                </ul>
                <div className="pt-4 p-4 bg-green-500/10 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-500">12 minutes</p>
                  <p className="text-sm text-muted-foreground">Coordinated response underway</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Platform Metrics</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary mb-2">166</div>
                <div className="text-sm text-muted-foreground">Strategic Playbooks</div>
                <div className="text-xs text-muted-foreground mt-1">Across 9 domains</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary mb-2">92+</div>
                <div className="text-sm text-muted-foreground">Data Points Monitored</div>
                <div className="text-xs text-muted-foreground mt-1">Real-time signals</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary mb-2">12 min</div>
                <div className="text-sm text-muted-foreground">Response Time</div>
                <div className="text-xs text-muted-foreground mt-1">vs 72 hrs industry avg</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">AI Intelligence</div>
                <div className="text-xs text-muted-foreground mt-1">Continuous monitoring</div>
              </CardContent>
            </Card>
          </div>

          {/* The 4-Phase Lifecycle */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>The M Framework: 4-Phase Lifecycle</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="h-5 w-5 text-blue-500" />
                    <span className="font-bold text-blue-500">PREPARE</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Stakeholders assigned, documents staged, budgets pre-approved, authorities delegated
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Radio className="h-5 w-5 text-cyan-500" />
                    <span className="font-bold text-cyan-500">MONITOR</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    92+ signals tracked, triggers configured, alerts routed
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="h-5 w-5 text-green-500" />
                    <span className="font-bold text-green-500">EXECUTE</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    One-click activation, auto-project creation, coordinated tasks
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="h-5 w-5 text-purple-500" />
                    <span className="font-bold text-purple-500">LEARN</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Structured debriefs, metrics captured, playbooks improved
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Value Per Event */}
      <section className="py-16 px-6 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">ROI Per Strategic Event</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              M pays for itself on the first significant event
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div className="p-4 border-r border-border">
                  <div className="text-2xl font-bold text-foreground mb-1">$10K-25K</div>
                  <div className="text-sm text-muted-foreground">Planning Elimination</div>
                  <div className="text-xs text-muted-foreground mt-1">20-50 hrs × $500/hr</div>
                </div>
                <div className="p-4 border-r border-border">
                  <div className="text-2xl font-bold text-foreground mb-1">$500K-2M</div>
                  <div className="text-sm text-muted-foreground">Revenue Protected</div>
                  <div className="text-xs text-muted-foreground mt-1">Faster execution</div>
                </div>
                <div className="p-4 border-r border-border">
                  <div className="text-2xl font-bold text-foreground mb-1">$50K+</div>
                  <div className="text-sm text-muted-foreground">Executive Time</div>
                  <div className="text-xs text-muted-foreground mt-1">50+ hrs × $1K/hr</div>
                </div>
                <div className="p-4">
                  <div className="text-2xl font-bold text-foreground mb-1">$50-100K</div>
                  <div className="text-sm text-muted-foreground">Tool Consolidation</div>
                  <div className="text-xs text-muted-foreground mt-1">Annual savings</div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-primary/10 rounded-lg text-center">
                <div className="text-3xl font-bold text-primary mb-2">$60K - $2M+</div>
                <div className="text-sm text-muted-foreground">Total value per major event</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Competitive Differentiation */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Competitive Differentiation</h2>
            <p className="text-muted-foreground">
              M owns the category between strategic preparation and operational execution
            </p>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left py-4 px-6 font-semibold">Capability</th>
                      <th className="text-center py-4 px-4 font-semibold">Crisis Tools</th>
                      <th className="text-center py-4 px-4 font-semibold">PM Tools</th>
                      <th className="text-center py-4 px-4 font-semibold text-primary">M</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border">
                      <td className="py-3 px-6">Alert/notify stakeholders</td>
                      <td className="py-3 px-4 text-center"><CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" /></td>
                      <td className="py-3 px-4 text-center text-red-400">—</td>
                      <td className="py-3 px-4 text-center"><CheckCircle2 className="h-4 w-4 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-6">Pre-built response playbooks</td>
                      <td className="py-3 px-4 text-center text-red-400">—</td>
                      <td className="py-3 px-4 text-center text-red-400">—</td>
                      <td className="py-3 px-4 text-center"><CheckCircle2 className="h-4 w-4 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-6">Auto-create project structure</td>
                      <td className="py-3 px-4 text-center text-red-400">—</td>
                      <td className="py-3 px-4 text-center text-red-400">—</td>
                      <td className="py-3 px-4 text-center"><CheckCircle2 className="h-4 w-4 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-6">Assign tasks with acceptance criteria</td>
                      <td className="py-3 px-4 text-center text-red-400">—</td>
                      <td className="py-3 px-4 text-center text-muted-foreground">Manual</td>
                      <td className="py-3 px-4 text-center font-medium text-primary">Auto</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-6">Stage documents and templates</td>
                      <td className="py-3 px-4 text-center text-red-400">—</td>
                      <td className="py-3 px-4 text-center text-red-400">—</td>
                      <td className="py-3 px-4 text-center"><CheckCircle2 className="h-4 w-4 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-6">Unlock pre-approved budgets</td>
                      <td className="py-3 px-4 text-center text-red-400">—</td>
                      <td className="py-3 px-4 text-center text-red-400">—</td>
                      <td className="py-3 px-4 text-center"><CheckCircle2 className="h-4 w-4 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-6">Sync to existing PM tools</td>
                      <td className="py-3 px-4 text-center text-red-400">—</td>
                      <td className="py-3 px-4 text-center text-muted-foreground">N/A</td>
                      <td className="py-3 px-4 text-center"><CheckCircle2 className="h-4 w-4 text-primary mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-6">Institutional learning loop</td>
                      <td className="py-3 px-4 text-center text-red-400">—</td>
                      <td className="py-3 px-4 text-center text-red-400">—</td>
                      <td className="py-3 px-4 text-center"><CheckCircle2 className="h-4 w-4 text-primary mx-auto" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Founder */}
      <section className="py-16 px-6 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-primary/30">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shrink-0">
                  MB
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-primary">Founder-Market Fit</span>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Marty Brunke</h3>
                  <p className="text-muted-foreground mb-4">
                    5 years collegiate football coaching + 20+ years Fortune 500 strategic execution 
                    (Ford, Toyota, Lockheed Martin, Eli Lilly, Boyd Gaming, Charles Schwab)
                  </p>
                  <p className="text-foreground italic">
                    "Business has no operating system for coordinated response. We're building it."
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Learn More?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            See M in action and explore the category-defining opportunity.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/investor-presentation">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                <BarChart3 className="mr-2 h-5 w-5" />
                Full Presentation
              </Button>
            </Link>
            <Link href="/demo-selector">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Watch Demo
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Contact Marty
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
