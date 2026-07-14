import { prisma } from "@/lib/prisma";
import { askGemma } from "./fireworks";

const JOUR_MS = 1000 * 60 * 60 * 24;
const SEUIL_INACTIVITE_JOURS = 30;

type ClientSynthese = {
  id: number;
  nom: string;
  entreprise?: string | null;
  email?: string | null;
  createdAt: Date;
  activites: { date: Date }[];
  factures: { montant: number; statut: string }[];
  opportunites: unknown[];
};

type TopClient = {
  id: number;
  nom: string;
  entreprise?: string | null;
  chiffreAffaire: number;
  opportunites: number;
};

export type AnalyseIA = {
  resume: string;
  risques: string[];
  actions_prioritaires: string[];
  opportunites: string[];
  confidence: number;
};

async function recupererSyntheseClients() {
  const clients = await prisma.client.findMany({
    include: {
      activites: { orderBy: { date: "desc" }, take: 1 },
      factures: { select: { montant: true, statut: true } },
      opportunites: true,
    },
  });

  return clients as ClientSynthese[];
}

// ✅ CORRIGÉ : un client sans activité n'est "inactif" que s'il a été créé
// il y a plus de 30 jours — un client tout juste créé n'est pas "inactif",
// il n'a simplement pas encore eu de première interaction.
function estInactif(client: ClientSynthese) {
  const derniereActivite = client.activites[0]?.date;
  const dateReference = derniereActivite
    ? new Date(derniereActivite)
    : new Date(client.createdAt);

  const jours = (Date.now() - dateReference.getTime()) / JOUR_MS;
  return jours >= SEUIL_INACTIVITE_JOURS;
}

export async function calculerClientHealthScore(): Promise<number> {
  const clients = await recupererSyntheseClients();
  if (clients.length === 0) return 100;

  const inactifs = clients.filter(estInactif).length;
  const sansFacture = clients.filter((c) => c.factures.length === 0).length;

  let score = 100;
  score -= Math.min(40, (inactifs / clients.length) * 100);
  score -= Math.min(20, (sansFacture / clients.length) * 100);

  return Math.max(0, Math.round(score));
}

export async function recupererClientsInactifs() {
  const clients = await recupererSyntheseClients();
  return clients.filter(estInactif);
}

export async function compterNouveauxClients() {
  const date = new Date(Date.now() - 30 * JOUR_MS);
  return prisma.client.count({ where: { createdAt: { gte: date } } });
}

// ✅ CORRIGÉ : ne compte que les factures réellement payées comme "chiffre d'affaires".
// Les factures en brouillon/attente/retard sont de la valeur potentielle,
// pas du CA réalisé — les mélanger fausse le classement des "top clients".
export async function recupererTopClients(): Promise<TopClient[]> {
  const clients = await recupererSyntheseClients();

  return clients
    .map((client) => {
      const chiffreAffaire = client.factures
        .filter((f) => f.statut === "Payée")
        .reduce((total, f) => total + f.montant, 0);

      return {
        id: client.id,
        nom: client.nom,
        entreprise: client.entreprise,
        chiffreAffaire,
        opportunites: client.opportunites.length,
      };
    })
    .sort((a, b) => b.chiffreAffaire - a.chiffreAffaire)
    .slice(0, 5);
}

export async function genererAnalyseClientsIA(): Promise<AnalyseIA> {
  const [score, clientsInactifs, nouveauxClients, topClients] = await Promise.all([
    calculerClientHealthScore(),
    recupererClientsInactifs(),
    compterNouveauxClients(),
    recupererTopClients(),
  ]);

  const contexte = {
    score_sante_clients: score,
    nouveaux_clients_30_jours: nouveauxClients,
    nombre_clients_inactifs: clientsInactifs.length,
    top_clients: topClients.map((c) => ({
      nom: c.nom,
      chiffre_affaire: c.chiffreAffaire,
      opportunites: c.opportunites,
    })),
  };

  const messages = [
    {
      role: "system" as const,
      content:
        "Tu es un directeur commercial expert CRM. Analyse le portefeuille clients. " +
        "Réponds en français, de manière concise, concrète, et orientée action. " +
        "Retourne UNIQUEMENT du JSON valide, sans balises markdown, avec les champs: " +
        "resume (string), risques (array de strings), actions_prioritaires (array de strings), " +
        "opportunites (array de strings), confidence (number de 0 à 100). " +
        "N'invente rien au-delà des données fournies.",
    },
    { role: "user" as const, content: JSON.stringify(contexte, null, 2) },
  ];

  const raw = await askGemma(messages, { maxTokens: 500 });

  try {
    // ✅ CORRIGÉ : nettoie les éventuelles balises markdown avant de parser,
    // car Gemma les ajoute parfois malgré la consigne explicite.
    const nettoye = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(nettoye) as AnalyseIA;
  } catch {
    return {
      resume: raw,
      risques: [],
      actions_prioritaires: [],
      opportunites: [],
      confidence: 0,
    };
  }
}
