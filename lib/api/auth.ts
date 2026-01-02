import { supabase } from '../supabase';

/**
 * Send OTP code to email (6-digit code)
 */
export async function sendOTP(email: string) {
    const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            shouldCreateUser: true,
        },
    });

    if (error) {
        console.error('Error sending OTP:', error);
        throw error;
    }

    return data;
}

/**
 * Verify OTP code
 */
export async function verifyOTP(email: string, token: string) {
    const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
    });

    if (error) {
        console.error('Error verifying OTP:', error);
        throw error;
    }

    return data;
}

/**
 * Sign out the current user
 */
export async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error('Error signing out:', error);
        throw error;
    }
}

/**
 * Get the current user session
 */
export async function getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
        console.error('Error getting session:', error);
        throw error;
    }

    return session;
}

/**
 * Get the current user
 */
export async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
        console.error('Error getting user:', error);
        return null;
    }

    return user;
}
