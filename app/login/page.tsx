'use client';

import { useState } from 'react';
import { signInWithMagicLink } from '@/lib/api/auth';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signInWithMagicLink(email);
            setSent(true);
        } catch (err) {
            setError('Failed to send magic link. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div className="min-h-screen md:min-h-screen mobile-viewport flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 p-4">
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full text-center border border-white/20">
                    <div className="text-6xl mb-4">✨</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Check your email!</h2>
                    <p className="text-white/80">
                        We've sent a magic link to <strong>{email}</strong>
                    </p>
                    <p className="text-white/60 text-sm mt-4">
                        Click the link in your email to sign in to JoyPop
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen md:min-h-screen mobile-viewport flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 p-4">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full border border-white/20">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">JoyPop</h1>
                    <p className="text-white/80">Bite-sized happiness awaits ✨</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-white/90 mb-2 font-medium">
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-red-200 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-yellow-400 to-pink-400 text-purple-900 font-bold py-3 rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Sending magic link...' : 'Send magic link'}
                    </button>
                </form>

                <p className="text-white/60 text-xs text-center mt-6">
                    We'll send you a magic link to sign in without a password
                </p>
            </div>
        </div>
    );
}
