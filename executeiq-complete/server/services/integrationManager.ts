import { db } from "../db";
import { enterpriseIntegrations, integrationData } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";

// Encryption for sensitive credentials
// CRITICAL: This key must be stable across restarts or credentials become undecryptable
const ENCRYPTION_KEY = process.env.INTEGRATION_ENCRYPTION_KEY;
const ALGORITHM = 'aes-256-gcm';

if (!ENCRYPTION_KEY) {
  console.error('CRITICAL: INTEGRATION_ENCRYPTION_KEY environment variable is not set!');
  console.error('Integration credentials will NOT be encrypted. Set this before production use.');
  console.error('Generate a key with: openssl rand -hex 32');
}

interface IntegrationCredentials {
  type: 'oauth' | 'api_key' | 'service_account';
  data: Record<string, any>;
}

interface IntegrationConfig {
  organizationId: string;
  name: string;
  integrationType: string;
  vendor: string;
  credentials: IntegrationCredentials;
  configuration?: Record<string, any>;
}

export class IntegrationManager {
  
  /**
   * Encrypt sensitive credential data
   */
  private encryptCredentials(credentials: IntegrationCredentials): string {
    if (!ENCRYPTION_KEY) {
      throw new Error('Cannot encrypt credentials: INTEGRATION_ENCRYPTION_KEY not set');
    }
    
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex').slice(0, 32), iv);
    
    const encrypted = Buffer.concat([
      cipher.update(JSON.stringify(credentials), 'utf8'),
      cipher.final()
    ]);
    
    const authTag = cipher.getAuthTag();
    
    // Combine iv + authTag + encrypted data
    return Buffer.concat([iv, authTag, encrypted]).toString('base64');
  }
  
  /**
   * Decrypt credential data
   */
  private decryptCredentials(encryptedData: string): IntegrationCredentials {
    if (!ENCRYPTION_KEY) {
      throw new Error('Cannot decrypt credentials: INTEGRATION_ENCRYPTION_KEY not set');
    }
    
    const buffer = Buffer.from(encryptedData, 'base64');
    
    const iv = buffer.slice(0, 16);
    const authTag = buffer.slice(16, 32);
    const encrypted = buffer.slice(32);
    
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex').slice(0, 32), iv);
    decipher.setAuthTag(authTag);
    
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]);
    
    return JSON.parse(decrypted.toString('utf8'));
  }
  
  /**
   * Connect a new integration
   */
  async connectIntegration(config: IntegrationConfig) {
    try {
      // Encrypt credentials before storing
      const encryptedCreds = this.encryptCredentials(config.credentials);
      
      // Store in database
      const [integration] = await db.insert(enterpriseIntegrations).values({
        organizationId: config.organizationId,
        name: config.name,
        integrationType: config.integrationType,
        vendor: config.vendor,
        status: 'pending',
        configuration: {
          ...config.configuration,
          encryptedCredentials: encryptedCreds,
        },
        authenticationType: config.credentials.type,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      
      // Test connection
      const isHealthy = await this.testConnection(integration.id);
      
      // Update status based on test
      if (isHealthy) {
        await db.update(enterpriseIntegrations)
          .set({ 
            status: 'active',
            lastSyncAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(enterpriseIntegrations.id, integration.id));
      } else {
        await db.update(enterpriseIntegrations)
          .set({ 
            status: 'error',
            errorLog: { message: 'Connection test failed' },
            updatedAt: new Date(),
          })
          .where(eq(enterpriseIntegrations.id, integration.id));
      }
      
      return {
        ...integration,
        status: isHealthy ? 'active' : 'error',
      };
      
    } catch (error) {
      console.error('Failed to connect integration:', error);
      throw new Error(`Integration connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Disconnect an integration
   */
  async disconnectIntegration(integrationId: string) {
    try {
      await db.update(enterpriseIntegrations)
        .set({ 
          status: 'inactive',
          updatedAt: new Date(),
        })
        .where(eq(enterpriseIntegrations.id, integrationId));
      
      return { success: true };
    } catch (error) {
      console.error('Failed to disconnect integration:', error);
      throw new Error(`Failed to disconnect integration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Test if integration connection is working
   */
  async testConnection(integrationId: string): Promise<boolean> {
    try {
      const [integration] = await db.select()
        .from(enterpriseIntegrations)
        .where(eq(enterpriseIntegrations.id, integrationId))
        .limit(1);
      
      if (!integration) {
        return false;
      }
      
      // Get credentials
      const config = integration.configuration as Record<string, any> | null;
      const encryptedCreds = config?.encryptedCredentials as string;
      if (!encryptedCreds) {
        return false;
      }
      
      const credentials = this.decryptCredentials(encryptedCreds);
      
      // Test based on integration type
      switch (integration.vendor) {
        case 'jira':
          return await this.testJiraConnection(credentials);
        case 'google':
          return await this.testGoogleConnection(credentials);
        case 'slack':
          return await this.testSlackConnection(credentials);
        case 'hubspot':
          return await this.testHubSpotConnection(credentials);
        default:
          // For now, assume connection is valid
          return true;
      }
      
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
  
  /**
   * Test Jira connection
   */
  private async testJiraConnection(credentials: IntegrationCredentials): Promise<boolean> {
    try {
      // If using Replit Jira connector, credentials will have connection info
      if (credentials.type === 'oauth' && credentials.data.access_token) {
        // Test with a simple API call
        const response = await fetch(`${credentials.data.api_url}/rest/api/3/myself`, {
          headers: {
            'Authorization': `Bearer ${credentials.data.access_token}`,
            'Content-Type': 'application/json',
          },
        });
        
        return response.ok;
      }
      
      return false;
    } catch (error) {
      console.error('Jira connection test failed:', error);
      return false;
    }
  }
  
  /**
   * Test Google Calendar connection
   */
  private async testGoogleConnection(credentials: IntegrationCredentials): Promise<boolean> {
    try {
      if (credentials.type === 'oauth' && credentials.data.access_token) {
        const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
          headers: {
            'Authorization': `Bearer ${credentials.data.access_token}`,
          },
        });
        
        return response.ok;
      }
      
      return false;
    } catch (error) {
      console.error('Google connection test failed:', error);
      return false;
    }
  }
  
  /**
   * Test Slack connection
   */
  private async testSlackConnection(credentials: IntegrationCredentials): Promise<boolean> {
    try {
      if (credentials.type === 'oauth' && credentials.data.access_token) {
        const response = await fetch('https://slack.com/api/auth.test', {
          headers: {
            'Authorization': `Bearer ${credentials.data.access_token}`,
          },
        });
        
        const data = await response.json();
        return data.ok === true;
      }
      
      return false;
    } catch (error) {
      console.error('Slack connection test failed:', error);
      return false;
    }
  }
  
  /**
   * Test HubSpot connection
   */
  private async testHubSpotConnection(credentials: IntegrationCredentials): Promise<boolean> {
    try {
      if (credentials.type === 'oauth' && credentials.data.access_token) {
        const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts?limit=1', {
          headers: {
            'Authorization': `Bearer ${credentials.data.access_token}`,
          },
        });
        
        return response.ok;
      }
      
      return false;
    } catch (error) {
      console.error('HubSpot connection test failed:', error);
      return false;
    }
  }
  
  /**
   * Get all integrations for an organization
   */
  async getIntegrations(organizationId: string) {
    try {
      const integrations = await db.select({
        id: enterpriseIntegrations.id,
        name: enterpriseIntegrations.name,
        integrationType: enterpriseIntegrations.integrationType,
        vendor: enterpriseIntegrations.vendor,
        status: enterpriseIntegrations.status,
        lastSyncAt: enterpriseIntegrations.lastSyncAt,
        createdAt: enterpriseIntegrations.createdAt,
      })
        .from(enterpriseIntegrations)
        .where(eq(enterpriseIntegrations.organizationId, organizationId));
      
      return integrations;
    } catch (error) {
      console.error('Failed to get integrations:', error);
      throw new Error('Failed to retrieve integrations');
    }
  }
  
  /**
   * Get integration credentials (for internal use only)
   */
  async getCredentials(integrationId: string): Promise<IntegrationCredentials | null> {
    try {
      const [integration] = await db.select()
        .from(enterpriseIntegrations)
        .where(eq(enterpriseIntegrations.id, integrationId))
        .limit(1);
      
      const config = integration?.configuration as Record<string, any> | null;
      if (!integration || !config?.encryptedCredentials) {
        return null;
      }
      
      return this.decryptCredentials(config.encryptedCredentials as string);
    } catch (error) {
      console.error('Failed to get credentials:', error);
      return null;
    }
  }
  
  /**
   * Refresh OAuth token if needed
   */
  async refreshToken(integrationId: string): Promise<boolean> {
    try {
      const credentials = await this.getCredentials(integrationId);
      
      if (!credentials || credentials.type !== 'oauth') {
        return false;
      }
      
      const refreshToken = credentials.data.refresh_token;
      if (!refreshToken) {
        return false;
      }
      
      // Token refresh logic would go here
      // For now, return true if we have a refresh token
      return true;
      
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return false;
    }
  }
  
  /**
   * Get integration health status
   */
  async getIntegrationHealth(integrationId: string) {
    try {
      const [integration] = await db.select()
        .from(enterpriseIntegrations)
        .where(eq(enterpriseIntegrations.id, integrationId))
        .limit(1);
      
      if (!integration) {
        return { healthy: false, message: 'Integration not found' };
      }
      
      const isHealthy = await this.testConnection(integrationId);
      
      return {
        healthy: isHealthy,
        status: integration.status,
        lastSync: integration.lastSyncAt,
        message: isHealthy ? 'Connection active' : 'Connection failed',
      };
      
    } catch (error) {
      return {
        healthy: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Export singleton instance
export const integrationManager = new IntegrationManager();
