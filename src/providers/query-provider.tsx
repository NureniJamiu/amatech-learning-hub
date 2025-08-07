"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useMemo, type ReactNode } from "react";

interface QueryProviderProps {
    children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
    const queryClient = useMemo(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 1000 * 60 * 5, // 5 minutes - data is fresh for 5 minutes
                        gcTime: 1000 * 60 * 15, // 15 minutes - keep in cache for 15 minutes (increased)
                        retry: (failureCount, error: any) => {
                            // Don't retry on 4xx errors (client errors)
                            if (error?.status >= 400 && error?.status < 500) {
                                return false;
                            }
                            // Retry up to 2 times for other errors
                            return failureCount < 2;
                        },
                        retryDelay: (attemptIndex) =>
                            Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff with max delay
                        refetchOnWindowFocus: false, // Don't refetch when window regains focus
                        refetchOnReconnect: true, // Refetch when reconnecting to network
                        refetchOnMount: false, // Don't refetch on mount if data exists and is not stale
                        // Network mode optimizations
                        networkMode: "online", // Only run queries when online
                    },
                    mutations: {
                        retry: (failureCount, error: any) => {
                            // Don't retry mutations on 4xx errors
                            if (error?.status >= 400 && error?.status < 500) {
                                return false;
                            }
                            return failureCount < 1;
                        },
                        retryDelay: (attemptIndex) =>
                            Math.min(1000 * 2 ** attemptIndex, 5000),
                        networkMode: "online",
                    },
                },
            }),
        []
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
