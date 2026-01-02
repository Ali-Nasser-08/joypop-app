import { supabase } from '../supabase';

// Rate limit configuration
const STARS_PER_DAY = 10;
const RATE_LIMIT_WINDOW_HOURS = 24;

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetTime?: Date;
    message?: string;
}

/**
 * Check if user can create a new star
 * Returns rate limit information
 */
export async function checkRateLimit(): Promise<RateLimitResult> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return {
            allowed: false,
            remaining: 0,
            message: 'User not authenticated',
        };
    }

    // Calculate the time window (last 24 hours)
    const windowStart = new Date();
    windowStart.setHours(windowStart.getHours() - RATE_LIMIT_WINDOW_HOURS);

    // Count stars created in the last 24 hours
    const { count, error } = await supabase
        .from('star_rate_limits')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', windowStart.toISOString());

    if (error) {
        console.error('Error checking rate limit:', error);
        // On error, allow the action (fail open)
        return {
            allowed: true,
            remaining: STARS_PER_DAY,
        };
    }

    const starsCreated = count || 0;
    const remaining = Math.max(0, STARS_PER_DAY - starsCreated);

    if (starsCreated >= STARS_PER_DAY) {
        // Find the oldest star in the window to calculate reset time
        const { data: oldestStar } = await supabase
            .from('star_rate_limits')
            .select('created_at')
            .eq('user_id', user.id)
            .gte('created_at', windowStart.toISOString())
            .order('created_at', { ascending: true })
            .limit(1)
            .single();

        let resetTime: Date | undefined;
        if (oldestStar) {
            resetTime = new Date(oldestStar.created_at);
            resetTime.setHours(resetTime.getHours() + RATE_LIMIT_WINDOW_HOURS);
        }

        return {
            allowed: false,
            remaining: 0,
            resetTime,
            message: getRateLimitMessage(resetTime),
        };
    }

    return {
        allowed: true,
        remaining,
    };
}

/**
 * Record a star creation for rate limiting
 */
export async function recordStarCreation(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User not authenticated');
    }

    const { error } = await supabase
        .from('star_rate_limits')
        .insert({
            user_id: user.id,
        });

    if (error) {
        console.error('Error recording star creation:', error);
        // Don't throw - this shouldn't block star creation
    }
}

/**
 * Get remaining stars count without checking if allowed
 */
export async function getRemainingStars(): Promise<number> {
    const result = await checkRateLimit();
    return result.remaining;
}

/**
 * Generate humorous rate limit message
 */
function getRateLimitMessage(resetTime?: Date): string {
    return `Whoa there, star collector! 🌟

You've reached your daily limit of stars.

The Formal Reason:
Good habits grow best when practiced over multiple days, not all at once! Take a short break and come back tomorrow to keep adding stars.

The Real Reason:
This is an MVP, and I'm trying to avoid scary database bills 😅

You've reached your daily limit of ${STARS_PER_DAY} stars. See you tomorrow for more sparkle!`;
}

/**
 * Get a short version of the rate limit message for UI
 */
export function getShortRateLimitMessage(remaining: number): string {
    if (remaining === 0) {
        return "Daily limit reached! Come back later for more stars.";
    }

    if (remaining <= 3) {
        return `Only ${remaining} star${remaining === 1 ? '' : 's'} left today!`;
    }

    return `${remaining} stars remaining today`;
}
