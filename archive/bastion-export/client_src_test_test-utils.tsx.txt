import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactElement, ReactNode } from 'react';

// Create a test query client with default options optimized for testing
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
    },
    mutations: {
      retry: false,
    },
  },
});

// Test wrapper component that provides all necessary providers
function TestWrapper({ children }: { children: ReactNode }) {
  const testQueryClient = createTestQueryClient();
  
  return (
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  );
}

// Custom render function that includes providers
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: TestWrapper, ...options });
}

// Mock data for testing
export const mockOrganization = {
  id: 'test-org-1',
  name: 'Test Organization',
  description: 'A test organization',
  ownerId: 'test-user',
  domain: 'test.com',
  type: 'enterprise' as const,
  size: 1000,
  industry: 'Technology',
  headquarters: 'Test City, TC',
  adaptabilityScore: 85.5,
  onboardingCompleted: true,
  subscriptionTier: 'enterprise' as const,
  status: 'active' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockScenario = {
  id: 'test-scenario-1',
  title: 'Test Strategic Scenario',
  description: 'A test scenario',
  type: 'growth' as const,
  category: 'market_expansion' as const,
  organizationId: 'test-org-1',
  createdBy: 'test-user',
  priority: 'medium' as const,
  confidence: 75,
  timeline: '3-6 months',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockUser = {
  id: 'test-user',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@test.com',
  department: 'Technology',
  team: 'Engineering',
  title: 'Software Engineer',
  organizationId: 'test-org-1',
  isActive: true,
  hasCompletedOnboarding: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Helper to wait for async operations in tests
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Re-export everything from react-testing-library
export * from '@testing-library/react';