import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/inventaires/[id]/validation — verrouille la session et génère les ajustements
// body: { signature }
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = Number(params.id);
    const body = await req.json();

    if (!body.signature) {
      return NextResponse.json(
        { error: "La signature est obligatoire" },
        { status: 400 }
      );
    }

    const session = await prisma.inventaireSession.findUnique({
      where: { id: sessionId },
      include: { lignes: true },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Session introuvable" },
        { status: 404 }
      );
    }

    if (session.statut === "VALIDE") {
      return NextResponse.json(
        { error: "Cette session est déjà validée" },
        { status: 400 }
      );
    }

    const lignesAvecEcart = session.lignes.filter(
      (l) => l.ecart && l.ecart !== 0
    );

    // Génère les ajustements + met à jour le stock réel + trace l'audit
    for (const l of lignesAvecEcart) {
      const produit = await prisma.produit.findUnique({
        where: { id: l.produitId },
      });

      if (!produit) continue;

      const nouveauStock = l.stockCompte ?? produit.quantite;

      await prisma.inventaireAjustement.create({
        data: {
          sessionId,
          produitId: l.produitId,
          quantite: l.ecart!,
          ancienStock: produit.quantite,
          nouveauStock,
          motif: "Ajustement suite inventaire",
          responsableId: session.responsableId,
        },
      });

      await prisma.produit.update({
        where: { id: l.produitId },
        data: { quantite: nouveauStock },
      });

      await prisma.inventaireAudit.create({
        data: {
          sessionId,
          utilisateurId: session.responsableId,
          action: "AJUSTEMENT_STOCK",
          ancienneValeur: String(produit.quantite),
          nouvelleValeur: String(nouveauStock),
        },
      });
    }

    const sessionValidee = await prisma.inventaireSession.update({
      where: { id: sessionId },
      data: {
        statut: "VALIDE",
        signature: body.signature,
        valideLe: new Date(),
        valideParId: session.responsableId,
      },
    });

    await prisma.inventaireAudit.create({
      data: {
        sessionId,
        utilisateurId: session.responsableId,
        action: "VALIDATION_SESSION",
        nouvelleValeur: "VALIDE",
        justification: body.signature,
      },
    });

    return NextResponse.json(sessionValidee);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la validation" },
      { status: 500 }
    );
  }
}
