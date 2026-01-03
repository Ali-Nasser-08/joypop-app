'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, TestTube, ChevronRight, AlertCircle } from 'lucide-react';

export default function ConsentPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [declined, setDeclined] = useState(false);

    // Check if user has already consented
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const dataConsent = localStorage.getItem('joypop_data_consent');
            const betaConsent = localStorage.getItem('joypop_beta_consent');

            if (dataConsent === 'true' && betaConsent === 'true') {
                // User has already consented, go to login
                router.push('/login');
            }
        }
    }, [router]);

    const handleAgree = () => {
        if (currentStep === 1) {
            // Data privacy consent accepted
            if (typeof window !== 'undefined') {
                localStorage.setItem('joypop_data_consent', 'true');
            }
            setCurrentStep(2);
            setDeclined(false);
        } else if (currentStep === 2) {
            // Beta testing consent accepted
            if (typeof window !== 'undefined') {
                localStorage.setItem('joypop_beta_consent', 'true');
                localStorage.setItem('joypop_consent_date', new Date().toISOString());
            }
            router.push('/login');
        }
    };

    const handleDecline = () => {
        setDeclined(true);
    };

    const handleGoBack = () => {
        if (currentStep === 2) {
            setCurrentStep(1);
            setDeclined(false);
        }
    };

    return (
        <div className="min-h-screen md:min-h-screen mobile-viewport flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 p-4">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-2xl w-full border border-white/20">
                {/* Step 1: Data Privacy Consent */}
                {currentStep === 1 && (
                    <div className="animate-fade-in">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-pink-400 flex items-center justify-center">
                                <Shield className="w-8 h-8 text-purple-900" />
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-white mb-3 text-center">
                            Your Data & Privacy
                        </h2>

                        <p className="text-white/80 text-center mb-6 text-sm">
                            We want to be transparent about how JoyPop works
                        </p>

                        <div className="space-y-3 mb-6">
                            <div className="bg-white/10 rounded-xl p-4">
                                <h3 className="text-white font-semibold mb-2 text-lg">What we store</h3>
                                <ul className="space-y-1.5 text-sm text-white/80">
                                    <li>• Your email (for sign-in)</li>
                                    <li>• Your reflections & stars</li>
                                    <li>• Your saved jars</li>
                                </ul>
                            </div>

                            <div className="bg-white/10 rounded-xl p-4">
                                <h3 className="text-white font-semibold mb-2 text-lg">Why we store it</h3>
                                <ul className="space-y-1.5 text-sm text-white/80">
                                    <li>• Personalized experience</li>
                                    <li>• Sync across devices</li>
                                    <li>• Preserve your memories</li>
                                </ul>
                            </div>

                            <div className="bg-white/10 rounded-xl p-4">
                                <h3 className="text-white font-semibold mb-2 text-lg">How we protect it</h3>
                                <ul className="space-y-1.5 text-sm text-white/80">
                                    <li>• End-to-end encryption</li>
                                    <li>• Secure cloud storage</li>
                                    <li>• Delete anytime in settings</li>
                                </ul>
                            </div>
                        </div>

                        {!declined ? (
                            <div className="space-y-3">
                                <button
                                    onClick={handleAgree}
                                    className="w-full bg-gradient-to-r from-yellow-400 to-pink-400 text-purple-900 font-bold py-4 rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-2"
                                >
                                    I Understand & Agree
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleDecline}
                                    className="w-full bg-white/10 text-white/80 hover:text-white font-medium py-3 rounded-xl hover:bg-white/20 transition-all"
                                >
                                    I Don't Agree
                                </button>
                            </div>
                        ) : (
                            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-6 h-6 text-red-300 flex-shrink-0 mt-0.5" />
                                    <div className="text-red-200 text-sm">
                                        <p className="font-semibold mb-1">We understand</p>
                                        <p>
                                            We need your consent to store data to provide the JoyPop experience.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 2: Beta Testing Consent */}
                {currentStep === 2 && (
                    <div className="animate-fade-in">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-pink-400 flex items-center justify-center">
                                <TestTube className="w-8 h-8 text-purple-900" />
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-white mb-3 text-center">
                            Beta Experience
                        </h2>

                        <p className="text-white/80 text-center mb-6 text-sm">
                            JoyPop is currently in <strong className="text-white">beta/MVP</strong> status
                        </p>

                        <div className="space-y-3 mb-6">
                            <div className="bg-white/10 rounded-xl p-4">
                                <h3 className="text-white font-semibold mb-2 text-lg">What to expect</h3>
                                <ul className="space-y-1.5 text-sm text-white/80">
                                    <li>• Features still in development</li>
                                    <li>• Occasional bugs may occur</li>
                                    <li>• Regular updates & improvements</li>
                                </ul>
                            </div>

                            <div className="bg-white/10 rounded-xl p-4">
                                <h3 className="text-white font-semibold mb-2 text-lg">We ask for your</h3>
                                <ul className="space-y-1.5 text-sm text-white/80">
                                    <li>• <strong className="text-white">Patience</strong> as we improve</li>
                                    <li>• <strong className="text-white">Feedback</strong> to help us grow</li>
                                    <li>• <strong className="text-white">Understanding</strong> it's a work in progress</li>
                                </ul>
                            </div>
                        </div>

                        <p className="text-center text-white/90 font-medium mb-6 text-sm">
                            By continuing, you agree to test JoyPop in its beta state 🌟
                        </p>

                        {!declined ? (
                            <div className="space-y-3">
                                <button
                                    onClick={handleAgree}
                                    className="w-full bg-gradient-to-r from-yellow-400 to-pink-400 text-purple-900 font-bold py-4 rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-2"
                                >
                                    I'm Ready to Test!
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleGoBack}
                                        className="flex-1 bg-white/10 text-white/80 hover:text-white font-medium py-3 rounded-xl hover:bg-white/20 transition-all text-sm"
                                    >
                                        Go Back
                                    </button>
                                    <button
                                        onClick={handleDecline}
                                        className="flex-1 bg-white/10 text-white/80 hover:text-white font-medium py-3 rounded-xl hover:bg-white/20 transition-all text-sm"
                                    >
                                        I Don't Agree
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-6 h-6 text-red-300 flex-shrink-0 mt-0.5" />
                                    <div className="text-red-200 text-sm">
                                        <p className="font-semibold mb-1">We understand</p>
                                        <p className="mb-2">
                                            JoyPop is currently only available as a beta. We hope you'll come back when we're fully launched!
                                        </p>
                                        <button
                                            onClick={handleGoBack}
                                            className="text-sm underline hover:text-white transition-colors"
                                        >
                                            Go back
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Progress Indicator */}
                <div className="flex justify-center gap-2 mt-6">
                    <div className={`h-2 rounded-full transition-all duration-300 ${currentStep === 1 ? 'w-8 bg-gradient-to-r from-yellow-400 to-pink-400' : 'w-2 bg-white/30'}`} />
                    <div className={`h-2 rounded-full transition-all duration-300 ${currentStep === 2 ? 'w-8 bg-gradient-to-r from-yellow-400 to-pink-400' : 'w-2 bg-white/30'}`} />
                </div>
            </div>
        </div>
    );
}
