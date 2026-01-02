/**
 * Simple in-memory cache with TTL (Time To Live) support
 * Cache is cleared on page refresh/reload
 */

interface CacheEntry<T> {
    data: T;
    expiresAt: number;
}

class Cache {
    private cache: Map<string, CacheEntry<any>> = new Map();

    /**
     * Get a value from cache
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
     * Set a value in cache with TTL in seconds
     */
    set<T>(key: string, data: T, ttlSeconds: number): void {
        const expiresAt = Date.now() + (ttlSeconds * 1000);
        this.cache.set(key, { data, expiresAt });
    }

    /**
     * Invalidate (delete) a specific cache key
     */
    invalidate(key: string): void {
        this.cache.delete(key);
    }

    /**
     * Invalidate all cache keys matching a pattern
     */
    invalidatePattern(pattern: string): void {
        const keys = Array.from(this.cache.keys());
        keys.forEach(key => {
            if (key.includes(pattern)) {
                this.cache.delete(key);
            }
        });
    }

    /**
     * Clear all cache
     */
    clear(): void {
        this.cache.clear();
    }

    /**
     * Get cache statistics (for debugging)
     */
    getStats() {
        const now = Date.now();
        const entries = Array.from(this.cache.entries());
        const valid = entries.filter(([_, entry]) => now <= entry.expiresAt).length;
        const expired = entries.length - valid;

        return {
            total: entries.length,
            valid,
            expired,
        };
    }
}

// Singleton instance
export const cache = new Cache();

// Cache key prefixes for different data types
export const CACHE_KEYS = {
    USER_STARS: 'user_stars',
    STARS_BY_TYPE: (type: string) => `stars_by_type_${type}`,
    STAR_COUNT: 'star_count',
    STAR_COUNT_BY_TYPE: (type: string) => `star_count_by_type_${type}`,
    JARS: 'jars',
    PROFILE: 'profile',
} as const;

// Cache TTL values in seconds
export const CACHE_TTL = {
    STARS: 30,           // 30 seconds - frequently updated
    JARS: 300,           // 5 minutes - rarely updated
    PROFILE: 600,        // 10 minutes - rarely updated
} as const;
