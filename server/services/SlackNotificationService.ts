import pino from 'pino';

const log = pino({ name: 'slack-service' });

interface SlackMessage {
  channel?: string;
  userId?: string;
  text: string;
  blocks?: any[];
}

/**
 * Send Slack notification
 */
export async function sendSlackNotification(message: SlackMessage): Promise<boolean> {
  try {
    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
    
    if (!slackWebhookUrl) {
      log.warn('SLACK_WEBHOOK_URL not configured - notifications will be logged only');
      logNotificationLocally(message);
      return true; // Don't fail, just log
    }
    
    const payload = {
      text: message.text,
      blocks: message.blocks || [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: message.text
          }
        }
      ]
    };
    
    const response = await fetch(slackWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (response.ok) {
      log.info({ message }, '✅ Slack notification sent');
      return true;
    } else {
      log.error({ status: response.status }, '❌ Slack notification failed');
      return false;
    }
  } catch (error) {
    log.error({ error }, '❌ Error sending Slack notification');
    logNotificationLocally(message);
    return false;
  }
}

/**
 * Notify stakeholders of playbook activation
 */
export async function notifyPlaybookActivation(playbookName: string, stakeholdersCount: number, deadline: Date): Promise<void> {
  try {
    const timeLeft = Math.round((deadline.getTime() - Date.now()) / 60000);
    
    await sendSlackNotification({
      text: `🚀 *Strategic Playbook Activated*\n\n*Playbook:* ${playbookName}\n*Stakeholders:* ${stakeholdersCount}\n*Execution Window:* ${timeLeft} minutes`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `🚀 *Strategic Playbook Activated*\n\n*Playbook:* ${playbookName}\n*Stakeholders:* ${stakeholdersCount}\n*Execution Window:* ${timeLeft} minutes remaining`
          }
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: { type: 'plain_text', text: 'View Execution' },
              url: `${process.env.APP_URL || 'http://localhost:5000'}/command-center`,
              action_id: 'view_execution'
            }
          ]
        }
      ]
    });
  } catch (error) {
    log.warn({ error }, 'Failed to notify playbook activation via Slack');
  }
}

/**
 * Notify execution completion
 */
export async function notifyExecutionComplete(playbookName: string, success: boolean, metrics: any): Promise<void> {
  try {
    await sendSlackNotification({
      text: `${success ? '✅' : '❌'} *Execution Complete*\n\n*Playbook:* ${playbookName}\n*Status:* ${success ? 'Success' : 'Failed'}\n*Duration:* ${metrics.duration}\n*Tasks:* ${metrics.tasksCompleted}/${metrics.tasksTotal}`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `${success ? '✅' : '❌'} *Execution Complete*\n\n*Playbook:* ${playbookName}\n*Status:* ${success ? 'Success' : 'Failed'}\n*Stakeholder Response:* ${metrics.stakeholderResponseRate}%\n*Task Completion:* ${metrics.taskCompletionRate}%`
          }
        }
      ]
    });
  } catch (error) {
    log.warn({ error }, 'Failed to notify execution complete via Slack');
  }
}

function logNotificationLocally(message: SlackMessage) {
  log.info({ message }, '📤 [LOCAL] Slack notification logged (webhook not configured)');
}

export default { sendSlackNotification, notifyPlaybookActivation, notifyExecutionComplete };
