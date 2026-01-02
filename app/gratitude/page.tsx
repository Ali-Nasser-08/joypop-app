'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SunButton } from '@/components/gratitude/SunButton';
import { GratitudeCapture } from '@/components/gratitude/GratitudeCapture';
import { useSavouring } from '@/contexts/SavouringContext';

type PageState = 'info' | 'capture';

export default function GratitudePage() {
    const router = useRouter();
    const [pageState, setPageState] = useState<PageState>('info');
    const { setIsCaptureActive } = useSavouring();

    const handleSunComplete = () => {
        setPageState('capture');
        setIsCaptureActive(true);
    };

    const handleGratitudeSaved = () => {
        // Return to info state after saving
        setPageState('info');
        setIsCaptureActive(false);
    };

    const handleCaptureCancel = () => {
        // Return to info state when user cancels
        setPageState('info');
        setIsCaptureActive(false);
    };

    return (
        <div className="min-h-screen md:min-h-screen mobile-viewport bg-joy-dark relative overflow-hidden">
            {/* Animated Background Blobs */}
            <div className="absolute inset-0 overflow-hidden">
                {pageState === 'info' && (
                    <>
                        <div className="absolute top-20 left-10 w-96 h-96 bg-yellow-400/30 rounded-full blur-3xl animate-blob" />
                        <div className="absolute top-40 right-10 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
                        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-orange-400/25 rounded-full blur-3xl animate-blob animation-delay-4000" />
                    </>
                )}
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col p-4 md:p-6 pb-24">
                {/* Header with History Button */}
                <div
                    className={`flex items-center justify-end mb-4 md:mb-8 flex-shrink-0 transition-all duration-500 ${pageState === 'capture' ? 'opacity-0 blur-sm pointer-events-none' : 'opacity-100 blur-0'
                        }`}
                >
                    <button
                        onClick={() => router.push('/gratitude/history')}
                        className="px-4 py-2 rounded-2xl text-yellow-300 font-medium transition-all"
                        style={{
                            border: '3px solid transparent',
                            backgroundImage: 'linear-gradient(#1a0b2e, #1a0b2e), linear-gradient(to right, #fbbf24, #f59e0b)',
                            backgroundOrigin: 'border-box',
                            backgroundClip: 'padding-box, border-box',
                        }}
                        suppressHydrationWarning
                    >
                        History
                    </button>
                </div>

                {/* Info State with blur transition */}
                <div
                    className={`flex-1 flex flex-col justify-center max-w-lg mx-auto space-y-6 md:space-y-8 transition-all duration-700 ${pageState === 'info' ? 'opacity-100 blur-0' : 'opacity-0 blur-md pointer-events-none absolute inset-0'
                        }`}
                >
                    {/* Info Card */}
                    <div
                        className="p-5 md:p-8 rounded-3xl bg-joy-dark/80 backdrop-blur-sm"
                        style={{
                            border: '3px solid transparent',
                            backgroundImage: 'linear-gradient(#1a0b2e, #1a0b2e), linear-gradient(to right, #fbbf24, #f59e0b, #fb923c)',
                            backgroundOrigin: 'border-box',
                            backgroundClip: 'padding-box, border-box',
                        }}
                        suppressHydrationWarning
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-yellow-300 mb-3 md:mb-4">Gratitude</h2>

                        <p className="text-yellow-200 text-base md:text-lg mb-3 md:mb-4">
                            Practicing gratitude shifts your focus to the positive.
                            Research shows that regularly acknowledging what you're
                            thankful for increases happiness and well-being.
                        </p>

                        <p className="text-amber-300 text-base md:text-lg font-medium">
                            Click the sun to express gratitude and earn a star!
                        </p>
                    </div>

                    {/* Sun Button */}
                    <div className="flex justify-center">
                        <SunButton onComplete={handleSunComplete} />
                    </div>
                </div>

                {/* Capture State with blur transition */}
                <div
                    className={`transition-all duration-700 ${pageState === 'capture' ? 'opacity-100 blur-0' : 'opacity-0 blur-md pointer-events-none absolute inset-0'
                        }`}
                >
                    {pageState === 'capture' && <GratitudeCapture onSave={handleGratitudeSaved} onCancel={handleCaptureCancel} />}
                </div>
            </div>
        </div>
    );
}
