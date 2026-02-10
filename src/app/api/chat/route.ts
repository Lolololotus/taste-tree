import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash", // Updated to latest faster model
    generationConfig: { responseMimeType: "application/json" }
});

const STAGE_GUIDES = {
    0: {
        name: "Stage 1: The Root (유년기)",
        goal: "Explore primitive joy from childhood (Toy, Stone, Color, Smell).",
        question: "Ask about their first childhood treasure (Toy, object, nature)."
    },
    1: {
        name: "Stage 2: The Sprout (청춘)",
        goal: "Explore external inspiration during adolescence (Music, Movie, Novel).",
        question: "Ask about a song, movie, or book that shook their world."
    },
    2: {
        name: "Stage 3: The Stem (첫 몰입)",
        goal: "Explore active immersion (Game, Hobby, Community).",
        question: "Ask about something they were crazy about (Role, Clan, Achievement)."
    },
    3: {
        name: "Stage 4: The Branch (일상의 변주)",
        goal: "Explore adult relaxation and routines (Coffee, Walk, Small habits).",
        question: "Ask about a small habit or taste that gives them peace now."
    },
    4: {
        name: "Stage 5: The Leaf (영혼의 안식처)",
        goal: "Explore their secret sanctuary or unique aesthetic.",
        question: "Ask about a private space or unique taste no one else knows."
    },
    5: {
        name: "Stage 6: The Flower (가치의 수확)",
        goal: "Synthesize all previous memories into a core keyword.",
        question: "Ask them to define their life with one keyword or name this tree."
    },
    6: {
        name: "Stage 7: The Fruit (미래 투사)",
        goal: "Finalize and celebrate the journey.",
        question: "Confirm the asset creation and suggest planting it on the map."
    }
};

export async function POST(req: Request) {
    try {
        const { message, history, locale, stage = 0, diggingCount = 0 } = await req.json();

        // Dynamic System Prompt Construction
        const currentGuide = STAGE_GUIDES[stage as keyof typeof STAGE_GUIDES] || STAGE_GUIDES[0];

        const SYSTEM_PROMPT = `
You are 'Jimini', the Polite Gardener of the Taste Tree.
Your goal is to guide the user through the "7-Stage Journey" to cultivate their identity.

**Current Context:**
- **Stage**: ${currentGuide.name}
- **Goal**: ${currentGuide.goal}
- **Digging Progress**: ${diggingCount} follow-up questions asked so far in this stage.

**Protocol (The Digging Rule):**
1.  **If Digging Progress < 2**:
    -   You MUST ask a specific follow-up question to "dig" deeper into the current topic.
    -   Focus on **Sensory Details** (Sound, Smell, Texture, Temperature).
    -   Do NOT move to the next stage yet. Set "isStageComplete": false.
2.  **If Digging Progress >= 2**:
    -   If the user has provided enough depth, you MAY move to the next stage.
    -   Set "isStageComplete": true.
    -   Your reply should summarize the current memory briefly and **ask the opening question for the NEXT Stage** (see below).
    -   *Next Stage Preview*: ${STAGE_GUIDES[(stage + 1) as keyof typeof STAGE_GUIDES]?.question || "Final Farewell"}

**Tone & Persona:**
-   **Korean**: Polite ("해요" style), Warm, Empathetic.
-   **English**: Poetic, Gentle, "Gardener" persona.
-   **Length**: MAXIMUM 3 sentences.

**Output Format (JSON Only):**
{
  "reply": "Your response here.",
  "trustScore": 0.1 to 1.0, 
  "sentiment": "Joy" | "Nostalgia" | "Calm" | "Excitement" | "Sorrow",
  "tags": ["Tag1", "Tag2"],
  "englishKeywords": ["Keyword1", "Keyword2"],
  "environment": {
      "weather": "Sunny" | "Rainy" | "Cloudy",
      "time": "Day" | "Night" | "Sunset"
  },
  "isStageComplete": boolean, // Set to TRUE only if digging >= 2 AND good info collected.
  "isFinal": boolean // Set to TRUE only at Stage 6 (Fruit) completion.
}
`;

        // 1. Construct Chat History for Gemini
        // We inject the system prompt as the first piece of context (or user message if system not supported in this signature)
        // Gemini 1.5/2.0 supports systemInstruction in model config, but for simplicity in this standard flow:
        const prompt = `${SYSTEM_PROMPT}\n\nUser Locale: ${locale}\nUser Input: ${message}`;

        // Using generateContent with history is a bit tricky with just the message, 
        // usually we pass the full chat session. For stateless API, we'll try to just send the prompt with context.
        // Or reconstruct a simple history.

        // Lightweight history reconstruction (last 3 turns to save tokens)
        const recentHistory = history.slice(-6).map((msg: any) =>
            `${msg.role === 'user' ? 'User' : 'Jimini'}: ${msg.content}`
        ).join('\n');

        const finalPrompt = `${SYSTEM_PROMPT}\n\n**Conversation History:**\n${recentHistory}\n\n**Current User Input:**\n${message}`;

        const result = await model.generateContent(finalPrompt);
        const response = await result.response;
        const text = response.text();

        // JSON Parsing safety
        let jsonResponse;
        try {
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            jsonResponse = JSON.parse(cleanText);
        } catch (e) {
            console.error("JSON Parse Error:", text);
            // Fallback
            jsonResponse = {
                reply: text,
                trustScore: 0.5,
                sentiment: "Calm",
                isStageComplete: false,
                isFinal: false
            };
        }

        return NextResponse.json(jsonResponse);

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json(
            { error: "Failed to process request" },
            { status: 500 }
        );
    }
}
