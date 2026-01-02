'use client';

import { useState } from 'react';

interface SunButtonProps {
    onComplete: () => void;
}

export function SunButton({ onComplete }: SunButtonProps) {
    const [isPressed, setIsPressed] = useState(false);

    const handleClick = () => {
        setIsPressed(true);
        // Brief animation before triggering
        setTimeout(() => {
            setIsPressed(false);
            onComplete();
        }, 200);
    };

    return (
        <div className="relative">
            {/* Sun Button */}
            <button
                onClick={handleClick}
                className="relative w-40 h-40 rounded-full transition-all duration-300 active:scale-95 flex items-center justify-center"
                style={{
                    background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #fb923c)',
                    transform: isPressed ? 'scale(1.1)' : 'scale(1)',
                    boxShadow: isPressed
                        ? '0 0 60px rgba(251, 191, 36, 0.6), 0 0 100px rgba(245, 158, 11, 0.4)'
                        : '0 0 30px rgba(251, 191, 36, 0.4)',
                }}
            >
                {/* Sun Icon with Rays */}
                <svg className="w-24 h-24" viewBox="0 0 24 24" fill="none">
                    {/* Center circle */}
                    <circle cx="12" cy="12" r="5" fill="white" />

                    {/* Sun rays */}
                    <g stroke="white" strokeWidth="2" strokeLinecap="round">
                        {/* Top */}
                        <line x1="12" y1="1" x2="12" y2="3" />
                        {/* Top-right */}
                        <line x1="18.36" y1="5.64" x2="16.95" y2="7.05" />
                        {/* Right */}
                        <line x1="23" y1="12" x2="21" y2="12" />
                        {/* Bottom-right */}
                        <line x1="18.36" y1="18.36" x2="16.95" y2="16.95" />
                        {/* Bottom */}
                        <line x1="12" y1="23" x2="12" y2="21" />
                        {/* Bottom-left */}
                        <line x1="5.64" y1="18.36" x2="7.05" y2="16.95" />
                        {/* Left */}
                        <line x1="1" y1="12" x2="3" y2="12" />
                        {/* Top-left */}
                        <line x1="5.64" y1="5.64" x2="7.05" y2="7.05" />
                    </g>
                </svg>
            </button>
        </div>
    );
}
