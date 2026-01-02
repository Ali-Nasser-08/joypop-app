import { supabase } from '../supabase';
import { StarEntry, StarType } from '@/types/database';
import { cache, CACHE_KEYS, CACHE_TTL } from '../cache';
import { checkRateLimit, recordStarCreation } from './rate-limit';

/**
 * Fetch all stars for the current user (with caching)
 */
export async function getUserStars(): Promise<StarEntry[]> {
    // Try to get from cache first
    const cached = cache.get<StarEntry[]>(CACHE_KEYS.USER_STARS);
    if (cached) {
        return cached;
    }

    // Cache miss - fetch from database (using decrypted view)
    const { data, error } = await supabase
        .from('stars_decrypted')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching stars:', error);
        throw error;
    }

    const stars = data || [];

    // Store in cache
    cache.set(CACHE_KEYS.USER_STARS, stars, CACHE_TTL.STARS);

    return stars;
}

/**
 * Fetch stars by type for the current user (with caching)
 */
export async function getStarsByType(type: StarType): Promise<StarEntry[]> {
    const cacheKey = CACHE_KEYS.STARS_BY_TYPE(type);

    // Try to get from cache first
    const cached = cache.get<StarEntry[]>(cacheKey);
    if (cached) {
        return cached;
    }

    // Cache miss - fetch from database (using decrypted view)
    const { data, error } = await supabase
        .from('stars_decrypted')
        .select('*')
        .eq('type', type)
        .order('created_at', { ascending: false });

    if (error) {
        console.error(`Error fetching ${type} stars:`, error);
        throw error;
    }

    const stars = data || [];

    // Store in cache
    cache.set(cacheKey, stars, CACHE_TTL.STARS);

    return stars;
}

/**
 * Create a new star entry (with rate limiting and cache invalidation)
 */
export async function createStar(
    type: StarType,
    content: string
): Promise<StarEntry> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User not authenticated');
    }

    // Check rate limit BEFORE creating the star
    const rateLimitResult = await checkRateLimit();

    if (!rateLimitResult.allowed) {
        const error = new Error(rateLimitResult.message || 'Rate limit exceeded');
        (error as any).isRateLimit = true;
        (error as any).remaining = rateLimitResult.remaining;
        (error as any).resetTime = rateLimitResult.resetTime;
        throw error;
    }

    // Create the star using encryption function
    const { data, error } = await supabase
        .rpc('insert_star_encrypted', {
            p_user_id: user.id,
            p_type: type,
            p_content: content.trim()
        })
        .single();

    if (error) {
        console.error('Error creating star:', error);
        throw error;
    }

    // Cast the result to StarEntry type
    const starData = data as unknown as StarEntry;

    // Record the star creation for rate limiting
    await recordStarCreation();

    // Invalidate all star-related caches
    invalidateStarCaches();

    return starData;
}

/**
 * Delete a star entry (with cache invalidation)
 */
export async function deleteStar(starId: string): Promise<void> {
    const { error } = await supabase
        .from('stars')
        .delete()
        .eq('id', starId);

    if (error) {
        console.error('Error deleting star:', error);
        throw error;
    }

    // Invalidate all star-related caches
    invalidateStarCaches();
}

/**
 * Get total count of stars for the current user (with caching)
 */
export async function getStarCount(): Promise<number> {
    // Try to get from cache first
    const cached = cache.get<number>(CACHE_KEYS.STAR_COUNT);
    if (cached !== null) {
        return cached;
    }

    // Cache miss - fetch from database (using decrypted view)
    const { count, error } = await supabase
        .from('stars_decrypted')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error('Error counting stars:', error);
        throw error;
    }

    const starCount = count || 0;

    // Store in cache
    cache.set(CACHE_KEYS.STAR_COUNT, starCount, CACHE_TTL.STARS);

    return starCount;
}

/**
 * Get count of stars by type (with caching)
 */
export async function getStarCountByType(type: StarType): Promise<number> {
    const cacheKey = CACHE_KEYS.STAR_COUNT_BY_TYPE(type);

    // Try to get from cache first
    const cached = cache.get<number>(cacheKey);
    if (cached !== null) {
        return cached;
    }

    // Cache miss - fetch from database (using decrypted view)
    const { count, error } = await supabase
        .from('stars_decrypted')
        .select('*', { count: 'exact', head: true })
        .eq('type', type);

    if (error) {
        console.error(`Error counting ${type} stars:`, error);
        throw error;
    }

    const starCount = count || 0;

    // Store in cache
    cache.set(cacheKey, starCount, CACHE_TTL.STARS);

    return starCount;
}

/**
 * Delete all stars for the current user (with cache invalidation)
 */
export async function deleteAllStars(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User not authenticated');
    }

    const { error } = await supabase
        .from('stars')
        .delete()
        .eq('user_id', user.id);

    if (error) {
        console.error('Error deleting all stars:', error);
        throw error;
    }

    // Invalidate all star-related caches
    invalidateStarCaches();
}

/**
 * Helper function to invalidate all star-related caches
 */
function invalidateStarCaches(): void {
    cache.invalidate(CACHE_KEYS.USER_STARS);
    cache.invalidate(CACHE_KEYS.STAR_COUNT);
    cache.invalidatePattern('stars_by_type');
    cache.invalidatePattern('star_count_by_type');
}

