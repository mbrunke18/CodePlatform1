import { 
  IntegrationAdapter, 
  StandardTaskPayload, 
  StandardNotificationPayload, 
  AdapterResult, 
  IntegrationConfig 
} from '../IntegrationAdapter';

export class JiraAdapter implements IntegrationAdapter {
  vendor = 'jira';

  async createTask(payload: StandardTaskPayload, config: IntegrationConfig): Promise<AdapterResult> {
    const cloudId = config.config.cloudId;
    if (!cloudId) {
      return { provider: 'jira', action: 'create-task', success: false, error: 'No cloud ID' };
    }

    try {
      // Find project if not provided in config
      let projectKey = config.config.projectKey;
      if (!projectKey) {
        const projRes = await fetch(
          `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/project/search?maxResults=5`,
          { headers: { Authorization: `Bearer ${config.accessToken}`, Accept: 'application/json' } }
        );
        if (projRes.ok) {
          const projData = await projRes.json();
          const projects = projData.values || [];
          projectKey = projects[0]?.key;
        }
      }

      if (!projectKey) {
        return { provider: 'jira', action: 'create-task', success: false, error: 'No projects available' };
      }

      const issueData = {
        fields: {
          project: { key: projectKey },
          summary: `[Command OS] ${payload.title}`,
          issuetype: { name: 'Task' },
          description: {
            type: 'doc', version: 1,
            content: [{
              type: 'paragraph',
              content: [{ type: 'text', text: payload.description }]
            }],
          },
        },
      };

      const issueRes = await fetch(
        `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${config.accessToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(issueData),
        }
      );

      if (issueRes.ok) {
        const issue = await issueRes.json();
        return {
          provider: 'jira',
          action: 'create-issue',
          success: true,
          detail: {
            key: issue.key,
            id: issue.id,
            url: `${config.config.cloudUrl || ''}/browse/${issue.key}`,
            taskName: payload.title,
          },
        };
      } else {
        const err = await issueRes.text();
        return {
          provider: 'jira',
          action: 'create-issue',
          success: false,
          error: `HTTP ${issueRes.status}: ${err.slice(0, 200)}`,
          detail: { taskName: payload.title },
        };
      }
    } catch (err) {
      return {
        provider: 'jira',
        action: 'create-issue',
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
        detail: { taskName: payload.title },
      };
    }
  }

  async sendNotification(payload: StandardNotificationPayload, config: IntegrationConfig): Promise<AdapterResult> {
    // Jira doesn't really have a "notification" in the same way Slack does, 
    // but we could add a comment to an issue if we had one.
    // For now, we'll just return success as it's not a primary use case for Jira.
    return { provider: 'jira', action: 'send-notification', success: true, detail: 'Not implemented for Jira' };
  }

  async testConnection(config: IntegrationConfig): Promise<boolean> {
    const cloudId = config.config.cloudId;
    if (!cloudId) return false;
    try {
      const response = await fetch(`https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/myself`, {
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
}
