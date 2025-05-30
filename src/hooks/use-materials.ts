import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, showApiError } from "@/lib/api-client";
import type { Material, Material2 } from "@/types";

// Query keys for React Query
export const materialKeys = {
    all: ["materials"] as const,
    lists: () => [...materialKeys.all, "list"] as const,
    list: (filters: MaterialFilters) =>
        [...materialKeys.lists(), filters] as const,
    details: () => [...materialKeys.all, "detail"] as const,
    detail: (id: string) => [...materialKeys.details(), id] as const,
    byCourse: (courseId: string) =>
        [...materialKeys.all, "course", courseId] as const,
};

// Types
export type MaterialFilters = {
    courseId?: string;
    search?: string;
    page?: number;
    limit?: number;
};

export type MaterialInput = {
    title: string;
    courseId: string;
    file: string | null;
    type?: string;
};

// Hook to fetch materials with filters
export function useMaterials(filters: MaterialFilters = {}) {
    return useQuery({
        queryKey: materialKeys.list(filters),
        queryFn: () =>
            apiClient.get<{ materials: Material2[]; total: number }>(
                "/materials",
                {
                    params: filters,
                }
            ),
    });
}

// Hook to fetch materials for a specific course
export function useCoursesMaterials(courseId: string) {
    return useQuery({
        queryKey: materialKeys.byCourse(courseId),
        queryFn: () =>
            apiClient.get<Material[]>(`/courses/${courseId}/materials`),
        enabled: !!courseId, // Only run if courseId is provided
    });
}

// Hook to fetch a single material by ID
export function useMaterial(id: string) {
    return useQuery({
        queryKey: materialKeys.detail(id),
        queryFn: () => apiClient.get<Material>(`/materials/${id}`),
        enabled: !!id, // Only run if ID is provided
    });
}

// Hook to upload a new material
export function useUploadMaterial() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (materialData: MaterialInput) => {
            const formData = new FormData();
            formData.append("title", materialData.title);
            formData.append("courseId", materialData.courseId);
            if (materialData.file !== null) {
                formData.append("file", materialData.file);
            }
            const token =
                typeof window !== "undefined"
                    ? localStorage.getItem("token")
                    : null;

            // Use fetch directly for FormData
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "/api/v1"}/materials`,
                {
                    method: "POST",
                    body: formData,
                    credentials: "include",
                    headers: {
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw error;
            }

            return await response.json();
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: materialKeys.lists() });
            queryClient.invalidateQueries({
                queryKey: materialKeys.byCourse(data.courseId),
            });
        },
        onError: (error) => {
            showApiError(error);
        },
    });
}

// Hook to delete a material
export function useDeleteMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete<Material>(`/materials/${id}`),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: materialKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: materialKeys.lists(),
      });
      queryClient.removeQueries({ queryKey: materialKeys.detail(data.id) });
    },
    onError: (error) => {
      showApiError(error);
    },
  });
}
