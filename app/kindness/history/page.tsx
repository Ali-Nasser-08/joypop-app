'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStarsByType } from '@/lib/api/stars';
import { StarEntry } from '@/types/database';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import Image from 'next/image';

export default function KindnessHistoryPage() {
    const router = useRouter();
    const [kindnessActs, setKindnessActs] = useState<StarEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedActs, setExpandedActs] = useState<Set<string>>(new Set());
    const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);

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

    const toggleExpanded = (actId: string) => {
        setExpandedActs(prev => {
            const newSet = new Set(prev);
            if (newSet.has(actId)) {
                newSet.delete(actId);
            } else {
                newSet.add(actId);
            }
            return newSet;
        });
    };

    // Extract hashtags from content
    const extractHashtags = (content: string): string[] => {
        const hashtagRegex = /#\w+/g;
        return content.match(hashtagRegex) || [];
    };

    // Get all unique hashtags from all acts
    const getAllHashtags = (): string[] => {
        const allTags = new Set<string>();
        kindnessActs.forEach(act => {
            extractHashtags(act.content).forEach(tag => allTags.add(tag));
        });
        return Array.from(allTags).sort();
    };

    // Filter acts by selected hashtag
    const filteredActs = selectedHashtag
        ? kindnessActs.filter(act => extractHashtags(act.content).includes(selectedHashtag))
        : kindnessActs;

    const shouldTruncate = (text: string) => text.length > 100;
    const getTruncatedText = (text: string) => text.slice(0, 100) + '...';

    // Render text with hashtag highlighting
    const renderTextWithHashtags = (text: string) => {
        const parts = text.split(/(#\w+)/g);
        return parts.map((part, index) => {
            if (part.startsWith('#')) {
                return (
                    <span
                        key={index}
                        className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold"
                    >
                        {part}
                    </span>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-joy-dark flex items-center justify-center">
                <div className="text-white text-xl">Loading kindness acts...</div>
            </div>
        );
    }

    const allHashtags = getAllHashtags();

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
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <button
                            onClick={() => router.back()}
                            className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all"
                        >
                            <ArrowLeft className="w-6 h-6 text-purple-300" />
                        </button>
                        <h1 className="text-3xl font-bold text-purple-300 ml-4">Acts of Kindness</h1>
                    </div>

                    {/* Insights Button */}
                    <button
                        onClick={() => router.push('/kindness/insights')}
                        className="px-4 py-2 rounded-2xl text-purple-300 font-medium transition-all"
                        style={{
                            border: '3px solid transparent',
                            backgroundImage: 'linear-gradient(#1a0b2e, #1a0b2e), linear-gradient(to right, #a855f7, #f472b6)',
                            backgroundOrigin: 'border-box',
                            backgroundClip: 'padding-box, border-box',
                        }}
                        suppressHydrationWarning
                    >
                        Insights
                    </button>
                </div>

                {/* Hashtag Filter Chips */}
                {allHashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6 max-w-2xl mx-auto">
                        <button
                            onClick={() => setSelectedHashtag(null)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedHashtag === null
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                                }`}
                        >
                            All
                        </button>
                        {allHashtags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => setSelectedHashtag(tag)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedHashtag === tag
                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                        : 'bg-white/10 text-purple-300/80 hover:bg-white/20'
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                )}

                {/* Acts List */}
                {filteredActs.length === 0 ? (
                    <div className="text-center mt-20">
                        <p className="text-white/60 text-lg">
                            {selectedHashtag ? `No acts with ${selectedHashtag}` : 'No kindness acts logged yet.'}
                        </p>
                        {!selectedHashtag && (
                            <p className="text-white/40 mt-2">Start spreading kindness to collect stars!</p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4 max-w-2xl mx-auto">
                        {filteredActs.map((act) => {
                            const isExpanded = expandedActs.has(act.id);
                            const needsTruncation = shouldTruncate(act.content);
                            const displayText = needsTruncation && !isExpanded
                                ? getTruncatedText(act.content)
                                : act.content;
                            const hashtags = extractHashtags(act.content);

                            return (
                                <div
                                    key={act.id}
                                    className="p-6 rounded-3xl bg-joy-dark/60 backdrop-blur-sm transition-all hover:scale-[1.02]"
                                    style={{
                                        border: '3px solid transparent',
                                        backgroundImage: 'linear-gradient(#1a0b2e, #1a0b2e), linear-gradient(to right, #a855f7, #f472b6, #ec4899)',
                                        backgroundOrigin: 'border-box',
                                        backgroundClip: 'padding-box, border-box',
                                    }}
                                    suppressHydrationWarning
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Kindness Star Icon */}
                                        <div className="flex-shrink-0">
                                            <Image
                                                src="/assets/kindness-star.png"
                                                alt="Kindness Star"
                                                width={48}
                                                height={48}
                                                className="w-12 h-12"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-purple-300 text-lg mb-2 break-words">
                                                {renderTextWithHashtags(displayText)}
                                            </p>

                                            {/* See More Button */}
                                            {needsTruncation && (
                                                <button
                                                    onClick={() => toggleExpanded(act.id)}
                                                    className="flex items-center gap-1 text-purple-300/70 text-sm hover:text-purple-300 transition-all mb-2"
                                                >
                                                    <span>{isExpanded ? 'see less' : 'see more'}</span>
                                                    <ChevronDown
                                                        className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                                                    />
                                                </button>
                                            )}

                                            {/* Hashtag chips */}
                                            {hashtags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-2">
                                                    {hashtags.map((tag, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <p className="text-white/40 text-sm">
                                                {new Date(act.created_at).toLocaleDateString('en-US', {
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
