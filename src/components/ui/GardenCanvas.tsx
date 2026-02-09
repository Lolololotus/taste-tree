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

    // Sentiment Palette Logic
    const getColors = (sentiment: string, time: string) => {
        let base = { leaf: "#81C784", trunk: "#795548", bloom: "#FFF176", bg: "#FFFDF0" };

        if (["Joy", "Excitement", "즐거움", "설렘", "신남"].some(s => sentiment.includes(s))) {
            base = { leaf: "#76FF03", trunk: "#8D6E63", bloom: "#F50057", bg: "#F1F8E9" };
        } else if (["Nostalgia", "Warmth", "그리움", "따뜻함", "위로"].some(s => sentiment.includes(s))) {
            base = { leaf: "#FFB74D", trunk: "#5D4037", bloom: "#FF6E40", bg: "#FFF3E0" };
        } else if (["Sorrow", "Calm", "고독", "아련함", "슬픔"].some(s => sentiment.includes(s))) {
            base = { leaf: "#4DD0E1", trunk: "#3E2723", bloom: "#AA00FF", bg: "#E0F7FA" };
        }

        if (time === "Night") {
            base.bg = "#1A237E";
            // Night adjustments
            base.leaf = "#2E7D32";
        } else if (time === "Sunset") {
            base.bg = "#FFCC80";
        }

        return base;
    };

    const colors = getColors(sentiment, time);

    useEffect(() => {
        const handleResize = () => {
            // Debounce or just set
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const pixelSize = 4;
        ctx.imageSmoothingEnabled = false;

        // 1. Background Fill
        ctx.fillStyle = colors.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 2. Dithered Pattern Overlay (Dot Pattern)
        const drawDither = () => {
            ctx.fillStyle = "rgba(121, 85, 72, 0.05)"; // Very subtle brown dot
            for (let x = 0; x < canvas.width; x += 8) {
                for (let y = 0; y < canvas.height; y += 8) {
                    if ((x + y) % 16 === 0) {
                        ctx.fillRect(x, y, 2, 2);
                    }
                }
            }
        };
        drawDither();

        // 3. Ground
        const groundY = canvas.height - 100;
        ctx.fillStyle = time === "Night" ? "#004D40" : "#E0F2F1";
        ctx.fillRect(0, groundY, canvas.width, 100);

        // Pixel Border for Ground
        ctx.fillStyle = time === "Night" ? "#00695C" : "#B2DFDB";
        ctx.fillRect(0, groundY, canvas.width, 4);

        // Helper: Draw Scaled Pixel
        const drawPx = (x: number, y: number, color: string) => {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, pixelSize, pixelSize);
        };

        const drawRectPx = (x: number, y: number, w: number, h: number, color: string) => {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, w * pixelSize, h * pixelSize);
        };

        // 4. Tree Growth Animation (Frame-by-Frame Logic)
        const centerX = Math.floor(canvas.width / 2);
        const { trunk, leaf, bloom } = colors;

        // Stage 0: Seed
        if (stage === 0) {
            drawRectPx(centerX, groundY - 4, 3, 3, "#5D4037"); // Seed in ground
        }

        // Stage 1: Sprout
        if (stage >= 1) {
            drawRectPx(centerX, groundY - 8, 2, 8, "#81C784"); // Stem
            drawRectPx(centerX - 3, groundY - 12, 3, 4, leaf); // Left Leaf
            drawRectPx(centerX + 2, groundY - 12, 3, 4, leaf); // Right Leaf
        }

        // Stage 2: Sapling
        if (stage >= 2) {
            drawRectPx(centerX, groundY - 20, 4, 20, trunk); // Taller Trunk
            drawRectPx(centerX - 8, groundY - 28, 8, 8, leaf); // Foliage
            drawRectPx(centerX + 4, groundY - 24, 8, 8, leaf);
            drawRectPx(centerX - 2, groundY - 35, 8, 8, leaf); // Top
        }

        // Stage 3: Small Tree
        if (stage >= 3) {
            drawRectPx(centerX, groundY - 40, 6, 40, trunk);
            // Branches
            drawRectPx(centerX - 10, groundY - 25, 10, 3, trunk);
            drawRectPx(centerX + 6, groundY - 30, 10, 3, trunk);

            // Foliage Clusters
            drawRectPx(centerX - 20, groundY - 45, 15, 15, leaf);
            drawRectPx(centerX + 5, groundY - 55, 15, 15, leaf);
            drawRectPx(centerX - 5, groundY - 70, 15, 15, leaf);
        }

        // Stage 4: Tree
        if (stage >= 4) {
            // Thicker Trunk
            drawRectPx(centerX - 2, groundY - 60, 10, 60, trunk);

            // Massive Foliage
            drawRectPx(centerX - 35, groundY - 50, 25, 20, leaf);
            drawRectPx(centerX + 15, groundY - 60, 25, 20, leaf);
            drawRectPx(centerX - 20, groundY - 90, 40, 40, leaf);
            drawRectPx(centerX - 40, groundY - 70, 20, 20, leaf);
            drawRectPx(centerX + 10, groundY - 80, 20, 20, leaf);
        }

        // Stage 5: Bloom (Add Flowers)
        if (stage >= 5) {
            // Random-ish looking positions relative to center
            const bloomPos = [
                [-10, -85], [10, -75], [-25, -55], [25, -55],
                [0, -95], [-35, -45], [30, -65]
            ];
            bloomPos.forEach(([bx, by]) => {
                drawRectPx(centerX + bx, groundY + by, 3, 3, bloom);
                drawRectPx(centerX + bx + 1, groundY + by + 1, 1, 1, "#FFF"); // Shine
            });
        }

        // 5. Weather Effects
        if (weather === "Rainy") {
            ctx.fillStyle = "rgba(100, 181, 246, 0.5)";
            for (let i = 0; i < 60; i++) {
                const rx = Math.random() * canvas.width;
                const ry = Math.random() * canvas.height;
                ctx.fillRect(rx, ry, 2, 15);
            }
        }

    }, [stage, colors, dimensions, weather, time]);

    return (
        <canvas
            ref={canvasRef}
            width={dimensions.width}
            height={dimensions.height}
            className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000"
        />
    );
}
