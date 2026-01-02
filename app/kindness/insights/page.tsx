'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStarsByType } from '@/lib/api/stars';
import { StarEntry } from '@/types/database';
import { ArrowLeft, Heart, TrendingUp, Calendar, Hash } from 'lucide-react';

interface HashtagStats {
    tag: string;
    count: number;
}

interface DateStats {
    date: string;
    count: number;
}

export default function KindnessInsightsPage() {
    const router = useRouter();
    const [kindnessActs, setKindnessActs] = useState<StarEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadKindnessActs() {
            try {
                const acts = await getStarsByType('kindness');
                setKindnessActs(acts);
            } catch (error) {
                console.error('Error loading kindness acts:', error);
            } finally {
                setLoading(false);
            }
        }

        loadKindnessActs();
    }, []);

    // Extract hashtags from content
    const extractHashtags = (content: string): string[] => {
        const hashtagRegex = /#\w+/g;
        return content.match(hashtagRegex) || [];
    };

    // Calculate hashtag statistics
    const getHashtagStats = (): HashtagStats[] => {
        const tagCounts = new Map<string, number>();

        kindnessActs.forEach(act => {
            extractHashtags(act.content).forEach(tag => {
                tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
            });
        });

        return Array.from(tagCounts.entries())
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => b.count - a.count);
    };

    // Calculate streak
    const calculateStreak = (): number => {
        if (kindnessActs.length === 0) return 0;

        const dates = kindnessActs
            .map(act => new Date(act.created_at).toDateString())
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

        const uniqueDates = Array.from(new Set(dates));
        let streak = 0;
        const today = new Date().toDateString();

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

    // Get acts by day of week
    const getActsByDayOfWeek = (): { day: string; count: number }[] => {
        const dayCounts = new Map<number, number>();

        kindnessActs.forEach(act => {
            const day = new Date(act.created_at).getDay();
            dayCounts.set(day, (dayCounts.get(day) || 0) + 1);
        });

        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return dayNames.map((day, index) => ({
            day,
            count: dayCounts.get(index) || 0
        }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-joy-dark flex items-center justify-center">
                <div className="text-white text-xl">Loading insights...</div>
            </div>
        );
    }

    const hashtagStats = getHashtagStats();
    const streak = calculateStreak();
    const dayStats = getActsByDayOfWeek();
    const totalActs = kindnessActs.length;
    const maxDayCount = Math.max(...dayStats.map(d => d.count), 1);

    return (
        <div className="min-h-screen bg-joy-dark relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-blob" />
                <div className="absolute top-40 right-10 w-96 h-96 bg-pink-400/15 rounded-full blur-3xl animate-blob animation-delay-2000" />
                <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-fuchsia-400/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
            </div>

            {/* Content */}
            <div className="relative z-10 p-6 pb-24">
                {/* Header */}
                <div className="flex items-center mb-8">
                    <button
                        onClick={() => router.back()}
                        className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all"
                    >
                        <ArrowLeft className="w-6 h-6 text-purple-300" />
                    </button>
                    <h1 className="text-3xl font-bold text-purple-300 ml-4">Kindness Insights</h1>
                </div>

                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Total Acts */}
                        <div
                            className="p-6 rounded-3xl bg-joy-dark/60 backdrop-blur-sm"
                            style={{
                                border: '3px solid transparent',
                                backgroundImage: 'linear-gradient(#1a0b2e, #1a0b2e), linear-gradient(to right, #a855f7, #f472b6)',
                                backgroundOrigin: 'border-box',
                                backgroundClip: 'padding-box, border-box',
                            }}
                            suppressHydrationWarning
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <Heart className="w-6 h-6 text-pink-400" />
                                <h3 className="text-white/60 text-sm font-medium">Total Acts</h3>
                            </div>
                            <p className="text-4xl font-bold text-purple-300">{totalActs}</p>
                        </div>

                        {/* Current Streak */}
                        <div
                            className="p-6 rounded-3xl bg-joy-dark/60 backdrop-blur-sm"
                            style={{
                                border: '3px solid transparent',
                                backgroundImage: 'linear-gradient(#1a0b2e, #1a0b2e), linear-gradient(to right, #a855f7, #f472b6)',
                                backgroundOrigin: 'border-box',
                                backgroundClip: 'padding-box, border-box',
                            }}
                            suppressHydrationWarning
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <TrendingUp className="w-6 h-6 text-pink-400" />
                                <h3 className="text-white/60 text-sm font-medium">Current Streak</h3>
                            </div>
                            <p className="text-4xl font-bold text-purple-300">{streak} days</p>
                        </div>

                        {/* Unique Tags */}
                        <div
                            className="p-6 rounded-3xl bg-joy-dark/60 backdrop-blur-sm"
                            style={{
                                border: '3px solid transparent',
                                backgroundImage: 'linear-gradient(#1a0b2e, #1a0b2e), linear-gradient(to right, #a855f7, #f472b6)',
                                backgroundOrigin: 'border-box',
                                backgroundClip: 'padding-box, border-box',
                            }}
                            suppressHydrationWarning
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <Hash className="w-6 h-6 text-pink-400" />
                                <h3 className="text-white/60 text-sm font-medium">Unique Tags</h3>
                            </div>
                            <p className="text-4xl font-bold text-purple-300">{hashtagStats.length}</p>
                        </div>
                    </div>

                    {/* Top Hashtags */}
                    {hashtagStats.length > 0 && (
                        <div
                            className="p-8 rounded-3xl bg-joy-dark/60 backdrop-blur-sm"
                            style={{
                                border: '3px solid transparent',
                                backgroundImage: 'linear-gradient(#1a0b2e, #1a0b2e), linear-gradient(to right, #a855f7, #f472b6)',
                                backgroundOrigin: 'border-box',
                                backgroundClip: 'padding-box, border-box',
                            }}
                            suppressHydrationWarning
                        >
                            <h3 className="text-2xl font-bold text-purple-300 mb-6">Top Categories</h3>
                            <div className="space-y-4">
                                {hashtagStats.slice(0, 5).map((stat, index) => {
                                    const percentage = (stat.count / totalActs) * 100;
                                    return (
                                        <div key={stat.tag}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-purple-200 font-medium">{stat.tag}</span>
                                                <span className="text-pink-300">{stat.count} acts</span>
                                            </div>
                                            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${percentage}%`,
                                                        background: 'linear-gradient(to right, #a855f7, #f472b6)',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Day of Week Chart */}
                    <div
                        className="p-8 rounded-3xl bg-joy-dark/60 backdrop-blur-sm"
                        style={{
                            border: '3px solid transparent',
                            backgroundImage: 'linear-gradient(#1a0b2e, #1a0b2e), linear-gradient(to right, #a855f7, #f472b6)',
                            backgroundOrigin: 'border-box',
                            backgroundClip: 'padding-box, border-box',
                        }}
                        suppressHydrationWarning
                    >
                        <h3 className="text-2xl font-bold text-purple-300 mb-6">Kindness by Day</h3>
                        <div className="flex items-end justify-between gap-2 h-48">
                            {dayStats.map((stat) => {
                                const height = maxDayCount > 0 ? (stat.count / maxDayCount) * 100 : 0;
                                return (
                                    <div key={stat.day} className="flex-1 flex flex-col items-center gap-2">
                                        <div className="w-full flex items-end justify-center h-40">
                                            <div
                                                className="w-full rounded-t-lg transition-all duration-500"
                                                style={{
                                                    height: `${height}%`,
                                                    background: 'linear-gradient(to top, #a855f7, #f472b6)',
                                                    minHeight: stat.count > 0 ? '8px' : '0',
                                                }}
                                            />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-purple-200 text-sm font-medium">{stat.day}</p>
                                            <p className="text-white/40 text-xs">{stat.count}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Motivational Message */}
                    {totalActs > 0 && (
                        <div className="text-center p-6">
                            <p className="text-purple-200 text-lg">
                                {streak > 0 && `🔥 Amazing! You're on a ${streak}-day streak! `}
                                You've spread kindness {totalActs} time{totalActs !== 1 ? 's' : ''}.
                                Keep making the world brighter! 💜
                            </p>
                        </div>
                    )}

                    {totalActs === 0 && (
                        <div className="text-center p-12">
                            <p className="text-white/60 text-lg">
                                Start logging acts of kindness to see your insights!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
