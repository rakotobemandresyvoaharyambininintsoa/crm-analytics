import { NextResponse } from "next/server";
import { genererInsightsBruts, genererSyntheseIA } from "@/lib/ai/insights";
import { requireRole } from "@/lib/auth";

export async function GET() {
  try {
    await requireRole(["ADMIN", "COMMERCIAL", "MAGASINIER"]);

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
