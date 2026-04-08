import pino from 'pino';

const log = pino({ name: 'teams-service' });

interface TeamsCard {
  title: string;
  text: string;
  themeColor?: string;
  sections?: TeamsSection[];
  potentialAction?: TeamsAction[];
}

interface TeamsSection {
  activityTitle?: string;
  activitySubtitle?: string;
  activityText?: string;
  facts?: { name: string; value: string }[];
  markdown?: boolean;
}

interface TeamsAction {
  '@type': string;
  name: string;
  targets?: { os: string; uri: string }[];
}

export async function sendTeamsNotification(card: TeamsCard): Promise<boolean> {
  const webhookUrl = process.env.TEAMS_WEBHOOK_URL;

  if (!webhookUrl) {
    log.warn('TEAMS_WEBHOOK_URL not configured — notification logged locally');
    log.info({ card }, '[Teams Notification]');
    return true;
  }

  try {
    const payload = {
      '@type': 'MessageCard',
      '@context': 'http://schema.org/extensions',
      themeColor: card.themeColor || 'C9A84C',
      summary: card.title,
      sections: [
        {
          activityTitle: `**${card.title}**`,
          activitySubtitle: card.text,
          markdown: true,
        },
        ...(card.sections || []),
      ],
      potentialAction: card.potentialAction || [],
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      log.info({ title: card.title }, '✅ Teams notification sent');
      return true;
    } else {
      const body = await response.text();
      log.error({ status: response.status, body }, '❌ Teams notification failed');
      return false;
    }
  } catch (error) {
    log.error({ error }, '❌ Error sending Teams notification');
    return false;
  }
}

export async function notifyTeamsPlaybookActivation(params: {
  playbookName: string;
  organizationName: string;
  triggeredBy?: string;
  triggerContext?: string;
  appUrl?: string;
}): Promise<boolean> {
  const { playbookName, organizationName, triggeredBy = 'Command OS', triggerContext, appUrl = 'https://vaughnmartin.com' } = params;

  const now = new Date().toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });

  return sendTeamsNotification({
    title: `🚨 Playbook Activated — ${playbookName}`,
    text: `Strategic execution initiated for **${organizationName}**. Your team has 12 minutes to full coordination.`,
    themeColor: 'C9A84C',
    sections: [
      {
        activityTitle: '**Command OS — War Room Open**',
        activitySubtitle: `Activated: ${now}`,
        facts: [
          { name: 'Playbook', value: playbookName },
          { name: 'Organization', value: organizationName },
          { name: 'Triggered by', value: triggeredBy },
          { name: 'Execution window', value: '12 minutes' },
          ...(triggerContext ? [{ name: 'Trigger context', value: triggerContext }] : []),
        ],
        markdown: true,
      },
    ],
    potentialAction: [
      {
        '@type': 'OpenUri',
        name: '→ Open War Room',
        targets: [{ os: 'default', uri: `${appUrl}/command-center` }],
      },
      {
        '@type': 'OpenUri',
        name: '→ View Playbook',
        targets: [{ os: 'default', uri: `${appUrl}/playbook-library` }],
      },
    ],
  });
}

export async function notifyTeamsWarRoomEscalation(params: {
  playbookName: string;
  escalationType: 'escalate' | 'delegate';
  fromRole: string;
  toRole?: string;
  message: string;
  appUrl?: string;
}): Promise<boolean> {
  const { playbookName, escalationType, fromRole, toRole, message, appUrl = 'https://vaughnmartin.com' } = params;

  const icon = escalationType === 'escalate' ? '🚨' : '🔄';
  const title = escalationType === 'escalate'
    ? `${icon} Escalation — ${playbookName}`
    : `${icon} Delegation — ${playbookName}`;

  return sendTeamsNotification({
    title,
    text: message,
    themeColor: escalationType === 'escalate' ? 'C0392B' : '2B8A6E',
    sections: [
      {
        facts: [
          { name: 'Playbook', value: playbookName },
          { name: 'From', value: fromRole },
          ...(toRole ? [{ name: 'To', value: toRole }] : []),
          { name: 'Action', value: escalationType === 'escalate' ? 'Escalated to C-Suite Loop' : 'Ownership Transferred' },
        ],
        markdown: true,
      },
    ],
    potentialAction: [
      {
        '@type': 'OpenUri',
        name: '→ Open War Room',
        targets: [{ os: 'default', uri: `${appUrl}/command-center` }],
      },
    ],
  });
}
