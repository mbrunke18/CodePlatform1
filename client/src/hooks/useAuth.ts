import { useQuery } from '@tanstack/react-query';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  role?: string;
  initials: string;
  needsOnboarding: boolean;
}

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<AuthUser>({
    queryKey: ['/api/auth/user'],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const isAuthenticated = !!user && !error;
  const needsOnboarding = user?.needsOnboarding || false;

  const login = () => {
    const target = window.top || window;
    target.location.href = '/api/login';
  };

  const logout = () => {
    const target = window.top || window;
    target.location.href = '/api/logout';
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
