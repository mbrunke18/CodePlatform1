import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  Circle,
  ArrowRight,
  ArrowLeft,
  Target,
  Users,
  Bell,
  BarChart3,
  BookOpen,
  Sparkles
} from 'lucide-react';

// Import wizard phases
import ScenarioContextPhase from './wizard/ScenarioContextPhase';
import StakeholderMatrixPhase from './wizard/StakeholderMatrixPhase';
import TriggerConfigurationPhase from './wizard/TriggerConfigurationPhase';
import ExecutionPlanPhase from './wizard/ExecutionPlanPhase';
import SuccessMetricsPhase from './wizard/SuccessMetricsPhase';
import ReviewPhase from './wizard/ReviewPhase';

type WizardPhase = 'context' | 'stakeholders' | 'triggers' | 'execution' | 'metrics' | 'review';

interface WizardPhaseConfig {
  id: WizardPhase;
  label: string;
  icon: any;
  description: string;
  requiredFields: string[];
}

const WIZARD_PHASES: WizardPhaseConfig[] = [
  {
    id: 'context',
    label: 'Context',
    icon: Target,
    description: 'Define mission, type, and strategic context',
    requiredFields: ['mission', 'scenarioType', 'timeHorizon', 'businessImpactCategory']
  },
  {
    id: 'stakeholders',
    label: 'Stakeholders',
    icon: Users,
    description: 'Map stakeholders, roles, and influence',
    requiredFields: ['stakeholders'] // At least one stakeholder required
  },
  {
    id: 'triggers',
    label: 'Triggers',
    icon: Bell,
    description: 'Configure monitoring signals and alerts',
    requiredFields: ['triggers'] // At least one trigger required
  },
  {
    id: 'execution',
    label: 'Execution Plan',
    icon: Target,
    description: 'Build Work Breakdown Structure with phases and tasks',
    requiredFields: [] // Optional - can proceed without execution plan
  },
  {
    id: 'metrics',
    label: 'Success Metrics',
    icon: BarChart3,
    description: 'Define how success will be measured',
    requiredFields: ['metrics'] // At least one metric required
  },
  {
    id: 'review',
    label: 'Review',
    icon: BookOpen,
    description: 'Review and finalize your scenario',
    requiredFields: []
  }
];

interface ScenarioWizardProps {
  organizationId: string;
  onComplete?: (scenarioData: any) => void;
  onCancel?: () => void;
}

export default function ScenarioWizard({ organizationId, onComplete, onCancel }: ScenarioWizardProps) {
  const [currentPhase, setCurrentPhase] = useState<WizardPhase>('context');
  const [completedPhases, setCompletedPhases] = useState<Set<WizardPhase>>(new Set());
  
  // Wizard data state
  const [scenarioData, setScenarioData] = useState({
    // Phase 1: Context
    name: '',
    description: '',
    mission: '',
    scenarioType: 'operational' as const,
    timeHorizon: 'short_term' as const,
    businessImpactCategory: '',
    primaryBusinessUnit: '',
    impactedProcesses: [] as string[],
    dependencyMap: { upstream: [], downstream: [], external: [] },
    geographicScope: [] as string[],
    regulatoryConstraints: [] as any[],
    complianceWindows: [] as any[],
    narrativeContext: '',
    
    // Phase 2: Stakeholders
    stakeholders: [] as any[],
    
    // Phase 3: Triggers
    triggers: [] as any[],
    
    // Phase 4: Execution Plan
    executionPlan: {
      immediate: [] as any[],
      secondary: [] as any[],
      follow_up: [] as any[],
    },
    
    // Phase 5: Metrics
    metrics: [] as any[],
  });

  const currentPhaseIndex = WIZARD_PHASES.findIndex(p => p.id === currentPhase);
  const currentPhaseConfig = WIZARD_PHASES[currentPhaseIndex];
  const completionPercentage = ((completedPhases.size) / (WIZARD_PHASES.length - 1)) * 100; // Exclude review from calculation

  const updateScenarioData = (updates: Partial<typeof scenarioData>) => {
    setScenarioData(prev => ({ ...prev, ...updates }));
  };

  const isPhaseComplete = (phase: WizardPhase): boolean => {
    const config = WIZARD_PHASES.find(p => p.id === phase);
    if (!config) return false;

    // Check if all required fields are filled
    return config.requiredFields.every(field => {
      const value = scenarioData[field as keyof typeof scenarioData];
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'string') return value.trim().length > 0;
      return !!value;
    });
  };

  const handleNext = () => {
    if (isPhaseComplete(currentPhase)) {
      setCompletedPhases(prev => new Set([...Array.from(prev), currentPhase]));
    }

    if (currentPhaseIndex < WIZARD_PHASES.length - 1) {
      setCurrentPhase(WIZARD_PHASES[currentPhaseIndex + 1].id);
    }
  };

  const handleBack = () => {
    if (currentPhaseIndex > 0) {
      setCurrentPhase(WIZARD_PHASES[currentPhaseIndex - 1].id);
    }
  };

  const handlePhaseClick = (phaseId: WizardPhase) => {
    // Allow jumping to any phase
    setCurrentPhase(phaseId);
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete({
        ...scenarioData,
        organizationId,
        completionScore: completionPercentage
      });
    }
  };

  const renderPhaseContent = () => {
    switch (currentPhase) {
      case 'context':
        return (
          <ScenarioContextPhase
            data={scenarioData}
            onChange={updateScenarioData}
          />
        );
      case 'stakeholders':
        return (
          <StakeholderMatrixPhase
            data={scenarioData}
            onChange={updateScenarioData}
          />
        );
      case 'triggers':
        return (
          <TriggerConfigurationPhase
            data={scenarioData}
            onChange={updateScenarioData}
            organizationId={organizationId}
          />
        );
      case 'execution':
        return (
          <ExecutionPlanPhase
            data={scenarioData}
            onChange={updateScenarioData}
          />
        );
      case 'metrics':
        return (
          <SuccessMetricsPhase
            data={scenarioData}
            onChange={updateScenarioData}
          />
        );
      case 'review':
        return (
          <ReviewPhase
            data={scenarioData}
            completionScore={completionPercentage}
          />
        );
      default:
        return null;
    }
  };

  const isCurrentPhaseComplete = isPhaseComplete(currentPhase);
  const canProceed = isCurrentPhaseComplete || currentPhase === 'review';

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card className="border-blue-500/30 bg-gradient-to-r from-blue-950/20 to-purple-950/20">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-white text-2xl">Complete Scenario Definition</CardTitle>
              <CardDescription className="text-gray-400">
                Build an actionable, executable playbook with complete situation capture
              </CardDescription>
            </div>
            <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/50 px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              {Math.round(completionPercentage)}% Complete
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>Overall Progress</span>
              <span>{completedPhases.size} of {WIZARD_PHASES.length - 1} phases complete</span>
            </div>
            <Progress value={completionPercentage} className="h-3" />
          </div>
        </CardHeader>
      </Card>

      {/* Phase Navigator */}
      <div className="grid grid-cols-6 gap-3">
        {WIZARD_PHASES.map((phase, index) => {
          const Icon = phase.icon;
          const isComplete = completedPhases.has(phase.id);
          const isCurrent = currentPhase === phase.id;
          const isAccessible = index <= currentPhaseIndex || isComplete;

          return (
            <button
              key={phase.id}
              onClick={() => handlePhaseClick(phase.id)}
              disabled={!isAccessible}
              data-testid={`wizard-phase-${phase.id}`}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                isCurrent
                  ? 'border-blue-500 bg-blue-950/30 scale-105'
                  : isComplete
                  ? 'border-green-500/50 bg-green-950/20 hover:scale-102'
                  : isAccessible
                  ? 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
                  : 'border-slate-800 bg-slate-900/20 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {isComplete ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <Circle className={`h-5 w-5 ${isCurrent ? 'text-blue-400' : 'text-gray-600'}`} />
                )}
                <span className={`text-sm font-semibold ${isCurrent ? 'text-blue-300' : isComplete ? 'text-green-300' : 'text-gray-400'}`}>
                  Phase {index + 1}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`h-4 w-4 ${isCurrent ? 'text-blue-400' : isComplete ? 'text-green-400' : 'text-gray-500'}`} />
                <p className={`font-medium text-sm ${isCurrent ? 'text-white' : isComplete ? 'text-gray-300' : 'text-gray-500'}`}>
                  {phase.label}
                </p>
              </div>
              <p className="text-xs text-gray-500 leading-tight">{phase.description}</p>
            </button>
          );
        })}
      </div>

      {/* Phase Content */}
      <Card className="border-slate-700">
        <CardHeader>
          <div className="flex items-center gap-3">
            {(() => {
              const Icon = currentPhaseConfig.icon;
              return <Icon className="h-6 w-6 text-blue-400" />;
            })()}
            <div>
              <CardTitle className="text-white">{currentPhaseConfig.label}</CardTitle>
              <CardDescription>{currentPhaseConfig.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderPhaseContent()}
        </CardContent>
      </Card>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <div>
          {onCancel && (
            <Button
              variant="ghost"
              onClick={onCancel}
              className="text-gray-400 hover:text-white"
              data-testid="button-cancel-wizard"
            >
              Cancel
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {currentPhaseIndex > 0 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="border-slate-600 text-gray-300"
              data-testid="button-wizard-back"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}

          {currentPhase !== 'review' ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className={`${
                canProceed
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              } text-white`}
              data-testid="button-wizard-next"
            >
              {isCurrentPhaseComplete ? 'Continue' : 'Skip for Now'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              className="bg-green-600 hover:bg-green-700 text-white"
              data-testid="button-complete-scenario"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete & Save Scenario
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
