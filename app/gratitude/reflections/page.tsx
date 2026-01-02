'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStarsByType } from '@/lib/api/stars';
import { StarEntry } from '@/types/database';
import { ArrowLeft, Sparkles, TrendingUp, Flower2 } from 'lucide-react';

const GRATITUDE_QUOTES = [
    "Gratitude turns what we have into enough.",
    "The more grateful I am, the more beauty I see.",
    "Gratitude is the healthiest of all human emotions.",
    "When you are grateful, fear disappears and abundance appears.",
    "Gratitude makes sense of our past, brings peace for today, and creates a vision for tomorrow.",
    "Acknowledging the good that you already have in your life is the foundation for all abundance.",
];

export default function GratitudeReflectionsPage() {
    const router = useRouter();
    const [gratitudes, setGratitudes] = useState<StarEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentQuote, setCurrentQuote] = useState(0);
    const [quoteOpacity, setQuoteOpacity] = useState(1);

    useEffect(() => {
        async function loadGratitudes() {
            try {
                const gratitudeEntries = await getStarsByType('gratitude');
                setGratitudes(gratitudeEntries);
            } catch (error) {
                console.error('Error loading gratitudes:', error);
            } finally {
                setLoading(false);
            }
        }

        loadGratitudes();
    }, []);

    // Rotate quotes every 8 seconds with blur transition
    useEffect(() => {
        const interval = setInterval(() => {
            // Fade out with blur
            setQuoteOpacity(0);

            // Change quote after fade out
            setTimeout(() => {
                setCurrentQuote((prev) => (prev + 1) % GRATITUDE_QUOTES.length);
                // Fade in
                setQuoteOpacity(1);
            }, 800); // Half of 8 seconds for smooth transition
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    // Calculate streak
    const calculateStreak = (): number => {
        if (gratitudes.length === 0) return 0;

        const dates = gratitudes
            .map(g => new Date(g.created_at).toDateString())
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

        const uniqueDates = Array.from(new Set(dates));
        let streak = 0;

        for (let i = 0; i < uniqueDates.length; i++) {
            const expectedDate = new Date();
            expectedDate.setDate(expectedDate.getDate() - i);

            if (uniqueDates[i] === expectedDate.toDateString()) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    };

    // Extract hashtags
    const extractHashtags = (content: string): string[] => {
        const hashtagRegex = /#\w+/g;
        return content.match(hashtagRegex) || [];
    };

    // Get weekly theme (top 3 hashtags this week)
    const getWeeklyThemes = (): string[] => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const recentGratitudes = gratitudes.filter(
            g => new Date(g.created_at) >= oneWeekAgo
        );

        const tagCounts = new Map<string, number>();
        recentGratitudes.forEach(g => {
            extractHashtags(g.content).forEach(tag => {
                tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
            });
        });

        if (tagCounts.size === 0) return [];

        return Array.from(tagCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([tag]) => tag);
    };

    // Gratitude Garden - calculate flower count
    const getFlowerCount = (): number => {
        // 1 flower per 3 gratitudes
        return Math.floor(gratitudes.length / 3);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-joy-dark flex items-center justify-center">
                <div className="text-white text-xl">Loading reflections...</div>
            </div>
        );
    }

    const streak = calculateStreak();
    const totalGratitudes = gratitudes.length;
    const weeklyThemes = getWeeklyThemes();
    const flowerCount = getFlowerCount();

    return (
        <div className="min-h-screen bg-joy-dark relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-blob" />
                <div className="absolute top-40 right-10 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl animate-blob animation-delay-2000" />
                <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
            </div>

            {/* Content */}
            <div className="relative z-10 p-6 pb-24">
                {/* Header */}
                <div className="flex items-center mb-8">
                    <button
                        onClick={() => router.back()}
                        className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all"
                    >
                        <ArrowLeft className="w-6 h-6 text-yellow-300" />
                    </button>
                    <h1 className="text-3xl font-bold text-yellow-300 ml-4">Gratitude Reflections</h1>
                </div>

                <div className="max-w-3xl mx-auto space-y-6">
                    {/* Inspirational Quote with blur transition */}
                    <div
                        className="p-8 rounded-3xl bg-joy-dark/60 backdrop-blur-sm text-center"
                        style={{
                            border: '3px solid transparent',
                            backgroundImage: 'linear-gradient(#1a0b2e, #1a0b2e), linear-gradient(to right, #fbbf24, #f59e0b)',
                            backgroundOrigin: 'border-box',
                            backgroundClip: 'padding-box, border-box',
                        }}
                        suppressHydrationWarning
                    >
                        <p
                            className="text-yellow-200 text-xl italic transition-all duration-700 ease-in-out"
                            style={{
                                opacity: quoteOpacity,
                                filter: quoteOpacity === 1 ? 'blur(0px)' : 'blur(10px)',
                            }}
                        >
                            "{GRATITUDE_QUOTES[currentQuote]}"
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Total Gratitudes */}
                        <div
                            className="p-8 rounded-3xl bg-joy-dark/60 backdrop-blur-sm text-center"
                            style={{
                                border: '3px solid transparent',
                                backgroundImage: 'linear-gradient(#1a0b2e, #1a0b2e), linear-gradient(to right, #fbbf24, #f59e0b)',
                                backgroundOrigin: 'border-box',
                                backgroundClip: 'padding-box, border-box',
                            }}
                            suppressHydrationWarning
                        >
                            <div className="flex items-center justify-center gap-3 mb-3">
                                <Sparkles className="w-6 h-6 text-yellow-400" />
                                <h3 className="text-white/60 text-sm font-medium">Gratitudes Expressed</h3>
                            </div>
                            <p className="text-5xl font-bold text-yellow-300">{totalGratitudes}</p>
                        </div>

                        {/* Current Streak */}
                        <div
                            className="p-8 rounded-3xl bg-joy-dark/60 backdrop-blur-sm text-center"
                            style={{
                                border: '3px solid transparent',
                                backgroundImage: 'linear-gradient(#1a0b2e, #1a0b2e), linear-gradient(to right, #fbbf24, #f59e0b)',
                                backgroundOrigin: 'border-box',
                                backgroundClip: 'padding-box, border-box',
                            }}
                            suppressHydrationWarning
                        >
                            <div className="flex items-center justify-center gap-3 mb-3">
                                <TrendingUp className="w-6 h-6 text-amber-400" />
                                <h3 className="text-white/60 text-sm font-medium">Gratitude Streak</h3>
                            </div>
                            <p className="text-5xl font-bold text-yellow-300">{streak}</p>
                            <p className="text-white/40 text-sm mt-2">days</p>
                        </div>
                    </div>

                    {/* Gratitude Garden */}
                    <div
                        className="p-8 rounded-3xl bg-joy-dark/60 backdrop-blur-sm"
                        style={{
                            border: '3px solid transparent',
                            backgroundImage: 'linear-gradient(#1a0b2e, #1a0b2e), linear-gradient(to right, #fbbf24, #f59e0b)',
                            backgroundOrigin: 'border-box',
                            backgroundClip: 'padding-box, border-box',
                        }}
                        suppressHydrationWarning
                    >
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <Flower2 className="w-6 h-6 text-yellow-400" />
                            <h3 className="text-2xl font-bold text-yellow-300">Your Gratitude Garden</h3>
                        </div>

                        {flowerCount > 0 ? (
                            <>
                                <div className="flex flex-wrap justify-center gap-3 mb-4">
                                    {Array.from({ length: Math.min(flowerCount, 20) }).map((_, i) => (
                                        <span key={i} className="text-4xl animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>
                                            🌸
                                        </span>
                                    ))}
                                </div>
                                <p className="text-center text-yellow-200">
                                    {flowerCount} flower{flowerCount !== 1 ? 's' : ''} blooming!
                                    {flowerCount < 20 && ` Keep expressing gratitude to grow your garden.`}
                                </p>
                            </>
                        ) : (
                            <p className="text-center text-yellow-200/60">
                                Your garden is waiting to bloom. Express 3 gratitudes to grow your first flower! 🌱
                            </p>
                        )}
                    </div>

                    {/* Weekly Theme */}
                    {weeklyThemes.length > 0 && (
                        <div
                            className="p-8 rounded-3xl bg-joy-dark/60 backdrop-blur-sm text-center"
                            style={{
                                border: '3px solid transparent',
                                backgroundImage: 'linear-gradient(#1a0b2e, #1a0b2e), linear-gradient(to right, #fbbf24, #f59e0b)',
                                backgroundOrigin: 'border-box',
                                backgroundClip: 'padding-box, border-box',
                            }}
                            suppressHydrationWarning
                        >
                            <h3 className="text-xl font-bold text-yellow-300 mb-3">This Week's Themes</h3>
                            <p className="text-yellow-200 text-lg mb-4">
                                You've been most grateful for:
                            </p>
                            <div className="flex flex-wrap justify-center gap-3">
                                {weeklyThemes.map((theme, idx) => (
                                    <span
                                        key={idx}
                                        className="px-6 py-3 rounded-full bg-yellow-500/20 border border-yellow-400/30 font-bold text-amber-300 text-lg"
                                    >
                                        {theme}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Motivational Message */}
                    {totalGratitudes > 0 && (
                        <div className="text-center p-6">
                            <p className="text-yellow-200 text-lg">
                                {streak > 0 && `🌟 ${streak} day${streak !== 1 ? 's' : ''} of gratitude! `}
                                Your grateful heart is creating a beautiful garden of joy. 💛
                            </p>
                        </div>
                    )}

                    {totalGratitudes === 0 && (
                        <div className="text-center p-12">
                            <p className="text-white/60 text-lg">
                                Start expressing gratitude to see your reflections bloom!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
