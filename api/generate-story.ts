
import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { seed } = req.body;
  
  if (!process.env.API_KEY) {
    return res.status(500).json({ error: "Missing API_KEY environment variable" });
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create a wise, metaphorical short story based on this seed thought: "${seed}". 
      The tone should be dreamy, professional, and inspiring. 
      Limit the story to around 200 words. 
      Also provide a title, a one-sentence summary, and 3 relatable tags.`,
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

    const result = JSON.parse(response.text || '{}');
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate story" });
  }
}
