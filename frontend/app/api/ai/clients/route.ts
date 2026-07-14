import { NextResponse } from "next/server";
import {
  calculerClientHealthScore,
  recupererClientsInactifs,
  compterNouveauxClients,
  recupererTopClients,
  genererAnalyseClientsIA,
} from "@/lib/ai/clients";
import { requireRole } from "@/lib/auth";

export async function GET() {
  try {
    await requireRole(["ADMIN", "COMMERCIAL"]);

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
