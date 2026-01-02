import { StarType } from '@/types/database';
import Image from 'next/image';
import { STAR_CONFIG } from '@/lib/constants';

interface StarProps {
    type: StarType;
    size?: number | 'responsive';
}

export function Star({ type, size = 40 }: StarProps) {
    const config = STAR_CONFIG[type];

    // Calculate responsive size
    const actualSize = size === 'responsive'
        ? 'w-full h-full max-w-[32px] max-h-[32px] sm:max-w-[40px] sm:max-h-[40px]'
        : undefined;

    const numericSize = typeof size === 'number' ? size : 40;

    return (
        <div className={actualSize || "relative"} style={actualSize ? undefined : { width: numericSize, height: numericSize }}>
            <Image
                src={config.image}
                alt={`${config.label} star`}
                width={numericSize}
                height={numericSize}
                className="drop-shadow-lg animate-pulse-subtle w-full h-full object-contain"
            />
        </div>
    );
}
