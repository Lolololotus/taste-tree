const { GoogleGenerativeAI } = require("@google/generative-ai");

// Hardcoded key for testing puprose
const API_KEY = "AIzaSyCBsLrD67wkJd9yWapVthEcCdPse4eYHbA";

async function checkModels() {
    const genAI = new GoogleGenerativeAI(API_KEY);
    console.log("Checking models...");

    try {
        console.log("-----------------------------------");
        console.log("Testing 'gemini-1.5-flash'...");
        try {
            const modelFlash = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const resultFlash = await modelFlash.generateContent("Hello, are you there?");
            console.log("✅ Success with gemini-1.5-flash!");
            console.log("Response:", resultFlash.response.text());
        } catch (e) {
            console.error("❌ Failed with gemini-1.5-flash:", e.message);
        }

        console.log("-----------------------------------");
        console.log("Testing 'gemini-pro'...");
        try {
            const modelPro = genAI.getGenerativeModel({ model: "gemini-pro" });
            const resultPro = await modelPro.generateContent("Hello, are you there?");
            console.log("✅ Success with gemini-pro!");
            console.log("Response:", resultPro.response.text());
        } catch (e) {
            console.error("❌ Failed with gemini-pro:", e.message);
        }
        console.log("-----------------------------------");

    } catch (error) {
        console.error("Fatal Error:", error.message);
    }
}

checkModels();
