'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getJars } from '@/lib/api/jars';
import { getCurrentUser } from '@/lib/api/auth';
import { Jar } from '@/types/database';
import { JarCard } from '@/components/jar/JarCard';
import { ArrowLeft } from 'lucide-react';

export default function JarsPage() {
    const router = useRouter();
    const [jars, setJars] = useState<Jar[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadJars() {
            const user = await getCurrentUser();

            if (!user) {
                router.push('/login');
                return;
            }

            try {
                const userJars = await getJars();
                setJars(userJars);
            } catch (error) {
                console.error('Error loading jars:', error);
            } finally {
                setIsLoading(false);
            }
        }

        loadJars();
    }, [router]);

    return (
        <div className="min-h-screen bg-joy-dark relative overflow-hidden">
            {/* Animated Background Blobs with thematic colors */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-blob" />
                <div className="absolute top-40 right-10 w-96 h-96 bg-cyan-400/15 rounded-full blur-3xl animate-blob animation-delay-2000" />
                <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
            </div>

            {/* Content */}
            <div className="relative z-10 p-6 pb-24">
                {/* Header */}
                <div className="flex items-center mb-8">
                    <button
                        onClick={() => router.push('/')}
                        className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all"
                    >
                        <ArrowLeft className="w-6 h-6 text-white" />
                    </button>
                    <h1 className="flex-1 text-center text-3xl font-bold text-white pr-12">
                        Jar Collection
                    </h1>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="text-center mt-20">
                        <p className="text-white/60 text-lg">Loading your jars...</p>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && jars.length === 0 && (
                    <div className="text-center mt-20 px-6">
                        <div className="text-6xl mb-6">🫙</div>
                        <h2 className="text-2xl font-bold text-white mb-3">No Saved Jars Yet</h2>
                        <p className="text-white/60 text-lg mb-8">
                            Fill your jar with 60 stars to save your first collection!
                        </p>
                        <button
                            onClick={() => router.push('/')}
                            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white font-medium hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg shadow-pink-500/30"
                        >
                            Start Collecting
                        </button>
                    </div>
                )}

                {/* Jar Grid */}
                {!isLoading && jars.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {jars.map((jar) => (
                            <JarCard key={jar.id} jar={jar} />
                        ))}
                    </div>
                )}

                {/* Subtitle for filled gallery */}
                {!isLoading && jars.length > 0 && (
                    <div className="text-center mt-12">
                        <p className="text-white/50 text-sm">
                            {jars.length} {jars.length === 1 ? 'jar' : 'jars'} of beautiful memories
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
