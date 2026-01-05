import { useLocation } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  Zap, 
  Radio, 
  Clock, 
  BookOpen, 
  Brain, 
  ArrowRight,
  CheckCircle,
  XCircle,
  Minus,
  TrendingUp,
  Shield,
  Users,
  BarChart3,
  Layers,
  AlertTriangle,
  Play,
  Bell,
  Settings,
  MessageSquare,
  Building2,
  HelpCircle
} from 'lucide-react';
import { useEffect } from 'react';
import { updatePageMetadata } from '@/lib/seo';

const crisisNotificationTools = [
  {
    name: 'Everbridge',
    category: 'Crisis Notification',
    marketPosition: 'Market leader in mass notification',
    focus: 'Emergency alerts, mass notification, critical event management',
    strengths: ['Global reach', 'Mass notification', 'Multi-channel alerts', 'Compliance certified'],
    gaps: ['Alert only - no execution', 'No playbook library', 'No task orchestration', 'No institutional learning'],
    color: 'bg-red-500',
    whenTheyWin: 'Pure notification requirements, government/public sector mandates',
    trapQuestion: '"How do you turn an alert into coordinated action across 6 departments in under an hour?"'
  },
  {
    name: 'OnSolve',
    category: 'Crisis Notification',
    marketPosition: 'Risk intelligence + notification',
    focus: 'AI-powered risk intelligence, mass notification, travel risk',
    strengths: ['Risk intelligence', 'Travel tracking', 'Quick deployment', 'Location-based alerts'],
    gaps: ['Detection without execution', 'No pre-built responses', 'No cross-functional coordination', 'No decision support'],
    color: 'bg-orange-500',
    whenTheyWin: 'Risk monitoring focus, travel-heavy organizations',
    trapQuestion: '"After OnSolve detects a risk, how long does it take your teams to mobilize a coordinated response?"'
  },
  {
    name: 'Noggin',
    category: 'Crisis Management',
    marketPosition: 'Integrated resilience workspace',
    focus: 'Crisis management, business continuity, incident management',
    strengths: ['Incident management', 'Plan repository', 'Exercise management', 'Resilience focus'],
    gaps: ['Manual coordination', 'No signal monitoring', 'Slow activation', 'No AI recommendations'],
    color: 'bg-purple-500',
    whenTheyWin: 'BC/DR focused requirements, manual plan management',
    trapQuestion: '"How quickly can you activate a response and have all stakeholders aligned with assigned tasks?"'
  }
];

const projectManagementTools = [
  {
    name: 'Jira',
    category: 'Project Management',
    marketPosition: 'Dev team work management',
    focus: 'Agile project management, issue tracking, dev workflows',
    strengths: ['Developer adoption', 'Workflow flexibility', 'Integrations', 'Reporting'],
    gaps: ['No strategic playbooks', 'No signal detection', 'Manual project setup', 'No pre-approved resources'],
    color: 'bg-blue-500',
    whenTheyWin: 'Engineering-first organizations, existing heavy Jira adoption',
    trapQuestion: '"When a strategic event hits, how long does it take to create the project, assign owners, and get everyone aligned?"'
  },
  {
    name: 'Asana',
    category: 'Work Management',
    marketPosition: 'Team collaboration platform',
    focus: 'Task management, team collaboration, project tracking',
    strengths: ['User-friendly', 'Cross-functional visibility', 'Templates', 'Timeline views'],
    gaps: ['No external intelligence', 'No crisis readiness', 'No auto-orchestration', 'No institutional memory'],
    color: 'bg-pink-500',
    whenTheyWin: 'Marketing/ops teams, simple project needs',
    trapQuestion: '"Does Asana tell you when to act, or just help you track work you\'ve already decided to do?"'
  },
  {
    name: 'Monday.com',
    category: 'Work OS',
    marketPosition: 'Visual work management',
    focus: 'Team collaboration, project management, workflow automation',
    strengths: ['Visual interface', 'Customizable', 'Automations', 'Integrations'],
    gaps: ['Task-level focus', 'No signal monitoring', 'No coordinated response', 'No strategic execution'],
    color: 'bg-yellow-500',
    whenTheyWin: 'Visual-first teams, simple automation needs',
    trapQuestion: '"Can Monday.com automatically create a project with 50 tasks, assign 6 departments, and unlock budget when a competitor announces M&A?"'
  },
  {
    name: 'ServiceNow',
    category: 'Enterprise Workflow',
    marketPosition: 'Enterprise service management',
    focus: 'IT service management, workflow automation, enterprise ops',
    strengths: ['Enterprise scale', 'ITSM strength', 'Process automation', 'Compliance'],
    gaps: ['IT-centric', 'No external signals', 'No strategic playbooks', 'Reactive not proactive'],
    color: 'bg-green-500',
    whenTheyWin: 'IT-led initiatives, ITSM expansion plays',
    trapQuestion: '"ServiceNow is great for IT incidents. But when a regulatory change hits, can it coordinate Legal, Compliance, Comms, and Ops in 12 minutes?"'
  }
];

const categoryComparison = [
  { capability: 'Detects strategic triggers proactively', crisisTools: 'partial', pmTools: false, m: true },
  { capability: 'Pre-built playbooks with assigned tasks', crisisTools: false, pmTools: false, m: true },
  { capability: 'Auto-creates project on activation', crisisTools: false, pmTools: false, m: true },
  { capability: 'Assigns tasks to specific owners', crisisTools: false, pmTools: 'manual', m: true },
  { capability: 'Stages required documents', crisisTools: false, pmTools: 'manual', m: true },
  { capability: 'Unlocks pre-approved budgets', crisisTools: false, pmTools: false, m: true },
  { capability: 'Syncs to existing PM tools (Jira, etc.)', crisisTools: false, pmTools: 'native', m: true },
  { capability: '12-minute coordinated response', crisisTools: false, pmTools: false, m: true },
  { capability: 'AI-powered recommendations', crisisTools: 'partial', pmTools: false, m: true },
  { capability: 'Institutional learning loop', crisisTools: false, pmTools: false, m: true },
];

const objections = [
  {
    objection: '"We already have Everbridge for crisis management."',
    response: 'Everbridge excels at notification—telling people something happened. M picks up where Everbridge stops: the 20-50 hours of coordination after the alert goes out. M can actually receive Everbridge alerts as triggers, then auto-orchestrate your response.',
    category: 'Crisis Tools'
  },
  {
    objection: '"We use Jira/Asana for all our project management."',
    response: 'Perfect—M syncs directly to Jira and Asana. When M activates a playbook, it creates the project in your existing PM tool with all tasks assigned. Your teams work where they\'re comfortable; M just eliminates the 20-50 hours of setup.',
    category: 'PM Tools'
  },
  {
    objection: '"This sounds like another tool to adopt."',
    response: 'M is the opposite—it reduces tools. Teams don\'t learn M; M comes to them via the tools they already use (Slack, Teams, Jira, email). The playbook library and signal monitoring are invisible to end users.',
    category: 'Adoption'
  },
  {
    objection: '"We have crisis playbooks in SharePoint."',
    response: 'Static playbooks become stale and require manual activation. When did you last update them? Who activates them? M turns static documents into living, self-improving execution engines that activate automatically.',
    category: 'Process'
  },
  {
    objection: '"Our teams can coordinate in 72 hours."',
    response: 'What\'s the cost of those 72 hours? For a cyber breach, every hour is $150K+ in damages. For M&A response, competitors who react in 12 minutes gain insurmountable advantages. M captures the value of speed.',
    category: 'Urgency'
  },
  {
    objection: '"How is this different from AI agents?"',
    response: 'AI agents introduce unpredictability—you don\'t know what they\'ll do. M provides deterministic execution: pre-defined playbooks where AI recommends and humans decide. You get speed without surprises.',
    category: 'Technology'
  }
];

const strategicDomains = [
  { name: 'Market Dynamics', count: 24, icon: TrendingUp },
  { name: 'Competitive Intelligence', count: 18, icon: Target },
  { name: 'Crisis Management', count: 22, icon: AlertTriangle },
  { name: 'M&A Integration', count: 16, icon: Layers },
  { name: 'Supply Chain', count: 20, icon: BarChart3 },
  { name: 'Regulatory Response', count: 18, icon: Shield },
  { name: 'Talent & Culture', count: 14, icon: Users },
  { name: 'Technology Disruption', count: 16, icon: Zap },
  { name: 'AI Governance', count: 18, icon: Brain },
];

export default function CompetitivePositioning() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    updatePageMetadata({
      title: "Competitive Positioning - M | Strategic Execution OS",
      description: "See how M creates a new category between crisis notification tools (Everbridge, OnSolve) and project management (Jira, Asana). The execution layer Fortune 1000 companies need.",
      ogTitle: "M vs. Crisis Tools vs. PM Tools | Category of One",
      ogDescription: "M isn't competing with Everbridge or Jira. M owns the strategic execution layer between them.",
    });
  }, []);

  return (
    <PageLayout>
      <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
        
        {/* Hero Section */}
        <section className="py-16 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
          <div className="max-w-6xl mx-auto text-center">
            <Badge className="mb-6 bg-blue-600/20 text-blue-300 border-blue-500/30" data-testid="badge-market-position">
              Market Position
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6" data-testid="heading-competitive-positioning">
              The Strategic Execution Layer
              <span className="block text-blue-400 mt-2">Category of One</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Crisis tools notify. PM tools track. M executes. We're not competing with Everbridge or Jira—we own the 
              <span className="text-blue-300 font-semibold"> 20-50 hours of coordination </span> 
              that happens between alert and action.
            </p>
            
            {/* Three Category Visual */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="bg-red-500/20 border border-red-500/40 rounded-lg px-6 py-3">
                <Bell className="w-5 h-5 text-red-400 inline mr-2" />
                <span className="text-red-300 font-medium">Crisis Notification</span>
                <div className="text-xs text-red-400/70 mt-1">Everbridge, OnSolve, Noggin</div>
              </div>
              <div className="bg-blue-500/30 border-2 border-blue-400 rounded-lg px-6 py-3 ring-2 ring-blue-400/50">
                <Zap className="w-5 h-5 text-blue-300 inline mr-2" />
                <span className="text-blue-200 font-bold">Strategic Execution</span>
                <div className="text-xs text-blue-300 mt-1">M (Category of One)</div>
              </div>
              <div className="bg-green-500/20 border border-green-500/40 rounded-lg px-6 py-3">
                <Settings className="w-5 h-5 text-green-400 inline mr-2" />
                <span className="text-green-300 font-medium">Project Management</span>
                <div className="text-xs text-green-400/70 mt-1">Jira, Asana, Monday, ServiceNow</div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setLocation('/demo/live-activation')}
                data-testid="button-see-demo"
              >
                <Play className="w-5 h-5 mr-2" />
                See 12-Minute Activation
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10"
                onClick={() => setLocation('/pilot-program')}
                data-testid="button-pilot-program"
              >
                Start Pilot Program
              </Button>
            </div>
          </div>
        </section>

        {/* The Gap We Fill */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4" data-testid="heading-gap">
                The $2M Gap Between Alert and Action
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                When a strategic event hits, organizations spend 20-50 hours getting organized. 
                That's $60K-$2M in lost value per major event. M eliminates that gap entirely.
              </p>
            </div>

            {/* Visual Timeline */}
            <Card className="mb-12 overflow-hidden" data-testid="card-timeline">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  {/* Without M */}
                  <div className="flex-1 text-center">
                    <div className="text-red-500 font-bold text-lg mb-2">Without M</div>
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-3 text-center">
                        <div className="text-xs text-red-600 dark:text-red-400">Alert</div>
                        <div className="font-bold text-red-700 dark:text-red-300">T+0</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                      <div className="bg-amber-100 dark:bg-amber-900/30 rounded-lg p-3 text-center">
                        <div className="text-xs text-amber-600 dark:text-amber-400">Triage</div>
                        <div className="font-bold text-amber-700 dark:text-amber-300">+4-8 hrs</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                      <div className="bg-amber-100 dark:bg-amber-900/30 rounded-lg p-3 text-center">
                        <div className="text-xs text-amber-600 dark:text-amber-400">Planning</div>
                        <div className="font-bold text-amber-700 dark:text-amber-300">+12-24 hrs</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                      <div className="bg-amber-100 dark:bg-amber-900/30 rounded-lg p-3 text-center">
                        <div className="text-xs text-amber-600 dark:text-amber-400">Coordination</div>
                        <div className="font-bold text-amber-700 dark:text-amber-300">+24-48 hrs</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                      <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3 text-center">
                        <div className="text-xs text-slate-600 dark:text-slate-400">Execution</div>
                        <div className="font-bold text-slate-700 dark:text-slate-300">+72 hrs</div>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="hidden md:block w-px h-24 bg-slate-300 dark:bg-slate-700"></div>
                  <div className="md:hidden h-px w-full bg-slate-300 dark:bg-slate-700"></div>

                  {/* With M */}
                  <div className="flex-1 text-center">
                    <div className="text-emerald-500 font-bold text-lg mb-2">With M</div>
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-lg p-3 text-center">
                        <div className="text-xs text-emerald-600 dark:text-emerald-400">Trigger Detected</div>
                        <div className="font-bold text-emerald-700 dark:text-emerald-300">T+0</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-emerald-400" />
                      <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-lg p-3 text-center">
                        <div className="text-xs text-emerald-600 dark:text-emerald-400">Playbook Activated</div>
                        <div className="font-bold text-emerald-700 dark:text-emerald-300">+30 sec</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-emerald-400" />
                      <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-lg p-3 text-center">
                        <div className="text-xs text-emerald-600 dark:text-emerald-400">All Teams Aligned</div>
                        <div className="font-bold text-emerald-700 dark:text-emerald-300">+12 min</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Battle Cards by Category */}
        <section className="py-16 px-6 bg-slate-100 dark:bg-slate-900/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4" data-testid="heading-battle-cards">
                Competitive Battle Cards
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                How M positions against each category of competitor
              </p>
            </div>

            <Tabs defaultValue="crisis" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8" data-testid="tabs-competitor-categories">
                <TabsTrigger value="crisis" className="flex items-center gap-2" data-testid="tab-crisis-tools">
                  <Bell className="w-4 h-4" />
                  Crisis Notification Tools
                </TabsTrigger>
                <TabsTrigger value="pm" className="flex items-center gap-2" data-testid="tab-pm-tools">
                  <Settings className="w-4 h-4" />
                  Project Management Tools
                </TabsTrigger>
              </TabsList>

              <TabsContent value="crisis">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {crisisNotificationTools.map((tool) => (
                    <Card key={tool.name} className="border-t-4 hover:shadow-lg transition-shadow" style={{ borderTopColor: tool.color.replace('bg-', '').includes('red') ? '#ef4444' : tool.color.includes('orange') ? '#f97316' : '#a855f7' }} data-testid={`card-competitor-${tool.name.toLowerCase()}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-10 h-10 rounded-full ${tool.color} flex items-center justify-center`}>
                              <span className="text-white font-bold">{tool.name.charAt(0)}</span>
                            </div>
                            <div>
                              <CardTitle className="text-lg">{tool.name}</CardTitle>
                              <Badge variant="outline" className="text-xs">{tool.category}</Badge>
                            </div>
                          </div>
                        </div>
                        <CardDescription className="mt-2">{tool.marketPosition}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Their Strengths</div>
                          <ul className="space-y-1">
                            {tool.strengths.map((s, i) => (
                              <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" /> {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">Gaps M Fills</div>
                          <ul className="space-y-1">
                            {tool.gaps.map((g, i) => (
                              <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                                <Zap className="w-3 h-3 text-blue-500 flex-shrink-0" /> {g}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                          <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">When They Win</div>
                          <p className="text-xs text-slate-500 dark:text-slate-500">{tool.whenTheyWin}</p>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                          <div className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1 flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" /> Trap Question
                          </div>
                          <p className="text-xs text-blue-600 dark:text-blue-400 italic">{tool.trapQuestion}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="pm">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {projectManagementTools.map((tool) => (
                    <Card key={tool.name} className="border-t-4 hover:shadow-lg transition-shadow" style={{ borderTopColor: tool.color.includes('blue') ? '#3b82f6' : tool.color.includes('pink') ? '#ec4899' : tool.color.includes('yellow') ? '#eab308' : '#22c55e' }} data-testid={`card-competitor-${tool.name.toLowerCase().replace(/\./g, '')}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-10 h-10 rounded-full ${tool.color} flex items-center justify-center`}>
                              <span className="text-white font-bold">{tool.name.charAt(0)}</span>
                            </div>
                            <div>
                              <CardTitle className="text-lg">{tool.name}</CardTitle>
                              <Badge variant="outline" className="text-xs">{tool.category}</Badge>
                            </div>
                          </div>
                        </div>
                        <CardDescription className="mt-2">{tool.marketPosition}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Their Strengths</div>
                            <ul className="space-y-1">
                              {tool.strengths.map((s, i) => (
                                <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" /> {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">Gaps M Fills</div>
                            <ul className="space-y-1">
                              {tool.gaps.map((g, i) => (
                                <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                                  <Zap className="w-3 h-3 text-blue-500 flex-shrink-0" /> {g}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                          <div className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1 flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" /> Trap Question
                          </div>
                          <p className="text-xs text-blue-600 dark:text-blue-400 italic">{tool.trapQuestion}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Category Comparison Matrix */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4" data-testid="heading-category-comparison">
                Three Categories, One Gap
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                M is the only platform that bridges detection and execution
              </p>
            </div>

            <Card data-testid="card-comparison-matrix">
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b bg-slate-50 dark:bg-slate-800/50">
                      <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Capability</th>
                      <th className="text-center p-4">
                        <div className="flex flex-col items-center">
                          <Bell className="w-5 h-5 text-red-500 mb-1" />
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Crisis Tools</span>
                        </div>
                      </th>
                      <th className="text-center p-4">
                        <div className="flex flex-col items-center">
                          <Settings className="w-5 h-5 text-green-500 mb-1" />
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">PM Tools</span>
                        </div>
                      </th>
                      <th className="text-center p-4 bg-blue-50 dark:bg-blue-900/20">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-1">
                            <span className="text-white font-bold text-sm">M</span>
                          </div>
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">M</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryComparison.map((row, i) => (
                      <tr key={i} className="border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        <td className="p-4 text-sm text-slate-700 dark:text-slate-300">{row.capability}</td>
                        <td className="p-4 text-center">
                          {row.crisisTools === true && <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" />}
                          {row.crisisTools === false && <XCircle className="w-5 h-5 text-slate-300 dark:text-slate-600 mx-auto" />}
                          {row.crisisTools === 'partial' && <Minus className="w-5 h-5 text-amber-500 mx-auto" />}
                          {row.crisisTools === 'manual' && <span className="text-xs text-slate-500">Manual</span>}
                          {row.crisisTools === 'native' && <span className="text-xs text-slate-500">N/A</span>}
                        </td>
                        <td className="p-4 text-center">
                          {row.pmTools === true && <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" />}
                          {row.pmTools === false && <XCircle className="w-5 h-5 text-slate-300 dark:text-slate-600 mx-auto" />}
                          {row.pmTools === 'partial' && <Minus className="w-5 h-5 text-amber-500 mx-auto" />}
                          {row.pmTools === 'manual' && <span className="text-xs text-slate-500">Manual</span>}
                          {row.pmTools === 'native' && <span className="text-xs text-slate-500">N/A</span>}
                        </td>
                        <td className="p-4 text-center bg-blue-50/50 dark:bg-blue-900/10">
                          {row.m === true && <CheckCircle className="w-5 h-5 text-blue-500 mx-auto" />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Objection Handling */}
        <section className="py-16 px-6 bg-slate-100 dark:bg-slate-900/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4" data-testid="heading-objections">
                Objection Handling Guide
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Common pushback and how to address it
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {objections.map((obj, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow" data-testid={`card-objection-${i}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                        <HelpCircle className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <Badge variant="outline" className="mb-2 text-xs">{obj.category}</Badge>
                        <CardTitle className="text-base text-red-700 dark:text-red-400">{obj.objection}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                        <MessageSquare className="w-5 h-5 text-emerald-500" />
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{obj.response}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Strategic Domains */}
        <section className="py-16 px-6 bg-gradient-to-br from-blue-900 to-purple-900">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4" data-testid="heading-domains">
                166 Playbooks Across 9 Strategic Domains
              </h2>
              <p className="text-lg text-blue-200">
                No competitor offers pre-built, executable strategic playbooks
              </p>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              {strategicDomains.map((domain) => (
                <div 
                  key={domain.name} 
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/20 transition-colors cursor-pointer"
                  onClick={() => setLocation('/playbook-library')}
                  data-testid={`card-domain-${domain.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <domain.icon className="w-6 h-6 text-blue-300 mx-auto mb-2" />
                  <div className="text-xl font-bold text-white mb-1">{domain.count}</div>
                  <div className="text-xs text-blue-200">{domain.name}</div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button 
                size="lg" 
                className="bg-white text-blue-900 hover:bg-blue-50"
                onClick={() => setLocation('/playbook-library')}
                data-testid="button-browse-playbooks"
              >
                Browse All 166 Playbooks
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* The Moat */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-slate-900 to-blue-900 text-white border-0" data-testid="card-moat">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-white/10">
                    <Building2 className="w-8 h-8 text-blue-300" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-4">The Enterprise Moat</h3>
                    <p className="text-blue-200 mb-6">
                      Once a Fortune 1000 company has 50+ playbooks syncing to Jira with bi-directional updates, 
                      historical execution data, and months of organizational knowledge encoded in M—switching 
                      becomes nearly impossible.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-300">50+</div>
                        <div className="text-xs text-blue-400">Active Playbooks</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-300">2-way</div>
                        <div className="text-xs text-blue-400">Jira Sync</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-300">12mo</div>
                        <div className="text-xs text-blue-400">Execution History</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-300">100%</div>
                        <div className="text-xs text-blue-400">Institutional Memory</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-6 bg-slate-100 dark:bg-slate-900/50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4" data-testid="heading-cta">
              Ready to Own Strategic Execution?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              See how M eliminates the 20-50 hours between alert and action
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setLocation('/demo/live-activation')}
                data-testid="button-cta-demo"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch 12-Minute Demo
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setLocation('/pilot-program')}
                data-testid="button-cta-pilot"
              >
                Start 90-Day Pilot
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </section>

      </div>
    </PageLayout>
  );
}
