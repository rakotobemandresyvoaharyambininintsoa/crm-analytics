import { NextResponse } from "next/server";
import { analyserRisquePaiement } from "@/lib/ai/factures";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(["ADMIN", "COMMERCIAL", "MAGASINIER"]);

    const rateLimit = checkRateLimit(`ai:facture-detail:${getClientKey(request)}`, 40, 60_000, 2 * 60_000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Trop de requêtes. Réessayez plus tard." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds ?? 120) } }
      );
    }

    const { id } = await context.params;
    const factureId = Number(id);

    if (Number.isNaN(factureId)) {
      return NextResponse.json({ error: "ID facture invalide" }, { status: 400 });
    }

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

    return NextResponse.json(
      { error: "Impossible d'analyser cette facture pour le moment." },
      { status }
    );
  }
}