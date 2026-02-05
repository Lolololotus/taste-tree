'use client';

import React, { useEffect, useState } from 'react';

export function PixelBackground() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[var(--bg-cream)]">
            <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF5] via-[#E8F8F5] to-[#D4EFDF] opacity-60" />

            {/* Soft, Cozy Particles (Sakura/Leaves) */}
            {[...Array(12)].map((_, i) => (
                <div
                    key={i}
                    className="absolute opacity-80 animate-float-soft"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        width: `${Math.random() * 20 + 10}px`,
                        height: `${Math.random() * 20 + 10}px`,
                        borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%', // Organic round shapes
                        backgroundColor: i % 3 === 0 ? '#FFD3B6' : (i % 3 === 1 ? '#A8E6CF' : '#DCEDC1'),
                        animationDuration: `${Math.random() * 20 + 10}s`,
                        animationDelay: `-${Math.random() * 10}s`,
                        filter: 'blur(1px)', // Soften edges
                        transform: `rotate(${Math.random() * 360}deg)`
                    }}
                />
            ))}

            <style jsx>{`
            @keyframes float-soft {
                0% { transform: translateY(0) translateX(0) rotate(0deg); }
                25% { transform: translateY(-15px) translateX(10px) rotate(5deg); }
                50% { transform: translateY(-5px) translateX(20px) rotate(10deg); }
                75% { transform: translateY(10px) translateX(5px) rotate(5deg); }
                100% { transform: translateY(0) translateX(0) rotate(0deg); }
            }
            .animate-float-soft {
                animation: float-soft infinite ease-in-out;
            }
        `}</style>
        </div>
    );
}
