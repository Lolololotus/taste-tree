'use client';

import React, { useRef, useEffect, useState } from 'react';

interface GardenCanvasProps {
    stage: number; // 0 to 5
    sentiment: string;
}

export function GardenCanvas({ stage, sentiment }: GardenCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // Sentiment Colors
    const getColors = (sentiment: string) => {
        if (["Joy", "Excitement", "즐거움", "설렘", "신남", "순수"].some(s => sentiment.includes(s))) {
            return { leaf: "#76FF03", trunk: "#8D6E63", bloom: "#FF4081", bg: "#F1F8E9" };
        } else if (["Nostalgia", "Warmth", "그리움", "따뜻함", "위로"].some(s => sentiment.includes(s))) {
            return { leaf: "#FFB74D", trunk: "#5D4037", bloom: "#FF6E40", bg: "#FFF3E0" };
        } else if (["Sorrow", "Calm", "고독", "아련함", "슬픔"].some(s => sentiment.includes(s))) {
            return { leaf: "#4DD0E1", trunk: "#3E2723", bloom: "#E040FB", bg: "#E0F7FA" };
        }
        return { leaf: "#66BB6A", trunk: "#795548", bloom: "#FFEB3B", bg: "#F0F8FF" };
    };

    const colors = getColors(sentiment);

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

        // Ground
        ctx.fillStyle = "#E0F2F1";
        ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
        ctx.fillStyle = "#B2DFDB";
        ctx.fillRect(0, canvas.height - 100, canvas.width, 4); // Border

        if (stage === 0) return;

        const centerX = Math.floor(canvas.width / 2);
        const groundY = canvas.height - 100;

        // Helper to draw pixel rect
        const drawPixel = (x: number, y: number, color: string) => {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, pixelSize, pixelSize);
        };

        const drawRect = (x: number, y: number, w: number, h: number, color: string) => {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, w * pixelSize, h * pixelSize);
        };

        // Procedural Tree Drawing based on Stage
        // We will build the tree up layer by layer

        // Stage 1: Sprout
        if (stage >= 1) {
            drawRect(centerX - 1, groundY - 4, 2, 4, colors.leaf); // Stem
            drawRect(centerX - 3, groundY - 6, 2, 2, colors.leaf); // Left leaf
            drawRect(centerX + 1, groundY - 6, 2, 2, colors.leaf); // Right leaf
        }

        // Stage 2: Sapling
        if (stage >= 2) {
            // Overwrite/Extend
            // Clear area to redraw larger
            // Ideally we just draw the larger version on top or instead
            // Let's just draw the specific stage version
        }

        // Revised Logic: Draw specific tree for the current stage to avoid overlap mess
        // But we want "growth". For now, let's just clear and draw the target stage frame.
        // To animate, we would need an interpolation state, but for MVP step changes are fine.

        ctx.fillStyle = colors.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Redraw Ground
        ctx.fillStyle = "#E0F2F1";
        ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
        ctx.fillStyle = "#B2DFDB";
        ctx.fillRect(0, canvas.height - 100, canvas.width, 4);

        const trunkColor = colors.trunk;
        const leafColor = colors.leaf;
        const bloomColor = colors.bloom;

        if (stage === 1) {
            drawRect(centerX, groundY - 5, 2, 5, "#81C784"); // Sprout stem
            drawRect(centerX - 2, groundY - 8, 2, 3, leafColor);
            drawRect(centerX + 2, groundY - 8, 2, 3, leafColor);
        }
        else if (stage === 2) {
            drawRect(centerX, groundY - 15, 4, 15, trunkColor); // Trunk
            drawRect(centerX - 6, groundY - 20, 12, 8, leafColor); // Foliage
        }
        else if (stage === 3) {
            drawRect(centerX, groundY - 30, 6, 30, trunkColor);
            // Branches
            drawRect(centerX - 8, groundY - 20, 8, 4, trunkColor);
            drawRect(centerX + 6, groundY - 25, 8, 4, trunkColor);
            // Foliage clusters
            drawRect(centerX - 15, groundY - 35, 14, 12, leafColor);
            drawRect(centerX + 5, groundY - 40, 14, 12, leafColor);
            drawRect(centerX - 5, groundY - 50, 10, 10, leafColor);
        }
        else if (stage >= 4) {
            // Big Tree
            drawRect(centerX, groundY - 50, 8, 50, trunkColor);
            // Big Foliage
            drawRect(centerX - 25, groundY - 60, 20, 20, leafColor);
            drawRect(centerX + 5, groundY - 65, 20, 20, leafColor);
            drawRect(centerX - 10, groundY - 80, 20, 20, leafColor);
            drawRect(centerX - 30, groundY - 40, 60, 10, leafColor); // Bottom layer

            if (stage === 5) {
                // Blooms
                drawRect(centerX - 20, groundY - 55, 3, 3, bloomColor);
                drawRect(centerX + 15, groundY - 60, 3, 3, bloomColor);
                drawRect(centerX, groundY - 75, 3, 3, bloomColor);
                drawRect(centerX - 10, groundY - 35, 3, 3, bloomColor);
                drawRect(centerX + 20, groundY - 45, 3, 3, bloomColor);
            }
        }

    }, [stage, colors, dimensions]);

    return (
        <canvas
            ref={canvasRef}
            width={dimensions.width}
            height={dimensions.height}
            className="absolute inset-0 z-0 pointer-events-none"
        />
    );
}

