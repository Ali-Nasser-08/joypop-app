// Jar skin SVG asset configurations
export const JAR_SKINS = {
    white: { name: 'Classic White', svgPath: '/assets/white-jar.svg' },
    violet: { name: 'Violet Dream', svgPath: '/assets/violet-jar.svg' },
    yellow: { name: 'Sunny Yellow', svgPath: '/assets/yellow-jar.svg' },
    blue: { name: 'Ocean Blue', svgPath: '/assets/blue-jar.svg' },
    cyan: { name: 'Cyan Breeze', svgPath: '/assets/cyan-jar.svg' },
    green: { name: 'Forest Green', svgPath: '/assets/green-jar.svg' },
    peach: { name: 'Peach Sorbet', svgPath: '/assets/peach-jar.svg' },
    pink: { name: 'Pink Bliss', svgPath: '/assets/pink jar.svg' },
    purple: { name: 'Purple Haze', svgPath: '/assets/purple-jar.svg' },
} as const;

export type JarSkinId = keyof typeof JAR_SKINS;
