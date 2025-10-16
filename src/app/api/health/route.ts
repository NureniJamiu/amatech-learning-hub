import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getGrokClient } from '@/lib/grok-client';
import { v2 as cloudinary } from 'cloudinary';
import { processingQueue } from '@/lib/processing-queue';
import { MaintenanceMode } from '@/lib/maintenance-mode';

// Track application start time for uptime calculation
const startTime = Date.now();

interface ServiceHealth {
  status: 'up' | 'down' | 'degraded';
  responseTime?: number;
  error?: string;
}

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  maintenanceMode: boolean;
  services: {
    database: ServiceHealth;
    grok: ServiceHealth;
    cloudinary: ServiceHealth;
    queue: ServiceHealth;
  };
  metrics: {
    memoryUsage: {
      used: number;
      total: number;
      percentage: number;
    };
    queueStats: {
      pending: number;
      processing: number;
      completed: number;
      failed: number;
      total: number;
    };
  };
}

/**
 * Check database connectivity
 */
async function checkDatabase(): Promise<ServiceHealth> {
  const startTime = Date.now();
  try {
    // Simple query to check database connection
    await prisma.$queryRaw`SELECT 1`;
    const responseTime = Date.now() - startTime;
    
    return {
      status: 'up',
      responseTime,
    };
  } catch (error: any) {
    return {
      status: 'down',
      responseTime: Date.now() - startTime,
      error: error.message || 'Database connection failed',
    };
  }
}

/**
 * Check Grok API availability
 */
async function checkGrok(): Promise<ServiceHealth> {
  const startTime = Date.now();
  try {
    const grokClient = getGrokClient();
    
    // Test with a minimal embedding request
    await grokClient.createEmbeddings({ 
      input: 'health check',
    });
    
    const responseTime = Date.now() - startTime;
    
    return {
      status: 'up',
      responseTime,
    };
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    
    // Check if it's a rate limit error (degraded, not down)
    if (error.name === 'RateLimitError') {
      return {
        status: 'degraded',
        responseTime,
        error: 'Rate limit exceeded',
      };
    }
    
    return {
      status: 'down',
      responseTime,
      error: error.message || 'Grok API connection failed',
    };
  }
}

/**
 * Check Cloudinary availability
 */
async function checkCloudinary(): Promise<ServiceHealth> {
  const startTime = Date.now();
  try {
    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || 
        !process.env.CLOUDINARY_API_KEY || 
        !process.env.CLOUDINARY_API_SECRET) {
      return {
        status: 'down',
        responseTime: Date.now() - startTime,
        error: 'Cloudinary not configured',
      };
    }

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Ping Cloudinary API
    await cloudinary.api.ping();
    
    const responseTime = Date.now() - startTime;
    
    return {
      status: 'up',
      responseTime,
    };
  } catch (error: any) {
    return {
      status: 'down',
      responseTime: Date.now() - startTime,
      error: error.message || 'Cloudinary connection failed',
    };
  }
}

/**
 * Check processing queue status
 */
async function checkQueue(): Promise<ServiceHealth> {
  const startTime = Date.now();
  try {
    // Get queue statistics
    await processingQueue.getQueueStats();
    
    const responseTime = Date.now() - startTime;
    
    return {
      status: 'up',
      responseTime,
    };
  } catch (error: any) {
    return {
      status: 'down',
      responseTime: Date.now() - startTime,
      error: error.message || 'Queue check failed',
    };
  }
}

/**
 * Get memory usage metrics
 */
function getMemoryUsage() {
  const usage = process.memoryUsage();
  const totalMemory = usage.heapTotal;
  const usedMemory = usage.heapUsed;
  const percentage = (usedMemory / totalMemory) * 100;
  
  return {
    used: Math.round(usedMemory / 1024 / 1024), // MB
    total: Math.round(totalMemory / 1024 / 1024), // MB
    percentage: Math.round(percentage * 100) / 100,
  };
}

/**
 * Calculate application uptime in seconds
 */
function getUptime(): number {
  return Math.floor((Date.now() - startTime) / 1000);
}

/**
 * Determine overall health status based on service statuses
 */
function determineOverallStatus(services: HealthStatus['services']): 'healthy' | 'degraded' | 'unhealthy' {
  const statuses = Object.values(services).map(s => s.status);
  
  // If any critical service is down, system is unhealthy
  if (services.database.status === 'down') {
    return 'unhealthy';
  }
  
  // If any service is down or degraded, system is degraded
  if (statuses.includes('down') || statuses.includes('degraded')) {
    return 'degraded';
  }
  
  return 'healthy';
}

/**
 * Health check endpoint
 * GET /api/health
 */
export async function GET() {
  try {
    // Check all services in parallel for faster response
    const [database, grok, cloudinary, queue, maintenanceMode] = await Promise.all([
      checkDatabase(),
      checkGrok(),
      checkCloudinary(),
      checkQueue(),
      MaintenanceMode.isEnabled(),
    ]);

    // Get queue statistics
    const queueStats = await processingQueue.getQueueStats();

    // Build health status response
    const healthStatus: HealthStatus = {
      status: determineOverallStatus({ database, grok, cloudinary, queue }),
      timestamp: new Date().toISOString(),
      uptime: getUptime(),
      maintenanceMode,
      services: {
        database,
        grok,
        cloudinary,
        queue,
      },
      metrics: {
        memoryUsage: getMemoryUsage(),
        queueStats,
      },
    };

    // Return appropriate status code based on health
    // If in maintenance mode, return 503 even if services are healthy
    const statusCode = maintenanceMode ? 503 :
                       healthStatus.status === 'healthy' ? 200 : 
                       healthStatus.status === 'degraded' ? 200 : 503;

    return NextResponse.json(healthStatus, { status: statusCode });
  } catch (error: any) {
    console.error('Health check error:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        uptime: getUptime(),
        maintenanceMode: false,
        error: error.message || 'Health check failed',
      },
      { status: 503 }
    );
  }
}
