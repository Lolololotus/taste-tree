import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Hardcoded Key for ABSOLUTE CERTAINTY
const TEST_API_KEY = "AIzaSyCBsLrD67wkJd9yWapVthEcCdPse4eYHbA";

export async function POST(req: Request) {
    try {
        const { message, history, locale } = await req.json();

        console.log("🚀 [Debug API] Initializing gemini-1.5-flash...");

        const genAI = new GoogleGenerativeAI(TEST_API_KEY);

        // SWITCH TO gemini-2.5-flash (Available per model list)
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Simple prompt injection (No systemInstruction object)
        const prompt = `
System: You are a polite gardener. Respond in 3 sentences max.
User Locale: ${locale}
User: ${message}
        `;

        console.log("Sending generateContent request...");
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        console.log("✅ [Debug API] Success:", responseText);

        const data = {
            reply: responseText,
            trustScore: 0.8,
            sentiment: "Joy",
            tags: ["Debug", "Success", "Flash"],
            environment: { weather: "Sunny", time: "Day" },
            externalInfo: null,
            isFinal: false,
            debug: "Generated via gemini-1.5-flash (SIMPLE MODE)"
        };

        return NextResponse.json(data);

    } catch (error: any) {
        console.error("❌ [Debug API] Error:", error);

        return NextResponse.json({
            reply: `Debug Error: ${error.message}`,
            trustScore: 0.1,
            sentiment: "Sorrow",
            tags: ["Error"],
            externalInfo: null,
            isFinal: false,
            debug: error.stack
        });
    }
}
