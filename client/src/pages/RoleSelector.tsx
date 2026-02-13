import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PageLayout from '@/components/layout/PageLayout';
import {
  Briefcase,
  DollarSign,
  Settings,
  TrendingUp,
  Server,
  Shield,
  Users,
  Scale,
  Database,
  FileCheck,
  Target,
  ArrowRight,
  Zap,
  Play
} from 'lucide-react';

interface RoleConfig {
  id: string;
  title: string;
  icon: any;
  hookQuestion: string;
  keyMetric: string;
  playbook: string;
  playbookLabel: string;
  category: 'OFFENSE' | 'DEFENSE' | 'SPECIAL TEAMS';
  gradient: string;
  borderColor: string;
  iconColor: string;
}

const roleConfigs: RoleConfig[] = [
  {
    id: 'ceo',
    title: 'Chief Executive Officer',
    icon: Briefcase,
    hookQuestion: "What percentage of your strategic initiatives actually deliver on time and on budget?",
    keyMetric: "$144M execution gap → 12-minute coordination",
    playbook: 'ma-day1',
    playbookLabel: 'M&A Day 1 Integration',
    category: 'OFFENSE',
    gradient: 'from-blue-500/10 to-indigo-500/10',
    borderColor: 'border-blue-500/30 hover:border-blue-500/60',
    iconColor: 'text-blue-400'
  },
  {
    id: 'cfo',
    title: 'Chief Financial Officer',
    icon: DollarSign,
    hookQuestion: "What's your company's biggest untracked expense that doesn't show up on any line item?",
    keyMetric: "$114M Year 1 ROI, 6.3 week payback",
    playbook: 'ma-day1',
    playbookLabel: 'M&A Day 1 Integration',
    category: 'OFFENSE',
    gradient: 'from-emerald-500/10 to-green-500/10',
    borderColor: 'border-emerald-500/30 hover:border-emerald-500/60',
    iconColor: 'text-emerald-400'
  },
  {
    id: 'coo',
    title: 'Chief Operating Officer',
    icon: Settings,
    hookQuestion: "When was the last time you executed your continuity plan at the speed it assumes?",
    keyMetric: "72 hours → 12 minutes, $2.1M saved",
    playbook: 'ma-day1',
    playbookLabel: 'M&A Day 1 Integration',
    category: 'OFFENSE',
    gradient: 'from-amber-500/10 to-orange-500/10',
    borderColor: 'border-amber-500/30 hover:border-amber-500/60',
    iconColor: 'text-amber-400'
  },
  {
    id: 'cmo',
    title: 'Chief Marketing Officer',
    icon: TrendingUp,
    hookQuestion: "Competitor launches a product tomorrow. How long until your counter-campaign is in market?",
    keyMetric: "21 days → 3 days, $12M market share saved",
    playbook: 'ma-day1',
    playbookLabel: 'M&A Day 1 Integration',
    category: 'OFFENSE',
    gradient: 'from-purple-500/10 to-pink-500/10',
    borderColor: 'border-purple-500/30 hover:border-purple-500/60',
    iconColor: 'text-purple-400'
  },
  {
    id: 'cto',
    title: 'Chief Technology Officer',
    icon: Server,
    hookQuestion: "CEO announces digital transformation Monday. How long until 6 teams are coordinating?",
    keyMetric: "36 → 22 months, $12M ROI, 82% adoption",
    playbook: 'ai-governance',
    playbookLabel: 'AI Governance Framework',
    category: 'SPECIAL TEAMS',
    gradient: 'from-cyan-500/10 to-blue-500/10',
    borderColor: 'border-cyan-500/30 hover:border-cyan-500/60',
    iconColor: 'text-cyan-400'
  },
  {
    id: 'ciso',
    title: 'Chief Information Security Officer',
    icon: Shield,
    hookQuestion: "Breach detected at 2 AM. How long until 6 teams are executing coordinated response?",
    keyMetric: "8 hours → 47 minutes, breach contained",
    playbook: 'ransomware',
    playbookLabel: 'Ransomware Response',
    category: 'DEFENSE',
    gradient: 'from-red-500/10 to-rose-500/10',
    borderColor: 'border-red-500/30 hover:border-red-500/60',
    iconColor: 'text-red-400'
  },
  {
    id: 'chro',
    title: 'Chief Human Resources Officer',
    icon: Users,
    hookQuestion: "What's the #1 reason your top performers give in exit interviews?",
    keyMetric: "85% engagement, $2.1M saved, 40% faster",
    playbook: 'ma-day1',
    playbookLabel: 'M&A Day 1 Integration',
    category: 'OFFENSE',
    gradient: 'from-pink-500/10 to-rose-500/10',
    borderColor: 'border-pink-500/30 hover:border-pink-500/60',
    iconColor: 'text-pink-400'
  },
  {
    id: 'cdo',
    title: 'Chief Data Officer',
    icon: Database,
    hookQuestion: "Your data signals 'churn risk.' How long until the organization acts on that insight?",
    keyMetric: "14 days → 2 hours, 92% customer save rate",
    playbook: 'ai-governance',
    playbookLabel: 'AI Governance Framework',
    category: 'SPECIAL TEAMS',
    gradient: 'from-indigo-500/10 to-violet-500/10',
    borderColor: 'border-indigo-500/30 hover:border-indigo-500/60',
    iconColor: 'text-indigo-400'
  },
  {
    id: 'gc',
    title: 'General Counsel',
    icon: Scale,
    hookQuestion: "Regulatory change Friday afternoon. How long until organization executes compliance?",
    keyMetric: "5 weeks → 10 days, deadline met easily",
    playbook: 'ai-governance',
    playbookLabel: 'AI Governance Framework',
    category: 'SPECIAL TEAMS',
    gradient: 'from-slate-500/10 to-gray-500/10',
    borderColor: 'border-slate-500/30 hover:border-slate-500/60',
    iconColor: 'text-slate-400'
  },
  {
    id: 'cco',
    title: 'Chief Compliance Officer',
    icon: FileCheck,
    hookQuestion: "Audit notification arrives Monday. How long to get coordinated responses from 6 teams?",
    keyMetric: "10 days → 2 days, stress eliminated",
    playbook: 'ai-governance',
    playbookLabel: 'AI Governance Framework',
    category: 'SPECIAL TEAMS',
    gradient: 'from-teal-500/10 to-cyan-500/10',
    borderColor: 'border-teal-500/30 hover:border-teal-500/60',
    iconColor: 'text-teal-400'
  },
  {
    id: 'cso',
    title: 'Chief Strategy Officer',
    icon: Target,
    hookQuestion: "Six months later, how much of your strategy is actually executing as planned?",
    keyMetric: "70% → 95% delivery, $144M gap closed",
    playbook: 'ma-day1',
    playbookLabel: 'M&A Day 1 Integration',
    category: 'OFFENSE',
    gradient: 'from-violet-500/10 to-purple-500/10',
    borderColor: 'border-violet-500/30 hover:border-violet-500/60',
    iconColor: 'text-violet-400'
  },
  {
    id: 'cro',
    title: 'Chief Revenue Officer',
    icon: TrendingUp,
    hookQuestion: "What's your average time from 'customer requests proposal' to 'proposal delivered'?",
    keyMetric: "21 days → 5 days, +5% win rate, $44M revenue",
    playbook: 'ma-day1',
    playbookLabel: 'M&A Day 1 Integration',
    category: 'OFFENSE',
    gradient: 'from-emerald-500/10 to-teal-500/10',
    borderColor: 'border-emerald-500/30 hover:border-emerald-500/60',
    iconColor: 'text-emerald-400'
  }
];

const categoryBadge = (cat: string) => {
  if (cat === 'OFFENSE') return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
  if (cat === 'DEFENSE') return 'bg-red-500/10 text-red-400 border-red-500/20';
  return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
};

export default function RoleSelector() {
  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="w-8 h-8 text-emerald-400" />
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Experience ExecuteIQ From Your Perspective
              </h1>
            </div>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-6">
              Select your role to see a personalized live activation demo showing how ExecuteIQ solves your specific coordination challenges.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-emerald-400" /> Live 12-minute demo</span>
              <span className="flex items-center gap-1.5"><Target className="w-4 h-4 text-blue-400" /> Role-specific context</span>
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-purple-400" /> Real stakeholder coordination</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {roleConfigs.map(config => {
              const Icon = config.icon;
              return (
                <Link key={config.id} href={`/activation?playbook=${config.playbook}&role=${config.id}`}>
                  <Card className={`bg-gradient-to-br ${config.gradient} border ${config.borderColor} transition-all duration-300 cursor-pointer hover:scale-[1.02] h-full`}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-lg bg-gray-900/60 ${config.iconColor}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-white text-lg">{config.id.toUpperCase()}</div>
                            <div className="text-xs text-gray-400">{config.title}</div>
                          </div>
                        </div>
                        <Badge className={`text-[10px] border ${categoryBadge(config.category)}`}>
                          {config.category}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-300 italic mb-4 min-h-[48px] leading-relaxed">
                        "{config.hookQuestion}"
                      </p>

                      <div className="border-t border-white/10 pt-3 mb-4">
                        <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Your ExecuteIQ Impact</div>
                        <div className="text-sm font-semibold text-emerald-400">{config.keyMetric}</div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-[10px] text-gray-500">
                          <Play className="w-3 h-3 inline mr-1" />{config.playbookLabel}
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-500" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          <div className="mt-16 text-center">
            <Card className="bg-gray-900 border-gray-800 p-8 max-w-3xl mx-auto">
              <h3 className="text-xl font-bold mb-3">Not sure which role to pick?</h3>
              <p className="text-gray-400 mb-6">
                Try the Live Activation Command Center directly — choose any playbook and watch the full coordination unfold.
              </p>
              <Link href="/activation">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white px-8">
                  <Zap className="w-5 h-5 mr-2" />
                  Go to Live Activation
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
