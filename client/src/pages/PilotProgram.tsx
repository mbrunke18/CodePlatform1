import { useLocation } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle,
  ArrowRight,
  Clock,
  Users,
  Zap,
  Target,
  BookOpen,
  Settings,
  BarChart3,
  Shield,
  Building2,
  Calendar,
  Award,
  DollarSign,
  TrendingUp,
  MessageSquare,
  Layers,
  Play,
  Star,
  FileText,
  Rocket
} from 'lucide-react';
import { useEffect } from 'react';
import { updatePageMetadata } from '@/lib/seo';

const pilotPhases = [
  {
    phase: 'Phase 0',
    name: 'Readiness & Setup',
    duration: 'Weeks 1-2',
    color: 'bg-slate-600',
    activities: [
      'Executive sponsor alignment session',
      'Integration setup (Jira, Slack/Teams)',
      'Select 3-5 pilot playbooks from 166 library',
      'Configure signal monitoring for pilot triggers',
      'Baseline current response metrics'
    ],
    deliverables: ['Integration complete', 'Playbooks configured', 'Baseline metrics documented'],
    successMetrics: 'All integrations tested and operational'
  },
  {
    phase: 'Phase 1',
    name: 'Dry Runs & Training',
    duration: 'Weeks 3-6',
    color: 'bg-blue-600',
    activities: [
      'Conduct 2-3 tabletop exercises with M',
      'Measure activation time (target: <12 min)',
      'Train response team leads on M workflow',
      'Refine playbooks based on dry run feedback',
      'Establish KPI tracking dashboard'
    ],
    deliverables: ['Dry run reports', 'Training completion', 'Refined playbooks'],
    successMetrics: 'Activation time under 15 minutes in dry runs'
  },
  {
    phase: 'Phase 2',
    name: 'Live Activation',
    duration: 'Weeks 7-10',
    color: 'bg-emerald-600',
    activities: [
      'Enable live signal monitoring',
      'First live playbook activation',
      'Track all coordination metrics',
      'Document lessons learned',
      'Capture stakeholder feedback'
    ],
    deliverables: ['Live activation data', 'ROI evidence', 'User testimonials'],
    successMetrics: 'At least 1 live activation with measured 12-minute response'
  },
  {
    phase: 'Phase 3',
    name: 'Executive Readout',
    duration: 'Weeks 11-12',
    color: 'bg-purple-600',
    activities: [
      'Compile ROI scorecard',
      'Present results to executive sponsor',
      'Define production rollout plan',
      'Negotiate enterprise agreement',
      'Plan Phase 2 expansion'
    ],
    deliverables: ['Executive presentation', 'ROI scorecard', 'Expansion proposal'],
    successMetrics: 'Clear go/no-go decision with quantified value'
  }
];

const pilotInclusions = [
  {
    category: 'Platform Access',
    icon: Layers,
    items: [
      'Full M platform access for pilot team (up to 25 users)',
      '5 customizable playbooks from 166 library',
      'Signal monitoring for 3 intelligence categories',
      'Command Center with real-time coordination'
    ]
  },
  {
    category: 'Integrations',
    icon: Settings,
    items: [
      'Bi-directional Jira or Asana sync',
      'Slack or Microsoft Teams notifications',
      'Email notification integration',
      'SSO configuration (if needed)'
    ]
  },
  {
    category: 'Support',
    icon: Users,
    items: [
      'Dedicated Customer Success Manager',
      'Weekly check-in calls',
      'Priority support response (4hr SLA)',
      'Executive sponsor alignment sessions'
    ]
  },
  {
    category: 'Training',
    icon: BookOpen,
    items: [
      '2-hour platform training session',
      'Playbook customization workshop',
      'Tabletop exercise facilitation (2-3 sessions)',
      'Documentation and quick-start guides'
    ]
  }
];

const idealCandidates = [
  {
    criteria: 'Organization Size',
    description: 'Fortune 1000 or equivalent ($1B+ revenue)',
    icon: Building2,
    importance: 'Required'
  },
  {
    criteria: 'Executive Sponsor',
    description: 'C-level or SVP champion with budget authority',
    icon: Star,
    importance: 'Required'
  },
  {
    criteria: 'PM Tool',
    description: 'Active Jira, Asana, or Monday.com deployment',
    icon: Settings,
    importance: 'Required'
  },
  {
    criteria: 'Recent Pain Point',
    description: 'Experienced slow response to strategic event in past 12 months',
    icon: Target,
    importance: 'Preferred'
  },
  {
    criteria: 'Multi-Department',
    description: 'Strategic events require 4+ departments to coordinate',
    icon: Users,
    importance: 'Preferred'
  },
  {
    criteria: 'Growth Intent',
    description: 'Committed to enterprise rollout if pilot succeeds',
    icon: TrendingUp,
    importance: 'Preferred'
  }
];

const roiCalculator = [
  {
    metric: 'Hours Saved per Event',
    baseline: '20-50 hours',
    withM: '0 hours (pre-planned)',
    calculation: '20-50 × $500/hr executive time',
    value: '$10,000-$25,000'
  },
  {
    metric: 'Response Time',
    baseline: '72+ hours to full coordination',
    withM: '12 minutes to full coordination',
    calculation: 'Revenue protected by faster response',
    value: '$500K-$2M per major event'
  },
  {
    metric: 'C-Suite Time Recovery',
    baseline: '50+ hours per event',
    withM: '5 hours oversight only',
    calculation: '45 hours × $1,000/hr',
    value: '$45,000+ per event'
  },
  {
    metric: 'Tool Consolidation',
    baseline: 'Multiple point solutions',
    withM: 'Single execution platform',
    calculation: 'Reduced platform licensing',
    value: '$50-100K annually'
  }
];

const conversionTerms = [
  {
    term: '100% Pilot Credit',
    description: 'Full pilot investment applies to enterprise contract',
    icon: DollarSign
  },
  {
    term: 'Preferred Pricing',
    description: 'Founding partner rates locked for 3 years',
    icon: Star
  },
  {
    term: 'Priority Roadmap',
    description: 'Input on feature development priorities',
    icon: Target
  },
  {
    term: 'Enterprise SLA',
    description: '99.9% uptime, 2-hour priority support',
    icon: Shield
  }
];

export default function PilotProgram() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    updatePageMetadata({
      title: "90-Day Pilot Program - M | Strategic Execution OS",
      description: "Validate M's 12-minute coordination claim with a structured 90-day pilot. Includes 5 playbooks, Jira integration, and dedicated success manager. 100% credit applies to enterprise contract.",
      ogTitle: "M Pilot Program | 90 Days to Transform Strategic Execution",
      ogDescription: "Fortune 1000 pilot program with ROI measurement, live activation, and clear conversion path.",
    });
  }, []);

  return (
    <PageLayout>
      <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
        
        {/* Hero Section */}
        <section className="py-16 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
          <div className="max-w-6xl mx-auto text-center">
            <Badge className="mb-6 bg-emerald-600/20 text-emerald-300 border-emerald-500/30" data-testid="badge-pilot">
              Fortune 1000 Design Partner Program
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6" data-testid="heading-pilot-program">
              90-Day Pilot Program
              <span className="block text-emerald-400 mt-2">Validate Before You Commit</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Prove M's 12-minute coordination claim with real activations in your environment. 
              Structured phases, measurable outcomes, and a clear path to enterprise deployment.
            </p>
            
            {/* Key Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 text-center">
                <div className="text-2xl font-bold text-white">90</div>
                <div className="text-xs text-slate-300">Days</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 text-center">
                <div className="text-2xl font-bold text-white">5</div>
                <div className="text-xs text-slate-300">Playbooks</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 text-center">
                <div className="text-2xl font-bold text-white">25</div>
                <div className="text-xs text-slate-300">Users</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 text-center">
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-xs text-slate-300">Credit Applied</div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setLocation('/contact')}
                data-testid="button-apply-pilot"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Apply for Pilot Program
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10"
                onClick={() => setLocation('/demo/live-activation')}
                data-testid="button-see-demo"
              >
                <Play className="w-5 h-5 mr-2" />
                See Demo First
              </Button>
            </div>
          </div>
        </section>

        {/* 4-Phase Timeline */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4" data-testid="heading-phases">
                Structured 90-Day Journey
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Crawl, walk, run methodology with clear milestones and success criteria
              </p>
            </div>

            {/* Timeline Visual */}
            <div className="relative mb-12">
              <div className="absolute left-0 right-0 top-1/2 h-1 bg-slate-200 dark:bg-slate-700 -translate-y-1/2 hidden md:block"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {pilotPhases.map((phase, i) => (
                  <div key={i} className="relative" data-testid={`phase-${i}`}>
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full ${phase.color} flex items-center justify-center text-white font-bold z-10 mb-4`}>
                        {i + 1}
                      </div>
                      <Card className="w-full">
                        <CardHeader className="pb-2 text-center">
                          <Badge className={`${phase.color} text-white mb-2`}>{phase.duration}</Badge>
                          <CardTitle className="text-lg">{phase.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                          <ul className="space-y-1 mb-4">
                            {phase.activities.slice(0, 3).map((activity, j) => (
                              <li key={j} className="text-slate-600 dark:text-slate-400 flex items-start gap-2">
                                <CheckCircle className="w-3 h-3 text-emerald-500 mt-1 flex-shrink-0" />
                                <span className="text-xs">{activity}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="border-t pt-3">
                            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">Success Metric</div>
                            <p className="text-xs text-slate-500 dark:text-slate-500">{phase.successMetrics}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-16 px-6 bg-slate-100 dark:bg-slate-900/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4" data-testid="heading-inclusions">
                What's Included
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Everything you need to validate M in your environment
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pilotInclusions.map((inclusion, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow" data-testid={`card-inclusion-${i}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <inclusion.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <CardTitle className="text-base">{inclusion.category}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {inclusion.items.map((item, j) => (
                        <li key={j} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Ideal Candidates */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4" data-testid="heading-candidates">
                Ideal Pilot Candidates
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Organizations positioned to maximize pilot value
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {idealCandidates.map((candidate, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow" data-testid={`card-candidate-${i}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                        <candidate.icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-slate-900 dark:text-white">{candidate.criteria}</h3>
                          <Badge variant={candidate.importance === 'Required' ? 'default' : 'outline'} className={candidate.importance === 'Required' ? 'bg-blue-600' : ''}>
                            {candidate.importance}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{candidate.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ROI Measurement Framework */}
        <section className="py-16 px-6 bg-gradient-to-br from-blue-900 to-purple-900">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4" data-testid="heading-roi">
                ROI Measurement Framework
              </h2>
              <p className="text-lg text-blue-200">
                Quantified value capture at every milestone
              </p>
            </div>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20" data-testid="card-roi-framework">
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left p-4 font-semibold text-white">Value Metric</th>
                      <th className="text-left p-4 font-semibold text-red-300">Before M</th>
                      <th className="text-left p-4 font-semibold text-emerald-300">With M</th>
                      <th className="text-left p-4 font-semibold text-blue-300">Calculation</th>
                      <th className="text-right p-4 font-semibold text-amber-300">Value Captured</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roiCalculator.map((row, i) => (
                      <tr key={i} className="border-b border-white/10 last:border-0">
                        <td className="p-4 text-white font-medium">{row.metric}</td>
                        <td className="p-4 text-red-200">{row.baseline}</td>
                        <td className="p-4 text-emerald-200">{row.withM}</td>
                        <td className="p-4 text-blue-200 text-sm">{row.calculation}</td>
                        <td className="p-4 text-amber-300 font-bold text-right">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-white/10">
                      <td colSpan={4} className="p-4 text-white font-bold text-right">Total Value per Major Event:</td>
                      <td className="p-4 text-2xl font-bold text-amber-300 text-right">$60K - $2M+</td>
                    </tr>
                  </tfoot>
                </table>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Conversion Terms */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4" data-testid="heading-conversion">
                Pilot to Production Path
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Founding partner benefits for pilot participants
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {conversionTerms.map((term, i) => (
                <Card key={i} className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-2 border-emerald-200 dark:border-emerald-900 hover:border-emerald-400 dark:hover:border-emerald-700 transition-colors" data-testid={`card-term-${i}`}>
                  <CardContent className="p-6 text-center">
                    <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 inline-block mb-4">
                      <term.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">{term.term}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{term.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories Preview */}
        <section className="py-16 px-6 bg-slate-100 dark:bg-slate-900/50">
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden" data-testid="card-success-preview">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="p-4 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                    <Award className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <Badge className="mb-3 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      Pilot Success Target
                    </Badge>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                      What Success Looks Like
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                        <span className="text-slate-700 dark:text-slate-300">At least 1 live activation under 15 minutes</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                        <span className="text-slate-700 dark:text-slate-300">5+ playbooks customized and operational</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                        <span className="text-slate-700 dark:text-slate-300">Quantified ROI with executive sign-off</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                        <span className="text-slate-700 dark:text-slate-300">Clear expansion plan for enterprise rollout</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4" data-testid="heading-cta">
              Ready to Validate Strategic Execution?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Limited to 5 design partners in Q1 2025. Priority given to organizations with recent strategic event pain.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setLocation('/contact')}
                data-testid="button-cta-apply"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Apply for Pilot Program
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setLocation('/competitive-positioning')}
                data-testid="button-cta-positioning"
              >
                <FileText className="w-5 h-5 mr-2" />
                View Competitive Positioning
              </Button>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-6">
              Questions? Contact us at <span className="text-blue-600 dark:text-blue-400">pilots@m-strategic.com</span>
            </p>
          </div>
        </section>

      </div>
    </PageLayout>
  );
}
