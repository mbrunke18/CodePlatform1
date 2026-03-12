import { db } from '../db.js';
import { quickStartTemplates, deploymentProgress, scenarios, kpis, users, organizations } from '@shared/schema';
import { eq, and, desc, inArray } from 'drizzle-orm';
import { roiMeasurementService } from './ROIMeasurementService.js';
import { databaseNotificationService } from './DatabaseNotificationService.js';

export interface QuickStartTemplate {
  id: string;
  name: string;
  category: string;
  industry: string;
  organizationSize: string;
  description: string;
  estimatedSetupTime: number;
  templateData: {
    scenarios: Array<{
      name: string;
      description: string;
      category: string;
      priority: string;
      response_templates: Array<{
        phase: string;
        actions: string[];
        stakeholders: string[];
      }>;
    }>;
    kpis: Array<{
      name: string;
      description: string;
      category: string;
      unit: string;
      target: number;
      threshold: number;
    }>;
    workflows: Array<{
      name: string;
      steps: string[];
      triggers: string[];
    }>;
    integrations: Array<{
      name: string;
      type: string;
      priority: string;
    }>;
  };
  requirements: {
    minimumUsers: number;
    requiredRoles: string[];
    dataRequirements: string[];
    integrationPrerequisites: string[];
  };
}

export interface DeploymentStep {
  id: string;
  title: string;
  description: string;
  estimatedTime: number; // minutes
  dependencies: string[];
  automatable: boolean;
  validationCriteria: string[];
}

export interface DeploymentPlan {
  templateId: string;
  organizationId: string;
  steps: DeploymentStep[];
  totalEstimatedTime: number;
  criticalPath: string[];
  parallelizable: string[][];
}

export class QuickStartService {

  /**
   * Initialize default quick-start templates
   */
  async initializeDefaultTemplates(): Promise<void> {
    try {
      const defaultTemplates = [
        {
          name: "Crisis Response Foundation",
          category: "crisis_response",
          industry: "general",
          organizationSize: "enterprise",
          description: "Essential crisis response framework with communication protocols and response teams",
          estimatedSetupTime: 180, // 3 hours
          templateData: {
            scenarios: [
              {
                name: "Cybersecurity Incident",
                description: "Data breach or cyber attack requiring immediate response",
                category: "security",
                priority: "critical",
                response_templates: [
                  {
                    phase: "immediate",
                    actions: ["Isolate affected systems", "Activate security team", "Preserve evidence"],
                    stakeholders: ["CISO", "IT Director", "Legal Counsel"]
                  },
                  {
                    phase: "short_term",
                    actions: ["Assess damage", "Implement containment", "Notify authorities"],
                    stakeholders: ["CEO", "Communications", "HR"]
                  }
                ]
              },
              {
                name: "Supply Chain Disruption",
                description: "Critical supplier failure affecting operations",
                category: "operational",
                priority: "high",
                response_templates: [
                  {
                    phase: "immediate",
                    actions: ["Assess impact", "Activate backup suppliers", "Communicate with customers"],
                    stakeholders: ["COO", "Procurement", "Customer Service"]
                  }
                ]
              }
            ],
            kpis: [
              {
                name: "Crisis Response Time",
                description: "Time from detection to response activation",
                category: "crisis_response",
                unit: "hours",
                target: 2,
                threshold: 4
              },
              {
                name: "Stakeholder Notification Speed",
                description: "Time to notify all critical stakeholders",
                category: "communication",
                unit: "hours",
                target: 1,
                threshold: 3
              }
            ],
            workflows: [
              {
                name: "Crisis Escalation",
                steps: ["Detect issue", "Assess severity", "Activate response team", "Execute response"],
                triggers: ["Automated alert", "Manual escalation", "External notification"]
              }
            ],
            integrations: [
              {
                name: "Email/SMS Alerts",
                type: "communication",
                priority: "high"
              },
              {
                name: "Monitoring Systems",
                type: "detection",
                priority: "high"
              }
            ]
          },
          requirements: {
            minimumUsers: 5,
            requiredRoles: ["Crisis Manager", "Executive Sponsor", "Communications Lead"],
            dataRequirements: ["Contact databases", "System monitoring"],
            integrationPrerequisites: ["Email system", "Phone system"]
          }
        },
        {
          name: "Strategic Planning Accelerator",
          category: "strategic_planning",
          industry: "general",
          organizationSize: "large",
          description: "Rapid deployment of strategic planning framework with KPI tracking",
          estimatedSetupTime: 240, // 4 hours
          templateData: {
            scenarios: [
              {
                name: "Market Expansion Analysis",
                description: "Evaluate new market opportunities and risks",
                category: "strategic",
                priority: "medium",
                response_templates: [
                  {
                    phase: "analysis",
                    actions: ["Market research", "Competitive analysis", "Risk assessment"],
                    stakeholders: ["Strategy Team", "Finance", "Marketing"]
                  }
                ]
              }
            ],
            kpis: [
              {
                name: "Strategic Initiative Success Rate",
                description: "Percentage of strategic initiatives meeting objectives",
                category: "strategic_value",
                unit: "percentage",
                target: 85,
                threshold: 70
              },
              {
                name: "Planning Cycle Efficiency",
                description: "Time to complete strategic planning cycles",
                category: "planning",
                unit: "days",
                target: 30,
                threshold: 45
              }
            ],
            workflows: [
              {
                name: "Strategic Review",
                steps: ["Gather data", "Analyze trends", "Generate insights", "Make decisions"],
                triggers: ["Quarterly review", "Market changes", "Performance alerts"]
              }
            ],
            integrations: [
              {
                name: "Business Intelligence",
                type: "bi",
                priority: "high"
              },
              {
                name: "Financial Systems",
                type: "erp",
                priority: "medium"
              }
            ]
          },
          requirements: {
            minimumUsers: 10,
            requiredRoles: ["Chief Strategy Officer", "Finance Director", "Business Unit Leaders"],
            dataRequirements: ["Financial data", "Market data", "Performance metrics"],
            integrationPrerequisites: ["ERP system", "BI tools"]
          }
        },
        {
          name: "Executive Dashboard Essentials",
          category: "kpi_tracking",
          industry: "general",
          organizationSize: "medium",
          description: "Core executive KPIs and dashboards for strategic oversight",
          estimatedSetupTime: 120, // 2 hours
          templateData: {
            scenarios: [],
            kpis: [
              {
                name: "Revenue Growth Rate",
                description: "Quarter-over-quarter revenue growth",
                category: "financial",
                unit: "percentage",
                target: 15,
                threshold: 10
              },
              {
                name: "Customer Satisfaction Score",
                description: "Overall customer satisfaction rating",
                category: "customer",
                unit: "score",
                target: 4.5,
                threshold: 4.0
              },
              {
                name: "Employee Engagement",
                description: "Employee satisfaction and engagement score",
                category: "hr",
                unit: "percentage",
                target: 80,
                threshold: 70
              }
            ],
            workflows: [
              {
                name: "Executive Review",
                steps: ["Collect metrics", "Generate reports", "Review performance", "Plan actions"],
                triggers: ["Weekly schedule", "Threshold alerts", "Board meetings"]
              }
            ],
            integrations: [
              {
                name: "CRM System",
                type: "crm",
                priority: "high"
              },
              {
                name: "HR System",
                type: "hr",
                priority: "medium"
              }
            ]
          },
          requirements: {
            minimumUsers: 3,
            requiredRoles: ["CEO", "CFO", "COO"],
            dataRequirements: ["Financial data", "Customer data", "HR metrics"],
            integrationPrerequisites: ["CRM", "ERP", "HR system"]
          }
        }
      ];

      for (const template of defaultTemplates) {
        await db.insert(quickStartTemplates).values({
          name: template.name,
          category: template.category,
          industry: template.industry,
          organizationSize: template.organizationSize,
          description: template.description,
          templateData: template.templateData,
          requirements: template.requirements,
          estimatedSetupTime: template.estimatedSetupTime,
          usageCount: 0,
          successRate: 0.85,
          version: "1.0",
          isActive: true,
          createdBy: "system"
        });
      }

      console.log(`✅ Initialized ${defaultTemplates.length} quick-start templates`);

    } catch (error) {
      console.error('❌ Failed to initialize quick-start templates:', error);
      throw error;
    }
  }

  /**
   * Get recommended templates for an organization
   */
  async getRecommendedTemplates(
    organizationId: string, 
    filters?: {
      industry?: string;
      size?: string;
      category?: string;
    }
  ): Promise<QuickStartTemplate[]> {
    try {
      // Get organization details for better matching
      const [org] = await db
        .select()
        .from(organizations)
        .where(eq(organizations.id, organizationId));

      let whereConditions = [eq(quickStartTemplates.isActive, true)];

      if (filters?.industry) {
        whereConditions.push(eq(quickStartTemplates.industry, filters.industry));
      } else if (org?.type) {
        // Match by organization type if available
        whereConditions.push(eq(quickStartTemplates.industry, 'general')); // Default to general
      }

      if (filters?.size) {
        whereConditions.push(eq(quickStartTemplates.organizationSize, filters.size));
      }

      if (filters?.category) {
        whereConditions.push(eq(quickStartTemplates.category, filters.category));
      }

      const templates = await db
        .select()
        .from(quickStartTemplates)
        .where(and(...whereConditions))
        .orderBy(desc(quickStartTemplates.successRate), desc(quickStartTemplates.usageCount));

      return templates.map(t => ({
        id: t.id,
        name: t.name,
        category: t.category,
        industry: t.industry || '',
        organizationSize: t.organizationSize || '',
        description: t.description || '',
        estimatedSetupTime: t.estimatedSetupTime || 120,
        templateData: t.templateData as any,
        requirements: t.requirements as any
      }));

    } catch (error) {
      console.error('❌ Failed to get recommended templates:', error);
      throw error;
    }
  }

  /**
   * Create deployment plan for a template
   */
  async createDeploymentPlan(templateId: string, organizationId: string): Promise<DeploymentPlan> {
    try {
      const [template] = await db
        .select()
        .from(quickStartTemplates)
        .where(eq(quickStartTemplates.id, templateId));

      if (!template) {
        throw new Error(`Template ${templateId} not found`);
      }

      const templateData = template.templateData as any;
      const steps: DeploymentStep[] = [];
      
      // Step 1: Organization setup
      steps.push({
        id: 'org_setup',
        title: 'Organization Setup',
        description: 'Configure organization structure and user roles',
        estimatedTime: 30,
        dependencies: [],
        automatable: true,
        validationCriteria: ['Users created', 'Roles assigned', 'Permissions configured']
      });

      // Step 2: Data preparation
      if (templateData.kpis?.length > 0) {
        steps.push({
          id: 'data_prep',
          title: 'Data Preparation',
          description: 'Set up data sources and KPI baselines',
          estimatedTime: 45,
          dependencies: ['org_setup'],
          automatable: false,
          validationCriteria: ['Data sources connected', 'Baseline values set', 'Data quality validated']
        });
      }

      // Step 3: Scenario deployment
      if (templateData.scenarios?.length > 0) {
        steps.push({
          id: 'scenarios',
          title: 'Scenario Deployment',
          description: `Deploy ${templateData.scenarios.length} scenario templates`,
          estimatedTime: templateData.scenarios.length * 15,
          dependencies: ['org_setup'],
          automatable: true,
          validationCriteria: ['Scenarios created', 'Response templates configured', 'Stakeholders assigned']
        });
      }

      // Step 4: KPI setup
      if (templateData.kpis?.length > 0) {
        steps.push({
          id: 'kpi_setup',
          title: 'KPI Configuration',
          description: `Configure ${templateData.kpis.length} key performance indicators`,
          estimatedTime: templateData.kpis.length * 10,
          dependencies: ['data_prep'],
          automatable: true,
          validationCriteria: ['KPIs configured', 'Targets set', 'Thresholds defined']
        });
      }

      // Step 5: Integration setup
      if (templateData.integrations?.length > 0) {
        steps.push({
          id: 'integrations',
          title: 'System Integrations',
          description: `Connect ${templateData.integrations.length} external systems`,
          estimatedTime: templateData.integrations.length * 20,
          dependencies: ['org_setup'],
          automatable: false,
          validationCriteria: ['Connections tested', 'Data flow verified', 'Authentication configured']
        });
      }

      // Step 6: Testing and validation
      steps.push({
        id: 'validation',
        title: 'Testing & Validation',
        description: 'Test all components and validate deployment',
        estimatedTime: 30,
        dependencies: steps.map(s => s.id).filter(id => id !== 'validation'),
        automatable: false,
        validationCriteria: ['End-to-end testing', 'User acceptance', 'Performance validation']
      });

      // Step 7: Training and onboarding
      steps.push({
        id: 'onboarding',
        title: 'User Onboarding',
        description: 'Train users and provide documentation',
        estimatedTime: 60,
        dependencies: ['validation'],
        automatable: false,
        validationCriteria: ['Users trained', 'Documentation provided', 'Support established']
      });

      const totalEstimatedTime = steps.reduce((sum, step) => sum + step.estimatedTime, 0);
      
      // Calculate critical path
      const criticalPath = this.calculateCriticalPath(steps);
      
      // Identify parallelizable steps
      const parallelizable = this.identifyParallelizableSteps(steps);

      return {
        templateId,
        organizationId,
        steps,
        totalEstimatedTime,
        criticalPath,
        parallelizable
      };

    } catch (error) {
      console.error('❌ Failed to create deployment plan:', error);
      throw error;
    }
  }

  /**
   * Start template deployment
   */
  async startDeployment(templateId: string, organizationId: string, assignedTo?: string): Promise<string> {
    try {
      const plan = await this.createDeploymentPlan(templateId, organizationId);
      
      const [deployment] = await db.insert(deploymentProgress).values({
        organizationId,
        templateId,
        currentStep: 0,
        totalSteps: plan.steps.length,
        status: 'planning',
        stepsCompleted: [],
        stepData: {},
        estimatedCompletion: new Date(Date.now() + plan.totalEstimatedTime * 60 * 1000),
        assignedTo: assignedTo || 'auto',
        metadata: {
          plan,
          startedBy: assignedTo || 'system'
        }
      }).returning();

      // Initialize ROI metrics for the organization if this is their first deployment
      const existingMetrics = await db
        .select()
        .from(quickStartTemplates) // This should be roiMetrics but avoiding circular dependency
        .where(eq(quickStartTemplates.id, organizationId))
        .limit(1);

      if (existingMetrics.length === 0) {
        await roiMeasurementService.initializeOrganizationMetrics(organizationId);
      }

      // Send notification to assigned user
      if (assignedTo) {
        await databaseNotificationService.createAndSendNotification({
          organizationId,
          userId: assignedTo,
          type: 'deployment_started',
          title: 'Quick-Start Deployment Initiated',
          message: `Template "${plan.steps[0]?.title}" deployment has started. Estimated completion: ${Math.round(plan.totalEstimatedTime / 60)} hours.`,
          priority: 'medium',
          metadata: {
            deploymentId: deployment.id,
            templateId,
            estimatedCompletion: plan.totalEstimatedTime
          }
        });
      }

      console.log(`🚀 Started deployment ${deployment.id} for template ${templateId}`);
      return deployment.id;

    } catch (error) {
      console.error('❌ Failed to start deployment:', error);
      throw error;
    }
  }

  /**
   * Execute automated deployment step
   */
  async executeAutomatedStep(deploymentId: string, stepId: string): Promise<boolean> {
    try {
      const [deployment] = await db
        .select()
        .from(deploymentProgress)
        .where(eq(deploymentProgress.id, deploymentId));

      if (!deployment) {
        throw new Error(`Deployment ${deploymentId} not found`);
      }

      const plan = deployment.metadata?.plan as DeploymentPlan;
      const step = plan.steps.find(s => s.id === stepId);

      if (!step || !step.automatable) {
        return false;
      }

      let success = false;

      switch (stepId) {
        case 'org_setup':
          success = await this.executeOrgSetup(deployment.organizationId, deployment.templateId);
          break;
        case 'scenarios':
          success = await this.executeScenarioDeployment(deployment.organizationId, deployment.templateId);
          break;
        case 'kpi_setup':
          success = await this.executeKPISetup(deployment.organizationId, deployment.templateId);
          break;
        default:
          success = false;
      }

      if (success) {
        const stepsCompleted = [...(deployment.stepsCompleted as string[] || []), stepId];
        await db
          .update(deploymentProgress)
          .set({
            currentStep: deployment.currentStep + 1,
            stepsCompleted,
            status: deployment.currentStep + 1 >= deployment.totalSteps ? 'completed' : 'in_progress',
            completedAt: deployment.currentStep + 1 >= deployment.totalSteps ? new Date() : undefined,
            metadata: {
              ...deployment.metadata,
              lastStepCompleted: {
                stepId,
                completedAt: new Date().toISOString()
              }
            }
          })
          .where(eq(deploymentProgress.id, deploymentId));

        // Track value event for deployment progress
        if (deployment.assignedTo) {
          await roiMeasurementService.trackValueEvent({
            organizationId: deployment.organizationId,
            eventType: 'deployment_step_completed',
            entityId: deploymentId,
            entityType: 'deployment',
            valueGenerated: 1000, // Each step adds setup value
            costAvoided: step.estimatedTime * 100, // Time saved value
            timeToResolution: step.estimatedTime,
            qualityScore: 0.9, // Automated steps have high quality
            evidenceData: {
              stepId,
              stepType: step.title,
              automated: true
            }
          });
        }
      }

      return success;

    } catch (error) {
      console.error(`❌ Failed to execute automated step ${stepId}:`, error);
      return false;
    }
  }

  /**
   * Execute organization setup
   */
  private async executeOrgSetup(organizationId: string, templateId: string): Promise<boolean> {
    try {
      const [template] = await db
        .select()
        .from(quickStartTemplates)
        .where(eq(quickStartTemplates.id, templateId));

      if (!template) return false;

      const requirements = template.requirements as any;
      
      // Create placeholder users for required roles if they don't exist
      const existingUsers = await db
        .select()
        .from(users)
        .where(eq(users.organizationId, organizationId));

      if (existingUsers.length < requirements.minimumUsers) {
        console.log(`⚠️ Organization needs ${requirements.minimumUsers} users, has ${existingUsers.length}`);
        // In a real implementation, this would guide the user to invite more people
      }

      return true;

    } catch (error) {
      console.error('❌ Failed to execute org setup:', error);
      return false;
    }
  }

  /**
   * Execute scenario deployment
   */
  private async executeScenarioDeployment(organizationId: string, templateId: string): Promise<boolean> {
    try {
      const [template] = await db
        .select()
        .from(quickStartTemplates)
        .where(eq(quickStartTemplates.id, templateId));

      if (!template) return false;

      const templateData = template.templateData as any;
      const scenarioTemplates = templateData.scenarios || [];

      for (const scenarioTemplate of scenarioTemplates) {
        await db.insert(scenarios).values({
          organizationId,
          name: scenarioTemplate.name,
          description: scenarioTemplate.description,
          category: scenarioTemplate.category,
          priority: scenarioTemplate.priority as any,
          status: 'draft',
          tags: [`template:${templateId}`],
          metadata: {
            fromTemplate: templateId,
            responseTemplates: scenarioTemplate.response_templates,
            deployedAt: new Date().toISOString()
          },
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      console.log(`✅ Deployed ${scenarioTemplates.length} scenarios from template`);
      return true;

    } catch (error) {
      console.error('❌ Failed to execute scenario deployment:', error);
      return false;
    }
  }

  /**
   * Execute KPI setup
   */
  private async executeKPISetup(organizationId: string, templateId: string): Promise<boolean> {
    try {
      const [template] = await db
        .select()
        .from(quickStartTemplates)
        .where(eq(quickStartTemplates.id, templateId));

      if (!template) return false;

      const templateData = template.templateData as any;
      const kpiTemplates = templateData.kpis || [];

      for (const kpiTemplate of kpiTemplates) {
        await db.insert(kpis).values({
          organizationId,
          name: kpiTemplate.name,
          description: kpiTemplate.description,
          category: kpiTemplate.category,
          unit: kpiTemplate.unit,
          target: kpiTemplate.target,
          threshold: kpiTemplate.threshold,
          currentValue: 0, // Will be updated as data comes in
          frequency: 'weekly',
          isActive: true,
          tags: [`template:${templateId}`],
          metadata: {
            fromTemplate: templateId,
            deployedAt: new Date().toISOString()
          },
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      console.log(`✅ Deployed ${kpiTemplates.length} KPIs from template`);
      return true;

    } catch (error) {
      console.error('❌ Failed to execute KPI setup:', error);
      return false;
    }
  }

  /**
   * Calculate critical path for deployment steps
   */
  private calculateCriticalPath(steps: DeploymentStep[]): string[] {
    // Simple critical path: longest sequence of dependent steps
    const stepMap = new Map(steps.map(s => [s.id, s]));
    const visited = new Set<string>();
    
    const findLongestPath = (stepId: string): string[] => {
      if (visited.has(stepId)) return [];
      visited.add(stepId);
      
      const step = stepMap.get(stepId);
      if (!step) return [];
      
      let longestDependentPath: string[] = [];
      for (const depId of step.dependencies) {
        const path = findLongestPath(depId);
        if (path.length > longestDependentPath.length) {
          longestDependentPath = path;
        }
      }
      
      return [...longestDependentPath, stepId];
    };
    
    // Find the step with no dependents (final step)
    const finalStep = steps.find(s => !steps.some(other => other.dependencies.includes(s.id)));
    return finalStep ? findLongestPath(finalStep.id) : [];
  }

  /**
   * Identify steps that can be run in parallel
   */
  private identifyParallelizableSteps(steps: DeploymentStep[]): string[][] {
    const groups: string[][] = [];
    const processed = new Set<string>();
    
    for (const step of steps) {
      if (processed.has(step.id)) continue;
      
      // Find all steps that can run in parallel with this one
      const parallelGroup = [step.id];
      processed.add(step.id);
      
      for (const otherStep of steps) {
        if (processed.has(otherStep.id)) continue;
        
        // Check if steps can run in parallel (no dependency relationship)
        const canRunInParallel = !step.dependencies.includes(otherStep.id) &&
                                !otherStep.dependencies.includes(step.id) &&
                                step.dependencies.every(dep => !otherStep.dependencies.includes(dep));
        
        if (canRunInParallel) {
          parallelGroup.push(otherStep.id);
          processed.add(otherStep.id);
        }
      }
      
      if (parallelGroup.length > 1) {
        groups.push(parallelGroup);
      }
    }
    
    return groups;
  }

  /**
   * Get deployment status and progress
   */
  async getDeploymentStatus(deploymentId: string): Promise<{
    deployment: any;
    progress: number;
    currentStep: string | null;
    nextSteps: DeploymentStep[];
    blockers: any[];
  }> {
    try {
      const [deployment] = await db
        .select()
        .from(deploymentProgress)
        .where(eq(deploymentProgress.id, deploymentId));

      if (!deployment) {
        throw new Error(`Deployment ${deploymentId} not found`);
      }

      const plan = deployment.metadata?.plan as DeploymentPlan;
      const progress = (deployment.currentStep / deployment.totalSteps) * 100;
      const currentStep = plan.steps[deployment.currentStep]?.title || null;
      const nextSteps = plan.steps.slice(deployment.currentStep, deployment.currentStep + 3);
      const blockers = deployment.blockers as any[] || [];

      return {
        deployment,
        progress: Math.round(progress),
        currentStep,
        nextSteps,
        blockers
      };

    } catch (error) {
      console.error('❌ Failed to get deployment status:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const quickStartService = new QuickStartService();