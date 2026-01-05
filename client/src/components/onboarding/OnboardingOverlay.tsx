import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useOnboarding, pageOnboardingConfigs } from '@/contexts/OnboardingContext';
import { 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Lightbulb,
  Target,
  Eye,
  Zap,
  GraduationCap
} from 'lucide-react';

const phaseIcons = {
  IDENTIFY: Target,
  DETECT: Eye,
  EXECUTE: Zap,
  ADVANCE: GraduationCap
};

const phaseColors = {
  IDENTIFY: 'bg-violet-600',
  DETECT: 'bg-blue-600',
  EXECUTE: 'bg-emerald-600',
  ADVANCE: 'bg-amber-600'
};

export default function OnboardingOverlay() {
  const { 
    state, 
    getCurrentStep, 
    getCurrentPageSteps,
    nextStep, 
    prevStep, 
    skipOnboarding,
    dismissOnboarding
  } = useOnboarding();

  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
  const [originalStyles, setOriginalStyles] = useState<Record<string, string>>({});
  const overlayRef = useRef<HTMLDivElement>(null);

  const currentStep = getCurrentStep();
  const steps = getCurrentPageSteps();
  const progress = steps.length > 0 ? ((state.currentStep + 1) / steps.length) * 100 : 0;
  const config = state.currentPage ? pageOnboardingConfigs[state.currentPage] : null;

  useEffect(() => {
    if (highlightedElement && Object.keys(originalStyles).length > 0) {
      highlightedElement.style.zIndex = originalStyles.zIndex || '';
      highlightedElement.style.position = originalStyles.position || '';
      highlightedElement.style.boxShadow = originalStyles.boxShadow || '';
      highlightedElement.style.outline = originalStyles.outline || '';
    }

    if (!state.isActive || !currentStep?.targetElement) {
      setHighlightedElement(null);
      return;
    }

    const timer = setTimeout(() => {
      const element = document.querySelector(`[data-testid="${currentStep.targetElement}"]`) as HTMLElement;
      if (element) {
        setOriginalStyles({
          zIndex: element.style.zIndex,
          position: element.style.position,
          boxShadow: element.style.boxShadow,
          outline: element.style.outline
        });

        element.style.zIndex = '9999';
        element.style.position = 'relative';
        element.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.6), 0 0 30px rgba(59, 130, 246, 0.3)';
        element.style.outline = '2px solid rgb(59, 130, 246)';

        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightedElement(element);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [state.isActive, currentStep?.targetElement, state.currentStep]);

  useEffect(() => {
    return () => {
      if (highlightedElement && Object.keys(originalStyles).length > 0) {
        highlightedElement.style.zIndex = originalStyles.zIndex || '';
        highlightedElement.style.position = originalStyles.position || '';
        highlightedElement.style.boxShadow = originalStyles.boxShadow || '';
        highlightedElement.style.outline = originalStyles.outline || '';
      }
    };
  }, []);

  if (!state.isActive || !currentStep || !config) return null;

  const PhaseIcon = currentStep.phase ? phaseIcons[currentStep.phase] : Lightbulb;
  const phaseColor = currentStep.phase ? phaseColors[currentStep.phase] : 'bg-blue-600';

  return createPortal(
    <>
      <div 
        className="fixed inset-0 bg-black/40 z-[9998]" 
        onClick={dismissOnboarding}
        data-testid="onboarding-backdrop"
      />

      <div 
        ref={overlayRef}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[10000] w-full max-w-lg px-4"
        data-testid="onboarding-overlay"
      >
        <Card className="bg-slate-900/98 border-blue-500/50 shadow-2xl backdrop-blur-md">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${phaseColor} rounded-lg flex items-center justify-center`}>
                  <PhaseIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-semibold text-lg" data-testid="onboarding-title">
                      {currentStep.title}
                    </h3>
                    {currentStep.phase && (
                      <Badge 
                        variant="outline" 
                        className="text-xs border-blue-500/50 text-blue-300"
                        data-testid="onboarding-phase-badge"
                      >
                        {currentStep.phase}
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-400 text-xs">{config.pageName}</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={dismissOnboarding}
                className="text-gray-400 hover:text-white hover:bg-white/10 -mt-1 -mr-2"
                data-testid="onboarding-close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-gray-200 text-sm leading-relaxed mb-4" data-testid="onboarding-description">
              {currentStep.description}
            </p>

            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>Step {state.currentStep + 1} of {steps.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>

            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={skipOnboarding}
                className="text-gray-400 hover:text-white text-xs"
                data-testid="onboarding-skip"
              >
                Skip tour
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={prevStep}
                  disabled={state.currentStep === 0}
                  className="border-gray-600 text-gray-300 hover:bg-white/10"
                  data-testid="onboarding-prev"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={nextStep}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  data-testid="onboarding-next"
                >
                  {state.currentStep >= steps.length - 1 ? 'Done' : 'Next'}
                  {state.currentStep < steps.length - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>,
    document.body
  );
}
