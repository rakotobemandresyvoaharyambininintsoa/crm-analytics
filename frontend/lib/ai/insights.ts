import { prisma } from "@/lib/prisma"; // ⚠️ Ajustez si votre client Prisma est ailleurs
import { askGemma } from "./fireworks";

export type Insight = {
  id: string;
  categorie: "client" | "opportunite" | "facture" | "stock" | "correlation";
  severite: "info" | "attention" | "critique";
  titre: string;
  message: string;
  actionSuggeree?: string;
  actionType?: "relance-facture" | "diagnostic-client"; // pour brancher un bouton d'action
  actionData?: { factureId?: number; clientId?: number };
  data?: Record<string, unknown>;
};

const JOUR_MS = 1000 * 60 * 60 * 24;

// ============================================================
// Helpers
// ============================================================

/**
 * Formate un montant en MGA sans décimales.
 * L'Ariary malgache n'a pas de sous-unité utilisée en pratique,
 * donc on force maximumFractionDigits: 0 pour éviter d'afficher
 * des décimales issues d'arrondis internes (ex: 38 916 911,101 MGA).
 */
function formaterMGA(montant: number): string {
  return montant.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) + " MGA";
}

/**
 * Calcule le nombre de jours sans contact à partir de la dernière
 * activité d'un client. Retourne `null` (au lieu d'une valeur
 * sentinelle arbitraire comme 999) quand le client n'a AUCUNE
 * activité enregistrée en base — ce n'est pas la même situation
 * qu'un client "vraiment" sans contact depuis longtemps.
 */
function calculerJoursSansContact(derniereActivite: Date | undefined, maintenant: number): number | null {
  if (!derniereActivite) return null;
  return Math.floor((maintenant - new Date(derniereActivite).getTime()) / JOUR_MS);
}

/** Libellé humain pour le "sans contact depuis X jours" / cas sans aucune activité */
function libelleSansContact(joursSansContact: number | null): string {
  return joursSansContact === null
    ? "aucune activité enregistrée"
    : `sans contact depuis ${joursSansContact} jours`;
}

// ============================================================
// NIVEAU 1 — Détecteurs de base
// ============================================================

async function detecterClientsARisque(): Promise<Insight[]> {
  const clients = await prisma.client.findMany({
    where: { statut: { not: "Prospect" } },
    include: {
      activites: { orderBy: { date: "desc" }, take: 1 },
      opportunites: true,
    },
  });

  const insights: Insight[] = [];
  const maintenant = Date.now();

  for (const client of clients) {
    const derniereActivite = client.activites[0]?.date;
    const joursSansContact = calculerJoursSansContact(derniereActivite, maintenant);

    const valeurPotentielle = client.opportunites.reduce((s, o) => s + o.montant, 0);

    // Un client sans AUCUNE activité (null) est traité comme à risque au même
    // titre qu'un client réellement inactif depuis longtemps (>= 30 jours).
    const estARisque = joursSansContact === null || joursSansContact >= 30;

    if (estARisque && (client.score >= 50 || valeurPotentielle > 0)) {
      const severite: Insight["severite"] =
        joursSansContact === null || joursSansContact >= 60 ? "critique" : "attention";

      insights.push({
        id: `client-risque-${client.id}`,
        categorie: "client",
        severite,
        titre: `${client.nom}${client.entreprise ? " (" + client.entreprise + ")" : ""} ${libelleSansContact(joursSansContact)}`,
        message: `Score client: ${client.score}/100. Valeur d'opportunités en cours: ${formaterMGA(valeurPotentielle)}.`,
        actionSuggeree: "Voir le diagnostic IA de ce client",
        actionType: "diagnostic-client",
        actionData: { clientId: client.id },
        data: { clientId: client.id, joursSansContact, valeurPotentielle },
      });
    }
  }

  return insights.sort(
    (a, b) => (b.data?.valeurPotentielle as number ?? 0) - (a.data?.valeurPotentielle as number ?? 0)
  );
}

async function detecterOpportunitesStagnantes(): Promise<Insight[]> {
  const opportunites = await prisma.opportunite.findMany({
    where: { statut: { notIn: ["Gagnée", "Perdue"] } },
    include: { client: true },
  });

  const maintenant = Date.now();
  const moyenneMontant =
    opportunites.reduce((s, o) => s + o.montant, 0) / (opportunites.length || 1);

  const insights: Insight[] = [];

  for (const opp of opportunites) {
    const joursOuverte = Math.floor((maintenant - new Date(opp.createdAt).getTime()) / JOUR_MS);

    if (joursOuverte >= 21 && opp.montant >= moyenneMontant * 0.7) {
      insights.push({
        id: `opp-stagnante-${opp.id}`,
        categorie: "opportunite",
        severite: joursOuverte >= 45 ? "critique" : "attention",
        titre: `Opportunité "${opp.nom}" bloquée depuis ${joursOuverte} jours`,
        message: `Client: ${opp.client?.nom ?? "N/A"}. Montant: ${formaterMGA(opp.montant)}. Statut: ${opp.statut}. Probabilité: ${opp.probabilite}%.`,
        actionSuggeree: "Relancer ou requalifier l'opportunité",
        data: { opportuniteId: opp.id, montant: opp.montant, joursOuverte, clientId: opp.clientId },
      });
    }
  }

  return insights.sort((a, b) => (b.data?.montant as number) - (a.data?.montant as number));
}

async function detecterFacturesEnRetard(): Promise<Insight[]> {
  const factures = await prisma.facture.findMany({
    where: {
      statut: { notIn: ["Payée", "Annulée"] },
      dateEcheance: { lt: new Date() },
    },
    include: { client: true },
  });

  const maintenant = Date.now();

  return factures
    .map((f) => {
      const joursRetard = f.dateEcheance
        ? Math.floor((maintenant - new Date(f.dateEcheance).getTime()) / JOUR_MS)
        : 0;
      return {
        id: `facture-retard-${f.id}`,
        categorie: "facture" as const,
        severite: (joursRetard >= 30 ? "critique" : "attention") as Insight["severite"],
        titre: `Facture ${f.numero} en retard de ${joursRetard} jours`,
        message: `Client: ${f.client?.nom ?? "N/A"}. Montant: ${formaterMGA(f.montant)}.`,
        actionSuggeree: "Générer l'email de relance",
        actionType: "relance-facture" as const,
        actionData: { factureId: f.id },
        data: { factureId: f.id, montant: f.montant, joursRetard, clientId: f.clientId },
      };
    })
    .sort((a, b) => (b.data?.montant as number) - (a.data?.montant as number));
}

async function detecterRisquesStock(): Promise<Insight[]> {
  const produits = await prisma.produit.findMany({
    include: {
      mouvements: {
        where: { createdAt: { gte: new Date(Date.now() - 30 * JOUR_MS) } },
      },
    },
  });

  const insights: Insight[] = [];

  for (const p of produits) {
    const sorties = p.mouvements
      .filter((m) => m.type === "SORTIE")
      .reduce((s, m) => s + m.quantite, 0);

    const vitesseJournaliere = sorties / 30;
    const joursAvantRupture =
      vitesseJournaliere > 0 ? Math.floor(p.quantite / vitesseJournaliere) : Infinity;
    const dejaBas = p.quantite <= p.seuilAlerte;

    if (dejaBas || joursAvantRupture <= 14) {
      insights.push({
        id: `stock-risque-${p.id}`,
        categorie: "stock",
        severite: dejaBas || joursAvantRupture <= 5 ? "critique" : "attention",
        titre: `${p.nom} : ${dejaBas ? "sous le seuil d'alerte" : `rupture estimée dans ${joursAvantRupture} jours`}`,
        message: `Stock actuel: ${p.quantite} unités (seuil: ${p.seuilAlerte}). Écoulement moyen: ${vitesseJournaliere.toFixed(1)}/jour sur 30 jours.`,
        actionSuggeree: "Planifier un réapprovisionnement",
        data: { produitId: p.id, quantite: p.quantite, joursAvantRupture },
      });
    }
  }

  return insights.sort(
    (a, b) => (a.data?.joursAvantRupture as number) - (b.data?.joursAvantRupture as number)
  );
}

// ============================================================
// NIVEAU 3 — Insight de corrélation (le "wahou")
// Détecte : clients qui ont À LA FOIS une facture en retard
// ET aucune activité commerciale récente. Hypothèse : le manque
// de suivi commercial précède/aggrave le retard de paiement.
// ============================================================
async function detecterCorrelationSuiviPaiement(): Promise<Insight[]> {
  const clients = await prisma.client.findMany({
    include: {
      activites: { orderBy: { date: "desc" }, take: 1 },
      factures: {
        where: {
          statut: { notIn: ["Payée", "Annulée"] },
          dateEcheance: { lt: new Date() },
        },
      },
    },
  });

  const maintenant = Date.now();
  const clientsConcernes: {
    nom: string;
    joursSansContact: number | null;
    facturesEnRetard: number;
    montantTotal: number;
  }[] = [];

  for (const client of clients) {
    if (client.factures.length === 0) continue;

    const derniereActivite = client.activites[0]?.date;
    const joursSansContact = calculerJoursSansContact(derniereActivite, maintenant);

    if (joursSansContact === null || joursSansContact >= 30) {
      clientsConcernes.push({
        nom: client.nom,
        joursSansContact,
        facturesEnRetard: client.factures.length,
        montantTotal: client.factures.reduce((s, f) => s + f.montant, 0),
      });
    }
  }

  if (clientsConcernes.length < 2) return []; // pas assez pour parler de "pattern"

  const montantCumule = clientsConcernes.reduce((s, c) => s + c.montantTotal, 0);
  const liste = clientsConcernes
    .slice(0, 5)
    .map((c) => {
      const contact = c.joursSansContact === null ? "aucune activité" : `${c.joursSansContact}j sans contact`;
      return `${c.nom} (${contact}, ${formaterMGA(c.montantTotal)} en retard)`;
    })
    .join(" · ");

  return [
    {
      id: "correlation-suivi-paiement",
      categorie: "correlation",
      severite: "critique",
      titre: `Pattern détecté : ${clientsConcernes.length} clients cumulent absence de suivi ET retard de paiement`,
      message: `${liste}. Montant total concerné: ${formaterMGA(montantCumule)}. Le manque de suivi commercial semble corrélé au retard de paiement pour ces comptes.`,
      actionSuggeree: "Traiter le suivi commercial et la relance financière ensemble pour ces clients",
      data: { nbClients: clientsConcernes.length, montantCumule },
    },
  ];
}

// ============================================================
// Agrégation
// ============================================================
export async function genererInsightsBruts(): Promise<Insight[]> {
  const [clients, opportunites, factures, stock, correlation] = await Promise.all([
    detecterClientsARisque(),
    detecterOpportunitesStagnantes(),
    detecterFacturesEnRetard(),
    detecterRisquesStock(),
    detecterCorrelationSuiviPaiement(),
  ]);

  // La corrélation (niveau 3) est mise en premier — c'est l'insight le plus fort
  return [...correlation, ...clients, ...opportunites, ...factures, ...stock];
}

// ============================================================
// Synthèse IA (niveau 1)
// ============================================================
export async function genererSyntheseIA(insights: Insight[]): Promise<string> {
  if (insights.length === 0) {
    return "Aucune alerte critique détectée actuellement. L'activité commerciale et le stock sont sains.";
  }

  const contexte = insights
    .slice(0, 15)
    .map((i) => `- [${i.severite.toUpperCase()}] ${i.titre} — ${i.message}`)
    .join("\n");

  return askGemma([
    {
      role: "system",
      content:
        "Tu es un directeur commercial IA qui analyse des alertes CRM factuelles. " +
        "Rédige une synthèse courte (5-8 phrases max), en français, priorisant les 3 " +
        "actions les plus urgentes. Sois direct et actionnable. Ne mentionne que les " +
        "faits fournis, n'invente aucune donnée. S'il y a un pattern de corrélation " +
        "détecté, mets-le en premier car c'est l'insight le plus important.",
    },
    { role: "user", content: `Voici les alertes détectées dans le CRM aujourd'hui:\n\n${contexte}` },
  ]);
}

// ============================================================
// Chat conversationnel (niveau 1)
// ============================================================
export async function repondreQuestionCRM(question: string): Promise<string> {
  const insights = await genererInsightsBruts();

  const [nbClients, nbOpportunitesOuvertes, nbFacturesImpayees, produits] = await Promise.all([
    prisma.client.count(),
    prisma.opportunite.count({ where: { statut: { notIn: ["Gagnée", "Perdue"] } } }),
    prisma.facture.count({ where: { statut: { notIn: ["Payée", "Annulée"] } } }),
    prisma.produit.findMany(),
  ]);

  const valeurStock = produits.reduce((s, p) => s + p.prixAchat * p.quantite, 0);

  const contexte = `
Statistiques globales:
- Nombre total de clients: ${nbClients}
- Opportunités ouvertes: ${nbOpportunitesOuvertes}
- Factures impayées: ${nbFacturesImpayees}
- Valeur du stock (prix d'achat): ${formaterMGA(valeurStock)}

Alertes actives (${insights.length}):
${insights.slice(0, 20).map((i) => `- ${i.titre}: ${i.message}`).join("\n") || "Aucune"}
`.trim();

  return askGemma([
    {
      role: "system",
      content:
        "Tu es l'assistant IA du CRM. Réponds UNIQUEMENT à partir du contexte fourni. " +
        "Si l'information demandée n'y figure pas, dis-le clairement plutôt que d'inventer. " +
        "Réponds en français, de façon concise et professionnelle.",
    },
    { role: "user", content: `Contexte:\n${contexte}\n\nQuestion: ${question}` },
  ]);
}