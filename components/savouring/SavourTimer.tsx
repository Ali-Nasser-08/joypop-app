'use client';

import { useState, useEffect, useRef } from 'react';
import { usePreferences } from '@/contexts/PreferencesContext';

interface SavourTimerProps {
    onComplete: () => void;
}

export function SavourTimer({ onComplete }: SavourTimerProps) {
    const { preferences } = usePreferences();
    const DURATION = preferences.savouringTimer * 1000; // Convert seconds to milliseconds

    const [timeLeft, setTimeLeft] = useState(preferences.savouringTimer);
    const [progress, setProgress] = useState(0);
    const startTimeRef = useRef<number | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        startTimeRef.current = Date.now();

        const animate = () => {
            if (!startTimeRef.current) return;

            const elapsed = Date.now() - startTimeRef.current;
            const remaining = Math.max(0, DURATION - elapsed);
            const currentProgress = (elapsed / DURATION) * 100;

            // Update progress smoothly every frame
            setProgress(Math.min(currentProgress, 100));

            // Update time left (whole seconds)
            const secondsLeft = Math.ceil(remaining / 1000);
            setTimeLeft(secondsLeft);

            if (remaining > 0) {
                animationFrameRef.current = requestAnimationFrame(animate);
            } else {
                onComplete();
            }
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [onComplete, DURATION]);

    const circumference = 2 * Math.PI * 140;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            {/* Title */}
            <h2 className="text-4xl font-bold text-cyan-300 mb-12 animate-pulse">
                Savouring The Moment...
            </h2>

            {/* Timer Circle */}
            <div className="relative">
                {/* Background glow */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/30 to-teal-500/30 blur-3xl animate-pulse" />

                {/* SVG Timer */}
                <svg className="w-80 h-80 -rotate-90" viewBox="0 0 320 320">
                    {/* Background circle */}
                    <circle
                        cx="160"
                        cy="160"
                        r="140"
                        fill="none"
                        stroke="rgba(34, 211, 238, 0.2)"
                        strokeWidth="12"
                    />

                    {/* Progress circle */}
                    <circle
                        cx="160"
                        cy="160"
                        r="140"
                        fill="none"
                        stroke="url(#timerGradient)"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        style={{ transition: 'none' }}
                    />

                    <defs>
                        <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#22d3ee" />
                            <stop offset="100%" stopColor="#0891b2" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Timer Number */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-8xl font-bold text-cyan-300">
                        {timeLeft}
                    </span>
                </div>
            </div>

            {/* Subtitle */}
            <p className="text-white/60 text-lg mt-8">
                Take a deep breath and be present...
            </p>
        </div>
    );
}
