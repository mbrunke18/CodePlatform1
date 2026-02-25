import { 
  IntegrationAdapter, 
  StandardTaskPayload, 
  StandardNotificationPayload, 
  AdapterResult, 
  IntegrationConfig 
} from '../IntegrationAdapter';

export class SlackAdapter implements IntegrationAdapter {
  vendor = 'slack';

  async createTask(payload: StandardTaskPayload, config: IntegrationConfig): Promise<AdapterResult> {
    // Slack is primarily for notifications, but we could create a message as a "task" reminder
    return this.sendNotification({
      title: `Task: ${payload.title}`,
      message: payload.description,
      severity: 'info'
    }, config);
  }

  async sendNotification(payload: StandardNotificationPayload, config: IntegrationConfig): Promise<AdapterResult> {
    try {
      let channelId = config.config.channelId;
      
      if (!channelId) {
        // Try to find a channel if not configured
        const chanRes = await fetch(
          'https://slack.com/api/conversations.list?types=public_channel&limit=100',
          { headers: { Authorization: `Bearer ${config.accessToken}` } }
        );
        const chanData = await chanRes.json();
        if (chanData.ok) {
          const channels = chanData.channels || [];
          const preferred = channels.find((c: any) =>
            c.name === 'general' || c.name === 'executeiq' || c.name === 'strategy' || c.name === 'operations'
          );
          channelId = preferred?.id || channels[0]?.id;
        }
      }

      if (!channelId) {
        return { provider: 'slack', action: 'send-notification', success: false, error: 'No channels available' };
      }

      const response = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channel: channelId,
          text: payload.title,
          blocks: payload.blocks || [
            {
              type: 'header',
              text: { type: 'plain_text', text: payload.title, emoji: true },
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: payload.message,
              },
            }
          ],
        }),
      });

      const data = await response.json();
      if (data.ok) {
        return {
          provider: 'slack',
          action: 'send-notification',
          success: true,
          detail: { channel: data.channel, ts: data.ts },
        };
      } else {
        return {
          provider: 'slack',
          action: 'send-notification',
          success: false,
          error: data.error,
        };
      }
    } catch (err) {
      return {
        provider: 'slack',
        action: 'send-notification',
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  }

  async testConnection(config: IntegrationConfig): Promise<boolean> {
    try {
      const response = await fetch('https://slack.com/api/auth.test', {
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
        },
      });
      const data = await response.json();
      return data.ok === true;
    } catch {
      return false;
    }
  }
}
