import { processingQueue } from '@/lib/processing-queue';

export class QueueWorker {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;
  private pollInterval: number = 5000; // 5 seconds
  private backoffMultiplier: number = 1.5;
  private maxBackoff: number = 60000; // 60 seconds
  private currentBackoff: number = 5000;
  private consecutiveErrors: number = 0;

  /**
   * Start the queue worker
   */
  start(): void {
    if (this.isRunning) {
      console.log('Queue worker is already running');
      return;
    }

    this.isRunning = true;
    console.log('Starting queue worker...');

    // Process immediately on start
    this.processQueue();

    // Set up polling interval
    this.intervalId = setInterval(() => {
      this.processQueue();
    }, this.pollInterval);

    // Handle graceful shutdown
    this.setupShutdownHandlers();
  }

  /**
   * Stop the queue worker
   */
  stop(): void {
    if (!this.isRunning) {
      console.log('Queue worker is not running');
      return;
    }

    console.log('Stopping queue worker...');
    this.isRunning = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    console.log('Queue worker stopped');
  }

  /**
   * Process the queue
   */
  private async processQueue(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    try {
      console.log('Polling for pending jobs...');
      await processingQueue.processNext();

      // Reset backoff on success
      if (this.consecutiveErrors > 0) {
        console.log('Queue processing successful, resetting backoff');
        this.consecutiveErrors = 0;
        this.currentBackoff = this.pollInterval;
      }
    } catch (error) {
      console.error('Error in queue worker:', error);
      this.handleError();
    }
  }

  /**
   * Handle errors with exponential backoff
   */
  private handleError(): void {
    this.consecutiveErrors++;

    // Calculate new backoff time
    const newBackoff = Math.min(
      this.currentBackoff * this.backoffMultiplier,
      this.maxBackoff
    );

    console.log(
      `Error occurred (${this.consecutiveErrors} consecutive errors). ` +
      `Backing off from ${this.currentBackoff}ms to ${newBackoff}ms`
    );

    this.currentBackoff = newBackoff;

    // Update polling interval with backoff
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = setInterval(() => {
        this.processQueue();
      }, this.currentBackoff);
    }
  }

  /**
   * Setup graceful shutdown handlers
   */
  private setupShutdownHandlers(): void {
    const shutdown = async (signal: string) => {
      console.log(`\nReceived ${signal}, shutting down gracefully...`);
      this.stop();

      // Give time for current processing to complete
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Graceful shutdown complete');
      process.exit(0);
    };

    // Handle different shutdown signals
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGUSR2', () => shutdown('SIGUSR2')); // nodemon restart

    // Handle uncaught errors
    process.on('uncaughtException', (error) => {
      console.error('Uncaught exception in queue worker:', error);
      this.handleError();
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled rejection in queue worker:', reason);
      this.handleError();
    });
  }

  /**
   * Get worker status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      pollInterval: this.pollInterval,
      currentBackoff: this.currentBackoff,
      consecutiveErrors: this.consecutiveErrors,
    };
  }

  /**
   * Manually trigger queue processing
   */
  async triggerProcessing(): Promise<void> {
    console.log('Manually triggering queue processing...');
    await this.processQueue();
  }

  /**
   * Update poll interval
   */
  setPollInterval(interval: number): void {
    if (interval < 1000) {
      throw new Error('Poll interval must be at least 1000ms');
    }

    this.pollInterval = interval;
    this.currentBackoff = interval;

    console.log(`Updated poll interval to ${interval}ms`);

    // Restart interval if running
    if (this.isRunning && this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = setInterval(() => {
        this.processQueue();
      }, this.pollInterval);
    }
  }
}

// Export singleton instance
export const queueWorker = new QueueWorker();
