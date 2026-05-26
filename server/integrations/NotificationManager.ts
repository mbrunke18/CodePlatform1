/**
 * Executive Notification Manager
 * Multi-channel stakeholder alerts: Email (Resend), SMS (Twilio), Push (Socket.IO)
 * SMS falls back to email when Twilio is not configured.
 * Push delivers real-time in-app alerts via Socket.IO.
 */

import { Resend } from 'resend';
import { wsService } from '../services/WebSocketService.js';

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
    businessHours: { start: string; end: string };
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
  immediateContacts: string[];
  escalationLevels: {
    delayMinutes: number;
    contacts: string[];
    channels: string[];
  }[];
}

const RESEND_FROM = 'Readiness OS <pilot@vaughnmartin.com>';

function buildEmailHtml(
  stakeholder: StakeholderContact,
  message: string,
  severity: string,
  metadata: Record<string, any>
): string {
  const severityColors: Record<string, string> = {
    low: '#2B8A6E',
    medium: '#C9A84C',
    high: '#E07B39',
    critical: '#C0392B',
  };
  const severityLabels: Record<string, string> = {
    low: 'LOW',
    medium: 'MEDIUM',
    high: 'HIGH',
    critical: 'CRITICAL',
  };
  const accentColor = severityColors[severity] || '#C9A84C';
  const severityLabel = severityLabels[severity] || severity.toUpperCase();
  const playbookName = metadata?.playbookName || metadata?.scenarioType || 'Strategic Protocol';
  const appUrl = process.env.APP_URL || 'https://vaughnmartin.com';

  return `
    <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background:#f8f7f4;padding:40px 0;">
      <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:2px;overflow:hidden;border:1px solid #e8e4dc;">
        <div style="background:#0A0F2E;padding:32px 36px;border-bottom:3px solid ${accentColor};">
          <div style="color:${accentColor};font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:6px;">Readiness OS · Executive Alert</div>
          <div style="color:#ffffff;font-size:20px;font-weight:700;line-height:1.3;">${playbookName}</div>
          <div style="display:inline-block;margin-top:10px;background:${accentColor};color:#0A0F2E;font-size:10px;font-weight:800;letter-spacing:2px;padding:4px 10px;border-radius:2px;">${severityLabel} SEVERITY</div>
        </div>
        <div style="padding:32px 36px;">
          <p style="color:#0A0F2E;font-size:15px;line-height:1.6;margin:0 0 24px;">
            <strong>${stakeholder.name}</strong> — you have been notified as part of a pre-staged Readiness Protocol activation.
          </p>
          <div style="background:#f0ede4;border-left:3px solid ${accentColor};padding:16px 20px;border-radius:0 2px 2px 0;margin-bottom:28px;">
            <div style="color:#0A0F2E;font-size:14px;line-height:1.6;">${message}</div>
          </div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#666;font-size:12px;width:40%;text-transform:uppercase;letter-spacing:0.5px;">Your Role</td>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#0A0F2E;font-size:13px;font-weight:600;">${stakeholder.role}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Execution Window</td>
              <td style="padding:10px 0;border-bottom:1px solid #e8e4dc;color:#2B8A6E;font-size:13px;font-weight:700;">12 minutes</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Status</td>
              <td style="padding:10px 0;color:${accentColor};font-size:13px;font-weight:700;">ACTIVE — Pre-staged response underway</td>
            </tr>
          </table>
          <div style="text-align:center;">
            <a href="${appUrl}/command-center" style="display:inline-block;background:#0A0F2E;color:#ffffff;text-decoration:none;padding:14px 36px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">View Live Execution →</a>
          </div>
        </div>
        <div style="background:#f8f7f4;padding:18px 36px;border-top:1px solid #e8e4dc;text-align:center;">
          <div style="color:#999;font-size:11px;">Generated automatically by Readiness OS when a Readiness Protocol was activated. AI monitors. Executives authorize.</div>
        </div>
      </div>
    </div>
  `;
}

function buildSmsText(
  stakeholder: StakeholderContact,
  message: string,
  severity: string,
  metadata: Record<string, any>
): string {
  const playbookName = metadata?.playbookName || metadata?.scenarioType || 'Strategic Protocol';
  const appUrl = process.env.APP_URL || 'https://vaughnmartin.com';
  return `Readiness OS [${severity.toUpperCase()}] ${stakeholder.name} — ${playbookName} activated. Your role: ${stakeholder.role}. Execution window: 12 minutes. View: ${appUrl}/command-center`;
}

export class NotificationManager {
  private stakeholders: Map<string, StakeholderContact> = new Map();
  private channels: Map<string, NotificationChannel> = new Map();
  private notificationRules: Map<string, NotificationRule> = new Map();

  constructor() {
    this.initializeDefaultChannels();
    this.loadExecutiveContacts();
  }

  private initializeDefaultChannels(): void {
    this.channels.set('email', {
      type: 'email',
      enabled: !!process.env.RESEND_API_KEY,
      config: { apiKey: process.env.RESEND_API_KEY },
    });

    this.channels.set('sms', {
      type: 'sms',
      enabled: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER),
      config: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        fromNumber: process.env.TWILIO_PHONE_NUMBER,
      },
    });

    this.channels.set('push', {
      type: 'push',
      enabled: true,
      config: {},
    });

    this.channels.set('slack', {
      type: 'slack',
      enabled: !!process.env.SLACK_WEBHOOK_URL,
      config: { webhookUrl: process.env.SLACK_WEBHOOK_URL, channel: '#executive-alerts' },
    });
  }

  private loadExecutiveContacts(): void {
    const executives = [
      {
        id: 'ceo',
        name: process.env.CEO_NAME || 'Chief Executive Officer',
        role: 'CEO',
        email: process.env.CEO_EMAIL || 'ceo@company.com',
        phone: process.env.CEO_PHONE,
        preferredChannel: 'sms' as const,
        emergencyContact: true,
        availability: { timezone: 'America/New_York', businessHours: { start: '06:00', end: '22:00' }, weekends: true },
      },
      {
        id: 'coo',
        name: process.env.COO_NAME || 'Chief Operating Officer',
        role: 'COO',
        email: process.env.COO_EMAIL || 'coo@company.com',
        phone: process.env.COO_PHONE,
        preferredChannel: 'email' as const,
        emergencyContact: true,
        availability: { timezone: 'America/New_York', businessHours: { start: '07:00', end: '20:00' }, weekends: false },
      },
      {
        id: 'cfo',
        name: process.env.CFO_NAME || 'Chief Financial Officer',
        role: 'CFO',
        email: process.env.CFO_EMAIL || 'cfo@company.com',
        phone: process.env.CFO_PHONE,
        preferredChannel: 'email' as const,
        emergencyContact: true,
        availability: { timezone: 'America/New_York', businessHours: { start: '08:00', end: '19:00' }, weekends: false },
      },
    ];
    executives.forEach(exec => this.stakeholders.set(exec.id, exec));
  }

  registerNotificationRule(rule: NotificationRule): void {
    const key = `${rule.scenarioType}-${rule.severity}`;
    this.notificationRules.set(key, rule);
    console.log(`📋 Notification rule registered: ${key}`);
  }

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
    await this.sendToContacts(rule.immediateContacts, message, severity, metadata);
    rule.escalationLevels.forEach(level => {
      setTimeout(async () => {
        await this.sendEscalationAlert(level, message, severity, metadata);
      }, level.delayMinutes * 60 * 1000);
    });
  }

  private async sendToContacts(
    contactIds: string[],
    message: string,
    severity: string,
    metadata: Record<string, any>
  ): Promise<void> {
    await Promise.all(
      contactIds.map(async contactId => {
        const stakeholder = this.stakeholders.get(contactId);
        if (!stakeholder) {
          console.warn(`⚠️ Stakeholder not found: ${contactId}`);
          return;
        }
        await this.sendNotification(stakeholder, message, severity, metadata);
      })
    );
  }

  private async sendEscalationAlert(
    level: NotificationRule['escalationLevels'][0],
    message: string,
    severity: string,
    metadata: Record<string, any>
  ): Promise<void> {
    console.log(`📈 Escalation alert — ${level.delayMinutes}min threshold`);
    await this.sendToContacts(level.contacts, `ESCALATION: ${message}`, severity, metadata);
  }

  private async sendNotification(
    stakeholder: StakeholderContact,
    message: string,
    severity: string,
    metadata: Record<string, any>
  ): Promise<void> {
    const channel = stakeholder.preferredChannel;
    try {
      switch (channel) {
        case 'email':
          await this.sendEmail(stakeholder, message, severity, metadata);
          break;
        case 'sms':
          await this.sendSMS(stakeholder, message, severity, metadata);
          break;
        case 'push':
          await this.sendPush(stakeholder, message, severity, metadata);
          break;
        case 'voice':
          // Voice calls require Twilio Programmable Voice — routing to email
          console.log(`🔊 Voice not yet configured for ${stakeholder.name} — routing to email`);
          await this.sendEmail(stakeholder, message, severity, metadata);
          break;
        default:
          console.warn(`⚠️ Unknown channel "${channel}" for ${stakeholder.name} — routing to email`);
          await this.sendEmail(stakeholder, message, severity, metadata);
      }
      console.log(`✅ Notification delivered to ${stakeholder.name} via ${channel}`);
    } catch (error) {
      console.error(`❌ Notification failed for ${stakeholder.name} via ${channel}:`, error);
      if (channel !== 'email') {
        console.log(`↩️  Falling back to email for ${stakeholder.name}`);
        await this.sendEmail(stakeholder, message, severity, metadata).catch(e =>
          console.error(`❌ Email fallback also failed for ${stakeholder.name}:`, e)
        );
      }
    }
  }

  // ─── EMAIL via Resend ─────────────────────────────────────────────────────

  private async sendEmail(
    stakeholder: StakeholderContact,
    message: string,
    severity: string,
    metadata: Record<string, any>
  ): Promise<void> {
    const apiKey = process.env.RESEND_API_KEY || process.env.Resend_API_Key;
    if (!apiKey) {
      console.warn(`⚠️ RESEND_API_KEY not set — email not sent to ${stakeholder.email}`);
      return;
    }
    const resend = new Resend(apiKey);
    const playbookName = metadata?.playbookName || metadata?.scenarioType || 'Strategic Protocol';
    const { error } = await resend.emails.send({
      from: RESEND_FROM,
      replyTo: 'pilot@vaughnmartin.com',
      to: [stakeholder.email],
      subject: `Readiness OS [${severity.toUpperCase()}] — ${playbookName} Activated`,
      html: buildEmailHtml(stakeholder, message, severity, metadata),
    });
    if (error) throw new Error(`Resend error: ${JSON.stringify(error)}`);
    console.log(`📧 Email sent to ${stakeholder.name} <${stakeholder.email}>`);
  }

  // ─── SMS via Twilio ───────────────────────────────────────────────────────

  private async sendSMS(
    stakeholder: StakeholderContact,
    message: string,
    severity: string,
    metadata: Record<string, any>
  ): Promise<void> {
    const { accountSid, authToken, fromNumber } = {
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      fromNumber: process.env.TWILIO_PHONE_NUMBER,
    };

    if (!accountSid || !authToken || !fromNumber) {
      console.warn(`⚠️ Twilio not configured — falling back to email for ${stakeholder.name}`);
      await this.sendEmail(stakeholder, message, severity, metadata);
      return;
    }

    if (!stakeholder.phone) {
      console.warn(`⚠️ No phone number for ${stakeholder.name} — falling back to email`);
      await this.sendEmail(stakeholder, message, severity, metadata);
      return;
    }

    const twilio = (await import('twilio')).default;
    const client = twilio(accountSid, authToken);
    const body = buildSmsText(stakeholder, message, severity, metadata);

    await client.messages.create({
      from: fromNumber,
      to: stakeholder.phone,
      body,
    });
    console.log(`📱 SMS sent to ${stakeholder.name} (${stakeholder.phone})`);
  }

  // ─── PUSH via Socket.IO ───────────────────────────────────────────────────

  private async sendPush(
    stakeholder: StakeholderContact,
    message: string,
    severity: string,
    metadata: Record<string, any>
  ): Promise<void> {
    const playbookName = metadata?.playbookName || metadata?.scenarioType || 'Strategic Protocol';

    const payload = {
      type: 'executive-alert',
      severity,
      title: `${playbookName} Activated`,
      body: message,
      role: stakeholder.role,
      stakeholderName: stakeholder.name,
      executionWindow: '12 minutes',
      link: '/command-center',
      timestamp: new Date().toISOString(),
    };

    // Emit to user-specific room (stakeholder must be connected with their userId)
    wsService.sendToUser(stakeholder.id, 'readiness-alert', payload);
    console.log(`🔔 Push notification emitted to ${stakeholder.name} (user-${stakeholder.id})`);

    // Also send email in parallel for push — push is best-effort (requires active browser session)
    await this.sendEmail(stakeholder, message, severity, metadata).catch(() => {});
  }

  // ─── Public helpers ───────────────────────────────────────────────────────

  addStakeholder(stakeholder: StakeholderContact): void {
    this.stakeholders.set(stakeholder.id, stakeholder);
    console.log(`👤 Stakeholder registered: ${stakeholder.name} (${stakeholder.role}) — channel: ${stakeholder.preferredChannel}`);
  }

  getStakeholders(): StakeholderContact[] {
    return Array.from(this.stakeholders.values());
  }

  getChannelStatus(): Record<string, boolean> {
    return {
      email: !!process.env.RESEND_API_KEY,
      sms: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER),
      push: true,
      slack: !!process.env.SLACK_WEBHOOK_URL,
    };
  }
}

export const notificationManager = new NotificationManager();
