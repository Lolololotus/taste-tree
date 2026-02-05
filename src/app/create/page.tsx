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
import { soundManager } from '@/lib/sound';

export default function CreatePage() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "당신의 마음을 처음 사로잡은 것은 무엇인가요?" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [stage, setStage] = useState(0); // 0: Start -> 5: Full Bloom
    const [currentSentiment, setCurrentSentiment] = useState("Calm");
    const [environment, setEnvironment] = useState<any>({ weather: "Sunny", time: "Day" });
    const [finalAsset, setFinalAsset] = useState<any>(null);

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
        // Mock connection
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
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg, history: newHistory }),
            });
            const data = await res.json();

            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);

            // Update Sentiment & Stage
            if (data.sentiment) setCurrentSentiment(data.sentiment);
            if (data.environment) setEnvironment(data.environment);

            // Progressive Growth Logic
            if (data.isFinal) {
                setStage(5); // Bloom
                setIsCompleted(true);
                soundManager.playGrowth(); // Final Bloom Sound

                // Calculate Reward
                const reward = Math.floor((data.trustScore || 0.5) * 100);
                setTokenReward(reward);

                const newAsset = createAnswerAsset(
                    walletAddress || "guest_user", // Use wallet if connected
                    "root_q1",
                    userMsg,
                    data.tags || [],
                    newHistory,
                    { trustScore: data.trustScore, externalInfo: data.externalInfo }
                );
                setFinalAsset(newAsset);
                saveAsset(newAsset);
            } else {
                setStage(prev => {
                    const next = Math.min(prev + 1, 4);
                    if (next > prev) soundManager.playGrowth(); // Growth Sound
                    return next;
                });
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

    return (
        <main className="flex min-h-screen flex-col items-center justify-center relative font-pixel overflow-hidden">

            {/* Background Garden (Stages 0-5) */}
            <GardenCanvas stage={stage} sentiment={currentSentiment} environment={environment} />

            {/* Header / Wallet Connect */}
            <div className="absolute top-4 right-4 z-20">
                <button
                    onClick={handleConnectWallet}
                    className={`
                        px-4 py-2 rounded-xl border-2 transition-all shadow-sm font-bold text-xs md:text-sm
                        ${walletAddress
                            ? "bg-[#E0F2F1] border-[#80CBC4] text-[#00695C]"
                            : "bg-white border-[#E0E0E0] text-[#757575] hover:bg-[#FAFAFA] hover:border-[#BDBDBD]"}
                    `}
                >
                    {walletAddress ? `🌱 ${walletAddress}` : "🔗 지갑 연결"}
                </button>
            </div>

            {/* Chat Overlay */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="z-10 w-full max-w-2xl flex flex-col h-[70vh] bg-white/70 backdrop-blur-sm rounded-[2rem] shadow-lg border border-white/60 p-6 md:p-8 mb-12 transition-all"
            >
                {/* Chat Area */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto space-y-6 p-2 scrollbar-hide"
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
                                <div className="max-w-[85%] text-left">
                                    <div className={`
                                    bg-[#FFFDF5] text-[#5D4037] px-5 py-3 rounded-[2rem] rounded-tl-none shadow-sm 
                                    text-sm md:text-base leading-relaxed border border-[#EFEBE9] font-medium
                               `}>
                                        <TypewriterText text={msg.content} speed={35} />
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-[#E3F2FD] text-[#1565C0] px-5 py-3 rounded-[2rem] rounded-tr-none shadow-sm text-sm md:text-base border border-[#BBDEFB]">
                                    {msg.content}
                                </div>
                            )}
                        </motion.div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-[#FFFDF5] px-4 py-3 rounded-[2rem] rounded-tl-none shadow-sm border border-[#EFEBE9]">
                                <span className="animate-pulse text-xs text-[#A1887F]">... Pixel Gardener is thinking ...</span>
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
                                placeholder="이야기를 들려주세요..."
                                className="w-full bg-white/90 pl-6 pr-12 py-3 rounded-full shadow-inner border border-[#E0E0E0] text-sm text-[#424242] focus:outline-none focus:ring-2 focus:ring-[#A8E6CF]"
                            />
                            <button
                                onClick={handleSendMessage}
                                className="absolute right-2 top-1.5 p-1.5 bg-[#A8E6CF] rounded-full hover:bg-[#81C784] transition-colors shadow-sm"
                            >
                                <span className="text-white text-xs">⏎</span>
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

                            <div className="text-4xl mb-4">🌳</div>
                            <h2 className="text-xl font-bold text-[#5D4037] mb-1">
                                {finalAsset.metadata.externalInfo?.officialName || "나만의 기억 나무"}
                            </h2>
                            <p className="text-sm text-[#8D6E63] mb-6">
                                {finalAsset.metadata.trustScore > 0.8 ? "뿌리 깊은 " : "소중한 "}
                                {finalAsset.metadata.externalInfo?.keySentiment || currentSentiment}의 기억이 자산화되었습니다.
                            </p>

                            <div className="bg-[#FAFAFA] rounded-xl p-4 text-left space-y-2 mb-6 border border-[#EEEEEE]">
                                <div className="flex justify-between text-xs text-[#757575]">
                                    <span>자산 가치 (Trust Score)</span>
                                    <span className="font-bold text-[#5D4037]">{(finalAsset.metadata.trustScore * 100).toFixed(0)} / 100</span>
                                </div>
                                <div className="flex justify-between text-xs text-[#757575] mt-1">
                                    <span>채굴 보상</span>
                                    <span className="font-bold text-[#FFB300]">+{tokenReward} TASTE</span>
                                </div>
                                {finalAsset.metadata.externalInfo?.genre && (
                                    <div className="flex justify-between text-xs text-[#757575] mt-1">
                                        <span>장르</span>
                                        <span className="font-bold text-[#5D4037]">{finalAsset.metadata.externalInfo.genre}</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                {finalAsset.metadata.externalInfo?.googleSearchUrl && (
                                    <a
                                        href={finalAsset.metadata.externalInfo.googleSearchUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full py-3 bg-[#4285F4] text-white rounded-xl font-bold hover:bg-[#3367D6] transition-colors text-sm shadow-md"
                                    >
                                        Google에서 더 보기
                                    </a>
                                )}
                                <button className="block w-full py-3 bg-[#FFCA28] text-[#5D4037] rounded-xl font-bold hover:bg-[#FFC107] transition-colors text-sm shadow-md">
                                    {walletAddress ? "지갑에 저장하기 (Mint)" : "지갑 연결하고 수령하기"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
