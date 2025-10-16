import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { applyAdminRateLimit, withRateLimitHeaders } from '@/lib/rate-limit-helpers';
import { parseCursorPagination, buildCursorQuery, processCursorResults } from '@/lib/pagination';

/**
 * GET /api/v1/admin/activity-logs
 * Get activity logs with cursor-based pagination (Admin only)
 */
export async function GET(req: NextRequest) {
  try {
    // Authenticate and check admin status
    const { authenticateAndValidateUser } = await import('@/middleware/auth.middleware');
    const authResult = await authenticateAndValidateUser(req);
    
    if (!authResult || !authResult.userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!authResult.user.isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    // Apply admin rate limiting (200 requests per 15 minutes)
    const rateLimitResponse = await applyAdminRateLimit(req, authResult.userId);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const url = new URL(req.url);
    
    // Parse pagination parameters
    const paginationParams = parseCursorPagination(url.searchParams);
    const cursorQuery = buildCursorQuery(paginationParams);

    // Parse filter parameters
    const userId = url.searchParams.get('userId');
    const action = url.searchParams.get('action');
    const ipAddress = url.searchParams.get('ipAddress');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    // Build where clause
    const where: any = {};
    if (userId) where.userId = userId;
    if (action) where.action = { contains: action, mode: 'insensitive' };
    if (ipAddress) where.ipAddress = ipAddress;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    // Fetch activity logs with pagination
    const logs = await prisma.activityLog.findMany({
      where,
      ...cursorQuery,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        userId: true,
        action: true,
        details: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,
      },
    });

    // Process pagination results
    const paginatedLogs = processCursorResults(logs, paginationParams.limit);

    // Get total count for reference (optional, can be expensive)
    const total = await prisma.activityLog.count({ where });

    const response = NextResponse.json({
      success: true,
      logs: paginatedLogs.data,
      pageInfo: {
        ...paginatedLogs.pageInfo,
        totalCount: total,
      },
    });

    return withRateLimitHeaders(response, req);
  } catch (error) {
    console.error('Activity logs error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch activity logs' },
      { status: 500 }
    );
  }
}
