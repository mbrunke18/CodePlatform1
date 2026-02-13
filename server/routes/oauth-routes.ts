import { Router } from 'express';
import crypto from 'crypto';
import { db } from '../db.js';
import { enterpriseIntegrations } from '@shared/schema';
import { eq, and } from 'drizzle-orm';

const router = Router();

const JIRA_CLIENT_ID = process.env.JIRA_CLIENT_ID || '';
const JIRA_CLIENT_SECRET = process.env.JIRA_CLIENT_SECRET || '';
const SLACK_CLIENT_ID = process.env.SLACK_CLIENT_ID || '';
const SLACK_CLIENT_SECRET = process.env.SLACK_CLIENT_SECRET || '';

function getBaseUrl(req: any): string {
  const proto = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return `${proto}://${host}`;
}

function getUserId(req: any): string | null {
  return req.user?.claims?.sub || req.user?.sub || req.user?.id || null;
}

const pendingOAuthStates = new Map<string, { provider: string; organizationId: string; userId: string; createdAt: number }>();

setInterval(() => {
  const now = Date.now();
  const keysToDelete: string[] = [];
  pendingOAuthStates.forEach((val, key) => {
    if (now - val.createdAt > 600000) keysToDelete.push(key);
  });
  keysToDelete.forEach(k => pendingOAuthStates.delete(k));
}, 60000);

router.get('/jira/authorize', (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Authentication required' });

  const organizationId = req.query.organizationId as string;
  if (!organizationId) return res.status(400).json({ error: 'organizationId required' });

  if (!JIRA_CLIENT_ID) {
    return res.status(500).json({ error: 'Jira OAuth not configured. Set JIRA_CLIENT_ID and JIRA_CLIENT_SECRET.' });
  }

  const state = crypto.randomBytes(32).toString('hex');
  pendingOAuthStates.set(state, { provider: 'jira', organizationId, userId, createdAt: Date.now() });

  const callbackUrl = `${getBaseUrl(req)}/api/oauth/jira/callback`;
  const scopes = [
    'read:jira-work', 'write:jira-work', 'read:jira-user',
    'manage:jira-project', 'manage:jira-configuration'
  ].join(' ');

  const authUrl = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=${JIRA_CLIENT_ID}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(callbackUrl)}&state=${state}&response_type=code&prompt=consent`;

  res.json({ authUrl });
});

router.get('/jira/callback', async (req, res) => {
  const { code, state, error } = req.query;

  if (error) {
    return res.redirect('/#/integrations?error=jira_denied');
  }

  const pending = pendingOAuthStates.get(state as string);
  if (!pending || pending.provider !== 'jira') {
    return res.redirect('/#/integrations?error=invalid_state');
  }
  pendingOAuthStates.delete(state as string);

  try {
    const callbackUrl = `${getBaseUrl(req)}/api/oauth/jira/callback`;
    const tokenRes = await fetch('https://auth.atlassian.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: JIRA_CLIENT_ID,
        client_secret: JIRA_CLIENT_SECRET,
        code,
        redirect_uri: callbackUrl,
      }),
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      console.error('Jira token exchange failed:', err);
      return res.redirect('/#/integrations?error=jira_token_failed');
    }

    const tokens = await tokenRes.json();

    const cloudRes = await fetch('https://api.atlassian.com/oauth/token/accessible-resources', {
      headers: { Authorization: `Bearer ${tokens.access_token}`, Accept: 'application/json' },
    });
    const clouds = await cloudRes.json();
    const cloud = Array.isArray(clouds) && clouds.length > 0 ? clouds[0] : null;

    const [integration] = await db.insert(enterpriseIntegrations).values({
      organizationId: pending.organizationId,
      name: cloud ? `Jira - ${cloud.name}` : 'Jira Cloud',
      integrationType: 'project_management',
      vendor: 'atlassian',
      status: 'active',
      authenticationType: 'oauth',
      apiEndpoint: cloud ? `https://api.atlassian.com/ex/jira/${cloud.id}` : '',
      syncFrequency: 'real-time',
      configuration: {
        cloudId: cloud?.id,
        cloudName: cloud?.name,
        cloudUrl: cloud?.url,
        scopes: tokens.scope,
      },
      metadata: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: Date.now() + (tokens.expires_in * 1000),
        tokenType: tokens.token_type,
        connectedBy: pending.userId,
        connectedAt: new Date().toISOString(),
      },
      installedBy: pending.userId,
    }).returning();

    console.log(`✅ Jira connected for org ${pending.organizationId}: ${integration.id}`);
    res.redirect(`/#/integrations?connected=jira&id=${integration.id}`);
  } catch (err) {
    console.error('Jira OAuth callback error:', err);
    res.redirect('/#/integrations?error=jira_callback_failed');
  }
});

router.post('/jira/refresh', async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Authentication required' });

  const { integrationId } = req.body;
  if (!integrationId) return res.status(400).json({ error: 'integrationId required' });

  try {
    const [integration] = await db.select().from(enterpriseIntegrations).where(eq(enterpriseIntegrations.id, integrationId));
    if (!integration) return res.status(404).json({ error: 'Integration not found' });

    const metadata = integration.metadata as any;
    if (!metadata?.refreshToken) return res.status(400).json({ error: 'No refresh token available' });

    const tokenRes = await fetch('https://auth.atlassian.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        client_id: JIRA_CLIENT_ID,
        client_secret: JIRA_CLIENT_SECRET,
        refresh_token: metadata.refreshToken,
      }),
    });

    if (!tokenRes.ok) {
      await db.update(enterpriseIntegrations).set({ status: 'error', errorLog: { error: 'Token refresh failed', at: new Date().toISOString() } }).where(eq(enterpriseIntegrations.id, integrationId));
      return res.status(500).json({ error: 'Token refresh failed' });
    }

    const tokens = await tokenRes.json();
    await db.update(enterpriseIntegrations).set({
      status: 'active',
      metadata: {
        ...metadata,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || metadata.refreshToken,
        expiresAt: Date.now() + (tokens.expires_in * 1000),
      },
      updatedAt: new Date(),
    }).where(eq(enterpriseIntegrations.id, integrationId));

    res.json({ success: true });
  } catch (err) {
    console.error('Jira token refresh error:', err);
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

router.get('/slack/authorize', (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Authentication required' });

  const organizationId = req.query.organizationId as string;
  if (!organizationId) return res.status(400).json({ error: 'organizationId required' });

  if (!SLACK_CLIENT_ID) {
    return res.status(500).json({ error: 'Slack OAuth not configured. Set SLACK_CLIENT_ID and SLACK_CLIENT_SECRET.' });
  }

  const state = crypto.randomBytes(32).toString('hex');
  pendingOAuthStates.set(state, { provider: 'slack', organizationId, userId, createdAt: Date.now() });

  const callbackUrl = `${getBaseUrl(req)}/api/oauth/slack/callback`;
  const scopes = [
    'channels:manage', 'channels:read', 'chat:write', 'chat:write.public',
    'groups:write', 'groups:read', 'users:read', 'users:read.email',
    'team:read', 'incoming-webhook'
  ].join(',');

  const authUrl = `https://slack.com/oauth/v2/authorize?client_id=${SLACK_CLIENT_ID}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(callbackUrl)}&state=${state}`;

  res.json({ authUrl });
});

router.get('/slack/callback', async (req, res) => {
  const { code, state, error } = req.query;

  if (error) {
    return res.redirect('/#/integrations?error=slack_denied');
  }

  const pending = pendingOAuthStates.get(state as string);
  if (!pending || pending.provider !== 'slack') {
    return res.redirect('/#/integrations?error=invalid_state');
  }
  pendingOAuthStates.delete(state as string);

  try {
    const callbackUrl = `${getBaseUrl(req)}/api/oauth/slack/callback`;
    const tokenRes = await fetch('https://slack.com/api/oauth.v2.access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: SLACK_CLIENT_ID,
        client_secret: SLACK_CLIENT_SECRET,
        code: code as string,
        redirect_uri: callbackUrl,
      }),
    });

    const data = await tokenRes.json();
    if (!data.ok) {
      console.error('Slack token exchange failed:', data.error);
      return res.redirect('/#/integrations?error=slack_token_failed');
    }

    const [integration] = await db.insert(enterpriseIntegrations).values({
      organizationId: pending.organizationId,
      name: `Slack - ${data.team?.name || 'Workspace'}`,
      integrationType: 'communication',
      vendor: 'slack',
      status: 'active',
      authenticationType: 'oauth',
      apiEndpoint: 'https://slack.com/api',
      syncFrequency: 'real-time',
      configuration: {
        teamId: data.team?.id,
        teamName: data.team?.name,
        botUserId: data.bot_user_id,
        appId: data.app_id,
        scope: data.scope,
        incomingWebhook: data.incoming_webhook,
      },
      metadata: {
        accessToken: data.access_token,
        tokenType: data.token_type,
        connectedBy: pending.userId,
        connectedAt: new Date().toISOString(),
      },
      installedBy: pending.userId,
    }).returning();

    console.log(`✅ Slack connected for org ${pending.organizationId}: ${integration.id}`);
    res.redirect(`/#/integrations?connected=slack&id=${integration.id}`);
  } catch (err) {
    console.error('Slack OAuth callback error:', err);
    res.redirect('/#/integrations?error=slack_callback_failed');
  }
});

router.get('/status', async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Authentication required' });

  const organizationId = req.query.organizationId as string;
  if (!organizationId) return res.status(400).json({ error: 'organizationId required' });

  try {
    const integrations = await db.select({
      id: enterpriseIntegrations.id,
      name: enterpriseIntegrations.name,
      vendor: enterpriseIntegrations.vendor,
      integrationType: enterpriseIntegrations.integrationType,
      status: enterpriseIntegrations.status,
      lastSyncAt: enterpriseIntegrations.lastSyncAt,
      createdAt: enterpriseIntegrations.createdAt,
      configuration: enterpriseIntegrations.configuration,
    }).from(enterpriseIntegrations)
      .where(eq(enterpriseIntegrations.organizationId, organizationId));

    const available = {
      jira: { configured: !!JIRA_CLIENT_ID, provider: 'Atlassian Jira' },
      slack: { configured: !!SLACK_CLIENT_ID, provider: 'Slack' },
    };

    res.json({ integrations, available });
  } catch (err) {
    console.error('Failed to get OAuth status:', err);
    res.status(500).json({ error: 'Failed to get integration status' });
  }
});

router.post('/disconnect', async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Authentication required' });

  const { integrationId } = req.body;
  if (!integrationId) return res.status(400).json({ error: 'integrationId required' });

  try {
    const [integration] = await db.select().from(enterpriseIntegrations).where(eq(enterpriseIntegrations.id, integrationId));
    if (!integration) return res.status(404).json({ error: 'Integration not found' });

    if (integration.vendor === 'slack') {
      const metadata = integration.metadata as any;
      if (metadata?.accessToken) {
        try {
          await fetch('https://slack.com/api/auth.revoke', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ token: metadata.accessToken }),
          });
        } catch (e) { /* best effort */ }
      }
    }

    await db.update(enterpriseIntegrations).set({
      status: 'inactive',
      metadata: { disconnectedAt: new Date().toISOString(), disconnectedBy: userId },
      updatedAt: new Date(),
    }).where(eq(enterpriseIntegrations.id, integrationId));

    res.json({ success: true });
  } catch (err) {
    console.error('Failed to disconnect:', err);
    res.status(500).json({ error: 'Failed to disconnect integration' });
  }
});

router.post('/jira/test', async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Authentication required' });

  const { integrationId } = req.body;
  try {
    const [integration] = await db.select().from(enterpriseIntegrations).where(eq(enterpriseIntegrations.id, integrationId));
    if (!integration) return res.status(404).json({ error: 'Integration not found' });

    const metadata = integration.metadata as any;
    const config = integration.configuration as any;
    if (!metadata?.accessToken || !config?.cloudId) return res.json({ healthy: false, error: 'Missing credentials' });

    const testRes = await fetch(`https://api.atlassian.com/ex/jira/${config.cloudId}/rest/api/3/myself`, {
      headers: { Authorization: `Bearer ${metadata.accessToken}`, Accept: 'application/json' },
    });

    if (testRes.ok) {
      const user = await testRes.json();
      await db.update(enterpriseIntegrations).set({ status: 'active', lastSyncAt: new Date(), updatedAt: new Date() }).where(eq(enterpriseIntegrations.id, integrationId));
      res.json({ healthy: true, user: { displayName: user.displayName, email: user.emailAddress } });
    } else {
      await db.update(enterpriseIntegrations).set({ status: 'error', updatedAt: new Date() }).where(eq(enterpriseIntegrations.id, integrationId));
      res.json({ healthy: false, error: `API returned ${testRes.status}` });
    }
  } catch (err) {
    res.json({ healthy: false, error: err instanceof Error ? err.message : 'Connection failed' });
  }
});

router.post('/slack/test', async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Authentication required' });

  const { integrationId } = req.body;
  try {
    const [integration] = await db.select().from(enterpriseIntegrations).where(eq(enterpriseIntegrations.id, integrationId));
    if (!integration) return res.status(404).json({ error: 'Integration not found' });

    const metadata = integration.metadata as any;
    if (!metadata?.accessToken) return res.json({ healthy: false, error: 'Missing credentials' });

    const testRes = await fetch('https://slack.com/api/auth.test', {
      method: 'POST',
      headers: { Authorization: `Bearer ${metadata.accessToken}` },
    });

    const data = await testRes.json();
    if (data.ok) {
      await db.update(enterpriseIntegrations).set({ status: 'active', lastSyncAt: new Date(), updatedAt: new Date() }).where(eq(enterpriseIntegrations.id, integrationId));
      res.json({ healthy: true, team: data.team, user: data.user });
    } else {
      await db.update(enterpriseIntegrations).set({ status: 'error', updatedAt: new Date() }).where(eq(enterpriseIntegrations.id, integrationId));
      res.json({ healthy: false, error: data.error });
    }
  } catch (err) {
    res.json({ healthy: false, error: err instanceof Error ? err.message : 'Connection failed' });
  }
});

router.post('/slack/send', async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Authentication required' });

  const { integrationId, channel, text, blocks } = req.body;
  try {
    const [integration] = await db.select().from(enterpriseIntegrations).where(eq(enterpriseIntegrations.id, integrationId));
    if (!integration) return res.status(404).json({ error: 'Integration not found' });

    const metadata = integration.metadata as any;
    if (!metadata?.accessToken) return res.status(400).json({ error: 'Not connected' });

    const msgRes = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: { Authorization: `Bearer ${metadata.accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel, text, blocks }),
    });

    const data = await msgRes.json();
    res.json({ success: data.ok, ts: data.ts, channel: data.channel, error: data.error });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

router.post('/jira/create-issue', async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Authentication required' });

  const { integrationId, projectKey, summary, description, issueType, priority, assignee } = req.body;
  try {
    const [integration] = await db.select().from(enterpriseIntegrations).where(eq(enterpriseIntegrations.id, integrationId));
    if (!integration) return res.status(404).json({ error: 'Integration not found' });

    const metadata = integration.metadata as any;
    const config = integration.configuration as any;
    if (!metadata?.accessToken || !config?.cloudId) return res.status(400).json({ error: 'Not connected' });

    const issueData: any = {
      fields: {
        project: { key: projectKey },
        summary,
        issuetype: { name: issueType || 'Task' },
      },
    };

    if (description) {
      issueData.fields.description = {
        type: 'doc', version: 1,
        content: [{ type: 'paragraph', content: [{ type: 'text', text: description }] }],
      };
    }
    if (priority) issueData.fields.priority = { name: priority };
    if (assignee) issueData.fields.assignee = { accountId: assignee };

    const issueRes = await fetch(`https://api.atlassian.com/ex/jira/${config.cloudId}/rest/api/3/issue`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${metadata.accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(issueData),
    });

    if (!issueRes.ok) {
      const errData = await issueRes.json();
      return res.status(issueRes.status).json({ error: 'Failed to create issue', details: errData });
    }

    const issue = await issueRes.json();
    res.json({
      success: true,
      key: issue.key,
      id: issue.id,
      url: `${config.cloudUrl || ''}/browse/${issue.key}`,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create Jira issue' });
  }
});

router.get('/jira/projects', async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Authentication required' });

  const { integrationId } = req.query;
  try {
    const [integration] = await db.select().from(enterpriseIntegrations).where(eq(enterpriseIntegrations.id, integrationId as string));
    if (!integration) return res.status(404).json({ error: 'Integration not found' });

    const metadata = integration.metadata as any;
    const config = integration.configuration as any;
    if (!metadata?.accessToken || !config?.cloudId) return res.status(400).json({ error: 'Not connected' });

    const projRes = await fetch(`https://api.atlassian.com/ex/jira/${config.cloudId}/rest/api/3/project/search?maxResults=50`, {
      headers: { Authorization: `Bearer ${metadata.accessToken}`, Accept: 'application/json' },
    });

    if (!projRes.ok) return res.status(projRes.status).json({ error: 'Failed to fetch projects' });

    const data = await projRes.json();
    const projects = (data.values || []).map((p: any) => ({
      id: p.id, key: p.key, name: p.name, style: p.style,
    }));

    res.json({ projects });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Jira projects' });
  }
});

router.get('/slack/channels', async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Authentication required' });

  const { integrationId } = req.query;
  try {
    const [integration] = await db.select().from(enterpriseIntegrations).where(eq(enterpriseIntegrations.id, integrationId as string));
    if (!integration) return res.status(404).json({ error: 'Integration not found' });

    const metadata = integration.metadata as any;
    if (!metadata?.accessToken) return res.status(400).json({ error: 'Not connected' });

    const chanRes = await fetch('https://slack.com/api/conversations.list?types=public_channel,private_channel&limit=200', {
      headers: { Authorization: `Bearer ${metadata.accessToken}` },
    });

    const data = await chanRes.json();
    if (!data.ok) return res.status(500).json({ error: data.error });

    const channels = (data.channels || []).map((c: any) => ({
      id: c.id, name: c.name, isPrivate: c.is_private, memberCount: c.num_members,
    }));

    res.json({ channels });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Slack channels' });
  }
});

export default router;
