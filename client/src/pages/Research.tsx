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
  CheckCircle2
} from "lucide-react";
import { Link } from "wouter";
import StandardNav from "@/components/layout/StandardNav";
import { useEffect } from "react";
import { updatePageMetadata } from "@/lib/seo";

export default function Research() {
  useEffect(() => {
    updatePageMetadata({
      title: "Research Behind M | Crisis Response Statistics & Industry Data",
      description: "M was built on a foundation of industry research from McKinsey, PwC, IBM, and Ponemon Institute. See the data that proves faster response saves millions.",
      ogTitle: "The Research Behind M - Industry Data & Statistics",
      ogDescription: "IBM, McKinsey, PwC research proves the cost of slow response. See how M compresses 72 hours to 12 minutes.",
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
            The Research Behind M
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            M was built on a foundation of industry research and 20+ years of Fortune 500 
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
              M was designed to solve these exact challenges.
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
                    <p className="text-sm text-muted-foreground">M's coordinated response</p>
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
                    response = lower costs. M provides all of these capabilities in a single platform.
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
                    22% above global average cost. M cuts this timeline to minutes.
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
                    Highest regulatory scrutiny of any industry. M ensures you're ready before the next incident.
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
                  Give people autonomy while maintaining safeguards. M's pre-approved resources do exactly this.
                </p>
              </CardContent>
            </Card>
            <Card className="border border-purple-500/20">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                <h4 className="font-bold text-foreground mb-2">Empower with Accountability</h4>
                <p className="text-sm text-muted-foreground">
                  Clear task ownership with defined acceptance criteria. M's playbooks assign both.
                </p>
              </CardContent>
            </Card>
            <Card className="border border-purple-500/20">
              <CardContent className="p-6 text-center">
                <Zap className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                <h4 className="font-bold text-foreground mb-2">Fund Work Dynamically</h4>
                <p className="text-sm text-muted-foreground">
                  Shift resources to high-value activities without bureaucracy. M unlocks pre-approved budgets instantly.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How M Addresses These Findings */}
      <section className="py-16 px-6 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              How M Addresses These Findings
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every feature in M was designed to address a specific research finding about 
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
                      IBM found 35% cost reduction with pre-assigned teams. M's playbooks 
                      include pre-assigned stakeholders for every scenario.
                    </p>
                    <Badge variant="outline" className="text-xs">166 Playbooks Ready</Badge>
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
                      $2.2M saved per incident with automation. M auto-creates Jira projects, 
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
                      $1.76M saved by containing within 30 days. M's pre-staged playbooks 
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
                      98 days faster with AI. M's continuous monitoring detects weak signals 
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
            Watch how M transforms these research findings into operational capability.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/demo-selector">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                Watch Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/why-m">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Our Story
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
