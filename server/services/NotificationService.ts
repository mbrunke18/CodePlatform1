import nodemailer from 'nodemailer';
import { db } from '../db';
import { notifications, users } from '@shared/schema';
import { eq } from 'drizzle-orm';

interface NotificationDeliveryResult {
  channel: 'email' | 'slack';
  success: boolean;
  reason?: string;
  error?: string;
}

interface DeliveryResponse {
  success: boolean;
  results: NotificationDeliveryResult[];
}

class NotificationService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpHost && smtpUser && smtpPass) {
      try {
        this.transporter = nodemailer.createTransport({
          host: smtpHost,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });
        console.log('✓ Email transporter initialized');
      } catch (error) {
        console.warn('Failed to initialize email transporter:', error);
      }
    } else {
      console.log('ℹ Email credentials not configured - notifications will be logged only');
    }
  }

  async deliverNotification(notificationId: string): Promise<DeliveryResponse> {
    try {
      const notification = await db.query.notifications.findFirst({
        where: eq(notifications.id, notificationId),
        with: {
          user: true,
        },
      });

      if (!notification) {
        throw new Error('Notification not found');
      }

      if (!notification.user) {
        throw new Error('Notification recipient not found');
      }

      const methods = this.getDeliveryMethods(notification.user);
      const deliveryPromises: Array<{ promise: Promise<NotificationDeliveryResult>; channel: 'email' | 'slack' }> = [];

      if (methods.email) {
        deliveryPromises.push({
          promise: this.sendEmail(notification, notification.user),
          channel: 'email',
        });
      }

      if (methods.slack) {
        deliveryPromises.push({
          promise: this.sendSlack(notification, notification.user),
          channel: 'slack',
        });
      }

      // If no delivery methods available, return early
      if (deliveryPromises.length === 0) {
        console.warn(`No delivery methods configured for notification ${notificationId}`);
        return { success: false, results: [] };
      }

      const results = await Promise.allSettled(deliveryPromises.map((d) => d.promise));
      const deliveryResults: NotificationDeliveryResult[] = results.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          // Preserve the actual channel that failed
          return {
            channel: deliveryPromises[index].channel,
            success: false,
            error: result.reason?.message || 'Unknown error',
          };
        }
      });

      const anySuccess = deliveryResults.some((r) => r.success);
      const allSuccess = deliveryResults.every((r) => r.success);

      // Only mark as sent if at least one channel succeeded
      if (anySuccess) {
        await db
          .update(notifications)
          .set({
            sentAt: new Date(),
          })
          .where(eq(notifications.id, notificationId));
      } else {
        console.error(`All delivery channels failed for notification ${notificationId}:`, deliveryResults);
      }

      return { success: allSuccess, results: deliveryResults };
    } catch (error: any) {
      console.error('Notification delivery error:', error);
      throw error;
    }
  }

  private async sendEmail(
    notification: any,
    recipient: any
  ): Promise<NotificationDeliveryResult> {
    try {
      if (!this.transporter) {
        console.log(`[SIMULATED EMAIL] To: ${recipient.email}`);
        console.log(`[SIMULATED EMAIL] Subject: ${notification.title}`);
        console.log(`[SIMULATED EMAIL] Message: ${notification.message}`);
        return {
          channel: 'email',
          success: true,
          reason: 'simulated',
        };
      }

      if (!recipient.email) {
        return {
          channel: 'email',
          success: false,
          reason: 'no_email',
        };
      }

      const htmlContent = this.renderEmailTemplate(notification);

      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || '"M" <alerts@vexor.ai>',
        to: recipient.email,
        subject: notification.title,
        html: htmlContent,
      });

      console.log(`✓ Email sent to ${recipient.email}`);
      return { channel: 'email', success: true };
    } catch (error: any) {
      console.error('Email delivery error:', error);
      return {
        channel: 'email',
        success: false,
        error: error.message,
      };
    }
  }

  private async sendSlack(
    notification: any,
    recipient: any
  ): Promise<NotificationDeliveryResult> {
    try {
      const slackWebhook = recipient.slackWebhookUrl || process.env.SLACK_WEBHOOK_URL;

      if (!slackWebhook) {
        console.log(`[SIMULATED SLACK] User: ${recipient.name || recipient.email}`);
        console.log(`[SIMULATED SLACK] Message: ${notification.title}`);
        return {
          channel: 'slack',
          success: true,
          reason: 'simulated',
        };
      }

      const appUrl = process.env.APP_URL || process.env.REPLIT_DEPLOYMENT_URL || 'http://localhost:5000';

      const response = await fetch(slackWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: notification.title,
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*${notification.title}*\n${notification.message}`,
              },
            },
            {
              type: 'actions',
              elements: [
                {
                  type: 'button',
                  text: { type: 'plain_text', text: 'Acknowledge' },
                  url: `${appUrl}/acknowledge/${notification.id}`,
                  style: 'primary',
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Slack API error: ${response.statusText}`);
      }

      console.log(`✓ Slack message sent to ${recipient.name || recipient.email}`);
      return { channel: 'slack', success: true };
    } catch (error: any) {
      console.error('Slack delivery error:', error);
      return {
        channel: 'slack',
        success: false,
        error: error.message,
      };
    }
  }

  private renderEmailTemplate(notification: any): string {
    const appUrl = process.env.APP_URL || process.env.REPLIT_DEPLOYMENT_URL || 'http://localhost:5000';
    const tasks = notification.metadata?.tasks || [];

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6; 
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }
          .container { 
            max-width: 600px; 
            margin: 20px auto; 
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .header { 
            background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
            color: white; 
            padding: 30px 20px; 
            text-align: center; 
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }
          .priority-badge {
            display: inline-block;
            padding: 4px 12px;
            background: rgba(255,255,255,0.2);
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
            margin-top: 8px;
          }
          .content { 
            padding: 30px 20px; 
          }
          .content h2 {
            color: #1F2937;
            margin-top: 0;
            font-size: 20px;
          }
          .content p {
            color: #4B5563;
            margin: 16px 0;
          }
          .tasks-section {
            margin-top: 24px;
            padding: 16px;
            background: #F9FAFB;
            border-radius: 6px;
          }
          .tasks-section h3 {
            margin-top: 0;
            color: #1F2937;
            font-size: 16px;
          }
          .tasks-section ul {
            margin: 8px 0;
            padding-left: 20px;
          }
          .tasks-section li {
            color: #4B5563;
            margin: 8px 0;
          }
          .button { 
            display: inline-block; 
            padding: 14px 28px; 
            background: #3B82F6; 
            color: white !important; 
            text-decoration: none; 
            border-radius: 6px; 
            margin-top: 24px;
            font-weight: 500;
            transition: background 0.2s;
          }
          .button:hover {
            background: #2563EB;
          }
          .footer { 
            padding: 20px; 
            text-align: center; 
            font-size: 13px; 
            color: #6B7280;
            background: #F9FAFB;
            border-top: 1px solid #E5E7EB;
          }
          .footer p {
            margin: 4px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 M ALERT</h1>
            <div class="priority-badge">${notification.priority?.toUpperCase() || 'HIGH'} PRIORITY</div>
          </div>
          <div class="content">
            <h2>${notification.title}</h2>
            <p>${notification.message}</p>
            
            ${tasks.length > 0 ? `
              <div class="tasks-section">
                <h3>📋 Your Assigned Tasks</h3>
                <ul>
                  ${tasks.map((taskId: string) => `<li>Task ${taskId}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
            
            <center>
              <a href="${appUrl}/acknowledge/${notification.id}" class="button">
                ✓ Acknowledge Receipt
              </a>
            </center>
          </div>
          <div class="footer">
            <p><strong>M Strategic Execution Platform</strong></p>
            <p>This is an automated alert. Please acknowledge immediately.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getDeliveryMethods(recipient: any) {
    return {
      email: !!recipient.email,
      slack: !!recipient.slackWebhookUrl || !!process.env.SLACK_WEBHOOK_URL,
    };
  }

  async deliverBatch(notificationIds: string[]): Promise<void> {
    console.log(`📤 Delivering ${notificationIds.length} notifications...`);
    
    const deliveryPromises = notificationIds.map((id) =>
      this.deliverNotification(id).catch((error) => {
        console.error(`Failed to deliver notification ${id}:`, error);
        return { success: false, results: [] };
      })
    );

    const results = await Promise.allSettled(deliveryPromises);
    const failures = results.filter((r) => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success));
    
    if (failures.length > 0) {
      console.warn(`⚠ ${failures.length} notifications failed to deliver`);
    } else {
      console.log(`✓ All ${notificationIds.length} notifications delivered successfully`);
    }
  }
}

export const notificationService = new NotificationService();
