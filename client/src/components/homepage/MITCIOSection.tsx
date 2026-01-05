import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Zap, DollarSign, Award, ArrowRight } from 'lucide-react';
import FootballConnectionCallout from './FootballConnectionCallout';

export default function MITCIOSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20" data-testid="section-mit-cio">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-12">
            <Badge className="mb-4 bg-purple-600 text-white text-sm px-4 py-1" data-testid="badge-research-validation">
              Research Validation
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" data-testid="heading-mit-cio">
              MIT Technology Review Validates: The Efficiency and Speed Football Delivers
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              MIT Technology Review surveyed 600+ Fortune 1000 CIOs on AI's productivity impact. 
              Their findings confirm what football has proven for decades: systematic coordination 
              methodology delivers extraordinary efficiency gains.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            
            <Card className="border-2 border-blue-500" data-testid="card-process-efficiency">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <TrendingUp className="w-5 h-5" />
                  Efficiency Expectations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">MIT CIO Survey (600+ executives):</p>
                  <p className="text-3xl font-bold" data-testid="value-mit-efficiency">25%+ Gain</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    81% expect AI to boost efficiency by 25%+ within 2 years
                  </p>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-1">M Delivers:</p>
                  <p className="text-3xl font-bold text-blue-600" data-testid="value-vexor-efficiency">360x Faster</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    72 hours → 12 minutes coordination
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500" data-testid="card-innovation-velocity">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <Zap className="w-5 h-5" />
                  Peak Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">MIT CIO Survey (600+ executives):</p>
                  <p className="text-3xl font-bold" data-testid="value-mit-innovation">50%+ Gain</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    33% expect efficiency gains of 50% or more
                  </p>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-1">M Delivers:</p>
                  <p className="text-3xl font-bold text-green-600" data-testid="value-vexor-innovation">2-4 Weeks</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Faster time-to-market (instant alignment)
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-500" data-testid="card-roi-governance">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-600">
                  <DollarSign className="w-5 h-5" />
                  Strategic Investment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">MIT CIO Survey (600+ executives):</p>
                  <p className="text-3xl font-bold" data-testid="value-mit-roi">46% Boost</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    46% increasing AI budgets by 25%+ in next year
                  </p>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-1">M Delivers:</p>
                  <p className="text-3xl font-bold text-purple-600" data-testid="value-vexor-roi">$500K-$5M</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Annual value (governance built-in)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-2 border-purple-500 mb-8" data-testid="card-cio-scaling">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-white" data-testid="text-cio-percent">64%</span>
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-2">
                    CIOs Are Scaling AI Enterprise-Wide by 2026
                  </h3>
                  <p className="text-lg text-muted-foreground mb-4">
                    MIT research shows 64% of Fortune 1000 CIOs are scaling AI across 
                    their organizations. Most focus on knowledge work—M addresses 
                    what they're missing: strategic coordination and execution velocity.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                    <Button size="lg" variant="default" asChild data-testid="button-see-vexor">
                      <a href="/demo-selector">
                        See M in Action
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/50" data-testid="card-mit-citation">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Award className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div className="space-y-2">
                  <p className="font-semibold">
                    Data Source: MIT Technology Review Insights
                  </p>
                  <p className="text-sm text-muted-foreground">
                    "Laying the Foundation for Data- and AI-Led Growth" (October 2023) 
                    surveyed 600+ CIOs, CTOs, and CDOs from Fortune 1000 companies. Key findings: 
                    81% expect AI to boost efficiency by at least 25% within 2 years, with 33% 
                    expecting gains of 50% or more. 100% of surveyed organizations will increase 
                    AI spending, with 46% boosting budgets by 25%+.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <FootballConnectionCallout 
            text="MIT found CIOs expect 25-50%+ efficiency gains from AI within 2 years. Football achieved 360x coordination speed decades ago through systematic playbooks. M delivers both—AI technology powered by proven football methodology."
            testId="callout-mit-connection"
          />

        </div>
      </div>
    </section>
  );
}
