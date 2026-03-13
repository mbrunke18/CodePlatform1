import { 
  IntegrationAdapter, 
  StandardTaskPayload, 
  StandardNotificationPayload, 
  AdapterResult, 
  IntegrationConfig 
} from '../IntegrationAdapter';

export class ServiceNowAdapter implements IntegrationAdapter {
  vendor = 'servicenow';

  private getBaseUrl(instanceUrl: string): string {
    return instanceUrl.endsWith('/') ? instanceUrl.slice(0, -1) : instanceUrl;
  }

  private getAuthHeader(config: IntegrationConfig): string {
    const { accessToken, config: extraConfig } = config;
    
    // Support OAuth2 (Bearer token)
    if (accessToken) {
      return `Bearer ${accessToken}`;
    }
    
    // Support Basic Auth (username/password)
    if (extraConfig.username && extraConfig.password) {
      const credentials = Buffer.from(`${extraConfig.username}:${extraConfig.password}`).toString('base64');
      return `Basic ${credentials}`;
    }
    
    return '';
  }

  async createTask(payload: StandardTaskPayload, config: IntegrationConfig): Promise<AdapterResult> {
    const instanceUrl = config.config.instanceUrl;
    if (!instanceUrl) {
      return { provider: 'servicenow', action: 'create-task', success: false, error: 'No instance URL provided' };
    }

    const authHeader = this.getAuthHeader(config);
    if (!authHeader) {
      return { provider: 'servicenow', action: 'create-task', success: false, error: 'No valid credentials (OAuth or Basic Auth)' };
    }

    try {
      const baseUrl = this.getBaseUrl(instanceUrl);
      // Default to 'incident' table if not specified
      const tableName = config.config.tableName || 'incident';
      
      const body = {
        short_description: `[Execution OS] ${payload.title}`,
        description: payload.description,
        priority: this.mapPriority(payload.priority),
        ...payload.metadata
      };

      const response = await fetch(`${baseUrl}/api/now/table/${tableName}`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const data = await response.json();
        const result = data.result;
        return {
          success: true,
          provider: 'servicenow',
          action: 'create-task',
          detail: {
            sys_id: result.sys_id,
            number: result.number,
            url: `${baseUrl}/${tableName}.do?sys_id=${result.sys_id}`,
            table: tableName
          }
        };
      } else {
        const errorText = await response.text();
        return {
          success: false,
          provider: 'servicenow',
          action: 'create-task',
          error: `HTTP ${response.status}: ${errorText.slice(0, 200)}`
        };
      }
    } catch (error) {
      return {
        success: false,
        provider: 'servicenow',
        action: 'create-task',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async sendNotification(payload: StandardNotificationPayload, config: IntegrationConfig): Promise<AdapterResult> {
    // ServiceNow notifications are typically handled via the 'incident' or 'event' tables
    // For now, we'll create an incident as a notification if no specific behavior is requested
    return this.createTask({
      title: payload.title,
      description: payload.message,
      priority: payload.severity === 'error' ? 'critical' : (payload.severity === 'warning' ? 'high' : 'medium'),
      metadata: payload.metadata
    }, config);
  }

  async testConnection(config: IntegrationConfig): Promise<boolean> {
    const instanceUrl = config.config.instanceUrl;
    if (!instanceUrl) return false;

    const authHeader = this.getAuthHeader(config);
    if (!authHeader) return false;

    try {
      const baseUrl = this.getBaseUrl(instanceUrl);
      // Use a simple API call to test connection (get user info)
      const response = await fetch(`${baseUrl}/api/now/table/sys_user?sysparm_limit=1`, {
        headers: {
          'Authorization': authHeader,
          'Accept': 'application/json'
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  private mapPriority(priority?: string): string {
    switch (priority) {
      case 'critical': return '1'; // 1 - Critical
      case 'high': return '2';     // 2 - High
      case 'medium': return '3';   // 3 - Moderate
      case 'low': return '4';      // 4 - Low
      default: return '3';
    }
  }
}
