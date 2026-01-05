import { db } from '../db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';
import pino from 'pino';

const log = pino({ name: 'rbac' });

export type UserRole = 'admin' | 'executor' | 'viewer';

/**
 * Get user role for organization
 */
export async function getUserRole(userId: string, organizationId: string): Promise<UserRole> {
  try {
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user.length) return 'viewer'; // Default to viewer if no user record
    
    // For now, treat all authenticated users as executors, demo user as admin
    if (userId === '7cd941d8-5c5f-461e-87ea-9d2b1d81cb59') return 'admin';
    return 'executor';
  } catch (error) {
    log.error({ error }, 'Error fetching user role');
    return 'viewer';
  }
}

/**
 * Enforce RBAC for endpoint
 */
export async function enforceRole(
  userId: string,
  organizationId: string,
  requiredRole: UserRole | UserRole[]
): Promise<boolean> {
  const userRole = await getUserRole(userId, organizationId);
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  
  const roleHierarchy: Record<UserRole, number> = {
    'viewer': 1,
    'executor': 2,
    'admin': 3
  };
  
  const userRoleLevel = roleHierarchy[userRole];
  const minRequired = Math.min(...roles.map(r => roleHierarchy[r]));
  
  const authorized = userRoleLevel >= minRequired;
  
  if (!authorized) {
    log.warn({ userId, userRole, requiredRole }, '❌ RBAC violation');
  }
  
  return authorized;
}

/**
 * Verify organization access
 */
export async function verifyOrgAccess(userId: string, requestedOrgId: string): Promise<boolean> {
  // Demo user has access to all orgs
  if (userId === '7cd941d8-5c5f-461e-87ea-9d2b1d81cb59') return true;
  
  try {
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user.length) return false;
    
    // User can only access their own organization
    return user[0].organizationId === requestedOrgId;
  } catch (error) {
    log.error({ error }, 'Error verifying org access');
    return false;
  }
}

export default { getUserRole, enforceRole, verifyOrgAccess };
