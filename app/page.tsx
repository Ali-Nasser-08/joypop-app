'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { JoyJar } from '@/components/jar/JoyJar';
import { SaveJarModal } from '@/components/jar/SaveJarModal';
import { getUserStars, createStar, deleteStar, deleteAllStars } from '@/lib/api/stars';
import { createJar } from '@/lib/api/jars';
import { getCurrentUser } from '@/lib/api/auth';
import { StarEntry } from '@/types/database';
import { Settings } from 'lucide-react';
import { JAR_CAPACITY } from '@/lib/constants';
import Image from 'next/image';

export default function HomePage() {
  const router = useRouter();
  const [stars, setStars] = useState<StarEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function checkAuthAndLoadStars() {
      // Check if onboarding is complete
      const onboardingComplete = localStorage.getItem('joypop_onboarding_complete');

      if (!onboardingComplete) {
        router.push('/onboarding');
        return;
      }

      const user = await getCurrentUser();

      if (!user) {
        router.push('/login');
        return;
      }

      try {
        const userStars = await getUserStars();
        setStars(userStars);
      } catch (error) {
        console.error('Error loading stars:', error);
      }
    }

    checkAuthAndLoadStars();
  }, [router]);

  const handleSaveJar = async (name: string) => {
    await createJar(name);
    await deleteAllStars();
    setStars([]);
  };

  return (
    <div className="min-h-screen md:min-h-screen mobile-viewport bg-joy-dark relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-purple-600/25 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col p-4 md:p-6 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 md:mb-8 flex-shrink-0">
          {/* Jar Gallery Button */}
          <button
            onClick={() => router.push('/jars')}
            className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all"
          >
            <Image
              src="/assets/filled-jar.png"
              alt="Jar Gallery"
              width={24}
              height={24}
              className="opacity-80"
            />
          </button>

          {/* Settings Icon */}
          <button
            onClick={() => router.push('/settings')}
            className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all"
          >
            <Settings className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Joy Jar - Centered and flexible */}
        <div className="flex-1 flex items-center justify-center min-h-0">
          <JoyJar stars={stars} />
        </div>

        {/* Save Jar Button - appears at 60 stars */}
        {stars.length >= JAR_CAPACITY.total && (
          <div className="mt-4 md:mt-6 flex justify-center flex-shrink-0">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 rounded-2xl text-white font-bold text-base md:text-lg shadow-lg shadow-pink-500/50 hover:shadow-pink-500/70 hover:scale-105 transition-all duration-300 animate-pulse"
            >
              Save This Jar!
            </button>
          </div>
        )}
      </div>

      {/* Save Jar Modal */}
      <SaveJarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveJar}
      />
    </div>
  );
}
