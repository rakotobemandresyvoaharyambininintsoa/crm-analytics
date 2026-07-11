import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/inventaires/audit — journal d'audit complet
export async function GET() {
  try {
    const logs = await prisma.inventaireAudit.findMany({
      include: { utilisateur: true, session: true },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors du chargement de l'audit" },
      { status: 500 }
    );
  }
}
