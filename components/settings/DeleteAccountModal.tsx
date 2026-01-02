'use client';

import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface DeleteAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

export function DeleteAccountModal({ isOpen, onClose, onConfirm }: DeleteAccountModalProps) {
    const [confirmText, setConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        if (confirmText !== 'DELETE') {
            setError('Please type DELETE to confirm');
            return;
        }

        setIsDeleting(true);
        setError(null);

        try {
            await onConfirm();
            // No need to close modal or reset state - user will be redirected
        } catch (err) {
            setError('Failed to delete account. Please try again.');
            setIsDeleting(false);
        }
    };

    const handleClose = () => {
        if (!isDeleting) {
            setConfirmText('');
            setError(null);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-gradient-to-br from-red-900/40 to-purple-900/40 backdrop-blur-md border border-red-500/30 rounded-3xl p-6 shadow-2xl">
                {/* Close Button */}
                {!isDeleting && (
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>
                )}

                {/* Warning Icon */}
                <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-red-500/20">
                        <AlertTriangle className="w-12 h-12 text-red-400" />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-white text-center mb-2">
                    Delete Account?
                </h2>

                {/* Warning Text */}
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <p className="text-white/90 text-sm leading-relaxed">
                        <strong className="text-red-300">Warning:</strong> This action is permanent and cannot be undone.
                        All your data will be permanently deleted, including:
                    </p>
                    <ul className="mt-3 space-y-1 text-white/80 text-sm">
                        <li>• All your stars (savouring, kindness, gratitude)</li>
                        <li>• All your saved jars</li>
                        <li>• Your profile and account information</li>
                    </ul>
                </div>

                {/* Confirmation Input */}
                <div className="mb-4">
                    <label className="block text-white/90 text-sm font-medium mb-2">
                        Type <span className="font-bold text-red-300">DELETE</span> to confirm:
                    </label>
                    <input
                        type="text"
                        value={confirmText}
                        onChange={(e) => {
                            setConfirmText(e.target.value);
                            setError(null);
                        }}
                        disabled={isDeleting}
                        placeholder="DELETE"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-red-400/50 focus:bg-white/15 transition-all disabled:opacity-50"
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-xl">
                        <p className="text-red-200 text-sm text-center">{error}</p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={handleClose}
                        disabled={isDeleting}
                        className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isDeleting || confirmText !== 'DELETE'}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 rounded-xl text-white font-medium transition-all shadow-lg shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                        {isDeleting ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Deleting...
                            </span>
                        ) : (
                            'Delete Account'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
