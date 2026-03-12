import type { Express } from "express";
import { storage } from "../storage";
import { requireOrgAccess } from "./helpers";

export function registerOrgSetupRoutes(app: Express): void {

  // --- Custom Triggers CRUD ---
  app.get('/api/config/triggers', requireOrgAccess, async (req: any, res) => {
    try {
      const organizationId = req.query.organizationId as string | undefined;
      const triggers = await storage.getCustomTriggers(organizationId);
      res.json(triggers);
    } catch (error) {
      console.error('Error fetching custom triggers:', error);
      res.status(500).json({ error: 'Failed to fetch triggers' });
    }
  });

  app.post('/api/config/triggers', requireOrgAccess, async (req: any, res) => {
    try {
      const trigger = await storage.createCustomTrigger(req.body);
      res.json({ success: true, trigger, message: 'Custom trigger created successfully' });
    } catch (error: any) {
      console.error('Error creating custom trigger:', error);
      res.status(400).json({ error: 'Failed to create trigger', details: error.message });
    }
  });

  app.patch('/api/config/triggers/:id', requireOrgAccess, async (req: any, res) => {
    try {
      const trigger = await storage.updateCustomTrigger(req.params.id, req.body);
      res.json({ success: true, trigger, message: 'Trigger updated successfully' });
    } catch (error: any) {
      console.error('Error updating trigger:', error);
      res.status(400).json({ error: 'Failed to update trigger', details: error.message });
    }
  });

  app.delete('/api/config/triggers/:id', requireOrgAccess, async (req: any, res) => {
    try {
      await storage.deleteCustomTrigger(req.params.id);
      res.json({ success: true, triggerId: req.params.id, message: 'Trigger deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting trigger:', error);
      res.status(400).json({ error: 'Failed to delete trigger', details: error.message });
    }
  });

  // --- Departments CRUD ---
  app.get('/api/config/departments', requireOrgAccess, async (req: any, res) => {
    try {
      const organizationId = req.query.organizationId as string | undefined;
      const departments = await storage.getDepartments(organizationId);
      res.json(departments);
    } catch (error) {
      console.error('Error fetching departments:', error);
      res.status(500).json({ error: 'Failed to fetch departments' });
    }
  });

  app.post('/api/config/departments', requireOrgAccess, async (req: any, res) => {
    try {
      const department = await storage.createDepartment(req.body);
      res.json({ success: true, department, message: 'Department created successfully' });
    } catch (error: any) {
      console.error('Error creating department:', error);
      res.status(400).json({ error: 'Failed to create department', details: error.message });
    }
  });

  app.patch('/api/config/departments/:id', requireOrgAccess, async (req: any, res) => {
    try {
      const department = await storage.updateDepartment(req.params.id, req.body);
      res.json({ success: true, department, message: 'Department updated successfully' });
    } catch (error: any) {
      console.error('Error updating department:', error);
      res.status(400).json({ error: 'Failed to update department', details: error.message });
    }
  });

  app.delete('/api/config/departments/:id', requireOrgAccess, async (req: any, res) => {
    try {
      await storage.deleteDepartment(req.params.id);
      res.json({ success: true, departmentId: req.params.id, message: 'Department deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting department:', error);
      res.status(400).json({ error: 'Failed to delete department', details: error.message });
    }
  });

  // --- Escalation Policies CRUD ---
  app.get('/api/config/escalation-policies', requireOrgAccess, async (req: any, res) => {
    try {
      const organizationId = req.query.organizationId as string | undefined;
      const policies = await storage.getEscalationPolicies(organizationId);
      res.json(policies);
    } catch (error) {
      console.error('Error fetching escalation policies:', error);
      res.status(500).json({ error: 'Failed to fetch escalation policies' });
    }
  });

  app.post('/api/config/escalation-policies', requireOrgAccess, async (req: any, res) => {
    try {
      const policy = await storage.createEscalationPolicy(req.body);
      res.json({ success: true, policy, message: 'Escalation policy created successfully' });
    } catch (error: any) {
      console.error('Error creating escalation policy:', error);
      res.status(400).json({ error: 'Failed to create escalation policy', details: error.message });
    }
  });

  app.patch('/api/config/escalation-policies/:id', requireOrgAccess, async (req: any, res) => {
    try {
      const policy = await storage.updateEscalationPolicy(req.params.id, req.body);
      res.json({ success: true, policy, message: 'Escalation policy updated successfully' });
    } catch (error: any) {
      console.error('Error updating escalation policy:', error);
      res.status(400).json({ error: 'Failed to update escalation policy', details: error.message });
    }
  });

  app.delete('/api/config/escalation-policies/:id', requireOrgAccess, async (req: any, res) => {
    try {
      await storage.deleteEscalationPolicy(req.params.id);
      res.json({ success: true, policyId: req.params.id, message: 'Escalation policy deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting escalation policy:', error);
      res.status(400).json({ error: 'Failed to delete escalation policy', details: error.message });
    }
  });

  // --- Communication Channels CRUD ---
  app.get('/api/config/communication-channels', requireOrgAccess, async (req: any, res) => {
    try {
      const organizationId = req.query.organizationId as string | undefined;
      const channels = await storage.getCommunicationChannels(organizationId);
      res.json(channels);
    } catch (error) {
      console.error('Error fetching communication channels:', error);
      res.status(500).json({ error: 'Failed to fetch communication channels' });
    }
  });

  app.post('/api/config/communication-channels', requireOrgAccess, async (req: any, res) => {
    try {
      const channel = await storage.createCommunicationChannel(req.body);
      res.json({ success: true, channel, message: 'Communication channel created successfully' });
    } catch (error: any) {
      console.error('Error creating communication channel:', error);
      res.status(400).json({ error: 'Failed to create communication channel', details: error.message });
    }
  });

  app.patch('/api/config/communication-channels/:id', requireOrgAccess, async (req: any, res) => {
    try {
      const channel = await storage.updateCommunicationChannel(req.params.id, req.body);
      res.json({ success: true, channel, message: 'Communication channel updated successfully' });
    } catch (error: any) {
      console.error('Error updating communication channel:', error);
      res.status(400).json({ error: 'Failed to update communication channel', details: error.message });
    }
  });

  app.delete('/api/config/communication-channels/:id', requireOrgAccess, async (req: any, res) => {
    try {
      await storage.deleteCommunicationChannel(req.params.id);
      res.json({ success: true, channelId: req.params.id, message: 'Communication channel deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting communication channel:', error);
      res.status(400).json({ error: 'Failed to delete communication channel', details: error.message });
    }
  });

  // --- Success Metrics CRUD ---
  app.get('/api/config/success-metrics', requireOrgAccess, async (req: any, res) => {
    try {
      const organizationId = req.query.organizationId as string | undefined;
      const metrics = await storage.getSuccessMetricsConfig(organizationId);
      res.json(metrics);
    } catch (error) {
      console.error('Error fetching success metrics:', error);
      res.status(500).json({ error: 'Failed to fetch success metrics' });
    }
  });

  app.post('/api/config/success-metrics', requireOrgAccess, async (req: any, res) => {
    try {
      const metric = await storage.createSuccessMetric(req.body);
      res.json({ success: true, metric, message: 'Success metric created successfully' });
    } catch (error: any) {
      console.error('Error creating success metric:', error);
      res.status(400).json({ error: 'Failed to create success metric', details: error.message });
    }
  });

  app.patch('/api/config/success-metrics/:id', requireOrgAccess, async (req: any, res) => {
    try {
      const metric = await storage.updateSuccessMetric(req.params.id, req.body);
      res.json({ success: true, metric, message: 'Success metric updated successfully' });
    } catch (error: any) {
      console.error('Error updating success metric:', error);
      res.status(400).json({ error: 'Failed to update success metric', details: error.message });
    }
  });

  app.delete('/api/config/success-metrics/:id', requireOrgAccess, async (req: any, res) => {
    try {
      await storage.deleteSuccessMetric(req.params.id);
      res.json({ success: true, metricId: req.params.id, message: 'Success metric deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting success metric:', error);
      res.status(400).json({ error: 'Failed to delete success metric', details: error.message });
    }
  });

  // --- Organization Setup Progress ---
  app.get('/api/config/setup-progress/:organizationId', requireOrgAccess, async (req: any, res) => {
    try {
      const progress = await storage.getOrganizationSetupProgress(req.orgId);
      res.json(progress || {
        departmentsConfigured: false,
        executivesConfigured: false,
        approvalChainsConfigured: false,
        escalationPoliciesConfigured: false,
        communicationChannelsConfigured: false,
      });
    } catch (error) {
      console.error('Error fetching setup progress:', error);
      res.status(500).json({ error: 'Failed to fetch setup progress' });
    }
  });

  app.post('/api/config/setup-progress', requireOrgAccess, async (req: any, res) => {
    try {
      const progress = await storage.upsertOrganizationSetupProgress({ ...req.body, organizationId: req.orgId });
      res.json({ success: true, progress, message: 'Setup progress updated successfully' });
    } catch (error: any) {
      console.error('Error updating setup progress:', error);
      res.status(400).json({ error: 'Failed to update setup progress', details: error.message });
    }
  });

  app.patch('/api/config/setup-progress/:organizationId', requireOrgAccess, async (req: any, res) => {
    try {
      const progress = await storage.upsertOrganizationSetupProgress({ ...req.body, organizationId: req.orgId });
      res.json({ success: true, progress, message: 'Setup progress saved' });
    } catch (error: any) {
      console.error('Error saving setup progress:', error);
      res.status(400).json({ error: 'Failed to save setup progress', details: error.message });
    }
  });
}
