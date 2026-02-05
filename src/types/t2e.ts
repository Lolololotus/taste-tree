export interface AnswerAssetMetadata {
    createdAt: string; // ISO Date
    updatedAt: string; // ISO Date
    editCount: number;
    trustScore: number; // 0.0 to 1.0 (Integration point for reputation logic)
    externalInfo?: {
        officialName: string;
        genre: string;
        googleSearchUrl: string;
        keySentiment: string;
    };
}

export interface AnswerAsset {
    id: string; // UUID
    userId: string;
    questionId: string; // e.g., "root_question_01"
    content: string;
    tags: string[];
    chatHistory: { role: 'user' | 'assistant'; content: string; timestamp: string; }[];
    metadata: AnswerAssetMetadata;
    // Future: transactionHash?: string;
}

export interface UserProfile {
    id: string;
    nickname: string;
    walletAddress: string | null;
    assets: AnswerAsset[];
}
