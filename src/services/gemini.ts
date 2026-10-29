import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const geminiModel = "gemini-3-flash-preview";

export async function generateText(prompt: string, systemInstruction?: string) {
  try {
    const response = await ai.models.generateContent({
      model: geminiModel,
      contents: prompt,
      config: {
        systemInstruction,
      },
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating content. Please check your API key.";
  }
}

export async function generateImage(prompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [{ text: prompt }],
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        },
      },
    });
    
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    return null;
  }
}

export async function processImage(imagePart: { inlineData: { data: string, mimeType: string } }, prompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: geminiModel,
      contents: { parts: [imagePart, { text: prompt }] },
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini Image Processing Error:", error);
    return "Error processing image.";
  }
}
