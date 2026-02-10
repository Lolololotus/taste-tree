'use client';

import React, { useRef, useEffect, useState } from 'react';

interface GardenCanvasProps {
    stage: number; // 0 to 6
    sentiment: string;
    environment?: {
        weather: "Sunny" | "Rainy" | "Cloudy" | "Foggy";
        time: "Day" | "Night" | "Sunset";
    };
    complexity?: number; // 0.0 to 1.0 (Based on Trust Score)
}

export function GardenCanvas({ stage, sentiment, environment, complexity = 0.5 }: GardenCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // 🎨 Sentiment Palette System
    const getPalette = (sentiment: string, time: string) => {
        const s = sentiment.toLowerCase();

        // Base Palettes
        const palettes: any = {
            warm: { // Joy, Excitement
                bg: "#FFF9C4", // Light Yellow
                sky: "#FFF176",
                trunk: "#795548",
                leaf: ["#76FF03", "#64DD17", "#C6FF00"], // Vibrant Greens
                flower: "#F50057" // Pink
            },
            cool: { // Calm, Peace
                bg: "#E0F7FA", // Light Cyan
                sky: "#B2EBF2",
                trunk: "#5D4037",
                leaf: ["#26C6DA", "#00BCD4", "#80DEEA"], // Teal/Blue Greens
                flower: "#651FFF" // Violet
            },
            nostalgia: { // Nostalgia, Sorrow
                bg: "#FFF3E0", // Light Orange
                sky: "#FFCC80",
                trunk: "#4E342E",
                leaf: ["#FFAB91", "#FF8A65", "#FF7043"], // Autumn tones
                flower: "#D50000" // Red
            },
            night: {
                bg: "#1A237E", // Deep Blue
                sky: "#303F9F",
                trunk: "#3E2723",
                leaf: ["#1B5E20", "#2E7D32", "#388E3C"], // Dark Greens
                flower: "#E040FB" // Neon Purple
            }
        };

        if (time === "Night") return palettes.night;

        if (["joy", "excitement", "즐거움", "설렘"].some(k => s.includes(k))) return palettes.warm;
        if (["nostalgia", "sorrow", "그리움", "슬픔"].some(k => s.includes(k))) return palettes.nostalgia;
        return palettes.cool; // Default
    };

    const palette = getPalette(sentiment, environment?.time || "Day");

    useEffect(() => {
        const handleResize = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
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

        // Reset
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const pixelSize = 4;

        // 1. Background (Gradient-ish)
        const drawBackground = () => {
            const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
            grad.addColorStop(0, palette.bg);
            grad.addColorStop(1, palette.sky);
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Dither
            ctx.fillStyle = "rgba(0,0,0,0.03)";
            for (let x = 0; x < canvas.width; x += 4) {
                for (let y = 0; y < canvas.height; y += 4) {
                    if ((x + y) % 8 === 0) ctx.fillRect(x, y, 2, 2);
                }
            }
        };
        drawBackground();

        // 2. Ground
        const groundY = canvas.height - 100;
        ctx.fillStyle = environment?.time === "Night" ? "#004D40" : "#E0F2F1";
        ctx.fillRect(0, groundY, canvas.width, 100);

        // Helper: Draw Pixel Line
        const drawPx = (x: number, y: number, color: string, size: number) => {
            ctx.fillStyle = color;
            ctx.fillRect(Math.floor(x / pixelSize) * pixelSize, Math.floor(y / pixelSize) * pixelSize, size, size);
        };

        // 3. Recursive Fractal Tree
        const drawBranch = (x: number, y: number, len: number, angle: number, width: number) => {

            // Draw current branch segment
            ctx.beginPath();
            ctx.save();
            ctx.strokeStyle = palette.trunk;
            ctx.lineWidth = width;
            ctx.lineCap = "square";
            ctx.translate(x, y);
            ctx.rotate(angle * Math.PI / 180);
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -len);
            ctx.stroke();

            // Calculate end point of this branch
            // (Standard trig to find new x,y)
            // But since we translated, new origin is 0,0. 
            // We need absolute coordinates for next recursion if we didn't use restore(), 
            // but restore() makes it easier. 
            // Actually, to keep pixel snap, let's use absolute math:
            // This is a simple vector approach

            ctx.restore();

            if (len < 10) {
                // LEAVES (Terminal)
                if (stage >= 2) {
                    const leafColor = palette.leaf[Math.floor(Math.random() * palette.leaf.length)];
                    // Draw a cluster of pixels
                    drawPx(x + Math.sin(angle) * len, y - Math.cos(angle) * len, leafColor, pixelSize * 2);
                }
                // FLOWERS (Bloom Stage)
                if (stage >= 5 && Math.random() > 0.7) {
                    drawPx(x + Math.sin(angle) * len, y - Math.cos(angle) * len, palette.flower, pixelSize * 1.5);
                }
                return;
            }

            // Calculate end points for recursion
            const endX = x + len * Math.sin(angle * Math.PI / 180);
            const endY = y - len * Math.cos(angle * Math.PI / 180);

            // Recursion rules based on Complexity & Stage
            const subLen = len * 0.75; // Shrink factor
            const subWidth = Math.max(1, width * 0.7);

            // Bias angle slightly for wind/organic feel
            const wind = (Math.random() - 0.5) * 10;

            // Left Branch
            if (stage > 0) {
                drawBranch(endX, endY, subLen, angle - 25 + wind, subWidth);
            }
            // Right Branch
            if (stage > 1) {
                drawBranch(endX, endY, subLen, angle + 25 + wind, subWidth);
            }
            // Center Branch (High Complexity only)
            if (stage > 3 && complexity > 0.7) {
                drawBranch(endX, endY, subLen, angle + wind, subWidth);
            }
        };

        // Render Tree Root
        const startX = canvas.width / 2;
        const startY = groundY;

        // Initial Trunk Size based on Stage
        const baseLen = stage === 0 ? 0 : 40 + (stage * 15);
        const baseWidth = stage === 0 ? 0 : 4 + (stage * 2);

        if (stage === 0) {
            // Seed
            drawPx(startX, startY + 10, palette.trunk, 8);
        } else {
            drawBranch(startX, startY, baseLen, 0, baseWidth);
        }

        // 4. Particles (Floating Memories)
        // Simple random particles
        ctx.fillStyle = palette.sky; // slightly darker than bg
        for (let i = 0; i < 10 + (stage * 5); i++) {
            const px = Math.random() * canvas.width;
            const py = Math.random() * groundY;
            ctx.fillRect(px, py, 2, 2);
        }

    }, [dimensions, stage, sentiment, environment, complexity]);

    return (
        <canvas
            ref={canvasRef}
            width={dimensions.width}
            height={dimensions.height}
            className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000"
        />
    );
}
