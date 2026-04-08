import { db } from '../db.js';
import { enterpriseIntegrations } from '@shared/schema';
import { eq, and } from 'drizzle-orm';
import { IntegrationAdapter, IntegrationConfig, StandardTaskPayload, StandardNotificationPayload, AdapterResult } from './integrations/IntegrationAdapter';
import { JiraAdapter } from './integrations/adapters/JiraAdapter';
import { SlackAdapter } from './integrations/adapters/SlackAdapter';
import { SalesforceAdapter } from './integrations/adapters/SalesforceAdapter';
import { ServiceNowAdapter } from './integrations/adapters/ServiceNowAdapter';

export class LiveIntegrationDispatcher {
  private adapters: Map<string, IntegrationAdapter> = new Map();

  constructor() {
    this.registerAdapter(new JiraAdapter());
    this.registerAdapter(new SlackAdapter());
    this.registerAdapter(new SalesforceAdapter());
    this.registerAdapter(new ServiceNowAdapter());
  }

  private registerAdapter(adapter: IntegrationAdapter) {
    this.adapters.set(adapter.vendor, adapter);
  }

  private getAdapter(vendor: string): IntegrationAdapter | undefined {
    const v = vendor.toLowerCase();
    if (v === 'atlassian' || v === 'jira') return this.adapters.get('jira');
    if (v === 'salesforce') return this.adapters.get('salesforce');
    return this.adapters.get(v);
  }

  async getActiveIntegrations(organizationId: string): Promise<any[]> {
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
  ): Promise<{ jira: AdapterResult[]; slack: AdapterResult[]; servicenow: AdapterResult[]; summary: string }> {
    const results: { jira: AdapterResult[]; slack: AdapterResult[]; servicenow: AdapterResult[] } = { jira: [], slack: [], servicenow: [] };

    let activeIntegrations: any[];
    try {
      activeIntegrations = await this.getActiveIntegrations(organizationId);
    } catch {
      return { ...results, summary: 'No integrations available' };
    }

    const promises: Promise<void>[] = [];

    for (const integration of activeIntegrations) {
      const adapter = this.getAdapter(integration.vendor);
      if (!adapter) continue;

      const config: IntegrationConfig = {
        accessToken: integration.accessToken,
        config: integration.config
      };

      if (adapter.vendor === 'jira') {
        const immediateTasks = tasks.filter(t => t.phase === 'IMMEDIATE').slice(0, 3);
        const tasksToCreate = immediateTasks.length > 0 ? immediateTasks : tasks.slice(0, 3);

        for (const task of tasksToCreate) {
          const payload: StandardTaskPayload = {
            title: task.name,
            description: `Playbook: ${playbookName}\nPhase: ${task.phase}\nOwner: ${task.owner}\n\nAuto-created by Command OS during playbook activation.`,
            phase: task.phase,
            owner: task.owner
          };
          promises.push(adapter.createTask(payload, config).then(res => {
            results.jira.push(res);
          }));
        }
      } else if (adapter.vendor === 'slack') {
        const taskList = tasks.slice(0, 5).map(t => `• ${t.name} _(${t.owner})_`).join('\n');
        const stakeholderList = stakeholders.slice(0, 5).map(s => `• ${s.name}, ${s.title}`).join('\n');

        const payload: StandardNotificationPayload = {
          title: `🚀 VaughnMartin Playbook Activated: ${playbookName}`,
          message: `*Playbook activated at ${new Date().toLocaleTimeString()}*\n\nCommand OS is coordinating response across ${stakeholders.length} stakeholders and ${tasks.length} tasks.`,
          blocks: [
            {
              type: 'header',
              text: { type: 'plain_text', text: `🚀 VaughnMartin Playbook Activated: ${playbookName}`, emoji: true },
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Playbook activated at ${new Date().toLocaleTimeString()}*\n\nCommand OS is coordinating response across ${stakeholders.length} stakeholders and ${tasks.length} tasks.`,
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
                { type: 'mrkdwn', text: '⚡ Powered by VaughnMartin Command OS | Response coordinated in <12 minutes' },
              ],
            },
          ]
        };
        promises.push(adapter.sendNotification(payload, config).then(res => {
          results.slack.push(res);
        }));
      } else if (adapter.vendor === 'servicenow') {
        const taskList = tasks.slice(0, 10).map(t => `- ${t.name} (${t.owner})`).join('\n');
        const payload: StandardTaskPayload = {
          title: `Playbook Activated: ${playbookName}`,
          description: `VaughnMartin Playbook "${playbookName}" was activated at ${new Date().toISOString()}.\n\nTotal Tasks: ${tasks.length}\nTotal Stakeholders: ${stakeholders.length}\n\nTop Tasks:\n${taskList}`,
          priority: 'high'
        };
        promises.push(adapter.createTask(payload, config).then(res => {
          results.servicenow.push(res);
        }));
      }
    }

    await Promise.allSettled(promises);

    const jiraSuccess = results.jira.filter(r => r.success).length;
    const slackSuccess = results.slack.filter(r => r.success).length;
    const servicenowSuccess = results.servicenow.filter(r => r.success).length;
    const parts: string[] = [];
    
    const hasJira = activeIntegrations.some(i => this.getAdapter(i.vendor)?.vendor === 'jira');
    const hasSlack = activeIntegrations.some(i => this.getAdapter(i.vendor)?.vendor === 'slack');
    const hasServiceNow = activeIntegrations.some(i => this.getAdapter(i.vendor)?.vendor === 'servicenow');

    if (hasJira) parts.push(`Jira: ${jiraSuccess}/${results.jira.length} tasks created`);
    if (hasSlack) parts.push(`Slack: ${slackSuccess}/${results.slack.length} messages sent`);
    if (hasServiceNow) parts.push(`ServiceNow: ${servicenowSuccess}/${results.servicenow.length} records created`);

    return {
      ...results,
      summary: parts.length > 0 ? parts.join(' | ') : 'No integrations connected',
    };
  }

  async getIntegrationStatus(organizationId: string): Promise<{
    jira: { connected: boolean; name?: string; id?: string };
    slack: { connected: boolean; name?: string; id?: string };
    servicenow: { connected: boolean; name?: string; id?: string };
  }> {
    try {
      const integrations = await this.getActiveIntegrations(organizationId);

      const jira = integrations.find(i => this.getAdapter(i.vendor)?.vendor === 'jira');
      const slack = integrations.find(i => this.getAdapter(i.vendor)?.vendor === 'slack');
      const servicenow = integrations.find(i => this.getAdapter(i.vendor)?.vendor === 'servicenow');

      return {
        jira: jira ? { connected: true, name: jira.name, id: jira.id } : { connected: false },
        slack: slack ? { connected: true, name: slack.name, id: slack.id } : { connected: false },
        servicenow: servicenow ? { connected: true, name: servicenow.name, id: servicenow.id } : { connected: false },
      };
    } catch {
      return { jira: { connected: false }, slack: { connected: false }, servicenow: { connected: false } };
    }
  }
}

export const liveIntegrationDispatcher = new LiveIntegrationDispatcher();
