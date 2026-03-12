import { db } from '../db';
import { backgroundJobs } from '@shared/schema';
import { eq } from 'drizzle-orm';
import pino from 'pino';
import { playbookLearningService } from './PlaybookLearningService';

const logger = pino({ name: 'background-job-service' });

export interface QueueJobParams {
  queueName: string;
  jobType: string;
  data: any;
  priority?: number;
  maxRetries?: number;
}

/**
 * BackgroundJobService - Simple PostgreSQL-based job queue
 * 
 * Features:
 * - Queue jobs for async processing
 * - Automatic retry logic
 * - Priority-based execution
 * - Job status tracking
 * - Playbook learning auto-trigger
 */
export class BackgroundJobService {
  private log = logger;
  private isProcessing = false;
  private processingInterval: NodeJS.Timeout | null = null;

  /**
   * Queue a background job
   */
  async queueJob(params: QueueJobParams): Promise<string> {
    const { queueName, jobType, data, priority = 0, maxRetries = 3 } = params;

    this.log.info({ queueName, jobType }, 'Queueing background job');

    const [job] = await db.insert(backgroundJobs).values({
      queueName,
      jobType,
      data,
      priority,
      maxRetries,
      status: 'pending',
      attempts: 0,
    }).returning();

    this.log.info({ jobId: job.id, queueName, jobType }, 'Job queued');

    // Start processing if not already running
    if (!this.isProcessing) {
      this.startProcessing();
    }

    return job.id;
  }

  /**
   * Start processing background jobs
   */
  startProcessing() {
    if (this.processingInterval) {
      return; // Already processing
    }

    this.log.info('Starting background job processor');
    this.isProcessing = true;

    // Process jobs every 10 seconds
    this.processingInterval = setInterval(async () => {
      await this.processNextJob();
    }, 10000);

    // Process one immediately
    this.processNextJob();
  }

  /**
   * Stop processing background jobs
   */
  stopProcessing() {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
    this.isProcessing = false;
    this.log.info('Stopped background job processor');
  }

  /**
   * Process next pending job
   */
  private async processNextJob(): Promise<void> {
    try {
      // Get next pending job (highest priority first)
      const pendingJobs = await db
        .select()
        .from(backgroundJobs)
        .where(eq(backgroundJobs.status, 'pending'))
        .orderBy(backgroundJobs.priority)
        .limit(1);

      if (pendingJobs.length === 0) {
        return; // No jobs to process
      }

      const job = pendingJobs[0];

      this.log.info({ jobId: job.id, jobType: job.jobType }, 'Processing job');

      // Mark as processing
      await db
        .update(backgroundJobs)
        .set({
          status: 'processing',
          startedAt: new Date(),
          attempts: (job.attempts || 0) + 1,
        })
        .where(eq(backgroundJobs.id, job.id));

      try {
        // Execute job based on type
        await this.executeJob(job);

        // Mark as completed
        await db
          .update(backgroundJobs)
          .set({
            status: 'completed',
            completedAt: new Date(),
          })
          .where(eq(backgroundJobs.id, job.id));

        this.log.info({ jobId: job.id, jobType: job.jobType }, 'Job completed successfully');
      } catch (error: any) {
        this.log.error({ error, jobId: job.id, jobType: job.jobType }, 'Job failed');

        // Retry logic
        const currentAttempts = job.attempts || 0;
        const maxRetries = job.maxRetries || 3;
        
        if (currentAttempts < maxRetries) {
          // Mark as pending for retry
          await db
            .update(backgroundJobs)
            .set({
              status: 'pending',
              error: error.message,
            })
            .where(eq(backgroundJobs.id, job.id));

          this.log.info({ jobId: job.id, attempts: currentAttempts + 1 }, 'Job will be retried');
        } else {
          // Max retries reached, mark as failed
          await db
            .update(backgroundJobs)
            .set({
              status: 'failed',
              error: error.message,
              completedAt: new Date(),
            })
            .where(eq(backgroundJobs.id, job.id));

          this.log.error({ jobId: job.id, error }, 'Job failed after max retries');
        }
      }
    } catch (error) {
      this.log.error({ error }, 'Error processing job');
    }
  }

  /**
   * Execute job based on type
   */
  private async executeJob(job: any): Promise<void> {
    switch (job.jobType) {
      case 'playbook-learning-analysis':
        await this.executePlaybookLearning(job.data);
        break;

      case 'send-notification':
        // Future: Implement notification sending
        this.log.info({ jobId: job.id }, 'Notification job (not yet implemented)');
        break;

      case 'generate-report':
        // Future: Implement report generation
        this.log.info({ jobId: job.id }, 'Report generation job (not yet implemented)');
        break;

      // Path B: Production data generation jobs
      case 'pulse_analysis':
      case 'risk_assessment':
      case 'opportunity_detection':
      case 'executive_summary':
        await this.executeDataGenerationJob(job.jobType, job.data);
        break;

      default:
        this.log.warn({ jobType: job.jobType }, 'Unknown job type');
        throw new Error(`Unknown job type: ${job.jobType}`);
    }
  }

  /**
   * Execute data generation jobs using JobProcessors
   */
  private async executeDataGenerationJob(jobType: string, data: any): Promise<void> {
    try {
      const { jobProcessors } = await import('./JobProcessors.js');
      const processor = jobProcessors[jobType];
      
      if (!processor) {
        throw new Error(`No processor for job type: ${jobType}`);
      }
      
      const result = await processor(data);
      this.log.info({ jobType, result }, `✅ ${jobType} completed successfully`);
    } catch (error: any) {
      this.log.error({ jobType, error }, `❌ ${jobType} failed`);
      throw error;
    }
  }

  /**
   * Execute playbook learning analysis
   */
  private async executePlaybookLearning(data: {
    organizationId: string;
    playbookId: string;
    executionType: 'drill' | 'activation';
    executionId: string;
  }): Promise<void> {
    this.log.info(data, 'Executing playbook learning analysis');

    await playbookLearningService.analyzeExecution({
      organizationId: data.organizationId,
      playbookId: data.playbookId,
      executionType: data.executionType,
      executionId: data.executionId,
    });

    this.log.info(data, 'Playbook learning analysis completed');
  }

  /**
   * Queue playbook learning job after drill/activation
   */
  async queuePlaybookLearning(params: {
    organizationId: string;
    playbookId: string;
    executionType: 'drill' | 'activation';
    executionId: string;
  }): Promise<string> {
    return this.queueJob({
      queueName: 'analysis',
      jobType: 'playbook-learning-analysis',
      data: params,
      priority: 10, // High priority for learning
    });
  }
}

// Singleton instance
export const backgroundJobService = new BackgroundJobService();

// Auto-start processing
backgroundJobService.startProcessing();
