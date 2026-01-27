import { db } from '../db.js';
import { notifications, users, organizations } from '@shared/schema';
import { eq, and, desc, isNull, sql } from 'drizzle-orm';
import { notificationManager } from '../integrations/NotificationManager.js';

export interface CreateNotificationParams {
  organizationId: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  priority?: 'low' | 'medium' | 'high';
  entityType?: string;
  entityId?: string;
  scheduledFor?: Date;
  channels?: string[];
  metadata?: Record<string, any>;
}

export interface NotificationDeliveryResult {
  notificationId: string;
  delivered: boolean;
  channels: string[];
  error?: string;
}

export class DatabaseNotificationService {
  
  /**
   * Create and send a notification with database persistence
   */
  async createAndSendNotification(params: CreateNotificationParams): Promise<NotificationDeliveryResult> {
    try {
      // Persist notification to database
      const [notification] = await db.insert(notifications).values({
        organizationId: params.organizationId,
        userId: params.userId,
        type: params.type,
        title: params.title,
        message: params.message,
        priority: params.priority || 'medium',
        entityType: params.entityType,
        entityId: params.entityId,
        scheduledFor: params.scheduledFor,
        channels: params.channels || ['email'],
        metadata: params.metadata || {},
        isRead: false,
        createdAt: new Date()
      }).returning();

      // Send via NotificationManager if immediate delivery
      if (!params.scheduledFor || params.scheduledFor <= new Date()) {
        await this.deliverNotification(notification.id);
      }

      return {
        notificationId: notification.id,
        delivered: true,
        channels: params.channels || ['email']
      };

    } catch (error) {
      console.error('❌ Failed to create notification:', error);
      return {
        notificationId: '',
        delivered: false,
        channels: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Deliver a stored notification via NotificationManager
   */
  private async deliverNotification(notificationId: string): Promise<void> {
    try {
      // Get notification with user details
      const [notification] = await db
        .select({
          notification: notifications,
          user: users,
          organization: organizations
        })
        .from(notifications)
        .leftJoin(users, eq(notifications.userId, users.id))
        .leftJoin(organizations, eq(notifications.organizationId, organizations.id))
        .where(eq(notifications.id, notificationId));

      if (!notification) {
        throw new Error(`Notification ${notificationId} not found`);
      }

      // Convert to NotificationManager format
      const severity = this.mapPriorityToSeverity(notification.notification.priority);
      const metadata = {
        ...(notification.notification.metadata || {}),
        organizationName: notification.organization?.name || 'Unknown',
        entityType: notification.notification.entityType,
        entityId: notification.notification.entityId
      };

      // Send via NotificationManager
      await notificationManager.sendScenarioAlert(
        notification.notification.type,
        `${notification.notification.title}\n\n${notification.notification.message}`,
        severity,
        metadata
      );

      // Mark as sent
      await db
        .update(notifications)
        .set({ sentAt: new Date() })
        .where(eq(notifications.id, notificationId));

      console.log(`✅ Notification ${notificationId} delivered successfully`);

    } catch (error) {
      console.error(`❌ Failed to deliver notification ${notificationId}:`, error);
      throw error;
    }
  }

  /**
   * Get notifications for a user with pagination
   */
  async getUserNotifications(
    userId: string, 
    organizationId?: string,
    limit = 50,
    offset = 0
  ) {
    const whereConditions = [eq(notifications.userId, userId)];
    
    if (organizationId) {
      whereConditions.push(eq(notifications.organizationId, organizationId));
    }

    return await db
      .select()
      .from(notifications)
      .where(and(...whereConditions))
      .orderBy(desc(notifications.createdAt))
      .limit(limit)
      .offset(offset);
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string, userId: string): Promise<boolean> {
    try {
      const [updated] = await db
        .update(notifications)
        .set({ 
          isRead: true, 
          readAt: new Date() 
        })
        .where(
          and(
            eq(notifications.id, notificationId),
            eq(notifications.userId, userId)
          )
        )
        .returning();

      return !!updated;
    } catch (error) {
      console.error('❌ Failed to mark notification as read:', error);
      return false;
    }
  }

  /**
   * Get unread notification count for user
   */
  async getUnreadCount(userId: string, organizationId?: string): Promise<number> {
    const whereConditions = [
      eq(notifications.userId, userId),
      eq(notifications.isRead, false)
    ];
    
    if (organizationId) {
      whereConditions.push(eq(notifications.organizationId, organizationId));
    }

    const result = await db
      .select({ count: notifications.id })
      .from(notifications)
      .where(and(...whereConditions));

    return result.length;
  }

  /**
   * Send bulk notifications (for system-wide alerts)
   */
  async sendBulkNotification(
    organizationId: string,
    userIds: string[],
    notification: Omit<CreateNotificationParams, 'organizationId' | 'userId'>
  ): Promise<NotificationDeliveryResult[]> {
    const results: NotificationDeliveryResult[] = [];

    for (const userId of userIds) {
      const result = await this.createAndSendNotification({
        ...notification,
        organizationId,
        userId
      });
      results.push(result);
    }

    return results;
  }

  /**
   * Process scheduled notifications
   */
  async processScheduledNotifications(): Promise<void> {
    try {
      // Get notifications that are due to be sent
      const dueNotifications = await db
        .select()
        .from(notifications)
        .where(
          and(
            isNull(notifications.sentAt),
            sql`${notifications.scheduledFor} IS NOT NULL`,
            sql`${notifications.scheduledFor} <= NOW()`
          )
        );

      console.log(`📅 Processing ${dueNotifications.length} scheduled notifications`);

      for (const notification of dueNotifications) {
        await this.deliverNotification(notification.id);
      }

    } catch (error) {
      console.error('❌ Failed to process scheduled notifications:', error);
    }
  }

  /**
   * Create strategic alert notification
   */
  async createStrategicAlert(
    organizationId: string,
    alertData: {
      title: string;
      description: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      aiConfidence?: number;
      suggestedActions?: string[];
      targetAudience?: string[];
    }
  ): Promise<NotificationDeliveryResult[]> {
    try {
      // Get executive users for the organization
      const executiveUsers = await db
        .select()
        .from(users)
        .where(
          and(
            eq(users.organizationId, organizationId),
            eq(users.department, 'Executive') // Or check role-based access
          )
        );

      const results: NotificationDeliveryResult[] = [];
      
      // Send to all executives
      for (const user of executiveUsers) {
        const result = await this.createAndSendNotification({
          organizationId,
          userId: user.id,
          type: 'strategic_alert',
          title: `🚨 Strategic Alert: ${alertData.title}`,
          message: alertData.description,
          priority: alertData.severity === 'critical' ? 'high' : alertData.severity,
          channels: ['email', 'slack', 'sms'], // Multi-channel for critical alerts
          metadata: {
            aiConfidence: alertData.aiConfidence,
            suggestedActions: alertData.suggestedActions,
            targetAudience: alertData.targetAudience,
            alertType: 'strategic'
          }
        });
        results.push(result);
      }

      return results;

    } catch (error) {
      console.error('❌ Failed to create strategic alert:', error);
      return [];
    }
  }

  /**
   * Map priority to severity for NotificationManager
   */
  private mapPriorityToSeverity(priority: string): string {
    const mapping = {
      'low': 'low',
      'medium': 'medium', 
      'high': 'high',
      'critical': 'critical'
    };
    return mapping[priority as keyof typeof mapping] || 'medium';
  }

  /**
   * Clean up old read notifications (maintenance)
   */
  async cleanupOldNotifications(daysToKeep = 90): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      await db
        .delete(notifications)
        .where(
          and(
            eq(notifications.isRead, true),
            sql`${notifications.createdAt} <= ${cutoffDate}`
          )
        );

      console.log(`🧹 Cleaned up old notifications`);
      return 0; // Drizzle doesn't return count directly

    } catch (error) {
      console.error('❌ Failed to cleanup old notifications:', error);
      return 0;
    }
  }
}

// Export singleton instance
export const databaseNotificationService = new DatabaseNotificationService();