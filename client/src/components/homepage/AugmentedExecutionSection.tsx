import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Shield, Zap, Eye, CheckCircle2, TrendingUp, Cpu, Quote, ArrowRight } from 'lucide-react';

export default function AugmentedExecutionSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-muted/20 to-background" data-testid="section-augmented-execution">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-12">
            <Badge className="mb-4 bg-green-600 text-white text-sm px-4 py-1" data-testid="badge-human-machine">
              Human + Machine
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" data-testid="heading-augmented-execution">
              Augmented Execution: Where Humans Stay in Control
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              M doesn't replace human judgment—we amplify it. By eliminating 
              coordination friction while maintaining human oversight, we deliver 
              the speed of automation with the wisdom of human decision-making.
            </p>
          </div>

          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center gap-6 p-8 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-2xl" data-testid="visual-equation">
              <div className="text-center">
                <Users className="w-20 h-20 mx-auto mb-2 text-blue-600" />
                <p className="font-semibold">Humans</p>
                <p className="text-sm text-muted-foreground">Judgment & Strategy</p>
              </div>
              <div className="text-4xl font-bold text-green-600">+</div>
              <div className="text-center">
                <Cpu className="w-20 h-20 mx-auto mb-2 text-green-600" />
                <p className="font-semibold">Machine</p>
                <p className="text-sm text-muted-foreground">Speed & Coordination</p>
              </div>
              <div className="text-4xl font-bold text-purple-600">=</div>
              <div className="text-center">
                <TrendingUp className="w-20 h-20 mx-auto mb-2 text-purple-600" />
                <p className="font-semibold">10x Results</p>
                <p className="text-sm text-muted-foreground">Augmented Execution</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            
            <Card className="border-2 hover:border-blue-500 transition-colors" data-testid="card-principle-control">
              <CardHeader>
                <Shield className="w-12 h-12 mb-3 text-blue-600" />
                <CardTitle className="text-xl">Humans Stay in Control</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>M doesn't replace decisions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Every critical action requires human approval</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Stakeholders retain full authority</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>System coordinates, humans execute</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-500 transition-colors" data-testid="card-principle-friction">
              <CardHeader>
                <Zap className="w-12 h-12 mb-3 text-green-600" />
                <CardTitle className="text-xl">Eliminate Coordination Friction</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>From 72 hours of meetings → 12 minutes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>From 200 emails → 1 activation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>From calendar Tetris → instant alignment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>From confusion → clarity</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-purple-500 transition-colors" data-testid="card-principle-transparency">
              <CardHeader>
                <Eye className="w-12 h-12 mb-3 text-purple-600" />
                <CardTitle className="text-xl">Build Trust Through Transparency</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Real-time visibility for all stakeholders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Clear accountability (who does what)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Override capability (humans can change course)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Continuous learning (system improves from feedback)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-2 border-green-500 mb-12" data-testid="card-quote">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                    <Quote className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <blockquote className="text-xl md:text-2xl font-semibold mb-3">
                    "The real question isn't 'What can we automate?' it's 
                    'Where should humans stay in the loop?'"
                  </blockquote>
                  <p className="text-sm text-muted-foreground">
                    — Torsten D., Enterprise Transformation Leader
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    From "Augmented Execution: Human + Machine" (October 2025)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-purple-50 dark:from-orange-900/20 dark:to-purple-900/20 border-2 border-orange-500 mb-12" data-testid="card-hypothesis-planning">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-orange-600 text-white rounded-full px-4 py-2 mb-4">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-semibold">Hypothesis-Driven Planning</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  From 5-Year Plans to 2-Year Hypotheses
                </h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-sm font-semibold text-muted-foreground mb-2">Old Model</div>
                  <div className="bg-red-100 dark:bg-red-900/20 rounded-lg p-6 border-2 border-red-300">
                    <p className="text-4xl font-bold text-red-600 mb-2">5 Years</p>
                    <p className="text-sm text-muted-foreground">
                      Strategic plans outdated before you finish writing them
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-muted-foreground mb-2">M Model</div>
                  <div className="bg-green-100 dark:bg-green-900/20 rounded-lg p-6 border-2 border-green-300">
                    <p className="text-4xl font-bold text-green-600 mb-2">2 Years</p>
                    <p className="text-sm text-muted-foreground">
                      Fast iteration, rapid testing, continuous adaptation
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 max-w-3xl mx-auto">
                <p className="text-lg text-center mb-4">
                  <strong>Speed of change demands speed of planning.</strong> M enables you to test 
                  strategic hypotheses in 2-minute conversations instead of 6-month planning cycles—and when 
                  you're ready to execute, coordinate 30 stakeholders in 12 minutes instead of 72 hours.
                </p>
                <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-orange-200">
                  <p className="text-sm text-muted-foreground text-center">
                    <strong>Example:</strong> "What if a competitor enters APAC with 50% lower pricing?" 
                    → M runs the hypothesis through your Predictive Execution Engine, shows impact 
                    on your playbooks/budgets/stakeholders in real-time, then executes your response in 12 minutes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">
              See Augmented Execution in Action
            </h3>
            <p className="text-lg text-muted-foreground mb-6">
              Watch how M coordinates 30 stakeholders in 12 minutes while 
              keeping every human in full control.
            </p>
            <Button size="lg" asChild data-testid="button-view-demo">
              <a href="/demo-selector">
                View Live Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
}
