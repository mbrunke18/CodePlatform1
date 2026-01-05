import pino from 'pino';

const logger = pino({ name: 'war-room-webhook-service' });

export interface WarRoomEvent {
  type: 'execution_started' | 'stakeholder_acknowledged' | 'threshold_reached' | 'execution_completed';
  executionId: string;
  playbookName: string;
  timestamp: Date;
  message: string;
  metadata?: any;
}

/**
 * WarRoomWebhookService - Simple Slack/Teams integration for war room events
 * 
 * Features:
 * - Post execution events to Slack channels
 * - Post execution events to Teams channels
 * - Formatted messages with rich context
 * - Error handling and logging
 */
export class WarRoomWebhookService {
  private log = logger;

  /**
   * Post event to Slack webhook
   */
  async postToSlack(webhookUrl: string, event: WarRoomEvent): Promise<boolean> {
    try {
      const slackMessage = this.formatSlackMessage(event);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slackMessage),
      });

      if (!response.ok) {
        throw new Error(`Slack webhook failed: ${response.statusText}`);
      }

      this.log.info({ eventType: event.type, executionId: event.executionId }, 'Event posted to Slack');
      return true;
    } catch (error: any) {
      this.log.error({ error, webhookUrl }, 'Failed to post to Slack');
      return false;
    }
  }

  /**
   * Post event to Teams webhook
   */
  async postToTeams(webhookUrl: string, event: WarRoomEvent): Promise<boolean> {
    try {
      const teamsMessage = this.formatTeamsMessage(event);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamsMessage),
      });

      if (!response.ok) {
        throw new Error(`Teams webhook failed: ${response.statusText}`);
      }

      this.log.info({ eventType: event.type, executionId: event.executionId }, 'Event posted to Teams');
      return true;
    } catch (error: any) {
      this.log.error({ error, webhookUrl }, 'Failed to post to Teams');
      return false;
    }
  }

  /**
   * Format message for Slack
   */
  private formatSlackMessage(event: WarRoomEvent): any {
    const emoji = this.getEventEmoji(event.type);
    const color = this.getEventColor(event.type);

    return {
      text: `${emoji} ${event.message}`,
      attachments: [
        {
          color,
          fields: [
            {
              title: 'Playbook',
              value: event.playbookName,
              short: true,
            },
            {
              title: 'Execution ID',
              value: event.executionId.substring(0, 8),
              short: true,
            },
            {
              title: 'Time',
              value: event.timestamp.toLocaleTimeString(),
              short: true,
            },
          ],
        },
      ],
    };
  }

  /**
   * Format message for Teams
   */
  private formatTeamsMessage(event: WarRoomEvent): any {
    const color = this.getEventColor(event.type);
    const emoji = this.getEventEmoji(event.type);

    return {
      '@type': 'MessageCard',
      '@context': 'https://schema.org/extensions',
      summary: event.message,
      themeColor: color,
      title: `${emoji} ${event.message}`,
      sections: [
        {
          facts: [
            { name: 'Playbook', value: event.playbookName },
            { name: 'Execution ID', value: event.executionId.substring(0, 8) },
            { name: 'Time', value: event.timestamp.toLocaleTimeString() },
          ],
        },
      ],
    };
  }

  /**
   * Get emoji for event type
   */
  private getEventEmoji(type: string): string {
    const emojiMap: Record<string, string> = {
      execution_started: '🚀',
      stakeholder_acknowledged: '✅',
      threshold_reached: '🎯',
      execution_completed: '🎉',
    };
    return emojiMap[type] || '📢';
  }

  /**
   * Get color for event type
   */
  private getEventColor(type: string): string {
    const colorMap: Record<string, string> = {
      execution_started: '#0066CC',
      stakeholder_acknowledged: '#28A745',
      threshold_reached: '#FFC107',
      execution_completed: '#17A2B8',
    };
    return colorMap[type] || '#6C757D';
  }

  /**
   * Broadcast event to all configured webhooks
   */
  async broadcastEvent(event: WarRoomEvent, webhooks: { slack?: string; teams?: string }): Promise<void> {
    const promises: Promise<boolean>[] = [];

    if (webhooks.slack) {
      promises.push(this.postToSlack(webhooks.slack, event));
    }

    if (webhooks.teams) {
      promises.push(this.postToTeams(webhooks.teams, event));
    }

    await Promise.all(promises);
  }
}

// Singleton instance
export const warRoomWebhookService = new WarRoomWebhookService();
