import StandardNav from '@/components/layout/StandardNav';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Sparkles
} from 'lucide-react';

type Role = 'CEO' | 'CFO' | 'COO' | 'CMO' | 'CTO' | 'CISO' | 'CHRO' | 'CDO' | 'GC' | 'CCO' | 'CSO' | 'CRO';

interface RoleConfig {
  id: Role;
  title: string;
  icon: any;
  color: string;
  hookQuestion: string;
  keyMetric: string;
  demoPath: string;
  gradient: string;
  borderColor: string;
}

const roleConfigs: RoleConfig[] = [
  {
    id: 'CEO',
    title: 'Chief Executive Officer',
    icon: Briefcase,
    color: 'blue',
    hookQuestion: "What percentage of your strategic initiatives actually deliver on time and on budget?",
    keyMetric: "$144M execution gap → 12-minute coordination",
    demoPath: '/demo/competitive-response',
    gradient: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-blue-900/30',
    borderColor: 'border-blue-300 dark:border-blue-700/50'
  },
  {
    id: 'CFO',
    title: 'Chief Financial Officer',
    icon: DollarSign,
    color: 'green',
    hookQuestion: "What's your company's biggest untracked expense that doesn't show up on any line item?",
    keyMetric: "$114M Year 1 ROI, 6.3 week payback",
    demoPath: '/demo/ma-integration',
    gradient: 'bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 dark:from-green-900/30 dark:via-emerald-900/30 dark:to-green-900/30',
    borderColor: 'border-green-300 dark:border-green-700/50'
  },
  {
    id: 'COO',
    title: 'Chief Operating Officer',
    icon: Settings,
    color: 'orange',
    hookQuestion: "When was the last time you executed your continuity plan at the speed it assumes?",
    keyMetric: "72 hours → 12 minutes, $2.1M saved",
    demoPath: '/demo/supplier-crisis',
    gradient: 'bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 dark:from-orange-900/30 dark:via-amber-900/30 dark:to-orange-900/30',
    borderColor: 'border-orange-300 dark:border-orange-700/50'
  },
  {
    id: 'CMO',
    title: 'Chief Marketing Officer',
    icon: TrendingUp,
    color: 'purple',
    hookQuestion: "Competitor launches a product tomorrow. How long until your counter-campaign is in market?",
    keyMetric: "21 days → 3 days, $12M market share saved",
    demoPath: '/demo/competitive-response',
    gradient: 'bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-purple-900/30',
    borderColor: 'border-purple-300 dark:border-purple-700/50'
  },
  {
    id: 'CTO',
    title: 'Chief Technology Officer',
    icon: Server,
    color: 'cyan',
    hookQuestion: "CEO announces digital transformation Monday. How long until 6 teams are coordinating?",
    keyMetric: "36 → 22 months, $12M ROI, 82% adoption",
    demoPath: '/demo/product-launch',
    gradient: 'bg-gradient-to-br from-cyan-50 via-blue-50 to-cyan-50 dark:from-cyan-900/30 dark:via-blue-900/30 dark:to-cyan-900/30',
    borderColor: 'border-cyan-300 dark:border-cyan-700/50'
  },
  {
    id: 'CISO',
    title: 'Chief Information Security Officer',
    icon: Shield,
    color: 'red',
    hookQuestion: "Breach detected at 2 AM. How long until 6 teams are executing coordinated response?",
    keyMetric: "8 hours → 47 minutes, breach contained",
    demoPath: '/demo/ransomware',
    gradient: 'bg-gradient-to-br from-red-50 via-orange-50 to-red-50 dark:from-red-900/30 dark:via-orange-900/30 dark:to-red-900/30',
    borderColor: 'border-red-300 dark:border-red-700/50'
  },
  {
    id: 'CHRO',
    title: 'Chief Human Resources Officer',
    icon: Users,
    color: 'pink',
    hookQuestion: "What's the #1 reason your top performers give in exit interviews?",
    keyMetric: "85% engagement, $2.1M saved, 40% faster",
    demoPath: '/demo/ma-integration',
    gradient: 'bg-gradient-to-br from-pink-50 via-rose-50 to-pink-50 dark:from-pink-900/30 dark:via-rose-900/30 dark:to-pink-900/30',
    borderColor: 'border-pink-300 dark:border-pink-700/50'
  },
  {
    id: 'CDO',
    title: 'Chief Data Officer',
    icon: Database,
    color: 'indigo',
    hookQuestion: "Your data signals 'churn risk.' How long until the organization acts on that insight?",
    keyMetric: "14 days → 2 hours, 92% customer save rate",
    demoPath: '/demo/customer-crisis',
    gradient: 'bg-gradient-to-br from-indigo-50 via-violet-50 to-indigo-50 dark:from-indigo-900/30 dark:via-violet-900/30 dark:to-indigo-900/30',
    borderColor: 'border-indigo-300 dark:border-indigo-700/50'
  },
  {
    id: 'GC',
    title: 'General Counsel',
    icon: Scale,
    color: 'slate',
    hookQuestion: "Regulatory change Friday afternoon. How long until organization executes compliance?",
    keyMetric: "5 weeks → 10 days, deadline met easily",
    demoPath: '/demo/regulatory-crisis',
    gradient: 'bg-gradient-to-br from-slate-50 via-gray-50 to-slate-50 dark:from-slate-900/30 dark:via-gray-900/30 dark:to-slate-900/30',
    borderColor: 'border-slate-300 dark:border-slate-700/50'
  },
  {
    id: 'CCO',
    title: 'Chief Compliance Officer',
    icon: FileCheck,
    color: 'teal',
    hookQuestion: "Audit notification arrives Monday. How long to get coordinated responses from 6 teams?",
    keyMetric: "10 days → 2 days, stress eliminated",
    demoPath: '/demo/regulatory-crisis',
    gradient: 'bg-gradient-to-br from-teal-50 via-cyan-50 to-teal-50 dark:from-teal-900/30 dark:via-cyan-900/30 dark:to-teal-900/30',
    borderColor: 'border-teal-300 dark:border-teal-700/50'
  },
  {
    id: 'CSO',
    title: 'Chief Strategy Officer',
    icon: Target,
    color: 'violet',
    hookQuestion: "Six months later, how much of your strategy is actually executing as planned?",
    keyMetric: "70% → 95% delivery, $144M gap closed",
    demoPath: '/demo/ma-integration',
    gradient: 'bg-gradient-to-br from-violet-50 via-purple-50 to-violet-50 dark:from-violet-900/30 dark:via-purple-900/30 dark:to-violet-900/30',
    borderColor: 'border-violet-300 dark:border-violet-700/50'
  },
  {
    id: 'CRO',
    title: 'Chief Revenue Officer',
    icon: TrendingUp,
    color: 'emerald',
    hookQuestion: "What's your average time from 'customer requests proposal' to 'proposal delivered'?",
    keyMetric: "21 days → 5 days, +5% win rate, $44M revenue",
    demoPath: '/demo/competitive-response',
    gradient: 'bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-50 dark:from-emerald-900/30 dark:via-green-900/30 dark:to-emerald-900/30',
    borderColor: 'border-emerald-300 dark:border-emerald-700/50'
  }
];

function RoleCard({ config }: { config: RoleConfig }) {
  const Icon = config.icon;
  
  return (
    <Link href={config.demoPath}>
      <Card 
        className={`${config.gradient} ${config.borderColor} hover:scale-105 transition-all cursor-pointer h-full`}
        data-testid={`card-role-${config.id.toLowerCase()}`}
      >
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <Icon className={`h-8 w-8 text-${config.color}-500`} />
            <div>
              <CardTitle className="text-xl" data-testid={`text-role-title-${config.id.toLowerCase()}`}>
                {config.title}
              </CardTitle>
              <Badge variant="outline" className="mt-1" data-testid={`badge-role-${config.id.toLowerCase()}`}>
                {config.id}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="min-h-[80px]">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100 italic" data-testid={`text-hook-${config.id.toLowerCase()}`}>
              "{config.hookQuestion}"
            </p>
          </div>
          
          <div className="pt-4 border-t border-slate-300 dark:border-slate-700">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Your M Impact:</div>
            <div className="text-base font-bold text-green-600 dark:text-green-400" data-testid={`text-metric-${config.id.toLowerCase()}`}>
              {config.keyMetric}
            </div>
          </div>

          <Button 
            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            data-testid={`button-demo-${config.id.toLowerCase()}`}
          >
            See Your Demo
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function RoleSelector() {
  return (
    <div className="page-background min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Sparkles className="h-12 w-12 text-purple-500 animate-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Which Executive Role Best Describes You?
            </h1>
            <Sparkles className="h-12 w-12 text-blue-500 animate-pulse" />
          </div>
          <p className="text-2xl text-slate-700 dark:text-slate-400 mb-4">
            See M from Your Perspective
          </p>
          <p className="text-lg text-slate-600 dark:text-slate-500 max-w-3xl mx-auto">
            Select your role below to see a personalized demo showing how M solves your specific coordination challenges and delivers measurable impact for Fortune 1000 executives like you.
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roleConfigs.map(config => (
            <RoleCard key={config.id} config={config} />
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r .section-background dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-lg p-8 border border-blue-200 dark:border-blue-800/50">
            <h3 className="text-2xl font-bold mb-4">Not Sure Which Demo to Try?</h3>
            <p className="text-lg text-slate-700 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
              Browse all 7 scenario-based demos to see M in action across different strategic situations.
            </p>
            <Link href="/demo-selector">
              <Button 
                size="lg" 
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
                data-testid="button-browse-scenarios"
              >
                Browse All Scenarios
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
