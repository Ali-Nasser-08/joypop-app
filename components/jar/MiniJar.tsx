interface MiniJarProps {
    gradientId: string;
    colors: {
        start: string;
        middle: string;
        end: string;
    };
    isSelected?: boolean;
    onClick?: () => void;
}

export function MiniJar({ gradientId, colors, isSelected, onClick }: MiniJarProps) {
    return (
        <button
            onClick={onClick}
            className={`relative w-full aspect-square rounded-2xl transition-all ${isSelected
                    ? 'bg-white/20 border-2 border-white/60 shadow-lg'
                    : 'bg-white/5 border-2 border-white/10 hover:border-white/30'
                }`}
        >
            <svg
                viewBox="0 0 400 480"
                className="w-full h-full p-4"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Jar opening */}
                <ellipse
                    cx="200"
                    cy="60"
                    rx="100"
                    ry="15"
                    fill={`rgba(${colors.start}, 0.2)`}
                    stroke={`url(#${gradientId})`}
                    strokeWidth="5"
                />

                {/* Left side */}
                <path
                    d="M 100 60 L 85 80 Q 70 100, 70 140 L 70 400 Q 70 430, 90 445"
                    fill="none"
                    stroke={`url(#${gradientId})`}
                    strokeWidth="5"
                    strokeLinecap="round"
                />

                {/* Right side */}
                <path
                    d="M 300 60 L 315 80 Q 330 100, 330 140 L 330 400 Q 330 430, 310 445"
                    fill="none"
                    stroke={`url(#${gradientId})`}
                    strokeWidth="5"
                    strokeLinecap="round"
                />

                {/* Bottom */}
                <path
                    d="M 90 445 Q 110 460, 140 465 L 260 465 Q 290 460, 310 445"
                    fill="none"
                    stroke={`url(#${gradientId})`}
                    strokeWidth="5"
                    strokeLinecap="round"
                />

                {/* Gradient definition */}
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={colors.start} />
                        <stop offset="50%" stopColor={colors.middle} />
                        <stop offset="100%" stopColor={colors.end} />
                    </linearGradient>
                </defs>
            </svg>
        </button>
    );
}
