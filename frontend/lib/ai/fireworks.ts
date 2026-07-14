import { askGemini } from "./gemini";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

function reponseMock(messages: readonly ChatMessage[]): string {
  const systemMsg = messages.find((m) => m.role === "system")?.content ?? "";
  const userMsg = messages.find((m) => m.role === "user")?.content ?? "";

  if (systemMsg.includes("JSON valide")) {
    const ids = [...userMsg.matchAll(/ID (\d+)/g)].map((m) => m[1]);
    const mockData: Record<string, string> = {};

    ids.forEach((id, i) => {
      mockData[id] = `[MOCK] Commentaire simulé n°${i + 1} en attendant l'activation de Gemini.`;
    });

    return JSON.stringify(mockData);
  }

  if (
    systemMsg.includes("portefeuille clients") ||
    systemMsg.includes("actions_prioritaires")
  ) {
    return JSON.stringify({
      resume:
        "Le portefeuille clients est globalement sain. Aucun client inactif détecté et aucun nouveau client sur les 30 derniers jours.",
      risques: [
        "Peu de nouveaux clients récemment."
      ],
      actions_prioritaires: [
        "Lancer une campagne de prospection.",
        "Relancer les anciens prospects.",
        "Planifier des rendez-vous commerciaux."
      ],
      opportunites: [
        "Développer les ventes croisées.",
        "Augmenter la fidélisation."
      ],
      confidence: 97
    });
  }

  if (systemMsg.includes("email de relance")) {
    return `[MOCK — réponse simulée]

Objet : Relance concernant votre facture

Bonjour,

Ceci est un email de démonstration généré en mode MOCK.

Lorsque GEMINI sera actif, ce texte sera généré automatiquement par l'IA.

Cordialement,
Votre équipe CRM`;
  }

  if (systemMsg.includes("diagnostic")) {
    return "[MOCK] Diagnostic simulé : ce client présente une activité normale.";
  }

  return "[MOCK] Réponse simulée. Activez Gemini pour obtenir une réponse réelle.";
}

export async function askGemma(
  messages: readonly ChatMessage[],
  opts?: {
    temperature?: number;
    maxTokens?: number;
  }
): Promise<string> {
  if (process.env.FIREWORKS_MODE === "mock") {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return reponseMock(messages);
  }

  try {
    return await askGemini(messages, opts);
  } catch (error) {
    console.error("Erreur Gemini :", error);

    return reponseMock(messages);
  }
}