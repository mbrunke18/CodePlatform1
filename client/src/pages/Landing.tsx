import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Radio, Radar, Sparkles, BookMarked, Dumbbell, RefreshCw, Zap, Play, ArrowRight, Clock, Timer, ChevronRight, Users, Brain, Target, DollarSign, AlertTriangle, TrendingUp, Shield, Building2, CheckCircle2, X } from "lucide-react";
import { Link } from "wouter";
import StandardNav from "@/components/layout/StandardNav";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <StandardNav />
      
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center py-24 px-4">
        <div className="max-w-5xl w-full">
          <div className="text-center mb-16">
            <Badge className="bg-primary text-primary-foreground mb-8 px-4 py-2 text-sm font-semibold inline-flex items-center" data-testid="badge-hero">
              <Radio className="w-4 h-4 mr-2 animate-pulse" />
              STRATEGIC EXECUTION OPERATING SYSTEM
            </Badge>
            
            {/* The Transformation Message */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-4 md:gap-8 mb-6">
                <div className="text-center">
                  <div className="text-4xl md:text-6xl font-bold text-red-500 line-through opacity-60">72 hrs</div>
                  <div className="text-sm text-muted-foreground mt-1">Industry Average</div>
                </div>
                <ChevronRight className="h-8 w-8 md:h-12 md:w-12 text-primary animate-pulse" />
                <div className="text-center">
                  <div className="text-4xl md:text-6xl font-bold text-primary">12 min</div>
                  <div className="text-sm text-muted-foreground mt-1">With M</div>
                </div>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Pre-staged playbooks. Coordinated stakeholders. Instant activation.
              </p>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight" data-testid="heading-hero">
              From 72 Hours to 12 Minutes.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">
                Deterministic Strategic Execution.
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-4 leading-relaxed max-w-3xl mx-auto" data-testid="text-hero-subtitle">
              No fragmented tools. No experimental AI. Just battle-tested playbooks 
              that transform how Fortune 1000 companies respond to the moments that matter.
            </p>
            
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/video">
                <Button size="lg" className="px-8 py-6 text-lg" data-testid="button-watch-video">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Video
                </Button>
              </Link>
              
              <Link href="/sandbox">
                <Button 
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg"
                  data-testid="button-try-demo"
                >
                  Try Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Link href="/new-user-journey">
                <Button 
                  size="lg"
                  variant="ghost"
                  className="px-8 py-6 text-lg"
                  data-testid="button-get-started"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Problem Statement Block - The 72-Hour Gap */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-3">
                The 72-Hour Gap
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                When strategic disruptions hit — competitor moves, cyber incidents, 
                regulatory changes, executive departures — most organizations scramble. 
                Not because they lack talent. Because they lack a system.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
                <CardContent className="p-6 text-center">
                  <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-3" />
                  <div className="text-4xl font-bold text-red-500 mb-2">91%</div>
                  <p className="text-sm text-muted-foreground">of organizations experienced at least one major disruption</p>
                  <p className="text-xs text-muted-foreground/60 mt-2">Source: PwC 2023</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
                <CardContent className="p-6 text-center">
                  <Clock className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                  <div className="text-4xl font-bold text-orange-500 mb-2">72 hrs</div>
                  <p className="text-sm text-muted-foreground">typical time to coordinate strategic response</p>
                  <p className="text-xs text-muted-foreground/60 mt-2">Source: McKinsey</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/20">
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
                  <div className="text-4xl font-bold text-yellow-500 mb-2">$4.88M</div>
                  <p className="text-sm text-muted-foreground">average cost per major incident</p>
                  <p className="text-xs text-muted-foreground/60 mt-2">Source: IBM 2024</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
                <CardContent className="p-6 text-center">
                  <Timer className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                  <div className="text-4xl font-bold text-purple-500 mb-2">194</div>
                  <p className="text-sm text-muted-foreground">days average time to even identify a breach</p>
                  <p className="text-xs text-muted-foreground/60 mt-2">Source: IBM 2024</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* ROI / Value Proposition Block */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-3">
                The Math is Simple: Faster Response = Lower Cost
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Research proves that speed and preparation save millions. M delivers both.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2 border-green-500/30 hover:border-green-500/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                      <DollarSign className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-500 mb-2">$1.76M</div>
                      <p className="text-foreground font-medium mb-2">Saved by containing incidents within 30 days</p>
                      <p className="text-sm text-muted-foreground">M's pre-staged playbooks get you to coordinated response in minutes, not weeks.</p>
                      <p className="text-xs text-muted-foreground/60 mt-2">Source: IBM Cost of Data Breach 2024</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-green-500/30 hover:border-green-500/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                      <Users className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-500 mb-2">35%</div>
                      <p className="text-foreground font-medium mb-2">Lower costs with pre-defined response teams</p>
                      <p className="text-sm text-muted-foreground">M provides 166 pre-built playbooks with pre-assigned stakeholders, pre-approved budgets, and pre-staged resources.</p>
                      <p className="text-xs text-muted-foreground/60 mt-2">Source: IBM/Ponemon 2024</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-green-500/30 hover:border-green-500/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                      <Zap className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-500 mb-2">$2.2M</div>
                      <p className="text-foreground font-medium mb-2">Saved per incident with automation</p>
                      <p className="text-sm text-muted-foreground">M automatically creates projects in Jira, notifies stakeholders via Slack, and orchestrates coordinated execution.</p>
                      <p className="text-xs text-muted-foreground/60 mt-2">Source: IBM 2024</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-green-500/30 hover:border-green-500/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                      <TrendingUp className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-500 mb-2">98 days</div>
                      <p className="text-foreground font-medium mb-2">Faster response with AI and automation</p>
                      <p className="text-sm text-muted-foreground">M's continuous monitoring and instant activation compress this even further.</p>
                      <p className="text-xs text-muted-foreground/60 mt-2">Source: IBM 2024</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Strategic Control Tower Section */}
          <div className="mb-16 py-12 bg-gradient-to-b from-slate-900/50 to-transparent rounded-2xl">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-blue-500/20 text-blue-400 border-blue-500/30">
                Command & Control
              </Badge>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                The Strategic Control Tower
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Real-time visibility into every active playbook, stakeholder status, 
                and execution metric — with full audit trail for compliance.
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="bg-slate-800/50 border-violet-500/30 hover:border-violet-500/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-violet-500/20 flex items-center justify-center">
                    <Target className="h-6 w-6 text-violet-400" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">IDENTIFY</h3>
                  <p className="text-sm text-muted-foreground">Build your depth chart—pre-stage stakeholders and resources</p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-blue-500/30 hover:border-blue-500/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Radio className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">DETECT</h3>
                  <p className="text-sm text-muted-foreground">Monitor signals—continuous detection across 12 sources</p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-emerald-500/30 hover:border-emerald-500/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">EXECUTE</h3>
                  <p className="text-sm text-muted-foreground">Execute response—coordinated task deployment in 12 minutes</p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-amber-500/30 hover:border-amber-500/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <BookMarked className="h-6 w-6 text-amber-400" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">ADVANCE</h3>
                  <p className="text-sm text-muted-foreground">Review the film—structured debrief and playbook improvement</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Deterministic Execution Section */}
          <div className="mb-16">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <Badge className="mb-4 bg-red-500/20 text-red-400 border-red-500/30">
                  The Problem
                </Badge>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Experimental AI Fails When Stakes Are High
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Fragmented copilots. Consumer-grade chatbots. AI that hallucinates 
                    when you need certainty.
                  </p>
                  <p>
                    When ransomware hits at 2 AM or a competitor announces a market move, 
                    you can't wait for AI to "figure it out."
                  </p>
                  <ul className="space-y-2 mt-4">
                    <li className="flex items-start gap-2">
                      <X className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                      <span>72+ hours of scrambling across disconnected tools</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                      <span>Stakeholders unclear on their responsibilities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                      <span>No audit trail for board or regulatory review</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div>
                <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                  The M Difference
                </Badge>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Deterministic Strategic Execution
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    M delivers predictable outcomes. The same trigger activates the same 
                    coordinated response, every time.
                  </p>
                  <p>
                    No hallucinations. No randomness. Just battle-tested playbooks 
                    executed with precision.
                  </p>
                  <ul className="space-y-2 mt-4">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">12-minute coordinated response across all stakeholders</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">Pre-assigned roles with task-level accountability</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">Complete audit trail with timestamp and ownership</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Strategy Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Radio className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
                <h3 className="font-bold text-lg text-foreground mb-2">Command Center</h3>
                <p className="text-sm text-muted-foreground">Real-time coordination hub</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Radar className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold text-lg text-foreground mb-2">Foresight Radar</h3>
                <p className="text-sm text-muted-foreground">Weak signal detection</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <BookMarked className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold text-lg text-foreground mb-2">166 Playbooks</h3>
                <p className="text-sm text-muted-foreground">Every scenario covered</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Sparkles className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
                <h3 className="font-bold text-lg text-foreground mb-2">Living Playbooks</h3>
                <p className="text-sm text-muted-foreground">Self-learning AI</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Dumbbell className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold text-lg text-foreground mb-2">Future Gym</h3>
                <p className="text-sm text-muted-foreground">Strategic simulations</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <RefreshCw className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold text-lg text-foreground mb-2">Continuous Mode</h3>
                <p className="text-sm text-muted-foreground">Always-on operations</p>
              </CardContent>
            </Card>
          </div>

          {/* Value Proposition */}
          <Card>
            <CardContent className="p-12 space-y-6">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div data-testid="stat-0">
                  <div className="text-5xl font-bold text-primary mb-3" data-testid="value-speed">12 min</div>
                  <p className="text-base text-muted-foreground">Strategic coordination</p>
                </div>
                <div data-testid="stat-1">
                  <div className="text-5xl font-bold text-primary mb-3" data-testid="value-playbooks">166</div>
                  <p className="text-base text-muted-foreground">Strategic playbooks</p>
                </div>
                <div data-testid="stat-2">
                  <div className="text-5xl font-bold text-primary mb-3" data-testid="value-ai">24/7</div>
                  <p className="text-base text-muted-foreground">AI intelligence</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Three Transformations */}
          <div className="mt-16 mb-12">
            <h2 className="text-3xl font-bold text-center text-foreground mb-4">
              How M Transforms Your Organization
            </h2>
            <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
              M changes how three critical groups work—from reactive to ready.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Executives */}
              <Card className="border-2 border-blue-500/30 hover:border-blue-500/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Target className="h-5 w-5 text-blue-500" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground">Executives</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 font-medium shrink-0">Before:</span>
                      <span className="text-muted-foreground">Learn about crises when they're already crises</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-400 font-medium shrink-0">After:</span>
                      <span className="text-foreground">See signals before they escalate</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-primary font-medium">Shift: Crisis Managers → Readiness Leaders</p>
                  </div>
                </CardContent>
              </Card>

              {/* Strategy Teams */}
              <Card className="border-2 border-purple-500/30 hover:border-purple-500/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Brain className="h-5 w-5 text-purple-500" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground">Strategy Teams</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 font-medium shrink-0">Before:</span>
                      <span className="text-muted-foreground">Create plans that sit in SharePoint</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-400 font-medium shrink-0">After:</span>
                      <span className="text-foreground">Create playbooks that auto-activate</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-primary font-medium">Shift: Document Creators → Capability Builders</p>
                  </div>
                </CardContent>
              </Card>

              {/* Operations */}
              <Card className="border-2 border-green-500/30 hover:border-green-500/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Users className="h-5 w-5 text-green-500" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground">Operations</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 font-medium shrink-0">Before:</span>
                      <span className="text-muted-foreground">Wait for instructions during chaos</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-400 font-medium shrink-0">After:</span>
                      <span className="text-foreground">Get immediate, clear task assignments</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-primary font-medium">Shift: Confusion → Clarity in Execution</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Industry-Specific Stats */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-3">
                Industry Impact
              </h2>
              <p className="text-muted-foreground">
                The stakes are even higher in regulated industries
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2 border-blue-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Building2 className="h-8 w-8 text-blue-500" />
                    <h3 className="font-bold text-lg text-foreground">Financial Services</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center mb-4">
                    <div>
                      <div className="text-2xl font-bold text-blue-500">$6.08M</div>
                      <p className="text-xs text-muted-foreground">Avg breach cost</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-500">168</div>
                      <p className="text-xs text-muted-foreground">Days to identify</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-500">51</div>
                      <p className="text-xs text-muted-foreground">Days to contain</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">22% above global average. M cuts this timeline to minutes.</p>
                  <p className="text-xs text-muted-foreground/60 mt-2">Source: IBM 2024 - Financial Industry</p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-red-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="h-8 w-8 text-red-500" />
                    <h3 className="font-bold text-lg text-foreground">Healthcare</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center mb-4">
                    <div>
                      <div className="text-2xl font-bold text-red-500">$9.77M</div>
                      <p className="text-xs text-muted-foreground">Avg breach cost</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-500">213</div>
                      <p className="text-xs text-muted-foreground">Days to discover</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-500">14</div>
                      <p className="text-xs text-muted-foreground">Years as #1 cost</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">The costliest industry for 14 years running. M ensures you're ready.</p>
                  <p className="text-xs text-muted-foreground/60 mt-2">Source: IBM 2024</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Category Creation */}
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-primary/30">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                We're Creating a New Category
              </h3>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                What Salesforce did for customer relationships, M does for strategic execution. 
                We're not competing with project tools or crisis software—we're the orchestration layer above them all.
              </p>
              <Link href="/why-m">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  Learn Our Story
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Research Trust Bar */}
          <div className="mt-16 py-8 border-t border-border">
            <p className="text-center text-sm text-muted-foreground mb-6">
              Research and methodology informed by industry leaders
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-center">
                <p className="font-semibold text-foreground">McKinsey & Company</p>
                <p className="text-xs text-muted-foreground">Crisis Framework</p>
              </div>
              <div className="h-8 w-px bg-border hidden md:block" />
              <div className="text-center">
                <p className="font-semibold text-foreground">PwC</p>
                <p className="text-xs text-muted-foreground">Global Crisis Survey</p>
              </div>
              <div className="h-8 w-px bg-border hidden md:block" />
              <div className="text-center">
                <p className="font-semibold text-foreground">IBM Security</p>
                <p className="text-xs text-muted-foreground">Cost of Data Breach</p>
              </div>
              <div className="h-8 w-px bg-border hidden md:block" />
              <div className="text-center">
                <p className="font-semibold text-foreground">Ponemon Institute</p>
                <p className="text-xs text-muted-foreground">Security Research</p>
              </div>
            </div>
            <div className="text-center mt-6">
              <Link href="/research">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  View Research Sources
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="text-center mt-8 pb-8">
            <p className="text-base text-muted-foreground font-medium">
              Success Favors the Prepared.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
