import { NextResponse } from "next/server";
import { analyserRisquePaiement } from "@/lib/ai/factures";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ✅ CORRIGÉ : GET ne fait plus que de la LECTURE (analyse de risque).
// La génération d'email de relance reste une action volontaire, déclenchée
// par le bouton "Relance IA" dans FactureTable (qui appelle déjà
// /api/ai/actions/relance — pas besoin d'un 3e endpoint pour ça).
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(["ADMIN", "COMMERCIAL", "MAGASINIER"]);

    const { id } = await context.params;
    const factureId = Number(id);

    if (Number.isNaN(factureId)) {
      return NextResponse.json({ error: "ID facture invalide" }, { status: 400 });
    }

    // ✅ Garde-fou : pas d'analyse de risque de paiement pertinente
    // sur une facture déjà payée ou annulée.
    const facture = await prisma.facture.findUnique({
      where: { id: factureId },
      select: { statut: true },
    });

    if (!facture) {
      return NextResponse.json({ error: "Facture introuvable" }, { status: 404 });
    }

    if (["Payée", "Annulée"].includes(facture.statut)) {
      return NextResponse.json({
        factureId,
        risquePaiement: null,
        message: `Facture au statut "${facture.statut}" — aucune analyse de risque nécessaire.`,
      });
    }

    const risquePaiement = await analyserRisquePaiement(factureId);

    return NextResponse.json({ factureId, risquePaiement });
  } catch (error) {
    console.error("[AI Facture Detail]", error);

    const message = error instanceof Error ? error.message : "Erreur inconnue";
    const status = message === "UNAUTHORIZED" ? 401 : message === "FORBIDDEN" ? 403 : 500;

    // Message générique côté client — le détail technique reste dans les logs serveur
    return NextResponse.json(
      { error: "Impossible d'analyser cette facture pour le moment." },
      { status }
    );
  }
}