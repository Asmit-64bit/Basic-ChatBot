import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;

if (API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
}

// Free tier models only (as of 2025)
const MODELS_TO_TRY = [
    "gemini-2.5-flash-lite",  // Most generous free tier - up to 1000 RPD
    "gemini-2.5-flash",       // Free tier with limited requests
    "gemini-2.0-flash",       // Stable free tier model
];

// Helper to try generation with a specific model
async function generateWithModel(modelName, prompt) {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}

export async function getGeminiResponse(userPrompt) {
    if (!genAI) {
        console.error("Gemini API Key is missing.");
        return "Error: API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file.";
    }

    // Add current date/time context so the AI knows the real date
    const now = new Date();
    const dateContext = `[System Context: Today's date is ${now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })}. Current time is ${now.toLocaleTimeString('en-US')}.]\n\nUser: ${userPrompt}`;

    // Try each model until one works
    for (const modelName of MODELS_TO_TRY) {
        try {
            console.log(`Attempting with ${modelName}...`);
            const response = await generateWithModel(modelName, dateContext);
            console.log(`Success with ${modelName}!`);
            return response;
        } catch (error) {
            console.warn(`${modelName} failed:`, error.message);
            // Continue to next model
        }
    }

    // If all models failed
    return "Error: Could not connect to any Gemini model. Please verify your API Key is valid and enabled in Google AI Studio.";
}

