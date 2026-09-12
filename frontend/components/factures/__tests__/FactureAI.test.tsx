// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import FactureAI from "../FactureAI";

afterEach(cleanup);

beforeEach(() => {
  vi.clearAllMocks();
});

function mockFetchOnce(json: any, ok = true) {
  global.fetch = vi.fn().mockResolvedValue({
    ok,
    json: async () => json,
  });
}

const dataSucces = {
  analyseFinance: {
    resume: "Situation stable",
    risques: ["Risque X"],
    recommandations: ["Recommandation X"],
    indicateurs: {
      total_factures: 20,
      factures_payees: 15,
      factures_en_retard: 5,
      montant_total: 1000000,
    },
    niveauRisqueGlobal: "moyen" as const,
  },
};

describe("FactureAI", () => {
  it("affiche un etat de chargement puis les donnees", async () => {
    mockFetchOnce(dataSucces);
    render(<FactureAI />);

    expect(screen.getByText(/Analyse des factures/)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Situation stable")).toBeInTheDocument();
    });
  });

  it("affiche le niveau de risque global", async () => {
    mockFetchOnce(dataSucces);
    render(<FactureAI />);

    await waitFor(() => {
      expect(screen.getByText(/Risque moyen/)).toBeInTheDocument();
    });
  });

  it("affiche les indicateurs chiffres", async () => {
    mockFetchOnce(dataSucces);
    render(<FactureAI />);

    await waitFor(() => {
      expect(screen.getByText(/Total factures: 20/)).toBeInTheDocument();
    });
    expect(screen.getByText(/En retard: 5/)).toBeInTheDocument();
  });

  it("affiche les risques et recommandations", async () => {
    mockFetchOnce(dataSucces);
    render(<FactureAI />);

    await waitFor(() => {
      expect(screen.getByText("Risque X")).toBeInTheDocument();
    });
    expect(screen.getByText("Recommandation X")).toBeInTheDocument();
  });

  it("affiche le bandeau degrade quand degraded est vrai", async () => {
    mockFetchOnce({
      analyseFinance: { ...dataSucces.analyseFinance, degraded: true },
    });
    render(<FactureAI />);

    await waitFor(() => {
      expect(screen.getByText(/temporairement indisponible/)).toBeInTheDocument();
    });
  });

  it("affiche un message d erreur quand l API echoue", async () => {
    mockFetchOnce({ error: "Erreur reseau" }, false);
    render(<FactureAI />);

    await waitFor(() => {
      expect(screen.getByText("Erreur reseau")).toBeInTheDocument();
    });
    expect(screen.getByText(/essayer/i)).toBeInTheDocument();
  });
});
