import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Taste Tree",
  description: "나만의 취향 나무, Taste Tree",
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="text-xl md:text-4xl leading-relaxed animate-pulse">
        나만의 취향 나무,<br className="block md:hidden" /> Taste Tree
      </h1>
    </main>
  );
}
