
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";



// =========================
// GET : Un client
// =========================

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(["ADMIN", "COMMERCIAL"]);
  } catch {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  try {

    const client =
      await prisma.client.findUnique({

        where: {
          id: Number(params.id)
        },

        include: {

          factures: true,

          opportunites: true

        }

      });

    if (!client) {

      return NextResponse.json(
        {
          error: "Client introuvable"
        },
        {
          status: 404
        }
      );

    }

    return NextResponse.json(client);

  } catch {

    return NextResponse.json(
      {
        error: "Erreur serveur"
      },
      {
        status: 500
      }
    );

  }

}



// =========================
// PUT : Modifier
// =========================

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(["ADMIN", "COMMERCIAL"]);
  } catch {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  try {

    const body =
      await request.json();

    const client =
      await prisma.client.update({

        where: {
          id: Number(params.id)
        },

        data: {

          nom: body.nom,

          entreprise: body.entreprise,

          email: body.email,

          telephone: body.telephone,

          adresse: body.adresse,

          ville: body.ville,

          pays: body.pays,

          notes: body.notes

        }

      });

    return NextResponse.json(client);

  } catch {

    return NextResponse.json(
      {
        error: "Impossible de modifier ce client"
      },
      {
        status: 500
      }
    );

  }

}



// =========================
// DELETE : Supprimer
// =========================

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(["ADMIN"]);
  } catch {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  try {

    await prisma.client.delete({

      where: {
        id: Number(params.id)
      }

    });

    return NextResponse.json({

      success: true

    });

  } catch {

    return NextResponse.json(
      {
        error: "Suppression impossible"
      },
      {
        status: 500
      }
    );

  }

}

