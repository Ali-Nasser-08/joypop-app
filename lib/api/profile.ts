import { supabase } from '../supabase';
import { Profile } from '@/types/database';
import { cache, CACHE_KEYS, CACHE_TTL } from '../cache';

/**
 * Get the current user's profile (with caching)
 */
export async function getUserProfile(): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    // Try to get from cache first
    const cached = cache.get<Profile>(CACHE_KEYS.PROFILE);
    if (cached) {
        return cached;
    }

    // Cache miss - fetch from database
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error) {
        console.error('Error fetching profile:', error);
        return null;
    }

    // Store in cache
    if (data) {
        cache.set(CACHE_KEYS.PROFILE, data, CACHE_TTL.PROFILE);
    }

    return data;
}

/**
 * Delete the current user's account and all associated data
 */
export async function deleteUserAccount(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User not authenticated');
    }

    // Call the database function to delete the account
    const { error } = await supabase.rpc('delete_user_account');

    if (error) {
        console.error('Error deleting account:', error);
        throw error;
    }

    // Clear all caches
    cache.clear();

    // Sign out (the user is already deleted, but this clears the session)
    await supabase.auth.signOut();
}

