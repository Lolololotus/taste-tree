import React from 'react';

interface PixelSeedProps {
    sentiment: string;
    size?: number; // pixel scale
    className?: string;
}

export function PixelSeed({ sentiment, size = 4, className = '' }: PixelSeedProps) {
    // Map sentiment to core colors
    const getColor = (s: string) => {
        if (["Joy", "Excitement", "즐거움", "설렘", "신남"].some(x => s.includes(x))) return "#F50057"; // Pink/Red
        if (["Nostalgia", "Warmth", "그리움", "따뜻함", "위로"].some(x => s.includes(x))) return "#FF6E40"; // Orange
        if (["Sorrow", "Calm", "고독", "아련함", "슬픔"].some(x => s.includes(x))) return "#2979FF"; // Blue
        return "#795548"; // Default Brown
    };

    const mainColor = getColor(sentiment);
    const highlight = "#FFFFFF";
    const border = "#3E2723";

    // 8x8 Seed Grid (1 = border, 2 = main, 3 = highlight, 0 = transparent)
    // Simple rounded seed shape
    const seedMap = [
        [0, 0, 0, 1, 1, 0, 0, 0],
        [0, 0, 1, 2, 2, 1, 0, 0],
        [0, 1, 2, 3, 2, 2, 1, 0],
        [1, 2, 2, 2, 2, 2, 2, 1],
        [1, 2, 2, 2, 2, 2, 2, 1],
        [1, 2, 2, 2, 2, 2, 2, 1],
        [0, 1, 2, 2, 2, 2, 1, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
    ];

    return (
        <div
            className={`inline-block ${className}`}
            style={{
                width: size * 8,
                height: size * 8,
                position: 'relative'
            }}
        >
            {seedMap.map((row, y) =>
                row.map((cell, x) => {
                    if (cell === 0) return null;
                    let bg = 'transparent';
                    if (cell === 1) bg = border;
                    if (cell === 2) bg = mainColor;
                    if (cell === 3) bg = highlight;

                    return (
                        <div
                            key={`${x}-${y}`}
                            style={{
                                position: 'absolute',
                                left: x * size,
                                top: y * size,
                                width: size,
                                height: size,
                                backgroundColor: bg,
                            }}
                        />
                    );
                })
            )}
        </div>
    );
}
