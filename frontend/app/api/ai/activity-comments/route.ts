import { NextResponse } from "next/server";
import { genererCommentairesActivites } from "@/lib/ai/dashboard";
import { requireRole } from "@/lib/auth";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    await requireRole(["ADMIN", "COMMERCIAL", "MAGASINIER"]);

    const rateLimit = checkRateLimit(`ai:activity-comments:${getClientKey(req)}`, 20, 60_000, 2 * 60_000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Trop de requêtes IA. Réessayez plus tard." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds ?? 120) } }
      );
    }

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
