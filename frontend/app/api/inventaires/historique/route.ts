import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/inventaires/historique — toutes les sessions avec compteurs
export async function GET() {
  try {
    const sessions = await prisma.inventaireSession.findMany({
      include: {
        entrepot: true,
        responsable: true,
        _count: { select: { lignes: true } },
      },
      orderBy: { date: "desc" },
    });

    const result = await Promise.all(
      sessions.map(async (s) => {
        const nbEcarts = await prisma.inventaireLigne.count({
          where: { sessionId: s.id, NOT: { ecart: 0 }, ecart: { not: null } },
        });

        return {
          id: s.id,
          nom: s.nom,
          entrepot: s.entrepot,
          responsable: s.responsable,
          date: s.date,
          statut: s.statut,
          nbProduits: s._count.lignes,
          nbEcarts,
        };
      })
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors du chargement de l'historique" },
      { status: 500 }
    );
  }
}
