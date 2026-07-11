import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

// GET /api/inventaires — liste toutes les sessions
export async function GET() {
  try {
    await requireRole(["ADMIN", "MAGASINIER"]);
  } catch {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  try {
    const sessions = await prisma.inventaireSession.findMany({
      include: {
        entrepot: true,
        responsable: true,
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des sessions" },
      { status: 500 }
    );
  }
}

// POST /api/inventaires — crée une nouvelle session (voir inventaire/nouveau)
export async function POST(req: Request) {
  try {
    await requireRole(["ADMIN", "MAGASINIER"]);
  } catch {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  try {
    const body = await req.json();

    if (!body.nom) {
      return NextResponse.json(
        { error: "Le nom de la session est obligatoire" },
        { status: 400 }
      );
    }

    const session = await prisma.inventaireSession.create({
      data: {
        nom: body.nom,
        reference: body.reference || null,
        date: body.date ? new Date(body.date) : new Date(),
        heure: body.heure || null,
        entrepotId: body.entrepotId ? Number(body.entrepotId) : null,
        zone: body.zone || null,
        responsableId: body.responsableId ? Number(body.responsableId) : null,
        equipe: body.equipe || null,
        commentaire: body.commentaire || null,
        doubleComptage: !!body.doubleComptage,
        statut: "BROUILLON",
      },
    });

    // Génère automatiquement une ligne de comptage pour chaque produit du catalogue
    const produits = await prisma.produit.findMany();

    if (produits.length > 0) {
      await prisma.inventaireLigne.createMany({
        data: produits.map((p) => ({
          sessionId: session.id,
          produitId: p.id,
          stockSysteme: p.quantite,
        })),
      });
    }

    await prisma.inventaireAudit.create({
      data: {
        sessionId: session.id,
        action: "CREATION_SESSION",
        nouvelleValeur: session.nom,
      },
    });

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la session" },
      { status: 500 }
    );
  }
}
