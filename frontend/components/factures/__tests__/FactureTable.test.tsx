// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { cleanup } from "@testing-library/react";
import FactureTable from "../FactureTable";

vi.mock("@/components/EmptyState", () => ({
  default: ({ titre }: { titre: string }) => <div>{titre}</div>,
}));

vi.mock("@/components/Pagination", () => ({
  default: () => <div data-testid="pagination" />,
}));

const facturePayee = {
  id: 1,
  numero: "F-2026-001",
  client: { nom: "Rasoa Import" },
  montant: 150000,
  statut: "Payée",
};

const factureRetard = {
  id: 2,
  numero: "F-2026-002",
  client: { nom: "Andry Textile" },
  montant: 80000,
  statut: "Retard",
};

afterEach(cleanup);

beforeEach(() => {
  vi.restoreAllMocks();
  if (!navigator.clipboard) {
    Object.defineProperty(navigator, "clipboard", {
      value: {},
      configurable: true,
      writable: true,
    });
  }
  navigator.clipboard.writeText = vi.fn().mockResolvedValue(undefined);
});

describe("FactureTable", () => {
  it("affiche un état vide quand il n'y a aucune facture", () => {
    render(<FactureTable factures={[]} />);
    expect(screen.getByText("Aucune facture trouvée")).toBeInTheDocument();
  });

  it("affiche les factures avec client et montant formaté", () => {
    render(<FactureTable factures={[facturePayee]} />);
    expect(screen.getByText("F-2026-001")).toBeInTheDocument();
    expect(screen.getByText("Rasoa Import")).toBeInTheDocument();
    expect(
      screen.getByText((_, element) => element?.textContent === "150,000 Ar")
    ).toBeInTheDocument();
  });

  it("n'affiche pas le bouton Relance IA pour une facture payée", () => {
    render(<FactureTable factures={[facturePayee]} />);
    expect(screen.queryByText("Relance IA")).not.toBeInTheDocument();
  });

  it("affiche le bouton Relance IA uniquement pour une facture en retard", () => {
    render(<FactureTable factures={[factureRetard]} />);
    expect(screen.getByText("Relance IA")).toBeInTheDocument();
  });

  it("ouvre le panneau et affiche l'email généré après clic sur Relance IA", async () => {
    const user = userEvent.setup();
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ email: "Bonjour, merci de régulariser votre facture." }),
    }) as any;

    render(<FactureTable factures={[factureRetard]} />);
    await user.click(screen.getByText("Relance IA"));

    await waitFor(() => {
      expect(
        screen.getByText("Bonjour, merci de régulariser votre facture.")
      ).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/ai/actions/relance",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("copie le texte et affiche une confirmation temporaire", async () => {
    const user = userEvent.setup();
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ email: "Texte de relance." }),
    }) as any;

    render(<FactureTable factures={[factureRetard]} />);
    await user.click(screen.getByText("Relance IA"));
    await waitFor(() => screen.getByText("Copier le texte"));

    await user.click(screen.getByText("Copier le texte"));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("Texte de relance.");
    expect(screen.getByText("Copié !")).toBeInTheDocument();
  });
});
