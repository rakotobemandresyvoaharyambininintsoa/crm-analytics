import { NextResponse } from "next/server";
import { genererInsightsBruts, genererSyntheseIA } from "@/lib/ai/insights";
import { requireRole } from "@/lib/auth";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";

export async function GET(request: Request) {
  try {
    await requireRole(["ADMIN", "COMMERCIAL", "MAGASINIER"]);

    const rateLimit = checkRateLimit(`ai:insights:${getClientKey(request)}`, 20, 60_000, 2 * 60_000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Trop de requêtes. Réessayez plus tard." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds ?? 120) } }
      );
    }

    const insights = await genererInsightsBruts();
    const synthese = await genererSyntheseIA(insights);

    return NextResponse.json({ insights, synthese });
  } catch (error) {
    console.error("[AI Insights] Erreur:", error);
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    const status = message === "UNAUTHORIZED" ? 401 : message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ error: "Impossible de générer les insights." }, { status });
  }
}
