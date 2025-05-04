import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, showApiError } from "@/lib/api-client";
import type { Bookmark } from "@/types";

// Query keys for React Query
export const bookmarkKeys = {
  all: ["bookmarks"] as const,
  user: (userId: string) => [...bookmarkKeys.all, "user", userId] as const,
};

// Types
export type BookmarkInput = {
  title: string;
  url: string;
  icon: string;
};

// Hook to fetch user's bookmarks
export function useUserBookmarks(userId: string) {
  return useQuery({
    queryKey: bookmarkKeys.user(userId),
    queryFn: () => apiClient.get<Bookmark[]>(`/users/${userId}/bookmarks`),
    enabled: !!userId, // Only run if userId is provided
  });
}

// Hook to fetch current user's bookmarks
export function useCurrentUserBookmarks() {
  return useQuery({
    queryKey: bookmarkKeys.user("current"),
    queryFn: () => apiClient.get<Bookmark[]>("/bookmarks"),
  });
}

// Hook to add a bookmark
export function useAddBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookmarkData: BookmarkInput) =>
      apiClient.post<Bookmark>("/bookmarks", bookmarkData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.user("current") });
    },
    onError: (error) => {
      showApiError(error);
    },
  });
}

// Hook to update a bookmark
export function useUpdateBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BookmarkInput> }) =>
      apiClient.put<Bookmark>(`/bookmarks/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.user("current") });
    },
    onError: (error) => {
      showApiError(error);
    },
  });
}

// Hook to delete a bookmark
export function useDeleteBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete<void>(`/bookmarks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.user("current") });
    },
    onError: (error) => {
      showApiError(error);
    },
  });
}
