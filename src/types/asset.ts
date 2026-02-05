export interface Answer_Asset {
    content: string;
    trustScore: number; // 0-100, default 100
    metadata: {
        official_name?: string;
        genre?: string;
        google_search_url?: string;
    };
    timestamp: string; // ISO string
}
