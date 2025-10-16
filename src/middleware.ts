import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuthToken } from "@/utils/token";
import { MaintenanceMode } from "@/lib/maintenance-mode";

/**
 * Base64 URL decode helper (for token inspection)
 */
function base64UrlDecode(data: string): string {
    const padding = "=".repeat((4 - (data.length % 4)) % 4);
    const base64 = data.replace(/-/g, "+").replace(/_/g, "/") + padding;
    return atob(base64);
}

// Routes that don't require authentication
const publicRoutes = ["/", "/login", "/signup", "/forgot-password"];

// Routes that require admin access
const adminRoutes = ["/admin"];

// API routes that don't require authentication
const publicApiRoutes = ["/api/v1/auth/login", "/api/v1/auth/signup", "/api/health"];

// Routes that are accessible during maintenance mode
const maintenanceExemptRoutes = ["/api/health", "/maintenance"];

// Maximum number of redirects before breaking the loop
const MAX_REDIRECT_COUNT = 3;

// Cookie name for redirect loop prevention
const REDIRECT_COOKIE_NAME = "x-redirect-count";
const REDIRECT_COOKIE_MAX_AGE = 60; // 60 seconds

/**
 * Check if the request is for an API route
 */
function isApiRoute(pathname: string): boolean {
    return pathname.startsWith("/api/");
}

/**
 * Check if the request is for a static asset
 */
function isStaticAsset(pathname: string): boolean {
    return (
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
        pathname.includes(".js") ||
        pathname.includes(".woff") ||
        pathname.includes(".woff2") ||
        pathname.includes(".ttf") ||
        pathname.includes(".eot")
    );
}

/**
 * Get redirect count from cookie
 */
function getRedirectCount(request: NextRequest): number {
    const count = request.cookies.get(REDIRECT_COOKIE_NAME)?.value;
    return count ? parseInt(count, 10) : 0;
}

/**
 * Create response with redirect count cookie
 */
function setRedirectCount(response: NextResponse, count: number): NextResponse {
    response.cookies.set(REDIRECT_COOKIE_NAME, String(count), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: REDIRECT_COOKIE_MAX_AGE,
        path: "/",
    });
    return response;
}

/**
 * Clear redirect count cookie
 */
function clearRedirectCount(response: NextResponse): NextResponse {
    response.cookies.delete(REDIRECT_COOKIE_NAME);
    return response;
}

/**
 * Handle missing or invalid token for API routes
 */
function handleApiAuthError(
    message: string, 
    statusCode: 401 | 403 = 401,
    errorType: "MISSING_TOKEN" | "MALFORMED_TOKEN" | "EXPIRED_TOKEN" | "INVALID_TOKEN" | "FORBIDDEN" = "INVALID_TOKEN"
): NextResponse {
    return NextResponse.json(
        {
            success: false,
            error: message,
            code: statusCode === 401 ? "UNAUTHORIZED" : "FORBIDDEN",
            errorType,
            timestamp: new Date().toISOString(),
        },
        { status: statusCode }
    );
}

/**
 * Handle missing or invalid token for page routes
 */
function handlePageAuthError(request: NextRequest, redirectCount: number): NextResponse {
    const { pathname } = request.nextUrl;
    
    // If already on login page, allow access
    if (pathname === "/login" || pathname === "/signup") {
        return NextResponse.next();
    }
    
    // Check for redirect loop
    if (redirectCount >= MAX_REDIRECT_COUNT) {
        console.error(`[Middleware] Redirect loop detected for ${pathname}`);
        // Break the loop by allowing the request through
        const response = NextResponse.next();
        return clearRedirectCount(response);
    }
    
    // Redirect to login with return URL
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") {
        loginUrl.searchParams.set("returnUrl", pathname);
    }
    
    const response = NextResponse.redirect(loginUrl);
    return setRedirectCount(response, redirectCount + 1);
}

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

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isApi = isApiRoute(pathname);

    // Skip middleware for static files and Next.js internals
    if (isStaticAsset(pathname)) {
        return NextResponse.next();
    }

    // Check maintenance mode (before authentication)
    // Allow health check and maintenance page during maintenance
    const isMaintenanceExempt = maintenanceExemptRoutes.some((route) => 
        pathname.startsWith(route)
    );

    if (!isMaintenanceExempt) {
        const maintenanceEnabled = await MaintenanceMode.isEnabled();
        
        if (maintenanceEnabled) {
            // Extract token to check if user is admin
            const token = extractToken(request);
            let isAdmin = false;

            if (token) {
                try {
                    const decoded = await verifyAuthToken(token);
                    if (decoded) {
                        // Check if user is admin
                        isAdmin = await MaintenanceMode.isUserAllowed(decoded.userId);
                    }
                } catch (error) {
                    // Token verification failed, user is not admin
                    isAdmin = false;
                }
            }

            // If not admin, return maintenance response
            if (!isAdmin) {
                if (isApi) {
                    return NextResponse.json(
                        {
                            success: false,
                            error: 'System is under maintenance',
                            code: 'MAINTENANCE_MODE',
                            message: 'The system is currently under maintenance. Please try again later.',
                            timestamp: new Date().toISOString(),
                        },
                        { 
                            status: 503,
                            headers: {
                                'Retry-After': '3600', // Suggest retry after 1 hour
                            },
                        }
                    );
                } else {
                    // Redirect to maintenance page
                    return NextResponse.redirect(new URL('/maintenance', request.url));
                }
            }
        }
    }

    // Check if it's a public route
    if (publicRoutes.includes(pathname)) {
        const response = NextResponse.next();
        return clearRedirectCount(response);
    }

    // Check if it's a public API route
    if (publicApiRoutes.some((route) => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // Get redirect count for loop prevention
    const redirectCount = getRedirectCount(request);
    
    // Log authentication attempts for debugging (only in development)
    if (process.env.NODE_ENV === "development") {
        console.log(`[Middleware] ${isApi ? "API" : "Page"} request to ${pathname}, redirect count: ${redirectCount}`);
    }

    // Extract token from request
    const token = extractToken(request);

    // If no token, handle authentication error
    if (!token) {
        if (isApiRoute(pathname)) {
            return handleApiAuthError(
                "Authentication required. Please provide a valid token.",
                401,
                "MISSING_TOKEN"
            );
        }
        return handlePageAuthError(request, redirectCount);
    }

    // Validate token format before verification
    const tokenParts = token.split(".");
    if (tokenParts.length !== 3) {
        if (isApiRoute(pathname)) {
            return handleApiAuthError(
                "Malformed token. Token must be a valid JWT.",
                401,
                "MALFORMED_TOKEN"
            );
        }
        return handlePageAuthError(request, redirectCount);
    }

    // Verify token
    let decoded;
    let tokenError: "EXPIRED" | "INVALID" | null = null;
    
    try {
        decoded = await verifyAuthToken(token);
        
        // Check if token is expired by examining the payload
        if (!decoded) {
            try {
                const payload = JSON.parse(base64UrlDecode(tokenParts[1]));
                const now = Math.floor(Date.now() / 1000);
                if (payload.exp && payload.exp < now) {
                    tokenError = "EXPIRED";
                } else {
                    tokenError = "INVALID";
                }
            } catch {
                tokenError = "INVALID";
            }
        }
    } catch (error) {
        console.error("[Middleware] Token verification error:", error);
        decoded = null;
        tokenError = "INVALID";
    }

    // Handle invalid or expired token
    if (!decoded) {
        if (isApiRoute(pathname)) {
            if (tokenError === "EXPIRED") {
                return handleApiAuthError(
                    "Token has expired. Please log in again.",
                    401,
                    "EXPIRED_TOKEN"
                );
            }
            return handleApiAuthError(
                "Invalid token. Please log in again.",
                401,
                "INVALID_TOKEN"
            );
        }
        return handlePageAuthError(request, redirectCount);
    }

    // Token is valid - clear redirect count
    const response = NextResponse.next();
    clearRedirectCount(response);

    // If user is authenticated and trying to access auth pages, redirect to dashboard
    if (pathname === "/login" || pathname === "/signup") {
        // Check for redirect loop
        if (redirectCount >= MAX_REDIRECT_COUNT) {
            console.error(`[Middleware] Redirect loop detected on auth page ${pathname}`);
            return response;
        }
        
        const dashboardResponse = NextResponse.redirect(new URL("/dashboard", request.url));
        return setRedirectCount(dashboardResponse, redirectCount + 1);
    }

    // Check admin routes - verify user has admin privileges
    if (adminRoutes.some((route) => pathname.startsWith(route))) {
        // For admin routes, we need to check if user is admin
        // This requires a database lookup, which we'll handle in the API route
        // For now, we'll pass the request through and let the route handle authorization
        // Add a header to indicate this is an admin route
        response.headers.set("x-admin-route", "true");
    }

    // Add user info to request headers for downstream use
    response.headers.set("x-user-id", decoded.userId);
    
    // Add token expiration info for potential refresh logic
    try {
        const payload = JSON.parse(base64UrlDecode(tokenParts[1]));
        if (payload.exp) {
            response.headers.set("x-token-exp", String(payload.exp));
        }
    } catch {
        // Ignore parsing errors
    }

    return response;
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
