import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Get user's active sessions
 * Requires authentication
 */
export async function GET(request: NextRequest) {
  try {
    // Get user ID from middleware header
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required",
        },
        { status: 401 }
      );
    }

    // Get all active sessions for the user
    const sessions = await prisma.session.findMany({
      where: {
        userId,
        expires: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
        token: true,
        expires: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Mask tokens for security (only show last 10 characters)
    const maskedSessions = sessions.map((session) => ({
      ...session,
      token: `...${session.token.slice(-10)}`,
    }));

    return NextResponse.json({
      success: true,
      sessions: maskedSessions,
      count: sessions.length,
    });
  } catch (error) {
    console.error("[Get Sessions] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve sessions",
      },
      { status: 500 }
    );
  }
}

/**
 * Invalidate all sessions for the current user (logout from all devices)
 */
export async function DELETE(request: NextRequest) {
  try {
    // Get user ID from middleware header
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required",
        },
        { status: 401 }
      );
    }

    // Delete all sessions for the user
    const result = await prisma.session.deleteMany({
      where: { userId },
    });

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "All sessions invalidated successfully",
      count: result.count,
      timestamp: new Date().toISOString(),
    });

    // Clear the current session cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[Delete All Sessions] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to invalidate sessions",
      },
      { status: 500 }
    );
  }
}
