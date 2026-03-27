import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
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
import { ExecuteIQLogo } from "@/components/ExecuteIQLogo";

const pilotPhases = [
  {
    phase: 'Phase 0',
    name: 'Readiness & Setup',
    duration: 'Weeks 1-2',
    color: 'bg-[#6B7280]',
    activities: [
      'Executive sponsor alignment session',
      'Integration setup (Jira, Slack/Teams)',
      'Select 3-5 pilot playbooks from 170 library',
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
    color: 'bg-[#0A0F2E]',
    activities: [
      'Conduct 2-3 tabletop exercises with Execution OS',
      'Measure activation time (target: <12 min)',
      'Train response team leads on Execution OS workflow',
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
    color: 'bg-[#2B8A6E]',
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
    color: 'bg-[#C9A84C]',
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
      'Full Execution OS platform access for pilot team (up to 25 users)',
      '5 customizable playbooks from 170 library',
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
    withExecutionOS: '0 hours (pre-planned)',
    calculation: '20-50 × $500/hr executive time',
    value: '$10,000-$25,000'
  },
  {
    metric: 'Response Time',
    baseline: '72+ hours to full coordination',
    withExecutionOS: '12 minutes to full coordination',
    calculation: 'Revenue protected by faster response',
    value: '$500K-$2M per major event'
  },
  {
    metric: 'C-Suite Time Recovery',
    baseline: '50+ hours per event',
    withExecutionOS: '5 hours oversight only',
    calculation: '45 hours × $1,000/hr',
    value: '$45,000+ per event'
  },
  {
    metric: 'Tool Consolidation',
    baseline: 'Multiple point solutions',
    withExecutionOS: 'Single execution platform',
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
      title: "90-Day Pilot Program - Execution OS | Strategic Execution OS",
      description: "Validate Execution OS' 12-minute coordination claim with a structured 90-day pilot. Includes 5 playbooks, Jira integration, and dedicated success manager. 100% credit applies to enterprise contract.",
      ogTitle: "Execution OS Pilot Program | 90 Days to Transform Strategic Execution",
      ogDescription: "Fortune 1000 pilot program with ROI measurement, live activation, and clear conversion path.",
    });
  }, []);

  return (
    <PageLayout>
      <div className="bg-[#F8F7F4] dark:bg-[#0A0F2E]">
        
        {/* Hero Section */}
        <section className="py-16 px-6 bg-[#0A0F2E]">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-block px-6 py-4 rounded-2xl border border-white/10 backdrop-blur-sm mb-6">
              <ExecuteIQLogo width={240} variant="full" color="white" showTagline={true} />
            </div>
            <Badge className="mb-6 bg-[#2B8A6E] text-white border-[#2B8A6E]/30" data-testid="badge-pilot">
              Fortune 1000 Design Partner Program
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6" data-testid="heading-pilot-program">
              90-Day Pilot Program
              <span className="block text-[#C9A84C] mt-2">Validate Before You Commit</span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Prove Execution OS' 12-minute coordination claim with real activations in your environment. 
              Structured phases, measurable outcomes, and a clear path to enterprise deployment.
            </p>
            
            {/* Key Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg px-6 py-3 text-center border border-white/10">
                <div className="text-2xl font-bold text-[#3BAF8A]">$75K</div>
                <div className="text-xs text-white/70">Pilot Investment</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg px-6 py-3 text-center border border-white/10">
                <div className="text-2xl font-bold text-white">90</div>
                <div className="text-xs text-white/70">Days</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg px-6 py-3 text-center border border-white/10">
                <div className="text-2xl font-bold text-white">5</div>
                <div className="text-xs text-white/70">Playbooks</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg px-6 py-3 text-center border border-white/10">
                <div className="text-2xl font-bold text-white">25</div>
                <div className="text-xs text-white/70">Users</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg px-6 py-3 text-center border border-white/10">
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-xs text-white/70">Credit to Year 1</div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-[#0A0F2E] text-white font-bold hover:bg-[#141B45] border-2 border-[#C9A84C]/30"
                onClick={() => setLocation('/contact')}
                data-testid="button-apply-pilot"
              >
                <Rocket className="w-5 h-5 mr-2 text-[#C9A84C]" />
                Apply for Pilot Program
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => setLocation('/request-access')}
                data-testid="button-request-access"
              >
                <Play className="w-5 h-5 mr-2 text-[#2B8A6E]" />
                Request Executive Access
              </Button>
            </div>
          </div>
        </section>

        {/* Differentiation Strip */}
        <section className="py-8 px-6 bg-[#0A0F2E] border-t border-white/5">
          <div className="max-w-5xl mx-auto grid grid-cols-3 gap-px bg-white/5" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
            {[
              { label: "Agentic, not a Copilot", body: "Our IDEA agents execute tasks. They don't suggest them. This is the difference between an AI tool and an execution engine." },
              { label: "Coordination, not capability", body: "Every enterprise already has AI capability. What they're missing is the coordination layer that makes AI execute — not just recommend." },
              { label: "Pre-staged, not inferred", body: "170 playbooks are ready before the trigger fires. No real-time inference loops. That's how you compress 30 days into 12 minutes." },
            ].map((item) => (
              <div key={item.label} style={{ padding: '20px 24px', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 8 }}>{item.label}</div>
                <div style={{ fontSize: 12, color: 'rgba(240,237,228,0.55)', lineHeight: 1.6 }}>{item.body}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 4-Phase Timeline */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#0A0F2E] dark:text-white mb-4" data-testid="heading-phases">
                Structured 90-Day Journey
              </h2>
              <p className="text-lg text-gray-800 dark:text-slate-300">
                Crawl, walk, run methodology with clear milestones and success criteria
              </p>
            </div>

            {/* Timeline Visual */}
            <div className="relative mb-12">
              <div className="absolute left-0 right-0 top-1/2 h-1 bg-[#E8E4DC] dark:bg-[#141B45] -translate-y-1/2 hidden md:block"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {pilotPhases.map((phase, i) => (
                  <div key={i} className="relative" data-testid={`phase-${i}`}>
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full ${phase.color} flex items-center justify-center text-white font-bold z-10 mb-4`}>
                        {i + 1}
                      </div>
                      <Card className="w-full border-[#E8E4DC]">
                        <CardHeader className="pb-2 text-center">
                          <Badge className={`${phase.color} text-white mb-2 border-none`}>{phase.duration}</Badge>
                          <CardTitle className="text-lg text-[#0A0F2E]">{phase.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                          <ul className="space-y-1 mb-4">
                            {phase.activities.slice(0, 3).map((activity, j) => (
                              <li key={j} className="text-gray-800 dark:text-slate-300 flex items-start gap-2">
                                <CheckCircle className="w-3 h-3 text-[#2B8A6E] mt-1 flex-shrink-0" />
                                <span className="text-xs">{activity}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="border-t border-[#E8E4DC] pt-3">
                            <div className="text-xs font-semibold text-[#0A0F2E] dark:text-[#C9A84C] mb-1">Success Metric</div>
                            <p className="text-xs text-gray-800 dark:text-slate-300">{phase.successMetrics}</p>
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
        <section className="py-16 px-6 bg-[#F8F7F4] dark:bg-[#0A0F2E]/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#0A0F2E] dark:text-white mb-4" data-testid="heading-inclusions">
                What's Included
              </h2>
              <p className="text-lg text-gray-800 dark:text-slate-300">
                Everything you need to validate Execution OS in your environment
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pilotInclusions.map((inclusion, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow" data-testid={`card-inclusion-${i}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#0A0F2E]/10 dark:bg-[#0A0F2E]/30">
                        <inclusion.icon className="w-5 h-5 text-[#0A0F2E] dark:text-[#0A0F2E]" />
                      </div>
                      <CardTitle className="text-base">{inclusion.category}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {inclusion.items.map((item, j) => (
                        <li key={j} className="text-sm text-gray-800 dark:text-slate-300 flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-[#2B8A6E] mt-0.5 flex-shrink-0" />
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
              <h2 className="text-3xl font-bold text-[#0A0F2E] dark:text-white mb-4" data-testid="heading-candidates">
                Ideal Pilot Candidates
              </h2>
              <p className="text-lg text-gray-800 dark:text-slate-300">
                Organizations positioned to maximize pilot value
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {idealCandidates.map((candidate, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow" data-testid={`card-candidate-${i}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-[#F8F7F4] dark:bg-[#141B45]">
                        <candidate.icon className="w-5 h-5 text-gray-800 dark:text-slate-300" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-[#0A0F2E] dark:text-white">{candidate.criteria}</h3>
                          <Badge variant={candidate.importance === 'Required' ? 'default' : 'outline'} className={candidate.importance === 'Required' ? 'bg-[#0A0F2E] text-white' : ''}>
                            {candidate.importance}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-800 dark:text-slate-300">{candidate.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ROI Measurement Framework */}
        <section className="py-16 px-6 bg-[#0A0F2E]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4" data-testid="heading-roi">
                ROI Measurement Framework
              </h2>
              <p className="text-lg text-white/70">
                Quantified value capture at every milestone
              </p>
            </div>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10" data-testid="card-roi-framework">
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4 font-semibold text-white">Value Metric</th>
                      <th className="text-left p-4 font-semibold text-red-400">Before Execution OS</th>
                      <th className="text-left p-4 font-semibold text-[#3BAF8A]">With Execution OS</th>
                      <th className="text-left p-4 font-semibold text-white/70">Calculation</th>
                      <th className="text-right p-4 font-semibold text-[#C9A84C]">Value Captured</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roiCalculator.map((row, i) => (
                      <tr key={i} className="border-b border-white/5 last:border-0">
                        <td className="p-4 text-white font-medium">{row.metric}</td>
                        <td className="p-4 text-red-400/80">{row.baseline}</td>
                        <td className="p-4 text-[#3BAF8A]">{row.withExecutionOS}</td>
                        <td className="p-4 text-white/60 text-sm">{row.calculation}</td>
                        <td className="p-4 text-[#C9A84C] font-bold text-right">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-white/5">
                      <td colSpan={4} className="p-4 text-white font-bold text-right">Total Value per Major Event:</td>
                      <td className="p-4 text-2xl font-bold text-[#C9A84C] text-right">$60K - $2M+</td>
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
              <h2 className="text-3xl font-bold text-[#0A0F2E] dark:text-white mb-4" data-testid="heading-conversion">
                Pilot to Production Path
              </h2>
              <p className="text-lg text-gray-800 dark:text-slate-300">
                Founding partner benefits for pilot participants
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {conversionTerms.map((term, i) => (
                <Card key={i} className="bg-gradient-to-br from-[#F8F7F4] to-[#F8F7F4] dark:from-[#141B45] dark:to-[#0A0F2E] border-2 border-[#2B8A6E] dark:border-[#2B8A6E] hover:border-[#2B8A6E] dark:hover:border-[#2B8A6E] transition-colors" data-testid={`card-term-${i}`}>
                  <CardContent className="p-6 text-center">
                    <div className="p-3 rounded-xl bg-[#F8F7F4] dark:bg-[#2B8A6E]/15 inline-block mb-4">
                      <term.icon className="w-6 h-6 text-[#2B8A6E] dark:text-[#2B8A6E]" />
                    </div>
                    <h3 className="font-bold text-[#0A0F2E] dark:text-white mb-2">{term.term}</h3>
                    <p className="text-sm text-gray-800 dark:text-slate-300">{term.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories Preview */}
        <section className="py-16 px-6 bg-[#F8F7F4] dark:bg-[#0A0F2E]/50">
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden" data-testid="card-success-preview">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="p-4 rounded-xl bg-[#0A0F2E]/10 dark:bg-[#0A0F2E]/30">
                    <Award className="w-10 h-10 text-[#0A0F2E] dark:text-[#0A0F2E]" />
                  </div>
                  <div>
                    <Badge className="mb-3 bg-[#0A0F2E]/10 text-[#0A0F2E] dark:bg-[#0A0F2E]/30 dark:text-slate-300">
                      Pilot Success Target
                    </Badge>
                    <h3 className="text-2xl font-bold text-[#0A0F2E] dark:text-white mb-4">
                      What Success Looks Like
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-[#2B8A6E]" />
                        <span className="text-gray-800 dark:text-slate-300">At least 1 live activation under 15 minutes</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-[#2B8A6E]" />
                        <span className="text-gray-800 dark:text-slate-300">5+ playbooks customized and operational</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-[#2B8A6E]" />
                        <span className="text-gray-800 dark:text-slate-300">Quantified ROI with executive sign-off</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-[#2B8A6E]" />
                        <span className="text-gray-800 dark:text-slate-300">Clear expansion plan for enterprise rollout</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Independent Peer Assessment */}
        <section className="py-16 px-6 bg-[#F8F7F4]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-sm font-bold tracking-[0.22em] uppercase text-[#C9A84C] mb-3">Part of the Pilot Structure</p>
              <h2 className="text-3xl font-bold text-[#0A0F2E] mb-4">Independent Peer Assessment</h2>
              <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
                Every pilot participant completes a structured 28-question independent assessment. Your unfiltered perspective — credibility gaps, competitive concerns, pricing instincts — is captured and used to improve the product and sharpen the go-to-market approach.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {[
                { label: "Before the Pilot", description: "Section A (The Problem Space) establishes your baseline — what the execution gap looks like in your organization before you have experienced the platform.", color: "#6B7280" },
                { label: "After the Pilot", description: "Sections B–F capture your full verdict: product clarity, market viability, gaps, competitive landscape, and whether you would buy or refer.", color: "#0A0F2E" },
                { label: "Becomes Product Intelligence", description: "Responses feed directly into a private analytics dashboard. Patterns across reviewers drive the product roadmap and sharpen messaging.", color: "#2B8A6E" },
              ].map(item => (
                <div key={item.label} className="bg-white border border-[#E8E4DC] rounded-lg p-6" style={{ borderTop: `3px solid ${item.color}` }}>
                  <h3 className="font-bold text-[#0A0F2E] mb-2 text-sm uppercase tracking-wide">{item.label}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
            <div className="bg-white border border-[#E8E4DC] rounded-lg p-8 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <div className="text-xs font-bold tracking-[0.2em] uppercase text-[#C9A84C] mb-2">Independent Assessment</div>
                <h3 className="text-xl font-bold text-[#0A0F2E] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Ready to Share Your Assessment?</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Critical and skeptical feedback is more valuable than a positive review. 28 questions across 6 sections. Estimated 25–35 minutes.</p>
              </div>
              <div className="flex-shrink-0">
                <Button
                  className="bg-[#0A0F2E] hover:bg-[#141B45] text-[#C9A84C] font-bold"
                  onClick={() => { setLocation('/peer-review'); window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }); }}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Begin Peer Assessment
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Pilot Onboarding Preview */}
        <section className="py-14 px-6 bg-[#0A0F2E]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#C9A84C] mb-3">What Happens After You Sign</p>
              <h2 className="text-2xl font-bold text-white mb-3">Your first 90 days, by role.</h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xl mx-auto">
                Every pilot comes with a structured onboarding guide built around the five roles present in every Fortune 1000 pilot — so each person on your team knows exactly what they see, what they own, and what success looks like at day 90.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { phase: 'Days 1–30', label: 'Foundation', color: '#2B8A6E', desc: 'All 10 users onboarded. Integration live. First playbook activation completed.' },
                { phase: 'Days 31–60', label: 'Velocity', color: '#C9A84C', desc: 'Multiple activations with documented outcomes. ROI data capture begins.' },
                { phase: 'Days 61–90', label: 'Proof', color: '#7C6FD4', desc: 'Full activation history. Board brief generated. Renewal case quantified.' },
              ].map((t) => (
                <div key={t.label} style={{ borderTop: `3px solid ${t.color}` }} className="bg-white/5 rounded-xl p-5">
                  <p style={{ color: t.color }} className="text-xs font-bold tracking-widest uppercase mb-1">{t.phase}</p>
                  <p className="text-white font-semibold text-sm mb-2">{t.label}</p>
                  <p className="text-slate-400 text-xs leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <button
                onClick={() => setLocation('/pilot-onboarding')}
                className="inline-flex items-center gap-2 text-[#C9A84C] text-sm font-semibold hover:text-white transition-colors"
              >
                See the full role-by-role onboarding guide
                <svg width={14} height={14} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm font-bold tracking-[0.22em] uppercase text-[#C9A84C] mb-4">We Make Enterprises Fearless.</p>
            <h2 className="text-3xl font-bold text-[#0A0F2E] dark:text-white mb-4" data-testid="heading-cta">
              Ready to Validate Strategic Execution?
            </h2>
            <p className="text-lg text-gray-800 dark:text-slate-300 mb-8">
              Limited to 5 design partners in Q1 2026. Priority given to organizations with recent strategic event pain.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-[#2B8A6E] hover:bg-[#3BAF8A]"
                onClick={() => setLocation('/contact')}
                data-testid="button-cta-apply"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Apply for Pilot Program
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-[#E8E4DC] text-[#0A0F2E] hover:bg-[#0A0F2E] hover:text-white"
                onClick={() => setLocation('/investors')}
                data-testid="button-cta-positioning"
              >
                <FileText className="w-5 h-5 mr-2" />
                View Investor &amp; Partner Overview
              </Button>
            </div>
            <p className="text-sm text-gray-800 dark:text-slate-300 mt-6">
              Questions? Contact us at <span className="text-[#0A0F2E] dark:text-[#C9A84C]">pilot@vaughnmartin.com</span>
            </p>
            <p className="text-sm text-gray-500 mt-3">
              Want platform access without a pilot commitment?{" "}
              <button
                onClick={() => setLocation('/request-access')}
                className="text-[#C9A84C] underline underline-offset-2 bg-transparent border-none cursor-pointer p-0 font-medium"
              >
                Request executive access →
              </button>
            </p>
          </div>
        </section>

      </div>
    </PageLayout>
  );
}
