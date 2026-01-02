// Character limit for star entries
export const MAX_ENTRY_LENGTH = 80;

// Star type configurations
export const STAR_CONFIG = {
    savouring: {
        color: 'pink',
        icon: '🌸',
        label: 'Savouring',
        image: '/assets/savor-star.png',
    },
    kindness: {
        color: 'purple',
        icon: '❤️',
        label: 'Kindness',
        image: '/assets/kindness-star.png',
    },
    gratitude: {
        color: 'yellow',
        icon: '🙏',
        label: 'Gratitude',
        image: '/assets/gratitude-star.png',
    },
} as const;

// Joy Jar configuration
export const JAR_CAPACITY = {
    width: 6,
    height: 10,
    total: 60,
} as const;

// Savouring timer duration (in seconds)
export const SAVOURING_TIMER_DURATION = 30;
