import { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';

interface Department {
  id: string;
  name: string;
  description?: string;
  headcount?: number;
  leaderId?: string;
  leaderName?: string;
}

interface Stakeholder {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  approvalLimit?: number;
  canApproveActivations: boolean;
}

interface Organization {
  id: string;
  name: string;
  industry?: string;
  employeeCount?: number;
  primaryContact?: string;
  primaryEmail?: string;
}

interface CustomerMetrics {
  friTarget: number;
  friCurrent: number;
  velocityTarget: number;
  velocityCurrent: number;
  coverageTarget: number;
  coverageCurrent: number;
}

interface CustomerContextType {
  organization: Organization | null;
  departments: Department[];
  stakeholders: Stakeholder[];
  metrics: CustomerMetrics;
  isLoading: boolean;
  isConfigured: boolean;
  companyName: string;
  primaryContact: string;
  primaryEmail: string;
}

const defaultMetrics: CustomerMetrics = {
  friTarget: 84.4,
  friCurrent: 72.3,
  velocityTarget: 12,
  velocityCurrent: 18,
  coverageTarget: 95,
  coverageCurrent: 78,
};

const CustomerContext = createContext<CustomerContextType>({
  organization: null,
  departments: [],
  stakeholders: [],
  metrics: defaultMetrics,
  isLoading: true,
  isConfigured: false,
  companyName: 'Your Organization',
  primaryContact: 'Admin',
  primaryEmail: 'admin@company.com',
});

export function CustomerProvider({ children }: { children: ReactNode }) {
  const { data: rawOrganizations, isLoading: orgsLoading } = useQuery<any[]>({
    queryKey: ['/api/organizations'],
  });

  const { data: rawDepartments, isLoading: deptsLoading } = useQuery<any[]>({
    queryKey: ['/api/config/departments'],
  });

  const { data: rawMetrics, isLoading: metricsLoading } = useQuery<any[]>({
    queryKey: ['/api/config/success-metrics'],
  });

  const organizations = Array.isArray(rawOrganizations) ? rawOrganizations : [];
  const apiDepartments = Array.isArray(rawDepartments) ? rawDepartments : [];
  const apiMetrics = Array.isArray(rawMetrics) ? rawMetrics : [];

  const organization = organizations[0] || null;
  
  const departments: Department[] = apiDepartments.map((d: any) => ({
    id: d.id?.toString() || d.id,
    name: d.name,
    description: d.description,
    headcount: d.headcount,
    leaderId: d.leader_id || d.leaderId,
    leaderName: d.leader_name || d.leaderName,
  }));

  const friMetric = apiMetrics.find((m: any) => m.metric_type === 'fri' || m.metricType === 'fri');
  const velocityMetric = apiMetrics.find((m: any) => m.metric_type === 'velocity' || m.metricType === 'velocity');
  const coverageMetric = apiMetrics.find((m: any) => m.metric_type === 'coverage' || m.metricType === 'coverage');

  const metrics: CustomerMetrics = {
    friTarget: friMetric?.target_value || friMetric?.targetValue || defaultMetrics.friTarget,
    friCurrent: friMetric?.current_value || friMetric?.currentValue || defaultMetrics.friCurrent,
    velocityTarget: velocityMetric?.target_value || velocityMetric?.targetValue || defaultMetrics.velocityTarget,
    velocityCurrent: velocityMetric?.current_value || velocityMetric?.currentValue || defaultMetrics.velocityCurrent,
    coverageTarget: coverageMetric?.target_value || coverageMetric?.targetValue || defaultMetrics.coverageTarget,
    coverageCurrent: coverageMetric?.current_value || coverageMetric?.currentValue || defaultMetrics.coverageCurrent,
  };

  const isLoading = orgsLoading || deptsLoading || metricsLoading;
  const isConfigured = !!organization && departments.length > 0;

  const companyName = organization?.name || 'Your Organization';
  const primaryContact = organization?.primary_contact || organization?.primaryContact || 'Admin';
  const primaryEmail = organization?.primary_email || organization?.primaryEmail || 'admin@company.com';

  return (
    <CustomerContext.Provider
      value={{
        organization,
        departments,
        stakeholders: [],
        metrics,
        isLoading,
        isConfigured,
        companyName,
        primaryContact,
        primaryEmail,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
}

export function useDepartments() {
  const { departments, isLoading } = useCustomer();
  return { departments, isLoading };
}

export function useCompanyName() {
  const { companyName } = useCustomer();
  return companyName;
}

export function useCustomerMetrics() {
  const { metrics, isLoading } = useCustomer();
  return { metrics, isLoading };
}
