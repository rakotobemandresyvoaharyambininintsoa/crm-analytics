import { prisma } from "@/lib/prisma";
import { askGemma } from "./fireworks";

const JOUR_MS = 1000 * 60 * 60 * 24;
const SEUIL_DORMANCE_JOURS = 90;

type ProduitSynthese = {
  id: number;
  nom: string;
  quantite: number;
  seuilAlerte: number;
  prixAchat: number;
  prixVente: number;
  createdAt: Date;
  mouvements: { createdAt: Date }[];
  fournisseur?: unknown;
  categorie?: unknown;
};

type ProduitCritique = {
  id: number;
  nom: string;
  quantite: number;
  seuilAlerte: number;
  fournisseur?: unknown;
  categorie?: unknown;
};

type ProduitDormant = {
  id: number;
  nom: string;
  quantite: number;
  mouvements: { createdAt: Date }[];
};

type TopMarge = {
  id: number;
  nom: string;
  quantite: number;
  prixAchat: number;
  prixVente: number;
  marge: number;
};

export type AnalyseStockIA = {
  resume: string;
  risques: string[];
  opportunites: string[];
  actions_prioritaires: string[];
  confidence: number;
};

async function recupererSyntheseStock() {
  const produits = await prisma.produit.findMany({
    select: {
      id: true,
      nom: true,
      quantite: true,
      seuilAlerte: true,
      prixAchat: true,
      prixVente: true,
      createdAt: true,
      fournisseur: true,
      categorie: true,
      mouvements: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { createdAt: true },
      },
    },
  });

  return produits as ProduitSynthese[];
}

// ✅ CORRIGÉ : un produit sans mouvement n'est "dormant" que s'il a été
// créé il y a plus de 90 jours — un produit tout juste ajouté au catalogue
// n'est pas "dormant", il n'a simplement pas encore eu de mouvement.
function estProduitDormant(produit: ProduitSynthese) {
  const dernierMouvement = produit.mouvements[0]?.createdAt;
  const dateReference = dernierMouvement
    ? new Date(dernierMouvement)
    : new Date(produit.createdAt);

  return Date.now() - dateReference.getTime() > SEUIL_DORMANCE_JOURS * JOUR_MS;
}

export async function calculerStockHealthScore(): Promise<number> {
  const produits = await recupererSyntheseStock();
  if (produits.length === 0) return 100;

  const produitsCritiques = produits.filter((p) => p.quantite <= p.seuilAlerte);

  let score = 100;
  score -= Math.min(50, (produitsCritiques.length / produits.length) * 100);

  return Math.max(0, Math.round(score));
}

export async function recupererProduitsCritiques(): Promise<ProduitCritique[]> {
  const produits = await recupererSyntheseStock();
  return produits.filter((produit) => produit.quantite <= produit.seuilAlerte);
}

export async function recupererProduitsDormants(): Promise<ProduitDormant[]> {
  const produits = await recupererSyntheseStock();
  return produits.filter(estProduitDormant);
}

export async function calculerValeurStock(): Promise<number> {
  const produits = await recupererSyntheseStock();
  return produits.reduce((total, produit) => total + produit.quantite * produit.prixAchat, 0);
}

// Marge POTENTIELLE si tout le stock actuel était vendu — pas un historique
// de ventes réelles. Le libellé affiché côté frontend le précise désormais.
export async function recupererTopMarges(): Promise<TopMarge[]> {
  const produits = await recupererSyntheseStock();

  return produits
    .map((produit) => ({
      id: produit.id,
      nom: produit.nom,
      quantite: produit.quantite,
      prixAchat: produit.prixAchat,
      prixVente: produit.prixVente,
      marge: (produit.prixVente - produit.prixAchat) * produit.quantite,
    }))
    .sort((a, b) => b.marge - a.marge)
    .slice(0, 5);
}

export async function genererAnalyseStockIA(): Promise<AnalyseStockIA> {
  const [score, critiques, dormants, valeur, topMarges] = await Promise.all([
    calculerStockHealthScore(),
    recupererProduitsCritiques(),
    recupererProduitsDormants(),
    calculerValeurStock(),
    recupererTopMarges(),
  ]);

  const contexte = {
    score_sante_stock: score,
    produits_critiques: critiques.map((p) => ({
      nom: p.nom,
      quantite: p.quantite,
      seuil_alerte: p.seuilAlerte,
    })),
    produits_dormants: dormants.map((p) => ({ nom: p.nom, quantite: p.quantite })),
    valeur_stock: valeur,
    top_marges_potentielles: topMarges.map((p) => ({ nom: p.nom, marge: Math.round(p.marge) })),
  };

  const raw = await askGemma(
    [
      {
        role: "system",
        content:
          "Tu es un directeur supply chain. Analyse le stock d'une entreprise. " +
          "Réponds en français, de manière concise et concrète. Retourne UNIQUEMENT " +
          "du JSON valide, sans balises markdown, avec les champs: resume, risques, " +
          "opportunites, actions_prioritaires, confidence. N'invente rien au-delà des données fournies.",
      },
      { role: "user", content: JSON.stringify(contexte, null, 2) },
    ],
    { maxTokens: 500 }
  );

  try {
    // ✅ CORRIGÉ : nettoie les balises markdown éventuelles avant de parser
    const nettoye = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(nettoye) as AnalyseStockIA;
  } catch {
    return {
      resume: raw,
      risques: [],
      opportunites: [],
      actions_prioritaires: [],
      confidence: 0,
    };
  }
}
