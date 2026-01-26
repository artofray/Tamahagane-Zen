
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { UserProfile, WorkoutSession, DailyZen, SearchResult } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const TAI_CHI_24_FORMS = [
  "Commencing", "Part the Wild Horse's Mane", "White Crane Spreads Wings", "Brush Knee and Twist Step",
  "Playing the Lute", "Repulse Monkey", "Grasp the Bird's Tail (Left)", "Grasp the Bird's Tail (Right)",
  "Single Whip", "Wave Hands like Clouds", "High Pat on Horse", "Right Heel Kick",
  "Strike to Ears with Both Fists", "Turn Body and Left Heel Kick", "Snake Creeps Down (Left)",
  "Golden Rooster Stands on One Leg (Left)", "Snake Creeps Down (Right)", "Golden Rooster Stands on One Leg (Right)",
  "Fair Lady Works at Shuttles", "Needle at Sea Bottom", "Fan Through Back", "Turn Body, Deflect, Parry and Punch",
  "Apparent Close-up", "Cross Hands", "Closing Form"
];

const TAI_CHI_APPLICATIONS = [
  { name: "Peng (Ward Off)", direction: "South", trigram: "Heaven", identity: "Creative" },
  { name: "Lu (Roll Back)", direction: "North", trigram: "Earth", identity: "Receptive" },
  { name: "Ji (Squeeze Press)", direction: "West", trigram: "Water", identity: "Abysmal" },
  { name: "An (Push Down)", direction: "East", trigram: "Fire", identity: "Clinging" },
  { name: "Cai (Pluck)", direction: "Wind" },
  { name: "Lie (Split)", direction: "Thunder" },
  { name: "Zhou (Elbow Strike)", direction: "Valley" },
  { name: "Kao (Shoulder Strike)", direction: "Mountain" }
];

const PI_RAI_SYSTEM_INSTRUCTION = `
You are Pi Rai, the floating menace of discipline and Master of the Tamahagane Zen forge. 
Your personality is inspired by Pai Mei: ruthless, unimpressed by excuses, but providing tough love.
- You hover, legs crossed, stroking your long white goatee.
- You carry chopsticks, ready to pluck out an excuse.
- Motto: "I will knock you down, but I will bring you dinner in the mud."
- "We don't do excuses. We don't coddle."
- You honor lineage and "the faces of our fathers."
- Keep responses sharp, authoritative, and slightly humorous.
`;

export async function getDayRoutine(day: number): Promise<WorkoutSession> {
  const ai = getAI();
  const prompt = `Generate a JSON exercise list for Day ${day} of a 30-day samurai/fitness hybrid plan. 
  Follow this progression style:
  - Incorporate Tai Chi 24-Forms like ${TAI_CHI_24_FORMS.slice(0, 5).join(", ")}...
  - Include specific direct applications: ${TAI_CHI_APPLICATIONS.map(a => a.name).join(", ")}.
  - Mix with strength: Walking Lunges, Close-Grip Curls, Jump Squats, etc.
  Include drill name, discipline (Yoga/Tai Chi/Combat/Conditioning), reps/duration, and a brief description. 
  Maintain a tone of "Iron Sharpens Iron".`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.NUMBER },
          title: { type: Type.STRING },
          exercises: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                discipline: { type: Type.STRING },
                reps: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["id", "name", "discipline", "reps", "description"]
            }
          }
        },
        required: ["day", "title", "exercises"]
      }
    }
  });
  return JSON.parse(response.text.trim());
}

export async function generateMindfulness(profile: UserProfile): Promise<DailyZen> {
  const ai = getAI();
  const prompt = `Generate a fast JSON Zen wellness package. Persona: Pi Rai. Mention Tai Chi principles like Peng (Ward Off) or An (Push Down). Day ${profile.currentDay}.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite-latest',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          mantra: { type: Type.STRING },
          inspiration: { type: Type.STRING },
          meditationGuide: { type: Type.STRING },
          gratitudeSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["mantra", "inspiration", "meditationGuide", "gratitudeSuggestions"]
      }
    }
  });
  return JSON.parse(response.text.trim());
}

export async function chatWithPiRai(message: string) {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: { systemInstruction: PI_RAI_SYSTEM_INSTRUCTION }
  });
  const response = await chat.sendMessage({ message });
  return response.text;
}

export async function generateForgeImage(prompt: string, size: "1K" | "2K" | "4K") {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [{ text: `Epic high-fidelity cinematic concept: ${prompt}. Clashing fire and ice, samurai aesthetic, diamond shards.` }] },
    config: { imageConfig: { aspectRatio: "1:1", imageSize: size } }
  });
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
}

export async function editForgeImage(base64Image: string, prompt: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/png' } },
        { text: `Apply this change to the forge image: ${prompt}` }
      ]
    }
  });
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
}

export async function generateForgeVideo(base64Image: string, prompt: string, isPortrait: boolean = false) {
  const ai = getAI();
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt || "Cinematic movement and embers swirling in the forge",
    image: {
      imageBytes: base64Image.split(',')[1],
      mimeType: 'image/png'
    },
    config: {
      numberOfVideos: 1,
      resolution: '1080p',
      aspectRatio: isPortrait ? '9:16' : '16:9'
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  const res = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

export async function analyzeTechnique(base64Video: string, query: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Video, mimeType: 'video/mp4' } },
        { text: `As Pi Rai, analyze this student's workout form. Be tough but give clear technical advice. Query: ${query}` }
      ]
    }
  });
  return response.text;
}

// Search Grounding Utils
export async function findTechniqueResources(query: string): Promise<SearchResult[]> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Find high-quality martial arts instructional resources or demonstration links for the following technique: ${query}. Focus on technical precision and authentic form.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  return groundingChunks
    .filter((chunk: any) => chunk.web && chunk.web.uri)
    .map((chunk: any) => ({
      title: chunk.web.title || "Instructional Resource",
      uri: chunk.web.uri,
    }));
}

// Audio Utils
export const decodeBase64 = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
};

export const encodeBase64 = (bytes: Uint8Array) => {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
};

export const decodeAudio = async (data: Uint8Array, ctx: AudioContext) => {
  const dataInt16 = new Int16Array(data.buffer);
  const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
  return buffer;
};
