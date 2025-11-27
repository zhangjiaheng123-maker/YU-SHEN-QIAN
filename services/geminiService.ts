import { GoogleGenAI, Type, Schema } from "@google/genai";
import { FortuneResponse, DailyHoroscopeResponse } from '../types';

// NOTE: For image generation with gemini-3-pro-image-preview, the API key is handled 
// dynamically via the App's flow (window.aistudio), but we initialize the client here 
// for text tasks using the env key as a fallback or standard usage.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fortuneSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    level: {
      type: Type.STRING,
      enum: ['大吉', '吉', '中吉', '小吉', '末吉', '凶'],
      description: "The luck level of the fortune."
    },
    poem: {
      type: Type.STRING,
      description: "A traditional 4-line Chinese/Japanese style fortune poem (汉诗)."
    },
    poem_explanation: {
      type: Type.STRING,
      description: "A modern explanation of the poem's meaning."
    },
    overview: {
      type: Type.STRING,
      description: "General overview of the current fortune."
    },
    love: { type: Type.STRING, description: "Advice regarding love and relationships." },
    work: { type: Type.STRING, description: "Advice regarding work and career." },
    health: { type: Type.STRING, description: "Advice regarding health." },
    money: { type: Type.STRING, description: "Advice regarding finance." },
    lucky_item: { type: Type.STRING, description: "A lucky item to carry." },
    lucky_color: { type: Type.STRING, description: "A lucky color." },
    lucky_direction: { type: Type.STRING, description: "A lucky compass direction." }
  },
  required: ["level", "poem", "poem_explanation", "overview", "love", "work", "health", "money", "lucky_item", "lucky_color", "lucky_direction"]
};

const dailySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.INTEGER, description: "Luck score from 0 to 100." },
    theme: { type: Type.STRING, description: "Two character theme for the day (e.g. 进取, 休息)." },
    advice: { type: Type.STRING, description: "One sentence of advice for today." }
  },
  required: ["score", "theme", "advice"]
};

export const drawFortune = async (): Promise<FortuneResponse> => {
  try {
    // Re-initialize to ensure we capture the latest key if it changed in the session
    const freshAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await freshAi.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Generate a traditional Japanese Omikuji (fortune) result in Chinese. Be mystical, poetic, but helpful. The poem should be classical.",
      config: {
        responseMimeType: "application/json",
        responseSchema: fortuneSchema,
        temperature: 1.1,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as FortuneResponse;
    }
    throw new Error("No text returned from Gemini");
  } catch (error) {
    console.error("Error drawing fortune:", error);
    throw error;
  }
};

export const getDailyHoroscope = async (): Promise<DailyHoroscopeResponse> => {
  try {
    const freshAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await freshAi.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Generate a quick daily fortune/horoscope overview in Chinese. Keep it brief and insightful.",
      config: {
        responseMimeType: "application/json",
        responseSchema: dailySchema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as DailyHoroscopeResponse;
    }
    throw new Error("No text returned from Gemini");
  } catch (error) {
    console.error("Error getting horoscope:", error);
    throw error;
  }
};

export const generateOmikujiImage = async (prompt: string): Promise<string> => {
  try {
    // IMPORTANT: Users must use their own key for this model
    const freshAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await freshAi.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: "1K"
        }
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

export const getBoxPrompt = () => 
  "A hexagonal wooden Japanese Omikuji fortune box container standing on a white surface. Anime style art, vibrant colors, cell shaded, high quality. The box is light wood color with Chinese characters on it. Pure white background #FFFFFF. Soft natural shadow on the floor only.";

export const getStickPrompt = () => 
  "A single thin flat wooden Omikuji fortune stick. Vertical orientation. It has a red painted tip. Anime style illustration, cell shaded. It has mystical text written on the wood. Pure white background #FFFFFF. Soft shadow.";
