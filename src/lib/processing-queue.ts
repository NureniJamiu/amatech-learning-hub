import prisma from '@/lib/prisma';
import { GrokRAGPipeline } from '@/lib/rag-pipeline-grok';
import { CacheInvalidation } from '@/lib/cache';

export interface QueueJob {
  id: string;
  materialId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  attempts: number;
  maxAttempts: number;
  error?: string | null;
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date | null;
  completedAt?: Date | null;
}

export interface AddJobParams {
  materialId: string;
  fileUrl: string;
  materialTitle: string;
  courseId: string;
}

export class ProcessingQueue {
  private ragPipeline: GrokRAGPipeline;
  private isProcessing: boolean = false;

  constructor() {
    this.ragPipeline = new GrokRAGPipeline();
  }

  /**
   * Add a new job to the processing queue
   */
  async addJob(params: AddJobParams): Promise<string> {
    const { materialId } = params;

    try {
      // Check if job already exists
      const existingJob = await prisma.processingQueue.findUnique({
        where: { materialId },
      });

      if (existingJob) {
        console.log(`Job already exists for material ${materialId}`);
        return existingJob.id;
      }

      // Create new queue job
      const job = await prisma.processingQueue.create({
        data: {
          materialId,
          status: 'pending',
          attempts: 0,
          maxAttempts: 3,
        },
      });

      // Update material status to queued
      await prisma.material.update({
        where: { id: materialId },
        data: { processingStatus: 'queued' },
      });

      // Invalidate material cache when status changes
      CacheInvalidation.invalidateMaterial(materialId);

      console.log(`Added job ${job.id} to queue for material ${materialId}`);
      return job.id;
    } catch (error) {
      console.error('Error adding job to queue:', error);
      throw error;
    }
  }

  /**
   * Process the next pending job in the queue
   */
  async processNext(): Promise<void> {
    if (this.isProcessing) {
      console.log('Already processing a job, skipping...');
      return;
    }

    try {
      this.isProcessing = true;

      // Find the oldest pending job
      const job = await prisma.processingQueue.findFirst({
        where: { status: 'pending' },
        orderBy: { createdAt: 'asc' },
        include: {
          material: {
            include: {
              course: true,
            },
          },
        },
      });

      if (!job) {
        console.log('No pending jobs in queue');
        return;
      }

      console.log(`Processing job ${job.id} for material ${job.materialId}`);
      await this.processJob(job);
    } catch (error) {
      console.error('Error processing next job:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Retry failed jobs that haven't exceeded max attempts
   */
  async retryFailed(): Promise<void> {
    try {
      const failedJobs = await prisma.processingQueue.findMany({
        where: {
          status: 'failed',
          attempts: { lt: prisma.processingQueue.fields.maxAttempts },
        },
      });

      console.log(`Found ${failedJobs.length} failed jobs to retry`);

      for (const job of failedJobs) {
        await prisma.processingQueue.update({
          where: { id: job.id },
          data: {
            status: 'pending',
            error: null,
          },
        });
      }
    } catch (error) {
      console.error('Error retrying failed jobs:', error);
      throw error;
    }
  }

  /**
   * Get the status of a specific job
   */
  async getJobStatus(jobId: string): Promise<QueueJob | null> {
    try {
      const job = await prisma.processingQueue.findUnique({
        where: { id: jobId },
      });

      return job as QueueJob | null;
    } catch (error) {
      console.error('Error getting job status:', error);
      throw error;
    }
  }

  /**
   * Get the status of a job by material ID
   */
  async getJobStatusByMaterialId(materialId: string): Promise<QueueJob | null> {
    try {
      const job = await prisma.processingQueue.findUnique({
        where: { materialId },
      });

      return job as QueueJob | null;
    } catch (error) {
      console.error('Error getting job status by material ID:', error);
      throw error;
    }
  }

  /**
   * Process a single job
   */
  private async processJob(job: any): Promise<void> {
    const { id: jobId, materialId, attempts } = job;
    const { fileUrl, title, courseId } = job.material;

    try {
      // Update job status to processing
      await this.updateJobStatus(jobId, 'processing');

      // Update material status to processing
      await prisma.material.update({
        where: { id: materialId },
        data: {
          processingStatus: 'processing',
          processingStartedAt: new Date(),
        },
      });

      // Invalidate material cache when status changes
      CacheInvalidation.invalidateMaterial(materialId);

      console.log(`Starting PDF processing for material ${materialId}`);

      // Process the PDF using RAG pipeline
      const result = await this.ragPipeline.processPDFForRAG(
        fileUrl,
        materialId,
        title,
        courseId
      );

      // Update job status to completed
      await this.updateJobStatus(jobId, 'completed');

      // Update material status to completed
      await prisma.material.update({
        where: { id: materialId },
        data: {
          processed: true,
          processingStatus: 'completed',
          chunksCount: result.chunksCreated,
          processingCompletedAt: new Date(),
        },
      });

      // Invalidate material cache when status changes
      CacheInvalidation.invalidateMaterial(materialId);

      console.log(`Successfully processed material ${materialId}: ${result.chunksCreated} chunks created`);
    } catch (error: any) {
      console.error(`Error processing job ${jobId}:`, error);

      const newAttempts = attempts + 1;
      const errorMessage = error.message || 'Unknown error occurred';

      // Check if we should retry
      if (newAttempts < job.maxAttempts) {
        // Update job with error and increment attempts, but keep as pending for retry
        await prisma.processingQueue.update({
          where: { id: jobId },
          data: {
            status: 'pending',
            attempts: newAttempts,
            error: errorMessage,
            updatedAt: new Date(),
          },
        });

        console.log(`Job ${jobId} failed (attempt ${newAttempts}/${job.maxAttempts}), will retry`);
      } else {
        // Max attempts reached, mark as failed
        await this.updateJobStatus(jobId, 'failed', errorMessage);

        // Update material status to failed
        await prisma.material.update({
          where: { id: materialId },
          data: {
            processingStatus: 'failed',
            processingError: errorMessage,
            processingCompletedAt: new Date(),
          },
        });

        // Invalidate material cache when status changes
        CacheInvalidation.invalidateMaterial(materialId);

        console.log(`Job ${jobId} failed permanently after ${newAttempts} attempts`);
      }
    }
  }

  /**
   * Update the status of a job
   */
  private async updateJobStatus(
    jobId: string,
    status: 'pending' | 'processing' | 'completed' | 'failed',
    error?: string
  ): Promise<void> {
    try {
      const updateData: any = {
        status,
        updatedAt: new Date(),
      };

      if (status === 'processing') {
        updateData.startedAt = new Date();
      } else if (status === 'completed' || status === 'failed') {
        updateData.completedAt = new Date();
      }

      if (error) {
        updateData.error = error;
      }

      await prisma.processingQueue.update({
        where: { id: jobId },
        data: updateData,
      });

      console.log(`Updated job ${jobId} status to ${status}`);
    } catch (error) {
      console.error('Error updating job status:', error);
      throw error;
    }
  }

  /**
   * Get queue statistics
   */
  async getQueueStats() {
    try {
      const [pending, processing, completed, failed, total] = await Promise.all([
        prisma.processingQueue.count({ where: { status: 'pending' } }),
        prisma.processingQueue.count({ where: { status: 'processing' } }),
        prisma.processingQueue.count({ where: { status: 'completed' } }),
        prisma.processingQueue.count({ where: { status: 'failed' } }),
        prisma.processingQueue.count(),
      ]);

      return {
        pending,
        processing,
        completed,
        failed,
        total,
      };
    } catch (error) {
      console.error('Error getting queue stats:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const processingQueue = new ProcessingQueue();
