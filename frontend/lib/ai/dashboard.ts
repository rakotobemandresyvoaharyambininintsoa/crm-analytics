import { prisma } from "@/lib/prisma"; // ⚠️ Ajustez si nécessaire
import { askGemma } from "./fireworks";

const JOUR_MS = 1000 * 60 * 60 * 24;

// ============================================================
// Business Score — calcul réel (pas de Gemma ici, juste des maths
// sur vos vraies données ; transparent et vérifiable)
// ============================================================
export async function calculerBusinessScore(): Promise<number> {
  const [
    facturesImpayees,
    facturesEnRetard,
    produitsSousAlerte,
    totalProduits,
    clientsSansContact,
    totalClients,
  ] = await Promise.all([
    prisma.facture.count({ where: { statut: { notIn: ["Payée", "Annulée"] } } }),
    prisma.facture.count({
      where: { statut: { notIn: ["Payée", "Annulée"] }, dateEcheance: { lt: new Date() } },
    }),
    prisma.produit.count(), // recalculé ci-dessous avec le vrai seuil
    prisma.produit.count(),
    prisma.client.count(), // recalculé ci-dessous
    prisma.client.count(),
  ]);

  const produits = await prisma.produit.findMany();
  const nbSousAlerte = produits.filter((p) => p.quantite <= p.seuilAlerte).length;

  const clients = await prisma.client.findMany({
    include: { activites: { orderBy: { date: "desc" }, take: 1 } },
  });
  const nbSansContact = clients.filter((c) => {
    const derniere = c.activites[0]?.date;
    const jours = derniere ? (Date.now() - new Date(derniere).getTime()) / JOUR_MS : 999;
    return jours >= 30;
  }).length;

  // Score de départ 100, on retire des points selon la gravité des signaux
  let score = 100;
  score -= Math.min(30, facturesEnRetard * 5);
  score -= Math.min(15, (facturesImpayees - facturesEnRetard) * 2);
  score -= Math.min(20, totalProduits > 0 ? (nbSousAlerte / totalProduits) * 40 : 0);
  score -= Math.min(20, totalClients > 0 ? (nbSansContact / totalClients) * 40 : 0);

  return Math.max(0, Math.round(score));
}

// ============================================================
// Résumé exécutif — vraie génération Gemma à partir de vraies stats
// ============================================================
export async function genererResumeExecutif(): Promise<{
  resume: string;
  ventesCe30j: number;
  nouveauxClientsCe30j: number;
  facturesEnRetard: number;
  produitsSousAlerte: number;
}> {
  const il30j = new Date(Date.now() - 30 * JOUR_MS);

  const [facturesRecentes, nouveauxClients, facturesEnRetard, produits] = await Promise.all([
    prisma.facture.findMany({ where: { createdAt: { gte: il30j }, statut: "Payée" } }),
    prisma.client.count({ where: { createdAt: { gte: il30j } } }),
    prisma.facture.count({
      where: { statut: { notIn: ["Payée", "Annulée"] }, dateEcheance: { lt: new Date() } },
    }),
    prisma.produit.findMany(),
  ]);

  const ventesCe30j = facturesRecentes.reduce((s, f) => s + f.montant, 0);
  const produitsSousAlerte = produits.filter((p) => p.quantite <= p.seuilAlerte).length;

  const contexte = `
- Chiffre d'affaires encaissé sur les 30 derniers jours: ${ventesCe30j.toLocaleString("fr-FR")} MGA
- Nouveaux clients sur les 30 derniers jours: ${nouveauxClients}
- Factures actuellement en retard de paiement: ${facturesEnRetard}
- Produits sous le seuil d'alerte de stock: ${produitsSousAlerte}
`.trim();

  const resume = await askGemma(
    [
      {
        role: "system",
        content:
          "Tu es un assistant de direction. À partir de ces statistiques réelles, " +
          "rédige un résumé exécutif de 2-3 phrases en français, ton professionnel et direct. " +
          "Mentionne uniquement les chiffres fournis, n'invente rien.",
      },
      { role: "user", content: contexte },
    ],
    { maxTokens: 250 }
  );

  return { resume, ventesCe30j, nouveauxClientsCe30j: nouveauxClients, facturesEnRetard, produitsSousAlerte };
}




// ============================================================
// Recommandations IA globales
// ============================================================

export async function genererActionsIA() {

  const produits =
    await prisma.produit.findMany();



  const facturesNonPayees =
    await prisma.facture.count({

      where: {

        statut: {
          notIn: [
            "Payée",
            "Annulée",
          ],
        },

      },

    });



  const produitsCritiques =
    produits.filter(
      (produit) =>
        produit.quantite <= produit.seuilAlerte
    );



  const contexte = `

Produits en stock critique :

${
  produitsCritiques.length > 0
    ? produitsCritiques
        .map(
          (p) =>
            `- ${p.nom} (${p.quantite} unités restantes)`
        )
        .join("\n")
    : "Aucun produit critique"
}



Factures non payées :

${facturesNonPayees}

`;



  return await askGemma(

    [

      {
        role: "system",

        content:
          "Tu es un conseiller stratégique pour une PME. " +
          "Donne 3 actions prioritaires courtes et concrètes.",
      },


      {
        role: "user",

        content: contexte,

      },

    ],


    {

      maxTokens: 300,

    }

  );

}





// ============================================================
// Analyse intelligente du stock
// ============================================================

export async function genererAnalyseStock() {


  const produits =
    await prisma.produit.findMany();



  const produitsCritiques =
    produits.filter(
      (produit) =>
        produit.quantite <= produit.seuilAlerte
    );



  if (produitsCritiques.length === 0) {

    return "Aucun risque stock détecté.";

  }



  const contexte =
    produitsCritiques

      .map(
        (produit) => `

Produit :
${produit.nom}


Quantité actuelle :
${produit.quantite}


Seuil d'alerte :
${produit.seuilAlerte}

`
      )

      .join("\n");



  return await askGemma(

    [

      {
        role: "system",

        content:
          "Analyse les risques de stock. " +
          "Explique les problèmes et propose les actions d'achat.",
      },


      {
        role: "user",

        content: contexte,

      },

    ],


    {

      maxTokens: 300,

    }

  );


}





// ============================================================
// Analyse intelligente des clients
// ============================================================

export async function genererAnalyseClients() {


  const clients =
    await prisma.client.findMany({

      include: {

        activites: {

          orderBy: {

            date: "desc",

          },

          take: 1,

        },

      },

    });



  const clientsInactifs =
    clients.filter(

      (client) => {


        const derniereActivite =
          client.activites[0]?.date;



        if (!derniereActivite) {

          return true;

        }



        const jours =
          (
            Date.now() -
            new Date(
              derniereActivite
            ).getTime()

          ) / JOUR_MS;



        return jours >= 30;

      }

    );



  const contexte = `

Nombre total clients :
${clients.length}


Clients inactifs :

${
  clientsInactifs.length > 0

    ? clientsInactifs
        .map(
          (client) =>
            `- ${client.nom}`
        )
        .join("\n")

    : "Aucun client inactif"

}

`;



  return await askGemma(

    [

      {

        role: "system",

        content:
          "Tu es un expert CRM. " +
          "Analyse les clients et propose des actions commerciales.",
      },


      {

        role: "user",

        content: contexte,

      },

    ],


    {

      maxTokens: 300,

    }

  );


}








// ============================================================
// Commentaires d'activités — UN SEUL appel Gemma pour toutes les
// activités visibles (évite un appel par activité = trop lent/coûteux)
// ============================================================
export async function genererCommentairesActivites(
  activites: { id: number; type: string; titre: string; description: string }[]
): Promise<Record<number, string>> {
  if (activites.length === 0) return {};

  const liste = activites
    .map((a) => `ID ${a.id} [${a.type}]: "${a.titre}" — ${a.description || "sans description"}`)
    .join("\n");

  const reponse = await askGemma(
    [
      {
        role: "system",
        content:
          "Pour chaque activité listée, écris UN commentaire court (max 15 mots) en français, " +
          "spécifique à cette activité précise (pas une phrase générique répétée). " +
          "Réponds UNIQUEMENT en JSON valide, format: " +
          '{"1": "commentaire...", "2": "commentaire..."} où les clés sont les ID fournis. ' +
          "Pas de texte avant/après le JSON.",
      },
      { role: "user", content: liste },
    ],
    { maxTokens: 400, temperature: 0.5 }
  );

  try {
    const nettoye = reponse.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(nettoye);
    const resultat: Record<number, string> = {};
    for (const [id, comment] of Object.entries(parsed)) {
      resultat[Number(id)] = String(comment);
    }
    return resultat;
  } catch {
    return {}; // en cas d'échec de parsing, le frontend affichera un fallback neutre
  }
}
