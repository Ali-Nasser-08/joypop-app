'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HoldButton } from '@/components/savouring/HoldButton';
import { SavourTimer } from '@/components/savouring/SavourTimer';
import { MomentCapture } from '@/components/savouring/MomentCapture';
import { useSavouring } from '@/contexts/SavouringContext';

type PageState = 'info' | 'timer' | 'capture';

export default function SavouringPage() {
    const router = useRouter();
    const [pageState, setPageState] = useState<PageState>('info');
    const { setIsTimerActive, setIsCaptureActive } = useSavouring();

    const handleHoldComplete = () => {
        setPageState('timer');
        setIsTimerActive(true);
    };

    const handleTimerComplete = () => {
        setPageState('capture');
        setIsTimerActive(false);
        setIsCaptureActive(true);
    };

    const handleMomentSaved = () => {
        // Return to info state after saving
        setPageState('info');
        setIsCaptureActive(false);
    };

    const handleCaptureCancel = () => {
        // Return to info state when user cancels
        setPageState('info');
        setIsCaptureActive(false);
    };

    // Clean up timer state when component unmounts
    useEffect(() => {
        return () => {
            setIsTimerActive(false);
        };
    }, [setIsTimerActive]);

    return (
        <div className="min-h-screen md:min-h-screen mobile-viewport bg-joy-dark relative overflow-hidden">
            {/* Animated Background Blobs */}
            <div className="absolute inset-0 overflow-hidden">
                {pageState === 'info' && (
                    <>
                        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-400/30 rounded-full blur-3xl animate-blob" />
                        <div className="absolute top-40 right-10 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
                        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-sky-400/25 rounded-full blur-3xl animate-blob animation-delay-4000" />
                    </>
                )}
                {pageState === 'timer' && (
                    <>
                        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-400/40 rounded-full blur-3xl animate-gradient-shift" />
                        <div className="absolute top-40 right-10 w-96 h-96 bg-teal-400/30 rounded-full blur-3xl animate-gradient-shift animation-delay-2000" />
                        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-sky-400/35 rounded-full blur-3xl animate-gradient-shift animation-delay-4000" />
                    </>
                )}
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col p-4 md:p-6 pb-24">
                {/* Header with History Button - hidden during timer with fade */}
                <div
                    className={`flex items-center justify-end mb-4 md:mb-8 flex-shrink-0 transition-all duration-500 ${pageState === 'timer' ? 'opacity-0 blur-sm pointer-events-none' : 'opacity-100 blur-0'
                        }`}
                >
                    <button
                        onClick={() => router.push('/savouring/history')}
                        className="px-4 py-2 rounded-2xl text-cyan-300 font-medium transition-all"
                        style={{
                            border: '3px solid transparent',
                            backgroundImage: 'linear-gradient(#1a0b2e, #1a0b2e), linear-gradient(to right, #22d3ee, #06b6d4)',
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
                            backgroundImage: 'linear-gradient(#1a0b2e, #1a0b2e), linear-gradient(to right, #22d3ee, #06b6d4, #0891b2)',
                            backgroundOrigin: 'border-box',
                            backgroundClip: 'padding-box, border-box',
                        }}
                        suppressHydrationWarning
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-cyan-300 mb-3 md:mb-4">Savouring</h2>

                        <p className="text-cyan-200 text-base md:text-lg mb-3 md:mb-4">
                            Savouring means slowing down to fully feel a good moment.
                            Research shows that lingering for a few seconds helps your brain
                            encode calm and positive emotion.
                        </p>

                        <p className="text-teal-300 text-base md:text-lg font-medium">
                            Hold the button to start the savour timer and earn a star!
                        </p>
                    </div>

                    {/* Hold Button */}
                    <div className="flex justify-center">
                        <HoldButton onComplete={handleHoldComplete} />
                    </div>
                </div>

                {/* Timer State with blur transition */}
                <div
                    className={`transition-all duration-700 ${pageState === 'timer' ? 'opacity-100 blur-0' : 'opacity-0 blur-md pointer-events-none absolute inset-0'
                        }`}
                >
                    {pageState === 'timer' && <SavourTimer onComplete={handleTimerComplete} />}
                </div>

                {/* Capture State with blur transition */}
                <div
                    className={`transition-all duration-700 ${pageState === 'capture' ? 'opacity-100 blur-0' : 'opacity-0 blur-md pointer-events-none absolute inset-0'
                        }`}
                >
                    {pageState === 'capture' && <MomentCapture onSave={handleMomentSaved} onCancel={handleCaptureCancel} />}
                </div>
            </div>
        </div>
    );
}
