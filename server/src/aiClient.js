import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODEL = "gemini-flash-latest";

function extractJson(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonText = fenced ? fenced[1] : text;
  return JSON.parse(jsonText.trim());
}

async function generateJson({ systemPrompt, userMessage, maxOutputTokens = 4096 }) {
  const response = await genAI.models.generateContent({
    model: MODEL,
    contents: userMessage,
    config: {
      systemInstruction: systemPrompt,
      maxOutputTokens,
      responseMimeType: "application/json",
    },
  });

  return extractJson(response.text);
}

export { generateJson };
