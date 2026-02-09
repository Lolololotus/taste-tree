import { AnswerAsset, AnswerAssetMetadata } from "@/types/t2e";

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

export const saveAsset = (asset: AnswerAsset) => {
    // Simulate Blockchain/DB storage
    console.log("------------------------------------------");
    console.log("💾 [T2E System] Saving Asset to Ledger...");
    console.log("Asset ID:", asset.id);
    console.log("Trust Score:", asset.metadata.trustScore);
    console.log("Content:", asset.content);
    console.log("Tags:", asset.tags);
    console.log("Chat History Length:", asset.chatHistory?.length);
    console.log("------------------------------------------");

    // TODO: Connect to real DB/IPFS
};
