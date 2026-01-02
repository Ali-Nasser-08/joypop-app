'use client';

import { useState, useEffect, useRef } from 'react';

interface HoldButtonProps {
    onComplete: () => void;
}

export function HoldButton({ onComplete }: HoldButtonProps) {
    const [isHolding, setIsHolding] = useState(false);
    const [progress, setProgress] = useState(0);
    const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const HOLD_DURATION = 3000; // 3 seconds

    const startHold = () => {
        setIsHolding(true);
        setProgress(0);

        // Progress animation
        const startTime = Date.now();
        progressIntervalRef.current = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min((elapsed / HOLD_DURATION) * 100, 100);
            setProgress(newProgress);
        }, 16); // ~60fps

        // Complete after hold duration
        holdTimerRef.current = setTimeout(() => {
            setIsHolding(false);
            setProgress(0);
            onComplete();
        }, HOLD_DURATION);
    };

    const cancelHold = () => {
        setIsHolding(false);
        setProgress(0);
        if (holdTimerRef.current) {
            clearTimeout(holdTimerRef.current);
        }
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
        }
    };

    useEffect(() => {
        return () => {
            if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        };
    }, []);

    return (
        <div className="relative">
            {/* Progress Ring */}
            <svg
                className="absolute inset-0 w-full h-full -rotate-90"
                viewBox="0 0 200 200"
            >
                <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="rgba(34, 211, 238, 0.2)"
                    strokeWidth="8"
                />
                <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="url(#progressGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 90}`}
                    strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
                    style={{ transition: 'stroke-dashoffset 0.016s linear' }}
                />
                <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#22d3ee" />
                        <stop offset="50%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#0891b2" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Flower Button */}
            <button
                onMouseDown={startHold}
                onMouseUp={cancelHold}
                onMouseLeave={cancelHold}
                onTouchStart={startHold}
                onTouchEnd={cancelHold}
                className="relative w-40 h-40 rounded-full transition-all duration-300 active:scale-95 flex items-center justify-center"
                style={{
                    background: 'linear-gradient(135deg, #22d3ee, #06b6d4, #0891b2)',
                    transform: isHolding ? 'scale(1.2)' : 'scale(1)',
                    boxShadow: isHolding
                        ? '0 0 60px rgba(34, 211, 238, 0.6), 0 0 100px rgba(6, 182, 212, 0.4)'
                        : '0 0 30px rgba(34, 211, 238, 0.4)',
                }}
            >
                {/* Better Flower Design */}
                <svg className="w-28 h-28" viewBox="0 0 100 100" fill="none">
                    {/* Petals - arranged in a flower pattern */}
                    <ellipse cx="50" cy="20" rx="12" ry="18" fill="white" opacity="0.9" />
                    <ellipse cx="50" cy="20" rx="12" ry="18" fill="white" opacity="0.9" transform="rotate(60 50 50)" />
                    <ellipse cx="50" cy="20" rx="12" ry="18" fill="white" opacity="0.9" transform="rotate(120 50 50)" />
                    <ellipse cx="50" cy="20" rx="12" ry="18" fill="white" opacity="0.9" transform="rotate(180 50 50)" />
                    <ellipse cx="50" cy="20" rx="12" ry="18" fill="white" opacity="0.9" transform="rotate(240 50 50)" />
                    <ellipse cx="50" cy="20" rx="12" ry="18" fill="white" opacity="0.9" transform="rotate(300 50 50)" />

                    {/* Center */}
                    <circle cx="50" cy="50" r="15" fill="white" opacity="0.95" />
                </svg>
            </button>
        </div>
    );
}
