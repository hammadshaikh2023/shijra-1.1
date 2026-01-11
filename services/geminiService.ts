import { GoogleGenAI, Type } from "@google/genai";
import { Story } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStoryFromSeed = async (seed: string): Promise<Omit<Story, 'id' | 'createdAt'>> => {
  try {
    const model = "gemini-3-flash-preview";
    
    const response = await ai.models.generateContent({
      model: model,
      contents: `Create a wise, metaphorical short story based on this seed thought: "${seed}". 
      The tone should be dreamy, professional, and inspiring. 
      Limit the story to around 200 words. 
      Also provide a title, a one-sentence summary, and 3 relatable tags (e.g., Growth, Patience).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            summary: { type: Type.STRING },
            tags: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["title", "content", "summary", "tags"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as Omit<Story, 'id' | 'createdAt'>;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};