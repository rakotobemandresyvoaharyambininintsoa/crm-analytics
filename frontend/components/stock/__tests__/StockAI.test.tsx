// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import StockAI from "../StockAI";

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
  healthScore: 85,
  produitsCritiques: [{ id: 1, nom: "Clavier", quantite: 2 }],
  produitsDormants: [],
  valeurStock: 2500000,
  analyse: {
    resume: "Stock globalement sain",
    risques: ["Risque stock"],
    opportunites: ["Opportunite stock"],
    actions_prioritaires: ["Reapprovisionner"],
    confidence: 75,
  },
};

describe("StockAI", () => {
  it("affiche un etat de chargement puis les donnees", async () => {
    mockFetchOnce(dataSucces);
    render(<StockAI />);

    expect(screen.getByText(/Analyse IA du stock/)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("85/100")).toBeInTheDocument();
    });
  });

  it("affiche le nombre de produits critiques et dormants", async () => {
    mockFetchOnce(dataSucces);
    render(<StockAI />);

    await waitFor(() => {
      expect(screen.getByText("Produits critiques")).toBeInTheDocument();
    });
  });

  it("affiche le resume et les listes de l analyse", async () => {
    mockFetchOnce(dataSucces);
    render(<StockAI />);

    await waitFor(() => {
      expect(screen.getByText("Stock globalement sain")).toBeInTheDocument();
    });
    expect(screen.getByText("Risque stock")).toBeInTheDocument();
    expect(screen.getByText("Reapprovisionner")).toBeInTheDocument();
  });

  it("affiche le bandeau degrade quand degraded est vrai", async () => {
    mockFetchOnce({
      ...dataSucces,
      analyse: { ...dataSucces.analyse, degraded: true },
    });
    render(<StockAI />);

    await waitFor(() => {
      expect(screen.getByText(/temporairement indisponible/)).toBeInTheDocument();
    });
  });

  it("affiche un message d erreur quand l API echoue", async () => {
    mockFetchOnce({ error: "Erreur stock" }, false);
    render(<StockAI />);

    await waitFor(() => {
      expect(screen.getByText("Erreur stock")).toBeInTheDocument();
    });
    expect(screen.getByText(/essayer/i)).toBeInTheDocument();
  });
});
