import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

// GET /api/inventaires/dashboard — statistiques du tableau de bord
export async function GET() {
  try {
    await requireRole(["ADMIN", "MAGASINIER"]);
  } catch {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  try {
    const [enCours, termines, dernierInventaire, sessions] = await Promise.all([
      prisma.inventaireSession.count({ where: { statut: "EN_COURS" } }),
      prisma.inventaireSession.count({ where: { statut: "VALIDE" } }),
      prisma.inventaireSession.findFirst({
        orderBy: { date: "desc" },
        include: { responsable: true },
      }),
      prisma.inventaireSession.findMany({
        take: 8,
        orderBy: { date: "desc" },
        include: { entrepot: true, responsable: true },
      }),
    ]);

    const lignes = await prisma.inventaireLigne.findMany({
      where: { stockCompte: { not: null } },
    });

    const produitsControles = lignes.length;
    const lignesEcart = lignes.filter((l) => (l.ecart ?? 0) !== 0);
    const produitsEcarts = lignesEcart.length;
    const valeurEcarts = lignesEcart.reduce(
      (acc, l) => acc + Math.abs(l.valeurEcart ?? 0),
      0
    );

    // Évolution mensuelle des écarts (6 derniers mois)
    const evolutionMap = new Map<string, number>();

    lignesEcart.forEach((l) => {
      const mois = new Date(l.updatedAt).toLocaleDateString("fr-FR", {
        month: "short",
      });
      evolutionMap.set(
        mois,
        (evolutionMap.get(mois) || 0) + Math.abs(l.valeurEcart ?? 0)
      );
    });

    const evolution = Array.from(evolutionMap.entries()).map(
      ([mois, ecart]) => ({ mois, ecart })
    );

    return NextResponse.json({
      enCours,
      termines,
      produitsControles,
      produitsEcarts,
      valeurEcarts,
      dernierInventaire,
      evolution,
      sessions,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors du chargement du dashboard" },
      { status: 500 }
    );
  }
}
