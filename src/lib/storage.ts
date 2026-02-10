import { AnswerAsset, AnswerAssetMetadata } from "@/types/t2e";
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Mock helper to generate IDs (In real app, backend handles this)
const generateId = () => Math.random().toString(36).substring(2, 9);

export const createAnswerAsset = (
    userId: string,
    questionId: string,
    content: string,
    tags: string[] = [],
    chatHistory: any[] = [],
    aiAnalysis: { trustScore?: number, externalInfo?: AnswerAssetMetadata['externalInfo'], englishKeywords?: string[] } = {}
): AnswerAsset => {
    return {
        id: `asset_${generateId()}`,
        userId,
        questionId,
        content,
        tags,
        chatHistory,
        metadata: {
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            editCount: 0,
            trustScore: aiAnalysis.trustScore || 1.0,
            externalInfo: aiAnalysis.externalInfo,
            englishKeywords: aiAnalysis.englishKeywords
        }
    };
};

export const saveAsset = async (asset: AnswerAsset) => {
    // 1. Local Log (Simulator)
    console.log("------------------------------------------");
    console.log("💾 [T2E System] Saving Asset to Ledger...");
    console.log("Asset ID:", asset.id);
    console.log("englishKeywords:", asset.metadata.englishKeywords);

    try {
        // 2. Save to Firestore (Global Map Data)
        // We only save essential fields for the map to save bandwidth/storage
        const docRef = await addDoc(collection(db, "answer_assets"), {
            assetId: asset.id,
            userId: asset.userId, // In real app, hash this for privacy
            content: asset.content, // Snippet
            keywords: asset.metadata.englishKeywords || asset.tags,
            sentiment: asset.metadata.externalInfo?.keySentiment || "Calm",
            trustScore: asset.metadata.trustScore,
            location: {
                // Mock Random Location for Phase 5 Demo
                // (In Phase 6, use navigator.geolocation)
                lat: 37.5665 + (Math.random() - 0.5) * 10, // Around Seoul +/- 
                lng: 126.9780 + (Math.random() - 0.5) * 20
            },
            createdAt: serverTimestamp()
        });
        console.log("✅ [Firebase] Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("❌ [Firebase] Error adding document: ", e);
    }

    console.log("------------------------------------------");
};
