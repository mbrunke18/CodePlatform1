import { useQuery } from '@tanstack/react-query';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  role?: string;
  isPlatformAdmin?: boolean;
  initials: string;
  needsOnboarding: boolean;
  organizationId?: string;
  accessTier?: 'full' | 'eval48';
  tierExpiresAt?: string;
}

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<AuthUser>({
    queryKey: ['/api/auth/user'],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const isAuthenticated = !!user && !error;
  const needsOnboarding = user?.needsOnboarding || false;

  const login = (returnTo?: string) => {
    const url = returnTo ? `/api/login?returnTo=${encodeURIComponent(returnTo)}` : '/api/login';
    try {
      (window.top || window).location.href = url;
    } catch {
      window.location.href = url;
    }
  };

  const logout = () => {
    try {
      (window.top || window).location.href = '/api/logout';
    } catch {
      window.location.href = '/api/logout';
    }
  };

  return {
    user: user || null,
    isLoading,
    isAuthenticated,
    needsOnboarding,
    login,
    logout,
  };
}
