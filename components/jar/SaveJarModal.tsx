'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface SaveJarModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string) => Promise<void>;
}

export function SaveJarModal({ isOpen, onClose, onSave }: SaveJarModalProps) {
    const [jarName, setJarName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSave = async () => {
        const trimmedName = jarName.trim();

        if (!trimmedName) {
            setError('Please enter a name for your jar');
            return;
        }

        if (trimmedName.length > 50) {
            setError('Name is too long (max 50 characters)');
            return;
        }

        setIsSaving(true);
        setError('');

        try {
            await onSave(trimmedName);
            setJarName('');
            onClose();
        } catch (err) {
            setError('Failed to save jar. Please try again.');
            console.error('Error saving jar:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleClose = () => {
        if (!isSaving) {
            setJarName('');
            setError('');
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    disabled={isSaving}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all disabled:opacity-50"
                >
                    <X className="w-5 h-5 text-white" />
                </button>

                {/* Title */}
                <h2 className="text-2xl font-bold text-white mb-2">Save Your Jar</h2>
                <p className="text-white/70 text-sm mb-6">
                    You've filled your jar with 60 beautiful moments! Give it a name to remember.
                </p>

                {/* Input */}
                <input
                    type="text"
                    value={jarName}
                    onChange={(e) => setJarName(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !isSaving) {
                            handleSave();
                        }
                    }}
                    placeholder="e.g., December Memories"
                    disabled={isSaving}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-pink-400/50 transition-all disabled:opacity-50"
                    autoFocus
                />

                {/* Error Message */}
                {error && (
                    <p className="mt-2 text-red-300 text-sm">{error}</p>
                )}

                {/* Buttons */}
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={handleClose}
                        disabled={isSaving}
                        className="flex-1 px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-white font-medium hover:bg-white/20 transition-all disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white font-medium hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50 shadow-lg shadow-pink-500/30"
                    >
                        {isSaving ? 'Saving...' : 'Save Jar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
