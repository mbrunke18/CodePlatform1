import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, Users, Heart, ArrowRight } from 'lucide-react';
import FootballConnectionCallout from './FootballConnectionCallout';

export default function McKinseyValidationSection() {
  return (
    <section className="py-20 bg-blue-50 dark:bg-blue-900/10" data-testid="section-mckinsey-validation">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-600 text-white text-sm px-4 py-1" data-testid="badge-research-backed">
              Research Validation
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" data-testid="heading-mckinsey">
              McKinsey Confirms: Business Has the Coordination Problem Football Solved
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              McKinsey research shows even high-performing companies lose 30% of 
              their strategic value to execution failures. Football's methodology closes this gap.
            </p>
          </div>

          <Card className="border-2 border-red-500 mb-8 overflow-hidden" data-testid="card-gap-explanation">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row items-center">
                
                <div className="flex-shrink-0 bg-red-50 dark:bg-red-900/20 p-8 md:p-12">
                  <div className="w-40 h-40 bg-white dark:bg-gray-900 rounded-full 
                              flex items-center justify-center shadow-lg border-4 border-red-500">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-red-600 dark:text-red-400" data-testid="text-gap-percent">30%</div>
                      <div className="text-sm text-muted-foreground mt-1">GAP</div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-8 md:p-12">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    The Strategy-to-Execution Gap
                  </h3>
                  <p className="text-lg text-muted-foreground mb-4">
                    McKinsey research reveals that even high-performing companies have 
                    a <strong>30% gap</strong> between their strategy's full potential 
                    and what is actually delivered.
                  </p>
                  <p className="text-lg font-semibold text-red-600 dark:text-red-400 mb-6">
                    This gap costs organizations millions in unrealized value and is 
                    attributed to shortcomings in their operating models—specifically 
                    how they coordinate decisions and execution.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button size="lg" asChild data-testid="button-see-demo">
                      <a href="/demo-selector">
                        See How M Closes the Gap
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                    <Button size="lg" variant="outline" asChild data-testid="button-mckinsey-research">
                      <a href="https://www.mckinsey.com/capabilities/people-and-organizational-performance/our-insights/a-new-operating-model-for-a-new-world" target="_blank" rel="noopener noreferrer">
                        Read McKinsey Research
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow" data-testid="card-outcome-clarity">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-blue-600" />
              <h4 className="font-semibold text-lg mb-2">Clarity</h4>
              <p className="text-sm text-muted-foreground">
                Resources aligned to strategy
              </p>
            </Card>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow" data-testid="card-outcome-speed">
              <Clock className="w-12 h-12 mx-auto mb-3 text-green-600" />
              <h4 className="font-semibold text-lg mb-2">Speed</h4>
              <p className="text-sm text-muted-foreground">
                Fast, frictionless workflows
              </p>
            </Card>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow" data-testid="card-outcome-skills">
              <Users className="w-12 h-12 mx-auto mb-3 text-purple-600" />
              <h4 className="font-semibold text-lg mb-2">Skills</h4>
              <p className="text-sm text-muted-foreground">
                Future-ready workforce
              </p>
            </Card>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow" data-testid="card-outcome-commitment">
              <Heart className="w-12 h-12 mx-auto mb-3 text-red-600" />
              <h4 className="font-semibold text-lg mb-2">Commitment</h4>
              <p className="text-sm text-muted-foreground">
                Performance-oriented culture
              </p>
            </Card>
          </div>

          <Card className="bg-primary text-primary-foreground" data-testid="card-four-outcomes-callout">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                M Delivers McKinsey's Four Outcomes
              </h3>
              <p className="text-lg mb-6 opacity-90">
                McKinsey's research identified four measurable outcomes that drive 
                organizational performance: <strong>Clarity, Speed, Skills, and Commitment</strong>. 
                M is purpose-built to optimize all four.
              </p>
              <p className="text-xl font-semibold">
                From 30% execution gap to 95% strategic realization.
              </p>
            </CardContent>
          </Card>

          <FootballConnectionCallout 
            text="Football coaches close this gap by preparing playbooks before game day and coordinating execution in under 60 seconds. M brings that proven system to business strategy."
            testId="callout-mckinsey-connection"
          />

        </div>
      </div>
    </section>
  );
}
