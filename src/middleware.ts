import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuthToken } from "@/utils/token";

// Routes that don't require authentication
const publicRoutes = ["/", "/login", "/signup", "/forgot-password"];

// Routes that require admin access
const adminRoutes = ["/admin"];

// API routes that don't require authentication
const publicApiRoutes = ["/api/v1/auth/login", "/api/v1/auth/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const referer = request.headers.get("referer");

  console.log("Middleware processing:", pathname, "Referer:", referer);

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/public/') ||
    pathname.includes('.svg') ||
    pathname.includes('.png') ||
    pathname.includes('.jpg') ||
    pathname.includes('.jpeg') ||
    pathname.includes('.gif') ||
    pathname.includes('.ico') ||
    pathname.includes('.css') ||
    pathname.includes('.js')
  ) {
    return NextResponse.next();
  }

  // Check if it's a public route
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Check if it's a public API route
  if (publicApiRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Detect potential redirect loops
  if (pathname === "/dashboard" && referer && referer.includes("/login")) {
    console.log("Potential redirect loop detected - dashboard->login->dashboard");
  }

  // Get token from cookies or authorization header
  const token = request.cookies.get("token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  // If no token, redirect to login
  if (!token) {
    console.log("No token found for", pathname, "redirecting to login");
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    // Prevent redirect if already on login page
    if (pathname === "/login") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Verify token
  const decoded = verifyAuthToken(token);
  if (!decoded) {
    console.log("Invalid token for", pathname, "redirecting to login");
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }
    // Prevent redirect if already on login page
    if (pathname === "/login") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  console.log("Token verified for", pathname, "allowing access");

  // If user is authenticated and trying to access login page, redirect to dashboard
  if (pathname === "/login") {
    console.log("Authenticated user on login page, redirecting to dashboard");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // For admin routes, we'd need to check if user is admin
  // This would require a database call, so we'll handle it in the component level

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     * - static assets with common extensions
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|ico|css|js|woff|woff2)$).*)",
  ],
};
