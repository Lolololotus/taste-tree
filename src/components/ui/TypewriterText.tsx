'use client';

import React from 'react';
import { useTypewriter } from '@/hooks/useTypewriter';

interface TypewriterTextProps {
    text: string;
    speed?: number;
    className?: string;
    onComplete?: () => void;
}

export function TypewriterText({ text, speed = 50, className = '', onComplete }: TypewriterTextProps) {
    const { displayedText, shake } = useTypewriter({ text, speed, onComplete });

    return (
        <div className={`relative ${className} ${shake ? 'animate-shake' : ''}`}>
            {displayedText}
            <span className="animate-pulse inline-block ml-1 w-2 h-5 bg-[#795548] align-middle opacity-70" />
        </div>
    );
}
