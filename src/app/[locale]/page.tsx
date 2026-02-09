import type { Metadata } from "next";
import { Link } from "@/navigation";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelBackground } from "@/components/ui/PixelBackground";

export const metadata: Metadata = {
  title: "Taste Tree",
  description: "나만의 취향 나무, Taste Tree",
};



export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center relative overflow-hidden">
      <PixelBackground />

      <div className="z-10 flex flex-col items-center gap-10 max-w-2xl bg-[#FFFDF5] p-12 rounded-[2.5rem] shadow-[8px_8px_0px_rgba(220,237,193,0.5)] border-[3px] border-dashed border-[#D7CCC8]">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-relaxed text-[#5D4037] tracking-tight">
            나만의 취향 나무 <span className="text-[#A8E6CF] whitespace-nowrap" style={{ textShadow: '2px 2px 0px #8D6E63' }}>Taste Tree</span>
          </h1>

        </div>

        <Link href="/create">
          <PixelButton>
            나무 심기 START
          </PixelButton>
        </Link>
      </div>
    </main>
  );
}
