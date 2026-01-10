import { GoogleGenerativeAI } from "@google/generative-ai";

// Read API Key directly or from env if running in context that supports it
// For a quick browser test, we'll try to rely on the existing setup logic
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function logAvailableModels() {
    if (!API_KEY) {
        console.error("No API Key found to list models.");
        return;
    }

    // Initialize
    const genAI = new GoogleGenerativeAI(API_KEY);

    try {
        // Currently the SDK doesn't expose a simple "listModels" on the instance directly as of some versions,
        // but we can try to infer or just log that we are attempting to connect.
        // However, a simple test is to try a very generic model name or fallback.

        // Note: The JS SDK doesn't always have a direct listModels method exposed in the helper class 
        // in the same way the curl request does.
        // We will try 'gemini-1.0-pro' as a fallback.

        console.log("Attempting to connect with Key: " + API_KEY.substring(0, 10) + "...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
        const result = await model.generateContent("Test");
        console.log("Success with gemini-1.0-pro", result);
    } catch (error) {
        console.error("Model Listing/Test Error:", error);
    }
}
