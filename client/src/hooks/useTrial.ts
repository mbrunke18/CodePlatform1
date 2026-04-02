import { useQuery } from '@tanstack/react-query';

export interface TrialStatus {
  active: boolean;
  firstName?: string;
  company?: string;
  expiresAt?: string;
  reason?: string;
}

export function useTrial() {
  const { data, isLoading } = useQuery<TrialStatus>({
    queryKey: ['/api/trial/status'],
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

  const active = data?.active ?? false;
  const expiresAt = data?.expiresAt ? new Date(data.expiresAt) : null;

  function timeRemaining(): string {
    if (!expiresAt) return '';
    const ms = expiresAt.getTime() - Date.now();
    if (ms <= 0) return 'Expired';
    const hrs = Math.floor(ms / 3_600_000);
    const mins = Math.floor((ms % 3_600_000) / 60_000);
    if (hrs > 0) return `${hrs}h ${mins}m remaining`;
    return `${mins}m remaining`;
  }

  return {
    isTrial: active,
    isLoading,
    firstName: data?.firstName,
    company: data?.company,
    expiresAt,
    timeRemaining,
  };
}
