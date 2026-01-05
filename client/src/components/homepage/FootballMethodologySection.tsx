import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  BookOpen, 
  Users, 
  Zap, 
  Target, 
  Shield,
  ArrowRight
} from "lucide-react";

export default function FootballMethodologySection() {
  return (
    <section id="methodology" className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">

          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-600 text-white text-sm px-4 py-1" data-testid="badge-football-methodology">
              The Football Methodology
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-methodology-headline">
              What Elite Football Has Known for a Century
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-methodology-description">
              Since the forward pass was legalized in 1906, football has continuously 
              refined the art of rapid coordination under pressure. M brings that 
              battle-tested system to strategic execution.
            </p>
          </div>

          {/* Timeline: Evolution of Football Coordination */}
          <Card className="mb-12 border-2 border-primary" data-testid="card-coordination-timeline">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-primary" />
                100+ Years of Coordination Evolution
              </CardTitle>
              <CardDescription className="text-lg">
                How football perfected rapid decision-making over a century
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* 1906 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-24 font-bold text-primary text-lg">1906</div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Forward Pass Legalized</h4>
                  <p className="text-sm text-muted-foreground">
                    Introduced complexity requiring real-time coordination between 
                    quarterback, receivers, and blockers. Teams needed systematic 
                    approach to synchronize 11 players in under 60 seconds.
                  </p>
                </div>
              </div>

              {/* 1940s */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-24 font-bold text-primary text-lg">1940s</div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Playbook Systems Emerge</h4>
                  <p className="text-sm text-muted-foreground">
                    Coaches like Paul Brown introduced comprehensive playbooks—documenting 
                    every scenario, every role, every responsibility. No more improvisation; 
                    preparation became the competitive advantage.
                  </p>
                </div>
              </div>

              {/* 1970s */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-24 font-bold text-primary text-lg">1970s</div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Pre-Snap Reads & Audibles</h4>
                  <p className="text-sm text-muted-foreground">
                    Quarterbacks gained authority to change plays at the line based on 
                    defensive formations. Real-time adaptation became standard—decisions 
                    made in seconds, not minutes.
                  </p>
                </div>
              </div>

              {/* 1980s */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-24 font-bold text-primary text-lg">1984-1988</div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">No-Huddle Offense Pioneered</h4>
                  <p className="text-sm text-muted-foreground">
                    Cincinnati Bengals coach Sam Wyche pioneered the no-huddle offense, 
                    making it their base operation by 1988. QB Boomer Esiason won MVP 
                    as the Bengals led the NFL in scoring and reached the Super Bowl. 
                    Coordination time dropped from 40 seconds to 15 seconds—speed became 
                    the ultimate competitive weapon.
                  </p>
                </div>
              </div>

              {/* 1990s-2000s */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-24 font-bold text-primary text-lg">1990s-2000s</div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Coach-to-QB Helmet Communication</h4>
                  <p className="text-sm text-muted-foreground">
                    NFL allowed radio communication from coaches to quarterbacks (1994, 
                    permanently by early 2000s). Instant voice coordination replaced hand 
                    signals—eliminating communication delays entirely.
                  </p>
                </div>
              </div>

              {/* 2025 */}
              <div className="flex gap-4 pt-4 border-t">
                <div className="flex-shrink-0 w-24 font-bold text-green-600 text-lg">2025</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-green-600 mb-1">M Brings It to Business</h4>
                  <p className="text-sm text-muted-foreground">
                    For the first time, business executives can execute strategic decisions 
                    with the same systematic coordination that championship teams have used 
                    for decades. Pre-built playbooks, instant alignment, sub-15-minute execution.
                  </p>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* The 5 Principles (Football → M) */}
          <div className="mb-12">
            <h3 className="text-3xl font-bold text-center mb-8" data-testid="text-principles-headline">
              The 5 Principles Championship Teams Use
            </h3>
            <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
              These principles aren't theory—they're proven across 100+ years, 
              thousands of teams, and millions of successful plays. M applies 
              them to business execution.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Principle 1 */}
              <Card className="border-2 hover:border-primary transition-colors" data-testid="card-principle-playbooks">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>1. Prepare Playbooks Before Game Day</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    <strong>Football:</strong> Coaches install 300+ plays in training 
                    camp. Every scenario is prepared, practiced, and perfected before 
                    the season starts.
                  </p>
                  <p className="text-sm font-semibold text-primary">
                    <strong>M:</strong> 166 pre-built strategic playbooks cover 
                    crisis response, M&A integration, product launches, competitive 
                    response, and more—prepared before you need them.
                  </p>
                </CardContent>
              </Card>

              {/* Principle 2 */}
              <Card className="border-2 hover:border-primary transition-colors" data-testid="card-principle-roles">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>2. Every Role Knows Their Assignment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    <strong>Football:</strong> When the play is called, left tackle 
                    knows exactly who to block, receiver knows the route, running back 
                    knows the protection scheme. Zero ambiguity.
                  </p>
                  <p className="text-sm font-semibold text-primary">
                    <strong>M:</strong> When playbook activates, every stakeholder 
                    sees their specific role, tasks, and accountabilities. McKinsey's 
                    "Clarity" outcome delivered instantly.
                  </p>
                </CardContent>
              </Card>

              {/* Principle 3 */}
              <Card className="border-2 hover:border-primary transition-colors" data-testid="card-principle-speed">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>3. Execute at Game Speed</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    <strong>Football:</strong> From coach's decision to snap of ball: 
                    under 40 seconds. 80+ times per game. No delays, no coordination 
                    overhead.
                  </p>
                  <p className="text-sm font-semibold text-primary">
                    <strong>M:</strong> From executive decision to coordinated 
                    execution: 12 minutes average. Eliminate 72 hours of meetings 
                    and email chains.
                  </p>
                </CardContent>
              </Card>

              {/* Principle 4 */}
              <Card className="border-2 hover:border-primary transition-colors" data-testid="card-principle-practice">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>4. Practice Creates Muscle Memory</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    <strong>Football:</strong> Teams don't just have playbooks—they 
                    run each play 100+ times in practice. Game day execution is 
                    automatic because they've prepared.
                  </p>
                  <p className="text-sm font-semibold text-primary">
                    <strong>M:</strong> Practice Mode lets teams simulate crisis 
                    response, M&A integration, or product launches before they happen. 
                    Find gaps in preparation, not during real events.
                  </p>
                </CardContent>
              </Card>

              {/* Principle 5 */}
              <Card className="border-2 hover:border-primary transition-colors" data-testid="card-principle-learning">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>5. Film Study Drives Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    <strong>Football:</strong> After every game, teams review film to 
                    identify what worked, what didn't, and how to improve. Continuous 
                    learning is systematic.
                  </p>
                  <p className="text-sm font-semibold text-primary">
                    <strong>M:</strong> Four Outcomes Scorecard tracks Clarity, 
                    Speed, Skills, and Commitment after every activation. Learn from 
                    each execution to improve the next one.
                  </p>
                </CardContent>
              </Card>

              {/* Principle 6 - The Philosophy */}
              <Card className="border-2 border-green-500 bg-green-50 dark:bg-green-900/20" data-testid="card-principle-philosophy">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-3">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>The Core Philosophy: Coach Decides, System Coordinates</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    <strong>Football:</strong> The coach makes the strategic decision 
                    (which play to run). The system handles coordination (getting 11 
                    players aligned). The coach stays in control.
                  </p>
                  <p className="text-sm font-semibold text-green-600">
                    <strong>M:</strong> Executives make strategic decisions. M 
                    handles coordination (aligning 30+ stakeholders). Human judgment + 
                    machine speed = Augmented Execution.
                  </p>
                </CardContent>
              </Card>

            </div>
          </div>

          {/* The Proof Statement */}
          <Card className="bg-gradient-to-r from-primary to-blue-600 text-white" data-testid="card-proof-statement">
            <CardContent className="p-8 md:p-12 text-center">
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                This Isn't Theory. It's a Century of Proof.
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div>
                  <div className="text-4xl font-bold mb-2" data-testid="stat-years">100+</div>
                  <p className="text-sm opacity-90">Years of Refinement</p>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2" data-testid="stat-teams">1,000s</div>
                  <p className="text-sm opacity-90">of Teams Using System</p>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2" data-testid="stat-plays">Millions</div>
                  <p className="text-sm opacity-90">of Successful Plays</p>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2" data-testid="stat-champions">Every</div>
                  <p className="text-sm opacity-90">Championship Team</p>
                </div>
              </div>
              <p className="text-xl mb-6 max-w-3xl mx-auto opacity-90">
                Every Super Bowl champion, every college football national champion, 
                every legendary coach—they all use this methodology. It's not 
                debatable. It's documented. It works.
              </p>
              <p className="text-2xl font-semibold mb-8">
                Now it's time to bring it to business.
              </p>
              <Button size="lg" variant="secondary" asChild data-testid="button-see-methodology">
                <a href="/demo-selector">
                  See the Methodology in Action
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </section>
  );
}
