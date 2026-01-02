'use client';

import { StarEntry } from '@/types/database';
import { Star } from '../ui/Star';
import { JAR_CAPACITY } from '@/lib/constants';
import { usePreferences } from '@/contexts/PreferencesContext';
import { JAR_SKINS } from '@/lib/jar-skins';

interface JoyJarProps {
    stars: StarEntry[];
}

// Get motivational quote based on star count
function getQuote(count: number, total: number): string {
    const percentage = (count / total) * 100;

    if (count === 0) {
        return "Your journey to joy begins with a single star";
    } else if (count === 1) {
        return "One star shines bright! Keep going!";
    } else if (percentage < 10) {
        return "Every star is a step toward happiness!";
    } else if (percentage < 25) {
        return "You're building something beautiful!";
    } else if (percentage < 50) {
        return "Look at all this joy you're collecting!";
    } else if (percentage < 75) {
        return "Your jar is filling with wonderful moments!";
    } else if (percentage < 90) {
        return "Almost there! Your joy is overflowing!";
    } else if (count < total) {
        return "So close to a full jar of happiness!";
    } else {
        return "Your jar is full of beautiful memories!";
    }
}

export function JoyJar({ stars }: JoyJarProps) {
    const { preferences } = usePreferences();
    const selectedSkin = JAR_SKINS[preferences.jarSkin as keyof typeof JAR_SKINS] || JAR_SKINS.default;

    const totalSlots = JAR_CAPACITY.total;
    const filledSlots = stars.slice(0, totalSlots);
    const emptySlots = totalSlots - filledSlots.length;

    // Reverse the order so stars fill from bottom to top
    const reversedSlots = [...filledSlots].reverse();
    const quote = getQuote(filledSlots.length, totalSlots);

    return (
        <div className="relative w-full max-w-lg mx-auto px-6">
            {/* Jar Container - wider */}
            <div className="relative w-full" style={{ aspectRatio: '0.8' }} suppressHydrationWarning>
                {/* Simple 2D Jar SVG - wider */}
                <svg
                    viewBox="0 0 400 480"
                    className="w-full h-full absolute inset-0 pointer-events-none"
                    xmlns="http://www.w3.org/2000/svg"
                    suppressHydrationWarning
                >
                    {/* Jar opening - wider ellipse at top */}
                    <ellipse
                        cx="200"
                        cy="60"
                        rx="100"
                        ry="15"
                        fill="rgba(139, 92, 246, 0.2)"
                        stroke="url(#simpleGradient)"
                        strokeWidth="5"
                    />

                    {/* Left side of jar */}
                    <path
                        d="M 100 60 L 85 80 Q 70 100, 70 140 L 70 400 Q 70 430, 90 445"
                        fill="none"
                        stroke="url(#simpleGradient)"
                        strokeWidth="5"
                        strokeLinecap="round"
                    />

                    {/* Right side of jar */}
                    <path
                        d="M 300 60 L 315 80 Q 330 100, 330 140 L 330 400 Q 330 430, 310 445"
                        fill="none"
                        stroke="url(#simpleGradient)"
                        strokeWidth="5"
                        strokeLinecap="round"
                    />

                    {/* Bottom of jar */}
                    <path
                        d="M 90 445 Q 110 460, 140 465 L 260 465 Q 290 460, 310 445"
                        fill="none"
                        stroke="url(#simpleGradient)"
                        strokeWidth="5"
                        strokeLinecap="round"
                    />

                    {/* Gradient definition */}
                    <defs>
                        <linearGradient id="simpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={selectedSkin.colors.start} />
                            <stop offset="50%" stopColor={selectedSkin.colors.middle} />
                            <stop offset="100%" stopColor={selectedSkin.colors.end} />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Star Grid - contained within wider jar */}
                <div
                    className="absolute grid"
                    style={{
                        left: '22%',
                        right: '22%',
                        top: '18%',
                        bottom: '6%',
                        gridTemplateColumns: `repeat(${JAR_CAPACITY.width}, 1fr)`,
                        gridTemplateRows: `repeat(${JAR_CAPACITY.height}, 1fr)`,
                        gap: '2px',
                        padding: '6px',
                    }}
                    suppressHydrationWarning
                >
                    {/* Empty slots first (at the top) */}
                    {Array.from({ length: emptySlots }).map((_, index) => (
                        <div key={`empty-${index}`} className="flex items-center justify-center" />
                    ))}

                    {/* Filled Stars - reversed to fill from bottom */}
                    {reversedSlots.map((star) => (
                        <div key={star.id} className="flex items-center justify-center">
                            <Star type={star.type} size="responsive" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Dynamic Quote */}
            <div className="text-center mt-4 px-6">
                <p className="text-pink-300 text-sm transition-all duration-500">
                    {quote}
                </p>
            </div>
        </div>
    );
}
