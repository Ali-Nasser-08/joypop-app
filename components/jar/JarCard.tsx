'use client';

import { Jar } from '@/types/database';
import Image from 'next/image';

interface JarCardProps {
    jar: Jar;
}

export function JarCard({ jar }: JarCardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-6 hover:border-white/40 hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300">
            {/* Jar Image */}
            <div className="relative w-32 h-32 mx-auto mb-4">
                <Image
                    src="/assets/filled-jar.png"
                    alt={jar.name}
                    width={128}
                    height={128}
                    className="object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                />

                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/0 via-pink-400/0 to-cyan-400/0 group-hover:from-yellow-400/20 group-hover:via-pink-400/20 group-hover:to-cyan-400/20 rounded-full blur-xl transition-all duration-300" />
            </div>

            {/* Jar Name */}
            <h3 className="text-xl font-bold text-white text-center mb-2 line-clamp-2">
                {jar.name}
            </h3>

            {/* Date */}
            <p className="text-white/60 text-sm text-center mb-3">
                {formatDate(jar.created_at)}
            </p>

            {/* Star Count Badge */}
            <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 via-pink-500/20 to-cyan-500/20 border border-white/20 rounded-full">
                    <span className="text-yellow-300 text-lg">⭐</span>
                    <span className="text-white/80 font-medium">60 stars</span>
                </div>
            </div>
        </div>
    );
}
