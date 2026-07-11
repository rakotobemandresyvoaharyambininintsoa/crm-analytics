import { prisma } from "@/lib/prisma"; // ⚠️ Ajustez si nécessaire
import { askGemma } from "./fireworks";

// ============================================================
// Génère un email de relance personnalisé pour une facture en retard
// ============================================================
export async function genererEmailRelance(factureId: number): Promise<string> {
  const facture = await prisma.facture.findUnique({
    where: { id: factureId },
    include: { client: true },
  });

  if (!facture) {
    throw new Error("Facture introuvable");
  }

  const joursRetard = facture.dateEcheance
    ? Math.floor((Date.now() - new Date(facture.dateEcheance).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return askGemma([
    {
      role: "system",
      content:
        "Tu rédiges des emails de relance de paiement professionnels en français. " +
        "Ton ferme mais courtois, jamais agressif. Structure: objet + corps + signature " +
        "générique '[Votre nom]'. Reste factuel sur les montants et délais fournis.",
    },
    {
      role: "user",
      content: `Rédige un email de relance pour :
- Client: ${facture.client?.nom ?? "Client"}
- Facture n°: ${facture.numero}
- Montant: ${facture.montant.toLocaleString("fr-FR")} MGA
- Retard: ${joursRetard} jours
- Ton souhaité: ${joursRetard >= 30 ? "ferme, mentionner les prochaines étapes possibles" : "courtois, rappel amical"}`,
    },
  ], { maxTokens: 500 });
}

// ============================================================
// Génère un diagnostic IA complet pour un client donné
// ============================================================
export async function genererDiagnosticClient(clientId: number): Promise<string> {
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      activites: { orderBy: { date: "desc" }, take: 5 },
      opportunites: true,
      factures: true,
    },
  });

  if (!client) {
    throw new Error("Client introuvable");
  }

  const opportunitesOuvertes = client.opportunites.filter(
    (o) => !["Gagnée", "Perdue"].includes(o.statut)
  );
  const facturesImpayees = client.factures.filter(
    (f) => !["Payée", "Annulée"].includes(f.statut)
  );

  const contexte = `
Client: ${client.nom} ${client.entreprise ? "(" + client.entreprise + ")" : ""}
Statut: ${client.statut}
Score actuel: ${client.score}/100
Secteur: ${client.secteur ?? "Non renseigné"}

Dernières activités (${client.activites.length}):
${client.activites.map((a) => `- ${a.type} "${a.titre}" le ${new Date(a.date).toLocaleDateString("fr-FR")} (${a.statut})`).join("\n") || "Aucune activité enregistrée"}

Opportunités ouvertes: ${opportunitesOuvertes.length}
${opportunitesOuvertes.map((o) => `- "${o.nom}": ${o.montant.toLocaleString("fr-FR")} MGA (${o.probabilite}% de probabilité)`).join("\n") || "Aucune"}

Factures impayées: ${facturesImpayees.length}
${facturesImpayees.map((f) => `- ${f.numero}: ${f.montant.toLocaleString("fr-FR")} MGA`).join("\n") || "Aucune"}
`.trim();

  return askGemma([
    {
      role: "system",
      content:
        "Tu es un directeur commercial IA. À partir des données factuelles fournies, " +
        "rédige un diagnostic court (4-6 phrases) sur la relation avec ce client : " +
        "santé de la relation, risques identifiés, et 1-2 recommandations concrètes. " +
        "Sois direct, n'invente aucune donnée absente du contexte.",
    },
    { role: "user", content: contexte },
  ], { maxTokens: 500 });
}
