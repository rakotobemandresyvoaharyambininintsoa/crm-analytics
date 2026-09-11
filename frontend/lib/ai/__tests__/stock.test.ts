import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  calculerStockHealthScore,
  recupererProduitsCritiques,
  recupererProduitsDormants,
  calculerValeurStock,
  recupererTopMarges,
  genererAnalyseStockIA,
} from "../stock";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    produit: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock("../fireworks", () => ({
  askGemmaSafe: vi.fn(),
}));

import { prisma } from "@/lib/prisma";
import { askGemmaSafe } from "../fireworks";

const JOUR_MS = 1000 * 60 * 60 * 24;
const ancienneDate = new Date(Date.now() - 120 * JOUR_MS);
const recenteDate = new Date(Date.now() - 5 * JOUR_MS);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("calculerStockHealthScore", () => {
  it("retourne 100 quand il n y a aucun produit", async () => {
    (prisma.produit.findMany as any).mockResolvedValue([]);
    const score = await calculerStockHealthScore();
    expect(score).toBe(100);
  });

  it("baisse le score quand des produits sont sous le seuil d alerte", async () => {
    (prisma.produit.findMany as any).mockResolvedValue([
      { id: 1, nom: "Critique", quantite: 2, seuilAlerte: 10, createdAt: recenteDate, mouvements: [] },
      { id: 2, nom: "OK", quantite: 50, seuilAlerte: 10, createdAt: recenteDate, mouvements: [] },
    ]);
    const score = await calculerStockHealthScore();
    expect(score).toBeLessThan(100);
  });
});

describe("recupererProduitsCritiques", () => {
  it("ne retourne que les produits sous ou au seuil d alerte", async () => {
    (prisma.produit.findMany as any).mockResolvedValue([
      { id: 1, nom: "Critique", quantite: 5, seuilAlerte: 10, createdAt: recenteDate, mouvements: [] },
      { id: 2, nom: "OK", quantite: 50, seuilAlerte: 10, createdAt: recenteDate, mouvements: [] },
    ]);
    const critiques = await recupererProduitsCritiques();
    expect(critiques).toHaveLength(1);
    expect(critiques[0].nom).toBe("Critique");
  });
});

describe("recupererProduitsDormants", () => {
  it("considere un produit dormant seulement apres 90 jours sans mouvement", async () => {
    (prisma.produit.findMany as any).mockResolvedValue([
      { id: 1, nom: "Dormant", quantite: 10, createdAt: ancienneDate, mouvements: [] },
      { id: 2, nom: "Actif", quantite: 10, createdAt: recenteDate, mouvements: [{ createdAt: recenteDate }] },
    ]);
    const dormants = await recupererProduitsDormants();
    expect(dormants).toHaveLength(1);
    expect(dormants[0].nom).toBe("Dormant");
  });

  it("ne considere pas un produit recemment cree comme dormant", async () => {
    (prisma.produit.findMany as any).mockResolvedValue([
      { id: 3, nom: "Nouveau", quantite: 5, createdAt: recenteDate, mouvements: [] },
    ]);
    const dormants = await recupererProduitsDormants();
    expect(dormants).toHaveLength(0);
  });
});

describe("calculerValeurStock", () => {
  it("calcule la valeur totale en quantite fois prix d achat", async () => {
    (prisma.produit.findMany as any).mockResolvedValue([
      { id: 1, quantite: 10, prixAchat: 1000 },
      { id: 2, quantite: 5, prixAchat: 2000 },
    ]);
    const valeur = await calculerValeurStock();
    expect(valeur).toBe(10 * 1000 + 5 * 2000);
  });
});

describe("recupererTopMarges", () => {
  it("trie par marge potentielle decroissante et limite a 5", async () => {
    const produits = Array.from({ length: 7 }, (_, i) => ({
      id: i,
      nom: `Produit ${i}`,
      quantite: 10,
      prixAchat: 100,
      prixVente: 100 + i * 50,
    }));
    (prisma.produit.findMany as any).mockResolvedValue(produits);

    const top = await recupererTopMarges();
    expect(top).toHaveLength(5);
    expect(top[0].nom).toBe("Produit 6");
  });
});

describe("genererAnalyseStockIA", () => {
  it("retourne l analyse structuree quand l IA repond un JSON valide", async () => {
    (prisma.produit.findMany as any).mockResolvedValue([]);
    (askGemmaSafe as any).mockResolvedValue({
      text: JSON.stringify({
        resume: "Stock sain",
        risques: [],
        opportunites: [],
        actions_prioritaires: [],
        confidence: 90,
      }),
      degraded: false,
    });

    const result = await genererAnalyseStockIA();
    expect(result.resume).toBe("Stock sain");
    expect(result.confidence).toBe(90);
  });

  it("retombe sur une reponse par defaut si l IA ne repond pas du JSON valide", async () => {
    (prisma.produit.findMany as any).mockResolvedValue([]);
    (askGemmaSafe as any).mockResolvedValue({
      text: "reponse non parsable",
      degraded: true,
    });

    const result = await genererAnalyseStockIA();
    expect(result.confidence).toBe(0);
    expect(result.degraded).toBe(true);
  });
});
