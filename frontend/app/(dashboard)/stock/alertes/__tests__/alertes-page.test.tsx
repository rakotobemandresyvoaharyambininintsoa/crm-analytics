// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import Alertes from "../page";

afterEach(cleanup);

beforeEach(() => {
  vi.restoreAllMocks();
});

function mockFetchOnce(json: any) {
  global.fetch = vi.fn().mockResolvedValue({ json: async () => json, ok: true });
}

describe("Alertes", () => {
  it("affiche uniquement les produits sous le seuil d alerte", async () => {
    mockFetchOnce([
      { id: 1, nom: "Clavier", quantite: 2, seuilAlerte: 10 },
      { id: 2, nom: "Souris", quantite: 50, seuilAlerte: 10 },
    ]);

    render(<Alertes />);

    await waitFor(() => {
      expect(screen.getByText("Clavier")).toBeInTheDocument();
    });
    expect(screen.queryByText("Souris")).not.toBeInTheDocument();
  });

  it("trie les alertes par quantite croissante", async () => {
    mockFetchOnce([
      { id: 1, nom: "Produit A", quantite: 5, seuilAlerte: 10 },
      { id: 2, nom: "Produit B", quantite: 1, seuilAlerte: 10 },
    ]);

    render(<Alertes />);

    await waitFor(() => {
      const titres = screen.getAllByRole("heading", { level: 2 });
      expect(titres[0]).toHaveTextContent("Produit B");
    });
  });

  it("affiche un message quand aucun stock n est faible", async () => {
    mockFetchOnce([{ id: 1, nom: "Clavier", quantite: 50, seuilAlerte: 10 }]);

    render(<Alertes />);

    await waitFor(() => {
      expect(screen.getByText("Aucun stock faible")).toBeInTheDocument();
    });
  });
});
