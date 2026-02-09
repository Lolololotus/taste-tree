'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { PixelSeed } from './PixelSeed';

interface TasteCardProps {
    id: string; // DOM ID for capture
    stage: number;
    sentiment: string;
    environment: { weather: string; time: string };
    asset: any;
    userName?: string;
}

export function TasteCard({ id, stage, sentiment, environment, asset, userName = "Gardener" }: TasteCardProps) {
    if (!asset) return null;

    // Background color based on sentiment/time (simplified map)
    const getBgColor = () => {
        if (environment.time === 'Night') return '#1A237E';
        if (environment.time === 'Sunset') return '#FFCC80';
        if (sentiment.includes("Joy")) return '#F1F8E9';
        return '#FFF3E0';
    };

    return (
        <div
            id={id}
            className="relative w-[320px] h-[568px] overflow-hidden flex flex-col items-center justify-between p-6 font-pixel border-8 border-[#5D4037] bg-white text-[#5D4037]"
            style={{ backgroundColor: getBgColor() }}
        >
            {/* Header */}
            <div className="w-full text-center z-10">
                <h3 className="text-xs uppercase tracking-widest opacity-70">Taste Tree Asset</h3>
                <h1 className="text-xl font-bold mt-2">{asset.metadata.externalInfo?.officialName || "나만의 취향 나무"}</h1>
                <p className="text-sm opacity-80 mt-1">{asset.metadata.externalInfo?.genre || sentiment + " Memory"}</p>
            </div>

            {/* Tree Placeholder */}
            <div className="flex-1 flex items-center justify-center w-full z-10">
                <div className="relative bottom-4">
                    {stage === 5 ? (
                        <div className="text-9xl">🌳</div>
                    ) : (
                        <PixelSeed sentiment={sentiment} size={12} />
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="w-full bg-white/80 backdrop-blur-sm p-4 rounded-xl border-2 border-[#5D4037] z-10 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-[#5D4037]/20">
                    <span className="text-xs font-bold">TRUST SCORE</span>
                    <span className="text-lg font-bold">{(asset.metadata.trustScore * 100).toFixed(0)}</span>
                </div>

                <div className="flex justify-between items-end">
                    <div className="text-xs space-y-1">
                        <p>Date: {new Date().toLocaleDateString()}</p>
                        <p>Gardener: {userName}</p>
                    </div>
                    {asset.metadata.externalInfo?.googleSearchUrl && (
                        <div className="p-1 bg-white rounded-md border border-gray-200">
                            <QRCodeSVG
                                value={asset.metadata.externalInfo.googleSearchUrl}
                                size={48}
                                fgColor="#5D4037"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Watermark */}
            <div className="absolute bottom-1 w-full text-center text-[10px] opacity-40">
                Authorized by Taste Tree Protocol
            </div>

            {/* Environment Overlay */}
            {environment.weather === 'Rainy' && (
                <div className="absolute inset-0 pointer-events-none bg-[url('https://media.giphy.com/media/t7Qb8655Z1oMC/giphy.gif')] opacity-10 bg-cover mix-blend-overlay" />
            )}
        </div>
    );
}
