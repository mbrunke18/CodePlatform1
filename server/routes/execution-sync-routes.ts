import type { Express } from "express";
import { db } from "../db";
import { storage } from "../storage";
import {
  organizations,
  users,
  playbookLibrary,
  playbookActivations,
} from "@shared/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { requireAuth, requireOrgAccess, getUserId, getOrgIdForUser } from "./helpers";

export async function registerExecutionSyncRoutes(app: Express): Promise<void> {
// EXECUTION PLAN SYNC & INTEGRATION API
// ============================================================================
console.log('📡 Registering Execution Plan Sync API endpoints...');

// --- Export Templates ---
app.get('/api/sync/templates', requireOrgAccess, async (req: any, res) => {
  try {
    const { organizationId } = req.query;
    const templates = await storage.getExportTemplates(organizationId as string);
    res.json(templates);
  } catch (error) {
    console.error('Failed to get export templates:', error);
    res.status(500).json({ error: 'Failed to get export templates' });
  }
});

app.get('/api/sync/templates/:id', requireOrgAccess, async (req: any, res) => {
  try {
    const template = await storage.getExportTemplate(req.params.id);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.json(template);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get template' });
  }
});

app.post('/api/sync/templates', requireOrgAccess, async (req: any, res) => {
  try {
    const template = await storage.createExportTemplate({
      ...req.body,
      createdBy: req.userId,
    });
    res.status(201).json(template);
  } catch (error) {
    console.error('Failed to create export template:', error);
    res.status(500).json({ error: 'Failed to create export template' });
  }
});

app.patch('/api/sync/templates/:id', requireOrgAccess, async (req: any, res) => {
  try {
    const template = await storage.updateExportTemplate(req.params.id, req.body);
    res.json(template);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update template' });
  }
});

app.delete('/api/sync/templates/:id', requireOrgAccess, async (req: any, res) => {
  try {
    await storage.deleteExportTemplate(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete template' });
  }
});

// --- Sync Records ---
app.get('/api/sync/records', requireOrgAccess, async (req: any, res) => {
  try {
    const { executionInstanceId } = req.query;
    const records = await storage.getSyncRecords(executionInstanceId as string);
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get sync records' });
  }
});

app.get('/api/sync/records/:id', requireOrgAccess, async (req: any, res) => {
  try {
    const record = await storage.getSyncRecord(req.params.id);
    if (!record) {
      return res.status(404).json({ error: 'Sync record not found' });
    }
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get sync record' });
  }
});

// Export execution plan to external platform
app.post('/api/sync/export', requireOrgAccess, async (req: any, res) => {
  try {
    const { executionInstanceId, templateId, integrationId } = req.body;
    
    if (!executionInstanceId || !templateId || !integrationId) {
      return res.status(400).json({ 
        error: 'Missing required fields: executionInstanceId, templateId, integrationId' 
      });
    }
    
    const { executionPlanSyncService } = await import('../services/ExecutionPlanSyncService');
    const result = await executionPlanSyncService.exportExecutionPlan(
      executionInstanceId,
      templateId,
      integrationId
    );
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Export failed:', error);
    res.status(500).json({ 
      error: 'Failed to export execution plan',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Trigger sync for a sync record
app.post('/api/sync/records/:id/sync', requireOrgAccess, async (req: any, res) => {
  try {
    const { direction = 'pull' } = req.body;
    
    const { executionPlanSyncService } = await import('../services/ExecutionPlanSyncService');
    const result = await executionPlanSyncService.syncTaskStatus(
      req.params.id,
      direction
    );
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to sync tasks' });
  }
});

// Delete sync record
app.delete('/api/sync/records/:id', requireOrgAccess, async (req: any, res) => {
  try {
    await storage.deleteSyncRecord(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete sync record' });
  }
});

// Start a new sync operation
app.post('/api/sync/start', requireOrgAccess, async (req: any, res) => {
  try {
    const { integrationId, platform, executionInstanceId, organizationId } = req.body;
    
    if (!integrationId || !platform) {
      return res.status(400).json({ error: 'integrationId and platform are required' });
    }
    
    // Create sync record using the existing storage method
    const syncRecord = await storage.createSyncRecord({
      executionInstanceId,
      integrationId,
      syncStatus: 'pending',
      externalProjectId: null,
      externalProjectUrl: null,
      externalProjectKey: platform,
      exportTemplateId: null,
      taskSyncMap: {},
      syncSettings: { platform, organizationId: organizationId || req.userId },
    });
    
    res.status(201).json({
      success: true,
      syncRecord,
      message: `Sync initiated with ${platform}`
    });
  } catch (error) {
    console.error('Failed to start sync:', error);
    res.status(500).json({ 
      error: 'Failed to start sync',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// --- Document Templates ---
app.get('/api/documents/templates', requireOrgAccess, async (req: any, res) => {
  try {
    const { organizationId, playbookId } = req.query;
    const templates = await storage.getDocumentTemplates(
      organizationId as string,
      playbookId as string
    );
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get document templates' });
  }
});

app.get('/api/documents/templates/:id', requireOrgAccess, async (req: any, res) => {
  try {
    const template = await storage.getDocumentTemplate(req.params.id);
    if (!template) {
      return res.status(404).json({ error: 'Document template not found' });
    }
    res.json(template);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get document template' });
  }
});

app.post('/api/documents/templates', requireOrgAccess, async (req: any, res) => {
  try {
    const template = await storage.createDocumentTemplate({
      ...req.body,
      createdBy: req.userId,
    });
    res.status(201).json(template);
  } catch (error) {
    console.error('Failed to create document template:', error);
    res.status(500).json({ error: 'Failed to create document template' });
  }
});

app.patch('/api/documents/templates/:id', requireOrgAccess, async (req: any, res) => {
  try {
    const template = await storage.updateDocumentTemplate(req.params.id, req.body);
    res.json(template);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update document template' });
  }
});

app.delete('/api/documents/templates/:id', requireOrgAccess, async (req: any, res) => {
  try {
    await storage.deleteDocumentTemplate(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete document template' });
  }
});

// --- Generated Documents ---
app.get('/api/documents/generated', requireOrgAccess, async (req: any, res) => {
  try {
    const { executionInstanceId, templateId } = req.query;
    const documents = await storage.getGeneratedDocuments(
      executionInstanceId as string,
      templateId as string
    );
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get generated documents' });
  }
});

app.get('/api/documents/generated/:id', requireOrgAccess, async (req: any, res) => {
  try {
    const document = await storage.getGeneratedDocument(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get document' });
  }
});

app.post('/api/documents/generate', requireOrgAccess, async (req: any, res) => {
  try {
    const { templateId, executionInstanceId, variables } = req.body;
    
    const template = await storage.getDocumentTemplate(templateId);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    let generatedContent = template.template_content || '';
    const variablesUsed = variables || {};
    
    for (const [key, value] of Object.entries(variablesUsed)) {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      generatedContent = generatedContent.replace(regex, String(value));
    }
    
    const document = await storage.createGeneratedDocument({
      templateId,
      executionInstanceId,
      name: `${template.name} - ${new Date().toISOString()}`,
      documentType: template.document_type,
      generatedContent,
      variablesUsed,
      fileFormat: 'html',
      generatedBy: req.userId,
    });
    
    res.status(201).json(document);
  } catch (error) {
    console.error('Failed to generate document:', error);
    res.status(500).json({ error: 'Failed to generate document' });
  }
});

app.post('/api/documents/generated/:id/approve', requireOrgAccess, async (req: any, res) => {
  try {
    const document = await storage.approveGeneratedDocument(req.params.id, req.userId);
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve document' });
  }
});

app.post('/api/documents/generated/:id/reject', requireOrgAccess, async (req: any, res) => {
  try {
    const { reason } = req.body;
    const document = await storage.rejectGeneratedDocument(req.params.id, reason);
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject document' });
  }
});

// --- Pre-Approved Resources ---
app.get('/api/resources/pre-approved', requireOrgAccess, async (req: any, res) => {
  try {
    const { organizationId, playbookId } = req.query;
    const resources = await storage.getPreApprovedResources(
      organizationId as string,
      playbookId as string
    );
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get pre-approved resources' });
  }
});

app.get('/api/resources/pre-approved/:id', requireOrgAccess, async (req: any, res) => {
  try {
    const resource = await storage.getPreApprovedResource(req.params.id);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get resource' });
  }
});

app.post('/api/resources/pre-approved', requireOrgAccess, async (req: any, res) => {
  try {
    const resource = await storage.createPreApprovedResource(req.body);
    res.status(201).json(resource);
  } catch (error) {
    console.error('Failed to create pre-approved resource:', error);
    res.status(500).json({ error: 'Failed to create pre-approved resource' });
  }
});

app.patch('/api/resources/pre-approved/:id', requireOrgAccess, async (req: any, res) => {
  try {
    const resource = await storage.updatePreApprovedResource(req.params.id, req.body);
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update resource' });
  }
});

app.delete('/api/resources/pre-approved/:id', requireOrgAccess, async (req: any, res) => {
  try {
    await storage.deletePreApprovedResource(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete resource' });
  }
});

app.post('/api/resources/pre-approved/:id/activate', requireOrgAccess, async (req: any, res) => {
  try {
    const resource = await storage.activatePreApprovedResource(req.params.id);
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: 'Failed to activate resource' });
  }
});

// --- Enterprise Integrations ---
app.get('/api/enterprise-integrations', requireOrgAccess, async (req: any, res) => {
  try {
    const { organizationId } = req.query;
    const integrations = await storage.getEnterpriseIntegrations(organizationId as string);
    res.json(integrations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get integrations' });
  }
});

app.get('/api/enterprise-integrations/:id', requireOrgAccess, async (req: any, res) => {
  try {
    const integration = await storage.getEnterpriseIntegration(req.params.id);
    if (!integration) {
      return res.status(404).json({ error: 'Integration not found' });
    }
    res.json(integration);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get integration' });
  }
});

app.post('/api/enterprise-integrations', requireOrgAccess, async (req: any, res) => {
  try {
    const integration = await storage.createEnterpriseIntegration({
      ...req.body,
      installedBy: req.userId,
    });
    res.status(201).json(integration);
  } catch (error) {
    console.error('Failed to create integration:', error);
    res.status(500).json({ error: 'Failed to create integration' });
  }
});

app.patch('/api/enterprise-integrations/:id', requireOrgAccess, async (req: any, res) => {
  try {
    const integration = await storage.updateEnterpriseIntegration(req.params.id, req.body);
    res.json(integration);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update integration' });
  }
});

app.delete('/api/enterprise-integrations/:id', requireOrgAccess, async (req: any, res) => {
  try {
    await storage.deleteEnterpriseIntegration(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete integration' });
  }
});

// Test integration connection
app.post('/api/enterprise-integrations/:id/test', requireOrgAccess, async (req: any, res) => {
  try {
    const integration = await storage.getEnterpriseIntegration(req.params.id);
    if (!integration) {
      return res.status(404).json({ error: 'Integration not found' });
    }
    
    const { executionPlanSyncService } = await import('../services/ExecutionPlanSyncService');
    const adapter = executionPlanSyncService.getAdapter(integration.vendor as any);
    
    if (!adapter) {
      return res.json({ success: false, error: 'No adapter available for this platform' });
    }
    
    const credentials = integration.configuration || {};
    const isValid = await adapter.validateCredentials({
      accessToken: credentials.accessToken || credentials.access_token,
      apiKey: credentials.apiKey || credentials.api_key,
      cloudId: credentials.cloudId || credentials.cloud_id,
      apiUrl: credentials.apiUrl || credentials.api_url || integration.api_endpoint,
      workspaceId: credentials.workspaceId || credentials.workspace_id,
    });
    
    if (isValid) {
      await storage.updateEnterpriseIntegration(req.params.id, { status: 'active' });
    }
    
    res.json({ 
      success: isValid, 
      message: isValid ? 'Connection successful' : 'Connection failed - check credentials' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Connection test failed' 
    });
  }
});

// Get available sync platforms
app.get('/api/sync/platforms', requireOrgAccess, async (req: any, res) => {
  res.json([
    { id: 'jira', name: 'Jira', icon: 'jira', description: 'Atlassian Jira Software' },
    { id: 'asana', name: 'Asana', icon: 'asana', description: 'Asana Project Management' },
    { id: 'monday', name: 'Monday.com', icon: 'monday', description: 'Monday.com Work OS' },
    { id: 'ms_project', name: 'Microsoft Planner', icon: 'microsoft', description: 'Microsoft Planner / Project' },
    { id: 'servicenow', name: 'ServiceNow', icon: 'servicenow', description: 'ServiceNow Project Management' },
  ]);
});

// --- Document Template Engine ---
app.get('/api/documents/template-types', requireOrgAccess, async (req: any, res) => {
  try {
    const { documentTemplateEngine } = await import('../services/DocumentTemplateEngine');
    const templates = documentTemplateEngine.getAvailableTemplates();
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get template types' });
  }
});

app.get('/api/documents/template-types/:type/variables', requireOrgAccess, async (req: any, res) => {
  try {
    const { documentTemplateEngine } = await import('../services/DocumentTemplateEngine');
    const variables = documentTemplateEngine.getTemplateVariables(req.params.type as any);
    res.json(variables);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get template variables' });
  }
});

app.post('/api/documents/generate-from-type', requireOrgAccess, async (req: any, res) => {
  try {
    const { templateType, variables, executionInstanceId, scenarioId, organizationId } = req.body;
    
    const { documentTemplateEngine } = await import('../services/DocumentTemplateEngine');
    const document = await documentTemplateEngine.generateDocument(
      templateType,
      variables || {},
      { executionInstanceId, scenarioId, organizationId }
    );
    
    res.status(201).json(document);
  } catch (error) {
    console.error('Document generation failed:', error);
    res.status(500).json({ 
      error: 'Failed to generate document',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// --- File Export Service ---
app.get('/api/export/execution/:executionInstanceId', requireOrgAccess, async (req: any, res) => {
  try {
    const { format = 'csv' } = req.query;
    
    const { fileExportService } = await import('../services/FileExportService');
    const result = await fileExportService.exportExecutionPlan(
      req.params.executionInstanceId,
      format as any
    );
    
    if (!result.success) {
      return res.status(400).json({ error: 'Export failed' });
    }
    
    res.setHeader('Content-Type', result.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.send(result.content);
  } catch (error) {
    console.error('Export failed:', error);
    res.status(500).json({ 
      error: 'Failed to export execution plan',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

app.get('/api/export/formats', requireOrgAccess, async (req: any, res) => {
  res.json([
    { id: 'csv', name: 'CSV', description: 'Comma-separated values for Excel/Sheets', icon: 'file-spreadsheet' },
    { id: 'xlsx', name: 'Excel (XML)', description: 'SpreadsheetML format', icon: 'file-spreadsheet' },
    { id: 'json', name: 'JSON', description: 'Structured data format', icon: 'file-json' },
    { id: 'ms_project_xml', name: 'MS Project', description: 'Microsoft Project XML format', icon: 'file-chart' },
  ]);
});

console.log('✅ Execution Plan Sync API endpoints registered');

// --- Pre-Approved Resources API ---
// Manage pre-approved budgets, vendors, and resources

const { executionPreApprovedResources } = await import('@shared/schema');

// Get all pre-approved resources for organization
app.get('/api/pre-approved-resources', requireOrgAccess, async (req: any, res) => {
  try {
    const organizationId = req.query.organizationId || req.userId;
    
    const resources = await db.select()
      .from(executionPreApprovedResources)
      .where(eq(executionPreApprovedResources.organizationId, organizationId))
      .orderBy(desc(executionPreApprovedResources.createdAt));
    
    res.json(resources);
  } catch (error) {
    console.error('Failed to fetch pre-approved resources:', error);
    res.status(500).json({ 
      error: 'Failed to fetch pre-approved resources',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Create new pre-approved resource
app.post('/api/pre-approved-resources', requireOrgAccess, async (req: any, res) => {
  try {
    const resourceData = {
      ...req.body,
      organizationId: req.body.organizationId || req.userId,
      approvedBy: req.userId,
      approvedAt: new Date(),
    };
    
    const [resource] = await db.insert(executionPreApprovedResources)
      .values(resourceData)
      .returning();
    
    res.status(201).json(resource);
  } catch (error) {
    console.error('Failed to create pre-approved resource:', error);
    res.status(500).json({ 
      error: 'Failed to create pre-approved resource',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Get single pre-approved resource
app.get('/api/pre-approved-resources/:id', requireOrgAccess, async (req: any, res) => {
  try {
    const { id } = req.params;
    
    const [resource] = await db.select()
      .from(executionPreApprovedResources)
      .where(eq(executionPreApprovedResources.id, id));
    
    if (!resource) {
      return res.status(404).json({ error: 'Pre-approved resource not found' });
    }
    
    res.json(resource);
  } catch (error) {
    console.error('Failed to fetch pre-approved resource:', error);
    res.status(500).json({ 
      error: 'Failed to fetch pre-approved resource',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Update pre-approved resource
app.patch('/api/pre-approved-resources/:id', requireOrgAccess, async (req: any, res) => {
  try {
    const { id } = req.params;
    
    const [resource] = await db.update(executionPreApprovedResources)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(executionPreApprovedResources.id, id))
      .returning();
    
    if (!resource) {
      return res.status(404).json({ error: 'Pre-approved resource not found' });
    }
    
    res.json(resource);
  } catch (error) {
    console.error('Failed to update pre-approved resource:', error);
    res.status(500).json({ 
      error: 'Failed to update pre-approved resource',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Delete pre-approved resource
app.delete('/api/pre-approved-resources/:id', requireOrgAccess, async (req: any, res) => {
  try {
    const { id } = req.params;
    
    const [deleted] = await db.delete(executionPreApprovedResources)
      .where(eq(executionPreApprovedResources.id, id))
      .returning();
    
    if (!deleted) {
      return res.status(404).json({ error: 'Pre-approved resource not found' });
    }
    
    res.json({ success: true, deleted });
  } catch (error) {
    console.error('Failed to delete pre-approved resource:', error);
    res.status(500).json({ 
      error: 'Failed to delete pre-approved resource',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Activate a pre-approved resource (track usage)
app.post('/api/pre-approved-resources/:id/activate', requireOrgAccess, async (req: any, res) => {
  try {
    const { id } = req.params;
    
    const [resource] = await db.update(executionPreApprovedResources)
      .set({ 
        lastActivatedAt: new Date(),
        activationCount: sql`COALESCE(${executionPreApprovedResources.activationCount}, 0) + 1`,
        updatedAt: new Date()
      })
      .where(eq(executionPreApprovedResources.id, id))
      .returning();
    
    if (!resource) {
      return res.status(404).json({ error: 'Pre-approved resource not found' });
    }
    
    res.json(resource);
  } catch (error) {
    console.error('Failed to activate pre-approved resource:', error);
    res.status(500).json({ 
      error: 'Failed to activate pre-approved resource',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

console.log('✅ Pre-Approved Resources API endpoints registered');

// --- Execution Orchestration API ---
// One-click activation flow

// Get pre-flight check results
app.get('/api/execution/preflight/:executionPlanId', requireOrgAccess, async (req: any, res) => {
  try {
    const { executionPlanId } = req.params;
    const organizationId = req.query.organizationId || req.userId;

    const { preFlightCheckService } = await import('../services/PreFlightCheckService');
    const result = await preFlightCheckService.performCheck({
      executionPlanId,
      organizationId,
    });

    res.json(result);
  } catch (error) {
    console.error('Pre-flight check failed:', error);
    res.status(500).json({
      error: 'Pre-flight check failed',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// Activate playbook - one-click execution
app.post('/api/execution/activate', requireOrgAccess, async (req: any, res) => {
  try {
    const { 
      organizationId, 
      scenarioId, 
      executionPlanId, 
      playbookId,
      syncPlatform,
      skipPreflight 
    } = req.body;

    if (!organizationId || !executionPlanId || !playbookId) {
      return res.status(400).json({ 
        error: 'Missing required fields: organizationId, executionPlanId, playbookId' 
      });
    }

    const { executionOrchestrator } = await import('../services/ExecutionOrchestrator');
    const result = await executionOrchestrator.activate({
      organizationId,
      scenarioId,
      executionPlanId,
      playbookId,
      triggeredBy: req.userId,
      syncPlatform,
      skipPreflight,
    });

    res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    console.error('Activation failed:', error);
    res.status(500).json({
      success: false,
      error: 'Activation failed',
      details: error instanceof Error ? error.message : String(error),
      errors: [error instanceof Error ? error.message : String(error)],
      events: [],
      documentsGenerated: 0,
      stakeholdersNotified: 0,
    });
  }
});

// Get activation status
app.get('/api/execution/status/:executionInstanceId', requireOrgAccess, async (req: any, res) => {
  try {
    const { executionInstanceId } = req.params;

    const { executionOrchestrator } = await import('../services/ExecutionOrchestrator');
    const status = await executionOrchestrator.getActivationStatus(executionInstanceId);

    if (!status) {
      return res.status(404).json({ error: 'Execution instance not found' });
    }

    res.json(status);
  } catch (error) {
    console.error('Failed to get activation status:', error);
    res.status(500).json({
      error: 'Failed to get activation status',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// Stakeholder acknowledgment
app.post('/api/execution/acknowledge/:executionInstanceId', requireOrgAccess, async (req: any, res) => {
  try {
    const { executionInstanceId } = req.params;
    const userId = req.userId;

    const { stakeholderAcknowledgments } = await import('@shared/schema');
    
    // Update acknowledgment
    await db.update(stakeholderAcknowledgments)
      .set({ acknowledgedAt: new Date() })
      .where(
        sql`${stakeholderAcknowledgments.executionInstanceId} = ${executionInstanceId} 
            AND ${stakeholderAcknowledgments.userId} = ${userId}`
      );

    res.json({ success: true, acknowledgedAt: new Date() });
  } catch (error) {
    console.error('Acknowledgment failed:', error);
    res.status(500).json({
      error: 'Acknowledgment failed',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

console.log('✅ Execution Orchestration API endpoints registered');
}
