import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

/**
 * Dashboard KPI endpoint.
 *
 * IMPORTANT: every number returned here MUST be derived from real data.
 * Earlier versions of this route shipped hardcoded "evolution: 12",
 * "objectifCA: 10000000" and "prediction = montant * 1.12" values labelled
 * as AI output. None of that was real — it looked identical to the genuine
 * reasoning produced by lib/ai/insights.ts, which broke user trust once
 * compared side by side. Everything below is computed from Prisma data.
 */

const debutMoisCourant = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
};

const debutMoisPrecedent = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth() - 1, 1);
};

/** Évolution en % entre deux valeurs, sans jamais renvoyer Infinity/NaN. */
function evolutionPct(actuel: number, precedent: number): number {
  if (precedent <= 0) return actuel > 0 ? 100 : 0;
  return Math.round(((actuel - precedent) / precedent) * 100);
}

export async function GET() {
  try {
    await requireRole(["ADMIN", "COMMERCIAL", "MAGASINIER"]);
  } catch {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  try {
    const debutMois = debutMoisCourant();
    const debutMoisPrec = debutMoisPrecedent();

    const [
      clients,
      clientsCeMois,
      clientsMoisDernier,
      produits,
      opportunites,
      opportunitesCeMois,
      opportunitesMoisDernier,
      factures,
      facturesCeMois,
      facturesMoisDernier,
      activites,
      produitsStock,
      facturesRecentes,
      facturesHistorique,
      lignesProduits,
      lignesProduitsMoisDernier,
      mouvementsCeMois,
      mouvementsMoisDernier,
    ] = await Promise.all([
      prisma.client.count(),
      prisma.client.count({ where: { createdAt: { gte: debutMois } } }),
      prisma.client.count({
        where: { createdAt: { gte: debutMoisPrec, lt: debutMois } },
      }),
      prisma.produit.count(),
      prisma.opportunite.count(),
      prisma.opportunite.count({ where: { createdAt: { gte: debutMois } } }),
      prisma.opportunite.count({
        where: { createdAt: { gte: debutMoisPrec, lt: debutMois } },
      }),
      prisma.facture.count(),
      prisma.facture.aggregate({
        where: { createdAt: { gte: debutMois } },
        _sum: { montant: true },
      }),
      prisma.facture.aggregate({
        where: { createdAt: { gte: debutMoisPrec, lt: debutMois } },
        _sum: { montant: true },
      }),
      prisma.activite.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { client: true },
      }),
      prisma.produit.findMany(),
      prisma.facture.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { client: true },
      }),
      // 6 derniers mois, pour calculer une tendance réelle (pas une constante).
      prisma.facture.findMany({
        where: {
          createdAt: {
            gte: new Date(
              debutMois.getFullYear(),
              debutMois.getMonth() - 5,
              1
            ),
          },
        },
        select: { montant: true, createdAt: true },
      }),
      prisma.factureLigne.findMany({
        where: { facture: { createdAt: { gte: debutMois } } },
        include: { produit: true },
      }),
      prisma.factureLigne.findMany({
        where: {
          facture: { createdAt: { gte: debutMoisPrec, lt: debutMois } },
        },
      }),
      prisma.mouvement.aggregate({
        where: { createdAt: { gte: debutMois } },
        _sum: { quantite: true },
      }),
      prisma.mouvement.aggregate({
        where: { createdAt: { gte: debutMoisPrec, lt: debutMois } },
        _sum: { quantite: true },
      }),
    ]);

    // ============================
    // STOCK
    // ============================
    const stock = produitsStock.reduce((total, p) => total + p.quantite, 0);
    const valeurStock = produitsStock.reduce(
      (total, p) => total + p.quantite * p.prixVente,
      0
    );

    const mouvementCeMois = mouvementsCeMois._sum.quantite ?? 0;
    const mouvementMoisDernier = mouvementsMoisDernier._sum.quantite ?? 0;

    // ============================
    // ALERTES STOCK
    // ============================
    const produitsAlertes = produitsStock
      .filter((p) => p.quantite <= p.seuilAlerte)
      .map((p) => {
        const lignesProduit = lignesProduits.filter(
          (l) => l.produitId === p.id
        );
        const quantiteVendue = lignesProduit.reduce(
          (s, l) => s + l.quantite,
          0
        );
        return {
          id: p.id,
          nom: p.nom,
          quantite: p.quantite,
          categorie: p.categorieId ? "Catégorie assignée" : "Non définie",
          // Vente moyenne réelle du mois en cours pour ce produit,
          // pas la constante "5" appliquée à tous les produits.
          venteMoyenne: quantiteVendue,
        };
      });

    // ============================
    // TOP PRODUITS — quantité, revenu et tendance réels
    // ============================
    type ProduitAgg = {
      id: number;
      nom: string;
      quantite: number;
      revenu: number;
    };

    const parProduitCeMois = new Map<number, ProduitAgg>();
    for (const l of lignesProduits) {
      const courant = parProduitCeMois.get(l.produitId) ?? {
        id: l.produitId,
        nom: l.produit.nom,
        quantite: 0,
        revenu: 0,
      };
      courant.quantite += l.quantite;
      courant.revenu += l.quantite * l.prix;
      parProduitCeMois.set(l.produitId, courant);
    }

    const quantiteMoisDernierParProduit = new Map<number, number>();
    for (const l of lignesProduitsMoisDernier) {
      quantiteMoisDernierParProduit.set(
        l.produitId,
        (quantiteMoisDernierParProduit.get(l.produitId) ?? 0) + l.quantite
      );
    }

    const topProduits = Array.from(parProduitCeMois.values())
      .sort((a, b) => b.quantite - a.quantite)
      .slice(0, 5)
      .map((p) => {
        const quantitePrecedente = quantiteMoisDernierParProduit.get(p.id) ?? 0;
        return {
          id: p.id,
          nom: p.nom,
          quantite: p.quantite,
          revenu: p.revenu,
          venteMoyenne: p.quantite > 0 ? Math.round(p.revenu / p.quantite) : 0,
          tendance: evolutionPct(p.quantite, quantitePrecedente),
        };
      });

    // ============================
    // REVENUS + PROJECTION (tendance réelle, pas ×1.12 fixe)
    // ============================
    const totauxParMois = new Map<string, number>();
    for (const f of facturesHistorique) {
      const cle = `${f.createdAt.getFullYear()}-${f.createdAt.getMonth()}`;
      totauxParMois.set(cle, (totauxParMois.get(cle) ?? 0) + f.montant);
    }

    const moisTries = Array.from(totauxParMois.entries()).sort(
      ([a], [b]) => (a > b ? 1 : -1)
    );

    // Taux de croissance moyen observé sur l'historique réel (borné entre
    // -30% et +30% pour éviter qu'un seul mois exceptionnel ne fasse dérailler
    // la projection).
    let tauxCroissanceMoyen = 0;
    if (moisTries.length >= 2) {
      const variations: number[] = [];
      for (let i = 1; i < moisTries.length; i++) {
        const [, precedent] = moisTries[i - 1];
        const [, actuel] = moisTries[i];
        if (precedent > 0) variations.push((actuel - precedent) / precedent);
      }
      if (variations.length > 0) {
        tauxCroissanceMoyen =
          variations.reduce((s, v) => s + v, 0) / variations.length;
        tauxCroissanceMoyen = Math.max(-0.3, Math.min(0.3, tauxCroissanceMoyen));
      }
    }

    const ventes = facturesRecentes
      .slice()
      .reverse()
      .map((f) => ({
        mois: f.createdAt.toLocaleString("fr-FR", { month: "short" }),
        ca: f.montant,
        // Projection = tendance réelle observée sur l'historique de facturation,
        // pas un multiplicateur inventé. À 0 mouvement historique, la
        // projection retombe simplement sur la valeur actuelle (pas de "+12%"
        // gratuit).
        prediction: Math.round(f.montant * (1 + tauxCroissanceMoyen)),
      }));

    // ============================
    // FACTURES
    // ============================
    const recentInvoices = facturesRecentes.map((f) => ({
      id: f.id,
      client: f.client?.nom ?? "Client inconnu",
      montant: f.montant,
      statut: f.statut === "Payée" ? "Payée" : "En attente",
      date: f.createdAt.toLocaleDateString("fr-FR"),
    }));

    // ============================
    // ACTIVITES
    // ============================
    const activities = activites.map((a) => ({
      id: a.id,
      type: a.type.includes("vente")
        ? "vente"
        : a.type.includes("client")
          ? "client"
          : "facture",
      titre: a.titre,
      description: a.description ?? "Nouvelle activité CRM",
      date: a.date.toLocaleDateString("fr-FR"),
    }));

    // ============================
    // OBJECTIF DE CA — dérivé de l'historique réel, pas une constante
    // ============================
    // Moyenne des 3 derniers mois avec facturation, +15% comme cible de
    // croissance raisonnable. Si aucun historique n'existe encore, on retombe
    // sur le CA du mois en cours (pas sur "10 000 000" arbitraire).
    const derniersMois = moisTries.slice(-3).map(([, total]) => total);
    const moyenneRecente =
      derniersMois.length > 0
        ? derniersMois.reduce((s, v) => s + v, 0) / derniersMois.length
        : (facturesCeMois._sum.montant ?? 0);
    const objectifCA = Math.round(moyenneRecente * 1.15);

    // ============================
    // ÉVOLUTIONS (mois courant vs mois précédent) — réelles
    // ============================
    const evolutions = {
      clients: evolutionPct(clientsCeMois, clientsMoisDernier),
      opportunites: evolutionPct(opportunitesCeMois, opportunitesMoisDernier),
      factures: evolutionPct(
        facturesCeMois._sum.montant ?? 0,
        facturesMoisDernier._sum.montant ?? 0
      ),
      stock: evolutionPct(mouvementCeMois, mouvementMoisDernier),
    };

    // ============================
    // SCORE IA — composite simple mais basé uniquement sur des faits réels
    // ============================
    let businessScore = 50;
    if (clients > 10) businessScore += 10;
    if (factures > 10) businessScore += 10;
    if (produitsAlertes.length === 0) businessScore += 15;
    if (opportunites > 5) businessScore += 10;
    if (evolutions.factures > 0) businessScore += 10;
    if (evolutions.factures < 0) businessScore -= 5;
    businessScore = Math.max(0, Math.min(100, businessScore));

    // ============================
    // TEXTES D'INSIGHT — générés à partir des faits calculés ci-dessus,
    // pas de phrase figée indépendante des données.
    // ============================
    const insights = {
      clients:
        evolutions.clients >= 0
          ? `${clientsCeMois} nouveaux clients ce mois (${evolutions.clients >= 0 ? "+" : ""}${evolutions.clients}% vs mois dernier).`
          : `Recrutement clients en baisse de ${Math.abs(evolutions.clients)}% ce mois.`,
      produits:
        produitsAlertes.length > 0
          ? `${produitsAlertes.length} produit(s) sous le seuil d'alerte.`
          : "Aucun produit sous le seuil d'alerte.",
      opportunites:
        evolutions.opportunites >= 0
          ? `${opportunitesCeMois} opportunités créées ce mois.`
          : `Création d'opportunités en baisse de ${Math.abs(evolutions.opportunites)}%.`,
      factures: `CA facturé ce mois : ${(facturesCeMois._sum.montant ?? 0).toLocaleString("fr-FR")} Ar.`,
      stock:
        evolutions.stock >= 0
          ? "Mouvements de stock en hausse ce mois."
          : "Mouvements de stock en baisse ce mois.",
      valeurStock: `Valeur totale immobilisée en stock : ${Math.round(valeurStock).toLocaleString("fr-FR")} Ar.`,
    };

    const revenueInsight =
      tauxCroissanceMoyen !== 0
        ? `Tendance calculée sur les ${moisTries.length} derniers mois de facturation : ${tauxCroissanceMoyen >= 0 ? "+" : ""}${Math.round(tauxCroissanceMoyen * 100)}% en moyenne par mois.`
        : "Pas encore assez d'historique de facturation pour calculer une tendance fiable.";

    return NextResponse.json({
      clients,
      produits,
      opportunites,
      factures,
      stock,
      valeurStock,
      ventes,
      objectifCA,
      revenueInsight,
      businessScore,
      evolutions,
      insights,
      produitsAlertes,
      topProduits,
      recentInvoices,
      activities,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur dashboard" }, { status: 500 });
  }
}
