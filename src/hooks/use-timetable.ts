import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, showApiError } from "@/lib/api-client";
import type { TimetableEntry } from "@/types";

// Query keys for React Query
export const timetableKeys = {
    all: ["timetable"] as const,
    user: (userId: string) => [...timetableKeys.all, "user", userId] as const,
    userSemester: (userId: string, semester: number) =>
        [...timetableKeys.all, "user", userId, "semester", semester] as const,
};

// Types
export type TimetableEntryInput = {
    day: string;
    time: string;
    location: string;
    semester: number;
    courseId: string;
};

// Hook to fetch user's timetable entries (all semesters)
export function useUserTimetable(userId: string) {
    return useQuery({
        queryKey: timetableKeys.user(userId),
        queryFn: () =>
            apiClient.get<TimetableEntry[]>(`/users/${userId}/timetable`),
        enabled: !!userId, // Only run if userId is provided
    });
}

// Hook to fetch current user's timetable entries (optimized)
export function useCurrentUserTimetable() {
    return useQuery({
        queryKey: timetableKeys.user("current"),
        queryFn: () => apiClient.get<TimetableEntry[]>("/timetable"),
        staleTime: 1000 * 60 * 10, // 10 minutes (timetable is relatively stable)
        gcTime: 1000 * 60 * 30, // 30 minutes
        placeholderData: (previousData) => previousData,
    });
}

// Hook to fetch current user's timetable entries for a specific semester (optimized)
export function useCurrentUserTimetableBySemester(semester: number) {
    return useQuery({
        queryKey: timetableKeys.userSemester("current", semester),
        queryFn: () =>
            apiClient.get<TimetableEntry[]>(`/timetable?semester=${semester}`),
        enabled: !!semester,
        staleTime: 1000 * 60 * 15, // 15 minutes (semester-specific data is more stable)
        gcTime: 1000 * 60 * 60, // 1 hour
        placeholderData: (previousData) => previousData,
    });
}

// Hook to add a timetable entry
export function useAddTimetableEntry() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (entryData: TimetableEntryInput) =>
            apiClient.post<TimetableEntry>("/timetable", entryData),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: timetableKeys.user("current"),
            });
            queryClient.invalidateQueries({
                queryKey: timetableKeys.userSemester("current", data.semester),
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
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: timetableKeys.user("current"),
            });
            queryClient.invalidateQueries({
                queryKey: timetableKeys.userSemester("current", data.semester),
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
            // Also invalidate all semester-specific queries
            queryClient.invalidateQueries({
                queryKey: [...timetableKeys.all, "user", "current", "semester"],
            });
        },
        onError: (error) => {
            showApiError(error);
        },
    });
}
