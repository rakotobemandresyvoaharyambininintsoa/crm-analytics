import { NextResponse } from "next/server";
import { analyserSituationFinanciere } from "@/lib/ai/factures";
import { requireRole } from "@/lib/auth";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";

export async function GET(request: Request) {
  try {
    await requireRole(["ADMIN", "COMMERCIAL", "MAGASINIER"]);

    const rateLimit = checkRateLimit(`ai:factures:${getClientKey(request)}`, 20, 60_000, 2 * 60_000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: { code: "TOO_MANY_REQUESTS", message: "Trop de requêtes. Réessayez plus tard." } },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds ?? 120) } }
      );
    }

    const analyseFinance = await analyserSituationFinanciere();

    return NextResponse.json({ analyseFinance }, { status: 200 });
  } catch (error) {
    console.error("[AI Factures] Erreur:", error);

    const message = error instanceof Error ? error.message : "Erreur inconnue";
    const status = message === "UNAUTHORIZED" ? 401 : message === "FORBIDDEN" ? 403 : 500;

    return NextResponse.json(
      {
        error: {
          code: status === 401 ? "UNAUTHORIZED" : status === 403 ? "FORBIDDEN" : "INTERNAL_SERVER_ERROR",
          message: "Impossible de générer l'analyse IA des factures.",
        },
      },
      { status }
    );
  }
}

