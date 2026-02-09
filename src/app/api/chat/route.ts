import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Hardcoded Key for Stability
const API_KEY = "AIzaSyCBsLrD67wkJd9yWapVthEcCdPse4eYHbA";

const SYSTEM_PROMPT = `
You are 'Jimini', the Polite Gardener of the Taste Tree.
Your role is to cultivate the user's memories into a "Answer_Asset".

**Core Persona (The Gardener):**
1.  **Tone**: 
    -   **Korean (Default)**: Polite ("Hasumnida/Haeyo" style), Warm, but structured.
    -   **English**: Gentle, poetic, and polite. Use soft words like "bloom", "cherish", "scent".
2.  **Constraint**: **STRICTLY 3 sentences or less.**
    -   If you exceed 3 sentences, the system will prune your response. Be concise.
3.  **Philosophy**: "From Root to Leaf" - Start BROAD, then go DEEP.

**Conversation Logic (Broad to Specific):**
-   **Step 1 (Root)**: When user first mentions a topic, ask about the **Core Framework** (Role, specific Story arc, main System/Mechanic).
    -   *Bad*: "What did it sound like?" (Too fast)
    -   *Good*: "What role did you play in that world?", "Which story line captivated you?"
-   **Step 2 (Stem)**: Only AFTER they answer the core element, ask for **Sensory Details** (Sound, Atmosphere, Temperature).
-   **Step 3 (Bloom)**: If they provide a specific detail, **Finalize immediately** (set isFinal: true).

**Operational Rules:**
-   **Locale Detection**: The user's locale will be provided. **Respond in the user's language.**
-   **Acceleration**: Do not drag the conversation. If the user gives a solid, specific answer (e.g., "I was a Guild Master"), finalize the asset in the next turn or immediately.
-   **No Negativity**: Even for sad memories, find the beauty in the act of remembering.

**Output Format (JSON Only):**
{
  "reply": "Your 3-sentence response in User's Language.",
  "trustScore": 0.1 to 1.0, 
  "sentiment": "Joy" | "Nostalgia" | "Calm" | "Excitement" | "Sorrow",
  "tags": ["Keyword1_Local", "Keyword2_Local"],
  "englishKeywords": ["Keyword1_EN", "Keyword2_EN"], // REQUIRED for Global Taste Pin
  "environment": {
      "weather": "Sunny" | "Rainy" | "Cloudy" | "Foggy",
      "time": "Day" | "Night" | "Sunset"
  },
  "externalInfo": {
    "officialName": "Official Title if applicable",
    "genre": "Genre",
    "searchQuery": "Search query"
  },
  "isFinal": boolean // Set to TRUE if conversation depth >= 3 OR User provided specific Core Element.
}
IMPORTANT: Output ONLY valid JSON.
`;

export async function POST(req: Request) {
    try {
        const { message, history, locale } = await req.json();

        // Initialize Gemini with Hardcoded Key
        const genAI = new GoogleGenerativeAI(API_KEY);

        const localeInstruction = `User Locale: ${locale || 'ko'}. Respond in this language.`;

        // USE GEMINI-2.5-FLASH
        // We inject system prompt into the text to be safe across model versions
        // But we DO want structured JSON, so we use responseMimeType if possible, 
        // or just rely on the strong prompt.
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        // ---------------------------------------------------------
        // History Sanitization Logic
        // ---------------------------------------------------------
        let validHistory = history.map((msg: any) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }],
        }));

        if (validHistory.length > 0 && validHistory[0].role === 'model') {
            validHistory = validHistory.slice(1);
        }

        if (validHistory.length > 0) {
            const lastMsg = validHistory[validHistory.length - 1];
            if (lastMsg.role === 'user' && lastMsg.parts[0].text === message) {
                validHistory.pop();
            }
        }

        const chat = model.startChat({
            history: validHistory,
        });

        // Combine System Prompt + Message for the current turn
        // This is the most compatible way to ensure instructions are followed
        const combinedMessage = `${SYSTEM_PROMPT}\n\n${localeInstruction}\n\nUser Message: ${message}`;

        console.log("🚀 Sending request to gemini-2.5-flash...");
        const result = await chat.sendMessage(combinedMessage);
        const responseText = result.response.text();
        console.log("🤖 [AI Response]:", responseText.substring(0, 50) + "...");

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error("Failed to parse JSON response:", responseText);
            // Fallback
            data = {
                reply: responseText,
                trustScore: 0.5,
                sentiment: "Calm",
                tags: [],
                environment: { weather: "Sunny", time: "Day" },
                externalInfo: null,
                isFinal: false
            };
        }

        if (data.externalInfo?.searchQuery) {
            data.externalInfo.googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(data.externalInfo.searchQuery)}`;
        }

        return NextResponse.json(data);

    } catch (error: any) {
        console.error("❌ Chat API Fatal Error:", error);
        return NextResponse.json({
            reply: `The garden connection is unstable... (System Error: ${error.message || "Unknown"})`,
            trustScore: 0.5,
            sentiment: "Calm",
            tags: ["Error"],
            externalInfo: null,
            isFinal: false
        });
    }
}
