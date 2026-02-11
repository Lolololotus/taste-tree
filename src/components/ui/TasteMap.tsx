'use client';

import React, { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

// Standard World Map TopoJSON
const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface Pin {
    id: string;
    location: { lat: number, lng: number };
    sentiment: string;
    keywords: string[];
    content: string;
}

const sentimentColors: any = {
    "Joy": "#FFB74D",      // Orange
    "Nostalgia": "#F06292", // Pink
    "Calm": "#4DB6AC",     // Teal
    "Excitement": "#FFF176", // Yellow
    "Sorrow": "#90CAF9",   // Blue
    "Unknown": "#BDBDBD"   // Grey
};

export function TasteMap() {
    const [pins, setPins] = useState<Pin[]>([]);
    const [hoveredPin, setHoveredPin] = useState<Pin | null>(null);

    useEffect(() => {
        // Real-time listener for latest 50 memories
        const q = query(collection(db, "answer_assets"), orderBy("createdAt", "desc"), limit(50));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newPins = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Pin[];
            setPins(newPins);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="w-full h-full relative bg-[#E0F7FA] overflow-hidden border-4 border-[#795548] rounded-[2rem] shadow-xl">
            {/* Title Overlay */}
            <div className="absolute top-4 left-6 z-10">
                <h2 className="text-xl md:text-2xl font-bold text-[#5D4037] drop-shadow-sm font-pixel">
                    🌍 Taste Map
                </h2>
                <p className="text-xs text-[#8D6E63]">global memory network</p>
            </div>

            <ComposableMap
                projection="geoMercator"
                projectionConfig={{ scale: 180 }}
                className="w-full h-full"
            >
                {/* Map Interface */}
                <Geographies geography={GEO_URL}>
                    {({ geometries }: any) =>
                        geometries && (geometries as any[]).map((geo: any) => (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill="#FFFDF0"   // Cream Land
                                stroke="#D7CCC8" // Light Brown Border
                                strokeWidth={0.5}
                                style={{
                                    default: { outline: "none" },
                                    hover: { fill: "#F5F5F5", outline: "none" },
                                    pressed: { outline: "none" },
                                }}
                            />
                        ))
                    }
                </Geographies>

                {/* Pins */}
                {pins.map((pin) => (
                    <Marker
                        key={pin.id}
                        coordinates={[pin.location.lng, pin.location.lat]}
                        onMouseEnter={() => setHoveredPin(pin)}
                        onMouseLeave={() => setHoveredPin(null)}
                    >
                        <motion.circle
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 0.8 }}
                            r={4}
                            fill={sentimentColors[pin.sentiment] || sentimentColors.Unknown}
                            stroke="#FFFFFF"
                            strokeWidth={1.5}
                            className="cursor-pointer"
                        />
                        {/* Pulse Effect */}
                        <motion.circle
                            initial={{ scale: 1, opacity: 0.5 }}
                            animate={{ scale: 2, opacity: 0 }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            r={4}
                            fill={sentimentColors[pin.sentiment] || sentimentColors.Unknown}
                        />
                    </Marker>
                ))}
            </ComposableMap>

            {/* Hover Tooltip (Pixel Art Style) */}
            <AnimatePresence>
                {hoveredPin && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-4 py-3 rounded-xl border-2 border-[#795548] shadow-lg max-w-xs z-20"
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: sentimentColors[hoveredPin.sentiment] }}
                            />
                            <span className="text-xs font-bold text-[#5D4037] uppercase">{hoveredPin.sentiment}</span>
                        </div>
                        <p className="text-sm text-[#5D4037] line-clamp-2">
                            "{hoveredPin.content}"
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1">
                            {hoveredPin.keywords?.slice(0, 3).map((tag, i) => (
                                <span key={i} className="text-[10px] bg-[#F5F5F5] text-[#8D6E63] px-1.5 py-0.5 rounded">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
