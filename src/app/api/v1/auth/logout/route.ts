import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { RequestDeduplicator } from "@/lib/request-deduplicator";
import { SessionManager } from "@/lib/session-manager";

/**
 * Extract token from request (cookie or Authorization header)
 */
function extractToken(request: NextRequest): string | null {
  // Try cookie first
  const cookieToken = request.cookies.get("token")?.value;
  if (cookieToken) {
    return cookieToken;
  }

  // Try Authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader) {
    // Support both "Bearer <token>" and just "<token>"
    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    return match ? match[1] : authHeader;
  }

  return null;
}

/**
 * Invalidate session in database
 */
async function invalidateSession(token: string): Promise<void> {
  try {
    await SessionManager.invalidateSession(token);
  } catch (error) {
    // Log error but don't fail the logout
    console.error("[Logout] Failed to invalidate session in database:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Extract token from request
    const token = extractToken(request);

    // If token exists, invalidate it in the database
    // Use deduplicator to handle concurrent logout requests
    if (token) {
      await RequestDeduplicator.deduplicate(
        `logout:${token}`,
        () => invalidateSession(token)
      );
    }

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
      timestamp: new Date().toISOString(),
    });

    // Clear the HTTP-only cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // Immediately expire the cookie
      path: "/",
    });

    // Also clear redirect count cookie if it exists
    response.cookies.set("x-redirect-count", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[Logout] Error:", error);
    
    // Even if there's an error, still clear the cookie
    const response = NextResponse.json(
      {
        success: false,
        error: "An error occurred during logout",
        message: "Session cleared locally",
      },
      { status: 500 }
    );

    // Clear cookies even on error
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    response.cookies.set("x-redirect-count", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return response;
  }
}
