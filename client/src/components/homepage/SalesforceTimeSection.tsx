import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle2, Zap, DollarSign, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import FootballConnectionCallout from './FootballConnectionCallout';

export default function SalesforceTimeSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20" data-testid="section-salesforce-time">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-12">
            <Badge className="mb-4 bg-orange-600 text-white text-sm px-4 py-1" data-testid="badge-research-validation">
              Research Validation
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" data-testid="heading-time-crisis">
              The Coordination Crisis: Business Wastes Time Football Eliminated Decades Ago
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Enterprise teams waste up to 70% of their time on coordination overhead 
              instead of execution. Football teams solved this decades ago with playbooks 
              and no-huddle execution—M brings that proven efficiency to business.
            </p>
          </div>

          <Card className="border-2 border-orange-500 mb-8" data-testid="card-time-breakdown">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">
                Where Strategic Execution Time Goes (Traditional Methods)
              </h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Scheduling & Coordinating Meetings</span>
                    <span className="text-sm font-bold text-orange-600 dark:text-orange-400">25%</span>
                  </div>
                  <Progress value={25} className="h-3" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Email Chains & Status Updates</span>
                    <span className="text-sm font-bold text-orange-600 dark:text-orange-400">20%</span>
                  </div>
                  <Progress value={20} className="h-3" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Finding Information & Documents</span>
                    <span className="text-sm font-bold text-orange-600 dark:text-orange-400">15%</span>
                  </div>
                  <Progress value={15} className="h-3" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Clarifying Roles & Responsibilities</span>
                    <span className="text-sm font-bold text-orange-600 dark:text-orange-400">10%</span>
                  </div>
                  <Progress value={10} className="h-3" />
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">Time Actually Executing Strategy</span>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">30%</span>
                  </div>
                  <Progress value={30} className="h-3 mt-2" />
                </div>
              </div>

              <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
                <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                  70% of time wasted on coordination overhead instead of execution
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Based on common enterprise execution patterns
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-2 hover:border-green-500 transition-colors" data-testid="card-vexor-solution">
              <CardHeader>
                <Zap className="w-12 h-12 mb-3 text-green-600" />
                <CardTitle className="text-xl">M's Solution</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>From 200 emails → 1 activation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>From 20 meetings → 0 meetings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>From 72 hours → 12 minutes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>From calendar Tetris → instant alignment</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-500 transition-colors" data-testid="card-exec-time">
              <CardHeader>
                <Clock className="w-12 h-12 mb-3 text-blue-600" />
                <CardTitle className="text-xl">Executive Time Reclaimed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">M customer outcomes:</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>C-suite saves 15-20 hours per week</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>VP-level saves 10-15 hours per week</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Managers save 5-10 hours per week</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Redirect time to strategic thinking</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-purple-500 transition-colors" data-testid="card-roi-impact">
              <CardHeader>
                <DollarSign className="w-12 h-12 mb-3 text-purple-600" />
                <CardTitle className="text-xl">ROI Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>$500K-$5M annual time savings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>360x faster coordination</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>70% reduction in overhead</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Higher strategic execution rate</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-2 border-orange-500" data-testid="card-time-cta">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                Stop Wasting Time. Start Executing.
              </h3>
              <p className="text-lg mb-6 text-muted-foreground max-w-2xl mx-auto">
                Watch how M eliminates coordination overhead and reclaims 70% 
                of your team's strategic execution time.
              </p>
              <Button size="lg" asChild data-testid="button-see-time-demo">
                <a href="/demo-selector">
                  See M Eliminate Coordination Friction
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
            </CardContent>
          </Card>

          <FootballConnectionCallout 
            text="Football eliminated coordination overhead by removing the huddle and using instant play-calling. No meetings required. M applies the same principle: from decision to execution in 12 minutes."
            testId="callout-salesforce-connection"
          />

        </div>
      </div>
    </section>
  );
}
