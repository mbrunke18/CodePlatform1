import { integrationManager } from "./integrationManager";
import { db } from "../db";
import { enterpriseIntegrations } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface Stakeholder {
  id: string;
  name: string;
  email: string;
  role?: string;
  department?: string;
  avatar?: string;
}

export interface CommunicationChannel {
  id: string;
  name: string;
  type: 'slack' | 'teams' | 'email';
  memberCount?: number;
}

export interface Project {
  id: string;
  key: string;
  name: string;
  description?: string;
  lead?: string;
}

export class DataSourceService {
  
  /**
   * Query stakeholders from Active Directory or similar
   */
  async queryStakeholders(
    integrationId: string, 
    filters?: { department?: string; role?: string; level?: string }
  ): Promise<Stakeholder[]> {
    try {
      const credentials = await integrationManager.getCredentials(integrationId);
      if (!credentials) {
        throw new Error('Integration credentials not found');
      }
      
      const [integration] = await db.select()
        .from(enterpriseIntegrations)
        .where(eq(enterpriseIntegrations.id, integrationId))
        .limit(1);
      
      if (!integration) {
        throw new Error('Integration not found');
      }
      
      // Route to appropriate handler based on vendor
      switch (integration.vendor) {
        case 'microsoft':
          return await this.queryMicrosoftAD(credentials, filters);
        case 'google':
          return await this.queryGoogleWorkspace(credentials, filters);
        default:
          // Return mock data for now
          return this.getMockStakeholders(filters);
      }
      
    } catch (error) {
      console.error('Failed to query stakeholders:', error);
      throw error;
    }
  }
  
  /**
   * Query communication channels (Slack, Teams, etc.)
   */
  async queryCommunicationChannels(integrationId: string): Promise<CommunicationChannel[]> {
    try {
      const credentials = await integrationManager.getCredentials(integrationId);
      if (!credentials) {
        throw new Error('Integration credentials not found');
      }
      
      const [integration] = await db.select()
        .from(enterpriseIntegrations)
        .where(eq(enterpriseIntegrations.id, integrationId))
        .limit(1);
      
      if (!integration) {
        throw new Error('Integration not found');
      }
      
      switch (integration.vendor) {
        case 'slack':
          return await this.querySlackChannels(credentials);
        case 'microsoft':
          return await this.queryTeamsChannels(credentials);
        default:
          return this.getMockChannels();
      }
      
    } catch (error) {
      console.error('Failed to query channels:', error);
      throw error;
    }
  }
  
  /**
   * Query projects from Jira, Asana, etc.
   */
  async queryProjects(integrationId: string): Promise<Project[]> {
    try {
      const credentials = await integrationManager.getCredentials(integrationId);
      if (!credentials) {
        throw new Error('Integration credentials not found');
      }
      
      const [integration] = await db.select()
        .from(enterpriseIntegrations)
        .where(eq(enterpriseIntegrations.id, integrationId))
        .limit(1);
      
      if (!integration) {
        throw new Error('Integration not found');
      }
      
      switch (integration.vendor) {
        case 'jira':
          return await this.queryJiraProjects(credentials);
        case 'asana':
          return await this.queryAsanaProjects(credentials);
        case 'linear':
          return await this.queryLinearProjects(credentials);
        default:
          return this.getMockProjects();
      }
      
    } catch (error) {
      console.error('Failed to query projects:', error);
      throw error;
    }
  }
  
  // ============ Microsoft Active Directory ============
  
  private async queryMicrosoftAD(credentials: any, filters?: any): Promise<Stakeholder[]> {
    try {
      const accessToken = credentials.data.access_token;
      
      let url = 'https://graph.microsoft.com/v1.0/users?$select=id,displayName,mail,jobTitle,department';
      
      if (filters?.department) {
        url += `&$filter=department eq '${filters.department}'`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Microsoft Graph API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return data.value.map((user: any) => ({
        id: user.id,
        name: user.displayName,
        email: user.mail || user.userPrincipalName,
        role: user.jobTitle,
        department: user.department,
      }));
      
    } catch (error) {
      console.error('Microsoft AD query failed:', error);
      return this.getMockStakeholders(filters);
    }
  }
  
  // ============ Google Workspace ============
  
  private async queryGoogleWorkspace(credentials: any, filters?: any): Promise<Stakeholder[]> {
    try {
      const accessToken = credentials.data.access_token;
      
      const response = await fetch('https://www.googleapis.com/admin/directory/v1/users', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Google API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return data.users.map((user: any) => ({
        id: user.id,
        name: user.name.fullName,
        email: user.primaryEmail,
        role: user.organizations?.[0]?.title,
        department: user.organizations?.[0]?.department,
        avatar: user.thumbnailPhotoUrl,
      }));
      
    } catch (error) {
      console.error('Google Workspace query failed:', error);
      return this.getMockStakeholders(filters);
    }
  }
  
  // ============ Slack ============
  
  private async querySlackChannels(credentials: any): Promise<CommunicationChannel[]> {
    try {
      const accessToken = credentials.data.access_token;
      
      const response = await fetch('https://slack.com/api/conversations.list', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!data.ok) {
        throw new Error(`Slack API error: ${data.error}`);
      }
      
      return data.channels.map((channel: any) => ({
        id: channel.id,
        name: `#${channel.name}`,
        type: 'slack' as const,
        memberCount: channel.num_members,
      }));
      
    } catch (error) {
      console.error('Slack query failed:', error);
      return this.getMockChannels();
    }
  }
  
  // ============ Microsoft Teams ============
  
  private async queryTeamsChannels(credentials: any): Promise<CommunicationChannel[]> {
    try {
      const accessToken = credentials.data.access_token;
      
      const response = await fetch('https://graph.microsoft.com/v1.0/me/joinedTeams', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      const data = await response.json();
      
      const channels: CommunicationChannel[] = [];
      
      for (const team of data.value) {
        const channelResponse = await fetch(
          `https://graph.microsoft.com/v1.0/teams/${team.id}/channels`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );
        
        const channelData = await channelResponse.json();
        
        channelData.value.forEach((channel: any) => {
          channels.push({
            id: channel.id,
            name: `${team.displayName} - ${channel.displayName}`,
            type: 'teams' as const,
          });
        });
      }
      
      return channels;
      
    } catch (error) {
      console.error('Teams query failed:', error);
      return this.getMockChannels();
    }
  }
  
  // ============ Jira ============
  
  private async queryJiraProjects(credentials: any): Promise<Project[]> {
    try {
      const accessToken = credentials.data.access_token;
      const apiUrl = credentials.data.api_url || credentials.data.cloudid;
      
      const response = await fetch(`${apiUrl}/rest/api/3/project`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Jira API error: ${response.statusText}`);
      }
      
      const projects = await response.json();
      
      return projects.map((project: any) => ({
        id: project.id,
        key: project.key,
        name: project.name,
        description: project.description,
        lead: project.lead?.displayName,
      }));
      
    } catch (error) {
      console.error('Jira query failed:', error);
      return this.getMockProjects();
    }
  }
  
  // ============ Asana ============
  
  private async queryAsanaProjects(credentials: any): Promise<Project[]> {
    try {
      const accessToken = credentials.data.access_token;
      
      const response = await fetch('https://app.asana.com/api/1.0/projects', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      const data = await response.json();
      
      return data.data.map((project: any) => ({
        id: project.gid,
        key: project.gid,
        name: project.name,
        description: project.notes,
      }));
      
    } catch (error) {
      console.error('Asana query failed:', error);
      return this.getMockProjects();
    }
  }
  
  // ============ Linear ============
  
  private async queryLinearProjects(credentials: any): Promise<Project[]> {
    try {
      const accessToken = credentials.data.access_token;
      
      const query = `
        query {
          projects {
            nodes {
              id
              name
              description
              lead {
                name
              }
            }
          }
        }
      `;
      
      const response = await fetch('https://api.linear.app/graphql', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      const data = await response.json();
      
      return data.data.projects.nodes.map((project: any) => ({
        id: project.id,
        key: project.id,
        name: project.name,
        description: project.description,
        lead: project.lead?.name,
      }));
      
    } catch (error) {
      console.error('Linear query failed:', error);
      return this.getMockProjects();
    }
  }
  
  // ============ Mock Data (Fallbacks) ============
  
  private getMockStakeholders(filters?: any): Stakeholder[] {
    const allStakeholders = [
      { id: '1', name: 'Sarah Chen', email: 'sarah.chen@company.com', role: 'CTO', department: 'Engineering' },
      { id: '2', name: 'Michael Rodriguez', email: 'michael.r@company.com', role: 'VP Legal', department: 'Legal' },
      { id: '3', name: 'Jennifer Park', email: 'jennifer.p@company.com', role: 'CMO', department: 'Marketing' },
      { id: '4', name: 'David Thompson', email: 'david.t@company.com', role: 'CFO', department: 'Finance' },
      { id: '5', name: 'Lisa Anderson', email: 'lisa.a@company.com', role: 'CISO', department: 'Security' },
      { id: '6', name: 'James Wilson', email: 'james.w@company.com', role: 'VP Product', department: 'Product' },
      { id: '7', name: 'Emily Martinez', email: 'emily.m@company.com', role: 'VP Communications', department: 'Communications' },
      { id: '8', name: 'Robert Johnson', email: 'robert.j@company.com', role: 'VP Engineering', department: 'Engineering' },
    ];
    
    if (filters?.department) {
      return allStakeholders.filter(s => s.department === filters.department);
    }
    
    return allStakeholders;
  }
  
  private getMockChannels(): CommunicationChannel[] {
    return [
      { id: '1', name: '#general', type: 'slack', memberCount: 450 },
      { id: '2', name: '#engineering', type: 'slack', memberCount: 125 },
      { id: '3', name: '#executive-team', type: 'slack', memberCount: 12 },
      { id: '4', name: '#legal', type: 'slack', memberCount: 15 },
      { id: '5', name: '#pr-comms', type: 'slack', memberCount: 22 },
    ];
  }
  
  private getMockProjects(): Project[] {
    return [
      { id: '1', key: 'ENG', name: 'Engineering Projects', description: 'Main engineering work' },
      { id: '2', key: 'OPS', name: 'Operations', description: 'Operational initiatives' },
      { id: '3', key: 'CRISIS', name: 'Crisis Response', description: 'Emergency response tracking' },
      { id: '4', key: 'PROD', name: 'Product Development', description: 'Product roadmap items' },
    ];
  }
  
  /**
   * Transform external data to M format
   * This is where we handle different data structures from various sources
   */
  transformData(rawData: any, transformFunction: string): any {
    switch (transformFunction) {
      case 'transformADUsers':
        return this.transformADUsers(rawData);
      case 'transformJiraProjects':
        return this.transformJiraProjects(rawData);
      case 'transformSlackChannels':
        return this.transformSlackChannels(rawData);
      default:
        return rawData;
    }
  }
  
  private transformADUsers(users: any[]): Stakeholder[] {
    return users.map(user => ({
      id: user.id || user.objectId,
      name: user.displayName || user.name,
      email: user.mail || user.email || user.userPrincipalName,
      role: user.jobTitle || user.role,
      department: user.department,
      avatar: user.thumbnailPhotoUrl || user.avatar,
    }));
  }
  
  private transformJiraProjects(projects: any[]): Project[] {
    return projects.map(project => ({
      id: project.id,
      key: project.key,
      name: project.name,
      description: project.description,
      lead: project.lead?.displayName || project.lead?.name,
    }));
  }
  
  private transformSlackChannels(channels: any[]): CommunicationChannel[] {
    return channels.map(channel => ({
      id: channel.id,
      name: channel.name.startsWith('#') ? channel.name : `#${channel.name}`,
      type: 'slack' as const,
      memberCount: channel.num_members || channel.memberCount,
    }));
  }
}

// Export singleton instance
export const dataSourceService = new DataSourceService();
