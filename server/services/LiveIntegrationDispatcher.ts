import { db } from '../db.js';
import { enterpriseIntegrations } from '@shared/schema';
import { eq, and } from 'drizzle-orm';

interface DispatchResult {
  provider: string;
  action: string;
  success: boolean;
  detail?: any;
  error?: string;
}

interface ActiveIntegration {
  id: string;
  vendor: string;
  name: string;
  accessToken: string;
  config: Record<string, any>;
}

export class LiveIntegrationDispatcher {

  async getActiveIntegrations(organizationId: string): Promise<ActiveIntegration[]> {
    const integrations = await db.select()
      .from(enterpriseIntegrations)
      .where(
        and(
          eq(enterpriseIntegrations.organizationId, organizationId),
          eq(enterpriseIntegrations.status, 'active')
        )
      );

    return integrations
      .filter(i => {
        const meta = i.metadata as any;
        return meta?.accessToken;
      })
      .map(i => {
        const meta = i.metadata as any;
        const config = i.configuration as any;
        return {
          id: i.id,
          vendor: i.vendor || '',
          name: i.name || '',
          accessToken: meta.accessToken,
          config: config || {},
        };
      });
  }

  async dispatchActivation(
    organizationId: string,
    playbookName: string,
    tasks: Array<{ name: string; owner: string; phase: string }>,
    stakeholders: Array<{ name: string; title: string }>
  ): Promise<{ jira: DispatchResult[]; slack: DispatchResult[]; summary: string }> {
    const results: { jira: DispatchResult[]; slack: DispatchResult[] } = { jira: [], slack: [] };

    let activeIntegrations: ActiveIntegration[];
    try {
      activeIntegrations = await this.getActiveIntegrations(organizationId);
    } catch {
      return { ...results, summary: 'No integrations available' };
    }

    const jiraIntegration = activeIntegrations.find(i =>
      i.vendor === 'atlassian' || i.vendor === 'jira' || i.name.toLowerCase().includes('jira')
    );

    const slackIntegration = activeIntegrations.find(i =>
      i.vendor === 'slack' || i.name.toLowerCase().includes('slack')
    );

    const promises: Promise<void>[] = [];

    if (jiraIntegration) {
      promises.push(this.dispatchJiraTasks(jiraIntegration, playbookName, tasks, results));
    }

    if (slackIntegration) {
      promises.push(this.dispatchSlackNotifications(slackIntegration, playbookName, tasks, stakeholders, results));
    }

    await Promise.allSettled(promises);

    const jiraSuccess = results.jira.filter(r => r.success).length;
    const slackSuccess = results.slack.filter(r => r.success).length;
    const parts: string[] = [];
    if (jiraIntegration) parts.push(`Jira: ${jiraSuccess}/${results.jira.length} tasks created`);
    if (slackIntegration) parts.push(`Slack: ${slackSuccess}/${results.slack.length} messages sent`);

    return {
      ...results,
      summary: parts.length > 0 ? parts.join(' | ') : 'No integrations connected',
    };
  }

  private async dispatchJiraTasks(
    integration: ActiveIntegration,
    playbookName: string,
    tasks: Array<{ name: string; owner: string; phase: string }>,
    results: { jira: DispatchResult[]; slack: DispatchResult[] }
  ): Promise<void> {
    const cloudId = integration.config.cloudId;
    if (!cloudId) {
      results.jira.push({ provider: 'jira', action: 'create-tasks', success: false, error: 'No cloud ID' });
      return;
    }

    let projectKey: string | null = null;
    try {
      const projRes = await fetch(
        `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/project/search?maxResults=5`,
        { headers: { Authorization: `Bearer ${integration.accessToken}`, Accept: 'application/json' } }
      );
      if (projRes.ok) {
        const projData = await projRes.json();
        const projects = projData.values || [];
        projectKey = projects[0]?.key || null;
      }
    } catch {
      results.jira.push({ provider: 'jira', action: 'find-project', success: false, error: 'Failed to list projects' });
      return;
    }

    if (!projectKey) {
      results.jira.push({ provider: 'jira', action: 'find-project', success: false, error: 'No projects available' });
      return;
    }

    const immediateTasks = tasks.filter(t => t.phase === 'IMMEDIATE').slice(0, 3);
    const tasksToCreate = immediateTasks.length > 0 ? immediateTasks : tasks.slice(0, 3);

    for (const task of tasksToCreate) {
      try {
        const issueData = {
          fields: {
            project: { key: projectKey },
            summary: `[ExecuteIQ] ${task.name}`,
            issuetype: { name: 'Task' },
            description: {
              type: 'doc', version: 1,
              content: [{
                type: 'paragraph',
                content: [{ type: 'text', text: `Playbook: ${playbookName}\nPhase: ${task.phase}\nOwner: ${task.owner}\n\nAuto-created by ExecuteIQ during playbook activation.` }]
              }],
            },
          },
        };

        const issueRes = await fetch(
          `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${integration.accessToken}`,
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify(issueData),
          }
        );

        if (issueRes.ok) {
          const issue = await issueRes.json();
          results.jira.push({
            provider: 'jira',
            action: 'create-issue',
            success: true,
            detail: {
              key: issue.key,
              id: issue.id,
              url: `${integration.config.cloudUrl || ''}/browse/${issue.key}`,
              taskName: task.name,
            },
          });
        } else {
          const err = await issueRes.text();
          results.jira.push({
            provider: 'jira',
            action: 'create-issue',
            success: false,
            error: `HTTP ${issueRes.status}: ${err.slice(0, 200)}`,
            detail: { taskName: task.name },
          });
        }
      } catch (err) {
        results.jira.push({
          provider: 'jira',
          action: 'create-issue',
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
          detail: { taskName: task.name },
        });
      }
    }
  }

  private async dispatchSlackNotifications(
    integration: ActiveIntegration,
    playbookName: string,
    tasks: Array<{ name: string; owner: string; phase: string }>,
    stakeholders: Array<{ name: string; title: string }>,
    results: { jira: DispatchResult[]; slack: DispatchResult[] }
  ): Promise<void> {
    let channelId: string | null = null;

    try {
      const chanRes = await fetch(
        'https://slack.com/api/conversations.list?types=public_channel&limit=100',
        { headers: { Authorization: `Bearer ${integration.accessToken}` } }
      );
      const chanData = await chanRes.json();
      if (chanData.ok) {
        const channels = chanData.channels || [];
        const preferred = channels.find((c: any) =>
          c.name === 'general' || c.name === 'executeiq' || c.name === 'strategy' || c.name === 'operations'
        );
        channelId = preferred?.id || channels[0]?.id || null;
      }
    } catch {
      results.slack.push({ provider: 'slack', action: 'find-channel', success: false, error: 'Failed to list channels' });
      return;
    }

    if (!channelId) {
      results.slack.push({ provider: 'slack', action: 'find-channel', success: false, error: 'No channels available' });
      return;
    }

    const taskList = tasks.slice(0, 5).map(t => `• ${t.name} _(${t.owner})_`).join('\n');
    const stakeholderList = stakeholders.slice(0, 5).map(s => `• ${s.name}, ${s.title}`).join('\n');

    const blocks = [
      {
        type: 'header',
        text: { type: 'plain_text', text: `🚀 VaughnMartin Playbook Activated: ${playbookName}`, emoji: true },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Playbook activated at ${new Date().toLocaleTimeString()}*\n\nExecuteIQ is coordinating response across ${stakeholders.length} stakeholders and ${tasks.length} tasks.`,
        },
      },
      { type: 'divider' },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `*📋 Key Tasks:*\n${taskList}` },
      },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `*👥 Stakeholders Notified:*\n${stakeholderList}` },
      },
      { type: 'divider' },
      {
        type: 'context',
        elements: [
          { type: 'mrkdwn', text: '⚡ Powered by ExecuteIQ Strategic Execution OS | Response coordinated in <12 minutes' },
        ],
      },
    ];

    try {
      const msgRes = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${integration.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channel: channelId,
          text: `🚀 VaughnMartin Playbook Activated: ${playbookName}`,
          blocks,
        }),
      });

      const msgData = await msgRes.json();
      if (msgData.ok) {
        results.slack.push({
          provider: 'slack',
          action: 'activation-notification',
          success: true,
          detail: { channel: msgData.channel, ts: msgData.ts },
        });
      } else {
        results.slack.push({
          provider: 'slack',
          action: 'activation-notification',
          success: false,
          error: msgData.error,
        });
      }
    } catch (err) {
      results.slack.push({
        provider: 'slack',
        action: 'activation-notification',
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  async getIntegrationStatus(organizationId: string): Promise<{
    jira: { connected: boolean; name?: string; id?: string };
    slack: { connected: boolean; name?: string; id?: string };
  }> {
    try {
      const integrations = await this.getActiveIntegrations(organizationId);

      const jira = integrations.find(i =>
        i.vendor === 'atlassian' || i.vendor === 'jira' || i.name.toLowerCase().includes('jira')
      );
      const slack = integrations.find(i =>
        i.vendor === 'slack' || i.name.toLowerCase().includes('slack')
      );

      return {
        jira: jira ? { connected: true, name: jira.name, id: jira.id } : { connected: false },
        slack: slack ? { connected: true, name: slack.name, id: slack.id } : { connected: false },
      };
    } catch {
      return { jira: { connected: false }, slack: { connected: false } };
    }
  }
}

export const liveIntegrationDispatcher = new LiveIntegrationDispatcher();
