'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

const TOTAL_STEPS = 5;

export default function OnboardingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);

    const handleNext = () => {
        if (currentStep < TOTAL_STEPS) {
            setCurrentStep(currentStep + 1);
        } else {
            // Mark onboarding as complete and navigate to login
            if (typeof window !== 'undefined') {
                localStorage.setItem('joypop_onboarding_complete', 'true');
            }
            router.push('/login');
        }
    };

    const handleSkip = () => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('joypop_onboarding_complete', 'true');
        }
        router.push('/login');
    };

    return (
        <div className="min-h-screen md:min-h-screen mobile-viewport bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 relative overflow-hidden">
            {/* Animated Background Blobs */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-blob" />
                <div className="absolute top-40 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
                <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-purple-600/25 rounded-full blur-3xl animate-blob animation-delay-4000" />
            </div>

            {/* Skip Button */}
            <div className="absolute top-6 right-6 z-20">
                <button
                    onClick={handleSkip}
                    className="text-white/60 hover:text-white/90 transition-colors text-sm font-medium"
                >
                    Skip
                </button>
            </div>

            {/* Content Container */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-4 md:p-6">
                <div className="w-full max-w-md">
                    {/* Step Content */}
                    <div className="transition-all duration-500 ease-in-out">
                        {currentStep === 1 && <Step1Welcome />}
                        {currentStep === 2 && <Step2Science />}
                        {currentStep === 3 && <Step3ThreeStars />}
                        {currentStep === 4 && <Step4HowItWorks />}
                        {currentStep === 5 && <Step5Ready />}
                    </div>

                    {/* Next Button */}
                    <div className="mt-8">
                        <button
                            onClick={handleNext}
                            className="w-full bg-gradient-to-r from-yellow-400 to-pink-400 text-purple-900 font-bold py-4 rounded-2xl hover:scale-105 transition-transform shadow-lg shadow-pink-500/50 flex items-center justify-center gap-2"
                        >
                            {currentStep === TOTAL_STEPS ? 'Get Started' : 'Next'}
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Progress Dots */}
                    <div className="flex justify-center gap-2 mt-6">
                        {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
                            <div
                                key={index}
                                className={`h-2 rounded-full transition-all duration-300 ${index + 1 === currentStep
                                    ? 'w-8 bg-gradient-to-r from-yellow-400 to-pink-400'
                                    : 'w-2 bg-white/30'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Step 1: Welcome & Brand Introduction
function Step1Welcome() {
    return (
        <div className="text-center animate-fade-in">
            <div className="mb-8 flex justify-center">
                <Image
                    src="/assets/hero-jar.png"
                    alt="JoyPop Jar"
                    width={300}
                    height={400}
                    className="drop-shadow-2xl animate-float"
                />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">
                Welcome to JoyPop
            </h1>
            <p className="text-xl text-white/80 mb-2">
                Your pocket-sized happiness companion
            </p>
            <p className="text-lg text-white/70">
                Collect moments of joy, one luminous star at a time
            </p>
        </div>
    );
}

// Step 2: The Science Behind It
function Step2Science() {
    return (
        <div className="text-center animate-fade-in">
            <h2 className="text-4xl font-bold text-white mb-4">
                Science-Backed Happiness
            </h2>
            <p className="text-white/80 mb-6 leading-relaxed">
                Based on insights from Yale's Science of Wellbeing course, research shows three powerful practices boost lasting happiness:
            </p>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 space-y-4">
                <div className="text-left">
                    <div className="flex items-start gap-3">
                        <Image
                            src="/assets/star-savouring.png"
                            alt="Savouring"
                            width={32}
                            height={32}
                            className="mt-1"
                        />
                        <div>
                            <h3 className="text-white font-semibold text-lg">Savouring</h3>
                            <p className="text-white/70 text-sm">Mindfully appreciating positive moments</p>
                        </div>
                    </div>
                </div>

                <div className="text-left">
                    <div className="flex items-start gap-3">
                        <Image
                            src="/assets/star-gratitude.png"
                            alt="Gratitude"
                            width={32}
                            height={32}
                            className="mt-1"
                        />
                        <div>
                            <h3 className="text-white font-semibold text-lg">Gratitude</h3>
                            <p className="text-white/70 text-sm">Acknowledging what you're thankful for</p>
                        </div>
                    </div>
                </div>

                <div className="text-left">
                    <div className="flex items-start gap-3">
                        <Image
                            src="/assets/star-kindness.png"
                            alt="Kindness"
                            width={32}
                            height={32}
                            className="mt-1"
                        />
                        <div>
                            <h3 className="text-white font-semibold text-lg">Kindness</h3>
                            <p className="text-white/70 text-sm">Acts of compassion toward others</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-center">
                <Image
                    src="/assets/yale-badge.png"
                    alt="Yale Science of Wellbeing"
                    width={60}
                    height={60}
                    className="opacity-70"
                />
            </div>
        </div>
    );
}

// Step 3: The Three Star Types
function Step3ThreeStars() {
    return (
        <div className="text-center animate-fade-in">
            <h2 className="text-4xl font-bold text-white mb-3">
                Three Ways to Shine
            </h2>
            <p className="text-white/80 mb-8">
                Each practice becomes a luminous star in your jar:
            </p>

            <div className="space-y-4">
                {/* Savouring Star */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all">
                    <div className="flex items-center gap-4">
                        <Image
                            src="/assets/star-savouring.png"
                            alt="Savouring Star"
                            width={80}
                            height={80}
                            className="drop-shadow-lg"
                        />
                        <div className="text-left flex-1">
                            <h3 className="text-white font-bold text-lg mb-1">Savouring Star</h3>
                            <p className="text-white/70 text-sm">Pause and savour life's sweet moments</p>
                        </div>
                    </div>
                </div>

                {/* Gratitude Star */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all">
                    <div className="flex items-center gap-4">
                        <Image
                            src="/assets/star-gratitude.png"
                            alt="Gratitude Star"
                            width={80}
                            height={80}
                            className="drop-shadow-lg"
                        />
                        <div className="text-left flex-1">
                            <h3 className="text-white font-bold text-lg mb-1">Gratitude Star</h3>
                            <p className="text-white/70 text-sm">Express what you're grateful for</p>
                        </div>
                    </div>
                </div>

                {/* Kindness Star */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all">
                    <div className="flex items-center gap-4">
                        <Image
                            src="/assets/star-kindness.png"
                            alt="Kindness Star"
                            width={80}
                            height={80}
                            className="drop-shadow-lg"
                        />
                        <div className="text-left flex-1">
                            <h3 className="text-white font-bold text-lg mb-1">Kindness Star</h3>
                            <p className="text-white/70 text-sm">Spread compassion through small acts</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Step 4: How It Works (The Jar Concept)
function Step4HowItWorks() {
    return (
        <div className="text-center animate-fade-in">
            <h2 className="text-4xl font-bold text-white mb-4">
                Fill Your Joy Jar
            </h2>
            <p className="text-white/80 mb-8 leading-relaxed">
                As you practice these habits, your jar fills with 60 glowing stars. When it's full, save it as a beautiful memory and start fresh!
            </p>

            {/* Jar Progression */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="grid grid-cols-4 gap-3 mb-4">
                    <div className="text-center">
                        <Image
                            src="/assets/ob-jar-empty.png"
                            alt="Empty Jar"
                            width={80}
                            height={100}
                            className="mx-auto mb-2"
                        />
                        <p className="text-white/60 text-xs">Empty</p>
                    </div>
                    <div className="text-center">
                        <Image
                            src="/assets/ob-jar-1-stars.png"
                            alt="Jar with 1 star"
                            width={80}
                            height={100}
                            className="mx-auto mb-2"
                        />
                        <p className="text-white/60 text-xs">Starting</p>
                    </div>
                    <div className="text-center">
                        <Image
                            src="/assets/ob-jar-2-stars.png"
                            alt="Jar with 2 stars"
                            width={80}
                            height={100}
                            className="mx-auto mb-2"
                        />
                        <p className="text-white/60 text-xs">Growing</p>
                    </div>
                    <div className="text-center">
                        <Image
                            src="/assets/ob-jar-full.png"
                            alt="Full Jar"
                            width={80}
                            height={100}
                            className="mx-auto mb-2"
                        />
                        <p className="text-white/60 text-xs">Full!</p>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/20">
                    <Image
                        src="/assets/ob-jar-full-light-confetti.png"
                        alt="Completed Jar"
                        width={200}
                        height={250}
                        className="mx-auto drop-shadow-2xl animate-pulse-slow"
                    />
                    <p className="text-white/90 font-semibold mt-4">
                        Save your filled jar as a cherished memory!
                    </p>
                </div>
            </div>
        </div>
    );
}

// Step 5: Ready to Begin
function Step5Ready() {
    return (
        <div className="text-center animate-fade-in">
            {/* Journey Path - Full Width at Top */}
            <div className="mb-8 -mx-6">
                <Image
                    src="/assets/journey-path.png"
                    alt="Your Journey"
                    width={600}
                    height={200}
                    className="w-full object-cover rounded-2xl"
                />
            </div>

            <h2 className="text-4xl font-bold text-white mb-4">
                Your Journey Starts Now
            </h2>
            <p className="text-white/80 mb-6 leading-relaxed">
                Ready to collect your first star? Let's begin building your happiness practice, one moment at a time.
            </p>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="space-y-3 text-white/70">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-pink-400 flex items-center justify-center text-purple-900 font-bold text-sm">
                            1
                        </div>
                        <p className="text-left">Sign in with your email</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-pink-400 flex items-center justify-center text-purple-900 font-bold text-sm">
                            2
                        </div>
                        <p className="text-left">Start collecting stars</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-pink-400 flex items-center justify-center text-purple-900 font-bold text-sm">
                            3
                        </div>
                        <p className="text-left">Watch your happiness grow</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
