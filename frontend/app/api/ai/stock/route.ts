import { NextResponse } from "next/server";
import {
  calculerStockHealthScore,
  recupererProduitsCritiques,
  recupererProduitsDormants,
  calculerValeurStock,
  genererAnalyseStockIA,
} from "@/lib/ai/stock";
import { requireRole } from "@/lib/auth";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";

export async function GET(request: Request) {
  try {
    await requireRole(["ADMIN", "COMMERCIAL", "MAGASINIER"]);

    const rateLimit = checkRateLimit(`ai:stock:${getClientKey(request)}`, 20, 60_000, 2 * 60_000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "Trop de requêtes. Réessayez plus tard." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds ?? 120) } }
      );
    }

    const [healthScore, produitsCritiques, produitsDormants, valeurStock, analyse] =
      await Promise.all([
        calculerStockHealthScore(),
        recupererProduitsCritiques(),
        recupererProduitsDormants(),
        calculerValeurStock(),
        genererAnalyseStockIA(),
      ]);

    return NextResponse.json({
      success: true,
      healthScore,
      produitsCritiques,
      produitsDormants,
      valeurStock,
      analyse,
    });
  } catch (error) {
    console.error("[AI Stock]", error);

    const message = error instanceof Error ? error.message : "Erreur inconnue";
    const status =
      message === "UNAUTHORIZED" ? 401 : message === "FORBIDDEN" ? 403 : 500;

    return NextResponse.json(
      {
        success: false,
        error: "Impossible de générer l'analyse du stock.",
      },
      { status }
    );
  }
}
