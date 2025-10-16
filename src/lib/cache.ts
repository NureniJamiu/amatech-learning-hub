/**
 * In-Memory Cache Service
 * 
 * Provides simple in-memory caching with TTL support.
 * For production, consider using Redis or similar for distributed caching.
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class CacheService {
  private cache: Map<string, CacheEntry<any>>;
  private cleanupInterval: NodeJS.Timeout | null;

  constructor() {
    this.cache = new Map();
    this.cleanupInterval = null;
    this.startCleanup();
  }

  /**
   * Set a value in the cache with TTL in seconds
   */
  set<T>(key: string, value: T, ttlSeconds: number): void {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { data: value, expiresAt });
  }

  /**
   * Get a value from the cache
   * Returns null if not found or expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Check if a key exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Delete a specific key from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Delete all keys matching a pattern
   */
  deletePattern(pattern: string): number {
    let count = 0;
    const regex = new RegExp(pattern);
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
        count++;
      }
    }
    
    return count;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    let validEntries = 0;
    let expiredEntries = 0;
    const now = Date.now();

    for (const entry of this.cache.values()) {
      if (now > entry.expiresAt) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    }

    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries,
    };
  }

  /**
   * Start periodic cleanup of expired entries
   */
  private startCleanup(): void {
    // Run cleanup every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  /**
   * Remove expired entries from cache
   */
  private cleanup(): void {
    const now = Date.now();
    let removed = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        removed++;
      }
    }

    if (removed > 0) {
      console.log(`[Cache] Cleaned up ${removed} expired entries`);
    }
  }

  /**
   * Stop cleanup interval (for testing or shutdown)
   */
  stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}

// Singleton instance
const cacheService = new CacheService();

/**
 * Cache key builders for different data types
 */
export const CacheKeys = {
  course: (courseId: string) => `course:${courseId}`,
  courseList: (filters: string) => `courses:list:${filters}`,
  material: (materialId: string) => `material:${materialId}`,
  materialStatus: (materialId: string) => `material:status:${materialId}`,
  materialList: (filters: string) => `materials:list:${filters}`,
  pastQuestion: (pqId: string) => `pastquestion:${pqId}`,
  pastQuestionList: (filters: string) => `pastquestions:list:${filters}`,
  tutor: (tutorId: string) => `tutor:${tutorId}`,
  tutorList: () => `tutors:list`,
  user: (userId: string) => `user:${userId}`,
  analytics: (type: string) => `analytics:${type}`,
  dashboard: (userId: string) => `dashboard:${userId}`,
};

/**
 * Cache TTL constants (in seconds)
 */
export const CacheTTL = {
  COURSE: 3600, // 1 hour
  COURSE_LIST: 1800, // 30 minutes
  MATERIAL_STATUS: 300, // 5 minutes
  MATERIAL: 1800, // 30 minutes
  MATERIAL_LIST: 600, // 10 minutes
  PAST_QUESTION: 3600, // 1 hour
  PAST_QUESTION_LIST: 1800, // 30 minutes
  TUTOR: 3600, // 1 hour
  TUTOR_LIST: 1800, // 30 minutes
  USER: 600, // 10 minutes
  ANALYTICS: 1800, // 30 minutes
  DASHBOARD: 300, // 5 minutes
};

/**
 * Cache invalidation helpers
 */
export const CacheInvalidation = {
  /**
   * Invalidate all course-related caches
   */
  invalidateCourse(courseId?: string): void {
    if (courseId) {
      cacheService.delete(CacheKeys.course(courseId));
    }
    cacheService.deletePattern('^courses:list:');
    cacheService.deletePattern('^analytics:');
  },

  /**
   * Invalidate all material-related caches
   */
  invalidateMaterial(materialId?: string): void {
    if (materialId) {
      cacheService.delete(CacheKeys.material(materialId));
      cacheService.delete(CacheKeys.materialStatus(materialId));
    }
    cacheService.deletePattern('^materials:list:');
    cacheService.deletePattern('^analytics:');
  },

  /**
   * Invalidate all past question-related caches
   */
  invalidatePastQuestion(pqId?: string): void {
    if (pqId) {
      cacheService.delete(CacheKeys.pastQuestion(pqId));
    }
    cacheService.deletePattern('^pastquestions:list:');
    cacheService.deletePattern('^analytics:');
  },

  /**
   * Invalidate all tutor-related caches
   */
  invalidateTutor(tutorId?: string): void {
    if (tutorId) {
      cacheService.delete(CacheKeys.tutor(tutorId));
    }
    cacheService.delete(CacheKeys.tutorList());
    cacheService.deletePattern('^courses:');
  },

  /**
   * Invalidate user-related caches
   */
  invalidateUser(userId: string): void {
    cacheService.delete(CacheKeys.user(userId));
    cacheService.delete(CacheKeys.dashboard(userId));
  },

  /**
   * Invalidate all analytics caches
   */
  invalidateAnalytics(): void {
    cacheService.deletePattern('^analytics:');
  },
};

/**
 * Wrapper function for caching async operations
 */
export async function withCache<T>(
  key: string,
  ttlSeconds: number,
  fetchFn: () => Promise<T>
): Promise<T> {
  // Try to get from cache
  const cached = cacheService.get<T>(key);
  if (cached !== null) {
    console.log(`[Cache] Hit: ${key}`);
    return cached;
  }

  // Cache miss - fetch data
  console.log(`[Cache] Miss: ${key}`);
  const data = await fetchFn();
  
  // Store in cache
  cacheService.set(key, data, ttlSeconds);
  
  return data;
}

export default cacheService;
