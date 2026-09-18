// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AICommandCenterPage from "../page";

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

function mockFetchSequence(responses: any[]) {
  let i = 0;
  global.fetch = vi.fn().mockImplementation(() => {
    const json = responses[Math.min(i, responses.length - 1)];
    i += 1;
    return Promise.resolve({ json: async () => json, ok: true });
  });
}

const insightsSucces = {
  insights: [
    {
      id: "client-1",
      categorie: "client",
      severite: "critique",
      titre: "Client sans contact",
      message: "45 jours sans contact",
      actionSuggeree: "Voir le diagnostic",
      actionType: "diagnostic-client",
      actionData: { clientId: 7 },
    },
  ],
  synthese: "Synthese du jour generee",
  syntheseDegraded: false,
};

describe("AICommandCenterPage", () => {
  it("affiche un etat de chargement puis la synthese IA", async () => {
    mockFetchSequence([insightsSucces]);
    render(<AICommandCenterPage />);

    expect(screen.getByText(/Analyse des donn/)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Synthese du jour generee")).toBeInTheDocument();
    });
  });

  it("affiche le bandeau degrade quand syntheseDegraded est vrai", async () => {
    mockFetchSequence([{ ...insightsSucces, syntheseDegraded: true }]);
    render(<AICommandCenterPage />);

    await waitFor(() => {
      expect(screen.getByText(/temporairement indisponible/)).toBeInTheDocument();
    });
  });

  it("affiche les insights standards avec leur titre", async () => {
    mockFetchSequence([insightsSucces]);
    render(<AICommandCenterPage />);

    await waitFor(() => {
      expect(screen.getByText("Client sans contact")).toBeInTheDocument();
    });
  });

  it("affiche un message quand il n y a aucune alerte", async () => {
    mockFetchSequence([{ insights: [], synthese: "Tout va bien", syntheseDegraded: false }]);
    render(<AICommandCenterPage />);

    await waitFor(() => {
      expect(screen.getByText(/tout est sous contr/)).toBeInTheDocument();
    });
  });

  it("declenche l action IA et affiche le contenu du panneau", async () => {
    const user = userEvent.setup();
    mockFetchSequence([
      insightsSucces,
      { diagnostic: "Diagnostic du client genere", degraded: false },
    ]);

    render(<AICommandCenterPage />);

    await waitFor(() => {
      expect(screen.getByText("Voir le diagnostic")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Voir le diagnostic"));

    await waitFor(() => {
      expect(screen.getByText("Diagnostic du client genere")).toBeInTheDocument();
    });
  });

  it("envoie une question au chat et affiche la reponse", async () => {
    const user = userEvent.setup();
    mockFetchSequence([
      { insights: [], synthese: "Rien a signaler", syntheseDegraded: false },
      { reponse: "Vous avez 12 clients actifs", degraded: false },
    ]);

    render(<AICommandCenterPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Posez une question/)).toBeInTheDocument();
    });

    const champ = screen.getByPlaceholderText(/Posez une question/);
    await user.type(champ, "Combien de clients actifs ?");

    const boutons = screen.getAllByRole("button");
    const boutonEnvoyer = boutons[boutons.length - 1];
    await user.click(boutonEnvoyer);

    expect(screen.getByText("Combien de clients actifs ?")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Vous avez 12 clients actifs")).toBeInTheDocument();
    });
  });

  it("copie le contenu du panneau au clic sur Copier", async () => {
    const user = userEvent.setup();
    mockFetchSequence([
      insightsSucces,
      { diagnostic: "Texte a copier", degraded: false },
    ]);

    render(<AICommandCenterPage />);

    await waitFor(() => screen.getByText("Voir le diagnostic"));
    await user.click(screen.getByText("Voir le diagnostic"));

    await waitFor(() => screen.getByText("Copier le texte"));
    await user.click(screen.getByText("Copier le texte"));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("Texte a copier");
  });
});
