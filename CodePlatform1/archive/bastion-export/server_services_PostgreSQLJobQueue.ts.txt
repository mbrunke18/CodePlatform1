import { db } from '../db';
import { backgroundJobs, type BackgroundJob } from '../../shared/schema';
import { eq, and, isNull, sql, lt } from 'drizzle-orm';
import pino from 'pino';

const logger = pino({ name: 'postgresql-job-queue' });

export interface JobData {
  type: string;
  organizationId: string;
  parameters?: Record<string, any>;
  [key: string]: any;
}

export interface JobOptions {
  delay?: number; // milliseconds
  priority?: number; // higher number = higher priority
  maxRetries?: number;
}

export class PostgreSQLJobQueue {
  private workers: Map<string, (data: JobData) => Promise<any>> = new Map();
  private isProcessing = false;
  private processingInterval?: NodeJS.Timeout;

  constructor(private queueName: string) {}

  /**
   * Add a job to the queue
   */
  async add(jobType: string, data: JobData, options: JobOptions = {}): Promise<string> {
    try {
      const now = new Date();
      const runAt = options.delay ? new Date(now.getTime() + options.delay) : now;

      const [job] = await db.insert(backgroundJobs).values({
        queueName: this.queueName,
        jobType,
        data,
        priority: options.priority || 0,
        maxRetries: options.maxRetries || 3,
        runAt,
        status: 'pending',
        createdAt: now,
        updatedAt: now
      }).returning();

      logger.info(`Job ${job.id} added to queue ${this.queueName}`);
      return job.id;
    } catch (error) {
      logger.error({ error }, `Failed to add job to queue ${this.queueName}`);
      throw error;
    }
  }

  /**
   * Register a job processor
   */
  process(jobType: string, processor: (data: JobData) => Promise<any>): void {
    this.workers.set(jobType, processor);
    logger.info(`Registered processor for job type: ${jobType}`);
  }

  /**
   * Start processing jobs
   */
  async start(): Promise<void> {
    if (this.isProcessing) return;

    this.isProcessing = true;
    logger.info(`Starting job processing for queue: ${this.queueName}`);

    this.processingInterval = setInterval(async () => {
      await this.processJobs();
    }, 5000); // Process every 5 seconds

    // Process immediately
    await this.processJobs();
  }

  /**
   * Stop processing jobs
   */
  async stop(): Promise<void> {
    this.isProcessing = false;
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = undefined;
    }
    logger.info(`Stopped job processing for queue: ${this.queueName}`);
  }

  /**
   * Process pending jobs
   */
  private async processJobs(): Promise<void> {
    if (!this.isProcessing || this.workers.size === 0) return;

    try {
      // Get pending jobs ready to run
      const jobs = await db
        .select()
        .from(backgroundJobs)
        .where(
          and(
            eq(backgroundJobs.queueName, this.queueName),
            eq(backgroundJobs.status, 'pending'),
            lt(backgroundJobs.runAt, new Date())
          )
        )
        .orderBy(sql`${backgroundJobs.priority} DESC, ${backgroundJobs.createdAt} ASC`)
        .limit(10);

      for (const job of jobs) {
        await this.processJob(job);
      }

      // Clean up old completed/failed jobs (older than 7 days)
      await this.cleanup();
    } catch (error) {
      logger.error({ error }, 'Error processing jobs');
    }
  }

  /**
   * Process a single job
   */
  private async processJob(job: BackgroundJob): Promise<void> {
    const processor = this.workers.get(job.jobType);
    if (!processor) {
      logger.warn(`No processor found for job type: ${job.jobType}`);
      return;
    }

    try {
      // Mark job as processing
      await db
        .update(backgroundJobs)
        .set({
          status: 'processing',
          startedAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(backgroundJobs.id, job.id));

      logger.info(`Processing job ${job.id} (${job.jobType})`);

      // Execute the job
      const result = await processor(job.data);

      // Mark job as completed
      await db
        .update(backgroundJobs)
        .set({
          status: 'completed',
          result,
          completedAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(backgroundJobs.id, job.id));

      logger.info(`Job ${job.id} completed successfully`);
    } catch (error) {
      await this.handleJobError(job, error);
    }
  }

  /**
   * Handle job processing errors
   */
  private async handleJobError(job: BackgroundJob, error: any): Promise<void> {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const newAttempts = (job.attempts || 0) + 1;

    logger.error({ error: errorMessage, jobId: job.id }, `Job failed (attempt ${newAttempts})`);

    if (newAttempts >= job.maxRetries) {
      // Max retries reached, mark as failed
      await db
        .update(backgroundJobs)
        .set({
          status: 'failed',
          error: errorMessage,
          attempts: newAttempts,
          failedAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(backgroundJobs.id, job.id));

      logger.error(`Job ${job.id} permanently failed after ${newAttempts} attempts`);
    } else {
      // Retry with exponential backoff
      const delayMs = Math.min(1000 * Math.pow(2, newAttempts - 1), 300000); // Max 5 minutes
      const retryAt = new Date(Date.now() + delayMs);

      await db
        .update(backgroundJobs)
        .set({
          status: 'pending',
          error: errorMessage,
          attempts: newAttempts,
          runAt: retryAt,
          updatedAt: new Date()
        })
        .where(eq(backgroundJobs.id, job.id));

      logger.info(`Job ${job.id} scheduled for retry in ${delayMs}ms`);
    }
  }

  /**
   * Clean up old jobs
   */
  private async cleanup(): Promise<void> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 7);

      const deleted = await db
        .delete(backgroundJobs)
        .where(
          and(
            eq(backgroundJobs.queueName, this.queueName),
            lt(backgroundJobs.updatedAt, cutoffDate),
            sql`status IN ('completed', 'failed')`
          )
        );

      if (deleted.rowCount && deleted.rowCount > 0) {
        logger.info(`Cleaned up ${deleted.rowCount} old jobs from queue ${this.queueName}`);
      }
    } catch (error) {
      logger.error({ error }, 'Error during job cleanup');
    }
  }

  /**
   * Get job statistics
   */
  async getStats(): Promise<{
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  }> {
    try {
      const stats = await db
        .select({
          status: backgroundJobs.status,
          count: sql<number>`count(*)`
        })
        .from(backgroundJobs)
        .where(eq(backgroundJobs.queueName, this.queueName))
        .groupBy(backgroundJobs.status);

      const result = {
        pending: 0,
        processing: 0,
        completed: 0,
        failed: 0
      };

      for (const stat of stats) {
        if (stat.status && stat.status in result) {
          (result as any)[stat.status] = Number(stat.count);
        }
      }

      return result;
    } catch (error) {
      logger.error({ error }, 'Error getting job stats');
      return { pending: 0, processing: 0, completed: 0, failed: 0 };
    }
  }
}

export default PostgreSQLJobQueue;