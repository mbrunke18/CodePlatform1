import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { HelpCircle } from 'lucide-react';

interface OnboardingTriggerProps {
  pageId: string;
  autoStart?: boolean;
  className?: string;
}

export default function OnboardingTrigger({ pageId, autoStart = true, className = '' }: OnboardingTriggerProps) {
  const { startOnboarding, isPageOnboarded, state } = useOnboarding();

  useEffect(() => {
    if (autoStart && !isPageOnboarded(pageId) && !state.isActive) {
      const timer = setTimeout(() => {
        startOnboarding(pageId);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [pageId, autoStart, isPageOnboarded, startOnboarding, state.isActive]);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => startOnboarding(pageId)}
      className={`gap-2 ${className}`}
      data-testid={`onboarding-trigger-${pageId}`}
    >
      <HelpCircle className="h-4 w-4" />
      <span className="hidden sm:inline">Tour</span>
    </Button>
  );
}
