const FIREWORKS_API_URL =
  "https://api.fireworks.ai/inference/v1/chat/completions";

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
      mockData[id] = `[MOCK] Commentaire simulé n°${i + 1} en attendant les crédits Fireworks.`;
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
    return `[MOCK — réponse simulée, crédits Fireworks non actifs]

Objet : Relance concernant votre facture

Bonjour,

Ceci est un email de relance simulé généré en mode test, en attendant que vos crédits Fireworks AI soient actifs. Une fois vos crédits confirmés, ce texte sera remplacé par une vraie génération Gemma personnalisée.

Cordialement,
[Votre nom]`;
  }

  if (systemMsg.includes("diagnostic")) {
    return "[MOCK] Diagnostic simulé : ce client présente une activité normale. Ceci est une réponse de test — activez vos crédits Fireworks pour un vrai diagnostic généré par Gemma.";
  }

  return "[MOCK] Ceci est une réponse simulée générée localement car FIREWORKS_MODE=mock est actif dans votre .env.local (crédits Fireworks pas encore disponibles). Retirez cette variable une fois vos crédits confirmés pour obtenir de vraies réponses de Gemma.";
}

export async function askGemma(
  messages: readonly ChatMessage[],
  opts?: { temperature?: number; maxTokens?: number }
): Promise<string> {
  if (process.env.FIREWORKS_MODE === "mock") {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return reponseMock(messages);
  }

  const apiKey = process.env.FIREWORKS_API_KEY;
  const model =
    process.env.FIREWORKS_MODEL ||
    "accounts/fireworks/models/gemma-4-31b-it";

  if (!apiKey) {
    throw new Error("FIREWORKS_API_KEY manquante. Ajoutez-la dans .env.local");
  }

  const res = await fetch(FIREWORKS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: opts?.temperature ?? 0.4,
      max_tokens: opts?.maxTokens ?? 700,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erreur Fireworks API (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}