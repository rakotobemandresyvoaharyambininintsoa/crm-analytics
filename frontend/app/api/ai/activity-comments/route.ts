import { NextResponse } from "next/server";
import { genererCommentairesActivites } from "@/lib/ai/dashboard";
import { requireRole } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await requireRole(["ADMIN", "COMMERCIAL", "MAGASINIER"]);

    const { activites } = await req.json();
    if (!Array.isArray(activites)) {
      return NextResponse.json({ error: "Format invalide." }, { status: 400 });
    }

    const commentaires = await genererCommentairesActivites(activites);
    return NextResponse.json({ commentaires });
  } catch (error) {
    console.error("[AI Activity Comments] Erreur:", error);
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    const status = message === "UNAUTHORIZED" ? 401 : message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ error: "Impossible de générer les commentaires." }, { status });
  }
}
