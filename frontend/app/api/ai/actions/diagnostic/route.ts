import { NextResponse } from "next/server";
import { genererDiagnosticClient } from "@/lib/ai/actions";
import { requireRole } from "@/lib/auth";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    await requireRole(["ADMIN", "COMMERCIAL"]);

    const rateLimit = checkRateLimit(`ai:diagnostic:${getClientKey(req)}`, 15, 60_000, 2 * 60_000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Trop de requêtes. Réessayez plus tard." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds ?? 120) } }
      );
    }

    const { clientId } = await req.json();
    if (!clientId || typeof clientId !== "number") {
      return NextResponse.json({ error: "clientId manquant ou invalide." }, { status: 400 });
    }

    const diagnostic = await genererDiagnosticClient(clientId);
    return NextResponse.json({ diagnostic });
  } catch (error) {
    console.error("[AI Diagnostic] Erreur:", error);
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    const status = message === "UNAUTHORIZED" ? 401 : message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ error: "Impossible de générer le diagnostic." }, { status });
  }
}
