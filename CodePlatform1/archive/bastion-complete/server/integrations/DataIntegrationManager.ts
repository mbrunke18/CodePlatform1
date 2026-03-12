/**
 * Executive Data Integration Manager
 * Handles real-time data feeds from external sources for trigger monitoring
 */

interface DataSource {
  id: string;
  name: string;
  type: 'api' | 'webhook' | 'database' | 'file';
  endpoint?: string;
  refreshRate: number; // seconds
  lastUpdate: Date;
  status: 'connected' | 'disconnected' | 'error';
  metadata: Record<string, any>;
}

interface TriggerDataMapping {
  scenarioId: string;
  metric: string;
  dataSource: string;
  extraction: {
    path: string; // JSON path or SQL query
    transformation?: string; // optional data transformation
  };
}

export class DataIntegrationManager {
  private dataSources: Map<string, DataSource> = new Map();
  private triggerMappings: Map<string, TriggerDataMapping[]> = new Map();
  private activeConnections: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Register external data sources for real-time monitoring
   */
  registerDataSource(source: DataSource): void {
    this.dataSources.set(source.id, source);
    this.startDataPolling(source);
    console.log(`✅ Data source registered: ${source.name}`);
  }

  /**
   * Map scenario triggers to real data sources
   */
  mapTriggerToDataSource(mapping: TriggerDataMapping): void {
    const scenarioMappings = this.triggerMappings.get(mapping.scenarioId) || [];
    scenarioMappings.push(mapping);
    this.triggerMappings.set(mapping.scenarioId, scenarioMappings);
    console.log(`🔗 Trigger mapped: ${mapping.metric} → ${mapping.dataSource}`);
  }

  /**
   * Start real-time data polling for a source
   */
  private startDataPolling(source: DataSource): void {
    if (this.activeConnections.has(source.id)) {
      clearInterval(this.activeConnections.get(source.id));
    }

    const interval = setInterval(async () => {
      try {
        await this.fetchAndProcessData(source);
      } catch (error) {
        console.error(`❌ Data polling error for ${source.name}:`, error);
        this.updateSourceStatus(source.id, 'error');
      }
    }, source.refreshRate * 1000);

    this.activeConnections.set(source.id, interval);
  }

  /**
   * Fetch and process data from external source
   */
  private async fetchAndProcessData(source: DataSource): Promise<void> {
    switch (source.type) {
      case 'api':
        await this.fetchApiData(source);
        break;
      case 'webhook':
        // Webhook data is received passively
        break;
      case 'database':
        await this.fetchDatabaseData(source);
        break;
      case 'file':
        await this.fetchFileData(source);
        break;
    }
    
    source.lastUpdate = new Date();
    this.updateSourceStatus(source.id, 'connected');
  }

  /**
   * Fetch data from REST API
   */
  private async fetchApiData(source: DataSource): Promise<void> {
    if (!source.endpoint) return;

    const response = await fetch(source.endpoint, {
      method: 'GET',
      headers: {
        'User-Agent': 'Bastion-DataIntegration/1.0',
        ...(source.metadata.headers || {})
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    await this.processDataForTriggers(source.id, data);
  }

  /**
   * Fetch data from database connection
   */
  private async fetchDatabaseData(source: DataSource): Promise<void> {
    // Database connection logic would go here
    // This would connect to external databases for data extraction
    console.log(`📊 Fetching database data from ${source.name}`);
  }

  /**
   * Fetch data from file sources (CSV, JSON, XML)
   */
  private async fetchFileData(source: DataSource): Promise<void> {
    // File processing logic would go here
    console.log(`📁 Processing file data from ${source.name}`);
  }

  /**
   * Process fetched data against trigger conditions
   */
  private async processDataForTriggers(sourceId: string, data: any): Promise<void> {
    // Find all trigger mappings for this data source
    for (const [scenarioId, mappings] of this.triggerMappings) {
      for (const mapping of mappings) {
        if (mapping.dataSource === sourceId) {
          const value = this.extractValue(data, mapping.extraction.path);
          
          if (value !== null && value !== undefined) {
            await this.evaluateTriggerCondition(scenarioId, mapping.metric, value);
          }
        }
      }
    }
  }

  /**
   * Extract value from data using JSONPath or similar
   */
  private extractValue(data: any, path: string): any {
    // Simple dot notation extraction (can be enhanced with JSONPath library)
    try {
      return path.split('.').reduce((obj, key) => obj?.[key], data);
    } catch {
      return null;
    }
  }

  /**
   * Evaluate if trigger condition is met
   */
  private async evaluateTriggerCondition(scenarioId: string, metric: string, value: any): Promise<void> {
    // This would integrate with the scenario trigger evaluation system
    console.log(`🎯 Evaluating trigger: ${scenarioId}/${metric} = ${value}`);
    
    // Here you would:
    // 1. Get the scenario's trigger conditions
    // 2. Compare the current value against thresholds
    // 3. Trigger scenario activation if conditions are met
  }

  /**
   * Update data source connection status
   */
  private updateSourceStatus(sourceId: string, status: DataSource['status']): void {
    const source = this.dataSources.get(sourceId);
    if (source) {
      source.status = status;
      console.log(`📡 ${source.name} status: ${status}`);
    }
  }

  /**
   * Get all registered data sources
   */
  getDataSources(): DataSource[] {
    return Array.from(this.dataSources.values());
  }

  /**
   * Stop data polling for a source
   */
  stopDataPolling(sourceId: string): void {
    const interval = this.activeConnections.get(sourceId);
    if (interval) {
      clearInterval(interval);
      this.activeConnections.delete(sourceId);
      console.log(`⏹️ Stopped polling for ${sourceId}`);
    }
  }

  /**
   * Shutdown all data integrations
   */
  shutdown(): void {
    for (const [sourceId] of this.activeConnections) {
      this.stopDataPolling(sourceId);
    }
    console.log('🔌 Data Integration Manager shutdown complete');
  }
}

// Export singleton instance
export const dataIntegrationManager = new DataIntegrationManager();

// Example pre-configured data sources for common business systems
export const COMMON_DATA_SOURCES = {
  SALESFORCE: {
    id: 'salesforce-api',
    name: 'Salesforce CRM',
    type: 'api' as const,
    endpoint: process.env.SALESFORCE_API_ENDPOINT,
    refreshRate: 300, // 5 minutes
    lastUpdate: new Date(),
    status: 'disconnected' as const,
    metadata: {
      headers: {
        'Authorization': `Bearer ${process.env.SALESFORCE_API_TOKEN}`
      }
    }
  },
  
  FINANCIAL_SYSTEM: {
    id: 'financial-api',
    name: 'Financial Management System',
    type: 'api' as const,
    endpoint: process.env.FINANCIAL_API_ENDPOINT,
    refreshRate: 600, // 10 minutes
    lastUpdate: new Date(),
    status: 'disconnected' as const,
    metadata: {
      headers: {
        'Authorization': `Bearer ${process.env.FINANCIAL_API_TOKEN}`
      }
    }
  },

  SUPPLY_CHAIN: {
    id: 'supply-chain-api',
    name: 'Supply Chain Management',
    type: 'api' as const,
    endpoint: process.env.SUPPLY_CHAIN_API_ENDPOINT,
    refreshRate: 180, // 3 minutes
    lastUpdate: new Date(),
    status: 'disconnected' as const,
    metadata: {
      headers: {
        'Authorization': `Bearer ${process.env.SUPPLY_CHAIN_API_TOKEN}`
      }
    }
  },

  SECURITY_MONITORING: {
    id: 'security-siem',
    name: 'Security Information & Event Management',
    type: 'api' as const,
    endpoint: process.env.SIEM_API_ENDPOINT,
    refreshRate: 60, // 1 minute
    lastUpdate: new Date(),
    status: 'disconnected' as const,
    metadata: {
      headers: {
        'Authorization': `Bearer ${process.env.SIEM_API_TOKEN}`
      }
    }
  }
};