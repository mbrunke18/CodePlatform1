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
    objective: 'Experience Execution OS and secure executive sponsorship',
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
      { name: 'Organization Setup', path: '/setup/organization', description: 'Configure company profile, departments, and roles' },
      { name: 'Invite Team Members', path: '/setup/stakeholders', description: 'Onboard key stakeholders and assign roles' },
      { name: 'Connect Integrations', path: '/setup/integrations', description: 'Link Jira, Slack, ServiceNow, and other tools' },
      { name: 'Complete Onboarding', path: '/setup/wizard', description: 'Guided wizard for initial configuration' }
    ],
    deliverables: ['Organization profile complete', 'SSO/authentication configured', 'Core team invited', 'Primary integrations connected'],
    integrations: ['Jira', 'Slack', 'Microsoft Teams', 'ServiceNow', 'Okta/SSO']
  },
  {
    id: 'identify',
    title: 'Phase 3: IDENTIFY — VaughnMartin Playbook™',
    duration: 'Days 30-45',
    objective: 'Build your strategic playbook portfolio',
    activities: [
      { name: 'Browse Playbook Library', path: '/identify/playbooks', description: 'Explore 170 playbooks across 9 strategic domains' },
      { name: 'Select Priority Playbooks', path: '/identify/workspaces', description: 'Choose playbooks aligned to your strategic priorities' },
      { name: 'Map Stakeholders', path: '/setup/stakeholders', description: 'Assign accountability for each playbook' },
      { name: 'Customize Playbooks', path: '/identify/customize', description: 'Tailor tasks, timelines, and resources' },
      { name: 'Establish Readiness Baseline', path: '/identify/readiness', description: 'Measure your strategic readiness score' }
    ],
    deliverables: ['5-10 priority playbooks configured', 'Stakeholder matrix complete', 'Task assignments finalized', 'Readiness baseline established'],
    integrations: ['Document repositories', 'HRIS systems', 'Knowledge bases']
  },
  {
    id: 'detect',
    title: 'Phase 4: DETECT — VaughnMartin Signal™',
    duration: 'Days 45-60',
    objective: 'Activate AI-powered monitoring and alerting',
    activities: [
      { name: 'Signal Ops Workspace', path: '/detect/workspaces', description: 'Central hub for signal monitoring' },
      { name: 'Configure Triggers', path: '/detect/triggers', description: 'Set up trigger conditions and thresholds' },
      { name: 'Tune AI Detection', path: '/detect/radar', description: 'Calibrate AI signal recognition' },
      { name: 'Set Alert Routing', path: '/detect/intelligence', description: 'Define notification channels and escalation paths' },
      { name: 'Connect Signal Sources', path: '/setup/integrations', description: 'Link news feeds, market data, and internal systems' }
    ],
    deliverables: ['Trigger catalogue published', 'AI thresholds calibrated', 'Alert routing tested', 'Signal coverage verified'],
    integrations: ['News APIs', 'Market data feeds', 'SIEM platforms', 'Social listening tools']
  },
  {
    id: 'execute',
    title: 'Phase 5: EXECUTE — VaughnMartin Compass™',
    duration: 'Days 60-75',
    objective: 'Prove 12-minute coordinated response capability',
    activities: [
      { name: 'Compass Command', path: '/execute/workspaces', description: 'Execution coordination center' },
      { name: 'Run Practice Drills', path: '/execute/drills', description: 'Simulate trigger scenarios with your team' },
      { name: 'Test Command Center', path: '/execute/command', description: 'Verify real-time coordination capabilities' },
      { name: 'Execute Live Response', path: '/execute/command', description: 'Respond to first real trigger' }
    ],
    deliverables: ['3+ practice drills completed', 'Command center staffed', '12-minute SLA demonstrated', 'First live response executed'],
    integrations: ['Task management (Jira/Asana)', 'Communications (Slack/Teams)', 'Document automation']
  },
  {
    id: 'advance',
    title: 'Phase 6: ADVANCE — VaughnMartin Retrospect™',
    duration: 'Days 75-90',
    objective: 'Capture learning and refine for continuous improvement',
    activities: [
      { name: 'Retrospect Lab', path: '/advance/workspaces', description: 'Institutional learning hub' },
      { name: 'Conduct Retrospective', path: '/advance/lessons', description: 'Analyze execution and capture insights' },
      { name: 'Refine Playbooks', path: '/identify/customize', description: 'Update playbooks based on lessons learned' },
      { name: 'Measure Decision Velocity', path: '/advance/velocity', description: 'Track improvement metrics' },
      { name: 'Executive Readout', path: '/advance/export', description: 'Generate board-ready summary' }
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
      { name: 'Execution OS One™ Dashboard', path: '/dashboard', description: 'Executive overview of strategic readiness' },
      { name: 'Expand Playbook Coverage', path: '/identify/playbooks', description: 'Add playbooks for new strategic domains' },
      { name: 'Track Organizational Maturity', path: '/advance/maturity', description: 'Monitor maturity progression' },
      { name: 'Quarterly Strategy Reviews', path: '/advance/reviews', description: 'Regular strategic health checks' }
    ],
    deliverables: ['Cross-team adoption', 'Quarterly review cadence', 'Maturity advancement', 'ROI realization tracked'],
    integrations: ['ERP systems', 'CRM platforms', 'Forecasting tools']
  }
];

export default function CustomerJourney() {
  const NAVY = "#0A0F2E";
  const GOLD = "#C9A84C";
  const TEAL = "#2B8A6E";
  const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

  return (
    <PageLayout>
      <div className="min-h-screen bg-[#F8F7F4] text-[#0A0F2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-8">
            <Link href="/dashboard">
              <span className="text-[#6B7280] hover:text-[#2B8A6E] cursor-pointer">Execution OS One™</span>
            </Link>
            <ChevronRight className="h-3 w-3 text-[#6B7280]" />
            <span className="text-[#2B8A6E]">Execution OS North Star™</span>
          </nav>

          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-[1px] w-7 bg-[#C9A84C]" />
              <span className="text-[#C9A84C] text-[9px] font-bold uppercase tracking-[0.2em]">The Customer Lifecycle</span>
              <div className="h-[1px] w-7 bg-[#C9A84C]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#0A0F2E] mb-4" style={CG}>
              From Strategy to <span className="text-[#C9A84C]">Execution Mastery</span>
            </h1>
            <p className="text-xl text-[#6B7280] max-w-3xl mx-auto font-medium">
              Our 4-phase transformation model for modern enterprise operating systems.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {valueMetrics.map((metric) => (
              <Card key={metric.label} className="text-center border-[#E8E4DC] bg-white shadow-sm">
                <CardContent className="p-8">
                  <div className="text-4xl font-bold text-[#C9A84C] mb-2" style={CG}>{metric.value}</div>
                  <div className="text-[10px] font-bold text-[#0A0F2E] uppercase tracking-widest mb-2">{metric.label}</div>
                  <div className="text-[11px] text-[#6B7280] leading-relaxed font-medium">{metric.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="timeline" className="mb-16">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-[#0A0F2E]/5 p-1 border border-[#E8E4DC]">
                <TabsTrigger value="timeline" className="data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white font-bold text-xs uppercase tracking-widest px-6">Timeline</TabsTrigger>
                <TabsTrigger value="details" className="data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white font-bold text-xs uppercase tracking-widest px-6">Phase Details</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="timeline">
              <div className="bg-white border border-[#E8E4DC] rounded-2xl p-8 shadow-sm">
                <JourneyNavigator variant="full" />
              </div>
            </TabsContent>

            <TabsContent value="details">
              <div className="space-y-8">
                {phaseDetails.map((phase, index) => (
                  <Card key={phase.id} className="overflow-hidden border-[#E8E4DC] bg-white shadow-sm transition-all hover:border-[#C9A84C]/30">
                    <div className={`h-1.5 ${
                      index < 2 ? 'bg-[#C9A84C]' : 
                      index < 4 ? 'bg-[#0A0F2E]' : 
                      'bg-[#2B8A6E]'
                    }`} />
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-2xl font-bold text-[#0A0F2E]" style={CG}>{phase.title}</CardTitle>
                          <CardDescription className="mt-1 text-[#6B7280] font-medium">{phase.objective}</CardDescription>
                        </div>
                        <Badge variant="outline" className="flex items-center gap-1.5 border-[#E8E4DC] text-[#6B7280] px-3 py-1 bg-[#F8F7F4] font-bold text-[10px] uppercase tracking-wider">
                          <Clock className="h-3 w-3" />
                          {phase.duration}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="grid md:grid-cols-2 gap-12">
                        <div>
                          <h4 className="text-[10px] font-bold text-[#0A0F2E] mb-4 uppercase tracking-[0.2em] flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#2B8A6E]" />
                            Key Activities
                          </h4>
                          <div className="space-y-3">
                            {phase.activities.map((activity) => (
                              <Link key={activity.path} href={activity.path}>
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-[#F8F7F4] border border-[#E8E4DC] hover:bg-[#2B8A6E]/5 hover:border-[#2B8A6E]/20 cursor-pointer group transition-all">
                                  <div className="w-8 h-8 rounded-lg bg-white border border-[#E8E4DC] flex items-center justify-center shrink-0 group-hover:bg-[#2B8A6E] group-hover:border-[#2B8A6E] transition-all shadow-sm">
                                    <ArrowRight className="h-4 w-4 text-[#6B7280] group-hover:text-white transition-colors" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-bold text-sm text-[#0A0F2E] group-hover:text-[#2B8A6E] transition-colors">
                                      {activity.name}
                                    </div>
                                    <div className="text-[11px] text-[#6B7280] leading-normal">{activity.description}</div>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-8">
                          <div>
                            <h4 className="text-[10px] font-bold text-[#0A0F2E] mb-4 uppercase tracking-[0.2em] flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
                              Deliverables
                            </h4>
                            <div className="space-y-3">
                              {phase.deliverables.map((deliverable, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-sm font-medium text-[#0A0F2E]">
                                  <div className="w-5 h-5 rounded-full bg-[#2B8A6E]/10 flex items-center justify-center shrink-0">
                                    <CheckCircle className="h-3 w-3 text-[#2B8A6E]" />
                                  </div>
                                  <span className="text-xs">{deliverable}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {phase.integrations.length > 0 && (
                            <div>
                              <h4 className="text-[10px] font-bold text-[#0A0F2E] mb-4 uppercase tracking-[0.2em] flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#0A0F2E]" />
                                Key Integrations
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {phase.integrations.map((integration, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-[10px] font-bold uppercase tracking-wider bg-[#0A0F2E]/5 text-[#0A0F2E] border-none px-3 py-1">
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

          <section className="py-12">
            <Card className="bg-[#0A0F2E] border-none relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(${GOLD} 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
              <CardContent className="p-16 text-center relative z-10">
                <div className="w-16 h-16 rounded-full bg-[#C9A84C] flex items-center justify-center mx-auto mb-8 shadow-xl">
                  <Award className="h-8 w-8 text-[#0A0F2E]" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4" style={CG}>
                  Ready to Start Your Journey?
                </h3>
                <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto font-medium">
                  Join Fortune 1000 companies achieving 12-minute strategic response times.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <Link href="/pilot-program">
                    <Button className="bg-[#C9A84C] hover:bg-[#DFC178] text-[#0A0F2E] font-bold px-10 py-6 text-base rounded-xl shadow-xl">
                      Start Pilot Program
                    </Button>
                  </Link>
                  <Link href="/demo-selector">
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent px-10 py-6 text-base rounded-xl">
                      Explore Demos
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>

        </div>
      </div>
    </PageLayout>
  );
}
