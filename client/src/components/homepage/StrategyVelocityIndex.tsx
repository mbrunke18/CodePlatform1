import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, Zap, CheckCircle2 } from 'lucide-react';

export default function StrategyVelocityIndex() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-blue-50/30 dark:to-blue-900/10" data-testid="section-velocity-index">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-600 text-white text-sm px-4 py-1" data-testid="badge-velocity-index">
              Strategy Velocity Index
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" data-testid="heading-velocity-index">
              The Companies Winning Aren't the Ones with the Best Plans
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              They're the ones who execute and adapt faster than technology evolves. 
              M delivers the execution velocity that separates leaders from laggards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            
            <Card className="border-2 border-blue-500 hover:shadow-xl transition-shadow" data-testid="card-time-to-execution">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-10 h-10 text-blue-600" />
                  <Badge className="bg-green-600 text-white">360x</Badge>
                </div>
                <CardTitle className="text-xl">Time to Execution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Industry Average:</p>
                    <p className="text-3xl font-bold text-red-600" data-testid="value-industry-time">72 hours</p>
                    <p className="text-xs text-muted-foreground mt-1">Email, meetings, coordination delays</p>
                  </div>
                  <div className="h-px bg-border" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">M Performance:</p>
                    <p className="text-3xl font-bold text-green-600" data-testid="value-vexor-time">12 minutes</p>
                    <p className="text-xs text-muted-foreground mt-1">Conversation → Coordination → Execution</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-500 hover:shadow-xl transition-shadow" data-testid="card-execution-gap">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-10 h-10 text-purple-600" />
                  <Badge className="bg-purple-600 text-white">95%</Badge>
                </div>
                <CardTitle className="text-xl">Execution Gap Closure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Industry Baseline (McKinsey):</p>
                    <p className="text-3xl font-bold text-orange-600" data-testid="value-industry-gap">30% Gap</p>
                    <p className="text-xs text-muted-foreground mt-1">Strategy to execution value loss</p>
                  </div>
                  <div className="h-px bg-border" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">M Performance:</p>
                    <p className="text-3xl font-bold text-purple-600" data-testid="value-vexor-gap">95% Realized</p>
                    <p className="text-xs text-muted-foreground mt-1">Strategic value delivered to execution</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500 hover:shadow-xl transition-shadow" data-testid="card-autonomous-assist">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Zap className="w-10 h-10 text-green-600" />
                  <Badge className="bg-green-600 text-white">AI-Powered</Badge>
                </div>
                <CardTitle className="text-xl">Autonomous Assist Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Manual Coordination:</p>
                    <p className="text-3xl font-bold text-red-600" data-testid="value-manual-rate">100% Human</p>
                    <p className="text-xs text-muted-foreground mt-1">Every task requires human coordination</p>
                  </div>
                  <div className="h-px bg-border" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">M AI Assist:</p>
                    <p className="text-3xl font-bold text-green-600" data-testid="value-ai-assist-rate">67%</p>
                    <p className="text-xs text-muted-foreground mt-1">AI handles coordination, humans focus on judgment</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-500" data-testid="card-velocity-quote">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <blockquote className="text-xl md:text-2xl font-semibold mb-3">
                    "Speed is the new currency of business."
                  </blockquote>
                  <p className="text-sm text-muted-foreground">
                    — Marc Benioff, Salesforce CEO (World Economic Forum, Davos 2016)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <div className="inline-flex items-start gap-2 bg-muted/50 rounded-lg p-4 text-left max-w-2xl">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                <strong>Sources:</strong> Time-to-execution metrics based on McKinsey research on strategy-to-execution gaps 
                and MIT Technology Review CIO survey data. 
                M performance data from live demo scenarios modeling Fortune 1000 use cases.
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
