import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/inventaires/rapports — rapports d'analyse (pertes, gains, précision...)
export async function GET() {
  try {
    const lignes = await prisma.inventaireLigne.findMany({
      where: { stockCompte: { not: null } },
      include: {
        session: { include: { responsable: true } },
      },
    });

    const pertes = lignes.filter((l) => (l.ecart ?? 0) < 0);
    const gains = lignes.filter((l) => (l.ecart ?? 0) > 0);
    const conformes = lignes.filter((l) => (l.ecart ?? 0) === 0);

    const valeurPertes = pertes.reduce(
      (acc, l) => acc + Math.abs(l.valeurEcart ?? 0),
      0
    );
    const valeurGains = gains.reduce(
      (acc, l) => acc + (l.valeurEcart ?? 0),
      0
    );

    const tauxPrecision = lignes.length
      ? Math.round((conformes.length / lignes.length) * 100)
      : 100;

    // Évolution mensuelle
    const evolutionMap = new Map<string, number>();
    lignes.forEach((l) => {
      if (!l.ecart) return;
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

    const repartitionEcarts = [
      { label: "Pertes", valeur: pertes.length },
      { label: "Gains", valeur: gains.length },
      { label: "Conformes", valeur: conformes.length },
    ];

    // Performance par responsable
    const parResponsable = new Map<string, { total: number; ok: number }>();
    lignes.forEach((l) => {
      const nom = l.session?.responsable?.nom || "Non assigné";
      const entry = parResponsable.get(nom) || { total: 0, ok: 0 };
      entry.total += 1;
      if ((l.ecart ?? 0) === 0) entry.ok += 1;
      parResponsable.set(nom, entry);
    });

    const performanceEquipes = Array.from(parResponsable.entries()).map(
      ([nom, v]) => ({
        nom,
        precision: v.total ? Math.round((v.ok / v.total) * 100) : 100,
      })
    );

    return NextResponse.json({
      valeurPertes,
      valeurGains,
      tauxPrecision,
      evolution,
      repartitionEcarts,
      performanceEquipes,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des rapports" },
      { status: 500 }
    );
  }
}
