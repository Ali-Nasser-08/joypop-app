'use client';

import { useState, useEffect } from 'react';
import { sendOTP, verifyOTP } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(300); // 5 minutes
    const [canResend, setCanResend] = useState(false);

    // Countdown timer for resend
    useEffect(() => {
        if (step === 'otp' && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            setCanResend(true);
        }
    }, [countdown, step]);

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await sendOTP(email);
            setStep('otp');
            setCountdown(300); // 5 minutes
            setCanResend(false);
        } catch (err) {
            setError('Failed to send code. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await verifyOTP(email, otp);
            // Redirect to home page on success
            router.push('/');
        } catch (err) {
            setError('Invalid code. Please try again.');
            console.error(err);
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setLoading(true);
        setError('');
        setOtp('');

        try {
            await sendOTP(email);
            setCountdown(300); // 5 minutes
            setCanResend(false);
        } catch (err) {
            setError('Failed to resend code. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoBack = () => {
        setStep('email');
        setOtp('');
        setError('');
        setCountdown(300); // 5 minutes
        setCanResend(false);
    };

    // Email input step
    if (step === 'email') {
        return (
            <div className="min-h-screen md:min-h-screen mobile-viewport flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 p-4">
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full border border-white/20">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">JoyPop</h1>
                        <p className="text-white/80">Bite-sized happiness awaits ✨</p>
                    </div>

                    <form onSubmit={handleSendOTP} className="space-y-4">
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
                            {loading ? 'Sending code...' : 'Send verification code'}
                        </button>
                    </form>

                    <p className="text-white/60 text-xs text-center mt-6">
                        We'll send you a 6-digit code to sign in
                    </p>
                </div>
            </div>
        );
    }

    // OTP verification step
    return (
        <div className="min-h-screen md:min-h-screen mobile-viewport flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 p-4">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full border border-white/20">
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">📧</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
                    <p className="text-white/80">
                        We sent a 6-digit code to
                    </p>
                    <p className="text-white font-semibold">{email}</p>
                </div>

                <form onSubmit={handleVerifyOTP} className="space-y-4">
                    <div>
                        <label htmlFor="otp" className="block text-white/90 mb-2 font-medium">
                            Verification code
                        </label>
                        <input
                            id="otp"
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="000000"
                            required
                            maxLength={6}
                            className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white text-center text-2xl tracking-widest placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-red-200 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || otp.length !== 6}
                        className="w-full bg-gradient-to-r from-yellow-400 to-pink-400 text-purple-900 font-bold py-3 rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Verifying...' : 'Verify code'}
                    </button>
                </form>

                <div className="mt-6 space-y-3">
                    {canResend ? (
                        <button
                            onClick={handleResend}
                            disabled={loading}
                            className="w-full text-white/80 hover:text-white text-sm underline disabled:opacity-50"
                        >
                            Resend code
                        </button>
                    ) : (
                        <p className="text-white/60 text-sm text-center">
                            Resend code in {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                        </p>
                    )}

                    <button
                        onClick={handleGoBack}
                        disabled={loading}
                        className="w-full text-white/80 hover:text-white text-sm underline disabled:opacity-50"
                    >
                        Use a different email
                    </button>
                </div>
            </div>
        </div>
    );
}
