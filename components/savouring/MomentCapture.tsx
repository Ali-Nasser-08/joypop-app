'use client';

import { useState } from 'react';
import { createStar } from '@/lib/api/stars';
import { ArrowRight, AlertCircle, X } from 'lucide-react';

interface MomentCaptureProps {
    onSave: () => void;
    onCancel?: () => void;
}

export function MomentCapture({ onSave, onCancel }: MomentCaptureProps) {
    const [moment, setMoment] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [rateLimitError, setRateLimitError] = useState<string | null>(null);

    const handleSave = async () => {
        setIsSaving(true);
        setRateLimitError(null);

        try {
            // Allow empty moments - the savouring timer is the practice
            await createStar('savouring', moment.trim() || '');
            setMoment('');
            onSave();
        } catch (error: any) {
            console.error('Error saving moment:', error);

            // Check if it's a rate limit error
            if (error.isRateLimit) {
                setRateLimitError(error.message);
            } else {
                // Generic error handling
                setRateLimitError('Failed to save star. Please try again.');
            }
        } finally {
            setIsSaving(false);
        }
    };

    // Calculate font size based on text length
    const getFontSize = () => {
        const length = moment.length;
        if (length === 0) return 'text-4xl';
        if (length < 30) return 'text-4xl';
        if (length < 60) return 'text-3xl';
        if (length < 100) return 'text-2xl';
        if (length < 150) return 'text-xl';
        return 'text-lg';
    };

    const isNearLimit = moment.length >= 200;

    return (
        <div className="relative flex flex-col items-center justify-center h-screen px-6 py-8" style={{ minHeight: '100dvh' }}>
            {/* Rate Limit Error Message */}
            {rateLimitError && (
                <div className="fixed top-8 left-1/2 transform -translate-x-1/2 max-w-md w-full mx-4 p-6 rounded-3xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-xl border-2 border-pink-400/30 shadow-2xl z-50 animate-fade-in">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-pink-300 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                            <div className="text-white whitespace-pre-line text-sm leading-relaxed">
                                {rateLimitError}
                            </div>
                            <button
                                onClick={() => setRateLimitError(null)}
                                className="mt-4 px-4 py-2 bg-pink-500/30 hover:bg-pink-500/40 rounded-xl text-pink-200 text-sm font-medium transition-all"
                            >
                                Got it!
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Back/Cancel button at top left - enlarged to match arrow button */}
            {onCancel && (
                <button
                    onClick={onCancel}
                    className="absolute top-6 left-6 p-5 md:p-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all z-10"
                >
                    <X className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </button>
            )}

            {/* Instruction text - always show */}
            <p className="text-white/40 text-sm mb-8 text-center animate-fade-in">
                Capture one thing about this moment.
            </p>

            {/* Text input - full screen, centered, dynamic size */}
            <textarea
                value={moment}
                onChange={(e) => setMoment(e.target.value)}
                placeholder="What made this moment special? try using #hashtags (optional)"
                className={`w-full max-w-3xl p-6 bg-transparent text-white placeholder-white/30 text-center resize-none focus:outline-none transition-all duration-300 ${getFontSize()}`}
                rows={6}
                maxLength={200}
                autoFocus
            />

            {/* Character limit warning - only show when near limit */}
            {isNearLimit && (
                <p className="text-yellow-300/60 text-sm mt-4 animate-fade-in">
                    {moment.length}/200 characters
                </p>
            )}

            {/* Arrow button - always show, positioned at top right opposite the X button */}
            <button
                onClick={handleSave}
                disabled={isSaving}
                className="absolute top-6 right-6 p-5 md:p-6 rounded-full transition-all duration-300 disabled:opacity-50 animate-fade-in z-10"
                style={{
                    background: 'linear-gradient(135deg, #22d3ee, #06b6d4, #0891b2)',
                    boxShadow: '0 0 40px rgba(34, 211, 238, 0.5)',
                }}
                suppressHydrationWarning
            >
                <ArrowRight className="w-7 h-7 md:w-8 md:h-8 text-white" strokeWidth={2.5} />
            </button>
        </div>
    );
}
