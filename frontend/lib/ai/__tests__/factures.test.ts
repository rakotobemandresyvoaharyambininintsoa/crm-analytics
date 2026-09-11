import { describe, it, expect, vi, beforeEach } from "vitest";
import { analyserRisquePaiement, analyserSituationFinanciere } from "../factures";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    facture: {
      findUnique: vi.fn(),
      count: vi.fn(),
      aggregate: vi.fn(),
    },
  },
}));

vi.mock("../fireworks", () => ({
  askGemmaSafe: vi.fn(),
}));

import { prisma } from "@/lib/prisma";
import { askGemmaSafe } from "../fireworks";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("analyserRisquePaiement", () => {
  it("leve une erreur si la facture est introuvable", async () => {
    (prisma.facture.findUnique as any).mockResolvedValue(null);
    await expect(analyserRisquePaiement(999)).rejects.toThrow("Facture introuvable");
  });

  it("calcule le contexte et retourne l analyse quand l IA repond un JSON valide", async () => {
    (prisma.facture.findUnique as any).mockResolvedValue({
      id: 1,
      numero: "F-001",
      montant: 50000,
      statut: "Retard",
      dateEcheance: new Date("2020-01-01"),
      client: {
        nom: "Rasoa",
        entreprise: "Rasoa SARL",
        factures: [
          { statut: "Retard", dateEcheance: new Date("2020-01-01") },
          { statut: "Payee", dateEcheance: new Date("2020-02-01") },
        ],
      },
    });

    (askGemmaSafe as any).mockResolvedValue({
      text: JSON.stringify({
        niveau_risque: "eleve",
        raison: "Retard important",
        action: "Relancer immediatement",
      }),
      degraded: false,
    });

    const result = await analyserRisquePaiement(1);

    expect(result.niveau_risque).toBe("eleve");
    expect(result.raison).toBe("Retard important");
    expect(result.degraded).toBe(false);
  });

  it("retombe sur un resultat par defaut si l IA ne repond pas du JSON valide", async () => {
    (prisma.facture.findUnique as any).mockResolvedValue({
      id: 2,
      numero: "F-002",
      montant: 10000,
      statut: "Brouillon",
      client: { nom: "Andry", factures: [] },
    });

    (askGemmaSafe as any).mockResolvedValue({
      text: "Reponse non structuree de l IA",
      degraded: true,
    });

    const result = await analyserRisquePaiement(2);

    expect(result.niveau_risque).toBe("moyen");
    expect(result.raison).toBe("Reponse non structuree de l IA");
    expect(result.action).toBe("Vérifier manuellement la facture et relancer le client.");
    expect(result.degraded).toBe(true);
  });
});

describe("analyserSituationFinanciere", () => {
  function mockCompteurs(total: number, payees: number, retard: number, montant: number) {
    (prisma.facture.count as any)
      .mockResolvedValueOnce(total)
      .mockResolvedValueOnce(payees)
      .mockResolvedValueOnce(retard);
    (prisma.facture.aggregate as any).mockResolvedValue({ _sum: { montant } });
  }

  it("calcule un niveau de risque faible quand le taux de retard est bas", async () => {
    mockCompteurs(100, 90, 5, 500000);
    (askGemmaSafe as any).mockResolvedValue({
      text: JSON.stringify({ resume: "Situation saine", risques: [], recommandations: [] }),
      degraded: false,
    });

    const result = await analyserSituationFinanciere();

    expect(result.niveauRisqueGlobal).toBe("faible");
    expect(result.indicateurs.total_factures).toBe(100);
    expect(result.indicateurs.montant_total).toBe(500000);
  });

  it("calcule un niveau de risque eleve quand le taux de retard depasse 25 pourcent", async () => {
    mockCompteurs(100, 50, 30, 800000);
    (askGemmaSafe as any).mockResolvedValue({
      text: JSON.stringify({ resume: "Attention", risques: ["Retards"], recommandations: ["Relancer"] }),
      degraded: false,
    });

    const result = await analyserSituationFinanciere();

    expect(result.niveauRisqueGlobal).toBe("eleve");
    expect(result.risques).toEqual(["Retards"]);
  });

  it("retombe sur un resume brut si l IA ne repond pas du JSON valide", async () => {
    mockCompteurs(10, 5, 1, 100000);
    (askGemmaSafe as any).mockResolvedValue({
      text: "Texte libre non JSON",
      degraded: true,
    });

    const result = await analyserSituationFinanciere();

    expect(result.resume).toBe("Texte libre non JSON");
    expect(result.risques).toEqual([]);
    expect(result.recommandations).toEqual([]);
  });
});
