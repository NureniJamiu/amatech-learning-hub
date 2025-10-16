import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { comparePasswords } from "@/utils/hash";
import { generateAuthToken } from "@/utils/token";
import { SessionManager } from "@/lib/session-manager";
import { 
  applyAuthRateLimit, 
  recordFailedAuthAttempt, 
  resetFailedAuthAttempts,
  withRateLimitHeaders 
} from "@/lib/rate-limit-helpers";

export async function POST(req: NextRequest) {
  console.log("Login route hit");
  
  // Apply rate limiting for auth endpoints (5 requests per 15 minutes)
  const rateLimitResponse = await applyAuthRateLimit(req);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const { email, password } = await req.json();
    console.log("Login attempt for email:", email);

    if (!email || !password) {
      console.log("Missing email or password");
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    console.log("User found:", !!user);

    if (!user) {
      console.log("User not found");
      // Record failed authentication attempt
      await recordFailedAuthAttempt(req);
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }

    const isValid = await comparePasswords(password, user.password);
    console.log("Password valid:", isValid);

    if (!isValid) {
      console.log("Invalid password");
      // Record failed authentication attempt
      await recordFailedAuthAttempt(req);
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }

    // Reset failed attempts on successful login
    await resetFailedAuthAttempts(req);

    const token = await generateAuthToken(user.id);
    console.log("Token generated successfully");
    console.log("Token length:", token?.length);
    console.log("Token preview:", token?.substring(0, 20) + "...");
    console.log("User ID for token:", user.id);

    // Create session in database
    try {
      await SessionManager.createSession(user.id, token, 15);
      console.log("Session created in database");
    } catch (sessionError) {
      console.error("Failed to create session in database:", sessionError);
      // Continue anyway - session tracking is not critical for login
    }

    const response = NextResponse.json({
        token,
        user: {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            matricNumber: user.matricNumber,
            level: user.level,
            isAdmin: user.isAdmin,
            department: user.department,
            faculty: user.faculty,
            currentSemester: user.currentSemester,
            avatar: user.avatar,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        },
    });

    // Set HTTP-only cookie for middleware access
    response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 24 * 60 * 60, // 15 days in seconds
        path: "/",
    });

    // Add rate limit headers to response
    return withRateLimitHeaders(response, req);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
