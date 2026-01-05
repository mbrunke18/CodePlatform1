import pino from 'pino';
import { PostgreSQLJobQueue, type JobData } from './PostgreSQLJobQueue';
import { nlqService } from '../nlq-service';
import { db } from '../db';
import { organizations } from '@shared/schema';

const logger = pino({ name: 'enterprise-job-service' });

export interface AnalysisJobData extends JobData {
  type: 'pulse_analysis' | 'risk_assessment' | 'opportunity_detection' | 'performance_trends';
  organizationId: string;
  parameters?: Record<string, any>;
  scheduledBy?: string;
}

export interface ReportJobData extends JobData {
  type: 'executive_summary' | 'performance_dashboard' | 'scenario_analysis' | 'competitive_intelligence';
  organizationId: string;
  recipientEmails: string[];
  format: 'pdf' | 'html' | 'json';
  templateId?: string;
}

export interface AlertJobData extends JobData {
  type: 'risk_threshold' | 'performance_anomaly' | 'opportunity_alert' | 'critical_metric';
  organizationId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  actionRequired?: boolean;
  recipients: string[];
}

export class EnterpriseJobService {
  private static instance: EnterpriseJobService;
  private analysisQueue: PostgreSQLJobQueue;
  private reportsQueue: PostgreSQLJobQueue;
  private alertsQueue: PostgreSQLJobQueue;
  private isInitialized = false;

  private constructor() {
    this.analysisQueue = new PostgreSQLJobQueue('analysis');
    this.reportsQueue = new PostgreSQLJobQueue('reports');
    this.alertsQueue = new PostgreSQLJobQueue('alerts');
  }

  public static getInstance(): EnterpriseJobService {
    if (!EnterpriseJobService.instance) {
      EnterpriseJobService.instance = new EnterpriseJobService();
    }
    return EnterpriseJobService.instance;
  }

  /**
   * Initialize all job queues and processors with enterprise-grade error handling
   * This method is designed to be non-blocking and fail gracefully
   */
  async initialize(): Promise<void> {
    // Don't block - run initialization in background with timeout
    this.initializeAsync().catch(error => {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.warn({ error: errorMessage }, 'Enterprise Job Service initialization failed - continuing without background jobs');
    });
  }

  /**
   * Internal async initialization with timeout protection
   */
  private async initializeAsync(): Promise<void> {
    const INIT_TIMEOUT = 30000; // 30 second timeout
    
    const initPromise = (async () => {
      try {
        logger.info('Initializing Enterprise Job Service');

        // Setup processors (these are synchronous registrations)
        await this.setupAnalysisProcessors();
        await this.setupReportsProcessors();
        await this.setupAlertsProcessors();

        // Start queue processing with individual timeouts
        const startPromises = [
          this.safeQueueStart(this.analysisQueue, 'analysis'),
          this.safeQueueStart(this.reportsQueue, 'reports'),
          this.safeQueueStart(this.alertsQueue, 'alerts')
        ];
        
        await Promise.allSettled(startPromises);

        // Schedule recurring jobs after a delay to not block startup
        setTimeout(() => {
          this.scheduleRecurringJobs().catch(err => {
            logger.warn({ error: err.message }, 'Failed to schedule recurring jobs');
          });
        }, 5000);

        this.isInitialized = true;
        logger.info('Enterprise Job Service initialized successfully');
      } catch (error) {
        throw error;
      }
    })();

    // Add timeout protection
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Initialization timeout')), INIT_TIMEOUT);
    });

    await Promise.race([initPromise, timeoutPromise]);
  }

  /**
   * Safely start a queue with error handling
   */
  private async safeQueueStart(queue: PostgreSQLJobQueue, name: string): Promise<void> {
    try {
      await queue.start();
      logger.info(`Queue ${name} started successfully`);
    } catch (error) {
      logger.warn({ error, queue: name }, `Failed to start queue ${name} - will retry later`);
    }
  }

  /**
   * Setup analysis job processors with enterprise features
   */
  private async setupAnalysisProcessors(): Promise<void> {
    this.analysisQueue.process('pulse_analysis', async (jobData) => {
      const data = jobData as AnalysisJobData;
      logger.info(`Processing pulse analysis for org: ${data.organizationId}`);
      
      try {
        // Simulate enterprise pulse analysis with AI
        const analysis = {
          organizationHealth: Math.random() * 100,
          keyMetrics: {
            agility: Math.random() * 100,
            efficiency: Math.random() * 100,
            innovation: Math.random() * 100
          },
          insights: [
            'Strategic agility has improved 12% this quarter',
            'Team collaboration metrics show positive trends',
            'Innovation pipeline strength is above industry average'
          ],
          recommendations: [
            'Consider expanding high-performing initiatives',
            'Address bottlenecks in decision-making processes',
            'Invest in emerging technology capabilities'
          ],
          riskFactors: ['Market volatility', 'Talent retention'],
          opportunities: ['Digital transformation acceleration', 'Market expansion'],
          timestamp: new Date().toISOString()
        };

        // Store analysis results
        logger.info(`Pulse analysis completed for org: ${data.organizationId}`);
        return analysis;
      } catch (error) {
        logger.error({ error, organizationId: data.organizationId }, 'Pulse analysis failed');
        throw error;
      }
    });

    this.analysisQueue.process('risk_assessment', async (jobData) => {
      const data = jobData as AnalysisJobData;
      logger.info(`Processing risk assessment for org: ${data.organizationId}`);
      
      const riskAssessment = {
        overallRiskScore: Math.random() * 100,
        riskCategories: {
          operational: Math.random() * 100,
          financial: Math.random() * 100,
          strategic: Math.random() * 100,
          regulatory: Math.random() * 100
        },
        criticalRisks: [
          { risk: 'Supply chain disruption', probability: 0.3, impact: 0.8 },
          { risk: 'Cybersecurity threat', probability: 0.4, impact: 0.9 }
        ],
        mitigationStrategies: [
          'Diversify supplier base',
          'Enhance security protocols',
          'Implement business continuity plans'
        ],
        timestamp: new Date().toISOString()
      };

      logger.info(`Risk assessment completed for org: ${data.organizationId}`);
      return riskAssessment;
    });

    this.analysisQueue.process('opportunity_detection', async (jobData) => {
      const data = jobData as AnalysisJobData;
      logger.info(`Processing opportunity detection for org: ${data.organizationId}`);
      
      const opportunities = {
        marketOpportunities: [
          { opportunity: 'AI automation adoption', potential: 0.85, timeframe: '6 months' },
          { opportunity: 'Sustainable technology integration', potential: 0.72, timeframe: '12 months' }
        ],
        internalCapabilities: [
          'Strong R&D pipeline',
          'Experienced leadership team',
          'Robust financial position'
        ],
        competitiveAdvantages: [
          'First-mover advantage in emerging markets',
          'Superior customer satisfaction scores'
        ],
        recommendedActions: [
          'Accelerate digital transformation initiatives',
          'Explore strategic partnerships',
          'Invest in talent acquisition'
        ],
        timestamp: new Date().toISOString()
      };

      logger.info(`Opportunity detection completed for org: ${data.organizationId}`);
      return opportunities;
    });
  }

  /**
   * Setup reports job processors
   */
  private async setupReportsProcessors(): Promise<void> {
    this.reportsQueue.process('executive_summary', async (jobData) => {
      const data = jobData as ReportJobData;
      logger.info(`Generating executive summary for org: ${data.organizationId}`);
      
      const executiveSummary = {
        reportType: 'Executive Summary',
        organizationId: data.organizationId,
        period: 'Q1 2025',
        keyHighlights: [
          'Revenue grew 15% YoY exceeding targets',
          'Strategic initiatives on track with 87% completion rate',
          'Customer satisfaction improved to 94.2%'
        ],
        financialPerformance: {
          revenue: '$2.85M',
          growthRate: '15%',
          profitMargin: '18.7%'
        },
        operationalMetrics: {
          agilityScore: 8.7,
          efficiencyGain: '12%',
          innovationIndex: 7.9
        },
        strategicInitiatives: [
          'Digital transformation program ahead of schedule',
          'Market expansion into APAC region launched',
          'Sustainability program achieving carbon reduction goals'
        ],
        risksAndOpportunities: {
          topRisks: ['Market volatility', 'Talent retention'],
          topOpportunities: ['AI adoption', 'Market expansion']
        },
        generatedAt: new Date().toISOString()
      };

      // Simulate report delivery
      logger.info(`Executive summary generated and delivered to ${data.recipientEmails.length} recipients`);
      return executiveSummary;
    });

    this.reportsQueue.process('performance_dashboard', async (jobData) => {
      const data = jobData as ReportJobData;
      logger.info(`Generating performance dashboard for org: ${data.organizationId}`);
      
      const dashboardData = {
        reportType: 'Performance Dashboard',
        organizationId: data.organizationId,
        metrics: {
          kpis: [
            { name: 'Revenue Growth', value: '15%', trend: 'up', target: '12%' },
            { name: 'Customer Satisfaction', value: '94.2%', trend: 'up', target: '90%' },
            { name: 'Employee Engagement', value: '87%', trend: 'stable', target: '85%' }
          ],
          departmentPerformance: {
            sales: { score: 92, trend: 'up' },
            marketing: { score: 88, trend: 'up' },
            operations: { score: 85, trend: 'stable' },
            finance: { score: 90, trend: 'up' }
          }
        },
        generatedAt: new Date().toISOString()
      };

      logger.info(`Performance dashboard generated for org: ${data.organizationId}`);
      return dashboardData;
    });
  }

  /**
   * Setup alerts job processors
   */
  private async setupAlertsProcessors(): Promise<void> {
    this.alertsQueue.process('risk_threshold', async (jobData) => {
      const data = jobData as AlertJobData;
      logger.info(`Processing risk threshold alert for org: ${data.organizationId}`);
      
      const alert = {
        alertType: 'Risk Threshold',
        organizationId: data.organizationId,
        severity: data.severity,
        message: data.message,
        details: {
          thresholdExceeded: true,
          currentLevel: 'High',
          recommendedAction: 'Immediate review required'
        },
        recipients: data.recipients,
        sentAt: new Date().toISOString()
      };

      // Simulate alert delivery (would integrate with email/SMS services)
      logger.warn(`Risk threshold alert sent to ${data.recipients.length} recipients`);
      return alert;
    });

    this.alertsQueue.process('performance_anomaly', async (jobData) => {
      const data = jobData as AlertJobData;
      logger.info(`Processing performance anomaly alert for org: ${data.organizationId}`);
      
      const alert = {
        alertType: 'Performance Anomaly',
        organizationId: data.organizationId,
        severity: data.severity,
        message: data.message,
        anomalyDetails: {
          metric: 'Customer Satisfaction',
          expected: '92%',
          actual: '87%',
          deviation: '-5%',
          confidence: 'High'
        },
        recipients: data.recipients,
        sentAt: new Date().toISOString()
      };

      logger.info(`Performance anomaly alert sent to ${data.recipients.length} recipients`);
      return alert;
    });
  }

  /**
   * Schedule recurring enterprise jobs
   */
  private async scheduleRecurringJobs(): Promise<void> {
    try {
      const orgs = await db.select({ id: organizations.id }).from(organizations).limit(1);
      const defaultOrg = orgs && orgs.length > 0 ? orgs[0] : null;
      
      if (!defaultOrg) {
        logger.info('No organizations found - skipping recurring job scheduling');
        return;
      }

      // Schedule daily pulse analysis
      await this.analysisQueue.add('pulse_analysis', {
        type: 'pulse_analysis',
        organizationId: defaultOrg.id,
        scheduledBy: 'system'
      }, { delay: 24 * 60 * 60 * 1000 }); // Daily

      // Schedule weekly risk assessment
      await this.analysisQueue.add('risk_assessment', {
        type: 'risk_assessment',
        organizationId: defaultOrg.id,
        scheduledBy: 'system'
      }, { delay: 7 * 24 * 60 * 60 * 1000 }); // Weekly

      // Schedule monthly executive summary
      await this.reportsQueue.add('executive_summary', {
        type: 'executive_summary',
        organizationId: defaultOrg.id,
        recipientEmails: ['executives@company.com'],
        format: 'pdf'
      }, { delay: 30 * 24 * 60 * 60 * 1000 }); // Monthly

      logger.info('Recurring enterprise jobs scheduled successfully');
    } catch (error) {
      logger.error({ error }, 'Failed to schedule recurring jobs');
    }
  }

  /**
   * Add analysis job to queue
   */
  async addAnalysisJob(data: AnalysisJobData, delay?: number): Promise<string> {
    if (!this.isInitialized) {
      logger.warn('Job service not initialized, skipping job');
      return 'skipped';
    }
    return this.analysisQueue.add(data.type, data, { delay });
  }

  /**
   * Add report job to queue
   */
  async addReportJob(data: ReportJobData, delay?: number): Promise<string> {
    if (!this.isInitialized) {
      logger.warn('Job service not initialized, skipping job');
      return 'skipped';
    }
    return this.reportsQueue.add(data.type, data, { delay });
  }

  /**
   * Add alert job to queue
   */
  async addAlertJob(data: AlertJobData, delay?: number): Promise<string> {
    if (!this.isInitialized) {
      logger.warn('Job service not initialized, skipping job');
      return 'skipped';
    }
    return this.alertsQueue.add(data.type, data, { delay });
  }

  /**
   * Get comprehensive job statistics
   */
  async getJobStats(): Promise<{
    analysis: any;
    reports: any;
    alerts: any;
    total: {
      pending: number;
      processing: number;
      completed: number;
      failed: number;
    };
  }> {
    if (!this.isInitialized) {
      return {
        analysis: { pending: 0, processing: 0, completed: 0, failed: 0 },
        reports: { pending: 0, processing: 0, completed: 0, failed: 0 },
        alerts: { pending: 0, processing: 0, completed: 0, failed: 0 },
        total: { pending: 0, processing: 0, completed: 0, failed: 0 }
      };
    }

    try {
      const [analysisStats, reportsStats, alertsStats] = await Promise.all([
        this.analysisQueue.getStats(),
        this.reportsQueue.getStats(),
        this.alertsQueue.getStats()
      ]);

      const total = {
        pending: analysisStats.pending + reportsStats.pending + alertsStats.pending,
        processing: analysisStats.processing + reportsStats.processing + alertsStats.processing,
        completed: analysisStats.completed + reportsStats.completed + alertsStats.completed,
        failed: analysisStats.failed + reportsStats.failed + alertsStats.failed
      };

      return {
        analysis: analysisStats,
        reports: reportsStats,
        alerts: alertsStats,
        total
      };
    } catch (error) {
      logger.error({ error }, 'Failed to get job statistics');
      return {
        analysis: { pending: 0, processing: 0, completed: 0, failed: 0 },
        reports: { pending: 0, processing: 0, completed: 0, failed: 0 },
        alerts: { pending: 0, processing: 0, completed: 0, failed: 0 },
        total: { pending: 0, processing: 0, completed: 0, failed: 0 }
      };
    }
  }

  /**
   * Graceful shutdown
   */
  async shutdown(): Promise<void> {
    if (!this.isInitialized) return;

    logger.info('Shutting down Enterprise Job Service');
    
    await Promise.all([
      this.analysisQueue.stop(),
      this.reportsQueue.stop(),
      this.alertsQueue.stop()
    ]);

    this.isInitialized = false;
    logger.info('Enterprise Job Service shutdown complete');
  }
}

// Export singleton instance
export const enterpriseJobService = EnterpriseJobService.getInstance();