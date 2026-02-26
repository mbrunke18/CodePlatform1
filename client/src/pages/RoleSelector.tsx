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
  Compass
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
  accentColor: string;
  iconBg: string;
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
    accentColor: 'border-l-[#2B8A6E]',
    iconBg: 'bg-[#2B8A6E]/15 text-[#2B8A6E]'
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
    accentColor: 'border-l-[#2B8A6E]',
    iconBg: 'bg-[#2B8A6E]/15 text-[#2B8A6E]'
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
    accentColor: 'border-l-[#2B8A6E]',
    iconBg: 'bg-[#2B8A6E]/15 text-[#2B8A6E]'
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
    accentColor: 'border-l-[#2B8A6E]',
    iconBg: 'bg-[#2B8A6E]/15 text-[#2B8A6E]'
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
    accentColor: 'border-l-[#C9A84C]',
    iconBg: 'bg-[#C9A84C]/15 text-[#C9A84C]'
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
    accentColor: 'border-l-[#0A0F2E]',
    iconBg: 'bg-[#0A0F2E]/15 text-[#0A0F2E]'
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
    accentColor: 'border-l-[#2B8A6E]',
    iconBg: 'bg-[#2B8A6E]/15 text-[#2B8A6E]'
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
    accentColor: 'border-l-[#C9A84C]',
    iconBg: 'bg-[#C9A84C]/15 text-[#C9A84C]'
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
    accentColor: 'border-l-[#C9A84C]',
    iconBg: 'bg-[#C9A84C]/15 text-[#C9A84C]'
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
    accentColor: 'border-l-[#C9A84C]',
    iconBg: 'bg-[#C9A84C]/15 text-[#C9A84C]'
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
    accentColor: 'border-l-[#2B8A6E]',
    iconBg: 'bg-[#2B8A6E]/15 text-[#2B8A6E]'
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
    accentColor: 'border-l-[#2B8A6E]',
    iconBg: 'bg-[#2B8A6E]/15 text-[#2B8A6E]'
  }
];

const categoryBadge = (cat: string) => {
  if (cat === 'OFFENSE') return 'bg-[#2B8A6E]/15 text-[#2B8A6E] border-[#2B8A6E]/30';
  if (cat === 'DEFENSE') return 'bg-[#0A0F2E]/15 text-[#0A0F2E] border-[#0A0F2E]/30';
  return 'bg-[#C9A84C]/15 text-[#C9A84C] border-[#C9A84C]/30';
};

const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

export default function RoleSelector({ embedded }: { embedded?: boolean }) {
  return (
    <PageLayout embedded={embedded}>
      <div className="min-h-screen bg-white text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="w-8 h-8 text-[#2B8A6E]" />
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Your Execution OS Workspace
              </h1>
            </div>
            <p className="text-lg md:text-xl text-gray-800 max-w-3xl mx-auto mb-6">
              Select your role to configure Execution OS with the playbooks, signals, and dashboards most relevant to your responsibilities.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-800">
              <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-[#2B8A6E]" /> Personalized workspace</span>
              <span className="flex items-center gap-1.5"><Target className="w-4 h-4 text-[#0A0F2E]" /> Role-specific playbooks</span>
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-[#C9A84C]" /> Tailored signal feeds</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {roleConfigs.map(config => {
              const Icon = config.icon;
              return (
                <Link key={config.id} href={`/experience/${config.id}`}>
                  <Card className={`bg-white border-[#E8E4DC] border-l-4 ${config.accentColor} transition-all duration-300 cursor-pointer hover:bg-[#F8F7F4] hover:border-[#C9A84C] h-full rounded-none`}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-none ${config.iconBg}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-[#0A0F2E] text-lg uppercase tracking-tight">{config.id}</div>
                            <div className="text-sm text-[#6B7280]">{config.title}</div>
                          </div>
                        </div>
                        <Badge className={`text-[10px] border rounded-none ${categoryBadge(config.category)}`}>
                          {config.category}
                        </Badge>
                      </div>

                      <p className="text-sm text-[#0A0F2E] italic mb-4 min-h-[48px] leading-relaxed">
                        "{config.hookQuestion}"
                      </p>

                      <div className="border-t border-[#E8E4DC] pt-3 mb-4">
                        <div className="text-[10px] uppercase tracking-wider text-[#6B7280] mb-1">Your Execution OS Impact</div>
                        <div className="text-sm font-semibold text-[#2B8A6E]">{config.keyMetric}</div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-[#0A0F2E] font-bold uppercase tracking-widest" style={{ fontSize: 9 }}>
                          <Compass className="w-3 h-3 inline mr-1" />Configure Workspace
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#0A0F2E]" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          <div className="mt-16 text-center">
            <Card className="bg-white border-[#E8E4DC] p-8 max-w-3xl mx-auto rounded-none">
              <h3 style={{...CG}} className="text-2xl font-bold mb-3 text-[#0A0F2E]">Not sure which role to start with?</h3>
              <p className="text-[#6B7280] mb-6">
                Jump straight into the Command Center — select any playbook and experience the full coordination workflow.
              </p>
              <Link href="/command-center">
                <Button size="lg" className="bg-[#0A0F2E] hover:bg-[#141B45] text-white px-8 rounded-none">
                  <Compass className="w-5 h-5 mr-2" />
                  Open Command Center
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
