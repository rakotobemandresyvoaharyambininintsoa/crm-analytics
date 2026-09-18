// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";

vi.mock("recharts", () => {
  const Stub = ({ children }: any) => <div>{children}</div>;
  return {
    BarChart: Stub,
    Bar: () => null,
    XAxis: () => null,
    YAxis: () => null,
    Tooltip: () => null,
    ResponsiveContainer: Stub,
    CartesianGrid: () => null,
    PieChart: Stub,
    Pie: () => null,
    Cell: () => null,
  };
});

import Rapports from "../page";

afterEach(cleanup);

beforeEach(() => {
  vi.restoreAllMocks();
});

function mockFetchOnce(json: any) {
  global.fetch = vi.fn().mockResolvedValue({ json: async () => json });
}

function parNombre(nombre: string, suffixe = "") {
  return (_: string, el: Element | null) =>
    (el?.textContent?.replace(/[^0-9]/g, "") ?? "") === nombre &&
    (suffixe === "" || Boolean(el?.textContent?.includes(suffixe))) &&
    el?.tagName === "H2";
}

const rapportVide = {
  valeurPertes: 0,
  valeurGains: 0,
  tauxPrecision: 0,
  evolution: [],
  repartitionEcarts: [],
  performanceEquipes: [],
};

const rapportComplet = {
  valeurPertes: 150000,
  valeurGains: 80000,
  tauxPrecision: 92,
  evolution: [{ mois: "Janvier", ecart: 5 }],
  repartitionEcarts: [{ label: "Perte", valeur: 10 }],
  performanceEquipes: [{ nom: "Equipe A", precision: 95 }],
};

describe("Rapports (inventaire)", () => {
  it("affiche un etat de chargement puis les donnees", async () => {
    mockFetchOnce(rapportComplet);
    render(<Rapports />);

    expect(screen.getByText(/Chargement des rapports/)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(parNombre("150000", "Ar"))).toBeInTheDocument();
    });
  });

  it("affiche le taux de precision", async () => {
    mockFetchOnce(rapportComplet);
    render(<Rapports />);

    await waitFor(() => {
      expect(screen.getByText("92 %")).toBeInTheDocument();
    });
  });

  it("affiche des etats vides quand il n y a aucune donnee", async () => {
    mockFetchOnce(rapportVide);
    render(<Rapports />);

    await waitFor(() => {
      expect(screen.getAllByText("Aucune donnÃ©e disponible").length).toBeGreaterThan(0);
    });
  });

  it("affiche la performance des equipes quand des donnees existent", async () => {
    mockFetchOnce(rapportComplet);
    render(<Rapports />);

    await waitFor(() => {
      expect(screen.getByText("Equipe A")).toBeInTheDocument();
    });
    expect(screen.getByText("95%")).toBeInTheDocument();
  });

  it("affiche les boutons d export", async () => {
    mockFetchOnce(rapportComplet);
    render(<Rapports />);

    await waitFor(() => {
      expect(screen.getByText("Excel")).toBeInTheDocument();
    });
    expect(screen.getByText("PDF")).toBeInTheDocument();
    expect(screen.getByText("CSV")).toBeInTheDocument();
  });
});
