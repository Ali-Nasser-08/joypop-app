'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Bell, Clock, Sparkles, Trash2, LogOut } from 'lucide-react';
import { useState } from 'react';
import { MiniJar } from '@/components/jar/MiniJar';
import { usePreferences } from '@/contexts/PreferencesContext';
import { JAR_SKINS } from '@/lib/jar-skins';
import { DeleteAccountModal } from '@/components/settings/DeleteAccountModal';
import { deleteUserAccount } from '@/lib/api/profile';
import { signOut } from '@/lib/api/auth';

export default function SettingsPage() {
    const router = useRouter();
    const { preferences, updateSavouringTimer, updateJarSkin } = usePreferences();
    const [notifications, setNotifications] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Convert JAR_SKINS object to array for mapping
    const jarSkinsArray = Object.entries(JAR_SKINS).map(([id, data]) => ({
        id,
        ...data
    }));

    const handleDeleteAccount = async () => {
        await deleteUserAccount();
        // User will be signed out and redirected automatically
        router.push('/');
    };

    const handleLogout = async () => {
        try {
            await signOut();
            router.push('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div className="min-h-screen bg-joy-dark relative overflow-hidden">
            {/* Animated Background Blobs */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-blob" />
                <div className="absolute top-40 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
                <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-purple-600/25 rounded-full blur-3xl animate-blob animation-delay-4000" />
            </div>

            {/* Content */}
            <div className="relative z-10 p-6 pb-24 max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center mb-8">
                    <button
                        onClick={() => router.push('/')}
                        className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all"
                    >
                        <ArrowLeft className="w-6 h-6 text-white" />
                    </button>
                    <h1 className="flex-1 text-center text-3xl font-bold text-white pr-12">
                        Settings
                    </h1>
                </div>

                {/* Creator Quote Section */}
                <div className="mb-8 p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-white/20 rounded-3xl">
                    <div className="flex items-start gap-3 mb-3">
                        <Sparkles className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-1" />
                        <div>
                            <p className="text-white/90 text-lg italic mb-2">
                                "Joy isn't found in grand moments—it's collected in the small, beautiful details we choose to notice."
                            </p>
                            <p className="text-white/60 text-sm">— The Creator of JoyPop</p>
                        </div>
                    </div>
                </div>

                {/* Settings Sections */}
                <div className="space-y-4">
                    {/* Preferences Section */}
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Preferences</h2>

                        {/* Savouring Timer Setting */}
                        <div className="mb-4 pb-4 border-b border-white/10">
                            <div className="flex items-center gap-3 mb-3">
                                <Clock className="w-5 h-5 text-purple-300" />
                                <div>
                                    <p className="text-white font-medium">Savouring Timer</p>
                                    <p className="text-white/60 text-sm">Duration for savouring moments</p>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-3">
                                {[30, 45, 60].map((duration) => (
                                    <button
                                        key={duration}
                                        onClick={() => updateSavouringTimer(duration)}
                                        className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all ${preferences.savouringTimer === duration
                                            ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                                            }`}
                                    >
                                        {duration}s
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Notifications Toggle */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Bell className="w-5 h-5 text-purple-300" />
                                <div>
                                    <p className="text-white font-medium">Notifications</p>
                                    <p className="text-white/60 text-sm">Get reminders to add stars</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setNotifications(!notifications)}
                                className={`relative w-14 h-8 rounded-full transition-all ${notifications ? 'bg-purple-500' : 'bg-white/20'
                                    }`}
                            >
                                <div
                                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${notifications ? 'left-7' : 'left-1'
                                        }`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Jar Skin Customization */}
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-2">Jar Skin</h2>
                        <p className="text-white/60 text-sm mb-4">Choose your jar's color theme</p>

                        <div className="grid grid-cols-3 gap-3">
                            {jarSkinsArray.map((skin) => (
                                <MiniJar
                                    key={skin.id}
                                    gradientId={`gradient-${skin.id}`}
                                    colors={skin.colors}
                                    isSelected={preferences.jarSkin === skin.id}
                                    onClick={() => updateJarSkin(skin.id)}
                                />
                            ))}
                        </div>

                        {/* Selected Skin Name */}
                        <p className="text-center text-white/70 text-sm mt-4">
                            {jarSkinsArray.find(s => s.id === preferences.jarSkin)?.name}
                        </p>
                    </div>

                    {/* Feedback Section */}
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Feedback</h2>
                        <p className="text-white/70 text-sm mb-4">
                            Have suggestions or found a bug? I'd love to hear from you!
                        </p>
                        <a
                            href="mailto:okayloy@gmail.com?subject=JoyPop Feedback"
                            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white font-medium hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50"
                        >
                            <Mail className="w-5 h-5" />
                            Send Feedback
                        </a>
                    </div>

                    {/* Privacy Section */}
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-2">Account</h2>
                        <p className="text-white/70 text-sm mb-4">
                            Manage your account and data
                        </p>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600/80 to-purple-500/80 hover:from-purple-600 hover:to-purple-500 border border-purple-400/30 rounded-xl text-white font-medium transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 mb-3"
                        >
                            <LogOut className="w-5 h-5" />
                            Log Out
                        </button>

                        {/* Delete Account Button */}
                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-red-600/80 to-red-500/80 hover:from-red-600 hover:to-red-500 border border-red-400/30 rounded-xl text-white font-medium transition-all shadow-lg shadow-red-500/20 hover:shadow-red-500/40"
                        >
                            <Trash2 className="w-5 h-5" />
                            Delete Account
                        </button>
                    </div>

                    {/* About Section */}
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-2">About JoyPop</h2>
                        <p className="text-white/70 text-sm mb-2">
                            A bite-sized wellbeing app for collecting moments of joy, gratitude, and kindness.
                        </p>
                        <p className="text-white/50 text-xs">Version 1.0.0</p>
                    </div>
                </div>

                {/* Bottom Spacing */}
                <div className="h-8" />
            </div>

            {/* Delete Account Modal */}
            <DeleteAccountModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteAccount}
            />
        </div>
    );
}
