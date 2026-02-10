'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TypewriterText } from '@/components/ui/TypewriterText';
import { createAnswerAsset, saveAsset } from '@/lib/storage';

interface Message {
    role: 'assistant' | 'user';
    content: string;
}

import { GardenCanvas } from '@/components/ui/GardenCanvas';
import { PixelSeed } from '@/components/ui/PixelSeed';
import { soundManager } from '@/lib/sound';
import { TasteCard } from '@/components/ui/TasteCard';
import html2canvas from 'html2canvas';

import { useLocale } from 'next-intl';

const STAGE_NAMES = [
    "The Root (유년기)",
    "The Sprout (청춘)",
    "The Stem (첫 몰입)",
    "The Branch (일상)",
    "The Leaf (안식처)",
    "The Flower (가치)",
    "The Fruit (수확)"
];

export default function CreatePage() {
    const locale = useLocale();
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: locale === 'en' ? "Let's begin our journey. What was your first childhood treasure?" : "우리의 긴 여행을 시작해볼까요. 어린 시절, 당신을 가장 설레게 했던 첫 번째 보물은 무엇이었나요?" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // 7-Stage State
    const [stage, setStage] = useState(0); // 0 to 6
    const [diggingCount, setDiggingCount] = useState(0);
    const [collectedAssets, setCollectedAssets] = useState<any[]>([]);
    const [isCompleted, setIsCompleted] = useState(false);

    const [currentSentiment, setCurrentSentiment] = useState("Calm");
    const [environment, setEnvironment] = useState<any>({ weather: "Sunny", time: "Day" });
    const [finalAsset, setFinalAsset] = useState<any>(null);
    const [showDataPacket, setShowDataPacket] = useState(false);

    // T2E State
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [tokenReward, setTokenReward] = useState(0);

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleConnectWallet = () => {
        if (!walletAddress) {
            setWalletAddress("0x71C...9A23");
        }
    };

    const handleSendMessage = async () => {
        if (!input.trim() || isTyping) return;
        const userMsg = input.trim();
        const newHistory = [...messages, { role: 'user', content: userMsg } as Message];
        setMessages(newHistory);
        setInput('');
        setIsTyping(true);

        try {
            // Pass Stage and Digging Count to API
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg,
                    history: newHistory,
                    locale,
                    stage,
                    diggingCount
                }),
            });
            const data = await res.json();

            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);

            if (data.sentiment) setCurrentSentiment(data.sentiment);
            if (data.environment) setEnvironment(data.environment);

            // Logic: Check Stage Completion
            if (data.isStageComplete) {
                // Stage Cleared!
                soundManager.playGrowth();

                // Save 'Asset' for this stage (Snapshot)
                const newAsset = createAnswerAsset(
                    walletAddress || "guest_user",
                    `stage_${stage}`,
                    userMsg,
                    data.tags || [],
                    newHistory,
                    {
                        trustScore: data.trustScore,
                        externalInfo: data.externalInfo,
                        englishKeywords: data.englishKeywords
                    }
                );
                setCollectedAssets(prev => [...prev, newAsset]);
                // Save to Firestore silently
                saveAsset(newAsset);

                // Visual Effect
                setShowDataPacket(true);
                setTimeout(() => setShowDataPacket(false), 2000);

                // Move to Next Stage (unless it's the final one)
                if (stage < 6) {
                    setStage(prev => prev + 1);
                    setDiggingCount(0); // Reset digging for new stage
                } else if (stage === 6) {
                    // Final Stage Complete (The Fruit)
                    setFinalAsset(newAsset);
                    setIsCompleted(true);

                    // Calc Total Reward
                    const totalScore = collectedAssets.length * 90 + (data.trustScore * 100);
                    setTokenReward(Math.floor(totalScore));
                }

            } else {
                // Not complete yet, just digging deeper
                setDiggingCount(prev => prev + 1);

                // Small effect
                setShowDataPacket(true);
                setTimeout(() => setShowDataPacket(false), 1000);
            }

            setIsTyping(false);

        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "잠시 연결이 불안정합니다. (Error)" }]);
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleExportCard = async () => {
        const element = document.getElementById('taste-card-capture');
        if (!element) return;

        try {
            const canvas = await html2canvas(element, { scale: 2 });
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `taste-tree-full-journey.png`;
            link.click();
        } catch (err) {
            console.error("Export failed:", err);
        }
    };

    // Dynamic Complexity Calculation
    const complexity = collectedAssets.length > 0
        ? collectedAssets.reduce((acc, curr) => acc + (curr.metadata.trustScore || 0.5), 0) / collectedAssets.length
        : 0.5;

    return (
        <main className="flex min-h-screen flex-col items-center justify-center relative font-pixel overflow-hidden">

            {/* Background Garden (Visual Stage matches Logic Stage) */}
            <GardenCanvas
                stage={Math.min(stage, 6)}
                sentiment={currentSentiment}
                environment={environment}
                complexity={complexity}
            />

            {/* Hidden Capture Area */}
            <div className="absolute -left-[9999px] top-0">
                {finalAsset && (
                    <TasteCard
                        id="taste-card-capture"
                        stage={5}
                        sentiment={currentSentiment}
                        environment={environment}
                        asset={finalAsset}
                        userName={walletAddress || "Guest"}
                    />
                )}
            </div>

            {/* Stage Indicator (Timeline) */}
            <div className="absolute top-4 left-4 z-20 bg-white/80 backdrop-blur px-4 py-2 rounded-2xl border border-[#795548] shadow-sm">
                <div className="text-[10px] text-[#8D6E63] font-bold uppercase tracking-wider mb-1">
                    Current Journey
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm md:text-base font-bold text-[#5D4037]">
                        Stage {stage + 1}: {STAGE_NAMES[stage]}
                    </span>
                    {/* Progress Dots */}
                    <div className="flex gap-1 ml-2">
                        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                                key={i}
                                className={`w-1.5 h-1.5 rounded-full transition-colors ${i <= stage ? 'bg-[#5D4037]' : 'bg-[#D7CCC8]'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Data Packet Absorption Effect */}
            <AnimatePresence>
                {showDataPacket && (
                    <motion.div
                        initial={{ opacity: 1, scale: 1, x: 0, y: 100 }}
                        animate={{ opacity: 0, scale: 0.2, x: 0, y: -200 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none"
                    >
                        <div className="flex flex-col items-center">
                            <span className="text-xs font-pixel text-[#5D4037] mb-1">
                                {diggingCount >= 2 ? "Merging..." : "Digging..."}
                            </span>
                            <PixelSeed sentiment={currentSentiment} size={2} className="animate-spin" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header / Wallet Connect */}
            <div className="absolute top-4 right-4 z-20 flex gap-2">
                <button
                    onClick={handleConnectWallet}
                    className={`
                        px-4 py-2 pixel-box transition-all font-bold text-xs md:text-sm animate-float
                        ${walletAddress
                            ? "bg-[var(--bubble-mint)] text-[var(--text-brown)]"
                            : "bg-white text-[var(--text-brown)] hover:bg-[#F5F5F5]"}
                    `}
                >
                    {walletAddress ? `🌱 ${walletAddress}` : "🔗 지갑 연결"}
                </button>
            </div>

            {/* Chat Overlay */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="z-10 w-full max-w-2xl flex flex-col h-[65vh] md:h-[70vh] bg-white/70 backdrop-blur-sm rounded-[2rem] shadow-lg border border-white/60 p-6 md:p-8 mb-12 transition-all mt-16 md:mt-0"
            >
                {/* Chat Area */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto space-y-6 p-4 scrollbar-hide"
                    style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
                >
                    {messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {msg.role === 'assistant' ? (
                                <div className="max-w-[90%] md:max-w-[85%] text-left">
                                    <div className={`
                                    bg-[var(--bg-cream)] text-[var(--text-brown)] px-4 py-3 md:px-5 pixel-box pixel-tail-left
                                    text-sm md:text-base leading-relaxed
                                `}>
                                        <TypewriterText text={msg.content} speed={30} />
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-[var(--bubble-mint)] text-[var(--text-brown)] px-4 py-3 md:px-5 pixel-box pixel-tail-right text-sm md:text-base">
                                    {msg.content}
                                </div>
                            )}
                        </motion.div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-[var(--bg-cream)] px-4 py-3 pixel-box">
                                <span className="animate-pulse text-xs text-[var(--text-brown)]">... Jimini is thinking ...</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area (Only visible if NOT completed) */}
                <AnimatePresence>
                    {!isCompleted && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="mt-4 relative"
                        >
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                autoFocus
                                placeholder="당신의 이야기를 들려주세요..."
                                className="w-full bg-white/90 pl-6 pr-12 py-3 shadow-inner border border-[var(--text-brown)] text-sm text-[var(--text-brown)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-mint)] font-pixel"
                                style={{ boxShadow: 'inset 2px 2px 0px rgba(0,0,0,0.1)' }}
                            />
                            <button
                                onClick={handleSendMessage}
                                className="absolute right-2 top-1.5 p-1.5 bg-[var(--primary-mint)] hover:bg-[var(--accent-blue)] transition-colors pixel-box shadow-sm"
                            >
                                <span className="text-[var(--text-brown)] text-xs">⏎</span>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Final Infographic Modal */}
            <AnimatePresence>
                {isCompleted && finalAsset && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 120 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
                    >
                        <div className="bg-white rounded-[2rem] shadow-2xl p-8 max-w-sm w-full text-center border-4 border-[#A8E6CF] relative overflow-hidden">
                            {/* Decorative background circle */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#E0F2F1] rounded-full opacity-50" />

                            <div className="mb-4 flex justify-center">
                                <PixelSeed sentiment={finalAsset.metadata.externalInfo?.keySentiment || currentSentiment} size={8} />
                            </div>
                            <h2 className="text-xl font-bold text-[#5D4037] mb-1">
                                당신의 30년이 완성되었습니다
                            </h2>
                            <p className="text-sm text-[#8D6E63] mb-6">
                                유년기부터 성인에 이르기까지, <br />
                                {collectedAssets.length}개의 조각이 모여 숲을 이루었습니다.
                            </p>

                            <div className="bg-[#FAFAFA] rounded-xl p-4 text-left space-y-2 mb-6 border border-[#EEEEEE]">
                                <div className="flex justify-between text-xs text-[#757575]">
                                    <span>총 자산 가치 (Trust Score)</span>
                                    <span className="font-bold text-[#5D4037]">98 / 100</span>
                                </div>
                                <div className="flex justify-between text-xs text-[#757575] mt-1">
                                    <span>총 채굴 보상</span>
                                    <span className="font-bold text-[#FFB300]">+{tokenReward} TASTE</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <button className="block w-full py-3 bg-[#FFCA28] text-[#5D4037] rounded-xl font-bold hover:bg-[#FFC107] transition-colors text-sm shadow-md">
                                    {walletAddress ? "지갑에 나무 저장하기 (Mint)" : "지갑 연결하고 수령하기"}
                                </button>
                                <button
                                    onClick={handleExportCard}
                                    className="block w-full py-3 bg-[#795548] text-white rounded-xl font-bold hover:bg-[#5D4037] transition-colors text-sm shadow-md"
                                >
                                    📷 취향 카드 저장 (Export)
                                </button>

                                <a
                                    href={`/${locale}/map`}
                                    className="block w-full py-3 bg-[#E0F7FA] text-[#006064] rounded-xl font-bold hover:bg-[#B2EBF2] transition-colors text-sm shadow-md border-2 border-[#006064] mt-2"
                                >
                                    🌍 취향 지도 보러가기 (Taste Map)
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main >
    );
}
