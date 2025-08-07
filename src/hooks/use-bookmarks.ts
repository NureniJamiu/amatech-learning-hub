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

// Hook to fetch user's bookmarks (optimized)
export function useUserBookmarks(userId: string) {
  return useQuery({
    queryKey: bookmarkKeys.user(userId),
    queryFn: () => apiClient.get<Bookmark[]>(`/users/${userId}/bookmarks`),
    enabled: !!userId, // Only run if userId is provided
    staleTime: 1000 * 60 * 10, // 10 minutes (bookmarks don't change often)
    gcTime: 1000 * 60 * 30, // 30 minutes
    placeholderData: (previousData) => previousData,
  });
}

// Hook to fetch current user's bookmarks (optimized)
export function useCurrentUserBookmarks() {
  return useQuery({
    queryKey: bookmarkKeys.user("current"),
    queryFn: () => apiClient.get<Bookmark[]>("/bookmarks"),
    staleTime: 1000 * 60 * 10, // 10 minutes (bookmarks don't change often)
    gcTime: 1000 * 60 * 30, // 30 minutes
    placeholderData: (previousData) => previousData,
  });
}

// Hook to add a bookmark (optimized)
export function useAddBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookmarkData: BookmarkInput) =>
      apiClient.post<Bookmark>("/bookmarks", bookmarkData),
    onMutate: async (newBookmark) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: bookmarkKeys.user("current") });

      // Snapshot the previous value
      const previousBookmarks = queryClient.getQueryData(bookmarkKeys.user("current"));

      // Optimistically update
      queryClient.setQueryData(
        bookmarkKeys.user("current"),
        (old: Bookmark[] | undefined) => {
          if (!old) return [{ ...newBookmark, id: "temp-id" } as Bookmark];
          return [...old, { ...newBookmark, id: "temp-id" } as Bookmark];
        }
      );

      return { previousBookmarks };
    },
    onError: (err, newBookmark, context) => {
      // Rollback on error
      if (context?.previousBookmarks) {
        queryClient.setQueryData(bookmarkKeys.user("current"), context.previousBookmarks);
      }
      showApiError(err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.user("current") });
    },
  });
}

// Hook to update a bookmark (optimized)
export function useUpdateBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BookmarkInput> }) =>
      apiClient.put<Bookmark>(`/bookmarks/${id}`, data),
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: bookmarkKeys.user("current") });

      // Snapshot the previous value
      const previousBookmarks = queryClient.getQueryData(bookmarkKeys.user("current"));

      // Optimistically update
      queryClient.setQueryData(
        bookmarkKeys.user("current"),
        (old: Bookmark[] | undefined) => {
          if (!old) return old;
          return old.map((bookmark) =>
              bookmark.id === id ? { ...bookmark, ...data } : bookmark
          );
        }
      );

      return { previousBookmarks };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousBookmarks) {
        queryClient.setQueryData(bookmarkKeys.user("current"), context.previousBookmarks);
      }
      showApiError(err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.user("current") });
    },
  });
}

// Hook to delete a bookmark (optimized)
export function useDeleteBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete<void>(`/bookmarks/${id}`),
    onMutate: async (bookmarkId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: bookmarkKeys.user("current") });

      // Snapshot the previous value
      const previousBookmarks = queryClient.getQueryData(bookmarkKeys.user("current"));

      // Optimistically remove
      queryClient.setQueryData(
        bookmarkKeys.user("current"),
        (old: Bookmark[] | undefined) => {
          if (!old) return old;
          return old.filter(bookmark => bookmark.id !== bookmarkId);
        }
      );

      return { previousBookmarks };
    },
    onError: (err, bookmarkId, context) => {
      // Rollback on error
      if (context?.previousBookmarks) {
        queryClient.setQueryData(bookmarkKeys.user("current"), context.previousBookmarks);
      }
      showApiError(err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.user("current") });
    },
  });
}
