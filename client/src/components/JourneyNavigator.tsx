import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Rocket, 
  Building2, 
  ClipboardList, 
  Radar, 
  Compass, 
  TrendingUp,
  BarChart3,
  CheckCircle,
  Circle,
  ChevronRight,
  Clock
} from 'lucide-react';

interface JourneyPhase {
  id: string;
  number: number;
  name: string;
  subtitle: string;
  description: string;
  timeline: string;
  workspace: string;
  workspacePath: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  milestones: string[];
  status: 'completed' | 'current' | 'upcoming';
}

const journeyPhases: JourneyPhase[] = [
  {
    id: 'discovery',
    number: 1,
    name: 'Discovery',
    subtitle: 'Explore & Evaluate',
    description: 'Experience Execution OS through demos, calculate ROI, and define pilot scope',
    timeline: 'Week 1-2',
    workspace: 'Demo Gallery',
    workspacePath: '/try-demo',
    icon: Rocket,
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
    milestones: ['Executive sponsor identified', 'Pilot scope defined', 'ROI targets established'],
    status: 'completed'
  },
  {
    id: 'onboarding',
    number: 2,
    name: 'Onboarding',
    subtitle: 'Setup & Configure',
    description: 'Configure your organization, connect integrations, and invite your team',
    timeline: 'Days 1-30',
    workspace: 'Organization Setup',
    workspacePath: '/organization-setup',
    icon: Building2,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    milestones: ['Organization profile complete', 'SSO configured', 'Team members invited', 'Integrations connected'],
    status: 'current'
  },
  {
    id: 'identify',
    number: 3,
    name: 'IDENTIFY',
    subtitle: 'Execution OS Playbook™',
    description: 'Select playbooks, map stakeholders, and establish your strategic readiness baseline',
    timeline: 'Days 30-45',
    workspace: 'Playbook Factory',
    workspacePath: '/workspaces/identify',
    icon: ClipboardList,
    color: 'text-poise-gold',
    bgColor: 'bg-poise-gold/10',
    milestones: ['Priority playbooks selected', 'Stakeholders mapped', 'Readiness score baseline', 'Tasks assigned'],
    status: 'upcoming'
  },
  {
    id: 'detect',
    number: 4,
    name: 'DETECT',
    subtitle: 'Execution OS Signal™',
    description: 'Configure AI-powered trigger monitoring and alert routing',
    timeline: 'Days 45-60',
    workspace: 'Signal Ops',
    workspacePath: '/workspaces/detect',
    icon: Radar,
    color: 'text-poise-teal',
    bgColor: 'bg-poise-teal/10',
    milestones: ['Trigger catalogue published', 'AI thresholds tuned', 'Alert routing configured', 'Signal sources connected'],
    status: 'upcoming'
  },
  {
    id: 'execute',
    number: 5,
    name: 'EXECUTE',
    subtitle: 'Execution OS Compass™',
    description: 'Run practice drills and prove 12-minute response capability',
    timeline: 'Days 60-75',
    workspace: 'Compass Command',
    workspacePath: '/workspaces/execute',
    icon: Compass,
    color: 'text-poise-teal',
    bgColor: 'bg-poise-teal/10',
    milestones: ['First drill completed', 'Command center staffed', '12-minute SLA proven', 'Live response executed'],
    status: 'upcoming'
  },
  {
    id: 'advance',
    number: 6,
    name: 'ADVANCE',
    subtitle: 'Execution OS Retrospect™',
    description: 'Capture lessons learned and refine playbooks for continuous improvement',
    timeline: 'Days 75-90',
    workspace: 'Retrospect Lab',
    workspacePath: '/workspaces/advance',
    icon: TrendingUp,
    color: 'text-poise-gold',
    bgColor: 'bg-poise-gold/10',
    milestones: ['First retrospective completed', 'Playbook refinements captured', 'Decision velocity measured', 'Executive readout delivered'],
    status: 'upcoming'
  },
  {
    id: 'continuous',
    number: 7,
    name: 'Continuous Value',
    subtitle: 'Ongoing Excellence',
    description: 'Expand coverage, track organizational maturity, and realize strategic ROI',
    timeline: 'Ongoing',
    workspace: 'Execution OS One™',
    workspacePath: '/mission-control',
    icon: BarChart3,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    milestones: ['Cross-team adoption', 'Quarterly strategy reviews', 'Maturity advancement', 'ROI realization'],
    status: 'upcoming'
  }
];

interface JourneyNavigatorProps {
  variant?: 'full' | 'compact' | 'card';
  currentPhase?: string;
}

export default function JourneyNavigator({ variant = 'full', currentPhase }: JourneyNavigatorProps) {
  const completedPhases = journeyPhases.filter(p => p.status === 'completed').length;
  const totalPhases = journeyPhases.length;
  const progressPercent = (completedPhases / totalPhases) * 100;

  if (variant === 'card') {
    const current = journeyPhases.find(p => p.status === 'current') || journeyPhases[0];
    return (
      <Link href="/north-star">
        <Card className="hover:shadow-lg transition-all cursor-pointer group border-poise-teal/30 bg-gradient-to-br from-poise-teal/5 to-cyan-500/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-poise-teal/20">
                  <Compass className="h-5 w-5 text-poise-teal" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Execution OS North Star™</h3>
                  <p className="text-sm text-slate-300">Phase {current.number} of {totalPhases}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-200 group-hover:text-poise-teal transition-colors" />
            </div>
            <Progress value={progressPercent} className="h-2 mb-3" />
            <div className="flex items-center gap-2">
              <Badge className={`${current.bgColor} ${current.color} border-0`}>
                {current.name}
              </Badge>
              <span className="text-sm text-slate-300">{current.subtitle}</span>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {journeyPhases.map((phase, index) => (
          <Link key={phase.id} href={phase.workspacePath}>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap cursor-pointer transition-all ${
              phase.status === 'current' 
                ? `${phase.bgColor} border-2 border-current ${phase.color}` 
                : phase.status === 'completed'
                  ? 'bg-emerald-500/10 text-emerald-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}>
              {phase.status === 'completed' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <phase.icon className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">{phase.name}</span>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Execution OS North Star™ Journey</h2>
          <p className="text-gray-600 dark:text-slate-300">Your path from discovery to continuous strategic excellence</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-poise-teal">{completedPhases}/{totalPhases}</div>
          <p className="text-sm text-slate-300">Phases Complete</p>
        </div>
      </div>

      <Progress value={progressPercent} className="h-3" />

      <div className="grid gap-4">
        {journeyPhases.map((phase) => (
          <Link key={phase.id} href={phase.workspacePath}>
            <Card className={`hover:shadow-lg transition-all cursor-pointer group ${
              phase.status === 'current' 
                ? 'border-2 border-poise-teal shadow-lg shadow-poise-teal/10' 
                : phase.status === 'completed'
                  ? 'border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-900/10'
                  : 'opacity-70 hover:opacity-100'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`relative flex-shrink-0`}>
                    <div className={`p-3 rounded-xl ${phase.status === 'completed' ? 'bg-emerald-500/20' : phase.bgColor}`}>
                      {phase.status === 'completed' ? (
                        <CheckCircle className="h-6 w-6 text-emerald-600" />
                      ) : (
                        <phase.icon className={`h-6 w-6 ${phase.color}`} />
                      )}
                    </div>
                    <div className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      phase.status === 'completed' 
                        ? 'bg-emerald-500 text-white' 
                        : phase.status === 'current'
                          ? 'bg-poise-teal text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-gray-600 dark:text-slate-300'
                    }`}>
                      {phase.number}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-poise-teal transition-colors">
                        {phase.name}
                      </h3>
                      <Badge variant="outline" className={phase.color}>
                        {phase.subtitle}
                      </Badge>
                      {phase.status === 'current' && (
                        <Badge className="bg-poise-teal text-white">Current Phase</Badge>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-slate-300 mb-3">{phase.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-slate-300">
                        <Clock className="h-4 w-4" />
                        {phase.timeline}
                      </div>
                      <div className="flex items-center gap-1 text-slate-300">
                        <phase.icon className="h-4 w-4" />
                        {phase.workspace}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {phase.milestones.map((milestone, idx) => (
                        <div key={idx} className="flex items-center gap-1 text-xs text-slate-300">
                          {phase.status === 'completed' ? (
                            <CheckCircle className="h-3 w-3 text-emerald-500" />
                          ) : (
                            <Circle className="h-3 w-3" />
                          )}
                          {milestone}
                        </div>
                      ))}
                    </div>
                  </div>

                  <ChevronRight className="h-5 w-5 text-slate-200 group-hover:text-poise-teal transition-colors flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
