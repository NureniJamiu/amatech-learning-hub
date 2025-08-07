"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type ReactNode } from "react";

interface QueryProviderProps {
    children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 1000 * 60 * 5, // 5 minutes - data is fresh for 5 minutes
                        gcTime: 1000 * 60 * 10, // 10 minutes - keep in cache for 10 minutes
                        retry: 1, // Only retry once on failure
                        refetchOnWindowFocus: false, // Don't refetch when window regains focus
                        refetchOnReconnect: true, // Refetch when reconnecting to network
                    },
                    mutations: {
                        retry: 1, // Only retry mutations once
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
