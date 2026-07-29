export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

/**
 * Cache court en mémoire pour éviter de repayer un appel Fireworks
 * identique (ex: dashboard rechargé plusieurs fois en quelques minutes).
 * Limitation: par process, pas partagé entre plusieurs instances —
 * suffisant ici car l'app tourne en un seul process (voir rate-limit.ts).
 */
type CacheEntry = { value: string; expiresAt: number };
const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 3 * 60_000; // 3 minutes

function cacheKey(messages: readonly ChatMessage[]): string {
  return JSON.stringify(messages);
}

setInterval(
  () => {
    const now = Date.now();
    for (const [key, entry] of cache.entries()) {
      if (entry.expiresAt <= now) cache.delete(key);
    }
  },
  10 * 60_000
).unref?.();

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

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25_000);

  let response: Response;
  try {
    response = await fetch(
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
        signal: controller.signal,
      }
    );
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("Timeout: Fireworks n'a pas repondu en 25s.");
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }

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
  const { text } = await askGemmaSafe(messages, opts);
  return text;
}

/**
 * Same behaviour as askGemma, but also reports whether the response is a
 * genuine model output or a silent fallback caused by a real API failure
 * (as opposed to intentional FIREWORKS_MODE=mock).
 *
 * Why this matters: on error, we still want the app to keep working (a
 * flaky AI provider shouldn't take down a whole dashboard), but silently
 * returning mock-looking text as if it were real is exactly the kind of
 * "fake AI" inconsistency this project was audited for once already.
 * Call sites that surface AI output prominently to the user (e.g. the
 * executive summary) should use this and display a visible notice when
 * `degraded` is true. Lower-visibility call sites can keep using the
 * plain `askGemma(...)` string wrapper unchanged.
 */
export async function askGemmaSafe(
  messages: readonly ChatMessage[],
  opts?: {
    temperature?: number;
    maxTokens?: number;
  }
): Promise<{ text: string; degraded: boolean }> {
  if (process.env.FIREWORKS_MODE === "mock") {
    await new Promise((resolve) => setTimeout(resolve, 600));
    // Intentional mock mode (e.g. local dev without an API key) is not
    // "degraded" — it's the expected, documented behaviour.
    return { text: reponseMock(messages), degraded: false };
  }

  const key = cacheKey(messages);
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return { text: cached.value, degraded: false };
  }

  try {
    const result = await askFireworks(messages, opts);
    cache.set(key, { value: result, expiresAt: Date.now() + CACHE_TTL_MS });
    return { text: result, degraded: false };
  } catch (error) {
    console.error("Erreur Fireworks :", error);
    return { text: reponseMock(messages), degraded: true };
  }
}