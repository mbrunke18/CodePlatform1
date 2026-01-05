import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Target, TrendingUp, Map, Users, Activity, DollarSign, CheckCircle2,
  AlertCircle, ArrowRight, Award, Zap, Clock, BarChart3
} from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';

const MCK_ELEMENTS = [
  { key: 'purpose', label: 'Purpose', current: 3, target: 5, weight: 0.9 },
  { key: 'value_agenda', label: 'Value Agenda', current: 4, target: 5, weight: 1.0 },
  { key: 'structure', label: 'Structure', current: 2, target: 4, weight: 0.8 },
  { key: 'ecosystem', label: 'Ecosystem', current: 3, target: 4, weight: 0.7 },
  { key: 'governance', label: 'Governance', current: 4, target: 5, weight: 1.0 },
  { key: 'processes', label: 'Processes', current: 3, target: 5, weight: 0.9 },
  { key: 'technology', label: 'Technology', current: 4, target: 5, weight: 0.8 },
  { key: 'leadership', label: 'Leadership', current: 3, target: 5, weight: 0.9 },
  { key: 'talent', label: 'Talent', current: 2, target: 4, weight: 0.9 },
  { key: 'culture', label: 'Culture', current: 3, target: 4, weight: 1.0 },
  { key: 'behaviors', label: 'Behaviors', current: 3, target: 4, weight: 0.7 },
  { key: 'rewards', label: 'Rewards', current: 2, target: 4, weight: 0.6 },
];

const GOLDEN_RULES = [
  { key: 'rule1', name: 'Start with Strategy & Value Agenda', status: 'compliant', owner: 'Chief Strategy Officer' },
  { key: 'rule2', name: 'Use Data & Analytics', status: 'compliant', owner: 'Chief Data Officer' },
  { key: 'rule3', name: 'Design the Full System', status: 'in_progress', owner: 'Chief Operating Officer' },
  { key: 'rule4', name: 'Focus on Connective Tissue', status: 'in_progress', owner: 'Chief HR Officer' },
  { key: 'rule5', name: 'Prioritize Governance First', status: 'compliant', owner: 'Chief Compliance Officer' },
  { key: 'rule6', name: 'Deploy Best Talent', status: 'compliant', owner: 'Chief HR Officer' },
  { key: 'rule7', name: 'Test and Learn', status: 'in_progress', owner: 'Chief Innovation Officer' },
  { key: 'rule8', name: 'Drive Rapid Decision-Making', status: 'not_started', owner: 'Chief Executive Officer' },
  { key: 'rule9', name: 'Change Mindsets & Culture', status: 'in_progress', owner: 'Chief People Officer' },
];

const EXEC_STAKEHOLDERS = [
  { id: '1', name: 'Alexandra Chen', role: 'CEO', engagement: 'champion', commitment: 95 },
  { id: '2', name: 'Marcus Johnson', role: 'CFO', engagement: 'champion', commitment: 88 },
  { id: '3', name: 'Sarah Williams', role: 'COO', engagement: 'champion', commitment: 92 },
  { id: '4', name: 'David Kim', role: 'CTO', engagement: 'neutral', commitment: 65 },
  { id: '5', name: 'Jennifer Martinez', role: 'CHRO', engagement: 'champion', commitment: 85 },
  { id: '6', name: 'Robert Taylor', role: 'CMO', engagement: 'resister', commitment: 42 },
];

export default function McKinseyIntelligenceCenter() {
  const [activeTab, setActiveTab] = useState('assessment');

  const avgMaturity = (MCK_ELEMENTS.reduce((sum, el) => sum + el.current, 0) / MCK_ELEMENTS.length).toFixed(1);
  const avgTarget = (MCK_ELEMENTS.reduce((sum, el) => sum + el.target, 0) / MCK_ELEMENTS.length).toFixed(1);
  const avgGap = (parseFloat(avgTarget) - parseFloat(avgMaturity)).toFixed(1);

  return (
    <PageLayout>
      <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Award className="h-8 w-8 text-primary" data-testid="icon-mckinsey-header" />
          <h1 className="text-3xl font-bold" data-testid="heading-mckinsey-center">McKinsey Intelligence Center</h1>
        </div>
        <p className="text-muted-foreground" data-testid="text-mckinsey-subtitle">
          Built on McKinsey "Organize to Value" Framework - Transform operating model, track value realization, and drive sustainable change
        </p>
        <div className="flex gap-2">
          <Badge variant="outline" data-testid="badge-research-backed">Research-Backed</Badge>
          <Badge variant="outline" data-testid="badge-data-driven">Data-Driven</Badge>
          <Badge variant="outline" data-testid="badge-action-oriented">Action-Oriented</Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card data-testid="card-metric-maturity">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Maturity</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="value-current-maturity">{avgMaturity}/5.0</div>
            <p className="text-xs text-muted-foreground">Across 12 elements</p>
          </CardContent>
        </Card>
        <Card data-testid="card-metric-gap">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maturity Gap</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600" data-testid="value-maturity-gap">{avgGap}</div>
            <p className="text-xs text-muted-foreground">Points to target</p>
          </CardContent>
        </Card>
        <Card data-testid="card-metric-value">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Value Realized</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600" data-testid="value-realized">$4.2M</div>
            <p className="text-xs text-muted-foreground">YTD savings</p>
          </CardContent>
        </Card>
        <Card data-testid="card-metric-readiness">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Change Readiness</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="value-change-readiness">78%</div>
            <p className="text-xs text-muted-foreground">Organization-wide</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-7" data-testid="tabs-mckinsey">
          <TabsTrigger value="assessment" data-testid="tab-assessment">Assessment</TabsTrigger>
          <TabsTrigger value="gap" data-testid="tab-gap">Gap Calculator</TabsTrigger>
          <TabsTrigger value="roadmap" data-testid="tab-roadmap">Roadmap</TabsTrigger>
          <TabsTrigger value="buyin" data-testid="tab-buyin">Buy-In</TabsTrigger>
          <TabsTrigger value="readiness" data-testid="tab-readiness">Readiness</TabsTrigger>
          <TabsTrigger value="value" data-testid="tab-value">Value</TabsTrigger>
          <TabsTrigger value="practices" data-testid="tab-practices">Practices</TabsTrigger>
        </TabsList>

        <TabsContent value="assessment" className="space-y-4">
          <Card data-testid="card-assessment-overview">
            <CardHeader>
              <CardTitle data-testid="heading-assessment">Operating Model Assessment</CardTitle>
              <CardDescription>Assess organizational maturity across 12 McKinsey elements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {MCK_ELEMENTS.map((element) => (
                <div key={element.key} className="space-y-2" data-testid={`element-${element.key}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{element.label}</span>
                      <Badge variant="outline" className="text-xs">Weight: {element.weight}</Badge>
                    </div>
                    <span className="text-sm text-muted-foreground" data-testid={`score-${element.key}`}>
                      {element.current}/5
                    </span>
                  </div>
                  <Progress value={(element.current / 5) * 100} className="h-2" data-testid={`progress-${element.key}`} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gap" className="space-y-4">
          <Card data-testid="card-gap-calculator">
            <CardHeader>
              <CardTitle data-testid="heading-gap-calculator">Gap Calculator</CardTitle>
              <CardDescription>Compare current state vs. target maturity across all elements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {MCK_ELEMENTS.map((element) => {
                const gap = element.target - element.current;
                return (
                  <div key={element.key} className="space-y-2" data-testid={`gap-${element.key}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{element.label}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-muted-foreground">Current: {element.current}</span>
                        <ArrowRight className="h-3 w-3" />
                        <span className="text-xs font-semibold">Target: {element.target}</span>
                        <Badge variant={gap > 1.5 ? "destructive" : gap > 0.5 ? "default" : "secondary"} className="text-xs" data-testid={`gap-value-${element.key}`}>
                          Gap: {gap.toFixed(1)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Progress value={(element.current / 5) * 100} className="h-2 bg-gray-200" />
                      </div>
                      <div className="flex-1">
                        <Progress value={(element.target / 5) * 100} className="h-2 bg-green-100" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roadmap" className="space-y-4">
          <Card data-testid="card-transformation-roadmap">
            <CardHeader>
              <CardTitle data-testid="heading-transformation-roadmap">Transformation Roadmap</CardTitle>
              <CardDescription>4-phase transformation journey: Diagnose → Design → Pilot → Scale</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { phase: 'diagnose', name: 'Diagnose', status: 'completed', duration: '4-8 weeks', progress: 100 },
                { phase: 'design', name: 'Design', status: 'completed', duration: '8-12 weeks', progress: 100 },
                { phase: 'pilot', name: 'Pilot', status: 'in_progress', duration: '12-16 weeks', progress: 65 },
                { phase: 'scale', name: 'Scale', status: 'pending', duration: '12-24 months', progress: 0 },
              ].map((phase) => (
                <div key={phase.phase} className="space-y-2" data-testid={`phase-${phase.phase}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {phase.status === 'completed' && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                      {phase.status === 'in_progress' && <Clock className="h-5 w-5 text-blue-600 animate-pulse" />}
                      {phase.status === 'pending' && <AlertCircle className="h-5 w-5 text-gray-400" />}
                      <div>
                        <p className="font-semibold">{phase.name}</p>
                        <p className="text-xs text-muted-foreground">{phase.duration}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={phase.status === 'completed' ? 'default' : phase.status === 'in_progress' ? 'secondary' : 'outline'}
                      data-testid={`badge-status-${phase.phase}`}
                    >
                      {phase.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <Progress value={phase.progress} className="h-2" data-testid={`progress-${phase.phase}`} />
                </div>
              ))}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Business Case Value</span>
                  <span className="text-lg font-bold text-green-600" data-testid="value-business-case">$160M</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="buyin" className="space-y-4">
          <Card data-testid="card-executive-buyin">
            <CardHeader>
              <CardTitle data-testid="heading-executive-buyin">Executive Buy-In Tracker</CardTitle>
              <CardDescription>Track C-suite commitment and identify champions vs. resisters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {EXEC_STAKEHOLDERS.map((stakeholder) => (
                <div key={stakeholder.id} className="space-y-2" data-testid={`stakeholder-${stakeholder.id}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{stakeholder.name}</p>
                      <p className="text-xs text-muted-foreground">{stakeholder.role}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={stakeholder.engagement === 'champion' ? 'default' : stakeholder.engagement === 'neutral' ? 'secondary' : 'destructive'}
                        data-testid={`badge-engagement-${stakeholder.id}`}
                      >
                        {stakeholder.engagement}
                      </Badge>
                      <span className="text-sm font-semibold w-12 text-right" data-testid={`commitment-${stakeholder.id}`}>
                        {stakeholder.commitment}%
                      </span>
                    </div>
                  </div>
                  <Progress value={stakeholder.commitment} className="h-2" data-testid={`progress-commitment-${stakeholder.id}`} />
                </div>
              ))}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Average Executive Commitment</span>
                  <span className="text-lg font-bold" data-testid="value-avg-commitment">
                    {Math.round(EXEC_STAKEHOLDERS.reduce((sum, s) => sum + s.commitment, 0) / EXEC_STAKEHOLDERS.length)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="readiness" className="space-y-4">
          <Card data-testid="card-change-readiness">
            <CardHeader>
              <CardTitle data-testid="heading-change-readiness">Change Readiness Monitor</CardTitle>
              <CardDescription>Assess organizational readiness and track capability building</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { area: 'Leadership Alignment', score: 85, risk: 'low' },
                { area: 'Process Redesign', score: 72, risk: 'medium' },
                { area: 'Technology Adoption', score: 68, risk: 'medium' },
                { area: 'Skill Development', score: 55, risk: 'high' },
                { area: 'Cultural Transformation', score: 62, risk: 'medium' },
              ].map((capability) => (
                <div key={capability.area} className="space-y-2" data-testid={`capability-${capability.area.toLowerCase().replace(/ /g, '-')}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{capability.area}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm" data-testid={`score-${capability.area.toLowerCase().replace(/ /g, '-')}`}>{capability.score}/100</span>
                      <Badge 
                        variant={capability.risk === 'low' ? 'default' : capability.risk === 'medium' ? 'secondary' : 'destructive'}
                        data-testid={`risk-${capability.area.toLowerCase().replace(/ /g, '-')}`}
                      >
                        {capability.risk} risk
                      </Badge>
                    </div>
                  </div>
                  <Progress value={capability.score} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="value" className="space-y-4">
          <Card data-testid="card-value-realization">
            <CardHeader>
              <CardTitle data-testid="heading-value-realization">Value Realization Dashboard</CardTitle>
              <CardDescription>Track ROI, Four Outcomes trending, and coordination improvements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">McKinsey Four Outcomes</h3>
                {[
                  { outcome: 'Clarity', score: 82, trend: 'improving' },
                  { outcome: 'Speed', score: 89, trend: 'improving' },
                  { outcome: 'Skills', score: 74, trend: 'steady' },
                  { outcome: 'Commitment', score: 78, trend: 'improving' },
                ].map((outcome) => (
                  <div key={outcome.outcome} className="space-y-2" data-testid={`outcome-${outcome.outcome.toLowerCase()}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{outcome.outcome}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm" data-testid={`score-outcome-${outcome.outcome.toLowerCase()}`}>{outcome.score}/100</span>
                        <Badge variant="outline" data-testid={`trend-${outcome.outcome.toLowerCase()}`}>
                          {outcome.trend === 'improving' ? '↗️' : outcome.trend === 'declining' ? '↘️' : '➡️'} {outcome.trend}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={outcome.score} className="h-2" />
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t space-y-3">
                <h3 className="font-semibold text-sm">Financial Impact (YTD)</h3>
                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Cost Savings</span>
                    <span className="font-semibold text-green-600" data-testid="value-cost-savings">$4.2M</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Time Savings</span>
                    <span className="font-semibold" data-testid="value-time-savings">12,450 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Coordination Speed Improvement</span>
                    <span className="font-semibold text-blue-600" data-testid="value-speed-improvement">360x faster</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">ROI</span>
                    <span className="font-semibold text-green-600" data-testid="value-roi">428%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="practices" className="space-y-4">
          <Card data-testid="card-sustainable-practices">
            <CardHeader>
              <CardTitle data-testid="heading-sustainable-practices">Sustainable Practices Checklist</CardTitle>
              <CardDescription>McKinsey's 9 Golden Rules for transformation success</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {GOLDEN_RULES.map((rule, index) => (
                <div 
                  key={rule.key} 
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  data-testid={`rule-${index + 1}`}
                >
                  <div className="flex items-center gap-3">
                    {rule.status === 'compliant' && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                    {rule.status === 'in_progress' && <Clock className="h-5 w-5 text-blue-600" />}
                    {rule.status === 'not_started' && <AlertCircle className="h-5 w-5 text-gray-400" />}
                    <div>
                      <p className="font-medium text-sm">{rule.name}</p>
                      <p className="text-xs text-muted-foreground">Owner: {rule.owner}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={rule.status === 'compliant' ? 'default' : rule.status === 'in_progress' ? 'secondary' : 'outline'}
                    data-testid={`status-rule-${index + 1}`}
                  >
                    {rule.status.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Compliance Score</span>
                  <span className="text-lg font-bold" data-testid="value-compliance-score">67%</span>
                </div>
                <Progress value={67} className="h-2 mt-2" data-testid="progress-compliance" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="border-primary/20 bg-primary/5" data-testid="card-cta">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Transform with M + McKinsey
          </CardTitle>
          <CardDescription>
            Combine McKinsey's research-backed framework with M's 12-minute execution velocity to achieve sustainable transformation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button data-testid="button-start-assessment">
              <BarChart3 className="h-4 w-4 mr-2" />
              Start Assessment
            </Button>
            <Button variant="outline" data-testid="button-export-report">
              Export Full Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
    </PageLayout>
  );
}
