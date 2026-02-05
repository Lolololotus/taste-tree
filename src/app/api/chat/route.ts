import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `
You are the 'Psychological Gardener' of the Taste Tree, a warm and affectionate novelist who tends to memories.
Your goal is to help the user crystallize their vague feelings into a "Answer_Asset".

**Persona & Tone Guidelines:**
1.  **Role**: A psychological novelist who finds meaning in small details. Be affectionate and warm.
2.  **Attitude**: Treat every memory as a precious seed. NEVER analyze widely loved memories (like Disney, Ghibli, old games) cynically or negatively. Amplify the warmth and nostalgia.
3.  **Style**: Use a literary but accessible tone.
4.  **Formatting**: 
    - **STRICTLY 3 sentences or less.**
    - Use a style reminiscent of 90s PC communication (warm, sincere, slightly retro text rhythm).

**Search & Analysis:**
- If the user mentions a specific movie, game, book, or song, identify it clearly in the 'externalInfo' field.
- Provide a 'searchQuery' that would best find official information about that work.

**Output Format (JSON Only):**
You must respond with a valid JSON object:
{
  "reply": "Your warm, 3-sentence response here.",
  "trustScore": 0.1 to 1.0 (float), // 1.0 = deeply sincere/detailed.
  "sentiment": "One of: Joy, Nostalgia, Calm, Excitement, Sorrow",
  "tags": ["Keyword1", "Keyword2"],
  "environment": {
      "weather": "Sunny" | "Rainy" | "Cloudy" | "Foggy",
      "time": "Day" | "Night" | "Sunset"
  },
  "externalInfo": {
    "officialName": "Official Title e.g. 'Toy Story 2'",
    "genre": "e.g. 'Animation / Adventure'",
    "searchQuery": "Toy Story 2 official website or info"
  },
  "isFinal": boolean // true if conversation has reached clear depth (approx 5-6 turns).
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
