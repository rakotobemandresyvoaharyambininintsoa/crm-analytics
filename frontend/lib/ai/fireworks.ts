export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

async function askFireworks(
  messages: readonly ChatMessage[],
  opts?: {
    temperature?: number;
    maxTokens?: number;
  }
): Promise<string> {
  const apiKey = process.env.FIREWORKS_API_KEY;

  if (!apiKey) {
    throw new Error("FIREWORKS_API_KEY manquante dans .env.local");
  }

  const model =
    process.env.FIREWORKS_MODEL ||
    "accounts/fireworks/models/llama-v3p3-70b-instruct";

  const response = await fetch(
    "https://api.fireworks.ai/inference/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: opts?.temperature ?? 0.4,
        max_tokens: opts?.maxTokens ?? 700,
      }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Erreur Fireworks (${response.status}): ${errorBody}`
    );
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}

function reponseMock(messages: readonly ChatMessage[]): string {
  const systemMsg = messages.find((m) => m.role === "system")?.content ?? "";
  const userMsg = messages.find((m) => m.role === "user")?.content ?? "";

  if (systemMsg.includes("JSON valide")) {
    const ids = [...userMsg.matchAll(/ID (\d+)/g)].map((m) => m[1]);
    const mockData: Record<string, string> = {};

    ids.forEach((id, i) => {
      mockData[id] = `[MOCK] Commentaire simulé n°${i + 1} en attendant l'activation de Fireworks.`;
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

Lorsque Fireworks sera actif, ce texte sera généré automatiquement par l'IA.

Cordialement,
Votre équipe CRM`;
  }

  if (systemMsg.includes("diagnostic")) {
    return "[MOCK] Diagnostic simulé : ce client présente une activité normale.";
  }

  return "[MOCK] Réponse simulée. Activez Fireworks pour obtenir une réponse réelle.";
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
    return await askFireworks(messages, opts);
  } catch (error) {
    console.error("Erreur Fireworks :", error);

    return reponseMock(messages);
  }
}