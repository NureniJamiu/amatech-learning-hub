import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuthToken } from "@/utils/token";

// Routes that don't require authentication
const publicRoutes = ["/", "/login", "/signup", "/forgot-password"];

// Routes that require admin access
const adminRoutes = ["/admin"];

// API routes that don't require authentication
const publicApiRoutes = ["/api/v1/auth/login", "/api/v1/auth/signup"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const referer = request.headers.get("referer");

    console.log("Middleware processing:", pathname, "Referer:", referer);

    // Skip middleware for static files and Next.js internals
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api/auth") ||
        pathname.startsWith("/favicon") ||
        pathname.startsWith("/images/") ||
        pathname.startsWith("/public/") ||
        pathname.includes(".svg") ||
        pathname.includes(".png") ||
        pathname.includes(".jpg") ||
        pathname.includes(".jpeg") ||
        pathname.includes(".gif") ||
        pathname.includes(".ico") ||
        pathname.includes(".css") ||
        pathname.includes(".js")
    ) {
        return NextResponse.next();
    }

    // Check if it's a public route
    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }

    // Check if it's a public API route
    if (publicApiRoutes.some((route) => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // Detect potential redirect loops - if we've been redirected multiple times
    const redirectCount = parseInt(
        request.headers.get("x-redirect-count") || "0"
    );
    if (redirectCount > 2) {
        console.log("Potential redirect loop detected, breaking loop");
        return NextResponse.next();
    }

    // Get token from cookies or authorization header
    const token =
        request.cookies.get("token")?.value ||
        request.headers.get("authorization")?.replace("Bearer ", "");

    console.log("Token check for", pathname, "- token exists:", !!token);

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
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.headers.set("x-redirect-count", String(redirectCount + 1));
        return response;
    }

    // Verify token
    const decoded = await verifyAuthToken(token);
    console.log("Token verification for", pathname, "- valid:", !!decoded);

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
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.headers.set("x-redirect-count", String(redirectCount + 1));
        return response;
    }

    console.log("Token verified for", pathname, "allowing access");

    // If user is authenticated and trying to access login page, redirect to dashboard
    // But only if the request is not coming from a redirect to prevent loops
    if (
        pathname === "/login" &&
        !referer?.includes("/login") &&
        redirectCount < 2
    ) {
        console.log(
            "Authenticated user on login page, redirecting to dashboard"
        );
        const response = NextResponse.redirect(
            new URL("/dashboard", request.url)
        );
        response.headers.set("x-redirect-count", String(redirectCount + 1));
        return response;
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
