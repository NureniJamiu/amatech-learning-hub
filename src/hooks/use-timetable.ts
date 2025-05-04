import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, showApiError } from "@/lib/api-client";
import type { TimetableEntry } from "@/types";

// Query keys for React Query
export const timetableKeys = {
  all: ["timetable"] as const,
  user: (userId: string) => [...timetableKeys.all, "user", userId] as const,
};

// Types
export type TimetableEntryInput = {
  day: string;
  time: string;
  location: string;
  courseId: string;
};

// Hook to fetch user's timetable entries
export function useUserTimetable(userId: string) {
  return useQuery({
    queryKey: timetableKeys.user(userId),
    queryFn: () =>
      apiClient.get<TimetableEntry[]>(`/users/${userId}/timetable`),
    enabled: !!userId, // Only run if userId is provided
  });
}

// Hook to fetch current user's timetable entries
export function useCurrentUserTimetable() {
  return useQuery({
    queryKey: timetableKeys.user("current"),
    queryFn: () => apiClient.get<TimetableEntry[]>("/timetable"),
  });
}

// Hook to add a timetable entry
export function useAddTimetableEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entryData: TimetableEntryInput) =>
      apiClient.post<TimetableEntry>("/timetable", entryData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: timetableKeys.user("current"),
      });
    },
    onError: (error) => {
      showApiError(error);
    },
  });
}

// Hook to update a timetable entry
export function useUpdateTimetableEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<TimetableEntryInput>;
    }) => apiClient.put<TimetableEntry>(`/timetable/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: timetableKeys.user("current"),
      });
    },
    onError: (error) => {
      showApiError(error);
    },
  });
}

// Hook to delete a timetable entry
export function useDeleteTimetableEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete<void>(`/timetable/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: timetableKeys.user("current"),
      });
    },
    onError: (error) => {
      showApiError(error);
    },
  });
}
