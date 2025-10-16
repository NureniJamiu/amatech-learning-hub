import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/middleware/auth.middleware';
import { IPBlocker } from '@/lib/ip-blocker';
import { applyAdminRateLimit, withRateLimitHeaders, getUserIdFromRequest } from '@/lib/rate-limit-helpers';

/**
 * GET /api/v1/admin/ip-blocks/check - Check if an IP is blocked
 */
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const ipAddress = searchParams.get('ipAddress');

    if (!ipAddress) {
      return NextResponse.json(
        { success: false, error: 'IP address is required' },
        { status: 400 }
      );
    }

    // Validate IP address format
    const ipSchema = z.string().regex(
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      'Invalid IP address'
    );
    try {
      ipSchema.parse(ipAddress);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid IP address format' },
        { status: 400 }
      );
    }

    // Check if IP is blocked
    const result = await IPBlocker.isBlocked(ipAddress);

    const response = NextResponse.json({
      success: true,
      ipAddress,
      isBlocked: result.isBlocked,
      reason: result.reason,
      expiresAt: result.expiresAt,
    });

    return withRateLimitHeaders(response, request);
  } catch (error) {
    console.error('Error checking IP block:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check IP block status' },
      { status: 500 }
    );
  }
}
