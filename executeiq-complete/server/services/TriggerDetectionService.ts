import { MockSalesforceService, mockSalesforce, type OpportunityData } from './MockSalesforceService';

export interface TriggerAlert {
  id: string;
  dealId: string;
  dealName: string;
  accountName: string;
  amount: number;
  riskScore: number;
  triggers: string[];
  confidence: number;
  timestamp: Date;
  status: 'active' | 'resolved';
}

type AlertCallback = (alert: TriggerAlert) => void;

export class TriggerDetectionService {
  private salesforceService: MockSalesforceService;
  private monitoring = false;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private currentAlerts: Map<string, TriggerAlert> = new Map();
  private alertCallbacks: AlertCallback[] = [];

  constructor() {
    this.salesforceService = mockSalesforce;
  }

  onAlert(callback: AlertCallback) {
    this.alertCallbacks.push(callback);
  }

  private notifyAlerts(alert: TriggerAlert) {
    this.alertCallbacks.forEach((cb) => cb(alert));
  }

  async checkForTriggers(): Promise<TriggerAlert[]> {
    const deals = await this.salesforceService.getDeals();
    const alerts: TriggerAlert[] = [];

    for (const deal of deals) {
      const triggers = this.salesforceService.detectTriggers(deal);
      if (triggers.length > 0) {
        const riskScore = this.salesforceService.calculateDealRiskScore(deal);
        const confidence = Math.min(100, riskScore + 10);

        const alert: TriggerAlert = {
          id: `alert_${deal.id}_${Date.now()}`,
          dealId: deal.id,
          dealName: deal.dealName,
          accountName: deal.accountName,
          amount: deal.amount,
          riskScore,
          triggers,
          confidence: confidence / 100,
          timestamp: new Date(),
          status: 'active',
        };

        this.currentAlerts.set(deal.id, alert);
        alerts.push(alert);
        this.notifyAlerts(alert);
      }
    }

    return alerts;
  }

  startMonitoring(): void {
    if (this.monitoring) return;
    this.monitoring = true;
    console.log('[DETECT] Trigger Detection Service started');

    const interval = process.env.NODE_ENV === 'production' ? 900000 : 15000;

    this.monitoringInterval = setInterval(async () => {
      await this.checkForTriggers();
    }, interval);
  }

  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.monitoring = false;
    console.log('[DETECT] Trigger Detection Service stopped');
  }

  isMonitoring(): boolean {
    return this.monitoring;
  }

  getCurrentTriggers(): TriggerAlert[] {
    return Array.from(this.currentAlerts.values());
  }

  getStatus() {
    return {
      isMonitoring: this.monitoring,
      alertCount: this.currentAlerts.size,
      lastCheck: new Date(),
    };
  }
}

export const triggerDetectionService = new TriggerDetectionService();
