import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyAAqoUJ65S7Tkr0zyO3VXuPPyTe3dmCMj0";
const genAI = new GoogleGenerativeAI(API_KEY);

// Migrating to Gemini 2.5 Flash as requested (Available since April 2025)
export const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
