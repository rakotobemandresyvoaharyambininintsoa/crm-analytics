import { NextResponse } from "next/server";
import { genererDiagnosticClient } from "@/lib/ai/actions";
import { requireRole } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await requireRole(["ADMIN", "COMMERCIAL"]);

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
