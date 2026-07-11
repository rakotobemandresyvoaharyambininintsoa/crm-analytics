import { NextResponse } from "next/server";
import { genererEmailRelance } from "@/lib/ai/actions";
import { requireRole } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await requireRole(["ADMIN", "COMMERCIAL"]);

    const { factureId } = await req.json();
    if (!factureId || typeof factureId !== "number") {
      return NextResponse.json({ error: "factureId manquant ou invalide." }, { status: 400 });
    }

    const email = await genererEmailRelance(factureId);
    return NextResponse.json({ email });
  } catch (error) {
    console.error("[AI Relance] Erreur:", error);
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    const status = message === "UNAUTHORIZED" ? 401 : message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ error: "Impossible de générer l'email." }, { status });
  }
}
