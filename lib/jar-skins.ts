// Jar skin color configurations
export const JAR_SKINS = {
    default: { name: 'Purple Dream', colors: { start: '#c084fc', middle: '#e879f9', end: '#f472b6' } },
    ocean: { name: 'Ocean Breeze', colors: { start: '#06b6d4', middle: '#3b82f6', end: '#8b5cf6' } },
    sunset: { name: 'Sunset Glow', colors: { start: '#f59e0b', middle: '#f97316', end: '#ec4899' } },
    forest: { name: 'Forest Mist', colors: { start: '#10b981', middle: '#14b8a6', end: '#06b6d4' } },
    rose: { name: 'Rose Garden', colors: { start: '#ec4899', middle: '#f43f5e', end: '#fb7185' } },
    lavender: { name: 'Lavender Fields', colors: { start: '#a78bfa', middle: '#c084fc', end: '#d8b4fe' } },
    mint: { name: 'Mint Fresh', colors: { start: '#34d399', middle: '#6ee7b7', end: '#a7f3d0' } },
    peach: { name: 'Peach Sorbet', colors: { start: '#fdba74', middle: '#fb923c', end: '#f472b6' } },
    midnight: { name: 'Midnight Sky', colors: { start: '#6366f1', middle: '#8b5cf6', end: '#a855f7' } },
} as const;

export type JarSkinId = keyof typeof JAR_SKINS;
