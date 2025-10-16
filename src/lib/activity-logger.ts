/**
 * Activity Logger Service
 * 
 * Centralized service for logging all API requests, authentication events,
 * and errors with full context
 */

import prisma from '@/lib/prisma';

export interface ActivityLogData {
  userId?: string;
  action: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  endpoint?: string;
  method?: string;
  statusCode?: number;
  duration?: number;
  error?: string;
}

export class ActivityLogger {
  /**
   * Log an activity
   */
  static async log(data: ActivityLogData): Promise<void> {
    try {
      await prisma.activityLog.create({
        data: {
          userId: data.userId,
          action: data.action,
          details: data.details ? JSON.stringify(data.details) : null,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          // Note: endpoint, method, statusCode, duration, error fields will be available
          // after running the migration to enhance the ActivityLog model
        },
      });
    } catch (error) {
      // Don't throw errors from logging to avoid breaking the main flow
      console.error('Failed to log activity:', error);
    }
  }

  /**
   * Log API request
   */
  static async logRequest(data: {
    userId?: string;
    endpoint: string;
    method: string;
    statusCode: number;
    duration: number;
    ipAddress?: string;
    userAgent?: string;
    error?: string;
  }): Promise<void> {
    await this.log({
      userId: data.userId,
      action: 'api_request',
      endpoint: data.endpoint,
      method: data.method,
      statusCode: data.statusCode,
      duration: data.duration,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      error: data.error,
      details: {
        endpoint: data.endpoint,
        method: data.method,
        statusCode: data.statusCode,
        duration: data.duration,
      },
    });
  }

  /**
   * Log authentication event
   */
  static async logAuth(data: {
    userId?: string;
    action: 'login' | 'logout' | 'signup' | 'token_refresh' | 'auth_failed';
    ipAddress?: string;
    userAgent?: string;
    details?: any;
    error?: string;
  }): Promise<void> {
    await this.log({
      userId: data.userId,
      action: `auth_${data.action}`,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      details: data.details,
      error: data.error,
    });
  }

  /**
   * Log error with full context
   */
  static async logError(data: {
    userId?: string;
    error: Error | string;
    endpoint?: string;
    method?: string;
    ipAddress?: string;
    userAgent?: string;
    context?: any;
  }): Promise<void> {
    const errorMessage = typeof data.error === 'string' 
      ? data.error 
      : data.error.message;
    
    const errorStack = typeof data.error === 'string' 
      ? undefined 
      : data.error.stack;

    await this.log({
      userId: data.userId,
      action: 'error',
      endpoint: data.endpoint,
      method: data.method,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      error: errorMessage,
      details: {
        error: errorMessage,
        stack: errorStack,
        context: data.context,
      },
    });
  }

  /**
   * Log file upload event
   */
  static async logFileUpload(data: {
    userId: string;
    action: 'material_upload' | 'past_question_upload' | 'avatar_upload';
    fileName: string;
    fileSize: number;
    fileType: string;
    ipAddress?: string;
    userAgent?: string;
    success: boolean;
    error?: string;
  }): Promise<void> {
    await this.log({
      userId: data.userId,
      action: data.action,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      error: data.error,
      details: {
        fileName: data.fileName,
        fileSize: data.fileSize,
        fileType: data.fileType,
        success: data.success,
      },
    });
  }

  /**
   * Log AI query event
   */
  static async logAIQuery(data: {
    userId: string;
    query: string;
    courseId?: string;
    responseTime: number;
    chunksUsed: number;
    ipAddress?: string;
    userAgent?: string;
    error?: string;
  }): Promise<void> {
    await this.log({
      userId: data.userId,
      action: 'ai_query',
      duration: data.responseTime,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      error: data.error,
      details: {
        query: data.query.substring(0, 100), // Truncate for storage
        courseId: data.courseId,
        responseTime: data.responseTime,
        chunksUsed: data.chunksUsed,
      },
    });
  }

  /**
   * Log admin action
   */
  static async logAdminAction(data: {
    userId: string;
    action: string;
    targetId?: string;
    targetType?: string;
    ipAddress?: string;
    userAgent?: string;
    details?: any;
  }): Promise<void> {
    await this.log({
      userId: data.userId,
      action: `admin_${data.action}`,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      details: {
        targetId: data.targetId,
        targetType: data.targetType,
        ...data.details,
      },
    });
  }

  /**
   * Get recent activity logs
   */
  static async getRecentLogs(options: {
    userId?: string;
    action?: string;
    limit?: number;
    offset?: number;
  } = {}) {
    const { userId, action, limit = 50, offset = 0 } = options;

    const where: any = {};
    if (userId) where.userId = userId;
    if (action) where.action = action;

    return await prisma.activityLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  /**
   * Get activity statistics
   */
  static async getStats(options: {
    userId?: string;
    startDate?: Date;
    endDate?: Date;
  } = {}) {
    const { userId, startDate, endDate } = options;

    const where: any = {};
    if (userId) where.userId = userId;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [total, byAction] = await Promise.all([
      prisma.activityLog.count({ where }),
      prisma.activityLog.groupBy({
        by: ['action'],
        where,
        _count: true,
      }),
    ]);

    return {
      total,
      byAction: byAction.map(item => ({
        action: item.action,
        count: item._count,
      })),
    };
  }
}

export default ActivityLogger;
