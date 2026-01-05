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

export default function WhyM() {
  useEffect(() => {
    updatePageMetadata({
      title: "Why M - The Founder Story | Strategic Execution Operating System",
      description: "Discover how 5 years of elite football coaching and 20+ years of Fortune 500 strategic execution led to M—the first Strategic Execution Operating System.",
      ogTitle: "Why M Exists - Creating a New Category",
      ogDescription: "The insight that created M: Business has no operating system for coordinated response. We're changing that.",
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StandardNav />

      {/* Hero Section - Split Layout with Founder + CTAs */}
      <section className="py-16 md:py-20 px-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-6 bg-primary text-white border-0">
                <Lightbulb className="w-4 h-4 mr-2" />
                The Origin Story
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight" data-testid="heading-why-m">
                Why M Exists
              </h1>
              
              <p className="text-xl text-blue-100 mb-8">
                The insight that created a new software category came from an unexpected place: 
                the football field.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/demo-selector">
                  <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                    <Play className="mr-2 h-5 w-5" />
                    Watch Demo
                  </Button>
                </Link>
                <Link href="/research">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    View Research
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>

            <Card className="bg-white/10 border-white/20 backdrop-blur">
              <CardContent className="p-6 md:p-8">
                <Quote className="h-10 w-10 text-blue-300 mb-4 opacity-60" />
                <blockquote className="text-lg text-blue-50 leading-relaxed mb-6 italic">
                  "Business has no operating system for coordinated response. Football teams respond in seconds. Fortune 500 companies take 72 hours. I finally understood why."
                </blockquote>
                <div className="flex items-center gap-4 pt-4 border-t border-white/20">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                    MB
                  </div>
                  <div>
                    <p className="font-bold text-white">Marty Brunke</p>
                    <p className="text-blue-200 text-sm">Founder & CEO, M</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Stats Bar */}
      <section className="py-8 px-6 bg-slate-100 dark:bg-slate-800 border-b border-border">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div data-testid="stat-coaching">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1" data-testid="value-coaching">5 yrs</div>
              <p className="text-sm text-muted-foreground" data-testid="label-coaching">Collegiate Football Coaching</p>
            </div>
            <div data-testid="stat-strategy">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1" data-testid="value-strategy">20+</div>
              <p className="text-sm text-muted-foreground" data-testid="label-strategy">Years Fortune 500 Strategy</p>
            </div>
            <div data-testid="stat-transformations">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1" data-testid="value-transformations">6</div>
              <p className="text-sm text-muted-foreground" data-testid="label-transformations">Enterprise Transformations</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Insight - Full Quote */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-primary/30 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-900">
            <CardContent className="p-8 md:p-12">
              <div className="flex items-start gap-6 mb-8">
                <Quote className="h-12 w-12 text-primary shrink-0 opacity-60" />
                <blockquote className="text-xl md:text-2xl text-foreground leading-relaxed italic">
                  "In football, when a play is called, everyone knows exactly what to do. 
                  Assignments are clear, responsibilities are owned, and execution happens in seconds 
                  because the preparation is there. That level of alignment is built long before gameday.
                  <br /><br />
                  In business, I've spent 20 years watching Fortune 500 companies struggle with the 
                  very thing football teams excel at naturally—clarity, coordination, and the ability 
                  to execute with speed and confidence."
                </blockquote>
              </div>
              
              <div className="flex items-center justify-between flex-wrap gap-4 pt-6 border-t border-border">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    MB
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-lg">Marty Brunke</p>
                    <p className="text-muted-foreground">Founder & CEO, M</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Ford</Badge>
                  <Badge variant="outline">Toyota</Badge>
                  <Badge variant="outline">Lockheed Martin</Badge>
                  <Badge variant="outline">Stanford</Badge>
                  <Badge variant="outline">Boyd Gaming</Badge>
                  <Badge variant="outline">Churchill Downs</Badge>
                </div>
              </div>
              <div className="flex justify-center mt-8">
                <Link href="/demo-selector">
                  <Button className="bg-primary text-white hover:bg-primary/90" data-testid="button-demo-insight">
                    <Play className="mr-2 h-4 w-4" />
                    See the Vision in Action
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Now - Market Timing with Icons & Citations */}
      <section className="py-16 px-6 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-amber-500 text-white border-0">
              <TrendingUp className="w-4 h-4 mr-2" />
              Why Now
            </Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Three Forces Are Converging
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Creating a massive gap between designed operating models and executed strategy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white dark:bg-slate-800 border-amber-500/30">
              <CardContent className="p-6">
                <div className="text-4xl font-bold text-amber-500 mb-3">$50B</div>
                <h3 className="font-bold text-foreground mb-2">Consulting Saturation</h3>
                <p className="text-sm text-muted-foreground">
                  Companies spend $50B/year on strategy consulting, but consultants leave when the deck is done.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-slate-800 border-orange-500/30">
              <CardContent className="p-6">
                <div className="text-4xl font-bold text-orange-500 mb-3">67%</div>
                <h3 className="font-bold text-foreground mb-2">Operating Model Overhauls</h3>
                <p className="text-sm text-muted-foreground">
                  67% of enterprises redesigned their operating model in the past 2 years (McKinsey, 2025).
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-slate-800 border-red-500/30">
              <CardContent className="p-6">
                <div className="text-4xl font-bold text-red-500 mb-3">12 min</div>
                <h3 className="font-bold text-foreground mb-2">Speed Demands</h3>
                <p className="text-sm text-muted-foreground">
                  Markets move in days, not quarters. The 72-hour response window is now 12 minutes.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-4">The Market Evidence</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-amber-500 mx-auto mb-3" />
                <div className="text-4xl font-bold text-amber-500 mb-2">89%</div>
                <p className="text-sm text-muted-foreground">Say resilience is a top strategic priority</p>
                <p className="text-xs text-muted-foreground/60 mt-2">Source: PwC 2023</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-3" />
                <div className="text-4xl font-bold text-red-500 mb-2">91%</div>
                <p className="text-sm text-muted-foreground">Experienced major disruption beyond COVID</p>
                <p className="text-xs text-muted-foreground/60 mt-2">Source: PwC 2023</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
              <CardContent className="p-6 text-center">
                <Timer className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                <div className="text-4xl font-bold text-orange-500 mb-2">3.5</div>
                <p className="text-sm text-muted-foreground">Average disruptions every 2 years</p>
                <p className="text-xs text-muted-foreground/60 mt-2">Source: PwC 2023</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
              <CardContent className="p-6 text-center">
                <DollarSign className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                <div className="text-4xl font-bold text-purple-500 mb-2">70%</div>
                <p className="text-sm text-muted-foreground">Report significant business impact</p>
                <p className="text-xs text-muted-foreground/60 mt-2">Source: PwC 2023</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center gap-4">
            <Link href="/research">
              <Button variant="outline" className="border-amber-500 text-amber-600 hover:bg-amber-500/10">
                View Full Research
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* The Football Parallel - Complete Preparedness */}
      <section className="py-16 px-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              <Target className="w-4 h-4 mr-2" />
              The Insight
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              Offense. Defense. Special Teams.
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Great football programs are prepared for every situation before the game starts. 
              M brings this same complete preparedness to business leadership.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white/10 border-white/20 backdrop-blur">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Offense</h3>
                <p className="text-sm text-blue-100 mb-4">Seize opportunities</p>
                <p className="text-sm text-blue-200">
                  M&A targets, market expansion, competitive moves—playbooks ready to capitalize.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-white/20 backdrop-blur">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-2xl flex items-center justify-center">
                  <Shield className="h-8 w-8 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Defense</h3>
                <p className="text-sm text-blue-100 mb-4">Protect value</p>
                <p className="text-sm text-blue-200">
                  Regulatory changes, supply chain disruptions, cyber incidents—responses pre-staged.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-white/20 backdrop-blur">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                  <Zap className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Special Teams</h3>
                <p className="text-sm text-blue-100 mb-4">Change the game</p>
                <p className="text-sm text-blue-200">
                  AI governance, ESG mandates, workforce transformation—emerging plays ready.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center p-8 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-xl font-medium text-blue-50 max-w-2xl mx-auto">
              No matter the situation, executives using M are prepared to execute 
              <span className="font-bold text-white"> swiftly, efficiently, and effectively.</span>
            </p>
          </div>
        </div>
      </section>

      {/* The Unique Background - Two Column */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              A Unique Perspective
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Only someone who's lived in both worlds could see this gap.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <Card className="border-2 border-green-500/30 hover:border-green-500/50 transition-colors">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Target className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-foreground">Elite Sports</h3>
                    <p className="text-sm text-muted-foreground">What works</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <span>Pre-designed plays for every situation</span>
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <span>Every player knows their role before the snap</span>
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <span>Split-second coordinated response</span>
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <span>Continuous practice and improvement</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-500/30 hover:border-red-500/50 transition-colors">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-foreground">Fortune 500</h3>
                    <p className="text-sm text-muted-foreground">What doesn't</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    <span>72+ hours to coordinate response</span>
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    <span>No pre-staged playbooks</span>
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    <span>Improvisation as default mode</span>
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    <span>Lessons learned but not applied</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/30">
            <CardContent className="p-6 text-center">
              <Lightbulb className="h-10 w-10 text-primary mx-auto mb-3" />
              <p className="text-lg font-semibold text-foreground max-w-2xl mx-auto mb-4">
                This isn't domain expertise. It's a category-defining insight that competitors cannot replicate.
              </p>
              <Link href="/research">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10" data-testid="button-research-perspective">
                  Explore the Research
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* The Transformation - Side by Side */}
      <section className="py-16 px-6 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary text-white border-0">
              <Zap className="w-4 h-4 mr-2" />
              The Transformation
            </Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              From 72 Hours to 12 Minutes
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-red-500/30">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-red-500 mb-6 flex items-center gap-2">
                  <Clock className="h-6 w-6" />
                  Today: The 72-Hour Scramble
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-red-500/5 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 text-sm font-bold">1</div>
                    <span className="text-muted-foreground">Event occurs → Who should handle this?</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-red-500/5 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 text-sm font-bold">2</div>
                    <span className="text-muted-foreground">Ad-hoc calls → What's our playbook?</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-red-500/5 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 text-sm font-bold">3</div>
                    <span className="text-muted-foreground">Debate → Who has authority?</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-red-500/5 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 text-sm font-bold">4</div>
                    <span className="text-muted-foreground">Discovery → What resources do we have?</span>
                  </div>
                  <div className="text-center pt-4 border-t border-red-500/20">
                    <span className="text-2xl font-bold text-red-500">72 hours later...</span>
                    <p className="text-sm text-muted-foreground mt-1">Response finally begins</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500/30">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-green-500 mb-6 flex items-center gap-2">
                  <Zap className="h-6 w-6" />
                  With M: 12-Minute Activation
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-green-500/5 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-sm font-bold">1</div>
                    <span className="text-muted-foreground">Signal detected → Pre-configured alert</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-500/5 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-sm font-bold">2</div>
                    <span className="text-muted-foreground">Playbook activates → Pre-staged, pre-assigned</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-500/5 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-sm font-bold">3</div>
                    <span className="text-muted-foreground">Tasks deploy → Auto-created in Jira</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-500/5 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-sm font-bold">4</div>
                    <span className="text-muted-foreground">Teams execute → Clear ownership</span>
                  </div>
                  <div className="text-center pt-4 border-t border-green-500/20">
                    <span className="text-2xl font-bold text-green-500">12 minutes</span>
                    <p className="text-sm text-muted-foreground mt-1">Coordinated response underway</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-10">
            <Link href="/demo-selector">
              <Button size="lg" className="bg-green-600 text-white hover:bg-green-700" data-testid="button-demo-transformation">
                <Play className="mr-2 h-5 w-5" />
                See the 12-Minute Transformation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Category Creation */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary text-white">Category Creation</Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              We're Creating a New Category
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              M isn't entering an existing market—we're defining a new one.
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-foreground mb-6 text-center">
                Strategic Execution Operating System (SEOS)
              </h3>
              
              <div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Existing Category</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">What It Does</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">What It Misses</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 font-medium">Project Management</td>
                      <td className="py-3 px-4">Tracks tasks</td>
                      <td className="py-3 px-4">No pre-staging, triggers, or orchestration</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 font-medium">Business Continuity</td>
                      <td className="py-3 px-4">Plans for disasters</td>
                      <td className="py-3 px-4">No daily strategic response, no integration</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 font-medium">GRC Platforms</td>
                      <td className="py-3 px-4">Manages compliance</td>
                      <td className="py-3 px-4">No execution, no coordination</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Strategy Software</td>
                      <td className="py-3 px-4">Sets goals</td>
                      <td className="py-3 px-4">No connection to action</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-8 p-6 bg-primary/10 rounded-lg">
                <h4 className="font-bold text-foreground mb-4 text-center">SEOS Combines All Four:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center text-center gap-2">
                    <Shield className="h-8 w-8 text-primary" />
                    <span className="text-sm font-medium text-foreground">Pre-staged Readiness</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <Radio className="h-8 w-8 text-primary" />
                    <span className="text-sm font-medium text-foreground">Signal Monitoring</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <Zap className="h-8 w-8 text-primary" />
                    <span className="text-sm font-medium text-foreground">Orchestrated Execution</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <BookOpen className="h-8 w-8 text-primary" />
                    <span className="text-sm font-medium text-foreground">Continuous Learning</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-foreground mb-6 text-center">
                Category Creation Precedents
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-blue-500 mb-2">$250B+</div>
                  <p className="font-medium text-foreground">Salesforce</p>
                  <p className="text-sm text-muted-foreground">Created CRM</p>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-purple-500 mb-2">$150B+</div>
                  <p className="font-medium text-foreground">ServiceNow</p>
                  <p className="text-sm text-muted-foreground">Created ITSM</p>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-green-500 mb-2">$60B+</div>
                  <p className="font-medium text-foreground">Workday</p>
                  <p className="text-sm text-muted-foreground">Created HCM Cloud</p>
                </div>
                <div className="text-center p-4 bg-primary/10 rounded-lg border-2 border-primary/30">
                  <div className="text-3xl font-bold text-primary mb-2">$5B+</div>
                  <p className="font-medium text-foreground">M</p>
                  <p className="text-sm text-muted-foreground">Creating SEOS</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* What The Research Shows */}
      <section className="py-16 px-6 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-500 text-white border-0">
              <BarChart3 className="w-4 h-4 mr-2" />
              Industry Research
            </Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              What the Research Proves
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-2 hover:border-primary/30 transition-colors">
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-primary mb-4 opacity-40" />
                <p className="text-foreground mb-4 italic">
                  "Organizations with pre-defined incident response teams save 35% more on 
                  breach-related costs than those that improvise."
                </p>
                <p className="text-sm text-muted-foreground font-medium">
                  — IBM/Ponemon Institute, 2024
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/30 transition-colors">
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-primary mb-4 opacity-40" />
                <p className="text-foreground mb-4 italic">
                  "The first 72 hours of a crisis are critical. Organizations that contain incidents 
                  quickly save an average of $1.76M."
                </p>
                <p className="text-sm text-muted-foreground font-medium">
                  — McKinsey / IBM 2024
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/30 transition-colors">
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-primary mb-4 opacity-40" />
                <p className="text-foreground mb-4 italic">
                  "89% of business leaders say resilience is one of their most important 
                  strategic organizational priorities."
                </p>
                <p className="text-sm text-muted-foreground font-medium">
                  — PwC Global Crisis Survey, 2023
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/research">
              <Button className="bg-primary text-white hover:bg-primary/90">
                Explore Full Research
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform How Your Organization Responds?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            See M in action and discover what 12-minute strategic coordination looks like.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/demo-selector">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </Link>
            <Link href="/research">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                View Research
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
