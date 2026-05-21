import { useAuth } from './useAuth';

export type AccessTier = 'full' | 'eval48';

export interface AccessTierInfo {
  tier: AccessTier;
  isEval: boolean;
  isExpired: boolean;
  hoursRemaining: number | null;
  minutesRemaining: number | null;
  expiresAt: Date | null;
}

export function useAccessTier(): AccessTierInfo {
  const { user } = useAuth();

  const tierRaw = (user as any)?.accessTier as string | undefined;
  const tierExpiresAtRaw = (user as any)?.tierExpiresAt as string | undefined;

  const tier: AccessTier = tierRaw === 'eval48' ? 'eval48' : 'full';
  const expiresAt = tierExpiresAtRaw ? new Date(tierExpiresAtRaw) : null;
  const now = new Date();

  if (tier === 'eval48' && expiresAt) {
    const msRemaining = expiresAt.getTime() - now.getTime();
    const isExpired = msRemaining <= 0;
    const hoursRemaining = isExpired ? 0 : Math.floor(msRemaining / (1000 * 60 * 60));
    const minutesRemaining = isExpired ? 0 : Math.floor((msRemaining % (1000 * 60 * 60)) / (1000 * 60));
    return { tier, isEval: true, isExpired, hoursRemaining, minutesRemaining, expiresAt };
  }

  return { tier, isEval: tier === 'eval48', isExpired: false, hoursRemaining: null, minutesRemaining: null, expiresAt };
}
