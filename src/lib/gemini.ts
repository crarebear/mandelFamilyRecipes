import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("VITE_GEMINI_API_KEY is not set. Recipe suggestions will not be available.");
}

const genAI = new GoogleGenerativeAI(API_KEY || "dummy-key");

// Migrating to Gemini 2.5 Flash as requested (Available since April 2025)
export const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
