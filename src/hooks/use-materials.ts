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
        staleTime: 1000 * 60 * 2, // 2 minutes
        gcTime: 1000 * 60 * 5, // 5 minutes
    });
}

// Hook to fetch materials for a specific course
export function useCoursesMaterials(courseId: string) {
    return useQuery({
        queryKey: materialKeys.byCourse(courseId),
        queryFn: () =>
            apiClient.get<Material[]>(`/courses/${courseId}/materials`),
        enabled: !!courseId, // Only run if courseId is provided
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    });
}

// Hook to fetch a single material by ID
export function useMaterial(id: string) {
    return useQuery({
        queryKey: materialKeys.detail(id),
        queryFn: () => apiClient.get<Material>(`/materials/${id}`),
        enabled: !!id, // Only run if ID is provided
        staleTime: 1000 * 60 * 10, // 10 minutes
        gcTime: 1000 * 60 * 15, // 15 minutes
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

            // Use apiClient for consistency
            return apiClient.post<Material2>("/materials", formData);
        },
        onMutate: async (newMaterial) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: materialKeys.lists() });
            await queryClient.cancelQueries({
                queryKey: materialKeys.byCourse(newMaterial.courseId)
            });

            // Snapshot the previous values
            const previousMaterials = queryClient.getQueryData(materialKeys.lists());
            const previousCourseMaterials = queryClient.getQueryData(
                materialKeys.byCourse(newMaterial.courseId)
            );

            // Optimistically update the materials list
            queryClient.setQueryData(
                materialKeys.lists(),
                (old: { materials: Material2[]; total: number } | undefined) => {
                    if (!old) return { materials: [], total: 0 };
                    const optimisticMaterial = {
                        id: 'temp-id',
                        title: newMaterial.title,
                        fileUrl: newMaterial.file || '',
                        fileType: 'pdf',
                        createdAt: new Date().toISOString(),
                        course: { code: 'Loading...', title: 'Loading...' },
                        uploadedBy: { id: 'temp', firstname: 'Loading', lastname: '', email: '' }
                    } as Material2;
                    return {
                        materials: [...old.materials, optimisticMaterial],
                        total: old.total + 1,
                    };
                }
            );

            // Optimistically update course materials
            queryClient.setQueryData(
                materialKeys.byCourse(newMaterial.courseId),
                (old: Material[] | undefined) => {
                    if (!old) return [];
                    const optimisticMaterial = {
                        id: 'temp-id',
                        title: newMaterial.title,
                        fileUrl: newMaterial.file || '',
                        fileType: 'pdf',
                    } as Material;
                    return [...old, optimisticMaterial];
                }
            );

            return { previousMaterials, previousCourseMaterials };
        },
        onError: (err, newMaterial, context) => {
            // Rollback on error
            if (context?.previousMaterials) {
                queryClient.setQueryData(materialKeys.lists(), context.previousMaterials);
            }
            if (context?.previousCourseMaterials) {
                queryClient.setQueryData(
                    materialKeys.byCourse(newMaterial.courseId),
                    context.previousCourseMaterials
                );
            }
            showApiError(err);
        },
        onSettled: (data, error, variables) => {
            // Always refetch after error or success
            queryClient.invalidateQueries({ queryKey: materialKeys.lists() });
            queryClient.invalidateQueries({
                queryKey: materialKeys.byCourse(variables.courseId)
            });
        },
    });
}

// Hook to delete a material
export function useDeleteMaterial() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => apiClient.delete<Material2>(`/materials/${id}`),
        onMutate: async (materialId) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: materialKeys.lists() });

            // Snapshot the previous value
            const previousMaterials = queryClient.getQueryData(materialKeys.lists());

            // Optimistically remove the material from lists
            queryClient.setQueryData(
                materialKeys.lists(),
                (old: { materials: Material2[]; total: number } | undefined) => {
                    if (!old) return old;
                    return {
                        materials: old.materials.filter(material => material.id !== materialId),
                        total: old.total - 1,
                    };
                }
            );

            return { previousMaterials };
        },
        onError: (err, materialId, context) => {
            // Rollback on error
            if (context?.previousMaterials) {
                queryClient.setQueryData(materialKeys.lists(), context.previousMaterials);
            }
            showApiError(err);
        },
        onSettled: (data, error, materialId) => {
            // Always refetch after error or success
            queryClient.invalidateQueries({ queryKey: materialKeys.lists() });
            // Remove the individual material from cache
            queryClient.removeQueries({ queryKey: materialKeys.detail(materialId) });
        },
    });
}
