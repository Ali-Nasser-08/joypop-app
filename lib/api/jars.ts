import { supabase } from '@/lib/supabase';
import { Jar } from '@/types/database';
import { cache, CACHE_KEYS, CACHE_TTL } from '../cache';

// Create a new jar record (souvenir)
export async function createJar(name: string): Promise<Jar> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User not authenticated');
    }

    const { data: jar, error: jarError } = await supabase
        .from('jars')
        .insert({
            user_id: user.id,
            name: name.trim(),
        })
        .select()
        .single();

    if (jarError) {
        console.error('Error creating jar:', jarError);
        throw jarError;
    }

    // Invalidate jars cache
    cache.invalidate(CACHE_KEYS.JARS);

    return jar;
}

// Get all jars for the current user (with caching)
export async function getJars(): Promise<Jar[]> {
    // Try to get from cache first
    const cached = cache.get<Jar[]>(CACHE_KEYS.JARS);
    if (cached) {
        return cached;
    }

    // Cache miss - fetch from database
    const { data, error } = await supabase
        .from('jars')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching jars:', error);
        throw error;
    }

    const jars = data || [];

    // Store in cache
    cache.set(CACHE_KEYS.JARS, jars, CACHE_TTL.JARS);

    return jars;
}

