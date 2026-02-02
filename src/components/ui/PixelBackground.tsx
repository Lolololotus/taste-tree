'use client';

import React, { useEffect, useState } from 'react';

export function PixelBackground() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-[#e0f2fe] to-[#f0f9ff] dark:from-[#1e293b] dark:to-[#0f172a]" />

            {/* Animated Pixel Clouds/Leaves */}
            {[...Array(6)].map((_, i) => (
                <div
                    key={i}
                    className="absolute opacity-40 animate-float"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        width: `${Math.random() * 40 + 20}px`,
                        height: `${Math.random() * 40 + 20}px`,
                        backgroundColor: i % 2 === 0 ? '#86efac' : '#4ade80', // Greenish pixel leaves
                        animationDuration: `${Math.random() * 10 + 10}s`,
                        animationDelay: `-${Math.random() * 10}s`,
                        boxShadow: '4px 4px 0 rgba(0,0,0,0.1)'
                    }}
                />
            ))}

            <style jsx>{`
            @keyframes float {
                0% { transform: translateY(0) translateX(0) rotate(0deg); }
                33% { transform: translateY(-20px) translateX(10px) rotate(5deg); }
                66% { transform: translateY(10px) translateX(-5px) rotate(-5deg); }
                100% { transform: translateY(0) translateX(0) rotate(0deg); }
            }
            .animate-float {
                animation: float infinite ease-in-out;
            }
        `}</style>
        </div>
    );
}
