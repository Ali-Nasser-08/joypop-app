'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserPreferences {
    savouringTimer: number;
    jarSkin: string;
}

interface PreferencesContextType {
    preferences: UserPreferences;
    updateSavouringTimer: (duration: number) => void;
    updateJarSkin: (skinId: string) => void;
}

const defaultPreferences: UserPreferences = {
    savouringTimer: 30,
    jarSkin: 'default',
};

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: ReactNode }) {
    const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load preferences from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('joyPopPreferences');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setPreferences(parsed);
            } catch (error) {
                console.error('Error loading preferences:', error);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save preferences to localStorage whenever they change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('joyPopPreferences', JSON.stringify(preferences));
        }
    }, [preferences, isLoaded]);

    const updateSavouringTimer = (duration: number) => {
        setPreferences(prev => ({ ...prev, savouringTimer: duration }));
    };

    const updateJarSkin = (skinId: string) => {
        setPreferences(prev => ({ ...prev, jarSkin: skinId }));
    };

    return (
        <PreferencesContext.Provider value={{ preferences, updateSavouringTimer, updateJarSkin }}>
            {children}
        </PreferencesContext.Provider>
    );
}

export function usePreferences() {
    const context = useContext(PreferencesContext);
    if (context === undefined) {
        throw new Error('usePreferences must be used within a PreferencesProvider');
    }
    return context;
}
