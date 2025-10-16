#!/usr/bin/env tsx

/**
 * Queue Worker Process
 * 
 * This script runs as a separate process to handle material processing jobs.
 * It polls the processing queue and processes pending jobs asynchronously.
 * 
 * Usage:
 *   pnpm tsx scripts/queue-worker.ts
 * 
 * Environment Variables:
 *   QUEUE_POLL_INTERVAL - Polling interval in milliseconds (default: 5000)
 */

import { queueWorker } from '@/lib/queue-worker';
import { processingQueue } from '@/lib/processing-queue';

async function main() {
  console.log('=================================');
  console.log('Material Processing Queue Worker');
  console.log('=================================\n');

  // Get configuration from environment
  const pollInterval = parseInt(process.env.QUEUE_POLL_INTERVAL || '5000', 10);

  console.log('Configuration:');
  console.log(`  Poll Interval: ${pollInterval}ms`);
  console.log('');

  // Set custom poll interval if provided
  if (process.env.QUEUE_POLL_INTERVAL) {
    queueWorker.setPollInterval(pollInterval);
  }

  // Display initial queue stats
  try {
    const stats = await processingQueue.getQueueStats();
    console.log('Initial Queue Statistics:');
    console.log(`  Total Jobs: ${stats.total}`);
    console.log(`  Pending: ${stats.pending}`);
    console.log(`  Processing: ${stats.processing}`);
    console.log(`  Completed: ${stats.completed}`);
    console.log(`  Failed: ${stats.failed}`);
    console.log('');
  } catch (error) {
    console.error('Error fetching queue stats:', error);
  }

  // Start the worker
  console.log('Starting worker...\n');
  queueWorker.start();

  // Log status every minute
  setInterval(async () => {
    try {
      const stats = await processingQueue.getQueueStats();
      const workerStatus = queueWorker.getStatus();

      console.log('\n--- Queue Status Update ---');
      console.log(`Time: ${new Date().toISOString()}`);
      console.log(`Worker Running: ${workerStatus.isRunning}`);
      console.log(`Current Backoff: ${workerStatus.currentBackoff}ms`);
      console.log(`Consecutive Errors: ${workerStatus.consecutiveErrors}`);
      console.log(`Queue Stats: ${stats.pending} pending, ${stats.processing} processing, ${stats.completed} completed, ${stats.failed} failed`);
      console.log('-------------------------\n');
    } catch (error) {
      console.error('Error in status update:', error);
    }
  }, 60000); // Every minute
}

// Run the worker
main().catch((error) => {
  console.error('Fatal error in queue worker:', error);
  process.exit(1);
});
