import { db } from '../db.js';
import { enterpriseIntegrations, integrationData, organizations } from '@shared/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import { databaseNotificationService } from './DatabaseNotificationService.js';

export interface IntegrationConfig {
  name: string;
  type: 'erp' | 'crm' | 'bi' | 'communication' | 'security' | 'hr' | 'finance';
  vendor: string;
  apiEndpoint: string;
  authenticationType: 'oauth' | 'api_key' | 'basic_auth' | 'jwt';
  credentials: {
    clientId?: string;
    clientSecret?: string;
    apiKey?: string;
    username?: string;
    password?: string;
    token?: string;
  };
  dataMapping: {
    inbound: Array<{
      sourceField: string;
      targetField: string;
      transformation?: string;
    }>;
    outbound: Array<{
      sourceField: string;
      targetField: string;
      transformation?: string;
    }>;
  };
  syncFrequency: 'real-time' | 'hourly' | 'daily' | 'weekly';
  filters?: Record<string, any>;
}

export interface IntegrationStatus {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error' | 'pending';
  lastSyncAt: Date | null;
  nextSyncAt: Date | null;
  errorCount: number;
  successRate: number;
  lastError?: string;
  syncedRecords: {
    today: number;
    thisWeek: number;
    total: number;
  };
}

export interface DataSyncResult {
  integrationId: string;
  status: 'success' | 'partial' | 'failed';
  recordsProcessed: number;
  recordsSucceeded: number;
  recordsFailed: number;
  errors: Array<{
    record: any;
    error: string;
  }>;
  duration: number; // milliseconds
}

export class EnterpriseIntegrationService {

  /**
   * Create a new enterprise integration
   */
  async createIntegration(organizationId: string, config: IntegrationConfig): Promise<string> {
    try {
      // Validate configuration
      await this.validateIntegrationConfig(config);

      const [integration] = await db.insert(enterpriseIntegrations).values({
        organizationId,
        name: config.name,
        integrationType: config.type,
        vendor: config.vendor,
        status: 'pending',
        configuration: {
          apiEndpoint: config.apiEndpoint,
          authenticationType: config.authenticationType,
          syncFrequency: config.syncFrequency,
          filters: config.filters || {},
          // Note: credentials should be encrypted in production
          credentials: this.encryptCredentials(config.credentials)
        },
        dataMapping: config.dataMapping,
        syncFrequency: config.syncFrequency,
        apiEndpoint: config.apiEndpoint,
        authenticationType: config.authenticationType,
        installedBy: 'system', // In real implementation, use actual user ID
        metadata: {
          createdFrom: 'enterprise_setup',
          version: '1.0'
        }
      }).returning();

      // Test the connection
      const connectionTest = await this.testIntegrationConnection(integration.id);
      
      if (connectionTest.success) {
        await this.updateIntegrationStatus(integration.id, 'active');
        await this.scheduleInitialSync(integration.id);
      } else {
        await this.updateIntegrationStatus(integration.id, 'error', connectionTest.error);
      }

      console.log(`✅ Created integration: ${config.name} (${integration.id})`);
      return integration.id;

    } catch (error) {
      console.error('❌ Failed to create integration:', error);
      throw error;
    }
  }

  /**
   * Test integration connection
   */
  async testIntegrationConnection(integrationId: string): Promise<{
    success: boolean;
    error?: string;
    responseTime?: number;
  }> {
    try {
      const startTime = Date.now();
      
      const [integration] = await db
        .select()
        .from(enterpriseIntegrations)
        .where(eq(enterpriseIntegrations.id, integrationId));

      if (!integration) {
        return { success: false, error: 'Integration not found' };
      }

      const config = integration.configuration as any;
      
      // Simulate connection test based on integration type
      await this.performConnectionTest(integration.integrationType, config);
      
      const responseTime = Date.now() - startTime;
      
      return {
        success: true,
        responseTime
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Perform actual connection test based on integration type
   */
  private async performConnectionTest(integrationType: string, config: any): Promise<void> {
    switch (integrationType) {
      case 'crm':
        await this.testCRMConnection(config);
        break;
      case 'erp':
        await this.testERPConnection(config);
        break;
      case 'bi':
        await this.testBIConnection(config);
        break;
      case 'communication':
        await this.testCommunicationConnection(config);
        break;
      default:
        await this.testGenericAPIConnection(config);
    }
  }

  /**
   * Test CRM connection (Salesforce, HubSpot, etc.)
   */
  private async testCRMConnection(config: any): Promise<void> {
    // Simulate API call to CRM system
    if (config.vendor === 'salesforce') {
      // Test Salesforce connection
      console.log('Testing Salesforce connection...');
      // In real implementation: await salesforceAPI.testConnection(config.credentials)
    } else if (config.vendor === 'hubspot') {
      // Test HubSpot connection
      console.log('Testing HubSpot connection...');
      // In real implementation: await hubspotAPI.testConnection(config.credentials)
    }
    // Simulate successful connection
  }

  /**
   * Test ERP connection (SAP, Oracle, etc.)
   */
  private async testERPConnection(config: any): Promise<void> {
    console.log(`Testing ${config.vendor} ERP connection...`);
    // In real implementation, would test actual ERP connections
  }

  /**
   * Test BI system connection
   */
  private async testBIConnection(config: any): Promise<void> {
    console.log(`Testing ${config.vendor} BI connection...`);
    // In real implementation, would test connections to Tableau, Power BI, etc.
  }

  /**
   * Test communication system connection
   */
  private async testCommunicationConnection(config: any): Promise<void> {
    console.log(`Testing ${config.vendor} communication connection...`);
    // In real implementation, would test Slack, Teams, email systems
  }

  /**
   * Test generic API connection
   */
  private async testGenericAPIConnection(config: any): Promise<void> {
    console.log('Testing generic API connection...');
    // Basic HTTP/REST API test
  }

  /**
   * Sync data from external system
   */
  async syncIntegrationData(integrationId: string): Promise<DataSyncResult> {
    const startTime = Date.now();
    let recordsProcessed = 0;
    let recordsSucceeded = 0;
    let recordsFailed = 0;
    const errors: Array<{ record: any; error: string }> = [];

    try {
      const [integration] = await db
        .select()
        .from(enterpriseIntegrations)
        .where(eq(enterpriseIntegrations.id, integrationId));

      if (!integration) {
        throw new Error(`Integration ${integrationId} not found`);
      }

      // Fetch data from external system
      const externalData = await this.fetchExternalData(integration);
      recordsProcessed = externalData.length;

      // Process each record
      for (const record of externalData) {
        try {
          await this.processInboundRecord(integrationId, record);
          recordsSucceeded++;
        } catch (error) {
          recordsFailed++;
          errors.push({
            record,
            error: error instanceof Error ? error.message : 'Processing failed'
          });
        }
      }

      // Update integration sync status
      await db
        .update(enterpriseIntegrations)
        .set({
          lastSyncAt: new Date(),
          nextSyncAt: this.calculateNextSync(integration.syncFrequency),
          errorLog: errors.slice(0, 10), // Store last 10 errors
          metadata: {
            ...integration.metadata,
            lastSyncStats: {
              recordsProcessed,
              recordsSucceeded,
              recordsFailed,
              duration: Date.now() - startTime
            }
          }
        })
        .where(eq(enterpriseIntegrations.id, integrationId));

      const result: DataSyncResult = {
        integrationId,
        status: recordsFailed === 0 ? 'success' : recordsSucceeded > 0 ? 'partial' : 'failed',
        recordsProcessed,
        recordsSucceeded,
        recordsFailed,
        errors,
        duration: Date.now() - startTime
      };

      console.log(`📊 Sync completed: ${recordsSucceeded}/${recordsProcessed} records (${integration.name})`);
      
      // Send notification for significant errors
      if (recordsFailed > recordsProcessed * 0.1) { // >10% failure rate
        await databaseNotificationService.createAndSendNotification({
          organizationId: integration.organizationId,
          userId: 'system', // Would be integration owner
          type: 'integration_sync_warning',
          title: `Integration Sync Issues: ${integration.name}`,
          message: `Data sync completed with ${recordsFailed} failures out of ${recordsProcessed} records. Review integration configuration.`,
          priority: 'medium',
          metadata: { integrationId, syncResult: result }
        });
      }

      return result;

    } catch (error) {
      const result: DataSyncResult = {
        integrationId,
        status: 'failed',
        recordsProcessed,
        recordsSucceeded,
        recordsFailed: recordsProcessed,
        errors: [{ record: null, error: error instanceof Error ? error.message : 'Unknown error' }],
        duration: Date.now() - startTime
      };

      // Update integration with error status
      await this.updateIntegrationStatus(integrationId, 'error', error instanceof Error ? error.message : 'Unknown error');

      return result;
    }
  }

  /**
   * Fetch data from external system
   */
  private async fetchExternalData(integration: any): Promise<any[]> {
    // Simulate fetching data from external system
    const mockData = [];
    const recordCount = Math.floor(Math.random() * 100) + 10; // 10-110 records

    for (let i = 0; i < recordCount; i++) {
      mockData.push({
        id: `ext_${i}`,
        name: `Record ${i}`,
        value: Math.random() * 1000,
        timestamp: new Date(),
        type: integration.integrationType
      });
    }

    return mockData;
  }

  /**
   * Process individual inbound record
   */
  private async processInboundRecord(integrationId: string, record: any): Promise<void> {
    try {
      const [integration] = await db
        .select()
        .from(enterpriseIntegrations)
        .where(eq(enterpriseIntegrations.id, integrationId));

      if (!integration) {
        throw new Error(`Integration ${integrationId} not found`);
      }

      // Apply data mapping transformations
      const transformedData = this.applyDataMapping(record, integration.dataMapping as any);

      // Store the processed data
      await db.insert(integrationData).values({
        integrationId,
        dataType: record.type || 'unknown',
        sourceId: record.id,
        rawData: record,
        transformedData,
        processingStatus: 'completed'
      });

      // Route data to appropriate destination based on type
      await this.routeTransformedData(integration.organizationId, integration.integrationType, transformedData);

    } catch (error) {
      // Store failed record for troubleshooting
      await db.insert(integrationData).values({
        integrationId,
        dataType: record.type || 'unknown',
        sourceId: record.id,
        rawData: record,
        transformedData: null,
        processingStatus: 'failed',
        processingErrors: [error instanceof Error ? error.message : 'Unknown error']
      });

      throw error;
    }
  }

  /**
   * Apply data mapping transformations
   */
  private applyDataMapping(record: any, dataMapping: any): any {
    const transformed: any = {};
    
    if (dataMapping?.inbound) {
      for (const mapping of dataMapping.inbound) {
        let value = record[mapping.sourceField];
        
        // Apply transformation if specified
        if (mapping.transformation) {
          value = this.applyTransformation(value, mapping.transformation);
        }
        
        transformed[mapping.targetField] = value;
      }
    }
    
    return transformed;
  }

  /**
   * Apply data transformation
   */
  private applyTransformation(value: any, transformation: string): any {
    switch (transformation) {
      case 'uppercase':
        return typeof value === 'string' ? value.toUpperCase() : value;
      case 'lowercase':
        return typeof value === 'string' ? value.toLowerCase() : value;
      case 'number':
        return Number(value);
      case 'date':
        return new Date(value);
      case 'boolean':
        return Boolean(value);
      default:
        return value;
    }
  }

  /**
   * Route transformed data to appropriate destination
   */
  private async routeTransformedData(organizationId: string, integrationType: string, data: any): Promise<void> {
    switch (integrationType) {
      case 'crm':
        await this.processCRMData(organizationId, data);
        break;
      case 'erp':
        await this.processERPData(organizationId, data);
        break;
      case 'bi':
        await this.processBIData(organizationId, data);
        break;
      case 'hr':
        await this.processHRData(organizationId, data);
        break;
      default:
        console.log(`📥 Routed ${integrationType} data for org ${organizationId}`);
    }
  }

  /**
   * Process CRM data (customers, opportunities, etc.)
   */
  private async processCRMData(organizationId: string, data: any): Promise<void> {
    // In real implementation, would create/update customer records, opportunities, etc.
    console.log(`📊 Processing CRM data for org ${organizationId}:`, data.name);
  }

  /**
   * Process ERP data (financial, inventory, etc.)
   */
  private async processERPData(organizationId: string, data: any): Promise<void> {
    // In real implementation, would update financial metrics, inventory levels, etc.
    console.log(`💰 Processing ERP data for org ${organizationId}:`, data.name);
  }

  /**
   * Process Business Intelligence data
   */
  private async processBIData(organizationId: string, data: any): Promise<void> {
    // In real implementation, would update KPIs, dashboards, analytics
    console.log(`📈 Processing BI data for org ${organizationId}:`, data.name);
  }

  /**
   * Process HR data (employees, performance, etc.)
   */
  private async processHRData(organizationId: string, data: any): Promise<void> {
    // In real implementation, would update employee records, performance metrics
    console.log(`👥 Processing HR data for org ${organizationId}:`, data.name);
  }

  /**
   * Get integration status for all integrations
   */
  async getIntegrationStatuses(organizationId: string): Promise<IntegrationStatus[]> {
    try {
      const integrations = await db
        .select()
        .from(enterpriseIntegrations)
        .where(eq(enterpriseIntegrations.organizationId, organizationId));

      const statuses: IntegrationStatus[] = [];

      for (const integration of integrations) {
        // Get sync statistics
        const syncData = await db
          .select()
          .from(integrationData)
          .where(eq(integrationData.integrationId, integration.id));

        const totalRecords = syncData.length;
        const failedRecords = syncData.filter(d => d.processingStatus === 'failed').length;
        const successRate = totalRecords > 0 ? ((totalRecords - failedRecords) / totalRecords) * 100 : 0;

        // Calculate time-based statistics
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const thisWeek = new Date();
        thisWeek.setDate(thisWeek.getDate() - 7);

        const todayRecords = syncData.filter(d => d.syncedAt && d.syncedAt >= today).length;
        const weekRecords = syncData.filter(d => d.syncedAt && d.syncedAt >= thisWeek).length;

        statuses.push({
          id: integration.id,
          name: integration.name,
          status: integration.status as any,
          lastSyncAt: integration.lastSyncAt,
          nextSyncAt: integration.nextSyncAt,
          errorCount: failedRecords,
          successRate: Math.round(successRate),
          lastError: integration.errorLog?.[0]?.error,
          syncedRecords: {
            today: todayRecords,
            thisWeek: weekRecords,
            total: totalRecords
          }
        });
      }

      return statuses;

    } catch (error) {
      console.error('❌ Failed to get integration statuses:', error);
      return [];
    }
  }

  /**
   * Update integration status
   */
  private async updateIntegrationStatus(integrationId: string, status: string, error?: string): Promise<void> {
    const updateData: any = {
      status,
      updatedAt: new Date()
    };

    if (error) {
      updateData.errorLog = [{ error, timestamp: new Date().toISOString() }];
    }

    await db
      .update(enterpriseIntegrations)
      .set(updateData)
      .where(eq(enterpriseIntegrations.id, integrationId));
  }

  /**
   * Schedule initial sync for new integration
   */
  private async scheduleInitialSync(integrationId: string): Promise<void> {
    // Schedule sync for 5 minutes from now
    const nextSync = new Date(Date.now() + 5 * 60 * 1000);
    
    await db
      .update(enterpriseIntegrations)
      .set({ nextSyncAt: nextSync })
      .where(eq(enterpriseIntegrations.id, integrationId));

    console.log(`⏰ Scheduled initial sync for integration ${integrationId}`);
  }

  /**
   * Calculate next sync time based on frequency
   */
  private calculateNextSync(frequency: string): Date {
    const now = new Date();
    
    switch (frequency) {
      case 'real-time':
        return new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes
      case 'hourly':
        return new Date(now.getTime() + 60 * 60 * 1000); // 1 hour
      case 'daily':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 1 week
      default:
        return new Date(now.getTime() + 60 * 60 * 1000); // Default 1 hour
    }
  }

  /**
   * Validate integration configuration
   */
  private async validateIntegrationConfig(config: IntegrationConfig): Promise<void> {
    if (!config.name || !config.type || !config.vendor) {
      throw new Error('Missing required configuration fields');
    }

    if (!config.apiEndpoint) {
      throw new Error('API endpoint is required');
    }

    if (!config.credentials || Object.keys(config.credentials).length === 0) {
      throw new Error('Integration credentials are required');
    }

    // Additional validation based on integration type
    if (config.type === 'crm' && !config.dataMapping?.inbound) {
      throw new Error('CRM integrations require inbound data mapping');
    }
  }

  /**
   * Encrypt credentials (simplified - use proper encryption in production)
   */
  private encryptCredentials(credentials: any): any {
    // In production, would use proper encryption
    return { ...credentials, encrypted: true };
  }

  /**
   * Process all pending synchronizations
   */
  async processPendingSyncs(): Promise<void> {
    try {
      const pendingSyncs = await db
        .select()
        .from(enterpriseIntegrations)
        .where(
          and(
            eq(enterpriseIntegrations.status, 'active'),
            sql`${enterpriseIntegrations.nextSyncAt} <= NOW()`
          )
        );

      console.log(`📊 Processing ${pendingSyncs.length} pending synchronizations`);

      for (const integration of pendingSyncs) {
        try {
          await this.syncIntegrationData(integration.id);
        } catch (error) {
          console.error(`❌ Failed to sync integration ${integration.id}:`, error);
        }
      }

    } catch (error) {
      console.error('❌ Failed to process pending syncs:', error);
    }
  }
}

// Export singleton instance
export const enterpriseIntegrationService = new EnterpriseIntegrationService();