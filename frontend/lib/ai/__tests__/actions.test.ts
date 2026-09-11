import { describe, it, expect, vi, beforeEach } from "vitest";
import { genererEmailRelance, genererDiagnosticClient } from "../actions";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    facture: { findUnique: vi.fn() },
    client: { findUnique: vi.fn() },
  },
}));

vi.mock("../fireworks", () => ({
  askGemmaSafe: vi.fn(),
}));

import { prisma } from "@/lib/prisma";
import { askGemmaSafe } from "../fireworks";

const JOUR_MS = 1000 * 60 * 60 * 24;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("genererEmailRelance", () => {
  it("leve une erreur si la facture est introuvable", async () => {
    (prisma.facture.findUnique as any).mockResolvedValue(null);
    await expect(genererEmailRelance(999)).rejects.toThrow("Facture introuvable");
  });

  it("genere un email avec un ton ferme quand le retard depasse 30 jours", async () => {
    (prisma.facture.findUnique as any).mockResolvedValue({
      id: 1,
      numero: "F-100",
      montant: 150000,
      dateEcheance: new Date(Date.now() - 40 * JOUR_MS),
      client: { nom: "Rasoa" },
    });

    (askGemmaSafe as any).mockResolvedValue({ text: "Email genere", degraded: false });

    const result = await genererEmailRelance(1);

    expect(result.texte).toBe("Email genere");
    expect(result.degraded).toBe(false);

    const appelArgs = (askGemmaSafe as any).mock.calls[0][0];
    const contenuUser = appelArgs.find((m: any) => m.role === "user").content;
    expect(contenuUser).toContain("ferme");
  });

  it("genere un email avec un ton courtois quand le retard est recent", async () => {
    (prisma.facture.findUnique as any).mockResolvedValue({
      id: 2,
      numero: "F-101",
      montant: 50000,
      dateEcheance: new Date(Date.now() - 5 * JOUR_MS),
      client: { nom: "Andry" },
    });

    (askGemmaSafe as any).mockResolvedValue({ text: "Email courtois", degraded: false });

    await genererEmailRelance(2);

    const appelArgs = (askGemmaSafe as any).mock.calls[0][0];
    const contenuUser = appelArgs.find((m: any) => m.role === "user").content;
    expect(contenuUser).toContain("courtois");
  });
});

describe("genererDiagnosticClient", () => {
  it("leve une erreur si le client est introuvable", async () => {
    (prisma.client.findUnique as any).mockResolvedValue(null);
    await expect(genererDiagnosticClient(999)).rejects.toThrow("Client introuvable");
  });

  it("construit le contexte avec opportunites ouvertes et factures impayees", async () => {
    (prisma.client.findUnique as any).mockResolvedValue({
      id: 1,
      nom: "Rasoa",
      entreprise: "Rasoa SARL",
      statut: "Actif",
      score: 80,
      secteur: "Commerce",
      activites: [
        { type: "Appel", titre: "Suivi", date: new Date(), statut: "Terminé" },
      ],
      opportunites: [
        { nom: "OppA", statut: "Négociation", montant: 300000, probabilite: 60 },
        { nom: "OppB", statut: "Gagnée", montant: 100000, probabilite: 100 },
      ],
      factures: [
        { numero: "F-1", statut: "Retard", montant: 20000 },
        { numero: "F-2", statut: "Payée", montant: 15000 },
      ],
    });

    (askGemmaSafe as any).mockResolvedValue({ text: "Diagnostic genere", degraded: false });

    const result = await genererDiagnosticClient(1);

    expect(result.texte).toBe("Diagnostic genere");

    const appelArgs = (askGemmaSafe as any).mock.calls[0][0];
    const contenuUser = appelArgs.find((m: any) => m.role === "user").content;

    expect(contenuUser).toContain("Opportunités ouvertes: 1");
    expect(contenuUser).toContain("Factures impayées: 1");
    expect(contenuUser).not.toContain("OppB");
  });
});
