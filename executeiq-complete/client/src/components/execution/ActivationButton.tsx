import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Rocket, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  FileText,
  Users,
  DollarSign,
  ExternalLink,
  Clock
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ActivationRequest {
  organizationId: string;
  scenarioId?: string | null;
  executionPlanId: string;
  playbookId: string;
  triggeredBy?: string;
  syncPlatform?: 'jira' | 'asana' | 'monday' | 'ms_project' | 'servicenow';
  skipPreflight?: boolean;
}

interface ActivationResult {
  success: boolean;
  executionInstanceId?: string;
  deadline?: string;
  preflightResult?: {
    canProceed: boolean;
    readinessScore: number;
  };
  projectSync?: {
    platform: string;
    projectUrl?: string;
    tasksCreated: number;
  };
  documentsGenerated: number;
  stakeholdersNotified: number;
  budgetUnlocked?: {
    totalAmount: number;
    currency: string;
    categories: string[];
  };
  errors: string[];
  events: Array<{
    type: string;
    success: boolean;
    durationMs: number;
  }>;
}

interface ActivationButtonProps {
  organizationId: string;
  scenarioId?: string | null;
  executionPlanId: string;
  playbookId: string;
  playbookName: string;
  userId?: string;
  syncPlatform?: 'jira' | 'asana' | 'monday' | 'ms_project' | 'servicenow';
  canActivate?: boolean;
  readinessScore?: number;
  onActivationComplete?: (result: ActivationResult) => void;
  size?: "default" | "sm" | "lg";
  variant?: "default" | "outline" | "destructive";
}

const eventLabels: Record<string, { label: string; icon: typeof CheckCircle2 }> = {
  activation_started: { label: "Activation Started", icon: Rocket },
  preflight_passed: { label: "Pre-flight Passed", icon: CheckCircle2 },
  preflight_failed: { label: "Pre-flight Failed", icon: AlertCircle },
  project_created: { label: "Project Created", icon: ExternalLink },
  documents_generated: { label: "Documents Generated", icon: FileText },
  stakeholders_notified: { label: "Stakeholders Notified", icon: Users },
  budget_unlocked: { label: "Budget Unlocked", icon: DollarSign },
  activation_completed: { label: "Activation Complete", icon: CheckCircle2 },
  activation_failed: { label: "Activation Failed", icon: AlertCircle },
};

export function ActivationButton({
  organizationId,
  scenarioId,
  executionPlanId,
  playbookId,
  playbookName,
  userId,
  syncPlatform,
  canActivate = true,
  readinessScore = 100,
  onActivationComplete,
  size = "lg",
  variant = "default",
}: ActivationButtonProps) {
  const { toast } = useToast();
  const [showProgress, setShowProgress] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");

  const activationMutation = useMutation({
    mutationFn: async (request: ActivationRequest): Promise<ActivationResult> => {
      const response = await apiRequest("POST", "/api/execution/activate", request);
      return response.json();
    },
    onMutate: () => {
      setShowProgress(true);
      setCurrentProgress(10);
      setCurrentStep("Starting activation...");
    },
    onSuccess: (result) => {
      if (result.success) {
        let progress = 20;
        result.events.forEach((event, idx) => {
          setTimeout(() => {
            const eventConfig = eventLabels[event.type];
            setCurrentStep(eventConfig?.label || event.type);
            setCurrentProgress(20 + ((idx + 1) / result.events.length) * 80);
          }, idx * 300);
        });

        setTimeout(() => {
          setCurrentProgress(100);
          setCurrentStep("Activation complete!");
          
          toast({
            title: "Playbook Activated",
            description: `${playbookName} is now executing. ${result.stakeholdersNotified} stakeholders notified.`,
          });

          queryClient.invalidateQueries({ queryKey: ['/api/execution'] });
          
          if (onActivationComplete) {
            onActivationComplete(result);
          }

          setTimeout(() => setShowProgress(false), 2000);
        }, result.events.length * 300 + 500);
      } else {
        toast({
          title: "Activation Failed",
          description: result.errors.join(", ") || "Unknown error occurred",
          variant: "destructive",
        });
        setShowProgress(false);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Activation Failed",
        description: error.message || "Failed to activate playbook",
        variant: "destructive",
      });
      setShowProgress(false);
    },
  });

  const handleActivate = () => {
    activationMutation.mutate({
      organizationId,
      scenarioId,
      executionPlanId,
      playbookId,
      triggeredBy: userId,
      syncPlatform,
    });
  };

  if (showProgress) {
    return (
      <div className="w-full space-y-3 p-4 bg-muted/50 rounded-lg" data-testid="activation-progress">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="font-medium">{currentStep}</span>
        </div>
        <Progress value={currentProgress} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Executing coordinated response</span>
          <span>{Math.round(currentProgress)}%</span>
        </div>
      </div>
    );
  }

  const buttonDisabled = !canActivate || activationMutation.isPending;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          size={size}
          variant={variant}
          disabled={buttonDisabled}
          className="gap-2"
          data-testid="button-activate-playbook"
        >
          <Rocket className="h-5 w-5" />
          {activationMutation.isPending ? "Activating..." : "Activate Playbook"}
          {readinessScore < 100 && (
            <Badge variant="secondary" className="ml-1">
              {readinessScore}% Ready
            </Badge>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent data-testid="activation-confirm-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            Activate {playbookName}?
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>
              This will trigger the coordinated response immediately. The following actions will occur:
            </p>
            <div className="grid grid-cols-2 gap-3 py-2">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>Generate execution documents</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>Notify all stakeholders</span>
              </div>
              {syncPlatform && (
                <div className="flex items-center gap-2 text-sm">
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  <span>Create {syncPlatform} project</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>Unlock pre-approved budgets</span>
              </div>
              <div className="flex items-center gap-2 text-sm col-span-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">12-minute execution window begins</span>
              </div>
            </div>
            <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
              This action cannot be undone. Are you ready to proceed?
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel data-testid="button-cancel-activation">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleActivate}
            className="bg-primary"
            data-testid="button-confirm-activation"
          >
            <Rocket className="h-4 w-4 mr-2" />
            Activate Now
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
