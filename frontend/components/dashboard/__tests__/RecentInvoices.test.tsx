// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RecentInvoices from "../RecentInvoices";

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

const facturePayee = {
  id: 1,
  client: "Rasoa Import",
  montant: 150000,
  statut: "PayÃ©e" as any,
  date: "2026-01-10",
};

const factureRetard = {
  id: 2,
  client: "Andry Textile",
  montant: 80000,
  statut: "Retard" as any,
  date: "2026-01-05",
};

describe("RecentInvoices", () => {
  it("affiche un message quand il n y a aucune facture", () => {
    render(<RecentInvoices invoices={[]} />);
    expect(screen.getByText("Aucune facture disponible")).toBeInTheDocument();
  });

  it("affiche les factures fournies avec leur client et montant", () => {
    render(<RecentInvoices invoices={[facturePayee]} />);
    expect(screen.getByText("Rasoa Import")).toBeInTheDocument();
  });

  it("n affiche pas de bouton de relance pour une facture payee", () => {
    render(<RecentInvoices invoices={[facturePayee]} />);
    expect(screen.queryByText(/relance/i)).not.toBeInTheDocument();
  });

  it("affiche un bouton de relance pour une facture en retard", () => {
    render(<RecentInvoices invoices={[factureRetard]} />);
    expect(screen.getByText(/relance/i)).toBeInTheDocument();
  });

  it("ouvre le panneau et affiche l email genere apres clic sur relance", async () => {
    const user = userEvent.setup();
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ email: "Merci de regulariser votre facture." }),
    }) as any;

    render(<RecentInvoices invoices={[factureRetard]} />);
    await user.click(screen.getByText(/relance/i));

    await waitFor(() => {
      expect(screen.getByText("Merci de regulariser votre facture.")).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/ai/actions/relance",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("copie le texte genere et affiche une confirmation", async () => {
    const user = userEvent.setup();
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ email: "Texte de relance." }),
    }) as any;

    render(<RecentInvoices invoices={[factureRetard]} />);
    await user.click(screen.getByText(/relance/i));
    await waitFor(() => screen.getByText("Copier le texte"));

    await user.click(screen.getByText("Copier le texte"));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("Texte de relance.");
  });

  it("ferme le panneau au clic sur le bouton fermer", async () => {
    const user = userEvent.setup();
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ email: "Texte de relance." }),
    }) as any;

    render(<RecentInvoices invoices={[factureRetard]} />);
    await user.click(screen.getByText(/relance/i));
    await waitFor(() => screen.getByText("Copier le texte"));

    const boutons = screen.getAllByRole("button");
    await user.click(boutons[1]);

    expect(screen.queryByText("Copier le texte")).not.toBeInTheDocument();
  });
});
