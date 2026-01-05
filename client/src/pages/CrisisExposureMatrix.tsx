import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, TrendingUp, Shield, Target, ArrowRight } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { Link } from 'wouter';

export default function CrisisExposureMatrix() {
  const { data: organizationsData } = useQuery<any[]>({ 
    queryKey: ['/api/organizations'] 
  });
  const organizations = organizationsData ?? [];
  const organizationId = organizations[0]?.id;

  const { data: scenariosQueryData } = useQuery<any[]>({
    queryKey: ['/api/strategic-scenarios', organizationId],
    enabled: !!organizationId,
  });
  const scenariosData = scenariosQueryData ?? [];

  // Group scenarios by likelihood and impact
  const getQuadrant = (likelihood: number, impact: string) => {
    const likelihoodThreshold = 0.5; // 50%
    const isHighLikelihood = likelihood >= likelihoodThreshold;
    const isHighImpact = impact === 'high' || impact === 'severe';

    if (isHighLikelihood && isHighImpact) return 'critical';
    if (!isHighLikelihood && isHighImpact) return 'important';
    if (isHighLikelihood && !isHighImpact) return 'monitor';
    return 'low';
  };

  const critical = scenariosData.filter(s => getQuadrant(s.likelihood || 0, s.impact) === 'critical');
  const important = scenariosData.filter(s => getQuadrant(s.likelihood || 0, s.impact) === 'important');
  const monitor = scenariosData.filter(s => getQuadrant(s.likelihood || 0, s.impact) === 'monitor');
  const low = scenariosData.filter(s => getQuadrant(s.likelihood || 0, s.impact) === 'low');

  const QuadrantCard = ({ 
    title, 
    description, 
    scenarios, 
    color,
    icon: Icon 
  }: { 
    title: string; 
    description: string; 
    scenarios: any[]; 
    color: string;
    icon: any;
  }) => (
    <Card className={`${color} border-2`} data-testid={`card-${title.toLowerCase().replace(' ', '-')}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <Badge variant="outline" className="text-lg font-bold" data-testid={`badge-count-${title.toLowerCase().replace(' ', '-')}`}>
            {scenarios.length}
          </Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {scenarios.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No scenarios in this category</p>
        ) : (
          <div className="space-y-2">
            {scenarios.slice(0, 5).map((scenario) => (
              <Link
                key={scenario.id}
                href={`/strategic-monitoring/${scenario.id}`}
                data-testid={`link-scenario-${scenario.id}`}
              >
                <div className="flex items-center justify-between p-2 rounded hover:bg-accent cursor-pointer transition-colors">
                  <div className="flex-1 page-background">
                    <p className="text-sm font-medium">{scenario.title || scenario.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Likelihood: {Math.round((scenario.likelihood || 0) * 100)}% | Impact: {scenario.impact}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
            {scenarios.length > 5 && (
              <p className="text-xs text-muted-foreground text-center pt-2">
                +{scenarios.length - 5} more scenarios
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <PageLayout>
      <div className="p-6 space-y-6" data-testid="crisis-exposure-matrix-page">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2" data-testid="page-title">Crisis Exposure Matrix</h1>
          <p className="text-muted-foreground">
            Prioritize your playbook preparation with our Likelihood × Impact framework. 
            Focus on Critical threats first for fastest time-to-value.
          </p>
        </div>

        {/* Strategy Card */}
        <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">90-Day Onboarding Strategy</CardTitle>
            <CardDescription className="text-blue-700 dark:text-blue-300">
              Don't try to prepare for all 166 playbooks at once. Start with your Top 10 Critical threats.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-blue-900 dark:text-blue-100">
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">1</div>
                <div>
                  <strong>Days 1-30:</strong> Run your Crisis Exposure Matrix workshop with our Crisis Architects
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">2</div>
                <div>
                  <strong>Days 31-90:</strong> Get your Top 10 Critical playbooks to 95%+ readiness
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">3</div>
                <div>
                  <strong>Ongoing:</strong> Build out remaining playbooks with quarterly readiness sprints
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2x2 Matrix Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Top Left: High Impact, Low Likelihood */}
          <QuadrantCard
            title="Important"
            description="High Impact, Lower Likelihood - Prepare but don't panic"
            scenarios={important}
            color="bg-orange-50 dark:bg-orange-950/20 border-orange-300 dark:border-orange-800"
            icon={Shield}
          />

          {/* Top Right: High Impact, High Likelihood */}
          <QuadrantCard
            title="Critical Priority"
            description="High Impact, High Likelihood - Your Top 10 for 90-day onboarding"
            scenarios={critical}
            color="bg-red-50 dark:bg-red-950/20 border-red-300 dark:border-red-800"
            icon={AlertTriangle}
          />

          {/* Bottom Left: Low Impact, Low Likelihood */}
          <QuadrantCard
            title="Low Priority"
            description="Lower Impact, Lower Likelihood - Address when ready"
            scenarios={low}
            color="bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-700"
            icon={Target}
          />

          {/* Bottom Right: Low Impact, High Likelihood */}
          <QuadrantCard
            title="Monitor Closely"
            description="Lower Impact, High Likelihood - Quick response playbooks"
            scenarios={monitor}
            color="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-300 dark:border-yellow-800"
            icon={TrendingUp}
          />
        </div>

        {/* Action Items */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border rounded-lg" data-testid="card-action-drills">
                <div>
                  <p className="font-medium">Schedule practice drills for your Critical playbooks</p>
                  <p className="text-sm text-muted-foreground">Turn preparedness into proven performance</p>
                </div>
                <Link href="/practice-drills">
                  <Button data-testid="button-schedule-drills">
                    Schedule Drills
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg" data-testid="card-action-library">
                <div>
                  <p className="font-medium">Review full playbook library</p>
                  <p className="text-sm text-muted-foreground">Explore all 166 strategic playbooks</p>
                </div>
                <Link href="/playbook-library">
                  <Button variant="outline" data-testid="button-view-library">
                    View Library
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg" data-testid="card-action-preparedness">
                <div>
                  <p className="font-medium">Check your preparedness score</p>
                  <p className="text-sm text-muted-foreground">See your overall crisis readiness rating</p>
                </div>
                <Link href="/preparedness-report">
                  <Button variant="outline" data-testid="button-check-score">
                    View Score
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
