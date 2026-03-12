import { Router } from 'express';
import { dataIntegrationManager, COMMON_DATA_SOURCES } from '../integrations/DataIntegrationManager';
import { notificationManager } from '../integrations/NotificationManager';

const router = Router();

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
      message || 'Test notification from Veridius Executive System',
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

export default router;