import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, X, Building2, ArrowRight } from "lucide-react";

export default function FootballHeroSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Eyebrow - The Heritage */}
          <div className="text-center mb-6">
            <Badge className="text-sm px-4 py-2 bg-green-600 text-white" data-testid="badge-football-heritage">
              🏈 Built on 100+ Years of Proven Methodology
            </Badge>
          </div>

          {/* Main Headline */}
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-slate-900 dark:text-white" data-testid="text-hero-headline">
              Your Competitors Are<br />
              <span className="text-red-600 dark:text-red-400">Executing in 12 Minutes</span><br />
              You're Taking 72 Hours
            </h1>
            <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 max-w-4xl mx-auto mb-6 font-semibold" data-testid="text-hero-subtext-1">
              Every strategic decision delayed costs Fortune 1000 companies <strong>$5.8M annually</strong> in lost value. 
              Competitors using M move 6x faster on market opportunities, crisis response, and M&A execution.
            </p>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto" data-testid="text-hero-subtext-2">
              M is the only Strategic Execution Operating System that compresses 72-hour coordination into 12-minute action. 
              Not adopting it isn't an option—it's a competitive liability.
            </p>
          </div>

          {/* The Visual Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            
            {/* Football Card */}
            <Card className="border-2 border-green-500 bg-green-50 dark:bg-green-900/20" data-testid="card-football-system">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🏈</span>
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Elite Football</CardTitle>
                    <CardDescription className="text-base">The Proven System</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">300+ Pre-Installed Plays</p>
                      <p className="text-sm text-muted-foreground">
                        Every scenario prepared before kickoff
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">&lt;60 Second Execution</p>
                      <p className="text-sm text-muted-foreground">
                        From coach's decision to coordinated action
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">11 Players, Perfect Sync</p>
                      <p className="text-sm text-muted-foreground">
                        Everyone knows their role, no coordination meetings
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">80+ Critical Decisions/Game</p>
                      <p className="text-sm text-muted-foreground">
                        Sustained execution velocity over 3+ hours
                      </p>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm font-semibold text-green-600">
                    📊 Proven System: 100+ years, thousands of teams, millions of successful plays
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Business Card - WITHOUT M */}
            <Card className="border-2 border-red-600 bg-red-50 dark:bg-red-900/30 shadow-lg" data-testid="card-business-crisis">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                    <X className="w-6 h-6 text-white font-bold text-2xl" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Business Today</CardTitle>
                    <CardDescription className="text-base">The Coordination Crisis</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Zero Pre-Built Playbooks</p>
                      <p className="text-sm text-muted-foreground">
                        Reinventing response for every situation
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">72+ Hour Coordination</p>
                      <p className="text-sm text-muted-foreground">
                        Days of meetings and emails to align
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">30 Stakeholders, Chaos</p>
                      <p className="text-sm text-muted-foreground">
                        Unclear roles, confusion, missed responsibilities
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Slow, Reactive Decisions</p>
                      <p className="text-sm text-muted-foreground">
                        Competitors move while you're still coordinating
                      </p>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm font-semibold text-red-600">
                    📉 McKinsey: 30% strategic value lost to coordination failures
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* The Bridge Statement */}
          <Card className="border-2 border-primary bg-primary/5 mb-8" data-testid="card-bridge-statement">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                What if your business could execute strategic decisions with 
                the same precision as championship football teams?
              </h3>
              <p className="text-lg text-muted-foreground mb-6 max-w-3xl mx-auto">
                M is the Strategic Execution Operating System built on football's 
                proven coordination methodology—validated by modern research, adapted 
                for business execution.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild data-testid="button-watch-demo">
                  <a href="/demo-selector">
                    Watch Live Demo
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild data-testid="button-learn-methodology">
                  <a href="#methodology">
                    Learn the Methodology
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1" data-testid="stat-years">100+</div>
              <p className="text-sm text-muted-foreground">Years of Proven<br />Methodology</p>
            </div>
            <div className="p-4">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-1" data-testid="stat-playbooks">166</div>
              <p className="text-sm text-muted-foreground">Pre-Built Strategic<br />Playbooks</p>
            </div>
            <div className="p-4">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-1" data-testid="stat-minutes">12min</div>
              <p className="text-sm text-muted-foreground">Decision to<br />Coordinated Action</p>
            </div>
            <div className="p-4">
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-1" data-testid="stat-faster">360x</div>
              <p className="text-sm text-muted-foreground">Faster Than<br />Traditional Methods</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
