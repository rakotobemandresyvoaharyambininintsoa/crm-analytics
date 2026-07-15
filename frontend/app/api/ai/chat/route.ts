import { NextResponse } from "next/server";
import { repondreQuestionCRM } from "@/lib/ai/insights";
import { requireRole } from "@/lib/auth";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    await requireRole(["ADMIN", "COMMERCIAL", "MAGASINIER"]);

    // Limite plus stricte que les autres routes IA : texte libre = plus
    // facile a abuser en boucle et pas de valeur en cache derriere.
    const rateLimit = checkRateLimit(`ai:chat:${getClientKey(req)}`, 8, 60_000, 2 * 60_000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Trop de questions envoyées. Réessayez dans un instant." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds ?? 120) } }
      );
    }

    const { question } = await req.json();
    if (!question || typeof question !== "string" || question.trim().length === 0) {
      return NextResponse.json({ error: "Question manquante." }, { status: 400 });
    }
    if (question.length > 1000) {
      return NextResponse.json({ error: "Question trop longue (max 1000 caractères)." }, { status: 400 });
    }

    const reponse = await repondreQuestionCRM(question.trim());
    return NextResponse.json({ reponse });
  } catch (error) {
    console.error("[AI Chat] Erreur:", error);
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    const status = message === "UNAUTHORIZED" ? 401 : message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ error: "Impossible de répondre pour le moment." }, { status });
  }
}
