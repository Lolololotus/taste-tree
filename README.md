# 🌳 Taste Tree: Digital Garden of Identity
> "Cultivating your unique identity, one memory at a time."

![Status](https://img.shields.io/badge/Status-Phase_5_Polished-blue) 
![i18n](https://img.shields.io/badge/i18n-Korean%20%7C%20English-green)
![AI](https://img.shields.io/badge/AI-Gemini_2.5_Flash-purple)
![Style](https://img.shields.io/badge/Style-Pastel_Pixel_Art-pink)

**Taste Tree** is a "Digital Garden" where users plant the seeds of their memories and grow them into a unique data asset. Escaping the efficiency-driven world, we invite you to a slow, polite conversation with our AI Gardener, **Jimini**.

---

## ✨ Key Features

### 1. 🤖 AI Pixel Gardener (Jimini)
*   **Persona**: A polite, gentle gardener (Polite "Haeyo" style in KR, Poetic in EN).
*   **Engine**: Powered by **Google Gemini 2.5 Flash** for fast, high-quality responses.
*   **Logic**: 
    *   **Broad-to-Specific**: Starts with core frameworks (Role, Story) before asking sensory details.
    *   **3-Sentence Rule**: Strictly concise and warm responses.
    *   **Trust Score**: Analyzes the depth of your story to assign a data value.

### 2. 🌲 Living Garden (Visuals)
*   **Real-time Growth**: 5 Stages of growth (Seed → Sprout → Sapling → Tree → Bloom).
*   **Dynamic Aesthetics**:
    *   **Dithered Background**: Retro pixel-art shading.
    *   **Procedural Colors**: Tree and seed colors change based on your **Sentiment** (Joy, Calm, Nostalgia, etc.).
    *   **Pixel Physics**: Floating bubbles and shaking typewriter effects.

### 3. 🌍 Global Connectivity (Taste Pin)
*   **i18n Support**: Fully bilingual (Korean/English) interface and AI.
*   **Global Asset**: Your memories are stored with English keywords (`englishKeywords`) to connect with users worldwide.
*   **Taste Pin**: Future roadmap feature to visualize similar tastes on a global map.

### 4. 💎 Taste-to-Earn (T2E)
*   **Data Sovereignty**: Your story becomes an **Answer_Asset**.
*   **Reward**: Earn **$TASTE** tokens (mock) based on the Trust Score of your memory.
*   **Export**: Save your memory as a beautiful **Taste Card** image.

---

## 🛠 Tech Stack

*   **Framework**: Next.js 15 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS (Custom Pixel Utility Classes)
*   **Animation**: Framer Motion
*   **AI**: Google Generative AI SDK (`@google/generative-ai`)
*   **i18n**: `next-intl`

---

## 🚀 Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-repo/taste-tree.git
    cd taste-tree
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env` file in the root directory:
    ```bash
    GEMINI_API_KEY=your_google_api_key_here
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3002](http://localhost:3002) in your browser.

---

## 📂 Project Structure

```
src/
├── app/
│   ├── [locale]/           # Localized routes
│   │   ├── create/         # Main Chat Interface
│   │   └── page.tsx        # Landing Page
│   └── api/chat/           # Next.js API Route (Gemini)
├── components/
│   ├── ui/
│   │   ├── GardenCanvas.tsx # HTML5 Canvas Background
│   │   ├── PixelSeed.tsx    # Dynamic Seed Component
│   │   └── TasteCard.tsx    # Exportable Memory Card
├── lib/
│   ├── sound.ts            # Sound Manager (Typewriter fx)
│   └── storage.ts          # LocalStorage Asset Manager
└── messages/               # i18n JSON files (ko.json, en.json)
```

---

## 🗺 Roadmap

*   [x] **Phase 1**: Design System & Architecture (Pastel Pixel)
*   [x] **Phase 2**: AI Persona & Chat Logic (Gemini 2.5)
*   [x] **Phase 3**: Living Garden & Visualization
*   [x] **Phase 4**: Global Expansion (i18n)
*   [ ] **Phase 5**: Web3 Integration (Wallet Connect & Minting)

---

Developed with 🌱 by **Antigravity Team**
