"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, showApiError } from "@/lib/api-client";
import type { User } from "@/types";
import { useRouter } from "next/navigation";
import { cookieUtils } from "@/utils/cookies";

// Query keys for React Query
export const authKeys = {
    user: ["auth", "user"] as const,
};

// Types
export type LoginInput = {
    email: string;
    password: string;
};

export type RegisterInput = {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    matricNumber: string;
    level: number;
    department: string;
    faculty: string;
};

// Utility functions for user data management
export const userStorage = {
    getUser: (): User | null => {
        try {
            const userData = localStorage.getItem("user");
            const token =
                localStorage.getItem("token") || cookieUtils.get("token");

            if (!userData || !token) {
                return null;
            }

            return JSON.parse(userData) as User;
        } catch (error) {
            console.error("Error getting user from localStorage:", error);
            return null;
        }
    },

    setUser: (user: User, token: string) => {
        try {
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", token);
            // Note: HTTP-only cookie is set by the server in the login API
            console.log("User data stored in localStorage:", {
                user: user.email,
                level: user.level,
            });
        } catch (error) {
            console.error("Error storing user in localStorage:", error);
        }
    },

    clearUser: () => {
        try {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            // Note: HTTP-only cookie is cleared by the logout API
            console.log("User data cleared from localStorage");
        } catch (error) {
            console.error("Error clearing user from localStorage:", error);
        }
    },

    // Validate if user data and token exist
    isValid: (): boolean => {
        const userData = localStorage.getItem("user");
        const token = localStorage.getItem("token") || cookieUtils.get("token");
        return !!(userData && token);
    },
};

// Function to check if user is authenticated and handle token expiration
export const checkAuthStatus = (): {
    isAuthenticated: boolean;
    user: User | null;
} => {
    try {
        const user = userStorage.getUser();
        const token = localStorage.getItem("token") || cookieUtils.get("token");

        if (!user || !token) {
            return { isAuthenticated: false, user: null };
        }

        // Optional: Check if token is expired (if you're using JWT with expiration)
        // This is a basic check - you might want to decode the JWT and check expiration
        // For now, we'll just check if the token exists

        return { isAuthenticated: true, user };
    } catch (error) {
        console.error("Error checking auth status:", error);
        return { isAuthenticated: false, user: null };
    }
};

// Hook to get the current authenticated user
export function useCurrentUser() {
    return useQuery({
        queryKey: authKeys.user,
        queryFn: () => {
            const { user } = checkAuthStatus();
            console.log(
                "useCurrentUser - Retrieved user from localStorage:",
                user ? { email: user.email, level: user.level } : null
            );
            return user;
        },
        retry: false,
        // Don't show error for unauthenticated users
        throwOnError: false,
        // Disable automatic refetching to prevent unnecessary calls
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        // Cache the data for a reasonable time
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

// Hook for user login
export function useLogin() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: (credentials: LoginInput) =>
            apiClient.post<{ user: User; token: string }>(
                "/auth/login",
                credentials
            ),
        onSuccess: (data) => {
            // Store both token and user data in localStorage using utility
            userStorage.setUser(data.user, data.token);
            queryClient.setQueryData(authKeys.user, data.user);

            // Use window.location for a clean redirect to avoid any router issues
            window.location.href = "/dashboard";
        },
        onError: (error) => {
            showApiError(error);
        },
    });
}

// Hook for user registration
export function useRegister() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: (userData: RegisterInput) =>
            apiClient.post<{ user: User; token: string }>(
                "/auth/signup",
                userData
            ),
        onSuccess: (data) => {
            // Store both token and user data in localStorage using utility
            userStorage.setUser(data.user, data.token);
            queryClient.setQueryData(authKeys.user, data.user);
            router.push("/dashboard");
        },
        onError: (error) => {
            showApiError(error);
        },
    });
}

// Simple logout function that can be called directly
export const logout = async () => {
    try {
        // Call the logout API to clear the HTTP-only cookie
        try {
            await fetch("/api/v1/auth/logout", {
                method: "POST",
                credentials: "include", // Include cookies
            });
        } catch (apiError) {
            console.warn("Could not call logout API:", apiError);
            // Continue with client-side cleanup even if API call fails
        }

        // Clear localStorage
        userStorage.clearUser();

        console.log("User logged out successfully");

        // Redirect to login page
        if (typeof window !== "undefined") {
            window.location.href = "/login";
        }
    } catch (error) {
        console.error("Logout error:", error);
    }
};

// Hook for user logout (with React Query)
export function useLogout() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: async () => {
            // Call the logout API to clear the HTTP-only cookie
            return apiClient.post("/auth/logout", {});
        },
        onSuccess: () => {
            // Clear both token and user data from localStorage using utility
            userStorage.clearUser();
            queryClient.setQueryData(authKeys.user, null);
            queryClient.invalidateQueries();
            console.log("User logged out successfully");
            router.push("/login");
        },
        onError: (error) => {
            console.error("Logout error:", error);
            // Even if there's an error, we should clear the local state
            userStorage.clearUser();
            queryClient.setQueryData(authKeys.user, null);
            router.push("/login");
        },
    });
}

// Hook to check if user is authenticated
export function useIsAuthenticated() {
  const { data: user, isLoading } = useCurrentUser();
  return {
    isAuthenticated: !!user,
    isLoading,
    user,
  };
}

// Hook to protect routes that require authentication
export function useRequireAuth(redirectTo = "/login") {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useIsAuthenticated();

  if (!isLoading && !isAuthenticated) {
    router.push(redirectTo);
  }

  return { isLoading, user };
}

// Hook to protect routes that require admin access
export function useRequireAdmin(redirectTo = "/dashboard") {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useIsAuthenticated();

  if (!isLoading && (!isAuthenticated || !user?.isAdmin)) {
    router.push(redirectTo);
  }

  return { isLoading, user };
}
