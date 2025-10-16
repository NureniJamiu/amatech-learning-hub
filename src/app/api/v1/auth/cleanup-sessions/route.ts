import { NextResponse } from "next/server";
import { SessionManager } from "@/lib/session-manager";

/**
 * Cleanup expired sessions
 * This endpoint should be called periodically by a cron job
 * or can be manually triggered by an admin
 */
export async function POST() {
  try {
    const count = await SessionManager.cleanupExpiredSessions();

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${count} expired sessions`,
      count,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Cleanup Sessions] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to cleanup expired sessions",
      },
      { status: 500 }
    );
  }
}
