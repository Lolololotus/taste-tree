'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface GardenCanvasProps {
    stage: number; // 0 to 5
    sentiment: string; // Used to determine leaf colors
}

export function GardenCanvas({ stage, sentiment }: GardenCanvasProps) {

    // Map sentiment keywords to color palettes
    const colorPalette = useMemo(() => {
        if (["Joy", "Excitement", "즐거움", "설렘", "신남", "순수"].some(s => sentiment.includes(s))) {
            return { leaf: "#76FF03", bloom: "#CCFF90", trunk: "#8D6E63", bg: "#F1F8E9" }; // Bright Green (Joy)
        } else if (["Nostalgia", "Warmth", "그리움", "따뜻함", "위로"].some(s => sentiment.includes(s))) {
            return { leaf: "#FFB74D", bloom: "#FFE0B2", trunk: "#5D4037", bg: "#FFF3E0" }; // Warm Orange (Nostalgia)
        } else if (["Sorrow", "Calm", "고독", "아련함", "슬픔"].some(s => sentiment.includes(s))) {
            return { leaf: "#4DD0E1", bloom: "#B2EBF2", trunk: "#3E2723", bg: "#E0F7FA" }; // Cool Blue (Calm/Sad)
        }
        return { leaf: "#66BB6A", bloom: "#C8E6C9", trunk: "#795548", bg: "#F0F8FF" }; // Default Green
    }, [sentiment]);

    return (
        <div
            className="absolute inset-0 w-full h-full overflow-hidden -z-10 flex items-end justify-center pointer-events-none transition-colors duration-1000"
            style={{ backgroundColor: colorPalette.bg }}
        >
            {/* Ground */}
            <div className="absolute bottom-0 w-full h-1/4 bg-[#E0F2F1] border-t-4 border-[#B2DFDB]" />

            {/* Tree Container */}
            <div className="relative bottom-16 sm:bottom-24 w-80 h-80 flex flex-col items-center justify-end">

                {/* Stage 1: Seed (Hidden or tiny) */}
                {/* Stage 2: Sprout */}
                {stage >= 1 && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1, type: "spring" }}
                        className="absolute bottom-0"
                    >
                        <div className="w-2 h-6" style={{ backgroundColor: colorPalette.leaf }} />
                        <div className="w-4 h-2 -mt-4 ml-2" style={{ backgroundColor: colorPalette.leaf }} />
                    </motion.div>
                )}

                {/* Stage 3: Sapling (Small Tree) */}
                {stage >= 2 && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.5 }}
                        className="absolute bottom-0"
                    >
                        <div className="w-4 h-20" style={{ backgroundColor: colorPalette.trunk }} />
                        {/* Branches */}
                        <div className="absolute bottom-12 left-0 w-8 h-2 rotate-[-25deg]" style={{ backgroundColor: colorPalette.trunk }} />
                        <div className="absolute bottom-16 right-0 w-6 h-2 rotate-[25deg]" style={{ backgroundColor: colorPalette.trunk }} />
                        {/* Leaves */}
                        <div className="absolute bottom-20 -left-6 w-12 h-12 rounded-full opacity-80" style={{ backgroundColor: colorPalette.leaf }} />
                        <div className="absolute bottom-24 left-4 w-10 h-10 rounded-full opacity-80" style={{ backgroundColor: colorPalette.leaf }} />
                    </motion.div>
                )}

                {/* Stage 4: Growing Tree (Bigger) */}
                {stage >= 3 && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1.2, opacity: 1 }}
                        transition={{ duration: 2 }}
                        className="absolute bottom-0 mb-2"
                    >
                        <div className="w-8 h-40 mx-auto" style={{ backgroundColor: colorPalette.trunk }} />
                        <div className="absolute bottom-32 -left-12 w-16 h-4 rotate-[-15deg]" style={{ backgroundColor: colorPalette.trunk }} />
                        <div className="absolute bottom-36 right-0 w-16 h-4 rotate-[15deg]" style={{ backgroundColor: colorPalette.trunk }} />

                        {/* Lush Foliage */}
                        <div className="absolute bottom-40 -left-20 w-48 h-32 flex flex-wrap justify-center gap-2">
                            {[...Array(8)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="w-12 h-12 rounded-full"
                                    style={{ backgroundColor: colorPalette.leaf, opacity: 0.9 }}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Stage 5: Full Bloom (Flowers/Fruits) */}
                {stage >= 4 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2, delay: 1 }}
                        className="absolute bottom-0 mb-4 z-10"
                    >
                        {/* Blooms */}
                        <div className="absolute bottom-56 -left-24 w-64 h-48 pointer-events-none">
                            {[...Array(12)].map((_, i) => (
                                <motion.div
                                    key={`bloom-${i}`}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: [0, 1.2, 1] }}
                                    transition={{ delay: 2 + (i * 0.1), type: "spring" }}
                                    className="absolute w-6 h-6 rounded-full shadow-sm"
                                    style={{
                                        backgroundColor: colorPalette.bloom,
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`
                                    }}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Ambient Particles */}
            {stage >= 2 && (
                <motion.div
                    animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="absolute w-full h-full pointer-events-none"
                >
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full"
                            style={{
                                left: `${10 + i * 12}%`,
                                bottom: `${20 + i * 15}%`,
                                opacity: 0.5
                            }}
                        />
                    ))}
                </motion.div>
            )}
        </div>
    );
}
