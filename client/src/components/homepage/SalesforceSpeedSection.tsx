import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, Quote, ArrowRight, TrendingUp, AlertTriangle } from 'lucide-react';
import FootballConnectionCallout from './FootballConnectionCallout';

export default function SalesforceSpeedSection() {
  return (
    <section className="py-20 bg-orange-50 dark:bg-orange-900/10" data-testid="section-salesforce-speed">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-12">
            <Badge className="mb-4 bg-orange-600 text-white text-sm px-4 py-1" data-testid="badge-research-validation">
              Research Validation
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" data-testid="heading-speed-currency">
              Industry Evolution: The Execution Velocity Football Perfected
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Business execution timelines have collapsed from years to months as competitive 
              pressure intensifies. Football achieved instant execution decades ago: from coach's 
              decision to coordinated action in under 60 seconds. M brings that velocity to business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="text-center p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/20 dark:to-background" data-testid="card-2000-era">
              <div className="mb-3">
                <span className="text-sm font-semibold">2000: Strategic Planning Era</span>
              </div>
              <div className="text-4xl font-bold text-muted-foreground mb-2">3-5 years</div>
              <p className="text-xs text-muted-foreground">
                Long-term strategic plans with annual reviews
              </p>
            </Card>

            <Card className="text-center p-6 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-background" data-testid="card-2010-era">
              <div className="mb-3">
                <span className="text-sm font-semibold">2010: Digital Transformation</span>
              </div>
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">12-18 months</div>
              <p className="text-xs text-muted-foreground">
                Agile mindset with quarterly pivots
              </p>
            </Card>

            <Card className="text-center p-6 bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-background" data-testid="card-2020-era">
              <div className="mb-3">
                <span className="text-sm font-semibold">2020: Agile Organizations</span>
              </div>
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">3-6 months</div>
              <p className="text-xs text-muted-foreground">
                Continuous iteration with sprint-based delivery
              </p>
            </Card>

            <Card className="text-center p-6 bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/40 dark:to-orange-900/20 border-2 border-orange-500" data-testid="card-2025-era">
              <div className="mb-3">
                <span className="text-sm font-semibold">2025: Augmented Execution</span>
              </div>
              <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">12 min</div>
              <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold">
                M: Real-time strategic coordination
              </p>
            </Card>
          </div>

          <Card className="border-2 border-orange-500 mb-8" data-testid="card-old-vs-new">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">
                The Old World vs. The New World
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                    <h4 className="font-semibold text-lg">Old World (Coordination Bottleneck)</h4>
                  </div>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 dark:text-red-400 font-bold mt-0.5">✗</span>
                      <span>Days/weeks to align 30 stakeholders across departments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 dark:text-red-400 font-bold mt-0.5">✗</span>
                      <span>200+ emails per strategic decision</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 dark:text-red-400 font-bold mt-0.5">✗</span>
                      <span>20+ meetings to achieve coordination</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 dark:text-red-400 font-bold mt-0.5">✗</span>
                      <span>Opportunities missed while coordinating</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 dark:text-red-400 font-bold mt-0.5">✗</span>
                      <span>Competitors move faster</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-6 h-6 text-green-600" />
                    <h4 className="font-semibold text-lg">New World (M Velocity)</h4>
                  </div>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 font-bold mt-0.5">✓</span>
                      <span>12 minutes to coordinate 30 stakeholders globally</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 font-bold mt-0.5">✓</span>
                      <span>1 activation replaces 200 emails</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 font-bold mt-0.5">✓</span>
                      <span>Zero meetings required for execution</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 font-bold mt-0.5">✓</span>
                      <span>Seize opportunities before competitors notice</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 font-bold mt-0.5">✓</span>
                      <span>Become the "fast company" in your industry</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-2 border-orange-500 mb-8" data-testid="card-speed-quote">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center">
                    <Quote className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <blockquote className="text-xl md:text-2xl font-semibold mb-3">
                    "Customer expectations keep going up: they want superior service, 
                    and they want it now."
                  </blockquote>
                  <p className="text-sm text-muted-foreground">
                    — Salesforce Research, "State of the Connected Customer" (6th Edition, 2023)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="text-center p-6" data-testid="card-stat-faster">
              <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">88%</div>
              <p className="text-sm text-muted-foreground">
                of customers more likely to buy when companies meet speed expectations
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                (Salesforce Connected Customer, 2023)
              </p>
            </Card>

            <Card className="text-center p-6" data-testid="card-stat-waste">
              <div className="text-4xl font-bold text-red-600 dark:text-red-400 mb-2">70%</div>
              <p className="text-sm text-muted-foreground">
                of time wasted on coordination overhead
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                (Common enterprise pattern)
              </p>
            </Card>

            <Card className="text-center p-6" data-testid="card-stat-compressed">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">80%</div>
              <p className="text-sm text-muted-foreground">
                say experience is as important as products/services
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                (Salesforce Connected Customer, 2023)
              </p>
            </Card>

            <Card className="text-center p-6 bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/40 dark:to-orange-900/20 border-2 border-orange-500" data-testid="card-stat-advantage">
              <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">99.7%</div>
              <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                faster with M (72h → 12min)
              </p>
            </Card>
          </div>

          <Card className="bg-primary text-primary-foreground" data-testid="card-strategic-implication">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-300" />
                    The Risk of Being Slow
                  </h4>
                  <ul className="space-y-1 text-sm opacity-90">
                    <li>• Competitors seize opportunities while you're coordinating</li>
                    <li>• Market windows close before you can act</li>
                    <li>• Crises escalate while stakeholders align</li>
                    <li>• Customers choose faster-moving alternatives</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-green-300" />
                    The Advantage of Speed
                  </h4>
                  <ul className="space-y-1 text-sm opacity-90">
                    <li>• Execute strategic decisions in minutes, not weeks</li>
                    <li>• Respond to market changes before competitors know they happened</li>
                    <li>• Turn crises into competitive advantages through speed</li>
                    <li>• Build reputation as the "fast company" in your industry</li>
                  </ul>
                </div>
              </div>

              <div className="pt-6 border-t border-primary-foreground/20 text-center mt-6">
                <p className="text-lg font-semibold mb-4">
                  In a world where speed is currency, coordination is either your 
                  competitive advantage or your bottleneck.
                </p>
                <Button size="lg" variant="secondary" asChild data-testid="button-speed-demo">
                  <a href="/demo-selector">
                    See M's Speed in Action
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <FootballConnectionCallout 
            text="Football perfected execution velocity through systematic playbooks and instant coordination. While business timelines collapsed from years to months, football had already achieved minutes. M applies football's proven methodology to close the gap."
            testId="callout-salesforce-speed-connection"
          />

        </div>
      </div>
    </section>
  );
}
