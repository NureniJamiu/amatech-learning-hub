import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/utils/token';
import prisma from '@/lib/prisma';
import { MaintenanceMode } from '@/lib/maintenance-mode';
import { ActivityLogger } from '@/lib/activity-logger';

/**
 * Get maintenance mode status
 * GET /api/v1/admin/maintenance
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = await verifyAuthToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { isAdmin: true },
    });

    if (!user?.isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get maintenance mode status
    const status = await MaintenanceMode.getStatus();

    return NextResponse.json({
      success: true,
      data: status,
    });
  } catch (error: any) {
    console.error('Error getting maintenance mode status:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to get maintenance mode status' },
      { status: 500 }
    );
  }
}

/**
 * Update maintenance mode status
 * PUT /api/v1/admin/maintenance
 */
export async function PUT(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = await verifyAuthToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { isAdmin: true },
    });

    if (!user?.isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { enabled } = body;

    if (typeof enabled !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'Invalid request. "enabled" must be a boolean' },
        { status: 400 }
      );
    }

    // Update maintenance mode
    if (enabled) {
      await MaintenanceMode.enable();
    } else {
      await MaintenanceMode.disable();
    }

    // Log admin action
    await ActivityLogger.logAdminAction({
      userId: decoded.userId,
      action: enabled ? 'enable_maintenance_mode' : 'disable_maintenance_mode',
      ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0] || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
    });

    return NextResponse.json({
      success: true,
      message: `Maintenance mode ${enabled ? 'enabled' : 'disabled'} successfully`,
      data: {
        enabled,
      },
    });
  } catch (error: any) {
    console.error('Error updating maintenance mode:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update maintenance mode' },
      { status: 500 }
    );
  }
}
