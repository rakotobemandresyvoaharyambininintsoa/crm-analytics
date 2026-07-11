import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function GET() {
  try {
    await requireRole(["ADMIN", "COMMERCIAL", "MAGASINIER"]);
  } catch {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const ca = await prisma.facture.aggregate({
    _sum: { montant: true },
    where: { statut: "Payée" },
  });

  const clients = await prisma.client.findMany({
    include: { factures: true },
  });

  const topClients = clients
    .map((c) => ({
      nom: c.nom,
      ca: c.factures.reduce((a, b) => a + b.montant, 0),
    }))
    .sort((a, b) => b.ca - a.ca)
    .slice(0, 5);

  const produits = await prisma.produit.findMany({
    orderBy: { quantite: "asc" },
  });

  return NextResponse.json({
    chiffreAffaires: ca._sum.montant || 0,
    topClients,
    produits,
  });
}
