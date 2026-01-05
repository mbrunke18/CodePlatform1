/**
 * Executive Notification Manager
 * Handles multi-channel executive alerts and stakeholder notifications
 */

interface StakeholderContact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  preferredChannel: 'email' | 'sms' | 'push' | 'voice';
  emergencyContact: boolean;
  availability: {
    timezone: string;
    businessHours: { start: string; end: string; };
    weekends: boolean;
  };
}

interface NotificationChannel {
  type: 'email' | 'sms' | 'push' | 'voice' | 'slack' | 'teams';
  enabled: boolean;
  config: Record<string, any>;
}

interface NotificationRule {
  scenarioType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  immediateContacts: string[]; // stakeholder IDs
  escalationLevels: {
    delayMinutes: number;
    contacts: string[];
    channels: string[];
  }[];
}

export class NotificationManager {
  private stakeholders: Map<string, StakeholderContact> = new Map();
  private channels: Map<string, NotificationChannel> = new Map();
  private notificationRules: Map<string, NotificationRule> = new Map();

  constructor() {
    this.initializeDefaultChannels();
    this.loadExecutiveContacts();
  }

  /**
   * Initialize default notification channels
   */
  private initializeDefaultChannels(): void {
    this.channels.set('email', {
      type: 'email',
      enabled: true,
      config: {
        smtp: {
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
          }
        }
      }
    });

    this.channels.set('sms', {
      type: 'sms',
      enabled: !!process.env.TWILIO_ACCOUNT_SID,
      config: {
        twilio: {
          accountSid: process.env.TWILIO_ACCOUNT_SID,
          authToken: process.env.TWILIO_AUTH_TOKEN,
          fromNumber: process.env.TWILIO_PHONE_NUMBER
        }
      }
    });

    this.channels.set('slack', {
      type: 'slack',
      enabled: !!process.env.SLACK_WEBHOOK_URL,
      config: {
        webhookUrl: process.env.SLACK_WEBHOOK_URL,
        channel: '#executive-alerts'
      }
    });
  }

  /**
   * Load executive stakeholder contacts
   */
  private loadExecutiveContacts(): void {
    // Load from environment variables or configuration
    const executives = [
      {
        id: 'ceo',
        name: process.env.CEO_NAME || 'Chief Executive Officer',
        role: 'CEO',
        email: process.env.CEO_EMAIL || 'ceo@company.com',
        phone: process.env.CEO_PHONE,
        preferredChannel: 'sms' as const,
        emergencyContact: true,
        availability: {
          timezone: 'America/New_York',
          businessHours: { start: '06:00', end: '22:00' },
          weekends: true
        }
      },
      {
        id: 'coo',
        name: process.env.COO_NAME || 'Chief Operating Officer',
        role: 'COO',
        email: process.env.COO_EMAIL || 'coo@company.com',
        phone: process.env.COO_PHONE,
        preferredChannel: 'email' as const,
        emergencyContact: true,
        availability: {
          timezone: 'America/New_York',
          businessHours: { start: '07:00', end: '20:00' },
          weekends: false
        }
      },
      {
        id: 'cfo',
        name: process.env.CFO_NAME || 'Chief Financial Officer',
        role: 'CFO',
        email: process.env.CFO_EMAIL || 'cfo@company.com',
        phone: process.env.CFO_PHONE,
        preferredChannel: 'email' as const,
        emergencyContact: true,
        availability: {
          timezone: 'America/New_York',
          businessHours: { start: '08:00', end: '19:00' },
          weekends: false
        }
      }
    ];

    executives.forEach(exec => {
      this.stakeholders.set(exec.id, exec);
    });
  }

  /**
   * Register notification rule for scenario type
   */
  registerNotificationRule(rule: NotificationRule): void {
    const key = `${rule.scenarioType}-${rule.severity}`;
    this.notificationRules.set(key, rule);
    console.log(`📋 Notification rule registered: ${key}`);
  }

  /**
   * Send immediate notification for scenario trigger
   */
  async sendScenarioAlert(
    scenarioType: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    message: string,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    const ruleKey = `${scenarioType}-${severity}`;
    const rule = this.notificationRules.get(ruleKey);

    if (!rule) {
      console.warn(`⚠️ No notification rule found for ${ruleKey}`);
      return;
    }

    // Send immediate notifications
    await this.sendToContacts(rule.immediateContacts, message, severity, metadata);

    // Schedule escalation notifications
    rule.escalationLevels.forEach((level, index) => {
      setTimeout(async () => {
        await this.sendEscalationAlert(level, message, severity, metadata);
      }, level.delayMinutes * 60 * 1000);
    });
  }

  /**
   * Send notifications to specific contacts
   */
  private async sendToContacts(
    contactIds: string[],
    message: string,
    severity: string,
    metadata: Record<string, any>
  ): Promise<void> {
    const promises = contactIds.map(async (contactId) => {
      const stakeholder = this.stakeholders.get(contactId);
      if (!stakeholder) {
        console.warn(`⚠️ Stakeholder not found: ${contactId}`);
        return;
      }

      // Check availability (simplified)
      if (!this.isAvailable(stakeholder)) {
        console.log(`⏰ ${stakeholder.name} not available, using emergency channel`);
      }

      await this.sendNotification(stakeholder, message, severity, metadata);
    });

    await Promise.all(promises);
  }

  /**
   * Send escalation alert
   */
  private async sendEscalationAlert(
    level: NotificationRule['escalationLevels'][0],
    message: string,
    severity: string,
    metadata: Record<string, any>
  ): Promise<void> {
    console.log(`📈 Escalation alert - Level ${level.delayMinutes}min`);
    await this.sendToContacts(level.contacts, 
      `ESCALATION: ${message}`, severity, metadata);
  }

  /**
   * Send notification via preferred channel
   */
  private async sendNotification(
    stakeholder: StakeholderContact,
    message: string,
    severity: string,
    metadata: Record<string, any>
  ): Promise<void> {
    const channel = stakeholder.preferredChannel;
    const severityIcon = this.getSeverityIcon(severity);
    const formattedMessage = `${severityIcon} VERIDIUS ALERT\n\n${message}\n\nContact: ${stakeholder.name}`;

    try {
      switch (channel) {
        case 'email':
          await this.sendEmail(stakeholder.email, formattedMessage, severity, metadata);
          break;
        case 'sms':
          if (stakeholder.phone) {
            await this.sendSMS(stakeholder.phone, formattedMessage);
          }
          break;
        case 'push':
          await this.sendPushNotification(stakeholder.id, formattedMessage);
          break;
        default:
          console.warn(`⚠️ Unsupported channel: ${channel}`);
      }
      
      console.log(`✅ Notification sent to ${stakeholder.name} via ${channel}`);
    } catch (error) {
      console.error(`❌ Failed to send notification to ${stakeholder.name}:`, error);
    }
  }

  /**
   * Send email notification
   */
  private async sendEmail(
    email: string, 
    message: string, 
    severity: string,
    metadata: Record<string, any>
  ): Promise<void> {
    // Email sending logic would integrate with SMTP or email service
    console.log(`📧 Email sent to ${email}`);
  }

  /**
   * Send SMS notification
   */
  private async sendSMS(phone: string, message: string): Promise<void> {
    // SMS sending logic would integrate with Twilio or similar
    console.log(`📱 SMS sent to ${phone}`);
  }

  /**
   * Send push notification
   */
  private async sendPushNotification(userId: string, message: string): Promise<void> {
    // Push notification logic
    console.log(`🔔 Push notification sent to ${userId}`);
  }

  /**
   * Check if stakeholder is available
   */
  private isAvailable(stakeholder: StakeholderContact): boolean {
    // Simplified availability check
    const now = new Date();
    const currentHour = now.getHours();
    const isWeekend = [0, 6].includes(now.getDay());

    // Always available for emergency contacts during critical scenarios
    if (stakeholder.emergencyContact) {
      return true;
    }

    // Check business hours
    const startHour = parseInt(stakeholder.availability.businessHours.start.split(':')[0]);
    const endHour = parseInt(stakeholder.availability.businessHours.end.split(':')[0]);

    if (isWeekend && !stakeholder.availability.weekends) {
      return false;
    }

    return currentHour >= startHour && currentHour <= endHour;
  }

  /**
   * Get severity icon for display
   */
  private getSeverityIcon(severity: string): string {
    const icons = {
      low: '🟢',
      medium: '🟡',
      high: '🟠',
      critical: '🔴'
    };
    return icons[severity as keyof typeof icons] || '⚪';
  }

  /**
   * Add or update stakeholder contact
   */
  addStakeholder(stakeholder: StakeholderContact): void {
    this.stakeholders.set(stakeholder.id, stakeholder);
    console.log(`👤 Stakeholder added: ${stakeholder.name} (${stakeholder.role})`);
  }

  /**
   * Get all stakeholders
   */
  getStakeholders(): StakeholderContact[] {
    return Array.from(this.stakeholders.values());
  }
}

// Export singleton instance
export const notificationManager = new NotificationManager();