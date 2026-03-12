import { Link } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';
import JourneyNavigator from '@/components/JourneyNavigator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChevronRight,
  Clock,
  Target,
  Users,
  Zap,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Settings,
  Plug,
  Calendar,
  TrendingUp,
  Award
} from 'lucide-react';

const valueMetrics = [
  { label: "Time to First Value", value: "30 days", description: "Organization configured and team onboarded" },
  { label: "Time to First Execution", value: "75 days", description: "Complete trigger-to-response cycle proven" },
  { label: "Response Time Improvement", value: "340X", description: "From 20+ hours to 12 minutes" },
  { label: "Average ROI Impact", value: "10.3%", description: "Revenue growth acceleration" }
];

const phaseDetails = [
  {
    id: 'discovery',
    title: 'Phase 1: Discovery & Evaluation',
    duration: 'Week 1-2',
    objective: 'Experience ExecuteIQ and secure executive sponsorship',
    activities: [
      { name: 'Explore Demo Gallery', path: '/demo-gallery', description: 'Interactive demos for prospects, executives, and investors' },
      { name: 'Calculate Your ROI', path: '/roi-calculator', description: 'Quantify potential value with industry benchmarks' },
      { name: 'Review Pricing', path: '/pricing', description: 'Understand pilot and enterprise options' },
      { name: 'Start Pilot Program', path: '/pilot-program', description: 'Define scope and success criteria' }
    ],
    deliverables: ['Executive sponsor commitment', 'Pilot scope document', 'Success metrics defined', 'Timeline agreed'],
    integrations: []
  },
  {
    id: 'onboarding',
    title: 'Phase 2: Onboarding & Setup',
    duration: 'Days 1-30',
    objective: 'Configure your organization and connect your ecosystem',
    activities: [
      { name: 'Organization Setup', path: '/organization-setup', description: 'Configure company profile, departments, and roles' },
      { name: 'Invite Team Members', path: '/stakeholder-management', description: 'Onboard key stakeholders and assign roles' },
      { name: 'Connect Integrations', path: '/integrations', description: 'Link Jira, Slack, ServiceNow, and other tools' },
      { name: 'Complete Onboarding', path: '/onboarding', description: 'Guided wizard for initial configuration' }
    ],
    deliverables: ['Organization profile complete', 'SSO/authentication configured', 'Core team invited', 'Primary integrations connected'],
    integrations: ['Jira', 'Slack', 'Microsoft Teams', 'ServiceNow', 'Okta/SSO']
  },
  {
    id: 'identify',
    title: 'Phase 3: IDENTIFY (ExecuteIQ Playbook™)',
    duration: 'Days 30-45',
    objective: 'Build your strategic playbook portfolio',
    activities: [
      { name: 'Browse Playbook Library', path: '/playbooks', description: 'Explore 166 playbooks across 9 strategic domains' },
      { name: 'Select Priority Playbooks', path: '/workspaces/identify', description: 'Choose playbooks aligned to your strategic priorities' },
      { name: 'Map Stakeholders', path: '/stakeholder-management', description: 'Assign accountability for each playbook' },
      { name: 'Customize Playbooks', path: '/playbook-customization', description: 'Tailor tasks, timelines, and resources' },
      { name: 'Establish Readiness Baseline', path: '/preparedness-report', description: 'Measure your strategic readiness score' }
    ],
    deliverables: ['5-10 priority playbooks configured', 'Stakeholder matrix complete', 'Task assignments finalized', 'Readiness baseline established'],
    integrations: ['Document repositories', 'HRIS systems', 'Knowledge bases']
  },
  {
    id: 'detect',
    title: 'Phase 4: DETECT (ExecuteIQ Signal™)',
    duration: 'Days 45-60',
    objective: 'Activate AI-powered monitoring and alerting',
    activities: [
      { name: 'Signal Ops Workspace', path: '/workspaces/detect', description: 'Central hub for signal monitoring' },
      { name: 'Configure Triggers', path: '/triggers-management', description: 'Set up trigger conditions and thresholds' },
      { name: 'Tune AI Detection', path: '/ai-radar', description: 'Calibrate AI signal recognition' },
      { name: 'Set Alert Routing', path: '/signal-intelligence', description: 'Define notification channels and escalation paths' },
      { name: 'Connect Signal Sources', path: '/integrations', description: 'Link news feeds, market data, and internal systems' }
    ],
    deliverables: ['Trigger catalogue published', 'AI thresholds calibrated', 'Alert routing tested', 'Signal coverage verified'],
    integrations: ['News APIs', 'Market data feeds', 'SIEM platforms', 'Social listening tools']
  },
  {
    id: 'execute',
    title: 'Phase 5: EXECUTE (ExecuteIQ Compass™)',
    duration: 'Days 60-75',
    objective: 'Prove 12-minute coordinated response capability',
    activities: [
      { name: 'Compass Command', path: '/workspaces/execute', description: 'Execution coordination center' },
      { name: 'Run Practice Drills', path: '/practice-drills', description: 'Simulate trigger scenarios with your team' },
      { name: 'Test Command Center', path: '/command-center', description: 'Verify real-time coordination capabilities' },
      { name: 'Execute Live Response', path: '/command-center', description: 'Respond to first real trigger' }
    ],
    deliverables: ['3+ practice drills completed', 'Command center staffed', '12-minute SLA demonstrated', 'First live response executed'],
    integrations: ['Task management (Jira/Asana)', 'Communications (Slack/Teams)', 'Document automation']
  },
  {
    id: 'advance',
    title: 'Phase 6: ADVANCE (ExecuteIQ Retrospect™)',
    duration: 'Days 75-90',
    objective: 'Capture learning and refine for continuous improvement',
    activities: [
      { name: 'Retrospect Lab', path: '/workspaces/advance', description: 'Institutional learning hub' },
      { name: 'Conduct Retrospective', path: '/lessons-management', description: 'Analyze execution and capture insights' },
      { name: 'Refine Playbooks', path: '/playbook-customization', description: 'Update playbooks based on lessons learned' },
      { name: 'Measure Decision Velocity', path: '/executive-dashboard', description: 'Track improvement metrics' },
      { name: 'Executive Readout', path: '/board-export', description: 'Generate board-ready summary' }
    ],
    deliverables: ['First retrospective complete', 'Playbook refinements documented', 'Decision velocity baseline', 'Executive report delivered'],
    integrations: ['BI/Analytics platforms', 'Knowledge management systems']
  },
  {
    id: 'continuous',
    title: 'Phase 7: Continuous Value',
    duration: 'Ongoing',
    objective: 'Scale adoption and maximize strategic impact',
    activities: [
      { name: 'ExecuteIQ One™ Dashboard', path: '/mission-control', description: 'Executive overview of strategic readiness' },
      { name: 'Expand Playbook Coverage', path: '/playbooks', description: 'Add playbooks for new strategic domains' },
      { name: 'Track Organizational Maturity', path: '/operating-model', description: 'Monitor maturity progression' },
      { name: 'Quarterly Strategy Reviews', path: '/executive-dashboard', description: 'Regular strategic health checks' }
    ],
    deliverables: ['Cross-team adoption', 'Quarterly review cadence', 'Maturity advancement', 'ROI realization tracked'],
    integrations: ['ERP systems', 'CRM platforms', 'Forecasting tools']
  }
];

export default function CustomerJourney() {
  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50/30 dark:from-poise-navy dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link href="/mission-control">
              <span className="text-slate-500 hover:text-poise-teal cursor-pointer">ExecuteIQ One™</span>
            </Link>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <span className="text-poise-teal font-medium">ExecuteIQ North Star™</span>
          </nav>

          <div className="text-center mb-12">
            <Badge className="mb-4 bg-poise-teal/20 text-poise-teal border-poise-teal/30">
              ExecuteIQ North Star™
            </Badge>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Your Path to Strategic Excellence
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              From discovery to continuous value, your roadmap to 12-minute strategic response
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {valueMetrics.map((metric) => (
              <Card key={metric.label} className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-poise-teal mb-1">{metric.value}</div>
                  <div className="font-medium text-slate-900 dark:text-white mb-1">{metric.label}</div>
                  <div className="text-xs text-slate-500">{metric.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="timeline" className="mb-12">
            <TabsList className="mb-6">
              <TabsTrigger value="timeline">ExecuteIQ North Star™ Timeline</TabsTrigger>
              <TabsTrigger value="details">Phase Details</TabsTrigger>
            </TabsList>

            <TabsContent value="timeline">
              <JourneyNavigator variant="full" />
            </TabsContent>

            <TabsContent value="details">
              <div className="space-y-8">
                {phaseDetails.map((phase, index) => (
                  <Card key={phase.id} className="overflow-hidden">
                    <div className={`h-1 ${
                      index < 2 ? 'bg-pink-500' : 
                      index < 4 ? 'bg-poise-gold' : 
                      index < 6 ? 'bg-poise-teal' : 
                      'bg-purple-500'
                    }`} />
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-xl">{phase.title}</CardTitle>
                          <CardDescription className="mt-1">{phase.objective}</CardDescription>
                        </div>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {phase.duration}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                            <Zap className="h-4 w-4 text-poise-teal" />
                            Key Activities
                          </h4>
                          <div className="space-y-2">
                            {phase.activities.map((activity) => (
                              <Link key={activity.path} href={activity.path}>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-poise-teal/10 cursor-pointer group transition-colors">
                                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-poise-teal" />
                                  <div className="flex-1">
                                    <div className="font-medium text-slate-900 dark:text-white group-hover:text-poise-teal transition-colors">
                                      {activity.name}
                                    </div>
                                    <div className="text-xs text-slate-500">{activity.description}</div>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                              <Target className="h-4 w-4 text-poise-gold" />
                              Deliverables
                            </h4>
                            <div className="space-y-2">
                              {phase.deliverables.map((deliverable, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm">
                                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                                  <span className="text-slate-600 dark:text-slate-400">{deliverable}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {phase.integrations.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                <Plug className="h-4 w-4 text-purple-500" />
                                Key Integrations
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {phase.integrations.map((integration, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {integration}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <Card className="bg-gradient-to-r from-poise-teal/10 to-cyan-500/10 border-poise-teal/30">
            <CardContent className="p-8 text-center">
              <Award className="h-12 w-12 text-poise-teal mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Ready to Start Your Journey?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
                Join Fortune 1000 companies achieving 12-minute strategic response times
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/pilot-program">
                  <Button className="bg-poise-teal hover:bg-cyan-600 text-white">
                    Start Pilot Program
                  </Button>
                </Link>
                <Link href="/demo-gallery">
                  <Button variant="outline" className="border-poise-teal text-poise-teal hover:bg-poise-teal/10">
                    Explore Demos
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </PageLayout>
  );
}
