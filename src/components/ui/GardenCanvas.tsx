'use client';

import React, { useRef, useEffect, useState } from 'react';

interface GardenCanvasProps {
    stage: number; // 0 to 5
    sentiment: string;
    environment?: {
        weather: "Sunny" | "Rainy" | "Cloudy" | "Foggy";
        time: "Day" | "Night" | "Sunset";
    };
}

export function GardenCanvas({ stage, sentiment, environment }: GardenCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // Time & Weather Defaults
    const time = environment?.time || "Day";
    const weather = environment?.weather || "Sunny";

    // Sentiment Colors
    const getColors = (sentiment: string, time: string) => {
        let base = { leaf: "#66BB6A", trunk: "#795548", bloom: "#FFEB3B", bg: "#F0F8FF" };

        if (["Joy", "Excitement", "즐거움", "설렘", "신남", "순수"].some(s => sentiment.includes(s))) {
            base = { leaf: "#76FF03", trunk: "#8D6E63", bloom: "#FF4081", bg: "#F1F8E9" };
        } else if (["Nostalgia", "Warmth", "그리움", "따뜻함", "위로"].some(s => sentiment.includes(s))) {
            base = { leaf: "#FFB74D", trunk: "#5D4037", bloom: "#FF6E40", bg: "#FFF3E0" };
        } else if (["Sorrow", "Calm", "고독", "아련함", "슬픔"].some(s => sentiment.includes(s))) {
            base = { leaf: "#4DD0E1", trunk: "#3E2723", bloom: "#E040FB", bg: "#E0F7FA" };
        }

        // Apply Time adjustments
        if (time === "Night") {
            base.bg = "#1A237E"; // Deep Blue
            base.leaf = "#2E7D32";
            base.trunk = "#3E2723";
        } else if (time === "Sunset") {
            base.bg = "#FFCC80"; // Orange
        }

        return base;
    };

    const colors = getColors(sentiment, time);

    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                setDimensions({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize(); // Initial
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Configuration
        const pixelSize = 4; // Size of "pixel"
        ctx.imageSmoothingEnabled = false;

        // Clear
        ctx.fillStyle = colors.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Weather Overlays (Background)
        if (weather === "Rainy") {
            ctx.fillStyle = "rgba(0,0,0,0.1)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Ground
        const groundY = canvas.height - 100;
        ctx.fillStyle = time === "Night" ? "#004D40" : "#E0F2F1";
        ctx.fillRect(0, groundY, canvas.width, 100);
        ctx.fillStyle = time === "Night" ? "#00695C" : "#B2DFDB";
        ctx.fillRect(0, groundY, canvas.width, 4); // Border

        // Helper to draw pixel rect
        const drawPixel = (x: number, y: number, color: string) => {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, pixelSize, pixelSize);
        };

        const drawRect = (x: number, y: number, w: number, h: number, color: string) => {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, w * pixelSize, h * pixelSize);
        };

        // If stage 0 but rainy, we still show rain, but no tree.
        if (stage === 0) {
            // Just pass
        } else {
            const centerX = Math.floor(canvas.width / 2);
            const trunkColor = colors.trunk;
            const leafColor = colors.leaf;
            const bloomColor = colors.bloom;

            // Re-implement tree drawing with updated colors
            if (stage >= 1) {
                drawRect(centerX, groundY - 5, 2, 5, "#81C784"); // Sprout stem
                drawRect(centerX - 2, groundY - 8, 2, 3, leafColor);
                drawRect(centerX + 2, groundY - 8, 2, 3, leafColor);
            }

            if (stage >= 2) {
                drawRect(centerX, groundY - 15, 4, 15, trunkColor); // Trunk
                drawRect(centerX - 6, groundY - 20, 12, 8, leafColor); // Foliage
            }

            if (stage >= 3) {
                drawRect(centerX, groundY - 30, 6, 30, trunkColor);
                // Branches
                drawRect(centerX - 8, groundY - 20, 8, 4, trunkColor);
                drawRect(centerX + 6, groundY - 25, 8, 4, trunkColor);
                // Foliage clusters
                drawRect(centerX - 15, groundY - 35, 14, 12, leafColor);
                drawRect(centerX + 5, groundY - 40, 14, 12, leafColor);
                drawRect(centerX - 5, groundY - 50, 10, 10, leafColor);
            }

            if (stage >= 4) {
                drawRect(centerX, groundY - 50, 8, 50, trunkColor);
                drawRect(centerX - 25, groundY - 60, 20, 20, leafColor);
                drawRect(centerX + 5, groundY - 65, 20, 20, leafColor);
                drawRect(centerX - 10, groundY - 80, 20, 20, leafColor);
                drawRect(centerX - 30, groundY - 40, 60, 10, leafColor);

                if (stage === 5) {
                    // Blooms
                    drawRect(centerX - 20, groundY - 55, 3, 3, bloomColor);
                    drawRect(centerX + 15, groundY - 60, 3, 3, bloomColor);
                    drawRect(centerX, groundY - 75, 3, 3, bloomColor);
                    drawRect(centerX - 10, groundY - 35, 3, 3, bloomColor);
                    drawRect(centerX + 20, groundY - 45, 3, 3, bloomColor);
                }
            }
        }

        // Weather Overlays (Foreground)
        if (weather === "Rainy") {
            ctx.fillStyle = "rgba(100, 181, 246, 0.4)";
            for (let i = 0; i < 100; i++) {
                const rainX = Math.random() * canvas.width;
                const rainY = Math.random() * canvas.height;
                ctx.fillRect(rainX, rainY, 1, 10);
            }
        }

    }, [stage, colors, dimensions, weather, time]);

    return (
        <canvas
            ref={canvasRef}
            width={dimensions.width}
            height={dimensions.height}
            className="absolute inset-0 z-0 pointer-events-none transition-colors duration-1000"
        />
    );
}
