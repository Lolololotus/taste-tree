import { useState, useEffect, useRef } from 'react';
import { soundManager } from '@/lib/sound';

interface UseTypewriterProps {
    text: string;
    speed?: number;
    onComplete?: () => void;
}

export function useTypewriter({ text, speed = 50, onComplete }: UseTypewriterProps) {
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [shake, setShake] = useState(false);
    const indexRef = useRef(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Reset when text changes
        setDisplayedText('');
        indexRef.current = 0;
        setIsTyping(true);

        const typeChar = () => {
            if (indexRef.current < text.length) {
                const char = text.charAt(indexRef.current);
                setDisplayedText((prev) => prev + char);
                indexRef.current++;

                // Sound & Shake
                if (char.trim() !== '') {
                    soundManager.playTypewriter();
                    setShake(true);
                    setTimeout(() => setShake(false), 50); // Short shake
                }

                timerRef.current = setTimeout(typeChar, speed);
            } else {
                setIsTyping(false);
                if (onComplete) onComplete();

                // End sound (optional based on spec "Clear sound at end")
                // soundManager.playGrowth(); // or specific end sound
            }
        };

        timerRef.current = setTimeout(typeChar, speed);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [text, speed, onComplete]);

    return { displayedText, isTyping, shake };
}
