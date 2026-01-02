'use client';

import { useState } from 'react';

interface HeartButtonProps {
    onComplete: () => void;
}

export function HeartButton({ onComplete }: HeartButtonProps) {
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
            {/* Heart Button */}
            <button
                onClick={handleClick}
                className="relative w-40 h-40 rounded-full transition-all duration-300 active:scale-95 flex items-center justify-center"
                style={{
                    background: 'linear-gradient(135deg, #a855f7, #f472b6, #ec4899)',
                    transform: isPressed ? 'scale(1.1)' : 'scale(1)',
                    boxShadow: isPressed
                        ? '0 0 60px rgba(168, 85, 247, 0.6), 0 0 100px rgba(244, 114, 182, 0.4)'
                        : '0 0 30px rgba(168, 85, 247, 0.4)',
                }}
            >
                {/* Heart Icon */}
                <svg className="w-20 h-20" viewBox="0 0 24 24" fill="white">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
            </button>
        </div>
    );
}
