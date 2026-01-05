import { integrationManager } from "./integrationManager";
import { db } from "../db";
import { enterpriseIntegrations, tasks, strategicScenarios } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface SlackChannelConfig {
  name: string;
  isPrivate?: boolean;
  members?: string[]; // Slack user IDs
  topic?: string;
  description?: string;
}

export interface JiraTaskConfig {
  summary: string;
  description?: string;
  projectKey: string;
  issueType?: string;
  priority?: string;
  assignee?: string;
  dueDate?: string;
}

export interface CalendarEventConfig {
  summary: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  attendees?: string[]; // Email addresses
  location?: string;
}

export class SyncEngine {
  
  /**
   * Create a Slack channel and invite members
   */
  async createSlackChannel(
    integrationId: string, 
    config: SlackChannelConfig
  ): Promise<{ success: boolean; channelId?: string; error?: string }> {
    try {
      const credentials = await integrationManager.getCredentials(integrationId);
      if (!credentials) {
        return { success: false, error: 'Integration credentials not found' };
      }
      
      const accessToken = credentials.data.access_token;
      
      // Create channel
      const createResponse = await fetch('https://slack.com/api/conversations.create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: config.name.replace(/[^a-z0-9-_]/g, '-').toLowerCase(),
          is_private: config.isPrivate || false,
        }),
      });
      
      const createData = await createResponse.json();
      
      if (!createData.ok) {
        return { success: false, error: createData.error };
      }
      
      const channelId = createData.channel.id;
      
      // Set topic if provided
      if (config.topic) {
        await fetch('https://slack.com/api/conversations.setTopic', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            channel: channelId,
            topic: config.topic,
          }),
        });
      }
      
      // Invite members if provided
      if (config.members && config.members.length > 0) {
        await fetch('https://slack.com/api/conversations.invite', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            channel: channelId,
            users: config.members.join(','),
          }),
        });
      }
      
      return { success: true, channelId };
      
    } catch (error) {
      console.error('Failed to create Slack channel:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
  
  /**
   * Send a Slack message to a channel
   */
  async sendSlackMessage(
    integrationId: string,
    channelId: string,
    message: string,
    options?: { threadTs?: string; attachments?: any[] }
  ): Promise<{ success: boolean; ts?: string; error?: string }> {
    try {
      const credentials = await integrationManager.getCredentials(integrationId);
      if (!credentials) {
        return { success: false, error: 'Integration credentials not found' };
      }
      
      const response = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${credentials.data.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channel: channelId,
          text: message,
          thread_ts: options?.threadTs,
          attachments: options?.attachments,
        }),
      });
      
      const data = await response.json();
      
      if (!data.ok) {
        return { success: false, error: data.error };
      }
      
      return { success: true, ts: data.ts };
      
    } catch (error) {
      console.error('Failed to send Slack message:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
  
  /**
   * Create Jira tasks/issues
   */
  async createJiraTasks(
    integrationId: string,
    tasks: JiraTaskConfig[]
  ): Promise<{ success: boolean; created: string[]; errors: string[] }> {
    const created: string[] = [];
    const errors: string[] = [];
    
    try {
      const credentials = await integrationManager.getCredentials(integrationId);
      if (!credentials) {
        return { 
          success: false, 
          created: [], 
          errors: ['Integration credentials not found'] 
        };
      }
      
      const accessToken = credentials.data.access_token;
      const apiUrl = credentials.data.api_url || credentials.data.cloudid;
      
      for (const task of tasks) {
        try {
          const response = await fetch(`${apiUrl}/rest/api/3/issue`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fields: {
                project: { key: task.projectKey },
                summary: task.summary,
                description: {
                  type: 'doc',
                  version: 1,
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: task.description || task.summary,
                        },
                      ],
                    },
                  ],
                },
                issuetype: { name: task.issueType || 'Task' },
                priority: task.priority ? { name: task.priority } : undefined,
                assignee: task.assignee ? { accountId: task.assignee } : undefined,
                duedate: task.dueDate,
              },
            }),
          });
          
          const data = await response.json();
          
          if (response.ok) {
            created.push(data.key);
          } else {
            errors.push(`Failed to create "${task.summary}": ${JSON.stringify(data.errors || data.errorMessages)}`);
          }
          
        } catch (error) {
          errors.push(`Failed to create "${task.summary}": ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
      
      return {
        success: errors.length === 0,
        created,
        errors,
      };
      
    } catch (error) {
      console.error('Failed to create Jira tasks:', error);
      return {
        success: false,
        created,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }
  
  /**
   * Update Jira task status
   */
  async updateJiraTaskStatus(
    integrationId: string,
    issueKey: string,
    status: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const credentials = await integrationManager.getCredentials(integrationId);
      if (!credentials) {
        return { success: false, error: 'Integration credentials not found' };
      }
      
      const accessToken = credentials.data.access_token;
      const apiUrl = credentials.data.api_url || credentials.data.cloudid;
      
      // Get available transitions
      const transitionsResponse = await fetch(
        `${apiUrl}/rest/api/3/issue/${issueKey}/transitions`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      
      const transitionsData = await transitionsResponse.json();
      const transition = transitionsData.transitions.find(
        (t: any) => t.name.toLowerCase() === status.toLowerCase()
      );
      
      if (!transition) {
        return { success: false, error: `Transition "${status}" not found` };
      }
      
      // Execute transition
      const response = await fetch(
        `${apiUrl}/rest/api/3/issue/${issueKey}/transitions`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transition: { id: transition.id },
          }),
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: JSON.stringify(error) };
      }
      
      return { success: true };
      
    } catch (error) {
      console.error('Failed to update Jira task:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
  
  /**
   * Schedule a Google Calendar event
   */
  async scheduleCalendarEvent(
    integrationId: string,
    config: CalendarEventConfig
  ): Promise<{ success: boolean; eventId?: string; error?: string }> {
    try {
      const credentials = await integrationManager.getCredentials(integrationId);
      if (!credentials) {
        return { success: false, error: 'Integration credentials not found' };
      }
      
      const response = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${credentials.data.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            summary: config.summary,
            description: config.description,
            location: config.location,
            start: {
              dateTime: config.startTime.toISOString(),
              timeZone: 'UTC',
            },
            end: {
              dateTime: config.endTime.toISOString(),
              timeZone: 'UTC',
            },
            attendees: config.attendees?.map(email => ({ email })),
            reminders: {
              useDefault: false,
              overrides: [
                { method: 'email', minutes: 24 * 60 },
                { method: 'popup', minutes: 30 },
              ],
            },
          }),
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error?.message || 'Failed to create event' };
      }
      
      return { success: true, eventId: data.id };
      
    } catch (error) {
      console.error('Failed to schedule calendar event:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
  
  /**
   * Send email notifications
   */
  async sendEmailNotifications(
    recipients: string[],
    subject: string,
    body: string
  ): Promise<{ success: boolean; sent: number; errors: string[] }> {
    // For now, this would use a service like SendGrid or AWS SES
    // Placeholder implementation
    console.log('Email notification:', { recipients, subject });
    
    return {
      success: true,
      sent: recipients.length,
      errors: [],
    };
  }
  
  /**
   * Execute full playbook activation with all integrations
   * This is the "magic" moment - one click creates everything
   */
  async executePlaybookActivation(
    scenarioId: string,
    integrations: {
      slack?: string; // integration ID
      jira?: string;
      calendar?: string;
    }
  ): Promise<{ success: boolean; results: any; errors: string[] }> {
    const errors: string[] = [];
    const results: any = {
      slack: null,
      jira: null,
      calendar: null,
    };
    
    try {
      // Get scenario details
      const [scenario] = await db.select()
        .from(strategicScenarios)
        .where(eq(strategicScenarios.id, scenarioId))
        .limit(1);
      
      if (!scenario) {
        return { success: false, results, errors: ['Scenario not found'] };
      }
      
      // Get scenario tasks
      const scenarioTasks = await db.select()
        .from(tasks)
        .where(eq(tasks.scenarioId, scenarioId));
      
      // 1. Create Slack channel
      if (integrations.slack) {
        const slackResult = await this.createSlackChannel(integrations.slack, {
          name: `crisis-${new Date().toISOString().split('T')[0]}`,
          topic: scenario.title,
          description: scenario.description || undefined,
        });
        
        results.slack = slackResult;
        if (!slackResult.success) {
          errors.push(`Slack: ${slackResult.error}`);
        }
      }
      
      // 2. Create Jira tasks
      if (integrations.jira && scenarioTasks.length > 0) {
        const jiraTasks: JiraTaskConfig[] = scenarioTasks.map(task => ({
          summary: task.description,
          projectKey: 'CRISIS', // This should come from integration config
          issueType: 'Task',
          priority: task.priority === 'high' ? 'High' : 'Medium',
          assignee: task.assignedTo || undefined,
        }));
        
        const jiraResult = await this.createJiraTasks(integrations.jira, jiraTasks);
        results.jira = jiraResult;
        
        if (!jiraResult.success) {
          errors.push(...jiraResult.errors);
        }
      }
      
      // 3. Schedule calendar event
      if (integrations.calendar) {
        const now = new Date();
        const calendarResult = await this.scheduleCalendarEvent(integrations.calendar, {
          summary: `War Room: ${scenario.title}`,
          description: scenario.description || undefined,
          startTime: now,
          endTime: new Date(now.getTime() + 60 * 60 * 1000), // 1 hour
        });
        
        results.calendar = calendarResult;
        if (!calendarResult.success) {
          errors.push(`Calendar: ${calendarResult.error}`);
        }
      }
      
      return {
        success: errors.length === 0,
        results,
        errors,
      };
      
    } catch (error) {
      console.error('Playbook activation failed:', error);
      return {
        success: false,
        results,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }
}

// Export singleton instance
export const syncEngine = new SyncEngine();
