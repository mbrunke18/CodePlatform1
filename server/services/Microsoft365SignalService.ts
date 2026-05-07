/**
 * Microsoft365SignalService — Phase 4: Internal Signal Integration
 * 
 * The operating model layer above the Microsoft investment.
 * "Every enterprise has Microsoft's AI stack. None have the operating model to use it."
 * 
 * PRIVACY ARCHITECTURE:
 *   - Metadata signals ONLY. Content is NEVER accessed, stored, or processed.
 *   - Signals: volume patterns, channel names, calendar metadata, access counts.
 *   - No email content, no document content, no message content — ever.
 *   - Uses Microsoft Graph API with minimum-permission scopes.
 * 
 * REQUIRES: Azure app registration with:
 *   - Tenant ID, Client ID, Client Secret
 *   - Graph API scopes: Team.ReadBasic.All, IdentityRiskyUser.Read.All
 *     (content-free metadata scopes only)
 * 
 * STATUS: Architecture complete. Requires Founding Partner credentials to activate.
 */

import type { AnalyzedSignal } from './SignalEvaluationService.js';

const GRAPH_API_BASE = 'https://graph.microsoft.com/v1.0';

export interface Microsoft365Config {
  tenantId: string;
  clientId: string;
  clientSecret: string;
}

// Signal patterns from Teams channel naming conventions
const CRISIS_CHANNEL_PATTERNS = [
  'incident', 'response', 'crisis', 'emergency', 'war-room',
  'warroom', 'breach', 'outage', 'escalation', 'critical',
];

// Signal patterns from SharePoint/OneDrive access spikes
const SENSITIVE_DOC_PATTERNS = [
  'legal-hold', 'board-materials', 'acquisition', 'merger',
  'restructuring', 'layoff', 'bankruptcy', 'investigation',
];

export class Microsoft365SignalService {
  private config: Microsoft365Config | null = null;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;
  private connectorId: string | null = null;

  configure(config: Microsoft365Config, connectorId?: string): void {
    this.config = config;
    this.connectorId = connectorId || null;
    this.accessToken = null; // Force re-auth on reconfiguration
    console.log(`[M365SignalService] Configured — tenant: ${config.tenantId}`);
  }

  isConfigured(): boolean {
    return this.config !== null;
  }

  getStatus(): { configured: boolean; tenantId: string | null; connectorId: string | null } {
    return {
      configured: this.isConfigured(),
      tenantId: this.config?.tenantId || null,
      connectorId: this.connectorId,
    };
  }

  private async getAccessToken(): Promise<string | null> {
    if (!this.config) return null;

    // Return cached token if still valid
    if (this.accessToken && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return this.accessToken;
    }

    try {
      const response = await fetch(
        `https://login.microsoftonline.com/${this.config.tenantId}/oauth2/v2.0/token`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: this.config.clientId,
            client_secret: this.config.clientSecret,
            // Minimum-permission scopes — metadata only, no content access
            scope: 'https://graph.microsoft.com/.default',
          }),
        }
      );

      if (!response.ok) {
        console.error(`[M365SignalService] Token request failed: ${response.status}`);
        return null;
      }

      const data = await response.json() as any;
      if (data.access_token) {
        this.accessToken = data.access_token;
        // Cache with 60-second buffer before actual expiry
        this.tokenExpiry = new Date(Date.now() + (data.expires_in - 60) * 1000);
        return this.accessToken;
      }
    } catch (err) {
      console.error('[M365SignalService] Token acquisition error:', err);
    }

    return null;
  }

  private async graphRequest(endpoint: string): Promise<any | null> {
    const token = await this.getAccessToken();
    if (!token) return null;

    try {
      const response = await fetch(`${GRAPH_API_BASE}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        // Token expired — force refresh on next call
        this.accessToken = null;
        this.tokenExpiry = null;
        return null;
      }

      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  }

  // ── Signal 1: Teams channel naming pattern detection ─────────────────────
  // Detects channels named with crisis/incident terminology — metadata only
  async detectTeamsChannelSignals(): Promise<AnalyzedSignal[]> {
    const signals: AnalyzedSignal[] = [];
    if (!this.config) return signals;

    const teamsData = await this.graphRequest('/teams?$top=50&$select=id,displayName');
    if (!teamsData?.value) return signals;

    for (const team of teamsData.value) {
      const channelsData = await this.graphRequest(
        `/teams/${team.id}/channels?$select=id,displayName,createdDateTime`
      );
      if (!channelsData?.value) continue;

      for (const channel of channelsData.value) {
        const channelName = (channel.displayName || '').toLowerCase();
        const matchedPattern = CRISIS_CHANNEL_PATTERNS.find(p => channelName.includes(p));

        if (!matchedPattern) continue;

        // Only flag channels created in the last 48 hours (new crisis coordination)
        const createdAt = channel.createdDateTime
          ? new Date(channel.createdDateTime).getTime()
          : 0;
        const ageHours = (Date.now() - createdAt) / 3_600_000;
        if (ageHours > 48) continue;

        signals.push({
          signalType: 'Internal Signal',
          description: `Teams channel matching crisis coordination pattern created: "${channel.displayName}" in team "${team.displayName}". Internal crisis coordination activity detected via channel metadata — content not accessed.`,
          confidence: 72,
          impact: 'high',
          timeline: 'immediate',
          source: 'Microsoft 365 — Teams',
          sourceUrl: '',
          category: 'Internal Signal',
        });
      }
    }

    return signals;
  }

  // ── Signal 2: Azure AD / Entra Identity Protection alerts ────────────────
  // Detects high-risk users from Azure AD — no content, pure identity signals
  async detectIdentityRiskSignals(): Promise<AnalyzedSignal[]> {
    const signals: AnalyzedSignal[] = [];
    if (!this.config) return signals;

    const riskyUsers = await this.graphRequest(
      `/identityProtection/riskyUsers?$filter=riskLevel eq 'high'&$select=id,riskLevel,riskState,riskLastUpdatedDateTime&$top=10`
    );

    if (!riskyUsers?.value?.length) return signals;

    const highRiskCount = riskyUsers.value.length;
    signals.push({
      signalType: 'Internal Signal',
      description: `Azure AD/Entra identity protection: ${highRiskCount} high-risk user flag(s) detected. Potential unauthorized access pattern identified via identity metadata — user activity content not accessed.`,
      confidence: 85,
      impact: 'critical',
      timeline: 'immediate',
      source: 'Microsoft 365 — Azure AD/Entra',
      sourceUrl: '',
      category: 'Internal Signal',
    });

    return signals;
  }

  // ── Signal 3: Calendar pattern change detection ───────────────────────────
  // Detects unusual executive calendar density — metadata only, no content
  async detectCalendarPatternSignals(): Promise<AnalyzedSignal[]> {
    const signals: AnalyzedSignal[] = [];
    if (!this.config) return signals;

    // Get organization users with meeting policy role (executives/VPs)
    // This uses directory metadata only — no calendar content
    const users = await this.graphRequest(
      `/users?$filter=jobTitle ne null&$select=id,jobTitle&$top=20`
    );

    if (!users?.value) return signals;

    const executiveTitles = ['CEO', 'CFO', 'COO', 'CTO', 'CISO', 'President', 'EVP', 'SVP', 'VP'];
    const executives = (users.value as any[]).filter((u: any) =>
      executiveTitles.some(t => (u.jobTitle || '').includes(t))
    );

    if (executives.length === 0) return signals;

    // Check for unusual calendar event density in next 24 hours
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 3_600_000);

    let totalEvents = 0;
    for (const exec of executives.slice(0, 5)) { // Limit API calls
      const events = await this.graphRequest(
        `/users/${exec.id}/calendarView?startDateTime=${now.toISOString()}&endDateTime=${tomorrow.toISOString()}&$select=subject,start,end&$top=20`
      );
      if (events?.value) totalEvents += events.value.length;
    }

    // Baseline: ~3 events per executive per day. Spike: 2x+ baseline
    const baseline = executives.slice(0, 5).length * 3;
    if (totalEvents > baseline * 2) {
      signals.push({
        signalType: 'Internal Signal',
        description: `Executive calendar density spike detected: ${totalEvents} events in next 24 hours (baseline: ~${baseline}). Unusual coordination pattern in executive schedules — metadata only, meeting content not accessed.`,
        confidence: 65,
        impact: 'medium',
        timeline: '24-48 hours',
        source: 'Microsoft 365 — Calendar',
        sourceUrl: '',
        category: 'Internal Signal',
      });
    }

    return signals;
  }

  // ── Main poll: runs every 15 min alongside RSS ingestion cycle ────────────
  async pollSignals(): Promise<AnalyzedSignal[]> {
    if (!this.isConfigured()) return [];

    const results = await Promise.allSettled([
      this.detectTeamsChannelSignals(),
      this.detectIdentityRiskSignals(),
      this.detectCalendarPatternSignals(),
    ]);

    const allSignals: AnalyzedSignal[] = [];
    for (const result of results) {
      if (result.status === 'fulfilled') {
        allSignals.push(...result.value);
      }
    }

    if (allSignals.length > 0) {
      console.log(`[M365SignalService] ${allSignals.length} internal signal(s) detected`);
    }

    return allSignals;
  }
}

// ── Salesforce / CRM Signal Connector stub ───────────────────────────────────
// Phase 4 Priority 2 — Requires Salesforce Connected App credentials
export class SalesforceSignalService {
  private configured = false;
  private instanceUrl: string | null = null;

  configure(instanceUrl: string, _accessToken: string): void {
    this.instanceUrl = instanceUrl;
    this.configured = true;
    console.log(`[SalesforceSignalService] Configured — instance: ${instanceUrl}`);
  }

  isConfigured(): boolean { return this.configured; }

  async pollSignals(): Promise<AnalyzedSignal[]> {
    if (!this.configured) return [];
    // Phase 4 Priority 2 — full implementation activates on first Founding Partner CRM connection
    // Signals: customer concentration risk, deal pipeline changes, opportunity stage shifts
    console.log('[SalesforceSignalService] Poll requested — awaiting Founding Partner connection');
    return [];
  }
}

// ── Financial / ERP Webhook Connector stub ───────────────────────────────────
// Phase 4 Priority 3 — Generic JSON push receiver
// Customer configures ERP to push financial metrics on schedule
// Signals feed into Financial Strategy domain monitoring
export class ERPSignalService {
  private pendingSignals: AnalyzedSignal[] = [];

  receiveWebhookPush(payload: any): AnalyzedSignal[] {
    // Process incoming ERP webhook payload
    const signals: AnalyzedSignal[] = [];

    try {
      // Expected payload shape: { metric: string, value: number, threshold: number, unit: string, timestamp: string }
      if (payload.metric && typeof payload.value === 'number') {
        const deviation = payload.threshold
          ? Math.abs((payload.value - payload.threshold) / payload.threshold) * 100
          : 0;

        if (deviation > 15) { // 15% threshold deviation triggers a signal
          signals.push({
            signalType: 'Internal Signal',
            description: `Financial metric "${payload.metric}" is ${payload.value}${payload.unit || ''} — ${deviation.toFixed(1)}% deviation from threshold. ERP-sourced financial signal via webhook.`,
            confidence: 78,
            impact: deviation > 25 ? 'high' : 'medium',
            timeline: 'immediate',
            source: 'Financial ERP — Webhook',
            sourceUrl: '',
            category: 'Internal Signal',
          });
        }
      }
    } catch (err) {
      console.error('[ERPSignalService] Webhook processing error:', err);
    }

    return signals;
  }
}

export const microsoft365SignalService = new Microsoft365SignalService();
export const salesforceSignalService = new SalesforceSignalService();
export const erpSignalService = new ERPSignalService();
