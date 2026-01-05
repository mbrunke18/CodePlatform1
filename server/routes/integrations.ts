import { Router } from 'express';
import { dataIntegrationManager, COMMON_DATA_SOURCES } from '../integrations/DataIntegrationManager';
import { notificationManager } from '../integrations/NotificationManager';
import { integrationManager } from '../services/integrationManager';
import { dataSourceService } from '../services/dataSourceService';
import { syncEngine } from '../services/syncEngine';
import { z } from 'zod';

const router = Router();

// Helper function to get authenticated user ID from session
function getUserId(req: any): string | null {
  return req.user?.claims?.sub || req.user?.sub || req.user?.id || null;
}

// Middleware to require authentication
function requireAuth(req: any, res: any, next: any) {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  req.userId = userId;
  next();
}

// Zod schemas for request validation
const connectIntegrationSchema = z.object({
  organizationId: z.string().min(1),
  name: z.string().min(1),
  integrationType: z.enum(['slack', 'jira', 'calendar', 'directory', 'crm']),
  vendor: z.string().min(1),
  credentials: z.object({
    type: z.enum(['oauth', 'api_key', 'service_account']),
    data: z.record(z.any())
  }),
  configuration: z.record(z.any()).optional()
});

const createSlackChannelSchema = z.object({
  name: z.string().min(1),
  isPrivate: z.boolean().optional(),
  members: z.array(z.string()).optional(),
  topic: z.string().optional(),
  description: z.string().optional()
});

const sendSlackMessageSchema = z.object({
  channelId: z.string().min(1),
  message: z.string().min(1),
  threadTs: z.string().optional(),
  attachments: z.array(z.any()).optional()
});

const createJiraTasksSchema = z.object({
  tasks: z.array(z.object({
    projectKey: z.string().min(1),
    summary: z.string().min(1),
    description: z.string().optional(),
    priority: z.string().optional(),
    assignee: z.string().optional(),
    dueDate: z.string().optional()
  }))
});

const updateJiraStatusSchema = z.object({
  issueKey: z.string().min(1),
  status: z.string().min(1)
});

const createCalendarEventSchema = z.object({
  summary: z.string().min(1),
  description: z.string().optional(),
  startTime: z.string().min(1), // ISO 8601 datetime
  endTime: z.string().min(1), // ISO 8601 datetime
  attendees: z.array(z.string()).optional(),
  location: z.string().optional()
});

const activatePlaybookSchema = z.object({
  scenarioId: z.string().min(1),
  integrations: z.object({
    slack: z.string().optional(),
    jira: z.string().optional(),
    calendar: z.string().optional()
  })
});

/**
 * Data Integration Management Routes
 */

// Get all registered data sources
router.get('/data-sources', (req, res) => {
  try {
    const sources = dataIntegrationManager.getDataSources();
    res.json({
      sources,
      count: sources.length,
      connected: sources.filter(s => s.status === 'connected').length,
      disconnected: sources.filter(s => s.status === 'disconnected').length
    });
  } catch (error) {
    console.error('Error fetching data sources:', error);
    res.status(500).json({ message: 'Failed to fetch data sources' });
  }
});

// Register a new data source
router.post('/data-sources', (req, res) => {
  try {
    const sourceData = req.body;
    dataIntegrationManager.registerDataSource(sourceData);
    res.status(201).json({ message: 'Data source registered successfully', id: sourceData.id });
  } catch (error) {
    console.error('Error registering data source:', error);
    res.status(500).json({ message: 'Failed to register data source' });
  }
});

// Quick setup common data sources
router.post('/data-sources/setup-common', (req, res) => {
  try {
    const { sourceTypes } = req.body; // Array of source types to enable
    
    const results = sourceTypes.map((type: string) => {
      const source = COMMON_DATA_SOURCES[type as keyof typeof COMMON_DATA_SOURCES];
      if (source) {
        dataIntegrationManager.registerDataSource(source);
        return { type, status: 'registered', id: source.id };
      }
      return { type, status: 'not_found' };
    });

    res.json({ 
      message: 'Common data sources setup completed',
      results 
    });
  } catch (error) {
    console.error('Error setting up common data sources:', error);
    res.status(500).json({ message: 'Failed to setup common data sources' });
  }
});

// Map trigger to data source
router.post('/trigger-mappings', (req, res) => {
  try {
    const mappingData = req.body;
    dataIntegrationManager.mapTriggerToDataSource(mappingData);
    res.status(201).json({ message: 'Trigger mapping created successfully' });
  } catch (error) {
    console.error('Error creating trigger mapping:', error);
    res.status(500).json({ message: 'Failed to create trigger mapping' });
  }
});

/**
 * Notification Management Routes
 */

// Get all stakeholders
router.get('/stakeholders', (req, res) => {
  try {
    const stakeholders = notificationManager.getStakeholders();
    res.json(stakeholders);
  } catch (error) {
    console.error('Error fetching stakeholders:', error);
    res.status(500).json({ message: 'Failed to fetch stakeholders' });
  }
});

// Add or update stakeholder
router.post('/stakeholders', (req, res) => {
  try {
    const stakeholderData = req.body;
    notificationManager.addStakeholder(stakeholderData);
    res.status(201).json({ message: 'Stakeholder added successfully', id: stakeholderData.id });
  } catch (error) {
    console.error('Error adding stakeholder:', error);
    res.status(500).json({ message: 'Failed to add stakeholder' });
  }
});

// Test notification system
router.post('/test-notification', async (req, res) => {
  try {
    const { scenarioType, severity, message } = req.body;
    
    await notificationManager.sendScenarioAlert(
      scenarioType || 'test',
      severity || 'medium',
      message || 'Test notification from M Executive System',
      { source: 'api-test', timestamp: new Date().toISOString() }
    );

    res.json({ message: 'Test notification sent successfully' });
  } catch (error) {
    console.error('Error sending test notification:', error);
    res.status(500).json({ message: 'Failed to send test notification' });
  }
});

// Register notification rule
router.post('/notification-rules', (req, res) => {
  try {
    const ruleData = req.body;
    notificationManager.registerNotificationRule(ruleData);
    res.status(201).json({ message: 'Notification rule registered successfully' });
  } catch (error) {
    console.error('Error registering notification rule:', error);
    res.status(500).json({ message: 'Failed to register notification rule' });
  }
});

// Integration health check
router.get('/health', (req, res) => {
  try {
    const dataSources = dataIntegrationManager.getDataSources();
    const stakeholders = notificationManager.getStakeholders();
    
    res.json({
      status: 'operational',
      timestamp: new Date().toISOString(),
      integrations: {
        dataSources: {
          total: dataSources.length,
          connected: dataSources.filter(s => s.status === 'connected').length,
          disconnected: dataSources.filter(s => s.status === 'disconnected').length,
          errors: dataSources.filter(s => s.status === 'error').length
        },
        notifications: {
          stakeholders: stakeholders.length,
          emergencyContacts: stakeholders.filter(s => s.emergencyContact).length
        }
      }
    });
  } catch (error) {
    console.error('Error checking integration health:', error);
    res.status(500).json({ message: 'Health check failed' });
  }
});

/**
 * Enterprise Integration Management Routes (New Architecture)
 * All routes require authentication
 */

// Get all integrations for an organization
router.get('/enterprise/:organizationId', requireAuth, async (req, res) => {
  try {
    const { organizationId } = req.params;
    const integrations = await integrationManager.getIntegrations(organizationId);
    res.json(integrations);
  } catch (error) {
    console.error('Failed to get integrations:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve integrations',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Connect a new integration
router.post('/enterprise/connect', requireAuth, async (req, res) => {
  try {
    // Validate request body
    const validationResult = connectIntegrationSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid request data',
        details: validationResult.error.issues
      });
    }
    
    const { organizationId, name, integrationType, vendor, credentials, configuration } = validationResult.data;
    
    const integration = await integrationManager.connectIntegration({
      organizationId,
      name,
      integrationType,
      vendor,
      credentials,
      configuration,
    });
    
    res.json(integration);
  } catch (error) {
    console.error('Failed to connect integration:', error);
    res.status(500).json({ 
      error: 'Failed to connect integration',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Disconnect an integration
router.post('/enterprise/:integrationId/disconnect', requireAuth, async (req, res) => {
  try {
    const { integrationId } = req.params;
    const result = await integrationManager.disconnectIntegration(integrationId);
    res.json(result);
  } catch (error) {
    console.error('Failed to disconnect integration:', error);
    res.status(500).json({ 
      error: 'Failed to disconnect integration',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Test integration connection
router.get('/enterprise/:integrationId/test', requireAuth, async (req, res) => {
  try {
    const { integrationId } = req.params;
    const isHealthy = await integrationManager.testConnection(integrationId);
    res.json({ healthy: isHealthy });
  } catch (error) {
    console.error('Connection test failed:', error);
    res.status(500).json({ 
      error: 'Connection test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get integration health status
router.get('/enterprise/:integrationId/health', requireAuth, async (req, res) => {
  try {
    const { integrationId } = req.params;
    const health = await integrationManager.getIntegrationHealth(integrationId);
    res.json(health);
  } catch (error) {
    console.error('Failed to get health status:', error);
    res.status(500).json({ 
      error: 'Failed to get health status',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Query stakeholders from connected directory
router.get('/enterprise/:integrationId/stakeholders', requireAuth, async (req, res) => {
  try {
    const { integrationId } = req.params;
    const { department, role, level } = req.query;
    
    const stakeholders = await dataSourceService.queryStakeholders(integrationId, {
      department: department as string,
      role: role as string,
      level: level as string,
    });
    
    res.json(stakeholders);
  } catch (error) {
    console.error('Failed to query stakeholders:', error);
    res.status(500).json({ 
      error: 'Failed to query stakeholders',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Query communication channels
router.get('/enterprise/:integrationId/channels', requireAuth, async (req, res) => {
  try {
    const { integrationId } = req.params;
    const channels = await dataSourceService.queryCommunicationChannels(integrationId);
    res.json(channels);
  } catch (error) {
    console.error('Failed to query channels:', error);
    res.status(500).json({ 
      error: 'Failed to query channels',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Query projects from project management tools
router.get('/enterprise/:integrationId/projects', requireAuth, async (req, res) => {
  try {
    const { integrationId } = req.params;
    const projects = await dataSourceService.queryProjects(integrationId);
    res.json(projects);
  } catch (error) {
    console.error('Failed to query projects:', error);
    res.status(500).json({ 
      error: 'Failed to query projects',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create Slack channel
router.post('/enterprise/:integrationId/slack/create-channel', requireAuth, async (req, res) => {
  try {
    const { integrationId } = req.params;
    
    // Validate request body
    const validationResult = createSlackChannelSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid request data',
        details: validationResult.error.issues
      });
    }
    
    const { name, isPrivate, members, topic, description } = validationResult.data;
    
    const result = await syncEngine.createSlackChannel(integrationId, {
      name,
      isPrivate,
      members,
      topic,
      description,
    });
    
    res.json(result);
  } catch (error) {
    console.error('Failed to create Slack channel:', error);
    res.status(500).json({ 
      error: 'Failed to create Slack channel',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Send Slack message
router.post('/enterprise/:integrationId/slack/send-message', requireAuth, async (req, res) => {
  try {
    const { integrationId } = req.params;
    
    // Validate request body
    const validationResult = sendSlackMessageSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid request data',
        details: validationResult.error.issues
      });
    }
    
    const { channelId, message, threadTs, attachments } = validationResult.data;
    
    const result = await syncEngine.sendSlackMessage(integrationId, channelId, message, {
      threadTs,
      attachments,
    });
    
    res.json(result);
  } catch (error) {
    console.error('Failed to send Slack message:', error);
    res.status(500).json({ 
      error: 'Failed to send Slack message',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create Jira tasks
router.post('/enterprise/:integrationId/jira/create-tasks', requireAuth, async (req, res) => {
  try {
    const { integrationId } = req.params;
    
    // Validate request body
    const validationResult = createJiraTasksSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid request data',
        details: validationResult.error.issues
      });
    }
    
    const { tasks } = validationResult.data;
    
    const result = await syncEngine.createJiraTasks(integrationId, tasks);
    res.json(result);
  } catch (error) {
    console.error('Failed to create Jira tasks:', error);
    res.status(500).json({ 
      error: 'Failed to create Jira tasks',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update Jira task status
router.post('/enterprise/:integrationId/jira/update-status', requireAuth, async (req, res) => {
  try {
    const { integrationId } = req.params;
    
    // Validate request body
    const validationResult = updateJiraStatusSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid request data',
        details: validationResult.error.issues
      });
    }
    
    const { issueKey, status } = validationResult.data;
    
    const result = await syncEngine.updateJiraTaskStatus(integrationId, issueKey, status);
    res.json(result);
  } catch (error) {
    console.error('Failed to update Jira status:', error);
    res.status(500).json({ 
      error: 'Failed to update Jira status',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Schedule calendar event
router.post('/enterprise/:integrationId/calendar/create-event', requireAuth, async (req, res) => {
  try {
    const { integrationId } = req.params;
    
    // Validate request body
    const validationResult = createCalendarEventSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid request data',
        details: validationResult.error.issues
      });
    }
    
    const { summary, description, startTime, endTime, attendees, location } = validationResult.data;
    
    const result = await syncEngine.scheduleCalendarEvent(integrationId, {
      summary,
      description,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      attendees,
      location,
    });
    
    res.json(result);
  } catch (error) {
    console.error('Failed to schedule calendar event:', error);
    res.status(500).json({ 
      error: 'Failed to schedule calendar event',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Execute full playbook activation (the "magic button")
router.post('/enterprise/activate-playbook', requireAuth, async (req, res) => {
  try {
    // Validate request body
    const validationResult = activatePlaybookSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid request data',
        details: validationResult.error.issues
      });
    }
    
    const { scenarioId, integrations } = validationResult.data;
    
    const result = await syncEngine.executePlaybookActivation(scenarioId, integrations);
    res.json(result);
  } catch (error) {
    console.error('Failed to activate playbook:', error);
    res.status(500).json({ 
      error: 'Failed to activate playbook',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get integration marketplace (available integrations)
router.get('/marketplace', async (req, res) => {
  try {
    const availableIntegrations = [
      {
        id: 'servicenow',
        name: 'ServiceNow',
        vendor: 'servicenow',
        category: 'project_management',
        description: 'Enterprise IT service management and workflow automation',
        capabilities: ['incident_management', 'task_routing', 'bi_directional_sync', 'resolution_tracking'],
        logo: '/integrations/servicenow.svg',
        status: 'available',
      },
      {
        id: 'jira',
        name: 'Jira',
        vendor: 'atlassian',
        category: 'project_management',
        description: 'Create and track issues automatically',
        capabilities: ['task_creation', 'status_updates', 'project_queries'],
        logo: '/integrations/jira.svg',
        status: 'available',
      },
      {
        id: 'slack',
        name: 'Slack',
        vendor: 'slack',
        category: 'communication',
        description: 'Automated channel creation and messaging',
        capabilities: ['channel_creation', 'messaging', 'notifications'],
        logo: '/integrations/slack.svg',
        status: 'available',
      },
      {
        id: 'google-calendar',
        name: 'Google Calendar',
        vendor: 'google',
        category: 'scheduling',
        description: 'Schedule crisis response meetings',
        capabilities: ['event_creation', 'meeting_scheduling'],
        logo: '/integrations/google-calendar.svg',
        status: 'available',
      },
      {
        id: 'microsoft-ad',
        name: 'Active Directory',
        vendor: 'microsoft',
        category: 'directory',
        description: 'Pull stakeholder information',
        capabilities: ['user_directory', 'org_structure'],
        logo: '/integrations/microsoft.svg',
        status: 'available',
      },
      {
        id: 'hubspot',
        name: 'HubSpot',
        vendor: 'hubspot',
        category: 'crm',
        description: 'Customer relationship data',
        capabilities: ['contact_queries', 'deal_tracking'],
        logo: '/integrations/hubspot.svg',
        status: 'available',
      },
      {
        id: 'salesforce',
        name: 'Salesforce',
        vendor: 'salesforce',
        category: 'crm',
        description: 'Enterprise CRM integration',
        capabilities: ['contact_queries', 'opportunity_tracking'],
        logo: '/integrations/salesforce.svg',
        status: 'coming_soon',
      },
      {
        id: 'teams',
        name: 'Microsoft Teams',
        vendor: 'microsoft',
        category: 'communication',
        description: 'Team communication and collaboration',
        capabilities: ['channel_creation', 'messaging'],
        logo: '/integrations/teams.svg',
        status: 'available',
      },
      {
        id: 'asana',
        name: 'Asana',
        vendor: 'asana',
        category: 'project_management',
        description: 'Work management and project tracking',
        capabilities: ['task_creation', 'project_tracking', 'team_coordination'],
        logo: '/integrations/asana.svg',
        status: 'available',
      },
      {
        id: 'monday',
        name: 'Monday.com',
        vendor: 'monday',
        category: 'project_management',
        description: 'Work OS for enterprise workflows',
        capabilities: ['board_creation', 'automation', 'timeline_tracking'],
        logo: '/integrations/monday.svg',
        status: 'available',
      },
      {
        id: 'outlook',
        name: 'Microsoft Outlook',
        vendor: 'microsoft',
        category: 'scheduling',
        description: 'Calendar and email integration',
        capabilities: ['event_creation', 'email_notifications', 'meeting_scheduling'],
        logo: '/integrations/outlook.svg',
        status: 'available',
      },
      {
        id: 'okta',
        name: 'Okta',
        vendor: 'okta',
        category: 'directory',
        description: 'Identity and access management',
        capabilities: ['sso', 'user_provisioning', 'access_policies'],
        logo: '/integrations/okta.svg',
        status: 'available',
      },
      {
        id: 'workday',
        name: 'Workday',
        vendor: 'workday',
        category: 'directory',
        description: 'HR and financial management data',
        capabilities: ['org_structure', 'employee_data', 'workforce_planning'],
        logo: '/integrations/workday.svg',
        status: 'coming_soon',
      },
      {
        id: 'pagerduty',
        name: 'PagerDuty',
        vendor: 'pagerduty',
        category: 'communication',
        description: 'Incident response and on-call management',
        capabilities: ['incident_alerts', 'escalation_policies', 'on_call_scheduling'],
        logo: '/integrations/pagerduty.svg',
        status: 'available',
      },
    ];
    
    res.json(availableIntegrations);
  } catch (error) {
    console.error('Failed to get marketplace:', error);
    res.status(500).json({ 
      error: 'Failed to get marketplace',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;