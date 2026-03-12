import { db } from '../db';
import { approvalTokens, executionInstances, users } from '@shared/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import pino from 'pino';

export interface ApprovalContext {
  playbookName: string;
  scenarioTitle: string;
  decisionQuestion: string;
  estimatedImpact: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

export interface ApprovalToken {
  id: string;
  token: string;
  approvalUrl: string;
  rejectUrl: string;
  expiresAt: Date;
}

/**
 * ApprovalTokenService - Secure magic link approvals for zero-click executive experience
 * 
 * Features:
 * - Generates secure, time-limited approval tokens
 * - Creates magic links for one-click approve/reject
 * - Tracks token usage and prevents replay attacks
 * - Provides audit trail for all approvals
 * - Supports multiple approval types (approve, reject, escalate)
 */
const logger = pino({ name: 'approval-token-service' });

export class ApprovalTokenService {
  private log = logger;

  // Token expires in 72 hours by default
  private readonly DEFAULT_EXPIRY_HOURS = 72;

  /**
   * Generate approval token for email notification
   */
  async generateApprovalToken(params: {
    executionInstanceId: string;
    userId: string;
    decisionNodeId?: string;
    context: ApprovalContext;
    expiryHours?: number;
  }): Promise<{ approveToken: ApprovalToken; rejectToken: ApprovalToken }> {
    const { executionInstanceId, userId, decisionNodeId, context, expiryHours = this.DEFAULT_EXPIRY_HOURS } = params;

    this.log.info({ executionInstanceId, userId }, 'Generating approval tokens');

    try {
      const expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000);

      // Generate secure tokens (raw tokens returned to client once)
      const approveToken = `approve_${nanoid(32)}`;
      const rejectToken = `reject_${nanoid(32)}`;

      // Hash tokens before storing (security: prevent replay if DB leaks)
      const approveTokenHash = await bcrypt.hash(approveToken, 10);
      const rejectTokenHash = await bcrypt.hash(rejectToken, 10);

      // Store HASHED approve token
      const approveRecord = await db.insert(approvalTokens).values({
        executionInstanceId,
        decisionNodeId,
        userId,
        token: approveTokenHash,
        action: 'approve',
        context,
        expiresAt,
      }).returning();

      // Store HASHED reject token
      const rejectRecord = await db.insert(approvalTokens).values({
        executionInstanceId,
        decisionNodeId,
        userId,
        token: rejectTokenHash,
        action: 'reject',
        context,
        expiresAt,
      }).returning();

      // Generate magic link URLs
      const baseUrl = process.env.REPLIT_DEV_DOMAIN
        ? `https://${process.env.REPLIT_DEV_DOMAIN}`
        : 'http://localhost:5000';

      const approveUrl = `${baseUrl}/api/approvals/${approveToken}`;
      const rejectUrl = `${baseUrl}/api/approvals/${rejectToken}`;

      this.log.info({ executionInstanceId, expiresAt }, 'Approval tokens generated');

      return {
        approveToken: {
          id: approveRecord[0].id,
          token: approveToken,
          approvalUrl: approveUrl,
          rejectUrl: '',
          expiresAt,
        },
        rejectToken: {
          id: rejectRecord[0].id,
          token: rejectToken,
          approvalUrl: '',
          rejectUrl: rejectUrl,
          expiresAt,
        },
      };
    } catch (error) {
      this.log.error({ error, executionInstanceId }, 'Failed to generate approval tokens');
      throw error;
    }
  }

  /**
   * Validate and consume approval token
   */
  async consumeToken(params: {
    token: string;
    userId: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<{
    valid: boolean;
    action?: string;
    executionInstanceId?: string;
    context?: ApprovalContext;
    message?: string;
  }> {
    const { token, userId, ipAddress, userAgent } = params;

    this.log.info({ tokenPrefix: token.substring(0, 10) + '...' }, 'Validating approval token');

    try {
      // Security: Cannot query by token directly since we store hashed tokens
      // Fetch all unused, non-expired tokens and compare hashes
      const potentialTokens = await db
        .select()
        .from(approvalTokens)
        .where(isNull(approvalTokens.usedAt));

      // Find matching token by comparing bcrypt hashes
      let record = null;
      for (const tokenRecord of potentialTokens) {
        const isMatch = await bcrypt.compare(token, tokenRecord.token);
        if (isMatch) {
          record = tokenRecord;
          break;
        }
      }

      if (!record) {
        this.log.warn({ tokenPrefix: token.substring(0, 10) }, 'Token not found or hash mismatch');
        return {
          valid: false,
          message: 'Invalid approval link. The link may have been revoked or never existed.',
        };
      }

      // Check if already used
      if (record.usedAt) {
        this.log.warn({ token, usedAt: record.usedAt }, 'Token already used');
        return {
          valid: false,
          message: 'This approval link has already been used and cannot be used again.',
        };
      }

      // Check if expired
      if (new Date() > record.expiresAt) {
        this.log.warn({ token, expiresAt: record.expiresAt }, 'Token expired');
        return {
          valid: false,
          message: 'This approval link has expired. Please request a new approval link.',
        };
      }

      // Mark token as used
      await db
        .update(approvalTokens)
        .set({
          usedAt: new Date(),
          usedBy: userId,
          ipAddress,
          userAgent,
        })
        .where(eq(approvalTokens.id, record.id));

      // Update execution instance based on action
      if (record.action === 'approve') {
        await this.approveExecution(record.executionInstanceId, userId);
      } else if (record.action === 'reject') {
        await this.rejectExecution(record.executionInstanceId, userId);
      }

      this.log.info({ token, action: record.action, userId }, 'Token consumed successfully');

      return {
        valid: true,
        action: record.action,
        executionInstanceId: record.executionInstanceId,
        context: record.context as ApprovalContext,
        message: `Successfully ${record.action}d execution.`,
      };
    } catch (error) {
      this.log.error({ error, token }, 'Failed to consume token');
      throw error;
    }
  }

  /**
   * Approve execution
   */
  private async approveExecution(executionInstanceId: string, userId: string) {
    await db
      .update(executionInstances)
      .set({
        status: 'running',
      })
      .where(eq(executionInstances.id, executionInstanceId));

    this.log.info({ executionInstanceId, userId }, 'Execution approved via email');
  }

  /**
   * Reject execution
   */
  private async rejectExecution(executionInstanceId: string, userId: string) {
    await db
      .update(executionInstances)
      .set({
        status: 'cancelled',
      })
      .where(eq(executionInstances.id, executionInstanceId));

    this.log.info({ executionInstanceId, userId }, 'Execution rejected via email');
  }

  /**
   * Get all active tokens for a user
   */
  async getActiveTokens(userId: string) {
    const now = new Date();

    return await db
      .select()
      .from(approvalTokens)
      .where(
        and(
          eq(approvalTokens.userId, userId),
          eq(approvalTokens.usedAt, null as any)
        )
      );
  }

  /**
   * Revoke token
   */
  async revokeToken(tokenId: string, userId: string) {
    await db
      .update(approvalTokens)
      .set({
        usedAt: new Date(),
        usedBy: userId,
      })
      .where(eq(approvalTokens.id, tokenId));

    this.log.info({ tokenId, userId }, 'Token revoked');
  }

  /**
   * Get token audit trail
   */
  async getAuditTrail(executionInstanceId: string) {
    const tokens = await db
      .select()
      .from(approvalTokens)
      .where(eq(approvalTokens.executionInstanceId, executionInstanceId));

    return tokens.map(token => ({
      action: token.action,
      createdAt: token.createdAt,
      usedAt: token.usedAt,
      userId: token.userId,
      usedBy: token.usedBy,
      ipAddress: token.ipAddress,
    }));
  }
}

export const approvalTokenService = new ApprovalTokenService();
