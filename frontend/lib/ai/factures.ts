import { prisma } from "@/lib/prisma";
import { askGemma } from "./fireworks";

type FactureAvecClient = {
  id: number;
  numero: string;
  montant: number;
  statut: string;
  dateEcheance?: Date | null;
  client?: {
    nom?: string | null;
    entreprise?: string | null;
    factures?: { statut: string; dateEcheance?: Date | null }[];
  } | null;
};

export type AnalyseRisquePaiement = {
  niveau_risque: "faible" | "moyen" | "eleve";
  raison: string;
  action: string;
};

export type AnalyseSituationFinanciere = {
  resume: string;
  risques: string[];
  recommandations: string[];
  indicateurs: {
    total_factures: number;
    factures_payees: number;
    factures_en_retard: number;
    montant_total: number;
  };
  // ✅ NOUVEAU : niveau de risque global, calculé honnêtement à partir du
  // % réel de factures en retard — remplace le stub "moyen" codé en dur
  // qui existait avant dans la route.
  niveauRisqueGlobal: "faible" | "moyen" | "eleve";
};

function nettoyerJSON(raw: string): string {
  return raw.replace(/```json|```/g, "").trim();
}

// ✅ Analyse par facture précise — à utiliser depuis FactureTable
// (bouton par ligne), PAS depuis une vue globale sans contexte.
export async function analyserRisquePaiement(
  factureId: number
): Promise<AnalyseRisquePaiement> {
  const facture = (await prisma.facture.findUnique({
    where: { id: factureId },
    include: { client: { include: { factures: true } } },
  })) as FactureAvecClient | null;

  if (!facture) {
    throw new Error("Facture introuvable");
  }

  const facturesClient = facture.client?.factures ?? [];
  const retards = facturesClient.filter(
    (f) => f.statut !== "Payée" && f.dateEcheance && new Date(f.dateEcheance) < new Date()
  ).length;

  const contexte = {
    client: facture.client?.nom ?? "Inconnu",
    entreprise: facture.client?.entreprise ?? "Non renseignée",
    montant_facture: facture.montant,
    nombre_total_factures_client: facturesClient.length,
    nombre_de_retards: retards,
    statut_actuel: facture.statut,
    date_echeance: facture.dateEcheance ?? null,
  };

  const raw = await askGemma(
    [
      {
        role: "system",
        content:
          "Tu es un analyste financier CRM. Analyse le risque de paiement d'une facture. " +
          "Réponds en français avec UNIQUEMENT du JSON valide (sans balises markdown) contenant " +
          "les champs: niveau_risque (faible/moyen/eleve), raison, action. Sois concis et concret.",
      },
      { role: "user", content: JSON.stringify(contexte, null, 2) },
    ],
    { maxTokens: 300 }
  );

  try {
    return JSON.parse(nettoyerJSON(raw)) as AnalyseRisquePaiement;
  } catch {
    return {
      niveau_risque: "moyen",
      raison: raw,
      action: "Vérifier manuellement la facture et relancer le client.",
    };
  }
}

// ============================================================
// Analyse financière globale (vue d'ensemble, page Factures)
// ============================================================
export async function analyserSituationFinanciere(): Promise<AnalyseSituationFinanciere> {
  const [total, payees, retard, montantTotal] = await Promise.all([
    prisma.facture.count(),
    prisma.facture.count({ where: { statut: "Payée" } }),
    prisma.facture.count({
      where: { statut: { notIn: ["Payée", "Annulée"] }, dateEcheance: { lt: new Date() } },
    }),
    prisma.facture.aggregate({ _sum: { montant: true } }),
  ]);

  const indicateurs = {
    total_factures: total,
    factures_payees: payees,
    factures_en_retard: retard,
    montant_total: montantTotal._sum.montant ?? 0,
  };

  // ✅ Calcul RÉEL du niveau de risque global — pas un texte en dur.
  // Basé sur le % de factures en retard par rapport au total.
  const tauxRetard = total > 0 ? retard / total : 0;
  const niveauRisqueGlobal: AnalyseSituationFinanciere["niveauRisqueGlobal"] =
    tauxRetard >= 0.25 ? "eleve" : tauxRetard >= 0.1 ? "moyen" : "faible";

  const raw = await askGemma(
    [
      {
        role: "system",
        content:
          "Tu es un directeur financier IA. Analyse la situation financière d'une entreprise " +
          "et donne des recommandations. Réponds UNIQUEMENT en JSON valide (sans balises markdown) " +
          "avec les champs: resume, risques (array), recommandations (array). Sois clair, court et actionnable.",
      },
      { role: "user", content: JSON.stringify(indicateurs, null, 2) },
    ],
    { maxTokens: 400 }
  );

  try {
    const parsed = JSON.parse(nettoyerJSON(raw)) as {
      resume: string;
      risques: string[];
      recommandations: string[];
    };

    return {
      resume: parsed.resume,
      risques: parsed.risques ?? [],
      recommandations: parsed.recommandations ?? [],
      indicateurs,
      niveauRisqueGlobal,
    };
  } catch {
    return {
      resume: raw,
      risques: [],
      recommandations: [],
      indicateurs,
      niveauRisqueGlobal,
    };
  }
}

// ⚠️ NOTE DE CONSOLIDATION : la génération d'email de relance existe déjà
// dans lib/ai/actions.ts::genererEmailRelance() — utilisez CETTE fonction-là
// (déjà branchée sur RecentInvoices.tsx et /api/ai/actions/relance) plutôt
// que d'en recréer une seconde ici, pour éviter deux implémentations qui
// divergent avec le temps.
