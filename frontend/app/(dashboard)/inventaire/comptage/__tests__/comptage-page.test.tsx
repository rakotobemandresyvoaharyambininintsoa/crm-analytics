// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useParams: () => ({ id: "5" }),
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("@/components/SearchBox", () => ({
  default: ({ value, onChange, placeholder }: any) => (
    <input
      aria-label={placeholder}
      value={value}
      onChange={(e: any) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  ),
}));

import Comptage from "../page";

afterEach(cleanup);

beforeEach(() => {
  vi.restoreAllMocks();
  vi.spyOn(window, "alert").mockImplementation(() => {});
});

const lignes = [
  { id: 1, nom: "Clavier", reference: "REF-1", stockSysteme: 10, codeBarre: "111" },
  { id: 2, nom: "Souris", reference: "REF-2", stockSysteme: 20, codeBarre: "222" },
];

function mockFetchSequence(responses: any[]) {
  let i = 0;
  global.fetch = vi.fn().mockImplementation(() => {
    const json = responses[Math.min(i, responses.length - 1)];
    i += 1;
    return Promise.resolve({ json: async () => json, ok: true });
  });
}

describe("Comptage", () => {
  it("affiche un etat de chargement puis les lignes de produits", async () => {
    mockFetchSequence([lignes]);
    render(<Comptage />);

    expect(screen.getByText(/Chargement du comptage/)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Clavier")).toBeInTheDocument();
    });
  });

  it("filtre les lignes selon la recherche", async () => {
    const user = userEvent.setup();
    mockFetchSequence([lignes]);
    render(<Comptage />);

    await waitFor(() => screen.getByText("Clavier"));

    await user.type(screen.getByPlaceholderText("Rechercher un produit..."), "Souris");

    expect(screen.getByText("Souris")).toBeInTheDocument();
    expect(screen.queryByText("Clavier")).not.toBeInTheDocument();
  });

  it("affiche un etat vide quand aucun produit ne correspond", async () => {
    const user = userEvent.setup();
    mockFetchSequence([lignes]);
    render(<Comptage />);

    await waitFor(() => screen.getByText("Clavier"));

    await user.type(screen.getByPlaceholderText("Rechercher un produit..."), "Inexistant");

    expect(screen.getByText(/Aucun produit ne correspond/)).toBeInTheDocument();
  });

  it("alerte quand le code scanne ne correspond a aucun produit", async () => {
    const user = userEvent.setup();
    mockFetchSequence([lignes]);
    render(<Comptage />);

    await waitFor(() => screen.getByText("Clavier"));

    const champScan = screen.getByPlaceholderText(/Scanner un code/);
    await user.type(champScan, "999{Enter}");

    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("Aucun produit"));
  });

  it("filtre la recherche quand un code scanne correspond a un produit", async () => {
    const user = userEvent.setup();
    mockFetchSequence([lignes]);
    render(<Comptage />);

    await waitFor(() => screen.getByText("Clavier"));

    const champScan = screen.getByPlaceholderText(/Scanner un code/);
    await user.type(champScan, "222{Enter}");

    expect(screen.getByText("Souris")).toBeInTheDocument();
    expect(screen.queryByText("Clavier")).not.toBeInTheDocument();
  });

  it("calcule et affiche l ecart quand une quantite comptee est saisie", async () => {
    const user = userEvent.setup();
    mockFetchSequence([lignes]);
    render(<Comptage />);

    await waitFor(() => screen.getByText("Clavier"));

    const champsCompte = screen.getAllByRole("spinbutton");
    await user.type(champsCompte[0], "12");

    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("enregistre le comptage et redirige vers la fiche inventaire", async () => {
    const user = userEvent.setup();
    mockFetchSequence([lignes, { ok: true }]);
    render(<Comptage />);

    await waitFor(() => screen.getByText("Clavier"));

    const champsCompte = screen.getAllByRole("spinbutton");
    await user.type(champsCompte[0], "10");

    await user.click(screen.getByText("Enregistrer le comptage"));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/inventaire/5");
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/inventaires/5/lignes",
      expect.objectContaining({ method: "PUT" })
    );
  });
});
