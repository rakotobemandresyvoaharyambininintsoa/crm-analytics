import { NextResponse } from "next/server";
import { analyserSituationFinanciere } from "@/lib/ai/factures";
import { requireRole } from "@/lib/auth";

export async function GET() {
  try {
    await requireRole(["ADMIN", "COMMERCIAL", "MAGASINIER"]);

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

