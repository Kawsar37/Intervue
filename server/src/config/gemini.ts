import { GoogleGenerativeAI } from "@google/generative-ai";

let _genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!_genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is required");
    }
    _genAI = new GoogleGenerativeAI(apiKey);
  }
  return _genAI;
}

export function getGeminiModel() {
  return getGenAI().getGenerativeModel({
    model: "gemini-3.5-flash",
  });
}
