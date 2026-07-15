import { NextResponse } from "next/server";
import { genererEmailRelance } from "@/lib/ai/actions";
import { requireRole } from "@/lib/auth";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    await requireRole(["ADMIN", "COMMERCIAL"]);

    const rateLimit = checkRateLimit(`ai:relance:${getClientKey(req)}`, 15, 60_000, 2 * 60_000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Trop de requêtes. Réessayez plus tard." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds ?? 120) } }
      );
    }

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
