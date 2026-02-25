import { 
  IntegrationAdapter, 
  StandardTaskPayload, 
  StandardNotificationPayload, 
  AdapterResult, 
  IntegrationConfig 
} from '../IntegrationAdapter';

export interface SalesforceOpportunity {
  Id: string;
  Name: string;
  AccountId: string;
  Account: { Name: string };
  Amount: number;
  Probability: number;
  CloseDate: string;
  StageName: string;
  Budget_Approval_Status__c?: string;
  Engagement_Score__c?: number;
  LastActivityDate?: string;
  Contract_Compression_Risk__c?: number;
  Executive_Visibility__c?: number;
}

export class SalesforceAdapter implements IntegrationAdapter {
  vendor = 'salesforce';

  async createTask(payload: StandardTaskPayload, config: IntegrationConfig): Promise<AdapterResult> {
    const instanceUrl = config.config.instanceUrl;
    if (!instanceUrl) {
      return { provider: 'salesforce', action: 'create-task', success: false, error: 'No instance URL' };
    }

    try {
      const taskData = {
        Subject: `[ExecuteIQ] ${payload.title}`,
        Description: payload.description,
        Priority: this.mapPriority(payload.priority),
        Status: 'Not Started',
        ActivityDate: new Date().toISOString().split('T')[0]
      };

      const response = await fetch(`${instanceUrl}/services/data/v59.0/sobjects/Task`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.accessToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        const result = await response.json();
        return {
          provider: 'salesforce',
          action: 'create-task',
          success: true,
          detail: {
            id: result.id,
            url: `${instanceUrl}/${result.id}`,
            taskName: payload.title,
          },
        };
      } else {
        const err = await response.text();
        return {
          provider: 'salesforce',
          action: 'create-task',
          success: false,
          error: `HTTP ${response.status}: ${err.slice(0, 200)}`,
          detail: { taskName: payload.title },
        };
      }
    } catch (err) {
      return {
        provider: 'salesforce',
        action: 'create-task',
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
        detail: { taskName: payload.title },
      };
    }
  }

  async sendNotification(payload: StandardNotificationPayload, config: IntegrationConfig): Promise<AdapterResult> {
    // Salesforce doesn't have a direct "notification" API in the same sense as Slack.
    // We could create a FeedItem (Chatter) or a Task. 
    // For now, we'll return success as per the Jira pattern, 
    // as primary use case is data fetching and task creation.
    return { provider: 'salesforce', action: 'send-notification', success: true, detail: 'Not implemented for Salesforce' };
  }

  async testConnection(config: IntegrationConfig): Promise<boolean> {
    const instanceUrl = config.config.instanceUrl;
    if (!instanceUrl) return false;
    try {
      const response = await fetch(`${instanceUrl}/services/data/v59.0/`, {
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async fetchOpportunities(config: IntegrationConfig): Promise<SalesforceOpportunity[]> {
    const instanceUrl = config.config.instanceUrl;
    if (!instanceUrl) throw new Error('No instance URL');

    const query = `SELECT Id, Name, AccountId, Account.Name, Amount, Probability, CloseDate, StageName, 
                   Budget_Approval_Status__c, Engagement_Score__c, LastActivityDate, 
                   Contract_Compression_Risk__c, Executive_Visibility__c 
                   FROM Opportunity 
                   WHERE IsClosed = false`;
    
    const response = await fetch(`${instanceUrl}/services/data/v59.0/query?q=${encodeURIComponent(query)}`, {
      headers: {
        'Authorization': `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Salesforce query failed: ${err}`);
    }

    const data = await response.json();
    return data.records;
  }

  private mapPriority(priority?: string): string {
    switch (priority) {
      case 'critical':
      case 'high':
        return 'High';
      case 'medium':
        return 'Normal';
      case 'low':
      default:
        return 'Low';
    }
  }
}
