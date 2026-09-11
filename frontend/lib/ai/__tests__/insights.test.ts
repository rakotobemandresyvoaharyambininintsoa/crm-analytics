import { describe, it, expect, vi, beforeEach } from "vitest";
import { genererInsightsBruts, genererSyntheseIA, repondreQuestionCRM } from "../insights";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    client: { findMany: vi.fn(), count: vi.fn() },
    opportunite: { findMany: vi.fn(), count: vi.fn() },
    facture: { findMany: vi.fn(), count: vi.fn() },
    produit: { findMany: vi.fn() },
  },
}));

vi.mock("../fireworks", () => ({
  askGemma: vi.fn(),
  askGemmaSafe: vi.fn(),
}));

import { prisma } from "@/lib/prisma";
import { askGemmaSafe } from "../fireworks";

const JOUR_MS = 1000 * 60 * 60 * 24;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("genererInsightsBruts", () => {
  it("retourne un tableau vide quand il n y a aucune donnee", async () => {
    (prisma.client.findMany as any).mockResolvedValue([]);
    (prisma.opportunite.findMany as any).mockResolvedValue([]);
    (prisma.facture.findMany as any).mockResolvedValue([]);
    (prisma.produit.findMany as any).mockResolvedValue([]);

    const insights = await genererInsightsBruts();
    expect(insights).toEqual([]);
  });

  it("detecte les insights client, opportunite, facture, stock et correlation", async () => {
    (prisma.client.findMany as any)
      .mockResolvedValueOnce([
        { id: 1, nom: "ClientA", entreprise: null, score: 70, activites: [], opportunites: [{ montant: 500000 }] },
      ])
      .mockResolvedValueOnce([
        { nom: "ClientA", activites: [], factures: [{ montant: 80000 }] },
        { nom: "ClientB", activites: [], factures: [{ montant: 120000 }] },
      ]);

    (prisma.opportunite.findMany as any).mockResolvedValue([
      {
        id: 10,
        nom: "OppA",
        montant: 200000,
        statut: "Négociation",
        probabilite: 50,
        createdAt: new Date(Date.now() - 25 * JOUR_MS),
        client: { nom: "ClientA" },
        clientId: 1,
      },
    ]);

    (prisma.facture.findMany as any).mockResolvedValue([
      {
        id: 5,
        numero: "F-100",
        montant: 80000,
        statut: "Retard",
        dateEcheance: new Date(Date.now() - 10 * JOUR_MS),
        client: { nom: "ClientA" },
        clientId: 1,
      },
    ]);

    (prisma.produit.findMany as any).mockResolvedValue([
      { id: 7, nom: "ProduitA", quantite: 5, seuilAlerte: 10, mouvements: [{ type: "SORTIE", quantite: 30 }] },
    ]);

    const insights = await genererInsightsBruts();

    expect(insights[0].categorie).toBe("correlation");
    expect(insights.some((i) => i.categorie === "client")).toBe(true);
    expect(insights.some((i) => i.categorie === "opportunite")).toBe(true);
    expect(insights.some((i) => i.categorie === "facture")).toBe(true);
    expect(insights.some((i) => i.categorie === "stock")).toBe(true);
  });
});

describe("genererSyntheseIA", () => {
  it("retourne un message par defaut sans appeler l IA quand il n y a aucun insight", async () => {
    const result = await genererSyntheseIA([]);
    expect(result.degraded).toBe(false);
    expect(result.texte).toContain("Aucune alerte critique");
    expect(askGemmaSafe).not.toHaveBeenCalled();
  });

  it("appelle l IA et retourne sa synthese quand des insights existent", async () => {
    (askGemmaSafe as any).mockResolvedValue({ text: "Synthese generee", degraded: false });

    const insights = [
      {
        id: "x",
        categorie: "client" as const,
        severite: "critique" as const,
        titre: "Titre test",
        message: "Message test",
      },
    ];

    const result = await genererSyntheseIA(insights);
    expect(result.texte).toBe("Synthese generee");
    expect(askGemmaSafe).toHaveBeenCalled();
  });
});

describe("repondreQuestionCRM", () => {
  it("construit le contexte et retourne la reponse de l IA", async () => {
    (prisma.client.findMany as any).mockResolvedValue([]);
    (prisma.opportunite.findMany as any).mockResolvedValue([]);
    (prisma.facture.findMany as any).mockResolvedValue([]);
    (prisma.produit.findMany as any).mockResolvedValue([]);
    (prisma.client.count as any).mockResolvedValue(12);
    (prisma.opportunite.count as any).mockResolvedValue(3);
    (prisma.facture.count as any).mockResolvedValue(2);

    (askGemmaSafe as any).mockResolvedValue({ text: "Reponse IA", degraded: false });

    const result = await repondreQuestionCRM("Combien de clients avons-nous ?");
    expect(result.texte).toBe("Reponse IA");
    expect(askGemmaSafe).toHaveBeenCalled();
  });
});
