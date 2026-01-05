interface MiniJarProps {
    svgPath: string;
    name: string;
    isSelected?: boolean;
    onClick?: () => void;
}

export function MiniJar({ svgPath, name, isSelected, onClick }: MiniJarProps) {
    return (
        <button
            onClick={onClick}
            className={`relative w-full aspect-square rounded-2xl transition-all ${isSelected
                    ? 'bg-white/20 border-2 border-white/60 shadow-lg'
                    : 'bg-white/5 border-2 border-white/10 hover:border-white/30'
                }`}
            aria-label={`Select ${name} jar skin`}
        >
            <img
                src={svgPath}
                alt={`${name} jar`}
                className="w-full h-full p-4 object-contain"
            />
        </button>
    );
}
