import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'JoyPop - Bite-sized Happiness',
        short_name: 'JoyPop',
        description: 'A simple wellbeing app to track your joy, gratitude, and kindness.',
        start_url: '/',
        display: 'standalone',
        background_color: '#0a0a0a',
        theme_color: '#1a1a1a',
        icons: [
            {
                src: '/assets/app-logo-squircle.png',
                sizes: 'any',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/assets/app-logo-squircle.png',
                sizes: 'any',
                type: 'image/png',
                purpose: 'any',
            },
        ],
    }
}
