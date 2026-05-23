import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Link } from 'wouter';
import { 
  Building2, 
  Target, 
  Layers, 
  BarChart3, 
  Settings,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface EmptyConfigStateProps {
  type: 'departments' | 'stakeholders' | 'triggers' | 'playbooks' | 'metrics' | 'general';
  title?: string;
  description?: string;
  actionPath?: string;
  actionLabel?: string;
}

const configInfo = {
  departments: {
    icon: Building2,
    title: 'No Departments Configured',
    description: 'Add your organizational departments to enable team coordination during Readiness Protocol execution.',
    actionPath: '/organization-setup',
    actionLabel: 'Configure Organization',
    color: 'text-[#0A0F2E]',
    bgColor: 'bg-[#0A0F2E]/10',
  },
  stakeholders: {
    icon: Building2,
    title: 'No Stakeholders Configured',
    description: 'Add your key decision-makers and team leads to enable approval workflows and notifications.',
    actionPath: '/organization-setup',
    actionLabel: 'Add Stakeholders',
    color: 'text-[#C9A84C]',
    bgColor: 'bg-[#C9A84C]/10',
  },
  triggers: {
    icon: Target,
    title: 'No Triggers Configured',
    description: 'Set up intelligence monitoring thresholds to automatically detect strategic situations.',
    actionPath: '/triggers-management',
    actionLabel: 'Configure Triggers',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  playbooks: {
    icon: Layers,
    title: 'No Readiness Protocols Customized',
    description: 'Customize Readiness Protocols from our library of 180 templates to match your organization\'s processes.',
    actionPath: '/playbook-customization',
    actionLabel: 'Customize Readiness Protocols',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  metrics: {
    icon: BarChart3,
    title: 'No Success Metrics Defined',
    description: 'Define your KPIs and targets to measure strategic execution effectiveness.',
    actionPath: '/success-metrics',
    actionLabel: 'Set Metrics',
    color: 'text-[#0A0F2E]',
    bgColor: 'bg-[#0A0F2E]/10',
  },
  general: {
    icon: Settings,
    title: 'Configuration Required',
    description: 'Complete your Readiness OS platform setup to unlock full strategic execution capabilities.',
    actionPath: '/onboarding',
    actionLabel: 'Start Setup',
    color: 'text-[#2B8A6E]',
    bgColor: 'bg-[#2B8A6E]/10',
  },
};

export default function EmptyConfigState({ 
  type, 
  title, 
  description, 
  actionPath, 
  actionLabel 
}: EmptyConfigStateProps) {
  const info = configInfo[type];
  const Icon = info.icon;
  
  return (
    <Card className="border-dashed border-2 border-gray-200 bg-white">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className={`w-16 h-16 ${info.bgColor} flex items-center justify-center mb-4`}>
          <Icon className={`h-8 w-8 ${info.color}`} />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">
          {title || info.title}
        </h3>
        <p className="text-slate-600 dark:text-slate-200 mb-6 max-w-md">
          {description || info.description}
        </p>
        <Link href={actionPath || info.actionPath}>
          <Button className="bg-gradient-to-r from-[#0A0F2E] to-[#141B45] hover:from-[#0A0F2E] hover:to-[#141B45]">
            <Sparkles className="h-4 w-4 mr-2" />
            {actionLabel || info.actionLabel}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export function QuickSetupBanner() {
  return (
    <Card className="bg-gradient-to-r   border-[#2B8A6E]/30">
      <CardContent className="flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-[#0A0F2E]" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Complete Your Setup</h3>
            <p className="text-sm text-gray-600">Configure Readiness OS for your organization in a single session</p>
          </div>
        </div>
        <Link href="/onboarding">
          <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
            Start Setup Wizard
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
