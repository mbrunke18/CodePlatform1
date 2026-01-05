import { apiRequest } from "./queryClient";

export interface Organization {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  status: string;
  createdAt: string;
}

export interface StrategicScenario {
  id: string;
  title: string;
  description?: string;
  createdBy: string;
  organizationId: string;
  status: string;
  createdAt: string;
  creatorName?: string;
  taskCount?: number;
}

export interface Task {
  id: string;
  scenarioId: string;
  description: string;
  priority: string;
  status: string;
  completed?: string;
  dueDate?: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  userId: string;
  action: string;
  entityType?: string;
  entityId?: string;
  createdAt: string;
  userName: string;
}

export interface Metrics {
  activeScenarios: number;
  pendingTasks: number;
  teamMembers: number;
  agilityScore: number;
}

export const api = {
  // Organizations
  createOrganization: async (data: { name: string; description?: string }) => {
    const response = await apiRequest("POST", "/api/organizations", data);
    return response.json();
  },

  getOrganizations: async (): Promise<Organization[]> => {
    const response = await apiRequest("GET", "/api/organizations");
    return response.json();
  },

  // Scenarios
  createScenario: async (data: { 
    title: string; 
    description?: string; 
    organizationId: string;
    actionableSteps?: { description: string; priority: string }[];
  }) => {
    const response = await apiRequest("POST", "/api/scenarios", data);
    return response.json();
  },

  getRecentScenarios: async (): Promise<StrategicScenario[]> => {
    const response = await apiRequest("GET", "/api/scenarios/recent");
    return response.json();
  },

  // Tasks
  getPriorityTasks: async (): Promise<Task[]> => {
    const response = await apiRequest("GET", "/api/tasks/priority");
    return response.json();
  },

  updateTaskStatus: async (taskId: string, completed: boolean) => {
    const response = await apiRequest("PATCH", `/api/tasks/${taskId}/status`, { completed });
    return response.json();
  },

  // Activities
  getRecentActivities: async (): Promise<Activity[]> => {
    const response = await apiRequest("GET", "/api/activities/recent");
    return response.json();
  },

  // Metrics
  getDashboardMetrics: async (): Promise<Metrics> => {
    const response = await apiRequest("GET", "/api/dashboard/metrics");
    return response.json();
  },

  // AI Co-pilot
  askAI: async (query: string) => {
    const response = await apiRequest("POST", "/api/ai/analyze", { query });
    return response.json();
  },

  // Create scenario from template
  createScenarioFromTemplate: async (templateId: string, customData: any) => {
    const response = await apiRequest("POST", "/api/scenarios/from-template", { templateId, customData });
    return response.json();
  },
};
