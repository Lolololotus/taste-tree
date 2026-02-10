'use client';

import { TasteMap } from '@/components/ui/TasteMap';
import Link from 'next/link';

export default function MapPage() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-[#FFFDF0] p-4 font-pixel relative">

            {/* Header */}
            <header className="absolute top-6 w-full max-w-4xl flex justify-between items-center px-4 z-10">
                <Link
                    href="/ko/create" // Default to KO for now
                    className="flex items-center gap-2 text-[#795548] hover:text-[#5D4037] transition-colors"
                >
                    <span className="text-xl">←</span>
                    <span className="text-sm font-bold">정원 가꾸기</span>
                </Link>

                <h1 className="text-xl font-bold text-[#795548]">MEMORY MAP</h1>

                <div className="w-20" /> {/* Spacer */}
            </header>

            {/* Map Container */}
            <div className="w-full max-w-5xl aspect-[16/9] shadow-[8px_8px_0px_#E0E0E0] rounded-[2.5rem]">
                <TasteMap />
            </div>

            {/* Footer Legend */}
            <div className="mt-8 flex gap-6 text-xs text-[#8D6E63]">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#FFB74D]"></span> Joy
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#F06292]"></span> Nostalgia
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#4DB6AC]"></span> Calm
                </div>
            </div>

        </main>
    );
}
