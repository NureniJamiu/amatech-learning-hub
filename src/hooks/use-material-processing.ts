"use client";

import { useQuery, useMutation } from '@tanstack/react-query';

export interface MaterialProcessingStatus {
  id: string;
  title: string;
  processed: boolean;
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
  chunksCount: number;
}

export interface ProcessingResponse {
  success: boolean;
  message?: string;
  chunksCreated?: number;
  error?: string;
}

/**
 * Hook for checking material processing status
 */
export function useMaterialProcessingStatus(materialId?: string) {
  return useQuery({
    queryKey: ['materialProcessingStatus', materialId],
    queryFn: async (): Promise<MaterialProcessingStatus> => {
      if (!materialId) {
        throw new Error('Material ID is required');
      }

      const response = await fetch(`/api/v1/materials/process?materialId=${materialId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get processing status');
      }

      const data = await response.json();
      return data.material;
    },
    enabled: !!materialId,
    refetchInterval: (query) => {
      // Poll every 2 seconds if still processing
      if (query.state.data?.processingStatus === 'processing') {
        return 2000;
      }
      return false;
    },
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for processing a material for RAG
 */
export function useProcessMaterial() {
  return useMutation({
    mutationFn: async (materialId: string): Promise<ProcessingResponse> => {
      const response = await fetch('/api/v1/materials/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ materialId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process material');
      }

      return response.json();
    },
  });
}
