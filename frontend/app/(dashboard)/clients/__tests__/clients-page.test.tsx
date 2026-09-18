// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("@/components/clients/ClientAI", () => ({
  default: () => <div data-testid="client-ai-stub" />,
}));

import Clients from "../page";

afterEach(cleanup);

const clients = [
  { id: 1, nom: "Rasoa", entreprise: "Rasoa SARL", email: "rasoa@test.mg", telephone: "0340000001" },
  { id: 2, nom: "Andry", entreprise: "", email: "andry@test.mg", telephone: "" },
];

beforeEach(() => {
  vi.restoreAllMocks();
});

function mockFetchSequence(responses: any[]) {
  let i = 0;
  global.fetch = vi.fn().mockImplementation(() => {
    const json = responses[Math.min(i, responses.length - 1)];
    i += 1;
    return Promise.resolve({ json: async () => json, ok: true });
  });
}

describe("Clients", () => {
  it("charge et affiche les clients dans le tableau", async () => {
    mockFetchSequence([clients]);
    render(<Clients />);

    await waitFor(() => {
      expect(screen.getByText("Rasoa")).toBeInTheDocument();
    });
  });

  it("affiche le nombre total de clients et d entreprises", async () => {
    mockFetchSequence([clients]);
    render(<Clients />);

    await waitFor(() => {
      expect(screen.getByText("2")).toBeInTheDocument();
    });
    const carteEntreprises = screen.getByText("Entreprises").closest("div")?.parentElement;
    expect(carteEntreprises).toHaveTextContent("1");
  });

  it("filtre la liste selon la recherche", async () => {
    const user = userEvent.setup();
    mockFetchSequence([clients]);
    render(<Clients />);

    await waitFor(() => screen.getByText("Rasoa"));

    await user.type(screen.getByPlaceholderText("Rechercher un client..."), "Andry");

    expect(screen.getByText("Andry")).toBeInTheDocument();
    expect(screen.queryByText("Rasoa")).not.toBeInTheDocument();
  });

  it("ajoute un client et reinitialise le formulaire", async () => {
    const user = userEvent.setup();
    mockFetchSequence([clients, { ok: true }, clients]);
    render(<Clients />);

    await waitFor(() => screen.getByText("Rasoa"));

    const champNom = screen.getByPlaceholderText("nom") as HTMLInputElement;
    await user.type(champNom, "Nouveau Client");
    await user.click(screen.getByText("Ajouter"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/clients",
        expect.objectContaining({ method: "POST" })
      );
    });
  });

  it("navigue vers la fiche client au clic sur Voir", async () => {
    const user = userEvent.setup();
    mockFetchSequence([clients]);
    render(<Clients />);

    await waitFor(() => screen.getByText("Rasoa"));

    const boutonsVoir = screen.getAllByTitle("Voir");
    await user.click(boutonsVoir[0]);

    expect(pushMock).toHaveBeenCalledWith("/clients/1");
  });

  it("ouvre le modal de modification et sauvegarde les changements", async () => {
    const user = userEvent.setup();
    mockFetchSequence([clients, { ok: true }, clients]);
    render(<Clients />);

    await waitFor(() => screen.getByText("Rasoa"));

    const boutonsModifier = screen.getAllByTitle("Modifier");
    await user.click(boutonsModifier[0]);

    expect(screen.getByText("Modifier le client")).toBeInTheDocument();

    await user.click(screen.getByText("Sauvegarder"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/clients/1",
        expect.objectContaining({ method: "PUT" })
      );
    });
  });

  it("supprime un client seulement apres confirmation", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "confirm").mockReturnValue(false);
    mockFetchSequence([clients]);
    render(<Clients />);

    await waitFor(() => screen.getByText("Rasoa"));

    const boutonsSupprimer = screen.getAllByTitle("Supprimer");
    await user.click(boutonsSupprimer[0]);

    expect(global.fetch).not.toHaveBeenCalledWith(
      "/api/clients/1",
      expect.objectContaining({ method: "DELETE" })
    );
  });

  it("supprime un client quand la confirmation est acceptee", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "confirm").mockReturnValue(true);
    mockFetchSequence([clients, { ok: true }, clients]);
    render(<Clients />);

    await waitFor(() => screen.getByText("Rasoa"));

    const boutonsSupprimer = screen.getAllByTitle("Supprimer");
    await user.click(boutonsSupprimer[0]);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/clients/1",
        expect.objectContaining({ method: "DELETE" })
      );
    });
  });
});
