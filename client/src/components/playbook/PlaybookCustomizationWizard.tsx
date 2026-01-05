import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Check, Lightbulb, Lock } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Step components
import SituationDefinitionStep from './wizard/SituationDefinitionStep';
import StakeholderMatrixStep from './wizard/StakeholderMatrixStep';
import DecisionTreesStep from './wizard/DecisionTreesStep';
import CommunicationTemplatesStep from './wizard/CommunicationTemplatesStep';
import TaskSequencesStep from './wizard/TaskSequencesStep';
import BudgetAuthorityStep from './wizard/BudgetAuthorityStep';
import SuccessMetricsStep from './wizard/SuccessMetricsStep';
import LessonsLearnedStep from './wizard/LessonsLearnedStep';
import PrepareOverviewStep from './wizard/PrepareOverviewStep';
import MonitorTriggersStep from './wizard/MonitorTriggersStep';
import ExecuteTasksStep from './wizard/ExecuteTasksStep';
import LearnConfigStep from './wizard/LearnConfigStep';

interface PlaybookCustomizationWizardProps {
  playbook: any;
  organizationId: string;
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  { id: 1, phase: 'prepare', name: 'PREPARE Overview', prefilled: '85%', component: PrepareOverviewStep, aiTip: 'Configure stakeholders, documents, budgets, and vendor contracts', icon: '🎯', isPhaseOverview: true },
  { id: 2, phase: 'prepare', name: 'Stakeholder Matrix', prefilled: '90%', component: StakeholderMatrixStep, aiTip: 'Define who does what when this playbook activates', icon: '👥' },
  { id: 3, phase: 'prepare', name: 'Communication Templates', prefilled: '80%', component: CommunicationTemplatesStep, aiTip: 'Pre-write messages for rapid deployment', icon: '📝' },
  { id: 4, phase: 'prepare', name: 'Budget & Resources', prefilled: '100%', component: BudgetAuthorityStep, aiTip: 'Pre-approve budgets and vendor contracts', icon: '💰' },
  { id: 5, phase: 'monitor', name: 'MONITOR Triggers', prefilled: '100%', component: MonitorTriggersStep, aiTip: 'Define signals and conditions that activate this playbook', icon: '📡', isPhaseOverview: true },
  { id: 6, phase: 'execute', name: 'EXECUTE Tasks', prefilled: '75%', component: ExecuteTasksStep, aiTip: 'Define tasks across immediate/coordinate/resolve/close sub-phases', icon: '⚡', isPhaseOverview: true },
  { id: 7, phase: 'execute', name: 'Decision Trees', prefilled: '85%', component: DecisionTreesStep, aiTip: 'Map escalation paths and conditional logic', icon: '🌳' },
  { id: 8, phase: 'learn', name: 'LEARN Activities', prefilled: '80%', component: LearnConfigStep, aiTip: 'Configure post-execution learning and improvement', icon: '📚', isPhaseOverview: true },
  { id: 9, phase: 'learn', name: 'Success Metrics', prefilled: '80%', component: SuccessMetricsStep, aiTip: 'Define KPIs to measure execution quality', icon: '📊' },
];

const PHASE_STYLES = {
  prepare: {
    active: 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-medium ring-1 ring-purple-300 dark:ring-purple-700',
  },
  monitor: {
    active: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium ring-1 ring-blue-300 dark:ring-blue-700',
  },
  execute: {
    active: 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 font-medium ring-1 ring-orange-300 dark:ring-orange-700',
  },
  learn: {
    active: 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 font-medium ring-1 ring-green-300 dark:ring-green-700',
  },
} as const;

const PHASES = [
  { id: 'prepare' as const, name: 'Prepare', icon: '🎯', steps: [1, 2, 3, 4] },
  { id: 'monitor' as const, name: 'Monitor', icon: '📡', steps: [5] },
  { id: 'execute' as const, name: 'Execute', icon: '⚡', steps: [6, 7] },
  { id: 'learn' as const, name: 'Learn', icon: '📚', steps: [8, 9] },
];

export default function PlaybookCustomizationWizard({
  playbook,
  organizationId,
  isOpen,
  onClose,
}: PlaybookCustomizationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    // Step 1: Situation Definition
    severityScore: playbook?.severityScore || 50,
    timeSensitivity: playbook?.timeSensitivity || 24,
    activationFrequencyTier: playbook?.activationFrequencyTier || 'MEDIUM',
    triggerCriteria: playbook?.triggerCriteria || '',
    triggerDataSources: playbook?.triggerDataSources || [],
    
    // Step 2: Stakeholder Matrix
    tier1Stakeholders: playbook?.tier1Stakeholders || [],
    tier2Stakeholders: playbook?.tier2Stakeholders || [],
    tier3Stakeholders: playbook?.tier3Stakeholders || [],
    externalPartners: playbook?.externalPartners || [],
    
    // Step 3: Decision Trees
    decisionCheckpoints: [],
    escalationPaths: [],
    
    // Step 4: Communication Templates
    communicationTemplates: [],
    
    // Step 5: Task Sequences
    taskSequences: [],
    
    // Step 6: Budget Authority
    preApprovedBudget: playbook?.preApprovedBudget || 0,
    budgetApprovalRequired: playbook?.budgetApprovalRequired !== false,
    vendorContracts: playbook?.vendorContracts || [],
    
    // Step 7: Success Metrics
    targetResponseSpeed: playbook?.targetResponseSpeed || 12,
    targetStakeholderReach: playbook?.targetStakeholderReach || 1.0,
    outcomeMetrics: playbook?.outcomeMetrics || [],
    
    // Step 8: Lessons Learned
    lessonsLearned: [],
  });

  const { toast } = useToast();

  const saveCustomizationMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('PATCH', `/api/playbook-library/${playbook.id}/customize`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/playbook-library'] });
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

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
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

  const progress = (currentStep / STEPS.length) * 100;
  const CurrentStepComponent = STEPS[currentStep - 1].component;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" data-testid="dialog-playbook-wizard">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Customize Playbook: {playbook?.name}</span>
            <Badge variant="outline" data-testid="badge-progress">
              Step {currentStep} of {STEPS.length}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Progress Bar with AI Tip */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" data-testid="progress-wizard" />
          <div className="flex justify-between items-start text-xs text-muted-foreground">
            <div>
              <div>{STEPS[currentStep - 1].name}</div>
              <div className="flex items-center gap-1 mt-1 text-blue-600 dark:text-blue-400">
                <Lightbulb className="w-3 h-3" />
                <span>{STEPS[currentStep - 1].aiTip}</span>
              </div>
            </div>
            <Badge variant="secondary">{STEPS[currentStep - 1].prefilled} Pre-filled</Badge>
          </div>
        </div>

        {/* Phase Indicators */}
        <div className="flex justify-between mb-2 px-2">
          {PHASES.map((phase) => {
            const phaseSteps = STEPS.filter(s => s.phase === phase.id);
            const completedSteps = phaseSteps.filter(s => currentStep > s.id).length;
            const isCurrentPhase = phaseSteps.some(s => s.id === currentStep);
            const isCompleted = completedSteps === phaseSteps.length;
            
            let className = 'flex items-center gap-2 px-3 py-1 rounded-full text-xs transition-colors ';
            if (isCurrentPhase) {
              className += PHASE_STYLES[phase.id].active;
            } else if (isCompleted) {
              className += 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300';
            } else {
              className += 'text-muted-foreground bg-muted/50';
            }
            
            return (
              <div 
                key={phase.id}
                className={className}
                data-testid={`phase-indicator-${phase.id}`}
              >
                <span>{phase.icon}</span>
                <span>{phase.name}</span>
                {isCompleted && <Check className="h-3 w-3" />}
              </div>
            );
          })}
        </div>

        {/* Step Navigation with Drag Hint */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {STEPS.map((step) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-medium transition-colors relative group ${
                currentStep === step.id
                  ? 'bg-primary text-primary-foreground'
                  : currentStep > step.id
                  ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
              data-testid={`button-step-${step.id}`}
              title={`Step ${step.id}: ${step.name}`}
            >
              {currentStep > step.id && <Check className="h-3 w-3 inline mr-1" />}
              {step.id}. {step.name}
              {currentStep > step.id && <Lock className="h-3 w-3 inline ml-1 opacity-50" />}
            </button>
          ))}
        </div>

        {/* Step Content with Validation */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {/* Quick Tips Card */}
          <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900 p-3">
            <div className="flex gap-2">
              <Lightbulb className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900 dark:text-blue-100">
                <span className="font-semibold">Pro Tip:</span> Customize each section with your organization's specific context, roles, and communication preferences for optimal execution velocity.
              </div>
            </div>
          </Card>
          
          <CurrentStepComponent
            data={formData}
            onChange={updateFormData}
            playbook={playbook}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between border-t pt-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            data-testid="button-back"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>

          <div className="flex gap-2">
            {currentStep < STEPS.length ? (
              <Button onClick={handleNext} data-testid="button-next">
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                disabled={saveCustomizationMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
                data-testid="button-save-playbook"
              >
                <Check className="h-4 w-4 mr-1" />
                {saveCustomizationMutation.isPending ? 'Saving...' : 'Save Customization'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
