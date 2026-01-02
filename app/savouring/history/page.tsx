'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStarsByType } from '@/lib/api/stars';
import { StarEntry } from '@/types/database';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import Image from 'next/image';

export default function SavouringHistoryPage() {
    const router = useRouter();
    const [moments, setMoments] = useState<StarEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedMoments, setExpandedMoments] = useState<Set<string>>(new Set());

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

    const toggleExpanded = (momentId: string) => {
        setExpandedMoments(prev => {
            const newSet = new Set(prev);
            if (newSet.has(momentId)) {
                newSet.delete(momentId);
            } else {
                newSet.add(momentId);
            }
            return newSet;
        });
    };

    // Extract hashtags from content
    const extractHashtags = (content: string): string[] => {
        const hashtagRegex = /#\w+/g;
        return content.match(hashtagRegex) || [];
    };

    const shouldTruncate = (text: string) => text.length > 100;
    const getTruncatedText = (text: string) => text.slice(0, 100) + '...';

    if (loading) {
        return (
            <div className="min-h-screen bg-joy-dark flex items-center justify-center">
                <div className="text-white text-xl">Loading moments...</div>
            </div>
        );
    }

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
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <button
                            onClick={() => router.back()}
                            className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all"
                        >
                            <ArrowLeft className="w-6 h-6 text-cyan-300" />
                        </button>
                        <h1 className="text-3xl font-bold text-cyan-300 ml-4">Savoured Moments</h1>
                    </div>

                    {/* Insights Button */}
                    <button
                        onClick={() => router.push('/savouring/insights')}
                        className="px-4 py-2 rounded-2xl text-cyan-300 font-medium transition-all"
                        style={{
                            border: '3px solid transparent',
                            backgroundImage: 'linear-gradient(#1a0b2e, #1a0b2e), linear-gradient(to right, #22d3ee, #06b6d4)',
                            backgroundOrigin: 'border-box',
                            backgroundClip: 'padding-box, border-box',
                        }}
                        suppressHydrationWarning
                    >
                        Insights
                    </button>
                </div>

                {/* Moments List */}
                {moments.length === 0 ? (
                    <div className="text-center mt-20">
                        <p className="text-white/60 text-lg">No moments saved yet.</p>
                        <p className="text-white/40 mt-2">Start savouring to collect stars!</p>
                    </div>
                ) : (
                    <div className="space-y-4 max-w-2xl mx-auto">
                        {moments.map((moment) => {
                            const isExpanded = expandedMoments.has(moment.id);
                            const needsTruncation = shouldTruncate(moment.content);
                            const displayText = needsTruncation && !isExpanded
                                ? getTruncatedText(moment.content)
                                : moment.content;
                            const hashtags = extractHashtags(moment.content);

                            return (
                                <div
                                    key={moment.id}
                                    className="p-6 rounded-3xl bg-joy-dark/60 backdrop-blur-sm transition-all hover:scale-[1.02]"
                                    style={{
                                        border: '3px solid transparent',
                                        backgroundImage: 'linear-gradient(#1a0b2e, #1a0b2e), linear-gradient(to right, #22d3ee, #06b6d4, #0891b2)',
                                        backgroundOrigin: 'border-box',
                                        backgroundClip: 'padding-box, border-box',
                                    }}
                                    suppressHydrationWarning
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Savouring Star Icon */}
                                        <div className="flex-shrink-0">
                                            <Image
                                                src="/assets/savor-star.png"
                                                alt="Savouring Star"
                                                width={48}
                                                height={48}
                                                className="w-12 h-12"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-cyan-300 text-lg mb-2 break-words">{displayText}</p>

                                            {/* See More Button */}
                                            {needsTruncation && (
                                                <button
                                                    onClick={() => toggleExpanded(moment.id)}
                                                    className="flex items-center gap-1 text-cyan-300/70 text-sm hover:text-cyan-300 transition-all mb-2"
                                                >
                                                    <span>{isExpanded ? 'see less' : 'see more'}</span>
                                                    <ChevronDown
                                                        className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                                                    />
                                                </button>
                                            )}

                                            {/* Hashtag chips - simple and subtle */}
                                            {hashtags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-2">
                                                    {hashtags.map((tag, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <p className="text-white/40 text-sm">
                                                {new Date(moment.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
