import { askGemini } from "./gemini";
import { askGemma } from "./fireworks";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};


export async function askAI(
  messages: readonly ChatMessage[],
  opts?: {
    temperature?: number;
    maxTokens?: number;
  }
): Promise<string> {

  const provider = process.env.AI_PROVIDER || "gemini";


  switch (provider) {

    case "gemini":
      return askGemini(messages, opts);


    case "fireworks":
      return askGemma(messages, opts);


    default:
      throw new Error(
        `AI_PROVIDER inconnu: ${provider}`
      );
  }
}
