import { NextResponse } from "next/server";
import {
  calculerClientHealthScore,
  recupererClientsInactifs,
  compterNouveauxClients,
  recupererTopClients,
  genererAnalyseClientsIA,
} from "@/lib/ai/clients";
import { requireRole } from "@/lib/auth";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";

export async function GET(request: Request) {
  try {
    await requireRole(["ADMIN", "COMMERCIAL"]);

    const rateLimit = checkRateLimit(`ai:clients:${getClientKey(request)}`, 20, 60_000, 2 * 60_000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: { code: "TOO_MANY_REQUESTS", message: "Trop de requêtes. Réessayez plus tard." } },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds ?? 120) } }
      );
    }

    const [score, clientsInactifs, nouveauxClients, topClients, analyseIA] =
      await Promise.all([
        calculerClientHealthScore(),
        recupererClientsInactifs(),
        compterNouveauxClients(),
        recupererTopClients(),
        genererAnalyseClientsIA(),
      ]);

    return NextResponse.json(
      {
        score,
        clientsInactifs: clientsInactifs.map((client) => ({
          id: client.id,
          nom: client.nom,
          entreprise: client.entreprise,
          email: client.email,
        })),
        nombreClientsInactifs: clientsInactifs.length,
        nouveauxClients,
        topClients,
        analyseIA,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[AI Clients] Erreur:", error);

    const message = error instanceof Error ? error.message : "Erreur inconnue";
    const status =
      message === "UNAUTHORIZED" ? 401 : message === "FORBIDDEN" ? 403 : 500;

    return NextResponse.json(
      {
        error: {
          code:
            status === 401
              ? "UNAUTHORIZED"
              : status === 403
                ? "FORBIDDEN"
                : "INTERNAL_SERVER_ERROR",
          message: "Impossible de charger l'analyse clients IA.",
        },
      },
      { status }
    );
  }
}
