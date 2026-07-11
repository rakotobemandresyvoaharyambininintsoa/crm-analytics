import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/inventaires/parametres — récupère les paramètres (singleton)
export async function GET() {
  try {
    let params = await prisma.inventaireParametres.findFirst();

    if (!params) {
      params = await prisma.inventaireParametres.create({ data: {} });
    }

    return NextResponse.json(params);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des paramètres" },
      { status: 500 }
    );
  }
}

// PUT /api/inventaires/parametres — met à jour les paramètres
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    let params = await prisma.inventaireParametres.findFirst();

    const data = {
      frequence: body.frequence,
      doubleComptage: !!body.doubleComptage,
      toleranceEcart: Number(body.toleranceEcart) || 0,
      validationObligatoire: !!body.validationObligatoire,
      signatureObligatoire: !!body.signatureObligatoire,
      notifications: !!body.notifications,
      rappelsAutomatiques: !!body.rappelsAutomatiques,
    };

    if (!params) {
      params = await prisma.inventaireParametres.create({ data });
    } else {
      params = await prisma.inventaireParametres.update({
        where: { id: params.id },
        data,
      });
    }

    return NextResponse.json(params);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement des paramètres" },
      { status: 500 }
    );
  }
}
