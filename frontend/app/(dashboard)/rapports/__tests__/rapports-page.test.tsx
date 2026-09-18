// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";

vi.mock("next/dynamic", () => ({
  default: () => {
    return function EvolutionChartStub() {
      return <div data-testid="evolution-chart-stub" />;
    };
  },
}));

import Rapports from "../page";

afterEach(cleanup);

beforeEach(() => {
  vi.restoreAllMocks();
});

const rapportSucces = {
  chiffreAffaires: 5000000,
  topClients: [
    { nom: "Rasoa", ca: 2000000 },
    { nom: "Andry", ca: 1500000 },
  ],
  produits: [
    { id: 1, nom: "Clavier", quantite: 20 },
    { id: 2, nom: "Souris", quantite: 5 },
  ],
};

function mockFetchOnce(json: any) {
  global.fetch = vi.fn().mockResolvedValue({ json: async () => json, ok: true });
}

describe("Rapports", () => {
  it("affiche le chiffre d affaires une fois charge", async () => {
    mockFetchOnce(rapportSucces);
    render(<Rapports />);

    await waitFor(() => {
      expect(
      screen.getByText((_, el) => el?.textContent?.replace(/[^0-9]/g, "") === "5000000" && el?.tagName === "H2" && el?.textContent?.includes("Ar") === true)
    ).toBeInTheDocument();
    });
  });

  it("affiche le nombre de produits et de clients", async () => {
    mockFetchOnce(rapportSucces);
    render(<Rapports />);

    await waitFor(() => {
      expect(screen.getAllByText("2").length).toBeGreaterThan(0);
    });
  });

  it("affiche la liste des top clients avec leur chiffre d affaires", async () => {
    mockFetchOnce(rapportSucces);
    render(<Rapports />);

    await waitFor(() => {
      expect(screen.getByText("Rasoa")).toBeInTheDocument();
    });
    expect(
      screen.getByText((_, el) => el?.textContent?.replace(/[^0-9]/g, "") === "2000000" && el?.tagName === "SPAN" && el?.textContent?.includes("Ar") === true)
    ).toBeInTheDocument();
  });

  it("affiche l etat du stock par produit", async () => {
    mockFetchOnce(rapportSucces);
    render(<Rapports />);

    await waitFor(() => {
      expect(screen.getByText("Clavier")).toBeInTheDocument();
    });
    expect(screen.getByText("Souris")).toBeInTheDocument();
  });

  it("affiche les boutons d export Excel et PDF", async () => {
    mockFetchOnce(rapportSucces);
    render(<Rapports />);

    await waitFor(() => {
      expect(screen.getByText("Export Excel")).toBeInTheDocument();
    });
    expect(screen.getByText("Export PDF")).toBeInTheDocument();
  });

  it("affiche le composant graphique d evolution", async () => {
    mockFetchOnce(rapportSucces);
    render(<Rapports />);

    await waitFor(() => {
      expect(screen.getByTestId("evolution-chart-stub")).toBeInTheDocument();
    });
  });
});
