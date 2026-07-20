import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

// GET /api/inventaires/[id]/lignes — lignes de comptage pour l'écran de comptage
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(["ADMIN", "MAGASINIER"]);
  } catch {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const lignes = await prisma.inventaireLigne.findMany({
      where: { sessionId: Number(id) },
      include: { produit: true },
      orderBy: { id: "asc" },
    });

    const result = lignes.map((l) => ({
      id: l.id,
      nom: l.produit.nom,
      reference: (l.produit as any).reference ?? "-",
      emplacement: (l.produit as any).emplacement ?? null,
      codeBarre: (l.produit as any).codeBarre ?? null,
      stockSysteme: l.stockSysteme,
      stockCompte: l.stockCompte,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des lignes" },
      { status: 500 }
    );
  }
}

// PUT /api/inventaires/[id]/lignes — enregistre les quantités comptées
// body: { lignes: [{ ligneId, stockCompte, commentaire }] }
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(["ADMIN", "MAGASINIER"]);
  } catch {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id } = await params;
    const sessionId = Number(id);

    for (const l of body.lignes || []) {
      const ligne = await prisma.inventaireLigne.findUnique({
        where: { id: l.ligneId },
      });

      if (!ligne) continue;

      const produit = await prisma.produit.findUnique({
        where: { id: ligne.produitId },
      });

      const ecart = l.stockCompte - ligne.stockSysteme;
      const valeurEcart = produit ? ecart * (produit as any).prixVente : 0;

      await prisma.inventaireLigne.update({
        where: { id: l.ligneId },
        data: {
          stockCompte: l.stockCompte,
          ecart,
          valeurEcart,
          commentaire: l.commentaire || null,
        },
      });

      await prisma.inventaireComptage.create({
        data: {
          ligneId: l.ligneId,
          numero: 1,
          quantite: l.stockCompte,
        },
      });
    }

    // Passe la session en "En cours" si elle était en Brouillon
    await prisma.inventaireSession.updateMany({
      where: { id: sessionId, statut: "BROUILLON" },
      data: { statut: "EN_COURS" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement du comptage" },
      { status: 500 }
    );
  }
}
