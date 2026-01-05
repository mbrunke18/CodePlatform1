import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  ChevronLeft, ChevronRight, Check, Lightbulb, 
  Target, Radar, Zap, BookOpen, Shield,
  Users, FileText, DollarSign, Bell, Eye, 
  CheckCircle2, Clock, AlertTriangle, Settings
} from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

import SituationDefinitionStep from './wizard/SituationDefinitionStep';
import StakeholderMatrixStep from './wizard/StakeholderMatrixStep';
import DecisionTreesStep from './wizard/DecisionTreesStep';
import CommunicationTemplatesStep from './wizard/CommunicationTemplatesStep';
import TaskSequencesStep from './wizard/TaskSequencesStep';
import BudgetAuthorityStep from './wizard/BudgetAuthorityStep';
import SuccessMetricsStep from './wizard/SuccessMetricsStep';
import LessonsLearnedStep from './wizard/LessonsLearnedStep';

interface FourPhasePlaybookWizardProps {
  playbook: any;
  organizationId: string;
  isOpen: boolean;
  onClose: () => void;
}

const PHASES = [
  {
    id: 'identify',
    name: 'IDENTIFY',
    icon: Target,
    color: 'violet',
    description: 'Build your depth chart',
    weight: 40,
    steps: [
      { id: 1, name: 'Stakeholder Matrix', component: StakeholderMatrixStep, aiTip: 'Define 3-tier stakeholder hierarchy for cascade communications', itemType: 'stakeholder_assignment' },
      { id: 2, name: 'Communication Templates', component: CommunicationTemplatesStep, aiTip: 'Pre-write messages for each stakeholder tier', itemType: 'document_template' },
      { id: 3, name: 'Budget Authority', component: BudgetAuthorityStep, aiTip: 'Pre-approve budgets and vendor contracts for rapid execution', itemType: 'budget_approval' },
    ]
  },
  {
    id: 'detect',
    name: 'DETECT',
    icon: Radar,
    color: 'blue',
    description: 'Monitor signals',
    weight: 20,
    steps: [
      { id: 4, name: 'Situation Definition', component: SituationDefinitionStep, aiTip: 'Set severity, time sensitivity, and trigger conditions for automated activation', itemType: 'trigger' },
    ]
  },
  {
    id: 'execute',
    name: 'EXECUTE',
    icon: Zap,
    color: 'emerald',
    description: 'Execute response',
    weight: 30,
    steps: [
      { id: 5, name: 'Decision Trees', component: DecisionTreesStep, aiTip: 'Map escalation paths and conditional decision logic', itemType: 'decision_tree' },
      { id: 6, name: 'Task Sequences', component: TaskSequencesStep, aiTip: 'Sequence parallel and dependent tasks with timelines', itemType: 'task_sequence' },
      { id: 7, name: 'Success Metrics', component: SuccessMetricsStep, aiTip: 'Define KPIs to measure execution quality and speed', itemType: 'success_metrics' },
    ]
  },
  {
    id: 'advance',
    name: 'ADVANCE',
    icon: BookOpen,
    color: 'amber',
    description: 'Review the film',
    weight: 10,
    steps: [
      { id: 8, name: 'Lessons Learned', component: LessonsLearnedStep, aiTip: 'Capture insights post-execution for continuous improvement', itemType: 'after_action_review' },
    ]
  }
];

function PhaseReadinessScore({ phase, score, isActive }: { phase: typeof PHASES[0], score: number, isActive: boolean }) {
  const PhaseIcon = phase.icon;
  const colorClasses = {
    violet: 'bg-violet-500',
    blue: 'bg-blue-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
  };
  
  return (
    <div 
      className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
        isActive 
          ? 'ring-2 ring-primary bg-primary/5' 
          : 'bg-muted/50 hover:bg-muted/80'
      }`}
    >
      <div className={`p-2 rounded-lg ${colorClasses[phase.color as keyof typeof colorClasses]} bg-opacity-20`}>
        <PhaseIcon className={`w-5 h-5 text-${phase.color}-600`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm">{phase.name}</span>
          <Badge 
            variant={score >= 80 ? 'default' : score >= 50 ? 'secondary' : 'outline'}
            className="text-xs"
          >
            {score}%
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground truncate">{phase.description}</div>
        <Progress value={score} className="h-1.5 mt-1" />
      </div>
    </div>
  );
}

function OverallReadinessCard({ readinessData }: { readinessData: any }) {
  const score = readinessData?.score?.overallScore ?? 0;
  const scoreColor = score >= 80 ? 'text-green-600' : score >= 60 ? 'text-amber-600' : 'text-red-600';
  
  return (
    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Shield className="w-5 h-5" />
          Playbook Readiness
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className={`text-5xl font-bold ${scoreColor}`}>{score}%</div>
            <div className="text-xs text-slate-400 mt-1">Overall Score</div>
          </div>
          <div className="flex-1 ml-6 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1"><Target className="w-3 h-3" /> IDENTIFY</span>
              <span>{readinessData?.score?.prepareScore ?? 0}%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1"><Radar className="w-3 h-3" /> DETECT</span>
              <span>{readinessData?.score?.monitorScore ?? 0}%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> EXECUTE</span>
              <span>{readinessData?.score?.executeScore ?? 0}%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> ADVANCE</span>
              <span>{readinessData?.score?.learnScore ?? 0}%</span>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-700/50 rounded-lg p-2">
            <div className="text-lg font-bold">{readinessData?.breakdown?.prepare?.completed ?? 0}/{readinessData?.breakdown?.prepare?.total ?? 0}</div>
            <div className="text-[10px] text-slate-400">Prep Items</div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-2">
            <div className="text-lg font-bold">{readinessData?.breakdown?.monitor?.active ?? 0}/{readinessData?.breakdown?.monitor?.total ?? 0}</div>
            <div className="text-[10px] text-slate-400">Active Triggers</div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-2">
            <div className="text-lg font-bold">{readinessData?.breakdown?.learn?.configured ?? 0}</div>
            <div className="text-[10px] text-slate-400">Learn Items</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function FourPhasePlaybookWizard({
  playbook,
  organizationId,
  isOpen,
  onClose,
}: FourPhasePlaybookWizardProps) {
  const [activePhase, setActivePhase] = useState('prepare');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<any>({
    severityScore: playbook?.severityScore || 50,
    timeSensitivity: playbook?.timeSensitivity || 24,
    activationFrequencyTier: playbook?.activationFrequencyTier || 'MEDIUM',
    triggerCriteria: playbook?.triggerCriteria || '',
    triggerDataSources: playbook?.triggerDataSources || [],
    tier1Stakeholders: playbook?.tier1Stakeholders || [],
    tier2Stakeholders: playbook?.tier2Stakeholders || [],
    tier3Stakeholders: playbook?.tier3Stakeholders || [],
    externalPartners: playbook?.externalPartners || [],
    decisionCheckpoints: [],
    escalationPaths: [],
    communicationTemplates: [],
    taskSequences: [],
    preApprovedBudget: playbook?.preApprovedBudget || 0,
    budgetApprovalRequired: playbook?.budgetApprovalRequired !== false,
    vendorContracts: playbook?.vendorContracts || [],
    targetResponseSpeed: playbook?.targetResponseSpeed || 12,
    targetStakeholderReach: playbook?.targetStakeholderReach || 1.0,
    outcomeMetrics: playbook?.outcomeMetrics || [],
    lessonsLearned: [],
  });

  const { toast } = useToast();

  const { data: readinessData, isLoading: readinessLoading } = useQuery({
    queryKey: ['/api/playbook-library', playbook?.id, 'readiness', { organizationId }],
    queryFn: async () => {
      const res = await fetch(`/api/playbook-library/${playbook?.id}/readiness?organizationId=${organizationId}`);
      if (!res.ok) throw new Error('Failed to fetch readiness');
      return res.json();
    },
    enabled: !!playbook?.id && !!organizationId,
  });

  const saveCustomizationMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('PATCH', `/api/playbook-library/${playbook.id}/customize`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/playbook-library'] });
      queryClient.invalidateQueries({ queryKey: ['/api/playbook-library', playbook?.id, 'readiness'] });
      toast({
        title: 'Playbook Customized',
        description: 'Your playbook template has been customized successfully',
      });
      onClose();
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to save playbook customization',
        variant: 'destructive',
      });
    },
  });

  const currentPhase = PHASES.find(p => p.id === activePhase) || PHASES[0];
  const currentStep = currentPhase.steps[currentStepIndex];
  const CurrentStepComponent = currentStep?.component;

  const allSteps = PHASES.flatMap(p => p.steps);
  const totalSteps = allSteps.length;
  const completedSteps = allSteps.findIndex(s => s.id === currentStep?.id) + 1;
  const progress = (completedSteps / totalSteps) * 100;

  const handlePhaseChange = (phaseId: string) => {
    setActivePhase(phaseId);
    setCurrentStepIndex(0);
  };

  const handleNext = () => {
    if (currentStepIndex < currentPhase.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      const currentPhaseIndex = PHASES.findIndex(p => p.id === activePhase);
      if (currentPhaseIndex < PHASES.length - 1) {
        setActivePhase(PHASES[currentPhaseIndex + 1].id);
        setCurrentStepIndex(0);
      }
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    } else {
      const currentPhaseIndex = PHASES.findIndex(p => p.id === activePhase);
      if (currentPhaseIndex > 0) {
        const prevPhase = PHASES[currentPhaseIndex - 1];
        setActivePhase(prevPhase.id);
        setCurrentStepIndex(prevPhase.steps.length - 1);
      }
    }
  };

  const handleSave = () => {
    saveCustomizationMutation.mutate({
      organizationId,
      playbookId: playbook.id,
      customizations: formData,
    });
  };

  const updateFormData = (stepData: any) => {
    setFormData({ ...formData, ...stepData });
  };

  const isFirstStep = activePhase === 'prepare' && currentStepIndex === 0;
  const isLastStep = activePhase === 'learn' && currentStepIndex === currentPhase.steps.length - 1;

  const getPhaseScore = (phaseId: string) => {
    switch (phaseId) {
      case 'prepare': return readinessData?.score?.prepareScore ?? 0;
      case 'monitor': return readinessData?.score?.monitorScore ?? 0;
      case 'execute': return readinessData?.score?.executeScore ?? 0;
      case 'learn': return readinessData?.score?.learnScore ?? 0;
      default: return 0;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden flex flex-col p-0" data-testid="dialog-four-phase-wizard">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              <div>
                <div className="text-lg">Configure Playbook: {playbook?.name}</div>
                <div className="text-sm font-normal text-muted-foreground">4-Phase Strategic Readiness</div>
              </div>
            </div>
            <Badge variant="outline" className="text-sm" data-testid="badge-phase-progress">
              Phase {PHASES.findIndex(p => p.id === activePhase) + 1} of {PHASES.length}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-80 bg-muted/30 border-r p-4 space-y-4 overflow-y-auto">
            <OverallReadinessCard readinessData={readinessData} />
            
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground px-1">PHASES</h4>
              {PHASES.map((phase) => (
                <button
                  key={phase.id}
                  onClick={() => handlePhaseChange(phase.id)}
                  className="w-full text-left"
                  data-testid={`button-phase-${phase.id}`}
                >
                  <PhaseReadinessScore 
                    phase={phase} 
                    score={getPhaseScore(phase.id)} 
                    isActive={activePhase === phase.id}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b bg-background">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {(() => {
                    const PhaseIcon = currentPhase.icon;
                    return <PhaseIcon className="w-5 h-5" />;
                  })()}
                  <span className="font-semibold">{currentPhase.name}</span>
                  <span className="text-muted-foreground">→</span>
                  <span>{currentStep?.name}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Step {currentStepIndex + 1} of {currentPhase.steps.length}
                </Badge>
              </div>
              <Progress value={progress} className="h-2" data-testid="progress-wizard" />
              <div className="flex items-center gap-2 mt-2 text-xs text-blue-600 dark:text-blue-400">
                <Lightbulb className="w-3 h-3" />
                <span>{currentStep?.aiTip}</span>
              </div>
            </div>

            <div className="flex gap-2 p-3 border-b overflow-x-auto bg-muted/20">
              {currentPhase.steps.map((step, idx) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    currentStepIndex === idx
                      ? 'bg-primary text-primary-foreground'
                      : currentStepIndex > idx
                      ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                  data-testid={`button-step-${step.id}`}
                >
                  {currentStepIndex > idx && <Check className="h-3 w-3 inline mr-1" />}
                  {step.name}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900 p-3 mb-4">
                <div className="flex gap-2">
                  <Lightbulb className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900 dark:text-blue-100">
                    <span className="font-semibold">Pro Tip:</span> Customize each section with your organization's specific context. M pre-fills 80%+ of content from best practices.
                  </div>
                </div>
              </Card>
              
              {CurrentStepComponent && (
                <CurrentStepComponent
                  data={formData}
                  onChange={updateFormData}
                  playbook={playbook}
                />
              )}
            </div>

            <div className="flex justify-between p-4 border-t bg-background">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={isFirstStep}
                data-testid="button-back"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>

              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose} data-testid="button-cancel">
                  Cancel
                </Button>
                {isLastStep ? (
                  <Button
                    onClick={handleSave}
                    disabled={saveCustomizationMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                    data-testid="button-save-playbook"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    {saveCustomizationMutation.isPending ? 'Saving...' : 'Complete Setup'}
                  </Button>
                ) : (
                  <Button onClick={handleNext} data-testid="button-next">
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
