import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/middleware/auth.middleware';
import { IPBlocker } from '@/lib/ip-blocker';
import { applyAdminRateLimit, withRateLimitHeaders, getUserIdFromRequest } from '@/lib/rate-limit-helpers';

// Validation schema for blocking an IP
const blockIPSchema = z.object({
  ipAddress: z.string().regex(
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    'Invalid IP address'
  ),
  reason: z.string().min(3, 'Reason must be at least 3 characters'),
  durationMs: z.number().int().positive().optional(),
});

/**
 * GET /api/v1/admin/ip-blocks - Get all active IP blocks
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

    // Get all active blocks
    const blocks = await IPBlocker.getActiveBlocks();

    const response = NextResponse.json({
      success: true,
      blocks,
      count: blocks.length,
    });

    return withRateLimitHeaders(response, request);
  } catch (error) {
    console.error('Error fetching IP blocks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch IP blocks' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/admin/ip-blocks - Block an IP address
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

    const body = await request.json();

    // Validate request body
    const validatedData = blockIPSchema.parse(body);

    // Block the IP
    await IPBlocker.blockIP(
      validatedData.ipAddress,
      validatedData.reason,
      validatedData.durationMs
    );

    const response = NextResponse.json({
      success: true,
      message: `IP ${validatedData.ipAddress} has been blocked`,
      ipAddress: validatedData.ipAddress,
      reason: validatedData.reason,
      expiresAt: validatedData.durationMs
        ? new Date(Date.now() + validatedData.durationMs)
        : null,
    });

    return withRateLimitHeaders(response, request);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    console.error('Error blocking IP:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to block IP' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/admin/ip-blocks - Unblock an IP address
 */
export async function DELETE(request: NextRequest) {
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

    // Unblock the IP
    await IPBlocker.unblockIP(ipAddress);

    const response = NextResponse.json({
      success: true,
      message: `IP ${ipAddress} has been unblocked`,
      ipAddress,
    });

    return withRateLimitHeaders(response, request);
  } catch (error) {
    console.error('Error unblocking IP:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to unblock IP' },
      { status: 500 }
    );
  }
}
