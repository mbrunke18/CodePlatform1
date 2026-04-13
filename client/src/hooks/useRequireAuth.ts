import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useTrial } from '@/hooks/useTrial';

export function useRequireAuth() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { isTrial, isLoading: trialLoading } = useTrial();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (authLoading || trialLoading) return;
    if (!isAuthenticated && !isTrial) {
      setLocation(`/request-access?returnTo=${encodeURIComponent(location)}`);
    }
  }, [isAuthenticated, isTrial, authLoading, trialLoading, location, setLocation]);

  const isReady = !authLoading && !trialLoading && (isAuthenticated || isTrial);
  return { isReady, isAuthenticated, isTrial };
}
