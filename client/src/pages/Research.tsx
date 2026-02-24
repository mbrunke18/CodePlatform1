import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  ExternalLink,
  Clock, 
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Shield,
  Users,
  Zap,
  Building2,
  Globe2,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Brain,
  Cpu,
  Target,
  Sparkles
} from "lucide-react";
import { Link } from "wouter";
import StandardNav from "@/components/layout/StandardNav";
import { useEffect } from "react";
import { updatePageMetadata } from "@/lib/seo";

export default function Research() {
  useEffect(() => {
    updatePageMetadata({
      title: "Research Behind Execution OS | Crisis Response Statistics & Industry Data",
      description: "Execution OS was built on a foundation of industry research from McKinsey, PwC, IBM, and Ponemon Institute. See the data that proves faster response saves millions.",
      ogTitle: "The Research Behind Execution OS - Industry Data & Statistics",
      ogDescription: "IBM, McKinsey, PwC research proves the cost of slow response. See how Execution OS compresses 72 hours to 12 minutes.",
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StandardNav />

      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <Badge className="mb-6 bg-primary text-white border-0">
            <BarChart3 className="w-4 h-4 mr-2" />
            Industry Research
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" data-testid="heading-research">
            The Research Behind Execution OS
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Execution OS was built on a foundation of industry research and 20+ years of Fortune 500 
            operational experience. Here's the data that shaped our platform.
          </p>
        </div>
      </section>

      {/* The Problem Is Well-Documented */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              The Problem is Well-Documented
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Leading institutions have quantified the cost of slow, uncoordinated response. 
              Execution OS was designed to solve these exact challenges.
            </p>
          </div>

          {/* Response Time Section */}
          <Card className="mb-8 border-2 border-orange-500/30">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                  <Clock className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Response Time</h3>
                  <p className="text-muted-foreground">
                    McKinsey's crisis response framework focuses on "the first 72 hours" as the 
                    critical window for organizational response. Most companies struggle to get 
                    aligned within this timeframe.
                  </p>
                </div>
              </div>
              
              <div className="bg-orange-500/5 rounded-lg p-6 mb-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-orange-500">72 hrs</div>
                    <p className="text-sm text-muted-foreground">Industry average response time</p>
                  </div>
                  <ArrowRight className="h-8 w-8 text-primary" />
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary">12 min</div>
                    <p className="text-sm text-muted-foreground">Execution OS' coordinated response</p>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Source: McKinsey & Company — Crisis Response Framework
              </p>
            </CardContent>
          </Card>

          {/* Disruption Frequency Section */}
          <Card className="mb-8 border-2 border-red-500/30">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Disruption is Constant</h3>
                  <p className="text-muted-foreground">
                    PwC's 2023 Global Crisis Survey found that 91% of organizations have experienced 
                    at least one major disruption beyond the pandemic, with companies averaging 3.5 
                    significant disruptions every two years.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-4 bg-red-500/5 rounded-lg">
                  <div className="text-3xl font-bold text-red-500">91%</div>
                  <p className="text-xs text-muted-foreground">Experienced major disruption</p>
                </div>
                <div className="text-center p-4 bg-red-500/5 rounded-lg">
                  <div className="text-3xl font-bold text-red-500">3.5</div>
                  <p className="text-xs text-muted-foreground">Disruptions per 2 years</p>
                </div>
                <div className="text-center p-4 bg-red-500/5 rounded-lg">
                  <div className="text-3xl font-bold text-red-500">89%</div>
                  <p className="text-xs text-muted-foreground">Prioritize resilience</p>
                </div>
                <div className="text-center p-4 bg-red-500/5 rounded-lg">
                  <div className="text-3xl font-bold text-red-500">70%</div>
                  <p className="text-xs text-muted-foreground">Report significant impact</p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Source: PwC Global Crisis and Resilience Survey 2023 — 1,812 organizations, 42 countries
              </p>
            </CardContent>
          </Card>

          {/* Speed Saves Money Section */}
          <Card className="mb-8 border-2 border-green-500/30">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                  <DollarSign className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Speed Saves Money</h3>
                  <p className="text-muted-foreground">
                    IBM's 2024 Cost of Data Breach study proves what we've seen in practice: faster 
                    response = lower costs. Execution OS provides all of these capabilities in a single platform.
                  </p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="p-4 bg-green-500/5 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-2xl font-bold text-green-500">$1.76M</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Saved by containing incidents within 30 days</p>
                </div>
                <div className="p-4 bg-green-500/5 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-2xl font-bold text-green-500">35%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Cost reduction with pre-defined response teams</p>
                </div>
                <div className="p-4 bg-green-500/5 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-2xl font-bold text-green-500">$2.2M</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Saved per incident with automation</p>
                </div>
                <div className="p-4 bg-green-500/5 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-2xl font-bold text-green-500">98 days</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Faster response with AI-powered tools</p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Source: IBM/Ponemon Institute — Cost of a Data Breach Report 2024 — 604 organizations studied
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Industry-Specific Data */}
      <section className="py-16 px-6 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Industry-Specific Impact
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The stakes are even higher in regulated industries where compliance, reputation, 
              and customer trust are on the line.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Financial Services */}
            <Card className="border-2 border-blue-500/30">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Building2 className="h-10 w-10 text-blue-500" />
                  <div>
                    <h3 className="font-bold text-xl text-foreground">Financial Services</h3>
                    <p className="text-sm text-muted-foreground">Higher Stakes, Higher Costs</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center mb-6">
                  <div className="p-3 bg-blue-500/5 rounded-lg">
                    <div className="text-2xl font-bold text-blue-500">$6.08M</div>
                    <p className="text-xs text-muted-foreground">Avg breach cost</p>
                  </div>
                  <div className="p-3 bg-blue-500/5 rounded-lg">
                    <div className="text-2xl font-bold text-blue-500">168</div>
                    <p className="text-xs text-muted-foreground">Days to identify</p>
                  </div>
                  <div className="p-3 bg-blue-500/5 rounded-lg">
                    <div className="text-2xl font-bold text-blue-500">51</div>
                    <p className="text-xs text-muted-foreground">Days to contain</p>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-500/10 rounded-lg mb-4">
                  <p className="text-sm text-foreground font-medium">
                    22% above global average cost. Execution OS cuts this timeline to minutes.
                  </p>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Source: IBM Cost of Data Breach 2024 - Financial Industry
                </p>
              </CardContent>
            </Card>

            {/* Healthcare */}
            <Card className="border-2 border-red-500/30">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="h-10 w-10 text-red-500" />
                  <div>
                    <h3 className="font-bold text-xl text-foreground">Healthcare</h3>
                    <p className="text-sm text-muted-foreground">The Costliest Industry</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center mb-6">
                  <div className="p-3 bg-red-500/5 rounded-lg">
                    <div className="text-2xl font-bold text-red-500">$9.77M</div>
                    <p className="text-xs text-muted-foreground">Avg breach cost</p>
                  </div>
                  <div className="p-3 bg-red-500/5 rounded-lg">
                    <div className="text-2xl font-bold text-red-500">213</div>
                    <p className="text-xs text-muted-foreground">Days to discover</p>
                  </div>
                  <div className="p-3 bg-red-500/5 rounded-lg">
                    <div className="text-2xl font-bold text-red-500">14</div>
                    <p className="text-xs text-muted-foreground">Years as #1</p>
                  </div>
                </div>
                
                <div className="p-4 bg-red-500/10 rounded-lg mb-4">
                  <p className="text-sm text-foreground font-medium">
                    Highest regulatory scrutiny of any industry. Execution OS ensures you're ready before the next incident.
                  </p>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Source: IBM Cost of Data Breach 2024
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Business Agility Research */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Business Agility is No Longer Optional
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Business Agility Institute research proves that organizations with stronger agility 
              capabilities significantly outperform their peers—especially under pressure.
            </p>
          </div>

          <Card className="mb-8 border-2 border-purple-500/30">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                  <TrendingUp className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Agility Drives Revenue</h3>
                  <p className="text-muted-foreground">
                    Organizations that measurably improved their business agility saw dramatically 
                    higher financial performance compared to those that didn't prioritize adaptability.
                  </p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-purple-500/5 rounded-lg">
                  <div className="text-4xl font-bold text-purple-500">10.3%</div>
                  <p className="text-sm text-muted-foreground">Revenue increase per employee for agile organizations</p>
                </div>
                <div className="text-center p-4 bg-purple-500/5 rounded-lg">
                  <div className="text-4xl font-bold text-purple-500">3x</div>
                  <p className="text-sm text-muted-foreground">Better performance vs non-agile peers (3.5% increase)</p>
                </div>
                <div className="text-center p-4 bg-purple-500/5 rounded-lg">
                  <div className="text-4xl font-bold text-purple-500">5.4</div>
                  <p className="text-sm text-muted-foreground">Global agility maturity rating (resilient despite headwinds)</p>
                </div>
              </div>

              <div className="p-4 bg-purple-500/10 rounded-lg mb-4">
                <p className="text-sm text-foreground font-medium italic">
                  "AI does not create an advantage on its own. It amplifies the organization in which 
                  it is embedded. In companies with strong business agility, AI accelerates learning, 
                  innovation, and value creation. In those without it, AI exposes structural friction, 
                  leadership gaps, and brittle decision systems at speed."
                </p>
                <p className="text-xs text-muted-foreground mt-2">— Ahmed Sidky, President, Business Agility Institute</p>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Source: Business Agility Institute — Business Agility Report
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border border-purple-500/20">
              <CardContent className="p-6 text-center">
                <Shield className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                <h4 className="font-bold text-foreground mb-2">Balance Governance & Risk</h4>
                <p className="text-sm text-muted-foreground">
                  Give people autonomy while maintaining safeguards. Execution OS' pre-approved resources do exactly this.
                </p>
              </CardContent>
            </Card>
            <Card className="border border-purple-500/20">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                <h4 className="font-bold text-foreground mb-2">Empower with Accountability</h4>
                <p className="text-sm text-muted-foreground">
                  Clear task ownership with defined acceptance criteria. Execution OS' playbooks assign both.
                </p>
              </CardContent>
            </Card>
            <Card className="border border-purple-500/20">
              <CardContent className="p-6 text-center">
                <Zap className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                <h4 className="font-bold text-foreground mb-2">Fund Work Dynamically</h4>
                <p className="text-sm text-muted-foreground">
                  Shift resources to high-value activities without bureaucracy. Execution OS unlocks pre-approved budgets instantly.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How Execution OS Addresses These Findings */}
      <section className="py-16 px-6 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              How Execution OS Addresses These Findings
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every feature in Execution OS was designed to address a specific research finding about 
              what makes organizations faster and more resilient.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Users className="h-8 w-8 text-primary shrink-0" />
                  <div>
                    <h4 className="font-bold text-foreground mb-2">Pre-Defined Response Teams</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      IBM found 35% cost reduction with pre-assigned teams. Execution OS' playbooks 
                      include pre-assigned stakeholders for every scenario.
                    </p>
                    <Badge variant="outline" className="text-xs">170 Playbooks Ready</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Zap className="h-8 w-8 text-primary shrink-0" />
                  <div>
                    <h4 className="font-bold text-foreground mb-2">Automated Orchestration</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      $2.2M saved per incident with automation. Execution OS auto-creates Jira projects, 
                      notifies via Slack, and orchestrates execution.
                    </p>
                    <Badge variant="outline" className="text-xs">Enterprise Integrations</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Clock className="h-8 w-8 text-primary shrink-0" />
                  <div>
                    <h4 className="font-bold text-foreground mb-2">Faster Containment</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      $1.76M saved by containing within 30 days. Execution OS' pre-staged playbooks 
                      get you to coordinated response in minutes.
                    </p>
                    <Badge variant="outline" className="text-xs">12-Minute Activation</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <TrendingUp className="h-8 w-8 text-primary shrink-0" />
                  <div>
                    <h4 className="font-bold text-foreground mb-2">AI-Powered Detection</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      98 days faster with AI. Execution OS' continuous monitoring detects weak signals 
                      before they become crises.
                    </p>
                    <Badge variant="outline" className="text-xs">24/7 Monitoring</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 2026 Enterprise AI Landscape */}
      <section className="py-20 px-6 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-6 bg-indigo-600 text-white border-0">
              <Sparkles className="w-4 h-4 mr-2" />
              2026 Research Landscape
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              The 2026 Enterprise AI Inflection Point
            </h2>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto">
              Eight flagship reports converge on one message: 2026 is when AI stops being a feature and becomes part of the enterprise operating system
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <div className="flex items-center gap-3 p-4 bg-indigo-900/50 border border-indigo-700/50 rounded-lg">
              <Cpu className="h-6 w-6 text-indigo-400 shrink-0" />
              <span className="text-indigo-200 font-medium">Agentic AI → Infrastructure</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-indigo-900/50 border border-indigo-700/50 rounded-lg">
              <Brain className="h-6 w-6 text-indigo-400 shrink-0" />
              <span className="text-indigo-200 font-medium">Redesign Work, Not Automation</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-indigo-900/50 border border-indigo-700/50 rounded-lg">
              <Shield className="h-6 w-6 text-indigo-400 shrink-0" />
              <span className="text-indigo-200 font-medium">Governance Enables Speed</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-slate-800/50 border border-slate-700 border-l-4 border-l-blue-500 rounded-lg p-6">
              <div className="flex items-start gap-4 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0 text-white font-bold text-sm">1</div>
                <div>
                  <h4 className="font-bold text-white">BCG</h4>
                  <p className="text-slate-300 text-sm">AI Radar 2026</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm mb-3 italic">"AI transformation is shifting from a CIO-led initiative to a CEO-led mandate across the enterprise."</p>
              <div className="flex items-start gap-2">
                <Target className="h-4 w-4 text-indigo-400 mt-0.5 shrink-0" />
                <p className="text-indigo-300 text-xs">Execution OS turns CEO-level AI mandates into coordinated execution across every function.</p>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 border-l-4 border-l-cyan-500 rounded-lg p-6">
              <div className="flex items-start gap-4 mb-3">
                <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center shrink-0 text-white font-bold text-sm">2</div>
                <div>
                  <h4 className="font-bold text-white">IBM</h4>
                  <p className="text-slate-300 text-sm">The Enterprise in 2030</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm mb-3 italic">"Five bold predictions for the smarter enterprise—where AI becomes embedded in every process and decision."</p>
              <div className="flex items-start gap-2">
                <Target className="h-4 w-4 text-indigo-400 mt-0.5 shrink-0" />
                <p className="text-indigo-300 text-xs">Execution OS embeds AI into the decision layer, not just analytics dashboards.</p>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 border-l-4 border-l-emerald-500 rounded-lg p-6">
              <div className="flex items-start gap-4 mb-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 text-white font-bold text-sm">3</div>
                <div>
                  <h4 className="font-bold text-white">McKinsey</h4>
                  <p className="text-slate-300 text-sm">Global Tech Agenda 2026</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm mb-3 italic">"CIOs are evolving from cost managers to strategy architects, orchestrating AI across the business."</p>
              <div className="flex items-start gap-2">
                <Target className="h-4 w-4 text-indigo-400 mt-0.5 shrink-0" />
                <p className="text-indigo-300 text-xs">Execution OS gives CIOs the operational backbone to architect strategy, not just manage infrastructure.</p>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 border-l-4 border-l-violet-500 rounded-lg p-6">
              <div className="flex items-start gap-4 mb-3">
                <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center shrink-0 text-white font-bold text-sm">4</div>
                <div>
                  <h4 className="font-bold text-white">Deloitte</h4>
                  <p className="text-slate-300 text-sm">State of AI in the Enterprise 2026</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm mb-3 italic">"The rise of sovereign, agentic, and physical AI is redefining what enterprise readiness looks like."</p>
              <div className="flex items-start gap-2">
                <Target className="h-4 w-4 text-indigo-400 mt-0.5 shrink-0" />
                <p className="text-indigo-300 text-xs">Execution OS provides the readiness framework for agentic AI—playbooks, governance, and orchestration.</p>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 border-l-4 border-l-amber-500 rounded-lg p-6">
              <div className="flex items-start gap-4 mb-3">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center shrink-0 text-white font-bold text-sm">5</div>
                <div>
                  <h4 className="font-bold text-white">World Economic Forum</h4>
                  <p className="text-slate-300 text-sm">Proof over Promise</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm mb-3 italic">"Scaling AI and turning it into outcomes—moving beyond pilots to enterprise-wide value creation."</p>
              <div className="flex items-start gap-2">
                <Target className="h-4 w-4 text-indigo-400 mt-0.5 shrink-0" />
                <p className="text-indigo-300 text-xs">Execution OS bridges the pilot-to-production gap with structured execution workflows.</p>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 border-l-4 border-l-sky-500 rounded-lg p-6">
              <div className="flex items-start gap-4 mb-3">
                <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center shrink-0 text-white font-bold text-sm">6</div>
                <div>
                  <h4 className="font-bold text-white">Microsoft</h4>
                  <p className="text-slate-300 text-sm">Agents Are Here</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm mb-3 italic">"AI agent readiness is about people, process, culture, and governance—not just technology deployment."</p>
              <div className="flex items-start gap-2">
                <Target className="h-4 w-4 text-indigo-400 mt-0.5 shrink-0" />
                <p className="text-indigo-300 text-xs">Execution OS operationalizes the people + process layer that agent readiness demands.</p>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 border-l-4 border-l-rose-500 rounded-lg p-6">
              <div className="flex items-start gap-4 mb-3">
                <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center shrink-0 text-white font-bold text-sm">7</div>
                <div>
                  <h4 className="font-bold text-white">Google Cloud</h4>
                  <p className="text-slate-300 text-sm">AI Agent Trends 2026</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm mb-3 italic">"AI agents are being deployed across industries—from customer service to supply chain to strategic planning."</p>
              <div className="flex items-start gap-2">
                <Target className="h-4 w-4 text-indigo-400 mt-0.5 shrink-0" />
                <p className="text-indigo-300 text-xs">Execution OS provides the control plane for agent-driven workflows across business domains.</p>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 border-l-4 border-l-fuchsia-500 rounded-lg p-6">
              <div className="flex items-start gap-4 mb-3">
                <div className="w-8 h-8 rounded-full bg-fuchsia-500 flex items-center justify-center shrink-0 text-white font-bold text-sm">8</div>
                <div>
                  <h4 className="font-bold text-white">Accenture</h4>
                  <p className="text-slate-300 text-sm">New Rules of Platform Strategy</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm mb-3 italic">"Reinventing platform strategy for agentic AI—where platforms become orchestration layers, not just tools."</p>
              <div className="flex items-start gap-2">
                <Target className="h-4 w-4 text-indigo-400 mt-0.5 shrink-0" />
                <p className="text-indigo-300 text-xs">Execution OS is built as the orchestration layer where strategy meets agentic execution.</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-800/70 border border-slate-700 rounded-lg text-center">
            <p className="text-slate-200 text-sm md:text-base leading-relaxed">
              These decisions compound. The workflows you hand to agents, the data foundations you build, and the controls you put in place will shape performance for years. Execution OS provides the infrastructure to make these decisions execute.
            </p>
          </div>
        </div>
      </section>

      {/* 2026 Agentic AI Playbook */}
      <section className="py-20 px-6 bg-gradient-to-br from-emerald-950 via-slate-900 to-indigo-950 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-6 bg-emerald-600 text-white border-0">
              <Cpu className="w-4 h-4 mr-2" />
              Published in the Last 6-8 Months
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              The 2026 Agentic AI Playbook
            </h2>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto mb-4">
              12 guides from 9 leading firms — all published in the last 6-8 months — move from reality check to foundations to enterprise design. Together, they map the exact territory Execution OS occupies.
            </p>
            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">12</div>
                <div className="text-slate-400">Guides</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">9</div>
                <div className="text-slate-400">Firms</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">6 mo</div>
                <div className="text-slate-400">Time Span</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">1</div>
                <div className="text-slate-400">Conclusion</div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Target className="h-4 w-4 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white">STRATEGY — How far are we really?</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-5 hover:border-emerald-500/50 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">1</span>
                  <span className="font-bold text-white">McKinsey (QuantumBlack)</span>
                </div>
                <p className="text-slate-400 text-xs mb-2">The State of AI in 2025</p>
                <p className="text-slate-300 text-sm mb-3">A reality check on how companies are actually using AI today.</p>
                <p className="text-emerald-400 text-xs italic">→ Execution OS addresses the gap between AI adoption and AI execution</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-5 hover:border-emerald-500/50 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">2</span>
                  <span className="font-bold text-white">PwC</span>
                </div>
                <p className="text-slate-400 text-xs mb-2">Agentic AI Reinvention (Nov 2025)</p>
                <p className="text-slate-300 text-sm mb-3">How enterprises scale AI agents for measurable business results.</p>
                <p className="text-emerald-400 text-xs italic">→ Execution OS delivers measurable P&L impact through structured execution</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-5 hover:border-emerald-500/50 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-white text-xs font-bold">3</span>
                  <span className="font-bold text-white">McKinsey</span>
                </div>
                <p className="text-slate-400 text-xs mb-2">The Agentic AI Opportunity (Nov 2025)</p>
                <p className="text-slate-300 text-sm mb-3">A comprehensive deep dive into Agentic AI and all of its impacts.</p>
                <p className="text-emerald-400 text-xs italic">→ Execution OS is the execution layer that makes agentic AI operational</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-5 hover:border-emerald-500/50 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold">4</span>
                  <span className="font-bold text-white">Accenture</span>
                </div>
                <p className="text-slate-400 text-xs mb-2">Six Insights for AI ROI</p>
                <p className="text-slate-300 text-sm mb-3">What actually drives AI results and return.</p>
                <p className="text-emerald-400 text-xs italic">→ Execution OS' 170 playbooks are the structured execution that drives ROI</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Cpu className="h-4 w-4 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white">BUILD — What needs to exist before scale?</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-5 hover:border-emerald-500/50 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center text-white text-xs font-bold">5</span>
                  <span className="font-bold text-white">AWS</span>
                </div>
                <p className="text-slate-400 text-xs mb-2">Rise of Autonomous Agents</p>
                <p className="text-slate-300 text-sm mb-3">What AI agents are and where they add value.</p>
                <p className="text-emerald-400 text-xs italic">→ Execution OS provides the strategic control layer on top of AI agent infrastructure</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-5 hover:border-emerald-500/50 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">6</span>
                  <span className="font-bold text-white">Bain</span>
                </div>
                <p className="text-slate-400 text-xs mb-2">Foundations for Agentic AI</p>
                <p className="text-slate-300 text-sm mb-3">The data, platforms, and systems needed before scale.</p>
                <p className="text-emerald-400 text-xs italic">→ Execution OS IS that foundational platform — governance, playbooks, coordination</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-5 hover:border-emerald-500/50 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">7</span>
                  <span className="font-bold text-white">IBM</span>
                </div>
                <p className="text-slate-400 text-xs mb-2">Agentic AI Operating Model</p>
                <p className="text-slate-300 text-sm mb-3">The operating model required to run AI at scale.</p>
                <p className="text-emerald-400 text-xs italic">→ Execution OS delivers that operating model — 170 playbooks, 9 domains, pre-defined governance</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-5 hover:border-emerald-500/50 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs font-bold">8</span>
                  <span className="font-bold text-white">Deloitte</span>
                </div>
                <p className="text-slate-400 text-xs mb-2">Agentic Enterprise 2028</p>
                <p className="text-slate-300 text-sm mb-3">A horizon scan to stress-test a 2026 roadmap.</p>
                <p className="text-emerald-400 text-xs italic">→ Execution OS' 18-month head start means enterprises can adopt today for 2028 readiness</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Brain className="h-4 w-4 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white">LEADERSHIP — How work, control, and decisions change</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-5 hover:border-emerald-500/50 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">9</span>
                  <span className="font-bold text-white">BCG</span>
                </div>
                <p className="text-slate-400 text-xs mb-2">Machines That Manage Themselves</p>
                <p className="text-slate-300 text-sm mb-3">What an agent-driven enterprise may become.</p>
                <p className="text-emerald-400 text-xs italic">→ Execution OS bridges today's chaos to the agent-driven future with human oversight</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-5 hover:border-emerald-500/50 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-white text-xs font-bold">10</span>
                  <span className="font-bold text-white">McKinsey</span>
                </div>
                <p className="text-slate-400 text-xs mb-2">The Agentic Organization</p>
                <p className="text-slate-300 text-sm mb-3">How organization design and work change with agents.</p>
                <p className="text-emerald-400 text-xs italic">→ Execution OS' IDEA Framework is the organizational design for the agentic era</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-5 hover:border-emerald-500/50 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold">11</span>
                  <span className="font-bold text-white">World Economic Forum</span>
                </div>
                <p className="text-slate-400 text-xs mb-2">AI Agents in Action</p>
                <p className="text-slate-300 text-sm mb-3">Practical guidance for evaluating agents and setting guardrails.</p>
                <p className="text-emerald-400 text-xs italic">→ Execution OS' AI Governance domain provides exactly these guardrails — 18 playbooks</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-5 hover:border-emerald-500/50 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">12</span>
                  <span className="font-bold text-white">McKinsey</span>
                </div>
                <p className="text-slate-400 text-xs mb-2">Seizing the Agentic AI Advantage</p>
                <p className="text-slate-300 text-sm mb-3">Real-world examples of agentic AI driving results.</p>
                <p className="text-emerald-400 text-xs italic">→ Execution OS turns these examples into repeatable, scalable execution patterns</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-emerald-900/30 border border-emerald-700/50 rounded-lg text-center">
            <p className="text-emerald-300 font-bold text-lg mb-2">The convergence is clear.</p>
            <p className="text-slate-300 text-sm leading-relaxed max-w-3xl mx-auto">
              Every major consulting and technology firm is telling enterprises: you need governance, coordination systems, and execution infrastructure to operationalize AI. None of them are building the product. Execution OS did.
            </p>
          </div>
        </div>
      </section>

      {/* Sources */}
      <section className="py-16 px-6 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Research Sources
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              All statistics and insights referenced are from leading global research institutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">McKinsey & Company</h4>
                    <p className="text-sm text-muted-foreground">Crisis Response Framework</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Research on the critical importance of the first 72 hours in crisis response 
                  and organizational coordination.
                </p>
                <a 
                  href="https://www.mckinsey.com/capabilities/risk-and-resilience/how-we-help-clients/crisis-response" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary text-sm flex items-center gap-1 hover:underline"
                >
                  Visit Research <ExternalLink className="h-3 w-3" />
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <Globe2 className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">PwC</h4>
                    <p className="text-sm text-muted-foreground">Global Crisis and Resilience Survey 2023</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Survey of 1,812 organizations across 42 countries on disruption frequency, 
                  impact, and resilience priorities.
                </p>
                <a 
                  href="https://www.pwc.com/gx/en/issues/crisis-solutions/global-crisis-survey.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary text-sm flex items-center gap-1 hover:underline"
                >
                  Visit Research <ExternalLink className="h-3 w-3" />
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">IBM Security</h4>
                    <p className="text-sm text-muted-foreground">Cost of a Data Breach Report 2024</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Study of 604 organizations analyzing breach costs, response times, and 
                  the financial impact of automation and AI.
                </p>
                <a 
                  href="https://www.ibm.com/reports/data-breach" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary text-sm flex items-center gap-1 hover:underline"
                >
                  Visit Research <ExternalLink className="h-3 w-3" />
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Ponemon Institute</h4>
                    <p className="text-sm text-muted-foreground">Security Research Partner</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Independent research on data protection, privacy, and information security 
                  policy. Research partner for IBM studies.
                </p>
                <a 
                  href="https://www.ponemon.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary text-sm flex items-center gap-1 hover:underline"
                >
                  Visit Research <ExternalLink className="h-3 w-3" />
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-indigo-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Business Agility Institute</h4>
                    <p className="text-sm text-muted-foreground">Business Agility Report</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Global research on organizational agility, resilience, and the correlation 
                  between adaptability and business performance.
                </p>
                <a 
                  href="https://businessagility.institute/type/research" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary text-sm flex items-center gap-1 hover:underline"
                >
                  Visit Research <ExternalLink className="h-3 w-3" />
                </a>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 p-6 bg-primary/10 rounded-lg text-center">
            <p className="text-foreground font-medium mb-2">
              Research updates annually. We refresh our statistics as new reports are published.
            </p>
            <p className="text-sm text-muted-foreground">
              IBM updates annually (July) | PwC surveys bi-annually | McKinsey publishes regularly | BAI reports annually
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            See the Research in Action
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Watch how Execution OS transforms these research findings into operational capability.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/demo-selector">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                Watch Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/why-executeiq">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                Our Story
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
