export interface StandardTaskPayload {
  title: string;
  description: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  phase?: string;
  owner?: string;
  metadata?: Record<string, any>;
}

export interface StandardNotificationPayload {
  title: string;
  message: string;
  recipients?: string[];
  severity?: 'info' | 'warning' | 'error' | 'success';
  metadata?: Record<string, any>;
  blocks?: any[]; // For rich message formatting (Slack Block Kit, etc.)
}

export interface AdapterResult {
  success: boolean;
  provider: string;
  action: string;
  detail?: any;
  error?: string;
}

export interface IntegrationConfig {
  accessToken: string;
  config: Record<string, any>;
}

export interface IntegrationAdapter {
  vendor: string;
  createTask(payload: StandardTaskPayload, config: IntegrationConfig): Promise<AdapterResult>;
  sendNotification(payload: StandardNotificationPayload, config: IntegrationConfig): Promise<AdapterResult>;
  testConnection(config: IntegrationConfig): Promise<boolean>;
}
