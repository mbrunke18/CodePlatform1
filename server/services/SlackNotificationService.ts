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
 * Notify stakeholders of playbook activation — rich Block Kit format
 */
export async function notifyPlaybookActivation(playbookName: string, stakeholdersCount: number, deadline: Date): Promise<void> {
  try {
    const timeLeft = Math.round((deadline.getTime() - Date.now()) / 60000);
    const deadlineStr = deadline.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const appUrl = process.env.APP_URL || 'https://vaughnmartin.com';

    await sendSlackNotification({
      text: `🚨 Readiness Protocol Activated — ${playbookName} · 12-Minute Execution Window`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🚨 Readiness Protocol Activated',
            emoji: true
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*${playbookName}*\nPre-staged response is underway. Executive authorization required.`
          }
        },
        {
          type: 'divider'
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Execution Window*\n${timeLeft} minutes remaining`
            },
            {
              type: 'mrkdwn',
              text: `*Deadline*\n${deadlineStr}`
            },
            {
              type: 'mrkdwn',
              text: `*Stakeholders Notified*\n${stakeholdersCount}`
            },
            {
              type: 'mrkdwn',
              text: `*Status*\nPre-staged — tasks ready`
            }
          ]
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: '⚡ Readiness OS · The response was ready before the trigger fired'
            }
          ]
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              style: 'primary',
              text: { type: 'plain_text', text: '→ Open War Room', emoji: true },
              url: `${appUrl}/command-center`,
              action_id: 'open_war_room'
            },
            {
              type: 'button',
              text: { type: 'plain_text', text: 'View Protocol', emoji: true },
              url: `${appUrl}/playbook-library`,
              action_id: 'view_protocol'
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
    const appUrl = process.env.APP_URL || 'https://vaughnmartin.com';
    const statusEmoji = success ? '✅' : '❌';
    const statusText = success ? 'Execution Complete' : 'Execution Requires Attention';

    await sendSlackNotification({
      text: `${statusEmoji} ${statusText} — ${playbookName}`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `${statusEmoji} ${statusText}`,
            emoji: true
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*${playbookName}*`
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Stakeholder Response*\n${metrics.stakeholderResponseRate ?? '--'}%`
            },
            {
              type: 'mrkdwn',
              text: `*Task Completion*\n${metrics.taskCompletionRate ?? '--'}%`
            },
            {
              type: 'mrkdwn',
              text: `*Duration*\n${metrics.duration ?? '--'}`
            },
            {
              type: 'mrkdwn',
              text: `*Result*\n${success ? 'Within 12-minute window' : 'Exceeded target window'}`
            }
          ]
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: { type: 'plain_text', text: 'View Debrief', emoji: true },
              url: `${appUrl}/practice-drills`,
              action_id: 'view_debrief'
            }
          ]
        }
      ]
    });
  } catch (error) {
    log.warn({ error }, 'Failed to notify execution complete via Slack');
  }
}

/**
 * Notify drill complication injection to Slack channel
 */
export async function notifyDrillComplication(playbookName: string, complication: { title: string; description: string; severity: string }): Promise<void> {
  try {
    const severityEmoji = complication.severity === 'CRITICAL' ? '🔴' : complication.severity === 'HIGH' ? '🟠' : '🟡';
    await sendSlackNotification({
      text: `${severityEmoji} Drill Complication: ${complication.title} — ${playbookName}`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `${severityEmoji} *Drill Complication Injected*\n*${complication.title}*\n${complication.description}`
          }
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `Protocol: ${playbookName} · Severity: ${complication.severity}`
            }
          ]
        }
      ]
    });
  } catch (error) {
    log.warn({ error }, 'Failed to notify drill complication via Slack');
  }
}

function logNotificationLocally(message: SlackMessage) {
  log.info({ message }, '📤 [LOCAL] Slack notification logged (webhook not configured)');
}

export default { sendSlackNotification, notifyPlaybookActivation, notifyExecutionComplete, notifyDrillComplication };
