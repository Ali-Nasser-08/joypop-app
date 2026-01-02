'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface SavouringContextType {
    isTimerActive: boolean;
    setIsTimerActive: (active: boolean) => void;
    isCaptureActive: boolean;
    setIsCaptureActive: (active: boolean) => void;
}

const SavouringContext = createContext<SavouringContextType | undefined>(undefined);

export function SavouringProvider({ children }: { children: ReactNode }) {
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [isCaptureActive, setIsCaptureActive] = useState(false);

    return (
        <SavouringContext.Provider value={{ isTimerActive, setIsTimerActive, isCaptureActive, setIsCaptureActive }}>
            {children}
        </SavouringContext.Provider>
    );
}

export function useSavouring() {
    const context = useContext(SavouringContext);
    if (context === undefined) {
        throw new Error('useSavouring must be used within a SavouringProvider');
    }
    return context;
}
