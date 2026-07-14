import { GoogleGenerativeAI } from "@google/generative-ai";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};


export async function askGemini(
  messages: readonly ChatMessage[],
  opts?: {
    temperature?: number;
    maxTokens?: number;
  }
): Promise<string> {

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY manquante dans .env.local");
  }


  // Création du client Gemini
  const genAI = new GoogleGenerativeAI(apiKey);


  const modelName =
    process.env.GEMINI_MODEL || "gemini-2.5-flash";


  console.log("Gemini model utilisé :", modelName);


  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: opts?.temperature ?? 0.4,
      maxOutputTokens: opts?.maxTokens ?? 700,
    },
  });


  const prompt = messages
    .map((m) => {
      return `${m.role}: ${m.content}`;
    })
    .join("\n");


  try {

    const result = await model.generateContent(prompt);

    return result.response.text();

  } catch (error) {

    console.error("Erreur Gemini :", error);

    throw error;
  }
}