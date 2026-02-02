import type { Metadata } from "next";
import Link from "next/link";
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

      <div className="z-10 flex flex-col items-center gap-8 max-w-2xl">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-5xl leading-relaxed animate-pulse text-[#15803d] dark:text-[#4ade80]" style={{ textShadow: '2px 2px 0px #000' }}>
            나만의 취향 나무,<br /> Taste Tree
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 tracking-wider">
            당신의 취향을 심고 가꿔보세요.
          </p>
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
