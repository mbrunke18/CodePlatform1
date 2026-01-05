import { db } from '../db';
import { 
  executionPlanTasks,
  complianceFrameworks,
  complianceReports
} from '@shared/schema';
import { eq, and, inArray } from 'drizzle-orm';
import pino from 'pino';

export interface ComplianceWarning {
  severity: 'info' | 'warning' | 'critical' | 'blocking';
  frameworkName: string;
  controlId: string;
  controlName: string;
  status: string;
  affectedTasks: string[];
  remediation: string;
  responsibleParty?: string;
}

export interface ComplianceCheckResult {
  compliant: boolean;
  warnings: ComplianceWarning[];
  requiresEscalation: boolean;
  frameworksAffected: string[];
  totalControls: number;
  nonCompliantControls: number;
}

/**
 * ComplianceCheckService - Embedded governance for playbook execution
 * 
 * Features:
 * - Real-time compliance validation
 * - Control mapping to tasks
 * - Framework-specific checks (SOX, GDPR, HIPAA, etc.)
 * - Automatic escalation for non-compliant tasks
 * - Audit trail generation
 */
const logger = pino({ name: 'compliance-check-service' });

export class ComplianceCheckService {
  private log = logger;

  /**
   * Check compliance before playbook activation
   */
  async checkCompliance(params: {
    executionPlanId: string;
    organizationId: string;
    tasks: any[];
  }): Promise<ComplianceCheckResult> {
    const { executionPlanId, organizationId, tasks } = params;

    this.log.info({ executionPlanId }, 'Starting compliance check');

    const warnings: ComplianceWarning[] = [];
    const frameworksAffected = new Set<string>();
    let totalControls = 0;
    let nonCompliantControls = 0;

    try {
      // 1. Identify all compliance controls referenced in tasks
      const allControlIds = new Set<string>();
      tasks.forEach(task => {
        if (task.complianceControlIds && Array.isArray(task.complianceControlIds)) {
          task.complianceControlIds.forEach((id: string) => allControlIds.add(id));
        }
      });

      if (allControlIds.size === 0) {
        // No compliance controls mapped - this is OK
        return {
          compliant: true,
          warnings: [],
          requiresEscalation: false,
          frameworksAffected: [],
          totalControls: 0,
          nonCompliantControls: 0,
        };
      }

      totalControls = allControlIds.size;

      // 2. Get compliance frameworks with their controls
      const frameworks = await db
        .select()
        .from(complianceFrameworks)
        .where(eq(complianceFrameworks.organizationId, organizationId));

      // 3. Check CONTROL-LEVEL compliance (not just framework-level)
      for (const framework of frameworks) {
        // Extract individual controls from framework's controls JSONB field
        // Handle both array format and object wrapper format
        let frameworkControls = framework.controls;
        if (frameworkControls && typeof frameworkControls === 'object' && !Array.isArray(frameworkControls)) {
          frameworkControls = (frameworkControls as any).controls || frameworkControls;
        }
        if (!Array.isArray(frameworkControls)) {
          frameworkControls = [];
        }

        // Check if this framework has any controls referenced by tasks
        // Support both control.id and control.controlId formats
        const frameworkHasReferencedControls = frameworkControls.some((control: any) => {
          const controlId = control.id || control.controlId;
          return controlId && allControlIds.has(controlId);
        });

        if (!frameworkHasReferencedControls) {
          continue; // Skip frameworks with no referenced controls
        }

        frameworksAffected.add(framework.name);

        // Check each control that's referenced by tasks
        for (const control of frameworkControls) {
          const controlId = control.id || control.controlId;
          if (!controlId || !allControlIds.has(controlId)) {
            continue;
          }

          // Find tasks that reference this specific control
          const affectedTasks = tasks
            .filter(t => 
              t.complianceControlIds && 
              Array.isArray(t.complianceControlIds) && 
              t.complianceControlIds.includes(controlId)
            )
            .map(t => t.title);

          if (affectedTasks.length === 0) {
            continue;
          }

          // Determine control status and severity
          const controlStatus = control.status || 'compliant';
          const isNonCompliant = controlStatus === 'non_compliant' || controlStatus === 'failed';
          const isUnderReview = controlStatus === 'under_review' || controlStatus === 'pending';

          if (isNonCompliant || isUnderReview) {
            // Severity matrix:
            // Mandatory + non-compliant = BLOCKING (prevents execution)
            // Non-mandatory + non-compliant = CRITICAL (escalation needed)
            // Mandatory + under review = CRITICAL (escalation needed)
            // Non-mandatory + under review = WARNING (operator visibility)
            let severity: 'blocking' | 'critical' | 'warning' | 'info';
            
            if (isNonCompliant && control.mandatory) {
              severity = 'blocking'; // Mandatory non-compliant controls block execution
            } else if (isNonCompliant && !control.mandatory) {
              severity = 'critical'; // Non-mandatory non-compliant = critical warning
            } else if (isUnderReview && control.mandatory) {
              severity = 'critical'; // Mandatory under review = escalation needed
            } else if (isUnderReview && !control.mandatory) {
              severity = 'warning'; // Non-mandatory under review = warning for operators
            } else {
              severity = 'info'; // Fallback (shouldn't reach here given the conditions)
            }

            warnings.push({
              severity,
              frameworkName: framework.name,
              controlId,
              controlName: control.name || controlId,
              status: controlStatus,
              affectedTasks,
              remediation: control.remediation || `Review ${control.name || 'control'} compliance before proceeding`,
              responsibleParty: control.responsibleParty || framework.responsibleParty || undefined,
            });

            if (isNonCompliant) {
              nonCompliantControls++;
            }
          }
        }
      }

      // 5. Determine if execution can proceed
      const hasBlockingIssues = warnings.some(w => w.severity === 'blocking');
      const compliant = !hasBlockingIssues;
      // requiresEscalation = ANY compliance issues (blocking, critical, OR warning)
      const requiresEscalation = warnings.some(w => 
        w.severity === 'blocking' || w.severity === 'critical' || w.severity === 'warning'
      );

      const result: ComplianceCheckResult = {
        compliant,
        warnings,
        requiresEscalation,
        frameworksAffected: Array.from(frameworksAffected),
        totalControls,
        nonCompliantControls,
      };

      this.log.info({
        executionPlanId,
        compliant,
        warningCount: warnings.length,
        requiresEscalation,
      }, 'Compliance check completed');

      return result;
    } catch (error) {
      this.log.error({ error, executionPlanId }, 'Compliance check failed');
      throw error;
    }
  }

  /**
   * Get compliance status for specific framework
   */
  async getFrameworkStatus(frameworkId: string, organizationId: string) {
    const framework = await db
      .select()
      .from(complianceFrameworks)
      .where(
        and(
          eq(complianceFrameworks.id, frameworkId),
          eq(complianceFrameworks.organizationId, organizationId)
        )
      )
      .limit(1);

    if (framework.length === 0) {
      return null;
    }

    return {
      framework: framework[0],
      totalControls: 0,
      compliant: framework[0].status === 'compliant' ? 1 : 0,
      nonCompliant: framework[0].status === 'non_compliant' ? 1 : 0,
      underReview: framework[0].status === 'under_review' ? 1 : 0,
      complianceRate: framework[0].status === 'compliant' ? 1.0 : 0.0,
    };
  }

  /**
   * Create audit trail for compliance decision
   */
  async createAuditTrail(params: {
    organizationId: string;
    executionPlanId: string;
    decision: 'approved' | 'rejected' | 'escalated';
    complianceCheck: ComplianceCheckResult;
    approvedBy: string;
    notes?: string;
  }) {
    const { organizationId, executionPlanId, decision, complianceCheck, approvedBy, notes } = params;

    // Create compliance report for audit trail
    const frameworks = await db
      .select()
      .from(complianceFrameworks)
      .where(eq(complianceFrameworks.organizationId, organizationId))
      .limit(1);

    if (frameworks.length > 0) {
      await db.insert(complianceReports).values({
        organizationId: frameworks[0].organizationId,
        frameworkId: frameworks[0].id,
        reportType: 'activation_audit',
        reportingPeriod: new Date().toISOString().slice(0, 7), // YYYY-MM
        overallStatus: complianceCheck.compliant ? 'compliant' : 'non_compliant',
        detailedFindings: {
          executionPlanId,
          decision,
          warnings: complianceCheck.warnings,
          totalControls: complianceCheck.totalControls,
          nonCompliantControls: complianceCheck.nonCompliantControls,
        },
        recommendations: complianceCheck.warnings.map(w => w.remediation),
        generatedBy: approvedBy,
      });
    }

    this.log.info({ executionPlanId, decision }, 'Compliance audit trail created');
  }

  /**
   * Map control to task (during playbook design)
   */
  async mapControlToTask(taskId: string, controlIds: string[]) {
    await db
      .update(executionPlanTasks)
      .set({
        complianceControlIds: controlIds,
      })
      .where(eq(executionPlanTasks.id, taskId));

    this.log.info({ taskId, controlCount: controlIds.length }, 'Compliance controls mapped to task');
  }

  /**
   * Get compliance framework details
   */
  async getFrameworkDetails(frameworkId: string) {
    return await db
      .select()
      .from(complianceFrameworks)
      .where(eq(complianceFrameworks.id, frameworkId))
      .limit(1);
  }
}

export const complianceCheckService = new ComplianceCheckService();
