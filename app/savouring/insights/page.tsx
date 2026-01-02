'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStarsByType } from '@/lib/api/stars';
import { StarEntry } from '@/types/database';
import { ArrowLeft, Sparkles, TrendingUp } from 'lucide-react';

export default function SavouringInsightsPage() {
    const router = useRouter();
    const [moments, setMoments] = useState<StarEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadMoments() {
            try {
                const savouringMoments = await getStarsByType('savouring');
                setMoments(savouringMoments);
            } catch (error) {
                console.error('Error loading moments:', error);
            } finally {
                setLoading(false);
            }
        }

        loadMoments();
    }, []);

    // Calculate streak
    const calculateStreak = (): number => {
        if (moments.length === 0) return 0;

        const dates = moments
            .map(moment => new Date(moment.created_at).toDateString())
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

    // Extract hashtags from content
    const extractHashtags = (content: string): string[] => {
        const hashtagRegex = /#\w+/g;
        return content.match(hashtagRegex) || [];
    };

    // Get top hashtags
    const getTopHashtags = (): { tag: string; count: number }[] => {
        const tagCounts = new Map<string, number>();

        moments.forEach(moment => {
            extractHashtags(moment.content).forEach(tag => {
                tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
            });
        });

        return Array.from(tagCounts.entries())
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 3); // Only top 3
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-joy-dark flex items-center justify-center">
                <div className="text-white text-xl">Loading insights...</div>
            </div>
        );
    }

    const streak = calculateStreak();
    const totalMoments = moments.length;
    const topHashtags = getTopHashtags();

    return (
        <div className="min-h-screen bg-joy-dark relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-blob" />
                <div className="absolute top-40 right-10 w-96 h-96 bg-teal-400/15 rounded-full blur-3xl animate-blob animation-delay-2000" />
                <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
            </div>

            {/* Content */}
            <div className="relative z-10 p-6 pb-24">
                {/* Header */}
                <div className="flex items-center mb-8">
                    <button
                        onClick={() => router.back()}
                        className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all"
                    >
                        <ArrowLeft className="w-6 h-6 text-cyan-300" />
                    </button>
                    <h1 className="text-3xl font-bold text-cyan-300 ml-4">Savouring Insights</h1>
                </div>

                <div className="max-w-2xl mx-auto space-y-6">
                    {/* Simple Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Total Moments */}
                        <div
                            className="p-8 rounded-3xl bg-joy-dark/60 backdrop-blur-sm text-center"
                            style={{
                                border: '3px solid transparent',
                                backgroundImage: 'linear-gradient(#1a0b2e, #1a0b2e), linear-gradient(to right, #22d3ee, #06b6d4)',
                                backgroundOrigin: 'border-box',
                                backgroundClip: 'padding-box, border-box',
                            }}
                            suppressHydrationWarning
                        >
                            <div className="flex items-center justify-center gap-3 mb-3">
                                <Sparkles className="w-6 h-6 text-cyan-400" />
                                <h3 className="text-white/60 text-sm font-medium">Moments Savoured</h3>
                            </div>
                            <p className="text-5xl font-bold text-cyan-300">{totalMoments}</p>
                        </div>

                        {/* Current Streak */}
                        <div
                            className="p-8 rounded-3xl bg-joy-dark/60 backdrop-blur-sm text-center"
                            style={{
                                border: '3px solid transparent',
                                backgroundImage: 'linear-gradient(#1a0b2e, #1a0b2e), linear-gradient(to right, #22d3ee, #06b6d4)',
                                backgroundOrigin: 'border-box',
                                backgroundClip: 'padding-box, border-box',
                            }}
                            suppressHydrationWarning
                        >
                            <div className="flex items-center justify-center gap-3 mb-3">
                                <TrendingUp className="w-6 h-6 text-teal-400" />
                                <h3 className="text-white/60 text-sm font-medium">Current Streak</h3>
                            </div>
                            <p className="text-5xl font-bold text-cyan-300">{streak}</p>
                            <p className="text-white/40 text-sm mt-2">days</p>
                        </div>
                    </div>

                    {/* Top Tags - Simple List */}
                    {topHashtags.length > 0 && (
                        <div
                            className="p-8 rounded-3xl bg-joy-dark/60 backdrop-blur-sm"
                            style={{
                                border: '3px solid transparent',
                                backgroundImage: 'linear-gradient(#1a0b2e, #1a0b2e), linear-gradient(to right, #22d3ee, #06b6d4)',
                                backgroundOrigin: 'border-box',
                                backgroundClip: 'padding-box, border-box',
                            }}
                            suppressHydrationWarning
                        >
                            <h3 className="text-xl font-bold text-cyan-300 mb-6 text-center">Most Savoured</h3>
                            <div className="flex flex-wrap justify-center gap-3">
                                {topHashtags.map((stat) => (
                                    <div
                                        key={stat.tag}
                                        className="px-6 py-3 rounded-full bg-cyan-500/20 border border-cyan-400/30"
                                    >
                                        <span className="text-cyan-200 font-medium text-lg">{stat.tag}</span>
                                        <span className="text-cyan-300/60 text-sm ml-2">×{stat.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Simple Message */}
                    {totalMoments > 0 && (
                        <div className="text-center p-6">
                            <p className="text-cyan-200 text-lg">
                                {streak > 0 && `✨ ${streak} day${streak !== 1 ? 's' : ''} of mindful moments! `}
                                Keep savouring life's beautiful details.
                            </p>
                        </div>
                    )}

                    {totalMoments === 0 && (
                        <div className="text-center p-12">
                            <p className="text-white/60 text-lg">
                                Start savouring moments to see your insights!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
