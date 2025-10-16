import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/middleware/auth.middleware";
import { processingQueue } from "@/lib/processing-queue";

/**
 * GET /api/v1/queue/stats
 * Get processing queue statistics (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request);
    
    // If authResult is a NextResponse, it means authentication/authorization failed
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    // Get queue statistics
    const stats = await processingQueue.getQueueStats();

    return NextResponse.json({
      stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching queue stats:", error);
    return NextResponse.json(
      { message: "Failed to fetch queue statistics" },
      { status: 500 }
    );
  }
}
