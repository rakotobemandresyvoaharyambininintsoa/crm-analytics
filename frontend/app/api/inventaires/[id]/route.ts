import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/inventaires/[id] — détail d'une session avec ses lignes
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await prisma.inventaireSession.findUnique({
      where: { id: Number(params.id) },
      include: {
        entrepot: true,
        responsable: true,
        lignes: {
          include: { produit: true },
          orderBy: { id: "asc" },
        },
      },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Session introuvable" },
        { status: 404 }
      );
    }

    const lignes = session.lignes.map((l) => ({
      id: l.id,
      nom: l.produit.nom,
      reference: (l.produit as any).reference ?? null,
      emplacement: (l.produit as any).emplacement ?? null,
      codeBarre: (l.produit as any).codeBarre ?? null,
      stockSysteme: l.stockSysteme,
      stockCompte: l.stockCompte,
      ecart: l.ecart,
      valeurEcart: l.valeurEcart,
      commentaire: l.commentaire,
    }));

    const valeurEcarts = lignes.reduce(
      (acc, l) => acc + Math.abs(l.valeurEcart ?? 0),
      0
    );

    return NextResponse.json({ ...session, lignes, valeurEcarts });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors du chargement de la session" },
      { status: 500 }
    );
  }
}
