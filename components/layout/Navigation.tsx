'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Sparkles, Flower2, Heart, HandHeart } from 'lucide-react';
import { useSavouring } from '@/contexts/SavouringContext';

// Custom Jar Icon
function JarIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M15 3h3v3h-3z" className="opacity-0" /> {/* Spacer */}
            <path d="M8 2h8v4H8z" /> {/* Lid */}
            <path d="M18 6H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z" /> {/* Body */}
            <path d="M10 2v4" />
            <path d="M14 2v4" />
        </svg>
    );
}

const navItems = [
    { path: '/', icon: JarIcon, label: 'Jar' },
    { path: '/savouring', icon: Flower2, label: 'Savouring' },
    { path: '/kindness', icon: Heart, label: 'Kindness' },
    { path: '/gratitude', icon: HandHeart, label: 'Gratitude' },
];

export function Navigation() {
    const pathname = usePathname();
    const router = useRouter();
    const { isTimerActive, isCaptureActive } = useSavouring();

    // Don't show navigation on login, onboarding, consent, history, insights, settings pages
    if (
        pathname === '/login' ||
        pathname === '/onboarding' ||
        pathname === '/consent' ||
        pathname.includes('/history') ||
        pathname.includes('/insights') ||
        pathname.includes('/reflections') ||
        pathname === '/settings'
    ) {
        return null;
    }

    return (
        <nav className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-700 ${isTimerActive || isCaptureActive
            ? 'opacity-0 translate-y-8 pointer-events-none'
            : 'opacity-100 translate-y-0'
            }`}>
            <div className="relative">
                {/* Navigation content with thick gradient border */}
                <div
                    className="relative flex items-center gap-2 px-8 py-4 rounded-full bg-joy-dark/95 backdrop-blur-lg"
                >
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        const Icon = item.icon;

                        // Define feature-specific colors
                        const getActiveColor = () => {
                            if (item.path === '/gratitude') return { text: '#fbbf24', bg: 'rgba(251, 191, 36, 0.2)' };
                            if (item.path === '/savouring') return { text: '#22d3ee', bg: 'rgba(34, 211, 238, 0.2)' };
                            if (item.path === '/kindness') return { text: '#ec4899', bg: 'rgba(236, 72, 153, 0.2)' };
                            return { text: '#a855f7', bg: 'rgba(168, 85, 247, 0.2)' }; // Purple for jar
                        };

                        const activeColor = getActiveColor();

                        return (
                            <button
                                key={item.path}
                                onClick={() => router.push(item.path)}
                                className={`
                  p-3 rounded-full transition-all duration-300
                  ${isActive
                                        ? 'scale-110'
                                        : 'hover:scale-105'
                                    }
                `}
                                style={{
                                    color: isActive ? activeColor.text : '#c084fc99',
                                    backgroundColor: isActive ? activeColor.bg : 'transparent',
                                }}
                                aria-label={item.label}
                            >
                                <Icon
                                    className="w-7 h-7"
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                            </button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
