"use client";

/**
 * Custom hooks for user management (admin only)
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, showApiError } from "@/lib/api-client";
import type { User } from "@/types";

// Query keys for React Query
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: UserFilters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// Types
export type UserFilters = {
  role?: string;
  level?: number;
  department?: string;
  search?: string;
  page?: number;
  limit?: number;
};

export type UserInput = {
  name: string;
  email: string;
  password?: string;
  matricNumber?: string;
  level?: number;
  currentSemester?: number;
  department?: string;
  faculty?: string;
  isAdmin?: boolean;
};

// Hook to fetch users with filters (admin only)
export function useUsers(filters: UserFilters = {}) {
  return useQuery({
    queryKey: userKeys.list(filters),
    queryFn: () =>
      apiClient.get<{ users: User[]; total: number }>("/admin/users", {
        params: filters,
      }),
  });
}

// Hook to fetch a single user by ID (admin only)
export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => apiClient.get<User>(`/admin/users/${id}`),
    enabled: !!id, // Only run if ID is provided
  });
}

// Hook to create a new user (admin only)
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: UserInput) =>
      apiClient.post<User>("/admin/users", userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      showApiError(error);
    },
  });
}

// Hook to update an existing user (admin only)
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UserInput> }) =>
      apiClient.put<User>(`/admin/users/${id}`, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      showApiError(error);
    },
  });
}

// Hook to delete a user (admin only)
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete<void>(`/admin/users/${id}`),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.removeQueries({ queryKey: userKeys.detail(id) });
    },
    onError: (error) => {
      showApiError(error);
    },
  });
}
