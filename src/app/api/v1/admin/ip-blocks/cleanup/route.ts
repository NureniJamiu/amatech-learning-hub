import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/middleware/auth.middleware';
import { IPBlocker } from '@/lib/ip-blocker';
import { RateLimiter } from '@/lib/rate-limiter';
import { applyAdminRateLimit, withRateLimitHeaders, getUserIdFromRequest } from '@/lib/rate-limit-helpers';

/**
 * POST /api/v1/admin/ip-blocks/cleanup - Clean up expired blocks and rate limits
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    // Apply admin rate limiting
    const userId = await getUserIdFromRequest(request);
    const rateLimitResponse = await applyAdminRateLimit(request, userId);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // Clean up expired IP blocks
    const unblocked = await IPBlocker.cleanupExpired();

    // Clean up expired rate limits
    const rateLimitsDeleted = await RateLimiter.cleanupExpired();

    const response = NextResponse.json({
      success: true,
      message: 'Cleanup completed successfully',
      results: {
        ipBlocksUnblocked: unblocked,
        rateLimitsDeleted: rateLimitsDeleted,
      },
    });

    return withRateLimitHeaders(response, request);
  } catch (error) {
    console.error('Error during cleanup:', error);
    return NextResponse.json(
      { success: false, error: 'Cleanup failed' },
      { status: 500 }
    );
  }
}
