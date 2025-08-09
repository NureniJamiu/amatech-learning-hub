import { redirect } from "next/navigation";
import { userStorage } from "@/hooks/use-auth";
import { cookieUtils } from "@/utils/cookies";

/**
 * Check if user is authenticated on the server side
 * Use this in server components or API routes
 */
export const checkServerAuth = () => {
    // This would be used in server components
    // For now, we'll return a simple check
    return { isAuthenticated: false, user: null };
};

/**
 * Redirect to login if not authenticated
 * Use this in client components
 */
export const requireAuth = () => {
    if (typeof window === "undefined") return;

    const user = userStorage.getUser();
    const token = localStorage.getItem("token") || cookieUtils.get("token");

    if (!user || !token) {
        window.location.href = "/login";
    }
};

/**
 * Redirect to dashboard if already authenticated
 * Use this on login/signup pages
 */
export const redirectIfAuthenticated = () => {
    if (typeof window === "undefined") return;

    // Use a timeout to avoid conflicts with React rendering
    setTimeout(() => {
        // Check if user data and token exist using the same logic as userStorage
        const userData = localStorage.getItem("user");
        const token = localStorage.getItem("token") || cookieUtils.get("token");

        // Only redirect if both user data and token are present and valid
        if (userData && token) {
            try {
                const user = JSON.parse(userData);
                // Additional check: make sure the user object has required properties
                if (user && user.id && user.email) {
                    window.location.href = "/dashboard";
                } else {
                    // Clear invalid data
                    userStorage.clearUser();
                }
            } catch (error) {
                // Clear corrupted data
                userStorage.clearUser();
            }
        }
    }, 100);
};

/**
 * Get user role for authorization checks
 */
export const getUserRole = () => {
    const user = userStorage.getUser();
    return user?.isAdmin ? "admin" : "student";
};

/**
 * Check if user has admin privileges
 */
export const isAdmin = () => {
    const user = userStorage.getUser();
    return user?.isAdmin === true;
};

/**
 * Check if user can access a specific level
 */
export const canAccessLevel = (level: number) => {
    const user = userStorage.getUser();
    if (!user) return false;

    // Admins can access all levels
    if (isAdmin()) return true;

    // Students can only access their own level
    return user.level === level;
};
