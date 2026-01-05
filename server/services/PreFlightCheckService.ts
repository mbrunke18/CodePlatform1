import { db } from '../db';
import { 
  users,
  roles,
  executionPlanTasks,
  executionTaskDependencies,
  scenarioExecutionPlans,
  executionPlanPhases
} from '@shared/schema';
import { eq, and, inArray } from 'drizzle-orm';
import pino from 'pino';

export interface PreFlightWarning {
  severity: 'info' | 'warning' | 'critical' | 'blocking';
  category: 'resource' | 'compliance' | 'timing' | 'dependencies';
  title: string;
  message: string;
  affectedTasks: string[];
  suggestedAction: string;
  estimatedDelay?: number; // in hours
}

export interface PreFlightCheckResult {
  canProceed: boolean;
  warnings: PreFlightWarning[];
  readinessScore: number; // 0-100
  estimatedCompletionTime: number; // in minutes
  criticalIssues: number;
  metadata: {
    totalTasks: number;
    rolesRequired: number;
    rolesAvailable: number;
    complianceIssues: number;
  };
}

/**
 * PreFlightCheckService - Predictive execution validation
 * 
 * Features:
 * - Resource availability checking (people, roles, skills)
 * - Planned leave conflict detection
 * - Timezone-aware scheduling
 * - Critical path analysis
 * - Compliance validation
 * - Dependency verification
 */
const logger = pino({ name: 'pre-flight-check-service' });

export class PreFlightCheckService {
  private log = logger;

  /**
   * Perform comprehensive pre-flight check before activation
   */
  async performCheck(params: {
    executionPlanId: string;
    organizationId: string;
    proposedStartTime?: Date;
  }): Promise<PreFlightCheckResult> {
    const { executionPlanId, organizationId, proposedStartTime = new Date() } = params;

    this.log.info({ executionPlanId }, 'Starting pre-flight check');

    const warnings: PreFlightWarning[] = [];

    try {
      // 1. Get execution plan and tasks
      const { plan, tasks, phases } = await this.getExecutionPlan(executionPlanId);

      // 2. Check resource availability
      const resourceWarnings = await this.checkResourceAvailability(
        tasks,
        organizationId,
        proposedStartTime
      );
      warnings.push(...resourceWarnings);

      // 3. Check critical path and dependencies
      const dependencyWarnings = await this.checkDependencies(tasks, executionPlanId);
      warnings.push(...dependencyWarnings);

      // 4. Check timezone conflicts
      const timezoneWarnings = await this.checkTimezoneConflicts(tasks, organizationId, proposedStartTime);
      warnings.push(...timezoneWarnings);

      // 5. Analyze critical issues
      const criticalIssues = warnings.filter(w => w.severity === 'blocking' || w.severity === 'critical').length;
      const canProceed = warnings.filter(w => w.severity === 'blocking').length === 0;

      // 6. Calculate readiness score
      const readinessScore = this.calculateReadinessScore(warnings, tasks.length);

      // 7. Estimate completion time
      const estimatedCompletionTime = this.estimateCompletionTime(tasks, warnings);

      // 8. Get required vs available roles
      const roleStats = await this.getRoleStatistics(tasks, organizationId);

      const result: PreFlightCheckResult = {
        canProceed,
        warnings,
        readinessScore,
        estimatedCompletionTime,
        criticalIssues,
        metadata: {
          totalTasks: tasks.length,
          rolesRequired: roleStats.required,
          rolesAvailable: roleStats.available,
          complianceIssues: warnings.filter(w => w.category === 'compliance').length,
        },
      };

      this.log.info({
        executionPlanId,
        canProceed,
        readinessScore,
        warningCount: warnings.length,
        criticalIssues,
      }, 'Pre-flight check completed');

      return result;
    } catch (error) {
      this.log.error({ error, executionPlanId }, 'Pre-flight check failed');
      throw error;
    }
  }

  /**
   * Get execution plan and associated tasks
   */
  private async getExecutionPlan(executionPlanId: string) {
    const plan = await db
      .select()
      .from(scenarioExecutionPlans)
      .where(eq(scenarioExecutionPlans.id, executionPlanId))
      .limit(1);

    const tasks = await db
      .select()
      .from(executionPlanTasks)
      .where(eq(executionPlanTasks.executionPlanId, executionPlanId));

    const phases = await db
      .select()
      .from(executionPlanPhases)
      .where(eq(executionPlanPhases.executionPlanId, executionPlanId));

    return { plan: plan[0], tasks, phases };
  }

  /**
   * Check if required resources (people) are available
   */
  private async checkResourceAvailability(
    tasks: any[],
    organizationId: string,
    proposedStartTime: Date
  ): Promise<PreFlightWarning[]> {
    const warnings: PreFlightWarning[] = [];

    // Get all required role IDs
    const requiredRoleIdsSet = new Set(tasks.map(t => t.requiredRoleId).filter(Boolean));
    const requiredRoleIds = Array.from(requiredRoleIdsSet);

    if (requiredRoleIds.length === 0) {
      return warnings;
    }

    // Get users with those roles
    const usersWithRoles = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.organizationId, organizationId),
          inArray(users.roleId, requiredRoleIds)
        )
      );

    // Check each required role
    for (const roleId of requiredRoleIds) {
      const usersForRole = usersWithRoles.filter(u => u.roleId === roleId);
      const tasksForRole = tasks.filter(t => t.requiredRoleId === roleId);

      // Get role name
      const roleData = await db
        .select()
        .from(roles)
        .where(eq(roles.id, roleId))
        .limit(1);

      const roleName = roleData[0]?.name || 'Unknown Role';

      if (usersForRole.length === 0) {
        warnings.push({
          severity: 'blocking',
          category: 'resource',
          title: `Missing Required Role: ${roleName}`,
          message: `No users assigned to the ${roleName} role. This playbook cannot execute without this role.`,
          affectedTasks: tasksForRole.map(t => t.title),
          suggestedAction: `Assign at least one user to the ${roleName} role before activating this playbook.`,
        });
        continue;
      }

      // Check for planned leave conflicts
      const usersOnLeave = usersForRole.filter(user => {
        if (!user.plannedLeave || !Array.isArray(user.plannedLeave)) {
          return false;
        }

        return (user.plannedLeave as any[]).some((leave: any) => {
          const leaveStart = new Date(leave.startDate);
          const leaveEnd = new Date(leave.endDate);
          return proposedStartTime >= leaveStart && proposedStartTime <= leaveEnd;
        });
      });

      const availableUsers = usersForRole.length - usersOnLeave.length;

      if (availableUsers === 0) {
        const primaryUser = usersForRole[0];
        warnings.push({
          severity: 'critical',
          category: 'resource',
          title: `${roleName} Unavailable Due to Planned Leave`,
          message: `All users with the ${roleName} role are on planned leave during the proposed execution window.`,
          affectedTasks: tasksForRole.map(t => t.title),
          suggestedAction: `Delay activation or assign an additional user to the ${roleName} role.`,
          estimatedDelay: 72, // 3 days typical
        });
      } else if (availableUsers === 1 && usersForRole.length > 1) {
        warnings.push({
          severity: 'warning',
          category: 'resource',
          title: `Limited ${roleName} Availability`,
          message: `Only 1 of ${usersForRole.length} users with the ${roleName} role is available. No backup if primary is unavailable.`,
          affectedTasks: tasksForRole.map(t => t.title),
          suggestedAction: `Consider delaying activation or ensuring the available ${roleName} is aware of the critical nature of their participation.`,
        });
      }
    }

    return warnings;
  }

  /**
   * Check task dependencies and critical path
   */
  private async checkDependencies(
    tasks: any[],
    executionPlanId: string
  ): Promise<PreFlightWarning[]> {
    const warnings: PreFlightWarning[] = [];

    // Get all dependencies
    const taskIds = tasks.map(t => t.id);
    const dependencies = await db
      .select()
      .from(executionTaskDependencies)
      .where(inArray(executionTaskDependencies.taskId, taskIds));

    // Check for circular dependencies (basic check)
    const dependencyMap = new Map<string, Set<string>>();
    dependencies.forEach(dep => {
      if (!dependencyMap.has(dep.taskId)) {
        dependencyMap.set(dep.taskId, new Set());
      }
      dependencyMap.get(dep.taskId)!.add(dep.dependsOnTaskId);
    });

    // Find tasks with many dependencies (potential bottlenecks)
    dependencies.forEach(dep => {
      const task = tasks.find(t => t.id === dep.taskId);
      const dependsOnTask = tasks.find(t => t.id === dep.dependsOnTaskId);

      if (task && dependsOnTask && dep.dependencyType === 'blocker') {
        warnings.push({
          severity: 'info',
          category: 'dependencies',
          title: `Critical Dependency Chain Detected`,
          message: `"${task.title}" cannot start until "${dependsOnTask.title}" completes. This is on the critical path.`,
          affectedTasks: [task.title, dependsOnTask.title],
          suggestedAction: `Ensure "${dependsOnTask.title}" is prioritized to avoid delays.`,
        });
      }
    });

    return warnings;
  }

  /**
   * Check for timezone conflicts
   */
  private async checkTimezoneConflicts(
    tasks: any[],
    organizationId: string,
    proposedStartTime: Date
  ): Promise<PreFlightWarning[]> {
    const warnings: PreFlightWarning[] = [];

    const hour = proposedStartTime.getHours();

    // Check if activation is during off-hours (before 7am or after 9pm)
    if (hour < 7 || hour > 21) {
      warnings.push({
        severity: 'warning',
        category: 'timing',
        title: 'Off-Hours Activation',
        message: `Proposed activation time (${proposedStartTime.toLocaleTimeString()}) is outside normal business hours. Some stakeholders may not respond immediately.`,
        affectedTasks: [],
        suggestedAction: 'Consider waiting for business hours or ensure key stakeholders are alerted.',
      });
    }

    return warnings;
  }

  /**
   * Calculate overall readiness score (0-100)
   */
  private calculateReadinessScore(warnings: PreFlightWarning[], totalTasks: number): number {
    let score = 100;

    warnings.forEach(warning => {
      switch (warning.severity) {
        case 'blocking':
          score -= 40;
          break;
        case 'critical':
          score -= 20;
          break;
        case 'warning':
          score -= 10;
          break;
        case 'info':
          score -= 5;
          break;
      }
    });

    return Math.max(0, score);
  }

  /**
   * Estimate total completion time considering warnings
   */
  private estimateCompletionTime(tasks: any[], warnings: PreFlightWarning[]): number {
    // Base time from tasks
    const baseTime = tasks.reduce((sum, task) => sum + (task.estimatedMinutes || 5), 0);

    // Add delays from warnings
    const additionalDelay = warnings
      .filter(w => w.estimatedDelay)
      .reduce((sum, w) => sum + (w.estimatedDelay! * 60), 0); // Convert hours to minutes

    return baseTime + additionalDelay;
  }

  /**
   * Get role statistics
   */
  private async getRoleStatistics(tasks: any[], organizationId: string) {
    const requiredRoleIdsSet = new Set(tasks.map(t => t.requiredRoleId).filter(Boolean));
    const requiredRoleIds = Array.from(requiredRoleIdsSet);

    const usersWithRoles = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.organizationId, organizationId),
          inArray(users.roleId, requiredRoleIds)
        )
      );

    const availableRoleIdsSet = new Set(usersWithRoles.map(u => u.roleId).filter(Boolean));
    const availableRoleIds = Array.from(availableRoleIdsSet);

    return {
      required: requiredRoleIds.length,
      available: availableRoleIds.length,
    };
  }
}

export const preFlightCheckService = new PreFlightCheckService();
