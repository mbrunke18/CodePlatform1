import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Shield,
  Lock,
  Eye,
  CheckCircle,
  Scale,
  Users,
  Leaf,
  HelpCircle,
  Brain,
} from 'lucide-react';

export interface AIPrincipleScore {
  principle: string;
  score: number;
  description: string;
  icon: keyof typeof PRINCIPLE_ICONS;
}

const PRINCIPLE_ICONS = {
  safety: Shield,
  privacy: Lock,
  transparency: Eye,
  reliability: CheckCircle,
  fairness: Scale,
  accountability: Users,
  sustainability: Leaf,
  contestability: HelpCircle,
  humanAgency: Brain,
};

export const FOUNDATIONAL_AI_PRINCIPLES: AIPrincipleScore[] = [
  {
    principle: 'Safety & Security',
    score: 95,
    description: 'AI systems designed with robust safeguards against harmful outputs and security vulnerabilities',
    icon: 'safety',
  },
  {
    principle: 'Data Privacy',
    score: 92,
    description: 'Strong data protection measures ensuring personal and sensitive data is handled responsibly',
    icon: 'privacy',
  },
  {
    principle: 'Explainability & Transparency',
    score: 88,
    description: 'AI decisions can be understood and explained to stakeholders and regulators',
    icon: 'transparency',
  },
  {
    principle: 'Validity & Reliability',
    score: 94,
    description: 'AI outputs are accurate, consistent, and dependable across operating conditions',
    icon: 'reliability',
  },
  {
    principle: 'Fairness & Bias Detection',
    score: 89,
    description: 'Systems actively monitor and mitigate algorithmic bias and discrimination',
    icon: 'fairness',
  },
  {
    principle: 'Accountability',
    score: 96,
    description: 'Clear ownership and responsibility chains for AI decisions and outcomes',
    icon: 'accountability',
  },
  {
    principle: 'Sustainability',
    score: 82,
    description: 'AI systems designed for energy efficiency and minimal environmental impact',
    icon: 'sustainability',
  },
  {
    principle: 'Contestability',
    score: 85,
    description: 'Mechanisms for individuals to challenge AI decisions that affect them',
    icon: 'contestability',
  },
  {
    principle: 'Human Agency & Autonomy',
    score: 98,
    description: 'AI augments human decision-making while preserving human control and oversight',
    icon: 'humanAgency',
  },
];

function getScoreColor(score: number): string {
  if (score >= 90) return 'text-emerald-600 dark:text-emerald-400';
  if (score >= 80) return 'text-blue-600 dark:text-blue-400';
  if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
}

function getProgressColor(score: number): string {
  if (score >= 90) return 'bg-emerald-500';
  if (score >= 80) return 'bg-blue-500';
  if (score >= 70) return 'bg-yellow-500';
  return 'bg-red-500';
}

interface AIPrinciplesScorecardProps {
  principles?: AIPrincipleScore[];
  compact?: boolean;
  showOverallScore?: boolean;
}

export function AIPrinciplesScorecard({
  principles = FOUNDATIONAL_AI_PRINCIPLES,
  compact = false,
  showOverallScore = true,
}: AIPrinciplesScorecardProps) {
  const overallScore = Math.round(
    principles.reduce((sum, p) => sum + p.score, 0) / principles.length
  );

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Badge 
          variant="outline" 
          className={`${getScoreColor(overallScore)} border-current`}
        >
          <Brain className="w-3 h-3 mr-1" />
          AI Principles: {overallScore}%
        </Badge>
      </div>
    );
  }

  return (
    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Brain className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              AI Principles Alignment
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Based on AI Trends 2026 governance framework
            </p>
          </div>
          {showOverallScore && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Overall Score</span>
              <Badge 
                className={`text-base font-bold px-3 py-1 ${
                  overallScore >= 90 
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' 
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                }`}
              >
                {overallScore}%
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <TooltipProvider>
          <div className="space-y-2">
            {principles.map((principle) => {
              const Icon = PRINCIPLE_ICONS[principle.icon] || Shield;
              return (
                <Tooltip key={principle.principle}>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-help">
                      <Icon className="w-4 h-4 text-violet-600 dark:text-violet-400 flex-shrink-0" />
                      <span className="text-sm flex-1 min-w-0">
                        {principle.principle}
                      </span>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="w-24 hidden sm:block">
                          <Progress 
                            value={principle.score} 
                            className="h-1.5"
                          />
                        </div>
                        <span className={`text-sm font-semibold w-10 text-right ${getScoreColor(principle.score)}`}>
                          {principle.score}%
                        </span>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-xs">
                    <p className="text-sm">{principle.description}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}

export function DeterministicExecutionBadge() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-0 cursor-help"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Deterministic Execution
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="text-sm">
            Unlike autonomous AI agents, M delivers predictable, pre-defined playbook execution. 
            AI monitors and recommends—humans decide, playbooks execute exactly as designed.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default AIPrinciplesScorecard;
