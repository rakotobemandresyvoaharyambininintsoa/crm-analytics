import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/entrepots — liste des entrepôts/magasins (pour le formulaire de session)
export async function GET() {
  try {
    const entrepots = await prisma.entrepot.findMany({
      orderBy: { nom: "asc" },
    });

    return NextResponse.json(entrepots);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des entrepôts" },
      { status: 500 }
    );
  }
}

// POST /api/entrepots — créer un entrepôt (utile pour tes Paramètres)
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.nom) {
      return NextResponse.json(
        { error: "Le nom de l'entrepôt est obligatoire" },
        { status: 400 }
      );
    }

    const entrepot = await prisma.entrepot.create({
      data: { nom: body.nom, adresse: body.adresse || null },
    });

    return NextResponse.json(entrepot, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'entrepôt" },
      { status: 500 }
    );
  }
}
