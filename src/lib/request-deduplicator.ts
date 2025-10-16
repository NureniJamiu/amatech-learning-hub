/**
 * Request Deduplicator
 * Prevents race conditions in concurrent authentication requests
 */

interface PendingRequest<T> {
    promise: Promise<T>;
    timestamp: number;
}

export class RequestDeduplicator {
    private static pendingRequests = new Map<string, PendingRequest<any>>();
    private static readonly CACHE_TTL = 5000; // 5 seconds

    /**
     * Deduplicate concurrent requests with the same key
     * If a request with the same key is already in progress, return that promise
     */
    static async deduplicate<T>(
        key: string,
        fn: () => Promise<T>
    ): Promise<T> {
        // Clean up expired requests
        this.cleanup();

        // Check if request is already in progress
        const pending = this.pendingRequests.get(key);
        if (pending) {
            return pending.promise;
        }

        // Create new request
        const promise = fn().finally(() => {
            // Remove from pending after completion
            this.pendingRequests.delete(key);
        });

        // Store pending request
        this.pendingRequests.set(key, {
            promise,
            timestamp: Date.now(),
        });

        return promise;
    }

    /**
     * Clean up expired pending requests
     */
    private static cleanup(): void {
        const now = Date.now();
        for (const [key, request] of this.pendingRequests.entries()) {
            if (now - request.timestamp > this.CACHE_TTL) {
                this.pendingRequests.delete(key);
            }
        }
    }

    /**
     * Clear all pending requests (useful for testing)
     */
    static clear(): void {
        this.pendingRequests.clear();
    }
}
