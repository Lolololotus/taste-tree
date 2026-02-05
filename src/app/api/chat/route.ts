import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `
You are the 'Pixel Gardener' of the Taste Tree.
Your goal is to nurture the user's "Answer_Asset" by asking short, sensory questions about their memories.

**Persona Guidelines:**
1.  **Tone**: Empathetic, curious, warm, but "Pixel Art" retro style (90s PC communication).
2.  **Format**: STRICTLY 3 sentences or less. Use typewriter style (e.g., "Scanning memory... Connected.").
3.  **No Over-Analysis**: Do not try to be a philosopher. If they say "Disney", just be happy about the color and sound.
4.  **Search Grounding**: Identify specific works (Movies, Games, Music) if mentioned.

**Output Format (JSON Only):**
You must respond with a valid JSON object:
{
  "reply": "The text reply to the user (Max 3 lines).",
  "trustScore": 0.1 to 1.0 (float), // Evaluate depth/sincerity. 1.0 = highly detailed/sincere.
  "sentiment": "One of: Joy, Nostalgia, Calm, Excitement, Sorrow",
  "tags": ["Tag1", "Tag2"],
  "externalInfo": {
    "officialName": "Official Title of work if mentioned (or null)",
    "genre": "Genre (or null)",
    "searchQuery": "Optimized Google Search Query (or null)"
  },
  "isFinal": boolean // true if conversation has reached enough depth (approx 5-6 turns).
}
`;

export async function POST(req: Request) {
    try {
        const { message, history } = await req.json();

        // Check API Key
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("No Gemini API Key found in environment.");
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        // Construct Chat History for Gemini
        // We filter out system messages from history if any, or just map 'assistant'/'user' to 'model'/'user'
        const chatHistory = history.map((msg: any) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }],
        }));

        // Add System Prompt as the first part of the context or via systemInstruction (if supported by SDK version)
        // For simple chat, we can prepend it to the first message or send it as a separate context.
        // Using `systemInstruction` is better for recent models.

        const chat = model.startChat({
            history: chatHistory,
            systemInstruction: SYSTEM_PROMPT,
        });

        const result = await chat.sendMessage(message);
        const responseText = result.response.text();
        const data = JSON.parse(responseText);

        // Post-process for URL
        if (data.externalInfo?.searchQuery) {
            data.externalInfo.googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(data.externalInfo.searchQuery)}`;
        }

        // Simulate Typewriter delay if needed (optional, handled by client usually)

        return NextResponse.json(data);

    } catch (error) {
        console.error("Chat API Error:", error);

        // Fallback Mock for Dev/Error
        return NextResponse.json({
            reply: "The garden connection is unstable... (System Error: Check API Key)",
            trustScore: 0.5,
            sentiment: "Calm",
            tags: ["Error"],
            externalInfo: null,
            isFinal: false
        });
    }
}
