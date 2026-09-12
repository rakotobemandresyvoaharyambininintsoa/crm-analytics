// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ClientAI from "../ClientAI";

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
  score: 72,
  nombreClientsInactifs: 3,
  nouveauxClients: 5,
  clientsInactifs: [],
  topClients: [
    { id: 1, nom: "Rasoa", entreprise: "Rasoa SARL", chiffreAffaire: 500000, opportunites: 2 },
  ],
  analyseIA: {
    resume: "Portefeuille stable",
    risques: ["Risque A"],
    actions_prioritaires: ["Action A"],
    opportunites: ["Opp A"],
    confidence: 80,
  },
};

describe("ClientAI", () => {
  it("affiche un etat de chargement puis les donnees une fois recuperees", async () => {
    mockFetchOnce(dataSucces);
    render(<ClientAI />);

    expect(screen.getByText("Analyse clients IA...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("72/100")).toBeInTheDocument();
    });
  });

  it("affiche le statut Bon pour un score de 72", async () => {
    mockFetchOnce(dataSucces);
    render(<ClientAI />);

    await waitFor(() => {
      expect(screen.getByText("Bon")).toBeInTheDocument();
    });
  });

  it("affiche le resume et les listes de l analyse IA", async () => {
    mockFetchOnce(dataSucces);
    render(<ClientAI />);

    await waitFor(() => {
      expect(screen.getByText("Portefeuille stable")).toBeInTheDocument();
    });
    expect(screen.getByText("Risque A")).toBeInTheDocument();
    expect(screen.getByText("Action A")).toBeInTheDocument();
    expect(screen.getByText("Confiance : 80%")).toBeInTheDocument();
  });

  it("affiche le bandeau degrade quand analyseIA.degraded est vrai", async () => {
    mockFetchOnce({
      ...dataSucces,
      analyseIA: { ...dataSucces.analyseIA, degraded: true },
    });
    render(<ClientAI />);

    await waitFor(() => {
      expect(screen.getByText(/IA temporairement indisponible/)).toBeInTheDocument();
    });
  });

  it("affiche un message quand aucun top client n existe", async () => {
    mockFetchOnce({ ...dataSucces, topClients: [] });
    render(<ClientAI />);

    await waitFor(() => {
      expect(screen.getByText(/Aucun client avec facture pay/)).toBeInTheDocument();
    });
  });

  it("affiche une erreur et un bouton reessayer quand l API echoue", async () => {
    mockFetchOnce({ error: "Erreur serveur" }, false);
    render(<ClientAI />);

    await waitFor(() => {
      expect(screen.getByText("Impossible de charger l'analyse.")).toBeInTheDocument();
    });
    expect(screen.getByText("Erreur serveur")).toBeInTheDocument();
  });

  it("relance le chargement au clic sur Reessayer", async () => {
    mockFetchOnce({ error: "Erreur serveur" }, false);
    const user = userEvent.setup();
    render(<ClientAI />);

    await waitFor(() => {
      expect(screen.getByText("Impossible de charger l'analyse.")).toBeInTheDocument();
    });

    mockFetchOnce(dataSucces);
    await user.click(screen.getByText(/essayer/i));

    await waitFor(() => {
      expect(screen.getByText("72/100")).toBeInTheDocument();
    });
  });
});
