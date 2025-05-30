"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, showApiError } from "@/lib/api-client";
import type { User } from "@/types";
import { useRouter } from "next/navigation";

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

// Hook to get the current authenticated user
export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.user,
    queryFn: () => apiClient.get<User | null>("/auth/me"),
    retry: false,
    // Don't show error for unauthenticated users
    throwOnError: false,
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
            localStorage.setItem("token", data.token);
            queryClient.setQueryData(authKeys.user, data.user);
            router.push("/dashboard");
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
                "/auth/register",
                userData
            ),
        onSuccess: (data) => {
            localStorage.setItem("token", data.token);
            queryClient.setQueryData(authKeys.user, data.user);
            router.push("/dashboard");
        },
        onError: (error) => {
            showApiError(error);
        },
    });
}

// Hook for user logout
export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => apiClient.post<void>("/auth/logout"),
    onSuccess: () => {
      queryClient.setQueryData(authKeys.user, null);
      queryClient.invalidateQueries();
      router.push("/login");
    },
    onError: (error) => {
      showApiError(error);
      // Even if the API call fails, we should clear the local state
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
