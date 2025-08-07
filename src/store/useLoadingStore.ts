"use client";

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

/**
 * Global loading state management
 * Tracks loading states for different operations across the app
 */

export type LoadingOperation =
  | "auth.login"
  | "auth.signup"
  | "auth.logout"
  | "courses.fetch"
  | "courses.create"
  | "courses.update"
  | "courses.delete"
  | "materials.fetch"
  | "materials.upload"
  | "materials.delete"
  | "tutors.fetch"
  | "tutors.create"
  | "tutors.update"
  | "tutors.delete"
  | "users.fetch"
  | "users.update"
  | "file.upload"
  | string; // Allow custom operations

interface LoadingState {
  // Current loading operations
  operations: Set<LoadingOperation>;

  // Actions
  startLoading: (operation: LoadingOperation) => void;
  stopLoading: (operation: LoadingOperation) => void;
  isLoading: (operation?: LoadingOperation) => boolean;
  getLoadingOperations: () => LoadingOperation[];
  clearAll: () => void;
}

export const useLoadingStore = create<LoadingState>()(
  subscribeWithSelector((set, get) => ({
    operations: new Set(),

    startLoading: (operation: LoadingOperation) => {
      set((state) => ({
        operations: new Set([...state.operations, operation])
      }));
    },

    stopLoading: (operation: LoadingOperation) => {
      set((state) => {
        const newOperations = new Set(state.operations);
        newOperations.delete(operation);
        return { operations: newOperations };
      });
    },

    isLoading: (operation?: LoadingOperation) => {
      const { operations } = get();
      if (operation) {
        return operations.has(operation);
      }
      return operations.size > 0;
    },

    getLoadingOperations: () => {
      return Array.from(get().operations);
    },

    clearAll: () => {
      set({ operations: new Set() });
    },
  }))
);

/**
 * Hook for managing loading state of specific operations
 */
export function useLoading(operation: LoadingOperation) {
  const { startLoading, stopLoading, isLoading } = useLoadingStore();

  return {
    isLoading: isLoading(operation),
    startLoading: () => startLoading(operation),
    stopLoading: () => stopLoading(operation),
    withLoading: async <T>(asyncFn: () => Promise<T>): Promise<T> => {
      startLoading(operation);
      try {
        const result = await asyncFn();
        return result;
      } finally {
        stopLoading(operation);
      }
    },
  };
}

/**
 * Hook for global loading state
 */
export function useGlobalLoading() {
  const { isLoading, getLoadingOperations, clearAll } = useLoadingStore();

  return {
    isLoading: isLoading(),
    loadingOperations: getLoadingOperations(),
    clearAll,
  };
}

/**
 * Higher-order function to wrap async operations with loading state
 */
export function withLoadingState<T extends any[], R>(
  operation: LoadingOperation,
  asyncFn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    const { startLoading, stopLoading } = useLoadingStore.getState();

    startLoading(operation);
    try {
      const result = await asyncFn(...args);
      return result;
    } finally {
      stopLoading(operation);
    }
  };
}
