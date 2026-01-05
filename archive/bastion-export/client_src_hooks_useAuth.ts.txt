// Development authentication bypass - always returns authenticated user

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  role?: string;
  initials: string;
}

export function useAuth() {
  // Always return authenticated dev user to bypass authentication completely
  const user: AuthUser = {
    id: 'dev-user',
    email: 'dev@enterprise.com',
    firstName: 'Enterprise',
    lastName: 'Admin',
    profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=enterprise',
    role: 'Admin',
    initials: 'EA'
  };

  return {
    user,
    isLoading: false,
    isAuthenticated: true,
  };
}
