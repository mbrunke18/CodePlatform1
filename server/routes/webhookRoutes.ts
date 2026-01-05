/**
 * M Webhook Routes
 * Real-time data ingestion endpoints for 12 enterprise systems
 * Receives events from Salesforce, ServiceNow, Jira, Slack, etc.
 * Triggers real-time monitoring and playbook activation
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import { triggerIntelligence } from '../services/TriggerIntelligenceService';
import crypto from 'crypto';
import { parseStringPromise } from 'xml2js';

const router = Router();

// ============================================================================
// WEBHOOK VERIFICATION HELPERS
// ============================================================================

/**
 * Verify Slack webhook signature
 * CRITICAL: Uses raw request body for HMAC verification (not JSON.stringify)
 */
function verifySlackSignature(req: Request, signingSecret: string): boolean {
  const timestamp = req.headers['x-slack-request-timestamp'] as string;
  const signature = req.headers['x-slack-signature'] as string;
  const rawBody = (req as any).rawBody;
  
  if (!timestamp || !signature || !rawBody) return false;
  
  // Prevent replay attacks (timestamp must be within 5 minutes)
  const time = Math.floor(Date.now() / 1000);
  if (Math.abs(time - parseInt(timestamp)) > 300) return false;
  
  // Use raw body, not JSON.stringify(req.body)
  const sigBasestring = `v0:${timestamp}:${rawBody}`;
  const mySignature = 'v0=' + crypto
    .createHmac('sha256', signingSecret)
    .update(sigBasestring)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(mySignature),
    Buffer.from(signature)
  );
}

/**
 * Verify Salesforce webhook signature
 * CRITICAL: Uses raw request body for HMAC verification (not JSON.stringify)
 */
function verifySalesforceSignature(req: Request, secret: string): boolean {
  const signature = req.headers['x-hub-signature'] as string;
  const rawBody = (req as any).rawBody;
  
  if (!signature || !rawBody) return false;
  
  const hmac = crypto.createHmac('sha1', secret);
  hmac.update(rawBody);
  const expectedSignature = 'sha1=' + hmac.digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(signature)
  );
}

/**
 * Verify HubSpot webhook signature
 * CRITICAL: Uses raw request body for HMAC verification (not JSON.stringify)
 */
function verifyHubSpotSignature(req: Request, clientSecret: string): boolean {
  const signature = req.headers['x-hubspot-signature'] as string;
  const rawBody = (req as any).rawBody;
  
  if (!signature || !rawBody) return false;
  
  const method = req.method;
  const uri = req.originalUrl;
  
  // Use raw body, not JSON.stringify(req.body)
  const sourceString = method + uri + rawBody;
  const hash = crypto.createHmac('sha256', clientSecret)
    .update(sourceString)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(hash),
    Buffer.from(signature)
  );
}

// ============================================================================
// SALESFORCE CRM WEBHOOKS
// ============================================================================

/**
 * Salesforce Webhooks (Outbound Messages + Change Data Capture + Platform Events)
 * Receives: Opportunity stage changes, account updates, high-value deal alerts
 * 
 * Supports TWO formats:
 * 1. Outbound Messages (SOAP/XML) - Production standard
 * 2. Change Data Capture / Platform Events (JSON) - Modern alternative
 */
router.post('/webhooks/salesforce', async (req: Request, res: Response) => {
  try {
    // Verify webhook signature if secret is configured
    const secret = process.env.SALESFORCE_WEBHOOK_SECRET;
    if (secret && !verifySalesforceSignature(req, secret)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    let events: any[] = [];
    const contentType = req.headers['content-type'] || '';

    // Handle SOAP/XML Outbound Messages (Production Salesforce standard)
    if (contentType.includes('xml')) {
      const rawBody = (req as any).rawBody || '';
      const parsed = await parseStringPromise(rawBody, { 
        explicitArray: false, 
        ignoreAttrs: false 
      });

      // Extract notifications from SOAP envelope
      const soapBody = parsed['soapenv:Envelope']?.['soapenv:Body'];
      const notifications = soapBody?.notifications?.Notification || [];
      const sObjects = Array.isArray(notifications) ? notifications : [notifications];

      events = sObjects.map((n: any) => n.sObject || n).filter(Boolean);
      console.log(`📥 Received ${events.length} Salesforce SOAP/XML webhook event(s)`);
    }
    // Handle JSON format (Change Data Capture / Platform Events)
    else if (contentType.includes('json')) {
      const notifications = req.body.sObject || req.body.notifications || req.body.data || [];
      events = Array.isArray(notifications) ? notifications : [notifications];
      console.log(`📥 Received ${events.length} Salesforce JSON webhook event(s)`);
    }
    else {
      console.warn(`⚠️ Unknown Salesforce content type: ${contentType}`);
      return res.status(400).json({ error: 'Unsupported content type' });
    }

    for (const event of events) {
      // Extract organization ID from custom field or use default
      const organizationId = event.Organization_M_ID__c || event.OrganizationId || 'default-org-id';
      
      // Analyze event with AI
      const analysis = await triggerIntelligence.analyzeEvent({
        source: 'salesforce',
        title: `Salesforce ${event.type || event.$?.['xsi:type'] || 'Update'}: ${event.Name || event.Id}`,
        content: JSON.stringify(event),
        timestamp: new Date(event.LastModifiedDate || event.CreatedDate || new Date())
      });

      // Match against active triggers
      const matches = await triggerIntelligence.matchTriggers(
        organizationId,
        analysis,
        {
          source: 'salesforce_webhook',
          objectType: event.type || event.$?.['xsi:type'] || 'Unknown',
          eventData: event,
          timestamp: new Date()
        }
      );

      // Create alerts for matches
      for (const match of matches) {
        await triggerIntelligence.createAlert(
          organizationId,
          match,
          {
            salesforceEvent: event,
            analysis
          }
        );
        console.log(`🚨 Salesforce trigger activated: ${match.triggerId}`);
      }
    }

    // Return appropriate ACK based on content type
    if (contentType.includes('xml')) {
      // SOAP/XML ACK for Outbound Messages
      res.status(200).send('<?xml version="1.0" encoding="UTF-8"?><soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Body><notificationsResponse><Ack>true</Ack></notificationsResponse></soapenv:Body></soapenv:Envelope>');
    } else {
      // JSON ACK for Change Data Capture / Platform Events
      res.status(200).json({ success: true, processed: events.length });
    }
    
  } catch (error) {
    console.error('❌ Salesforce webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// ============================================================================
// SERVICENOW ITSM WEBHOOKS
// ============================================================================

/**
 * ServiceNow Business Rules webhooks
 * Receives: High-priority incidents, emergency changes, SLA breaches
 */
router.post('/webhooks/servicenow', async (req: Request, res: Response) => {
  try {
    const { table, operation, record } = req.body;
    
    console.log(`📥 ServiceNow webhook: ${table} ${operation}`);

    // Extract organization from custom field
    const organizationId = record.u_vexor_org_id || 'default-org-id';
    
    // Analyze event
    const analysis = await triggerIntelligence.analyzeEvent({
      source: 'servicenow',
      title: `ServiceNow ${table}: ${record.number} - ${record.short_description}`,
      content: `Priority: ${record.priority}, State: ${record.state}, ${record.description || ''}`,
      timestamp: new Date(record.sys_updated_on || new Date())
    });

    // Match triggers
    const matches = await triggerIntelligence.matchTriggers(
      organizationId,
      analysis,
      {
        source: 'servicenow_webhook',
        table,
        operation,
        record,
        timestamp: new Date()
      }
    );

    // Create alerts
    for (const match of matches) {
      await triggerIntelligence.createAlert(
        organizationId,
        match,
        {
          serviceNowEvent: { table, operation, record },
          analysis
        }
      );
      console.log(`🚨 ServiceNow trigger activated: ${match.triggerId}`);
    }

    res.status(200).json({ success: true, processed: matches.length });
    
  } catch (error) {
    console.error('❌ ServiceNow webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// ============================================================================
// JIRA WEBHOOKS
// ============================================================================

/**
 * Jira Webhooks
 * Receives: Issue created, issue updated, sprint started, deployment events
 */
router.post('/webhooks/jira', async (req: Request, res: Response) => {
  try {
    const { webhookEvent, issue, changelog } = req.body;
    
    console.log(`📥 Jira webhook: ${webhookEvent} - ${issue?.key}`);

    // Extract organization from custom field
    const organizationId = issue?.fields?.customfield_vexor_org || 'default-org-id';
    
    // Analyze event
    const analysis = await triggerIntelligence.analyzeEvent({
      source: 'jira',
      title: `Jira ${webhookEvent}: ${issue?.key} - ${issue?.fields?.summary}`,
      content: issue?.fields?.description || JSON.stringify(changelog),
      timestamp: new Date(issue?.fields?.updated || new Date())
    });

    // Match triggers
    const matches = await triggerIntelligence.matchTriggers(
      organizationId,
      analysis,
      {
        source: 'jira_webhook',
        webhookEvent,
        issue,
        changelog,
        timestamp: new Date()
      }
    );

    // Create alerts
    for (const match of matches) {
      await triggerIntelligence.createAlert(
        organizationId,
        match,
        {
          jiraEvent: { webhookEvent, issue, changelog },
          analysis
        }
      );
      console.log(`🚨 Jira trigger activated: ${match.triggerId}`);
    }

    res.status(200).json({ success: true });
    
  } catch (error) {
    console.error('❌ Jira webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// ============================================================================
// SLACK WEBHOOKS
// ============================================================================

/**
 * Slack Events API
 * Receives: Messages in monitored channels, mentions, reactions
 */
router.post('/webhooks/slack', async (req: Request, res: Response) => {
  try {
    // Handle Slack URL verification challenge
    if (req.body.type === 'url_verification') {
      return res.status(200).json({ challenge: req.body.challenge });
    }

    // Verify signature
    const signingSecret = process.env.SLACK_SIGNING_SECRET;
    if (signingSecret && !verifySlackSignature(req, signingSecret)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const { event, team_id } = req.body;
    
    console.log(`📥 Slack event: ${event?.type} from team ${team_id}`);

    // Map team_id to organization (would be in database)
    const organizationId = 'default-org-id'; // TODO: Look up from team_id mapping
    
    // Analyze event
    const analysis = await triggerIntelligence.analyzeEvent({
      source: 'slack',
      title: `Slack ${event?.type}: ${event?.channel || 'DM'}`,
      content: event?.text || JSON.stringify(event),
      timestamp: new Date(parseFloat(event?.ts || '0') * 1000)
    });

    // Match triggers
    const matches = await triggerIntelligence.matchTriggers(
      organizationId,
      analysis,
      {
        source: 'slack_webhook',
        event,
        team_id,
        timestamp: new Date()
      }
    );

    // Create alerts
    for (const match of matches) {
      await triggerIntelligence.createAlert(
        organizationId,
        match,
        {
          slackEvent: event,
          analysis
        }
      );
      console.log(`🚨 Slack trigger activated: ${match.triggerId}`);
    }

    res.status(200).json({ ok: true });
    
  } catch (error) {
    console.error('❌ Slack webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// ============================================================================
// HUBSPOT WEBHOOKS
// ============================================================================

/**
 * HubSpot Webhooks
 * Receives: Deal stage changes, contact property updates, company events
 */
router.post('/webhooks/hubspot', async (req: Request, res: Response) => {
  try {
    // Verify signature
    const clientSecret = process.env.HUBSPOT_CLIENT_SECRET;
    if (clientSecret && !verifyHubSpotSignature(req, clientSecret)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const events = req.body;
    const eventArray = Array.isArray(events) ? events : [events];
    
    console.log(`📥 Received ${eventArray.length} HubSpot webhook event(s)`);

    for (const event of eventArray) {
      const { subscriptionType, objectId, propertyName, propertyValue, portalId } = event;
      
      // Map portalId to organization
      const organizationId = 'default-org-id'; // TODO: Look up from portalId mapping
      
      // Analyze event
      const analysis = await triggerIntelligence.analyzeEvent({
        source: 'hubspot',
        title: `HubSpot ${subscriptionType}: ${objectId}`,
        content: `Property ${propertyName} changed to ${propertyValue}`,
        timestamp: new Date(event.occurredAt || new Date())
      });

      // Match triggers
      const matches = await triggerIntelligence.matchTriggers(
        organizationId,
        analysis,
        {
          source: 'hubspot_webhook',
          event,
          timestamp: new Date()
        }
      );

      // Create alerts
      for (const match of matches) {
        await triggerIntelligence.createAlert(
          organizationId,
          match,
          {
            hubspotEvent: event,
            analysis
          }
        );
        console.log(`🚨 HubSpot trigger activated: ${match.triggerId}`);
      }
    }

    res.status(200).json({ success: true });
    
  } catch (error) {
    console.error('❌ HubSpot webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// ============================================================================
// GOOGLE WORKSPACE WEBHOOKS (Push Notifications)
// ============================================================================

/**
 * Google Calendar Push Notifications
 * Receives: Calendar event created, updated, deleted
 */
router.post('/webhooks/google/calendar', async (req: Request, res: Response) => {
  try {
    const channelId = req.headers['x-goog-channel-id'];
    const resourceState = req.headers['x-goog-resource-state'] as string; // 'sync', 'exists', 'not_exists'
    const resourceId = req.headers['x-goog-resource-id'];
    
    console.log(`📥 Google Calendar webhook: ${resourceState} for channel ${channelId}`);

    // Ignore sync messages
    if (resourceState === 'sync') {
      return res.status(200).send('OK');
    }

    // Map channelId to organization (would be in database)
    const organizationId = 'default-org-id';
    
    // Analyze event
    const analysis = await triggerIntelligence.analyzeEvent({
      source: 'google_calendar',
      title: `Google Calendar ${resourceState}`,
      content: `Resource ${resourceId} state changed`,
      timestamp: new Date()
    });

    // Match triggers
    const matches = await triggerIntelligence.matchTriggers(
      organizationId,
      analysis,
      {
        source: 'google_calendar_webhook',
        channelId,
        resourceState,
        resourceId,
        timestamp: new Date()
      }
    );

    // Create alerts
    for (const match of matches) {
      await triggerIntelligence.createAlert(
        organizationId,
        match,
        {
          googleCalendarEvent: { channelId, resourceState, resourceId },
          analysis
        }
      );
    }

    res.status(200).send('OK');
    
  } catch (error) {
    console.error('❌ Google Calendar webhook error:', error);
    res.status(500).send('Error');
  }
});

// ============================================================================
// MICROSOFT TEAMS WEBHOOKS
// ============================================================================

/**
 * Microsoft Teams Channel Messages
 * Receives: New messages in monitored Teams channels
 */
router.post('/webhooks/microsoft/teams', async (req: Request, res: Response) => {
  try {
    const { value } = req.body;
    const notifications = Array.isArray(value) ? value : [value];
    
    console.log(`📥 Received ${notifications.length} Microsoft Teams notification(s)`);

    for (const notification of notifications) {
      const { resource, resourceData, changeType } = notification;
      
      // Map subscription to organization
      const organizationId = 'default-org-id';
      
      // Analyze event
      const analysis = await triggerIntelligence.analyzeEvent({
        source: 'microsoft_teams',
        title: `Teams ${changeType}: ${resource}`,
        content: JSON.stringify(resourceData),
        timestamp: new Date()
      });

      // Match triggers
      const matches = await triggerIntelligence.matchTriggers(
        organizationId,
        analysis,
        {
          source: 'teams_webhook',
          notification,
          timestamp: new Date()
        }
      );

      // Create alerts
      for (const match of matches) {
        await triggerIntelligence.createAlert(
          organizationId,
          match,
          {
            teamsEvent: notification,
            analysis
          }
        );
      }
    }

    res.status(202).send('Accepted');
    
  } catch (error) {
    console.error('❌ Microsoft Teams webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// ============================================================================
// AWS CLOUDWATCH WEBHOOKS (via SNS)
// ============================================================================

/**
 * AWS CloudWatch Alarms via SNS
 * Receives: CloudWatch alarm state changes
 */
router.post('/webhooks/aws/cloudwatch', async (req: Request, res: Response) => {
  try {
    // Handle SNS subscription confirmation
    if (req.body.Type === 'SubscriptionConfirmation') {
      console.log('📝 AWS SNS subscription confirmation received');
      // In production, you'd fetch the SubscribeURL to confirm
      return res.status(200).send('OK');
    }

    const message = JSON.parse(req.body.Message || '{}');
    const { AlarmName, NewStateValue, NewStateReason, Trigger } = message;
    
    console.log(`📥 CloudWatch alarm: ${AlarmName} is ${NewStateValue}`);

    // Map AWS account to organization
    const organizationId = 'default-org-id';
    
    // Analyze event
    const analysis = await triggerIntelligence.analyzeEvent({
      source: 'aws_cloudwatch',
      title: `CloudWatch Alarm: ${AlarmName} - ${NewStateValue}`,
      content: `${NewStateReason}\nMetric: ${Trigger?.MetricName} (${Trigger?.Namespace})`,
      timestamp: new Date()
    });

    // Match triggers
    const matches = await triggerIntelligence.matchTriggers(
      organizationId,
      analysis,
      {
        source: 'cloudwatch_webhook',
        alarm: message,
        timestamp: new Date()
      }
    );

    // Create alerts
    for (const match of matches) {
      await triggerIntelligence.createAlert(
        organizationId,
        match,
        {
          cloudWatchAlarm: message,
          analysis
        }
      );
      console.log(`🚨 CloudWatch trigger activated: ${match.triggerId}`);
    }

    res.status(200).send('OK');
    
  } catch (error) {
    console.error('❌ CloudWatch webhook error:', error);
    res.status(500).send('Error');
  }
});

// ============================================================================
// WORKDAY HCM WEBHOOKS
// ============================================================================

/**
 * Workday Event Notifications
 * Receives: Employee status changes, requisition updates
 */
router.post('/webhooks/workday', async (req: Request, res: Response) => {
  try {
    const { eventType, worker, requisition } = req.body;
    
    console.log(`📥 Workday webhook: ${eventType}`);

    const organizationId = 'default-org-id';
    
    // Analyze event
    const analysis = await triggerIntelligence.analyzeEvent({
      source: 'workday',
      title: `Workday ${eventType}`,
      content: JSON.stringify(worker || requisition),
      timestamp: new Date()
    });

    // Match triggers
    const matches = await triggerIntelligence.matchTriggers(
      organizationId,
      analysis,
      {
        source: 'workday_webhook',
        eventType,
        data: req.body,
        timestamp: new Date()
      }
    );

    // Create alerts
    for (const match of matches) {
      await triggerIntelligence.createAlert(
        organizationId,
        match,
        {
          workdayEvent: req.body,
          analysis
        }
      );
    }

    res.status(200).json({ success: true });
    
  } catch (error) {
    console.error('❌ Workday webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// ============================================================================
// OKTA WEBHOOKS
// ============================================================================

/**
 * Okta Event Hooks
 * Receives: User lifecycle events, authentication events, security alerts
 */
router.post('/webhooks/okta', async (req: Request, res: Response) => {
  try {
    const { events } = req.body;
    const data = req.body.data || {};
    
    console.log(`📥 Okta webhook: ${data.events?.length || 0} events`);

    const organizationId = 'default-org-id';
    
    for (const event of (data.events || [])) {
      // Analyze event
      const analysis = await triggerIntelligence.analyzeEvent({
        source: 'okta',
        title: `Okta ${event.eventType}: ${event.displayMessage}`,
        content: JSON.stringify(event),
        timestamp: new Date(event.published)
      });

      // Match triggers
      const matches = await triggerIntelligence.matchTriggers(
        organizationId,
        analysis,
        {
          source: 'okta_webhook',
          event,
          timestamp: new Date()
        }
      );

      // Create alerts
      for (const match of matches) {
        await triggerIntelligence.createAlert(
          organizationId,
          match,
          {
            oktaEvent: event,
            analysis
          }
        );
      }
    }

    res.status(200).json({ success: true });
    
  } catch (error) {
    console.error('❌ Okta webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// ============================================================================
// WEBHOOK HEALTH CHECK
// ============================================================================

router.get('/webhooks/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    endpoints: {
      salesforce: '/webhooks/salesforce',
      servicenow: '/webhooks/servicenow',
      jira: '/webhooks/jira',
      slack: '/webhooks/slack',
      hubspot: '/webhooks/hubspot',
      google_calendar: '/webhooks/google/calendar',
      microsoft_teams: '/webhooks/microsoft/teams',
      aws_cloudwatch: '/webhooks/aws/cloudwatch',
      workday: '/webhooks/workday',
      okta: '/webhooks/okta'
    },
    timestamp: new Date().toISOString()
  });
});

export default router;
