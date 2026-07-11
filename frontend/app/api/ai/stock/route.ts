import { NextResponse } from "next/server";
import {
  calculerStockHealthScore,
  recupererProduitsCritiques,
  recupererProduitsDormants,
  calculerValeurStock,
  genererAnalyseStockIA,
} from "@/lib/ai/stock";
import { requireRole } from "@/lib/auth";

export async function GET() {
  try {
    await requireRole(["ADMIN", "COMMERCIAL", "MAGASINIER"]);

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