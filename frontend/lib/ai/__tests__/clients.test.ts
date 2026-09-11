import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  calculerClientHealthScore,
  recupererClientsInactifs,
  compterNouveauxClients,
  recupererTopClients,
  genererAnalyseClientsIA,
} from "../clients";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    client: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

vi.mock("../fireworks", () => ({
  askGemmaSafe: vi.fn(),
}));

import { prisma } from "@/lib/prisma";
import { askGemmaSafe } from "../fireworks";

const JOUR_MS = 1000 * 60 * 60 * 24;
const ancienneDate = new Date(Date.now() - 60 * JOUR_MS);
const recenteDate = new Date(Date.now() - 2 * JOUR_MS);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("calculerClientHealthScore", () => {
  it("retourne 100 quand il n y a aucun client", async () => {
    (prisma.client.findMany as any).mockResolvedValue([]);
    const score = await calculerClientHealthScore();
    expect(score).toBe(100);
  });

  it("baisse le score pour les clients inactifs et sans facture", async () => {
    (prisma.client.findMany as any).mockResolvedValue([
      {
        id: 1,
        nom: "Client inactif",
        createdAt: ancienneDate,
        activites: [],
        factures: [],
        opportunites: [],
      },
      {
        id: 2,
        nom: "Client actif",
        createdAt: recenteDate,
        activites: [{ date: recenteDate }],
        factures: [{ montant: 1000, statut: "Payée" }],
        opportunites: [],
      },
    ]);

    const score = await calculerClientHealthScore();
    expect(score).toBeLessThan(100);
    expect(score).toBeGreaterThanOrEqual(0);
  });
});

describe("recupererClientsInactifs", () => {
  it("ne retourne que les clients inactifs depuis plus de 30 jours", async () => {
    (prisma.client.findMany as any).mockResolvedValue([
      { id: 1, nom: "Inactif", createdAt: ancienneDate, activites: [], factures: [], opportunites: [] },
      { id: 2, nom: "Actif", createdAt: recenteDate, activites: [{ date: recenteDate }], factures: [], opportunites: [] },
    ]);

    const inactifs = await recupererClientsInactifs();
    expect(inactifs).toHaveLength(1);
    expect(inactifs[0].nom).toBe("Inactif");
  });

  it("ne considere pas un client recemment cree comme inactif faute d activite", async () => {
    (prisma.client.findMany as any).mockResolvedValue([
      { id: 3, nom: "Nouveau", createdAt: recenteDate, activites: [], factures: [], opportunites: [] },
    ]);

    const inactifs = await recupererClientsInactifs();
    expect(inactifs).toHaveLength(0);
  });
});

describe("compterNouveauxClients", () => {
  it("delegue le comptage a prisma avec un filtre sur 30 jours", async () => {
    (prisma.client.count as any).mockResolvedValue(7);
    const total = await compterNouveauxClients();
    expect(total).toBe(7);
    expect(prisma.client.count).toHaveBeenCalledWith(
      expect.objectContaining({ where: { createdAt: expect.any(Object) } })
    );
  });
});

describe("recupererTopClients", () => {
  it("ne compte que les factures payees dans le chiffre d affaires et trie par CA decroissant", async () => {
    (prisma.client.findMany as any).mockResolvedValue([
      {
        id: 1,
        nom: "Petit CA",
        factures: [{ montant: 1000, statut: "Payée" }],
        opportunites: [],
      },
      {
        id: 2,
        nom: "Gros CA",
        factures: [
          { montant: 5000, statut: "Payée" },
          { montant: 9000, statut: "Retard" },
        ],
        opportunites: [1, 2],
      },
    ]);

    const top = await recupererTopClients();
    expect(top[0].nom).toBe("Gros CA");
    expect(top[0].chiffreAffaire).toBe(5000);
    expect(top[1].chiffreAffaire).toBe(1000);
  });

  it("limite le resultat a 5 clients maximum", async () => {
    const clients = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      nom: `Client ${i}`,
      factures: [{ montant: i * 100, statut: "Payée" }],
      opportunites: [],
    }));
    (prisma.client.findMany as any).mockResolvedValue(clients);

    const top = await recupererTopClients();
    expect(top).toHaveLength(5);
  });
});

describe("genererAnalyseClientsIA", () => {
  it("retourne l analyse structuree quand l IA repond un JSON valide", async () => {
    (prisma.client.findMany as any).mockResolvedValue([]);
    (prisma.client.count as any).mockResolvedValue(0);
    (askGemmaSafe as any).mockResolvedValue({
      text: JSON.stringify({
        resume: "Portefeuille stable",
        risques: [],
        actions_prioritaires: [],
        opportunites: [],
        confidence: 80,
      }),
      degraded: false,
    });

    const result = await genererAnalyseClientsIA();
    expect(result.resume).toBe("Portefeuille stable");
    expect(result.confidence).toBe(80);
  });

  it("retombe sur une reponse par defaut si l IA ne repond pas du JSON valide", async () => {
    (prisma.client.findMany as any).mockResolvedValue([]);
    (prisma.client.count as any).mockResolvedValue(0);
    (askGemmaSafe as any).mockResolvedValue({
      text: "```json\ntexte cassé non parsable",
      degraded: true,
    });

    const result = await genererAnalyseClientsIA();
    expect(result.confidence).toBe(0);
    expect(result.risques).toEqual([]);
    expect(result.degraded).toBe(true);
  });
});
