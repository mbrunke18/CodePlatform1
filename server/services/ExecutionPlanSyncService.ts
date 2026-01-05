import { storage } from '../storage';
import { enterpriseJobService } from './EnterpriseJobService';
import { db } from '../db';
import { sql } from 'drizzle-orm';

export type SyncPlatform = 'jira' | 'asana' | 'monday' | 'ms_project' | 'servicenow';
export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'failed' | 'partial';
export type SyncDirection = 'push' | 'pull' | 'bidirectional';

export interface PlatformCredentials {
  accessToken?: string;
  refreshToken?: string;
  apiKey?: string;
  cloudId?: string;
  apiUrl?: string;
  workspaceId?: string;
  expiresAt?: Date;
}

export interface TaskMapping {
  internalTaskId: string;
  externalTaskId: string;
  externalTaskKey?: string;
  externalTaskUrl?: string;
  lastSyncedAt: Date;
  syncStatus: SyncStatus;
}

export interface ExportedProject {
  externalId: string;
  externalKey?: string;
  externalUrl: string;
  tasksCreated: number;
}

export interface SyncResult {
  success: boolean;
  syncRecordId?: string;
  project?: ExportedProject;
  taskMappings?: TaskMapping[];
  errors?: string[];
  warnings?: string[];
}

export interface ExecutionPlatformAdapter {
  platform: SyncPlatform;
  
  validateCredentials(credentials: PlatformCredentials): Promise<boolean>;
  
  createProject(
    credentials: PlatformCredentials,
    projectConfig: {
      name: string;
      description: string;
      key?: string;
      metadata?: Record<string, any>;
    }
  ): Promise<ExportedProject>;
  
  createTask(
    credentials: PlatformCredentials,
    projectId: string,
    task: {
      title: string;
      description: string;
      priority?: string;
      assignee?: string;
      dueDate?: Date;
      labels?: string[];
      parentTaskId?: string;
      customFields?: Record<string, any>;
    }
  ): Promise<{ externalId: string; externalKey?: string; externalUrl: string }>;
  
  updateTaskStatus(
    credentials: PlatformCredentials,
    externalTaskId: string,
    status: string
  ): Promise<boolean>;
  
  getTaskStatus(
    credentials: PlatformCredentials,
    externalTaskId: string
  ): Promise<{ status: string; progress?: number; updatedAt: Date }>;
  
  deleteProject(credentials: PlatformCredentials, projectId: string): Promise<boolean>;
}

class JiraAdapter implements ExecutionPlatformAdapter {
  platform: SyncPlatform = 'jira';
  
  async validateCredentials(credentials: PlatformCredentials): Promise<boolean> {
    if (!credentials.accessToken || !credentials.cloudId) {
      return false;
    }
    
    try {
      const response = await fetch(
        `https://api.atlassian.com/ex/jira/${credentials.cloudId}/rest/api/3/myself`,
        {
          headers: {
            'Authorization': `Bearer ${credentials.accessToken}`,
            'Accept': 'application/json',
          },
        }
      );
      return response.ok;
    } catch {
      return false;
    }
  }
  
  async createProject(
    credentials: PlatformCredentials,
    projectConfig: { name: string; description: string; key?: string; metadata?: Record<string, any> }
  ): Promise<ExportedProject> {
    const projectKey = projectConfig.key || 
      projectConfig.name.replace(/[^a-zA-Z]/g, '').substring(0, 10).toUpperCase();
    
    const response = await fetch(
      `https://api.atlassian.com/ex/jira/${credentials.cloudId}/rest/api/3/project`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${credentials.accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: projectKey,
          name: projectConfig.name,
          description: projectConfig.description,
          projectTypeKey: 'software',
          projectTemplateKey: 'com.pyxis.greenhopper.jira:gh-simplified-agility-kanban',
          leadAccountId: projectConfig.metadata?.leadAccountId,
        }),
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to create Jira project: ${JSON.stringify(error)}`);
    }
    
    const project = await response.json();
    return {
      externalId: project.id,
      externalKey: project.key,
      externalUrl: `https://${credentials.cloudId}.atlassian.net/jira/software/projects/${project.key}`,
      tasksCreated: 0,
    };
  }
  
  async createTask(
    credentials: PlatformCredentials,
    projectId: string,
    task: {
      title: string;
      description: string;
      priority?: string;
      assignee?: string;
      dueDate?: Date;
      labels?: string[];
      parentTaskId?: string;
      customFields?: Record<string, any>;
    }
  ): Promise<{ externalId: string; externalKey?: string; externalUrl: string }> {
    const priorityMap: Record<string, string> = {
      critical: 'Highest',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
    };
    
    const issueData: any = {
      fields: {
        project: { id: projectId },
        summary: task.title,
        description: {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: task.description || task.title }],
            },
          ],
        },
        issuetype: { name: task.parentTaskId ? 'Subtask' : 'Task' },
        priority: task.priority ? { name: priorityMap[task.priority] || 'Medium' } : undefined,
        assignee: task.assignee ? { accountId: task.assignee } : undefined,
        duedate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : undefined,
        labels: task.labels || [],
      },
    };
    
    if (task.parentTaskId) {
      issueData.fields.parent = { id: task.parentTaskId };
    }
    
    const response = await fetch(
      `https://api.atlassian.com/ex/jira/${credentials.cloudId}/rest/api/3/issue`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${credentials.accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(issueData),
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to create Jira issue: ${JSON.stringify(error)}`);
    }
    
    const issue = await response.json();
    return {
      externalId: issue.id,
      externalKey: issue.key,
      externalUrl: `https://${credentials.cloudId}.atlassian.net/browse/${issue.key}`,
    };
  }
  
  async updateTaskStatus(
    credentials: PlatformCredentials,
    externalTaskId: string,
    status: string
  ): Promise<boolean> {
    const transitionsResponse = await fetch(
      `https://api.atlassian.com/ex/jira/${credentials.cloudId}/rest/api/3/issue/${externalTaskId}/transitions`,
      {
        headers: {
          'Authorization': `Bearer ${credentials.accessToken}`,
          'Accept': 'application/json',
        },
      }
    );
    
    if (!transitionsResponse.ok) return false;
    
    const { transitions } = await transitionsResponse.json();
    const transition = transitions.find((t: any) => 
      t.name.toLowerCase() === status.toLowerCase() ||
      t.to.name.toLowerCase() === status.toLowerCase()
    );
    
    if (!transition) return false;
    
    const response = await fetch(
      `https://api.atlassian.com/ex/jira/${credentials.cloudId}/rest/api/3/issue/${externalTaskId}/transitions`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${credentials.accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transition: { id: transition.id } }),
      }
    );
    
    return response.ok;
  }
  
  async getTaskStatus(
    credentials: PlatformCredentials,
    externalTaskId: string
  ): Promise<{ status: string; progress?: number; updatedAt: Date }> {
    const response = await fetch(
      `https://api.atlassian.com/ex/jira/${credentials.cloudId}/rest/api/3/issue/${externalTaskId}?fields=status,updated`,
      {
        headers: {
          'Authorization': `Bearer ${credentials.accessToken}`,
          'Accept': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to get Jira issue status');
    }
    
    const issue = await response.json();
    return {
      status: issue.fields.status.name,
      updatedAt: new Date(issue.fields.updated),
    };
  }
  
  async deleteProject(credentials: PlatformCredentials, projectId: string): Promise<boolean> {
    const response = await fetch(
      `https://api.atlassian.com/ex/jira/${credentials.cloudId}/rest/api/3/project/${projectId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${credentials.accessToken}`,
        },
      }
    );
    return response.ok;
  }
}

class AsanaAdapter implements ExecutionPlatformAdapter {
  platform: SyncPlatform = 'asana';
  
  async validateCredentials(credentials: PlatformCredentials): Promise<boolean> {
    if (!credentials.accessToken) return false;
    
    try {
      const response = await fetch('https://app.asana.com/api/1.0/users/me', {
        headers: { 'Authorization': `Bearer ${credentials.accessToken}` },
      });
      return response.ok;
    } catch {
      return false;
    }
  }
  
  async createProject(
    credentials: PlatformCredentials,
    projectConfig: { name: string; description: string; key?: string; metadata?: Record<string, any> }
  ): Promise<ExportedProject> {
    const response = await fetch('https://app.asana.com/api/1.0/projects', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          name: projectConfig.name,
          notes: projectConfig.description,
          workspace: credentials.workspaceId,
          default_view: 'board',
        },
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to create Asana project: ${JSON.stringify(error)}`);
    }
    
    const { data: project } = await response.json();
    return {
      externalId: project.gid,
      externalUrl: `https://app.asana.com/0/${project.gid}`,
      tasksCreated: 0,
    };
  }
  
  async createTask(
    credentials: PlatformCredentials,
    projectId: string,
    task: {
      title: string;
      description: string;
      priority?: string;
      assignee?: string;
      dueDate?: Date;
      labels?: string[];
      parentTaskId?: string;
      customFields?: Record<string, any>;
    }
  ): Promise<{ externalId: string; externalKey?: string; externalUrl: string }> {
    const taskData: any = {
      data: {
        name: task.title,
        notes: task.description,
        projects: [projectId],
        due_on: task.dueDate ? task.dueDate.toISOString().split('T')[0] : undefined,
        assignee: task.assignee || undefined,
      },
    };
    
    if (task.parentTaskId) {
      taskData.data.parent = task.parentTaskId;
    }
    
    const response = await fetch('https://app.asana.com/api/1.0/tasks', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to create Asana task: ${JSON.stringify(error)}`);
    }
    
    const { data: createdTask } = await response.json();
    return {
      externalId: createdTask.gid,
      externalUrl: `https://app.asana.com/0/${projectId}/${createdTask.gid}`,
    };
  }
  
  async updateTaskStatus(
    credentials: PlatformCredentials,
    externalTaskId: string,
    status: string
  ): Promise<boolean> {
    const completed = status.toLowerCase() === 'done' || status.toLowerCase() === 'complete';
    
    const response = await fetch(`https://app.asana.com/api/1.0/tasks/${externalTaskId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: { completed } }),
    });
    
    return response.ok;
  }
  
  async getTaskStatus(
    credentials: PlatformCredentials,
    externalTaskId: string
  ): Promise<{ status: string; progress?: number; updatedAt: Date }> {
    const response = await fetch(
      `https://app.asana.com/api/1.0/tasks/${externalTaskId}?opt_fields=completed,modified_at`,
      {
        headers: { 'Authorization': `Bearer ${credentials.accessToken}` },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to get Asana task status');
    }
    
    const { data: task } = await response.json();
    return {
      status: task.completed ? 'Done' : 'In Progress',
      updatedAt: new Date(task.modified_at),
    };
  }
  
  async deleteProject(credentials: PlatformCredentials, projectId: string): Promise<boolean> {
    const response = await fetch(`https://app.asana.com/api/1.0/projects/${projectId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${credentials.accessToken}` },
    });
    return response.ok;
  }
}

class MondayAdapter implements ExecutionPlatformAdapter {
  platform: SyncPlatform = 'monday';
  
  private async graphqlRequest(credentials: PlatformCredentials, query: string, variables?: any) {
    const response = await fetch('https://api.monday.com/v2', {
      method: 'POST',
      headers: {
        'Authorization': credentials.apiKey || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });
    
    if (!response.ok) {
      throw new Error(`Monday.com API error: ${response.statusText}`);
    }
    
    const result = await response.json();
    if (result.errors) {
      throw new Error(`Monday.com GraphQL error: ${JSON.stringify(result.errors)}`);
    }
    
    return result.data;
  }
  
  async validateCredentials(credentials: PlatformCredentials): Promise<boolean> {
    if (!credentials.apiKey) return false;
    
    try {
      await this.graphqlRequest(credentials, `query { me { id } }`);
      return true;
    } catch {
      return false;
    }
  }
  
  async createProject(
    credentials: PlatformCredentials,
    projectConfig: { name: string; description: string; key?: string; metadata?: Record<string, any> }
  ): Promise<ExportedProject> {
    const query = `mutation ($boardName: String!, $kind: BoardKind!) {
      create_board(board_name: $boardName, board_kind: $kind, description: "${projectConfig.description}") {
        id
      }
    }`;
    
    const data = await this.graphqlRequest(credentials, query, {
      boardName: projectConfig.name,
      kind: 'public',
    });
    
    return {
      externalId: data.create_board.id,
      externalUrl: `https://${credentials.workspaceId || 'app'}.monday.com/boards/${data.create_board.id}`,
      tasksCreated: 0,
    };
  }
  
  async createTask(
    credentials: PlatformCredentials,
    projectId: string,
    task: {
      title: string;
      description: string;
      priority?: string;
      assignee?: string;
      dueDate?: Date;
      labels?: string[];
      parentTaskId?: string;
      customFields?: Record<string, any>;
    }
  ): Promise<{ externalId: string; externalKey?: string; externalUrl: string }> {
    const query = `mutation ($boardId: ID!, $itemName: String!, $groupId: String) {
      create_item(board_id: $boardId, item_name: $itemName, group_id: $groupId) {
        id
      }
    }`;
    
    const data = await this.graphqlRequest(credentials, query, {
      boardId: projectId,
      itemName: task.title,
      groupId: task.parentTaskId || 'topics',
    });
    
    return {
      externalId: data.create_item.id,
      externalUrl: `https://app.monday.com/boards/${projectId}/pulses/${data.create_item.id}`,
    };
  }
  
  async updateTaskStatus(
    credentials: PlatformCredentials,
    externalTaskId: string,
    status: string
  ): Promise<boolean> {
    return true;
  }
  
  async getTaskStatus(
    credentials: PlatformCredentials,
    externalTaskId: string
  ): Promise<{ status: string; progress?: number; updatedAt: Date }> {
    return { status: 'In Progress', updatedAt: new Date() };
  }
  
  async deleteProject(credentials: PlatformCredentials, projectId: string): Promise<boolean> {
    const query = `mutation ($boardId: ID!) {
      delete_board(board_id: $boardId) { id }
    }`;
    
    try {
      await this.graphqlRequest(credentials, query, { boardId: projectId });
      return true;
    } catch {
      return false;
    }
  }
}

class MSProjectAdapter implements ExecutionPlatformAdapter {
  platform: SyncPlatform = 'ms_project';
  
  async validateCredentials(credentials: PlatformCredentials): Promise<boolean> {
    if (!credentials.accessToken) return false;
    
    try {
      const response = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: { 'Authorization': `Bearer ${credentials.accessToken}` },
      });
      return response.ok;
    } catch {
      return false;
    }
  }
  
  async createProject(
    credentials: PlatformCredentials,
    projectConfig: { name: string; description: string; key?: string; metadata?: Record<string, any> }
  ): Promise<ExportedProject> {
    const response = await fetch('https://graph.microsoft.com/v1.0/planner/plans', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        owner: credentials.workspaceId,
        title: projectConfig.name,
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to create MS Planner plan: ${JSON.stringify(error)}`);
    }
    
    const plan = await response.json();
    return {
      externalId: plan.id,
      externalUrl: `https://tasks.office.com/${credentials.workspaceId}/en-US/Home/Planner/#/plantaskboard?planId=${plan.id}`,
      tasksCreated: 0,
    };
  }
  
  async createTask(
    credentials: PlatformCredentials,
    projectId: string,
    task: {
      title: string;
      description: string;
      priority?: string;
      assignee?: string;
      dueDate?: Date;
      labels?: string[];
      parentTaskId?: string;
      customFields?: Record<string, any>;
    }
  ): Promise<{ externalId: string; externalKey?: string; externalUrl: string }> {
    const priorityMap: Record<string, number> = {
      critical: 0,
      high: 3,
      medium: 5,
      low: 9,
    };
    
    const response = await fetch('https://graph.microsoft.com/v1.0/planner/tasks', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        planId: projectId,
        title: task.title,
        priority: task.priority ? priorityMap[task.priority] || 5 : 5,
        dueDateTime: task.dueDate?.toISOString(),
        assignments: task.assignee ? { [task.assignee]: { '@odata.type': 'microsoft.graph.plannerAssignment' } } : undefined,
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to create Planner task: ${JSON.stringify(error)}`);
    }
    
    const plannerTask = await response.json();
    return {
      externalId: plannerTask.id,
      externalUrl: `https://tasks.office.com/Home/Task/${plannerTask.id}`,
    };
  }
  
  async updateTaskStatus(
    credentials: PlatformCredentials,
    externalTaskId: string,
    status: string
  ): Promise<boolean> {
    const percentComplete = status.toLowerCase() === 'done' ? 100 : 
                           status.toLowerCase() === 'in progress' ? 50 : 0;
    
    const response = await fetch(`https://graph.microsoft.com/v1.0/planner/tasks/${externalTaskId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ percentComplete }),
    });
    
    return response.ok;
  }
  
  async getTaskStatus(
    credentials: PlatformCredentials,
    externalTaskId: string
  ): Promise<{ status: string; progress?: number; updatedAt: Date }> {
    const response = await fetch(`https://graph.microsoft.com/v1.0/planner/tasks/${externalTaskId}`, {
      headers: { 'Authorization': `Bearer ${credentials.accessToken}` },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get Planner task');
    }
    
    const task = await response.json();
    return {
      status: task.percentComplete === 100 ? 'Done' : task.percentComplete > 0 ? 'In Progress' : 'Not Started',
      progress: task.percentComplete,
      updatedAt: new Date(),
    };
  }
  
  async deleteProject(credentials: PlatformCredentials, projectId: string): Promise<boolean> {
    const response = await fetch(`https://graph.microsoft.com/v1.0/planner/plans/${projectId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${credentials.accessToken}` },
    });
    return response.ok;
  }
}

class ServiceNowAdapter implements ExecutionPlatformAdapter {
  platform: SyncPlatform = 'servicenow';
  
  async validateCredentials(credentials: PlatformCredentials): Promise<boolean> {
    if (!credentials.apiUrl || !credentials.accessToken) return false;
    
    try {
      const response = await fetch(`${credentials.apiUrl}/api/now/table/sys_user?sysparm_limit=1`, {
        headers: { 'Authorization': `Bearer ${credentials.accessToken}` },
      });
      return response.ok;
    } catch {
      return false;
    }
  }
  
  async createProject(
    credentials: PlatformCredentials,
    projectConfig: { name: string; description: string; key?: string; metadata?: Record<string, any> }
  ): Promise<ExportedProject> {
    const response = await fetch(`${credentials.apiUrl}/api/now/table/pm_project`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        short_description: projectConfig.name,
        description: projectConfig.description,
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to create ServiceNow project: ${JSON.stringify(error)}`);
    }
    
    const { result: project } = await response.json();
    return {
      externalId: project.sys_id,
      externalKey: project.number,
      externalUrl: `${credentials.apiUrl}/pm_project.do?sys_id=${project.sys_id}`,
      tasksCreated: 0,
    };
  }
  
  async createTask(
    credentials: PlatformCredentials,
    projectId: string,
    task: {
      title: string;
      description: string;
      priority?: string;
      assignee?: string;
      dueDate?: Date;
      labels?: string[];
      parentTaskId?: string;
      customFields?: Record<string, any>;
    }
  ): Promise<{ externalId: string; externalKey?: string; externalUrl: string }> {
    const priorityMap: Record<string, string> = {
      critical: '1',
      high: '2',
      medium: '3',
      low: '4',
    };
    
    const response = await fetch(`${credentials.apiUrl}/api/now/table/pm_project_task`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent: projectId,
        short_description: task.title,
        description: task.description,
        priority: task.priority ? priorityMap[task.priority] || '3' : '3',
        assigned_to: task.assignee,
        due_date: task.dueDate?.toISOString(),
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to create ServiceNow task: ${JSON.stringify(error)}`);
    }
    
    const { result: createdTask } = await response.json();
    return {
      externalId: createdTask.sys_id,
      externalKey: createdTask.number,
      externalUrl: `${credentials.apiUrl}/pm_project_task.do?sys_id=${createdTask.sys_id}`,
    };
  }
  
  async updateTaskStatus(
    credentials: PlatformCredentials,
    externalTaskId: string,
    status: string
  ): Promise<boolean> {
    const stateMap: Record<string, string> = {
      'not started': '-5',
      'pending': '1',
      'in progress': '2',
      'done': '3',
      'complete': '3',
    };
    
    const response = await fetch(`${credentials.apiUrl}/api/now/table/pm_project_task/${externalTaskId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ state: stateMap[status.toLowerCase()] || '2' }),
    });
    
    return response.ok;
  }
  
  async getTaskStatus(
    credentials: PlatformCredentials,
    externalTaskId: string
  ): Promise<{ status: string; progress?: number; updatedAt: Date }> {
    const response = await fetch(
      `${credentials.apiUrl}/api/now/table/pm_project_task/${externalTaskId}?sysparm_fields=state,sys_updated_on`,
      {
        headers: { 'Authorization': `Bearer ${credentials.accessToken}` },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to get ServiceNow task');
    }
    
    const { result: task } = await response.json();
    const stateNames: Record<string, string> = {
      '-5': 'Not Started',
      '1': 'Pending',
      '2': 'In Progress',
      '3': 'Complete',
    };
    
    return {
      status: stateNames[task.state] || 'Unknown',
      updatedAt: new Date(task.sys_updated_on),
    };
  }
  
  async deleteProject(credentials: PlatformCredentials, projectId: string): Promise<boolean> {
    const response = await fetch(`${credentials.apiUrl}/api/now/table/pm_project/${projectId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${credentials.accessToken}` },
    });
    return response.ok;
  }
}

export class ExecutionPlanSyncService {
  private adapters: Map<SyncPlatform, ExecutionPlatformAdapter>;
  
  constructor() {
    this.adapters = new Map([
      ['jira', new JiraAdapter()],
      ['asana', new AsanaAdapter()],
      ['monday', new MondayAdapter()],
      ['ms_project', new MSProjectAdapter()],
      ['servicenow', new ServiceNowAdapter()],
    ]);
  }
  
  getAdapter(platform: SyncPlatform): ExecutionPlatformAdapter | undefined {
    return this.adapters.get(platform);
  }
  
  async exportExecutionPlan(
    executionInstanceId: string,
    templateId: string,
    integrationId: string
  ): Promise<SyncResult> {
    console.log(`[ExecutionPlanSyncService] Starting export for instance ${executionInstanceId}`);
    
    try {
      const template = await storage.getExportTemplate(templateId);
      if (!template) {
        return { success: false, errors: ['Export template not found'] };
      }
      
      const integration = await storage.getEnterpriseIntegration(integrationId);
      if (!integration) {
        return { success: false, errors: ['Integration not found'] };
      }
      
      const adapter = this.adapters.get(template.platform as SyncPlatform);
      if (!adapter) {
        return { success: false, errors: [`No adapter available for platform: ${template.platform}`] };
      }
      
      const credentials = this.extractCredentials(integration);
      const isValid = await adapter.validateCredentials(credentials);
      if (!isValid) {
        return { success: false, errors: ['Invalid or expired credentials'] };
      }
      
      const instanceResult = await db.execute(
        sql`SELECT ei.*, ss.title as scenario_title, ss.description as scenario_description
            FROM execution_instances ei
            LEFT JOIN strategic_scenarios ss ON ei.scenario_id = ss.id
            WHERE ei.id = ${executionInstanceId}`
      );
      
      if (!instanceResult.rows[0]) {
        return { success: false, errors: ['Execution instance not found'] };
      }
      
      const instance = instanceResult.rows[0] as any;
      
      const projectName = this.interpolateTemplate(
        template.project_name_template || '{{scenario_title}} - Execution',
        { scenario_title: instance.scenario_title, instance_id: executionInstanceId }
      );
      
      const projectDescription = this.interpolateTemplate(
        template.project_description_template || 'M Strategic Execution Plan for {{scenario_title}}',
        { scenario_title: instance.scenario_title, scenario_description: instance.scenario_description }
      );
      
      const project = await adapter.createProject(credentials, {
        name: projectName,
        description: projectDescription,
        metadata: template.custom_fields,
      });
      
      const tasksResult = await db.execute(
        sql`SELECT ept.*, epp.name as phase_name
            FROM execution_plan_tasks ept
            LEFT JOIN execution_plan_phases epp ON ept.phase_id = epp.id
            LEFT JOIN scenario_execution_plans sep ON epp.plan_id = sep.id
            WHERE sep.scenario_id = ${instance.scenario_id}
            ORDER BY epp.sequence_order, ept.sequence_order`
      );
      
      const tasks = tasksResult.rows as any[];
      const taskMappings: TaskMapping[] = [];
      const errors: string[] = [];
      
      for (const task of tasks) {
        try {
          const externalTask = await adapter.createTask(credentials, project.externalId, {
            title: task.name,
            description: task.description || '',
            priority: this.mapPriority(task.priority),
            dueDate: task.due_date ? new Date(task.due_date) : undefined,
            labels: template.default_labels || [],
          });
          
          taskMappings.push({
            internalTaskId: task.id,
            externalTaskId: externalTask.externalId,
            externalTaskKey: externalTask.externalKey,
            externalTaskUrl: externalTask.externalUrl,
            lastSyncedAt: new Date(),
            syncStatus: 'synced',
          });
          
          project.tasksCreated++;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          errors.push(`Failed to create task "${task.name}": ${errorMessage}`);
          taskMappings.push({
            internalTaskId: task.id,
            externalTaskId: '',
            lastSyncedAt: new Date(),
            syncStatus: 'failed',
          });
        }
      }
      
      const syncRecord = await storage.createSyncRecord({
        executionInstanceId,
        exportTemplateId: templateId,
        integrationId,
        externalProjectId: project.externalId,
        externalProjectUrl: project.externalUrl,
        externalProjectKey: project.externalKey,
        syncStatus: errors.length === 0 ? 'synced' : 'partial',
        taskSyncMap: taskMappings.reduce((acc, m) => {
          acc[m.internalTaskId] = {
            externalId: m.externalTaskId,
            externalKey: m.externalTaskKey,
            externalUrl: m.externalTaskUrl,
            status: m.syncStatus,
          };
          return acc;
        }, {} as Record<string, any>),
        tasksCreated: project.tasksCreated,
        tasksSynced: taskMappings.filter(m => m.syncStatus === 'synced').length,
        lastSyncedAt: new Date().toISOString(),
        lastSyncDirection: 'push',
      });
      
      console.log(`[ExecutionPlanSyncService] Export completed. Project: ${project.externalUrl}, Tasks: ${project.tasksCreated}`);
      
      return {
        success: errors.length === 0,
        syncRecordId: syncRecord.id,
        project,
        taskMappings,
        errors: errors.length > 0 ? errors : undefined,
      };
      
    } catch (error) {
      console.error('[ExecutionPlanSyncService] Export failed:', error);
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Unknown error during export'],
      };
    }
  }
  
  async syncTaskStatus(syncRecordId: string, direction: 'push' | 'pull' = 'pull'): Promise<{
    success: boolean;
    updated: number;
    errors?: string[];
  }> {
    console.log(`[ExecutionPlanSyncService] Syncing task status for record ${syncRecordId}, direction: ${direction}`);
    
    try {
      const syncRecord = await storage.getSyncRecord(syncRecordId);
      if (!syncRecord) {
        return { success: false, updated: 0, errors: ['Sync record not found'] };
      }
      
      const integration = await storage.getEnterpriseIntegration(syncRecord.integration_id);
      if (!integration) {
        return { success: false, updated: 0, errors: ['Integration not found'] };
      }
      
      const adapter = this.adapters.get(syncRecord.platform as SyncPlatform);
      if (!adapter) {
        return { success: false, updated: 0, errors: [`No adapter for platform: ${syncRecord.platform}`] };
      }
      
      const credentials = this.extractCredentials(integration);
      const taskSyncMap = syncRecord.task_sync_map as Record<string, any> || {};
      let updated = 0;
      const errors: string[] = [];
      
      if (direction === 'pull') {
        for (const [internalTaskId, mapping] of Object.entries(taskSyncMap)) {
          if (!mapping.externalId) continue;
          
          try {
            const status = await adapter.getTaskStatus(credentials, mapping.externalId);
            
            await db.execute(
              sql`UPDATE execution_plan_tasks SET 
                  status = ${this.mapExternalStatus(status.status)},
                  updated_at = NOW()
                  WHERE id = ${internalTaskId}`
            );
            
            updated++;
          } catch (error) {
            errors.push(`Failed to sync task ${internalTaskId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
      } else {
        const tasksResult = await db.execute(
          sql`SELECT id, status FROM execution_plan_tasks WHERE id = ANY(${Object.keys(taskSyncMap)}::uuid[])`
        );
        
        for (const task of tasksResult.rows as any[]) {
          const mapping = taskSyncMap[task.id];
          if (!mapping?.externalId) continue;
          
          try {
            const success = await adapter.updateTaskStatus(
              credentials,
              mapping.externalId,
              this.mapInternalStatus(task.status)
            );
            
            if (success) updated++;
          } catch (error) {
            errors.push(`Failed to update external task ${mapping.externalId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
      }
      
      await storage.updateSyncRecord(syncRecordId, {
        lastSyncedAt: new Date().toISOString(),
        lastSyncDirection: direction,
        tasksSynced: updated,
        syncErrors: errors.length > 0 ? errors : null,
      });
      
      return {
        success: errors.length === 0,
        updated,
        errors: errors.length > 0 ? errors : undefined,
      };
      
    } catch (error) {
      console.error('[ExecutionPlanSyncService] Status sync failed:', error);
      return {
        success: false,
        updated: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }
  
  async scheduleBackgroundSync(syncRecordId: string, intervalMinutes: number = 5): Promise<string> {
    const jobId = await enterpriseJobService.addAnalysisJob({
      type: 'execution_plan_sync' as any,
      organizationId: 'system',
      scheduledBy: 'execution_plan_sync_service',
      metadata: { syncRecordId, direction: 'bidirectional' },
    }, intervalMinutes * 60 * 1000);
    
    console.log(`[ExecutionPlanSyncService] Scheduled background sync job ${jobId} for record ${syncRecordId}`);
    return jobId;
  }
  
  private extractCredentials(integration: any): PlatformCredentials {
    const config = integration.configuration || {};
    return {
      accessToken: config.accessToken || config.access_token,
      refreshToken: config.refreshToken || config.refresh_token,
      apiKey: config.apiKey || config.api_key,
      cloudId: config.cloudId || config.cloud_id,
      apiUrl: config.apiUrl || config.api_url || integration.api_endpoint,
      workspaceId: config.workspaceId || config.workspace_id,
      expiresAt: config.expiresAt ? new Date(config.expiresAt) : undefined,
    };
  }
  
  private interpolateTemplate(template: string, variables: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return variables[key] !== undefined ? String(variables[key]) : match;
    });
  }
  
  private mapPriority(internal: string | null): string {
    const map: Record<string, string> = {
      critical: 'critical',
      high: 'high',
      medium: 'medium',
      low: 'low',
      urgent: 'critical',
    };
    return map[(internal || 'medium').toLowerCase()] || 'medium';
  }
  
  private mapExternalStatus(external: string): string {
    const normalized = external.toLowerCase();
    if (normalized.includes('done') || normalized.includes('complete') || normalized.includes('closed')) {
      return 'completed';
    }
    if (normalized.includes('progress') || normalized.includes('active')) {
      return 'in_progress';
    }
    if (normalized.includes('review') || normalized.includes('testing')) {
      return 'in_review';
    }
    if (normalized.includes('block') || normalized.includes('hold')) {
      return 'blocked';
    }
    return 'pending';
  }
  
  private mapInternalStatus(internal: string): string {
    const map: Record<string, string> = {
      pending: 'To Do',
      in_progress: 'In Progress',
      in_review: 'In Review',
      completed: 'Done',
      blocked: 'Blocked',
    };
    return map[internal] || 'To Do';
  }
}

export const executionPlanSyncService = new ExecutionPlanSyncService();
